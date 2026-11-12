# Pile technique : comparaison des moteurs 3D

_Comparaison du 7 novembre 2026. **Décision de Julien, le même jour : option B, Babylon.js.** Constats tirés du code source de chaque moteur, à sa dernière version publiée, lu le même jour ; les sites de documentation n'étaient pas joignables depuis la session de travail, les dépôts publics l'étaient._

## Besoins de la V1 minimale

- Rendu 3D réaliste dans le navigateur, publié comme site statique sur GitHub Pages.
- Profondeur de champ qui dépend de l'ouverture, de la focale et de la distance de mise au point (NET-01, NET-06, MAP-06).
- Flou de mouvement lié à la vitesse d'obturation (MVT-01, SIT-06).
- Personnages et chien animés (SIT-05, SIT-06), chargés au format glTF.
- Lisible et utilisable sur téléphone.
- Licence compatible avec la licence MIT du projet.

L'exposition (ouverture, vitesse, ISO) et le bruit du capteur ne sont fournis par aucun des moteurs lus : notre code les calculera dans tous les cas.

## Constats

| | three.js r187 | Babylon.js 9.35.0 | PlayCanvas 2.23.3 | three-gpu-pathtracer 0.0.28 |
| --- | --- | --- | --- | --- |
| Licence | MIT | Apache-2.0 | MIT | MIT |
| Profondeur de champ | artistique (`DepthOfFieldNode`) ; ancien shader à lentille mince ramené entre 0 et 1 (`BokehShader2`) | physique : ouverture, focale, distance (`thinCircleOfConfusionPostProcess`) | artistique : distance, plage nette, rayon | physique : ouverture, distance, nombre de lamelles du diaphragme (`PhysicalCamera`) |
| Flou de mouvement | par vecteurs de mouvement, moteur WebGPU (`MotionBlur.js`) | par objet par défaut, intensité réglable (`motionBlurPostProcess`) | absent du dépôt | non mentionné dans le README |
| glTF | `GLTFLoader.js` | `glTFLoader.ts` | `glb-parser.js` | via three.js |
| API graphique | WebGL2 et WebGPU | WebGL2 et WebGPU | WebGL2 et WebGPU | WebGPU obligatoire |

Détails, avec les fichiers lus :

