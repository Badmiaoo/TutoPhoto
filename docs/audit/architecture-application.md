# Audit du lot « Architecture de l'application, de sa construction et de ses tests »

État : constats non contre-vérifiés

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ».
- Version auditée : copie de travail de la version 0.3.58 en cours ; `app/`, `scripts/`, `docs/architecture.md` et `docs/pile-technique.md` y sont ceux de la version 0.3.57 (`git diff v0.3.57 HEAD` vide pour ces chemins). Les numéros de ligne sont ceux de cette version.
- Rapport écrit par un agent de Claude. Ce rapport juge la structure. Les bogues un par un relèvent de `docs/audit/code.md`, les erreurs du modèle de `docs/audit/modele-physique.md` (constats PHY, cités quand ils touchent la structure).
- Rapport en cours d'écriture : voir « Ce qui n'est pas encore couvert » en fin d'en-tête.

## Périmètre

- Code : `app/src/` en entier (6 292 lignes de TypeScript : `main.ts`, `scene.ts`, `i18n.ts`, `credits.ts`, `camera/` 12 fichiers, `ui/` 7 fichiers, `activities/lum02.ts`), `app/simulateur/index.html`.
- Construction : `app/package.json`, `app/vite.config.ts`, `app/vite.activites.config.ts`, `app/scripts/build-pages.mjs`, `app/scripts/copy-licences.mjs`.
- Tests : `scripts/test_app.cjs`, `.github/workflows/routine.yml`.
- Documentation, pour ce qu'elle dit de l'application : `docs/architecture.md`, `docs/pile-technique.md` ; `docs/etat-des-travaux.md` pour les fonctions prévues (balance des blancs, histogramme en direct, situations jouables, solveur, nouvelles scènes, mesure de la lumière, modes de mesure, mode P, mise au point manuelle) ; `docs/specifications/balance-des-blancs.md` et `docs/dossiers/scenes.md` (section 7.3) pour ce qu'ils demandent au code.

## Méthode

1. Lecture complète du code du périmètre.
2. Chaque hypothèse de Claude est confrontée au code, fichier et ligne ; ce qui se compte est compté par une commande (`grep`, `git show --stat`, `wc`).
3. Chaque capacité de Babylon.js citée dans une voie est vérifiée dans le paquet installé (`app/node_modules/@babylonjs/core`, version 9.35.0), fichier et ligne.
4. Le site est construit sur une copie du dépôt, hors du dépôt, pour mesurer les durées et les tailles.
5. Les exemples chiffrés sont calculés par un script (`scripts/chaines.py` du dossier de travail).
6. Les durées de la routine sont lues dans GitHub (passages du workflow `routine.yml`, lecture seule).
7. Un essai de tests rapides des formules est fait sur la copie (ARC-05).
8. Aucun navigateur : ce qui demanderait un rendu (coût par image, écart visible entre le viseur et la photo) est établi par le code et le calcul, et noté « non mesuré dans un rendu ».

Scripts et journaux : dossier `audit/architecture-application/` du bloc-notes de la session, hors du dépôt.

## Sources

Ce lot ne cite presque pas de sources externes : il confronte le code à lui-même et à la documentation du dépôt.

- Relu, dans le dépôt de travail : paquet `@babylonjs/core` 9.35.0, fichiers `PostProcesses/postProcess.pure.js`, `PostProcesses/passPostProcess.pure.js`, `PostProcesses/imageProcessingPostProcess.d.ts`, `Materials/imageProcessingConfiguration.pure.js` et `.pure.d.ts`, `Shaders/ShadersInclude/pbrBlockImageProcessing.js`, `Shaders/background.fragment.js`, `Helpers/photoDome.js`, `Helpers/textureDome.js`, `Engines/thinEngine.pure.js`, `Engines/engine.pure.js`, `Engines/Extensions/engine.readTexture.pure.js`, `Engines/constants.js`.
- Non relues : les sources du modèle physique (lot `modele-physique.md`) et les manuels des boîtiers ; hors de ce lot.

## Ce qui n'est pas encore couvert

- Durées réelles de la routine dans la CI (à lire dans GitHub) ; essai d'un test rapide des formules sans navigateur ; part du code inutilisé dans le fichier JavaScript ; `docs/architecture.md` et `docs/pile-technique.md` confrontés au code ; sections « Vérifié », « Je ne sais pas », « Ce qui est bien fait et doit rester », « Plan de refontes ».

## Constats

### ARC-01 · à améliorer · Deux chaînes d'image : chaque fonction d'image s'écrit deux fois, et le viseur traite une image déjà exposée, encodée et écrêtée sur 8 bits

Hypothèse 1 de Claude : **confirmée**, avec une précision : la loi du bruit est écrite une seule fois (`NOISE_GLSL`, `app/src/camera/noise.ts`, l. 69-89) et les deux chaînes l'appellent.

- Endroit : `app/src/ui/cameraPanel.ts`, l. 749 ; `app/src/camera/noise.ts`, l. 131-146 et 171-180 ; `app/src/camera/viewfinderDof.ts`, l. 64-105 et 153-173 ; `app/src/camera/photo.ts`, l. 139-182, 262-296 et 369-373 ; `app/src/camera/autofocus.ts`, l. 121 ; `docs/specifications/balance-des-blancs.md`, note de tête et section 5.
- Ce qui est fait.
  - Viseur : les matériaux de Babylon.js appliquent eux-mêmes l'exposition et la courbe (`cameraPanel.ts`, l. 749 : `this.scene.imageProcessingConfiguration.exposure = this.showsBrightness() ? 2 ** offset : 1;`), puis l'image passe par des post-traitements : copie, flou à mi-résolution, composition (`viewfinderDof.ts`), bruit (`noise.ts`).
  - Photo : `imageProcessing.applyByPostProcess = true` (`photo.ts`, l. 372) fait rendre aux matériaux la lumière linéaire ; les rendus sont accumulés en virgule flottante (l. 274-291), et un seul shader, `FINISH`, fait la moyenne, l'exposition, le bruit, l'écrêtage et la courbe (l. 180-181 : `clamp(addSensorNoise(sum * invSamples * exposure, gl_FragCoord.xy), 0.0, 1.0)` puis `pow(color, vec3(1.0 / 2.2))`).
