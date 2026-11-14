# Audit du lot « Référentiel : contenu des 191 notions et des 49 situations »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Rapport écrit par un agent de Claude. **État : constats non contre-vérifiés.**
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
| Nikon, manuel en ligne Z 7/Z 6, en anglais et en français (« © Nikon Corporation ») : Taking Photographs, Focus, White Balance, Silent Photography, The Mode Dial, ISO Sensitivity Button, Exposure Compensation Button, Release Mode/Self-Timer Button, The i Button, Photo Information, Defaults, 18 pages du menu Prise de vue photo, 17 réglages personnalisés, Format memory card, Save user settings, AF fine-tune, Flash Modes, FV Lock, Indicators and Error Messages, Caring for the Camera, Specifications | `https://onlinemanual.nikonimglib.com/z7_z6/en/…` et `…/fr/…` | `nikon-z6-en-*.html`, `nikon-z6-fr-*.html` |
| Sony, guide d'aide ILCE-7M3 (PDF, « Copyright 2018 Sony Corporation »), en anglais et en français | `https://helpguide.sony.net/ilc/1720/v1/en/print.pdf`, `…/fr/print.pdf` | `sony-7m3-en-print.pdf`, `sony-7m3-fr-print.pdf` |
| Canon, manuel en ligne EOS R5 (« © CANON INC. 2025 »), en anglais et en français : 39 pages (modes de prise de vue, qualité d'image, sensibilité ISO, anti-scintillement, balance des blancs, style d'image, expositions multiples, bracketing de mise au point, mode d'obturation, mesure, correction d'exposition, mémorisation d'exposition, opération autofocus, méthode autofocus, mise au point manuelle, mode d'acquisition, retardateur, alerte de surexposition, zébrures, formatage, fonctions personnalisées) | `https://cam.start.canon/en/C003/manual/html/…` et `…/fr/…` | `canon-r5-en-*.html`, `canon-r5-fr-*.html` |
| Wikipedia (source secondaire), révisions courantes lues en wikitexte : « Diffraction spike » 1368876754, « Polarizing filter (photography) » 1382680188, « Brewster's angle » 1373604193, « Teleconverter » 1382663333, « Extension tube » 1382668225, « Close-up lens » 1327657034, « Flash synchronization » 1353816001, « Zone System » 1382492262 | `https://en.wikipedia.org/w/index.php?title=…&oldid=…&action=raw` | `wiki-<titre>-<révision>.wikitext` |

### Non relues

- Cambridge in Colour (7 entrées citées par EXP-13, EXP-14, BOI-28, MVT-12, OPT-14, RET-14), B&H (`bh-sunstars`), PetaPixel, Hugin, NOAA, Adorama, Fujifilm, arXiv, Stanford, EASA, les pages d'assistance de Canon hors `cam.start.canon` (`vn.canon`, `sg.canon`, `id.canon`, `global.canon`, `ij.manual.canon`) : sources non relues, hôtes non joignables d'ici.
- DPReview et Photography Life (`dpreview-iso-invariance`, `pl-iso-invariance`, `pl-lens-compression`) : non relues ici ; les rapports précédents notent que ces hôtes répondent 403 aux lectures automatiques.

## Constats

Classés du plus grave au moins grave. Les identifiants suivent l'ordre d'écriture, pas l'ordre de gravité.

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
- Preuve : les deux phrases, à quatre lignes d'écart. L'explication donne trois cas d'usage ; l'exercice en prend un quatrième, qui est le contraire du premier. Aucune source n'est citée pour l'un ni pour l'autre. Le manuel du Z 6 dit seulement : « M Manual: You control both shutter speed and aperture. Set shutter speed to “bulb” or “time” for long time-exposures. » (`…/z7_z6/en/06_shooting_controls_01.html`).
- Je ne sais pas si le mode manuel est conseillé pour un concert : aucune source lue ne le dit.
- Correction proposée : un exercice tiré de l'explication, par exemple « Garder la même exposition sur les cinq vues d'un panorama » (BOI-09 est notion clé de SIT-30, « Panorama ») ; ou bien ajouter le concert à l'explication, avec une source.

