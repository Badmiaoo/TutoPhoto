# MES-07 · Alertes de surexposition et zébras

## Explication

**À la lecture.** Le Nikon Z 6 a une page d'information « Hautes lumières », qui signale les « zones susceptibles d’être surexposées » ([Nikon, manuel en ligne Z 7/Z 6, « Informations sur les photos »](https://onlinemanual.nikonimglib.com/z7_z6/fr/08_more_about_playback_02.html) ; [en anglais, « Photo Information »](https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html), lus le 12 novembre 2026). Le manuel n'écrit ni comment ces zones sont marquées, ni à partir de quelle luminosité ; son illustration montre une zone entourée d'un trait pointillé. La page ne s'affiche que si elle est sélectionnée dans « Options de visualisation », au menu Visualisation.

Sur le Sony A7 III, l'alerte fait partie de l'affichage « Histogramme » de la lecture : « Si l’image présente des zones surexposées ou sous-exposées, la partie correspondante clignote sur l’affichage de l’histogramme (avertissement surexposition/sous-exposition) » ([Sony, guide d'aide ILCE-7M3, « Changement d'affichage d'écran »](https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001662878.html) ; [en anglais](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html)). Le seuil n'est pas donné. D'après la même page, ces défauts ne se corrigent pas sur ordinateur après la prise de vue : il faut corriger l'exposition avant de déclencher (voir MES-04).

**À la prise de vue : les zébrures.** Sur l'A7 III, le réglage « Régl. zebra » affiche un motif zébré « sur une portion d’une image si le niveau de luminosité de cette portion atteint le niveau IRE que vous avez défini » ; pour vérifier la surexposition, on fixe une valeur minimum, et le motif apparaît sur les zones dont la luminosité est égale ou supérieure ([Sony, « Régl. zebra »](https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001667947.html) ; [en anglais, « Zebra Setting »](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667679.html)). La page ne définit pas l'échelle IRE et ne liste pas les valeurs.

Le manuel du Z 6 ne décrit un tel affichage que pour la vidéo : le réglage g6, « Affichage des hautes lumières », du groupe « g : Vidéo », trace des hachures sur les zones claires, avec un seuil réglable. C'est la seule valeur de seuil écrite dans les pages lues : « Si 255 est sélectionné, seules les zones susceptibles d'être surexposées seront indiquées » ([Nikon, « g6 : Affichage des hautes lumières »](https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_05_g06.html) ; [en anglais](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_g06.html)).

## Simulateur

Sur l'écran de revue, le bouton « Infos » mène à l'affichage « hautes lumières », après « histogrammes » (voir MES-06). Les zones dont au moins une couche, rouge, verte ou bleue, est à la valeur maximale (255) clignotent sur la photo : une seconde en noir, une seconde visibles. Une ligne de texte donne leur part de l'image. Sans pixel à la valeur maximale, la photo ne change pas et le texte le dit. Toucher la photo ouvre toujours la loupe ; zones et texte portent alors sur la partie affichée. Si ton appareil demande de réduire les animations, les zones restent en noir, sans clignoter.

Dans la photo de TutoPhoto, tout ce qui dépasse le blanc est ramené à la valeur maximale : dans une zone qui clignote, la couche concernée n'a plus de détail.

Choix de TutoPhoto, non sourcés :
- le seuil : une couche à 255, la valeur maximale d'une photo en 8 bits par couche ; il s'appuie sur la phrase de Nikon pour le seuil 255 de la vidéo ;
- le clignotement, décrit par Sony, est appliqué quel que soit le boîtier choisi, et son rythme n'est écrit nulle part ; le manuel du Z 6 ne dit pas comment sa page « Hautes lumières » marque les zones ;
- un affichage à part, comme la page « Hautes lumières » du Z 6, alors que l'A7 III montre l'alerte avec les histogrammes.

Non simulé : l'alerte des zones sous-exposées de Sony ; les zébrures à la prise de vue ; le réglage « Options de visualisation » du Z 6.

## Exercice

La fiche du référentiel propose d'exposer au plus clair sans brûler une robe blanche ; dans le parc, c'est le haut blanc de Sophia. En mode A à f/8, avec l'affichage « Infos : hautes lumières » :
- déclenche sans correction d'exposition : au cadrage de départ, une partie du haut de Sophia clignote déjà ;
- baisse la correction d'exposition d'un tiers d'IL à la fois, en déclenchant à chaque fois, jusqu'à ce que plus rien ne clignote sur son haut ; touche la photo pour le vérifier à la loupe ;
- note cette correction : c'est la photo la plus claire qui garde du détail dans ce blanc. Compare-la à la première : qu'as-tu gagné, qu'as-tu perdu ?
- remets la correction d'exposition à 0 : elle reste mémorisée.

Mesuré le 12 novembre 2026 au cadrage de départ, au 50 mm : sans correction (−0,2 IL au bulletin), 0,8 % de l'image est à la valeur maximale, sur les vêtements clairs des personnages ; à −1 IL de correction, moins de 0,1 % ; à −2 IL, aucun pixel. D'autres zones que le haut de Sophia peuvent clignoter : regarde où elles sont sur la photo, pas seulement leur part de l'image, et décide de ce qui compte pour ta photo. Le bulletin ne juge pas les hautes lumières : il n'y a pas de bonne réponse calculée.
