#!/usr/bin/env python3
"""Contrôle les scènes 3D publiées dans le site (app/public/scenes/).

Pour chaque scène, le manifeste scene.json doit :
- respecter schemas/scene.schema.json (licence CC0 ou CC BY, auteur, page d'origine, date de vérification) ;
- lister chaque fichier de la scène une fois et une seule, avec sa taille et son empreinte SHA-256 exactes ;
- ne nommer, dans `situations`, que des situations de data/situations.yaml ;
- donner à chaque élément une date `verified` qui existe, au plus un jour après la date du jour en UTC.

Le manifeste n'est pas cru sur parole : ce que les fichiers d'un élément disent de lui est comparé à ce que le manifeste
en dit (constat LIC-05 de l'audit, docs/audit/licences-scripts-ci.md ; version 0.4.16).
- Un fichier license.txt, lu au format des archives de Sketchfab, et le bloc `asset.extras` d'un fichier glTF (.gltf,
  ou .glb, dont le JSON est le premier bloc) : titre, page d'origine, auteur et licence sont ceux du manifeste.
- Un élément dont la page d'origine est sur sketchfab.com liste son license.txt (docs/licences.md).
- Dans un fichier glTF, toute propriété `uri` est une uri en `data:` ou le chemin relatif d'un fichier listé de la
  scène.

Ce que le script ne contrôle pas : docs/licences.md, « Règles pour les scènes 3D ».

Limites de taille, provisoires (décision du 8 novembre 2026, à revoir avec les tests sur téléphone) :
- 25 Mio par fichier : limite d'envoi d'un fichier par le navigateur sur GitHub, bien en deçà de
  l'avertissement de Git à 50 Mio et du blocage à 100 Mio (docs GitHub « About large files on GitHub »,
  dépôt github/docs, commit 8cd1075 du 6 novembre 2026) ;
- 100 Mio par scène : ce que le navigateur télécharge pour afficher une scène.

Usage : python3 scripts/check_scenes.py [racine du dépôt]
Sort avec le code 1 s'il y a au moins une erreur.
"""
import datetime
import hashlib
import json
import pathlib
import posixpath
import re
import struct
import sys
import urllib.parse

import jsonschema

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import referentiel  # noqa: E402

MIB = 1024 * 1024
MAX_FILE = 25 * MIB
MAX_SCENE = 100 * MIB

# Adresse du texte de chaque licence admise, par son identifiant SPDX (schemas/scene.schema.json).
LICENCES = {
    "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/",
}

# Ce qu'une archive de Sketchfab dit du modèle qu'elle contient. Son fichier license.txt a quatre lignes de la forme
# « * champ:<tabulation>valeur » : « title », « source » (la page du modèle), « author » (le nom, puis l'adresse de son
# profil entre parenthèses) et « license type » (l'identifiant SPDX de la licence, puis l'adresse de son texte entre
# parenthèses, en http). Ses fichiers glTF portent les mêmes valeurs dans le bloc `asset.extras`, sous les clés title,
# source, author et license. Forme relevée sur les cinq modèles de la scène de parc, sous CC BY 4.0 (« CC-BY-4.0 »), et
# sur l'archive glTF et le fichier GLB d'un modèle sous CC0 (« CC0-1.0 »), téléchargés le 28 novembre 2026
# [sketchfab-archive-cc0].
CHAMPS = ("title", "source", "author", "license")
LIGNE_DE_LICENSE_TXT = re.compile(r"\* (title|source|author|license type):[ \t]*(.*)")
# « https?:/{2} » plutôt que les deux barres : ce fichier ne contient ainsi pas d'autre adresse que celles de LICENCES.
VALEUR_ET_ADRESSE = re.compile(r"(.*\S)\s+\((https?:/{2}[^\s()]+)\)")


def lire_license_txt(octets):
    """Les quatre champs d'un license.txt de Sketchfab. Lève ValueError s'il n'en a pas la forme : un fichier que le
    script ne sait pas lire n'est comparé à rien."""
    try:
        texte = octets.decode("utf-8")
    except UnicodeDecodeError as e:
        raise ValueError("le fichier n'est pas en UTF-8") from e
    champs = {}
    for ligne in texte.splitlines():
        trouve = LIGNE_DE_LICENSE_TXT.fullmatch(ligne.strip())
        if not trouve:
            continue
        champ = "license" if trouve.group(1) == "license type" else trouve.group(1)
        if champ in champs:
            raise ValueError(f"ligne « * {trouve.group(1)}: » écrite deux fois")
        champs[champ] = trouve.group(2).strip()
    absents = [champ for champ in CHAMPS if not champs.get(champ)]
    if absents:
        noms = ", ".join("license type" if champ == "license" else champ for champ in absents)
        raise ValueError(f"format des archives de Sketchfab non reconnu (ligne absente ou vide : {noms})")
    return champs


