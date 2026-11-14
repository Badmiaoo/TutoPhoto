# Audit du lot « Interface : mise en page, accessibilité, libellés ; routine de test »

État : constats non contre-vérifiés

Rapport en cours d'écriture (14 novembre 2026) : les constats sont ajoutés au fur et à mesure ; ce qui reste à couvrir est dit en fin d'en-tête.

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

## Vérifié

(section remplie plus bas, au fur et à mesure)

## Je ne sais pas

(section remplie plus bas, au fur et à mesure)
