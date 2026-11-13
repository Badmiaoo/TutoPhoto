# Audit du lot « Modèle physique de l'appareil »

> **Bilan de la contre-vérification, 13 novembre 2026 : 19 constats confirmés, 1 réfuté (PHY-16), 1 ajouté (PHY-21). Constat ajouté, contre-vérifié à son tour le 13 novembre 2026 par un troisième agent : 1 confirmé (PHY-21, mesuré dans un navigateur ; correction à corriger), 0 réfuté.** Rapport écrit par un agent de Claude le 12 novembre 2026, à la demande de Julien. Un second agent a ensuite essayé de réfuter chaque constat : il a relu l'endroit visé, relu les sources à leur adresse et refait les calculs avec ses propres scripts ; son verdict est écrit sous chaque constat. Corrections réduites ou corrigées : PHY-05, PHY-06, PHY-08, PHY-11, PHY-13, PHY-14 et PHY-17. Gravité à baisser : PHY-02 (le rendu ne change pas) et PHY-10. À corriger d'abord : PHY-06 (éclairage des objets 3D environ deux fois plus fort que le fond, étalonnage annoncé absent du code ; à mesurer dans un rendu avant tout réglage), PHY-01 (filé annoncé à tort), PHY-07 et PHY-08 (bruit de la loupe et plafond du flou du viseur à densité 2), PHY-21 (flou tronqué quand le calcul d'une photo est interrompu), PHY-09 (texte de l'interface). Le reste relève de la documentation : sources à citer, limites à écrire.

- Date : 12 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire.
- Version auditée : copie de travail à la version 0.3.56, pour ce qui date de la version 0.3.53 ou d'avant. Hors du lot : la routine dans la CI (0.3.54), la progression du chargement (0.3.55), les grilles de cadrage (0.3.56).
- Bilan de l'audit du 12 novembre : 20 constats (2 « faux », 3 « non sourcé », 5 « incohérent », 10 « à améliorer »), 41 points vérifiés et justes, 16 « Je ne sais pas ». Les formules du cœur du modèle (exposition, bruit, cercle de confusion, zone nette, traînée, modes A et S) sont celles de leurs sources, et tous les exemples chiffrés se recalculent, à la valeur des libellés près (PHY-16). Les défauts sont aux bords : ce que la documentation promet et que le code ne fait pas (filé, étalonnage), et ce que le passage à la densité de l'écran (0.3.52) a changé sans que le bruit et le flou du viseur suivent.

## Périmètre

- Code : `app/src/camera/` (`exposure.ts`, `exposureModes.ts`, `noise.ts`, `photo.ts`, `viewfinderDof.ts`, `viewfinder.ts`, `sharpZone.ts`, `bulletin.ts`, `autofocus.ts`, `faces.ts`, `bodies.ts`) ; ce que calculent `app/src/ui/cameraPanel.ts`, `balance.ts`, `topView.ts` et `shutter.ts` ; `app/src/scene.ts`.
- Documentation : `docs/camera-physique.md` en entier, sauf la section « Grilles de cadrage (version 0.3.56) ».
- Les textes de l'interface (`app/src/i18n.ts`) sont lus quand ils décrivent le modèle. Les fiches (`content/`) sont un autre lot.

## Méthode

1. Lecture complète du code et de la documentation du lot.
2. Relecture de chaque source à son adresse, quand l'hôte répond. Chaque citation de la documentation et du code est cherchée mot pour mot dans la page enregistrée.
3. Chaque calcul et chaque exemple chiffré est refait par un script.
4. Le code est confronté à la documentation. Les modules sans rendu (`exposure.ts`, `exposureModes.ts`) sont compilés hors du dépôt et essayés sur 5 241 600 combinaisons de réglages.
5. Aucun navigateur : les mesures faites dans le viseur (bruit, flou, temps de calcul) ne sont pas refaites. `npx tsc --noEmit` passe.

Pages enregistrées, textes extraits et scripts : dossier `audit/physique/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`). Les numéros de ligne sont ceux de la version 0.3.56.

### Contre-vérification (13 novembre 2026)

1. Pour chaque constat : relecture du code et de la documentation à l'endroit cité, dans la version courante (0.3.58).
2. Sources relues à leur adresse le 13 novembre 2026, et citations cherchées mot pour mot dans les pages enregistrées (liste plus bas).
3. Calculs refaits par des scripts écrits pour la contre-vérification, sans reprendre ceux de l'audit : séries du bruit de lecture et capacités (`rn2.py`), fond JPEG et fichier HDR (`fond.py`, `fond2.py`), exemples de la documentation, diffraction, champ et définition des capteurs (`exemples.py`), densité de l'écran (`densite.py`), disque d'ouverture d'une photo interrompue (`disque_tronque.py`).
4. Recherche, dans le reste du dépôt, de ce qui dirait déjà le constat ou le contredirait.
5. Aucun navigateur : PHY-06, PHY-07, PHY-08 et PHY-21 sont établis par le code, les fichiers et le calcul, pas par une mesure dans un rendu.

Pages et scripts : dossier `audit/physique/refutation/` du bloc-notes de la session, hors du dépôt (`pages/`, scripts à la racine). Les numéros de ligne des constats sont ceux de la version 0.3.56 ; depuis, la version 0.3.57 a décalé `photo.ts` (de 4 à 6 lignes), `shutter.ts` (de 2 à 5 lignes), `i18n.ts` (de 21 lignes après la l. 207) et la fin de `docs/camera-physique.md` (de 51 ou 52 lignes après la l. 585 : la l. 641 est devenue la l. 693). Les contre-vérifications donnent les lignes courantes quand elles diffèrent.

### Contre-vérification du constat ajouté (13 novembre 2026)

PHY-21, ajouté par le second agent, n'avait été contre-vérifié par personne. Un troisième agent l'a repris :
1. code et documentation relus à l'endroit cité ; recherche, dans le dépôt, de ce qui dirait déjà le constat ;
2. calcul refait par un script écrit pour cela (`phy21.py`) : disque couvert par un calcul interrompu, puis correction proposée essayée pour tous les nombres de rendus de 16 à 256 ;
3. journal de la routine de la CI du 13 novembre 2026 lu (job « routine (ordinateur) » de la pull request 64) ;
4. essai dans Chromium sans écran (rendu logiciel, Playwright 1.63.0), sur deux constructions faites hors du dépôt : le code non modifié, et une copie de `photo.ts` qui accepte un plafond de temps réglable, un arrêt forcé après n rendus et un autre ordre de parcours. Le flou du fond est mesuré par l'ajustement d'un disque sur une photo de référence à f/22 (`ajuste.py`). Cet essai n'émule pas un processeur graphique.

Scripts, photos et résultats : dossier `audit/physique/contre2/` du bloc-notes de la session, hors du dépôt.

## Sources

Toutes lues le 12 novembre 2026. Wikipedia est une source secondaire.

