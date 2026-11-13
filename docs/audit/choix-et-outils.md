# Audit du lot « Choix de fond, données, documentation, déroulé d'une version et outils »

État : constats non contre-vérifiés

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ». Le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : `main` à la version 0.3.57 (commit de fusion `8a0c894`), et la copie de travail de la version 0.3.58 en cours pour `CLAUDE.md`, `CHANGELOG.md` et `docs/etat-des-travaux.md`. Les numéros de ligne sont ceux de la copie de travail.
- Rapport écrit par un agent de Claude. Il juge les choix et l'organisation, pas la structure du code (`docs/audit/architecture-application.md`, constats ARC, cités quand ils touchent le même sujet).
- Rapport en cours d'écriture : les sections se remplissent au fur et à mesure. Ce qui n'est pas encore couvert est dit dans « Ce qui n'est pas couvert ».

## Périmètre

- Choix de fond : `docs/cadrage.md`, `docs/pile-technique.md`, `docs/architecture.md`, `docs/propositions.md`, confrontés à `docs/historique.md` (qui a tranché quoi) et au code.
- Organisation des données : `data/`, `schemas/`, `content/`, `app/src/i18n.ts`, `app/scripts/build-pages.mjs`, `scripts/validate.py`, `scripts/coverage.py`, `scripts/referentiel.py`.
- Organisation de la documentation : `docs/`, `README.md`, `README.en.md`, `CHANGELOG.md`, `CLAUDE.md`, `REPRISE.md`.
- Déroulé d'une version : `CLAUDE.md`, l. 28-42 ; `scripts/changelog.py` ; les 64 pull requests du dépôt.
- CI et outils : `.github/workflows/`, `app/package.json`, `app/package-lock.json`, `requirements.txt`.
- Hors du lot : le périmètre du référentiel (`docs/audit/referentiel-structure.md`), les erreurs de fait de la documentation (`docs/audit/documentation.md`), les licences (`docs/audit/licences-scripts-ci.md`), la structure du code (`docs/audit/architecture-application.md`).

## Méthode

1. Lecture complète des pages du périmètre, de `CLAUDE.md`, des cinq workflows et des scripts de `scripts/`.
2. Mesures dans git, par script : fichiers et lignes touchés par chacun des 63 commits de fusion de `main` (`git diff --numstat <fusion>^1 <fusion>`), répétitions d'un même fait d'une page à l'autre, poids du dépôt.
3. Mesures dans GitHub, par son API publique, le 13 novembre 2026 : les 447 passages de workflows du dépôt et leurs durées, les jobs des dix passages de la routine, les 64 pull requests, la protection de `main`.
4. Sources relues à leur adresse quand l'hôte répond : fichiers des moteurs 3D comparés, aux étiquettes citées ; données de compatibilité de MDN ; page des limites de GitHub Pages dans le dépôt `github/docs` ; registres npm et PyPI ; calendrier des versions de Node.js.
5. Doublons entre `data/`, `content/` et `app/` cherchés par script (titres, adresses des sources, identifiants).
6. Aucun navigateur, aucune construction du site : les mesures du site construit sont celles de `docs/audit/architecture-application.md`.

Scripts, pages enregistrées et réponses de l'API : dossier `audit/choix-et-outils/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`).

## Sources

Toutes lues le 13 novembre 2026.

