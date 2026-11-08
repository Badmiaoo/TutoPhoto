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

## Plan de mise en œuvre

Une pull request par étape :

1. Boîtier virtuel minimal et exposition : fait en version 0.3.13 (voir ci-dessus).
2. Photo au déclenchement par accumulation : profondeur de champ et flou de mouvement, avec mesure du temps de calcul.
3. Bruit physique sur la photo.
4. Profondeur de champ approchée dans le viseur.
5. Ensuite : mise au point et collimateurs (MAP-04, MAP-05, MAP-06, MAP-09), flou de bougé (BOI-12, MVT-01).

## Ce que je ne sais pas

- La luminance absolue de la photo autumn_hockey, ni laquelle des deux lignes de la table (couvert lumineux ou épais) la décrit.
- Le temps de calcul d'une photo par accumulation sur téléphone.
- Le modèle du tremblement de la main pour le flou de bougé.
- La fiabilité des capacités dérivées des mesures de DxOMark, que leur auteur juge lui-même peu sûres pour les petits capteurs.
