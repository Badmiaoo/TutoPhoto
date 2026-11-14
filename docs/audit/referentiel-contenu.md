# Audit du lot « Référentiel : contenu des 191 notions et des 49 situations »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Rapport écrit par un agent de Claude. **État : constats non contre-vérifiés.**
- Version auditée : copie de travail de la branche de l'audit, à la version 0.3.57 ; `data/referentiel/*.yaml` et `data/situations.yaml` n'ont pas changé depuis le 11 novembre 2026.

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

Pages enregistrées, textes extraits et scripts : dossier `audit/referentiel-contenu/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`). Les numéros de ligne sont ceux des fichiers à la version 0.3.57.

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

(en cours d'écriture ; les constats sont ajoutés au fur et à mesure)

### REF-01 · incohérent · Deux situations de flash sont notées « pas de flash »

- Endroit : `data/situations.yaml`, l. 5 (règle), l. 351-358 (SIT-V2-01) et l. 383-390 (SIT-V2-05).
- Ce qui est écrit : la règle, « required : la situation dépend du flash ; optional : elle l'utilise en option. Absent : pas de flash. » SIT-V2-01 a pour titre « Portrait studio avec un flash déporté » et SIT-V2-05 « Flash indirect en intérieur », avec l'intention « Lumière douce au flash » ; aucune des deux n'a de champ `flash`.
- Preuve : lecture du fichier. Par comparaison, SIT-25 « Soirée en intérieur au flash » (l. 209), SIT-02 et SIT-34 portent `flash: required`. Un script qui liste les situations sans champ `flash` dont le titre ou les notions clés portent le mot « flash » donne SIT-V2-01, SIT-V2-04 (notion clé LUM-15, « Flash déporté et studio ») et SIT-V2-05.
- Conséquence : d'après la règle du fichier lui-même, ces situations « n'ont pas de flash ». Tout tri par ce champ (situations faisables sans flash) les rangera du mauvais côté.
- Correction proposée : `flash: required` pour SIT-V2-01 et SIT-V2-05. Pour SIT-V2-04 (« Nature morte à deux lumières »), Julien tranche : `optional` si les deux lumières peuvent être des lampes, `required` sinon.

### REF-02 · à améliorer · MES-07 : « repérer en direct les zones brûlées » ne vaut, en photo, que pour un des trois boîtiers lus

- Endroit : `data/referentiel/mes.yaml`, l. 65-73 (MES-07, niveau N1).
- Ce qui est écrit : titre « Alertes de surexposition et zébras » ; explication « Repérer en direct les zones brûlées » ; simulateur « Clignotement et zébras réglables ».
- Preuve (sources lues) :
  - Nikon Z 7/Z 6 : l'affichage des hautes lumières pendant la visée est un réglage du groupe vidéo, « g6: Highlight Display », « Choose the brightness needed to trigger the movie highlight display » (`…/z7_z6/en/09_menu_guide_05_g06.html`). En photo, les hautes lumières se voient à la lecture : « Highlights (areas that may be overexposed) » (`…/en/08_more_about_playback_02.html`).
  - Canon EOS R5 : « Zebra Settings. To help you adjust exposure before or during movie recording, you can display a striped pattern over or around image areas of a specified brightness. » (`…/C003/manual/html/UG-03_Shooting-2_0140.html`) ; en photo : « You can specify blinking display of overexposed highlights on the playback screen. » (`…/UG-05_Playback_0300.html`).
  - Sony ILCE-7M3 : « Zebra Setting. Sets a zebra pattern, which appears over part of an image if the brightness level of that part meets the IRE level that you have set. » (guide d'aide, menu « Camera Settings2 ») ; le guide ne limite pas ce réglage à la vidéo.
- Ce qui est juste : les deux outils existent. Mais sur deux des trois boîtiers lus, l'alerte de la photo arrive après la prise, et les zébras sont réservés à la vidéo.
- Correction proposée : explication « Repérer les zones brûlées : après la prise, par le clignotement de l'écran de lecture ; pendant la visée, par les zébras, que certains boîtiers réservent à la vidéo » ; simulateur « Clignotement à la lecture ; zébras en visée, selon le profil d'appareil ». Sources à ajouter à la notion : les quatre pages citées.

### REF-03 · à améliorer · MAP-16 : « Mise au point par zone » se confond avec les « zones » de l'autofocus des trois marques

- Endroit : `data/referentiel/map.yaml`, l. 146-154 (MAP-16) ; l. 49-58 (MAP-05, « Modes de zone AF »).
- Ce qui est écrit : MAP-16, « Mise au point par zone » (« zone focusing ») : « Prérégler distance et ouverture pour une plage nette sans AF ». MAP-05, « Modes de zone AF » : « Point unique, zone, large, suivi ».
- Preuve (manuels français lus) : « zone » y désigne partout une partie du cadre où l'autofocus travaille. Nikon : « Mode de zone AF » (54 occurrences dans les pages lues), « AF zone large », « AF zone automatique ». Sony : « Zone mise au point » (81 occurrences), dont un réglage nommé « Zone ». Canon : « Zone AF » (méthode autofocus). Aucun des trois manuels n'emploie « mise au point par zone » ni « zone focusing » pour un préréglage de distance.
- Conséquence : un débutant qui lit « Mise au point par zone » ira chercher le réglage « Zone » de son autofocus, alors que la notion demande de couper l'autofocus.
- Correction proposée : intituler MAP-16 « Mise au point préréglée » (anglais : « zone focusing, preset focus »), sans changer l'identifiant.

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
