# Audit du lot « Fiches des notions d'exposition, de mesure et de boîtier »

État : constats non contre-vérifiés.

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire.
- Version auditée : copie de travail à la version 0.3.58 ; les seize fiches datent de la version 0.3.40 (11 novembre 2026), EXP-06 complétée le même jour (0.3.42).
- Auteurs : un agent de Claude, coupé par la limite d'usage le 13 novembre 2026 après FEX-12 ; un autre agent de Claude a repris le rapport le même jour (FEX-13 et suivants, compléments marqués « reprise », essais dans un navigateur). Un autre agent doit encore essayer de réfuter chaque constat.
- Reprise : les constats de la première passe sur toutes les fiches (`docs/audit/fiches.md`, constats FIC) qui portent sur ces huit notions ont été vérifiés un par un ; la correspondance est dans la section « Constats FIC repris ».
- Avancement : rapport fini pour ce qui pouvait être lu, calculé et essayé ici ; ce qui reste est dans la section « Ce qui n'est pas couvert », à la fin.
- Bilan : 19 constats (1 « faux », 2 « non sourcé », 4 « incohérent », 12 « à améliorer »), 58 points vérifiés et justes, 5 « Je ne sais pas ». Les explications disent ce que disent les sources relues (les deux articles sur lesquels s'appuie EXP-06 n'ont pas pu l'être), et tous les chiffres se recalculent avec le boîtier de départ. Les défauts sont dans les exercices et les sections « Simulateur » : un exercice injouable à la lettre (FEX-01), des résultats qui dépendent de réglages non écrits, dont l'ISO auto activé au départ et le boîtier choisi (FEX-02, FEX-06, FEX-13), un exercice qui ne dit ni où viser ni quoi conclure (FEX-05), et des écarts au référentiel ou au Z 6 qui ne sont pas dits (FEX-07, FEX-08, FEX-09, FEX-14).

## Périmètre

- Fiches : `content/fr/notions/` et `content/en/notions/`, notions EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08 et BOI-12 (seize fichiers).
- Lus pour les juger : `docs/contenus.md`, `docs/cadrage.md`, les notions dans `data/referentiel/` (`exp.yaml`, `mes.yaml`, `boi.yaml`), `data/sources.yaml`, `docs/camera-physique.md` (sections « Exposition », « Boîtier virtuel », « Indicateur d'équilibre », « Modes de déclenchement », « Modes d'exposition, correction et ISO auto », « Défis et bulletin »), et le code que les fiches décrivent : `app/src/camera/exposure.ts`, `exposureModes.ts`, `bodies.ts`, `noise.ts`, `bulletin.ts`, `sharpZone.ts`, `faces.ts` ; `app/src/ui/cameraPanel.ts`, `balance.ts`, `shutter.ts`, `challenges.ts` ; `app/src/i18n.ts` ; `app/src/scene.ts` ; `app/simulateur/index.html`.
- Hors du lot : les autres fiches (rapport `fiches-mise-au-point.md`) ; le modèle physique lui-même (`modele-physique.md`, constats PHY-01 à PHY-21, auxquels ce rapport renvoie sans les refaire).

## Méthode

1. Lecture des seize fiches, phrase par phrase, français et anglais côte à côte.
2. Relecture de chaque source citée à son adresse, le 13 novembre 2026, quand l'hôte répond ; chaque affirmation de fiche est cherchée dans le texte extrait de la page enregistrée.
3. Chaque chiffre et chaque exercice est rejoué avec le code du simulateur : `exposure.ts`, `exposureModes.ts` et `sharpZone.ts` compilés hors du dépôt (`tsc`), puis appelés par des scripts (`exercices.cjs`, `etat_depart.cjs`) ; le rapport signal sur bruit est recalculé d'après `balance.ts` et `noise.ts` (`bruit_exp06.py`).
4. Chaque réglage, libellé et bouton nommé par une fiche est cherché dans le code de l'interface.
5. Première rédaction (FEX-01 à FEX-12) : aucun navigateur ; ce que les fiches annoncent y est établi par le code et le calcul.

Pages enregistrées, textes extraits, scripts et leurs sorties : dossier `audit/fiches-exposition/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`, `*.out`). Rien n'y est gardé d'une session à l'autre : les preuves utiles sont recopiées ici.

### Reprise (13 novembre 2026)

1. Les trois modules compilés par la première rédaction sont recompilés depuis le code courant (fichiers identiques), et ses trois scripts relancés : mêmes sorties, au caractère près.
2. Citations des sources : 42 passages recherchés mot pour mot par un script dans les pages enregistrées par la première rédaction ; tous retrouvés.
3. Chaque constat FIC qui porte sur les huit notions est vérifié à nouveau (source relue, code relu, calcul refait) avant d'être repris.
4. Calculs nouveaux : traînée du chien et limite « figé » pour les six boîtiers (`boitiers.cjs`), zone nette de l'exercice de BOI-07 par ouverture (`boi07.cjs`).
5. Sources lues en plus : manuels de Canon et de Sony, pour les noms des modes (FEX-15).
6. Navigateur : site construit hors du dépôt depuis le code courant (`vite build`, même fichier que celui de la contre-vérification du modèle physique), ouvert dans Chromium sans écran (rendu logiciel, Playwright, fenêtre de 1280 × 800, densité 1, interface en français), script `essais.cjs` en quatre parties : A et C avec l'aperçu complet du viseur (état de départ, EXP-06, bouton qui clignote), B et D avec l'aperçu du bruit et de la profondeur de champ coupé, pour le temps de rendu (BOI-07, BOI-08, MES-10, boîtier APS-C, rafale). La photo garde toujours tous les effets. Cet essai n'émule ni un processeur graphique ni Safari. Les sorties de la première passe (`preuves-123.out`, `preuves-45678.out`, prises de la même façon) sont citées quand elles portent sur ces huit notions.

Scripts et sorties de la reprise : sous-dossier `reprise/` du même dossier du bloc-notes de la session.

## Sources

Toutes lues le 13 novembre 2026. Wikipedia est une source secondaire.

### Relues, citées par les fiches

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Wikipedia, « F-number », révision 1382682702 | adresse citée | `wiki-f-number-1382682702.html` |
| Wikipedia, « Shutter speed », révision 1382495283 | adresse citée | `wiki-shutter-speed-1382495283.html` |
| Wikipedia, « Film speed », révision 1383727213 | adresse citée | `wiki-film-speed-1383727213.html` |
| Nikon, manuel en ligne Z 7/Z 6 (en) : « The Mode Dial », « The ISO (ISO Sensitivity) Button », « The Exposure Compensation Button », « The Release Mode/Self-Timer Button », « ISO Sensitivity Settings », « Defaults », « Indicators and Error Messages » | adresses citées (`…/z7_z6/en/06_shooting_controls_01.html` à `_04.html`, `09_menu_guide_03_08.html`, `09_menu_guide_01.html`, `13_troubleshooting_02.html`) | `nikon-z6-en-*.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr) : « Sélecteur de mode », « Commande mode de déclenchement/retardateur » | adresses citées (`…/z7_z6/fr/06_shooting_controls_01.html`, `_04.html`) | `nikon-z6-fr-*.html` |
| Nikon, manuel en ligne D850, « Auto ISO Sensitivity Control » | adresse citée | `nikon-d850-10_iso_sensitivity_02.html` |

### Lues en plus, pour vérifier ou proposer une correction

| Source | Adresse | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, manuel en ligne Z 7/Z 6 (en) : « Specifications », « c2: Self-Timer », « d1: CL Mode Shooting Speed », « d2: Max. Continuous Release » | `https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html`, `…/09_menu_guide_05_c02.html`, `_d01.html`, `_d02.html` | `nikon-z6-en-14_technical_notes_06.html`, `nikon-z6-en-09_menu_guide_05_*.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr), pour les termes : « Commande ISO (sensibilité [ISO]) », « Commande correction d'exposition », « Réglage de la sensibilité », « Indicateurs et messages d'erreur » | `https://onlinemanual.nikonimglib.com/z7_z6/fr/06_shooting_controls_02.html`, `_03.html`, `09_menu_guide_03_08.html`, `13_troubleshooting_02.html` | `nikon-z6-fr-*.html` |
| William J. Claff, PhotonsToPhotos, « Input-referred Read Noise versus ISO Setting » (« Last revised: 2026-08-17 ») | `https://www.photonstophotos.net/Charts/RN_e.htm` | `ptp-RN_e.htm` |
| Canon, manuel en ligne de l'EOS 850D (en et fr ; page sans date) : « Shutter-Priority AE Mode (Tv) », « Aperture-Priority AE Mode (Av) », « Drive Mode » ; « Mode d'exposition automatique avec priorité à l'obturation (Tv) », « … avec priorité à l'ouverture (Av) », « Mode d'acquisition ». Boîtier voisin, pas un boîtier du simulateur | `https://cam.start.canon/en/C002/manual/html/UG-03_CustomShooting_0030.html`, `…_0040.html`, `UG-04_AF-Drive_0060.html` ; mêmes pages sous `…/fr/C002/…` | `reprise/pages/canon-850d-*.html` |
| Sony, guide d'aide ILCE-7M3 (A7 III), en et fr, en un fichier (« Copyright 2018 Sony Corporation ») : « Drive Mode », « Entraînement », liste des modes de prise de vue | `https://helpguide.sony.net/ilc/1720/v1/en/print.pdf`, `https://helpguide.sony.net/ilc/1720/v1/fr/print.pdf` | `reprise/pages/sony-ilce-7m3-en-print.pdf`, `…-fr-print.pdf` |

### Non relues

| Source | Raison |
| --- | --- |
| Richard Butler, « What is ISO invariance, and should I care? », DPReview (`https://www.dpreview.com/articles/iso-invar/`) | L'hôte répond 403 avec une page « Just a moment... Enable JavaScript and cookies to continue » (contrôle contre les lectures automatiques), essayé deux fois le 13 novembre 2026, et une troisième fois à la reprise. Seule lecture : le relevé de Julien du 11 novembre 2026, qui n'est pas dans le dépôt. |
| Spencer Cox, « ISO Invariance Explained », Photography Life (`https://photographylife.com/iso-invariance-explained`) | L'hôte répond 403 avec une page « Security Check […] Please solve the Captcha below to continue », essayé deux fois le 13 novembre 2026, et une troisième fois à la reprise. Seule lecture : le relevé de Julien du 11 novembre 2026, qui n'est pas dans le dépôt. |

## Constats

Classés du plus grave au moins grave (« faux », « non sourcé », « incohérent », « à améliorer »), puis par numéro : les identifiants ne se suivent donc pas. Ceux qui portent « (reprise) » dans leur titre ont été écrits à la reprise ; les ajouts faits à la reprise dans les autres commencent par « Reprise ».

### FEX-01 · faux · EXP-04, exercice : aucune vitesse ne « met la cellule à 0 », et f/4 ne donne pas « +1 IL »

- Endroit : `content/fr/notions/EXP-04.md`, l. 17 ; `content/en/notions/EXP-04.md`, l. 17. Même défaut, moindre, dans `content/fr/notions/EXP-05.md` et `content/en/notions/EXP-05.md`, l. 15.
- Ce qui est écrit : « En mode M, sans ISO auto, règle f/5.6 et une vitesse qui met la cellule à 0. Trouve l'ouverture qui donne +1 IL sans toucher à la vitesse ni à l'ISO. Réponse : f/4 » ; en anglais : « a shutter speed that puts the meter at 0 […] the aperture that gives +1 EV ». Dans EXP-05 : « passe à f/8 : la cellule descend de deux crans (−2 IL) ».
- Preuve (code) : la scène vaut 12,5 IL (`app/src/camera/exposure.ts`, l. 38 : `SCENE_EV100 = 12.5`) et les trois échelles vont par tiers d'IL. En indices, l'écart vaut (49,5 − (a + s − i)) / 3 (`app/src/camera/exposureModes.ts`, l. 30-32) : a + s − i est entier, donc l'écart n'est jamais nul, il vaut au mieux ±1/6 IL. La cellule écrit une décimale (`app/src/ui/cameraPanel.ts`, l. 741-744) : « −0,2 IL » ou « +0,2 IL ».
- Preuve (calcul, `exercices.cjs`) : sur les 24 700 combinaisons d'ouverture, de vitesse et d'ISO en mode M sans ISO auto, le plus petit écart est 0,1667 IL, affiché « 0,2 » ; il en va de même avec toutes les corrections d'exposition. Pour l'exercice :

  | Réglages (M, ISO 100, sans ISO auto) | Cellule |
  | --- | --- |
  | f/5.6, 1/160 s | +0,2 IL |
  | f/5.6, 1/200 s | −0,2 IL |
  | f/4, 1/160 s | +1,2 IL |
  | f/4, 1/200 s | +0,8 IL |
  | f/4, 1/400 s (EXP-05) | −0,2 IL |
  | f/8, 1/400 s (EXP-05) | −2,2 IL |
  | f/8, 1/100 s (EXP-05) | −0,2 IL |

