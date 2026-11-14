# Audit du lot « Code de l'interface : bogues, états, fuites, coût »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Rapport écrit par un agent de Claude.
- État : constats non contre-vérifiés.
- Version auditée : copie de travail à la version 0.3.58 ; les numéros de ligne sont ceux de cette version.
- Bilan : 13 constats (6 « faux », 3 « incohérent », 4 « à améliorer »), 27 points vérifiés et justes, 6 « Je ne sais pas ». Neuf constats sont établis par un essai dans un navigateur, quatre par la lecture du code (COD-03, COD-04, COD-05, COD-13). Le code est soigné là où il a été pensé : erreurs rattrapées dans le calcul d'une photo, mémoire du navigateur validée champ par champ, rien qui fuit au fil des photos. Les défauts sont dans ce qui se passe pendant qu'une photo se calcule (le viseur, l'écran de revue et le retardateur restent actifs), dans le toucher sur téléphone, et dans les cas d'échec que la routine ne joue pas (fichier perdu, WebGL absent, contexte perdu).
- À corriger d'abord : COD-01 et COD-07 (corrections de six lignes, essayées), COD-09 (une ligne de style, essayée), COD-06 et COD-11 (page figée ou muette en cas d'échec).
- Ce qui n'est pas couvert : `reviewInfo.ts` et les grilles de `cameraPanel.ts` (hors du lot) ; un vrai téléphone et Safari ; une perte du contexte WebGL pendant le calcul d'une photo ; la rafale en AF-C et en zone automatique dans un navigateur (lue dans le code seulement) ; le script de pré-téléchargement de l'accueil et la fenêtre de fiche dans un navigateur (lus dans le code ; la routine les joue) ; `build-pages.mjs` sur des fiches mal formées (seule la construction normale est faite).

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

### Contre-vérification (14 novembre 2026)

Un second agent de Claude a essayé de réfuter chaque constat ; son verdict est écrit sous chacun.

1. Pour chaque constat : relecture du code à l'endroit cité (version 0.3.58), et du code de Babylon.js 9.35.0 quand le constat en dépend ; date du code visé lue dans l'historique (`git blame`), pour écarter ce qui date du 12 novembre 2026 ou d'après.
2. Recherche, dans le reste du dépôt (`docs/`, `CHANGELOG.md`, les autres rapports d'audit), de ce qui dirait déjà le constat ou le contredirait.
3. Essais refaits dans un navigateur avec des scripts écrits pour la contre-vérification, sans reprendre ceux de l'audit : même navigateur (Chromium sans écran, rendu logiciel, Playwright 1.63.0), site construit de nouveau hors du dépôt sur une copie non modifiée de `app/` (`NODE_ENV=development`, pour lire l'orientation de la caméra), puis sur une seconde copie qui porte les corrections proposées pour COD-01 et COD-07. Mêmes limites que l'audit : ni processeur graphique, ni Safari, ni vrai téléphone.
4. Source relue à son adresse le 14 novembre 2026 : Nikon, « Z 7/Z 6 Online Manual », page « The Release Mode/Self-Timer Button », `https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_04.html` (pour COD-02).

Scripts, journaux, captures et page enregistrée : dossier `audit/code/refutation/` du bloc-notes de la session, hors du dépôt (`r01_rotation.cjs`, `r06_hdr.cjs`, `r07_etats.cjs`, `r09_tactile.cjs`, `r10_cout.cjs`, `r11_sans_webgl.cjs`, `r11b_correction.cjs`, `r12_contexte.cjs` ; `essais/` ; `pages/`).

## Sources

Ce lot est du code : il cite peu de sources extérieures.

- Lue le 14 novembre 2026 : Babylon.js, paquet `@babylonjs/core` 9.35.0, dans `app/node_modules/` (`scene.pure.js`, `Cameras/camera.pure.js`, `Cameras/targetCamera.pure.js`, `Cameras/Inputs/freeCameraMouseInput.js`, `Cameras/Inputs/freeCameraTouchInput.js`, `Engines/abstractEngine.pure.js`, `Materials/Textures/hdrCubeTexture.pure.js`, `Materials/Textures/baseTexture.pure.js`).
- Lues pour situer les constats : `docs/camera-physique.md` (l. 75, 145-146, 431-442), `docs/audit/architecture-application.md` (ARC-06, ARC-07, ARC-08, ARC-14 et « Hors du périmètre »), `docs/audit/choix-et-outils.md` (CHX-05).
- Non relues : les pages des manuels citées dans les commentaires de `cameraPanel.ts`, `shutter.ts` et `lum02.ts` ; elles sont relues par `docs/audit/modele-physique.md`, `docs/audit/fiches-exposition.md` et `docs/audit/fiches-mise-au-point.md`.

## Essais dans un navigateur

