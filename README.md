# TutoPhoto

_English version: [README.en.md](README.en.md)._

Boîte à outils open source, en français et en anglais, qui apprend la photo aux débutants par la simulation : régler son appareil, faire la mise au point, choisir ses collimateurs, et réussir une photo dans une situation donnée (où, quand, quoi, pourquoi).

« TutoPhoto » est le nom du dépôt ; le nom du projet n'est pas encore choisi.

## État au 7 novembre 2026

- Cadrage et référentiel v0.2 à l'état de brouillon, à remettre en question : 191 notions en 13 domaines, 49 situations (42 en V1, 7 en V2), 78 sources.
- V1 en 2.5D : de vraies photos et leur carte de profondeur. V2 : uniquement le passage en 3D et ce qu'il débloque.
- Pas encore de code applicatif ni de contenu rédigé : couverture 0 sur 191.

## Contenu du dépôt

| Chemin | Rôle |
| --- | --- |
| `data/` | Référentiel (`data/referentiel/`), situations et sources : la source de vérité |
| `docs/` | Cadrage, architecture, lecture du référentiel, V2 en 3D, contenus, questions ouvertes, historique |
| `schemas/` | Schémas JSON des fichiers de `data/` |
| `scripts/` | Extraction, validation et couverture |
| `REPRISE.md` | Fichier de reprise du 7 novembre 2026, gardé tel quel comme archive |
| `CLAUDE.md` | Règles de travail |
| `CHANGELOG.md` | Versions et tags |

Pour comprendre les fichiers de données : [docs/lire-le-referentiel.md](docs/lire-le-referentiel.md).

## Vérifier le référentiel

```sh
pip install -r requirements.txt
python3 scripts/validate.py
python3 scripts/coverage.py
```

`validate.py` sort en erreur si le référentiel est incohérent ; il tourne aussi sur chaque pull request.

## Contribuer

- Une branche et une pull request par sujet ; pas de push direct sur `main`.
- Toute modification de `data/` passe par `scripts/validate.py`.
- Les identifiants sont stables : jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Toute affirmation factuelle est sourcée ; les sources vont dans `data/sources.yaml`.
- Chaque pull request fusionnée donne une version, décrite dans [CHANGELOG.md](CHANGELOG.md) et marquée par un tag `vX.Y.Z`.

## Licence

Pas encore choisie : c'est une question ouverte ([docs/questions-ouvertes.md](docs/questions-ouvertes.md)).
