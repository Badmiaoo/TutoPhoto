#!/usr/bin/env python3
"""Vérifie qu'aucune information à ne pas publier n'entre dans le dépôt public.

Usage : python3 scripts/check_public.py [--commits all|BASE..HEAD]
        python3 scripts/check_public.py --pull-request FICHIER

Contrôles, tous bloquants :
- fichiers suivis par git : le chemin de chacun, et le contenu des fichiers de texte : clés privées, jetons d'API aux
  formats connus, mots de passe ou secrets écrits en clair, adresses électroniques (hors adresses « noreply » et
  domaines d'exemple), numéros de téléphone, liens vers des ressources privées (Claude, Google Docs et Drive, Dropbox,
  Notion) et identifiants de session Claude écrits seuls, chemins locaux qui révèlent un nom d'utilisateur ;
- commits (avec --commits) : noms des auteurs et des committers, messages, lignes ajoutées par chaque commit et
  chemins des fichiers qu'il introduit, par les mêmes contrôles que les fichiers ; adresses des auteurs et des
  committers, qui doivent être des adresses « noreply » ou d'un domaine d'exemple. Ce qu'un commit ajoute et qu'un
  commit suivant retire reste dans l'historique publié (constat LIC-01 de l'audit, version 0.3.84). Seules
  exceptions : les problèmes déjà publiés que liste scripts/check_public_historique.txt, chacun pour un commit, un
  endroit (son message, ses ajouts, ou l'identité de son auteur et de son committer) et un type de problème ;
- titre et description d'une pull request (avec --pull-request, sans les fichiers ni les commits), lus dans le
  fichier JSON de l'événement GitHub ($GITHUB_EVENT_PATH), par le workflow .github/workflows/description.yml.
  Ils ne sont pas dans git ; l'outil GitHub de Claude met un lien de session dans la description à la création
  (docs/publication.md). Le fichier est lu plutôt que des variables d'environnement, qu'Actions écrit en clair
  dans le journal de l'étape.

Ne sont pas lus (docs/publication.md, « Ce que les contrôles ne lisent pas ») : le contenu d'un fichier, ou d'une
version d'un fichier, qui a un octet nul dans ses 8 000 premiers octets (fichier binaire, ou de texte en UTF-16) ; les
étiquettes (tags) et leur auteur. Aucun motif ne reconnaît une adresse postale. Les secrets sont aussi cherchés par
gitleaks, dans la CI. Les valeurs trouvées ne sont jamais affichées en entier. Un échec de git arrête le script avec
le message de git (code 2).
"""
import argparse
import functools
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Adresses autorisées : uniquement des adresses « noreply » et des domaines réservés aux exemples. L'adresse « noreply »
# de GitHub d'un compte qui l'a choisie avant le 18 juillet 2017 n'a pas de numéro devant le pseudo (retouche gardée du
# constat réfuté LIC-06, version 0.3.84 ; source github-noreply-email de data/sources.yaml, l. 43-49 de
# https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/content/account-and-profile/reference/email-addresses-reference.md).
ALLOWED_EMAIL = re.compile(
    r"^(noreply@anthropic\.com|noreply@github\.com|([0-9]+\+)?[A-Za-z0-9-]+(\[bot\])?@users\.noreply\.github\.com"
    r"|[^@]+@(example\.(com|org|net)|[^@]+\.(invalid|example|test)))$",
    re.IGNORECASE,
)

PRIVATE_LINK = "lien vers une ressource privée"
EMAIL_KIND = "adresse électronique"