- Preuve que le viseur travaille sur une image écrêtée sur 8 bits.
  - Dans Babylon.js, chaque post-traitement crée la texture où la scène ou le post-traitement précédent est rendu, avec son propre type : `PostProcesses/postProcess.pure.js`, l. 584 (`type: this._textureType`), et le constructeur a `textureType = 0` par défaut (l. 213) ; `Engines/constants.js`, l. 335 : `Constants.TEXTURETYPE_UNSIGNED_BYTE = 0;`. `PassPostProcess` a le même défaut (`passPostProcess.pure.js`, l. 32).
  - Aucun des quatre post-traitements du viseur ne passe ce paramètre (`viewfinderDof.ts`, l. 153-173 ; `noise.ts`, l. 171-180) : leurs textures ont 8 bits par couche, et la scène y arrive après l'exposition et la courbe des matériaux.
  - Le code le dit lui-même, `noise.ts`, l. 138-139 : « L'image du viseur est déjà encodée (puissance 1/2,2) et écrêtée : on revient en lumière linéaire, on ajoute le bruit, puis on réencode. Approximation : les hautes lumières écrêtées n'ont plus de bruit. »
  - Le flou du viseur moyenne les valeurs encodées sans les décoder (`viewfinderDof.ts`, l. 80, 90 et 96 : `texture2D(textureSampler, uv).rgb` puis `color += mix(color / total, sampleColor, m)`), alors que la photo moyenne la lumière linéaire.
- Preuve que chaque fonction d'image existe en deux exemplaires.

| Fonction | Viseur | Photo |
| --- | --- | --- |
| Exposition | `imageProcessingConfiguration.exposure` (`cameraPanel.ts`, l. 749), dans les matériaux | uniforme `exposure` du shader `FINISH` (`photo.ts`, l. 180 et 412) |
| Courbe et écrêtage | traitement d'image de Babylon.js, texture 8 bits | `clamp` et `pow` dans `FINISH` (`photo.ts`, l. 180-181) |
| Bruit | shader `viseurBruit`, qui décode, bruite, réencode (`noise.ts`, l. 131-146) | `addSensorNoise` dans `FINISH`, en lumière linéaire (`photo.ts`, l. 180) |
| Profondeur de champ | flou en disque sur l'image encodée (`viewfinderDof.ts`, 284 lignes) | accumulation de rendus (`photo.ts`, l. 376-404) |
| Carte de profondeur | `DepthRenderer` propre au viseur (`autofocus.ts`, l. 121) | `scene.enableDepthRenderer` (`photo.ts`, l. 315) |
| Sol de la photo à 360° | absent du shader du flou (`viewfinderDof.ts`, l. 58-62 : la profondeur lue sert telle quelle) ; présent dans la mesure de l'autofocus (`autofocus.ts`, l. 372-374) | dans `FINISH` (`photo.ts`, l. 160-164) |
| Fenêtre agrandie (loupe) | projection resserrée (`cameraPanel.ts`, l. 919-924) | même calcul, écrit une seconde fois (`photo.ts`, l. 251-260) |
| Flou de mouvement | aucun | accumulation dans le temps de pose (`photo.ts`, l. 387) |
| Histogramme | aucun | `measureTones`, sur les pixels 8 bits de la photo (`photo.ts`, l. 440) |
| Balance des blancs (prévue) | « un post-traitement de plus […] il décode, multiplie, réencode » (spécification, section 5) | « gains dans le shader de finition » (même section) |

- Ce que cela coûte aujourd'hui.
  - La spécification de la balance des blancs a été reportée pour cette raison : « cette fonction serait écrite deux fois, une pour le viseur et une pour la photo calculée, tant que les deux chaînes d'image ne sont pas réunies » ; elle prévoit d'écrire dans la fenêtre du réglage une limite de plus : « l'image du viseur est déjà écrêtée quand il s'applique, la photo non ».
  - Le viseur et la photo ne font pas les mêmes opérations dans le même ordre, donc ne montrent pas la même image. Calcul (`scripts/chaines.py`, non mesuré dans un rendu) : un flou qui mêle à parts égales une zone de valeur linéaire 0,9 et une zone de 0,05 donne 182/255 sur la photo et 154/255 dans le viseur ; surexposé de 2 IL, 255/255 sur la photo (le clair déborde sur le sombre, comme sur un capteur) et 189/255 dans le viseur.
  - À chaque photo, `photo.ts` bascule `applyByPostProcess`, ce qui change les shaders des matériaux, et attend qu'ils soient prêts (l. 369-373 : « Les matériaux recompilent leurs shaders : on attend qu'ils soient prêts »), puis rebascule (l. 462). Durée non mesurée.
- Ce que cela coûtera avec les fonctions prévues.
  - Balance des blancs : deux écritures, et un écart visible dans les hautes lumières. Calcul avec les gains de la spécification pour 3000 K, (0,570 ; 1 ; 2,698) : une zone neutre de valeur linéaire 1,5 (au-dessus du blanc) sort à (237, 255, 255) sur la photo et à (198, 255, 255) dans le viseur ; sous le blanc, les deux chaînes donnent le même résultat (144, 186, 255).
  - Histogramme en direct et alerte des hautes lumières : l'image lisible dans le viseur est celle du canevas, après le bruit, le flou approché et la loupe, marges hors du cadre comprises (`viewfinder.ts`, l. 36-44 : le canevas voit plus que le cadre). Elle n'est pas celle sur laquelle `measureTones` mesure la photo.
  - Mesure de la lumière : il faut une image de la scène avant l'exposition et sans écrêtage. Le viseur n'en a pas : son image dépend de l'exposition, que la mesure doit justement fixer (voir ARC-04).