### Relues, citées par le lot

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Romain Guy et Mathias Agopian, *Physically Based Rendering in Filament*, « Physically based camera », commit e8669b6 | `raw.githubusercontent.com/google/filament/e8669b6…/docs/Filament.md.html` (l'adresse `github.com/…/blob/…` citée répond 403 ; même fichier, même commit) | `filament-e8669b6.md.html` |
| Wikipedia, « Exposure value », révision 1352562239 | adresse citée | `wiki-exposure-value-1352562239.html` |
| Wikipedia, « Circle of confusion », révision 1335590423 | adresse citée | `wiki-circle-of-confusion-1335590423.html` |
| Wikipedia, « Film speed », révision 1383727213 | adresse citée | `wiki-film-speed-1383727213.html` |
| Wikipedia, « F-number » (1382682702), « Shutter speed » (1382495283), « Bayer filter » (1384004962), « Image sensor format » (1374408806), « Sony α6000 » (1380408739) | adresses citées | `wiki-*.html` |
| William J. Claff, PhotonsToPhotos, « Input-referred Read Noise versus ISO Setting » (« Last revised: 2026-08-17 ») | adresse citée | `ptp-RN_e.htm` |
| William J. Claff, PhotonsToPhotos, « DxOMark Derived Sensor Characteristics » (« Last revised: 2025-12-15 ») | adresse citée | `ptp-Sensor_Characteristics.htm` |
| Nikon, manuel en ligne Z 7/Z 6 (en) : Specifications, Focus, The Mode Dial, ISO Sensitivity Button, Exposure Compensation Button, Release Mode/Self-Timer Button, Defaults, ISO sensitivity settings, a4, c2, d1, d2, d8, Indicators and Error Messages | adresses citées | `nikon-z6-*.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr), pour les termes français : Mise au point, Sélecteur de mode, mode de déclenchement, Réglage de la sensibilité, a4 | adresses citées | `nikon-z6-fr-*.html` |
| Nikon, manuel en ligne D850, « Auto ISO Sensitivity Control » | adresse citée | `nikon-d850-10_iso_sensitivity_02.html` |
| Nikon, manuel en ligne COOLPIX P1100, « AF area mode » | adresse citée | `nikon-p1100-08-31.html` |
| Nikon, communiqués du 23 août 2018 et du 15 août 2019 ; page du produit Z 6 | adresses citées | `nikon-news-2018-0823.html`, `nikon-news-2019-0815.html`, `nikon-z6-product.html` |
| Sony, guide d'aide ILCE-7M3 (PDF, « Copyright 2018 Sony Corporation ») | adresse citée | `sony-ilce-7m3-print.pdf` |
| Sony, guide d'aide ILCE-9, « Focus Mode » | adresse citée | `sony-a9-focus-mode.html` |
| Paul Haeberli et Kurt Akeley, « The accumulation buffer », SIGGRAPH '90, résumé sur le site de Microsoft Research | adresse citée | `microsoft-accumulation-buffer.html` |
| bgfx, exemple 45-bokeh (elven cache, 2021) : `bokeh_dof.sh`, `fs_bokeh_dof_combine.sc` | `raw.githubusercontent.com/bkaradzic/bgfx/master/examples/45-bokeh/…` | `bgfx-bokeh_dof.sh`, `bgfx-fs_bokeh_dof_combine.sc` |
| Babylon.js, paquet `@babylonjs/core` 9.35.0 | `app/node_modules/@babylonjs/core/` | (dans le dépôt de travail) |

### Lues en plus, pour vérifier ou proposer une correction

| Source | Adresse | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, communiqué du 10 novembre 2016, « Digital SLR Camera D5600 » | `https://www.nikon.com/news/2016/1110_dslr_01.htm` | `nikon-news-2016-1110-d5600.html` |
| Sony, guide d'aide ILCE-6000, « Image Size (still image) » (« Copyright 2014 Sony Corporation ») | `https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000522845.html` | `sony-a6000-image-size.html` |
| Poly Haven, API, fiche de `autumn_hockey` | `https://api.polyhaven.com/info/autumn_hockey` | `polyhaven-info-autumn_hockey.json` |
| Wikipedia, « Nikon D5600 » (1345325532), « Canon EOS RP » (1374030103), « Canon EOS 2000D » (1381131251), « Sony α7 III » (1367164927) | `https://en.wikipedia.org/w/index.php?title=…&oldid=…` | `wiki-nikon-d5600.html`, `wiki-canon-eos-rp.html`, `wiki-canon-eos-2000d.html`, `wiki-sony-a7iii.html` |
| Wikipedia, « Airy disk » (1369075623), « Angle of view (photography) » (1382676604), « Shot noise » (1364169856), « Image noise » (1377731967) | idem | `wiki-airy-disk.html`, `wiki-angle-of-view.html`, `wiki-shot-noise.html`, `wiki-image-noise.html` |
| William J. Claff, « Sensor Analysis Primer » (« Last revised: 2021-03-27 ») : table des matières seulement | `https://www.photonstophotos.net/GeneralTopics/Sensors_&_Raw/Sensor_Analysis_Primer/Sensor_Analysis_Primer.htm` | `ptp-primer.htm` |

### Relues pour la contre-vérification

Toutes lues le 13 novembre 2026 (fichiers sous `pages/` du dossier de la contre-vérification).

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| William J. Claff, « Input-referred Read Noise versus ISO Setting » (« Last revised: 2026-08-17 ») et « DxOMark Derived Sensor Characteristics » (« Last revised: 2025-12-15 ») | adresses citées par le lot | `ptp-RN_e.htm`, `ptp-Sensor_Characteristics.htm` |
| William J. Claff, « Sensor Analysis Primer - Gain » (« Last revised: 2021-12-05 »), « Photon Transfer Curve » (« Last revised: 2009-02-28 »), « Read Noise - Optical Black » (« Last revised: 2009-03-04 ») | `https://www.photonstophotos.net/GeneralTopics/Sensors_&_Raw/Sensor_Analysis_Primer/Gain.htm`, `…/Photon_Transfer_Curve.htm`, `…/Read_Noise_-_Optical_Black.htm` | `ptp-Gain.htm`, `ptp-Photon_Transfer_Curve.htm`, `ptp-Read_Noise_-_Optical_Black.htm` |
| Nikon, manuel en ligne Z 7/Z 6 (en) : « Defaults », « Specifications », « d8: Apply Settings to Live View » | adresses citées par le lot | `nikon-z6-defaults.html`, `nikon-z6-specs.html`, `nikon-z6-d8.html` |
| Nikon, communiqué du 10 novembre 2016 (D5600) | `https://www.nikon.com/news/2016/1110_dslr_01.htm` | `nikon-news-2016-1110.html` |
| Sony, guide d'aide ILCE-7M3 (PDF) ; guide d'aide ILCE-6000, « Image Size (still image) » | adresses citées plus haut | `sony-ilce-7m3-print.pdf`, `sony-a6000-image-size.html` |
| Wikipedia (source secondaire), révisions citées par l'audit : « Shot noise » 1364169856, « Image noise » 1377731967, « Angle of view (photography) » 1382676604, « Airy disk » 1369075623, « Circle of confusion » 1335590423, « Film speed » 1383727213, « Exposure value » 1352562239, « Nikon D5600 » 1345325532, « Canon EOS RP » 1374030103, « Canon EOS 2000D » 1381131251, « Sony α7 III » 1367164927, « Sony α6000 » 1380408739 | `https://en.wikipedia.org/w/index.php?title=…&oldid=…` | `wiki-<révision>.html` |
| bgfx, exemple 45-bokeh : `bokeh_dof.sh`, `fs_bokeh_dof_combine.sc` ; licence de bgfx (« Copyright 2010-2026 Branimir Karadzic ») | `https://raw.githubusercontent.com/bkaradzic/bgfx/master/examples/45-bokeh/…`, `https://raw.githubusercontent.com/bkaradzic/bgfx/master/LICENSE` | `bgfx-bokeh_dof.sh`, `bgfx-combine.sc`, `bgfx-LICENSE` |
| Poly Haven, API, fiche de `autumn_hockey` | `https://api.polyhaven.com/info/autumn_hockey` | `polyhaven-autumn_hockey.json` |
| Babylon.js, paquet `@babylonjs/core` 9.35.0 : `scene.pure.js`, `Materials/PBR/pbrBaseMaterial.pure.js`, `Shaders/background.fragment.js`, `Helpers/textureDome.js`, `Materials/Textures/Filtering/hdrFiltering.js` | `app/node_modules/@babylonjs/core/` | (dans le dépôt de travail) |

Non relue à la contre-vérification : Photography Life, « ISO Invariance Explained » (`pl-iso-invariance`) : l'hôte répond 403 et demande un contrôle manuel ; le texte relevé par Julien le 11 novembre 2026 reste la seule lecture.

### Non relues

- Canon Royaume-Uni, fiches de l'EOS RP et de l'EOS 2000D (`www.canon.co.uk/cameras/…/specifications/`) : source non relue, l'hôte répond 403 (« Access Denied ») aux lectures automatiques.
- Canon, fiche de l'EOS RP (`en.canon-cna.com`) : source non relue, hôte non joignable.
- dslrbodies.com (capteur du D5600) et Clifton Cameras (définition du D5600) : sources non relues, hôtes non joignables.
- Sony Asie (capteur de l'A6000), Sony Inde (couverture de l'autofocus de l'A7 III), Sony Moyen-Orient (autofocus de l'A6000) : sources non relues, hôtes non joignables.
- Dennis Gustafsson, « Bokeh depth of field in a single pass » (copie de `web.archive.org`) : source non relue, hôte non joignable.
- DPReview (fiches techniques des six boîtiers, essayées comme source de remplacement) : 403.
- Normes ISO 12232 et ANSI PH2.7 : non lues ; seul l'article de Wikipedia qui les résume l'est.

## Constats

### PHY-01 · faux · Le filé annoncé en rafale n'est pas calculé

- Endroit : `docs/camera-physique.md`, l. 436 ; `app/src/camera/photo.ts`, l. 228-233 et 370-382 ; `app/src/ui/shutter.ts`, l. 286-293.
- Ce qui est écrit : « Chaque vue est calculée à son instant, sur l'horloge de la scène, avec l'orientation de l'appareil relevée à cet instant : suivre le chien pendant la rafale donne un filé. »
- Preuve (code) : l'orientation est posée une fois par vue, avant les rendus, et ne change plus pendant la pose.
  - `photo.ts`, l. 229-233 : `const rotation = request.replay?.rotation ?? request.moment?.rotation; if (rotation) { camera.rotation.copyFrom(rotation); camera.getViewMatrix(true); }`
  - `photo.ts`, l. 370-382 : dans la boucle des rendus, seuls changent la projection décentrée, `time.setEyeOffset(…)` et `time.setFrozenTime(…)`.
  - `shutter.ts`, l. 290-292 : une seule orientation par vue, « la plus récente à cet instant ».
- Conséquence : pendant une pose, l'appareil est immobile. Le fond reste net et le chien laisse sa traînée complète, que l'on tourne ou non. C'est l'inverse d'un filé (sujet net, fond filé). Tourner entre deux vues ne fait que recadrer.
- Correction proposée :
  - tout de suite, dans `docs/camera-physique.md` : remplacer la fin de la phrase par « suivre le chien pendant la rafale recadre chaque vue ; l'appareil reste immobile pendant chaque pose : pas de filé » ; ajouter aux « Non simulé » de la section : « le filé et tout mouvement de l'appareil pendant la pose » ;
  - plus tard (le filé est une notion du référentiel, `data/referentiel/mvt.yaml`, hors V1 minimale) : passer à `takePhoto` l'orientation au début et à la fin de la pose, tirées des relevés de `press.samples`, et l'interpoler à chaque rendu. Julien tranche.

**Contre-vérification : confirmé.** Relu dans la version courante (`photo.ts`, l. 235-239 et 376-388 ; `shutter.ts`, l. 292-298) : l'orientation est copiée une fois avant les rendus, et la boucle ne change que la projection, le décalage de l'œil et l'instant. Aucune autre phrase du dépôt n'annonce de filé (recherche du mot : cette seule phrase, hors référentiel), et la même documentation écrit « Pas encore de flou de bougé » (l. 149). La correction de la documentation suffit ; le filé est la notion MVT-06 (« Rotation de l'appareil pendant la pose, sujet suivi »), hors V1 minimale : rien à coder maintenant.

### PHY-02 · faux · « Non mesuré » pour le D5600 au-delà d'ISO 2546 : la source a ces points

- Endroit : `docs/camera-physique.md`, l. 85 (« non mesuré »), l. 91 (« Pour le D5600, la mesure s'arrête vers ISO 2546 »), l. 160 ; `app/src/camera/bodies.ts`, l. 41 (« Bruit mesuré jusqu'à ISO 2546 seulement ») ; `app/src/camera/noise.ts`, l. 45.
- Preuve (source) : série `Nikon D5600_14` de `https://www.photonstophotos.net/Charts/RN_e.htm` (fichier `ptp-RN_e.htm`, l. 443) : `hiEv: 9.67`, puis `{x:10.00,y:1.02,marker:{symbol:'triangle',fillColor:'white'}}`, `{x:11.00,y:1.00,…}`, jusqu'à `x:13.00`. Sous-titre du graphique : « Open symbols indicate values outside the normal analog range » et « Triangle up indicates scaling ». Converti (ISO = 3,125 × 2^x, électrons = 2^y) : ISO 3200 : 2,03 ; ISO 4022, 5091 et 6400 : 2,00.
- Ce qui est juste : les points existent ; ils sont hors de la plage analogique (gain numérique). Le code garde 2,03 électrons au-delà d'ISO 2546 ; la source donne 2,03 puis 2,00. L'écart est de 1,5 % : le rendu ne change pas.
- Correction proposée : écrire « au-delà d'ISO 2546, hors de la plage analogique (mise à l'échelle numérique, symboles ouverts du graphique) : 2,03 électrons à ISO 3200, 2,00 de ISO 4000 à 6400 » à ces cinq endroits ; dans le tableau de la l. 85, « 2,03 » à la place de « non mesuré » ; ajouter les quatre points à `readNoise` du D5600 ou garder la dernière valeur, au choix, en le disant.

**Contre-vérification : confirmé.** Page relue le 13 novembre 2026 : la série `Nikon D5600_14` a quatre points entre ISO 3200 et 6400 (y = 1,02 ; 1,00 ; 1,00 ; 1,00, soit 2,03 ; 2,00 ; 2,00 ; 2,00 électrons), en triangles ouverts, et c'est le seul des six boîtiers dans ce cas entre ISO 100 et 6400. La gravité « faux » ne vaut que pour le texte : le rendu ne change pas (1,5 % sur le bruit de lecture). Correction retenue : ajouter les quatre points à `readNoise` (les six boîtiers vont alors tous jusqu'à ISO 6400, et le cas particulier de `noise.ts` disparaît), avec la mention « hors de la plage analogique, mise à l'échelle numérique » ; la page précise : « The conversion is for analog gain only. Digital gain and other signal processing are supressed. »

### PHY-03 · non sourcé · « Pas de flou de mouvement, comme dans le viseur d'un vrai appareil »