### REF-06 · incohérent · RET-12, notion de niveau N1, demande ce que COU-06 classe au niveau N3

- Endroit : `data/referentiel/ret.yaml`, l. 107-115 (RET-12, « Exporter », N1) ; `data/referentiel/cou.yaml`, l. 58-69 (COU-06, « Espaces couleur et écrans », N3).
- Ce qui est écrit : RET-12, explication : « Format, taille, accentuation de sortie, espace couleur ; épreuvage à l'écran avec le profil du papier avant un tirage » ; exercice : « Préparer une photo pour un réseau social et pour un tirage ». COU-06, explication : « sRGB, Adobe RGB, Display P3 ; pourquoi les couleurs changent d'un écran à l'autre, calibrage de l'écran » ; exercice : « Choisir l'espace pour le web et pour un tirage ».
- Preuve : les deux exercices demandent le même choix (un espace couleur pour le web, un pour le tirage), l'un au niveau débutant, l'autre au niveau avancé. L'épreuvage avec le profil du papier suppose de savoir ce qu'est un profil, que seule COU-06 explique. Aucune des deux notions n'a de source (COU-06 a un `todo`).
- Critère : `docs/cadrage.md`, « Le public est débutant. Le but est la compréhension et la maîtrise du boîtier et des bases, pas le niveau professionnel. »
- Correction proposée : RET-12 garde au niveau N1 « Format, taille et qualité du fichier ; sRGB pour le web » ; « accentuation de sortie » et « épreuvage à l'écran avec le profil du papier » passent dans COU-06 (N3). L'exercice de RET-12 devient « Préparer une photo pour un réseau social et pour un envoi à un proche ».

### REF-07 · non sourcé · 125 notions sur 191 n'ont pas de source, dont 109 sans `todo` ; 20 d'entre elles affirment un fait qu'une page lue ici appuie

- Endroit : les 13 fichiers de `data/referentiel/`.
- Preuve (script `bilan.py`) : 125 notions n'ont pas de champ `sources` ; 16 d'entre elles ont un `todo` qui le dit (15 fois « Sourcer les affirmations à la rédaction de la fiche (audit A du 7 novembre 2026) », et celui d'OPT-12) ; restent 109 notions sans source ni `todo`, dont 55 de niveau N1 : BOI 19, CMP 14, RET 13, LUM 10, OPT 10, MAP 9, EXP 7, MES 7, MVT 6, COU 4, LEC 4, NET 3, PLA 3.
- Règle : `CLAUDE.md`, « Toute affirmation factuelle est sourcée » et « On n'implémente que ce qui est sourcé ».
- Ce qui est juste : beaucoup de ces textes sont un programme et non une affirmation (CMP-03, « Guider le regard » ; RET-06, « Doser l'accentuation et la réduction du bruit »). La règle de l'audit A, sourcer à la rédaction de la fiche, tient pour elles. Mais 20 notions sans source (15 sans `todo`, 5 avec) affirment un fait précis, et une page lue pour cet audit l'appuie :

  | Notion | Ce que le référentiel affirme | Source lue le 14 novembre 2026 |
  | --- | --- | --- |
  | BOI-02 | « À mi-course, mise au point et mesure » | Nikon Z 6, « Taking Photographs » : « To focus, press the shutter-release button halfway » (la page ne dit rien de la mesure) |
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

### REF-08 · à améliorer · Intitulés : quatre termes ne sont ceux d'aucun des trois manuels français lus, et le référentiel n'a pas de champ pour les termes de chaque marque

- Endroit : `data/referentiel/map.yaml`, l. 23 (MAP-02), l. 118 (MAP-12), l. 156 (MAP-17) ; `mes.yaml`, l. 20 (MES-02) ; `boi.yaml`, l. 111 (BOI-12), l. 254-263 (BOI-27), l. 316-319 (BOI-33).
- Méthode : le nombre d'occurrences de chaque terme est compté dans les pages françaises lues du manuel du Z 7/Z 6, du manuel de l'EOS R5 et du guide de l'ILCE-7M3 (tableau complet dans la section « Intitulés et termes des manuels », plus bas).
- Preuve :
  1. MAP-02, explication : « surlignage de netteté ». Aucune occurrence de « surlignage » dans les trois manuels. Nikon : « d10 : Mise en relief », « la mise en relief de la mise au point » ; Canon : « Paramètres de repères MF (Accentuation du contour) » ; Sony : « Régl. intensification », « la fonction d'intensification, laquelle améliore le contour des zones nettes ».
  2. MAP-17, titre : « Réglage fin de l'AF ». Aucune occurrence de « réglage fin ». Nikon : « Réglage précis de l'AF » ; Sony : « Microréglage AF » ; les pages lues de l'EOS R5 n'ont pas ce réglage.
  3. MAP-12, titre : « Priorité au déclenchement ou à la netteté ». Nikon : « priorité au déclenchement », « priorité à la mise au point » (a1, a2) ; Sony : « Régl. prior. ds AF-S », options « AF » et « Déclenchement » ; Canon : « Priorité décl. AF One-Shot », « priorité à la mise au point ». « Netteté » n'est le mot d'aucun.
  4. MES-02, explication : « Multizone ». Aucune occurrence. Nikon : « Mesure matricielle » ; Canon : « Mesure évaluative » ; Sony : « Multi ».
  5. BOI-33, titre « Exposition multiple », dont l'explication cite Nikon (« chez Nikon, de 2 à 10 vues ») : le menu français de Nikon dit « Surimpression » (65 occurrences, aucune d'« exposition multiple ») ; Canon dit « Expositions multiples ».
  6. BOI-12, titre « Modes d'entraînement » : terme de Sony seul (« mode d'entraînement », « Entraînement ») ; Nikon dit « Mode de déclenchement », Canon « Mode d'acquisition ». Déjà écrit au constat FEX-15 du rapport `fiches-exposition.md` pour la fiche ; le titre vient du référentiel.
