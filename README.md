# TutoPhoto

Boîte à outils open source, en français, qui apprend la photo aux débutants par la simulation : régler son appareil, faire la mise au point, choisir ses collimateurs, et réussir une photo dans une situation donnée (où, quand, quoi, pourquoi).

TutoPhoto est le nom du projet. L'application est publiée sur GitHub Pages : https://badmiaoo.github.io/TutoPhoto/ (accueil et fiches ; le simulateur est sous `simulateur/`)

## État

- Cadrage et référentiel à l'état de brouillon, à remettre en question ; application en construction. Une fiche que les relecteurs n'ont pas encore vérifiée le dit sous son titre (« Fiche en cours de relecture »).
- Pour débutants avec un boîtier reflex ou hybride. Scènes en 3D de synthèse ; on commence par une V1 minimale (une scène de parc, trois situations), à faire essayer par des débutants.
- Ce qui est en ligne : [le site](https://badmiaoo.github.io/TutoPhoto/), dont l'accueil et la fenêtre « Crédits de la scène » du simulateur (bouton « Crédits ») donnent la version. Ce que chaque version a changé : [CHANGELOG.md](CHANGELOG.md) ; le modèle de l'appareil simulé, et ce qu'il ne simule pas : [docs/camera-physique.md](docs/camera-physique.md).

## Contenu du dépôt

| Chemin | Rôle |
| --- | --- |
| `data/` | Référentiel (`data/referentiel/`), situations, sources et jalons : la source de vérité |
| `content/` | Fiches des notions et des situations, en Markdown, d'où la construction tire les fiches du site |
| `docs/` | Suivi (état des travaux, questions ouvertes, tests à faire faire) ; cadrage et décisions (historique, propositions et choix de Claude) ; contenus (fiches et couverture, lecture du référentiel) ; technique (architecture, pile technique, caméra physique) ; licences et publication ; audit du travail antérieur et plan de corrections (`docs/audit/`), dossiers de sources (`docs/dossiers/`), spécifications (`docs/specifications/`) |
| `schemas/` | Schémas JSON des fichiers de `data/` et des manifestes de scène |
| `app/` | Application (TypeScript, Babylon.js, Vite) ; scènes 3D et leurs crédits dans `app/public/scenes/` |
| `scripts/` | Validation, couverture et contrôles (scènes 3D, dépôt public, changelog) ; routine de test du site construit |
| `REPRISE.md` | Fichier de reprise du 7 novembre 2026, gardé tel quel comme archive |
| `CLAUDE.md` | Règles de travail |
| `CHANGELOG.md` | Versions et tags |
| `LICENSE`, `LICENSES/` | Textes des licences |

Pour comprendre les fichiers de données : [docs/lire-le-referentiel.md](docs/lire-le-referentiel.md).

## Lancer l'application

Node.js 22, à partir de la version 22.23.5, la seule version de Node.js essayée :

```sh
cd app
npm ci
npm run dev      # serveur de développement
npm run build    # vérification des types, simulateur, accueil et fiches dans app/dist/
npm test         # tests rapides des formules (app/tests/)
```

## Tester le site construit

- `node scripts/test_app.cjs --photo`, depuis la racine du dépôt, sur le site construit par `npm run build` : la routine de test contrôle les liens internes de toutes les pages, puis ouvre l'accueil, des fiches, l'activité de LUM-02 et le simulateur sur quatre profils (ordinateur, Android, iPhone, WebGL 1), l'un après l'autre, et, avec `--photo`, calcule des photos ; `--profils ordinateur` n'en lance qu'un. Chromium seul, en rendu logiciel : les profils de téléphone émulent l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari.
- Elle demande Playwright et son Chromium, installés hors du dépôt, le dossier de Playwright donné à Node.js par `NODE_PATH`, comme dans la CI ; la version à installer est celle de la CI, `PLAYWRIGHT_VERSION` dans `.github/workflows/routine.yml`. Sans Playwright, elle s'arrête et donne les commandes d'installation.
- La CI la lance sur chaque pull request qui touche `app/`, `content/`, `data/` ou la routine, un job par profil, en parallèle : à la version 0.4.10, de 24 à 49 minutes par job.

## Vérifier le référentiel

```sh
pip install -r requirements.txt
python3 scripts/validate.py
python3 scripts/coverage.py
```

`validate.py` sort en erreur si le référentiel est incohérent, ou si une adresse d'une fiche, du code ou d'une page de `docs/` manque à `data/sources.yaml` ; il tourne aussi sur chaque pull request.

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
