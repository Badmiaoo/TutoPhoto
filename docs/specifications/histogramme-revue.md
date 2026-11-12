# Spécification : histogramme et hautes lumières sur l'écran de revue (MES-06, MES-07)

Écrite par Claude le 12 novembre 2026, d'après `docs/dossiers/viseur-aides.md` (sections 3 et 4). Version prévue : 0.3.57. Elle tient lieu de proposition (`CLAUDE.md` : proposer avant de produire) ; ses choix sont repris dans `docs/propositions.md`, section 4, pour que Julien les confirme.

## 1. Périmètre

- Après chaque photo, le débutant peut afficher l'histogramme de sa photo et voir clignoter les zones brûlées. C'est le cœur de « comprendre nos erreurs » (`docs/cadrage.md`).
- Notions : MES-06 (histogramme : la partie « après la prise »), MES-07 (alertes de surexposition : la partie « à la lecture »).
- Renvoyé à plus tard, dans une autre version : l'histogramme en direct dans le viseur (lecture des pixels à chaque instant : coût à mesurer sur téléphone), les zébrures à la prise de vue (le Z 6 ne les documente qu'en vidéo ; l'échelle IRE de Sony n'est pas sourcée), l'alerte des zones sous-exposées.

## 2. Ce que disent les sources

Citations et adresses dans le dossier, à relire à la source pendant la mise en œuvre.

- Nikon Z 6, pages d'information à la lecture : « RGB histogram » avec quatre histogrammes, « Histogram (RGB channel) », rouge, vert, bleu ; « Highlights (areas that may be overexposed) ». Le manuel ne définit pas « RGB channel », n'écrit pas que les hautes lumières clignotent et ne donne pas de seuil.
- Nikon : « Histograms show tone distribution, with pixel brightness (tone) plotted on the horizontal axis and the number of pixels on the vertical axis. » ; image sombre, distribution à gauche ; image claire, à droite ; la correction d'exposition la déplace ; « Camera histograms are intended as a guide only and may differ from those displayed in imaging applications. »
- Nikon, loupe à la lecture : « The histogram will be updated to show only the data for the portion of the image visible in the display. »
- Sony A7 III, affichage « Histogram » à la lecture : « Histogram (Luminance/R/G/B) » ; « If the image has an overexposed or underexposed area, the corresponding section will blink on the histogram display ».
- Seule valeur de seuil écrite, par Nikon, pour l'affichage vidéo g6 : à 255, « the highlight display will show only areas that are potentially overexposed ».

## 3. Comportement et interface

- Sur l'écran de revue, un bouton « Infos » / « Info » fait défiler trois affichages, comme la commande DISP des boîtiers à la lecture : photo seule (par défaut), histogrammes, hautes lumières. Le libellé du bouton dit l'affichage en cours. Le choix est mémorisé (clé `tutophoto.revue`) et vaut pour les photos suivantes et pour chaque vue d'une série.
- Affichage « Histogrammes » : quatre histogrammes sous la photo, dans l'ordre de Sony et du Z 6 : luminance, rouge, vert, bleu. Axe horizontal : la luminosité du pixel, de 0 à 255, le noir à gauche ; axe vertical : le nombre de pixels. Une ligne de texte donne la part des pixels écrêtés : « Pixels à la valeur maximale sur au moins une couche : 3,2 % de l'image » (rien d'écrit quand c'est 0 : « Aucun pixel à la valeur maximale »).
- Affichage « Hautes lumières » : les zones dont au moins une couche vaut 255 clignotent sur la photo (une seconde visible, une seconde en noir), avec la même ligne de texte. Sans zone écrêtée, la photo ne change pas et le texte le dit.
- Loupe de l'écran de revue : histogrammes, part écrêtée et zones qui clignotent portent sur la partie affichée (comportement du Z 6).
- Le clic sur la photo (loupe) continue de marcher : ce qui se superpose à l'image laisse passer les événements de pointeur. La feuille de style de l'écran de revue vise `.review > :first-child` et `.review img` : ne pas les casser.
- Les valeurs par défaut ne changent rien à l'écran de revue actuel ni aux trois défis.

## 4. Modèle et calculs

