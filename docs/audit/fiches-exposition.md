# Audit du lot « Fiches des notions d'exposition, de mesure et de boîtier »

État : constats non contre-vérifiés.

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire.
- Version auditée : copie de travail à la version 0.3.58 ; les seize fiches datent de la version 0.3.40 (11 novembre 2026), EXP-06 complétée le même jour (0.3.42).
- Auteur : un agent de Claude. Un second agent doit encore essayer de réfuter chaque constat.
- Avancement : rapport en cours d'écriture ; ce qui reste à couvrir est listé à la fin de l'en-tête.

## Périmètre

- Fiches : `content/fr/notions/` et `content/en/notions/`, notions EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08 et BOI-12 (seize fichiers).
- Lus pour les juger : `docs/contenus.md`, `docs/cadrage.md`, les notions dans `data/referentiel/` (`exp.yaml`, `mes.yaml`, `boi.yaml`), `data/sources.yaml`, `docs/camera-physique.md` (sections « Exposition », « Boîtier virtuel », « Indicateur d'équilibre », « Modes de déclenchement », « Modes d'exposition, correction et ISO auto », « Défis et bulletin »), et le code que les fiches décrivent : `app/src/camera/exposure.ts`, `exposureModes.ts`, `bodies.ts`, `noise.ts`, `bulletin.ts`, `sharpZone.ts`, `faces.ts` ; `app/src/ui/cameraPanel.ts`, `balance.ts`, `shutter.ts`, `challenges.ts` ; `app/src/i18n.ts` ; `app/src/scene.ts` ; `app/simulateur/index.html`.
- Hors du lot : les autres fiches (rapport `fiches-mise-au-point.md`) ; le modèle physique lui-même (`modele-physique.md`, constats PHY-01 à PHY-21, auxquels ce rapport renvoie sans les refaire).

## Méthode

1. Lecture des seize fiches, phrase par phrase, français et anglais côte à côte.
2. Relecture de chaque source citée à son adresse, le 13 novembre 2026, quand l'hôte répond ; chaque affirmation de fiche est cherchée dans le texte extrait de la page enregistrée.
3. Chaque chiffre et chaque exercice est rejoué avec le code du simulateur : `exposure.ts`, `exposureModes.ts` et `sharpZone.ts` compilés hors du dépôt (`tsc`), puis appelés par des scripts (`exercices.cjs`, `etat_depart.cjs`) ; le rapport signal sur bruit est recalculé d'après `balance.ts` et `noise.ts` (`bruit_exp06.py`).
4. Chaque réglage, libellé et bouton nommé par une fiche est cherché dans le code de l'interface.
5. Aucun navigateur : ce que les fiches annoncent est établi par le code et le calcul, pas par un essai dans le simulateur affiché.

Pages enregistrées, textes extraits, scripts et leurs sorties : dossier `audit/fiches-exposition/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`, `*.out`). Rien n'y est gardé d'une session à l'autre : les preuves utiles sont recopiées ici.

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

### Non relues

| Source | Raison |
| --- | --- |
| Richard Butler, « What is ISO invariance, and should I care? », DPReview (`https://www.dpreview.com/articles/iso-invar/`) | L'hôte répond 403 avec une page « Just a moment... Enable JavaScript and cookies to continue » (contrôle contre les lectures automatiques), essayé deux fois le 13 novembre 2026. Seule lecture : le relevé de Julien du 11 novembre 2026, qui n'est pas dans le dépôt. |
| Spencer Cox, « ISO Invariance Explained », Photography Life (`https://photographylife.com/iso-invariance-explained`) | L'hôte répond 403 avec une page « Security Check […] Please solve the Captcha below to continue », essayé deux fois le 13 novembre 2026. Seule lecture : le relevé de Julien du 11 novembre 2026, qui n'est pas dans le dépôt. |

## Constats

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

- Conséquence : dans l'état où le simulateur s'ouvre, fermer le diaphragme ou raccourcir la pose ne fait bouger ni la cellule ni la luminosité du viseur (l'ISO monte à la place, jusqu'à 6400), et les boutons de la molette ISO ne changent pas la valeur affichée. Le débutant qui lit « montrent tout de suite l'effet » voit le contraire une fois sur deux. Le comportement lui-même est celui que la documentation annonce (`docs/camera-physique.md`, l. 489-492) ; ce sont les fiches qui ne le disent pas.
- Correction proposée : en tête de la section « Simulateur » des trois fiches, une phrase : « Au départ, l'ISO auto est activé, comme sur le Z 6 : l'appareil rattrape tes réglages en changeant la sensibilité. Désactive-le dans la fenêtre « Exposition » (touche l'indicateur d'exposition, voir MES-10) pour voir l'effet de chaque réglage seul. » ; dans EXP-06, préciser que la molette s'appelle « ISO auto » tant qu'il est activé. Même chose en anglais. Changer l'état de départ du simulateur est une autre option, qui relève de Julien.

### FEX-03 · incohérent · EXP-06, « Simulateur » : « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit »

