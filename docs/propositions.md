# Propositions à trancher

Rédigées par Claude le 11 novembre 2026, pendant que Julien était absent. Il avait demandé de continuer seul pour compléter la V1, puis de préparer la V2. `CLAUDE.md` demande de proposer avant de produire : rien de ce qui suit n'est construit. Julien tranche.

## 1. Activité interactive de LUM-02 (lumière dure ou douce)

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

**Critères pour étendre (à fixer par Julien).**
- Aucun blocage technique sur les appareils des testeurs : la scène se charge et la photo se calcule.
- Chaque défi est réussi par la plupart des testeurs sans aide extérieure, fiches comprises.
- Les réponses d'après sont meilleures que celles d'avant pour la plupart des testeurs.
- Les problèmes relevés sont corrigés.

## 3. Après la V1 minimale

**Vocabulaire.** Depuis le 7 novembre 2026, toute la V1 est le référentiel entier : 191 notions et 49 situations (`docs/cadrage.md`). La V1 minimale (le parc, SIT-01, SIT-05, SIT-06) en est la première tranche. La V2 regroupe ce que Julien a renvoyé à plus tard.

**Déjà renvoyé en V2 par Julien :**
- le solveur de situations, qui calcule une recette à partir de « où, quand, quoi, pourquoi » (10 novembre 2026) ;
- le simulateur de LUM-02 (10 novembre 2026) ;
- la couverture de l'autofocus des reflex Nikon D5600 et Canon EOS 2000D (11 novembre 2026) ;
- la correction de la photo après la prise, RET-01 et RET-02 (`docs/camera-physique.md`).

**Placé après les tests de la V1 minimale** (Julien a laissé le moment à Claude le 9 novembre 2026) : balance des blancs (COU-02), grilles de composition (CMP-02), histogramme (MES-06).

**Ordre proposé, une fois les tests faits :**
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
