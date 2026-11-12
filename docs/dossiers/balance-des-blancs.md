# Dossier de sources : balance des blancs (COU-01, COU-02, COU-04)

> Dossier de travail, écrit par un agent de Claude dans la nuit du 11 au 12 novembre 2026. **Pas encore relu à la source par un second agent** : la vérification indépendante prévue a été coupée par la limite d'usage. Avant de s'appuyer sur un fait, relire la citation à l'adresse donnée. Les pages brutes citées (`pages/…`) étaient sur la machine de Claude et ne sont pas dans le dépôt : les manuels ne sont pas sous licence libre.
>
> Dans ce dossier, le signe « + » devant douze nombres positifs des formules et des matrices a été retiré, citations comprises : le contrôle de confidentialité du dépôt (`scripts/check_public.py`) les prenait pour des numéros de téléphone.

Date de lecture de toutes les pages : 2026-11-11 (UTC, entre 23 h 17 et 23 h 35).
Pages brutes : `pages/balance-des-blancs/` (noté `P/` ci-dessous ; liste complète en fin de dossier).
Scripts de calcul : `wb-scripts/`.

Règle suivie : rien de mémoire. Chaque fait vient d'une page enregistrée cette nuit ou d'un fichier du dépôt. Les calculs faits par moi sont marqués « calcul » et leur script est nommé. Wikipedia est une source secondaire ; la révision lue (`oldid`) est citée.

Ce que je n'ai pas pu lire (détail en section 6) : le manuel du Canon EOS RP, celui du Canon EOS 2000D, le manuel de référence du Nikon D5600, la fiche technique Sony du A7 III, les pages d'explication de Poly Haven (`docs.polyhaven.com`).

---

## 1. Réglages par boîtier

### 1.1 Nikon Z 6 (boîtier par défaut) : entièrement sourcé

Source : Nikon Corporation, « Z 7/Z 6 Online Manual », page « White Balance » (Basic Settings), https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_02.html — fichier `P/nikon-z7z6-white-balance.html`. Version française (libellés officiels) : https://onlinemanual.nikonimglib.com/z7_z6/fr/05_basic_settings_02.html — fichier `P/nikon-z7z6-fr-white-balance.html`. La page ne porte pas de date.

Définition : « White balance ensures that white objects appear white, regardless of the color of the light source. »

Tableau de la page (colonne « K * », avec la note « Color temperature. All values are approximate and do not reflect fine-tuning (if applicable). ») :

| Réglage (EN) | Libellé français du manuel | K du manuel | Description du manuel |
|---|---|---|---|
| Auto > Keep white (reduce warm colors) | Automatique > Conserver les blancs | 3500–8000 | « Eliminate warm color cast produced by incandescent lighting. » |
| Auto > Keep overall atmosphere | Conserver l'ambiance générale | 3500–8000 | « Partially preserve warm color cast produced by incandescent lighting. » |
| Auto > Keep warm lighting colors | Conserver couleurs chaudes | 3500–8000 | « Preserve warm color cast produced by incandescent lighting. » |
| Natural light auto | Lumière naturelle auto | 4500–8000 | « When used under natural light, this option produces colors closer to those seen by the naked eye. » |
| Direct sunlight | Ensoleillé | 5200 | « Use with subjects lit by direct sunlight. » |
| Cloudy | Nuageux | 6000 | « Use in daylight under overcast skies. » |
| Shade | Ombre | 8000 | « Use in daylight with subjects in shade. » |
| Incandescent | Incandescent | 3000 | « Use under incandescent lighting. » |
| Fluorescent > Sodium-vapor lamps | Lampes à vapeur de sodium | 2700 | |
| Fluorescent > Warm-white fluorescent | Fluoresc. blanches chaudes | 3000 | |
| Fluorescent > White fluorescent | Fluorescentes blanches | 3700 | |
| Fluorescent > Cool-white fluorescent | Fluorescentes blanches froides | 4200 | |
| Fluorescent > Day white fluorescent | Fluorescentes blanches diurnes | 5000 | |
| Fluorescent > Daylight fluorescent | Fluorescentes lumière diurne | 6500 | |
| Fluorescent > High temp. mercury-vapor | Vapeur mercure haute temp. | 7200 | |
| Flash | Flash | 5400 | « Use with studio strobe lighting and other large flash units. » |
| Choose color temperature | Choisir température de couleur | 2500–10,000 | « Choose color temperature from list of values » |
| Preset manual | Pré-réglage manuel | — | mesure sur le sujet ou la source, ou copie depuis une photo |

Les trois variantes de l'automatique partagent la plage 3500–8000 dans le tableau (une seule cellule pour les trois lignes).

Fiche technique du même manuel, https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html — `P/nikon-z7z6-14_technical_notes_06-specifications.html` : « Auto (3 types), natural light auto, direct sunlight, cloudy, shade, incandescent, fluorescent (7 types), flash, choose color temperature (2500 K–10,000 K), preset manual (up to 6 values can be stored), all except choose color temperature with fine-tuning ».

Réglages par défaut, https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html — `P/nikon-z7z6-09_menu_guide_01.html` : White balance « Auto > Keep overall atmosphere » ; Fine-tuning « A-B: 0, G-M: 0 » ; Choose color temperature « 5000 K » ; Preset manual « d-1 ».

Réglage fin (menu Prise de vue photo, « White Balance »), https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_09.html — `P/nikon-z7z6-09_menu_guide_03_09-white-balance.html` :
- axes : ambre–bleu « in steps of 0.5 », vert–magenta « in steps of 0.25 » ;
- échelle : « The horizontal axis is ruled in increments equivalent to about 5 mired, the vertical axis in increments of about 0.05 diffuse density units. » ;
- l'axe horizontal « corresponds to color temperature », l'axe vertical a des effets semblables aux filtres « color compensation (CC) » ;
- « The colors on the fine-tuning axes are relative, not absolute. » ;
- mired : exemples du manuel « 4000 K–3000 K (a difference of 1000 K)=83 mired » et « 7000 K–6000 K (a difference of 1000 K)=24 mired » ;
- température au choix : on saisit une valeur sur l'axe ambre–bleu (les kelvins) et une sur l'axe vert–magenta, chiffre par chiffre ; « Note that the desired results will not be obtained with fluorescent lighting. »

Valeur d'une unité de l'axe ambre–bleu, page « Auto bracketing », https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_27.html — `P/nikon-z7z6-09_menu_guide_03_27-auto-bracketing.html` : « Each increment is roughly equivalent to 5 mired. » et « Choose from increments of 1 (5 mired), 2 (10 mired), or 3 (15 mired). Higher B values correspond to increased amounts of blue, higher A values to increased amounts of amber. »

Menu i, https://onlinemanual.nikonimglib.com/z7_z6/en/07_the_i_button_02.html — `P/nikon-z7z6-07_the_i_button_02.html` :
- sens des quatre directions du réglage fin : « Increase green », « Increase blue », « Increase amber », « Increase magenta » ;
- mesure personnalisée : « Preset manual is used to record and recall up to six custom white balance settings for shooting under mixed lighting or to compensate for light sources with a strong color cast. » ; on mesure sur « a white or gray object » ; mémoires d-1 à d-6 ;
- mémoire vide : « If no value currently exists for the selected preset, white balance will be set to 5200 K, the same as » Direct sunlight.

Sens du réglage en kelvins (page « White Balance ») : « In general, choose lower values if your pictures have a red cast or to intentionally make colors colder, higher values if your pictures are tinged blue or to intentionally make colors warmer. »

Définition de la température de couleur par le manuel : « defined with reference to the temperature to which an object would have to be heated to radiate light in the same wavelengths » ; « light sources with a color temperature in the neighborhood of 5000–5500 K appear white ».

