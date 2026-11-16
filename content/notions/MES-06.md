# MES-06 · Histogramme

## Explication

Un histogramme montre la répartition des tons d'une photo : « la luminosité des pixels (tons) figurant sur l’axe horizontal et le nombre de pixels figurant sur l’axe vertical » ([Nikon, manuel en ligne Z 7/Z 6, « Informations sur les photos »](https://onlinemanual.nikonimglib.com/z7_z6/fr/08_more_about_playback_02.html) ; [en anglais, « Photo Information »](https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html), lus le 12 novembre 2026). D'après cette page :
- si l'image est sombre, la répartition des tons est décalée vers la gauche ; si elle est claire, vers la droite ;
- si la plage de luminosité de l'image est étendue, la répartition est relativement régulière ;
- augmenter la correction d'exposition décale la répartition vers la droite, la diminuer la décale vers la gauche (voir MES-04) ;
- l'histogramme donne une idée de l'exposition générale quand une forte lumière ambiante empêche de bien voir l'écran.

Le guide du Sony A7 III ajoute qu'un pic à l'extrémité droite ou gauche de l'histogramme indique une zone surexposée ou sous-exposée, et que ces défauts ne se corrigent pas sur ordinateur après la prise de vue : il faut corriger l'exposition avant de déclencher ([Sony, guide d'aide ILCE-7M3, « Changement d'affichage d'écran »](https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001662878.html) ; [en anglais](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html)).

**Couche par couche.** À la lecture, les deux boîtiers affichent quatre histogrammes. Sur le Z 6, la page « Histogramme RVB » montre « Histogramme (canal RVB) », puis les canaux rouge, vert et bleu ; le manuel ne définit pas ce « canal RVB ». Sur l'A7 III, l'affichage « Histogramme » de la lecture montre « Histogram (Luminance/R/G/B) » ([Sony, « List of icons on the monitor »](https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667671.html)). Aucune de ces pages ne dit à quoi sert chaque couche ; la partie « Simulateur » donne un cas calculé où une couche montre ce que la luminance cache.

**Limite annoncée par Nikon.** « Les histogrammes de l’appareil photo ne doivent servir que de référence. Ils peuvent varier par rapport à ceux des applications de retouche d’images. »

## Simulateur

Sur l'écran de revue, après chaque photo, le bouton « Infos » fait défiler trois affichages, comme la commande DISP des deux boîtiers à la lecture : photo seule (par défaut), histogrammes, hautes lumières (voir MES-07). Le choix est gardé pour les photos suivantes et pour chaque vue d'une rafale.

Affichage « histogrammes » : la photo, réduite, et quatre histogrammes sous elle, dans l'ordre des deux boîtiers : luminance, rouge, vert, bleu. Le noir est à gauche (valeur 0), le blanc à droite (valeur 255) ; la hauteur d'une colonne donne le nombre de pixels qui ont cette valeur. Une ligne de texte donne la part des pixels dont au moins une couche est à la valeur maximale. Avec la loupe de l'écran de revue, histogrammes et texte portent sur la partie affichée, comme sur le Z 6 : « L’histogramme est mis à jour afin de ne représenter que les données correspondant à la portion de l’image affichée. »

Choix de TutoPhoto, non sourcés, aucune page lue ne donnant le calcul d'un boîtier :
- les histogrammes sont calculés sur la photo finale, en 8 bits par couche : 256 colonnes, de 0 à 255 ;
- luminance : 0,2126 R + 0,7152 V + 0,0722 B, arrondi à l'entier, sur les valeurs de la photo. Ces coefficients sont ceux de la norme sRGB ([Wikipedia, « sRGB », révision 1378992844](https://en.wikipedia.org/w/index.php?title=SRGB&oldid=1378992844), source secondaire, lue le 12 novembre 2026), où ils s'appliquent à des valeurs linéaires ; les appliquer aux valeurs de la photo est un choix de TutoPhoto, qui reprend le nom « Luminance » de Sony ;
- hauteur : chaque histogramme est rapporté à sa colonne la plus haute, sans compter les colonnes 0 et 255, pour qu'un pic à une extrémité n'écrase pas le reste ; ces deux colonnes sont tracées à leur vraie hauteur, limitée au bord du tracé.

Ce que la luminance cache : un pixel rouge vif (255, 0, 0) a une couche à la valeur maximale, mais sa luminance vaut 0,2126 × 255, soit 54. L'histogramme de luminance le range parmi les tons sombres ; celui du rouge le montre à l'extrémité droite.

Non simulé : les réglages d'image du boîtier (« Picture Control » sur le Z 6), que TutoPhoto n'applique pas à sa photo, si bien que ses histogrammes ne peuvent pas coïncider avec ceux d'un boîtier ; l'histogramme affiché pendant la prise de vue, que les deux boîtiers proposent ; les autres pages d'information de la lecture. Les pages lues ne disent pas sur quelle image un boîtier calcule ses histogrammes.

## Exercice

La fiche du référentiel propose d'associer quatre histogrammes à quatre photos ; l'exercice est adapté au parc. En mode A à f/8, avec l'affichage « Infos : histogrammes » :
- déclenche sans correction d'exposition, puis avec −2 IL, puis avec +2 IL ; le bulletin indique environ −0,2 IL, −2,2 IL et +1,8 IL ;
- compare les trois affichages : de quel côté la répartition se déplace-t-elle quand la photo s'assombrit ? Quand elle s'éclaircit ?
- lis la ligne de texte sous les histogrammes de chaque photo : laquelle n'a aucun pixel à la valeur maximale ? Laquelle en a le plus ?
- remets la correction d'exposition à 0 : elle reste mémorisée.

Mesuré le 12 novembre 2026 au cadrage de départ, au 50 mm : aucun pixel à la valeur maximale à −2,2 IL, 0,8 % de l'image à −0,2 IL, 6,1 % à +1,8 IL. Le promeneur et le chien traversent le cadre : tes valeurs seront voisines, pas identiques.

Pour voir où sont ces pixels sur la photo, passe à l'affichage « Infos : hautes lumières » (MES-07).
