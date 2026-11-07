#!/usr/bin/env python3
"""Contrôle le référentiel : schémas JSON, puis cohérence entre notions, situations et sources.

Usage : python3 scripts/validate.py [racine du dépôt]

Sort avec le code 1 s'il y a au moins une erreur ; les avertissements ne bloquent pas.
"""
import collections
import json
import pathlib
import re
import sys

import jsonschema

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import referentiel  # noqa: E402

errors = []
warnings = []


def error(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def check_schemas(ref):
    schemas = ref.root / "schemas"

    def validate(schema_name, path, data):
        schema = json.loads((schemas / schema_name).read_text(encoding="utf-8"))
        validator = jsonschema.Draft202012Validator(schema)
        for e in sorted(validator.iter_errors(data), key=lambda e: list(e.absolute_path)):
            where = "/".join(str(p) for p in e.absolute_path) or "(racine)"
            # Un échec de « not » recopie tout l'objet : le $comment du schéma dit mieux ce qui ne va pas.
            message = e.schema.get("$comment", e.message) if e.validator == "not" else e.message
            error(f"{ref.rel(path)} : {where} : {message}")

    for path, data in ref.domain_files:
        validate("domaine.schema.json", path, data)
    validate("retired.schema.json", *ref.retired_file)
    validate("situations.schema.json", *ref.situations_file)
    validate("sources.schema.json", *ref.sources_file)
    validate("jalons.schema.json", *ref.jalons_file)


def duplicates(ids):
    return sorted(i for i, n in collections.Counter(ids).items() if n > 1)


def check_ids(ref):
    for path, data in ref.domain_files:
        code = data["domain"]["id"]
        if path.stem.upper() != code:
            error(f"{ref.rel(path)} : le domaine {code} ne correspond pas au nom du fichier")
        for n in data["notions"]:
            if not re.fullmatch(rf"{code}-\d{{2}}", n["id"]):
                error(f"{ref.rel(path)} : {n['id']} n'a pas le préfixe du domaine {code}")
    for kind, ids in [
        ("domaine", [d["id"] for d in ref.domains]),
        ("notion", [n["id"] for n in ref.notions]),
        ("situation", [s["id"] for s in ref.situations]),
        ("source", [s["id"] for s in ref.sources]),
        ("identifiant retiré", [r["id"] for r in ref.retired]),
    ]:
        for dup in duplicates(ids):
            error(f"{kind} en double : {dup}")


def check_links(ref):
    notions = {n["id"]: n for n in ref.notions}
    situations = {s["id"]: s for s in ref.situations}
    cited = collections.Counter()

    for n in notions.values():
        sits = n["situations"]
        if sits == "all":
            continue
        if not sits and "practice_outside" not in n:
            error(f"{n['id']} : aucune situation et pas de champ practice_outside")
        for sid in sits:
            if sid not in situations:
                error(f"{n['id']} : situation {sid} inexistante")
                continue
            cited[sid] += 1

    for sid, s in situations.items():
        if not cited[sid]:
            error(f"{sid} : citée par aucune notion")
        for nid in s["key_notions"]:
            n = notions.get(nid)
            if n is None:
                error(f"{sid} : notion clé {nid} inexistante")
                continue
            if n["situations"] != "all" and sid not in n["situations"]:
                error(f"{sid} : la notion clé {nid} ne renvoie pas à cette situation")


def check_levels(ref):
    notions = {n["id"]: n for n in ref.notions}
    for s in ref.situations:
        levels = [notions[k]["level"] for k in s["key_notions"] if k in notions]
        if not levels:
            continue
        expected = referentiel.situation_level_rule(levels)
        actual = (s["level"], s["level_max"])
        if actual != expected and not s.get("notes"):
            warn(f"{s['id']} : niveau {actual[0]}/{actual[1]}, la règle donne {expected[0]}/{expected[1]}, sans note")


def check_sources(ref):
    known = {s["id"]: s for s in ref.sources}
    used = set()
    for path, data in ref.domain_files:
        for sid in data["domain"].get("sources", []):
            used.add(sid)
            if sid not in known:
                error(f"{ref.rel(path)} : source de domaine inconnue : {sid}")
    for n in ref.notions:
        for sid in n.get("sources", []):
            used.add(sid)
            if sid not in known:
                error(f"{n['id']} : source inconnue : {sid}")
    for s in ref.situations:
        for sid in s.get("sources", []):
            used.add(sid)
            if sid not in known:
                error(f"{s['id']} : source inconnue : {sid}")
    for sid, s in known.items():
        if sid not in used and not s.get("used_in"):
            warn(f"source {sid} citée nulle part (ni notion, ni domaine, ni situation, ni used_in)")
        for doc in s.get("used_in", []):
            path = ref.root / doc
            if not path.is_file():
                warn(f"source {sid} : used_in renvoie à {doc}, introuvable")
            elif s["url"] not in path.read_text(encoding="utf-8"):
                warn(f"source {sid} : son URL n'apparaît pas dans {doc}")


def check_retired(ref):
    retired = {r["id"]: r for r in ref.retired}
    notion_ids = {n["id"] for n in ref.notions}
    situation_ids = {s["id"] for s in ref.situations}
    live = notion_ids | situation_ids
    for rid, r in retired.items():
        if rid in live:
            error(f"identifiant retiré réutilisé : {rid}")
        target = r.get("merged_into")
        if target and target not in live:
            error(f"{rid} : merged_into renvoie à {target}, inexistant")
    for n in ref.notions:
        if n["situations"] != "all":
            for sid in n["situations"]:
                if sid in retired:
                    error(f"{n['id']} : renvoie à l'identifiant retiré {sid}")
    for s in ref.situations:
        for nid in s["key_notions"]:
            if nid in retired:
                error(f"{s['id']} : notion clé retirée {nid}")


def check_jalons(ref):
    """Un jalon ne cite que des notions et situations existantes, et contient les notions clés de ses situations."""
    notions = {n["id"] for n in ref.notions}
    situations = {s["id"]: s for s in ref.situations}
    retired = {r["id"] for r in ref.retired}
    for dup in duplicates([j["id"] for j in ref.jalons]):
        error(f"jalon en double : {dup}")
    for j in ref.jalons:
        for kind, ids in (("notion", j["notions"]), ("situation", j["situations"])):
            for dup in duplicates(ids):
                error(f"jalon {j['id']} : {kind} en double : {dup}")
        for nid in j["notions"]:
            if nid in retired:
                error(f"jalon {j['id']} : notion retirée {nid}")
            elif nid not in notions:
                error(f"jalon {j['id']} : notion {nid} inexistante")
        for sid in j["situations"]:
            if sid not in situations:
                error(f"jalon {j['id']} : situation {sid} inexistante")
                continue
            for nid in situations[sid]["key_notions"]:
                if nid not in j["notions"]:
                    error(f"jalon {j['id']} : la notion clé {nid} de {sid} manque")


def summary(ref):
    levels = collections.Counter(n["level"] for n in ref.notions)
    detail = ", ".join(f"{levels[lv]} {lv}" for lv in referentiel.LEVELS)
    return (f"{len(ref.notions)} notions ({detail}), {len(ref.situations)} situations, "
            f"{len(ref.sources)} sources, {len(ref.retired)} identifiant(s) retiré(s), {len(ref.jalons)} jalon(s)")


def main():
    ref = referentiel.load(sys.argv[1] if len(sys.argv) > 1 else referentiel.ROOT)
    check_schemas(ref)
    if not errors:
        # Les contrôles de cohérence supposent des fichiers conformes aux schémas.
        check_ids(ref)
        check_links(ref)
        check_levels(ref)
        check_sources(ref)
        check_retired(ref)
        check_jalons(ref)
    for e in errors:
        print(f"ERREUR : {e}")
    for w in warnings:
        print(f"AVERTISSEMENT : {w}")
    if not errors:
        print(summary(ref))
    print(f"{len(errors)} erreur(s), {len(warnings)} avertissement(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