Le dossier de travail n'est pas gardé d'une session à l'autre : voici de quoi refaire chaque essai. Tous : site construit hors du dépôt (`NODE_ENV=development npx vite build`, puis l'activité et `node scripts/build-pages.mjs`), servi en local, Chromium lancé avec `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.

| Essai | Ce qui est fait | Ce qui est relevé | Constat |
| --- | --- | --- | --- |
| 1, 1b | photo témoin, puis photo avec la souris tenue et déplacée sur le canevas pendant le calcul | `camera.rotation.y` à chaque `scene.onAfterRenderObservable` tant que `#progress` est visible ; la photo ; le texte de `#balance-noise` | COD-01 |
| 2 | une requête coupée par `page.route(…, abort)` : le fichier HDR, la photo de fond, un modèle, le manifeste | textes de `#status` et `#diagnostic` pendant 50 s, puis effet d'un clic sur le déclencheur | COD-06 |
| 3, 3b | gestes déclenchés pendant un calcul : toucher du viseur en AF-S ; retardateur de 2 s puis clic sur la photo de l'écran de revue ; « Revenir au viseur » et « Vue suivante » pendant le calcul de la loupe (clics envoyés dans la page, dans la même tâche) | `#af-badge`, style et classes de `#focus-marker`, `#review`, `#review-caption`, `#review-count` | COD-07, COD-02, COD-08 |
| 4 | profil Pixel 7 ; doigt posé sur le déclencheur par `Input.dispatchTouchEvent`, immobile puis glissé par pas de 5 px ; refait avec `touch-action: none` ajouté au bouton | événements `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `lostpointercapture`, `touchend` reçus par le bouton | COD-09 |
| 5, 5b, 5c | `WEBGL_lose_context` : `loseContext()`, puis `restoreContext()` 3 s plus tard | console, bruit du viseur (méthode de `scripts/test_app.cjs`), moyenne des pixels du canevas sur quatre zones immobiles, avec deux relevés témoins avant la perte | COD-12 |
| 6 | viseur au repos, 10 s, en AF-S puis en AF-C, vue de dessus et équilibre dépliés puis repliés | écritures vues par un `MutationObserver` sur `document.body`, par élément | COD-10 |
| 7 | essais 1b et 3 refaits sur une seconde copie qui porte les corrections proposées | les mêmes relevés | COD-01, COD-07 |
| 8, 8b | `getContext` rend `null` pour `webgl` et `webgl2` | rectangles de `#scene` et de `#no-webgl`, style calculé, capture | COD-11 |
| 9 | valeurs invalides en mémoire avant le chargement ; puis deux séries d'actions | réglages affichés ; compteurs de la scène et du moteur | vérifié (9 et 24) |
| 10 | `page.setViewportSize` pendant le calcul d'une photo | la photo, la taille du canevas et du cadre | vérifié (25) |
| 11 | profil Pixel 7 ; un doigt, puis deux doigts glissés ou écartés sur le canevas | `camera.position` et `camera.rotation` à chaque image | vérifié (26) |

## Déjà constaté par un autre rapport

À ne pas compter une seconde fois.

- L'indicateur d'équilibre n'est pas suspendu pendant le calcul d'une photo et affiche « bruit insuffisant (signal/bruit 0:1) » : ARC-14 (`docs/audit/architecture-application.md`), mesuré deux fois dans un navigateur. Revu ici en passant (essai 1, 14 novembre 2026) : pendant un calcul de 10 s, la ligne passe de « bruit excellent (signal/bruit 170:1) » à « bruit insuffisant (signal/bruit 0:1) » et le point à la classe `bad`, jusqu'à la fin du calcul.
- Formules et constantes écrites à plusieurs endroits (1500 px, virgule décimale, titres des notions de `challenges.ts`) : ARC-07 et CHX-05.
- Les réglages des molettes ne sont pas mémorisés : `docs/audit/architecture-application.md`, « Hors du périmètre, vu en passant ».
- Trois minuteries et des lectures de pixels synchrones à côté de la boucle de rendu, coût jamais mesuré : ARC-06.

## Constats

Classés du plus grave au moins grave ; les identifiants suivent l'ordre de découverte.

### COD-01 · faux · Glisser sur le viseur pendant le calcul d'une photo fait tourner l'appareil entre les rendus : la photo est une surimpression

- Endroit : `app/src/camera/photo.ts`, l. 234-239, 317 et 388 ; `app/src/ui/shutter.ts`, l. 224-251 ; `app/src/scene.ts`, l. 119 ; `app/src/style.css`, l. 678-687.
- Ce qui est écrit : `shutter.ts`, l. 223 : « Calcul sans affichage du viseur : boucle de rendu arrêtée, bruit du viseur retiré, réglages grisés. » `docs/camera-physique.md`, l. 436 : chaque vue est calculée « avec l'orientation de l'appareil relevée à cet instant ». `photo.ts`, l. 86 : la loupe recalcule la photo avec la « même orientation ».
- Ce qui est fait : pendant le calcul, la caméra garde ses commandes. Le canevas reste sous le doigt (le bandeau de progression est une boîte de 20 rem en bas du viseur, `style.css`, l. 678-687), les commandes de la caméra restent attachées (`scene.ts`, l. 119 : `camera.attachControl(canvas, true)` ; rien ne les détache), et `takePhoto` rend chaque vue par `scene.render()` (`photo.ts`, l. 317 et 388).
- Preuve (code de Babylon.js 9.35.0) : `scene.render(updateCameras = true, …)` appelle `camera.update()` (`scene.pure.js`, l. 4603 et 4651-4656), qui appelle `_checkInputs()` (`Cameras/camera.pure.js`, l. 564-566), qui ajoute à `rotation` ce que les événements du pointeur ont accumulé dans `cameraRotation` (`Cameras/targetCamera.pure.js`, l. 398-412 ; `Cameras/Inputs/freeCameraMouseInput.js`, l. 39-40). `takePhoto` ne pose l'orientation qu'une fois, avant les rendus (`photo.ts`, l. 236-239).
- Preuve (essai 1b, 14 novembre 2026, fenêtre de 1280 × 800 px, 200 mm, f/1.4, 1/100 s, deux photos de suite, relevé de `camera.rotation.y` à chaque rendu du calcul) :

  | Photo | Rendus | `rotation.y` pendant le calcul | Résultat |
  | --- | --- | --- | --- |
  | Témoin, sans toucher au viseur | 105 sur 256 | 0 à chaque rendu | une image nette au point |
  | Souris tenue enfoncée sur le viseur et déplacée de 320 px en 8 s, à partir du début du calcul | 113 sur 256 | de 0,01 à 0,14 rad pendant les 113 premiers rendus (carte de profondeur comprise), 0,47 rad au dernier | plusieurs copies décalées des personnages, superposées |

  Au 200 mm sur le Z 6, le champ horizontal est de 2 × atan(18 / 200) = 0,18 rad : un écart de 0,13 rad déplace l'image de 72 % de sa largeur. Photos : `essai1b-temoin.jpg` et `essai1b-glisse.jpg`.