- Ce qui est juste : f/4 est bien un IL au-dessus de f/5.6, et 1/100 s ramène bien l'exposition de f/4 et 1/400 s. Le reste du dépôt le dit déjà correctement : « à −1/6 IL de la scène » (`exposure.ts`, l. 79), « ISO 250 donne −1/6 IL, ISO 320 donne +1/6 IL » (fiche EXP-06), « d'environ −0,2 IL à +0,8 IL » (fiche MES-04).
- Conséquence : le débutant cherche un « 0 » qui n'existe pas (deux vitesses sont à égalité, 1/160 s et 1/200 s), puis un « +1 » qui n'existe pas non plus.
- Correction proposée : EXP-04, « règle f/5.6 et 1/200 s : la cellule affiche −0,2 IL, le plus près de 0 que la scène permet (elle vaut 12,5 IL, entre deux crans). Trouve l'ouverture qui donne un IL de plus sans toucher à la vitesse ni à l'ISO. Réponse : f/4, la cellule affiche +0,8 IL » ; EXP-05, « la cellule descend de deux IL, de −0,2 à −2,2 IL ». Même chose en anglais.
- Reprise, mesure dans un navigateur (sortie `preuves-123.out` de la première passe, interface en français) : à f/5,6 et ISO 100, sans ISO auto, la cellule écrit « M · +0,5 IL » à 1/125 s, « M · +0,2 IL » à 1/160 s, « M · −0,2 IL » à 1/200 s, « M · −0,5 IL » à 1/250 s ; à f/4, « M · +0,8 IL » à 1/200 s et « M · +1,2 IL » à 1/160 s ; pour EXP-05, « M · −0,2 IL », « M · −2,2 IL », « M · −0,2 IL ». Ce sont les valeurs du tableau.
- Reprise, réalisme (repris de FIC-01, vérifié) : l'indicateur du Z 6 a une position « exposition optimale » et se lit par tiers ou demi-IL. Manuel, « The Mode Dial », encadré « Exposure Indicators » : « Depending on the option chosen for Custom Setting b1 (EV steps for exposure cntrl), the amount of under- or overexposure is shown in increments of 1/3 or 1/2 EV », avec les exemples « Optimal exposure », « Underexposed by 1/3 EV », « Overexposed by over 3 EV » (`https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_01.html`, lu le 13 novembre 2026, fichier `nikon-z6-en-06_shooting_controls_01.html`). Dans TutoPhoto, l'indicateur écrit des dixièmes d'IL et aucun réglage manuel n'atteint 0, parce que la scène est placée à un demi-tiers de tous les crans (`exposure.ts`, l. 38 ; `exposureModes.ts`, l. 26-28). Je ne sais pas ce qu'un Z 6 affiche pour un écart de 1/6 IL : le manuel ne le dit pas. À la racine, deux options qui relèvent du modèle physique et de Julien : placer la scène sur un cran (12⅓ ou 12⅔ IL), ou graduer l'indicateur par tiers comme le Z 6. L'une ou l'autre rendrait l'exercice jouable tel qu'il est écrit, mais change la vue de départ, des exemples de `docs/camera-physique.md` et des contrôles de la routine.

**Contre-vérification : confirmé.** Recalcul indépendant (formules de `exposure.ts` et de `exposureModes.ts` réécrites en Python, script `fex01.py`) : sur les 24 700 combinaisons, le plus petit écart est 0,1667 IL, avec ou sans correction, et les lignes du tableau sont retrouvées ; f/4,5 à 1/160 s affiche aussi +0,8 IL, si bien qu'en partant de 1/160 s « +1 IL » se lit autant à f/4,5 qu'à f/4. Gravité à ramener à « incohérent » : la réponse (f/4) et la leçon sont justes, et sur l'échelle graduée l'aiguille est à 1/6 IL du repère « 0 », soit 2,8 % de la largeur de l'échelle ; c'est le texte du bouton (« −0,2 IL ») que la fiche contredit, alors que MES-04 et EXP-06 écrivent les bonnes valeurs. La correction des deux fiches est juste et suffit. Les deux options « à la racine » ne sont pas nécessaires à ce constat : déplacer la scène ou regraduer l'indicateur pour deux phrases d'exercice toucherait la vue de départ, la documentation et la routine ; à décider avec la mesure de la lumière, qui est dans la file de travail, pas ici.

### FEX-04 · non sourcé · BOI-12 : les délais du retardateur ne sont pas dans les pages citées ; la cadence de 12 vues par seconde est donnée sans sa condition

- Endroit : `content/fr/notions/BOI-12.md`, l. 5 à 9 ; `content/en/notions/BOI-12.md`, l. 5 à 9.
- Ce qui est écrit : la liste est introduite par la seule page « The Release Mode/Self-Timer Button » ; « Retardateur : 2, 5, 10 ou 20 s (10 par défaut, « Defaults ») » ; « Continu L : de 1 à 5 vues par seconde […] (3 par défaut) » ; « Continu H (étendu) : 12 vues par seconde au Z 6 ».
- Preuve (sources relues) :
  - délais : la page « The Release Mode/Self-Timer Button » dit seulement « Rotate the sub-command dial to select the shutter-release delay » ; « Defaults » ne donne que « Self-timer delay 10 s » ; « c2: Self-Timer » dit « Choose the length of the shutter-release delay », sans valeurs. Les quatre valeurs sont dans « Specifications », que la fiche ne cite pas : « Self-timer : 2 s, 5 s, 10 s, 20 s; 1–9 exposures at intervals of 0.5, 1, 2, or 3 s » (`https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html`). `docs/camera-physique.md`, l. 431, le dit bien : « (fiche technique) » ;
  - « 3 par défaut » : absent de la page citée en tête de liste ; il est dans « Defaults » (« d1 CL mode shooting speed 3 fps »), citée deux lignes plus bas pour le seul retardateur ;
  - 12 vues par seconde : la page écrit « up to about 9 frames per second (Z 7) or 12 frames per second (Z 6) », et son tableau « Frame Advance Rate » donne pour le Z 6, en Continu H (étendu), 12 vps en JPEG/TIFF et en NEF 12 bits, 9 vps en NEF 14 bits (8 vps en mode silencieux). La fiche garde « jusqu'à environ » pour Continu H et l'enlève pour Continu H (étendu).
- Correction proposée : rattacher « 3 par défaut » et « 10 par défaut » à « Defaults », les délais à « Specifications » (source `nikon-z6-specifications`, à compléter dans `data/sources.yaml` avec les deux fiches dans `used_in`), et écrire « **Continu H (étendu)** : jusqu'à environ 12 vues par seconde au Z 6 (9 en NEF 14 bits) ». Même chose en anglais.

**Contre-vérification : confirmé.** Pages relues le 13 novembre 2026 : « The Release Mode/Self-Timer Button » et « c2: Self-Timer » ne donnent aucun délai, « Defaults » donne « Self-timer delay 10 s » et « d1 CL mode shooting speed 3 fps », « Specifications » donne « Self-timer 2 s, 5 s, 10 s, 20 s » ; tableau « Frame Advance Rate » relu cellule par cellule : Z 6, Continu H (étendu), 12 vps en JPEG/TIFF et en NEF 12 bits, 9 vps en NEF 14 bits (8 en mode silencieux). Gravité à ramener à « à améliorer » : toutes les valeurs de la fiche sont justes, et le dépôt les source déjà (`docs/camera-physique.md`, l. 431 : « (fiche technique) » ; entrée `nikon-z6-specifications` de `data/sources.yaml`) ; il manque un lien dans la fiche et une condition, pas une source. « Specifications » écrit d'ailleurs « High-speed continuous (extended) : 12 fps (14-bit NEF/RAW: 9 fps) », sous « Approximate maximum frame advance rate ». Correction proposée juste : un lien vers « Specifications » pour les délais (avec les deux fiches dans `used_in`), « Defaults » rattachée aux deux valeurs par défaut, « jusqu'à environ » devant 12.

### FEX-14 · non sourcé · MES-10, « Simulateur » : « sa règle n'est pas publiée », une vitesse minimale de départ qui n'est pas celle du Z 6, et une règle prêtée au seul D850 (reprise ; repris de FIC-06, complété)

- Endroit : `content/fr/notions/MES-10.md`, l. 13 ; `content/en/notions/MES-10.md`, l. 13.
- Ce qui est écrit : « Deux règles viennent du manuel du Nikon D850, celui du Z 6 ne les donnant pas : l'ISO auto descend jusqu'à ISO 100, et en mode A il ne monte que si la vitesse passerait sous la vitesse minimale […]. L'option « Automatique » de la vitesse minimale n'est pas simulée : sa règle n'est pas publiée. »
- Preuve (source, page citée par la fiche, relue le 13 novembre 2026, fichier `nikon-z6-en-09_menu_guide_03_08.html`) :
  1. « sa règle n'est pas publiée » : la fiche ne peut pas affirmer qu'une règle n'est publiée nulle part ; seules les pages lues comptent (`CLAUDE.md` : « Information invérifiable : « Je ne sais pas » »). Et la page en dit plus que la fiche : « If Auto is selected for Auto ISO sensitivity control > Minimum shutter speed, the camera will choose the minimum shutter speed based on the focal length of the lens. For example, the camera will automatically select fast minimum shutter speeds to reduce the blur that commonly occurs with telephoto lenses. »
  2. Réglage de départ : sur le Z 6, la vitesse minimale est sur « Auto » (« Defaults » : « Minimum shutter speed : Auto », fichier `nikon-z6-en-09_menu_guide_01.html`). TutoPhoto part de 1/30 s (`app/src/ui/cameraPanel.ts`, l. 93-100 ; mesuré dans un navigateur, état de départ : « vitesse minimale 1/30 s »). Cette valeur vient du manuel du D850, pour un cas que TutoPhoto transpose : « if a non-CPU lens is used without lens data, minimum shutter speed is fixed at 1/30 s ». La fiche dit que l'ISO auto est activé comme sur le Z 6, mais pas que sa vitesse minimale de départ n'est pas celle du Z 6. Le même écart vaut pour la sensibilité maximale : 51 200 par défaut sur le Z 6 (« Defaults »), 6400 dans TutoPhoto, haut de son échelle (FEX-03).
  3. « celui du Z 6 ne les donnant pas » : pour la seconde règle, la page du Z 6 la donne en substance, et la fiche la reprend elle-même à la l. 7 : « Minimum shutter speed: Choose the shutter speed below which auto ISO sensitivity control will kick in to prevent underexposure in modes P and A ». Ce que le manuel du D850 ajoute est le mot « only » (« sensitivity will only be adjusted if underexposure would result at the shutter speed selected for Minimum shutter speed »), et ce que le code en tire est dit plus juste dans `app/src/camera/exposureModes.ts`, l. 15 : le manuel du Z 6 ne dit pas « s'il baisse la sensibilité en A ».
