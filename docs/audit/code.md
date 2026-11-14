# Audit du lot « Code de l'interface : bogues, états, fuites, coût »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Rapport écrit par un agent de Claude.
- État : constats non contre-vérifiés.
- Version auditée : copie de travail à la version 0.3.58 ; les numéros de ligne sont ceux de cette version.
- Rédaction en cours : ce rapport est écrit et envoyé au fur et à mesure. Ce qui reste à couvrir est dit à la fin de l'en-tête.

## Périmètre

- Code : `app/src/main.ts`, `app/src/scene.ts`, `app/src/ui/*.ts` (sauf `reviewInfo.ts` et la partie « grilles » de `cameraPanel.ts`), `app/src/i18n.ts` (sa mécanique, pas ses libellés), `app/src/credits.ts`, `app/src/activities/lum02.ts`, `app/scripts/*.mjs`.
- Les modules de `app/src/camera/` sont lus quand l'interface les appelle (`photo.ts`, `autofocus.ts`, `noise.ts`, `viewfinderDof.ts`) : leurs formules relèvent de `docs/audit/modele-physique.md`.
- Hors du lot : la mise en page, l'accessibilité, les libellés et la routine de test (`docs/audit/interface.md`) ; la structure d'ensemble (`docs/audit/architecture-application.md`).
- Ce que ce rapport cherche : bogues (logique, cas limites, états mémorisés, changement de langue ou de boîtier en cours d'usage, redimensionnement, photo lancée pendant un calcul, rafale et retardateur interrompus), fuites, coût par image, erreurs non rattrapées, code mort ou dupliqué.

## Méthode

1. Lecture complète des fichiers du lot, et des modules de `camera/` qu'ils appellent.
2. Chaque bogue est prouvé par un chemin d'exécution, lignes à l'appui ; les plus importants par un essai dans un navigateur.
3. Essais : Chromium sans écran, rendu logiciel (SwiftShader), Playwright 1.63.0, mêmes options que `scripts/test_app.cjs`. Le site est construit hors du dépôt, sur une copie non modifiée de `app/` ; seule différence avec le site publié : la construction est faite avec `NODE_ENV=development`, ce qui active l'accès `window.__tutophoto` prévu par `main.ts`, l. 171-174, pour lire l'orientation de la caméra. Ces essais émulent l'écran, le toucher et le navigateur, pas le processeur graphique ni Safari.
4. Le code de Babylon.js est lu dans `app/node_modules/@babylonjs/core/` (version 9.35.0) quand un constat en dépend.
5. `npx tsc --noEmit` passe (14 novembre 2026).

Scripts des essais, journaux et photos : dossier `audit/code/` du bloc-notes de la session, hors du dépôt (`scripts/`, `essais/`).

## Sources

Ce lot est du code : il cite peu de sources extérieures.

- Lue : Babylon.js, paquet `@babylonjs/core` 9.35.0, dans `app/node_modules/` (fichiers cités dans les constats).
- Non relues : les pages des manuels citées dans les commentaires de `cameraPanel.ts`, `shutter.ts` et `lum02.ts` ; elles sont relues par `docs/audit/modele-physique.md`, `docs/audit/fiches-exposition.md` et `docs/audit/fiches-mise-au-point.md`.

## Déjà constaté par un autre rapport

À ne pas compter une seconde fois.

- L'indicateur d'équilibre n'est pas suspendu pendant le calcul d'une photo et affiche « bruit insuffisant (signal/bruit 0:1) » : ARC-14 (`docs/audit/architecture-application.md`), mesuré deux fois dans un navigateur. Revu ici en passant (essai 1, 14 novembre 2026) : pendant un calcul de 10 s, la ligne passe de « bruit excellent (signal/bruit 170:1) » à « bruit insuffisant (signal/bruit 0:1) » et le point à la classe `bad`, jusqu'à la fin du calcul.
- Formules et constantes écrites à plusieurs endroits (1500 px, virgule décimale, titres des notions de `challenges.ts`) : ARC-07 et CHX-05.
- Les réglages des molettes ne sont pas mémorisés : `docs/audit/architecture-application.md`, « Hors du périmètre, vu en passant ».
- Trois minuteries et des lectures de pixels synchrones à côté de la boucle de rendu, coût jamais mesuré : ARC-06.

## Constats

### COD-01 · faux · Glisser sur le viseur pendant le calcul d'une photo fait tourner l'appareil entre les rendus : la photo est une surimpression

- Endroit : `app/src/camera/photo.ts`, l. 234-239, 317 et 388 ; `app/src/ui/shutter.ts`, l. 224-251 ; `app/src/scene.ts`, l. 119 ; `app/src/style.css`, l. 678-687.
- Ce qui est écrit : `shutter.ts`, l. 223 : « Calcul sans affichage du viseur : boucle de rendu arrêtée, bruit du viseur retiré, réglages grisés. » `docs/camera-physique.md`, l. 436 : chaque vue est calculée « avec l'orientation de l'appareil relevée à cet instant ». `photo.ts`, l. 86 : la loupe recalcule la photo avec la « même orientation ».
- Ce qui est fait : pendant le calcul, la caméra garde ses commandes. Le canevas reste sous le doigt (le bandeau de progression est une boîte de 20 rem en bas du viseur, `style.css`, l. 678-687), les commandes de la caméra restent attachées (`scene.ts`, l. 119 : `camera.attachControl(canvas, true)` ; rien ne les détache), et `takePhoto` rend chaque vue par `scene.render()` (`photo.ts`, l. 317 et 388).
- Preuve (code de Babylon.js 9.35.0) : `scene.render(updateCameras = true, …)` appelle `camera.update()` (`scene.pure.js`, l. 4603 et 4651-4656), qui appelle `_checkInputs()` (`Cameras/camera.pure.js`, l. 564-566), qui ajoute à `rotation` ce que les événements du pointeur ont accumulé dans `cameraRotation` (`Cameras/targetCamera.pure.js`, l. 399-410 ; `Cameras/Inputs/freeCameraMouseInput.js`, l. 39-40). `takePhoto` ne pose l'orientation qu'une fois, avant les rendus (`photo.ts`, l. 236-239).
- Preuve (essai 1b, 14 novembre 2026, fenêtre de 1280 × 800 px, 200 mm, f/1.4, 1/100 s, deux photos de suite, relevé de `camera.rotation.y` à chaque rendu du calcul) :

  | Photo | Rendus | `rotation.y` pendant le calcul | Résultat |
  | --- | --- | --- | --- |
  | Témoin, sans toucher au viseur | 105 sur 256 | 0 à chaque rendu | une image nette au point |
  | Souris tenue enfoncée sur le viseur et déplacée de 320 px en 8 s, à partir du début du calcul | 113 sur 256 | de 0,01 à 0,14 rad pendant les 112 premiers rendus, 0,47 rad au dernier | plusieurs copies décalées des personnages, superposées |

  Au 200 mm sur le Z 6, le champ horizontal est de 2 × atan(18 / 200) = 0,18 rad : un écart de 0,13 rad déplace l'image de 72 % de sa largeur. Photos : `essai1b-temoin.jpg` et `essai1b-glisse.jpg`.
- Preuve (essai 1, mêmes conditions, 50 mm, f/8) : dix déplacements de 6 px faits après le déclenchement ; les 17 rendus de la photo ont tous `rotation.y` = 0,01496 rad au lieu de 0, soit un cadrage décalé de 0,01496 × 50 / 36 × 1500 = 31 px par rapport à celui du déclenchement. Après le calcul, le viseur lui-même a tourné de 0,015 rad : les déplacements reçus pendant le calcul s'appliquent à la reprise.
- Conséquence : sur un téléphone, où un calcul dure de 1 à 5 s et une rafale plusieurs fois autant, un doigt qui glisse sur le viseur pendant le calcul gâche la photo, sans rien de physique : le mouvement n'a pas lieu pendant la pose mais pendant le calcul. C'est le geste même que la rafale demande (« suivre le chien ») : le doigt qui suit le sujet est encore sur le viseur quand le calcul commence. `replay.rotation` (`photo.ts`, l. 453) garde la dernière orientation, pas celle de la pose : la loupe recalcule alors une autre vue que la photo.
- Ce que l'essai ne dit pas : la fréquence du cas sur un vrai téléphone. Le rendu logiciel étire le calcul (43 à 66 s ici).
- Correction proposée : rendre sans mettre à jour la caméra, `scene.render(false)`, aux deux appels de `takePhoto` (l. 317 et 388) ; et, dans `Shutter.compute`, détacher les commandes le temps du calcul (`camera.detachControl()` avant, `camera.attachControl(canvas, true)` et `camera.cameraRotation.set(0, 0)` dans le `finally`), pour que les gestes faits pendant le calcul ne s'appliquent pas à la reprise. À vérifier dans un navigateur avant de fusionner, avec l'essai 1b : `rotation.y` constant, photo égale au témoin.

### COD-02 · faux · Retardateur : la vue est perdue sans message si la loupe de l'écran de revue calcule à la fin du compte à rebours ; le compte à rebours ne s'annule pas

- Endroit : `app/src/ui/shutter.ts`, l. 255-259, 308-324, 332 et 464-466.
- Ce qui est écrit : `docs/camera-physique.md`, l. 440 : « Retardateur : une vue à la fin du compte à rebours. »
- Chemin (lecture du code) :
  1. mode « Retardateur », appui sur le déclencheur : `startCountdown` arme une minuterie d'une seconde, relancée jusqu'à zéro (l. 308-324) ;
  2. l'écran de revue de la photo précédente est ouvert (il couvre le viseur, pas le panneau du boîtier : le déclencheur reste accessible) ; pendant le compte à rebours, un toucher sur la photo lance la loupe : `magnify` ne teste que `busy` et `shooting` (l. 466), pas `countdown` ; `compute` met `busy` à vrai (l. 225) ;
  3. le compte à rebours arrive à zéro pendant ce calcul : `tick` remet le texte du bouton et appelle `shootSeries` (l. 319-321), dont la première ligne est `if (this.busy || this.shooting) return;` (l. 332).
  La vue n'est pas prise, rien n'est affiché, et le bouton est revenu à « Déclencher ».
- Preuve (essai 3b, 14 novembre 2026) : retardateur de 2 s ; compte à rebours lancé (« Retardateur : 2 s »), loupe lancée aussitôt sur la photo précédente. À la fin du calcul de la loupe (6,3 s), l'écran de revue affiche « Loupe 100 % · 16 rendus, calculée en 6,3 s » et le bouton « Déclencher » ; vingt secondes plus tard, rien n'a changé : aucune photo n'a été posée dans l'écran de revue (compté par un observateur de l'attribut `src` de l'image).
- Second point : pendant le compte à rebours, un nouvel appui ne fait rien (`pressStart`, l. 255 : `… || this.countdown !== null) return;`) et aucun `clearTimeout` n'existe dans le fichier. Un retardateur de 20 s lancé par erreur ne peut être arrêté qu'en rechargeant la page. Je ne sais pas comment un Z 6 annule son retardateur : la page « The Release Mode/Self-Timer Button » n'a pas été relue pour ce rapport.
- Correction proposée : dans `tick`, si une photo se calcule, attendre sa fin au lieu d'abandonner (`await` du calcul en cours, puis `shootSeries`) ; ou refuser la loupe pendant un compte à rebours (`magnify` : `|| this.countdown !== null`). Un second appui pendant le compte à rebours l'annule (`clearTimeout(this.countdown)`, texte du bouton remis), à dire dans la note de la fenêtre « Mode de déclenchement » ; à sourcer ou à dire « choix de TutoPhoto ».

### COD-03 · incohérent · `?lang=` et `?defi=` de l'adresse priment sur le choix fait ensuite dans la page : il est perdu au rechargement

- Endroit : `app/src/i18n.ts`, l. 481-491 ; `app/src/main.ts`, l. 135-139 ; `app/src/ui/challenges.ts`, l. 68-96 ; `app/scripts/build-pages.mjs`, l. 348-356, 413 et 434-449 ; `app/src/activities/lum02.ts`, l. 233 et 261-265.
- Ce qui est fait :
  - langue : `initialLang()` lit d'abord `?lang=`, puis le choix mémorisé (`tutophoto.lang`). Le bouton de langue mémorise le choix (`rememberLang`) mais ne touche pas à l'adresse. Or tous les liens du site vers le simulateur portent `?lang=` (`build-pages.mjs`, l. 348-356 et 413 ; `lum02.ts`, l. 233) ;
  - défi : `ChallengePicker` lit le défi mémorisé, puis `?defi=`, qui l'emporte et est réécrit dans `tutophoto.defi` (l. 76-84). Un choix fait dans la fenêtre « Défis » est mémorisé (l. 86-95), l'adresse reste.
- Chemin : fiche SIT-05, « Jouer le défi » : adresse `simulateur/?lang=fr&defi=SIT-05`. Dans le simulateur, passer en anglais et choisir « Aucun défi ». Recharger la page (ou laisser le téléphone la recharger au retour d'une autre application) : `initialLang()` rend `fr` (l. 482-483), et `ChallengePicker` remet SIT-05 et l'écrit dans la mémoire (l. 77-80). Les deux choix sont perdus, et la mémoire du défi est écrasée.
- Même mécanique sur l'accueil (`build-pages.mjs`, l. 436-449 : `?lang=` d'abord, le bouton mémorise sans changer l'adresse) et sur l'activité LUM-02 (`lum02.ts`, l. 127 et 261-265).
- L'inverse existe aussi : la langue de l'adresse n'est pas mémorisée. Accueil ouvert par un lien `?lang=en` sur un navigateur en français : la page s'affiche en anglais sans rien mémoriser (`build-pages.mjs`, l. 449 : `show(lang, false)`) ; « Open the simulator » ouvre `simulateur/?lang=en`, que `initialLang()` ne mémorise pas non plus ; le lien « Home » du simulateur est `../`, sans paramètre (`app/simulateur/index.html`, l. 18 ; `main.ts`, l. 115, ne change que son texte) : l'accueil revient en français. Seules les fiches mémorisent leur langue à l'affichage (`build-pages.mjs`, l. 297-298).
- Conséquence : le commentaire de `challenges.ts`, l. 74-75, dit que le défi de l'adresse « est retenu comme un défi choisi dans la fenêtre » ; il est en fait plus fort que lui, à chaque chargement.
- Correction proposée : une fois le paramètre lu et mémorisé, le retirer de l'adresse (`history.replaceState`), dans `initialLang()` (qui mémorise alors la langue de l'adresse) et dans `ChallengePicker` ; même ligne dans le script de l'accueil. Le paramètre vaut alors pour l'arrivée, la mémoire pour la suite.

### COD-04 · incohérent · Après un changement de langue, la légende d'une photo déjà prise mélange les deux langues

- Endroit : `app/src/ui/shutter.ts`, l. 176, 334 et 448-457 ; `app/src/ui/cameraPanel.ts`, l. 370-389 et 403-418.
- Ce qui est fait : la légende est une fonction rappelée à chaque changement de langue (`lastCaption`, l. 176 et 448-457), mais elle y insère `settings.summary`, une chaîne fabriquée une fois, au déclenchement, dans la langue d'alors (`shutter.ts`, l. 334 ; `cameraPanel.ts`, l. 404-411 : `tr("setByCamera")`, `tr("compensationShort")`, `tr("meterUnit")`, virgule décimale).
- Preuve (lecture) : photo prise en français en mode A avec une correction de +1 IL à f/5,6, puis passage en anglais. Le reste de la légende passe en anglais (« focused at 6.6 m », « 16 renders, computed in 1.2 s »), le résumé reste « A · f/5,6 · 1/200 s · ISO 100 (auto) · corr. +1,0 IL · 50 mm » ; en anglais il s'écrit « f/5.6 », « comp. +1.0 EV » (`i18n.ts`, l. 261 et 390).
- Correction proposée : garder dans `Shot` les réglages retenus (indices ou valeurs), et fabriquer le résumé dans `lastCaption`, par une fonction du panneau qui prend la langue courante (`panel.summaryOf(settings)`), comme le fait déjà le bulletin (`showBulletin`, rappelé par `setLang`, l. 177).

### COD-05 · à améliorer · Rafale : si une vue échoue en cours de série, le message d'erreur est aussitôt remplacé par la première vue réussie

- Endroit : `app/src/ui/shutter.ts`, l. 341-395 et 518-525.
- Chemin (lecture du code) : dans `shootSeries`, une erreur à la vue n° 3 d'une rafale de 5 passe par `catch` : `console.error` puis `showError`, qui écrit « La photo n'a pas pu être calculée (…) » dans la légende (l. 383-385 et 518-525). Mais deux vues sont déjà dans `shots` : la fonction continue, `this.shots = shots; this.showFrame(0);` (l. 391-394), et `showWhole` réécrit la légende (l. 448-458). Le message n'est jamais vu ; l'écran de revue affiche « Vue 1/2 » au compteur et « Vue 1/5 » dans la légende (l. 455 : `frame.count` vaut le nombre de vues demandées).
- Avec une seule vue, ou si la première échoue, le message reste, mais l'image, le lien « Enregistrer » et les boutons de la série restent ceux de la photo précédente (`showError` ne touche qu'à la légende, au bulletin et aux histogrammes).
- Conséquence : sur un téléphone à court de mémoire graphique, une rafale tronquée ne dit pas pourquoi ; c'est le cas où le diagnostic à l'écran sert (`main.ts`, l. 91-92).
- Correction proposée : garder l'erreur et l'afficher après `showFrame(0)` (une ligne sous la légende : « 2 vues sur 5 : … ») ; dans `showError` sans photo nouvelle, masquer l'image et la série précédentes.