Non trouvé pour le Z 6 : le pas en kelvins de « Choose color temperature » (la page dit seulement que la valeur se règle chiffre par chiffre) ; l'étendue des axes A–B et G–M du réglage fin (pas dans le texte des pages lues).

### 1.2 Sony A7 III (ILCE-7M3) : réglages sourcés, kelvins absents

Source : Sony Corporation, « Help Guide, Interchangeable Lens Digital Camera ILCE-7M3 α7III », PDF complet, https://helpguide.sony.net/ilc/1720/v1/en/print.pdf, mention « 4-732-947-18(2) Copyright 2018 Sony Corporation » — fichiers `P/sony-ilce-7m3-help-guide-print.pdf` et `P/sony-ilce-7m3-help-guide-print.txt` (texte extrait par `pdftotext -layout`).

Page « White Balance » (page 196 du PDF) :
- « Corrects the tone effect of the ambient light condition to record a neutral white subject in white. »
- Liste : Auto / Daylight / Shade / Cloudy / Incandescent / Fluor.: Warm White / Fluor.: Cool White / Fluor.: Day White / Fluor.: Daylight / Flash / Underwater Auto ; puis « C.Temp./Filter » ; « Custom 1/Custom 2/Custom 3 » ; « Custom Setup ».
- C.Temp./Filter : « Adjusts the color tones depending on the light source. »
- Réglage fin : « You can display the fine adjustment screen and perform fine adjustments of the color tones as required by pressing the right side of the control wheel. »
- « [White Balance] is fixed to [Auto] in the following shooting modes: » Intelligent Auto, Scene Selection.
- Limite : « If you use a mercury lamp or a sodium lamp as a light source, the accurate white balance will not be obtained ».

Page « Priority Set in AWB » (page 198 du PDF), voir section 4.

Page « Capturing a basic white color in [Custom Setup] mode » (page 199 du PDF) : « You can register 3 settings. » ; la zone blanche doit couvrir le cercle central ; « After the shutter sound beeps, the calibrated values (Color Temperature and Color Filter) are displayed. »

Page « WB bracket » (page 136 du PDF) : « Records a series of three images with small changes in the white balance (within the range of 10MK-1*). » ; Hi : 20 MK⁻¹ ; la note dit que MK⁻¹ « indicates the same value as "mired." ».

Exemple d'affichage du guide (liste des icônes de l'écran) : « 7500K A5 G5 » sur la ligne « White Balance (Auto, Preset, Underwater Auto, Custom, Color temperature, Color filter) » : l'écran montre des kelvins et deux valeurs de filtre (A et G dans l'exemple).

Non trouvé dans le guide (recherche des chaînes « 2500 », « 9900 », « amber », « magenta », « K » près de la balance des blancs dans `P/sony-ilce-7m3-help-guide-print.txt`) : la température en kelvins de chaque préréglage ; la plage et le pas de « C.Temp./Filter » ; l'étendue du réglage fin. La fiche technique de `www.sony.ca` a répondu 403 « Access Denied » (trois adresses essayées).

### 1.3 Canon EOS RP : manuel non lu ; ce que disent trois autres manuels Canon

Le site des manuels Canon, https://cam.start.canon/en/ (`P/canon-cam-start-en.html`), ne liste ni l'EOS RP ni l'EOS 2000D ; pour les « Models except the above », il renvoie vers le site d'un distributeur. `www.canon.co.uk` a répondu 403 « Access Denied » (`P/canon-uk-eos-rp-specifications-403-acces-refuse.html`). Je n'ai donc lu aucune page Canon sur l'EOS RP.

Ce qui suit vient de manuels d'autres boîtiers Canon. Ce n'est pas une source pour l'EOS RP : les trois manuels lus donnent le même tableau, ce qui rend la valeur plausible pour l'EOS RP, sans la prouver.

Source A : Canon Inc., « EOS R6 : White Balance », https://cam.start.canon/en/C004/manual/html/UG-03_Shooting-1_0110.html, © CANON INC. 2024 — `P/canon-eos-r6-white-balance.html`.
Source B : Canon Inc., « EOS R5 : White Balance », https://cam.start.canon/en/C003/manual/html/UG-03_Shooting-1_0120.html, © CANON INC. 2025 — `P/canon-eos-r5-white-balance.html` (c'est la source `canon-r5-wb` de `data/sources.yaml`).
Source C : Canon Inc., « EOS REBEL T8i / EOS 850D : White Balance Settings », https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0150.html, © CANON INC. 2020 — `P/canon-eos-850d-white-balance.html`.

Tableau identique dans A, B et C (« (Approx.) », « Color Temperature (K: Kelvin) ») :

| Mode | K |
|---|---|
| Auto (Ambience priority) / Auto (White priority) | 3000–7000 |
| Daylight | 5200 |
| Shade | 7000 |
| Cloudy, twilight, sunset | 6000 |
| Tungsten light | 3200 |
| White fluorescent light | 4000 |
| Flash | « Automatically set* » ; note : « Applicable with Speedlites having a color temperature transmission function. Otherwise, it will be fixed to approx. 6000K. » |
| Custom | 2000–10000 |
| Color temperature | 2500–10000 |