- Preuve (essai 1, mêmes conditions, 50 mm, f/8) : dix déplacements de 6 px faits après le déclenchement ; les 17 rendus de la photo ont tous `rotation.y` = 0,01496 rad au lieu de 0, soit un cadrage décalé de 0,01496 × 50 / 36 × 1500 = 31 px par rapport à celui du déclenchement. Après le calcul, le viseur lui-même a tourné de 0,015 rad : les déplacements reçus pendant le calcul s'appliquent à la reprise.
- Conséquence : sur le téléphone de Julien, une photo se calcule en 0,8 à 2,0 s (`docs/camera-physique.md`, l. 145-146), une rafale de 20 vues en 20 × 0,8 = 16 s au moins ; un doigt qui glisse sur le viseur pendant ce temps gâche la photo, sans rien de physique : le mouvement n'a pas lieu pendant la pose mais pendant le calcul. C'est le geste même que la rafale demande (« suivre le chien ») : le doigt qui suit le sujet est encore sur le viseur quand le calcul commence. `replay.rotation` (`photo.ts`, l. 453) garde la dernière orientation, pas celle de la pose : la loupe recalcule alors une autre vue que la photo.
- Ce que l'essai ne dit pas : la fréquence du cas sur un vrai téléphone. Le rendu logiciel étire le calcul (43 à 66 s ici).
- Correction proposée : rendre sans mettre à jour la caméra, `scene.render(false)`, aux deux appels de `takePhoto` (l. 317 et 388) ; et, dans `Shutter.compute`, détacher les commandes le temps du calcul (`camera.detachControl()` avant, `camera.attachControl(canvas, true)` et `camera.cameraRotation.set(0, 0)` dans le `finally`), pour que les gestes faits pendant le calcul ne s'appliquent pas à la reprise.
- Correction essayée (essai 7, 14 novembre 2026, sur une seconde copie hors du dépôt qui porte ces cinq lignes ; `npx tsc --noEmit` passe ; 200 mm, f/8, souris glissée de 240 px sur le viseur pendant le calcul) :

  | Copie | `rotation.y` pendant les rendus de la photo | `rotation.y` du viseur après le calcul |
  | --- | --- | --- |
  | non modifiée | de 0,01 à 0,10 rad (34 rendus) | 0,50 rad : le viseur a tourné de 29° |
  | corrigée | 0 aux 54 rendus | 0 |

  Sur la copie corrigée, la photo prise en glissant est nette sur le sujet et son fond est flou (`essai7-copie2-glisse.jpg`) : le déplacement de l'œil sur l'ouverture se fait toujours avec `scene.render(false)`. À refaire sur un téléphone avant de fusionner.

**Contre-vérification : confirmé.** Code de Babylon.js relu aux lignes citées, et essai refait avec un autre script (`r01_rotation.cjs`, 14 novembre 2026, 50 mm, f/8, 17 rendus par photo) : sans geste, `rotation.y` vaut 0 à tous les rendus ; souris tenue sur le viseur et déplacée de 120 px pendant le calcul, elle passe de 0 au premier rendu à 0,0028 rad au dernier, et le viseur a tourné de 0,059 rad à la reprise. Le code est du 8 au 10 novembre (dans le lot), et aucune autre page du dépôt ne le dit (ARC-08 décrit le protocole de suspension sans voir que la caméra garde ses commandes).

Le constat sous-estime le cas du téléphone. Au doigt, Babylon.js ne lit pas un déplacement mais l'écart entre le doigt et son point d'appui, et l'applique à chaque `camera.update()` tant que le doigt reste posé (`Cameras/Inputs/freeCameraTouchInput.js`, l. 108 et 150-171 : `camera.cameraRotation.y = this._offsetX * …` dans `checkInputs`). Essai (profil Pixel 7 émulé) : un doigt posé sur le viseur, glissé de 80 px avant le déclenchement puis immobile, un second doigt sur le déclencheur ; `rotation.y` passe de 0,0298 à 0,0325 rad pendant les 17 rendus de la photo. Il n'est donc pas nécessaire de bouger le doigt pendant le calcul : il suffit qu'il soit encore posé, écarté de son point d'appui. Ce que cela donne sur un vrai téléphone, où le calcul dure une seconde et non dix : je ne sais pas.

### COD-09 · faux · Rafale au doigt : un glissement de 20 px du doigt sur le déclencheur arrête la rafale, doigt encore posé

- Endroit : `app/src/ui/shutter.ts`, l. 139-146 ; `app/src/style.css`, l. 138-143 et 506-516.
- Ce qui est écrit : `docs/camera-physique.md`, l. 436 : « tant que le déclencheur reste appuyé, une vue par intervalle ». `shutter.ts`, l. 139-141 : le pointeur est capturé à l'appui pour que « le relâchement arrive au bouton ».
- Ce qui est fait : la fin de la rafale est liée à trois événements, dont `pointercancel` (l. 146). Le canevas a `touch-action: none` (`style.css`, l. 142), pas le déclencheur (l. 506-516 : valeur par défaut, `auto`). Dans l'essai, quand le doigt se déplace de 20 px sur le bouton, Chromium prend le geste (défilement) et envoie `pointercancel` à la page, bien qu'elle ne défile pas ; la capture du pointeur n'y change rien.
- Preuve (essai 4, 14 novembre 2026, profil Pixel 7 émulé, 412 × 839 px, page non défilable : `scrollHeight` = `clientHeight` = 839 ; Continu L à 5 vues par seconde ; touchers envoyés par `Input.dispatchTouchEvent`, événements relevés sur le bouton) :

  | Geste | Événements reçus par le bouton | Fin de la rafale |
  | --- | --- | --- |
  | doigt immobile 7,9 s | `pointerdown`, puis `pointerup` et `lostpointercapture` au lever du doigt | au lever du doigt (4 vues) |
  | doigt posé, puis glissé vers le haut par pas de 5 px | `pointerdown`, quatre `pointermove`, puis `pointercancel` et `lostpointercapture` après le quatrième pas (20 px) | au `pointercancel` : le bouton revient à « Déclencher » et le calcul commence, 18,8 s avant le lever du doigt (`touchend`) |
  | le même glissement, avec `touch-action: none` ajouté au bouton | `pointerdown`, six `pointermove`, puis `pointerup` au lever du doigt | au lever du doigt (9 vues) |

  Les durées sont étirées par le rendu logiciel ; l'ordre des événements, lui, ne dépend pas de la vitesse.
