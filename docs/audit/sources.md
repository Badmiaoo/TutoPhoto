# Audit du lot « Sources (`data/sources.yaml`) »

État : constats non contre-vérifiés.

- Date : 14 novembre 2026. Rapport écrit par un agent de Claude, à la demande de Julien (12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; 13 novembre : finir l'audit et le pousser).
- Version auditée : copie de travail à la version 0.3.58. Les numéros de ligne de `data/sources.yaml` sont ceux de cette version.
- Reprise : un premier agent, coupé par la limite d'usage le 13 novembre, avait écrit les scripts de relecture (date d'ajout, lecture des adresses, recherche des citations, cohérence de `used_in`) sans commencer le rapport. Ses scripts et ses pages enregistrées sont repris ; tout le texte de ce rapport est du 14 novembre.
- Bilan : 9 constats (1 « faux », 2 « incohérent », 6 « à améliorer »), 38 points vérifiés et justes, 9 « Je ne sais pas ». Sur 151 entrées, 100 sont relues (75 à leur adresse, 25 à une autre adresse du même contenu) et 51 ne le sont pas, faute d'hôte joignable. Les citations et les nombres des libellés relus sont dans les pages ; les défauts sont dans la tenue du fichier : une adresse qui ne mène pas à la page nommée, un champ `used_in` qui ne suit aucune de ses deux définitions, des dates de lecture absentes pour les entrées du 7 novembre, des adresses citées hors du fichier.

## Périmètre

- Les 151 entrées de `data/sources.yaml` ajoutées avant le 12 novembre 2026. Date d'ajout : premier commit où l'identifiant apparaît dans le fichier (`git log --reverse -- data/sources.yaml`, puis lecture du fichier à chaque commit). Répartition : 96 le 7 novembre (dont 78 venues du référentiel 0.2, commit `818c9d8`), 20 le 8, 12 le 9, 16 le 10, 7 le 11. Les 21 entrées ajoutées le 12 novembre (grilles de cadrage, histogrammes) sont hors du lot.
- Pour chaque entrée : la page existe-t-elle, dit-elle ce que le libellé affirme, `used_in` est-il juste, et les notions qui la citent s'appuient-elles sur ce qu'elle dit.
- Les rapports `modele-physique.md`, `fiches-exposition.md`, `fiches-mise-au-point.md` et `choix-et-outils.md` ont relu une partie de ces sources : leurs constats ne sont pas refaits ici, ils sont cités par leur identifiant (PHY, FEX, FMA, CHX).

## Méthode

1. Date d'ajout de chaque entrée par un script (`dates.py`).
2. Lecture de chaque adresse par `curl`, une fois, le 13 novembre 2026 (`fetch.py`) : code de réponse, adresse finale, page enregistrée. Texte extrait par `bs4` ou `pdftotext` (`extract.py`).
3. Recherche automatique, dans le texte de chaque page lue, des 68 citations entre guillemets des libellés (`extract.py`) ; les citations non retrouvées sont relues à la main.
4. Quand l'hôte refuse les lectures automatiques mais que le même contenu existe ailleurs, lecture à cette autre adresse, le 14 novembre 2026 : fichiers bruts des dépôts de GitHub (`raw.githubusercontent.com`), commits des étiquettes par `git fetch --depth=1 --filter=tree:0`, registre npm (`registry.npmjs.org`).
5. Cohérence de `used_in` par un script (`usedin.py`) : fichiers suivis par git où l'adresse ou l'identifiant apparaît. Adresses citées dans le dépôt et absentes du fichier par un autre script (`absentes.py`).
6. Relecture à la main, en priorité, des pages dont dépendent des valeurs du simulateur et des fiches et que les autres rapports n'ont pas relues, puis des pages citées par le référentiel.

Scripts, pages enregistrées et textes extraits : dossier `audit/sources/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `pages-alt/`, `texte/`, `gitmeta/`).

## Sources relues et non relues

Sur les 151 entrées du lot :

| État | Nombre | Détail |
| --- | --- | --- |
| Relue à son adresse (réponse 200) | 75 | `en.wikipedia.org` (11), `onlinemanual.nikonimglib.com` (38), `helpguide.sony.net` (10), `cam.start.canon` (6), `www.photonstophotos.net` (2), `www.nikon.com` (2), `imaging.nikon.com`, `polyhaven.com`, `sketchfab.com`, `www.microsoft.com`, `tiffen.reamaze.com`, `www.provideocoalition.com` |
| Relue à une autre adresse | 25 | 16 pages de `github.com` (l'hôte répond 403 aux lectures de pages) lues dans les fichiers bruts et les commits des dépôts ; 4 pages de `www.npmjs.com` (403) lues dans le registre ; 5 pages de `docs.github.com` (hôte non joignable) lues dans leur source, dépôt `github/docs`, commit `8cd1075`, celui que citent les libellés |
| Non relue : hôte non joignable (refus du proxy) | 45 | tableau « Sources non relues » |
| Non relue : l'hôte répond 403 (contrôle contre les lectures automatiques) | 6 | `www.dpreview.com` (1), `photographylife.com` (2), `www.canon.co.uk` (3) |

Wikipedia est une source secondaire. Dates de lecture : 13 novembre 2026 pour les pages lues à leur adresse, 14 novembre 2026 pour les autres adresses et pour les relectures à la main.

## Ce qui n'est pas couvert

- Les 51 sources non relues (tableau « Sources non relues ») : ni leur existence, ni leur contenu ne sont vérifiés. Parmi elles, 21 ne sont citées que par le référentiel, pour des notions sans fiche. Les 30 autres ont leur adresse dans la documentation, le code ou une fiche : 12 portent des valeurs du simulateur ou des phrases d'une fiche (SRC-09, PHY-15 et tableau « Sources jamais ouvertes »), 7 portent le droit (SRC-08), 11 appuient `docs/architecture.md`, `docs/historique.md` ou `docs/lire-le-referentiel.md`.
- Les 21 entrées ajoutées le 12 novembre 2026 (grilles de cadrage, histogrammes, sRGB) : hors du lot.
- Pour les sources citées par le seul référentiel, la relecture compare la page à la spécification de la notion (trois phrases courtes par notion), pas à un contenu rédigé : il n'y en a pas encore. Une page peut donc convenir à la spécification et manquer à la fiche le jour où elle sera écrite.
- Les pages relues à la main le sont pour ce que le libellé et la notion en disent, pas en entier. Le PDF du guide de l'A7 III (706 000 caractères) n'est contrôlé que par recherche de ses titres et de ses nombres.
- La cohérence entre `data/sources.yaml` et sa copie dans `REPRISE.md` n'est pas contrôlée (voir CHX-06).

## Constats

Neuf constats : 1 « faux », 2 « incohérent », 6 « à améliorer », classés du plus grave au moins grave (les identifiants ne se suivent donc pas). Aucun ne change une valeur du simulateur ni une phrase des fiches : les citations et les nombres des libellés, quand la page est joignable, sont dans la page (section « Vérifié »). Ce que la documentation et les fiches tirent de ces pages est jugé par les rapports PHY, FEX et FMA, pas ici.

### SRC-01 · faux · `nikon-zr-mf-ring` : l'adresse mène au sommaire du menu, pas à la page que nomme le libellé

- Endroit : `data/sources.yaml`, l. 233-236 ; citée par MAP-21 (`data/referentiel/map.yaml`, l. 202).
- Ce qui est écrit : libellé « Nikon ZR, Reference Guide, Manual focus ring in AF mode », adresse `https://onlinemanual.nikonimglib.com/zr/en/09-05.html`.
- Preuve : la page à cette adresse a pour titre « The Custom Settings menu ». C'est le sommaire des réglages personnalisés : « The following Custom Settings are available », puis la liste de a1 à g. Le réglage a13 n'y est que nommé, avec un lien vers `09-05-14.html`. Rien, sur la page citée, ne dit ce que fait le réglage.
- La page qui porte ce que MAP-21 affirme (« Corriger l'AF à la bague après l'accroche, sans changer de mode ») est `https://onlinemanual.nikonimglib.com/zr/en/09-05-14.html`, titre « a13: Manual focus ring in AF mode », lue le 14 novembre 2026 : « Autofocus can be overridden by rotating the lens focus ring (autofocus with manual override). The focus ring can be used for manual focus while the shutter-release/REC button is pressed halfway. » ; en tête : « This item is available with compatible lenses only. »
- L'adresse fausse date du référentiel 0.2 (commit `818c9d8`, 7 novembre 2026) et vient de `REPRISE.md`.
- Correction proposée : remplacer l'adresse par celle de la page a13. Ajouter au libellé « (objectifs compatibles seulement) » : la notion ne le dit pas.

