# Audit du lot « Référentiel : structure, contrôles automatiques et périmètre »

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Auteur : un agent de Claude. **État : constats non contre-vérifiés.**
- Version auditée : branche de l'audit, commit `5ab1783` (version 0.3.58 en cours). Les fichiers du lot datent du 7 au 12 novembre 2026.
- Rapport en cours d'écriture : la liste de ce qui reste à couvrir est à la fin de cet en-tête.

## Périmètre

- Données : `data/referentiel/*.yaml` (13 domaines et `retired.yaml`), `data/situations.yaml`, `data/jalons.yaml`, `data/relecture.yaml`.
- Schémas : `schemas/` (les six schémas des données ; `scene.schema.json` relève d'un autre lot).
- Scripts : `scripts/validate.py`, `scripts/coverage.py`, `scripts/referentiel.py`, `scripts/extract_reprise.py`, `requirements.txt`.
- Documentation : `docs/lire-le-referentiel.md` ; lus pour juger : `CHANGELOG.md` (numérotation), `docs/cadrage.md`, `docs/contenus.md`, `docs/etat-des-travaux.md`, `REPRISE.md`, `.github/workflows/validate.yml`, `app/scripts/build-pages.mjs` (ce qu'il contrôle des fiches et de `data/relecture.yaml`).
- Hors du lot : la justesse des textes des notions (`docs/audit/referentiel-contenu.md`), `data/sources.yaml` (`docs/audit/sources.md`), les fiches de `content/`.

## Méthode

1. Lecture complète des scripts, des schémas, de `docs/lire-le-referentiel.md`, de `data/situations.yaml`, `data/jalons.yaml`, `data/relecture.yaml` et `retired.yaml`. Les treize fichiers de domaine sont lus par script (identifiants, titres, niveaux, `since`, renvois, sources), pas ligne à ligne : leurs textes sont jugés par un autre rapport.
2. Identifiants : `REPRISE.md` extrait hors du dépôt et comparé à `data/` (`ids_reprise.py`) ; les 35 commits qui touchent `data/` relus un par un par script (`histoire.py`) : identifiants ajoutés ou retirés, titre, niveau, `since`, renvois, notions clés, jalons.
3. Comptes refaits sans `coverage.py` (`renvois.py`, `since.py`, `jalon.py`, `liste.py`), puis comparés à ce qu'affichent `validate.py` et `coverage.py` et à ce qu'annoncent les documents.
4. Injection de fautes : une copie du dépôt (`git archive` du commit audité) sous le bloc-notes de la session ; pour chaque faute, une copie neuve, la faute, puis `validate.py` et `coverage.py` de la copie (`injection.py`, 50 essais et un témoin). Les contrôles des pages du site sont essayés de la même façon avec `app/scripts/build-pages.mjs` et un dossier `dist` factice (`pages.sh`, 9 essais et un témoin) ; ni Vite ni navigateur.
5. Aucun fichier du dépôt n'est modifié, sauf ce rapport.

Scripts, copies et sorties : dossier `audit/referentiel-structure/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `injection.txt`, `pages.txt`, `histoire.txt`).

## Sources

Lues le 14 novembre 2026.

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| YAML Language Development Team, *YAML Ain't Markup Language (YAML™) version 1.2*, révision 1.2.2 (2021-10-01), source du texte | `https://raw.githubusercontent.com/yaml/yaml-spec/main/spec/1.2.2/spec.md` | `raw.githubusercontent.com_yaml_yaml-spec_main_spec_1.2.2_spec.md` |
| PyYAML 6.0.3, `lib/yaml/constructor.py` | `https://raw.githubusercontent.com/yaml/pyyaml/6.0.3/lib/yaml/constructor.py` ; même code dans le paquet installé | `raw.githubusercontent.com_yaml_pyyaml_6.0.3_lib_yaml_constructor.py` |
| PyPI, métadonnées de PyYAML 6.0.3 et de jsonschema 4.26.0 | `https://pypi.org/pypi/PyYAML/6.0.3/json`, `https://pypi.org/pypi/jsonschema/4.26.0/json` | `pypi.org_pypi_*` |

Non relues : hôte non joignable d'ici.

| Source | Citée par |
| --- | --- |
| Marc Levoy, page du cours, `https://graphics.stanford.edu/~levoy/teaching.html` | `docs/lire-le-referentiel.md`, l. 26 |
| Marc Levoy, liste des exercices, `https://sites.google.com/site/marclevoylectures/assignments` | `docs/lire-le-referentiel.md`, l. 26 |
| Spécification YAML sur `yaml.org` (lue à la place : sa source sur GitHub, ci-dessus) | ce rapport |

## Reste à couvrir (rapport en cours)

- Relecture finale et classement des constats par gravité.

## Constats

### RST-01 · incohérent · Les sept identifiants `SIT-V2-NN` sont dans le catalogue, mais ni `data/relecture.yaml` ni les pages du site ne les acceptent ; deux sont à l'étape 7 de la file de travail

- Endroit : `schemas/relecture.schema.json`, l. 16 ; `app/scripts/build-pages.mjs`, l. 24, 129 et 178 ; `schemas/situations.schema.json`, l. 27 ; `docs/etat-des-travaux.md`, l. 71.
- Ce qui est écrit : quatre schémas acceptent les deux formes d'identifiant de situation, `^SIT-(V2-)?[0-9]{2}$` (`situations.schema.json`, l. 27 ; `domaine.schema.json`, l. 70 ; `jalons.schema.json`, l. 32 ; `retired.schema.json`, l. 16). Le schéma des fiches relues n'accepte que `^([A-Z]{3}|SIT)-[0-9]{2}$`, et `build-pages.mjs` que `[A-Z]{3}-\d{2}` (titre de la fiche, l. 178 ; ligne de `data/relecture.yaml`, l. 129 ; codes cités dans un texte, l. 24). `docs/lire-le-referentiel.md`, l. 5 : « Les identifiants `SIT-V2-NN` sont ceux des anciennes situations V2, gardés tels quels. »
- Preuve (essais sur une copie) :
  - fiche `content/fr|en/situations/SIT-V2-02.md` dont la première ligne est `# SIT-V2-02 · Portrait : choisir sa distance` : `build-pages.mjs` s'arrête, code 1, avec « la première ligne doit être « # SIT-V2-02 · Titre » », c'est-à-dire en demandant la ligne qu'il vient de lire ;
  - ligne `- {fiche: SIT-V2-02, langue: fr, date: 2026-11-12}` dans `data/relecture.yaml` : `validate.py` refuse, « 'SIT-V2-02' does not match '^([A-Z]{3}|SIT)-[0-9]{2}$' » ;
  - phrase « Voir aussi SIT-V2-02. » ajoutée à la fiche de SIT-01 : la page est produite, sans lien et sans contrôle, alors que la même phrase avec un code de forme courante sans fiche (« XYZ-98 ») arrête la construction (« XYZ-98 n'a pas de fiche en fr »).
- Conséquence : l'étape 7 de la file (`docs/etat-des-travaux.md`, l. 71 : « Situations jouables dans le parc | SIT-28, SIT-V2-02, SIT-V2-06 ») échouera à la construction dès la première fiche, avec un message qui n'aide pas ; ces fiches ne pourront pas être marquées relues.
- Correction proposée : garder les identifiants (règle des identifiants stables) et corriger les trois expressions de `build-pages.mjs` en `(?:[A-Z]{3}|SIT-V2)-\d{2}`, et le schéma en `^([A-Z]{3}-[0-9]{2}|SIT-V2-[0-9]{2})$`. Le rapport `referentiel-contenu.md` (REF-16) propose par ailleurs de verser quatre de ces sept situations dans d'autres : si Julien le retient, la correction reste nécessaire pour les trois qui restent.

### RST-02 · incohérent · Une fiche sans notion est publiée : aucun contrôle ne confronte `content/` au référentiel

- Endroit : `scripts/validate.py`, l. 192-200 (seul endroit qui lit `content/`) ; `scripts/coverage.py`, l. 45-69 ; `app/scripts/build-pages.mjs`, l. 168-200.
- Ce qui est fait : `validate.py` ne regarde `content/` que pour vérifier que le fichier d'une fiche listée dans `data/relecture.yaml` existe. `coverage.py` cherche la fiche de chaque notion connue, et ignore les autres fichiers. `build-pages.mjs` ne lit du référentiel que les titres des domaines et la liste des fiches relues ; il contrôle que le nom du fichier et la première ligne portent le même code, pas que ce code existe.
- Preuve (essais sur une copie ; `validate.py` : « 0 erreur(s), 0 avertissement(s) » dans les trois cas) :
  - `content/fr|en/notions/XYZ-99.md` (aucune notion XYZ-99, aucun domaine XYZ) : « Pages : accueil, 46 fiche(s) », `fiches/fr/XYZ-99.html` produite ;
  - `content/fr|en/notions/MAP-13.md` (identifiant retiré) : page produite et listée à l'accueil ; listée dans `data/relecture.yaml`, elle est acceptée comme relue ;
  - une fiche de notion rangée dans `content/fr|en/situations/EXP-01.md` : publiée parmi les situations.
- Ce qui existe déjà : le rapport `choix-et-outils.md` (CHX-05) établit que le titre d'une fiche n'est pas comparé à celui du référentiel ; essai refait ici (titre de `EXP-04` remplacé : page produite). Ce constat-ci porte sur l'existence de l'identifiant.
- Correction proposée : dans `validate.py`, un contrôle `check_content` d'une quinzaine de lignes : tout fichier `content/<langue>/notions/<ID>.md` porte l'identifiant d'une notion du référentiel, tout fichier `content/<langue>/situations/<ID>.md` celui d'une situation ; un identifiant retiré donne un message qui le dit. Le contrôle du titre proposé par CHX-05 va au même endroit.

### RST-03 · à améliorer · « Identifiants stables, jamais renumérotés » : le contrôle ne voit que la réutilisation d'un identifiant déjà inscrit dans `retired.yaml`

- Endroit : `scripts/validate.py`, l. 145-164 (`check_retired`) ; `CLAUDE.md`, « Identifiants stables, jamais renumérotés ; un identifiant retiré va dans `data/referentiel/retired.yaml` ».
- Ce qui est fait : `validate.py` ne connaît que l'état courant des fichiers. Il refuse un identifiant présent à la fois dans le référentiel et dans `retired.yaml`, et un renvoi vers un identifiant retiré. Rien ne compare l'état courant à l'état précédent.
- Preuve (essais sur une copie) :
  - `RET-14` renommée `RET-16` (aucune autre ligne à changer, la notion n'est notion clé de rien) : « 191 notions […] 0 erreur(s), 0 avertissement(s) » ;
  - `RET-15` supprimée sans entrée dans `retired.yaml` : « 190 notions […] 0 erreur(s), 0 avertissement(s) » ;
  - `MAP-13` recréée : refusé, « identifiant retiré réutilisé : MAP-13 ». Ce cas est tenu.
- État réel : aucun identifiant n'a été renuméroté ni supprimé depuis l'extraction (section « Vérifié ») ; le défaut est dans le contrôle, pas dans les données.
- Correction proposée : une option `--base REF` à `validate.py`, sur le modèle de `scripts/changelog.py check --base` que la CI lance déjà (`validate.yml`, l. 34-43) : tout identifiant de notion ou de situation présent dans `REF` est encore dans le référentiel ou dans `retired.yaml`. Une vingtaine de lignes ; sans option, le script se comporte comme aujourd'hui.

### RST-04 · à améliorer · Une clé YAML écrite deux fois est acceptée en silence : la seconde écrase la première

- Endroit : `scripts/referentiel.py`, l. 26-28 (`yaml.safe_load`).
- Source : spécification YAML 1.2.2, section « Mapping » : « The content of a _mapping_ node is an unordered set of _key/value_ node _pairs_, with the restriction that each of the keys is [unique]. » (`https://raw.githubusercontent.com/yaml/yaml-spec/main/spec/1.2.2/spec.md`, lue le 14 novembre 2026). PyYAML 6.0.3 ne l'applique pas : `lib/yaml/constructor.py`, l. 144, `mapping[key] = value`, sans test de présence.
- Preuve (essais sur une copie) :
  - `level: N1` suivi de `level: N3` dans `EXP-01` : « 191 notions (91 N1, 80 N2, 20 N3) […] 0 erreur(s), 0 avertissement(s) » ; la notion est comptée N3 ;
  - un second bloc `notions:` ajouté à la fin de `lec.yaml` avec une seule notion : « 188 notions […] 0 erreur(s), 0 avertissement(s) ». LEC-01 à LEC-04 ont disparu sans message, parce qu'aucune n'est notion clé ni dans un jalon.
- Quand cela arrive : un bloc recopié, une fusion de branches résolue à la main, un champ ajouté sans voir qu'il existe déjà plus bas. Les fichiers actuels n'ont aucune clé en double (le témoin et les comptes de la section « Vérifié » le montrent).
- Correction proposée : dans `referentiel.load_yaml`, un chargeur dérivé de `yaml.SafeLoader` dont `construct_mapping` refuse une clé déjà vue, avec le fichier et la ligne (une dizaine de lignes, sans dépendance nouvelle).

### RST-05 · à améliorer · Le champ `since` et la règle du numéro Y ne sont contrôlés par rien

- Endroit : `CHANGELOG.md`, l. 8 ; `schemas/domaine.schema.json`, l. 78, `situations.schema.json`, l. 52, `retired.schema.json`, l. 18 ; `docs/lire-le-referentiel.md`, l. 15 ; `README.md`, l. 11 ; `data/situations.yaml`, l. 3.
- Ce qui est écrit : `CHANGELOG.md`, l. 8 : « Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`. » Les schémas ne contrôlent que la forme (`^v[0-9]+\.[0-9]+$`). `scripts/changelog.py` ne lit pas `data/`.
- Preuve (essais sur une copie, tous acceptés avec « 0 erreur(s), 0 avertissement(s) ») : une notion nouvelle `EXP-15` avec `since: v0.1` ; la même avec `since: v9.9` ; `since` de `EXP-01` changé de `v0.1` en `v0.3`.
- État réel, juste : 162 notions `v0.1` et 29 `v0.2`, 38 situations `v0.1` et 11 `v0.2` ; les 29 et les 11 sont exactement celles que `REPRISE.md` (section 9) dit ajoutées à la v0.2 (section « Vérifié »).
- Trois imprécisions autour de la règle :
  - `retired.yaml` a aussi un champ `since` obligatoire, qui y vaut la version du retrait (`MAP-13`, `since: v0.2`), alors que `docs/lire-le-referentiel.md`, l. 15, ne définit `since` que comme la « version qui a introduit la notion » ; les champs de `retired.yaml` ne sont décrits nulle part ;
  - d'après la règle, le référentiel est à la version 0.3 depuis la version 0.3.0 (retrait du champ `version` : toutes les notions reclassées en V1) ; `README.md`, l. 11, écrit encore « référentiel v0.2 », et aucune notion ne porte `since: v0.3`, ce qui est juste puisque rien n'a été ajouté ;
  - le champ `activity` n'est pas dans la liste « (niveau, notions clés) » : LUM-02 est passée en activité (`activity: true`, commit `9182e02`, 10 novembre 2026) sans changer Y. La règle ne dit pas si c'est un reclassement.
- Correction proposée : avec l'option `--base` de RST-03, deux contrôles : un identifiant déjà présent dans la base garde son `since` ; un identifiant nouveau porte le Y de la version en tête de `CHANGELOG.md`. Dans `docs/lire-le-referentiel.md` : une ligne pour `retired.yaml` (`since` = version du retrait) et une pour dire si `activity` compte comme un reclassement (Julien tranche). `README.md` : « référentiel v0.3 », ou sans numéro.

### RST-06 · à améliorer · Niveau des situations : un écart à la règle n'est qu'un avertissement, un champ `notes` quelconque le fait taire, et `level` peut dépasser `level_max`

- Endroit : `scripts/validate.py`, l. 104-113 ; `data/situations.yaml`, l. 3 ; `.github/workflows/validate.yml`, l. 27-28.
- Ce qui est écrit : `data/situations.yaml`, l. 3 : « Niveau d'entrée = niveau médian des notions clés (médiane haute). level_max = plus haut niveau des notions clés. […] Règle par défaut v0.2, ajustable à la main avec une raison dans notes. » Le code : `if actual != expected and not s.get("notes"): warn(...)`.
- Preuve (essais sur une copie) :
  - niveau de `NET-01` changé de N1 en N3, situations non recalculées : quatre avertissements, code de sortie 0 ; l'étape de la CI passe au vert, l'avertissement n'est lisible que dans son journal ;
  - `SIT-01` avec `level: N3` et `level_max: N1` : un avertissement, code 0 ;
  - la même avec `notes: ["x"]` : aucun message. N'importe quelle note, même sans rapport avec le niveau, vaut dérogation.
- État réel, juste : les 49 situations suivent la règle (recalcul par script, 0 écart) et aucune n'a de champ `notes` : la dérogation n'a jamais servi.
- Correction proposée : en faire une erreur tant qu'aucune situation n'y déroge ; `level` supérieur à `level_max` toujours refusé ; si une dérogation devient nécessaire, un champ dédié (`level_reason`) plutôt que `notes`.

### RST-07 · à améliorer · Les listes n'ont pas de contrôle de doublon : un renvoi répété fausse les comptes, une notion clé répétée déplace le niveau d'une situation

- Endroit : `schemas/domaine.schema.json`, l. 42-45 et 66-72 ; `schemas/situations.schema.json`, l. 41-50 ; `scripts/validate.py`, l. 175-177 (doublons contrôlés pour les jalons seulement).
- Preuve (essais sur une copie) :
  - `EXP-01` avec `situations: [SIT-07, SIT-07, SIT-18]` : « 0 erreur(s), 0 avertissement(s) », et `coverage.py` affiche « Renvois notion → situation : 382, dont 181 sans retour » au lieu de 381 et 180 ;
  - `SIT-04` avec `key_notions: [LUM-07, MAP-06, COU-03, COU-03, COU-03]` : la médiane passe de N1 à N2, `validate.py` ne donne qu'un avertissement de niveau (code 0), sans dire qu'une notion est répétée ;
  - une source répétée dans `sources` : acceptée.
- Correction proposée : `"uniqueItems": true` sur les six listes d'identifiants des schémas (`situations` et `sources` d'une notion, `sources` d'un domaine, `key_notions` et `sources` d'une situation, `situations` et `notions` d'un jalon). Le contrôle écrit à la main pour les jalons (`validate.py`, l. 175-177) devient inutile.

### RST-08 · incohérent · Jalon `v1-min` : « 13 sur 17 » ne peut pas monter à 17 sans rédiger des situations hors du jalon ; les « réglages de base » de la règle ne sont nulle part dans les données

- Endroit : `data/situations.yaml`, l. 4 ; `docs/lire-le-referentiel.md`, l. 23 ; `data/jalons.yaml`, l. 10-13 ; `data/referentiel/exp.yaml` (EXP-04, EXP-05, EXP-06) et `mes.yaml` (MES-04) ; `scripts/coverage.py`, l. 62-67.
- Ce qui est écrit : `data/situations.yaml`, l. 4 : « Notions propres à la situation. Les réglages de base (ouverture, vitesse, ISO, modes, mesure, AF, balance des blancs) servent dans toutes les recettes sans être répétés. »
- Ce qui est fait : aucun champ ne dit quelles notions sont ces réglages de base. La règle ne donne pas d'identifiants ; les notions qui en portent le nom (lecture de l'auditeur) renvoient à une à quatre situations, jamais à `all`, et six de ces dix sont pourtant des notions clés :

  | Notion | `situations` | Notion clé de |
  | --- | --- | --- |
  | EXP-04 Ouverture | SIT-04, SIT-18 | aucune |
  | EXP-05 Vitesse d'obturation | SIT-17 | aucune |
  | EXP-06 ISO | SIT-07, SIT-19 | SIT-07 |
  | BOI-07 Priorité à l'ouverture | SIT-01, SIT-11 | aucune |
  | BOI-08 Priorité à la vitesse | SIT-06, SIT-09 | aucune |
  | BOI-09 Mode manuel | SIT-17, SIT-19, SIT-30 | SIT-17, SIT-30 |
  | MES-02 Modes de mesure | SIT-03, SIT-19 | SIT-03, SIT-19 |
  | MAP-04 AF ponctuel ou continu | SIT-06, SIT-08, SIT-38, SIT-39 | SIT-06, SIT-38, SIT-39 |
  | MAP-05 Modes de zone AF | SIT-05, SIT-06, SIT-08, SIT-38 | SIT-05, SIT-06, SIT-38 |
  | COU-02 Balance des blancs | SIT-18, SIT-23, SIT-42 | SIT-23, SIT-42 |

  Le jalon ajoute EXP-04, EXP-05 et EXP-06 à la main, sous le commentaire « Réglages de base : ouverture, vitesse, ISO ».
- Preuve (`coverage.py` et `jalon.py`) : les quatre notions du jalon comptées non couvertes sont EXP-04, EXP-05, EXP-06 et MES-04. Leurs fiches ont les trois sections attendues dans les deux langues ; seule manque la brique « situation réelle », parce qu'aucune de leurs situations (SIT-04, SIT-18 ; SIT-17 ; SIT-07, SIT-19 ; SIT-03, SIT-13) n'est dans le jalon. Le compteur du jalon est donc plafonné à 13 sur 17 tant qu'on ne rédige pas une situation hors de la V1 minimale, alors que les recettes de SIT-01 et de SIT-06 règlent l'ouverture, la vitesse et l'ISO (`content/fr/situations/SIT-01.md`, l. 10-12 ; `SIT-06.md`, l. 10-11).
- Déjà noté, sans correction : `CHANGELOG.md`, version 0.3.39 ; `docs/etat-des-travaux.md`, l. 77 (« ajouter ces renvois au référentiel est à proposer à Julien »).
- Correction proposée, à trancher par Julien : écrire la règle avec des identifiants, et donner `situations: all` aux notions qu'elle nomme, au moins EXP-04, EXP-05 et EXP-06. D'après `docs/contenus.md`, leur fiche doit alors porter une section « Situation réelle » : trois sections à écrire, et le jalon passe à 16 sur 17 sans sortir de son périmètre. MES-04 garde ses situations, qui sont justes (contre-jour, neige), et attend une scène claire. L'autre voie, ajouter SIT-01 ou SIT-06 à leur champ `situations`, coûte moins mais ajoute des renvois de la sorte que décrit RST-09.

### RST-09 · incohérent · « Situation réelle » : `coverage.py` et le site n'ont pas la même définition des situations d'une notion, et un renvoi sans retour suffit à valider la brique

- Endroit : `scripts/coverage.py`, l. 62-67 ; `docs/contenus.md`, « Règle de couverture » ; `app/scripts/build-pages.mjs`, l. 590-596 (`situationsOf`) ; `scripts/validate.py`, l. 84-85.
- Ce qui est fait :
  - `coverage.py` : une notion a sa brique « situation réelle » dès qu'une des situations de son champ `situations` a une fiche dans les deux langues, que cette fiche parle de la notion ou non ;
  - `build-pages.mjs` : la page d'une notion liste les situations dont la section « Notions » cite la notion ; le champ `situations` du référentiel n'est pas lu ;
  - `validate.py` : toute notion doit renvoyer à au moins une situation, ou porter `all` ou `practice_outside`.
- Preuve 1, les deux définitions divergent déjà (pages construites sur une copie) : BOI-07 renvoie à SIT-01, dont la fiche la cite dans la recette et pas dans la section « Notions ». `coverage.py` compte la brique présente ; la page `fiches/fr/BOI-07.html` n'a aucune section « Situations ». Pour les 18 autres fiches de notions, les deux lectures s'accordent.
- Preuve 2, la brique est comptée sans contenu (`fiches_renvois.py`) : `coverage.py` affiche « Situation réelle | 30 | 30 ». Les 30 notions sont celles qui renvoient à SIT-01, SIT-05 ou SIT-06 ; 17 n'ont pas de fiche, et aucune des trois fiches de situations ne les cite : BOI-02, BOI-05, BOI-06, BOI-11, BOI-20, BOI-29, CMP-14, EXP-07, MAP-01, MAP-08, MAP-11, MAP-17, MAP-19, MAP-20, MVT-10, OPT-03, RET-04. Le jour où leur fiche aura ses trois sections, elles seront « couvertes » sans qu'aucune situation rédigée ne les montre.
- Preuve 3, d'où viennent ces renvois (`renvois.py`, `sans_retour.py`) : 180 renvois sur 381 sont sans retour ; 69 notions n'ont que des renvois sans retour. Ils ne sont pas répartis : SIT-10 (« Paysage au coucher du soleil ») en reçoit 24, puis SIT-17 12, SIT-01, SIT-08 et SIT-20 11 chacune ; 15 situations n'en reçoivent aucun. Parmi les 24 de SIT-10 : BOI-11 « Modes personnalisés », BOI-24 « Entretien et capteur », COU-06 « Espaces couleur et écrans », EXP-13 « Le capteur : photosites, matrice de Bayer, profondeur de bits », RET-12 « Exporter ». Quand la fiche de SIT-10 sera rédigée, 29 notions recevront leur brique d'un coup.
- Réponse à la question posée, « les renvois sans retour trahissent-ils une erreur ? » : pas une erreur de saisie. Aucun ne vise un identifiant absent ou retiré, et la règle les autorise (« une notion peut servir dans une situation sans en être une notion clé », `docs/lire-le-referentiel.md`, l. 24). Ils mêlent deux sens : « la notion sert dans cette situation » (BOI-07 dans SIT-01, MAP-09 dans SIT-08) et « il fallait un point d'ancrage », puisque `validate.py` refuse une notion sans situation. Les 180 n'ont pas été jugés un par un : c'est le travail du rapport sur le contenu. Quinze renvois visent une situation dont le niveau maximal est plus bas que celui de la notion (par exemple MAP-17, N3, vers SIT-01, N1/N1) : la règle de niveau ne regarde que les notions clés.
- Correction proposée : une seule définition, celle du site. La brique « situation réelle » d'une notion à liste est comptée quand une situation rédigée dans les deux langues la cite dans sa section « Notions » ; `validate.py` vérifie que les notions citées par cette section renvoient à la situation dans le référentiel (c'est le cas aujourd'hui, section « Vérifié »). Effet immédiat, calculé : la colonne « Situation réelle » passe de 30 à 12 (les 13 couvertes moins BOI-07, à ajouter à la section « Notions » de SIT-01), et la couverture reste à 13 une fois cette ligne ajoutée. Les renvois d'ancrage peuvent alors rester dans les données sans gonfler la couverture.

### RST-10 · incohérent · Le référentiel dit « tout est en V1 » et n'a plus de champ pour dire le contraire, alors que des reports en V2 sont décidés depuis le 10 novembre

- Endroit : `docs/lire-le-referentiel.md`, l. 5 ; `docs/cadrage.md`, l. 27 ; `data/jalons.yaml`, l. 33-34 ; `docs/propositions.md`, l. 63-69 ; `docs/camera-physique.md`, l. 665-667 ; `CHANGELOG.md`, version 0.3.0.
- Ce qui est écrit : `docs/lire-le-referentiel.md`, l. 5 : « 191 notions en 13 domaines et 49 situations, toutes dans le périmètre de la V1. » `docs/cadrage.md`, l. 27 : « Plus de découpage V1/V2 dans le référentiel ». La version 0.3.0 a retiré le champ `version` (V1, V1→V2, V2) des 191 notions et des 49 situations.
- Ce qui est décidé depuis : `docs/cadrage.md`, l. 20 : « LUM-02 (lumière dure ou douce) : simulateur en V2 » ; `docs/camera-physique.md`, l. 665-667 : « Corriger la photo après la prise (V2 ; RET-01, RET-02) », « Décision de Julien : en V2 » ; `docs/propositions.md`, l. 63 : « La V2 regroupe ce que Julien a renvoyé à plus tard. »
- Preuve : ces reports ne sont écrits que dans de la prose et dans deux lignes de `notes` du jalon (`data/jalons.yaml`, l. 33-34). Aucun champ de `data/referentiel/ret.yaml` ne dit que le simulateur de RET-01 et de RET-02 est reporté ; `coverage.py` les compte comme les autres dans le dénominateur 191.
- Correction proposée : ne pas rétablir le champ `version` ; se servir des jalons, qui existent et sont contrôlés. Un jalon par tranche décidée (aujourd'hui `v1-min` ; ensuite ceux que Julien retiendra dans la section « Périmètre » plus bas), et une phrase corrigée dans `docs/lire-le-referentiel.md` et `docs/cadrage.md` : le référentiel est le catalogue, les jalons disent ce qui est visé et quand.

### RST-11 · à améliorer · `docs/lire-le-referentiel.md` ne décrit pas tous les fichiers ni tous les champs que les schémas acceptent

- Endroit : `docs/lire-le-referentiel.md`, l. 3, 13, 17, 19 ; `schemas/`.
- Preuve (lecture champ par champ) :
  - situation (l. 17) : `id`, `title`, `notes` et `since` ne sont pas décrits ; `notes` est pourtant le champ qui porte la dérogation à la règle de niveau (`data/situations.yaml`, l. 3) ;
  - jalon (l. 19) : `notes` manque, alors que le seul jalon s'en sert ;
  - bloc `domain` de chaque fichier (`id`, `title`, `intro`, `sources`, `notes`, `todo`) : non décrit ; six domaines ont des `sources`, trois un `todo` ;
  - `data/referentiel/retired.yaml` (`id`, `merged_into`, `since`, `reason`) et `data/relecture.yaml` (`fiche`, `langue`, `date`) : absents de la page ; le second est décrit dans son en-tête et dans `docs/contenus.md` ;
  - l. 13 : « `activity: true` : la notion ne se simule pas » ; LUM-02 porte ce champ alors que son simulateur est prévu en V2 (`data/jalons.yaml`, l. 33) ;
  - l. 3 : « mis à jour le même jour » (7 novembre) ; le fichier ne dit rien de ce qui a été ajouté depuis (`data/relecture.yaml`, 11 novembre).
- Ce qui est juste : les onze champs d'une notion et les six champs d'une source sont décrits, avec le même sens que dans les schémas ; les deux règles de la fin (l. 23-24) sont celles que `validate.py` applique.
- Correction proposée : cinq lignes à ajouter (situation, jalon, domaine, identifiants retirés, fiches relues), la l. 13 nuancée (« ou dont le simulateur est reporté »), la l. 3 datée de la dernière mise à jour.

## Périmètre : 191 notions et 49 situations

Question posée : est-ce tenable et utile pour un débutant, ou faut-il regrouper, retirer, reporter ? Rien n'est retiré ici ; ce qui suit donne des comptes et des propositions, que Julien tranche. Scripts : `perimetre.py`, `renvois.py`, `liste.py`.

### Le critère

`docs/cadrage.md`, principe du 10 novembre 2026, Julien : « Ça s'adresse à des débutants/néophyte. […] Je ne veux pas transformer les gens en professionnel de la photo, mais en des gens qui maîtrise le fonctionnement du boîtier et des bases de la photographie. »

Le périmètre, lui, date du 7 novembre : « garde tout » (29 notions et 11 situations ajoutées d'un coup, `REPRISE.md`, section 9), puis « Plus de découpage V1/V2 ». D'après `docs/lire-le-referentiel.md`, l. 26, son ampleur est celle d'un cours d'université (source non relue : hôte non joignable). Le référentiel n'a pas été repassé au crible du critère du 10 novembre : aucun commit ne change une notion, un niveau ou une situation depuis l'extraction (section « Vérifié »).

### Les comptes

| Domaine | Notions | N1 | N2 | N3 | Jamais notion clé | dont `all` | Sans source | Ajoutées en v0.2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EXP | 14 | 8 | 5 | 1 | 9 | 0 | 7 | 2 |
| MES | 13 | 7 | 4 | 2 | 5 | 0 | 7 | 2 |
| BOI | 36 | 21 | 15 | 0 | 21 | 2 | 21 | 9 |
| MAP | 21 | 9 | 9 | 3 | 6 | 0 | 10 | 4 |
| NET | 9 | 3 | 4 | 2 | 3 | 1 | 6 | 1 |
| MVT | 12 | 6 | 4 | 2 | 2 | 0 | 8 | 1 |
| OPT | 17 | 5 | 8 | 4 | 7 | 0 | 12 | 2 |
| LUM | 18 | 9 | 7 | 2 | 2 | 1 | 13 | 2 |
| COU | 9 | 4 | 4 | 1 | 4 | 0 | 6 | 1 |
| CMP | 14 | 8 | 5 | 1 | 7 | 3 | 14 | 2 |
| PLA | 9 | 5 | 4 | 0 | 0 | 0 | 4 | 1 |
| RET | 15 | 5 | 9 | 1 | 12 | 1 | 13 | 2 |
| LEC | 4 | 2 | 2 | 0 | 4 | 3 | 4 | 0 |
| Total | 191 | 92 | 80 | 19 | 82 | 11 | 125 | 29 |

- « Jamais notion clé » : 82 notions (39 N1, 33 N2, 10 N3) ne sont la notion clé d'aucune situation. 11 portent `situations: all`, 2 n'ont pas de situation (LEC-03, RET-15), 69 n'ont que des renvois sans retour. Sur les 29 notions ajoutées en v0.2, 26 sont dans ce cas.
- 109 notions sont notion clé d'au moins une situation : 49 d'une seule, 38 de deux, 22 de trois ou plus.
- Situations : 20 d'entrée N1, 27 N2, 2 N3 ; niveau maximal N1 pour 5, N2 pour 33, N3 pour 11. Les 20 situations d'entrée N1 ont 56 notions clés distinctes (39 N1, 15 N2, 2 N3).
- 181 notions demandent un simulateur, 10 une activité (`activity: true`).
- « Sans source » : 125 notions sans champ `sources` (compte refait ici ; c'est le constat REF-07 du rapport sur le contenu).

### Ce qui est mesuré de l'avancement

- Du 7 au 13 novembre 2026, 64 versions au changelog, celle en cours comprise : 13 notions couvertes sur 191 (6,8 %), 3 situations rédigées sur 49, une scène.
- 44 pages de fiches publiées (19 notions et 3 situations, en deux langues), 0 relue (`data/relecture.yaml` : `relues: []`). Le référentiel entier ferait 480 pages à relire en deux langues (191 + 49, fois 2).
- 181 simulateurs sont spécifiés dans le référentiel ; ceux qui existent dans l'application ne sont pas comptés ici (autre lot).
- Je ne sais pas en déduire une durée : le rythme d'écriture d'un agent ne dit rien du temps de relecture par deux personnes, ni du temps de fabrication des scènes (une seule existe).

### Groupes candidats à un report, avec leurs comptes

Aucun de ces groupes n'est une erreur du référentiel : ce sont des notions justes en elles-mêmes, que le critère du 10 novembre place au-delà des « bases ».

| Groupe | Notions | Situations touchées | Pourquoi le critère les désigne |
| --- | --- | --- | --- |
| A. Niveau N3, « avancé » | 19 | 11 situations perdent une partie de leurs notions clés, aucune ne les perd toutes | `docs/lire-le-referentiel.md`, l. 11 : « N3 avancé » ; le critère vise les bases |
| B. Domaine RET, retouche | 15 (5 N1, 9 N2, 1 N3) | 3 (SIT-30, SIT-32, SIT-36) | hors du boîtier ; demande un second outil (« mini-développeur intégré », introduction du domaine) ; RET-01 et RET-02 déjà reportées en V2 ; 12 sur 15 ne sont notion clé de rien |
| C. Périmètres ajoutés le 7 novembre : drone, sous l'eau, restauration | 4 (PLA-09, COU-09, LUM-18, RET-15) | 2 (SIT-41, SIT-42) | pratiques à part ; SIT-41 et la décision « reflex et hybrides uniquement » sont du même jour, et aucun champ de SIT-41 ne dit quel appareil vole |
| A, B et C réunis | 35 (RET-10, LUM-18 et RET-15 sont dans deux groupes) | 13 situations touchées en partie, 36 intactes | reste : 156 notions (86 N1, 70 N2) |
| D. Notions N2 jamais notion clé, hors A, B et C | 25 | aucune | à réexaminer une par une : rien ne les rattache à une situation |

Les 19 notions N3 : CMP-12, COU-06, EXP-12, LUM-15, LUM-18, MAP-17, MAP-18, MAP-22, MES-11, MES-13, MVT-09, MVT-11, NET-02, NET-08, OPT-03, OPT-13, OPT-14, OPT-17, RET-10.

### Propositions

1. Garder les 191 identifiants et les 49 situations comme catalogue : rien à retirer, rien à renuméroter. Retirer une notion coûte une entrée dans `retired.yaml` et ne rapporte rien tant qu'aucune fiche n'existe.
2. Ne plus mesurer l'avancement sur 191. La phrase « toutes dans le périmètre de la V1 » (RST-10) fait de 6,8 % le chiffre de référence d'un projet dont la règle est « pas d'extension au-delà de la V1 minimale avant de l'avoir testée » (`CLAUDE.md`). Le chiffre utile est celui du jalon.
3. Découper la suite en jalons, avec le mécanisme existant (`data/jalons.yaml`, contrôlé par `validate.py`, compté par `coverage.py`). Ordre proposé, à trancher : d'abord les situations d'entrée N1 jouables dans une scène existante ; puis les 20 situations d'entrée N1 et leurs 56 notions clés ; les groupes A, B et C dans un jalon « plus tard », sans date.
4. Regrouper : rien à proposer ici au-delà de ce que le rapport sur le contenu a établi (REF-16 : quatre situations `SIT-V2-NN` doublent une situation du catalogue ; REF-13, sur huit groupes de notions voisines, a été réfuté à la contre-vérification).
5. Avant d'ajouter une notion ou une situation : le critère du 10 novembre, écrit dans `docs/lire-le-referentiel.md` avec une définition de N1, N2 et N3 qui permette de classer (aujourd'hui trois mots).

## Vérifié

Points contrôlés et justes.

- Identifiants, de `REPRISE.md` à `data/` : les 191 notions et les 49 situations de `REPRISE.md` (version courante du fichier) sont dans `data/` avec le même identifiant, le même titre, le même niveau, le même `since` et les mêmes renvois ; aucune en plus, aucune en moins (`ids_reprise.py`). Seule différence de structure : `activity: true` ajouté à LUM-02.
- Extraction d'origine : les 16 fichiers extraits de `REPRISE.md` du commit `e89680d` sont identiques, octet pour octet, à `data/` du commit `818c9d8` (« extrait de `REPRISE.md` sans retouche », `CHANGELOG.md`, version 0.2.0).
- Historique git : sur les 35 commits qui touchent `data/`, aucun n'ajoute, ne retire ni ne renomme un identifiant de notion ou de situation ; aucun ne change un titre, un niveau, un `since`, une liste `situations` ou `key_notions`. Changements de structure relevés : retrait des champs `version` et `capture` (version 0.3.0), création du jalon (0.3.1), `activity: true` sur LUM-02 et trois notions ajoutées au jalon (commit `9182e02`), CMP-02 ajoutée au jalon (commit `e78daf5`).
- Numérotation : dans chaque domaine, les numéros se suivent sans trou, dans l'ordre du fichier ; seul trou, `MAP-13`, inscrit dans `retired.yaml` avec `merged_into: MAP-08`, qui existe. Situations : `SIT-01` à `SIT-42` sans trou, puis `SIT-V2-01` à `SIT-V2-07`.
- `since` : 162 notions `v0.1` et 29 `v0.2` ; les 29 sont exactement la liste de `REPRISE.md`, section 9 (24 de l'audit, BOI-36, PLA-09, COU-09, LUM-18, RET-15) ; dans chaque domaine, toute notion `v0.2` a un numéro plus grand que toute notion `v0.1`. 38 situations `v0.1` (31 et 7 `SIT-V2`), 11 `v0.2` (`SIT-32` à `SIT-42`). 163 notions à la v0.1 moins `MAP-13` font bien 162.
- Chiffres annoncés : `validate.py` affiche « 191 notions (92 N1, 80 N2, 19 N3), 49 situations, 172 sources, 1 identifiant(s) retiré(s), 1 jalon(s) », 0 erreur, 0 avertissement ; `coverage.py`, « 13 notion(s) sur 191 (6,8 %) » et « v1-min · V1 minimale : le parc | 13 sur 17 | 3 sur 3 ». Recomptés sans ces scripts : 191, 49, 13 domaines, 381 renvois notion → situation dont 180 sans retour, 203 notions clés, 82 notions qui ne sont la notion clé d'aucune situation, 17 notions dans le jalon.
- Nombres écrits en toutes lettres dans l'introduction de chaque domaine (« Quatorze notions », « 36 notions »…) : justes pour les 13 domaines.
- Niveaux des situations : les 49 couples `level` et `level_max` sont ceux que donne la règle (médiane haute, maximum), recalculés par un script écrit pour cet audit ; `referentiel.situation_level_rule` applique bien la médiane haute (`ranks[len(ranks) // 2]`).
- Renvois : toute notion clé renvoie à sa situation, ou porte `situations: all` (BOI-25 et OPT-15, notions clés de SIT-36) ; toute situation est citée par au moins une notion ; les deux notions sans situation (LEC-03, RET-15) ont un champ `practice_outside`, comme le dit `docs/lire-le-referentiel.md`.
- Jalon `v1-min` : il contient les 10 notions clés de SIT-01, SIT-05 et SIT-06, plus EXP-04, EXP-05, EXP-06, BOI-07, BOI-08, MES-04 et CMP-02, comme l'écrivent ses commentaires et `docs/cadrage.md`.
- Fiches et référentiel : dans les six fiches de situations (trois par langue), la section « Notions » cite toutes les notions clés de la situation, et aucune notion dont le champ `situations` ne renvoie pas à elle.
- Ordre des domaines de `referentiel.py` (`DOMAIN_ORDER`) : celui de la section 4 de `REPRISE.md`.
- Les fautes demandées par la mission sont refusées par `validate.py`, avec un message qui nomme l'endroit : identifiant en double (notion, situation, jalon, identifiant retiré ; une notion recopiée dans un autre domaine) ; renvoi vers une notion ou une situation absente (notion clé, champ `situations`, jalon, `merged_into`) ; notion clé retirée ; notion clé sans renvoi retour ; niveau inconnu ; champ manquant (`since`, `spec.exercise`, `title.en`, `situations`) ; champ inconnu ; source absente de `data/sources.yaml` (notion, domaine, situation) ; notion sans situation ni `practice_outside` ; situation citée par aucune notion ; notion clé absente du jalon ; doublon dans un jalon ; nom de fichier différent du domaine ; fiche relue inexistante ou listée deux fois. Seule faute de la liste qui passe : la fiche sans notion (RST-02).
- `requirements.txt` : PyYAML 6.0.3 et jsonschema 4.26.0 existent sur PyPI, sous licence MIT d'après leurs métadonnées (lues le 14 novembre 2026) ; ce sont les versions installées ici.

## Je ne sais pas

- Les identifiants entre la v0.1 et la v0.2 : la v0.1 n'est pas dans le dépôt (le premier commit porte déjà la v0.2). Qu'aucun identifiant n'ait été renuméroté avant le 7 novembre 2026 n'est pas vérifiable ici ; les comptes sont cohérents avec le récit de `REPRISE.md` (163 − 1 + 29 = 191).
- « Le squelette reprend l'ampleur du cours de photographie numérique de Marc Levoy à Stanford » (`docs/lire-le-referentiel.md`, l. 26) : source non relue : hôte non joignable (les deux adresses citées).
