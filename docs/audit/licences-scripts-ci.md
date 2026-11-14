# Audit du lot « Licences, scripts de contrôle, CI et confidentialité du dépôt public »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail de la branche de l'audit, version 0.3.58 du changelog.
- État : constats non contre-vérifiés.
- Bilan : 9 constats (1 « incohérent », 8 « à améliorer », aucun « faux », aucun « non sourcé »), 31 points vérifiés et justes, 12 « Je ne sais pas ». Les licences annoncées sont celles des pages d'origine, les fichiers de Poly Haven sont identiques à l'origine, les actions de la CI sont bien épinglées sur les versions annoncées, et l'historique ne contient rien de privé qui ne soit déjà consigné. Ce qui manque : les contrôles lisent l'état final des fichiers de texte et croient ce qu'on leur déclare. Ils ne lisent ni le contenu des commits intermédiaires (LIC-01), ni les fichiers binaires (LIC-03), ni les fichiers de tiers hors des scènes (LIC-05), ni les licences des dépendances (LIC-09) ; et une pull request peut allonger elle-même la liste de ce qu'on lui tolère (LIC-06).
- Écrit en deux fois : un premier agent a été coupé après LIC-03 ; le second a relancé ses scripts (mêmes résultats), puis écrit la suite.

## Périmètre

- Licences : `LICENSE`, `LICENSES/`, `docs/licences.md` ; `app/public/scenes/parc/scene.json`, les fichiers de la scène et `schemas/scene.schema.json` ; licences des dépendances (`app/package.json`, `app/package-lock.json`, paquets installés, `app/scripts/copy-licences.mjs`, `requirements.txt`) ; polices et images du site.
- Scripts de contrôle : `scripts/changelog.py`, `scripts/check_public.py`, `scripts/check_scenes.py`. `scripts/validate.py` et `scripts/coverage.py` sont jugés par `docs/audit/referentiel-structure.md`.
- CI : `.github/workflows/*.yml`.
- Confidentialité : `docs/publication.md`, la règle « rien ne doit filtrer » de `CLAUDE.md`, et tout l'historique git (messages, auteurs, contenus).

## Méthode

1. Lecture complète des fichiers du périmètre.
2. Essai des trois scripts sur un clone du dépôt, fait dans le bloc-notes de la session, hors du dépôt : injection de ce qu'ils doivent arrêter, puis relevé de ce qui passe à tort et de ce qui est refusé à tort. Les valeurs injectées sont fabriquées pour l'essai ; aucune n'est réelle. Elles sont décrites ici, pas recopiées : le script d'envoi de ce rapport refuse tout fichier qui contient une adresse électronique, un lien privé ou un chemin local, même en exemple.
3. Recherche dans tout l'historique (322 commits, toutes références, au premier passage ; 324 au second, mêmes résultats) : adresses et noms des auteurs et des committers, messages, lignes ajoutées par chaque commit (`git log --all -p -m`), métadonnées des fichiers binaires. Aucune valeur privée n'est recopiée dans ce rapport : elle est décrite, avec le commit et le fichier.
4. Relecture des pages d'origine des modèles, textures et photos, quand l'hôte répond ; comparaison des empreintes des fichiers avec les fichiers d'origine.
5. Workflows : lecture des cinq fichiers ; empreintes des actions comparées aux étiquettes par `git ls-remote` ; licence et version lues dans les fichiers de chaque action, au commit épinglé ; règles de GitHub (jeton, secrets, cache, approbation) lues dans le dépôt source de sa documentation.
6. Dépendances : champ `license` de chaque paquet du verrou npm, du `package.json` de chaque paquet installé, et des registres npm et PyPI.
7. Aucune écriture dans le dépôt en dehors de ce rapport ; aucun navigateur ; aucune construction du site : le site construit qui a été lu est celui du 12 novembre 2026, présent dans la copie de travail (`app/dist/`, non suivi par git).

Scripts d'essai, pages enregistrées et clones : dossier `audit/licences-scripts-ci/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `origines/`, `copie/` et `copie2/`). Les numéros de ligne sont ceux de la version 0.3.58.

## Sources

Lues le 14 novembre 2026 (fichiers sous `pages/`, sauf mention).

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Poly Haven, API, fiches de `autumn_hockey`, `painted_wooden_bench`, `metal_trash_can` | `https://api.polyhaven.com/info/<identifiant>` et `https://api.polyhaven.com/files/<identifiant>` | `ph-info-*.json`, `ph-files-*.json` |
| Poly Haven, page « License » | `https://polyhaven.com/license` | `ph-license.html` |
| Poly Haven, les 15 fichiers d'origine de la scène | adresses `origin` de `scene.json` (`https://dl.polyhaven.org/…`) | dossier `origines/` |
| Sketchfab, API, fiches des cinq modèles de la scène | `https://api.sketchfab.com/v3/models/<identifiant>` | `sf-api-*.json` |
| Sketchfab, page du modèle « Dennis Posed 004 » | adresse `source` de `scene.json` | `sf-model-dennis.html` |
| SPDX, textes des licences MIT, CC BY-SA 4.0, CC BY 4.0, CC0 1.0 et Apache-2.0, commit `3184648` cité par `docs/licences.md` | `https://raw.githubusercontent.com/spdx/license-list-data/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/<licence>.txt` | `spdx-*.txt` |
| Étiquettes des cinq actions et de gitleaks | `git ls-remote --tags https://github.com/<dépôt>` | `ls-remote-*.txt` |
| Licence, `package.json` et `action.yml` de chaque action, au commit épinglé | `https://raw.githubusercontent.com/actions/<action>/<commit>/…` | `upload-pages-artifact-action.yml` (les autres : lus, non gardés) |
| gitleaks 8.30.1, liste des empreintes et archive `linux_x64` de la release | `https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/…` | dossier `gitleaks/` |
| PyPI, fiches de PyYAML 6.0.3 et de jsonschema 4.26.0 | `https://pypi.org/pypi/<paquet>/<version>/json` | `pypi-*.json` |
| Documentation de GitHub, dépôt `github/docs`, commit `d59b263` du 13 novembre 2026 : `events-that-trigger-workflows.md`, `dependency-caching.md`, `workflow-syntax.md`, `secure-use.md`, `manually-run-a-workflow.md`, les pages citées par `docs/licences.md` et `docs/publication.md`, et les textes réutilisés `pull_request_forked_repos_link.md`, `forked-secrets.md`, `workflow-run-approve-public-fork.md`, `workflows-from-public-fork-setting.md` | `https://raw.githubusercontent.com/github/docs/d59b2631959db46d71ca5f7748ec04311c6d0870/…` | `ghdocs-*.md` |