### SRC-03 · incohérent · `used_in` : deux définitions écrites, et le champ ne suit ni l'une ni l'autre

- Endroit : `docs/lire-le-referentiel.md`, l. 21 ; `docs/specifications/grilles.md`, l. 65 ; `scripts/validate.py`, l. 134-142 ; `data/sources.yaml`, tout le fichier.
- Ce qui est écrit :
  - `docs/lire-le-referentiel.md`, l. 21 : le champ `used_in` existe « quand elle n'est citée que dans un document en prose ».
  - `docs/specifications/grilles.md`, l. 65 (12 novembre 2026) : « Champ `used_in` : les fichiers où l'adresse apparaît. »
- Preuve (script `usedin.py`, sur les 151 entrées du lot) :
  - contre la première définition : 31 entrées portent un `used_in` alors qu'une notion, un domaine ou une situation les cite aussi (`nikon-z6-focus`, MAP-04, MAP-05, MAP-06 et MAP-09, avec dix fichiers dans `used_in`) ;
  - contre la seconde : pour 34 entrées, l'adresse apparaît dans un fichier suivi par git que `used_in` ne liste pas (tableau « `used_in` incomplet », plus bas). 26 d'entre elles n'ont pas de champ `used_in` du tout, et leur adresse est écrite dans `docs/architecture.md`, `docs/lire-le-referentiel.md`, `docs/historique.md` ou `docs/dossiers/balance-des-blancs.md` ;
  - 22 entrées sont citées par leur identifiant entre crochets dans le code (`[filament-pbr]` dans `app/src/camera/exposure.ts`, onze identifiants dans `bodies.ts`) : ces fichiers ne peuvent pas figurer dans `used_in`, car `validate.py` exige que l'adresse elle-même soit dans le fichier.
  - `scripts/validate.py` ne contrôle qu'un sens : `elif s["url"] not in path.read_text(encoding="utf-8"): warn(…)`. Un fichier qui cite l'adresse sans être listé ne donne aucun avertissement : `python3 scripts/validate.py` affiche « 0 erreur(s), 0 avertissement(s) » avec ces 34 écarts.
- Conséquence : le champ ne permet pas de répondre à « où cette source sert-elle ? ». Pour le savoir, il faut chercher l'adresse et l'identifiant dans le dépôt, ce qu'un script fait en une seconde.
- Correction proposée, au choix de Julien :
  - (a) retirer `used_in` du fichier et faire calculer par `scripts/validate.py` la liste des fichiers qui citent chaque source (adresse ou identifiant entre crochets) ; l'avertissement « citée nulle part » se calcule de la même façon. Plus rien à tenir à la main ;
  - (b) garder le champ avec la seconde définition, l'écrire dans `docs/lire-le-referentiel.md`, et ajouter à `validate.py` le contrôle dans l'autre sens. Les 34 écarts du tableau sont alors à corriger.
  - Je recommande (a) : le champ est une copie d'une information que le dépôt contient déjà.

### SRC-05 · incohérent · Des adresses citées comme sources ne sont pas dans `data/sources.yaml`

- Endroit : `docs/pile-technique.md`, l. 96 ; `docs/dossiers/balance-des-blancs.md`, `docs/dossiers/viseur-aides.md` et `docs/dossiers/scenes.md` (ajoutés le 11 novembre 2026, commit `66cb9b3`).
- Règle : `CLAUDE.md`, « Toute affirmation factuelle est sourcée (auteur, date, lien) ; les sources vont dans `data/sources.yaml`. »
- Preuve (script `absentes.py` : adresses `https` des fichiers suivis par git, comparées aux adresses du fichier ; 320 adresses distinctes, 193 absentes) :
  - `docs/pile-technique.md`, l. 96 : `https://www.npmjs.com/package/@babylonjs/loaders` et `https://www.npmjs.com/package/babylonjs-gltf2interface` portent une version et une licence (« 9.35.0, licence Apache-2.0 »), comme les trois paquets voisins des l. 89, 90 et 95, qui ont chacun leur entrée (`npm-typescript`, `npm-vite`, `npm-babylonjs-core`). Ces deux-là n'en ont pas.
  - `docs/dossiers/balance-des-blancs.md` : 30 adresses absentes, dont neuf révisions de Wikipedia (l. 168 à 277), dix adresses des manuels Nikon et Canon, et deux pages de Sony ;
  - `docs/dossiers/viseur-aides.md` : 18 adresses absentes (manuels Nikon, Sony et Canon) ;
  - `docs/dossiers/scenes.md` : 43 adresses absentes, presque toutes des fiches d'objets de Poly Haven.
- Ce qui n'est pas un écart : les 65 liens de comparaison de `CHANGELOG.md`, les adresses d'origine et de licence des objets dans `app/public/scenes/parc/scene.json` et les `license.txt` (ce sont les métadonnées que `docs/licences.md` demande), l'espace de noms SVG, les schémas JSON.
- Les dossiers se disent eux-mêmes « dossier de travail », « pas encore relu à la source par un second agent », et `docs/specifications/balance-des-blancs.md`, l. 75, prévoit d'ajouter les sources au moment de l'implémentation. L'écart est donc connu pour la balance des blancs ; il ne l'est écrit nulle part pour `docs/pile-technique.md`.
- Correction proposée : ajouter les deux entrées npm (versions et licences déjà vérifiées par `choix-et-outils.md`). Pour les dossiers, écrire la règle dans `docs/lire-le-referentiel.md` : un dossier de travail cite ses adresses lui-même, et une adresse entre dans `data/sources.yaml` quand une notion, une fiche, le code ou une page de `docs/` hors dossiers s'appuie sur elle. Sans cette phrase, la règle de `CLAUDE.md` est enfreinte 91 fois.

### SRC-04 · à améliorer · 75 entrées sans date de lecture, sous un en-tête qui ne dit pas si la page a été ouverte

- Endroit : `data/sources.yaml`, l. 2-4, et les 78 entrées venues du référentiel 0.2 (l. 6 à 334).
- Ce qui est écrit : « Pages ouvertes ou trouvées par recherche et vérifiées les 7 et 8 novembre 2026 ; auteur et date dans le libellé quand la page les donne. », puis `checked: 2026-11-08`.
- Preuve :
  - « ouvertes ou trouvées par recherche » : la phrase couvre les deux cas sans dire lequel vaut pour quelle entrée. Or `docs/audit/consignes-agents.md` pose qu'« un extrait de résultat de recherche n'est pas une page lue », et les entrées ajoutées à partir du 8 novembre l'écrivent une par une (« lu le 9 novembre 2026 », « extrait de recherche du 8 novembre 2026, page non ouverte »).
  - Sur les 78 entrées du 7 novembre (commit `818c9d8`), 75 n'ont ni date de lecture ni mention de la façon dont la page a été vue (script : recherche de « lu le », « relevé », « page non ouverte » dans le libellé). Les trois autres ont reçu la mention plus tard (`sony-a9-focus-mode`, `dpreview-iso-invariance`, `pl-iso-invariance`).
  - `checked: 2026-11-08` : 35 entrées du lot ont été ajoutées du 9 au 11 novembre, et 21 autres le 12. La date ne décrit plus le fichier ; `schemas/sources.schema.json` l'exige pourtant.