- Correction proposée : « Une règle vient du manuel du Nikon D850, celui du Z 6 ne la donnant pas : l'ISO auto descend jusqu'à la sensibilité la plus basse du boîtier (ISO 64 sur le D850, ISO 100 ici). Le manuel du D850 précise aussi qu'en mode A la sensibilité n'est modifiée que si la vitesse passerait sous la vitesse minimale. Sur le Z 6, la vitesse minimale est réglée au départ sur « Automatique » : l'appareil la choisit d'après la focale, plus rapide au téléobjectif ; le manuel ne donne pas la règle, et TutoPhoto ne la simule pas. Il part de 1/30 s, valeur que le manuel du D850 fixe quand « Automatique » ne peut pas fonctionner. » Même chose en anglais. Le point 4 de FEX-12 est repris dans cette phrase.

**Contre-vérification : confirmé.** Pages relues le 13 novembre 2026 : la page du Z 6 dit bien « the camera will choose the minimum shutter speed based on the focal length of the lens », sans règle chiffrée, et « Minimum shutter speed : Auto » dans « Defaults » ; la phrase de la l. 7 de la fiche vient de la page du Z 6, donc « celui du Z 6 ne les donnant pas » est inexact pour la seconde règle, et la fiche se contredit. Gravité à ramener à « à améliorer » : rien n'est sans source ; ce sont trois formulations plus larges que les pages lues, et `exposureModes.ts` (l. 15-18) comme `docs/camera-physique.md` (l. 485 et 489) disent déjà les choses justement. Correction à corriger sur un point : « la sensibilité la plus basse du boîtier » va plus loin que la source, le D850 descendant sous ISO 64 en réglages étendus (« Settings of from about 0.3 to 1 EV below ISO 64 […] are also available », manuel du D850, « Manual Adjustment », `https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_01.html`, lu le 13 novembre 2026) ; écrire « jusqu'au bas de la plage normale (ISO 64 sur le D850, ISO 100 sur le Z 6 et ici) ».

### FEX-02 · incohérent · EXP-04, EXP-05, EXP-06, « Simulateur » : ce qui est décrit ne vaut qu'avec l'ISO auto désactivé, or il est activé au départ

- Endroit : `content/fr/notions/EXP-04.md`, l. 13 ; `EXP-05.md`, l. 11 ; `EXP-06.md`, l. 19 ; mêmes lignes en anglais.
- Ce qui est écrit : « La cellule et l'aperçu du viseur montrent tout de suite l'effet sur l'exposition » (EXP-04) ; « La cellule montre l'effet sur l'exposition » (EXP-05) ; « La molette « ISO » va de 100 à 6400 par tiers de cran » (EXP-06). Les exercices disent « sans ISO auto », sans dire qu'il est activé au départ ni où le désactiver.
- Preuve (code) : `app/src/ui/cameraPanel.ts`, l. 247, `private autoIso = true;` (« activé par défaut sur le Z 6 », l. 246) ; l. 243, mode M au départ. En M avec l'ISO auto, la sensibilité est recalculée pour l'exposition visée (`exposureModes.ts`, l. 92). La molette s'appelle alors « ISO auto » (`cameraPanel.ts`, l. 719) et affiche la valeur retenue, pas la valeur choisie (l. 722).
- Preuve (calcul, `etat_depart.cjs`), depuis l'état de départ (M, f/8, 1/100 s, ISO 100, ISO auto activé, maximum 6400) :

  | Geste | Réglages retenus | Cellule |
  | --- | --- | --- |
  | départ | f/8, 1/100 s, ISO 100 | M · −0,2 IL |
  | fermer à f/11 | ISO 200 | M · −0,2 IL |
  | fermer à f/22 | ISO 800 | M · −0,2 IL |
  | ouvrir à f/5.6 | ISO 100 | M · +0,8 IL |
  | raccourcir à 1/200 s | ISO 200 | M · −0,2 IL |
  | raccourcir à 1/4000 s | ISO 4000 | M · −0,2 IL |
  | allonger à 1/50 s | ISO 100 | M · +0,8 IL |
  | boutons « + » de la molette « ISO auto », valeur choisie 200, 800 ou 6400 | ISO 100 | M · −0,2 IL |

- Reprise, mesure dans un navigateur (`essais.cjs`, partie A, stockage du navigateur vide) : à l'ouverture, la cellule écrit « M · −0,2 IL », les molettes « Ouverture f/8 », « Vitesse 1/100 s », « ISO auto 100 », et la fenêtre « Exposition » a « ISO auto activé ; sensibilité maximale ISO 6400 ; vitesse minimale 1/30 s ». En fermant à f/11, f/16 puis f/22, la cellule reste à « M · −0,2 IL » et la molette passe à « ISO auto 200 », « 400 », « 800 » ; à f/5,6, « M · +0,8 IL » et « ISO auto 100 » ; à 1/200 s, 1/1000 s et 1/4000 s, « M · −0,2 IL » et « ISO auto 200 », « 1000 », « 4000 ». Ce sont les lignes du tableau. Trois appuis sur le « + » de la molette ISO : la molette affiche toujours « ISO auto 100 », la cellule ne bouge pas, et seule la bulle de la valeur change (« valeur choisie : 125 », puis 160, puis 200).
- Conséquence : dans l'état où le simulateur s'ouvre, fermer le diaphragme ou raccourcir la pose ne fait bouger ni la cellule ni la luminosité du viseur (l'ISO monte à la place, jusqu'à 6400), et les boutons de la molette ISO ne changent pas la valeur affichée. Le débutant qui lit « montrent tout de suite l'effet » voit le contraire une fois sur deux. Le comportement lui-même est celui que la documentation annonce (`docs/camera-physique.md`, l. 489-492) ; ce sont les fiches qui ne le disent pas.
- Correction proposée : en tête de la section « Simulateur » des trois fiches, une phrase : « Au départ, l'ISO auto est activé, comme sur le Z 6 : l'appareil rattrape tes réglages en changeant la sensibilité. Désactive-le dans la fenêtre « Exposition » (touche l'indicateur d'exposition, voir MES-10) pour voir l'effet de chaque réglage seul. » ; dans EXP-06, préciser que la molette s'appelle « ISO auto » tant qu'il est activé. Même chose en anglais. Changer l'état de départ du simulateur est une autre option, qui relève de Julien.

### FEX-03 · incohérent · EXP-06, « Simulateur » : « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit »

- Endroit : `content/fr/notions/EXP-06.md`, l. 19 ; `content/en/notions/EXP-06.md`, l. 19 (« TutoPhoto stops where its noise measurements stop »).
- Preuve (source) : la page de Claff d'où viennent les mesures (`https://www.photonstophotos.net/Charts/RN_e.htm`, « Last revised: 2026-08-17 », fichier `ptp-RN_e.htm`) a des points au-delà d'ISO 6400 pour les six boîtiers. Série `Nikon Z 6_14` : 35 points, de ISO 50 à ISO 204 800, dont 13 au-dessus d'ISO 6400 ; les six premiers (ISO 8 045 à 25 600) sont en symboles pleins, dans la plage analogique (1,16 ; 1,13 ; 1,15 ; 0,95 ; 0,95 ; 0,97 électron). Sous-titre du graphique : « Open symbols indicate values outside the normal analog range ». Sony A7 III : 15 points au-dessus d'ISO 6400 ; Canon EOS RP : 10 ; Nikon D5600 et Sony A6000 : 6 ; Canon EOS 2000D : 1 (script `claff_z6.py`).
- Preuve (dépôt) : ce sont les séries recopiées dans `app/src/camera/bodies.ts` qui s'arrêtent à ISO 6400, parce que l'échelle du boîtier virtuel s'y arrête, et non l'inverse. `docs/camera-physique.md`, l. 101 : « Ces plages sont communes aux six boîtiers ; leurs plages réelles, souvent plus larges, viendront avec l'étape du bruit » ; `docs/questions-ouvertes.md`, l. 54 : « Extension des ISO au-delà de 6400 à décider ».
- Correction proposée : « (le Z 6 va jusqu'à ISO 51 200, et plus haut en réglages étendus ; TutoPhoto s'arrête à 6400, limite choisie pour ses six boîtiers et pas encore étendue) » ; en anglais : « (the Z 6 goes up to ISO 51200, and higher with extended settings; TutoPhoto stops at 6400, a limit chosen for its six bodies and not yet extended) ». La plage du Z 6 est dans la page déjà citée par la fiche : « in the case of the Z 6, of from ISO 100 to ISO 51200 ».

### FEX-08 · incohérent · Brique « simulateur » et explication : écarts au référentiel que les fiches ne disent pas

- Endroit : sections « Simulateur » de `EXP-04.md`, `EXP-05.md`, `EXP-06.md`, `MES-10.md`, `BOI-07.md` ; explication de `BOI-12.md` ; `MES-10.md`, l. 7 ; `EXP-06.md`, l. 7 ; français et anglais.
- Preuve : `data/referentiel/` (champ `spec.simulator` ou `spec.explanation`) contre le code décrit par la fiche.

  | Notion | Référentiel | Ce qui existe | La fiche le dit-elle ? |
  | --- | --- | --- | --- |
  | EXP-04 | « Diaphragme animé lié à l'image » | molette, cellule, aperçu, vue de dessus ; aucun diaphragme dessiné | non |
  | EXP-05 | « Rideau animé, durée visualisée » | molette, cellule, traînée en pixels ; aucun rideau | non |
  | EXP-06 | « Même lumière captée, ISO variable : la luminosité change, le rapport signal/bruit presque pas » | le simulateur le fait en M sans ISO auto (FEX-05) | non : ni la section, ni l'exercice ne l'annoncent |
  | MES-10 | « Menu ISO auto, l'appareil explique son choix » | la molette montre la valeur retenue ; une bulle donne « valeur choisie » (`cameraPanel.ts`, l. 725-726) ; aucune explication | non |
  | BOI-07 | « Alerte de vitesse trop lente » | aucune alerte ; le bougé n'est pas simulé | à moitié : « TutoPhoto ne peut pas juger le « sans bougé » », dans l'exercice |
  | BOI-12 | explication : « Vue par vue, rafale, silencieux, retardateur » | le mode silencieux n'est pas expliqué ; il est cité une fois, dans « Non simulés » | non |
  | MES-10, EXP-06 | la fiche cite le mode P (« en modes P et A », « P, S, A ») | pas de mode P (`cameraPanel.ts`, l. 90 : `["M", "A", "S"]`) | non ; seule l'interface le dit (`exposureNote`, « Non simulés : le mode P ») |

- Ce qui est juste : pour les exercices, les fiches disent chaque fois l'écart (« La fiche du référentiel propose […], l'exercice est adapté »). BOI-08 (« Ouverture qui atteint sa limite et clignote ») et BOI-12 (« Rafale qui produit une série à trier ») font ce que le référentiel demande.
- Conséquence : `scripts/coverage.py` compte la brique « simulateur » dès que la section existe (limite connue de `docs/contenus.md`) ; ces cinq notions sont comptées couvertes alors que le simulateur demandé n'existe pas.
- Correction proposée : dans chaque section « Simulateur », une phrase sur le modèle de celle des exercices (« La fiche du référentiel prévoit un diaphragme animé ; TutoPhoto ne le dessine pas encore »), et « le mode P n'est pas simulé » dans MES-10. Ou changer le référentiel, par une proposition : Julien tranche.

### FEX-16 · incohérent · Les fiches françaises écrivent « f/5.6 », l'interface française « f/5,6 » (reprise ; repris de FIC-09, troisième point)

