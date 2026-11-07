# Changelog

Évolutions du dépôt, de la plus récente à la plus ancienne. Chaque pull request fusionnée donne une version : elle ajoute ici sa section, que la CI contrôle (`scripts/changelog.py check`). Après la fusion, le workflow `.github/workflows/tag.yml` pose le tag annoté `vX.Y.Z` sur le commit de fusion, avec le texte de cette section.

## Numérotation `vX.Y.Z`

- X : 0 jusqu'à la publication de la V1.
- Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (version, niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`.
- Z : tout le reste (textes, sources, documentation, scripts, CI) ; remis à 0 quand Y augmente.

## Rubriques

Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré.

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

[0.2.2]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Badmiaoo/TutoPhoto/tree/v0.2.0
