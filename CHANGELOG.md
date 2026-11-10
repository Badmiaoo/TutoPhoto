# Changelog

Évolutions du dépôt, de la plus récente à la plus ancienne. Chaque pull request fusionnée donne une version : elle ajoute ici sa section, que la CI contrôle (`scripts/changelog.py check`). Après la fusion, le workflow `.github/workflows/tag.yml` pose le tag annoté `vX.Y.Z` sur le commit de fusion et publie la release GitHub correspondante, avec le texte de cette section.

## Numérotation `vX.Y.Z`

- X : 0 jusqu'à la publication de la V1.
- Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`.
- Z : tout le reste (textes, sources, documentation, scripts, CI) ; remis à 0 quand Y augmente.

## Rubriques

Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré.

## [0.3.33] - 2026-11-10

### Ajouté

- Modes de déclenchement (BOI-12), demande de Julien du 10 novembre 2026, d'après le manuel du Nikon Z 6 :
  - vue par vue, Continu L (1 à 5 vues par seconde), Continu H (5,5), Continu H (étendu) (12), retardateur (2, 5, 10 ou 20 s) ;
  - rafale tant que le déclencheur est tenu, une vue par intervalle, jamais plus vite que la durée de pose ; chaque vue à son instant et avec l'orientation de l'appareil alors ; mise au point refaite à chaque vue en AF-C, verrouillée sur la première en AF-S ;
  - série à trier dans l'écran de revue (« Vue 2/5 · +0,20 s ») ; 20 vues au plus par rafale, pour le temps de calcul.
- Sources `nikon-z6-release-mode` et `nikon-z6-release-mode-fr`, rattachées à BOI-12.
- Routine de test : rafale en Continu L à 5 vues par seconde, vues espacées de 0,2 s.

### Modifié

- Le déclencheur réagit à l'appui (et non plus au clic), avec capture du pointeur : le relâchement arrive au bouton même si son texte (nombre de vues) change sa taille sous le curseur, ce qui coupait la rafale à une vue sur le profil iPhone. Au clavier, un clic vaut un appui bref.
- Toucher du viseur : sa durée se mesure avec l'horodatage des événements, pour qu'une image longue entre l'appui et le relâchement ne le change pas en glissé (échec ponctuel de la routine sur Android).
- `docs/camera-physique.md` (section « Modes de déclenchement »), `docs/historique.md`, README.

## [0.3.32] - 2026-11-10

### Ajouté

- Figer le mouvement (MVT-01, « traînée mesurée en pixels ») : la ligne « vitesse » de l'indicateur d'équilibre donne aussi la traînée du sujet visé en pixels de la photo (traînée sur le capteur × 1500 / largeur du capteur), par exemple environ 8 px pour le chien à 1/100 s.
- Routine de test : la traînée du chien à 1/4000 s est sous 1 px.

### Modifié

- Fluidité du viseur jugée bonne par Julien sur son Google Pixel 8 Pro (10 novembre 2026) : `docs/camera-physique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.31] - 2026-11-10

### Ajouté

- Indicateur d'équilibre entre ouverture, vitesse et ISO, au point visé : forme B choisie par Julien (un triangle dans lequel un point bouge), avec des seuils sourcés seulement (principe du 10 novembre 2026) :
  - ouverture : zone nette, sans jugement, tirée de la formule du cercle de confusion avec le flou acceptable d/1500 ;
  - vitesse : traînée du sujet visé (chien, promeneur) comparée au même flou acceptable ;
  - ISO : rapport signal sur bruit au point visé, seuils 40:1 (excellent) et 10:1 (acceptable) de la norme des sensibilités numériques ;
  - le point part vers le réglage qui dépasse ; bloc repliable « Limites et lecture » ; interrupteur dans la fenêtre « Aperçu » ;
  - dans le viseur, en haut à gauche ; sur petit écran, le triangle seul, et les lignes au toucher.
- Source `wikipedia-circle-of-confusion` ; `wikipedia-film-speed` complétée (vitesse fondée sur le bruit).
- Routine de test : viseur d'au moins 35 % de la hauteur de la fenêtre ; indicateur aux réglages par défaut ; bruit au même point du sol à ISO 100 puis à ISO 6400 ; traînée du chien évaluée.

### Modifié

