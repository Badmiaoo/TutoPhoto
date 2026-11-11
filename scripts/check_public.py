#!/usr/bin/env python3
"""Vérifie qu'aucune information à ne pas publier n'entre dans le dépôt public.

Usage : python3 scripts/check_public.py [--commits all|BASE..HEAD]
        python3 scripts/check_public.py --env NOM [--env NOM…]

Contrôles, tous bloquants :
- fichiers suivis par git : clés privées, jetons d'API aux formats connus, mots de passe ou secrets écrits
  en clair, adresses électroniques (hors adresses « noreply » et domaines d'exemple), numéros de téléphone,
  liens vers des ressources privées (Claude, Google Docs et Drive, Dropbox, Notion), chemins locaux
  qui révèlent un nom d'utilisateur ;
- commits (avec --commits) : adresses des auteurs et des committers, qui doivent être des adresses
  « noreply », et messages, soumis aux mêmes contrôles que les fichiers. Seule exception : les commits
  listés dans scripts/check_public_historique.txt, publiés avec un lien vers une session Claude dans
  leur message, tolérés pour ce seul problème (fuite signalée, historique non réécrit) ;
- textes passés par variables d'environnement (avec --env, sans les fichiers ni les commits) : le titre et la
  description d'une pull request, contrôlés par le workflow .github/workflows/description.yml. Ils ne sont pas
  dans git ; l'outil GitHub de Claude y met un lien de session à la création (docs/publication.md).

Les secrets dans tout l'historique sont aussi cherchés par gitleaks, dans la CI.
Les valeurs trouvées ne sont jamais affichées en entier.
"""
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Adresses autorisées : uniquement des adresses « noreply » et des domaines réservés aux exemples.
ALLOWED_EMAIL = re.compile(
    r"^(noreply@anthropic\.com|noreply@github\.com|[0-9]+\+[A-Za-z0-9-]+(\[bot\])?@users\.noreply\.github\.com"
    r"|[^@]+@(example\.(com|org|net)|[^@]+\.(invalid|example|test)))$",
    re.IGNORECASE,
)

PRIVATE_LINK = "lien vers une ressource privée"

PATTERNS = [
    ("clé privée", re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----")),
    ("jeton GitHub", re.compile(r"\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b")),
    ("clé AWS", re.compile(r"\b(AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("clé Google", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("jeton Slack", re.compile(r"\bxox[abposr]-[A-Za-z0-9-]{10,}\b")),
    ("clé Anthropic ou OpenAI", re.compile(r"\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}\b")),
    ("clé Stripe", re.compile(r"\b(sk|rk)_live_[0-9A-Za-z]{20,}\b")),
    ("jeton JWT", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b")),
    ("secret écrit en clair", re.compile(
        r"(?i)\b(password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|mot[_ ]de[_ ]passe)"
        r"\s*[:=]\s*[\"'][^\"'\s]{8,}[\"']")),
    ("numéro de téléphone", re.compile(r"(?<![\w.+-])(?:\+33[\s.]?|0)[1-9](?:[\s.-]?\d{2}){4}(?![\w-])")),
    ("numéro de téléphone international", re.compile(r"(?<![\w.])\+\d{1,3}[\s.-]?\(?\d{1,4}\)?(?:[\s.-]?\d{2,4}){2,4}(?![\w.])")),
    (PRIVATE_LINK, re.compile(
        r"https?://(claude\.ai/(artifact|chat|project|share)/|claude\.ai/code/(session_|artifact/)"
        r"|docs\.google\.com/|drive\.google\.com/"
        r"|(www\.)?dropbox\.com/(s|sh|scl)/|(www\.)?notion\.(so|site)/)\S*")),
    ("chemin local avec nom d'utilisateur", re.compile(
        r"(?:/Users/|/home/(?!user\b|runner\b)|[A-Za-z]:\\Users\\)[A-Za-z0-9._-]+")),
]
EMAIL = re.compile(r"[A-Za-z0-9._%+\[\]-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def redact(value):
    return value[:4] + "…" if len(value) > 4 else "…"


def tracked_files():
    out = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return [ROOT / p for p in out.split("\0") if p]


HISTORY_FILE = ROOT / "scripts" / "check_public_historique.txt"


def known_history():
    """Commits publiés avec un lien de session Claude dans leur message (fuite signalée le 8 novembre 2026)."""
    if not HISTORY_FILE.is_file():
        return set()
    lines = HISTORY_FILE.read_text(encoding="utf-8").splitlines()
    return {l.strip() for l in lines if l.strip() and not l.startswith("#")}


def scan_text(label, text, problems, skip=()):
    for n, line in enumerate(text.splitlines(), 1):
        for kind, pattern in PATTERNS:
            if kind in skip:
                continue
            for m in pattern.finditer(line):
                problems.append(f"{label}:{n} : {kind} ({redact(m.group(0))})")
        for m in EMAIL.finditer(line):
            if not ALLOWED_EMAIL.match(m.group(0)):
                problems.append(f"{label}:{n} : adresse électronique ({redact(m.group(0))})")


def scan_files(problems):
    count = 0
    for path in tracked_files():
        if not path.is_file():
            continue
        data = path.read_bytes()
        if b"\0" in data[:8000]:
            continue  # fichier binaire
        count += 1
        scan_text(path.relative_to(ROOT).as_posix(), data.decode("utf-8", errors="replace"), problems)
    return count


def scan_commits(spec, problems):
    # -z : commits séparés par un octet nul ; première ligne : empreinte, auteur, committer ; puis le message.
    args = ["git", "log", "-z", "--format=%H%x09%ae%x09%ce%n%B"]
    args += ["--all"] if spec == "all" else [spec]
    out = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=True).stdout
    records = [r for r in out.split("\0") if r.strip()]
    known = known_history()
    for record in records:
        header, _, message = record.partition("\n")
        sha, author, committer = header.split("\t")
        for role, email in (("de l'auteur", author), ("du committer", committer)):
            if not ALLOWED_EMAIL.match(email):
                problems.append(f"commit {sha[:7]} : adresse {role} non autorisée ({redact(email)})")
        skip = (PRIVATE_LINK,) if sha in known else ()
        scan_text(f"commit {sha[:7]} (message)", message, problems, skip)
    return len(records)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--commits", help="« all », ou une plage BASE..HEAD, pour contrôler les adresses des commits")
    parser.add_argument("--env", action="append", metavar="NOM",
                        help="variable d'environnement dont le texte est contrôlé seul (répétable)")
    args = parser.parse_args()
    problems = []
    if args.env:
        for name in args.env:
            scan_text(name, os.environ.get(name, ""), problems)
        for p in problems:
            print(f"ERREUR : {p}")
        print(f"{len(args.env)} texte(s) contrôlé(s) : {len(problems)} problème(s)")
        return 1 if problems else 0
    files = scan_files(problems)
    commits = scan_commits(args.commits, problems) if args.commits else 0
    for p in problems:
        print(f"ERREUR : {p}")
    summary = f"{files} fichier(s) texte" + (f", {commits} commit(s)" if args.commits else "")
    print(f"{summary} contrôlé(s) : {len(problems)} problème(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