def json_de_gltf(chemin, octets):
    """L'objet JSON d'un fichier glTF : le fichier .gltf, ou le premier bloc d'un fichier .glb. Lève ValueError s'il ne
    se lit pas.

    Conteneur GLB, d'après la spécification de glTF 2.0 [khronos-gltf-2-0] : des entiers de 32 bits, octet de poids
    faible en premier ; « magic » (0x46546C67, « glTF » en ASCII), « version » (2) et « length » ; puis des blocs,
    chacun précédé de sa longueur et de son type. Le JSON est le premier bloc, de type 0x4E4F534A. Ni la longueur
    annoncée ni les blocs suivants ne sont lus."""
    if chemin.lower().endswith(".glb"):
        if len(octets) < 20 or octets[:4] != b"glTF":
            raise ValueError("en-tête d'un fichier GLB absent")
        version, _, longueur_json, type_du_bloc = struct.unpack_from("<4I", octets, 4)
        if version != 2:
            raise ValueError(f"conteneur GLB de version {version}, 2 attendue")
        if type_du_bloc != 0x4E4F534A or 20 + longueur_json > len(octets):
            raise ValueError("premier bloc du fichier GLB : un bloc JSON entier est attendu")
        octets = octets[20:20 + longueur_json]
    try:
        # « utf-8-sig » : une marque d'ordre des octets en tête est passée. La spécification demande un JSON écrit
        # sans elle (« SHOULD ») ; un fichier qui en a une est lu quand même, pour que ses `uri` soient contrôlées.
        gltf = json.loads(octets.decode("utf-8-sig"))
    except UnicodeDecodeError as e:
        raise ValueError("le JSON n'est pas en UTF-8") from e
    except (ValueError, RecursionError) as e:
        raise ValueError(f"JSON invalide ({e})") from e
    if not isinstance(gltf, dict):
        raise ValueError("le JSON n'est pas un objet")
    return gltf


def proprietes_uri(gltf):
    """Toutes les propriétés `uri` d'un JSON de glTF, où qu'elles soient, dans l'ordre du fichier : (endroit, valeur).
    La spécification en définit deux, celles des tampons (`buffers`) et des images ; une extension peut en ajouter.
    Parcours sans récursion : la profondeur du JSON ne compte pas."""
    trouvees, pile = [], [("", gltf, False)]
    while pile:
        ou, noeud, est_une_uri = pile.pop()
        if est_une_uri:
            trouvees.append((ou, noeud))
        elif isinstance(noeud, dict):
            for cle, valeur in reversed(noeud.items()):
                pile.append((f"{ou}.{cle}" if ou else cle, valeur, cle == "uri"))
        elif isinstance(noeud, list):
            for i in range(len(noeud) - 1, -1, -1):
                pile.append((f"{ou}[{i}]", noeud[i], False))
    return trouvees


def fichier_vise(chemin_du_gltf, uri):
    """Chemin, dans la scène, que désigne une `uri` prise pour un chemin relatif au fichier glTF, échappements en « % »
    décodés. La spécification de glTF 2.0 ne connaît que deux formes d'`uri`, « `data:` URLs and relative paths without
    parameters », et laisse un chargeur libre d'en suivre d'autres (« such as `https://` or `file://` schemes,
    authorities, absolute paths, and query or fragment parameters ») [khronos-gltf-2-0]. Une `uri` de ces autres formes
    donne ici un chemin qu'aucun manifeste ne peut lister : les chemins d'un manifeste n'ont que des lettres sans
    accent, des chiffres, « _ », « . », « - » et « / », ne commencent pas par « / » et n'ont pas de segment « .. »."""
    return posixpath.normpath(posixpath.join(posixpath.dirname(chemin_du_gltf), urllib.parse.unquote(uri)))


def valeur_et_adresse(valeur):
    """(« Renderpeople », « https:… ») pour « Renderpeople (https:…) » ; (valeur, None) sans adresse entre
    parenthèses à la fin."""
    trouve = VALEUR_ET_ADRESSE.fullmatch(valeur.strip())
    return (trouve.group(1), trouve.group(2)) if trouve else (valeur.strip(), None)


