# Caméra physique

Décisions prises par Julien le 8 novembre 2026 ; le modèle qui suit est proposé par Claude et reste à valider pendant la mise en œuvre. Sources détaillées dans `data/sources.yaml`.

## Décisions

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
- **Carte de profondeur et mise au point** : comme en version 0.3.22. Carte propre au viseur, en z caméra, qui inclut le sol invisible de 40 × 40 m ; mise au point continue sur le point choisi, relue toutes les 200 ms.
- **Interrupteur et photo** : case « Profondeur de champ (approchée) » de la fenêtre « Aperçu ». L'effet est retiré pendant le calcul de la photo.

- **Arrêt de la spirale** : la spirale s'arrête au plus grand flou présent dans l'image, celui d'un point à l'infini ou celui du sol en bas du cadre, au lieu du plafond. Aux réglages par défaut (50 mm, f/8), ce flou fait moins de 2 px, et le calcul est presque gratuit. Limite : un objet plus proche que le sol en bas du cadre verrait son flou limité à cette valeur ; il n'y en a pas dans la scène de parc.
- **Poids du pixel central** : sur la spirale, chaque échantillon représente une couronne de surface 2π × pas, le centre un disque de surface π × pas². Son poids, rapporté à celui d'un échantillon, vaut donc pas / 2, soit 0,375. Avec un poids 1, comme dans l'algorithme d'origine, un flou de 10,9 px attendus mesurait 9,5 à 10 px : les petits flous, qui ont peu d'échantillons, étaient trop nets.

Mesures du 9 novembre 2026, avec la méthode de la version 0.3.22 (disque ajusté par moindres carrés sur des zones de fond sans sujet net ni en mouvement) :

| Réglage | Écran | Flou réel attendu | Mesuré |
| --- | --- | --- | --- |
| 70 mm, f/2 | 1200 × 900 | 10,9 px | 10,5 à 11,0 px (quatre zones) |
| 135 mm, f/1.4 | 1200 × 900 | 58,7 px | 57,25 px (deux zones ; erreur de 0,31 niveau pour un disque, de 1,5 à 1,6 pour une gaussienne) |
| 135 mm, f/1.4 | 390 × 844 | 25,1 px | 21,5 à 23,5 px, indicatif |

Calcul du flou attendu au 135 mm à f/1.4, mise au point vers 6,6 m, fond à 500 m :
- c = (135 / 1,4) × 135 / (6600 − 135) × (500 000 − 6600) / 500 000 ≈ 1,99 mm sur le capteur ;
- × 1060 / 35,9 ≈ 29,5 pixels par mm sur un écran de 1200 × 900, d'où 58,7 px ;
- × 453 / 35,9 ≈ 12,6 pixels par mm sur un téléphone de 390 × 844 tenu à la verticale, d'où 25,1 px.

Conclusion : le flou a la taille physique à 1 à 3 % près sur ordinateur, et la forme d'un disque. Sur téléphone, les zones de fond libres sont plus étroites que le flou mesuré (moins de 25 px de large) : l'ajustement n'y est pas fiable, et la mesure reste indicative.

Limites :
- **Plafond** : 64 px de diamètre (rayon de 32 px).
- **Mi-résolution** : la transition entre net et flou se fait sur environ deux pixels.
- **Fond à 360°** : il est traité comme un fond à 500 m, y compris le sol au-delà de 20 m.
- **Coût** : la spirale compte au plus environ 170 échantillons par pixel de la passe. Sur le Google Pixel 8 Pro de Julien, la fluidité reste à vérifier au 135 mm à f/1.4, le cas le plus coûteux. En rendu logiciel (tests), une image prend alors plusieurs secondes sur un écran d'ordinateur.

## Plan de mise en œuvre

Une pull request par étape :

1. Boîtier virtuel minimal et exposition : fait en version 0.3.13 (voir ci-dessus).
2. Photo au déclenchement par accumulation : faite en version 0.3.14 (voir ci-dessus).
3. Bruit physique : fait en version 0.3.15, sur la photo et dans le viseur (voir ci-dessus). Interrupteurs de l'aperçu dans le viseur : version 0.3.16.
4. Loupe dans le viseur et sur l'écran de revue : faite en version 0.3.17 (voir ci-dessus).
5. Profondeur de champ approchée dans le viseur : faite en version 0.3.22, puis en flou de taille physique en version 0.3.23 (voir ci-dessus).
6. Ensuite : mise au point et collimateurs (MAP-04, MAP-05, MAP-06, MAP-09), flou de bougé (BOI-12, MVT-01).

## Ce que je ne sais pas

- La luminance absolue de la photo autumn_hockey, ni laquelle des deux lignes de la table (couvert lumineux ou épais) la décrit.
- Le temps de calcul d'une photo par accumulation sur téléphone.
- Le modèle du tremblement de la main pour le flou de bougé.
- La fiabilité des capacités dérivées des mesures de DxOMark, que leur auteur juge lui-même peu sûres pour les petits capteurs.
