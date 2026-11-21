#!/usr/bin/env python3
"""Contrôle CHANGELOG.md et pose les tags de version.

Usage :
  python3 scripts/changelog.py check [--base REF]
      Vérifie le format du changelog. Avec --base, vérifie aussi que la pull request
      ajoute une version plus récente que celle de REF et ne retire aucune version publiée ;
      une base que git ne trouve pas, ou dont il ne lit pas le changelog, est une erreur.
  python3 scripts/changelog.py tag [--apply | --github]
      Pour chaque version sans tag, trouve le commit de main (premier parent) qui a
      introduit sa section et y pose un tag annoté vX.Y.Z avec le texte de la section.
      Les versions de UNTAGGED_VERSIONS sont laissées sans tag.
      Sans option : affiche ce qui serait fait. --apply crée les tags dans le dépôt local.
      --github crée les tags par l'API de GitHub, puis une release par version avec le
      texte de la section ; il lit GITHUB_TOKEN, GITHUB_REPOSITORY et GITHUB_API_URL.
      L'API sert parce que GitHub refuse qu'un jeton de workflow pousse par git un tag
      dont le commit contient des fichiers de workflow (droit « workflows » absent).
"""
import argparse
import datetime
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHANGELOG = "CHANGELOG.md"
VERSION_HEADING = re.compile(r"^## \[(\d+)\.(\d+)\.(\d+)\] - (\d{4}-\d{2}-\d{2})$")
LINK_REF = re.compile(r"^\[(\d+\.\d+\.\d+)\]: \S+$")
# Ligne « ## » : elle commence, après au plus trois espaces, par « ## » sans troisième « # », avec ou sans espace
# ensuite (« ##[0.3.59] » compte). En Markdown, un titre est fait de « # » suivis d'une espace, d'une tabulation ou de la
# fin de la ligne, avec au plus trois espaces de retrait (source commonmark-spec-0-31-2 de data/sources.yaml, l. 1102-1105
# de https://raw.githubusercontent.com/commonmark/commonmark-spec/9103e341a973013013bb1a80e13567007c5cef6f/spec.txt) ;
# le contrôle compte aussi une ligne sans espace après « ## », presque sûrement une faute de frappe.
LEVEL2_HEADING = re.compile(r"^ {0,3}##(?!#)")
# Ligne qui commence comme un titre de version, à n'importe quel niveau de titre : au plus trois espaces, des « # »,
# puis un numéro X.Y.Z, avec ou sans crochet ni « v » (« ## 0.3.59 - … », « ### [0.3.59] - … »). Constat LIC-04 de
# l'audit, cas 5.
VERSION_LIKE = re.compile(r"^ {0,3}#+[ \t]*\[?[ \t]*[vV]?\d+\.\d+\.\d+")
# Avant le premier titre de version, là où s'écrivent les nouvelles sections : un titre qui contient un numéro X.Y.Z
# n'importe où (« ## Version 0.3.59 », « ## (0.3.59) ») est aussi un titre de version mal formé ; l'en-tête n'en a pas
# (relecture du Sujet 25, C1).
HEADING_WITH_VERSION = re.compile(r"^ {0,3}#+.*\d+\.\d+\.\d+")
# Versions laissées sans tag : GitHub a refusé leurs références au jeton du workflow (HTTP 403, section 0.2.4 du
# changelog), et Julien a renoncé à les poser (décision D8, 15 novembre 2026, docs/historique.md). Ni « tag » ni
# « tag --github » ne les réessaient ; les liens du bas du changelog visent leurs commits de fusion.
UNTAGGED_VERSIONS = frozenset({"0.2.0", "0.2.1", "0.2.2"})


def git(*args, check=True, env=None):
    result = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, env=env)
    if check and result.returncode != 0:
        # Afficher ce que git a dit : sans cela, un échec (push refusé, par exemple) reste muet.
        sys.stderr.write(f"ERREUR : git {' '.join(args)} a échoué (code {result.returncode})\n")
        sys.stderr.write(result.stdout + result.stderr)
        sys.exit(1)
    return result


