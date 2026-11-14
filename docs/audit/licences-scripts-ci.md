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

Lues le 14 novembre 2026 (fichiers sous `pages/`).

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Poly Haven, API, fiches de `autumn_hockey`, `painted_wooden_bench`, `metal_trash_can` | `https://api.polyhaven.com/info/<identifiant>` et `https://api.polyhaven.com/files/<identifiant>` | `ph-info-*.json`, `ph-files-*.json` |
| Poly Haven, page « License » | `https://polyhaven.com/license` | `ph-license.html` |
| Sketchfab, API, fiches des cinq modèles de la scène | `https://api.sketchfab.com/v3/models/<identifiant>` | `sf-api-*.json` |

Non relues :
- Renderpeople (`renderpeople.com`, conditions générales) : source non relue, hôte non joignable.
- Creative Commons (`creativecommons.org`, textes des licences) : source non relue, hôte non joignable.

## Parties du périmètre pas encore traitées

À ce stade de l'écriture : licences des dépendances, polices et images du site, empreintes des fichiers de la scène comparées à l'origine, `scripts/changelog.py`, `scripts/check_scenes.py`, workflows de la CI. Cette liste est mise à jour à chaque envoi.

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

## Vérifié

- Les 28 commits listés dans `scripts/check_public_historique.txt` sont exactement les 28 commits de l'historique dont le message contient un lien de session Claude (`git log --all --grep`, comparaison des deux listes : identiques) ; ils portent tous le même identifiant de session.
- `python3 scripts/check_public.py --commits all` sur le dépôt : « 176 fichier(s) texte, 322 commit(s) contrôlé(s) : 0 problème(s) ».
- Aucune adresse d'auteur ou de committer hors « noreply » dans les 322 commits de toutes les références.

## Je ne sais pas

- Ce que gitleaks 8.30.1 arrête parmi les secrets que `check_public.py` laisse passer (LIC-02) : je ne l'ai pas lancé.