def ecarts(asset, lu):
    """Ce qu'un fichier de l'élément dit de lui (`lu` : tout ou partie de title, source, author et license) et que le
    manifeste ne dit pas. L'auteur du fichier doit être le seul auteur du manifeste. La licence se compare par son
    identifiant et, quand le fichier la donne, par l'adresse de son texte, que Sketchfab écrit en http."""
    out = []
    if "title" in lu and lu["title"] != asset["title"]:
        out.append(f"titre « {lu['title']} », le manifeste indique « {asset['title']} »")
    if "source" in lu and lu["source"] != asset["source"]:
        out.append(f"page d'origine « {lu['source']} », le manifeste indique « {asset['source']} »")
    if "author" in lu:
        auteur, _ = valeur_et_adresse(lu["author"])
        if asset["authors"] != [auteur]:
            out.append(f"auteur « {auteur} », le manifeste indique « {' ; '.join(asset['authors'])} »")
    if "license" in lu:
        licence, adresse = valeur_et_adresse(lu["license"])
        if adresse is not None:
            adresse = re.sub(r"^http:", "https:", adresse)
        if licence != asset["license"] or adresse not in (None, asset["license_url"]):
            out.append(
                f"licence « {lu['license']} », le manifeste indique {asset['license']} ({asset['license_url']})"
            )
    return out