- Voies.
  - A. Ne rien faire. Coût : chaque fonction d'image deux fois, dans deux espaces (lumière linéaire pour la photo, valeurs encodées sur 8 bits pour le viseur), et une limite de plus à écrire à chaque fois. Risque : l'écart entre ce que montre le viseur et ce que donne la photo grandit, dans un simulateur dont le mot d'ordre est le réalisme.
  - B. Un seul « développement », partagé. Le viseur rend la lumière linéaire dans une texture en demi-flottants (`applyByPostProcess = true` en permanence), le flou du viseur travaille sur cette texture, puis un seul fragment GLSL, le même que celui de `FINISH`, fait gains, exposition, bruit, écrêtage et courbe. La photo garde son accumulation, qui reste la référence, et appelle le même fragment. Une copie réduite de l'image linéaire sert à la mesure de la lumière ; l'histogramme se lit après le développement.
    - Capacités vérifiées dans le paquet installé : le type de texture d'un post-traitement est un paramètre du constructeur (`postProcess.pure.js`, l. 213, `textureType`) ; avec `applyByPostProcess`, les matériaux PBR et le matériau du fond rendent la lumière linéaire, plafonnée à 30 (`Materials/imageProcessingConfiguration.pure.js`, l. 569 : `defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess && this._isEnabled` ; `Shaders/ShadersInclude/pbrBlockImageProcessing.js`, l. 4-6 et `Shaders/background.fragment.js`, l. 217-219 : `clamp(…,0.,30.0)`) ; la photo s'appuie déjà sur ce comportement pour toute la scène. La capacité de rendre en demi-flottants se lit dans `engine.getCaps().textureHalfFloatRender` (`Engines/thinEngine.pure.js`, l. 483). Babylon.js ne repasse seul en 8 bits que pour le type flottant (l. 2484-2487 : `if (type === 1 && !this._caps.textureFloat)`), pas pour les demi-flottants : le repli est à écrire (lire cette capacité, sinon garder des textures 8 bits et la chaîne d'aujourd'hui).
    - Coût : une pull request ; `noise.ts` (le shader du viseur perd son décodage), `viewfinderDof.ts` (type des textures), `cameraPanel.ts` (l. 749), `photo.ts` (plus de bascule) ; de l'ordre de 150 lignes.
    - Risques : débit sur téléphone (une texture en demi-flottants pèse 8 octets par pixel au lieu de 4, à la densité 2) : à mesurer sur le téléphone de Julien avant de fusionner ; seuils de la routine (bruit, netteté du fond) à revoir, le flou en lumière linéaire changeant les valeurs ; appareils sans rendu en demi-flottants : la photo calculée en dépend déjà (`photo.ts`, l. 276 et 285).
  - C. Une seule chaîne pour tout : le viseur comme accumulation progressive de la photo. Coût élevé : l'accumulation ne tient pas en temps réel, et les sujets bougent. Écartée pour ce projet.
- Recommandation : B, avant la balance des blancs et l'histogramme en direct. Ce qui la protège : la photo ne change pas (comparer ses histogrammes avant et après, aux réglages de la routine : sous-exposée, surexposée, par défaut) ; pour le viseur, les contrôles existants de la routine (bruit à ISO 6400, flou au 135 mm à f/1.4), et un essai sur un vrai téléphone.

### ARC-02 · à améliorer · Un réglage du boîtier se câble à la main à huit endroits de `cameraPanel.ts`, et dans cinq autres fichiers

Hypothèse 2 de Claude : **confirmée, et sous-estimée** : huit endroits et non six dans le fichier, plus la page, les textes, le style et la routine.

- Endroit : `app/src/ui/cameraPanel.ts` (1 138 lignes, une classe de 899 lignes, l. 240-1138) ; `app/simulateur/index.html` (290 lignes) ; `app/src/i18n.ts` ; `app/src/main.ts`, l. 176-205 ; `scripts/test_app.cjs`.
- Preuve, sur un réglage existant, la correction d'exposition (`grep -n compensation app/src/ui/cameraPanel.ts`, 11 lignes) :
  1. champ et valeur par défaut, l. 245 ;
  2. écoute de la liste, l. 304 ;
  3. passage au calcul, l. 396 ;
  4. résumé de la photo, l. 408 ;
  5. texte du libellé, l. 597 ;
  6. options de la liste et valeur choisie, l. 607-609 ;
  7. indicateur d'exposition, l. 743 ;
  8. mémoire : type lu (l. 1089), validation (l. 1107), écriture (l. 1128).
  - Hors du fichier : la liste dans la page (`simulateur/index.html`, l. 245), deux clés de texte par langue (`i18n.ts`), la routine.
