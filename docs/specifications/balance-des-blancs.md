# Spécification : balance des blancs (COU-02, COU-01)

> **Reportée le 12 novembre 2026.** Julien demande d'éviter la dette technique : cette fonction serait écrite deux fois, une pour le viseur et une pour la photo calculée, tant que les deux chaînes d'image ne sont pas réunies. Elle attend l'audit de l'architecture. Un début de code, non publié, était sur la machine de Claude.

Écrite par Claude le 12 novembre 2026, d'après `docs/dossiers/balance-des-blancs.md`. Version prévue : 0.3.58. Elle tient lieu de proposition (`CLAUDE.md` : proposer avant de produire) ; ses choix vont dans `docs/propositions.md`, section 4, pour que Julien les confirme.

Le dossier n'a pas été relu par un second agent : chaque citation et chaque constante reprise ici est à relire à sa source pendant la mise en œuvre (pages du manuel du Nikon Z 6, articles de Wikipedia aux révisions citées, API de Poly Haven). Dans le dossier, le signe « + » devant douze nombres a été retiré : reprendre les constantes à la source, pas dans le dossier.

## 1. Périmètre

- Le débutant choisit la balance des blancs du boîtier et voit l'image se réchauffer ou se refroidir, dans le viseur et sur la photo.
- Notions : COU-02 (balance des blancs), COU-01 (température de couleur) pour ce que les pages lues en disent.
- Renvoyé à plus tard : la mesure personnalisée (« Preset manual » ; il faut une carte grise dans la scène), le réglage fin ambre-bleu et vert-magenta, les préréglages « Fluorescent » (teinte non sourcée, aucune lumière fluorescente dans le parc), « Lumière naturelle auto », les trois variantes de l'automatique (les manuels ne les distinguent que sous éclairage incandescent), la balance créative (COU-04), la lumière mixte (COU-03).

## 2. Ce que disent les sources (à relire à la source)

- Nikon Z 6, « White Balance » : « White balance ensures that white objects appear white, regardless of the color of the light source. » Réglages et températures approximatives du tableau du manuel : « Direct sunlight » / « Ensoleillé » 5200 K ; « Cloudy » / « Nuageux » 6000 K (« Use in daylight under overcast skies. ») ; « Shade » / « Ombre » 8000 K ; « Incandescent » 3000 K ; « Flash » 5400 K ; « Choose color temperature » / « Choisir température de couleur » de 2500 à 10 000 K ; automatique de 3500 à 8000 K. Réglage par défaut : « Auto > Keep overall atmosphere ».
- Les kelvins des préréglages des cinq autres boîtiers ne sont pas lus.
- Aucune page lue ne décrit la méthode de la balance automatique.
- Formules (Wikipedia, source secondaire, révisions du dossier) : chromaticité (x, y) d'un corps noir à la température T (approximation de Kim et collègues, de 1667 à 25 000 K) ; X = x / y, Y = 1, Z = (1 − x − y) / y ; matrice XYZ vers sRGB linéaire ; balance par gains sur chaque couche (matrice diagonale).
- Poly Haven ne publie ni la température de la lumière du parc ni la balance de développement de la photo autumn_hockey. Son API donne un champ `whitebalance` pour d'autres photos HDR ; d'après le dossier, 5400 K est sa valeur la plus fréquente et la médiane des photos par ciel couvert. Ce comptage est à refaire avec l'API et à garder comme calcul.

## 3. Modèle

- La photo de la scène est déjà développée avec une certaine balance, K_ref. Le simulateur rejoue ce développement avec la température K du réglage choisi.
- w(T) : couleur, en sRGB linéaire, d'un corps noir à la température T (formules ci-dessus). Gains du réglage : g(K) = w(K_ref) / w(K), couche par couche, puis division par le gain du vert. L'image en lumière linéaire est multipliée par g(K), avant l'exposition, le bruit et la courbe.
- K = K_ref : gains (1 ; 1 ; 1), l'image d'aujourd'hui. K plus bas : image plus bleue ; K plus haut : image plus orangée.
- **Hypothèse, non mesurée : K_ref = 5400 K** (raisons du dossier, section 7.3). À dire dans la fenêtre du réglage, dans la fiche et dans la documentation.
- Exemple à retrouver par le code, à 0,001 près : g(6000 K) = (1,0725 ; 1 ; 0,8933) ; g(3000 K) = (0,570 ; 1 ; 2,698) ; g(8000 K) = (1,248 ; 1 ; 0,697).
- Automatique : gains (1 ; 1 ; 1). Les manuels ne décrivent pas sa méthode ; TutoPhoto garde la balance avec laquelle l'auteur a développé la photo de la scène. L'image par défaut ne change donc pas.

## 4. Comportement et interface

