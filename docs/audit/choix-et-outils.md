# Audit du lot « Choix de fond, données, documentation, déroulé d'une version et outils »

État : constats non contre-vérifiés

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ». Le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : `main` à la version 0.3.57 (commit de fusion `8a0c894`), et la copie de travail de la version 0.3.58 en cours pour `CLAUDE.md`, `CHANGELOG.md` et `docs/etat-des-travaux.md`. Les numéros de ligne sont ceux de la copie de travail.
- Rapport écrit par un agent de Claude. Il juge les choix et l'organisation, pas la structure du code (`docs/audit/architecture-application.md`, constats ARC, cités quand ils touchent le même sujet).
- Bilan : 11 constats (3 « incohérent », 8 « à améliorer », aucun « faux » ni « non sourcé »), 30 points vérifiés et justes, 12 « Je ne sais pas », 4 questions à poser à Julien. L'hypothèse 6 de Claude est confirmée. Les choix de fond ont presque tous une décision de Julien, datée et écrite, et leurs sources relues disent ce que la documentation leur fait dire. Les défauts sont ailleurs : la raison écrite du choix du moteur ne vaut plus (CHX-02) ; une règle de `CLAUDE.md` a été levée sur une lecture de Claude (CHX-04) ; le récit de chaque version s'écrit quatre fois au moins (CHX-01) ; ce qui attend Julien n'est réuni nulle part (CHX-10) ; rien, dans GitHub, ne fait respecter les règles du dépôt (CHX-03). Le projet produit plus vite qu'il ne valide : 63 versions en sept jours, aucune fiche relue, aucun test avec des débutants.

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
| GitHub, API du dépôt TutoPhoto : dépôt, branche `main`, règles, branches, pull requests, releases, passages des workflows, leurs jobs et leurs annotations | `api.github.com/repos/Badmiaoo/TutoPhoto/…` | `gh-*.json` |
| three.js, étiquette `r187` : `src/renderers/webgpu/WebGPURenderer.js` | `raw.githubusercontent.com/mrdoob/three.js/r187/…` | `three-r187-WebGPURenderer.js` |
| GitHub, source de la documentation, dépôt `github/docs`, commit `8cd1075` : `data/reusables/gated-features/pages.md`, `content/billing/concepts/product-billing/github-actions.md`, `content/actions/reference/workflows-and-actions/events-that-trigger-workflows.md`, `data/reusables/actions/workflows/skipped-job-status-checks-passing.md`, `data/reusables/pull_requests/path-filtering-required-workflows.md` | `raw.githubusercontent.com/github/docs/8cd1075/…` | `ghdocs-*.md` |
| Étiquettes des dépôts cités (moteurs 3D, données de MDN, cinq actions, gitleaks) et du dépôt TutoPhoto | `git ls-remote` sur `github.com` | (sortie de la commande, non enregistrée) |
| gitleaks 8.30.1, empreintes de la release | `github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_checksums.txt` | `gitleaks-checksums.txt` |
| Vite, journal des versions (branche `main`) | `raw.githubusercontent.com/vitejs/vite/main/packages/vite/CHANGELOG.md` | `vite-CHANGELOG.md` |
| Registre npm : `yaml` (pour une voie de CHX-05) | `registry.npmjs.org/yaml` | `npm-yaml.json` |

### Non relues

- Site publié (`badmiaoo.github.io`) : source non relue, hôte non joignable. Rien de ce rapport ne repose sur une lecture du site en ligne.
- Documentation de GitHub à son adresse (`docs.github.com`) : hôte non joignable ; les pages sont lues dans leur source (`github/docs`, commit `8cd1075`, celui que cite le dépôt), comme l'avait fait le modèle précédent. Ces sources contiennent des variables de gabarit (`{% data … %}`) : les citations de ce rapport sont prises dans des phrases sans variable, ou la variable est remplacée par le nom du produit.
- Pages des dépôts sur `github.com` (arborescences aux étiquettes citées par `docs/pile-technique.md`) : l'hôte répond 403 aux lectures de pages ; les fichiers sont lus par `raw.githubusercontent.com` et les étiquettes par `git ls-remote`.
- Documentation de Babylon.js (`doc.babylonjs.com`) et `caniuse.com` : hôtes non joignables.

## Ce qui n'est pas couvert

- `REPRISE.md` (3 554 lignes) n'est pas relu : seuls son rôle et ses blocs de données sont examinés (CHX-06).
- Le contenu des trois dossiers de sources (`docs/dossiers/`, 1 268 lignes) et des trois spécifications (`docs/specifications/`) n'est pas relu : seul leur rôle l'est.
- `docs/camera-physique.md` n'est examiné que pour ce qu'il dit des choix (boîtiers, effets de Babylon.js) ; son organisation relève de `docs/audit/documentation.md`.
- Les scripts ne sont pas relus ligne à ligne (`docs/audit/licences-scripts-ci.md`), ni les sections de `CHANGELOG.md` une à une, ni les schémas de `schemas/`.
- Aucune mesure dans un navigateur ni sur le site publié.

## Hypothèse de Claude : verdict

Hypothèse 6, « la documentation se recouvre et chaque version touche six fichiers » : **confirmée, avec une précision**. Sur les dix dernières versions (0.3.48 à 0.3.57), une version touche de 4 à 11 fichiers de documentation, 5,9 en moyenne et 4,5 en médiane ; aucune n'en touche moins de quatre. Le recouvrement est mesuré : le même fait d'une version s'écrit dans deux à huit pages. Détail et voies : CHX-01.

## Constats

Classés du plus grave au moins grave : d'abord les trois « incohérent », puis les huit « à améliorer », par coût décroissant. Les identifiants suivent l'ordre d'écriture et ne sont pas renumérotés.

### CHX-04 · incohérent · `CLAUDE.md` interdit d'étendre avant les tests avec des débutants ; deux versions ont étendu, sur une lecture de Claude que Julien n'a pas confirmée par écrit

- Endroit : `CLAUDE.md`, l. 40 ; `docs/questions-ouvertes.md`, l. 83 ; `docs/propositions.md`, l. 5, 53-57 et 71 ; `docs/historique.md`, l. 199 ; `docs/etat-des-travaux.md`, l. 28-35, 48 et 108-114.
- Ce qui est écrit : « Pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants. » (`CLAUDE.md`, l. 40) ; « On n'étend au-delà de la V1 minimale qu'après l'avoir testée avec des débutants. » (`docs/questions-ouvertes.md`, l. 83) ; et la décision de Julien du 11 novembre au soir : « pour étendre, **tous** les testeurs doivent réussir chaque défi sans aide et mieux répondre après qu'avant » (`docs/propositions.md`, l. 5).
- Ce qui est fait : quelques heures après, Julien écrit « Si jamais tu te retrouves sans plus rien a faire termine la v1. Et si jamais tu l'as terminé alors commence la v2. » et « vas aussi loins que possible ». La suite est une lecture : « Claude le comprend comme la levée, par Julien, de l'attente des tests avec les débutants avant d'étendre » (`docs/historique.md`, l. 199) ; « l'attente des tests […] est levée par cette demande » (`docs/etat-des-travaux.md`, l. 48). Les versions 0.3.56 (grilles, CMP-02) et 0.3.57 (histogrammes, MES-06 et MES-07, hors du jalon `v1-min` de `data/jalons.yaml`) étendent le simulateur. Le nouvel ordre de travail (`docs/etat-des-travaux.md`, l. 28-35) enchaîne l'audit, les corrections, puis les « Nouvelles fonctions » ; les tests avec cinq débutants ne sont plus qu'une ligne de « Ce qui attend Julien » (l. 114).
- Ce qui est juste : Julien a vu la première extension avant sa fusion, en a tranché les sept choix le 12 novembre et a ajouté CMP-02 au jalon (`docs/propositions.md`, l. 94-104) : il n'a pas refusé d'étendre. Mais aucune phrase de lui ne lève la règle, et elle est toujours dans `CLAUDE.md`.
- Ce que cela coûte.
  - Une session neuve lit deux consignes contraires : `CLAUDE.md`, qui prime, interdit ; `docs/etat-des-travaux.md`, qu'elle lit ensuite, dit la règle levée.
  - Sur le fond : après 63 versions, aucune des validations prévues n'a eu lieu. `data/relecture.yaml` : `relues: []`, soit 44 pages de fiches publiées avec le bandeau « en cours de relecture » ; tests avec les débutants à faire (`docs/etat-des-travaux.md`, l. 114) ; version 0.3.53 à juger sur téléphone (l. 110) ; onze choix de la version 0.3.57 à confirmer (`docs/propositions.md`, section 4). Les trois premiers rapports de l'audit ont confirmé 59 constats sur ce travail que personne n'avait relu (20 pour le modèle physique, 18 et 21 pour les fiches). Ce qui limite le projet aujourd'hui est la validation, pas la production.
