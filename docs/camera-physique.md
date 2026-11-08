# Caméra physique

Décisions prises par Julien le 8 novembre 2026 ; le modèle qui suit est proposé par Claude et reste à valider pendant la mise en œuvre. Sources détaillées dans `data/sources.yaml`.

## Décisions

- Rendu en deux temps :
  - le viseur montre en temps réel le cadrage, l'exposition et une profondeur de champ approchée, avec les effets de Babylon.js ;
  - au déclenchement, la photo est calculée exactement, par accumulation de rendus.
- Capteur : plein format ou APS-C, au choix du débutant.
- Bruit numérique : modèle physique (bruit photonique et bruit de lecture), à partir de mesures publiées.
- Boîtiers de référence : trois paires, au choix de la marque. La réponse de Julien, « 1,2,3 », est comprise comme « les trois » :

  | Marque | Plein format | APS-C | Dimensions APS-C (Wikipedia) |
  | --- | --- | --- | --- |
  | Nikon | Z 6 | D5600 | 23,6 à 23,7 × 15,6 mm |
  | Sony | A7 III (ILCE-7M3) | A6000 (ILCE-6000) | 23,6 à 23,7 × 15,6 mm |
  | Canon | EOS RP | EOS 2000D | 22,3 × 14,9 mm |

  Le plein format mesure 36 × 24 mm. Les dimensions APS-C viennent du tableau des formats de capteur de [Wikipedia](https://en.wikipedia.org/w/index.php?title=Image_sensor_format&oldid=1374408806) (source secondaire), qui donne une fourchette pour Sony et Nikon. À remplacer par les fiches techniques des constructeurs dès qu'elles seront lues.
- Hôtes ajoutés à l'environnement de travail pour lire les sources : imaging.kodakalaris.com, www.photonstophotos.net, en.wikipedia.org. Les fiches Kodak redirigent vers un autre domaine, toujours bloqué ; elles n'ont pas été lues.

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

## Plan de mise en œuvre

Une pull request par étape :

1. Boîtier virtuel minimal et exposition : réglages (ouverture, vitesse, ISO, focale, marque, format), mesure de la lumière, aperçu de l'exposition dans le viseur.
2. Photo au déclenchement par accumulation : profondeur de champ et flou de mouvement, avec mesure du temps de calcul.
3. Bruit physique sur la photo.
4. Profondeur de champ approchée dans le viseur.
5. Ensuite : mise au point et collimateurs (MAP-04, MAP-05, MAP-06, MAP-09), flou de bougé (BOI-12, MVT-01).

## Ce que je ne sais pas

- La luminance absolue de la photo autumn_hockey, ni laquelle des deux lignes de la table (couvert lumineux ou épais) la décrit.
- Le temps de calcul d'une photo par accumulation sur téléphone.
- Le modèle du tremblement de la main pour le flou de bougé.
- La fiabilité des capacités dérivées des mesures de DxOMark, que leur auteur juge lui-même peu sûres pour les petits capteurs.
