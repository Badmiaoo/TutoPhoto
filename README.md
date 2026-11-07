# TutoPhoto

_English version: [README.en.md](README.en.md)._

Boîte à outils open source, en français et en anglais, qui apprend la photo aux débutants par la simulation : régler son appareil, faire la mise au point, choisir ses collimateurs, et réussir une photo dans une situation donnée (où, quand, quoi, pourquoi).

TutoPhoto est le nom du projet. L'application sera publiée comme site statique, d'abord sur GitHub Pages.

## État au 7 novembre 2026

- Cadrage et référentiel v0.2 à l'état de brouillon, à remettre en question : 191 notions en 13 domaines, 49 situations, 78 sources.
- Pour débutants avec un boîtier reflex ou hybride. Scènes en 3D de synthèse ; on commence par une V1 minimale (une scène de parc, trois situations), testée avec des débutants avant d'étendre.
- Pas encore de code applicatif ni de contenu rédigé : couverture 0 sur 191.

## Contenu du dépôt

| Chemin | Rôle |
| --- | --- |
| `data/` | Référentiel (`data/referentiel/`), situations, sources et jalons : la source de vérité |
| `docs/` | Cadrage, architecture, lecture du référentiel, contenus, licences, pile technique, questions ouvertes, historique |
| `schemas/` | Schémas JSON des fichiers de `data/` |
| `app/` | Application (TypeScript, Babylon.js, Vite) |
| `scripts/` | Extraction, validation et couverture |
| `REPRISE.md` | Fichier de reprise du 7 novembre 2026, gardé tel quel comme archive |
| `CLAUDE.md` | Règles de travail |
| `CHANGELOG.md` | Versions et tags |
| `LICENSE`, `LICENSES/` | Textes des licences |

Pour comprendre les fichiers de données : [docs/lire-le-referentiel.md](docs/lire-le-referentiel.md).

## Lancer l'application

Node.js 22 ou plus récent :

```sh
cd app
npm ci
npm run dev      # serveur de développement
npm run build    # vérification des types et site statique dans app/dist/
```

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

- Code (`scripts/`, `schemas/`, `.github/`, application à venir) : MIT, voir [LICENSE](LICENSE).
- Contenus et données (`content/`, `docs/`, `data/`, README, changelog) : CC BY-SA 4.0, voir [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).
- Modèles et textures 3D de tiers : CC0 ou CC BY uniquement, chacun avec son auteur et sa licence.

Détail : [docs/licences.md](docs/licences.md).
