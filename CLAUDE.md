# CLAUDE.md

Simulateur photo open source, bilingue FR/EN, pour débutants avec un boîtier reflex ou hybride (pas de smartphone, de compact ni de bridge). Scènes en 3D de synthèse ; V1 minimale d'abord (scène de parc : SIT-01, SIT-05, SIT-06), testée avec des débutants.
Publication : site statique, d'abord sur GitHub Pages ; tout tourne dans le navigateur. Moteur 3D : Babylon.js (`docs/pile-technique.md`).
Source de vérité : `data/` (référentiel, situations, sources, jalons). Contexte et décisions : `docs/`.
Archive de reprise : `REPRISE.md`.

`REPRISE.md`, et `docs/` qui en est copié, sont un brouillon : probablement incomplet, mal écrit par endroits, avec des erreurs. Tout peut être remis en question, arguments et sources à l'appui ; Julien tranche.

## Règles
- Français, tutoiement, direct et structuré. Pas d'emoji, pas de formules emphatiques.
- Ne jamais inventer, extrapoler ou deviner. Information invérifiable : « Je ne sais pas ».
- Toute affirmation factuelle est sourcée (auteur, date, lien) ; les sources vont dans `data/sources.yaml`.
- Expliquer le calcul de toute donnée discutable.
- Proposer l'approche avant de produire ; Julien tranche.
- Contenu juridique pays par pays, à partir des textes officiels.

## Dépôt
- Jamais de push sur `main` : une branche et une pull request par sujet.
- `python3 scripts/validate.py` avant toute pull request qui touche `data/`.
- Claude fusionne lui-même ses pull requests quand la CI est verte sur le dernier commit (commit de fusion, pas de squash), puis vérifie que le tag de version a été posé.
- Chaque pull request fusionnée est une version : elle ajoute sa section à `CHANGELOG.md` (contrôlée par `python3 scripts/changelog.py check --base origin/main`), et le workflow `tag.yml` pose le tag annoté `vX.Y.Z` sur son commit de fusion et publie la release GitHub. Numérotation dans `CHANGELOG.md`.
- Identifiants stables, jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants.
- Vérifier la licence de toute dépendance, de tout modèle et de toute scène avant de l'ajouter.
- Licences (`docs/licences.md`) : code sous MIT, contenus et données sous CC BY-SA 4.0 ; modèles et textures 3D de tiers sous CC0 ou CC BY uniquement, avec auteur, adresse d'origine et licence dans les métadonnées de la scène.
