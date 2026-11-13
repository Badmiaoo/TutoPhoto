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
- Correction proposée : (1) un seul nom, « l'indicateur d'exposition », décrit à sa première mention dans chaque fiche (« l'échelle de −3 à +3 sous le viseur, et le bouton qui affiche « M · −0,2 IL » ») ; (2) « magnifier » ; (3) les titres des balises `title` ; (4) dans les fiches françaises, le lien vers la page française quand elle existe, comme pour BOI-07.

### FEX-12 · à améliorer · Petites inexactitudes

1. `EXP-05.md`, l. 11 (fr, en) : « l'indicateur d'équilibre et le bulletin de la photo donnent la traînée du sujet visé ». Le bulletin donne la traînée du promeneur et du chien quand ils sont dans le cadre, visés ou non (`app/src/ui/challenges.ts`, l. 163-167) ; seul l'indicateur d'équilibre parle du sujet visé (`balance.ts`, l. 138-169, avec la réserve de PHY-17). Correction : « l'indicateur d'équilibre donne la traînée du sujet visé, le bulletin celle du promeneur et du chien s'ils sont dans le cadre, en pixels ».
2. `EXP-06.md`, l. 19 : « sont calculés […] et se voit » ; en anglais « are computed […] and shows ». Correction : « se voient », « show ».
3. `EXP-06.md`, l. 19 : « dans le viseur et sur la photo, à la loupe à 100 % ». Dans le viseur, le bruit de la loupe est sous-estimé sur les écrans de densité 2 ou plus (PHY-07) : la phrase sera juste une fois PHY-07 corrigé.
4. `MES-10.md`, l. 13 : « l'ISO auto descend jusqu'à ISO 100 » est donné comme une règle du manuel du D850, qui écrit « the minimum value for auto ISO sensitivity is automatically set to ISO 64 », sa sensibilité la plus basse. Le passage à ISO 100 est une transposition de TutoPhoto, dite dans `exposureModes.ts` (l. 15-17), pas dans la fiche. Correction : « l'ISO auto descend jusqu'à la sensibilité la plus basse du boîtier (ISO 64 sur le D850 ; ISO 100 ici) ».
5. `BOI-12.md`, l. 13 : « Non simulés : la mémoire tampon, le mode silencieux ». `docs/camera-physique.md`, l. 442, en liste deux de plus : l'exposition qui « may vary erratically » en Continu H (étendu), et plusieurs vues au retardateur. À ajouter, ou à renvoyer à la documentation.

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
26. « L'option « Automatique » […] : sa règle n'est pas publiée » : la page dit seulement « the camera will choose the minimum shutter speed based on the focal length of the lens ».
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

## Je ne sais pas

1. Ce que disent les articles de DPReview et de Photography Life cités par EXP-06 (l. 7 à 13) : les deux hôtes refusent les lectures automatiques (403), et le relevé de Julien n'est pas dans le dépôt. Les passages de la fiche qui en viennent ne sont donc pas vérifiés ici, pas plus que les dates « publié le 27 juillet 2026, mis à jour le 16 septembre 2026 » et « mis à jour le 22 août 2022 ».
