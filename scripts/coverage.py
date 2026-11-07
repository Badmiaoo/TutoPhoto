#!/usr/bin/env python3
"""Comptes du référentiel et couverture des contenus en français et en anglais.

Usage : python3 scripts/coverage.py [racine du dépôt]

Sortie en Markdown. Règles de couverture : docs/contenus.md.
"""
import collections
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import referentiel  # noqa: E402

LANGS = ["fr", "en"]
# Titres de section (niveau 2) attendus dans une fiche de notion, par brique et par langue.
HEADINGS = {
    "fr": {"explanation": "Explication", "simulator": "Simulateur", "activity": "Activité",
           "exercise": "Exercice", "situation": "Situation réelle"},
    "en": {"explanation": "Explanation", "simulator": "Simulator", "activity": "Activity",
           "exercise": "Exercise", "situation": "Real-world situation"},
}
BRICKS = [("explanation", "Explication"), ("simulator", "Simulateur ou activité"),
          ("exercise", "Exercice"), ("situation", "Situation réelle")]


def text_of(path):
    """Texte utile d'un fichier : commentaires HTML retirés, vide si le fichier n'existe pas."""
    if not path.is_file():
        return ""
    return re.sub(r"<!--.*?-->", "", path.read_text(encoding="utf-8"), flags=re.S)


def sections(text):
    """Titres de niveau 2 dont le corps n'est pas vide, en minuscules."""
    found = set()
    parts = re.split(r"^## +(.+?)\s*$", text, flags=re.M)
    for i in range(1, len(parts), 2):
        if parts[i + 1].strip():
            found.add(parts[i].strip().lower())
    return found


def content_coverage(ref):
    content = ref.root / "content"
    written = {lang: {s["id"] for s in ref.situations
                      if text_of(content / lang / "situations" / f"{s['id']}.md").strip()}
               for lang in LANGS}
    bricks = {}  # (notion, langue) -> ensemble des briques présentes
    for n in ref.notions:
        for lang in LANGS:
            h = HEADINGS[lang]
            present = sections(text_of(content / lang / "notions" / f"{n['id']}.md"))
            got = set()
            if h["explanation"].lower() in present:
                got.add("explanation")
            if h["activity" if n.get("activity") else "simulator"].lower() in present:
                got.add("simulator")
            if h["exercise"].lower() in present:
                got.add("exercise")
            sits = n["situations"]
            if sits == "all" or not sits:
                if h["situation"].lower() in present:
                    got.add("situation")
            elif any(s in written["fr"] and s in written["en"] for s in sits):
                got.add("situation")
            bricks[(n["id"], lang)] = got
    return bricks, written


def main():
    ref = referentiel.load(sys.argv[1] if len(sys.argv) > 1 else referentiel.ROOT)
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
        out.append(f"| {d['id']} · {d['title']['fr']} | {len(mine)} | "
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

    bricks, written = content_coverage(ref)
    covered = [n["id"] for n in notions if all(len(bricks[(n["id"], lang)]) == 4 for lang in LANGS)]
    pct = f"{100 * len(covered) / len(notions) if notions else 0:.1f}".replace(".", ",")  # virgule décimale
    out.append("\n## Couverture des contenus\n")
    out.append(f"Couverture : {len(covered)} notion(s) sur {len(notions)} ({pct} %) ont leurs quatre briques "
               "en français et en anglais.\n")
    out.append("| Brique | FR | EN |")
    out.append("| --- | --- | --- |")
    for key, label in BRICKS:
        out.append(f"| {label} | " + " | ".join(
            str(sum(1 for n in notions if key in bricks[(n['id'], lang)])) for lang in LANGS) + " |")
    out.append("")
    out.append("| Domaine | Couvertes | Notions |")
    out.append("| --- | --- | --- |")
    for d in ref.domains:
        mine = [n["id"] for n in notions if n["_domain"] == d["id"]]
        out.append(f"| {d['id']} | {len([i for i in mine if i in covered])} | {len(mine)} |")
    out.append("")
    out.append(f"Situations rédigées : {len(written['fr'])} sur {len(situations)} en français, "
               f"{len(written['en'])} sur {len(situations)} en anglais.")
    out.append("")
    out.append("| Jalon | Notions couvertes | Situations rédigées FR et EN |")
    out.append("| --- | --- | --- |")
    for j in ref.jalons:
        done = len([i for i in j["notions"] if i in covered])
        both = len([s for s in j["situations"] if s in written["fr"] and s in written["en"]])
        out.append(f"| {j['id']} · {j['title']['fr']} | {done} sur {len(j['notions'])} | {both} sur {len(j['situations'])} |")
    out.append("")
    out.append("Contenus lus dans `content/fr/` et `content/en/` ; règles dans `docs/contenus.md` ; jalons dans `data/jalons.yaml`.")
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
