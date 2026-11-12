# Dossier de sources « viseur-aides »

> Dossier de travail, écrit par un agent de Claude dans la nuit du 11 au 12 novembre 2026. **Pas encore relu à la source par un second agent** : la vérification indépendante prévue a été coupée par la limite d'usage. Avant de s'appuyer sur un fait, relire la citation à l'adresse donnée. Les pages brutes citées (`pages/…`) étaient sur la machine de Claude et ne sont pas dans le dépôt : les manuels ne sont pas sous licence libre.
>
> Section 1 (grilles de cadrage) relue à la source le 12 novembre 2026 par l'agent qui a mis en œuvre la version 0.3.56 : pages rechargées aux adresses données, citations retrouvées mot pour mot, illustration du D5600 identique, recherche en texte intégral refaite sur la copie de travail du manuel du Z 6 (« third » n'y apparaît que dans « third-party » et « a third time ») ; rien à corriger. Deux ajouts : la page française du guide de l'A6000 (même adresse avec `/fr/`) répond 404 ; les lignes de l'illustration du D5600 sont mesurées dans `docs/camera-physique.md`. Les sections 2 à 8 restent à relire.

Aides affichées dans le viseur et à la lecture : grilles de cadrage, histogramme en prise de vue, histogramme à la lecture, hautes lumières (lecture et prise de vue), horizon virtuel. Notions du référentiel : CMP-02 (tiers, centre, symétrie ; simulateur « Grilles superposables »), CMP-04 (horizon ; « Rotation du cadre et niveau »), MES-06 (histogramme ; « Histogramme en direct et après la prise, relié aux zones de l'image »), MES-07 (alertes de surexposition et zébras ; « Clignotement et zébras réglables »).

- Date de lecture de toutes les pages : 2026-11-11 (UTC, `date -u +%F`).
- Pages brutes : `pages/viseur-aides/` (les noms de fichiers cités plus bas sont dans ce dossier).
- Contrôle des citations : `va-scripts/quotes.py` cherche chaque citation dans le texte de la page enregistrée (espaces normalisés) ; 98 citations, 0 absente.
- Rien n'est écrit de mémoire. Ce qu'une page ne dit pas est noté « le manuel ne le dit pas » ; ce que je n'ai pas pu lire est noté « Je ne sais pas ».
- Une illustration n'est pas un texte : quand je décris une image du manuel, je l'écris (« illustration »), avec le fichier de l'image.

## 0. Manuels trouvés, manuels introuvables

| Boîtier | Manuel officiel sur un hôte autorisé | État |
|---|---|---|
| Nikon Z 6 | Nikon, « Z 7/Z 6 Online Manual », `https://onlinemanual.nikonimglib.com/z7_z6/en/` (et `/fr/`) | Lu. Copie de travail des 249 pages du manuel anglais dans `z6-manuel-complet/`, pour les recherches en texte intégral. La page ne porte pas de date ; le manuel couvre le microprogramme « C » 3.30 (`z6-15_changes_made_via_firmware_updates_02.html`). |
| Sony A7 III (ILCE-7M3) | Sony, « Help Guide », `https://helpguide.sony.net/ilc/1720/v1/en/` (et `/fr/`), numéro de manuel 4-732-947-18(2), « Copyright 2018 Sony Corporation » | Lu (pages HTML et `print.pdf`, 683 pages, fichier `a7iii-print.pdf`). |
| Canon EOS RP | Aucun | Introuvable. `cam.start.canon` ne liste pas l'EOS RP (liste des modèles dans `canon-top_common.js` : EOS-1D X Mark III, 850D, R5, R6, M50 Mark II, R3, R7, R10, R6 Mark II, R50, R8, R100, R5 Mark II, R1, R50 V, etc.). `www.canon.co.uk` répond « Access Denied » (403, `canon-uk-eos-rp-refus.html`). `www.dpreview.com` répond 403 (page de contrôle « Just a moment... »), non lu. |
| Nikon D5600 | Pas de manuel lisible ; une page Nikon « Digitutor » | Le « Download Center » liste « Reference Manual, English, 21.39 MB » (`nikon-dc-d5600.html`, `https://downloadcenter.nikonimglib.com/en/products/351/D5600.html`), mais le téléchargement passe par `crossgate.nikonimglib.com`, hôte non autorisé (refus 403 du proxy). `https://onlinemanual.nikonimglib.com/d5600/en/` répond 404. Seule page officielle lue : Digitutor, grille en visée écran (voir 1.4). |
| Sony A6000 (ILCE-6000) | Sony, « Help Guide », `https://helpguide.sony.net/gbmig/45349331/v1/en/`, numéro de manuel 4-534-933-11(2), « Copyright 2014 Sony Corporation » | Lu (pages HTML). Attention : `https://helpguide.sony.net/ilc/1410/v1/en/` est le guide de l'ILCA-77M2, pas de l'A6000. |
| Canon EOS 2000D | Aucun | Introuvable : absent de la liste de `cam.start.canon` ; `www.canon.co.uk` refuse la lecture. |

Pour Canon, j'ai lu deux manuels voisins sur `cam.start.canon` (EOS R6 et EOS 850D). Ce ne sont ni l'EOS RP ni l'EOS 2000D : ils ne sourcent rien pour ces deux boîtiers. Ils sont en section 6, à part.

## 1. Grilles de cadrage

### 1.1 Nikon Z 6

Source A — Nikon, « Z 7/Z 6 Online Manual », page « d9: Framing Grid Display », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_d09.html`, fichier `z6-09_menu_guide_05_d09.html`.
- Nom exact du réglage : « d9: Framing Grid Display » (groupe « d: Shooting/display » des réglages personnalisés, menu « Custom Settings »).
- Citation (texte complet de la page) : « Choose On to display a grid for reference when framing shots. »
- Le manuel ne décrit pas la grille : ni nombre de lignes, ni choix de type. Recherche en texte intégral sur les 249 pages (`z6-manuel-complet/`) : aucune mention de tiers, de « 3×3 » ou de « 4×4 », aucune illustration de la grille.

Source B — version française, « d9 : Affichage du quadrillage », `https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_05_d09.html`, fichier `z6-fr-09_menu_guide_05_d09.html`.
- Citation : « Choisissez Activé pour afficher un quadrillage de référence lors du cadrage des images. »

Source C — « Defaults », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html`, fichier `z6-09_menu_guide_01.html`.
- Réglage par défaut : ligne « d9 / Framing grid display / Off » du tableau « Custom Settings Menu Defaults ».

Source D — « f2: Custom Control Assignment », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_f02.html`, fichier `z6-09_menu_guide_05_f02.html`.
- La grille peut être attribuée à une commande : « Framing grid display » : « Press the control to turn the framing grid display on or off. »

### 1.2 Sony A7 III

Source — Sony, « Help Guide » ILCE-7M3, page « Grid Line », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653165.html`, fichier `a7iii-grid-line-TP0001653165.html` (même texte dans `a7iii-print.pdf`, page 308).
- Nom exact : « Grid Line », chemin « MENU → (Camera Settings2) → [Grid Line] → desired setting ».
- Citation : « Sets whether the grid line is displayed or not. The grid line will help you to adjust the composition of images. »
- Types proposés, avec le texte du manuel :
  - « Rule of 3rds Grid » : « Place main subjects close to one of the grid lines that divide the image into thirds for a well-balanced composition. »
  - « Square Grid » : « Square grids make it easier to confirm the horizontal level of your composition. »
  - « Diag. + Square Grid » : « Place a subject on the diagonal line to express an uplifting and powerful feeling. »
  - « Off » : « Does not display the grid line. »
- La page n'a pas d'illustration des grilles et ne donne ni le nombre de cases de « Square Grid » ni le tracé des diagonales. Elle ne marque pas de réglage par défaut.

Version française — « Quadrillage », `https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001663039.html`, fichier `a7iii-fr-grid-line-TP0001663039.html`.
- Noms français : « Quadrillage » ; « Grille règle des tiers », « Grille carrée », « Diag. + Grille carrée », « OFF ».
- Citation : « Active/désactive l'affichage du quadrillage. Le quadrillage vous aide à ajuster la composition des images. »

### 1.3 Sony A6000

Source — Sony, « Help Guide » ILCE-6000, page « Grid Line », `https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000518347.html`, fichier `a6000-grid-line-TP0000518347.html`.
- Nom exact : « Grid Line », chemin « MENU → (Custom Settings) → [Grid Line] → desired setting ».
- Mêmes trois types et mêmes textes que l'A7 III : « Rule of 3rds Grid », « Square Grid », « Diag. + Square Grid ».
- Réglage par défaut donné : « Off (default setting): Does not display the grid line. »

### 1.4 Nikon D5600

Source — Nikon, « Digitutor », D5600, page « Framing Grid (Live View) », `https://imaging.nikon.com/imaging/support/digitutor/d5600/functions/framing_grid_liveview.html`, fichier `d5600-digitutor-framing-grid-liveview.html` (pied de page « © 2025 Nikon Corporation »). C'est une page d'aide de Nikon, pas le manuel.
- Citation : « To start live view, rotate the live view switch during viewfinder photography. » ; la page ajoute qu'une commande (icône non rendue en texte) fait défiler les affichages, dont les légendes sont : « Show detailed photo indicators », « Show movie indicators », « Hide indicators », « Framing grid », « Show basic photo indicators ».
- Illustration « Framing grid » (`d5600-digitutor-img-framing_grid-04.jpg`) : trois lignes verticales et trois lignes horizontales, soit seize cases. C'est ma lecture de l'image ; le texte ne donne pas ce nombre.
- Grille dans le viseur optique du D5600 : Je ne sais pas (manuel non lisible).

### 1.5 Canon EOS RP, Canon EOS 2000D

Je ne sais pas : aucun manuel lisible sur les hôtes autorisés. Voir la section 6 pour deux manuels voisins.

## 2. Histogramme en prise de vue

### 2.1 Nikon Z 6

Source A — « Camera Controls », section « The DISP Button », `https://onlinemanual.nikonimglib.com/z7_z6/en/02_getting_to_know_the_camera_02.html`, fichier `z6-02_getting_to_know_the_camera_02.html`.
- Comment on l'affiche : « Use the DISP button to view or hide indicators in the monitor or viewfinder. » ; « In photo mode, pressing the DISP button cycles the display as follows: », avec, dans l'ordre des vignettes de la page : « Indicators on », « Simplified display », « Histogram » (note 1), « Virtual horizon », « Information display » (note 2), « Flash info » (notes 2 et 3).
- Note 1 : « Not displayed when Off is selected for Custom Setting d8 (Apply settings to live view) or On is selected for Overlay shooting in multiple exposure mode. »
- Note 2 : « Not displayed in the viewfinder. » Elle porte sur « Information display » et « Flash info », pas sur l'histogramme.
- Ce qu'il représente : le manuel ne le dit pas pour la prise de vue (luminance ou couches RVB). Illustration (`z6-img-z7_MT_LV_TR_ExpPre_Hist.png`) : une seule courbe blanche dans un cadre sombre divisé par trois traits verticaux, en bas à droite de l'image, au-dessus de la ligne des réglages.

Source B — version française, « Commandes de l'appareil photo », `https://onlinemanual.nikonimglib.com/z7_z6/fr/02_getting_to_know_the_camera_02.html`, fichier `z6-fr-02_getting_to_know_the_camera_02.html`.
- Noms français de la suite : « Indicateurs activés », « Affichage simplifié », « Histogramme », « Horizon virtuel », « Affichage des informations ».

Source C — « d8: Apply Settings to Live View », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_d08.html`, fichier `z6-09_menu_guide_05_d08.html`.
- Citation : « Choose On to preview how changes to such settings as white balance, Picture Controls, and exposure compensation affect color and brightness in photo mode ».
- Par défaut : ligne « d8 / Apply settings to live view / On » (`z6-09_menu_guide_01.html`).

### 2.2 Sony A7 III

Source A — « Switching the screen display (while shooting/during playback) », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html`, fichier `a7iii-switching-display-TP0001653116.html` (PDF pages 49 et 50).
- Comment on l'affiche, bouton DISP : « During shooting (Monitor) » : « Display All Info. → No Disp. Info. → Histogram → Level → For viewfinder → Display All Info. » ; « During shooting (Viewfinder) » : « Level → No Disp. Info. → Histogram → Level ».
- Ce qu'il représente : « A histogram shows the luminance distribution, displaying how many pixels there are by luminance. It shows darker toward the left and brighter toward the right. »
- « The histogram changes depending on the exposure compensation. »
- « A peak at the right or left end of the histogram indicates that the image has an overexposed or underexposed area, respectively. »
- Sur quoi il est calculé : « The information in the histogram display does not indicate the final photograph. It is information about image displayed on the screen. »
- Écart avec la lecture : « The histogram display is extremely different between shooting and playback in the following cases: » (flash ; sujet peu lumineux, comme une scène de nuit).
- Illustration (`a7iii-img-p_disp_monitor_2.png`) : une seule courbe, en bas à droite de l'écran.

Source B — « DISP Button (Monitor/Finder) », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653118.html`, fichier `a7iii-disp-button-TP0001653118.html` (PDF page 52).
- « Histogram : Displays the luminance distribution graphically. »

Version française (`a7iii-fr-switching-display-TP0001662878.html`, `https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001662878.html`) : « Afficher ttes infos », « Pas d'info affich », « Histogramme », « Niveau », « Pour le viseur ».

### 2.3 Sony A6000

Source A — « Switching the screen display (Shooting) », `https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000518212.html`, fichier `a6000-switching-display-shooting-TP0000518212.html`.
- Suite du bouton DISP : « Graphic Display → Display All Info. → No Disp. Info. → Histogram → For viewfinder* → Graphic Display ».
- « Some display modes are not available in the default settings. » (la page ne dit pas lesquels).
- « Histogram is not displayed during panorama shooting. »

Source B — « DISP Button (Finder) » et « DISP Button (Monitor) », `…/contents/TP0000518214.html` et `…/contents/TP0000518215.html`, fichiers `a6000-disp-button-finder-TP0000518214.html` et `a6000-disp-button-monitor-TP0000518215.html`.
- « Histogram: Displays the luminance distribution graphically. »

### 2.4 Nikon D5600, Canon EOS RP, Canon EOS 2000D

Je ne sais pas. La page Digitutor du D5600 (1.4) liste les affichages de la visée écran sans histogramme, mais elle n'est pas le manuel : je n'en conclus rien.

## 3. Histogramme à la lecture

### 3.1 Nikon Z 6

Source A — « Photo Information », `https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html`, fichier `z6-08_more_about_playback_02.html`.
- « Photo information is superimposed on images displayed in full-frame playback. » ; on fait défiler les pages avec le sélecteur (haut, bas) ou « press the DISP button to cycle through photo information as shown below. »
- Pages, dans l'ordre du schéma : « 1 File information », « 2 None (image only) », « 3 Overview data », « 4 Location data », « 5 Shooting data », « 6 RGB histogram », « 7 Highlights », « 8 Exposure data ».
- Les pages 2, 3, 5, 6, 7 et 8 portent la note : « Displayed only if the corresponding option is selected for Playback display options in the playback menu. »
- Page « RGB Histogram », légendes : « Histogram (RGB channel) », « Histogram (red channel) », « Histogram (green channel) », « Histogram (blue channel) ». Illustration (`z6-img-z7_MTR_PB_Info2_Add.png`) : la photo en vignette à gauche, quatre histogrammes empilés à droite, dans cet ordre de haut en bas. Le manuel ne définit pas « RGB channel » (il n'écrit pas « luminance »).
- Page « Overview Data » : un élément « Histogram » (légende 8) ; illustration (`z6-img-z7_photo_information01_eu.png`, écran 3) : un seul histogramme à droite de la vignette.
- Définition : « Histograms show tone distribution, with pixel brightness (tone) plotted on the horizontal axis and the number of pixels on the vertical axis. »
- Limite annoncée : « Camera histograms are intended as a guide only and may differ from those displayed in imaging applications. »
- Lecture : « If the image is dark, tone distribution will be shifted to the left. » ; « If the image is bright, tone distribution will be shifted to the right. » ; « Increasing exposure compensation shifts the distribution of tones to the right, while decreasing exposure compensation shifts the distribution to the left. »
- Loupe : quand on agrandit la photo avec l'histogramme affiché, « The histogram will be updated to show only the data for the portion of the image visible in the display. »

Source B — « Playback Display Options », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_02_03.html`, fichier `z6-09_menu_guide_02_03.html` (français : « Options de visualisation », `z6-fr-09_menu_guide_02_03.html`).
- « Choose the information available in the playback photo information display. »
- La page « Defaults » (`z6-09_menu_guide_01.html`) ne donne pas de valeur par défaut pour « Playback display options » : je ne sais pas quelles pages sont cochées à la sortie d'usine.

Source C — « f3: OK Button », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_f03.html`, fichier `z6-09_menu_guide_05_f03.html`.
- Option « View histograms » du mode lecture : « In both full-frame and thumbnail playback, a histogram is displayed while the J button is pressed. » (« J » est le rendu en texte de l'icône de la commande OK.)

Source D — « Specifications », `https://onlinemanual.nikonimglib.com/z7_z6/en/14_technical_notes_06.html`, fichier `z6-14_technical_notes_06.html`.
- Ligne « Playback » : « […] histogram display, highlights, photo information […] ».

Noms français (`z6-fr-08_more_about_playback_02.html`, `https://onlinemanual.nikonimglib.com/z7_z6/fr/08_more_about_playback_02.html`, « Informations sur les photos ») : « Aperçu des données », « Histogramme RVB », « Hautes lumières », « Données d'exposition » ; « Histogramme (canal RVB) », « Histogramme (canal rouge) », « Histogramme (canal vert) », « Histogramme (canal bleu) ».

### 3.2 Sony A7 III

Source A — même page « Switching the screen display » (`a7iii-switching-display-TP0001653116.html`).
- « During playback (Monitor/Viewfinder) » : « Display Info. → Histogram → No Disp. Info. → Display Info. »
- « The settings for playback are also applied in [Auto Review]. »

Source B — « List of icons on the monitor », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667671.html`, fichier `a7iii-icones-TP0001667671.html` (PDF pages 47 et 48).
- Écran de lecture « Histogram display », zone 4 : « Histogram (Luminance/R/G/B) ». Illustrations (`a7iii-img-p_iconlist_cx62000_05.png`, `a7iii-img-p_disp_playback_2.png`) : vignette de la photo et quatre histogrammes empilés à droite.

Source C — « Auto Review », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001629729.html`, fichier `a7iii-auto-review-TP0001629729.html`.
- « The DISP (Display Setting) settings are applied for the Auto Review display. »

### 3.3 Sony A6000

Source — « Switching the screen display (during playback) », `https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000508292.html`, fichier `a6000-switching-display-playback-TP0000508292.html`.
- « Display Info. → Histogram → No Disp. Info. → Display Info. »
- « The DISP (Display Setting) settings are applied for the Auto Review display. »
- La page ne dit pas ce que l'histogramme de lecture contient (luminance, couches).

### 3.4 Nikon D5600, Canon EOS RP, Canon EOS 2000D

Je ne sais pas.

## 4. Hautes lumières

### 4.1 À la lecture

Nikon Z 6 — page « Photo Information » (`z6-08_more_about_playback_02.html`), page d'information « Highlights ».
- Légende : « Highlights (areas that may be overexposed) » ; en français « Hautes lumières (zones susceptibles d'être surexposées) » (`z6-fr-08_more_about_playback_02.html` ; l'apostrophe de la page est typographique).
- Illustration (`z6-img-z7_MTR_PB_Info9_Add.png`) : une zone de l'image entourée d'un trait pointillé.
- Le manuel n'écrit pas que ces zones clignotent : le mot « blink » n'apparaît dans aucune des 249 pages pour cet affichage. Il ne donne pas non plus le seuil à partir duquel une zone est signalée.

Sony A7 III — page « Switching the screen display » (`a7iii-switching-display-TP0001653116.html`), à propos de l'affichage « Histogram » en lecture.
- « If the image has an overexposed or underexposed area, the corresponding section will blink on the histogram display (overexposed/underexposed warning). »
- En français (`a7iii-fr-switching-display-TP0001662878.html`) : « Si l'image présente des zones surexposées ou sous-exposées, la partie correspondante clignote sur l'affichage de l'histogramme (avertissement surexposition/sous-exposition). » (apostrophes typographiques dans la page).
- L'alerte porte donc sur les zones surexposées et sur les zones sous-exposées. Le seuil n'est pas donné.

Sony A6000 — les pages lues (`a6000-switching-display-playback-TP0000508292.html`, `a6000-icones-TP0000522399.html`) ne parlent pas d'un clignotement. Je ne sais pas.

Nikon D5600, Canon EOS RP, Canon EOS 2000D — Je ne sais pas.

### 4.2 À la prise de vue (zébrures)

Nikon Z 6 — « g6: Highlight Display », `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_g06.html`, fichier `z6-09_menu_guide_05_g06.html`. Le réglage est dans le groupe « g: Movie » des réglages personnalisés.
- « Choose whether shading is used to indicate highlights (bright areas of the frame) and select the level of brightness needed to trigger the highlight display. »
- « Display pattern: To enable the highlight display, select Pattern 1 or Pattern 2. »
- « Highlight display threshold: Choose the brightness needed to trigger the movie highlight display. The lower the value, the greater the range of brightnesses that will be shown as highlights. If 255 is selected, the highlight display will show only areas that are potentially overexposed. »
- « If both the highlight display and peaking highlights are enabled, only peaking highlights will be displayed in manual focus mode. »
- Par défaut (`z6-09_menu_guide_01.html`) : « g6 / Highlight display / Display pattern : Off / Highlight display threshold : 248 ».
- Illustration (`z6-img-z7_g6_highlight_display.png`) : des hachures obliques sur la zone claire, deux motifs.
- En français (`z6-fr-09_menu_guide_05_g06.html`, `https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_05_g06.html`) : « g6 : Affichage des hautes lumières » ; « Choisissez si des hachures sont utilisées pour indiquer les hautes lumières (zones claires de la vue) et sélectionnez la plage des luminosités affichées comme hautes lumières. » ; « Modèle 1 », « Modèle 2 », « Seuil affichage hautes lumières ».
- En mode photo : le manuel ne documente aucun affichage des hautes lumières à la prise de vue. « Highlight display » figure dans la liste du menu i du mode vidéo (« g1: Customize i Menu », `z6-09_menu_guide_05_g01.html` : « Choose the options displayed in the i menu for movie mode. ») et pas dans celle du mode photo (« f1: Customize i Menu », `z6-09_menu_guide_05_f01.html` : « Choose the options displayed in the i menu for photo mode. »). Le mot « zebra » n'apparaît dans aucune des 249 pages. La liste complète des valeurs du seuil n'est pas donnée (seules 248 et 255 sont citées).

Sony A7 III — « Zebra Setting », `https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667679.html`, fichier `a7iii-zebra-TP0001667679.html` (PDF page 185).
- Chemin : « MENU → (Camera Settings2) → [Zebra Setting] → desired setting ».
- « Sets a zebra pattern, which appears over part of an image if the brightness level of that part meets the IRE level that you have set. »
- Deux éléments : « Zebra Display: Sets whether to display the zebra pattern. » ; « Zebra Level: Adjusts the brightness level of the zebra pattern. »
- « To check the overexposure, set a minimum value for the brightness level. The zebra pattern will appear over areas with a brightness level equal to or higher than the value you set. »
- « The zebra pattern is not displayed on devices connected via HDMI. »
- La page ne liste pas les valeurs de « Zebra Level » et ne dit pas si le motif s'affiche en photo comme en vidéo. Le guide ne définit pas l'échelle IRE.
- En français (`a7iii-fr-zebra-TP0001667947.html`) : « Régl. zebra », « Affichage zebra », « Niveau zebra ».

Sony A6000 — « Zebra », `https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000508219.html`, fichier `a6000-zebra-TP0000508219.html`.
- « The zebra pattern will appear over the part of an image if the brightness level exceeds the IRE that you set. »
- Valeurs : « Off (default setting): Does not display the zebra pattern. » ; « 70/75/80/85/90/95/100/100+ : Adjusts the brightness level. »

Nikon D5600, Canon EOS RP, Canon EOS 2000D — Je ne sais pas.

## 5. Horizon virtuel

### 5.1 Nikon Z 6

Source — « Camera Controls », section « The DISP Button » (`z6-02_getting_to_know_the_camera_02.html`).
- « Virtual horizon » est l'un des affichages du bouton DISP, en mode photo comme en mode vidéo ; en français « Horizon virtuel » (`z6-fr-02_getting_to_know_the_camera_02.html`).
- Aucune note ne l'exclut du viseur (la note « Not displayed in the viewfinder. » porte sur deux autres affichages).
- Le manuel ne décrit pas l'indicateur : ni ce qu'il mesure (roulis, tangage), ni ses couleurs, ni sa précision. Recherche en texte intégral : « horizon » n'apparaît que dans cette liste ; « roll » et « pitch » n'apparaissent pas pour cet affichage.
- Illustration (`z6-img-z7_MT_LV_TR_Vhorizon.png`) : un cercle gradué au centre de l'image, traversé par un trait horizontal.

### 5.2 Sony A7 III

Source — « DISP Button (Monitor/Finder) » (`a7iii-disp-button-TP0001653118.html`).
- Nom : « Level » ; en français « Niveau ». La liste des icônes l'appelle « Digital level gauge » (`a7iii-icones-TP0001667671.html`).
- « Indicates whether the product is level in both the front-back (A) and horizontal (B) directions. When the product is level in either direction, the indicator turns to green. »
- « If you tilt the product forward or backward by a large degree, the level error will be great. »
- « The product may have a margin of error of almost ±1° even when the inclination is corrected by the level. »
- Illustration (`a7iii-img-p_disp_level.png`) : repère central (A) et deux repères latéraux (B).
- Écart entre les versions : la page française (`a7iii-fr-disp-button-TP0001662879.html`) dit « Lorsque le produit est de niveau dans les deux directions, l'indicateur devient vert. », là où l'anglais dit « in either direction ». Je ne sais pas laquelle décrit l'appareil.
- Affichage : dans les suites du bouton DISP, à l'écran et dans le viseur (voir 2.2).

### 5.3 Sony A6000

Les pages « DISP Button (Finder) », « DISP Button (Monitor) » et « Switching the screen display (Shooting) » ne listent aucun affichage « Level » ; la liste des rubriques (`a6000-contentslist01.html`) non plus. Le guide ne documente donc pas de niveau électronique pour ce boîtier ; je n'affirme pas davantage.

### 5.4 Nikon D5600, Canon EOS RP, Canon EOS 2000D

Je ne sais pas.

## 6. Canon : deux manuels voisins (ni l'EOS RP ni l'EOS 2000D)

Ces pages donnent le vocabulaire de Canon sur deux autres boîtiers. Elles ne prouvent rien pour l'EOS RP ni pour l'EOS 2000D.

Canon EOS R6 (hybride), Canon, « Product Manual », `https://cam.start.canon/en/C004/manual/html/` (« © CANON INC. 2024 ») :
- « Shooting Information Display », `…/UG-03_Shooting-1_0360.html`, fichier `canon-r6-shooting-info-display-UG-03_Shooting-1_0360.html` : « A grid can be displayed on the screen and viewfinder. » (réglage « Grid display » sous « Shooting info. disp. ») ; capture d'écran du manuel (`canon-r6-img-UG-03_s1730-grid-options.png`) : « Off », « 3x3 », « 6x4 », « 3x3+diag ». Histogramme de prise de vue : « You can select the content and display size of the histogram. », contenu « Brightness » ou « RGB », taille « Large » ou « Small » (réglage « Histogram disp »).
- « Displaying the Highlight Alert », `…/UG-05_Playback_0280.html`, fichier `canon-r6-highlight-alert-UG-05_Playback_0280.html` : « You can specify blinking display of overexposed highlights on the playback screen. » (réglage « Highlight alert », « Enable »).
- « Customizing Playback Information Display », `…/UG-05_Playback_0270.html`, fichier `canon-r6-playback-info-UG-05_Playback_0270.html` : « Brightness display (for checking the general exposure level and overall gradation) and RGB display (for checking saturation and gradation of red, green, and blue) are available. »

Canon EOS 850D (reflex), Canon, « Product Manual », `https://cam.start.canon/en/C002/manual/html/` (« © CANON INC. 2020 ») :
- « Grid Display When Shooting », `…/UG-09_Set-up_0200.html`, fichier `canon-850d-grid-display-UG-09_Set-up_0200.html` : réglage « Grid when shooting », en visée écran ; « Off », « 3x3 », « 6x4 », « 3x3+diag » ; « Displays grid lines in a 3x3 pattern to help you level the camera vertically and horizontally. »
- « Viewfinder Display », `…/UG-09_Set-up_0180.html`, fichier `canon-850d-viewfinder-display-UG-09_Set-up_0180.html` : niveau électronique et grille dans le viseur optique ; « Only horizontal tilt can be checked. (Forward/backward tilt is not displayed.) »
- « Histogram », `…/UG-07_Playback_0280.html`, fichier `canon-850d-histogram-UG-07_Playback_0280.html` : « The brightness histogram shows the exposure level distribution and overall brightness. The RGB histogram is for checking the color saturation and gradation. »

## 7. Ce qui n'est pas sourcé

1. Canon EOS RP et Canon EOS 2000D : rien, sur aucun des cinq points. Manuels introuvables sur les hôtes autorisés.
2. Nikon D5600 : rien d'autre que l'affichage « Framing grid » de la visée écran (page Digitutor). Pas d'histogramme, pas de hautes lumières, pas d'horizon virtuel, pas de grille du viseur optique.
3. Nikon Z 6, grille : le tracé (nombre de lignes, tiers ou non). Le manuel ne dit que « a grid ».
4. Nikon Z 6, histogramme de prise de vue : ce qu'il représente (luminance ou couches). Le manuel ne le dit pas ; l'illustration montre une seule courbe.
5. Nikon Z 6, lecture : la définition de « Histogram (RGB channel) » ; les pages cochées par défaut dans « Playback display options » ; le clignotement de la page « Highlights » ; le seuil de cette page.
6. Nikon Z 6, prise de vue en mode photo : aucun affichage des hautes lumières n'est documenté. Les valeurs possibles du seuil du mode vidéo, hors 248 et 255.
7. Nikon Z 6, horizon virtuel : ce que l'indicateur mesure, ses couleurs, sa précision.
8. Sony A7 III : le nombre de cases de « Square Grid » et le tracé des diagonales ; le réglage par défaut de « Grid Line » ; les valeurs de « Zebra Level » ; le seuil du clignotement en lecture ; lequel des deux textes (anglais, français) décrit le passage au vert du niveau.
9. Sony A6000 : le contenu de l'histogramme de lecture ; une alerte clignotante en lecture ; les affichages absents par défaut du bouton DISP.
10. Pour tous les boîtiers : le calcul de l'histogramme (formule de la luminance, nombre de colonnes, échelle verticale, image de départ) ; la correspondance entre l'échelle IRE de Sony et une valeur de pixel ; le fait, jamais écrit dans les pages lues, que la grille n'est pas enregistrée dans la photo.

## 8. Proposition pour TutoPhoto

À trancher par Julien. Chaque ligne dit ce qui est fidèle à un manuel et ce qui serait un choix de TutoPhoto.

### 8.1 Grilles (CMP-02)

- Réglage par boîtier, avec le nom du constructeur :
  - Nikon Z 6 : « d9: Framing grid display » / « d9 : Affichage du quadrillage », deux valeurs, activé ou désactivé, désactivé par défaut. Sourcé.
  - Sony A7 III et A6000 : « Grid Line » / « Quadrillage », quatre valeurs : « Rule of 3rds Grid » / « Grille règle des tiers », « Square Grid » / « Grille carrée », « Diag. + Square Grid » / « Diag. + Grille carrée », « Off » / « OFF » ; « Off » par défaut sur l'A6000 (non donné pour l'A7 III). Sourcé. Les noms français viennent du guide de l'A7 III ; je n'ai pas lu le guide français de l'A6000.