- Ce que cet audit apporte : 36 de ces 75 pages ont été relues (34 à leur adresse le 13 novembre 2026, 2 dans les fichiers de leur dépôt GitHub le 14) et disent ce que leur libellé et leur notion en attendent, sauf `nikon-zr-mf-ring` (SRC-01), `nikon-z8-guide` (SRC-06) et la note de `suncalc` (SRC-02). Les 39 autres ne sont pas joignables d'ici : pour elles, je ne sais pas si la page a été ouverte le 7 novembre.
- Correction proposée : remplacer la phrase d'en-tête et `checked` par un champ par entrée, par exemple `read: 2026-11-13` et `seen: page | extrait | releve-julien`, contrôlé par le schéma ; reporter dans ce champ ce que disent déjà les libellés datés ; pour les 36 pages relues ici, la date de cette relecture ; pour les 39 autres, `seen: inconnu`, à lever quand la fiche de la notion sera écrite.

### SRC-06 · à améliorer · Cinq adresses imprécises ou instables

- Endroit : `data/sources.yaml`, l. 51-55, 142-145, 249-253, 670-679.
- Preuve :

| Source | Ce qui est écrit | Ce que la lecture montre | Correction proposée |
| --- | --- | --- | --- |
| `nikon-z8-guide` (MAP-22) | adresse de l'accueil du guide, `…/z8/en/` ; la note de l'entrée le dit : « pointer la page exacte à la rédaction » | les deux pages existent : `…/z8/en/csma_focus_points_used_207.html`, « a4: Focus Points Used » (« The number of available focus points is reduced to one quarter of the number available when [All points] is selected. ») ; `…/z8/en/csma_focus_point_wrap-around_213.html`, « a10: Focus Point Wrap-Around » (« focus-point selection will “wrap around” from top to bottom, bottom to top, right to left, and left to right ») | deux entrées, une par page, et retirer la note |
| `canon-m50ii-metering` (MES-02) | `https://cam.start.canon/fa/C007/…` | la page servie est en anglais (`<html lang="en">`) ; la même page répond 200 sous `/en/C007/…`, forme des cinq autres adresses `cam.start.canon` du lot | remplacer `/fa/` par `/en/` |
| `wikipedia-zone-system` (MES-13) | `https://en.wikipedia.org/wiki/Zone_System`, sans révision | les dix autres articles de Wikipedia du lot citent une révision (`oldid`) ; celui-ci renvoie à la page du jour (révision 1382492262 le 13 novembre 2026) | citer la révision lue |
| `nikon-z6-launch-2018`, `nikon-z6-eisa-2019` | `https://www.nikon.com/news/2018/0823_mirrorless_01.htm`, `…/news/2019/0815_award_01.htm` | les deux adresses répondent par une redirection vers `https://www.nikon.com/company/news/2018/0823_mirrorless_01/` et `…/company/news/2019/0815_award_01/` ; le contenu est le bon | écrire l'adresse d'arrivée |

- Pour MAP-22, la troisième affirmation de la notion (« rappeler une position mémorisée ») est portée par l'autre source, `canon-r5ii-af-area`, section « Registering AF Points (Home Position) » : « You can register the position of a frequently used AF point. »

### SRC-07 · à améliorer · Deux sources viennent d'appareils que Sony ne range pas parmi ses boîtiers à objectif interchangeable, sans que le libellé le dise ; l'une double une source déjà présente

- Endroit : `data/sources.yaml`, l. 189-196 ; MES-02 (`data/referentiel/mes.yaml`, l. 24) et MAP-14 (`data/referentiel/map.yaml`, l. 134).
- Règle : `CLAUDE.md`, le public a « un boîtier reflex ou hybride (pas de smartphone, de compact ni de bridge) ».
- Preuve :
  - `sony-rx0ii-highlight` : l'en-tête de la page porte la catégorie « Digital Still Camera » et le modèle « DSC-RX0M2 », là où les pages des boîtiers ILCE portent « Interchangeable Lens Digital Camera » (`sony-a9-metering`). Son texte sur la mesure « Highlight » est, mot pour mot, celui de `sony-a9-metering`, citée par la même notion : « Highlight : Measures the brightness while emphasizing the highlighted area on the screen. This mode is suitable for shooting the subject while avoiding overexposure. » La source n'apporte rien que la page de l'α9 ne dise déjà.
  - `sony-rx10iv-limiter` : même catégorie « Digital Still Camera », modèle « DSC-RX10M4 », page « Focus Mode ». Le limiteur qu'elle décrit est un interrupteur de cet appareil : « When the focus range limiter switch is set to “∞-3m,” the camera focuses on subjects more than 3 m away in telephoto shooting ». C'est la seule source de MAP-14. Où se règle le limiteur sur un reflex ou un hybride, aucune source du fichier ne le dit.
  - À l'inverse, `nikon-p1100-af-area` écrit dans son libellé « compact, pas un hybride ».
- Correction proposée : retirer `sony-rx0ii-highlight` de MES-02 et du fichier ; écrire dans le libellé de `sony-rx10iv-limiter` que l'appareil n'est pas un boîtier à objectif interchangeable, comme le fait `nikon-p1100-af-area`, et ajouter à MAP-14 un `todo` : sourcer le limiteur sur un objectif de reflex ou d'hybride avant d'écrire la fiche.

### SRC-08 · à améliorer · Le droit français est cité par des commentaires, pas par les textes officiels

- Endroit : `docs/architecture.md`, l. 97-101 ; `data/sources.yaml`, l. 306-334 ; PLA-07 et PLA-09 (`data/referentiel/pla.yaml`, l. 77 et 99).
- Règle : `CLAUDE.md`, « Contenu juridique pays par pays, à partir des textes officiels. »
- Ce qui est écrit : `docs/architecture.md` affirme le contenu de l'article 9 du Code civil, de l'article 372-1 du Code civil et de l'article L122-5, 11° du Code de la propriété intellectuelle, et les source par un article de Village de la Justice (`lingibe-2019`), une brève d'Actu-Juridique (`actu-juridique-2024`) et un article du cabinet CMS (`cms-cadio-2017`). Le cadre européen des drones est sourcé par une FAQ de l'EASA, pas par les règlements (UE) 2019/947 et 2019/945 qu'elle nomme.
- Preuve : aucune adresse d'un texte officiel dans le dépôt (`git grep -i -e legifrance -e eur-lex`, hors `docs/audit/` : aucun résultat). Trois des sept sources du groupe « Droit et réglementation » viennent d'une autorité (`service-public-droit-image`, `circulaire-2024`, `easa-uas-faq`), mais aucune n'est le texte d'un article de loi ou d'un règlement.
- Les deux notions portent déjà le `todo` « Écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé. » La page `docs/architecture.md`, elle, affirme dès maintenant, et en tire une règle du projet (« le projet le demande toujours », « autorisations écrites »).
- Je ne sais pas si ces affirmations sont justes : les sept hôtes du groupe sont hors d'atteinte d'ici, et ceux des textes officiels aussi (`www.legifrance.gouv.fr` et `eur-lex.europa.eu`, refus du proxy le 14 novembre 2026).
- Correction proposée : à la rédaction de PLA-07, citer chaque article par son adresse sur Légifrance, à la version en vigueur, avec la date de lecture ; garder les commentaires comme lectures d'appoint. D'ici là, ajouter à `docs/architecture.md`, sous « Droits », une ligne : « Sources secondaires ; textes officiels non relus. »

### SRC-02 · à améliorer · `suncalc` : la note dit qu'aucune version n'est publiée, le dépôt porte douze étiquettes de version

