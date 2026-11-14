# Audit du lot « Interface : mise en page, accessibilité, libellés ; routine de test »

État : constats non contre-vérifiés

Rapport écrit par deux agents de Claude le 14 novembre 2026, à la demande de Julien : le premier a écrit l'en-tête, INT-01 et INT-02, puis a été coupé par la limite d'usage ; le second a repris son dossier de travail (copie du dépôt, site construit, scripts), a rejoué l'essai d'INT-01, et a écrit la suite. Aucun constat n'a encore été relu par un autre agent.

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail à la version 0.3.58 (code de la version 0.3.57). Ce qui date du 12 novembre (grilles de cadrage, 0.3.56 ; histogrammes de l'écran de revue, 0.3.57 ; routine dans la CI, 0.3.54) est hors du lot, sauf quand un défaut plus ancien s'y voit.
- Bilan : 21 constats (2 « faux », 4 « incohérent », 15 « à améliorer »), 27 points vérifiés et justes, 9 « Je ne sais pas ». Ce qui est solide : les contrastes des textes (tous au-dessus de 4,5:1, en clair et en sombre), les termes des manuels (54 termes de Nikon retrouvés mot pour mot), les fenêtres au clavier, le respect du réglage « réduire les animations », les pages statiques jusqu'à 320 px de large. Les défauts sont ailleurs, et presque tous sur téléphone : la mise en page du simulateur laisse au viseur ce que le panneau ne prend pas, si bien que sa hauteur, et même le sens du cadre, changent avec un texte (INT-04, INT-12) ; à l'horizontale, le viseur fait 117 × 78 px (INT-03) ; la photo prise s'affiche plus petite que le viseur (INT-17) ; des indications sont coupées ou recouvertes (INT-11) ; les fenêtres se ferment par un bouton placé tout en bas (INT-20). La routine de test ne peut rien en voir : elle ne joue qu'en français, à la verticale, à deux largeurs de téléphone, avec une souris (INT-13, INT-14), et l'un de ses contrôles relit ce qu'elle vient de régler (INT-05).
- À corriger d'abord, d'après ce rapport : INT-17 (une ligne pour le défilement, puis la taille de la photo), INT-21 (une ligne de CSS, reprise de FEX-19), INT-01 et INT-05 (deux erreurs simples), puis la mise en page du simulateur sur téléphone (INT-04, INT-12, INT-03, INT-11, INT-20), qui est une seule refonte à décider par Julien, et les contrôles de mise en page à ajouter à la routine (INT-14).

## Périmètre

- Ce que voit et touche l'utilisateur : `app/src/style.css`, `app/simulateur/index.html`, `app/activites/LUM-02/index.html`, `app/src/activities/lum02.css`, les pages produites par `app/scripts/build-pages.mjs` (accueil, fiches, `pages.css`), les libellés français et anglais de `app/src/i18n.ts`.
- La routine de test `scripts/test_app.cjs`.
- Le code de `app/src/ui/` et de `app/src/main.ts` est lu quand il pose un attribut, un texte ou une classe de la page. Les bogues de logique relèvent de `docs/audit/code.md` ; la structure de la routine (un seul scénario, un seul bloc, durée) est déjà le constat ARC-05 de `docs/audit/architecture-application.md` et n'est pas reprise ici.

### Ce qui n'a pas été couvert

- La page des licences (`licences/`) et la fenêtre « Crédits » : non regardées.
- Les fenêtres « Exposition », « Aperçu », « Mode de déclenchement » et « Boîtier de référence » sur téléphone : lues, non mesurées (seules « Mise au point » et la fiche le sont, INT-20).
- L'écran de revue avec les histogrammes et les hautes lumières (0.3.57) et les grilles (0.3.56) : hors du lot.
- Les boîtiers APS-C, le thème sombre du simulateur et le profil Android dans le détail : une seule mesure (forme du cadre du Pixel 7) ; les contrastes du thème sombre sont calculés, pas regardés sur une capture du simulateur.
- Un vrai téléphone, Safari, un lecteur d'écran, la police de la CI : voir « Je ne sais pas ».
- La routine n'a pas été rejouée en entier, ni modifiée pour prouver INT-05 et INT-06 par une erreur injectée : ces deux constats reposent sur la lecture du code.

## Méthode

1. Lecture complète des fichiers du lot, et de `app/src/main.ts`, `scene.ts` et `app/src/ui/` pour ce qu'ils posent dans la page.
2. Contrastes : toutes les paires de couleurs des trois feuilles de style, calculées par un script (`contraste.py`) avec les définitions « relative luminance » et « contrast ratio » du WCAG 2.2, relues et comparées au script (coefficients 0,2126, 0,7152, 0,0722 ; seuil 0,04045 ; (L1 + 0,05) / (L2 + 0,05)). Pour les repères posés sur la scène, seuils calculés et mesure sur deux captures (`reperes.py`).
3. Essais dans Chromium sans écran (Playwright 1.63.0, rendu logiciel), sur le site construit dans une copie du dépôt, hors du dépôt. Pages statiques : ancres, cibles, débordement à 320 et 390 px (`pages1.cjs`, `pages2.cjs`). Simulateur : cibles et ordre de tabulation (`s1.cjs`), hauteur du viseur et pastilles à six largeurs et en deux langues (`s2.cjs`), clavier, infobulles et libellés par marque (`s3.cjs`), téléphone à l'horizontale (`s4.cjs`), fenêtres, écran de revue sur deux photos (`s5.cjs`), bascule du cadre, arbre d'accessibilité, mouvement réduit, viseur surexposé (`s6.cjs`), clics sur le bouton qui clignote (`s7.cjs`, `s7b.cjs`), défilement gardé par les fenêtres et sens des boutons (`s8.cjs`), type de pointeur envoyé par Playwright (`toucher.cjs`). Police de la machine d'essai : Inter (la CI emploie DejaVu Sans, plus large). Ces essais émulent la taille de l'écran, pas un processeur graphique, ni Safari, ni un lecteur d'écran.
4. Critères d'accessibilité cités d'après leur texte, relu le 14 novembre 2026 (deux fois : les fichiers enregistrés par le premier agent ont été retéléchargés et comparés octet par octet).
5. Libellés : chaque terme de l'interface cherché mot pour mot dans le manuel en ligne du Nikon Z 7/Z 6, en français et en anglais (150 pages enregistrées, `termes_nikon.py`) ; termes de Sony et de Canon cherchés dans le guide d'aide de l'A7 III et dans le manuel de l'EOS 850D ; clés de `i18n.ts` comparées entre les deux langues et à leurs emplois par un script ; libellés cités par les fiches comparés à ceux de l'interface par un script.
6. Routine : lecture complète de `scripts/test_app.cjs` ; comptage par `grep` de ce qu'elle essaie ; `checkLinks` joué seul.

Scripts, sorties, pages enregistrées et captures : dossier `audit/interface/` du bloc-notes de la session, hors du dépôt (`scripts/`, `sorties/`, `pages/`, `captures/`). Les numéros de ligne sont ceux de la version 0.3.58.

## Sources

### Relues le 14 novembre 2026

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, texte source des critères et des définitions, dépôt `w3c/wcag`, branche `main`, au commit `c9ea04d4f3702e92249997c11fd678777f9c03ae` (tête de la branche le 14 novembre 2026, d'après `git ls-remote`) ; page sans date | `https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/<version>/<critère>.html` et `…/guidelines/terms/<version>/<terme>.html` | `wcag/sc_*.html`, `wcag/terms_*.html`, `wcag/relu/` |
| WHATWG, *HTML Living Standard*, source du standard (attribut `title`), dépôt `whatwg/html`, branche `main`, au commit `19d5996755dcdc8832da6990198af15012ec9781` ; page sans date | `https://raw.githubusercontent.com/whatwg/html/main/source` | `html/source.html` |
| Nikon, « Z 7/Z 6 Online Manual » et « Manuel en ligne Z 7/Z 6 », 75 pages par langue ; pages sans date | `https://onlinemanual.nikonimglib.com/z7_z6/en/` et `…/fr/` | `nikon/en/`, `nikon/fr/` |
| Sony, « Help Guide », « Guide d'aide », ILCE-7M3 (α7 III), 682 et 698 pages | `https://helpguide.sony.net/ilc/1720/v1/en/print.pdf` et `…/fr/print.pdf` | `sony/a7iii-en.pdf`, `sony/a7iii-fr.pdf` et leurs textes |
| Canon, « Product Manual : EOS REBEL T8i / EOS 850D » et « Manuel produit », pages « Shutter-Priority AE Mode (Tv) », « Aperture-Priority AE Mode (Av) », « AF Operation », « Drive Mode » et leurs versions françaises ; pages sans date | `https://cam.start.canon/en/C002/manual/html/UG-03_CustomShooting_0030.html`, `…_0040.html`, `UG-04_AF-Drive_0020.html`, `UG-04_AF-Drive_0060.html`, et les mêmes sous `/fr/` | `canon/` |

Lu sans être une source au sens du projet : le code de Babylon.js installé dans la copie (`@babylonjs/core` 9.35.0), pour l'attribut `tabindex` du canevas (INT-08).

### Non relues

- W3C, page publiée du WCAG 2.2 (`https://www.w3.org/TR/WCAG22/`) et pages « Understanding » : source non relue, hôte non joignable. Les numéros des critères (1.4.3, 2.5.8…) ne sont pas dans les fichiers source lus : ils sont donnés de mémoire, à côté du nom du critère, qui, lui, est lu.
- Documentation de Playwright sur `click` et `tap` : non lue ; le comportement est mesuré (INT-13).
- Manuels du Canon EOS RP et de l'EOS 2000D : non cherchés ; les termes de Canon viennent de l'EOS 850D.

## Constats

Classés du plus grave au moins grave : deux constats « faux », quatre « incohérent », quinze « à améliorer », ceux-ci par ordre d'importance pour un débutant sur son téléphone, puis pour la routine. Les identifiants suivent l'ordre où les constats ont été trouvés : ils ne se suivent donc pas.

### INT-01 · faux · Depuis une fiche de situation en anglais, le fil d'Ariane n'amène pas à la section de l'accueil : l'identifiant `situation` est en double

- Endroit : `app/scripts/build-pages.mjs`, l. 54 et l. 80 (`anchors`), l. 403 (`<section class="door" id="${t.anchors.situation}">`), l. 352 (fil d'Ariane) ; `scripts/test_app.cjs`, l. 202.
- Ce qui est fait : l'accueil contient les deux langues, un bloc par langue, dont un masqué. Les ancres des sections sont `situation`, `entrainement`, `apprendre` en français et `situation`, `practice`, `learn` en anglais : `situation` est donc l'identifiant de deux éléments de la même page. Le fil d'Ariane d'une fiche de situation anglaise pointe sur `../../?lang=en#situation`.
- Preuve (essai, `pages1.cjs`, fenêtre de 390 × 664 px) : clic sur le fil d'Ariane, puis lecture de la page d'arrivée.

  | Fiche de départ | Adresse d'arrivée | Éléments portant l'identifiant | Élément visé (`:target`) | Défilement | Haut de la section visible |
  | --- | --- | --- | --- | --- | --- |
  | `fiches/fr/SIT-01.html` | `/?lang=fr#situation` | 2 | bloc français, affiché | 273 px | 0 px |
  | `fiches/en/SIT-01.html` | `/?lang=en#situation` | 2 | bloc français, masqué | 0 px | 273 px |
  | `fiches/fr/NET-01.html` | `/?lang=fr#apprendre` | 1 | bloc français | 1056 px | 0 px |
  | `fiches/en/NET-01.html` | `/?lang=en#learn` | 1 | bloc anglais | 981 px | 0 px |

  En anglais, le navigateur vise le premier élément `situation` du document, celui du bloc français, masqué : la page ne défile pas. Les trois autres cas fonctionnent.
- La routine ne le voit pas : son contrôle « liens internes des pages » cherche seulement la chaîne `id="<ancre>"` dans le fichier visé (l. 202) ; elle y est, deux fois.
- Correction proposée : dans `anchors`, donner au bloc anglais un identifiant propre (`situations` par exemple, ou préfixer les trois ancres anglaises) ; dans `checkLinks`, compter les éléments qui portent l'identifiant et échouer s'il n'y en a pas exactement un.

### INT-05 · faux · Routine : le contrôle « AF-S et point sélectif par défaut (Z 6) » relit un réglage que la routine vient de faire ; le réglage de départ de la mise au point n'est jamais contrôlé

- Endroit : `scripts/test_app.cjs`, l. 911-912 (le contrôle), l. 425-429 et 446-449 (réglages faits avant), l. 878-881 (avec `--photo`), l. 53-54 (en-tête).
- Ce qui est écrit : `check("mise au point : AF-S et point sélectif par défaut (Z 6)", /^AF-S · Point · /.test(startText), startText)`.
- Preuve (code) : avant ce contrôle, sans rechargement de la page (aucun `page.goto` entre la l. 320 et la l. 1107), la routine a choisi elle-même ce mode :

  ```js
  // l. 425-429 : zone automatique, pour la vue de dessus
  await page.check('#af-dialog input[name="focusMode"][value="continuous"]');
  await page.check('#af-dialog input[name="areaMode"][value="auto"]');
  // l. 446-449 : puis
  await page.check('#af-dialog input[name="focusMode"][value="single"]');
  await page.check('#af-dialog input[name="areaMode"][value="point"]');
  ```

  et, avec `--photo`, une seconde fois aux l. 878-881. À la l. 911, l'indicateur commence donc par « AF-S · Point · » quel que soit le réglage de départ du code (`app/src/ui/cameraPanel.ts`, l. 265-266 : `focusMode = "single"`, `areaMode = "point"`). Rien ne lit l'indicateur avant la l. 425 : si le réglage de départ changeait, la routine resterait verte.
- Incohérence en plus : l'en-tête de la routine annonce « AF-C et point sélectif par défaut » (l. 53-54), le contrôle « AF-S ». Le code et la fiche MAP-04 (« L'AF-S est le réglage par défaut du Z 6 ») disent AF-S.
- À comparer : le contrôle « exposition par défaut : M et ISO auto (Z 6) » (l. 395-397) est fait avant tout réglage ; lui prouve ce qu'il dit.
- Correction proposée : lire `#af-badge` juste après le chargement, avant la l. 400, et y faire le contrôle (`/^AF-S · Point · /`) ; corriger l'en-tête (« AF-S »). Le contrôle de la l. 912 devient inutile ou change de nom (« retour à AF-S et point sélectif »).

### INT-12 · incohérent · Cadre horizontal ou vertical : il ne suit ni l'écran ni un choix, mais la place que le panneau laisse au viseur ; changer de mode AF peut le faire basculer

- Endroit : `app/src/camera/viewfinder.ts`, l. 23-35 (`const portrait = canvasHeight > canvasWidth`) ; `docs/camera-physique.md`, l. 105 (« Viseur : cadre aux proportions du capteur (vertical si l'écran l'est) ») ; `app/src/style.css`, l. 81-87.
- Ce qui est fait : le cadre est vertical quand la zone du viseur (`main`) est plus haute que large. Cette zone est ce que laissent l'en-tête et le panneau (INT-04) : sa forme ne dit pas comment le téléphone est tenu.
- Preuve (mesures, `s1.cjs`, `s5.cjs`, `s6.cjs`, français, police Inter) :

  | Fenêtre | Zone du viseur | Cadre |
  | --- | --- | --- |
  | iPhone 14 émulé, tenu à la verticale, 390 × 664 px | 390 × 266 px | 390 × 260 px, horizontal |
  | Pixel 7 émulé, tenu à la verticale, 412 × 839 px | 412 × 441 px | 294 × 441 px, vertical |
  | Fenêtre construite pour l'essai, 360 × 815 px, AF-S | 360 × 349,6 px | 360 × 239 px, horizontal |
  | Même fenêtre, AF-C | 360 × 366,6 px | 244 × 367 px, vertical |

  Deux téléphones tenus de la même façon cadrent donc l'un en largeur, l'autre en hauteur, contrairement à la phrase de la documentation. Et dans la dernière fenêtre, passer d'AF-S à AF-C fait basculer le cadre : la consigne sous les boutons perd une ligne (51 px, puis 34 px), la zone du viseur passe de 350 à 367 px de haut pour 360 px de large, et dépasse le carré. Cette fenêtre est construite pour montrer le mécanisme (captures `cadre-360x815-afs.png` et `cadre-360x815-afc.png`) ; sur un vrai téléphone, le seuil dépend de la police et de la langue.
- Conséquences déjà écrites dans le dépôt : le résultat d'un défi change avec le cadre (« avec le cadre vertical du profil Android, la poubelle sort du cadre », `docs/camera-physique.md`, l. 540 ; `scripts/test_app.cjs`, l. 817-818), et la routine doit prévoir les deux cas (l. 616-620, 1035-1057).
- Réalisme : sur un boîtier, c'est le photographe qui choisit de cadrer en hauteur ou en largeur, et la recette d'un portrait (SIT-01) peut le lui demander. Ici il ne choisit pas, et ne peut pas savoir pourquoi son cadre n'est pas celui d'un autre.
- Correction proposée : séparer le cadrage de la mise en page. Un bouton du panneau (« Cadrage : horizontal / vertical »), dont la valeur de départ suit l'orientation de l'écran (`matchMedia("(orientation: portrait)")`) plutôt que la forme de `main` ; `frameFor` reçoit ce choix au lieu de le déduire. À défaut, corriger la phrase de `docs/camera-physique.md` (« vertical si la zone du viseur est plus haute que large ») et fixer la hauteur du viseur (INT-04) pour que le cadre ne bascule plus avec un texte.

### INT-10 · incohérent · La fenêtre « Boîtier de référence » propose Canon et Sony, mais tous les libellés restent ceux du Nikon Z 6

- Endroit : `app/simulateur/index.html`, l. 158-163 (choix de la marque) ; `app/src/i18n.ts`, l. 47-63, 94-101, 151-160 (et les mêmes en anglais) ; `app/src/ui/cameraPanel.ts`, l. 554-575 et 946-975 (libellés écrits sans regarder la marque).
- Preuve (essai, `s3.cjs`) : marque « Canon » choisie, le bouton du boîtier affiche « Canon EOS RP », et les fenêtres affichent : « Sélecteur de mode », « M : Manuel », « A : Auto à priorité ouverture », « S : Auto à priorité vitesse » ; « AF-S : AF ponctuel », « AF-C : AF continu », « AF point sélectif », « AF zone large (S) », « AF zone large (L) », « AF zone automatique », « Détect. visage-yeux AF zone auto » ; « Mode de déclenchement », « Vue par vue », « Continu L », « Continu H (5,5 vps) », « Continu H (étendu) (12 vps) ». Le bouton de l'indicateur affiche « A · +0,5 IL ». Mêmes textes avec « Sony ».
- Preuve (sources, lues le 14 novembre 2026) :

  | | Nikon Z 6 (manuel en ligne Z 7/Z 6) | Sony A7 III (guide d'aide) | Canon (manuel de l'EOS 850D, boîtier voisin) |
  | --- | --- | --- | --- |
  | Priorité à l'ouverture | « A Auto à priorité ouverture », « A Aperture-priority auto » | « A (Aperture Priority) », « Priorité ouvert. » | « Aperture-Priority AE Mode (Av) », « Mode d'exposition automatique avec priorité à l'ouverture (Av) » |
  | Priorité à la vitesse | « S Auto à priorité vitesse », « S Shutter-priority auto » | « S (Shutter Priority) », « Priorité vitesse » | « Shutter-Priority AE Mode (Tv) », « Mode d'exposition automatique avec priorité à l'obturation (Tv) » |
  | Autofocus sur sujet immobile, mobile | « AF-S AF ponctuel », « AF-C AF continu » ; « Single AF », « Continuous AF » | « AF ponctuel/AF continu » ; « Single-shot AF/Continuous AF » | « Autofocus One-Shot », « AF Servo » ; « One-Shot AF », « AI Servo AF », « Servo AF » |
  | Zone de mise au point | « Mode de zone AF » : « AF point sélectif », « AF zone large (S) »… | « Zone mise au point » : « Large », « Zone », « Spot flexible »… | non relu |
  | Vue par vue, rafale | « Mode de déclenchement », « Release mode » | « Entraînement », « Drive Mode » | « Mode d'acquisition », « Drive Mode » |

  Adresses : Nikon, `https://onlinemanual.nikonimglib.com/z7_z6/fr/` et `…/en/`, pages `05_basic_settings_01.html`, `06_shooting_controls_01.html`, `06_shooting_controls_04.html` ; Sony, `https://helpguide.sony.net/ilc/1720/v1/fr/print.pdf` et `…/en/print.pdf` ; Canon, `https://cam.start.canon/fr/C002/manual/html/UG-03_CustomShooting_0030.html`, `…_0040.html`, `UG-04_AF-Drive_0020.html`, `UG-04_AF-Drive_0060.html`, et les mêmes sous `/en/`. Je n'ai pas cherché le manuel de l'EOS RP lui-même : les termes de Canon viennent de l'EOS 850D.
- Ce que disent déjà les textes : les notes des fenêtres l'annoncent (« D'après le manuel du Nikon Z 6 », « Termes du manuel du Z 6 », « Termes et cadences du manuel du Nikon Z 6 »). Mais le choix de la marque laisse croire le contraire : avec « Canon EOS RP » affiché, la molette porte « A » et « S », que Canon nomme « Av » et « Tv », et la rafale annonce les cadences du Z 6. La marque ne change que le capteur, le bruit et la zone couverte par l'autofocus (`app/src/camera/bodies.ts`), ce que la fenêtre « Boîtier de référence » ne dit pas.
- Lien : les fiches ont le même défaut (FEX-15 et FMA-14, `docs/audit/fiches-exposition.md` et `docs/audit/fiches-mise-au-point.md`), qui renvoient ici la question de l'interface. But du projet (`CLAUDE.md`) : que le débutant maîtrise son boîtier.
- Correction proposée, au choix de Julien : (a) le moins coûteux : une phrase dans la fenêtre « Boîtier de référence » (« La marque change le capteur, le bruit et la zone couverte par l'autofocus. Les noms des modes restent ceux de Nikon ; chez Canon, A s'appelle Av et S s'appelle Tv ; … ») et, dans la fenêtre « Exposition », les deux lettres (« A (Av chez Canon) ») ; (b) des libellés par marque pour les modes d'exposition, de mise au point et de déclenchement, chacun avec sa source (une table par marque dans `i18n.ts`) ; les cadences de rafale par boîtier demandent leurs propres sources. La voie (b) est une extension : à décider après les tests avec des débutants (`CLAUDE.md`).

### INT-13 · incohérent · Routine : les profils « Android » et « iPhone » ne touchent jamais l'écran ; tous les gestes sont des clics de souris

- Endroit : `scripts/test_app.cjs`, l. 9-11 (« Les profils mobiles émulent la taille d'écran, le toucher et l'identification du navigateur ») ; l. 85-91 (profils) ; les 109 appels à `page.click`, `page.mouse.*`, `page.check` et `selectOption` ; `CLAUDE.md`, section « Dépôt » (« Ces tests émulent l'écran, le toucher et le navigateur »).
- Ce qui est fait : les profils `devices["Pixel 7"]` et `devices["iPhone 14"]` déclarent un écran tactile (`hasTouch`), mais la routine n'appelle jamais `page.tap` ni `page.touchscreen` (`grep -c "\.tap(\|touchscreen" scripts/test_app.cjs` : 0). Les touchers du viseur, le glissé qui relève l'appareil (l. 972-977) et l'appui tenu sur le déclencheur (l. 1080-1084) passent par `page.mouse`.
- Preuve (essai, `toucher.cjs`, profil « iPhone 14 », Playwright 1.63.0, page de l'activité LUM-02) : type du pointeur reçu par la page.

  | Appel | Événements reçus |
  | --- | --- |
  | `page.click` | `pointerdown` de type `mouse`, `mousedown` |
  | `page.mouse.click` | `pointerdown` de type `mouse`, `mousedown` |
  | `page.tap` | `pointerdown` de type `touch`, `touchstart`, `mousedown` |

  Sur ce profil, `navigator.maxTouchPoints` vaut 1 : l'écran tactile est déclaré, mais aucun doigt ne s'y pose.
- Conséquence : ce qui est propre au toucher n'est pas essayé. La rotation de l'appareil à un doigt (`app/src/scene.ts`, l. 116-117, `touch.singleFingerRotate = true`) n'est jamais jouée : la routine tourne l'appareil par l'entrée de la souris de Babylon.js. `touch-action: none` (`style.css`, l. 142), la capture du pointeur du déclencheur et l'annulation d'un toucher par le navigateur (`pointercancel`) ne sont pas vus non plus : le défaut COD-09 (`docs/audit/code.md` : un glissement du doigt arrête la rafale) ne pouvait pas être trouvé par la routine.
- Correction proposée : sur les deux profils tactiles, remplacer les gestes du viseur, de la carte, de la photo et du déclencheur par des touchers (`page.tap`, `page.touchscreen.tap`, et pour le glissé et l'appui tenu des événements tactiles envoyés par le protocole de Chromium, `Input.dispatchTouchEvent`), en gardant la souris sur les profils d'ordinateur ; à défaut, corriger l'en-tête et `CLAUDE.md` : « émulent la taille d'écran et l'identification du navigateur ; les gestes sont ceux d'une souris ».

### INT-07 · incohérent · Le simulateur vouvoie, l'accueil, l'activité et les fiches tutoient

- Endroit : `app/src/i18n.ts`, l. 39, 69, 70, 147, 170, 209, 226 ; `app/scripts/build-pages.mjs`, l. 39 et 463 ; `app/src/activities/lum02.ts`, l. 51, 67-73 ; `content/fr/`.
- Ce qui est écrit, dans le simulateur : « touchez le viseur » (l. 39 et 70), « celui que vous touchez » (l. 69), « Touchez la carte » (l. 147), « maintenez le déclencheur appuyé » (l. 170), « Touchez la photo » (l. 209), « votre appareil demande de réduire les animations » (l. 226).
- Ce qui est écrit ailleurs : accueil, « Pour mesurer ton réseau », « réessaie, ou change de réseau » ; activité LUM-02, « Change la taille de la source », « Ta lampe donne une ombre trop dure […] que fais-tu », « Essaie avec le curseur » ; fiches, « tu peux aligner Sophia » (SIT-01), « c'est toi qui choisis la vitesse » (EXP-05), « ton choix » (MAP-05). La fiche MES-07 dit « ton appareil demande de réduire les animations » pour le message même que l'interface écrit « votre appareil demande de réduire les animations ».
- Preuve : `grep -nE "vous|votre|ouchez|aintenez" app/src/i18n.ts` donne les sept lignes ci-dessus ; aucun « tu », « ton », « ta » dans la partie française de `i18n.ts`. `CLAUDE.md` demande le tutoiement ; aucune page de `docs/` ne décide du vouvoiement pour l'interface (`grep -i "tutoie\|vouvoie"` : rien).
- Correction proposée : tutoyer dans le simulateur (« touche le viseur », « celui que tu touches », « Touche la carte », « maintiens le déclencheur appuyé », « Touche la photo », « ton appareil demande… »). Sept textes ; la routine n'en lit aucun.

### INT-03 · à améliorer · Téléphone tenu à l'horizontale : le viseur fait 117 × 78 px, sous deux calques qui le couvrent ; la carte ne peut plus être repliée

- Endroit : `app/src/style.css`, l. 24-36 (`html, body { height: 100% }`, `body` en colonne), l. 81-87 (`main { flex: 1; min-height: 0; overflow: hidden }`), l. 343-399 (`.top-view`, `.top-view-map { height: min(16.5rem, 45vh) }`, repli sous 700 px de large seulement), l. 580-594 (`.balance`) ; `app/src/ui/topView.ts`, l. 55 (`this.expanded = window.innerWidth > 700`) ; `app/src/ui/balance.ts`, l. 75-79 (même seuil).
- Ce qui est fait : la page a la hauteur de la fenêtre ; l'en-tête et le panneau du boîtier prennent leur hauteur, le viseur ce qui reste. Rien ne tient compte d'une fenêtre large et basse : au-dessus de 700 px de large, la vue de dessus et l'indicateur d'équilibre s'ouvrent dépliés, comme sur un ordinateur.
- Preuve (mesure, `s4.cjs`, profils « iPhone 14 landscape » et « Pixel 7 landscape » de Playwright, capture `sim-iPhone-14-landscape.png`) :

  | Fenêtre | En-tête | Viseur (`main`) | Panneau | Cadre | Indicateur d'équilibre | Bouton « Vue de dessus » |
  | --- | --- | --- | --- | --- | --- | --- |
  | iPhone 14, 750 × 340 px | 79 px | 77,6 px | 183,4 px | 117 × 78 px | 328 × 86 px, plus haut que le viseur | de 94 à 74 px au-dessus du haut du viseur : coupé par `overflow: hidden` |
  | Pixel 7, 863 × 360 px | 79 px | 97,6 px | 183,4 px | 147 × 98 px | 328 × 86 px | de 83 à 63 px au-dessus : coupé |

  Le cadre couvre 3,6 % de la fenêtre de l'iPhone (117 × 78 sur 750 × 340). L'indicateur d'équilibre, déplié, recouvre la gauche du viseur et déborde en bas ; la vue de dessus recouvre la droite, et son bouton de repli est hors de la zone visible : on ne peut ni voir la carte, ni la refermer. Même mesure en anglais. La page ne défile pas (`scrollHeight` égal à la hauteur de la fenêtre) : rien ne permet d'agrandir le viseur.
- Ce n'est écrit nulle part : ni `docs/`, ni la routine (`scripts/test_app.cjs`, quatre profils, tous deux téléphones à la verticale) ne parlent de l'orientation ; `grep -i "paysage\|landscape"` ne trouve rien dans `docs/`, `app/src/` et la routine.
- Pourquoi c'est important : le cadre du simulateur est celui d'un capteur 3:2 ; tourner le téléphone pour le voir en grand est le geste attendu d'un débutant, et c'est là que le viseur disparaît.
- Limite de la mesure : fenêtres de Playwright (barres du navigateur déduites) dans Chromium ; pas de vrai téléphone, pas de Safari.
- Correction proposée (à choisir par Julien, la mise en page relève de sa décision) : pour une fenêtre basse (`@media (orientation: landscape) and (max-height: 500px)`), placer le panneau à côté du viseur plutôt que dessous (`body` en ligne, panneau en colonne étroite), réduire l'en-tête à une ligne, et replier la vue de dessus et l'indicateur d'après la place du viseur et non d'après la largeur de la fenêtre. À défaut, dans l'immédiat : dire dans la page qu'il faut tenir le téléphone à la verticale. Ajouter un profil « paysage » au contrôle « viseur assez grand » de la routine.

### INT-17 · à améliorer · Sur téléphone, la photo prise s'affiche plus petite que le viseur, « Revenir au viseur » est hors de l'écran, et la photo suivante s'ouvre déjà défilée

- Endroit : `app/src/style.css`, l. 708-735 (`.review` : `position: absolute; inset: 0` dans `main`, `overflow-y: auto`) et l. 757-764 (`.review img { max-height: calc(100% - 6rem) }`) ; `app/src/ui/shutter.ts`, l. 514 et 524 (`this.el.review.hidden = false` : l'écran de revue est rouvert sans remise à zéro du défilement ; `grep scrollTop` ne trouve rien dans ce fichier) ; `docs/etat-des-travaux.md`, l. 82 (défilement gardé : défaut déjà noté).
- Ce qui est fait : l'écran de revue occupe la zone du viseur, pas l'écran ; le panneau du boîtier reste affiché dessous. La photo y est limitée à la hauteur de la zone moins 6 rem.
- Preuve (essai, `s5.cjs`, iPhone 14 émulé, 390 × 664 px, deux photos aux réglages de départ ; captures `sim-iphone-revue-1.png` et `sim-iphone-revue-2.png`) :

  | | Zone de revue | Contenu | Défilement | Photo | « Revenir au viseur » |
  | --- | --- | --- | --- | --- | --- |
  | Première photo | 266 px de haut | 402 px | 0 px | 220 × 146 px, haut à 12 px | de 358 à 390 px : hors de la zone |
  | Après un défilement à la molette jusqu'en bas | 266 px | 402 px | 136 px | haut à −124 px | de 222 à 254 px : visible |
  | Seconde photo, après « Revenir au viseur » et un nouveau déclenchement | 266 px | 434 px | 136 px, gardé | haut à −124 px : 22 px de la photo visibles | de 254 à 286 px : coupé |

  1. La photo fait 220 × 146 px, alors que le cadre du viseur où elle a été composée fait 390 × 260 px : un tiers de sa surface (32 120 px² contre 101 400). C'est le résultat de l'exercice, et il est plus petit que l'aperçu.
  2. Sous la photo, le bouton « Infos », la légende, le bulletin, la consigne et les boutons font 402 px pour 266 px visibles : « Revenir au viseur » et « Enregistrer la photo » ne se voient qu'après défilement, pendant que le panneau du boîtier, inutile à ce moment, occupe 298 px.
  3. Le défaut noté dans `docs/etat-des-travaux.md` est reproduit : la seconde photo s'ouvre avec le défilement de la première (136 px), et l'on ne voit que les 22 derniers pixels de la photo.
- Correction proposée : (1) à l'ouverture de l'écran de revue et à chaque changement de vue, `review.scrollTop = 0` (une ligne dans `shutter.ts`) ; (2) sur téléphone, l'écran de revue couvre aussi le panneau (`.review` placé par rapport à la page, sous l'en-tête, ou panneau masqué tant que la revue est ouverte) ; (3) la photo prend toute la largeur (`max-height` levée quand la zone défile), les boutons « Revenir au viseur » et « Enregistrer » restant collés en bas (`position: sticky; bottom: 0`). Contrôle à ajouter à la routine : après deux photos, haut de la photo visible et photo au moins aussi large que le cadre du viseur.

### INT-04 · à améliorer · La hauteur du viseur dépend de chaque texte du panneau : de 159 à 266 px pour la même fenêtre, selon la largeur, la langue et le mode AF

- Endroit : `app/src/style.css`, l. 81-87 (`main { flex: 1 }`), l. 249-303 (`.panel`, `.dials`, `.meter-row { flex-wrap: wrap }`), l. 525-527 (`.focus-hint`) ; `app/src/i18n.ts`, l. 39 et 70 (les deux consignes de mise au point, de longueurs différentes) ; `docs/etat-des-travaux.md`, l. 79 (défaut déjà noté : 238 ou 254 px sur l'iPhone 14 émulé, avec la police de la CI).
- Ce qui est fait : le viseur prend la hauteur que laissent l'en-tête et le panneau. Or la hauteur du panneau change avec ses textes : la consigne sous les boutons (une ligne de plus en AF-S qu'en AF-C quand elle passe à la ligne), le nombre de lignes de boutons, le nom des molettes, la langue.
- Preuve (mesure, `s2.cjs`, fenêtre de 664 px de haut, police Inter, hauteur de `#scene` en pixels CSS) :

  | Largeur | Français, AF-S | Français, AF-C | Anglais, AF-S | Anglais, AF-C |
  | --- | --- | --- | --- | --- |
  | 320 px | 158,6 | 158,6 | 175,6 | 175,6 |
  | 360 px | 198,6 | 215,6 | 215,6 | 215,6 |
  | 375 px | 215,6 | 215,6 | 215,6 | 215,6 |
  | 390 px | 266,2 | 266,2 | 209,2 | 209,2 |
  | 412 px | 266,2 | 266,2 | 249,2 | 249,2 |
  | 430 px | 266,2 | 266,2 | 249,2 | 249,2 |

  Le défaut noté dans `docs/etat-des-travaux.md` se reproduit ici à 360 px de large : 17 px d'écart entre AF-S et AF-C (consigne de 51 px contre 34 px). Il n'est qu'un cas d'un défaut plus large : sur l'iPhone 14 émulé (390 px), passer en anglais retire 57 px au viseur (panneau de 337,8 px au lieu de 297,8 px, en-tête de 117 px au lieu de 100 px) ; à 320 px, le viseur fait 159 px, soit 24 % de la hauteur de la fenêtre.
- Conséquences mesurées : à chaque changement de hauteur, le cadre change de taille (390 × 260, 324 × 216, 299 × 199, 239 × 159 px) ; le contrôle « viseur assez grand » de la routine (35 % de la fenêtre, soit 232 px ici ; `scripts/test_app.cjs`, l. 351) n'est joué qu'en français et à deux largeurs de téléphone : en anglais à 390 px (209 px, 31,5 %) et en français à 320, 360 et 375 px, il échouerait.
- Correction proposée : donner au panneau une hauteur qui ne dépend pas de ses textes sur téléphone. Le plus simple : réserver deux lignes à la consigne (`min-height` égale à deux hauteurs de ligne) ou la sortir du panneau (dans le viseur, comme les autres indications), et fixer la hauteur des lignes de boutons ; plus sûr : sur téléphone, donner au viseur une part fixe de la fenêtre (par exemple `main { flex: none; height: 45vh }`) et laisser le panneau défiler. Jouer le contrôle « viseur assez grand » en anglais et à 320 px.

### INT-20 · à améliorer · Fenêtres sur téléphone : « Fermer » est tout en bas d'un contenu plus haut que l'écran, et la fenêtre se rouvre là où on l'a laissée

- Endroit : `app/simulateur/index.html`, l. 198-223 (fenêtre « Mise au point » : le bouton « Fermer » après la note), l. 273-279 (fenêtre de fiche) ; `app/src/style.css`, l. 102-109 (`dialog { max-height: calc(100vh - 2rem) }`) et l. 908-912 ; `app/src/ui/cameraPanel.ts`, l. 298 (`el.afDialog.showModal()`, sans remise à zéro du défilement).
- Preuve (essai, `s8.cjs`, iPhone 14 émulé, 390 × 664 px ; captures `sim-iphone-fenetre-af.png` et `sim-iphone-fenetre-af-reouverte.png`) :

  | Fenêtre | Boîte | Contenu | « Fermer » |
  | --- | --- | --- | --- |
  | « Mise au point », première ouverture | 358 × 632 px | 725 px pour 630 visibles, défilement 0 | hors de la boîte : il faut défiler de 95 px |
  | Même fenêtre, fermée par « Fermer » puis rouverte | 358 × 632 px | défilement 95 px, gardé | visible ; le titre « Mise au point » et la légende « Mode de mise au point » ne le sont plus |
  | Fiche SIT-05, ouverte depuis « Défis » | 358 × 632 px | 1 195 px pour 630 visibles (1,9 écran) | à 1 148 px du haut : après toute la fiche |

  1. Sur un téléphone, il n'y a pas de touche Échap, et toucher hors d'une fenêtre ouverte par `showModal` ne la ferme pas : le seul moyen de fermer est le bouton du bas. Pour la fiche, c'est après deux écrans de lecture.
  2. La fenêtre garde son défilement d'une ouverture à l'autre, comme l'écran de revue (INT-17) : comme on la ferme toujours par le bas, elle se rouvre toujours par le bas, titre et premiers choix cachés. La fenêtre de fiche, elle, remet son défilement à zéro (`ficheDialog.ts`, l. 84-85) : le remède est déjà écrit pour un cas.
- Non mesuré : les fenêtres « Exposition », « Aperçu » et « Mode de déclenchement », plus longues encore avec leurs notes (la note des grilles, la note du déclenchement) ; la même cause y produit le même effet.
- Correction proposée : dans une seule fonction d'ouverture des fenêtres, `dialog.scrollTop = 0` avant `showModal()` ; un bouton de fermeture en haut à droite de chaque fenêtre, collé au défilement (`position: sticky; top: 0`), en plus de celui du bas ; fermeture par un toucher sur le fond (`click` dont la cible est la fenêtre elle-même). Les notes longues peuvent passer dans un `<details>` replié, comme « Limites et lecture » de l'indicateur d'équilibre.

### INT-11 · à améliorer · Indications du viseur coupées ou recouvertes sur téléphone : « Aperçu coupé » perd ses deux bouts, la distance de mise au point passe sous « Vue de dessus »

- Endroit : `app/src/style.css`, l. 543-571 (`.preview-badge` : centrée, `white-space: nowrap`, sans largeur maximale ; `.af-badge` en bas, au centre) et l. 343-354 (`.top-view`, en bas à droite, `z-index: 1`) ; `app/src/ui/cameraPanel.ts`, l. 994-995 et 1048-1050 (textes des pastilles).
- Preuve (mesures, `s2.cjs`, fenêtre de 664 px de haut, police Inter ; aperçu entièrement coupé, zone automatique sans détection) :

  | Largeur | « Aperçu coupé : luminosité, bruit, profondeur de champ et indicateur » (454 px) | « Preview off: brightness, noise, depth of field and indicator » (391 px) |
  | --- | --- | --- |
  | 320 px | coupée de 67 px de chaque côté | coupée de 35 px de chaque côté |
  | 360 px | coupée de 47 px de chaque côté | coupée de 15 px de chaque côté |
  | 390 px | coupée de 32 px de chaque côté | entière, sans marge |
  | 430 px | coupée de 12 px de chaque côté | entière |

  Sur l'iPhone 14 émulé, on lit « …erçu coupé : luminosité, bruit, profondeur de champ et indicat… » (capture `pastilles-fr-390.png`) : le viseur coupe ce qui dépasse (`main { overflow: hidden }`).
- Preuve (mesures, `s5.cjs`, iPhone 14 émulé, position horizontale en pixels) : la pastille de mise au point et le bloc « Vue de dessus » sont à la même hauteur (21 px communs), le second par-dessus.

  | Pastille | Étendue | Bloc « Vue de dessus » | Recouvrement |
  | --- | --- | --- | --- |
  | « AF-S · Point · 26,7 m » | 120–270 | 274–382 | 0 px |
  | « AF-C · Auto · œil · 6,6 m » | 108–282 | 274–382 | 8 px |
  | « AF-C · Auto · sujet le plus proche · 5,8 m » | 56–334 | 274–382 | 60 px |
  | « AF-C · Auto · closest subject · 5.8 m » | 70–320 | 307–382 | 13 px |
| « AF-S · Auto · point touché · verrouillée à 14,9 m » (`s8.cjs`) | 35–356 | 274–382 | 82 px |

  En zone automatique sans visage, la fin de la pastille, c'est-à-dire la distance de mise au point, est sous le bouton « Vue de dessus » (même capture). Le repère du point, placé au-dessus des pastilles (`z-index: 1`), les recouvre aussi quand le point est en bas du cadre.
- En plus : le bouton « Vue de dessus » fait 98,7 × 20,2 px (`s1.cjs`) et il est posé sur le viseur, qui est lui-même une cible (un toucher y choisit le point de mise au point) : un toucher à 2 px du bouton déplace le point. Critère « Target Size (Minimum) » (2.5.8, niveau AA), texte lu : « The size of the target for pointer inputs is at least 24 by 24 CSS pixels », avec une exception d'espacement qui ne joue pas ici, le cercle de 24 px du bouton coupant une autre cible.
- Correction proposée : `max-width: calc(100% - 1rem)`, `white-space: normal` et `text-align: center` sur `.preview-badge` ; un texte court quand tout est coupé (« Aperçu coupé » seul, le détail restant dans la fenêtre) ; la pastille de mise au point alignée à gauche (`left: 0.5rem`, sans `translateX`) avec une largeur maximale qui s'arrête au bloc « Vue de dessus » ; `min-height: 1.5rem` sur `.top-view-toggle`. Contrôle à ajouter à la routine : aucune pastille ne dépasse du viseur ni ne passe sous la vue de dessus (INT-14).

### INT-09 · à améliorer · Des explications ne sont que dans des infobulles (`title`) : sur téléphone et au clavier, rien ne dit pourquoi la vitesse clignote

- Endroit : `app/src/ui/cameraPanel.ts`, l. 585-587 (`limitText`), l. 725-726 (`output.title`), l. 732 (`loupeButton.title`), l. 746 (`meterValue.title`) ; `app/src/ui/reviewInfo.ts`, l. 153 ; `app/src/ui/shutter.ts`, l. 167 ; `app/src/i18n.ts`, l. 28, 40, 150, 162, 164-165, 207, 211.
- Ce qui est fait : huit textes de `i18n.ts` ne sont écrits que dans un attribut `title` :

  | Clé | Texte | Où |
  | --- | --- | --- |
  | `tooBright`, `tooDark` | « trop de lumière : photo surexposée », « pas assez de lumière : photo sous-exposée » | `title` de la valeur qui clignote, et du bouton de l'indicateur d'exposition |
  | `meterHelp` | « 0 : exposition correcte. Plus : photo plus claire. Moins : photo plus sombre. » | `title` du bouton de l'indicateur d'exposition |
  | `exposureButtonTitle` | « Mode d'exposition, correction d'exposition et ISO auto » | même `title` : c'est le seul texte qui dise ce qu'ouvre le bouton « M · −0,2 IL » |
  | `isoChosen` | « valeur choisie : 100 » | `title` de l'ISO en italique, quand l'ISO auto l'a changé |
  | `loupeHelp` | « Grossit l'image autour du point de mise au point, jusqu'à 100 % : un pixel de l'écran pour un photosite du capteur. » | `title` du bouton « Loupe » |
  | `reviewInfoTitle` (0.3.57) | « Affichage de l'écran de revue : photo seule, histogrammes ou hautes lumières » | `title` du bouton « Infos » |
  | `focusPoint` | « Point de mise au point » | `title` du repère, élément `aria-hidden="true"` avec `pointer-events: none` : personne ne peut le lire |

- Preuve (essai, `s3.cjs`, mode A, ISO 6400, f/8 : la vitesse clignote à 1/4000 s) : `title` de la vitesse, « trop de lumière : photo surexposée » ; recherche de « trop de lumière » et de « surexpos » dans le texte affiché de la page (`document.body.innerText`) : absents ; la valeur n'a ni `aria-label` ni `aria-describedby`. Capture `sim-ordinateur-mode-A-clignote.png`.
- Source : le standard HTML déconseille de s'appuyer sur `title` : « Relying on the title attribute is currently discouraged as many user agents do not expose the attribute in an accessible manner as required by this specification (e.g., requiring a pointing device such as a mouse to cause a tooltip to appear, which excludes keyboard-only users and touch-only users, such as anyone with a modern phone or tablet). » (WHATWG, *HTML Living Standard*, source du standard, l. 14795-14799, lue le 14 novembre 2026).
- Conséquence : les modes A et S apprennent au débutant à lire un clignotement (fiches BOI-07 et BOI-08) ; sur son téléphone, le simulateur clignote sans dire « trop de lumière » ou « pas assez », alors que le texte est écrit et traduit. De même, rien ne dit ce que fait la loupe ni ce qu'ouvre le bouton « M · −0,2 IL ».
- Correction proposée : écrire la limite là où l'on regarde, par exemple à la place de la consigne de mise au point tant que la valeur clignote (« Vitesse au maximum : trop de lumière, photo surexposée »), ou dans une pastille du viseur comme « Aperçu coupé » ; mettre `meterHelp` et `loupeHelp` dans les fenêtres (la fenêtre « Exposition » a déjà une note) ; donner au bouton de l'indicateur un nom accessible qui commence par son texte et finit par `exposureButtonTitle` ; supprimer `focusPoint`, ou en faire le nom du repère s'il devient atteignable (INT-08).

### INT-16 · à améliorer · « Vitesse : plus » allonge la pose et « Ouverture : plus » ferme le diaphragme : le nom des boutons dit l'inverse du geste

- Endroit : `app/src/ui/cameraPanel.ts`, l. 681-691 (`step`) et l. 728-729 (noms accessibles) ; `app/src/i18n.ts`, l. 20-25 et 254-259 (`aperture`, `shutter`, `decrease`, `increase`) ; `app/simulateur/index.html`, l. 104-135.
- Ce qui est fait : chaque molette a un nom (« Ouverture », « Vitesse », « ISO », « Focale »), une valeur et deux boutons « − » et « + », nommés pour les lecteurs d'écran « Ouverture : moins », « Ouverture : plus », « Vitesse : moins », « Vitesse : plus » (en anglais « Aperture: less », « Shutter speed: more »…). La règle est écrite dans le code : « « + » augmente la valeur affichée : nombre f, durée de pose, ISO, focale. »
- Preuve (code) :

  ```ts
  // L'échelle des vitesses va de 30 s à 1/4000 s : une pose plus longue est un indice plus petit.
  if (dial === "shutter" && this.exposureMode !== "A") this.settings.shutter = clamp(this.settings.shutter - delta, SCALES.shutter);
  ```

- Preuve (essai, `s8.cjs`, un appui sur chaque « + », ISO auto désactivé) : « Ouverture : plus », f/8 devient f/9 ; « Vitesse : plus », 1/100 s devient 1/80 s ; « ISO : plus », 100 devient 125 ; « Focale : plus », 50 mm devient 70 mm. La routine s'en sert dans ce sens : quinze appuis sur « − » de l'ouverture mènent de f/8 à f/1,4 (`scripts/test_app.cjs`, l. 473), seize appuis sur « − » de la vitesse mènent de 1/100 s à 1/4000 s (l. 488 et 510).
- Conséquence : « Vitesse : plus » donne 1/80 s après 1/100 s, soit une vitesse plus lente ; « Ouverture : plus » donne f/9 après f/8, soit une ouverture plus petite. Pour deux molettes sur quatre, le nom du bouton dit le contraire de ce qui arrive à la grandeur nommée ; pour l'ISO et la focale, il dit juste. À l'écran, le « + » à côté de « 1/100 s » fait baisser le nombre affiché (100, puis 80). La fiche EXP-04 dit du nombre f : « Plus il est grand, plus l'image projetée sur le capteur est sombre » ; le bouton qui se nomme « Ouverture : plus » augmente ce nombre, donc réduit l'ouverture.
- Ce qui est juste : la règle est la même pour les quatre molettes (le nombre f, la durée, l'ISO et la focale augmentent avec « + »), et les valeurs affichées sont exactes.
- Correction proposée : garder les signes, changer les noms. Noms accessibles et infobulles qui disent l'effet : « Ouverture : fermer d'un tiers de cran (nombre f plus grand) » et « ouvrir d'un tiers de cran (nombre f plus petit) » ; « Vitesse : pose plus longue » et « pose plus courte » ; « ISO : plus bas », « plus haut » ; « Focale : plus courte », « plus longue ». Si Julien préfère que « + » veuille dire « plus de vitesse », inverser les deux boutons de la vitesse et adapter la routine (l. 474, 485, 488, 541, 553, 767, 786).

### INT-08 · à améliorer · Viseur, carte et photo ne répondent qu'au pointeur : quatre gestes du simulateur sont impossibles au clavier, et tourner l'appareil impose de glisser

- Endroit : `app/src/scene.ts`, l. 112-119 ; `app/src/ui/shutter.ts`, l. 132-138 (point de mise au point) et l. 156 (loupe de l'écran de revue) ; `app/src/ui/topView.ts`, l. 74 (carte) ; `app/simulateur/index.html`, l. 26, 38 et 70 ; `app/src/main.ts`, l. 168.
- Ce qui est fait :
  - tourner l'appareil : `camera.inputs.removeByType("FreeCameraKeyboardMoveInput")` (« On tourne seulement : pas de clavier, de molette ni de manette, qui déplaceraient l'appareil ») ; il reste la souris et le toucher, en glissant ;
  - choisir le point de mise au point : `pointerdown` et `pointerup` sur le canevas ;
  - déplacer l'appareil : `click` sur la carte, un `<svg role="img">` sans `tabindex` ;
  - voir la photo à 100 % à un endroit : `click` sur `<img id="review-image" alt="">`, sans `tabindex`.
- Preuve (essai, `s3.cjs`, Chromium, fenêtre de 1280 × 800 px, AF-C et point sélectif) :

  | Essai | Avant | Après |
  | --- | --- | --- |
  | Focus sur le canevas, puis six appuis sur chacune de seize touches (flèches, A, D, W, S, Q, E, Entrée, Espace, Page précédente, Origine, +, −) | « AF-C · Point · 6,7 m », repère à 50 % × 50 % | « AF-C · Point · 6,6 m » (les personnages bougent), repère à 50 % × 50 % : l'appareil n'a pas tourné, le point n'a pas bougé |
  | Témoin : glissé de la souris sur le viseur | | « AF-C · Point · 500,0 m » : l'appareil a tourné |
  | Témoin : clic dans le viseur | repère à 50 % × 50 % | repère à 35,8 % × 70 % |
  | `focus()` sur la carte | | l'élément actif reste le canevas : la carte ne prend pas le focus (`tabIndex` −1) ; de même pour la photo |

  Le canevas, lui, prend le focus : Babylon.js lui donne `tabindex="1"` (`canvasTabIndex = 1` par défaut, `@babylonjs/core` 9.35.0, `Engines/abstractEngine.pure.js`, l. 1050, appliqué par `Inputs/scene.inputManager.js`, l. 150). Ordre de tabulation mesuré sur l'iPhone 14 émulé (`s1.cjs`) : le canevas d'abord, puis « Accueil », « English », « Défis », « Crédits », « Licences », « Vue de dessus », l'indicateur d'équilibre, les molettes. Le premier arrêt de la tabulation est donc un élément placé après l'en-tête à l'écran, où aucune touche n'agit.
- Critères (textes lus) : « Keyboard » (2.1.1, niveau A) : « All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints. » Tourner l'appareil d'un angle, choisir un point, placer l'appareil : seul le point d'arrivée compte. « Dragging Movements » (2.5.7, niveau AA) : « All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential […] » : tourner l'appareil ne se fait qu'en glissant. « Focus Order » (2.4.3, niveau A) : « focusable components receive focus in an order that preserves meaning and operability ».
- Ce qui marche au clavier (mesuré, voir « Vérifié ») : les molettes, les boutons, les fenêtres, le déclencheur.
- Portée : le projet ne s'est donné aucun objectif d'accessibilité écrit ; ce constat dit ce qui manque, pas une promesse non tenue. Au-delà du clavier, des boutons de visée servent aussi sur un téléphone, où glisser sur un viseur de 260 px de haut manque de précision.
- Correction proposée, par ordre de coût : (1) `canvasTabIndex: 0` dans les options du moteur (`main.ts`, l. 168), pour que le viseur prenne le focus à sa place dans la page ; (2) sur le canevas, les flèches tournent l'appareil d'un pas fixe (2° par exemple, valeur à choisir), Maj + flèches déplacent le point de mise au point, Entrée fait le point : quelques lignes dans `shutter.ts`, à côté des gestes du pointeur ; (3) la carte reçoit `tabindex="0"` et les flèches y déplacent l'appareil par pas de 0,5 m ; (4) la photo de l'écran de revue devient un bouton (ou reçoit `tabindex="0"`, `role="button"` et un nom), Entrée ouvrant la loupe au centre. Dire ces touches dans `sceneLabel` et `topViewMove`.

### INT-21 · à améliorer · Le bouton de l'indicateur d'exposition disparaît une demi-seconde sur deux quand il clignote (FEX-19, repris ici) ; la routine clique dessus dans cet état, et chaque clic lui prend de 4 à 45 s

- Endroit : `app/src/style.css`, l. 448-456 (`.flashing`, `@keyframes clignote { to { visibility: hidden; } }`) ; `app/src/ui/cameraPanel.ts`, l. 745 ; `scripts/test_app.cjs`, l. 375-382 (`setExposure`) et l. 531.
- Déjà établi : FEX-19 (`docs/audit/fiches-exposition.md`, confirmé par un second agent) montre que, hors des limites en mode A ou S, le bouton qui ouvre la fenêtre « Exposition » est invisible une demi-seconde par seconde et ne reçoit alors ni clic ni focus : un toucher sur deux se perd. Ce rapport renvoyait la correction ici. Je la reprends telle qu'elle y est précisée : une ligne, `@keyframes clignote { to { opacity: 0; } }`, à essayer dans un navigateur après la modification.
- Ce que ce rapport ajoute : la routine clique sur ce bouton pendant qu'il clignote. À la l. 529, elle passe en mode S à 1/4000 s et ISO 100 : l'ouverture clignote à f/1,4 (le contrôle le vérifie, `sDark.flashing`). À la l. 531, `setExposure({ autoIso: true })` commence par `page.click("#meter-value")`.
- Preuve (essais, Chromium en rendu logiciel ; mode S, 1/4000 s, ISO 100, sans ISO auto : « S · −0,5 IL », « f/1,4 » qui clignote ; le geste est celui de la routine, `page.click("#meter-value")`) :

  | Essai | Appels | Fenêtre ouverte | Durée d'un appel |
  | --- | --- | --- | --- |
  | `s7.cjs`, machine chargée par d'autres essais, appel abandonné après 20 s | 40 | 28 ; 12 appels sans ouverture, que le script ne distingue pas d'un abandon | de 2,0 s à 20,0 s (la limite) |
  | `s7b.cjs`, machine moins chargée, abandon après 90 s, clics sans effet comptés à part | 30 | 30 ; aucun clic sans effet, aucun abandon | médiane 9,5 s, de 3,8 s à 45,3 s |

  Playwright attend que le bouton soit visible et stable avant de cliquer, et le clignotement le lui refuse une demi-seconde sur deux : il finit par cliquer dans une phase visible, mais au bout de 4 à 45 s, là où un clic sur un bouton fixe rend la main en moins d'une seconde. Un utilisateur, lui, n'attend pas la bonne phase (FEX-19).
- Échec non expliqué de la CI (`docs/etat-des-travaux.md`, l. 80 : arrêt « à l'entrée du mode S », `page.check: Timeout 300000ms exceeded`) : un clic perdu à la l. 531 donnerait ce message, l'appel suivant attendant 300 s une case d'une fenêtre restée fermée. Mon second essai ne le confirme pas : en 30 clics, aucun n'a été perdu. Je ne sais pas si c'est la cause (voir « Je ne sais pas »).
- Correction proposée : la ligne de CSS ci-dessus ; puis rejouer `s7b.cjs`, où chaque clic doit alors rendre la main en moins d'une seconde. La routine n'a rien à changer.

### INT-06 · à améliorer · Routine : une erreur JavaScript pendant le scénario ne fait pas échouer la routine

- Endroit : `scripts/test_app.cjs`, l. 312-314 (erreurs relevées), l. 328-332 (contrôle « aucun problème affiché »), l. 1172-1185 (bilan).
- Ce qui est fait : les erreurs de la page et de la console sont gardées dans une liste, puis seulement écrites à la fin du profil :

  ```js
  const errors = [...new Set(result.errors)];
  if (errors.length) console.log(`erreurs de la console (${errors.length}) : ${errors.slice(0, 3).join(" | ")}`);
  ```

  Le compteur `failed`, qui décide du code de sortie (`process.exit(failed ? 1 : 0)`), ne compte que les contrôles (`if (!c.ok) failed++`). Le seul contrôle qui regarde les problèmes affichés par la page (« aucun problème affiché », d'après `#diagnostic`) est fait une fois, juste après le chargement (l. 328-332) ; le bloc `catch` relit `#diagnostic`, mais seulement quand la routine s'est déjà arrêtée sur une exception (l. 1144).
- Conséquence : une exception levée pendant le calcul d'une photo, une rafale ou l'ouverture d'une fiche s'affiche dans la page (`app/src/main.ts`, l. 108-109, `report("problemError", …)`) et sur la sortie de la routine, mais la routine se termine par « 0 échec(s) » si les contrôles suivants passent. La CI reste verte.
- Preuve : lecture du code ci-dessus ; je n'ai pas rejoué la routine avec une erreur injectée (un profil prend de 18 à 26 minutes, `docs/audit/architecture-application.md`, ARC-05).
- Correction proposée : à la fin de chaque profil, un contrôle « aucune erreur de la page ni de la console » (`errors.length === 0`, avec une liste courte d'erreurs admises s'il en existe, à établir sur un passage de la CI), et un second contrôle de `#diagnostic` après le dernier contrôle du simulateur.

### INT-14 · à améliorer · Routine : ce qui n'est jamais essayé, et où cet audit a trouvé des défauts

- Endroit : `scripts/test_app.cjs` en entier ; nombre d'occurrences comptées par `grep -c`.
- Preuve : la routine ouvre toutes les pages avec `?lang=fr`, sur quatre fenêtres fixes (1280 × 800 deux fois, Pixel 7 et iPhone 14 à la verticale).

  | Jamais essayé | Occurrences dans la routine | Défaut trouvé par l'audit dans cette zone |
  | --- | --- | --- |
  | Simulateur et activité en anglais (`lang=en`, bouton `#lang`) ; fiches anglaises (`fiches/en`) | 0 ; 0 | viseur de 209 px en anglais sur l'iPhone 14 émulé, sous le seuil du contrôle « viseur assez grand » (INT-04) ; pastille coupée (INT-11) ; ancre en double (INT-01) |
  | Téléphone à l'horizontale (`landscape`) | 0 | viseur de 117 × 78 px (INT-03) |
  | Largeurs de 320 et 360 px (`setViewportSize`) | 0 | viseur de 159 à 216 px, pastilles coupées (INT-04, INT-11) |
  | Clavier (`keyboard`) | 0 | INT-08 |
  | Toucher | 0 | INT-13 |
  | Thème sombre (`colorScheme`), mouvement réduit (`reducedMotion`) | 0 ; 0 | aucun (voir « Vérifié ») |
  | Retardateur (`timer`), Continu H (`"ch"`, `chx`) | 0 ; 0 | COD-02 (`docs/audit/code.md`) |
  | Boîtiers APS-C (`apsc`) | 0 | non cherché ici |
  | Fenêtre « Crédits », lien « Enregistrer la photo », page des licences | 0 ; 0 ; 0 | non cherché ici |
  | Défaut de départ de la mise au point | contrôle sans valeur (INT-05) | — |
  | Erreurs de la console | relevées, non comptées (INT-06) | — |

- Ce qui est bien couvert (lu dans le code, non rejoué) : exposition et modes (M, A, S, ISO auto, correction), bruit et profondeur de champ du viseur, grilles, loupe, vue de dessus, défis et bulletin, fiches par-dessus le simulateur, zones AF et détection, couverture AF par boîtier, rafale en Continu L, progression du chargement, téléchargement de l'accueil, activité LUM-02.
- Correction proposée, sans allonger la routine de plus de quelques secondes par profil (ces contrôles ne calculent ni photo ni flou) : (1) après le chargement, passer en anglais par le bouton de langue, refaire « viseur assez grand » et un contrôle « aucune pastille ne dépasse du viseur », revenir en français ; (2) un profil « iPhone à l'horizontale » limité au chargement et aux contrôles de mise en page ; (3) sur le profil iPhone, les mêmes contrôles de mise en page à 320 px de large ; (4) les contrôles de calcul (pénombre, positions des grilles, sommes des histogrammes) vers des tests rapides, comme le propose ARC-05.

### INT-15 · à améliorer · Ce que l'arbre d'accessibilité ne dit pas : viseur absent, valeurs sans nom, bouton nommé « M · −0,2 IL », messages réécrits chaque seconde

- Endroit : `app/simulateur/index.html`, l. 26, 70, 98, 108, 146, 149 ; `app/src/main.ts`, l. 79-82 et 121 ; `app/src/ui/cameraPanel.ts`, l. 957-961 ; `app/scripts/build-pages.mjs`, l. 416-417 et 534 ; `app/src/activities/lum02.ts`, l. 206-219.
- Preuve (essai, `s6.cjs` : arbre d'accessibilité du simulateur chargé, lu par `locator("body").ariaSnapshot()` de Playwright dans Chromium, 48 lignes, fichier `sorties/aria-simulateur.txt`) :
  1. Le viseur n'y est pas. La zone `main` commence par le paragraphe « AF-S · Point · 26,7 m » ; aucun nœud ne porte « Viseur : un parc en automne. Faire glisser pour tourner l'appareil. ». Ce texte (`sceneLabel`) est posé par `aria-label` sur un `<canvas>` sans rôle (`index.html`, l. 26 ; `main.ts`, l. 121), alors que le canevas prend le focus (INT-08) : l'élément qui reçoit le focus en premier n'a ni rôle ni nom exposés.
  2. Les quatre valeurs des molettes sont des `status` sans nom : « status: f/8 », « status: 1/100 s », « status: "100" », « status: 50 mm ». Le nom de la molette (« Ouverture ») est un texte voisin, sans lien avec la valeur.
  3. Le bouton qui ouvre la fenêtre « Exposition » s'appelle « M · −0,2 IL » : son nom est sa valeur ; ce qu'il ouvre n'est que dans son `title` (INT-09). Il porte en plus `aria-live="polite"` (l. 146).
  4. Le bouton de la mise au point affiche « AF-S · Point » et se nomme « Mise au point : AF-S : AF ponctuel, AF point sélectif » ; en zone large, « AF-C · Zone L » se nomme « Mise au point : AF-C : AF continu, AF zone large (L) » : le texte affiché n'est pas contenu dans le nom. Critère « Label in Name » (2.5.3, niveau A), texte lu : « the name contains the text that is presented visually ».
- Preuve (code) :
  5. La photo de l'écran de revue a `alt=""` (l. 70) : pour l'arbre d'accessibilité, c'est une image de décor, alors qu'elle est le résultat de l'exercice et qu'elle se touche pour ouvrir la loupe.
  6. Pendant le chargement, le message `#status` (`role="status"`, l. 98) est réécrit chaque seconde avec un compteur (« Chargement de la scène… 12 / 34 Mio reçus · 5 s », `main.ts`, l. 79-82) ; sur l'accueil, le bilan du téléchargement (`aria-live="polite"`) est réécrit toutes les 250 ms (`build-pages.mjs`, l. 417 et 534). Une zone vivante annonce chaque changement : c'est une annonce par seconde, ou quatre.
  7. Dans l'activité LUM-02, la réponse à une question (« Juste. … », « Pas tout à fait. … ») apparaît dans un paragraphe sans rôle ni zone vivante (`lum02.ts`, l. 206-219). Critère « Status Messages » (4.1.3, niveau AA), texte lu : « status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus ».
  8. La barre de progression de l'accueil (`<progress max="100" value="0">`, l. 416) n'a pas de nom.
- Limite : rien n'a été essayé avec un lecteur d'écran ; les points 5 à 8 sont lus dans le code. Un simulateur de photo reste un outil visuel : ces points comptent d'abord pour qui navigue au clavier avec une loupe d'écran ou une synthèse vocale d'appoint.
- Correction proposée, quelques attributs : `role="img"` sur le canevas (ou `role="application"` quand il répondra au clavier, INT-08) ; `aria-labelledby` de chaque valeur vers le nom de sa molette ; un nom pour le bouton de l'indicateur (« M · −0,2 IL : mode d'exposition, correction et ISO auto »), sans `aria-live` ; les noms accessibles commencent par le texte affiché (« AF-S · Point : AF ponctuel, AF point sélectif ») ; `alt` de la photo rempli avec sa légende ; le compteur du chargement dans un élément voisin marqué `aria-hidden="true"`, le message seul restant dans la zone `status` ; `role="status"` sur la réponse de l'activité ; `aria-label` sur la barre de progression.

### INT-18 · à améliorer · Trois repères graphiques sous 3:1 de contraste : la zone couverte par l'autofocus, la barre de progression, le sommet rouge de l'indicateur d'équilibre sur un viseur clair

- Endroit : `app/src/style.css`, l. 239-246 (`.af-coverage`, « en pointillés discrets »), l. 694-705 (`.progress-track`, `.progress-bar`), l. 635-638 (`.balance-vertex.bad`) et l. 591 (fond des calques, noir à 60 %).
- Critère : « Non-text Contrast » (1.4.11, niveau AA), texte lu : « contrast ratio of at least 3:1 against adjacent color(s) » pour les parties d'un graphique nécessaires à la compréhension.
- Preuve (calcul, formule du WCAG, `contraste.py` et script de seuils) :
  1. Zone couverte par l'autofocus : pointillés blancs à 40 %, posés sur la scène sans liseré sombre. Le trait vaut 0,4 × 255 + 0,6 × niveau de la scène ; il n'atteint 3:1 que là où la scène est au niveau 68 sur 255 ou plus sombre (un gris moyen à 18 % est au niveau 118) ; sur un gris au niveau 128, 1,88:1 ; sur du blanc, 1:1.
  2. Barre de progression du calcul d'une photo : partie remplie (`--texte`) contre piste (`--discret`), 2,48:1 en thème clair et 2,12:1 en thème sombre ; la piste contre le fond, 6,30:1 et 7,23:1.
  3. Sommet rouge de l'indicateur d'équilibre (`#ff4b3e`, « limite dépassée ») sur son calque : 3:1 tant que la scène derrière le calque reste au niveau 166 ou plus sombre ; 1,73:1 derrière une scène blanche. Les sommets vert et ambre restent au-dessus de 3:1 dans tous les cas (3,15:1 et 3,13:1 au pire).
- Preuve (mesure, `reperes.py`, sur deux captures de l'iPhone 14 émulé ; 800 points pris sur les quatre côtés de la zone, comparés à la scène 3 px plus loin ; les points où un calque recouvre la zone sont comptés) : aux réglages de départ (« M · −0,2 IL »), contraste médian des tirets 2,51:1, et 64 % des points sous 3:1 ; viseur surexposé (« M · +2,8 IL »), médiane 1,58:1, et 83 % des points sous 3:1.
- Ce qui est juste : le cadre lui-même se détache par le voile sombre posé autour de lui ; le repère du point de mise au point a un liseré noir à 60 % (5,74:1 sur une scène blanche) ; les lignes des grilles (0.3.56) ont un trait sombre accolé « pour rester lisible sur un fond clair comme sur un fond sombre » (`style.css`, l. 178-181). La zone AF n'a pas reçu ce traitement.
- Portée : un simulateur d'exposition montre souvent un viseur trop clair ; c'est là que la zone AF et le sommet rouge se voient le moins.
- Correction proposée : pour la zone AF, le même procédé que les grilles (un pointillé clair doublé d'un trait sombre : `box-shadow` ou `outline` à `rgb(0 0 0 / 0.35)`) ; pour la barre, une piste sans fond, bordée d'un trait de 1 px en `--discret` (6,30:1 et 7,23:1 contre le fond), la partie remplie en `--texte` se détachant alors du fond à 15,60:1 et 15,31:1 ; pour les sommets, un contour blanc d'un pixel, comme celui du point central (`.balance-point`).

### INT-02 · à améliorer · Activité LUM-02 : la source de lumière du schéma est un point jaune de 4 × 2 pixels, à 1,6:1 de contraste sur son fond

- Endroit : `app/src/activities/lum02.css`, l. 84-101 (`.act-scene`, `.act-ray`, `.act-source`) ; `app/src/activities/lum02.ts`, l. 165 et l. 183 ; `app/activites/LUM-02/index.html`, l. 28 (`value="3"`).
- Ce qui est fait : la source est un rectangle `#f2c200` de 6 unités sur la taille choisie, dans un dessin de 500 × 220 unités au fond `#fbfbf9` ; les rayons sont des pointillés `#d4a017` de 0,8 unité. La taille de départ est 3 cm (« Petite lampe »).
- Preuve (calcul, `contraste.py`, formule du WCAG) : source sur le fond du schéma 1,62:1 ; rayons 2,29:1 ; objet et mur (`#3a3a37`) 11,01:1.
- Preuve (mesure, `pages2.cjs`) : sur un écran de 390 px de large, le schéma fait 358 × 159 px et la source 4,3 × 2,1 px ; à 320 px de large, 3,4 × 1,7 px. Capture `lum02-sombre.png` : la source ne se distingue pas ; rien ne nomme, dans le dessin, la source, l'objet et le mur (le texte au-dessus dit « à gauche », « au milieu », « à droite »).
- Critère : « Non-text Contrast » (1.4.11, niveau AA), texte lu : « The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s): […] Graphical Objects Parts of graphics required to understand the content ». La source est l'objet que l'activité fait manipuler.
- Ce qui est juste : le fond du schéma reste clair en thème sombre, et tout ce qui y est dessiné a ses couleurs propres : rien ne disparaît en thème sombre (capture `lum02-sombre.png`). Les textes de la page passent tous 4,5:1 (voir « Vérifié »).
- Correction proposée : donner à la source un contour sombre (`stroke: #3a3a37`, comme l'objet) et une largeur à l'écran d'au moins quelques pixels quelle que soit sa taille ; foncer les rayons jusqu'à 3:1 au moins (`#a67c00` donne 3,7:1 sur `#fbfbf9`, à recalculer si la teinte change) ; écrire « source », « objet », « mur » dans le dessin.

### INT-19 · à améliorer · Petits défauts de libellés et de structure

Chacun est mineur ; ils sont regroupés pour être corrigés ensemble.

1. Titre de page. `app/simulateur/index.html`, l. 11 : `<title>TutoPhoto</title>`, le même que celui de l'accueil (`app/scripts/build-pages.mjs`, l. 610), dans les deux langues ; aucun `document.title` dans le simulateur (`grep` : une seule occurrence, dans `lum02.ts`, l. 232). Dans l'historique ou les onglets, rien ne distingue le simulateur de l'accueil. Critère « Page Titled » (2.4.2, niveau A), texte lu : « Web pages have titles that describe topic or purpose. » Correction : « Simulateur · TutoPhoto », « Simulator · TutoPhoto », posé par `applyLang`.
2. Deux mots anglais pour « traînée ». `app/src/i18n.ts` : « trail » (l. 363, « dog frozen, trail under the acceptable blur » ; l. 372, « trail of ») dans le bulletin, « motion blur » (l. 420, 421 et 433) dans l'indicateur d'équilibre. En français, « traînée » partout (l. 129, 138, 186, 187, 199). Le bulletin et l'indicateur parlent de la même grandeur, avec la même limite. Correction : un seul mot en anglais.
3. Nom anglais des réglages dans un texte français. `i18n.ts`, l. 78 (`previewNote`) : « Le Sony A7 III (« Live View Display ») et le Nikon Z 6 (« Apply settings to live view ») ». Les noms français existent et ont été lus le 14 novembre 2026 : « Affichage Live View » (guide d'aide du Sony A7 III en français) et « Appliquer réglages à visée écran » (manuel en ligne français du Z 6, réglage personnalisé d8). La note des grilles, elle, donne le nom français de Sony (l. 93). Correction : les noms français, que le lecteur trouvera dans ses menus.
4. Pourcentage en anglais. `build-pages.mjs`, l. 469 : « {pct} % », avec une espace ; `i18n.ts`, l. 440-443 : « % » sans espace (« 100% »). Correction : « {pct}% ».
5. Orthographe anglaise mêlée. Britannique : « centre », « towards », « judgement » (`i18n.ts`, l. 433), « practising » (`build-pages.mjs`, l. 61), « towards » (`lum02.ts`, l. 112). Américaine : « Licenses », « licenses », « license » (`i18n.ts`, l. 247 et 250 ; `build-pages.mjs`, l. 76-77), « toward » (`i18n.ts`, l. 464). Correction : choisir une orthographe et s'y tenir.
6. Groupes de boutons radio sans nom. `index.html`, l. 226 (fenêtre « Défis ») et l. 259 (fenêtre « Mode de déclenchement ») : `<fieldset>` sans `<legend>`, alors que les autres fenêtres en ont une. Correction : une légende, ou `aria-labelledby` vers le titre de la fenêtre.
7. Trois boutons du même nom. `index.html`, l. 228-230, et `app/src/ui/challenges.ts`, l. 121 : les trois boutons de la fenêtre « Défis » s'appellent tous « Fiche ». Correction : `aria-label` « Fiche SIT-01 », etc.
8. Fiche ouverte par-dessus le simulateur : son titre devient un titre de niveau 2 (`app/src/ui/ficheDialog.ts`, l. 64-69), au même niveau que ses sections. Correction : sections en niveau 3 dans la fenêtre, ou titre repéré par `aria-labelledby` seulement.

## Vérifié

Contrastes (calcul, `contraste.py`, définitions du WCAG 2.2 ; seuil de 4,5:1 pour le texte, critère « Contrast (Minimum) », texte lu)
1. `style.css`, thème clair : texte 15,60:1, texte discret 6,30:1, erreur 7,53:1, réussi 6,09:1 sur le fond ; déclencheur et bouton enfoncé 15,60:1.
2. `style.css`, thème sombre : 15,31:1, 7,23:1, 8,48:1, 11,14:1 ; déclencheur 15,31:1.
3. `pages.css` (accueil et fiches) : texte 16,30:1 et 15,31:1 (clair, sombre), texte discret 6,39:1 et 7,67:1, liens 5,88:1 et 10,06:1, bouton plein 5,88:1 et 10,06:1, bandeau de relecture 10,32:1 et 10,10:1.
4. `lum02.css` : texte, texte discret, liens, erreur, réussi de 5,63:1 à 15,60:1 en clair, de 7,23:1 à 15,31:1 en sombre.
5. Pastilles et calques du viseur (texte blanc sur noir à 60 %) : 5,74:1 dans le pire cas, une scène blanche derrière.
6. Histogrammes de l'écran de revue (0.3.57, hors du lot) : rouge, vert, bleu de 3,19:1 à 5,25:1 sur les deux fonds, au-dessus des 3:1 demandés à un graphique.

Mise en page (essais, `pages2.cjs`, `s1.cjs`, `s4.cjs`)
7. Accueil, fiche française, fiche anglaise, activité LUM-02 : aucun débordement horizontal à 320 et à 390 px de large, en clair et en sombre.
8. Simulateur : la page a la largeur et la hauteur de la fenêtre à 390 × 664, 750 × 340 et 863 × 360 px ; aucune erreur dans la console pendant ces essais.
9. Cibles des pages statiques sous 24 px : toutes relèvent d'une exception du critère « Target Size (Minimum) » (texte lu). Bouton de langue de l'accueil, 59,7 × 21 px, seul dans l'en-tête (espacement) ; liens des listes, 20 px de haut, espacés de plus de 24 px (espacement) ; fil d'Ariane et liens du pied, 17 à 19 px, dans une phrase ; curseurs de l'activité, 16 px de haut, taille fixée par le navigateur.
10. Cibles du simulateur : boutons des molettes 32 × 32 px, boutons du panneau 32 px de haut, déclencheur 40 px, indicateur d'équilibre 41,6 × 36,7 px ; « Accueil » (50,3 × 17 px) et « Licences » (61 × 17 px) à plus de 24 px des boutons voisins (espacement) ; dans les fenêtres, boutons radio de 13 × 13 px dans des étiquettes de 20 px de haut, une ligne tous les 26 px. Exception : le bouton « Vue de dessus » (INT-11).

Clavier et focus (essais, `s1.cjs`, `s3.cjs`)
11. Après le canevas (INT-08), les 22 boutons et liens du simulateur prennent le focus dans l'ordre du document : en-tête, « Vue de dessus », indicateur d'équilibre (à l'écran, l'indicateur est au-dessus de la vue de dessus), molettes, boutons du panneau, déclencheur ; aucun n'est masqué par un autre élément.
12. L'indicateur de focus du navigateur est gardé partout (`outline` calculé : `auto 1px` sur les 23 arrêts) ; aucune règle `outline: none` dans les trois feuilles de style.
13. Fenêtres (`<dialog>` ouvert par `showModal`) : Entrée sur le bouton ouvre la fenêtre, le focus va au premier bouton radio, les flèches changent le choix, Tab reste dans la fenêtre, Échap la ferme et rend le focus au bouton d'ouverture.
14. Déclencheur au clavier : un clic sans pointeur vaut un appui bref (`shutter.ts`, l. 147-151, lu ; non essayé).

Mouvement (CSS lu, essai `s6.cjs`)
15. Avec « réduire les animations », la valeur hors limites ne clignote plus (`animation: none` mesuré) et reste dans la couleur d'erreur (`rgb(155, 28, 28)`), comme le dit `docs/camera-physique.md`, l. 490.
16. Clignotements : une alternance par seconde pour la valeur hors limites, une toutes les deux secondes pour les hautes lumières ; le critère « Three Flashes or Below Threshold » (texte lu) vise plus de trois éclairs par seconde.

Langue et libellés
17. `lang` de la page : posé dans chaque page et mis à jour au changement de langue (`main.ts`, l. 112 ; `build-pages.mjs`, l. 302 et 442 ; `lum02.ts`, l. 231) ; le lien de langue des fiches porte `hreflang` et `lang`.
18. `i18n.ts` : 223 clés en français, les mêmes 223 en anglais, dans le même ordre (script) ; ponctuation française (espace avant « : », « ; », « ? ») et anglaise (sans espace) respectée dans tous les textes ; une seule clé jamais lue, `meter` (déjà relevée par FEX-11).
19. Termes du Nikon Z 6, français : « AF ponctuel », « AF continu », « Mode de mise au point », « Mode de zone AF », « AF point sélectif », « AF zone large (S) », « AF zone large (L) », « AF zone automatique », « Détect. visage-yeux AF zone auto », « Détection visage/yeux activée », « Détection des visages activée », « Détection des animaux », « Mode de déclenchement », « Vue par vue », « Continu L », « Continu H », « Continu H (étendu) », « Retardateur », « Sélecteur de mode », « Manuel » (mode M), « Auto à priorité ouverture », « Auto à priorité vitesse », « Correction d'exposition », « Contrôle de la sensibilité auto. », « Sensibilité maximale », « Vitesse d'obturation minimale », « vps » : tous trouvés mot pour mot dans le manuel en ligne français (75 pages lues, `termes_nikon.py`).
20. Termes du Nikon Z 6, anglais : « Single AF », « Continuous AF », « Focus mode », « AF-area mode », « Single-point AF », « Wide-area AF (S) », « Wide-area AF (L) », « Auto-area AF », « Auto-area AF face/eye detection », « Face and eye detection on », « Face detection on », « Animal detection », « Release mode », « Single frame », « Continuous L », « Continuous H », « Continuous H (extended) », « Self-timer », « Mode dial », « Manual » (mode M), « Aperture-priority auto », « Shutter-priority auto », « Exposure compensation », « Auto ISO sensitivity control », « Maximum sensitivity », « Minimum shutter speed », « fps » : tous trouvés mot pour mot dans le manuel en ligne anglais (75 pages lues).
21. « ISO auto » sur la molette : le manuel dit que l'écran de prise de vue affiche « ISO AUTO » (`06_shooting_controls_02.html`, en français et en anglais) ; l'interface l'écrit avec une seule majuscule.
22. Citations des notes : « Apply settings to live view » (Nikon, réglage d8) et « intended as a guide only » (Nikon, histogrammes) sont dans le manuel anglais ; « Live View Display », « Rule of 3rds Grid » et « Grille règle des tiers » sont dans le guide d'aide du Sony A7 III (anglais et français).
23. Libellés du simulateur cités entre guillemets par les fiches (sections « Simulateur », « Exercice », « Défi », « Activité », « Recette ») : 40 en français, 39 en anglais, tous présents dans l'interface, tels quels ou composés (« Vitesse (auto) », « Infos : histogrammes ») ; les autres textes entre guillemets sont des termes des manuels.
24. Accueil et activité LUM-02 : tutoiement partout (INT-07 pour le simulateur).

Routine
25. `checkLinks`, joué seul sur le site construit dans la copie : 48 pages, 515 liens, aucun cassé ; il ne voit pas l'ancre en double (INT-01).
26. Le contrôle « exposition par défaut : M et ISO auto (Z 6) » lit l'état avant tout réglage (l. 395-397) ; les contrôles de grilles, d'histogrammes et de couverture AF comparent des mesures à des valeurs calculées, avec des tolérances écrites.
27. Les attentes de la mise au point (`waitBadge`, `waitMetres`, `balanceLine`) attendent un état de la page, pas une durée ; il reste onze délais fixes (`waitForTimeout`, de 0,5 à 2,5 s), voir « Je ne sais pas ».

## Je ne sais pas

1. Safari et un vrai téléphone. Tout est mesuré dans Chromium sans écran, en rendu logiciel, sur des fenêtres émulées. Je ne sais pas ce que donnent, sur un iPhone, `html, body { height: 100% }` et `max-height: calc(100vh - 2rem)` quand les barres de Safari se replient, ni la hauteur réelle du viseur.
2. Police. Mes mesures sont faites avec Inter ; la CI emploie DejaVu Sans, plus large (238 ou 254 px de viseur sur l'iPhone 14 émulé, d'après `docs/etat-des-travaux.md`). Les seuils où un texte passe à la ligne (INT-04, INT-11, INT-12) changent avec la police ; les mécanismes non.
3. Lecteur d'écran. Aucun essai avec VoiceOver, TalkBack ou NVDA : INT-15 décrit l'arbre d'accessibilité de Chromium et le code, pas ce qui est prononcé.
4. Cause de l'échec non expliqué de la routine (`docs/etat-des-travaux.md`, l. 80 : `page.check: Timeout 300000ms exceeded` « à l'entrée du mode S »). Un clic perdu sur le bouton qui clignote (INT-21) donnerait ce message, mais 30 clics d'essai n'en ont perdu aucun ; je n'ai pas lu le journal de ce passage de la CI.
5. Délais fixes de la routine (onze `waitForTimeout`, l. 337 à 1124). Deux sont suivis d'une lecture sans nouvel essai : l. 459 (2 s, puis lecture du bruit au point du sol) et l. 476-481 (1,5 s et 0,8 s, puis mesure de la netteté du fond). Je ne sais pas s'ils suffisent toujours dans la CI, où une image avec la profondeur de champ « peut prendre plusieurs secondes » (l. 310) ; je n'ai vu aucun échec qui le prouve.
6. Manuel du Canon EOS RP et de l'EOS 2000D : non cherchés ; les termes de Canon viennent du manuel de l'EOS 850D. Les noms de grilles de Canon et l'illustration du Nikon D5600 cités par `gridNote` (0.3.56, hors du lot) ne sont pas relus.
7. Numéros des critères du WCAG (2.1.1, 2.5.8…) : donnés de mémoire ; les fichiers source lus ne les portent pas, et la page publiée (`www.w3.org`) n'est pas joignable. Les noms et les textes des critères sont lus.
8. Anglais idiomatique. « notion » pour une fiche (« 19 notions »), « the photo background » pour « le fond photo », « I'm in a situation » : je n'ai pas de source pour dire qu'un autre mot serait meilleur ; à faire relire par un anglophone.
9. Durée de la routine : non mesurée ici (ARC-05 l'a fait).
