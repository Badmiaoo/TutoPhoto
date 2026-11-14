# Audit du lot « Référentiel : contenu des 191 notions et des 49 situations »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Rapport écrit par un agent de Claude. **État : constats non contre-vérifiés.**
- Bilan : 17 constats (aucun « faux », 5 « incohérent », 1 « non sourcé », 11 « à améliorer »), 61 points vérifiés et justes, 15 « Je ne sais pas ». Aucune affirmation de photographie contraire à une source lue n'a été trouvée dans les textes ; une se lit de travers faute de dire d'où l'angle se mesure (OPT-12, REF-15), et une ne vaut pas pour deux des trois boîtiers lus (MES-07, REF-02). Les défauts sont ailleurs : le référentiel n'a pas suivi les fiches écrites depuis (sources, MES-07), des renvois et des notions clés manquent là où la situation en dépend (trépied, caisson étanche, verticales), huit groupes de notions se recouvrent, et quatre termes ne sont ceux d'aucun manuel.
- Version auditée : copie de travail de la branche de l'audit (version 0.3.58 en cours) ; les derniers commits qui touchent `data/referentiel/` et `data/situations.yaml` datent du 11 novembre 2026.

## Périmètre

- Les textes de `data/referentiel/*.yaml` : 191 notions (intitulé français et anglais, explication, simulateur, exercice, niveau, renvois aux situations) et les introductions des 13 domaines.
- Les textes de `data/situations.yaml` : 49 situations (titre, lieu et moment, intention, notions clés, flash, niveaux).
- Hors du lot : la structure du référentiel, ses contrôles automatiques et son périmètre (rapport `referentiel-structure.md`) ; les fiches rédigées (`content/`, rapports `fiches-exposition.md` et `fiches-mise-au-point.md`) ; les entrées de `data/sources.yaml` (rapport `sources.md`).

Ce qui a été lu :

- **Lu en entier, ligne par ligne** : les 13 fichiers de domaine (191 notions) et `data/situations.yaml` (49 situations), ainsi que `data/jalons.yaml`, `docs/lire-le-referentiel.md` et `docs/cadrage.md`.
- **Vérifié contre une source relue à son adresse** : les 17 notions du jalon de la V1 minimale, et, dans le reste, les affirmations chiffrées ou précises (liste dans « Vérifié » et dans les constats).
- **Survolé seulement** (lu, mais sans source relue pour chaque phrase) : les notions dont le texte est un programme (« Guider le regard », « Doser l'accentuation ») et non une affirmation, soit l'essentiel des domaines CMP, LEC, RET et PLA.

## Méthode

1. Lecture complète des textes, puis relevé des affirmations vérifiables (chiffres, comportements d'un boîtier, lois d'optique).
2. Relecture des sources à leur adresse quand l'hôte répond : manuels en ligne de Nikon (Z 7/Z 6, en français et en anglais), de Canon (EOS R5, en français et en anglais) et guide d'aide de Sony (ILCE-7M3, en français et en anglais) ; Wikipedia en source secondaire, avec la révision lue.
3. Comptages et recoupements par script : nombre de notions par domaine et par niveau, niveaux des situations recalculés d'après la règle de `data/situations.yaml`, renvois entre notions et situations, nombre d'occurrences de chaque terme dans les trois manuels français.
4. Confrontation des intitulés aux termes des trois manuels français.
5. Aucun navigateur, aucune modification du dépôt hors de ce rapport.

Pages enregistrées, textes extraits et scripts : dossier `audit/referentiel-contenu/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`). Les numéros de ligne sont ceux des fichiers de cette copie de travail.

## Sources

Toutes lues le 14 novembre 2026. Wikipedia est une source secondaire.

### Relues

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, manuel en ligne Z 7/Z 6 (« © Nikon Corporation »), 70 pages en anglais et 65 en français : Taking Photographs, Focus, White Balance, Silent Photography, The Mode Dial, ISO Sensitivity Button, Exposure Compensation Button, Release Mode/Self-Timer Button, The i Button, Photo Information, Defaults, 21 pages du menu Prise de vue photo, 21 réglages personnalisés (a1 à a7, a9, a10, a12, a13, b1, b2, d4, d5, d8 à d10, e1, f2, g6), Format memory card, Save user settings, AF fine-tune, Flash Modes, FV Lock, Indicators and Error Messages, Caring for the Camera and Battery, Battery Endurance, Specifications, manuel du NIKKOR Z 24–70mm f/4 S | `https://onlinemanual.nikonimglib.com/z7_z6/en/…` et `…/fr/…` | `nikon-z6-en-*.html`, `nikon-z6-fr-*.html` |
| Nikon, manuel en ligne Z f, « d3: Pre-Release Capture Options » (en anglais ; la même page en français répond 404) | adresse de `nikon-zf-prerelease` | `nikon-zf-prerelease.html` |
| Sony, guide d'aide ILCE-7M3 (PDF, « Copyright 2018 Sony Corporation »), en anglais et en français | `https://helpguide.sony.net/ilc/1720/v1/en/print.pdf`, `…/fr/print.pdf` | `sony-7m3-en-print.pdf`, `sony-7m3-fr-print.pdf` |
| Sony, guide d'aide DSC-RX10M4 (PDF et page « Focus Mode ») | `https://helpguide.sony.net/dsc/1720/v1/en/print.pdf` ; adresse de `sony-rx10iv-limiter` | `sony-rx10m4-print.pdf`, `sony-rx10m4-limiter.html` |
| Canon, manuel en ligne EOS R5 (« © CANON INC. 2025 »), 41 pages en anglais et 40 en français : modes de prise de vue, qualité d'image, sensibilité ISO, HDR PQ, anti-scintillement, balance des blancs, style d'image, réduction du bruit en pose longue, expositions multiples, bracketing de mise au point, mode d'obturation, mesure, correction d'exposition, mémorisation d'exposition, opération autofocus, méthode autofocus, mise au point manuelle, fonctions AF personnalisées, mode d'acquisition, retardateur, alerte de surexposition, zébrures, cartes, formatage, fonctions personnalisées, caractéristiques | `https://cam.start.canon/en/C003/manual/html/…` et `…/fr/…` | `canon-r5-en-*.html`, `canon-r5-fr-*.html` |
| Tiffen (Lowel), « Foundations of Lighting: Understanding Soft Light » | adresse de `tiffen-lowel-soft-light` | `tiffen-soft-light.html` |
| Wikipedia (source secondaire), révisions courantes lues en wikitexte, citées dans ce rapport : « Backscatter (photography) » 1301675266, « Bayer filter » 1384004962, « Bokeh » 1382683314, « Brewster's angle » 1373604193, « Close-up lens » 1327657034, « Dark-frame subtraction » 1359409759, « Depth of field » 1383569728, « Diffraction spike » 1368876754, « Dynamic range » 1384581363, « Entrance pupil » 1378470579, « Exposing to the right » 1359410976, « Exposure compensation » 1382677993, « Exposure value » 1352562239, « Extension tube » 1382668225, « Focus stacking » 1382674337, « Golden hour (photography) » 1382491336, « Hyperfocal distance » 1382493010, « Inverse-square law » 1384166303, « Light meter » 1382667037, « Metering mode » 1382663556, « Panning (camera) » 1372970130, « Perspective distortion » 1381419682, « Polarizing filter (photography) » 1382680188, « Posterization » 1369953124, « Rule of thirds » 1383322855, « Shutter (photography) » 1383569461, « Sunny 16 rule » 1382475636, « Teleconverter » 1382663333, « Underwater photography » 1381585685, « Zone System » 1382492262 | `https://en.wikipedia.org/w/index.php?title=…&oldid=…&action=raw` | `wiki-<titre>-<révision>.wikitext` |

Quinze autres articles de Wikipedia ont été enregistrés sans qu'une citation en soit tirée (« Autofocus », « Flash synchronization », « Image stabilization », « Red-eye effect » et d'autres) : ils ne comptent pas comme vérification.

### Non relues

- Cambridge in Colour (7 entrées citées par EXP-13, EXP-14, BOI-28, MVT-12, OPT-14, RET-14), B&H (`bh-sunstars`), PetaPixel, Hugin, NOAA, Adorama, Fujifilm, arXiv, Stanford, EASA, les pages d'assistance de Canon hors `cam.start.canon` (`vn.canon`, `sg.canon`, `id.canon`, `global.canon`, `ij.manual.canon`) : sources non relues, hôtes non joignables d'ici.
- DPReview et Photography Life (`dpreview-iso-invariance`, `pl-iso-invariance`, `pl-lens-compression`) : non relues ici ; les rapports précédents notent que ces hôtes répondent 403 aux lectures automatiques.

## Constats

Classés par gravité, dans l'ordre des rapports précédents : « non sourcé », puis « incohérent », puis « à améliorer » ; aucun constat « faux ». Les identifiants suivent l'ordre d'écriture, pas l'ordre de gravité.

### REF-07 · non sourcé · 125 notions sur 191 n'ont pas de source, dont 109 sans `todo` ; 20 d'entre elles affirment un fait qu'une page lue ici appuie

