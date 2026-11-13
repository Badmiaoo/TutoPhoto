# Audit du lot « Fiches des notions et des situations »

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail à la version 0.3.58. Les fiches du lot datent du 11 novembre 2026 (versions 0.3.39 à 0.3.50).
- État : constats non contre-vérifiés.
- Étape : rapport en cours d'écriture ; les preuves prises dans un navigateur (recettes des trois situations, exercices de EXP-06, MAP-04 et MAP-05) arrivent dans la version finale.

## Périmètre

- Fiches de `content/fr/` et de `content/en/` : notions EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08, BOI-12, MAP-04, MAP-05, MAP-06, MAP-09, NET-01, NET-06, MVT-01, LUM-02 ; situations SIT-01, SIT-05, SIT-06. La phrase « Cadrage » de SIT-01, ajoutée le 12 novembre, est hors du lot.
- Activité de LUM-02 : `app/src/activities/lum02.ts`, ses textes, et `app/activites/LUM-02/index.html`.
- Lus pour confronter les fiches : `docs/contenus.md`, `app/src/camera/` (`exposure.ts`, `exposureModes.ts`, `sharpZone.ts`, `bulletin.ts`, `bodies.ts`, `autofocus.ts`, `faces.ts`, `noise.ts`), `app/src/ui/` (`cameraPanel.ts`, `balance.ts`, `challenges.ts`, `shutter.ts`, `topView.ts`), `app/src/scene.ts`, `app/src/i18n.ts`, `data/referentiel/`, `data/situations.yaml`, `data/sources.yaml`.
- Le modèle physique lui-même est un autre lot (`docs/audit/modele-physique.md`) : ses constats ne sont repris ici que quand une fiche en dépend.

## Méthode

1. Lecture de chaque fiche, phrase par phrase, en français puis en anglais.
2. Relecture de chaque source à son adresse quand l'hôte répond ; chaque affirmation est cherchée dans la page enregistrée.
3. Chaque chiffre est refait par un script (`calculs.py`), avec les formules du simulateur recopiées de `exposure.ts`, `exposureModes.ts`, `sharpZone.ts`, `bulletin.ts` et `balance.ts`, et les valeurs exactes des crans.
4. Chaque phrase des sections « Simulateur », « Activité », « Exercice », « Recette » et « Défi » est confrontée au code.
5. Position des yeux des personnages relue dans les fichiers glTF de la scène (`yeux_gltf.py`), pour juger les recettes et les défis.
6. Navigateur (site construit, rendu logiciel, fenêtre de 1280 × 800, densité 1) : seulement pour prouver un constat ou une recette.

Pages enregistrées, textes extraits et scripts : dossier `audit/fiches/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`). Les numéros de ligne sont ceux de la version 0.3.58.

## Sources

Toutes lues le 13 novembre 2026. Wikipedia est une source secondaire.

### Relues, citées par les fiches

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Wikipedia, « F-number », révision 1382682702 | adresse citée | `wiki-f-number-1382682702.html` |
| Wikipedia, « Shutter speed », révision 1382495283 | adresse citée | `wiki-shutter-speed-1382495283.html` |
| Wikipedia, « Film speed », révision 1383727213 | adresse citée | `wiki-film-speed-1383727213.html` |
| Wikipedia, « Circle of confusion », révision 1335590423 | adresse citée | `wiki-coc-1335590423.html` |
| Wikipedia, « Umbra, penumbra and antumbra », révision 1379008615 | adresse citée | `wiki-umbra-1379008615.html` |
| Nikon, manuel en ligne Z 7/Z 6 (en) : « The Mode Dial », « The S (ISO Sensitivity) Button », « The E (Exposure Compensation) Button », « The Release Mode/Self-Timer Button », « ISO Sensitivity Settings », « Defaults », « Indicators and Error Messages », « Focus », « a4: Auto-Area AF Face/Eye Detection » | adresses citées | `nikon-z6-en-*.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr) : « Sélecteur de mode », « Commande mode de déclenchement/retardateur », « Mise au point », réglage a4 | adresses citées | `nikon-z6-fr-*.html` |
| Nikon, manuel en ligne D850, « Auto ISO Sensitivity Control » | adresse citée | `nikon-d850-10_iso_sensitivity_02.html` |
| Sony, guide d'aide α9 (ILCE-9), « Focus Mode » | adresse citée | `sony-a9-focus-mode.html` |
| Nikon, communiqué du 23 août 2018 ; page du produit Z 6 | adresses citées | `nikon-news-2018-0823.html`, `nikon-z6-product.html` |
| Tiffen, guide Lowel « Foundations of Lighting: Understanding Soft Light » (page sans date) | adresse citée | `tiffen-soft-light.html` |
| Art Adams, « Lighting Strategies: What Makes Soft Lights Cast Soft Shadows? », ProVideo Coalition, 27 décembre 2011 | adresse citée | `pvc-adams-soft-light.html` |

### Lues en plus, pour vérifier ou proposer une correction

| Source | Adresse | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, manuel en ligne Z 7/Z 6 (en), « Specifications » | `https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html` | `nikon-z6-en-specifications.html` |
| Nikon, manuel en ligne Z 7/Z 6 (en), « a5: Focus Points Used », « c2: Self-Timer » | `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_a05.html`, `…_c02.html` | `nikon-z6-en-09_menu_guide_05_a05.html`, `…_c02.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr), « Réglage de la sensibilité », correction d'exposition, sensibilité | `https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_03_08.html`, `…/06_shooting_controls_02.html`, `…_03.html` | `nikon-z6-fr-*.html` |
| William J. Claff, PhotonsToPhotos, « Input-referred Read Noise versus ISO Setting » (« Last revised: 2026-08-17 ») | `https://www.photonstophotos.net/Charts/RN_e.htm` | `ptp-RN_e.htm` |
| Wikipedia, « Nikon D5600 » (révision 1345325532), « Canon EOS 2000D » (révision 1381131251) | `https://en.wikipedia.org/w/index.php?title=…&oldid=…` | `wiki-nikon-d5600-1345325532.html`, `wiki-canon-eos-2000d-1381131251.html` |