### Relues

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| three.js, étiquette `r187` : `examples/jsm/tsl/display/DepthOfFieldNode.js`, `examples/jsm/shaders/BokehShader2.js`, `examples/jsm/tsl/display/MotionBlur.js` | `raw.githubusercontent.com/mrdoob/three.js/r187/…` | `three-r187-*.js` |
| Babylon.js, étiquette `9.35.0` : `packages/dev/core/src/PostProcesses/thinCircleOfConfusionPostProcess.ts`, `thinMotionBlurPostProcess.ts`, `NOTICE.md` | `raw.githubusercontent.com/BabylonJS/Babylon.js/9.35.0/…` | `babylon-9.35.0-*` |
| Babylon.js, paquet `@babylonjs/core` 9.35.0 : `Shaders/circleOfConfusion.fragment.js` | `app/node_modules/@babylonjs/core/` | (dans le dépôt de travail) |
| PlayCanvas, étiquette `v2.23.3` : `src/extras/render-passes/camera-frame.js` | `raw.githubusercontent.com/playcanvas/engine/v2.23.3/…` | `playcanvas-2.23.3-camera-frame.js` |
| three-gpu-pathtracer, étiquette `v0.0.28` : `README.md`, `src/objects/PhysicalCamera.js`, `package.json` | `raw.githubusercontent.com/gkjohnson/three-gpu-pathtracer/v0.0.28/…` | `pathtracer-0.0.28-*` |
| MDN, `browser-compat-data`, étiquette `v8.1.8` : `api/GPU.json`, `api/WebGL2RenderingContext.json` | `raw.githubusercontent.com/mdn/browser-compat-data/v8.1.8/…` | `mdn-8.1.8-*.json` |
| GitHub, « GitHub Pages limits », source de la page dans le dépôt `github/docs`, commit `8cd1075` | `raw.githubusercontent.com/github/docs/8cd1075/content/pages/getting-started-with-github-pages/github-pages-limits.md` | `ghdocs-8cd1075-pages-limits.md` |
| Registre npm : `vite`, `typescript`, `@babylonjs/core`, `@babylonjs/loaders`, `babylonjs-gltf2interface`, `playwright`, `three`, `playcanvas`, `three-gpu-pathtracer` (versions, dates de publication, licences) | `registry.npmjs.org/<paquet>` | `npm-*.json` |
| Registre PyPI : `PyYAML`, `jsonschema` | `pypi.org/pypi/<paquet>/json` | `pypi-*.json` |
| Node.js, calendrier des versions (`schedule.json` du dépôt `nodejs/Release`, branche `main`) et liste des versions publiées | `raw.githubusercontent.com/nodejs/Release/main/schedule.json`, `nodejs.org/dist/index.json` | `node-release-schedule.json`, `node-dist-index.json` |
| GitHub, API du dépôt TutoPhoto : dépôt, branche `main`, règles, branches, pull requests, passages des workflows et leurs jobs | `api.github.com/repos/Badmiaoo/TutoPhoto/…` | `gh-*.json` |

### Non relues

- Site publié (`badmiaoo.github.io`) : source non relue, hôte non joignable. Rien de ce rapport ne repose sur une lecture du site en ligne.
- Documentation de GitHub à son adresse (`docs.github.com`) : hôte non joignable ; la page des limites de GitHub Pages est lue dans sa source (`github/docs`), comme l'avait fait le modèle précédent.
- Pages des dépôts sur `github.com` (arborescences aux étiquettes citées par `docs/pile-technique.md`) : l'hôte répond 403 ; les fichiers sont lus par `raw.githubusercontent.com`. L'empreinte du commit de chaque étiquette (`7e89746`, `00bc37c`, `b7655d8`, `80d1888`, `29768a4`) n'est pas vérifiée : l'API de GitHub ne répond pas pour ces dépôts depuis la session.
- Documentation de Babylon.js (`doc.babylonjs.com`) et `caniuse.com` : hôtes non joignables.

## Ce qui n'est pas couvert

À compléter en fin de rapport.

## Hypothèse de Claude : verdict

Hypothèse 6, « la documentation se recouvre et chaque version touche six fichiers » : **confirmée, avec une précision**. Sur les dix dernières versions (0.3.48 à 0.3.57), une version touche de 4 à 11 fichiers de documentation, 5,9 en moyenne et 4,5 en médiane ; aucune n'en touche moins de quatre. Le recouvrement est mesuré : le même fait d'une version s'écrit dans deux à huit pages. Détail et voies : CHX-01.

## Constats

