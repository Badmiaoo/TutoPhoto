# Audit du travail antérieur : synthèse et plan de corrections

Synthèse écrite le 15 novembre 2026 par un agent de Claude, à partir des douze rapports de ce dossier. Elle ne dit que ce que les rapports établissent ; les preuves restent dans les rapports, auxquels chaque identifiant renvoie. Deux agents l'ont ensuite confrontée aux rapports, et un troisième a revu l'ordre et le découpage du plan : ce qui, dans le plan, ne vient pas des rapports est signalé comme un choix de ce plan.

- **La demande.** Julien, le 12 novembre 2026, à propos du travail fait jusque-là par le modèle précédent : il « doit être challengé et si nécessaire modifier » ; « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ». Le 13 novembre : « tu va finir l'audit correctement. Tu pousse le résultat sur git. »
- **La méthode.** Pour chaque rapport, un agent de Claude relit chaque source à son adresse, refait chaque calcul, confronte le code à la documentation et écrit ses constats. Un second agent essaie de réfuter chaque constat et écrit dessous son verdict, « confirmé » ou « réfuté », avec sa preuve ; il corrige au besoin la gravité ou la correction proposée, et un troisième agent contre-vérifie les constats que le second a ajoutés. Seuls les constats confirmés sont à corriger ; quand la contre-vérification a changé la gravité ou la correction, c'est elle qui est reprise ici.
- **Ce que couvre l'audit.** Le travail fait avant le 12 novembre 2026, c'est-à-dire jusqu'à la version 0.3.53. Les versions 0.3.54 à 0.3.57 (routine de test dans la CI, progression du chargement, grilles de cadrage, histogrammes) sont hors du périmètre, même quand le code lu est celui de la version 0.3.57 ou 0.3.58.
- **Les identifiants.** Chaque constat porte le préfixe de son rapport : PHY (modèle physique), FEX (fiches d'exposition), FMA (fiches de mise au point), ARC (architecture), CHX (choix et outils), SRC (sources), REF (contenu du référentiel), RST (structure du référentiel), COD (code), INT (interface), DOC (documentation), LIC (licences, scripts et CI). Les fiches de `docs/audit/synthese/` sont des documents de travail de cette synthèse, non relus par un second agent : la référence est cette page.

## En bref

- 186 constats dans douze rapports : 160 confirmés, 26 réfutés. Gravité finale des confirmés : 11 « faux », 6 « non sourcé », 21 « incohérent », 122 « à améliorer ».
- Ce qui ressort des douze rapports : le cœur tient, les fautes sont aux bords. Elles sont dans ce qu'un débutant joue à la lettre, dans le calcul d'une photo, dans ce que les contrôles ne regardent pas, et dans une documentation qui n'a pas suivi les versions.
- Application : pendant le calcul d'une photo, un glissé fait tourner l'appareil (COD-01) et, en AF-S, un toucher déplace le repère sans faire le point (COD-07) ; la rafale au doigt s'arrête si le doigt glisse de 20 px (COD-09, toucher émulé) ; après « Photo entière », la loupe de l'écran de revue agrandit un autre point que celui touché (COD-14) ; le bouton de l'indicateur d'exposition ne répond qu'une demi-seconde sur deux quand il clignote (FEX-19) ; la page se fige au déclenchement quand le fichier d'éclairage n'est pas arrivé (COD-06), et reste muette dans un navigateur sans WebGL (COD-11).
- Fiches : la recette du chien qui court, suivie à la lettre, perd le chien dans 30 vues sur 46 (FMA-19, FMA-23 ; vues prises en rendu logiciel, où l'une des deux causes de FMA-23 pèse six fois plus qu'à 60 images par seconde) ; les exercices d'exposition ignorent que l'ISO auto est activé au départ (FEX-02) ; deux phrases données pour des règles du boîtier ne sont dans aucune page citée (FMA-02, FMA-03).
- Outils et documentation : la routine de test dit vert à tort (INT-05, INT-06) ; la documentation annonce un filé et un étalonnage que le code ne fait pas (PHY-01, PHY-06) ; les deux README sont périmés (DOC-02, DOC-01).
- Ce qui tient : les formules du modèle et leurs sources, les citations, les données du référentiel, les licences, les règles du dépôt (63 fusions avec une CI verte). Le choix du moteur n'est pas rouvert.
- Le plan propose 48 sujets, un par pull request, en quatre parties. Il commence par afficher la version du site (Sujet 1, ARC-12), parce que plusieurs corrections sont à confirmer par Julien sur son téléphone et que rien ne lui dit quelle version il regarde. Viennent ensuite quatre corrections d'une ligne, dont trois déjà essayées (Sujet 2), le calcul d'une photo (Sujet 3), la routine de test (Sujet 4) et les pages d'où repart chaque session (Sujet 5) ; puis la recette du chien qui court (Sujet 6), les fiches et le reste de l'application ; puis les contrôles, les données, les refontes et la documentation.
- Le plan peut commencer sans attendre Julien : 31 sujets partent sans décision, 12 en partie, 5 en attendent une.
- 37 décisions attendent Julien : 14 bloquent un sujet ou une partie de sujet, 23 ne bloquent rien aujourd'hui. Les premières à servir, dans l'ordre du plan : D6 et D14 (des lignes de `CLAUDE.md`, Sujets 4 et 5), D5 (« f/5,6 » ou « f/5.6 », avant les fiches des Sujets 7 et 8), D1 (le retardateur, Sujet 11). S'y ajoutent deux réglages de GitHub et des essais sur son téléphone, que le plan propose de faire après chaque fusion, sur le site publié (D37).
- Limite de toutes les preuves : les essais sont faits dans Chromium en rendu logiciel, sur des écrans émulés ; rien sur un téléphone, avec un processeur graphique ni dans Safari ; 51 des 151 sources examinées n'ont pas pu être relues.

## Rapports

| Rapport | Constats | Confirmés | Réfutés | Dont ajoutés par le second agent |
| --- | --- | --- | --- | --- |
| `docs/audit/modele-physique.md` | 21 | 20 | 1 | 1 |
| `docs/audit/fiches-exposition.md` | 19 | 18 | 1 | 0 |
| `docs/audit/fiches-mise-au-point.md` | 23 | 21 | 2 | 1 |
| `docs/audit/architecture-application.md` | 14 | 12 | 2 | 2 |
| `docs/audit/choix-et-outils.md` | 11 | 6 | 5 | 0 |
| `docs/audit/sources.md` | 10 | 8 | 2 | 1 |
| `docs/audit/referentiel-contenu.md` | 18 | 14 | 4 | 1 |
| `docs/audit/referentiel-structure.md` | 13 | 11 | 2 | 1 |
| `docs/audit/code.md` | 14 | 13 | 1 | 1 |
| `docs/audit/interface.md` | 21 | 21 | 0 | 0 |
| `docs/audit/documentation.md` | 12 | 8 | 4 | 0 |
| `docs/audit/licences-scripts-ci.md` | 10 | 8 | 2 | 1 |
| Total | 186 | 160 | 26 | 9 |

Ce que chaque rapport conclut :

- `modele-physique.md` : les formules du cœur du modèle (exposition, bruit, zone nette, traînée, modes A et S) sont celles de leurs sources, et les exemples chiffrés se recalculent. Les défauts sont aux bords : ce que la documentation promet et que le code ne fait pas (filé, étalonnage de la scène), et ce que le passage à la densité de l'écran a changé sans que le bruit et le flou du viseur suivent. Le reste est fait de sources à citer et de limites à écrire. Aucun navigateur n'a été employé pour ce rapport, sauf pour un constat.
- `fiches-exposition.md` : les explications disent ce que disent les sources relues, et les chiffres se recalculent avec le boîtier de départ. Les défauts sont dans les exercices joués à la lettre (ISO auto activé au départ, valeurs que l'indicateur ne peut pas afficher, boîtiers APS-C) et dans un bouton qui, quand il clignote, ne répond qu'une fois sur deux.
- `fiches-mise-au-point.md` : les sources disent ce que les fiches leur font dire, à deux phrases près. Les recettes de SIT-01 et de SIT-05 réussissent leur défi ; celle de SIT-06, suivie à la lettre, échoue le plus souvent : l'autofocus continu perd le chien dans 30 vues sur 46, prises en rendu logiciel, où l'une des causes pèse six fois plus qu'à 60 images par seconde. La vue de dessus et le bulletin ne jugent pas les mêmes points.
- `architecture-application.md` : la photo calculée par accumulation et la scène pilotée par une horloge sont à garder. Ce qui pèse : le viseur et la photo ne partagent pas leur développement, les réglages sont câblés à la main, il n'y a ni test rapide des formules, ni mesure du coût du viseur, ni version affichée. La contre-vérification ramène le plan de neuf refontes à cinq.
- `choix-et-outils.md` : les choix de fond ont presque tous une décision de Julien, datée et écrite, et leurs sources disent ce que la documentation leur fait dire ; le choix du moteur n'est pas rouvert. Sont confirmés : une documentation qui se recouvre, des décisions en attente dispersées, et l'absence de protection de `main` dans GitHub. Le rapport pose des questions de fond à Julien.
- `sources.md` : quand la page est joignable, les citations et les nombres des libellés y sont (68 citations : 64 retrouvées mot pour mot, 4 avec un écart qui ne change pas le sens). Aucun constat ne change une valeur du simulateur ni une phrase d'une fiche. Les défauts sont dans la tenue du fichier des sources. 51 entrées sur 151 n'ont pas pu être relues.
- `referentiel-contenu.md` : aucune affirmation de photographie contraire à une source lue, à deux réserves près. Les défauts : des textes du référentiel qui n'ont pas suivi les fiches ou les manuels, des renvois et des notions clés qui manquent à quelques situations. Que 125 notions n'aient pas encore de source est l'état voulu et écrit.
- `referentiel-structure.md` : les données sont saines et les comptes exacts. Les défauts sont dans ce que les contrôles ne regardent pas, et dans les identifiants `SIT-V2-NN`, que la construction des pages refuse. Sa section sur le périmètre pose des questions à Julien sans rien retirer.
- `code.md` : des fautes visibles pendant le calcul d'une photo, sur l'écran de revue et en cas d'échec du chargement. Les corrections tiennent le plus souvent en quelques lignes ; six sont essayées dans un navigateur (COD-01, COD-07, COD-09, COD-11, COD-12, COD-14). Rien ne fuit au fil des photos et les erreurs du calcul sont rattrapées.
- `interface.md` : les contrastes des textes et les termes du Nikon Z 6 sont justes. Les défauts : une routine qui dit vert à tort et n'envoie aucun toucher, une mise en page pour téléphone, mesurée sur des fenêtres émulées, qui dépend de la longueur des textes (une seule refonte, à décider par Julien), un simulateur qui vouvoie, des noms accessibles à compléter.
- `documentation.md` : les deux README et la page des questions ouvertes n'ont pas suivi les versions ; le reste tient en quelques lignes. Les décisions sont datées et attribuées.
- `licences-scripts-ci.md` : les licences annoncées sont celles des pages d'origine, et l'historique ne contient rien de privé qui ne soit déjà consigné dans `docs/publication.md`. Les défauts : des contrôles qui ne lisent que l'état final des fichiers et croient ce qu'on leur déclare, deux workflows que l'on peut lancer hors de `main`, quatre phrases inexactes.

## Constats confirmés, par gravité

La gravité est celle du titre du constat, sauf quand la contre-vérification l'a baissée : c'est alors la sienne. La troisième colonne renvoie au sujet du plan qui traite le constat. Les notions et les situations sont désignées par leur identifiant du référentiel (EXP-04, SIT-06…).

### Faux (11)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-01 | `docs/camera-physique.md` annonce qu'en rafale, suivre le chien « donne un filé » ; le code garde l'appareil immobile pendant chaque pose, il n'y a pas de filé. | Sujet 17 |
| PHY-02 | La documentation dit le bruit de lecture du Nikon D5600 « non mesuré » au-delà d'ISO 2546, alors que la source a quatre points jusqu'à ISO 6400 ; faux pour le texte seulement, le rendu ne change pas (le bilan du rapport dit cette gravité « à baisser », sans nommer le niveau). | Sujet 36 |
| COD-01 | Pendant le calcul d'une photo, un glissé sur le viseur fait tourner l'appareil entre les rendus : la photo est en surimpression et le viseur a tourné à la reprise (essayé à la souris ; au doigt émulé, il suffit que le doigt reste posé, écarté de son point d'appui). | Sujet 3 |
| COD-06 | Si le fichier d'éclairage n'arrive pas, il est compté comme reçu, la scène s'affiche sans ses objets, et un appui sur le déclencheur fige la page. | Sujet 10 |
| COD-07 | En AF-S, toucher le viseur pendant le calcul d'une photo déplace le repère sans faire le point : le repère reste vert et la photo suivante part à l'ancienne distance. | Sujet 3 |
| COD-09 | Rafale au doigt : un glissement de 20 px sur le déclencheur arrête la rafale, doigt encore posé (toucher émulé). | Sujet 2 |
| COD-11 | Dans un navigateur sans WebGL, le message prévu n'est jamais visible : restent un rectangle gris et des éléments vides. | Sujet 10 |
| COD-14 | Écran de revue : après « Photo entière », la loupe agrandit un point de l'ancienne fenêtre, pas le point touché. | Sujet 2 |
| INT-05 | Routine de test : le contrôle du réglage de départ de la mise au point relit un réglage que la routine vient de faire ; le réglage de départ n'est jamais contrôlé. | Sujet 4 |
| SRC-01 | L'adresse de la source `nikon-zr-mf-ring` mène au sommaire d'un menu, pas à la page que nomme son libellé. « Faux » ne vaut que pour l'adresse, qui mène un niveau trop haut dans le bon guide ; rien de publié n'en dépend. | Sujet 30 |
| DOC-02 | `README.md` écrit « 96 sources » pour 172, « quatre personnages » pour cinq, et un titre daté du 8 novembre au-dessus d'un état du 12. | Sujet 43 |

### Non sourcé (6)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-03 | « Pas de flou de mouvement, comme dans le viseur d'un vrai appareil » : aucune page lue ne dit ce que la visée d'un hybride montre du temps de pose. | Sujet 17 |
| PHY-04 | La loi du bruit n'a pas de source dans le dépôt ; elle est juste d'après les pages lues, sauf l'addition des variances, qu'aucune page lue n'écrit. | Sujet 36 |
| PHY-05 | La formule du champ de vue n'a pas de source dans le dépôt, et rien ne dit qu'elle vaut pour une mise au point à l'infini. | Sujet 36 |
| FMA-02 | Fiche MAP-06 : « Hors de cette zone, l'appareil ne peut pas faire le point » n'est dans aucune des pages citées, et c'est trop large. | Sujet 8 |
| FMA-03 | Fiches SIT-05 et MAP-05 : « souvent le sol devant les pieds » est une règle du simulateur, donnée pour celle du boîtier. | Sujet 8 |
| REF-07 | 125 notions sur 191 n'ont pas de source, état voulu et écrit ; 20 d'entre elles affirment un fait précis qu'une page lue appuie, et « non sourcé » ne vaut que pour ces 20 : aucune d'elles n'est dans le jalon de la V1 minimale, aucune de leurs phrases n'est fausse. | Sujet 37 |

### Incohérent (21)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-06 | La documentation annonce une scène mise à l'échelle : rien de tel dans le code, et l'éclairage des objets 3D est environ deux fois plus fort que le fond (établi par les fichiers et le calcul, non mesuré dans un rendu). | Sujet 17 pour la documentation ; le réglage attend D15 |
| PHY-07 | Sur un écran de densité 2, la loupe du viseur montre un bruit plus faible qu'attendu (calculé à partir du code, non mesuré dans un navigateur). | Sujet 18 |
| PHY-08 | Le plafond du flou du viseur est compté en pixels calculés : à densité 2, il vaut la moitié sur le capteur, et les exemples de la documentation ne valent plus. | Sujet 17 ; Sujet 18 si D25 décide de relever le plafond |
| PHY-09 | Une note de l'interface dit les réglages par défaut de la rafale et du retardateur « choisis », alors que le manuel du Z 6 les donne. | Sujet 17 |
| FEX-01 | Fiches EXP-04 et EXP-05, exercices : aucune vitesse ne « met la cellule à 0 », et f/4 affiche +0,8 IL, pas +1 IL ; la réponse et la leçon sont justes. | Sujet 7 |
| FEX-02 | Fiches EXP-04, EXP-05 et EXP-06 : au départ l'ISO auto est activé, comme sur le Z 6, et les fiches ne le disent pas ; fermer le diaphragme ne bouge alors ni l'indicateur ni le viseur. | Sujet 7 |
| FEX-03 | Fiche EXP-06 : « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit » donne la cause à l'envers. | Sujet 15 |
| FMA-12 | La vue de dessus juge un personnage à sa position au sol, le bulletin à ses yeux : pour la même photo, des repères verts et un bulletin qui écrit « manqués ». | Sujet 9 |
| FMA-22 | Fiche MAP-09 : elle décrit le Z 6 (cadre ambre dès qu'un visage est détecté) ; en AF-S, le simulateur ne détecte rien avant le toucher ou le déclenchement. | Sujet 8 ; le changement du simulateur attend D18 |
| COD-03 | `?lang=` et `?defi=` de l'adresse l'emportent encore après un choix fait dans la page : le choix est perdu au rechargement. | Sujet 12 |
| COD-04 | Après un changement de langue, la légende d'une photo déjà prise garde le résumé des réglages dans l'ancienne langue. | Sujet 11 |
| COD-08 | Pendant le calcul de la loupe, « Revenir au viseur » et « Vue suivante » restent actifs, et le résultat de la loupe s'impose ensuite. | Sujet 11 |
| INT-07 | Sept textes français du simulateur vouvoient ; l'accueil, l'activité et les fiches tutoient. | Sujet 13 |
| INT-12 | Le cadre est horizontal ou vertical selon la place que le panneau laisse au viseur, pas selon l'écran ; changer de mode AF ou de langue peut le faire basculer. | Sujet 17 pour la phrase de la documentation, Sujet 42 pour la bascule |
| INT-13 | Les profils « Android » et « iPhone » de la routine ne touchent jamais l'écran : tous les gestes sont ceux d'une souris. | Sujet 4 pour les deux phrases ; les gestes au toucher attendent (voir plus bas) |
| SRC-03 | Le champ `used_in` de `data/sources.yaml` a deux définitions écrites. Il ne suit pas la seconde (34 entrées ont leur adresse dans un fichier qu'il ne liste pas, et `validate.py` ne contrôle qu'un sens) ; contre la première, 31 entrées le portent en surplus, ce que la contre-vérification ne tient pas pour une faute : c'est la phrase de `docs/lire-le-referentiel.md` qui n'a pas suivi. | Sujet 34 |
| REF-01 | Les situations SIT-V2-01 et SIT-V2-05, qui portent sur le flash, n'ont pas de champ `flash`, ce qui se lit « pas de flash » ; aucun code ne lit ce champ. | Sujet 31 |
| REF-02 | Le référentiel dit de la notion MES-07 « repérer en direct les zones brûlées » ; les manuels lus du Z 6 et de l'EOS R5 ne montrent les hautes lumières qu'à la lecture. La fiche publiée dit déjà juste. | Sujet 31 |
| RST-01 | Les identifiants `SIT-V2-NN` sont refusés par la construction des pages, par le schéma des fiches relues et par la fenêtre de fiche du simulateur. | Sujet 21 |
| DOC-01 | `README.en.md` est resté à la version 0.3.22 : il écrit « coverage 0 of 191 » pour 13 et ne décrit ni les fiches ni l'accueil. Son état est daté du 8 novembre, où il était juste : ce sont les deux README, donnés l'un pour la version de l'autre, qui ne disent plus la même chose. | Sujet 43 |
| LIC-08 | Quatre phrases de la documentation des licences et de la publication sont inexactes, dont « le site publié ne contient que notre code et celui de Babylon.js ». | Sujet 46 |

### À améliorer (122)

Modèle physique :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-10 | Cinq phrases du début de `docs/camera-physique.md` sont périmées. | Sujet 17 |
| PHY-11 | La diffraction n'est ni simulée ni dite. | Sujet 17 |
| PHY-12 | En modes A et S, la cellule donne la même mesure quel que soit le cadrage ; le débutant ne le lit nulle part. | Sujet 17 |
| PHY-13 | Le calcul de la saturation selon la sensibilité (capacité × 100 / ISO) est donné comme « modèle proposé », alors que la page de la source fait ce calcul. | Sujet 36 |
| PHY-14 | « La forme exacte de l'image n'est pas lue dans les sources » est faux pour trois boîtiers. | Sujet 36 |
| PHY-15 | Deux tableaux de la documentation disent encore « page non ouverte » pour l'EOS RP ; le capteur de trois boîtiers n'a qu'une source secondaire. Aucune valeur n'est fausse. | Sujet 36 ; D4 |
| PHY-17 | L'indicateur d'équilibre calcule la traînée du sujet au point de mise au point, pas à la position du sujet comme le fait le bulletin. | Sujet 9 |
| PHY-18 | Deux hypothèses du bruit ne sont pas dites (canaux de l'image, tirages gaussiens). | Sujet 36 |
| PHY-19 | La documentation dit le flou du viseur écrit « sans copie » ; sa boucle est celle d'un exemple de la bibliothèque bgfx, absente des licences et des crédits. | Sujet 17 pour la phrase, Sujet 46 pour la notice (D13) |
| PHY-20 | Le critère du sujet « figé » a une source dans un article déjà cité, qui n'est pas citée. | Sujet 36 |
| PHY-21 | Une photo interrompue par le plafond de 5 s a un flou de mise au point réduit, sans que la légende le dise (mesuré en rendu logiciel seulement). | Sujet 17 pour la phrase, Sujet 39 pour le code |

Fiches d'exposition, de mesure et de boîtier :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| FEX-04 | Fiche BOI-12 : valeurs justes, mais les délais du retardateur viennent d'une page non citée, et « 12 vues par seconde » est donné sans sa condition. | Sujet 15 |
| FEX-05 | Fiche EXP-06, exercice : la comparaison demandée à ISO 6400 se fait à +4,5 IL, sans dire où viser ni quoi conclure. | Sujet 7 |
| FEX-06 | Les exercices de MES-04, MES-10, BOI-08 et BOI-12 dépendent de réglages non écrits, que le simulateur mémorise d'un exercice à l'autre. | Sujet 7 |
| FEX-07 | Fiches EXP-05 et BOI-07 : 1/4000 s est la limite de TutoPhoto, pas celle du Z 6 ; dans le parc, le cas « pas assez de lumière » n'arrive jamais en mode A. | Sujet 15 |
| FEX-08 | Le référentiel prévoit ce que le simulateur n'a pas (diaphragme animé, rideau animé, mode silencieux…), sans que les fiches le disent. | Sujet 15 ; D17 |
| FEX-09 | Fiche MES-04 : elle ne dit pas que la cellule de TutoPhoto mesure partout la même chose. | Sujet 15 |
| FEX-11 | Vocabulaire : deux noms pour l'indicateur d'exposition, « loupe » dans un texte anglais, deux titres de pages de Nikon mal cités, liens français manquants. | Sujet 15 |
| FEX-12 | Trois petites inexactitudes dans les fiches EXP-05, EXP-06 et MES-10. | Sujet 15 |
| FEX-13 | « 1/1000 s fige le chien » ne vaut qu'en plein format ; avec les trois boîtiers APS-C du simulateur, il faut 1/1250 s. | Sujet 7 |
| FEX-14 | Fiche MES-10 : trois formulations plus larges que les pages lues sur la vitesse minimale de l'ISO auto. | Sujet 15 |
| FEX-15 | Les fiches BOI-07, BOI-08 et BOI-12 n'ont que les noms de Nikon, alors que quatre des six boîtiers du simulateur sont des Sony ou des Canon. | Sujet 19 |
| FEX-16 | Les fiches françaises écrivent « f/5.6 », l'interface française « f/5,6 ». | Sujet 20 |
| FEX-17 | Fiche BOI-07, en français : « ouvre à f/2 ou plus » se lit dans les deux sens. | Sujet 7 |
| FEX-18 | Les fiches EXP-04, EXP-05 et EXP-06 citent Wikipedia sans dire « source secondaire » ; deux dates de lecture ne concordent pas. | Sujet 35 |
| FEX-19 | Quand l'indicateur d'exposition clignote, le bouton qui ouvre la fenêtre « Exposition » ne prend ni les clics ni le focus une demi-seconde sur deux. | Sujet 2 |

Fiches de mise au point, de netteté, de mouvement et de lumière ; situations ; activité de LUM-02 :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| FMA-01 | Fiche MAP-04, exercice : ni le défi, ni le mode, ni la vitesse ne sont écrits au début. | Sujet 8 |
| FMA-04 | Fiche NET-06 : elle ne dit pas que le fond photo ne change pas de perspective quand l'appareil avance. | Sujet 16 |
| FMA-06 | Fiche MVT-01 : le critère « figé » est présenté comme une règle alors que c'est un choix de TutoPhoto, et rien ne dit que le bulletin ne juge que le déplacement d'ensemble du sujet. | Sujet 36 |
| FMA-07 | Fiche SIT-01 : la lumière, qui est dans le titre et les notions clés, n'a pas de ligne dans la recette. | Sujet 16 |
| FMA-08 | Trois formulations ambiguës dans les fiches MAP-09, LUM-02 et MAP-05. | Sujet 8 |
| FMA-09 | Les fiches NET-01, NET-06 et MVT-01 citent Wikipedia sans dire « source secondaire » ; une date de lecture ne concorde pas, une autre manque. | Sujet 35 |
| FMA-10 | Activité de LUM-02 : la pénombre annoncée peut dépasser le mur dessiné, et la légende dit « ombre pleine au centre » quand il n'y en a pas. | Sujet 14 |
| FMA-11 | Fiche MAP-04 : dans le parc, l'AF-S verrouillé sur le chien réussit le défi comme l'AF-C ; l'exercice n'oppose pas les deux modes. | Sujet 8 ; D26 |
| FMA-13 | Fiche MVT-01, exercice : « 1/200 s » et « 1/800 s » ne valent qu'en plein format et au 50 mm. | Sujet 7 |
| FMA-14 | Les fiches MAP-04, MAP-05, MAP-06 et MAP-09 n'ont que les noms de Nikon. | Sujet 19 |
| FMA-15 | Le champ `sources` des notions NET-01, LUM-02 et MAP-04 ne liste pas une source que leur fiche cite. | Sujet 31 |
| FMA-16 | Fiche NET-06, exercice : après le déplacement de l'appareil, il faut refaire la mise au point, et l'exercice ne le dit pas. | Sujet 8 |
| FMA-17 | Un défi est « réussi » sur une photo surexposée de 3,8 IL : aucun défi ne juge l'exposition, choix écrit que le débutant ne lit nulle part. | Sujet 8 ; D20 |
| FMA-18 | Fiche SIT-05 : au 50 mm, le défi réussit à toutes les ouvertures ; la profondeur de champ n'y joue pas. | Sujet 16 |
| FMA-19 | Fiche SIT-06 : le défi est « réussi » sur une vue où la tête du chien est cachée, et, recette suivie à la lettre, la mise au point quitte le chien dans 30 vues sur 46, en rendu logiciel (pour les neuf vues perdues qui ont été regardées une à une : cinq derrière un personnage, deux au bord du cadre que l'autofocus ne couvre pas, deux à découvert). | Sujet 6 ; D19 |
| FMA-21 | La section « Notions » des fiches SIT-01 et SIT-06 ne liste pas toutes les notions que la recette cite. | Sujet 16 |
| FMA-23 | En AF-C, à certains instants du galop, la détection perd l'œil du chien alors que rien ne le cache, et la mise au point saute au sujet le plus proche (3 instants sur 110, horloge figée ; 29 mesures sur 90 en rendu logiciel, où un retard d'une image de la carte de profondeur pèse le plus). | Sujet 6 |

Architecture de l'application :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| ARC-01 | Le viseur et la photo ne partagent pas leur développement (exposition, courbe, écrêtage, bruit), qui s'écrit deux fois ; la profondeur de champ et le flou de mouvement, eux, ont deux chaînes par une décision de Julien du 8 novembre 2026. | Sujet 40 |
| ARC-02 | Un réglage du boîtier se câble à la main à huit endroits de `cameraPanel.ts` et dans plusieurs autres fichiers. | Sujet 41 |
| ARC-03 | La scène est écrite dans le code, et ce qui lui est propre est réparti dans dix fichiers. | sans correction maintenant |
| ARC-05 | Aucun test rapide des formules ; la routine est un seul scénario de 862 lignes, qui prend de 20 à 27 minutes dans la CI. | Sujet 26 |
| ARC-06 | Ni le coût d'une image du viseur ni la mémoire graphique ne sont mesurés. | Sujet 28 |
| ARC-07 | Les mêmes formules et les mêmes constantes sont écrites à plusieurs endroits. | Sujet 27 ; Sujet 23 pour les titres recopiés |
| ARC-08 | La suspension du viseur pendant le calcul d'une photo est écrite à la main, à un seul endroit. | Sujet 40 |
| ARC-09 | `docs/architecture.md` décrit encore un moteur 2.5D, et se dit elle-même « en partie caduque » ; aucune page ne décrit la structure de l'application. | Sujet 29 |
| ARC-10 | La ligne « bruit » du bulletin vient du viseur, pas de la photo. | Sujet 17 pour une phrase ; le reste sans correction maintenant (D21) |
| ARC-12 | Le site publié ne dit nulle part quelle version il est. | Sujet 1 |
| ARC-13 | La photo et l'autofocus supposent le rendu dans des textures en flottants, et aucune capacité de l'appareil n'est lue. | Sujet 28 |
| ARC-14 | L'indicateur d'équilibre n'est pas suspendu pendant le calcul d'une photo et affiche alors un bruit faux. | Sujet 3 |

Choix de fond et outils :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| CHX-01 | Le récit de chaque version s'écrit dans quatre à onze fichiers, et trois journaux tiennent le même fil. | Sujets 5, 43 et 48 |
| CHX-02 | Les deux effets de Babylon.js qui ont fait choisir le moteur ne servent plus ; trois lignes de `docs/pile-technique.md` sont périmées. Le choix du moteur n'est pas rouvert. | Sujet 44 |
| CHX-03 | Rien, dans GitHub, n'empêche de pousser sur `main` ni de fusionner avec une CI rouge ; la règle a pourtant été tenue pour les 63 fusions. | réglage de Julien, à la fin du plan |
| CHX-05 | Les titres des notions sont recopiés à la main dans les fiches et dans `challenges.ts` ; aucun contrôle ne les compare à `data/`. | Sujet 23 |
| CHX-06 | `scripts/extract_reprise.py`, lancé sans argument, écrit seize fichiers dans le dossier courant, dont quinze diffèrent de ceux du dépôt. | Sujet 45 |
| CHX-10 | Trois attentes anciennes manquent à la liste « Ce qui attend Julien », dont trois tags jamais posés. | Sujets 5 et 25 |

Sources :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| SRC-02 | La note de la source `suncalc` dit qu'aucune version n'est publiée ; le dépôt de SunCalc porte douze étiquettes de version. Rien n'en dépend aujourd'hui : SunCalc n'est pas une dépendance de l'application. | Sujet 30 ; Sujet 5 pour la phrase de `docs/questions-ouvertes.md` |
| SRC-04 | 75 entrées de `data/sources.yaml` n'ont ni date ni mention de lecture. | Sujet 33 |
| SRC-05 | Deux pages npm citées dans `docs/pile-technique.md` n'ont pas d'entrée dans `data/sources.yaml`. | Sujets 30 et 34 |
| SRC-06 | Trois adresses sont imprécises (`nikon-z8-guide`, `canon-m50ii-metering`, `wikipedia-zone-system`). | Sujet 30 |
| SRC-07 | Deux sources viennent d'appareils hors du public visé, sans que leur libellé le dise. | Sujet 30 |
| SRC-10 | La source `fujifilm-x100t-photometry` vient d'un compact à objectif fixe, sans que son libellé le dise. | Sujet 30 |

Contenu du référentiel :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| REF-03 | « Mise au point par zone » (MAP-16) se confond avec les « zones » de l'autofocus des trois marques. | Sujet 31 |
| REF-04 | Cinq notions qui ont une fiche n'ont pas, dans leur champ `sources`, toutes les sources de la fiche. | Sujet 31 |
| REF-05 | Notion BOI-09 : l'explication dit « lumière stable », l'exercice « lumière changeante ». | sans correction maintenant |
| REF-08 | Quatre termes ne sont ceux d'aucun des trois manuels français lus ; le référentiel n'a pas de champ pour les termes de chaque marque. | Sujet 31 ; D3 |
| REF-09 | Le trépied (MVT-12) ne renvoie qu'à deux situations ; cinq autres en demandent un ou s'y rapportent. | Sujet 32 |
| REF-10 | Situation SIT-42, sous l'eau : rien ne dit qu'un reflex ou un hybride n'est pas étanche. | Sujet 32 |
| REF-11 | Situation SIT-16, architecture : la seule notion clé qui redresse les verticales demande un objectif spécial. | Sujet 32 |
| REF-12 | Situation SIT-28, autoportrait : « Anatomie du boîtier » y est notion clé sans rien avoir de propre à l'autoportrait. | Sujet 32 |
| REF-15 | Notion OPT-12 : « vers 53 à 56° » ne dit pas depuis quoi l'angle se mesure. | Sujet 31 |
| REF-17 | Trois petites inexactitudes (MVT-08, MAP-04, BOI-31). | Sujet 31 |
| REF-18 | Aucune notion ne parle de corriger la perspective après la prise, fonction que le Z 6 a dans son menu Retouche. | Sujet 32 |

Structure du référentiel :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| RST-02 | Une fiche dont l'identifiant n'existe pas, ou est retiré, est publiée sans erreur. | Sujet 23 |
| RST-03 | Aucun contrôle ne voit un identifiant renuméroté ou supprimé. | Sujet 23 |
| RST-04 | Une clé YAML écrite deux fois est acceptée en silence, la seconde écrase la première. | Sujet 22 |
| RST-05 | Le champ `since` et la règle du numéro Y ne sont contrôlés par rien. | Sujet 23 ; D9 |
| RST-06 | Un écart à la règle de niveau d'une situation n'est qu'un avertissement, que la CI laisse au vert. | Sujet 22 |
| RST-07 | Aucun contrôle de doublon dans les listes du référentiel. | Sujet 22 |
| RST-09 | Le calcul de couverture et le site n'ont pas la même définition des situations d'une notion ; seul écart réel, la page de BOI-07 n'a pas de section « Situations ». | Sujet 16 pour la ligne ; D27 pour la règle |
| RST-10 | Les notions RET-01 et RET-02, reportées en V2, n'ont pas de note qui le dise. | Sujet 31 |
| RST-11 | `docs/lire-le-referentiel.md` ne décrit pas tous les champs que les schémas acceptent. | Sujet 33 |
| RST-13 | Une fiche de situation réduite à son titre compterait comme « rédigée » et serait publiée. | Sujet 21 |

Code de l'interface :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| COD-02 | Retardateur : si la fin du compte à rebours tombe pendant le calcul de la loupe, la vue est perdue sans message. | Sujet 11 ; D1 |
| COD-05 | Rafale dont une vue échoue : le message d'erreur est aussitôt remplacé par la première vue réussie. | Sujet 11 |
| COD-12 | Contexte WebGL perdu : aucun message, et après la restauration les objets éclairés sont plus sombres (rendu logiciel). | Sujet 10 |
| COD-13 | Six petits défauts d'état et de code mort. | Sujets 10, 11, 12 et 13, au passage |

Interface et routine de test :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| INT-01 | L'identifiant `situation` est porté par deux éléments de l'accueil : depuis une fiche de situation anglaise, le fil d'Ariane vise le bloc français masqué. | Sujet 13 |
| INT-02 | Activité de LUM-02 : la source de lumière du schéma fait 4 × 2 px à 390 px de large, à 1,62:1 de contraste. | Sujet 14 |
| INT-03 | Téléphone émulé tenu à l'horizontale : le cadre fait 117 × 78 px. | Sujet 42 |
| INT-04 | La hauteur du viseur dépend de chaque texte du panneau : de 159 à 266 px pour une même hauteur de fenêtre (664 px), selon la largeur, la langue et le mode AF. | Sujet 42 |
| INT-06 | Routine : une erreur JavaScript pendant le scénario ne la fait pas échouer. | Sujet 4 |
| INT-08 | Le viseur, la carte et la photo ne répondent qu'au pointeur, pas au clavier. | Sujet 38 ; D23 |
| INT-09 | Huit textes ne sont écrits que dans des infobulles, invisibles au doigt et au clavier. | Sujet 38 |
| INT-10 | Aucun libellé ne dépend de la marque choisie : avec un Canon ou un Sony, tout reste dit dans les termes du Nikon Z 6. | Sujet 19 |
| INT-11 | Sur téléphone émulé, deux pastilles du viseur sont coupées ou recouvertes. | Sujet 42 |
| INT-14 | La routine n'essaie jamais le simulateur, l'activité ni les fiches en anglais (l'accueil, lui, l'est), le téléphone à l'horizontale, 320 px de large, le clavier, le toucher, le retardateur, ni plusieurs autres cas. | Sujets 27 et 42 |
| INT-15 | Six défauts de l'arbre d'accessibilité (valeurs sans nom, rôles manquants, messages réécrits en boucle). | Sujet 38 |
| INT-16 | Les noms accessibles « Ouverture : plus » et « Vitesse : plus » disent l'inverse de la grandeur nommée. | Sujet 38 |
| INT-17 | Sur téléphone émulé, la photo prise s'affiche plus petite que le viseur, et la suivante s'ouvre déjà défilée. | Sujet 2 pour le défilement, Sujet 42 pour le reste |
| INT-18 | Trois repères graphiques sont sous 3:1 de contraste. | Sujet 38 |
| INT-19 | Huit petits défauts de libellés et de structure. | Sujets 13 et 38 |
| INT-20 | Sur téléphone émulé, des fenêtres sont plus hautes que l'écran, avec « Fermer » tout en bas. | Sujet 42 |
| INT-21 | Même défaut que FEX-19 ; s'y ajoute ce qu'il coûte à la routine de test. | Sujet 2 |

Documentation :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| DOC-04 | Trois titres de `CHANGELOG.md` sont datés de la veille de la fusion, et rien ne dit de quoi la date est la date. | Sujet 25 |
| DOC-06 | `docs/questions-ouvertes.md` : sept lignes sont restées en l'état (un en-tête daté du 7 novembre, des points faits ou tranchés écrits comme ouverts, et un point « à confirmer », la règle de la médiane, jamais repris). | Sujet 5 |
| DOC-07 | Trois phrases périmées dans `docs/cadrage.md`, `docs/contenus.md` et `docs/architecture.md`. | Sujet 44, et Sujet 29 pour `docs/architecture.md` |
| DOC-09 | `REPRISE.md` ne dit nulle part qu'il est une archive ; son en-tête dit « Ce fichier fait foi ». | Sujet 45 |
| DOC-11 | Le dossier `content/` manque au tableau « Contenu du dépôt » de `README.md`. | Sujet 43 |
| DOC-12 | « 34 Mo » pour 34 Mio, et « flou de bougé » pour la traînée du chien. | Sujets 5 et 44 |

Licences, scripts et CI :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| LIC-01 | `scripts/check_public.py` ne lit pas ce qu'un commit ajoute et qu'un commit suivant retire : cela reste dans l'historique publié sans contrôle. | Sujet 24 |
| LIC-02 | Des formes courantes de ce que la règle de confidentialité interdit passent le contrôle. | Sujet 24 |
| LIC-03 | Fichiers binaires, noms de fichiers, noms d'auteurs et étiquettes ne sont pas contrôlés, et la documentation ne le dit pas. | Sujet 24 |
| LIC-04 | `scripts/changelog.py check` : une base introuvable passe en silence, et un titre étranger peut tronquer le texte d'un tag. | Sujet 25 |
| LIC-05 | `scripts/check_scenes.py` croit le manifeste de la scène sur parole. | Sujet 47 |
| LIC-07 | Les workflows `tag.yml` et `pages.yml` peuvent être lancés à la main sur une autre branche que `main`. | Sujet 25 |
| LIC-10 | `docs/publication.md` : « même alors, le site publié reste public » est juste, mais la page citée ne le dit pas, et la phrase est trop large d'un cas. | Sujet 46 |

## Plan de corrections

Ce plan est une proposition : Julien tranche l'ordre, le découpage et chaque décision qu'il nomme. Un sujet est une pull request, donc une version, avec sa section de `CHANGELOG.md`. Aucun sujet n'ajoute de fonction au simulateur ; deux ajoutent un outil que leurs constats demandent : la version à l'écran (Sujet 1) et un affichage de diagnostic ouvert par l'adresse (Sujet 28).

**Pour exécuter le plan depuis une session neuve.**
- Lire `CLAUDE.md`, puis `docs/etat-des-travaux.md`, qui dit quels sujets sont faits. De cette page, lire seulement cette introduction, le sujet à faire et les décisions qu'il nomme ; puis, dans son rapport, chaque constat du sujet avec sa contre-vérification : la correction retenue, ses lignes et ses essais y sont.
- Prendre le premier sujet qui n'est pas fait et qui n'attend rien. Un sujet marqué « attend Dn » est sauté tant que la décision manque, et repris dès qu'elle est prise. Quand une décision ne retient qu'une part d'un sujet, le reste part sans elle ; à la réponse, la part retenue fait une petite pull request, ou rejoint le prochain sujet qui touche le même fichier.
- Chaque pull request écrit dans `docs/etat-des-travaux.md` le numéro du sujet fait, sa version, ce qui en reste à faire et le sujet suivant. Une réponse de Julien y est notée avec sa date, et entre dans `docs/historique.md`. Cette page reste la référence du plan : elle ne change que si Julien change le plan.
- Sans réponse de Julien, 31 sujets sur 48 partent entiers et 12 en partie (Sujets 4, 5, 11, 19, 23, 25, 32, 33, 36, 45, 46 et 48). Cinq attendent une décision : les Sujets 20 (D5), 34 (D2), 40 (D10 et D11), 41 (D10) et 42 (D12).

**Ordre, et pourquoi.**
1. D'abord ce qui trompe ou bloque un débutant sur le site publié aujourd'hui : faute visible de l'application, exercice injouable, fiche qui dit autre chose que le simulateur (Sujets 1 à 20), en petits sujets indépendants. Ce que tout débutant rencontre en suivant une fiche (Sujets 6 à 9) passe avant les échecs du chargement (Sujet 10), dont deux sont pourtant classés « faux » : ceux-ci demandent un fichier qui n'arrive pas, un navigateur sans WebGL ou un contexte perdu. À rang égal, le plus court d'abord.
2. Puis le socle qui protège la suite : contrôles des données et de la publication, tests rapides des formules, mesure du coût du viseur (Sujets 21 à 29).
3. Puis les corrections des données et des sources, que ce socle garde, les deux sujets de l'application qui restent (l'accessibilité, pour laquelle le projet n'a pas d'objectif écrit ; la photo interrompue par le plafond de 5 s, dont la correction reste à mettre au point), et les refontes (Sujets 30 à 42). Les corrections de données passent avant les refontes parce qu'elles sont petites, qu'elles ne touchent rien de publié, et que les refontes attendent de toute façon des décisions de Julien et des relevés sur son téléphone.
4. Enfin le ménage de la documentation et des outils (Sujets 43 à 48).

Trois sujets de la première partie ne corrigent pas une faute qui trompe un débutant. Ils passent tôt parce que la suite s'appuie sur eux :
- le Sujet 1 (la version du site à l'écran) : plusieurs sujets sont à confirmer par Julien sur son téléphone, et aujourd'hui rien ne lui dit quelle version il regarde ; la contre-vérification d'ARC-12 veut cette correction seule et en premier (l'audit la mettait dans la pull request de l'affichage de diagnostic), elle tient en quelques lignes et ne touche pas au rendu. Si Julien préfère, les Sujets 1 et 2 s'échangent ;
- le Sujet 4 (la routine de test) : tant qu'il n'est pas fait, une erreur JavaScript laisse la CI verte (INT-06), et c'est sur la CI verte que Claude fusionne ; le rapport de l'interface range INT-05 et INT-06 parmi ses premières corrections, après celles d'une ligne ;
- le Sujet 5 (les pages de reprise) : chaque session neuve repart de `docs/etat-des-travaux.md`, et sa table « Décisions en attente » sera l'endroit où Julien lit ce qui l'attend et où ses réponses sont notées ; l'audit des choix le place en premier, « parce que chaque session suivante lit ces deux pages » (`CLAUDE.md` et `docs/etat-des-travaux.md`), et sa contre-vérification demande seulement d'attendre la fin de l'audit. Il ne bloque aucun autre sujet : si Julien préfère, il redescend dans la quatrième partie.

**Essais de Julien sur son téléphone.** Le site n'est publié qu'à la fusion sur `main` (`CLAUDE.md`) : une pull request ne peut pas être essayée sur un téléphone avant d'être fusionnée. Deux rapports demandent pourtant un essai « avant de fusionner » (COD-01, Sujet 3 ; ARC-01, Sujet 40). Ce plan propose de faire comme pour les versions 0.3.52 et 0.3.53 (`docs/historique.md`) : une version isolée, fusionnée quand la CI est verte, que Julien juge ensuite sur le site publié, au numéro qu'affiche le Sujet 1, et qui s'annule par `git revert -m 1` de son commit de fusion si l'essai échoue. Le plan n'attend pas l'essai pour passer au sujet suivant ; seules attendent le jugement de Julien les fonctions qui s'appuieront sur la refonte du Sujet 40. Chaque essai demandé est noté dans `docs/etat-des-travaux.md`, avec sa version. Julien tranche (D37).

**Arbitrages entre rapports.**
- Refontes : l'audit de l'architecture en proposait neuf, sa contre-vérification en garde cinq. Le plan suit la contre-vérification (Sujet 1 ; Sujets 26 et 27, que le rapport compte pour une seule refonte ; Sujets 28, 40 et 41 ; et la carte de l'application au Sujet 29) ; la décision D10 la soumet à Julien.
- Tests rapides et formules communes : le rapport d'architecture en fait une seule pull request, de grande taille. Le plan la coupe en deux. Le Sujet 26 pose le lanceur et teste le code tel qu'il est : c'est la seule part que les rapports ont essayée, et elle ne change aucune ligne de l'application. Le Sujet 27 sort les formules des fichiers de rendu, sous la garde de ces tests et de la routine. C'est un choix de ce plan.
- Bruit de la loupe (PHY-07, Sujet 18) et développement partagé (ARC-01, Sujet 40) touchent les mêmes fichiers, et aucun rapport ne dit lequel passe d'abord. Le plan met PHY-07 avant : le défaut touche les écrans de densité 2, la correction est locale, et le contrôle qu'elle ajoute à la routine protégera la refonte, qui attend une décision. Si Julien retient la refonte tout de suite, PHY-07 se fait dedans.
- Traînée du sujet : PHY-17 demande une seule formule pour l'indicateur d'équilibre et le bulletin (Sujet 9), ARC-07 demande de sortir les formules dans des modules sans rendu (Sujet 27). Le Sujet 9 passe d'abord, parce que le défaut se voit ; le Sujet 27 déplace ensuite cette formule unique.
- Suspension de l'indicateur d'équilibre (ARC-14) : le rapport d'architecture la plaçait avec l'affichage de diagnostic, une contre-vérification la veut « sans attendre ». Elle va au Sujet 3, avec les deux autres corrections qui portent sur le calcul d'une photo.
- Mesure de la lumière : une contre-vérification la place après le développement partagé et après l'étalonnage de la scène, une autre met l'étalonnage dans la même pull request qu'elle. Les deux se tiennent : c'est une fonction de la file de travail, pas un sujet de correction ; elle vient après le Sujet 40, une fois sourcé le comportement de la mesure d'un boîtier, et l'étalonnage se décide avec elle (D15).
- Champ `used_in` des sources : sa correction (Sujet 34) attend D2, alors que plusieurs sujets ajoutent des entrées à `data/sources.yaml` avant elle (les Sujets 15 et 46 le disent ; c'est vrai de toute entrée ajoutée avant la décision). Ils n'attendent pas : ils suivent la forme en vigueur le jour où ils sont écrits.
- Le rapport des sources demandait un seul passage sur `data/sources.yaml`, en commençant par le champ `used_in` (SRC-03) ; celui du référentiel un seul passage sur `data/` ; celui de sa structure un seul passage sur `scripts/referentiel.py`, `scripts/validate.py` et les schémas (RST-04, RST-02, RST-07, RST-06, RST-03). Le plan les coupe (Sujets 30, 33 et 34 ; Sujets 31 et 32 ; Sujets 22 et 23), parce qu'une part attend une décision et l'autre non, et pour garder chaque sujet à la taille d'une session : `used_in` passe ainsi après les adresses et les libellés, puisqu'il attend D2. La date de lecture des sources (SRC-04) et les champs que `docs/lire-le-referentiel.md` ne décrit pas (RST-11) ont leur propre sujet (33), séparé de `used_in` : leurs rapports ne les lient pas à D2, et les Sujets 35 et 37 en dépendent. C'est un choix de ce plan.
- Documentation : la contre-vérification du rapport sur les choix écrit que ce qui reste de son plan « tient en quatre petites pull requests et deux gestes de Julien ». Le plan y consacre sept sujets (5, 23, 25, 43, 44, 45 et 48), où entrent aussi des constats des rapports sur la documentation, sur la structure du référentiel et sur les licences : ce découpage plus fin est un choix de ce plan, pas des rapports.
- Fichiers communs à plusieurs sujets (`app/src/i18n.ts`, `scripts/test_app.cjs`, `scripts/validate.py`, `data/sources.yaml`, `docs/camera-physique.md`, `docs/pile-technique.md`) : un seul sujet est ouvert à la fois, ils ne se gênent donc pas ; quand un sujet prépare l'autre, c'est écrit sous « Dépend de ».
- Constats qui se recouvrent, traités une seule fois : FEX-19 et INT-21 (Sujet 2) ; FMA-21 et RST-09, qui demandent la même ligne dans la fiche de SIT-01 (Sujet 16) ; FMA-15 et REF-04 (Sujet 31) ; CHX-05, RST-02 et la part d'ARC-07 sur les titres, un seul contrôle (Sujet 23) ; DOC-01, DOC-02 et CHX-01 pour les README (Sujet 43) ; DOC-06, CHX-01 et CHX-10 pour `docs/questions-ouvertes.md` et la table des décisions en attente (Sujet 5) ; DOC-09 et CHX-06 pour `REPRISE.md` (Sujet 45) ; DOC-07 et ARC-09 pour `docs/architecture.md` (Sujet 29) ; PHY-19 et LIC-08 pour les notices de licence (Sujet 46).

**Tests communs** (règles de `CLAUDE.md`, non répétés sous chaque sujet) :
- toute pull request : une branche et une pull request en brouillon dès le premier commit ; `python3 scripts/check_public.py --commits all` ; une section dans `CHANGELOG.md`, contrôlée par `python3 scripts/changelog.py check --base origin/main` ; `docs/etat-des-travaux.md` mis à jour ; la description réécrite aussitôt sans le lien de session ; CI verte sur le dernier commit ; fusion par commit de fusion, puis vérification du tag ; après la fusion, dire à Julien de lancer `/clear` ;
- si elle touche `data/` : `python3 scripts/validate.py` ;
- si elle touche `app/` : `cd app && npm run build`, puis `node scripts/test_app.cjs --photo` (ordinateur, Android, iPhone, WebGL 1), les quatre jobs de la routine verts dans la CI, et, dans la pull request, leurs résultats et ce que ces tests n'émulent pas (ni le processeur graphique ni Safari ; et, tant que la routine n'est pas refaite, aucun toucher : INT-13) ;
- si elle touche `content/` : la CI lance aussi la routine (elle se déclenche sur `content/**` et `data/**`) ; rejouer dans le simulateur chaque exercice ou recette réécrit, puisque c'est en les jouant à la lettre que les rapports ont trouvé les défauts ;
- aucun sujet ne touche `app/public/scenes/` ; s'il en venait un, `python3 scripts/check_scenes.py`.

Sous chaque sujet, « ce qu'il faut faire » résume la correction retenue par la contre-vérification ; le texte exact (phrases des fiches, lignes de code essayées) est sous le constat, dans son rapport. Les numéros de ligne sont ceux des rapports (versions 0.3.56 à 0.3.58 selon le rapport) : à revérifier dans le fichier avant de le modifier, d'autant qu'un sujet antérieur a pu les déplacer.

**Première partie : ce qui trompe ou bloque un débutant aujourd'hui, et trois préalables**

### Sujet 1 · La version du site à l'écran
- Constats : ARC-12.
- À faire : lire à la construction le premier titre de version de `CHANGELOG.md`, par un seul lecteur commun à `app/vite.config.ts` et à `app/scripts/build-pages.mjs` (pas deux expressions régulières), et l'écrire dans le pied de l'accueil, dans la fenêtre des crédits du simulateur et dans la ligne de diagnostic. Ce titre a la forme « ## [X.Y.Z] - date » ; sur une pull request, c'est la version à venir, sur `main`, la version publiée. Relu dans le code pour ce plan : la ligne de diagnostic (`#diagnostic`) n'a de texte qu'en cas de problème, et la routine contrôle qu'elle est vide (« aucun problème affiché ») ; la version s'y ajoute donc au message d'un problème, sans donner de texte à la ligne quand tout va bien.
- Fichiers : `app/vite.config.ts`, `app/scripts/build-pages.mjs`, le lecteur commun (à créer), `app/src/credits.ts` et `app/src/main.ts`.
- Tests : communs à `app/` ; le numéro se retrouve dans le site construit, dans la page de l'accueil et dans le script du simulateur. Le rapport ne demande pas de contrôle de routine.
- Dépend de : rien. Il commence sans attendre Julien, dès la pull request de l'audit fusionnée.
- Taille : petite.

### Sujet 2 · Quatre corrections d'une ligne, dont trois déjà essayées
- Constats : FEX-19 et INT-21 (même défaut), COD-09, COD-14, INT-17 (le défilement gardé seulement).
- À faire : dans `app/src/style.css`, faire clignoter l'indicateur d'exposition par l'opacité (`@keyframes clignote { to { opacity: 0; } }`) et non par `visibility: hidden`, et poser `touch-action: none` sur `.shutter-button` ; dans `app/src/ui/shutter.ts`, appeler `this.dropLoupe()` dans `showWhole` (en retirant l'appel devenu redondant de `showFrame`) et remettre `review.scrollTop` à zéro dans `showCaption`. Deux contrôles de plus dans la routine : deux loupes séparées par « Photo entière » sur une même photo ; après deux photos, le haut de la photo est visible. La remise à zéro du défilement (INT-17) est la seule des quatre corrections qu'aucun rapport n'a essayée.
- Fichiers : `app/src/style.css`, `app/src/ui/shutter.ts`, `scripts/test_app.cjs`.
- Tests : communs à `app/` ; clics et focus sur le bouton pendant qu'il clignote (mode S à 1/4000 s sans ISO auto), tous suivis de l'ouverture de la fenêtre, et un clic pas plus long que le témoin sans clignotement (INT-21) ; doigt glissé sur le déclencheur par le protocole de Chromium, la rafale ne s'arrête qu'au lever du doigt.
- Dépend de : rien. COD-09 est à confirmer par Julien sur son téléphone, après la fusion (D37).
- Taille : petite. Ces quatre corrections n'ont en commun que leur taille : les réunir est un choix de ce plan, pas des rapports.
- Note du 15 novembre 2026 : la remise à zéro du défilement de l'écran de revue (INT-17) est faite dans la version 0.3.59, avec la pull request du Sujet 1. Raison : ce défaut faisait échouer par intermittence un contrôle de la routine dans la CI (profil iphone : la photo, sans hauteur tant qu'elle n'est pas chargée, était poussée hors de l'écran par l'ancrage du défilement de Chromium, ajouté au défilement gardé), et Julien a décidé le 15 novembre que la correction entrait dans cette pull request. Elle est dans `openReview` (`app/src/ui/shutter.ts`), qu'appellent `showCaption` et `showError`. Le contrôle de routine « après deux photos, le haut de la photo est visible » est fait aussi, sous le nom « photo suivante : écran de revue ouvert en haut ». Il reste à ce sujet : FEX-19 et INT-21, COD-09, COD-14, et le contrôle des deux loupes.

### Sujet 3 · Pendant le calcul d'une photo : caméra, toucher du viseur, indicateur d'équilibre
- Constats : COD-01, COD-07, ARC-14.
- À faire : rendre les vues de la photo sans mettre à jour la caméra (`scene.render(false)` aux deux appels de `takePhoto`) et détacher ses commandes le temps du calcul, dans `Shutter.compute`, en les rattachant dans le `finally` ; dans `choosePoint`, ne pas prendre les touchers du viseur quand `panel.isEnabled()` est faux ; dans `balance.ts`, ni rafraîchissement ni lecture pendant un calcul, sans effacer la dernière lecture, et le commentaire de la l. 219 corrigé.
- Fichiers : `app/src/camera/photo.ts`, `app/src/ui/shutter.ts`, `app/src/ui/balance.ts`.
- Tests : communs à `app/` ; ceux des rapports : orientation de la caméra constante à tous les rendus et à la reprise, souris tenue et déplacée, puis doigt posé et écarté (profil Pixel 7 émulé) ; en AF-S, un toucher pendant le calcul laisse le repère inchangé ; aucune lecture de pixels par l'indicateur pendant le calcul, plus d'erreur WebGL.
- Dépend de : rien. Le constat COD-01 demande de refaire l'essai sur un téléphone avant de fusionner, et sa contre-vérification écrit « je ne sais pas » pour un vrai téléphone. Le site n'étant publié qu'à la fusion, le plan propose une version isolée, que Julien essaie ensuite sur le site publié, au numéro qu'affiche le Sujet 1 (D37). Ce que la correction change pour l'utilisateur, d'après la contre-vérification : un doigt resté posé pendant le calcul ne fait plus tourner le viseur tant qu'il n'est pas relevé puis reposé. Reste, sans gravité : le bulletin de la première vue peut être relevé avec l'orientation d'une image plus tard que la photo.
- Taille : petite.

### Sujet 4 · Routine de test : les contrôles qui disent vert à tort
- Constats : INT-05, INT-06, INT-13 (deux phrases).
- À faire : contrôler le réglage de départ de la mise au point juste après le chargement, corriger l'en-tête de la routine (« AF-S ») et renommer le contrôle existant ; à la fin de chaque profil, un contrôle « aucune erreur de la page ni de la console » et une seconde lecture du diagnostic (la liste des erreurs admises part de zéro : la contre-vérification n'en a relevé aucune jusqu'au chargement, et la suite du scénario est à établir sur un passage de la CI) ; corriger la phrase de l'en-tête qui annonce « le toucher ». Au passage, une ligne gardée d'un constat réfuté (voir « Constats réfutés ») : le message de la l. 69, « Playwright est introuvable », nomme la version à installer.
- Fichiers : `scripts/test_app.cjs` ; `CLAUDE.md` pour la même phrase, après accord (D6).
- Tests : la routine sur les quatre profils ; une erreur JavaScript injectée dans la page doit donner un échec et un code de sortie non nul.
- Dépend de : rien ; D6 pour la ligne de `CLAUDE.md`. Il n'a pas à attendre le Sujet 3 : l'erreur WebGL d'ARC-14 est un avertissement, que la routine ne retient pas.
- Taille : petite.

### Sujet 5 · Pages de reprise : un seul état, une table « Décisions en attente »
- Constats : CHX-10, DOC-06, CHX-01 (les journaux), DOC-12 (une ligne de `docs/questions-ouvertes.md`).
- À faire : `docs/etat-des-travaux.md` réécrit, pas complété : un seul état, une seule file, sans récit. La file devient la liste des sujets de ce plan, par leur numéro, avec leur état et leur version, puis les fonctions qui suivent le plan. S'y ajoute une table « Décisions en attente » (la question, sa date, la page du détail, ce qui se passe sans réponse) où entrent les trois attentes anciennes, celles du 12 novembre que relève CHX-10, les 37 décisions de cette page, chacune par son numéro, et les essais demandés à Julien sur son téléphone, avec leur version ; une décision prise sort de la table et entre dans `docs/historique.md` ; `docs/questions-ouvertes.md` réduit à ce qui est ouvert, par la revue ligne par ligne de DOC-06 ; les autres pages renvoient à la table et n'écrivent plus « à confirmer » ; la phrase « comprise comme "les trois" » sur les boîtiers (`docs/camera-physique.md`, l. 13) mise à jour, puisque Julien a relevé leurs fiches le 11 novembre. Règle pour la suite : `CHANGELOG.md` est le seul récit par version, `docs/historique.md` ne reçoit que les décisions de Julien, datées et citées. Au passage, dans `docs/etat-des-travaux.md`, ce que les contre-vérifications renvoient à sa réécriture sans en faire des constats, parce que ces lignes sont du 12 novembre ou d'après : la phrase sur les commits qui « n'étaient pas signés » (voir « Constats réfutés »), l'accord de Renderpeople tourné en question plutôt qu'en fait acquis (D35), et les deux derniers points de DOC-12 (un état « Écrit » qu'aucune ligne ne porte ; `docs/historique.md`, l. 206, et `docs/etat-des-travaux.md`, l. 13, qui ne disent pas la même chose de la limite d'usage du 13 novembre). Dans `docs/questions-ouvertes.md`, l. 65, la phrase sur SunCalc suit la correction de SRC-02 (« figer la version étiquetée du jour de l'usage », sans numéro de version) : la page est revue ici, autant ne pas y revenir au Sujet 30.
- Fichiers : `docs/etat-des-travaux.md`, `docs/questions-ouvertes.md`, `docs/historique.md`, `docs/camera-physique.md` (l. 13 et 76), `docs/propositions.md` ; `CLAUDE.md` pour la table « quelle page pour quelle information », après accord (D6).
- Tests : communs ; refaire la recherche de l'audit (« à confirmer », « comprise comme », « lecture de Claude », « à trancher ») et vérifier que chaque résultat est dans la table ou n'est pas une attente.
- Dépend de : la fusion de la pull request de l'audit ; D6 pour la table de `CLAUDE.md` ; D14 pour la l. 40 de `CLAUDE.md` et la l. 83 de `docs/questions-ouvertes.md`, qui ne changent pas avant.
- Taille : moyenne.

### Sujet 6 · SIT-06 : la mise au point qui suit le chien
- Constats : FMA-23, FMA-19.
- À faire : dans le code, d'après le troisième agent : préparer les squelettes avant le rendu de la carte de profondeur du viseur (`skeleton.prepare(true)` sur `scene.onBeforeRenderTargetsRenderObservable` ; essayé par injection dans la page, sans toucher au code ; coût : les os des squelettes calculés deux fois par image), lire 3 × 3 pixels autour de l'œil et retenir la surface la plus proche de lui, ne pas déplacer les points des yeux. Dans la routine : un contrôle que la détection ne lâche pas le chien à découvert. Dans la fiche de SIT-06, en français et en anglais : la recette dit que la mise au point suit le chien tant que sa tête est visible et dans la zone couverte par l'autofocus, et saute au sujet le plus proche quand il passe derrière le groupe ; la section « Défi » dit que le défi ne juge pas si le chien est caché. Relire ensuite les l. 385, 388 et 403 de `docs/camera-physique.md`, qui décrivent ce comportement : les rapports les citent sans écrire leur correction.
- Fichiers : `app/src/camera/faces.ts`, `app/src/camera/autofocus.ts`, `scripts/test_app.cjs`, `content/fr/situations/SIT-06.md`, `content/en/situations/SIT-06.md`, `docs/camera-physique.md`.
- Tests : communs à `app/` et à `content/` ; refaire les mesures du troisième agent (détection à découvert, horloge libre). Elles restent en rendu logiciel.
- Dépend de : rien. Juger dans le défi si le chien est visible (D19) vient après ce sujet, pas dedans.
- Taille : moyenne. Si la session est courte, la phrase de la recette part seule d'abord : elle reste vraie après la correction du code.

### Sujet 7 · Fiches d'exposition : des exercices jouables à la lettre
- Constats : FEX-02, FEX-01, FEX-05, FEX-06, FEX-13, FMA-13, FEX-17.
- À faire, en français et en anglais : dire en tête de la section « Simulateur » de EXP-04, EXP-05 et EXP-06 que l'ISO auto est activé au départ et où le désactiver, sans changer cet état de départ, qui est celui du Z 6 ; écrire les valeurs que l'indicateur affiche vraiment (−0,2 IL, +0,8 IL) ; réécrire l'exercice de EXP-06 (la réponse, où viser, deux comparaisons annoncées) ; écrire en entier les réglages des exercices de MES-04, MES-10 et BOI-08, et, pour BOI-12, renvoyer à la recette de SIT-06 que l'exercice cite déjà, pas à l'exercice de BOI-08 comme le proposait l'audit ; écrire « Avec le boîtier de départ (Nikon Z 6) et le 50 mm » et les vitesses qui valent en APS-C (FEX-13 et FMA-13, ensemble) ; « f/2 ou davantage ».
- Fichiers : `content/fr/notions/` et `content/en/notions/` : EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08, BOI-12, MVT-01.
- Tests : communs à `content/`.
- Dépend de : rien. Pour FEX-05, les deux comparaisons proposées par l'audit ne contiennent que des rapports calculés (« ne bouge presque pas », « divisé par environ 4,5 »), que la contre-vérification retrouve en rendu logiciel sur un point immobile du sol (58:1, puis 50:1, puis 13:1) : elles s'écrivent sans attendre. Une valeur lue du rapport signal sur bruit ne s'écrit dans la fiche qu'après un relevé sur le point visé retenu, que l'audit demande dans un navigateur avec processeur graphique : l'environnement de Claude n'en a pas, ce relevé revient donc à Julien, sur son téléphone ; sans lui, la fiche ne cite aucune valeur lue. Si D5 est tranchée, l'appliquer dans la même passe.
- Taille : moyenne.

### Sujet 8 · Fiches de mise au point : exercices et recettes qui échouent ou n'annoncent pas ce qu'ils montrent
- Constats : FMA-16, FMA-01, FMA-11, FMA-22, FMA-03, FMA-02, FMA-08, FMA-17.
- À faire, en français et en anglais : NET-06, retoucher l'œil après avoir déplacé l'appareil ; MAP-04, un exercice qui nomme le défi et le mode, et qui dit ce qu'il montre vraiment dans le parc, avec, dans « Simulateur », la phrase sur la photo prise en AF-S sans avoir touché le viseur (FMA-01, FMA-11) ; MAP-09, ce que fait TutoPhoto en AF-S et en AF-C (part « fiche » de FMA-22) ; SIT-05 et MAP-05, la règle de la zone large dite comme celle de TutoPhoto ; MAP-06, « Les collimateurs ne couvrent que cette zone », puis le recadrage ; trois formulations (FMA-08 ; pour MAP-05, seulement préciser « en cadre horizontal » : donner une réponse à la dernière question est un choix de rédaction, pas une faute) ; la phrase « Le défi ne juge ni l'exposition ni le bruit : lis aussi la ligne « Exposition » du bulletin », dans les trois fiches de situation ou dans la note de la fenêtre « Défis ». Ajouter à `data/sources.yaml` la page « The Sub-Selector » du manuel du Z 6 (« Focus Lock »).
- Fichiers : `content/fr/` et `content/en/` : MAP-04, MAP-05, MAP-06, MAP-09, NET-06, LUM-02, SIT-01, SIT-05, SIT-06 ; `data/sources.yaml` ; `app/src/i18n.ts` si la phrase va dans la note de la fenêtre « Défis ».
- Tests : communs à `data/` et à `content/` ; à `app/` si `i18n.ts` change.
- Dépend de : rien. Les changements du simulateur que ces constats évoquent (D18, D20, D26) n'en font pas partie.
- Taille : moyenne.

### Sujet 9 · Vue de dessus et indicateur d'équilibre : juger les mêmes points que le bulletin
- Constats : FMA-12, PHY-17.
- À faire : `topView.ts` juge les personnages et le chien sur leurs yeux, comme le bulletin, et garde la position au sol pour le dessin ; écrire la règle du cercle commun à deux personnages (vert si les deux sont dans la zone nette). `balance.ts` calcule la traînée à la position du sujet, par la fonction de `bulletin.ts` : une seule formule. Pour la recherche du sujet visé : la profondeur lue sous le point dans la carte du viseur, ou la recherche actuelle gardée et sa limite écrite ; ne pas chercher « le long du rayon », comme le proposait l'audit (faux positif).
- Fichiers : `app/src/ui/topView.ts`, `app/src/ui/balance.ts`, `app/src/camera/bulletin.ts`, `docs/camera-physique.md`.
- Tests : communs à `app/` ; rejouer l'essai de FMA-12 (85 mm, f/1,4, défi SIT-05 : la vue de dessus et le bulletin disent la même chose) et le cas de PHY-17 (AF-S verrouillé sur un personnage, puis recadrage sur le chien).
- Dépend de : le Sujet 3 d'abord (même fichier `balance.ts`).
- Taille : moyenne.

### Sujet 10 · Échecs dits à l'écran : fichier d'éclairage perdu, WebGL absent, contexte perdu
- Constats : COD-06, COD-11, COD-12 ; COD-13 pour un commentaire faux de `scene.ts` (l. 77).
- À faire : COD-06, l'essentiel d'abord : le fichier d'éclairage attendu par `ready`, pour retrouver « La scène n'a pas pu être chargée. », et les deux attentes de `scene.whenReadyAsync()` de `takePhoto` bornées ; ensuite : nommer le fichier en échec, proposer « Recharger », ne compter un fichier comme reçu que s'il l'est (garde de la contre-vérification : quand le navigateur ne donne aucun des champs lus, garder la règle actuelle, sinon la progression resterait à zéro ; si Safari les donne : je ne sais pas), écrire dans la fenêtre « Crédits » que le manifeste manque. Ne pas griser le déclencheur. COD-11 : `#scene[hidden] { display: none; }` et masquer les éléments du viseur, les deux ensemble, avec un contrôle de routine (le texte du message est lisible). COD-12 : un message à la perte du contexte, et la texture d'éclairage recréée à sa restauration.
- Fichiers : `app/src/scene.ts`, `app/src/main.ts`, `app/src/camera/photo.ts`, `app/src/style.css`, `app/src/i18n.ts`, `app/src/credits.ts`, `scripts/test_app.cjs`.
- Tests : communs à `app/` ; requête du fichier d'éclairage coupée (message, page qui ne se fige plus au déclenchement) ; `getContext` qui rend `null` ; contexte perdu puis restauré (rapports de luminosité revenus à 1).
- Dépend de : rien. COD-12 est à confirmer par Julien sur son téléphone, après la fusion (D37), et peut partir à part si la session est courte : sa correction n'est essayée que dans Chromium en rendu logiciel, et la cause de l'écart d'éclairage reste inconnue.
- Taille : moyenne.
- Note du 15 novembre 2026 : depuis la version 0.3.59, le message d'un chargement en échec et le texte du message d'un navigateur sans WebGL sont suivis de la version (« La scène n'a pas pu être chargée. Version du site : X.Y.Z. », demande de Julien). COD-11 reste entier : le message d'un navigateur sans WebGL n'est toujours pas visible à l'écran (mesuré de nouveau ce jour-là). Les tests de ce sujet qui lisent ces messages comptent avec la version.

### Sujet 11 · Écran de revue, loupe et retardateur : ce qui reste actif pendant un calcul
- Constats : COD-08, COD-02, COD-05, COD-04 ; COD-13 pour trois petits défauts du déclencheur.
- À faire : un numéro de la vue affichée, comparé à la reprise de `magnify`, pour jeter une loupe dont la vue a changé ; pas de loupe pendant un compte à rebours ; le détail de l'erreur gardé et ajouté à la légende d'une rafale tronquée, et, quand `showError` n'a pas de photo nouvelle, l'image et la série précédentes masquées ; le résumé des réglages fabriqué dans la langue courante ; le déclencheur limité au bouton principal de la souris ; pendant une rafale tenue, le texte du bouton réécrit seulement quand le nombre de vues change, et plus de relevé d'orientation au-delà de la dernière vue possible (justes, sans urgence). Pour le texte remis un instant par défaut au changement de langue, le rapport n'écrit aucune correction.
- Fichiers : `app/src/ui/shutter.ts`, `app/src/ui/cameraPanel.ts`, `app/src/i18n.ts`.
- Tests : communs à `app/` ; les cas des rapports, par des gestes programmés dans la page : loupe puis « Revenir au viseur », « Vue suivante » ou « Photo entière » pendant le calcul ; retardateur puis loupe ; rafale dont une vue échoue ; changement de langue après une photo ; clic droit. D'après les rapports, la routine ne joue ni le retardateur, ni le bouton de langue du simulateur, ni plus d'une loupe par photo (INT-14, COD-14).
- Dépend de : D1 pour l'annulation du retardateur par un second appui, et pour elle seule.
- Taille : moyenne.

### Sujet 12 · Adresse et mémoire : `?lang=` et `?defi=`
- Constats : COD-03 ; COD-13 pour un commentaire orphelin de `challenges.ts`.
- À faire : retirer chaque paramètre de l'adresse une fois lu et mémorisé (`history.replaceState`), paramètre par paramètre, et mémoriser la langue donnée par l'adresse ; même ligne dans le script de l'accueil. Le constat signale la même mécanique dans l'activité de LUM-02, sans écrire de correction pour elle : ce plan la traite de même.
- Fichiers : `app/src/i18n.ts`, `app/src/ui/challenges.ts`, `app/scripts/build-pages.mjs`, `app/src/activities/lum02.ts`.
- Tests : communs à `app/` ; le chemin de la contre-vérification (arrivée par `simulateur/?lang=fr&defi=SIT-05`, autre choix dans la page, rechargement ; accueil ouvert avec `?lang=en`, puis aller et retour vers le simulateur).
- Dépend de : rien.
- Taille : petite.

### Sujet 13 · Textes du simulateur et des pages : tutoiement, ancre en double, libellés
- Constats : INT-07, INT-01, INT-19 (points 1 à 5) ; COD-13 pour une clé de texte sans emploi.
- À faire : tutoyer les sept textes français du simulateur ; donner au bloc anglais de l'accueil un identifiant propre, et faire échouer `checkLinks` quand un identifiant est porté par deux éléments ; un titre de page propre au simulateur, un seul mot anglais pour « traînée », les noms français des réglages de Sony et de Nikon, « {pct}% », une seule orthographe anglaise ; retirer la clé `meter`.
- Fichiers : `app/src/i18n.ts`, `app/scripts/build-pages.mjs`, `app/simulateur/index.html`, `app/src/activities/lum02.ts`, `scripts/test_app.cjs`.
- Tests : communs à `app/`.
- Dépend de : rien. Le rapport ne dit pas quelle orthographe anglaise retenir, britannique ou américaine : à proposer dans la pull request.
- Taille : petite.

### Sujet 14 · Activité de LUM-02 : pénombre hors du mur, légende, lisibilité du schéma
- Constats : FMA-10, INT-02.
- À faire : quand la pénombre dépasse le mur dessiné, l'écrire (« au-delà du mur dessiné ») ou borner le curseur à 55 cm ; sans ombre pleine, retirer « ombre pleine au centre » de la légende ; une phrase sur ce que le schéma ne simule pas, dans la page seulement (le moins utile des trois points, d'après la contre-vérification) ; une source bordée d'un contour sombre et large de quelques pixels, sans toucher à sa hauteur ; des rayons à 3:1 de contraste au moins ; « source », « objet », « mur » écrits dans le dessin.
- Fichiers : `app/src/activities/lum02.ts`, `app/src/activities/lum02.css`, `app/activites/LUM-02/index.html`.
- Tests : communs à `app/` ; la page aux positions des curseurs que cite FMA-10, dans les deux langues ; contrastes recalculés.
- Dépend de : rien.
- Taille : petite.

### Sujet 15 · Fiches d'exposition : limites du simulateur, formulations, liens vers les sources
- Constats : FEX-03, FEX-04, FEX-07, FEX-08, FEX-09, FEX-11, FEX-12, FEX-14.
- À faire, en français et en anglais : EXP-06, la limite d'ISO 6400 dite comme un choix ; BOI-12, les liens vers « Specifications » et « Defaults », et « jusqu'à environ 12 vues par seconde » ; EXP-05 et BOI-07, les limites de TutoPhoto distinguées de celles du Z 6 (chiffre corrigé par la contre-vérification : à f/1.4, la vitesse clignote dès ISO 160, pas ISO 200 ; ou ne pas donner de seuil) ; MES-10, « le mode P n'est pas simulé », et, pour les autres écarts au référentiel, une ligne par écart dans la table « Décisions en attente » de `docs/etat-des-travaux.md` (Sujet 5), pas de phrase de suivi dans les fiches (FEX-08) ; MES-04, la cellule qui mesure partout la même chose ; un seul nom, « l'indicateur d'exposition », aussi dans la note `previewNote` de l'interface, « magnifier » à la place de « loupe » dans la fiche anglaise de EXP-06, les titres exacts des deux pages de Nikon, les liens vers les pages françaises du manuel (FEX-11) ; trois retouches (FEX-12) ; MES-10, la vitesse minimale de l'ISO auto et « le bas de la plage normale », aussi dans `exposureModes.ts` et dans `docs/camera-physique.md` (FEX-14).
- Fichiers : fiches EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07 et BOI-12, dans les deux langues ; `data/sources.yaml` ; `docs/camera-physique.md` ; `app/src/camera/exposureModes.ts` ; `app/src/i18n.ts` ; `docs/etat-des-travaux.md`.
- Tests : communs à `data/`, à `content/` et à `app/`.
- Dépend de : rien pour écrire. Les lignes `used_in` de FEX-04 et de FEX-11 suivent D2 si elle est tranchée. Les cinq écarts de FEX-08 attendent ensuite D17.
- Taille : moyenne.

### Sujet 16 · Fiches de mise au point et situations : limites à dire et compléments
- Constats : FMA-04, FMA-07, FMA-18, FMA-21, RST-09 (la ligne de SIT-01).
- À faire, en français et en anglais : NET-06, le fond photo ne change pas de perspective quand l'appareil se déplace ; SIT-01, une ligne « Lumière » dans la recette ; la phrase « pour voir la profondeur de champ jouer », après la recette de SIT-05 et non parmi ses réglages, ou dans l'exercice de NET-01 ; dans `docs/contenus.md`, la règle de la section « Notions » (les notions clés, puis toute notion que la recette cite), et trois codes à ajouter : BOI-07 et MAP-04 dans SIT-01, MAP-09 dans SIT-06. BOI-07 dans SIT-01 est la ligne que demande aussi RST-09 : la page de BOI-07 y gagne sa section « Situations ».
- Fichiers : fiches NET-06, SIT-01, SIT-05 (ou NET-01) et SIT-06, dans les deux langues ; `docs/contenus.md`.
- Tests : communs à `content/` ; `python3 scripts/coverage.py` donne les mêmes comptes.
- Dépend de : rien. La règle de couverture elle-même attend D27.
- Taille : petite.

### Sujet 17 · Notes de l'interface et documentation du modèle : ce qui est annoncé à tort, périmé ou non dit
- Constats : PHY-01, PHY-03, PHY-06, PHY-08, PHY-09, PHY-10, PHY-11, PHY-12, PHY-19 et PHY-21, pour leur part de documentation et de notes ; une phrase pour ARC-10 et une pour INT-12.
- À faire : dans `app/src/i18n.ts`, en français et en anglais : les réglages par défaut du Z 6 dits comme tels (`releaseNote`, PHY-09), la cellule qui donne la même valeur quel que soit le cadrage (`exposureNote`, PHY-12), la diffraction non simulée (`lensNote`, PHY-11 : avec le résultat du calcul, une tache de 23 à 30 µm à f/22, soit 4 à 5 photosites du Z 6, et non « un vrai objectif perd du piqué », qui n'est la citation d'aucune page lue). Dans `docs/camera-physique.md` : pas de filé, l'appareil reste immobile pendant chaque pose (PHY-01) ; le viseur sans flou de mouvement dit comme un choix de TutoPhoto (PHY-03) ; le passage sur la scène « mise à l'échelle » réécrit d'après ce que fait le code (PHY-06 ; le rapport de l'éclairage au fond vaut 2,11 pour l'audit et 1,96 pour la contre-vérification, selon le choix des pixels : seul l'ordre de grandeur, environ 1 IL, tient) ; le plafond du flou écrit en pixels calculés et en millimètres de capteur, les mesures datées « densité 1 » (PHY-08) ; cinq phrases périmées (PHY-10) ; la diffraction et la mesure de la lumière dans les listes « non simulé » ; « boucle reprise de l'algorithme de Gustafsson, tel que le reproduit l'exemple 45-bokeh de bgfx » à la place de « sans copie » (PHY-19) ; ce que devient une photo interrompue par le plafond de 5 s, et le fait que ce plafond n'a pas borné la durée du calcul en rendu logiciel (PHY-21) ; l. 521, les critères d'un défi sont calculés sur la géométrie de la scène, pas « sur la photo » (ARC-10) ; l. 105, « vertical si la zone du viseur est plus haute que large » (INT-12).
- Fichiers : `docs/camera-physique.md`, `app/src/i18n.ts`.
- Tests : communs à `app/`.
- Dépend de : rien. Les phrases de PHY-12, comme celle de FEX-09 au Sujet 15, sont provisoires : elles partiront avec la mesure de la lumière. `lensNote` suit aussi D5.
- Taille : moyenne. Si la session est courte, les trois notes de l'interface partent d'abord : elles seules se voient à l'écran.

### Sujet 18 · Loupe du viseur à densité 2 : le bruit
- Constats : PHY-07 ; PHY-08 pour le plafond du flou, seulement si D25 le décide après une mesure sur téléphone.
- À faire : mesurer d'abord le bruit de la loupe à densité 2 dans un navigateur (le constat est un calcul ; la mesure se fait dans Chromium, à densité 2 émulée, en rendu logiciel) ; puis, quand la loupe grossit, tirer le bruit sur la grille des pixels CSS ; sans loupe, ne rien changer. Corriger la l. 239 de `docs/camera-physique.md`, et ajouter la mesure à la routine.
- Fichiers : `app/src/ui/cameraPanel.ts`, `app/src/camera/noise.ts`, `docs/camera-physique.md`, `scripts/test_app.cjs`.
- Tests : communs à `app/` ; bruit mesuré à densité 1 (inchangé) et à densité 2.
- Dépend de : la mesure préalable ; le Sujet 17 d'abord (même documentation).
- Taille : moyenne.

### Sujet 19 · Termes de Canon et de Sony : une phrase par fiche, une phrase dans la fenêtre du boîtier
- Constats : FEX-15, FMA-14, INT-10.
- À faire (la phrase de la fenêtre attend D3 et D4) : une phrase par fiche (BOI-07, BOI-08, BOI-12, MAP-04, MAP-05, MAP-06, MAP-09, dans les deux langues) avec les termes de Sony et de Canon relevés par les rapports, et la réserve sur le manuel de Canon lu, celui de l'EOS 850D et non ceux des boîtiers du simulateur ; une phrase dans la fenêtre « Boîtier de référence » ; les sources de Canon dans `data/sources.yaml`. Dans la même modification, ne changer ni les lettres M, A et S de la fenêtre « Exposition », ni les libellés de la fenêtre « Mise au point », ni le titre « Collimateurs ».
- Fichiers : les quatorze fiches, `app/src/i18n.ts`, `app/simulateur/index.html`, `data/sources.yaml`.
- Tests : communs à `data/`, à `content/` et à `app/`.
- Dépend de : D3 et D4 pour la phrase de la fenêtre « Boîtier de référence », que le constat INT-10 laisse « au choix de Julien ». Les phrases des fiches ne sont posées comme une question par aucun des deux rapports : leurs contre-vérifications les jugent proportionnées, avec la réserve sur le manuel de Canon.
- Taille : moyenne.

### Sujet 20 · Écriture des ouvertures en français
- Constats : FEX-16.
- À faire (attend D5) : une seule écriture dans les fiches françaises et dans l'interface, la note `lensNote` comprise.
- Fichiers : selon le choix, cinq fiches françaises (EXP-04, BOI-08, MAP-06, NET-01 et SIT-06 : quatorze écritures) ou `app/src/ui/cameraPanel.ts` ; `app/src/i18n.ts`.
- Tests : communs à `content/` ou à `app/`.
- Dépend de : D5. Si elle est tranchée avant les Sujets 7 et 8, ce sujet se fond en eux.
- Taille : petite.

**Deuxième partie : le socle qui protège la suite**

### Sujet 21 · Construction des pages : identifiants `SIT-V2-NN` acceptés, fiche vide refusée
- Constats : RST-01, RST-13.
- À faire : corriger les cinq expressions qui lisent un identifiant de fiche, trois dans `build-pages.mjs` et deux dans `ficheDialog.ts` (ces deux-là oubliées par l'audit, ajoutées par la contre-vérification), « de préférence avec une seule expression partagée » par les deux fichiers, et `schemas/relecture.schema.json` qui accepte les deux formes ; les identifiants ne changent pas. Dans `scripts/coverage.py`, une situation est rédigée quand sa fiche a une section « Recette » (« Recipe ») non vide ; dans `build-pages.mjs`, une fiche sans section, ou avec une section vide, arrête la construction en nommant le fichier ; `docs/contenus.md`, l. 37, le dit.
- Fichiers : `app/scripts/build-pages.mjs`, `app/src/ui/ficheDialog.ts`, `schemas/relecture.schema.json`, `scripts/coverage.py`, `docs/contenus.md`.
- Tests : communs à `app/` et à `data/` ; sur une copie : une fiche `SIT-V2-02` se construit, `XYZ-98` reste refusé, une fiche réduite à son titre arrête la construction ; `coverage.py` inchangé. Pour `ficheDialog.ts`, un essai dans un navigateur, que le rapport n'a pas fait.
- Dépend de : rien. À faire avant l'étape 7 de la file de travail (situations jouables dans le parc, dont SIT-V2-02 et SIT-V2-06), qui échouerait à la construction.
- Taille : petite.

### Sujet 22 · Contrôles du référentiel : clés en double, doublons de listes, niveaux
- Constats : RST-04, RST-07, RST-06.
- À faire : dans `scripts/referentiel.py`, un chargeur YAML qui refuse une clé déjà vue, avec le fichier et la ligne, et qui redonne le chemin du fichier sur une erreur de lecture ; `"uniqueItems": true` à six endroits des schémas, et un contrôle par la fonction `duplicates` pour le champ `situations` d'une notion ; un écart de niveau sans note, et un `level` au-dessus de `level_max`, deviennent des erreurs. La dérogation par `notes` reste.
- Fichiers : `scripts/referentiel.py`, `scripts/validate.py`, `schemas/domaine.schema.json`, `schemas/situations.schema.json`, `schemas/jalons.schema.json`.
- Tests : `python3 scripts/validate.py` sans erreur ni avertissement sur le dépôt tel quel ; les fautes des essais du rapport, refaites sur une copie, sont refusées avec un message qui nomme l'endroit ; `coverage.py` inchangé.
- Dépend de : rien.
- Taille : petite à moyenne.

### Sujet 23 · Contrôles des fiches et des identifiants : fiche sans notion, titres, identifiant disparu
- Constats : RST-02, CHX-05, RST-03, RST-05 ; la part d'ARC-07 qui porte sur les dix titres de `challenges.ts`.
- À faire : dans `scripts/validate.py`, un seul contrôle `check_content` : tout fichier de `content/<langue>/notions/` porte l'identifiant d'une notion du référentiel, tout fichier de `content/<langue>/situations/` celui d'une situation, et un identifiant retiré donne un message qui le dit ; la ligne 1 de chaque fiche française porte le titre du référentiel ; les dix titres de `app/src/ui/challenges.ts` sont ceux de `data/`, dans les deux langues. Une option `--base REF` : tout identifiant présent dans la base est encore dans le référentiel ou dans `retired.yaml` ; avec elle, les deux contrôles du champ `since` (RST-05). Dans `.github/workflows/validate.yml`, remonter le `git fetch` avant `validate.py` ; la base se lit par `git show REF:fichier`, comme le fait `scripts/changelog.py`, sans seconde copie du dépôt.
- Fichiers : `scripts/validate.py`, `.github/workflows/validate.yml`.
- Tests : `validate.py` sans erreur sur le dépôt (les 22 fiches françaises et les dix titres passent aujourd'hui) ; sur une copie, refus d'une fiche `XYZ-99`, d'une fiche `MAP-13` (identifiant retiré), d'une fiche `EXP-01` rangée sous `situations/`, de `RET-14` renommée, de `RET-15` supprimée, d'un titre changé à la main.
- Dépend de : le Sujet 22 d'abord (mêmes scripts). Le contrôle des titres anglais des fiches attend D7 : « pour l'anglais, écrire d'abord la règle », dit la contre-vérification de CHX-05.
- Taille : moyenne.

### Sujet 24 · `scripts/check_public.py` : lire ce que chaque commit ajoute
- Constats : LIC-01, LIC-02, LIC-03.
- À faire : appliquer le contrôle aux lignes ajoutées par chaque commit de la plage, avec une liste de tolérances (commit et type de problème) où est inscrit le commit `e89680d`, seul cas de tout l'historique et déjà consigné ; trois motifs de plus (identifiant de session seul, sous-domaine Notion, « BLOCK » dans le motif de clé privée) ; les noms d'auteurs et les chemins des fichiers passés au contrôle ; dans `docs/publication.md`, ce que le script ne lit pas (fichiers binaires, UTF-16, étiquettes), le fait que l'adresse postale n'est contrôlée par aucun script, et la règle sur les images telle que la contre-vérification de LIC-03 la borne : une image faite par le projet (capture, photo de Julien) est d'abord vidée de ses métadonnées ; les fichiers de tiers des scènes restent identiques à leur origine. Au passage, deux retouches gardées d'un constat réfuté (voir « Constats réfutés »).
- Fichiers : `scripts/check_public.py`, `scripts/check_public_historique.txt`, `docs/publication.md`.
- Tests : communs ; `check_public.py --commits all` rend 0 problème sur tout l'historique ; sur un clone hors du dépôt, avec des valeurs fabriquées : un fichier ajouté puis retiré est signalé, les formes retenues sont arrêtées, les lignes existantes qui décrivent la fuite passent toujours.
- Dépend de : rien. Ne pas reprendre les deux motifs que la contre-vérification abandonne (session sans schéma, secret sans guillemets) : ils refusent des fichiers existants. Pour les secrets, elle s'en remet à gitleaks, dont elle a lu la configuration sans l'exécuter ; deux limites qu'elle écrit : un en-tête « Authorization: Token » hors d'une commande `curl` échappe aux deux contrôles, et gitleaks ne tourne que dans la CI, donc après l'envoi du commit.
- Taille : moyenne.

### Sujet 25 · Pose des tags et contrôle du changelog
- Constats : LIC-07, LIC-04, DOC-04, CHX-10 (les trois tags).
- À faire : `if: github.ref == 'refs/heads/main'` sur le job `tag` de `tag.yml` et sur le job `build` de `pages.yml` ; dans `scripts/changelog.py check`, une erreur « base introuvable », puis une erreur pour toute ligne « ## » placée après le premier titre de version et qui n'est pas un titre de version (les contrôles de numérotation, de rubriques et de lien sont facultatifs) ; dans l'en-tête de `CHANGELOG.md`, « la date est celle du jour où la section est écrite ; la date de la fusion est celle du tag », sans redater les trois titres ; pour les tags `v0.2.0`, `v0.2.1` et `v0.2.2`, ce que D8 décide.
- Fichiers : `.github/workflows/tag.yml`, `.github/workflows/pages.yml`, `scripts/changelog.py`, `CHANGELOG.md`.
- Tests : communs ; sur un clone : base au nom mal écrit, code de sortie non nul ; « ## Notes » dans une section, erreur ; les sections actuelles passent. La condition des deux workflows ne se vérifie qu'après la fusion, par le tag, la release et la publication de cette version même.
- Dépend de : D8 pour les trois tags ; le reste part sans.
- Taille : petite.

### Sujet 26 · Tests rapides des formules : le lanceur, la CI, le code tel qu'il est
- Constats : ARC-05.
- À faire : des tests en TypeScript dans `app/tests/`, lancés par le lanceur de Node.js 22 (`npm test`, et le job `app` de la CI), sans autre dépendance que `@types/node` (à prendre à la version majeure 22, celle du Node.js de la CI, pas à la 26 que citait l'audit), avec le petit fichier qui ajoute leur extension aux imports. Ils sont écrits sur le code actuel, sans le modifier, pour les modules qui se chargent déjà sans navigateur : `exposure.ts`, `exposureModes.ts`, `sharpZone.ts`, `histogram.ts`, `bodies.ts`, `viewfinder.ts` et `bulletin.ts`. C'est l'essai que les deux agents ont fait : cinq ou six tests réussis en moins d'une demi-seconde. `noise.ts` ne se charge pas ainsi, la classe du viseur étant dans le même fichier que la formule du bruit : il attend le Sujet 27. Fixer dans `app/package.json` la version minimale de Node.js à celle essayée.
- Fichiers : `app/tests/` (à créer), `app/package.json`, `.github/workflows/validate.yml` (job `app`).
- Tests : `npm test` ; communs à `app/`.
- Dépend de : rien. Vérifier la licence de `@types/node` (MIT d'après le registre npm, lu le 13 novembre 2026). Repli de l'audit si le fichier de résolution ou la version de Node.js posent problème : Vitest (MIT d'après le registre npm, non essayé), dont les dépendances seraient à vérifier une à une.
- Taille : petite.

### Sujet 27 · Formules communes, sorties des fichiers de rendu
- Constats : ARC-07 ; INT-14 pour les contrôles de calcul de la routine.
- À faire : sortir les formules des fichiers de rendu vers `camera/optics.ts` et `camera/noiseModel.ts`, en commençant par ce qui peut diverger sans bruit (la traînée, la loi du bruit en TypeScript, les nombres 1500 et 500), avec un test rapide pour chaque fonction sortie. Ensuite seulement, porter vers ces tests les contrôles de calcul de la routine (pénombre de LUM-02, positions des grilles, sommes des histogrammes). Aucun changement de comportement. Deux réserves de la contre-vérification : les formules prises dans des classes (`balance.ts`, `photo.ts`) ne se testent qu'une fois sorties, et c'est la routine qui protège leur sortie, pas les tests rapides ; la loi du bruit reste écrite deux fois, en GLSL et en TypeScript, côte à côte.
- Fichiers : `app/src/camera/optics.ts` et `noiseModel.ts` (à créer), `app/src/camera/noise.ts`, `photo.ts`, `bulletin.ts`, `app/src/ui/balance.ts`, `app/tests/`, `scripts/test_app.cjs`.
- Tests : `npm test` ; communs à `app/` ; pendant la sortie des formules, la routine, inchangée, doit passer, et les histogrammes de trois photos de référence (par défaut, sous-exposée, surexposée) sont égaux avant et après, au tirage du bruit près.
- Dépend de : le Sujet 26.
- Taille : moyenne à grande. Rien de ce sujet n'a été essayé par les rapports.

### Sujet 28 · Affichage de diagnostic et capacités de l'appareil
- Constats : ARC-06, ARC-13.
- À faire : un affichage ouvert par un paramètre de l'adresse : images par seconde, durée d'une image, durée des textures de rendu, capacités de rendu en flottants (`colorBufferFloat` et `colorBufferHalfFloat` compris). Limite à écrire, d'après la contre-vérification : la durée mesurée côté processeur graphique dépend d'une extension du navigateur (si le Chrome du téléphone de Julien l'expose : je ne sais pas) ; sans elle, comparer des débits sous le plafond de l'écran (densité complète, 135 mm à f/1.4), pas des durées. Au démarrage, lire les deux capacités (`textureFloatRender`, `textureHalfFloatRender`) ; si l'une manque, un message dans les deux langues, qui dit aussi que la mise au point ne voit plus les sujets, et un déclenchement refusé dans `Shutter`. Écrire l'exigence à un seul endroit, la section des navigateurs de `docs/pile-technique.md`.
- Fichiers : `app/src/main.ts`, `app/src/ui/shutter.ts`, `app/src/i18n.ts`, le module de l'affichage (à créer), `docs/pile-technique.md`, `docs/camera-physique.md`.
- Tests : communs à `app/` ; rien ne change sans le paramètre ; pour ARC-13, les quatre cas de l'essai (témoins en WebGL 2 et en WebGL 1 sans alerte ; extension masquée, message affiché et déclenchement refusé).
- Dépend de : le Sujet 1, pour rattacher le relevé à une version. À la fusion, Julien relève les chiffres sur son téléphone, et ils sont écrits dans la documentation comme point de départ.
- Taille : moyenne.

### Sujet 29 · La carte de l'application dans `docs/architecture.md`
- Constats : ARC-09 ; DOC-07 pour la promesse de réécriture de la même page.
- À faire : copier la section « Carte de l'application » du rapport d'architecture sous le bandeau de `docs/architecture.md`, avec le nombre corrigé (71 éléments de la page passés aux classes), puis la tenir à jour à chaque refonte ; ne garder la liste des contrôles de la routine qu'à un endroit. La réécriture de la partie « produit » de la page attend la fin des refontes. Le constat relève aussi, sans écrire de correction, que les « 0,5 Mo de code inutilisé » de la l. 94 de `docs/pile-technique.md` sont un majorant : seule la part des shaders pour WebGPU est sûre.
- Fichiers : `docs/architecture.md`, `docs/pile-technique.md`.
- Tests : communs ; une relecture par un second agent, que demande le rapport.
- Dépend de : rien.
- Taille : petite.

**Troisième partie : données et sources, fin de l'application, puis refontes**

### Sujet 30 · Entrées de `data/sources.yaml` : adresses, libellés, sources venues de compacts
- Constats : SRC-01, SRC-06, SRC-07, SRC-10, SRC-02, SRC-05 (deux entrées).
- À faire : l'adresse de `nikon-zr-mf-ring` (la page a13), et dans son libellé la réserve de la page, « This item is available with compatible lenses only » ; `nikon-z8-guide` scindée en deux entrées, et la notion MAP-22 mise à jour ; `/fa/` remplacé par `/en/` pour `canon-m50ii-metering`, dans le fichier et aux quatre endroits de `docs/architecture.md` (l. 61 à 63 et 68), dans le même commit ; la révision de `wikipedia-zone-system` ; le retrait de `sony-rx0ii-highlight` du fichier et de MES-02, et, dans le même commit, le lien de `docs/architecture.md`, l. 69, remplacé par celui de la page de l'α9 (complément de la contre-vérification) ; les libellés de `sony-rx10iv-limiter` et de `fujifilm-x100t-photometry`, avec un `todo` sur MAP-14 et sur MES-12 (pour le X100T, la formule du troisième agent : « compact à objectif fixe, pas un boîtier à objectif interchangeable », et non « pas un hybride ») ; la note de `suncalc`, sans numéro de version (« figer la version étiquetée du jour de l'usage », réserve de la contre-vérification ; la même phrase de `docs/questions-ouvertes.md` est corrigée au Sujet 5) ; deux entrées pour les pages npm de `@babylonjs/loaders` et de `babylonjs-gltf2interface`.
- Fichiers : `data/sources.yaml`, `data/referentiel/map.yaml`, `data/referentiel/mes.yaml`, `docs/architecture.md` (ses numéros de ligne sont ceux d'avant le Sujet 29, qui insère la carte de l'application en tête de la page).
- Tests : communs à `data/` ; chercher dans le dépôt l'identifiant et l'adresse de chaque entrée scindée, retirée ou déplacée avant de la toucher.
- Dépend de : rien.
- Taille : petite.

### Sujet 31 · Référentiel : textes, champs et sources qui n'ont pas suivi
- Constats : REF-02, REF-04, FMA-15, REF-01, REF-08, REF-03, REF-15, REF-17, RST-10.
- À faire : MES-07 d'abord (les zones brûlées se repèrent à la lecture ; en visée, par les zébras, que certains boîtiers réservent à la vidéo ; la brique simulateur de la notion accordée, comme le propose le constat) ; les sources des huit notions qui ont une fiche (cinq pour REF-04, trois pour FMA-15), et, dans `docs/lire-le-referentiel.md`, « le champ `sources` contient au moins les sources de la fiche » ; `flash: required` pour SIT-V2-01, SIT-V2-05 et SIT-V2-04 ; cinq termes (MAP-02, MAP-17, MAP-12, MES-02, BOI-33) ; une phrase dans l'explication de MAP-16, qui garde ses deux intitulés (la technique n'a pas de rapport avec les modes de zone AF de MAP-05) ; l'angle d'OPT-12 et sa source secondaire, le `todo` restant ouvert pour une source primaire ; MVT-08, MAP-04 et un `todo` sur BOI-31 ; une note de report en V2 sur RET-01 et sur RET-02.
- Fichiers : `data/referentiel/` (mes, cmp, boi, map, net, lum, opt, mvt, ret), `data/situations.yaml`, `data/sources.yaml`, `docs/lire-le-referentiel.md`.
- Tests : communs à `data/` ; `coverage.py` inchangé ; le recoupement de REF-04 refait : plus aucun écart entre les sources des 19 fiches et celles de leur notion.
- Dépend de : rien. Le contrôle automatique de REF-04 dans `validate.py` attend le Sujet 34. Pour SIT-V2-04, la valeur de la contre-vérification s'applique sans réponse à D31.
- Taille : moyenne.

### Sujet 32 · Situations : trépied, caisson étanche, verticales, autoportrait
- Constats : REF-09, REF-10, REF-11, REF-18, REF-12.
- À faire : les renvois de MVT-12 (trépied) vers SIT-17, SIT-21, SIT-33, SIT-35 et SIT-24, que la contre-vérification ajoute, et celui de LUM-04 vers SIT-03 ; MVT-12 en notion clé de SIT-21 et de SIT-33 ; le caisson étanche dans l'explication de PLA-08 et dans le lieu de SIT-42, avec PLA-08 en notion clé de SIT-42 ; BOI-04 en notion clé de SIT-16 ; RET-05, le texte, la brique simulateur et deux sources, puis RET-05 en notion clé de SIT-16 ; BOI-01 retirée des notions clés de SIT-28 et passée à `situations: all` ; les sources ajoutées à MVT-12, à MAP-08 et à RET-05, et les deux pages de REF-10 (celle de Nikon, primaire, pour « pas étanche » ; celle de Wikipedia sur les caissons, secondaire).
- Fichiers : `data/situations.yaml`, `data/referentiel/` (mvt, lum, pla, ret, boi, map), `data/sources.yaml`.
- Tests : communs à `data/` ; les niveaux des cinq situations restent ceux que les contre-vérifications ont recalculés ; le jalon ne change pas.
- Dépend de : le Sujet 22 de préférence, dont les contrôles gardent les listes éditées à la main ; D9, parce que ce sujet change des notions clés, ce que nomme la règle du numéro Y (à confirmer avant d'écrire la section du changelog ; ce lien avec D9 est relevé par cette synthèse, aucun rapport ne le dit). Si D9 tarde, les renvois, les textes et les sources partent d'abord, dans une version Z : ils ne changent ni un niveau ni une notion clé ; les notions clés suivent à la réponse.
- Taille : moyenne.

### Sujet 33 · Sources : la date de lecture ; les champs que `docs/lire-le-referentiel.md` ne décrit pas
- Constats : SRC-04, RST-11.
- À faire : dans `data/sources.yaml` et son schéma, un champ facultatif `read` (date de lecture), rempli quand elle est connue (libellés datés, relectures de cet audit) ; le champ `checked` retiré ; la phrase d'en-tête remplacée par ce qui est vrai (les 78 entrées du référentiel 0.2 n'ont pas de date de lecture ; une source est relue à son adresse avant qu'une fiche, le code ou la documentation s'appuie sur elle). Dans `docs/lire-le-referentiel.md` : les quatre lignes qui manquent (`notes` du jalon et de la situation, bloc `domain`, `retired.yaml` et son `since`, nuance de la l. 13 sur `activity`), la date de la mise à jour à la l. 3, un renvoi pour `data/relecture.yaml`.
- Fichiers : `data/sources.yaml`, `schemas/sources.schema.json`, `scripts/validate.py` s'il lit `checked`, `docs/lire-le-referentiel.md`.
- Tests : communs à `data/`.
- Dépend de : rien ; D9 pour une ligne de `docs/lire-le-referentiel.md` (le passage d'une notion en activité compte-t-il comme un reclassement ?), qui attend.
- Taille : petite.

### Sujet 34 · Champ `used_in` de `data/sources.yaml` : sa définition, son contrôle, la règle d'entrée d'une adresse
- Constats : SRC-03, SRC-05 (la règle).
- À faire (attend D2). Si la voie (a) est retenue : retirer `used_in` du fichier et du schéma ; `scripts/validate.py` calcule les fichiers qui citent chaque source et l'avertissement « citée nulle part », et contrôle dans l'autre sens que toute adresse `https` de `content/`, de `app/src/` et de `docs/` (hors `docs/dossiers/` et `docs/audit/`) est dans le fichier, sauf une courte liste d'adresses techniques ; les quatre phrases qui nomment le champ sont corrigées (`docs/lire-le-referentiel.md`, l. 21, et la section « Sources » des trois spécifications). Avec la voie (b) : la définition écrite, le contrôle dans l'autre sens, 34 écarts corrigés. Dans les deux cas : la règle d'entrée d'une adresse, dans `docs/lire-le-referentiel.md` (un dossier de travail cite ses adresses lui-même ; une adresse entre dans `data/sources.yaml` quand une notion, une fiche, le code ou une page de `docs/` hors dossiers s'appuie sur elle) ; le contrôle de REF-04.
- Fichiers : `data/sources.yaml`, `schemas/sources.schema.json`, `scripts/validate.py`, `docs/lire-le-referentiel.md`, les trois spécifications de `docs/specifications/`.
- Tests : communs à `data/` ; aucune source « citée nulle part » ; les 113 liens des fiches et les identifiants entre crochets de `app/src/` restent reconnus.
- Dépend de : D2 ; le Sujet 30 d'abord, pour les deux entrées npm : sans elles, le contrôle dans l'autre sens échoue sur les deux adresses de `docs/pile-technique.md`.
- Taille : moyenne.

### Sujet 35 · Fiches : dire qu'une source est secondaire, accorder les dates de lecture
- Constats : FEX-18, FMA-09.
- À faire : écrire la règle une fois dans `docs/contenus.md` (une source secondaire est dite telle dans la fiche) et l'appliquer à toutes les fiches en une passe, pas aux seules fiches visées ; compléter les libellés de `wikipedia-f-number`, de `wikipedia-shutter-speed` et de `wikipedia-circle-of-confusion` (ce que les fiches en tirent, lecture du 11 novembre 2026) ; donner une date de lecture dans MVT-01.
- Fichiers : `docs/contenus.md`, `data/sources.yaml`, les fiches qui citent une source secondaire.
- Tests : communs à `data/` et à `content/`.
- Dépend de : le Sujet 33, dont le champ `read` est fait pour ces dates.
- Taille : petite.

### Sujet 36 · Sources du modèle : bruit, champ de vue, critère « figé », capacités, capteurs
- Constats : PHY-02, PHY-04, PHY-05, PHY-13, PHY-14, PHY-15, PHY-18, PHY-20, FMA-06.
- À faire : dans `data/sources.yaml`, la page de William J. Claff sur le gain (source de la loi du bruit), l'article de Wikipedia sur l'angle de champ (source secondaire) et le communiqué de Nikon du 10 novembre 2016 à la place de `nikon-d5600-pixels` ; dans la documentation et les commentaires du code : l'addition des variances écrite comme une hypothèse de TutoPhoto, le champ de vue donné pour une mise au point à l'infini, les deux hypothèses du bruit, le calcul de la saturation cité à sa source, avec les capacités de cette page données comme recoupement, sans remplacer les valeurs, la taille de l'image de trois boîtiers, les tableaux des boîtiers mis à jour ; dans `bodies.ts`, les quatre points de bruit de lecture du D5600 ; le critère « figé » cité à sa source, secondaire (Wikipedia citant Wall, 1889), et dit comme un choix, dans la documentation, le code et la fiche MVT-01, en une passe (PHY-20, FMA-06) ; dans la même fiche, la phrase sur ce que juge le bulletin, le déplacement du corps et non celui des pattes (FMA-06).
- Fichiers : `data/sources.yaml`, `docs/camera-physique.md`, `app/src/camera/noise.ts`, `exposure.ts`, `bodies.ts`, `bulletin.ts`, `app/src/ui/balance.ts`, `content/fr/notions/MVT-01.md`, `content/en/notions/MVT-01.md`.
- Tests : communs à `data/`, à `app/` et à `content/`.
- Dépend de : D4 pour le capteur de trois boîtiers ; le Sujet 30 d'abord (même fichier).
- Taille : moyenne.

### Sujet 37 · Sources primaires de treize notions sans fiche
- Constats : REF-07.
- À faire, sans urgence d'après la contre-vérification : ajouter à `data/sources.yaml` et aux treize notions (BOI-02, BOI-06, BOI-11, BOI-14, BOI-19, LUM-12, MAP-02, MAP-08, MAP-10, MAP-11, MAP-12, MES-05, MES-09) les pages de Nikon, de Canon et de Sony du tableau du constat, chaque page relue à son adresse avant d'écrire l'entrée (le tableau note que deux pages n'appuient qu'une partie de la phrase : celle de BOI-02 ne dit rien de la mesure, celle de BOI-14 ne parle pas des LED) ; le texte de BOI-19 (« un traitement après la pose ») ; dans `docs/lire-le-referentiel.md`, « une notion sans champ `sources` n'est pas encore sourcée : elle l'est à la rédaction de sa fiche ». Pas de `todo` en série.
- Fichiers : `data/sources.yaml`, `data/referentiel/` (boi, lum, map, mes), `docs/lire-le-referentiel.md`.
- Tests : communs à `data/`.
- Dépend de : le Sujet 33, pour le champ `read` ; pour le reste, les entrées suivent la forme de `used_in` en vigueur le jour où elles sont écrites.
- Taille : petite à moyenne.

### Sujet 38 · Accessibilité : noms, rôles, infobulles, contrastes
- Constats : INT-15, INT-16, INT-09, INT-08 (première étape), INT-19 (points 6 à 8), INT-18.
- À faire : les attributs listés sous INT-15, sauf les deux que la contre-vérification écarte (un rôle d'image sur le canevas, un `alt` à remplir sur la photo) ; des noms accessibles qui disent l'effet de chaque bouton de molette, sans inverser les boutons ; la limite d'exposition écrite ailleurs que dans une infobulle, deux aides déplacées dans les fenêtres ; le canevas qui prend le focus à sa place dans la page, et non en premier (`canvasTabIndex: 0`) ; une légende pour les deux groupes de boutons radio, un nom propre à chacun des trois boutons « Fiche », le niveau des titres d'une fiche ouverte par-dessus le simulateur ; trois repères graphiques portés au-dessus de 3:1 de contraste (INT-18, le moins pressant des constats, peut partir à part).
- Fichiers : `app/simulateur/index.html`, `app/src/ui/cameraPanel.ts`, `app/src/i18n.ts`, `app/src/main.ts`, `app/scripts/build-pages.mjs`, `app/src/activities/lum02.ts`, `app/src/ui/challenges.ts`, `app/src/ui/ficheDialog.ts`, `app/src/style.css`.
- Tests : communs à `app/` ; l'arbre d'accessibilité de Chromium lu par son protocole ; l'ordre de tabulation ; contrastes recalculés, et regardés sur une capture pour la zone couverte par l'autofocus (un trait sombre continu sous un pointillé). Aucun essai avec un lecteur d'écran n'a été fait par les rapports.
- Dépend de : rien. Pour INT-09, la note de la fenêtre « Exposition » ne dépend pas de la mise en page ; une pastille du viseur serait à accorder avec le Sujet 42. Le projet n'a pas d'objectif d'accessibilité écrit.
- Taille : moyenne.

### Sujet 39 · Photo interrompue par le plafond de 5 s : garder le flou
- Constats : PHY-21 (le code).
- À faire : choisir l'ordre de parcours des rendus et le contrôler par un script pour tous les nombres de rendus de 16 à 256, puis dans un navigateur. Candidat essayé par le troisième agent : les mêmes paires point-instant, parcourues « le plus loin d'abord », avec un biais vers le bord du disque à réduire ou à écrire. Ne pas coder tel quel le parcours proposé par le constat. Ajouter à la routine une photo à grand flou (135 mm à f/1.4).
- Fichiers : `app/src/camera/photo.ts`, `docs/camera-physique.md`, `scripts/test_app.cjs`.
- Tests : communs à `app/` ; le script de contrôle de l'ordre ; le flou du fond mesuré sur une photo interrompue. En rendu logiciel, une photo au 135 mm à f/1.4 a pris de 31 à 117 s selon l'essai (47 s avec le code non modifié, interrompue à 97 rendus sur 256) : à compter pour la durée de la routine.
- Dépend de : le Sujet 26 de préférence, où le script de contrôle a sa place.
- Taille : moyenne.

### Sujet 40 · Un seul développement pour le viseur et la photo
- Constats : ARC-01, ARC-08.
- À faire (attend D10 et D11) : le viseur rend la lumière linéaire dans des textures en demi-flottants, son flou travaille sur cette texture, puis le même fragment GLSL que celui de la photo fait gains, exposition, bruit, écrêtage et courbe. Deux corrections de la contre-vérification : pour un appareil sans rendu en demi-flottants, le repli est un viseur sans effets d'aperçu, pas l'ancienne chaîne ; ne basculer `applyByPostProcess` qu'une fois le développement compilé et attaché. Avec la refonte, un propriétaire unique de la chaîne du viseur, lectures de l'indicateur d'équilibre comprises (ARC-08).
- Fichiers : `app/src/camera/noise.ts`, `viewfinderDof.ts`, `photo.ts`, `autofocus.ts`, `app/src/ui/cameraPanel.ts`, `shutter.ts`, `balance.ts`, `app/src/main.ts`, `scripts/test_app.cjs`.
- Tests : communs à `app/` ; photo inchangée (histogrammes de référence du Sujet 27) ; contrôles du viseur de la routine (bruit à ISO 6400, flou au 135 mm à f/1.4, bruit de la loupe du Sujet 18), dont l'audit dit les seuils à revoir, le flou en lumière linéaire changeant les valeurs ; chiffres du diagnostic avant et après sur le téléphone de Julien ; version isolée, annulable par `git revert -m 1`.
- Dépend de : D10 et D11 ; les Sujets 26, 27 et 28, et les chiffres du Sujet 28 relevés par Julien. Le rapport demande de mesurer le débit du viseur sur son téléphone avant de fusionner (si le viseur en demi-flottants reste fluide : je ne sais pas) : le plan propose une version isolée, jugée par Julien sur le site publié, et sur laquelle rien ne s'appuie avant son jugement (D37).
- Taille : grande. D'après le rapport, cette refonte précède la balance des blancs et l'histogramme en direct, puis la mesure de la lumière.

### Sujet 41 · Magasin de réglages
- Constats : ARC-02 (premier temps).
- À faire : une table typée où chaque réglage a sa valeur par défaut et sa validation, avec une lecture, une écriture et un abonnement uniques, que le panneau, l'autofocus et le déclencheur lisent ; mêmes noms et mêmes valeurs des clés du stockage ; pas d'identifiant de boîtier (constat réfuté).
- Fichiers : `app/src/ui/cameraPanel.ts`, `app/src/camera/autofocus.ts`, `app/src/ui/shutter.ts`, `app/src/main.ts`, le module du magasin (à créer).
- Tests : communs à `app/` ; tests rapides (validation, aller et retour avec la mémoire, relecture de ce que le stockage contient aujourd'hui) et contrôles de mémoire de la routine.
- Dépend de : le Sujet 26 ; D10 pour l'ordre.
- Taille : grande.

### Sujet 42 · Mise en page du simulateur sur téléphone
- Constats : INT-04, INT-12, INT-03, INT-17 (corrections 2 et 3), INT-11, INT-20 ; INT-14 pour les contrôles de mise en page.
- À faire (attend D12, et un essai dans un navigateur avant de choisir) : d'abord une hauteur de viseur qui ne dépend pas des textes du panneau (INT-04), ce qui supprime la bascule du cadre (INT-12) ; puis le téléphone tenu à l'horizontale (INT-03), l'écran de revue (INT-17), les pastilles (INT-11), les fenêtres (INT-20 : défilement remis à zéro à l'ouverture, bouton de fermeture en haut ; pour la fermeture par un toucher sur le fond, vérifier quels navigateurs appliquent l'attribut `closedby` avant d'écrire un gestionnaire à la main). Les contrôles de la routine en anglais, à 320 px et à l'horizontale entrent avec les corrections qu'ils vérifient : ajoutés avant, ils mettraient la CI au rouge.
- Fichiers : `app/src/style.css`, `app/simulateur/index.html`, `app/src/ui/shutter.ts`, `cameraPanel.ts`, `topView.ts`, `balance.ts`, `app/src/i18n.ts`, `scripts/test_app.cjs`, `.github/workflows/routine.yml` si un profil s'ajoute.
- Tests : communs à `app/` ; les mesures des rapports refaites aux six largeurs, dans les deux langues et les deux modes AF. Les seuils dépendent de la police : Inter dans les mesures du rapport, DejaVu Sans dans la CI.
- Dépend de : D12, que Julien tranche sur pièces : la première étape du sujet est l'essai des formes possibles dans un navigateur (écrans émulés), fait par Claude, dont les captures accompagnent la question.
- Taille : grande. Découpage possible si elle ne tient pas en une session : (a) INT-04, INT-12, INT-11 et les contrôles en anglais et à 320 px ; (b) INT-17 et INT-20 ; (c) INT-03 et le profil à l'horizontale.
- Note du 15 novembre 2026 : depuis la version 0.3.59, la fenêtre « Crédits » s'ouvre défilement remis à zéro (INT-20, pour cette seule fenêtre), parce que la ligne de version y est passée en haut. Constaté en le faisant, dans Chromium : la remise à zéro n'a d'effet qu'après `showModal()` ; demandée fenêtre fermée, elle n'en a pas, alors que la correction proposée par INT-20 la place avant. Les autres fenêtres restent à faire ici.

**Quatrième partie : documentation et outils**

### Sujet 43 · Les deux README : un état court, la version anglaise remise à niveau
- Constats : DOC-02, DOC-01, DOC-11, CHX-01 (les README).
- À faire : dans `README.md`, remplacer le titre daté et les puces chiffrées par un état court, sans inventaire des fonctions ni compte, qui renvoie au site et à `CHANGELOG.md` ; réécrire les l. 7 à 13 et 20 de `README.en.md` d'après le README français corrigé ; ajouter `content/` au tableau « Contenu du dépôt » des deux fichiers ; la ligne `docs/` de ce tableau écrite par familles plutôt que page par page, que la contre-vérification de DOC-11 dit « une bonne idée, à faire avec DOC-02 » sans en faire un constat. Si Julien préfère garder un état dans le README : cinq points à corriger, pas sept, d'après la contre-vérification de DOC-02. Au passage, trois lignes « Tester » (voir « Constats réfutés »).
- Fichiers : `README.md`, `README.en.md`.
- Tests : communs ; relire les deux fichiers côte à côte, puisqu'aucun contrôle ne les compare.
- Dépend de : rien.
- Taille : petite.

### Sujet 44 · Phrases périmées : `docs/pile-technique.md`, le cadrage, les contenus
- Constats : CHX-02, DOC-07, DOC-12 (« 34 Mio »).
- À faire : dans `docs/pile-technique.md`, corriger les l. 77-78 et 83 et ajouter sous « Décision » une note datée (les deux effets de Babylon.js ne servent plus depuis la version 0.3.23 ; ce que le moteur fournit aujourd'hui ; pourquoi on le garde), sans réécrire les sections « Options » et « Recommandation » ; « 34 Mio » à la l. 94, et à la l. 144 de `docs/historique.md` ; l'en-tête de `docs/cadrage.md` ; la phrase de `docs/contenus.md`, l. 77 (le simulateur existe ; la limite qu'elle annonce, une brique comptée par la présence d'une section, vaut toujours). Au passage, deux lignes « au plus » gardées de constats réfutés (voir « Constats réfutés ») : dans `docs/pile-technique.md`, Node.js et Playwright suivent l'environnement de Claude ; dans `docs/cadrage.md`, sous les décisions du 7 novembre, la décision du 8 novembre sur la scène de parc, avec son renvoi à `docs/historique.md`.
- Fichiers : `docs/pile-technique.md`, `docs/historique.md`, `docs/cadrage.md`, `docs/contenus.md`.
- Tests : communs.
- Dépend de : rien.
- Taille : petite.

### Sujet 45 · `REPRISE.md` dit qu'il est une archive ; `scripts/extract_reprise.py` supprimé
- Constats : CHX-06, DOC-09.
- À faire : supprimer le script (l'historique de git le garde) ; trois lignes d'avertissement en tête de `REPRISE.md` (« Archive du 7 novembre 2026. Ne fait plus foi… ») ; deux lignes des deux README ; dans `CLAUDE.md`, l. 8, ne changer que « et `docs/` qui en est copié », après accord (D6).
- Fichiers : `scripts/extract_reprise.py`, `REPRISE.md`, `README.md`, `README.en.md`, `CLAUDE.md`.
- Tests : communs ; vérifier qu'aucun workflow ni aucune page n'appelle plus le script.
- Dépend de : D6 pour la ligne de `CLAUDE.md` ; le Sujet 43 d'abord (mêmes fichiers).
- Taille : petite.

### Sujet 46 · Documentation des licences et de la publication
- Constats : LIC-08, LIC-10, PHY-19 (la notice).
- À faire : les quatre phrases de LIC-08 (`docs/licences.md`, l. 10 ; `docs/publication.md`, l. 12 et 27 ; `docs/pile-technique.md`, l. 90, et `app/vite.config.ts`, l. 8 : « notre code, celui de Babylon.js et les fonctions d'assemblage de Vite et de Rolldown (MIT) ») ; `docs/publication.md`, l. 3 : « même alors, hors GitHub Enterprise Cloud, le site publié reste public », avec un lien après chaque moitié de la phrase, un seul commit cité pour les deux (`8cd1075`, déjà cité) et une entrée dans `data/sources.yaml` ; l'adresse du second lien est déduite du chemin du fichier lu dans la source de la documentation de GitHub, et n'a pas été ouverte (hôte non joignable). S'y ajoute une phrase qui n'est le constat d'aucun rapport, demandée par la section du rapport des licences sur les pull requests de tiers et non contestée par son contre-avis : dans `docs/publication.md`, pour une pull request d'un tiers, la CI verte ne prouve rien sur `scripts/`, `.github/`, `requirements.txt`, `app/package.json`, `app/package-lock.json` et `scripts/check_public_historique.txt` ; ces fichiers se relisent avant d'approuver l'exécution des workflows, et avant de fusionner. Selon D13 : la copie, dans le dossier `licences/` du site construit, du premier bloc de la licence de Vite et de la licence de Rolldown ; la mention de copyright et la licence de bgfx dans `docs/licences.md` et dans les crédits.
- Fichiers : `docs/licences.md`, `docs/publication.md`, `docs/pile-technique.md`, `data/sources.yaml`, `app/vite.config.ts` ; selon D13, `app/scripts/copy-licences.mjs`, la page des licences et `app/src/credits.ts`.
- Tests : communs à `data/` et à `app/` ; si des licences sont recopiées, les retrouver dans le site construit.
- Dépend de : D13 pour les copies et la notice ; les phrases partent sans.
- Taille : petite ; moyenne avec les copies.

### Sujet 47 · `scripts/check_scenes.py` : croiser le manifeste avec les fichiers de la scène
- Constats : LIC-05.
- À faire : comparer au manifeste la licence, l'auteur et l'adresse d'origine du fichier `license.txt` et des métadonnées du fichier glTF ; refuser dans un fichier glTF une `uri` qui n'est ni un fichier listé de la scène ni une `uri` en `data:` ; exiger pour `verified` une vraie date, au plus un jour dans le futur. Mettre à jour `docs/licences.md` (l. 29 à 33) : le rapport ne le demande pas, mais la page décrit aujourd'hui exactement ce que le script fait, et doit suivre. Outre le fichier de tiers posé hors des scènes, dont le contrôle est reporté (voir « Constats confirmés sans correction à faire maintenant »), deux des huit cas du rapport restent sans contrôle : une texture remplacée sans champ `changes`, qui ne se voit que par un nouveau téléchargement, à refaire à la main quand une scène change ; une situation inconnue du référentiel dans le champ `situations` du manifeste, pour laquelle le rapport n'écrit pas de correction.
- Fichiers : `scripts/check_scenes.py`, `docs/licences.md`.
- Tests : communs ; `python3 scripts/check_scenes.py` sans erreur sur la scène actuelle ; les cas des essais du rapport refusés sur une copie de la scène.
- Dépend de : rien. À faire avant l'ajout d'une nouvelle scène.
- Taille : petite.

### Sujet 48 · `docs/pile-technique.md` coupé en deux
- Constats : CHX-01 (seconde moitié).
- À faire (facultatif : c'est la dernière part de la correction que l'audit retient pour CHX-01, « une information, un endroit » ; la contre-vérification ne l'exige pas, elle écrit « si la page est coupée » et précise comment) : la comparaison des moteurs, figée à sa date, garde le chemin `docs/pile-technique.md` ; l'outillage (versions, licences, organisation du site, routine) passe dans une page de référence, sans récit des versions ; les renvois changent dans la même pull request (`data/sources.yaml`, `routine.yml`, et `CLAUDE.md` après accord).
- Fichiers : `docs/pile-technique.md`, une nouvelle page sous `docs/`, `data/sources.yaml`, `.github/workflows/routine.yml`, les pages qui renvoient à l'outillage.
- Tests : communs à `data/` ; rechercher tous les renvois à `docs/pile-technique.md` avant et après.
- Dépend de : les Sujets 44 et 46 d'abord, qui corrigent des lignes de la page ; le Sujet 28, qui écrit dans sa section des navigateurs ; à accorder avec le Sujet 29. À proposer à Julien avant de le faire, puisque rien ne l'exige.
- Taille : moyenne.

**Sans pull request : un réglage de Julien.** CHX-03 se corrige par une règle de branche sur `main`, que seul Julien peut activer ; le chemin est sous « Décisions qui attendent Julien », parmi les réglages. Elle n'attend aucun sujet.

**Ce qui suit le plan.** Les nouvelles fonctions de la file de travail de `docs/etat-des-travaux.md` (balance des blancs, histogramme en direct, puis la suite), ou les tests avec des débutants d'abord, selon D14.

## Décisions qui attendent Julien

Cette section s'adresse à toi, Julien. 37 décisions : d'abord les 14 qui bloquent un sujet ou une partie de sujet (D1 à D14), puis les 23 qui ne bloquent rien aujourd'hui (D15 à D37). Les numéros ne suivent pas l'ordre des sujets : celles qui servent en premier sont D6 et D14 (Sujets 4 et 5), D5 (Sujets 7 et 8, puis 20) et D1 (Sujet 11). Pour chacune : les options, ce que recommande l'audit, ce que recommande la contre-vérification, les constats, ce qui est bloqué.

### Décisions qui bloquent un sujet

**D1. Retardateur : un second appui annule-t-il le compte à rebours ?** (COD-02)
- Options : oui, comme un choix de TutoPhoto, dit comme tel dans la fenêtre « Mode de déclenchement » ; non, ne rien changer.
- Audit : l'annulation. Contre-vérification : à toi de trancher ; les deux pages relues du manuel du Z 6 ne disent pas comment arrêter un compte à rebours lancé, il n'y a donc aucun comportement sourcé.
- Bloque : cette part du Sujet 11, et elle seule.

**D2. Le champ `used_in` de `data/sources.yaml` : le retirer ou le garder ?** (SRC-03)
- Options : (a) le retirer, et faire calculer par `scripts/validate.py` la liste des fichiers qui citent chaque source ; (b) le garder, avec la définition « les fichiers où l'adresse apparaît », un contrôle dans l'autre sens et 34 écarts à corriger.
- Audit : (a), parce que le champ recopie une information que le dépôt contient déjà. Contre-vérification : elle ne choisit pas entre les deux voies ; si (a) est retenue, elle est à compléter dans le même changement par le contrôle inverse (toute adresse des fiches, du code et de la documentation est dans le fichier), sinon elle retire une protection : le contrôle actuel est le seul qui voit une adresse changée dans le fichier et restée ancienne dans une fiche ou dans la documentation.
- Bloque : le Sujet 34 ; la forme du contrôle de REF-04 ; les lignes `used_in` des Sujets 15 et 46.

**D3. Le vocabulaire de chaque marque : sous quelle forme le donner ?** (FEX-15, FMA-14, INT-10, REF-08)
- Options : dans les fiches, une phrase par fiche. Dans le référentiel, un champ `terms` par notion, ou la forme déjà prévue par `docs/architecture.md` : `data/vocabulaire.yaml`, « un terme par marque et par famille d'appareils, chacun avec sa source ». Dans l'interface, une phrase dans la fenêtre « Boîtier de référence » (avec les termes de Canon et leur source, ou réduite à « Les noms des modes et des menus restent ceux du Nikon Z 6 »), ou des libellés par marque.
- Audit : la phrase par fiche ; le champ `terms` pour le référentiel ; pour l'interface, à ton choix, les libellés par marque après les tests.
- Contre-vérification : la phrase par fiche est proportionnée, avec la réserve sur le manuel de Canon lu (celui de l'EOS 850D) ; le champ `terms` contredit la forme déjà prévue et ne sait pas dire qu'un réglage change de nom d'un modèle à l'autre : « à trancher par Julien, sur la forme déjà prévue » ; pour l'interface, la phrase, les libellés par marque étant une extension.
- Bloque : la phrase de la fenêtre dans le Sujet 19 ; les phrases des fiches, pour lesquelles les rapports ne donnent qu'une option, n'attendent pas. Les cinq corrections de termes du Sujet 31 n'en dépendent pas.

**D4. Six boîtiers de référence : le dire à l'écran, ou en garder moins ? Et que faire de trois capteurs sans source primaire ?** (question du rapport sur les choix ; PHY-15)
- Ce qu'est un boîtier dans le code, d'après le rapport : la taille du capteur, son nombre de pixels, son bruit, et la couverture de l'autofocus pour trois sur six. Tout le reste (commandes, termes, cadences, réglages par défaut) vient du manuel du Nikon Z 6 ; les aides le disent une par une, la fenêtre « Boîtier de référence » ne le dit pas.
- Options : garder six boîtiers et l'écrire dans la fenêtre ; ne garder que ceux dont le manuel est lu ; sourcer chaque boîtier, ce qui multiplie le travail de chaque fonction. Pour le capteur du Nikon D5600, du Sony A6000 et du Canon EOS 2000D, dont les pages d'origine ne sont pas joignables depuis l'environnement de Claude : écrire « source secondaire » avec la révision de Wikipedia, ou relever toi-même les fiches des constructeurs, comme pour l'EOS RP.
- Audit : garder six et l'écrire. Contre-vérification : pas de contre-avis sur les six boîtiers ; pour les capteurs, les deux options.
- Bloque : la phrase de la fenêtre dans le Sujet 19 ; une part du Sujet 36.

**D5. « f/5,6 » ou « f/5.6 » en français ?** (FEX-16)
- Options : la virgule partout (celle de l'interface et du manuel français de Canon) ; le point partout (celui des fiches, de la documentation et d'une note de l'interface).
- Audit : aligner les fiches sur l'interface est le plus court ; l'inverse demande une source pour ce qu'affiche un boîtier. Contre-vérification : un indice pour l'autre sens, la page française du manuel du Z 6 garde le point pour une valeur affichée par l'appareil (« ±0.0 ») et met la virgule dans son texte courant ; quel que soit le choix, la note de l'objectif doit suivre. Ce qu'affiche un boîtier réglé en français : je ne sais pas.
- Bloque : le Sujet 20 ; à connaître de préférence avant les Sujets 7, 8 et 17, qui retouchent les mêmes lignes.

**D6. Trois changements de `CLAUDE.md`, à accepter avant qu'ils soient écrits** (INT-13, CHX-01, CHX-06)
- La phrase « Ces tests émulent l'écran, le toucher et le navigateur » : la routine n'envoie aucun toucher. Proposition du rapport, tant que la routine n'est pas refaite : « émulent la taille d'écran et l'identification du navigateur ; les gestes sont ceux d'une souris ».
- Une table « quelle page pour quelle information » : `CHANGELOG.md` pour le récit par version, `docs/historique.md` pour tes décisions, `docs/etat-des-travaux.md` pour l'état, la file et les décisions en attente, `docs/questions-ouvertes.md` pour ce qui est ouvert.
- La l. 8 : n'y changer que « et `docs/` qui en est copié » (cinq des douze pages de la racine de `docs/` seulement disent venir de `REPRISE.md`) ; la rédaction te sera proposée.
- Les contre-vérifications demandent que chaque changement de `CLAUDE.md`, qui porte tes règles, te soit proposé avant d'être écrit.
- Bloque : une ligne des Sujets 4, 5, 45 et 48 ; le reste de ces sujets part sans.

**D7. Titre anglais d'une fiche : un vrai titre dans le champ `title.en` du référentiel, ou un titre de fiche libre ?** (CHX-05)
- Aujourd'hui, `title.en` amorce le glossaire, et les fiches anglaises traduisent le titre français : 17 titres diffèrent par la majuscule, 3 par les mots (BOI-07, BOI-08, EXP-06). En anglais, le bouton du bulletin affiche le libellé du référentiel et ouvre une fiche titrée autrement.
- Audit : trancher les trois titres. Contre-vérification : écrire d'abord la règle, que tu tranches.
- Bloque : la partie anglaise du contrôle du Sujet 23.

**D8. Les trois tags `v0.2.0`, `v0.2.1` et `v0.2.2` : les poser, ou y renoncer ?** (CHX-10)
- Options : tu les poses à la main (la commande est dans le résumé du workflow `tag.yml`) ; ou `scripts/changelog.py` cesse de les réessayer, et les quatre liens du bas de `CHANGELOG.md` visent les commits. Sans réponse : trois avertissements à chaque passage de `tag.yml`, et quatre liens cassés.
- Audit : les deux voies, sans choisir. Contre-vérification : confirme les faits.
- Bloque : cette part du Sujet 25.

**D9. Deux lectures de la règle du numéro Y des versions** (RST-05)
- Le passage d'une notion en activité (LUM-02, le 10 novembre 2026) compte-t-il comme un reclassement ? La règle ne nomme que « niveau, notions clés ». Le référentiel est-il à la version « v0.2 » ou « v0.3 » ?
- Contre-vérification : sans urgence ; « je ne sais pas laquelle des deux lectures Julien retient ».
- Relevé en préparant cette synthèse, non dit par les rapports : le Sujet 32 change les notions clés de cinq situations, ce que la même règle nomme ; lu comme un reclassement, il donnerait la première version 0.4.0.
- Bloque : le numéro de version du Sujet 32 ; une ligne du Sujet 33.

**D10. Les refontes de l'architecture : lesquelles, et dans quel ordre ?** (ARC-01, ARC-02, ARC-05, ARC-06, ARC-07, ARC-09, ARC-12, ARC-13)
- Options : le plan de l'audit, neuf refontes sans changement visible avant les fonctions nouvelles ; ou le plan réduit par la contre-vérification : la version à l'écran, les tests rapides avec les formules communes, le diagnostic avec les capacités de l'appareil, le développement partagé, le magasin de réglages sans identifiant de boîtier, la carte de l'application copiée tout de suite ; trois autres refontes « quand elles rapportent », une retirée.
- Audit : les neuf, dans l'ordre. Contre-vérification : neuf pull requests sans changement visible, c'est beaucoup pour un « mini projet » quand chaque commit qui touche `app/` attend 20 à 27 minutes de routine.
- Le plan ci-dessus suit la contre-vérification.
- Bloque : les Sujets 40 et 41, et, derrière eux, la balance des blancs et l'histogramme en direct.

**D11. Un seul développement pour le viseur et la photo : le faire ?** (ARC-01, ARC-08)
- De quoi il s'agit : le développement est ce qui fait l'image à partir de la lumière calculée (exposition, courbe, écrêtage, bruit). Il est écrit deux fois, une pour le viseur et une pour la photo.
- Options : ne rien faire (d'après l'audit, chaque fonction du développement s'écrit deux fois, et l'écart entre le viseur et la photo grandit) ; le développement partagé ; une seule chaîne pour tout, écartée par le rapport.
- Audit : le développement partagé, avant la balance des blancs et l'histogramme en direct. Contre-vérification : oui, avec deux corrections ; la refonte change l'image du viseur, c'est donc une proposition à te faire avant de produire, à ne lancer qu'avec les chiffres du diagnostic relevés sur ton téléphone.
- Bloque : le Sujet 40. La spécification de la balance des blancs a été reportée pour cette raison : la fonction serait écrite deux fois tant que les deux chaînes ne sont pas réunies.

**D12. La mise en page du simulateur sur téléphone : quelle refonte ?** (INT-04, INT-12, INT-03, INT-17, INT-11, INT-20, INT-14)
- À choisir : comment rendre la hauteur du viseur indépendante des textes (trois lignes réservées à la consigne, ou la consigne sortie du panneau) ; que faire du téléphone tenu à l'horizontale (le panneau à côté du viseur, ou, à défaut, dire de le tenir à la verticale) ; un écran de revue qui couvre aussi le panneau, avec la photo sur toute la largeur ; un bouton de fermeture en haut des fenêtres.
- Audit : la refonte, la hauteur du viseur d'abord. Contre-vérification : les deux formes simples proposées ne suffisent pas (il faut trois lignes et non deux ; un viseur à part fixe de la fenêtre cacherait le déclencheur à 320 px de large) ; à essayer dans un navigateur avant de choisir.
- Bloque : le Sujet 42.

**D13. Deux notices de licence, à ajouter ou non** (PHY-19, LIC-08)
- bgfx : la boucle du flou du viseur reprend celle d'un exemple de cette bibliothèque. Options : ajouter sa mention de copyright et sa licence BSD à 2 clauses à `docs/licences.md` et aux crédits, ou ne rien ajouter. Audit : te le soumettre. Contre-vérification : « Je ne sais pas si ces lignes y sont soumises ; ajouter la notice coûte peu et lève le doute. »
- Vite et Rolldown : le fichier construit contient quelques fonctions d'assemblage de ces deux outils. Options : corriger seulement la phrase de la documentation, ou, en plus, recopier leurs licences dans `licences/`. Audit : la copie, « c'est le choix prudent, et il coûte deux fichiers ». Contre-vérification : réduite au premier bloc de la licence de Vite et à la licence de Rolldown, « si Julien retient le choix prudent ». Si ces fragments sont une « substantial portion » au sens de la licence MIT : je ne sais pas.
- Bloque : ces deux parts du Sujet 46.

**D14. Après les corrections : les tests avec des débutants d'abord, ou les nouvelles fonctions ?** (règle « pas d'extension au-delà de la V1 minimale avant de l'avoir testée avec des débutants » ; question 1 du rapport sur les choix ; CHX-10 ; CHX-04, réfuté comme constat)
- Options : la règle tient, et aucune fonction nouvelle ne vient avant les tests ; elle est levée, et il faut la retirer de `CLAUDE.md` et de `docs/questions-ouvertes.md` en disant ce qui la remplace ; voie intermédiaire de l'audit : garder l'extension, mais plafonner ce qui attend une validation.
- Audit : garder la règle et placer les tests juste après les corrections ; dans les deux cas, écrire la réponse dans `CLAUDE.md`. Ses raisons : aucune fiche n'est relue, chaque fonction ajoutée apporte ses choix à confirmer, et le protocole de test est prêt (il ne manque que la grille de relevé et la version à l'écran). En sens inverse : tes mots de la nuit du 11 au 12 novembre (« vas aussi loins que possible »), et le fait que les tests dépendent de ta disponibilité et de celle de cinq personnes.
- Contre-vérification : la question est à poser, avec deux faits que l'audit omettait : tu as demandé toi-même les grilles, l'histogramme et la balance des blancs le 9 novembre, en laissant le moment à Claude (« quand tu estimes que c'est le meilleur moment »), et tu as mis les grilles (CMP-02) dans le jalon de la V1 minimale le 12. Seule la version 0.3.57 étend hors du jalon sans réponse de toi. Le constat qui reprochait ces extensions au travail antérieur est réfuté (elles datent du 12 novembre ou d'après) ; la question reste, et elle porte sur la suite.
- Relevé en critiquant le plan, non dit par les rapports : la première partie (Sujets 1 à 20) réunit ce qui trompe ou bloque un débutant. Si tu places les tests avant les nouvelles fonctions, tu peux aussi les placer dès la fin de cette partie, sans attendre les contrôles, les données ni les refontes ; la mise en page sur téléphone (Sujet 42) resterait alors à faire.
- Bloque : deux lignes du Sujet 5 ; l'ordre du travail après le plan.

### Décisions qui ne bloquent aucun sujet aujourd'hui

Simulateur : des changements de comportement, que les contre-vérifications ne retiennent pas comme corrections.

| N° | Question | Options | Audit | Contre-vérification | Constat |
| --- | --- | --- | --- | --- | --- |
| D15 | Étalonner l'éclairage de la scène ? | Le laisser et l'écrire (fait par le Sujet 17) ; ou mesurer dans un rendu, puis baisser l'éclairage des objets 3D. | Mesurer, puis régler (un facteur de l'ordre de 0,47). | Seulement après la mesure, avec une valeur « de l'ordre de 0,5 », dans la pull request de la mesure de la lumière : le réglage change l'image de départ et les mesures de bruit de la documentation. | PHY-06 |
| D16 | Garder la scène à 12,5 IL et un indicateur gradué en dixièmes d'IL ? | Placer la scène sur un cran ; graduer l'indicateur par tiers ; ne rien changer. | L'une des deux premières. | Pas nécessaire aux fiches ; à décider avec la mesure de la lumière. | FEX-01 |
| D17 | Cinq écarts entre le référentiel et le simulateur (diaphragme animé, rideau animé, « l'appareil explique son choix », alerte de vitesse trop lente, mode silencieux) : objectif à garder, ou référentiel à réécrire ? | Pour chaque écart : le garder comme objectif, ou réécrire la brique simulateur de la notion. | Une phrase par fiche, ou changer le référentiel. | Pas de phrase dans les fiches ; une ligne par écart dans `docs/etat-des-travaux.md`, à trancher une par une. | FEX-08 |
| D18 | En AF-S, montrer le visage détecté avant le toucher, comme le décrit le manuel ? | Garder le comportement et l'écrire dans la fiche (Sujet 8) ; ou relancer la détection en AF-S sans refaire la mise au point, et effacer la cible quand le mode change. | Le changement. | Confirme le défaut du repère resté ambre au retour de l'AF-C ; ne tranche pas le changement. | FMA-22 |
| D19 | Défi SIT-06 : juger aussi si le chien est visible ? | Ajouter le contrôle de visibilité au défi ; ou s'en tenir à la phrase de la fiche. | L'ajouter. | À revoir une fois le Sujet 6 fait : avant, le défi échouerait sur un chien visible. | FMA-19 |
| D20 | Les défis doivent-ils juger l'exposition ? | Un critère d'exposition, dont le seuil est à sourcer ; ou la phrase seule (Sujet 8). | Un critère, ou au moins l'écart d'exposition répété à côté du verdict. | Pas maintenant : l'absence de jugement est un choix écrit, que tu as validé le 11 novembre 2026, faute de critère sourcé ; la phrase suffit. | FMA-17 |
| D21 | Bulletin : mesurer le bruit sur la photo plutôt que dans le viseur ? | Garder les deux approximations, qui sont écrites ; ou faire rendre ses mesures par le calcul de la photo. | La mesure sur la photo. | Faisable, mais change une ligne du bulletin que tu as validé le 11 novembre ; à proposer quand viendront les situations dont les critères portent sur les pixels. | ARC-10 |
| D22 | Laisser choisir le sens du cadre, horizontal ou vertical ? | Un bouton « Cadrage » ; ou rien de plus que le Sujet 42. | Le bouton, avec une valeur de départ qui suit l'écran. | Une fonction nouvelle, pas avant les tests avec des débutants ; ne pas suivre l'orientation de l'écran avant la refonte de la mise en page. | INT-12 |
| D23 | Des commandes au clavier pour le viseur, la carte et la photo ? | Flèches pour tourner l'appareil et déplacer le point, Entrée pour faire le point ou ouvrir la loupe ; ou rien. | Les ajouter. | À toi de décider, pas avant les tests avec des débutants ; les pas (2°, 0,5 m) sont à choisir. | INT-08 |
| D24 | Un repli pour les appareils sans rendu en flottants ? | Une somme en demi-flottants, par exemple ; ou seulement le message et le déclenchement refusé (Sujet 28). | Le constat, ajouté par le second agent : ne décider d'un repli que si un appareil réel en a besoin. | Le troisième agent ne le conteste pas ; un repli en demi-flottants lirait aussi `colorBufferHalfFloat`. | ARC-13 |
| D25 | Relever le plafond du flou du viseur à densité 2 ? | Garder le plafond et l'écrire (Sujet 17) ; le porter à 32 px CSS (environ 680 échantillons pour une boucle qui en admet 400) ; une passe de flou à échelle réduite, à évaluer. | L'une ou l'autre des deux premières, coût à mesurer sur ton téléphone. | D'abord l'écrire ; pas de relèvement sans mesure sur téléphone. | PHY-08 |
| D26 | Une scène où le sujet court vers l'appareil ? | L'ajouter plus tard ; ou non. | C'est ce que le référentiel demande pour MAP-04 (« en ponctuel la netteté décroche, en continu elle suit »). | Une extension : pas avant le test de la V1 minimale. | FMA-11 |

Référentiel et périmètre :

| N° | Question | Options | Audit | Contre-vérification | Constat |
| --- | --- | --- | --- | --- | --- |
| D27 | La brique « situation réelle » : quelle règle de couverture ? | Garder la règle du 7 novembre (une notion a la brique dès qu'une des situations de son champ `situations` est rédigée) ; ou prendre la définition du site (la brique compte quand une situation rédigée cite la notion dans sa section « Notions »). | La définition du site : la colonne « Situation réelle » passerait de 30 à 12, la couverture resterait à 13. | Pas une correction d'office : les deux règles sont écrites ; la section « Notions » des fiches deviendrait une seconde source de ce qui relie une notion à une situation. | RST-09 |
| D28 | Le jalon de la V1 minimale est plafonné à 13 notions couvertes sur 17, ce que le dépôt écrit depuis le 11 novembre : le débloquer, et par quelle voie ? | Trois renvois (SIT-01 pour EXP-04 et EXP-06, SIT-06 pour EXP-05) ; ou `situations: all` pour EXP-04, EXP-05 et EXP-06, avec six sections « Situation réelle » à écrire et à sourcer. Les deux donnent 16 sur 17. | Écrire la règle des « réglages de base » et leur donner `situations: all`. | Pas de faute à corriger ; elle chiffre les deux voies sans en retenir une. | RST-08 (réfuté comme constat ; la décision reste) |
| D29 | Le périmètre : 191 notions et 49 situations, au regard de ton critère du 10 novembre (« Ça s'adresse à des débutants/néophyte », « Je ne veux pas transformer les gens en professionnel de la photo ») ? Le rapport te pose aussi une question sur SIT-41 : l'appareil d'un drone entre-t-il dans « reflex et hybrides uniquement » ? Aucun texte lu ne le dit. | Garder le catalogue entier ; mettre en avant l'avancement sur le jalon plutôt que sur 191 ; découper la suite en jalons et reporter trois groupes (35 notions) ; écrire le critère avant d'ajouter une notion. | Ces propositions, sans rien retirer. | Garder le catalogue : pas de contre-avis. Le chiffre mis en avant : `coverage.py` affiche déjà les deux, et le taux sur 191 est la définition de « 100 % » du cadrage ; le choix est une décision de toi, pas une correction. L'ordre de la suite est déjà tranché par toi le 11 novembre ; un jalon « plus tard » ne tient pas dans le mécanisme existant et rétablirait le découpage que tu as retiré le 7 novembre : à te poser comme une question, sans rien écrire dans `data/` avant ta réponse. | aucun (section « Périmètre » de `referentiel-structure.md`) |
| D30 | Les niveaux N1, N2 et N3 : un critère écrit ? | Écrire un critère qui permette de classer ; ou garder les trois mots actuels (« débutant », « intermédiaire », « avancé »). | Deux reclassements proposés. | Sans critère écrit, aucun reclassement ne peut être prouvé. RET-12 : une question reste pour toi, à poser avec celle des niveaux : l'épreuvage avec un profil de papier est-il du niveau débutant ? MES-10 : rien à corriger, son niveau N2 est une décision du 7 novembre 2026 que tu as acceptée ; « si Julien veut revoir ce niveau, c'est avec un critère écrit pour N1, N2 et N3 », et le passer en N1 ferait aussi descendre le niveau d'entrée de SIT-35 et de SIT-37, en plus de SIT-06. | REF-06, REF-14 (réfutés) |
| D31 | Flash : SIT-V2-04 (nature morte à deux lumières) est-elle `required` ou `optional` ? Un portrait en plein soleil (SIT-02) dépend-il du flash ? | SIT-V2-04 : `optional` si les deux lumières peuvent être des lampes, `required` sinon. SIT-02 : garder `flash: required`, ou non. | Te renvoie les deux choix. | SIT-V2-04 : `required` tant que la situation garde la notion clé « Flash déporté et studio » ; c'est ce que fait le Sujet 31 sans réponse. | REF-01 |

Projet :

| N° | Question | Options | Audit | Contre-vérification | Constat |
| --- | --- | --- | --- | --- | --- |
| D32 | Deux attentes anciennes, à confirmer ou à corriger : le viseur sans flou de mouvement (« lecture de Claude », 8 novembre) ; la règle de la médiane pour le niveau d'entrée d'une situation (« à confirmer en écrivant les premiers défis », 7 novembre). | Les rapports ne donnent pas d'options. | Les faire entrer dans la table des décisions en attente (Sujet 5). | D'accord. Le Sujet 22 fait d'un écart à la règle de la médiane une erreur, sans changer la règle. | CHX-10, DOC-06, RST-06 |
| D33 | Les scènes suivantes : encore une photo à 360° pour décor ? | Une photo à 360° (hautes lumières écrêtées, perspective et éclairage figés, lumière non mesurée) ; ou un décor en 3D (un seul arbre pèse 66,3 Mo, 11,9 Mo une fois simplifié). | « Je ne sais pas trancher sans le dossier relu ; à décider scène par scène, en écrivant à l'écran ce que le fond ne simule pas. » | Pas de contre-avis. | CHX-10 |
| D34 | Bilingue : écrire l'anglais en même temps que le français, ou après sa relecture ? Le bilingue dès la V1, décidé le 6 novembre, n'est pas en cause. | Comme aujourd'hui ; ou la relecture d'abord sur le français, l'anglais remis d'aplomb ensuite. | Garder les deux arbres ; faire porter la relecture d'abord sur le français. | La relecture dans les deux langues est ta décision du 11 novembre 2026 : à toi de la réordonner. | aucun |
| D35 | Renderpeople : y a-t-il un accord ? De qui, de quand, pour quel usage ? | Lire leurs conditions générales, ou leur écrire, et faire consigner la réponse (date, texte exact, portée). | Le rapport des licences te le demande : les quatre modèles sont publiés sous CC BY 4.0, qui ne couvre pas les droits de la personnalité des personnes scannées. D'ici ta réponse, d'après le même rapport, « le risque est borné : les quatre modèles sont quatre dossiers de la scène, remplaçables sans toucher au reste ». | À ta réponse, une entrée datée dans `docs/historique.md`. | DOC-05 (réfuté comme constat : la question t'est déjà posée) |
| D36 | Trois choses laissées à ton choix : essayer une fois de créer une pull request par l'API REST de GitHub, pour voir si le pied avec le lien de session y est ajouté aussi ; un garde-fou de cinq lignes sur les licences des dépendances livrées dans le site ; ouvrir le projet à d'autres contributeurs. | Les faire ou non. | — | « Si Julien le veut », « si un garde-fou est voulu ». | CHX-11, LIC-09, CHX-09 (réfutés) |
| D37 | Tes essais sur téléphone : après la fusion, ou avant ? | Après : une version isolée, fusionnée quand la CI est verte, que tu juges sur le site publié et qui s'annule par `git revert -m 1` si l'essai échoue, comme pour les versions 0.3.52 et 0.3.53. Avant : il faut alors un moyen de publier une pull request à part du site, que le dépôt n'a pas (le site n'est publié qu'à la fusion sur `main`). | « À refaire sur un téléphone avant de fusionner » (COD-01) ; le débit du viseur « à mesurer sur le téléphone de Julien avant de fusionner » (ARC-01). | Aucune ne dit comment essayer avant la fusion. Question relevée en critiquant le plan : aucun rapport ne la pose. Le plan propose « après », et n'attend pas ta réponse. | COD-01, ARC-01 |

Choix que les rapports laissent ouverts et que la pull request concernée proposera, sans les compter parmi les décisions : l'orthographe anglaise à retenir, britannique ou américaine (INT-19, Sujet 13) ; l'endroit où écrire la limite d'exposition, une pastille du viseur ou la note de la fenêtre « Exposition » (INT-09, Sujet 38) ; l'endroit de la phrase « Le défi ne juge ni l'exposition ni le bruit », les trois fiches de situation ou la note de la fenêtre « Défis » (FMA-17, Sujet 8) ; pour l'activité de LUM-02, la mention « au-delà du mur dessiné » ou un curseur borné à 55 cm (FMA-10, Sujet 14).

### Réglages que seul Julien peut faire

1. **Règle de branche sur `main`** (CHX-03). Chemin donné par le rapport : dans le dépôt, Settings, puis Rules, puis Rulesets, puis New branch ruleset. Le rapport précise que ce chemin n'a pas été relu dans la documentation de GitHub, dont le site n'est pas joignable : à vérifier à l'écran. À régler : pull request obligatoire ; contrôles requis `validate`, `confidentialite`, `app` et `description` ; aucune approbation requise, sinon la règle « Claude fusionne lui-même ses pull requests » ne tient plus. À ne pas requérir : les quatre jobs de la routine, tant que son workflow est filtré par chemins. Je ne sais pas si le job d'une matrice peut être requis par son nom, ni sous quelle identité l'outil de Claude fusionne.
2. **Approbation des workflows lancés par les pull requests de tiers** (rapport des licences). Chemin donné par le rapport : Settings, Actions, General, « Approval for running fork pull request workflows from contributors », choisir « Require approval for all external contributors ». Ces libellés ont été lus dans la source de la documentation de GitHub, pas à l'écran, et le réglage actuel du dépôt n'a pas pu être lu. La contre-vérification juge que le point pèse peu : le réglage par défaut demande déjà l'approbation d'un premier contributeur, et aucun secret n'est exposé.
3. **Les trois tags**, si tu choisis de les poser (D8) : la commande est dans le résumé du workflow `tag.yml`. Ce n'est pas un réglage, et le rapport ne donne pas de chemin dans l'interface.
4. **Des hôtes à ajouter à l'environnement de Claude**, pas avant la rédaction des fiches concernées : `www.legifrance.gouv.fr` et `eur-lex.europa.eu`, pour écrire le contenu juridique des notions PLA-07 et PLA-09 à partir des textes officiels, ou bien tu relèves les articles toi-même (les deux voies sont celles de la contre-vérification de SRC-08) ; `fujifilm-dsc.com`, pour chercher dans le manuel d'un hybride de Fujifilm la source de la notion MES-12 (SRC-10). Les rapports ne donnent pas le chemin de ce réglage.

Ce que les rapports te demandent aussi, et qui n'est pas un réglage :
- des essais sur ton téléphone, chacun sur la version publiée après la fusion du sujet (D37) : la rafale tenue, doigt qui glisse (COD-09, Sujet 2) ; la photo prise un doigt posé sur le viseur (COD-01, Sujet 3) ; si tu veux une valeur lue dans la fiche EXP-06, le rapport signal sur bruit au point visé retenu (FEX-05, Sujet 7) ; la texture d'éclairage recréée après une perte de contexte (COD-12, Sujet 10) ; les chiffres de l'affichage de diagnostic et les capacités de rendu en flottants (Sujet 28) ; la fluidité du viseur après la refonte (Sujet 40) ; le coût d'un plafond de flou relevé (D25). La version 0.3.53 (densité du viseur plafonnée à 2) reste aussi à juger ;
- des pages que toi seul peux relever : les fiches des constructeurs pour trois capteurs (D4) ; les conditions générales de Renderpeople (D35).

## Constats confirmés sans correction à faire maintenant

Deux constats confirmés n'ont aucune correction à faire aujourd'hui :

- ARC-03 (la scène est écrite dans le code) : rien à faire avant la deuxième scène. La V1 minimale n'a qu'une scène ; ce qui est écrit en dur coûtera la même chose à sortir le jour de la deuxième scène qu'aujourd'hui, et un vocabulaire de rôles dessiné sur une seule scène serait un format figé trop tôt.
- REF-05 (BOI-09, « lumière stable » dans l'explication et « lumière changeante » dans l'exercice) : la contradiction n'est pas entière, et remplacer l'exercice ferait perdre à la notion son lien avec SIT-19 (concert). La contre-vérification demande de compléter l'explication « à la rédaction de la fiche » (ouverture et vitesse fixées, ISO auto quand la lumière change), et le bilan du rapport ne range pas REF-05 parmi les corrections à faire d'abord.

Les autres constats de cette section sont aussi dans le plan, pour la part qui se corrige. Ce tableau dit la part que la contre-vérification écarte ou reporte : c'est ce qu'un sujet ne doit pas faire, même si l'audit le proposait.

| Constat | Ce qui n'est pas à faire maintenant | Raison donnée par la contre-vérification |
| --- | --- | --- |
| PHY-01 | Coder le filé. | Le filé est une notion hors de la V1 minimale ; corriger la documentation suffit. |
| PHY-06 | Régler l'éclairage de la scène tout de suite. | Seulement après une mesure dans un rendu, avec la mesure de la lumière (D15). |
| PHY-08 | Relever le plafond du flou du viseur. | Pas sans mesure sur téléphone (D25). |
| PHY-11 | Simuler la diffraction. | La phrase « non simulée » suffit ; l'audit lui-même renvoie la simulation à plus tard. |
| PHY-13 | Remplacer les capacités des photosites par celles de la page du bruit de lecture. | La page ne dit pas d'où elles viennent ; l'effet sur le bruit est de 2 % au plus. |
| PHY-14 | Compter les pixels de l'image, et non les pixels effectifs, pour le bruit. | Rien de lu ne dit lequel des deux nombres couvre le capteur ; l'effet est de 0,4 %. |
| FEX-01 | Déplacer la scène sur un cran, ou graduer l'indicateur par tiers. | Pas nécessaire pour deux phrases d'exercice (D16). |
| FEX-02 | Changer l'état de départ (ISO auto activé). | C'est l'état du Z 6. |
| FEX-08 | Écrire dans les fiches ce que le référentiel prévoit et que TutoPhoto ne dessine pas encore. | Cela met du suivi de projet sous les yeux du débutant et promet des fonctions hors de la V1 minimale (D17). |
| FEX-09 | Écrire quand corriger l'exposition (neige, contre-jour). | Ce n'est dans aucune page lue. |
| FEX-12 | Recopier dans la fiche BOI-12 la liste de ce qui n'est pas simulé. | La liste est tenue à un seul endroit. |
| FEX-15, FMA-14 | Changer les lettres M, A et S, les libellés de la fenêtre « Mise au point » ou le titre « Collimateurs ». | Pas dans la même modification que les fiches ; le titre vient du référentiel. |
| FEX-18, FMA-09 | Ajouter « source secondaire » aux seules fiches visées. | La règle s'écrit une fois et s'applique à toutes les fiches (Sujet 35). |
| FMA-11 | Ajouter une scène où le sujet court vers l'appareil. | Une extension (D26). |
| FMA-15 | Retirer de NET-01 une source que sa fiche ne cite pas. | Renvoyé aux rapports du référentiel et des sources, qui ne le tranchent pas : l'entrée est parmi les sources non relues. |
| FMA-17 | Ajouter un critère d'exposition aux défis. | Il demanderait un seuil sourcé, qui manque (D20). |
| FMA-19 | Juger dans le défi si le chien est visible. | Pas avant le Sujet 6 (D19). |
| FMA-22 | Changer la détection du simulateur en AF-S. | Non tranché (D18). |
| FMA-23 | Déplacer les deux points des yeux du chien. | Ils sont justes. |
| ARC-02 | Poser les textes par un attribut de la page ; découper `cameraPanel.ts`. | Le premier retire au compilateur le contrôle des clés de texte : à ne faire qu'avec le test rapide qui le remplace ; le second vient après le magasin, seulement si le fichier reste trop gros. |
| ARC-05, INT-13 | Découper la routine en étapes indépendantes ; y envoyer de vrais touchers. | Après le magasin de réglages, ou pas du tout : sans lui, chaque étape rechargerait la scène en rendu logiciel. Les gestes au toucher se font avec ce découpage, pas à part. |
| ARC-07 | Réunir aussi le cercle de confusion et le champ de vue ; lire les titres des notions dans `data/` à la construction. | « Propre, pas urgent » ; un lecteur de YAML de plus et une étape avant la construction. |
| ARC-08 | Une refonte à part pour la suspension du viseur. | C'est une consigne pour le Sujet 40. |
| ARC-09 | Réécrire la partie « produit » de `docs/architecture.md`. | Elle attend la fin des refontes. |
| ARC-10 | Faire rendre ses mesures par le calcul de la photo. | Priorité basse ; l'écart est écrit et dit à l'écran (D21). |
| ARC-13 | Un repli pour les appareils sans rendu en flottants. | Seulement si un appareil réel en a besoin (D24). |
| COD-02 | Attendre la fin du calcul en cours avant de prendre la vue du retardateur. | Un état de plus ; la ligne retenue suffit. |
| COD-06 | Griser le déclencheur tant que la scène n'est pas prête. | Double emploi avec l'attente bornée. |
| COD-09 | Ajouter `user-select: none` et `-webkit-touch-callout: none`. | Non essayés ; ils répondent à un défaut que personne n'a constaté : à n'ajouter que si le menu de l'appui long se montre sur un vrai téléphone. |
| COD-13 | Retirer la seconde application de la vue en fin de calcul ; retirer trois `export` sans emploi. | Le premier ferait dépendre la remise de la projection d'un effet de bord ; les tests rapides importeront les seconds. |
| INT-04 | Réserver deux lignes à la consigne ; un viseur à part fixe de la fenêtre. | Il faut trois lignes ; le déclencheur serait caché à 320 px de large. |
| INT-08, INT-10, INT-12 | Des commandes au clavier, des libellés par marque, un bouton « Cadrage ». | Des fonctions nouvelles, pas avant les tests avec des débutants (D23, D3, D22). |
| INT-12 | Faire suivre au cadre l'orientation de l'écran. | Pas avant la refonte de la mise en page : le cadre du téléphone émulé tomberait à 47 % de sa surface. |
| INT-09 | Écrire la limite d'exposition à la place de la consigne de mise au point. | Cela changerait la hauteur du panneau, donc celle du viseur (INT-04) ; une pastille du viseur ou la note de la fenêtre « Exposition » ne déplacent rien. |
| INT-11, INT-15, INT-16 | Une hauteur minimale pour le bouton « Vue de dessus » ; un rôle d'image sur le canevas et un `alt` à remplir sur la photo ; inverser les deux boutons de la vitesse. | Le critère ne le demande pas ; le canevas a déjà un rôle et un nom, et l'`alt` est déjà écrit à chaque photo ; cela casserait la règle commune aux quatre molettes. |
| SRC-04 | Un second champ `seen`, avec la valeur « inconnu » sur les 39 entrées non relues. | L'absence de date de lecture le dit déjà ; la façon dont la page a été vue reste dans le libellé, où elle est. |
| SRC-05 | Traiter comme une infraction les 91 adresses des trois dossiers de `docs/dossiers/` absentes de `data/sources.yaml`, ou les y faire entrer. | Cette part du constat est réfutée : les dossiers sont hors de la période, chacun de leurs faits porte son adresse, et la règle (le dossier porte ses citations ; les sources entrent à l'implémentation) est déjà suivie et écrite. |
| SRC-06 | Remplacer deux adresses de Nikon qui redirigent vers leur nouvelle adresse. | Une redirection permanente n'est pas une faute ; à faire à la prochaine modification des fichiers qui les citent. |
| SRC-07, SRC-10 | Trouver dès maintenant les sources de remplacement pour MAP-14 et MES-12. | À faire avant d'écrire la fiche, d'où les `todo` ; les hôtes ne sont pas joignables. |
| REF-03 | Renommer MAP-16. | Le nom proposé n'a pas plus de source que l'actuel. |
| REF-07 | 94 `todo` identiques ; des révisions de Wikipedia pour sept notions. | Ils noieraient les `todo` utiles ; Wikipedia n'entre qu'à la rédaction de la fiche, doublée d'une source primaire. |
| REF-08 | Un champ `terms` par notion. | Il contredit la forme déjà prévue (D3). |
| REF-11 | Écrire que tenir l'appareil de niveau suffit à garder les verticales droites. | Je ne sais pas : à sourcer à la rédaction de la fiche. |
| REF-12 | Mettre BOI-35 en notion clé de SIT-28. | La situation est un autoportrait « au retardateur », et BOI-35 y sert déjà par son renvoi ; en notion clé, elle obligerait à simuler un « téléphone virtuel » dès que SIT-28 entrera dans un jalon. |
| REF-17 | Changer « silencieux » dans BOI-12 ; changer le lieu de SIT-07. | Sur un reflex Nikon, le mode silencieux est bien un mode de déclenchement ; une notion clé de SIT-07 parle justement des LED. |
| REF-18 | Dire dans le référentiel quel boîtier corrige la perspective ; revoir l'intitulé anglais « crop, straighten » de RET-05. | « À la rédaction de la fiche, pas avant » : la fonction n'est sourcée que pour le Z 7 et le Z 6. |
| RST-05 | Tout contrôle du champ `since`, si l'option `--base` du Sujet 23 n'est pas écrite. | Le champ n'est lu par aucun code, et aucune valeur n'est fausse. |
| RST-06 | Un champ pour la raison d'un écart de niveau ; retirer la dérogation par `notes`. | La dérogation est la règle écrite, et la règle de la médiane reste à confirmer (D32). |
| RST-09 | Changer la règle de couverture. | Une proposition à trancher (D27). |
| RST-10 | Un jalon par tranche ; réécrire une phrase datée de `docs/cadrage.md`. | Une proposition à trancher (D29) ; une décision datée ne se réécrit pas. |
| CHX-01 | Produire les pages d'état par un script. | Un outil de plus à entretenir pour un dépôt de cette taille. |
| CHX-02 | Réécrire la comparaison des moteurs ; rouvrir le choix du moteur. | C'est le compte rendu d'une décision ; le coût d'un changement est certain, le gain n'est pas établi. |
| CHX-03 | Rendre la routine obligatoire avant fusion. | Son workflow est filtré par chemins ; il faudrait le refaire, ce qui ne vient qu'avec une refonte de la routine. |
| CHX-05 | Produire les titres à la construction ; contrôler les titres anglais. | Un lecteur de YAML de plus ; la règle du titre anglais n'est pas écrite (D7). |
| CHX-06 | Déplacer `REPRISE.md` sous `docs/`. | Cela casse les renvois de cinq pages pour peu de gain. |
| DOC-02 | Changer « référentiel v0.2 » et « environ 90 % du cadre ». | Le premier se défend, l'objection au second est fausse. |
| DOC-04 | Redater les trois titres du changelog. | La date est recopiée dans le tag et la release, qui ne se réécrivent pas. |
| DOC-06 | Retirer le `todo` de MES-04. | Ce que la cellule fait de la neige reste à sourcer. |
| DOC-07 | Changer l'objectif « taux de couverture affiché dans l'outil » de `docs/cadrage.md`. | C'est un objectif du cadrage ; l'afficher est une fonction à mettre dans la file, pas une correction. |
| DOC-11, DOC-12 | Ajouter `.github/` et `requirements.txt` au tableau du README, et quatre fonctions à son inventaire ; changer « 19 fiches » dans `docs/propositions.md`. | Le README nomme ces deux fichiers là où ils servent ; CHX-01 et DOC-02 retirent l'inventaire ; « 19 fiches » était juste à sa date. |
| LIC-01 | Figer la liste des tolérances du contrôle. | Elle doit pouvoir s'allonger, sous relecture. |
| LIC-02 | Deux motifs de plus (session sans schéma, secret sans guillemets) ; un motif d'adresse postale. | Les deux premiers refusent des fichiers existants ; il n'y a pas de motif fiable pour le troisième. |
| LIC-03 | Vider de leurs métadonnées tous les fichiers ajoutés. | Impossible pour les fichiers de tiers des scènes, gardés identiques à leur origine. |
| LIC-04 | Rendre obligatoires les contrôles de numérotation, de rubriques et de lien. | Des conventions tenues sans contrôle depuis 64 versions : corrections « justes, mais facultatives ». |
| LIC-05 | Refuser tout fichier binaire hors des scènes. | Aucun fichier à contrôler aujourd'hui ; à écrire quand le premier arrive. |
| LIC-08 | Recopier en entier la licence de Vite. | 98 196 octets, dont 79 sections sur des dépendances qui ne sont pas dans le site. |

## Constats réfutés

Ces 26 constats ne sont pas à corriger. La dernière colonne dit ce que la contre-vérification en garde quand même, et où cela va.

| Constat | Ce qu'il affirmait | Pourquoi il est réfuté | Ce qui en reste |
| --- | --- | --- | --- |
| PHY-16 | Les exemples de la documentation sont calculés avec les libellés, pas avec les valeurs exactes des crans. | Exagéré : au degré de précision écrit, trois exemples sur quatre ne changent pas, le quatrième bouge de 1 %. | Au plus une phrase sur cet écart. |
| FEX-10 | L'explication de la fiche EXP-06 est trop dense pour un débutant. | Un jugement de rédaction, pas un fait prouvé ; l'explication suit le référentiel. | À signaler à la relecture et au test avec des débutants, comme les trois remarques de la section « Lisibilité pour un débutant » du rapport des fiches de mise au point (MVT-01, NET-01 et NET-06, MAP-06), qui ne sont pas des constats. |
| FMA-05 | La fiche MAP-06 prête la couverture de l'autofocus du Z 6 à trois autres boîtiers. | Déjà dit dans la fiche et la documentation, d'après une décision de Julien du 11 novembre 2026 ; la correction introduirait une erreur. | Au plus, nommer les trois boîtiers. |
| FMA-20 | Trois chiffres des fiches ne sont pas ceux du simulateur. | Exagéré : les écarts sont plus petits que ce dont l'affichage varie d'un instant à l'autre. | « Environ », si ces phrases sont retouchées. |
| ARC-04 | Le simulateur n'a aucune mesure de la lumière. | Faits exacts, mais c'est le doublon de PHY-12, et la mesure de la lumière est une fonction prévue, pas une refonte. | Son ordre : après le Sujet 40 et l'étalonnage (D15), les sources du comportement de la mesure d'abord. |
| ARC-11 | Un boîtier devrait avoir un identifiant propre, pas un couple marque et format. | Le couple applique une décision de Julien du 8 novembre 2026, et aucun besoin cité n'est dans la file. | Le Sujet 41 se fait sans identifiant de boîtier. |
| COD-10 | Au repos, trois minuteries réécrivent sans cesse des textes inchangés. | Le coût avancé ne se retrouve pas à la mesure (moins de 1 % du temps, en rendu logiciel). | À reprendre si le relevé du Sujet 28 montre un coût. |
| CHX-04 | Deux versions ont étendu la V1 minimale malgré la règle de `CLAUDE.md`. | Hors de la période, et exagéré : Julien a demandé lui-même ces fonctions. | La question D14. |
| CHX-07 | Une pull request de fiches lance quatre fois le scénario 3D complet. | Hors de la période ; ce déclenchement est voulu. | Un niveau « pages » rapide, si la routine est refaite. |
| CHX-08 | Les versions sont épinglées, et rien ne dit comment les faire avancer. | Exagéré : aucune vulnérabilité connue ; ces versions sont celles de l'environnement de Claude. | Au plus deux lignes (message de la routine, Sujet 4 ; `docs/pile-technique.md`, Sujet 44). |
| CHX-09 | Rien ne dit à un contributeur extérieur comment tester ni proposer un changement. | Deux affirmations fausses : les README ont une section « Contribuer ». | Trois lignes « Tester » (Sujet 43) ; D36. |
| CHX-11 | Chaque pull request naît avec le lien de la session, puis est corrigée. | Déjà dit dans le dépôt ; le contrôle par pull request est le filet qui fonctionne. | Une idée d'essai (D36). |
| SRC-08 | Le droit français est cité par des commentaires, pas par les textes officiels. | Aucune erreur n'est montrée ; la règle porte sur le contenu juridique à écrire, et les `todo` sont déjà posés. | Les textes officiels seront à lire pour écrire PLA-07 et PLA-09. |
| SRC-09 | Six pages n'ont été lues que par Julien. | Le constat dit lui-même que ce n'est pas une faute : c'est la voie décidée par Julien le 11 novembre 2026. | Rien. |
| REF-06 | La notion RET-12, de niveau N1, demande un savoir classé N3 ailleurs. | Repose sur un critère de niveau qui n'est écrit nulle part. | D30. |
| REF-13 | Huit groupes de notions se recouvrent, sans phrase qui dise ce qui va où. | Pour la plupart des groupes, les intitulés et les explications le disent déjà ; deux paires sont une même idée à deux niveaux, « une progression, pas un doublon ». | À la rédaction des fiches de BOI-04 et de MES-06, dire où sont les grilles et l'histogramme en direct. |
| REF-14 | L'ISO auto (MES-10) devrait être au niveau N1. | Son niveau N2 est une décision du 7 novembre 2026, acceptée par Julien. | D30. |
| REF-16 | Les sept situations `SIT-V2-NN` sont des exercices plus que des situations. | Exagéré, et contraire à la décision du 11 novembre 2026 qui en retient deux pour le parc. | Les sept identifiants restent. Dire ce qu'est une situation à une seule notion clé est renvoyé, sans correction, au rapport sur la structure, dont la section « Périmètre » ne propose rien à regrouper. |
| RST-08 | Le jalon ne peut pas dépasser 13 notions couvertes sur 17. | Déjà écrit dans le dépôt et déjà posé à Julien : pas une faute. | D28. |
| RST-12 | Deux scripts s'arrêtent sur une trace Python au lieu d'un message. | Exagéré : aucune faute ne passe, et la trace nomme le fichier. | Deux lignes, dans le Sujet 22. |
| DOC-03 | Une phrase de `docs/etat-des-travaux.md` sur les commits non signés est fausse. | Hors de la période, et la conséquence avancée ne tient pas. | La phrase est inexacte : une ligne, dans le Sujet 5. |
| DOC-05 | Deux pages se contredisent sur un accord de Renderpeople. | Hors de la période ; la question est déjà posée à Julien. | D35. |
| DOC-08 | Trois phrases prêtent à Julien plus que ses mots. | Aucune des trois attributions n'est montrée fausse, et l'une a sa trace dans une page que le constat n'avait pas lue. | Rien à corriger. La conversation n'est pas dans le dépôt : seul Julien peut dire si une attribution est fausse, et aucun élément lu ne le suggère. |
| DOC-10 | La page des décisions ne porte pas celle du 8 novembre (une photo réelle pour décor). | Déjà dit dans `docs/historique.md` et dans onze autres fichiers. | Au plus une ligne dans `docs/cadrage.md` (Sujet 44). |
| LIC-06 | `scripts/check_public.py` tolère trop pour lui-même et refuse à tort. | Les faits sont exacts, mais ce ne sont pas des défauts. | Deux retouches, dans le Sujet 24 : le numéro facultatif dans l'adresse « noreply » admise, une phrase en tête de la liste des tolérances. |
| LIC-09 | La règle « vérifier la licence de toute dépendance » ne repose sur aucun contrôle. | C'est une règle de conduite, et tout est propre. | Un garde-fou possible (D36). |

Plusieurs constats confirmés ne le sont qu'en partie ; la part réfutée est écrite sous chacun, dans son rapport : FEX-09, FEX-12, FMA-08, SRC-05, SRC-06, REF-04, REF-11, REF-17, RST-10, INT-09, INT-11, INT-15, CHX-10, DOC-02, DOC-06, DOC-07, DOC-11, DOC-12, LIC-02 et LIC-05.

## Ce que l'audit n'a pas couvert

**Sources non relues, hôtes non joignables.**
- Sur les 151 entrées de `data/sources.yaml` examinées, 51 n'ont pas pu être relues (37 hôtes, non joignables depuis l'environnement de Claude ou qui refusent les lectures automatiques). 21 ne sont citées que par le référentiel, pour des notions sans fiche. Les 30 autres ont leur adresse dans la documentation, le code ou une fiche : 12 portent des valeurs du simulateur ou des phrases d'une fiche (dont les six pages que Julien a relevées lui-même et les capteurs de trois boîtiers), 7 portent le droit, 11 appuient des pages de documentation.
- Les 21 entrées ajoutées le 12 novembre 2026 sont hors du périmètre.
- Parmi ce qui n'a pas été lu : les fiches de Canon et de Sony pour plusieurs boîtiers ; les manuels du Canon EOS RP et de l'EOS 2000D (les termes de Canon cités viennent du manuel de l'EOS 850D) ; les deux articles sur lesquels s'appuie la fiche EXP-06, vérifiés seulement contre les extraits gardés dans le dépôt ; les normes de sensibilité, connues par l'article de Wikipedia qui les résume ; les textes officiels du droit ; les conditions générales de Renderpeople.
- La documentation de GitHub a été lue dans son dépôt source, pas à son adresse : les chemins d'interface cités ne sont pas vérifiés à l'écran. Les pages publiées des règles d'accessibilité n'ont pas été relues.
- Ce que cela laisse sans réponse : si ces 51 pages existent encore et disent ce que leur libellé affirme.

**Essais faits dans Chromium en rendu logiciel seulement.**
- Tous les essais dans un navigateur sont faits dans Chromium sans écran, en rendu logiciel. Les « téléphones » sont des profils émulés : taille d'écran, identification du navigateur, et touchers envoyés par le protocole de Chromium quand l'essai le dit. Aucun essai sur un vrai téléphone, avec un processeur graphique, dans Safari ni avec un lecteur d'écran.
- Le rendu logiciel étire les durées (une photo s'y calcule en 10 s environ, contre 0,8 à 2,0 s sur le téléphone de Julien d'après la documentation) et ralentit l'horloge de la scène. L'ordre des événements n'en dépend pas ; la fréquence d'un cas chez un utilisateur, si.
- Le rapport du modèle physique n'a employé aucun navigateur, sauf pour PHY-21 : PHY-06, PHY-07 et PHY-08 sont établis par le code et le calcul. Les rapports des sources, du référentiel, des choix, de la documentation et des licences n'ont ni ouvert de navigateur ni construit le site : celui de la structure du référentiel a seulement lancé la construction des pages des fiches sur des copies, sans Vite, et celui des licences a lu le site construit le 12 novembre 2026, resté dans la copie de travail. Le site publié n'a pas été ouvert.
- Les mesures de mise en page sont faites avec une autre police que celle de la CI : les seuils changent avec la police, les mécanismes non.
- Aucun rapport n'a rejoué la routine en entier, et aucune des refontes recommandées n'a été écrite, hors l'essai des tests rapides : leurs coûts sont des estimations.
- Ce que cela laisse sans réponse : le comportement, sur un vrai appareil, de tout ce qui est établi par essai, et la fréquence réelle de ces cas chez un débutant.

**Parties non lues.**
- Les versions 0.3.54 à 0.3.57, hors de la période : la routine dans la CI, la progression du chargement, les grilles de cadrage, les histogrammes de l'écran de revue. Vu en passant, sans constat : la section « Grilles de cadrage » de `docs/camera-physique.md` se contredit sur le nombre de grilles.
- `REPRISE.md` n'est pas relu en entier ; le contenu des dossiers de sources et des spécifications non plus ; l'organisation de `docs/camera-physique.md` n'est jugée par aucun rapport ; les sections de `CHANGELOG.md` ne sont pas réessayées une à une ; le « point du 13 novembre » de `docs/etat-des-travaux.md`, écrit pendant l'audit, n'est pas audité.
- Dans le référentiel : des textes anglais, seuls les intitulés sont lus ; les phrases des domaines de composition, de lecture d'image, de retouche et de planification, lues en entier, ne sont pas confrontées à une source (sauf CMP-02, RET-12 et RET-14) ; les 180 renvois sans retour d'une notion vers une situation n'ont été jugés un par un par personne.
- L'interface en anglais dans le simulateur (ses libellés sont lus dans le code, pas à l'écran), et les pages des fiches telles que le site les publie.
- Ce qui n'est pas dans git : les descriptions des pull requests (une seule lue), leurs commentaires, les journaux d'Actions, les textes des releases ; les réglages du dépôt autres que la protection de `main`. gitleaks, l'outil de recherche de secrets de la CI, n'a pas été lancé par l'agent ; sa configuration a été lue et rejouée, à titre indicatif. Les 21 fichiers venus de Sketchfab n'ont pas été comparés à leur origine.
- Des remarques « vues en passant », devenues le constat d'aucun rapport : la ligne du bruit de l'indicateur d'équilibre qui saute d'une lecture à l'autre au point visé de départ ; un bulletin qui écrit une traînée « au-delà du flou acceptable » avec le même chiffre que la limite ; en mode A, une vitesse qui clignote pour une photo à +1/6 IL seulement ; les contours de la photo et du viseur non lissés ; les réglages des quatre molettes non mémorisés ; le flou du viseur, qui ne connaît pas le sol de la photo à 360° au-delà du sol de 40 m de côté ; l'avertissement de Vite, à chaque construction, sur l'option `inlineDynamicImports`, dépréciée. Les deux premières sont vues dans un essai (Chromium, rendu logiciel) ; les autres sont établies par le code ou le calcul, sans essai.
- Les fiches de lot de `docs/audit/synthese/`, dont cette page est tirée, n'ont pas été relues par un second agent.

## Je ne sais pas

Ce qui reste invérifié et compte pour la suite. Le détail est dans la section « Je ne sais pas » de chaque rapport.

Sur un vrai appareil :
- ce que donnent, sur un téléphone, avec un processeur graphique ou dans Safari, les fautes établies par essai et leurs corrections (COD-01, COD-06, COD-07, COD-09, COD-11, COD-12, FMA-23), et à quelle fréquence un débutant les rencontre ;
- si l'éclairage rend bien les objets 3D environ deux fois trop clairs par rapport au fond : c'est déduit des fichiers, pas mesuré dans un rendu (PHY-06) ;
- le bruit de la loupe à densité 2 dans un navigateur (PHY-07) ;
- si le plafond de 5 s interrompt le calcul d'une photo sur les téléphones des testeurs (PHY-21) ;
- le coût réel d'une image du viseur, et si un viseur rendu en demi-flottants reste fluide (ARC-06, ARC-01) ;
- quels téléphones n'exposent pas le rendu en flottants (ARC-13), et si le Chrome du téléphone de Julien expose l'extension qui mesure le temps du processeur graphique (ARC-06) ;
- ce que donnent, avec un processeur graphique, les rafales de la recette de SIT-06 (FMA-19), et l'effet du retard d'une image de la carte de profondeur hors de la détection du chien (FMA-23) ;
- la cause de l'écart d'éclairage après la restauration du contexte WebGL, et ce que fait une perte de contexte pendant le calcul d'une photo (COD-12) ;
- pourquoi, à +4,5 IL, le rapport signal sur bruit lu est plus bas que le calcul (50:1 lus, 60:1 attendus ; FEX-05) ;
- la hauteur réelle du viseur sur un iPhone, quand les barres de Safari se replient ;
- si l'application charge quelque chose depuis les adresses extérieures écrites dans le code de Babylon.js (`cdn.babylonjs.com`, `unpkg.com`) : inconnu sans navigateur, et le rapport des licences n'en a ouvert aucun ; la lecture du code seule n'y trouve ni appel à l'inspecteur ou à l'environnement par défaut de Babylon.js, ni décodeur à télécharger.

Sur la routine et la CI :
- la cause de l'échec non expliqué de la routine du 12 novembre 2026 (délai dépassé à l'entrée du mode S) : INT-21 montre qu'un clic perdu sur le bouton qui clignote donnerait ce message, sans prouver que c'en est la cause ;
- pourquoi le même profil dure de 7 à 23 minutes d'un passage à l'autre.

Sur ce que font les vrais boîtiers :
- ce que la visée d'un hybride montre du flou de mouvement (PHY-03) ;
- ce qu'un Z 6 affiche pour un écart de 1/6 IL, la règle de l'option « Auto » de sa vitesse minimale, ce qu'il fait quand le sol entre dans une zone large, ce qu'il affiche en AF-S avant la mi-course, comment il annule un retardateur en cours ;
- ce qu'affiche un boîtier réglé en français pour une ouverture à décimale (D5) ;
- les noms des modes sur le Canon EOS RP et le Canon EOS 2000D, deux des six boîtiers du simulateur.

Sur les sources et le droit :
- si les 51 pages non relues existent encore et disent ce que leur libellé affirme ;
- une source pour l'addition des variances du bruit photonique et du bruit de lecture (PHY-04) ;
- si les lignes reprises d'un exemple de bgfx créent une obligation de licence, et si les fragments de Vite et de Rolldown sont une « substantial portion » au sens de la licence MIT (D13) ;
- si un accord de Renderpeople existe, sur quoi il porte, ce que disent ses conditions générales, et si elles s'appliquent à des fichiers pris sur Sketchfab sous CC BY 4.0 (D35) ;
- si le droit français écrit dans `docs/architecture.md` est exact.

Sur GitHub :
- le chemin exact, à l'écran, pour créer une règle de branche, et si le job d'une matrice peut être requis par son nom ;
- sous quelle identité l'outil de Claude fusionne ;
- le réglage actuel du dépôt pour l'approbation des workflows des tiers, et si l'environnement de publication refuse les déploiements venus d'une autre branche.

Sur le projet :
- si 191 notions et 49 situations sont utiles à un débutant, et si un débutant lit sans peine les formules des fiches : aucun test avec des débutants n'a eu lieu ;
- la langue des cinq testeurs prévus, donc ce que l'anglais apporte aux tests de la V1 minimale ;
- si la vitesse du chien (3,5 m/s) et sa taille sont réalistes : le code les donne comme des valeurs choisies, sans source.