- Endroit : `data/sources.yaml`, l. 121-125 ; citée par LUM-04, PLA-01, PLA-02, PLA-03 et le domaine PLA.
- Ce qui est écrit : libellé, « la v2.0 a changé unités et conventions, version à figer » ; note, « Aucune version publiée affichée sur le dépôt : figer un commit (audit indépendant). »
- Preuve (lue le 14 novembre 2026) :
  - `git ls-remote --tags https://github.com/mourner/suncalc` : douze étiquettes, de `v1.6.0` à `v2.1.4`. `v1.9.0` date du 7 février 2022, `v2.0.0` du 18 juin 2026, `v2.1.4` du 10 novembre 2026 (commit `e74c269`).
  - `README.md`, branche `master`, l. 256-260 : « See the [Releases page](…) for the full changelog. Note that **v2.0** is a precision-focused rewrite with breaking changes to units and conventions » (adresse du lien abrégée). `package.json` : `"version": "2.1.4"`.
  - Le libellé est juste (licence à deux clauses, « Copyright (c) 2026, Volodymyr Agafonkin » ; changement d'unités à la v2.0). La note ne l'est plus, ou ne l'a jamais été : les étiquettes `v2.0.0` à `v2.1.2` pointent des commits antérieurs au 7 novembre (`v2.0.1`, 11 juillet ; `v2.1.2`, 5 novembre 2026). Je ne sais pas ce que la page du dépôt affichait ce jour-là (`github.com` répond 403 aux lectures de pages).
- Correction proposée : remplacer la note par « Figer une version étiquetée (2.1.4 le 14 novembre 2026) ; lire les notes de la version 2.0 avant d'écrire PLA-01 à PLA-03. »

### SRC-09 · à améliorer · Six pages n'ont été lues que par Julien, et leur seule trace est le libellé

- Endroit : `data/sources.yaml`, l. 62-71 et 540-559 (`dpreview-iso-invariance`, `pl-iso-invariance`, `canon-eos-rp-pixels`, `canon-eos-rp-af`, `sony-ilce-7m3-af`, `sony-ilce-6000-af`).
- Ce qui est écrit : « Texte relevé par Julien le 11 novembre 2026, le site refusant les lectures automatiques », ou « page relevée par Julien ».
- Preuve : les six adresses sont refusées d'ici (403 de l'hôte pour `www.dpreview.com`, `photographylife.com` et `www.canon.co.uk` ; refus du proxy pour `www.sony.co.in` et `www.sony-mea.com`). Le texte relevé n'est pas dans le dépôt : il ne reste que les extraits recopiés dans les libellés. Trois valeurs du simulateur en dépendent (`app/src/camera/bodies.ts`, l. 47-48 et 61-65) : la couverture de l'autofocus de l'A7 III (93 %) et de l'EOS RP (88 % × 100 %), la définition de l'EOS RP (26,2 millions) ; la fiche EXP-06 dépend des deux articles sur l'invariance ISO.
- Ce n'est pas une faute : c'est la seule voie quand le site refuse les lectures automatiques, et le libellé le dit. Mais personne d'autre que Julien ne peut relire ces six sources, et aucun agent ne l'a fait (FEX et FMA le notent aussi).
- Correction proposée : garder dans le dépôt, pour chaque page relevée, la phrase exacte et son contexte immédiat (le paragraphe), dans un fichier de `docs/dossiers/`, avec la date et « relevé par Julien » ; ou citer en plus une copie archivée de la page quand il en existe une. Les libellés portent déjà les phrases ; il manque le contexte, qui permet de voir ce que la phrase ne dit pas (la note de Canon « Coverage vary depending on the lens used » en est un exemple, bien recopié).

## Vérifié

Dépôts, licences et outils (lus le 14 novembre 2026).

- `threejs-r187`, `babylonjs-9-35-0`, `playcanvas-2-23-3`, `three-gpu-pathtracer-0-0-28`, `mdn-bcd-8-1-8`, `gitleaks-8-30-1` : chaque étiquette pointe le commit du libellé, à la date du libellé (`7e89746`, 30 octobre 2026 ; `00bc37c`, 6 novembre 2026 ; `b7655d8`, 15 octobre 2026 ; `80d1888`, 2 novembre 2026 ; `29768a4`, 2 novembre 2026 ; `83d9cd6`, 12 mars 2026). Licences des libellés : ce sont celles des fichiers de licence à l'étiquette (MIT pour three.js, PlayCanvas, three-gpu-pathtracer et gitleaks, « Copyright (c) 2019 Zachary Rice » ; Apache-2.0 pour Babylon.js, fichier `license.md`).
- `three-mesh-bvh-0-9-18` : l'étiquette `v0.9.18` existe (commit `1d92383`, 3 novembre 2026), licence MIT, « Copyright (c) 2018 Garrett Johnson ».
- `spdx-mit`, `spdx-cc-by-sa-4`, `spdx-cc0`, `spdx-cc-by-4`, `spdx-apache-2` : les cinq textes existent au commit `3184648` du dépôt `spdx/license-list-data`, daté du 29 octobre 2026. Les clauses que citent `docs/licences.md` (l. 18 à 20 et 31) et `docs/questions-ouvertes.md` (l. 13) y sont, aux sections annoncées : notice à inclure (MIT) ; section 3(b)(1) de CC BY-SA 4.0, « a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License » ; section 2 de CC0 1.0, « Waiver » ; section 3(a)(1)(B) de CC BY 4.0, « indicate if You modified the Licensed Material » ; section 2(b)(1), « nor are publicity, privacy, and/or other similar personality rights ».
- `github-pages-limits`, `github-secret-scanning`, `github-push-protection-users`, `github-large-files`, `github-comment-history` : le commit `8cd1075` du dépôt `github/docs` est du 6 novembre 2026 (15 h 25, heure du Pacifique). Les cinq pages existent à ce commit, aux chemins des adresses citées.
- `github-large-files` : « 50 MiB » (avertissement de Git), « 100 MiB » (blocage), « 25 MiB » (envoi par le navigateur) : valeurs du fichier `data/variables/large_files.yml` au même commit, que la page insère. Le libellé et `docs/licences.md`, l. 32, sont justes.
- `github-secret-scanning` et `github-push-protection-users` (`docs/publication.md`, l. 19) : « Public repositories: […] runs automatically for free » et « Push protection for users is on by default for public repositories » sont dans les textes que ces deux pages insèrent (`data/reusables/gated-features/secret-scanning.md`, `data/reusables/gated-features/push-protection-for-users.md`).
- `github-comment-history` : « Anyone with read access to a repository can view a comment's edit history. » est dans la page, identique au commit `8cd1075` et sur la branche `main` du 14 novembre 2026.
- `npm-babylonjs-core`, `npm-vite`, `npm-typescript` : versions 9.35.0, 8.3.6 et 7.0.2 publiées (6 novembre, 5 novembre et 8 juillet 2026), licences Apache-2.0, MIT et Apache-2.0. Vérifié aussi par `choix-et-outils.md`.
- `xatlas-web-npm` : licence MIT, « modified » le 24 mai 2022 dans le registre ; une seule version, 0.1.0, publiée le 18 juin 2020.
- `depth-anything-v2` : « Depth-Anything-V2-Small model is under the Apache-2.0 license. Depth-Anything-V2-Base/Large/Giant models are under the CC-BY-NC-4.0 license. » (`README.md`, branche `main`). Le libellé et la note sont justes ; `docs/architecture.md`, l. 80, ne retient que le modèle Small.
- `filament-pbr` : le fichier existe au commit `e8669b6` ; auteurs Romain Guy et Mathias Agopian ; section « Physically based camera » à la l. 2712. Contenu relu par `modele-physique.md`.
- `bgfx-bokeh-example` : `bokeh_dof.sh` et `fs_bokeh_dof_combine.sc` existent sur la branche `master`, « Copyright 2021 elven cache » ; licence de bgfx à deux clauses. Contenu relu par `modele-physique.md`.

Le fichier lui-même.

