# CLAUDE.md

Simulateur photo open source, bilingue FR/EN, pour débutants. V1 en 2.5D ; V2 = passage en 3D.
Source de vérité : `data/` (référentiel, situations, sources). Contexte et décisions : `docs/`.
Archive de reprise : `REPRISE.md`.

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
- Identifiants stables, jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Pas de 3D avant la validation de la maquette 2.5D.
- Vérifier la licence de toute dépendance, de tout modèle et de toute scène avant de l'ajouter.
