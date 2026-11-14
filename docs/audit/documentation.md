# Audit du lot « Documentation : exactitude, cohérence, décisions rapportées »

État : constats non contre-vérifiés

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire.
- Version auditée : copie de travail de la branche de l'audit (version 0.3.58 en cours), pour ce qui date de la version 0.3.53 ou d'avant. Ce qui a été écrit depuis (versions 0.3.54 à 0.3.58) est lu quand il rapporte le travail antérieur ; une erreur qui s'y trouve est notée, sans en faire le sujet de l'audit.
- Rapport écrit au fur et à mesure : ce qui n'est pas encore couvert est dit dans « Reste à couvrir », en bas de cet en-tête.

## Périmètre

- `CLAUDE.md`, `README.md`, `README.en.md`, `REPRISE.md`, `CHANGELOG.md` (cohérence des versions jusqu'à 0.3.53 : tag, date, fichiers annoncés dans le commit de fusion).
- `docs/architecture.md`, `docs/cadrage.md`, `docs/contenus.md`, `docs/etat-des-travaux.md`, `docs/historique.md`, `docs/lire-le-referentiel.md`, `docs/pile-technique.md`, `docs/propositions.md`, `docs/questions-ouvertes.md`.
- Hors du lot : `docs/camera-physique.md` (rapport `modele-physique.md`), `docs/licences.md` et `docs/publication.md` (rapport `licences-scripts-ci.md`), `docs/audit/`, `docs/dossiers/`, `docs/specifications/`.
- Le recouvrement entre fichiers et le déroulé d'une version sont jugés par `choix-et-outils.md` (CHX-01, CHX-10) ; `docs/architecture.md` comme description d'un autre produit, par `architecture-application.md` (ARC-09) ; les champs que `docs/lire-le-referentiel.md` ne décrit pas, par `referentiel-structure.md` (RST-11). Ces constats ne sont pas refaits ici : ce rapport juge l'exactitude.

## Méthode

1. Lecture complète des fichiers du lot (`REPRISE.md` : voir « Reste à couvrir »).
2. Chaque affirmation vérifiable est confrontée au dépôt : fichiers, scripts, comptes (`python3 scripts/coverage.py`, `python3 scripts/validate.py`), versions (`app/package.json`, workflows), historique git (`git log`, `git show`, `git ls-remote --tags origin`).
3. Contrôles par script, écrits pour cet audit :
   - `versions.py` : pour chaque section de `CHANGELOG.md`, le tag, son type, le commit visé, sa date (UTC et heure de Paris), son nombre de parents, et la section en tête du changelog à ce commit ;
   - `annonces.py` : pour chaque version, les fichiers que sa section nomme sont-ils dans le diff de son commit de fusion ;
   - `regle_y.py` : entre deux tags, une notion ou une situation ajoutée, retirée ou reclassée ;
   - `liens.py` : liens relatifs et chemins cités entre accents graves, dans tous les fichiers du lot.
4. Sources relues à leur adresse quand l'hôte répond ; liste plus bas.
5. Décisions de Julien : chaque décision rapportée est cherchée dans `docs/historique.md` et dans les messages de commit. La conversation entre Julien et Claude n'est pas dans le dépôt : une citation « mot pour mot » ne peut pas être contrôlée.

Scripts et pages enregistrées : dossier `audit/documentation/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`). Les numéros de ligne sont ceux de la copie de travail du 14 novembre 2026.

## Sources

Voir la section « Sources relues » en fin de rapport (remplie au fur et à mesure).

Non relues, hôte non joignable depuis la session de travail (proxy : 403) : le site publié (`badmiaoo.github.io`), la documentation de GitHub (`docs.github.com`), la page du cours de Marc Levoy (`graphics.stanford.edu`, `sites.google.com`), les manuels de Fujifilm (`fujifilm-dsc.com`), ManualsLib, OpenGameArt, et les sites juridiques cités par `docs/architecture.md`.

## Reste à couvrir

(Tenu à jour à chaque envoi.) Au premier envoi : `REPRISE.md` ; relecture des sources de `docs/architecture.md`, `docs/pile-technique.md`, `docs/propositions.md` et `docs/historique.md` ; `docs/contenus.md` et `docs/cadrage.md` confrontés aux scripts ; `docs/questions-ouvertes.md` question par question ; règles de `CLAUDE.md` une à une.

## Constats

