# Dossier de sources « scenes » : nouvelles scènes au-delà du parc

> Dossier de travail, écrit par un agent de Claude dans la nuit du 11 au 12 novembre 2026. **Pas encore relu à la source par un second agent** : la vérification indépendante prévue a été coupée par la limite d'usage. Avant de s'appuyer sur un fait, relire la citation à l'adresse donnée. Les pages brutes citées (`pages/…`) étaient sur la machine de Claude et ne sont pas dans le dépôt : les manuels ne sont pas sous licence libre.

Lu et écrit le 11 novembre 2026 (date UTC, `date -u +%F` : 2026-11-11), entre 23 h 17 et 23 h 40 UTC.
Pages et réponses d'API brutes : dossier `pages/scenes/` du bloc-notes de la session ; les noms de fichiers cités ci-dessous y renvoient.
Rien n'a été écrit dans le dépôt. Aucun modèle 3D n'a été téléchargé. Ont été téléchargés pour vérification : 38 fichiers HDR 1k (`hdr1k/`), 2 JPG de fond (`jpg8k/`) et les 131 072 premiers octets de 37 JPG (`jpg-entetes/`).

Trois niveaux de preuve sont séparés dans ce dossier :
- **source** : citation exacte ou valeur d'un champ, avec l'adresse et le fichier enregistré ;
- **mesure** : ce que j'ai calculé ou vu moi-même sur un fichier téléchargé (méthode dite) ; ce n'est pas une affirmation de l'éditeur ;
- **proposition** : mon avis, à trancher par Julien.

## 1. Ce que dit le dépôt

### 1.1 Situations de niveau d'entrée N1 et leur cadre