- **three.js** ([dépôt, version r187](https://github.com/mrdoob/three.js/tree/r187), commit `7e89746` du 30 octobre 2026). `examples/jsm/tsl/display/DepthOfFieldNode.js` : le flou passe de 0 à 1 par une transition progressive (`smoothstep`) sur une plage choisie à la main, et un facteur de taille du bokeh est « sans unité, à visée artistique ». `examples/jsm/shaders/BokehShader2.js` utilise la formule de la lentille mince (focale en mm, ouverture, cercle de confusion de 0,03 mm), mais ramène le résultat entre 0 et 1. `examples/jsm/tsl/display/MotionBlur.js` floute selon les vecteurs de mouvement de l'image, avec 16 échantillons par défaut.
- **Babylon.js** ([dépôt, version 9.35.0](https://github.com/BabylonJS/Babylon.js/tree/9.35.0), commit `00bc37c` du 6 novembre 2026). `thinCircleOfConfusionPostProcess.ts` calcule le cercle de confusion à partir de `fStop`, `focalLength` et `focusDistance`, avec un diamètre d'ouverture égal à `lensSize / fStop`. Pour un résultat physiquement juste, `lensSize` doit valoir la focale (diamètre de pupille = focale ÷ ouverture). `thinMotionBlurPostProcess.ts` : flou par objet par défaut, 32 échantillons, intensité `motionStrength` à relier à la vitesse d'obturation par notre code. Licence Apache-2.0 : une redistribution doit fournir une copie de la licence et reprendre les mentions du fichier `NOTICE.md` du dépôt (section 4, alinéas a et d du [texte Apache-2.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/Apache-2.0.txt)).
- **PlayCanvas** ([dépôt, version 2.23.3](https://github.com/playcanvas/engine/tree/v2.23.3), commit `b7655d8` du 15 octobre 2026). `src/extras/render-passes/camera-frame.js` : profondeur de champ réglée par `focusDistance`, `focusRange` et `blurRadius`, sans ouverture ni focale. Aucun fichier de flou de mouvement dans le dépôt.
- **three-gpu-pathtracer** ([dépôt, version 0.0.28](https://github.com/gkjohnson/three-gpu-pathtracer/tree/v0.0.28), commit `80d1888` du 2 novembre 2026). Rendu par lancer de rayons, physiquement fondé, sur three.js. `src/objects/PhysicalCamera.js` : `fStop`, `focusDistance`, `apertureBlades` (forme du bokeh), diamètre de pupille = focale ÷ ouverture. Le README indique que le projet exige WebGPU et ne prend en charge que les matériaux `MeshStandardMaterial` et `MeshPhysicalMaterial`. Version inférieure à 1.0. Dépendances : three.js (≥ 0.187.0), [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh/tree/v0.9.18) (MIT) et [xatlas-web](https://www.npmjs.com/package/xatlas-web) (MIT d'après le registre npm, dernière modification le 24 mai 2022).

## Prise en charge des navigateurs

D'après les [données de compatibilité de MDN](https://github.com/mdn/browser-compat-data/tree/v8.1.8) (version 8.1.8, commit `29768a4` du 2 novembre 2026), fichiers `api/GPU.json` et `api/WebGL2RenderingContext.json` :

| Navigateur | WebGL2 | WebGPU |
| --- | --- | --- |
| Chrome (ordinateur) | depuis 56 | depuis 144, sous Linux avec GPU Intel Gen12 ou plus récent seulement ; de 113 à 143 sans Linux |
| Chrome Android | depuis 58 | depuis 121 |
| Firefox (ordinateur) | depuis 51 | partiel depuis 141 : Windows, macOS sur Apple silicon ; ni Linux ni macOS sur Intel |
| Firefox Android | oui (comme Firefox) | non |
| Safari (macOS) | depuis 15 | depuis 26 |
| Safari iOS | comme Safari | comme Safari |
| Samsung Internet | comme Chrome Android | comme Chrome Android |

## Options

### A. three.js, et une couche « appareil photo » écrite par nous

- Pour : licence MIT, l'écosystème le plus large des trois, et la voie C s'ajoute par-dessus plus tard si besoin.
- Contre : la profondeur de champ fournie est artistique. Il faut écrire ou adapter une profondeur de champ physique, et relier le flou de mouvement à la vitesse d'obturation, ce qui demande le moteur WebGPU.

### B. Babylon.js

- Pour : le seul des moteurs temps réel lus qui fournit à la fois une profondeur de champ physique (ouverture, focale, distance) et un flou de mouvement par objet. Fonctionne en WebGL2, pris en charge par tous les navigateurs du tableau.
- Contre : licence Apache-2.0, compatible avec le projet mais avec la licence et `NOTICE.md` à reprendre dans la distribution. La profondeur de champ reste un effet appliqué à l'image (approximation) ; il faut régler `lensSize` sur la focale et calculer `motionStrength` à partir de la vitesse d'obturation.

### C. three.js pour l'aperçu, et une photo calculée par lancer de rayons (three-gpu-pathtracer)

- Pour : la photo la plus juste physiquement, avec la profondeur de champ et la forme du bokeh selon les lamelles (utile à NET-05). Seul le déclenchement paie le calcul ; le viseur reste en temps réel.
- Contre : WebGPU obligatoire, donc rien sur Firefox Android ni sur iOS avant la version 26. Version inférieure à 1.0, dont l'interface peut changer. Flou de mouvement non documenté. Temps de calcul d'une photo sur téléphone inconnu.

PlayCanvas n'est pas retenu : profondeur de champ artistique et pas de flou de mouvement dans le moteur.

## Ce que je ne sais pas

- Les performances réelles de chaque option sur téléphone : à mesurer dans la maquette.
- La qualité du flou d'un premier plan qui déborde sur le sujet (chantier du domaine MAP), pour chaque option.
- Le temps de calcul d'une photo par lancer de rayons sur téléphone (option C).
- Si l'une des options a besoin d'en-têtes HTTP particuliers, que GitHub Pages ne documente pas : rien dans le code lu ne l'indique, à vérifier dans la maquette.

## Décision

Le 7 novembre 2026, Julien a choisi l'option B, Babylon.js. Points à traiter dans la preuve du moteur sur la scène de parc :

- régler `lensSize` sur la focale pour une profondeur de champ physiquement juste ;
- relier `motionStrength` à la vitesse d'obturation ;
- calculer l'exposition (ouverture, vitesse, ISO) et le bruit du capteur ;
- mesurer les performances sur les téléphones des testeurs ;
- reprendre la licence Apache-2.0 et les mentions de `NOTICE.md` de Babylon.js dans la distribution.

Le 8 novembre 2026, Julien a choisi comment calculer la photo : effets approchés de Babylon.js dans le viseur, et photo exacte calculée au déclenchement par accumulation de rendus. Modèle et plan : `docs/camera-physique.md`.

## Outillage de l'application

Décidé par Julien le 7 novembre 2026 ; versions et licences lues dans le registre npm le même jour.

- Code de l'application en TypeScript, dans `app/` : [TypeScript](https://www.npmjs.com/package/typescript) 7.0.2, licence Apache-2.0, outil de développement seulement (absent du site publié).
- Construction avec [Vite](https://www.npmjs.com/package/vite) 8.3.6, licence MIT, outil de développement seulement ; le polyfill de préchargement de Vite est désactivé, si bien que le site publié ne contient que notre code et celui de Babylon.js.
- Un seul fichier JavaScript depuis la version 0.3.25 (`inlineDynamicImports` dans `app/vite.config.ts`).
  - Avant, le site comptait 324 fichiers JavaScript, que Babylon.js chargeait à la demande, notamment ses shaders. Le 9 novembre 2026, sur le téléphone de Julien, un seul de ces fichiers n'a pas été reçu (`rgbdDecode.fragment`), et la scène est restée bloquée au chargement.
  - Ce fichier faisait pourtant partie de la version publiée : la cause la plus probable est une coupure du réseau, que nous ne pouvons pas vérifier.
  - Coût : un fichier de 4,1 Mo, environ 950 ko compressé, dont environ 0,5 Mo compressé de code inutilisé. C'est peu face aux 34 Mo de la scène.
- Moteur : [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core) 9.35.0, licence Apache-2.0. Sa licence et son `NOTICE.md` sont recopiés dans le site construit (`licences/`), avec les licences du projet.
- Chargement des modèles glTF : [@babylonjs/loaders](https://www.npmjs.com/package/@babylonjs/loaders) 9.35.0, licence Apache-2.0, ajouté le 8 novembre 2026 ; il dépend de [babylonjs-gltf2interface](https://www.npmjs.com/package/babylonjs-gltf2interface) 9.35.0 (Apache-2.0, déclarations de types seulement). Versions et licences lues dans le registre npm le 7 novembre 2026.
- Scène de parc (8 novembre 2026) : fond `PhotoDome` (photo à 360°), éclairage par `HDRCubeTexture`, sol invisible en `BackgroundMaterial` qui ne reçoit que les ombres. Code dans `app/src/scene.ts` ; fichiers et crédits dans `app/public/scenes/parc/`.
- Organisation du site (version 0.3.46, décisions de Julien du 11 novembre 2026) :
  - l'accueil à la racine, avec les trois portes d'entrée ; le simulateur sous `simulateur/` (entrée Vite `app/simulateur/index.html`) ;
  - les fiches des notions et des situations sous `fiches/fr/` et `fiches/en/`, une page HTML statique par fiche, lisible sans charger la scène 3D ;
  - accueil et fiches produits après Vite par `app/scripts/build-pages.mjs`, à partir de `content/` : un convertisseur écrit pour TutoPhoto, qui ne reconnaît que le balisage des fiches et fait échouer la construction sur tout le reste (`docs/contenus.md`) ;
  - même mémoire de la langue partout (clé `tutophoto.lang` du navigateur) ;
  - activités interactives sous `activites/<ID>/` (version 0.3.50 : LUM-02), construites par une seconde passe de Vite (`app/vite.activites.config.ts`) : le simulateur tient en un seul fichier JavaScript, réglage que Vite n'accepte qu'avec une seule entrée ;
  - densité du viseur : Babylon.js calcule par défaut l'image à la taille en pixels CSS (`adaptToDeviceRatio` faux, niveau de mise à l'échelle 1, lu dans `abstractEngine.pure.js` de la version 9.35.0), et le navigateur l'agrandit à la densité de l'écran, soit 2,625 pixels d'écran par pixel calculé sur le Pixel 7 émulé. La loupe garde « 100 % = un photosite par pixel CSS ».
    - version 0.3.52 (demande de Julien du 11 novembre 2026, la scène paraissant pixelisée sur son téléphone) : viseur calculé à la densité complète, sans plafond ; le nombre de pixels par image est multiplié par la densité au carré (environ 6,9 sur ce Pixel 7, 9 sur l'iPhone 14 émulé). Julien l'a trouvé « beaucoup moins pixelsé », mais saccadé sur son téléphone ;
    - version 0.3.53, à sa demande : densité plafonnée à 2 (option `limitDeviceRatio` de Babylon.js), soit 4 fois plus de pixels qu'à la taille en pixels CSS. Babylon.js applique le plafond à la création du moteur (niveau de mise à l'échelle 1 / min(2, densité)). Si la densité change ensuite (zoom du navigateur sur ordinateur, fenêtre passée sur un autre écran), il multiplie ce niveau par le rapport des densités, sans réappliquer le plafond (`resize()`, même fichier) ;
    - chacune de ces deux versions est isolée, pour pouvoir l'annuler par `git revert -m 1` de son commit de fusion ;
  - chargement (version 0.3.51, après le chargement sans fin signalé par Julien le 11 novembre 2026, en données mobiles) :
    - le simulateur affiche les Mio reçus et le temps écoulé, puis, après une minute, les fichiers encore attendus. Un fichier compte comme reçu quand le navigateur en a terminé le chargement (Resource Timing API) ; sa taille est celle du manifeste. Les textes de licence du manifeste, que la scène ne charge pas, ne sont pas comptés (version 0.3.55 : comptés, ils restaient « en attente » pour toujours) ;
    - l'accueil propose « Télécharger les ressources du simulateur » : le code du simulateur, le manifeste et les fichiers de la scène (sans les textes de licence), trois à la fois. Une barre suit les octets reçus en direct ; le bilan donne la durée et le débit moyen. Option A, choisie par Julien : les fichiers vont dans le cache ordinaire du navigateur, qui les garde ou non selon les en-têtes du serveur et la place disponible ;
    - une adresse sans barre finale (`…/simulateur`) est complétée par la page elle-même : sans cela, les chemins relatifs viseraient le dossier parent si le serveur ne redirige pas.
- Publication sur GitHub Pages à chaque fusion sur `main`, par le workflow `.github/workflows/pages.yml`. GitHub Pages doit être activé dans les réglages du dépôt, avec la source « GitHub Actions ».
- La CI des pull requests vérifie les types et construit le site (`.github/workflows/validate.yml`, job `app`).

## Recommandation (avant décision)

Option B, Babylon.js, pour la V1 minimale. C'est la seule qui couvre d'origine les deux effets clés de la tranche de parc, profondeur de champ physique et flou de mouvement, sur tous les navigateurs du tableau. Le risque principal, les performances sur téléphone, se mesure dès la preuve du moteur sur la scène de parc. La voie C reste une piste pour une photo de meilleure qualité, si WebGPU se généralise.

## Tests sur ordinateur et sur mobile

Demandé par Julien le 9 novembre 2026 : tester sur ordinateur et sur mobile à chaque fois, et faire le maximum de tests soi-même.

- Script : `node scripts/test_app.cjs --photo`, sur le site construit (`cd app && npm run build`). Il est lancé avant toute pull request qui touche `app/` (`CLAUDE.md`).
- Depuis la version 0.3.54, la CI le lance sur chaque pull request qui touche `app/`, `content/`, `data/` ou la routine (`.github/workflows/routine.yml`) : un job par profil, en parallèle, avec la même version de Playwright. Raison : sur la machine de Claude, les quatre profils à la suite occupaient les quatre cœurs pendant 53 minutes (mesuré le 11 novembre 2026), et rien d'autre ne pouvait tourner sans fausser les délais. Les limites sont les mêmes : rendu logiciel, Chromium seul.
- Outil : Playwright 1.63.0, licence Apache-2.0 (champ `license` de son `package.json`, lu le 9 novembre 2026). Il est installé hors du dépôt et n'est pas une dépendance de l'application.
- Profils :
  - ordinateur (1280 × 800) ;
  - Android (Pixel 7 émulé) ;
  - iPhone (iPhone 14 émulé, avec l'identification de Safari, que Babylon.js utilise pour iPhone et iPad) ;
  - ordinateur sans WebGL 2.
- Contrôles :
  - chargement complet, sans problème affiché à l'écran ;
  - rendu à la taille affichée et cadre aux proportions du capteur (depuis la version 0.3.21) ; depuis la version 0.3.53, rendu à la densité de l'écran plafonnée à 2 (pixels CSS × min(densité, 2)) ;
  - profondeur de champ du viseur au 135 mm à f/1.4 : netteté d'une zone de fond inférieure à 60 % de celle mesurée sans l'effet (depuis la version 0.3.22) ;
  - bruit du viseur à ISO 6400, et son absence quand l'aperçu est coupé ;
  - loupe du viseur à 100 % ;
  - photo calculée et non noire ;
  - loupe de l'écran de revue ;
  - mise au point (depuis les versions 0.3.26 à 0.3.29) : verrou en AF-S, zone large, zone automatique (œil détecté, sujet le plus proche sans détection, œil du chien), suivi en AF-C.
- Mesures sur la scène : sur le serveur de développement seulement (`npm run dev`), `window.__tutophoto` donne la scène, la caméra et l'horloge, et charge le module de visée de Babylon (`Culling/ray`). Le site construit n'en contient rien. Il a servi le 9 novembre 2026 à placer les yeux des modèles sans squelette.
- Limites : Chromium seul, en rendu logiciel (SwiftShader). L'émulation ne reproduit ni le processeur graphique d'un téléphone ni le moteur Safari. Le chargement sans fin constaté le 9 novembre 2026 sur le téléphone de Julien ne s'est pas reproduit en émulation : un essai sur un vrai téléphone reste nécessaire.
