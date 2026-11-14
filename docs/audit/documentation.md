# Audit du lot « Documentation : exactitude, cohérence, décisions rapportées »

État : constats non contre-vérifiés

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire.
- Version auditée : copie de travail de la branche de l'audit (version 0.3.58 en cours), pour ce qui date de la version 0.3.53 ou d'avant. Ce qui a été écrit depuis (versions 0.3.54 à 0.3.58) est lu quand il rapporte le travail antérieur ; une erreur qui s'y trouve est notée, sans en faire le sujet de l'audit.
- Bilan : 12 constats (3 « faux », 3 « incohérent », 6 « à améliorer », aucun « non sourcé »), 29 points vérifiés et justes, 7 « Je ne sais pas ». Les règles de `CLAUDE.md` sur le dépôt sont tenues (pas de push sur `main` hors le premier commit, adresses « noreply », un commit de fusion et une section de changelog par version, fichiers annoncés présents), et les faits chiffrés des pages relues se recalculent. Les défauts sont ceux d'une documentation que l'on complète sans la relire : la version anglaise du README abandonnée depuis la version 0.3.22, des nombres et des phrases restés à leur état du 7, du 8 ou du 9 novembre, des points tranchés encore écrits comme ouverts, et une décision (la photo à 360°) absente de la page des décisions. À corriger d'abord : DOC-05 (Renderpeople : Julien doit dire ce qu'il en est), DOC-01 et DOC-02 (ce que lit un visiteur du dépôt), DOC-06 et DOC-10.
- Ce qui n'a pas été couvert est dit plus bas, dans « Ce qui n'a pas été couvert ».

## Périmètre