### COD-06 · faux · Fichier d'éclairage non reçu : compté comme reçu, scène affichée sans ses personnages, puis le déclencheur bloque la page sans fin

- Endroit : `app/src/scene.ts`, l. 95-101, 196-205 et 271-331 ; `app/src/main.ts`, l. 38-70 et 315-324 ; `app/src/camera/photo.ts`, l. 316 et 373 ; `app/src/ui/shutter.ts`, l. 224-251.
- Ce qui est écrit : `main.ts`, l. 38-41 : la progression sert à « distinguer un réseau lent, un fichier bloqué ou une scène reçue mais pas prête », et « un fichier compte comme reçu quand le navigateur en a fini le chargement ». `scene.ts`, l. 77 : `ready` est « résolue quand tous les fichiers de la scène sont chargés ».
- Ce qui est fait :
  - `ready` attend les sept modèles et la photo de fond (`scene.ts`, l. 271-331), pas le fichier HDR de l'éclairage, créé sans rappel d'erreur (l. 196-204 ; le constructeur de `HDRCubeTexture` en accepte un, neuvième paramètre, `Materials/Textures/hdrCubeTexture.pure.js`, l. 29) ;
  - la progression tient pour reçu tout fichier qui a une entrée dans la Resource Timing API (`main.ts`, l. 49-58) ; un chargement en échec en a une aussi ;
  - `takePhoto` attend `scene.whenReadyAsync()` sans délai (`photo.ts`, l. 316 et 373), alors que le chargement, lui, n'attend que 30 s (`readyOrLate`, `scene.ts`, l. 88-101) ; `Shutter.compute` a déjà arrêté la boucle de rendu et grisé le panneau (`shutter.ts`, l. 225-232).