- Preuve, par le nombre de lignes de `cameraPanel.ts` où chaque réglage apparaît (même commande) : mode d'exposition 11, correction 11, ISO auto 10, plafond de l'ISO auto 8, vitesse minimale 8, mode de mise au point 8, mode de zone 14, détection 7, déclenchement 7, cadence 8, retardateur 8, marque 9, format 8.
- Preuve, par l'histoire : la pull request des grilles de cadrage (commit `cd188a8`, version 0.3.56) touche `cameraPanel.ts` en 11 endroits (`git show cd188a8 -- app/src/ui/cameraPanel.ts`, 11 blocs, 98 lignes ajoutées), et `simulateur/index.html`, `i18n.ts`, `main.ts`, `style.css`, `scripts/test_app.cjs` (76 lignes). Celle des modes d'exposition (`ea8d0a7`) : 206 lignes dans `cameraPanel.ts`, 9 fichiers.
- Ce qui manque à la structure.
  - Aucune description d'un réglage (nom, valeurs permises, valeur par défaut, clé de texte) : chaque réglage répète ces informations dans le champ, l'écoute, la validation et l'écriture. `restoreBody` (l. 1077-1114) valide treize valeurs par treize lignes écrites à la main ; `saveBody` (l. 1116-1137) les recopie.
  - Les textes sont posés un par un : 66 lignes de la forme `querySelector("#…")!.textContent = tr(…)` dans `app/src/ui/`, et 47 appels `element("…")` dans `main.ts` pour passer les éléments de la page aux classes. Un identifiant absent de la page ne se voit qu'à l'exécution (`!` de TypeScript, ou l'erreur de `element`).
  - `update()` (l. 711-774) refait tout à chaque changement : textes des cinq fenêtres, listes déroulantes (31 + 16 + 52 = 99 options recréées par `updateExposureDialog`, l. 607-619), vue, bruit, profondeur de champ. Coût non mesuré ; c'est la séparation entre l'état et l'affichage qui manque.
  - L'état des réglages est réparti : `CameraPanel` (31 champs privés, l. 242-283, dont une vingtaine de réglages), `Autofocus` (`focusMode`, en double : valeur par défaut « continuous » dans `autofocus.ts`, l. 92, « single » dans `cameraPanel.ts`, l. 265, recopiée par `attachAutofocus`, l. 432-434), `ChallengePicker`, et quatre clés du stockage du navigateur. `Shutter` lit le mode de mise au point dans `Autofocus` et le mode de zone dans `CameraPanel` (`shutter.ts`, l. 335-336). Les classes se passent tout par leur constructeur : 16 paramètres pour `Shutter` (`shutter.ts`, l. 111-128), 8 pour `BalanceIndicator`, 7 pour `TopView`.
  - La classe mêle l'état des réglages, la géométrie du viseur et de la loupe (l. 445-545, 776-944), cinq fenêtres, la grille, la mémoire.
- Ce que cela coûtera avec les fonctions prévues : la balance des blancs (un réglage à sept valeurs et un curseur), les modes de mesure, le mode P, la mise au point manuelle sont quatre réglages de plus, chacun à huit endroits ; la spécification de la balance des blancs liste déjà neuf fichiers à modifier (section 5).
- Voies.
  - A. Ne rien faire. Coût : environ 100 à 200 lignes de `cameraPanel.ts` par réglage, un fichier qui dépassera 1 500 lignes, et le risque d'oublier un des huit endroits (un oubli de la validation ou de l'écriture ne casse rien de visible).
  - B. Sans cadre applicatif : (1) un magasin de réglages, une table typée où chaque réglage a sa valeur par défaut et sa validation, avec une lecture, une écriture et un abonnement uniques ; (2) les textes fixes posés par un attribut de la page (par exemple `data-i18n="modeM"`) et une seule fonction, les clés étant contrôlées à la construction ; (3) `cameraPanel.ts` découpé : état, vue et loupe, une fenêtre par fichier. Coût : deux ou trois pull requests sans changement visible. Risque : régression d'un libellé ou d'une valeur mémorisée ; la routine lit déjà les textes français et la mémoire (`tutophoto.apercu`).
  - C. Un cadre applicatif (Preact, Lit, Svelte ou autre). Coût : une dépendance de plus à vérifier (licence, taille), toute l'interface à réécrire (2 642 lignes dans `app/src/ui/`), tous les sélecteurs de la routine à revoir. Risque élevé pour un gain que B donne déjà : l'interface est faite de fenêtres de boutons radio.
- Recommandation : B, dans cet ordre : le magasin de réglages d'abord (il sert aussi au solveur, qui doit poser une recette de réglages d'un coup, et aux situations jouables), puis les textes, puis le découpage. Garder les noms et les valeurs des clés du stockage, pour ne pas perdre les réglages mémorisés.

### ARC-03 · à améliorer · La scène est écrite dans le code, et ce qui lui est propre est réparti dans dix fichiers

Hypothèse 3 de Claude : **confirmée pour la composition de la scène ; à préciser pour le manifeste**, qui sert à quatre choses et pas seulement aux licences.

- Endroit : `app/src/scene.ts` (341 lignes) ; `app/public/scenes/parc/scene.json` ; `app/src/main.ts`, l. 32, 58 et 207 ; `app/src/camera/exposure.ts`, l. 38 ; `app/src/camera/bulletin.ts`, l. 76, 118-134 ; `app/src/ui/balance.ts`, l. 159 ; `app/src/ui/topView.ts`, l. 23-25, 146, 151-152 ; `app/src/ui/challenges.ts`, l. 23-39 ; `app/src/ui/shutter.ts`, l. 406-408 ; `app/scripts/build-pages.mjs`, l. 139, 154-162 ; `scripts/test_app.cjs`, l. 1126-1129.
- Ce que lit le code dans `scene.json` : les crédits (`credits.ts`), la liste et la taille des fichiers pour la progression du chargement (`main.ts`, l. 75-77), la liste du pré-téléchargement de l'accueil (`build-pages.mjs`, l. 150-165), et le contrôle des licences et des empreintes (`scripts/check_scenes.py`). Le champ `situations` du manifeste n'est lu par aucun code (`grep -rn situations app/src app/scripts` : aucune lecture du manifeste).
- Ce qui est écrit dans `scene.ts` et nulle part ailleurs : le chemin de la scène (l. 31), la hauteur de l'œil (l. 34), le rayon et la rotation du fond (l. 37, 44), les fichiers du fond et de l'éclairage (l. 186, 197), la lumière des ombres (l. 211-218), la taille du sol (l. 219), sept chargements de modèles avec position, rotation et échelle (l. 272-326), les yeux placés à la main (l. 276-279, 287-291, 320-323), les vitesses et les trajets des deux sujets mobiles (l. 298, 316), les repères de la vue de dessus (l. 58-64).
- Ce qui est propre à la scène, hors de `scene.ts` (commande : `grep -n` des identifiants) :
  - la luminosité de la scène, constante du module d'exposition (`exposure.ts`, l. 38 : `SCENE_EV100 = 12.5`) ;
  - les critères des défis, par nom de sujet (`bulletin.ts`, l. 118 : `get("sophia")` ; l. 130 : `["dennis", "sophia", "fabienne", "percy"]` ; l. 134 : `get("jim")`), et la distance du fond recopiée (l. 76 : `BACKDROP_M = 500`, « scene.ts, DOME_RADIUS ») ;
  - `balance.ts`, l. 159 et `topView.ts`, l. 146 : `mover.id === "jim"` pour distinguer le chien ; `topView.ts`, l. 151 : `thing.id === "bench"` pour le dessin ; l. 23-25 : zone de déplacement et étendue de la carte ;
  - `challenges.ts`, l. 29-39 : noms des sujets ; `main.ts`, l. 32 et 58 : `scenes/parc` ; `build-pages.mjs`, l. 139, 154 et 158-162 : `scenes/parc`.
