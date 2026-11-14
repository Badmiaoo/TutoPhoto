# Audit du lot « Sources (`data/sources.yaml`) »

État : constats non contre-vérifiés.

- Date : 14 novembre 2026. Rapport écrit par un agent de Claude, à la demande de Julien (12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent ; 13 novembre : finir l'audit et le pousser).
- Version auditée : copie de travail à la version 0.3.58. Les numéros de ligne de `data/sources.yaml` sont ceux de cette version.
- Reprise : un premier agent, coupé par la limite d'usage le 13 novembre, avait écrit les scripts de relecture (date d'ajout, lecture des adresses, recherche des citations, cohérence de `used_in`) sans commencer le rapport. Ses scripts et ses pages enregistrées sont repris ; tout le texte de ce rapport est du 14 novembre.
- Rapport en cours d'écriture : les sections se remplissent au fil des envois. Ce qui reste à couvrir est dit dans « Ce qui n'est pas couvert ».

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
| Relue à son adresse (réponse 200) | 75 | `en.wikipedia.org` (10), `onlinemanual.nikonimglib.com` (36), `helpguide.sony.net` (11), `cam.start.canon` (6), `www.photonstophotos.net` (2), `www.nikon.com` (2), `imaging.nikon.com`, `polyhaven.com`, `sketchfab.com`, `www.microsoft.com`, `tiffen.reamaze.com`, `www.provideocoalition.com` |
| Relue à une autre adresse | 25 | 16 pages de `github.com` (l'hôte répond 403 aux lectures de pages) lues dans les fichiers bruts et les commits des dépôts ; 4 pages de `www.npmjs.com` (403) lues dans le registre ; 5 pages de `docs.github.com` (hôte non joignable) lues dans leur source, dépôt `github/docs`, commit `8cd1075`, celui que citent les libellés |
| Non relue : hôte non joignable (refus du proxy) | 45 | tableau « Sources non relues » |
| Non relue : l'hôte répond 403 (contrôle contre les lectures automatiques) | 6 | `www.dpreview.com` (1), `photographylife.com` (2), `www.canon.co.uk` (3) |

Wikipedia est une source secondaire. Dates de lecture : 13 novembre 2026 pour les pages lues à leur adresse, 14 novembre 2026 pour les autres adresses et pour les relectures à la main.

## Ce qui n'est pas couvert

- Les 51 sources non relues (tableau plus bas) : ni leur existence, ni leur contenu ne sont vérifiés.
- Les 21 entrées ajoutées le 12 novembre 2026.
- (à compléter à la fin du rapport)

## Constats

Neuf constats : 1 « faux », 2 « incohérent », 6 « à améliorer ». Aucun ne change une valeur du simulateur ni une phrase des fiches : les valeurs et les citations dont dépendent le simulateur et les fiches, quand leur page est joignable, sont bien dans les pages citées (section « Vérifié », et rapports PHY, FEX et FMA).

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
  - `docs/dossiers/balance-des-blancs.md` : 30 adresses absentes, dont neuf révisions de Wikipedia (l. 168 à 277), dix pages de manuels Nikon et Canon, et deux pages de Sony ;
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
- Ce que cet audit apporte : 34 de ces 75 pages ont été relues à leur adresse le 13 novembre 2026 et disent ce que leur libellé et leur notion en attendent, sauf `nikon-zr-mf-ring` (SRC-01) et `nikon-z8-guide` (SRC-06). Les 41 autres ne sont pas joignables d'ici : pour elles, je ne sais pas si la page a été ouverte le 7 novembre.
- Correction proposée : remplacer la phrase d'en-tête et `checked` par un champ par entrée, par exemple `read: 2026-11-13` et `seen: page | extrait | releve-julien`, contrôlé par le schéma ; reporter dans ce champ ce que disent déjà les libellés datés ; pour les 34 pages relues ici, la date du 13 novembre 2026 ; pour les 41 autres, `seen: inconnu`, à lever quand la fiche de la notion sera écrite.

### SRC-06 · à améliorer · Quatre adresses imprécises ou instables

- Endroit : `data/sources.yaml`, l. 51-55, 142-145, 249-253, 670-679.
- Preuve :

| Source | Ce qui est écrit | Ce que la lecture montre | Correction proposée |
| --- | --- | --- | --- |
| `nikon-z8-guide` (MAP-22) | adresse de l'accueil du guide, `…/z8/en/` ; la note de l'entrée le dit : « pointer la page exacte à la rédaction » | les deux pages existent : `…/z8/en/csma_focus_points_used_207.html`, « a4: Focus Points Used » (« The number of available focus points is reduced to one quarter of the number available when [All points] is selected. ») ; `…/z8/en/csma_focus_point_wrap-around_213.html`, « a10: Focus Point Wrap-Around » (« focus-point selection will “wrap around” from top to bottom, bottom to top, right to left, and left to right ») | deux entrées, une par page, et retirer la note |
| `canon-m50ii-metering` (MES-02) | `https://cam.start.canon/fa/C007/…` | la page servie est en anglais (`<html lang="en">`) ; la même page répond 200 sous `/en/C007/…`, forme des quatre autres adresses Canon du fichier | remplacer `/fa/` par `/en/` |
| `wikipedia-zone-system` (MES-13) | `https://en.wikipedia.org/wiki/Zone_System`, sans révision | les dix autres articles de Wikipedia du lot citent une révision (`oldid`) ; celui-ci renvoie à la page du jour (révision 1382492262 le 13 novembre 2026) | citer la révision lue |
| `nikon-z6-launch-2018`, `nikon-z6-eisa-2019` | `https://www.nikon.com/news/2018/0823_mirrorless_01.htm`, `…/news/2019/0815_award_01.htm` | les deux adresses répondent par une redirection vers `https://www.nikon.com/company/news/2018/0823_mirrorless_01/` et `…/company/news/2019/0815_award_01/` ; le contenu est le bon | écrire l'adresse d'arrivée |

- Pour MAP-22, la troisième affirmation de la notion (« rappeler une position mémorisée ») est portée par l'autre source, `canon-r5ii-af-area` : « Registering AF Points (Home Position) — You can register the position of a frequently used AF point. »

### SRC-07 · à améliorer · Deux sources viennent d'appareils à objectif fixe, sans que le libellé le dise ; l'une double une source déjà présente

- Endroit : `data/sources.yaml`, l. 189-196 ; MES-02 (`data/referentiel/mes.yaml`, l. 24) et MAP-14 (`data/referentiel/map.yaml`, l. 134).
- Règle : `CLAUDE.md`, le public a « un boîtier reflex ou hybride (pas de smartphone, de compact ni de bridge) ».
- Preuve :
  - `sony-rx0ii-highlight` : la page s'intitule « Digital Still Camera DSC-RX0M2 », et non « Interchangeable Lens Digital Camera » comme les pages des boîtiers ILCE. Son texte sur la mesure « Highlight » est, mot pour mot, celui de `sony-a9-metering`, citée par la même notion : « Highlight : Measures the brightness while emphasizing the highlighted area on the screen. This mode is suitable for shooting the subject while avoiding overexposure. » La source n'apporte rien que l'α9, un hybride, ne dise déjà.
  - `sony-rx10iv-limiter` : page « Digital Still Camera DSC-RX10M4 », titre « Focus Mode ». Le limiteur qu'elle décrit est un interrupteur de cet appareil : « When the focus range limiter switch is set to “∞-3m,” the camera focuses on subjects more than 3 m away in telephoto shooting ». C'est la seule source de MAP-14. Sur un reflex ou un hybride, je ne sais pas où se règle le limiteur : aucune source du fichier ne le dit.
  - À l'inverse, `nikon-p1100-af-area` écrit dans son libellé « compact, pas un hybride ».
- Correction proposée : retirer `sony-rx0ii-highlight` de MES-02 et du fichier ; écrire « appareil à objectif fixe » dans le libellé de `sony-rx10iv-limiter` et ajouter à MAP-14 un `todo` : sourcer le limiteur sur un objectif de reflex ou d'hybride avant d'écrire la fiche.

### SRC-08 · à améliorer · Le droit français est cité par des commentaires, pas par les textes officiels

- Endroit : `docs/architecture.md`, l. 96-100 ; `data/sources.yaml`, l. 306-334 ; PLA-07 et PLA-09 (`data/referentiel/pla.yaml`, l. 77 et 99).
- Règle : `CLAUDE.md`, « Contenu juridique pays par pays, à partir des textes officiels. »
- Ce qui est écrit : `docs/architecture.md` affirme le contenu de l'article 9 du Code civil, de l'article 372-1 du Code civil et de l'article L122-5, 11° du Code de la propriété intellectuelle, et les source par un article de Village de la Justice (`lingibe-2019`), une brève d'Actu-Juridique (`actu-juridique-2024`) et un article du cabinet CMS (`cms-cadio-2017`). Le cadre européen des drones est sourcé par une FAQ de l'EASA, pas par les règlements (UE) 2019/947 et 2019/945 qu'elle nomme.
- Preuve : aucune adresse d'un texte officiel dans le dépôt (`git grep -i -e legifrance -e eur-lex`, hors `docs/audit/` : aucun résultat). Deux des sept sources du groupe « Droit et réglementation » sont officielles (`service-public-droit-image`, `circulaire-2024`), mais aucune n'est le texte d'un article.
- Les deux notions portent déjà le `todo` « Écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé. » La page `docs/architecture.md`, elle, affirme dès maintenant, et en tire une règle du projet (« le projet le demande toujours », « autorisations écrites »).
- Je ne sais pas si ces affirmations sont justes : les sept hôtes sont hors d'atteinte d'ici, et les textes officiels aussi.
- Correction proposée : à la rédaction de PLA-07, citer chaque article par son adresse sur Légifrance, à la version en vigueur, avec la date de lecture ; garder les commentaires comme lectures d'appoint. D'ici là, ajouter à `docs/architecture.md`, sous « Droits », une ligne : « Sources secondaires ; textes officiels non relus. »

### SRC-02 · à améliorer · `suncalc` : la note dit qu'aucune version n'est publiée, le dépôt porte douze étiquettes de version

- Endroit : `data/sources.yaml`, l. 121-125 ; citée par LUM-04, PLA-01, PLA-02, PLA-03 et le domaine PLA.
- Ce qui est écrit : libellé, « la v2.0 a changé unités et conventions, version à figer » ; note, « Aucune version publiée affichée sur le dépôt : figer un commit (audit indépendant). »
- Preuve (lue le 14 novembre 2026) :
  - `git ls-remote --tags https://github.com/mourner/suncalc` : douze étiquettes, de `v1.6.0` à `v2.1.4`. `v1.9.0` date du 7 février 2022, `v2.0.0` du 18 juin 2026, `v2.1.4` du 10 novembre 2026 (commit `e74c269`).
  - `README.md`, branche `master`, l. 256-260 : « See the Releases page […] for the full changelog. Note that **v2.0** is a precision-focused rewrite with breaking changes to units and conventions ». `package.json` : `"version": "2.1.4"`.
  - Le libellé est juste (licence à deux clauses, « Copyright (c) 2026, Volodymyr Agafonkin » ; changement d'unités à la v2.0). La note ne l'est plus, ou ne l'a jamais été : les étiquettes `v2.0.0` à `v2.1.3` existaient le 7 novembre. Je ne sais pas ce que la page du dépôt affichait ce jour-là (`github.com` répond 403 aux lectures de pages).
- Correction proposée : remplacer la note par « Figer une version étiquetée (2.1.4 le 14 novembre 2026) ; lire les notes de la version 2.0 avant d'écrire PLA-01 à PLA-03. »

### SRC-09 · à améliorer · Six pages n'ont été lues que par Julien, et leur seule trace est le libellé

- Endroit : `data/sources.yaml`, l. 62-73 et 540-559 (`dpreview-iso-invariance`, `pl-iso-invariance`, `canon-eos-rp-pixels`, `canon-eos-rp-af`, `sony-ilce-7m3-af`, `sony-ilce-6000-af`).
- Ce qui est écrit : « Texte relevé par Julien le 11 novembre 2026, le site refusant les lectures automatiques », ou « page relevée par Julien ».
- Preuve : les six adresses sont refusées d'ici (403 de l'hôte pour `www.dpreview.com`, `photographylife.com` et `www.canon.co.uk` ; refus du proxy pour `www.sony.co.in` et `www.sony-mea.com`). Le texte relevé n'est pas dans le dépôt : il ne reste que les extraits recopiés dans les libellés. Trois valeurs du simulateur en dépendent (`app/src/camera/bodies.ts`, l. 47-48 et 61-65) : la couverture de l'autofocus de l'A7 III (93 %) et de l'EOS RP (88 % × 100 %), la définition de l'EOS RP (26,2 millions) ; la fiche EXP-06 dépend des deux articles sur l'invariance ISO.
- Ce n'est pas une faute : c'est la seule voie quand le site refuse les lectures automatiques, et le libellé le dit. Mais personne d'autre que Julien ne peut relire ces six sources, et aucun agent ne l'a fait (FEX et FMA le notent aussi).
- Correction proposée : garder dans le dépôt, pour chaque page relevée, la phrase exacte et son contexte immédiat (le paragraphe), dans un fichier de `docs/dossiers/`, avec la date et « relevé par Julien » ; ou citer en plus une copie archivée de la page quand il en existe une. Les libellés portent déjà les phrases ; il manque le contexte, qui permet de voir ce que la phrase ne dit pas (la note de Canon « Coverage vary depending on the lens used » en est un exemple, bien recopié).

## Vérifié

Dépôts, licences et outils (lus le 14 novembre 2026).

- `threejs-r187`, `babylonjs-9-35-0`, `playcanvas-2-23-3`, `three-gpu-pathtracer-0-0-28`, `mdn-bcd-8-1-8`, `gitleaks-8-30-1` : chaque étiquette pointe le commit du libellé, à la date du libellé (`7e89746`, 30 octobre 2026 ; `00bc37c`, 6 novembre 2026 ; `b7655d8`, 15 octobre 2026 ; `80d1888`, 2 novembre 2026 ; `29768a4`, 2 novembre 2026 ; `83d9cd6`, 12 mars 2026). Licences des libellés : ce sont celles des fichiers de licence à l'étiquette (MIT pour three.js, PlayCanvas, three-gpu-pathtracer et gitleaks, « Copyright (c) 2019 Zachary Rice » ; Apache-2.0 pour Babylon.js, fichier `license.md`).
- `three-mesh-bvh-0-9-18` : l'étiquette `v0.9.18` existe (commit `1d92383`, 3 novembre 2026), licence MIT, « Copyright (c) 2018 Garrett Johnson ».
- `spdx-mit`, `spdx-cc-by-sa-4`, `spdx-cc0`, `spdx-cc-by-4`, `spdx-apache-2` : les cinq textes existent au commit `3184648` du dépôt `spdx/license-list-data`, daté du 29 octobre 2026. Les clauses que citent `docs/licences.md` (l. 18 à 20 et 31) et `docs/questions-ouvertes.md` (l. 13) y sont, aux sections annoncées : notice à inclure (MIT) ; section 3(b)(1) de CC BY-SA 4.0, « a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License » ; section 2 de CC0 1.0, « Waiver » ; section 3(a)(1)(B) de CC BY 4.0, « indicate if You modified the Licensed Material » ; section 2(b)(1), « nor are publicity, privacy, and/or other similar personality rights ».
- `github-pages-limits`, `github-secret-scanning`, `github-push-protection-users`, `github-large-files` : le commit `8cd1075` du dépôt `github/docs` est du 6 novembre 2026 (15 h 25, heure du Pacifique). Les cinq pages existent à ce commit, aux chemins des adresses citées.
- `github-large-files` : « 50 MiB » (avertissement de Git), « 100 MiB » (blocage), « 25 MiB » (envoi par le navigateur) : valeurs du fichier `data/variables/large_files.yml` au même commit, que la page insère. Le libellé et `docs/licences.md`, l. 32, sont justes.
- `github-secret-scanning` et `github-push-protection-users` (`docs/publication.md`, l. 19) : « Public repositories: […] runs automatically for free » et « Push protection for users is on by default for public repositories » sont dans les textes que ces deux pages insèrent (`data/reusables/gated-features/secret-scanning.md`, `data/reusables/gated-features/push-protection-for-users.md`).
- `github-comment-history` : « Anyone with read access to a repository can view a comment's edit history. » est dans la page, identique au commit `8cd1075` et sur la branche `main` du 14 novembre 2026.
- `npm-babylonjs-core`, `npm-vite`, `npm-typescript` : versions 9.35.0, 8.3.6 et 7.0.2 publiées (6 novembre, 5 novembre et 8 juillet 2026), licences Apache-2.0, MIT et Apache-2.0. Vérifié aussi par `choix-et-outils.md`.
- `xatlas-web-npm` : licence MIT, « modified » le 24 mai 2022 dans le registre ; une seule version, 0.1.0, publiée le 18 juin 2020.
- `depth-anything-v2` : « Depth-Anything-V2-Small model is under the Apache-2.0 license. Depth-Anything-V2-Base/Large/Giant models are under the CC-BY-NC-4.0 license. » (`README.md`, branche `main`). Le libellé et la note sont justes ; `docs/architecture.md`, l. 80, ne retient que le modèle Small.
- `filament-pbr` : le fichier existe au commit `e8669b6` ; auteurs Romain Guy et Mathias Agopian ; section « Physically based camera » à la l. 2712. Contenu relu par `modele-physique.md`.
- `bgfx-bokeh-example` : `bokeh_dof.sh` et `fs_bokeh_dof_combine.sc` existent sur la branche `master`, « Copyright 2021 elven cache » ; licence de bgfx à deux clauses. Contenu relu par `modele-physique.md`.

## Je ne sais pas

(en cours d'écriture)

## Recensements

(en cours d'écriture)