- Endroit : `content/fr/notions/EXP-04.md`, l. 7, 13 et 17 (« f/1.4 », « f/2.8 », « f/5.6 », « f/3.2 », « f/3.5 ») ; `content/fr/notions/BOI-08.md`, l. 9 et 13 (« f/1.4 »). Hors du lot, même écriture dans `MAP-06.md`, `NET-01.md` et `SIT-06.md`.
- Preuve (code) : en français, l'interface remplace le point par une virgule dans les ouvertures (`app/src/ui/cameraPanel.ts`, l. 695-699 : `decimal`, puis `` `f/${decimal(apertureLabel(settings.aperture))}` ``). Mesuré dans un navigateur : la molette affiche « f/5,6 » et « f/2,5 », et la légende de la photo « S · f/2,5 · 1/1000 s » (sorties `preuves-123.out` et `preuves-45678.out`).
- Dans la même phrase, la fiche EXP-04 écrit « f/5.6 » et « (5,6 / 4)² ≈ 1,96 » (l. 17).
- Preuve (sources) : le manuel français de Canon écrit la virgule, « (Avec un nombre-f d'ouverture faible : f/5,6) » (EOS 850D, « Mode d'exposition automatique avec priorité à l'ouverture (Av) », lu le 13 novembre 2026). Les pages françaises du manuel du Z 6 lues pour l'audit n'ont qu'une ouverture, sans décimale (« f/25 »). Je ne sais pas ce qu'affichent l'écran d'un boîtier réglé en français ni la bague d'un objectif : aucune page lue ne le montre.
- Correction proposée : une seule écriture en français, la même dans les fiches et dans l'interface. Le plus court est d'aligner les fiches sur l'interface (virgule), comme le manuel français de Canon ; l'inverse demande une source pour ce qu'affiche un boîtier. Julien tranche.

### FEX-05 · à améliorer · EXP-06, exercice : la comparaison demandée à ISO 6400 se fait à +4,5 IL, et le résultat attendu n'est pas dit

- Endroit : `content/fr/notions/EXP-06.md`, l. 23 ; `content/en/notions/EXP-06.md`, l. 23.
- Ce qui est écrit : « En mode M, sans ISO auto, impose f/4 et 1/1000 s. […] Compare le bruit au point visé à ISO 320 et à ISO 6400. »
- Preuve (calcul, `exercices.cjs`) : à f/4, 1/1000 s et ISO 6400, l'écart vaut +4,5 IL ; la photo reçoit 2^4,5 ≈ 22,6 fois l'exposition correcte.
- Preuve (code) : l'indicateur d'équilibre écrit « hautes lumières écrêtées au point visé » dès que la valeur lue atteint 0,99 (`app/src/ui/balance.ts`, l. 179-181), et le bulletin n'a alors pas de ligne de bruit. À +4,5 IL, c'est le cas de tout point plus clair que 0,99 / 22,6 ≈ 0,044, soit 0,42 fois la valeur moyenne de la scène (0,104 ; `docs/camera-physique.md`, l. 188).
- Preuve (calcul, `bruit_exp06.py`, formules de `balance.ts`, l. 183-191, et de `noise.ts`, Nikon Z 6, photo de 1500 px) :

  | Point visé (valeur à l'exposition correcte) | ISO 320, f/4, 1/1000 s | ISO 6400, f/4, 1/1000 s | ISO 6400, f/9, 1/4000 s |
  | --- | --- | --- | --- |
  | ton moyen (0,104) | 158:1, excellent | hautes lumières écrêtées | 35:1, acceptable |
  | ombre (0,03) | 84:1, excellent | 85:1, excellent | 19:1, acceptable |
  | ombre profonde (0,01) | 47:1, excellent | 49:1, excellent | 10:1, acceptable |

- Conséquence : tel qu'écrit, l'exercice donne une photo brûlée et, selon le point visé, soit « hautes lumières écrêtées », soit le même rapport signal sur bruit qu'à ISO 320 (même lumière captée : 888 électrons dans les deux cas pour l'ombre à 0,03). Le débutant qui vient de lire « plus l'image risque d'être affectée par le bruit » attend l'inverse, et la fiche ne dit ni ce qu'il doit voir ni pourquoi. La leçon du référentiel (« Même lumière captée, ISO variable : la luminosité change, le rapport signal/bruit presque pas », `data/referentiel/exp.yaml`, EXP-06) est pourtant celle que ces chiffres montrent ; la leçon de l'explication (« le bruit vient surtout du manque de lumière ») demande, elle, une exposition égale.
- Reprise, mesure dans un navigateur (`essais.cjs`, partie A : Nikon Z 6, mode M sans ISO auto, f/4, 1/1000 s, aperçu complet, point visé de départ, c'est-à-dire le centre du cadre, sans rien toucher) :

  | Réglage, dans l'ordre | Cellule | Ligne du bruit de l'indicateur d'équilibre |
  | --- | --- | --- |
  | ISO 100 | M · −1,5 IL | bruit excellent (signal/bruit 93:1) |
  | ISO 250 | M · −0,2 IL | bruit excellent (signal/bruit 92:1) |
  | ISO 320 | M · +0,2 IL | bruit excellent (signal/bruit 377:1) |
  | ISO 6400 | M · +4,5 IL | hautes lumières écrêtées au point visé |
  | retour à ISO 320 | M · +0,2 IL | bruit acceptable (signal/bruit 23:1) |
  | retour à ISO 6400 | M · +4,5 IL | bruit excellent (signal/bruit 71:1) |

  Photo à ISO 6400, f/4 et 1/1000 s : le bulletin écrit « Exposition : +4,5 IL » et « Bruit au point visé, lu dans le viseur au déclenchement : excellent (signal/bruit 74:1) ». À ISO 6400, f/9 et 1/4000 s (+0,2 IL) : « bruit acceptable (signal/bruit 39:1) ». Huit lectures de suite, toutes les 2 s, sans rien changer (ISO 320, f/4, 1/1000 s) : 297, 161, 130, 292, 240, 379, 395 et 408:1.
- Reprise, cause de ces écarts (même script, partie C, état de départ, six lectures en 9 s : 116, 67, 39, 97, 523 et 607:1, la troisième classée « acceptable » à ISO 100) : le point visé de départ, au centre du cadre, tombe sur le bord du buste de Sophia, et les personnages bougent sur place. Les captures du viseur prises à chaque lecture le montrent : repère sur le fond sombre, à côté d'elle, à la lecture de 39:1 ; repère sur son haut blanc à celle de 607:1. Le rapport signal sur bruit dépend de la luminosité du point visé, ce qui est juste ; la fiche ne le dit pas, et elle ne dit pas où viser.
- Reprise, conséquence : au point de départ, la comparaison demandée ne montre rien, ou montre l'inverse de la leçon (23:1 à ISO 320, puis 71:1 à ISO 6400, dans la mesure ci-dessus). Sur un point immobile choisi exprès, les valeurs sont stables et disent ce que dit le tableau du calcul. Sortie `preuves-123.out` de la première passe (aperçu du bruit et de la profondeur de champ coupés, point touché) : buste de Dennis, 336:1 à ISO 250, 335:1 à ISO 320, « hautes lumières écrêtées » à ISO 6400 ; arbres du fond, 137:1, 137:1, puis « hautes lumières écrêtées » ; à exposition égale (ISO 6400, f/9, 1/4000 s), 75:1 sur le buste de Dennis.
- Reprise, réponse de l'exercice : « Trouve l'ISO le plus bas qui expose correctement » n'a pas de réponse écrite, à la différence des exercices de EXP-04 et de EXP-05. ISO 250 et ISO 320 sont à égale distance (−1/6 et +1/6 IL) ; le plus bas est ISO 250, celui que l'appareil retient lui-même à égalité (`exposureModes.ts`, l. 26-28), mais la fiche fait ensuite comparer à ISO 320.
- Correction proposée : écrire la réponse (« ISO 250, à −1/6 IL »), dire où viser (« touche un point immobile et sombre, par exemple la poubelle » : la première passe y a lu 75:1 et 85:1 à ISO 250, puis 80:1 à ISO 6400, sans écrêtage, sortie `preuves-123.out`), puis remplacer la dernière phrase par deux comparaisons annoncées. (1) « Passe à ISO 6400 sans rien changer d'autre : la photo est surexposée de 4,5 IL ; vise une ombre : le rapport signal sur bruit ne bouge presque pas, la lumière captée est la même. » (2) « Garde ISO 6400 et reviens à une exposition correcte, à 1/4000 s et f/9 : le capteur reçoit vingt fois moins de lumière qu'à ISO 320, et le rapport signal sur bruit est divisé par environ 4,5 (√20). » Le point visé de départ ne convient pas (mesure de la reprise, plus haut) ; les valeurs à écrire dans la fiche sont à relever sur le point retenu, dans un navigateur avec processeur graphique.

### FEX-06 · à améliorer · Exercices : le résultat annoncé dépend de réglages que la fiche ne donne pas

- Endroit : `content/fr/notions/MES-04.md`, l. 13 ; `MES-10.md`, l. 17 ; `BOI-08.md`, l. 13 ; `BOI-12.md`, l. 17 ; mêmes lignes en anglais.
- Preuve (code) : le mode, la correction, l'ISO auto, la sensibilité maximale et la vitesse minimale sont gardés d'une visite à l'autre (`app/src/ui/cameraPanel.ts`, l. 1116-1133 et 1104-1110) ; les molettes repartent de f/8, 1/100 s et ISO 100, mais gardent leur valeur tant que la page reste ouverte. Un exercice hérite donc de ce que le précédent a laissé.
- Preuve (calcul, `etat_depart.cjs` et `exercices.cjs`) :

  | Exercice | Résultat annoncé | Condition non écrite | Sinon |
  | --- | --- | --- | --- |
  | MES-04, « En mode A à f/8 » | 1/100 s, puis 1/50 s avec +1 IL | ISO 100 ; ISO auto désactivé, ou vitesse minimale à 1/50 s ou plus lente | ISO 320 choisi : 1/320 s, puis 1/160 s. Après l'exercice de MES-10 (vitesse minimale 1/1000 s) : 1/1000 s à ISO 1000, puis 1/1000 s à ISO 2000 |
  | MES-04, fin de l'exercice | rien | la correction de +1 IL reste réglée, et mémorisée | l'exercice de MES-10 donne ensuite ISO 2000, pas ISO 1000 |
  | MES-10, « environ ISO 1000 et 1/1000 s » | ISO 1000 et 1/1000 s (exactement, à −0,2 IL) | sensibilité choisie de 1000 au plus, correction à ±0 | ISO 3200 choisi : 1/3200 s à ISO 3200 |
  | BOI-08, « 1/4000 s sans ISO auto : l'ouverture clignote à f/1.4 » | clignote, −0,5 IL | ISO 100 | ISO 125 : f/1.4 sans clignoter ; ISO 320 : f/2.2 |
  | BOI-12, « la vue où il […] réussit le défi » | défi SIT-06 réussi | pose de 1/800 s ou plus courte, mise au point sur le chien | à l'état de départ (M, 1/100 s) : traînée de 8,0 px pour une limite de 1,2 px, défi « à reprendre » sur toutes les vues |

- Correction proposée : faire partir chaque exercice d'un état écrit en entier. MES-04 : « En mode A à f/8 et ISO 100, sans ISO auto […] », et finir par « Remets la correction à ±0 ». MES-10 : ajouter « ISO 100, correction à ±0 ». BOI-08 : « à ISO 100 ». BOI-12 : « garde les réglages de l'exercice de BOI-08 (mode S, 1/1000 s, AF-C, zone automatique, détection des animaux) ». Même chose en anglais.

### FEX-07 · à améliorer · EXP-05 et BOI-07 : 1/4000 s est la limite de TutoPhoto, pas celle du Z 6 ; en mode A, « pas assez de lumière » n'arrive jamais dans le parc

- Endroit : `content/fr/notions/EXP-05.md`, l. 11 ; `BOI-07.md`, l. 5 et 9 ; mêmes lignes en anglais.
- Ce qui est écrit : « La molette « Vitesse » va de 30 s à 1/4000 s » ; « elle clignote hors des limites (30 s à 1/4000 s) » ; dans l'explication de BOI-07 : « trop de lumière, il faut fermer le diaphragme ; pas assez, il faut l'ouvrir ». EXP-06 dit pour l'ISO que « le Z 6 va au-delà » ; rien de tel pour la vitesse.
- Preuve (source) : « Shutter speed can be set to “×200” or to values between 30 s and 1/8000 s » (Nikon, « The Mode Dial », page citée par les deux fiches) ; `data/sources.yaml`, `nikon-z6-specifications` : « vitesses 1/8000 – 30 s ». `docs/camera-physique.md`, l. 101 : « Ces plages sont communes aux six boîtiers ; leurs plages réelles, souvent plus larges ».
- Preuve (calcul, `etat_depart.cjs`) : en mode A sans ISO auto, sur les 14 725 combinaisons d'ouverture, d'ISO et de correction, la vitesse clignote 5 444 fois pour « trop de lumière » et jamais pour « pas assez » : la pose la plus longue demandée est 2,5 s (f/22, ISO 100, +5 IL), loin de 30 s. À f/1.4, ISO 100 donne 1/3200 s ; ISO 200 clignote à 1/4000 s (+0,5 IL), là où un Z 6 aurait encore 1/6400 s.
- Correction proposée : EXP-05, « de 30 s à 1/4000 s par tiers de cran (le Z 6 va jusqu'à 1/8000 s) » ; BOI-07, « elle clignote hors des limites de TutoPhoto (30 s à 1/4000 s). Dans le parc, seule la limite rapide s'atteint : à f/1.4, dès ISO 200. Le cas « pas assez de lumière » demande une scène plus sombre. » Même chose en anglais.

### FEX-09 · à améliorer · MES-04 : la fiche ne dit ni à quoi sert la correction, ni que la cellule de TutoPhoto mesure partout la même chose

- Endroit : `content/fr/notions/MES-04.md`, l. 5, 9 et 13 ; `content/en/notions/MES-04.md`, mêmes lignes.
- Ce qui est écrit : ce que fait la commande (« modifie l'exposition proposée par l'appareil »), ses bornes, le mode M, la mémorisation. L'exercice du référentiel, « Rendre la neige blanche », est remplacé par un exercice mécanique (+1 IL en A, puis en M).
- Preuve (code) : les modes A et S visent une constante. `cameraPanel.ts`, l. 392-401, appelle `resolveExposure` sans luminosité de scène ; `exposureModes.ts`, l. 82 : `sceneEv100 = SCENE_EV100`. C'est le constat PHY-12 de `modele-physique.md` (« même mesure quel que soit le cadrage »). Aucune des huit fiches ne le dit.
- Conséquence : un débutant apprend comment corriger, pas quand ni pourquoi ; et le simulateur ne peut pas le lui montrer, puisque sa cellule ne se trompe jamais. La page de Nikon lue ne dit pas non plus dans quels cas corriger : je ne sais pas le sourcer avec les pages citées.
- Correction proposée : dans « Simulateur », ajouter « Limite : la cellule de TutoPhoto donne la même mesure où que tu vises (toute la scène vaut 12,5 IL) ; la correction n'y rattrape donc aucune erreur de mesure, elle ne fait qu'éclaircir ou assombrir exprès. » Pour le « quand » (neige, contre-jour), chercher une source avant d'écrire ; `docs/etat-des-travaux.md` note déjà que MES-04 « attend une scène claire ou à contre-jour ».

### FEX-10 · à améliorer · EXP-06, explication : dense pour une notion de niveau N1, et l'idée première du référentiel n'y est pas écrite simplement

- Endroit : `content/fr/notions/EXP-06.md`, l. 5 à 15 ; `content/en/notions/EXP-06.md`, l. 5 à 15.
- Preuve : `data/referentiel/exp.yaml`, EXP-06, niveau N1, explication : « L'ISO éclaircit sans ajouter de lumière ; le bruit vient surtout du manque de lumière […] ». La fiche ouvre par la phrase du manuel, « moins il faut de lumière pour exposer », qui dit l'inverse à un débutant (le capteur deviendrait plus sensible), et n'écrit nulle part que l'ISO n'ajoute pas de lumière ; il faut le déduire de « La plupart des appareils amplifient davantage le signal ». En cinq paragraphes et quatre sources, elle emploie sans les définir « convertisseur », « écrêté », « plage dynamique » (notion EXP-09, niveau N2, sans fiche), « bruit photonique » et « bruit de lecture » (EXP-08, N2, sans fiche), « rapport signal sur bruit », et elle définit « ISO invariant », terme qui ne sert ensuite ni dans la section « Simulateur », ni dans l'exercice, ni dans le simulateur.
- Critère : `docs/cadrage.md`, « Le public est débutant. Le but est la compréhension et la maîtrise du boîtier et des bases, pas le niveau professionnel. »
- Correction proposée : ouvrir par une phrase simple, par exemple « Monter l'ISO éclaircit la photo sans ajouter de lumière : l'appareil amplifie ce qu'il a capté. », suivie de la phrase du manuel ; garder le manque de lumière, les deux bruits en une phrase chacun et les seuils 40:1 et 10:1, que le simulateur affiche ; déplacer la définition de l'invariance ISO vers la fiche de EXP-08 ou de EXP-09 quand elle sera écrite. Julien tranche : c'est un choix de rédaction.

### FEX-11 · à améliorer · Vocabulaire : deux noms pour la cellule, « loupe » en anglais, titres de pages Nikon avec la lettre de leur icône

- Endroit et preuve :
  1. « la cellule » (`EXP-04.md`, l. 13 et 17 ; `EXP-05.md`, l. 11 et 15) et « l'indicateur d'exposition » (`MES-04.md`, l. 5 et 9 ; `BOI-07.md` et `BOI-08.md`, l. 5) désignent le même élément du simulateur, une échelle de −3 à +3 et le bouton « M · −0,2 IL », qui ne porte aucun nom à l'écran (`app/simulateur/index.html`, l. 137-146 ; la clé `meter` de `i18n.ts` n'est lue nulle part). En anglais : « the meter » et « the exposure indicator ». Le terme du manuel est « exposure indicator », « indicateur d'exposition ».
  2. `content/en/notions/EXP-06.md`, l. 19 : « with the 100% loupe ». Le bouton s'appelle « Magnifier » en anglais (`app/src/i18n.ts`, l. 435).
  3. « The S (ISO Sensitivity) Button » (`EXP-06.md`, l. 5) et « The E (Exposure Compensation) Button » (`MES-04.md`, l. 5 ; `MES-10.md`, l. 9), en français et en anglais : « S » et « E » sont les lettres de la police d'icônes de la page (`<h1>The <span class="wf-icn1">S</span> (ISO Sensitivity) Button</h1>`). Les titres des pages sont « The ISO (ISO Sensitivity) Button » et « The Exposure Compensation Button » (balise `title`) ; sur le boîtier, la commande est marquée ISO. Les mêmes titres sont dans `data/sources.yaml` (`nikon-z6-iso-button`, `nikon-z6-exposure-compensation`), `docs/camera-physique.md` et `exposureModes.ts`.
  4. Les fiches françaises de BOI-07, BOI-08 et BOI-12 citent la page française du manuel pour ses termes ; celles de EXP-06, MES-04 et MES-10 ne citent que les pages anglaises, alors que leurs termes (« correction d'exposition », « sensibilité maximale », « vitesse d'obturation minimale », « contrôle de la sensibilité auto ») viennent des pages françaises, qui existent, sont dans `data/sources.yaml` (`nikon-z6-exposure-compensation-fr`, `nikon-z6-iso-settings-fr`) et ont été relues. Il en va de même de « Indicators and Error Messages », dont la page française dit : « Les indicateurs d'exposition et l'affichage de la vitesse d'obturation ou de l'ouverture clignotent ».
- Reprise : l'interface a les deux noms, elle aussi. Le texte de la fenêtre « Aperçu » dit « il faut lire la cellule et anticiper » (« read the meter and anticipate » ; `app/src/i18n.ts`, texte `previewNote`, l. 78 et 312), celui de la fenêtre « Exposition » dit « l'indicateur » (texte `exposureNote`, l. 167 et 401). Le choix d'un seul nom vaut donc aussi pour `previewNote`.
- Correction proposée : (1) un seul nom, « l'indicateur d'exposition », décrit à sa première mention dans chaque fiche (« l'échelle de −3 à +3 sous le viseur, et le bouton qui affiche « M · −0,2 IL » ») ; (2) « magnifier » ; (3) les titres des balises `title` ; (4) dans les fiches françaises, le lien vers la page française quand elle existe, comme pour BOI-07.

### FEX-12 · à améliorer · Petites inexactitudes

1. `EXP-05.md`, l. 11 (fr, en) : « l'indicateur d'équilibre et le bulletin de la photo donnent la traînée du sujet visé ». Le bulletin donne la traînée du promeneur et du chien quand ils sont dans le cadre, visés ou non (`app/src/ui/challenges.ts`, l. 163-167) ; seul l'indicateur d'équilibre parle du sujet visé (`balance.ts`, l. 138-169, avec la réserve de PHY-17). Correction : « l'indicateur d'équilibre donne la traînée du sujet visé, le bulletin celle du promeneur et du chien s'ils sont dans le cadre, en pixels ».
2. `EXP-06.md`, l. 19 : « sont calculés […] et se voit » ; en anglais « are computed […] and shows ». Correction : « se voient », « show ».
3. `EXP-06.md`, l. 19 : « dans le viseur et sur la photo, à la loupe à 100 % ». Dans le viseur, le bruit de la loupe est sous-estimé sur les écrans de densité 2 ou plus (PHY-07) : la phrase sera juste une fois PHY-07 corrigé.
4. `MES-10.md`, l. 13 : « l'ISO auto descend jusqu'à ISO 100 » est donné comme une règle du manuel du D850, qui écrit « the minimum value for auto ISO sensitivity is automatically set to ISO 64 », sa sensibilité la plus basse. Le passage à ISO 100 est une transposition de TutoPhoto, dite dans `exposureModes.ts` (l. 15-17), pas dans la fiche. Correction : « l'ISO auto descend jusqu'à la sensibilité la plus basse du boîtier (ISO 64 sur le D850 ; ISO 100 ici) ».
5. `BOI-12.md`, l. 13 : « Non simulés : la mémoire tampon, le mode silencieux ». `docs/camera-physique.md`, l. 442, en liste deux de plus : l'exposition qui « may vary erratically » en Continu H (étendu), et plusieurs vues au retardateur. À ajouter, ou à renvoyer à la documentation.

### FEX-13 · à améliorer · MES-10, BOI-08 et BOI-12 : « 1/1000 s fige le chien » ne vaut qu'avec un boîtier plein format (reprise)

- Endroit : `content/fr/notions/MES-10.md`, l. 17 ; `BOI-08.md`, l. 13 ; `BOI-12.md`, l. 17 ; mêmes lignes en anglais.
- Ce qui est écrit : « À 1/1000 s, le chien (3,5 m/s à 9 m, 50 mm) laisse 50 × 3,5 × 0,001 / 9 ≈ 0,019 mm, soit 0,8 px sur la photo, sous la limite de 1,2 px : il est figé » (MES-10) ; « En mode S à 1/1000 s […] réussis le défi SIT-06 » (BOI-08). Aucune des trois fiches ne dit avec quel boîtier. Les fiches des situations, elles, le disent : « boîtier de TutoPhoto (Nikon Z 6, 50 mm) » (`content/fr/situations/SIT-06.md`, l. 9).
- Preuve (code) : le simulateur propose six boîtiers, trois plein format et trois APS-C (`app/src/camera/bodies.ts`, l. 33-75), et garde le choix d'une visite à l'autre (`app/src/ui/cameraPanel.ts`, l. 1094-1097 et 1119-1120). Le sujet est « figé » quand sa traînée sur le capteur, en millimètres, ne dépasse pas le flou acceptable, diagonale du capteur / 1500 (`app/src/camera/bulletin.ts`, l. 79 et 108 ; `sharpZone.ts`, l. 8-10). La traînée en millimètres ne dépend pas du capteur ; la limite, si.
- Preuve (calcul, `boitiers.cjs`, formules de `bulletin.ts`, pose exacte du cran « 1/1000 », 1/1024 s ; chien à 9 m, 3,5 m/s, 50 mm) :

  | Boîtier | Flou acceptable | Traînée à 1/1000 s | Verdict | Première pose « figée » |
  | --- | --- | --- | --- | --- |
  | Nikon Z 6 | 0,0288 mm | 0,0190 mm, soit 0,79 px | figé | 1/800 s |
  | Sony A7 III | 0,0286 mm | 0,0190 mm, soit 0,80 px | figé | 1/800 s |
  | Canon EOS RP | 0,0288 mm | 0,0190 mm, soit 0,79 px | figé | 1/800 s |
  | Nikon D5600 | 0,0188 mm | 0,0190 mm, soit 1,21 px | traînée (1,01 fois la limite) | 1/1250 s |
  | Sony A6000 | 0,0188 mm | 0,0190 mm, soit 1,21 px | traînée (1,01 fois la limite) | 1/1250 s |
  | Canon EOS 2000D | 0,0179 mm | 0,0190 mm, soit 1,28 px | traînée (1,06 fois la limite) | 1/1250 s |

  En pixels de la photo, la limite vaut 1,20 px pour les six boîtiers. Avec le D5600 ou l'A6000, le bulletin écrit donc une traînée et une limite arrondies au même chiffre : « traînée de 1,2 px, au-delà du flou acceptable (limite 1,2 px) » (`app/src/ui/challenges.ts`, l. 162-166, un chiffre après la virgule).
- Preuve (mesure dans un navigateur, `essais.cjs`, partie B : boîtier Nikon D5600, mode S à 1/1000 s, AF-C, zone automatique, détection des animaux, défi SIT-06) : la légende de la photo écrit « S · f/2,5 · 1/1000 s · ISO 100 (auto) · 50 mm · Nikon D5600 », et le bulletin « le chien : traînée de 1,2 px, au-delà du flou acceptable (limite 1,2 px) », « Manqué : chien figé, traînée sous le flou acceptable (1,2 px) », puis « À revoir : […] MVT-01 Figer le mouvement ; BOI-08 Priorité à la vitesse ; MES-10 ISO auto ». Le bulletin renvoie donc aux deux fiches qui donnent 1/1000 s. Avec le Nikon Z 6, aux réglages de l'exercice de MES-10 (mode A, f/8, ISO auto, vitesse minimale 1/1000 s) : « le chien : traînée de 0,8 px, sous le flou acceptable (limite 1,2 px) », défi réussi à la deuxième photo (à la première, le chien n'était pas dans le cadre).
- La focale compte autant : au 85 mm, il faut 1/1250 s en plein format, et aucune des six poses de 1/500 à 1/1600 s ne suffit en APS-C (même script). Les fiches la donnent (« 50 mm »), mais c'est le réglage de départ, pas une consigne.
- Conséquence : un débutant qui a choisi le boîtier qui ressemble au sien (D5600, A6000 ou EOS 2000D) suit l'exercice de BOI-08 ou de MES-10 à la lettre et lit « Manqué : chien figé », avec une explication chiffrée qui semble se contredire.
- Ce qui est juste : avec le boîtier de départ, tous les chiffres des trois exercices (point 28 de « Vérifié »).
- Correction proposée : dans les trois exercices, « Avec le boîtier de départ (Nikon Z 6) et le 50 mm : […] » ; dans MES-10, ajouter « Avec un boîtier APS-C, le capteur est plus petit et la limite aussi : il faut 1/1250 s. » Même chose en anglais. Hors du lot, pour le rapport de l'interface : quand la traînée et la limite s'arrondissent au même chiffre, le bulletin devrait écrire un chiffre de plus.

### FEX-15 · à améliorer · BOI-07, BOI-08 et BOI-12 : seuls les noms de Nikon, alors que le simulateur propose des boîtiers Canon et Sony ; le titre de BOI-12 n'est pas expliqué (reprise)

- Endroit : `content/fr/notions/BOI-07.md`, l. 1 et 5 ; `BOI-08.md`, l. 1 et 5 ; `BOI-12.md`, l. 1 et 5 ; mêmes lignes en anglais.
- Ce qui est écrit : « En mode A, « Auto à priorité ouverture » », « En mode S, « Auto à priorité vitesse » », d'après le manuel du Z 6. Le titre de BOI-12 est « Modes d'entraînement » (« Drive modes »), et son texte ne parle que du « mode de déclenchement » (« release mode ») : aucune phrase ne dit que c'est la même chose.
- Preuve (dépôt) : le référentiel nomme les deux notions pour plusieurs marques, « aperture priority, A/Av » et « shutter priority, S/Tv » (`data/referentiel/boi.yaml`, l. 63 et 73) ; les fiches anglaises ont gardé « Aperture priority » et « Shutter priority ». Le simulateur propose deux boîtiers Canon et deux Sony (`app/src/camera/bodies.ts`, l. 52-74) ; sa fenêtre « Exposition » n'a que les lettres de Nikon (`app/src/i18n.ts`, l. 152-154 et 386-388).
- Preuve (sources lues le 13 novembre 2026) :

  | Marque | Priorité à l'ouverture | Priorité à la vitesse | Vue par vue, rafale, retardateur |
  | --- | --- | --- | --- |
  | Nikon Z 6 | « A Auto à priorité ouverture » ; « A Aperture-priority auto » | « S Auto à priorité vitesse » ; « S Shutter-priority auto » | « mode de déclenchement » ; « release mode » |
  | Sony A7 III | « A (Priorité ouvert.) » ; « A (Aperture Priority) » | « S (Priorité vitesse) » ; « S (Shutter Priority) » | « Entraînement » ; « Drive Mode » |
  | Canon EOS 850D (boîtier voisin) | « Mode d'exposition automatique avec priorité à l'ouverture (Av) » ; « Aperture-Priority AE Mode (Av) », « [Av] stands for Aperture value » | « Mode d'exposition automatique avec priorité à l'obturation (Tv) » ; « Shutter-Priority AE Mode (Tv) », « [Tv] stands for Time value » | « Mode d'acquisition » ; « Drive Mode » |

  Adresses : Sony, `https://helpguide.sony.net/ilc/1720/v1/fr/print.pdf` et `…/en/print.pdf` ; Canon, `https://cam.start.canon/fr/C002/manual/html/UG-03_CustomShooting_0040.html`, `…_0030.html`, `UG-04_AF-Drive_0060.html`, et les mêmes sous `/en/`. Je n'ai pas trouvé les manuels de l'EOS RP et de l'EOS 2000D sur l'hôte joignable : les termes de Canon viennent d'un boîtier voisin.
- Conséquence : le titre « Modes d'entraînement » est le terme de Sony ; un débutant qui a un Nikon ne le trouvera pas sur son boîtier, et la fiche ne fait pas le lien. Un débutant qui a un Canon ne trouvera ni « A » ni « S » sur sa molette, alors que le simulateur lui propose son boîtier.
- Correction proposée : une phrase par fiche, avec ces sources (à ajouter à `data/sources.yaml` pour Canon ; le guide de Sony y est déjà, `sony-ilce-7m3-help-guide`). BOI-07 : « Sony l'appelle aussi A (« Priorité ouvert. »), Canon l'appelle Av (« Aperture value »). » BOI-08 : « Sony l'appelle aussi S (« Priorité vitesse »), Canon l'appelle Tv (« Time value »). » BOI-12 : « Nikon dit « mode de déclenchement », Sony « entraînement », Canon « mode d'acquisition » ; en anglais, « release mode » chez Nikon, « drive mode » chez Sony et Canon. » Même chose en anglais. Que la fenêtre « Exposition » suive la marque choisie est une autre question, pour le rapport de l'interface et pour Julien.

### FEX-17 · à améliorer · BOI-07, exercice : « ouvre à f/2 ou plus » se lit dans les deux sens (reprise ; repris de FIC-17, premier point)

- Endroit : `content/fr/notions/BOI-07.md`, l. 13. L'anglais dit « open up to f/2 or wider », sans équivoque.
- Preuve (calcul, `boi07.cjs`, Nikon Z 6, 50 mm, mise au point sur l'œil de Sophia à 6,6 m) : la zone nette s'arrête à 7,77 m à f/2 et à 7,94 m à f/2.2, puis dépasse le banc (8 m) dès f/2.5 (8,15 m), et le chien (9 m) dès f/3.5 (9,02 m). Le défi SIT-01 demande que rien de ce qui est dans le cadre, à plus de 1 m derrière Sophia, ne soit dans la zone nette (`app/src/camera/bulletin.ts`, l. 120-123).
- Conséquence : un débutant qui lit « f/2 ou plus » comme « f/2 ou un nombre plus grand » (f/2.8, f/4) fait l'inverse de ce qui est voulu, et le défi échoue dès que le banc ou le chien est dans le cadre.
- Correction proposée : « ouvre à f/2 ou davantage (f/1.8, f/1.6, f/1.4 : un nombre plus petit) ».

### FEX-18 · à améliorer · EXP-04, EXP-05 et EXP-06 : Wikipedia citée sans dire que c'est une source secondaire ; dates de lecture qui ne sont pas celles de `data/sources.yaml` (reprise ; repris de FIC-18, complété)

- Endroit : `content/fr/notions/EXP-04.md`, l. 5 ; `EXP-05.md`, l. 5 ; `EXP-06.md`, l. 15 ; mêmes lignes en anglais.
- Preuve :
  1. Les trois fiches citent une révision de Wikipedia comme seule source d'une définition ou d'une règle, sans la qualifier. Les fiches écrites ensuite le font : « source secondaire » dans `LUM-02.md` (l. 11), `CMP-02.md` (l. 7) et `MES-06.md` (l. 25). `data/sources.yaml` le dit pour les trois entrées (`wikipedia-f-number`, `wikipedia-shutter-speed`, `wikipedia-film-speed` : « source secondaire »).
  2. EXP-04 et EXP-05 écrivent « lue le 11 novembre 2026 ». Les deux entrées de `data/sources.yaml` disent « lue le 8 novembre 2026 », et leur libellé ne décrit que ce que le code en tire : « « Typical one-third-stop f-number scale » » et « crans normalisés de 1/1000 à 1 s, échelle 2:1 ». La définition du nombre f, l'éclairement en 1/N², la profondeur de champ et la définition du temps de pose, que les fiches en tirent, n'y sont pas, ni la lecture du 11 novembre. Pour « Film speed », la fiche et l'entrée disent toutes deux le 10 novembre 2026.
- Ce qui est juste : les six affirmations sont bien dans les révisions citées (points 1 à 5, 8 et 9 de « Vérifié »).
- Correction proposée : ajouter « source secondaire » aux trois citations, dans les deux langues ; compléter les deux libellés de `data/sources.yaml` avec ce que les fiches en tirent et la date du 11 novembre 2026. Une source primaire (manuel, norme) pour ces définitions serait mieux : je n'en ai pas cherché.

### FEX-19 · à améliorer · BOI-08, BOI-07 et MES-04 : quand l'indicateur d'exposition clignote, le bouton qui ouvre la fenêtre « Exposition » ne répond qu'une fois sur deux (reprise)

- Endroit : `content/fr/notions/BOI-08.md`, l. 13 (« l'ouverture clignote à f/1.4, la photo est sous-exposée ; active l'ISO auto et recommence ») ; `BOI-07.md`, l. 9 ; `MES-04.md`, l. 9 (« ouverte en touchant l'indicateur d'exposition ») ; mêmes lignes en anglais. Dans le code : `app/src/style.css`, l. 448-456 ; `app/src/ui/cameraPanel.ts`, l. 300 et 745.
- Preuve (code) : hors des limites, en A ou en S, le bouton de l'indicateur reçoit la classe `flashing` (`cameraPanel.ts`, l. 745), dont l'animation alterne `visibility: hidden` et visible, une demi-seconde chacun (`.flashing { animation: clignote 1s steps(2, start) infinite; }`, `@keyframes clignote { to { visibility: hidden; } }`). Ce bouton est le seul moyen d'ouvrir la fenêtre « Exposition » (l. 300), donc de changer de mode, de correction ou d'ISO auto.
- Preuve (mesure dans un navigateur, `essais.cjs`, partie C : mode S, sans ISO auto, 1/4000 s ; cellule « S · −0,5 IL », « Ouverture (auto) f/1,4 » qui clignote) : sur 60 relevés à 100 ms d'intervalle, le bouton est invisible 30 fois, et l'élément sous le pointeur est alors la rangée derrière lui (`meter-row`), pas le bouton. Sur 12 clics de souris au centre du bouton, la fenêtre s'ouvre 4 fois, toutes pendant la phase visible ; les 8 autres, pendant la phase invisible, n'ont aucun effet.
- Conséquence : l'exercice de BOI-08 conduit exactement à cet état, puis demande d'activer l'ISO auto : un toucher sur deux se perd, sans rien signaler. Il en va de même quand la vitesse clignote en mode A (BOI-07 ; mesuré : à f/1,4 et ISO 200, « Vitesse (auto) 1/4000 s » et la cellule clignotent, bulle « trop de lumière : photo surexposée »).
- Correction proposée : dans l'interface, faire clignoter le texte sans faire disparaître le bouton (animer la couleur ou l'opacité, ou porter la classe sur un élément intérieur au bouton) ; rien à changer dans les fiches. À reprendre par le rapport de l'interface ; noté ici parce que c'est l'exercice d'une fiche qui y mène.

## Vérifié

EXP-04 (ouverture)
1. Définition : « the ratio of the system's focal length to the diameter of the entrance pupil » (Wikipedia, « F-number »).
2. « The brightness of the projected image (illuminance) […] decreases with the square of the f-number » (même page).
3. Crans entiers : « a decrease of the pupil and aperture diameters by a factor of 1/√2 or about 0.7071, and hence a halving of the area of the pupil » ; « The one-stop unit is also known as the EV (exposure value) unit ».
4. Tiers de cran : « the aperture that is one-third stop smaller than f/2.8 is f/3.2, two-thirds smaller is f/3.5, and one whole stop smaller is f/4 » ; « Steps of one-third stop (1⁄3 EV) are the most common » sur les appareils modernes.
5. « Depth of field increases with f-number ».
6. Molette de f/1.4 à f/22 : 25 crans par tiers (`exposure.ts`, l. 12-15) ; en A l'ouverture est choisie et la vitesse réglée, en S l'inverse (`cameraPanel.ts`, l. 685-687).
7. (5,6 / 4)² = 1,96 ; 2,00 avec les valeurs exactes des crans (voir PHY-16 pour ce choix d'écriture).

EXP-05 (vitesse)
8. Définition : « shutter speed or exposure time is the length of time that the film or digital sensor inside the camera is exposed to light […] when taking a photograph » (Wikipedia, « Shutter speed »).
9. « doubling the exposure time doubles the amount of light » ; « a standardized 2:1 scale was adopted for shutter speed so that opening one aperture stop and reducing the amount of time of the shutter speed by one step resulted in the identical exposure ».
10. La phrase sur la traînée (l. 7) n'a pas de source dans la fiche, mais renvoie à MVT-01 ; la page citée la dit aussi : « Very short shutter speeds can be used to freeze fast-moving subjects […]. Very long shutter speeds are used to intentionally blur a moving subject ».
11. Molette de 30 s à 1/4000 s : 52 crans par tiers (`exposure.ts`, l. 19-25).
12. « En rafale, une vue ne dure jamais moins que sa pose » : intervalle = max(1 / cadence, pose) (`shutter.ts`, fonction `interval`).
13. Exercice : f/4 et 1/400 s, puis f/8, puis 1/100 s donnent −0,2, −2,2 et −0,2 IL : la réponse 1/100 s est juste.

EXP-06 (ISO)
14. Manuel du Z 6 : « The higher the ISO sensitivity, the less light needed to make an exposure, allowing faster shutter speeds or smaller apertures, but the more likely the image is to be affected by noise » ; « Noise is particularly likely at settings between Hi 0.3 and Hi 2 » ; « Highlights may lose some detail » (réglages Lo).
15. « Two ratios are used, the 40:1 ("excellent image quality") and the 10:1 ("acceptable image quality") ratio » (Wikipedia, « Film speed », « Noise-based speed »).
16. Molette de 100 à 6400 : 19 crans par tiers (`exposure.ts`, l. 29-32) ; le Z 6 va au-delà : « from ISO 100 to ISO 51200 ».
17. Exercice, calcul : 14 IL₁₀₀ (13,97 avec les libellés, 14 exactement avec les crans) ; 100 × 2^1,5 ≈ 283 ; ISO 250 donne −1/6 IL et ISO 320 +1/6 IL.
18. L'indicateur d'équilibre et le bulletin donnent le rapport signal sur bruit au point visé, classé aux seuils 40 et 10 (`balance.ts`, l. 188-191 ; `challenges.ts`, l. 157-160).
19. Les passages tirés de DPReview et de Photography Life reprennent bien les citations gardées dans `data/sources.yaml` (`dpreview-iso-invariance`, `pl-iso-invariance`) ; ce n'est pas une vérification à la source (voir « Je ne sais pas »).

MES-04 (correction d'exposition)
20. Manuel du Z 6 : « In modes other than b [icône du mode automatique], exposure compensation can be used to alter exposure from the value suggested by the camera, making pictures brighter or darker » ; « between –5 EV (underexposure) and +5 EV (overexposure) in increments of 1/3 EV » ; « positive values make the subject brighter while negative values make it darker » ; « In mode M, exposure compensation affects only the exposure indicator […] (ISO sensitivity will, however, automatically be adjusted […] when auto ISO sensitivity control is enabled) » ; « Normal exposure can be restored by setting exposure compensation to ±0. Exposure compensation is not reset when the camera is turned off. »
21. Simulateur : la fenêtre « Exposition » s'ouvre en touchant l'indicateur (`cameraPanel.ts`, l. 300) ; 31 valeurs de −5,0 à +5,0 IL (l. 607-609) ; en A et S l'indicateur montre la correction, en M il est seul à bouger sauf avec l'ISO auto (`exposureModes.ts`, l. 92 et 125) ; correction mémorisée (`cameraPanel.ts`, l. 1107 et 1128).
22. Exercice, à ISO 100 : en A à f/8, 1/100 s et −0,2 IL, puis 1/50 s et +0,8 IL avec +1 IL ; en M sans ISO auto, photo inchangée à −0,2 IL, indicateur de −0,2 à −1,2 IL.

MES-10 (ISO auto)
23. Manuel du Z 6, « ISO Sensitivity Settings » : « the camera will automatically adjust ISO sensitivity when optimal exposure cannot be achieved at the value selected for ISO sensitivity » ; « Maximum sensitivity: Choose an upper limit for ISO sensitivity to prevent it being raised too high » ; « Minimum shutter speed: Choose the shutter speed below which auto ISO sensitivity control will kick in to prevent underexposure in modes P and A » ; « Shutter speeds may drop below the selected minimum if optimum exposure cannot be achieved at the ISO sensitivity chosen for Maximum sensitivity ».
24. « Defaults » : « Auto ISO sensitivity control : On ». La correction prise en compte par l'ISO auto en M : citation du point 20.
25. Manuel du D850 : « the minimum value for auto ISO sensitivity is automatically set to ISO 64 » ; « In exposure modes P and A, sensitivity will only be adjusted if underexposure would result at the shutter speed selected for Minimum shutter speed ».
26. L'option « Automatique » de la vitesse minimale : la page dit « the camera will choose the minimum shutter speed based on the focal length of the lens », sans règle chiffrée. La phrase de la fiche (« sa règle n'est pas publiée ») va plus loin que la page : voir FEX-14 (corrigé à la reprise).
27. Simulateur : les trois réglages sont dans la fenêtre « Exposition » ; sensibilité maximale de ISO 200 à 6400 (`cameraPanel.ts`, l. 92 et 610-612) ; la molette s'appelle « ISO auto » dans les deux langues (`i18n.ts`, l. 161 et 395) et montre la valeur retenue.
28. Exercice, à ISO 100 et sans correction : mode A, f/8, vitesse minimale 1/1000 s, maximum 6400 donnent ISO 1000 et 1/1000 s. Traînée du chien : 50 × 3,5 × 0,001 / 9 = 0,0194 mm, soit 0,81 px (0,79 px avec la valeur exacte du cran, 1/1024 s), pour une limite de 43,1 / 35,9 = 1,20 px. À f/8, la zone nette va de 4,9 à 51 m pour une mise au point à 9 m : le chien y est.

BOI-07 (priorité à l'ouverture)
29. Manuel français : « A Auto à priorité ouverture : choisissez l'ouverture ; l'appareil photo sélectionne la vitesse d'obturation […]. Utilisez cette option afin de rendre flou l'arrière-plan ou afin d'étendre la zone de netteté au premier plan et à l'arrière-plan. » ; manuel anglais : « Use to blur backgrounds or bring both foreground and background into focus ».
30. « Indicators and Error Messages » : « (Exposure indicators and shutter speed or aperture display flash) » ; « Subject too bright; photo will be overexposed. […] A Choose a smaller aperture (higher f-number) » ; « Subject too dark; photo will be underexposed. […] A Choose larger aperture (lower f-number) ».
31. Simulateur : nom « Vitesse (auto) » (`cameraPanel.ts`, l. 719), boutons désactivés (l. 727), clignotement hors de l'échelle (l. 724 ; `exposureModes.ts`, l. 105) ; avec l'ISO auto, la sensibilité ne monte que si la vitesse passerait sous la vitesse minimale (`exposureModes.ts`, l. 96-103).
32. Exercice : à f/2 et ISO 100, l'appareil prend 1/1600 s. Au 50 mm, mise au point à 6,6 m, la zone nette va de 5,7 à 7,8 m ; le banc (8 m), le chien (9 m), la poubelle (10,5 m), le promeneur (12,5 m) et le fond (500 m) sont au-delà : le défi SIT-01 est jouable depuis la position de départ.

BOI-08 (priorité à la vitesse)
33. Manuel français : « S Auto à priorité vitesse : choisissez la vitesse d'obturation ; l'appareil photo sélectionne l'ouverture […]. Utilisez ce mode pour figer le mouvement ou le rendre flou. » ; manuel anglais : « Use to freeze or blur motion ». « Indicators and Error Messages » : « S Increase shutter speed » (trop clair), « Increase ISO sensitivity […] S Lower shutter speed » (trop sombre).
34. Simulateur : nom « Ouverture (auto) », limites f/1.4 et f/22 de l'objectif virtuel, sensibilité qui change quand l'ouverture ne suffit plus (`exposureModes.ts`, l. 108-114).
35. Exercice, à ISO 100 : mode S à 1/1000 s, f/2.5 ; à 1/4000 s sans ISO auto, f/1.4 qui clignote et −0,5 IL ; avec l'ISO auto, ISO 125, f/1.4, −0,2 IL. AF-C, zone automatique et détection des animaux existent (`i18n.ts`, l. 49, 57 et 62 ; `faces.ts`).

BOI-12 (modes de déclenchement)
36. Termes français de la page française : « Vue par vue », « Continu L », « Continu H », « Continu H (étendu) », « Retardateur » ; termes anglais : « Single frame », « Continuous L », « Continuous H », « Continuous H (extended) », « Self-timer ».
37. « The camera takes one photograph each time the shutter-release button is pressed » ; « While the shutter-release button is held down, the camera records 1–5 frames per second » ; « up to about 5.5 frames per second » ; « Defaults » : « Self-timer delay 10 s », « CL mode shooting speed 3 fps ».
38. Simulateur : cadences 5,5 et 12, Continu L de 1 à 5, délais 2, 5, 10 et 20 s (`cameraPanel.ts`, l. 89 et 101-102) ; intervalle jamais plus court que la pose ; mise au point refaite à chaque vue en AF-C, gardée en AF-S ; un bulletin par vue ; 20 vues au plus (`shutter.ts`, `MAX_BURST`, `shootSeries`).

Les seize fiches
39. Français et anglais disent la même chose, phrase par phrase ; seuls écarts : ceux de FEX-11.
40. Termes anglais des manuels : « Aperture-priority auto », « Shutter-priority auto », « exposure compensation », « exposure indicator », « auto ISO sensitivity control », « maximum sensitivity », « minimum shutter speed », « release mode », « shutter-release button », « auto-area AF », « animal detection ».
41. Ton : tutoiement en français, phrases directes, ni emoji ni formule emphatique.
42. Balisage : seulement ce que `docs/contenus.md` autorise (titre, sections de niveau 2, paragraphes, listes à tirets, gras, liens) ; les trois sections attendues existent dans chaque fiche.
43. Chaque lien d'une fiche correspond à une source de `data/sources.yaml` dont le champ `used_in` nomme la fiche ; `python3 scripts/validate.py` : 0 erreur.

Reprise (13 novembre 2026)
44. Les points 1 à 43 tiennent, sauf le point 26 (voir FEX-14) : scripts de la première rédaction relancés sur le code recompilé (mêmes sorties), et 42 passages recherchés mot pour mot dans les pages enregistrées (tous retrouvés). Les mots « minimum value » sont absents des deux pages du Z 6 sur la sensibilité : son manuel ne donne pas la sensibilité la plus basse de l'ISO auto, comme la fiche MES-10 le dit.
45. EXP-04, « Simulateur » : l'aperçu de la luminosité, du bruit et de la profondeur de champ est en marche au départ (`cameraPanel.ts`, l. 255) ; coupé dans la fenêtre « Aperçu », le viseur ne montre plus l'effet, et un rappel « Aperçu coupé » s'affiche (l. 1043-1050).
46. BOI-07 et BOI-08, « Simulateur » : « grisée » veut dire boutons désactivés et valeur en italique (`cameraPanel.ts`, l. 723 et 727 ; `app/src/style.css`, l. 442-444) ; hors des limites, la valeur et l'indicateur d'exposition clignotent ensemble (l. 724, 740 et 745), en rouge sans clignoter si le système demande moins d'animations (`style.css`, l. 459-464).
47. BOI-12 : « 3 par défaut » et « 10 par défaut » sont bien les réglages d1 et c2 de « Defaults ». C'est le texte de l'interface qui se trompe en les disant « choisis, les pages lues ne les donnant pas » (`i18n.ts`, texte `releaseNote`) : constat PHY-09 de `modele-physique.md`.
48. BOI-12, « Simulateur » : le bouton porte le mode courant (« Vue par vue », « Continu H · 5,5 vps »…) et ouvre la fenêtre « Mode de déclenchement » (`cameraPanel.ts`, l. 554-565) ; la rafale dure tant que le déclencheur reste appuyé (`shutter.ts`, l. 254-300).
49. MES-10, « Explication » : « Auto ISO sensitivity control : On », « Maximum sensitivity : Z 6: 51200 », « Minimum shutter speed : Auto » dans « Defaults » ; la liste de la vitesse minimale va « from 1/4000 s to 30 s », comme celle du simulateur (`cameraPanel.ts`, l. 615-619).
50. MES-10 et BOI-08 : la règle « une valeur choisie plus haute que le maximum sert à sa place » du manuel du D850 (« the value selected by the user will be used instead ») est dans le code (`exposureModes.ts`, l. 86).
51. Titres : ceux des fiches françaises sont ceux du référentiel ; en anglais, trois diffèrent un peu (« ISO » pour « ISO sensitivity », « Aperture priority » et « Shutter priority » sans « A/Av » ni « S/Tv », voir FEX-15).

Reprise, mesures dans un navigateur (Nikon Z 6, 50 mm, sauf mention ; `essais.cjs`, ou sorties de la première passe quand c'est dit)
52. BOI-07, « Simulateur » : en mode A à f/1,4 et ISO 100, « Vitesse (auto) 1/3200 s », boutons de la molette désactivés ; à ISO 200, « Vitesse (auto) 1/4000 s » clignote avec la cellule, « A · +0,5 IL », bulle « trop de lumière : photo surexposée ».
53. BOI-08, fin de l'exercice : mode S à 1/4000 s sans ISO auto, « Ouverture (auto) f/1,4 » clignote, cellule « S · −0,5 IL », bulle « pas assez de lumière : photo sous-exposée » ; avec l'ISO auto, « ISO auto 125 », « S · −0,2 IL », plus rien ne clignote.
54. BOI-08, début de l'exercice (sortie `preuves-45678.out`) : mode S à 1/1000 s, « Ouverture (auto) f/2,5 », ISO 100 ; défi SIT-06 réussi à la deuxième et à la troisième photo (zone nette de 7,1 à 12,1 m, « chien figé […] (0,8 px) »), manqué à la première, où la mise au point était restée sur le sujet le plus proche.
55. MES-10, exercice : « ISO auto 1000 », « Vitesse (auto) 1/1000 s », cellule « A · −0,2 IL » ; avec la mise au point de départ (AF-S, point au centre, 6,5 m à la photo), zone nette de 4,1 à 16,0 m ; défi SIT-06 réussi à la deuxième photo, le chien n'étant pas dans le cadre à la première.
56. MES-04, exercice (sortie `preuves-45678.out`) : mode A à f/8, « Vitesse (auto) 1/100 s » et « Exposition : −0,2 IL » ; avec +1 IL, cellule « A · +0,8 IL · corr. +1,0 », « Vitesse (auto) 1/50 s » et « Exposition : +0,8 IL ».
57. BOI-07, exercice (même sortie) : mode A à f/2, « Vitesse (auto) 1/1600 s », zone nette de 5,7 à 7,8 m, défi SIT-01 réussi, en zone automatique avec la détection des visages et des yeux.
58. BOI-12, exercice, avec les réglages de l'exercice de BOI-08 et « Continu H · 5,5 vps » : déclencheur tenu, six vues à +0,00, +0,18, +0,36, +0,55, +0,73 et +0,91 s, un bulletin par vue, que l'écran de revue fait défiler. Deux rafales : une vue sur six, puis trois sur six, réussissent le défi. Les captures des six vues de la seconde rafale montrent pourquoi : le chien passe derrière le groupe ; quand il est caché, l'appareil fait le point sur le sujet le plus proche (5,8 m) et le critère « chien dans la zone nette » échoue. La série est donc bien « à trier », comme le demande le référentiel.

## Je ne sais pas

1. Ce que disent les articles de DPReview et de Photography Life cités par EXP-06 (l. 7 à 13) : les deux hôtes refusent les lectures automatiques (403), et le relevé de Julien n'est pas dans le dépôt. Les passages de la fiche qui en viennent ne sont donc pas vérifiés ici, pas plus que les dates « publié le 27 juillet 2026, mis à jour le 16 septembre 2026 » et « mis à jour le 22 août 2022 ».
2. Ce qu'un Z 6 affiche quand l'écart à l'exposition optimale vaut 1/6 IL, entre deux graduations de son indicateur : le manuel dit seulement que l'écart est montré par tiers ou demi-IL (FEX-01).
3. La règle de l'option « Auto » de la vitesse minimale du Z 6 : la page lue dit qu'elle dépend de la focale, sans la donner. Je n'ai pas cherché d'autre source (FEX-14).
4. Ce qu'affichent, en français, l'écran d'un boîtier et la bague d'un objectif pour une ouverture à décimale (« 5.6 » ou « 5,6 ») : aucune page lue ne le montre (FEX-16).
5. Les noms des modes sur le Canon EOS RP et le Canon EOS 2000D : leurs manuels ne sont pas sur l'hôte joignable sous la forme essayée (`cam.start.canon`, codes C001 à C006) ; les termes de Canon viennent du manuel de l'EOS 850D (FEX-15).

## Constats FIC repris

`docs/audit/fiches.md` (première passe sur toutes les fiches, non contre-vérifiée) : sort de chaque constat qui porte sur ces huit notions. Les autres (FIC-03, FIC-04, FIC-12 à FIC-15, FIC-19, et les parties de FIC-08 et de FIC-17 qui portent sur d'autres fiches) relèvent du rapport `fiches-mise-au-point.md`.

| Constat FIC | Sort | Ici |
| --- | --- | --- |
| FIC-01 (EXP-04, cellule à 0) | déjà là ; le passage sur l'indicateur du Z 6 est vérifié et repris | FEX-01 |
| FIC-02 (EXP-06, « là où s'arrêtent ses mesures ») | déjà là | FEX-03 |
| FIC-05 (BOI-12, délais du retardateur, 12 vues par seconde) | déjà là | FEX-04 |
| FIC-06 (MES-10, « sa règle n'est pas publiée ») | vérifié, repris et complété ; la première rédaction l'avait classé « vérifié » (point 26), à tort pour la phrase telle qu'elle est écrite | FEX-14 |
| FIC-07 (EXP-06, exercice) | déjà là | FEX-05 |
| FIC-08, partie EXP-05 (traînée « du sujet visé » dans le bulletin) | déjà là | FEX-12, point 1 |
| FIC-09 (noms de la cellule, « loupe », écriture des ouvertures) | deux premiers points déjà là ; le troisième est vérifié et repris | FEX-11 ; FEX-16 |
| FIC-10 (1/4000 s et 1/8000 s) | déjà là | FEX-07 |
| FIC-11 (pas de mesure de la lumière, MES-04) | déjà là | FEX-09 |
| FIC-16 (EXP-06 trop dense, faute d'accord) | déjà là | FEX-10 ; FEX-12, point 2 |
| FIC-17, partie BOI-07 (« f/2 ou plus ») | vérifié et repris | FEX-17 |
| FIC-18, parties EXP-04, EXP-05 et EXP-06 (Wikipedia, source secondaire) | vérifié, repris et complété | FEX-18 |

## Vu en passant, hors du lot

Pour les rapports de l'interface et du modèle physique ; non approfondi ici.

1. Les fiches tutoient, l'interface vouvoie : « touchez le viseur », « vous touchez », « Touchez la carte », « maintenez le déclencheur appuyé », « Touchez la photo », « votre appareil » (`app/src/i18n.ts`, l. 39, 69, 70, 147, 170, 209 et 226). `CLAUDE.md` demande le tutoiement.
2. Au point visé de départ, la ligne du bruit de l'indicateur d'équilibre saute d'une lecture à l'autre, parce que ce point est sur le bord d'un personnage qui bouge (FEX-05) : à l'ouverture du simulateur, à ISO 100, elle a écrit « acceptable (39:1) » puis « excellent (607:1) » en quelques secondes.
3. Le bulletin peut écrire une traînée « au-delà du flou acceptable » avec le même chiffre que la limite (« 1,2 px […] limite 1,2 px », FEX-13).
4. Le bouton de l'indicateur d'exposition disparaît une demi-seconde sur deux quand il clignote (FEX-19).
5. Défi SIT-06 : le critère « chien dans le cadre » est réussi quand le chien est caché derrière un personnage (vue 3 de la rafale du point 58 de « Vérifié »), et le défi est « réussi » sur une vue où la tête du chien est cachée derrière Sophia (vue 2 de la même rafale) : le critère projette un point dans le cadre, sans regarder s'il est visible (`app/src/camera/bulletin.ts`, l. 93-95). Pour le rapport des situations.

## Ce qui n'est pas couvert

1. Les articles de DPReview et de Photography Life cités par EXP-06 : non relus (403 aux trois essais du 13 novembre 2026). Les l. 7 à 13 de la fiche ne sont vérifiées que contre les extraits gardés dans `data/sources.yaml`.
2. Un essai avec un processeur graphique, sur un téléphone ou dans Safari : les mesures de ce rapport viennent de Chromium en rendu logiciel, sur un écran d'ordinateur émulé.
3. L'interface en anglais dans un navigateur : ses libellés sont lus dans `app/src/i18n.ts`, pas à l'écran.
4. Le retardateur, « Continu L » et « Continu H (étendu) » dans un navigateur : lus dans le code seulement (point 38 de « Vérifié »).
5. Les pages des fiches telles que le site les publie (`app/scripts/build-pages.mjs`) : non regardées ; ce rapport lit les fichiers de `content/`.
6. Les valeurs à écrire dans les corrections de FEX-05 (rapports signal sur bruit sur un point choisi) : à relever une fois le point retenu.