- Tracés :
  - « Rule of 3rds Grid » : deux lignes verticales et deux lignes horizontales aux tiers. Fidèle au texte de Sony (« grid lines that divide the image into thirds »).
  - Grille du Z 6, « Square Grid », diagonales : tracé non sourcé. Deux voies : ne pas les proposer tant que le tracé n'est pas relevé sur un boîtier ou une capture officielle ; ou les tracer et dire dans l'interface « tracé de TutoPhoto, le manuel ne le décrit pas ». Indice, pour un autre boîtier Nikon : l'illustration Digitutor du D5600 montre trois lignes dans chaque sens.
- Conséquence pour CMP-02 : sur le boîtier par défaut (Z 6), aucune grille des tiers n'est sourcée. Si la notion a besoin des tiers, une « grille des tiers de TutoPhoto » serait une aide pédagogique à présenter comme telle, pas comme une fonction du Z 6.
- À dire à l'utilisateur : la grille est une aide de cadrage (« for reference when framing shots ») ; qu'elle n'apparaît pas sur la photo est un comportement de TutoPhoto que les pages lues n'écrivent pas.
- EOS RP, D5600, EOS 2000D : pas de grille sourcée. Le panneau peut afficher « non documenté pour ce boîtier ».

### 8.2 Histogramme en prise de vue (MES-06)