- Conséquence : en rafale, le doigt tient le déclencheur pendant que l'autre main suit le sujet ; un glissement de 20 px (3 mm sur un écran à 160 px CSS par pouce) coupe la série sans que rien ne le dise. Le débutant voit une rafale plus courte que son appui.
- Ce que l'essai ne dit pas : le comportement d'un vrai téléphone et de Safari, non essayés. La routine de test tient le déclencheur à la souris (`scripts/test_app.cjs`, l. 1080-1084 : `page.mouse.down()`), pas au doigt.
- Correction proposée : `touch-action: none;` dans la règle `.shutter-button` (essayée : troisième ligne du tableau), avec `user-select: none;` et `-webkit-touch-callout: none;` contre le menu de l'appui long (non essayé, Safari n'étant pas émulé). À confirmer sur le téléphone de Julien.

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
- Correction proposée : ne pas prendre les touchers du viseur pendant un calcul (`choosePoint` : `if (!this.panel.isEnabled()) return;`, le test que fait déjà `TopView`, `topView.ts`, l. 76 et 92).
- Correction essayée (essai 7, même copie corrigée) : après un toucher en haut du cadre pendant le calcul, le repère reste à 85 % et l'indicateur à « verrouillée à 15,8 m » ; sur la copie non modifiée, le repère passe à 20 % avec la même distance.

