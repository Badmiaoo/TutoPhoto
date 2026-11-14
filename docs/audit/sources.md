# Audit du lot « Sources (`data/sources.yaml`) »

État : constats non contre-vérifiés.

- Date : 14 novembre 2026. Rapport écrit par un agent de Claude, à la demande de Julien (12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; 13 novembre : finir l'audit et le pousser).
- Version auditée : copie de travail à la version 0.3.58. Les numéros de ligne de `data/sources.yaml` sont ceux de cette version.
- Reprise : un premier agent, coupé par la limite d'usage le 13 novembre, avait écrit les scripts de relecture (date d'ajout, lecture des adresses, recherche des citations, cohérence de `used_in`) sans commencer le rapport. Ses scripts et ses pages enregistrées sont repris ; tout le texte de ce rapport est du 14 novembre.
- Rapport en cours d'écriture : les sections se remplissent au fil des envois. Ce qui reste à couvrir est dit dans « Ce qui n'est pas couvert ».

## Périmètre

- Les 151 entrées de `data/sources.yaml` ajoutées avant le 12 novembre 2026. Date d'ajout : premier commit où l'identifiant apparaît dans le fichier (`git log --reverse -- data/sources.yaml`, puis lecture du fichier à chaque commit). Répartition : 96 le 7 novembre (dont 78 venues du référentiel 0.2, commit `818c9d8`), 20 le 8, 12 le 9, 16 le 10, 7 le 11. Les 21 entrées ajoutées le 12 novembre (grilles de cadrage, histogrammes) sont hors du lot.
- Pour chaque entrée : la page existe-t-elle, dit-elle ce que le libellé affirme, `used_in` est-il juste, et les notions qui la citent s'appuient-elles sur ce qu'elle dit.
- Les rapports `modele-physique.md`, `fiches-exposition.md`, `fiches-mise-au-point.md` et `choix-et-outils.md` ont relu une partie de ces sources : leurs constats ne sont pas refaits ici, ils sont cités par leur identifiant (PHY, FEX, FMA, CHX).

## Méthode

1. Date d'ajout de chaque entrée par un script (`dates.py`).
2. Lecture de chaque adresse par `curl`, une fois, le 13 novembre 2026 (`fetch.py`) : code de réponse, adresse finale, page enregistrée. Texte extrait par `bs4` ou `pdftotext` (`extract.py`).
3. Recherche automatique, dans le texte de chaque page lue, des 68 citations entre guillemets des libellés (`extract.py`) ; les citations non retrouvées sont relues à la main.
4. Quand l'hôte refuse les lectures automatiques mais que le même contenu existe ailleurs, lecture à cette autre adresse, le 14 novembre 2026 : fichiers bruts des dépôts de GitHub (`raw.githubusercontent.com`), commits des étiquettes par `git fetch --depth=1 --filter=tree:0`, registre npm (`registry.npmjs.org`).
5. Cohérence de `used_in` par un script (`usedin.py`) : fichiers suivis par git où l'adresse ou l'identifiant apparaît. Adresses citées dans le dépôt et absentes du fichier par un autre script (`absentes.py`).
6. Relecture à la main, en priorité, des pages dont dépendent des valeurs du simulateur et des fiches et que les autres rapports n'ont pas relues, puis des pages citées par le référentiel.