PATTERNS = [
    # « BLOCK » : en-tête d'une clé privée PGP (constat LIC-02, version 0.3.84).
    ("clé privée", re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY( BLOCK)?-----")),
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
    # Constat LIC-02, version 0.3.84 : une page Notion sous le sous-domaine d'un espace, et l'identifiant d'une session
    # Claude écrit seul, sans l'adresse (la forme de la fuite du 8 novembre 2026, au préfixe près). Une adresse de
    # session complète est lue en entier par la première branche : elle ne compte qu'une fois.
    (PRIVATE_LINK, re.compile(
        r"https?://(claude\.ai/(artifact|chat|project|share)/|claude\.ai/code/(session_|artifact/)"
        r"|docs\.google\.com/|drive\.google\.com/"
        r"|(www\.)?dropbox\.com/(s|sh|scl)/|([\w-]+\.)?notion\.(so|site)/)\S*"
        r"|\bsession_[A-Za-z0-9]{10,}")),
    ("chemin local avec nom d'utilisateur", re.compile(
        r"(?:/Users/|/home/(?!user\b|runner\b)|[A-Za-z]:\\Users\\)[A-Za-z0-9._-]+")),
]
EMAIL = re.compile(r"[A-Za-z0-9._%+\[\]-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
KINDS = {kind for kind, _ in PATTERNS} | {EMAIL_KIND}


def redact(value):
    return value[:4] + "…" if len(value) > 4 else "…"


def findings(line):
    """Les valeurs à ne pas publier d'une ligne : (type, début, fin)."""
    for kind, pattern in PATTERNS:
        for m in pattern.finditer(line):
            yield kind, m.start(), m.end()
    for m in EMAIL.finditer(line):
        if not ALLOWED_EMAIL.match(m.group(0)):
            yield EMAIL_KIND, m.start(), m.end()


@functools.lru_cache(maxsize=None)
def mask(text):
    """Le texte, chaque valeur trouvée réduite à son début : un chemin se nomme ainsi sans recopier la valeur."""
    spans = []
    for _, start, end in sorted(findings(text), key=lambda f: f[1:]):
        if spans and start <= spans[-1][1]:
            spans[-1][1] = max(spans[-1][1], end)
        else:
            spans.append([start, end])
    out, pos = [], 0
    for start, end in spans:
        out += [text[pos:start], redact(text[start:end])]
        pos = end
    return "".join(out) + text[pos:]


def scan_value(label, value, problems, skip=()):
    """Une valeur d'un seul tenant : un nom, un chemin."""
    for kind, start, end in findings(value):
        if kind not in skip:
            problems.append(f"{label} : {kind} ({redact(value[start:end])})")


def scan_text(label, text, problems, skip=(), first=1):
    """Un texte, ligne à ligne ; first : numéro de sa première ligne."""
    for n, line in enumerate(text.splitlines(), first):
        for kind, start, end in findings(line):
            if kind not in skip:
                problems.append(f"{label}:{n} : {kind} ({redact(line[start:end])})")


def git_output(*args, data=None):
    """Sortie d'une commande git, en octets. Un échec de git arrête le script, avec la ligne du message de git qui dit
    l'erreur (« fatal: ambiguous argument … » pour une plage introuvable, « unknown option: … » pour un git trop ancien
    pour --attr-source) et le code 2 ; avant la version 0.3.84, une trace Python sans le message de git (relecture,
    C7 ; contrôle final, F1 : la dernière ligne du message est souvent l'aide de git)."""
    result = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, input=data)
    if result.returncode != 0:
        said = [l for l in result.stderr.decode("utf-8", errors="replace").splitlines() if l.strip()]
        why = next((l for l in said if l.startswith(("fatal:", "error:", "unknown option"))),
                    said[0] if said else f"code {result.returncode}")
        shown = " ".join(a for a in args if not a.startswith("--format=") and len(a) < 80)
        print(f"ERREUR : git {shown} : {why}")
        sys.exit(2)
    return result.stdout


def tracked_files():
    return [os.fsdecode(p) for p in git_output("ls-files", "-z").split(b"\0") if p]


HISTORY_FILE = ROOT / "scripts" / "check_public_historique.txt"
PLACES = ("message", "ajout", "identité")


def known_history(problems):
    """Problèmes déjà publiés, tolérés : {(empreinte, endroit) : {types}} (scripts/check_public_historique.txt).

    Une ligne : l'empreinte complète du commit, l'endroit (« message » ; « ajout » pour les lignes ajoutées par le
    commit et les chemins des fichiers qu'il introduit ; « identité » pour les noms et les adresses de son auteur et de
    son committer), puis le type du problème tel que le script l'écrit. Une ligne qui n'a pas cette forme est un
    problème : sans cela, une tolérance mal écrite ne tolérerait rien sans le dire.
    """
    known = {}
    if not HISTORY_FILE.is_file():
        return known
    label = HISTORY_FILE.relative_to(ROOT).as_posix()
    for n, line in enumerate(HISTORY_FILE.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split(maxsplit=2)
        if (len(parts) != 3 or not re.fullmatch(r"[0-9a-f]{40}", parts[0]) or parts[1] not in PLACES
                or parts[2] not in KINDS):
            problems.append(f"{label}:{n} : tolérance illisible (attendu : empreinte complète, « message », « ajout » "
                            "ou « identité », type de problème tel que le script l'écrit)")
            continue
        known.setdefault((parts[0], parts[1]), set()).add(parts[2])
    return known


def scan_files(problems):
    count = 0
    for rel in tracked_files():
        scan_value(f"chemin {mask(rel)}", rel, problems)
        path = ROOT / rel
        if not path.is_file():
            continue
        data = path.read_bytes()
        if b"\0" in data[:8000]:
            continue  # fichier binaire, ou de texte en UTF-16 : son contenu n'est pas lu (docs/publication.md)
        count += 1
        scan_text(mask(rel), data.decode("utf-8", errors="replace"), problems)
    return count


FIELD = "\x1f"  # séparateur des champs de l'en-tête d'un commit, absent des noms et des adresses


def scan_commits(revs, known, problems):
    """Noms, adresses et message de chaque commit."""
    out = git_output("log", "--no-show-signature", "-z", f"--format=%H{FIELD}%an{FIELD}%ae{FIELD}%cn{FIELD}%ce%n%B",
                     *revs)
    records = [r for r in out.decode("utf-8", errors="replace").split("\0") if r.strip()]
    for record in records:
        header, _, message = record.partition("\n")
        fields = header.split(FIELD)
        if len(fields) != 5:
            problems.append(f"en-tête de commit illisible ({redact(header)})")
            continue
        sha, author_name, author, committer_name, committer = fields
        identity = known.get((sha, "identité"), ())
        for role, name, email in (("de l'auteur", author_name, author), ("du committer", committer_name, committer)):
            scan_value(f"commit {sha[:7]} (nom {role})", name, problems, identity)
            if not ALLOWED_EMAIL.match(email) and EMAIL_KIND not in identity:
                problems.append(f"commit {sha[:7]} : adresse {role} non autorisée ({redact(email)})")
        scan_text(f"commit {sha[:7]} (message)", message, problems, known.get((sha, "message"), ()))
    return len(records)


HUNK = re.compile(r"(@@+) [^@]*?\+(\d+)(?:,\d+)? \1")


def diff_path(text, prefix="b/"):
    """Chemin d'un en-tête de diff (« +++ b/… », « rename to … »), pour nommer le fichier dans un message :
    guillemets et préfixe retirés, échappements gardés."""
    # git ajoute une tabulation après un chemin qui contient une espace (source git-2-56-1-diff-c-tab, l. 1561-1567 de
    # https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/diff.c).
    text = text.removesuffix("\t")
    if len(text) > 1 and text.startswith('"') and text.endswith('"'):
        text = text[1:-1]
    return text.removeprefix(prefix)


def git_header_path(raw):
    """Chemin d'un en-tête « diff --git a/P b/P », quand les deux côtés portent le même chemin (ni renommage ni copie) :
    seul cet en-tête nomme un fichier binaire ou vide, qui n'a pas de ligne « +++ »."""
    s = raw[len("diff --git "):]
    half = len(s) // 2
    if len(s) % 2 == 0 or s[half] != " ":
        return None
    left, right = s[:half], s[half + 1:]
    for quote in ("", '"'):
        a, b = quote + "a/", quote + "b/"
        if left.startswith(a) and right.startswith(b) and left[len(a):] == right[len(b):]:
            return diff_path(right)
    return None


def scan_additions(revs, known, problems):
    """Lignes ajoutées par chaque commit (constat LIC-01).

    Une ligne est ajoutée par un commit quand elle est dans son arbre et dans celui d'aucun de ses parents : pour un
    commit ordinaire, les lignes « + » de son diff ; pour un commit de fusion, celles du diff combiné (--cc) marquées
    « + » dans la colonne de chaque parent, que la fusion n'a prises à aucun d'eux ; le premier commit est comparé à un
    arbre vide (log.showRoot). Chaque ligne de l'historique est ainsi lue dans le commit qui l'a apportée, sans être
    relue dans les fusions qui la recopient. Options fixées pour que la configuration de git ne change pas ce qui est
    lu : chemins sans échappement, préfixes « a/ » et « b/ », ni couleur, ni outil de diff externe, ni conversion de
    texte (textconv), ni vérification des signatures (log.showSignature écrivait sa sortie au milieu de celle de git :
    contrôle final, F3) ; attributs des fichiers .gitattributes lus dans un arbre vide (--attr-source, git 2.41 ou
    plus), pour qu'un fichier de texte qu'ils déclarent binaire (« -diff », « binary ») montre ses lignes. Un fichier
    que git montre quand même comme binaire (sa version d'avant l'était, ou un attribut de .git/info/attributes ou de
    core.attributesFile, ou le seuil core.bigFileThreshold) est lu en entier dans sa nouvelle version, tirée de l'objet
    git par git cat-file, s'il n'a pas d'octet nul dans ses 8 000 premiers octets (relecture, C1 et C4).
    Sources (data/sources.yaml), textes de git 2.56.1, la version de la CI le 21 novembre 2026 :
    - git-2-56-1-diff-combine, colonnes et « @ » du diff combiné, l. 181-202 de
      https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/diff-generate-patch.adoc ;
    - git-2-56-1-diff-merges, --diff-merges=combined et dense-combined (--cc), l. 65-106 de
      https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/diff-options.adoc ;
    - git-2-56-1-log-showroot, le premier commit comparé à un arbre vide, l. 66-70 de
      https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/config/log.adoc ;
    - git-2-56-1-attr-source, --attr-source, l. 230-233 de
      https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/git.adoc ;
    - git-2-41-0-relnotes, --attr-source apparue dans git 2.41.0, l. 116-118 de
      https://raw.githubusercontent.com/git/git/fe86abd7511a9a6862d5706c6fa1d9b57a63ba09/Documentation/RelNotes/2.41.0.txt.
    """
    empty_tree = git_output("hash-object", "-t", "tree", "/dev/null").decode().strip()
    out = git_output(f"--attr-source={empty_tree}", "-c", "core.quotePath=false", "-c", "log.showRoot=true", "log",
                     "--no-show-signature", "--format=%x00%H", "-U0", "-M", "--cc", "--full-index", "--no-color",
                     "--no-ext-diff",
                     "--no-textconv", "--src-prefix=a/", "--dst-prefix=b/", *revs)
    count, binaries = 0, []
    # Un commit commence, en début de ligne, par un octet nul et son empreinte. Une ligne de diff commence par « + »,
    # « - », une espace ou un en-tête, jamais par un octet nul, même quand le texte d'un fichier en contient un au-delà
    # de ses 8 000 premiers octets, que git montre alors comme du texte (relecture, C2).
    for chunk in re.split(r"(?:^|\n)\x00(?=[0-9a-f]{40}\n)", out.decode("utf-8", errors="replace")):
        sha, _, patch = chunk.partition("\n")
        if not re.fullmatch(r"[0-9a-f]{40}", sha):
            continue
        skip = known.get((sha, "ajout"), ())
        path, blob, parents, line_no, in_hunk = "?", None, 1, 0, False
        for raw in patch.split("\n"):
            if raw.startswith("diff "):
                # Un fichier : « diff --git a/P b/P », ou « diff --cc P » pour un commit de fusion.
                in_hunk, blob = False, None
                if raw.startswith("diff --git "):
                    path = git_header_path(raw) or "?"
                else:
                    path = diff_path(raw.split(" ", 2)[2], "")
                continue
            if raw.startswith("@@"):
                m = HUNK.match(raw)
                in_hunk = bool(m)
                if m:
                    parents, line_no = len(m.group(1)) - 1, int(m.group(2))
                continue
            if not in_hunk:
                if raw.startswith("index "):
                    # « index a..b », « index a,b..c » pour une fusion : le dernier objet est celui du commit.
                    blob = raw.split()[1].split("..")[-1]
                elif raw.startswith(("rename to ", "copy to ")):
                    path = diff_path(raw.split(" ", 2)[2], "")
                elif raw.startswith("+++ ") and raw != "+++ /dev/null":
                    path = diff_path(raw[4:])
                elif raw.startswith("Binary files ") and blob and blob.strip("0"):
                    binaries.append((sha, path, blob, skip))
                continue
            # Une colonne par parent : « + » absente de ce parent, « - » absente du commit, « » dans les deux.
            marks, text = raw[:parents], raw[parents:]
            if len(marks) < parents or marks.strip("+- ") or "-" in marks:
                continue  # « \ No newline at end of file », ligne retirée
            if marks == "+" * parents:
                count += 1
                scan_text(f"commit {sha[:7]}, {mask(path)}", text, problems, skip, line_no)
            line_no += 1
    if binaries:
        data = git_output("cat-file", "--batch", data="".join(f"{b}\n" for _, _, b, _ in binaries).encode())
        pos = 0
        for sha, path, blob, skip in binaries:
            # « <objet> blob <taille> », le contenu, une fin de ligne ; « <objet> missing » s'il manque.
            eol = data.index(b"\n", pos)
            head = data[pos:eol].split()
            if len(head) != 3 or head[1] != b"blob":
                problems.append(f"commit {sha[:7]}, {mask(path)} : objet {blob[:7]} introuvable, contenu non lu")
                pos = eol + 1
                continue
            content = data[eol + 1:eol + 1 + int(head[2])]
            pos = eol + 1 + int(head[2]) + 1
            if b"\0" not in content[:8000]:
                text = content.decode("utf-8", errors="replace")
                count += len(text.splitlines())
                scan_text(f"commit {sha[:7]}, {mask(path)}", text, problems, skip)
    return count


def scan_new_paths(revs, known, problems):
    """Chemins des fichiers qu'introduit chaque commit (constat LIC-03 ; relecture, C3) : ajoutés par rapport à chacun
    de ses parents, et non relus dans les commits qui modifient le fichier.

    --name-status sans détection des renommages : un fichier renommé est retiré sous l'ancien chemin et ajouté sous le
    nouveau ; -c pour un commit de fusion, une lettre par parent (« AA » : un fichier qu'aucun parent n'a) ; -z pour des
    chemins écrits tels quels, sans échappement ; le premier commit est comparé à un arbre vide. Source
    git-2-56-1-diff-format (data/sources.yaml), lettres d'état l. 55-65, -z l. 81-84, fusions l. 87-96 et 121-122 de
    https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/diff-format.adoc.
    """
    out = git_output("-c", "log.showRoot=true", "log", "--no-show-signature", "-z", "--format=%x01%H", "-c",
                     "--name-status", "--no-renames", *revs)
    sha, status, count = None, None, 0
    for token in out.decode("utf-8", errors="replace").split("\0"):
        head = re.fullmatch(r"\n?\x01([0-9a-f]{40})\n?", token)
        if head:
            sha, status = head.group(1), None
        elif status is None:
            status = token.strip("\n") or None  # un jeton vide suit l'empreinte d'un commit de fusion
        else:
            if sha and set(status) == {"A"}:
                count += 1
                scan_value(f"commit {sha[:7]}, chemin {mask(token)}", token, problems, known.get((sha, "ajout"), ()))
            status = None
    return count


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--commits", help="« all », ou une plage BASE..HEAD : contrôle aussi les commits")
    parser.add_argument("--pull-request", metavar="FICHIER",
                        help="événement GitHub (JSON) dont le titre et la description de la pull request sont contrôlés seuls")
    args = parser.parse_args()
    sys.stdout.reconfigure(errors="backslashreplace")  # un chemin qui n'est pas de l'UTF-8 s'affiche quand même
    problems = []
    if args.pull_request:
        pr = json.loads(Path(args.pull_request).read_text(encoding="utf-8")).get("pull_request") or {}
        for label, key in (("titre", "title"), ("description", "body")):
            scan_text(label, pr.get(key) or "", problems)
        for p in problems:
            print(f"ERREUR : {p}")
        print(f"titre et description contrôlés : {len(problems)} problème(s)")
        return 1 if problems else 0
    files = scan_files(problems)
    summary = f"{files} fichier(s) texte"
    if args.commits:
        revs = ["--all"] if args.commits == "all" else [args.commits]
        known = known_history(problems)
        commits = scan_commits(revs, known, problems)
        added = scan_additions(revs, known, problems)
        paths = scan_new_paths(revs, known, problems)
        summary += f", {commits} commit(s), {added} ligne(s) ajoutée(s) et {paths} chemin(s) introduit(s)"
    for p in problems:
        print(f"ERREUR : {p}")
    print(f"{summary} contrôlé(s) : {len(problems)} problème(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
