# Changelog

Évolutions du dépôt, de la plus récente à la plus ancienne. Chaque pull request fusionnée donne une version : elle ajoute ici sa section, que la CI contrôle (`scripts/changelog.py check`). Après la fusion, le workflow `.github/workflows/tag.yml` pose le tag annoté `vX.Y.Z` sur le commit de fusion et publie la release GitHub correspondante, avec le texte de cette section.

## Numérotation `vX.Y.Z`

- X : 0 jusqu'à la publication de la V1.
- Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`.
- Z : tout le reste (textes, sources, documentation, scripts, CI) ; remis à 0 quand Y augmente.

## Rubriques

Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré.

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