Scripts, pages enregistrées et textes extraits : dossier `audit/sources/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `pages-alt/`, `texte/`, `gitmeta/`).

## Sources relues et non relues

Sur les 151 entrées du lot :

| État | Nombre | Détail |
| --- | --- | --- |
| Relue à son adresse (réponse 200) | 75 | `en.wikipedia.org` (10), `onlinemanual.nikonimglib.com` (36), `helpguide.sony.net` (11), `cam.start.canon` (6), `www.photonstophotos.net` (2), `www.nikon.com` (2), `imaging.nikon.com`, `polyhaven.com`, `sketchfab.com`, `www.microsoft.com`, `tiffen.reamaze.com`, `www.provideocoalition.com` |
| Relue à une autre adresse | 25 | 16 pages de `github.com` (l'hôte répond 403 aux lectures de pages) lues dans les fichiers bruts et les commits des dépôts ; 4 pages de `www.npmjs.com` (403) lues dans le registre ; 5 pages de `docs.github.com` (hôte non joignable) lues dans leur source, dépôt `github/docs`, commit `8cd1075`, celui que citent les libellés |
| Non relue : hôte non joignable (refus du proxy) | 45 | tableau « Sources non relues » |
| Non relue : l'hôte répond 403 (contrôle contre les lectures automatiques) | 6 | `www.dpreview.com` (1), `photographylife.com` (2), `www.canon.co.uk` (3) |

Wikipedia est une source secondaire. Dates de lecture : 13 novembre 2026 pour les pages lues à leur adresse, 14 novembre 2026 pour les autres adresses et pour les relectures à la main.

## Ce qui n'est pas couvert

- Les 51 sources non relues (tableau plus bas) : ni leur existence, ni leur contenu ne sont vérifiés.
- Les 21 entrées ajoutées le 12 novembre 2026.
- (à compléter à la fin du rapport)

## Constats

(en cours d'écriture)

## Vérifié

Dépôts, licences et outils (lus le 14 novembre 2026).

- `threejs-r187`, `babylonjs-9-35-0`, `playcanvas-2-23-3`, `three-gpu-pathtracer-0-0-28`, `mdn-bcd-8-1-8`, `gitleaks-8-30-1` : chaque étiquette pointe le commit du libellé, à la date du libellé (`7e89746`, 30 octobre 2026 ; `00bc37c`, 6 novembre 2026 ; `b7655d8`, 15 octobre 2026 ; `80d1888`, 2 novembre 2026 ; `29768a4`, 2 novembre 2026 ; `83d9cd6`, 12 mars 2026). Licences des libellés : ce sont celles des fichiers de licence à l'étiquette (MIT pour three.js, PlayCanvas, three-gpu-pathtracer et gitleaks, « Copyright (c) 2019 Zachary Rice » ; Apache-2.0 pour Babylon.js, fichier `license.md`).
- `three-mesh-bvh-0-9-18` : l'étiquette `v0.9.18` existe (commit `1d92383`, 3 novembre 2026), licence MIT, « Copyright (c) 2018 Garrett Johnson ».
- `spdx-mit`, `spdx-cc-by-sa-4`, `spdx-cc0`, `spdx-cc-by-4`, `spdx-apache-2` : les cinq textes existent au commit `3184648` du dépôt `spdx/license-list-data`, daté du 29 octobre 2026. Les clauses que citent `docs/licences.md` (l. 18 à 20 et 31) et `docs/questions-ouvertes.md` (l. 13) y sont, aux sections annoncées : notice à inclure (MIT) ; section 3(b)(1) de CC BY-SA 4.0, « a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License » ; section 2 de CC0 1.0, « Waiver » ; section 3(a)(1)(B) de CC BY 4.0, « indicate if You modified the Licensed Material » ; section 2(b)(1), « nor are publicity, privacy, and/or other similar personality rights ».
- `github-pages-limits`, `github-secret-scanning`, `github-push-protection-users`, `github-large-files` : le commit `8cd1075` du dépôt `github/docs` est du 6 novembre 2026 (15 h 25, heure du Pacifique). Les cinq pages existent à ce commit, aux chemins des adresses citées.
- `github-large-files` : « 50 MiB » (avertissement de Git), « 100 MiB » (blocage), « 25 MiB » (envoi par le navigateur) : valeurs du fichier `data/variables/large_files.yml` au même commit, que la page insère. Le libellé et `docs/licences.md`, l. 32, sont justes.
- `github-secret-scanning` et `github-push-protection-users` (`docs/publication.md`, l. 19) : « Public repositories: […] runs automatically for free » et « Push protection for users is on by default for public repositories » sont dans les textes que ces deux pages insèrent (`data/reusables/gated-features/secret-scanning.md`, `data/reusables/gated-features/push-protection-for-users.md`).
- `github-comment-history` : « Anyone with read access to a repository can view a comment's edit history. » est dans la page, identique au commit `8cd1075` et sur la branche `main` du 14 novembre 2026.
- `npm-babylonjs-core`, `npm-vite`, `npm-typescript` : versions 9.35.0, 8.3.6 et 7.0.2 publiées (6 novembre, 5 novembre et 8 juillet 2026), licences Apache-2.0, MIT et Apache-2.0. Vérifié aussi par `choix-et-outils.md`.
- `xatlas-web-npm` : licence MIT, « modified » le 24 mai 2022 dans le registre ; une seule version, 0.1.0, publiée le 18 juin 2020.
- `depth-anything-v2` : « Depth-Anything-V2-Small model is under the Apache-2.0 license. Depth-Anything-V2-Base/Large/Giant models are under the CC-BY-NC-4.0 license. » (`README.md`, branche `main`). Le libellé et la note sont justes ; `docs/architecture.md`, l. 80, ne retient que le modèle Small.
- `filament-pbr` : le fichier existe au commit `e8669b6` ; auteurs Romain Guy et Mathias Agopian ; section « Physically based camera » à la l. 2712. Contenu relu par `modele-physique.md`.
- `bgfx-bokeh-example` : `bokeh_dof.sh` et `fs_bokeh_dof_combine.sc` existent sur la branche `master`, « Copyright 2021 elven cache » ; licence de bgfx à deux clauses. Contenu relu par `modele-physique.md`.

## Je ne sais pas

(en cours d'écriture)

## Recensements

(en cours d'écriture)
