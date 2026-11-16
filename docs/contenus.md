# Contenus et couverture

Décidé le 7 novembre 2026, pendant la session 1. `scripts/coverage.py` applique ces règles.

## Emplacement

Les contenus sont en français seul depuis la version 0.3.60 (décision de Julien du 15 novembre 2026 : « Retire la traduction anglaise, on garde tout en full français. »). Avant, il y avait un arbre par langue, `content/fr/` et `content/en/`.

```text
content/
  notions/EXP-01.md
  situations/SIT-01.md
```

Le nom de fichier est l'identifiant stable de la notion ou de la situation.

## Fiche de notion

Une section de niveau 2 par brique, avec ces titres exacts (la casse ne compte pas) :

| Brique | Titre |
| --- | --- |
| Explication | `## Explication` |
| Simulateur | `## Simulateur` |
| Activité, si la notion a `activity: true` | `## Activité` |
| Exercice | `## Exercice` |
| Situation réelle, pour une notion `situations: all` ou sans situation | `## Situation réelle` |

Une section compte si son corps contient du texte. Les commentaires HTML (`<!-- ... -->`) sont ignorés : un modèle de fiche dont les sections ne contiennent que des commentaires compte comme vide.

## Fiche de situation

Une situation est rédigée quand son fichier existe et contient du texte hors commentaires HTML.

Plan retenu avec les premiers défis (version 0.3.39), confirmé par Julien le 11 novembre 2026, une section de niveau 2 par partie :

| Partie | Titre |
| --- | --- |
| Le cadre de la situation | `## Où, quand, quoi, pourquoi` |
| Les réglages et leurs raisons, avec un plan B | `## Recette` |
| Le défi jouable dans le simulateur | `## Défi` |
| Les notions liées | `## Notions` |

Le solveur de situations étant en V2 (décision du 10 novembre 2026), la recette des situations de la V1 minimale est écrite à la main ; chaque chiffre y est calculé avec les formules sourcées du simulateur.

## Règle de couverture

- Explication, simulateur ou activité, exercice : la section existe et n'est pas vide. Une notion avec `activity: true` doit avoir la section Activité, les autres la section Simulateur.
- Situation réelle :
  - notion qui renvoie à des situations : au moins une de ces situations est rédigée ;
  - notion `situations: all` ou sans situation (LEC-03, RET-15) : la section Situation réelle existe et n'est pas vide.
- Une notion est couverte quand ses quatre briques existent. Jusqu'à la version 0.3.59, la règle les demandait en français et en anglais.
- Taux de couverture = notions couvertes ÷ notions du référentiel.

## Publication sur le site

Décisions de Julien du 11 novembre 2026, version 0.3.46, en français seul depuis la version 0.3.60 :
- chaque fiche est publiée sur le site, sous `fiches/` (`fiches/EXP-04.html`), avec un lien depuis l'accueil. Jusqu'à la version 0.3.59, les fiches étaient sous `fiches/fr/` et `fiches/en/` : ces adresses n'existent plus ;
- tant qu'elle n'est pas relue, une fiche porte le bandeau « Fiche en cours de relecture », et l'accueil la marque « en relecture ». Une fiche est relue quand elle figure dans `data/relecture.yaml`, contrôlé par `scripts/validate.py` ;
- `app/scripts/build-pages.mjs` convertit les fiches. Il ne reconnaît que :
  - un titre de niveau 1, `# ID · Titre`, en première ligne ;
  - les sections de niveau 2 des tableaux ci-dessus ;
  - des paragraphes et des listes à tirets ;
  - du gras (`**…**`) et des liens `[texte](https://…)`.

  Tout autre balisage, ou un code de notion ou de situation sans fiche, fait échouer la construction ;
- les codes de notions et de situations cités dans une fiche deviennent des liens vers leurs fiches ; la fiche d'une notion liste les situations dont la section « Notions » la cite.
- activités interactives (version 0.3.50) : une notion qui a une section « Activité » et une page d'activité (`app/activites/<ID>/`, construite par Vite) propose « Faire l'activité » au lieu d'« Ouvrir le simulateur ». Première activité : LUM-02, un schéma vu de côté (source, objet, mur) où l'on règle la taille et la distance de la source et où l'on voit l'ombre pleine et la pénombre ; calcul par triangles semblables, expliqué dans la fiche et dans `app/src/activities/lum02.ts` ;
- depuis le simulateur (version 0.3.47) : la fiche d'une situation qui a une section « Défi » propose « Jouer le défi », qui ouvre le simulateur avec ce défi (`simulateur/?defi=SIT-05`) ; les notions « À revoir » du bulletin et le bouton « Fiche » de la fenêtre « Défis » ouvrent la fiche dans une fenêtre par-dessus le simulateur, sans perdre la scène ni les réglages. Dans cette fenêtre, les liens vers d'autres fiches y restent, et les liens vers les sources s'ouvrent dans un nouvel onglet.

## Limite connue

La brique simulateur est comptée par sa section de fiche. Quand les simulateurs existeront, il faudra décider comment relier cette section au simulateur réel.
