# Pile technique : comparaison des moteurs 3D

_Comparaison du 7 novembre 2026. **Décision de Julien, le même jour : option B, Babylon.js.** Constats tirés du code source de chaque moteur, à sa dernière version publiée, lu le même jour ; les sites de documentation n'étaient pas joignables depuis la session de travail, les dépôts publics l'étaient. Les deux effets qui ont fait choisir le moteur ne servent pas aujourd'hui : note du 23 novembre 2026, sous « Décision »._

Sections déplacées le 28 novembre 2026 (version 0.4.18) : l'outillage de l'application, avec la routine de test et ce que le simulateur demande au navigateur, est dans `docs/outillage.md`, page de référence tenue à jour. Un renvoi plus ancien à « Outillage de l'application », « Tests sur ordinateur et sur mobile », « Rendu en flottants : une exigence de l'appareil », « Contexte perdu au démarrage », « Contexte perdu pendant le chargement » ou « Affichage de diagnostic » de cette page vise la section du même nom de `docs/outillage.md` (pour « Outillage de l'application », la page entière, dont c'est le titre). Les quatre dernières étaient sous « Prise en charge des navigateurs », écrites après la comparaison.

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

- régler `lensSize` sur la focale pour une profondeur de champ physiquement juste : sans objet depuis la version 0.3.23, la profondeur de champ de Babylon.js ne servant plus (note du 23 novembre 2026, plus bas) ;
- relier `motionStrength` à la vitesse d'obturation : sans objet tant que le viseur reste sans flou de mouvement, un choix que la décision D32 (1) soumet à Julien (`docs/etat-des-travaux.md`, « Décisions en attente ») ; pour la photo et pour l'effet de Babylon.js, voir la même note ;
- calculer l'exposition (ouverture, vitesse, ISO) et le bruit du capteur ;
- mesurer les performances sur les téléphones des testeurs ;
- reprendre la licence Apache-2.0 et les mentions de `NOTICE.md` de Babylon.js dans la distribution.

Les trois autres points, au 23 novembre 2026 : l'exposition et le bruit sont calculés par TutoPhoto (`docs/camera-physique.md`) ; la licence et `NOTICE.md` de Babylon.js sont recopiés dans le site construit (`docs/licences.md`, « Code de tiers dans le site publié ») ; les performances sur un téléphone ne sont connues que par des mesures et des captures envoyées par Julien (`docs/historique.md`, 9 novembre 2026 ; essai T22 de `docs/tests-a-faire-faire.md`), et l'essai T21 relèvera celles du viseur (`docs/outillage.md`, « Affichage de diagnostic »).

Le 8 novembre 2026, Julien a choisi comment calculer la photo : des effets approchés dans le viseur, alors ceux de Babylon.js, et une photo exacte calculée au déclenchement par accumulation de rendus. Le 9 novembre 2026, il a choisi pour le viseur un flou en disque de taille physique, écrit pour TutoPhoto, à la place de l'effet de Babylon.js (version 0.3.23 ; `docs/historique.md`). Modèle et plan : `docs/camera-physique.md`.