- Preuve (essai 2, 14 novembre 2026, fenêtre de 1280 × 800 px ; la requête de `autumn_hockey_1k.hdr` est coupée, les 30 autres fichiers arrivent) :

  | Instant | Ce que la page affiche |
  | --- | --- |
  | 4 s | « Chargement de la scène… 28 / 34 Mio reçus · 4 s » |
  | de 6 à 34 s | « Chargement de la scène… fichiers reçus, préparation » ; la console porte « Failed to load resource: net::ERR_FAILED » |
  | 35 s | plus de message de chargement ; diagnostic : « Scène affichée avant d'être prête, éléments en attente : painted_wooden_bench, metal_trash_can_handle_left, metal_trash_can_lid, metal_trash_can, metal_trash_can_handle_right » ; le viseur montre le fond et les ombres au sol, sans banc, sans poubelle, sans personnages ni chien (capture `essai2-hdr.png`) ; le déclencheur n'est pas grisé |
  | appui sur « Déclencher » | « Calcul de la photo… », barre vide, tous les boutons du panneau grisés ; même état 153 s plus tard (capture `essai2-hdr-apres.png`) |

  Le fichier manquant n'est nommé nulle part : ni par la progression, qui le compte comme reçu, ni par le diagnostic, qui cite cinq maillages.
