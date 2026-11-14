# Audit du lot « Interface : mise en page, accessibilité, libellés ; routine de test »

État : constats non contre-vérifiés

Rapport en cours d'écriture (14 novembre 2026) : les constats sont ajoutés au fur et à mesure, dans l'ordre où ils sont trouvés ; ils seront classés par gravité à la fin. Un premier agent a écrit l'en-tête, INT-01 et INT-02, puis a été coupé par la limite d'usage ; un second agent a repris le même jour, avec son dossier de travail (copie du dépôt, site construit, scripts), et écrit la suite.

- Date : 14 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail à la version 0.3.58 (code de la version 0.3.57). Ce qui date du 12 novembre (grilles de cadrage, 0.3.56 ; histogrammes de l'écran de revue, 0.3.57 ; routine dans la CI, 0.3.54) est hors du lot, sauf quand un défaut plus ancien s'y voit.

## Périmètre

- Ce que voit et touche l'utilisateur : `app/src/style.css`, `app/simulateur/index.html`, `app/activites/LUM-02/index.html`, `app/src/activities/lum02.css`, les pages produites par `app/scripts/build-pages.mjs` (accueil, fiches, `pages.css`), les libellés français et anglais de `app/src/i18n.ts`.
- La routine de test `scripts/test_app.cjs`.
- Le code de `app/src/ui/` et de `app/src/main.ts` est lu quand il pose un attribut, un texte ou une classe de la page. Les bogues de logique relèvent de `docs/audit/code.md` ; la structure de la routine (un seul scénario, un seul bloc, durée) est déjà le constat ARC-05 de `docs/audit/architecture-application.md` et n'est pas reprise ici.

## Méthode

1. Lecture complète des fichiers du lot.
2. Contrastes : toutes les paires de couleurs des trois feuilles de style, calculées par un script (`contraste.py`) avec les définitions « relative luminance » et « contrast ratio » du WCAG 2.2, relues (voir Sources).
3. Essais dans Chromium sans écran (Playwright 1.63.0, rendu logiciel), sur le site construit dans une copie du dépôt, hors du dépôt : tailles des cibles, débordement, ancres, schéma de LUM-02, puis le simulateur. Police de la machine d'essai : Inter (la CI emploie DejaVu Sans, plus large). Ces essais émulent l'écran et le toucher, pas un processeur graphique ni Safari, ni un lecteur d'écran.
4. Critères d'accessibilité cités d'après leur texte, relu le 14 novembre 2026.
5. Libellés : termes cherchés dans les manuels en ligne de Nikon, Sony et Canon.

Scripts, pages enregistrées et captures : dossier `audit/interface/` du bloc-notes de la session, hors du dépôt (`scripts/`, `pages/`, `captures/`). Les numéros de ligne sont ceux de la version 0.3.58.

## Sources

### Relues le 14 novembre 2026

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, texte source des critères et des définitions, dépôt `w3c/wcag`, branche `main` (numéro de commit non relevé : l'interface de GitHub n'est pas joignable pour ce dépôt) | `https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/<version>/<critère>.html` et `…/guidelines/terms/<version>/<terme>.html` | `wcag/sc_*.html`, `wcag/terms_*.html` |

### Non relues

- W3C, page publiée du WCAG 2.2 (`https://www.w3.org/TR/WCAG22/`) et pages « Understanding » : source non relue, hôte non joignable. Les numéros des critères (1.4.3, 2.5.8…) ne sont pas dans les fichiers source lus : ils sont donnés de mémoire, à côté du nom du critère, qui, lui, est lu.

## Constats

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

### INT-02 · à améliorer · Activité LUM-02 : la source de lumière du schéma est un point jaune de 4 × 2 pixels, à 1,6:1 de contraste sur son fond

- Endroit : `app/src/activities/lum02.css`, l. 84-101 (`.act-scene`, `.act-ray`, `.act-source`) ; `app/src/activities/lum02.ts`, l. 165 et l. 183 ; `app/activites/LUM-02/index.html`, l. 28 (`value="3"`).
- Ce qui est fait : la source est un rectangle `#f2c200` de 6 unités sur la taille choisie, dans un dessin de 500 × 220 unités au fond `#fbfbf9` ; les rayons sont des pointillés `#d4a017` de 0,8 unité. La taille de départ est 3 cm (« Petite lampe »).
- Preuve (calcul, `contraste.py`, formule du WCAG) : source sur le fond du schéma 1,62:1 ; rayons 2,29:1 ; objet et mur (`#3a3a37`) 11,01:1.
- Preuve (mesure, `pages2.cjs`) : sur un écran de 390 px de large, le schéma fait 358 × 159 px et la source 4,3 × 2,1 px ; à 320 px de large, 3,4 × 1,7 px. Capture `lum02-sombre.png` : la source ne se distingue pas ; rien ne nomme, dans le dessin, la source, l'objet et le mur (le texte au-dessus dit « à gauche », « au milieu », « à droite »).
- Critère : « Non-text Contrast » (1.4.11, niveau AA), texte lu : « The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s): […] Graphical Objects Parts of graphics required to understand the content ». La source est l'objet que l'activité fait manipuler.
- Ce qui est juste : le fond du schéma reste clair en thème sombre, et tout ce qui y est dessiné a ses couleurs propres : rien ne disparaît en thème sombre (capture `lum02-sombre.png`). Les textes de la page passent tous 4,5:1 (voir « Vérifié »).
- Correction proposée : donner à la source un contour sombre (`stroke: #3a3a37`, comme l'objet) et une largeur à l'écran d'au moins quelques pixels quelle que soit sa taille ; foncer les rayons jusqu'à 3:1 au moins (`#a67c00` donne 3,7:1 sur `#fbfbf9`, à recalculer si la teinte change) ; écrire « source », « objet », « mur » dans le dessin.

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

### INT-07 · incohérent · Le simulateur vouvoie, l'accueil, l'activité et les fiches tutoient

- Endroit : `app/src/i18n.ts`, l. 39, 69, 70, 147, 170, 209, 226 ; `app/scripts/build-pages.mjs`, l. 39 et 463 ; `app/src/activities/lum02.ts`, l. 51, 67-73 ; `content/fr/`.
- Ce qui est écrit, dans le simulateur : « touchez le viseur » (l. 39 et 70), « celui que vous touchez » (l. 69), « Touchez la carte » (l. 147), « maintenez le déclencheur appuyé » (l. 170), « Touchez la photo » (l. 209), « votre appareil demande de réduire les animations » (l. 226).
- Ce qui est écrit ailleurs : accueil, « Pour mesurer ton réseau », « réessaie, ou change de réseau » ; activité LUM-02, « Change la taille de la source », « Ta lampe donne une ombre trop dure […] que fais-tu », « Essaie avec le curseur » ; fiches, « tu peux aligner Sophia » (SIT-01), « c'est toi qui choisis la vitesse » (EXP-05), « ton choix » (MAP-05). La fiche MES-07 dit « ton appareil demande de réduire les animations » pour le message même que l'interface écrit « votre appareil demande de réduire les animations ».
- Preuve : `grep -nE "vous|votre|ouchez|aintenez" app/src/i18n.ts` donne les sept lignes ci-dessus ; aucun « tu », « ton », « ta » dans la partie française de `i18n.ts`. `CLAUDE.md` demande le tutoiement ; aucune page de `docs/` ne décide du vouvoiement pour l'interface (`grep -i "tutoie\|vouvoie"` : rien).
- Correction proposée : tutoyer dans le simulateur (« touche le viseur », « celui que tu touches », « Touche la carte », « maintiens le déclencheur appuyé », « Touche la photo », « ton appareil demande… »). Sept textes ; la routine n'en lit aucun.

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

### INT-09 · à améliorer · Des explications ne sont que dans des infobulles (`title`) : sur téléphone et au clavier, rien ne dit pourquoi la vitesse clignote

- Endroit : `app/src/ui/cameraPanel.ts`, l. 585-587 (`limitText`), l. 725-726 (`output.title`), l. 732 (`loupeButton.title`), l. 746 (`meterValue.title`) ; `app/src/ui/reviewInfo.ts`, l. 153 ; `app/src/ui/shutter.ts`, l. 167 ; `app/src/i18n.ts`, l. 28, 40, 150, 162, 164-165, 207, 211.
- Ce qui est fait : sept textes de `i18n.ts` ne sont écrits que dans un attribut `title` :

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

## Vérifié

(section remplie plus bas, au fur et à mesure)

## Je ne sais pas

(section remplie plus bas, au fur et à mesure)