Source : `data/situations.yaml` (champ `level`, « Niveau d'entrée = niveau médian des notions clés »). 49 situations, dont 20 de niveau d'entrée N1 :

| Situation | Titre | Cadre (`where_when`) | Niveaux | Notions clés |
| --- | --- | --- | --- | --- |
| SIT-01 | Portrait à l'ombre ou par ciel couvert | Extérieur, journée | N1 | MAP-06, MAP-09, NET-01, NET-06, LUM-02 |
| SIT-04 | Portrait près d'une fenêtre | Intérieur, jour | N1 à N2 | LUM-07, MAP-06, COU-03 |
| SIT-05 | Photo de groupe | Intérieur ou extérieur | N1 | NET-01, MAP-05, MAP-09 |
| SIT-06 | Enfant ou chien qui court | Parc, fin de journée | N1 à N2 | MAP-04, MAP-05, MVT-01, MES-10, BOI-12 |
| SIT-08 | Oiseaux et animaux sauvages | Nature, longue focale | N1 à N3 | MAP-07, MAP-14, MVT-02, OPT-14, PLA-07 |
| SIT-10 | Paysage au coucher du soleil | Extérieur, soir | N1 à N2 | MES-08, OPT-12, LUM-04, PLA-01, CMP-04 |
| SIT-13 | Neige, plage et scènes très claires | Extérieur, plein jour | N1 à N2 | MES-03, MES-04, MES-07, EXP-11 |
| SIT-14 | Brouillard et temps couvert | Extérieur | N1 à N3 | LUM-05, COU-04, EXP-12 |
| SIT-17 | Ville à l'heure bleue | Ville, crépuscule | N1 à N2 | MVT-08, LUM-04, COU-04, BOI-09 |
| SIT-21 | Feux d'artifice | Nuit | N1 à N2 | BOI-10, MAP-02, MES-09 |
| SIT-23 | Plat ou objet sur une table | Intérieur, près d'une fenêtre | N1 à N2 | LUM-07, COU-02, CMP-05, CMP-09 |
| SIT-26 | À travers une vitre ou un grillage | Zoo, aquarium, vitrine | N1 à N2 | MAP-07, MAP-08, OPT-12, NET-01 |
| SIT-28 | Autoportrait au retardateur | Partout | N1 | BOI-12, MAP-08, BOI-01 |
| SIT-29 | Depuis un train ou un avion | Transport | N1 à N2 | MVT-01, MVT-02, OPT-12 |
| SIT-36 | Journée de voyage | Ville ou nature, du matin au soir | N1 | OPT-04, OPT-15, BOI-17, BOI-22, BOI-23, BOI-25, PLA-06, PLA-08, RET-11 |
| SIT-38 | Sport en extérieur, au bord du terrain | Stade ou terrain, jour | N1 à N2 | MAP-04, MAP-05, MAP-07, MAP-10, MVT-01, MVT-10, OPT-04, BOI-13 |
| SIT-39 | Enfant ou animal à la maison | Intérieur, près d'une fenêtre | N1 à N2 | LUM-07, MAP-09, MAP-04, MES-10, BOI-14 |
| SIT-40 | Pluie et mauvais temps | Extérieur, pluie | N1 à N2 | LUM-05, PLA-08, MVT-01, MVT-05, BOI-24 |
| SIT-V2-02 | Portrait : choisir sa distance | Extérieur ou studio | N1 à N2 | OPT-06, NET-06, CMP-07 |
| SIT-V2-06 | Plongée et contre-plongée | Partout | N1 | CMP-07 |

Les sept cadres de la mission correspondent aussi à des situations de niveau d'entrée N2 du même fichier : SIT-02 « Portrait en plein soleil » (Extérieur, milieu de journée, flash requis), SIT-03 « Portrait en contre-jour à l'heure dorée » (Extérieur, soir), SIT-18 « Intérieur sombre sans flash » (Musée, église), SIT-32 « Pièce d'une maison, fenêtre comprise » (Intérieur, jour), SIT-34 « Portrait de nuit en ville » (Ville, nuit, flash requis), SIT-35 « Ville la nuit à main levée » (Ville, nuit, sans trépied).

### 1.2 Forme d'une scène et métadonnées de licence

Sources : `app/public/scenes/parc/scene.json`, `schemas/scene.schema.json`, `scripts/check_scenes.py`, `docs/licences.md`, `app/src/scene.ts`, `app/src/camera/exposure.ts`, `app/src/camera/exposureModes.ts`.

- Manifeste `scene.json` : `id`, `title` (fr, en), `situations` (liste), `assets`. Chaque élément porte `id`, `title`, `role` (fr, en), `authors`, `source`, `license` (`CC0-1.0` ou `CC-BY-4.0`), `license_url`, `license_checked_at`, `verified` (date), `changes` (facultatif) et `files` (`path`, `bytes`, `sha256`, `origin`). Le schéma dit de `origin` : « Adresse de téléchargement d'origine, ou du fichier source si le fichier a été modifié. »
- `scripts/check_scenes.py` : `MAX_FILE = 25 * MIB` et `MAX_SCENE = 100 * MIB`, soit 26 214 400 octets par fichier et 104 857 600 octets par scène ; `license_url` attendue `https://creativecommons.org/publicdomain/zero/1.0/` pour `CC0-1.0` ; tout fichier présent doit être dans le manifeste.
- `docs/licences.md` : « Modèles et textures 3D de tiers : seulement sous CC0 […] ou sous CC BY ». Le parc pèse 35 Mio sur disque (`du -sh`), pour 8 éléments : le fond (2 fichiers, 12 267 146 octets), un banc et une poubelle de Poly Haven (CC0), quatre personnages Renderpeople et un chien de Sketchfab (CC BY 4.0).
- Fond du parc, dans le manifeste : `autumn_hockey/autumn_hockey.jpg`, 10 433 748 octets, origine `https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/autumn_hockey.jpg` ; `autumn_hockey/autumn_hockey_1k.hdr`, 1 833 398 octets. Les deux tailles sont celles que l'API renvoie aujourd'hui (`api-files-autumn_hockey.json`), et l'empreinte SHA-256 du HDR 1k retéléchargé commence par `2b12b0a22484`, comme dans le manifeste.
- Code (`app/src/scene.ts`) : le fond est un `PhotoDome` sur le JPG (« la photo à 360° en 8192 × 4096 px »), l'éclairage un `HDRCubeTexture` sur le HDR 1k, en 256 px par face ; `SCENE_URL = "../scenes/parc/"` est une constante ; `EYE_HEIGHT = 1.6`, avec le commentaire « Poly Haven ne publie pas la hauteur de prise de vue : valeur supposée » ; la rotation du fond (`DOME_ROTATION`) a été mesurée à la main ; les ombres de contact viennent d'une lumière presque zénithale d'intensité nulle (« Ciel couvert : ombres floues »).
- Exposition (`app/src/camera/exposure.ts`) : `export const SCENE_EV100 = 12.5;`, constante unique. Les fonctions `exposureOffset(s, sceneEv100 = SCENE_EV100)` et `resolveExposure(control, sceneEv100 = SCENE_EV100)` acceptent déjà une autre valeur. L'image du fond telle quelle est l'exposition correcte, multipliée par 2^écart (`camera/photo.ts` : « exposition 2^écart, […] écrêtage au blanc »).
- Mesure de l'appareil virtuel (`app/src/camera/exposureModes.ts`) : en A, en S et en ISO auto, l'appareil vise `3 * sceneEv100 + 12 - compensation`. La luminosité visée est celle de la scène, fixe : elle ne dépend pas de ce qui est dans le cadre.
- Échelles du boîtier virtuel (`exposure.ts`) : f/1.4 à f/22, 30 s à 1/4000 s, ISO 100 à 6400.
- `data/referentiel/lum.yaml`, note de LUM-02 : « le fond de la scène de parc est une photo à 360° prise par ciel couvert, qu'un soleil direct contredirait ».
- `CLAUDE.md` : « Pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants. » Ce dossier prépare les sources ; il ne décide pas du moment.

## 2. Poly Haven : licence, API, photos HDR candidates

### 2.1 Licence

- Page « License • Poly Haven », https://polyhaven.com/license, éditeur Poly Haven, sans date, lue le 11 novembre 2026, fichier `polyhaven-license.html` :
  - « All assets (HDRIs, textures and 3D models) on this site are the original work of Poly Haven staff, or artists who willingly and directly donate/sell their work to Poly Haven. »
  - « Our assets are all licensed as CC0, which is effectively Public Domain even in jurisdictions that do not support the Public Domain. » Le mot « CC0 » y est un lien vers `https://creativecommons.org/publicdomain/zero/1.0/`.
  - « You do not need to give credit or attribution when using them (although it is appreciated). »
  - « You can redistribute them, share them around, include them when sharing your own work, or even in a product you sell. »
- Page de chaque élément, par exemple https://polyhaven.com/a/rooitou_park (fichier `polyhaven-a-rooitou_park.html`) : les données structurées de la page portent `"license":"https://creativecommons.org/publicdomain/zero/1.0/"`, `"acquireLicensePage":"https://polyhaven.com/license"`, `"copyrightNotice":"CC0 1.0 Universal - public domain dedication, no attribution required"`. J'ai relevé ces trois champs, identiques, sur les 38 pages de photos HDR et les 14 pages de modèles enregistrées (`polyhaven-a-*.html`).
- La réponse de l'API (`/info/ID`, `/assets`) ne contient aucun champ de licence : la licence se lit sur la page de licence et sur la page de l'élément.
- Page « API • Poly Haven », https://polyhaven.com/our-api, signée « -Greg 18 July 2026 », fichier `polyhaven-our-api.html` : « The assets have always been CC0, and now the API that serves them is open the same way. » La page demande un crédit à qui branche son produit sur l'API en direct (« If you use the live API in your product, website, or service, make it clear to your users that the assets came from Poly Haven ») : TutoPhoto sert des copies et crédite déjà chaque élément.

### 2.2 Ce que l'API renvoie

Documentation : https://api.polyhaven.com/api-docs/swagger.json (« Poly Haven API », version 1.0.0), fichier `api-docs-swagger.json`. Listes : https://api.polyhaven.com/assets?t=hdris (997 photos HDR, fichier `api-assets-hdris.json`) et https://api.polyhaven.com/assets?t=models (521 modèles, `api-assets-models.json`). Compteurs par catégorie : `api-categories-hdris.json`, par exemple `"indoor":301`, `"night":61`, `"sunrise-sunset":225`, `"midday":206`.

- `evs_cap` : « The number of exposure brackets captured when shooting this HDRI. I.e. the difference between the brightest and darkest shots, an indication of dynamic range. » La page de l'élément l'affiche ainsi : « 23 EVs of dynamic range captured. Unclipped. » (`polyhaven-a-rooitou_park.html`).
- `date_taken` : « Legacy (untrustworthy) epoch timestamp of when this HDRI was taken. Timezone issues caused this data to be generally unused and inaccurate. May be solved in future but don't depend on it! » Les dates de prise des tableaux ci-dessous sont donc à prendre avec cette réserve ; je donne la valeur brute et sa lecture en UTC.
- `whitebalance` : « The whitebalance in Kelvin that this HDRI and any included backplates were shot at. May not be present for all assets. »
- `categories` : « Deprecated: a legacy string array of pseudo-tag categories. Replaced by `category`/`category_id` » ; les deux sont donnés ci-dessous.
- `attributes` : `time_of_day`, `weather`, `light_type`, `contrast`, `season`, `environment`, `sky_view`, `backplates`. Dans la liste, 275 des 278 photos d'intérieur (`environment: indoor`) n'ont pas de `time_of_day` ; aucune des candidates d'intérieur n'en a.
- Hauteur de prise de vue : aucun champ. Je ne sais pas si ces photos sont prises à hauteur d'homme ; le dépôt suppose 1,6 m pour le parc.
- Fichiers (`/files/ID`) : la clé `hdri` donne les résolutions 1k, 2k, 4k, 8k et au-delà, en `hdr` et `exr` ; la clé `tonemapped` donne un seul JPG. Il n'y a pas d'entrée « JPG 8k » : le JPG de 8192 × 4096 px est ce fichier `tonemapped`, que la page appelle « 8K Tonemapped JPG ». J'ai lu la largeur et la hauteur dans l'en-tête des 37 JPG candidats (requête partielle des 131 072 premiers octets, `jpg-entetes/`) : tous font 8192 × 4096 px. Leur poids va de 1 873 244 à 57 986 448 octets ; 17 des 37 dépassent les 25 Mio du dépôt.
- Le site dit de ce JPG : « A low dynamic range preview of the HDRI. Sometimes useful as a preview, or for non-CG related uses, but do not use for lighting. » (info-bulle de la page de l'élément).
- La foire aux questions de Poly Haven renvoie vers `docs.polyhaven.com`, hôte hors de la liste autorisée : non lue.

### 2.3 Candidates par cadre

Méthode : filtre de la liste `api-assets-hdris.json` sur `attributes` et `category`, puis lecture de `/info/ID` et `/files/ID` (fichiers `api-info-ID.json`, `api-files-ID.json`) et de la page de chaque candidate (`polyhaven-a-ID.html`). Auteur, catégories, attributs, `evs_cap`, résolution et tailles sont des valeurs de l'API. Toutes les candidates sont sous CC0 (section 2.1). La colonne « HDR 4k » sert au point 7.3.
Le tableau complet, avec les adresses des fichiers, est aussi dans `candidates-hdris.json`.

### (a) Intérieur de jour éclairé par une fenêtre

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`lebombo`](https://polyhaven.com/a/lebombo) | Lebombo | Greg Zaal (All) | 1556023560 (2019-04-23 12:46) | Interiors/Residential/Living Rooms & Lounges | indoor, urban, morning-afternoon, low contrast, natural light, artificial light | weather: clear, light_type: mixed, contrast: low | 9 | 4200 | 16384 × 8192 | 1 873 244 o (1,8 Mio) | 1 476 953 o | 6 010 815 o | 24 355 962 o |
| [`small_empty_house`](https://polyhaven.com/a/small_empty_house) | Small Empty House | Greg Zaal (All) | 1474794240 (2016-09-25 09:04) | Interiors/Residential/Living Rooms & Lounges | indoor, urban, morning-afternoon, medium contrast, natural light | weather: clear, light_type: natural, contrast: medium | 15 | absent | 16384 × 8192 | 3 118 783 o (3,0 Mio) | 1 509 651 o | 5 976 728 o | 23 439 131 o |
| [`brown_photostudio_04`](https://polyhaven.com/a/brown_photostudio_04) | Brown Photostudio 04 | Sergej Majboroda (All) | 1650030420 (2022-04-15 13:47) | Studio/Photo Studios/Natural-Light Studios | studio, natural light, indoor, urban, midday, low contrast | weather: clear, light_type: natural, contrast: low, backplates: True | 12 | 4250 | 16384 × 8192 | 40 211 222 o (38,3 Mio, au-delà de 25 Mio) | 1 637 479 o | 6 477 068 o | 25 485 765 o |
| [`photo_studio_loft_hall`](https://polyhaven.com/a/photo_studio_loft_hall) | Photo Studio Loft Hall | Sergej Majboroda (All) | 1624037820 (2021-06-18 17:37) | Studio/Photo Studios/Natural-Light Studios | indoor, medium contrast, urban, studio, morning-afternoon, natural light | weather: clear, light_type: natural, contrast: medium, backplates: True | 16 | 5650 | 16384 × 8192 | 39 022 433 o (37,2 Mio, au-delà de 25 Mio) | 1 640 243 o | 6 432 146 o | 25 245 847 o |
| [`brown_photostudio_05`](https://polyhaven.com/a/brown_photostudio_05) | Brown Photostudio 05 | Sergej Majboroda (All) | 1650037380 (2022-04-15 15:43) | Studio/Photo Studios/Natural-Light Studios | indoor, natural light, urban, morning-afternoon, low contrast, studio | weather: clear, light_type: natural, contrast: low, backplates: True | 12 | 3200 | 16384 × 8192 | 29 234 515 o (27,9 Mio, au-delà de 25 Mio) | 1 572 626 o | 6 189 416 o | 24 366 719 o |
| [`reading_room`](https://polyhaven.com/a/reading_room) | Reading Room | Greg Zaal (All) | 1509625620 (2017-11-02 12:27) | Interiors/Residential/Living Rooms & Lounges | indoor, urban, morning-afternoon, medium contrast, natural light | weather: clear, light_type: natural, contrast: medium | 10 | 5400 | 16384 × 8192 | 37 806 065 o (36,1 Mio, au-delà de 25 Mio) | 1 624 482 o | 6 353 628 o | 24 841 550 o |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `lebombo` : Pièce vide, parquet clair, une grande baie avec voilage, tache de soleil au sol, des appliques murales allumées. Sol entièrement dégagé. Point le plus lumineux : élévation 18,1°, 5,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `a02c9615adeba91a753c3e4737c3ce7a719273df822eeaa85d24982bd43c9ecb`.
- `small_empty_house` : Maison vide carrelée, une porte ouverte et plusieurs fenêtres, ventilateur de plafond avec lampe, taches de soleil au sol. Sol dégagé. Point le plus lumineux : élévation 39,9°, 12,3 IL au-dessus de la médiane. SHA-256 du HDR 1k : `ac0bfa735c42bf0d9ae1d7289dc577182aa122c79ad5565ec0dfa7fa1d4c8400`.
- `brown_photostudio_04` : Studio meublé (canapé, lit bas, cuisine), grande baie avec voilages. Centre du sol dégagé. Point le plus lumineux : élévation −17,4°, 4,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `b7f6d58feb02b256decca21f0f93768f044d5f4629c84088d05588dd3f8d27a9`.
- `photo_studio_loft_hall` : Loft meublé (fauteuils, bureau), trois fenêtres, parquet, soleil direct au sol. Point le plus lumineux : élévation −7,2°, 12,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `2243ac7b3418e0f4ade3a39ebf29856e6c581134ce8e557d9e6464ff15459513`.
- `brown_photostudio_05` : Studio (arche de fleurs, canapés), deux portes-fenêtres avec rideaux, soleil au sol. Point le plus lumineux : élévation −23,7°, 5,8 IL au-dessus de la médiane. SHA-256 du HDR 1k : `413284b1bdcf82ec5615f1dac8b2d330e772017f1cf86cdbb7f0e99df314b6b9`.
- `reading_room` : Salon meublé (fauteuils, canapés, tapis), sol en terrazzo. Sol encombré. Point le plus lumineux : élévation 13,9°, 8,0 IL au-dessus de la médiane. SHA-256 du HDR 1k : `a258676673c09f07e26f4a62ff6695d2424b9bd33606feaca21cd4135c62f8d3`.

### (b) Extérieur au soleil direct, ciel dégagé, milieu de journée

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`noon_grass`](https://polyhaven.com/a/noon_grass) | Noon Grass | Greg Zaal (All) | 1450781460 (2015-12-22 10:51) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, skies, nature, midday, clear, high contrast, natural light | time_of_day: midday, weather: clear, light_type: natural, contrast: high, sky_view: open | 24 | absent | 16384 × 8192 | 8 540 181 o (8,1 Mio) | 1 557 132 o | 6 367 923 o | 25 352 937 o |
| [`suburban_garden`](https://polyhaven.com/a/suburban_garden) | Suburban Garden | Dimitrios Savva (Photography), Jarod Guest (Processing) | 1766744640 (2025-12-26 10:24) | Parks & Gardens/Gardens/Courtyard Gardens | outdoor, natural light, nature, high contrast, clear, midday, urban | time_of_day: midday, weather: clear, light_type: natural, contrast: high, sky_view: open | 26 | 5539 | 20480 × 10240 | 48 901 821 o (46,6 Mio, au-delà de 25 Mio) | 1 622 533 o | 6 639 933 o | 26 470 410 o (au-delà de 25 Mio) |
| [`orlando_stadium`](https://polyhaven.com/a/orlando_stadium) | Orlando Stadium | Greg Zaal (Processing), Dimitrios Savva (Photography) | 1631194620 (2021-09-09 13:37) | Parks & Gardens/Playgrounds/Sports Courts & Fields | natural light, outdoor, urban, midday, clear, high contrast | time_of_day: midday, weather: clear, light_type: natural, contrast: high, sky_view: open | 22 | absent | 24576 × 12288 | 45 826 577 o (43,7 Mio, au-delà de 25 Mio) | 1 550 878 o | 6 149 118 o | 25 122 894 o |
| [`wide_street_01`](https://polyhaven.com/a/wide_street_01) | Wide Street 01 | Sergej Majboroda (All) | 1596717900 (2020-08-06 12:45) | Streets & Town/Streets & Alleys/City Streets | outdoor, urban, midday, clear, high contrast, natural light | time_of_day: midday, weather: clear, light_type: natural, contrast: high, backplates: True, sky_view: open | 27 | 5500 | 16384 × 8192 | 4 827 893 o (4,6 Mio) | 1 474 393 o | 5 834 052 o | 23 774 400 o |
| [`dreifaltigkeitsberg`](https://polyhaven.com/a/dreifaltigkeitsberg) | Dreifaltigkeitsberg | Andreas Mischok (All) | 1630836960 (2021-09-05 10:16) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, skies, nature, natural light, midday, clear | time_of_day: midday, weather: clear, light_type: natural, contrast: high, sky_view: open | 24 | absent | 17484 × 8742 | 55 294 383 o (52,7 Mio, au-delà de 25 Mio) | 1 591 092 o | 6 538 154 o | 26 679 675 o (au-delà de 25 Mio) |
| [`circus_maximus_2`](https://polyhaven.com/a/circus_maximus_2) | Circus Maximus 2 | Greg Zaal (All), Rico Cilliers (Backplates) | 1510132200 (2017-11-08 09:10) | Streets & Town/Squares & Plazas/Historic & European Squares | outdoor, skies, nature, midday, clear, high contrast, natural light | time_of_day: midday, weather: clear, light_type: natural, contrast: high, backplates: True, sky_view: open | 22 | 5400 | 16384 × 8192 | 7 763 191 o (7,4 Mio) | 1 485 037 o | 5 926 878 o | 23 910 470 o |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `noon_grass` : Pré ouvert, arbres au loin. Soleil presque au zénith. Point le plus lumineux : élévation 85,6°, 18,2 IL au-dessus de la médiane. SHA-256 du HDR 1k : `63413e8b3d8b4c394396d05ab9c7c590a8d70e2cf45187054d198d42f0209939`.
- `suburban_garden` : Pelouse de jardin, massifs, maisons, piscine au fond. Point le plus lumineux : élévation 64,2°, 19,5 IL au-dessus de la médiane. SHA-256 du HDR 1k : `4f35c78e8664ae73ba0e3a18fab5e8dc784029af892a42b8b34b4200e481232b`.
- `orlando_stadium` : Pelouse d'un stade, appareil sur une ligne blanche du terrain, tribunes vides, ciel voilé autour du soleil. Point le plus lumineux : élévation 51,9°, 18,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `cd1cd774d28ab4a8942ed1626bfe3492a388dc3cd7e772cb77ce8bcccbca7623`.
- `wide_street_01` : Milieu d'une large avenue goudronnée, immeubles et arbres de part et d'autre. Point le plus lumineux : élévation 52,9°, 19,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `7f1d096001e9d206a7ad03666049af5c5705ba800337eb2bd35c1a31e3625d36`.
- `dreifaltigkeitsberg` : Prairie en pente douce, lisière d'arbres. Point le plus lumineux : élévation 42,7°, 18,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `593800ef19ac4f50199659f0c679943a105c8c107d30a9c0c7fb98f73d820fb9`.
- `circus_maximus_2` : Esplanade de gravier, pins parasols. Point le plus lumineux : élévation 30,8°, 19,1 IL au-dessus de la médiane. SHA-256 du HDR 1k : `09e31e1d197885098324f6200c251f0dddcea2c0c23b9e63d1ad7f9965a9677a`.

### (c) Extérieur au soleil bas, soleil visible

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`rooitou_park`](https://polyhaven.com/a/rooitou_park) | Rooitou Park | Greg Zaal (All) | 1551287160 (2019-02-27 17:06) | Parks & Gardens/Parks/Open Parkland | outdoor, skies, nature, sunrise-sunset, clear, high contrast, natural light | time_of_day: sunset, weather: clear, light_type: natural, contrast: high, sky_view: open | 23 | 5400 | 16384 × 8192 | 6 921 351 o (6,6 Mio) | 1 588 504 o | 6 555 692 o | 26 755 875 o (au-delà de 25 Mio) |
| [`sisulu`](https://polyhaven.com/a/sisulu) | Sisulu | Greg Zaal (All) | 1438526400 (2015-08-02 14:40) | Parks & Gardens/Parks/Open Parkland | outdoor, nature, sunrise-sunset, clear, high contrast, natural light | time_of_day: sunset, weather: clear, light_type: natural, contrast: high, sky_view: open | 24 | absent | 16384 × 8192 | 9 335 224 o (8,9 Mio) | 1 690 625 o | 6 851 631 o | 27 366 102 o (au-delà de 25 Mio) |
| [`spruit_sunrise`](https://polyhaven.com/a/spruit_sunrise) | Spruit Sunrise | Greg Zaal (All) | 1527658740 (2018-05-30 05:39) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, skies, nature, sunrise-sunset, clear, high contrast, natural light | time_of_day: sunrise, weather: clear, light_type: natural, contrast: high, sky_view: open | 21 | 5400 | 16384 × 8192 | 6 970 982 o (6,6 Mio) | 1 500 948 o | 5 934 209 o | 23 830 974 o |
| [`park_bench`](https://polyhaven.com/a/park_bench) | Park Bench | Greg Zaal (All) | 1438238580 (2015-07-30 06:43) | Parks & Gardens/Parks/Lakeside Parks | outdoor, nature, sunrise-sunset, clear, high contrast, natural light | time_of_day: sunrise, weather: clear, light_type: natural, contrast: high, sky_view: open | 21 | absent | 16384 × 8192 | 7 788 172 o (7,4 Mio) | 1 633 144 o | 6 660 151 o | 26 649 986 o (au-delà de 25 Mio) |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `rooitou_park` : Grande pelouse de parc, ciel dégagé, disque du soleil visible près de l'horizon. Point le plus lumineux : élévation 10,4°, 18,8 IL au-dessus de la médiane. SHA-256 du HDR 1k : `af15cb5ca49de469e2ee74fcb6622cb32b36e3f9ee95504fc762d9c3d62c5163`.
- `sisulu` : Herbe sèche, arbres, banc au loin, soleil au ras d'une colline. Point le plus lumineux : élévation 15,3°, 20,8 IL au-dessus de la médiane. SHA-256 du HDR 1k : `e95f71219aacefdf78a83acc925369fadc519ce122db163f042a7b45d6620c90`.
- `spruit_sunrise` : Herbe et chemins, brume au sol, pylônes électriques, soleil sur l'horizon. Point le plus lumineux : élévation 7,9°, 20,3 IL au-dessus de la médiane. SHA-256 du HDR 1k : `38199a31e945906f6778431e989256a92d9d78b0cfc0f902accad9f5244bf50f`.
- `park_bench` : Parc avec étang et banc, herbe sèche, soleil bas à travers les arbres. Point le plus lumineux : élévation 19,2°, 18,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `51551c2e6996cdf9297ec948954c40aa49f0ed7a8a23c97a8c85574bd0be98dd`.

### (d) Crépuscule ou heure bleue en ville

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`neuer_zollhof`](https://polyhaven.com/a/neuer_zollhof) | Neuer Zollhof | Greg Zaal (All) | 1478971140 (2016-11-12 17:19) | Streets & Town/Squares & Plazas/Waterfront Squares | outdoor, urban, night, partly cloudy, high contrast, artificial light | time_of_day: dusk, weather: partly_cloudy, light_type: mixed, contrast: high, sky_view: open | 16 | absent | 16384 × 8192 | 5 105 020 o (4,9 Mio) | 1 489 881 o | 5 897 844 o | 23 570 713 o |
| [`golden_bay`](https://polyhaven.com/a/golden_bay) | Golden Bay | Greg Zaal (All) | 1697654940 (2023-10-18 18:49) | Coast & Water/Harbours & Piers/Promenades & Seafronts | outdoor, night, urban, artificial light, high contrast, clear | time_of_day: dusk, weather: clear, light_type: mixed, contrast: high, sky_view: open | 18 | 3600 | 24576 × 12288 | 51 354 319 o (49,0 Mio, au-delà de 25 Mio) | 1 411 725 o | 5 694 366 o | 22 570 138 o |
| [`evening_museum_courtyard`](https://polyhaven.com/a/evening_museum_courtyard) | Evening Museum Courtyard | Grzegorz Wronkowski (All) | 1750019760 (2025-06-15 20:36) | Streets & Town/Squares & Plazas/Courtyards & Quads | outdoor, natural light, urban, low contrast, partly cloudy, morning-afternoon, artificial light | time_of_day: dusk, weather: partly_cloudy, light_type: mixed, contrast: low, sky_view: obstructed | 12 | 7500 | 30000 × 15000 | 43 874 708 o (41,8 Mio, au-delà de 25 Mio) | 1 489 825 o | 6 088 432 o | 25 190 789 o |
| [`modern_evening_street`](https://polyhaven.com/a/modern_evening_street) | Modern Evening Street | Grzegorz Wronkowski (All) | 1753387080 (2025-07-24 19:58) | Streets & Town/Streets & Alleys/City Streets | outdoor, urban, natural light, low contrast, partly cloudy, morning-afternoon | time_of_day: dusk, weather: partly_cloudy, light_type: mixed, contrast: low, sky_view: obstructed | 15 | 5400 | 20480 × 10240 | 42 225 088 o (40,3 Mio, au-delà de 25 Mio) | 1 651 202 o | 6 418 864 o | 24 985 447 o |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `neuer_zollhof` : Place dallée au bord de l'eau, immeubles, ciel gris-bleu nuageux, un lampadaire allumé tout près. Point le plus lumineux : élévation 35,0°, 17,7 IL au-dessus de la médiane. SHA-256 du HDR 1k : `1b637bcf7a7c4427f08e9c94b64c18ee4bfe5613597cae0d9d790566182e8d6a`.
- `golden_bay` : Quai dallé, immeubles et vitrines éclairés, eau, ciel bleu profond, lampadaires. Point le plus lumineux : élévation 17,8°, 17,7 IL au-dessus de la médiane. SHA-256 du HDR 1k : `c5cba76c7a50c4438fc510abc3c20bbedd37f874816f2576a1e5ce89413330ae`.
- `evening_museum_courtyard` : Cour dallée entre des bâtiments, ciel nuageux encore clair, peu de lumières allumées. Point le plus lumineux : élévation 2,6°, 11,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `b93bf3411cf3bdc459e2e6d942e14d64061f1d3f1ffa39a76dab3893f1de4ad1`.
- `modern_evening_street` : Trottoir et piste cyclable, immeubles de bureaux, ciel nuageux. Point le plus lumineux : élévation 27,2°, 14,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `60a94c41cb1488c7c33c6f65994b31609af95b3f58a857b766a46653fc346270`.

### (e) Nuit en ville éclairée

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`hansaplatz`](https://polyhaven.com/a/hansaplatz) | Hansaplatz | Greg Zaal (All) | 1478113140 (2016-11-02 18:59) | Streets & Town/Squares & Plazas/City Squares | outdoor, urban, night, clear, high contrast, artificial light | time_of_day: night, weather: clear, light_type: artificial, contrast: high, sky_view: open | 19 | absent | 16384 × 8192 | 5 901 947 o (5,6 Mio) | 1 728 448 o | 6 850 384 o | 26 997 130 o (au-delà de 25 Mio) |
| [`zwinger_night`](https://polyhaven.com/a/zwinger_night) | Zwinger Night | Greg Zaal (All) | 1478630760 (2016-11-08 18:46) | Streets & Town/Squares & Plazas/Historic & European Squares | outdoor, urban, night, overcast, high contrast, artificial light | time_of_day: night, weather: overcast, light_type: artificial, contrast: high, sky_view: obstructed | 18 | absent | 16384 × 8192 | 6 300 113 o (6,0 Mio) | 1 627 536 o | 6 630 866 o | 26 463 917 o (au-delà de 25 Mio) |
| [`st_peters_square_night`](https://polyhaven.com/a/st_peters_square_night) | St. Peters Square Night | Andreas Mischok (All) | 1635710700 (2021-10-31 20:05) | Streets & Town/Squares & Plazas/Historic & European Squares | outdoor, artificial light, urban, high contrast, partly cloudy, night | time_of_day: night, weather: partly_cloudy, light_type: artificial, contrast: high, sky_view: open | 12 | absent | 20084 × 10042 | 57 986 448 o (55,3 Mio, au-delà de 25 Mio) | 1 716 531 o | 6 853 286 o | 27 291 971 o (au-delà de 25 Mio) |
| [`shanghai_bund`](https://polyhaven.com/a/shanghai_bund) | Shanghai Bund | Greg Zaal (All) | 1524339060 (2018-04-21 19:31) | Coast & Water/Harbours & Piers/Promenades & Seafronts | outdoor, urban, night, partly cloudy, high contrast, artificial light | time_of_day: night, weather: partly_cloudy, light_type: artificial, contrast: high, sky_view: open | 17 | 3300 | 16384 × 8192 | 4 758 520 o (4,5 Mio) | 1 640 377 o | 6 467 753 o | 25 500 375 o |
| [`cobblestone_street_night`](https://polyhaven.com/a/cobblestone_street_night) | Cobblestone Street Night | Greg Zaal (All), Jenelle van Heerden (Backplates) | 1697662320 (2023-10-18 20:52) | Streets & Town/Streets & Alleys/Historic & Old-Town Streets | outdoor, night, urban, artificial light, high contrast, clear | time_of_day: night, weather: clear, light_type: artificial, contrast: high, sky_view: obstructed | 18 | 2200 | 24576 × 12288 | 51 322 376 o (48,9 Mio, au-delà de 25 Mio) | 1 760 191 o | 7 064 424 o | 28 170 038 o (au-delà de 25 Mio) |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `hansaplatz` : Place pavée, immeubles et vitrines éclairés, lampadaires, ciel noir. Point le plus lumineux : élévation 20,9°, 17,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `a32efd8c13e535378fc2c1568d4066a04aa7a98baa1932f460dec51c6b15820b`.
- `zwinger_night` : Très grande esplanade, bâtiments éclairés au loin, ciel couvert orangé. Point le plus lumineux : élévation 6,9°, 19,4 IL au-dessus de la médiane. SHA-256 du HDR 1k : `36c2b020663857ab721fea55594ab304b1a82670b9d3adf408cb356ed7035bdb`.
- `st_peters_square_night` : Place pavée, colonnades éclairées, un lampadaire proche, ciel nuageux sombre. Point le plus lumineux : élévation 30,8°, 15,7 IL au-dessus de la médiane. SHA-256 du HDR 1k : `e3646b88300b986483b4f65e8a4401b282d98ba32cb995ba5d443d18bbed39c7`.
- `shanghai_bund` : Promenade en bois et dalles, gratte-ciel et néons au loin, passants au loin. Point le plus lumineux : élévation 15,3°, 18,4 IL au-dessus de la médiane. SHA-256 du HDR 1k : `77276a6b67cbf09611efc46e55871eead34e1fc6fa107db412207b91cf74697e`.
- `cobblestone_street_night` : Rue pavée étroite, voitures garées, lampes de façade. Point le plus lumineux : élévation 16,0°, 18,1 IL au-dessus de la médiane. SHA-256 du HDR 1k : `d12d245f4202d9fafe426c2b100f10e9a64981023ed762b24ec568c29289a326`.

### (f) Neige ou plage très claire

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`snowy_field`](https://polyhaven.com/a/snowy_field) | Snowy Field | Andreas Mischok (All) | 1613048460 (2021-02-11 13:01) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, skies, nature, morning-afternoon, partly cloudy, high contrast, natural light | time_of_day: afternoon, weather: partly_cloudy, light_type: natural, contrast: high, season: winter, sky_view: open | 22 | absent | 19240 × 9620 | 4 465 689 o (4,3 Mio) | 1 439 902 o | 5 887 999 o | 24 077 862 o |
| [`horn-koppe_snow`](https://polyhaven.com/a/horn-koppe_snow) | Horn-koppe Snow | Grzegorz Wronkowski (All) | 1739878320 (2025-02-18 11:32) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, natural light, nature, skies, high contrast, clear, morning-afternoon | time_of_day: afternoon, weather: clear, light_type: natural, contrast: high, season: winter, sky_view: open | 24 | 5400 | 30000 × 15000 | 33 095 963 o (31,6 Mio, au-delà de 25 Mio) | 1 298 435 o | 5 250 240 o | 22 615 821 o |
| [`spiaggia_di_mondello`](https://polyhaven.com/a/spiaggia_di_mondello) | Spiaggia di Mondello | Andreas Mischok (All) | 1569847200 (2019-09-30 12:40) | Coast & Water/Beaches/Sandy Beaches | outdoor, skies, nature, morning-afternoon, clear, high contrast, natural light, collection: smugglers_cove | time_of_day: afternoon, weather: clear, light_type: natural, contrast: high, season: summer, sky_view: open | 25 | absent | 20000 × 10000 | 3 907 991 o (3,7 Mio) | 1 533 242 o | 6 230 981 o | 24 922 166 o |
| [`passendorf_snow`](https://polyhaven.com/a/passendorf_snow) | Passendorf Snow | Grzegorz Wronkowski (All) | 1739956680 (2025-02-19 09:18) | Fields & Countryside/Grassland & Meadows/Open Fields & Meadows | outdoor, natural light, nature, high contrast, skies, clear, morning-afternoon | time_of_day: morning, weather: clear, light_type: natural, contrast: high, season: winter, sky_view: open | 24 | 5400 | 30000 × 15000 | 38 573 835 o (36,8 Mio, au-delà de 25 Mio) | 1 358 686 o | 5 514 266 o | 23 554 195 o |
| [`snowy_park_01`](https://polyhaven.com/a/snowy_park_01) | Snowy Park 01 | Oliksiy Yakovlyev (All) | 1547201340 (2019-01-11 10:09) | Parks & Gardens/Parks/Open Parkland | outdoor, nature, midday, overcast, low contrast, natural light | time_of_day: midday, weather: overcast, light_type: natural, contrast: low, season: winter, sky_view: open | 8 | 5050 | 17000 × 8500 | 5 124 952 o (4,9 Mio) | 1 211 017 o | 4 998 322 o | 21 227 714 o |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `snowy_field` : Champ de neige avec des traces, arbres, quelques nuages, soleil visible. Point le plus lumineux : élévation 22,0°, 17,0 IL au-dessus de la médiane. SHA-256 du HDR 1k : `10dd39cab697dcb51f57e3e52f030e7d2a9b174bdc1c53523ff07ce3d1d8cb6f`.
- `horn-koppe_snow` : Champ de neige, forêt au loin, ciel dégagé, soleil visible. Point le plus lumineux : élévation 28,3°, 17,1 IL au-dessus de la médiane. SHA-256 du HDR 1k : `c2af5ce6fd4e4f672e258106aa48cac89379574c7bbe0962898d018e063d8def`.
- `spiaggia_di_mondello` : Plage de sable clair, pins, mer sur les côtés, soleil visible. Point le plus lumineux : élévation 25,1°, 17,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `7fe3227764fd224629bb92b794917493aaf16bbd9eb610d1fb12a1a52f43603c`.
- `passendorf_snow` : Champ de neige piétiné, collines boisées, ciel dégagé. Point le plus lumineux : élévation 17,8°, 15,8 IL au-dessus de la médiane. SHA-256 du HDR 1k : `4850ada6523d89600d16404607019c04786745965075b08a0adab696d89d9465`.
- `snowy_park_01` : Parc enneigé par ciel couvert : pas de soleil, pas d'ombres. Point le plus lumineux : élévation −4,0°, 0,6 IL au-dessus de la médiane. SHA-256 du HDR 1k : `568ee3a777e07dd69eb77722cebd8cf02b361b990922d7f36ef22caf67d5101d`.

### (g) Intérieur sombre (église, musée)

| Identifiant (page) | Nom | Auteur(s) (`authors`) | `date_taken` (UTC) | `category` | `categories` | `attributes` | `evs_cap` | `whitebalance` | `max_resolution` | JPG 8192 × 4096 (`tonemapped.size`) | HDR 1k | HDR 2k | HDR 4k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [`small_cathedral`](https://polyhaven.com/a/small_cathedral) | Small Cathedral | Sergej Majboroda (All) | 1583334420 (2020-03-04 15:07) | Interiors/Religious/Churches & Cathedrals | indoor, urban, low contrast, natural light | weather: clear, light_type: natural, contrast: low, backplates: True | 15 | 4000 | 16384 × 8192 | 4 079 607 o (3,9 Mio) | 1 665 438 o | 6 567 642 o | 25 952 000 o |
| [`st_fagans_interior`](https://polyhaven.com/a/st_fagans_interior) | St. Fagans Interior | Morgan Evans (All) | 1598709600 (2020-08-29 14:00) | Interiors/Cultural & Civic/Museums & Galleries | indoor, urban, low contrast, artificial light | light_type: artificial, contrast: low | 12 | absent | 16384 × 8192 | 3 326 664 o (3,2 Mio) | 1 524 050 o | 6 124 146 o | 24 206 466 o |
| [`hall_of_mammals`](https://polyhaven.com/a/hall_of_mammals) | Hall of Mammals | Oliksiy Yakovlyev (All) | 1544441940 (2018-12-10 11:39) | Interiors/Cultural & Civic/Museums & Galleries | indoor, urban, medium contrast, artificial light | light_type: artificial, contrast: medium | 8 | 5050 | 17000 × 8500 | 5 387 654 o (5,1 Mio) | 1 667 030 o | 6 607 673 o | 26 218 800 o (au-delà de 25 Mio) |
| [`museum_of_ethnography`](https://polyhaven.com/a/museum_of_ethnography) | Museum of Ethnography | Oliksiy Yakovlyev (All) | 1542715500 (2018-11-20 12:05) | Interiors/Cultural & Civic/Museums & Galleries | indoor, urban, medium contrast, artificial light | light_type: artificial, contrast: medium | 8 | 5050 | 17500 × 8750 | 7 647 250 o (7,3 Mio) | 1 658 398 o | 6 489 316 o | 25 364 400 o |
| [`afrikaans_church_interior`](https://polyhaven.com/a/afrikaans_church_interior) | Afrikaans Church Interior | Dimitrios Savva (Photography), Jarod Guest (Processing) | 1758557400 (2025-09-22 16:10) | Interiors/Religious/Churches & Cathedrals | indoor, high contrast, natural light, urban, morning-afternoon | light_type: natural, contrast: high | 17 | 4634 | 20480 × 10240 | 45 432 738 o (43,3 Mio, au-delà de 25 Mio) | 1 653 988 o | 6 534 258 o | 25 677 856 o |
| [`graaff_reinet_groote_kerk`](https://polyhaven.com/a/graaff_reinet_groote_kerk) | Graaff Reinet Groote Kerk | Dario Barresi (All) | 1765377060 (2025-12-10 14:31) | Interiors/Religious/Churches & Cathedrals | indoor, urban, artificial light, medium contrast | light_type: mixed, contrast: medium, weather: overcast | 16 | 5303 | 24576 × 12288 | 32 868 811 o (31,3 Mio, au-delà de 25 Mio) | 1 684 846 o | 6 645 536 o | 25 955 171 o |
| [`chapel_day`](https://polyhaven.com/a/chapel_day) | Chapel Day | Dimitrios Savva (Photography), Jarod Guest (Processing) | 1708856940 (2024-02-25 10:29) | Interiors/Religious/Chapels | indoor, urban, artificial light, natural light, low contrast, midday | light_type: mixed, contrast: low | 22 | 3035 | 20480 × 10240 | 45 626 563 o (43,5 Mio, au-delà de 25 Mio) | 1 710 976 o | 6 725 444 o | 26 350 695 o (au-delà de 25 Mio) |

Ce que j'ai vu sur l'aperçu et mesuré sur le fichier HDR 1k (ce n'est pas une donnée de Poly Haven ; l'élévation est comptée depuis l'horizon, négative si le point est plus bas que l'appareil) :

- `small_cathedral` : Petite église (icônes, lustre), plancher et tapis rouge, fenêtres hautes à vitraux. Sol dégagé. Point le plus lumineux : élévation 29,7°, 7,5 IL au-dessus de la médiane. SHA-256 du HDR 1k : `69aba290fe2ce551df6b38267e35010181e7ba6366454432f86799c2611f6bc6`.
- `st_fagans_interior` : Hall de musée moderne, parquet, bancs, éclairage de plafond. Sol dégagé. Point le plus lumineux : élévation 28,3°, 11,1 IL au-dessus de la médiane. SHA-256 du HDR 1k : `8b73849c956e2d97e7a6cfacbe9396d90a84fcbd9b24327a37a6629150055cca`.
- `hall_of_mammals` : Salle de musée, dioramas sous vitrine, squelettes, parquet en chevrons, plafonniers. Point le plus lumineux : élévation 22,0°, 8,3 IL au-dessus de la médiane. SHA-256 du HDR 1k : `5c333ce7c5e2cbd030bea804d03235594d4b448bbd14288206c2f52e31a594f0`.
- `museum_of_ethnography` : Salle de musée, vitrines, objets exposés, parquet brillant, tubes fluorescents. Point le plus lumineux : élévation 13,9°, 8,9 IL au-dessus de la médiane. SHA-256 du HDR 1k : `40ba39d87dee4cb4d001ca37034856f9952468dc3c97bf63994c25592701a0f4`.
- `afrikaans_church_interior` : Église, rangées de bancs, allée à tapis rouge, plafond de bois. Point le plus lumineux : élévation 15,3°, 15,2 IL au-dessus de la médiane. SHA-256 du HDR 1k : `fdd54ad956c6b2bbc1507fbd8bd735baf21957a7d3545a6ee2f81c80f4d3df07`.
- `graaff_reinet_groote_kerk` : Grande église à charpente de bois, bancs, tapis rouge, lampes allumées. Point le plus lumineux : élévation 82,1°, 17,1 IL au-dessus de la médiane. SHA-256 du HDR 1k : `2cfc81395f27f08f6d9bd41c232f9efa990ac4c24088a838493f17a75cdf80c4`.
- `chapel_day` : Chapelle, bancs, allée centrale claire, croix lumineuse. Point le plus lumineux : élévation 23,0°, 12,4 IL au-dessus de la médiane. SHA-256 du HDR 1k : `cd7436c6ba5d621247c2daaa070bcffb8d5dbd19e376401fd3268ff8be48bff6`.

Planches d'aperçus que j'ai tirées des HDR 1k pour regarder chaque photo : `apercus/planche-a-interieur-jour.jpg` à `apercus/planche-g-interieur-sombre.jpg`.

Autres photos repérées dans la liste, sans lecture de `/info` ni de `/files` (valeurs de `api-assets-hdris.json` seulement), pour des situations N1 hors des sept cadres :
- brouillard (SIT-14) : `misty_farm_road` (weather: fog, afternoon), `kloofendal_misty_morning` (fog, morning) ; 11 photos ont `weather: fog` ;
- pluie (SIT-40) : `castel_st_angelo_roof` (rain, morning), `teufelsberg_roof` (rain, afternoon), `vignaioli_night` (rain, night) ; 3 photos ont `weather: rain` ;
- terrain de sport (SIT-38) : `orlando_stadium` (tableau b), `suburban_soccer_park` et `suburban_football_field` (overcast) ;
- aquarium (SIT-26) : `ushaka_sea_world_aquarium`.

## 3. Luminance absolue : indice de lumination de chaque cadre

Source secondaire : Wikipedia, « Exposure value », révision 1352562239 du 4 mai 2026 à 23 h 22 (« as edited by Tom Bertin »), https://en.wikipedia.org/w/index.php?title=Exposure_value&oldid=1352562239, lue le 11 novembre 2026, fichier `wikipedia-exposure-value-oldid-1352562239.html`. C'est la révision déjà citée dans `docs/camera-physique.md`, et la page la donne comme révision courante le jour de la lecture.

Ce que dit la page sur sa table :
- « Exposure values in Table 2 are taken from ANSI exposure guides PH2.7-1973 and PH2.7-1986. Where the two guides differ, ranges of values have been given or extended. »
- « Exposure values in Table 2 are reasonable general guidelines, but they should be used with caution. For simplicity, they are rounded to the nearest integer, and they omit numerous considerations described in the ANSI exposure guides from which they are derived. »
- Note attachée aux deux lignes de plein soleil : « Values for direct sunlight apply between approximately two hours after sunrise and two hours before sunset, and assume front lighting. As a rough general rule, decrease EV by 1 for side lighting, and decrease EV by 2 for back lighting. »
- Sur les scènes de nuit : « Although it usually works well for typical outdoor scenes in daylight, it is less applicable to scenes with highly atypical luminance distributions, such as city skylines at night. »
- Luminance : « Using K = 12.5, the relationship between EV at ISO 100 and luminance L is then L = 2^(EV − 3) cd/m² » (formule de la page, écrite ici en ligne). La table « Exposure value vs. Luminance (ISO 100, K = 12.5) and Illuminance (ISO 100, C = 250) » donne, en cd/m² et en lux : EV 16 : 8192 et 163 840 ; EV 15 : 4096 et 81 920 ; EV 14 : 2048 et 40 960 ; EV 13 : 1024 et 20 480 ; EV 12 : 512 et 10 240 ; EV 11 : 256 ; EV 10 : 128 ; EV 9 : 64 ; EV 8 : 32 ; EV 7 : 16 ; EV 5 : 4 ; EV 3 : 1 ; EV 2 : 0,5.

Lignes de la « Table 2: Exposure values (ISO 100) for various lighting conditions » qui touchent chaque cadre (libellés exacts) :

| Cadre | Ligne de la table | EV₁₀₀ | Remarque |
| --- | --- | --- | --- |
| (a) intérieur de jour, fenêtre | aucune | Je ne sais pas | La table n'a de lignes d'intérieur que sous « Indoor, artificial light » : « Home interiors », 5–7 ; « Offices and work areas », 7–8. Aucune ligne pour un intérieur éclairé par la lumière du jour. |
| (b) plein soleil, midi | « Typical scene in full or slightly hazy sunlight (distinct shadows) » | 15 | Éclairage de face ; −1 de côté, −2 en contre-jour (note citée). Autre note de la même ligne : « This is approximately the value given by the sunny 16 rule. » |
| (c) soleil bas | « Sunsets and skylines » : « Just before sunset » | 12–14 | « At sunset » : 12. Ces lignes décrivent le coucher de soleil comme sujet ; la ligne de plein soleil ne vaut plus à moins de deux heures du coucher (note citée). Pour un sujet en contre-jour devant ce ciel : Je ne sais pas. |
| (d) crépuscule, heure bleue en ville | « Sunsets and skylines » : « Just after sunset » | 9–11 | Les lignes de nuit s'appliquent aux parties éclairées (ci-dessous). |
| (e) nuit en ville éclairée | « Bright street scenes » | 8 | « Night street scenes and window displays » : 7–8 ; « Neon and other bright signs » : 9–10 ; « Night vehicle traffic » : 5 ; « Floodlit buildings, monuments, and fountains » : 3–5 ; « Distant views of lighted buildings » : 2. |
| (f) neige ou plage | « Light sand or snow in full or slightly hazy sunlight (distinct shadows) » | 16 | Même note que (b). Par ciel couvert, la table n'a pas de ligne propre à la neige. |
| (g) intérieur sombre (église, musée) | « Galleries » (sous « Indoor, artificial light ») | 8–11 | Aucune ligne pour une église. « Home interiors » : 5–7. |

Rappel, déjà dans le dépôt : « Typical scene, cloudy bright (no shadows) » : 13 ; « Typical scene, heavy overcast » : 12 ; « Areas in open shade, clear sunlight » : 12.

## 4. Accessoires : modèles 3D de Poly Haven pour un intérieur

Source : liste https://api.polyhaven.com/assets?t=models (`api-assets-models.json`, 521 modèles), puis `/info/ID` et `/files/ID` pour 27 modèles (`api-info-ID.json`, `api-files-ID.json`), et la page de 14 d'entre eux pour la licence (CC0, section 2.1) et le nombre de triangles. Aucun modèle n'a été téléchargé. Les modèles sont livrés en glTF (`/files/ID`, clé `gltf`), en 1k, 2k, 4k et parfois 8k ; le poids ci-dessous est la somme du fichier `.gltf` et de ses dépendances (`include`) en 1k. Contrôle : la même somme pour `painted_wooden_bench` donne 1 989 639 octets, le poids exact du banc dans le manifeste du parc.

| Besoin | Identifiant | Nom | Auteur(s) | Catégorie | glTF 1k (octets, fichiers) | Triangles (page) |
| --- | --- | --- | --- | --- | --- | --- |
| Table | `wooden_table_02` | Wooden Table 02 | Serhii Khromov | Furniture/Tables/Dining Tables | 485 316 (5) | 196 |
| Table | `round_wooden_table_01` | Round Wooden Table 01 | Ulan Cabanilla | Furniture/Tables/Dining Tables | 550 374 (5) | 8640 |
| Table | `painted_wooden_table` | Painted Wooden Table | Kirill Sannikov | Furniture/Tables/Dining Tables | 1 779 493 (5) | non relevé |
| Table nappée | `dining_table` | Dining Table | Aron Łyczek | Furniture/Tables/Dining Tables | 2 283 933 (5) | non relevé |
| Table d'appoint | `side_table_01` | Side Table 01 | James Ray Cock | Furniture/Tables/Side & End Tables | 505 268 (5) | 2756 |
| Table d'appoint | `small_wooden_table_01` | Small Wooden Table 01 | Ulan Cabanilla | Furniture/Tables/Side & End Tables | 414 763 (5) | non relevé |
| Chaise | `painted_wooden_chair_01` | Painted Wooden Chair 01 | Kuutti Siitonen | Furniture/Seating/Chairs | 492 550 (5) | 724 |
| Chaise | `painted_wooden_chair_02` | Painted Wooden Chair 02 | Kirill Sannikov | Furniture/Seating/Chairs | 2 396 396 (5) | non relevé |
| Chaise | `dining_chair_02` | Dining Chair 02 | James Ray Cock | Furniture/Seating/Chairs | 921 075 (5) | 22 013 |
| Fauteuil | `modern_arm_chair_01` | Modern Arm Chair 01 | Vibrant Nordic | Furniture/Seating/Chairs | 2 698 032 (8) | 8916 |
| Tabouret | `wooden_stool_01` | Wooden Stool 01 | Kuutti Siitonen | Furniture/Seating/Stools & Bar Seating | 961 720 (5) | non relevé |
| Lampe de bureau | `desk_lamp_arm_01` | Desk Lamp Arm 01 | Yann Kervran, Kuutti Siitonen | Lighting/Floor & Desk/Desk Lamps | 2 875 984 (5) | 25 710 |
| Lampe de bureau | `industrial_pipe_lamp` | Industrial Pipe Lamp | Mateusz Sadek | Lighting/Floor & Desk/Desk Lamps | 2 408 199 (6) | non relevé |
| Suspension | `modern_ceiling_lamp_01` | Modern Ceiling Lamp 01 | James Ray Cock | Lighting/Ceiling/Pendant Lights | 436 065 (5) | 5602 |
| Lampe à pétrole | `vintage_oil_lamp` | Vintage Oil Lamp | Monsta3D | Lighting/Portable/Oil Lamps | 2 070 002 (9) | non relevé |
| Bougeoirs | `brass_candleholders` | Brass Candleholders | Tina | Lighting/Portable/Candles & Candlesticks | 9 502 440 (15) | non relevé |
| Cadre au mur | `hanging_picture_frame_01` | Hanging Picture Frame 01 | James Ray Cock | Decor & Art/Wall Decor/Picture Frames & Art | 397 466 (8) | 2586 |
| Cadre au mur | `fancy_picture_frame_01` | Fancy Picture Frame 01 | Rob Tuytel, Rico Cilliers | Decor & Art/Wall Decor/Picture Frames & Art | 741 506 (8) | non relevé |
| Objet sur la table (SIT-23) | `tea_set_01` | Tea Set 01 | James Ray Cock, Rico Cilliers, Jurita Burger | Food & Kitchen/Tableware/Tea & Coffee Sets | 2 282 591 (5) | 40 296 |
| Plat (SIT-23) | `carrot_cake` | Carrot Cake | Greg Zaal, James Ray Cock | Food & Kitchen/Prepared Food/Cakes & Pastries | 3 362 843 (5) | 13 790 |
| Plat (SIT-23) | `croissant` | Croissant | Greg Zaal, Dario Barresi | Food & Kitchen/Prepared Food/Cakes & Pastries | 2 098 773 (5) | non relevé |
| Fruit (SIT-23) | `food_apple_01` | Food Apple 01 | Oliver Harries | Food & Kitchen/Produce/Fruit | 473 812 (5) | 7012 |
| Vase | `ceramic_vase_01` | Ceramic Vase 01 | James Ray Cock | Decor & Art/Vases & Vessels/Ceramic Vases | 418 457 (5) | 2548 |
| Bol | `wooden_bowl_01` | Wooden Bowl 01 | Oliver Harries | Food & Kitchen/Tableware/Bowls | 1 823 237 (5) | non relevé |
| Pichet | `jug_01` | Jug 01 | Kuutti Siitonen | Food & Kitchen/Tableware/Jugs & Pitchers | 1 227 735 (5) | non relevé |
| Ballon (SIT-38, SIT-39) | `dirty_football` | Dirty Football | Rohit Seervi | Leisure/Sports/Balls | 1 995 001 (5) | 37 486 |

Ce que la liste ne contient pas :
- **Cadre de fenêtre** : aucun. La catégorie `Architecture/Windows & Shutters` ne contient que quatre rideaux métalliques (`rollershutter_window_01` à `_03`, `rollershutter_door`) ; la recherche du mot « window » dans les noms, étiquettes et descriptions ne renvoie par ailleurs qu'une cuisinière, une porte de château et deux façades modulaires (`modular_factory_facade`, `modular_urban_apartments_facade`).
- **Lampadaire d'intérieur (sur pied)** : aucun. `Lighting/Floor & Desk` ne contient que les deux lampes de bureau du tableau. Il y a 5 lustres, 3 suspensions, 3 appliques industrielles.
- **Rideau, voilage** : aucun.
- **Personnage ou animal vivant** : aucun personnage ; des statues et un rat (`street_rat`). Les personnages et le chien du parc viennent de Sketchfab (CC BY 4.0).

## 5. Mesures faites sur les fichiers téléchargés

Ce sont mes mesures, pas des données de Poly Haven. Scripts : dossier `scenes-scripts/` du bloc-notes (`hdr.py`, `boxes.py`, `jpegdim.py`, `jpgstat.py`). Résultats bruts : `apercus/mesures-hdr1k.json`, `apercus/mesures-zones-interieurs.json`.

- **Intégrité** : les 38 fichiers HDR 1k téléchargés ont la taille et l'empreinte MD5 annoncées par `/files/ID` ; de même les JPG `lebombo.jpg` et `rooitou_park.jpg`.
- **Lecture** : format Radiance RGBE, 1024 × 512 px, projection équirectangulaire ; luminance relative Y = 0,2126 R + 0,7152 G + 0,0722 B ; chaque pixel pondéré par son angle solide (cosinus de l'élévation). Élévation du centre de la ligne i : 90° − (i + 0,5) × 180° / 512.
- **Hauteur du soleil** (élévation du pixel le plus lumineux) : `noon_grass` 85,6° ; `suburban_garden` 64,2° ; `wide_street_01` 52,9° ; `orlando_stadium` 51,9° ; `dreifaltigkeitsberg` 42,7° ; `circus_maximus_2` 30,8° ; `horn-koppe_snow` 28,3° ; `spiaggia_di_mondello` 25,1° ; `snowy_field` 22,0° ; `park_bench` 19,2° ; `passendorf_snow` 17,8° ; `sisulu` 15,3° ; `rooitou_park` 10,4° ; `spruit_sunrise` 7,9°. À 1024 px de large, un pixel couvre 0,35° : la hauteur est donnée à un demi-pixel près, et la valeur du pixel du soleil est une moyenne.
- **Les fichiers HDR ne sont pas à une échelle absolue commune.** Moyenne de la luminance sur la sphère, en unités du fichier :

| Fichier | Cadre | Moyenne sur la sphère | Médiane | Maximum | Éclairement d'un plan horizontal | Part venant d'un disque de 5° autour du maximum |
| --- | --- | --- | --- | --- | --- | --- |
| `autumn_hockey` | parc, couvert | 1,39 | 0,253 | 13,5 | 13,1 | 0,024 |
| `noon_grass` | b | 0,554 | 0,208 | 63 300 | 5,18 | 0,813 |
| `wide_street_01` | b | 0,924 | 0,158 | 152 000 | 8,05 | 0,875 |
| `rooitou_park` | c | 0,756 | 0,146 | 64 900 | 1,97 | 0,609 |
| `spruit_sunrise` | c | 1,27 | 0,128 | 161 000 | 2,75 | 0,639 |
| `neuer_zollhof` | d | 1,38 | 0,26 | 56 200 | 9,06 | 0,772 |
| `golden_bay` | d | 0,644 | 0,122 | 25 500 | 1,30 | 0,601 |
| `hansaplatz` | e | 0,963 | 0,053 | 12 800 | 1,88 | 0,458 |
| `zwinger_night` | e | 1,12 | 0,0785 | 54 200 | 1,29 | 0,212 |
| `snowy_field` | f | 0,361 | 0,208 | 27 500 | 1,03 | 0,677 |
| `spiaggia_di_mondello` | f | 0,841 | 0,361 | 70 900 | 3,23 | 0,726 |
| `lebombo` | a | 0,722 | 0,472 | 23,3 | 2,03 | 0,002 |
| `small_empty_house` | a | 0,919 | 0,516 | 2 600 | 2,85 | 0,117 |
| `small_cathedral` | g | 0,587 | 0,411 | 73,3 | 2,74 | 0,049 |
| `st_fagans_interior` | g | 0,826 | 0,51 | 1 110 | 3,22 | 0,031 |

  Une place de nuit (`hansaplatz`, moyenne 0,963) a une moyenne plus haute qu'un pré en plein soleil (`noon_grass`, 0,554), alors que la table de Wikipedia les sépare de 7 IL (8 contre 15). Les fichiers sont donc ramenés chacun à une exposition d'affichage : la luminance absolue d'une scène ne se lit pas dans le fichier, elle se fixe avec une valeur extérieure, comme le dépôt l'a fait pour le parc.
- **Moyenne ou médiane** : dès que le soleil ou un lampadaire est dans la photo, la moyenne sur la sphère est tirée par quelques pixels. Pour `rooitou_park`, la moyenne (0,756) vaut 5,2 fois la médiane (0,146), soit 2,4 IL ; pour `hansaplatz`, 18 fois, soit 4,2 IL. La phrase de `docs/camera-physique.md`, « La scène est donc mise à l'échelle pour que sa luminance moyenne vaille 2^(12,5 − 3) », ne suffit plus pour ces scènes : il faut dire la moyenne de quoi.
- **Le JPG de fond est compressé en contraste, pas écrêté** : dans `lebombo.jpg` (décodé à 2048 × 1024 px), 0,3 % des pixels ont un canal à 255 et la vue par la fenêtre reste lisible (`apercus/lebombo-jpg-apercu.jpg`), alors que le HDR 1k de la même pièce place l'extérieur vu par la fenêtre 1,5 à 2,2 IL au-dessus des murs et la tache de soleil au sol 0,5 IL au-dessus de cet extérieur (zones et valeurs dans `apercus/mesures-zones-interieurs.json`). Dans `rooitou_park.jpg`, 0,12 % des pixels ont un canal à 255, soleil compris.
- **Définition du fond** : 8192 px pour 360° font 22,8 px par degré. Calcul : avec le capteur du Z 6 (35,9 mm de large, `docs/camera-physique.md`), le champ horizontal à 50 mm est 2 × arctan(17,95 / 50) = 39,5°, soit 899 px de fond pour une photo de 1500 px de large (`PHOTO_LONG_SIDE`) ; à 200 mm, 10,3° et 233 px. Un fond HDR 4k (4096 px) en donnerait la moitié, un HDR 2k le quart.

## 6. Ce qui n'est pas sourcé

- **Indice de lumination d'un intérieur de jour éclairé par une fenêtre (a)** : la table de Wikipedia n'a pas de ligne. Je ne sais pas. Piste de calcul, non sourcée, à ne pas mettre en œuvre sans décision : partir d'une valeur sourcée d'éclairement au soleil (81 920 lux à EV 15, table de la page) et des rapports mesurés dans le HDR entre la tache de soleil au sol et les murs. Elle bute sur deux inconnues : le facteur de réflexion du sol, et, pour `lebombo`, la transmission du voilage. Essai sur `small_empty_house` : les murs sont 4,1 à 4,7 IL sous la médiane de la tache de soleil (5,5 à 6,1 IL sous son pixel le plus clair, la tache étant petite à cette définition) ; avec un sol réfléchissant 30 à 70 % de la lumière (hypothèse), on obtient des murs entre EV 9,8 et 13,1 : une fourchette de plus de 3 IL, trop large pour être retenue. Le calcul suppose en plus un sol mat et un soleil qui donne 81 920 lux sur ce sol, ce que je ne sais pas.
- **Indice de lumination d'une église (g)** : pas de ligne. « Galleries », 8–11, est sous « Indoor, artificial light » ; trois des candidates (g) sont des musées, où cette ligne s'applique au mieux à l'éclairage artificiel.
- **Exposition d'un portrait en contre-jour au soleil bas (c)** : la table donne le coucher de soleil comme sujet (12–14, puis 12), pas le visage à l'ombre devant lui.
- **Heure bleue (d)** : la table donne « Just after sunset », 9–11, sans dire combien de minutes après le coucher ; les attributs de Poly Haven disent `dusk`, sans heure fiable (`date_taken` est déclaré non fiable).
- **Hauteur de prise de vue** des photos : non publiée par l'API. Je ne sais pas.
- **Échelle des valeurs des fichiers HDR** et protocole de prise de vue de Poly Haven : la documentation (`docs.polyhaven.com`) est hors des hôtes autorisés, non lue. Ma mesure du point 5 montre seulement que les moyennes ne suivent pas la luminosité réelle des scènes.
- **Droits sur ce que les photos montrent** : `small_cathedral` montre des icônes et des peintures, `hall_of_mammals` et `museum_of_ethnography` des objets de musée, `shanghai_bund` des passants au loin, `cobblestone_street_night` des voitures garées. Poly Haven place ses photos sous CC0 ; je n'ai rien lu sur les œuvres, les personnes ou les plaques visibles dedans.
- **Cadre de fenêtre, lampadaire d'intérieur, rideau** : absents de Poly Haven (point 4). Je n'ai pas cherché sur ambientCG ni sur Sketchfab dans cette mission.
- **Personnages pour un intérieur ou un terrain de sport** (enfant, joueurs), feux d'artifice (SIT-21), véhicules en mouvement pour les traînées lumineuses (SIT-17) : non cherchés.
- **Nombre de triangles** de 12 des 26 modèles du tableau : pages non ouvertes (« non relevé »).

## 7. Proposition pour TutoPhoto

Proposition de Claude (agent de recherche), à trancher par Julien. Elle ne lève pas la règle « pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants ».

### 7.1 Ordre des scènes, selon les situations N1 qu'elles débloquent

Décompte fait sur le champ `where_when` de `data/situations.yaml`. Le parc couvre déjà SIT-01, SIT-05 et SIT-06. Les situations « Partout » (SIT-28, SIT-V2-06), « Intérieur ou extérieur » (SIT-05) et « Extérieur ou studio » (SIT-V2-02) sont possibles dans le parc et ne comptent pour aucune nouvelle scène.

| Rang | Scène | Nouvelles situations N1 | Situations N2 du même cadre (relevé partiel) | Photo proposée, puis remplaçante | Indice de lumination sourcé |
| --- | --- | --- | --- | --- | --- |
| 1 | (a) Intérieur de jour près d'une fenêtre | 3 : SIT-04, SIT-23, SIT-39 | SIT-32 | `lebombo`, puis `small_empty_house` | Non (point 6) |
| 2 | (f) Neige ou plage au soleil | 1 : SIT-13 | aucune | `snowy_field`, puis `spiaggia_di_mondello` | Oui : 16 |
| 3 | (c) Parc au soleil bas | 1 : SIT-10, et le cadre exact de SIT-06 (« Parc, fin de journée ») | SIT-03 | `rooitou_park`, puis `spruit_sunrise` | En partie : 12–14, pour le ciel |
| 4 | (d) Ville au crépuscule | 1 : SIT-17 | aucune | `neuer_zollhof`, puis `golden_bay` | En partie : 9–11 |
| 5 | (b) Plein soleil à midi | 0 avec un pré ou une rue ; 1 (SIT-38) avec `orlando_stadium` et des joueurs | SIT-02 (flash requis) | `noon_grass` ou `wide_street_01` ; `orlando_stadium` pour SIT-38 | Oui : 15 |
| 6 | (e) Ville la nuit | 0 (SIT-21 demande des feux d'artifice, pas seulement une scène) | SIT-34 (flash requis), SIT-35 | `hansaplatz`, puis `zwinger_night` | Oui, par type de sujet : 8, 7–8, 3–5 |
| 7 | (g) Intérieur sombre | 0 | SIT-18 | `small_cathedral`, puis `st_fagans_interior` | En partie : 8–11 pour un musée |

Raisons du choix des photos : sol dégagé sur l'aperçu, JPG de fond sous 25 Mio sans réencodage, et conformité au cadre.
- (a) `lebombo` : pièce vide, une seule grande baie, JPG de 1 873 244 octets. Réserve : `light_type: mixed`, des appliques murales sont allumées (ce qui sert COU-03, « Lumière mixte », notion clé de SIT-04) ; `whitebalance` 4200 K. `small_empty_house` est en lumière naturelle seule, avec une porte ouverte et des taches de soleil.
- (f) `snowy_field` : neige, soleil à 22°, JPG de 4 465 689 octets ; `weather: partly_cloudy`. `horn-koppe_snow` est par ciel dégagé mais son JPG fait 33 095 963 octets, au-delà de la limite.
- (c) `rooitou_park` : un parc, soleil visible à 10,4°, `weather: clear`, JPG de 6 921 351 octets.
- (d) `neuer_zollhof` : JPG de 5 105 020 octets, mais le ciel est nuageux et gris-bleu ; `golden_bay` a le ciel bleu profond de l'intention de SIT-17 (« Ciel bleu dense »), avec un JPG de 51 354 319 octets à réencoder.
- Les JPG au-delà de 25 Mio se réencodent (CC0 le permet) ; le champ `origin` pointe alors vers le fichier source, comme le prévoit le schéma, et je propose de remplir `changes` même si CC0 ne l'exige pas.

Avec ce classement, les quatre premières scènes portent le simulateur de 3 à 9 situations N1 sur 20 ; 6 autres (SIT-28, SIT-V2-02, SIT-V2-06 dans le parc ; SIT-14, SIT-40, SIT-38 avec d'autres photos) ne demandent pas ces cadres ; SIT-08, SIT-21, SIT-26, SIT-29 et SIT-36 demandent autre chose qu'un fond.

### 7.2 Limites, à dire dans l'outil

- **Un seul point de vue** : le fond est une photo prise d'un point. Pas de parallaxe : se déplacer ne change pas le fond, et on ne tourne pas autour de la fenêtre ou du soleil. Les sujets en 3D se placent, eux, où l'on veut.
- **La lumière ne change pas** : l'heure, la météo et la hauteur du soleil sont celles de la photo. Passer du plein soleil à l'heure dorée, c'est changer de scène. Une scène « du matin au soir » (SIT-36) est hors de portée.
- **Rien ne bouge dans le fond** : pas de traînées de phares (MVT-08, notion clé de SIT-17), pas d'eau qui coule, pas de passants. Seuls les objets en 3D bougent.
- **La fenêtre est dans la photo** : dans (a), la baie n'est pas un objet 3D. On ne règle ni sa taille ni un voilage ; le sujet reçoit la lumière de la photo HDR, pas celle d'une fenêtre simulée.
- **Définition** : 22,8 px par degré ; à 50 mm, 899 px de fond pour une photo de 1500 px ; à 200 mm, 233 px (point 5). Déjà vrai dans le parc.
- **Hauteur de l'appareil** : supposée (1,6 m), non publiée.

### 7.3 Ce qu'il faut ajouter au simulateur avant ces scènes

1. **Scène choisie par l'utilisateur** : `SCENE_URL` et `SCENE_EV100` sont des constantes. Proposition : un indice de lumination par scène, lu avec la scène (dans `scene.json`, ce qui demande d'étendre `schemas/scene.schema.json`, ou dans le code), avec sa source ; plus la rotation du fond, la hauteur de l'œil et la direction des ombres.
2. **Fond en haute dynamique pour les scènes contrastées** : le JPG est compressé en contraste (point 5), et Poly Haven écrit « do not use for lighting ». Multiplié par 2^écart, il ne brûle pas la fenêtre et ne garde pas le disque du soleil comme le ferait un capteur. Dès qu'une source est dans le champ (fenêtre, soleil, lampadaires), donc pour les cadres (a) à (f) et les églises de (g), le fond visible doit porter les vraies valeurs ; le parc, par ciel couvert (`evs_cap` 6), s'en passait. Les fichiers disponibles, pour les 38 photos regardées : HDR 2k, de 4 998 322 à 7 286 880 octets ; HDR 4k, de 21 227 714 à 28 492 181 octets, au-dessus de 25 Mio pour 12 d'entre elles (`rooitou_park` : 26 755 875 octets ; `lebombo` : 24 355 962, en dessous) ; HDR 8k, 96 059 314 octets pour `lebombo` et 105 536 644 pour `rooitou_park`, hors limites. Deux voies, à choisir après essai : (i) fond HDR 4k seul, moins défini de moitié que le JPG ; (ii) JPG pour le détail et HDR 2k pour les valeurs. Je n'ai pas de source pour (ii) : c'est une idée à éprouver, pas un fait.
3. **Mesure de la lumière dans le cadre** : aujourd'hui l'appareil virtuel vise la luminosité fixe de la scène. Les notions clés de SIT-13 (MES-03 « Pièges de la mesure », MES-04 « Correction d'exposition ») supposent que la cellule se trompe devant la neige : il faut une mesure calculée sur l'image cadrée. Même besoin pour le contre-jour (SIT-03) et la fenêtre (SIT-04, SIT-32). Le comportement de la mesure du Z 6 est à sourcer dans son manuel (hors de cette mission).
4. **Étalonnage** : dire, par scène, ce qui vaut 2^(EV − 3) cd/m². Proposition : pour (b) et (f), caler l'éclairement du sujet de face sur la valeur de la table (81 920 lux à EV 15, 163 840 à EV 16) plutôt que la moyenne de la sphère, que le soleil fausse de 2 à 4 IL (point 5). À valider sur le rendu.
5. **Ombres** : la lumière d'ombre du parc est réglée pour un ciel couvert. Au soleil, sa direction doit suivre le soleil de la photo (hauteurs mesurées au point 5 ; l'azimut est dans `apercus/mesures-hdr1k.json`, relatif au centre de l'image) et l'ombre doit être nette.

### 7.4 Première scène : ce que je ferais

La scène (a) débloque le plus de situations N1, mais son indice de lumination n'est pas sourcé et elle demande le fond en haute dynamique : elle ne peut pas partir la première sans une source de plus (un guide d'exposition qui donne les intérieurs de jour, ou une mesure faite par Julien avec son boîtier dans une pièce comparable).
La scène (f) est celle dont tout est sourcé aujourd'hui (EV 16, photo sous CC0, JPG sous la limite) et elle sert des notions déjà dans la V1 (MES-04). Elle demande la mesure dans le cadre (7.3, point 3).
Je propose donc : préparer d'abord le socle (7.3, points 1 à 3), l'éprouver sur (f) avec `snowy_field`, puis construire (a) avec `lebombo`, une table (`wooden_table_02`, 485 316 octets), une chaise (`painted_wooden_chair_01`, 492 550 octets), un objet (`tea_set_01` ou `food_apple_01`) et les personnages déjà dans le dépôt ; puis (c) avec `rooitou_park`, qui reprend tels quels les sujets du parc.

## Annexe : fichiers enregistrés (`pages/scenes/`)

- `polyhaven-license.html`, `polyhaven-our-api.html`, `api-docs-swagger.json`, `api-types.json`
- `api-assets-hdris.json`, `api-assets-models.json`, `api-categories-hdris.json`, `api-categories-models.json`
- `api-info-ID.json` et `api-files-ID.json` : 38 photos HDR et 27 modèles
- `polyhaven-a-ID.html` : 38 pages de photos HDR, 14 pages de modèles
- `wikipedia-exposure-value-oldid-1352562239.html` ; `wikipedia-exposure-value-revisions.json` est une réponse d'erreur (trop de requêtes), sans contenu utile
- `hdr1k/ID_1k.hdr` (38 fichiers), `jpg8k/lebombo.jpg`, `jpg8k/rooitou_park.jpg`, `jpg-entetes/ID.jpg.debut` (37 fichiers)
- `apercus/` : aperçus tirés des HDR 1k, planches par cadre, `mesures-hdr1k.json`, `mesures-zones-interieurs.json`
- `candidates-hdris.json`, `tables-candidates.md` : tableaux produits à partir des réponses de l'API