- Les histogrammes sont calculés sur les pixels 8 bits de la photo finale, avant sa compression en JPEG, dans `takePhoto` (`app/src/camera/photo.ts`, là où `pixels` est lu) ; `magnify()` passe par le même code, la partie agrandie a donc ses propres données.
- 256 colonnes par histogramme. Luminance : choix de TutoPhoto, non sourcé (aucune page lue ne donne la formule d'un boîtier) : Y = 0,2126 R + 0,7152 G + 0,0722 B sur les valeurs encodées, coefficients de la norme sRGB tels que les donne Wikipedia (`docs/dossiers/balance-des-blancs.md`, section 2), arrondi à l'entier.
- Échelle verticale : chaque histogramme est normalisé par sa colonne la plus haute, colonnes 0 et 255 exclues du calcul du maximum pour qu'un pic d'écrêtage n'écrase pas le reste ; ces deux colonnes sont tracées à leur vraie hauteur, plafonnée au bord. Choix de TutoPhoto, non sourcé.
- Zone écrêtée : pixel dont au moins une couche vaut 255. Choix de TutoPhoto, appuyé sur la phrase de Nikon pour le seuil 255.
- Exemple à vérifier dans les essais : une photo surexposée de 3 IL dans le parc a une part écrêtée non nulle et des colonnes pleines à droite ; une photo sous-exposée de 3 IL a 0 % et une distribution à gauche.

## 5. Changements

- `app/src/camera/photo.ts` : histogrammes (4 × 256), part écrêtée et masque des zones écrêtées dans `PhotoResult`.
- `app/src/ui/shutter.ts` : bouton « Infos », affichages, mémoire ; données gardées avec chaque vue d'une série.
- `app/simulateur/index.html`, `app/src/style.css`, `app/src/i18n.ts`.
- `scripts/test_app.cjs` (avec `--photo`) et la liste des contrôles en tête du fichier.

## 6. Ce qui n'est pas simulé, à dire

- Les histogrammes d'un boîtier portent sur son image traitée (réglages d'image du boîtier) ; ceux de TutoPhoto portent sur la photo calculée, sans ces réglages. Nikon prévient lui-même que ses histogrammes sont indicatifs.
- La définition de « Histogram (RGB channel) » du Z 6 n'est pas donnée : TutoPhoto l'appelle « Luminance », nom de Sony, et dit son calcul.
- Le clignotement est décrit par Sony ; le manuel du Z 6 ne dit pas comment sa page « Hautes lumières » marque les zones. Le seuil des deux marques n'est pas donné.
- Zones sous-exposées (Sony les fait clignoter aussi), zébrures à la prise de vue, histogramme en direct : pas dans cette version.

## 7. Contrôles de la routine (avec `--photo`)

Après le contrôle « photo calculée, pas noire », sans changer la suite :
- par défaut, ni histogramme ni clignotement ;
- « Infos » une fois : quatre histogrammes visibles, et la somme des colonnes de chacun égale au nombre de pixels de la photo ;
- sur une photo surexposée de 3 IL : part écrêtée supérieure à 0 dans le texte ; « Infos » encore une fois : zones écrêtées présentes ;
- sur une photo sous-exposée de 3 IL : part écrêtée nulle ; plus de la moitié des pixels de luminance dans la moitié gauche ;
- retour à « photo seule » et aux réglages de départ avant la suite.

## 8. Fiches

En français et en anglais, au format de `docs/contenus.md`.
- MES-06, Histogramme : Explication (définition et lecture d'après Nikon ; luminance et couches d'après Sony et Nikon ; limite annoncée par Nikon), Simulateur (bouton « Infos », calcul retenu, ce qui n'est pas simulé), Exercice jouable dans le parc : trois photos à −2, 0 et +2 IL, regarder la distribution se déplacer (le référentiel propose d'associer quatre histogrammes à quatre photos).
- MES-07, Alertes de surexposition : Explication (page « Hautes lumières » du Z 6, clignotement chez Sony), Simulateur, Exercice du référentiel adapté au parc : exposer le plus clair possible sans faire clignoter le haut blanc de Sophia.
- Ces deux notions renvoient à des situations qui ne sont pas rédigées : leur brique « situation réelle » restera manquante, la fiche n'a pas à la combler.

## 9. Sources à ajouter à `data/sources.yaml`

Pages « Photo Information » du Z 6 (anglais et français), « Switching the screen display » et « List of icons on the monitor » de l'A7 III, « g6: Highlight Display » du Z 6 ; `used_in` exact.

## 10. Documentation

`docs/camera-physique.md` (nouvelle section, et la sous-section « Histogramme (MES-06) » qui y renvoie), `docs/questions-ouvertes.md`, `docs/historique.md`, `docs/propositions.md` (section 4), `docs/etat-des-travaux.md` (ligne 5 de la file : revue faite, viseur à faire), `CHANGELOG.md`.

## 11. Choix faits sans Julien, à confirmer

1. D'abord l'écran de revue ; l'histogramme en direct dans le viseur vient dans une autre version, après une mesure de son coût sur téléphone.
2. Un bouton « Infos » qui fait défiler trois affichages, plutôt que deux cases à cocher.
3. Formule de la luminance, échelle verticale et seuil à 255 : choix de TutoPhoto, dits comme tels.
4. Seules les zones surexposées clignotent, pas les zones sous-exposées.

## 12. Écarts de la mise en œuvre (version 0.3.57)