- Endroit : `docs/camera-physique.md`, l. 76.
- Ce qui est écrit : « Viseur : pas de flou de mouvement, comme dans le viseur d'un vrai appareil. »
- Preuve : aucune source n'est citée. Le guide d'aide Sony ILCE-7M3, lu, dit seulement de « Setting Effect ON » : « Displays Live View in conditions close to what your picture will look like as a result of applying all your settings » (`sony-ilce-7m3-print.pdf`, « Live View Display »). Il ne dit pas ce que la visée montre du temps de pose. Le manuel du Z 6 (d8) parle de « brightness and hue ».
- Correction proposée : écrire « Viseur : pas de flou de mouvement ; choix de TutoPhoto. Je ne sais pas ce que la visée d'un hybride montre du flou de mouvement : les pages lues ne le disent pas. »

**Contre-vérification : confirmé.** Relu : le guide Sony (« Live View Display ») et le réglage d8 du Z 6 (« to preview how changes to such settings as white balance, Picture Controls, and exposure compensation affect color and brightness ») ne parlent que de couleur et de luminosité ; aucune page lue ne dit ce que la visée montre du temps de pose, et aucune entrée de `data/sources.yaml` n'appuie la phrase. Correction proposée juste.

### PHY-04 · non sourcé · La loi du bruit (√n, somme des variances) n'a pas de source dans le lot

- Endroit : `docs/camera-physique.md`, l. 93-96 (« Modèle proposé ») et l. 160 ; `app/src/camera/noise.ts`, l. 4-11.
- Ce qui est écrit : « écart type du bruit : σ = √(n + σ_r(S)²) », sans source. Seules les données (Claff) et la matrice de Bayer (Wikipedia) sont sourcées.
- Preuve : aucun identifiant de source pour la loi elle-même dans ces lignes. Elle est juste, d'après deux pages lues :
  - Wikipedia, « Shot noise », révision 1364169856 : « the standard deviation of shot noise is equal to the square root of the average number of events N » ;
  - Wikipedia, « Image noise », révision 1377731967 : « Shot noise follows a Poisson distribution, which can be approximated by a Gaussian distribution for large image intensity. Shot noise has a standard deviation proportional to the square root of the image intensity, and the noise at different pixels are independent of one another. »
  - `data/sources.yaml` a déjà `pl-iso-invariance` (Photography Life, relevé par Julien le 11 novembre 2026 : bruit photonique « égal à la racine carrée du nombre de photons »), utilisé par la fiche EXP-06 seulement.
- Correction proposée : citer `pl-iso-invariance` et les deux révisions de Wikipedia (à ajouter à `data/sources.yaml`) dans `noise.ts` et dans la section « Bruit numérique » ; y dire que l'addition des variances du bruit photonique et du bruit de lecture suppose deux bruits indépendants, et que les tirages sont gaussiens (voir PHY-18). Source primaire possible, non lue : les articles « Photon Transfer Curve » et « Read Noise » du « Sensor Analysis Primer » de Claff, dont seule la table des matières a été ouverte.

**Contre-vérification : confirmé.** Ni la section ni `noise.ts` ne citent de source pour la loi ; les deux citations de Wikipedia sont exactes. Source primaire à préférer, lue le 13 novembre 2026, du même auteur que les mesures : William J. Claff, « Sensor Analysis Primer - Gain » (« Last revised: 2021-12-05 », `https://www.photonstophotos.net/GeneralTopics/Sensors_&_Raw/Sensor_Analysis_Primer/Gain.htm`) : « Photon Noise follows a Poisson distribution that, except for small numbers, is closely approximated by a Normal distribution » et « Photon Noise in electrons is equal to the square root of the signal in electrons ». L'addition des variances du bruit photonique et du bruit de lecture n'est écrite dans aucune page lue (ni chez Claff, ni dans les deux articles de Wikipedia) : à écrire comme une hypothèse de TutoPhoto, pas comme un fait sourcé.

### PHY-05 · non sourcé · Champ de vue 2 × atan(côté / (2 × focale)) : sans source, et valable à l'infini seulement

- Endroit : `app/src/camera/exposure.ts`, l. 90-93 ; `app/src/camera/viewfinder.ts`, l. 36-45 ; `app/src/camera/photo.ts`, l. 239 ; `docs/camera-physique.md`, l. 105 et 509.
- Ce qui est écrit : la formule, sans source ni condition.
- Preuve (source lue pour l'audit) : Wikipedia, « Angle of view (photography) », révision 1382676604 : « For a lens projecting a rectilinear image (focused at infinity, see derivation), the angle of view (α) can be calculated from the chosen dimension (d), and effective focal length (f) », suivi de la formule α = 2 arctan(d / 2f) ; et « Note that the angle of view varies slightly when the focus is not at infinity (See breathing (lens)) », avec le tirage S2 = S1 × F / (S1 − F).
- Ce que fait le code : le champ garde sa valeur de l'infini à toute distance de mise au point, alors que le flou suit la formule des lentilles minces, qui suppose le tirage f × S / (S − f). L'en-tête de `photo.ts` (l. 4-7) le dit pour le disque d'ouverture, pas pour le champ. Écart entre les deux grandissements, f / (S − f) : 0,8 % au 50 mm à 6,6 m, 3,1 % au 200 mm à 6,6 m, 15 % au 200 mm à 1,5 m (distance possible depuis que l'appareil se déplace, version 0.3.37).
- Correction proposée : ajouter la révision de Wikipedia à `data/sources.yaml` et la citer aux cinq endroits ; écrire dans `docs/camera-physique.md` : « le champ est celui d'une mise au point à l'infini et ne change pas avec la distance de mise au point ; un vrai objectif change un peu de champ en faisant le point, d'une façon propre à chaque objectif ; non simulé ».

**Contre-vérification : confirmé.** Citations exactes dans la révision 1382676604 ; aucune entrée de `data/sources.yaml` ne porte sur le champ de vue, et le dépôt ne dit nulle part que le champ est celui de l'infini. Écarts recalculés : 0,8 %, 3,1 % et 15,4 %. Correction à corriger : « d'une façon propre à chaque objectif » n'est pas dans la page lue (elle dit seulement « varies slightly when the focus is not at infinity ») ; écrire « le champ est celui d'une mise au point à l'infini ; il varie un peu quand la mise au point est plus proche ; non simulé ». Citer la source à la définition (`fieldOfView`, `exposure.ts`) et dans la documentation suffit ; le code ne change pas.

### PHY-06 · incohérent · L'étalonnage annoncé de la scène n'existe pas dans le code ; fond et éclairage ne sont pas à la même échelle

