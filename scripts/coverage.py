#!/usr/bin/env python3
"""Comptes du référentiel et couverture des contenus.

Usage : python3 scripts/coverage.py [racine du dépôt]

Sortie en Markdown. Règles de couverture : docs/contenus.md. Suppose un référentiel que scripts/validate.py accepte
(la CI le lance d'abord) : sur un renvoi vers une situation absente, par exemple, il s'arrête sur une trace Python. Les
fiches sont lues comme les lit la construction des pages (scripts/referentiel.py, « Fiches de content/ »).
"""
import collections
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import referentiel  # noqa: E402

# Titres de section (niveau 2) attendus dans une fiche de notion, par brique ; la casse compte, comme pour la
# construction des pages (version 0.3.83).
HEADINGS = {"explanation": "Explication", "simulator": "Simulateur", "activity": "Activité",
            "exercise": "Exercice", "situation": "Situation réelle"}
BRICKS = [("explanation", "Explication"), ("simulator", "Simulateur ou activité"),
          ("exercise", "Exercice"), ("situation", "Situation réelle")]
# Section qui fait d'une fiche de situation une situation rédigée : la recette (docs/contenus.md ; constat RST-13 de
# l'audit, version 0.3.81 : avant, un fichier réduit à son titre comptait).
RECIPE = "Recette"


def sections(ref, path):
    """Titres des sections de niveau 2 d'une fiche dont le corps n'est pas vide ; aucun si le fichier n'existe pas. Un
    fichier qui ne se lit pas (qui n'est pas en UTF-8) lève `referentiel.LectureImpossible`."""
    if not path.is_file():
        return set()
    return referentiel.sections_de_fiche(referentiel.texte_de_fiche(path, ref.rel(path)))


def content_coverage(ref):
    content = ref.root / "content"
    written = {s["id"] for s in ref.situations if RECIPE in sections(ref, content / "situations" / f"{s['id']}.md")}
    bricks = {}  # notion -> ensemble des briques présentes
    for n in ref.notions:
        present = sections(ref, content / "notions" / f"{n['id']}.md")
        got = set()
        if HEADINGS["explanation"] in present:
            got.add("explanation")
        if HEADINGS["activity" if n.get("activity") else "simulator"] in present:
            got.add("simulator")
        if HEADINGS["exercise"] in present:
            got.add("exercise")
        sits = n["situations"]
        if sits == "all" or not sits:
            if HEADINGS["situation"] in present:
                got.add("situation")
        elif any(s in written for s in sits):
            got.add("situation")
        bricks[n["id"]] = got
    return bricks, written


def main():
    try:
        ref = referentiel.load(sys.argv[1] if len(sys.argv) > 1 else referentiel.ROOT)
    except referentiel.LectureImpossible as e:
        print(f"ERREUR : {e}", file=sys.stderr)
        return 1
    notions = ref.notions
    out = []

    out.append("## Référentiel\n")
    out.append("| Domaine | Notions | " + " | ".join(referentiel.LEVELS) + " |")
    out.append("| --- | --- | " + " | ".join("---" for _ in referentiel.LEVELS) + " |")
    total = collections.Counter()
    for d in ref.domains:
        mine = [n for n in notions if n["_domain"] == d["id"]]
        counts = collections.Counter(n["level"] for n in mine)
        total.update(counts)
        out.append(f"| {d['id']} · {d['title']} | {len(mine)} | "
                   + " | ".join(str(counts[lv]) for lv in referentiel.LEVELS) + " |")
    out.append(f"| Total | {len(notions)} | " + " | ".join(str(total[lv]) for lv in referentiel.LEVELS) + " |")

    situations = {s["id"]: s for s in ref.situations}
    links = [(n["id"], s) for n in notions if n["situations"] != "all" for s in n["situations"]]
    one_way = sum(1 for nid, s in links if nid not in situations[s]["key_notions"])
    keyed = {k for s in ref.situations for k in s["key_notions"]}
    entry = collections.Counter(s["level"] for s in ref.situations)
    top = collections.Counter(s["level_max"] for s in ref.situations)
    out.append("")
    out.append(f"Renvois notion → situation : {len(links)}, dont {one_way} sans retour ; "
               f"{len([n for n in notions if n['id'] not in keyed])} notions ne sont la notion clé d'aucune situation.")
    out.append(f"Situations : {len(situations)} ; niveaux d'entrée : "
               + ", ".join(f"{entry[lv]} en {lv}" for lv in referentiel.LEVELS) + " ; niveaux max : "
               + ", ".join(f"{top[lv]} en {lv}" for lv in referentiel.LEVELS) + ".")

    try:
        bricks, written = content_coverage(ref)
    except referentiel.LectureImpossible as e:
        print(f"ERREUR : {e}", file=sys.stderr)
        return 1
    covered = [n["id"] for n in notions if len(bricks[n["id"]]) == 4]
    pct = f"{100 * len(covered) / len(notions) if notions else 0:.1f}".replace(".", ",")  # virgule décimale
    out.append("\n## Couverture des contenus\n")
    out.append(f"Couverture : {len(covered)} notion(s) sur {len(notions)} ({pct} %) ont leurs quatre briques.\n")
    out.append("| Brique | Notions |")
    out.append("| --- | --- |")
    for key, label in BRICKS:
        out.append(f"| {label} | {sum(1 for n in notions if key in bricks[n['id']])} |")
    out.append("")
    out.append("| Domaine | Couvertes | Notions |")
    out.append("| --- | --- | --- |")
    for d in ref.domains:
        mine = [n["id"] for n in notions if n["_domain"] == d["id"]]
        out.append(f"| {d['id']} | {len([i for i in mine if i in covered])} | {len(mine)} |")
    out.append("")
    out.append(f"Situations rédigées : {len(written)} sur {len(situations)}.")
    out.append("")
    out.append("| Jalon | Notions couvertes | Situations rédigées |")
    out.append("| --- | --- | --- |")
    for j in ref.jalons:
        done = len([i for i in j["notions"] if i in covered])
        drafted = len([s for s in j["situations"] if s in written])
        out.append(f"| {j['id']} · {j['title']} | {done} sur {len(j['notions'])} | {drafted} sur {len(j['situations'])} |")
    out.append("")
    out.append("Contenus lus dans `content/` ; règles dans `docs/contenus.md` ; jalons dans `data/jalons.yaml`.")
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