**Contre-vérification : confirmé.** Chemin relu ligne à ligne (`setFocusPoint` déplace le point puis appelle `touch()`, que `read()` abandonne sans toucher au verrou quand l'autofocus est suspendu), et essai refait avec un autre script (`r07_etats.cjs`, 14 novembre 2026, réglages par défaut, donc AF-S et point sélectif) : mêmes quatre états que le tableau, « verrouillée à 7,1 m » avec le repère à 20 % et la classe `locked` pendant le calcul et 3 s après, « verrouillée à 500,0 m » pour le même toucher hors calcul. AF-S est le mode par défaut depuis la version 0.3.36 : le cas ne demande aucun réglage. La correction proposée est la bonne (une ligne, le test que `TopView` fait déjà) ; la fenêtre où le cas se produit est la durée du calcul, courte pour une vue seule sur un téléphone (0,8 à 2,0 s), longue en rafale.

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

### COD-11 · faux · Navigateur sans WebGL : le message prévu n'est jamais visible ; la page montre un rectangle gris et des éléments vides

- Endroit : `app/src/main.ts`, l. 153-158 ; `app/src/style.css`, l. 81-87 et 138-143 ; `app/simulateur/index.html`, l. 26 et 100.
- Ce qui est écrit : `i18n.ts`, clé `noWebgl` : « Ce navigateur ne permet pas d'afficher la scène 3D (WebGL indisponible). »
- Ce qui est fait : sans WebGL, `main.ts` pose `canvas.hidden = true`, masque le panneau et montre le paragraphe `#no-webgl` (l. 154-157). Mais `style.css`, l. 138-140, donne au canevas `display: block`, qui l'emporte sur l'attribut `hidden` : le canevas garde toute la hauteur de `main` (`height: 100%`), le paragraphe, placé après lui (`index.html`, l. 100), est poussé sous le bas de `main`, qui coupe ce qui dépasse (`overflow: hidden`, l. 86). La feuille de style corrige ce même piège pour treize autres sélecteurs (`.review[hidden]`, `.progress[hidden]`, `.balance[hidden]`…, l. 166 à 886), pas pour `#scene`.
- Preuve (essais 8 et 8b, 14 novembre 2026 ; `getContext` rend `null` pour `webgl` et `webgl2`) :

  | Profil | Fenêtre | Canevas (`hidden`, `display` calculé, haut et bas) | Message `#no-webgl` (haut et bas) |
  | --- | --- | --- | --- |
  | Ordinateur | 1280 × 800 px | `true`, `block`, de 51 à 800 px | de 816 à 868 px : sous le bas de la fenêtre |
  | Pixel 7 émulé | 412 × 839 px | `true`, `block`, de 100 à 839 px | de 855 à 927 px : sous le bas de la fenêtre |

  Sur la capture (`essai8-ordinateur.png`), la bande où le message devrait être est d'une seule couleur (écart type 0 sur les trois canaux). Restent à l'écran : le voile du cadre du viseur sur toute la zone, le triangle de l'indicateur d'équilibre sans texte, la boîte de la vue de dessus vide avec deux boutons sans texte, le repère de mise au point, et, dans l'en-tête, le bouton « Défis » sans texte, qui n'ouvre rien (ces composants ne sont créés que dans la branche avec WebGL, `main.ts`, l. 159-314).
- Conséquence : la personne dont le navigateur n'a pas WebGL ne lit aucune explication. La routine a un profil sans WebGL 2, pas de profil sans WebGL.
- Correction proposée : `#scene[hidden] { display: none; }` dans `style.css` ; dans la branche sans WebGL, masquer aussi `#frame`, `#af-coverage`, `#focus-marker`, `#balance`, `#top-view` et `#challenge-button` (ou poser une classe sur `body` et une règle qui masque tout `main` sauf `#no-webgl`) ; un contrôle de plus dans la routine (le texte du message est visible : `elementFromPoint` en son centre le rend).

**Contre-vérification : confirmé.** Essai refait avec un autre script (`r11_sans_webgl.cjs`, 14 novembre 2026) : mêmes rectangles au pixel près (canevas `hidden` mais `display: block`, de 51 à 800 px et de 100 à 839 px ; message de 816 à 868 px et de 855 à 927 px), et `elementFromPoint` au centre du message ne rend aucun élément. Le code est du 7 et du 8 novembre (dans le lot) ; aucune autre page du dépôt ne le dit. Précision sur la correction, essayée (`r11b_correction.cjs`) : la règle `#scene[hidden]` seule ne suffit pas, le message remonte en haut de `main` mais reste sous le voile du cadre (noir à 55 %) et sous l'indicateur d'équilibre, qui cache ses premiers mots ; avec les six éléments masqués, il est lisible. Les deux parties de la correction sont donc à faire ensemble ; la classe sur `body` est la forme la plus courte. Dans la routine, contrôler que le texte est lisible, pas seulement que `elementFromPoint` rend le message : le voile ne prend pas les touchers (`pointer-events: none`) et passerait ce contrôle.

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

### COD-08 · incohérent · Écran de revue : pendant le calcul de la loupe, « Revenir au viseur » et « Vue suivante » restent actifs, et le résultat de la loupe s'impose ensuite

- Endroit : `app/src/ui/shutter.ts`, l. 152-155, 426-438, 464-503, 511-515 et 544-546 ; `app/src/ui/cameraPanel.ts`, l. 670-675.
- Ce qui est fait : `compute` ne grise que les boutons du panneau du boîtier (`setEnabled`, `cameraPanel.ts`, l. 672 : `this.el.panel.querySelectorAll("button")`). Les boutons de l'écran de revue restent actifs pendant le calcul de la loupe, et la suite de `magnify` (l. 489-498) s'exécute sans regarder ce qui s'est passé entre-temps : `showCaption` remet `review.hidden = false` (l. 514), et la fenêtre de la loupe est posée quelle que soit la vue affichée.
- Preuve (essai 3b, 14 novembre 2026) :
  - loupe lancée, puis « Revenir au viseur » pendant le calcul : l'écran de revue se ferme, puis revient tout seul à la fin du calcul, 5,7 s plus tard, avec la fenêtre de la loupe ;
  - rafale de deux vues, loupe lancée sur la vue 1, puis « Vue suivante » pendant le calcul : le compteur passe à « Vue 2/2 » et la vue 2 s'affiche ; à la fin du calcul, l'image est remplacée par la fenêtre de la loupe de la vue 1, sous le compteur « Vue 2/2 ». D'après le code (l. 441-445), « Photo entière » montre ensuite la vue 2 ; non essayé.
- Conséquence : en triant une rafale (c'est l'usage annoncé, `shutter.ts`, l. 12), on peut regarder à 100 % une autre vue que celle que le compteur désigne, et juger nette la mauvaise.
- Correction proposée : à la reprise de `magnify`, jeter le résultat si l'écran de revue a été fermé ou si la vue a changé (`if (this.el.review.hidden || this.shots[this.shotIndex] !== shot) { URL.revokeObjectURL(photo.url); return; }`) ; ou griser les boutons de l'écran de revue pendant le calcul, comme ceux du panneau.

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

### COD-12 · à améliorer · Contexte WebGL perdu : rien n'est dit, et après la restauration les objets 3D sont de 5 à 10 % plus sombres

- Endroit : `app/src/main.ts`, l. 168 et 315-330 (aucun abonnement à `engine.onContextLostObservable` ni à `onContextRestoredObservable`) ; `app/src/scene.ts`, l. 196-205.
- Ce qui est fait : Babylon.js gère lui-même la perte et la restauration du contexte ; le code de TutoPhoto ne s'en occupe pas. Pendant la perte, le viseur est figé sans message.
- Preuve (essais 5, 5b et 5c, 14 novembre 2026 ; perte forcée par l'extension `WEBGL_lose_context`, restauration 3 s plus tard) :
  - ce qui revient : le viseur, l'indicateur du viseur, l'indicateur d'équilibre, une photo (16 rendus, 9,8 s), et le bruit du viseur à ISO 6400 (écart type par canal 1,21 ; 0,90 ; 1,65 avant, les mêmes valeurs après) ;
  - ce qui change : la moyenne des pixels sur des objets immobiles, aperçus du bruit et de la profondeur de champ coupés (essai 5c) :

    | Relevé | Veste de Dennis | Dos de Fabienne | Banc | Fond (haut du cadre) |
    | --- | --- | --- | --- | --- |
    | Avant la perte | 117,31 | 75,82 | 81,13 | 46,16 |
    | 20 s plus tard, sans perte (témoin) | 117,31 | 75,82 | 81,19 | 46,16 |
    | 20 s après la restauration | 111,83 | 68,40 | 76,79 | 46,16 |
    | Rapport après / avant | 0,953 | 0,902 | 0,947 | 1,000 |

    Le fond (photo à 360°) est inchangé ; les objets éclairés par le fichier HDR perdent de 5 à 10 %. Une cinquième zone, la poubelle, n'est pas retenue : le chien passe devant elle (94,42 ; 94,42 ; 88,63 puis 85,68 vingt secondes après). La console porte, à la restauration : « WebGL: INVALID_OPERATION: texImage2D: type HALF_FLOAT_OES but ArrayBufferView is not NULL and not Uint16Array » ; la texture d'éclairage est en demi-flottants (`type` 2).
- Ce que je ne sais pas : la cause exacte (quelle partie de la texture d'éclairage n'est pas reconstruite) ; la fréquence d'une perte de contexte sur un téléphone (onglet en arrière-plan, mémoire graphique) ; ce que fait une perte pendant le calcul d'une photo, non essayé ; si un vrai processeur graphique donne le même écart que le rendu logiciel.
- Ce que cela coûte : une exposition des sujets décalée de log₂(0,90) = −0,15 IL au plus, sans que rien ne le dise, jusqu'au rechargement de la page.
- Correction proposée : s'abonner aux deux événements du moteur ; à la perte, afficher un message (« Affichage interrompu… ») ; à la restauration, recréer la texture d'éclairage (`environment.dispose()`, puis une nouvelle `HDRCubeTexture`), ou proposer de recharger la page. À vérifier avec l'essai 5c : rapports revenus à 1,000.

### COD-10 · à améliorer · Au repos, trois minuteries réécrivent de 50 à 190 fois par seconde des textes et des attributs qui n'ont pas changé

- Endroit : `app/src/ui/topView.ts`, l. 80 et 101-110 ; `app/src/ui/balance.ts`, l. 74, 128, 163-168, 177-191 et 202-215 ; `app/src/camera/autofocus.ts`, l. 138-140 et 262 ; `app/src/ui/cameraPanel.ts`, l. 435 et 950-999 ; `app/src/ui/shutter.ts`, l. 158.
- Ce qui est fait :
  - vue de dessus : `draw()` toutes les 250 ms, repliée ou non ; repliée, elle réécrit quand même le texte et `aria-expanded` du bouton, `aria-label` de la carte, le texte et `hidden` du bouton « Retour au départ » (l. 104-109) ; dépliée, elle recrée en plus tous les éléments de la carte ;
  - équilibre : `refresh()` toutes les 300 ms ; trois textes, trois classes et la position du point sont réécrits à chaque fois, même quand le texte est replié (petit écran) ;
  - AF-C : toutes les 200 ms, chaque mesure aboutie appelle `notify()` (`autofocus.ts`, l. 262), que la distance ait changé ou non ; `updateFocus` réécrit alors le bouton « Mise au point », les seize textes de la fenêtre « Mise au point » (fermée), la consigne sous le viseur et l'état des quatre cases de détection (`cameraPanel.ts`, l. 950-984). Seul l'indicateur du viseur est gardé par un test (l. 995 : `if (this.el.afBadge.textContent !== text)`).
- Preuve (essai 6, 14 novembre 2026, viseur au repos pendant 10 s, écritures comptées par un `MutationObserver` sur toute la page). En rendu logiciel, la page ne rend que 2,2 images par seconde et les minuteries ne passent que 1,1 à 1,6 fois par seconde ; ce qui se lit est le nombre d'écritures par passage :

  | Composant | Écritures par passage | Cadence prévue par le code | Écritures par seconde à cette cadence |
  | --- | --- | --- | --- |
  | Vue de dessus repliée | 5 | 4 par seconde | 20 |
  | Vue de dessus dépliée | 10 | 4 par seconde | 40 |
  | Équilibre, replié ou non | 9 | 3,3 par seconde | 30 |
  | Autofocus en AF-C | 24 | 5 par seconde | 120 |

  Soit, à la cadence prévue : 50 par seconde sur un téléphone en AF-S (tout replié), 70 sur un ordinateur en AF-S, 170 à 190 en AF-C. Comptes bruts de l'essai, en 10 s : 156 à 228 en AF-S, 538 à 585 en AF-C.
- Ce que cela coûte : chaque écriture d'un texte remplace un nœud et invalide la mise en page de son élément ; pour les éléments visibles (bouton « Mise au point », consigne, boutons de la vue de dessus), le navigateur recalcule styles et mise en page à l'image suivante, en concurrence avec le rendu du viseur. Le coût en millisecondes sur un téléphone : je ne sais pas, il n'est pas mesuré (ARC-06 le dit pour toute la boucle). Ces écritures touchent aussi des éléments lus par les lecteurs d'écran (`aria-label`, `aria-expanded`), ce qui relève de `docs/audit/interface.md`.
- Correction proposée, sans changement de comportement :
  1. `Autofocus.measure` : n'appeler `notify()` que si la distance affichée (un chiffre après la virgule), la cible ou le verrou ont changé ;
  2. `updateFocus` : séparer les textes (à refaire au changement de langue ou de mode) de l'indicateur de distance (à chaque mesure) ;
  3. `TopView.draw` : sortir avant toute écriture quand la vue est repliée et que rien n'a changé ; garder les éléments de la carte et ne changer que leurs attributs ;
  4. `BalanceIndicator` : n'écrire un texte ou une classe que s'il diffère du précédent ; ne rien lire ni écrire quand le texte est replié et l'onglet masqué (`document.hidden`).

### COD-05 · à améliorer · Rafale : si une vue échoue en cours de série, le message d'erreur est aussitôt remplacé par la première vue réussie

- Endroit : `app/src/ui/shutter.ts`, l. 341-395 et 518-525.
- Chemin (lecture du code) : dans `shootSeries`, une erreur à la vue n° 3 d'une rafale de 5 passe par `catch` : `console.error` puis `showError`, qui écrit « La photo n'a pas pu être calculée. (…) » dans la légende (l. 383-385 et 518-525). Mais deux vues sont déjà dans `shots` : la fonction continue, `this.shots = shots; this.showFrame(0);` (l. 391-394), et `showWhole` réécrit la légende (l. 448-458). Le message n'est jamais vu ; l'écran de revue affiche « Vue 1/2 » au compteur et « Vue 1/5 » dans la légende (l. 455 : `frame.count` vaut le nombre de vues demandées).
- Avec une seule vue, ou si la première échoue, le message reste, mais l'image, le lien « Enregistrer » et les boutons de la série restent ceux de la photo précédente (`showError` ne touche qu'à la légende, au bulletin et aux histogrammes).
- Conséquence : sur un téléphone à court de mémoire graphique, une rafale tronquée ne dit pas pourquoi ; c'est le cas où le diagnostic à l'écran sert (`main.ts`, l. 91-92).
- Correction proposée : garder l'erreur et l'afficher après `showFrame(0)` (une ligne sous la légende : « 2 vues sur 5 : … ») ; dans `showError` sans photo nouvelle, masquer l'image et la série précédentes.

### COD-13 · à améliorer · Petits défauts d'état et code mort

Lus dans le code, sans essai. Aucun ne justifie une pull request à lui seul ; à corriger au passage.

1. Le déclencheur part au clic droit et au clic du milieu : l'écouteur de `pointerdown` ne regarde pas le bouton de la souris (`app/src/ui/shutter.ts`, l. 142-145). Correction : `if (e.button !== 0) return;`.
2. Changer de langue pendant un compte à rebours ou pendant le calcul d'une rafale remet le texte par défaut : `setLang` écrit « Déclencher » sur le bouton et « Calcul de la photo… » dans le bandeau (`shutter.ts`, l. 166-168), à la place de « Retardateur : 7 s » (jusqu'à la seconde suivante) ou de « Calcul de la vue 3/20… » (jusqu'à la vue suivante).
3. Pendant qu'une rafale est tenue, l'observateur réécrit le texte du bouton à chaque image, même quand le nombre de vues n'a pas changé, et empile une orientation par image sans limite, y compris après les 20 vues du plafond (`shutter.ts`, l. 266-271) : 60 par seconde à 60 images par seconde, relues en entier pour chaque vue au relâchement (l. 292-298). Correction : n'écrire que si le nombre change ; ne plus relever au-delà de la dernière vue possible.
4. `compute` applique deux fois la vue à la fin de chaque calcul : `panel.setEnabled(true)` appelle `update()`, donc `applyView()`, puis `panel.restoreView()` rappelle `applyView()` (`shutter.ts`, l. 246-247 ; `app/src/ui/cameraPanel.ts`, l. 646-648, 674 et 773).
5. Code mort : la clé de texte `meter` n'est lue nulle part (`app/src/i18n.ts`, l. 26 et 260 ; recherche de `"meter"` dans `app/src/`) ; trois exports ne servent que dans leur fichier : `AF_COVERAGE` (`cameraPanel.ts`, l. 72), `MOVE_AREA` (`app/src/ui/topView.ts`, l. 23), `shadow` (`app/src/activities/lum02.ts`, l. 130).
6. Deux commentaires orphelins : `app/src/scene.ts`, l. 77, « Résolue quand tous les fichiers de la scène sont chargés » précède un second commentaire pour le même champ, et il est faux (COD-06 : le fichier HDR n'est pas attendu) ; `app/src/ui/challenges.ts`, l. 128, le commentaire de `renderBulletin` est resté au-dessus de `ficheButton`.

## Vérifié

Points contrôlés et justes.

Chargement et erreurs
1. La progression ne peut pas perdre de fichier par débordement du tampon de la Resource Timing API (250 entrées par défaut) : le manifeste liste 36 fichiers, dont 31 sont comptés, plus le code et la feuille de style.
2. La minuterie de la progression s'arrête quand le chargement finit ou échoue (`main.ts`, l. 79-82).
3. Photo de fond ou modèle non reçu : « La scène n'a pas pu être chargée. » s'affiche (essai 2 : à 11 s et à 15 s).
4. Une erreur JavaScript ou une promesse rejetée s'affiche à l'écran, quatre messages au plus, sans doublon (`main.ts`, l. 96-109).
5. Une erreur pendant le calcul d'une photo remet la caméra, la projection, l'horloge et le viseur en état : `takePhoto` et `Shutter.compute` défont tout dans un `finally` (`photo.ts`, l. 458-472 ; `shutter.ts`, l. 240-250).

Boucle de rendu et redimensionnement
6. Relancer la boucle de rendu après chaque calcul n'en empile pas : `runRenderLoop` ignore une fonction déjà inscrite (`Engines/abstractEngine.pure.js`, l. 505-508), et `main.ts` passe toujours la même (l. 219 et 252).
7. Perte et restauration du contexte WebGL : le viseur, l'autofocus, l'indicateur d'équilibre, le bruit du viseur et la photo reviennent (essais 5 et 5b) ; reste l'écart d'éclairage de COD-12.
8. La loupe du viseur : la matrice modifiée fait bien x' = (x − centre) × grossissement (`cameraPanel.ts`, l. 919-924, avec x_ndc = m0 × x / z + m8), et `displayedToFrame` est l'inverse de `frameToDisplayed` (l. 651-662).

États mémorisés
9. Chaque champ lu dans `tutophoto.boitier` et `tutophoto.apercu` est validé avant d'être pris (`cameraPanel.ts`, l. 1053-1114), `tutophoto.defi` et `tutophoto.lang` aussi (`challenges.ts`, l. 70 ; `i18n.ts`, l. 486) ; un stockage indisponible est rattrapé partout (neuf `try` dans ces trois fichiers). Essai 9, 14 novembre 2026 : avec quatre valeurs invalides en mémoire (boîtier « x », mode « P », cadence « abc », défi « SIT-99 », langue « de »…), la page se charge avec les réglages par défaut, sans erreur ni diagnostic.
10. « Aucun défi » est mémorisé sous la valeur `none`, que la relecture écarte comme inconnue : le résultat est juste (`challenges.ts`, l. 70 et 88-90).

Déclencheur et écran de revue
11. Un appui pendant un calcul, une série ou un compte à rebours est refusé (`shutter.ts`, l. 255), et le déclencheur est grisé pendant le calcul : il est dans le panneau (`index.html`, l. 152 ; `cameraPanel.ts`, l. 672).
12. Au clavier, le déclencheur prend une vue : un clic sans pointeur (`detail` nul) vaut un appui bref (`shutter.ts`, l. 147-151).
13. Les adresses des photos sont libérées : celles de la série précédente à chaque nouvelle série (l. 392), celle de la loupe à chaque nouvelle fenêtre, à chaque changement de vue et à chaque nouvelle série (l. 429, 489 et 539-542).
14. L'observateur de la rafale est retiré au relâchement (l. 282), que la fin vienne de `pointerup`, de `pointercancel` ou de `lostpointercapture` (l. 146).
15. Changer de boîtier ne touche pas aux photos déjà prises : la loupe recalcule avec le boîtier de la photo (`shutter.ts`, l. 474 et 485, `shot.request.body`).

Fiches, crédits, langue
16. Aucune écriture de HTML par chaîne dans le lot (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` : aucune occurrence) ; les textes passent par `textContent`.
17. Fenêtre de fiche : dans les 44 pages construites, les 252 liens du corps (hors fil d'Ariane et bouton d'action, que la fenêtre retire) sont soit en `https://`, soit vers une autre fiche, que la fenêtre garde chez elle (`ficheDialog.ts`, l. 33-39 et 62) : aucun lien relatif ne casse.
18. Deux clics rapides sur deux fiches n'affichent que la dernière (`ficheDialog.ts`, l. 82).
19. Les deux langues ont les mêmes 223 clés (`i18n.ts`) ; une seule n'est pas utilisée (COD-13).

Activité LUM-02 et scripts
20. `shadow()` : pour 120 cm à 200 cm, pénombre de 120 × 50 / 200 = 30 cm et ombre pleine de 30 × 250 / 200 − 30 = 7,5 cm ; pour 3 cm à 100 cm, 1,5 cm et 43,5 cm ; pour 80 cm à 80 cm, 50 cm et aucune ombre pleine.
21. `litFraction()` : comparée à un tracé de rayons point par point sur 400 tirages (taille de 1 à 150 cm, distance de 20 à 400 cm, hauteur de −100 à 100 cm), écart maximal 0,0002.
22. Les bornes des curseurs tiennent dans le schéma : distance au plus 400 cm, donc mur à 450 cm, pour un dessin large de 480 cm ; taille d'au moins 1 cm, donc pas de division par zéro (`activites/LUM-02/index.html`, l. 27-30).
23. `build-pages.mjs` et `copy-licences.mjs` : lus en entier, aucun défaut trouvé ; la page construite sur la copie donne « Pages : accueil, 44 fiche(s), 0 relue(s) ».

Essais complémentaires (14 novembre 2026)
24. Pas de fuite au fil des photos (essai 9) : après une série de trois photos, deux loupes, une rafale, trois changements de boîtier et deux de langue, puis après une seconde série, les compteurs sont ceux du départ : 30 textures dans la scène, 31 dans le moteur, 1 cible de rendu permanente, 4 post-traitements sur la caméra, 32 matériaux, 35 maillages, 1 observateur avant rendu, 0 après rendu, 5 de redimensionnement. Les effets compilés passent de 17 à 23 à la première photo, puis ne bougent plus.
25. Fenêtre redimensionnée pendant le calcul d'une photo, de 1280 × 800 à 700 × 1000 px (essai 10) : la photo fait 1500 × 999 px, 16 rendus, de même moyenne (64,9 contre 64,6) et de même netteté (laplacien moyen 6,85 contre 6,68) que la photo témoin ; après, le canevas fait 700 × 738 px et le cadre 491 × 738 px, soit 2:3 ; aucune erreur.
26. Deux doigts sur le viseur ne déplacent pas l'appareil (essai 11, profil Pixel 7 émulé) : glissés ensemble ou écartés, sur 71 images, la position de la caméra reste celle de l'œil (écart nul) ; seule l'orientation change. Le commentaire « On tourne seulement » (`scene.ts`, l. 112) tient dans cet essai, bien que le code de Babylon.js prévoie une translation à deux doigts (`Cameras/Inputs/freeCameraTouchInput.js`, l. 174-181) ; `scene.ts`, l. 146, remet la position de la caméra à chaque image.

27. À chaque image, le code du lot ne fait que le nécessaire : avancer l'horloge, placer les deux sujets en mouvement et les trois animations, remettre la position de la caméra et borner son inclinaison (`scene.ts`, l. 129-149). Les écritures dans la page viennent des minuteries (COD-10), pas de la boucle de rendu ; seule exception, la rafale tenue (COD-13, point 3).

## Je ne sais pas

1. Le comportement sur un vrai téléphone et dans Safari de tout ce qui est établi par essai (COD-01, COD-06, COD-07, COD-09, COD-11, COD-12) : les essais émulent l'écran, le toucher et le navigateur, pas le processeur graphique.
2. La fréquence réelle de ces cas chez un débutant : aucun test avec des débutants n'a encore eu lieu.
3. Le coût en millisecondes par image des écritures de COD-10, et le coût des trois minuteries sur un téléphone : non mesurés (ARC-06).
4. La cause de l'écart d'éclairage après une restauration du contexte (COD-12), et ce que fait une perte du contexte pendant le calcul d'une photo.
5. Comment un Nikon Z 6 annule un retardateur en cours (COD-02) : page non relue pour ce rapport.
6. Si un appui long sur le déclencheur ouvre un menu ou une sélection de texte sur iPhone (COD-09) : Safari n'est pas émulé.
