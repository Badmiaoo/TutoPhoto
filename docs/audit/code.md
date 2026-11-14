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
- Second point : pendant le compte à rebours, un nouvel appui ne fait rien (`pressStart`, l. 255 : `… || this.countdown !== null) return;`) et aucun `clearTimeout` n'existe dans le fichier. Un retardateur de 20 s lancé par erreur ne peut être arrêté qu'en rechargeant la page. Je ne sais pas comment un Z 6 annule son retardateur : la page « The Release Mode/Self-Timer Button » n'a pas été relue pour ce rapport.
- Correction proposée : dans `tick`, si une photo se calcule, attendre sa fin au lieu d'abandonner (`await` du calcul en cours, puis `shootSeries`) ; ou refuser la loupe pendant un compte à rebours (`magnify` : `|| this.countdown !== null`). Un second appui pendant le compte à rebours l'annule (`clearTimeout(this.countdown)`, texte du bouton remis), à dire dans la note de la fenêtre « Mode de déclenchement » ; à sourcer ou à dire « choix de TutoPhoto ».

### COD-03 · incohérent · `?lang=` et `?defi=` de l'adresse priment sur le choix fait ensuite dans la page : il est perdu au rechargement

- Endroit : `app/src/i18n.ts`, l. 481-491 ; `app/src/main.ts`, l. 135-139 ; `app/src/ui/challenges.ts`, l. 68-96 ; `app/scripts/build-pages.mjs`, l. 348-356, 413 et 434-449 ; `app/src/activities/lum02.ts`, l. 233 et 261-265.
- Ce qui est fait :
  - langue : `initialLang()` lit d'abord `?lang=`, puis le choix mémorisé (`tutophoto.lang`). Le bouton de langue mémorise le choix (`rememberLang`) mais ne touche pas à l'adresse. Or tous les liens du site vers le simulateur portent `?lang=` (`build-pages.mjs`, l. 348-356 et 413 ; `lum02.ts`, l. 233) ;
  - défi : `ChallengePicker` lit le défi mémorisé, puis `?defi=`, qui l'emporte et est réécrit dans `tutophoto.defi` (l. 76-84). Un choix fait dans la fenêtre « Défis » est mémorisé (l. 86-95), l'adresse reste.
- Chemin : fiche SIT-05, « Jouer le défi » : adresse `simulateur/?lang=fr&defi=SIT-05`. Dans le simulateur, passer en anglais et choisir « Aucun défi ». Recharger la page (ou laisser le téléphone la recharger au retour d'une autre application) : `initialLang()` rend `fr` (l. 482-483), et `ChallengePicker` remet SIT-05 et l'écrit dans la mémoire (l. 77-80). Les deux choix sont perdus, et la mémoire du défi est écrasée.
- Même mécanique sur l'accueil (`build-pages.mjs`, l. 436-449 : `?lang=` d'abord, le bouton mémorise sans changer l'adresse) et sur l'activité LUM-02 (`lum02.ts`, l. 127 et 261-265).
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

## Vérifié

À compléter.

## Je ne sais pas

À compléter.
