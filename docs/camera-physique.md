# Caméra physique

Décisions prises par Julien le 8 novembre 2026 ; le modèle qui suit est proposé par Claude et reste à valider pendant la mise en œuvre. Sources détaillées dans `data/sources.yaml`.

## Décisions

- Mot d'ordre (Julien, 9 novembre 2026) : « fais ce qu'il y a de plus réaliste, ça reste une sandbox de simulation pour entraînement. Ça doit être le mot d'ordre partout. » À chaque choix, le comportement le plus réaliste, sourcé ; ce qui ne l'est pas est dit.
- Rendu en deux temps :
  - le viseur montre en temps réel le cadrage, l'exposition et une profondeur de champ approchée, avec les effets de Babylon.js ;
  - au déclenchement, la photo est calculée exactement, par accumulation de rendus.
- Capteur : plein format ou APS-C, au choix du débutant.
- Bruit numérique : modèle physique (bruit photonique et bruit de lecture), à partir de mesures publiées.
- Boîtiers de référence : trois paires, au choix de la marque. La réponse de Julien, « 1,2,3 », est comprise comme « les trois » :

  | Marque | Plein format | APS-C |
  | --- | --- | --- |
  | Nikon | Z 6 | D5600 |
  | Sony | A7 III (ILCE-7M3) | A6000 (ILCE-6000) |
  | Canon | EOS RP | EOS 2000D |