**Note du 23 novembre 2026** (version 0.4.12 ; constat CHX-02 de l'audit, `docs/audit/choix-et-outils.md`, et sa contre-vérification). Les deux effets qui ont fait choisir Babylon.js, la profondeur de champ physique et le flou de mouvement par objet (« Options » et « Recommandation », écrites le 7 novembre et gardées telles quelles), ne servent pas :

- sa profondeur de champ (`DepthOfFieldEffect`, réglée par `lensSize`) n'a servi au viseur qu'à la version 0.3.22. Son cercle de confusion est calculé comme le dit le tableau des constats, mais l'effet mêle l'image nette et des images floutées de taille fixe, à proportion de ce cercle plafonné à 1 : le flou affiché n'a ni la taille physique ni la forme de l'ouverture (`docs/camera-physique.md`, « Ce que fait Babylon.js 9.35.0 » et « Profondeur de champ du viseur »). Depuis la version 0.3.23, le viseur a un flou en disque écrit pour TutoPhoto (`app/src/camera/viewfinderDof.ts`) ;
- son flou de mouvement par objet (`motionBlurPostProcess`, intensité `motionStrength`) n'a jamais servi : aucun commit de `main` ne le nomme dans `app/` (`git log -S`, le 23 novembre 2026). Le viseur ne montre pas de flou de mouvement, un choix de TutoPhoto que la décision D32 (1) soumet à Julien (`docs/camera-physique.md`, « Flou de mouvement et de bougé ») ; la photo a le sien, comme sa profondeur de champ, par l'accumulation de rendus écrite pour TutoPhoto, chaque rendu à un instant du temps de pose (`app/src/camera/photo.ts`).

Le 23 novembre 2026, rien dans `app/src/` n'importe l'un ou l'autre effet : une recherche de `DepthOfField`, `MotionBlur`, `CircleOfConfusion`, `lensSize` et `motionStrength` n'y trouve que des noms de TutoPhoto (la classe `ViewfinderDepthOfField`, les clés, les textes et les méthodes de son aperçu), et aucun import de Babylon.js.

Ce que Babylon.js fournit aujourd'hui, d'après les imports de `app/src/` (13 de ses 32 fichiers `.ts`, 5 256 lignes sur 8 293, certains imports pour ses types seulement, le 23 novembre 2026) :

- le moteur WebGL et ses mesures (`Engine` ; horodatages du processeur graphique et `EngineInstrumentation`, pour l'affichage de diagnostic) ;
- les vecteurs, les matrices et les couleurs (`Vector3`, `Matrix`, `Color3`) ;
- la scène, ses nœuds, ses observables, les animations des modèles et son traitement d'image (`imageProcessingConfiguration`), qui applique l'exposition du viseur (`app/src/ui/cameraPanel.ts`) ;
- la caméra (`UniversalCamera`) et sa commande au toucher ;
- les textures, les cibles de rendu et la carte de profondeur (`DepthRenderer`), que lisent l'autofocus, l'aperçu de la profondeur de champ du viseur et la photo ;
- le cadre des post-traitements et du rendu en plein écran, dont TutoPhoto écrit les shaders : bruit, flou du viseur, accumulation de la photo (`PostProcess`, `PassPostProcess`, `EffectRenderer`, `ShaderStore`) ;
- le fond et l'éclairage de la scène de parc (`PhotoDome`, `HDRCubeTexture`), le sol invisible qui reçoit les ombres (`BackgroundMaterial`), une lumière directionnelle et ses ombres (`ShadowGenerator`) ;
- le chargement des modèles glTF (`ImportMeshAsync`, `@babylonjs/loaders`).

Pourquoi on le garde : c'est le choix de Julien, que l'audit ne rouvre pas (CHX-02 recommande de corriger cette page, pas de changer de moteur). Changer de moteur a un coût certain, les 13 fichiers qui l'importent à reprendre et toute la routine de test à repasser, pour un gain qui n'est pas établi : ce que pèserait et coûterait la même application sur un autre moteur n'est pas mesuré (`docs/audit/choix-et-outils.md`, « Je ne sais pas »), et rien ne dit qu'une accumulation de rendus s'écrirait mieux ailleurs (même constat) ; Claude n'a rien lu qui le dise non plus du flou du viseur ni du bruit, écrits eux aussi pour TutoPhoto. Des limites du moteur relevées dans le dépôt sont traitées par le code, par exemple ses shaders chargés à la demande (un seul fichier JavaScript depuis la version 0.3.25, `docs/outillage.md`, « Construction »), ses textures en flottants créées sans vérifier qu'il peut y rendre (`docs/outillage.md`, « Rendu en flottants : une exigence de l'appareil », version 0.3.88) et son démarrage sur un contexte perdu (`docs/outillage.md`, « Contexte perdu au démarrage », version 0.4.4) ; d'autres ne le sont pas, comme la projection du sol de la photo à 360°, sans effet avec `PhotoDome` (`docs/etat-des-travaux.md`, « Défauts connus, hors du plan »). La question se reposera si la refonte de la chaîne d'image (Sujet 40, constat ARC-01) bute sur une limite du moteur.

## Recommandation (avant décision)

Option B, Babylon.js, pour la V1 minimale. C'est la seule qui couvre d'origine les deux effets clés de la tranche de parc, profondeur de champ physique et flou de mouvement, sur tous les navigateurs du tableau. Le risque principal, les performances sur téléphone, se mesure dès la preuve du moteur sur la scène de parc. La voie C reste une piste pour une photo de meilleure qualité, si WebGPU se généralise.