- Voies.
  - A. Ne rien faire : la contradiction reste, et chaque session la tranchera à sa façon.
  - B. Poser la question à Julien et écrire sa réponse dans `CLAUDE.md` : soit la règle tient (après les corrections de l'audit, aucune fonction nouvelle avant les tests), soit elle est levée (la retirer de `CLAUDE.md` et de `docs/questions-ouvertes.md`, et dire ce qui la remplace).
  - C. Garder l'extension, mais plafonner ce qui attend une validation : par exemple, pas de fonction nouvelle tant que des choix de la version précédente ne sont pas confirmés.
- Recommandation : B. C'est une décision de Julien ; elle est reprise dans « Questions à poser à Julien ».

**Contre-vérification : réfuté.** Hors de la période auditée, et exagéré ; ce qui reste est une question à Julien, pas une faute du travail antérieur. Tous les faits reprochés datent du 12 novembre 2026 ou d'après : la lecture de la levée est écrite par le commit `66cb9b3` (11 novembre, 23 h 21 UTC, soit le 12 à 0 h 21 à Paris) et publiée le 12 avec la version 0.3.54, que les autres rapports tiennent pour hors de la période ; les deux versions qui étendent sont fusionnées le 12 (0.3.56) et le 13 (0.3.57) ; le « nouvel ordre de travail » est du 13. Le constat omet deux faits écrits dans le dépôt. Julien a demandé lui-même ces fonctions le 9 novembre et en a laissé le moment à Claude (« quand tu estimes que c'est le meilleur moment », `docs/camera-physique.md`, l. 641 ; `docs/questions-ouvertes.md`, l. 31 ; `docs/propositions.md`, l. 71). Et « que Julien n'a pas confirmée par écrit » est faux pour la première des deux versions : il en a tranché les sept choix avant la fusion et a mis CMP-02 dans le jalon de la V1 minimale (`data/jalons.yaml` : « Ajoutée le 12 novembre 2026 (Julien) »), si bien que les grilles ne sont plus « au-delà de la V1 minimale ». Seule la version 0.3.57 étend hors du jalon sans réponse de lui, et le dépôt le dit déjà (onze choix « à confirmer », `docs/propositions.md`, section 4). Reste vrai, et à faire en une ligne chacun : `CLAUDE.md`, l. 40, et `docs/questions-ouvertes.md`, l. 83, n'ont pas suivi, et la levée n'est pas dans « Ce qui attend Julien ». C'est la question 1 et une ligne du tableau de CHX-10 : rien n'est perdu à retirer ce constat.

### CHX-02 · incohérent · Les deux effets qui ont fait choisir Babylon.js ne servent plus, et `docs/pile-technique.md` dit encore le contraire