- Ce que cela coûte aujourd'hui : rien de visible, avec une seule scène. Ce constat ne vaut que par ce qui est prévu.
- Ce que cela coûtera : la file de travail prévoit des situations jouables dans le parc (ligne 7), puis de nouvelles scènes (ligne 9 ; `docs/dossiers/scenes.md`, section 7.3, point 1, le dit déjà : « `SCENE_URL` et `SCENE_EV100` sont des constantes »). Une deuxième scène demande aujourd'hui de toucher les dix fichiers ci-dessus, et le code n'a aucun chemin pour quitter une scène (aucun `dispose` ; la photo de fond occupe 128 Mio de mémoire graphique, voir ARC-06). Chaque nouveau défi du parc ajoute des noms de sujets à `bulletin.ts`.
- Voies.
  - A. Ne rien faire tant qu'il n'y a qu'une scène. Coût nul aujourd'hui ; la dette se paie d'un coup à la deuxième scène.
  - B. Décrire la scène dans `scene.json` (fond, éclairage, luminosité et sa source, sol, objets, yeux, sujets mobiles, repères), validée par `schemas/scene.schema.json`, que `check_scenes.py` applique déjà, et un chargeur générique. Coût : un schéma à étendre et à tenir, des fonctions à décrire en données (le tri des deux chiens du fichier, l. 307-315, les yeux lus dans le squelette, l. 260-269). Risque : un format trop tôt figé, sur une seule scène.
  - C. Un module TypeScript par scène, qui exporte une description typée (`SceneDefinition` : fichiers, positions, sujets avec leur rôle, luminosité, zone de déplacement), et un chargeur commun ; `scene.json` reste le manifeste des fichiers et des licences. Les défis désignent des rôles (« sujet du portrait », « groupe », « sujet qui court ») et non des noms. Coût : une pull request pour sortir la description de `scene.ts` et retirer les noms de `bulletin.ts`, `balance.ts`, `topView.ts`. Risque faible : le compilateur vérifie la description.
- Recommandation : C, en deux temps. Avant les situations jouables : les rôles à la place des noms dans les défis, et `SCENE_EV100` porté par la scène. À la deuxième scène : la description complète et le changement de scène. Le format B se décidera quand deux scènes existeront.

### ARC-04 · à améliorer · Aucune mesure de la lumière : les modes A, S et l'ISO auto visent une constante, et la chaîne du viseur n'a pas d'image sur laquelle mesurer

Hypothèse 4 de Claude : **confirmée**. Le constat PHY-12 du lot « modèle physique » le dit pour le modèle ; ce constat-ci porte sur la structure.

- Endroit : `app/src/camera/exposure.ts`, l. 38 et 75 ; `app/src/camera/exposureModes.ts`, l. 82 ; `app/src/ui/cameraPanel.ts`, l. 392-401 et 735-746 ; `app/src/ui/balance.ts`, l. 173-193 et 222-246.
- Preuve.
  - `exposure.ts`, l. 38 : `export const SCENE_EV100 = 12.5;` ; `exposureModes.ts`, l. 82 : `export function resolveExposure(control: ExposureControl, sceneEv100 = SCENE_EV100)`.
  - `cameraPanel.ts`, l. 392-401 : `resolved()` appelle `resolveExposure` sans second argument. L'indicateur d'exposition (l. 735-746) affiche `resolved.indicator`, calculé sur cette constante. Viser le ciel ou le sol ne change donc ni la vitesse choisie en A, ni l'ouverture en S, ni l'ISO auto, ni l'indicateur.
  - La seule lecture de l'image du programme est celle de l'indicateur d'équilibre : `balance.ts`, l. 222-246, lit 5 × 5 pixels du canevas toutes les 300 ms, après le flou et le bruit du viseur, décode la courbe (`(bytes[i] / 255) ** 2.2`), puis défait l'aperçu coupé en multipliant par `displayGain()` (l. 179). Elle sert au rapport signal sur bruit, pas à l'exposition.
- Ce qui est bien placé : la couture existe. `resolveExposure` et `exposureOffset` prennent déjà la luminosité de la scène en argument ; une mesure n'a qu'à fournir ce nombre, sans toucher à la logique des modes.
- Ce qui manque à la structure pour mesurer.
  - Une image de la scène avant l'exposition et sans écrêtage. L'image du viseur est multipliée par l'exposition puis écrêtée sur 8 bits (ARC-01) : mesurer dessus ferait dépendre la mesure du réglage qu'elle doit fixer, et une zone écrêtée ne dit plus de combien elle dépasse.
  - Une échelle : ce que vaut, en luminance, la valeur 1 de la scène. Le constat PHY-06 montre que le fond et l'éclairage ne sont pas à la même échelle ; sans étalonnage, une moyenne mesurée ne se convertit pas en indice de lumination.
  - Un endroit où la mesure vit : aujourd'hui, trois minuteries indépendantes lisent la scène (autofocus, 200 ms, `autofocus.ts`, l. 138 ; équilibre, 300 ms, `balance.ts`, l. 74 ; vue de dessus, 250 ms, `topView.ts`, l. 80). Une mesure de la lumière et un histogramme en direct en feraient cinq.
- Voies.
  - A. Ne rien faire : A, S et l'ISO auto restent justes pour une scène uniforme, et faux dès qu'on cadre le ciel. À dire dans l'interface (correction de PHY-12). Les situations qui reposent sur les pièges de la mesure (neige, contre-jour ; `docs/dossiers/scenes.md`, section 7.3, point 3) restent hors de portée.
  - B. Mesurer sur une copie réduite de l'image linéaire du viseur (voie B d'ARC-01) : quelques milliers de pixels en flottants, lus à cadence fixe, pondérés selon le mode de mesure (matricielle, pondérée centrale, spot), convertis en indice de lumination par l'étalonnage de la scène, et passés à `resolveExposure`. Capacité vérifiée : la lecture d'une texture de rendu existe et est synchrone (`Engines/Extensions/engine.readTexture.pure.js`, l. 61-66 : `gl.readPixels` puis `Promise.resolve`) ; une lecture différée existe pour WebGL 2 mais elle est interne (`Engines/engine.pure.js`, l. 622-627 : `@internal`, `_readPixelsAsync`). Coût : un module `camera/metering.ts` sans rendu (pondérations, conversion : testable sans navigateur) et une passe de réduction. Risque : le coût de la lecture sur téléphone, non mesuré ; `docs/etat-des-travaux.md` demande déjà de le mesurer avant l'histogramme en direct.
  - C. Calculer la mesure sur la photo à 360° seule, dans la direction visée, sans les objets. Coût faible, mais faux dès qu'un sujet remplit le cadre (portrait) : contraire au mot d'ordre du projet. Écartée.