- Dimensions des capteurs, utilisées pour le champ de vue :

  | Boîtier | Capteur | Source |
  | --- | --- | --- |
  | Nikon Z 6 | 35,9 × 23,9 mm | [manuel en ligne Nikon](https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html), lu |
  | Nikon D5600 | 23,5 × 15,6 mm | [dslrbodies.com](https://dslrbodies.com/cameras/older-camera-database/nikon-d5600-specifications.html), extrait de recherche, page non ouverte |
  | Sony A7 III | 35,6 × 23,8 mm | [guide d'aide Sony](https://helpguide.sony.net/ilc/1720/v1/en/print.pdf), lu |
  | Sony A6000 | 23,5 × 15,6 mm | [fiche Sony Asie](https://www.sony-asia.com/electronics/interchangeable-lens-cameras/ilce-6000-body-kit/specifications), extrait de recherche, page non ouverte |
  | Canon EOS RP | 35,9 × 24,0 mm | [fiche Canon](https://en.canon-cna.com/cameras/eos-rp/specifications/), extrait de recherche, page non ouverte |
  | Canon EOS 2000D | 22,3 × 14,9 mm | [fiche Canon Royaume-Uni](https://www.canon.co.uk/cameras/eos-2000d/specifications/), extrait de recherche, page non ouverte |

  Le tableau des formats de [Wikipedia](https://en.wikipedia.org/w/index.php?title=Image_sensor_format&oldid=1374408806) donne 23,6 à 23,7 × 15,6 mm pour l'APS-C de Sony et de Nikon : les constructeurs, pour ces deux boîtiers, annoncent 23,5 mm, valeur retenue.
- Crans par tiers de diaphragme, comme sur les vrais boîtiers (8 novembre 2026). Les ouvertures et les ISO suivent les échelles de Wikipedia ([F-number](https://en.wikipedia.org/w/index.php?title=F-number&oldid=1382682702), [Film speed](https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213)). Pour les vitesses, [Wikipedia](https://en.wikipedia.org/w/index.php?title=Shutter_speed&oldid=1382495283) donne les crans entiers de 1/1000 à 1 s, et les manuels lus disent seulement « par pas de 1/3 IL » : les libellés des crans intermédiaires (1/1250, 1/640, etc.) sont les libellés usuels des boîtiers, non sourcés. Les calculs utilisent les valeurs exactes des crans : N = 2^(j/6), t = 2^(−k/3), S = 100 × 2^(i/3).
- Objectif virtuel : zoom de 18 à 200 mm, ouvrant à f/1.4 sur toute la plage (8 novembre 2026). Il n'existe pas ; l'outil le dit.
- Hôtes ajoutés à l'environnement de travail pour lire les sources : imaging.kodakalaris.com, www.photonstophotos.net, en.wikipedia.org, puis les sites de manuels onlinemanual.nikonimglib.com, downloadcenter.nikonimglib.com, helpguide.sony.net et cam.start.canon. Les fiches Kodak redirigent vers un autre domaine, toujours bloqué ; elles n'ont pas été lues. Les manuels du D5600, de l'A6000, de l'EOS RP et de l'EOS 2000D n'ont pas été trouvés sur ces sites.

## Ce que fait Babylon.js 9.35.0

Lu dans le code du paquet `@babylonjs/core` 9.35.0 :

- Profondeur de champ (`PostProcesses/thinCircleOfConfusionPostProcess.js`, `Shaders/circleOfConfusion.fragment.js`).
  - Le cercle de confusion est calculé selon l'optique des lentilles minces : c = (A · f / (S − f)) · |S − D| / D, en millimètres, avec A = `lensSize` / `fStop` le diamètre de l'ouverture, f la focale, S la distance de mise au point et D la distance du point.
  - Le résultat est ensuite plafonné à 1 et sert de fraction d'un flou maximal fixe, obtenu par des lissages séparables à basse résolution (`thinDepthOfFieldEffect.js`) : le passage en pixels n'est pas physique, et le flou n'a pas la forme de l'ouverture.
- Flou de mouvement (`Shaders/motionBlur.fragment.js`) : une traînée le long de la vitesse de chaque pixel, multipliée par `motionStrength`, réglage libre, et par `motionScale`, le rapport de la durée de l'image à 1/60 s.

## Exposition

Modèle repris de la documentation de Filament, le moteur de rendu de Google ([Romain Guy et Mathias Agopian, *Physically Based Rendering in Filament*](https://github.com/google/filament/blob/e8669b688a9381beb4f7470df828e1932d78efa6/docs/Filament.md.html), section « Physically based camera ») :

- Indice de lumination des réglages : EV₁₀₀ = log₂(N²/t) − log₂(S/100), avec N le nombre d'ouverture, t le temps de pose en secondes et S la sensibilité ISO.
- Indice de lumination de la scène, pour une luminance moyenne L en cd/m² : EV₁₀₀ = log₂(L × 100 / K), avec la constante d'étalonnage des posemètres K = 12,5 (Canon, Nikon et Sekonic, selon Filament). D'où L = 2^(EV₁₀₀ − 3).
- Valeur du pixel, rapportée à la saturation du capteur : L × 1 / (1,2 × 2^EV₁₀₀). Le facteur 1,2 vient de la sensibilité définie par la saturation : L_max = 2^EV₁₀₀ × 78 / (q × S), avec q = 0,65 (transmission de l'objectif et vignetage) et S = 100, soit 78 / 65 = 1,2.

Étalonnage de la scène de parc. La luminance absolue de la photo HDR autumn_hockey n'est pas connue : Poly Haven ne la publie pas. La table des indices de lumination de [Wikipedia](https://en.wikipedia.org/w/index.php?title=Exposure_value&oldid=1352562239), tirée des guides ANSI PH2.7-1973 et PH2.7-1986, donne :
- 13 pour une scène par ciel couvert lumineux, sans ombres ;
- 12 pour une scène par couvert épais.

Valeur retenue : EV₁₀₀ = 12,5, à mi-chemin des deux lignes, faute de savoir laquelle décrit la photo. La scène est donc mise à l'échelle pour que sa luminance moyenne vaille 2^(12,5 − 3) = 2^9,5 ≈ 724 cd/m² (512 cd/m² pour EV 12, 1024 cd/m² pour EV 13).

Exemple : à ISO 100 et f/8, l'exposition correcte demande N²/t = 2^12,5 ≈ 5 793, soit t = 64 / 5 793 ≈ 1/90 s.

## Profondeur de champ

- Calcul du cercle de confusion (formule ci-dessus), puis passage en pixels : c_px = c / largeur du capteur × largeur de l'image en pixels.
  - Exemple : portrait au 85 mm à f/1.8, mise au point à 2 m, fond à l'infini. A = 85 / 1,8 ≈ 47,2 mm, puis c = 47,2 × 85 / (2 000 − 85) ≈ 2,1 mm.
  - Cela fait 5,8 % de la largeur d'un plein format (36 mm) et 8,9 % de celle d'un APS-C de 23,6 mm.
- Photo : accumulation de rendus ([Haeberli et Akeley, SIGGRAPH 1990](https://www.microsoft.com/en-us/research/publication/the-accumulation-buffer-hardware-support-for-high-quality-rendering/), qui la présentent comme « a general solution to the problems of motion blur and depth-of-field »).
  - Chaque rendu place l'œil en un point différent du disque d'ouverture, de diamètre A, et décentre le cadrage pour garder fixe le plan de netteté.
  - La moyenne des rendus donne le flou exact : premier plan qui déborde sur le sujet, fond photo placé à l'infini, forme de l'ouverture.
  - Nombre de rendus : 64 à 256, à ajuster selon le temps de calcul mesuré sur téléphone.
- Viseur : effet de Babylon, avec `lensSize` choisi pour qu'un cercle de confusion de 1 corresponde au flou maximal réel de l'effet, mesuré en pixels. Il s'agit d'une approximation, plafonnée au flou maximal.

## Flou de mouvement et de bougé

- Photo : la même accumulation, chaque rendu correspondant à un instant différent du temps de pose. Les positions et les animations des sujets y sont calculées, si bien que le flou est exact à toute vitesse. Le flou de bougé fera varier l'orientation de l'appareil pendant la pose ; le modèle du tremblement de la main reste à trouver et à sourcer.
- Viseur : pas de flou de mouvement, comme dans le viseur d'un vrai appareil. C'est la lecture de Claude de la décision « viseur avec les effets de Babylon » ; à confirmer par Julien.

## Bruit numérique

Données : mesures de [William J. Claff, PhotonsToPhotos](https://www.photonstophotos.net/Charts/RN_e.htm), bruit de lecture rapporté à l'entrée en électrons, pour chaque réglage ISO (page révisée le 17 août 2026). Capacité des photosites tirée de sa page [DxOMark Derived Sensor Characteristics](https://www.photonstophotos.net/Charts/Sensor_Characteristics.htm) (révisée le 15 décembre 2025). Claff prévient que ces valeurs dérivées « tend to be wild especially for smaller sensors » et que des mesures directes sont préférables.

| Boîtier | Capacité (électrons) | Bruit de lecture à ISO 100, 800, 3200 (électrons) |
| --- | --- | --- |
| Nikon Z 6 | 83 698 | 6,87 ; 1,62 ; 1,27 |
| Nikon D5600 | 33 963 | 3,05 ; 2,16 ; non mesuré |
| Sony A7 III | 95 764 | 6,41 ; 1,34 ; 1,26 |
| Sony A6000 | 33 083 | 4,96 ; 2,71 ; 2,19 |
| Canon EOS RP | 82 327 | 36,25 ; 5,86 ; 2,83 |
| Canon EOS 2000D | 24 222 | 10,27 ; 2,03 ; 1,27 |

Le graphique de Claff donne log₂ du bruit en électrons, en fonction de log₂(ISO / 3,125) (axes lus dans le code de la page). Les valeurs du tableau en sont converties. Pour le D5600, la mesure s'arrête vers ISO 2546.

Modèle proposé, pour un photosite :
- électrons reçus : n = v × e_sat(S), avec v la valeur rapportée à la saturation (section Exposition) ;
- e_sat(S) = capacité × 100 / S : relever l'ISO réduit d'autant le nombre d'électrons qui sature la sortie. C'est cohérent avec le gain unitaire publié par Claff, à quelques pourcents près, le niveau de noir n'étant pas connu. Pour le Z 6 : 522,6 / 100 × 16 383 ≈ 85 600 électrons, pour une capacité de 83 698 ;
- écart type du bruit : σ = √(n + σ_r(S)²), avec σ_r le bruit de lecture interpolé entre les ISO mesurés.

L'image affichée compte moins de pixels que le capteur : chaque pixel affiché regroupe k photosites, et son bruit relatif est divisé par √k. Les définitions des capteurs restent à relever.

## Boîtier virtuel (version 0.3.13)

- Réglages : ouverture de f/1.4 à f/22, vitesse de 30 s à 1/4000 s, ISO de 100 à 6400, par tiers ; focale de 18 à 200 mm ; marque et format. Ces plages sont communes aux six boîtiers ; leurs plages réelles, souvent plus larges, viendront avec l'étape du bruit.
- Cellule : écart à l'exposition correcte, en IL, de −3 à +3. Pour l'instant, la scène vaut EV₁₀₀ = 12,5 où que l'on vise : pas encore de mode de mesure.
- Aperçu dans le viseur : la lumière de la scène est multipliée par 2^écart avant l'affichage, sans courbe de tons ; ce qui dépasse le blanc est écrêté. Vérifié le 8 novembre 2026 sur le site construit : un diaphragme de plus double la lumière (rapport médian 2,00 sur le fond comme sur le sol). Le rapport se mesure avec la courbe de Babylon, une puissance de 2,2 (`LinearEncodePowerApprox`) ; avec la courbe sRGB exacte, on lirait 1,86, ce qui ne vient que de la différence entre les deux courbes.
- Viseur : cadre aux proportions du capteur (vertical si l'écran l'est), champ de vue de 2 × atan(grand côté du capteur / (2 × focale)) le long de son grand côté.

## Taille du viseur (correction de la version 0.3.21)

Le moteur n'était redimensionné qu'au changement de taille de la fenêtre. Or le canevas change aussi de taille quand le panneau du boîtier passe sur plusieurs lignes, par exemple une fois les textes affichés. Le rendu gardait alors l'ancienne taille, étiré à l'affichage, et le cadre perdait les proportions du capteur.

Mesures du 9 novembre 2026 avant correction (rendu, affichage, rapport du cadre ; attendu 1,502 pour le Nikon Z 6) :
- 390 × 844 : rendu 390 × 557, affichage 390 × 453, cadre 1,221 ;
- Android : rendu 412 × 552, affichage 412 × 465, cadre 1,264 ;
- iPhone : rendu 390 × 377, affichage 390 × 273, cadre 2,077 ;
- ordinateur : rendu 1280 × 638, affichage 1280 × 606, cadre 1,582.

Après correction, le moteur est redimensionné à chaque changement de taille du canevas (`ResizeObserver`). Le rendu a la taille affichée, et le cadre mesure 1,501 à 1,504 sur les quatre profils. La photo calculée n'était pas touchée : elle a sa propre projection. Les mesures faites dans le viseur avant cette correction l'ont été sur un rendu étiré, que le navigateur réduisait à l'affichage en moyennant les pixels. Le bruit mesuré y était à 88 à 92 % du modèle (version 0.3.15). Remesuré après correction, dans les mêmes conditions (Nikon Z 6, ISO 6400, écran de 1200 × 900, k ≈ 32,7), il vaut 1,35 / 0,99 / 1,54 niveaux, pour 1,31 / 0,94 / 1,57 prévus, soit 98 à 105 % du modèle.

## Photo calculée (version 0.3.14)

Décisions de Julien du 8 novembre 2026 :
- mise au point en touchant le viseur ;
- nombre de rendus selon le flou ;
- accumulation suivie d'un lissage.

Fonctionnement :
- **Mise au point.** Le débutant touche un point du viseur, qui reste marqué. Au déclenchement, la distance de ce point est lue dans la carte de profondeur de la vue centrale, comme un autofocus ponctuel sur le collimateur choisi. Sans toucher, le point est au centre.
- **Accumulation.** Chaque rendu place l'œil sur le disque d'ouverture, élargi de S / (S − f), et décentre la projection pour garder fixe le plan de netteté : x_ndc = x × m0 / z + m8, avec m8 = dx × m0 / S. Il place aussi la scène à un instant du temps de pose. Pour cela, positions et animations sont désormais calculées à partir d'une horloge de scène. Les instants sont permutés pour ne pas suivre l'ordre des points du disque.
- **Lumière.** Les rendus sont faits en lumière linéaire, dans une texture en demi-flottants, avec `applyByPostProcess`. Sans ce réglage, les matériaux de Babylon passent en gamma et écrêtent à 1, même traitement d'image désactivé (`pbrBlockImageProcessing`). Avec lui, Babylon plafonne la lumière à 30. La somme est faite en flottants. Viennent ensuite l'exposition 2^écart, l'écrêtage au blanc et la courbe de Babylon (puissance 1/2,2). La photo mesure 1500 px de grand côté.
- **Nombre de rendus.** Il est choisi pour que les copies d'un grand flou soient espacées de 4 px au plus : 0,9 × flou / √M sur le disque, et traînée / M le long d'un mouvement, de 16 à 256. Le calcul s'arrête au bout de 5 s ; la photo indique alors les rendus reçus sur les rendus prévus.
- **Lissage.** Un flou résiduel est appliqué une fois sur la moyenne, avec un rayon de 0,45 × flou / √M, selon la profondeur de la vue centrale. Ce rayon ne dépendant que de cette profondeur, le résultat est le même que si l'on lissait chaque rendu.
- **Sol de la photo.** Le bas de la photo à 360° est projeté sur un sol plat, à 1,6 m sous l'œil (`enableGroundProjection` de Babylon). Il garde ainsi sa distance quand l'œil se déplace sur l'ouverture, au lieu d'être flou comme un horizon. La carte de profondeur ne contient pas ce sol : sa distance est calculée par l'intersection du rayon de vue avec le plan du sol, pour la mise au point comme pour le lissage.
- **Revue.** La photo s'affiche avec ses réglages, le boîtier, la distance de mise au point, les rendus et la durée du calcul. On peut l'enregistrer en JPEG.

Vérifications du 8 novembre 2026, faites dans Chromium sans écran (rendu logiciel), sur une construction locale non publiée. Elle produit des photos de 600 px et porte le plafond à 10 min, car le rendu logiciel est trop lent :
- **Premier essai.** La photo était 3,3 fois trop claire en lumière linéaire, et délavée : les matériaux appliquaient la courbe gamma une première fois. C'est corrigé par `applyByPostProcess`.
- **À f/8, sans flou.** La luminosité de la photo, rapportée à celle du viseur, vaut 1,01 sur le fond, 1,05 sur le sol et 1,06 sur l'image entière. L'écart restant correspond aux sujets qui ont bougé entre la capture du viseur et la photo.
- **Portrait au 135 mm à f/1.4, au point sur Sophia (6,6 m).** Le sujet est net, ainsi que les personnes à la même distance. Le fond et le sol sont flous de façon continue. 57 rendus, sans copies visibles.
- **Au point sur le fond (37,9 m).** Le premier plan est flou et la haie nette.
- **À 1/20 s.** Le chien qui court laisse une traînée ; les personnages immobiles restent nets.

Limites :
- **Fond à l'infini.** Le décor de la photo au-dessus du sol (arbres, haie) est vu comme s'il était à 500 m. Son flou est donc un peu surestimé (voir `docs/questions-ouvertes.md`). Le sol photographié est supposé plat.
- **Temps de calcul.** En rendu logiciel, un rendu de 600 px prend de l'ordre de la seconde, ce qui ne dit rien d'un vrai processeur graphique. Mesures de Julien du 9 novembre 2026, sur son téléphone (Google Pixel 8 Pro, Chrome, précisé le même jour) :
  - réglages par défaut : 16 rendus en 0,8 s ;
  - 135 mm à f/1.4, au point sur Sophia : 256 rendus en 2,0 s, sous le plafond de 5 s.

  Entre les deux, (2,0 − 0,8) / (256 − 16) ≈ 5 ms par rendu, la préparation (environ 0,8 s) dominant pour peu de rendus. C'est un calcul de Claude, qui suppose une préparation identique dans les deux cas.
- **Pas encore de flou de bougé.**
- **Appareils sans WebGL 2** (correction de la version 0.3.20) : la photo sortait noire. Les textures du calcul (1500 × 999 pixels) étaient créées en répétition, avec un filtrage qui attend des mipmaps. En WebGL 1, une telle texture, dont les côtés ne sont pas des puissances de 2, est incomplète et se lit en noir. Les textures sont désormais bornées aux bords et filtrées sans mipmaps ; cela évite aussi que le lissage, près d'un bord, prenne des pixels du bord opposé. Défaut trouvé par la routine de test du 9 novembre 2026, et cause isolée par des copies de contrôle.

## Bruit numérique (version 0.3.15)

Décisions de Julien du 9 novembre 2026 :
- bruit coloré selon la matrice de Bayer ;
- bruit brut, sans réduction de bruit ;
- bruit visible dans le viseur comme sur la photo.

Fonctionnement (`app/src/camera/noise.ts`) :
- **Électrons.** Pour un photosite à la sensibilité S : électrons à saturation e_sat = capacité × 100 / S, électrons reçus n = v × e_sat, écart type √(n + σ_r²). Le bruit de lecture σ_r est interpolé entre les ISO mesurés, en log₂(ISO) et log₂(électrons). Au-delà de la dernière mesure, la dernière valeur est gardée : D5600 au-delà d'ISO 2546.
- **Regroupement.** Un pixel de l'image regroupe k = pixels effectifs / pixels de l'image photosites. Pour chaque canal, seule une part capte sa couleur : la moitié pour le vert, un quart pour le rouge et pour le bleu. La matrice de Bayer compte en effet deux fois plus de verts que de rouges ou de bleus (« twice as many green elements as red or blue », [Wikipedia, Bayer filter](https://en.wikipedia.org/w/index.php?title=Bayer_filter&oldid=1384004962), source secondaire). Écart type par canal, rapporté à la saturation : √(n + σ_r²) / (e_sat × √(k × part)).
- **Tirages.** Les tirages gaussiens viennent d'une texture de 512 × 512 tirages (méthode de Box-Muller), lue deux fois, la seconde tournée de 37°, pour casser la répétition.
- **Photo.** Le bruit est ajouté après le flou optique et avant l'écrêtage, avec k calculé pour 1500 px.
- **Viseur.** Le bruit est tiré à nouveau à chaque image, avec k calculé pour la taille du cadre à l'écran. C'est une approximation : l'image du viseur est déjà encodée et écrêtée, on revient en lumière linéaire par la puissance 2,2, et les hautes lumières écrêtées n'ont plus de bruit. Il est retiré pendant le calcul d'une photo, qui ajoute le sien.
- **Pas de réduction de bruit** : les traitements des boîtiers sont propres à chaque marque et non documentés dans les sources lues.
- **Chargement** (correction de la version 0.3.18) : Babylon ne déclare la scène prête que si les post-traitements de la caméra le sont (`Camera.isReady`, Babylon.js 9.35.0). Un shader du bruit qui ne compile pas bloquait donc le chargement, ce qui est arrivé sur le téléphone de Julien le 9 novembre 2026. Le bruit du viseur n'est désormais attaché qu'une fois son shader compilé. En cas d'échec, le viseur reste sans bruit et l'erreur de compilation s'affiche à l'écran. La cause de l'échec sur ce téléphone n'est pas connue à ce jour.

Définition des capteurs :

| Boîtier | Pixels effectifs | Source |
| --- | --- | --- |
| Nikon Z 6 | 24,5 millions | [manuel en ligne Nikon](https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html), lu |
| Nikon D5600 | 24,2 millions | [fiche de Clifton Cameras](https://www.cliftoncameras.co.uk/uploads/downloads/Product%20Specifications/NIKON/Nikon%20D5600%20Body%20Only%20Full%20Spec.pdf), extrait de recherche, page non ouverte |
| Sony A7 III | environ 24 200 000 | [guide d'aide Sony](https://helpguide.sony.net/ilc/1720/v1/en/print.pdf), lu |
| Sony A6000 | 24,3 millions | [Wikipedia, Sony α6000](https://en.wikipedia.org/w/index.php?title=Sony_%CE%B16000&oldid=1380408739), lu, source secondaire (le manuel Sony n'est pas joignable depuis l'environnement de travail) |
| Canon EOS RP | environ 26,2 millions | [fiche Canon Royaume-Uni](https://www.canon.co.uk/cameras/eos-rp/specifications/), extrait de recherche, page non ouverte |
| Canon EOS 2000D | 24,1 millions | [fiche Canon Royaume-Uni](https://www.canon.co.uk/cameras/eos-2000d/specifications/), extrait de recherche, page non ouverte |

Vérification du 9 novembre 2026, dans le viseur du site construit. Le bruit étant tiré à nouveau à chaque image, la différence entre deux images, sur le fond immobile, divisée par √2, isole le bruit. On la compare au modèle, calculé pixel par pixel (Nikon Z 6, k ≈ 31) :

| ISO | Mesuré, en niveaux sur 255 (rouge, vert, bleu) | Prévu |
| --- | --- | --- |
| 6400 | 1,23 ; 0,92 ; 1,34 | 1,39 ; 1,00 ; 1,53 |
| 100 | 0,07 ; 0,01 ; 0,10 | 0,17 ; 0,12 ; 0,18 |

À ISO 6400, la mesure atteint 88 à 92 % du modèle, avec le rouge et le bleu plus bruités que le vert d'un facteur proche de √2, comme prévu. À ISO 100, le bruit prévu est inférieur à un niveau : l'arrondi aux niveaux entiers l'efface presque entièrement.

Visibilité. Calcul pour le Z 6 à ISO 6400, dans une zone moyenne correctement exposée (v ≈ 0,10) :
- e_sat = 83 698 × 100 / 6400 ≈ 1308 électrons, n ≈ 131 électrons, σ = √(131 + 1,21²) ≈ 11,5 électrons ;
- un photosite seul a donc un bruit relatif de 11,5 / 131 ≈ 8,8 % ;
- sur une photo de 1500 px, chaque pixel regroupe k ≈ 16,3 photosites, dont environ 8,2 verts et 4,1 rouges ou bleus ;
- le bruit relatif tombe à 8,8 / √8,2 ≈ 3,1 % pour le vert et 8,8 / √4,1 ≈ 4,3 % pour le rouge et le bleu.

Le bruit reste donc discret à cette échelle, sauf dans les ombres et les photos sous-exposées. Décision de Julien du 9 novembre 2026 : c'est un outil d'apprentissage, tout doit se voir dans le viseur et sur la photo ; un interrupteur, au choix de l'utilisateur, coupe l'aperçu dans le viseur, pour s'entraîner. Décisions du même jour sur la mise en œuvre :
- le bruit se rend visible par une loupe, dans le viseur (jusqu'à 100 %) et sur l'écran de revue ;
- l'aperçu dans le viseur a un interrupteur général et un interrupteur par effet ;
- l'aperçu est en marche à l'ouverture du simulateur.

## Aperçu dans le viseur (version 0.3.16)

Les vrais hybrides permettent de couper l'effet des réglages sur la luminosité de la visée :
- Sony A7 III, réglage « Live View Display » sur « Setting Effect OFF » : « Live View is always displayed with the appropriate brightness even in [Manual Exposure] mode » ([guide d'aide Sony ILCE-7M3](https://helpguide.sony.net/ilc/1720/v1/en/print.pdf), lu) ;
- Nikon Z 6, réglage personnalisé « d8 Apply settings to live view » : « select Off to adjust brightness and hue for ease of viewing » ([manuel en ligne Nikon Z 7/Z 6](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_d08.html), lu).

Dans TutoPhoto (bouton « Aperçu ») :
- **Interrupteur général** « Aperçu des réglages » : coupé, le viseur reste correctement exposé et sans bruit, quels que soient les réglages. Il faut lire la cellule et anticiper.
- **Un interrupteur par effet** : luminosité (exposition) et bruit. Ils ne comptent que si l'interrupteur général est en marche. La profondeur de champ approchée s'y ajoutera.
- **En marche par défaut**. Le choix est mémorisé dans le navigateur.
- **Rappel dans le viseur** : un bandeau dit ce qui n'est pas montré, comme les icônes des boîtiers (« When [Setting Effect OFF] is selected, the icon is displayed on the Live View screen », Sony ; « A g icon is displayed when Off is selected », Nikon).
- **La photo garde toujours tous les effets.**

Luminosité coupée et bruit en marche : le viseur montre l'image réelle ramenée à une exposition correcte, avec le bruit de l'image réelle. L'image réelle vaut l'image affichée multipliée par g = 2^écart. Le bruit est calculé pour l'image réelle, puis divisé par g. Une photo sous-exposée paraît donc bruitée, comme si on l'éclaircissait après coup.

Vérification du 9 novembre 2026, dans le site construit, avec le Nikon Z 6 à ISO 3200, f/22, 1/4000 s (écart de −3,5 IL) :
- tout en marche : image sombre, bruit de 1,28 / 0,99 / 1,69 niveaux (rouge, vert, bleu) ;
- luminosité coupée : image correctement exposée, bruit de 3,68 / 2,78 / 4,94 niveaux ;
- aperçu coupé : bruit nul.

Le rapport mesuré, de 2,8 à 2,9, est proche du rapport attendu, calculé ainsi :
- en lumière linéaire, l'image et son bruit sont multipliés par g = 2^3,5 ≈ 11,3 ;
- l'encodage E = L^(1/2,2) a une pente proportionnelle à L^(−0,545), plus faible là où l'image est plus claire ;
- en niveaux, le bruit est donc multiplié par 11,3 × 11,3^(−0,545) = 11,3^0,455 ≈ 3,0.

L'écart restant, de 3 à 7 %, n'est pas expliqué ; l'arrondi aux niveaux entiers en est une cause possible.

## Loupe (version 0.3.17)

Les hybrides grossissent l'image pour vérifier la mise au point, avant la prise de vue comme à la relecture. Exemples dans le [guide d'aide Sony ILCE-7M3](https://helpguide.sony.net/ilc/1720/v1/en/print.pdf), lu :
- « Focus Magnifier » : « You can check the focus by enlarging the image before shooting » ;
- « Enlarge Image » : « Enlarges the image being played back. Use this function to check the focus of the image ».

**100 %** veut dire ici un pixel de l'image pour un photosite du capteur, affiché sur un pixel CSS. La définition du capteur le long de ses côtés est calculée par Claude : √(pixels effectifs × grand côté / petit côté), puis son complément. Par exemple, 6066 × 4039 pour le Nikon Z 6. C'est une approximation : la forme exacte de l'image n'est pas lue dans les sources.

Loupe du viseur (bouton « Loupe ») :
- **Crans** : sans loupe, 50 %, 100 %, puis retour. Le cran de 50 % est sauté s'il grossit moins de 1,25 fois.
- **Grossissement à 100 %** : définition du capteur / grand côté du cadre, en pixels du canevas. Par exemple, 6066 / 1109 ≈ 5,5 pour le Z 6 sur un écran de 1200 × 900.
- **Position** : la zone grossie est centrée sur le point de mise au point et reste dans le cadre. Toucher le viseur déplace le point, et la loupe le suit.
- **Rotation** : l'appareil tourne plus lentement, d'un facteur égal au grossissement.
- **Bruit** : il suit le grossissement, avec k = pixels effectifs / (pixels du cadre × grossissement²), soit environ 1 à 100 %.
- **La photo couvre toujours tout le cadre.** La loupe ne change que l'affichage.

Loupe de l'écran de revue : toucher la photo recalcule une fenêtre à 100 % autour du point touché. La fenêtre a la taille de la zone d'affichage, avec 1500 pixels au plus de côté.
- **Même photo** : même instant, même orientation de l'appareil, même distance de mise au point. Seule la projection change, resserrée sur la fenêtre : x' = (x − centre) / demi-largeur, en coordonnées normalisées.
- **Nouveau calcul** : la fenêtre est recalculée par accumulation (rendus, flou, bruit), avec la même limite de 256 rendus et de 5 s. Ce n'est pas un agrandissement de la photo de 1500 px.
- **Navigation** : toucher la fenêtre la recentre ; « Photo entière » revient à la photo. « Enregistrer la photo » enregistre toujours la photo entière.

Bruit à 100 % : moins d'un photosite de chaque couleur par pixel. Le dématriçage interpole les couleurs manquantes, d'une manière propre à chaque boîtier et non documentée dans les sources lues. Le modèle garde donc le bruit d'un photosite seul : k × part est ramené à 1 au moins.

Vérification du 9 novembre 2026, dans le site construit, sur une zone de fond immobile (Nikon Z 6, ISO 6400, f/10, 1/4000 s, écran de 1200 × 900) :

| Vue | k | Mesuré, en niveaux (rouge, vert, bleu) | Prévu |
| --- | --- | --- | --- |
| Sans loupe | 31,3 | 1,05 ; 1,05 ; 1,05 (écart absolu médian, arrondi aux niveaux) | 1,29 ; 0,94 ; 1,48 (médiane) |
| Loupe 50 % | 4,2 | 4,19 ; 3,15 ; 4,19 (écart absolu médian) | 3,71 ; 2,65 ; 4,03 (médiane) |
| Loupe 100 % | 1,05 | 2,94 ; 3,05 ; 3,48 (écart type) | 3,52 ; 3,64 ; 4,24 |

À 100 %, la mesure atteint 82 à 84 % du modèle, et les trois couleurs ont un bruit voisin, puisque chacune vaut un photosite seul. Sur la loupe de l'écran de revue, la fenêtre a été vérifiée (taille, position, légende), mais son bruit n'a pas été mesuré.

Limites :
- **Fond flou à 100 %.** La photo à 360° du fond fait 8192 pixels pour 360°, soit environ 22,8 pixels par degré. Le Z 6 à 100 % en demande 6066 / 39,5° ≈ 154 par degré au 50 mm : le fond est agrandi environ 6,8 fois et paraît flou. Il l'est déjà un peu sur la photo de 1500 px (environ 38 pixels par degré au 50 mm).
- **Bruit discret, même à 100 %.** Pour le Z 6 à ISO 6400, il est d'environ 3 à 4 niveaux sur 255 dans les tons moyens. C'est ce que donnent les mesures de Claff pour ce boîtier.
- **Animations grossies.** À 100 %, les petits mouvements des personnages animés sont grossis eux aussi.

## Profondeur de champ du viseur (versions 0.3.22 et 0.3.23)

Décisions de Julien :
- le viseur montre une profondeur de champ approchée, la photo calculée au déclenchement restant exacte (8 novembre 2026, « avec les effets de Babylon.js ») ;
- le 9 novembre 2026, après l'essai de l'effet de Babylon (version 0.3.22) et l'explication des deux options, choix de l'option B : un flou en disque de taille physique, écrit pour TutoPhoto (version 0.3.23).

Version 0.3.22, effet de Babylon.js (`DepthOfFieldEffect`), remplacé :
- l'effet mélange l'image nette et des images floutées de taille fixe, à proportion du cercle de confusion, plafonné à 1 ;
- flou maximal mesuré : 19,75 à 28,5 px selon l'écran et la zone, 24 px retenus pour le calage de `lensSize` ;
- écart à mi-course : environ 9 % de flou en moins (70 mm à f/2, sur 1200 × 900).

Version 0.3.23, flou en disque de taille physique (`app/src/camera/viewfinderDof.ts`) :
- **Diamètre du flou** : la formule de la photo, c = (f / N) × f / (S − f) × |D − S| / D, multipliée par les pixels du canevas par mm de capteur, loupe comprise. Le rayon est plafonné à 32 px, soit un diamètre de 64 px.
- **Algorithme** : « scatter-as-gather » en une passe, de Dennis Gustafsson ([« Bokeh depth of field in a single pass », 4 mai 2018, copie archivée](https://web.archive.org/web/20201215123940/https://blog.tuxedolabs.com/2018/05/04/bokeh-depth-of-field-in-single-pass.html)). Le billet n'a pas été ouvert ; l'algorithme a été lu dans sa reproduction commentée par l'[exemple 45-bokeh de bgfx](https://github.com/bkaradzic/bgfx/tree/master/examples/45-bokeh) (elven cache, 2021). Le code de TutoPhoto est écrit d'après cette description, sans copie. Principe :
  - autour de chaque pixel, des échantillons sont pris sur une spirale (pas de l'angle d'or), de plus en plus espacés ;
  - un échantillon compte s'il couvre le pixel central, c'est-à-dire si son propre rayon de flou dépasse sa distance au centre ;
  - un échantillon plus loin que le pixel central voit son flou limité au double de celui du centre : le fond flou ne déborde pas sur un sujet net, alors qu'un premier plan flou déborde sur un fond net, comme sur une vraie photo.
- **Résolution** : le flou est calculé à mi-résolution, avec environ 170 échantillons par pixel (pas de 0,75 pixel de la passe). L'image est ensuite recomposée en pleine résolution, selon la taille moyenne du flou des échantillons, comme dans l'exemple de bgfx : nette en dessous d'un pixel de flou, floue au-delà de deux.
- **Carte de profondeur et mise au point** : comme en version 0.3.22. Carte propre au viseur, en z caméra, qui inclut le sol invisible de 40 × 40 m ; mise au point continue sur le point choisi, relue toutes les 200 ms. Depuis la version 0.3.26, la carte et la distance viennent de l'autofocus du viseur, en AF ponctuel ou continu (voir « Mise au point »).
- **Interrupteur et photo** : case « Profondeur de champ (approchée) » de la fenêtre « Aperçu ». L'effet est retiré pendant le calcul de la photo.

- **Arrêt de la spirale** : la spirale s'arrête au plus grand flou présent dans l'image, celui d'un point à l'infini ou celui du sol en bas du cadre, au lieu du plafond. Aux réglages par défaut (50 mm, f/8), ce flou fait moins de 2 px, et le calcul est presque gratuit. Limite : un objet plus proche que le sol en bas du cadre verrait son flou limité à cette valeur ; il n'y en a pas dans la scène de parc.
- **Poids du pixel central** : sur la spirale, chaque échantillon représente une couronne de surface 2π × pas, le centre un disque de surface π × pas². Son poids, rapporté à celui d'un échantillon, vaut donc pas / 2, soit 0,375. Avec un poids 1, comme dans l'algorithme d'origine, un flou de 10,9 px attendus mesurait 9,5 à 10 px : les petits flous, qui ont peu d'échantillons, étaient trop nets.

Mesures du 9 novembre 2026, avec la méthode de la version 0.3.22 (disque ajusté par moindres carrés sur des zones de fond sans sujet net ni en mouvement) :

| Réglage | Écran | Flou réel attendu | Mesuré |
| --- | --- | --- | --- |
| 70 mm, f/2 | 1200 × 900 | 10,9 px | 10,5 à 11,0 px (quatre zones) ; 11,5 à 11,75 px depuis la version 0.3.25 |
| 135 mm, f/1.4 | 1200 × 900 | 58,7 px | 57,25 px (deux zones ; erreur de 0,31 niveau pour un disque, de 1,5 à 1,6 pour une gaussienne) |
| 135 mm, f/1.4 | 390 × 844 | 25,1 px | 21,5 à 23,5 px, indicatif |

Calcul du flou attendu au 135 mm à f/1.4, mise au point vers 6,6 m, fond à 500 m :
- c = (135 / 1,4) × 135 / (6600 − 135) × (500 000 − 6600) / 500 000 ≈ 1,99 mm sur le capteur ;
- × 1060 / 35,9 ≈ 29,5 pixels par mm sur un écran de 1200 × 900, d'où 58,7 px ;
- × 453 / 35,9 ≈ 12,6 pixels par mm sur un téléphone de 390 × 844 tenu à la verticale, d'où 25,1 px.

Conclusion (version 0.3.23) : le flou a la taille physique à 1 à 3 % près sur ordinateur, et la forme d'un disque.

Version 0.3.25 :
- **Grain supprimé** : au moins 64 échantillons, et une même spirale pour tous les pixels (voir les limites).
- **Taille des petits flous** : avec plus d'échantillons, un flou de 10,9 px attendus mesurait 12,0 à 12,25 px, soit environ 12 % de trop. Une partie vient du passage par la mi-résolution, qui ajoute son propre flou :
  - lecture par blocs de 2 × 2 pixels : variance (2² − 1) / 12 = 0,25 pixel² par axe ;
  - agrandissement bilinéaire : 2² / 6 ≈ 0,67 pixel² par axe.
  Un disque de diamètre D ayant une variance de D² / 16 par axe, ces 0,92 pixel² portent un disque de 10,9 px à environ 11,55 px.
- **Compensation** : le disque calculé est réduit d'autant (r² − 0,92, en rayon de la passe). Mesure après compensation : 11,5 à 11,75 px, soit environ 7 % de trop. Le reste de l'écart n'est pas expliqué ; la distance de mise au point retenue pour le calcul attendu (6,6 m) n'a pas été relevée dans le viseur.
- **Grands flous** : la compensation y est négligeable (environ 0,2 % au plafond), et le pas de la spirale y est inchangé. Ils n'ont pas été remesurés : les personnages bougeaient dans les zones de fond utilisables. Sur téléphone, les zones de fond libres sont plus étroites que le flou mesuré (moins de 25 px de large) : l'ajustement n'y est pas fiable, et la mesure reste indicative.

Limites :
- **Plafond** : 64 px de diamètre (rayon de 32 px).
- **Mi-résolution** : la transition entre net et flou se fait sur environ deux pixels.
- **Grain** (corrigé en version 0.3.25) : les flous moyens montraient un grain à l'échelle du pixel, surtout sur les petits écrans. Il y avait peu d'échantillons (environ 20 pour un flou de 22 px sur un écran de 390 px), et la spirale démarrait sous un angle propre à chaque pixel. Désormais, le pas de la spirale est réduit pour garder au moins 64 échantillons, sans dépasser 170, et tous les pixels partagent la même spirale.
- **Fond à 360°** : il est traité comme un fond à 500 m, y compris le sol au-delà de 20 m.
- **Coût** : la spirale compte au plus environ 170 échantillons par pixel de la passe. Sur le Google Pixel 8 Pro de Julien, la fluidité « semble bonne » (10 novembre 2026, version 0.3.31 ; le 135 mm à f/1.4 était le cas le plus coûteux à vérifier). En rendu logiciel (tests), une image prend alors plusieurs secondes sur un écran d'ordinateur.

## Mise au point : AF ponctuel ou continu (version 0.3.26)

Décision de Julien du 9 novembre 2026 (« suivons ta reco ») : les modes de mise au point arrivent dans l'ordre recommandé, un par pull request. D'abord l'AF ponctuel ou continu (MAP-04), puis les modes de zone (MAP-05), puis la détection des yeux (MAP-09).

Ce que disent les manuels, lus le 9 novembre 2026 :
- Nikon Z 7/Z 6, « Focus » ([manuel en ligne](https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html)) :
  - AF-S, « For stationary subjects » : mise au point à mi-course du déclencheur ; « focus will lock while the shutter-release button is pressed halfway » ; le collimateur passe du rouge au vert. Par défaut, le déclenchement n'a lieu que si la mise au point est faite (« focus priority »).
  - AF-C, « For moving subjects » : « The camera focuses continuously while the shutter-release button is pressed halfway », et prédit la distance finale d'un sujet qui bouge. Par défaut, le déclenchement a lieu même sans mise au point (« release priority »).
- Sony α9, « Focus Mode » ([guide d'aide](https://helpguide.sony.net/ilc/1650/v1/en/contents/TP0001486782.html)) : AF-S « locks the focus once focusing is complete » ; AF-C « continues to focus while the shutter button is pressed and held halfway down ».

Dans TutoPhoto (`app/src/camera/autofocus.ts`) :
- **Choix du mode** : bouton « AF-S / AF-C » du boîtier, remplacé en version 0.3.27 par la fenêtre « Mise au point ». AF-C par défaut jusqu'à la version 0.3.35, ce qui gardait le comportement des versions précédentes ; AF-S depuis la version 0.3.36, réglage par défaut du Z 6 (« Single AF », page [« Defaults »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html) du manuel, lue le 10 novembre 2026). Le choix est mémorisé avec le boîtier.
- **Mi-course** : un écran tactile n'a pas de déclencheur à mi-course ; toucher le viseur en tient lieu.
- **AF-S** :
  - toucher le viseur mesure la distance au point touché et la verrouille jusqu'au toucher suivant, comme si le déclencheur restait à mi-course entre les photos ;
  - le repère du point passe au vert, comme le collimateur du Z 6 ;
  - recadrer après le toucher garde la distance : c'est la mise au point suivie d'un recadrage ;
  - sans toucher depuis le passage en AF-S, l'objectif reste à la distance précédente ; la photo fait alors le point au déclenchement, et cette distance reste verrouillée.
- **AF-C** : la distance est relue au point choisi toutes les 200 ms, comme si le déclencheur était tenu à mi-course en permanence. La photo mesure la distance au déclenchement.
- **Affichage** : le viseur indique le mode et la distance (« AF-S · verrouillée à 6,5 m »), la légende de la photo aussi. La distance affichée est une aide à l'apprentissage ; les pages lues n'en parlent pas.
- **Exemple de SIT-06** : en AF-S, toucher le chien qui court verrouille sa distance ; s'il change de distance avant le déclenchement, il sort de la zone nette. En AF-C, la mise au point le suit.
- **Coût** : la carte de profondeur du viseur est rendue à chaque image quand la profondeur de champ du viseur s'en sert. Sinon, elle n'est rendue qu'avant chaque mesure, soit cinq fois par seconde en AF-C : couper l'aperçu de la profondeur de champ allège toujours le viseur.

Non simulé :
- les échecs de l'autofocus (sujet peu contrasté, faible lumière, motifs répétés, d'après la liste du manuel Nikon) : la mise au point réussit toujours ;
- le temps de mise au point, et la priorité au déclenchement ou à la mise au point ;
- la prédiction du mouvement : en AF-C, la distance mesurée au déclenchement est exacte, donc la mise au point parfaite ;
- le mode automatique et ses hésitations, que cite la fiche de MAP-04 ; le mode AF-F du Z 6, réservé à la vidéo ; la mise au point manuelle.

## Modes de zone AF (version 0.3.27)

Décision de Julien du 9 novembre 2026 : les quatre points proposés sont validés.
1. AF point sélectif : le fonctionnement des versions précédentes.
2. AF zone large (S) et (L) : mise au point sur le sujet le plus proche de la zone.
3. AF zone automatique : avec la détection des yeux (MAP-09), sur laquelle elle repose chez Nikon.
4. Laissés de côté : le pinpoint, qui ne diffère que par la finesse et la vitesse, non simulées ; la zone dynamique, dont le manuel ne dit pas comment elle choisit entre les points voisins.

Ce que dit le manuel du Z 6 ([« Focus »](https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html) ; termes français du [manuel en français](https://onlinemanual.nikonimglib.com/z7_z6/fr/05_basic_settings_01.html)), lu le 9 novembre 2026 :
- AF point sélectif (« Single-point AF ») : « The camera focuses on a point selected by the user » ; c'est le réglage par défaut.
- AF zone large (S) et (L) (« Wide-area AF ») : comme le point sélectif, sur une zone plus large, « the focus areas for Wide-area AF (L) being larger than those for Wide-area AF (S) ». Et : « If the selected focus area contains subjects at different distances from the camera, the camera will assign priority to the closest subject ».
- Déclencheur tactile : une option « Touch the display to focus on the selected point. Lifting your finger from the display does not release the shutter ». C'est le geste que TutoPhoto utilise depuis la version 0.3.26.

Dans TutoPhoto :
- **Fenêtre « Mise au point »**, ouverte par le bouton du boîtier (« AF-C · Point ») : mode de mise au point (AF-S, AF-C) et mode de zone AF, avec les termes du manuel en français.
- **Zone large** : l'autofocus lit toute la zone dans la carte de profondeur du viseur et retient la plus petite distance. Sur le fond à 360°, chaque pixel prend la distance du plan du sol le long de son rayon.
- **Taille des zones** : le manuel ne la donne pas, et les recherches du 9 novembre 2026 ne l'ont pas trouvée pour le Z 6. Elle est choisie pour TutoPhoto : des carrés de 10 % (S) et de 20 % (L) du grand côté du cadre. La zone est rognée au cadre (à la zone couverte par l'autofocus depuis la version 0.3.34, voir « Collimateurs »), et le repère montre la zone réellement mesurée.
- **Photo** : sans verrou, l'autofocus du viseur fait le point au déclenchement, avec le mode de zone choisi, et la photo prend cette distance. La photo ne mesure elle-même la distance au point que si cette mesure échoue.
- **Affichage** : le viseur et la légende de la photo indiquent la zone (« AF-S · Zone L · verrouillée à 5,4 m »).
- **Exemple mesuré** le 9 novembre 2026 dans le navigateur de test, sur ordinateur : au même point, en bas du cadre, 6,2 m en point sélectif et 5,4 m en zone large (L), où le sol en bas du cadre est le sujet le plus proche (4,4 m et 3,8 m sur le profil Android, tenu à la verticale). C'est le piège de la zone large : ce qui est proche dans la zone prend la mise au point.

Non simulé : la taille minimale d'un sujet pour qu'une zone large le retienne (un seul pixel suffit ici), la zone dynamique, le pinpoint.

## Détection des yeux et zone automatique (version 0.3.29)

Décision de Julien du 9 novembre 2026 : les cinq points proposés sont validés, ainsi que le placement à la main des yeux des modèles sans squelette et du chien. Pour le cas sans visage : « fais ce qu'il y a de plus réaliste », mot d'ordre désormais inscrit dans `CLAUDE.md`.

Ce que dit le manuel du Z 6, lu le 9 novembre 2026 :
- [« Focus »](https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html), AF zone automatique : « The camera automatically detects the subject and selects the focus area. » Visage ou œil détecté : bordure ambre en AF-C, verte une fois la mise au point faite en AF-S. Si le sujet détourne la tête, « the focus point will move to track their motion ». La détection peut échouer si « the subject's face occupies a very large or very small proportion of the frame », ou si les yeux sont cachés.
- Déclencheur tactile, en zone automatique : « the camera will track the selected subject as it moves through the frame. To switch to a different subject, tap it in the display », et elle fait le point sur « the face or eye closest to the selected point ».
- [Réglage a4](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_a04.html) ([en français](https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_05_a04.html), « Détect. visage-yeux AF zone auto ») : visages et yeux, visages seulement, chiens et chats, ou désactivé. Personnes et animaux ne sont pas détectés en même temps. Le réglage par défaut n'est pas donné sur cette page ; celle des réglages par défaut (« Defaults », lue le 10 novembre 2026) donne « Face and eye detection on », le réglage retenu par TutoPhoto.
- Rien sur le cas sans visage. Le seul texte de constructeur trouvé est celui du compact Nikon COOLPIX P1100 ([« AF area mode »](https://onlinemanual.nikonimglib.com/p1100/en/08-31.html)) : sans visage, « the camera automatically selects one or more of the nine focus areas containing the subject closest to the camera ». C'est aussi la règle de la zone large du Z 6. Elle est retenue, faute de mieux, et présentée comme telle.

Dans TutoPhoto (`app/src/camera/faces.ts`, `app/src/camera/autofocus.ts`) :
- **Fenêtre « Mise au point »** : quatrième mode de zone, « AF zone automatique », et le réglage « Détect. visage-yeux AF zone auto », avec les termes du manuel en français. Par défaut, détection des visages et des yeux.
- **Yeux des personnages** :
  - Sophia et Nathan : les os des yeux de leur squelette ;
  - Dennis, Percy et Fabienne (modèles figés) et le chien Jim : placés à la main. La pupille est visée sur une vue rapprochée de face, puis la profondeur est lue à ce pixel dans la carte du viseur ; la visée de Babylon donne le même point à 0,3 mm près sur Dennis. Chaque point a été vérifié en le reprojetant sur une autre vue. Pour le chien, il l'a été à deux autres instants du galop, les yeux étant attachés à l'os de sa tête.
  - L'œil gauche de Fabienne, collé à la joue de Percy, n'est pas placé.
  - Écarts entre les yeux mesurés : Dennis 6,5 cm, Percy 6,0 cm, le chien 9,2 cm (modèle stylisé). Celui de Dennis sert pour Fabienne.
- **Un œil est vu** s'il est dans le cadre et si, à son pixel, la carte de profondeur montre une surface à moins de 4 cm de l'œil. Il ne doit y avoir ni obstacle devant, ni fond derrière quand le pixel tombe à côté de l'œil. Un œil de profil caché par le nez, ou une tête de dos, échoue donc naturellement à ce test. Pendant la mise au point de cette version, le test n'excluait d'abord que les obstacles devant : la routine a alors trouvé l'œil du chien à 15,9 m au lieu de 9 m, son pixel tombant sur le fond.
- **Taille du visage**, seuils choisis pour TutoPhoto, le manuel n'en donnant pas : écart entre les yeux rapporté au grand côté du cadre, sans la loupe. Visage détecté de 0,4 % à 25 %, yeux à partir de 0,8 %. Calcul pour Dennis au 50 mm, en plein format : 50 × 0,065 / (D × 35,9), d'où des yeux détectés jusqu'à 11,3 m et un visage jusqu'à 22,6 m. Au 18 mm, c'est 4,1 m et 8,1 m ; au 135 mm, des yeux jusqu'à 30,6 m.
- **Œil retenu** : le plus proche de l'appareil parmi les yeux vus. Le manuel dit seulement « one or the other of the subject's eyes ».
- **Choix du sujet** : sans toucher, le visage le plus proche du point de mise au point (le centre au départ), puis suivi. Toucher le viseur choisit le visage le plus proche du point touché, puis le suit. Si le visage suivi n'est plus détecté, l'appareil passe au visage le plus proche du point.
- **Sans visage** : le sujet le plus proche dans tout le cadre (règle du P1100). Le cadre entier était lu, le manuel ne donnant pas la couverture de l'autofocus ; depuis la version 0.3.34, c'est la zone couverte, d'après les communiqués de Nikon (voir « Collimateurs »). Appareil horizontal, c'est souvent le sol en bas du cadre : le piège est le même qu'en zone large. Après un toucher sans visage détecté : le point touché, comme le déclencheur tactile du Z 6.
- **Affichage** : repère ambre autour de l'œil ou du visage, vert une fois verrouillé en AF-S. Le viseur et la légende de la photo indiquent ce qui a été retenu (« AF-C · Auto · œil · 6,6 m »).
- **Mesures du 9 novembre 2026 dans le navigateur de test**, vue de départ, sur ordinateur :
  - œil de Sophia à 6,6 m, suivi ;
  - toucher à droite : œil de Percy à 6,3 m ;
  - détection coupée : sol à 5,4 m ;
  - animaux : œil du chien à 9,0 m quand il passe.

Corrigé dans la même version : la carte de profondeur du viseur gardait la taille du canevas à sa création (Babylon ne la redimensionne pas), soit 1000 × 738 pour un canevas de 1000 × 706 pendant les mesures. Elle suit désormais le canevas, par exemple quand on tourne le téléphone.

Non simulé :
- **Délai de suivi** (réglage a3 du Z 6) : quand le chien passe derrière quelqu'un, la mise au point saute aussitôt ailleurs.
- **Conditions de détection** : lumière, lunettes, cheveux et mouvement ne gênent pas la détection, et toutes les races sont reconnues.
- **Sujets autres que des visages** : ils ne sont pas suivis.
- **Choix d'un autre visage au sélecteur** : non simulé ; on touche le visage voulu.

## Indicateur d'équilibre (version 0.3.31)

Décisions de Julien :
- forme B, un triangle dans lequel un point bouge (9 novembre 2026) ;
- n'implémenter que ce qui est sourcé (10 novembre 2026, `docs/cadrage.md`).

Il s'affiche dans le viseur, en haut à gauche, comme les informations d'un viseur (`app/src/ui/balance.ts`). Sur petit écran, il ne montre que le triangle ; un toucher affiche les lignes. Une première version, sous le viseur dans le panneau, réduisait le viseur de l'iPhone à 390 × 66 pixels (routine de test) : la routine contrôle désormais que le viseur garde au moins 35 % de la hauteur de la fenêtre. L'indicateur se coupe dans la fenêtre « Aperçu » pour s'entraîner. Il donne une ligne par réglage, au point visé : œil ou visage suivi en zone automatique, sinon point de mise au point.
- **Ouverture : zone nette**, sans jugement. Formule du diamètre du flou ([Wikipedia, « Circle of confusion », révision 1335590423](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)) : c = A × |S₂ − S₁| / S₂ × f / (S₁ − f), avec A = f / N. On pose c égal au flou acceptable courant, d / 1500 (d : diagonale du capteur), soit 0,029 mm en plein format. Avec q = c × N × (S₁ − f) / f², la limite proche vaut S₁ / (1 + q), la limite lointaine S₁ / (1 − q), ou l'infini si q ≥ 1. Exemple : 50 mm, f/8, mise au point à 6,6 m. q = 0,0287 × 8 × 6550 / 2500 ≈ 0,60, d'où une zone nette de 4,1 m à 16,6 m.
- **Vitesse : traînée du sujet visé**, comparée au même flou acceptable. Un point (X, Y, Z) de la caméra se projette en x = f X / Z ; un sujet de vitesse v se déplace sur le capteur de f (vX Z − X vZ) / Z² × t (et de même en y). Exemple : le chien (3,5 m/s, de profil, à 9 m) au 50 mm et à 1/100 s laisse 50 × 3,5 × 0,01 / 9 ≈ 0,19 mm, soit 6,6 à 6,8 fois la limite (6,6 mesuré dans le navigateur de test). À 1/4000 s, c'est 0,005 mm, sous la limite. Les sujets immobiles n'ont pas de traînée. Le bougé de la main n'est ni sourcé ni simulé : il n'est pas compté. Depuis la version 0.3.32, la traînée est aussi donnée en pixels de la photo (MVT-01, « traînée mesurée en pixels ») : traînée sur le capteur × 1500 / largeur du capteur, soit environ 8 px pour le chien à 1/100 s (0,19 × 1500 / 35,9) et 0,2 px à 1/4000 s.
- **ISO : bruit au point visé**, en rapport signal sur bruit d'un pixel de la photo (1500 px de grand côté), avec le modèle de bruit du viseur. Seuils de la norme des sensibilités numériques ([Wikipedia, « Film speed », révision 1383727213](https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213)) : 40:1 pour une « excellent image quality », 10:1 pour une « acceptable image quality ». Ils sont définis pour 70 pixels par cm vus à 25 cm ; une photo de 1500 px y fait environ 21 cm de large. La valeur au point visé est lue dans l'image du viseur, en moyenne sur 5 × 5 pixels pour lisser le bruit affiché. Approximation : canal vert seul, la norme pondérant luminance et couleur d'une façon que l'article ne détaille pas. Hautes lumières écrêtées : indiqué tel quel. Mesures du 10 novembre 2026, au même point du sol en bas du cadre (iPhone) : 176:1 à ISO 100 (excellent), 29:1 à ISO 6400 et 1/4000 s (acceptable), soit un rapport de 0,16. Le calcul attendu donne 0,17 : avec 6 IL de sensibilité et 0,87 IL d'exposition en plus, le pixel reçoit 64 / 2^0,87 ≈ 35 fois moins d'électrons, et le rapport signal/bruit photonique varie comme leur racine carrée, √(1/35) ≈ 0,17. Au point visé par défaut, le rapport dépend de ce qui passe sous le point : de 71:1 à 80:1 à ISO 6400 quand le sujet visé est clair.
- **Le point** : au centre quand rien ne dépasse. Il part vers l'ISO si le bruit passe sous 40:1 (un peu) ou sous 10:1 (beaucoup), et vers la vitesse si la traînée dépasse le flou acceptable. Sommets et point prennent la couleur de l'état : vert, orange, rouge, ou gris sans jugement. La géométrie est un choix d'affichage ; les seuils, eux, sont sourcés.

Non simulé : le bougé de la main ; un jugement sur la profondeur de champ (il dépend de l'intention, qui n'a pas de critère sourcé).

## Modes de déclenchement (version 0.3.33)

Demande de Julien du 10 novembre 2026 : enchaîner sur les modes d'entraînement (BOI-12 ; fiche du référentiel : « Rafale qui produit une série à trier »).

Ce que dit le manuel du Z 6 ([« The Release Mode/Self-Timer Button »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_04.html), [en français](https://onlinemanual.nikonimglib.com/z7_z6/fr/06_shooting_controls_04.html)), lu le 10 novembre 2026 :
- **Vue par vue** : « The camera takes one photograph each time the shutter-release button is pressed. »
- **Continu L** : « While the shutter-release button is held down, the camera records 1–5 frames per second » ; la cadence se règle (réglage d1).
- **Continu H** : jusqu'à environ 5,5 vues par seconde.
- **Continu H (étendu)** : 12 vues par seconde au Z 6 (table des cadences : 12 en JPEG).
- **Retardateur** : délai de 2, 5, 10 ou 20 s (fiche technique), et de 1 à 9 vues (réglage c2).
- **Nombre de vues par rafale** : de 1 à 200 (réglage d2). Ces pages ne donnent pas les réglages par défaut ; la page « Defaults » du manuel, lue ensuite le 10 novembre 2026, donne 3 vues par seconde en Continu L (d1) et 10 s pour le retardateur (c2).

Dans TutoPhoto (`app/src/ui/cameraPanel.ts`, `app/src/ui/shutter.ts`) :
- **Bouton « Mode de déclenchement »** : vue par vue (par défaut, comme avant), Continu L (1 à 5 vues par seconde, 3 par défaut), Continu H, Continu H (étendu), retardateur (2, 5, 10 ou 20 s, 10 par défaut). Ces deux valeurs par défaut, d'abord choisies, sont celles du Z 6 (page « Defaults »).
- **Rafale** : tant que le déclencheur reste appuyé, une vue par intervalle de 1 / cadence. L'intervalle n'est jamais plus court que la durée de pose : on ne peut pas prendre plus de vues que de poses. Chaque vue est calculée à son instant, sur l'horloge de la scène, avec l'orientation de l'appareil relevée à cet instant : suivre le chien pendant la rafale donne un filé.
- **Mise au point en rafale** : en AF-C, elle est refaite à chaque vue, à l'instant de la vue, avec le mode de zone et le suivi de la zone automatique. En AF-S, elle reste celle de la première vue, verrouillée « while the shutter-release button is pressed halfway ».
- **Série à trier** : l'écran de revue fait défiler les vues (« Vue 2/5 · +0,20 s »), chacune avec sa loupe et son enregistrement.
- **Limite de TutoPhoto** : 20 vues au plus par rafale, pour le temps de calcul (0,8 s par photo sur le téléphone de Julien aux réglages par défaut, mesure du 9 novembre 2026).
- **Retardateur** : une vue à la fin du compte à rebours.

Non simulé : la mémoire tampon et le ralentissement quand elle est pleine ; l'exposition qui « may vary erratically » en Continu H (étendu) ; le mode silencieux ; plusieurs vues au retardateur.

## Collimateurs (version 0.3.34)

Demande de Julien du 10 novembre 2026 : enchaîner sur les collimateurs (MAP-06 ; fiche du référentiel : « Choisir soi-même le collimateur, le déplacer vite, connaître sa couverture » ; simulateur : « Grille de collimateurs ; la netteté suit la profondeur sous le point choisi »).

Ce que dit Nikon du Z 6, lu le 10 novembre 2026 :
- [communiqué du 23 août 2018](https://www.nikon.com/news/2018/0823_mirrorless_01.htm) : « the Z 6 has 273 focus points*, enabling broad coverage of approximately 90% of the imaging area both horizontally and vertically », avec la note « * With FX (36x24) format and single-point AF » ;
- [communiqué du 15 août 2019](https://www.nikon.com/news/2019/0815_award_01.htm), sur les prix EISA : « 273*2 focus points that provide good coverage of the imaging area — approximately 90% both horizontally and vertically » ;
- [page du produit](https://imaging.nikon.com/imaging/lineup/mirrorless/z_6/) : « 273-point hybrid AF system offering accurate focus across 90% of the frame » ; sa fiche technique : « Focus points (in photo mode, FX format, single-point AF) 273 (single-point AF) ».
- Aucune de ces pages ne donne la disposition des 273 points, ni ce que l'appareil affiche de cette couverture.

Dans TutoPhoto (`app/src/ui/cameraPanel.ts`) :
- **Zone couverte** : environ 90 % du cadre en largeur et en hauteur, au centre, soit une marge de 5 % de chaque côté. Elle est tracée en pointillés discrets dans le viseur, loupe comprise : c'est une aide de TutoPhoto, pas un affichage sourcé du Z 6.
- **Point sélectif** : le point se place partout dans la zone couverte. Un toucher hors de cette zone ramène le point au plus près, sur son bord (choix de TutoPhoto : les pages lues ne disent pas ce que fait l'écran tactile du Z 6 hors de la zone).
- **Zone large et zone automatique** : la zone mesurée est rognée à la zone couverte, et la détection des yeux ne retient que les yeux qui s'y trouvent. Nikon donne la couverture pour le point sélectif ; elle est appliquée aux autres modes de zone faute d'autre chiffre.
- **Grille** : la fiche du référentiel prévoit une grille de collimateurs. Sa disposition n'est pas sourcée : elle n'est pas simulée, et le point se déplace en continu dans la zone couverte.
- **Boîtiers** : la couverture du Z 6 est appliquée aux six boîtiers de référence, comme les modes de zone du Z 6. Celle des cinq autres n'a pas été lue. Décision de Julien du 11 novembre 2026 : la couverture du Z 6 reste celle de la V1 minimale ; celle des autres hybrides (Sony A7 III, Sony A6000, Canon EOS RP) sera ajoutée une fois lue sur des pages officielles, que Julien relèvera (leurs sites refusent les lectures automatiques) ; les reflex (Nikon D5600, Canon EOS 2000D), dont l'autofocus du viseur optique n'a que quelques collimateurs fixes, passent en V2.
- **Déplacer vite** : le toucher du viseur. Le manuel du Z 6 ([« Focus »](https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html), relu le 10 novembre 2026) indique aussi : « The focus point can be positioned using the sub-selector or multi-selector », et le réglage a5 (« Every other point ») n'utilise qu'un quart des points pour aller plus vite. Ni les sélecteurs ni ce réglage ne sont simulés.
- **Routine de test** : un toucher dans le coin haut droit du cadre place le point à 95 % × 5 % du cadre, et la zone tracée fait 90 % × 90 % du cadre.

Non simulé : la grille des 273 points, la couverture des autres boîtiers, et celle des autres formats d'image du Z 6 (la note de Nikon ne vaut que pour le format FX), le déplacement du point aux sélecteurs, le réglage a5.

## Modes d'exposition, correction et ISO auto (version 0.3.36)

Décision de Julien du 10 novembre 2026 : l'ISO auto (MES-10) avec la priorité à l'ouverture (BOI-07), la priorité à la vitesse (BOI-08) et la correction d'exposition (MES-04).

Ce que dit le manuel du Z 6, lu le 10 novembre 2026 (termes français du manuel en français) :
- [« The Mode Dial »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_01.html) ([« Sélecteur de mode »](https://onlinemanual.nikonimglib.com/z7_z6/fr/06_shooting_controls_01.html)) :
  - S, « Auto à priorité vitesse » : « you choose the shutter speed while the camera automatically selects the aperture that will produce the optimal exposure » ;
  - A, « Auto à priorité ouverture » : l'inverse ;
  - M, « Manuel » : « you control both shutter speed and aperture » ; avec l'ISO auto, « ISO sensitivity will automatically be adjusted for optimal exposure at the selected shutter speed and aperture ».
- [« Indicators and Error Messages »](https://onlinemanual.nikonimglib.com/z7_z6/en/13_troubleshooting_02.html) : hors des limites de l'appareil, « Exposure indicators and shutter speed or aperture display flash », avec « Subject too bright; photo will be overexposed » ou « Subject too dark ».
- [« The E (Exposure Compensation) Button »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_03.html) ([en français](https://onlinemanual.nikonimglib.com/z7_z6/fr/06_shooting_controls_03.html)) : de −5 à +5 IL par tiers ; elle ne se remet pas à zéro à l'extinction ; « In mode M, exposure compensation affects only the exposure indicator », mais l'ISO auto en tient compte.
- [« The S (ISO Sensitivity) Button »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_02.html) et [« ISO sensitivity settings »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_08.html) ([« Réglage de la sensibilité »](https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_03_08.html)) :
  - l'ISO auto agit « if optimal exposure cannot be achieved at the value selected » ;
  - « Sensibilité maximale » : de ISO 200 à Hi 2 au Z 6 ; si la valeur choisie est plus haute, c'est elle qui sert ;
  - « Vitesse d'obturation minimale », en P et A seulement : de 1/4000 s à 30 s, ou « Automatique », selon la focale, sans règle publiée ; la vitesse peut descendre sous ce minimum quand la sensibilité maximale ne suffit pas ;
  - l'affichage indique « ISO AUTO », et la valeur retenue quand elle diffère de celle choisie.
- [« Defaults »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html) : ISO auto activé, sensibilité maximale 51 200, vitesse minimale « Auto ».
- Le manuel du Z 6 ne dit pas jusqu'où l'ISO auto descend, ni s'il baisse la sensibilité en A. Celui du [D850](https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html) le dit : « the minimum value for auto ISO sensitivity is automatically set to ISO 64 », sa sensibilité la plus basse, et, en P et A, « sensitivity will only be adjusted if underexposure would result at the shutter speed selected for Minimum shutter speed ». Retenu pour TutoPhoto, faute de mieux, et présenté comme tel.

Dans TutoPhoto (`app/src/camera/exposureModes.ts`, `app/src/ui/cameraPanel.ts`) :
- **Fenêtre « Exposition »**, ouverte en touchant l'indicateur d'exposition (« M · −0,2 IL ») : sélecteur de mode (M, A, S), correction d'exposition, contrôle de la sensibilité auto, sensibilité maximale, vitesse d'obturation minimale. Toucher l'indicateur évite un bouton de plus, qui réduirait le viseur sur téléphone.
- **Par défaut** : mode M, comme avant ; ISO auto activé, comme sur le Z 6 ; sensibilité maximale ISO 6400, haut de l'échelle de TutoPhoto ; vitesse minimale 1/30 s, valeur que le manuel du D850 retient quand « Auto » ne peut pas fonctionner (objectif sans données). Aux réglages de départ (f/8, 1/100 s), l'ISO auto donne ISO 100 : la vue de départ ne change pas.
- **A et S** : la molette réglée par l'appareil est grisée, sa valeur en italique, son nom suivi de « (auto) ». Hors des limites, la valeur clignote avec l'indicateur (en rouge et sans clignoter si le système demande moins d'animations).
- **ISO auto** : la molette ISO s'appelle « ISO auto » et montre la valeur retenue ; elle règle toujours la valeur choisie, qui sert de plafond si elle dépasse la sensibilité maximale.
  - En M : la sensibilité donne l'exposition visée, de ISO 100 au plafond.
  - En A : elle ne monte que si la vitesse passerait sous la vitesse minimale.
  - En S : elle change quand l'ouverture ne suffit plus, dans un sens ou dans l'autre.
- **Indicateur d'exposition** : en M, écart à l'exposition visée, correction comprise ; en A et S, écart à l'exposition mesurée, qui montre donc la correction, comme le Z 6 affiche l'indicateur quand une correction est réglée.
- **Calcul** : en indices des échelles (tiers d'IL), EV₁₀₀ = (a + s − i − 12) / 3, avec a l'ouverture (0 pour f/1.4), s la vitesse (0 pour 30 s), i la sensibilité (0 pour ISO 100). L'exposition optimale avec une correction de c tiers d'IL demande a + s − i = 3 × 12,5 + 12 − c = 49,5 − c. Exemple : en A à f/4 (a = 9) et ISO 100, s = 40,5 ; l'appareil prend 1/400 s (s = 41).
- **Choix de TutoPhoto, non sourcés** : l'appareil choisit par tiers d'IL, sur les échelles du boîtier virtuel ; à égalité entre deux crans, ce qui arrive avec une scène à 12,5 IL, il prend celui qui assombrit la photo.
- **Légende de la photo** : mode, réglages retenus, ISO auto et correction (« A · f/4 · 1/200 s · ISO 100 (auto) · corr. +1,0 IL · 50 mm » : avec +1 IL, s = 49,5 − 3 − 9 = 37,5, d'où 1/200 s).

Non simulés : le mode P (BOI-06, hors de la décision), l'option « Automatique » de la vitesse minimale, la sensibilité maximale au flash, les poses longues (« Bulb », « Time ») et les ISO au-delà de 6400.

## Vue de dessus et appareil déplaçable (version 0.3.37)

Proposées dans le bilan de la V1 minimale du 10 novembre 2026 (NET-01, « Zone nette visualisée en vue de dessus et sur l'image » ; NET-06, « Sujet et appareil déplaçables »), lancées par Julien le même soir.

Dans TutoPhoto (`app/src/ui/topView.ts`, `app/src/camera/sharpZone.ts`) :
- **Encart « Vue de dessus »**, en bas à droite du viseur, replié sur petit écran comme l'indicateur d'équilibre. Il montre l'appareil, le champ de l'objectif, le plan de mise au point, la zone nette, les personnages, le banc, la poubelle, le promeneur et le chien. Les sujets dans la zone nette sont cerclés de vert.
- **Zone nette** : limites de l'indicateur d'équilibre, désormais calculées par un module commun (`camera/sharpZone.ts`), d'après la formule du cercle de confusion ([Wikipedia, révision 1335590423](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)). Elle est dessinée entre deux plans perpendiculaires à l'axe de visée, et non entre deux cercles : la distance de mise au point se mesure le long de l'axe (c'est la profondeur que lit l'autofocus). Un sujet est net si sa distance le long de l'axe est entre les deux limites. L'inclinaison de l'appareil vers le haut ou le bas est négligée dans cette vue.
- **Champ** : angle horizontal, 2 × atan(côté / (2 × focale)), avec le côté horizontal du capteur (le grand côté, le petit en cadrage vertical).
- **Déplacer l'appareil (NET-06)** : toucher la carte y place l'appareil, sans changer son orientation ; « Retour au départ » le ramène. Zone permise, choisie pour TutoPhoto : x de −6 à 6 m, z de −6 à 5 m, soit devant le groupe (à 6,5 m du départ) et sur le sol où les ombres sont calculées. La photo et l'autofocus suivent : la distance au sol se calcule à partir de la hauteur de l'œil, qui ne change pas.
- **Ce que l'on voit** : s'éloigner du sujet augmente la zone nette ; à distance de mise au point égale, un sujet loin derrière est plus flou qu'un sujet juste derrière (NET-06, « plus le fond est loin du sujet, plus il est flou »), ce que la même formule donne : le flou c croît avec |S₂ − S₁| / S₂.
- **Routine de test** : en AF-C, point au centre, reculer l'appareil de 4 m sur la carte fait passer la distance mesurée du groupe d'environ 6,5 m à environ 10,5 m ; « Retour au départ » la ramène.

Non simulé ou approché :
- les personnages ne se déplacent pas : seul l'appareil bouge ;
- le fond photo à 360° est pris d'un seul point : ce qu'il montre (arbres, bâtiments) ne change pas de perspective quand l'appareil se déplace, et son sol est projeté sur un plan ;
- la vue de dessus est une aide de TutoPhoto, pas un affichage d'appareil.

## Défis et bulletin (version 0.3.38)

Proposés le 10 novembre 2026 avec le bilan de la V1 minimale, validés par Julien le 11 novembre (« Suivons tes propositions ») : un défi par situation, vérifié sur la photo, et un bulletin après chaque photo.

Dans TutoPhoto (`app/src/camera/bulletin.ts`, `app/src/ui/challenges.ts`) :
- **Fenêtre « Défis »**, ouverte par le bouton de l'en-tête : aucun défi (entraînement libre), ou l'un des trois défis. Le choix est mémorisé.
- **Les défis**, tirés des intentions des situations (`data/situations.yaml`) :
  - SIT-01, portrait (« Isoler le sujet, regard net ») : l'œil de Sophia dans le cadre et dans la zone nette ; le fond derrière elle hors de la zone nette. Est « derrière » ce qui est à plus de 1 m derrière son œil et dans le cadre : banc, poubelle, promeneur, chien ; le fond photo à 360° compte comme un fond à 500 m.
  - SIT-05, photo de groupe (« Tout le monde net ») : les yeux de Dennis, Sophia, Fabienne et Percy dans le cadre et dans la zone nette.
  - SIT-06, chien qui court (« Figer un sujet net ») : le chien dans le cadre, dans la zone nette, et figé.
- **Critères**, tous déjà sourcés :
  - zone nette : limites de `camera/sharpZone.ts`, flou acceptable d / 1500 ([Wikipedia, « Circle of confusion »](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)) ; la distance est la profondeur le long de l'axe, celle de la mise au point ;
  - sujet figé : traînée pendant la pose au plus égale au même flou acceptable, comme l'indicateur d'équilibre ;
  - dans le cadre : le point se projette dans le capteur, x = f X / Z et y = f Y / Z, dans les dimensions du capteur.
- **Bulletin**, sous chaque photo, défi ou non :
  - exposition (écart à l'exposition correcte de la scène, en IL) ;
  - zone nette et distance de mise au point ;
  - bruit au point visé, lu par l'indicateur d'équilibre dans le viseur au déclenchement (approximation : en rafale, la même valeur pour toutes les vues) ; absent si l'indicateur est coupé ;
  - traînée du promeneur et du chien s'ils sont dans le cadre, en pixels de la photo, et la limite : le flou acceptable en pixels d'une photo de 1500 px, (d / 1500) × 1500 / grand côté du capteur = d / grand côté, soit 43,1 / 35,9 ≈ 1,2 px pour le Z 6 ;
  - avec un défi : réussi ou à reprendre, chaque critère, et les notions à revoir pour les critères manqués.
- **Mesures** : elles sont faites à l'instant de chaque vue, horloge figée et appareil orienté comme alors (en rafale, vue par vue), sur les yeux des personnages et du chien, et sur le banc et la poubelle.
- **Exemple mesuré dans le navigateur de test**, zone automatique sur l'œil de Sophia vers 6,6 m, 50 mm à f/8 : la zone nette va d'environ 4 m à 17 m. Le groupe y est (SIT-05 réussi), mais aussi la poubelle à 10,5 m, derrière Sophia : avec un cadre horizontal, elle est dans le cadre (SIT-01 à reprendre, « À revoir : NET-01, NET-06 ») ; avec le cadre vertical du profil Android, elle en sort et SIT-01 est réussi. La routine de test juge donc SIT-01 à f/22 : la distance hyperfocale vaut 2500 / (22 × 0,02875) ≈ 4 m, la zone nette va jusqu'à l'infini et le fond photo est net, quel que soit le cadrage. À f/1.4, la limite lointaine tombe à 7,4 m (q = 0,0287 × 1,4 × 6550 / 2500 ≈ 0,105 ; 6,6 / (1 − 0,105) ≈ 7,4 m) : le fond sort de la zone nette.

Non simulé ou choisi : le seuil de 1 m pour « derrière » ; aucun jugement sur l'exposition ni sur le bruit dans les défis, faute de critère sourcé propre à ces situations ; les défis ne sont pas encore reliés aux fiches des notions, qui restent à rédiger.

## Fonctions demandées par Julien le 9 novembre 2026

Ces fonctions existent dans le référentiel, mais pas dans le jalon de la V1 minimale (`data/jalons.yaml`), qui ne contient que les notions clés de SIT-01, SIT-05 et SIT-06. `CLAUDE.md` demande de ne pas étendre la V1 minimale avant de l'avoir testée avec des débutants. Julien laisse à Claude le choix du moment (« quand tu estimes que c'est le meilleur moment », 9 novembre 2026) : balance des blancs, grilles de composition et histogramme viendront après les tests de la V1 minimale. Les équivalents cités viennent du [guide d'aide Sony ILCE-7M3](https://helpguide.sony.net/ilc/1720/v1/en/print.pdf), lu le 9 novembre 2026.

### Balance des blancs (COU-01, COU-02)

- Sur le Sony A7 III, elle « corrects the tone effect of the ambient light condition to record a neutral white subject in white ». Elle propose :
  - un mode automatique et des préréglages par source (Daylight, Shade, Cloudy, Incandescent, quatre fluorescents, Flash, Underwater Auto) ;
  - une température de couleur avec filtre (« C.Temp./Filter ») ;
  - des réglages personnalisés mesurés sur la scène (« Custom Setup »).
- Principe envisagé, à détailler avant de produire : des gains par canal appliqués à l'image en lumière linéaire, avant le bruit et la courbe, dans le viseur comme sur la photo.
- Ce qui manque : la couleur de la lumière de la scène. La température de couleur de la photo à 360° et de l'éclairage HDR n'est pas documentée dans les sources lues ; elle serait à mesurer sur une zone neutre de la scène.

### Grilles de composition (CMP-02)

- Sur le Sony A7 III, « Grid Line » propose « Rule of 3rds Grid », « Square Grid » et « Diag. + Square Grid ».
- Principe : un calque au-dessus du cadre du viseur, choisi dans le boîtier. Il ne change pas la photo.

### Histogramme (MES-06)

- Sur le Sony A7 III, l'affichage « Histogram » « displays the luminance distribution graphically », en prise de vue comme en lecture.
- Principe : histogramme calculé sur l'image du viseur réduite, quelques fois par seconde, et sur la photo ; luminance et couches rouge, verte et bleue, avec la part écrêtée.
- Coût : lire les pixels de l'image du viseur peut ralentir un téléphone, à mesurer.

### Corriger la photo après la prise (V2 ; RET-01, RET-02)

- Décision de Julien : en V2.
- Des curseurs (exposition, hautes lumières, ombres, blancs, noirs, contraste) appliqués à la photo calculée, pour montrer qu'une photo mal prise se rattrape, et dans quelles limites : des hautes lumières écrêtées ne reviennent pas, et le bruit remonte avec les ombres. Ce sont les leviers de RET-01 (« exposition, hautes lumières, ombres, blancs, noirs ») et de RET-02 (contraste et courbes).
- Base possible : le calcul de la photo fait déjà sa somme en virgule flottante, avant l'écrêtage. Il faudrait la garder, comme un équivalent du RAW, au lieu de la jeter après la finition.

### Décisions de Julien du 9 novembre 2026

- Indicateur de l'« équilibre » entre ouverture, vitesse et ISO, selon le point visé : forme B, un triangle dans lequel un point bouge selon les réglages. Le 10 novembre 2026, le principe de Julien (`docs/cadrage.md`) tranche : seuls des critères sourcés ; profondeur de champ montrée sans jugement ; bougé de la main exclu tant qu'il n'est ni sourcé ni simulé.
- Modes de mise au point autres qu'un collimateur unique : « suivons ta reco », soit AF ponctuel ou continu (fait en version 0.3.26, voir « Mise au point »), puis modes de zone (MAP-05, faits en version 0.3.27, voir « Modes de zone AF »), puis détection des yeux (MAP-09, faite en version 0.3.29, voir « Détection des yeux et zone automatique »). Les trois notions sont dans la V1 minimale.

Voir `docs/questions-ouvertes.md`.

## Plan de mise en œuvre

Une pull request par étape :

1. Boîtier virtuel minimal et exposition : fait en version 0.3.13 (voir ci-dessus).
2. Photo au déclenchement par accumulation : faite en version 0.3.14 (voir ci-dessus).
3. Bruit physique : fait en version 0.3.15, sur la photo et dans le viseur (voir ci-dessus). Interrupteurs de l'aperçu dans le viseur : version 0.3.16.
4. Loupe dans le viseur et sur l'écran de revue : faite en version 0.3.17 (voir ci-dessus).
5. Profondeur de champ approchée dans le viseur : faite en version 0.3.22, puis en flou de taille physique en version 0.3.23 (voir ci-dessus).
6. Mise au point : AF ponctuel ou continu (MAP-04), fait en version 0.3.26 ; modes de zone (MAP-05), faits en version 0.3.27 ; détection des yeux et zone automatique (MAP-09), faites en version 0.3.29. Indicateur d'équilibre : version 0.3.31. Traînée en pixels (MVT-01) : version 0.3.32. Modes de déclenchement (BOI-12) : version 0.3.33. Collimateurs (MAP-06) : version 0.3.34. Modes d'exposition A et S, correction d'exposition et ISO auto (BOI-07, BOI-08, MES-04, MES-10, décision de Julien du 10 novembre 2026) : version 0.3.36, avec les réglages par défaut du Z 6. Vue de dessus (NET-01) et appareil déplaçable (NET-06) : version 0.3.37. Défis des trois situations et bulletin : version 0.3.38. Ensuite : fiches des notions et des situations. LUM-02 : simulateur en V2.
7. Après les tests de la V1 minimale : balance des blancs, grilles de composition, histogramme (voir ci-dessus). En V2 : correction de la photo après la prise.

## Ce que je ne sais pas

- La luminance absolue de la photo autumn_hockey, ni laquelle des deux lignes de la table (couvert lumineux ou épais) la décrit.
- Le temps de calcul d'une photo par accumulation sur téléphone.
- Le modèle du tremblement de la main pour le flou de bougé.
- La fiabilité des capacités dérivées des mesures de DxOMark, que leur auteur juge lui-même peu sûres pour les petits capteurs.
- La disposition des 273 collimateurs du Z 6, ce que le Z 6 affiche de leur couverture, et la couverture de l'autofocus des cinq autres boîtiers de référence.