def parse(text):
    """Renvoie (versions, erreurs) ; une version = dict(version, key, date, body)."""
    versions, errors, links = [], [], set()
    current = None
    seen_version = False
    first_link = None  # numéro de la ligne du premier lien « [X.Y.Z]: … »
    misplaced_link = False
    for n, line in enumerate(text.splitlines(), 1):
        if LINK_REF.match(line):
            links.add(LINK_REF.match(line).group(1))
            current = None
            first_link = first_link or n
            continue
        if first_link and line.strip() and not misplaced_link:
            # Les liens vont tous en bas du fichier. Un lien au milieu d'une section la coupait sans rien dire, comme
            # une ligne « ## », et le tag et la release de la version n'en auraient gardé que le début (relecture du
            # Sujet 25, C2). Une seule erreur, à la première ligne de texte qui suit un lien.
            misplaced_link = True
            errors.append(f"ligne {first_link} : lien « [X.Y.Z]: … » suivi de texte (ligne {n}) ; les liens vont tous "
                          f"en bas du fichier, après la dernière section, et un lien placé dans une section la couperait")
        m = VERSION_HEADING.match(line)
        if m:
            current = None
            seen_version = True
            key = tuple(int(x) for x in m.group(1, 2, 3))
            try:
                date = datetime.date.fromisoformat(m.group(4))
            except ValueError:
                errors.append(f"ligne {n} : date invalide {m.group(4)}")
                continue
            current = {"version": ".".join(map(str, key)), "key": key, "date": m.group(4),
                       "_date": date, "lines": []}
            versions.append(current)
            continue
        if VERSION_LIKE.match(line) or line.startswith("## [") or (not seen_version and HEADING_WITH_VERSION.match(line)):
            current = None
            errors.append(f"ligne {n} : titre de version mal formé, attendu « ## [X.Y.Z] - AAAA-MM-JJ » : {line}")
            continue
        if LEVEL2_HEADING.match(line):
            current = None
            if seen_version:
                # Constat LIC-04, cas 6 : une telle ligne coupait la section qui la précède, et le tag et la release
                # de la version n'en auraient gardé que le début, sans que rien ne le dise.
                errors.append(f"ligne {n} : ligne « ## » placée après le premier titre de version, qui n'est pas un "
                              f"titre de version ; elle couperait la section qui la précède : {line}")
            continue
        if current is not None:
            current["lines"].append(line)
    for v in versions:
        v["body"] = "\n".join(v.pop("lines")).strip("\n")
        if not v["body"].strip():
            errors.append(f"version {v['version']} : section vide")
        if v["version"] not in links:
            errors.append(f"version {v['version']} : lien « [{v['version']}]: … » manquant en bas du fichier")
    seen = set()
    for prev, nxt in zip(versions, versions[1:]):
        if nxt["key"] >= prev["key"]:
            errors.append(f"versions dans le désordre : {prev['version']} avant {nxt['version']}")
        if nxt["_date"] > prev["_date"]:
            errors.append(f"dates dans le désordre : {prev['version']} ({prev['date']}) avant {nxt['version']} ({nxt['date']})")
    for v in versions:
        if v["version"] in seen:
            errors.append(f"version en double : {v['version']}")
        seen.add(v["version"])
    if not versions:
        errors.append("aucune version")
    return versions, errors


def first_line(text):
    """Première ligne non vide d'un message de git, ou « (sans message) »."""
    return next((line.strip() for line in text.splitlines() if line.strip()), "(sans message)")