- Sujets en mouvement de la scène : identifiant et vitesse orientée, pour la traînée ; identifiant du visage suivi dans la cible de la zone automatique.
- `docs/camera-physique.md` (section « Indicateur d'équilibre »), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.30] - 2026-11-10

### Modifié

- `CLAUDE.md` : principe de Julien du 10 novembre 2026. On n'implémente que ce qui est sourcé ; le but est que des débutants découvrent la photo et maîtrisent leur boîtier et les bases, pas d'en faire des professionnels ; ce critère tranche les questions de conception.
- `docs/cadrage.md` : le texte complet de Julien et ce qu'il tranche, dont les deux questions sur l'indicateur d'équilibre (profondeur de champ montrée sans jugement, bougé de la main exclu tant qu'il n'est ni sourcé ni simulé).
- `docs/historique.md`, `docs/questions-ouvertes.md`, `docs/camera-physique.md`.

## [0.3.29] - 2026-11-09

### Ajouté

- AF zone automatique et détection des yeux (MAP-09), décision de Julien du 9 novembre 2026, d'après le manuel du Nikon Z 6 :
  - réglage « Détect. visage-yeux AF zone auto » : visages et yeux, visages seulement, animaux (le chien), désactivé ;
  - un œil est vu s'il est dans le cadre et si rien ne le cache ; seuils de taille du visage choisis pour TutoPhoto ; œil le plus proche de l'appareil ;
  - toucher le viseur choisit le visage le plus proche du point touché, que l'appareil suit ensuite ;
  - sans visage, le sujet le plus proche du cadre (règle du manuel du Nikon COOLPIX P1100, faute de texte pour le Z 6) ;
  - repère ambre autour de l'œil ou du visage, vert une fois verrouillé ; « œil », « visage » ou « sujet le plus proche » dans le viseur et la légende.
- Yeux des personnages : os du squelette pour Sophia et Nathan ; placés par visée sur le modèle pour Dennis, Fabienne, Percy et le chien, puis vérifiés par reprojection.
- Routine de test : œil détecté dans le groupe, sujet le plus proche sans détection, œil du chien en détection des animaux.
- Sources `nikon-z6-a4`, `nikon-z6-a4-fr`, `nikon-p1100-af-area`, rattachées à MAP-09.
- Serveur de développement seulement : accès `window.__tutophoto` (scène, caméra, horloge) pour les mesures, absent du site construit.

### Corrigé

- La carte de profondeur du viseur gardait la taille du canevas à sa création (Babylon ne la redimensionne pas) ; elle suit désormais le canevas, par exemple quand on tourne le téléphone.

### Modifié

- `docs/camera-physique.md` (section « Détection des yeux et zone automatique »), `docs/pile-technique.md` (tests, mesures sur la scène), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.28] - 2026-11-09

### Modifié

- `CLAUDE.md` : mot d'ordre de Julien du 9 novembre 2026, le réalisme partout. TutoPhoto est une sandbox de simulation pour s'entraîner : à chaque choix, le comportement le plus réaliste, sourcé, et ce qui ne l'est pas est dit.
- `docs/camera-physique.md` (décisions), `docs/historique.md` : ce mot d'ordre, et l'accord de Julien sur la détection des yeux (MAP-09).

## [0.3.27] - 2026-11-09

### Ajouté

- Modes de zone AF (MAP-05), décision de Julien du 9 novembre 2026, d'après le manuel du Nikon Z 6 :
  - AF point sélectif, comme avant ;
  - AF zone large (S) et (L) : mise au point sur le sujet le plus proche de la zone ; zones carrées de 10 % et de 20 % du grand côté du cadre, choisies pour TutoPhoto faute de source ; repère à la taille de la zone mesurée.
- Fenêtre « Mise au point » : mode (AF-S, AF-C) et mode de zone, avec les termes du manuel en français. Le bouton du boîtier l'ouvre et affiche les deux (« AF-C · Point »).
- Routine de test : la zone large (L) retient un sujet plus proche que le point sélectif au même endroit.
- Source `nikon-z6-focus-fr` ; `nikon-z6-focus` complétée (zone large, déclencheur tactile) ; les deux rattachées à MAP-05.

### Modifié

- Sans verrou, la photo prend la distance mesurée par l'autofocus du viseur au déclenchement, avec le mode de zone choisi.
- Zone dans l'indicateur du viseur et dans la légende de la photo.
- `docs/camera-physique.md` (section « Modes de zone AF »), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.26] - 2026-11-09

### Ajouté

- AF ponctuel ou continu (MAP-04), décision de Julien du 9 novembre 2026 (« suivons ta reco »), d'après les manuels du Nikon Z 6 et du Sony α9 :
  - bouton « AF-S / AF-C » du boîtier, AF-C par défaut, choix mémorisé ;
  - toucher le viseur tient lieu de déclencheur à mi-course. En AF-S, la distance est mesurée au point touché et reste verrouillée jusqu'au toucher suivant, repère du point en vert ; la photo garde cette distance. En AF-C, la distance suit le point choisi ;
  - indicateur dans le viseur (« AF-S · verrouillée à 6,5 m ») et mode dans la légende de la photo.