- Endroit : `content/fr/notions/EXP-06.md`, l. 19 ; `content/en/notions/EXP-06.md`, l. 19 (« TutoPhoto stops where its noise measurements stop »).
- Preuve (source) : la page de Claff d'où viennent les mesures (`https://www.photonstophotos.net/Charts/RN_e.htm`, « Last revised: 2026-08-17 », fichier `ptp-RN_e.htm`) a des points au-delà d'ISO 6400 pour les six boîtiers. Série `Nikon Z 6_14` : 35 points, de ISO 50 à ISO 204 800, dont 13 au-dessus d'ISO 6400 ; les six premiers (ISO 8 045 à 25 600) sont en symboles pleins, dans la plage analogique (1,16 ; 1,13 ; 1,15 ; 0,95 ; 0,95 ; 0,97 électron). Sous-titre du graphique : « Open symbols indicate values outside the normal analog range ». Sony A7 III : 15 points au-dessus d'ISO 6400 ; Canon EOS RP : 10 ; Nikon D5600 et Sony A6000 : 6 ; Canon EOS 2000D : 1 (script `claff_z6.py`).
- Preuve (dépôt) : ce sont les séries recopiées dans `app/src/camera/bodies.ts` qui s'arrêtent à ISO 6400, parce que l'échelle du boîtier virtuel s'y arrête, et non l'inverse. `docs/camera-physique.md`, l. 101 : « Ces plages sont communes aux six boîtiers ; leurs plages réelles, souvent plus larges, viendront avec l'étape du bruit » ; `docs/questions-ouvertes.md`, l. 54 : « Extension des ISO au-delà de 6400 à décider ».
- Correction proposée : « (le Z 6 va jusqu'à ISO 51 200, et plus haut en réglages étendus ; TutoPhoto s'arrête à 6400, limite choisie pour ses six boîtiers et pas encore étendue) » ; en anglais : « (the Z 6 goes up to ISO 51200, and higher with extended settings; TutoPhoto stops at 6400, a limit chosen for its six bodies and not yet extended) ». La plage du Z 6 est dans la page déjà citée par la fiche : « in the case of the Z 6, of from ISO 100 to ISO 51200 ».

### FEX-04 · non sourcé · BOI-12 : les délais du retardateur ne sont pas dans les pages citées ; la cadence de 12 vues par seconde est donnée sans sa condition

- Endroit : `content/fr/notions/BOI-12.md`, l. 5 à 9 ; `content/en/notions/BOI-12.md`, l. 5 à 9.
- Ce qui est écrit : la liste est introduite par la seule page « The Release Mode/Self-Timer Button » ; « Retardateur : 2, 5, 10 ou 20 s (10 par défaut, « Defaults ») » ; « Continu L : de 1 à 5 vues par seconde […] (3 par défaut) » ; « Continu H (étendu) : 12 vues par seconde au Z 6 ».
- Preuve (sources relues) :
  - délais : la page « The Release Mode/Self-Timer Button » dit seulement « Rotate the sub-command dial to select the shutter-release delay » ; « Defaults » ne donne que « Self-timer delay 10 s » ; « c2: Self-Timer » dit « Choose the length of the shutter-release delay », sans valeurs. Les quatre valeurs sont dans « Specifications », que la fiche ne cite pas : « Self-timer : 2 s, 5 s, 10 s, 20 s; 1–9 exposures at intervals of 0.5, 1, 2, or 3 s » (`https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html`). `docs/camera-physique.md`, l. 431, le dit bien : « (fiche technique) » ;
  - « 3 par défaut » : absent de la page citée en tête de liste ; il est dans « Defaults » (« d1 CL mode shooting speed 3 fps »), citée deux lignes plus bas pour le seul retardateur ;
  - 12 vues par seconde : la page écrit « up to about 9 frames per second (Z 7) or 12 frames per second (Z 6) », et son tableau « Frame Advance Rate » donne pour le Z 6, en Continu H (étendu), 12 vps en JPEG/TIFF et en NEF 12 bits, 9 vps en NEF 14 bits (8 vps en mode silencieux). La fiche garde « jusqu'à environ » pour Continu H et l'enlève pour Continu H (étendu).
- Correction proposée : rattacher « 3 par défaut » et « 10 par défaut » à « Defaults », les délais à « Specifications » (source `nikon-z6-specifications`, à compléter dans `data/sources.yaml` avec les deux fiches dans `used_in`), et écrire « **Continu H (étendu)** : jusqu'à environ 12 vues par seconde au Z 6 (9 en NEF 14 bits) ». Même chose en anglais.

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
- Correction proposée : remplacer la dernière phrase par deux comparaisons annoncées. (1) « Passe à ISO 6400 sans rien changer d'autre : la photo est surexposée de 4,5 IL ; vise une ombre : le rapport signal sur bruit ne bouge presque pas, la lumière captée est la même. » (2) « Garde ISO 6400 et reviens à une exposition correcte, à 1/4000 s et f/9 : le capteur reçoit vingt fois moins de lumière qu'à ISO 320, et le rapport signal sur bruit est divisé par environ 4,5 (√20). » Je ne sais pas ce que vaut le point visé par défaut dans le viseur : à mesurer dans le navigateur avant d'écrire des valeurs dans la fiche.

## Vérifié

Rempli à la suite, voir plus bas dans les envois suivants.

## Je ne sais pas

1. Ce que disent les articles de DPReview et de Photography Life cités par EXP-06 (l. 7 à 13) : les deux hôtes refusent les lectures automatiques (403), et le relevé de Julien n'est pas dans le dépôt. Les passages de la fiche qui en viennent ne sont donc pas vérifiés ici, pas plus que les dates « publié le 27 juillet 2026, mis à jour le 16 septembre 2026 » et « mis à jour le 22 août 2022 ».