### CHX-01 · à améliorer · Le récit de chaque version s'écrit dans quatre à onze fichiers, et trois journaux se recouvrent

- Endroit : `CLAUDE.md`, l. 34-35 ; `CHANGELOG.md` ; `docs/historique.md` ; `docs/questions-ouvertes.md`, l. 20-65 ; `docs/etat-des-travaux.md` ; `docs/pile-technique.md`, l. 98-111 ; `README.md`, l. 9-13 ; `README.en.md`, l. 9-13.
- Mesure 1, fichiers de documentation touchés par version (`CHANGELOG.md`, `README.md`, `README.en.md`, `CLAUDE.md` et `docs/`), d'après `git diff --numstat` de chaque commit de fusion.

  | Version | Pull request | Fichiers de documentation | Lignes de documentation changées, sur le total de la version |
  | --- | --- | --- | --- |
  | 0.3.48 | 54 | 5 | 102 sur 116 |
  | 0.3.49 | 55 | 4 | 37 sur 37 |
  | 0.3.50 | 56 | 6 | 29 sur 565 |
  | 0.3.51 | 57 | 4 | 26 sur 298 |
  | 0.3.52 | 58 | 4 | 16 sur 41 |
  | 0.3.53 | 59 | 4 | 19 sur 42 |
  | 0.3.54 | 60 | 8 | 1 366 sur 1 483 (dont 1 264 pour trois dossiers de sources) |
  | 0.3.55 | 61 | 4 | 23 sur 47 |
  | 0.3.56 | 62 | 9 | 222 sur 692 |
  | 0.3.57 | 63 | 11 | 693 sur 1 534 |

  Moyenne 5,9 ; médiane 4,5 ; de 4 à 11. Sur les 63 fusions du dépôt : moyenne 5,0 ; médiane 5 ; de 1 à 11.
- Mesure 2, les fichiers qui reviennent. Sur ces dix versions : `CHANGELOG.md` 10 fois, `docs/historique.md` 10, `docs/questions-ouvertes.md` 8, `docs/pile-technique.md` 6, `docs/propositions.md` 5, `docs/etat-des-travaux.md` 4 (les quatre versions depuis sa création), `README.md` 3. Sur les 63 fusions : `CHANGELOG.md` 63, `docs/historique.md` 52, `docs/questions-ouvertes.md` 41, `README.md` 33, `docs/camera-physique.md` 31, `README.en.md` 18, `CLAUDE.md` 18, `docs/pile-technique.md` 15.
- Mesure 3, le même fait écrit plusieurs fois. Version 0.3.53 (densité du viseur plafonnée à 2) : le fait, sa raison et la citation de Julien sont écrits dans quatre fichiers par la même pull request.
  - `CHANGELOG.md` : « Densité du viseur plafonnée à 2 (demande de Julien du 11 novembre 2026 : la version 0.3.52 est « beaucoup moins pixelsé », mais saccadée sur son téléphone). »
  - `docs/historique.md`, l. 198 : « Julien trouve la 0.3.52 « beaucoup moins pixelsé », mais saccadée sur son téléphone, et demande la solution intermédiaire : densité plafonnée à 2 ».
  - `docs/pile-technique.md`, l. 105-106 : « Julien l'a trouvé « beaucoup moins pixelsé », mais saccadé sur son téléphone ; version 0.3.53, à sa demande : densité plafonnée à 2 ».
  - `docs/questions-ouvertes.md`, l. 50 : « plus net mais saccadé sur le téléphone de Julien. Version 0.3.53 : densité plafonnée à 2 (4 fois plus de pixels) ».

  Nombre de fichiers Markdown de `main` (hors `docs/audit/`) qui nomment chaque version : 0.3.48 et 0.3.49, 2 ; 0.3.50, 6 ; 0.3.51, 4 ; 0.3.52 à 0.3.54, 5 ; 0.3.55, 4 ; 0.3.56 et 0.3.57, 8.
