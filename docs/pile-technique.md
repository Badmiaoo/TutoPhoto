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
  - les fiches des notions et des situations sous `fiches/` (sous `fiches/fr/` et `fiches/en/` jusqu'à la version 0.3.59), une page HTML statique par fiche, lisible sans charger la scène 3D ;
  - accueil et fiches produits après Vite par `app/scripts/build-pages.mjs`, à partir de `content/` : un convertisseur écrit pour TutoPhoto, qui ne reconnaît que le balisage des fiches et fait échouer la construction sur tout le reste (`docs/contenus.md`) ;
  - une seule langue, le français, depuis la version 0.3.60 : plus de bouton de langue, de paramètre `?lang=` ni de clé `tutophoto.lang` dans le stockage du navigateur ; les textes de l'interface du simulateur sont dans `app/src/texts.ts` ;
  - version à l'écran (version 0.3.59, constat ARC-12 de l'audit) : le numéro `X.Y.Z` du premier titre de version de `CHANGELOG.md` est lu à la construction par `app/scripts/version.mjs`, seul lecteur pour les deux constructions. `app/vite.config.ts` le donne au simulateur par l'option `define` de Vite (`app/src/version.ts` : fenêtre des crédits, au-dessus de la liste ; ligne de diagnostic, à la suite du message d'un problème ; message d'un chargement en échec et texte du message d'un navigateur sans WebGL, que le constat COD-11 de l'audit dit invisible à l'écran) ; `app/scripts/build-pages.mjs` l'écrit dans le pied de l'accueil. Sans titre « ## [X.Y.Z] - AAAA-MM-JJ », ou si le premier est mal formé, la construction échoue. Sur une pull request, c'est la version à venir ; sur `main`, la version publiée. `app/package.json` garde `"version": "0.0.0"` : il n'est pas la source de la version. L'activité de LUM-02, construite à part, ne reçoit pas ce numéro. Le numéro étant dans le script du simulateur, le nom de ce fichier (`assets/simulateur-<empreinte>.js`) change à chaque version, même sans changement du code. L'effet sur le cache du navigateur n'a pas été mesuré (en-têtes de GitHub Pages non lus) ;
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
  - Sur `main` seulement (version 0.3.85, constat LIC-07 de l'audit). `pages.yml` et `.github/workflows/tag.yml`, qui pose les tags et les releases, se lancent aussi à la main (`workflow_dispatch`), et un lancement à la main peut viser toute branche ou tout tag du dépôt. Leurs jobs `build` et `tag` ne tournent que si `github.ref` vaut `refs/heads/main` : un job dont la condition est fausse est sauté, et `deploy`, qui attend `build`, est sauté avec lui. Avant, un lancement sur une autre branche pouvait poser pour de bon des tags et des releases sur ses commits, pour une version qui n'avait pas encore de tag, et `tag.yml` ne les déplace jamais ; il pouvait aussi publier cette branche, sauf règle de l'environnement `github-pages` qui l'en empêche (point suivant). Chaque workflow a aussi un groupe de concurrence par référence (`tags-<ref>`, `pages-<ref>`, relecture de la version 0.3.85) : dans un même groupe, une exécution en attente est annulée quand une autre arrive, et un lancement sur une autre branche, même sauté, pouvait ainsi annuler une exécution de `main` en attente dans le groupe commun d'avant (lecture de la documentation, non essayé).
  - Limites. Un lancement fait tourner le fichier du workflow tel qu'il est au commit de la branche ou du tag choisi. Le 21 novembre 2026, les 26 branches de travail restées sur GitHub et les tags jusqu'à `v0.3.84` ont l'ancien `tag.yml`, et, depuis `v0.3.5`, l'ancien `pages.yml`, sans la condition ni le groupe par référence. Pour `tag.yml`, c'est sans effet : à chacun de ces commits, chaque version du changelog a déjà son tag, sauf les trois que Julien a abandonnées (D8), dont l'ancien script se voit refuser la référence (HTTP 403). Pour `pages.yml`, un tel lancement publierait une ancienne version du site, sauf règle de l'environnement `github-pages`. GitHub recommande une règle qui n'y laisse publier que la branche par défaut ; un environnement créé par un workflow n'a aucune règle, sauf s'il vient d'une publication depuis une branche ou un dossier. Si ce dépôt a une telle règle : je ne sais pas, les outils de Claude ne lisent pas ce réglage. La poser revient à Julien (`docs/etat-des-travaux.md`, « Ce que Julien seul peut faire »). Enfin, la comparaison de `github.ref` ne tient pas compte de la casse : une branche `Main` passerait aussi ; si GitHub accepte une telle branche à côté de `main` : je ne sais pas.
  - Sources (`data/sources.yaml`), lues dans le dépôt `github/docs`, commit `d7487f5`, le 21 novembre 2026 : condition d'un job, github-actions-jobs-if (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/data/reusables/actions/jobs/section-using-conditions-to-control-job-execution.md) ; job qui en attend un autre, github-actions-jobs-needs (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/data/reusables/actions/jobs/section-using-jobs-in-a-workflow-needs.md) ; valeur de `github.ref`, github-actions-github-ref (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/data/reusables/actions/ref-description.md) ; comparaison sans la casse, github-actions-expressions (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/content/actions/reference/workflows-and-actions/expressions.md) ; lancement à la main, github-actions-workflow-dispatch (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/content/actions/reference/workflows-and-actions/events-that-trigger-workflows.md) ; version du fichier qui tourne, github-actions-about-triggers (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/data/reusables/actions/about-triggers.md) ; groupes de concurrence, github-actions-concurrency (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/data/reusables/actions/actions-group-concurrency.md) ; environnement `github-pages`, github-pages-environment (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/content/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.md) et github-manage-environments (https://raw.githubusercontent.com/github/docs/d7487f5debb5a5a2a6e65e6f9fa539266f5f8db6/content/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments.md).
- Tests rapides des formules (version 0.3.86 ; Sujet 26 du plan de corrections, constat ARC-05 de l'audit) : `app/tests/`, un fichier par module que nomme le plan, sept modules de `app/src/camera/` qui se chargent sans navigateur (`exposure.ts`, `exposureModes.ts`, `sharpZone.ts`, `histogram.ts`, `bodies.ts`, `viewfinder.ts` et `bulletin.ts`), 45 tests en moins d'une seconde. Lancés par `npm test`, et par le job `app` de la CI après la construction du site. Ils sont écrits sur le code tel qu'il est, sans le modifier ; chaque valeur attendue vient d'une formule écrite dans le module, d'un exemple de `docs/camera-physique.md`, ou d'un calcul écrit à côté du test.
  - Lanceur : celui de Node.js, qui exécute le TypeScript en retirant les types, sans le compiler ni vérifier les types, par défaut depuis Node.js 22.18.0 ; il refuse ce qui demande une transformation, comme les énumérations et les propriétés de paramètre (documentation de Node.js 22.23.5, [« Modules: TypeScript »](https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/typescript.md), source nodejs-22-typescript). Chaque fichier de test tourne dans son propre processus, l'isolation par processus étant le réglage par défaut ([« Command-line API »](https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/cli.md), source nodejs-22-cli) ; le compte rendu `spec`, que Node.js ne choisit de lui-même que dans un terminal, est demandé aussi pour la CI ([« Test runner »](https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/test.md), source nodejs-22-test-runner).
  - Imports sans extension : Node.js exige l'extension dans un import ; le code de l'application les écrit sans elle, sauf l'import de `../ficheId.mjs` dans `app/src/ui/ficheDialog.ts`, et la construction par Vite les accepte. `app/tests/resolve.mjs`, chargé par l'option `--import`, essaie `.ts`, puis `.js` (modules de Babylon.js), quand un import ne se trouve pas tel qu'il est écrit, par un crochet de résolution synchrone : `module.registerHooks`, ajouté à Node.js 22.15.0 ([« Modules: node:module API »](https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/module.md), source nodejs-22-module-hooks).
  - Types. Les tests sont vérifiés par `tsc -p tests` avant le lancement (`app/tests/tsconfig.json` : types de Node.js, et `erasableSyntaxOnly`, qui refuse, dans les tests et dans les modules qu'ils importent, ce que Node.js ne sait pas exécuter sans compilation). Dépendance de développement : [@types/node](https://www.npmjs.com/package/@types/node) 22.20.5, licence MIT, la dernière de la version majeure 22, celle du Node.js de la CI ; elle amène [undici-types](https://www.npmjs.com/package/undici-types) 6.21.0, licence MIT (registre npm, lu le 21 novembre 2026 ; textes de licence relus dans les deux paquets installés). Ni l'une ni l'autre n'est dans le site publié. Les types de Vite tirent ceux de Node.js : depuis que `@types/node` est installé, le code du navigateur aurait pu appeler `process` ou `node:fs` sans erreur de types (relecture de la version 0.3.86). `app/tsconfig.json` ne vérifie donc plus que `src/`, sans les types de Node.js ; les deux configurations de Vite passent par `app/tsconfig.node.json`, avec eux ; `npm run build` et `npm run typecheck` vérifient les deux.
  - Version de Node.js : `^22.23.5` (champ `engines` de `app/package.json`, `>=22` avant), la version 22 à partir de celle sur laquelle les tests ont tourné, sur la machine de Claude comme dans la CI. Dans la CI, `actions/setup-node` cherche d'abord dans le cache de la machine une version qui convienne à `node-version: "22"` ([README de setup-node](https://raw.githubusercontent.com/actions/setup-node/949feb2413d6458794dcd2491c4babbbce0c15c1/README.md), source actions-setup-node-readme) : 22.23.5 le 21 novembre 2026 (journal du job `app`). Avec une autre version, `npm ci` n'arrête rien : il écrit un avertissement `EBADENGINE`, et n'échoue qu'avec l'option `--engine-strict` (essayé avec npm 10.9.9). Les tests sur une autre version : non essayés. La plage exclut aussi Node.js 23.0 à 23.5, sur lesquels ils ne peuvent pas tourner : `module.registerHooks` n'y est ajouté qu'à 23.5.0 ([module.md de Node.js 23.5.0](https://raw.githubusercontent.com/nodejs/node/d8c3089cd5bf82fddd7939a1195631ea057261e2/doc/api/module.md), source nodejs-23-5-0-module-hooks), et le retrait des types n'y est fait par défaut que depuis 23.6.0 ([typescript.md de Node.js 23.6.0](https://raw.githubusercontent.com/nodejs/node/9fa6aeb4a6e54330f6c055a6dcfac265b150f902/doc/api/typescript.md), source nodejs-23-6-0-typescript) ; `>=22.23.5`, écrit d'abord, les admettait (relecture de la version 0.3.86).
  - Limites. Le retrait des types est « Release candidate », les crochets de `module.registerHooks` « Active development », l'option `--import` « Experimental » (sources nodejs-22-typescript, nodejs-22-module-hooks et nodejs-22-cli) : une version suivante de Node.js peut les changer. Le fichier de résolution n'essaie que ces deux extensions : un import de dossier (`index.ts`) ou un `.js` écrit pour un fichier `.ts` ne se trouve pas ; Vite 8.3.6 essaie d'abord `.mjs` et `.js`, puis `.mts` et `.ts` (`DEFAULT_EXTENSIONS`, dans son fichier `dist/node/chunks/node.js`) ; aucun import actuel de `app/src/` n'est dans ces cas. Des modules de `app/src/camera/`, `faces.ts` se charge aussi sans navigateur, mais le plan ne le nomme pas et il n'a pas de test ; `noise.ts`, `autofocus.ts` et `viewfinderDof.ts` ne se chargent pas (leurs classes ont des propriétés de paramètre, que Node.js refuse sans compilation), ni `photo.ts`, qui importe `noise.ts` : `noise.ts` attend le Sujet 27, qui sort les formules des fichiers de rendu. Les formules prises dans le rendu ou dans l'interface (`photo.ts`, `ui/balance.ts`) ne sont pas testées. Ces tests ne remplacent pas la routine, seule à voir le rendu, la page et les gestes.
- La CI des pull requests vérifie les types, construit le site et lance les tests rapides (`.github/workflows/validate.yml`, job `app`).

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
  - profondeur de champ du viseur au 135 mm à f/1.4 : netteté d'une zone de fond inférieure à 60 % de celle mesurée sans l'effet (depuis la version 0.3.22) ; depuis la version 0.3.59, les deux mesures se font appareil déplacé de 6 m vers la gauche par la vue de dessus, là où aucun personnage n'entre dans la zone mesurée ;
  - bruit du viseur à ISO 6400, et son absence quand l'aperçu est coupé ;
  - loupe du viseur à 100 % ;
  - photo calculée et non noire ;
  - loupe de l'écran de revue ; photo suivante ouverte en haut de l'écran de revue (depuis la version 0.3.59) ;
  - mise au point (depuis les versions 0.3.26 à 0.3.29) : verrou en AF-S, zone large, zone automatique (œil détecté, sujet le plus proche sans détection, œil du chien), suivi en AF-C.
- Mesures sur la scène : sur le serveur de développement seulement (`npm run dev`), `window.__tutophoto` donne la scène, la caméra et l'horloge, et charge le module de visée de Babylon (`Culling/ray`). Le site construit n'en contient rien. Il a servi le 9 novembre 2026 à placer les yeux des modèles sans squelette.
- Limites : Chromium seul, en rendu logiciel (SwiftShader). L'émulation ne reproduit ni le processeur graphique d'un téléphone ni le moteur Safari. Le chargement sans fin constaté le 9 novembre 2026 sur le téléphone de Julien ne s'est pas reproduit en émulation : un essai sur un vrai téléphone reste nécessaire.