- Accès fidèle : un bouton « DISP » qui fait défiler les affichages.
  - Z 6, mode photo : « Indicators on » → « Simplified display » → « Histogram » → « Virtual horizon » (puis « Information display », hors viseur).
  - A7 III, viseur : « Level » → « No Disp. Info. » → « Histogram » ; écran : « Display All Info. » → « No Disp. Info. » → « Histogram » → « Level » → « For viewfinder ».
  - A6000 : « Graphic Display » → « Display All Info. » → « No Disp. Info. » → « Histogram » → « For viewfinder ».
- Contenu : une seule courbe. Luminance pour Sony (sourcé) ; non précisé pour le Z 6 (l'illustration montre une seule courbe).
- Calcul sur l'image du viseur : conforme à Sony (« It is information about image displayed on the screen »). C'est le principe déjà noté dans `docs/camera-physique.md`.
- Lien avec l'interrupteur « Aperçu des réglages » de TutoPhoto : sur le Z 6, l'histogramme n'est pas affiché quand « d8: Apply settings to live view » est sur « Off ». Proposition : avec le Z 6, masquer l'histogramme quand l'aperçu général est coupé.
- Place : en bas à droite du cadre (illustrations du Z 6 et de l'A7 III).
- À dire comme non simulé ou choisi : la formule de la luminance, le nombre de colonnes et l'échelle sont des choix de TutoPhoto, à expliquer ; Nikon prévient lui-même que « Camera histograms are intended as a guide only ». L'aperçu de TutoPhoto n'a pas de courbe de tons, celui d'un boîtier applique ses réglages d'image (« Picture Controls ») : les deux histogrammes ne peuvent pas coïncider.

### 8.3 Histogramme à la lecture (MES-06)

- Z 6 : des pages d'information que l'on fait défiler (haut, bas ou DISP). À reprendre : « Overview data » (vignette, un histogramme, réglages), « RGB histogram » (vignette et quatre histogrammes : « RGB channel », rouge, vert, bleu), « Highlights », « Exposure data », « None (image only) ». Un réglage « Playback display options » choisit les pages affichées.
- Z 6, loupe : quand la photo est agrandie, l'histogramme ne porte que sur la partie visible. TutoPhoto a déjà une loupe sur l'écran de revue : comportement à reprendre.
- Sony : « Display Info. » → « Histogram » → « No Disp. Info. » ; l'affichage « Histogram » montre la vignette et quatre histogrammes « Luminance/R/G/B ». Le même réglage s'applique à l'affichage qui suit la prise (« Auto Review »).
- Textes pour la fiche MES-06, sourcés : axe horizontal, la luminosité ; axe vertical, le nombre de pixels ; image sombre, courbe à gauche ; image claire, courbe à droite ; la correction d'exposition déplace la courbe ; un pic à une extrémité signale une zone surexposée ou sous-exposée (Sony).
- Non sourcé : la définition du premier histogramme du Z 6 (« RGB channel »). L'afficher sous ce nom sans l'appeler « luminance », ou dire le calcul retenu.

### 8.4 Hautes lumières (MES-07)

- Lecture, Z 6 : une page « Highlights » / « Hautes lumières » qui marque les « areas that may be overexposed ». Clignotement non écrit dans le manuel du Z 6 ; écrit pour Sony (« will blink »), pour les zones surexposées et sous-exposées. Proposition : clignotement avec les boîtiers Sony ; avec le Z 6, marquer les zones et dire que le manuel ne précise pas l'animation, ou attendre un relevé sur un boîtier.
- Seuil à la lecture : non sourcé. Seule valeur écrite par Nikon, pour l'affichage vidéo : à 255, « only areas that are potentially overexposed ». Proposition : une zone est signalée quand un pixel atteint le maximum (255 sur 8 bits) dans l'image finale ; le dire comme choix de TutoPhoto, appuyé sur cette phrase.
- Prise de vue :
  - Z 6 : rien en mode photo dans le manuel. Ne pas proposer de zébrures avec le Z 6 en photo, et le dire (« le Z 6 ne documente cet affichage qu'en vidéo : g6, Highlight display, motifs 1 et 2, seuil 248 par défaut »).
  - A6000 : « Zebra », valeurs « Off », 70, 75, 80, 85, 90, 95, 100, 100+ ; désactivé par défaut. Sourcé.
  - A7 III : « Zebra Setting », « Zebra Display » et « Zebra Level » ; valeurs non listées.
  - Non sourcé : la conversion d'un niveau IRE en valeur de pixel. Sans elle, des zébrures réglables ne seraient pas fidèles ; à sourcer avant de produire.

### 8.5 Horizon virtuel (CMP-04)

- Z 6 : affichage « Virtual horizon » / « Horizon virtuel » du bouton DISP, sans description. A7 III : « Level » / « Niveau », deux directions (avant-arrière, horizontale), indicateur vert quand l'appareil est de niveau, marge d'erreur de près de ±1°. A6000 : pas de niveau documenté.
- Dans TutoPhoto, la caméra est une `UniversalCamera` (`app/src/scene.ts`) sans roulis : l'indicateur horizontal serait toujours de niveau. Proposition : ne pas l'ajouter tant que le roulis n'existe pas (CMP-04 demande « Rotation du cadre et niveau ») ; le jour où il existe, reprendre le modèle de Sony, seul décrit, et ne pas afficher de valeur plus fine que ±1°.

### 8.6 Ordre proposé

1. Grilles : Sony d'abord (tiers sourcés), Z 6 en activé ou désactivé une fois le tracé tranché.
2. Histogramme de prise de vue par le bouton DISP, puis pages de lecture (un histogramme, puis quatre).
3. Page « Highlights » à la lecture ; clignotement pour Sony.
4. Zébrures et horizon virtuel : après avoir sourcé l'échelle IRE et ajouté le roulis.

## 9. Pages enregistrées

Toutes sous `pages/viseur-aides/`.

- Nikon Z 6 (anglais) : `z6-index.html`, `z6-02_getting_to_know_the_camera_02.html`, `z6-08_more_about_playback_01.html`, `z6-08_more_about_playback_02.html`, `z6-09_menu_guide_01.html`, `z6-09_menu_guide_02.html`, `z6-09_menu_guide_02_03.html`, `z6-09_menu_guide_02_04.html`, `z6-09_menu_guide_04.html`, `z6-09_menu_guide_05.html`, `z6-09_menu_guide_05_d08.html`, `z6-09_menu_guide_05_d09.html`, `z6-09_menu_guide_05_d10.html`, `z6-09_menu_guide_05_f01.html`, `z6-09_menu_guide_05_f02.html`, `z6-09_menu_guide_05_f03.html`, `z6-09_menu_guide_05_g01.html`, `z6-09_menu_guide_05_g02.html`, `z6-09_menu_guide_05_g06.html`, `z6-09_menu_guide_06.html`, `z6-09_menu_guide_06_12.html`, `z6-13_troubleshooting_01.html`, `z6-14_technical_notes_01.html`, `z6-14_technical_notes_06.html`, `z6-15_changes_made_via_firmware_updates_00.html` à `_02.html`, `z6-04_basic_photography_and_playback_01.html`, `z6-04_basic_photography_and_playback_03.html`, `z6-07_the_i_button_02.html`, `z6-digitutor-index.html` ; dossier `z6-manuel-complet/` (249 pages).
- Nikon Z 6 (français) : `z6-fr-02_getting_to_know_the_camera_02.html`, `z6-fr-08_more_about_playback_02.html`, `z6-fr-09_menu_guide_02_03.html`, `z6-fr-09_menu_guide_05_d09.html`, `z6-fr-09_menu_guide_05_g06.html`.
- Nikon Z 6 (illustrations du manuel, `https://onlinemanual.nikonimglib.com/z7_z6/en/img/…`) : `z6-img-z7_MT_LV_TR_ExpPre_Hist.png`, `z6-img-z7_MT_LV_TR_Vhorizon.png`, `z6-img-z7_g6_highlight_display.png`, `z6-img-z7_photo_information01_eu.png`, `z6-img-z7_MTR_PB_Info2_Add.png`, `z6-img-z7_MTR_PB_Info7_Add_EU.png`, `z6-img-z7_MTR_PB_Info9_Add.png`.
- Sony A7 III : `a7iii-index.html`, `a7iii-print.pdf`, `a7iii-grid-line-TP0001653165.html`, `a7iii-switching-display-TP0001653116.html`, `a7iii-disp-button-TP0001653118.html`, `a7iii-zebra-TP0001667679.html`, `a7iii-icones-TP0001667671.html`, `a7iii-auto-review-TP0001629729.html`, `a7iii-live-view-display-TP0001629730.html` ; français : `a7iii-fr-index.html`, `a7iii-fr-grid-line-TP0001663039.html`, `a7iii-fr-switching-display-TP0001662878.html`, `a7iii-fr-disp-button-TP0001662879.html`, `a7iii-fr-zebra-TP0001667947.html` ; illustrations (`https://helpguide.sony.net/ilc/1720/v1/en/contents/image/…`) : `a7iii-img-p_disp_monitor_2.png`, `a7iii-img-p_disp_finder_2.png`, `a7iii-img-p_disp_playback_2.png`, `a7iii-img-p_disp_level.png`, `a7iii-img-p_histogram.png`, `a7iii-img-p_iconlist_cx62000_04.png`, `a7iii-img-p_iconlist_cx62000_05.png`.
- Sony A6000 : `a6000-index.html`, `a6000-contentslist01.html`, `a6000-contentslist02.html`, `a6000-grid-line-TP0000518347.html`, `a6000-switching-display-shooting-TP0000518212.html`, `a6000-disp-button-finder-TP0000518214.html`, `a6000-disp-button-monitor-TP0000518215.html`, `a6000-zebra-TP0000508219.html`, `a6000-switching-display-playback-TP0000508292.html`, `a6000-icones-TP0000522399.html`.
- Nikon D5600 : `nikon-dc-d5600.html`, `d5600-digitutor-index.html`, `d5600-digitutor-framing-grid-liveview.html`, `d5600-digitutor-img-framing_grid-04.jpg`, `d5600-digitutor-setup2.html`.
- Canon : `canon-start.html`, `canon-top_common.js`, `canon-top_init.js`, `canon-uk-eos-rp-refus.html` ; EOS R6 : `canon-r6-index.html`, `canon-r6-shooting-info-display-UG-03_Shooting-1_0360.html`, `canon-r6-img-UG-03_s1730-grid-options.png`, `canon-r6-highlight-alert-UG-05_Playback_0280.html`, `canon-r6-playback-info-UG-05_Playback_0270.html`, `canon-r6-information-display-UG-09_Reference_0090.html` ; EOS 850D : `canon-850d-index.html`, `canon-850d-grid-display-UG-09_Set-up_0200.html`, `canon-850d-viewfinder-display-UG-09_Set-up_0180.html`, `canon-850d-histogram-UG-07_Playback_0280.html`.

Recherches (extraits de recherche, pages non ouvertes sauf celles citées plus haut) : WebSearch a servi à trouver l'adresse du guide de l'A6000 et de la page Digitutor du D5600. Un extrait a cité une fiche technique du D5600 sur `org.imaging.nikon.com` (« histogram display, highlights ») : hôte non autorisé, page non ouverte, non retenue.