Non relues :
- Renderpeople (`renderpeople.com`, conditions générales) : source non relue, hôte non joignable (deux essais : `curl`, puis l'outil de lecture de pages). Une recherche sur le Web a été faite : extrait de recherche, page non ouverte.
- Creative Commons (`creativecommons.org`, textes des licences) : source non relue, hôte non joignable. Les textes ont été lus dans le dépôt SPDX, au commit que cite `docs/licences.md`.
- `docs.github.com` : hôte non joignable. Les pages ont été lues dans leur dépôt source, `github/docs`.
- `api.github.com` et les pages de `github.com` : refus 403 du proxy. Seuls `git ls-remote`, les fichiers bruts et les fichiers des releases répondent.

## Ce qui n'a pas été couvert

- gitleaks n'a pas été lancé : l'archive de la release a été téléchargée et son empreinte vérifiée, mais l'exécution d'un programme téléchargé a été refusée dans la session.
- Ce qui n'est pas dans git : descriptions, commentaires et historiques d'édition des pull requests, journaux d'Actions, textes des releases. Seule la liste des pull requests a été lue.
- Les réglages du dépôt sur GitHub (protection de `main`, approbation des workflows des tiers, environnement `github-pages`) : les outils de la session ne les lisent pas.
- Les 21 fichiers venus de Sketchfab n'ont pas été comparés à leur origine : le téléchargement demande un compte.
- Les conditions de Renderpeople : hôte non joignable.
- `scripts/validate.py`, `scripts/coverage.py`, `scripts/referentiel.py`, `scripts/extract_reprise.py` et `scripts/test_app.cjs` relèvent d'autres rapports.

## Constats

Classés du plus grave au moins grave ; les identifiants suivent l'ordre d'écriture et ne sont pas renumérotés. Aucun constat « faux » ni « non sourcé » : les contrôles font ce que leur code dit, et rien de privé n'a filtré en dehors de ce que `docs/publication.md` consigne déjà. Les défauts sont dans ce que les contrôles ne regardent pas.

### LIC-08 · incohérent · Quatre phrases de la documentation des licences et de la publication ne disent pas ce que montrent le dépôt et le site construit

- Endroit : `docs/licences.md`, l. 10 ; `docs/publication.md`, l. 12 et 27 ; `docs/pile-technique.md`, l. 90.
- Ce qui est écrit, et la preuve :
  1. `docs/licences.md`, l. 10 : « `content/` (à venir) ». Le dossier existe depuis le 11 novembre 2026 (commit « Fiches des notions et des situations de la V1 minimale ») et compte 44 fichiers suivis. Déjà vu en passant par le rapport `documentation.md`, hors de son lot.
  2. `docs/publication.md`, l. 27 : « Les 28 commits faits par Claude du 7 au 8 novembre 2026 ». Les 28 commits de `scripts/check_public_historique.txt` datent tous du 7 novembre 2026, de 10 h 46 à 16 h 52 UTC (`git log -1 --format=%cI` sur chaque ligne). Le 8 novembre est le jour où la fuite a été vue.
  3. `docs/publication.md`, l. 12 : l'exception acceptée par Julien porte sur son nom « comme auteur des commits de fusion ». Sur `main`, Julien est l'auteur de 101 commits sur 171, dont 38 ne sont pas des fusions (`git rev-list --count`). `CLAUDE.md`, l. 21, dit « auteur des commits », et `docs/audit/consignes-agents.md` demande depuis le 12 novembre son nom sur tous les commits. La page de publication est restée à l'ancienne formule.
  4. `docs/pile-technique.md`, l. 90 : « le polyfill de préchargement de Vite est désactivé, si bien que le site publié ne contient que notre code et celui de Babylon.js ». Le fichier `assets/simulateur-*.js` de la construction du 12 novembre 2026 présente dans la copie de travail (4 175 464 octets ; configuration inchangée depuis le 11) contient la fonction de préchargement de Vite : les chaînes « vite:preloadError » et « modulepreload » y sont, et la première ne se trouve ni dans `app/src/` ni dans les paquets de Babylon.js, seulement dans `node_modules/vite/`. Le fichier commence aussi par des fonctions d'assemblage qui ont la forme de celles de Rolldown (non prouvé). Vite et Rolldown sont sous MIT (registre npm, relu le 14 novembre 2026), dont le texte demande : « The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software ». Je ne sais pas si ces quelques centaines d'octets sont une « substantial portion » ; la page `licences/` du site ne les mentionne pas.
- Correction proposée : corriger les quatre phrases. Pour le point 4 : écrire « notre code, celui de Babylon.js et les fonctions d'assemblage de Vite et de Rolldown (MIT) », et recopier leurs deux fichiers de licence dans `licences/` (deux lignes dans `app/scripts/copy-licences.mjs`, une ligne dans la page). C'est le choix prudent, et il coûte deux fichiers.

### LIC-01 · à améliorer · Ce qui est ajouté puis retiré dans la même pull request reste dans l'historique publié sans être contrôlé

- Endroit : `scripts/check_public.py`, l. 99-109 (`scan_files`) et l. 112-127 (`scan_commits`) ; `docs/publication.md`, l. 16 ; `CLAUDE.md`, l. 25.
- Ce qui est fait : le script lit les fichiers suivis par git dans leur état courant, puis, pour chaque commit, les adresses de l'auteur et du committer et le message. Il ne lit pas le contenu des commits. Seul gitleaks lit l'historique, et seulement pour les secrets.
- Preuve (essai sur le clone, le 14 novembre 2026) :
  1. un commit ajoute un fichier `docs/essai-fuite.md` de trois lignes : une adresse électronique fabriquée, un lien fabriqué vers un document Google Docs, un chemin macOS avec un nom d'utilisateur. `python3 scripts/check_public.py --commits all` : « 3 problème(s) » ;
  2. le commit suivant supprime le fichier. Même commande : « 176 fichier(s) texte, 324 commit(s) contrôlé(s) : 0 problème(s) » ;
  3. `git log --all --oneline -S"<l'adresse>"` trouve toujours les deux commits : les trois valeurs sont dans l'historique.
- Pourquoi cela compte : les pull requests sont fusionnées par un commit de fusion, sans squash (`CLAUDE.md`, l. 34) ; chaque commit intermédiaire est donc publié sur `main`, et « l'historique publié ne se réécrit pas ». La CI ne regarde que le dernier état : une adresse, un lien privé ou un chemin local corrigé avant la fusion passe au vert et reste public. Depuis la règle du 13 novembre (« son premier commit est poussé aussitôt »), chaque commit est même public avant tout contrôle.
- État réel de l'historique : la même recherche, faite sur le vrai dépôt avec les motifs du script appliqués aux lignes ajoutées par chacun des 322 commits (script `historique.py`), ne trouve qu'un cas : le lien du Claude Doc d'origine dans `REPRISE.md`, commit `e89680d`, déjà consigné dans `docs/publication.md` (« Avant le passage en public »). Rien d'autre n'a filtré par cette voie.
- Correction proposée : dans `scan_commits`, lire aussi les lignes ajoutées par chaque commit de la plage (`git log -p -m --format=… <plage>`, lignes qui commencent par « + ») et leur appliquer `scan_text`, avec une liste de tolérances de la même forme que `scripts/check_public_historique.txt` (commit et type de problème) ; y inscrire `e89680d` pour le lien de `REPRISE.md`. Sur l'historique actuel, ce contrôle ne signale que ce cas. Écrire dans `docs/publication.md` que les fichiers binaires ne sont pas lus (LIC-03).

### LIC-06 · à améliorer · `scripts/check_public.py` : ce qu'une pull request tolère pour elle-même, et ce que le script refuse à tort

- Endroit : `scripts/check_public.py`, l. 35-39 (`ALLOWED_EMAIL`), l. 52-56 et 64 (motifs), l. 79-84 et 125 (tolérances) ; `scripts/check_public_historique.txt` ; `docs/publication.md`, l. 29.
- Ce qui est écrit : `docs/publication.md` : « le contrôle tolère ce seul problème dans ces seuls commits ». En-tête de la liste : « tout nouveau commit est contrôlé ».
- Preuve 1, la liste des tolérances n'est pas figée (essai sur un clone, le 14 novembre 2026) :
  1. un commit A dont le message porte une ligne « Claude-Session » avec un lien de session fabriqué : `python3 scripts/check_public.py --commits all` répond « 1 problème(s) » ;
  2. un commit B qui ajoute l'empreinte de A à `scripts/check_public_historique.txt` : « 178 fichier(s) texte, 326 commit(s) contrôlé(s) : 0 problème(s) ».

  La liste est lue dans la copie de travail (l. 76 et 81-84), donc dans la pull request elle-même. « Ces seuls commits » ne tient qu'à la relecture de ce fichier. État réel : la liste a 28 lignes, toutes des commits d'avant la version 0.3.9 (voir « Vérifié »).
- Preuve 2, refus à tort (script `essai_check_public.py`, 53 lignes fabriquées). Les lignes sont décrites, pas recopiées : la première rédaction de ce constat les citait, et le script d'envoi de ce rapport, qui appelle `scan_text`, a refusé le fichier pour cinq d'entre elles. C'est la preuve la plus directe du constat.
  - un nombre précédé du signe plus et écrit avec des espaces de milliers (un million de photons, douze millions et demi d'électrons) : « numéro de téléphone international » (l. 56) ;
  - un identifiant de dix chiffres qui commence par zéro : « numéro de téléphone » (l. 55) ;
  - un nom d'image pour écran dense, formé d'un nom, d'une arobase, de « 2x » et de l'extension `.png` : « adresse électronique » (l. 64 : rien n'exclut une extension de fichier) ;
  - un exemple de code où une clé d'API reçoit, entre guillemets, un texte d'attente en majuscules : « secret écrit en clair » (l. 52-54) ;
  - toute adresse sous le domaine de Google Docs, même la page d'accueil du service : « lien vers une ressource privée » (l. 59) ;
  - une adresse « noreply » de GitHub formée du seul pseudo, sans numéro devant : refusée, le motif de la l. 36 exige un nombre, le signe plus, puis le pseudo. Je ne sais pas si GitHub attribue encore cette forme (page non relue).
- Pourquoi cela compte : il n'existe aucun moyen d'excepter une ligne d'un fichier. La seule tolérance porte sur les messages de 28 commits. Un refus à tort se règle donc en reformulant le texte, ou en modifiant le motif pour tout le dépôt. État réel : aucun refus à tort aujourd'hui (« 177 fichier(s) texte, 324 commit(s) contrôlé(s) : 0 problème(s) »).
- Correction proposée :
  1. tolérances : n'accepter une empreinte de la liste que si le commit est un ancêtre du commit de fusion de la version 0.3.9, écrit en dur dans le script (`git merge-base --is-ancestor`). La liste ne peut alors plus s'allonger sans que le script change, ce qui se voit à la relecture ;
  2. téléphones : pour le motif international, refuser les groupes de trois chiffres répétés (`\d{3}(?: \d{3})+`), qui sont des milliers ; garder le motif français ;
  3. adresses : exclure les correspondances dont la fin est une extension d'image (`.png`, `.jpg`, `.webp`, `.svg`) ;
  4. une liste d'exceptions pour les fichiers, de la même forme que celle des commits (chemin, type de problème), vide au départ et soumise à la même relecture.

### LIC-02 · à améliorer · Des formes courantes de ce que la règle interdit passent le contrôle

- Endroit : `scripts/check_public.py`, l. 43-63 (`PATTERNS`).
- Ce qui est écrit : `CLAUDE.md`, l. 20 : ne jamais écrire « secret (jeton, clé, mot de passe, clé privée), donnée personnelle (adresse électronique hors « noreply », téléphone, adresse postale), lien vers une ressource privée (Claude, Google Docs ou Drive, Dropbox, Notion), chemin local qui révèle un nom d'utilisateur ».
- Preuve : 53 lignes fabriquées passées à `scan_text` (script `essai_check_public.py`). Passent à tort :
  - le lien d'une session Claude écrit sans « https:// », ou avec « www. » devant le domaine, et l'identifiant de session écrit seul après « Claude-Session: ». Le motif de la l. 58 exige `https?://claude\.ai/`. C'est la forme exacte de la fuite du 8 novembre, à un préfixe près ;
  - une page Notion publiée sous le sous-domaine d'un espace (`<espace>.notion.site/…`) : le motif de la l. 60 n'accepte que `notion.so` et `notion.site` nus ou précédés de « www. » ;
  - un mot de passe ou une clé sans guillemets (`password: valeur` dans un fichier YAML, `API_KEY=valeur` dans un fichier d'environnement) : le motif des l. 52-54 exige des guillemets autour de la valeur ;
  - un jeton d'API dans un en-tête « Authorization: Token … », et une variable dont le nom finit par `API_TOKEN` ou vaut `token` : ces noms ne sont pas dans la liste de la l. 53. Le projet a un tel jeton : la clé de l'API de Sketchfab du compte de Julien, « enregistrée dans l'environnement de travail de Claude » (`docs/historique.md`, l. 104) ; elle a la forme de 32 chiffres hexadécimaux, qu'aucun motif du script ne reconnaît ;
  - un en-tête de clé privée PGP (« PRIVATE KEY BLOCK ») : le motif de la l. 44 exige « PRIVATE KEY----- » ;
  - une adresse postale : aucun motif, alors que la règle la nomme ;
  - un lien de partage Dropbox servi par `dl.dropboxusercontent.com`, un formulaire Google en adresse courte, un lien OneDrive : hors de la liste de la règle, donc hors du script.
- Ce qui est juste : jetons GitHub, clés AWS, Google, Anthropic, clés privées RSA et OpenSSH, mot de passe entre guillemets, adresses électroniques, téléphones français, liens Claude, Google Docs, Drive, Dropbox et Notion dans leur forme usuelle, chemins macOS, Linux et Windows : tous arrêtés. Les secrets sans guillemets sont en partie couverts par gitleaks dans la CI ; je n'ai pas pu lancer gitleaks pour le mesurer (voir « Je ne sais pas »).
- Correction proposée, par ordre d'utilité :
  1. session Claude : chercher `claude\.ai/(code/)?(session_|chat/|share/|project/|artifact)` sans exiger le schéma, et l'identifiant seul (`session_` suivi d'au moins dix lettres ou chiffres), comme le fait déjà le script d'envoi de l'audit ;
  2. Notion : accepter un sous-domaine (`([\w-]+\.)?notion\.(so|site)/`) ;
  3. secrets : ajouter `token` et `api[_-]?token` aux noms, et un second motif sans guillemets pour une valeur d'au moins 16 caractères sans espace ; ajouter « Authorization: (Token|Bearer) » suivi d'au moins 12 caractères ;
  4. clé privée : `-----BEGIN [A-Z0-9 ]*PRIVATE KEY( BLOCK)?-----` ;
  5. adresse postale : pas de motif fiable ; écrire dans `docs/publication.md` que ce point de la règle n'est contrôlé par aucun script.

### LIC-03 · à améliorer · Fichiers binaires, noms de fichiers, noms d'auteurs et étiquettes annotées ne sont pas contrôlés, et la documentation ne le dit pas

- Endroit : `scripts/check_public.py`, l. 104-106 (fichiers binaires ignorés), l. 114 (seules les adresses et le message d'un commit sont lus) ; `docs/publication.md`, l. 16.
- Ce qui est écrit : « `scripts/check_public.py` cherche ces informations dans tous les fichiers suivis par git et dans les messages de tous les commits, et vérifie les adresses des auteurs et des committers. »
- Preuve (essais sur le clone, résultat « 0 problème(s) » à chaque fois) :
  - un fichier `docs/essai.gif` dont les premiers octets contiennent un octet nul, puis une adresse électronique et un chemin macOS en clair : ignoré comme binaire (l. 105). Une photo avec ses métadonnées (auteur, numéro de série, position GPS) passerait de la même façon ;
  - un fichier de texte enregistré en UTF-16, avec une adresse électronique et un chemin macOS : ignoré lui aussi, car cet encodage met un octet nul après chaque lettre (essai du 14 novembre 2026, second clone) ;
  - un fichier dont le nom contient une adresse électronique : le nom n'est pas lu ;
  - un commit dont le nom d'auteur contient un nom et un numéro de téléphone : seul le champ de l'adresse est lu (`%ae`, `%ce`) ;
  - une étiquette annotée dont le message contient une adresse électronique, et une autre créée avec une adresse personnelle : ni le message ni l'adresse du créateur d'une étiquette ne sont lus.
- État réel du dépôt (vérifié, rien n'a filtré par ces voies) :
  - les 24 fichiers binaires ajoutés au dépôt depuis son début sont ceux de la scène de parc. Leurs métadonnées, lues segment par segment (script `metadonnees.py`) : aucune donnée de Julien. Les quatre textures réduites pour le dépôt n'ont qu'un en-tête JFIF ; les textures de Poly Haven ont une date et une résolution dans leur bloc Exif ; `autumn_hockey.jpg` porte les commentaires de Blender de son auteur (nom d'un fichier de travail sur un lecteur « X: », date de 2018), sans nom d'utilisateur ;
  - les 322 commits n'ont que quatre couples de noms : « Julien Touzeau » et « Claude » comme auteurs, « Claude », « GitHub » et « Julien Touzeau » comme committers, toujours avec une adresse « noreply » ;
  - les 60 étiquettes de version sont posées par `tag.yml` à partir du changelog, lui-même contrôlé comme fichier.
- Correction proposée : dans `docs/publication.md`, écrire ce que le script ne lit pas (fichiers binaires, noms de fichiers, noms d'auteurs, étiquettes) ; dans le script, lire aussi `%an` et `%cn` et les chemins de `git ls-files` avec `scan_text` (quelques lignes). Pour les images : une règle écrite suffit tant que les seuls fichiers binaires sont ceux des scènes (« toute image ajoutée au dépôt est d'abord vidée de ses métadonnées »), le contrôle des scènes listant déjà chaque fichier.

### LIC-05 · à améliorer · `scripts/check_scenes.py` croit le manifeste sur parole, et ne regarde que `app/public/scenes/`

- Endroit : `scripts/check_scenes.py`, l. 30 et 66-103 ; `schemas/scene.schema.json`, l. 49 ; `docs/licences.md`, l. 29-33 ; `CLAUDE.md`, l. 41-42.
- Ce qui est écrit : `docs/licences.md` : le script « refuse un fichier absent du manifeste, une empreinte ou une taille qui ne correspond pas, une licence autre que CC0 ou CC BY, et les fichiers trop lourds » ; « Pour les modèles de Sketchfab, le fichier `license.txt` fourni dans l'archive (titre, auteur, licence, texte de crédit) est gardé à côté du modèle ». `CLAUDE.md` : « Vérifier la licence de toute dépendance, de tout modèle et de toute scène avant de l'ajouter » ; « modèles et textures 3D de tiers sous CC0 ou CC BY uniquement, avec auteur, adresse d'origine et licence dans les métadonnées de la scène ».
- Preuve : 27 scènes modifiées, passées au script sur un clone (`essai_check_scenes.py` ; la scène est remise après chaque cas). Passent à tort, « 0 erreur(s) » :
  1. le manifeste déclare « CC0-1.0 » pour un modèle dont le `license.txt` et le fichier glTF (`asset.extras.license`) disent « CC-BY-4.0 ». Le bouton « Crédits » lit le manifeste (`app/src/credits.ts`, l. 61-62) : il afficherait CC0 ;
  2. le `license.txt` d'un modèle réécrit en « CC-BY-NC-4.0 », empreinte mise à jour dans le manifeste, qui dit toujours CC BY 4.0 ;
  3. un auteur, dans le manifeste, différent de celui du `license.txt` et du fichier glTF ;
  4. une image de tiers posée hors des scènes (`app/public/img/photo.jpg`), un modèle posé dans `app/src/` : le script ne parcourt que `app/public/scenes/` (l. 30), et aucun autre contrôle ne regarde les images ;
  5. un fichier glTF dont une texture est une adresse extérieure (`https://…`), empreinte mise à jour : le site chargerait un fichier que le manifeste ne liste pas ;
  6. une texture remplacée par une autre, empreinte mise à jour, sans champ `changes` : indétectable sans le fichier d'origine ;
  7. une date de lecture impossible (`2026-99-99`) ou dans le futur : le schéma ne contrôle que la forme (l. 49) ;
  8. une situation inconnue du référentiel (`SIT-99`) dans `situations`.
- Ce qui est juste (16 cas arrêtés) : licence absente, CC BY-NC, CC BY-SA, adresse du texte d'une autre licence ; auteur absent ou vide ; adresse d'origine absente ou en `http` ; fichier absent du manifeste, modifié d'un octet, listé mais absent, listé par deux éléments ; fichier de 26 Mio ; chemin qui sort du dossier ; dossier de scène sans manifeste.
- État réel de la scène (vérifié, rien n'est faux aujourd'hui) :
  - les cinq modèles de Sketchfab : titre, adresse d'origine, auteur et licence du manifeste sont ceux de leur `license.txt` et de leur fichier glTF (comparaison par script), et ceux de l'API de Sketchfab relue le 14 novembre 2026 (« CC Attribution », `http://creativecommons.org/licenses/by/4.0/`) ;
  - les 15 fichiers de Poly Haven sont identiques, octet pour octet, à ceux de leur adresse d'origine retéléchargés le 14 novembre 2026 ;
  - les sept fichiers glTF ne citent que des fichiers locaux, tous listés ;
  - aucun fichier d'image, de police, de son ou de modèle n'est suivi par git hors de `app/public/scenes/` (`git ls-files`).
- Correction proposée :
  1. dans `check_scenes.py`, pour chaque élément qui a un `license.txt` au format de Sketchfab ou un fichier glTF avec `asset.extras` : comparer licence, auteur et adresse d'origine au manifeste (une quinzaine de lignes ; les cinq modèles passent) ;
  2. refuser, dans un fichier glTF, une `uri` qui n'est pas un fichier listé de la scène ;
  3. refuser tout fichier binaire suivi par git hors de `app/public/scenes/` (ou toute extension d'image, de police, de son, de vidéo, de modèle), avec une liste d'exceptions vide au départ : c'est aussi ce qui manque à `check_public.py` (LIC-03) ;
  4. `verified` : une vraie date, pas dans le futur (`datetime.date.fromisoformat`).

  Le cas 6 ne se contrôle que par un nouveau téléchargement : à refaire à la main quand une scène change, comme ici.

### LIC-04 · à améliorer · `scripts/changelog.py check` : une base introuvable passe en silence, et trois règles écrites en tête du changelog ne sont pas contrôlées

- Endroit : `scripts/changelog.py`, l. 95-106 (`cmd_check`), l. 31-32 et 54-69 (`parse`) ; `CHANGELOG.md`, l. 5-13 ; `CLAUDE.md`, l. 34.
- Ce qui est écrit : `CLAUDE.md` : chaque pull request « ajoute sa section à `CHANGELOG.md` (contrôlée par `python3 scripts/changelog.py check --base origin/main`) ». `CHANGELOG.md` : « X : 0 jusqu'à la publication de la V1 », « Z : tout le reste […] ; remis à 0 quand Y augmente », « Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré ».
- Preuve : 32 changelogs fabriqués, passés au script sur un clone (`essai_changelog.py` ; aucun commit, le fichier est remis après chaque cas). Passent à tort, code de sortie 0 :
  1. `--base` vers une référence qui n'existe pas, avec un changelog sans nouvelle section : « CHANGELOG.md : 64 version(s) ». L. 96-97 : `shown = git("show", f"{base}:{CHANGELOG}", check=False)`, puis `if shown.returncode == 0:` sans autre branche. Une faute de frappe dans le nom de la base, ou un clone qui n'a pas `origin/main`, désarme donc le contrôle que `CLAUDE.md` demande de lancer avant chaque pull request. Dans la CI, l'étape récupère la base juste avant (`validate.yml`, l. 38), et un échec de `git fetch` arrête l'étape (« By default, fail-fast behavior is enforced using `set -e` for both `sh` and `bash` », `workflow-syntax.md` du dépôt `github/docs`) : le trou est du côté de la machine de travail, pas de la CI ;
  2. numérotation : `0.3.60` après `0.3.58` (version sautée), `0.4.7` (Y augmente, Z n'est pas remis à 0), `7.0.0` (X) : acceptés. Le script exige seulement une version plus grande (l. 100) ;
  3. rubriques : une section sans rubrique (texte libre), une rubrique « Divers », une rubrique seule sans aucun changement dessous : acceptées. Seule la section vide est refusée (l. 74) ;
  4. lien du bas de fichier : `[0.3.59]: https://example.com/` et une comparaison entre deux versions sans rapport sont acceptés. Seule la présence du lien est contrôlée (l. 32 et 76) ;
  5. titres que le script ne voit pas : « `## 0.3.59 - 2026-11-14` » (sans crochets), « `### [0.3.59] - …` », « `##[0.3.59] - …` ». Sans `--base` : code 0, « 64 version(s) », la section est ignorée. Avec `--base` : refus, mais par le message « la pull request doit ajouter une version plus récente que 0.3.58 », qui ne dit pas la cause ;
  6. un sous-titre de niveau 2 dans une section (« `## Notes` ») : accepté, et tout ce qui le suit sort de la section (l. 54-55). `parse` rend alors pour corps « ### Ajouté / - Essai. », sans la suite : le tag et la release seraient tronqués ;
  7. le texte d'une version déjà publiée, réécrit : accepté. Le tag et la release, créés une seule fois (l. 174 et 193), garderaient l'ancien texte ;
  8. une date dans le futur (`2031-01-01`) : acceptée.
- Ce qui est juste (15 cas arrêtés) : pas de nouvelle section ; titre sans tiret, date au format `14/11/2026`, date impossible, préfixe « v », espace en fin de titre ; lien du bas manquant ; section vide ; date antérieure à celle de la version précédente ; section placée ailleurs qu'en tête ; version en double ; version publiée retirée. Les fins de ligne Windows ne gênent pas.
- État réel du fichier : les 64 sections respectent les trois règles non contrôlées. Numérotation continue, sans saut ; quatre noms de rubrique seulement (Modifié 61 fois, Ajouté 48, Corrigé 13, Retiré 1) ; les 63 liens de comparaison suivent tous le modèle `compare/v<précédente>...v<version>`. Et les 60 tags portent, mot pour mot, le texte actuel de leur section, sur le commit que `introducing_commit` retrouve (comparaison faite pour chaque version). Rien n'a donc dérivé : les contrôles manquants peuvent être ajoutés sans toucher au fichier.
- Correction proposée (une vingtaine de lignes dans `cmd_check` et `parse`) :
  1. base illisible : erreur « base introuvable », au lieu du silence ;
  2. avec `--base` : la version en tête vaut celle de la base plus (0, 0, 1) ou plus (0, 1, remise à 0) ; X reste à 0 ;
  3. dans les sections ajoutées : chaque titre de niveau 3 est l'une des quatre rubriques, et la section a au moins une ligne de liste ;
  4. le lien d'une section ajoutée vaut `…/compare/v<précédente>...v<version>` ;
  5. erreur pour toute ligne « ## » placée après le premier titre de version et qui n'est pas un titre de version : cela couvre les cas 5 et 6.

  Les trois tags absents (`v0.2.0` à `v0.2.2`) et les quatre liens qui les visent sont déjà constatés ailleurs (`choix-et-outils.md`, CHX-10 ; `documentation.md`, DOC-04) : rien à ajouter ici.

### LIC-07 · à améliorer · `tag.yml` et `pages.yml` peuvent être lancés à la main sur une autre branche que `main`

- Endroit : `.github/workflows/tag.yml`, l. 3-6 et 34 ; `.github/workflows/pages.yml`, l. 3-6 ; `scripts/changelog.py`, l. 114-118 et 171-189.
- Ce qui est écrit : `tag.yml`, l. 6 : « relance à la main, par exemple après un échec » ; l. 8 : « Seul ce workflow écrit dans le dépôt : il crée des tags et des releases, rien d'autre. » `CHANGELOG.md`, l. 3 : le tag est posé « sur le commit de fusion ».
- Preuve :
  - un lancement à la main se fait sur la branche choisie (« To run a workflow on a branch other than the repository's default branch, use the `--ref` flag », `manually-run-a-workflow.md`) : pour `workflow_dispatch`, `GITHUB_SHA` vaut « Last commit on the `GITHUB_REF` branch or tag » et `GITHUB_REF` « Branch or tag that received dispatch » (`events-that-trigger-workflows.md`, dépôt `github/docs`, commit `d59b263`). Aucune condition des deux workflows ne limite le job à `main` ;
  - `introducing_commit` cherche le commit dans `HEAD` (l. 116-117), pas dans `main`. Essai sur un clone de la branche de l'audit, sans rien écrire (`python3 scripts/changelog.py tag`) : « v0.3.58 -> ba9cd33 (Audit du travail antérieur : règle de reprise et outillage) ». `ba9cd33` est le premier commit de la branche, pas un commit de fusion ;
  - `tag_on_github` ne crée un tag que s'il manque, et ne le déplace jamais (l. 173-189). Un lancement à la main sur une branche de travail poserait donc `v0.3.58` et sa release sur un commit de la branche, pour de bon : après la fusion, le workflow trouverait le tag déjà là.
  - `pages.yml` : même déclencheur. Je ne sais pas si l'environnement `github-pages` du dépôt refuse les déploiements venus d'une autre branche : ce réglage ne se lit pas depuis la session.
- Qui peut le faire : seulement un compte qui a le droit d'écrire dans le dépôt (« Write access to the repository is required to perform these steps », même page), donc Julien ou Claude. Ce n'est pas une faille ouverte à un tiers, c'est un geste à ne pas rater.
- Correction proposée : une ligne dans chaque workflow, `if: github.ref == 'refs/heads/main'` sur le job `tag` et sur le job `build`. Le comportement ne dépend alors plus d'un réglage du dépôt.

### LIC-09 · à améliorer · La règle « vérifier la licence de toute dépendance » ne repose sur aucun contrôle ; les licences sont propres aujourd'hui

- Endroit : `CLAUDE.md`, l. 41 ; `app/package-lock.json` ; `requirements.txt`, l. 1-2 ; `.github/workflows/validate.yml`, l. 24-25 et 88-91.
- Ce qui est fait : la licence des dépendances directes est relevée à la main et écrite dans la documentation (`docs/pile-technique.md`, l. 89-96 et 125 ; `requirements.txt`, l. 2 ; commentaires des workflows). Aucun script ne lit le champ `license` d'un paquet : dans `scripts/*.py` et `.github/workflows/*.yml`, le mot « licence » n'apparaît que dans `check_scenes.py` et dans des commentaires. Une pull request qui ajoute une dépendance sans licence, ou sous une licence dont le projet ne veut pas, passe donc la CI. Les dépendances indirectes (59 des 64 paquets du verrou npm, quatre paquets Python) ne sont relevées nulle part.
- État réel, vérifié le 14 novembre 2026 (script `dependances.py`, registres npm et PyPI) :

  | Ensemble | Paquets | Licences |
  | --- | --- | --- |
  | Verrou npm (`app/package-lock.json`) | 64 | Apache-2.0 : 25 ; MIT : 25 ; MPL-2.0 : 12 (`lightningcss` et ses binaires) ; ISC : 1 (`picocolors`) ; BSD-3-Clause : 1 (`source-map-js`) |
  | Dont dans le site publié | 2 | `@babylonjs/core` et `@babylonjs/loaders`, Apache-2.0, licence et `NOTICE.md` recopiés dans `licences/` (plus les fragments de LIC-08, point 4) |
  | Python, directs | 2 | PyYAML 6.0.3 et jsonschema 4.26.0 : MIT |
  | Python, indirects (versions installées le 14 novembre) | 4 | `attrs`, `jsonschema-specifications`, `referencing`, `rpds-py` : MIT |
  | Hors manifeste | 1 | Playwright 1.63.0 : Apache-2.0 |

  Les 64 paquets du verrou viennent de `registry.npmjs.org` et portent une empreinte `integrity`. Pour les 22 paquets installés, le champ `license` de leur `package.json` est celui du verrou. Pour sept paquets relus au registre (les cinq dépendances directes, `rolldown`, `lightningcss`), licence et empreinte sont celles du verrou. `lightningcss` (MPL-2.0) est un outil de construction, marqué `dev` dans le verrou.
- Correction proposée : une dizaine de lignes dans un script de contrôle lancé par `validate.yml` : lire `app/package-lock.json`, refuser un paquet sans champ `license` ou hors d'une liste (les cinq licences d'aujourd'hui). Pour Python : écrire les quatre dépendances indirectes dans `requirements.txt`, avec leur version et leur licence (le rapport `choix-et-outils.md`, CHX-08, relève déjà qu'elles ne sont pas épinglées).

## Ce qu'un contributeur extérieur malveillant peut obtenir par une pull request

État au 14 novembre 2026 : les 64 pull requests du dépôt viennent du même compte et de la même branche (liste lue par l'outil GitHub de la session). Aucune pull request d'un tiers n'a encore existé. Les citations viennent du dépôt `github/docs`, commit `d59b263` du 13 novembre 2026.

| Ce qu'il viserait | Ce qu'il obtient | Preuve |
| --- | --- | --- |
| Les secrets du dépôt | Rien. | Les trois workflows lancés par une pull request (`validate.yml`, `description.yml`, `routine.yml`) utilisent l'événement `pull_request` ; aucun n'utilise `pull_request_target`, `issue_comment` ni `workflow_run` (recherche dans `.github/workflows/`). « With the exception of `GITHUB_TOKEN`, secrets are not passed to the runner when a workflow is triggered from a forked repository. The `GITHUB_TOKEN` has read-only permissions in pull requests from forked repositories. » Le seul secret cité par un workflow est ce jeton, dans `tag.yml`, lancé sur `main` seulement. |
| Écrire dans le dépôt, poser un tag, publier le site | Rien avant la fusion. | Même citation ; `tag.yml` et `pages.yml` ne se déclenchent que sur `main` ou à la main, par un compte qui a le droit d'écrire (LIC-07). |
| Exécuter son code sur les machines de GitHub | Oui : une pull request peut modifier les workflows, les scripts et les dépendances, et la CI les exécute tels quels. | `GITHUB_SHA` d'un événement `pull_request` : « Last merge commit on the `GITHUB_REF` branch ». Frein : « By default, all first-time contributors require approval to run workflows. » Je ne sais pas quel réglage a le dépôt. Coût possible : la routine lance quatre jobs de 60 minutes au plus par envoi (`routine.yml`, l. 28-32), le précédent étant annulé (l. 20-22) ; `validate.yml` et `description.yml` n'ont pas de durée limite propre. |
| Empoisonner le cache npm lu par `main` | Rien. | « When a cache is created by a workflow run triggered on a pull request, the cache is created for the merge ref (`refs/pull/.../merge`). […] It cannot be restored by the base branch or other pull requests targeting that base branch. » |
| Injecter une commande par le titre, la description ou le nom de branche | Rien. | Aucune expression `${{ … }}` tirée de l'événement n'est écrite dans une commande : les valeurs passent par `env:` (`validate.yml`, l. 33-34 ; `routine.yml`, l. 57-59), et le titre et la description sont lus dans le fichier de l'événement (`description.yml`, l. 29). |
| Faire passer la CI au vert à tort | Oui. | La CI exécute les scripts de contrôle de la pull request elle-même : un `check_public.py`, un `check_scenes.py` ou un `changelog.py` modifié, ou une ligne ajoutée à la liste des tolérances (LIC-06, preuve 1), et les contrôles ne contrôlent plus rien. |
| Après la fusion | Tout ce qu'a le dépôt. | Le code fusionné est publié sur le site (`pages.yml`) et `scripts/changelog.py` tourne avec le droit `contents: write` (`tag.yml`, l. 9-10 et 34). La seule barrière est la relecture avant la fusion. |

Ce que cela demande, à la mesure d'un projet à un auteur :
1. une phrase dans `docs/publication.md` : pour une pull request d'un tiers, la CI verte ne prouve rien sur `scripts/`, `.github/`, `requirements.txt`, `app/package.json`, `app/package-lock.json` et `scripts/check_public_historique.txt` ; ces fichiers se relisent avant d'approuver l'exécution des workflows, et avant de fusionner ;
2. un réglage à faire par Julien (les outils de la session ne le lisent pas et ne le changent pas) : dans le dépôt, Settings, Actions, General, « Approval for running fork pull request workflows from contributors », choisir « Require approval for all external contributors ». Le réglage par défaut dispense d'approbation un compte dont une seule modification a déjà été fusionnée (« a user that has had any commit or pull request merged into the repository will not require approval ») ;
3. les corrections de LIC-06 (liste des tolérances figée) et de LIC-07.

Le rapport `choix-et-outils.md` a déjà constaté que rien, dans GitHub, n'empêche de pousser sur `main` ni de fusionner avec une CI rouge (CHX-03), et que rien ne dit à un tiers comment contribuer (CHX-09) : ces deux points ne sont pas repris ici.

## Renderpeople : ce que dit la licence, et ce qui reste inconnu

- Ce qui est établi, relu le 14 novembre 2026. Les quatre modèles de personnes sont publiés sur Sketchfab par le compte `renderpeople` (nom affiché « Renderpeople » ; la page du compte renvoie au site de la société). L'API de Sketchfab donne pour chacun : licence « CC Attribution », adresse `http://creativecommons.org/licenses/by/4.0/`, « Author must be credited. Commercial use is allowed. », téléchargeable, sans prix. Le `license.txt` de chaque archive dit la même chose. Les descriptions annoncent des textures « 8k » ; celles du dépôt font 2048 × 2048 px (mesuré dans les fichiers), ce que dit le champ `changes`.
- Ce que la licence demande, et ce qui est fait. CC BY 4.0, section 3(a)(1) : nommer l'auteur, garder le lien vers l'œuvre, dire si elle a été modifiée, citer la licence avec son adresse. Le bouton « Crédits » affiche le titre avec son lien, l'auteur, la licence avec son lien et les modifications (`app/src/credits.ts`, l. 61-65) ; la page `licences/` renvoie au manifeste. C'est conforme.
- Ce que la licence ne couvre pas. Section 2(b)(1) : « Moral rights, such as the right of integrity, are not licensed under this Public License, nor are publicity, privacy, and/or other similar personality rights; however, to the extent possible, the Licensor waives and/or agrees not to assert any such rights held by the Licensor to the limited extent necessary to allow You to exercise the Licensed Rights, but not otherwise. » La renonciation ne porte que sur les droits que détient le concédant, pas sur ceux des personnes scannées. La question de `docs/questions-ouvertes.md`, l. 13, est donc bien posée, et sa citation est exacte.
- Ce que disent les conditions de Renderpeople : je ne sais pas. Le site de la société n'est pas joignable depuis la session (deux essais). Une recherche sur le Web, le 14 novembre 2026, renvoie à la page des conditions générales du site ; son résumé dit que les modèles gratuits y suivent les mêmes dispositions que les modèles payants, et que certains usages demandent un accord séparé ou un consentement écrit. C'est un extrait de recherche, page non ouverte : il ne prouve rien, il dit seulement que la page vaut d'être lue. Je ne sais pas non plus si ces conditions s'appliquent à des fichiers pris sur Sketchfab sous CC BY 4.0.
- Ce que le dépôt en dit : `docs/etat-des-travaux.md` parle d'un « accord déjà obtenu », `docs/questions-ouvertes.md` dit « Je ne sais pas » (rapport `documentation.md`, DOC-05). Rien dans le dépôt ne dit ce qu'est cet accord.
- Ce qui reste à faire, par Julien : lire la page des conditions générales de Renderpeople, ou leur écrire, et faire consigner la réponse (date, texte exact, portée) dans `docs/questions-ouvertes.md`. D'ici là, le risque est borné : les quatre modèles sont quatre dossiers de la scène, remplaçables sans toucher au reste.

## Vérifié

Licences du projet
- `LICENSE` : le texte est celui de la licence MIT de SPDX (commit `3184648`), aux espaces près, hors la ligne de copyright.
- `LICENSES/CC-BY-SA-4.0.txt` : identique, octet pour octet, au texte de SPDX du même commit.
- Le commit `3184648` de `spdx/license-list-data` est bien du 29 octobre 2026, comme l'écrit `docs/licences.md`.
- Clauses citées par `docs/licences.md`, `docs/questions-ouvertes.md` et `app/scripts/copy-licences.mjs` : CC BY-SA 4.0, 3(b)(1) ; CC0 1.0, section 2 ; CC BY 4.0, 3(a)(1)(B) et 2(b)(1) ; Apache-2.0, 4(a) et 4(d). Toutes sont à l'endroit dit et disent ce qui est rapporté.

Scène de parc
- Poly Haven : « Our assets are all licensed as CC0 » (page « License ») ; les auteurs donnés par l'API (Greg Zaal, Kirill Sannikov, GurJas Studios) sont ceux du manifeste.
- Les 15 fichiers de Poly Haven sont identiques, octet pour octet, à ceux de leur adresse `origin`, retéléchargés le 14 novembre 2026.
- Sketchfab : pour les cinq modèles, titre, auteur, adresse et licence (CC BY 4.0) du manifeste sont ceux de l'API ; les nombres de faces, de textures, de matériaux et d'animations des fichiers glTF du dépôt sont ceux de l'API.
- Les quatre textures de Renderpeople font 2048 × 2048 px, comme le dit le champ `changes` ; le fond fait 8192 × 4096 px.
- `python3 scripts/check_scenes.py` : « 8 éléments, 36 fichiers, 34.4 Mio (limite 100) », « 0 erreur(s) ».
- Le bouton « Crédits » affiche, pour chaque élément, le titre avec son lien, l'auteur, la licence avec son lien et les modifications (`app/src/credits.ts`, l. 61-65).

Site construit (construction du 12 novembre 2026)
- Les quatre textes de `licences/` sont identiques à leurs sources (`LICENSE`, `LICENSES/CC-BY-SA-4.0.txt`, `license.md` et `NOTICE.md` de `@babylonjs/core`).
- `@babylonjs/core` et `@babylonjs/loaders` ont le même texte de licence ; `@babylonjs/loaders` n'a pas de `NOTICE.md` ; `babylonjs-gltf2interface` ne contient qu'un fichier de déclarations de types.
- Aucune police, aucune image hors de la scène : les pages utilisent les polices du système et trois dessins SVG écrits dans les pages. Aucune des 44 pages construites ne charge un script, une feuille de style ou une image d'un autre site.
- 43 pages sur 44 ont un lien vers `licences/` ; seule la page de l'activité LUM-02 n'en a pas.

CI
- Les cinq actions : l'empreinte épinglée est celle de l'étiquette annoncée (`git ls-remote`, le 14 novembre 2026), la version du `package.json` lu à ce commit est celle de l'étiquette (checkout 7.0.1, setup-python 7.1.0, setup-node 7.1.0), la licence lue à ce commit est MIT, et ces étiquettes sont les plus récentes de chaque dépôt.
- `actions/upload-pages-artifact` 5.0.0 est une action composée ; l'action qu'elle appelle est elle aussi épinglée par commit.
- gitleaks 8.30.1 : l'empreinte SHA-256 de l'archive `linux_x64` téléchargée le 14 novembre 2026 est celle de `validate.yml`, l. 63, et celle du fichier d'empreintes de la release ; licence MIT ; c'est la dernière étiquette du dépôt.
- Permissions : `contents: read` en tête de quatre workflows ; `contents: write` pour `tag.yml` seul ; `pages: write` et `id-token: write` pour le seul job de déploiement, ce que demande le README de `actions/deploy-pages` au commit épinglé.
- Aucun déclencheur `pull_request_target`, `issue_comment` ou `workflow_run` ; aucune donnée de l'événement insérée dans une commande.
- Faits de GitHub cités par `docs/licences.md` et `docs/publication.md`, relus dans `github/docs` au commit `d59b263` : 25 Mio par le navigateur, avertissement à 50 Mio, blocage à 100 Mio ; GitHub Pages pour les dépôts publics avec l'offre gratuite ; recherche de secrets automatique et gratuite pour un dépôt public ; protection des pushes active par défaut pour les dépôts publics ; « Anyone with read access to a repository can view a comment's edit history. »

Scripts
- `CHANGELOG.md` : 64 sections sans erreur ; 60 tags, de `v0.2.3` à `v0.3.57`, annotés, chacun sur le commit qui a introduit sa section, avec le texte actuel de la section.
- `python3 scripts/check_public.py --commits all` sur le dépôt : « 177 fichier(s) texte, 324 commit(s) contrôlé(s) : 0 problème(s) ».
- `--pull-request` arrête un lien de session dans le titre comme dans la description, et accepte une description absente.

Historique et confidentialité
- Les 28 commits listés dans `scripts/check_public_historique.txt` sont exactement les 28 commits de l'historique dont le message contient un lien de session Claude (`git log --all --grep`, comparaison des deux listes : identiques) ; ils portent tous le même identifiant de session, et sont tous des ancêtres du commit de la version 0.3.9.
- Aucune adresse d'auteur ou de committer hors « noreply » dans les 324 commits de toutes les références ; quatre couples de noms seulement.
- Lignes ajoutées par chaque commit, passées aux motifs du script et à neuf motifs de plus : un seul cas de ce que la règle interdit, le lien de `REPRISE.md` au commit `e89680d`, déjà consigné. Les autres correspondances sont des identifiants publics (modèles de Sketchfab, nom de la branche de travail) ou des adresses tronquées citées par la documentation.
- Fichiers ajoutés un jour puis retirés : trois (`app/index.html`, `docs/audit/fiches.md`, `docs/v2-3d.md`), sur les 203 chemins ajoutés depuis le début de l'historique. Aucun fichier privé n'a été ajouté puis retiré.
- Lignes de fin des messages de commit : seulement « Co-Authored-By » avec une adresse « noreply », et les 28 lignes « Claude-Session » connues.
- Fichiers suivis : aucun chemin de dossier temporaire, aucun identifiant de session ; les seuls identifiants de la forme UUID sont dans deux adresses du manuel en ligne de Nikon.
- `docs/publication.md`, l. 34 : la liste des pull requests compte bien 21 numéros (13 de #15 à #27, plus 8).
- Les 64 pull requests viennent du même compte et de la même branche.

## Je ne sais pas

- Ce que gitleaks 8.30.1 arrête parmi les secrets que `check_public.py` laisse passer (LIC-02) : il n'a pas été lancé (voir « Ce qui n'a pas été couvert »).
- Ce que disent les conditions générales de Renderpeople, et si elles s'appliquent à des fichiers pris sur Sketchfab : hôte non joignable.
- Ce qu'est l'« accord déjà obtenu » de `docs/etat-des-travaux.md` : la conversation n'est pas dans le dépôt (rapport `documentation.md`, DOC-05).
- Si les 21 fichiers venus de Sketchfab sont ceux de l'archive d'origine, aux quatre textures réduites près : le téléchargement demande un compte. Leur structure, elle, correspond à l'API.
- Les réglages du dépôt : protection de `main`, approbation des workflows des tiers, branches admises par l'environnement `github-pages`.
- Si les descriptions des pull requests #1 à #14 contiennent bien le lien de session (`docs/publication.md`, l. 27), et ce que gardent les historiques d'édition : non lus.
- Si un commentaire de pull request, une relecture ou un journal d'Actions contient une information privée : non lus. La règle de `CLAUDE.md` nomme les commentaires, et aucun contrôle ne les lit.
- La date du commit `8cd1075` de `github/docs`, cité par `docs/licences.md` et `docs/publication.md` : une empreinte abrégée ne se récupère pas par `git fetch`. Les faits ont été relus dans un commit plus récent.
- « même alors, le site publié reste public » (`docs/publication.md`, l. 3) : phrase non retrouvée dans la page lue, dont le texte passe par des fragments réutilisés que je n'ai pas tous ouverts.
- Si les fragments de Vite et de Rolldown du site construit sont une « substantial portion » au sens de la licence MIT (LIC-08, point 4).
- Si GitHub attribue encore des adresses « noreply » sans numéro (LIC-06).
- Si l'application charge quelque chose depuis les adresses extérieures écrites dans le code de Babylon.js (`cdn.babylonjs.com`, `unpkg.com` : présentes comme chaînes dans le fichier construit) : pas de navigateur dans cet audit. Les pages elles-mêmes n'en chargent rien.
