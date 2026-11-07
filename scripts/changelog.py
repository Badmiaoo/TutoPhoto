#!/usr/bin/env python3
"""Contrôle CHANGELOG.md et pose les tags de version.

Usage :
  python3 scripts/changelog.py check [--base REF]
      Vérifie le format du changelog. Avec --base, vérifie aussi que la pull request
      ajoute une version plus récente que celle de REF et ne retire aucune version publiée.
  python3 scripts/changelog.py tag [--apply | --push]
      Pour chaque version sans tag, trouve le commit de main (premier parent) qui a
      introduit sa section et y pose un tag annoté vX.Y.Z avec le texte de la section.
      Sans option : affiche ce qui serait fait. --apply crée les tags, --push les pousse.
"""
import argparse
import datetime
import pathlib
import re
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHANGELOG = "CHANGELOG.md"
VERSION_HEADING = re.compile(r"^## \[(\d+)\.(\d+)\.(\d+)\] - (\d{4}-\d{2}-\d{2})$")
LINK_REF = re.compile(r"^\[(\d+\.\d+\.\d+)\]: \S+$")


def git(*args, check=True):
    result = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
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
    for n, line in enumerate(text.splitlines(), 1):
        if LINK_REF.match(line):
            links.add(LINK_REF.match(line).group(1))
            current = None
            continue
        if line.startswith("## "):
            current = None
            m = VERSION_HEADING.match(line)
            if m:
                key = tuple(int(x) for x in m.group(1, 2, 3))
                try:
                    date = datetime.date.fromisoformat(m.group(4))
                except ValueError:
                    errors.append(f"ligne {n} : date invalide {m.group(4)}")
                    continue
                current = {"version": ".".join(map(str, key)), "key": key, "date": m.group(4),
                           "_date": date, "lines": []}
                versions.append(current)
            elif line.startswith("## ["):
                errors.append(f"ligne {n} : titre de version mal formé, attendu « ## [X.Y.Z] - AAAA-MM-JJ » : {line}")
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


def cmd_check(base):
    versions, errors = parse((ROOT / CHANGELOG).read_text(encoding="utf-8"))
    if base and not errors:
        shown = git("show", f"{base}:{CHANGELOG}", check=False)
        if shown.returncode == 0:
            base_versions, _ = parse(shown.stdout)
            if base_versions:
                if versions[0]["key"] <= base_versions[0]["key"]:
                    errors.append(f"la pull request doit ajouter une version plus récente que {base_versions[0]['version']} "
                                  f"(version en tête : {versions[0]['version']})")
                mine = {v["version"] for v in versions}
                for v in base_versions:
                    if v["version"] not in mine:
                        errors.append(f"version publiée retirée du changelog : {v['version']}")
    for e in errors:
        print(f"ERREUR : {e}")
    if not errors:
        print(f"{CHANGELOG} : {len(versions)} version(s), la plus récente {versions[0]['version']} du {versions[0]['date']}")
    return 1 if errors else 0


def introducing_commit(version):
    """Plus ancien commit de la branche courante (premier parent) qui a ajouté le titre de la version."""
    out = git("log", "--first-parent", "--diff-merges=first-parent", "--no-patch", "--format=%H",
              "-S", f"## [{version}] - ", "HEAD", "--", CHANGELOG).stdout.split()
    return out[-1] if out else None


def cmd_tag(apply, push):
    versions, errors = parse((ROOT / CHANGELOG).read_text(encoding="utf-8"))
    if errors:
        for e in errors:
            print(f"ERREUR : {e}")
        return 1
    existing = set(git("tag", "--list", "v*").stdout.split())
    created = []
    for v in reversed(versions):  # du plus ancien au plus récent
        tag = f"v{v['version']}"
        if tag in existing:
            continue
        sha = introducing_commit(v["version"])
        if sha is None:
            print(f"ERREUR : aucun commit n'introduit la version {v['version']}")
            return 1
        print(f"{tag} -> {sha[:7]} ({git('log', '-1', '--format=%s', sha).stdout.strip()})")
        if not (apply or push):
            continue
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".md", delete=False) as f:
            f.write(f"Version {v['version']} - {v['date']}\n\n{v['body']}\n")
        # --cleanup=whitespace garde les lignes « ### … », que le mode par défaut supprimerait.
        git("tag", "-a", tag, sha, "--cleanup=whitespace", "-F", f.name)
        pathlib.Path(f.name).unlink()
        created.append(tag)
    if not created and (apply or push):
        print("Aucun tag à créer.")
    if push:
        for tag in created:
            git("push", "origin", f"refs/tags/{tag}")
            print(f"{tag} poussé")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_check = sub.add_parser("check")
    p_check.add_argument("--base")
    p_tag = sub.add_parser("tag")
    mode = p_tag.add_mutually_exclusive_group()
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--push", action="store_true")
    args = parser.parse_args()
    if args.cmd == "check":
        return cmd_check(args.base)
    return cmd_tag(args.apply, args.push)


if __name__ == "__main__":
    sys.exit(main())