def base_errors(base, versions):
    """Erreurs de la comparaison avec la base. Une base introuvable ou illisible est une erreur (constat LIC-04) :
    avant la version 0.3.85, elle passait en silence, et le contrôle ne comparait rien.

    « rev-parse --verify --end-of-options <base>^{commit} » échoue si la base est vide ou ne désigne pas un commit, et
    ne prend pas un nom qui commence par « - » pour une option : forme que donne la documentation de git (source
    git-2-56-1-rev-parse-verify de data/sources.yaml, l. 108-126 et 498-505 de
    https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/git-rev-parse.adoc).
    """
    # Sans --quiet, git dit pourquoi un nom n'est pas lu (« Needed a single revision », « short object ID … is
    # ambiguous »), et avertit quand deux références portent le nom (« refname … is ambiguous »), ce que --quiet tait.
    # Messages lus en anglais (LC_ALL=C), pour y trouver « ambiguous ».
    c_locale = dict(os.environ, LC_ALL="C")
    found = git("rev-parse", "--verify", "--end-of-options", f"{base}^{{commit}}", check=False, env=c_locale)
    if found.returncode != 0:
        return [f"base introuvable : « {base} » ne désigne aucun commit du dépôt local (git : {first_line(found.stderr)}) ; "
                f"nom mal écrit, ou branche à récupérer d'abord, par exemple « git fetch origin main »"]
    if "ambiguous" in found.stderr:
        # Un nom que portent deux références (une branche locale et un tag, une branche locale nommée « origin/main »…) :
        # git en prend une sans le dire ailleurs que dans cet avertissement (relecture du Sujet 25, C5).
        return [f"base ambiguë : « {base} » (git : {first_line(found.stderr)}) ; "
                f"donner le nom complet de la référence, par exemple « refs/remotes/origin/main »"]
    shown = git("show", f"{found.stdout.strip()}:{CHANGELOG}", check=False)
    if shown.returncode != 0:
        return [f"{CHANGELOG} illisible dans la base « {base} » : {first_line(shown.stderr)}"]
    base_versions, _ = parse(shown.stdout)
    if not base_versions:
        return [f"aucune version lue dans le {CHANGELOG} de la base « {base} »"]
    errors = []
    if versions[0]["key"] <= base_versions[0]["key"]:
        errors.append(f"la pull request doit ajouter une version plus récente que {base_versions[0]['version']} "
                      f"(version en tête : {versions[0]['version']})")
    mine = {v["version"] for v in versions}
    for v in base_versions:
        if v["version"] not in mine:
            errors.append(f"version publiée retirée du changelog : {v['version']}")
    return errors


def cmd_check(base):
    versions, errors = parse((ROOT / CHANGELOG).read_text(encoding="utf-8"))
    # « is not None » : une base vide (« --base "" », variable non définie dans un script) est aussi contrôlée.
    if base is not None and not errors:
        errors.extend(base_errors(base, versions))
    for e in errors:
        print(f"ERREUR : {e}")
    if not errors:
        print(f"{CHANGELOG} : {len(versions)} version(s), la plus récente {versions[0]['version']} du {versions[0]['date']}")
    return 1 if errors else 0


def introducing_commit(version):
    """Plus ancien commit de la branche courante (premier parent) qui a ajouté la ligne du titre de la version.

    -G et non -S (contrôle final du Sujet 25, F1, version 0.3.85) : -S compte les occurrences de la chaîne n'importe où
    dans le fichier, et une section qui cite le titre d'une autre version (« ## [0.3.86] - … », en exemple) aurait fait
    poser le tag de celle-ci sur son propre commit. -G ne retient que les lignes ajoutées ou retirées qui commencent par
    le titre : git y applique l'expression ligne par ligne, sans le « + » ou le « - » du diff, en expression régulière
    étendue de POSIX (sources git-2-56-1-diff-merges, l. 650-665 de
    https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/Documentation/diff-options.adoc,
    et git-2-56-1-diffcore-pickaxe, l. 26-41 et 242-246 de
    https://raw.githubusercontent.com/git/git/03b41523c576f26ad34085378717a0c1b287470f/diffcore-pickaxe.c).
    Le numéro de version n'a que des chiffres et des points, échappés.
    """
    title = "^## \\[" + version.replace(".", "\\.") + "] - "
    out = git("log", "--first-parent", "--diff-merges=first-parent", "--no-patch", "--format=%H",
              "-G", title, "HEAD", "--", CHANGELOG).stdout.split()
    return out[-1] if out else None


def tag_message(v):
    return f"Version {v['version']} - {v['date']}\n\n{v['body']}\n"


def github_api(method, path, payload=None):
    """Appel à l'API REST de GitHub ; renvoie (code HTTP, corps JSON)."""
    url = os.environ.get("GITHUB_API_URL", "https://api.github.com").rstrip("/") + path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "tutophoto-changelog",
    })
    try:
        with urllib.request.urlopen(request) as response:
            body = response.read()
            return response.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(body)
        except ValueError:
            return e.code, {"message": body}


def expect(code, body, wanted, what):
    if code != wanted:
        print(f"ERREUR : {what} : HTTP {code} : {body.get('message', body)}")
        sys.exit(1)


def report(text):
    """Écrit dans le résumé de l'exécution GitHub Actions, s'il existe."""
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as f:
            f.write(text + "\n")


