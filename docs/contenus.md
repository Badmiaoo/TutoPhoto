# Contenus et couverture

Décidé le 7 novembre 2026, pendant la session 1. `scripts/coverage.py` applique ces règles.

## Emplacement

Un arbre complet par langue :

```text
content/
  fr/
    notions/EXP-01.md
    situations/SIT-01.md
  en/
    notions/EXP-01.md
    situations/SIT-01.md
```

Le nom de fichier est l'identifiant stable de la notion ou de la situation.

## Fiche de notion

Une section de niveau 2 par brique, avec ces titres exacts (la casse ne compte pas) :

| Brique | Français | Anglais |
| --- | --- | --- |
| Explication | `## Explication` | `## Explanation` |
| Simulateur | `## Simulateur` | `## Simulator` |
| Activité, si la notion a `activity: true` | `## Activité` | `## Activity` |
| Exercice | `## Exercice` | `## Exercise` |
| Situation réelle, pour une notion `situations: all` ou sans situation | `## Situation réelle` | `## Real-world situation` |

Une section compte si son corps contient du texte. Les commentaires HTML (`<!-- ... -->`) sont ignorés : un modèle de fiche dont les sections ne contiennent que des commentaires compte comme vide.

## Fiche de situation

Une situation est rédigée dans une langue quand son fichier existe et contient du texte hors commentaires HTML. Le plan de la fiche (recette, défi, bulletin) reste à définir avec les premiers défis.

## Règle de couverture

- Explication, simulateur ou activité, exercice : la section existe et n'est pas vide, dans la fiche française et dans la fiche anglaise. Une notion avec `activity: true` doit avoir la section Activité, les autres la section Simulateur.
- Situation réelle :
  - notion qui renvoie à des situations : au moins une de ces situations est rédigée en français et en anglais ;
  - notion `situations: all` ou sans situation (LEC-03, RET-15) : la section Situation réelle existe et n'est pas vide dans les deux fiches.
- Une notion est couverte quand ses quatre briques existent en français et en anglais.
- Taux de couverture = notions couvertes ÷ notions du référentiel.

## Limite connue

La brique simulateur est comptée par sa section de fiche. Quand les simulateurs existeront, il faudra décider comment relier cette section au simulateur réel.