### DOC-01 · faux · `README.en.md` est resté à la version 0.3.22 : il dit qu'aucun contenu n'est écrit et ne décrit ni les fiches, ni l'accueil, ni la plupart des fonctions du simulateur

- Endroit : `README.en.md`, l. 7, 9, 13 et 20.
- Ce qui est écrit : « Status as of 8 November 2026 » ; « […] and a magnifier up to 100%, in the viewfinder and on the photo. No camera shake yet. No written content yet: coverage 0 of 191. »
- Preuve :
  - `git log -- README.en.md` : dernier commit le 9 novembre 2026 (3f1822b, version 0.3.22). `README.md` a été modifié par quinze commits depuis, jusqu'au 12 novembre (8be11bd, version 0.3.57) ; à la version 0.3.22, les deux fichiers disaient la même chose (`git show v0.3.22:README.md`).
  - `python3 scripts/coverage.py`, le 14 novembre 2026 : « Couverture : 13 notion(s) sur 191 (6,8 %) », 19 fiches de notions et 3 fiches de situations dans chaque langue. `README.md`, l. 13, dit « couverture 13 sur 191 ».
  - Absents de la version anglaise, présents dans la version française (l. 7 et 13) : l'accueil et les fiches publiées, le simulateur sous `simulateur/`, les modes M, A et S, la correction d'exposition et l'ISO auto, AF-S et AF-C, les modes de zone AF et la détection des yeux, la zone couverte par l'autofocus, les modes de déclenchement, l'indicateur d'équilibre, la vue de dessus, les défis et le bulletin, les grilles, les histogrammes. La ligne `docs/` du tableau (l. 20) n'a pas « propositions à trancher ».
  - La phrase anglaise de la l. 13 a perdu deux virgules (« (depth of field and motion blur) physically based digital noise an adjustable viewfinder preview ») ; la phrase française avait le même défaut à la version 0.3.22, corrigé depuis.
  - `CHANGELOG.md` écrit « README » au singulier à partir de la version 0.3.26, « les README » avant : l'abandon de la version anglaise n'est noté nulle part, et aucun contrôle ne compare les deux fichiers.
- Règle touchée : le projet est « bilingue FR/EN » (`CLAUDE.md`, l. 3), et `README.md`, l. 3, renvoie à la version anglaise comme à son équivalent.
- Correction proposée : réécrire les l. 7 à 13 et 20 de `README.en.md` d'après `README.md` une fois celui-ci corrigé (DOC-02) ; pour que l'écart ne revienne pas, sortir l'état daté des deux README (un lien vers `docs/etat-des-travaux.md` et vers le site suffit) : il ne reste alors à traduire que ce qui ne change pas à chaque version.

### DOC-02 · faux · `README.md` : « 96 sources » (172), un titre daté du 8 novembre sur un état du 12, « quatre personnages » pour cinq personnes