def main(root, today=None):
    """`today` : la date du jour, pour les essais ; par défaut, celle de l'horloge, en UTC."""
    scenes_dir = root / "app" / "public" / "scenes"
    schema = json.loads((root / "schemas" / "scene.schema.json").read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    today = today or datetime.datetime.now(datetime.timezone.utc).date()
    errors = []

    def rel(path):
        return path.relative_to(root).as_posix()

    if not scenes_dir.is_dir():
        print("Aucune scène (app/public/scenes/ absent).")
        return 0

    # Les situations du référentiel, pour le champ `situations` des manifestes ; None si elles ne se lisent pas.
    try:
        situations = referentiel.load_yaml(root / "data" / "situations.yaml", "data/situations.yaml")
        connues = {situation["id"] for situation in situations["situations"]}
    except referentiel.LectureImpossible as e:
        errors.append(str(e))
        connues = None
    except (KeyError, TypeError):
        errors.append("data/situations.yaml : liste des situations illisible")
        connues = None

    for stray in sorted(p for p in scenes_dir.iterdir() if p.is_file()):
        errors.append(f"{rel(stray)} : fichier hors d'un dossier de scène")

    for scene_dir in sorted(p for p in scenes_dir.iterdir() if p.is_dir()):
        manifest_path = scene_dir / "scene.json"
        if not manifest_path.is_file():
            errors.append(f"{rel(scene_dir)} : scene.json manquant")
            continue
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except UnicodeDecodeError:
            errors.append(f"{rel(manifest_path)} : le fichier n'est pas en UTF-8")
            continue
        except json.JSONDecodeError as e:
            errors.append(f"{rel(manifest_path)} : JSON invalide ({e})")
            continue
        schema_errors = sorted(validator.iter_errors(manifest), key=lambda e: list(e.absolute_path))
        for e in schema_errors:
            where = "/".join(str(p) for p in e.absolute_path) or "(racine)"
            errors.append(f"{rel(manifest_path)} : {where} : {e.message}")
        if schema_errors:
            continue
        if manifest["id"] != scene_dir.name:
            errors.append(f"{rel(manifest_path)} : id « {manifest['id']} » différent du nom du dossier")
        for situation in manifest["situations"]:
            if connues is not None and situation not in connues:
                errors.append(f"{rel(manifest_path)} : situation {situation} absente de data/situations.yaml")

        listed = {}
        asset_ids = set()
        a_comparer = []  # (élément, chemin, octets) de chaque license.txt et de chaque fichier glTF lu
        for asset in manifest["assets"]:
            if asset["id"] in asset_ids:
                errors.append(f"{rel(manifest_path)} : élément {asset['id']} en double")
            asset_ids.add(asset["id"])
            expected_url = LICENCES[asset["license"]]
            if asset["license_url"] != expected_url:
                errors.append(f"{rel(manifest_path)} : {asset['id']} : license_url attendue {expected_url}")
            # Le schéma ne contrôle que la forme de la date. Un jour d'avance est admis : la CI compte en UTC, et la
            # date peut avoir été écrite à l'heure de Paris, en avance sur l'UTC (contre-vérification de LIC-05).
            try:
                verified = datetime.date.fromisoformat(asset["verified"])
            except ValueError:
                errors.append(
                    f"{rel(manifest_path)} : {asset['id']} : verified « {asset['verified']} » n'est pas une date"
                )
            else:
                if verified > today + datetime.timedelta(days=1):
                    errors.append(
                        f"{rel(manifest_path)} : {asset['id']} : verified « {asset['verified']} » est dans le futur "
                        f"(date du jour en UTC : {today.isoformat()} ; un jour d'avance est admis)"
                    )
            names = [entry["path"].rsplit("/", 1)[-1] for entry in asset["files"]]
            host = urllib.parse.urlsplit(asset["source"]).hostname
            if host in ("sketchfab.com", "www.sketchfab.com") and "license.txt" not in names:
                errors.append(
                    f"{rel(manifest_path)} : {asset['id']} : modèle de Sketchfab sans le fichier license.txt de son "
                    "archive (docs/licences.md)"
                )
            for entry in asset["files"]:
                path = entry["path"]
                if ".." in path.split("/") or path == "scene.json":
                    errors.append(f"{rel(manifest_path)} : {asset['id']} : chemin refusé « {path} »")
                    continue
                if path in listed:
                    errors.append(f"{rel(manifest_path)} : {path} listé deux fois ({listed[path]} et {asset['id']})")
                listed[path] = asset["id"]
                file_path = scene_dir / path
                if not file_path.is_file():
                    errors.append(f"{rel(manifest_path)} : {path} absent du dossier")
                    continue
                data = file_path.read_bytes()
                if len(data) != entry["bytes"]:
                    errors.append(f"{rel(file_path)} : {len(data)} octets, le manifeste en indique {entry['bytes']}")
                digest = hashlib.sha256(data).hexdigest()
                if digest != entry["sha256"]:
                    errors.append(f"{rel(file_path)} : empreinte {digest}, le manifeste indique {entry['sha256']}")
                if len(data) > MAX_FILE:
                    errors.append(f"{rel(file_path)} : {len(data) / MIB:.1f} Mio, au-delà de {MAX_FILE // MIB} Mio")
                if path.rsplit("/", 1)[-1] == "license.txt" or path.lower().endswith((".gltf", ".glb")):
                    a_comparer.append((asset, path, data))

        # Ce que les fichiers disent d'eux-mêmes, une fois tous les fichiers de la scène listés.
        compared = {"license.txt": 0, "glTF": 0}
        for asset, path, data in a_comparer:
            where = rel(scene_dir / path)
            if path.rsplit("/", 1)[-1] == "license.txt":
                try:
                    lu = lire_license_txt(data)
                except ValueError as e:
                    errors.append(f"{where} : {e}")
                    continue
                compared["license.txt"] += 1
                errors.extend(f"{where} : {ecart}" for ecart in ecarts(asset, lu))
                continue
            try:
                gltf = json_de_gltf(path, data)
            except ValueError as e:
                errors.append(f"{where} : {e}")
                continue
            compared["glTF"] += 1
            bloc = gltf.get("asset")
            extras = bloc.get("extras") if isinstance(bloc, dict) else None
            lu = {}
            for champ in CHAMPS:
                if isinstance(extras, dict) and champ in extras:
                    if isinstance(extras[champ], str):
                        lu[champ] = extras[champ]
                    else:
                        errors.append(f"{where} : asset.extras.{champ} n'est pas un texte, et n'est comparé à rien")
            errors.extend(f"{where} : asset.extras : {ecart}" for ecart in ecarts(asset, lu))
            for endroit, uri in proprietes_uri(gltf):
                if not isinstance(uri, str):
                    errors.append(f"{where} : {endroit} n'est pas un texte")
                elif uri[:5].lower() != "data:" and fichier_vise(path, uri) not in listed:
                    errors.append(
                        f"{where} : {endroit} « {uri[:120]} » : ni un fichier listé de la scène ni une uri en data:"
                    )

        present = {
            p.relative_to(scene_dir).as_posix()
            for p in scene_dir.rglob("*")
            if p.is_file() and p != manifest_path
        }
        for path in sorted(present - set(listed)):
            errors.append(f"{rel(scene_dir / path)} : absent du manifeste (auteur et licence inconnus)")

        total = sum(f.stat().st_size for f in scene_dir.rglob("*") if f.is_file())
        if total > MAX_SCENE:
            errors.append(f"{rel(scene_dir)} : {total / MIB:.1f} Mio, au-delà de {MAX_SCENE // MIB} Mio par scène")
        licences = sorted({a["license"] for a in manifest["assets"]})
        print(
            f"{rel(scene_dir)} : {len(manifest['assets'])} éléments, {len(listed)} fichiers, "
            f"{total / MIB:.1f} Mio (limite {MAX_SCENE // MIB}), licences {', '.join(licences)} ; "
            f"{compared['license.txt']} license.txt et {compared['glTF']} glTF lus"
        )

    for e in errors:
        print(f"ERREUR {e}")
    print(f"{len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
    sys.exit(main(root.resolve()))