### Non relues

- Richard Butler, « What is ISO invariance, and should I care? », DPReview (`https://www.dpreview.com/articles/iso-invar/`) : source non relue, l'hôte répond 403 (« Just a moment... »). Seule lecture : le texte relevé par Julien le 11 novembre 2026, dont `data/sources.yaml` garde quatre extraits.
- Spencer Cox, « ISO Invariance Explained », Photography Life (`https://photographylife.com/iso-invariance-explained`) : source non relue, l'hôte répond 403 (« Security Check »). Même remarque.
- Canon Royaume-Uni, fiche de l'EOS RP (`https://www.canon.co.uk/cameras/eos-rp/specifications/`) : source non relue, l'hôte répond 403 (« Access Denied »).
- Sony Inde, page de l'α7 III (`https://www.sony.co.in/…/ilce-7m3-body-kit/feature2`) : source non relue, hôte non joignable.

## Constats

Rédaction en cours : la liste ci-dessous est complète pour les constats établis par les sources, le code et le calcul ; les preuves prises dans le navigateur y seront ajoutées.

### FIC-01 · faux · EXP-04 : aucune vitesse ne « met la cellule à 0 », et « +1 IL » ne s'affiche jamais

- Endroit : `content/fr/notions/EXP-04.md`, l. 17 ; `content/en/notions/EXP-04.md`, l. 17.
- Ce qui est écrit : « En mode M, sans ISO auto, règle f/5.6 et une vitesse qui met la cellule à 0. Trouve l'ouverture qui donne +1 IL sans toucher à la vitesse ni à l'ISO. »
- Preuve (calcul) : `exposureModes.ts`, l. 30-32, donne EV₁₀₀ = (a + s − i − 12) / 3 en indices de crans ; la scène est à 12,5 IL (`exposure.ts`, l. 38). L'écart vaut donc (49,5 − (a + s − i)) / 3 avec a + s − i entier : ±1/6, ±1/2, ±5/6…, jamais 0. `calculs.py`, à f/5.6 et ISO 100 : 1/125 s : +0,500 ; 1/160 s : +0,167 ; 1/200 s : −0,167 ; 1/250 s : −0,500. À f/4 : +0,833 à 1/200 s, +1,167 à 1/160 s.
- Preuve (code) : la cellule écrit l'écart à un chiffre après la virgule (`cameraPanel.ts`, l. 741-744 : `Math.abs(indicator).toFixed(1)`), soit « −0,2 IL » ou « +0,2 IL » au plus près, puis « +0,8 IL » ou « +1,2 IL » pour la réponse.
- Ce qui est juste : la réponse (f/4, un cran plus ouvert, (5,6 / 4)² ≈ 1,96).
- Réalisme : l'indicateur du Z 6 a une position « exposition optimale ». Manuel, « The Mode Dial », encadré « Exposure Indicators » : « the amount of under- or overexposure is shown in increments of 1/3 or 1/2 EV », avec les exemples « Optimal exposure », « Underexposed by 1/3 EV », « Overexposed by over 3 EV ». Dans TutoPhoto, aucun réglage manuel ne l'atteint : la scène est à un demi-cran de tous les réglages (choix de `exposureModes.ts`, l. 26-28 : « à égalité entre deux crans (la scène est à 12,5 IL), il prend celui qui assombrit la photo »).
- Même cause ailleurs : `EXP-05.md`, l. 15, écrit « la cellule descend de deux crans (−2 IL) » ; elle passe de « −0,2 IL » à « −2,2 IL ». `EXP-06.md` (l. 23) et `MES-04.md` (l. 13) le disent, eux (« −1/6 IL », « environ −0,2 IL »).
- Correction proposée :
  - fiche : « règle f/5.6 et 1/200 s : la cellule affiche −0,2 IL, au plus près de 0 (la scène tombe entre deux crans). Trouve l'ouverture qui ajoute 1 IL […]. Réponse : f/4 ; la cellule passe à +0,8 IL. » Dans EXP-05 : « la cellule descend de deux crans, de −0,2 à −2,2 IL » ;
  - à la racine, Julien tranche : placer la scène sur un cran (12⅓ ou 12⅔ IL), ou graduer l'indicateur par tiers comme le Z 6. Cela change la vue de départ, des exemples de la documentation et des contrôles de la routine : à traiter avec le lot « modèle physique » et la mesure de la lumière.