- Endroit : `README.md`, l. 9, 11 et 13 ; `README.en.md`, l. 11 et 13 pour les mêmes nombres.
- Ce qui est écrit, et ce que dit le dépôt :

  | Ligne | Écrit | Dépôt |
  | --- | --- | --- |
  | 9 | « État au 8 novembre 2026 » | La l. 13 décrit la version 0.3.57 (histogrammes de l'écran de revue, fusionnée le 13 novembre) ; le titre n'a pas changé depuis la version 0.3.9. |
  | 11 | « 96 sources » | `python3 scripts/validate.py` : « 172 sources ». Nombre d'entrées de `data/sources.yaml` aux tags : 96 de `v0.3.9` à `v0.3.11`, 107 à `v0.3.12`, 151 à `v0.3.53`, 172 à `v0.3.57`. Le nombre est faux depuis le 8 novembre (version 0.3.12). |
  | 13 | « quatre personnages » ; en anglais « four people » | Quatre modèles, cinq personnes : Dennis, Sophia, Nathan, et « Fabienne & Percy 001 - Mother and Child » (`app/public/scenes/parc/scene.json`), dont le défi SIT-05 compte les deux (« Dennis, Sophia, Fabienne et Percy dans la zone nette », `CHANGELOG.md`, version 0.3.38). |
  | 13 | « dans la zone couverte par l'autofocus (environ 90 % du cadre) » | Vrai pour le Nikon Z 6 seulement : 88 % × 100 % pour le Canon EOS RP (version 0.3.43), environ 96,4 % × 96,4 % pour le Sony A7 III (version 0.3.45). |
  | 13 | « grilles de cadrage (tiers, seize cases) » | Quatre grilles depuis la version 0.3.56 (`app/src/i18n.ts`, l. 88-91 : tiers, seize cases, vingt-quatre cases, tiers et diagonales). |
  | 13 | « les fiches de 19 notions (les 16 de la V1 minimale, CMP-02, MES-06 et MES-07) » | Le jalon `v1-min` a 17 notions, CMP-02 comprise, depuis la version 0.3.56 (`data/jalons.yaml`) : 17 notions du jalon, plus MES-06 et MES-07. |

- Juste dans la même phrase : 191 notions, 13 domaines, 49 situations ; « couverture 13 sur 191 » ; « Pas encore de flou de bougé ».
- Correction proposée : remplacer le titre et les deux puces chiffrées par un état court qui ne se périme pas à chaque version (« État : voir `docs/etat-des-travaux.md` ; comptes : `python3 scripts/coverage.py` »), ou, si l'état reste dans le README, dater le titre du jour de la dernière version et corriger les six points. Écrire « quatre modèles de personnages (cinq personnes) ».

### DOC-03 · faux · `docs/etat-des-travaux.md` : « Les commits d'avant le 12 novembre 2026 avaient Julien pour committer et n'étaient pas signés »

- Endroit : `docs/etat-des-travaux.md`, l. 107.
- Preuve (`git log origin/main --no-merges --format='%cs|%an <%ae>|%cn <%ce>'`, 108 commits hors fusions) :

  | Jours | Commits | Auteur | Committer |
  | --- | --- | --- | --- |
  | 7 au 10 novembre | 70 | Claude, adresse « noreply » d'Anthropic | le même |
  | 10 et 11 novembre, et un le 12 | 29 | Julien, adresse « noreply » de GitHub | le même |
  | 12 et 13 novembre | 9 | Julien | Claude |

  Julien n'est donc committer que de 29 des 99 commits d'avant la forme actuelle, et il n'est ni auteur ni committer des 70 premiers.
- Preuve (signature) : chacun des 108 commits porte un en-tête `gpgsig` (« -----BEGIN SSH SIGNATURE----- »), dès le premier (e89680d). Ils sont signés ; ce que GitHub en affiche (« Verified » ou non) dépend de la clé et du committer.
- Je ne sais pas ce que GitHub affiche pour chaque période : l'outil de lecture utilisé ne rend pas le champ de vérification.
- Conséquence : `CLAUDE.md`, l. 16, donne pour seule exception « le nom de Julien comme auteur des commits » ; les 70 premiers commits ont « Claude » pour auteur, ce qui n'enfreint rien, mais `docs/historique.md`, l. 83 (« Son nom comme auteur des commits est accepté », 7 novembre), laisse croire que les commits portaient son nom dès ce jour.
- Correction proposée : écrire « Jusqu'au 10 novembre 2026, auteur et committer : Claude (adresse "noreply" d'Anthropic) ; les 10 et 11 novembre, auteur et committer : Julien ; depuis le 12 novembre, auteur Julien et committer Claude. Tous les commits portent une signature SSH ; ce que GitHub affiche pour chaque période est à relever sur la page des commits. »

### DOC-04 · à améliorer · `CHANGELOG.md` : trois versions sans tag, trois versions datées de la veille de leur fusion, et rien ne dit de quoi la date est la date

- Endroit : `CHANGELOG.md`, l. 3 (« le workflow […] pose le tag annoté `vX.Y.Z` sur le commit de fusion »), titres des sections 0.3.37, 0.3.53 et 0.3.57, liens des l. 950-953 ; `CLAUDE.md`, l. 31.
- Preuve (`versions.py`, `git ls-remote --tags origin`) :
  - 64 sections, 60 tags sur GitHub, de `v0.2.3` à `v0.3.57`, tous annotés, chacun sur un commit de fusion à deux parents du premier parent de `main`, et la section en tête du changelog à ce commit est bien celle de la version. La version 0.3.58 est en cours.
  - Sans tag : `v0.2.0`, `v0.2.1`, `v0.2.2`. La section 0.2.4 l'explique (référence refusée au jeton du workflow, « commande pour poser le tag à la main ») ; les tags n'ont pas été posés depuis, et les quatre liens des l. 950-953 visent des tags absents. Déjà relevé par `choix-et-outils.md` (CHX-10, tableau) : non recompté ici.
  - Dates : le titre porte le jour où la section a été écrite, pas celui de la fusion, pour trois versions.

    | Version | Date du titre | Commit de fusion | Fusion (UTC) | Fusion (heure de Paris) |
    | --- | --- | --- | --- | --- |
    | 0.3.37 | 2026-11-10 | 07549b2 | 11 novembre, 0 h 33 | 11 novembre, 1 h 33 |
    | 0.3.53 | 2026-11-11 | 7a19af2 | 12 novembre, 5 h 54 | 12 novembre, 6 h 54 |
    | 0.3.57 | 2026-11-12 | 8a0c894 | 13 novembre, 6 h 08 | 13 novembre, 7 h 08 |

    Les 57 autres versions étiquetées sont datées du jour de leur fusion, dans les deux fuseaux.
  - `docs/historique.md`, l. 198-199, range de même la version 0.3.53 au 11 novembre, avant la demande de la nuit, alors qu'elle a été fusionnée après ; l. 207 écrit « Version 0.3.57 fusionnée » au 13 novembre, ce qui est juste.
