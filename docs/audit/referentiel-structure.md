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
2. Identifiants : `REPRISE.md` extrait hors du dépôt et comparé à `data/` (`ids_reprise.py`) ; les 41 commits qui touchent `data/` relus un par un par script (`histoire.py`) : identifiants ajoutés ou retirés, titre, niveau, `since`, renvois, notions clés, jalons.
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

- Périmètre : 191 notions et 49 situations face au critère de `docs/cadrage.md` (comptes par domaine et par niveau, propositions).
- Renvois sans retour : trahissent-ils une erreur ?
- `docs/lire-le-referentiel.md` confronté aux schémas, champ par champ.

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

## Vérifié

Points contrôlés et justes.

- Identifiants, de `REPRISE.md` à `data/` : les 191 notions et les 49 situations de `REPRISE.md` (version courante du fichier) sont dans `data/` avec le même identifiant, le même titre, le même niveau, le même `since` et les mêmes renvois ; aucune en plus, aucune en moins (`ids_reprise.py`). Seule différence de structure : `activity: true` ajouté à LUM-02.
- Extraction d'origine : les 16 fichiers extraits de `REPRISE.md` du commit `e89680d` sont identiques, octet pour octet, à `data/` du commit `818c9d8` (« extrait de `REPRISE.md` sans retouche », `CHANGELOG.md`, version 0.2.0).
- Historique git : sur les 41 commits qui touchent `data/`, aucun n'ajoute, ne retire ni ne renomme un identifiant de notion ou de situation ; aucun ne change un titre, un niveau, un `since`, une liste `situations` ou `key_notions`. Changements de structure relevés : retrait des champs `version` et `capture` (version 0.3.0), création du jalon (0.3.1), `activity: true` sur LUM-02 et trois notions ajoutées au jalon (commit `9182e02`), CMP-02 ajoutée au jalon (commit `e78daf5`).
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