- Recommandation : B, après la voie B d'ARC-01 et après l'étalonnage de la scène (PHY-06). Le comportement de la mesure d'un boîtier est à sourcer avant (dossier de sources prévu). Une seule boucle de mesure pour l'autofocus, la lumière, l'histogramme et l'équilibre.

### ARC-05 · à améliorer · Un seul scénario de test, dans un navigateur ; aucun test rapide des formules

Hypothèse 5 de Claude : **confirmée**.

- Endroit : `scripts/test_app.cjs` (1 186 lignes) ; `app/package.json`, l. 11-16 ; `.github/workflows/routine.yml`.
- Preuve.
  - `app/package.json` n'a aucun script de test (`dev`, `build`, `preview`, `typecheck`) ; aucun fichier de test dans `app/`.
  - `test_app.cjs` : une seule fonction, `runProfile`, de la l. 295 à la l. 1156, soit 862 lignes, presque toutes dans un seul bloc `try` ; 88 appels à `check(`. Une exception (un délai dépassé) arrête tous les contrôles suivants du profil : l. 1133-1151, le contrôle « déroulement du test » échoue et le reste n'est pas joué.
  - Les contrôles dépendent de leur ordre : l'en-tête du script place la mise au point « en fin de test parce que la vue change » (l. 53), et plusieurs étapes remettent les réglages de départ pour les suivantes.
  - Durée : 53 minutes pour les quatre profils sur la machine de Claude (`docs/pile-technique.md`, l. 124) ; de 7 à 23 minutes par profil dans la CI, et un échec non expliqué, non reproduit (`docs/etat-des-travaux.md`, l. 79).
  - Mesure refaite dans GitHub le 13 novembre 2026 (workflow `routine.yml`, dix passages depuis le 12 novembre) : quatre annulés par un commit suivant, un en échec, cinq réussis. Les six passages menés au bout durent de 20 min 22 s à 27 min 21 s. Dernier passage (n° 10, 13 novembre, 5 h 40 UTC), étape « Routine de test » de chaque job : iPhone 17 min 41 s, WebGL 1 22 min 26 s, Android 22 min 38 s, ordinateur 26 min 29 s, soit 89 minutes de machine pour une réponse en 27 minutes. La construction du site y prend 6 à 7 secondes, l'installation de Playwright 18 à 26 secondes : le temps est celui du rendu logiciel.
  - Les formules ne sont testées que par ce scénario, à travers le rendu : l'audit du modèle physique a dû compiler `exposure.ts` et `exposureModes.ts` hors du dépôt pour les essayer (`docs/audit/modele-physique.md`, méthode, point 4).
- Ce qui rend un test rapide possible ou non, module par module (`grep` des imports).
  - Sans aucune dépendance : `exposure.ts`, `exposureModes.ts`, `sharpZone.ts`, `histogram.ts`, `bodies.ts`, `viewfinder.ts`.
  - Calcul pur, mais avec les vecteurs de Babylon.js : `bulletin.ts`, `faces.ts`.
  - Calcul pur mêlé au rendu dans le même fichier : `noise.ts` (`readNoiseAt` et `noiseParameters`, l. 41-66, à côté d'un shader enregistré à l'import, l. 131) ; `photo.ts` (`groundDepth`, l. 207-212, et le nombre de rendus, l. 342-358, dans `takePhoto`).
  - Formules écrites dans l'interface : traînée et rapport signal sur bruit dans `balance.ts` (l. 153-158 et 183-187).
- Essai fait pour cet audit, sur une copie du dépôt (dossier `essai-tests-rapides/` du dossier de travail) : sept tests écrits en TypeScript, lancés par le lanceur de tests de Node.js, sans aucune dépendance de plus.
  - Commande : `node --import ./tests/resoudre.mjs --test "tests/*.test.ts"`, avec Node.js 22.23.4 (la CI installe Node.js 22). `resoudre.mjs` fait 13 lignes : il ajoute `.ts` ou `.js` aux imports sans extension, que Vite accepte et que Node.js refuse.
  - Résultat : six tests réussis en moins d'une demi-seconde (0,13 à 0,25 s), sur `exposure.ts`, `exposureModes.ts` (les 475 combinaisons d'ouverture et d'ISO du mode A), `sharpZone.ts`, `histogram.ts`, `bodies.ts`, `viewfinder.ts` et `bulletin.ts` (critères du défi SIT-01, avec les vecteurs de Babylon.js, qui se chargent sans navigateur).
  - Le septième échoue, et c'est le constat : `noise.ts` ne se charge pas (« TypeScript parameter property is not supported in strip-only mode »), parce que la classe du viseur est dans le même fichier que la formule du bruit. Avec l'option `--experimental-transform-types`, il se charge ; l'option est expérimentale.