- Ce que cela montre : trois journaux tiennent le même fil. `CHANGELOG.md` (953 lignes, 71 867 octets en sept jours) dit ce qui a changé, version par version. `docs/historique.md`, annoncé comme l'historique « des décisions », reçoit une ligne par version (52 fusions sur 63), décision de Julien ou non : « Version 0.3.55 : en cherchant la cause d'un échec isolé de la routine de test, Claude constate que… » (l. 201). `docs/etat-des-travaux.md`, depuis la version 0.3.54, redit l'état et la file. À côté, deux pages de référence accumulent le récit des versions au lieu de dire l'état : `docs/questions-ouvertes.md` (« Points à surveiller », l. 20-65, où un point clos garde tout son récit, par exemple l. 59-61) et `docs/pile-technique.md` (« Organisation du site », l. 98-111).
- Ce que cela coûte, mesuré dans le dépôt : des pages qui ne suivent plus.
  - `README.md`, l. 9 : « État au 8 novembre 2026 », au-dessus d'un paragraphe qui décrit la version 0.3.57 du 12 novembre ; l. 11 : « 96 sources », alors que `data/sources.yaml` en compte 172 (`python3 scripts/validate.py`).
  - `README.en.md` : dernière modification le 9 novembre 2026 (commit `3f1822b`) ; il écrit encore « No written content yet: coverage 0 of 191 », alors que 22 fiches existent en anglais et que la couverture est de 13 sur 191.
  - `docs/etat-des-travaux.md` a deux sections « Où on en est » (l. 15 et l. 53) et deux files de travail (l. 26 et l. 59) : le point du 13 novembre a été ajouté au-dessus de l'ancien, avec la mention « Ce point prime sur l'ordre de la file plus bas » (l. 5).
  - La liste des contrôles de la routine dans `docs/pile-technique.md` s'arrête à la version 0.3.29 (constat ARC-09).
- Ce que cela coûtera : `CLAUDE.md`, l. 35-37, fait de `docs/etat-des-travaux.md` le point de départ de chaque session neuve, et la section « Comment reprendre » (l. 100) demande de lire aussi `docs/propositions.md` et `docs/questions-ouvertes.md` : avec `CLAUDE.md`, 59 524 octets à lire avant de commencer, qui grossissent à chaque version puisque rien n'en sort.
- Voies.
  - A. Ne rien faire. Coût : quatre fichiers au moins par version, des pages en retard (les quatre exemples ci-dessus), une reprise de plus en plus longue à lire.
  - B. Une information, un endroit. `CHANGELOG.md` reste le seul récit par version (il est déjà obligatoire et contrôlé par la CI). `docs/historique.md` ne reçoit que les décisions de Julien, datées et citées. `docs/etat-des-travaux.md` est réécrit à chaque version, pas complété : état, file, ce qui attend Julien, sans récit. `docs/questions-ouvertes.md` ne garde que ce qui est ouvert ; un point clos en sort. `docs/pile-technique.md` est coupé en deux : la comparaison des moteurs, figée à sa date, et une page de référence de l'outillage, sans récit. `README.md` et `README.en.md` perdent leur inventaire des fonctions, remplacé par un lien vers le site et vers `CHANGELOG.md`. Coût : deux pull requests de documentation ; une table « quelle page pour quelle information » dans `CLAUDE.md`. Risque : perdre une information en élaguant ; l'historique de git la garde.
  - C. Produire les pages d'état par script (comptes du README d'après `scripts/coverage.py`, historique d'après le changelog). Coût : un outil de plus à entretenir, pour un dépôt de cette taille.
- Recommandation : B. Le détail page par page revient au rapport `docs/audit/documentation.md` ; ce constat fixe la règle et la mesure.

### CHX-02 · incohérent · Les deux effets qui ont fait choisir Babylon.js ne servent plus, et `docs/pile-technique.md` dit encore le contraire

