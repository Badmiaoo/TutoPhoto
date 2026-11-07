#!/usr/bin/env python3
"""Vérifie qu'aucune information à ne pas publier n'entre dans le dépôt public.

Usage : python3 scripts/check_public.py [--commits all|BASE..HEAD]

Contrôles, tous bloquants :
- fichiers suivis par git : clés privées, jetons d'API aux formats connus, mots de passe ou secrets écrits
  en clair, adresses électroniques (hors adresses « noreply » et domaines d'exemple), numéros de téléphone,
  liens vers des ressources privées (Claude, Google Docs et Drive, Dropbox, Notion), chemins locaux
  qui révèlent un nom d'utilisateur ;
- métadonnées des commits (avec --commits) : adresses des auteurs et des committers, qui doivent être
  des adresses « noreply ».

Les secrets dans tout l'historique sont aussi cherchés par gitleaks, dans la CI.
Les valeurs trouvées ne sont jamais affichées en entier.
"""
import argparse
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
    ("lien vers une ressource privée", re.compile(
        r"https?://(claude\.ai/(artifact|chat|project|share)/|docs\.google\.com/|drive\.google\.com/"
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


def scan_text(label, text, problems):
    for n, line in enumerate(text.splitlines(), 1):
        for kind, pattern in PATTERNS:
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
    args = ["git", "log", "--format=%H%x09%ae%x09%ce"]
    args += ["--all"] if spec == "all" else [spec]
    out = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=True).stdout
    lines = [l for l in out.splitlines() if l]
    for line in lines:
        sha, author, committer = line.split("\t")
        for role, email in (("de l'auteur", author), ("du committer", committer)):
            if not ALLOWED_EMAIL.match(email):
                problems.append(f"commit {sha[:7]} : adresse {role} non autorisée ({redact(email)})")
    return len(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--commits", help="« all », ou une plage BASE..HEAD, pour contrôler les adresses des commits")
    args = parser.parse_args()
    problems = []
    files = scan_files(problems)
    commits = scan_commits(args.commits, problems) if args.commits else 0
    for p in problems:
        print(f"ERREUR : {p}")
    summary = f"{files} fichier(s) texte" + (f", {commits} commit(s)" if args.commits else "")
    print(f"{summary} contrôlé(s) : {len(problems)} problème(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