- Routine de test : contrôle du verrou en AF-S (distance gardée en relevant l'appareil, puis sur la photo) et du suivi en AF-C.
- Sources `nikon-z6-focus` et citations de `sony-a9-focus-mode`, rattachées à MAP-04.

### Modifié

- La carte de profondeur du viseur passe de la profondeur de champ à l'autofocus. Aperçu de la profondeur de champ coupé, elle n'est plus rendue qu'avant chaque mesure.
- `docs/camera-physique.md` : section « Mise au point », décisions de Julien du 9 novembre 2026 (moment de la balance des blancs, des grilles et de l'histogramme ; forme de l'indicateur d'équilibre ; ordre des modes de mise au point) ; `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.25] - 2026-11-09

### Corrigé

- Chargement bloqué si un des fichiers de code chargés à la demande n'arrive pas : « Failed to fetch dynamically imported module », constaté sur le téléphone de Julien, avec un réseau instable, pour un shader de Babylon.js pourtant publié. Le site tient désormais en un seul fichier JavaScript (4,1 Mo, environ 950 ko compressé) au lieu de 324.

- Grain du flou du viseur sur les petits écrans : au moins 64 échantillons par pixel, sans dépasser 170, et même spirale pour tous les pixels. Le défaut est apparu au contrôle de la profondeur de champ de la routine sur iPhone : 9,01 de netteté avec l'effet, contre 8,84 sans.
- Flou ajouté par la mi-résolution compensé (0,92 pixel² de variance par axe) : 11,5 à 11,75 px mesurés pour 10,9 px attendus au 70 mm à f/2, contre 12,0 à 12,25 px sans la compensation.

### Modifié

- `docs/pile-technique.md`, `docs/historique.md`, `docs/camera-physique.md`.

## [0.3.24] - 2026-11-09

### Modifié

- `docs/camera-physique.md` : fonctions demandées par Julien le 9 novembre 2026, avec leur notion du référentiel et leur équivalent sur le Sony A7 III :
  - balance des blancs, grilles de composition et histogramme, dont la place avant ou après les tests de la V1 minimale reste à décider ;
  - correction de la photo après la prise, en V2 ;
  - équilibre entre ouverture, vitesse et ISO, et modes de mise au point, en discussion.
- Plan de mise en œuvre : BOI-12 désigne les modes d'entraînement, pas le flou de bougé.
- `docs/questions-ouvertes.md`, `docs/historique.md` ; source du guide d'aide Sony ILCE-7M3 complétée.

## [0.3.23] - 2026-11-09

### Modifié

- Profondeur de champ du viseur : flou en disque de taille physique, écrit pour TutoPhoto, à la place de l'effet de Babylon.js (décision de Julien du 9 novembre 2026, option B) :
  - diamètre du flou calculé avec la formule de la photo, en pixels du canevas, loupe comprise, plafonné à 64 px ;
  - flou par « scatter-as-gather » en une passe (Dennis Gustafsson, 2018, lu dans l'exemple 45-bokeh de bgfx), à mi-résolution, puis recomposition en pleine résolution ;
  - un fond flou ne déborde pas sur un sujet net ; un premier plan flou déborde sur un fond net ;
  - poids du pixel central corrigé (pas / 2 au lieu de 1), pour que les petits flous aient leur taille ;
  - spirale arrêtée au plus grand flou présent dans l'image : calcul presque gratuit aux réglages courants.
- Mesures : 10,5 à 11 px pour 10,9 px attendus (70 mm, f/2) ; 57,25 px pour 58,7 px attendus (135 mm, f/1.4), en forme de disque.
- Routine de test : délais allongés pour le rendu logiciel.
- `docs/camera-physique.md`, `docs/historique.md`, `docs/questions-ouvertes.md` ; téléphone de Julien : Google Pixel 8 Pro, Chrome.

### Ajouté

- Sources : billet de Dennis Gustafsson (copie archivée) et exemple 45-bokeh de bgfx.

### Corrigé

- `docs/camera-physique.md` : la section de profondeur de champ portait le numéro 0.3.21 au lieu de 0.3.22, resté de la renumérotation.
- CI : le téléchargement de gitleaks, qui a renvoyé une erreur 504 trois fois le 9 novembre 2026, est retenté jusqu'à cinq fois (`curl --retry 5 --retry-delay 10 --retry-all-errors`).

## [0.3.22] - 2026-11-09

### Ajouté

- Profondeur de champ approchée dans le viseur (`app/src/camera/viewfinderDof.ts`) :
  - effet de profondeur de champ de Babylon.js, alimenté par une carte de profondeur propre au viseur, sol compris ;
  - mise au point continue sur le point choisi ;
  - `lensSize` calé pour qu'un cercle de confusion de 1 corresponde au flou maximal mesuré de l'effet, 24 px, loupe comprise ;
  - case « Profondeur de champ (approchée) » dans la fenêtre « Aperçu », en marche par défaut ;
  - effet retiré pendant le calcul de la photo.
- Routine de test : contrôle de la profondeur de champ du viseur (fond flou au 135 mm à f/1.4, net sans l'effet), mesuré sur une zone de fond du cadre ; capture de cet état.

### Modifié

- `docs/camera-physique.md` : fonctionnement, mesure du flou maximal (19,75 à 28,5 px selon l'écran et la zone, 24 px retenus), écart à mi-course (environ −9 %), limites. `docs/questions-ouvertes.md`, `docs/pile-technique.md`, README.

## [0.3.21] - 2026-11-09

### Corrigé

- Viseur déformé : le moteur n'était redimensionné qu'au changement de taille de la fenêtre, pas quand le canevas changeait de taille avec le panneau du boîtier. Le rendu était étiré et le cadre perdait les proportions du capteur, avec par exemple un rapport de 2,08 au lieu de 1,50 sur un iPhone émulé. Le moteur suit désormais la taille du canevas.

### Ajouté

- Routine de test : contrôle que le rendu a la taille affichée et que le cadre a les proportions du capteur.

### Modifié

- `docs/camera-physique.md` : cause, mesures avant et après ; le bruit du viseur, remesuré, atteint 98 à 105 % du modèle (88 à 92 % sur le rendu étiré).

## [0.3.20] - 2026-11-09

### Corrigé

- Photo noire sur les appareils sans WebGL 2. Les textures du calcul (côtés qui ne sont pas des puissances de 2) étaient en répétition, avec un filtrage qui attend des mipmaps ; elles étaient donc incomplètes en WebGL 1. Elles sont désormais bornées aux bords et filtrées sans mipmaps. Le lissage près des bords ne prend plus de pixels du bord opposé.

### Modifié

- `docs/camera-physique.md` : cause et correction.

## [0.3.19] - 2026-11-09

### Ajouté

- Routine de test sur ordinateur et sur mobile, `scripts/test_app.cjs` : profils ordinateur, Android, iPhone et sans WebGL 2, en émulation (Playwright, Chromium en rendu logiciel). Elle vérifie le chargement, l'absence de problème affiché, le bruit du viseur, l'interrupteur de l'aperçu, la loupe, la photo et la loupe de l'écran de revue.

### Modifié

- `CLAUDE.md` : la routine est lancée avant toute pull request qui touche `app/`. `docs/pile-technique.md` : outil, profils, contrôles et limites.

## [0.3.18] - 2026-11-09

### Corrigé

- Chargement sans fin de la scène sur certains appareils : Babylon attend que les post-traitements de la caméra soient prêts, et un shader du bruit du viseur qui ne compile pas bloquait le chargement. Le bruit du viseur n'est attaché qu'une fois compilé ; en cas d'échec, le viseur reste sans bruit.
- Calcul de la photo : attend la compilation de ses shaders ; une erreur de compilation s'affiche dans la légende au lieu d'une photo noire.

### Ajouté

- Diagnostic à l'écran, pour les téléphones sans console : erreurs JavaScript, shader du bruit indisponible, scène affichée après 30 s sans être déclarée prête (avec les objets en attente).

### Modifié

- `docs/camera-physique.md`, `docs/historique.md`, `docs/questions-ouvertes.md`.

## [0.3.17] - 2026-11-09

### Ajouté

- Loupe du viseur (bouton « Loupe ») : 50 % puis 100 % (un pixel du canevas pour un photosite), centrée sur le point de mise au point, que le toucher déplace ; rotation ralentie d'autant ; bruit à l'échelle du grossissement. La photo couvre toujours tout le cadre.
- Loupe de l'écran de revue : toucher la photo recalcule une fenêtre à 100 % autour du point touché, au même instant, avec la même orientation et la même mise au point ; « Photo entière » pour revenir.
- Définition du capteur en pixels, calculée à partir des pixels effectifs et des dimensions du capteur.

### Modifié

- Bruit à 100 % : moins d'un photosite de chaque couleur par pixel, le modèle garde le bruit d'un photosite seul.
- `docs/camera-physique.md` : loupe, vérification du bruit à 50 % et à 100 %, limites (fond à 360° flou à 100 %). `docs/questions-ouvertes.md`, README.

## [0.3.16] - 2026-11-09

### Ajouté

- Aperçu dans le viseur réglable (bouton « Aperçu ») :
  - un interrupteur général et un par effet (luminosité, bruit), en marche par défaut, mémorisés dans le navigateur ;
  - coupé, le viseur reste correctement exposé et sans bruit : il faut lire la cellule et anticiper ;
  - luminosité coupée et bruit en marche : le bruit est celui de l'image réelle, ramené à une exposition correcte ;
  - bandeau dans le viseur qui dit ce qui n'est pas montré ;
  - la photo garde toujours tous les effets.

### Modifié

- `docs/camera-physique.md` : aperçu dans le viseur, réglages équivalents des Sony A7 III et Nikon Z 6, vérification ; décisions du 9 novembre 2026 sur la visibilité du bruit. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.15] - 2026-11-09

### Ajouté

- Bruit numérique physique, sur la photo et dans le viseur (`app/src/camera/noise.ts`) :
  - bruit de photons et bruit de lecture, en électrons, à partir de la capacité des photosites et du bruit de lecture mesurés par William J. Claff (PhotonsToPhotos) pour chacun des six boîtiers ;
  - bruit coloré selon la matrice de Bayer : rouge et bleu plus bruités que le vert ;
  - bruit brut, sans réduction de bruit ;
  - dans le viseur, nouveau tirage à chaque image ; retiré pendant le calcul de la photo, qui ajoute le sien.
- Définition des six capteurs (pixels effectifs), avec leurs sources.

### Modifié

- `docs/camera-physique.md` : fonctionnement, vérification (bruit mesuré dans le viseur contre bruit prévu) et visibilité du bruit ; temps de calcul de la photo mesurés sur le téléphone de Julien. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.14] - 2026-11-08

### Ajouté

- Photo calculée au déclenchement, par accumulation de rendus (`app/src/camera/photo.ts`) :
  - profondeur de champ exacte, avec le disque d'ouverture élargi de S / (S − f) pour retrouver la formule des lentilles minces ;
  - flou de mouvement ;
  - moyenne en lumière linéaire, puis exposition, écrêtage au blanc et courbe de Babylon ;
  - nombre de rendus selon le flou (16 à 256, 5 s au plus), puis lissage selon la profondeur.
- Mise au point en touchant le viseur : point marqué, distance lue au déclenchement.
- Bouton « Déclencher », barre de calcul, écran de revue (réglages, distance de mise au point, rendus, durée) et enregistrement de la photo en JPEG.
- Projection du sol de la photo à 360° sur un plan, pour que le sol garde sa distance dans la photo calculée.

### Modifié

- Positions et animations des sujets calculées à partir d'une horloge de scène, pour placer la scène à n'importe quel instant du temps de pose.
- `docs/camera-physique.md` : fonctionnement, vérifications et limites de la photo calculée. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.13] - 2026-11-08

### Ajouté

- Boîtier virtuel minimal, première étape de la caméra physique :
  - réglages par tiers de diaphragme : ouverture de f/1.4 à f/22, vitesse de 30 s à 1/4000 s, ISO de 100 à 6400 ;
  - focale de 18 à 200 mm (objectif virtuel), marque et format (plein format ou APS-C) parmi les six boîtiers de référence ;
  - cellule qui affiche l'écart à l'exposition correcte, en IL, pour une scène calée sur EV₁₀₀ = 12,5 ;
  - aperçu de l'exposition dans le viseur : la lumière est multipliée par 2^écart, rapport vérifié sur le site construit.
- Viseur aux proportions du capteur, avec le champ de vue calculé à partir du capteur et de la focale.
- Neuf sources : échelles d'ouvertures, de vitesses et d'ISO (Wikipedia), caractéristiques du Nikon Z 6 et du Sony A7 III (manuels lus), dimensions des capteurs des quatre autres boîtiers (extraits de recherche, pages non ouvertes).

### Modifié

- `docs/camera-physique.md` : dimensions des capteurs d'après les constructeurs, crans par tiers et libellés non sourcés des vitesses intermédiaires, objectif virtuel, description du boîtier virtuel. `docs/historique.md`, README.
- La caméra 3D n'a plus de champ fixe de 50 mm : le boîtier virtuel le règle.

## [0.3.12] - 2026-11-08

### Ajouté

- `docs/camera-physique.md` : décisions du 8 novembre 2026 sur la caméra physique (effets approchés dans le viseur, photo exacte par accumulation de rendus au déclenchement ; plein format ou APS-C ; bruit physique ; trois paires de boîtiers de référence) et modèle proposé, sourcé : exposition d'après Filament, étalonnage de la scène sur EV₁₀₀ = 12,5, profondeur de champ, flou de mouvement, bruit d'après les mesures de PhotonsToPhotos. Plan de mise en œuvre en quatre pull requests.
- Onze sources dans `data/sources.yaml` : les six de la caméra physique, et cinq citées depuis la version 0.3.9 sans y avoir été versées (texte CC BY 4.0, licence de Poly Haven, API de téléchargement de Sketchfab, gros fichiers sur GitHub, historique des modifications sur GitHub).

### Modifié

- `docs/historique.md`, `docs/pile-technique.md`, `docs/questions-ouvertes.md` (méthode de rendu du flou de mouvement tranchée pour la photo), README.

## [0.3.11] - 2026-11-08

### Modifié

- `docs/publication.md` : décision de Julien sur la fuite du 8 novembre 2026, les descriptions des pull requests #1 à #14 restent en l'état.

## [0.3.10] - 2026-11-08

### Ajouté

- Scène de parc : quatre personnages de Renderpeople sous CC BY 4.0 (Dennis, Sophia, Fabienne & Percy, face à l'appareil, et Nathan, qui marche au fond), textures réduites de 8192 à 2048 px ; le malamute de striderrotk (CC BY 4.0), qui galope derrière le groupe. Scène portée à 34,4 Mio.
- Vitesses de marche et de galop mesurées dans les animations, pour que les pieds ne glissent pas ; calculs dans `docs/historique.md` et `app/src/scene.ts`.
- Crédits CC BY affichés avec l'auteur, la page d'origine, la licence et la modification apportée ; `license.txt` de Sketchfab gardé à côté de chaque modèle.

### Modifié

- Composition : groupe à 6,5 m, appareil un peu plus incliné vers le bas, banc et poubelles reculés.
- Chaque modèle est chargé sous un nœud porteur, qui garde la conversion de repère faite par Babylon.
- `docs/questions-ouvertes.md` : droit à l'image des personnes scannées par Renderpeople (non tranché), charge des personnages sur téléphone, vitesse du chien. `docs/historique.md`, `docs/licences.md`, README.

## [0.3.9] - 2026-11-08

### Ajouté

- Scène de parc, premier état : fond et éclairage tirés de la photo à 360° autumn_hockey (Greg Zaal), banc (Kirill Sannikov) et poubelles (GurJas Studios), tous trois de Poly Haven, sous CC0. Fichiers dans `app/public/scenes/parc/` (18,4 Mio).
- Appareil fixe au point de prise de vue de la photo, qui tourne au doigt ou à la souris, avec le champ d'un 50 mm sur plein format le long du grand côté de l'écran ; ombres de contact douces sous les objets.
- Bouton « Crédits » : auteurs, licences et pages d'origine des éléments de la scène, en français et en anglais.
- Manifeste de scène `scene.json` et son schéma `schemas/scene.schema.json`. `scripts/check_scenes.py`, lancé par la CI, vérifie les licences (CC0 ou CC BY), que chaque fichier est listé avec sa taille et son empreinte SHA-256, et les limites de taille (25 Mio par fichier, 100 Mio par scène, provisoires).
- Dépendance `@babylonjs/loaders` 9.35.0 (Apache-2.0), pour charger les modèles glTF.

### Corrigé

- `scripts/check_public.py` contrôle aussi les messages de commit, et reconnaît les liens de session et d'artefact Claude (claude.ai/code/…). Les 28 commits déjà publiés avec un tel lien sont listés dans `scripts/check_public_historique.txt`, sans réécriture de l'historique ; fuite décrite dans `docs/publication.md`. `CLAUDE.md` interdit ces liens dans les commits et les pull requests.

### Modifié

- Décisions du 8 novembre 2026 dans `docs/historique.md` et `docs/questions-ouvertes.md` : fond photo à 360° au lieu d'arbres 3D, trop lourds ; compte Sketchfab pour télécharger les personnages ; chien stylisé qui court pour SIT-06, Shiba Inu retiré. Points à surveiller du fond photo (hautes lumières écrêtées, fond à l'infini, hauteur de prise de vue, mémoire sur téléphone).
- `docs/licences.md` : format des crédits de scène et limites de taille ; `docs/pile-technique.md` : chargement glTF et composition de la scène.
- README : état au 8 novembre 2026 (96 sources, scène affichée), rôle de `app/public/scenes/` et de `scripts/check_scenes.py`. `CLAUDE.md` : lancer `scripts/check_scenes.py` avant toute pull request qui touche les scènes.
- Page des licences du site : `@babylonjs/loaders` et crédits de la scène.

## [0.3.8] - 2026-11-07

### Modifié

- `LICENSE` : titulaire du copyright, Julien Touzeau. `CLAUDE.md`, `docs/publication.md` et `docs/licences.md` en tiennent compte.
- Décisions consignées dans `docs/questions-ouvertes.md` et `docs/historique.md` : scène de parc entièrement en modèles et textures sous CC0 ou CC BY ; fichiers lourds stockés dans le dépôt, avec un contrôle de taille en CI à venir.

## [0.3.7] - 2026-11-07

### Modifié

- Site en ligne sur GitHub Pages (https://badmiaoo.github.io/TutoPhoto/) : adresse ajoutée aux README et à `CLAUDE.md`.
- `CLAUDE.md` et `docs/historique.md` : Julien autorise Claude à gérer la configuration de ce dépôt, et de lui seul.

## [0.3.6] - 2026-11-07

### Ajouté

- `scripts/check_public.py` : refuse secrets (clés privées, jetons d'API aux formats connus, mots de passe en clair), données personnelles (adresses électroniques hors « noreply », téléphones), liens vers des ressources privées et chemins locaux nominatifs dans les fichiers suivis, ainsi que les adresses de commit qui ne sont pas « noreply ».
- CI : job `confidentialite`, qui lance ce contrôle sur tout l'historique des commits, puis gitleaks 8.30.1 (binaire de la release officielle, vérifié par son empreinte SHA-256) sur tout l'historique git.
- `docs/publication.md` : ce qui ne doit jamais être publié, les contrôles, que faire en cas de fuite.
- Trois sources : gitleaks, recherche de secrets et protection des pushes dans la documentation GitHub.

### Modifié

- `CLAUDE.md` : règles du dépôt public.
- `REPRISE.md` : lien vers le Claude Doc d'origine, privé, retiré de la version courante.
- README, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.5] - 2026-11-07

### Ajouté

- Squelette de l'application dans `app/` : TypeScript 7.0.2, Vite 8.3.6, Babylon.js 9.35.0 (versions épinglées). Une scène de départ (sol, sphère de repère, caméra orbitale), une interface en français et en anglais avec un choix de langue mémorisé, et une page `licences/` qui reprend la licence et le `NOTICE.md` de Babylon.js ainsi que les licences du projet.
- CI : le job `app` de `validate.yml` vérifie les types et construit le site à chaque pull request.
- Workflow `pages.yml` : publication sur GitHub Pages à chaque fusion sur `main`, ou à la main.
- Trois sources : @babylonjs/core, Vite et TypeScript dans le registre npm.

### Modifié

- README (lancer l'application), `CLAUDE.md`, `docs/pile-technique.md` (outillage), `docs/licences.md` (code de tiers dans le site publié), `docs/historique.md`, `.gitignore`.

## [0.3.4] - 2026-11-07

### Ajouté

- `docs/pile-technique.md` : comparaison de three.js, Babylon.js, PlayCanvas et three-gpu-pathtracer pour la V1 minimale (licence, profondeur de champ, flou de mouvement, glTF, API graphique), prise en charge de WebGL2 et WebGPU par les navigateurs, trois options. Constats tirés du code source de chaque moteur à sa dernière version publiée. Décision de Julien : Babylon.js.
- Huit sources : les quatre moteurs, three-mesh-bvh, xatlas-web, les données de compatibilité de MDN et le texte de la licence Apache-2.0.

### Modifié

- `docs/questions-ouvertes.md`, `docs/historique.md` et `CLAUDE.md` : pile technique tranchée (Babylon.js) ; README : liste des documents.

## [0.3.3] - 2026-11-07

### Modifié

- Décisions du 7 novembre 2026 consignées dans `docs/questions-ouvertes.md`, `docs/historique.md`, `CLAUDE.md` et les README : nom du projet TutoPhoto ; hébergement sur GitHub Pages d'abord, comme site statique ; testeurs de la V1 minimale pris dans l'entourage de Julien ; scène de parc décidée avec la pile technique.

### Ajouté

- Source `github-pages-limits` : limites de GitHub Pages (taille, bande passante, déploiement, usage).

## [0.3.2] - 2026-11-07

### Ajouté

- `LICENSE` (MIT) pour le code, `LICENSES/CC-BY-SA-4.0.txt` pour les contenus et les données ; textes repris du dépôt de référence SPDX.
- `docs/licences.md` : ce qui est sous quelle licence, ce que cela implique, règles pour les modèles et textures 3D de tiers (CC0 ou CC BY uniquement).
- Trois sources : textes SPDX de MIT, de CC BY-SA 4.0 et de CC0 1.0.

### Modifié

- README, `CLAUDE.md`, `docs/questions-ouvertes.md` et `docs/historique.md` : licences tranchées.

## [0.3.1] - 2026-11-07

### Ajouté

- `data/jalons.yaml` et son schéma : premier jalon `v1-min`, la V1 minimale décidée le 7 novembre 2026 (scène de parc). Il couvre SIT-01, SIT-05 et SIT-06, et 13 notions : leurs 10 notions clés, plus l'ouverture, la vitesse et l'ISO (EXP-04, EXP-05, EXP-06).
- `scripts/validate.py` contrôle les jalons : identifiants existants et non retirés, pas de doublon, et toutes les notions clés des situations du jalon présentes.
- `scripts/coverage.py` donne la couverture de chaque jalon.

### Modifié

- `docs/lire-le-referentiel.md`, `CLAUDE.md` et les README mentionnent les jalons.

## [0.3.0] - 2026-11-07

Décisions du 7 novembre 2026 : boîtiers reflex et hybrides uniquement, scènes en 3D de synthèse dès la V1, plus de découpage V1/V2, V1 minimale testée d'abord (scène de parc : SIT-01, SIT-05, SIT-06).

### Retiré

- Champ `version` (V1, V1→V2, V2) des 191 notions et des 49 situations : toutes relèvent de la V1. Les identifiants `SIT-V2-NN` restent tels quels.
- Champ `capture` des 42 situations qui l'avaient, et sa règle : il décrivait des captures 2.5D.
- `docs/v2-3d.md`, sans objet.
- Contrôles de `validate.py` propres aux versions (notion clé V2 dans une situation V1, notion V2 renvoyant à une situation V1).

### Modifié

- Introductions des domaines et spécifications des simulateurs qui décrivaient la 2.5D ou opposaient V1 et V2 (CMP-01, CMP-05, CMP-06, CMP-07, CMP-14, LUM-02, LUM-03, LUM-04, LUM-07, LUM-09, LUM-14, LUM-16, LUM-18, MVT-08, MVT-11, NET-06, OPT-01, OPT-06, OPT-12, OPT-13, OPT-17) ; chantiers des domaines MAP, MVT et LUM, désormais liés au choix du moteur de rendu 3D.
- BOI-28 : reflex ou hybride uniquement.
- Règle `flash` des situations, sans référence aux captures.
- Source `petschnigg-2004` : plus citée par les données, renvoi à `docs/historique.md`.
- Schémas, `validate.py` et `coverage.py` sans le champ `version` ; `coverage.py` compte les notions par domaine et par niveau.
- `docs/cadrage.md`, `docs/questions-ouvertes.md`, `docs/lire-le-referentiel.md` mis à jour ; `docs/architecture.md` marqué en partie caduc jusqu'au choix de la pile technique ; décisions consignées dans `docs/historique.md`.
- `CLAUDE.md` et les README : public, 3D de synthèse, V1 minimale ; la règle « pas de 3D avant la maquette 2.5D » devient « pas d'extension avant d'avoir testé la V1 minimale ».

## [0.2.4] - 2026-11-07

### Corrigé

- `scripts/changelog.py tag --github` traite toutes les versions au lieu de s'arrêter au premier refus. Le troisième passage de `tag.yml` a créé l'objet tag de `v0.2.0`, mais GitHub a refusé sa référence au jeton du workflow (HTTP 403, « Resource not accessible by integration »). Hypothèse non vérifiée : GitHub refuse ces références quand les fichiers de workflow du commit visé diffèrent de ceux de `main`, ce qui est le cas des anciennes versions.
- Un refus 403 sur une version devient un avertissement, avec la commande pour poser le tag à la main dans le résumé de l'exécution. Le workflow n'échoue que si la version la plus récente reste sans tag.

## [0.2.3] - 2026-11-07

### Corrigé

- Les tags sont créés par l'API de GitHub et non plus par `git push`. Le deuxième passage du workflow `tag.yml` a affiché la cause du refus : GitHub n'autorise pas le jeton d'un workflow, qui n'a pas le droit `workflows`, à pousser un tag dont le commit contient des fichiers de workflow.

### Ajouté

- Une release GitHub par version, avec le texte de sa section du changelog (`scripts/changelog.py tag --github`).

### Modifié

- `tag.yml` ne garde plus d'identifiants git après le checkout (`persist-credentials: false`).

## [0.2.2] - 2026-11-07

### Corrigé

- `scripts/changelog.py` affiche la sortie de git quand une commande échoue. Le premier passage du workflow `tag.yml`, après la fusion de 0.2.1, a trouvé les bons commits (`v0.2.0` sur `804a2de`, `v0.2.1` sur `3bd4ae0`), mais l'envoi du tag a échoué sans dire pourquoi.

### Ajouté

- Le workflow `tag.yml` peut aussi être relancé à la main (`workflow_dispatch`).

## [0.2.1] - 2026-11-07

### Ajouté

- `scripts/changelog.py` : `check` contrôle le format du changelog et, sur une pull request, qu'elle ajoute une version plus récente sans retirer de version publiée ; `tag` pose le tag annoté de chaque version qui n'en a pas, sur le commit de `main` qui a introduit sa section.
- Workflow `.github/workflows/tag.yml` : lance `scripts/changelog.py tag --push` à chaque mise à jour de `main`. La session de travail de Claude ne peut pas pousser de tags ; ce workflow les pose à sa place, et rattrape `v0.2.0`.

### Modifié

- Le workflow de validation contrôle aussi le changelog.
- `CLAUDE.md` et ce changelog décrivent la pose des tags par le workflow.

## [0.2.0] - 2026-11-07

Première version : le dépôt reprend le brouillon de référentiel v0.2 de `REPRISE.md`, tel quel, avec de quoi le contrôler.

### Ajouté

- `REPRISE.md`, fichier de reprise du 7 novembre 2026, gardé tel quel comme archive. C'est un brouillon, à remettre en question.
- Référentiel v0.2 dans `data/`, extrait de `REPRISE.md` sans retouche : 191 notions en 13 domaines (177 V1, 12 V1→V2, 2 V2), 49 situations (42 V1, 7 V2), 78 sources, 1 identifiant retiré.
- Schémas JSON des fichiers de `data/` et `scripts/validate.py`, qui contrôle les schémas puis la cohérence entre notions, situations et sources.
- `scripts/coverage.py` : comptes du référentiel et couverture des contenus en français et en anglais (0 sur 191).
- `docs/` : sections 1, 2, 3, 6, 8 et 9 de `REPRISE.md` copiées sans réécriture, et `docs/contenus.md` (emplacement des contenus, règle de couverture).
- `README.md`, `README.en.md`, `CLAUDE.md`, ce changelog.
- Workflow GitHub Actions qui lance `validate.py` et `coverage.py` sur chaque pull request et sur `main`.

[0.3.33]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.32...v0.3.33
[0.3.32]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.31...v0.3.32
[0.3.31]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.30...v0.3.31
[0.3.30]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.29...v0.3.30
[0.3.29]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.28...v0.3.29
[0.3.28]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.27...v0.3.28
[0.3.27]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.26...v0.3.27
[0.3.26]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.25...v0.3.26
[0.3.25]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.24...v0.3.25
[0.3.24]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.23...v0.3.24
[0.3.23]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.22...v0.3.23
[0.3.22]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.21...v0.3.22
[0.3.21]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.20...v0.3.21
[0.3.20]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.19...v0.3.20
[0.3.19]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.18...v0.3.19
[0.3.18]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.17...v0.3.18
[0.3.17]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.16...v0.3.17
[0.3.16]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.15...v0.3.16
[0.3.15]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.14...v0.3.15
[0.3.14]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.13...v0.3.14
[0.3.13]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.12...v0.3.13
[0.3.12]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.11...v0.3.12
[0.3.11]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.10...v0.3.11
[0.3.10]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.9...v0.3.10
[0.3.9]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.8...v0.3.9
[0.3.8]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.7...v0.3.8
[0.3.7]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Badmiaoo/TutoPhoto/tree/v0.2.0