- Ce qui est juste : le référentiel vaut pour plusieurs marques, et un intitulé générique est légitime. Sur les 34 intitulés comparés, 31 sont le terme d'au moins une des trois marques, ou en sont proches (« Vitesse d'obturation », « Correction d'exposition » et « Balance des blancs » sont ceux des trois) ; trois ne le sont pas : MAP-12, MAP-17 et MAP-16 (constat REF-03).
- Ce qui manque : BOI-27, « Le vocabulaire de sa marque », promet une « Bascule de vocabulaire dans tout l'outil » (l. 259), et aucun champ du référentiel ne porte les termes de chaque marque. Les rapports sur les fiches (FEX-15, FMA-14) proposent d'écrire ces termes fiche par fiche, à la main.
- Correction proposée :
  - tout de suite : MAP-02, « mise en relief de la mise au point (focus peaking) » ; MAP-17, « Réglage précis de l'AF » ; MAP-12, « Priorité au déclenchement ou à la mise au point » ; MES-02, « Matricielle ou évaluative, pondérée centrale, spot » ; BOI-33, explication « (« Surimpression » chez Nikon) » ;
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
4. EXP-02 et EXP-03, `exp.yaml`, l. 18 et 27 : les deux intitulés anglais finissent par « EV » (« scene brightness, EV » ; « stops, EV »), pour deux grandeurs différentes (la lumière de la scène, l'écart entre deux réglages). Correction : EXP-02, « scene brightness, light value » ou « scene brightness » seul.
5. BOI-31, `boi.yaml`, l. 299 : le texte parle de « tubes fluorescents ou lampes à vapeur de mercure » (mots du manuel de Nikon, vérifiés) ; la notion renvoie à SIT-07, « Gymnase éclairé aux LED ». Les pages lues ne disent pas que la fonction agit sous des LED. Correction : `todo` « sourcer le cas des LED », ou lieu de SIT-07 « Gymnase » sans préciser la lampe.

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

## Je ne sais pas

(en cours d'écriture)
