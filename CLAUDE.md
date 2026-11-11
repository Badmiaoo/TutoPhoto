# CLAUDE.md

Simulateur photo open source, bilingue FR/EN, pour débutants avec un boîtier reflex ou hybride (pas de smartphone, de compact ni de bridge). Scènes en 3D de synthèse ; V1 minimale d'abord (scène de parc : SIT-01, SIT-05, SIT-06), testée avec des débutants.
Publication : site statique sur GitHub Pages (https://badmiaoo.github.io/TutoPhoto/), à chaque fusion sur `main` ; tout tourne dans le navigateur. Moteur 3D : Babylon.js (`docs/pile-technique.md`).
Source de vérité : `data/` (référentiel, situations, sources, jalons). Contexte et décisions : `docs/`.
Archive de reprise : `REPRISE.md`.

`REPRISE.md`, et `docs/` qui en est copié, sont un brouillon : probablement incomplet, mal écrit par endroits, avec des erreurs. Tout peut être remis en question, arguments et sources à l'appui ; Julien tranche.

## Règles
- Mot d'ordre partout : le réalisme. TutoPhoto est une sandbox de simulation pour s'entraîner ; à chaque choix de simulation, retenir le comportement le plus réaliste, sourcé, et dire ce qui ne l'est pas (Julien, 9 novembre 2026).
- On n'implémente que ce qui est sourcé. Le but : que des débutants découvrent la photo et maîtrisent leur boîtier et les bases (savoir ce qu'ils font, comprendre leurs erreurs, savoir régler et s'adapter), sans formations hors de prix ni informations glanées à droite et à gauche ; pas en faire des professionnels. Ce critère tranche les questions de conception (Julien, 10 novembre 2026 ; `docs/cadrage.md`).
- Français, tutoiement, direct et structuré. Pas d'emoji, pas de formules emphatiques.
- Ne jamais inventer, extrapoler ou deviner. Information invérifiable : « Je ne sais pas ».
- Toute affirmation factuelle est sourcée (auteur, date, lien) ; les sources vont dans `data/sources.yaml`.
- Expliquer le calcul de toute donnée discutable.
- Proposer l'approche avant de produire ; Julien tranche.
- Contenu juridique pays par pays, à partir des textes officiels.

## Dépôt public : rien ne doit filtrer (`docs/publication.md`)
- Ne jamais écrire dans un fichier, un message de commit, une pull request ou un commentaire : secret (jeton, clé, mot de passe, clé privée), donnée personnelle (adresse électronique hors « noreply », téléphone, adresse postale), lien vers une ressource privée (Claude, Google Docs ou Drive, Dropbox, Notion), chemin local qui révèle un nom d'utilisateur. Seules exceptions : le nom de Julien comme auteur des commits et comme titulaire du copyright dans `LICENSE`.
- Commits uniquement avec une adresse « noreply ». Ni ligne « Claude-Session » ni lien vers une session Claude dans les commits et les pull requests (fuite du 8 novembre 2026, `docs/publication.md`).
- À la création d'une pull request, l'outil GitHub de Claude remplace le pied de la description par un pied avec le lien de la session : réécrire la description aussitôt, sans le lien. Le contrôle `description` de la CI échoue tant que le lien y est (11 novembre 2026, `docs/publication.md`).
- Un secret nécessaire à un workflow va dans les secrets GitHub du dépôt, jamais dans un fichier.
- `python3 scripts/check_public.py --commits all` avant toute pull request ; la CI le lance, avec gitleaks sur tout l'historique.
- Si quelque chose a fuité : le dire à Julien tout de suite ; un secret se révoque chez son émetteur, l'historique publié ne se réécrit pas.

## Dépôt
- Jamais de push sur `main` : une branche et une pull request par sujet.
- Julien autorise Claude à gérer la configuration de ce dépôt, et de lui seul (7 novembre 2026). Ce qui vit dans le dépôt (workflows, `.github/`) passe par une pull request ; un réglage de GitHub que les outils de Claude ne permettent pas de changer est indiqué à Julien, avec le chemin exact dans l'interface.
- `python3 scripts/validate.py` avant toute pull request qui touche `data/` ; `cd app && npm run build` avant toute pull request qui touche `app/` ; `python3 scripts/check_scenes.py` avant toute pull request qui touche `app/public/scenes/`.
- Toute pull request qui touche `app/` est testée sur ordinateur et sur mobile : `node scripts/test_app.cjs --photo` (ordinateur, Android, iPhone, WebGL 1), plus les tests propres au sujet ; faire le maximum de tests soi-même (Julien, 9 novembre 2026). Ces tests émulent l'écran, le toucher et le navigateur, pas le processeur graphique ni Safari : le dire dans la pull request, avec les résultats.
- Claude fusionne lui-même ses pull requests quand la CI est verte sur le dernier commit (commit de fusion, pas de squash), puis vérifie que le tag de version a été posé.
- Chaque pull request fusionnée est une version : elle ajoute sa section à `CHANGELOG.md` (contrôlée par `python3 scripts/changelog.py check --base origin/main`), et le workflow `tag.yml` pose le tag annoté `vX.Y.Z` sur son commit de fusion et publie la release GitHub. Numérotation dans `CHANGELOG.md`.
- Identifiants stables, jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants.
- Vérifier la licence de toute dépendance, de tout modèle et de toute scène avant de l'ajouter.
- Licences (`docs/licences.md`) : code sous MIT, contenus et données sous CC BY-SA 4.0 ; modèles et textures 3D de tiers sous CC0 ou CC BY uniquement, avec auteur, adresse d'origine et licence dans les métadonnées de la scène.
