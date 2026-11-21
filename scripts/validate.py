#!/usr/bin/env python3
"""Contrôle le référentiel : schémas JSON, puis cohérence entre notions, situations et sources ; les fiches de content/
et les titres que le simulateur recopie de data/ ; avec --base, les identifiants et le champ since d'une version à
l'autre.

Usage : python3 scripts/validate.py [racine du dépôt] [--base REF]

--base REF : une autre version du dépôt, la branche cible d'une pull request dans la CI (.github/workflows/validate.yml),
lue par `git show REF:fichier`, sans seconde copie du dépôt. Chaque identifiant de notion ou de situation de REF est
encore dans le référentiel ou dans data/referentiel/retired.yaml, chaque identifiant retiré de REF reste dans
retired.yaml ; une notion ou une situation de REF garde son champ since, et une nouvelle porte celui de la version en
tête de CHANGELOG.md ; une notion ou une situation ajoutée ou retirée demande une version dont Y a augmenté, et un titre
passé d'un identifiant à un autre est une renumérotation (constats RST-03 et RST-05 de l'audit, version 0.3.83).

Sort avec le code 1 s'il y a au moins une erreur ; les avertissements ne bloquent pas.
"""
import argparse
import collections
import json
import pathlib
import re
import subprocess
import sys

import jsonschema

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import changelog  # noqa: E402
import referentiel  # noqa: E402

errors = []
warnings = []


