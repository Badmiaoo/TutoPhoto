# Audit du travail antérieur : synthèse et plan de corrections

Synthèse écrite le 15 novembre 2026 par un agent de Claude, à partir des douze rapports de ce dossier. Elle ne dit que ce que les rapports établissent ; les preuves restent dans les rapports, auxquels chaque identifiant renvoie.

- **La demande.** Julien, le 12 novembre 2026, à propos du travail fait jusque-là par le modèle précédent : il « doit être challengé et si nécessaire modifier », « que ce soit l'archi, les choix stratégiques ou les outils » ; « ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ». Le 13 novembre : « tu va finir l'audit correctement. Tu pousse le résultat sur git. »
- **La méthode.** Pour chaque rapport, un agent de Claude relit chaque source à son adresse, refait chaque calcul, confronte le code à la documentation et écrit ses constats. Un second agent essaie de réfuter chaque constat et écrit dessous son verdict, « confirmé » ou « réfuté », avec sa preuve ; il corrige au besoin la gravité ou la correction proposée, et un troisième agent contre-vérifie les constats que le second a ajoutés. Seuls les constats confirmés sont à corriger ; quand la contre-vérification a changé la gravité ou la correction, c'est elle qui est reprise ici.
- **Ce que couvre l'audit.** Le travail fait avant le 12 novembre 2026, c'est-à-dire jusqu'à la version 0.3.53. Les versions 0.3.54 à 0.3.57 (routine de test dans la CI, progression du chargement, grilles de cadrage, histogrammes) sont hors du périmètre, même quand le code lu est celui de la version 0.3.57 ou 0.3.58.
- **Les identifiants.** Chaque constat porte le préfixe de son rapport : PHY (modèle physique), FEX (fiches d'exposition), FMA (fiches de mise au point), ARC (architecture), CHX (choix et outils), SRC (sources), REF (contenu du référentiel), RST (structure du référentiel), COD (code), INT (interface), DOC (documentation), LIC (licences, scripts et CI). Les fiches de `docs/audit/synthese/` sont des documents de travail de cette synthèse, non relus par un second agent : la référence est cette page.

## En bref

- L'audit compte 186 constats : 160 confirmés et 26 réfutés. Gravité finale des 160 : 11 « faux », 6 « non sourcé », 21 « incohérent », 122 « à améliorer ».
- Ce qu'il conclut : le cœur tient, les fautes sont aux bords. Elles sont dans ce qu'un débutant joue à la lettre, dans ce qui se passe pendant le calcul d'une photo, dans ce que les contrôles ne regardent pas, et dans une documentation que l'on complète sans la relire.
- Fautes de l'application les plus graves : pendant le calcul d'une photo, un glissé sur le viseur fait tourner l'appareil entre les rendus (COD-01) et un toucher déplace le repère de mise au point sans faire le point (COD-07) ; au doigt, la rafale s'arrête si le doigt glisse sur le déclencheur (COD-09) ; après « Photo entière », la loupe de l'écran de revue agrandit un autre point que celui touché (COD-14) ; la page se fige ou reste muette si le fichier d'éclairage ou WebGL manquent (COD-06, COD-11).
- Fautes les plus gênantes pour qui suit une fiche : quand l'indicateur d'exposition clignote, son bouton ne répond qu'une demi-seconde sur deux (FEX-19, repris par INT-21) ; la recette de SIT-06, le chien qui court, échoue le plus souvent parce que l'autofocus perd l'œil du chien (FMA-23, FMA-19) ; les exercices d'exposition supposent l'ISO auto désactivé alors qu'il est activé au départ (FEX-02) ; la vue de dessus et le bulletin ne jugent pas les mêmes points (FMA-12).
- Fautes hors du site : la routine de test dit vert à tort (INT-05, INT-06) et n'envoie aucun toucher (INT-13) ; la documentation du modèle annonce un filé et un étalonnage de la scène que le code ne fait pas (PHY-01, PHY-06) ; les deux README sont périmés (DOC-02, DOC-01).
- Ce qui tient : les formules du modèle sont celles de leurs sources et leurs exemples se recalculent ; les citations des sources se retrouvent dans les pages joignables ; les données du référentiel sont saines ; les licences annoncées sont celles des pages d'origine ; les règles du dépôt ont été tenues (63 fusions avec une CI verte). Le choix du moteur n'est pas rouvert, et aucune décision de Julien n'est remise en cause.
- Le plan propose 46 sujets, un par pull request, en quatre parties : ce qui trompe ou bloque un débutant aujourd'hui, le socle de contrôles et de tests, les corrections de données puis les refontes, le ménage de la documentation et des outils.
- Il commence par afficher la version du site à l'écran (Sujet 1, ARC-12) : c'est petit, cela ne touche pas au rendu, et les corrections suivantes sont à confirmer par Julien sur son téléphone, ce qui demande de savoir quelle version il regarde. Viennent ensuite quatre corrections d'une ligne déjà essayées (Sujet 2), puis ce qui se passe pendant le calcul d'une photo (Sujet 3).
- 36 décisions attendent Julien ; 14 bloquent un sujet ou une partie de sujet, les 22 autres ne bloquent rien aujourd'hui. S'y ajoutent deux réglages de GitHub et des essais sur son téléphone.
- Limite de toutes les preuves : les essais sont faits dans Chromium en rendu logiciel, sur des écrans émulés. Rien n'a été essayé sur un téléphone, avec un processeur graphique ni dans Safari, et 51 des 151 sources examinées n'ont pas pu être relues.

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
- `fiches-exposition.md` : les explications disent ce que disent les sources relues, et les chiffres se recalculent avec le boîtier de départ. Les défauts sont dans les exercices joués à la lettre (ISO auto activé au départ, valeurs que l'indicateur ne peut pas afficher, boîtiers APS-C) et dans un bouton qui ne répond pas quand il clignote.
- `fiches-mise-au-point.md` : les sources disent ce que les fiches leur font dire, à deux phrases près. Les recettes de SIT-01 et de SIT-05 réussissent leur défi ; celle de SIT-06, suivie à la lettre, échoue le plus souvent, parce que la détection perd le chien. La vue de dessus et le bulletin ne jugent pas les mêmes points.
- `architecture-application.md` : la photo calculée par accumulation et la scène pilotée par une horloge sont à garder. Ce qui pèse : le viseur et la photo ne partagent pas leur développement, les réglages sont câblés à la main, il n'y a ni test rapide des formules, ni mesure du coût du viseur, ni version affichée. La contre-vérification ramène le plan de neuf refontes à cinq.
- `choix-et-outils.md` : les choix de fond ont presque tous une décision de Julien, datée et écrite, et leurs sources disent ce que la documentation leur fait dire ; le choix du moteur n'est pas rouvert. Sont confirmés : une documentation qui se recouvre, des décisions en attente dispersées, et l'absence de protection de `main` dans GitHub. Le rapport pose des questions de fond à Julien.
- `sources.md` : quand la page est joignable, les citations et les nombres des libellés y sont (68 citations : 64 retrouvées mot pour mot, 4 avec un écart qui ne change pas le sens). Aucun constat ne change une valeur du simulateur ni une phrase d'une fiche. Les défauts sont dans la tenue du fichier des sources. 51 entrées sur 151 n'ont pas pu être relues.
- `referentiel-contenu.md` : aucune affirmation de photographie contraire à une source lue, à deux réserves près. Les défauts : des textes du référentiel qui n'ont pas suivi les fiches ou les manuels, des renvois et des notions clés qui manquent à quelques situations. Que 125 notions n'aient pas encore de source est l'état voulu et écrit.
- `referentiel-structure.md` : les données sont saines et les comptes exacts. Les défauts sont dans ce que les contrôles ne regardent pas, et dans les identifiants `SIT-V2-NN`, que la construction des pages refuse. Sa section sur le périmètre pose des questions à Julien sans rien retirer.
- `code.md` : des fautes visibles pendant le calcul d'une photo, sur l'écran de revue et en cas d'échec du chargement. Les corrections tiennent le plus souvent en quelques lignes, essayées sur des copies. Rien ne fuit au fil des photos et les erreurs du calcul sont rattrapées.
- `interface.md` : les contrastes des textes et les termes du Nikon Z 6 sont justes. Les défauts : une routine qui dit vert à tort et n'envoie aucun toucher, une mise en page sur téléphone qui dépend de la longueur des textes (une seule refonte, à décider par Julien), un simulateur qui vouvoie, des noms accessibles à compléter.
- `documentation.md` : les deux README et la page des questions ouvertes n'ont pas suivi les versions ; le reste tient en quelques lignes. Les décisions sont datées et attribuées.
- `licences-scripts-ci.md` : les licences annoncées sont celles des pages d'origine, et l'historique ne contient rien de privé qui ne soit déjà consigné dans `docs/publication.md`. Les défauts : des contrôles qui ne lisent que l'état final des fichiers et croient ce qu'on leur déclare, deux workflows que l'on peut lancer hors de `main`, quatre phrases inexactes.

## Constats confirmés, par gravité

La gravité est celle du titre du constat, sauf quand la contre-vérification l'a baissée : c'est alors la sienne. La troisième colonne renvoie au sujet du plan qui traite le constat. Les notions et les situations sont désignées par leur identifiant du référentiel (EXP-04, SIT-06…).

### Faux (11)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-01 | `docs/camera-physique.md` annonce qu'en rafale, suivre le chien « donne un filé » ; le code garde l'appareil immobile pendant chaque pose, il n'y a pas de filé. | Sujet 15 |
| PHY-02 | La documentation dit le bruit de lecture du Nikon D5600 « non mesuré » au-delà d'ISO 2546, alors que la source a quatre points jusqu'à ISO 6400 ; faux pour le texte seulement, le rendu ne change pas. | Sujet 33 |
| COD-01 | Pendant le calcul d'une photo, un glissé sur le viseur fait tourner l'appareil entre les rendus : la photo est en surimpression et le viseur a tourné à la reprise. | Sujet 3 |
| COD-06 | Si le fichier d'éclairage n'arrive pas, il est compté comme reçu, la scène s'affiche sans ses objets, et un appui sur le déclencheur fige la page. | Sujet 8 |
| COD-07 | En AF-S, toucher le viseur pendant le calcul d'une photo déplace le repère sans faire le point : le repère reste vert et la photo suivante part à l'ancienne distance. | Sujet 3 |
| COD-09 | Rafale au doigt : un glissement de 20 px sur le déclencheur arrête la rafale, doigt encore posé (toucher émulé). | Sujet 2 |
| COD-11 | Dans un navigateur sans WebGL, le message prévu n'est jamais visible : restent un rectangle gris et des éléments vides. | Sujet 8 |
| COD-14 | Écran de revue : après « Photo entière », la loupe agrandit un point de l'ancienne fenêtre, pas le point touché. | Sujet 2 |
| INT-05 | Routine de test : le contrôle du réglage de départ de la mise au point relit un réglage que la routine vient de faire ; le réglage de départ n'est jamais contrôlé. | Sujet 19 |
| SRC-01 | L'adresse de la source `nikon-zr-mf-ring` mène au sommaire d'un menu, pas à la page que nomme son libellé ; rien de publié n'en dépend. | Sujet 28 |
| DOC-02 | `README.md` écrit « 96 sources » pour 172, « quatre personnages » pour cinq, et un titre daté du 8 novembre au-dessus d'un état du 12. | Sujet 40 |

### Non sourcé (6)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-03 | « Pas de flou de mouvement, comme dans le viseur d'un vrai appareil » : aucune page lue ne dit ce que la visée d'un hybride montre du temps de pose. | Sujet 15 |
| PHY-04 | La loi du bruit n'a pas de source dans le dépôt ; elle est juste d'après les pages lues, sauf l'addition des variances, qu'aucune page lue n'écrit. | Sujet 33 |
| PHY-05 | La formule du champ de vue n'a pas de source dans le dépôt, et rien ne dit qu'elle vaut pour une mise au point à l'infini. | Sujet 33 |
| FMA-02 | Fiche MAP-06 : « Hors de cette zone, l'appareil ne peut pas faire le point » n'est dans aucune des pages citées, et c'est trop large. | Sujet 6 |
| FMA-03 | Fiches SIT-05 et MAP-05 : « souvent le sol devant les pieds » est une règle du simulateur, donnée pour celle du boîtier. | Sujet 6 |
| REF-07 | 125 notions sur 191 n'ont pas de source, état voulu et écrit ; 20 d'entre elles affirment un fait précis qu'une page lue appuie. Aucune n'est dans le jalon de la V1 minimale, aucune phrase n'est fausse. | Sujet 34 |

### Incohérent (21)

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-06 | La documentation annonce une scène mise à l'échelle : rien de tel dans le code, et l'éclairage des objets 3D est environ deux fois plus fort que le fond (établi par les fichiers et le calcul, non mesuré dans un rendu). | Sujet 15 pour la documentation ; le réglage attend D15 |
| PHY-07 | Sur un écran de densité 2, la loupe du viseur montre un bruit plus faible qu'attendu (calculé à partir du code, non mesuré dans un navigateur). | Sujet 16 |
| PHY-08 | Le plafond du flou du viseur est compté en pixels calculés : à densité 2, il vaut la moitié sur le capteur, et les exemples de la documentation ne valent plus. | Sujet 15 ; relever le plafond attend D25 |
| PHY-09 | Une note de l'interface dit les réglages par défaut de la rafale et du retardateur « choisis », alors que le manuel du Z 6 les donne. | Sujet 15 |
| FEX-01 | Fiches EXP-04 et EXP-05, exercices : aucune vitesse ne « met la cellule à 0 », et f/4 affiche +0,8 IL, pas +1 IL ; la réponse et la leçon sont justes. | Sujet 5 |
| FEX-02 | Fiches EXP-04, EXP-05 et EXP-06 : au départ l'ISO auto est activé, comme sur le Z 6, et les fiches ne le disent pas ; fermer le diaphragme ne bouge alors ni l'indicateur ni le viseur. | Sujet 5 |
| FEX-03 | Fiche EXP-06 : « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit » donne la cause à l'envers. | Sujet 13 |
| FMA-12 | La vue de dessus juge un personnage à sa position au sol, le bulletin à ses yeux : pour la même photo, des repères verts et un bulletin qui écrit « manqués ». | Sujet 7 |
| FMA-22 | Fiche MAP-09 : elle décrit le Z 6 (cadre ambre dès qu'un visage est détecté) ; en AF-S, le simulateur ne détecte rien avant le toucher ou le déclenchement. | Sujet 6 ; le changement du simulateur attend D18 |
| COD-03 | `?lang=` et `?defi=` de l'adresse l'emportent encore après un choix fait dans la page : le choix est perdu au rechargement. | Sujet 10 |
| COD-04 | Après un changement de langue, la légende d'une photo déjà prise garde le résumé des réglages dans l'ancienne langue. | Sujet 9 |
| COD-08 | Pendant le calcul de la loupe, « Revenir au viseur » et « Vue suivante » restent actifs, et le résultat de la loupe s'impose ensuite. | Sujet 9 |
| INT-07 | Sept textes français du simulateur vouvoient ; l'accueil, l'activité et les fiches tutoient. | Sujet 11 |
| INT-12 | Le cadre est horizontal ou vertical selon la place que le panneau laisse au viseur, pas selon l'écran ; changer de mode AF ou de langue peut le faire basculer. | Sujet 15 pour la phrase de la documentation, Sujet 39 pour la bascule |
| INT-13 | Les profils « Android » et « iPhone » de la routine ne touchent jamais l'écran : tous les gestes sont ceux d'une souris. | Sujet 19 pour les deux phrases ; les gestes au toucher attendent (voir plus bas) |
| SRC-03 | Le champ `used_in` de `data/sources.yaml` a deux définitions écrites et n'en suit aucune. | Sujet 31 |
| REF-01 | Les situations SIT-V2-01 et SIT-V2-05, qui portent sur le flash, n'ont pas de champ `flash`, ce qui se lit « pas de flash » ; aucun code ne lit ce champ. | Sujet 29 |
| REF-02 | Le référentiel dit de la notion MES-07 « repérer en direct les zones brûlées » ; les manuels lus du Z 6 et de l'EOS R5 ne montrent les hautes lumières qu'à la lecture. La fiche publiée dit déjà juste. | Sujet 29 |
| RST-01 | Les identifiants `SIT-V2-NN` sont refusés par la construction des pages, par le schéma des fiches relues et par la fenêtre de fiche du simulateur. | Sujet 20 |
| DOC-01 | `README.en.md` est resté à la version 0.3.22 : il écrit « coverage 0 of 191 » pour 13 et ne décrit ni les fiches ni l'accueil. | Sujet 40 |
| LIC-08 | Quatre phrases de la documentation des licences et de la publication sont inexactes, dont « le site publié ne contient que notre code et celui de Babylon.js ». | Sujet 44 |

### À améliorer (122)

Modèle physique :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| PHY-10 | Cinq phrases du début de `docs/camera-physique.md` sont périmées. | Sujet 15 |
| PHY-11 | La diffraction n'est ni simulée ni dite. | Sujet 15 |
| PHY-12 | En modes A et S, la cellule donne la même mesure quel que soit le cadrage ; le débutant ne le lit nulle part. | Sujet 15 |
| PHY-13 | La capacité des photosites est donnée comme « modèle proposé », alors que la page de la source fait ce calcul. | Sujet 33 |
| PHY-14 | « La forme exacte de l'image n'est pas lue dans les sources » est faux pour trois boîtiers. | Sujet 33 |
| PHY-15 | Deux tableaux de la documentation disent encore « page non ouverte » pour l'EOS RP ; le capteur de trois boîtiers n'a qu'une source secondaire. Aucune valeur n'est fausse. | Sujet 33 ; D4 |
| PHY-17 | L'indicateur d'équilibre calcule la traînée du sujet au point de mise au point, pas à la position du sujet comme le fait le bulletin. | Sujet 7 |
| PHY-18 | Deux hypothèses du bruit ne sont pas dites (canaux de l'image, tirages gaussiens). | Sujet 33 |
| PHY-19 | La documentation dit le flou du viseur écrit « sans copie » ; sa boucle est celle d'un exemple de la bibliothèque bgfx, absente des licences et des crédits. | Sujet 15 pour la phrase, Sujet 44 pour la notice (D13) |
| PHY-20 | Le critère du sujet « figé » a une source dans un article déjà cité, qui n'est pas citée. | Sujet 33 |
| PHY-21 | Une photo interrompue par le plafond de 5 s a un flou de mise au point réduit, sans que la légende le dise (mesuré en rendu logiciel seulement). | Sujet 15 pour la phrase, Sujet 36 pour le code |

Fiches d'exposition, de mesure et de boîtier :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| FEX-04 | Fiche BOI-12 : valeurs justes, mais les délais du retardateur viennent d'une page non citée, et « 12 vues par seconde » est donné sans sa condition. | Sujet 13 |
| FEX-05 | Fiche EXP-06, exercice : la comparaison demandée à ISO 6400 se fait à +4,5 IL, sans dire où viser ni quoi conclure. | Sujet 5 |
| FEX-06 | Les exercices de MES-04, MES-10, BOI-08 et BOI-12 dépendent de réglages non écrits, que le simulateur mémorise d'un exercice à l'autre. | Sujet 5 |
| FEX-07 | Fiches EXP-05 et BOI-07 : 1/4000 s est la limite de TutoPhoto, pas celle du Z 6 ; dans le parc, le cas « pas assez de lumière » n'arrive jamais en mode A. | Sujet 13 |
| FEX-08 | Le référentiel prévoit ce que le simulateur n'a pas (diaphragme animé, rideau animé, mode silencieux…), sans que les fiches le disent. | Sujet 13 ; D17 |
| FEX-09 | Fiche MES-04 : elle ne dit pas que la cellule de TutoPhoto mesure partout la même chose. | Sujet 13 |
| FEX-11 | Vocabulaire : deux noms pour l'indicateur d'exposition, « loupe » dans un texte anglais, deux titres de pages de Nikon mal cités, liens français manquants. | Sujet 13 |
| FEX-12 | Trois petites inexactitudes dans les fiches EXP-05 et EXP-06. | Sujet 13 |
| FEX-13 | « 1/1000 s fige le chien » ne vaut qu'en plein format ; avec les trois boîtiers APS-C du simulateur, il faut 1/1250 s. | Sujet 5 |
| FEX-14 | Fiche MES-10 : trois formulations plus larges que les pages lues sur la vitesse minimale de l'ISO auto. | Sujet 13 |
| FEX-15 | Les fiches BOI-07, BOI-08 et BOI-12 n'ont que les noms de Nikon, alors que quatre des six boîtiers du simulateur sont des Sony ou des Canon. | Sujet 17 |
| FEX-16 | Les fiches françaises écrivent « f/5.6 », l'interface française « f/5,6 ». | Sujet 18 |
| FEX-17 | Fiche BOI-07, en français : « ouvre à f/2 ou plus » se lit dans les deux sens. | Sujet 5 |
| FEX-18 | Les fiches EXP-04, EXP-05 et EXP-06 citent Wikipedia sans dire « source secondaire » ; deux dates de lecture ne concordent pas. | Sujet 32 |
| FEX-19 | Quand l'indicateur d'exposition clignote, le bouton qui ouvre la fenêtre « Exposition » ne prend ni les clics ni le focus une demi-seconde sur deux. | Sujet 2 |

Fiches de mise au point, de netteté, de mouvement et de lumière ; situations ; activité de LUM-02 :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| FMA-01 | Fiche MAP-04, exercice : ni le défi, ni le mode, ni la vitesse ne sont écrits au début. | Sujet 6 |
| FMA-04 | Fiche NET-06 : elle ne dit pas que le fond photo ne change pas de perspective quand l'appareil avance. | Sujet 14 |
| FMA-06 | Fiche MVT-01 : le critère « figé » est présenté comme une règle alors que c'est un choix de TutoPhoto, et rien ne dit que le bulletin ne juge que le déplacement d'ensemble du sujet. | Sujet 33 |
| FMA-07 | Fiche SIT-01 : la lumière, qui est dans le titre et les notions clés, n'a pas de ligne dans la recette. | Sujet 14 |
| FMA-08 | Trois formulations ambiguës dans les fiches MAP-09, LUM-02 et MAP-05. | Sujet 6 |
| FMA-09 | Les fiches NET-01, NET-06 et MVT-01 citent Wikipedia sans dire « source secondaire » ; une date de lecture ne concorde pas, une autre manque. | Sujet 32 |
| FMA-10 | Activité de LUM-02 : la pénombre annoncée peut dépasser le mur dessiné, et la légende dit « ombre pleine au centre » quand il n'y en a pas. | Sujet 12 |
| FMA-11 | Fiche MAP-04 : dans le parc, l'AF-S verrouillé sur le chien réussit le défi comme l'AF-C ; l'exercice n'oppose pas les deux modes. | Sujet 6 ; D26 |
| FMA-13 | Fiche MVT-01, exercice : « 1/200 s » et « 1/800 s » ne valent qu'en plein format et au 50 mm. | Sujet 5 |
| FMA-14 | Les fiches MAP-04, MAP-05, MAP-06 et MAP-09 n'ont que les noms de Nikon. | Sujet 17 |
| FMA-15 | Le champ `sources` des notions NET-01, LUM-02 et MAP-04 ne liste pas une source que leur fiche cite. | Sujet 29 |
| FMA-16 | Fiche NET-06, exercice : après le déplacement de l'appareil, il faut refaire la mise au point, et l'exercice ne le dit pas. | Sujet 6 |
| FMA-17 | Un défi est « réussi » sur une photo surexposée de 3,8 IL : aucun défi ne juge l'exposition, choix écrit que le débutant ne lit nulle part. | Sujet 6 ; D20 |
| FMA-18 | Fiche SIT-05 : au 50 mm, le défi réussit à toutes les ouvertures ; la profondeur de champ n'y joue pas. | Sujet 14 |
| FMA-19 | Fiche SIT-06 : le défi est « réussi » sur une vue où la tête du chien est cachée, et, recette suivie à la lettre, la mise au point quitte le chien. | Sujet 4 ; D19 |
| FMA-21 | La section « Notions » des fiches SIT-01 et SIT-06 ne liste pas toutes les notions que la recette cite. | Sujet 14 |
| FMA-23 | En AF-C, la détection perd l'œil du chien alors que rien ne le cache, et la mise au point saute au sujet le plus proche. | Sujet 4 |

Architecture de l'application :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| ARC-01 | Le viseur et la photo ne partagent pas leur développement (exposition, courbe, écrêtage, bruit) : chaque fonction d'image s'écrit deux fois. | Sujet 37 |
| ARC-02 | Un réglage du boîtier se câble à la main à huit endroits de `cameraPanel.ts` et dans plusieurs autres fichiers. | Sujet 38 |
| ARC-03 | La scène est écrite dans le code, et ce qui lui est propre est réparti dans dix fichiers. | sans correction maintenant |
| ARC-05 | Aucun test rapide des formules ; la routine est un seul scénario de 862 lignes, qui prend de 20 à 27 minutes dans la CI. | Sujet 25 |
| ARC-06 | Ni le coût d'une image du viseur ni la mémoire graphique ne sont mesurés. | Sujet 26 |
| ARC-07 | Les mêmes formules et les mêmes constantes sont écrites à plusieurs endroits. | Sujet 25 |
| ARC-08 | La suspension du viseur pendant le calcul d'une photo est écrite à la main, à un seul endroit. | Sujet 37 |
| ARC-09 | `docs/architecture.md` décrit encore un moteur 2.5D ; aucune page ne décrit la structure de l'application. | Sujet 27 |
| ARC-10 | La ligne « bruit » du bulletin vient du viseur, pas de la photo. | Sujet 15 pour une phrase ; le reste sans correction maintenant (D21) |
| ARC-12 | Le site publié ne dit nulle part quelle version il est. | Sujet 1 |
| ARC-13 | La photo et l'autofocus supposent le rendu dans des textures en flottants, et aucune capacité de l'appareil n'est lue. | Sujet 26 |
| ARC-14 | L'indicateur d'équilibre n'est pas suspendu pendant le calcul d'une photo et affiche alors un bruit faux. | Sujet 3 |

Choix de fond et outils :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| CHX-01 | Le récit de chaque version s'écrit dans quatre à onze fichiers, et trois journaux tiennent le même fil. | Sujets 40, 41 et 46 |
| CHX-02 | Les deux effets de Babylon.js qui ont fait choisir le moteur ne servent plus ; trois lignes de `docs/pile-technique.md` sont périmées. Le choix du moteur n'est pas rouvert. | Sujet 42 |
| CHX-03 | Rien, dans GitHub, n'empêche de pousser sur `main` ni de fusionner avec une CI rouge ; la règle a pourtant été tenue pour les 63 fusions. | réglage de Julien, à la fin du plan |
| CHX-05 | Les titres des notions sont recopiés à la main dans les fiches et dans `challenges.ts` ; aucun contrôle ne les compare à `data/`. | Sujet 22 |
| CHX-06 | `scripts/extract_reprise.py`, lancé sans argument, écrit seize fichiers dans le dossier courant, dont quinze diffèrent de ceux du dépôt. | Sujet 43 |
| CHX-10 | Trois attentes anciennes manquent à la liste « Ce qui attend Julien », dont trois tags jamais posés. | Sujets 24 et 41 |

Sources :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| SRC-02 | La note de la source `suncalc` dit qu'aucune version n'est publiée ; le dépôt en porte douze. | Sujet 28 |
| SRC-04 | 75 entrées de `data/sources.yaml` n'ont ni date ni mention de lecture. | Sujet 31 |
| SRC-05 | Deux pages npm citées dans `docs/pile-technique.md` n'ont pas d'entrée dans `data/sources.yaml`. | Sujets 28 et 31 |
| SRC-06 | Trois adresses sont imprécises (`nikon-z8-guide`, `canon-m50ii-metering`, `wikipedia-zone-system`). | Sujet 28 |
| SRC-07 | Deux sources viennent d'appareils hors du public visé, sans que leur libellé le dise. | Sujet 28 |
| SRC-10 | La source `fujifilm-x100t-photometry` vient d'un compact à objectif fixe, sans que son libellé le dise. | Sujet 28 |

Contenu du référentiel :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| REF-03 | « Mise au point par zone » (MAP-16) se confond avec les « zones » de l'autofocus des trois marques. | Sujet 29 |
| REF-04 | Cinq notions qui ont une fiche n'ont pas, dans leur champ `sources`, toutes les sources de la fiche. | Sujet 29 |
| REF-05 | Notion BOI-09 : l'explication dit « lumière stable », l'exercice « lumière changeante ». | sans correction maintenant |
| REF-08 | Quatre termes ne sont ceux d'aucun des trois manuels français lus ; le référentiel n'a pas de champ pour les termes de chaque marque. | Sujet 29 ; D3 |
| REF-09 | Le trépied (MVT-12) ne renvoie qu'à deux situations ; cinq autres en demandent un ou s'y rapportent. | Sujet 30 |
| REF-10 | Situation SIT-42, sous l'eau : rien ne dit qu'un reflex ou un hybride n'est pas étanche. | Sujet 30 |
| REF-11 | Situation SIT-16, architecture : la seule notion clé qui redresse les verticales demande un objectif spécial. | Sujet 30 |
| REF-12 | Situation SIT-28, autoportrait : « Anatomie du boîtier » y est notion clé sans rien avoir de propre à l'autoportrait. | Sujet 30 |
| REF-15 | Notion OPT-12 : « vers 53 à 56° » ne dit pas depuis quoi l'angle se mesure. | Sujet 29 |
| REF-17 | Trois petites inexactitudes (MVT-08, MAP-04, BOI-31). | Sujet 29 |
| REF-18 | Aucune notion ne parle de corriger la perspective après la prise, fonction que le Z 6 a dans son menu Retouche. | Sujet 30 |

Structure du référentiel :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| RST-02 | Une fiche dont l'identifiant n'existe pas, ou est retiré, est publiée sans erreur. | Sujet 22 |
| RST-03 | Aucun contrôle ne voit un identifiant renuméroté ou supprimé. | Sujet 22 |
| RST-04 | Une clé YAML écrite deux fois est acceptée en silence, la seconde écrase la première. | Sujet 21 |
| RST-05 | Le champ `since` et la règle du numéro Y ne sont contrôlés par rien. | Sujet 22 ; D9 |
| RST-06 | Un écart à la règle de niveau d'une situation n'est qu'un avertissement, que la CI laisse au vert. | Sujet 21 |
| RST-07 | Aucun contrôle de doublon dans les listes du référentiel. | Sujet 21 |
| RST-09 | Le calcul de couverture et le site n'ont pas la même définition des situations d'une notion ; seul écart réel, la page de BOI-07 n'a pas de section « Situations ». | Sujet 14 pour la ligne ; D27 pour la règle |
| RST-10 | Les notions RET-01 et RET-02, reportées en V2, n'ont pas de note qui le dise. | Sujet 29 |
| RST-11 | `docs/lire-le-referentiel.md` ne décrit pas tous les champs que les schémas acceptent. | Sujet 31 |
| RST-13 | Une fiche de situation réduite à son titre compterait comme « rédigée » et serait publiée. | Sujet 20 |

Code de l'interface :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| COD-02 | Retardateur : si la fin du compte à rebours tombe pendant le calcul de la loupe, la vue est perdue sans message. | Sujet 9 ; D1 |
| COD-05 | Rafale dont une vue échoue : le message d'erreur est aussitôt remplacé par la première vue réussie. | Sujet 9 |
| COD-12 | Contexte WebGL perdu : aucun message, et après la restauration les objets éclairés sont plus sombres (rendu logiciel). | Sujet 8 |
| COD-13 | Six petits défauts d'état et de code mort. | Sujets 8, 9, 10 et 11, au passage |

Interface et routine de test :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| INT-01 | L'identifiant `situation` est porté par deux éléments de l'accueil : depuis une fiche anglaise, le fil d'Ariane vise le bloc français masqué. | Sujet 11 |
| INT-02 | Activité de LUM-02 : la source de lumière du schéma fait 4 × 2 px à 390 px de large, à 1,62:1 de contraste. | Sujet 12 |
| INT-03 | Téléphone émulé tenu à l'horizontale : le cadre fait 117 × 78 px. | Sujet 39 |
| INT-04 | La hauteur du viseur dépend de chaque texte du panneau : de 159 à 266 px pour la même fenêtre. | Sujet 39 |
| INT-06 | Routine : une erreur JavaScript pendant le scénario ne la fait pas échouer. | Sujet 19 |
| INT-08 | Le viseur, la carte et la photo ne répondent qu'au pointeur, pas au clavier. | Sujet 35 ; D23 |
| INT-09 | Huit textes ne sont écrits que dans des infobulles, invisibles au doigt et au clavier. | Sujet 35 |
| INT-10 | Aucun libellé ne dépend de la marque choisie : avec un Canon ou un Sony, tout reste dit dans les termes du Nikon Z 6. | Sujet 17 |
| INT-11 | Sur téléphone émulé, deux pastilles du viseur sont coupées ou recouvertes. | Sujet 39 |
| INT-14 | La routine n'essaie jamais l'anglais, le téléphone à l'horizontale, 320 px de large, le clavier, le toucher, le retardateur, ni plusieurs autres cas. | Sujets 25 et 39 |
| INT-15 | Six défauts de l'arbre d'accessibilité (valeurs sans nom, rôles manquants, messages réécrits en boucle). | Sujet 35 |
| INT-16 | Les noms accessibles « Ouverture : plus » et « Vitesse : plus » disent l'inverse de la grandeur nommée. | Sujet 35 |
| INT-17 | Sur téléphone émulé, la photo prise s'affiche plus petite que le viseur, et la suivante s'ouvre déjà défilée. | Sujet 2 pour le défilement, Sujet 39 pour le reste |
| INT-18 | Trois repères graphiques sont sous 3:1 de contraste. | Sujet 35 |
| INT-19 | Huit petits défauts de libellés et de structure. | Sujets 11 et 35 |
| INT-20 | Sur téléphone émulé, des fenêtres sont plus hautes que l'écran, avec « Fermer » tout en bas. | Sujet 39 |
| INT-21 | Même défaut que FEX-19 ; s'y ajoute ce qu'il coûte à la routine de test. | Sujet 2 |

Documentation :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| DOC-04 | Trois titres de `CHANGELOG.md` sont datés de la veille de la fusion, et rien ne dit de quoi la date est la date. | Sujet 24 |
| DOC-06 | `docs/questions-ouvertes.md` garde sept mentions de points faits ou tranchés. | Sujet 41 |
| DOC-07 | Trois phrases périmées dans `docs/cadrage.md`, `docs/contenus.md` et `docs/architecture.md`. | Sujet 42, et Sujet 27 pour `docs/architecture.md` |
| DOC-09 | `REPRISE.md` ne dit nulle part qu'il est une archive ; son en-tête dit « Ce fichier fait foi ». | Sujet 43 |
| DOC-11 | Le dossier `content/` manque au tableau « Contenu du dépôt » de `README.md`. | Sujet 40 |
| DOC-12 | « 34 Mo » pour 34 Mio, et « flou de bougé » pour la traînée du chien. | Sujets 41 et 42 |

Licences, scripts et CI :

| Constat | Ce qui est établi | Traité par |
| --- | --- | --- |
| LIC-01 | `scripts/check_public.py` ne lit pas ce qu'un commit ajoute et qu'un commit suivant retire : cela reste dans l'historique publié sans contrôle. | Sujet 23 |
| LIC-02 | Des formes courantes de ce que la règle de confidentialité interdit passent le contrôle. | Sujet 23 |
| LIC-03 | Fichiers binaires, noms de fichiers, noms d'auteurs et étiquettes ne sont pas contrôlés, et la documentation ne le dit pas. | Sujet 23 |
| LIC-04 | `scripts/changelog.py check` : une base introuvable passe en silence, et un titre étranger peut tronquer le texte d'un tag. | Sujet 24 |
| LIC-05 | `scripts/check_scenes.py` croit le manifeste de la scène sur parole. | Sujet 45 |
| LIC-07 | Les workflows `tag.yml` et `pages.yml` peuvent être lancés à la main sur une autre branche que `main`. | Sujet 24 |
| LIC-10 | `docs/publication.md` : « même alors, le site publié reste public » est juste, mais la page citée ne le dit pas, et la phrase est trop large d'un cas. | Sujet 44 |

## Plan de corrections

Section en cours d'écriture.

## Décisions qui attendent Julien

Section en cours d'écriture.

## Constats confirmés sans correction à faire maintenant

Section en cours d'écriture.

## Constats réfutés

Section en cours d'écriture.

## Ce que l'audit n'a pas couvert

Section en cours d'écriture.

## Je ne sais pas

Section en cours d'écriture.