- Voies.
  - A. Ne rien faire. Coût : 20 à 27 minutes d'attente par commit d'une pull request qui touche `app/`, aucune protection pour une refonte (toutes celles de ce rapport en demandent une), et un échec qui masque les contrôles suivants.
  - B. Tests rapides par le lanceur de Node.js (l'essai ci-dessus), dans `app/tests/`, lancés par `npm test` et par le job `app` de la CI. Coût : le petit fichier de résolution à garder ; `@types/node` à ajouter pour vérifier les types des tests (licence MIT d'après le registre npm, version 26.6.6 lue le 13 novembre 2026) ; les formules à sortir des fichiers de rendu (`noise.ts`, `photo.ts`, `balance.ts`), ce que demande aussi ARC-07. Risque : la lecture directe du TypeScript par Node.js est récente ; fixer la version minimale de Node.js dans `package.json` (aujourd'hui `>=22`) à celle essayée.
  - C. Vitest. D'après le registre npm lu le 13 novembre 2026 : version 5.1.0, licence MIT, compatible avec Vite 8 (`peerDependencies` : `vite: ^6.4.0 || ^7.0.0 || ^8.0.0`). Il résout les imports comme Vite et accepte toute la syntaxe. Coût : une dépendance de développement et celles qu'elle amène, dont les licences sont à vérifier (`CLAUDE.md`). Non essayé ici.
  - Pour la routine dans le navigateur, quelle que soit la voie : la découper en étapes nommées, chacune dans son propre `try`, qui remettent les réglages de départ par un seul appel (le magasin de réglages d'ARC-02 le permet) ; un échec n'arrête alors que son étape. Sortir de la routine ce qui est un calcul (pénombre de LUM-02, positions des lignes des grilles, sommes des histogrammes) vers les tests rapides.
- Recommandation : B, en première pull request du plan, parce qu'elle protège toutes les suivantes ; C si le fichier de résolution ou la version de Node.js posent problème. Garder la routine pour ce qu'elle seule peut voir : le rendu, la page, le toucher.

### ARC-06 · à améliorer · Le coût d'une image du viseur, la mémoire et le téléchargement ne sont mesurés nulle part

Ce que les hypothèses ne voyaient pas. Constat établi par le code et le calcul ; rien n'est mesuré dans un rendu.

- Endroit : `app/src/scene.ts`, l. 184-189 et 211-225 ; `app/src/camera/autofocus.ts`, l. 121-140 et 245-248 ; `app/src/camera/viewfinderDof.ts`, l. 87 et 266-275 ; `app/src/ui/balance.ts`, l. 74 et 235-236 ; `app/src/ui/topView.ts`, l. 80 ; `app/src/camera/photo.ts`, l. 355-358 et 376-404 ; `app/public/scenes/parc/`.
- Ce que fait une image du viseur, aux réglages par défaut (aperçus du bruit et de la profondeur de champ actifs).
  - Trois rendus de la géométrie : la carte d'ombres (`scene.ts`, l. 214), la carte de profondeur du viseur, rendue à chaque image dès que l'aperçu de la profondeur de champ est attaché (`viewfinderDof.ts`, l. 270 ; `autofocus.ts`, l. 247), et l'image.
  - La scène compte 356 857 triangles (somme des index des sept fichiers glTF, `scripts` du dossier de travail), dont 299 814 pour deux modèles immobiles : Dennis (99 964) et Fabienne avec Percy (199 850). Soit environ 1,07 million de triangles par image.
  - Quatre passes sur toute l'image : copie, flou à mi-résolution (jusqu'à 400 tours de boucle, deux lectures de texture par tour, `viewfinderDof.ts`, l. 87-102), composition, bruit ; à la densité de l'écran plafonnée à 2 (`main.ts`, l. 36 et 168).
  - Trois minuteries lisent la scène ou le canevas : autofocus toutes les 200 ms, équilibre toutes les 300 ms, vue de dessus toutes les 250 ms. Les lectures de pixels sont synchrones : `engine.readPixels` appelle `gl.readPixels` (`Engines/thinEngine.pure.js`, l. 3835), et la lecture d'une texture de rendu aussi (`Engines/Extensions/engine.readTexture.pure.js`, l. 61). Chacune attend que le processeur graphique ait fini l'image.
- Une photo : deux rendus de la géométrie par rendu accumulé (ombres et image), de 16 à 256 rendus (`photo.ts`, l. 355-358), soit de 11 à 183 millions de triangles, avec un plafond de 5 secondes (l. 47) dont PHY-21 montre l'effet quand il est atteint.
- Mémoire graphique : la photo de fond fait 8192 × 4096 pixels, soit 8192 × 4096 × 4 = 134 217 728 octets, 128 Mio, sans mipmaps (`Helpers/photoDome.js`, l. 41 : `new Texture(urlsOrElement, scene, !options.generateMipMaps, …)`, et `scene.ts`, l. 184-189, ne demande pas de mipmaps). Les seize textures de la scène font 260 Mio en RGBA 8 bits, 347 Mio si les quinze autres ont leurs mipmaps (calcul sur les dimensions des fichiers).
- Téléchargement : 34,3 Mio pour la scène (somme du manifeste), tout avant la première image ; le code du simulateur pèse 4 184 174 octets, 0,98 Mo compressé.
- Ce que cela coûte aujourd'hui : Julien a trouvé le viseur saccadé à la densité complète (version 0.3.52), d'où le plafond à 2 (version 0.3.53), qu'il lui reste à juger (`docs/etat-des-travaux.md`, l. 110). Aucun chiffre n'accompagne ces jugements : ni images par seconde, ni part de chaque passe. Le simulateur n'a aucun affichage de mesure.
- Ce que cela coûtera : chaque refonte de ce rapport (ARC-01 surtout) et chaque fonction prévue (histogramme en direct, mesure de la lumière : une lecture de plus par cycle) change le coût d'une image ; sans mesure, on ne saura pas si c'est en mieux ou en pire. Chaque nouvelle scène ajoute une photo de fond de 128 Mio en mémoire, et le code ne libère rien (ARC-03).
- Voies.
  - A. Ne rien faire : continuer à juger à l'œil sur le téléphone de Julien.
  - B. Mesurer d'abord. Un affichage de diagnostic, ouvert par un paramètre de l'adresse, qui donne les images par seconde, la durée d'une image et celle des textures de rendu. Capacités vérifiées dans le paquet installé : `Instrumentation/sceneInstrumentation.d.ts` (`captureFrameTime`, l. 129 ; `captureRenderTime`, l. 153 ; `captureRenderTargetsRenderTime`, l. 69 ; `drawCallsCounter`, l. 173) et `Instrumentation/engineInstrumentation.d.ts` (`captureGPUFrameTime`, l. 29 ; `captureShaderCompilationTime`, l. 41). Coût : une petite pull request ; ces classes sont déjà dans le fichier JavaScript, qui contient tout Babylon.js. Puis décider, chiffres en main : modèles immobiles plus légers, carte de profondeur à mi-définition, une seule lecture par cycle.
  - C. Optimiser sans mesurer. Risque : optimiser ce qui ne coûte pas.
- Recommandation : B, avant la refonte de la chaîne d'image, pour comparer avant et après sur le téléphone de Julien.

### ARC-07 · à améliorer · Les mêmes formules et les mêmes constantes sont écrites à plusieurs endroits

- Endroit et preuve (`grep` des expressions).
  - Cercle de confusion, c = A × f × |D − S| / (D × (S − f)) : `photo.ts`, l. 343-346 (`cocScale`) ; `viewfinderDof.ts`, l. 239-243 (`cocAtInfinity`) et l. 60 (GLSL) ; `sharpZone.ts`, l. 13-15 (sous la forme des limites de la zone nette).
  - Traînée d'un sujet sur le capteur : `balance.ts`, l. 154-157 ; `bulletin.ts`, l. 92-98 ; `photo.ts`, l. 349-354 (forme simplifiée, pour le nombre de rendus).
  - Champ de vue et projection sur le capteur : `exposure.ts`, l. 91-93 (`fieldOfView`) ; `photo.ts`, l. 245 ; `topView.ts`, l. 117-118 ; `bulletin.ts`, l. 93-95.
  - Rapport signal sur bruit : la loi est en GLSL dans `noise.ts`, l. 85-88, et recopiée en TypeScript dans `balance.ts`, l. 183-187.
  - Fenêtre d'une image dans la projection : `cameraPanel.ts`, l. 919-924 ; `photo.ts`, l. 251-260.
  - Grand côté de la photo, 1500 pixels : constante `PHOTO_LONG_SIDE` (`photo.ts`, l. 43), mais nombre écrit en dur dans `bulletin.ts`, l. 107, et `challenges.ts`, l. 162. Distance du fond, 500 m : `scene.ts`, l. 37, recopiée dans `bulletin.ts`, l. 76.
  - Virgule décimale du français : `replace(".", ",")` écrit onze fois dans six fichiers de `app/src/ui/`.
  - Titres de dix notions recopiés du référentiel dans `challenges.ts`, l. 10-21 (« repris du référentiel ») ; identiques à `data/referentiel/` aujourd'hui (vérifié par script), sans rien qui le garantisse demain.
- Ce que cela coûte aujourd'hui : PHY-17 est né de là (l'indicateur d'équilibre et le bulletin n'évaluent pas le sujet en mouvement de la même façon). Une correction du modèle (par exemple PHY-05 sur le champ de vue à courte distance) doit être faite à quatre endroits.
- Ce que cela coûtera : le solveur de situations doit calculer une recette, donc la zone nette, la traînée et le bruit d'un réglage, hors de tout rendu : sans module commun, ce sera une copie de plus.
- Voies : A, ne rien faire ; B, un module `camera/optics.ts` sans rendu (cercle de confusion, zone nette, traînée, champ) et un module `camera/noiseModel.ts` (bruit de lecture, paramètres, rapport signal sur bruit), que le viseur, la photo, l'équilibre, le bulletin et le solveur appellent ; les shaders reçoivent leurs facteurs de ces modules ; les titres des notions lus dans `data/` à la construction, comme le fait déjà `build-pages.mjs` pour les fiches.
- Recommandation : B, dans la même pull request que les tests rapides (ARC-05), qui en vérifient chaque fonction ; sans changement de comportement.