def error(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


_textes = {}


def texte(path, nom):
    """Texte d'un fichier du dépôt, lu une seule fois. S'il ne se lit pas (absent, ou pas en UTF-8), une erreur qui le
    nomme, avec la ligne d'un octet invalide, et None (version 0.3.83 ; avant, pour un fichier cité par `used_in` ou
    une fiche lue pour `terms`, une trace Python qui ne le nommait pas)."""
    if path not in _textes:
        try:
            _textes[path] = referentiel.lire_texte(path, nom)
        except referentiel.LectureImpossible as e:
            error(str(e))
            _textes[path] = None
    return _textes[path]


def where_in(data, path):
    """Chemin d'une erreur de schéma, avec l'identifiant de chaque objet traversé qui en a un :
    « situations/3 (SIT-04)/key_notions » plutôt que « situations/3/key_notions »."""
    parts, node = [], data
    for p in path:
        node = node[p]
        part = str(p)
        if isinstance(p, int) and isinstance(node, dict) and isinstance(node.get("id"), str):
            part += f" ({node['id']})"
        parts.append(part)
    return "/".join(parts) or "(racine)"


def check_schemas(ref):
    schemas = ref.root / "schemas"

    def validate(schema_name, path, data):
        schema = json.loads((schemas / schema_name).read_text(encoding="utf-8"))
        validator = jsonschema.Draft202012Validator(schema)
        # Tri par chemin. Des clés de types différents au même rang (un nombre, un texte, une date) ne se comparent
        # pas entre elles : les nombres d'abord, dans leur ordre, puis le reste comme du texte.
        def rang(p):
            return (0, p) if isinstance(p, (int, float)) else (1, str(p))

        for e in sorted(validator.iter_errors(data), key=lambda e: [rang(p) for p in e.absolute_path]):
            where = where_in(data, e.absolute_path)
            if e.validator == "not":
                # Un échec de « not » recopie tout l'objet : le $comment du schéma dit mieux ce qui ne va pas.
                message = e.schema.get("$comment", e.message)
            elif e.validator == "uniqueItems" and all(isinstance(i, str) for i in e.instance):
                # « [...] has non-unique elements » recopie la liste sans dire quel élément est répété (RST-07).
                message = "en double : " + ", ".join(duplicates(e.instance))
            else:
                message = e.message
            error(f"{ref.rel(path)} : {where} : {message}")

    for path, data in ref.domain_files:
        validate("domaine.schema.json", path, data)
    validate("retired.schema.json", *ref.retired_file)
    validate("situations.schema.json", *ref.situations_file)
    validate("sources.schema.json", *ref.sources_file)
    validate("jalons.schema.json", *ref.jalons_file)
    validate("relecture.schema.json", *ref.relecture_file)


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
        # Pas de « uniqueItems » dans le schéma pour ce champ : pris dans l'alternative « all » ou une liste, son
        # message y serait « is not valid under any of the given schemas », sans dire pourquoi (constat RST-07).
        for dup in duplicates(sits):
            error(f"{n['id']} : situation en double : {dup}")
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
    """Règle de niveau d'une situation (`rules`, `level`, de data/situations.yaml). Un écart sans raison écrite dans
    `notes`, et un `level` au-dessus de `level_max`, sont des erreurs (constat RST-06 de l'audit, version 0.3.82). La
    dérogation par `notes` est celle que la règle écrit ; la règle de la médiane attend la confirmation de Julien
    (D32 (2), docs/etat-des-travaux.md)."""
    notions = {n["id"]: n for n in ref.notions}
    for s in ref.situations:
        if referentiel.LEVELS.index(s["level"]) > referentiel.LEVELS.index(s["level_max"]):
            error(f"{s['id']} : level {s['level']} au-dessus de level_max {s['level_max']}")
        levels = [notions[k]["level"] for k in s["key_notions"] if k in notions]
        if not levels:
            continue
        expected = referentiel.situation_level_rule(levels)
        actual = (s["level"], s["level_max"])
        if actual != expected and not s.get("notes"):
            error(f"{s['id']} : niveau {actual[0]}/{actual[1]}, la règle de data/situations.yaml donne "
                  f"{expected[0]}/{expected[1]} ; corriger le niveau, ou écrire la raison de l'écart dans notes")


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
        for t in n.get("terms", []):
            for sid in t["sources"]:
                used.add(sid)
                if sid not in known:
                    error(f"{n['id']} : terms, {t['body']} : source inconnue : {sid}")
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
                continue
            contenu = texte(path, doc)
            if contenu is not None and s["url"] not in contenu:
                warn(f"source {sid} : son URL n'apparaît pas dans {doc}")


def check_terms(ref):
    """Champ `terms` (décision D3 de Julien, 15 novembre 2026) : un seul bloc par boîtier, un boîtier nommé d'après sa
    marque, et chaque terme écrit tel quel, en mot entier, dans la fiche de la notion quand elle existe. Le contrôle ne
    vérifie pas à quel boîtier la fiche attribue le terme, ni l'inverse ; une lettre seule (« A », « S ») s'y trouve
    presque toujours."""
    for n in ref.notions:
        terms = n.get("terms", [])
        for dup in duplicates([t["body"] for t in terms]):
            error(f"{n['id']} : terms, boîtier en double : {dup}")
        for t in terms:
            if not re.match(rf"{t['brand']}(?!\w)", t["body"].lower()):
                error(f"{n['id']} : terms, le boîtier « {t['body']} » ne commence pas par sa marque ({t['brand']})")
        path = ref.root / "content" / "notions" / f"{n['id']}.md"
        if not terms or not path.is_file():
            continue
        text = texte(path, ref.rel(path))
        if text is None:
            continue
        for t in terms:
            for name in t["names"]:
                # Le terme entier, pas un morceau de mot : « Av » ne doit pas se trouver dans « Avec ».
                if not re.search(rf"(?<!\w){re.escape(name)}(?!\w)", text):
                    error(f"{n['id']} : terms, {t['body']} : « {name} » n'est pas dans {ref.rel(path)}")


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


def check_relecture(ref):
    """Une fiche relue existe, et n'est listée qu'une fois (data/relecture.yaml)."""
    for dup in duplicates([r["fiche"] for r in ref.relues]):
        error(f"relecture : fiche {dup} en double")
    for r in ref.relues:
        kind = "situations" if r["fiche"].startswith("SIT-") else "notions"
        path = ref.root / "content" / kind / f"{r['fiche']}.md"
        if not path.is_file():
            error(f"relecture : {ref.rel(path)} introuvable")


def ecart(lu, attendu):
    """Première différence entre deux textes, par sa colonne et ses caractères (U+XXXX) : un écart invisible, une espace
    insécable ou une lettre accentuée écrite en deux caractères, se voit ainsi (relecture de la version 0.3.83, C4)."""
    for colonne, (a, b) in enumerate(zip(lu, attendu), 1):
        if a != b:
            return f"colonne {colonne} : U+{ord(a):04X} au lieu de U+{ord(b):04X}"
    if len(lu) > len(attendu):
        return f"colonne {len(attendu) + 1} : U+{ord(lu[len(attendu)]):04X} en trop"
    return f"colonne {len(lu) + 1} : U+{ord(attendu[len(lu)]):04X} manque"


ENTREE_NOTION = re.compile(r"((?:[A-Z]{3}|SIT-V2)-\d{2}) (.+)")


def check_content(ref):
    """Fiches de content/ (constats RST-02 et CHX-05 de l'audit, version 0.3.83). La construction des pages publie chaque
    fichier .md de content/notions/ et de content/situations/ dont le nom a la forme d'un identifiant, et prend le titre
    de la page dans sa première ligne qui n'est pas blanche. Le nom du fichier est l'identifiant d'une notion du
    référentiel, ou d'une situation, rangée dans le dossier de son genre, jamais un identifiant retiré ; la première
    ligne est « # ID · titre », avec le titre de data/. Au-delà du plan, la section « Notions » d'une fiche de situation
    donne le titre de data/ de chaque notion (`check_notions_de_situation`). Les fichiers sont lus comme les lit la
    construction (scripts/referentiel.py, « Fiches de content/ »)."""
    retired = {r["id"]: r for r in ref.retired}
    notions = {n["id"]: n for n in ref.notions}
    fichier_du_domaine = {data["domain"]["id"]: ref.rel(path) for path, data in ref.domain_files}
    genres = {
        "notions": ("une notion", notions),
        "situations": ("une situation", {s["id"]: s for s in ref.situations}),
    }
    for dossier, (genre, objets) in genres.items():
        autre = "situations" if dossier == "notions" else "notions"
        for path in sorted((ref.root / "content" / dossier).glob("*.md")):
            fid, where = path.stem, ref.rel(path)
            if fid in retired:
                cible = retired[fid].get("merged_into")
                fusion = f", fusionné dans {cible}" if cible else ""
                error(f"{where} : {fid} est un identifiant retiré (data/referentiel/retired.yaml{fusion}) : "
                      f"il n'a pas de fiche")
                continue
            if fid in genres[autre][1]:
                error(f"{where} : {fid} est {genres[autre][0]} ; sa fiche va dans content/{autre}/")
                continue
            if fid not in objets:
                error(f"{where} : {fid} n'est pas {genre} du référentiel")
                continue
            contenu = texte(path, where)
            if contenu is None:
                continue
            contenu = referentiel.normaliser(contenu)
            obj = objets[fid]
            origine = fichier_du_domaine[obj["_domain"]] if dossier == "notions" else ref.rel(ref.situations_file[0])
            attendu = f"# {fid} · {obj['title']}"
            premiere = referentiel.premiere_ligne(contenu)
            if premiere is None:
                error(f"{where} : fichier vide ; sa première ligne est « {attendu} », avec le titre de {origine}")
            elif premiere[1] != attendu:
                # La colonne et le caractère de l'écart, quand la ligne est bien un titre de cette fiche.
                detail = f" ({ecart(premiere[1], attendu)})" if premiere[1].startswith(f"# {fid} ") else ""
                error(f"{where}, ligne {premiere[0]} : « {premiere[1]} » ; le titre de {origine} donne « {attendu} »"
                      f"{detail}")
            if dossier == "situations":
                check_notions_de_situation(where, contenu, notions, retired, fichier_du_domaine)


def check_notions_de_situation(where, contenu, notions, retired, fichier_du_domaine):
    """Section « Notions » d'une fiche de situation, au-delà du plan (relecture de la version 0.3.83, constat S1) : une
    liste « ID titre ; ID titre. » où chaque code est suivi du titre de la notion (docs/contenus.md), lue comme un
    paragraphe, ses lignes jointes par une espace. Chaque entrée a cette forme, et son titre est celui de data/. Ni
    l'ordre des notions ni la liste elle-même ne sont contrôlés."""
    lignes = contenu.split("\n")
    debut = next((i for i, ligne in enumerate(lignes, 1)
                  if ligne.startswith("## ") and referentiel.sans_blancs(ligne[3:]) == "Notions"), None)
    if debut is None:
        return
    corps = []
    for numero in range(debut + 1, len(lignes) + 1):
        ligne = lignes[numero - 1]
        if ligne.startswith("## "):
            break
        if referentiel.sans_blancs(ligne):
            corps.append((numero, referentiel.sans_blancs(ligne)))
    if not corps:
        return  # section vide : la construction des pages la refuse
    numero, paragraphe = corps[0][0], " ".join(ligne for _, ligne in corps)
    for entree in paragraphe.removesuffix(".").split(" ; "):
        m = ENTREE_NOTION.fullmatch(entree)
        if m is None:
            error(f"{where}, ligne {numero} : section « Notions », « {entree} » n'a pas la forme « ID titre » "
                  f"(docs/contenus.md)")
        elif m[1] in retired:
            error(f"{where}, ligne {numero} : section « Notions », {m[1]} est un identifiant retiré "
                  f"(data/referentiel/retired.yaml)")
        elif m[1] not in notions:
            error(f"{where}, ligne {numero} : section « Notions », {m[1]} n'est pas une notion du référentiel")
        elif m[2] != notions[m[1]]["title"]:
            titre = notions[m[1]]["title"]
            error(f"{where}, ligne {numero} : section « Notions », {m[1]} « {m[2]} » ; le titre de "
                  f"{fichier_du_domaine[notions[m[1]]['_domain']]} est « {titre} » ({ecart(m[2], titre)})")


CHALLENGES_TS = "app/src/ui/challenges.ts"
TEXTS_TS = "app/src/texts.ts"


def entrees_du_bloc(contenu, fichier, debut, entree, forme, traiter):
    """Lit un bloc de code TypeScript, de la ligne `debut` à la première ligne qui commence par « } », et appelle
    `traiter(numéro de ligne, résultat de l'expression entree)` pour chaque entrée, dans l'ordre des lignes. Une ligne
    qui n'est ni vide, ni un commentaire « // », ni une entrée, est une erreur (`forme` dit la forme attendue) : une
    entrée écrite autrement ne passe pas sans être contrôlée. La fin du bloc est « }; » seul sur sa ligne ; une autre fin
    est une erreur, une seule (relecture de la version 0.3.83, constat C5). Rend le nombre d'entrées lues."""
    lignes = contenu.split("\n")
    if debut not in lignes:
        error(f"{fichier} : ligne « {debut} » introuvable")
        return 0
    lues = 0
    for numero in range(lignes.index(debut) + 2, len(lignes) + 1):
        ligne = lignes[numero - 1]
        if ligne.startswith("}"):
            if ligne != "};":
                error(f"{fichier}, ligne {numero} : fin du bloc « {debut} » écrite « {ligne} » ; forme attendue : "
                      f"« }}; » seul sur sa ligne")
            return lues
        if not ligne.strip() or ligne.strip().startswith("//"):
            continue
        m = re.fullmatch(entree, ligne)
        if m is None:
            error(f"{fichier}, ligne {numero} : ligne non reconnue ; forme attendue : {forme}")
        else:
            lues += 1
            traiter(numero, m)
    error(f"{fichier} : fin du bloc « {debut} » introuvable")
    return lues


def check_app_titles(ref):
    """Titres de data/ recopiés dans le code du simulateur (constats CHX-05 et ARC-07 de l'audit, version 0.3.83) : la
    table NOTION_TITLES de app/src/ui/challenges.ts, les notions « À revoir » du bulletin de la photo ; et, au-delà du
    plan, les titres des défis de la fenêtre « Défis », clés de app/src/texts.ts que nomme la table CHALLENGE_KEYS du
    même fichier. Chacun est le titre de la notion ou de la situation dans data/. La copie reste une copie : ce contrôle
    dit quand elle s'en écarte. Il ne contrôle pas que chaque notion citée par le bulletin (app/src/camera/bulletin.ts)
    a son titre dans NOTION_TITLES."""
    notions = {n["id"]: n for n in ref.notions}
    situations = {s["id"]: s for s in ref.situations}
    retired = {r["id"] for r in ref.retired}
    source = texte(ref.root / CHALLENGES_TS, CHALLENGES_TS)
    if source is None:
        return
    # Fins de ligne CRLF ramenées à LF, comme pour les fiches : une copie de travail sous Windows (relecture, C1).
    source = referentiel.normaliser(source)

    def comparer(fichier, numero, fid, titre, objets, genre):
        if fid in retired:
            error(f"{fichier}, ligne {numero} : {fid} est un identifiant retiré (data/referentiel/retired.yaml)")
        elif fid not in objets:
            error(f"{fichier}, ligne {numero} : {fid} n'est pas {genre} du référentiel")
        elif titre != objets[fid]["title"]:
            error(f"{fichier}, ligne {numero} : {fid}, « {titre} » ; le titre de data/ est « {objets[fid]['title']} » "
                  f"({ecart(titre, objets[fid]['title'])})")

    entrees_du_bloc(source, CHALLENGES_TS, "const NOTION_TITLES: Record<string, string> = {",
                    r'  "([A-Z]{3}-\d{2})": "([^"\\]*)",', '« "EXP-04": "Titre", »',
                    lambda numero, m: comparer(CHALLENGES_TS, numero, m[1], m[2], notions, "une notion"))

    messages = texte(ref.root / TEXTS_TS, TEXTS_TS)
    lignes = referentiel.normaliser(messages).split("\n") if messages is not None else None

    def titre_du_defi(numero, m):
        if lignes is None:
            return
        fid, cle = m[1], m[2]
        lues = [(i, re.fullmatch(rf'  {cle}: "([^"\\]*)",', ligne)) for i, ligne in enumerate(lignes, 1)]
        lues = [(i, lu) for i, lu in lues if lu]
        if not lues:
            error(f"{TEXTS_TS} : clé {cle} ({fid}, {CHALLENGES_TS}, ligne {numero}) introuvable, ou écrite autrement "
                  f"que « {cle}: \"Titre\", »")
        else:
            comparer(TEXTS_TS, lues[0][0], fid, lues[0][1][1], situations, "une situation")

    entrees_du_bloc(source, CHALLENGES_TS,
                    "const CHALLENGE_KEYS: Record<ChallengeId, { title: MessageKey; goal: MessageKey }> = {",
                    r'  "((?:[A-Z]{3}|SIT-V2)-\d{2})": \{ title: "(\w+)", goal: "\w+" \},',
                    '« "SIT-01": { title: "challenge01Title", goal: "challenge01Goal" }, »', titre_du_defi)


def lire_base(ref, base):
    """Une autre version du dépôt (`base`), lue par git show comme le fait scripts/changelog.py : pour ses notions et ses
    situations, identifiant → (since, titre) ; ses identifiants retirés ; la version en tête de son CHANGELOG.md (None
    s'il n'en a pas). Les chemins sont donnés à git depuis la racine (« ./ »), qui peut être un sous-dossier d'un dépôt.
    Lève `referentiel.LectureImpossible`, avec la dernière ligne de l'erreur de git (relecture, C6)."""
    def git(*args):
        try:
            return subprocess.run(["git", *args], cwd=ref.root, capture_output=True)
        except OSError as e:
            raise referentiel.LectureImpossible(f"git ne se lance pas ({e.strerror or e})") from e

    def raison(r):
        lignes = r.stderr.decode("utf-8", "replace").strip().splitlines()
        return f" (git : {lignes[-1]})" if lignes else ""

    r = git("rev-parse", "--verify", f"{base}^{{commit}}")
    if r.returncode != 0:
        raise referentiel.LectureImpossible(f"base introuvable : {base}{raison(r)}")

    def lire(chemin):
        r = git("show", f"{base}:./{chemin}")
        return r.stdout if r.returncode == 0 else None

    r = git("ls-tree", "-z", "--name-only", base, "--", "data/referentiel/")
    if r.returncode != 0:
        raise referentiel.LectureImpossible(f"{base} : data/referentiel/ illisible{raison(r)}")
    domaines = sorted(n for n in r.stdout.decode("utf-8", "replace").split("\0")
                      if n.endswith(".yaml") and n != "data/referentiel/retired.yaml")
    situations = lire("data/situations.yaml")
    if not domaines or situations is None:
        raise referentiel.LectureImpossible(f"{base} : data/referentiel/*.yaml ou data/situations.yaml introuvable")

    def charger(chemin, octets):
        if octets is None:
            raise referentiel.LectureImpossible(f"{base}:{chemin} : illisible")
        return referentiel.load_yaml_octets(octets, f"{base}:{chemin}")

    try:
        vivants = {}
        for chemin in domaines:
            for n in charger(chemin, lire(chemin))["notions"]:
                vivants[n["id"]] = (n["since"], n.get("title"))
        for s in charger("data/situations.yaml", situations)["situations"]:
            vivants[s["id"]] = (s["since"], s.get("title"))
        octets = lire("data/referentiel/retired.yaml")
        retires = [r["id"] for r in charger("data/referentiel/retired.yaml", octets)["retired"]] if octets else []
    except (KeyError, TypeError) as e:
        raise referentiel.LectureImpossible(f"{base} : référentiel d'une autre forme que celle attendue ({e!r})") from e
    octets = lire(changelog.CHANGELOG)
    versions = changelog.parse(referentiel.lire_octets(octets, f"{base}:{changelog.CHANGELOG}"))[0] if octets else []
    return vivants, retires, versions[0] if versions else None


def check_base(ref, base):
    """Ce qu'une version change aux identifiants et au champ since, par rapport à `base` (constats RST-03 et RST-05 de
    l'audit, version 0.3.83 ; règles : CLAUDE.md, « Identifiants stables, jamais renumérotés ; un identifiant retiré va
    dans data/referentiel/retired.yaml », et CHANGELOG.md, « Numérotation »). Au-delà du plan (relecture, C2 et C3) : un
    titre passé d'un identifiant à un autre est une renumérotation ; une notion ou une situation ajoutée ou retirée fait
    monter Y. La hausse de Y pour un reclassement (niveau, notions clés, activité : décision D9) n'est pas contrôlée."""
    try:
        vivants, retires, tete_base = lire_base(ref, base)
    except referentiel.LectureImpossible as e:
        error(f"--base : {e}")
        return
    actuels = {n["id"]: n for n in ref.notions} | {s["id"]: s for s in ref.situations}
    retires_ici = {r["id"] for r in ref.retired}
    for i, (since, _) in vivants.items():
        if i in actuels:
            if actuels[i]["since"] != since:
                error(f"{i} : since {actuels[i]['since']}, {since} dans {base} ; une notion ou une situation garde le "
                      f"since de la version qui l'a introduite")
        elif i not in retires_ici:
            error(f"{i} : présent dans {base}, absent du référentiel et de data/referentiel/retired.yaml ; un "
                  f"identifiant n'est jamais renuméroté ni supprimé : celui qui sort du référentiel va dans retired.yaml")
    for i in retires:
        if i not in retires_ici:
            error(f"{i} : retiré dans {base}, absent de data/referentiel/retired.yaml ; un identifiant retiré y reste")

    # Renumérotation où rien ne disparaît (une notion insérée et les suivantes décalées, deux identifiants échangés) :
    # le titre qu'avait un identifiant dans la base est maintenant celui d'un autre, du même genre.
    titres = collections.defaultdict(list)
    for i, obj in actuels.items():
        titres[(i.startswith("SIT-"), obj["title"])].append(i)
    for i, (_, titre) in vivants.items():
        if i not in actuels or not isinstance(titre, str) or actuels[i]["title"] == titre:
            continue
        for j in titres[(i.startswith("SIT-"), titre)]:
            if j != i:
                error(f"{j} : porte le titre « {titre} », celui de {i} dans {base}, et {i} en porte un autre "
                      f"(« {actuels[i]['title']} ») ; un identifiant n'est jamais renuméroté : une notion garde le sien, "
                      f"une nouvelle prend un numéro libre")

    ajoutes = [i for i in actuels if i not in vivants]
    sortis = [i for i in vivants if i not in actuels and i in retires_ici]
    if not ajoutes and not sortis:
        return
    contenu = texte(ref.root / changelog.CHANGELOG, changelog.CHANGELOG)
    versions = changelog.parse(contenu)[0] if contenu is not None else []
    if not versions:
        error(f"{changelog.CHANGELOG} : aucun titre de version lisible ; la version de {', '.join(ajoutes + sortis)} "
              f"n'est pas contrôlée")
        return
    tete = versions[0]
    if tete_base is not None and tete["key"][:2] <= tete_base["key"][:2]:
        x, y = tete_base["key"][0], tete_base["key"][1] + 1
        since = f" ; une notion ou une situation nouvelle y prend since: v{x}.{y}" if ajoutes else ""
        error(f"{', '.join(ajoutes + sortis)} : ajouté ou retiré, alors que la version en tête de "
              f"{changelog.CHANGELOG}, {tete['version']}, a le même Y que celle de {base}, {tete_base['version']} ; "
              f"d'après {changelog.CHANGELOG}, « Numérotation », Y augmente : version {x}.{y}.0{since}")
        return
    attendu = f"v{tete['key'][0]}.{tete['key'][1]}"
    for i in ajoutes:
        if actuels[i]["since"] != attendu:
            error(f"{i} : nouvel identifiant, since {actuels[i]['since']} ; la version en tête de "
                  f"{changelog.CHANGELOG}, {tete['version']}, donne since {attendu}")


def summary(ref):
    levels = collections.Counter(n["level"] for n in ref.notions)
    detail = ", ".join(f"{levels[lv]} {lv}" for lv in referentiel.LEVELS)
    return (f"{len(ref.notions)} notions ({detail}), {len(ref.situations)} situations, "
            f"{len(ref.sources)} sources, {len(ref.retired)} identifiant(s) retiré(s), {len(ref.jalons)} jalon(s)")


def arguments():
    parser = argparse.ArgumentParser(description="Contrôle le référentiel (data/), les fiches (content/) et les titres "
                                                 "que le simulateur recopie de data/.")
    parser.add_argument("racine", nargs="?", default=referentiel.ROOT, help="racine du dépôt (par défaut : celle du script)")
    parser.add_argument("--base", metavar="REF", help="version du dépôt à laquelle comparer les identifiants, leurs "
                                                      "titres, le champ since et la version en tête du changelog "
                                                      "(branche cible d'une pull request)")
    return parser.parse_args()


def main():
    args = arguments()
    try:
        ref = referentiel.load(args.racine)
    except referentiel.LectureImpossible as e:
        # Fichier qui ne se lit pas (faute de syntaxe, clé écrite deux fois…) : rien d'autre ne peut être contrôlé.
        print(f"ERREUR : {e}")
        print("1 erreur(s), 0 avertissement(s)")
        return 1
    check_schemas(ref)
    if not errors:
        # Les contrôles de cohérence supposent des fichiers conformes aux schémas.
        check_ids(ref)
        check_links(ref)
        check_levels(ref)
        check_sources(ref)
        check_terms(ref)
        check_retired(ref)
        check_jalons(ref)
        check_relecture(ref)
        check_content(ref)
        check_app_titles(ref)
        if args.base:
            check_base(ref, args.base)
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
