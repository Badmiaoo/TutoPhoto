# Licences

Décidé par Julien le 7 novembre 2026. Les clauses citées ici ont été lues dans les textes des licences du dépôt de référence SPDX (`spdx/license-list-data`, commit `3184648` du 29 octobre 2026).

## Ce qui est sous quelle licence

| Quoi | Où | Licence |
| --- | --- | --- |
| Code | `scripts/`, `schemas/`, `.github/`, `app/` (hors modèles, textures et photos de tiers) | MIT ([`LICENSE`](../LICENSE)) |
| Contenus | `content/` (à venir), `docs/`, `README.md`, `README.en.md`, `CHANGELOG.md`, `CLAUDE.md`, `REPRISE.md` | CC BY-SA 4.0 ([`LICENSES/CC-BY-SA-4.0.txt`](../LICENSES/CC-BY-SA-4.0.txt)) |
| Données | `data/` (référentiel, situations, sources, jalons) | CC BY-SA 4.0 |
| Modèles, textures et photos 3D faits par d'autres | `app/public/scenes/` | la licence de chaque élément, qui doit être CC0 ou CC BY |

Titulaire indiqué dans `LICENSE` : Julien Touzeau (décision du 7 novembre 2026).

## Ce que cela implique

- Code sous MIT : tout usage est permis, y compris commercial et dans du logiciel fermé, à condition d'inclure la notice de copyright et la notice de permission dans toutes les copies ([texte de la licence MIT](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/MIT.txt)).
- Contenus et données sous CC BY-SA 4.0 : réutilisation permise, y compris commerciale, avec attribution. Une adaptation partagée doit être placée sous une licence Creative Commons aux mêmes éléments, cette version ou une ultérieure, ou sous une licence déclarée compatible BY-SA (section 3(b) du [texte CC BY-SA 4.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC-BY-SA-4.0.txt)).
- Modèles et textures 3D de tiers : seulement sous CC0, qui renonce à tous les droits (section 2 du [texte CC0 1.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC0-1.0.txt)), ou sous CC BY, qui demande seulement d'attribuer l'œuvre. Ne sont pas acceptés : CC BY-SA, les licences avec clause NC (pas d'usage commercial) ou ND (pas de modification), et les licences propres à un site.

## Code de tiers dans le site publié

- Babylon.js (Apache-2.0), paquets `@babylonjs/core` et `@babylonjs/loaders` : sa licence et les mentions de son `NOTICE.md` sont recopiées dans le site construit, sous `licences/`, avec les licences du projet ; une page `licences/` les liste. Les deux paquets ont le même texte de licence et `@babylonjs/loaders` n'a pas de `NOTICE.md` (vérifié le 8 novembre 2026, version 9.35.0) ; `app/scripts/copy-licences.mjs` fait échouer la construction si cela change.
- `babylonjs-gltf2interface` (Apache-2.0), dépendance de `@babylonjs/loaders`, ne contient que des déclarations de types : rien n'en arrive dans le site publié.

## Règles pour les scènes 3D

- Avant d'intégrer un modèle ou une texture, lire sa licence sur la page d'origine.
- Chaque scène a son dossier, `app/public/scenes/<scène>/`, et son manifeste `scene.json` (format fixé le 8 novembre 2026, schéma `schemas/scene.schema.json`). Chaque élément y porte : titre, rôle dans la scène (en français et en anglais), auteurs, page d'origine, licence (identifiant SPDX `CC0-1.0` ou `CC-BY-4.0`) et adresse de son texte, page où la licence a été lue, date de lecture, modifications apportées s'il y en a, et la liste de ses fichiers avec taille, empreinte SHA-256 et adresse de téléchargement d'origine.
- Une œuvre sous CC BY modifiée doit l'indiquer (section 3(a)(1)(B) du [texte CC BY 4.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC-BY-4.0.txt)) : c'est le champ `changes`.
- `scripts/check_scenes.py`, lancé par la CI, refuse un fichier absent du manifeste, une empreinte ou une taille qui ne correspond pas, une licence autre que CC0 ou CC BY, et les fichiers trop lourds : 25 Mio par fichier et 100 Mio par scène, limites provisoires du 8 novembre 2026. Les 25 Mio sont la limite d'envoi d'un fichier par le navigateur sur GitHub ; Git avertit à 50 Mio et GitHub bloque à 100 Mio ([documentation GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github), source lue dans le dépôt `github/docs`, commit `8cd1075` du 6 novembre 2026).
- Pour les modèles de Sketchfab, le fichier `license.txt` fourni dans l'archive (titre, auteur, licence, texte de crédit) est gardé à côté du modèle.
- Les crédits sont affichés dans l'outil (bouton « Crédits »), pour les éléments sous CC BY comme pour ceux sous CC0 : le titre renvoie à la page d'origine et la licence à son texte.