- Endroit : `docs/camera-physique.md`, l. 52 et l. 54-58 ; `app/src/scene.ts`, l. 184-205 ; `app/src/ui/cameraPanel.ts`, l. 749 ; `app/src/camera/photo.ts`, l. 174.
- Ce qui est écrit : « Valeur du pixel, rapportée à la saturation du capteur : L × 1 / (1,2 × 2^EV₁₀₀) » et « La scène est donc mise à l'échelle pour que sa luminance moyenne vaille 2^(12,5 − 3) = 2^9,5 ≈ 724 cd/m² ». Avec ces deux phrases, la luminance moyenne d'une scène correctement exposée vaut 724 / (1,2 × 5 793) = 0,104 de la saturation.
- Preuve 1 (code) : aucune luminance en cd/m² ni aucune mise à l'échelle. Le viseur fait `this.scene.imageProcessingConfiguration.exposure = this.showsBrightness() ? 2 ** offset : 1` (`cameraPanel.ts`, l. 749) ; la photo fait `sum * invSamples * exposure` (`photo.ts`, l. 174). `scene.ts` ne règle ni `environmentIntensity`, ni le niveau d'une texture. La valeur v du modèle de bruit est donc la valeur linéaire de l'image de Babylon : pour le fond, (octet du JPEG / 255)^2,2 (`toLinearSpace` de `background.fragment.js`, Babylon 9.35.0).
- Preuve 2 (calcul, `scripts/fond_moyenne.py`, sur `autumn_hockey.jpg`, pondéré par l'angle solide) : luminance linéaire moyenne de la sphère entière 0,230 ; moitié haute 0,339 (14,2 % de pixels écrêtés) ; moitié basse 0,121 ; bande de ±20° autour de l'horizon 0,095 ; bande de −16° à +8° (proche du cadre de départ au 50 mm) 0,081. La valeur 0,104 n'est donc tenue que près de l'horizon ; la « luminance moyenne » de la sphère est 2,2 fois plus haute (+1,1 IL).
- Preuve 3 (calcul, `scripts/hdr_contre_jpeg.py`) : le fichier d'éclairage `autumn_hockey_1k.hdr` et le fond JPEG ne sont pas à la même échelle. Sur les pixels de tons moyens (JPEG ni sombre ni écrêté), le rapport HDR / JPEG^2,2 a pour médiane 2,11 (quartiles 1,96 et 2,48) ; 2,03 sur la moitié basse, 2,19 sur la bande de l'horizon. Dans Babylon 9.35.0, `scene.environmentIntensity` vaut 1 par défaut (`scene.pure.js`, l. 823), comme celui des matériaux PBR, et `hdrCubeTexture.pure.js` ne normalise rien.
- Conséquence probable, non mesurée dans un rendu : les personnages et les objets 3D, éclairés par le HDR, sont environ deux fois plus clairs (environ 1 IL) qu'ils ne le seraient dans la photo du fond. Cela touche l'exposition jugée sur le sujet, l'écrêtage des blancs et le rapport signal sur bruit « au point visé ».
- Correction proposée :
  1. réécrire les l. 52-58 : le modèle est rapporté à l'affichage ; à écart nul, le viseur montre le JPEG de Poly Haven tel quel, et le blanc du JPEG tient lieu de saturation du capteur ; donner les moyennes mesurées ci-dessus ; retirer « mise à l'échelle » ;
  2. mesurer dans un rendu (plan gris de réflectance connue posé au sol, lu dans le viseur et comparé au sol du fond), puis régler `scene.environmentIntensity` (de l'ordre de 1 / 2,1 ≈ 0,47 d'après les fichiers) et consigner le calcul dans `scene.ts`. Cela change l'image de départ : Julien tranche.

**Contre-vérification : confirmé.** Recalcul indépendant sur les deux fichiers du dépôt (lumière linéaire par la puissance 2,2 de Babylon, luminance pondérée par l'angle solide) :
- fond JPEG : 0,235 sur la sphère, 0,346 sur la moitié haute, 0,123 sur la moitié basse, 0,098 sur ±20°, 0,084 de −16° à +8° ; la part écrêtée de la moitié haute vaut 10,8 % avec « un canal à 255 » et 15,3 % avec « un canal à 254 ou plus » (le critère des 14,2 % n'est pas dit) ;
- rapport HDR / JPEG^2,2 sur les tons moyens : médiane 1,96 (quartiles 1,88 et 2,11 ; 1,93 sur la moitié basse). Le rapport écrit 2,11 : la valeur dépend du choix des pixels, l'ordre de grandeur (environ 1 IL) tient ;
- Babylon 9.35.0 relu : `this.environmentIntensity = 1` (`scene.pure.js`, l. 823), `this._lightingInfos.z = this._environmentIntensity * scene.environmentIntensity` (`pbrBaseMaterial.pure.js`, l. 1725), fond égal à `toLinearSpace` de la texture multiplié par son niveau (`background.fragment.js`) ; `app/src` ne règle ni l'un ni l'autre.

Déjà dit en partie dans le dépôt : « étalonnage à revoir avec la mesure de la lumière » (`docs/camera-physique.md`, l. 628 ; `docs/questions-ouvertes.md`), « il faut dire la moyenne de quoi » (`docs/dossiers/scenes.md`, section 5), et les vêtements clairs à la valeur maximale dès l'exposition jugée correcte (version 0.3.57), que l'écart d'échelle expliquerait. Ce qui est nouveau et tient : aucune mise à l'échelle n'existe dans le code, et l'éclairage des objets 3D est environ deux fois plus fort que le fond. Au cadrage de départ, le fond seul (0,084) est à −0,3 IL de la valeur du modèle (0,104) : c'est l'éclairage qui est en cause, pas le fond.

Correction : le point 1 (réécrire les l. 52-58) tout de suite. Le point 2 seulement après la mesure dans un rendu, avec une valeur « de l'ordre de 0,5 » et non « 0,47 », et dans la même pull request que la mesure de la lumière (file de `docs/etat-des-travaux.md`), puisqu'il change l'image de départ et les mesures de bruit de la documentation : Julien tranche.

### PHY-07 · incohérent · Loupe du viseur : bruit sous-estimé sur les écrans de densité 2 ou plus

- Endroit : `app/src/ui/cameraPanel.ts`, l. 796 et l. 872-878 ; `app/src/camera/noise.ts`, l. 58-66 ; `app/src/main.ts`, l. 35 et 167 ; `docs/camera-physique.md`, l. 239 (« soit environ 1 à 100 % ») et l. 247.
- Ce qui est écrit : « 100 % » vaut un photosite par pixel CSS (`cameraPanel.ts`, l. 873-876 ; `CHANGELOG.md`, 0.3.52) ; le bruit « suit le grossissement, avec k = pixels effectifs / (pixels du cadre × grossissement²), soit environ 1 à 100 % ».
- Preuve (code) : depuis la version 0.3.52, le viseur est calculé à la densité de l'écran, plafonnée à 2 (`MAX_DEVICE_RATIO`). `applyView()` compte les pixels calculés, pas les pixels CSS : `this.noise.update(body, …, frame.width * frame.height * this.loupeZoom ** 2, gain)`, avec `frame` tiré de `engine.getRenderWidth()`. À densité 2 et à 100 %, k vaut 0,25 ; `noiseParameters` ramène k × part à 1 (`Math.max(1, k * BAYER_SHARE[i])`), et le shader tire un bruit indépendant par pixel calculé, soit quatre tirages par photosite.
- Preuve (calcul, `scripts/bruit_loupe_densite.py`, Nikon Z 6, cadre de 1060 px CSS) : bruit simulé / bruit attendu, par pixel CSS (vert ; rouge ou bleu) :

  | Densité | Sans loupe | Loupe 50 % | Loupe 100 % |
  | --- | --- | --- | --- |
  | 1 | 1,00 ; 1,00 | 1,00 ; 1,00 | 1,00 ; 1,00 |
  | 2 | 1,00 ; 1,00 | 0,71 ; 0,50 | 0,50 ; 0,50 |

- Conséquence : sur un téléphone (densité plafonnée à 2), la loupe du viseur montre un bruit deux fois plus faible qu'attendu, au grain deux fois plus fin. La loupe de l'écran de revue n'est pas touchée (image à la définition du capteur, un pixel par pixel CSS). Les vérifications de la l. 249-257 datent de la densité 1.
- Correction proposée : quand un pixel calculé couvre moins d'un photosite de la couleur, un même tirage pour tous les pixels calculés du photosite (coordonnées du tirage ramenées à la grille des photosites), densité 1 inchangée ; corriger la l. 239 ; ajouter à la routine une mesure du bruit de la loupe à densité 2.

**Contre-vérification : confirmé.** Calcul refait à partir du code (`zoomAt`, `applyView`, `noiseParameters`) : mêmes rapports (densité 2 : 0,71 et 0,50 à 50 % ; 0,50 et 0,50 à 100 % ; 1,00 partout à densité 1 et sans loupe). `CHANGELOG.md` (0.3.52) n'adapte que la définition de « 100 % ». Précision : par pixel calculé, l'amplitude reste celle d'un photosite ; c'est le grain, deux fois plus fin que le photosite, qui divise le bruit par deux à l'échelle du pixel CSS. Correction à préciser : quand la loupe grossit, tirer le bruit sur la grille des pixels CSS (coordonnées du tirage multipliées par le niveau de mise à l'échelle, arrondies vers le bas) avec k compté par pixel CSS, ce qui redonne le comportement mesuré à densité 1 ; sans loupe, ne rien changer. Non mesuré dans un navigateur : à mesurer avant de corriger.

### PHY-08 · incohérent · Plafond du flou du viseur : compté en pixels calculés, donc moitié moindre à densité 2

- Endroit : `app/src/camera/viewfinderDof.ts`, l. 32-33 ; `app/src/ui/cameraPanel.ts`, l. 798-802 ; `docs/camera-physique.md`, l. 276, 285, 296-301 et 313.
- Ce qui est écrit : « Le rayon est plafonné à 32 px, soit un diamètre de 64 px », et des flous attendus et mesurés (58,7 px, 25,1 px) qui datent de la densité 1.
- Preuve (code) : `MAX_BLUR_RADIUS_PX = 32` est en « pixels du canevas », et `pixelsPerMm` est calculé sur `frame`, en pixels calculés. À densité 2, le même flou physique compte deux fois plus de pixels ; le plafond, lui, n'a pas bougé.
- Preuve (calcul, `scripts/plafond_flou.py`, Z 6, mise au point à 6,6 m, fond à l'infini) :
  - ordinateur, cadre de 1060 px CSS : plafond de 2,17 mm sur le capteur à densité 1, de 1,08 mm à densité 2. À densité 2, le 135 mm à f/1.4 (1,97 mm) est montré à 54 % de sa taille, le 105 mm à f/1.4 à 90 % ; à densité 1, seul le 200 mm était plafonné ;
  - téléphone, cadre de 453 px CSS : aucun plafond à densité 1 (5,07 mm) ; à densité 2 (2,54 mm), le 200 mm à f/1.4 est montré à 57 %, à f/2 à 81 %.
- Correction proposée : soit porter le plafond à 32 px CSS (32 / niveau de mise à l'échelle) : à pas égal, le nombre d'échantillons au plafond quadruple (environ 680, la boucle en admet 400), coût à mesurer sur le téléphone de Julien ; soit garder le plafond et l'écrire : « 64 pixels calculés, soit 32 px CSS à densité 2 », avec les cas plafonnés ci-dessus. Dans les deux cas, dater les mesures des l. 288-301 (« densité 1 »).

**Contre-vérification : confirmé.** Recalculé : plafond de 2,17 mm (densité 1) et 1,08 mm (densité 2) sur un cadre de 1060 px CSS, de 5,07 et 2,54 mm sur 453 px CSS ; à densité 2, le 135 mm à f/1.4 est montré à 55 % et le 105 mm à 92 % sur ordinateur, le 200 mm à f/1.4 à 58 % sur téléphone. Nuance : la documentation et le code disent tous deux « pixels du canevas » et ne se contredisent pas ; ce sont les exemples (58,7 px non plafonnés sur 1200 × 900) qui ne valent plus à densité 2. Correction : la seconde voie d'abord (écrire le plafond en pixels calculés et en millimètres de capteur, dater les mesures « densité 1 »). Relever le plafond fait passer la spirale de 171 à 683 échantillons (boucle de 400), alors que la densité vient d'être plafonnée pour la fluidité : pas sans mesure sur téléphone. Autre voie, à évaluer : une passe de flou à l'échelle 0,5 / densité, qui garde le nombre de pixels et d'échantillons de la densité 1 avec un plafond en pixels CSS.

### PHY-09 · incohérent · L'interface dit que les réglages par défaut de la rafale et du retardateur sont « choisis »

- Endroit : `app/src/i18n.ts`, l. 169-170 (français) et l. 382-383 (anglais), texte `releaseNote`.
- Ce qui est écrit : « Réglages par défaut (3 vues par seconde, 10 s) choisis, les pages lues ne les donnant pas. » ; en anglais : « Default settings (3 frames per second, 10 s) are chosen, as the pages read do not give them. »
- Preuve : la documentation (l. 432 et 435) et `cameraPanel.ts` (l. 78-79) disent que ce sont les réglages du Z 6. La page « Defaults » du manuel, relue : « c2 Self-timer Self-timer delay 10 s », « d1 CL mode shooting speed 3 fps » (`nikon-z6-09_menu_guide_01.html`).
- Correction proposée : « Réglages par défaut du Z 6 : 3 vues par seconde en Continu L, retardateur de 10 s. » ; « Z 6 defaults: 3 frames per second in Continuous L, 10 s self-timer. »

**Contre-vérification : confirmé.** Page « Defaults » relue le 13 novembre 2026 : « c2 Self-timer », « Self-timer delay 10 s » ; « d1 CL mode shooting speed 3 fps ». Le texte `releaseNote` dit toujours « choisis » (l. 169-170 ; l. 403-404 en anglais dans la version courante), contre `cameraPanel.ts` (l. 78-79), la documentation (l. 432 et 435) et la fiche BOI-12. Correction proposée juste.

### PHY-10 · incohérent · Passages du début de la documentation contredits par la suite

- Endroit : `docs/camera-physique.md`, l. 70, 71, 98, 102 et 641.
- Preuve (texte contre texte, ou contre le code) :
  - l. 70, « Nombre de rendus : 64 à 256 » ; l. 130 et `photo.ts`, l. 41-42 : de 16 à 256 ;
  - l. 71, « Viseur : effet de Babylon, avec `lensSize`… » ; l. 268-283 : remplacé par le flou en disque depuis la version 0.3.23 ;
  - l. 98, « Les définitions des capteurs restent à relever » ; l. 168-177 : relevées en version 0.3.15 ;
  - l. 102, « leurs plages réelles, souvent plus larges, viendront avec l'étape du bruit » ; l'étape du bruit est faite (0.3.15) et les plages sont toujours communes (`exposure.ts`, l. 11-32) ;
  - l. 641, sous « Ce que je ne sais pas » : « Le temps de calcul d'une photo par accumulation sur téléphone. » ; l. 144-148 : mesuré par Julien le 9 novembre 2026 (0,8 s et 2,0 s).
- Correction proposée : marquer les sections « Profondeur de champ », « Flou de mouvement et de bougé » et « Bruit numérique » du début comme le modèle proposé le 8 novembre, avec un renvoi à la section qui dit ce qui est fait ; corriger les cinq phrases ; pour la l. 102, écrire « plages réelles non reprises à ce jour ».

**Contre-vérification : confirmé.** Les cinq phrases sont périmées (la l. 641 est devenue la l. 693 avec la version 0.3.57). Gravité à ramener à « à améliorer » : l'en-tête du document dit que le modèle du début est « proposé » et « reste à valider », et les sections suivantes, datées par version, disent ce qui est fait ; seule la liste « Ce que je ne sais pas », tenue à jour jusqu'à la version 0.3.57, est fausse au présent. Pour cette ligne, écrire ce qui reste inconnu : le temps de calcul sur les téléphones des testeurs (`docs/questions-ouvertes.md`). Le reste de la correction est proportionné.

### PHY-11 · à améliorer · Diffraction : ni simulée, ni dite

- Endroit : `docs/camera-physique.md` (aucune mention) ; `app/src/camera/photo.ts` et `viewfinderDof.ts` (le seul flou optique est celui de la mise au point) ; `app/src/i18n.ts`, `lensNote` (l. 210).
- Ce qui manque : fermer à f/16 ou f/22 n'a aucun coût sur le piqué, y compris à la loupe à 100 %. Le référentiel a pourtant la notion NET-04, « Pourquoi fermer au maximum fait perdre du piqué » (`data/referentiel/net.yaml`, l. 40-46), hors V1 minimale. La routine juge même SIT-01 à f/22 (`docs/camera-physique.md`, l. 540).
- Preuve (source lue pour l'audit, et calcul) : Wikipedia, « Airy disk », révision 1369075623 : l'article donne x = 1,22 × λ × f/d pour l'écart de deux points tout juste séparés, f/d étant « the f-number of a lens » ; pour f/8 et le violet (« the wavelength λ is about 420 nanometers »), « This gives a value for x of about 4 μm ». À f/22 (N exact 22,63), le diamètre du premier anneau sombre, 2,44 × λ × N, vaut 23 µm pour 420 nm et 30 µm pour 550 nm (vert, longueur d'onde choisie pour ce calcul). Le photosite du Z 6 mesure 35,9 mm / 6048 = 5,9 µm : la tache couvre 4 à 5 photosites. Le flou acceptable du simulateur, d / 1500, vaut 29 µm.
- Correction proposée : ajouter à `docs/camera-physique.md` et à la note de l'objectif virtuel : « Diffraction non simulée : à f/16 et f/22, un vrai objectif perd du piqué ; ici, non. » Simulation en V2 avec NET-04, sources à réunir.

**Contre-vérification : confirmé.** Le mot « diffraction » n'apparaît que dans le référentiel (`data/referentiel/net.yaml`) : ni la documentation ni l'interface ne disent qu'elle n'est pas simulée, alors que `CLAUDE.md` demande de dire ce qui n'est pas réaliste. Citations de la révision 1369075623 exactes ; calcul refait : 23,2 µm (420 nm) et 30,4 µm (550 nm) à f/22,6, pour un photosite de 5,94 µm et un flou acceptable de 28,8 µm. Correction : la phrase « non simulée » suffit ; y écrire le résultat du calcul (tache de 23 à 30 µm à f/22, soit 4 à 5 photosites du Z 6) plutôt que « un vrai objectif perd du piqué », qui n'est la citation d'aucune page lue.

### PHY-12 · à améliorer · Cellule : même mesure quel que soit le cadrage, sans que l'interface ni la section des modes le disent

- Endroit : `app/src/camera/exposureModes.ts`, l. 82 (`sceneEv100 = SCENE_EV100`) ; `app/src/camera/exposure.ts`, l. 38 et 75 ; `docs/camera-physique.md`, l. 103 (dit, « pour l'instant ») et l. 500 (liste « Non simulés » de la version 0.3.36, qui ne le reprend pas) ; `app/src/i18n.ts`, `exposureNote` (l. 166-167).
- Ce qui manque : en A et en S, l'appareil « choisit » d'après une scène à 12,5 IL partout. Viser le ciel ou le sol donne la même vitesse ; un débutant en déduira que la cellule ne dépend pas de ce qu'il vise.
- Preuve (calcul, mêmes scripts que PHY-06) : entre la moitié haute de la sphère et la bande de l'horizon, la luminance moyenne varie d'un facteur 3,6 d'après le JPEG écrêté (0,339 / 0,095, soit 1,8 IL) et d'un facteur 12,5 d'après le HDR (2,534 / 0,202, soit 3,6 IL).
- Correction proposée : ajouter « la mesure de la lumière : la cellule donne la même valeur quel que soit le cadrage (pas de mode de mesure) » à la liste « Non simulés » de la l. 500 et au texte `exposureNote`, dans les deux langues.

**Contre-vérification : confirmé.** `resolveExposure(control, sceneEv100 = SCENE_EV100)` et `exposureOffset` visent la constante 12,5. Le dépôt le dit à deux endroits (`docs/camera-physique.md`, l. 103 ; `docs/etat-des-travaux.md` : « le simulateur n'a aucune mesure de la lumière »), mais ni le texte `exposureNote` de l'interface, ni la liste « Non simulés » de la l. 500, ni les fiches MES-04, MES-10, BOI-07 et BOI-08 : le débutant ne le lit nulle part. Rapports recalculés entre la moitié haute et la bande de l'horizon : 3,5 d'après le JPEG, 12,5 d'après le HDR. Correction proposée juste, et provisoire : la mesure de la lumière est dans la file de travail et dans le lot « architecture » ; la phrase partira avec elle.

### PHY-13 · à améliorer · Capacité des photosites : valeurs dérivées de DxOMark, alors que la page du bruit de lecture porte sa propre capacité et la formule de saturation

- Endroit : `app/src/camera/bodies.ts`, l. 5-8 et les six `fullWellElectrons` ; `docs/camera-physique.md`, l. 80-95.
- Ce qui est écrit : capacité tirée de « DxOMark Derived Sensor Characteristics », dont l'auteur dit « these values tend to be wild » ; et « e_sat(S) = capacité × 100 / S », présenté comme un modèle proposé, « cohérent avec le gain unitaire […] à quelques pourcents près ».
- Preuve (source) : la page du bruit de lecture, déjà utilisée pour σ_r, donne pour chaque boîtier un champ `fwc` et calcule elle-même la saturation de chaque réglage ISO (`ptp-RN_e.htm`, l. 182-185) : `saturation = fwc / Math.pow(2, (gainEv + unityEv) - loEv)`, soit fwc × 100 / ISO dans la plage analogique. La page des valeurs dérivées dit : « Directly measured data is almost always perferable to these derived values. »

  | Boîtier | `bodies.ts` (table dérivée de DxOMark) | `fwc` du graphique du bruit de lecture | Écart |
  | --- | --- | --- | --- |
  | Nikon Z 6 | 83 698 | 80 359 | +4,2 % |
  | Nikon D5600 | 33 963 | 32 718 | +3,8 % |
  | Sony A7 III | 95 764 | 93 703 | +2,2 % |
  | Sony A6000 | 33 083 | 32 205 | +2,7 % |
  | Canon EOS RP | 82 327 | 79 455 | +3,6 % |
  | Canon EOS 2000D | 24 222 | 24 583 | −1,5 % |

- Limite : la page ne dit pas comment `fwc` est obtenu ; je ne sais pas si c'est une mesure directe. Effet sur le bruit : 2 % au plus (racine de l'écart).
- Correction proposée : dans la documentation, citer le calcul de la colonne « Saturation (e-) » de Claff comme source de e_sat(S) = capacité × 100 / S, à la place de « modèle proposé » ; proposer à Julien de prendre `fwc` du graphique du bruit de lecture (même page, même auteur, même jeu de mesures que σ_r), en disant ce que la page ne dit pas.

**Contre-vérification : confirmé.** Correction réduite. Relus le 13 novembre 2026 : les six `fwc` du graphique (80 359, 32 718, 93 703, 32 205, 79 455, 24 583) et le calcul de la colonne « Saturation (e-) » (l. 182-185 de la page), qui vaut fwc × 100 / ISO de ISO 100 à `hiEv`, et au-delà pour le D5600. À faire : citer ce calcul comme source de e_sat(S) à la place de « modèle proposé », et donner les `fwc` de cette page comme recoupement des capacités retenues (écart de −1,5 à +4,2 %). À ne pas faire : remplacer les valeurs. La page ne dit pas d'où vient `fwc`, l'effet sur le bruit est de 2 % au plus, et la documentation porte déjà la mise en garde de Claff (l. 80 et « Ce que je ne sais pas ») : on échangerait une valeur publiée dans un tableau, avec sa mise en garde, contre un champ du code de la page, sans provenance.

### PHY-14 · à améliorer · Définition du capteur « approchée » alors que les sources lues donnent la taille de l'image

- Endroit : `app/src/camera/bodies.ts`, l. 77-84 (`sensorPixels`) ; `docs/camera-physique.md`, l. 232 (« la forme exacte de l'image n'est pas lue dans les sources ») ; utilisé par `cameraPanel.ts`, l. 876 et `shutter.ts`, l. 468-470.
- Preuve (sources) :
  - Nikon, manuel du Z 7/Z 6, « Specifications », la page déjà citée pour le capteur : « Image size (pixels) […] Z 6 : FX (36×24) image area 6048 × 4024 (Large: 24.3 M) » ;
  - Sony, guide d'aide ILCE-7M3 : « L: 24M 6000×4000 pixels » ; Sony, guide d'aide ILCE-6000, « Image Size (still image) » : « L: 24M 6000×4000 pixels ».
- Calcul : `sensorPixels` donne 6066 × 4039 (Z 6), 6017 × 4022 (A7 III), 6050 × 4016 (A6000) : 0,3 à 0,8 % de trop.
- Correction proposée : ajouter `imagePixels: { long, short }` aux boîtiers dont la taille est lue (Z 6, A7 III, A6000) et garder le calcul pour les autres ; corriger la l. 232 et l'exemple « 6066 × 4039 » ; pour le bruit, compter les pixels de l'image (24,3 millions pour le Z 6) plutôt que les pixels effectifs.

**Contre-vérification : confirmé.** Correction réduite. Les trois tailles d'image sont dans les pages relues (Z 6 : « 6048 × 4024 (Large: 24.3 M) » ; A7 III et A6000 : « L: 24M 6000×4000 pixels ») : la phrase « la forme exacte de l'image n'est pas lue dans les sources » est fausse pour ces trois boîtiers. Écarts recalculés : 0,3 à 0,8 %. À faire : corriger la l. 232 et le commentaire de `sensorPixels` ; un champ facultatif `imagePixels` pour ces trois boîtiers si l'on veut une loupe exacte, les trois autres gardant le calcul. À ne pas faire : compter les pixels de l'image pour le bruit. Rien de lu ne dit lequel des deux nombres couvre les 35,9 × 23,9 mm du capteur (pas de 5,936 µm d'un côté, de 5,918 µm de l'autre), et l'effet est de 0,4 % sur le bruit.

### PHY-15 · à améliorer · Valeurs notées « extrait de recherche, page non ouverte » : état au 12 novembre 2026

- Endroit : `app/src/camera/bodies.ts`, l. 40-41, 56-57, 61-63, 70-71 ; `docs/camera-physique.md`, l. 26, 28-30, 173, 176-177 ; `data/sources.yaml` (`nikon-d5600-sensor`, `nikon-d5600-pixels`, `sony-ilce-6000-sensor`, `canon-eos-rp-sensor`, `canon-eos-rp-pixels`, `canon-eos-2000d-sensor`).
- Aucune des pages d'origine n'a pu être relue (hôtes non joignables, ou 403). Ce que valent les valeurs, d'après ce qui a pu être lu :

  | Valeur | État | Preuve |
  | --- | --- | --- |
  | D5600, 24,2 millions de pixels effectifs | confirmé par une source primaire | Nikon, communiqué du 10 novembre 2016 : « An effective pixel count of 24.2-million pixels » |
  | D5600, capteur 23,5 × 15,6 mm | source secondaire seulement | Wikipedia, « Nikon D5600 », révision 1345325532 : « 23.5 mm × 15.6 mm », « 6000 × 4000 pixels (24.2 megapixels) » |
  | A6000, capteur 23,5 × 15,6 mm ; 24,3 millions | source secondaire seulement (déjà dit) | Wikipedia, « Sony α6000 », révision 1380408739 ; le guide d'aide Sony donne la taille d'image, pas le capteur |
  | EOS RP, 35,9 × 24,0 mm ; 26,2 millions ; couverture 88 % × 100 % | non relu ; relevé par Julien le 11 novembre 2026 | Wikipedia, « Canon EOS RP », révision 1374030103 : « 26.2 megapixels », « 88% horizontal and 100% vertical frame coverage », mais capteur « 36 × 24 mm » |
  | EOS 2000D, 22,3 × 14,9 mm ; 24,1 millions | source secondaire seulement | Wikipedia, « Canon EOS 2000D », révision 1381131251 : « 22.3 × 14.9 mm », « 24.1 megapixels » |
  | A7 III, couverture de 93 % | non relu ; relevé par Julien | Wikipedia, « Sony α7 III », révision 1367164927 : « 693 Phase Detection AF Points with 93% coverage » |

- Incohérence au passage : les tableaux de la documentation (l. 29 et 176) disent encore « extrait de recherche, page non ouverte » pour l'EOS RP, alors que `bodies.ts` (l. 61-63) et `data/sources.yaml` disent la fiche de Canon Royaume-Uni relevée par Julien le 11 novembre 2026.
- Correction proposée : remplacer `nikon-d5600-pixels` (Clifton Cameras) par le communiqué de Nikon ; mettre les tableaux des l. 21-30 et 168-177 à jour (EOS RP : « relevé par Julien ») ; pour le capteur du D5600, de l'A6000 et de l'EOS 2000D, écrire « source secondaire » avec la révision de Wikipedia à la place de l'extrait de recherche, ou demander à Julien de relever les fiches des constructeurs comme pour l'EOS RP.

**Contre-vérification : confirmé.** Toutes les citations du tableau sont retrouvées dans les pages relues le 13 novembre 2026 (communiqué de Nikon du 10 novembre 2016 ; révisions 1345325532, 1380408739, 1374030103, 1381131251 et 1367164927 de Wikipedia). L'incohérence est réelle : `data/sources.yaml` (`canon-eos-rp-pixels`) et `bodies.ts` disent la fiche de Canon relevée par Julien, les tableaux des l. 29 et 176 disent encore « page non ouverte ». Le dépôt signalait déjà lui-même ces valeurs comme non ouvertes : le constat ne révèle aucune valeur fausse. Correction proposée juste ; à mener avec le lot « sources », qui couvre les mêmes entrées.

### PHY-16 · à améliorer · Exemples calculés avec les libellés, alors que le code prend les valeurs exactes des crans

- Endroit : `docs/camera-physique.md`, l. 33 (« Les calculs utilisent les valeurs exactes des crans »), puis l. 65, 296-301, 416 et 540.
- Preuve (calcul, `scripts/exemples.py`) : le code prend N = 2^(j/6) et t = 2^(−k/3), soit f/1,414 pour « f/1.4 », f/1,782 pour « f/1.8 », f/22,63 pour « f/22 », 1/101,6 s pour « 1/100 ». Les exemples prennent 1,4, 1,8, 22 et 0,01 :
  - l. 65 : c = 2,10 mm écrit ; 2,12 mm avec la valeur exacte ;
  - l. 297-299 : flou attendu 58,7 px et 25,1 px ; 58,1 px et 24,8 px avec la valeur exacte. La mesure de 57,25 px est alors à 1,5 % de l'attendu, et non 2,5 % : la conclusion de la l. 301 tient ;
  - l. 416 : 6,76 fois la limite avec 0,01 s, 6,66 avec la valeur exacte (la documentation écrit « 6,6 à 6,8 », mesuré 6,6) ;
  - l. 540 : hyperfocale « ≈ 4 m » (3,95 m) ; 3,89 m avec N exact et le terme + f.
- Correction proposée : recalculer ces quatre exemples avec les valeurs exactes, ou écrire à chaque fois « avec la valeur du libellé ».

**Contre-vérification : réfuté.** Exagéré. Recalculé : au degré de précision écrit, trois des quatre exemples ne changent pas (l. 65 : « ≈ 2,1 mm » pour 2,10 comme pour 2,12 ; l. 416 : « ≈ 0,19 mm », « 6,6 à 6,8 fois » et « environ 8 px » couvrent 0,191 mm, 6,66 fois et 8,0 px ; l. 540 : « ≈ 4 m » pour 3,95 comme pour 3,89 m). Seul le flou attendu du viseur bouge (58,7 → 58,1 px ; 25,1 → 24,8 px), de 1 %, dans le sens qui rapproche la mesure, et la conclusion de la l. 301 tient ; les pourcentages de la l. 66 bougent d'un dixième de point. Écrire le calcul avec le libellé (« 135 / 1,4 ») est la façon lisible de donner un exemple. Au plus, une phrase à la l. 33 : « les exemples chiffrés prennent les libellés ; l'écart avec les valeurs exactes est d'au plus 3 % (f/22) ».

### PHY-17 · à améliorer · Indicateur d'équilibre : le sujet en mouvement est cherché à la distance de mise au point, pas sous le point visé

- Endroit : `app/src/ui/balance.ts`, l. 131-157.
- Preuve (code) : `const aimed = new Vector3(…* S1, …* S1, S1)` avec `S1 = this.autofocus.distance()` (l. 121 et 134) ; le sujet est retenu si `Math.hypot(mv.position.x - aimedWorld.x, mv.position.z - aimedWorld.z) < MOVER_RADIUS_M` (l. 142-149) ; la traînée est ensuite calculée avec `aimed.z` et `aimed.x` (l. 155-156), pas avec la position du sujet.
- Conséquence : en AF-S, distance verrouillée sur Sophia (6,6 m), si l'on place ensuite le point sur le chien (9 m), le point reconstruit est 2,4 m devant le chien : l'indicateur écrit « sujet immobile » alors que la photo montrera la traînée. Quand le sujet est retenu, sa traînée est calculée à la distance de mise au point, à 1 m près. Le bulletin, lui, mesure à la position du sujet (`bulletin.ts`, l. 88-98).
- Correction proposée : chercher le sujet le long du rayon du point visé (distance du sujet à ce rayon, vue de dessus), et calculer la traînée avec la position du sujet dans le repère de la caméra, comme `bulletin.ts`.

**Contre-vérification : confirmé.** Correction à corriger. Code relu : le point est reconstruit à la distance de mise au point (`balance.ts`, l. 121 et 134) et la traînée calculée avec `aimed`, pas avec la position du sujet. L'exemple est à reformuler : en AF-S, toucher le chien refait la mise au point sur lui ; le cas se produit quand on verrouille sur Sophia puis qu'on recadre pour amener le point sur le chien (la « mise au point suivie d'un recadrage » de la l. 335). La recherche « le long du rayon » proposée crée un faux positif : un sujet en mouvement qui passe derrière un personnage immobile visé, à moins de 1 m du rayon, serait pris pour le sujet visé, ce que le code actuel évite. À faire : (1) calculer la traînée à la position du sujet, par la fonction de `bulletin.ts` (une seule formule pour les deux) ; (2) pour la recherche, prendre la profondeur lue sous le point dans la carte du viseur plutôt que la distance verrouillée, ou garder la recherche actuelle et écrire cette limite.

### PHY-18 · à améliorer · Bruit : deux hypothèses non dites

- Endroit : `app/src/camera/noise.ts`, l. 85-89 et l. 140-145 ; `app/src/camera/photo.ts`, l. 174 ; `docs/camera-physique.md`, l. 159-165.
- Preuve (code) : `vec3 electrons = max(v, 0.0) * noiseSaturation;`, où `v` est la couleur affichée en lumière linéaire. Les canaux rouge, vert et bleu de l'image tiennent donc lieu de canaux bruts du capteur : ni gains de balance des blancs, ni matrice de couleur. Les tirages sont gaussiens (`gaussianAt`), y compris pour quelques électrons.
- Ce que disent les sources lues pour l'audit : Wikipedia, « Image noise », révision 1377731967 : « In color cameras where more amplification is used in the blue color channel than in the green or red channel, there can be more noise in the blue channel » ; et la loi de Poisson « can be approximated by a Gaussian distribution for large image intensity ». Je ne sais pas chiffrer l'écart pour les six boîtiers.
- Correction proposée : ajouter aux limites de la section « Bruit numérique (version 0.3.15) » : « les canaux de l'image tiennent lieu de canaux du capteur (pas de gains de balance des blancs ni de matrice de couleur) ; tirages gaussiens, approximation de la loi de Poisson, moins bonne dans les ombres profondes ». À reprendre avec la balance des blancs (COU-01, COU-02).

**Contre-vérification : confirmé.** `addSensorNoise` applique bien le modèle aux canaux de l'image affichée. Déjà dit en partie : la documentation nomme les « tirages gaussiens » (l. 162) sans dire que c'est une approximation, et `docs/specifications/balance-des-blancs.md` écrit « Le bruit propre à chaque couche après gains n'est pas simulé », mais pour une fonction reportée, pas dans la section du bruit. Citation de Wikipedia exacte ; pour l'approximation gaussienne, citer plutôt Claff (« Gain », voir PHY-04). Une phrase dans les limites de la section suffit, dans la même modification que PHY-04.

### PHY-19 · à améliorer · Flou du viseur : « sans copie », mais la boucle est celle de l'exemple de bgfx

- Endroit : `docs/camera-physique.md`, l. 277 (« Le code de TutoPhoto est écrit d'après cette description, sans copie ») ; `app/src/camera/viewfinderDof.ts`, l. 87-102.
- Preuve (source contre code) : `bokeh_dof.sh` de bgfx (« Copyright 2021 elven cache », licence de bgfx), fonction d'origine recopiée en commentaire (« this is the function at bottom of blog post ») :
  `float m = smoothstep(radius-0.5, radius+0.5, sampleSize); color += mix(color/total, sampleColor, m); total += 1.0; radius += RADIUS_SCALE/radius;`
  TutoPhoto : `float m = smoothstep(radius - 0.5, radius + 0.5, absSample); color += mix(color / total, sampleColor, m); […] total += 1.0; radius += radiusStep / radius;`
  Les quatre instructions du cœur de la boucle sont les mêmes, aux noms près. Le poids du centre, l'arrêt de la spirale, la compensation de la mi-résolution et la recomposition sont propres à TutoPhoto.
- Ce que je ne sais pas : si quatre lignes d'un algorithme publié créent une obligation de licence, et sous quelle licence est le billet d'origine (non lu). C'est une question de droit.
- Correction proposée : écrire « boucle reprise de l'algorithme de Gustafsson, tel que le reproduit l'exemple 45-bokeh de bgfx » à la place de « sans copie » ; soumettre à Julien, avec `docs/licences.md`, l'ajout de la mention de copyright et de la licence BSD à 2 clauses de bgfx aux crédits.

**Contre-vérification : confirmé.** Fichiers de bgfx relus le 13 novembre 2026. La boucle de `DepthOfField` (`if (sampleSize > centerSize)`, `clamp(absSampleSize, 0.0, absCenterSize*2.0)`, `smoothstep(radius-0.5, radius+0.5, absSampleSize)`, `color += mix(color/total, sampleColor, m)`, `total += 1.0`, pas de `u_radiusScale/loopValue`) et la recomposition de `fs_bokeh_dof_combine.sc` (`saturate(sampleSize-1.0)`) se retrouvent, aux noms près, dans `viewfinderDof.ts` (l. 94-100 et 118) : « sans copie » est inexact. bgfx n'apparaît ni dans `docs/licences.md` (« Code de tiers dans le site publié » ne cite que Babylon.js) ni dans les crédits. Sa licence (BSD à 2 clauses, « Copyright 2010-2026 Branimir Karadzic » ; en-tête des deux fichiers : « Copyright 2021 elven cache ») demande de garder la notice dans les redistributions du code source. Je ne sais pas si ces lignes y sont soumises ; ajouter la notice coûte peu et lève le doute. Correction proposée juste : Julien tranche.

### PHY-20 · à améliorer · Le critère du sujet « figé » a une source qui n'est pas citée

- Endroit : `docs/camera-physique.md`, l. 416, 418 (« les seuils, eux, sont sourcés ») et l. 531 ; `app/src/ui/balance.ts`, l. 10 ; `app/src/camera/bulletin.ts`, l. 6-8.
- Ce qui est écrit : la traînée est comparée « au même flou acceptable » d / 1500, avec pour source l'article « Circle of confusion », cité pour le flou de mise au point. Rien ne dit que ce seuil s'applique à un flou de mouvement.
- Preuve (source) : la même révision 1335590423 le dit, dans sa partie historique : « The common 1/100 inch CoC limit has been applied to blur other than defocus blur. For example, Wall (1889, p. 92) says: To find how quickly a shutter must act to take an object in motion that there may be a circle of confusion less than 1/100 in. in diameter, divide the distance of the object by 100 times the focus of the lens, and divide the rapidity of motion of object in inches per second by the results ». C'est la formule de TutoPhoto pour un sujet de profil : traînée = f × v × t / distance.
- Correction proposée : citer ce passage aux trois endroits, et dire ce qui reste un choix de TutoPhoto : prendre la limite d / 1500 d'aujourd'hui à la place du 1/100 de pouce de 1889.

**Contre-vérification : confirmé.** Passage retrouvé mot pour mot dans la révision 1335590423 (section « Wall 1889 ») ; la règle de Wall, pose = distance / (100 × focale × vitesse du sujet), donne une traînée f × v × t / distance égale à la limite de 1/100 de pouce. Le constat joue en faveur du travail audité : le critère a une source, il manque sa citation. Correction proposée juste ; écrire que la source est secondaire (Wikipedia citant Wall, 1889) et que prendre d / 1500 pour le mouvement reste un choix de TutoPhoto.

### PHY-21 · à améliorer · Photo interrompue par le plafond de 5 s : disque d'ouverture tronqué, flou sous-estimé (ajouté à la contre-vérification)

- Endroit : `app/src/camera/photo.ts`, l. 376-399 et 406-415 (version courante) ; `docs/camera-physique.md`, l. 130 ; `app/src/ui/shutter.ts`, l. 530-531.
- Ce qui est écrit : « Le calcul s'arrête au bout de 5 s ; la photo indique alors les rendus reçus sur les rendus prévus. »
- Preuve (code) : les points du disque d'ouverture sont parcourus du centre vers le bord, `const r = lensRadius * Math.sqrt((i + 0.5) / planned);`, et la boucle sort par `if (performance.now() - started > TIME_BUDGET_MS) break;`. La moyenne porte sur les rendus reçus (`invSamples`, `1 / done`), sans autre correction. Les instants, eux, sont permutés (`((i * stride) % planned) + 0.5`) : interrompus, ils restent étalés sur la pose.
- Preuve (calcul, `disque_tronque.py`) : avec 128 rendus reçus sur 256, le disque couvert a 0,71 fois le rayon de l'ouverture ; avec 64 sur 256, 0,50 fois. Le flou de mise au point de la photo est multiplié par √(reçus / prévus) : 64 rendus sur 256 donnent le flou d'une ouverture fermée de deux diaphragmes, à exposition inchangée.
- Conséquence : sur un appareil lent, les photos à grand flou (portrait à grande ouverture, loupe de l'écran de revue) montrent moins de flou qu'elles ne devraient, et la légende (« 64/256 rendus ») ne le dit pas. Sur le téléphone de Julien, 256 rendus prennent 2,0 s (l. 146) : le cas ne s'y produit pas. Je ne sais pas s'il se produit sur les téléphones des testeurs, dont les temps ne sont pas mesurés (`docs/questions-ouvertes.md`). En rendu logiciel, la documentation donne de l'ordre d'une seconde pour un rendu de 600 px (l. 144) : la routine de test atteint sans doute le plafond, mais elle ne mesure pas le flou ; non vérifié.
- Correction proposée : parcourir les rendus dans un ordre permuté, comme le sont déjà les instants (indice i′ = (i × pas′) mod prévus, pas′ premier avec prévus ; point du disque et instant calculés à partir de i′). Un calcul interrompu échantillonne alors tout le disque, avec des copies plus espacées, que le lissage (rayon 0,45 × flou / √reçus) atténue déjà ; un calcul complet garde les mêmes paires point-instant, donc la même photo. Écrire la limite à la l. 130. À vérifier dans un navigateur avant de fusionner.

**Contre-vérification : confirmé.** Correction à corriger. Code relu (`photo.ts`, l. 376-399, 411 et 415 ; le plafond et l'ordre du disque datent de la version 0.3.14, donc du lot) et calcul refait par un script écrit pour cette vérification (`phy21.py`) : les rendus reçus sont exactement la spirale d'un disque de rayon √(reçus / prévus) fois celui de l'ouverture, à exposition inchangée. Le dépôt ne le dit nulle part : la l. 130 annonce l'arrêt, pas son effet sur le flou. Puis mesuré, le 13 novembre 2026, dans Chromium sans écran (rendu logiciel) : 135 mm à f/1.4, mise au point sur le sol à 5,8 m, flou du fond attendu de 93,9 px ; diamètre du flou ajusté sur une photo de référence à f/22 (`ajuste.py`), le même à 1 px près sur trois zones du fond.

| Photo | Légende | Flou du fond mesuré |
| --- | --- | --- |
| code non modifié | « 97/256 rendus, calculée en 47,2 s » | 58 px (disque tronqué : 93,9 × √(97 / 256) = 57,8 px) |
| copie hors du dépôt, plafond levé | « 256 rendus, calculée en 117,4 s » | 93 px |
| copie, arrêt forcé après 64 rendus | « 64/256 rendus, calculée en 31,4 s » | 47 px |
| copie, plafond levé, f/2.8 | « 114 rendus, calculée en 58,5 s » | 47 px |

Le défaut se produit donc dans cet environnement, code non modifié (de même avec la mise au point de départ, à 26,7 m : « 97/225 rendus, calculée en 45,5 s »), et une photo à f/1.4 interrompue au quart a le flou du fond d'une photo à f/2.8. Le plafond n'y borne pas la durée du calcul : 47,2 s. La routine de la CI ne voit rien : ses photos, à f/8, n'ont que 16 rendus et sont complètes (« 16 rendus, calculée en 13,4 s », job « routine (ordinateur) » du 13 novembre 2026). Sur un vrai processeur graphique : je ne sais pas (téléphone de Julien : 256 rendus en 2,0 s, sans interruption).

Correction :
1. Tout de suite, écrire à la l. 130 qu'une photo interrompue a un flou de mise au point réduit de √(reçus / prévus), et que le plafond n'a pas borné la durée du calcul en rendu logiciel (47 s mesurées).
2. Ne pas coder le parcours proposé tel quel. Avec pas′ = pas, les instants prennent l'indice (i × pas²) mod prévus ; or pas² ≡ 1 pour dix nombres de rendus prévus (21, 24, 30, 39, 42, 48, 55, 80, 144, 208) et pas² ≡ −1 pour trois (34, 89, 233). Les instants se suivent alors dans l'ordre, ou dans l'ordre inverse : un calcul interrompu au quart ne couvre plus que 26 à 31 % de la pose (calculé pour 42, 48, 55, 80, 144 et 208), et c'est la traînée qui est tronquée à la place du disque. Sur les 241 nombres de rendus possibles, 81 donnent ainsi un calcul interrompu mal réparti (au quart, à la moitié ou aux trois quarts : pose couverte à moins de 90 %, ou saut entre instants plus de 4 fois, ou vide du disque plus de 2 fois celui d'une répartition régulière). Avec un pas′ quelconque premier avec prévus, un quart à deux tiers des pas′ échouent, selon le nombre de rendus (neuf nombres essayés).
3. L'ordre doit donc être choisi et contrôlé par un script pour tous les nombres de rendus de 16 à 256, puis dans un navigateur. Candidat essayé : les mêmes paires point-instant, parcourues « le plus loin d'abord » (chaque rendu est le plus éloigné des rendus déjà faits, sur le disque et dans la pose). Calcul : rayon quadratique moyen des rendus reçus de 0,92 à 1,19 fois celui du disque, pose couverte à 97 % au moins. Navigateur : 64 rendus sur 256 donnent un flou du fond de 99 à 101 px pour 93,9 attendus, contre 47 px avec l'ordre actuel. Cet ordre favorise le bord du disque (+7 % ici) : biais à réduire, ou à écrire.
4. La routine n'a aucune photo à plus de 16 rendus : y ajouter une photo à grand flou (135 mm à f/1.4) avec la correction.

## Vérifié

Exposition
1. EV₁₀₀ = log₂(N²/t) − log₂(S/100) : équation « ev100 » de Filament ; `exposure.ts`, l. 66-69, fait ce calcul.
2. EV = log₂(L × S / K), K = 12,5 (« used by Canon, Nikon and Sekonic »), L = 2^(EV₁₀₀ − 3) : Filament, et Wikipedia « Exposure value ».
3. H_sat = 78 / S_sat, q = 0,65, L_max = 2^EV₁₀₀ × 1,2 : Filament ; Wikipedia « Film speed » donne les mêmes 78 lx·s et q = 0,65.
4. Table des indices de lumination : « Typical scene, cloudy bright (no shadows) » 13, « Typical scene, heavy overcast » 12, tirée des guides ANSI PH2.7-1973 et PH2.7-1986.
5. 2^9,5 ≈ 724 ; 2^12,5 ≈ 5 793 ; 64 / 5 793 ≈ 1/90 s ; 78 / 65 = 1,2.
6. Échelles : 25 ouvertures, 52 vitesses, 19 ISO ; les crans entiers tombent aux bons indices ; les libellés des ouvertures sont ceux de l'échelle par tiers de Wikipedia ; les crans entiers des vitesses, ceux de « Shutter speed ».
7. Réglages de départ : EV₁₀₀ = 12,667, soit −1/6 IL.
8. EV₁₀₀ = (a + s − i − 12) / 3 et somme visée 49,5 − c ; les deux exemples (1/400 s ; 1/200 s avec +1 IL) sortent du code compilé.
9. `resolveExposure` : sur 5 241 600 combinaisons, aucune règle annoncée n'est violée (M, A, S, ISO auto, plafond, vitesse minimale, égalité vers le cran qui assombrit, clignotement).
10. Manuel du Z 6 : toutes les citations des modes, de la correction (−5 à +5 IL par tiers ; « is not reset when the camera is turned off » ; mode M), de l'ISO auto, des indicateurs qui clignotent et de la page « Defaults » sont dans les pages relues.
11. Manuel du D850 : « the minimum value for auto ISO sensitivity is automatically set to ISO 64 », la règle des modes P et A, et 1/30 s sans données d'objectif.

Bruit
12. Les 98 valeurs de bruit de lecture de `bodies.ts` sont celles du graphique de Claff, converties de log₂ (aucun écart).
13. Les six capacités sont celles de la table dérivée de DxOMark ; gain unitaire du Z 6 : 522,6 ; 522,6 / 100 × 16 383 ≈ 85 600.
14. Axes du graphique : log₂(ISO / 3,125) et log₂(électrons), lus dans le code de la page ; dates de révision des deux pages.
15. Les deux mises en garde de Claff sont citées exactement.
16. e_sat(S) = capacité × 100 / S : c'est le calcul de la colonne « Saturation (e-) » de la page de Claff (voir PHY-13).
17. Exemple du Z 6 à ISO 6400 : 1308 ; 131 ; 11,5 ; 8,8 % ; k = 16,3 ; 8,2 et 4,1 ; 3,1 % et 4,3 %.
18. Shader : σ = √(n + σ_r²) / (e_sat × √(k × part)) ; somme de deux tirages divisée par √2 ; cos 37° et sin 37° ; Box-Muller.
19. Bayer : « twice as many green elements as red or blue ».
20. Arithmétique des comparaisons mesuré/prévu : 88 à 92 %, 98 à 105 %, 82 à 84 % ; 11,3^(1/2,2) ≈ 3,0 ; rapports mesurés 2,8 à 2,9.
21. Babylon 9.35.0 : `LinearEncodePowerApprox = 2.2` ; avec `applyByPostProcess`, `clamp(finalColor.rgb, 0., 30.0)`.

Profondeur de champ et flou
22. c = A × |S₂ − S₁| / S₂ × f / (S₁ − f) : formule de Wikipedia, « exact for a simple paraxial thin lens » ; même formule dans le shader de Babylon, plafonnée à 1.
23. Flou acceptable d / 1500, « 0.029 mm for full-frame 35 mm format » : « a widely used CoC limit ».
24. Zone nette S₁ / (1 ± q), q = c × N × (S₁ − f) / f² : dérivation refaite ; exemples 4,1 à 16,6 m, 7,4 m à f/1.4.
25. Photo : œil déplacé sur un disque élargi de S / (S − f), projection décentrée de dx × m0 / S : la dérivation redonne le flou des lentilles minces.
26. Nombre de rendus et lissage : 0,9 × flou / √M (espacement de M points sur un disque : 0,886), traînée / M, de 16 à 256, 5 s, 0,45 × flou / √M : le code fait ce que la documentation dit.
27. Exemple du 85 mm à f/1.8 : 47,2 mm ; 2,1 mm ; 5,8 % et 8,9 %.
28. Flou du viseur : unités de la passe à mi-résolution, compensation de 0,92 pixel² (0,25 + 0,67), disque de variance D² / 16, 11,55 px, 0,2 % au plafond, environ 170 échantillons, poids du centre 0,375.
29. Haeberli et Akeley : « a general solution to the problems of motion blur and depth-of-field » ; l'algorithme de `bokeh_dof.sh` est celui que décrit la documentation.

Mouvement
30. Traînée f × (vX Z − X vZ) / Z² × t : dérivée de x = f X / Z ; `balance.ts` et `bulletin.ts` la calculent ainsi.
31. Chien à 1/100 s : 0,19 mm, 6,6 à 6,8 fois la limite, environ 8 px ; à 1/4000 s : 0,005 mm, 0,2 px.
32. Limite en pixels de la photo : d / grand côté = 1,2 px pour le Z 6.

Champ, loupe, autofocus, déclenchement
33. Champ : viseur, photo et vue de dessus utilisent la même formule ; 39,5°, 22,8 px par degré, 154, 6,8, 38.
34. Loupe : 6066 / 1109 ≈ 5,5 ; crans et saut du 50 % conformes au code.
35. Manuel du Z 6, « Focus » : citations de l'AF-S, de l'AF-C, des priorités, des zones larges, du sujet le plus proche, du déclencheur tactile, de la zone automatique, des couleurs ambre et verte ; réglage a4 ; P1100 ; Sony α9.
36. Couverture du Z 6 : « approximately 90% of the imaging area both horizontally and vertically », dans les deux communiqués ; page du produit ; √0,93 = 0,964, marge de 1,8 % ; marges de 6 % pour l'EOS RP.
37. Détection des visages : distances de l'exemple (11,3 m et 22,6 m ; 4,1 m et 8,1 m ; 30,6 m) ; écart des yeux de Dennis (6,5 cm) et de Percy (6,0 cm) recalculés sur les coordonnées de `scene.ts`.
38. Modes de déclenchement : 1 à 5 vues par seconde, 5,5, 12 (9 en NEF 14 bits), retardateur de 2, 5, 10 ou 20 s, 1 à 9 vues, d2 de 1 à 200 ; termes français du manuel.

Boîtiers et scène
39. Z 6 : « 35.9 × 23.9 mm CMOS sensor », « 24.5 million » ; A7 III : « 35.6 mm × 23.8 mm », « Approx. 24 200 000 pixels » ; Wikipedia : APS-C de Sony et de Nikon, « 23.6–23.7 » × « 15.60 ».
40. Aperçu et loupe : citations du guide Sony (« Live View Display », « Focus Magnifier », « Enlarge Image ») et du réglage d8 de Nikon.
41. Scène : les repères de la vue de dessus sont les positions de chargement ; hauteur de l'œil et rayon du fond sont les mêmes dans `scene.ts`, `photo.ts`, `autofocus.ts` et `bulletin.ts` ; Poly Haven ne publie pas de luminance absolue (sa fiche donne « overcast », « midday », `evs_cap: 6`).

## Je ne sais pas

1. Les valeurs de Canon (EOS RP et EOS 2000D) à la source : `www.canon.co.uk` refuse les lectures automatiques ; seuls Wikipedia et le relevé de Julien les appuient. Wikipedia écrit « 36 × 24 mm » pour le capteur de l'EOS RP, là où le relevé dit 35,9 × 24.
2. Les dimensions du capteur du D5600 et de l'A6000 chez leur constructeur : pages non joignables.
3. La couverture de l'autofocus de l'A7 III et le texte de Sony sur l'A6000 : pages non joignables.
4. Le billet de Gustafsson : non joignable.
5. Si Babylon rend bien les personnages environ deux fois trop clairs par rapport au fond (PHY-06) : je l'ai déduit des fichiers et des valeurs par défaut de Babylon, sans le mesurer dans un rendu.
6. Les mesures faites dans le viseur (bruit, flou, rapport 2,00 par diaphragme, « 1,86 avec la courbe sRGB exacte », temps de calcul) : pas refaites, faute de navigateur.
7. Les valeurs « prévu » des tableaux de bruit : elles dépendent de l'image mesurée, que je n'ai pas.
8. La taille du cadre pendant les mesures : la documentation donne 1109 px (loupe, l. 236), 1060 px (flou, l. 298), et des k de 31,3 et 32,7 qui correspondent à 1084 px et 1061 px. Avec 1109 px, k vaudrait 29,9, et 1,00 à 100 % au lieu de 1,05. Je ne sais pas quelles valeurs sont justes.
9. Comment Claff obtient le champ `fwc` de son graphique du bruit de lecture.
10. La constante K des posemètres de Sony : Filament cite Canon, Nikon et Sekonic (12,5), Pentax et Minolta (14).
11. Dans quel ordre un Nikon, en mode S avec l'ISO auto, change l'ouverture et la sensibilité : les manuels disent seulement que la sensibilité change « if optimal exposure cannot be achieved at the value selected ».
12. Ce que la visée d'un hybride montre du flou de mouvement (PHY-03).
13. Si la vitesse du chien (3,5 m/s) et sa taille (0,6 m au garrot) sont réalistes : `scene.ts` les donne comme « valeur choisie » et « mesure imprécise, à revoir », sans source.
14. L'écart des yeux du chien : 0,316 unité de l'os de la tête, soit 9,3 cm si cet os a l'échelle du porteur (0,6 / 2,05) ; la documentation écrit 9,2 cm. Je n'ai pas lu l'échelle de l'os.
15. L'effet chiffré, par boîtier, des gains de balance des blancs sur le bruit (PHY-18).
16. Le texte des normes ISO 12232 et ANSI PH2.7 : seul Wikipedia est lu.
17. (contre-vérification) Si le plafond de 5 s interrompt le calcul d'une photo sur les téléphones des testeurs (PHY-21) : leurs temps de calcul ne sont pas mesurés.
18. (contre-vérification) Le bruit de la loupe et le plafond du flou à densité 2 (PHY-07, PHY-08) dans un navigateur : établis par le code et le calcul, pas mesurés.
19. (contre-vérification) Une source pour l'addition des variances du bruit photonique et du bruit de lecture (PHY-04) : aucune des pages lues ne l'écrit.
20. (contre-vérification) Si les lignes reprises de l'exemple de bgfx créent une obligation de licence (PHY-19) : question de droit, non tranchée.

## Hors du lot, vu en passant

- `docs/camera-physique.md`, section « Grilles de cadrage (version 0.3.56) » : la l. 560 annonce cinq boutons radio et quatre grilles, mais ne liste que trois valeurs mémorisées (`none`, `thirds`, `sixteen`) ; la l. 582 parle de « trois boutons » et la l. 605 de « Deux grilles (tiers, seize cases) ». `cameraPanel.ts` (l. 161-176) a cinq valeurs : `none`, `thirds`, `sixteen`, `twentyFour`, `thirdsDiagonals`. À reprendre par le lot qui couvre la version 0.3.56.