- Même essai avec la photo de fond coupée (`autumn_hockey.jpg`) : « La scène n'a pas pu être chargée. » à 11 s. Avec le manifeste coupé (`scene.json`) : la scène se charge, la progression n'affiche que les secondes, et la fenêtre « Crédits » reste vide sans aucun message (0 ligne ; `main.ts`, l. 75-77 et 125 : les deux `catch` ne font rien), alors que les licences CC BY de la scène demandent l'attribution (`credits.ts`, l. 2).
- Même essai avec un modèle coupé (`painted_wooden_bench_1k.gltf`) : « La scène n'a pas pu être chargée. » à 15 s, comme prévu ; la scène reste pourtant utilisable sous ce message (photo calculée en 9,9 s, sans le banc), sans bouton pour réessayer.
- Conséquence : sur un réseau instable (cas signalé par Julien le 9 novembre 2026, `app/vite.config.ts`, l. 17-18), un seul fichier de 1,75 Mio perdu (1 833 398 octets, d'après le manifeste) donne une scène vide après 30 s d'attente, un message qui n'aide pas, et une page figée au premier déclenchement.
- Correction proposée :
  1. `scene.ts` : ajouter le fichier HDR à `ready` (promesse résolue par `onLoad`, rejetée par `onError`), pour retrouver « La scène n'a pas pu être chargée. » ;
  2. `main.ts` : dans le message d'erreur, nommer le fichier en échec (la raison du rejet le porte déjà) et proposer « Recharger » ; ne compter un fichier comme reçu que si son entrée a un `responseStatus` de 200 ou, à défaut, une taille reçue non nulle (`transferSize` ou `decodedBodySize`) ;
  3. `photo.ts` : borner les deux attentes de `scene.whenReadyAsync()` (par exemple 20 s, comme `whenCompiled`), l'erreur remontant alors par `showError` au lieu de figer la page ;
  4. tant que la scène n'est pas prête ou est en erreur, griser le déclencheur ;
  5. manifeste non reçu : l'écrire dans la fenêtre « Crédits » (« crédits indisponibles, voir `scenes/parc/scene.json` ») au lieu d'une liste vide.

### COD-07 · faux · AF-S : toucher le viseur pendant le calcul d'une photo déplace le repère sans faire le point ; le repère reste vert, « verrouillée » à l'ancienne distance

- Endroit : `app/src/ui/shutter.ts`, l. 132-138 et 182-189 ; `app/src/ui/cameraPanel.ts`, l. 638-643 ; `app/src/camera/autofocus.ts`, l. 186-198, 228-235 et 276-281.
- Ce qui est écrit : `autofocus.ts`, l. 6-10 : en AF-S, « toucher le viseur joue le rôle de la mi-course : la distance est mesurée au point touché, puis verrouillée ». `cameraPanel.ts`, l. 13-15 : le repère passe au vert « quand la distance est verrouillée ».
- Chemin (lecture du code) : pendant un calcul, le viseur reçoit toujours les touchers (`shutter.ts`, l. 132-138 : aucun test de `busy`). `choosePoint` appelle `panel.setFocusPoint`, qui déplace le point puis appelle `autofocus.touch()` (`cameraPanel.ts`, l. 639-641). L'autofocus est suspendu (`shutter.ts`, l. 235) : `read()` rend `null` (`autofocus.ts`, l. 277), la mesure est abandonnée sans rien changer (l. 257), et le verrou précédent reste (`isLocked` n'est pas touché). Or, en AF-S, toute photo laisse la distance verrouillée (`shutter.ts`, l. 367 ; `autofocus.ts`, l. 210-216) : c'est l'état ordinaire après la première photo.
- Preuve (essai 3, 14 novembre 2026, AF-S et point sélectif, réglages par défaut) :

  | Étape | Indicateur du viseur | Repère (`top`, classes) |
  | --- | --- | --- |
  | toucher en bas du cadre (le sol) | « AF-S · Point · verrouillée à 7,1 m » | 85 %, `locked` |
  | déclenchement, puis toucher en haut du cadre (le fond) pendant le calcul | « AF-S · Point · verrouillée à 7,1 m » | 20 %, `locked` |
  | 2,5 s après la fin du calcul | « AF-S · Point · verrouillée à 7,1 m » | 20 %, `locked` |
  | le même toucher en haut du cadre, hors calcul | « AF-S · Point · verrouillée à 500,0 m » | 20 %, `locked` |

