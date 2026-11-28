# CLAUDE.md

Simulateur photo open source, en français, pour débutants avec un boîtier reflex ou hybride (pas de smartphone, de compact ni de bridge). Scènes en 3D de synthèse ; V1 minimale d'abord (scène de parc : SIT-01, SIT-05, SIT-06), testée avec des débutants.
Publication : site statique sur GitHub Pages (https://badmiaoo.github.io/TutoPhoto/), à chaque fusion sur `main` ; tout tourne dans le navigateur. Moteur 3D : Babylon.js (`docs/pile-technique.md`) ; outillage, publication et tests : `docs/outillage.md`.
Source de vérité : `data/` (référentiel, situations, sources, jalons). Contexte et décisions : `docs/`.
Archive de reprise : `REPRISE.md`. État des travaux, pour reprendre à tout moment : `docs/etat-des-travaux.md`.
Mandat de Julien (15 novembre 2026) : finir la V1 en reprenant tout ce que l'audit a remonté, puis enchaîner sur la V2, puis sur une V3 qui ne touche pas au fonctionnel (ergonomie et interface seulement), Claude travaillant seul avec des relances automatiques. Ses mots, et ce que Claude en fait : `docs/etat-des-travaux.md`, « Mandat en cours ».

`REPRISE.md`, et les parties de `docs/` qui en sont reprises (leur en-tête le dit), sont un brouillon : probablement incomplet, mal écrit par endroits, avec des erreurs. Tout peut être remis en question, arguments et sources à l'appui ; Julien tranche.

## Règles
- Mot d'ordre partout : le réalisme. TutoPhoto est une sandbox de simulation pour s'entraîner ; à chaque choix de simulation, retenir le comportement le plus réaliste, sourcé, et dire ce qui ne l'est pas (Julien, 9 novembre 2026).
- On n'implémente que ce qui est sourcé. Le but : que des débutants découvrent la photo et maîtrisent leur boîtier et les bases (savoir ce qu'ils font, comprendre leurs erreurs, savoir régler et s'adapter), sans formations hors de prix ni informations glanées à droite et à gauche ; pas en faire des professionnels. Ce critère tranche les questions de conception (Julien, 10 novembre 2026 ; `docs/cadrage.md`).
- Français, tutoiement, direct et structuré. Pas d'emoji, pas de formules emphatiques.
- Ne jamais inventer, extrapoler ou deviner. Information invérifiable : « Je ne sais pas ».
- Toute affirmation factuelle est sourcée (auteur, date, lien) ; les sources vont dans `data/sources.yaml`.
- Expliquer le calcul de toute donnée discutable.
- Claude décide et produit sans attendre Julien ; il note chaque choix dans `docs/propositions.md`, avec sa raison et l'autre voie, et Julien confirme ou annule après coup (Julien, 15 novembre 2026). Une question pour Julien lui est posée dans la session, par une question à choix ; elle ne suspend que le travail qui en dépend.
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
- Toute pull request qui touche `app/` est testée sur ordinateur et sur mobile : `node scripts/test_app.cjs --photo` (ordinateur, Android, iPhone, WebGL 1), plus les tests propres au sujet ; faire le maximum de tests soi-même (Julien, 9 novembre 2026). Depuis la version 0.3.54, la CI lance cette routine sur la pull request, un job par profil (`routine.yml`) : attendre ses quatre jobs verts et reporter leurs résultats. Ces tests émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; les profils mobiles déclarent un écran tactile, mais un seul geste de la routine est un toucher, la fermeture d'une fenêtre par un toucher sur le fond (profil iPhone, depuis la version 0.4.10) : le dire dans la pull request, avec les résultats.
- Claude fusionne lui-même ses pull requests quand la CI est verte sur le dernier commit (commit de fusion, pas de squash), puis vérifie que le tag de version a été posé.
- Chaque pull request fusionnée est une version : elle ajoute sa section à `CHANGELOG.md` (contrôlée par `python3 scripts/changelog.py check --base origin/main`), et le workflow `tag.yml` pose le tag annoté `vX.Y.Z` sur son commit de fusion et publie la release GitHub. Numérotation dans `CHANGELOG.md`.
- Chaque pull request réécrit `docs/etat-des-travaux.md`, qui doit suffire à reprendre depuis une session neuve, sans rien d'autre que le dépôt : où on en est, la file de travail, ce qui attend Julien (Julien, 12 et 13 novembre 2026). Réécrit, pas complété : un seul état, sans récit (Sujet 5 du plan de corrections).
- Un seul sujet à la fois. Son premier commit est poussé aussitôt, dans une pull request en brouillon, et chaque étape ensuite : aucun sujet commencé ne reste sur la machine de Claude (Julien, 13 novembre 2026).
- Après chaque fusion, le travail repart d'une session neuve, à partir de `docs/etat-des-travaux.md` : une longue conversation relit tout son contenu à chaque action et épuise la limite d'usage (Julien, 13 novembre 2026). Si Julien est là, Claude lui dit de lancer `/clear` ; sinon Claude crée lui-même la session suivante sur le dépôt, avec la consigne de reprendre à partir de ce fichier, et la session finie s'arrête (Julien, 15 novembre 2026).
- Audit du travail antérieur (`docs/audit/`) : ne corriger que les constats contre-vérifiés par un second agent.
- Identifiants stables, jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml`.
- Les tests avec des débutants ne bloquent pas le travail (Julien, 15 novembre 2026) : Claude continue avec ses propres tests et tient à jour `docs/tests-a-faire-faire.md`, la liste des tests que Julien fera faire ; leurs résultats servent à ajuster.
- Vérifier la licence de toute dépendance, de tout modèle et de toute scène avant de l'ajouter.
- Licences (`docs/licences.md`) : code sous MIT, contenus et données sous CC BY-SA 4.0 ; modèles et textures 3D de tiers sous CC0 ou CC BY uniquement, avec auteur, adresse d'origine et licence dans les métadonnées de la scène.

## Quelle page pour quelle information
Une information, un endroit ; les autres pages y renvoient (accepté par Julien le 15 novembre 2026, décision D6).

| Information | Page |
| --- | --- |
| Ce qui a changé, version par version, avec ses essais et sa relecture : le seul récit | `CHANGELOG.md` |
| L'état, la file de travail, les décisions en attente de Julien, et les essais qu'il fera sur son téléphone, par leur numéro dans `docs/tests-a-faire-faire.md` | `docs/etat-des-travaux.md` |
| Les décisions de Julien, datées et citées ; rien d'autre | `docs/historique.md` |
| Les choix faits par Claude sans Julien, avec leur raison et l'autre voie | `docs/propositions.md` |
| Ce qui reste ouvert ou non sourcé dans la simulation et les contenus ; un point fermé en sort | `docs/questions-ouvertes.md` |
| Les tests que Julien fera faire, et leurs résultats | `docs/tests-a-faire-faire.md` |

Une page n'écrit pas « à confirmer » : ce qui attend Julien a sa ligne dans « Décisions en attente » de `docs/etat-des-travaux.md`, et la page y renvoie.