### ARC-08 · à améliorer · La photo emprunte la scène et la caméra du viseur : un protocole de suspension écrit à la main, sur trois couches

- Endroit : `app/src/ui/shutter.ts`, l. 224-251 et 383-390 ; `app/src/camera/photo.ts`, l. 458-472 ; `app/src/ui/cameraPanel.ts`, l. 282-283, 664-675 et 790 ; `app/src/ui/topView.ts`, l. 76 et 92 ; `app/src/camera/noise.ts`, l. 219-235 ; `app/src/camera/viewfinderDof.ts`, l. 221-230 et 266-283 ; `app/src/camera/autofocus.ts`, l. 228-243 ; `app/src/main.ts`, l. 215.
- Ce qui est fait : il n'y a qu'une scène et qu'une caméra. Pour calculer une photo, `Shutter.compute` arrête la boucle de rendu, suspend le bruit, la profondeur de champ et l'autofocus du viseur, grise le panneau, puis défait tout dans l'ordre inverse, remet le bruit en dernier post-traitement, la vue et la boucle (`shutter.ts`, l. 232-248). `takePhoto` change la rotation, la projection, la cible de rendu, le traitement d'image, le décalage de l'œil et l'horloge, et les remet dans un `finally` (`photo.ts`, l. 458-465). `shootSeries` remet encore la rotation et l'horloge (`shutter.ts`, l. 387-388).
- Preuve que l'état « une photo se calcule » est réparti : six drapeaux pour un seul fait (`Shutter.busy` et `Shutter.shooting`, `CameraPanel.enabled`, `Autofocus.suspended`, `ViewfinderNoise.suspended`, `ViewfinderDepthOfField.suspended`), plus la boucle de rendu arrêtée. `TopView` demande au panneau si une photo se calcule avant de déplacer l'appareil (`topView.ts`, l. 76 et 92 : `if (!this.panel.isEnabled()) return;`). L'ordre des post-traitements du viseur tient à un rappel entre modules : `noise.moveToEnd()` (`noise.ts`, l. 230-235), appelé par `main.ts`, l. 215, et par `shutter.ts`, l. 245.
- Ce que cela coûte aujourd'hui : rien ne casse, la routine le montre. Mais la caméra est modifiée par quatre modules (`scene.ts`, l. 143-149 ; `cameraPanel.ts`, l. 788-789 et 897-924 ; `photo.ts` ; `shutter.ts`, l. 349), et chaque arrêt en cours de route doit tout remettre.
- Ce que cela coûtera : chaque effet de plus dans le viseur (balance des blancs, histogramme en direct, mesure de la lumière) ajoute une ligne à la suspension, une à la reprise et une contrainte d'ordre ; un oubli ne se voit que sur la photo.
- Voies : A, ne rien faire ; B, un seul objet propriétaire de la chaîne du viseur (carte de profondeur, post-traitements dans leur ordre, mesures), avec une suspension et une reprise uniques, que `takePhoto` prend le temps du calcul ; C, une seconde caméra et des cibles de rendu propres à la photo, pour ne plus toucher à celle du viseur : la scène et son horloge restent partagées, le gain est partiel.
- Recommandation : B, dans la même pull request que la voie B d'ARC-01, qui réécrit de toute façon cette chaîne.