- Endroit : les 13 fichiers de `data/referentiel/`.
- Preuve (script `bilan.py`) : 125 notions n'ont pas de champ `sources` ; 16 d'entre elles ont un `todo` qui le dit (15 fois « Sourcer les affirmations à la rédaction de la fiche (audit A du 7 novembre 2026) », et celui d'OPT-12) ; restent 109 notions sans source ni `todo`, dont 55 de niveau N1 : BOI 19, CMP 14, RET 13, LUM 10, OPT 10, MAP 9, EXP 7, MES 7, MVT 6, COU 4, LEC 4, NET 3, PLA 3.
- Règle : `CLAUDE.md`, « Toute affirmation factuelle est sourcée » et « On n'implémente que ce qui est sourcé ».
- Ce qui est juste : beaucoup de ces textes sont un programme et non une affirmation (CMP-03, « Guider le regard » ; RET-06, « Doser l'accentuation et la réduction du bruit »). La règle de l'audit A, sourcer à la rédaction de la fiche, tient pour elles. Mais 20 notions sans source (15 sans `todo`, 5 avec) affirment un fait précis, et une page lue pour cet audit l'appuie :

  | Notion | Ce que le référentiel affirme | Source lue le 14 novembre 2026 |
  | --- | --- | --- |
  | BOI-02 | « À mi-course, mise au point et mesure » | Nikon Z 6, « Taking Photographs » : « To focus, press the shutter-release button halfway or press the AF-ON button » (la page ne dit rien de la mesure) |
  | BOI-06 | « P choisit un couple, la molette le décale à exposition égale » | Nikon Z 6, « The Mode Dial » : « Different combinations of shutter speed and aperture that produce the same exposure can be selected by rotating the main command dial (“flexible program”). » |
  | BOI-11 | « Enregistrer une configuration par situation » | Nikon Z 6, « The Mode Dial » : « U1, U2, U3 User settings modes: Assign frequently-used settings to these positions for quick recall. » |
  | BOI-14 (`todo`) | « Silence, déformation des sujets rapides, bandes sous LED, compatibilité flash » | Nikon Z 6, « Silent Photography » : « disables some features, including the flash » ; « flicker, banding, or distortion may be visible in the display and in the final picture under fluorescent, mercury vapor, or sodium lamps or if the camera or subject moves during shooting ». La page ne parle pas des LED. |
  | BOI-19 (`todo`) | « La seconde pose qui allonge l'attente » | Nikon Z 6, « Long Exposure NR » : « The time required for processing roughly doubles » ; Canon EOS R5 : « noise reduction after you shoot may take as long as exposure for the shot » ; Sony ILCE-7M3 : « noise reduction is turned on for the duration that the shutter is open ». Aucun des trois ne parle d'une « seconde pose ». |
  | EXP-11 | « sunny 16 » | Wikipedia, « Sunny 16 rule », révision 1382475636 : « On a sunny day set aperture to f/16 and shutter speed to the [reciprocal of the] ISO film speed [or ISO setting] for a subject in direct sunlight. » |
  | EXP-12 | « Capter le plus de lumière possible en RAW sans écrêter » | Wikipedia, « Exposing to the right », révision 1359410976 : « adjusting the exposure of an image as high as possible at base ISO (without causing unwanted saturation) to collect the maximum amount of light » |
  | LUM-09 | « chute de la lumière avec la distance » | Wikipedia, « Inverse-square law », révision 1384166303 : « In photography and stage lighting, the inverse-square law is used to determine the “fall off” […] in illumination on a subject as it moves closer to or further from the light source. » |
  | LUM-11 (`todo`) | « Bande noire au-delà de la vitesse de synchro avec un obturateur à rideaux ; pas de bande avec un obturateur central » | Wikipedia, « Shutter (photography) », révision 1383569461 : « When using a focal-plane shutter with a flash, if the shutter is set at its X-sync speed or slower the whole frame will be exposed when the flash fires (otherwise only a band of the film will be exposed). » ; pour l'obturateur central : « Flash synchronization is possible at all speeds because the shutter opens fully ». |
  | LUM-12 (`todo`) | « traînées derrière ou devant le sujet » | Nikon Z 6, « Flash Modes » : « Rear-curtain sync: The flash fires just before the shutter closes, creating the effect of a stream of light behind moving light sources. » |
  | MAP-02 | « loupe, surlignage de netteté » | Nikon Z 6, « d10: Peaking Highlights » : « When focus peaking is enabled in manual focus mode, objects that are in focus are indicated by colored outlines in the display. » |
  | MAP-08 | « Verrouiller la distance à mi-course […], puis recadrer » | Canon EOS R5, « AF Operation » : « The focus remains locked while you hold down the shutter button halfway, allowing you to recompose the image before taking the picture. » |
  | MAP-10 | « sensibilité du suivi, obstacles » | Nikon Z 6, « a3: Focus Tracking with Lock-On » : « Choose how quickly focus responds when something passes between the subject and the camera in focus mode AF-C. » |
  | MAP-11 | « Séparer la mise au point du déclenchement » | Nikon Z 6, « a7: AF Activation » : « focus can only be adjusted using the AF-ON button or other controls to which AF-ON has been assigned (AF-ON only) » |
  | MAP-12 | « Déclencher même flou, ou attendre la netteté » | Nikon Z 6, « Focus » : AF-S, « the shutter can only be released if the camera is able to focus (focus priority) » ; AF-C, « the shutter can be released whether or not the subject is in focus (release priority) » |
  | MES-01 | « La cellule mesure la lumière renvoyée et ramène la zone mesurée vers un gris moyen » | Wikipedia, « Light meter », révision 1382667037 : « All in-camera meters are reflected-light meters. » ; « Exposure compensation », révision 1382677993 : « The meter indication would place whatever was metered on Zone V (5), a medium gray. » |
  | MES-05 | « Mesurer sur une zone, recadrer, garder l'exposition » | Canon EOS R5, « Exposure Lock (AE Lock) » : « Press the button to lock the exposure, then recompose and take the picture. This is called AE lock. It is effective for shooting backlit subjects » |
  | MES-09 | « Lire l'échelle d'exposition du viseur en M » | Nikon Z 6, « The Mode Dial » : « The exposure indicators show whether the photograph would be under- or over-exposed at current settings. » |
  | MES-11 | « Mesurer la lumière reçue par le sujet plutôt que celle qu'il renvoie » | Wikipedia, « Light meter », révision 1382667037 : « incident-light meters which measure the amount of light falling on the subject » |
  | NET-03 (`todo`) | « Faire le point pour étendre la netteté jusqu'à l'infini » | Wikipedia, « Hyperfocal distance », révision 1382493010 : « the hyperfocal distance is the focus distance giving the maximum depth of field » |

- Correction proposée : ajouter ces pages à `data/sources.yaml` et aux 20 notions (les pages de Nikon, de Canon et de Sony sont primaires ; Wikipedia reste secondaire, à doubler à la rédaction). Pour les 94 autres notions sans source ni `todo`, un `todo` commun, comme l'audit A l'a fait pour 15 notions, pour que l'absence de source se lise dans `data/` : « Sourcer à la rédaction de la fiche ». Corriger BOI-19 : « Un traitement après la pose, qui dure à peu près autant qu'elle ».

### REF-01 · incohérent · Deux situations de flash sont notées « pas de flash »

- Endroit : `data/situations.yaml`, l. 5 (règle), l. 351-358 (SIT-V2-01) et l. 383-390 (SIT-V2-05).
- Ce qui est écrit : la règle, « required : la situation dépend du flash ; optional : elle l'utilise en option. Absent : pas de flash. » SIT-V2-01 a pour titre « Portrait studio avec un flash déporté » et SIT-V2-05 « Flash indirect en intérieur », avec l'intention « Lumière douce au flash » ; aucune des deux n'a de champ `flash`.
- Preuve : lecture du fichier. Par comparaison, SIT-25 « Soirée en intérieur au flash » (l. 209), SIT-02 et SIT-34 portent `flash: required`. Un script qui liste les situations sans champ `flash` dont le titre, l'intention ou une notion clé porte le mot « flash » donne SIT-V2-01, SIT-V2-04 (notion clé LUM-15, « Flash déporté et studio ») et SIT-V2-05 ; il donne aussi SIT-18 et SIT-V2-07, qui disent « sans flash » et sont justes.
- Conséquence : d'après la règle du fichier lui-même, ces situations « n'ont pas de flash ». Tout tri par ce champ (situations faisables sans flash) les rangera du mauvais côté.
- Correction proposée : `flash: required` pour SIT-V2-01 et SIT-V2-05. Pour SIT-V2-04 (« Nature morte à deux lumières »), Julien tranche : `optional` si les deux lumières peuvent être des lampes, `required` sinon.

### REF-02 · incohérent · MES-07 : le référentiel dit « repérer en direct les zones brûlées » ; les manuels, et la fiche de la notion, disent « à la lecture » pour deux des trois boîtiers

- Endroit : `data/referentiel/mes.yaml`, l. 65-73 (MES-07, niveau N1) ; `content/fr/notions/MES-07.md`, l. 5-11.
- Ce qui est écrit dans le référentiel : titre « Alertes de surexposition et zébras » ; explication « Repérer en direct les zones brûlées » ; simulateur « Clignotement et zébras réglables ».
- Preuve (sources lues) :
  - Nikon Z 7/Z 6 : l'affichage des hautes lumières pendant la visée est un réglage du groupe vidéo, « g6: Highlight Display », « Choose the brightness needed to trigger the movie highlight display » (`https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_g06.html`). En photo, les hautes lumières se voient à la lecture : « Highlights (areas that may be overexposed) » (`…/en/08_more_about_playback_02.html`).
  - Canon EOS R5 : « Zebra Settings. To help you adjust exposure before or during movie recording, you can display a striped pattern over or around image areas of a specified brightness. » (`https://cam.start.canon/en/C003/manual/html/UG-03_Shooting-2_0140.html`) ; en photo : « You can specify blinking display of overexposed highlights on the playback screen. » (`…/UG-05_Playback_0300.html`).
  - Sony ILCE-7M3 : « Zebra Setting. Sets a zebra pattern, which appears over part of an image if the brightness level of that part meets the IRE level that you have set. » (guide d'aide, menu « Camera Settings2 ») ; le guide ne limite pas ce réglage à la vidéo.
- Preuve (dépôt) : la fiche de MES-07, écrite à la version 0.3.57, dit déjà la même chose que les manuels (« À la lecture. Le Nikon Z 6 a une page d'information « Hautes lumières » », « Le manuel du Z 6 ne décrit un tel affichage que pour la vidéo »). Le texte du référentiel n'a pas suivi.
- Correction proposée : explication « Repérer les zones brûlées : à la lecture, sur l'écran de revue ; pendant la visée, par les zébras, que certains boîtiers réservent à la vidéo » ; simulateur « Alerte à la lecture ; zébras en visée, selon le profil d'appareil ».

### REF-04 · incohérent · CMP-02, MES-06 et MES-07 ont une fiche sourcée, et aucune source dans le référentiel

- Endroit : `data/referentiel/cmp.yaml`, l. 16-24 (CMP-02) ; `data/referentiel/mes.yaml`, l. 56-73 (MES-06, MES-07) ; `boi.yaml`, l. 118 (BOI-12) ; `mes.yaml`, l. 101 (MES-10).
- Preuve (script : adresses citées par chacune des 19 fiches françaises, rapportées aux identifiants de `data/sources.yaml`, puis comparées au champ `sources` de la notion) :

  | Notion | Sources de la fiche | Champ `sources` de la notion | Dans la fiche, absentes de la notion |
  | --- | --- | --- | --- |
  | CMP-02 | 10 | aucun | `nikon-z6-d9`, `nikon-z6-d9-fr`, `nikon-z6-defaults`, `sony-a7iii-grid-line`, `sony-a7iii-grid-line-fr`, `sony-a6000-grid-line`, `canon-850d-grid-display`, `canon-r6-shooting-info-display`, `nikon-d5600-digitutor-framing-grid`, `wikipedia-rule-of-thirds` |
  | MES-06 | 6 | aucun | `nikon-z6-photo-information`, `nikon-z6-photo-information-fr`, `sony-a7iii-icons`, `sony-a7iii-switching-display`, `sony-a7iii-switching-display-fr`, `wikipedia-srgb` |
  | MES-07 | 8 | aucun | `nikon-z6-g6`, `nikon-z6-g6-fr`, `nikon-z6-photo-information`, `nikon-z6-photo-information-fr`, `sony-a7iii-switching-display`, `sony-a7iii-switching-display-fr`, `sony-a7iii-zebra`, `sony-a7iii-zebra-fr` |
  | BOI-12 | 3 | 2 | `nikon-z6-defaults` |
  | MES-10 | 5 | 5 | `nikon-z6-exposure-compensation`, `nikon-z6-mode-dial` |

  Le même script retrouve les trois écarts déjà écrits au constat FMA-15 du rapport `fiches-mise-au-point.md` (NET-01, LUM-02, MAP-04). Pour les 11 autres fiches, toutes les sources de la fiche sont dans la notion.
- Conséquence : CMP-02 est la seule des 17 notions du jalon de la V1 minimale sans source dans le référentiel, alors que sa fiche en cite dix. Qui lit `data/` seul, « source de vérité » d'après `CLAUDE.md`, croit ces trois notions non sourcées.
- Correction proposée : ajouter ces identifiants aux cinq notions (avec ceux de FMA-15), et écrire dans `docs/lire-le-referentiel.md` que le champ `sources` contient au moins les sources de la fiche. Un contrôle de `scripts/validate.py` peut le tenir (question pour le rapport `referentiel-structure.md`).

### REF-05 · incohérent · BOI-09 : l'explication dit « lumière stable », l'exercice demande une « lumière changeante »

- Endroit : `data/referentiel/boi.yaml`, l. 82-90 (BOI-09, « Mode manuel », N1).
- Ce qui est écrit : explication, « Tout fixer soi-même : lumière stable, panorama, nuit » ; exercice, « Série d'un concert à lumière changeante ».
- Preuve : les deux phrases, à deux lignes d'écart (l. 86 et 88). L'explication donne trois cas d'usage ; l'exercice en prend un quatrième, qui est le contraire du premier. Aucune source n'est citée pour l'un ni pour l'autre. Le manuel du Z 6 dit seulement : « M Manual: You control both shutter speed and aperture. Set shutter speed to “bulb” or “time” for long time-exposures. » (`…/z7_z6/en/06_shooting_controls_01.html`).
- Je ne sais pas si le mode manuel est conseillé pour un concert : aucune source lue ne le dit.
- Correction proposée : un exercice tiré de l'explication, par exemple « Garder la même exposition sur les cinq vues d'un panorama » (BOI-09 est notion clé de SIT-30, « Panorama ») ; ou bien ajouter le concert à l'explication, avec une source.

### REF-06 · incohérent · RET-12, notion de niveau N1, demande ce que COU-06 classe au niveau N3

- Endroit : `data/referentiel/ret.yaml`, l. 107-115 (RET-12, « Exporter », N1) ; `data/referentiel/cou.yaml`, l. 58-69 (COU-06, « Espaces couleur et écrans », N3).
- Ce qui est écrit : RET-12, explication : « Format, taille, accentuation de sortie, espace couleur ; épreuvage à l'écran avec le profil du papier avant un tirage » ; exercice : « Préparer une photo pour un réseau social et pour un tirage ». COU-06, explication : « sRGB, Adobe RGB, Display P3 ; pourquoi les couleurs changent d'un écran à l'autre, calibrage de l'écran » ; exercice : « Choisir l'espace pour le web et pour un tirage ».
- Preuve : les deux exercices demandent le même choix (un espace couleur pour le web, un pour le tirage), l'un au niveau débutant, l'autre au niveau avancé. L'épreuvage avec le profil du papier suppose de savoir ce qu'est un profil, que seule COU-06 explique. Aucune des deux notions n'a de source (COU-06 a un `todo`).
- Critère : `docs/cadrage.md`, « Le public est débutant. Le but est la compréhension et la maîtrise du boîtier et des bases, pas le niveau professionnel. »
- Correction proposée : RET-12 garde au niveau N1 « Format, taille et qualité du fichier ; sRGB pour le web » ; « accentuation de sortie » et « épreuvage à l'écran avec le profil du papier » passent dans COU-06 (N3). L'exercice de RET-12 devient « Préparer une photo pour un réseau social et pour un envoi à un proche ».

### REF-08 · à améliorer · Intitulés : quatre termes ne sont ceux d'aucun des trois manuels français lus, et le référentiel n'a pas de champ pour les termes de chaque marque

- Endroit : `data/referentiel/map.yaml`, l. 23 (MAP-02), l. 118 (MAP-12), l. 156 (MAP-17) ; `mes.yaml`, l. 20 (MES-02) ; `boi.yaml`, l. 111 (BOI-12), l. 254-263 (BOI-27), l. 316-319 (BOI-33).
- Méthode : le nombre d'occurrences de chaque terme est compté dans les pages françaises lues du manuel du Z 7/Z 6, du manuel de l'EOS R5 et du guide de l'ILCE-7M3 (tableau complet dans la section « Intitulés et termes des manuels », plus bas).
- Preuve :
  1. MAP-02, explication : « surlignage de netteté ». Aucune occurrence de « surlignage » dans les trois manuels. Nikon : « d10 : Mise en relief », « la mise en relief de la mise au point » ; Canon : « Paramètres de repères MF (Accentuation du contour) » ; Sony : « Régl. intensification », « la fonction d'intensification, laquelle améliore le contour des zones nettes ».
  2. MAP-17, titre : « Réglage fin de l'AF ». Aucune occurrence de « réglage fin ». Nikon : « Réglage précis de l'AF » ; Sony : « Microréglage AF » ; les pages lues de l'EOS R5 n'ont pas ce réglage. L'intitulé anglais de la notion, « AF fine-tune », est bien celui de Nikon (« AF Fine-Tune ») : le français en est une traduction mot à mot, pas le terme du menu français.
  3. MAP-12, titre : « Priorité au déclenchement ou à la netteté ». Nikon : « priorité au déclenchement », « priorité à la mise au point » (a1, a2) ; Sony : « Régl. prior. ds AF-S », options « AF » et « Déclenchement » ; Canon : « Priorité décl. AF One-Shot », « priorité à la mise au point ». « Netteté » n'est le mot d'aucun.
  4. MES-02, explication : « Multizone ». Aucune occurrence. Nikon : « Mesure matricielle » ; Canon : « Mesure évaluative » ; Sony : « Multi ». Le mot traduit le terme générique anglais (Wikipedia, « Metering mode », révision 1382663556 : « spot, center-weighted average, or multi-zone metering modes ») : il est juste, mais un débutant ne le trouvera dans aucun de ces trois menus.
  5. BOI-33, titre « Exposition multiple », dont l'explication cite Nikon (« chez Nikon, de 2 à 10 vues ») : le menu français de Nikon dit « Surimpression » (65 occurrences, aucune d'« exposition multiple ») ; Canon dit « Expositions multiples ».
  6. BOI-12, titre « Modes d'entraînement » : terme de Sony seul (« mode d'entraînement », « Entraînement ») ; Nikon dit « Mode de déclenchement », Canon « Mode d'acquisition ». Déjà écrit au constat FEX-15 du rapport `fiches-exposition.md` pour la fiche ; le titre vient du référentiel.
- Ce qui est juste : le référentiel vaut pour plusieurs marques, et un intitulé générique est légitime. Sur les 34 intitulés comparés, 31 sont le terme d'au moins une des trois marques, ou en sont proches (« Vitesse d'obturation », « Correction d'exposition » et « Balance des blancs » sont ceux des trois) ; trois ne le sont pas : MAP-12, MAP-17 et MAP-16 (constat REF-03).
- Ce qui manque : BOI-27, « Le vocabulaire de sa marque », promet une « Bascule de vocabulaire dans tout l'outil » (l. 259), et aucun champ du référentiel ne porte les termes de chaque marque. Les rapports sur les fiches (FEX-15, FMA-14) proposent d'écrire ces termes fiche par fiche, à la main.
- Correction proposée :
  - tout de suite : MAP-02, « mise en relief de la mise au point (focus peaking) » ; MAP-17, « Réglage précis de l'AF » ; MAP-12, « Priorité au déclenchement ou à la mise au point » ; MES-02, « Multizone (« matricielle » chez Nikon, « évaluative » chez Canon, « Multi » chez Sony), pondérée centrale, spot » ; BOI-33, explication « (« Surimpression » chez Nikon) » ;
  - à trancher par Julien : un champ `terms` par notion (`nikon`, `canon`, `sony`, en français et en anglais, chacun avec sa source), rempli d'abord pour les 17 notions de la V1 minimale à partir du tableau plus bas et des tableaux de FEX-15 et de FMA-14 ; les fiches et l'interface y liraient les termes au lieu de les recopier. La forme du champ relève du rapport `referentiel-structure.md`.

### REF-03 · à améliorer · MAP-16 : « Mise au point par zone » se confond avec les « zones » de l'autofocus des trois marques

- Endroit : `data/referentiel/map.yaml`, l. 146-154 (MAP-16) ; l. 49-58 (MAP-05, « Modes de zone AF »).
- Ce qui est écrit : MAP-16, « Mise au point par zone » (« zone focusing ») : « Prérégler distance et ouverture pour une plage nette sans AF ». MAP-05, « Modes de zone AF » : « Point unique, zone, large, suivi ».
- Preuve (manuels français lus) : « zone » y désigne partout une partie du cadre où l'autofocus travaille. Nikon : « Mode de zone AF » (54 occurrences dans les pages lues), « AF zone large », « AF zone automatique ». Sony : « Zone mise au point » (81 occurrences), dont un réglage nommé « Zone ». Canon : « Zone AF » (méthode autofocus). Aucun des trois manuels n'emploie « mise au point par zone » ni « zone focusing » pour un préréglage de distance.
- Conséquence : un débutant qui lit « Mise au point par zone » ira chercher le réglage « Zone » de son autofocus, alors que la notion demande de couper l'autofocus.
- Correction proposée : intituler MAP-16 « Mise au point préréglée » (anglais : « zone focusing, preset focus »), sans changer l'identifiant.

### REF-09 · à améliorer · Le trépied (MVT-12) ne renvoie qu'à deux situations ; quatre autres en demandent un

- Endroit : `data/referentiel/mvt.yaml`, l. 116-125 (MVT-12, `situations: [SIT-12, SIT-20]`) ; `data/situations.yaml`, SIT-17 (l. 137), SIT-21 (l. 170), SIT-33 (l. 268), SIT-35 (l. 285).
- Ce qui est écrit : MVT-12, « Quand le trépied s'impose, comment le rendre stable […], et les appuis de fortune » ; exercice « Réussir une pose de 2 s sans flou, avec puis sans trépied ».
- Preuve (dépôt) : SIT-21 (« Feux d'artifice ») et SIT-33 (« Orage et éclairs ») ont pour notion clé BOI-10, les poses B et T ; SIT-17 a MVT-08, les traînées lumineuses ; SIT-35 a pour lieu « Ville, nuit, sans trépied », ce qui est l'exercice même de MVT-12. Aucune de ces quatre situations n'est dans les renvois de MVT-12. Le mot « trépied » n'apparaît ailleurs que dans MVT-07 (« Filtres ND, calcul du temps de pose, trépied », notion clé de SIT-12 et de SIT-24) et dans BOI-15 (« cas du trépied ») ; BOI-10, notion clé de SIT-21 et de SIT-33, ne cite que la télécommande.
- Preuve (sources lues) : Nikon Z 6, « Long Time-Exposures (Mode M) » : « Select the following shutter speeds for long time-exposures of moving lights, the stars, night scenery, or fireworks. […] To prevent blur, mount the camera on a tripod or use an optional wireless remote controller, remote cord, or other remote release device. » (`…/z7_z6/en/06_shooting_controls_01.html`). Sony ILCE-7M3 (guide français) : « Les images prises en mode [BULB] ont tendance à être floues. Nous vous recommandons d'utiliser un trépied ».
- Autre renvoi manquant, trouvé par la même lecture : SIT-03 a pour titre « Portrait en contre-jour à l'heure dorée », et LUM-04 (« Heure dorée, heure bleue », l. 40-51 de `lum.yaml`) ne renvoie qu'à SIT-10 et SIT-17.
- Correction proposée : ajouter SIT-17, SIT-21, SIT-33 et SIT-35 aux renvois de MVT-12, et SIT-03 à ceux de LUM-04 ; faire de MVT-12 une notion clé de SIT-21 et de SIT-33, où la pose B ne se fait pas sans support (niveaux recalculés par script : SIT-21 reste N1 à N2, SIT-33 reste N2). Ajouter la page de Nikon aux sources de MVT-12.

### REF-10 · à améliorer · SIT-42, « Sous l'eau, près de la surface » : aucune notion ne dit qu'un reflex ou un hybride n'est pas étanche

- Endroit : `data/situations.yaml`, l. 342-350 (SIT-42) ; `data/referentiel/cou.yaml`, l. 88-99 (COU-09) ; `lum.yaml`, l. 177-186 (LUM-18) ; `pla.yaml`, l. 81-89 (PLA-08).
- Ce qui est écrit : SIT-42, « Mer ou piscine, en apnée, de jour », notions clés COU-09, LUM-18 et COU-02. PLA-08, « Préparer son sac » : « protection contre la pluie et le froid », sans renvoi à SIT-42.
- Preuve (dépôt) : les mots « caisson », « étanche » et « housing » sont absents de `data/` (recherche sur tout le dossier).
- Preuve (sources lues) : Nikon Z 7/Z 6, « Caring for the Camera and Battery: Cautions » : « This product is not waterproof, and may malfunction if immersed in water or exposed to high levels of humidity. » ; en français : « ce produit n'étant pas étanche, il peut présenter des dysfonctionnements s'il est immergé dans l'eau » (`…/z7_z6/en/14_technical_notes_05.html`, `…/fr/…`). Wikipedia (source secondaire), « Underwater photography », révision 1381585685 : « Cameras made for dry work can also work underwater, protected by add-on housings […] Most such housings are specific to the camera model. »
- Conséquence : le public du projet a un reflex ou un hybride (`docs/cadrage.md`). La première chose à savoir pour cette situation, et la seule qui casse l'appareil, n'est écrite nulle part.
- Correction proposée : PLA-08, explication « Matériel selon la situation, protection contre la pluie et le froid, caisson étanche sous l'eau », avec un renvoi à SIT-42 ; SIT-42, `where_when` : « Mer ou piscine, en apnée, de jour, boîtier dans un caisson étanche » ; PLA-08 en notion clé de SIT-42 (niveaux inchangés : N2 à N3). Sources à ajouter : les deux pages.

### REF-11 · à améliorer · SIT-16, « Architecture et verticales » : la seule notion clé qui redresse les verticales demande un objectif spécial, de niveau N3

- Endroit : `data/situations.yaml`, l. 129-136 (SIT-16, niveau N2 à N3, intention « Des verticales droites », notions clés OPT-07, OPT-13, CMP-02, PLA-02).
- Preuve (dépôt) : des quatre notions clés, une seule donne des verticales droites, OPT-13 (« Bascule et décentrement », N3 : « Redresser les verticales »). OPT-07 (« Distorsions ») sert à dire d'où vient le défaut, CMP-02 place le sujet, PLA-02 donne l'heure. Deux notions qui renvoient à SIT-16 sans être clés donnent le résultat sans objectif spécial : RET-05 (N1, « Recadrer et redresser », exercice « Redresser et recadrer une photo d'architecture ») et BOI-04 (N1, « Grille, niveau électronique »).
- Preuve (source lue, secondaire) : Wikipedia, « Perspective distortion », révision 1381419682 : « buildings appear to be falling backwards much more severely when the camera is pointed upward from ground level ». La page lie le défaut à l'inclinaison de l'appareil ; elle ne dit pas comment l'éviter. Le référentiel, lui, a deux notions de niveau N1 qui s'y rapportent : tenir l'appareil de niveau (BOI-04) et redresser après coup (RET-05).
- Correction proposée : ajouter RET-05 et BOI-04 aux notions clés de SIT-16. Niveaux recalculés par script avec les six notions : N2 à N3, inchangés.

### REF-12 · à améliorer · SIT-28, « Autoportrait au retardateur » : « Anatomie du boîtier » en notion clé, et la notion dont l'exercice est un autoportrait n'y est pas

- Endroit : `data/situations.yaml`, l. 227-234 (SIT-28, notions clés BOI-12, MAP-08, BOI-01) ; `data/referentiel/boi.yaml`, l. 7-15 (BOI-01) et l. 335-344 (BOI-35).
- Preuve (dépôt) : BOI-01 (« Molettes, déclencheur, viseur, écran, touches : ce que chacun commande », exercice « « Trouve le réglage » chronométré ») n'a rien de propre à l'autoportrait, et SIT-28 est sa seule situation ; la règle des notions clés demande des « notions propres à la situation ». BOI-35 (« Connexion au smartphone ») a pour exercice « Faire un autoportrait déclenché depuis le téléphone » et renvoie à SIT-28 sans en être une notion clé.
- Ce qui est juste : MAP-08 (mémorisation de la mise au point) est bien propre à la situation. Canon EOS R5, « Using the Self-Timer » : « When using the self-timer to shoot yourself, use focus lock on an object at the same distance as where you will stand. » (`https://cam.start.canon/en/C003/manual/html/UG-04_AF-Drive_0130.html`).
- Correction proposée : dans SIT-28, remplacer BOI-01 par BOI-35 (niveaux recalculés : N1 à N1, inchangés) ; donner à BOI-01 `situations: all`, comme BOI-25 et BOI-27 ; ajouter la page de Canon aux sources de MAP-08.

### REF-13 · à améliorer · Huit groupes de notions se recouvrent, sans phrase qui dise ce qui va où

- Endroit : voir le tableau.
- Preuve (textes du référentiel, cités) :

  | Notions | Ce qui se recouvre |
  | --- | --- |
  | MES-01 (N1) et MES-03 (N1), `mes.yaml`, l. 7-15 et 26-34 | MES-01 : « une scène très claire ou très sombre la trompe encore », exercice « Prédire si l'appareil va sous-exposer ou surexposer ». MES-03 : « Neige, fond noir, contre-jour, nuit : pourquoi la cellule se trompe ». Même idée, mêmes situations (SIT-13, SIT-31). |
  | OPT-01 (N1) et OPT-06 (N2), `opt.yaml`, l. 8-17 et 56-65 | OPT-01 : « Depuis un même point, la focale change le cadrage et la profondeur de champ, pas la perspective », simulateur « Zoom depuis un point fixe ». OPT-06 : « La perspective dépend de la position, pas de la focale », simulateur « Zoomer depuis un même point ne change pas la perspective ». |
  | OPT-02 (N1) et OPT-03 (N3), `opt.yaml`, l. 18-37 | OPT-02 : « Focale équivalente, champ, bruit et profondeur selon le format », exercice « Même cadrage sur deux formats ». OPT-03 : « Même image sur deux formats : focale, ouverture et ISO équivalents », exercice « Reproduire sur APS-C une photo plein format ». |
  | NET-08 (N3), MAP-18 (N3) et RET-10 (N3), `net.yaml`, l. 79-87 ; `map.yaml`, l. 165-173 ; `ret.yaml`, l. 88-97 | NET-08 : « Fusionner plusieurs mises au point », simulateur « Série et fusion dans l'outil ». MAP-18 : « Série de mises au point destinée à l'empilement ». RET-10 : « HDR, panorama, stacking », « Fusion dans l'outil des séries simulées ». NET-08 et MAP-18 ont les mêmes situations (SIT-11, SIT-22) et sont toutes deux notions clés de SIT-11. |
  | MAP-06 (N1) et MAP-19 (N1), `map.yaml`, l. 59-68 et 174-183 | MAP-06 : « Choisir soi-même le collimateur, le déplacer vite ». MAP-19 : « Les commandes qui déplacent le collimateur sans quitter le viseur ». |
  | MAP-02 (N1) et MAP-15 (N2), `map.yaml`, l. 19-27 et 136-145 | MAP-02, exercice : « Faire le point à la loupe sur une étoile ». MAP-15, simulateur : « Ciel étoilé où l'infini se règle à la loupe ». |
  | BOI-04 (N1) avec CMP-02, CMP-04 et MES-06, `boi.yaml`, l. 35-43 | BOI-04 : « Grille, niveau électronique, histogramme en direct », exercice « Redresser un horizon au niveau électronique ». CMP-02, simulateur : « Grilles superposables ». CMP-04 : « horizon droit », simulateur « Rotation du cadre et niveau ». MES-06, simulateur : « Histogramme en direct et après la prise ». |
  | COU-08 (N2) et RET-09 (N2), `cou.yaml`, l. 79-87 ; `ret.yaml`, l. 79-87 | COU-08, simulateur : « Conversion avec filtres virtuels ». RET-09 : « Noir et blanc au développement », « Mélangeur de couches », exercice « Trois conversions d'une même photo ». |

- Ce qui est juste : une notion se retrouve souvent sous deux angles (le boîtier et l'usage), et le référentiel le dit ailleurs par des notes : LUM-04 renvoie à PLA-01 pour le calcul des horaires, CMP-05 à CMP-07, BOI-21 à BOI-36.
- Conséquence : la version 0.3.56 a livré les grilles au titre de CMP-02, alors qu'elles sont aussi la première brique de BOI-04 ; rien ne dit laquelle des deux notions est couverte. Le même cas reviendra pour l'histogramme en direct (BOI-04 ou MES-06), annoncé dans `docs/etat-des-travaux.md`.
- Correction proposée : pour chaque groupe, une `note` d'une ligne dans les deux notions, sur le modèle de celle de LUM-04 (« le calcul des horaires relève de PLA-01 »). Fusions à trancher par Julien, par `data/referentiel/retired.yaml` : MES-03 dans MES-01 ; MAP-18 dans NET-08, RET-10 gardant le HDR et le panorama. Remplacer l'exercice de MAP-02 par un exercice de jour (« Faire le point à la loupe sur un sujet derrière un grillage »).

### REF-14 · à améliorer · MES-10 (ISO auto) est classée N2, alors qu'elle est dans le jalon des débutants et activée d'origine sur le boîtier de référence

- Endroit : `data/referentiel/mes.yaml`, l. 93-102 (MES-10, N2) ; `data/jalons.yaml`, l. 23 ; `data/situations.yaml`, l. 49-56 (SIT-06, N1 à N2).
- Preuve (sources lues) : Nikon Z 7/Z 6, « Defaults », menu Prise de vue photo : « Auto ISO sensitivity control », « On » (`…/z7_z6/en/09_menu_guide_01.html`). Un débutant qui sort son Z 6 de la boîte photographie en ISO auto.
- Preuve (dépôt) : MES-10 est une des 17 notions du jalon `v1-min`, dont le but est d'être « testée avec quelques débutants » ; le constat FEX-02 du rapport `fiches-exposition.md` relève que l'ISO auto est activé au départ dans le simulateur. SIT-06 doit son niveau maximal N2 à MES-10 seule : ses quatre autres notions clés sont N1 (script).
- Ce qui est juste : l'explication de MES-10 (« Plafond d'ISO, vitesse minimale, ISO auto en M avec correction ») décrit des réglages de menu, qui peuvent rester N2.
- Correction proposée, à trancher par Julien : classer MES-10 N1, avec une explication en deux temps (« L'appareil choisit l'ISO quand l'exposition ne peut pas être obtenue autrement ; puis : plafond, vitesse minimale, ISO auto en M ») ; SIT-06 devient alors N1 à N1. Le manuel dit : « the camera will automatically adjust ISO sensitivity when optimal exposure cannot be achieved at the value selected for ISO sensitivity » (`…/en/09_menu_guide_03_08.html`).

### REF-15 · à améliorer · OPT-12 : « vers 53 à 56° » ne dit pas depuis quoi l'angle se mesure ; et la source demandée par le `todo` existe

- Endroit : `data/referentiel/opt.yaml`, l. 111-123 (OPT-12, « Filtres »).
- Ce qui est écrit : « le polarisant […] coupe les reflets selon l'angle de vue sur la surface (au plus vers 53 à 56°, sans effet de face) » ; `todo` : « Ajouter une source pour la polarisation du ciel, maximale à 90° du soleil. »
- Preuve (calcul) : arctan(1,5) = 56,31° et arctan(1,33) = 53,06° ; la note de calcul est juste. L'angle de Brewster se compte depuis la perpendiculaire à la surface : depuis la surface elle-même, c'est 90 − 56,3 = 33,7° pour le verre et 90 − 53,1 = 36,9° pour l'eau.
- Preuve (sources lues, secondaires) : Wikipedia, « Polarizing filter (photography) », révision 1382680188 : « this effect is maximum at Brewster's angle, about 56° from the vertical for common glass » et « In practice, reflections from non-metallic surfaces are strongly polarized when they leave the surface at an angle of about 30 to 40°. » Pour le ciel : « a picture taken in a direction at 90 degrees from the sun can take advantage of this polarization » (la page cite Canon Academy, « Polarising filters in practice », non lue : hôte non joignable).
- Conséquence : « angle de vue sur la surface, au plus vers 53 à 56° » se lit comme un angle au-dessus de la surface ; c'est alors faux d'une vingtaine de degrés (22,6° pour le verre, 16,2° pour l'eau).
- Correction proposée : « coupe les reflets d'une vitre ou de l'eau, au plus quand on les regarde à environ 35° au-dessus de la surface (53 à 56° depuis la perpendiculaire), sans effet de face » ; ajouter la révision de Wikipedia aux sources et réduire le `todo` à « doubler par une source primaire ».

### REF-16 · à améliorer · Les sept situations `SIT-V2-NN` sont l'exercice d'une notion plus qu'une situation, et quatre doublent une situation du catalogue

- Endroit : `data/situations.yaml`, l. 351-406.
- Critère : `docs/cadrage.md`, « Les situations sont le cœur de la V1 : on part de « où, quand, quoi, pourquoi » pour arriver aux réglages. »
- Preuve (script et lecture) : trois de ces situations n'ont qu'une notion clé (SIT-V2-03, SIT-V2-06, SIT-V2-07), trois en ont deux, une en a trois ; les 42 autres situations en ont de 3 à 10. Leur champ `where_when` ne situe rien : « Partout », « Extérieur », « Intérieur », « Studio ». Recouvrements :
  - SIT-V2-05, « Flash indirect en intérieur », et SIT-25, « Soirée en intérieur au flash » : LUM-14 (flash indirect) renvoie aux deux ;
  - SIT-V2-07, « Réflecteur en extérieur » (intention « Déboucher sans flash »), et SIT-03 : l'exercice de LUM-16 est « Déboucher un visage en contre-jour », et LUM-16 renvoie aux deux ;
  - SIT-V2-06, « Plongée et contre-plongée », et SIT-39, dont l'intention est « photographié à sa hauteur » : CMP-07 renvoie aux deux, et son exercice est « Photographier un enfant à sa hauteur » ;
  - SIT-V2-03, « Paysage : créer un premier plan en se déplaçant », reprend le simulateur de CMP-06 (« Cadrer avec un premier plan existant, ou se déplacer pour en créer un ») ; CMP-06 renvoie à SIT-11 et à SIT-V2-03.
- Ce qui est juste : `docs/lire-le-referentiel.md` dit que ces identifiants sont ceux « des anciennes situations V2, gardés tels quels » ; SIT-V2-02 et SIT-V2-06 sont à l'étape 7 de la file de travail (`docs/etat-des-travaux.md`, l. 71).
- Correction proposée, à trancher par Julien avant l'étape 7 : garder SIT-V2-01, SIT-V2-02 et SIT-V2-04, qui n'ont pas d'équivalent ; verser les quatre autres dans la situation qu'elles doublent (LUM-14 en notion clé de SIT-25, LUM-16 de SIT-03, CMP-07 de SIT-39, CMP-06 de SIT-11) et les inscrire dans `data/referentiel/retired.yaml`. Sinon, écrire dans `data/situations.yaml` ce qu'est une situation à une notion.

### REF-17 · à améliorer · Petites inexactitudes

1. MVT-08, `data/referentiel/mvt.yaml`, l. 81 : ponctuation cassée, « (light painting). ; éclairer la scène ». Correction : « (light painting) ; éclairer la scène à la lampe pendant la pose ».
2. MAP-04, `map.yaml`, l. 43 : « le mode automatique et ses hésitations ». Le Z 6 n'a pas ce mode en photo (« AF-S », « AF-C », « MF » ; « AF-F » en vidéo seulement, page « Focus »). Sony l'a (« AF automatique : [AF ponctuel] et [AF continu] sont permutés en fonction du mouvement du sujet »), sans parler d'hésitation. Correction : « le mode automatique de certaines marques », et retirer « ses hésitations » ou le sourcer.
3. BOI-12, `boi.yaml`, l. 114 : « Vue par vue, rafale, silencieux, retardateur ». Sur le Z 6, le mode silencieux n'est pas un mode de déclenchement mais une ligne du menu Prise de vue photo (« Silent photography », page « Release Mode » : « Single frame », « Continuous L », « Continuous H », « Continuous H (extended) », « Self-timer »). Déjà relevé pour la fiche (FEX-08) ; le texte du référentiel est à corriger en « Vue par vue, rafale, retardateur ; sur certains boîtiers, modes silencieux ».
4. BOI-31, `boi.yaml`, l. 299 : le texte parle de « tubes fluorescents ou lampes à vapeur de mercure » (mots du manuel de Nikon, vérifiés) ; la notion renvoie à SIT-07, « Gymnase éclairé aux LED ». Les pages lues ne disent pas que la fonction agit sous des LED. Correction : `todo` « sourcer le cas des LED », ou lieu de SIT-07 « Gymnase » sans préciser la lampe.

## Intitulés et termes des manuels

Termes relevés dans les pages françaises lues le 14 novembre 2026 : manuel en ligne du Nikon Z 7/Z 6, manuel en ligne du Canon EOS R5, guide d'aide du Sony ILCE-7M3. « Absent » : le terme n'est pas dans les pages lues, ce qui ne prouve pas que le boîtier n'a pas la fonction. Dernière colonne : l'intitulé du référentiel est-il le terme d'au moins une des trois marques ?

| Notion | Intitulé du référentiel | Nikon Z 7/Z 6 | Canon EOS R5 | Sony ILCE-7M3 | Terme d'une marque ? |
| --- | --- | --- | --- | --- | --- |
| EXP-04 | Ouverture | « ouverture » | « valeur d'ouverture » | « ouverture », « valeur d'ouverture » | oui, les trois |
| EXP-05 | Vitesse d'obturation | « vitesse d'obturation » | « vitesse d'obturation » | « vitesse d'obturation » | oui, les trois |
| EXP-06 | ISO | « sensibilité (ISO) » | « sensibilité ISO » | « sensibilité ISO », « ISO » | oui |
| MAP-04 | AF ponctuel ou continu | « AF ponctuel », « AF continu » | « AF One-Shot », « AF Servo » | « AF ponctuel », « AF continu » | oui : Nikon, Sony |
| MAP-05 | Modes de zone AF | « Mode de zone AF » | « Méthode autofocus » | « Zone mise au point » | oui : Nikon |
| MAP-06 | Collimateurs | « point AF » | « collimateur AF » | « cadre de mise au point », « collimateur » | oui : Canon, Sony |
| MAP-08 | Mémorisation AF, mise au point puis recadrage | « Mémorisation de la mise au point » | « verrouillage de la mise au point » | (« Verrouillage AF » y désigne le suivi) | proche : Nikon |
| MAP-09 | Détection des yeux et des sujets | « Détect. visage-yeux AF zone auto », « détection des yeux » | « Détection œil », « Sujet à détecter » | « AF sur les yeux », « Détection de visage » | oui |
| MAP-10 | Suivi du sujet | « Suivi du sujet » | « Suivi » | « Verrouillage AF » | oui : Nikon |
| MAP-12 | Priorité au déclenchement ou à la netteté | « priorité au déclenchement », « priorité à la mise au point » | « Priorité décl. AF One-Shot » | « Régl. prior. ds AF-S » : « AF », « Déclenchement » | non pour « netteté » |
| MAP-16 | Mise au point par zone | absent | absent | absent | non (REF-03) |
| MAP-17 | Réglage fin de l'AF | « Réglage précis de l'AF » | absent | « Microréglage AF » | non |
| MAP-18 | Bracketing de mise au point | « Prise vue avec décal mise au point » | « Bracketing de mise au point » | absent | oui : Canon |
| BOI-06 | Programme et décalage | « Auto programmé », « décalage du programme » | « Programme d'exposition automatique », « décalage de programme » | « Programme Auto », « Décalage de programme » | oui |
| BOI-07 | Priorité à l'ouverture | « Auto à priorité ouverture » | « Priorité à l'ouverture » | « Priorité ouvert. » | oui : Canon |
| BOI-08 | Priorité à la vitesse | « Auto à priorité vitesse » | « Priorité à l'obturation » | « Priorité vitesse » | proche : Nikon, Sony |
| BOI-09 | Mode manuel | « Manuel » | « Exposition manuelle » | « Exposition manuelle » | proche |
| BOI-10 | Poses B et T | « Pose B », « Pose T » | « Expositions longues (Pose longue) », « BULB » | « BULB » | oui : Nikon |
| BOI-11 | Modes personnalisés | « Réglages utilisateur U1, U2, U3 » | « Mode de prise de vue personnalisée (C1–C3) » | « Rappel de mémoire » | proche : Canon |
| BOI-12 | Modes d'entraînement | « Mode de déclenchement » | « Mode d'acquisition » | « Entraînement », « mode d'entraînement » | oui : Sony seul |
| BOI-15 | Réglages de stabilisation | « Réduction de vibration » | « Stabilisateur d'image » | « SteadyShot » | proche : Canon |
| BOI-17 | Qualité et taille d'image | « Qualité d'image », « Taille d'image » | « Qualité d'image » | « Qualité JPEG », « Taille d'img JPEG » | oui : Nikon |
| BOI-19 | Réduction du bruit en pose longue | « Réduction du bruit » | « Réduction du bruit pour les expositions longues » | « RB Pose longue » | proche |
| BOI-31 | Réduction du scintillement | « Photo avec réduction scintillement » | « Prise de vue anti-scintillement » | « Pdv anti-scintill. » | oui : Nikon |
| BOI-33 | Exposition multiple | « Surimpression » | « Expositions multiples » | absent | oui : Canon |
| BOI-34 | Zone d'image, recadrage APS-C, zoom numérique | « Choisir la zone d'image » | « Recadrage/ratio d'aspect des photos » | « APS-C/Super 35mm » | oui : Nikon |
| MES-02 | Modes de mesure | « Mesure » | « Mode de mesure » | « Mode de mesure » | oui : Canon, Sony |
| MES-04 | Correction d'exposition | « correction d'exposition » | « Correction d'exposition » | « Correct. exposition » | oui, les trois |
| MES-05 | Mémorisation d'exposition | « Mémo. expo. » | « Mémorisation d'exposition » | « Verrouillage AE » | oui : Canon |
| MES-10 | ISO auto | « Contrôle de la sensibilité auto. » | « ISO auto » | « ISO AUTO » | oui : Canon, Sony |
| COU-02 | Balance des blancs | « Balance des blancs » | « Balance des blancs » | « balance des blancs » | oui, les trois |
| COU-05 | Styles d'image | « Picture Control » | « Style d'image » | « Modes créatifs » | oui : Canon |
| NET-09 | Aperçu de profondeur de champ | « Aperçu » | « Contrôle de profondeur de champ » | « Aperçu ouverture » | proche |
| LUM-17 | Yeux rouges | « Atténuation des yeux rouges » | absent | « Réd. yeux rouges » | oui |

Dans les explications : « surlignage de netteté » (MAP-02) et « Multizone » (MES-02) ne sont dans aucun des trois manuels (constat REF-08). « IL » (EXP-03) est le mot du manuel français de Nikon (« incréments de 1/3 ou 1/2 IL ») ; le guide français de Sony écrit « EV ».

Non comparés : les intitulés qui nomment une idée et non un réglage (CMP, LEC, PLA, la plupart de LUM, OPT et RET), et les notions dont la fonction n'est pas dans les pages lues (BOI-32, « Pré-capture » : la page française du Z f citée par la source répond 404 ; la page anglaise dit « Pre-Release Capture »).

## Vérifié

Points contrôlés et justes, une ligne chacun.

- Comptes : 191 notions (BOI 36, MAP 21, LUM 18, OPT 17, RET 15, CMP 14, EXP 14, MES 13, MVT 12, COU 9, NET 9, PLA 9, LEC 4) et 49 situations ; les nombres écrits dans les 13 introductions de domaine sont justes (script `bilan.py`).
- Niveaux des situations : les 49 couples `level` et `level_max` suivent la règle de `data/situations.yaml` (médiane haute et maximum des niveaux des notions clés), recalculés par script ; aucune notion clé ne manque de renvoi à sa situation.
- EXP-03, « Un cran de molette vaut en général 1/3 d'IL, réglable sur les boîtiers » : Nikon Z 6, b1 « EV steps for exposure cntrl », valeur par défaut « 1/3 step » (page « Defaults ») ; Canon EOS R5, « Exposure level increments […] 1/3-stop, 1/2-stop ».
- EXP-13, « 12 ou 14 bits en RAW chez Nikon » : Nikon Z 6, « NEF (RAW) Bit Depth […] 12-bit […] 14-bit ».
- BOI-06, « P choisit un couple, la molette le décale à exposition égale » : Nikon Z 6, « Different combinations of shutter speed and aperture that produce the same exposure can be selected by rotating the main command dial (“flexible program”). »
- BOI-10, poses B et T : Nikon Z 6, « Bulb: The shutter remains open while the shutter-release button is held down. Time: The exposure starts when the shutter-release button is pressed and ends when the button is pressed a second time. »
- BOI-16, « le RAW se compresse avec ou sans perte » : Nikon Z 6, « Lossless compressed […] reversible algorithm », « Compressed […] non-reversible algorithm », « Uncompressed ».
- BOI-31, réduction du scintillement : Nikon Z 6, « the camera will time photographs to reduce banding, areas of under- or over-exposure, or (in photographs taken in continuous release modes) uneven coloration caused by the flicker of such light sources as fluorescent or mercury-vapor lamps ».
- BOI-33, « chez Nikon, de 2 à 10 vues, par addition, moyenne, plus clair ou plus sombre » : Nikon Z 6, « Record two to ten NEF (RAW) exposures as a single photograph », « Overlay mode: […] Add […] Average […] Lighten […] Darken ».
- MES-04, « en P, A et S, et en M avec ISO auto » : Nikon Z 6, « In mode M, exposure compensation affects only the exposure indicator; shutter speed and aperture do not change (ISO sensitivity will, however, automatically be adjusted according to the exposure compensation value selected when auto ISO sensitivity control is enabled) ».
- MES-08, « certaines marques font aussi varier la balance des blancs ou l'optimiseur de plage dynamique » : Nikon Z 6, « Vary exposure, flash level, Active D-Lighting (ADL), or white balance slightly with each shot ».
- MES-13, « méthode d'Ansel Adams et Fred Archer » : Wikipedia, « Zone System », révision 1382492262, « formulated by Ansel Adams and Fred Archer ».
- LUM-12, « traînées derrière ou devant le sujet » : Nikon Z 6, « Rear-curtain sync: The flash fires just before the shutter closes, creating the effect of a stream of light behind moving light sources. »
- LUM-17, « la réduction des yeux rouges allume une lampe avant l'éclair » : Nikon Z 6, « before it fires, the red-eye reduction lamp on the flash unit or camera lights to reduce “red-eye” ».
- OPT-12, note de calcul : arctan(1,5) = 56,31° et arctan(1,33) = 53,06° (recalculé) ; Wikipedia, « Brewster's angle », révision 1373604193 : « approximately 56° » pour le verre, « approximately 53° » pour l'eau.
- OPT-14, bonnettes : Wikipedia, « Close-up lens », révision 1327657034, « Close-up lenses typically mount on the filter thread of the primary lens » et « The magnification is the focal distance of the objective lens (f) divided by the focal distance of the close-up lens ». Bagues allonge : « Extension tube », révision 1382668225, « decrease of light; shallower depth of field; and loss of ability to focus at infinity ». Multiplicateurs : « Teleconverter », révision 1382663333, « A 2× teleconverter doubles the apparent focal length […] doubles the focal ratio ».
- OPT-16, « autant que de lamelles si leur nombre est pair, le double s'il est impair » : Wikipedia, « Diffraction spike », révision 1368876754, « a diaphragm with n blades yields n spikes if n is even, and 2n spikes if n is odd » ; la note « 2 × 7 = 14 » est juste.

Notions du jalon de la V1 minimale, en plus de celles qui précèdent :

- EXP-04, exercice « Trouver l'ouverture qui donne +1 IL depuis f/5.6 » : f/4, car (5,6 / 4)² = 1,96, soit un doublement de la lumière (recalculé).
- EXP-05, exercice « Compenser le passage de f/4 à f/8 par la vitesse » : (8 / 4)² = 4, soit 2 IL, donc un temps de pose quatre fois plus long (recalculé).
- EXP-06, « les ISO étendus coûtent en qualité : plage dynamique réduite en bas, bruit et couleurs irrégulières en haut » : Canon EOS R5, « ISO Speed Settings for Still Photos » : « Because L (equivalent to ISO 50) is an expanded ISO speed setting, the dynamic range will be somewhat narrower compared to the standard setting » et « Image noise (dots of light or banding) and irregular colors may increase and apparent resolution may decrease at H ». La source citée par la notion (`canon-5ds-iso`, hôte non joignable) n'a pas été relue ; cette page de Canon dit la même chose.
- MAP-04, « Verrouiller une distance ou la suivre » : Nikon Z 6, « AF-S Single AF: For stationary subjects […] focus will lock while the shutter-release button is pressed halfway » ; « AF-C Continuous AF: For moving subjects. The camera focuses continuously while the shutter-release button is pressed halfway ».
- MAP-05, « Point unique, zone, large, suivi » : Nikon Z 6, modes de zone AF « Pinpoint AF », « Single-point AF », « Dynamic-area AF », « Wide-area AF (S) », « Wide-area AF (L) », « Auto-area AF » ; Sony ILCE-7M3, « Large », « Zone », « Centre », « Spot flexible », « Verrouillage AF ».
- MAP-09 : le Z 6 a bien un réglage de détection, « a4: Auto-area AF face/eye detection » (« Détect. visage-yeux AF zone auto »).
- NET-01, « ses quatre leviers » : Wikipedia, « Depth of field », révision 1383569728, « The depth of field can be determined by focal length, distance to subject (object to be imaged), the acceptable circle of confusion size, and aperture » ; le cercle de confusion acceptable dépend de la taille du capteur (même page : « the circle of confusion is directly tied to the sensor size »).
- NET-06, « Plus le fond est loin du sujet, plus il est flou » : dans la formule citée par la source de la notion, c = A × (S₂ − S₁) / S₂ × f / (S₁ − f), le terme (S₂ − S₁) / S₂ croît avec S₂ (sa dérivée, S₁ / S₂², est positive) et tend vers 1 : le flou croît avec la distance du fond, vers une limite.
- LUM-02, « La douceur dépend de la taille apparente de la source » : Tiffen (Lowel), « Foundations of Lighting: Understanding Soft Light », relue à son adresse : « A soft light source would be one that appears larger in relative size than the subject being lit. »
- MVT-01, « dépend de la vitesse du sujet, de sa direction et de sa taille dans l'image » : géométrie (le déplacement sur le capteur est la vitesse, multipliée par le temps de pose, par le grandissement et par le sinus de l'angle entre la trajectoire et l'axe de visée) ; pas de source relue pour la phrase elle-même.
- MES-10, « Plafond d'ISO, vitesse minimale, ISO auto en M » : Nikon Z 6, « ISO Sensitivity Settings » : « Maximum sensitivity », « Minimum shutter speed: Choose the shutter speed below which auto ISO sensitivity control will kick in to prevent underexposure in modes P and A » ; « The Mode Dial » : « Auto ISO Sensitivity Control (Mode M) ».
- BOI-07 et BOI-08 : Nikon Z 6, « A Aperture-priority auto: […] Use to blur backgrounds or bring both foreground and background into focus » ; « S Shutter-priority auto: […] Use to freeze or blur motion » ; BOI-08, simulateur « Ouverture qui atteint sa limite et clignote » : « Indicators and Error Messages », « Exposure indicators and shutter speed or aperture display flash ».
- BOI-12 : Nikon Z 6, modes de déclenchement « Single frame », « Continuous L », « Continuous H », « Continuous H (extended) », « Self-timer » (voir REF-17, point 3, pour « silencieux »).
- CMP-02, « Tiers » : Wikipedia, « Rule of thirds », révision 1383322855, « an image should be imagined as divided into nine equal parts by two equally spaced horizontal lines and two equally spaced vertical lines, and that important compositional elements should be placed along these lines or their intersections ». « Savoir quand centrer » et la symétrie : pas de source (déjà noté dans `docs/etat-des-travaux.md`).

Autres domaines :

- EXP-02 et EXP-03, intitulés anglais « scene brightness, EV » et « stops, EV » : les deux emplois sont ceux de Wikipedia, « Exposure value », révision 1352562239 (« The proper EV was determined by the scene luminance and film speed » ; « Exposure value is also used to indicate an interval on the photographic exposure scale, with a difference of 1 EV corresponding to a standard power-of-2 exposure step, commonly referred to as a stop »).
- EXP-13, matrice de Bayer : Wikipedia, « Bayer filter », révision 1384004962, « each pixel is filtered to record only one of three colors » ; « demosaicing algorithms can be used to interpolate a set of complete red, green, and blue values for each pixel ».
- MAP-03, « pourquoi l'AF patine sur une surface unie » : Nikon Z 6, « Focus » : « The camera may be unable to focus using autofocus in the following situations: […] The subject lacks contrast ».
- MAP-20, MAP-21 et MAP-22 : Nikon Z 6, « a6: Store Points by Orientation », « a13: Manual Focus Ring in AF Mode » (« Autofocus can be over-ridden by rotating the lens focus ring while the shutter-release button is pressed halfway »), « a5: Focus Points Used », « a9: Focus Point Wrap-Around ».
- NET-04, « fermer au maximum fait perdre du piqué » : Nikon Z 6, « Diffraction Compensation: Select On to reduce diffraction at small apertures (high f/-numbers). »
- NET-05 : Wikipedia, « Bokeh », révision 1382683314, « the aesthetic quality of the blur produced in out-of-focus parts of an image » ; « out-of-focus points are blurred into the polygonal shape formed by the aperture blades ».
- NET-08 : Wikipedia, « Focus stacking », révision 1382674337, « combines multiple images taken at different focus distances to give a resulting image with a greater depth of field ».
- NET-09 : Sony ILCE-7M3, « Aperture Preview: […] the aperture is stepped down to the set aperture value and you can check the blurriness prior to shooting ».
- MES-02, « Multizone, pondérée centrale, spot et variantes de marque » : Nikon Z 6, « Matrix metering », « Center-weighted metering », « Spot metering », « Highlight-weighted metering » ; Canon EOS R5, « Evaluative metering », « Partial metering », « Spot metering », « Center-weighted average ».
- MES-12, « Sur certains boîtiers, la mesure spot se fait sous le collimateur choisi plutôt qu'au centre » : Nikon Z 6, « The camera meters a ⌀4 mm circle […] centered on the current focus point » ; Canon EOS R5, « Covers approx. 3.1% of the area at the center of the screen » ; Sony, réglage « Spot Metering Point ». Sur le Z 6 c'est le fonctionnement normal, pas une option.
- MVT-02, « Vitesse de sécurité selon la focale » : Nikon Z 6, « Minimum Shutter Speed > Auto: the camera will choose the minimum shutter speed based on the focal length of the lens. For example, the camera will automatically select fast minimum shutter speeds to reduce the blur that commonly occurs with telephoto lenses. »
- MVT-06 : Wikipedia, « Panning (camera) », révision 1372970130, « keeping the subject in the same position in the frame for the duration of the exposure » ; « The exposure time must be long enough to allow the background to blur ».
- LUM-04, « lumière chaude » à l'heure dorée : Wikipedia, « Golden hour (photography) », révision 1382491336, « the period of daytime shortly after sunrise or before sunset, during which daylight is redder and softer ».
- LUM-10, « mémoriser la puissance du flash sur le sujet avant de recadrer » : Nikon Z 6, « FV Lock: This feature is used to lock flash output, allowing photographs to be recomposed without changing the flash level ».
- LUM-18 et COU-09 : Wikipedia, « Underwater photography », révision 1381585685, « The longer wavelengths of sunlight (such as red or orange) are absorbed quickly by the surrounding water » ; « The loss of color increases not only vertically through the water column, but also horizontally » ; « Backscatter (photography) », révision 1301675266, « the camera's flash being reflected from unfocused motes of dust, water droplets, or other particles in the air or water ». La source primaire de ces deux notions (`noaa-red`) n'a pas été relue.
- BOI-03, « Le viseur électronique peut montrer l'exposition finale (aperçu activé) » : Nikon Z 6, « d8: Apply Settings to Live View: Choose On to preview how changes to such settings as white balance, Picture Controls, and exposure compensation affect color and brightness in photo mode ».
- BOI-13 : Nikon Z 6, « The camera is equipped with a memory buffer for temporary storage, allowing shooting to continue while photographs are being saved to the memory card. »
- BOI-21 : Nikon Z 6, « Format Memory Card: […] formatting permanently deletes all pictures and other data on the card. Before formatting, be sure to make backup copies as required. »
- BOI-23, en partie : Nikon Z 6, « Battery Endurance » : « Viewfinder only: […] 310 shots (Z 6) ; Monitor only: […] 380 shots (Z 6) » ; « Endurance varies with the condition of the battery, the temperature ». La page ne cite pas la stabilisation.
- BOI-32 : Nikon Z f, « d3: Pre-Release Capture Options » : « the camera will buffer frames while the shutter-release button is pressed halfway, but only the frames added to the buffer in the final n seconds […] will be recorded to the memory card when the shutter-release button is pressed all the way down ».
- BOI-34, « en DX, la focale équivalente est multipliée par 1,5 environ » : Nikon Z 6, « DX (24 × 16): […] To calculate the approximate focal length of the lens in 35 mm format, multiply by 1.5. »
- BOI-36, « Sauvegarde en double, débordement, séparation RAW et JPEG » : Canon EOS R5, « Selecting Cards for Recording/Playback » : « Auto switch card », « Rec. separately », « Rec. to multiple ».
- COU-02, « une balance auto qui garde l'ambiance chaude ou qui neutralise le blanc » : Canon EOS R5, « Auto (Ambience priority) », « Auto (White priority) » ; Nikon Z 6, « Keep white (reduce warm colors) », « Keep overall atmosphere », « Keep warm lighting colors ».
- OPT-07, OPT-08 et OPT-09 : Nikon Z 6, « Auto Distortion Control: […] barrel distortion when shooting with wide-angle lenses and […] pin-cushion distortion when shooting with long lenses » ; « Vignette control reduces the drop in brightness that occurs at the edges the frame. Its effects vary from lens to lens and are most noticeable at maximum aperture » ; manuel du NIKKOR Z 24–70mm f/4 S, « Lens hoods block stray light that would otherwise cause flare or ghosting ».
- OPT-17 : Wikipedia, « Entrance pupil », révision 1378470579, « the camera must be rotated around the center of the entrance pupil to avoid parallax errors in the final, stitched panorama ».
- RET-14 : Wikipedia, « Posterization », révision 1369953124, « may occur when the color depth, sometimes called bit depth, is insufficient to accurately sample a continuous gradation of color tone ».

Exercices chiffrés, refaits par script (`exercices.py` ; cercle de confusion de 0,029 mm, plein format, celui de la source `wikipedia-circle-of-confusion`) :

- NET-03, « Paysage net de 1,5 m à l'infini » : il faut une hyperfocale de 3 m (Wikipedia, « Hyperfocal distance », révision 1382493010 : « all objects at distances from half of the hyperfocal distance out to infinity will be acceptably sharp »), soit f/3 au 16 mm, f/6,7 au 24 mm, f/14 au 35 mm : faisable au grand-angle.
- MAP-16, « Régler une zone nette de 2 à 5 m » : 1/2 − 1/5 = 2/H donne une hyperfocale de 6,67 m et une mise au point à 2,86 m, soit f/4,1 au 28 mm et f/6,4 au 35 mm : faisable.
- MVT-07, « Poser 30 s en plein jour » : depuis f/16, 1/100 s et ISO 100 en plein soleil (règle citée au constat REF-07 pour EXP-11), 30 s demandent 3000 fois moins de lumière, soit 11,55 IL. Un filtre de 10 IL donne 10 s à f/16 et 20 s à f/22 : l'exercice n'est faisable en plein soleil qu'avec plus de 10 IL de filtre, ou sous un ciel moins lumineux. À dire dans l'exercice quand il sera écrit.
- BOI-22, « Date, fuseau, auteur, géolocalisation, microprogramme, réinitialisation » : ces réglages existent dans le menu Configuration du Z 6, en cinq lignes (« Fuseau horaire et date », « Informations de copyright », « Données de position », « Version du firmware », « Réinitialiser tous les réglages »).

## Je ne sais pas

- MAP-14, « le limiteur accélère l'AF sur les sujets lointains » : la seule source de la notion décrit le limiteur d'un bridge (constat SRC-07 du rapport `sources.md`), et sa phrase est conforme (« focus more quickly on distant subjects by keeping it from focusing on subjects at close distances », guide du DSC-RX10M4, relu). Je ne sais pas ce que fait le limiteur d'un objectif de reflex ou d'hybride, ni s'il sert aussi en macro (MAP-14 est notion clé de SIT-22) : aucun manuel d'objectif à limiteur n'a été trouvé sur les hôtes joignables.
- BOI-16, « le HEIF peut enregistrer 10 bits par couche » : source citée (`canon-hdr-heif`) non relue, hôte non joignable. Les pages lues du manuel de l'EOS R5 disent que le mode HDR PQ enregistre en HEIF, sans donner de profondeur ; le « 10 bit » de sa page de caractéristiques porte sur la vidéo.
- BOI-19, « la seconde pose » : aucun des trois manuels lus ne parle d'une seconde pose (REF-07). Wikipedia, « Dark-frame subtraction », révision 1359409759, décrit la technique (« taking a picture with the shutter closed and subtracting that electronically from the original photo ») sans dire que c'est ce que fait le réglage du boîtier.
- OPT-14, simulateur : « Multiplicateur : […] distance minimale inchangée » : pas dans la page de Wikipedia lue ; source citée (`fujifilm-teleconverters`) non relue, hôte non joignable.
- EXP-06, « chaque IL d'ISO en plus coûte environ un IL de marge dans les hautes lumières » : sources citées (DPReview, Photography Life) non relues ici ; le rapport `fiches-exposition.md` les traite.
- EXP-09, « L'écart en IL entre la saturation du capteur et son plancher de bruit » : pas de source dans la notion ; l'article « Dynamic range » de Wikipedia (révision 1384581363) donne la définition générale (« the ratio between the largest and smallest measurable values »), pas celle-ci mot pour mot.
- EXP-13, « le JPEG, limité à 8 bits par couche » : source citée (`cic-bit-depth`) non relue, hôte non joignable ; aucune page lue ne le dit.
- EXP-14, BOI-28, MVT-12, RET-10, COU-05 : sources citées non relues (hôtes non joignables) ; texte non vérifié.
- MVT-09, « règles empiriques » et exercice « Pose maximale au 14 mm, puis au 50 mm » : la règle n'est pas nommée ; si c'est celle « des 500 », elle donnerait 35,7 s et 10 s (calcul), mais aucune page lue ne la donne (elle n'est pas dans l'article « Astrophotography » de Wikipedia, révision 1384698105). La notion a déjà un `todo`.
- SIT-29, « Depuis un train ou un avion », notion clé OPT-12 (polarisant) : Wikipedia, « Polarizing filter (photography) », montre le verre trempé d'une lunette arrière de voiture vu à travers un polarisant (« Variations in glass stress are clearly seen when photographed through a polarizing filter »). Je ne sais pas si les vitres d'un train ou d'un avion font de même : pas de source lue. À vérifier avant d'écrire la recette.
- SIT-21, « Feux d'artifice », notion clé MES-09 (posemètre en manuel) : je ne sais pas si l'échelle d'exposition sert en pose B devant un ciel noir ; les pages lues ne le disent pas.
- SIT-14, « Brouillard et temps couvert » : une de ses trois notions clés est EXP-12 (« Exposer à droite », N3) ; ni MES-03 ni MES-04 n'y renvoient. Je ne sais pas si le brouillard trompe la cellule comme la neige : pas de source lue.
- SIT-02, `flash: required` : je ne sais pas si un portrait en plein soleil « dépend du flash » ; LUM-16 (réflecteur) et LUM-02 (se mettre à l'ombre) sont d'autres voies, et les pages lues du manuel du Z 6 ne décrivent que des flashes en option (« optional flash unit ») : aucune ne mentionne de flash intégré. Choix de conception, à trancher par Julien.
- Niveaux : `docs/lire-le-referentiel.md` ne définit N1, N2 et N3 que par trois mots (« débutant », « intermédiaire », « avancé »). Hors des deux cas prouvés par les textes eux-mêmes (REF-06, REF-14), je n'ai pas de critère écrit pour dire qu'une notion est mal classée ; 92 notions sont N1, 80 N2, 19 N3.
- Règle des notions clés : « Les réglages de base (ouverture, vitesse, ISO, modes, mesure, AF, balance des blancs) servent dans toutes les recettes sans être répétés ». La règle ne nomme pas ces notions. Comptage par script : EXP-04, EXP-05, BOI-07 et BOI-08 ne sont jamais notions clés ; EXP-06 l'est une fois (SIT-07), BOI-09 deux fois, MES-02 deux fois, COU-02 deux fois, MAP-04, MAP-05 trois fois chacune, MAP-06 deux fois, MES-10 cinq fois. Je ne sais pas si c'est voulu (la notion est alors « propre à la situation ») ou si la règle est appliquée inégalement.

## Ce qui n'a pas été couvert

- Les textes anglais : seuls les intitulés anglais ont été lus (`title.en`) ; ils n'ont pas été confrontés aux manuels anglais un par un, sauf là où un constat les cite.
- Les domaines CMP, LEC, RET et PLA : lus en entier, mais leurs phrases sont des programmes ; aucune n'a été confrontée à une source, sauf CMP-02, RET-12 et RET-14.
- Les 82 notions qui ne sont notion clé d'aucune situation : leurs renvois n'ont été regardés que par les scripts.
- Le contenu juridique (PLA-07, PLA-09) : hors de portée ici (textes officiels non joignables) ; le rapport `sources.md` en traite les sources (SRC-08).
- La concordance entre le champ `simulator` des 17 notions du jalon et le simulateur réel : faite par le rapport `fiches-exposition.md` (FEX-08), qui renvoie à Julien cinq écarts (diaphragme animé, rideau animé, « l'appareil explique son choix », alerte de vitesse trop lente, mode silencieux) ; non refaite ici.