- Conséquence : le viseur montre un point vert sur le fond, à 500 m, avec une distance de 7,1 m ; la photo suivante est faite à 7,1 m (`shutter.ts`, l. 345-361 : verrou gardé, `focusDistance` = distance verrouillée). Le débutant croit avoir fait le point là où il a touché. En rafale, le point de la demande change aussi d'une vue à l'autre (`shutter.ts`, l. 360, lu à chaque vue).
- Correction proposée : ne pas prendre les touchers du viseur pendant un calcul (`choosePoint` : `if (!this.panel.isEnabled()) return;`, le test que fait déjà `TopView`, `topView.ts`, l. 76 et 92). À vérifier avec l'essai 3.

### COD-08 · incohérent · Écran de revue : pendant le calcul de la loupe, « Revenir au viseur » et « Vue suivante » restent actifs, et le résultat de la loupe s'impose ensuite

- Endroit : `app/src/ui/shutter.ts`, l. 152-155, 426-438, 464-503, 511-515 et 544-546 ; `app/src/ui/cameraPanel.ts`, l. 670-675.
- Ce qui est fait : `compute` ne grise que les boutons du panneau du boîtier (`setEnabled`, `cameraPanel.ts`, l. 672 : `this.el.panel.querySelectorAll("button")`). Les boutons de l'écran de revue restent actifs pendant le calcul de la loupe, et la suite de `magnify` (l. 489-498) s'exécute sans regarder ce qui s'est passé entre-temps : `showCaption` remet `review.hidden = false` (l. 514), et la fenêtre de la loupe est posée quelle que soit la vue affichée.
- Preuve (essai 3b, 14 novembre 2026) :
  - loupe lancée, puis « Revenir au viseur » pendant le calcul : l'écran de revue se ferme, puis revient tout seul à la fin du calcul, 5,7 s plus tard, avec la fenêtre de la loupe ;
  - rafale de deux vues, loupe lancée sur la vue 1, puis « Vue suivante » pendant le calcul : le compteur passe à « Vue 2/2 » et la vue 2 s'affiche ; à la fin du calcul, l'image est remplacée par la fenêtre de la loupe de la vue 1, sous le compteur « Vue 2/2 ». « Photo entière » montre ensuite la vue 2.
- Conséquence : en triant une rafale (c'est l'usage annoncé, `shutter.ts`, l. 12), on peut regarder à 100 % une autre vue que celle que le compteur désigne, et juger nette la mauvaise.
- Correction proposée : à la reprise de `magnify`, jeter le résultat si l'écran de revue a été fermé ou si la vue a changé (`if (this.el.review.hidden || this.shots[this.shotIndex] !== shot) { URL.revokeObjectURL(photo.url); return; }`) ; ou griser les boutons de l'écran de revue pendant le calcul, comme ceux du panneau.

## Vérifié

À compléter.

## Je ne sais pas

À compléter.