### FIC-02 · faux · EXP-06 : « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit »

- Endroit : `content/fr/notions/EXP-06.md`, l. 19 ; `content/en/notions/EXP-06.md`, l. 19 (« TutoPhoto stops where its noise measurements stop »).
- Ce qui est écrit : « La molette « ISO » va de 100 à 6400 par tiers de cran (le Z 6 va au-delà ; TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit). »
- Preuve (source) : la page de Claff d'où vient le bruit de lecture (`ptp-RN_e.htm`), série `Nikon Z 6_14` : `loEv: 5.00, hiEv: 13.00`, des points de x = 4,00 à x = 16,00. Avec ISO = 3,125 × 2^x : points pleins de ISO 100 à ISO 25600, symboles ouverts jusqu'à ISO 51200 (« Open symbols indicate values outside the normal analog range »), triangles jusqu'à ISO 204800 (« Triangle up indicates scaling »). Points pleins des autres boîtiers : Sony A7 III jusqu'à ISO 51200, Canon EOS RP jusqu'à ISO 40000 environ (x = 13,67), Canon EOS 2000D jusqu'à ISO 12800, Sony A6000 jusqu'à ISO 10000 environ (x = 11,67) ; seul le D5600 s'arrête avant (ISO 2546, voir PHY-02).
- Preuve (documentation) : `docs/camera-physique.md`, l. 102 : « Ces plages sont communes aux six boîtiers ; leurs plages réelles, souvent plus larges… ». ISO 6400 est un choix d'échelle, pas la fin des mesures ; `bodies.ts` n'a recopié les mesures que jusqu'à ISO 6400.
- Correction proposée : « (le Z 6 va jusqu'à ISO 51200 ; TutoPhoto s'arrête à ISO 6400, haut de l'échelle commune à ses six boîtiers) » ; en anglais : « (the Z 6 goes up to ISO 51200; TutoPhoto stops at ISO 6400, the top of the scale shared by its six bodies) ».

### FIC-03 · non sourcé · MAP-06 : « Hors de cette zone, l'appareil ne peut pas faire le point »

- Endroit : `content/fr/notions/MAP-06.md`, l. 5 ; `content/en/notions/MAP-06.md`, l. 5 (« Outside this area, the camera cannot focus »).
- Preuve : aucune des trois pages citées ne le dit. Le communiqué du 23 août 2018 : « the Z 6 has 273 focus points*, enabling broad coverage of approximately 90% of the imaging area both horizontally and vertically » ; la page du produit : « 273-point hybrid AF system offering accurate focus across 90% of the frame » ; la page « Focus » ne parle pas du bord du cadre. La phrase est une déduction, et elle est trop large : la mise au point manuelle reste possible partout (« Focus », « Manual Focus »).
- Correction proposée : « Les collimateurs ne couvrent que cette zone : en autofocus, on ne peut pas placer le point plus près du bord (déduction de TutoPhoto, les pages lues ne le disent pas). » ; « The focus points only cover this area: with autofocus, the point cannot be placed closer to the edge (TutoPhoto's deduction; the pages read do not say so). »

### FIC-04 · non sourcé · SIT-05 et MAP-05 : « souvent le sol devant les pieds », une règle du simulateur donnée pour celle du boîtier

- Endroit : `content/fr/situations/SIT-05.md`, l. 11 (« Attention à la zone large : elle prend le sujet le plus proche, souvent le sol devant les pieds ») ; `content/fr/notions/MAP-05.md`, l. 16 (« la zone large fait le point plus près, sur le sol […] parce qu'elle prend le sujet le plus proche ») ; mêmes lignes en anglais.
- Preuve (source) : le manuel dit seulement « If the selected focus area contains subjects at different distances from the camera, the camera will assign priority to the closest subject » (« Focus », AF zone large). Il ne dit pas que le sol compte comme un sujet.
- Preuve (code) : `autofocus.ts`, l. 18-20 : « ici, la plus petite distance de la zone », sol invisible compris (l. 35) ; l. 30-33 : « Non simulé : […] la taille minimale d'un sujet pour qu'une zone large le retienne ». Le simulateur prend le point le plus proche de la zone, quel qu'il soit : c'est un choix de TutoPhoto.
- Preuve (calcul) : « souvent » ne tient pas quand la zone est posée sur un visage. Au 50 mm, cadre horizontal, la zone large (L) fait 20 % du grand côté (`cameraPanel.ts`, l. 116), soit 7,18 mm sur le capteur. Centrée sur l'œil de Sophia (38,7 % de la hauteur du cadre), elle descend jusqu'à 53,8 % de la hauteur, soit 1,09 m au-dessus du sol à 6,5 m ; le sol au pied du groupe n'apparaît qu'à 88,4 % de la hauteur. La zone ne contient alors que les personnages.
- Correction proposée :
  - SIT-05 : « Attention à la zone large : elle fait le point au plus près dans la zone. Posée sur les pieds, elle prend le sol devant le groupe ; posée sur un visage, elle reste sur les personnages (MAP-05). »
  - MAP-05, section « Simulateur » : ajouter « Dans la zone, TutoPhoto retient le point le plus proche, même le sol : le manuel parle du sujet le plus proche, sans dire ce qui compte comme un sujet. »

### FIC-05 · non sourcé · BOI-12 : les délais du retardateur ne sont dans aucune des pages citées

- Endroit : `content/fr/notions/BOI-12.md`, l. 9 (« **Retardateur** : 2, 5, 10 ou 20 s (10 par défaut, « Defaults ») ») et l. 8 ; mêmes lignes en anglais.
- Preuve : la page citée en tête (« The Release Mode/Self-Timer Button ») dit seulement « Rotate the sub-command dial to select the shutter-release delay » ; « Defaults » donne « Self-timer delay 10 s ». La liste est dans « Specifications », que la fiche ne cite pas : « Self-timer : 2 s, 5 s, 10 s, 20 s; 1–9 exposures at intervals of 0.5, 1, 2, or 3 s ». `docs/camera-physique.md` (l. 431) dit bien « (fiche technique) ».
- Deuxième point, l. 8 : « **Continu H (étendu)** : 12 vues par seconde au Z 6 ». La page lue dit « up to about 9 frames per second (Z 7) or 12 frames per second (Z 6) », et « Specifications » : « High-speed continuous (extended) : 12 fps (14-bit NEF/RAW: 9 fps) ». Le texte de l'interface le précise (« pour le JPEG »), pas la fiche.
- Correction proposée : citer « Specifications » (`https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html`, entrée `nikon-z6-specifications` de `data/sources.yaml`) pour les délais ; écrire « jusqu'à 12 vues par seconde au Z 6 (9 en NEF 14 bits) ».

### FIC-06 · non sourcé · MES-10 : « sa règle n'est pas publiée »

- Endroit : `content/fr/notions/MES-10.md`, l. 13 ; `content/en/notions/MES-10.md`, l. 13 (« its rule is not published »).
- Ce qui est écrit : « L'option « Automatique » de la vitesse minimale n'est pas simulée : sa règle n'est pas publiée. »
- Preuve : la fiche ne peut pas affirmer qu'une règle n'est publiée nulle part ; seules les pages lues comptent. Et la page citée en dit plus que la fiche : « If Auto is selected […], the camera will choose the minimum shutter speed based on the focal length of the lens. For example, the camera will automatically select fast minimum shutter speeds to reduce the blur that commonly occurs with telephoto lenses. » (« ISO Sensitivity Settings »).
- Correction proposée : « L'option « Automatique » n'est pas simulée : le manuel dit qu'elle choisit la vitesse minimale d'après la focale, plus rapide au téléobjectif, sans donner la règle. TutoPhoto part de 1/30 s. » (valeur de départ : `cameraPanel.ts`, l. 100).

### FIC-07 · incohérent · EXP-06 : l'exercice ne peut pas se conclure tel qu'il est écrit

- Endroit : `content/fr/notions/EXP-06.md`, l. 23 ; `content/en/notions/EXP-06.md`, l. 23.
- Ce qui est écrit : « En mode M, sans ISO auto, impose f/4 et 1/1000 s. […] Compare le bruit au point visé à ISO 320 et à ISO 6400. »
- Preuve (calcul) : à f/4 et 1/1000 s, ISO 6400 donne +4,5 IL : la lumière affichée est multipliée par 22,6. L'indicateur d'équilibre n'écrit plus de rapport signal sur bruit dès que la valeur visée atteint 0,99 (`balance.ts`, l. 179-181 : « hautes lumières écrêtées au point visé »), c'est-à-dire pour tout ton qui vaut plus de 4,4 % de la saturation à l'exposition correcte (`calculs.py`). Pour un ton plus sombre, la même lumière est captée aux deux réglages et le rapport ne change presque pas : 68:1 à ISO 320 et 69:1 à ISO 6400 pour un ton à 2 %, 97:1 et 98:1 pour un ton à 4 % (formule de `balance.ts`, l. 183-187, Z 6).
- Conséquence : le débutant, qui attend plus de bruit à ISO 6400, lit soit « hautes lumières écrêtées », soit le même rapport. C'est pourtant ce que demande la fiche du référentiel (`data/referentiel/exp.yaml`, EXP-06 : « Même lumière captée, ISO variable : la luminosité change, le rapport signal/bruit presque pas ») ; la fiche ne dit ni quoi observer ni quoi en conclure.
- Correction proposée : écrire la suite de l'exercice en deux temps, avec ce qu'on doit voir :
  1. « À f/4 et 1/1000 s, vise une zone sombre et immobile (le sol à l'ombre), puis passe de ISO 320 à ISO 6400 : la photo s'éclaircit de 4,3 IL, les zones claires sont écrêtées, et le rapport signal sur bruit ne bouge presque pas : la lumière captée est la même. »
  2. « Reviens à ISO 320, puis ferme et raccourcis la pose pour retrouver la même exposition à ISO 6400 (f/9 et 1/4000 s) : le rapport signal sur bruit chute, parce que l'appareil capte 20 fois moins de lumière. »
  Les valeurs sont à relever dans le simulateur avant d'être écrites.

### FIC-08 · incohérent · MAP-04 et EXP-05 prêtent au bulletin ce qu'il n'affiche pas

- Endroit : `content/fr/notions/MAP-04.md`, l. 17 ; `content/fr/notions/EXP-05.md`, l. 11 ; mêmes lignes en anglais.
- MAP-04, ce qui est écrit : « En AF-S, verrouille la mise au point sur le groupe (6,5 m) puis photographie le chien quand il passe : le bulletin le dit hors de la zone nette à f/2. »
- Preuve (code) : sans défi, le bulletin a quatre sortes de lignes : exposition, limites de la zone nette, bruit, traînée des sujets en mouvement (`challenges.ts`, l. 153-167). Qu'un sujet soit dans la zone nette n'est écrit que par les critères d'un défi (`challenges.ts`, l. 168 : `if (extra.challenge)`). L'exercice ne dit de choisir le défi SIT-06 qu'à sa dernière phrase.
- MAP-04, deuxième point : « Recommence en AF-C […] : le défi SIT-06 peut réussir. » Ni le mode ni la vitesse ne sont dits. Aux réglages de départ (mode M, 1/100 s), le chien laisse 0,19 mm, 6,7 fois la limite : le critère « figé » échoue quelle que soit la mise au point. En mode A à f/2, l'appareil prend 1/1600 s et le défi peut réussir (`calculs.py`).
- EXP-05, ce qui est écrit : « l'indicateur d'équilibre et le bulletin de la photo donnent la traînée du sujet visé, en pixels ». Le bulletin donne la traînée du promeneur et du chien quand ils sont dans le cadre, visés ou non (`challenges.ts`, l. 163-167) ; MVT-01 (l. 11) le dit juste.
- Correction proposée :
  - MAP-04 : « Choisis le défi SIT-06 et le mode A à f/2. En AF-S, verrouille la mise au point sur le groupe (6,5 m), puis photographie le chien quand il passe : le bulletin écrit « Manqué : chien dans la zone nette », la zone nette s'arrêtant à 7,6 m. Recommence en AF-C […] : le défi peut réussir. » ;
  - EXP-05 : « l'indicateur d'équilibre donne la traînée du sujet visé, le bulletin celle du promeneur et du chien, en pixels ».

### FIC-09 · incohérent · Trois noms pour le même affichage ; chiffres écrits autrement que dans l'interface

- Endroit et preuve :
  - « la cellule » dans `EXP-04.md` (l. 13 et 17) et `EXP-05.md` (l. 11 et 15) ; « l'indicateur d'exposition » dans `MES-04.md` (l. 5 et 9), `BOI-07.md` (l. 5) et `BOI-08.md` (l. 5) ; « Exposition » sur l'écran (`i18n.ts`, l. 26). En anglais : « the meter » contre « the exposure indicator » contre « Exposure » (`i18n.ts`, l. 260). Le manuel du Z 6 dit « exposure indicators » ; il n'y a pas de cellule dans TutoPhoto (voir FIC-11) ;
  - `content/en/notions/EXP-06.md`, l. 19 : « with the 100% loupe » ; le bouton anglais s'appelle « Magnifier » (`i18n.ts`, l. 435) ;
  - les fiches françaises écrivent « f/5.6 », « f/1.4 », « f/2.5 » ; l'interface française affiche « f/5,6 », « f/1,4 », « f/2,5 » (`cameraPanel.ts`, l. 694-699).
- Correction proposée : un seul nom, celui du manuel : « l'indicateur d'exposition » et « the exposure indicator », dans les fiches comme dans le texte d'aide de l'interface ; « magnifier » dans la fiche anglaise ; choisir une écriture des ouvertures en français (celle de l'interface, à virgule, ou celle des objectifs, à point) et la tenir des deux côtés. Julien tranche.

### FIC-10 · à améliorer · La vitesse s'arrête à 1/4000 s, le Z 6 à 1/8000 s : les fiches ne le disent pas

- Endroit : `content/fr/notions/EXP-05.md`, l. 11 (« va de 30 s à 1/4000 s ») ; `content/fr/notions/BOI-07.md`, l. 9 (« elle clignote hors des limites (30 s à 1/4000 s) ») ; `content/fr/notions/BOI-08.md`, l. 13 (« passe à 1/4000 s ») ; les trois recettes (« boîtier de TutoPhoto (Nikon Z 6, 50 mm) ») ; mêmes lignes en anglais.
- Preuve (source) : « Shutter speed can be set to “×200” or to values between 30 s and 1/8000 s » (« The Mode Dial », modes S et M) ; « Specifications » : « 1/8000 – 30 s in steps of 1/3 or 1/2 EV, bulb, time, X200 ». `exposure.ts`, l. 18-25 : échelle de 30 s à 1/4000 s.
- Ce qui est juste : EXP-06 le dit pour l'ISO (« le Z 6 va au-delà »).
- Correction proposée : dans EXP-05, « (le Z 6 va jusqu'à 1/8000 s ; TutoPhoto s'arrête à 1/4000 s, échelle commune à ses six boîtiers) » ; dans BOI-07, « hors des limites de TutoPhoto (30 s à 1/4000 s) ».

### FIC-11 · à améliorer · Aucune fiche ne dit que le simulateur ne mesure pas la lumière ; MES-04 en perd son sens

- Endroit : `content/fr/notions/MES-04.md`, l. 5, 9 et 13 ; aussi `EXP-04.md` (l. 13), `EXP-05.md` (l. 11), `BOI-07.md`, `BOI-08.md`, `MES-10.md` ; mêmes fiches en anglais.
- Preuve (code) : `exposure.ts`, l. 38 et 75, et `exposureModes.ts`, l. 82 : l'exposition « proposée par l'appareil » vise la constante `SCENE_EV100 = 12.5`, quel que soit le cadrage. `docs/etat-des-travaux.md`, l. 83 : « le simulateur n'a aucune mesure de la lumière ». Le constat PHY-12 le relève pour la documentation et l'interface ; les fiches ne le disent nulle part.
- Conséquence pour MES-04 : la fiche explique que la correction « modifie l'exposition proposée par l'appareil pour rendre la photo plus claire ou plus sombre », et l'exercice remplace « rendre la neige blanche » par +1 IL en mode A. Dans TutoPhoto, l'exposition proposée est toujours celle que le simulateur juge correcte : avec +1 IL, le bulletin écrit « Exposition : +0,8 IL », une photo surexposée. Le débutant n'y voit pas pourquoi on corrige (une cellule trompée par une scène claire ou sombre).
- Correction proposée : dans la section « Simulateur » de MES-04, « TutoPhoto ne mesure pas encore la lumière : l'indicateur donne la même valeur quel que soit le cadrage, et l'exposition proposée est toujours celle que le simulateur juge correcte. La correction n'y sert qu'à voir son effet ; son usage réel (neige, contre-jour) attend la mesure de la lumière. » ; une phrase de renvoi dans EXP-04 et EXP-05. Provisoire : la mesure de la lumière est dans la file de travail.

### FIC-12 · à améliorer · NET-06 : en avançant l'appareil, le fond photo ne change pas ; la fiche ne le dit pas

- Endroit : `content/fr/notions/NET-06.md`, l. 11 ; `content/en/notions/NET-06.md`, l. 11.
- Ce qui est écrit : « Le fond photo à 360° est à 500 m, ce qui revient à l'infini. »
- Preuve (code) : `topView.ts`, l. 11-12 : « Non simulé : déplacer les personnages ; le fond photo à 360° est pris d'un seul point, et ce qu'il montre (arbres, bâtiments) ne change pas de perspective quand l'appareil se déplace. » La fiche dit la première limite (les personnages), pas la seconde.
- Conséquence : l'exercice fait avancer l'appareil de 3 m. Dans un vrai parc, les arbres proches grossiraient et se décaleraient ; ici ils ne bougent pas, et leur flou est celui de l'infini (0,094 mm à 500 m contre 0,095 mm à l'infini, `calculs.py`), quelle que soit leur distance réelle.
- Correction proposée : ajouter « Le fond est une photo prise d'un seul point : quand l'appareil se déplace, les arbres et les bâtiments qu'elle montre ne changent ni de taille ni de place, et leur flou est celui d'un fond à l'infini. »

### FIC-13 · à améliorer · MAP-06 : la couverture du Z 6 prêtée aux deux reflex, sans dire que ce n'est pas sourcé

- Endroit : `content/fr/notions/MAP-06.md`, l. 9 (« Les boîtiers dont la couverture n'est pas encore chiffrée gardent celle du Z 6 ») ; `content/en/notions/MAP-06.md`, l. 9.
- Preuve (code) : `cameraPanel.ts`, l. 64-66 : « les autres gardent celle du Z 6, ce qui n'est pas sourcé pour eux (décision de Julien du 11 novembre 2026 : hybrides ajoutés une fois lus, reflex en V2) ». La fiche dit « non sourcé » pour le partage égal du Sony A7 III, pas pour ce report.
- Preuve (source secondaire, lue pour l'audit) : Wikipedia, « Nikon D5600 », révision 1345325532 : « 39 point AF sensor with 9 central cross-type points » ; Wikipedia, « Canon EOS 2000D », révision 1381131251 : « 9 AF points with 1 cross-type point in the center ». Deux reflex, dont l'autofocus du viseur n'a pas la construction de celui d'un hybride. Je ne sais pas quelle part du cadre ces points couvrent : aucune page lue ne le dit.
- Correction proposée : « Les trois autres boîtiers gardent la couverture du Z 6, ce qui n'est pas sourcé : pour le Sony A6000 la valeur reste à lire, et les deux reflex (Nikon D5600, Canon EOS 2000D) ont un autofocus de viseur à 39 et 9 points, dont la couverture n'est pas lue. »

### FIC-14 · à améliorer · MVT-01 : le critère « figé » est un choix de TutoPhoto, et il ne juge que le déplacement d'ensemble

- Endroit : `content/fr/notions/MVT-01.md`, l. 5 et 11 ; `content/en/notions/MVT-01.md`, l. 5 et 11.
- Ce qui est écrit : « On juge le sujet figé quand cette traînée reste sous le flou acceptable, la diagonale du capteur divisée par 1500 », avec l'article « Circle of confusion » pour source ; et « La photo calculée montre le flou de mouvement réel ».
- Preuve : l'article donne d / 1500 pour le flou de mise au point. Il dit aussi, dans sa partie historique, que la limite a servi pour le mouvement (« The common 1/100 inch CoC limit has been applied to blur other than defocus blur », règle de Wall, 1889 ; constat PHY-20). Prendre d / 1500 pour le mouvement reste un choix de TutoPhoto, que la fiche présente comme une règle.
- Preuve (code) : la traînée jugée est celle du déplacement du sujet à vitesse constante, 3,5 m/s pour le chien, 1,25 m/s pour le promeneur (`scene.ts`, l. 172-178 ; `bulletin.ts`, l. 91-98). Les pattes du chien et les bras du promeneur vont plus vite que le corps : la photo calculée les montre flous à une vitesse où le bulletin écrit « figé ». Et l'appareil reste immobile pendant la pose (constat PHY-01) : pas de filé.
- Correction proposée : « TutoPhoto juge le sujet figé quand […] : il applique au mouvement la limite du flou de mise au point, comme on le faisait déjà en 1889 (même source) ; c'est un choix. Le bulletin juge le déplacement du corps : les pattes du chien, plus rapides, peuvent rester floues. » ; remplacer « le flou de mouvement réel » par « le flou de mouvement calculé ».

### FIC-15 · à améliorer · SIT-01 : la lumière, qui est dans le titre, n'est pas dans la recette

- Endroit : `content/fr/situations/SIT-01.md`, l. 1, 5, 9-14 et 22 ; `content/en/situations/SIT-01.md`, mêmes lignes.
- Preuve : le titre est « Portrait à l'ombre ou par ciel couvert » ; la section « Notions » cite « LUM-02 Lumière dure ou douce » ; aucune ligne de la recette ne parle de lumière ni ne renvoie à LUM-02. L'exercice de LUM-02 porte pourtant sur ce portrait (« Pour le portrait de Sophia […] »).
- Correction proposée : une ligne de recette, « **Lumière** : par ciel couvert, tout le ciel est la source, bien plus grande que Sophia : lumière douce, ombres peu marquées (LUM-02). Rien à régler : la scène n'a que cette lumière. »

### FIC-16 · à améliorer · EXP-06 : explication trop dense pour un débutant ; une faute d'accord

- Endroit : `content/fr/notions/EXP-06.md`, l. 7 et 19 ; `content/en/notions/EXP-06.md`, l. 7 et 19.
- Preuve : la fiche est de niveau N1 (`data/referentiel/exp.yaml`). Le deuxième paragraphe enchaîne « amplifient davantage le signal », « la plage du convertisseur », « plage dynamique » et la définition d'un capteur « ISO invariant », sans exemple. L'idée que la fiche du référentiel met en tête (« L'ISO éclaircit sans ajouter de lumière ») n'est écrite nulle part en une phrase simple. Je n'ai pas pu relire l'article de DPReview : je ne sais pas si la fiche le résume juste (voir « Je ne sais pas »).
- Faute : l. 19, « Le bruit photonique et le bruit de lecture sont calculés […] et se voit dans le viseur » ; en anglais, « are computed […] and shows in the viewfinder ».
- Correction proposée : ouvrir l'explication par « Monter l'ISO éclaircit la photo sans ajouter de lumière. » ; garder le mécanisme (moins de lumière captée, donc plus de bruit ; un cran d'ISO coûte un cran de hautes lumières) ; déplacer l'invariance ISO dans une phrase de fin, ou dans une notion de niveau supérieur ; écrire « se voient » et « show ».

### FIC-17 · à améliorer · Formulations ambiguës dans quatre exercices

- `content/fr/notions/BOI-07.md`, l. 13 : « ouvre à f/2 ou plus ». Un débutant peut lire « f/2 ou un nombre plus grand », l'inverse de ce qui est voulu ; l'anglais dit « f/2 or wider ». Correction : « ouvre à f/2 ou plus grand ouvert (f/1.8, f/1.4) ».
- `content/fr/notions/MAP-09.md`, l. 13 : « l'appareil prend le visage le plus proche du point de départ ». Le code prend le visage le plus proche du point de mise au point (`autofocus.ts`, l. 21-24 ; `faces.ts`, `nearestFace`), au centre du cadre tant qu'on n'a rien touché (`cameraPanel.ts`, l. 277). Correction : « le visage le plus proche du point de mise au point, au centre du cadre au départ » ; « the face closest to the focus point, at the centre of the frame at start ».
- `content/fr/notions/LUM-02.md`, l. 23 : « compare le plein soleil et le ciel couvert de la scène de parc ». La scène n'a que le ciel couvert (`SIT-06.md`, l. 5). Correction : « compare un plein soleil, que TutoPhoto ne montre pas, et le ciel couvert de la scène de parc ».
- `content/fr/notions/MAP-05.md`, l. 16 : « (environ 5,8 m contre 6,1 m) » ne vaut qu'en cadre horizontal. En cadre vertical (téléphone tenu droit), la zone couverte descend plus bas : 4,8 m contre 6,1 m (`calculs.py`). La dernière phrase (« Choisis ensuite le mode adapté à chacun des trois défis et explique ton choix ») n'a pas de réponse, et ne dit pas qu'elle adapte l'exercice du référentiel (« quatre scènes »), ce que font les autres fiches. Correction : écrire « en cadre horizontal », et donner la réponse (SIT-01 : point sélectif sur l'œil ou zone automatique ; SIT-05 : zone automatique ou point sélectif sur un visage ; SIT-06 : zone automatique avec la détection des animaux).

### FIC-18 · à améliorer · Wikipedia n'est dite « source secondaire » que dans LUM-02

- Endroit : `EXP-04.md` (l. 5), `EXP-05.md` (l. 5), `EXP-06.md` (l. 15), `NET-01.md` (l. 5), `NET-06.md` (l. 5), `MVT-01.md` (l. 5), en français et en anglais ; `LUM-02.md`, l. 11, le dit (« source secondaire »).
- Preuve : les six fiches citent une révision de Wikipedia comme seule source d'une définition ou d'une formule, sans la qualifier. `data/sources.yaml` le dit pour chaque entrée.
- Correction proposée : ajouter « source secondaire » à ces six citations, comme dans LUM-02.

### FIC-19 · à améliorer · Activité de LUM-02 : la pénombre annoncée peut dépasser le mur dessiné

- Endroit : `app/src/activities/lum02.ts`, l. 165 et 175-181 ; `app/activites/LUM-02/index.html`, l. 28 et 30.
- Preuve (calcul) : le mur est dessiné de −100 à +100 cm (l. 175-181), dans une vue de −110 à +110 cm (l. 165). Les curseurs vont jusqu'à une source de 150 cm à 20 cm de l'objet : pénombre de 375 cm de chaque côté, bord extérieur à ±240 cm (`calculs.py`). Le texte annonce alors une largeur que le schéma ne peut pas montrer, et les rayons sortent de la vue. Les trois exemples tiennent dans le mur (bord extérieur à ±23, ±34 et ±49 cm).
- Correction proposée : écrire « (au-delà du mur dessiné) » quand le bord extérieur de la pénombre dépasse 100 cm, ou borner la distance minimale selon la taille de la source.

## Vérifié

À écrire dans la version finale.

## Je ne sais pas

À écrire dans la version finale.