- Un bouton de plus dans la rangée de boutons du panneau : « BB · Auto » / « WB · Auto », qui dit le réglage en cours (« BB · Nuageux », « BB · 6500 K »). Il ouvre une fenêtre « Balance des blancs » / « White balance », sur le modèle des fenêtres existantes.
- Dans la fenêtre, des boutons radio, avec les noms du manuel du Z 6 et ses températures : « Automatique » (par défaut), « Ensoleillé (5200 K) », « Nuageux (6000 K) », « Ombre (8000 K) », « Incandescent (3000 K) », « Flash (5400 K) », « Choisir température de couleur », avec un curseur de 2500 à 10 000 K par pas de 10 K, 5000 K au départ (valeur par défaut du Z 6).
- Une note sous les boutons : la source des réglages ; « Température de la lumière de cette scène : estimée, non mesurée » avec K_ref ; l'automatique garde la balance de la photo de la scène ; les mêmes réglages pour tous les boîtiers, faute d'avoir lu les valeurs des autres.
- Les mêmes réglages et les mêmes températures pour les six boîtiers : celles du Z 6, comme pour la couverture de l'autofocus quand elle n'est pas sourcée.
- Viseur : les gains s'appliquent à l'image quand l'aperçu général des réglages est actif (interrupteur « Aperçu des réglages ») ; coupé, le viseur garde l'image sans gains. Photo : toujours.
- Mémoire : avec les réglages du boîtier (`tutophoto.boitier`) ; une valeur inconnue vaut l'automatique.
- Légende de la photo : la balance n'y est ajoutée que si elle n'est pas automatique, à la fin de la partie des réglages, pour ne pas changer la légende par défaut.
- Sur téléphone, le viseur doit garder au moins la taille qu'exige la routine ; si le bouton de plus fait passer la rangée sur une ligne de plus, le mesurer et le dire.
- Par défaut, rien ne change : ni l'image du viseur, ni la photo, ni les trois défis.

## 5. Changements

- `app/src/camera/whiteBalance.ts` (nouveau) : w(T), g(K), réglages et températures, avec les sources en commentaire.
- `app/src/camera/photo.ts` : gains dans le shader de finition, sur la somme en lumière linéaire, avant l'exposition et l'écrêtage.
- Viseur : un post-traitement de plus, attaché seulement quand les gains ne valent pas (1 ; 1 ; 1), placé avant le bruit ; il décode, multiplie, réencode. Limite à dire : l'image du viseur est déjà écrêtée quand il s'applique, la photo non.
- `app/src/ui/cameraPanel.ts`, `app/simulateur/index.html`, `app/src/i18n.ts`, `app/src/style.css`, `app/src/ui/shutter.ts` (légende).
- `scripts/test_app.cjs` et la liste des contrôles en tête du fichier.

## 6. Ce qui n'est pas simulé, à dire

- La température de la lumière de la scène est une hypothèse.
- Un boîtier applique ses gains dans l'espace de son capteur ; TutoPhoto les applique en sRGB linéaire : exact pour les gris, approché pour les couleurs saturées. Le bruit propre à chaque couche après gains n'est pas simulé.
- La méthode de l'automatique, ses variantes, la mesure personnalisée, le réglage fin, les préréglages fluorescents.
- Les températures des préréglages des boîtiers autres que le Z 6.

## 7. Contrôles de la routine

- Par défaut : bouton « BB · Auto », et couleur moyenne d'une zone du viseur inchangée par l'ouverture et la fermeture de la fenêtre.
- « Incandescent » : dans le viseur, le rapport bleu sur rouge de la zone, en valeurs linéaires, est multiplié par plus de 3 par rapport à l'automatique (attendu : 2,698 / 0,570 ≈ 4,7, moins ce que l'écrêtage retire).
- « Ombre » : le rapport rouge sur bleu est multiplié par plus de 1,4 (attendu : 1,248 / 0,697 ≈ 1,79).
- Avec `--photo` : même contrôle sur la photo en « Incandescent », et la légende finit par la balance ; en automatique, la légende est celle d'avant.
- Retour à l'automatique avant la suite.

## 8. Fiches

En français et en anglais, au format de `docs/contenus.md`.
- COU-02 : Explication (définition et réglages d'après le manuel du Z 6), Simulateur (fenêtre, modèle, hypothèse, ce qui n'est pas simulé), Exercice adapté au parc (celui du référentiel, « neutraliser un intérieur éclairé à l'ampoule », demande une autre scène) : photographier la scène en « Automatique », « Nuageux », « Ombre » et « Incandescent », et dire lequel rend le haut blanc de Sophia le plus neutre, et pourquoi.
- COU-01 : seulement si les pages lues suffisent à écrire son explication sans rien inventer ; sinon, le dire et la laisser pour plus tard.

## 9. Sources à ajouter à `data/sources.yaml`

Page « White Balance » du Z 6 en anglais et en français, page « Defaults » (déjà présente), articles de Wikipedia utilisés (révisions), page de l'API de Poly Haven utilisée pour le comptage ; `used_in` exact.

## 10. Documentation

`docs/camera-physique.md` (nouvelle section, et la sous-section « Balance des blancs (COU-01, COU-02) » qui y renvoie), `docs/questions-ouvertes.md`, `docs/historique.md`, `docs/propositions.md` (section 4), `docs/etat-des-travaux.md` (ligne 6 de la file), `docs/dossiers/balance-des-blancs.md` (note de relecture ; corriger ce que la relecture contredit), `CHANGELOG.md`.

## 11. Choix faits sans Julien, à confirmer

1. K_ref = 5400 K, hypothèse non mesurée.
2. L'automatique garde la balance de la photo de la scène (image inchangée). Autre voie, décrite dans le dossier : neutraliser une carte grise horizontale, ce qui réchauffe l'image par défaut.
3. Les réglages et les températures du Z 6 pour tous les boîtiers.
4. Gains par couche en sRGB linéaire, lieu de Planck sur toute la plage (dossier, section 7.6, voies A).
5. Curseur de température par pas de 10 K.
6. Mesure personnalisée, réglage fin et préréglages fluorescents renvoyés à plus tard.
