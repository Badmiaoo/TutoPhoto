#!/usr/bin/env python3
"""Contrôle les scènes 3D publiées dans le site (app/public/scenes/).

Pour chaque scène, le manifeste scene.json doit :
- respecter schemas/scene.schema.json (licence CC0 ou CC BY, auteur, page d'origine, date de vérification) ;
- lister chaque fichier de la scène une fois et une seule, avec sa taille et son empreinte SHA-256 exactes.

Limites de taille, provisoires (décision du 8 novembre 2026, à revoir avec les tests sur téléphone) :
- 25 Mio par fichier : limite d'envoi d'un fichier par le navigateur sur GitHub, bien en deçà de
  l'avertissement de Git à 50 Mio et du blocage à 100 Mio (docs GitHub « About large files on GitHub »,
  dépôt github/docs, commit 8cd1075 du 6 novembre 2026) ;
- 100 Mio par scène : ce que le navigateur télécharge pour afficher une scène.

Usage : python3 scripts/check_scenes.py [racine du dépôt]
Sort avec le code 1 s'il y a au moins une erreur.
"""
import hashlib
import json
import pathlib
import sys

import jsonschema

MIB = 1024 * 1024
MAX_FILE = 25 * MIB
MAX_SCENE = 100 * MIB


def main(root):
    scenes_dir = root / "app" / "public" / "scenes"
    schema = json.loads((root / "schemas" / "scene.schema.json").read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    errors = []

    def rel(path):
        return path.relative_to(root).as_posix()

    if not scenes_dir.is_dir():
        print("Aucune scène (app/public/scenes/ absent).")
        return 0

    for stray in sorted(p for p in scenes_dir.iterdir() if p.is_file()):
        errors.append(f"{rel(stray)} : fichier hors d'un dossier de scène")

    for scene_dir in sorted(p for p in scenes_dir.iterdir() if p.is_dir()):
        manifest_path = scene_dir / "scene.json"
        if not manifest_path.is_file():
            errors.append(f"{rel(scene_dir)} : scene.json manquant")
            continue
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
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

        listed = {}
        asset_ids = set()
        for asset in manifest["assets"]:
            if asset["id"] in asset_ids:
                errors.append(f"{rel(manifest_path)} : élément {asset['id']} en double")
            asset_ids.add(asset["id"])
            expected_url = {
                "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
                "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/",
            }[asset["license"]]
            if asset["license_url"] != expected_url:
                errors.append(f"{rel(manifest_path)} : {asset['id']} : license_url attendue {expected_url}")
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
            f"{total / MIB:.1f} Mio (limite {MAX_SCENE // MIB}), licences {', '.join(licences)}"
        )

    for e in errors:
        print(f"ERREUR {e}")
    print(f"{len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parent.parent)
    sys.exit(main(root.resolve()))
