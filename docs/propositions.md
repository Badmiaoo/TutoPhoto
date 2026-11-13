# Propositions à trancher

Rédigées par Claude le 11 novembre 2026, pendant que Julien était absent. Il avait demandé de continuer seul pour compléter la V1, puis de préparer la V2. `CLAUDE.md` demande de proposer avant de produire : rien de ce qui suit n'était construit.

**Décisions de Julien, le 11 novembre 2026 au soir** : les quatre points sont tranchés (détail en tête de chaque section). Activité de LUM-02 en schéma 2D ; protocole de test tel quel ; pour étendre, **tous** les testeurs doivent réussir chaque défi sans aide et mieux répondre après qu'avant ; ordre de travail après les tests tel quel.

## 1. Activité interactive de LUM-02 (lumière dure ou douce)

**Tranché le 11 novembre 2026 : option A, le schéma interactif en 2D.** Construit en version 0.3.50 (`activites/LUM-02/`), sans préréglage « soleil » : il attend une source primaire.

**Contexte.** Le 10 novembre 2026, Julien a placé le simulateur de LUM-02 en V2, et prévu une activité interactive pour la V1 (`docs/cadrage.md`). La fiche propose pour l'instant une activité à faire chez soi, avec une lampe, un objet et un mur blanc. Il manque l'activité dans TutoPhoto.