def tag_on_github(versions):
    """Crée les tags et releases manquants. Échoue seulement si la version la plus récente reste sans tag.

    Les versions de UNTAGGED_VERSIONS sont sautées, sans appel à l'API. GitHub peut refuser au jeton du
    workflow la référence d'une ancienne version (HTTP 403) : cette version est alors signalée, avec la
    commande pour poser le tag à la main, et les suivantes sont traitées.
    """
    repo = os.environ["GITHUB_REPOSITORY"]
    tagger = {"name": "github-actions[bot]", "email": "41898282+github-actions[bot]@users.noreply.github.com",
              "date": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
    blocked = []
    for v in reversed(versions):  # du plus ancien au plus récent : la dernière release créée est la plus récente
        if v["version"] in UNTAGGED_VERSIONS:
            continue
        tag = f"v{v['version']}"
        code, body = github_api("GET", f"/repos/{repo}/git/ref/tags/{tag}")
        if code == 404:
            sha = introducing_commit(v["version"])
            if sha is None:
                print(f"ERREUR : aucun commit n'introduit la version {v['version']}")
                sys.exit(1)
            code, obj = github_api("POST", f"/repos/{repo}/git/tags", {
                "tag": tag, "message": tag_message(v), "object": sha, "type": "commit", "tagger": tagger})
            expect(code, obj, 201, f"création de l'objet tag {tag}")
            code, body = github_api("POST", f"/repos/{repo}/git/refs", {"ref": f"refs/tags/{tag}", "sha": obj["sha"]})
            if code == 403:
                print(f"::warning::{tag} sur {sha[:7]} : référence refusée au jeton du workflow "
                      f"(HTTP 403 : {body.get('message', body)}) ; tag à poser à la main.")
                blocked.append((tag, sha))
                continue
            expect(code, body, 201, f"création de la référence {tag}")
            print(f"{tag} créé sur {sha[:7]}")
        else:
            expect(code, body, 200, f"lecture du tag {tag}")
        code, body = github_api("GET", f"/repos/{repo}/releases/tags/{tag}")
        if code == 404:
            code, body = github_api("POST", f"/repos/{repo}/releases", {
                "tag_name": tag, "name": f"{tag} - {v['date']}", "body": v["body"]})
            expect(code, body, 201, f"création de la release {tag}")
            print(f"release {tag} créée")
        else:
            expect(code, body, 200, f"lecture de la release {tag}")
    if blocked:
        report("## Tags à poser à la main\n\n"
               + "\n".join(f"- `{tag}` sur `{sha[:7]}`" for tag, sha in blocked)
               + "\n\nDepuis un clone à jour de `main`, avec un compte qui a le droit de pousser :\n\n"
               "```sh\npython3 scripts/changelog.py tag --apply\ngit push origin "
               + " ".join(tag for tag, _ in blocked) + "\n```\n\n"
               "Le passage suivant de ce workflow créera leurs releases.")
    newest = f"v{versions[0]['version']}"
    if any(tag == newest for tag, _ in blocked):
        print(f"ERREUR : la version la plus récente, {newest}, n'a pas pu être taguée.")
        return 1
    return 0


def cmd_tag(apply, github):
    versions, errors = parse((ROOT / CHANGELOG).read_text(encoding="utf-8"))
    if errors:
        for e in errors:
            print(f"ERREUR : {e}")
        return 1
    if github:
        return tag_on_github(versions)
    existing = set(git("tag", "--list", "v*").stdout.split())
    created = []
    for v in reversed(versions):  # du plus ancien au plus récent
        tag = f"v{v['version']}"
        if tag in existing or v["version"] in UNTAGGED_VERSIONS:
            continue
        sha = introducing_commit(v["version"])
        if sha is None:
            print(f"ERREUR : aucun commit n'introduit la version {v['version']}")
            return 1
        print(f"{tag} -> {sha[:7]} ({git('log', '-1', '--format=%s', sha).stdout.strip()})")
        if not apply:
            continue
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".md", delete=False) as f:
            f.write(tag_message(v))
        # --cleanup=whitespace garde les lignes « ### … », que le mode par défaut supprimerait.
        git("tag", "-a", tag, sha, "--cleanup=whitespace", "-F", f.name)
        pathlib.Path(f.name).unlink()
        created.append(tag)
    if apply and not created:
        print("Aucun tag à créer.")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_check = sub.add_parser("check")
    p_check.add_argument("--base")
    p_tag = sub.add_parser("tag")
    mode = p_tag.add_mutually_exclusive_group()
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--github", action="store_true")
    args = parser.parse_args()
    if args.cmd == "check":
        return cmd_check(args.base)
    return cmd_tag(args.apply, args.github)


if __name__ == "__main__":
    sys.exit(main())
