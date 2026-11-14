# Audit du lot « Licences, scripts de contrôle, CI et confidentialité du dépôt public »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail de la branche de l'audit, version 0.3.58 du changelog.
- État : constats non contre-vérifiés.
- Rapport en cours d'écriture : les parties du périmètre pas encore traitées sont listées à la fin de l'en-tête.

## Périmètre

- Licences : `LICENSE`, `LICENSES/`, `docs/licences.md` ; `app/public/scenes/parc/scene.json`, les fichiers de la scène et `schemas/scene.schema.json` ; licences des dépendances (`app/package.json`, `app/package-lock.json`, paquets installés, `app/scripts/copy-licences.mjs`, `requirements.txt`) ; polices et images du site.
- Scripts de contrôle : `scripts/changelog.py`, `scripts/check_public.py`, `scripts/check_scenes.py`. `scripts/validate.py` et `scripts/coverage.py` sont jugés par `docs/audit/referentiel-structure.md`.
- CI : `.github/workflows/*.yml`.
- Confidentialité : `docs/publication.md`, la règle « rien ne doit filtrer » de `CLAUDE.md`, et tout l'historique git (messages, auteurs, contenus).

## Méthode

1. Lecture complète des fichiers du périmètre.
2. Essai des trois scripts sur un clone du dépôt, fait dans le bloc-notes de la session, hors du dépôt : injection de ce qu'ils doivent arrêter, puis relevé de ce qui passe à tort et de ce qui est refusé à tort. Les valeurs injectées sont fabriquées pour l'essai ; aucune n'est réelle. Elles sont décrites ici, pas recopiées : le script d'envoi de ce rapport refuse tout fichier qui contient une adresse électronique, un lien privé ou un chemin local, même en exemple.
3. Recherche dans tout l'historique (322 commits, toutes références) : adresses et noms des auteurs et des committers, messages, lignes ajoutées par chaque commit (`git log --all -p -m`), métadonnées des fichiers binaires. Aucune valeur privée n'est recopiée dans ce rapport : elle est décrite, avec le commit et le fichier.
4. Relecture des pages d'origine des modèles, textures et photos, quand l'hôte répond ; comparaison des empreintes des fichiers avec les fichiers d'origine.
5. Aucune écriture dans le dépôt en dehors de ce rapport ; aucun navigateur ; aucune construction du site dans le dépôt.

Scripts d'essai, pages enregistrées et clone : dossier `audit/licences-scripts-ci/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `copie/`). Les numéros de ligne sont ceux de la version 0.3.58.

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
| Documentation de GitHub, dépôt `github/docs`, commit `d59b263` du 13 novembre 2026 : `events-that-trigger-workflows.md`, `dependency-caching.md`, `workflow-syntax.md`, `secure-use.md`, et les textes réutilisés `pull_request_forked_repos_link.md`, `forked-secrets.md`, `workflow-run-approve-public-fork.md`, `workflows-from-public-fork-setting.md` | `https://raw.githubusercontent.com/github/docs/d59b2631959db46d71ca5f7748ec04311c6d0870/…` | `ghdocs-*.md` |

Non relues :
- Renderpeople (`renderpeople.com`, conditions générales) : source non relue, hôte non joignable (deux essais : `curl`, puis l'outil de lecture de pages).
- Creative Commons (`creativecommons.org`, textes des licences) : source non relue, hôte non joignable. Les textes ont été lus dans le dépôt SPDX, au commit que cite `docs/licences.md`.
- `docs.github.com` : hôte non joignable. Les pages ont été lues dans leur dépôt source, `github/docs`.
- `api.github.com` et les pages de `github.com` : refus 403 du proxy. Seuls `git ls-remote`, les fichiers bruts et les fichiers des releases répondent.

## Parties du périmètre pas encore traitées

À ce stade de l'écriture : workflows de la CI (permissions, déclencheurs, ce qu'obtient un contributeur extérieur), licences des dépendances, `docs/licences.md` et `docs/publication.md` phrase par phrase, question de Renderpeople. Cette liste est mise à jour à chaque envoi.

## Constats

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
  - un fichier dont le nom contient une adresse électronique : le nom n'est pas lu ;
  - un commit dont le nom d'auteur contient un nom et un numéro de téléphone : seul le champ de l'adresse est lu (`%ae`, `%ce`) ;
  - une étiquette annotée dont le message contient une adresse électronique, et une autre créée avec une adresse personnelle : ni le message ni l'adresse du créateur d'une étiquette ne sont lus.
- État réel du dépôt (vérifié, rien n'a filtré par ces voies) :
  - les 24 fichiers binaires jamais ajoutés au dépôt sont ceux de la scène de parc. Leurs métadonnées, lues segment par segment (script `metadonnees.py`) : aucune donnée de Julien. Les quatre textures réduites pour le dépôt n'ont qu'un en-tête JFIF ; les textures de Poly Haven ont une date et une résolution dans leur bloc Exif ; `autumn_hockey.jpg` porte les commentaires de Blender de son auteur (nom d'un fichier de travail sur un lecteur « X: », date de 2018), sans nom d'utilisateur ;
  - les 322 commits n'ont que quatre couples de noms : « Julien Touzeau » et « Claude » comme auteurs, « Claude », « GitHub » et « Julien Touzeau » comme committers, toujours avec une adresse « noreply » ;
  - les 60 étiquettes de version sont posées par `tag.yml` à partir du changelog, lui-même contrôlé comme fichier.
- Correction proposée : dans `docs/publication.md`, écrire ce que le script ne lit pas (fichiers binaires, noms de fichiers, noms d'auteurs, étiquettes) ; dans le script, lire aussi `%an` et `%cn` et les chemins de `git ls-files` avec `scan_text` (quelques lignes). Pour les images : une règle écrite suffit tant que les seuls fichiers binaires sont ceux des scènes (« toute image ajoutée au dépôt est d'abord vidée de ses métadonnées »), le contrôle des scènes listant déjà chaque fichier.

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

## Vérifié

- Les 28 commits listés dans `scripts/check_public_historique.txt` sont exactement les 28 commits de l'historique dont le message contient un lien de session Claude (`git log --all --grep`, comparaison des deux listes : identiques) ; ils portent tous le même identifiant de session.
- `python3 scripts/check_public.py --commits all` sur le dépôt : « 176 fichier(s) texte, 322 commit(s) contrôlé(s) : 0 problème(s) ».
- Aucune adresse d'auteur ou de committer hors « noreply » dans les 322 commits de toutes les références.

## Je ne sais pas

- Ce que gitleaks 8.30.1 arrête parmi les secrets que `check_public.py` laisse passer (LIC-02) : je ne l'ai pas lancé.
