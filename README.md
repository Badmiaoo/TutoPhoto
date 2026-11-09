# TutoPhoto

_English version: [README.en.md](README.en.md)._

Boîte à outils open source, en français et en anglais, qui apprend la photo aux débutants par la simulation : régler son appareil, faire la mise au point, choisir ses collimateurs, et réussir une photo dans une situation donnée (où, quand, quoi, pourquoi).

TutoPhoto est le nom du projet. L'application est publiée sur GitHub Pages : https://badmiaoo.github.io/TutoPhoto/

## État au 8 novembre 2026

- Cadrage et référentiel v0.2 à l'état de brouillon, à remettre en question : 191 notions en 13 domaines, 49 situations, 96 sources.
- Pour débutants avec un boîtier reflex ou hybride. Scènes en 3D de synthèse ; on commence par une V1 minimale (une scène de parc, trois situations), testée avec des débutants avant d'étendre.
- Application en construction : la scène de parc s'affiche (fond photo à 360°, banc, poubelles, quatre personnages, un chien qui court), avec un boîtier virtuel minimal : ouverture, vitesse, ISO, focale, cellule et aperçu de l'exposition, mise au point en touchant le viseur, photo calculée au déclenchement (profondeur de champ et flou de mouvement) bruit numérique physique et aperçu réglable dans le viseur. Pas encore de flou de bougé. Pas encore de contenu rédigé : couverture 0 sur 191.

## Contenu du dépôt

| Chemin | Rôle |
| --- | --- |
| `data/` | Référentiel (`data/referentiel/`), situations, sources et jalons : la source de vérité |
| `docs/` | Cadrage, architecture, lecture du référentiel, contenus, licences, pile technique, caméra physique, publication, questions ouvertes, historique |
| `schemas/` | Schémas JSON des fichiers de `data/` et des manifestes de scène |
| `app/` | Application (TypeScript, Babylon.js, Vite) ; scènes 3D et leurs crédits dans `app/public/scenes/` |
| `scripts/` | Extraction, validation, couverture et contrôles (scènes 3D, dépôt public, changelog) |
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
- Toute scène 3D passe par `scripts/check_scenes.py` : chaque fichier figure dans le manifeste `scene.json` de sa scène, avec son auteur, sa licence (CC0 ou CC BY) et son empreinte.
- Les identifiants sont stables : jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Toute affirmation factuelle est sourcée ; les sources vont dans `data/sources.yaml`.
- Dépôt public : aucun secret, aucune donnée personnelle, aucun lien privé ([docs/publication.md](docs/publication.md)) ; `python3 scripts/check_public.py --commits all` le vérifie.
- Chaque pull request fusionnée donne une version, décrite dans [CHANGELOG.md](CHANGELOG.md) et marquée par un tag `vX.Y.Z`.

## Licence

- Code (`scripts/`, `schemas/`, `.github/`, `app/` hors modèles et textures de tiers) : MIT, voir [LICENSE](LICENSE).
- Contenus et données (`content/`, `docs/`, `data/`, README, changelog) : CC BY-SA 4.0, voir [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).
- Modèles, textures et photos 3D de tiers (`app/public/scenes/`) : CC0 ou CC BY uniquement, chacun avec son auteur et sa licence, affichés dans l'application (bouton « Crédits »).

Détail : [docs/licences.md](docs/licences.md).
