# Spécification : grilles de cadrage (CMP-02)

Écrite par Claude le 12 novembre 2026, d'après `docs/dossiers/viseur-aides.md` (section 1). Version prévue : 0.3.56. `CLAUDE.md` demande de proposer avant de produire : Julien dormant, cette spécification tient lieu de proposition, et ses choix sont repris dans `docs/propositions.md` pour qu'il les confirme.

## 1. Périmètre

- Notion CMP-02 (« Tiers, centre, symétrie ») : son simulateur, d'après le référentiel, ce sont des « grilles superposables ».
- Le débutant affiche une grille dans le viseur, place son sujet sur une ligne ou au centre, et compare.
- Renvoyé à plus tard : l'horizon virtuel (CMP-04, demande une rotation de l'appareil sur le côté), l'histogramme (MES-06), les grilles « Grille carrée » et « Diag. + Grille carrée » de Sony, dont le tracé n'est pas décrit.

## 2. Ce que disent les sources

| Boîtier | Réglage | Ce que dit la source |
| --- | --- | --- |
| Nikon Z 6 | « d9: Framing Grid Display » / « d9 : Affichage du quadrillage », activé ou désactivé, désactivé par défaut | « Choose On to display a grid for reference when framing shots. » Le manuel ne décrit pas le tracé. |
| Sony A7 III, Sony A6000 | « Grid Line » / « Quadrillage » : « Rule of 3rds Grid », « Square Grid », « Diag. + Square Grid », « Off » (« Off » par défaut sur l'A6000) | « Place main subjects close to one of the grid lines that divide the image into thirds for a well-balanced composition. » Le nombre de cases de « Square Grid » et le tracé des diagonales ne sont pas décrits. |
| Nikon D5600 | Affichage « Framing grid » de la visée écran | Illustration de la page Digitutor de Nikon : trois lignes verticales et trois lignes horizontales, soit seize cases. |
| Canon EOS RP, Canon EOS 2000D | Je ne sais pas | Manuels introuvables sur les sites que Claude peut joindre. |

Adresses dans le dossier. Aucune des pages lues n'écrit que la grille est absente de la photo enregistrée.

## 3. Comportement et interface

- La grille est une aide du viseur de TutoPhoto, comme l'indicateur d'équilibre et la zone couverte par l'autofocus : elle se règle dans la fenêtre « Aperçu », pas dans une copie du menu de chaque boîtier.
- Dans la fenêtre « Aperçu » (`preview-dialog`), sous les interrupteurs, un groupe « Grille de cadrage » / « Framing grid » avec trois boutons radio :
  - « Aucune » / « None » : par défaut (désactivé par défaut sur le Z 6 et sur l'A6000) ;
  - « Tiers » / « Thirds » : deux lignes verticales et deux lignes horizontales, aux tiers du cadre (texte de Sony) ;
  - « Seize cases » / « Sixteen boxes » : trois lignes verticales et trois lignes horizontales, aux quarts du cadre (illustration de Nikon pour le D5600).
- Sous le groupe, une note : « La grille aide à cadrer ; TutoPhoto ne la dessine pas sur la photo. Tiers : réglage « Grille règle des tiers » des boîtiers Sony. Seize cases : affichage « Framing grid » du Nikon D5600, d'après une illustration de Nikon. Le manuel du Nikon Z 6 dit seulement qu'un quadrillage s'affiche, sans le décrire. » En anglais : « The grid helps you frame; TutoPhoto does not draw it on the photo. Thirds: the "Rule of 3rds Grid" setting of Sony bodies. Sixteen boxes: the "Framing grid" display of the Nikon D5600, from a Nikon illustration. The Nikon Z 6 manual only says that a grid is displayed, without describing it. »
- Le choix ne dépend pas de l'interrupteur général « Aperçu des réglages » : celui-ci ne grise pas le groupe, et la grille ne compte pas dans le badge « Aperçu coupé ».
- La grille est tracée dans le cadre du viseur (`div#frame`), sur toute sa surface, en traits fins clairs lisibles sur fond clair comme sur fond sombre. Elle ne reçoit aucun événement de pointeur (le toucher du viseur déplace le point AF).
- Loupe : quand la loupe agrandit l'image, la grille est masquée ; elle revient quand la loupe est coupée. Choix de TutoPhoto : aucune source lue ne dit ce que fait un boîtier.
- Écran de revue : pas de grille.
- Mémoire : le choix est gardé avec les interrupteurs de l'aperçu (clé `tutophoto.apercu`, champ `grid`, valeurs `none`, `thirds`, `sixteen`) ; une valeur inconnue vaut `none`.
- Les réglages par défaut, l'image du viseur, la photo et les trois défis ne changent pas.

## 4. Changements

- `app/simulateur/index.html` : le groupe de boutons radio et sa note dans `preview-dialog` ; un élément pour la grille dans `div#frame`.
- `app/src/ui/cameraPanel.ts` : champ `grid` dans `Preview`, écoute, affichage dans `updatePreview()`, restauration et sauvegarde ; tracé des lignes (SVG ou éléments placés en pourcentages, pour suivre le cadre quand il change de forme) ; masquage avec la loupe.
- `app/src/i18n.ts` : libellés en français et en anglais.
- `app/src/style.css` : style de la grille.
- `scripts/test_app.cjs` : contrôles ci-dessous, et leur ligne dans la liste en tête du fichier.

## 5. Contrôles de la routine

À placer là où l'état du viseur est connu, sans changer la suite du scénario :
- par défaut, aucune ligne de grille n'est visible ;
- « Tiers » choisi dans la fenêtre « Aperçu » : quatre lignes visibles, à 1/3 et 2/3 de la largeur et de la hauteur du cadre (à 1 pixel près, positions lues par `getBoundingClientRect`) ;
- « Seize cases » : six lignes, à 1/4, 1/2 et 3/4 ;
- le choix est écrit dans `tutophoto.apercu` ;
- loupe à 100 % : grille masquée ; loupe coupée : grille revenue ;
- retour à « Aucune » avant la suite.

## 6. Fiche CMP-02

En français et en anglais, au format de `docs/contenus.md` : Explication, Simulateur, Exercice. La brique « situation réelle » vient de SIT-01, déjà rédigée.

- Explication : ce que disent Sony (placer le sujet près d'une ligne des tiers, « for a well-balanced composition ») et Nikon (un quadrillage « for reference when framing shots »), puis la règle des tiers d'après Wikipedia, « Rule of thirds » (source secondaire, révision à citer) : sa définition, son origine si l'article la donne, et ce qu'il dit des cas où l'on centre. Rien d'autre : ce que ces pages ne disent pas ne s'écrit pas.
- Simulateur : les deux grilles, où les trouver, ce qui est fidèle à quel boîtier, ce qui n'est pas simulé (tracé du Z 6 inconnu, grilles carrée et diagonale de Sony, Canon non lu).
- Exercice, jouable dans le parc : cadrer Sophia sur une ligne des tiers, puis au centre, avec la grille « Tiers » ; comparer les deux photos et dire laquelle on garde, et pourquoi (exercice du référentiel : « Comparer deux placements et justifier »).

## 7. Sources à ajouter à `data/sources.yaml`

Page d9 du manuel du Z 6 (anglais), page « Grid Line » du guide de l'A7 III, page « Grid Line » du guide de l'A6000, page Digitutor « Framing Grid (Live View) » du D5600, article « Rule of thirds » de Wikipedia (révision lue). Champ `used_in` : les fichiers où l'adresse apparaît.

## 8. Documentation

- `docs/camera-physique.md` : section « Grilles de cadrage (version 0.3.56) » ; la sous-section « Grilles de composition (CMP-02) » des fonctions demandées le 9 novembre renvoie à cette section ; point 7 du plan de mise en œuvre.
- `docs/questions-ouvertes.md` : tracé du quadrillage du Z 6 (à relever sur un boîtier), grilles de Canon.
- `docs/historique.md` : une ligne.
- `docs/propositions.md` : section « Choix faits par Claude dans la nuit du 11 au 12 novembre 2026, à confirmer ».
- `docs/etat-des-travaux.md` : ligne 4 de la file passée à « Fait, 0.3.56 », version en ligne.
- `docs/dossiers/viseur-aides.md` : si la relecture à la source d'un fait de la section 1 le contredit, le corriger.

## 9. Choix faits sans Julien, à confirmer

1. La grille est une aide de TutoPhoto, la même pour tous les boîtiers, et non la copie du menu de chacun. Autre voie : un réglage par boîtier, avec ses noms ; le Z 6, boîtier par défaut, n'aurait alors aucun tracé sourcé.
2. Deux tracés seulement, ceux que les sources décrivent ou montrent : tiers et seize cases. Autre voie : ajouter un centre ou des diagonales, sans source.
3. La grille est masquée quand la loupe agrandit l'image.
4. La grille n'est pas dessinée sur la photo ni sur l'écran de revue.

## 10. Écarts de la mise en œuvre (version 0.3.56)

Notés par l'agent de Claude qui a mis la spécification en œuvre, le 12 novembre 2026. Le texte des sections 1 à 9 n'est pas modifié.

- Note de la fenêtre, en français : « Tiers : réglage « Grille règle des tiers » des boîtiers Sony (nom français lu dans le guide de l'A7 III). » La page française du guide de l'A6000 répond 404 : seul son guide en anglais (« Rule of 3rds Grid ») est lu.
- Note de la fenêtre, en anglais : guillemets typographiques, comme les autres textes de `app/src/i18n.ts`.
- Fenêtre « Aperçu » : le groupe « Grille de cadrage » est placé après la note des interrupteurs, qui les explique, et non entre les interrupteurs et cette note.
- Sources (section 7) : deux de plus, les pages françaises du réglage d9 du Z 6 et du réglage « Quadrillage » de l'A7 III, que la fiche française cite ; la page « Defaults » du Z 6, déjà dans `data/sources.yaml`, sert pour le réglage par défaut.
- Fiche CMP-02 : l'article « Rule of thirds » de Wikipedia (révision 1383322855) ne dit pas quand centrer le sujet, et aucune page lue ne traite de la symétrie ; la fiche l'écrit au lieu de combler le manque.
- Routine de test : un contrôle de plus que la section 5, les lignes ne prennent pas les touchers du viseur.

## 11. Décisions de Julien du 12 novembre 2026

Prises avant la fusion de la version ; détail dans `docs/propositions.md`, section 4.

- Les mêmes grilles pour tous les boîtiers : « Mmmh en vrai les grilles sont des outils plutôt "global" ça fait partie de la composition et en vrai tous les boitiers ont les mêmes. Donc faisons les même pour tous les boitiers, 3*3 9*9 ect.. tous les plus communes ».
- Les grilles les plus communes : aux deux tracés des sections 2 et 3 s'ajoutent « Vingt-quatre cases (6 × 4) » et « Tiers et diagonales », les grilles « 6x4 » et « 3x3+diag » des manuels Canon lus (EOS 850D, EOS R6). Aucune page lue ne nomme une grille « 9*9 ».
- Grille masquée sous la loupe, et dans le viseur seulement : retenu.
- CMP-02 ajoutée au jalon de la V1 minimale et citée dans la fiche de SIT-01.
- Une source est à chercher pour le centrage et la symétrie, afin de compléter la fiche.