**Ce que disent les sources lues.**
- Une source est douce quand elle paraît grande par rapport au sujet qu'elle éclaire. Le soleil, très loin, paraît petit ; par ciel couvert, tout le ciel devient la source ; reculer une source la rend plus dure ; un réflecteur devient lui-même une source. Ce sont les deux sources de la fiche : [guide Lowel de Tiffen](https://tiffen.reamaze.com/kb/lowel-guides/foundations-of-lighting-understanding-soft-light) et [Art Adams, ProVideo Coalition, 27 décembre 2011](https://www.provideocoalition.com/lighting_strategies_what_makes_soft_lights_cast_soft_shadows/).
- La pénombre est la zone où la source n'est cachée qu'en partie. Avec une source ponctuelle, il n'y a qu'une ombre pleine, sans pénombre ([Wikipedia, « Umbra, penumbra and antumbra », révision 1379008615](https://en.wikipedia.org/w/index.php?title=Umbra,_penumbra_and_antumbra&oldid=1379008615), source secondaire, lue le 11 novembre 2026).

**Options.**

| Option | Ce que fait le débutant | Pour | Contre |
| --- | --- | --- | --- |
| A. Schéma interactif en 2D | Une source ronde, un objet, un mur. Deux curseurs : taille de la source et distance source–objet. L'ombre pleine et la pénombre se dessinent, puis une question : « quel réglage donne la lumière la plus douce ? ». Préréglages : petite lampe, grande fenêtre, réflecteur. | Léger, lisible sur téléphone, sans photo à trouver. Le dessin suit des rayons en ligne droite (calcul par triangles semblables, à expliquer dans la fiche). | C'est un schéma : on voit une ombre, pas un visage. |
| B. Paires de photos et quiz | Le même sujet en lumière dure et en lumière douce ; le débutant dit laquelle est laquelle, et pourquoi. | Parlant, sur un vrai visage. | Il faut des photos sous CC0 ou CC BY, ou prises par Julien. Peu interactif. |
| C. Petite scène 3D | Un buste éclairé par une source réglable. | Proche de la réalité. | C'est presque le simulateur prévu en V2, et le réalisme des ombres douces de Babylon.js reste à vérifier. |

**Recommandation : A.** Si Julien la retient, un préréglage « soleil » demande la taille apparente du soleil. [Wikipedia, « Angular diameter », révision 1368815265](https://en.wikipedia.org/w/index.php?title=Angular_diameter&oldid=1368815265) donne de 31′27″ à 32′32″, mais ce n'est qu'une source secondaire : je chercherai une source primaire avant de l'utiliser.

## 2. Protocole de test avec les débutants

**Tranché le 11 novembre 2026 : protocole retenu tel quel, avec 5 testeurs.**

**Déjà tranché** (7 novembre 2026) : les testeurs sont des débutants de l'entourage de Julien. **Restent** le nombre, le déroulé et les critères pour décider d'étendre.

**Nombre.** Je propose 5 personnes, un nombre qui tient dans un entourage. C'est un choix, non sourcé : je n'ai lu aucune source sur le nombre de testeurs.

**Appareils.** Chaque testeur utilise son propre téléphone ou ordinateur, pour mesurer ce que la routine de test n'émule pas : processeur graphique, Safari, mémoire. Noter le modèle de l'appareil et le navigateur, ce qui aidera aussi pour le chargement sans fin vu sur le téléphone de Julien le 9 novembre.

**Déroulé proposé (45 minutes environ).**
1. **Avant (5 minutes)** : trois questions, sans aide.
   - « Pour flouter le fond, tu ouvres ou tu fermes le diaphragme ? »
   - « Que fait l'autofocus continu ? »
   - « Que règle l'ISO auto ? »
2. **Découverte (5 minutes)** : le testeur parcourt l'accueil et dit à voix haute ce qu'il comprend. On ne l'aide pas.
3. **Trois tâches (30 minutes)** :
   - depuis l'accueil, trouver la recette de la photo de groupe et réussir le défi SIT-05 ;
   - réussir le défi SIT-01 ;
   - réussir le défi SIT-06.

   On observe sans aider : temps passé, nombre de photos, endroits où il bloque, fiches ouvertes depuis le bulletin.
4. **Après (5 minutes)** : les trois mêmes questions, puis « qu'est-ce qui t'a gêné ou manqué ? ».

**Relevé.** Une grille par testeur, sans nom : appareil et navigateur, chargement réussi ou non, défis réussis et nombre d'essais, blocages, réponses avant et après. Seule une synthèse anonyme entre dans le dépôt, qui est public (`docs/publication.md`).

**Critères pour étendre.** Tranché le 11 novembre 2026 : « la plupart » devient **tous les testeurs**. Les quatre critères :
- Aucun blocage technique sur les appareils des testeurs : la scène se charge et la photo se calcule.
- Chaque défi est réussi par tous les testeurs sans aide extérieure, fiches comprises.
- Les réponses d'après sont meilleures que celles d'avant pour tous les testeurs.
- Les problèmes relevés sont corrigés.

## 3. Après la V1 minimale

**Tranché le 11 novembre 2026 : ordre de travail retenu tel quel.**

**Vocabulaire.** Depuis le 7 novembre 2026, toute la V1 est le référentiel entier : 191 notions et 49 situations (`docs/cadrage.md`). La V1 minimale (le parc, SIT-01, SIT-05, SIT-06) en est la première tranche. La V2 regroupe ce que Julien a renvoyé à plus tard.

**Déjà renvoyé en V2 par Julien :**
- le solveur de situations, qui calcule une recette à partir de « où, quand, quoi, pourquoi » (10 novembre 2026) ;
- le simulateur de LUM-02 (10 novembre 2026) ;
- la couverture de l'autofocus des reflex Nikon D5600 et Canon EOS 2000D (11 novembre 2026) ;
- la correction de la photo après la prise, RET-01 et RET-02 (`docs/camera-physique.md`).

**Placé après les tests de la V1 minimale** (Julien a laissé le moment à Claude le 9 novembre 2026) : balance des blancs (COU-02), grilles de composition (CMP-02), histogramme (MES-06). Dans la nuit du 11 au 12 novembre 2026, Julien demande à Claude de continuer seul ; Claude le comprend comme la levée de l'attente des tests (`docs/etat-des-travaux.md`) : les grilles sont faites en version 0.3.56, et les histogrammes et les hautes lumières de l'écran de revue en version 0.3.57, avec les choix de la section 4.

**Ordre retenu, une fois les tests faits :**
1. Corriger ce que les tests révèlent, et finir la relecture des 19 fiches.
2. Balance des blancs, grilles et histogramme : ils servent dans presque toutes les situations, et leurs sources sont en partie lues (`docs/camera-physique.md`).
3. Situations qui pourraient réutiliser la scène de parc (extérieur, jour, personnes ou chien). C'est une estimation de Claude, à vérifier situation par situation :
   - SIT-28 (autoportrait au retardateur) ;
   - SIT-V2-02 (portrait : choisir sa distance) ;
   - SIT-V2-06 (plongée et contre-plongée).

   Limite connue : le fond photo à 360° est pris d'un seul point, et sa perspective ne change pas quand l'appareil bouge ou monte.
4. Le solveur de situations (V2), avant de multiplier les situations : écrire chaque recette à la main ne tient pas sur 49 situations.
5. Les scènes suivantes, choisies selon les situations de niveau N1 qu'elles débloquent, par exemple une pièce avec une fenêtre pour SIT-04, SIT-23 et SIT-39. Chaque scène demande ses modèles 3D sous licence CC0 ou CC BY.
6. Le simulateur de LUM-02 et des autres notions de lumière, avec une scène dont l'éclairage peut changer : le fond du parc est une photo par ciel couvert.

**À reprendre au passage** : `docs/architecture.md`, en partie caduque depuis l'abandon de la 2.5D (avertissement en tête du fichier).

## 4. Choix faits par Claude dans la nuit du 11 au 12 novembre 2026, à confirmer

`CLAUDE.md` demande de proposer avant de produire. Julien dormait et avait demandé à Claude de continuer seul (`docs/etat-des-travaux.md`) : pour chaque fonction, la spécification gardée dans `docs/specifications/` a tenu lieu de proposition. Chaque choix ci-dessous a été fait sans Julien. Il peut le confirmer, ou l'annuler : chaque fonction a sa version, que l'on retire par `git revert -m 1` de son commit de fusion.

### Grilles de cadrage (CMP-02, version 0.3.56)

**Tranché par Julien le 12 novembre 2026**, avant la fusion de la version. Spécification : `docs/specifications/grilles.md`. Sources et fonctionnement : `docs/camera-physique.md`, « Grilles de cadrage (version 0.3.56) ».

| N° | Choix proposé par Claude | Décision de Julien |
| --- | --- | --- |
| 1 | La grille est une aide de TutoPhoto, la même pour tous les boîtiers, et non la copie du menu de chaque boîtier. | Retenu, après avoir d'abord choisi un menu par boîtier : « Mmmh en vrai les grilles sont des outils plutôt "global" ça fait partie de la composition et en vrai tous les boitiers ont les mêmes. Donc faisons les même pour tous les boitiers, 3*3 9*9 ect.. tous les plus communes ». |
| 2 | Deux tracés seulement, « Tiers » et « Seize cases ». | Élargi par la même réponse : les grilles les plus communes. Claude ajoute les deux autres que les manuels lus nomment, « 6x4 » et « 3x3+diag » de Canon (EOS 850D, EOS R6). Aucune page lue ne nomme une grille « 9*9 » : elle n'est pas ajoutée, et je ne sais pas si Julien désignait par là les neuf cases de la grille 3 × 3. |
| 3 | La grille est masquée quand la loupe agrandit l'image. | Retenu. |
| 4 | La grille n'est dessinée ni sur la photo ni sur l'écran de revue. | Retenu : viseur seulement. |
| 5 | Noms français des réglages de Sony : ceux du guide de l'A7 III, la page française du guide de l'A6000 étant introuvable. | Retenu. |
| 6 | La fiche CMP-02 ne dit rien sur « quand centrer » ni sur la symétrie, et l'écrit. | Chercher une source, puis compléter la fiche dans une version suivante. |
| 7 | CMP-02 hors du jalon de la V1 minimale, fiche SIT-01 inchangée. | Changé : CMP-02 est ajoutée au jalon (17 notions) et citée dans la fiche de SIT-01. |

Restent des choix de Claude, non sourcés et dits comme tels : l'aspect des traits ; le sens de la grille « 6x4 » (six cases sur le grand côté) et le tracé des diagonales, déduits du nom et de l'icône de Canon.

### Histogrammes et hautes lumières sur l'écran de revue (MES-06, MES-07, version 0.3.57)

Spécification : `docs/specifications/histogramme-revue.md`, avec ses écarts. Sources et fonctionnement : `docs/camera-physique.md`, « Histogrammes et hautes lumières sur l'écran de revue (version 0.3.57) ».

| N° | Choix fait | Pourquoi | Autre voie |
| --- | --- | --- | --- |
| 1 | D'abord l'écran de revue. L'histogramme en direct dans le viseur et les zébrures à la prise de vue viennent dans une autre version. | La photo calculée donne les valeurs exactes de ses pixels. Lire l'image du viseur à chaque instant a un coût à mesurer sur téléphone ; le manuel du Z 6 ne décrit les hachures des hautes lumières qu'en vidéo, et l'échelle IRE des zébrures de Sony n'est pas sourcée. | Commencer par l'histogramme du viseur, que les deux boîtiers proposent par la commande DISP. |
| 2 | Un bouton « Infos », sous la photo, fait défiler trois affichages : photo seule (par défaut), histogrammes, hautes lumières. Le choix est mémorisé. | C'est le geste des deux boîtiers à la lecture (commande DISP), et leurs réglages de lecture valent pour l'affichage qui suit la prise (Sony, « Auto Review »). Sous la photo, le bouton reste visible sans faire défiler l'écran ; la légende et le bulletin descendent d'une ligne. | Deux cases à cocher ; la suite exacte des pages de chaque boîtier ; un bouton avec les autres, en bas de l'écran de revue. |
| 3 | Luminance = 0,2126 R + 0,7152 V + 0,0722 B, arrondie, sur les valeurs encodées de la photo ; 256 colonnes ; hauteur rapportée à la plus haute colonne, sans compter les colonnes 0 et 255. | Aucune page lue ne donne le calcul d'un boîtier, et le manuel du Z 6 ne définit pas son « Histogram (RGB channel) ». Les coefficients sont ceux de la norme sRGB (Wikipedia, source secondaire), qui les applique à des valeurs linéaires. Sans l'exclusion des colonnes 0 et 255, un pic d'écrêtage écraserait le reste du tracé. | Luminance calculée en lumière linéaire, puis encodée ; moyenne des trois couches ; échelle verticale logarithmique. |
| 4 | Une zone est signalée quand au moins une couche vaut 255. | Seule valeur de seuil écrite dans les pages lues (Nikon, affichage vidéo g6 : à 255, « only areas that are potentially overexposed »). | Un seuil plus bas, ou réglable comme le réglage g6 ; un seuil sur la luminance et non sur chaque couche. |
| 5 | Les zones clignotent en noir, une seconde en noir, une seconde visibles, quel que soit le boîtier ; seules les zones surexposées clignotent. Si le système demande de réduire les animations, elles restent en noir. | Sony écrit que la zone clignote, sans rythme ; le manuel du Z 6 ne dit pas comment sa page « Highlights » marque les zones (son illustration montre un contour pointillé). L'alerte des zones sous-exposées de Sony n'est pas reprise : la notion porte sur la surexposition. | Clignotement avec les boîtiers Sony seulement, contour fixe avec le Z 6 ; alerte des zones sous-exposées ; alternance noir et blanc. |
| 6 | Les zones ont leur affichage à part, comme la page « Highlights » du Z 6, alors que l'A7 III les fait clignoter dans l'affichage des histogrammes. | Sur un écran de téléphone, la photo est réduite pour loger les histogrammes : les zones se lisent mieux sur la photo en grand. | Faire clignoter les zones dans l'affichage des histogrammes, comme Sony. |
| 7 | Avec les histogrammes, la photo est réduite pour qu'ils tiennent sous elle ; pas avec la loupe, où l'écran de revue défile. | Les illustrations des deux manuels montrent la photo en vignette à côté des histogrammes ; la loupe doit garder un pixel de l'image par pixel de l'écran. | Garder la photo en grand et faire défiler l'écran ; histogrammes à côté de la photo sur un écran large. |
| 8 | Textes : « de la partie affichée » avec la loupe ; « moins de 0,1 % » pour une part non nulle plus petite ; une note « Lecture et limites », repliée, dit les axes, les choix non sourcés et ce qui n'est pas simulé. | La spécification ne donnait que la phrase « … : 3,2 % de l'image » ; une part non nulle écrite « 0,0 % » contredirait les zones qui clignotent. | S'en tenir à la phrase de la spécification. |
| 9 | Les textes n'écrivent pas que les histogrammes d'un boîtier portent sur son image traitée, comme le prévoyait la spécification. | Aucune page lue ne dit sur quelle image un boîtier calcule ses histogrammes. Les textes disent seulement que TutoPhoto n'applique pas les réglages d'image du boîtier, et que Nikon dit ses histogrammes indicatifs. | Chercher une source, puis l'écrire. |
| 10 | La fiche MES-07 explique les zébrures d'après le guide de l'A7 III (« Zebra Setting »), sans les simuler ; onze sources ajoutées au lieu des cinq prévues. | Le titre de la notion les nomme ; les pages françaises et la page de Wikipedia sur le sRGB sont citées par les fiches ou par le code. | Ne rien dire des zébrures tant qu'elles ne sont pas simulées. |
| 11 | MES-06 et MES-07 ne sont pas ajoutées au jalon de la V1 minimale, et le référentiel n'est pas modifié. | La spécification ne le demande pas ; leurs situations (SIT-02, SIT-10, SIT-13) ne sont pas rédigées, leur brique « situation réelle » reste manquante. | Ajouter leurs sources au référentiel (champ `sources`), comme pour MES-04. |
