#!/usr/bin/env python3
"""Contrôle les scènes 3D publiées dans le site (app/public/scenes/).

Pour chaque scène, le manifeste scene.json doit :
- respecter schemas/scene.schema.json (licence CC0 ou CC BY, auteur, page d'origine, date de vérification) ;
- lister chaque fichier de la scène une fois et une seule, avec sa taille et son empreinte SHA-256 exactes ;
- ne nommer, dans `situations`, que des situations de data/situations.yaml ;
- donner à chaque élément une date `verified` qui existe, au plus un jour après la date du jour en UTC.

Le manifeste n'est pas cru sur parole : ce que les fichiers d'un élément disent de lui est comparé à ce que le manifeste
en dit (constat LIC-05 de l'audit, docs/audit/licences-scripts-ci.md ; version 0.4.16).
- Un fichier license.txt, lu en entier au format des archives de Sketchfab, et le bloc `asset.extras` d'un fichier glTF
  (.gltf, ou .glb, dont le JSON est le premier bloc) : titre, page d'origine, auteur et licence sont ceux du manifeste.
- Un élément dont la page d'origine est sur sketchfab.com liste son license.txt (docs/licences.md).

Un fichier glTF ne doit rien faire charger que le manifeste ne liste pas :
- toute propriété `uri` est une uri en `data:` aux données en base64, ou le chemin, écrit tel quel, d'un fichier listé
  de la scène ;
- il n'emploie que des extensions de EXTENSIONS_ADMISES ;
- ses images sont en PNG ou en JPEG.

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

# Les licences admises, par leur identifiant SPDX (schemas/scene.schema.json) : l'adresse de leur texte, et la phrase de
# la ligne « requirements » d'un license.txt de Sketchfab, celle du champ `requirements` de la licence dans son API
# [sketchfab-api-licences].
LICENCES = {
    "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/",
}
EXIGENCES = {
    "CC0-1.0": "Credit is not mandatory. Commercial use is allowed.",
    "CC-BY-4.0": "Author must be credited. Commercial use is allowed.",
}

# Chemin d'un fichier dans un manifeste : la forme que demande le schéma. Un segment « . » ou « .. » est refusé à part.
CHEMIN = re.compile(r"[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*")

# Le fichier license.txt d'une archive glTF de Sketchfab, en entier. Cinq lignes « * champ:<tabulation>valeur » : le
# titre, la page du modèle, l'auteur (son nom, puis l'adresse de son profil entre parenthèses), la licence (son
# identifiant SPDX, puis l'adresse de son texte entre parenthèses, en http) et ce qu'elle demande ; pour un modèle sous
# CC BY, un paragraphe de plus donne le crédit à recopier, fait des mêmes valeurs. Forme relevée sur les cinq modèles
# de la scène de parc, sous CC BY 4.0 (« CC-BY-4.0 »), et sur l'archive d'un modèle sous CC0 (« CC0-1.0 »), sans ce
# paragraphe, téléchargée le 28 novembre 2026 [sketchfab-archive-cc0]. Les fichiers glTF de ces archives portent le
# titre, la page, l'auteur et la licence dans leur bloc `asset.extras`, sous les clés title, source, author et license.
LICENSE_TXT = re.compile(
    r"Model Information:\n"
    r"\* title:\t(?P<title>[^\n]+)\n"
    r"\* source:\t(?P<source>[^\n]+)\n"
    r"\* author:\t(?P<author>[^\n]+)\n"
    r"\n"
    r"Model License:\n"
    r"\* license type:\t(?P<license>[^\n]+)\n"
    r"\* requirements:\t(?P<requirements>[^\n]+)"
    r"(?:\n\nIf you use this 3D model in your project be sure to copy paste this credit wherever you share it:\n"
    r'This work is based on "(?P=title)" \((?P=source)\) by (?P=author) licensed under (?P=license))?'
)
CHAMPS = ("title", "source", "author", "license")
# « https?:/{2} » plutôt que les deux barres : ce fichier ne contient ainsi pas d'autre adresse que celles de LICENCES.
VALEUR_ET_ADRESSE = re.compile(r"(.*\S)\s+\((https?:/{2}[^\s()]+)\)")

# Une uri en `data:` dont les données sont dans le fichier glTF : un type facultatif, « ;base64, », puis l'alphabet du
# base64. C'est, en plus strict, ce que le chargeur de Babylon.js 9.35.0 tient pour des données incluses
# (« ^data:([^,]+\/[^,]+)?;base64, », sans égard à la casse : @babylonjs/core, Misc/fileTools.pure.js, l. 17) ; il prend
# toute autre uri, même en `data:`, pour un chemin, qu'il ajoute à l'adresse du dossier du modèle
# (@babylonjs/loaders, glTF/2.0/glTFLoader.pure.js, l. 2241).
URI_EN_DATA = re.compile(r"data:(?:([a-z0-9.+-]+/[a-z0-9.+-]+))?;base64,[A-Za-z0-9+/]*={0,2}", re.IGNORECASE)

# Extensions de glTF qu'un fichier d'une scène peut employer : celles des fichiers de la scène de parc, dont le
# simulateur ne demande rien hors du site. Toute autre est refusée tant que ce que le chargeur en fait n'a pas été lu :
# pour KHR_draco_mesh_compression et EXT_meshopt_compression, Babylon.js 9.35.0 demande leur décodeur à un autre hôte
# (essais du 28 novembre 2026, CHANGELOG.md, section 0.4.16). Pour en admettre une : docs/licences.md.
EXTENSIONS_ADMISES = {"KHR_materials_specular"}

# Les deux formats d'image de la spécification de glTF 2.0 (« supports only image resources stored in PNG and JPEG
# image formats ») [khronos-gltf-2-0]. Le chargeur choisit le décodeur d'une image d'après son type déclaré, sinon
# d'après son uri (glTFLoader.pure.js, l. 2157) : pour une image nommée « .basis », il demande un transcodeur à un
# autre hôte (essai du 28 novembre 2026).
TYPES_D_IMAGE = ("image/png", "image/jpeg")
SUFFIXES_D_IMAGE = (".png", ".jpg", ".jpeg")


def lisible(texte, longueur=160):
    """Un texte lu dans un fichier, pour une ligne d'erreur : coupé à `longueur`, et tout caractère qui ne s'imprime
    pas (commande, fin de ligne, espace autre que l'espace ordinaire, demi-codet) écrit par son numéro."""
    court = "".join(c if c.isprintable() else f"\\u{ord(c):04x}" for c in texte[:longueur])
    return court + ("…" if len(texte) > longueur else "")


def lire_license_txt(octets):
    """Les cinq champs d'un license.txt de Sketchfab : title, source, author, license, requirements. Lève ValueError
    s'il n'en a pas toute la forme : un fichier que le script ne sait pas lire en entier n'est comparé à rien."""
    try:
        texte = octets.decode("utf-8")
    except UnicodeDecodeError as e:
        raise ValueError("le fichier n'est pas en UTF-8") from e
    trouve = LICENSE_TXT.fullmatch(texte.replace("\r\n", "\n").rstrip("\n"))
    if not trouve:
        raise ValueError("ce n'est pas, ligne pour ligne, le license.txt d'une archive de Sketchfab (docs/licences.md)")
    return trouve.groupdict()


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
        # sans elle (« SHOULD ») ; un fichier qui en a une est lu quand même, pour être contrôlé.
        gltf = json.loads(octets.decode("utf-8-sig"))
    except UnicodeDecodeError as e:
        raise ValueError("le JSON n'est pas en UTF-8") from e
    except (ValueError, RecursionError) as e:
        raise ValueError(f"JSON invalide ({e})") from e
    if not isinstance(gltf, dict):
        raise ValueError("le JSON n'est pas un objet")
    return gltf


def proprietes(gltf, nom):
    """Toutes les propriétés `nom` d'un JSON de glTF, où qu'elles soient, dans l'ordre du fichier : (endroit, valeur).
    Parcours sans récursion : la profondeur du JSON ne compte pas. Une propriété trouvée n'est pas parcourue."""
    trouvees, pile = [], [("", gltf, False)]
    while pile:
        ou, noeud, trouvee = pile.pop()
        if trouvee:
            trouvees.append((ou, noeud))
        elif isinstance(noeud, dict):
            for cle, valeur in reversed(noeud.items()):
                pile.append((f"{ou}.{lisible(cle, 60)}" if ou else lisible(cle, 60), valeur, cle == nom))
        elif isinstance(noeud, list):
            for i in range(len(noeud) - 1, -1, -1):
                pile.append((f"{ou}[{i}]", noeud[i], False))
    return trouvees


def fichier_vise(chemin_du_gltf, uri):
    """Chemin, dans la scène, du fichier que désigne une `uri` écrite comme un chemin simple, relatif au dossier du
    fichier glTF ; None pour toute autre `uri`. L'`uri` est prise telle qu'elle est écrite, sans décodage des « % »
    ni réduction des « .. » : un chargeur et un navigateur ne les lisent pas tous de la même façon, et un détour
    (une adresse extérieure suivie de « /../../ » et d'un fichier listé, « %2e%2e », une barre oblique inverse)
    retombait sur un fichier listé après réduction (relecture de la version 0.4.16, constats R1 et R2). La
    spécification de glTF 2.0 ne connaît que deux formes d'`uri`, « `data:` URLs and relative paths without
    parameters », et laisse un chargeur libre d'en suivre d'autres (« such as `https://` or `file://` schemes,
    authorities, absolute paths, and query or fragment parameters ») [khronos-gltf-2-0]."""
    if not CHEMIN.fullmatch(uri) or any(segment in (".", "..") for segment in uri.split("/")):
        return None
    dossier = posixpath.dirname(chemin_du_gltf)
    return f"{dossier}/{uri}" if dossier else uri


def erreurs_de_gltf(chemin, gltf, listed):
    """Ce qu'un fichier glTF ferait charger hors de ce que le manifeste liste : `uri`, extensions, formats d'image."""
    out = []
    for endroit, uri in proprietes(gltf, "uri"):
        if not isinstance(uri, str):
            out.append(f"{endroit} n'est pas un texte")
        elif not URI_EN_DATA.fullmatch(uri) and fichier_vise(chemin, uri) not in listed:
            out.append(
                f"{endroit} « {lisible(uri)} » : ni le chemin, écrit tel quel, d'un fichier listé de la scène, ni une "
                "uri en data: aux données en base64"
            )

    employees = set()
    for cle in ("extensionsUsed", "extensionsRequired"):
        declarees = gltf.get(cle, [])
        if not isinstance(declarees, list) or not all(isinstance(nom, str) for nom in declarees):
            out.append(f"{cle} n'est pas une liste de noms")
        else:
            employees.update(declarees)
    for endroit, extensions in proprietes(gltf, "extensions"):
        if isinstance(extensions, dict):
            employees.update(extensions)
        else:
            out.append(f"{endroit} n'est pas un objet")
    for nom in sorted(employees - EXTENSIONS_ADMISES):
        out.append(f"extension « {lisible(nom)} » hors des extensions admises (docs/licences.md)")

    images = gltf.get("images", [])
    for i, image in enumerate(images if isinstance(images, list) else []):
        if not isinstance(image, dict):
            continue
        declare = image.get("mimeType")
        if declare is not None and declare not in TYPES_D_IMAGE:
            out.append(f"images[{i}].mimeType « {lisible(str(declare))} » : image/png ou image/jpeg attendu")
        uri = image.get("uri")
        if isinstance(uri, str):
            en_data = URI_EN_DATA.fullmatch(uri)
            if en_data and (en_data.group(1) or "").lower() not in TYPES_D_IMAGE:
                out.append(f"images[{i}].uri : une image en data: est de type image/png ou image/jpeg")
            elif not en_data and not uri.lower().endswith(SUFFIXES_D_IMAGE):
                out.append(f"images[{i}].uri « {lisible(uri)} » : une image est un fichier .png, .jpg ou .jpeg")
    return out


def valeur_et_adresse(valeur):
    """(« Renderpeople », « https:… ») pour « Renderpeople (https:…) » ; (valeur, None) sans adresse entre
    parenthèses à la fin."""
    trouve = VALEUR_ET_ADRESSE.fullmatch(valeur.strip())
    return (trouve.group(1), trouve.group(2)) if trouve else (valeur.strip(), None)


def ecarts(asset, lu):
    """Ce qu'un fichier de l'élément dit de lui (`lu` : tout ou partie de title, source, author, license et
    requirements) et que le manifeste ne dit pas. L'auteur du fichier doit être le seul auteur du manifeste. La licence
    se compare par son identifiant et, quand le fichier la donne, par l'adresse de son texte, que Sketchfab écrit en
    http ; ce qu'elle demande, par la phrase de EXIGENCES."""
    out = []
    if "title" in lu and lu["title"] != asset["title"]:
        out.append(f"titre « {lisible(lu['title'])} », le manifeste indique « {lisible(asset['title'])} »")
    if "source" in lu and lu["source"] != asset["source"]:
        out.append(f"page d'origine « {lisible(lu['source'])} », le manifeste indique « {lisible(asset['source'])} »")
    if "author" in lu:
        auteur, _ = valeur_et_adresse(lu["author"])
        if asset["authors"] != [auteur]:
            du_manifeste = " ; ".join(lisible(a) for a in asset["authors"])
            out.append(f"auteur « {lisible(auteur)} », le manifeste indique « {du_manifeste} »")
    if "license" in lu:
        licence, adresse = valeur_et_adresse(lu["license"])
        if adresse is not None:
            adresse = re.sub(r"^http:", "https:", adresse)
        if licence != asset["license"] or adresse not in (None, asset["license_url"]):
            out.append(
                f"licence « {lisible(lu['license'])} », le manifeste indique {asset['license']} "
                f"({lisible(asset['license_url'])})"
            )
    if "requirements" in lu and lu["requirements"] != EXIGENCES[asset["license"]]:
        out.append(
            f"ligne « requirements » : « {lisible(lu['requirements'])} », attendu pour {asset['license']} : "
            f"« {EXIGENCES[asset['license']]} »"
        )
    return out


def est_de_sketchfab(adresse):
    """Vrai si l'hôte de l'adresse est sketchfab.com ou l'un de ses sous-domaines."""
    try:
        hote = (urllib.parse.urlsplit(adresse).hostname or "").rstrip(".")
    except ValueError:
        return False
    return hote == "sketchfab.com" or hote.endswith(".sketchfab.com")


def main(root, today=None):
    """`today` : la date du jour, pour les essais ; par défaut, celle de l'horloge, en UTC."""
    scenes_dir = root / "app" / "public" / "scenes"
    schema = json.loads((root / "schemas" / "scene.schema.json").read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    today = today or datetime.datetime.now(datetime.timezone.utc).date()
    errors = []

    def rel(path):
        return lisible(path.relative_to(root).as_posix(), 400)

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
    except (KeyError, TypeError, RecursionError):
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
        except OSError as e:
            errors.append(f"{rel(manifest_path)} : fichier illisible ({e.strerror or e})")
            continue
        except UnicodeDecodeError:
            errors.append(f"{rel(manifest_path)} : le fichier n'est pas en UTF-8")
            continue
        except (ValueError, RecursionError) as e:
            errors.append(f"{rel(manifest_path)} : JSON invalide ({e})")
            continue
        schema_errors = sorted(validator.iter_errors(manifest), key=lambda e: list(e.absolute_path))
        for e in schema_errors:
            where = "/".join(str(p) for p in e.absolute_path) or "(racine)"
            errors.append(f"{rel(manifest_path)} : {where} : {lisible(e.message, 300)}")
        if schema_errors:
            continue
        if manifest["id"] != scene_dir.name:
            errors.append(f"{rel(manifest_path)} : id « {lisible(manifest['id'])} » différent du nom du dossier")
        for situation in manifest["situations"]:
            if connues is not None and situation not in connues:
                errors.append(
                    f"{rel(manifest_path)} : situation {lisible(situation)} absente de data/situations.yaml"
                )

        listed = {}
        asset_ids = set()
        a_comparer = []  # (élément, chemin, octets) de chaque license.txt et de chaque fichier glTF lu
        for asset in manifest["assets"]:
            ident = lisible(asset["id"])
            if asset["id"] in asset_ids:
                errors.append(f"{rel(manifest_path)} : élément {ident} en double")
            asset_ids.add(asset["id"])
            expected_url = LICENCES[asset["license"]]
            if asset["license_url"] != expected_url:
                errors.append(f"{rel(manifest_path)} : {ident} : license_url attendue {expected_url}")
            # Le schéma ne contrôle que la forme de la date. Un jour d'avance est admis : la CI compte en UTC, et la
            # date peut avoir été écrite à l'heure de Paris, en avance sur l'UTC (contre-vérification de LIC-05).
            try:
                verified = datetime.date.fromisoformat(asset["verified"])
            except ValueError:
                errors.append(
                    f"{rel(manifest_path)} : {ident} : verified « {lisible(asset['verified'])} » n'est pas une date"
                )
            else:
                if verified > today + datetime.timedelta(days=1):
                    errors.append(
                        f"{rel(manifest_path)} : {ident} : verified « {lisible(asset['verified'])} » est dans le "
                        f"futur (date du jour en UTC : {today.isoformat()} ; un jour d'avance est admis)"
                    )
            names = [entry["path"].rsplit("/", 1)[-1].lower() for entry in asset["files"]]
            if est_de_sketchfab(asset["source"]) and "license.txt" not in names:
                errors.append(
                    f"{rel(manifest_path)} : {ident} : modèle de Sketchfab sans le fichier license.txt de son "
                    "archive glTF (docs/licences.md)"
                )
            for entry in asset["files"]:
                path = entry["path"]
                # Le motif du schéma laisse passer un segment « . » (un même fichier listé sous deux chemins) et une
                # fin de ligne après le chemin.
                if (
                    not CHEMIN.fullmatch(path)
                    or any(segment in (".", "..") for segment in path.split("/"))
                    or path == "scene.json"
                ):
                    errors.append(f"{rel(manifest_path)} : {ident} : chemin refusé « {lisible(path)} »")
                    continue
                if path in listed:
                    errors.append(f"{rel(manifest_path)} : {path} listé deux fois ({listed[path]} et {ident})")
                listed[path] = ident
                file_path = scene_dir / path
                if not file_path.is_file():
                    errors.append(f"{rel(manifest_path)} : {path} absent du dossier")
                    continue
                try:
                    data = file_path.read_bytes()
                except OSError as e:
                    errors.append(f"{rel(file_path)} : fichier illisible ({e.strerror or e})")
                    continue
                if len(data) != entry["bytes"]:
                    errors.append(f"{rel(file_path)} : {len(data)} octets, le manifeste en indique {entry['bytes']}")
                digest = hashlib.sha256(data).hexdigest()
                if digest != entry["sha256"]:
                    errors.append(f"{rel(file_path)} : empreinte {digest}, le manifeste indique {entry['sha256']}")
                if len(data) > MAX_FILE:
                    errors.append(f"{rel(file_path)} : {len(data) / MIB:.1f} Mio, au-delà de {MAX_FILE // MIB} Mio")
                if path.rsplit("/", 1)[-1].lower() == "license.txt" or path.lower().endswith((".gltf", ".glb")):
                    a_comparer.append((asset, path, data))

        # Ce que les fichiers disent d'eux-mêmes, une fois tous les fichiers de la scène listés.
        compared = {"license.txt": 0, "glTF": 0}
        for asset, path, data in a_comparer:
            where = rel(scene_dir / path)
            if path.rsplit("/", 1)[-1].lower() == "license.txt":
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
                errors.append(f"{where} : {lisible(str(e), 300)}")
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
            errors.extend(f"{where} : {erreur}" for erreur in erreurs_de_gltf(path, gltf, listed))

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
    # Un caractère que la sortie ne sait pas écrire (un demi-codet venu d'un JSON, un nom de fichier mal encodé) est
    # écrit par son numéro, au lieu d'arrêter le script sur une trace.
    sys.stdout.reconfigure(errors="backslashreplace")
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
    sys.exit(main(root.resolve()))