- Correction proposée : écrire dans l'en-tête du changelog ce qu'est la date (« date de la fusion, en heure de Paris ») et corriger les trois titres ; ou faire écrire la date par `scripts/changelog.py` au moment du tag. Pour les trois tags : voir CHX-10.

## Vérifié

- Liens internes : 16 liens relatifs dans les fichiers du lot, aucun cassé ; 506 chemins cités entre accents graves, 16 absents du dépôt, tous expliqués par leur phrase (`NOTICE.md` de Babylon.js, `docs/v2-3d.md` et `docs/audit/fiches.md` dits retirés, `docs/audit/README.md` annoncé comme à venir, `data/vocabulaire.yaml` et `content/fr/notions/EXP-01.md` donnés en exemple) (`liens.py`).
- `CHANGELOG.md`, fichiers annoncés : pour les 63 versions fusionnées, chaque fichier nommé dans la section est dans le diff du commit de fusion (`annonces.py`) ; seuls écarts, sans portée : `docs/historique.md` modifié par la version 0.3.44 et `CLAUDE.md` par la version 0.2.3 sans être nommés.
- `CHANGELOG.md`, règle du numéro Y : entre `v0.2.3` et la branche de l'audit, aucune notion ni situation ajoutée, retirée ou changée de niveau ou de notions clés dans une version Z (`regle_y.py`) ; seul changement du référentiel : `activity: true` sur LUM-02 à la version 0.3.35, que la règle ne range pas parmi les reclassements. Le champ `version` retiré a bien fait passer Y à 3 (version 0.3.0).
- « Jamais de push sur `main` » (`CLAUDE.md`, l. 26) : sur le premier parent de `main`, 64 commits, dont 63 fusions à deux parents (pas de squash) et un seul commit direct, le premier (`REPRISE.md`, e89680d), que `docs/historique.md`, l. 42, déclare.
- « Commits uniquement avec une adresse "noreply" » (`CLAUDE.md`, l. 17) : trois adresses dans tout l'historique, toutes « noreply » (GitHub de Julien, Anthropic, GitHub pour les fusions). `python3 scripts/check_public.py --commits all` : « 175 fichier(s) texte, 311 commit(s) contrôlé(s) : 0 problème(s) », avec les 28 commits d'avant la règle listés dans `scripts/check_public_historique.txt`.
- `README.md` : 191 notions, 13 domaines, 49 situations ; couverture 13 sur 191 ; Node.js 22 (`app/package.json`, `engines` ; les trois workflows) ; `npm run build` fait bien la vérification des types, le simulateur, l'accueil et les fiches ; bouton « Crédits » présent (`app/src/i18n.ts`, l. 14).
- `CLAUDE.md`, l. 30 : `routine.yml` lance un job par profil (ordinateur, android, iphone, webgl1) sur les pull requests qui touchent `app/`, `content/`, `data/`, la routine ou le workflow ; l. 20 : le job `confidentialite` de `validate.yml` lance `check_public.py --commits all`, puis gitleaks sur tout l'historique.

## Je ne sais pas

- Ce que montre le site publié le 14 novembre 2026 : `badmiaoo.github.io` n'est pas joignable depuis la session de travail. Les README sont confrontés au code de la version 0.3.57, celle que `pages.yml` publie à chaque fusion sur `main`.
- Si GitHub affiche les commits comme vérifiés, et pour quelles périodes (DOC-03).
