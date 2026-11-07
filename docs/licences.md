# Licences

Décidé par Julien le 7 novembre 2026. Les clauses citées ici ont été lues dans les textes des licences du dépôt de référence SPDX (`spdx/license-list-data`, commit `3184648` du 29 octobre 2026).

## Ce qui est sous quelle licence

| Quoi | Où | Licence |
| --- | --- | --- |
| Code | `scripts/`, `schemas/`, `.github/`, et le code de l'application à venir | MIT ([`LICENSE`](../LICENSE)) |
| Contenus | `content/` (à venir), `docs/`, `README.md`, `README.en.md`, `CHANGELOG.md`, `CLAUDE.md`, `REPRISE.md` | CC BY-SA 4.0 ([`LICENSES/CC-BY-SA-4.0.txt`](../LICENSES/CC-BY-SA-4.0.txt)) |
| Données | `data/` (référentiel, situations, sources, jalons) | CC BY-SA 4.0 |
| Modèles et textures 3D faits par d'autres | scènes 3D | la licence de chaque élément, qui doit être CC0 ou CC BY |

Titulaire indiqué dans `LICENSE` : « les contributeurs de TutoPhoto ».

## Ce que cela implique

- Code sous MIT : tout usage est permis, y compris commercial et dans du logiciel fermé, à condition d'inclure la notice de copyright et la notice de permission dans toutes les copies ([texte de la licence MIT](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/MIT.txt)).
- Contenus et données sous CC BY-SA 4.0 : réutilisation permise, y compris commerciale, avec attribution. Une adaptation partagée doit être placée sous une licence Creative Commons aux mêmes éléments, cette version ou une ultérieure, ou sous une licence déclarée compatible BY-SA (section 3(b) du [texte CC BY-SA 4.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC-BY-SA-4.0.txt)).
- Modèles et textures 3D de tiers : seulement sous CC0, qui renonce à tous les droits (section 2 du [texte CC0 1.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC0-1.0.txt)), ou sous CC BY, qui demande seulement d'attribuer l'œuvre. Ne sont pas acceptés : CC BY-SA, les licences avec clause NC (pas d'usage commercial) ou ND (pas de modification), et les licences propres à un site.

## Code de tiers dans le site publié

- Babylon.js (Apache-2.0) : sa licence et les mentions de son `NOTICE.md` sont recopiées dans le site construit, sous `licences/`, avec les licences du projet ; une page `licences/` les liste.

## Règles pour les scènes 3D

- Avant d'intégrer un modèle ou une texture, lire sa licence sur la page d'origine.
- Chaque élément porte, dans les métadonnées de sa scène : titre, auteur, adresse d'origine, licence et date de vérification. Le format de ces métadonnées sera fixé avec la pile technique.
- Les attributions CC BY sont affichées dans l'outil, avec la scène.