- `python3 scripts/validate.py` : 172 sources, 0 erreur, 0 avertissement. Les identifiants sont uniques ; une seule adresse sert à deux entrées (`canon-eos-rp-pixels` et `canon-eos-rp-af`).
- Dates d'ajout : 151 entrées avant le 12 novembre 2026 (96, 20, 12, 16 et 7 du 7 au 11 novembre), 21 le 12.
- Aucune entrée n'est citée nulle part (tableau « Sources citées nulle part »).
- Les 113 liens des fiches (`content/`) mènent tous à une adresse du fichier ; les identifiants cités entre crochets dans `app/src/` existent tous.

Pages lues à leur adresse (13 novembre 2026).

- Les 75 adresses répondent 200. Le titre de chaque page est celui que nomme le libellé, sauf `nikon-zr-mf-ring` (SRC-01) et `nikon-z8-guide` (SRC-06). Trois libellés nomment une section et non la page, et la section y est : `nikon-z8-time` (page « Exposure », section « Long Time-Exposures (Mode M Only) »), `sony-rx10iv-limiter` (page « Focus Mode », section « Focus range limiter »), `sony-a7iii-infinity` (page « Focus Mode », conseil sur la mise au point à l'infini).
- Citations : 68 citations entre guillemets dans 28 libellés. 64 sont retrouvées par le script mot pour mot. Les 4 autres y sont aussi, relues à la main : pour deux, l'écart ne tient qu'à une espace née de l'extraction du texte (`nikon-z6-eisa-2019`, `nikon-z6-exposure-compensation`) ; pour deux, le libellé omet sans le signaler un renvoi interne (`nikon-z6-focus` : « using the sub-selector ( 0 The Sub-Selector ) or multi-selector ») ou un appel de note (`nikon-z6-product` : « 273-point *1 hybrid AF system »). Le sens n'en est pas changé.
- Wikipedia : les dix révisions des libellés sont celles des adresses, et les pages servies portent ce numéro (`wgRevisionId`).
- Nombres des libellés, cherchés par un script puis à la main : `nikon-z6-specifications` (« 35.9 × 23.9 mm », « 24.5 million », « 1/8000 – 30 s in steps of 1/3 or 1/2 EV », « ISO 100 – 51200 ») ; `sony-ilce-7m3-help-guide` (« 35.6 mm × 23.8 mm », « Approx. 24 200 000 pixels », « 1/8 000 second to 30 seconds », « ISO 100 to ISO 51 200 », les onze titres de sections cités, « Copyright 2018 Sony Corporation ») ; `wikipedia-image-sensor-format` (22.30 × 14.90 ; 23.6–23.7 × 15.60) ; `wikipedia-sony-a6000` ; `wikipedia-circle-of-confusion` (« d /1500, or 0.029 mm ») ; `wikipedia-film-speed` (40:1, 10:1, « 70 pixels per cm », « 25 cm ») ; `wikipedia-shutter-speed` (« 1⁄1000 s » à « 1 s », « 2:1 ») ; `nikon-z6-release-mode` (« 1–5 frames per second », 5.5 et 12 fps) ; `nikon-z6-exposure-compensation` (−5 à +5 EV, 1/3 EV) ; `nikon-z6-iso-button` (« ISO 100 (Z 7) or 200 (Z 6) to Hi 2 ») ; `nikon-z6-iso-settings` (« 1/4000 s to 30 s ») ; `nikon-z6-defaults` ; `nikon-d850-auto-iso` (« 1/30 s », « ISO 64 »). Tous y sont.
- Dates et auteurs : `photonstophotos-read-noise` (« Last revised: 2026-08-17 »), `photonstophotos-sensor-characteristics` (« Last revised: 2025-12-15 »), `pvc-adams-soft-light` (Art Adams, « December 27, 2011 »), `nikon-z6-launch-2018` (« August 23, 2018 »), `nikon-z6-eisa-2019` (« August 15, 2019 »), `sony-a9-metering` (« α9 Ver.5 or later »).
- `haeberli-akeley-1990` : auteurs, titre, « SIGGRAPH '90 », pages 309 à 318 et DOI 10.1145/97879.97913 sont dans la fiche (métadonnées et liens de la page).
- `wikipedia-angular-diameter` : « Sun 32′32″ – 31′27″ », soit de 0,524° à 0,542° ; `docs/propositions.md`, l. 25, dit la même chose et annonce une source première avant usage.
- `polyhaven-license` : « Our assets are all licensed as CC0 » ; `sketchfab-download-api` : « Downloading models requires users to be authenticated with a Sketchfab account. »

Pages citées par le seul référentiel, comparées à la spécification de la notion (relues à la main le 14 novembre 2026).

- MAP-04 : `canon-r5-af-operation` (One-Shot AF, « the camera will focus only once » ; Servo AF, « will keep focusing on the subject continuously »), `nikon-zr-focus` (AF-S, AF-C, AF-A), `sony-a7riv-automatic-af` (« [Single-shot AF] and [Continuous AF] are switched according to the movement of the subject »).
- MAP-05 : `canon-r5ii-af-area` (Spot AF, 1-point AF, Expand AF area, Flexible Zone AF, Whole area AF), `nikon-zr-focus` (zones larges, suivi 3D), `sony-a7iv-focus-area` (Wide, Zone, Center Fix, Spot, Tracking).
- MAP-19 et MAP-20 : `canon-r5-af-method` (« use Multi-controller, or tap the screen » ; « press Multi-controller straight in » pour recentrer ; « Orientation linked AF point »).
- MES-02 : `canon-m50ii-metering` (Evaluative, Partial, Spot, Center-weighted average), `nikon-zr-metering` (Matrix, Center-weighted, Spot, Highlight-weighted), `sony-a9-metering` (Multi, Center, Spot, Entire Screen Avg., Highlight).
- MES-12 : `sony-a7iv-spot-point` (« Focus Point Link : The spot metering position coordinates with the focus area. »).
- EXP-03 : `canon-r5-custom` (« Exposure level increments », avec les deux choix « 1/3: 1/3-stop » et « 1/2: 1/2-stop »).
- COU-02 : `canon-r5-wb` (« Auto (Ambience priority) », « Auto (White priority) »).
- MAP-15 : `sony-a7iii-infinity` (« make sure that the focus is on a sufficiently distant subject by checking the monitor or the viewfinder ») ; MAP-17 : `nikon-zr-af-finetune` (valeurs de +20 à −20) ; BOI-03 : `nikon-zfc-d7` (« Choose whether the camera adjusts the preview in the viewfinder or monitor to reflect how shooting settings will affect the hue and brightness of the final picture. »).
- BOI-33 : `nikon-zr-multiple-exposure` (« Record two to ten NEF (RAW) exposures as a single photograph. » ; Add, Average, Lighten, Darken) ; BOI-10 : `nikon-z8-time` (ligne « Time » : « The exposure starts when the shutter-release button is pressed and ends when the button is pressed a second time. » ; plus bas, « an optional remote cord ») ; LUM-10 : `nikon-zr-fv-lock` (« lock flash output […] letting you take multiple photos or recompose shots without changing the flash level »).
- MES-08 : `nikon-z50ii-bracketing` (exposition, flash, balance des blancs, Active D-Lighting) ; BOI-31 : `nikon-zf-flicker` et `nikon-d6-flicker` (« fluorescent or mercury-vapor lamps », « uneven exposure or […] inconsistent exposure or coloration », « the camera will time photographs ») ; BOI-32 : `nikon-zf-prerelease`.
- LUM-17 : `nikon-zf-flash-modes` (« red-eye reduction lamp will light before the flash fires ») ; BOI-30 : `nikon-faq-diopter` (« Rotate the diopter adjustment control to adjust viewfinder focus. ») ; BOI-35 : `nikon-zf-snapbridge` (téléchargement des images, « Remote Photography ») ; BOI-34 : `nikon-zf-image-area` (« To calculate the approximate focal length of the lens in 35 mm format, multiply by 1.5. »).
- EXP-13 : `nikon-d6-raw-bit-depth` (12 ou 14 bits) ; BOI-16 : `nikon-z7-raw-compression` (« reversible algorithm », « non-reversible algorithm ») et `sony-a7iv-raw-type` (Uncompressed, Lossless Comp, Compressed).
- MES-13 : `wikipedia-zone-system` (« formulated by Ansel Adams and Fred Archer »).
- Tableau du vocabulaire des marques (`docs/architecture.md`, l. 52 à 71) et BOI-27 : pour les douze pages joignables, chaque terme écrit dans le tableau est dans la page vers laquelle il pointe (« One-Shot AF », « Servo AF », « AF-S », « AF-C », « AF-A », « AF-area mode », « Focus Area », « Evaluative », « Partial », « Center-weighted average », « Matrix », « Highlight-weighted », « Multi », « Center », « Entire Screen Avg. », « Highlight », « Automatic AF », « Focus Point Link ») ; « AF method » est le mot de la page de l'EOS R5, « AF area » celui de la page de l'EOS R5 Mark II. Les termes de Fujifilm et l'« AI Servo AF » de l'EOS 80D ne sont pas relus : hôtes non joignables.

## Je ne sais pas

- Si les 51 pages non relues existent encore et disent ce que leur libellé affirme : hôtes non joignables d'ici.
- Si les 39 entrées du 7 novembre non relues ont été ouvertes ce jour-là, ou seulement vues dans un résultat de recherche : le fichier ne le dit pas (SRC-04).
- Si le droit français écrit dans `docs/architecture.md`, l. 97 à 99, est exact : ni les commentaires cités ni les textes officiels ne sont joignables (SRC-08).
- `depth-anything-v2`, « NeurIPS 2024 » : le `README.md` du dépôt cite l'article par son numéro arXiv (2406.09414, 2024) et ne nomme pas la conférence. La mention peut venir de la description du dépôt sur `github.com`, que je ne peux pas lire.
- `haeberli-akeley-1990`, « Computer Graphics 24(4) » : le volume et le numéro ne sont pas sur la fiche de Microsoft Research.
- `suncalc` : ce que la page du dépôt affichait le 7 novembre 2026 sous « Releases » (SRC-02).
- `photonstophotos-sensor-characteristics`, « capacité des photosites, gain unitaire » : le texte de la page ne porte pas ces valeurs, que son script trace ; elles sont relues par PHY-13.
- Quatre spécifications vont plus loin que la page lue, et je ne sais pas si une autre source du fichier les porte, faute de pouvoir la lire : MAP-04, « ses hésitations » (le mode automatique est décrit, pas ses défauts ; `canon-80d-manualslib` non joignable) ; MAP-14, « Pourquoi l'AF refuse trop près » (la page du RX10 IV ne parle que du limiteur) ; MAP-15, « Faisceau d'assistance, loupe » (la page lue ne traite que de l'infini) ; MAP-17, « Surtout sur reflex ».
- La nature des appareils dont la page n'est pas joignable (Fujifilm X100T, GFX100, X-T4 ; Canon EOS 80D, 5DS, 7D Mark II) : SRC-07 ne juge que les pages lues.

## Recensements

Sept recensements. Les nombres viennent des scripts du dossier `audit/sources/scripts/` du bloc-notes de la session.

### Sources jamais ouvertes

D'après leur propre libellé. Pour sept entrées, le libellé dit que la page n'a pas été ouverte, ou pas en entier :

| Source | Hôte | Ce que dit le libellé | Ce qui en dépend | État |
| --- | --- | --- | --- | --- |
| `nikon-d5600-sensor` (l. 505) | `dslrbodies.com` | « extrait de recherche du 8 novembre 2026, page non ouverte » : capteur 23,5 × 15,6 mm | `app/src/camera/bodies.ts`, l. 40 ; `docs/camera-physique.md`, l. 26 | PHY-15 ; hôte non joignable |
| `sony-ilce-6000-sensor` (l. 510) | `www.sony-asia.com` | même mention : capteur 23,5 × 15,6 mm | `bodies.ts`, l. 56 ; `docs/camera-physique.md`, l. 28 | PHY-15 ; hôte non joignable |
| `canon-eos-rp-sensor` (l. 515) | `en.canon-cna.com` | même mention : capteur 35,9 × 24 mm | `bodies.ts`, l. 61 ; `docs/camera-physique.md`, l. 29 | PHY-15 ; doublée par `canon-eos-rp-pixels`, relevée par Julien ; hôte non joignable |
| `canon-eos-2000d-sensor` (l. 520) | `www.canon.co.uk` | même mention : capteur 22,3 × 14,9 mm, 24,1 millions de pixels | `bodies.ts`, l. 70-71 ; `docs/camera-physique.md`, l. 30 et 177 | PHY-15 ; 403 de l'hôte |
| `nikon-d5600-pixels` (l. 530) | `www.cliftoncameras.co.uk` | « extrait de recherche du 9 novembre 2026, page non ouverte » : 24,2 millions de pixels | `bodies.ts`, l. 41 ; `docs/camera-physique.md`, l. 173 | PHY-15 ; hôte non joignable |
| `gustafsson-bokeh-single-pass` (l. 690) | `web.archive.org` | « copie archivée ; page non ouverte, algorithme lu dans sa reproduction par l'exemple 45-bokeh de bgfx » | `app/src/camera/viewfinderDof.ts`, l. 8 ; `docs/camera-physique.md`, l. 277 | l'exemple de bgfx est lu (PHY) ; l'article ne l'est pas ; hôte non joignable |
| `haeberli-akeley-1990` (l. 465) | `www.microsoft.com` | « fiche de Microsoft Research ; article complet non lu » | `docs/camera-physique.md`, l. 67 | la citation de la l. 67 est dans le résumé de la fiche ; l'article n'est lu par personne |

À ces sept s'ajoutent les entrées du 7 novembre dont rien ne dit si la page a été ouverte (SRC-04) : 75 au départ, 39 après cet audit.

### Pages lues par Julien seulement (SRC-09)

| Source | Hôte | Réponse d'ici | Ce qui en dépend |
| --- | --- | --- | --- |
| `dpreview-iso-invariance` | `www.dpreview.com` | 403 de l'hôte | fiche EXP-06 ; EXP-08 et domaine EXP |
| `pl-iso-invariance` | `photographylife.com` | 403 de l'hôte | fiche EXP-06 ; EXP-08 et domaine EXP |
| `canon-eos-rp-pixels` | `www.canon.co.uk` | 403 de l'hôte | capteur et définition de l'EOS RP (`bodies.ts`, l. 61-63) |
| `canon-eos-rp-af` | `www.canon.co.uk` | 403 de l'hôte | couverture de l'autofocus de l'EOS RP, 88 % × 100 % (`bodies.ts`, l. 64-65 ; fiche MAP-06) |
| `sony-ilce-7m3-af` | `www.sony.co.in` | refus du proxy | couverture de l'autofocus de l'A7 III, 93 % (`bodies.ts`, l. 47-48 ; fiche MAP-06) |
| `sony-ilce-6000-af` | `www.sony-mea.com` | refus du proxy | `docs/camera-physique.md` : couverture de l'A6000 « sans pourcentage » |

`canon-eos-rp-pixels` et `canon-eos-rp-af` portent la même adresse : deux entrées pour une page, seule adresse en double du fichier.

### Sources secondaires qui tiennent lieu de primaires

« Dit dans le fichier » : le libellé ou la note de l'entrée écrit que la source est secondaire, indirecte ou partielle.

| Source | Ce qu'elle porte dans le dépôt | Dit dans le fichier | Source première, quand une lecture la désigne |
| --- | --- | --- | --- |
| `wikipedia-exposure-value` | indice de lumination des conditions de lumière (`exposure.ts`, `docs/camera-physique.md`) | oui | guides ANSI PH2.7-1973 et PH2.7-1986, nommés par l'article ; non lus |
| `wikipedia-film-speed` | échelle des ISO ; rapports signal sur bruit 40:1 et 10:1 de l'indicateur d'équilibre (`app/src/ui/balance.ts`, fiche EXP-06) | oui | norme ISO 12232, que l'article résume ; non lue (PHY) |
| `wikipedia-f-number`, `wikipedia-shutter-speed` | échelles des ouvertures et des vitesses (`exposure.ts`, fiches EXP-04 et EXP-05) | oui | je ne sais pas ; FEX-18 |
| `wikipedia-circle-of-confusion` | critère d/1500 et formule du flou (`sharpZone.ts`, `balance.ts`, fiches NET-01, NET-06, MVT-01) | oui | je ne sais pas ; FMA-09 |
| `wikipedia-bayer-filter` | deux fois plus de photosites verts (`noise.ts`) | oui | je ne sais pas |
| `wikipedia-image-sensor-format` | dimensions des capteurs APS-C (`docs/camera-physique.md`) | oui | fiches des constructeurs |
| `wikipedia-sony-a6000` | capteur et définition de l'A6000 (`bodies.ts`, l. 57) | oui | guide d'aide Sony de l'ILCE-6000, joignable (PHY-15) |
| `wikipedia-umbra-penumbra` | définition de la pénombre (fiche et activité LUM-02) | oui | je ne sais pas |
| `wikipedia-angular-diameter` | diamètre apparent du Soleil (`docs/propositions.md`, l. 25) | oui ; le document ajoute qu'une source première sera cherchée avant usage | je ne sais pas |
| `wikipedia-zone-system` | MES-13 | oui (note, et `todo` de la notion) | je ne sais pas |
| `nikon-d5600-sensor` | capteur du D5600 ; site d'un tiers (`dslrbodies.com`), page non ouverte | non | Nikon ; PHY-15 |
| `nikon-d5600-pixels` | définition du D5600 ; fiche d'un revendeur, page non ouverte | non | communiqué de Nikon du 10 novembre 2016 (PHY-15) |
| `canon-80d-manualslib` | MAP-04 ; manuel de Canon lu sur ManualsLib, un site tiers | oui (note : « Préférer le PDF officiel de Canon ») | manuel de Canon |
| `canon-psp` | COU-05 ; page du manuel de Print Studio Pro, pas d'un boîtier | oui (note « source indirecte », et `todo` de la notion) | je ne sais pas |
| `petapixel-perspective` | OPT-01, OPT-06 | oui (note) | je ne sais pas |
| `haeberli-akeley-1990` | accumulation de rendus (`docs/camera-physique.md`, l. 67) ; fiche et résumé, pas l'article | oui | l'article (DOI 10.1145/97879.97913) |
| `gustafsson-bokeh-single-pass` | flou du viseur ; lu dans le code de bgfx qui le reproduit | oui | l'article du blog |
| `lingibe-2019`, `actu-juridique-2024`, `cms-cadio-2017` | articles du Code civil et du Code de la propriété intellectuelle (`docs/architecture.md`, l. 97-99 ; PLA-07) | non | les textes officiels (SRC-08) |
| `easa-uas-faq` | cadre européen des drones (`docs/architecture.md`, l. 101 ; PLA-09) | non | règlements (UE) 2019/947 et 2019/945, nommés par le libellé |
| `cc-by-sa-4` | « permet l'usage commercial » (`docs/architecture.md`, l. 99) ; l'adresse est celle du résumé de la licence (`deed`), pas de son texte | non | le texte, déjà dans le fichier : `spdx-cc-by-sa-4` |

### Sources citées nulle part

Aucune. Chacune des 151 entrées est citée par une notion, un domaine ou une situation, ou a son adresse dans au moins un fichier suivi par git (script `usedin.py`). Deux précisions :

- 44 entrées ne sont citées que par le champ `sources` d'une notion, d'un domaine ou d'une situation : leur adresse n'est écrite dans aucun autre fichier. C'est l'état normal d'une notion dont la fiche n'est pas écrite.
- `sheng-2023` n'est citée, dans le référentiel, que par le domaine MAP, pas par une notion ; son adresse est aussi dans `docs/architecture.md` et `docs/historique.md`.

### Adresses citées dans le dépôt et absentes de `data/sources.yaml` (SRC-05)

| Fichier | Adresses absentes | Nature |
| --- | --- | --- |
| `docs/pile-technique.md`, l. 96 | 2 | pages du registre npm de `@babylonjs/loaders` et de `babylonjs-gltf2interface`, avec version et licence |
| `docs/dossiers/balance-des-blancs.md` | 30 | neuf révisions de Wikipedia, manuels Nikon, Canon et Sony, Poly Haven |
| `docs/dossiers/viseur-aides.md` | 18 | manuels Nikon, Sony et Canon |
| `docs/dossiers/scenes.md` | 43 | fiches d'objets et API de Poly Haven, licence CC0 |
| `app/public/scenes/parc/scene.json` et cinq `license.txt` | 30 et 3 par fichier | adresses d'origine et de licence des objets de la scène : métadonnées demandées par `docs/licences.md`, pas des sources d'affirmations |
| `CHANGELOG.md` | 65 | liens de comparaison entre versions, adresse du site |
| `README.md`, `README.en.md`, `CLAUDE.md`, `docs/historique.md` | 1 chacun | adresse du site publié |
| schémas JSON, espace de noms SVG dans `app/src/`, `scripts/`, `.github/workflows/validate.yml`, `docs/publication.md`, `docs/contenus.md` | 19, comptées par fichier | adresses techniques ou d'exemple, sans affirmation |

Sens inverse, vérifié par `choix-et-outils.md` et refait ici : toutes les adresses citées par les fiches (`content/`) sont dans le fichier, et tous les identifiants cités entre crochets dans `app/src/` y sont.


### Sources non relues : hôte non joignable d'ici

51 entrées, 37 hôtes. « Refus du proxy » : la sortie de la session n'autorise pas l'hôte (`CONNECT` refusé, code 403). « 403 de l'hôte » : l'hôte est joint et répond par une page de contrôle contre les lectures automatiques. Pour toutes : source non relue, hôte non joignable ; ni l'existence de la page ni son contenu ne sont vérifiés.

| Hôte | Réponse | Sources (entre parenthèses : notions, domaines et situations qui la citent, puis son champ `used_in`) |
| --- | --- | --- |
| `photographylife.com` | 403 de l'hôte | `pl-iso-invariance` (EXP (domaine), EXP-06, EXP-08 ; `content/fr/notions/EXP-06.md`, `content/en/notions/EXP-06.md`) ; `pl-lens-compression` (NET (domaine), NET-01, OPT-01, OPT-06) |
| `www.canon.co.uk` | 403 de l'hôte | `canon-eos-2000d-sensor` (`docs/camera-physique.md`) ; `canon-eos-rp-pixels` (`docs/camera-physique.md`, `app/src/camera/bodies.ts`) ; `canon-eos-rp-af` (MAP-06 ; `docs/camera-physique.md`, `app/src/camera/bodies.ts`, `content/fr/notions/MAP-06.md`, `content/en/notions/MAP-06.md`) |
| `www.dpreview.com` | 403 de l'hôte | `dpreview-iso-invariance` (EXP (domaine), EXP-06, EXP-08 ; `content/fr/notions/EXP-06.md`, `content/en/notions/EXP-06.md`) |
| `arxiv.org` | refus du proxy | `sheng-2023` (MAP (domaine)) ; `tabellion-2023` (MVT (domaine), MVT-05, MVT-08) |
| `cms.law` | refus du proxy | `cms-cadio-2017` (PLA-07) |
| `cnb.avocat.fr` | refus du proxy | `circulaire-2024` (PLA-07) |
| `creativecommons.org` | refus du proxy | `cc-by-sa-4` (`docs/architecture.md`) |
| `dslrbodies.com` | refus du proxy | `nikon-d5600-sensor` (`docs/camera-physique.md`) |
| `en.canon-cna.com` | refus du proxy | `canon-eos-rp-sensor` (`docs/camera-physique.md`) |
| `fujifilm-dsc.com` | refus du proxy | `fujifilm-gfx100-af` (MAP-04, MAP-05) ; `fujifilm-gfx100-photometry` (MES-02) ; `fujifilm-xt4-photometry` (MES-02) ; `fujifilm-x100t-photometry` (MES-12) |
| `global.canon` | refus du proxy | `canon-hdr-heif` (BOI-16) |
| `graphics.stanford.edu` | refus du proxy | `levoy-teaching` (`docs/lire-le-referentiel.md`) ; `levoy-cs178-interiors` (SIT-32) |
| `hhoppe.com` | refus du proxy | `petschnigg-2004` (`docs/historique.md`) |
| `hugin.sourceforge.io` | refus du proxy | `hugin-nopar` (OPT (domaine), OPT-17) |
| `id.canon` | refus du proxy | `canon-format-card` (BOI-21) |
| `ij.manual.canon` | refus du proxy | `canon-psp` (COU-05) |
| `oceanexplorer.noaa.gov` | refus du proxy | `noaa-red` (COU-09, LUM-18) |
| `openaccess.thecvf.com` | refus du proxy | `jiang-2025` (`docs/architecture.md`) |
| `petapixel.com` | refus du proxy | `petapixel-perspective` (OPT (domaine), OPT-01, OPT-06) |
| `research.google` | refus du proxy | `hasinoff-2016` (RET-10) |
| `sg.canon` | refus du proxy | `canon-dof-preview` (NET-09) |
| `sites.google.com` | refus du proxy | `levoy-assignments` (SIT-38) |
| `vn.canon` | refus du proxy | `canon-5ds-iso` (EXP-06) |
| `web.archive.org` | refus du proxy | `gustafsson-bokeh-single-pass` (`docs/camera-physique.md`) |
| `www.actu-juridique.fr` | refus du proxy | `actu-juridique-2024` (PLA-07) |
| `www.adorama.com` | refus du proxy | `adorama-backscatter` (LUM-18) |
| `www.bhphotovideo.com` | refus du proxy | `bh-sunstars` (OPT-16) |
| `www.cambridgeincolour.com` | refus du proxy | `cic-sensors` (EXP-13) ; `cic-bit-depth` (EXP-13) ; `cic-eye` (EXP-14) ; `cic-compact-dslr` (BOI-28) ; `cic-tripods` (MVT-12) ; `cic-posterization` (RET-14) ; `cic-closeup` (OPT-14) |
| `www.cliftoncameras.co.uk` | refus du proxy | `nikon-d5600-pixels` (`docs/camera-physique.md`) |
| `www.easa.europa.eu` | refus du proxy | `easa-uas-faq` (PLA-09) |
| `www.fujifilm-x.com` | refus du proxy | `fujifilm-teleconverters` (OPT-14) |
| `www.manualslib.com` | refus du proxy | `canon-80d-manualslib` (MAP-04) |
| `www.service-public.gouv.fr` | refus du proxy | `service-public-droit-image` (PLA-07) |
| `www.sony-asia.com` | refus du proxy | `sony-ilce-6000-sensor` (`docs/camera-physique.md`) |
| `www.sony-mea.com` | refus du proxy | `sony-ilce-6000-af` (`docs/camera-physique.md`) |
| `www.sony.co.in` | refus du proxy | `sony-ilce-7m3-af` (MAP-06 ; `docs/camera-physique.md`, `app/src/camera/bodies.ts`, `content/fr/notions/MAP-06.md`, `content/en/notions/MAP-06.md`) |
| `www.village-justice.com` | refus du proxy | `lingibe-2019` (PLA-07) |

### `used_in` incomplet (SRC-03)

Fichiers suivis par git où l'adresse de la source apparaît et que son champ `used_in` ne liste pas (script `usedin.py`, hors `docs/audit/`, `CHANGELOG.md`, `REPRISE.md` et `data/sources.yaml`).

| Source | Champ `used_in` | Fichiers non listés |
| --- | --- | --- |
| `levoy-assignments` | absent | `docs/lire-le-referentiel.md` |
| `sheng-2023` | absent | `docs/architecture.md`, `docs/historique.md` |
| `tabellion-2023` | absent | `docs/architecture.md` |
| `canon-r5-af-operation` | absent | `docs/architecture.md` |
| `canon-r5-af-method` | absent | `docs/architecture.md` |
| `canon-r5ii-af-area` | absent | `docs/architecture.md` |
| `canon-m50ii-metering` | absent | `docs/architecture.md` |
| `canon-80d-manualslib` | absent | `docs/architecture.md` |
| `nikon-zr-focus` | absent | `docs/architecture.md` |
| `nikon-zr-metering` | absent | `docs/architecture.md` |
| `sony-a9-focus-mode` | 4 fichier(s) | `docs/architecture.md` |
| `sony-a9-metering` | absent | `docs/architecture.md` |
| `sony-a7riv-automatic-af` | absent | `docs/architecture.md` |
| `sony-a7iv-focus-area` | absent | `docs/architecture.md` |
| `sony-rx0ii-highlight` | absent | `docs/architecture.md` |
| `fujifilm-gfx100-af` | absent | `docs/architecture.md` |
| `fujifilm-gfx100-photometry` | absent | `docs/architecture.md` |
| `fujifilm-xt4-photometry` | absent | `docs/architecture.md` |
| `canon-r5-wb` | absent | `docs/dossiers/balance-des-blancs.md` |
| `sony-a7iv-spot-point` | absent | `docs/architecture.md` |
| `fujifilm-x100t-photometry` | absent | `docs/architecture.md` |
| `lingibe-2019` | absent | `docs/architecture.md` |
| `service-public-droit-image` | absent | `docs/architecture.md` |
| `actu-juridique-2024` | absent | `docs/architecture.md` |
| `circulaire-2024` | absent | `docs/architecture.md` |
| `cms-cadio-2017` | absent | `docs/architecture.md` |
| `easa-uas-faq` | absent | `docs/architecture.md` |
| `polyhaven-license` | 1 fichier(s) | `docs/dossiers/scenes.md` |
| `wikipedia-exposure-value` | 1 fichier(s) | `docs/dossiers/scenes.md` |
| `nikon-z6-specifications` | 1 fichier(s) | `docs/dossiers/balance-des-blancs.md`, `docs/dossiers/viseur-aides.md` |
| `sony-ilce-7m3-help-guide` | 1 fichier(s) | `docs/dossiers/balance-des-blancs.md` |
| `canon-eos-rp-pixels` | 2 fichier(s) | `content/en/notions/MAP-06.md`, `content/fr/notions/MAP-06.md` |
| `nikon-z6-focus` | 10 fichier(s) | `app/src/camera/faces.ts` |
| `nikon-z6-apply-settings-live-view` | 1 fichier(s) | `docs/dossiers/viseur-aides.md` |

Identifiants cités entre crochets dans le code, dans un fichier qui ne contient pas l'adresse (22 entrées) :

- `app/src/camera/bodies.ts` : `photonstophotos-read-noise`, `photonstophotos-sensor-characteristics`, `nikon-z6-specifications`, `sony-ilce-7m3-help-guide`, `nikon-d5600-sensor`, `sony-ilce-6000-sensor`, `canon-eos-rp-sensor`, `canon-eos-2000d-sensor`, `nikon-d5600-pixels`, `wikipedia-sony-a6000`, `nikon-z6-launch-2018`
- `app/src/camera/bulletin.ts` : `wikipedia-circle-of-confusion`
- `app/src/camera/exposure.ts` : `filament-pbr`, `wikipedia-exposure-value`, `wikipedia-f-number`, `wikipedia-shutter-speed`, `wikipedia-film-speed`
- `app/src/camera/noise.ts` : `wikipedia-bayer-filter`
- `app/src/camera/viewfinderDof.ts` : `gustafsson-bokeh-single-pass`, `bgfx-bokeh-example`
- `app/src/ui/cameraPanel.ts` : `nikon-z6-focus`, `nikon-z6-exposure-compensation`