- `CLAUDE.md`, `README.md`, `README.en.md`, `REPRISE.md`, `CHANGELOG.md` (cohérence des versions jusqu'à 0.3.53 : tag, date, fichiers annoncés dans le commit de fusion).
- `docs/architecture.md`, `docs/cadrage.md`, `docs/contenus.md`, `docs/etat-des-travaux.md`, `docs/historique.md`, `docs/lire-le-referentiel.md`, `docs/pile-technique.md`, `docs/propositions.md`, `docs/questions-ouvertes.md`.
- Hors du lot : `docs/camera-physique.md` (rapport `modele-physique.md`), `docs/licences.md` et `docs/publication.md` (rapport `licences-scripts-ci.md`), `docs/audit/`, `docs/dossiers/`, `docs/specifications/`.
- Le recouvrement entre fichiers et le déroulé d'une version sont jugés par `choix-et-outils.md` (CHX-01, CHX-10) ; `docs/architecture.md` comme description d'un autre produit, par `architecture-application.md` (ARC-09) ; les champs que `docs/lire-le-referentiel.md` ne décrit pas, par `referentiel-structure.md` (RST-11). Ces constats ne sont pas refaits ici : ce rapport juge l'exactitude.

## Méthode

1. Lecture complète des fichiers du lot, sauf `REPRISE.md` : ses sections 0, 1, 6 et 7 sont lues, ses sections 2 et 9 comparées par script à leur copie dans `docs/`, ses sections 3 et 8 lues dans leur version de `docs/` seulement ; ses sections 4, 5 et 10 sont des données, auditées par d'autres rapports.
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

Liste des pages relues : section « Sources relues », en fin de rapport. Les étiquettes, commits, dates et licences des moteurs, les versions du registre npm, le tableau du vocabulaire des marques de `docs/architecture.md` et le diamètre apparent du Soleil ont déjà été vérifiés par `sources.md` : non refaits.

Non relues, hôte non joignable depuis la session de travail (proxy : 403) : le site publié (`badmiaoo.github.io`), la documentation de GitHub (`docs.github.com`), la page du cours de Marc Levoy (`graphics.stanford.edu`, `sites.google.com`), les manuels de Fujifilm (`fujifilm-dsc.com`), ManualsLib, OpenGameArt, et les sites juridiques cités par `docs/architecture.md`.

## Ce qui n'a pas été couvert

- `CHANGELOG.md` : ce que chaque version annonce comme fonction n'est pas réessayé dans le code de son tag ; seuls sont contrôlés le tag, la date, les fichiers nommés, les comptes (sources, couverture, tailles) et quelques constantes. Les fonctions sont jugées par les rapports sur le modèle physique, le code et l'interface.
- `REPRISE.md` : les sections 3 et 8 ne sont pas relues ligne à ligne dans l'archive.
- Descriptions des pull requests : une seule lue (la 59).
- `docs/etat-des-travaux.md` : le « point du 13 novembre », écrit pendant l'audit et modifié à chaque tranche, n'est pas audité ; seules les sections d'avant le sont, et deux de ses phrases font un constat (DOC-03, DOC-05).
- Le site publié n'a pas été ouvert (hôte non joignable), et aucun navigateur n'a servi.

## Constats

Classés du plus grave au moins grave ; les identifiants, attribués dans l'ordre de l'écriture, ne se suivent donc plus.

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

**Contre-vérification : confirmé.** Relu le 14 novembre 2026 : dernier commit de `README.en.md` le 9 novembre (3f1822b, fusionné dans la version 0.3.22), quinze commits sur `README.md` depuis ; à `v0.3.22`, les deux fichiers disaient la même chose, virgules manquantes comprises ; `coverage.py` rend 13 sur 191, et `content/` a 22 fiches par langue. Deux réserves. Gravité : « incohérent » plutôt que « faux » : le titre date l'état du 8 novembre, jour où la couverture valait bien 0 (premières fiches à la version 0.3.39, le 11) ; ce sont les deux README, donnés l'un pour la version de l'autre, qui ne disent plus la même chose. Et ce fait est déjà une des preuves de CHX-01 (`choix-et-outils.md`, confirmé) : à compter une fois. Une preuve est inexacte, sans effet sur le constat : le changelog écrit « README » sans article dès la version 0.3.4 (« README : liste des documents »), quand les deux fichiers changeaient encore ensemble ; le mot ne date donc pas l'abandon. Correction juste ; pour le renvoi, préférer le site et `CHANGELOG.md` (voie B de CHX-01) à `docs/etat-des-travaux.md`, page de reprise écrite pour Claude et Julien, pas pour un visiteur.

### DOC-02 · faux · `README.md` : « 96 sources » (172), un titre daté du 8 novembre sur un état du 12, « quatre personnages » pour cinq personnes

- Endroit : `README.md`, l. 9, 11 et 13 ; `README.en.md`, l. 11 et 13 pour les mêmes nombres.
- Ce qui est écrit, et ce que dit le dépôt :

  | Ligne | Écrit | Dépôt |
  | --- | --- | --- |
  | 9 | « État au 8 novembre 2026 » | La l. 13 décrit la version 0.3.57 (histogrammes de l'écran de revue, fusionnée le 13 novembre) ; le titre n'a pas changé depuis la version 0.3.9. |
  | 11 | « référentiel v0.2 » ; en anglais « curriculum v0.2 » | `CHANGELOG.md`, l. 8 : « Y : version du référentiel ». Y vaut 3 depuis la version 0.3.0, qui a retiré le champ `version` des 191 notions et des 49 situations : d'après la règle du dépôt, le référentiel est en v0.3. « v0.2 » reste juste pour le champ `since` (162 notions `v0.1`, 29 `v0.2`). |
  | 11 | « 96 sources » | `python3 scripts/validate.py` : « 172 sources ». Nombre d'entrées de `data/sources.yaml` aux tags : 96 de `v0.3.9` à `v0.3.11`, 107 à `v0.3.12`, 151 à `v0.3.53`, 172 à `v0.3.57`. Le nombre est faux depuis le 8 novembre (version 0.3.12). |
  | 13 | « quatre personnages » ; en anglais « four people » | Quatre modèles, cinq personnes : Dennis, Sophia, Nathan, et « Fabienne & Percy 001 - Mother and Child » (`app/public/scenes/parc/scene.json`), dont le défi SIT-05 compte les deux (« Dennis, Sophia, Fabienne et Percy dans la zone nette », `CHANGELOG.md`, version 0.3.38). |
  | 13 | « dans la zone couverte par l'autofocus (environ 90 % du cadre) » | Vrai pour le Nikon Z 6 seulement : 88 % × 100 % pour le Canon EOS RP (version 0.3.43), environ 96,4 % × 96,4 % pour le Sony A7 III (version 0.3.45). |
  | 13 | « grilles de cadrage (tiers, seize cases) » | Quatre grilles depuis la version 0.3.56 (`app/src/i18n.ts`, l. 88-91 : tiers, seize cases, vingt-quatre cases, tiers et diagonales). |
  | 13 | « les fiches de 19 notions (les 16 de la V1 minimale, CMP-02, MES-06 et MES-07) » | Le jalon `v1-min` a 17 notions, CMP-02 comprise, depuis la version 0.3.56 (`data/jalons.yaml`) : 17 notions du jalon, plus MES-06 et MES-07. |

- Juste dans la même phrase : 191 notions, 13 domaines, 49 situations ; « couverture 13 sur 191 » ; « Pas encore de flou de bougé ».
- Correction proposée : remplacer le titre et les deux puces chiffrées par un état court qui ne se périme pas à chaque version (« État : voir `docs/etat-des-travaux.md` ; comptes : `python3 scripts/coverage.py` »), ou, si l'état reste dans le README, dater le titre du jour de la dernière version et corriger les sept points. Écrire « quatre modèles de personnages (cinq personnes) ».

**Contre-vérification : confirmé**, pour les trois lignes que le titre annonce ; les quatre autres lignes du tableau sont à retirer. Comptes refaits : 172 sources (`validate.py`) ; 96 de `v0.3.9` à `v0.3.11`, 107 à `v0.3.12`, 151 à `v0.3.53` ; le titre et « 96 sources » viennent du commit 73977b5 (version 0.3.9) et n'ont pas changé depuis ; la scène a cinq personnes (`app/src/scene.ts`, l. 286-292, ajoute un sujet « percy » au modèle « Fabienne & Percy »). Le titre daté et les « 96 sources » sont déjà relus sous CHX-01 : à compter une fois. Lignes à retirer :
- « référentiel v0.2 » : non établi. La règle du changelog dit que la version du référentiel est « celle du champ `since` », dont la plus haute valeur est `v0.2` (29 notions, 11 situations), et le retrait du champ `version` n'est pas dans sa liste « (niveau, notions clés) ». La contre-vérification de RST-05 l'a déjà écrit : « référentiel v0.2 » se défend autant que « v0.3 ».
- « environ 90 % du cadre » : l'objection est fausse. Quatre boîtiers sur six prennent 90 % × 90 % : le Z 6, et les trois dont la couverture n'est pas sourcée (`app/src/camera/bodies.ts`, l. 27-28 : « absente quand elle n'est pas sourcée (ui/cameraPanel.ts prend alors celle du Z 6) » ; `cameraPanel.ts`, l. 526). Les deux autres ont 88 % × 100 % et 96,4 % × 96,4 % : « environ 90 % » les décrit encore.
- Les grilles et « les 16 de la V1 minimale, CMP-02 » : phrases écrites le 12 novembre (commits cd188a8 et 8be11bd, versions 0.3.56 et 0.3.57), hors de la période auditée. À corriger dans la même modification, sans le reprocher au travail antérieur.

Correction : la première voie (un état court, sans inventaire ni compte), qui est celle de CHX-01 ; si l'état reste, cinq points à corriger, pas sept, et « cinq personnages » suffit.

### DOC-03 · faux · `docs/etat-des-travaux.md` : « Les commits d'avant le 12 novembre 2026 avaient Julien pour committer et n'étaient pas signés »

- Endroit : `docs/etat-des-travaux.md`, l. 107.
- Preuve (`git log origin/main --no-merges --format='%cs|%an <%ae>|%cn <%ce>'`, 108 commits hors fusions) :

  | Jours | Commits | Auteur | Committer |
  | --- | --- | --- | --- |
  | 7 au 10 novembre | 70 | Claude, adresse « noreply » d'Anthropic | le même |
  | 10 et 11 novembre, et un le 12 | 29 | Julien, adresse « noreply » de GitHub | le même |
  | 12 et 13 novembre | 9 | Julien | Claude |

  Avant le 12 novembre : 98 commits hors fusions, dont 70 ont Claude pour auteur et pour committer, et 28 ont Julien. La phrase n'est donc vraie que pour 28 commits sur 98. Les 63 commits de fusion, eux, ont Julien pour auteur et GitHub pour committer.
- Preuve (signature) : chacun des 108 commits porte un en-tête `gpgsig` (« -----BEGIN SSH SIGNATURE----- »), dès le premier (e89680d). Ils sont signés ; ce que GitHub en affiche (« Verified » ou non) dépend de la clé et du committer.
- Je ne sais pas ce que GitHub affiche pour chaque période : l'outil de lecture utilisé ne rend pas le champ de vérification.
- Conséquence : `CLAUDE.md`, l. 21, donne pour seule exception « le nom de Julien comme auteur des commits » ; les 70 premiers commits ont « Claude » pour auteur, ce qui n'enfreint rien, mais `docs/historique.md`, l. 83 (« Son nom comme auteur des commits est accepté », 7 novembre), laisse croire que les commits portaient son nom dès ce jour.
- Correction proposée : écrire « Jusqu'au 10 novembre 2026, auteur et committer : Claude (adresse "noreply" d'Anthropic) ; les 10 et 11 novembre, auteur et committer : Julien ; depuis le 12 novembre, auteur Julien et committer Claude. Tous les commits portent une signature SSH ; ce que GitHub affiche pour chaque période est à relever sur la page des commits. »

**Contre-vérification : réfuté.** Hors de la période auditée, et la conséquence avancée ne tient pas ; la phrase, elle, est inexacte et se corrige en une ligne. La l. 107 vient du commit 9a013be, du 12 novembre 2026 à 6 h 12 UTC (version 0.3.54) : ce n'est pas du travail antérieur, et l'en-tête de ce rapport l'écarte lui-même. Les comptes sont exacts, refaits sur `origin/main` : 70 commits hors fusions avec Claude pour auteur et committer (7 au 10 novembre), 29 avec Julien pour les deux (10 au 12), 9 avec Julien pour auteur et Claude pour committer ; les 108 portent un en-tête `gpgsig`. Ce que le constat ne savait pas, lu le 14 novembre 2026 dans l'API de GitHub (`repos/…/commits/<sha>`, champ `verification`, pour chacun des 108) : les 70 et les 9 sont « verified: true », les 29 du milieu « verified: false, reason: unknown_key ». La phrase visait donc ces 29 commits, signés mais affichés « non vérifiés » ; elle se trompe sur les dates et sur le mot. Pour `docs/historique.md`, l. 83 (« Son nom comme auteur des commits est accepté ») : rien à redire, les 63 commits de fusion ont Julien pour auteur depuis le 7 novembre. À faire, au prochain passage sur `docs/etat-des-travaux.md` : « Du 10 au 12 novembre 2026, 29 commits ont Julien pour auteur et pour committer : ils sont signés, mais GitHub les affiche comme non vérifiés (clé inconnue pour ce compte). Avant et après, il les affiche comme vérifiés. »

### DOC-05 · incohérent · Renderpeople : `docs/etat-des-travaux.md` parle d'un « accord déjà obtenu », `docs/questions-ouvertes.md` dit « Je ne sais pas », et aucune autre page n'en garde la trace

- Endroit : `docs/etat-des-travaux.md`, l. 113 ; `docs/questions-ouvertes.md`, l. 13.
- Ce qui est écrit :
  - état des travaux, « Ce qui attend Julien » : « Renderpeople : date et périmètre de l'accord déjà obtenu, pour le documenter (`docs/questions-ouvertes.md`). »
  - questions ouvertes, case non cochée : « Je ne sais pas si Renderpeople a obtenu des personnes scannées une autorisation qui couvre ce type d'usage : ses conditions n'ont pas été lues (site non joignable depuis la session de travail). À vérifier avant toute diffusion large. »
- Preuve : la phrase de l'état des travaux date du commit 66cb9b3 (11 novembre 2026, version 0.3.54). Le mot « accord » n'apparaît, à propos de Renderpeople, dans aucun autre fichier du dépôt (`docs/historique.md`, `docs/licences.md`, `docs/publication.md`, `docs/questions-ouvertes.md`), ni dans aucun message de commit (`git log --all -i --grep=renderpeople` : les deux commits de la version 0.3.10). La page vers laquelle la phrase renvoie dit l'inverse : la question est ouverte.
- Je ne sais pas si un accord existe, ni sur quoi il porterait (un accord de Renderpeople donné à Julien, ou l'autorisation des personnes scannées donnée à Renderpeople) : la conversation n'est pas dans le dépôt.
- Conséquence : la seule question ouverte qui porte sur les droits de personnes réelles est dite réglée dans une page et ouverte dans l'autre ; le site est public depuis le 7 novembre 2026.
- Correction proposée : Julien dit ce qu'il en est. S'il a un accord : une entrée datée dans `docs/historique.md` (qui, quand, pour quel usage), et la question ouverte mise à jour. Sinon : retirer « déjà obtenu » de l'état des travaux et y écrire la question telle qu'elle est posée.

**Contre-vérification : réfuté.** Hors de la période auditée, et la question est déjà posée à Julien par la ligne même que le constat vise. Les faits sont exacts (recherche refaite : « accord » n'apparaît, à propos de Renderpeople, qu'à cette ligne ; la question ouverte date du commit 52bd0bc, version 0.3.10). Mais la ligne vient du commit 66cb9b3, publié le 12 novembre 2026 avec la version 0.3.54, comme toute la liste « Ce qui attend Julien » : la contre-vérification de CHX-10 a déjà rangé cette liste hors de la période, et le tableau de CHX-10 compte « accord de Renderpeople » parmi ce qui y figure bien. Elle ne dit pas la question réglée : elle demande à Julien la date et le périmètre de l'accord « pour le documenter », et renvoie à la page où la question reste ouverte. La correction proposée (« Julien dit ce qu'il en est ») est donc ce que le dépôt demande déjà. Les deux phrases ne parlent pas forcément du même objet (un accord donné à Julien, ou l'autorisation des personnes scannées), et le constat écrit lui-même « Je ne sais pas ». Ce qui reste utile, sans en faire un constat : à la réponse de Julien, une entrée datée dans `docs/historique.md` et la mise à jour de la l. 13 des questions ouvertes ; d'ici là, si la liste est réécrite, la tourner en question (« Julien a-t-il un accord ? de qui, de quand, pour quel usage ? ») plutôt qu'en fait acquis. Le fond (droits de la personnalité) relève du rapport `licences-scripts-ci.md`.

### DOC-06 · incohérent · `docs/questions-ouvertes.md` : des points tranchés ou faits y restent écrits comme ouverts, et un point à confirmer n'a pas été repris

- Endroit et preuve, point par point :

  | Ligne | Ce qui est écrit | Ce que dit le dépôt |
  | --- | --- | --- |
  | 3 | « mis à jour le même jour [le 7 novembre] avec les décisions de la session 1 » | La page a été modifiée par 45 commits, jusqu'au 12 novembre ; elle rapporte des décisions des 9, 10, 11 et 12 novembre. |
  | 24 | Fond en JPEG écrêté : « À réévaluer quand l'exposition sera simulée » | L'exposition est simulée depuis la version 0.3.13 (8 novembre). La réévaluation n'est pas rapportée ici ; `modele-physique.md` (PHY-06) traite le sujet. |
  | 32 | Grilles de cadrage : « choix faits sans Julien, à confirmer (`docs/propositions.md`, section 4) » | `docs/propositions.md`, l. 94 : « Tranché par Julien le 12 novembre 2026, avant la fusion de la version », avec sa décision pour chacun des sept choix ; `docs/historique.md`, l. 203, le rapporte aussi. `docs/etat-des-travaux.md` dit les deux : « Choix tranchés par Julien » (l. 69) et, parmi ce qui l'attend, « Premiers choix : les grilles de cadrage » (l. 112). |
  | 51 | Chargement sans fin du 9 novembre : « la cause exacte […] reste à identifier […], et le modèle du téléphone et le navigateur » | Ligne écrite à la version 0.3.18 (commit b6a148f) et jamais reprise. Le téléphone et le navigateur sont écrits depuis le même jour (Google Pixel 8 Pro, Chrome : `docs/historique.md`, l. 139 et 144 ; `CHANGELOG.md`, version 0.3.23). La suite est dans `docs/historique.md`, l. 144 et 147 : tout se charge avec la version 0.3.22, puis un fichier de code non reçu, corrigé par la version 0.3.25. |
  | 61 | LUM-02 : « l'activité interactive dans TutoPhoto reste à construire », et quatre phrases plus loin « construit en version 0.3.50 » | Deux états dans le même paragraphe ; le second est juste (`app/activites/LUM-02/`). |
  | 62 | « Rendu, au choix du moteur : […] flou de mouvement et poses longues » | L. 78 de la même page : « Pour la photo, tranché le 8 novembre 2026 : accumulation de rendus ». |
  | 63 | Niveaux des situations : règle de la médiane « à confirmer en écrivant les premiers défis » | Les premiers défis sont écrits depuis la version 0.3.38 (11 novembre). Aucune page ne dit si la règle a été confirmée : point oublié. |
  | 64 | Lisibilité sur téléphone : « codes cliquables […] À appliquer dans la maquette » | Les codes des fiches sont des liens depuis la version 0.3.46 (`docs/contenus.md`, l. 71) ; la ligne ne le dit pas. |
  | 68 | MES-04 dans la liste « sourcer les affirmations à la rédaction de la fiche » | La fiche de MES-04 est rédigée (version 0.3.39) et la notion a ses sources (`data/referentiel/mes.yaml` : `nikon-z6-exposure-compensation` et sa version française, version 0.3.36). Le champ `todo` du référentiel, que la liste recopie fidèlement, n'a pas été retiré. |
  | 83 | « On n'étend au-delà de la V1 minimale qu'après l'avoir testée avec des débutants. » | L. 31 de la même page : l'attente des tests est levée, d'après la lecture que Claude fait de la demande de la nuit du 11 au 12 novembre, et deux fonctions ont été ajoutées. La contradiction de fond est jugée par CHX-04. |
  | 87, 89, 90 | Étapes 3 (pile technique), 5 (prouver le moteur) et 6 (rédiger les contenus), sans état | Les étapes 1 et 4 portent leur état (« fait le… », « Version 0.3.46 »). L'étape 3 est faite depuis le 7 novembre, l'étape 6 depuis les versions 0.3.39 et 0.3.40 pour le jalon ; de l'étape 5, il reste le flou de bougé. |

- Déjà relevé ailleurs, non recompté : l. 65, SunCalc « n'affiche aucune version publiée » (SRC-02 : le dépôt porte douze étiquettes de version).
- Juste : les onze cases de la l. 8 à la l. 18 (les deux cases non cochées sont bien ouvertes : scènes suivantes, droit à l'image) ; la liste des `todo` (l. 68 à 79), identique aux 27 champs `todo` du référentiel.
- Correction proposée : passer la page en revue ligne par ligne, une fois ; retirer ce qui est fait (ou le dater « fait, version X »), corriger la l. 3, et remonter la l. 63 dans ce qui attend Julien. Retirer le `todo` de MES-04. La forme de la page (journal ou liste d'ouvert) relève de CHX-01.

**Contre-vérification : confirmé**, pour sept lignes du tableau sur onze, et à la gravité « à améliorer ». Lignes relues et datées (`git blame`) : l'en-tête (l. 3, du 7 novembre ; 45 commits depuis, compte refait), le fond écrêté (l. 24, du 8), le chargement sans fin (l. 51, commit b6a148f du 9 ; le téléphone et le navigateur sont dans `docs/historique.md`, l. 139 et 144), LUM-02 (l. 61, deux états dans le même paragraphe), la règle de la médiane (l. 63, déjà comptée par CHX-10, confirmé), la lisibilité (l. 64) et les étapes sans état (l. 87, 89 et 90) sont bien restées en l'état. Quatre lignes sont à retirer :
- l. 32 (grilles « à confirmer ») : écrite le 12 novembre (commit cd188a8, version 0.3.56), hors de la période ; la contre-vérification de CHX-01 l'avait déjà écartée pour cette raison ;
- l. 83 (« On n'étend […] qu'après l'avoir testée ») : c'est la règle de `CLAUDE.md`, toujours en vigueur ; ce qui la contredit est la l. 31, écrite le 12 novembre, et CHX-04 est réfuté pour la même raison ;
- l. 62 : elle nomme les trois chantiers dont les l. 77 à 79 donnent l'état (« Pour la photo, tranché le 8 novembre 2026 ») ; les poses longues et le viseur restent ouverts. Une liste et son détail, pas une contradiction ;
- l. 68 (MES-04) : non établi, et la correction ferait perdre un rappel. La fiche source ce qu'elle dit, mais l'exercice du référentiel (« Rendre la neige blanche ») n'y est pas : « la scène de parc n'en a pas, l'exercice est adapté » (`content/fr/notions/MES-04.md`, l. 13). Ce que la cellule fait de la neige reste à sourcer quand SIT-03 ou SIT-13 seront écrites : ne pas retirer le `todo` ; au plus, le préciser.

Une fois ces lignes ôtées, plus rien ne contredit une autre page : ce sont des mentions restées après coup, d'où la gravité. Correction : la revue ligne par ligne, dans la pull request qui réduit la page à ce qui est ouvert (voie B de CHX-01) et qui crée la table des décisions en attente (voie B de CHX-10), pas à part.

### DOC-10 · incohérent · « Scènes en 3D de synthèse » : la page des décisions ne porte pas celle du 8 novembre, qui met une photo réelle à 360° derrière les sujets

- Endroit : `docs/cadrage.md`, l. 5 et 26 ; `CLAUDE.md`, l. 3 ; `README.md`, l. 12 ; `README.en.md`, l. 12.
- Ce qui est écrit : « Scènes en 3D de synthèse dès la V1, à la place des photos réelles et de leur carte de profondeur (2.5D) » (`docs/cadrage.md`, l. 26, décisions du 7 novembre) ; « Scènes en 3D de synthèse » (`CLAUDE.md`, README).
- Preuve : `docs/historique.md`, l. 101, 8 novembre : « Décision de Julien : le fond et l'éclairage viennent d'une photo à 360° (autumn_hockey, de Greg Zaal, CC0). En 3D, seulement le premier plan : personnages, chien, banc, poubelles. Pas d'arbre 3D en V1. » `docs/questions-ouvertes.md`, l. 12, le redit. `docs/cadrage.md` a des sections pour les 6, 7 et 10 novembre, aucune pour le 8 : les mots « photo à 360° » n'y sont pas, ni dans `CLAUDE.md`. Seuls les README, l. 13, écrivent « fond photo à 360° » (« 360° photo background »), une ligne sous « Scènes en 3D de synthèse ».
- Conséquence : la scène de la V1 minimale n'est pas « à la place des photos réelles » ; elle en garde une, avec ce que cela limite et que d'autres pages disent (fond à l'infini, perspective qui ne change pas quand l'appareil se déplace : `docs/propositions.md`, l. 81 ; hautes lumières du fond écrêtées : `docs/questions-ouvertes.md`, l. 24). Qui lit le cadrage ou `CLAUDE.md` seuls ne le sait pas. C'est aussi un écart au mot d'ordre de `CLAUDE.md`, l. 11 : dire ce qui n'est pas réaliste.
- Correction proposée : dans `docs/cadrage.md`, une section « Décision du 8 novembre 2026 » (fond et éclairage tirés d'une photo à 360°, premier plan en 3D, pour la scène de parc ; la question reste ouverte pour les scènes suivantes) ; dans `CLAUDE.md` et les README, « sujets en 3D de synthèse devant une photo à 360° (scène de parc) ».

**Contre-vérification : réfuté.** Déjà dit dans le dépôt, et exagéré ; la correction toucherait une règle de Julien sans nécessité. La décision du 8 novembre est écrite, avec sa conséquence (« l'appareil reste au point de prise de vue de la photo »), dans `docs/historique.md`, l. 101 : c'est la page des décisions, celle à laquelle l'en-tête de `docs/cadrage.md` renvoie (« détail dans `docs/historique.md` »). Elle est redite dans onze autres fichiers (recherche de « 360° » dans les `.md` hors `docs/audit/`), dont : `docs/questions-ouvertes.md` (l. 12, et six limites aux l. 23 à 29), les deux README à la ligne qui suit « Scènes en 3D de synthèse », `docs/camera-physique.md` (huit lignes), `docs/pile-technique.md` (l. 97), `docs/propositions.md` (l. 81), le changelog (quatre lignes) et la fiche NET-06 dans les deux langues. Ce qui n'est pas réaliste est donc dit. Rien n'est faux dans les phrases citées : la l. 26 du cadrage rapporte la décision du 7 novembre à sa date (la 3D à la place de la 2.5D, photos avec carte de profondeur), et un fond et un éclairage tirés d'une photo à 360° sont une façon courante de faire une scène 3D, pas un retour à la 2.5D ; le choix ne vaut que pour le parc (`docs/questions-ouvertes.md`, l. 12 : « Reste ouvert pour les autres scènes »). L'écrire à la l. 3 de `CLAUDE.md`, qui définit le projet, y figerait le choix d'une scène ; et cette ligne est à Julien. Au plus : une ligne dans `docs/cadrage.md`, sous les décisions du 7 novembre (« 8 novembre 2026, scène de parc : fond et éclairage tirés d'une photo à 360°, premier plan en 3D ; `docs/historique.md` »), à écrire avec la correction de son en-tête (DOC-07).

### DOC-04 · à améliorer · `CHANGELOG.md` : trois versions sans tag, trois versions datées de la veille de leur fusion, et rien ne dit de quoi la date est la date

- Endroit : `CHANGELOG.md`, l. 3 (« le workflow […] pose le tag annoté `vX.Y.Z` sur le commit de fusion »), titres des sections 0.3.37, 0.3.53 et 0.3.57, liens des l. 950-953 ; `CLAUDE.md`, l. 34.
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

### DOC-07 · à améliorer · Phrases et en-têtes périmés dans les pages de cadrage : ce qui est annoncé comme à venir est fait, ou ne s'est pas fait

- Endroit et preuve :

  | Fichier, ligne | Ce qui est écrit | Ce que dit le dépôt |
  | --- | --- | --- |
  | `docs/cadrage.md`, l. 3 | « mis à jour le même jour [le 7 novembre] » | Deux sections sont du 10 novembre (commits ebe5c06 et 9182e02). |
  | `docs/cadrage.md`, l. 41 | Taux de couverture « affiché dans l'outil et dans le dépôt » | Dans le dépôt, oui (`scripts/coverage.py`, README). Dans le site, non : ni `app/scripts/build-pages.mjs`, ni `app/src/` n'affichent de couverture (recherche de « couverture » et de « coverage », hors couverture de l'autofocus). |
  | `docs/contenus.md`, l. 77 | « Quand les simulateurs existeront, il faudra décider comment relier cette section au simulateur réel. » | Phrase du 7 novembre (commit 2cbca48). Le simulateur existe ; la décision n'a pas été prise : la brique « simulateur » est toujours comptée par la présence d'une section dans la fiche (`scripts/coverage.py`, l. 58). |
  | `docs/architecture.md`, l. 5 | « Cette page sera réécrite avec le choix de la pile technique. » | La pile technique est choisie depuis le 7 novembre ; la page n'a pas été modifiée depuis la version 0.3.0 (`git log`). `docs/propositions.md`, l. 86, la range dans « À reprendre au passage ». Le fond est jugé par ARC-09. |
  | `docs/lire-le-referentiel.md`, l. 7, 17 et 21 ; `docs/historique.md`, l. 7 | « (section 4) », « (section 5) », « (section 10) », « Les cinq décisions de la section 1 » | Ces numéros sont ceux de `REPRISE.md`, que la phrase ne nomme pas ; dans `docs/cadrage.md`, les décisions du 6 novembre ne sont plus cinq mais trois, plus une ligne « Remplacées ». |
  | `docs/historique.md`, l. 3 | « Section 9 de `REPRISE.md` […], copiée sans réécriture » | Vrai pour les l. 5 à 36 (vérifié, voir « Vérifié ») ; les 170 lignes suivantes, après le trait de la l. 38, sont le journal tenu depuis, sans titre qui le dise. |

- Correction proposée : corriger ces six endroits dans la pull request qui réécrira ces pages (ARC-09, CHX-01) ; pour la couverture, soit l'afficher sur l'accueil (le nombre sort de `coverage.py`), soit écrire « affiché dans le dépôt ».

### DOC-08 · à améliorer · Trois phrases prêtent à Julien plus que les mots que le dépôt rapporte de lui

- Limite : la conversation n'est pas dans le dépôt. Ce constat compare chaque attribution à ce que `docs/historique.md` et les messages de commit en gardent ; il ne dit pas que Julien n'a pas dit ou validé ces points.
- Endroit et preuve :
  1. `CLAUDE.md`, l. 11 : « à chaque choix de simulation, retenir le comportement le plus réaliste, sourcé, et dire ce qui ne l'est pas (Julien, 9 novembre 2026) ». Les mots rapportés (`docs/historique.md`, l. 154) : « fais ce qu'il y a de plus réaliste, ça reste une sandbox de simulation pour entraînement. Ça doit être le mot d'ordre partout. » « sourcé, et dire ce qui ne l'est pas » est la mise en forme de Claude ; l'exigence de source est de Julien, mais du lendemain (principe du 10 novembre, `docs/cadrage.md`, l. 9).
  2. `CHANGELOG.md`, version 0.3.38 (l. 293) : « Défis des trois situations de la V1 minimale, validés par Julien le 11 novembre 2026 ». `docs/historique.md`, l. 180 : « Julien, sur le point du matin : "Suivons tes propositions". Ordre retenu : un défi par situation, un bulletin après chaque photo, puis les fiches. » Ce qui est rapporté est l'accord sur un ordre de travail ; les critères de chaque défi (œil de Sophia net et fond hors de la zone nette, etc.) ne sont dits validés nulle part ailleurs, et le message du commit 2b26254 n'en parle pas.
  3. `docs/pile-technique.md`, l. 87, section « Outillage de l'application » : « Décidé par Julien le 7 novembre 2026 » (TypeScript, Vite). `docs/historique.md`, l. 76 à 79, donne les mêmes choix sans dire qui les a faits, là où les entrées voisines écrivent « Julien passe le dépôt en public » ou « Décision de Julien » ; les messages des commits de la version 0.3.5 (c85c9bb, 88bebca, 69e2bc5) n'en disent rien.
- Juste, pour comparaison : les autres attributions contrôlées ont leur trace dans `docs/historique.md`, souvent avec les mots de Julien (voir « Vérifié »). Les lectures de Claude sont dites comme telles à deux endroits : « "1,2,3" est comprise comme "les trois" » (l. 121) et « Claude le comprend comme la levée […] de l'attente des tests » (l. 199).
- Correction proposée : dans `CLAUDE.md`, séparer la citation de sa mise en règle (« Julien, 9 novembre 2026 : "…" ; règle qu'en tire Claude : … ») ; dans le changelog et la pile technique, écrire ce qui a été validé au juste, ou demander à Julien de confirmer. Pour la suite : noter dans `docs/historique.md` les mots de Julien pour chaque décision, comme c'est fait depuis le 9 novembre.

### DOC-09 · à améliorer · `REPRISE.md` : l'archive ne dit pas qu'elle en est une ; son en-tête dit « Ce fichier fait foi » et ses instructions contredisent `CLAUDE.md`

- Endroit : `REPRISE.md`, l. 1 à 180 (section 0, « Instructions pour Claude Code »).
- Ce qui est écrit : « Ce fichier fait foi » (l. 29) ; « lis-le en entier, par tranches, avant toute action » (l. 33) ; « Ces blocs sont la source de vérité du référentiel » (l. 34) ; « V1 en 2.5D […] V2 : uniquement le passage en 3D » (l. 27) ; « une pull request par livrable, que Julien relit et fusionne » (l. 56) ; « Ce qui est acté. Ne le rouvre pas sans demande de Julien » (l. 61 à 66 : 2.5D, découpage V1/V2, flash par captures) ; « Pas de 3D avant la validation de la maquette 2.5D » (l. 160 et 176).
- Ce que disent les règles en vigueur : source de vérité `data/` ; 3D de synthèse dès la V1 ; Claude fusionne lui-même ; tout peut être remis en question (`CLAUDE.md`, l. 3 à 8 et 33).
- Preuve : aucune ligne du fichier ne dit qu'il est remplacé. Depuis son premier commit (e89680d), une seule ligne a changé, la l. 29, à la version 0.3.6 (lien privé retiré). L'avertissement est ailleurs : `CLAUDE.md`, l. 6 et 8 (« Archive de reprise », « brouillon »), `README.md`, l. 24.
- Conséquence : faible tant que le lecteur passe par `CLAUDE.md` ; réelle pour qui ouvre le fichier seul (il fait 3 554 lignes et commence par des consignes à l'impératif), et pour `scripts/extract_reprise.py`, qui réécrirait `data/` d'après lui (CHX-06).
- Correction proposée : trois lignes en tête de `REPRISE.md` (« Archive du 7 novembre 2026. Ne fait plus foi : règles dans `CLAUDE.md`, données dans `data/`, décisions dans `docs/historique.md`. Section 0 : instructions de la première session, périmées. »). Le fichier a déjà été modifié une fois ; « gardé tel quel » (README) devient « gardé comme archive, avec un avertissement en tête ».

### DOC-11 · à améliorer · `README.md` : le tableau du dépôt oublie `content/` et quatre parties de `docs/`, et l'état ne dit rien de quatre fonctions du site

- Endroit : `README.md`, l. 13 et 17 à 27 ; `README.en.md`, mêmes lignes.
- Preuve (tableau « Contenu du dépôt ») :
  - `content/` n'a pas de ligne : c'est là que sont les 44 fiches (19 notions et 3 situations, en deux langues). Le dossier n'apparaît qu'à la l. 65, sous « Licence ». `.github/` et `requirements.txt` n'en ont pas non plus.
  - Ligne `docs/` : la liste nomme onze pages et omet `docs/etat-des-travaux.md`, que `CLAUDE.md`, l. 6, donne comme le point de reprise, ainsi que `docs/audit/`, `docs/dossiers/` et `docs/specifications/`.
  - Ligne `scripts/` : « Extraction, validation, couverture et contrôles (scènes 3D, dépôt public, changelog) » ; la routine de test, `scripts/test_app.cjs`, que `CLAUDE.md`, l. 32, impose à toute pull request qui touche `app/`, n'y est pas. La section « Contribuer » (l. 52 à 60) ne la cite pas non plus.
- Preuve (l. 13, ce que fait le site et que la phrase ne dit pas) : le choix du boîtier de référence, six boîtiers en deux formats, qui change le champ, le bruit et la zone de l'autofocus (`app/src/camera/bodies.ts`, « Boîtier de référence » dans `app/src/i18n.ts`, l. 29) ; l'activité interactive de LUM-02 (version 0.3.50) ; les trois portes de l'accueil (version 0.3.46) ; le bouton « Télécharger les ressources du simulateur » (version 0.3.51).
- Correction proposée : ajouter au tableau `content/`, `.github/` et `requirements.txt` ; écrire la ligne `docs/` par familles (« état des travaux, cadrage et décisions, technique, audit, dossiers de sources, spécifications ») plutôt que page par page ; nommer la routine de test dans la ligne `scripts/` et dans « Contribuer ». Pour l'état : voir DOC-02 (un état court qui renvoie au site et à `docs/etat-des-travaux.md`).

### DOC-12 · à améliorer · Petites inexactitudes

- `docs/pile-technique.md`, l. 94, et `docs/historique.md`, l. 144 : « les 34 Mo de la scène ». Le manifeste totalise 36 012 290 octets, soit 34,3 Mio ou 36,0 Mo ; le dépôt écrit ailleurs « Mio » (`CHANGELOG.md`, versions 0.3.9, 0.3.10 et 0.3.51 ; l'interface). Écrire « 34 Mio ».
- `docs/questions-ouvertes.md`, l. 58 : la vitesse du chien « compte pour le flou de bougé de SIT-06 » ; l. 89 : « flou de bougé et de sujet ». La vitesse du chien règle la traînée du sujet (MVT-01), pas le bougé, mot que le dépôt garde pour le mouvement de l'appareil (« bougé de la main », `docs/cadrage.md`, l. 14 ; « Pas encore de flou de bougé », `README.md`, l. 13). Écrire « la traînée du chien dans SIT-06 ».
- `docs/propositions.md`, l. 74 : « finir la relecture des 19 fiches ». Juste le 11 novembre (16 notions et 3 situations) ; il y en a 22 par langue depuis la version 0.3.57, et aucune n'est relue (`data/relecture.yaml` : `relues: []`).
- `docs/etat-des-travaux.md` (écrit après la période auditée) : la légende de la file (l. 62) définit un état « Écrit : le code existe sur la machine de Claude, pas encore dans le dépôt », qu'aucune ligne ne porte, et la l. 87 garde deux travaux « faits cette nuit sur la machine de Claude », alors que la règle du 13 novembre, en tête du même fichier (l. 11), l'interdit ; l'étape 3 de « Comment reprendre » (l. 103) envoie encore au « premier sujet "Écrit" ou "À faire" de la file », que le point du 13 novembre remplace.
- `docs/historique.md`, l. 206 (écrit après la période auditée, le 13 novembre à 5 h 40 UTC, commit 1987654) : « la limite hebdomadaire d'usage du modèle de Claude est atteinte, jusqu'au 14 novembre à 1 h UTC ». La branche de l'audit a reçu 67 commits le 13 novembre entre 6 h et 23 h UTC, et `docs/etat-des-travaux.md`, l. 13, place la suspension par une « limite propre au modèle utilisé » vers 23 h UTC ce jour-là. Je ne sais pas laquelle des deux pages décrit ce qui s'est passé ; elles ne disent pas la même chose.

## Vérifié

- Liens internes : 16 liens relatifs dans les fichiers du lot, aucun cassé ; 506 chemins cités entre accents graves, 16 absents du dépôt, tous expliqués par leur phrase (`NOTICE.md` de Babylon.js, `docs/v2-3d.md` et `docs/audit/fiches.md` dits retirés, `docs/audit/README.md` annoncé comme à venir, `data/vocabulaire.yaml` et `content/fr/notions/EXP-01.md` donnés en exemple) (`liens.py`).
- `CHANGELOG.md`, fichiers annoncés : pour les 63 versions fusionnées, chaque fichier nommé dans la section est dans le diff du commit de fusion (`annonces.py`) ; seuls écarts, sans portée : `docs/historique.md` modifié par la version 0.3.44 et `CLAUDE.md` par la version 0.2.3 sans être nommés.
- `CHANGELOG.md`, règle du numéro Y : entre `v0.2.3` et la branche de l'audit, aucune notion ni situation ajoutée, retirée ou changée de niveau ou de notions clés dans une version Z (`regle_y.py`) ; seul changement du référentiel : `activity: true` sur LUM-02 à la version 0.3.35, que la règle ne range pas parmi les reclassements. Le champ `version` retiré a bien fait passer Y à 3 (version 0.3.0).
- « Jamais de push sur `main` » (`CLAUDE.md`, l. 29) : sur le premier parent de `main`, 64 commits, dont 63 fusions à deux parents (pas de squash) et un seul commit direct, le premier (`REPRISE.md`, e89680d), que `docs/historique.md`, l. 42, déclare.
- « Commits uniquement avec une adresse "noreply" » (`CLAUDE.md`, l. 22) : trois adresses dans tout l'historique, toutes « noreply » (GitHub de Julien, Anthropic, GitHub pour les fusions). `python3 scripts/check_public.py --commits all` : « 175 fichier(s) texte, 311 commit(s) contrôlé(s) : 0 problème(s) », avec les 28 commits d'avant la règle listés dans `scripts/check_public_historique.txt`.
- `README.md` : 191 notions, 13 domaines, 49 situations ; couverture 13 sur 191 ; Node.js 22 (`app/package.json`, `engines` ; les trois workflows) ; `npm run build` fait bien la vérification des types, le simulateur, l'accueil et les fiches ; bouton « Crédits » présent (`app/src/i18n.ts`, l. 14).
- `CLAUDE.md`, l. 32 : `routine.yml` lance un job par profil (ordinateur, android, iphone, webgl1) sur les pull requests qui touchent `app/`, `content/`, `data/`, la routine ou le workflow ; l. 25 : le job `confidentialite` de `validate.yml` lance `check_public.py --commits all`, puis gitleaks sur tout l'historique.
- Pages « copiées sans réécriture » : le corps de `docs/architecture.md` est identique, ligne pour ligne, à la section 2 de `REPRISE.md` (74 lignes), et les l. 5 à 36 de `docs/historique.md` à sa section 9 (21 lignes) ; seuls s'ajoutent le titre, la phrase d'en-tête et, pour l'architecture, l'avertissement (`copies.py`). `REPRISE.md` n'a changé que d'une ligne depuis son premier commit (lien privé retiré, version 0.3.6, déclaré dans `CHANGELOG.md` et `docs/historique.md`, l. 85).
- `docs/contenus.md` contre `scripts/coverage.py` : titres des sections dans les deux langues, casse ignorée, commentaires HTML ignorés, section « Activité » pour une notion `activity: true`, règle de la situation réelle ; LEC-03 et RET-15 sont bien les deux seules notions sans situation. Contre `app/scripts/build-pages.mjs` : première ligne `# ID · Titre`, sections prévues seulement, balisage hors liste refusé, fiche sans traduction refusée, code sans fiche refusé ; textes du bandeau et de la marque « en relecture ».
- Couverture annoncée, recalculée avec `scripts/coverage.py` de chaque tag sur une copie hors du dépôt : 11 sur 191 et 11 sur 16 à `v0.3.39`, 12 sur 191 et 12 sur 16 à `v0.3.40`, 13 sur 17 à `v0.3.56` (`CHANGELOG.md`, `docs/historique.md`, l. 182, 184 et 203).
- `docs/pile-technique.md`, constats sur les moteurs, relus dans les fichiers aux étiquettes citées : three.js r187 (`DepthOfFieldNode.js` : `smoothstep`, « A unitless value for artistic purposes » ; `BokehShader2.js` : focale en mm, « CoC = 0.03 », résultat borné entre 0 et 1 ; `MotionBlur.js` : vecteurs de mouvement, 16 échantillons) ; Babylon.js 9.35.0 (`thinCircleOfConfusionPostProcess.ts` : ouverture = `lensSize / fStop` ; `thinMotionBlurPostProcess.ts` : par objet, 32 échantillons, `motionStrength`) ; PlayCanvas 2.23.3 (`camera-frame.js` : `focusDistance`, `focusRange`, `blurRadius`, ni ouverture ni focale) ; three-gpu-pathtracer 0.0.28 (`PhysicalCamera.js` : `fStop`, `focusDistance`, `apertureBlades` ; README : « The project requires WebGPU », « Only MeshStandardMaterial and MeshPhysicalMaterial are supported » ; dépendances `three >= 0.187.0`, `three-mesh-bvh`, `xatlas-web`). Étiquettes, commits, dates et licences : déjà vérifiés par `sources.md`.
- `docs/pile-technique.md`, tableau des navigateurs : chaque case est celle de `api/GPU.json` et de `api/WebGL2RenderingContext.json` à l'étiquette `v8.1.8` des données de MDN (WebGL2 : Chrome 56, Chrome Android 58, Firefox 51, Safari 15 ; WebGPU : Chrome 144 avec Linux sur Intel Gen12 ou plus, 113 à 143 sans Linux, Chrome Android 121, Firefox 141 partiel, Firefox Android non, Safari 26 ; Safari iOS et Samsung Internet en miroir).
- `docs/pile-technique.md`, outillage, contre le dépôt : versions de `app/package.json` (TypeScript 7.0.2, Vite 8.3.6, Babylon.js 9.35.0 pour les trois paquets) ; `inlineDynamicImports` et polyfill de préchargement désactivé (`app/vite.config.ts`) ; `limitDeviceRatio` à 2 (`app/src/main.ts`, l. 168) ; dans `abstractEngine.pure.js` de Babylon.js 9.35.0, `adaptToDeviceRatio` faux par défaut, niveau 1 / min(plafond, densité) à la création, puis rapport des densités dans `resize()` sans plafond ; clé `tutophoto.lang` ; `window.__tutophoto` ; profils de la routine (1280 × 800, « Pixel 7 », « iPhone 14 », sans WebGL 2) et seuil de 60 % du contrôle de la profondeur de champ (`scripts/test_app.cjs`, l. 86-90 et 482) ; Playwright 1.63.0 installé hors du dépôt (`routine.yml`). Fichier du simulateur construit le 12 novembre : 4 175 464 octets, 970 167 une fois compressé (gzip), pour « 4,1 Mo, environ 950 ko » à la version 0.3.25.
- `docs/questions-ouvertes.md`, contre les fichiers de la scène et le code : photo de fond de 8192 × 4096 px, fichier HDR de 1024 × 512 px, fond à 500 m (`DOME_RADIUS`), hauteur de 1,6 m (`EYE_HEIGHT`), 199 850 triangles pour Fabienne & Percy et 99 964 pour Dennis (comptés dans les fichiers glTF), seuils de la détection des yeux (0,4 %, 0,8 %, 25 % : `app/src/camera/faces.ts`, l. 67-69). Calculs refaits : 1 − 2/30 = 0,933 ; 34,34 Mio à 2 Mbit/s = 144 s, soit 2 min 24 s, et 288 s à 1 Mbit/s.
- `docs/historique.md`, 8 novembre, contre Poly Haven (lu le 14 novembre 2026) : `island_tree_01` compte 1 599 403 triangles dans son fichier glTF 1k, et l'ensemble pèse 66 337 268 octets (66,3 Mo) ; `jacaranda_tree` : 312 356 d'après l'API. Deux nuances : les deux nombres ne sont pas la même mesure (l'API donne 3 729 692 pour `island_tree_01`), et la catégorie « trees » de l'API compte deux arbres sous 300 000, `quiver_tree_02` (153 887) et `quiver_tree_01` (269 522), des aloès arborescents du Namaqualand, que « arbre de parc » écarte sans le dire. Calculs refaits : 1 060 032 + 504 584 + 34 787 = 1 599 403 ; 0,6 / 2,05 = 0,293 m par unité, soit 3,10 et 3,89 m/s ; 100 Go ÷ 50 Mo = 2 000.
- `docs/historique.md`, comptes de la v0.1 à la v0.2 : 163 + 29 − 1 = 191 ; 24 notions de l'audit dans la liste ; 15 compléments ; 11 situations ; 177 + 12 + 2 = 191.
- `docs/propositions.md` : Wikipedia (source secondaire), « Umbra, penumbra and antumbra », révision 1379008615, lue le 14 novembre 2026 : « the region in which only a portion of the light source is obscured by the occluding body » et « for a collimated beam (such as a point source) of light, only the umbra is cast ». Guide Lowel de Tiffen : le soleil « so far away, it appears smaller », « the entire white cloudy sky is now the light source », « the reflector's surface becomes the light source ». Diamètre apparent du Soleil : vérifié par `sources.md`.
- Décisions rapportées avec leur trace dans `docs/historique.md` : forme B de l'indicateur d'équilibre et « suivons ta reco » (l. 150-151), modes de zone et détection des yeux (l. 153-154), principe du 10 novembre (l. 159 ; `docs/cadrage.md`, l. 9), découpage du 10 novembre (l. 169-173), couverture de l'autofocus et partage égal pour l'A7 III (l. 185-190), plan des écrans (l. 191), propositions du 11 novembre (l. 194), densité du viseur (l. 197-198), grilles (l. 203). Les dates des règles de `CLAUDE.md` (7, 8, 9, 10 et 11 novembre) sont celles de ces entrées et de `CHANGELOG.md`.
- Pull request 59 (version 0.3.53), lue sur GitHub : résultats de la routine reportés, limites de l'émulation dites, pas de lien de session (`CLAUDE.md`, l. 23 et 32).
- Releases : 60 releases sur GitHub, une par tag, de `v0.2.3` à `v0.3.57`, chacune publiée dans la minute qui suit sa fusion (`CHANGELOG.md`, l. 3).
- Nombres de sources annoncés par le changelog : 78 à la version 0.2.0, puis 3, 1, 8, 3 et 3 sources ajoutées (versions 0.3.2 à 0.3.6), soit 96 ; onze à la version 0.3.12 (107), neuf à la version 0.3.13 (116), dix et onze aux versions 0.3.56 et 0.3.57 (151, puis 172) : ce sont les nombres d'entrées de `data/sources.yaml` aux tags.
- `CHANGELOG.md`, tailles de la scène : dossier `app/public/scenes/parc` de 19 258 444 octets à `v0.3.9` (« 18,4 Mio ») et de 36 029 661 octets à `v0.3.10` (« 34,4 Mio ») ; cinq fichiers `license.txt` dans le manifeste (version 0.3.55).
- `docs/historique.md`, l. 133, contre `app/src/camera/photo.ts`, l. 44-47 : copies espacées de 4 px au plus, de 16 à 256 rendus, 5 s au plus.
- `docs/etat-des-travaux.md`, l. 71 : `whiteBalanceEnabled`, `temperature` et `tint` existent dans `imageProcessingConfiguration.pure.js` de Babylon.js 9.35.0 ; l. 18 : 123 constats confirmés et 20 réfutés, sommes refaites sur les neuf rapports cités.
- `REPRISE.md`, section 7 : 92 notions en N1, 80 en N2, 19 en N3 ; 381 renvois, dont 180 sans retour ; 82 notions clés d'aucune situation : ce sont les nombres que rend `scripts/coverage.py` aujourd'hui. Les sections 4, 5 et 10 (données) relèvent des rapports sur le référentiel et les sources.
- « Pas d'emoji » (`CLAUDE.md`, l. 13) : aucun dans les fichiers suivis (recherche des plages Unicode des émojis dans les `.md`, `.ts`, `.mjs`, `.yaml`, `.html`, `.py`).
- `docs/propositions.md`, l. 76 à 83 : SIT-28, SIT-V2-02 et SIT-V2-06 portent les titres cités ; SIT-04, SIT-23 et SIT-39 sont de niveau N1 et se passent près d'une fenêtre (`data/situations.yaml`).
- `CLAUDE.md`, l. 4, et `README.md`, l. 50 : `pages.yml` publie à chaque push sur `main` (et à la main) ; `validate.yml` tourne sur chaque pull request et sur `main`.
- `README.md`, l. 56 : le manifeste `scene.json` porte, pour chaque élément, ses auteurs, sa licence, et pour chaque fichier sa taille et son empreinte.

## Je ne sais pas

- Ce que montre le site publié le 14 novembre 2026 : `badmiaoo.github.io` n'est pas joignable depuis la session de travail. Les README sont confrontés au code de la version 0.3.57, celle que `pages.yml` publie à chaque fusion sur `main`.
- Si GitHub affiche les commits comme vérifiés, et pour quelles périodes (DOC-03).
- Si un accord de Renderpeople existe (DOC-05), et ce que Julien a dit au juste pour les trois attributions de DOC-08 : la conversation n'est pas dans le dépôt.
- « Aucun fichier de flou de mouvement dans le dépôt » de PlayCanvas (`docs/pile-technique.md`, l. 30) : l'API de GitHub a refusé la liste des fichiers (403) ; seul `camera-frame.js` est relu.
- Les limites de GitHub Pages (1 Go, 100 Go par mois, 10 minutes) : `docs.github.com` n'est pas joignable ; `sources.md` a vérifié que la page existe au commit cité, pas ces valeurs.
- Le cours de Marc Levoy cité par `docs/lire-le-referentiel.md`, l. 26, et Benny the Rottweiler sous CC BY-SA 3.0 (`docs/historique.md`, l. 103) : hôtes non joignables.
- Les mesures faites sur le téléphone de Julien ou sur la machine de Claude (0,8 s et 2,0 s, 53 minutes, 324 fichiers, tailles et vitesses mesurées dans les animations, island_tree_01 simplifié à 157 494 triangles) : non refaites.

## Sources relues

Toutes lues le 14 novembre 2026. Fichiers sous `pages/` du dossier de l'audit, dans le bloc-notes de la session.

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| three.js, étiquette `r187` : `DepthOfFieldNode.js`, `BokehShader2.js`, `MotionBlur.js` | `https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/jsm/…` | `three-*.js` |
| Babylon.js, étiquette `9.35.0` : `thinCircleOfConfusionPostProcess.ts`, `thinMotionBlurPostProcess.ts` | `https://raw.githubusercontent.com/BabylonJS/Babylon.js/9.35.0/packages/dev/core/src/PostProcesses/…` | `babylon-*.ts` |
| PlayCanvas, étiquette `v2.23.3` : `camera-frame.js` | `https://raw.githubusercontent.com/playcanvas/engine/v2.23.3/src/extras/render-passes/camera-frame.js` | `playcanvas-camera-frame.js` |
| three-gpu-pathtracer, étiquette `v0.0.28` : `PhysicalCamera.js`, `README.md`, `package.json` | `https://raw.githubusercontent.com/gkjohnson/three-gpu-pathtracer/v0.0.28/…` | `pathtracer-*` |
| Données de compatibilité de MDN, étiquette `v8.1.8` : `api/GPU.json`, `api/WebGL2RenderingContext.json` | `https://raw.githubusercontent.com/mdn/browser-compat-data/v8.1.8/api/…` | `mdn-*.json` |
| Poly Haven, API : fiches de `island_tree_01` et de `jacaranda_tree`, liste des modèles, fichiers de `island_tree_01` ; fichier glTF 1k de `island_tree_01` | `https://api.polyhaven.com/info/…`, `https://api.polyhaven.com/assets?t=models`, `https://api.polyhaven.com/files/island_tree_01`, `https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/island_tree_01/island_tree_01_1k.gltf` | `ph-*.json`, `island_tree_01_1k.gltf` |
| Wikipedia (source secondaire), « Umbra, penumbra and antumbra », révision 1379008615 | `https://en.wikipedia.org/w/index.php?title=Umbra,_penumbra_and_antumbra&oldid=1379008615` | `wiki-umbra-1379008615.html` |
| Tiffen, guide Lowel, « Foundations of Lighting: Understanding Soft Light » | `https://tiffen.reamaze.com/kb/lowel-guides/foundations-of-lighting-understanding-soft-light` | `tiffen-soft-light.html` |
| Art Adams, ProVideo Coalition, 27 décembre 2011 (page ouverte ; rien n'en est cité ici) | `https://www.provideocoalition.com/lighting_strategies_what_makes_soft_lights_cast_soft_shadows/` | `pvc-adams.html` |
| GitHub, dépôt du projet : tags (`git ls-remote --tags origin`), releases, commits e89680d, 19a744b et 8be11bd, pull request 59 | outil GitHub de la session | (non enregistré) |
| Babylon.js, paquet `@babylonjs/core` 9.35.0 : `Engines/abstractEngine.pure.js`, `Materials/imageProcessingConfiguration.pure.js` | `app/node_modules/@babylonjs/core/` | (dans le dépôt de travail) |