- Endroit : `docs/pile-technique.md`, l. 21, 56, 75-78 et 117 ; `docs/historique.md`, l. 73 ; `docs/camera-physique.md`, l. 41-45 et 268-270 ; `app/src/` (imports).
- Ce qui est écrit, comme raison du choix du 7 novembre 2026 : « le seul des moteurs temps réel lus qui fournit à la fois une profondeur de champ physique (ouverture, focale, distance) et un flou de mouvement par objet » (`docs/pile-technique.md`, l. 56) ; « C'est la seule qui couvre d'origine les deux effets clés de la tranche de parc » (l. 117). La section « Décision » garde comme points à traiter « régler `lensSize` sur la focale » et « relier `motionStrength` à la vitesse d'obturation » (l. 77-78).
- Preuve (code) : aucun des deux effets n'est importé. `grep` de `DepthOfField`, `MotionBlur`, `CircleOfConfusion`, `lensSize` et `motionStrength` dans `app/src/` : seule la classe `ViewfinderDepthOfField` de TutoPhoto répond (`app/src/camera/viewfinderDof.ts`, l. 128). Les 28 chemins importés de `@babylonjs/core` sont le moteur, la scène, la caméra, les textures et cibles de rendu, le rendu de profondeur, les post-traitements à shader écrit par TutoPhoto (`PostProcess`, `EffectRenderer`, `ShaderStore`), le fond (`PhotoDome`, `HDRCubeTexture`, `BackgroundMaterial`), une lumière et ses ombres, le chargement glTF.
- Preuve (documentation du dépôt) : dès le 8 novembre, `docs/camera-physique.md`, l. 43, écrit de la profondeur de champ de Babylon.js : « Le résultat est ensuite plafonné à 1 et sert de fraction d'un flou maximal fixe […] : le passage en pixels n'est pas physique, et le flou n'a pas la forme de l'ouverture. » L'effet est essayé en version 0.3.22, puis remplacé en version 0.3.23 par « un flou en disque de taille physique, écrit pour TutoPhoto », sur décision de Julien du 9 novembre (l. 268-270). La photo est calculée par accumulation de rendus, écrite pour TutoPhoto (décision de Julien du 8 novembre, `docs/historique.md`, l. 118) ; le viseur n'a pas de flou de mouvement (`docs/camera-physique.md`, l. 76).
- Preuve (source relue) : le tableau de `docs/pile-technique.md` est juste sur ce qu'il a lu. `thinCircleOfConfusionPostProcess.ts`, étiquette `9.35.0`, l. 107-108 : `const aperture = this.lensSize / this.fStop;` puis `const cocPrecalculation = (aperture * this.focalLength) / (this.focusDistance - this.focalLength);`. Mais le plafond est dans un autre fichier, que la comparaison du 7 novembre ne cite pas : `Shaders/circleOfConfusion.fragment.js` du paquet 9.35.0, l. 19 : `coc=clamp(coc,0.0,1.0)`. Le mot « physique » de la l. 21 vaut pour le calcul du cercle de confusion, pas pour le flou affiché.
- Ce que cela coûte : rien dans l'application. Dans la documentation, la page qui justifie le moteur donne une raison qui n'a tenu que deux jours, et laisse croire que la profondeur de champ et le flou de mouvement viennent de Babylon.js. La question « pourquoi ce moteur » n'a plus de réponse écrite qui soit vraie.
- Voies.
  - A. Ne rien faire.
  - B. Corriger la page : sous « Décision », une note datée qui dit que les deux effets ne servent plus depuis la version 0.3.23, ce que Babylon.js fournit aujourd'hui (la liste ci-dessus), et pourquoi on le garde ; retirer les deux points à traiter devenus sans objet. Coût : une pull request de documentation, à faire avec le découpage de la page proposé par CHX-01.
  - C. Rouvrir le choix du moteur (three.js, sous licence MIT, sans `NOTICE.md` à recopier). Coût certain : douze fichiers de `app/src/` importent Babylon.js, 4 456 lignes sur 6 292, et toute la routine de test est à repasser. Gain : je ne sais pas. Aucune page lue n'attribue un défaut de l'application à Babylon.js qui ne soit déjà contourné (un seul fichier JavaScript depuis la version 0.3.25, chargement qui n'attend plus le shader du bruit depuis la version 0.3.18), et rien ne dit qu'une accumulation de rendus s'écrirait mieux ailleurs.
- Recommandation : B. Pas C : le coût est certain et le gain n'est pas établi. Si la refonte de la chaîne d'image (ARC-01) butait sur une limite du moteur, la question se reposerait alors, avec la limite sous les yeux.

### CHX-03 · à améliorer · Rien, dans GitHub, n'empêche de pousser sur `main` ni de fusionner avec une CI rouge : la règle ne tient que par `CLAUDE.md`

- Endroit : `CLAUDE.md`, l. 29 et 33 ; `docs/historique.md`, l. 90 ; `README.md`, l. 54 ; réglages du dépôt sur GitHub.
- Ce qui est écrit : « Jamais de push sur `main` » (`CLAUDE.md`, l. 29) ; « Claude fusionne lui-même ses pull requests quand la CI est verte sur le dernier commit » (l. 33) ; « Les réglages de GitHub hors de portée des outils de Claude (protection de `main`, options de sécurité, Pages) restent faits par Julien, sur indication de Claude » (`docs/historique.md`, l. 90).
- Preuve (API de GitHub, 13 novembre 2026) : `GET /repos/Badmiaoo/TutoPhoto/branches/main` répond `"protected": false`, avec `"required_status_checks": {"enforcement_level": "off", "contexts": [], "checks": []}` ; `GET …/rulesets` et `GET …/rules/branches/main` répondent des listes vides. Aucune page du dépôt ne dit que la protection a été demandée à Julien, ni qu'elle a été écartée (`grep` de « protection » : la seule mention est la phrase citée de `docs/historique.md`).
- Ce qui est juste : la règle a été tenue. Un seul commit a été poussé sur `main` hors d'une fusion, le premier (`e89680d`, « Ajoute REPRISE.md », le cas dit par `docs/historique.md`, l. 42). Pour chacune des 63 pull requests fusionnées, le dernier passage de chaque workflow sur le commit de tête est un succès (recoupement des 447 passages et des 64 pull requests).
- Ce que cela coûte : rien jusqu'ici. Ce que cela coûtera : la CI est décrite comme ce qui protège le dépôt public (`docs/publication.md`, « Contrôles »), mais elle ne bloque rien ; une fusion faite trop tôt, une session qui se trompe de branche ou un contributeur extérieur avec les droits d'écriture publient aussitôt le site (`pages.yml`) et posent un tag (`tag.yml`), sans contrôle.
- Voies.
  - A. Ne rien faire, la discipline suffit. Risque : celui ci-dessus, faible tant que Claude est seul à écrire.
  - B. Julien active une règle de branche sur `main` : pull request obligatoire, et contrôles requis `validate`, `confidentialite`, `app` et `description`. Chemin dans l'interface : Settings, puis Rules, puis Rulesets, puis New branch ruleset (je n'ai pas pu relire la documentation de GitHub, hôte non joignable : chemin à vérifier à l'écran). Coût : dix minutes de Julien. Les quatre jobs de la routine ne peuvent pas être requis tels quels : `routine.yml` ne se lance que si la pull request touche `app/`, `content/`, `data/` ou la routine (l. 8-13), et un contrôle requis qui ne se lance pas bloque la fusion ; je n'ai pas relu la page de GitHub qui le dit, à vérifier avant de les ajouter.
  - C. B, plus un job final dans `routine.yml` qui se lance toujours et résume les quatre profils, pour pouvoir le requérir. Coût : une pull request sur le workflow.
- Recommandation : B maintenant ; C avec la refonte des tests (ARC-05).

## Vérifié

À compléter.

## Je ne sais pas

À compléter.

## Ce qui est bien fait et doit rester

À compléter.

## Plan

À compléter.