- Endroit : `docs/pile-technique.md`, l. 21, 56, 75-78 et 117 ; `docs/historique.md`, l. 73 ; `docs/camera-physique.md`, l. 41-45 et 268-270 ; `app/src/` (imports).
- Ce qui est écrit, comme raison du choix du 7 novembre 2026 : « le seul des moteurs temps réel lus qui fournit à la fois une profondeur de champ physique (ouverture, focale, distance) et un flou de mouvement par objet » (`docs/pile-technique.md`, l. 56) ; « C'est la seule qui couvre d'origine les deux effets clés de la tranche de parc » (l. 117). La section « Décision » garde comme points à traiter « régler `lensSize` sur la focale » et « relier `motionStrength` à la vitesse d'obturation » (l. 77-78).
- Preuve (code) : aucun des deux effets n'est importé. `grep` de `DepthOfField`, `MotionBlur`, `CircleOfConfusion`, `lensSize` et `motionStrength` dans `app/src/` : seule la classe `ViewfinderDepthOfField` de TutoPhoto répond (`app/src/camera/viewfinderDof.ts`, l. 128). Les 28 chemins importés de `@babylonjs/core` sont le moteur, la scène, la caméra, les textures et cibles de rendu, le rendu de profondeur, les post-traitements à shader écrit par TutoPhoto (`PostProcess`, `EffectRenderer`, `ShaderStore`), le fond (`PhotoDome`, `HDRCubeTexture`, `BackgroundMaterial`), une lumière et ses ombres, le chargement glTF.
- Preuve (documentation du dépôt) : dès le 8 novembre, `docs/camera-physique.md`, l. 43, écrit de la profondeur de champ de Babylon.js : « Le résultat est ensuite plafonné à 1 et sert de fraction d'un flou maximal fixe […] : le passage en pixels n'est pas physique, et le flou n'a pas la forme de l'ouverture. » L'effet est essayé en version 0.3.22, puis remplacé en version 0.3.23 par « un flou en disque de taille physique, écrit pour TutoPhoto », sur décision de Julien du 9 novembre (l. 268-270). La photo est calculée par accumulation de rendus, écrite pour TutoPhoto (décision de Julien du 8 novembre, `docs/historique.md`, l. 118) ; le viseur n'a pas de flou de mouvement (`docs/camera-physique.md`, l. 76).
- Preuve (source relue) : le tableau de `docs/pile-technique.md` est juste sur ce qu'il a lu. `thinCircleOfConfusionPostProcess.ts`, étiquette `9.35.0`, l. 107-108 : `const aperture = this.lensSize / this.fStop;` puis `const cocPrecalculation = (aperture * this.focalLength) / (this.focusDistance - this.focalLength);`. Mais le plafond est dans un autre fichier, que la comparaison du 7 novembre ne cite pas : `Shaders/circleOfConfusion.fragment.js` du paquet 9.35.0, l. 19 : `coc=clamp(coc,0.0,1.0)`. Le mot « physique » de la l. 21 vaut pour le calcul du cercle de confusion, pas pour le flou affiché.
- Preuve (source relue), sur l'option écartée : la page reproche à three.js que relier le flou de mouvement à la vitesse d'obturation « demande le moteur WebGPU » (l. 52, et l. 22 : « moteur WebGPU »), à côté d'un Babylon.js qui « fonctionne en WebGL2, pris en charge par tous les navigateurs du tableau » (l. 56). Ce moteur de three.js n'exige pas WebGPU : `src/renderers/webgpu/WebGPURenderer.js`, étiquette `r187`, l. 24 : « If not, `WebGPURenderer` falls backs to a WebGL 2 backend », et l. 41, option `forceWebGL`. La comparaison ne le dit pas. Les autres lignes du tableau relues sont exactes (section « Vérifié »).
- Ce que cela coûte : rien dans l'application. Dans la documentation, la page qui justifie le moteur donne une raison qui n'a tenu que deux jours, et laisse croire que la profondeur de champ et le flou de mouvement viennent de Babylon.js. La question « pourquoi ce moteur » n'a plus de réponse écrite qui soit vraie.
- Voies.
  - A. Ne rien faire.
  - B. Corriger la page : sous « Décision », une note datée qui dit que les deux effets ne servent plus depuis la version 0.3.23, ce que Babylon.js fournit aujourd'hui (la liste ci-dessus), et pourquoi on le garde ; retirer les deux points à traiter devenus sans objet. Coût : une pull request de documentation, à faire avec le découpage de la page proposé par CHX-01.
  - C. Rouvrir le choix du moteur (three.js, sous licence MIT, sans `NOTICE.md` à recopier). Coût certain : douze fichiers de `app/src/` importent Babylon.js, 4 456 lignes sur 6 292, et toute la routine de test est à repasser. Gain : je ne sais pas. Aucune page lue n'attribue un défaut de l'application à Babylon.js qui ne soit déjà contourné (un seul fichier JavaScript depuis la version 0.3.25, chargement qui n'attend plus le shader du bruit depuis la version 0.3.18), et rien ne dit qu'une accumulation de rendus s'écrirait mieux ailleurs.
- Recommandation : B. Pas C : le coût est certain et le gain n'est pas établi. Si la refonte de la chaîne d'image (ARC-01) butait sur une limite du moteur, la question se reposerait alors, avec la limite sous les yeux.

**Contre-vérification : confirmé.** Gravité à ramener à « à améliorer », correction à réduire. Relu : aucun effet de profondeur de champ ni de flou de mouvement de Babylon.js n'est importé dans `app/src/` (seule `ViewfinderDepthOfField`, écrite pour TutoPhoto, répond à la recherche) ; à l'étiquette `9.35.0`, `thinCircleOfConfusionPostProcess.ts` porte les deux lignes citées (l. 107-108) et la source du shader, `circleOfConfusion.fragment.fx`, le plafond (`coc = clamp(coc, 0.0, 1.0);`) ; à l'étiquette `r187`, `WebGPURenderer.js` écrit bien « falls backs to a WebGL 2 backend ». Mais « dit encore le contraire » est trop fort. La page s'ouvre sur « Comparaison du 7 novembre 2026 », sa section « Recommandation » est titrée « (avant décision) », et elle renvoie pour le modèle à `docs/camera-physique.md`, qui dit le remplacement (l. 43 et 268-270), comme `docs/historique.md`, l. 118 (« Babylon.js plafonne son flou d'arrière-plan et règle son flou de mouvement à la main »). Les sections « Options » et « Recommandation » sont le compte rendu d'une décision : elles n'ont pas à être réécrites. Ce qui est périmé tient en trois lignes de la section « Décision » : les deux points à traiter (l. 77-78) et « effets approchés de Babylon.js dans le viseur » (l. 83), que le constat ne relève pas. Correction : ces trois lignes et une note datée sous « Décision », dans une petite pull request, sans attendre le découpage de la page. Sur three.js : la phrase est exacte si « le moteur WebGPU » désigne la classe `WebGPURenderer`, et le tableau donne bien à three.js « WebGL2 et WebGPU » ; il ne manque que le repli. Je ne sais pas si ce flou de mouvement fonctionne sur le repli WebGL 2 : non essayé, et ce point ne remet pas en cause une décision que Julien a prise.

### CHX-05 · incohérent · `data/` est dite « source de vérité », mais le site et l'application recopient ses titres à la main ; en anglais, les copies ne disent pas la même chose

- Endroit : `CLAUDE.md`, l. 5 ; `data/referentiel/*.yaml` et `data/situations.yaml` (champ `title`) ; première ligne de chaque fiche de `content/` ; `app/src/ui/challenges.ts`, l. 9-21 et 199 ; `app/src/i18n.ts`, l. 107-111 et 341-345 ; `app/scripts/build-pages.mjs`, l. 22-23, 85-94 et 101-134 ; `scripts/coverage.py`, l. 18-23 ; `scripts/referentiel.py`, l. 11 ; `docs/contenus.md`, l. 25-31 et 41-46.
- Qui lit quoi (lu dans le code).

  | Donnée | Écrite à | Lue par |
  | --- | --- | --- |
  | Titre d'une notion | `data/referentiel/` | `scripts/validate.py` et `scripts/coverage.py` seulement |
  | | ligne 1 de la fiche, dans chaque langue | `build-pages.mjs` : titre de la page et de l'accueil |
  | | `challenges.ts`, table `NOTION_TITLES` (dix notions, « repris du référentiel ») | le bulletin du simulateur |
  | Titre d'une situation | `data/situations.yaml` ; ligne 1 de la fiche ; `i18n.ts` (`challenge01Title`…) | respectivement : les scripts Python ; les pages ; la fenêtre « Défis » |
  | Titres des sections d'une fiche | `docs/contenus.md` (la règle) ; `coverage.py` (`HEADINGS`) ; `build-pages.mjs` (`SECTIONS`) | chacun le sien |
  | Ordre des domaines | `referentiel.py` (`DOMAIN_ORDER`) ; `build-pages.mjs` (`DOMAIN_ORDER`, « Ordre des domaines de scripts/referentiel.py ») | chacun le sien |
  | Titres des domaines, fiches relues | `data/referentiel/*.yaml`, `data/relecture.yaml` | PyYAML côté Python ; côté site, des expressions régulières qui exigent une mise en page exacte (`build-pages.mjs`, l. 108 et 129) |

  Rien n'est produit à partir de `data/` : ni l'application ni les pages ne lisent un titre de notion ou de situation dans le référentiel.
- Preuve de l'écart (script `doublons.py`, 44 fiches) : en français, les 22 titres de fiches sont ceux du référentiel. En anglais, 20 sur 22 diffèrent : 17 par la seule majuscule initiale, et 3 par les mots : BOI-07, « Aperture priority » dans la fiche et « aperture priority, A/Av » dans le référentiel ; BOI-08, « Shutter priority » et « shutter priority, S/Tv » ; EXP-06, « ISO » et « ISO sensitivity ». Effet visible en anglais : sous une photo, quand BOI-08 est à revoir, le bouton du bulletin affiche « BOI-08 shutter priority, S/Tv » (`challenges.ts`, l. 11 et 199) et ouvre une fiche titrée « Shutter priority ».
- Un détail : `build-pages.mjs`, l. 101, dit le format du bloc `domain` « contrôlé par validate.py ». `validate.py` charge les fichiers avec PyYAML et accepte toute mise en page valide ; c'est `build-pages.mjs` lui-même qui échoue, avec un message clair, si le bloc change de forme.
- Ce que cela coûte : presque rien aujourd'hui (un écart de libellé en anglais). Ce que cela coûtera : 19 notions sur 191 ont une fiche ; chaque fiche ajoute un titre recopié dans deux langues, et le solveur de situations prévu en V2 aura besoin des données de `data/situations.yaml` dans l'application.
- Voies.
  - A. Ne rien faire.
  - B. Un contrôle et une copie de moins : `validate.py` vérifie que la ligne 1 de chaque fiche porte le titre du référentiel (avec une règle écrite pour la majuscule) ; `NOTION_TITLES` disparaît de `challenges.ts`, les titres venant d'un fichier produit à la construction. Coût : une pull request ; les trois titres anglais qui diffèrent sont à trancher par Julien ou par la relectrice.
  - C. Un seul lecteur de `data/` côté site : le paquet `yaml` (version 2.9.1, licence ISC, sans dépendance, d'après le registre npm lu le 13 novembre 2026) en dépendance de développement ; `build-pages.mjs` et Vite lisent `data/` directement, et les titres des sections sont définis une fois. Coût : une dépendance à vérifier (`CLAUDE.md`, l. 41), la lecture de `build-pages.mjs` à reprendre.
- Recommandation : B maintenant. C quand l'application aura besoin des données (solveur de situations), pas avant.

**Contre-vérification : confirmé.** Gravité à ramener à « à améliorer », correction à corriger. Refait avec mon propre script (`titres.py`) : en français, les 22 titres de fiches sont ceux de `data/` ; en anglais, 2 sont identiques, 17 diffèrent par la majuscule initiale et 3 par les mots (BOI-07, BOI-08, EXP-06) ; les dix titres de `challenges.ts` sont ceux de `data/` dans les deux langues, et le bouton du bulletin est bien construit avec eux (l. 199). Aucun script de `app/` ne lit un titre de notion ou de situation dans `data/`. Trois réserves. L'écart anglais n'est pas une dérive : `docs/lire-le-referentiel.md`, l. 10, définit `title.en` comme l'amorce du glossaire (« l'anglais amorce le glossaire FR/EN »), d'où les minuscules et « A/Av » ; les trois titres de fiches qui diffèrent traduisent le titre français (« Priorité à l'ouverture », « ISO »). Le constat est en partie déjà dit : les dix titres recopiés sont dans ARC-07, et la lecture de `data/` par expressions régulières dans la section « Hors du périmètre » du même rapport. Et la voie B crée ce qu'elle veut éviter : « un fichier produit à la construction » ajoute un lecteur de YAML en JavaScript et une étape avant `vite` et `npm run dev` (objection déjà écrite sous ARC-07). Correction : `scripts/validate.py`, qui charge déjà le référentiel et tourne dans la CI, contrôle la ligne 1 de chaque fiche française et les dix titres de `challenges.ts` ; pour l'anglais, écrire d'abord la règle (un vrai titre dans `title.en`, ou un titre de fiche libre), que Julien tranche. La voie C attend le solveur, comme le dit la recommandation.

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
- Ce que cela montre : trois journaux tiennent le même fil. `CHANGELOG.md` (953 lignes, 71 867 octets en sept jours) dit ce qui a changé, version par version. `docs/historique.md`, annoncé comme l'historique « des décisions », reçoit une ligne par version (52 fusions sur 63), décision de Julien ou non : « Version 0.3.55 : en cherchant la cause d'un échec isolé de la routine de test, Claude constate que… » (l. 201). `docs/etat-des-travaux.md`, depuis la version 0.3.54, redit l'état et la file. À côté, deux pages de référence accumulent le récit des versions au lieu de dire l'état : `docs/questions-ouvertes.md` (« Points à surveiller », l. 20-65, où un point clos garde tout son récit, par exemple l. 60-61) et `docs/pile-technique.md` (« Organisation du site », l. 98-111).
- Ce que cela coûte, mesuré dans le dépôt : des pages qui ne suivent plus.
  - `README.md`, l. 9 : « État au 8 novembre 2026 », au-dessus d'un paragraphe qui décrit la version 0.3.57 du 12 novembre ; l. 11 : « 96 sources », alors que `data/sources.yaml` en compte 172 (`python3 scripts/validate.py`).
  - `README.en.md` : dernière modification le 9 novembre 2026 (commit `3f1822b`) ; il écrit encore « No written content yet: coverage 0 of 191 », alors que 22 fiches existent en anglais et que la couverture est de 13 sur 191.
  - `docs/etat-des-travaux.md` a deux sections « Où on en est » (l. 15 et l. 53) et deux files de travail (l. 26 et l. 59) : le point du 13 novembre a été ajouté au-dessus de l'ancien, avec la mention « Ce point prime sur l'ordre de la file plus bas » (l. 5).
  - `docs/questions-ouvertes.md`, l. 32, dit les choix des grilles « faits sans Julien, à confirmer », et `docs/etat-des-travaux.md`, l. 111, les range parmi les choix à confirmer ; `docs/propositions.md`, l. 94, les dit « Tranché par Julien le 12 novembre 2026 », comme `docs/etat-des-travaux.md`, l. 68.
  - La liste des contrôles de la routine dans `docs/pile-technique.md` s'arrête à la version 0.3.29 (constat ARC-09).
- Ce que cela coûtera : `CLAUDE.md`, l. 35-37, fait de `docs/etat-des-travaux.md` le point de départ de chaque session neuve, et la section « Comment reprendre » (l. 100) demande de lire aussi `docs/propositions.md` et `docs/questions-ouvertes.md` : avec `CLAUDE.md`, 59 524 octets à lire avant de commencer, qui grossissent à chaque version puisque rien n'en sort.
- Voies.
  - A. Ne rien faire. Coût : quatre fichiers au moins par version, des pages en retard (les quatre exemples ci-dessus), une reprise de plus en plus longue à lire.
  - B. Une information, un endroit. `CHANGELOG.md` reste le seul récit par version (il est déjà obligatoire et contrôlé par la CI). `docs/historique.md` ne reçoit que les décisions de Julien, datées et citées. `docs/etat-des-travaux.md` est réécrit à chaque version, pas complété : état, file, ce qui attend Julien, sans récit. `docs/questions-ouvertes.md` ne garde que ce qui est ouvert ; un point clos en sort. `docs/pile-technique.md` est coupé en deux : la comparaison des moteurs, figée à sa date, et une page de référence de l'outillage, sans récit. `README.md` et `README.en.md` perdent leur inventaire des fonctions, remplacé par un lien vers le site et vers `CHANGELOG.md`. Coût : deux pull requests de documentation ; une table « quelle page pour quelle information » dans `CLAUDE.md`. Risque : perdre une information en élaguant ; l'historique de git la garde.
  - C. Produire les pages d'état par script (comptes du README d'après `scripts/coverage.py`, historique d'après le changelog). Coût : un outil de plus à entretenir, pour un dépôt de cette taille.
- Recommandation : B. Le détail page par page revient au rapport `docs/audit/documentation.md` ; ce constat fixe la règle et la mesure.

**Contre-vérification : confirmé.** Mesures refaites avec mon propre script (`fusions.py`, `git diff --numstat` de chacune des 63 fusions) : mêmes chiffres, à l'unité (dix dernières versions : 5,9 en moyenne, 4,5 en médiane, de 4 à 11 ; toutes : 5,0 et 5 ; `CHANGELOG.md` 63 fois, `docs/historique.md` 52, `docs/questions-ouvertes.md` 41, `README.md` 33). Le constat tient sans les cinq versions du 12 novembre ou d'après : sur les 58 fusions précédentes, 4,8 fichiers en moyenne et 5 en médiane. Relus aussi : `README.md` (« État au 8 novembre 2026 », « 96 sources » pour 172), `README.en.md` (dernier commit le 9 novembre, « coverage 0 of 191 » pour 13), les quatre phrases de la version 0.3.53, les 59 524 octets de la reprise. Deux des cinq « pages qui ne suivent plus » sont hors de la période et ne se reprochent pas au travail antérieur : les deux sections « Où on en est » de `docs/etat-des-travaux.md` (13 novembre) et la contradiction sur les grilles (12 novembre). Deux précisions sur la voie B. `docs/pile-technique.md` est cité par onze sources de `data/sources.yaml` (champ `used_in`), par `CLAUDE.md` et par `routine.yml` : si la page est coupée, la comparaison des moteurs garde ce chemin, et les renvois de l'outillage changent dans la même pull request. Et la table « quelle page pour quelle information » modifie `CLAUDE.md`, qui porte les règles de Julien : à lui proposer avant de l'écrire.

### CHX-10 · à améliorer · Ce qui attend une décision de Julien est dispersé dans six pages, et la liste « Ce qui attend Julien » en oublie

- Endroit : `docs/etat-des-travaux.md`, l. 73 et 108-114 ; `docs/camera-physique.md`, l. 13 et 76 ; `docs/historique.md`, l. 121 et 199 ; `docs/propositions.md`, l. 76 et 88-124 ; `docs/questions-ouvertes.md`, l. 12, 32 et 63 ; `docs/dossiers/scenes.md`, l. 12.
- Preuve : liste reconstituée par `grep` de « à confirmer », « comprise comme », « lecture de Claude », « estimation de Claude » et « à trancher ».

  | En attente | Depuis le | Écrit à | Dans « Ce qui attend Julien » |
  | --- | --- | --- | --- |
  | Boîtiers : « La réponse de Julien, « 1,2,3 », est comprise comme « les trois » » | 8 novembre | `docs/camera-physique.md`, l. 13 ; `docs/historique.md`, l. 121 | non |
  | Viseur sans flou de mouvement : « C'est la lecture de Claude de la décision […] ; à confirmer par Julien » | 8 novembre | `docs/camera-physique.md`, l. 76 | non |
  | Niveau des situations : règle de la médiane, « à confirmer en écrivant les premiers défis » ; les défis sont écrits depuis la version 0.3.38 | 7 novembre | `docs/questions-ouvertes.md`, l. 63 | non |
  | Levée de l'attente des tests avant d'étendre (CHX-04) | 12 novembre | `docs/historique.md`, l. 199 | non |
  | Situations qui réutiliseraient le parc : « une estimation de Claude » | 11 novembre | `docs/propositions.md`, l. 76 | non |
  | Scènes suivantes sur des photos à 360° : « proposition », « à trancher par Julien » dans le dossier, mais déjà un sujet « À faire » de la file | 12 novembre | `docs/dossiers/scenes.md`, l. 12 ; `docs/etat-des-travaux.md`, l. 73 ; `docs/questions-ouvertes.md`, l. 12 | non |
  | Onze choix des histogrammes (version 0.3.57) | 12 novembre | `docs/propositions.md`, l. 108-124 | oui |
  | Tags `v0.2.0`, `v0.2.1` et `v0.2.2` : « tag à poser à la main » | 7 novembre | `CHANGELOG.md`, section 0.2.4 ; avertissements de chaque passage de `tag.yml` | non |
  | Version 0.3.53 à juger ; accord de Renderpeople ; relecture des fiches ; tests | | `docs/etat-des-travaux.md`, l. 110-114 | oui |

  Pour les boîtiers, la suite vaut confirmation de fait : le 11 novembre, Julien a relevé lui-même la couverture de l'autofocus de l'EOS RP, de l'A7 III et de l'A6000 (`docs/historique.md`, l. 188-190). La phrase « comprise comme » n'a pas été mise à jour.

  Pour les tags : le dépôt publié a 60 tags, de `v0.2.3` à `v0.3.57` (`git ls-remote --tags origin`), pour 63 versions fusionnées. GitHub refuse au workflow la référence des trois premières. Depuis, chaque passage de `tag.yml` recrée leurs trois objets de tag, se voit refuser les références et écrit trois avertissements ; ceux du passage du 13 novembre 2026 : « v0.2.2 sur 911deef : référence refusée au jeton du workflow (HTTP 403 : Resource not accessible by integration) ; tag à poser à la main. » Quatre liens du bas de `CHANGELOG.md` visent ces tags absents (`compare/v0.2.2...v0.2.3`, `compare/v0.2.1...v0.2.2`, `compare/v0.2.0...v0.2.1`, `tree/v0.2.0`). Correction proportionnée : soit Julien pose les trois tags (la commande est dans le résumé du workflow), soit `scripts/changelog.py` cesse de les réessayer et les quatre liens visent les commits.
- Ce que cela coûte : `CLAUDE.md`, l. 17, pose « Julien tranche ». Il ne peut trancher que ce qu'il voit ; deux questions attendent depuis cinq jours dans une page de 698 lignes, et la liste censée tout réunir compte cinq lignes.
- Voies.
  - A. Ne rien faire.
  - B. Une seule table « Décisions en attente » dans `docs/etat-des-travaux.md` : la question, sa date, la page du détail, ce qui se passe sans réponse. Les autres pages y renvoient et n'écrivent plus « à confirmer ». Une décision prise sort de la table et entre dans `docs/historique.md`.
  - C. Un ticket GitHub par décision. Julien les verrait sur son téléphone ; mais l'état ne serait plus tout entier dans le dépôt, ce que demande la règle de reprise (`CLAUDE.md`, l. 35).
- Recommandation : B, avec la remise en ordre de CHX-01. Les questions de fond sont reprises dans « Questions à poser à Julien ».

**Contre-vérification : confirmé.** Correction à réduire : le tableau compte trop large. Relu ligne à ligne, et la recherche des cinq expressions refaite. Trois lignes sont de vraies attentes anciennes, absentes de « Ce qui attend Julien » : le viseur sans flou de mouvement (« à confirmer par Julien », 8 novembre), la règle de la médiane (7 novembre, « à confirmer en écrivant les premiers défis », écrits depuis), et les trois tags (7 novembre). Pour les tags, vérifié le 13 novembre 2026 : 60 tags publiés, de `v0.2.3` à `v0.3.57` (`git ls-remote --tags origin`) ; le dernier passage de `tag.yml` porte les trois avertissements cités (annotations lues dans l'API) ; les quatre liens du bas de `CHANGELOG.md` visent des tags absents. Deux lignes ne sont pas des décisions en attente : les boîtiers (le constat le dit lui-même : Julien a relevé leurs fiches le 11 novembre, il reste une phrase à mettre à jour) et les situations qui réutiliseraient le parc (« à vérifier situation par situation » : un travail de Claude, pas une réponse de Julien). Trois lignes datent du 12 novembre ou d'après, comme la liste « Ce qui attend Julien » elle-même (version 0.3.54) : hors de la période. « Dispersé dans six pages » vaut donc pour trois attentes du travail antérieur, pas pour neuf. Correction : la table de la voie B, avec ces trois lignes, celles du 12 novembre et la question 1 (CHX-04).

### CHX-03 · à améliorer · Rien, dans GitHub, n'empêche de pousser sur `main` ni de fusionner avec une CI rouge : la règle ne tient que par `CLAUDE.md`

- Endroit : `CLAUDE.md`, l. 29 et 33 ; `docs/historique.md`, l. 90 ; `README.md`, l. 54 ; réglages du dépôt sur GitHub.
- Ce qui est écrit : « Jamais de push sur `main` » (`CLAUDE.md`, l. 29) ; « Claude fusionne lui-même ses pull requests quand la CI est verte sur le dernier commit » (l. 33) ; « Les réglages de GitHub hors de portée des outils de Claude (protection de `main`, options de sécurité, Pages) restent faits par Julien, sur indication de Claude » (`docs/historique.md`, l. 90).
- Preuve (API de GitHub, 13 novembre 2026) : `GET /repos/Badmiaoo/TutoPhoto/branches/main` répond `"protected": false`, avec `"required_status_checks": {"enforcement_level": "off", "contexts": [], "checks": []}` ; `GET …/rulesets` et `GET …/rules/branches/main` répondent des listes vides. Aucune page du dépôt ne dit que la protection a été demandée à Julien, ni qu'elle a été écartée (`grep` de « protection », « ruleset » et « protected » dans les pages et les workflows : la seule mention de la protection de `main` est la phrase citée de `docs/historique.md`).
- Ce qui est juste : la règle a été tenue. Un seul commit a été poussé sur `main` hors d'une fusion, le premier (`e89680d`, « Ajoute REPRISE.md », le cas dit par `docs/historique.md`, l. 42). Pour chacune des 63 pull requests fusionnées, le dernier passage de chaque workflow sur le commit de tête est un succès (recoupement des 447 passages et des 64 pull requests).
- Ce que cela coûte : rien jusqu'ici. Ce que cela coûtera : la CI est décrite comme ce qui protège le dépôt public (`docs/publication.md`, « Contrôles »), mais elle ne bloque rien ; une fusion faite trop tôt, une session qui se trompe de branche ou un contributeur extérieur avec les droits d'écriture publient aussitôt le site (`pages.yml`) et posent un tag (`tag.yml`), sans contrôle.
- Voies.
  - A. Ne rien faire, la discipline suffit. Risque : celui ci-dessus, faible tant que Claude est seul à écrire.
  - B. Julien active une règle de branche sur `main` : pull request obligatoire, et contrôles requis `validate`, `confidentialite`, `app` et `description`. Chemin dans l'interface : Settings, puis Rules, puis Rulesets, puis New branch ruleset (chemin non relu dans la documentation de GitHub, dont le site n'est pas joignable : à vérifier à l'écran). Coût : dix minutes de Julien. Les quatre jobs de la routine ne peuvent pas être requis tels quels : `routine.yml` ne se lance que si la pull request touche `app/`, `content/`, `data/` ou la routine (l. 8-13), et GitHub écrit : « You should not use path or branch filtering to skip workflow runs if the workflow is required to pass before merging. » (source de la documentation, dépôt `github/docs`, commit `8cd1075`, `data/reusables/pull_requests/path-filtering-required-workflows.md`).
  - C. B, plus la routine rendue « requérable » : le filtre par chemins passe du déclencheur à une condition de job. GitHub écrit : « A job that is skipped will report its status as "Success". It will not prevent a pull request from merging, even if it is a required check. » (même dépôt, même commit, `data/reusables/actions/workflows/skipped-job-status-checks-passing.md`). Coût : une pull request sur le workflow, à faire avec CHX-07.
- Recommandation : B maintenant ; C avec la refonte des tests (ARC-05, CHX-07).

**Contre-vérification : confirmé.** Relu dans l'API de GitHub le 13 novembre 2026 : `"protected": false`, `"enforcement_level": "off"`, et deux listes de règles vides. La seule mention de la protection de `main` dans le dépôt est la phrase de `docs/historique.md`, l. 90, qui la range parmi les réglages « faits par Julien, sur indication de Claude » : l'indication n'a pas été donnée, alors que `CLAUDE.md` demande de la donner « avec le chemin exact dans l'interface ». Recoupement refait avec mon propre script (`ci.py`, 461 passages, 64 pull requests) : pour les 63 pull requests fusionnées, le dernier passage de chaque workflow sur le commit de tête est un succès. Les deux citations de GitHub sont exactes dans la source (dépôt `github/docs`, commit `8cd1075`). Deux précisions sur les voies. B : dire à Julien de n'exiger aucune approbation, la règle « Claude fusionne lui-même ses pull requests » (`CLAUDE.md`, l. 33) le suppose ; je ne sais pas sous quelle identité l'outil de Claude fusionne. C : « le filtre passe du déclencheur à une condition de job » ne s'écrit pas en une ligne. La liste des propriétés du contexte `github` (même dépôt, même commit, `content/actions/reference/workflows-and-actions/contexts.md`) n'en a aucune qui donne les fichiers changés : il faut un premier job qui les calcule. À ne faire qu'avec la refonte des tests, comme le dit la recommandation.

### CHX-07 · à améliorer · Une pull request qui ne touche que des fiches ou des données lance quatre fois le scénario 3D complet

- Endroit : `.github/workflows/routine.yml`, l. 8-13, 20-22 et 32 ; `CLAUDE.md`, l. 32 et 36 ; `scripts/test_app.cjs`, l. 4-5, 13-14 et 74-82.
- Ce qui est fait : la routine se lance pour `app/**`, `content/**` et `data/**` (l. 8-13), sur quatre profils (l. 32), chacun jouant tout le scénario : le script n'a pas d'option pour ne contrôler que les pages (`--dist`, `--profils`, `--photo`, `--sorties`). `CLAUDE.md`, l. 32, ne demande pourtant la routine que pour une pull request « qui touche `app/` ».
- Mesure (API de GitHub, les dix passages de la routine, du 12 au 13 novembre 2026) : cinq réussis, quatre annulés par le commit suivant, un en échec ; 581 minutes de machine en tout. La construction du site prend 6 secondes par job et l'installation de Playwright de 12 à 36 secondes : le temps est celui du scénario. Dernier passage réussi : 17,7 ; 22,4 ; 22,6 et 26,5 minutes, soit 89 minutes de machine pour 27 minutes d'attente (même mesure que ARC-05). Le même profil, d'un passage réussi à l'autre : Android, de 7,5 à 22,6 minutes ; iPhone, de 7,1 à 17,7.
- Ce qui ne coûte rien : l'argent. « The use of standard GitHub-hosted runners is free: In public repositories » (source de la documentation de GitHub, dépôt `github/docs`, commit `8cd1075`, `content/billing/concepts/product-billing/github-actions.md`). Le coût est l'attente.
- Ce que cela coûtera : les corrections des deux audits des fiches (39 constats confirmés) seront surtout des pull requests qui ne touchent que `content/` ou `data/`. Chacune attendra de 20 à 27 minutes un scénario qui exerce un rendu 3D qu'une fiche ne peut pas changer. Ce qui protège une fiche est ailleurs, et rapide : la construction échoue sur un balisage inconnu, une traduction absente ou un code sans fiche (`docs/contenus.md`, l. 70), et la routine vérifie « une fois » les liens internes des pages (`test_app.cjs`, l. 13-14). Avec la règle du 13 novembre (pousser chaque étape dans une pull request en brouillon, `CLAUDE.md`, l. 36), chaque envoi relance les quatre jobs et annule les précédents (`routine.yml`, l. 20-22).
- Voies.
  - A. Ne rien faire. Coût : l'attente ci-dessus à chaque correction de fiche.
  - B. Deux niveaux : un job « pages » (liens internes, accueil, une fiche, l'activité ; un profil ordinateur et un profil téléphone) pour toute pull request qui touche `content/`, `data/` ou `app/` ; le scénario 3D sur quatre profils seulement si `app/` ou la routine changent. Demande une option du script pour ne jouer que les pages : à faire avec le découpage de la routine en étapes (ARC-05).
  - C. Ne pas lancer le scénario 3D sur une pull request en brouillon : `types: [opened, synchronize, reopened, ready_for_review]` et une condition de job sur `github.event.pull_request.draft`. Par défaut, « a workflow only runs when a `pull_request` event's activity type is `opened`, `synchronize`, or `reopened` », et `ready_for_review` est un type d'activité de `pull_request` (même dépôt, même commit, `content/actions/reference/workflows-and-actions/events-that-trigger-workflows.md`, l. 465 et 666). Risque : un échec découvert tard, au passage en « prête ».
- Recommandation : B, dans la pull request qui découpe la routine ; C tout de suite si l'attente gêne les corrections de fiches, parce qu'elle tient en trois lignes.

**Contre-vérification : réfuté.** Hors de la période auditée, déjà mesuré ailleurs, et la voie C ne réduit pas le coût annoncé. Les mesures sont exactes (refaites avec mon propre script, `routine.py`, sur les jobs lus dans l'API : dix passages, cinq réussis, quatre annulés, un en échec, 581 minutes de machine ; dernier passage réussi : 89 minutes de machine pour 27 d'attente). Mais `routine.yml` vient du commit `66cb9b3`, publié le 12 novembre 2026 avec la version 0.3.54, et la règle des pull requests en brouillon est du 13 : rien ici n'est du travail antérieur. La contre-vérification d'ARC-05 l'a déjà écrit, avec les mêmes durées : « ses durées sont une mesure, pas un reproche ». Le déclenchement sur `content/**` et `data/**` est voulu et dit en tête du workflow (« chaque pull request qui touche le site construit ») : les pages des fiches sont construites à partir de ces deux dossiers, et la routine contrôle leurs liens, une fiche, et le bouton « Jouer le défi » d'une fiche de situation (`scripts/test_app.cjs`, l. 13-20 et 277). Voie C, à ne pas faire : ne pas lancer la routine sur un brouillon n'enlève rien à l'attente, qui est celle du dernier commit avant la fusion ; elle n'économise que des minutes de machine, que le constat dit gratuites, et elle retarde la découverte d'un échec. Ce qui reste utile est la voie B, comme exigence de la refonte d'ARC-05 : un niveau « pages », rapide, pour les pull requests qui ne touchent que des fiches ou des données.

### CHX-08 · à améliorer · Toutes les versions sont épinglées, et rien ne dit quand ni comment les faire avancer

- Endroit : `app/package.json`, l. 17-25 ; `requirements.txt` ; `.github/workflows/pages.yml`, l. 28, `routine.yml`, l. 41 et 52, `validate.yml`, l. 85 ; `docs/pile-technique.md`, l. 89-96 et 125 ; `scripts/test_app.cjs`, l. 6 et 69 ; aucun fichier `.github/dependabot.yml`.
- État au 13 novembre 2026, d'après les registres npm et PyPI, le calendrier de Node.js et `git ls-remote` :

  | Outil | Version épinglée, publiée le | Dernière version |
  | --- | --- | --- |
  | `@babylonjs/core`, `@babylonjs/loaders`, `babylonjs-gltf2interface` | 9.35.0, 6 novembre 2026 | 9.36.0, 12 novembre 2026 |
  | `vite` | 8.3.6, 5 novembre 2026 | 8.3.8, 11 novembre 2026 |
  | `typescript` | 7.0.2, 8 juillet 2026 | 7.0.2 |
  | `playwright` (routine) | 1.63.0, 4 septembre 2026 | 1.65.1, 13 novembre 2026 |
  | `PyYAML`, `jsonschema` | 6.0.3 et 4.26.0 | les mêmes |
  | Node.js dans la CI | 22 | 22 est en maintenance depuis le 21 octobre 2025 et s'arrête le 30 avril 2027 ; la version 26 est la version LTS depuis le 28 octobre 2026, jusqu'au 30 avril 2029 |
  | Les cinq actions et gitleaks | étiquettes citées dans les workflows | ce sont les dernières ; les cinq empreintes de commit sont bien celles des étiquettes |

- Le rythme de Babylon.js : 33 versions stables depuis le 1er août 2026, 2,1 jours d'écart médian (registre npm). L'épingle prend donc une dizaine de versions de retard par mois (33 versions en 104 jours). « 9.35.0 » est écrit dans huit fichiers de `main` hors du verrou (`app/package.json`, `app/scripts/copy-licences.mjs`, `data/sources.yaml`, `docs/camera-physique.md`, `docs/pile-technique.md`, `docs/licences.md`, `docs/etat-des-travaux.md`, `CHANGELOG.md`), souvent avec le nom d'un fichier lu dans cette version.
- Playwright : sa version est écrite dans un workflow (`routine.yml`, l. 52) et dans une page (`docs/pile-technique.md`, l. 125), dans aucun manifeste. Le message d'erreur du script conseille `npm install -g playwright` (`test_app.cjs`, l. 69), qui installe la dernière version, pas celle de la CI. Le jour de son choix (9 novembre), elle avait déjà deux versions mineures de retard (1.65.0 publiée le 5 novembre).
- Python : `requirements.txt` épingle les deux paquets directs ; les quatre dépendances de `jsonschema` (`attrs`, `jsonschema-specifications`, `referencing`, `rpds-py`) sont prises à leur dernière version à chaque passage de la CI.
- Machines de la CI : `runs-on: ubuntu-latest` dans les cinq workflows. Le dernier passage de `tag.yml` (13 novembre 2026) porte cette annotation de GitHub : « The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026 ». Le système, ses polices et les bibliothèques de Chromium changeront donc sous la routine sans qu'aucun fichier du dépôt change ; un contrôle de mise en page a déjà dépendu de la police de la machine (`docs/etat-des-travaux.md`, l. 78).
- Ce qui est juste : `npm audit` sur une copie du verrou répond « found 0 vulnerabilities » ; les licences des registres sont celles que dit la documentation (MIT pour Vite, PyYAML et jsonschema ; Apache-2.0 pour TypeScript, Babylon.js et Playwright) ; Vite 8.3.6 accepte Node.js `^20.19.0 || >=22.12.0`.
- Ce que cela coûte : rien aujourd'hui. Ce que cela coûtera : Node.js 22 sans correctif après le 30 avril 2027 ; des sauts de version plus grands le jour où une correction de sécurité y oblige ; des renvois de la documentation à une version que plus personne n'installe. Et le déroulé actuel refuse une mise à jour automatique : toute pull request doit ajouter une version à `CHANGELOG.md` (`validate.yml`, l. 32-42).
- Voies.
  - A. Ne rien faire. L'épinglage garde les constructions reproductibles ; le retard grandit.
  - B. Une règle d'entretien dans `CLAUDE.md` : une pull request « entretien » par mois, ou avant chaque jalon. Elle lance `npm outdated` et `npm audit`, prend les versions correctives et mineures, repasse la routine, met Node.js de la CI sur la version LTS courante, et corrige les versions citées dans la documentation. Playwright entre dans un manifeste avec son verrou, au moment de la refonte des tests (ARC-05). Coût : une pull request par mois.
  - C. Un outil de mise à jour automatique. Coût : un flux de pull requests à traiter (Babylon.js publie plusieurs fois par semaine), toutes rouges faute de section dans le changelog ; il faudrait les regrouper et les exempter du contrôle.
- Recommandation : B.

### CHX-06 · à améliorer · `scripts/extract_reprise.py` écrase `data/` avec le référentiel du 7 novembre si on le lance ; `CLAUDE.md` présente encore `docs/` comme une copie de `REPRISE.md`

- Endroit : `scripts/extract_reprise.py`, l. 11-19 ; `README.md`, l. 23-24 ; `CLAUDE.md`, l. 6 et 8 ; `REPRISE.md` (3 554 lignes, 171 157 octets) ; `docs/historique.md`, l. 46.
- Preuve (script) : sans argument, le script lit `REPRISE.md` et écrit dans le dossier courant chaque bloc qui commence par `# fichier:` (`out.write_text(body, encoding="utf-8")`, l. 18). Essai dans un dossier vide du bloc-notes : 16 fichiers écrits (les 14 de `data/referentiel/`, `data/situations.yaml`, `data/sources.yaml`). Comparés à ceux du dépôt : 15 diffèrent (`data/sources.yaml`, 484 lignes d'écart ; `data/situations.yaml`, 94 ; les treize domaines, de 6 à 44), seul `retired.yaml` est identique. Aucun workflow ni aucune page ne l'appelle (`grep`), sauf `REPRISE.md` lui-même ; `README.md`, l. 23, le range parmi les scripts du dépôt (« Extraction »). `docs/historique.md`, l. 46, dit que l'identité entre `data/` et `REPRISE.md` a été vérifiée une fois, à la première pull request.
- Preuve (`CLAUDE.md`) : l. 8, « `REPRISE.md`, et `docs/` qui en est copié, sont un brouillon ». Sur les 12 pages à la racine de `docs/`, 5 disent venir de `REPRISE.md` (`architecture.md`, `historique.md`, `cadrage.md`, `questions-ouvertes.md`, `lire-le-referentiel.md`, d'après leur ligne 3) ; les sept autres, dont `docs/camera-physique.md` (105 769 octets), et les dossiers `dossiers/`, `specifications/` et `audit/` ont été écrits après. La l. 6 nomme `REPRISE.md` « Archive de reprise », à côté de `docs/etat-des-travaux.md`, « pour reprendre à tout moment » : deux fichiers pour le même mot.
- Ce que cela coûte : un script rangé parmi les outils du dépôt détruit sans prévenir le travail non enregistré sur `data/` ; une session neuve peut prendre `REPRISE.md` (171 157 octets) pour une lecture de reprise.
- Voies : A, ne rien faire ; B, supprimer `scripts/extract_reprise.py` (l'historique de git le garde), corriger `README.md`, l. 23, et réécrire les l. 6 et 8 de `CLAUDE.md` (« `REPRISE.md` : archive figée du 7 novembre 2026, à ne pas lire pour reprendre ») ; C, déplacer en plus `REPRISE.md` sous `docs/`, ce qui casse les renvois de cinq pages pour peu de gain.
- Recommandation : B.

### CHX-11 · à améliorer · Chaque pull request naît avec le lien de la session, puis est corrigée : le lien reste dans son historique, et le contrôle échoue une fois par pull request

- Endroit : `CLAUDE.md`, l. 22-23 ; `docs/publication.md`, l. 32-41 ; `.github/workflows/description.yml`.
- Ce qui est fait : à la création, l'outil GitHub de Claude remplace le pied de la description par un pied qui porte le lien de la session ; Claude réécrit ensuite la description ; `description.yml` échoue tant que le lien y est (`docs/publication.md`, l. 35 et 40).
- Mesure (API de GitHub) : 107 passages du contrôle, 14 échecs, tous depuis le 11 novembre 2026 (10 le 11, 3 le 12, 1 le 13), pour les quinze pull requests 50 à 64 : à peu près un échec voulu par pull request.
- Ce que le contrôle protège : la description telle qu'elle est au moment de la fusion. Ce qu'il ne protège pas, et la page le dit : le lien « reste dans l'historique d'édition de chacune » (`docs/publication.md`, l. 40). La règle de `CLAUDE.md`, l. 22, « ni lien vers une session Claude dans les commits et les pull requests », n'est donc tenue qu'en surface, par construction.
- Voies.
  - A. Ne rien faire : le lien ne s'ouvre que pour le propriétaire de la session (`docs/publication.md`, l. 37).
  - B. Essayer une fois de créer la pull request sans l'outil qui ajoute le pied : par l'API de GitHub ou par la commande `gh`. Dans la session de cet audit, les lectures de l'API passent avec une identité pour ce dépôt (en-tête `X-RateLimit-Limit: 15000`) ; je ne sais pas si une écriture passerait, et la mission interdit de l'essayer. Si elle passe, le lien n'entre plus dans aucune description, et le contrôle reste comme filet.
  - C. Garder le déroulé et retirer la phrase de `CLAUDE.md` qui promet plus que ce qui est tenu.
- Recommandation : B, à la prochaine pull request ; puis mettre `CLAUDE.md`, l. 23, et `docs/publication.md` à jour selon le résultat.

### CHX-09 · à améliorer · Rien ne dit à un contributeur extérieur comment tester ni comment proposer un changement ; le déroulé suppose un seul auteur

- Endroit : `README.md`, l. 25 et 31-60 ; `README.en.md` ; `CLAUDE.md` ; `scripts/changelog.py`, l. 5-7 ; `.github/workflows/validate.yml`, l. 32-42 ; ni `CONTRIBUTING.md`, ni modèle de pull request ou de ticket sous `.github/`.
- Preuve.
  - `README.md`, « Lancer l'application » (l. 31-40), donne le serveur de développement et la construction, pas les tests. La routine n'est décrite que dans `CLAUDE.md`, l. 32, et dans `docs/pile-technique.md`, l. 119-141 ; elle demande Playwright « hors du dépôt » et a pris 53 minutes sur quatre cœurs (l. 124).
  - `README.md`, l. 25, donne `CLAUDE.md` pour les « Règles de travail ». Ce fichier mêle les règles du projet (réalisme, sources, licences, identifiants stables) et les consignes de l'agent (« Claude fusionne lui-même ses pull requests », `/clear`, pied de description à réécrire) : un lecteur humain ne sait pas lesquelles valent pour lui.
  - Toute pull request doit ajouter « une version plus récente que celle de REF » (`changelog.py`, l. 5-7). Deux pull requests ouvertes en même temps prennent le même numéro ; la seconde est à renuméroter, et `CHANGELOG.md`, `docs/historique.md` et `docs/etat-des-travaux.md` entrent en conflit.
  - Les 64 pull requests du dépôt ont la même branche de tête, `ccr-0b29c4d4-any4xd` (API de GitHub) ; le dépôt n'a que deux branches. « Une branche et une pull request par sujet » (`CLAUDE.md`, l. 29 ; `README.md`, l. 54) décrit autre chose que ce qui est fait : un sujet à la fois, sur une branche réutilisée.
  - `README.en.md` a 35 versions de retard (CHX-01) ; le reste de la documentation n'existe qu'en français (`CLAUDE.md`, l. 13), ce que le README anglais ne dit pas.
  - `docs/architecture.md` décrit un autre produit, et aucune page ne décrit la structure de l'application (ARC-09).
- Ce qui existe et aide : le tableau des dossiers de `README.md`, `docs/lire-le-referentiel.md`, `docs/contenus.md` (format des fiches, strict, vérifié par la construction), `docs/licences.md`, `docs/publication.md` ; `validate.py` et la construction échouent avec des messages en clair.
- Ce que cela coûte : rien aujourd'hui, les 171 commits de `main` ont pour auteurs Claude et Julien. Le premier contributeur extérieur ne pourra ni tester, ni savoir quel numéro de version prendre, ni distinguer les règles qui le concernent.
- Voies.
  - A. Ne rien faire avant les tests de la V1 minimale.
  - B. Le minimum, dans `README.md` : une section « Tester » (commande, prérequis, durée) ; une section « Proposer un changement » (le mainteneur attribue le numéro de version à la fusion ; les règles de `CLAUDE.md` qui valent pour tous) ; « une branche par sujet » remplacé par ce qui est fait ; `README.en.md` ramené à un résumé stable qui renvoie au français.
  - C. `CONTRIBUTING.md`, modèles de ticket et de pull request, changelog par fragments (un fichier par pull request, assemblé à la fusion) pour permettre des pull requests en parallèle.
- Recommandation : B, dans la pull request de documentation de CHX-01. C seulement si Julien décide d'ouvrir le projet à d'autres.

## Questions à poser à Julien

Ce sont des décisions de Julien, ou des choix qui lui reviennent. Aucune n'est une faute.

1. **La règle « pas d'extension avant les tests avec des débutants » tient-elle encore ?** (CHX-04)
   - Pour qu'elle tienne : 59 constats confirmés par les trois premiers rapports, sur un travail que personne n'avait relu ; aucune fiche relue ; chaque fonction ajoutée apporte ses choix à confirmer (sept pour les grilles, onze pour les histogrammes) ; le protocole de test est prêt (`docs/propositions.md`, section 2), il ne manque que la grille de relevé (`docs/etat-des-travaux.md`, l. 84) et la version affichée à l'écran (ARC-12).
   - Pour qu'elle soit levée : les mots de Julien dans la nuit du 11 au 12 novembre (« vas aussi loins que possible ») ; les tests dépendent de sa disponibilité et de celle de cinq personnes, pas de Claude.
   - Mon avis : la garder, et placer les tests juste après les corrections de l'audit. Dans les deux cas, écrire la réponse dans `CLAUDE.md`.
2. **Six boîtiers de référence : le dire à l'écran, ou en garder moins ?**
   - Ce qu'est un boîtier dans le code : la taille du capteur, son nombre de pixels, son bruit, et la couverture de l'autofocus pour trois sur six (`app/src/camera/bodies.ts`, l. 13-31). Tout le reste, commandes, termes, cadences de rafale, réglages par défaut, vient du manuel du Nikon Z 6, et les aides le disent une par une (« Termes et cadences du manuel du Nikon Z 6 », `app/src/i18n.ts`, l. 170). La fenêtre « Boîtier de référence » ne le dit pas : elle affiche deux notes, sur le capteur et sur l'objectif (`app/simulateur/index.html`, l. 156-173).
   - Ce que coûtent six boîtiers avec la règle « rien sans source » : les capteurs du D5600, de l'A6000 et de l'EOS 2000D viennent d'un extrait de recherche, page non ouverte, et celui de l'EOS RP aussi, avant que Julien n'en relève la fiche (`bodies.ts`, l. 40-41, 56, 61 et 70-71 ; PHY-15) ; les manuels de l'EOS RP, de l'EOS 2000D et du D5600 sont introuvables depuis l'environnement de Claude (`docs/questions-ouvertes.md`, l. 34 et 43).
   - Voies : garder six et l'écrire dans la fenêtre du boîtier (« seuls le capteur, son bruit et la couverture de l'autofocus changent ; les commandes et les termes sont ceux du Nikon Z 6 ») ; ou ne garder que les boîtiers dont le manuel est lu ; ou sourcer chaque boîtier, ce qui multiplie le travail de chaque fonction.
   - Mon avis : la première voie. Elle tient en une phrase et applique le mot d'ordre : dire ce qui n'est pas réaliste.
3. **Les scènes suivantes : encore une photo à 360° pour décor ?**
   - La file de travail les donne déjà comme telles (`docs/etat-des-travaux.md`, l. 73) ; le dossier dit que c'est une proposition (`docs/dossiers/scenes.md`, l. 12), et la question est écrite « ouverte pour les autres scènes » (`docs/questions-ouvertes.md`, l. 12).
   - Ce que le dépôt sait déjà des limites d'un fond photo : image en 8 bits aux hautes lumières écrêtées (`docs/questions-ouvertes.md`, l. 24) ; perspective qui ne change pas quand l'appareil se déplace ou monte (`docs/propositions.md`, l. 81) ; éclairage figé, qui renvoie LUM-02 et les notions de lumière à plus tard (l. 84) ; scène « déclarée à 12,5 IL sans mesure de sa lumière » (`docs/questions-ouvertes.md`, l. 44) ; hauteur de prise de vue supposée (l. 26).
   - Ce que coûte l'autre voie : un seul arbre en 3D pèse 66,3 Mo, ou 11,9 Mo simplifié à 10 % (`docs/historique.md`, l. 100).
   - Mon avis : je ne sais pas trancher sans le dossier relu ; à décider scène par scène, en écrivant à l'écran ce que le fond ne simule pas.
4. **Bilingue : écrire l'anglais en même temps que le français, ou après sa relecture ?**
   - Décision du 6 novembre : bilingue dès la V1 (`docs/cadrage.md`, l. 32). Elle n'est pas en cause.
   - Ce que coûte l'écriture simultanée : chaque correction de fiche se fait deux fois (39 constats confirmés à corriger dans 44 pages), et la relecture prévue porte sur les deux langues (`data/relecture.yaml`) ; `README.en.md` a 35 versions de retard, et trois titres anglais ne sont déjà plus ceux du référentiel (CHX-05).
   - Voie possible : la relectrice relit le français ; l'anglais est remis d'aplomb à partir du français relu, puis relu à son tour.
   - Mon avis : garder les deux arbres et le contrôle de la construction ; faire porter la relecture d'abord sur le français.

## Ce qui manque pour qu'un contributeur extérieur comprenne le projet

Dans l'ordre où il buterait (détail : CHX-09).

1. Une page qui décrive l'application telle qu'elle est : `docs/architecture.md` décrit un produit en 2.5D qui n'existe pas (ARC-09).
2. Comment tester : rien dans `README.md` ; la routine demande un outil installé hors du dépôt et près d'une heure sur une machine sans carte graphique.
3. Quelles règles valent pour lui : `CLAUDE.md` mêle les règles du projet et les consignes de l'agent.
4. Comment proposer un changement : le numéro de version à prendre, les pages à mettre à jour, qui fusionne.
5. Où en est le projet : `README.md` date son état du 8 novembre, et le site ne dit pas sa version (ARC-12).
6. Ce qui est décidé et ce qui est ouvert : réparti entre `docs/historique.md`, `docs/propositions.md`, `docs/questions-ouvertes.md` et `docs/etat-des-travaux.md` (CHX-01, CHX-10).
7. En anglais : un README à jour, qui dise que la documentation est en français.

## Vérifié

Choix de fond et leurs sources.

- Moteurs comparés : les étiquettes citées par `docs/pile-technique.md` pointent les commits écrits (`r187` : `7e89746` ; `9.35.0` : `00bc37c` ; `v2.23.3` : `b7655d8` ; `v0.0.28` : `80d1888` ; `v8.1.8` : `29768a4`), d'après `git ls-remote`.
- three.js r187, `DepthOfFieldNode.js` : flou par `smoothstep( 0, this.focalLengthNode, … )` (l. 376) et « A unitless value for artistic purposes to adjust the size of the bokeh » (l. 33) : « artistique » est juste.
- three.js r187, `BokehShader2.js` : focale en millimètres, `CoC = 0.03`, résultat ramené entre 0 et 1 (`blur = clamp(blur,0.0,1.0)`, l. 310) ; `MotionBlur.js` : 16 échantillons par défaut : exact.
- Babylon.js 9.35.0, `thinMotionBlurPostProcess.ts` : flou par objet par défaut, 32 échantillons, `motionStrength` à 1 ; `NOTICE.md` existe à la racine du dépôt : exact.
- PlayCanvas 2.23.3, `camera-frame.js` : profondeur de champ réglée par `focusDistance`, `focusRange` et `blurRadius`, sans ouverture ni focale : exact.
- three-gpu-pathtracer 0.0.28 : « The project requires WebGPU. » et « Only MeshStandardMaterial and MeshPhysicalMaterial are supported. » (README) ; `PhysicalCamera.js` porte `fStop`, `focusDistance` et `apertureBlades`, avec `bokehSize = getFocalLength() / fStop` ; dépendances `three >=0.187.0`, `three-mesh-bvh` et `xatlas-web` : exact.
- Tableau des navigateurs : ses sept lignes sont celles de `api/GPU.json` et de `api/WebGL2RenderingContext.json` de MDN, version 8.1.8.
- Limites de GitHub Pages (`docs/historique.md`, l. 66) : site publié de 1 Go au plus, bande passante « soft » de 100 Go par mois, déploiement de 10 minutes au plus : ce sont les termes de la source. « Pas d'usage commercial » résume « not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS) ».
- Marge sur ces limites : le site construit pèse 40 438 621 octets (copie du 12 novembre) ; 100 Go ÷ 40,4 Mo ≈ 2 470 chargements complets par mois, sans le cache du navigateur ; 1 Go ÷ 36 Mo ≈ 27 scènes du poids de celle du parc. Le calcul de `docs/historique.md`, l. 67 (2 000 chargements pour une scène supposée de 50 Mo) est juste. Le dépôt lui-même porte 34,4 Mio de scène, sans fichier remplacé dans l'historique (40 blobs pour 38 fichiers).
- `docs/publication.md` : GitHub Pages n'est offert, sans offre payante, qu'aux dépôts publics : exact (`data/reusables/gated-features/pages.md`).
- Débit (`docs/questions-ouvertes.md`, l. 52) : 34 × 2²⁰ × 8 ÷ 2 000 000 = 143 s, soit 2 min 23 s ; à 1 Mbit/s, 285 s : exact à une seconde près.
- Public sans smartphone, 3D de synthèse, V1 minimale d'une scène et de trois situations, bilinguisme, licences, hébergement, moteur, fond à 360° de la scène de parc, protocole de test à cinq testeurs : chacun a sa décision de Julien, datée, dans `docs/historique.md`, `docs/cadrage.md` ou `docs/propositions.md`.
- Les lectures de Claude sont écrites comme telles (« comprise comme », « Claude le comprend comme », « lecture de Claude », « estimation de Claude ») : aucune n'est présentée comme une décision de Julien.

Données.

- `python3 scripts/validate.py` : 191 notions, 49 situations, 172 sources, 0 erreur, 0 avertissement. `python3 scripts/coverage.py` : 13 notions couvertes sur 191, le chiffre de `README.md`.
- Les 47 adresses distinctes citées par les fiches (113 liens) sont toutes dans `data/sources.yaml` ; les identifiants de sources cités entre crochets dans `app/src/` y sont tous.
- Titres français : les 22 fiches françaises portent le titre du référentiel ; les dix titres de `challenges.ts` sont ceux du référentiel, dans les deux langues.
- Numérotation des versions : entre `v0.3.0` et `main`, aucune notion ni situation n'est ajoutée, retirée ou reclassée ; garder Y à 3 suit la règle de `CHANGELOG.md`. Seul LUM-02 a reçu `activity: true`.

Déroulé d'une version et CI.

- « Jamais de push sur `main` » : un seul commit hors fusion, le premier (`e89680d`), cas dit par `docs/historique.md`, l. 42 ; les 63 autres commits du premier parent sont des commits de fusion, sans squash.
- « CI verte avant la fusion » : pour les 63 pull requests fusionnées, le dernier passage de chaque workflow sur le commit de tête est un succès.
- Tags et releases : 60 tags et 60 releases, de `v0.2.3` à `v0.3.57`, posés par le workflow ; `python3 scripts/changelog.py check` passe sur les 64 versions du changelog.
- Actions épinglées : les cinq empreintes de commit des workflows sont celles des étiquettes écrites en commentaire, et ces étiquettes sont les dernières (`git ls-remote`).
- gitleaks : l'empreinte SHA-256 de `validate.yml`, l. 63, est celle que donne le fichier d'empreintes de la release 8.30.1 pour l'archive `linux_x64`.
- Droits des workflows : `contents: read` partout, `contents: write` pour `tag.yml` seul, `pages: write` et `id-token: write` pour le seul job de publication.
- Coût de la CI hors routine : sur les cinq derniers passages, les jobs `validate`, `confidentialite` et `app` durent de 6 à 20 secondes chacun ; sur les trois dernières publications, la construction et le déploiement du site prennent de 27 à 46 secondes à eux deux. La construction refaite dans chaque job de la routine prend 6 secondes : ce n'est pas un coût.
- Machines de la CI gratuites pour un dépôt public (citation dans CHX-07).
- Échecs de la CI en sept jours : 1 sur 214 pour la validation (téléchargement de gitleaks, 9 novembre) ; 4 sur 54 pour la publication (deux avant l'activation de GitHub Pages le 7 novembre, deux délais dépassés du déploiement le 9) ; la validation n'a donc encore arrêté aucune erreur du dépôt, les mêmes contrôles étant lancés avant chaque envoi.

Outils.

- Versions et licences écrites dans `docs/pile-technique.md` et `requirements.txt` : ce sont celles des registres (Vite 8.3.6, MIT ; TypeScript 7.0.2, Apache-2.0 ; Babylon.js 9.35.0, Apache-2.0 ; Playwright 1.63.0, Apache-2.0 ; PyYAML 6.0.3 et jsonschema 4.26.0, MIT).
- `npm audit` sur une copie de `app/package-lock.json` : aucune vulnérabilité connue le 13 novembre 2026. Le journal de Vite ne signale aucune correction de sécurité entre 8.3.6 et 8.3.8.
- Dépendances : trois paquets à l'exécution et deux au développement, 64 entrées dans le verrou (surtout les binaires par plateforme de Rolldown, de TypeScript et de Lightning CSS) ; deux paquets Python.
- `app/vite.config.ts` : polyfill de préchargement désactivé et un seul fichier JavaScript (`inlineDynamicImports`), comme l'écrit `docs/pile-technique.md`, l. 90-91.

## Je ne sais pas

- La question posée à Julien le 8 novembre 2026, à laquelle « 1,2,3 » répondait : la conversation n'est pas dans le dépôt.
- Si l'outillage (TypeScript, Vite) a bien été « décidé par Julien », comme l'écrit `docs/pile-technique.md`, l. 87 : `docs/historique.md`, l. 76-79, le liste sans dire qui a tranché.
- Ce que pèserait et coûterait la même application sur un autre moteur : rien n'est mesuré (CHX-02).
- PlayCanvas : « Aucun fichier de flou de mouvement dans le dépôt » (`docs/pile-technique.md`, l. 30). Non vérifié : je n'ai pas pu lister les fichiers du dépôt à l'étiquette.
- Les en-têtes de cache de GitHub Pages, donc le nombre réel de téléchargements par visiteur : site non joignable.
- Le chemin exact, dans l'interface de GitHub, pour créer une règle de branche, et si le job d'une matrice peut être requis par son nom : documentation non jointe pour ces deux points.
- Si l'outil de Claude peut pousser sur une autre branche que celle de la session : les 64 pull requests ont la même.
- Si créer une pull request par l'API évite le pied qui porte le lien de la session (CHX-11) : non essayé.
- Pourquoi le même profil de la routine dure de 7 à 23 minutes d'un passage à l'autre.
- Si Playwright 1.63.0 installera encore ses dépendances sur l'image qui succède à l'actuelle `ubuntu-latest`.
- La langue des cinq testeurs prévus, donc ce que l'anglais apporte aux tests de la V1 minimale.
- Si quelqu'un lit les 60 releases : aucune mesure n'est possible depuis la session.

## Ce qui est bien fait et doit rester

- Les décisions sont datées, attribuées, et les mots de Julien cités tels quels ; une lecture de Claude est dite comme une lecture. C'est ce qui a rendu cet audit possible.
- La comparaison des moteurs est faite sur le code source, à une version et à un commit nommés : chaque ligne relue se retrouve dans le fichier cité.
- Chaque dépendance a sa version, sa licence et la date de lecture ; il y en a très peu.
- Les actions sont épinglées par empreinte de commit, le binaire de gitleaks est vérifié par son empreinte, et chaque workflow n'a que les droits qu'il lui faut.
- Une version par pull request, avec son tag et sa release posés par un workflow à partir du changelog, et des commits de fusion : une version s'annule par un seul `git revert -m 1`.
- Les règles ont été tenues sans que rien n'y oblige : 63 fusions, toutes avec une CI verte, un seul commit direct sur `main`, celui du premier jour.
- Le format des fiches est strict, et la construction échoue en clair sur tout écart ; toutes les adresses des fiches sont dans `data/sources.yaml`.
- Identifiants stables, `retired.yaml`, schémas JSON et `validate.py` : le référentiel se contrôle en quelques secondes.
- L'hygiène du dépôt public : `check_public.py`, gitleaks sur tout l'historique, contrôle des descriptions, et des fuites racontées sans détour dans `docs/publication.md`.
- Le plan de repli de l'hébergement est écrit, avec les vraies limites de GitHub Pages.
- `docs/etat-des-travaux.md` comme point de reprise unique, et la règle du 13 novembre (un sujet à la fois, poussé dès le premier commit) : l'idée est la bonne ; il reste à tenir la page courte (CHX-01).
- La CI hors routine coûte moins d'une minute de machine par passage.

## Plan

Des changements ordonnés, chacun tenant en une pull request. Les constats ne sont pas contre-vérifiés : rien de ceci n'est à faire avant la réfutation (`CLAUDE.md`, l. 38).

0. Sans pull request : Julien répond aux quatre questions et, s'il le veut, active une règle de branche sur `main` (CHX-03, voie B).
1. Règles et point de reprise. `CLAUDE.md` : une table « quelle information dans quelle page » ; les l. 6, 8, 29 et 40 remises d'accord avec ce qui est fait et avec la réponse de Julien ; la règle d'entretien des versions. `docs/etat-des-travaux.md` réécrit : un seul état, une seule file, une table « Décisions en attente ». Suppression de `scripts/extract_reprise.py`. Constats : CHX-01, CHX-04, CHX-06, CHX-08, CHX-10. En premier, parce que chaque session suivante lit ces deux pages.
2. Pages de documentation. `docs/pile-technique.md` coupé en deux (la comparaison des moteurs, avec la note sur les deux effets qui ne servent plus ; la référence de l'outillage) ; `docs/questions-ouvertes.md` réduit à ce qui est ouvert ; `docs/historique.md` réservé aux décisions ; `README.md` et `README.en.md` : état court, sections « Tester » et « Proposer un changement ». Constats : CHX-01, CHX-02, CHX-09. À accorder avec le rapport `docs/audit/documentation.md` et avec la carte de l'application d'ARC-09.
3. Données. `validate.py` contrôle le titre de chaque fiche ; les titres du bulletin sont produits à la construction ; les trois titres anglais qui diffèrent sont tranchés. Constat : CHX-05.
4. CI, petits réglages. Scénario 3D non lancé sur une pull request en brouillon (CHX-07, voie C) ; Node.js de la CI sur la version LTS courante (CHX-08) ; `changelog.py` ne réessaie plus les trois premiers tags et les quatre liens sont corrigés (CHX-10) ; essai de création d'une pull request sans le pied (CHX-11).
5. Avec la refonte des tests du plan d'architecture (ARC-05) : un niveau « pages » de la routine, le filtre par chemins passé en condition de job pour pouvoir requérir la routine, Playwright dans un manifeste avec son verrou. Constats : CHX-07, CHX-03, CHX-08.
6. Première pull request d'entretien : Babylon.js, Vite et Playwright à leur dernière version, routine complète, versions citées dans la documentation. Après les refontes de l'audit, pas pendant : changer le moteur au milieu d'une refonte brouille la cause d'une régression. Constat : CHX-08.