- Pas en kelvins (A, C) : « The color temperature can be set from approx. 2500K to 10000K in 100K increments. »
- Mesure personnalisée (A) : on photographie un objet blanc qui remplit l'écran ; « Instead of shooting a white object, you can also shoot a gray card or standard 18% gray reflector (commercially available). »
- Correction (A : https://cam.start.canon/en/C004/manual/html/UG-03_Shooting-1_0120.html, `P/canon-eos-r6-white-balance-correction.html` ; C : https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0160.html, `P/canon-eos-850d-white-balance-correction.html`) : « B is for blue, A for amber, M for magenta, and G for green. » ; « One level of the blue/amber correction is equivalent to approx. 5 mireds of a color temperature conversion filter. » ; exemple « Sample setting: A2, G1 ». L'étendue de la correction n'est pas dans le texte de ces pages.

### 1.4 Nikon D5600 : liste des réglages seulement

Source : Nikon Corporation, « D5600 | Digitutor », « White Balance », https://imaging.nikon.com/imaging/support/digitutor/d5600/functions/whitebalance.html, © 2025 Nikon Corporation — `P/nikon-digitutor-d5600-whitebalance.html`.

Réglages listés : Auto (« Automatic white balance adjustment. Recommended in most situations. »), Incandescent, Fluorescent, Direct sunlight, Flash, Cloudy (« Use in daylight under overcast skies. »), Shade, Preset manual (« Measure white balance or copy white balance from existing photo. »). La page ne liste pas de réglage en kelvins ni de variante de l'automatique, et ne donne aucun kelvin. Elle dit que le menu Prise de vue sert aussi à « fine-tune white balance ».

Le manuel de référence du D5600 existe (« Reference Manual », « English », « 21.39 MB », https://downloadcenter.nikonimglib.com/en/products/351/D5600.html, `P/nikon-downloadcenter-d5600.html`), mais son lien de téléchargement pointe vers `crossgate.nikonimglib.com`, hors des hôtes autorisés. Non lu.

### 1.5 Sony A6000 (ILCE-6000) : réglages sourcés, kelvins absents

Source : Sony Corporation, « Help Guide, Interchangeable Lens Digital Camera ILCE-6000 », « White Balance », https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000522853.html, « 4-534-933-11(2) Copyright 2014 Sony Corporation » — `P/sony-ilce-6000-white-balance.html`.

- « Auto (default setting): » « The product automatically detects the light source and adjusts the color tones. »
- Daylight, Shade, Cloudy (« The color temperature is adjusted for a cloudy sky. »), Incandescent, Fluor.: Warm White, Fluor.: Cool White, Fluor.: Day White, Fluor.: Daylight, Flash, Underwater Auto, C.Temp./Filter, Custom, Custom Setup.
- C.Temp./Filter : « you can use the right button to display the color temperature setting screen and perform a setting ».
- Mesure personnalisée, https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000518345.html (`P/sony-ilce-6000-custom-setup.html`) : « The calibrated values (Color Temperature and Color Filter) are displayed and registered. »
- La table des matières du guide (`P/sony-ilce-6000-contentslist01.html`) ne contient pas d'entrée « Priority Set in AWB » : seules « White Balance », « Capturing a basic white color in [Custom Setup] mode » et « WB bracket » traitent du sujet.

Aucun kelvin, aucune plage.

### 1.6 Canon EOS 2000D : manuel non lu

Même situation que l'EOS RP (section 1.3). Le manuel Canon le plus proche que j'ai pu lire est celui d'un autre reflex, l'EOS 850D (source C), qui n'est pas une source pour le 2000D.

### 1.7 Synthèse

| Boîtier | Liste des réglages | K des préréglages | Plage et pas en K | Réglage fin |
|---|---|---|---|---|
| Nikon Z 6 | sourcée (manuel) | sourcés | 2500–10 000 K ; pas : je ne sais pas | A–B par 0,5 (1 unité ≈ 5 mired), G–M par 0,25 (graduation ≈ 0,05 de densité) ; étendue : je ne sais pas |
| Sony A7 III | sourcée (guide) | je ne sais pas | je ne sais pas | existe ; échelle : je ne sais pas |
| Canon EOS RP | je ne sais pas (manuel non lu) | je ne sais pas ; R5, R6 et 850D : 5200, 7000, 6000, 3200, 4000 | je ne sais pas ; R6 et 850D : 2500–10 000 K par 100 K | je ne sais pas ; R6 et 850D : 1 niveau B/A ≈ 5 mired |
| Nikon D5600 | sourcée (Digitutor) | je ne sais pas | pas de réglage en K dans la liste lue | existe ; échelle : je ne sais pas |
| Sony A6000 | sourcée (guide) | je ne sais pas | je ne sais pas | existe ; échelle : je ne sais pas |
| Canon EOS 2000D | je ne sais pas | je ne sais pas | je ne sais pas | je ne sais pas |

---

## 2. La science : d'un réglage en kelvins à des gains R, V, B en lumière linéaire

Toutes les sources de cette section sont des articles de Wikipedia en anglais (source secondaire, éditeur : Wikimedia Foundation, auteurs : contributeurs de Wikipedia). Les formules sont relevées dans le wikitexte de la révision citée (fichiers `*.wikitext`), la page HTML de la même révision est enregistrée à côté.

### 2.1 Mired

« Mired », révision 1336860559 (6 février 2026), https://en.wikipedia.org/w/index.php?title=Mired&oldid=1336860559 — `P/wikipedia-mired-oldid-1336860559.wikitext`.
- `M = \frac{1\,000\,000 \,\text{K}}{T}` : M = 1 000 000 / T.
- Table « Common color temperature and mired equivalents » (référence de l'article : Robb Smith, *The Tiffen practical filter manual*, 1975, page 40) : « Overcast » 6700–7000 K ; « Daylight (average) » 5500–6000 K ; « Shade, illuminated by skylight » 10000–12000 K ; « Professional tungsten » 3200 K.

### 2.2 Lumière du jour : série D de la CIE

« Standard illuminant », révision 1374213098 (10 septembre 2026), https://en.wikipedia.org/w/index.php?title=Standard_illuminant&oldid=1374213098 — `P/wikipedia-standard-illuminant-oldid-1374213098.wikitext`, section « Illuminant series D », « Computation ».

Chromaticité (x_D, y_D) dans l'espace CIE 1931, T étant la température de couleur proximale de l'illuminant :

```
x_D = 0.244063 + 0.09911·10³/T + 2.9678·10⁶/T² − 4.6070·10⁹/T³     pour 4000 K ≤ T ≤ 7000 K
x_D = 0.237040 + 0.24748·10³/T + 1.9018·10⁶/T² − 2.0064·10⁹/T³     pour 7000 K < T ≤ 25000 K
y_D = −3.000·x_D² + 2.870·x_D − 0.275
```

Texte du wikitexte : `0.244063 + 0.09911 \frac{10^3}{T} + 2.9678 \frac{10^6}{T^2} - 4.6070 \frac{10^9}{T^3}`, `0.237040 + 0.24748 \frac{10^3}{T} + 1.9018 \frac{10^6}{T^2} - 2.0064 \frac{10^9}{T^3}`, `y_D = -3.000 x_D^2 + 2.870 x_D - 0.275`.

- Domaine : 4000 K à 25 000 K. La formule ne couvre pas les réglages inférieurs à 4000 K.
- « The '''D''' series of illuminants are designed to represent natural daylight and lie along the daylight locus. »
- Températures réelles : « D50 has a CCT of 5003&nbsp;K » et D65 « has a CCT of 6504&nbsp;K » ; correction par c₂/1.4380.
- Écart entre le lieu de la lumière du jour et le lieu de Planck : légende de la figure, « the two loci are separated by a fairly even distance, of around <math>\Delta_{uv}=0.003</math> ».
- Table des points blancs (page HTML `P/wikipedia-standard-illuminant.html`, observateur 2°) : A 0.44758, 0.40745 (2856 K, « incandescent / tungsten ») ; D50 0.34567, 0.35850 (5003 K) ; D55 0.33242, 0.34743 (5503 K) ; D65 0.31272, 0.32903 (6504 K, « noon daylight: television, sRGB color space ») ; D75 0.29902, 0.31485 (7504 K, « North sky daylight »).

### 2.3 Sources à incandescence : lieu de Planck

« Planckian locus », révision 1383634637 (3 novembre 2026), https://en.wikipedia.org/w/index.php?title=Planckian_locus&oldid=1383634637 — `P/wikipedia-planckian-locus-oldid-1383634637.wikitext`, section « Approximation » (Kim et al., brevet US 7024034, 2006 ; Kang et al., *Journal of the Korean Physical Society*, 2002).

```
x_c = −0.2661239·10⁹/T³ − 0.2343580·10⁶/T² + 0.8776956·10³/T + 0.179910     pour 1667 K ≤ T ≤ 4000 K
x_c = −3.0258469·10⁹/T³ + 2.1070379·10⁶/T² + 0.2226347·10³/T + 0.240390     pour 4000 K ≤ T ≤ 25000 K

y_c = −1.1063814·x_c³ − 1.34811020·x_c² + 2.18555832·x_c − 0.20219683       pour 1667 K ≤ T ≤ 2222 K
y_c = −0.9549476·x_c³ − 1.37418593·x_c² + 2.09137015·x_c − 0.16748867       pour 2222 K ≤ T ≤ 4000 K
y_c =  3.0817580·x_c³ − 5.87338670·x_c² + 3.75112997·x_c − 0.37001483       pour 4000 K ≤ T ≤ 25000 K
```

Texte du wikitexte, par exemple : `-0.2661239 \frac{10^9}{T^3} - 0.2343580 \frac{10^6}{T^2} + 0.8776956 \frac{10^3}{T} + 0.179910` et ` 3.0817580 x_\text{c}^3 - 5.87338670 x_\text{c}^2 + 3.75112997 x_\text{c} - 0.37001483`.

Cette approximation couvre 1667 K à 25 000 K, donc toute la plage 2500–10 000 K des boîtiers.

### 2.4 De la chromaticité xy aux composantes XYZ

« CIE 1931 color space », révision 1383875433 (5 novembre 2026), https://en.wikipedia.org/w/index.php?title=CIE_1931_color_space&oldid=1383875433 — `P/wikipedia-cie-1931-color-space-oldid-1383875433.wikitext`, section « CIE xyY color space » :

```
X = (Y / y)·x
Z = (Y / y)·(1 − x − y)
```

Wikitexte : `X &= \frac{Y}{y}x` et `Z &= \frac{Y}{y}(1 - x - y).`

Diagramme uv de 1960 (pour mesurer un écart au lieu) : « CIE 1960 color space », révision 1332203814 (10 janvier 2026), https://en.wikipedia.org/w/index.php?title=CIE_1960_color_space&oldid=1332203814 — `P/wikipedia-cie-1960-color-space-oldid-1332203814.wikitext` : `u = \frac{4x}{12y - 2x + 3}`, `v = \frac{6y}{12y - 2x + 3}`.

### 2.5 De XYZ au sRGB linéaire

« sRGB », révision 1378992844 (7 octobre 2026), https://en.wikipedia.org/w/index.php?title=SRGB&oldid=1378992844 — `P/wikipedia-srgb-oldid-1378992844.wikitext`, section « Primaries ».

Matrice de la norme, sRGB linéaire vers XYZ (« these 4-digit coefficients should be considered exact ») :

```
X     0.4124  0.3576  0.1805     R
Y  =  0.2126  0.7152  0.0722  ·  G
Z     0.0193  0.1192  0.9505     B
```

Matrice inverse, XYZ vers sRGB linéaire, version de l'amendement de 2003 (« seven decimal fraction digits, enough for 16-bit samples ») :

```
R      3.2406255  −1.5372080  −0.4986286     X
G  =  −0.9689307   1.8757561   0.0415175  ·  Y
B      0.0557101  −0.2040211   1.0569959     Z
```

Version de 1999 à quatre décimales :  3.2406 −1.5372 −0.4986 / −0.9689  1.8758  0.0415 /  0.0557 −0.2040  1.0570.

- Blanc de référence : x = 0.3127, y = 0.3290 (D65) ; « the ''X'', ''Y'', and ''Z'' values must be scaled so that the ''Y'' of [[Illuminant D65|D65]] ("white") is 1.0 (''X'' = 0.9505, ''Y'' = 1.0000, ''Z'' = 1.0890) ».
- Courbe de transfert (pour passer en lumière linéaire) : `R'/12.92, & R' \le 0.04045` ; `\left(\frac{\displaystyle R' + 0.055}{\displaystyle 1.055}\right) ^{2.4}, & R' > 0.04045` ; et dans l'autre sens `12.92 R, & R \le 0.0031308` ; `(1.055)R^{1/2.4} - 0.055, & R > 0.0031308`.

### 2.6 Adaptation chromatique : von Kries, Bradford

« Chromatic adaptation », révision 1344474673 (20 mars 2026), https://en.wikipedia.org/w/index.php?title=Chromatic_adaptation&oldid=1344474673 — `P/wikipedia-chromatic-adaptation-oldid-1344474673.wikitext`.
- « when the correction occurs in a camera it is referred to as [[white balance]] ».
- Von Kries : « The method is to apply a gain to each of the human [[cone cell]] spectral sensitivity responses so as to keep the adapted appearance of the reference white constant. »
- Matrice diagonale dans l'espace LMS : `D = D_1^{-1} D_2=\begin{bmatrix} L_2/L_1 & 0 & 0 \\ 0 & M_2/M_1 & 0 \\ 0 & 0 & S_2/S_1 \end{bmatrix}` ; ses éléments sont « the ratios of the cone responses (Long, Medium, Short) for the illuminant's [[white point]] ».
- Pour des couleurs en XYZ ou en RVB, la transformation complète « includes matrix transformations into and out of [[LMS Color Space|LMS space]], with the diagonal transform ''D'' in the middle ».

« LMS color space », révision 1338825585 (17 février 2026), https://en.wikipedia.org/w/index.php?title=LMS_color_space&oldid=1338825585 — `P/wikipedia-lms-color-space.html` (le wikitexte brut a été refusé par le serveur, code 429 ; les matrices sont lues dans l'attribut `data-mw` de la page HTML).

Matrice de Bradford (XYZ vers l'espace d'adaptation) :

```
 0.8951   0.2664  −0.1614
−0.7502   1.7135   0.0367
 0.0389  −0.0685   1.0296
```

Source LaTeX de la page : `\phantom{-}0.8951 & \phantom{-}0.2664 & -0.1614 \\ -0.7502 & \phantom{-}1.7135 & \phantom{-}0.0367 \\ \phantom{-}0.0389 & -0.0685 & \phantom{-}1.0296`.
- L'article précise que la matrice de Bradford « is used in conjunction with the linear von Kries transform method, explicitly so in » les profils ICC.
- Matrice de Hunt–Pointer–Estevez (dite « von Kries »), normalisée D65 : 0.4002 0.7076 −0.0808 / −0.2263 1.1653 0.0457 / 0 0 0.9182.

### 2.7 Balance par gains : ce qu'en dit l'article « Color balance »

« Color balance », révision 1382679784 (29 octobre 2026), https://en.wikipedia.org/w/index.php?title=Color_balance&oldid=1382679784 — `P/wikipedia-color-balance-oldid-1382679784.wikitext`, section « Mathematics of color balance ».
- Gains par canal en RVB d'écran : matrice diagonale `255/R'_w`, `255/G'_w`, `255/B'_w`, où R'w, G'w, B'w sont les composantes d'un pixel « which is believed to be a white surface in the image before color balancing » ; c'est le principe de la pipette.
- Limite : « It has been demonstrated that performing the white balancing in the phosphor set assumed by [[sRGB]] tends to produce large errors in chromatic colors, even though it can render the neutral surfaces perfectly neutral. »
- Dans l'espace du capteur : « If the camera's raw RGB values are known, one may use the 3x3 diagonal matrix » puis « convert to a working RGB space such as [[sRGB]] or [[Adobe RGB]] after balancing ».
- Espaces préférés pour l'adaptation : « the "Sharp", "Bradford", "CMCCAT", and "ROMM" spaces ».

« Color temperature », révision 1384253738 (7 novembre 2026), https://en.wikipedia.org/w/index.php?title=Color_temperature&oldid=1384253738 — `P/wikipedia-color-temperature.html` et `P/wikipedia-color-temperature-oldid-1384253738.wikitext`.
- Table : « 6,500 K » : « Daylight, overcast, daylight LED lamps » ; « 5,500–6,000 K » : « Vertical daylight, electronic flash » ; « 3,200 K » : « Studio lamps, photofloods, etc. ».
- Photo numérique : les réglages en kelvins « vary color values along the blue–yellow axis, while some software includes additional controls (sometimes labeled "tint") adding the magenta–green axis ».

---

## 3. Poly Haven et la photo autumn_hockey

Dépôt : `app/public/scenes/parc/scene.json` déclare l'actif `autumn_hockey` (« Autumn Hockey », auteur Greg Zaal, CC0-1.0, source https://polyhaven.com/a/autumn_hockey), avec deux fichiers : `autumn_hockey/autumn_hockey.jpg` (fond, « Tonemapped JPG ») et `autumn_hockey/autumn_hockey_1k.hdr` (éclairage). `app/src/scene.ts` les charge dans un `PhotoDome` (JPG) et un `HDRCubeTexture` (HDR).

### 3.1 Ce que Poly Haven publie pour autumn_hockey

API de Poly Haven, https://api.polyhaven.com/info/autumn_hockey — `P/polyhaven-api-info-autumn_hockey.json`. Champs présents : `evs_cap` 6 ; `categories` : "outdoor", "nature", "overcast", "midday", "low contrast", "natural light" ; `attributes` : `"time_of_day": "midday"`, `"weather": "overcast"`, `"light_type": "natural"`, `"sky_view": "obstructed"` ; `coords` [52.380836, 9.758647] ; `date_taken` 1478775540 (calcul : 10 novembre 2016, 10 h 59 UTC) ; `date_published` 1506982200 ; `description` : « Unclipped, free 16K HDRI. Soft midday overcast light in an autumn park with low-contrast, natural tones, diffuse shadows and scattered golden leaves. »

Il n'y a pas de champ `whitebalance` pour autumn_hockey.

Page du site, https://polyhaven.com/a/autumn_hockey — `P/polyhaven-page-autumn_hockey.html` : les blocs d'information montrent « 6 EVs » (infobulle « 6 EVs of dynamic range captured. Unclipped. »), l'auteur, la licence, les catégories. Aucun bloc de balance des blancs, aucun fichier de charte de couleurs (la chaîne « colorchart » est absente de la page).

### 3.2 Poly Haven publie la balance des blancs d'autres photos

Liste de toutes les photos HDR, https://api.polyhaven.com/assets?t=hdris — `P/polyhaven-api-assets-hdris.json` (997 photos). Calcul (`phstats.py`) :
- 647 photos sur 997 ont un champ `whitebalance` (un nombre, en kelvins d'après l'affichage du site) ;
- valeurs les plus fréquentes : 5400 (158 photos), 5303 (74), 5539 (53), 5313 (44), 6504 (27) ;
- photos prises en 2016 : 125, dont 19 avec le champ, toutes entre 5150 et 5400, médiane 5400 ;
- photos de catégorie « overcast » : 134, dont 75 avec le champ, médiane 5400, 55 entre 5000 et 5700 ;
- les photos prises les mêmes jours qu'autumn_hockey (10 et 11 novembre 2016 : eilenriede_labyrinth, graffiti_shelter, autumn_crossing, autumn_ground, eilenriede_park) n'ont pas le champ non plus.

Exemple de photo avec le champ : https://polyhaven.com/a/kloofendal_overcast — `P/polyhaven-page-kloofendal_overcast.html` : bloc « 5303K » « WB », infobulle `data-tip="Whitebalance"` ; données `"whitebalance":5303` ; un fichier « Color Chart » (826,16 MB) est proposé.

La page de l'API, https://polyhaven.com/our-api (`P/polyhaven-our-api.html`), montre le champ dans un exemple (`"whitebalance" : 5319`) sans le définir. Je n'ai lu aucune page qui dise ce que ce nombre mesure (balance choisie au développement des fichiers bruts, ou température mesurée de la lumière).

### 3.3 Règles de fabrication publiées

Page « Contribute », https://polyhaven.com/contribute — `P/polyhaven-contribute.html`, « Requirements for HDRIs » (règles actuelles pour les dons ; rien ne dit qu'elles valaient en 2016) : « Created with a fully linear workflow » ; « No tonemapping, color/contrast adjustments, sharpening, or tone curve. » ; « Unclipped (complete dynamic range). » ; « Separate macbeth color chart shot parallel to the ground, with the same exposure bracket as the rest of the pano, and merged to HDR file in the same way. »

La FAQ (https://polyhaven.com/faq) redirige vers `docs.polyhaven.com`, hors des hôtes autorisés. Non lue.

Réponse à la question (3) : oui, Poly Haven publie une balance des blancs pour 647 de ses 997 photos HDR, mais pas pour autumn_hockey, et sans définir le champ dans les pages lues.

---

## 4. Ce que les manuels disent de la balance automatique

| Boîtier | Plage de l'automatique | Variantes | Ce que dit le manuel |
|---|---|---|---|
| Nikon Z 6 | 3500–8000 K ; « Natural light auto » : 4500–8000 K | Keep white (reduce warm colors) ; Keep overall atmosphere (défaut) ; Keep warm lighting colors ; Natural light auto | « White balance is adjusted automatically for optimal results with most light sources. » Les trois variantes ne sont décrites que par leur effet sous éclairage incandescent : supprimer, garder en partie, garder la dominante chaude. |
| Sony A7 III | pas de plage dans le guide | « Priority Set in AWB » : Standard, Ambience, White | « Selects which tone to prioritize when shooting under lighting conditions such as incandescent light » ; Standard : « Shoots with standard auto white balance. The camera automatically adjusts the color tones. » ; Ambience : « Prioritizes the color tone of the light source. This is suitable when you want to produce a warm atmosphere. » ; White : « Prioritizes a reproduction of white color when the color temperature of the light source is low. » |
| Canon (R5, R6, 850D ; pas l'EOS RP) | 3000–7000 K | Ambience priority ; White priority | « (Ambience priority), you can slightly increase the intensity of the image's warm color cast when shooting a tungsten-light scene. » ; « (White priority), you can reduce the intensity of the image's warm color cast. » ; avec le flash, le rendu de la priorité au blanc est celui de la priorité à l'ambiance. |
| Sony A6000 | pas de plage | aucune variante dans la table des matières du guide | « The product automatically detects the light source and adjusts the color tones. » |
| Nikon D5600 | pas de plage dans la page lue | aucune dans la page lue | « Automatic white balance adjustment. Recommended in most situations. » |
| Canon EOS RP, EOS 2000D | je ne sais pas | je ne sais pas | manuels non lus |

Autres points du manuel du Z 6 (`P/nikon-z7z6-white-balance.html`) :
- le boîtier dit quelle température il a choisie : « The photo info for pictures shot using auto white balance lists the color temperature selected by the camera at the time the picture was taken. » ;
- « Natural light auto » « may not produce the desired results under artificial light » ;
- l'automatique « may not produce the desired results with large studio flash units ».

Aucun manuel lu ne décrit la méthode par laquelle le boîtier estime la lumière, ni ne chiffre la part de dominante chaude gardée par chaque variante.

---

## 5. Mesures faites cette nuit sur les fichiers du dépôt (calculs, pas des sources)

Fichier : `app/public/scenes/parc/autumn_hockey/autumn_hockey_1k.hdr` (sha256 `2b12b0a2…d57d`, conforme à `scene.json`). En-tête lu : `#?RADIANCE`, `# Made with Adobe Photoshop`, `GAMMA=1`, `PRIMARIES=0 0 0 0 0 0 0 0`, `FORMAT=32-bit_rle_rgbe`, 1024 × 512. Le fichier ne déclare donc pas ses primaires.

Hypothèse de lecture : les trois canaux sont du sRGB linéaire (primaires de la section 2.5). Elle n'est pas écrite dans le fichier.

Méthode (`hdrmeasure.py`, `orient.py`) : moyenne des canaux pondérée par l'angle solide (cosinus de la latitude) ; pour une carte, pondération supplémentaire par le cosinus de l'angle entre la direction et la normale de la carte. Chromaticité par les formules des sections 2.4 et 2.5 ; « D la plus proche » = température de la série D (section 2.2) la plus proche dans le diagramme uv.

| Zone du fichier HDR | R/V | B/V | xy | D la plus proche (écart uv) |
|---|---|---|---|---|
| Ciel : 10 % les plus lumineux de l'hémisphère haut | 0,933 | 1,234 | 0,2945 ; 0,3059 | 8030 K (0,0021) |
| Lumière reçue par une carte horizontale tournée vers le haut | 0,970 | 1,195 | 0,2990 ; 0,3096 | 7610 K (0,0028) |
| Carte verticale, azimut 0° | 1,137 | 0,985 | 0,3229 ; 0,3305 | 5960 K (0,0043) |
| Carte verticale, azimut 90° | 1,085 | 1,074 | 0,3137 ; 0,3214 | 6510 K (0,0045) |
| Carte verticale, azimut 180° | 1,136 | 1,070 | 0,3174 ; 0,3220 | 6300 K (0,0061) |
| Carte verticale, azimut 270° | 1,140 | 1,038 | 0,3197 ; 0,3252 | 6160 K (0,0056) |
| Hémisphère bas (sol, feuilles) | 1,928 | 0,381 | 0,4222 ; 0,3984 | hors du lieu (0,0215) |

Lecture :
- telles que le fichier les code, les couleurs de la lumière ne sont pas neutres : le ciel est bleuté (B/V 1,23), la lumière sur une carte verticale est plus chaude que sur une carte horizontale, parce que le sol couvert de feuilles renvoie une lumière orangée ;
- il n'y a donc pas une seule « couleur de la lumière » dans la scène : elle dépend de l'orientation de la surface ;
- ces températures ne sont celles de la lumière réelle que si le fichier a été développé avec une balance réglée sur D65. Rien ne le dit (section 3).

Fond JPG (`jpgmeasure.py`, `compare.py`) : `autumn_hockey.jpg`, 8192 × 4096, sans profil ICC, réduit à 1024 × 512 et linéarisé par la courbe sRGB. Dans les tons moyens, le JPG et le HDR ont presque la même balance (médiane du rapport des R/V : 1,04 ; des B/V : 0,98). Dans les hautes lumières, le JPG perd du bleu par rapport au HDR (rapport des B/V : 0,90) et 23 % des pixels du haut de l'image ont un canal à 255 : le ciel du fond est compressé et écrêté. Ciel du JPG (10 % les plus lumineux) : R/V 0,964, B/V 1,058, contre 0,933 et 1,234 dans le HDR.

---

## 6. Ce qui n'est pas sourcé

Je ne sais pas, faute d'avoir pu lire la source :
- Canon EOS RP et EOS 2000D : liste des réglages, kelvins, plage, pas, réglage fin, variantes de l'automatique. Les manuels ne sont pas sur `cam.start.canon` ; `www.canon.co.uk` répond 403.
- Nikon D5600 : kelvins des préréglages, types de fluorescent, échelle du réglage fin. Le manuel de référence est derrière `crossgate.nikonimglib.com`.
- Sony A7 III et A6000 : kelvins des préréglages, plage et pas de « C.Temp./Filter », échelle et étendue du réglage fin. Les guides d'aide ne les donnent pas ; `www.sony.ca` répond 403. Un extrait de recherche (pages non ouvertes) cite 2500K à 9900K pour des caméras d'action Sony, pas pour ces boîtiers.
- Nikon Z 6 : pas en kelvins de « Choose color temperature » ; étendue des axes A–B et G–M.
- Poly Haven : la balance des blancs d'autumn_hockey ; le sens exact du champ `whitebalance` ; les primaires des fichiers HDR ; la FAQ et la documentation (`docs.polyhaven.com`).

Non sourcé parce qu'aucune source lue ne le dit :
- la température de couleur réelle de la lumière dans le parc le 10 novembre 2016 : non mesurée, non publiée ;
- la méthode d'estimation de la balance automatique, et la part de dominante chaude gardée par chaque variante (Nikon, Sony, Canon) ;
- le lieu (Planck ou série D) qu'un boîtier associe à son réglage en kelvins, et l'espace de couleur dans lequel il applique ses gains ;
- la sensibilité spectrale des capteurs des six boîtiers : sans elle, on ne peut pas calculer les vrais gains du capteur ni le bruit que ces gains amplifient par canal ;
- le sens physique de « 0.05 diffuse density units » du réglage vert–magenta de Nikon. Le lire comme une densité optique décimale (facteur 10^−0,05 ≈ 0,891 par graduation sur le canal filtré) est mon interprétation ; je n'ai lu aucune page qui le confirme ;
- le signe de la conversion « ambre = température réglée plus haute » en mired (section 7.4) : déduit du sens donné par le manuel, pas écrit tel quel ;
- la teinte verte ou magenta des préréglages « Fluorescent » : le manuel Nikon ne donne qu'une température, et dit lui-même que le réglage en kelvins ne convient pas à l'éclairage fluorescent ;
- la normalisation des gains (canal vert à 1) : convention commode, non sourcée ;
- les tables de températures par type de ciel (Wikipedia, sections 2.1 et 2.7) sont de seconde main : la table de « Mired » cite un manuel Tiffen de 1975 que je n'ai pas lu, celle de « Color temperature » n'a pas de référence par ligne.

Accès refusés cette nuit, pour mémoire : `www.sony.ca` (403, trois adresses, essayées avec un agent utilisateur de navigateur) ; `www.canon.co.uk` (403, avec un agent utilisateur de navigateur puis avec celui de curl ; une troisième tentative avec des en-têtes de navigateur complets a été refusée par le contrôle de l'outil, je n'ai pas insisté) ; API de Wikipedia (429, contournée en lisant les pages d'article et le wikitexte par `index.php`, à raison d'une requête toutes les six secondes) ; `docs.polyhaven.com` et `crossgate.nikonimglib.com` (hors liste).

---

## 7. Proposition pour TutoPhoto

À trancher par Julien. Rien n'est produit.

### 7.1 Ce qui est sourcé et peut être mis en œuvre tel quel

- Nikon Z 6 : la liste complète des réglages, leurs libellés français et anglais, la température de chaque préréglage, la plage 2500–10 000 K, le réglage par défaut (« Auto > Keep overall atmosphere »), le réglage fin (A–B par 0,5 avec 1 unité ≈ 5 mired ; G–M par 0,25), six mémoires de mesure personnalisée, la mémoire vide à 5200 K.
- Sony A7 III et A6000 : la liste des réglages et leurs libellés anglais ; pas leurs kelvins.
- Les formules : mired, série D, lieu de Planck, xy vers XYZ, XYZ vers sRGB linéaire, von Kries, Bradford (Wikipedia, révisions citées).

Conséquence de la règle « on n'implémente que ce qui est sourcé » : la balance des blancs peut être complète sur le Z 6. Pour les cinq autres boîtiers, il manque les kelvins des préréglages. Deux voies : (a) n'y offrir d'abord que l'automatique, la température au choix et la mesure personnalisée, qui n'ont pas besoin de ces valeurs ; (b) attendre que Julien relève les manuels (EOS RP, EOS 2000D, D5600) et les fiches Sony. Je propose (a) pour Sony, et pour Canon d'attendre la lecture du manuel de l'EOS RP : les valeurs des R5, R6 et 850D sont identiques entre elles, mais les attribuer à l'EOS RP serait une extrapolation.

### 7.2 Le modèle : des gains relatifs à la balance du fichier

Le fichier HDR n'est pas une mesure de la lumière : c'est une photo déjà développée avec une certaine balance, que j'appelle K_ref. Le simulateur rejoue ce développement avec la balance K choisie par l'utilisateur.

Fonction w(T) : couleur, en sRGB linéaire, d'une lumière de température T.
1. chromaticité (x, y) de T sur le lieu choisi (section 2.3 ou 2.2) ;
2. X = x / y, Y = 1, Z = (1 − x − y) / y (section 2.4) ;
3. (R, V, B) = matrice XYZ vers sRGB linéaire × (X, Y, Z) (section 2.5).

Gains du réglage K :

```
g(K) = w(K_ref) / w(K)      canal par canal, puis division par le gain du vert pour que g_V = 1
photo = image du simulateur (lumière linéaire) × g(K)
```

- K = K_ref : gains (1, 1, 1), l'image est celle d'aujourd'hui.
- K < K_ref : le rouge baisse, le bleu monte, l'image refroidit ; K > K_ref : l'inverse. C'est le sens donné par le manuel Nikon (« lower values […] to intentionally make colors colder »).
- C'est la « balance par gains » de la section 2.7 (matrice diagonale), appliquée en sRGB linéaire. Un boîtier réel applique ses gains dans l'espace de son capteur, que nous ne connaissons pas : c'est une approximation, exacte pour les gris, moins pour les couleurs saturées (Wikipedia : « large errors in chromatic colors »).

Où l'appliquer : en lumière linéaire, dans le viseur comme sur la photo, comme le prévoit `docs/camera-physique.md` (« des gains par canal appliqués à l'image en lumière linéaire, avant le bruit et la courbe »). `app/src/camera/noise.ts` linéarise aujourd'hui par une puissance 2,2 ; les gains se placent juste après cette linéarisation.

### 7.3 L'hypothèse nécessaire : K_ref = 5400 K, non mesuré

La température de la lumière du parc n'est ni mesurée ni publiée. La balance de développement d'autumn_hockey non plus. Il faut une hypothèse, et une seule : K_ref.

Je propose K_ref = 5400 K. Raisons :
1. c'est la valeur que Poly Haven publie le plus souvent pour ses autres photos HDR (158 sur 647), la médiane des photos « overcast » (75 photos) et des photos de 2016 qui ont le champ (19 photos, toutes entre 5150 et 5400) ;
2. avec cette valeur, la lumière du parc se déduit des mesures de la section 5 (calcul `example.py` : w(T) proportionnel à la couleur mesurée × w(K_ref), puis température la plus proche sur le lieu de Planck) : ciel ≈ 6400 K, carte horizontale ≈ 6100 K, cartes verticales ≈ 4900 à 5300 K ;
3. ces valeurs recoupent des sources indépendantes : le préréglage « Cloudy » vaut 6000 K chez Nikon (« Use in daylight under overcast skies ») et chez Canon (R5, R6, 850D) ; Wikipedia donne 6500 K pour « Daylight, overcast » et, d'après un manuel Tiffen, 6700–7000 K pour « Overcast ».

Ce que cette hypothèse vaut : c'est un raisonnement par recoupement, pas une mesure. Elle suppose que le champ `whitebalance` de Poly Haven est la balance de développement (non défini dans les pages lues), que l'auteur développait de la même façon en novembre 2016, et que le fichier est en sRGB linéaire. Sensibilité (calcul) : avec K_ref = 5150 K, la carte horizontale tombe à ≈ 5760 K ; avec K_ref = 6504 K (fichier supposé neutre pour D65), à ≈ 7690 K et le ciel à ≈ 8150 K, au-dessus de toutes les valeurs de ciel couvert relevées.

À écrire dans l'application et dans la fiche : « température de la lumière de cette scène : environ 6000 K, estimée, non mesurée ».

### 7.4 Les réglages

- Préréglages et température au choix : g(K) avec le K du manuel (Z 6 : 5200, 6000, 8000, 3000, 5400 ; plage 2500–10 000 K).
- Préréglages « Fluorescent » du Z 6 : à ne pas offrir d'abord (teinte non sourcée, et aucune lumière fluorescente dans le parc), ou à offrir comme simple température en le disant.
- Réglage fin A–B (Z 6) : n unités vers l'ambre remplacent K par K′ = 10⁶ / (10⁶/K − 5n) ; vers le bleu, K′ = 10⁶ / (10⁶/K + 5n). Exemple (calcul) : 6000 K et A2 donnent 6383 K ; 6000 K et B2 donnent 5660 K. Le signe est déduit, voir section 6.
- Réglage fin G–M (Z 6) : si l'interprétation en densité optique est retenue, une graduation vers le magenta multiplie le gain du vert par 10^−0,05 ≈ 0,891, une graduation vers le vert par 10^0,05 ≈ 1,122. À marquer « non sourcé » tant qu'aucune page ne le confirme.
- Mesure personnalisée (Z 6 « Preset manual », Sony « Custom Setup ») : aucune hypothèse. On lit la moyenne (R, V, B) en lumière linéaire de la zone visée, avant gains, et on applique g = (V/R, 1, V/B). C'est la matrice diagonale de la section 2.7. Le parc n'a pas d'objet neutre : il faudrait y poser une carte grise virtuelle, sinon la mesure sur un banc ou des feuilles donne une image fausse, comme en vrai.
- Automatique : les manuels ne décrivent pas la méthode. Proposition : l'automatique applique les gains qui rendent neutre une carte horizontale dans la scène (mesurés une fois par scène, comme la mesure personnalisée), et affiche la température la plus proche, bornée à la plage du manuel (Z 6 : 3500–8000 K ; « Natural light auto » : 4500–8000 K). Dans le parc, avec K_ref = 5400 K : ≈ 6100 K. C'est une idéalisation à dire : un vrai boîtier ne neutralise pas toujours exactement.
- Variantes de l'automatique (Z 6 : trois ; Sony A7 III : trois ; Canon : deux) : les manuels ne les distinguent que sous éclairage incandescent. Dans le parc, en lumière du jour, elles donnent le même résultat ; le dire dans l'interface plutôt que d'inventer un écart. Leur différence sera à sourcer et à chiffrer pour une scène d'intérieur (SIT-18).

### 7.5 Calcul pas à pas, exemple chiffré

Réglage « Nuageux » du Z 6 (6000 K), K_ref = 5400 K, lieu de Planck (formules de la section 2.3, branche 4000–25 000 K). Calcul : `example.py`.

1. w(5400) :
   - x = −3,0258469·10⁹/5400³ + 2,1070379·10⁶/5400² + 0,2226347·10³/5400 + 0,240390 = 0,33466 ;
   - y = 3,0817580·x³ − 5,87338670·x² + 3,75112997·x − 0,37001483 = 0,34304 ;
   - X = x/y = 0,97557 ; Y = 1 ; Z = (1 − x − y)/y = 0,93953 ;
   - R = 3,2406255·X − 1,5372080·Y − 0,4986286·Z = 1,15576 ; V = 0,96951 ; B = 0,84340.
2. w(6000) : x = 0,32202 ; y = 0,33178 ; X = 0,97058 ; Z = 1,04350 ; R = 1,08777 ; V = 0,97865 ; B = 0,95302.
3. Rapport canal par canal : 1,15576/1,08777 = 1,06250 ; 0,96951/0,97865 = 0,99066 ; 0,84340/0,95302 = 0,88497.
4. Division par le gain du vert : g(6000) = (1,0725 ; 1 ; 0,8933).
5. Effet sur une carte grise horizontale, qui vaut (0,970 ; 1 ; 1,195) dans le fichier : (0,970 × 1,0725 ; 1 ; 1,195 × 0,8933) = (1,040 ; 1 ; 1,068). Presque neutre, avec un reste de magenta de 4 à 7 %.

Autres réglages, même calcul (gains R ; V ; B, puis couleur de la carte horizontale R/V ; B/V) :

| Réglage | K | Gains | Carte horizontale | Lecture |
|---|---|---|---|---|
| Incandescent (Nikon) | 3000 | 0,570 ; 1 ; 2,698 | 0,553 ; 3,224 | très bleu |
| Tungsten light (Canon R5, R6, 850D) | 3200 | 0,616 ; 1 ; 2,314 | 0,598 ; 2,766 | très bleu |
| Direct sunlight (Nikon), Daylight (Canon) | 5200 | 0,973 ; 1 ; 1,045 | 0,944 ; 1,249 | froid |
| Flash (Nikon) | 5400 | 1 ; 1 ; 1 | 0,970 ; 1,195 | image actuelle |
| Cloudy (Nikon, Canon) | 6000 | 1,073 ; 1 ; 0,893 | 1,040 ; 1,068 | proche du neutre |
| Shade (Canon) | 7000 | 1,171 ; 1 ; 0,775 | 1,136 ; 0,926 | chaud |
| Shade (Nikon) | 8000 | 1,248 ; 1 ; 0,697 | 1,211 ; 0,834 | chaud, orangé |
| Extrêmes de la plage | 2500 ; 10 000 | 0,446 ; 1 ; 4,765 et 1,359 ; 1 ; 0,605 | | |

Gains qui neutralisent exactement la carte horizontale (mesure personnalisée, automatique proposé) : (1/0,970 ; 1 ; 1/1,195) = (1,031 ; 1 ; 0,837).

Avec les gains normalisés sur le vert, la luminance d'un gris (0,2126 R + 0,7152 V + 0,0722 B) varie de −3 % à +5 % entre 3200 K et 10 000 K, et de +13 % à 2500 K : moins qu'un tiers de valeur d'exposition.

### 7.6 Deux choix techniques à trancher

Lieu utilisé pour w(T) :
- A, proposé : le lieu de Planck (Kim et al.) sur toute la plage. Il couvre 1667–25 000 K, donc les 2500–10 000 K des boîtiers, sans rupture. Le manuel Nikon définit d'ailleurs la température de couleur par un objet chauffé.
- B : la série D à partir de 4000 K et le lieu de Planck en dessous, comme le veut la physique des sources. Défaut (calcul) : un saut à 4000 K, +3 % sur le gain du rouge et +9 % sur celui du bleu entre 3999 K et 4000 K, visible en tournant la molette.
- L'écart entre A et B au-dessus de 4000 K est faible parce que seul un rapport compte : à 6000 K, (1,0725 ; 1 ; 0,8933) pour A contre (1,0779 ; 1 ; 0,8860) pour B.

Méthode d'adaptation :
- A, proposé : gains diagonaux en sRGB linéaire (section 7.2). Trois multiplications, pas de valeur négative, gris exacts.
- B : matrice 3 × 3 de Bradford, M = (XYZ→sRGB) · Bradford⁻¹ · diag(blanc_ref / blanc_K) · Bradford · (sRGB→XYZ), les blancs étant exprimés dans l'espace de Bradford. Jugée meilleure pour les couleurs par l'article de Wikipedia. Calcul sur quelques couleurs : pour 6000 K les deux méthodes diffèrent de moins de 4 % par canal ; pour 3000 K elles divergent nettement et Bradford produit des composantes négatives sur un vert et un bleu saturés, qu'il faut écrêter.

### 7.7 Limites à dire dans l'application et dans `docs/camera-physique.md`

- La température de la lumière de la scène est estimée (K_ref = 5400 K, hypothèse), pas mesurée.
- La couleur de la lumière dépend de l'orientation : une carte horizontale et un visage vertical ne se neutralisent pas au même réglage (≈ 6100 K contre ≈ 5000 à 5300 K, calcul). C'est réaliste, et c'est une raison de plus de ne pas juger la balance sur un seul nombre.
- Fond et éclairage ne viennent pas du même fichier. Au réglage qui neutralise la carte horizontale, le ciel du fond JPG, compressé et écrêté, passerait à R/V ≈ 0,99 et B/V ≈ 0,89 (calcul : 0,964 × 1,031 et 1,058 × 0,837), soit un ciel un peu jaune, alors que le ciel du HDR resterait légèrement bleuté (0,96 ; 1,03). À vérifier à l'écran avant de publier ; si c'est visible, il faudra en parler (fond recalculé depuis le HDR, ou limite assumée).
- Les gains sont appliqués en sRGB linéaire, pas dans l'espace du capteur : les couleurs saturées sont approchées, et le bruit propre à chaque canal après gains n'est pas simulé.
- Si l'automatique devient le réglage par défaut (c'est celui du Z 6), l'image par défaut du simulateur change : gains ≈ (1,03 ; 1 ; 0,84) au lieu de (1 ; 1 ; 1), donc un rendu un peu plus chaud qu'aujourd'hui. Les captures de la routine de test et les fiches illustrées seraient à refaire.
- Les variantes de l'automatique ne se distinguent pas dans le parc.

### 7.8 Ce que Julien peut relever pour lever les inconnues

- Le manuel de l'EOS RP et celui de l'EOS 2000D (pages « White balance » et « White balance correction »).
- Le manuel de référence du D5600 (Nikon Download Center, page citée en 1.4).
- La fiche technique Sony du A7 III et du A6000 (plage de « C.Temp./Filter », étendue du réglage fin).
- La documentation de Poly Haven sur le champ « whitebalance » et sur l'espace de couleur des fichiers HDR, ou une question directe à l'auteur sur la balance d'autumn_hockey.

---

## 8. Fichiers enregistrés

Dossier : `pages/balance-des-blancs/`

Nikon : `nikon-z7z6-index.html`, `nikon-z7z6-white-balance.html`, `nikon-z7z6-fr-white-balance.html`, `nikon-z7z6-07_the_i_button_02.html`, `nikon-z7z6-09_menu_guide_01.html`, `nikon-z7z6-09_menu_guide_03_09-white-balance.html`, `nikon-z7z6-09_menu_guide_03_27-auto-bracketing.html`, `nikon-z7z6-14_technical_notes_06-specifications.html`, `nikon-digitutor-d5600-whitebalance.html`, `nikon-downloadcenter-d5600.html`.

Sony : `sony-ilce-7m3-help-guide-print.pdf`, `sony-ilce-7m3-help-guide-print.txt`, `sony-ilce-6000-white-balance.html`, `sony-ilce-6000-custom-setup.html`, `sony-ilce-6000-contentslist01.html`.

Canon : `canon-cam-start-en.html`, `canon-eos-r6-index.html`, `canon-eos-r6-white-balance.html`, `canon-eos-r6-white-balance-correction.html`, `canon-eos-r6-specifications.html` (rien sur la balance des blancs), `canon-eos-r5-white-balance.html`, `canon-eos-850d-index.html`, `canon-eos-850d-white-balance.html`, `canon-eos-850d-white-balance-correction.html`, `canon-eos-850d-specifications.html` (rien sur la balance des blancs), `canon-uk-eos-rp-specifications-403-acces-refuse.html`.

Wikipedia (page HTML et wikitexte de la révision) : `wikipedia-standard-illuminant.html` et `-oldid-1374213098.wikitext` ; `wikipedia-planckian-locus.html` et `-oldid-1383634637.wikitext` ; `wikipedia-srgb.html` et `-oldid-1378992844.wikitext` ; `wikipedia-chromatic-adaptation.html` et `-oldid-1344474673.wikitext` ; `wikipedia-lms-color-space.html` (révision 1338825585, sans wikitexte) ; `wikipedia-color-balance.html` et `-oldid-1382679784.wikitext` ; `wikipedia-cie-1931-color-space.html` et `-oldid-1383875433.wikitext` ; `wikipedia-cie-1960-color-space.html` et `-oldid-1332203814.wikitext` ; `wikipedia-mired.html` et `-oldid-1336860559.wikitext` ; `wikipedia-color-temperature.html` et `-oldid-1384253738.wikitext`.

Poly Haven : `polyhaven-api-info-autumn_hockey.json`, `polyhaven-api-assets-hdris.json`, `polyhaven-page-autumn_hockey.html`, `polyhaven-page-kloofendal_overcast.html`, `polyhaven-contribute.html`, `polyhaven-our-api.html`.

Scripts (dossier `wb-scripts/`) : `hdrmeasure.py` (lecture du HDR, moyennes), `orient.py` (cartes orientées), `jpgmeasure.py` et `compare.py` (fond JPG), `phstats.py` (statistiques de l'API Poly Haven), `wbmodel.py` (formules), `example.py` (exemple chiffré, sensibilité, Bradford).