Notés par l'agent de Claude qui a mis la spécification en œuvre, le 12 novembre 2026. Le texte des sections 1 à 11 n'est pas modifié. Les choix correspondants sont repris dans `docs/propositions.md`, section 4.

- Section 5, code : le calcul est dans un module à part, `app/src/camera/histogram.ts`, appelé par `takePhoto` ; l'affichage est une classe à part, `app/src/ui/reviewInfo.ts`, que `shutter.ts` appelle et que `app/src/main.ts` construit (une classe par élément d'interface, comme le reste du code).
- Section 3, place du bouton : « Infos » est sous la photo, au-dessus de la légende, et non avec les boutons du bas de l'écran de revue, que l'on n'atteint souvent qu'en faisant défiler. La légende et le bulletin descendent d'une ligne : c'est le seul changement de l'écran de revue par défaut.
- Section 3, histogrammes : la photo est réduite pour que les quatre histogrammes et le texte tiennent sous elle sans défilement, comme la vignette des boîtiers ; pas avec la loupe, qui garde un pixel de l'image par pixel de l'écran (l'écran de revue défile alors jusqu'au texte).
- Section 3, textes : espace insécable devant « % » ; « moins de 0,1 % » pour une part non nulle plus petite ; « de la partie affichée » avec la loupe ; dans l'affichage « hautes lumières », la phrase est suivie de « Ces zones clignotent en noir sur la photo. », et sans zone le texte est « Aucun pixel à la valeur maximale : rien ne clignote » ; une note « Lecture et limites », repliée, sous le texte.
- Section 3, clignotement : si le système demande de réduire les animations, les zones restent en noir sans clignoter, et le texte le dit, comme pour le clignotement des réglages hors limites (version 0.3.36).
- Section 3, mémoire : la clé `tutophoto.revue` garde un objet, `{"display": "photo"}`, `"histograms"` ou `"highlights"` ; une valeur inconnue ou illisible vaut `photo`.
- Section 4, luminance : la page de Wikipedia donne ces coefficients pour des valeurs linéaires (ligne Y de la matrice du sRGB linéaire vers XYZ). Les textes écrivent donc que les appliquer aux valeurs encodées est un choix de TutoPhoto. La page a été relue (révision 1378992844) et ajoutée aux sources.
- Section 4, exemple : vérifié à +3,2 IL et à −3,2 IL ; 3 IL exactement n'existe pas, les crans valant un tiers d'IL et la scène étant à un demi-tiers (12,5 IL). À +3,2 IL, 51 % de l'image est à la valeur maximale sur ordinateur ; à −3,2 IL, aucun pixel, et plus de 99,9 % des pixels de luminance sont dans la moitié gauche.
- Section 6 : « Les histogrammes d'un boîtier portent sur son image traitée » n'est écrit dans aucune page lue. Les textes disent seulement que TutoPhoto n'applique pas les réglages d'image du boîtier, que les pages lues ne disent pas sur quelle image un boîtier calcule ses histogrammes, et que Nikon dit les siens indicatifs.
- Section 6 : sur l'A7 III, l'alerte clignote dans l'affichage des histogrammes ; TutoPhoto lui donne un affichage à part, comme la page « Highlights » du Z 6. Les textes le disent.
- Section 7 : six contrôles, sur des photos à +3,2 IL et à −3,2 IL. En plus de ce qui était prévu : le nombre de pixels en noir du calque égale la part du texte, le calque est posé sur la photo à 1 pixel près, et le toucher au centre de la photo arrive à la photo.
- Section 8 : la fiche MES-07 explique aussi les zébrures, d'après la page « Zebra Setting » de l'A7 III, parce que le titre de la notion les nomme ; elles ne sont pas simulées. Son exercice part du constat mesuré dans le parc : sans correction, une partie du haut de Sophia est déjà à la valeur maximale ; on baisse donc la correction jusqu'à ce que plus rien n'y clignote. L'exercice de MES-06 donne les valeurs mesurées (aucun pixel à −2,2 IL, 0,8 % à −0,2 IL, 6,1 % à +1,8 IL).
- Section 9 : onze sources au lieu de cinq. En plus : les versions françaises des pages « Switching the screen display » et « g6 », citées par les fiches françaises ; « Zebra Setting » en anglais et en français ; « Camera Controls » du Z 6 (affichage « Histogram » de la commande DISP à la prise de vue) ; l'article « sRGB » de Wikipedia.
- Section 10 : `README.md` et `docs/dossiers/viseur-aides.md` (sections 3 et 4 relues à la source) sont aussi mis à jour. Deux constats sont notés dans `docs/etat-des-travaux.md` et `docs/questions-ouvertes.md` : des vêtements clairs sont à la valeur maximale dès l'exposition jugée correcte, et l'écran de revue garde son défilement d'une photo à la suivante (défaut antérieur, non corrigé ici).
