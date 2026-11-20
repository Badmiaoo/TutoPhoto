# Changelog

Évolutions du dépôt, de la plus récente à la plus ancienne. Chaque pull request fusionnée donne une version : elle ajoute ici sa section, que la CI contrôle (`scripts/changelog.py check`). Après la fusion, le workflow `.github/workflows/tag.yml` pose le tag annoté `vX.Y.Z` sur le commit de fusion et publie la release GitHub correspondante, avec le texte de cette section.

## Numérotation `vX.Y.Z`

- X : 0 jusqu'à la publication de la V1.
- Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`.
- Z : tout le reste (textes, sources, documentation, scripts, CI) ; remis à 0 quand Y augmente.

## Rubriques

Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré.

## [0.3.76] - 2026-11-20

Sujet 16 du plan de corrections de l'audit (`docs/audit/README.md`) : fiches de mise au point et situations, limites à dire et compléments (FMA-04, FMA-07, FMA-18, FMA-21 ; de RST-09, la ligne de SIT-01). Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc Z. Depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), les parts anglaises du sujet sont sans objet : relu dans le code, plus de `content/en/`, plus de `app/src/i18n.ts`, une seule table de textes (`app/src/texts.ts`). La règle de couverture elle-même (RST-09) attend la décision D27 de Julien : elle n'est pas changée.

### Ajouté

- SIT-01, recette : une ligne « Lumière » (FMA-07) : par ciel couvert, tout le ciel nuageux est la source, bien plus grande que Sophia : lumière douce, ombres peu marquées (LUM-02) ; rien à régler, la scène n'a que la lumière de la photo à 360° du parc, prise par ciel couvert (page de Poly Haven citée) ; dans TutoPhoto, les ombres au sol sont floues, d'un réglage choisi à vue, et ne sont pas calculées depuis ce ciel (choix 4).
- SIT-05, après la liste de la recette : « Pour voir la profondeur de champ jouer » (FMA-18) : le point sur Sophia, au 85 mm, en cadre horizontal (en cadre vertical, Dennis sort du cadre), à f/1.4, la zone nette va de 6,3 m à 6,8 m environ et le bulletin écrit « manqués : Dennis, Percy », dont les yeux sont environ 30 cm devant ceux de Sophia ; à f/2, il écrit « réussi » ; au 50 mm, le groupe reste dans la zone nette même à f/1.4 ; sur la photo, la différence de netteté se voit à peine, même avec la loupe (choix 1 à 3).
- NET-06, « Simulateur » : le fond est une photo prise d'un seul point, placée à 500 m ; quand l'appareil se déplace de quelques mètres, ce qu'elle montre (arbres, bâtiments, sol) change à peine de taille et de place, et ses arbres et ses bâtiments ont le flou d'un fond très lointain (FMA-04, choix 5) ; sur la photo calculée, son sol aussi, jusqu'aux pieds des personnages, alors que le viseur le laisse net (défaut trouvé par la relecture, choix 10).
- `docs/contenus.md` : la règle de la section « Notions » des fiches de situation : les notions clés, dans l'ordre de `key_notions`, puis les autres notions que la recette cite, dans l'ordre où elle les cite ; chacune renvoie à la situation dans le référentiel ; la règle de couverture, qui lit le champ `situations`, reste la même (D27) (FMA-21).
- Sections « Notions » : BOI-07 et MAP-04 dans SIT-01, MAP-09 dans SIT-06 (FMA-21) ; la page de BOI-07 gagne sa section « Situations » (ligne de RST-09), celle de MAP-04 y liste SIT-01, celle de MAP-09 SIT-06.
- `data/referentiel/map.yaml` : SIT-01 au champ `situations` de MAP-04, SIT-06 à ceux de MAP-06 et de MAP-09 (choix 7) ; les comptes de couverture de `scripts/coverage.py` ne changent pas, et sa ligne des renvois passe de 381 à 384, dont 183 sans retour au lieu de 180 (aucune de ces trois notions n'est une notion clé de la situation).
- `data/sources.yaml` : `polyhaven-autumn-hockey`, la page de la photo à 360° du parc (« Soft midday overcast light in an autumn park […] diffuse shadows »), citée par SIT-01.
- `docs/propositions.md`, section 5 : « Fiches de mise au point et situations : limites et compléments », dix choix.
- `docs/tests-a-faire-faire.md` : T17, SIT-05 au 85 mm sur un téléphone, couché puis droit.

### Modifié

- SIT-06 : section « Notions » remise dans l'ordre de la règle (MAP-06 après BOI-08 et MAP-09) ; la recette dit de garder le doigt sur « Déclencher » pour la rafale.
- `docs/etat-des-travaux.md` : fin de la version 0.3.75 relue, lignée des sessions (profondeur 7 sur 8), Sujet 16 ; à la ligne de FMA-23 de « Défauts connus, hors du plan », l'échec du profil iPhone au commit 358d303 de la version 0.3.75 ; la ligne des libellés de SIT-01 et de SIT-06 est retirée ; deux défauts trouvés par la relecture y entrent : la projection du sol du fond, qui ne fonctionne pas (le sol de la photo est flou jusqu'aux pieds des personnages sur la photo calculée), et le repère de mise au point qui reste à sa place dans le canevas quand le téléphone tourne ; « Leçons pratiques » : les rejeux des fiches dans le simulateur.

### Corrigé

- Libellés de l'écran dans les fiches (ligne de « Défauts connus, hors du plan » relevée au contrôle final de la version 0.3.68) : « Détection visage/yeux activée » dans SIT-01, au lieu de « détection des visages et des yeux » ; « Détection des animaux » et « Continu H (5,5 vps) » dans SIT-06, au lieu de « détection des animaux » et « Continu H », qui ne distinguait pas « Continu H (étendu) (12 vps) » ; mêmes libellés dans les exercices de BOI-08 et de BOI-12, et « AF zone automatique » au lieu de « zone automatique ».

Non fait, et pourquoi : la règle de couverture de RST-09, qui attend D27 ; la documentation qui dit que le sol de la photo est projeté sur un plan (`docs/camera-physique.md`, `docs/questions-ouvertes.md`, commentaire de `app/src/scene.ts`), laissée au Sujet 17, et le rendu de ce sol, qu'aucun sujet ne porte (choix 10) ; la ligne de SIT-01 dont la recette donne « de 5,7 m à 7,8 m », calculée à 6,6 m tout rond, quand l'écran affiche 5,7 m – 7,7 m pour une mise au point affichée à 6,5 ou 6,6 m : ce genre d'écart d'arrondi est celui de FMA-20, réfuté par la contre-vérification de l'audit.

Essais : `validate.py` (0 erreur ; l'avertissement `github-pages-limits`, déjà sur `main`), `coverage.py` (mêmes comptes de couverture que sur `main` : « Situation réelle » 30, 3 situations rédigées sur 49, jalon 13 sur 17 ; renvois notion → situation : 384, dont 183 sans retour, au lieu de 381 et 180), `changelog.py check`, `check_public.py --commits all`, construction des fiches (22 ; sections « Situations » relues dans les pages produites : BOI-07 → SIT-01 ; MAP-04 → SIT-01, SIT-06 ; MAP-06 → SIT-01, SIT-06 ; MAP-09 → SIT-01, SIT-05, SIT-06), règle de la section « Notions » contrôlée par un script de la session (juste sur la branche ; SIT-01 et SIT-06 en écart sur `main`). Rejeux dans le simulateur construit, Chromium sans écran, rendu logiciel, 1280 × 800 sauf mention. SIT-05 : recette au 50 mm et à f/8, défi réussi trois fois ; au 85 mm, le point sur l'œil de Sophia (6,5 ou 6,6 m), « manqués : Dennis, Percy » à f/1.4 quatre fois sur quatre, réussi à f/2 quatre fois sur quatre, dès f/1.8 deux fois sur trois ; au 50 mm et à f/1.4, réussi deux fois, zone nette 5,9 m – 7,3 m ; à la loupe, le visage de Dennis se distingue à peine entre f/1.4 et f/2 ; Pixel 7 émulé tenu droit, cadre de 294 × 441 px, la tête de Dennis sort du cadre au 85 mm ; couché, 188 × 125 px, les quatre visages y sont. SIT-01, recette (f/2, 1/1600 s, ISO 100, zone nette 5,7 m – 7,7 m) : défi réussi trois fois sur trois. SIT-06, recette en « Continu H (5,5 vps) » : deux rafales de 8 vues, défi réussi sur 5 et sur 3 vues, les autres manquant le chien : hors du cadre, ou mise au point sautée sur le sol à 5,8 m (la fiche le dit quand sa tête passe derrière le groupe ou sort de la zone couverte ; la position du chien dans ces vues n'a pas été relue) ; f/2.5, zone nette 7,1 m – 12,1 m, traînée du chien 0,8 px. BOI-08 : vue par vue, défi réussi à la seconde vue ; à 1/4000 s sans ISO auto, f/1.4 clignote et l'indicateur dit −0,5 IL ; avec l'ISO auto, ISO 125. Sol de la photo au pied de Sophia, point sur son œil à 6,6 m : dans le viseur, aperçu de la profondeur de champ actif, même netteté à f/1.4 et à f/16 (variance du laplacien à quatre voisins, sur la luminance d'une bande de 100 px de la capture : 64,8 et 64,9), alors que les arbres y passent de 5,4 à f/1.4 à 44,1 à f/16 ; le contrôle final, par sa propre mesure, trouve d'autres valeurs dans le même sens ; sur la photo calculée, le sol est flou à f/1.4 et net à f/16 (captures de la relecture). Page de Poly Haven relue par Claude le 20 novembre 2026. La routine n'a pas été lancée sur la machine de Claude : la CI la lance sur ses quatre profils (résultats dans la pull request).

Relecture : un seul agent, sous les deux angles (sources et vérité ; débutant devant la fiche), au commit 47af3b9 : neuf constats, tous repris. R1, trouvé en vérifiant la phrase de NET-06 : la projection du sol du fond ne fonctionne pas (Babylon.js 9.35.0 ne la compile qu'avec une texture de réflexion cubique, et la sphère reçoit la photo en texture diffuse), si bien que la photo calculée floute le sol de la photo jusqu'aux pieds des personnages ; vérifié par Claude dans le code de Babylon.js, sur les captures du relecteur et par une mesure du viseur, qui laisse ce sol net ; NET-06 le dit, le défaut entre dans « Défauts connus », la documentation contraire est laissée au Sujet 17 (choix 10). R2, la justification du choix 2 prenait les z de la scène au lieu des profondeurs le long de l'axe incliné de l'appareil, et un œil de Sophia jusqu'à 6,64 m : corrigée (6,280 et 6,296 m ; de 6,529 à 6,612 m ; à f/2, Dennis n'est manqué que 1,8 % du temps au plus). R3, le calcul du cadre vertical ne montrait pas que Dennis en sort : refait autour de l'axe de départ (± 0,88 m ; yeux de Dennis à −1,00 et −1,06 m). R4, le chiffre de 8 % d'écart de netteté à la loupe n'était pas reproductible (de 6 à 46 % selon la zone et le calcul) : retiré. R5, la phrase de `docs/contenus.md` sur D27 se lisait comme une décision prise : réécrite. R6, SIT-05 : « le bulletin écrit « réussi » » au lieu de « le bulletin les retrouve », et « si tu as fait le point sur un autre visage, touche le sien ». R7, SIT-01 : « d'un réglage choisi à vue » au lieu de « réglées à l'œil », à côté de l'œil de Sophia. R8, T17 complété (repère qui reste à sa place quand le téléphone tourne, cadre couché de 188 × 125 px), et le défaut du repère entre dans « Défauts connus ». R9, les essais, la relecture, T17 et la ligne des choix manquaient au changelog et à la page d'état : écrits. Vérifié juste par le relecteur : le retrait de l'anglais ; les libellés de l'écran ; les chiffres de SIT-05 (zones nettes ; Dennis et Percy de 2 à 4 cm devant la zone nette, à 1,1 et 1,2 fois le flou acceptable ; de 23 à 33 cm devant Sophia) ; le cadre du Pixel 7 ; le déplacement du fond (0,6 % et 0,34° pour 3 m ; 1,7 % et 0,97° à 8,5 m ; mesuré 0,35°) ; la ligne « Lumière » (Tiffen et Poly Haven relus) ; la règle « Notions » ; les pages construites ; `validate.py`, `coverage.py`, `changelog.py check`, `check_public.py --commits all` (0 problème sur 361 commits) ; les commits.

Contrôle final, au commit 9fd53c2, par un agent qui n'a rien écrit de la version : fusionnable, une fois la CI verte, ce paragraphe écrit et la description de la pull request réécrite. Repris aussi : F1, la ligne des renvois de `coverage.py` change (de 381 à 384, dont 183 sans retour au lieu de 180), ce que le changelog et le choix 7 taisaient ; F2, l'ordre des valeurs des arbres dans le viseur était inversé ; F3, le choix 5 citait « changent » au lieu de « change » et bornait la direction à 0,3° au lieu de 0,34° ; F4, la leçon sur `build-pages.mjs` omettait `pages.css` et ce qu'il lit. Remarques reprises : la ligne de FMA-23 de « Défauts connus », resserrée en une phrase ; la raison pour laquelle le viseur voit le vrai sol (carte de profondeur avec le sol invisible des ombres), dans la ligne du sol de la photo ; le seuil de Percy, calculé avec √2 ; la position du chien dans les vues ratées de SIT-06, non relue, dite ; la durée des rejeux, dite relevée à la main. Non reprise : faire tenir le téléphone à l'horizontale dès les réglages de SIT-05, pour éviter le défaut du repère après une rotation (R8), à voir après T17. Vérifié juste par le contrôle : chaque point du sujet fait ou son écart dit ; R1 dans le code de Babylon.js ; la phrase de NET-06 ; R2 à R9 repris, avec les chiffres recalculés (profondeurs le long de l'axe de 6,2795 et 6,2959 m, seuil de Dennis à f/2 de 6,6054 m, cadre vertical de ± 0,883 m, œil de Sophia de 6,5286 à 6,6116 m) ; les sorties des rejeux ; les libellés ; la ligne « Lumière » ; la règle « Notions » ; les trois renvois et l'entrée de Poly Haven ; la cohérence des pages ; la page d'état ; `validate.py`, `changelog.py check`, `check_public.py --commits all` (0 problème sur 362 commits) et la construction des fiches ; les commits. Agents de la version : relecteur 442 409 jetons, contrôle final 443 849 jetons.

## [0.3.75] - 2026-11-20

Sujet 15 du plan de corrections de l'audit (`docs/audit/README.md`) : fiches d'exposition, limites du simulateur, formulations, liens vers les sources (FEX-03, FEX-04, FEX-07, FEX-09, FEX-11, FEX-12, FEX-14 ; de FEX-08, la seule phrase du mode P). Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc Z. Depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), les parts anglaises du sujet sont sans objet : relu dans le code, plus de `content/en/`, plus de `app/src/i18n.ts`, une seule table de textes (`app/src/texts.ts`). Les cinq écarts de FEX-08 entre le référentiel et le simulateur (diaphragme animé, rideau animé, « l'appareil explique son choix », alerte de vitesse trop lente, mode silencieux) attendent D17 : rien n'est écrit dans les fiches ; leurs lignes sont dans « Décisions en attente » de `docs/etat-des-travaux.md`.

### Ajouté

- MES-10, « Simulateur » : « Le mode P n'est pas simulé : seuls les modes M, A et S le sont » (FEX-08) ; la vitesse minimale « Automatique » du Z 6, choisie d'après la focale, plus rapide au téléobjectif, sans règle dans la page ; le départ de TutoPhoto à 1/30 s, valeur que le manuel du D850 fixe avec un objectif sans microprocesseur et sans données d'objectif ; la sensibilité maximale de départ, ISO 6400 dans TutoPhoto et ISO 51 200 sur le Z 6 (FEX-14).
- MES-04, « Simulateur » : la limite de TutoPhoto, sa mesure de la lumière donne la même valeur où que tu vises (12,5 IL) ; la correction n'y rattrape aucune erreur de mesure (FEX-09). Rien sur le « quand corriger » (neige, contre-jour), qu'aucune page lue ne source.
- Liens vers les pages françaises du manuel du Z 6 dans les fiches EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08 et BOI-12, à côté des pages anglaises (FEX-11, point 4) ; BOI-12 cite « Specifications » pour les délais du retardateur et « Defaults » pour ses deux valeurs par défaut (FEX-04).
- `data/sources.yaml` : `nikon-z6-specifications-fr`, `nikon-z6-indicators-fr`, `nikon-z6-iso-button-fr`, `nikon-z6-defaults-fr`, `nikon-d850-manual-adjustment` ; au label de `nikon-z6-specifications`, les délais du retardateur et la cadence du Continu H (étendu) ; à celui de `nikon-z6-iso-settings-fr`, la phrase sur « Automatique ».
- `docs/propositions.md`, section 5 : « Fiches d'exposition : limites, formulations, liens », dix choix.
- `docs/historique.md` : la consigne de Julien du 20 novembre 2026, chaque session créée au niveau d'effort le plus haut ; `docs/etat-des-travaux.md`, « Mandat en cours », la reprend.

### Modifié

- EXP-06 : « le Z 6 va de ISO 100 à 51 200, et plus bas ou plus haut en réglages étendus, Lo et Hi, d'après la page du manuel citée plus haut ; TutoPhoto s'arrête à 6400, limite choisie pour ses six boîtiers et pas encore étendue », au lieu de « TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit », qui donnait la cause à l'envers (FEX-03).
- BOI-12 : « jusqu'à environ 12 vues par seconde au Z 6 (9 en NEF 14 bits) » en Continu H (étendu) (FEX-04).
- EXP-05 et BOI-07 : 30 s à 1/4000 s dites limites de TutoPhoto, le Z 6 allant jusqu'à 1/8000 s ; BOI-07 : dans le parc, seule la limite rapide s'atteint, d'autant plus tôt que l'ouverture est grande, la sensibilité haute ou la correction négative, sans seuil d'ISO (FEX-07).
- MES-10 : la règle du D850 dite sans la prêter au Z 6 (l'ISO auto du D850 descend jusqu'à ISO 64 ; TutoPhoto en tire ISO 100, le bas de la plage normale du Z 6), et la seconde règle, « en mode A, seulement si la vitesse passerait sous la vitesse minimale », donnée comme une précision du D850 (FEX-14, FEX-12 point 4).
- Titres exacts des pages de Nikon, ceux de leur balise `title` : « The ISO (ISO Sensitivity) Button », « The Exposure Compensation Button », « ISO Sensitivity Settings », dans les fiches, `data/sources.yaml`, `docs/camera-physique.md` et le commentaire de `app/src/camera/exposureModes.ts` ; « Commande correction d'exposition » pour la page française (FEX-11, point 3).
- Simulateur, note de la fenêtre « Aperçu » : « il faut lire l'indicateur d'exposition et anticiper », au lieu de « lire la cellule » (FEX-11, point 1) ; même phrase dans `docs/camera-physique.md`. La ligne de « Défauts connus, hors du plan » qui le notait est retirée.
- `docs/camera-physique.md` et `app/src/camera/exposureModes.ts` : « le bas de sa plage normale » au lieu de « sa sensibilité la plus basse » pour ISO 64 sur le D850 (contre-vérification de FEX-14 ; le D850 descend plus bas en réglages étendus, page « Manual Adjustment ») ; la vitesse minimale « Automatique » décrite comme la page la décrit, au lieu de « sans règle publiée ».
- `docs/etat-des-travaux.md` : fin de la version 0.3.74 relue, lignée des sessions (profondeur 6 sur 8), Sujet 15.

### Corrigé

- EXP-06 : « se voient » au lieu de « se voit » (FEX-12, point 2).
- Simulateur, note du mode de déclenchement : « Réglages par défaut du Z 6 : 3 vues par seconde en Continu L, 10 s pour le retardateur », au lieu de « choisis, les pages lues ne les donnant pas », que la page « Defaults » dément (relu le 20 novembre 2026).

Non fait, et pourquoi : le point 1 de FEX-11 (un seul nom dans les fiches) et le point 1 de FEX-12 (la traînée du bulletin dans EXP-05) étaient déjà faits par la version 0.3.67 (relu dans les fiches) ; le point 3 de FEX-12 renvoie à PHY-07 (Sujet 18) ; le point 5 n'est pas retenu par la contre-vérification ; le point 2 de FEX-11 (« magnifier ») n'avait d'objet qu'en anglais.

Essais : `validate.py` (0 erreur ; un avertissement, `github-pages-limits`, déjà présent sur `main`), `changelog.py check`, construction du site (22 fiches, liens et balisage relus dans les pages produites ; le titre français « Commande ISO (sensibilité [ISO]) », mis d'abord dans un lien, faisait échouer la construction : choix 6). Pages de Nikon (Z 6 en anglais et en français, D850) relues par Claude le 20 novembre 2026. La routine n'a pas été lancée sur la machine de Claude : la CI la lance sur ses quatre profils (résultats dans la pull request).

Relecture : un seul agent, sous les deux angles (sources et vérité ; débutant devant la fiche), au commit dec0d15 : six constats, tous repris. R1, dans EXP-06, « même source » renvoyait à Wikipedia, dernière source citée, et non au manuel du Z 6 : renvoi à la page du manuel, et les réglages étendus Lo et Hi nommés. R2, « aux plus grandes ouvertures » était trop étroit : recalcul du relecteur sur les 14 725 combinaisons du mode A (5 444 clignotements, tous pour « trop de lumière » ; avec une correction négative, jusqu'à f/22 ; pose la plus longue 2,5 s) ; phrase élargie. R3, MES-10 citait encore « The Mode Dial », « The Exposure Compensation Button » et « Defaults » sans leur page française : ajoutées. R4, deux dates « relu le 20 novembre 2026 » absentes de `data/sources.yaml` : reportées. R5, le commentaire de `app/src/ui/cameraPanel.ts` gardait « sans règle publiée » : « la page ne donne pas la règle ». R6, MES-10, deux parenthèses de suite et un renvoi à EXP-06 qui ne montrait pas les réglages Lo : source du D850 placée après ISO 64, Lo nommé. Le septième point (changelog et choix manquants au commit relu) était déjà fait au commit suivant. Vérifié juste par le relecteur : les titres des dix-sept pages, les chiffres et citations (1/8000 s, ISO 100 à 51 200, 12 et 9 vps, délais et valeurs par défaut, règles du D850), les affirmations sur le code (modes M, A, S ; 1/30 s ; ISO 6400 ; 12,5 IL partout ; 3 vps et 10 s), `check_public.py --commits all` (0 problème sur 349 commits). Contrôle final, au commit 4a8fb5e, par un agent qui n'a rien écrit de la version : fusionnable une fois la page d'état réécrite pour la fusion (F1, fait). Repris aussi : F2, la citation de EXP-06 dans ce changelog, remise au texte de la fiche ; F3, BOI-08 citait la page anglaise « Indicators and Error Messages » sans la française, ajoutée comme dans BOI-07 ; F4, la note du mode de déclenchement et les valeurs par défaut de `app/src/ui/cameraPanel.ts` renvoient maintenant à `[nikon-z6-defaults]` en commentaire. Vérifié juste par le contrôle : chaque point du plan fait ou son écart dit, reprises R1 à R6, recalcul de R2 (14 725 combinaisons, 2,5 s au plus, f/22 qui clignote à ISO 6400 et −5 IL), dix-huit titres de pages et leurs citations, ce que les fiches disent du code, aucun nom de modèle ni lien de session, `validate.py`, `changelog.py check`, `check_public.py --commits all` (0 problème sur 350 commits), construction. Agents de la version : relecteur 153 407 jetons, contrôle final 149 454 jetons. Une seule relecture au lieu de deux (choix 10).

## [0.3.74] - 2026-11-20

Sujet 14 du plan de corrections de l'audit (`docs/audit/README.md`) : activité de LUM-02, pénombre hors du mur, légende, lisibilité du schéma (FMA-10, INT-02). Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc Z. Depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), l'activité n'a qu'une langue (relu dans `app/src/activities/lum02.ts` et `app/activites/LUM-02/index.html`) : les essais « dans les deux langues » du plan se font en français seul.

### Ajouté

- Activité de LUM-02 : « source », « objet » et « mur » écrits dans le schéma, à 13 px à l'écran quelle que soit sa largeur, sans se chevaucher (INT-02) ; au texte « Calcul », ce que le schéma ne simule pas : l'éclairement plus fort de près (deux fois plus loin, quatre fois moins de lumière, pour une source petite devant sa distance), la lumière renvoyée par la pièce dans l'ombre (FMA-10, troisième point).
- `data/sources.yaml` : `wikipedia-inverse-square-law` ; au label de `tiffen-lowel-soft-light`, la citation sur la lumière renvoyée par un mur ou un plafond.
- Routine (`scripts/test_app.cjs`) : « activité LUM-02 : pénombre hors du mur, légende, noms du dessin ».
- `docs/tests-a-faire-faire.md` : test T16, le schéma de l'activité sur un téléphone.
- `docs/propositions.md`, section 5 : « Activité de LUM-02 : pénombre, légende, lisibilité du schéma », huit choix.
- `app/src/frenchSpaces.ts` : la fonction des espaces de la ponctuation, sortie de `app/src/texts.ts` pour servir à l'activité sans charger la table du simulateur.

### Modifié

- Activité de LUM-02 : source de 10 cm de large au lieu de 6 dans le dessin, dans un cadre sombre de 1,5 px à l'écran tracé autour d'elle, hauteur inchangée (7,1 × 2,1 px de jaune à 390 px de large pour la lampe de 3 cm, contre 4,3 × 2,1) ; rayons en `#a67c00`, 3,68:1 sur le fond au lieu de 2,29:1 (INT-02).
- Activité de LUM-02 : espaces insécables de la ponctuation française dans tous ses textes (`frenchSpaces`).
- `docs/etat-des-travaux.md` : fin de la version 0.3.73 relue, lignée des sessions (profondeur 5 sur 8), Sujet 14 ; la ligne des espaces ordinaires de « Défauts connus » ne garde que l'accueil, les fiches et les messages techniques.

### Corrigé

- Activité de LUM-02 : quand le bord extérieur de la pénombre dépasse le mur dessiné (±100 cm), la ligne de la pénombre le dit, « (au-delà du mur dessiné) » ; sans ombre pleine, elle donne la hauteur de toute l'ombre au lieu de « … cm de chaque côté de l'ombre », et la légende dit « pas d'ombre pleine, seulement une pénombre en dégradé » au lieu de « ombre pleine au centre » (FMA-10).

Essais de la mise en œuvre (Chromium en rendu logiciel, site construit servi en local, fenêtres de 1280, 390 et 320 px de large, neuf positions des curseurs dont celles de FMA-10 : 150 cm à 20 cm, 150 cm à 50 et à 55 cm, « Réflecteur », « Grande fenêtre », les extrêmes) : à 150 cm et 20 cm, « Pénombre sur le mur : toute l'ombre, sur 480,0 cm de haut (au-delà du mur dessiné) » (30 × 70 / 20 + 150 × 50 / 20 = 480) ; à 55 cm, sans la mention (193,6 cm, bord à 96,8 cm) ; « Réflecteur », 98,8 cm sans ombre pleine (30 × 130 / 80 + 80 × 50 / 80) ; « Grande fenêtre », 30,0 cm de chaque côté, légende inchangée. Les trois noms dans le schéma, sans chevauchement et dans son cadre, aux trois largeurs et aux neuf positions ; aucun débordement horizontal ; aucune espace ordinaire avant « : » dans le texte de la page ; aucune erreur de la page. Contrastes recalculés par la formule du WCAG : rayons 3,68:1, contour de la source et noms 11,01:1 sur `#fbfbf9`. Le contrôle ajouté à la routine, copié dans un script à part (la routine entière n'a pas été lancée sur la machine de Claude) : vert à 1280 et à 390 px. La CI lance la routine sur ses quatre profils (résultats dans la pull request).

Relecture : un seul agent, sous les deux angles (code et vérité ; débutant devant l'écran, à 1280, 390 et 320 px), dans Chromium en rendu logiciel : rien de bloquant, cinq constats, tous repris. R1, à 3 cm la source paraissait sombre sur téléphone, le trait de 1,5 px centré sur le bord couvrant le jaune d'un rectangle de 2,1 px (pixels relevés : `#675c2c` au centre à 320 px) : cadre tracé à l'extérieur de la source ; après reprise, `#f2c200` au centre à 390 px. R2, la règle du carré de la distance sans sa limite : « pour une source petite devant sa distance », et la limite citée dans `data/sources.yaml` (« less than one-fifth of the distance », erreur de moins de 1 %). R3, la lumière renvoyée par la pièce sans citation : celle de Tiffen ajoutée au label. R4, le nom « source » à 55 px sous une petite source : posé sous la source et sous le bas de l'objet (11 à 21 px sous la lampe de 3 cm). R5, le numéro de la pull request dans la page d'état. Vérifié juste par le relecteur : les deux formules, recalculées par le rayon qui rase l'objet, sur les 11 550 positions ; les comptes 427 et 2 035 ; aucune ombre pleine entre 0 et 0,05 cm (jamais « 0,0 cm ») ; aucun chevauchement des noms sur les 11 550 positions à 320, 390, 412 et 1280 px, avec Inter et avec DejaVu Sans, la police de la CI ; le contrôle de la routine ; la citation de Wikipedia et sa date ; les contrastes. Après reprise, essai de Claude sur 546 positions aux trois largeurs : aucun nom qui chevauche un autre, la source ou l'objet, ni qui sort du cadre. Contrôle final, au commit 129335f, par un agent qui n'a rien écrit de la version : fusionnable ; points du sujet tous faits ou leur écart dit (choix 1) ; reprises R1 à R5 justes ; chiffres, contrastes et citations refaits (source de 7,12 × 2,14 px, `#f2c200` au centre à 390 px ; noms à 13,0 px) ; balayage de 572 positions aux trois largeurs sans chevauchement ; `validate.py`, `changelog.py check`, `check_public.py --commits all` et la construction passent. Deux remarques sans correction : F1, les résultats de la routine sont à reporter dans la pull request avant la fusion ; F2, les « 11 à 21 px » de R4 se comptent depuis le bas du jaune (20,6, 12,1 et 11,2 px à 1280, 390 et 320 px) et dépendent de la police. Agents de la version : relecteur 159 100 jetons, contrôle final 113 749 jetons. Une seule relecture au lieu de deux, comme aux Sujets 12 et 13 (limite hebdomadaire au statut « allowed_warning »).

## [0.3.73] - 2026-11-20

Sujet 13 du plan de corrections de l'audit (`docs/audit/README.md`) : textes du simulateur et des pages (INT-07, INT-01, INT-19 points 1 à 5, COD-13), avec deux défauts confiés au sujet (« Défauts connus, hors du plan » de `docs/etat-des-travaux.md`) : les espaces avant la ponctuation de `app/src/texts.ts` et la photo en échec de cause inconnue. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc Z.

### Ajouté

- Routine (`scripts/test_app.cjs`) : « simulateur : titre de la page » ; `checkLinks` échoue quand l'identifiant visé par une ancre est porté par plus d'un élément de la page (INT-01).
- `data/sources.yaml` : `sony-a7iii-live-view-display-fr`, `nikon-z6-apply-settings-live-view-fr`, `wikipedia-non-breaking-space`.
- `docs/tests-a-faire-faire.md` : test T15, les espaces insécables lues sur un iPhone et un téléphone Android.
- `docs/propositions.md`, section 5 : « Textes du simulateur et des pages », neuf choix.

### Modifié

- Simulateur : les sept textes qui vouvoyaient tutoient (INT-07 ; `app/src/texts.ts`) ; titre de la page « Simulateur · TutoPhoto » (INT-19, point 1 ; `app/simulateur/index.html`) ; la note de la fenêtre « Aperçu » donne les noms français des réglages, « Affichage Live View » (Sony A7 III) et « Appliquer réglages à visée écran » (Nikon Z 6, réglage d8), relus à la source (INT-19, point 3).
- `docs/etat-des-travaux.md` : fin de la version 0.3.72 relue, lignée des sessions (profondeur 4 sur 8), Sujet 13.

### Corrigé

- Espaces de la ponctuation dans le simulateur : U+00A0 avant « : » et à l'intérieur des guillemets, U+202F avant « ; », « ? », « ! », posées par `t()` pour toute la table de `app/src/texts.ts` (`frenchSpaces`) et écrites dans les textes composés de `app/src/ui/` et `app/src/main.ts`. Une ligne ne commence plus par « : », comme « Version du site : » sur le Pixel 7 et l'iPhone 14 émulés (défaut B11 de la relecture de la version 0.3.70). Les expressions de la routine qui lisent ces textes lisent l'espace insécable.
- Photo en échec de cause inconnue : le message dit « TutoPhoto ne reconnaît pas la cause ; réessaie, et si l'échec revient, recharge la page. » avant le détail technique (défaut B5 de la relecture de la version 0.3.71 ; `app/src/ui/shutter.ts`) ; le contrôle B10 de la routine lit la phrase.
- Fenêtre « Crédits » : le rôle et les modifications de chaque élément, lus dans le manifeste de la scène, prennent les mêmes espaces (`app/src/credits.ts`).

Essais de la mise en œuvre (Chromium en rendu logiciel, site construit servi en local, 1280 × 800) : titre « Simulateur · TutoPhoto » ; consigne « AF-S : touche le viseur pour faire le point ; … » ; aucune espace ordinaire avant « : » dans le texte de la page, quatre U+00A0 au chargement ; note de l'aperçu avec les deux noms français ; aucune erreur de la page. `checkLinks` seul, sur le site construit : 26 pages, 254 liens, aucun cassé ; sur une page d'essai où deux éléments portent `id="x"` (et un `data-id="x"`) : « ancre portée par 2 éléments ». La routine entière n'a pas été lancée sur la machine de Claude ; la CI la lance sur ses quatre profils (résultats dans la pull request).

Relecture : un seul agent, sous les deux angles (code et vérité ; débutant devant l'écran, à 1280 × 800 et sur l'iPhone 14 émulé), dans Chromium en rendu logiciel : rien de bloquant, six constats, tous repris. R1, les deux lignes de « Défauts connus » confiées au sujet restées « Non corrigé », et la ligne promise par le choix 7 absente : sorties et ajoutée (la ligne « Version du site : » coupée avant les deux-points sur le Pixel 7 et l'iPhone 14 sort aussi, même cause). R2, les textes du manifeste dans « Crédits » : `frenchSpaces`. R3, « La cause n'est pas connue » contredit un détail qui nomme une cause : « TutoPhoto ne reconnaît pas la cause ». R4, contrôle de la phrase ajouté. R5, `checkLinks` comptait aussi `data-id="x"` : expression `\sid="…"`. R6, apostrophes typographiques de la page de Sony dites dans `data/sources.yaml`. Vérifié juste par le relecteur : les textes de la table passés à `frenchSpaces` (il en annonçait 251 ; la table en compte 235, recompté au contrôle final) (aucune adresse, aucun « 40:1 », aucun `{…}` abîmé) ; aucun texte composé oublié hors des `new Error(…)` ; toutes les expressions de la routine qui lisent ces textes, adaptées ; les citations des trois sources, relues à leur adresse ; sur les captures, les espaces fines visibles, sans carré, et aucune ligne qui commence par la ponctuation (mesure par `getClientRects`). Je ne sais pas : le rendu de U+202F dans Safari, sur Android et avec la police de la CI (test T15). Contrôle final, au commit 7572c50, par un agent qui n'a rien écrit de la version : fusionnable ; reprises R1 à R6 justes ; `validate.py`, `changelog.py check`, `check_public.py --commits all` et la construction passent ; un écart, F1 (le compte de 251 textes ci-dessus), corrigé. Agents de la version : deux lectures de pages (environ 50 000 et 28 000 jetons), relecteur 152 605 jetons, contrôle final 116 910 jetons.

Sans objet depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), relu dans le code de la branche : le bloc anglais de l'accueil et l'identifiant `situation` en double (INT-01) ; « trail » et « motion blur » (INT-19, point 2) ; l'orthographe anglaise mêlée (point 5) ; la clé `meter` (COD-13), retirée en 0.3.60. « {pct} % » (point 4) est l'écriture française et reste.

## [0.3.72] - 2026-11-20

Sujet 12 du plan de corrections de l'audit (`docs/audit/README.md`) : adresse et mémoire (COD-03 ; COD-13 pour un commentaire orphelin). Le défi donné par l'adresse (`simulateur/?defi=SIT-05`, bouton « Jouer le défi » des fiches) vaut pour l'arrivée ; ensuite, c'est le choix fait dans la fenêtre « Défis » qui vaut, même après un rechargement. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Adresse et mémoire : le défi de l'adresse ».

### Ajouté

- Routine (`scripts/test_app.cjs`), dans le passage du simulateur ouvert par `simulateur?defi=SIT-06` : « défi de l'adresse : mémorisé, puis retiré de l'adresse » ; à la fin du parcours, « défi de l'adresse, puis « Aucun défi » et rechargement : le choix fait dans la page reste (COD-03) ».
- `docs/tests-a-faire-faire.md` : test T14, « Jouer le défi », « Aucun défi », puis rechargement sur un téléphone.
- `docs/propositions.md`, section 5 : « Adresse et mémoire : le défi de l'adresse », six choix.

### Modifié

- `docs/etat-des-travaux.md` : fin de la version 0.3.71 relue (tag, release, publication), lignée des sessions (profondeur 3 sur 8), Sujet 12.

### Corrigé

- Défi de l'adresse (COD-03) : `?defi=` est lu et mémorisé comme avant, puis retiré de l'adresse par `history.replaceState` ; un défi inconnu est retiré aussi, sans rien choisir ; les autres paramètres et l'ancre restent ; sans stockage du navigateur, le paramètre reste, et un rechargement redonne le défi de l'arrivée (relecture, C3) (`ChallengePicker`, `app/src/ui/challenges.ts`). Avant, après « Jouer le défi » de la fiche SIT-05 puis « Aucun défi », un rechargement remettait « Défi SIT-05 » et l'écrivait dans la mémoire.
- Le commentaire de `renderBulletin`, resté au-dessus de `ficheButton`, est remis à sa place (COD-13, point 6 ; `app/src/ui/challenges.ts`).

Sans objet : la part `?lang=` du sujet. Depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), aucun code de `app/` ne lit ce paramètre ni la clé `tutophoto.lang` : recherche de `lang=`, `tutophoto.lang`, `URLSearchParams` et `location.search` dans `app/src`, `app/scripts` et les pages HTML de `app/`, où seule `app/src/ui/challenges.ts` lit un paramètre de l'adresse ; `app/simulateur/index.html` et `app/activites/LUM-02/index.html` (l. 9) ne font qu'ajouter la barre finale, paramètres gardés. Le script de l'accueil (`app/scripts/build-pages.mjs`) ne lit plus l'adresse, et l'activité de LUM-02 (`app/src/activities/lum02.ts`) ne lit ni l'adresse ni le stockage du navigateur. Rien n'est changé pour eux.

Essais de la mise en œuvre (Chromium en rendu logiciel, site construit servi en local sans redirection, fenêtre de 1280 × 800 ; construction de `origin/main`, commit 3fc9d93, puis de la branche ; script d'essai de Claude, sans attendre la fin du chargement de la scène). Arrivée par `simulateur/?defi=SIT-05` : avant, bouton « Défi SIT-05 », mémoire `SIT-05`, adresse inchangée ; après, même bouton et même mémoire, adresse `/simulateur/`. « Aucun défi » puis rechargement : avant, « Défi SIT-05 » revient et la mémoire repasse à `SIT-05` ; après, le bouton dit « Défis », la mémoire `none`. Arrivée par `simulateur?lang=en&defi=SIT-01#ancre` (sans barre finale) : après, défi SIT-01 choisi, adresse `/simulateur/?lang=en#ancre`. Arrivée par `?defi=XYZ` : avant comme après, le défi mémorisé (SIT-01) reste ; après, l'adresse est `/simulateur/`. Retour arrière : après, l'entrée précédente est `/simulateur/?lang=en#ancre`, sans défi. Aucune erreur de la page. `cd app && npm run build` réussit.

Relecture : la mise en œuvre (commit 9330049) a été relue par un seul agent, sous les deux angles (code et vérité ; débutant devant l'écran, sur ordinateur, Pixel 7 et iPhone 14 émulés), dans Chromium en rendu logiciel (choix 6) : 7 constats. Conformes : C1 (part `?lang=` sans objet, recherche par `git grep` sur `origin/main` et la branche), C2 (ordre des lectures ; retour arrière et avant ; `?defi` sans valeur, `?defi=sit-05`, deux `defi` ; l'historique ne gagne aucune entrée ; sans WebGL, `ChallengePicker` n'est pas construit et le paramètre reste, bouton masqué), C4 (bloc des deux contrôles lancé seul : ils échouent sur `origin/main` et passent après, sur ordinateur, Pixel 7 et iPhone 14 émulés, clics de souris ; profil WebGL 1 non joué), C5 (un clic d'essai pendant le chargement expire parfois, avant comme après : page occupée ; la routine clique après le chargement). Corrigés : C3, sans stockage le défi était perdu au rechargement alors qu'il restait avant ; le paramètre n'est plus retiré que si la mémorisation a réussi, ou si le défi est inconnu ; C6, la conséquence du choix 2 (une adresse copiée ne porte plus le défi) est écrite ; C7, `docs/etat-des-travaux.md` réécrit. Hors du sujet : le bouton « Défi SIT-05 » ne dit que l'identifiant (C6), reporté dans « Défauts connus, hors du plan ».

Essais de la correction (mêmes conditions, construction de la branche après C3, script de Claude). Stockage du navigateur qui lève une `SecurityError` à chaque accès, arrivée par `?defi=SIT-05` puis rechargement : avant comme après, « Défi SIT-05 » et adresse `/simulateur/?defi=SIT-05` aux deux chargements. Le chemin de COD-03 et les autres cas, rejoués : mêmes résultats que la mise en œuvre. Aucune erreur de la page. `cd app && npm run build` réussit.

Contrôle final, par un agent qui n'a rien écrit de la version, au commit 6e1d701 : fusionnable. Lu : le diff entier, `app/src/ui/challenges.ts` en entier, le bloc des contrôles de la routine, la section du Sujet 12 et COD-03 ; part `?lang=` vérifiée par `git grep`. Essais rejoués (Chromium en rendu logiciel, 1280 × 800) : le chemin de COD-03, l'ancre et `?lang=en`, le défi inconnu, le retour arrière et le cas sans stockage, au caractère près ; les deux contrôles de la routine, scène chargée, échouent avant et passent après. `node --check` et `npx tsc --noEmit` passent. Corrigé d'après lui : trois phrases des documents (renvoi au contrôle final, T14, « seule `challenges.ts` lit un paramètre de l'adresse »). Remarque sans effet : la réécriture par `URLSearchParams` peut changer l'encodage des autres paramètres (`?x` devient `?x=`), que rien ne lit.

Routine de la CI au commit 6a90f66 (exécution 44686186444) : profil iPhone en échec sur le seul contrôle « détection des animaux : le chien à découvert n'est pas lâché (FMA-23) » (deux pertes à découvert, de 0,3 et 0,4 s, pour une tolérée), échec déjà relevé deux fois et noté dans « Défauts connus, hors du plan » de `docs/etat-des-travaux.md` ; ce diff ne touche ni l'autofocus ni la scène, et les deux contrôles ajoutés y réussissent. La routine est relancée par le commit suivant, de documents seulement ; le contrôle n'est pas relâché.

Agents de la version, d'après leurs notifications de fin : relecteur 123 242 jetons, contrôle final 153 982.

## [0.3.71] - 2026-11-20

Sujet 11 du plan de corrections de l'audit (`docs/audit/README.md`) : écran de revue, loupe et retardateur, ce qui reste actif pendant un calcul (COD-08, COD-02, COD-05, COD-04 ; COD-13 pour trois défauts du déclencheur), et l'écran de revue d'une photo refusée ou en échec laissé par le Sujet 10. D1 tranchée par Julien le 15 novembre 2026 : le second appui n'annule pas le retardateur. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Écran de revue, loupe et retardateur ».

### Ajouté

- Rafale dont une vue échoue (COD-05) : les vues calculées sont montrées, et la légende de chacune commence, sur sa ligne, par « Rafale interrompue : la vue 3 n'a pas pu être calculée ; 2 vues sur 5 sont montrées. », suivi de la phrase de la cause quand elle est connue et du détail ; le compteur de la série dit le rang parmi les vues demandées (« Vue 1/5 »), comme la légende. Première vue en échec : « Rafale interrompue : la vue 1 n'a pas pu être calculée ; aucune vue n'est montrée. » (relecture, R3 ; `truncation`, `countText`, `errorText`, `app/src/ui/shutter.ts` ; `burstTruncated`, `burstShown`, `burstShownOne`, `burstShownNone`, `app/src/texts.ts` ; `#review-caption`, `app/src/style.css`).
- Routine (`scripts/test_app.cjs`), avec `--photo`, après la seconde loupe : « revue : loupe jetée après « Revenir au viseur » pendant son calcul, écran défilé en bas (COD-08, B1) » (à la tâche suivante du toucher de la photo, calcul commencé, l'écran de revue est défilé en bas ; puis le bouton est cliqué à la souris en son centre, et le contrôle relève l'élément sous ce centre, que le clic est arrivé au bouton pendant le calcul, et le temps jusqu'à la fin du calcul ; relecture, R8) ; « revue : photo en échec après une bonne photo, sans l'image ni « Enregistrer » d'avant (B10) » (`canvas.toBlob` mis en échec par la routine, puis rendu). L'erreur « échec injecté par la routine » est la première entrée de `ADMITTED_ERRORS`.
- `docs/tests-a-faire-faire.md` : test T13, au doigt, loupe puis « Revenir au viseur », retardateur puis toucher de la photo, rafale tenue et appui long sur le déclencheur.
- `docs/propositions.md`, section 5 : « Écran de revue, loupe et retardateur », onze choix, et huit de la relecture (R1 à R8).
- Pendant le calcul d'une loupe, la bande dit « Calcul de la loupe… » (relecture, R2 ; `computingLoupe`, `app/src/texts.ts`).

### Modifié

- Écran de revue d'une photo refusée ou en échec (constat B10 de la relecture de la version 0.3.70) : le message seul ; l'image, « Enregistrer la photo », « Touchez la photo… », les boutons de la série et « Photo entière » sont masqués, et reviennent avec la photo suivante réussie (`showError`, `showPhotoParts`, `app/src/ui/shutter.ts` ; `.review img[hidden]`, `.review-actions a[hidden]`, `app/src/style.css`). Loupe en échec : même écran, avec « Photo entière », qui remontre la photo et sa série ; le message dit « La loupe n'a pas pu être calculée ; ta photo n'est pas perdue : « Photo entière » la remontre. » (relecture, R4 ; `loupeError`, `app/src/texts.ts`).
- Bande « Calcul de la photo… » : elle laisse passer les touchers (`pointer-events: none`, `.progress`, `app/src/style.css` ; relecture, R1).
- Loupe dont la vue a changé : son calcul s'arrête au point de progression suivant, au lieu d'aller à son terme, viseur grisé (`LoupeDropped`, `compute`, `magnify`, `app/src/ui/shutter.ts` ; relecture, R2).
- Retardateur : la consigne « Touchez la photo… » est masquée au début du compte à rebours ; « Photo entière », « Vue précédente » ou « Vue suivante », touchés pendant le compte, la remontrent (relecture, R5 ; contrôle final).
- Focus clavier : quand l'écran de revue masque l'élément qui l'a (« Enregistrer la photo » sous un message d'erreur, « Photo entière » après son appui), il passe à « Revenir au viseur » (`keepFocus`, `app/src/ui/shutter.ts` ; relecture, R6).
- Une photo refusée par la borne de 20 s (`SceneNotReadyError`) n'est plus écrite dans la console, comme les refus `PhotoRefused` : l'écran de revue en dit la cause (`report`, `app/src/ui/shutter.ts`). Lu dans le code, non essayé dans un navigateur.
- Rafale tenue (COD-13, point 3) : le texte du déclencheur n'est réécrit que quand le nombre de vues change, et les orientations de l'appareil ne sont plus relevées après l'instant de la dernière vue possible (`pressStart`, `app/src/ui/shutter.ts`) ; l'intervalle lu à l'appui sert aussi au relâchement (`press.interval`, relecture, R7).
- `docs/etat-des-travaux.md` : fin de la version 0.3.70 relue (tag, release, publication), lignée des sessions (profondeur 2 sur 8), Sujet 11 en cours ; « Défauts connus, hors du plan » : les deux lignes corrigées retirées (écran de revue d'une photo en échec, `SceneNotReadyError` dans la console), une ajoutée (toucher ignoré pendant le retardateur), et cinq de la relecture (B5, B7, B8 pour ce qui est antérieur, B9) ; ligne du Sujet 11 de « Où on en est » : COD-04 et le point 2 de COD-13 dits sans objet ; test T13, complété à la relecture (écran défilé en bas, viseur dégrisé).

### Corrigé

- Loupe dont la vue a changé pendant son calcul (COD-08) : un numéro de la vue affichée, augmenté par « Photo entière », le changement de vue, « Revenir au viseur » et un message d'erreur, est comparé à la fin du calcul ; s'il a changé, la loupe est jetée. Avant, l'écran de revue se rouvrait avec la loupe après « Revenir au viseur », et la loupe de la vue 1 s'affichait sous le compteur « Vue 2/3 » après « Vue suivante » (`view`, `magnify`, `app/src/ui/shutter.ts`).
- Retardateur (COD-02) : pas de loupe pendant un compte à rebours ; la fin du compte ne peut plus tomber pendant le calcul d'une loupe, où la vue était perdue sans message (`magnify`, `app/src/ui/shutter.ts`). Le second appui n'annule pas le retardateur (D1).
- Déclencheur (COD-13, point 1) : il ne part plus au clic droit ni au clic du milieu de la souris (`e.button !== 0`, `app/src/ui/shutter.ts`).

Sans objet : COD-04. Le résumé des réglages est fabriqué par `t()`, qui lit une seule table en français (`app/src/texts.ts`, l. 254-256 ; `summary`, `app/src/ui/cameraPanel.ts`, l. 399-406) : depuis le retrait de l'anglais (versions 0.3.60 et 0.3.61), aucune langue ne change, et la légende ne mélange plus deux langues. Rien n'est changé ; même raison pour le point 2 de COD-13 (texte du déclencheur remis par défaut au changement de langue).

Essais de la mise en œuvre, au commit c4be24d, le suivant ne changeant du code qu'un commentaire (Chromium en rendu logiciel, site construit servi en local, fenêtre de 1280 × 800, gestes programmés dans la page par `setTimeout` ou par des clics de la souris de Playwright), avant (construction de `origin/main`, commit 058b8ad) et après, dans une même page pour tous les cas. Loupe puis « Revenir au viseur » à la tâche suivante du toucher : avant, l'écran de revue se rouvre à la fin du calcul avec « Loupe 100 % · 16 rendus, calculée en 5,9 s » ; après, il reste fermé, image inchangée. Seconde loupe puis « Photo entière » pendant son calcul : avant, « Loupe 100 % · 16 rendus, calculée en 5,8 s » s'impose ; après, la photo entière reste, « Photo entière » masqué. Rafale de trois vues, loupe sur la vue 1 puis « Vue suivante » : avant, « Loupe 100 % … » sous le compteur « Vue 2/3 » ; après, la vue 2 reste, légende « Vue 2/3 · +0,20 s · … ». Retardateur de 2 s, déclencheur cliqué dans la page, photo de l'écran de revue touchée 0,9 s après (le fil de la page était occupé) : avant, la loupe se calcule, le compte finit pendant elle, et 25 s plus tard la seule image posée est la loupe, bouton revenu à « Déclencher » ; après, aucun calcul ne commence au toucher, la photo du retardateur est calculée à la fin du compte et affichée. Rafale de cinq vues dont la troisième échoue (`HTMLCanvasElement.prototype.toBlob` remplacé dans la page, qui lève « échec injecté par l'essai » au troisième appel) : avant, « Vue 1/2 » au compteur, « Vue 1/5 · … » en légende, aucun message ; après, même compteur, légende finie par « Rafale interrompue : 2 sur 5 vues calculées. La photo n'a pas pu être calculée. (échec injecté par l'essai) ». Photo en échec (`toBlob` qui lève à chaque appel) après une bonne photo : avant, le message, avec l'image, « Enregistrer la photo » et « Touchez la photo… » d'avant ; après, le message seul. Loupe en échec, puis « Photo entière » (après seulement) : le message seul avec « Photo entière », puis la photo, sa légende et « Enregistrer » reviennent. Clic droit, puis clic du milieu sur « Déclencher » : avant, chacun lance un calcul ; après, aucun. Pendant la rafale tenue, réécritures du texte du déclencheur : 3 avant et 2 après pour une rafale de 2 vues, 7 avant et 4 après pour 4 vues (rendu logiciel, peu d'images par seconde ; l'écart croît avec la cadence d'affichage). Les relevés d'orientation arrêtés après la dernière vue possible ne se voient pas de la page : lu dans le code. Toucher émulé (Pixel 7) sur un bouton : `pointerdown` avec `button` 0, par `page.tap` et par le protocole de débogage. Les deux contrôles ajoutés à la routine n'ont pas été lancés dans la routine (la routine entière n'est pas lancée sur la machine de Claude, où le conteneur a redémarré pendant elle ; elle n'a pas d'option pour lancer un contrôle seul) : leur bloc, copié du fichier, a été lancé seul après une photo et une loupe, sur le profil ordinateur. Après : les deux réussissent (« calcul commencé au clic sur « Revenir au viseur » ; écran de revue resté fermé » ; « encore affichés : rien »), en 28,7 s ; avant : les deux échouent (« écran de revue rouvert (« Loupe 100 % · 16 rendus, calculée en 6,0 s ») » ; « encore affichés : review-image, review-save, review-hint, review-whole »). `cd app && npm run build` réussit.

Relecture : la mise en œuvre (commit 0e69a4a) a été relue par deux agents, l'un pour le code et la vérité des textes (A1 à A7), l'autre en débutant devant l'écran, sur ordinateur (1280 × 800), Pixel 7 et iPhone 14 émulés (B1 à B11) : 18 constats. Un agent de corrections les a repris en cherchant d'abord à les réfuter, dans le code et dans Chromium. Classement : 12 confirmés et corrigés (A1, commentaire du contrôle de B10, R8 ; A2, focus, R6 ; A3, intervalle de l'appui gardé, R7, lu dans le code, ne se voit pas de la page ; A4, rafale dont la première vue échoue, R3 ; A5, choix 5 et changelog, « photo suivante réussie » ; A6, choix 10, vrai depuis R7 ; A7, ligne du Sujet 11 de `docs/etat-des-travaux.md` ; B1, bande traversée par les touchers, R1, et contrôle de la routine, R8 ; B2, calcul de la loupe jetée arrêté et « Calcul de la loupe… », R2 ; B3, R3 ; B4, R4, ligne retirée de « Défauts connus » ; B6, R5) ; 1 confirmé en partie (B8 : les pertes du focus que cette version cause ou touche, écran d'échec et « Photo entière », sont corrigées, R6 ; celles d'après « Déclencher », « Revenir au viseur » et la dernière « Vue suivante » sont antérieures, relues dans le code de `origin/main` : boutons grisés ou écran masqué, Sujet 38) ; aucun réfuté ; 3 hors du sujet (B5, une piste après une photo en échec de cause inconnue, qu'aucune phrase vraie ne tire du code, Sujet 13 ; B7, déclencheur qui change de place pendant le compte à rebours sur téléphone, antérieur, non rejoué, Sujet 42 ; B9, « Revenir au viseur » et « Enregistrer » sous le bas visible à 1280 × 800, mesuré : écran de revue de 606 px de haut, contenu de 710 px, bouton de 717 à 749 px, Sujet 42 ou INT-17 ; la correction de B1 n'en dépend pas) ; 2 conformes (B10, B11). Ce qui est hors du sujet est reporté dans « Défauts connus, hors du plan » de `docs/etat-des-travaux.md`. Vérifié pour B1 : la bande n'a ni bouton ni geste (`app/simulateur/index.html`, un texte et une barre) ; hors loupe, un toucher qui la traverse arrive au viseur, que le calcul ignore (`choosePoint`, commandes détachées).

Essais des corrections (Chromium en rendu logiciel, site construit servi en local, contexte neuf à chaque essai, gestes à la souris de Playwright ; construction d'avant au commit 0e69a4a, d'après au commit des corrections ; scripts de l'agent de corrections, un seul navigateur à la fois). B1 et B2, photo, toucher de la photo, écran de revue défilé en bas à la tâche suivante, puis clic au centre de « Revenir au viseur » : avant, sous ce centre, `progress-track` (ordinateur : bouton de 613 à 645 px, bande de 592 à 641 px ; iPhone 14 : bouton de 322 à 354 px, bande de 301 à 350 px), le clic n'arrive pas au bouton, et l'écran de revue montre ensuite « Loupe 100 % · 16 rendus, calculée en 5,1 s » (iPhone : 3,4 s) ; après, sous ce centre, `review-back`, le clic arrive pendant le calcul, la bande dit « Calcul de la loupe… », l'écran de revue reste fermé et la bande disparaît 0,6 s après le clic (iPhone : 0,5 s), contre 3,4 à 7,9 s mesurés par le relecteur avant. B3, rafale de cinq vues dont la troisième échoue (`toBlob` qui lève au troisième appel) : avant, compteur « Vue 1/2 », légende « Vue 1/5 · … · Rafale interrompue : 2 sur 5 vues calculées. La photo n'a pas pu être calculée. (échec injecté par l'essai) » ; après, compteur « Vue 1/5 », légende qui commence par « Rafale interrompue : la vue 3 n'a pas pu être calculée ; 2 vues sur 5 sont montrées. (échec injecté par l'essai) », puis, à la ligne, « Vue 1/5 · +0,00 s · … » ; sur l'iPhone 14, la phrase est lisible sous « Infos », en tête de la légende. A4, rafale dont la première vue échoue : avant, « La photo n'a pas pu être calculée. (échec injecté par l'essai) » ; après, « Rafale interrompue : la vue 1 n'a pas pu être calculée ; aucune vue n'est montrée. (échec injecté par l'essai) ». B4, loupe en échec : avant, « La photo n'a pas pu être calculée. (…) » ; après, « La loupe n'a pas pu être calculée ; ta photo n'est pas perdue : « Photo entière » la remontre. (…) » (ordinateur et iPhone). B6, retardateur lancé l'écran de revue ouvert : avant, « Touchez la photo… » affichée pendant le compte ; après, masquée pendant le compte, revenue à la fin. A2 et B8, retardateur de 2 s, focus mis sur « Enregistrer la photo » pendant le compte, photo mise en échec : avant, focus sur la page (`BODY`) ; après, sur « Revenir au viseur ». « Photo entière » d'une loupe, au clavier (Entrée) : avant, focus sur la page ; après, sur « Revenir au viseur » ; même chose après « Photo entière » d'une loupe en échec (ordinateur et iPhone). Bloc des deux contrôles de la routine, copié du fichier et lancé seul après une photo et une loupe : après, les deux réussissent sur le profil ordinateur (« sous le centre de « Revenir au viseur » : review-back ; clic arrivé au bouton, calcul en cours (« Calcul de la loupe… ») ; écran de revue resté fermé », calcul fini 0,7 s après le clic, 25,2 s ; ce nombre, écrit alors avec un point, l'est depuis avec une virgule) et sur le profil iPhone (0,5 s, 21,4 s) ; avant, le premier échoue sur le profil ordinateur (« sous le centre de « Revenir au viseur » : progress-track ; clic pas arrivé au bouton ; écran de revue rouvert (« Loupe 100 % · 16 rendus, calculée en 5,8 s ») »), le second réussit. La routine entière n'a pas été lancée sur la machine de Claude ; la CI de la pull request la lance sur ses quatre profils. `cd app && npm run build` réussit.

Contrôle final, par un agent qui n'a rien écrit de la version, au commit 32c81b4 : le Sujet 11 est couvert en entier (COD-04 et le point 2 de COD-13 sans objet, D1 respectée), version fusionnable. Lu en entier : `app/src/ui/shutter.ts` ; l'arrêt d'une loupe jetée : `LoupeDropped`, levée par le suivi de la progression dans la boucle des rendus de `takePhoto`, traverse son bloc `finally` (carte de profondeur, cible de rendu, projection, traitement d'image, décalage de l'œil, orientation, horloge, textures), puis celui de `compute` (commandes de la caméra, bande, autofocus, flou et bruit du viseur, réglages, boucle de rendu), et `magnify` la rattrape sans rien écrire. Essais rejoués (Chromium en rendu logiciel, site construit servi en local, contexte neuf par profil, scripts de l'agent de contrôle, un seul navigateur à la fois). Loupe, écran de revue défilé en bas à la tâche suivante du toucher, clic de la souris au centre de « Revenir au viseur » : à 1280 × 800, sous ce centre `review-back` (bouton de 613 à 645 px, barre de 626 à 633 px), clic arrivé pendant le calcul (« Calcul de la loupe… »), bande retirée 0,74 s après, écran de revue resté fermé, déclencheur et boutons du panneau dégrisés, viseur rendu de nouveau ; iPhone 14 émulé : bouton de 322 à 354 px, barre de 336 à 342 px, 0,53 s, mêmes constats. Photo juste après : mêmes réglages, « mise au point verrouillée à 6,6 m » (AF-S verrouillé par la première), image à 1,5 niveau en moyenne de la première sur une réduction de 16 × 10 (iPhone : 2,1), image, « Enregistrer » et consigne affichés. Rafale Continu L à 5 vues par seconde, cinq vues, `toBlob` qui lève au troisième appel : compteur « Vue 1/5 », légende « Rafale interrompue : la vue 3 n'a pas pu être calculée ; 2 vues sur 5 sont montrées. (échec injecté par l'essai) » puis, à la ligne, « Vue 1/5 · +0,00 s · … » ; « Vue 2/5 · +0,20 s · … », « Vue suivante » grisé (les deux profils). Photo en échec après une bonne photo : « La photo n'a pas pu être calculée. (échec injecté par l'essai) », rien d'autre d'affiché parmi l'image, « Enregistrer », la consigne, la série et « Photo entière » (les deux profils). Retardateur de 2 s, déclencheur et toucher de la photo envoyés dans la page (le fil de la page, occupé, a rendu le toucher 1,1 à 2,0 s après l'appui, compte encore en cours) : consigne masquée, aucun calcul au toucher, « Calcul de la photo… » à la fin du compte (3,3 à 4,2 s), photo du retardateur affichée, consigne revenue. Seules erreurs de la console : celles injectées. Corrigé par lui : les numéros de ligne de `t()` et de `summary` cités pour COD-04 (l. 254-256 et l. 399-406, et non 249-251 et 400-407), ici et au choix 8 ; au choix R2, `LoupeDropped` traverse le bloc `finally` de `takePhoto` et c'est `magnify` qui la rattrape ; R5, la ligne « Modifié » du retardateur et la ligne des défauts connus : la consigne est remontrée pendant le compte par « Photo entière », « Vue précédente » ou « Vue suivante » (`showPhotoParts`). Points non bloquants : cette consigne remontrée pendant le compte, alors que le toucher reste ignoré (essayé pour « Photo entière » d'une loupe, retardateur de 5 s, sur les deux profils ; reporté dans « Défauts connus, hors du plan ») ; dans `app/src/ui/shutter.ts`, l. 137, l'ancien commentaire d'une ligne du champ `press` est resté au-dessus du nouveau. La routine entière n'a pas été lancée par lui ; la CI la lance.

Agents de la version, d'après leurs notifications de fin : mise en œuvre 220 113 jetons, relecteur du code 187 465, relecteur débutant 204 277, correction 206 531, contrôle final 172 278.

Fin de la version 0.3.70, relue par la session du Sujet 11 le 20 novembre 2026 vers 2 h 57 UTC : `main` sur 058b8ad, commit de fusion de la pull request 77 ; tag annoté `v0.3.70` (objet 4c132dc) sur 058b8ad, par `git ls-remote` ; release « v0.3.70 - 2026-11-20 » publiée à 2 h 56 min 08 s UTC ; publication sur GitHub Pages réussie (exécution 67 ; site publié non regardé) ; aucune pull request ouverte. Lignée relue dans l'outil qui décrit la session : profondeur 2 sur 8.

## [0.3.70] - 2026-11-20

Sujet 10 du plan de corrections de l'audit (`docs/audit/README.md`) : les échecs du chargement et du rendu dits à l'écran (fichier d'éclairage perdu, WebGL absent, contexte perdu). Constats COD-06, COD-11, COD-12 ; COD-13 pour un commentaire de `app/src/scene.ts`. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Échecs dits à l'écran ».

### Ajouté

- Bouton « Recharger » dans le message d'un chargement en échec et dans celui d'un affichage interrompu (`app/src/main.ts`, `reload` dans `app/src/texts.ts`).
- Message à la perte du contexte WebGL (COD-12) : « Affichage 3D interrompu par le navigateur. Il peut reprendre seul ; sinon, recharge la page. », suivi de la version du site ; il disparaît à la restauration (`engine.onContextLostObservable`, `onContextRestoredObservable`, `app/src/main.ts`).
- Fenêtre « Crédits », manifeste non reçu (COD-06) : une ligne dit que les crédits sont indisponibles et pourquoi, au lieu d'une liste vide (`renderCreditsUnavailable`, `app/src/credits.ts`).
- Routine (`scripts/test_app.cjs`, `checkNoWebgl`) : dans chaque profil, contexte à part où `getContext` rend `null` pour `webgl` et `webgl2` ; le message du simulateur est lisible (texte et version, dans la fenêtre, rendu par `elementFromPoint` en son centre, aucun autre élément de `main` affiché) et le canevas masqué, ainsi que le bouton « Défis », sans erreur de la page ni de la console dans ce contexte.
- Photo refusée sans calcul (relecture) : pendant une perte du contexte WebGL, et quand un chargement en échec laisse la scène pas prête 20 s après la fin du dernier fichier ; l'écran de revue le dit en clair (`PhotoRefused`, `app/src/ui/shutter.ts` ; `filesSettled`, `app/src/scene.ts` ; `app/src/main.ts`). Le déclencheur n'est pas grisé.
- `docs/tests-a-faire-faire.md` : test T12, la perte du contexte graphique sur un téléphone.
- `docs/propositions.md`, section 5 : « Échecs dits à l'écran », dix choix, et onze de la relecture (R1 à R11).

### Modifié

- Message d'un chargement en échec (COD-06) : « Un fichier de la scène n'a pas été reçu (autumn_hockey/autumn_hockey_1k.hdr). Le viseur peut être incomplet, et les photos échouer. Vérifie ta connexion. », le fichier nommé par son chemin dans le dossier de la scène, celui que cite le chargeur glTF pour un .bin ou une texture d'un modèle (`SceneFileError`, `app/src/scene.ts`) ; « La scène n'a pas pu être chargée. » reste pour un échec sans fichier connu. La ligne du message passe au-dessus de l'indicateur d'équilibre et de la vue de dessus (`z-index: 3`, `app/src/style.css`) ; elle prend toute la largeur moins 0,5rem de chaque côté, au plus 32rem, et n'est réécrite que quand son texte change (relecture).
- Écran de revue d'une photo qui échoue (relecture) : une phrase en clair, selon la cause, entre « La photo n'a pas pu être calculée. » et le détail technique (`app/src/ui/shutter.ts`, `app/src/texts.ts`).
- Indicateur d'équilibre (relecture) : « bruit non mesuré » pendant une perte du contexte WebGL, au lieu de « bruit insuffisant (signal/bruit 0:1) » (`app/src/ui/balance.ts`).
- Progression du chargement (COD-06) : un fichier ne compte comme reçu que si son entrée de la Resource Timing API a un état de 200 à 299 ou, sans état, une taille reçue non nulle ; un navigateur qui ne donne aucun de ces champs garde la règle d'avant (`isReceived`, `app/src/main.ts`).
- `docs/etat-des-travaux.md` : fin de la version 0.3.69 relue (tag, release, publication), lignée des sessions (profondeur 1 sur 8), Sujet 10 en cours.
- `docs/propositions.md`, section 5 : « Lignée des sessions », les trois choix de la session de départ de la chaîne.

### Corrigé

- Fichier d'éclairage non reçu (COD-06) : il entre dans `ready` (rappels `onLoad` et `onError` de `HDRCubeTexture`, `app/src/scene.ts`) ; le message d'un chargement en échec, qui nomme le fichier (voir « Modifié »), s'affiche au lieu d'une scène sans ses objets.
- Photo qui figeait la page (COD-06) : les deux attentes de la scène prête de `takePhoto` sont bornées à 20 s (`whenSceneReady`, `app/src/camera/photo.ts`) ; au-delà, l'écran de revue dit que la photo n'a pas pu être calculée, et pourquoi, et les réglages reviennent. Le déclencheur n'est pas grisé.
- Navigateur sans WebGL (COD-11) : `#scene[hidden] { display: none; }`, et une classe `no-webgl` sur `body` masque le voile du cadre, l'indicateur d'équilibre, la vue de dessus, les repères et le bouton « Défis » (`app/src/style.css`, `app/src/main.ts`) ; le message est lisible.
- Éclairage après une perte du contexte WebGL (COD-12) : la texture d'éclairage est libérée puis recréée à chaque restauration, si elle était arrivée (`app/src/scene.ts`) ; les objets éclairés ne restent plus de 5 à 10 % plus sombres dans Chromium en rendu logiciel.
- COD-13, point 6 : le commentaire de `ready` (`app/src/scene.ts`), faux et en double, dit ce que la promesse attend et donne.

Essais de la mise en œuvre, au commit 120f543 (Chromium en rendu logiciel, site construit servi en local, contexte neuf à chaque essai, fenêtre de 1280 × 800 sauf mention du Pixel 7 émulé), avant (construction du commit 42694b7) et après la correction. Les coupures de fichiers ont été rejouées sur la construction qui précède le dernier changement du code, l'ordre de libération de la texture d'éclairage à la restauration du contexte, qui ne les touche pas. Fichier d'éclairage coupé (`page.route(…, abort)` sur `autumn_hockey_1k.hdr`) : avant, « fichiers reçus, préparation » de 7 à 35 s, puis le diagnostic « Scène affichée avant d'être prête » avec les cinq maillages du banc et de la poubelle, et après un appui sur « Déclencher », « Calcul de la photo… » toujours affiché 60 s plus tard ; après, « 33 / 34 Mio reçus » puis, à 8,7 s (9,0 s sur le Pixel 7), « La scène n'a pas pu être chargée. Fichier en cause : autumn_hockey_1k.hdr. Version du site : 0.3.70. » avec « Recharger », message et bouton rendus par `elementFromPoint` ; un appui sur « Déclencher » ouvre l'écran de revue après 23,0 s (22,9 s sur le Pixel 7) avec « La photo n'a pas pu être calculée. (scène pas prête après 20 s) », réglages rendus, viseur repris. Autres fichiers coupés, après : photo de fond (`autumn_hockey.jpg`) nommée à 12,8 s ; `painted_wooden_bench_1k.gltf`, `painted_wooden_bench.bin` et la texture `painted_wooden_bench_diff_1k.jpg` nommés chacun par leur nom vers 17 à 19 s ; avec le modèle ou son .bin coupés, la photo se calcule encore (6,6 à 6,9 s, sans le banc) ; avec la texture coupée, la photo s'arrête après 20 s, comme pour le fichier d'éclairage. Manifeste coupé (`scene.json`) : la scène se charge, et la fenêtre « Crédits » a une ligne, « Crédits indisponibles : … », au lieu de zéro. Sur ordinateur, avant le passage de la ligne du message au-dessus des pastilles, son bord gauche était sous l'indicateur d'équilibre (`elementFromPoint` à 10 px du bord : l'indicateur). Sans WebGL (`getContext` rend `null` pour `webgl` et `webgl2`) : avant, canevas `hidden` mais `display: block`, de 51 à 800 px (Pixel 7 : de 100 à 839 px), message de 816 à 868 px (Pixel 7 : de 855 à 927 px), hors de la fenêtre, et six éléments de `main` affichés ; après, canevas `display: none`, message de 67 à 119 px (Pixel 7 : de 116 à 188 px), rendu par `elementFromPoint` en son centre, aucun autre élément de `main` affiché, bouton « Défis » masqué. Contexte perdu par `WEBGL_lose_context` puis restauré 3 s plus tard (méthode de la contre-vérification de COD-12 : construction de développement, horloge de la scène arrêtée, aperçus du bruit et de la profondeur de champ coupés, moyenne des pixels dans les 48 cases d'une grille de 8 × 6 sur le canevas de 1280 × 606 px) : témoin sans perte, 15 s plus tard, 48 cases sur 48 à 1,000 ; avant, aucun message pendant la perte, et 20 s après la restauration 25 cases à 1,000, de 0,927 à 1,004 dans les autres ; après, pendant la perte, « Affichage 3D interrompu par le navigateur. Il peut reprendre seul ; sinon, recharge la page. Version du site : 0.3.70. » avec « Recharger », message retiré 2 s après la restauration, et 20 s après elle 48 cases sur 48 à 1,000. Avec la texture recréée avant de libérer l'ancienne, les rapports restaient ceux d'avant (25 cases à 1,000, de 0,927 à 1,004) : la nouvelle texture n'avait pas de polynôme sphérique, Babylon.js reprenant la texture interne reconstruite pour la même adresse ; d'où l'ordre retenu. Le nouveau contrôle de la routine reprend les critères de ces relevés ; il n'a pas été lancé seul sur la construction d'avant. Routine `node scripts/test_app.cjs --photo`, profil ordinateur, lancée deux fois sur la machine de Claude : elle n'a pas abouti, le conteneur ayant redémarré pendant chacun des deux passages ; la CI de la pull request la lance sur ses quatre profils. `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

Relecture : la mise en œuvre (commit e18afa1) a été relue par deux agents, l'un pour le code et la vérité des textes (A1 à A6), l'autre en débutant devant l'écran, sur ordinateur, Pixel 7 et iPhone 14 émulés (B1 à B15) : 21 constats. Un agent de corrections les a repris en cherchant d'abord à les réfuter, dans le code et dans Chromium. Classement : 12 confirmés (A1, A2, A4, A5, A6, B1, B2, B3, B4, B6, B7, B9), 3 confirmés en partie (A3 : Babylon.js n'interroge pas la scène sans fin après une photo refusée, il arrête et oublie les attentes au bout de `scene.onReadyTimeoutDuration`, 2 minutes par défaut ; B5 : « Recharger », 24 px de haut, atteignait le minimum du critère 2.5.8 des WCAG 2.2, mais restait plus petit que les boutons voisins ; B12 : le damier de Babylon.js à la place du fond n'est pas masqué, le texte dit maintenant que le viseur peut être incomplet), aucun réfuté, 6 hors du sujet (B8, un nom parlant du fichier, qui ne se tire pas du manifeste sans rien inventer ; B10, l'image et le lien de la photo précédente laissés par `showError`, Sujet 11 ; B11, aucune espace insécable avant les deux-points, Sujet 13 ; B13, une consigne pour un navigateur sans WebGL, aucune source lue ; B14 et B15, ergonomie pour la V3), reportés dans `docs/etat-des-travaux.md`. Corrigés : A1, texture d'éclairage recréée seulement si elle était arrivée (choix R8 ; la correction proposée, ses rappels passés à la texture recréée, laissait la scène pas prête) ; A2, chemin du fichier dans le dossier de la scène (choix 1 corrigé, R1) ; A3, commentaire (R9) ; A4, message réécrit seulement quand il change (R10) ; A5, contrôle de la routine (choix 10) ; A6, choix 8 et commentaire de `scene.ts` ; B1, photo refusée pendant une perte du contexte et photo jetée si la perte survient pendant le calcul (R3) ; B2 (R6) ; B3, B5 et B9, mise en page du message (R7) ; B4, B6 et B12, texte du fichier non reçu (R2) et refus immédiat d'une photo dans une scène en échec restée pas prête (R4) ; B7 (R5). Essais des corrections (mêmes conditions que ci-dessus, construction d'avant au commit e18afa1, d'après au commit des corrections ; scripts de l'agent de corrections). A1, fichier d'éclairage retardé de 15 s, contexte perdu à 2,6 s et restauré 3 s plus tard : avant, « fichiers reçus, préparation » encore à 36 s, sans fin ; avec les rappels passés à la texture recréée, `ready` réglée, mais la scène affichée à 53 s avec « Scène affichée avant d'être prête, éléments en attente : ? » ; après, scène prête vers 30 s, sans ligne de diagnostic (l'éclairage de ce cas n'a pas été mesuré). B1, contexte perdu, « Déclencher » 5 s plus tard : avant, écran de revue avec « 16 rendus, calculée en 0,3 s » et un bulletin ; après, en moins de 0,1 s, « La photo n'a pas pu être calculée. L'affichage 3D est interrompu ; attends qu'il reprenne, ou recharge la page. (contexte WebGL perdu) », sans bulletin (ordinateur et Pixel 7) ; après la restauration, la photo se calcule (6,3 à 6,7 s). Perte pendant le calcul, 1,5 s après son début, restauration 2 s plus tard : avant, la photo est gardée, avec son bulletin ; après, le même message, avec « (contexte WebGL perdu pendant le calcul) », et la photo suivante se calcule. B2 : avant, « bruit non mesuré » dans les deux essais faits ; sur une construction intermédiaire, qui ne lisait que l'événement de la perte, « bruit insuffisant (signal/bruit 0:1) » pendant 5 s, ce que le relecteur avait vu ; après, « bruit non mesuré » de 0,3 s à 5 s après la perte (ordinateur et Pixel 7), « bruit excellent » après la restauration. B6, fichier d'éclairage coupé : avant, deux photos refusées après 20,0 s chacune ; après, la première après 20,3 s, avec la phrase en clair, la suivante, 33 s après l'échec, en 0,6 s. Avec le .bin du banc coupé, deux photos se calculent (6,5 et 6,6 s), sans refus. A4, contexte perdu pendant le chargement, « Recharger » focalisé : avant, 3 changements du message par seconde, et le focus revenu à `body` ; après, aucun changement en 5 s, focus gardé. B3, B5 et B9, fichier d'éclairage coupé, message réel : avec le nouveau texte et l'ancienne mise en page, sur l'iPhone 14, de 116 à 238 px, sur le point de mise au point (220 à 246 px), et sur ordinateur, à partir de 320 px, sur l'indicateur d'équilibre (jusqu'à 344 px) ; après, ordinateur de 384 à 896 px de large, sur aucun indicateur ; Pixel 7 et iPhone 14 de 8 px au bord moins 8 px, de 108 à 201 px de haut, loin du point de mise au point ; « Recharger » 98 × 32 px (94 × 32 sur téléphone), rendu par `elementFromPoint` dans les trois cas ; message de la perte du contexte : 62 px de haut sur ordinateur, 77 px sur l'iPhone 14. A5 : contrôle sans WebGL de la routine lancé seul, profils ordinateur, Pixel 7 et iPhone 14 : réussi, bouton « Défis » masqué, aucune erreur ; il n'a pas été lancé sur une construction fautive. Aucune erreur de la page ni de la console dans ces essais, hors les fichiers coupés exprès et leur `SceneFileError`. Routine complète non lancée sur la machine de Claude (deux redémarrages du conteneur pendant cette version) : la CI la lance sur ses quatre profils. `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

Contrôle final, par un agent qui n'a rien écrit de la version, au commit 5b688a2 : le Sujet 10 est couvert en entier, version fusionnable. Essais rejoués (Chromium en rendu logiciel, site construit servi en local) : fichier d'éclairage coupé, à 1280 × 800, message à 8,5 s, « Un fichier de la scène n'a pas été reçu (autumn_hockey/autumn_hockey_1k.hdr). Le viseur peut être incomplet, et les photos échouer. Vérifie ta connexion. Version du site : 0.3.70. », de 384 à 896 px, « Recharger » de 98 × 32 px rendu au centre ; première photo en échec après 23,9 s avec la phrase en clair, seconde refusée sans calcul ; sur l'iPhone 14 émulé, message à 7,8 s, de 8 à 382 px de large et de 108 à 201 px de haut, première photo en 23,4 s, seconde refusée ; modèle du banc coupé (Pixel 7 émulé), nommé à 14,5 s, deux photos calculées (5,7 et 5,8 s) ; `.bin`, texture et `dennis_posed_004/scene.bin` nommés par leur chemin ; manifeste coupé, « Crédits indisponibles : … » ; sans WebGL, message lisible de 67 à 119 px (iPhone 14 : 116 à 208 px ; Pixel 7 : 116 à 188 px), aucun autre élément de `main` affiché ; contexte perdu puis restauré 3 s plus tard (grille de 48 cases), témoin 48 sur 48 à 1,000, message et « bruit non mesuré » pendant la perte, déclenchement refusé en moins de 0,01 s, message retiré 0,5 s après la restauration, 48 cases sur 48 à 1,000 20 s après elle, photo suivante en 6,3 s ; même essai sur `origin/main` : aucun message, photo noire acceptée avec son bulletin, « signal/bruit 0:1 », 26 cases sur 48 à 1,000, de 0,936 à 1,019. Corrigé par lui : la ligne « Corrigé » du fichier d'éclairage, qui citait l'ancien message. Points non bloquants, reportés dans `docs/etat-des-travaux.md` : `SceneNotReadyError` écrit dans la console après la borne de 20 s ; le contrôle sans WebGL jamais lancé sur une construction fautive. Le second refus mesure de 3,4 à 3,7 s entre le clic de Playwright et l'écran de revue, contre 0,6 s mesuré dans la page par l'agent de corrections : écart probablement dû au pilote, non mesuré dans la page.

CI du commit e18afa1 (fin de la mise en œuvre) : routine verte (exécution 96). Celle du dernier commit est relevée dans la pull request 77 avant la fusion. Ces tests émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; aucun geste de la routine n'est un toucher.

Agents de la version, d'après leurs notifications de fin : mise en œuvre 222 896 jetons, relecteur du code 153 070, relecteur débutant 166 272, correction 234 900, contrôle final 175 101.

Fin de la version 0.3.69, relue par la session du Sujet 10 le 19 novembre 2026 vers 23 h 47 UTC : `main` sur 644eaa5, commit de fusion de la pull request 76 ; tag annoté `v0.3.69` (objet cf7e9b3) sur 644eaa5, par `git ls-remote` ; release « v0.3.69 - 2026-11-19 » publiée à 23 h 44 min 55 s UTC ; publication sur GitHub Pages réussie (exécution 66, finie à 23 h 44 min 47 s UTC ; site publié non regardé) ; aucune pull request ouverte. Lignée relue dans l'outil qui décrit la session : profondeur 1 sur 8. Pendant cette version, le conteneur de la session a redémarré deux fois, chaque fois pendant la routine lancée sur la machine de Claude (profil ordinateur) ; les agents coupés ont été repris par un message, et la routine laissée à la CI.

## [0.3.69] - 2026-11-19

Sujet 9 du plan de corrections de l'audit (`docs/audit/README.md`) : la vue de dessus et l'indicateur d'équilibre jugent les mêmes points que le bulletin. Constats FMA-12 et PHY-17. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Vue de dessus et indicateur d'équilibre ».

### Ajouté

- `app/src/camera/bulletin.ts` : `measureThing`, sortie de `measureShot`, mesure un sujet (profondeur et netteté de son point le plus proche, cadre, traînée) ; seule formule pour le bulletin, l'indicateur d'équilibre et la vue de dessus.
- `app/src/camera/autofocus.ts` : `depthUnder`, profondeur de ce qui est vu sous un point du viseur, lue dans la carte de profondeur du viseur, dans une image rendue après la demande.
- `app/src/scene.ts` : `judgedPoints`, une seule règle pour la vue de dessus et l'indicateur quand les yeux d'un sujet ne sont pas lus dans le modèle : sa position au sol, à 1,6 m pour un personnage, à 0,67 m pour le chien (hauteur de ses yeux mesurée pendant le galop, de 0,62 m à 0,72 m).
- `docs/tests-a-faire-faire.md` : test T11, la fluidité du viseur et le délai de l'indicateur d'équilibre sur un téléphone.

### Modifié

- Vue de dessus (FMA-12, `app/src/ui/topView.ts`) : les sujets restent dessinés à leur position au sol, mais sont cerclés de vert quand le bulletin les jugerait nets, par `measureThing`, sur les mêmes points : les yeux des personnages et du chien, un point à 0,5 m du sol pour le banc et la poubelle. Le cercle commun à Fabienne et Percy est vert si les deux sont nets. Appareil incliné de l'angle i, les limites de la zone nette et le plan de mise au point sont dessinés à la distance horizontale profondeur / cos(i), pour que la bande et le jugement concordent (à h × tan(i) près pour un point plus haut ou plus bas de h que l'œil de l'appareil). Un toucher sur la carte redessine la vue après l'image suivante, quand la caméra a pris sa nouvelle position. L'étiquette de la carte pour les lecteurs d'écran (`topViewLabel`) dit ce que juge le vert.
- Indicateur d'équilibre (PHY-17, `app/src/ui/balance.ts`) : la traînée est calculée par `measureThing`, aux yeux du sujet visé, comme le bulletin, et non plus au point visé reconstruit à la distance de mise au point. Le sujet visé est cherché autour du point vu sous le repère, reconstruit à la profondeur lue dans la carte du viseur (`depthUnder`), et non plus à la distance de mise au point ; à cette distance si la lecture échoue. Pixels rapportés au grand côté du capteur, comme le bulletin (même valeur pour les boîtiers de TutoPhoto). La carte n'est lue que pour cette recherche : quand la détection suit le promeneur ou le chien, il est pris directement. La zone nette et l'ISO sont écrits dès la lecture de l'image du viseur ; seule la ligne de la vitesse attend la carte.
- `docs/camera-physique.md` : sections « Indicateur d'équilibre » et « Vue de dessus et appareil déplaçable » mises à jour (points jugés, recherche du sujet visé, ses limites, son coût et son délai, dessin de la bande appareil incliné ; traînée en pixels rapportée au grand côté du capteur).
- Fiche NET-01 : la vue de dessus juge les yeux, comme le bulletin, jusqu'à 20 cm plus près de l'appareil que la position au sol, d'où un cercle qui peut rester gris dans la bande verte ; règle du cercle de Fabienne et Percy. Exercice : les zones nettes affichées par le simulateur, 5,0 m à 9,3 m au 50 mm et 6,3 m à 6,8 m au 135 mm (la fiche écrivait 5,1–9,5 m et 6,3–6,9 m, calculées à 6,6 m, alors que l'œil de Sophia est vers 6,55 m).
- `app/src/camera/bulletin.ts` : le commentaire de `measureThing` dit qu'elle est la seule formule qui juge la traînée et la netteté, la photo estimant aussi une traînée pour choisir son nombre de rendus.

Essais de la mise en œuvre, au commit e9a37d6 (Chromium en rendu logiciel, site construit servi en local, contexte neuf à chaque essai, Nikon Z 6 de départ, mode A, ISO 100 avec l'ISO auto, correction à ±0,0 IL), avant et après la correction. FMA-12 (fenêtre de 1280 × 800, défi SIT-05, 85 mm, f/1.4, AF-C, zone automatique, détection des visages et des yeux, œil à 6,5 m, zone nette de 6,3 m à 6,8 m ; deux photos) : avant, les trois repères du groupe verts et le bulletin « manqués : Dennis, Percy » ; après, Dennis gris, Sophia vert, le cercle de Fabienne et Percy gris, et le même bulletin, « manqués : Dennis, Percy ». Contre-épreuve à f/8 (de 5,4 m à 8,2 m, 8,3 m par moments sur la vue de dessus) : les trois repères du groupe verts et le défi réussi. PHY-17 (défi SIT-06, 50 mm, f/8, 1/100 s, AF-S, point sélectif) : toucher sur le visage de Sophia, « verrouillée à 6,6 m », puis appareil tourné à droite et vers le bas jusqu'à placer le point devant la poubelle, où passe le chien, vers 9 m. Avant (fenêtre de 1280 × 800) : sur trois fois 45 s, l'indicateur écrit toujours « sujet visé immobile » (111 à 113 relevés par tour), alors que les photos prises avec le chien dans le cadre donnent une traînée de 8,1 et 7,5 px. Après, déclenchement dans la page dès que l'indicateur nomme le chien : indicateur 7,0, 7,2, 7,4 et 7,9 px, bulletin de la même photo 6,9, 7,1, 7,2 et 8,1 px ; l'écart, de 0,1 à 0,2 px, vient probablement du chien qui court pendant l'image ou les deux images que l'indicateur attend avant d'écrire (carte de profondeur, puis lecture du bruit). Déclenché par Playwright, avec son aller-retour, le chien avait déjà quitté le cadre sur les sept photos. Aucune erreur de la page ni de la console. Routine `node scripts/test_app.cjs --photo`, profil iPhone, lancée sur la machine de Claude au commit e9a37d6 : 0 échec. `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

Relecture : la mise en œuvre (commit e9a37d6) a été relue par deux agents, l'un pour le code et la vérité des textes (A1 à A10), l'autre en débutant devant l'écran, sur ordinateur, Pixel 7 et iPhone 14 émulés (B1 à B9) : 19 constats. Un agent de corrections les a repris en cherchant d'abord à les réfuter, dans le code et à l'écran. Classement : 13 confirmés (A1 à A9, B1, B2, B5, B8 ; B1 est A1), 2 confirmés en partie (B3 : le vert ne juge que la netteté, ce que veut le constat FMA-12, mais rien ne le disait ; B7 : effet de la recherche du sujet visé, qui le nomme seulement quand il passe sous le repère, mais rien ne le disait), aucun réfuté, 4 hors du sujet, défauts antérieurs ou demandes d'ergonomie (A10, le sujet suivi et son point restent ceux du verrouillage en AF-S après un recadrage ; B4, rien ne dit à l'écran que le troisième repère vaut deux personnes ; B6, la zone automatique en AF-C alterne entre le promeneur et Percy, aussi sur la version 0.3.68 d'après le relecteur, non refait ; B9, sur iPhone, le bouton « Vue de dessus » cache la fin de l'indication de mise au point), reportés dans `docs/etat-des-travaux.md`. Corrigés : A1 et B1, « plus loin » devenu « plus près » dans NET-01, ici et dans `docs/propositions.md` (les yeux sont à z local positif d'un modèle tourné d'un demi-tour : Dennis 18 et 20 cm, Percy 15 et 20 cm plus près) ; A2, la bande dessinée appareil incliné (choix 6) ; B5, l'indicateur en deux temps (choix 7), et la carte lue seulement quand il le faut (choix 8) ; A3, le coût écrit dans tous les modes et l'essai T11 ; A5, une seule règle de repli (choix 9) ; A6, la vue redessinée après l'image suivante (choix 10) ; A4, A7, A8, A9 et B8, textes (`docs/camera-physique.md`, commentaires de `bulletin.ts` et `balance.ts`, `topViewLabel`, choix 11) ; B2, les valeurs de l'exercice de NET-01 (choix 12) ; B3, B7 et A10 écrits dans `docs/camera-physique.md`. Essais des corrections (mêmes conditions que ci-dessus, site construit au commit des corrections). B5, délai entre un cran d'ouverture et le changement de la ligne « zone nette », six crans par mode (script du relecteur) : avant, 0,8 à 1,9 s pour l'indicateur, et la vue de dessus souvent 0,4 à 0,9 s plus tôt ; sur la version 0.3.68, 0,4 à 1,2 s ; après, 0,39 à 1,6 s, 0,8 s le plus souvent (AF-S point : 0,83 à 1,31 s ; AF-C zone automatique : 0,78 à 0,85 s ; AF-C point : 0,39 à 1,60 s), la vue de dessus changeant en même temps que l'indicateur dans 14 cas sur 18. Rendu logiciel seulement, non mesuré sur téléphone. FMA-12 refait (85 mm, f/1.4) : Dennis gris, Sophia verte, cercle de Fabienne et Percy gris, bulletin « manqués : Dennis, Percy » sur deux photos ; à f/8, les trois repères du groupe verts, défi réussi sur deux photos. PHY-17 refait (AF-S verrouillé sur Sophia, recadré sur le chien) : indicateur 7,2, 7,4, 8,0 et 7,2 px, bulletin de la même photo 7,2, 7,4, 8,0 et 7,2 px. A2 (AF-S de départ, mise au point à 26,7 m, zone nette à partir de 7,7 m) : limite proche dessinée à 7,75 m appareil à l'horizontale de départ, à 10,1 m incliné au maximum (0,7 rad ; 7,73 / cos 0,7 = 10,1), le banc, à 8 m, passant alors au gris. Hauteur des yeux relevée dans le navigateur, sur une construction de mesure non publiée : personnages de 1,51 m à 1,71 m, chien de 0,62 m à 0,72 m pendant le galop, 0,74 m devant le centre de son modèle. Aucune erreur de la page ni de la console. Routine `node scripts/test_app.cjs --photo`, profil android, lancée sur la machine de Claude au commit 7bfbb20 : 0 échec.

Contrôle final, par un agent qui n'a rien écrit de la version, au commit ce94ffc : le Sujet 9 est couvert en entier ; FMA-12 (85 mm, f/1.4 puis f/8), PHY-17 (point sélectif : 7,2, 7,2 et 7,4 px à l'indicateur comme au bulletin ; zone automatique : 8,0, 7,4 et 8,0 px des deux côtés) et l'exercice de NET-01 rejoués à la lettre, conformes. Un point bloquant, la page de reprise, que la réécriture de `docs/etat-des-travaux.md` avant la fusion règle (les quatre défauts hors du sujet, les choix 1 à 12, T11). Corrigé après lui : la parenthèse de l'exercice de NET-01 dit la vraie cause de l'écart (mise au point vers 6,55 m, affichée 6,6 m) ; `docs/camera-physique.md` écrit que la lecture de la carte passe par la même file que les mesures de l'autofocus et peut retarder l'AF-C (lecture du code, non mesuré), et T11 le demande ; la contre-épreuve à f/8 s'écrit de 5,4 m à 8,2 m.

CI du commit ce94ffc : validate, confidentialite, app et description verts ; routine verte sur ses quatre profils (ordinateur 32 min, Android 37 min, iPhone 31 min, WebGL 1 38 min). Ces tests émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; aucun geste de la routine n'est un toucher.

Agents de la version, d'après leurs notifications de fin : mise en œuvre 198 581 jetons, relecteur du code 163 535, relecteur débutant 207 667, correction 195 803, contrôle final 196 852.

Fin de la version 0.3.68, relevée par sa session, qui porte aussi le Sujet 9 : pull request 75 fusionnée vers 17 h 45 UTC, commit de fusion f9691fb ; tag annoté `v0.3.68` relu par `git ls-remote` à 17 h 45 min 59 s UTC (objet cbc879c, sur f9691fb) ; publication sur GitHub Pages réussie (exécution 65, relue dans la liste des exécutions ; le site publié n'a pas été regardé) ; surveillance de la pull request 75 arrêtée. CI du dernier commit, c1fcacc : validate, confidentialite, app et description verts ; routine verte sur ses quatre profils (ordinateur 31 min, Android 18 min, iPhone 17 min, WebGL 1 27 min). Mesure de l'outil qui décrit la session, vers 17 h 47 UTC : 297 409 jetons de sortie, 7 665 d'entrée, 68 920 917 lus du cache, 8 532 285 écrits au cache, 64,25 dollars affichés ; la session ne sait pas si ce compte inclut ses cinq agents ; limite de sept jours au statut « allowed_warning ». Création de la session suivante essayée une fois, refusée : « this session is at lineage depth 8 (limit 8), so it cannot start sessions, or create, fire or re-arm routines and reminders ». Le Sujet 9 continue donc dans la même session, sans relance automatique.

## [0.3.68] - 2026-11-19

Sujet 8 du plan de corrections de l'audit (`docs/audit/README.md`) : fiches de mise au point, des exercices et des recettes jouables à la lettre. Constats FMA-16, FMA-01, FMA-11, FMA-22, FMA-03, FMA-02, FMA-08 et FMA-17. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Fiches de mise au point ».

### Ajouté

- `data/sources.yaml` : la page « The Sub-Selector » du manuel du Nikon Z 6 (`nikon-z6-sub-selector`), relue le 19 novembre 2026 : « Focus Lock », faire le point puis recadrer, et « Do not change the distance between the camera and the subject while focus lock is in effect » ; et la même page en français (`nikon-z6-sub-selector-fr`, « Sélecteur secondaire »), dont NET-06 et MAP-06 citent le texte à côté de l'anglais.
- `docs/tests-a-faire-faire.md` : test T10, l'exercice de MAP-05 sur un téléphone tenu à l'horizontale. `docs/questions-ouvertes.md` : ce que fait un Z 6 quand le sol entre dans une zone large.

### Modifié

- Fiche NET-06 (FMA-16) : l'exercice dit de toucher de nouveau Sophia après avoir avancé l'appareil, la mise au point restant verrouillée en AF-S jusqu'au toucher suivant, avec la phrase du manuel du Z 6 ; réglages écrits en entier ; « jusqu'à 9,5 m » devient « d'environ 5,0 m à 9,3 m », ce qu'affiche le simulateur. Après relecture : la photo ratée est prise avant le nouveau toucher, l'appareil est avancé « à peu près à mi-chemin entre l'appareil (le triangle blanc) et le groupe (les points blancs) », Sophia est montrée (« la femme au haut blanc »), le bandeau est à vérifier (« œil · verrouillée à » environ 6,5 m), ISO 100 et vue par vue sont écrits, la phrase de Nikon est dite valoir pour la mise au point mémorisée à mi-course, ce que le toucher remplace.
- Fiche MAP-04 (FMA-01, FMA-11) : l'exercice nomme le défi SIT-06 et le mode A à f/2 (1/1600 s), et se joue en trois temps : AF-S verrouillé sur Sophia, le chien hors de la zone nette ; AF-S verrouillé sur le chien, le défi réussi aussi, le chien restant à 9 m ; AF-C en Continu H. Il dit ce qu'il montre (la distance verrouillée ne suit pas un changement de sujet) et que le parc n'a pas de sujet qui approche. « Simulateur » : en AF-S, une photo prise sans toucher le viseur fait le point au déclenchement, et cette distance reste verrouillée. Après relecture : ISO 100, « Retour au départ », libellés exacts (« Détection visage/yeux activée », « Détection des animaux », « Continu H (5,5 vps) »), « quand il est dans le cadre », valeurs écrites « environ ».
- Fiche MAP-09 (FMA-22, FMA-08) : « Simulateur » dit ce que fait TutoPhoto en AF-C (repère ambre qui suit) et en AF-S (repère blanc au centre avant le toucher, vert après ; resté ambre au retour de l'AF-C), et que le Z 6 montre la bordure ambre dès la détection (D18 sans réponse : le comportement reste) ; l'exercice dit « le visage le plus proche du point de mise au point, au centre du cadre au départ », montre Percy et écrit ses réglages en entier. Après relecture : l'exception du chargement en AF-S et en zone automatique (une mesure, repère sur le sujet le plus proche, souvent le sol, ou ambre sur un visage), ISO 100, « Retour au départ », libellés exacts.
- Fiches SIT-05 et MAP-05 (FMA-03) : la règle de la zone large est dite comme celle de TutoPhoto (le point le plus proche, même le sol), le manuel ne parlant que du sujet le plus proche ; SIT-05 ajoute qu'à f/8 la zone nette pardonne l'écart, pas à f/1.4, et nomme l'AF-S. MAP-05 (FMA-08) : exercice en cadre horizontal, réglages écrits, « environ 5,8 m contre 6 à 7,6 m selon l'endroit touché », le sol touché juste devant les pieds, dans le cadre en pointillés, et, sur un téléphone, à travers le bandeau de mise au point, qui laisse passer le toucher. Après relecture, SIT-05 écrit tous les réglages de sa recette (défi, focale, ISO 100, correction, détection, vue par vue, « Retour au départ ») et montre Sophia.
- Fiche MAP-06 (FMA-02) : « Les collimateurs ne couvrent que cette zone », puis le recadrage en AF-S, cité du manuel du Z 6 ; « Simulateur » : le recadrage marche dans TutoPhoto, et l'exposition n'y change pas avec le cadrage (une seule luminosité pour le parc). Après relecture : la citation de Nikon n'est plus coupée (encadré AF-S et « Recompose the photograph and shoot », avec le texte français de Nikon) et la fiche dit comment l'exposition se mémorise sur le Z 6 ; l'exercice nomme le défi, écrit ses réglages, dit comment tourner l'appareil et se joue en trois temps : œil hors des pointillés, faire le point puis recadrer, point sur le décor.
- Fiche LUM-02 (FMA-08) : « un plein soleil, que TutoPhoto ne montre pas ».
- Note de la fenêtre « Défis » (FMA-17, D20 sans réponse : la phrase seule) : « Le défi ne juge ni l'exposition ni le bruit : lis aussi la ligne « Exposition » du bulletin. » (`app/src/texts.ts`).

Essais (Chromium en rendu logiciel, site construit servi en local, fenêtre de 1280 × 800, densité 1, contexte neuf à chaque exercice, donc l'état de départ du simulateur) : chaque exercice et recette réécrit rejoué à la lettre. NET-06 : toucher sur Sophia, « œil · verrouillée à 6,6 m », zone nette de 5,0 m à 9,3 m ; appareil avancé à 3,6 m d'elle, sans retoucher : mêmes textes, et la photo manque le défi SIT-01 (« œil de Sophia … (3,6 m) » manqué) ; après un nouveau toucher, « verrouillée à 3,6 m », de 3,1 m à 4,3 m, défi réussi. MAP-04 : f/2 et 1/1600 s en mode A ; AF-S verrouillé sur Sophia à 6,6 m (de 5,7 m à 7,7 m) : sur dix photos, huit avec le chien dans le cadre, toutes « Manqué : chien dans la zone nette (9,0 m) » ; détection des animaux, premier toucher « œil · verrouillée à 9,0 m », puis quatre photos sans retoucher : deux avec le chien dans le cadre, réussies, deux sans lui ; AF-C en Continu H, rafale de trois vues, réussie sur une (deux sur trois au premier essai), les autres en « sujet le plus proche » à 5,8 m. Photo prise en AF-S sans toucher : « mise au point à 26,7 m », puis « verrouillée à 26,7 m », gardée après avoir tourné l'appareil, indicateur d'exposition inchangé (« M · −0,2 IL »). MAP-09 : en AF-S, avant le toucher, repère blanc au centre (« AF-S · Auto · 26,7 m ») ; en AF-C, ambre sur l'œil de Sophia ; revenu en AF-S, encore ambre ; un toucher sur Percy, vert, « verrouillée à 6,3 m » ; défi SIT-05 réussi (de 4,0 m à 14,8 m) ; AF-C et détection des animaux, repère ambre sur l'œil du chien à 9,0 m, puis « sujet le plus proche » quand il sort. MAP-05 : en point sélectif, 7,9, 7,1, 6,4 et 6,1 m à 80, 85, 90 et 92,5 % de la hauteur du cadre ; en zone large (L), 5,8 m aux quatre endroits, 6,5 m sur le visage de Sophia. SIT-05 : recette (f/8, 1/100 s, AF-S, zone automatique), « œil · verrouillée à 6,6 m », défi réussi ; zone large (L) aux pieds, 5,8 m, de 3,8 m à 12,5 m, réussi ; à f/1.4 (1/3200 s), de 5,3 m à 6,4 m, « manqués : Sophia ». Note de la fenêtre « Défis » relue dans le site construit. Sur un Pixel 7 émulé tenu à l'horizontale, le cadre est horizontal (188 × 125 px) ; tenu à la verticale, vertical (294 × 441 px) : l'exercice de MAP-05 sur un vrai téléphone est le test T10. Rejeu après relecture, chaque exercice et recette modifié joué à la lettre, une fois dans un contexte neuf et une fois juste après un autre exercice, dans la même page, sans recharger (ce que fait une fiche ouverte par-dessus le simulateur) : NET-06 (neuf, puis après MAP-04) : « œil · verrouillée à 6,5 m », de 5,0 m à 9,3 m ; appareil avancé à mi-chemin sur la carte, photo sans retoucher : « Manqué : œil de Sophia … (3,3 m) » ; nouveau toucher, 3,3 m, de 2,9 m à 3,9 m, défi réussi. MAP-04 (neuf, puis après MAP-05) : 1/1600 s ; Sophia verrouillée à 6,5 ou 6,6 m, zone nette jusqu'à 7,7 m, chien « Manqué : chien dans la zone nette (9,0 m) » sur chaque photo ; chien verrouillé à 9,0 m, défi réussi sur chaque photo où il est dans le cadre ; « Continu H (5,5 vps) », rafale de deux vues, réussie sur une. MAP-09 (neuf, puis après SIT-05) : Percy verrouillé à 6,3 m, défi réussi ; en AF-C avec « Détection des animaux », œil du chien à 9,0 m quand il passe ; après SIT-05, le repère est vert sur la distance gardée avant le toucher (écrit dans la fiche). MAP-05 (neuf, puis après MAP-09) : point sélectif de 6,0 à 6,3 m, zone large (L) 5,8 m aux quatre endroits ; sur un Pixel 7 émulé à l'horizontale, trois touchers à travers le bandeau : point sélectif de 6,6 à 7,6 m, zone large 5,8 m. SIT-05 (neuf, puis après MAP-06) : 1/100 s, toucher sur Sophia, défi réussi. MAP-06 (neuf) : toucher hors des pointillés ramené au bord (repère à 230 px, décor à 244,3 m) ; œil de Sophia touché, 6,6 m, de 6,4 m à 6,7 m ; appareil tourné, défi réussi avec la distance gardée ; toucher sur le décor, œil manqué. Après MAP-05, le même jeu a donné des positions fausses : en rendu logiciel (1,5 image par seconde), les glissés de Playwright ne placent pas Sophia où le script le calcule, et le relevé du bord n'a donc pas été refait sur son œil ; le toucher hors des pointillés, ramené au bord, et le toucher sur le décor (500,0 m, œil manqué) ont été retrouvés. « Retour au départ » après avoir tourné l'appareil : la position revient, pas la direction (vue de dessus et viseur). Aucune erreur de la page ni de la console. `python3 scripts/validate.py`, `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

Relecture : deux relecteurs, l'un sur les sources et le code, l'autre en débutant qui joue chaque exercice à la lettre, au commit e8d4d97 ; 22 constats, chacun contre-vérifié avant correction (dans le code, aux pages de Nikon, ou à l'écran). Aucun n'est réfuté en entier ; une proposition l'est : « (0 IL : exposition visée) » dans la note des défis (B16), faux dès qu'une correction d'exposition est réglée, la ligne « Exposition » du bulletin donnant l'écart à l'exposition correcte ; la note garde « lis aussi », `CLAUDE.md` imposant le tutoiement (Sujet 13 pour le reste du simulateur). Deux sont confirmés en partie : A3 (la phrase de Nikon sur la zone automatique vise le sélecteur secondaire en AF-C, pas la mi-course : une demi-phrase suffit) et B6 (le bandeau cache bien le bas du cadre sur un téléphone, mais laisse passer le toucher : la fiche dit de toucher à travers, pas au-dessus). B9 (visage inconnu à 12,4 m) n'a pas été retrouvé en trois essais (toujours « œil · verrouillée à 6,5 m ») ; la vérification du bandeau est ajoutée quand même. Corrigé : MAP-09 dit l'exception du chargement en AF-S et en zone automatique (A1) ; MAP-06 cite Nikon sans coupe, avec le texte français de Nikon (A2, B14), et se joue en trois temps avec ses réglages (B1, B2) ; NET-06 fait prendre la photo ratée avant le nouveau toucher, montre Sophia et l'avancée sur la carte, et demande de vérifier le bandeau (B7 à B10, B13) ; ISO 100, « Retour au départ » et libellés exacts dans tous les exercices touchés (A4, B3, B4, B12, B15), avec, trouvé au rejeu, la phrase qui dit que ce bouton ne remet pas la direction de l'appareil ; valeurs écrites « environ » (A5, B11) ; MAP-05 dit où toucher et donne la fourchette relevée (B5) ; MAP-04 photographie le chien « quand il est dans le cadre » (B17). Ce qui demande de changer le simulateur reste hors du sujet : la mesure au chargement en AF-S et en zone automatique, qui prend le sol plutôt que le visage au centre (A1) ; le bulletin de la photo ratée de NET-06, qui renvoie à MAP-06, MAP-09, NET-01 et NET-06, pas à MAP-04 (B7) ; le chien hors du cadre jugé quand même sur la zone nette et la traînée (B17, avec D19) ; « Retour au départ », qui ne remet que la position.

Contrôle final, par un agent qui n'a rien écrit de la version, au commit e70df81 : aucun constat bloquant. Le Sujet 8 du plan est couvert en entier ; les citations du manuel du Z 6 (« The Sub-Selector », « Sélecteur secondaire », « Focus ») relues aux pages de Nikon, mot pour mot ; NET-06 et MAP-09 rejoués en contexte neuf avec les valeurs écrites (NET-06 : 6,5 m, de 5,0 m à 9,3 m ; photo sans retoucher manquée à 3,2 m ; après le nouveau toucher, de 2,8 m à 3,8 m, réussi ; MAP-09 : 1/100 s, Percy verrouillé à 6,3 m, réussi), et MAP-04 sur son premier temps ; les libellés de l'écran cités par les fiches, tous exacts. Corrigé après lui : la ligne de T10 reprend les valeurs et le geste de la fiche MAP-05 ; trois lignes des choix de Claude (n° 7, 9 et 15) disent qu'une ligne suivante les remplace, ou donnent la valeur finale ; MAP-09 ajoute qu'en AF-C l'œil du chien n'est vu qu'une partie du temps (65 relevés sur 150), le repère tombant alors, blanc, sur le sol à environ 5,8 m ; MAP-06 cite la page « Defaults » pour la valeur par défaut de c1 (« c1 Shutter-release button AE-L Off », relue par Claude le 19 novembre 2026, ajoutée au libellé de `nikon-z6-defaults`). Le contrôle final a aussi retrouvé le visage inconnu à 12,4 m du constat B9 (toucher un peu à gauche de la tête de Sophia, repère sur les arbres) ; la phrase qui fait vérifier le bandeau le rattrape. Laissé pour plus tard : SIT-01 et SIT-06 n'emploient pas encore les libellés exacts de l'écran (« Défauts connus, hors du plan », dans `docs/etat-des-travaux.md`). Non rejoués par le contrôle final : MAP-05, MAP-06, SIT-05 et la fin de MAP-04, que le correcteur avait rejoués.

CI du commit e70df81 : validate, confidentialite, app et description verts ; routine verte sur ses quatre profils (ordinateur 30 min, Android 26 min, iPhone 21 min, WebGL 1 28 min). Plus tôt, au commit e8d4d97, le profil iPhone avait échoué sur le contrôle FMA-23 (deux pertes du chien à découvert, de 0,4 et 0,5 s), sans rapport avec le diff, qui ne changeait qu'un texte ; le contrôle n'a pas été relâché. Ces tests émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; aucun geste de la routine n'est un toucher.

Agents de la version, d'après leurs notifications de fin : mise en œuvre 268 714 jetons, relecteur des sources et du code 197 390, relecteur débutant 213 747, correction 281 672, contrôle final 185 340.

Fin de la version 0.3.67, relevée par sa session : tâche « Sujet 7 : relance automatique toutes les heures » supprimée, liste des tâches programmées vide vers 10 h 04 UTC, surveillance de la pull request 74 arrêtée. Mesure de l'outil qui décrit la session, vers 10 h 03 UTC : 192 144 jetons de sortie, 7 262 d'entrée, 45 995 328 lus du cache, 2 991 820 écrits au cache, 28,61 dollars affichés ; six agents (mise en œuvre 186 698 jetons, deux relecteurs 198 045 et 173 678, correction 175 664, contrôle final 157 769, d'après leurs notifications de fin ; la session ne sait pas si le compte ci-dessus les inclut) ; tranche de 5 heures au statut « allowed ». La session de la version 0.3.68 est à la profondeur 8 sur 8 : la pose de sa relance horaire a été refusée par l'outil.

## [0.3.67] - 2026-11-19

Sujet 7 du plan de corrections de l'audit (`docs/audit/README.md`) : des exercices d'exposition jouables à la lettre. Constats FEX-02, FEX-01, FEX-05, FEX-06, FEX-13, FMA-13 et FEX-17 ; s'y fond le Sujet 20 (FEX-16, D5 tranchée : « f/5.6 »). Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente. Choix de Claude : `docs/propositions.md`, section 5, « Fiches d'exposition ».

### Modifié

- Interface : l'ouverture s'écrit avec le point (« f/5.6 », décision D5 de Julien, 15 novembre 2026 ; FEX-16, Sujet 20 fondu ici) ; les autres valeurs décimales gardent la virgule (`app/src/ui/cameraPanel.ts`). La routine attend « f/1.4 » (`scripts/test_app.cjs`) ; le test T6 aussi.
- Fiches EXP-04, EXP-05 et EXP-06 (FEX-02, FEX-01, FEX-05) : la section « Simulateur » dit que l'ISO auto est activé si rien n'a été changé, que le simulateur garde la plupart des choix d'une visite à l'autre, et comment désactiver l'ISO auto ; l'indicateur d'exposition est décrit par ce qu'il affiche ; les exercices donnent les valeurs affichées (−0,2 IL à f/5.6 et 1/200 s, +0,8 IL à f/4 ; −0,2, −2,2, puis −0,2 IL) et le sens de la molette « Vitesse » ; l'exercice de EXP-06 donne la réponse (ISO 250), où viser (le sol immobile en bas du cadre, en AF-S et point sélectif), comment ouvrir l'indicateur d'équilibre sur téléphone, et deux comparaisons calculées, sans valeur lue (« change peu » ; « divisé par environ 4,5 », √20).
- Fiches MES-04, MES-10 et BOI-08 (FEX-06) : réglages écrits en entier (mode, ISO, ISO auto, correction à « ±0,0 IL », focale à 50 mm) ; MES-04 donne aussi ce qu'affiche l'indicateur en M avec une correction (« M · −1,2 IL · corr. +1,0 », bulletin à −0,2 IL) ; BOI-08, l'écart à 1/4000 s (−0,5 IL). BOI-12 renvoie à la recette de SIT-06 et dit de garder le doigt sur « Déclencher » pour la rafale. BOI-07 (FEX-17) : « f/2 ou davantage (f/1.8, f/1.6, f/1.4 : un nombre plus petit) », avec la mise au point à régler.
- Fiches MES-10, BOI-08, BOI-12 et MVT-01 (FEX-13, FMA-13) : « avec le boîtier de départ (Nikon Z 6) et la focale à 50 mm » ; avec un boîtier APS-C, le chien demande 1/1250 s, et MVT-01 donne le promeneur et le chien en APS-C (1/320 s, 1/1250 s) et au 85 mm en plein format (1/320 s, 1/1250 s), avec la méthode de lecture (le bulletin, le sujet dans le cadre au déclenchement).
- `docs/tests-a-faire-faire.md` : test T9, le rapport signal sur bruit de l'exercice de EXP-06 sur téléphone. `docs/questions-ouvertes.md` : la variation de ce rapport à lumière égale.

Essais (Chromium en rendu logiciel, site construit ou serveur de développement, contexte neuf à chaque exercice, donc l'état de départ) : chaque exercice réécrit rejoué à la lettre par l'agent de mise en œuvre, par le relecteur du débutant et par l'agent de correction ; les valeurs affichées sont celles des fiches. Sur un Pixel 7 émulé : BOI-12 joué au complet (10 vues ; défi réussi sur deux vues), commandes atteignables, indicateur d'équilibre replié au départ ; la rafale y est tenue à la souris, pas par un toucher. Défi SIT-06 avec le Z 6 : réussi à 1/1000 s et 1/800 s (chien à 0,8 et 1,0 px), manqué à 1/640 s (1,3 px) ; avec un boîtier APS-C à 1/1000 s, manqué, comme l'annonce MES-10. Les valeurs APS-C de MVT-01 et celles du 85 mm viennent des contre-vérifications de FEX-13 et de FMA-13 et du calcul (diagonale du capteur / 1500), pas d'un rejeu. Rapport signal sur bruit au sol, ISO 320 puis ISO 6400 sans autre changement, puis ISO 6400 à f/9 et 1/4000 s : 116, 92, 26 ; 111, 90, 25 ; 137, 102, 30 ; 63, 59, 14 ; 33, 36, 7 (ordinateur) ; 92, 84, 21 (Pixel 7) : la division par environ 4,5 tient (de 4 à 5), la première étape varie de +9 % à −26 %, sans cause connue (`docs/questions-ouvertes.md`). Pendant le rejeu de BOI-12, l'autofocus a souvent lâché le chien (« sujet le plus proche ») : cadrage du rejeu non relu, je ne sais pas si c'est le chien caché par le groupe (prévu par la fiche SIT-06) ou une perte que la version 0.3.66 n'a pas corrigée.

Relecture : deux relecteurs (sources et code ; débutant, interface et jeu à la lettre), 19 constats, puis un agent qui a cherché à réfuter chacun : aucun réfuté, tous corrigés dans les fiches, sauf ce qui demande de changer le simulateur (bouton de remise à zéro, sens de la molette « Vitesse », note `previewNote` qui dit « lire la cellule »), noté dans « Défauts connus, hors du plan » de `docs/etat-des-travaux.md`.

Contrôle final par un agent qui n'a rien écrit de la version : rien à corriger (valeurs recalculées, libellés relus, EXP-04, MES-04, BOI-08 et EXP-06 rejoués à la lettre). Essais de la CI : routine verte sur ses quatre profils aux commits 2f166a3 et e16ec05 (même code de l'application que la fusion) ; au commit 62c75aa, qui ne change que des documents, le profil iPhone échoue au contrôle FMA-23 de la version 0.3.66 (deux pertes courtes du chien pour une tolérée) : échec au hasard, noté dans « Défauts connus, hors du plan », contrôle non relâché. Les résultats du dernier commit sont dans la description de la pull request 74. Ces essais émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; les profils mobiles déclarent un écran tactile, mais aucun geste de la routine n'est un toucher. `python3 scripts/validate.py`, `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

Fin de la version 0.3.66, relevée par sa session : tâche « Sujet 6 : relance automatique toutes les heures » supprimée, liste des tâches programmées vide à 6 h 08 UTC, surveillance de la pull request 73 arrêtée. Mesure de l'outil qui décrit la session, vers 6 h 08 UTC : 118 762 jetons de sortie, 1 363 d'entrée, 36 571 672 lus du cache, 480 779 écrits au cache, 13,03 dollars affichés ; un agent relecteur, 176 757 jetons d'après sa notification de fin (la session ne sait pas si le compte ci-dessus l'inclut) ; tranche de 5 heures au statut « allowed ». Correction de la section 0.3.66, qui n'est pas réécrite (page datée) : sa ligne « Modifié » dit « tant que sa tête est visible » ; la fiche SIT-06 publiée dit, après relecture, « tant qu'un de ses yeux est visible ».

## [0.3.66] - 2026-11-19

Sujet 6 du plan de corrections de l'audit (`docs/audit/README.md`) : la mise au point qui suit le chien de SIT-06. Constats FMA-23 et FMA-19 (`docs/audit/fiches-mise-au-point.md`), confirmés par leur contre-vérification, dont la correction est reprise. Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

### Corrigé

- Carte de profondeur du viseur en retard d'une pose (FMA-23, cause 2) : les squelettes sont préparés avant son rendu (`app/src/camera/autofocus.ts`).
- Œil du chien perdu quand son pixel tombe à côté de la tête (FMA-23, cause 1) : la détection lit 3 × 3 pixels autour de l'œil et retient la surface la plus proche de lui ; la distance de mise au point est celle de cette surface (`app/src/camera/faces.ts`).

### Modifié

- Fiche SIT-06 (FMA-19) : la recette dit que la mise au point suit le chien tant que sa tête est visible et dans la zone couverte par l'autofocus ; la section « Défi » dit que le défi ne juge pas si le chien est caché.
- `docs/camera-physique.md` : la détection sur 3 × 3 pixels, les deux causes de FMA-23 et leur correction, les points des yeux du chien gardés, le saut de la mise au point quand la tête du chien est cachée ou hors de la zone couverte (l. 385, 388 et 403 de l'ancienne page, relues comme le demandait le plan).
- `docs/propositions.md` : choix 1 à 6 de ce sujet.

### Ajouté

- Routine de test, contrôle « détection des animaux : le chien à découvert n'est pas lâché (FMA-23) » : l'appareil tourné vers la partie de la course du chien qu'aucun personnage ne cache, l'indicateur de mise au point noté pendant 60 s ; une perte est une courte série « sujet le plus proche » entre deux séries « œil » ou « visage » ; une perte tolérée (choix 4).

Mesures (script hors du dépôt, serveur de développement pour l'accès `__tutophoto`, Chromium sans écran en rendu logiciel, fenêtre de 1280 × 800, 50 mm, AF-C, zone automatique, détection des animaux, appareil tourné de 0,6 rad vers la droite, où le groupe ne cache pas le chien ; « à découvert » : œil à plus de 2,2 m à droite de l'axe et entre 22 % et 78 % de la largeur du canevas, donc dans la zone couverte) :

| Mesure | `main` (0.3.65) | Cette version |
| --- | --- | --- |
| Horloge libre, 180 s (environ 3,3 images par seconde ; l'horloge avance de 0,1 s par image) : images où le chien est détecté, sur celles où son œil est à découvert | 46 sur 86 ; 13 pertes en 57 s d'horloge | 96 sur 96 ; aucune perte en 60 s |
| Horloge figée, 150 instants espacés de 0,04 s : instants où le chien est détecté | 15 sur 28 | 28 sur 28 |

Une première série, avec un critère « à découvert » trop large (de 12 % à 88 % de la largeur du canevas), comptait des instants où l'œil était dans le bord du cadre que l'autofocus ne couvre pas : regardés à part (horloge figée à 1,90 s et 3,38 s), l'œil y est à 15 % de la largeur du canevas, le cadre commence à 14,5 % ; ces pertes-là sont celles de MAP-06, voulues. Sur `main`, les pertes à horloge figée (13 sur 28) sont plus nombreuses que celles mesurées par la contre-vérification de l'audit (3 sur 110, appareil face à la scène) : Je ne sais pas d'où vient l'écart (cadrage, taille du canevas, ou part du retard d'une image qui subsisterait à horloge figée). Rien n'est mesuré sur un téléphone, avec un processeur graphique, ni le coût du second calcul des os.

Relecture : un relecteur (code, routine, fiche et documents), dix constats, contre-vérifiés par la session dans le code avant correction. Corrigés : le retour de l'appareil à son lacet de départ, par glissés de longueur fixe, pouvait osciller autour d'une fenêtre de 0,06 rad sans y entrer (glissés désormais proportionnels à l'écart) ; l'attente de l'arrêt de la caméra relisait la vue de dessus plus vite qu'elle ne se redessine (250 ms ; relecture toutes les 600 ms) ; un faux vert possible du contrôle, un chien vu un instant à l'entrée de chaque passage puis perdu ne comptant aucune perte (garde ajoutée : la plus longue série « vu » doit faire au moins 0,15 fois la plus longue série « perdu ») ; le commentaire du lacet (le bord du cadre coupe la course du chien vers x ≈ 1,9 m à 0,55 rad) ; les os préparés aussi pendant le calcul d'une photo, où la carte du viseur n'est pas rendue (plus rien pendant ce calcul) ; le revers de la lecture 3 × 3, écrit dans `faces.ts` et `docs/camera-physique.md` (un œil dont le pixel est caché mais dont un voisin montre la tête est vu) ; la fiche, qui disait « tant que sa tête est visible » et « le sujet le plus proche du cadre » là où le code juge un œil et la zone couverte, et qui présentait le saut de la mise au point comme celui du boîtier : elle cite désormais le manuel du Z 6 (le visage de l'animal quand ses yeux ne sont pas détectés, réglage a4), source ajoutée à `used_in` de `nikon-z6-a4` ; l'origine des 7,4 m du choix 5, calculée. CI du commit a3df28e : le profil Android échoue au retour de l'appareil à son lacet de départ (resté à 0,552 rad), la détection ayant réussi (trois passages, aucune perte) ; cause vérifiée sur un Pixel 7 émulé : un glissé commencé à 60 px à droite du centre tombe sur la carte de la vue de dessus, dépliée pour lire le lacet. Les glissés partent désormais du centre du cadre, avec un gain de 400 px par radian (120 px y tournent l'appareil de 0,30 rad, contre 0,10 à 0,14 rad sur un écran de 1280 × 800). Laissés : des entrées et sorties de la zone couverte qui clignoteraient au galop compteraient comme pertes (faux rouge possible ; la CI le dira) ; les mesures faites par un script hors du dépôt.

Essais de la CI (routine `--photo`, un job par profil, `routine.yml`) sur le commit e4ff793 : ordinateur, Android, iPhone et WebGL 1 réussis, « 0 échec(s) » chacun ; contrôles requis (`validate`, `confidentialite`, `app`, `description`) verts. Ces essais émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; les profils mobiles déclarent un écran tactile, mais aucun geste de la routine n'est un toucher. `python3 scripts/validate.py`, `npm run build`, `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

## [0.3.65] - 2026-11-19

Sujet 5 du plan de corrections de l'audit (`docs/audit/README.md`) : les pages de reprise. Constats, confirmés par leur contre-vérification : CHX-10 et CHX-01 (`docs/audit/choix-et-outils.md`), DOC-06 et la ligne de DOC-12 sur `docs/questions-ouvertes.md` (`docs/audit/documentation.md`) ; s'y ajoutent les lignes que les contre-vérifications renvoient à cette réécriture : la phrase sur les commits « non signés » (DOC-03, réfuté comme constat), l'accord de Renderpeople tourné en question (D35), les deux derniers points de DOC-12, et la phrase sur SunCalc (SRC-02). Seuls des documents changent ; le simulateur ne change pas. Choix de Claude : `docs/propositions.md`, section 5, « Pages de reprise ». Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- Le plan de corrections lui-même n'est pas révisé (parts anglaises des sujets, neuf refontes retenues par Julien, D10) : `docs/etat-des-travaux.md` le note en tête de la file.
- Les pages datées ne sont pas réécrites : ce changelog, les rapports de `docs/audit/`, `REPRISE.md` (Sujet 45) et les entrées passées de `docs/historique.md`, où ne s'ajoutent que des notes datées, des citations de Julien et des renvois. Les spécifications et les dossiers ne changent que d'un titre ou d'un renvoi.
- « 34 Mo » dans `docs/historique.md` et `docs/pile-technique.md` (premier point de DOC-12) : laissé au sujet qui reprend ces pages.

### Modifié

- `docs/etat-des-travaux.md` réécrit, pas complété (CHX-01, CHX-10) : un seul état, sans récit ; la file de travail est la liste des 48 sujets du plan, par leur numéro, avec leur état, leur version et ce qu'ils attendent, puis les fonctions qui suivent le plan ; une section « Décisions en attente » réunit les décisions D15 à D37 de l'audit (D32 en deux lignes : le viseur sans flou de mouvement, la règle de la médiane), les choix de Claude à confirmer, groupe par groupe, et les essais T1 à T7 sur téléphone, chacun avec ce qui se passe sans réponse ; « Ce que Julien seul peut faire », « Mandat en cours », « Comment reprendre », des « Leçons pratiques » tirées du récit, et les « Défauts connus, hors du plan ». La page passe de 119 ko à 37 ko (118 586 octets sur `main`, 36 548 après la relecture) ; le récit retiré se relit par `git show 2d3d982:docs/etat-des-travaux.md` (choix 1). Corrigé au passage : l'état « Écrit », qu'aucune ligne ne portait, et les travaux « faits cette nuit sur la machine de Claude » ne sont plus dans la file ; « Comment reprendre » ne renvoie plus au premier sujet « Écrit » de l'ancienne file (DOC-12) ; la phrase sur les commits d'avant le 12 novembre 2026, « pas signés », est retirée (DOC-03 : ils portent tous une signature) ; l'accord de Renderpeople est écrit comme une question (D35).
- `docs/questions-ouvertes.md` réduit à ce qui est ouvert, par la revue ligne par ligne de DOC-06 (choix 6) : en-tête daté juste ; points fermés retirés (questions tranchées les 7 et 11 novembre 2026, sources de EXP-06, « Prochaines étapes », dont la règle « On n'étend […] qu'après l'avoir testée », remplacée par la décision D14) ; fond écrêté, chargement sans fin du 9 novembre 2026 (téléphone et navigateur connus, causes corrigées par les versions 0.3.18 et 0.3.25 ; reste le cas du 11 novembre), LUM-02, lisibilité et grilles écrits dans leur état ; la règle de la médiane en sort : c'est la ligne D32 (2) de « Décisions en attente » ; « flou de bougé » devient « la traînée du chien dans SIT-06 » (DOC-12) ; la phrase sur SunCalc ne dit plus qu'aucune version n'est publiée (SRC-02) ; le `todo` de MES-04 est gardé et précisé, comme le demande la contre-vérification.
- `CLAUDE.md` : section « Quelle page pour quelle information » (D6 ; rédaction de Claude, choix 7) ; la règle « Chaque pull request met à jour `docs/etat-des-travaux.md` » devient « réécrit », pas complété.
- `docs/historique.md` : la table des réponses de Julien du 15 novembre 2026 y passe telle quelle (choix 2) ; l'en-tête dit que la page ne reçoit plus que les décisions de Julien ; deux notes datées : les boîtiers « compris comme les trois », confirmés de fait le 11 novembre puis ramenés à trois le 15 (D4) ; la limite du 13 novembre 2026, que deux pages ne décrivent pas de la même façon, « Je ne sais pas » laquelle a raison (DOC-12) ; dans l'entrée du 15 novembre, « l'option choisie reste à confirmer » devient « est confirmée par Julien le soir même » ; deux renvois mis à jour ; les citations de Julien que gardait seule l'ancienne page (12, 13 et 15 novembre 2026, fin du message de la nuit du 11 au 12).
- `docs/camera-physique.md` : la phrase sur les boîtiers « compris comme les trois » mise à jour (D4) ; le viseur sans flou de mouvement (D32) et les choix des histogrammes renvoient à « Décisions en attente » au lieu d'écrire « à confirmer » ; un renvoi vers `docs/historique.md`.
- `docs/propositions.md` : titre « Propositions et choix de Claude », titres des sections 4 et 5 sans « à confirmer », une phrase qui renvoie à « Décisions en attente », deux renvois vers `docs/historique.md`, et les choix 1 à 10 de ce sujet. `README.md` suit le titre.
- Spécifications des grilles, des histogrammes et de la balance des blancs, `docs/dossiers/scenes.md`, `docs/tests-a-faire-faire.md` : un titre ou un renvoi (choix 8).

Relecture : deux relecteurs, chacun sous un angle : ce que la réécriture a perdu ou faussé (11 constats, P-1 à P-11), la conformité au plan et la cohérence entre les pages (15 constats, C-1 à C-15). La session a contre-vérifié chaque constat par une commande (`git show 2d3d982`, `grep`, `wc -c`, `git log`) avant de le corriger ; pas d'agent de réfutation ni de contrôle final par un autre agent (choix 10). Confirmés et corrigés : les suspensions attribuées toutes à la limite de 5 heures, alors que quatre sur vingt-quatre venaient d'une limite propre au modèle (P-1, C-8 ; vérifié dans l'ancienne page : neuvième, treizième, vingtième et vingt-quatrième), avec les leçons perdues (message qui propose de changer de modèle, `rate_limit_info`, limite hebdomadaire jusqu'au 21 novembre 2026) ; un renvoi mort vers « À côté de la file » dans `docs/propositions.md` (P-2, C-1) ; le Sujet 20, qui se fond dans les Sujets 7 et 8 d'après le plan (P-3) ; quatre citations de Julien que seule l'ancienne page gardait, ajoutées aux entrées datées de `docs/historique.md` (P-4), avec celles du 12 novembre au soir ; la méthode d'une fonction nouvelle et celle d'un sujet du plan, remises dans une section « Méthode » (P-5) ; la routine, non requise, qu'un `mergeable_state` à `clean` ne garantit pas verte (P-6) ; la cause du chargement sans fin du 9 novembre, dite établie alors qu'elle ne l'était que pour la version 0.3.25 (P-7) ; D17 en cinq lignes, comme le demande sa contre-vérification (P-8) ; le mode « ultracode » et les redémarrages du conteneur (P-9, P-10) ; les outils pour refaire un audit (P-11, pour sa première part) ; un renvoi cassé et un « à confirmer » dans `docs/specifications/grilles.md` (C-2) ; « restent à confirmer » dans `docs/propositions.md` (C-3) ; deux renvois de `docs/questions-ouvertes.md` qui n'allaient pas à la table (C-4) ; trois phrases de cette section (C-5, C-10, C-11) ; la taille de la page, en unités mêlées (C-6) ; la date de l'en-tête de `docs/questions-ouvertes.md`, 16 novembre et non 12 (C-7) ; la phrase d'en-tête de la table du 15 novembre dans `docs/historique.md` (C-9) ; la ligne des essais dans la table de `CLAUDE.md` (C-13) ; la raison du choix 7, qui va au-delà de D6 (C-14) ; deux numéros de ligne de la file dans les spécifications (C-15). Non retenu : C-12 (les mots du mandat cités dans deux pages), parce que `CLAUDE.md`, l. 7, ligne de Julien, dit de les lire dans « Mandat en cours » (choix 9) ; la date de fermeture de Claude Design (seconde part de P-11), que le relecteur ne sait pas vérifier. Observé pendant la relecture : sur le commit fdbcb92, la CI n'a lancé que `confidentialite`, `app`, `description` et `validate`, tous verts ; la routine ne s'est pas lancée, la pull request ne touchant que des documents.

Essais : la recherche de l'audit refaite (« à confirmer », « comprise comme », « lecture de Claude », « à trancher », « estimation de Claude ») sur les fichiers `.md` et `.yaml` du dépôt, hors de `docs/audit/` et de ce changelog : chaque résultat est une ligne de « Décisions en attente », ou n'est pas une attente (une ligne datée, une légende, un travail de Claude, ou la règle elle-même). Les renvois vers des sections de `docs/etat-des-travaux.md` qui n'existent plus (« À côté de la file », « Décisions de Julien du 15 novembre 2026 ») sont corrigés, d'après `grep` ; les mentions restantes sont dans des pages datées. `python3 scripts/changelog.py check --base origin/main` et `python3 scripts/check_public.py --commits all` : réussis.

## [0.3.64] - 2026-11-18

Sujet 4 du plan de corrections de l'audit (`docs/audit/README.md`) : la routine de test, les contrôles qui disent vert à tort. Constats, confirmés par leur contre-vérification : INT-05 et INT-06, et les deux phrases d'INT-13 (`docs/audit/interface.md`) ; s'y ajoute la ligne que garde la réfutation de CHX-08 (`docs/audit/choix-et-outils.md`) : le message « Playwright est introuvable » nomme la version à installer. Les corrections sont celles que retiennent les contre-vérifications, complétées après la relecture de la version (« Relecture ») ; un écart, dit plus bas : la ligne de diagnostic est relue deux fois en fin de parcours, avant et après le rechargement du défi SIT-06. Le simulateur ne change pas : cette version touche la routine (`scripts/test_app.cjs`), une phrase de `CLAUDE.md` et des documents. Choix de Claude : `docs/propositions.md`, section 5, « Routine de test ». Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- Les gestes au toucher : la routine ne joue toujours aucun toucher. Seules les deux phrases qui disaient le contraire sont corrigées ; les touchers sont à faire avec la refonte de la routine (ARC-05), comme le retient la contre-vérification d'INT-13. Les essais au doigt restent faits hors de la routine.
- D'autres pages disent que des tests émulent le toucher ; elles ne sont pas corrigées (choix 8). `docs/audit/synthese/lot-donnees.md` (l. 83) et `docs/audit/synthese/lot-projet.md` (l. 76) recopient la règle de `CLAUDE.md` d'avant : ce sont des documents datés de l'audit, et le plan qui les résume dit déjà « aucun toucher ». `CHANGELOG.md` (section 0.3.62) et `docs/audit/code.md` (l. 435) parlent d'essais faits hors de la routine, qui jouaient des touchers : ces deux phrases sont justes. La phrase de `docs/tests-a-faire-faire.md` qui disait l'inverse, que les tests de Claude tournent tous « avec les gestes d'une souris », est corrigée après la relecture (constat D-4).
- La seconde ligne que garde la réfutation de CHX-08 (`docs/pile-technique.md` : Node.js et Playwright suivent l'environnement de Claude) : elle va au Sujet 44, d'après le plan.
- Rien n'est essayé sur un vrai téléphone, ni avec un processeur graphique, ni dans Safari : ces tests n'émulent ni le processeur graphique ni le moteur de Safari, et la routine ne joue aucun toucher. Les profils android et webgl1 de la routine sont laissés à la CI.
- Aucun test n'est ajouté à `docs/tests-a-faire-faire.md` : le simulateur ne change pas.

Relecture : la mise en œuvre a été relue par deux agents, l'un pour le code et la routine, l'autre pour les documents. Ils ont rendu 17 constats : 5 pour le code et la routine (C-1 à C-5), 12 pour les documents (D-1 à D-12) ; le relecteur du code n'a trouvé aucune faute de fonctionnement, et a refait sur ses propres copies du site les deux preuves de la version : des erreurs injectées dans l'application font échouer la routine (profil iphone, 2 échecs, code de sortie 1), un réglage de départ en AF-C fait échouer le contrôle de la mise au point par défaut (1 échec, code de sortie 1). Un agent de corrections les a repris en cherchant d'abord à les réfuter, par la lecture du code et des documents et avec ses propres scripts (« Essais »). Verdicts : 16 confirmés, 1 confirmé en partie (C-2), aucun réfuté ni non établi. C-2 : la phrase de `CLAUDE.md` (« Ces tests émulent l'écran et le navigateur, pas le processeur graphique ni Safari ») ne se contredit qu'à une lecture, celle où le navigateur de l'iPhone est Safari ; lue comme l'identification du navigateur opposée à son moteur, elle se tient ; mais elle dit plus que ce que font les profils, qui ne changent de Chromium que l'identification, la taille et la densité de l'écran, et y déclarent un écran tactile et un appareil mobile (`hasTouch`, `isMobile`) ; et elle ne dit pas la même chose que l'en-tête de la routine, écrit dans la même version. Corrigés dans cette version, dans le code (commit 91f09b2) : C-1, la version de Playwright lue sous ses trois écritures YAML et, quand elle n'est pas lue, plus de commande avec « X.Y.Z », que npm lit comme une étiquette (« Corrigé » ; choix 9 révisé) ; C-5, les erreurs écoutées sur le contexte du profil, qui entend aussi une fenêtre ouverte à part, ce que la routine ne fait pas aujourd'hui (« Corrigé » ; choix 11) ; C-3, l'en-tête, qui décrit les 13 contrôles qu'il ne décrivait pas, défaut antérieur à cette version (« Modifié » ; choix 12) ; C-4, une phrase de l'en-tête sur le mot « toucher » (choix 13) ; C-2, la phrase de `CLAUDE.md` (choix 6 révisé). Dans les documents : D-1 à D-3, D-8 et D-9 dans `docs/etat-des-travaux.md` (les comptes de contrôles dits dans un seul sens, les essais de la routine d'avant dits comme ils ont été faits, la relecture et le sujet suivant, les choix à confirmer, le refus du push forcé et celui de la suppression d'une branche) ; D-4 dans `docs/tests-a-faire-faire.md` ; D-5 à D-7 et D-12 dans `docs/propositions.md` (choix 1, 4, 5 et 8 révisés) ; D-6, D-11 et D-12 ici ; D-10 dans la note du plan. Non vérifié par les corrections : la routine entière après elles sur les profils ordinateur, android et webgl1, laissés à la CI ; les commandes du message de Playwright, qui changeraient la machine (et dont les navigateurs ne se téléchargent pas depuis la session) ; une fenêtre ouverte par l'application elle-même : la routine n'en ouvre aucune, et seule une fenêtre ouverte par l'essai (`window.open`) est essayée.

Contrôle final, le 19 novembre 2026, par un agent qui n'a rien écrit de la version : le code est juste dans le périmètre du sujet. Preuve rejouée avec son propre script, sur une copie raccourcie de la routine hors du dépôt (pages, chargement, mise au point de départ, vue de dessus et fin du parcours ; profil ordinateur, sans `--photo`) : sans injection, 17 lignes « ok », 0 échec, code de sortie 0 ; erreur levée par un écouteur ajouté à `#af-close`, déclenchée par le clic de la routine elle-même : 2 échecs (« aucun problème affiché à la fin du parcours » et « aucune erreur de la page ni de la console »), code 1 ; même injection sur la routine de la version 0.3.63 : « erreurs de la console (1) », 0 échec, code 0 ; promesse rejetée sans traitement : 2 échecs, code 1. CI du commit ebfadc7 lue : les quatre jobs de la routine verts, journaux de 549 lignes, 71 lignes « ok » et 0 échec chacun ; `confidentialite` : 425 commits contrôlés, 0 problème ; gitleaks : 354 commits, aucune fuite. Il a laissé trois points dans les documents, que la session a confirmés et corrigés elle-même, sans nouveau tour : F-1, deux phrases (le verdict de C-2, plus haut, et le choix 6 de `docs/propositions.md`) disaient que les profils mobiles ne changent de Chromium que l'identification, la taille et la densité de l'écran, alors qu'ils y déclarent aussi un écran tactile et un appareil mobile (mesuré par le contrôle final avec le profil iPhone 14 : `maxTouchPoints` à 1, `ontouchstart` présent, `(pointer: coarse)` et `(hover: none)` vrais ; avec le profil ordinateur : 0, absent, faux, faux) ; F-2, « Corrigé » disait que la ligne de diagnostic n'était lue qu'au chargement, alors que le bloc `catch` de la routine d'avant la relisait pour le détail d'un arrêt sur une exception ; F-3, le titre du point en tête de `docs/etat-des-travaux.md`, resté au 18 novembre. Un quatrième, la description de la pull request, encore celle du premier commit (F-4), est réécrite avant la fusion. Il a tranché le point de `context.close()` relevé pendant les corrections (« Essais ») : un navigateur tué juste avant `context.close()` fait sortir la routine sur une exception non rattrapée, avec le code 1, sans écrire les contrôles du profil ; tué plus tôt, la routine écrit « ÉCHEC déroulement du test » et le contrôle des erreurs, et sort avec 1. La CI serait donc rouge, pas verte à tort : hors du sujet, à reprendre avec la refonte de la routine (ARC-05).

Essais, dans Chromium sans écran, en rendu logiciel (Playwright 1.63.0, mêmes options de lancement que la routine), sur le site construit ; copies et scripts écrits pour cette version, hors du dépôt, un seul navigateur à la fois.

- Écouteurs de la routine du commit 1eae091 (posés sur la page ; sur le contexte depuis la relecture, plus bas), recopiés tels quels dans un script d'essai, sur une page servie en local qui demande une image absente, lève une erreur, lève une chaîne, rejette une promesse sans la traiter, écrit un `console.error` puis un `console.warn`. Relevés : « console : Failed to load resource: the server responded with a status of 404 (Not Found) (/absent.png) », « page : erreur levée », « page : chaîne levée », « page : promesse rejetée », « console : console.error seul (/) » ; l'avertissement ne l'est pas.
- Copie raccourcie de la routine, faite par un script à partir de `scripts/test_app.cjs` de cette version, profil ordinateur, sans `--photo`. Gardés : les pages (accueil, fiches, activité LUM-02), le chargement du simulateur et ses contrôles, le contrôle de la mise au point par défaut, ceux du rendu, du cadre, du viseur, de l'indicateur d'équilibre et de l'exposition par défaut, la vue de dessus jusqu'au retour en AF-S et point sélectif, la section de la mise au point jusqu'au contrôle « retour à AF-S et point sélectif », puis la fin du profil (diagnostic lu, rechargement pour le défi SIT-06 et ses deux contrôles, seconde lecture, contrôle des erreurs) ; coupé : tout le reste du scénario. Elle compte 22 contrôles de profil. Une injection, choisie au lancement, se fait juste après le contrôle « chargement », avant la première lecture du diagnostic ; dans une variante, juste après cette lecture. Site construit de cette branche avant l'ajout de cette section, sauf mention (il affiche donc « 0.3.63 » ; l'application est celle de la version 0.3.63, que cette version ne change pas) :
  - sans injection : 23 lignes « ok » (les 22 du profil et celle des liens des pages), 0 échec, code de sortie 0, en 70 s ; au chargement, « AF-S · Point · 26,7 m » ; « retour à AF-S et point sélectif : AF-S · Point · 6,5 m » ; ligne de diagnostic vide avant et après le rechargement ; « aucune » erreur ;
  - erreur levée dans la page juste après le chargement (`setTimeout`, comme dans l'essai de la contre-vérification d'INT-06), avant la première lecture : 3 échecs, code de sortie 1, en 74 s : « aucun problème affiché », « aucun problème affiché à la fin du parcours » (avant le rechargement : « Erreur : Uncaught Error: erreur injectée par l'essai (apres-chargement) · Version du site : 0.3.63 » ; après : ligne vide) et « aucune erreur de la page ni de la console » (« 1 erreur(s) : page : erreur injectée par l'essai (apres-chargement) ») ;
  - même erreur, levée juste après la première lecture du diagnostic (variante ; c'est l'essai de la contre-vérification d'INT-06), site reconstruit avec cette section (« 0.3.64 ») : 2 échecs, code de sortie 1, en 72 s : « aucun problème affiché à la fin du parcours » et « aucune erreur de la page ni de la console » ; « aucun problème affiché », lu au chargement, réussit. Routine d'avant (commit db9272a, la même qu'en 0.3.63), raccourcie de même, même injection au même endroit : « erreurs de la console (1) : erreur injectée par l'essai (apres-chargement) », puis « 0 échec(s) », code de sortie 0, comme dans l'essai de la contre-vérification ;
  - `console.error` seul : 1 échec, code de sortie 1, « aucune erreur de la page ni de la console » (« console : console.error injecté par l'essai ») ; les deux lectures du diagnostic sont vides. Routine d'avant, même injection : « erreurs de la console (1) : console.error injecté par l'essai », puis « 0 échec(s) », code de sortie 0 ;
  - erreur levée, puis arrêt de la routine sur une exception (clic sur un élément absent, délai de 2 s) : 2 échecs, code de sortie 1, « déroulement du test » (son détail montre « problème affiché : « Erreur : Uncaught Error: erreur injectée par l'essai (exception) · Version du site : 0.3.63 » ») et « aucune erreur de la page ni de la console », compté après l'exception ;
  - erreur levée, attente du chargement réduite à 1 ms (retour anticipé, comme sans scène) : 3 échecs, code de sortie 1, « chargement », « aucun problème affiché » et « aucune erreur de la page ni de la console », compté malgré le retour anticipé.
- Erreur levée par l'application plus tard dans le scénario : copie du site construite hors du dépôt, où le bouton « Retour au départ » de la vue de dessus lève une erreur après avoir ramené l'appareil (une ligne `throw new Error(…)` ajoutée dans `app/src/ui/topView.ts`). Routine raccourcie : 2 échecs, code de sortie 1, en 71 s : « aucun problème affiché à la fin du parcours » (avant le rechargement : « Erreur : Uncaught Error: erreur injectée dans l'application (Retour au départ) · Version du site : 0.3.63 ») et « aucune erreur de la page ni de la console » ; « aucun problème affiché », lu au chargement, et « vue de dessus : appareil reculé de 4 m, puis ramené » réussissent. Routine d'avant (commit db9272a, la même qu'en 0.3.63), raccourcie de même, sur la même copie : « erreurs de la console (1) : erreur injectée dans l'application (Retour au départ) », puis « 0 échec(s) », code de sortie 0 : le défaut d'INT-06.
- INT-05 : copie du site construite hors du dépôt avec `focusMode = "continuous"` au départ (`app/src/ui/cameraPanel.ts`). Routine raccourcie : 1 échec, code de sortie 1, « mise au point : AF-S et point sélectif par défaut (Z 6) : AF-C · Point · 6,6 m » ; « mise au point : retour à AF-S et point sélectif : AF-S · Point · 6,6 m » réussit. Routine d'avant, raccourcie de même : 0 échec, code de sortie 0 ; son contrôle « mise au point : AF-S et point sélectif par défaut (Z 6) » lit « AF-S · Point · 6,6 m », le réglage que la routine vient de faire : le défaut d'INT-05.
- Message de Playwright : routine lancée sans `NODE_PATH`, Playwright introuvable : le message nomme la version 1.63.0, lue dans `.github/workflows/routine.yml`, et la routine sort avec le code 2. Playwright de la machine de Claude : 1.63.0 (`package.json` du paquet installé), la version de la CI.
- Routine entière, `node scripts/test_app.cjs --photo`, sur la machine de Claude, un profil à la fois, site construit à cette version (« 0.3.64 ») : profil ordinateur, 71 lignes « ok », 0 échec, code de sortie 0, en 15 minutes ; profil iphone (iPhone 14 émulé, police de la machine de Claude), 71 lignes « ok », 0 échec, code de sortie 0, en 11 minutes. Sur les deux : « mise au point : AF-S et point sélectif par défaut (Z 6) : AF-S · Point · 26,7 m », « mise au point : retour à AF-S et point sélectif : AF-S · Point · 6,5 m », ligne de diagnostic vide avant et après le rechargement, « aucune » erreur.
- CI sur le commit 1eae091 (le code de cette version et une première version de cette section) : les quatre jobs de la routine verts ; journaux lus par l'outil GitHub : 71 lignes « ok » et 0 échec dans chacun. Sur les quatre profils, « mise au point : AF-S et point sélectif par défaut (Z 6) » lit « AF-S · Point · 26,7 m » ; « mise au point : retour à AF-S et point sélectif » lit « AF-S · Point · 6,5 m » (ordinateur) ou « 6,6 m » (android, iphone, webgl1) ; « aucun problème affiché à la fin du parcours » trouve la ligne vide avant et après le rechargement ; « aucune erreur de la page ni de la console » dit « aucune ». La liste des erreurs admises reste donc vide (choix 3). `app`, `validate`, `description` et `confidentialite` verts.
- `npm run build` (dont `tsc --noEmit`) : réussi. `python3 scripts/changelog.py check --base origin/main` : réussi avec cette section. `python3 scripts/check_public.py --commits all` : 0 problème.
- Corrections de la relecture, le 19 novembre 2026 : routine corrigée (commit 91f09b2) et, pour comparer, celle du commit 0c4a403, d'avant ces corrections ; site construit du dépôt (« 0.3.64 » ; l'application de la version 0.3.63) ; scripts écrits pour ces corrections, hors du dépôt, un seul navigateur à la fois.
- C-1, message de Playwright : la routine copiée dans dix dossiers et lancée sans `NODE_PATH`, Playwright introuvable, la ligne `PLAYWRIGHT_VERSION` du workflow copié écrite de dix façons. Version lue, message qui donne la commande avec 1.63.0 et la phrase sur `--with-deps` : guillemets doubles, simples, ou aucun ; espaces en plus ; fin de ligne Windows ; commentaire à la suite. Version non lue, message qui le dit, sans commande : workflow absent ; préversion (« 1.64.0-beta-1 ») ; guillemets différents de part et d'autre ; autre nom de clé. Code de sortie 2 dans les dix cas, « X.Y.Z » dans aucun. Routine du commit 0c4a403, sur cinq de ces copies : « X.Y.Z » dans le message et dans la commande sans workflow, avec des guillemets simples, sans guillemets et avec deux espaces ; 1.63.0 avec des guillemets doubles. `npm view playwright@X.Y.Z version` : « 404 No match found for version X.Y.Z ».
- C-5, écouteurs : le bloc des écouteurs, lu tel quel dans chacune des deux routines, sur un petit site servi en local : une page qui demande une image absente, lève une erreur et une chaîne, rejette une promesse, écrit un `console.error` et un `console.warn`, avec un cadre qui lève une erreur et écrit un `console.error` ; puis une fenêtre ouverte par `window.open` (erreur levée, `console.error`, image absente) et une page ouverte par un lien `target="_blank"` (erreur levée). Écouteurs de la page (commit 0c4a403) : 7 relevés, ceux de la page et de son cadre, aucun des 4 des deux autres pages. Écouteurs du contexte (commit 91f09b2) : les 11 ; les 7 avec le même texte, l'adresse de la page en plus pour une erreur de la page (« page : erreur levée dans la page principale (/index.html) »). L'avertissement n'est relevé ni par l'un ni par l'autre.
- Copie raccourcie de la routine corrigée, faite comme plus haut (mêmes coupes, par un script écrit pour ces corrections), profil ordinateur, sans `--photo`, injection juste après le contrôle « chargement » : sans injection, 23 lignes « ok », 0 échec, code de sortie 0, en 61 s ; erreur levée dans la page : 3 échecs, les mêmes qu'avant ces corrections, code de sortie 1, en 66 s, l'erreur notée « page : erreur injectée par l'essai (apres-chargement) (/simulateur/?lang=en) » ; `console.error` seul : 1 échec, « aucune erreur de la page ni de la console », code de sortie 1, en 65 s ; erreur levée puis arrêt sur une exception : 2 échecs, « déroulement du test » et « aucune erreur de la page ni de la console », code de sortie 1, en 15 s ; erreur levée dans une fenêtre ouverte à part par `window.open` (la fiche NET-01), refermée ensuite : 1 échec, « aucune erreur de la page ni de la console » (« 1 erreur(s) : page : erreur injectée dans une fenêtre ouverte à part (/fiches/NET-01.html) »), les deux lectures du diagnostic vides, code de sortie 1, en 67 s. Routine du commit 0c4a403, raccourcie de même, même fenêtre : 0 échec, code de sortie 0, en 72 s, « aucune erreur de la page ni de la console : aucune » : le défaut de C-5.
- Routine entière après ces corrections, `node scripts/test_app.cjs --photo`, profil iphone (iPhone 14 émulé, police de la machine de Claude), machine de Claude, site construit du dépôt : 71 lignes « ok », 0 échec, code de sortie 0, en 16 minutes (942 s) ; « mise au point : AF-S et point sélectif par défaut (Z 6) : AF-S · Point · 26,7 m » ; « mise au point : retour à AF-S et point sélectif : AF-S · Point · 6,6 m » ; ligne de diagnostic vide avant et après le rechargement ; « aucune » erreur. Un premier passage a été coupé par un redémarrage de la machine de Claude, qui a arrêté le navigateur (Node.js s'est alors arrêté sur l'exception de `context.close()`, sans écrire les contrôles du profil ; dans ce cas, le code de sortie est 1, d'après un essai du contrôle final : la CI serait rouge, pas verte à tort) : il ne compte pas.
- CI sur le commit 91f09b2 (corrections du code) : les quatre jobs de la routine verts ; journaux lus par l'outil GitHub : 71 lignes « ok » et 0 échec dans chacun. Sur les quatre profils, « mise au point : AF-S et point sélectif par défaut (Z 6) » lit « AF-S · Point · 26,7 m », « aucun problème affiché à la fin du parcours » trouve la ligne vide avant et après le rechargement, et « aucune erreur de la page ni de la console », écouteurs posés sur le contexte, dit « aucune » : la liste des erreurs admises reste vide. `app`, `validate`, `description` et `confidentialite` verts.
- Après la relecture : `python3 scripts/changelog.py check --base origin/main` réussi avec cette section ; `python3 scripts/check_public.py --commits all` : 0 problème avant chaque envoi.

### Corrigé

- Routine de test (`scripts/test_app.cjs`), INT-05 : le contrôle « mise au point : AF-S et point sélectif par défaut (Z 6) » relisait un réglage que la routine venait de faire elle-même dans la fenêtre « Mise au point » : il serait resté vert avec un autre réglage de départ dans `app/src/ui/cameraPanel.ts`. Il lit maintenant l'indicateur de la mise au point (`#af-badge`) juste après le chargement, avant tout réglage de la mise au point (choix 1). Le contrôle de la fin est gardé sous le nom « mise au point : retour à AF-S et point sélectif » : il prouve que la fenêtre remet ce mode. L'en-tête de la routine annonçait « AF-C et point sélectif par défaut », le réglage par défaut du simulateur avant la version 0.3.36 : il dit AF-S, comme le code et la fiche MAP-04.
- Routine de test, INT-06 : une erreur JavaScript pendant le scénario ne faisait pas échouer la routine. Les erreurs de la page et de la console n'étaient qu'écrites à la fin du profil, leur nombre et les trois premières, sans compter dans le bilan ni dans le code de sortie, et la ligne de diagnostic n'était contrôlée qu'au chargement (le bloc `catch` ne la relisait que pour le détail d'un arrêt sur une exception). Deux contrôles s'ajoutent en fin de profil : « aucune erreur de la page ni de la console », compté comme les autres, aussi quand la scène ne se charge pas ou que la routine s'arrête sur une exception (choix 2), sans erreur admise (choix 3), son détail nommant chaque erreur distincte, avec son nombre ; et « aucun problème affiché à la fin du parcours », même critère que « aucun problème affiché » au chargement. Écart avec la correction d'INT-06 que retient le plan (le plan dit « une seconde lecture du diagnostic »), qui demande un second contrôle de la ligne « après le dernier contrôle du simulateur » : la routine recharge le simulateur pour le défi SIT-06, ce qui efface la ligne de diagnostic ; elle est donc lue juste avant ce rechargement, pour tout le parcours, puis à la fin, pour la page rechargée (choix 5). La ligne « erreurs de la console (N) : … » du bilan est retirée ; un message de la console noté garde l'adresse de sa source, ce qui nomme un fichier qui ne se charge pas ; le texte d'une erreur de la page est coupé à 200 caractères, comme l'était déjà celui d'un message de la console, et les erreurs distinctes se comptent sur ce texte coupé (choix 4). Après la relecture (constat C-5 ; choix 11) : les erreurs sont écoutées sur le contexte du profil, et non plus sur sa page, si bien qu'une fenêtre ouverte à part, par un lien `target="_blank"` ou par `window.open`, compte aussi (la routine n'en ouvre aucune aujourd'hui) ; une erreur de la page porte l'adresse de la page.
- Routine de test et `CLAUDE.md`, INT-13 : les deux phrases disaient que les tests émulent « le toucher ». Les profils mobiles déclarent un écran tactile, mais aucun geste de la routine n'est un toucher : ses clics, glissés et appuis tenus passent par la souris (aucun appel à `tap`, à `touchscreen` ni au protocole de Chromium). Les deux phrases le disent (choix 6 et 7). Après la relecture : la phrase de `CLAUDE.md` dit aussi, comme l'en-tête, que les profils n'émulent que la taille et la densité de l'écran et l'identification du navigateur, pas le moteur de Safari (constat C-2 ; choix 6 révisé) ; l'en-tête dit que, dans la liste des contrôles et dans leurs noms, « toucher » nomme le geste de l'application, que la routine fait à la souris (constat C-4 ; choix 13) ; et `docs/tests-a-faire-faire.md` ne prête plus à tous les tests de Claude « les gestes d'une souris » (constat D-4 ; choix 8 révisé).
- Routine de test, CHX-08 : le message « Playwright est introuvable » conseillait `npm install -g playwright`, qui installe la dernière version, pas celle de la CI, et que Node.js ne trouve pas seul. Il nomme la version de la CI, lue dans `.github/workflows/routine.yml` (1.63.0, celle de la machine de Claude), et dit de passer son dossier par `NODE_PATH`, comme la CI (choix 9). Après la relecture (constat C-1 ; choix 9 révisé) : la ligne est lue sous ses trois écritures YAML (guillemets doubles, simples, ou aucun) ; si la version n'est pas lue (workflow absent, autre écriture), le message le dit et ne donne aucune commande, au lieu d'écrire `npm install -g playwright@X.Y.Z`, qui échoue ; il dit aussi que la CI passe `--with-deps` à `playwright install`. Ce message et celui du site construit introuvable tutoient (choix 10).

### Modifié

- Routine de test : l'en-tête, qui liste les contrôles, dit les trois contrôles ajoutés et le contrôle renommé. Après la relecture, il décrit aussi les 13 contrôles qu'il ne décrivait pas, avec `--photo` (9 sans), défaut antérieur à cette version : l'exposition par défaut et les modes A, S et M, la vue de dessus, la légende de la photo et le bulletin, les défis SIT-05 et SIT-01, les collimateurs ; et, pour la grille de cadrage, le retour à « Aucune », qu'il ne disait qu'à demi (constat C-3 ; choix 12). Avec `--photo`, un profil compte 70 contrôles au lieu de 67 ; un job de la CI, qui joue un profil, écrit donc 71 lignes « ok » au lieu de 68, avec le contrôle des liens des pages, fait une fois pour tous les profils. Les « 68 contrôles par profil » de la section 0.3.63 sont ces 68 lignes.
- `CLAUDE.md`, section « Dépôt » : « Ces tests émulent la taille et la densité de l'écran et l'identification du navigateur, pas le processeur graphique ni le moteur de Safari ; les profils mobiles déclarent un écran tactile, mais aucun geste de la routine n'est un toucher : le dire dans la pull request, avec les résultats. » Changement accepté par Julien le 15 novembre 2026 (D6) ; la rédaction est de Claude, que Julien confirme ou corrige (choix 6, révisé après la relecture : la première rédaction disait « Ces tests émulent l'écran et le navigateur, pas le processeur graphique ni Safari »).
- Documents : `docs/propositions.md` (section 5, « Routine de test », choix 1 à 10 ; après la relecture, choix 1, 4, 5, 6, 8 et 9 révisés, choix 11 à 13 ajoutés) ; `docs/etat-des-travaux.md` (Sujet 4 écrit, puis relu, et le sujet suivant ; un point de « À côté de la file » sur les deux contrôles de la fin du profil ; après la relecture, « Comment reprendre » et « Ce qui attend Julien ») ; `docs/tests-a-faire-faire.md` (après la relecture, la phrase sur les gestes des tests de Claude) ; `docs/audit/README.md` (une note datée sous le Sujet 4, sans réécrire le reste).

## [0.3.63] - 2026-11-18

Sujet 3 du plan de corrections de l'audit (`docs/audit/README.md`) : pendant le calcul d'une photo, la caméra, le toucher du viseur et l'indicateur d'équilibre. Constats, tous confirmés par leur contre-vérification : COD-01 et COD-07 (`docs/audit/code.md`), ARC-14 (`docs/audit/architecture-application.md`). Les corrections sont celles que retiennent leurs contre-vérifications, complétées après la relecture de la version (« Relecture ») ; s'y ajoutent deux contrôles de routine, que le plan ne demandait pas, le second après la relecture. Choix de Claude : `docs/propositions.md`, section 5, « Pendant le calcul d'une photo ». Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- Le relevé du bulletin de la première vue : avant chaque vue, `shootSeries` rend une image du viseur, commandes de la caméra encore attachées ; la contre-vérification de COD-01 note que le bulletin peut être relevé avec l'orientation d'une image plus tard que la photo, « sans gravité ». Le plan ne le demande pas ; non mesuré (choix 4).
- Les deux contrôles de routine ajoutés ne voient pas la surimpression dans la photo elle-même, seulement le viseur à la reprise, puis après la rafale ; et la routine ne joue aucun toucher (INT-13, Sujet 4) : les essais au doigt sont faits hors de la routine.
- Rattachée, la commande tactile de la caméra ne remet plus en place son propre écouteur de la perte du focus du canevas, qui annulait l'écart du doigt (lu dans `Cameras/Inputs/freeCameraTouchInput.js` de Babylon.js 9.35.0 : l'écouteur n'est créé qu'au premier rattachement, et le détachement l'efface). Le canevas qui perd le focus arrête pourtant toujours la rotation d'un doigt posé : le système d'entrée de Babylon.js écoute aussi la perte du focus sur le canevas et relâche les doigts posés (`DeviceInput/webDeviceInputSystem.js`). Mesuré dans Chromium seul, sur le Pixel 7 émulé, site corrigé (relecture, remarque du relecteur du code, mesure refaite pendant les corrections) : doigt posé et écarté de 80 px, puis `blur()` du canevas, la rotation s'arrête (écart de 0 rad en 2 s), avant toute photo comme après une photo. Dans Safari : je ne sais pas.
- Le contrôle `confidentialite` de la CI reste rouge tant que la branche `sujet-3-pendant-le-calcul` existe sur GitHub : son seul commit, 0247095, a une adresse d'auteur refusée, et ce contrôle lit toutes les branches. La session n'a pas pu la supprimer (faits relevés par la session) : le 17 novembre 2026 vers 9 h 35 UTC, son mode de permission a refusé le push forcé, puis la suppression de la branche ; le 18 novembre, Julien l'a autorisée à la supprimer (réponse à une question à choix posée dans la session vers 15 h 50 UTC), et `git push origin --delete sujet-3-pendant-le-calcul` a été refusé deux fois par le proxy git de la session (HTTP 403, à 15 h 50 et 15 h 51 UTC). Elle est donc à supprimer par Julien sur GitHub : page de la pull request 69, bouton « Delete branch », ou page « Branches » du dépôt (`docs/etat-des-travaux.md`, « Ce qui attend Julien ») ; la fusion l'attend.
- Relevé par la relecture, hors des constats de l'audit, antérieur à cette version, non corrigé : sur un téléphone, pendant le calcul, la bande « Calcul de la photo… » couvre le bas de l'indicateur de mise au point et le bas d'un repère posé près du bas du cadre. Mesuré sur le Pixel 7 émulé, sur le site de cette version et sur celui de la version 0.3.62 : 13 des 21 px de haut de l'indicateur, et 12 des 26 px d'un repère posé à 85 % du cadre, sous une bande au fond opaque. C'est la mise en page du simulateur sur téléphone, hors de ce sujet ; suivi dans `docs/etat-des-travaux.md`, et le test T7 dit où regarder.
- Rien n'est essayé sur un vrai téléphone, ni avec un processeur graphique, ni dans Safari. COD-01 et COD-07 sont à essayer par Julien sur son téléphone (décision D37 en attente ; test T7). Les profils android et webgl1 de la routine sont laissés à la CI.

Relecture : la mise en œuvre a été relue par deux agents, l'un pour le code et la routine, l'autre pour les documents. Ils ont rendu 13 constats : 3 pour le code et la routine (C-1 à C-3), 10 pour les documents (D-1 à D-10), et une remarque. Un agent de corrections les a repris en cherchant d'abord à les réfuter, par la lecture du code et avec ses propres scripts (« Essais »). Verdicts : 12 confirmés, 1 confirmé en partie (C-2), aucun réfuté ni non établi. C-2 : le contrôle de routine ajouté par cette version réussit bien quand les commandes de la caméra ne sont jamais rattachées après un calcul ; mais il est faux qu'aucune ligne de la routine ne le voie : sur une copie sans le rattachement, la routine entière (profil iphone) échoue aussi à « AF-C : la distance suit la zone », sans en nommer la cause, le relevé de l'appareil qui prépare ce contrôle venant après les premières photos de la routine. Corrigés dans cette version : C-1, la ligne de la vitesse de l'indicateur d'équilibre qui pouvait contredire son triangle pendant un calcul (« Corrigé » ; `docs/propositions.md`, section 5, « Pendant le calcul d'une photo », choix 2 révisé et choix 7) ; C-3, un toucher du viseur commencé pendant le calcul et fini juste après, qui était pris (« Corrigé » ; choix 8) ; C-2, par un second contrôle, après la rafale, qui nomme la cause (« Ajouté » ; choix 9) ; D-1 à D-5 et D-10 dans le test T7, réécrit (choix 6 révisé) : les gestes de COD-01 laissaient l'appareil tourné avant le toucher du viseur, un toucher arrivé sur l'écran de revue ouvrait la loupe et faisait passer le test sans rien essayer, la bande de progression cache le bas du viseur pendant le calcul, le flou de mise au point passait pour un défaut, Sophia bouge d'elle-même, ce qui a été essayé au doigt n'était pas dit, et le doigt donne plutôt un filé que des copies ; D-6, D-8 et D-10 dans `docs/etat-des-travaux.md` (0247095 n'est pas le premier commit de la pull request 70 : il n'est pas dans sa branche, et diffère de 3738475 par trois lignes et par son message, pas seulement par le nom de la branche comme le proposait la relecture) ; D-7 ici et dans `docs/etat-des-travaux.md`, D-9 ici. La remarque tient : la perte du focus du canevas arrête toujours la rotation d'un doigt posé, mesuré dans Chromium seul (« Ce qui n'est pas fait »). Non corrigé : le recouvrement relevé par D-3, la bande « Calcul de la photo… » qui couvre, sur téléphone, le bas de l'indicateur de mise au point et du repère ; il est antérieur à cette version (mesuré sur la version 0.3.62) et relève de la mise en page du téléphone, hors de ce sujet : il est suivi dans `docs/etat-des-travaux.md`, et T7 dit où regarder. Non vérifié par les corrections : les chiffres de D-1 (orientation laissée par les gestes, distances des personnages), lus dans les journaux du relecteur des documents ; le test T7 réécrit, que personne n'a joué en entier ; les faits de D-7, relevés par la session.

Essais, dans Chromium sans écran, en rendu logiciel (Playwright 1.63.0, mêmes options de lancement que la routine), sur le site construit ; scripts écrits pour cette version, hors du dépôt. Sites témoins construits hors du dépôt : le site d'avant (commit 3738475, même application que la version 0.3.62) et le site corrigé (commit 0952af2) ; pour lire l'orientation de la caméra à chaque rendu, chacun aussi dans une copie qui expose la caméra et la scène à la page (une ligne de plus dans `app/src/main.ts`). « Rendus » compte les rendus du calcul : la carte de profondeur, puis ceux de la pose.

- COD-01, souris, écran de 1280 × 800, conditions de l'audit : 200 mm, f/1,4, 1/100 s ; deux photos de suite, un témoin, puis une photo pendant le calcul de laquelle la souris est enfoncée sur le viseur et déplacée par pas de 4 px, 100 ms après la réception du pas précédent, jusqu'à l'ouverture de l'écran de revue. Site d'avant : témoin, 90 rendus, `rotation.y` à 0 à chacun ; photo glissée (6 pas en 44 s), 98 rendus, `rotation.y` en cinq paliers, 0,01 rad aux 17 premiers, puis 0,02, 0,03, 0,04 et 0,05 au dernier : la photo montre plusieurs copies décalées des personnages (vu à l'œil) ; à la reprise, le viseur a tourné de 0,01 rad. Au 200 mm, le champ horizontal est de 2 × atan(17,95 / 200) = 0,18 rad : 0,04 rad décalent l'image de 22 % de sa largeur. Site corrigé : témoin, 126 rendus ; photo glissée (8 pas en 45 s), 110 rendus, `rotation.y` à 0 aux 110 ; photo nette, fond flou comme sur le témoin (vu à l'œil) ; à la reprise, écart de 0.
- COD-01, doigt, Pixel 7 émulé, réglages de départ (50 mm, f/8) : un doigt posé au centre du viseur, glissé de 80 px puis immobile ; un second doigt posé sur « Déclencher », puis relevé seul (`Input.dispatchTouchEvent`). Site d'avant : 17 rendus, `rotation.y` de 0,03054 à 0,06046 rad, une valeur différente à chaque rendu ; doigt toujours posé après le calcul, le viseur tourne encore (0,04708 rad à 0,5 s, 0,05529 à 2 s). Site corrigé : 17 rendus, `rotation.y` à 0,02603 rad à chacun ; doigt toujours posé, 0,02603 à 0,5 s et à 2 s ; doigt relevé, 0,02603 ; reposé et glissé de 80 px, le viseur tourne de nouveau (0,02491 rad).
- COD-07, écran de 1280 × 800, réglages de départ (AF-S, point sélectif) : toucher en bas du cadre, déclencher, puis, pendant le calcul, toucher en haut du cadre (appui et relâchement envoyés ensemble par le protocole de Chromium, reçus par le viseur pendant le calcul, à 0 ms d'écart sur le site d'avant et à 1 ms sur le site corrigé). Site d'avant : « AF-S · Point · verrouillée à 7,1 m », repère à 85 % en classe `locked` ; pendant le calcul, repère à 20 %, toujours `locked` et « verrouillée à 7,1 m » ; de même 3 s après la fin du calcul ; le même toucher hors calcul : « verrouillée à 500,0 m », repère à 20 %. Site corrigé : pendant le calcul et 3 s après, repère à 85 % et « verrouillée à 7,1 m » ; le même toucher hors calcul : « verrouillée à 500,0 m », repère à 20 %.
- ARC-14, écran de 1280 × 800, réglages de départ, trois photos de suite ; chaque appel à `gl.readPixels` est noté dans la page avec l'erreur WebGL qui le suit, et chaque changement de la ligne du bruit ou du point de l'indicateur au moment où il a lieu. Site d'avant, à chacune des trois photos : pendant le calcul, deux lectures de 5 × 5 pixels par l'indicateur, l'une sur le canevas, l'autre sur une texture de la photo, refusée (erreur 1282 ; dans la console, l'avertissement « GL_INVALID_OPERATION: glReadPixelsRobustANGLE: Invalid format and type combination. ») ; la ligne passe à « ISO 100 · bruit insuffisant (signal/bruit 0:1) » et le point à (85,0 ; 81,7) en classe `bad`, de 8,1 à 9,7 s après le clic jusqu'à la fin du calcul (de 21,4 à 23,4 s après le clic) ; lecture reprise ensuite (1 ou 2 lectures, sans erreur, dans les 1,5 s qui suivent l'ouverture de l'écran de revue). Site corrigé : aucune lecture de 5 × 5 pixels pendant le calcul, aucun avertissement WebGL, aucun changement de la ligne ni du point pendant le calcul ; lecture reprise ensuite (1 lecture, sans erreur, dans les 1,5 s).
- ARC-14, second cas de la contre-vérification, écran de 1280 × 800 : une seconde photo déclenchée dans la même tâche que l'affichage de l'écran de revue de la première (observateur de mutations, clic sans pointeur). Site d'avant : bulletin de la seconde photo « Bruit au point visé, lu dans le viseur au déclenchement : insuffisant (signal/bruit 0:1) », celui de la première « excellent (signal/bruit 103:1) » ; deux avertissements WebGL dans la console. Site corrigé : « excellent (signal/bruit 154:1) » pour les deux ; rien dans la console.
- Reprise du viseur après le calcul, site corrigé, écran de 1280 × 800, 50 mm : écart de `rotation.y` pour un glissé de 120 px à la souris, 0,118 rad avant toute photo ; 0,144 après une photo et la loupe de l'écran de revue ; 0,103 après une rafale de deux vues en Continu L, pendant le calcul de laquelle la souris est enfoncée et déplacée sur le viseur (8 événements reçus par le canevas pendant le calcul ; `rotation.y` à 0,26264 rad aux 34 rendus et à la reprise) ; 0,099 après un calcul en échec, provoqué par une erreur levée une fois dans la copie qui expose la scène (écran de revue : « La photo n'a pas pu être calculée. (échec provoqué par l'essai) »). Au doigt, après le calcul : ligne « COD-01, doigt », plus haut. Les écarts varient d'un glissé à l'autre avec la durée des images (inertie de la caméra, `docs/etat-des-travaux.md`, « À côté de la file »).
- Code relu : `takePhoto` n'est appelé que par `Shutter.compute` (photo, vues d'une rafale, loupe) ; dans l'application, rien n'observe la mise à jour de la caméra ; sur les photos à f/1,4 du site corrigé, le fond est flou comme sur celles du site d'avant (vu à l'œil) : le déplacement de l'œil sur l'ouverture se fait toujours, la position de la caméra étant posée avant chaque rendu.
- Routine `node scripts/test_app.cjs --photo`, sur la machine de Claude, un profil à la fois (les deux premiers passages pendant que tournaient aussi les essais ci-dessus ; les chiffres d'ARC-14 cités plus haut viennent de la seconde chaîne d'essais, qui a tourné pendant le deuxième passage). Site corrigé (construit au commit 0952af2), profil ordinateur : 67 lignes « ok », 0 échec, en 28 minutes ; nouveau contrôle : pointeur enfoncé sur le viseur pendant le calcul, déplacé de 4 px pendant le calcul et de 40 px l'écran de revue ouvert, orientation de l'appareil à 0,00000 rad avant comme après. Site d'avant (commit 3738475), même routine, profil ordinateur : 66 lignes « ok », 1 échec, le nouveau contrôle (déplacé de 6 px pendant le calcul et de 40 px l'écran de revue ouvert ; orientation à 0,00000 rad avant, −0,04741 rad après), en 20 minutes. Site corrigé, profil iphone (iPhone 14 émulé, police de la machine de Claude ; la vue de dessus est dépliée le temps du contrôle) : 67 lignes « ok », 0 échec, en 12 minutes ; nouveau contrôle : 4 px pendant le calcul, 40 px l'écran de revue ouvert, écart de 0. Site d'avant, profil iphone : 66 lignes « ok », 1 échec, le nouveau contrôle (6 px pendant le calcul, 40 px l'écran de revue ouvert ; orientation à 0,00000 rad avant, −0,06464 rad après), en 13 minutes.
- CI sur le commit 55bba6f (le contrôle de routine et une première version de cette section) : les quatre jobs de la routine verts ; journal du profil iphone lu : 0 échec, nouveau contrôle réussi (4 px pendant le calcul, 40 px l'écran de revue ouvert, écart de 0) ; `app`, `validate` et `description` verts ; `confidentialite` rouge, pour le seul commit 0247095 (journal lu : 411 commits contrôlés, 1 problème).
- `npm run build` (dont `tsc --noEmit`) : réussi. `python3 scripts/changelog.py check --base origin/main` : réussi avec cette section. `python3 scripts/check_public.py --commits all` : un seul problème, l'adresse d'auteur du commit 0247095 de la branche `sujet-3-pendant-le-calcul` (« Ce qui n'est pas fait »).
- Corrections de la relecture, le 18 novembre 2026, sur le site du code corrigé (commit c8f0c45) et sur celui d'avant ces corrections (commit 162e772), chacun dans une copie qui expose la caméra et la scène à la page, comme plus haut ; scripts écrits pour ces corrections, hors du dépôt, un seul navigateur à côté de la routine.
- C-1, écran de 1280 × 800 : horloge figée, AF-S verrouillé sur le promeneur (12,2 à 12,3 m), 1/250 s ; boucle de rendu arrêtée, pour que la lecture de l'indicateur attende une image (une seconde au plus) ; vitesse passée à 1/100 s juste après un rafraîchissement complet, et photo déclenchée 350 ms plus tard, pendant l'attente du rafraîchissement suivant. Site d'avant : pendant tout le calcul, « 1/100 s · promeneur : traînée de 1,7 fois la limite (2,1 px sur la photo) », avec le sommet de la vitesse et le point (60,0 ; 67,3) en classe `ok`, et la ligne du bruit encore à « ISO 250 », du réglage d'avant ; après le calcul, sommet et point en classe `bad`. Site corrigé : pendant le calcul, « 1/250 s · promeneur : net », « ISO 250 », sommet et point en classe `ok`, l'état d'avant le changement de vitesse ; après, « 1/100 s · promeneur : traînée de 1,7 fois la limite », « ISO 100 », sommet et point en classe `bad`, ensemble. La boucle arrêtée met la ligne du bruit à « bruit non mesuré » avant le déclenchement, sur les deux sites. Le déclenchement du relecteur (au moment où la ligne de la vitesse change) donne le même décalage sur le site d'avant ; sur le site corrigé, la ligne ne change qu'avec le triangle. Le scénario du relecteur lui-même (photo déclenchée quand l'indicateur demande l'image suivante), rejoué sur le site corrigé avec son script : « 1/250 s · promeneur : net », sommet et point en classe `ok` pendant le calcul ; « 1/100 s · … traînée de 1,7 fois la limite », sommet et point en classe `bad` après.
- C-3 et COD-07, Pixel 7 émulé, réglages de départ (AF-S, point sélectif, 50 mm), touchers envoyés par le protocole de Chromium (`Input.dispatchTouchEvent`), appui et relâchement horodatés à 60 ms d'écart : toucher du bas du cadre (92 %), « AF-S · Point · verrouillée à 4,4 m », repère à 92 % ; toucher du haut (20 %) entier pendant un calcul, reçu par le canevas pendant le calcul : rien ne change, sur les deux sites ; doigt posé sur le haut du cadre pendant le calcul d'une autre photo (pendant l'encodage de l'image) et levé à l'ouverture de l'écran de revue, 169 ms plus tard sur le site d'avant et 177 ms sur le site corrigé, le relâchement revenant au canevas sous l'écran de revue : site d'avant, « verrouillée à 500,0 m », repère à 20 % ; site corrigé, « verrouillée à 4,4 m », repère à 92 %. Sur les deux sites, ce relâchement a aussi ouvert la loupe (légende « Loupe 100 % · 16 rendus »). Site corrigé, toucher du haut hors calcul ensuite : « verrouillée à 500,0 m », repère à 20 %. Le scénario du relecteur (événements de pointeur créés par la page, sur un écran de 1280 × 800 : appui pendant le calcul, relâchement 12 ms plus tard, l'écran de revue ouvert), rejoué sur le site corrigé avec son script : « verrouillée à 6,1 m » et repère à 92 %, inchangés.
- Non-régression, site corrigé, écran de 1280 × 800, réglages de départ : souris enfoncée sur le viseur pendant le calcul et déplacée ; 17 rendus, `rotation.y` à 0 à chacun et à la reprise ; un glissé de 120 px ensuite la porte à 0,10635 rad ; aucune lecture de 5 × 5 pixels pendant le calcul (12 dans les secondes qui suivent), aucun avertissement WebGL ; bulletin « excellent (signal/bruit 104:1) ».
- Perte du focus du canevas, au doigt, Pixel 7 émulé, site corrigé : doigt posé, écarté de 80 px et tenu, la rotation continue (de 0,01963 à 0,02406 rad en 1 s avant toute photo, de 0,04287 à 0,04714 après une photo) ; `blur()` du canevas, puis 2 s : écart de 0 rad, avant comme après la photo ; écouteur propre de la commande tactile présent avant la photo, absent après.
- Bande « Calcul de la photo… » (D-3), Pixel 7 émulé, sur le site de la version 0.3.62 (commit 3738475, même application) : repère posé à 85 % du cadre (« verrouillée à 5,2 m »), puis, pendant le calcul, bande en (46, 476), 320 × 49 px, fond opaque, au-dessus du viseur (`z-index` 2) ; indicateur de mise au point en (93, 512), 226 × 21 px, couvert sur 13 px ; repère en (193, 462), 26 × 26 px, couvert sur 12 px. Mêmes boîtes relevées par le relecteur des documents sur le site de cette version.
- Test T7 réécrit, geste (2), Pixel 7 émulé, site corrigé : page chargée, focale amenée à 200 mm par cinq touchers de « + » ; Sophia est à 25 % de la largeur du cadre, Dennis à −78 %, Fabienne et Percy à 146 % : Sophia est le seul personnage du cadre. Les gestes (1) sont ceux de l'essai de C-3 et COD-07, plus haut ; le test réécrit n'a pas été joué en entier.
- Routine après les corrections, sur la machine de Claude, un profil à la fois (le premier passage pendant que tournaient les essais ci-dessus). Site corrigé (code du commit c8f0c45, routine du commit cd4c867), profil iphone : 68 lignes « ok », 0 échec, en 18 minutes ; nouveau contrôle : 0,15293 rad pour le glissé de 120 px ; contrôle de COD-01 : 6 px pendant le calcul, 40 px l'écran de revue ouvert, écart de 0. Site corrigé, profil ordinateur : 68 lignes « ok », 0 échec, en 19 minutes ; nouveau contrôle : 0,08285 rad (l'orientation est relevée dès que l'écart dépasse 0,01 rad, la caméra pouvant tourner encore) ; contrôle de COD-01 : 4 px pendant le calcul, 40 px l'écran de revue ouvert, écart de 0. Copie sans le rattachement des commandes à la fin du calcul (une ligne de moins dans `Shutter.compute`), profil iphone : 66 lignes « ok », 2 échecs, en 14 minutes : le nouveau contrôle (0 rad) et « AF-C : la distance suit la zone » (« AF-C · Zone L · 5,8 m ; avant : AF-S · Zone L · verrouillée à 5,8 m ») ; le contrôle de COD-01 y réussit (écart de 0).
- CI sur le commit cd4c867 (corrections du code et contrôle ajouté) : les quatre jobs de la routine verts ; journal du profil android lu : 0 échec, nouveau contrôle réussi (0,10300 rad) ; `app`, `validate` et `description` verts ; `confidentialite` rouge, pour le seul commit 0247095.

### Corrigé

- Caméra pendant le calcul d'une photo (COD-01), `app/src/camera/photo.ts` et `app/src/ui/shutter.ts` : glisser sur le viseur pendant le calcul, ou y garder un doigt posé à l'écart de son point d'appui, faisait tourner l'appareil d'un rendu à l'autre de la photo, qui devenait une surimpression de vues décalées, et le viseur avait tourné à la reprise. Les rendus de la photo (carte de profondeur et rendus de la pose) se font sans mise à jour de la caméra (`scene.render(false)`), et `Shutter.compute` détache les commandes de la caméra le temps du calcul, puis les rattache en effaçant ce qu'elles avaient accumulé. Conséquence voulue par la correction : un doigt ou un bouton de souris resté enfoncé pendant le calcul ne fait plus tourner le viseur tant qu'il n'est pas relevé puis reposé.
- Toucher du viseur pendant le calcul (COD-07), `app/src/ui/shutter.ts` : en AF-S, il déplaçait le repère sans faire le point ; le repère vert montrait le point touché avec la distance d'avant, et la photo suivante était faite à cette distance. Le viseur ne prend plus les touchers pendant un calcul (`choosePoint`, le test que fait déjà la vue de dessus), ni un toucher commencé pendant le calcul et fini juste après : l'appui n'est pas retenu (relecture, constat C-3).
- Indicateur d'équilibre pendant le calcul (ARC-14), `app/src/ui/balance.ts` : il continuait de lire les pixels pendant le calcul d'une photo ; une lecture tombait sur une texture de la photo, refusée par WebGL (avertissement dans la console), et l'indicateur affichait « bruit insuffisant (signal/bruit 0:1) » jusqu'à la fin du calcul ; une photo déclenchée juste à la fin d'une autre reprenait cette valeur dans son bulletin. Il ne se rafraîchit plus pendant un calcul, et une lecture commencée avant en sort sans toucher à la dernière lecture ni à l'affichage : les lignes de la zone nette et de la vitesse sont écrites avec le triangle, après la lecture des pixels (relecture, constat C-1 ; avant cette correction, ces deux lignes étaient écrites avant la lecture, et la ligne de la vitesse pouvait contredire le triangle pendant tout le calcul). Le commentaire de la lecture dit ce qu'elle fait.

### Ajouté

- Routine de test (`scripts/test_app.cjs`), avec `--photo` : contrôle « photo : glissé sur le viseur pendant le calcul, viseur inchangé à la reprise (COD-01) », sur la photo en AF-S de la fin de la routine (choix 5) : la photo est celle que prenait déjà le contrôle « AF-S : la photo garde la distance verrouillée », et le geste se fait pendant son calcul. Ajouté par la relecture (constat C-2 ; choix 9) : contrôle « après la rafale : un glissé sur le viseur tourne l'appareil (commandes rattachées après le calcul) », un glissé de 120 px sur le viseur devant tourner l'appareil de plus de 0,01 rad, lu sur la vue de dessus ; le premier contrôle réussit aussi quand les commandes ne sont jamais rattachées après un calcul. Aucune condition de contrôle existant n'est modifiée ; l'attente de l'écran de revue du contrôle « AF-S : la photo garde la distance verrouillée » passe dans la boucle du geste, dont la photo est celle de ce contrôle ; la lecture de l'orientation, écrite pour le premier, est remontée pour servir aux deux. La routine compte 68 contrôles par profil, au lieu de 66.
- `docs/tests-a-faire-faire.md` : test T7 (toucher du viseur pendant le calcul, en AF-S ; photo et rafale prises un doigt posé sur le viseur), à faire sur un téléphone à la version 0.3.63 ; réécrit après la relecture (constats D-1 à D-5 et D-10).

### Modifié

- Documents : `docs/etat-des-travaux.md` (Sujet 3 écrit ; vingt-quatrième suspension ; la branche `sujet-3-pendant-le-calcul`, à supprimer par Julien sur GitHub ; après la relecture, le défaut de la bande « Calcul de la photo… » sur téléphone) ; `docs/propositions.md` (section 5, « Pendant le calcul d'une photo », choix 1 à 6 ; après la relecture, choix 2 et 6 révisés, choix 7 à 9 ajoutés) ; `docs/audit/README.md` (une note datée sous le Sujet 3, sans réécrire le reste).

## [0.3.62] - 2026-11-16

Sujet 2 du plan de corrections de l'audit (`docs/audit/README.md`) : trois corrections courtes du simulateur et un contrôle de routine. Constats, tous contre-vérifiés par un second agent : FEX-19 (`docs/audit/fiches-exposition.md`) et INT-21 (`docs/audit/interface.md`), même défaut ; COD-09 et COD-14 (`docs/audit/code.md`). La quatrième correction du sujet, le défilement gardé de l'écran de revue (INT-17), est faite depuis la version 0.3.59. S'y ajoute un défaut hors de l'audit, relevé pendant les essais de cette version et contre-vérifié par sa relecture : les zones écrêtées de l'écran de revue clignotaient malgré le réglage « réduire les animations » (« Corrigé »). Choix de Claude : `docs/propositions.md`, section 5, « Corrections d'une ligne ». Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- COD-09 : `user-select: none` et `-webkit-touch-callout: none`, que le constat proposait contre le menu de l'appui long, ne sont pas ajoutés. Sa contre-vérification ne les retient pas : personne n'a constaté ce menu. Ils n'ont pas été essayés, et ne peuvent pas l'être ici : Safari n'est pas émulé. Si le menu se montre sur un vrai téléphone, ils sont à ajouter (`docs/tests-a-faire-faire.md`, test T5).
- L'anneau de focus de l'indicateur d'exposition n'est pas changé : au clavier, quand l'indicateur clignote, l'anneau clignote avec le bouton, invisible une demi-seconde sur deux, le focus restant sur le bouton (relecture, constat C-3). Avant cette version, le focus lui-même était perdu. Garder l'anneau visible change l'aspect du clignotement : choix laissé à Julien (`docs/propositions.md`, section 5, « Corrections d'une ligne », choix 9).
- Le déclencheur peut changer de place pendant une rafale tenue, quand son libellé s'allonge (« Rafale : N vues ») et que la rangée de boutons passe à la ligne : relevé par un agent de réfutation sur des téléphones émulés, antérieur à cette version, retrouvé au second tour de la relecture sur une rafale tenue au doigt émulé, selon l'écran et la police (« Essais »). Non corrigé : la mise en page du panneau n'est pas l'objet de ce sujet (`docs/propositions.md`, section 5, « Corrections d'une ligne », choix 10) ; il est suivi dans `docs/etat-des-travaux.md`, et le test T5 demande de le noter.
- Aucun contrôle de routine pour le clignotement de l'indicateur ni pour la rafale au doigt : le plan n'en demande pas, et la routine ne joue aucun toucher (INT-13, Sujet 4). Le seul contrôle qui touche au clignotement est celui des zones écrêtées avec « réduire les animations » (« Ajouté »).
- La cause de l'échec non expliqué de la CI à l'entrée du mode S (INT-21) n'est pas établie : aucun essai de cette version ne la prouve.
- La durée d'un clic de Playwright sur le site d'avant la correction n'a pas été remesurée : la série a été arrêtée par la limite de temps de l'essai. Les rapports la donnent (de 4 à 45 s).
- Après la relecture, la routine n'a été passée sur la machine de Claude que sur deux profils avec les corrections (ordinateur, et iphone avec la police de la CI) et sur un seul sans elles (iphone avec la police de la CI). La réfutation du constat R-1 demandait les quatre profils, avec et sans la correction, avant de changer le point touché : les profils android et webgl1 sont laissés à la CI, qui ne passe que le site corrigé, et sans la correction le point (50 % ; 20 %) n'y est mesuré que hors de la routine, sur un écran d'ordinateur et un Pixel 7 émulé (« Essais »). Le contrôle final a complété ce point, toujours hors de la routine entière : sans la ligne de COD-14, le bloc des deux loupes de la routine échoue aussi sur les profils ordinateur, android et webgl1 ; et la CI a passé les quatre profils sur le site corrigé (« Essais »).
- Rien n'est essayé sur un vrai téléphone, ni avec un processeur graphique, ni dans Safari : les essais émulent l'écran, le toucher et le navigateur, en rendu logiciel. COD-09 est à confirmer par Julien sur son téléphone (décision D37 en attente ; test T5).

Relecture : la mise en œuvre a été relue par quatre agents, chacun sous un angle : le code et le comportement du site, la routine de test, la vérité des documents, l'interface sur des téléphones émulés. Ils ont rendu 18 constats : 3 pour le code (C-1 à C-3), 4 pour la routine (R-1 à R-4), 8 pour les documents (D-1 à D-8), 3 pour l'interface (I-1 à I-3). Des agents de réfutation, un par angle, les ont repris pour chercher à les réfuter, en refaisant les essais avec leurs propres scripts. Verdicts : 15 confirmés, 2 confirmés en partie (D-3 et I-2), 1 réfuté (D-2), aucun non établi. Deux agents de corrections se sont suivis : le premier a fait les corrections et leurs essais, et a été coupé par la limite d'usage avant ses vérifications de fin ; le second a confronté chaque constat aux deux commits du premier, relu ses journaux d'essai, reporté son dernier passage de routine et fait les vérifications de fin (« Essais »). Trois constats portent sur des défauts antérieurs à cette version, qu'elle touche ou décrit : C-1 et I-1, le même défaut vu sous deux angles, et C-3. Les 17 constats confirmés, en entier ou en partie, sont corrigés dans cette version, les deux derniers pour leur part confirmée. C-1 et I-1 : avec « réduire les animations », les zones écrêtées clignotaient alors que l'écran dit « sans clignoter » ; l'agent de mise en œuvre l'avait relevé sans le corriger, faute de contre-vérification, et les deux relecteurs l'ont retrouvé chacun de son côté (« Corrigé », avec un contrôle de routine : « Ajouté » ; `docs/propositions.md`, section 5, choix 7 révisé). C-2 : le commentaire de `touch-action: none` donnait 20 px pour le seuil au-delà duquel le navigateur prend le geste pour un défilement ; c'est le premier multiple du pas de 5 px de l'essai. Au pas de 1 px, la réfutation mesure 16 px, dans Chromium, sur trois écrans émulés et dans les quatre directions (12 cas ; 48 avec les pas de 2, 3 et 5 px, qui donnent 16, 18 et 20 px) ; le commentaire le dit, et la feuille de style construite ne change pas. Les phrases de cette section qui citent 20 px décrivent l'essai et restent justes. C-3 : au clavier, l'anneau de focus de l'indicateur clignote avec le bouton ; c'est écrit dans `docs/camera-physique.md`, et l'aspect n'est pas changé (« Ce qui n'est pas fait »). R-1 et R-2 : le contrôle des deux loupes touchait la photo à 85 % et 80 %, sur le sol de feuilles mortes, sans motif à l'échelle des cases. Sur les profils ordinateur et webgl1, une loupe ouverte ailleurs sur le sol, à plusieurs fenêtres du point touché, restait sous le seuil (de 7,7 à 8,9 niveaux, hors de la routine), et sans la correction de COD-14 l'écart avec la zone touchée restait inférieur à l'écart avec celle du centre sur trois profils sur quatre : seul le seuil y détectait le défaut. Le contrôle touche maintenant à 50 % et 20 %, sur les arbres, où les deux conditions distinguent (« Ajouté », « Essais » ; choix 4 révisé). R-3 : le choix 4 écrivait que le contrôle échouerait si le boîtier par défaut changeait ; la réfutation l'a essayé hors de la routine, avec le Canon EOS RP réellement choisi et le calcul du contrôle laissé à la taille du Z 6 : 0,9 niveau sur ordinateur et 2,8 sur le profil iphone avec la police de la CI, le contrôle réussit. La phrase est réécrite, dans le choix 4 et dans le commentaire de la routine. R-4 : le cas « le clic n'est pas arrivé à la photo » ne pouvait pas être atteint, la routine attendant d'abord 300 s une loupe que rien n'avait demandée, et son message n'était jamais affiché ; la routine attend le point reçu 30 s au plus et fait échouer le contrôle en le disant (cas provoqué hors de la routine : « Essais »). D-1, D-5 et D-8, `docs/etat-des-travaux.md` : le test T6 n'y est plus rangé sous COD-09, et les passages qui disent ce qui reste du Sujet 2 après la fusion comptent les deux essais, comme la note de `docs/audit/README.md` ; la description de la pull request, encore celle du premier commit, est dans le reste à faire ; « Ce qui attend Julien » nomme les choix des « Corrections d'une ligne ». D-3, D-4 et I-2, `docs/tests-a-faire-faire.md` : T5 ne demande plus un glissement d'un centimètre « sur le bouton », qui n'a que 40 px de haut, dit que le compteur s'arrête à 20 vues et où lire le résultat au lever du doigt ; T5 et T6 disent que le simulateur garde des réglages d'une visite à l'autre, et T6 fait vérifier la correction d'exposition (une correction gardée de −0,3 IL suffit pour que rien ne clignote, mesuré par la réfutation). D-6 : « (ligne précédente) », dans cette section, renvoyait à la mauvaise ligne. D-7 : l'en-tête des « Corrections d'une ligne », dans `docs/propositions.md`, ne citait pas l'iPhone 14 émulé, sur lequel repose le choix 4. I-3 : cette section citait 36 et 24 relevés à l'appui d'un rythme d'une seconde et une seconde ; ces relevés ne sont pas réguliers et ne mesurent pas un rythme (« Essais »). Non corrigés : D-2, réfuté (il disait que les durées de la routine finale n'étaient portées par aucun journal ; elles se retrouvent par les heures de fin que portent les journaux, relues par les deux agents de corrections : 17 h 24, 17 h 45, 18 h 02, 18 h 23 et 18 h 41 UTC) ; la part non confirmée de D-3 (le geste d'un centimètre, essayé par la réfutation, donne bien le résultat que T5 attend, doigt sorti du bouton) ; celle d'I-2 (le compteur n'est pas toujours sous le doigt : selon l'écran, le bouton change de place quand son libellé s'allonge, ce qui est relevé à part dans « Ce qui n'est pas fait »). Les relecteurs ont aussi vérifié, sans constat. Code : `tsc --noEmit` et la construction ; l'animation à instants imposés (opacité de 1 puis de 0, et 0,5 puis 0 avec la ligne du plan : l'écart avec le plan est fondé) ; sur la feuille de style construite, 40 clics sur 40, 40 touchers émulés sur 40 et la touche Entrée 20 fois sur 20, contre 21 sur 40, 21 sur 40 et 12 sur 20 avant ; la rafale au doigt glissé, et la page qui ne défile sur aucun des écrans essayés, avant comme après ; les appelants de `showWhole`, `showFrame` et `dropLoupe`, et le cycle de vie de la loupe (29 adresses créées, 26 révoquées, les 3 vivantes étant les deux vues et la loupe affichée), photo suivante, rafale de deux vues et calcul en échec compris. Routine : le diff (un bloc ajouté, aucun contrôle existant modifié) ; le calcul de la zone attendue, le même que celui de `magnify` ; l'échec du contrôle d'alors sans la correction, par la routine entière, sur les profils android (64 réussis, 1 échec, 106,9 niveaux) et webgl1 (52,6) ; le viseur de 238 px de l'iPhone 14 émulé avec la police de la CI ; l'état laissé aux contrôles suivants. Documents : `scripts/check_public.py --commits all` et `scripts/changelog.py check` ; les chiffres de cette section recoupés avec les journaux de l'agent de mise en œuvre et avec le journal de la CI ; les trois constructions témoins ; les libellés que citent T5 et T6. Interface, au toucher émulé : l'indicateur qui clignote ouvre la fenêtre « Exposition » 60 fois sur 60 sur un Pixel 7 et un iPhone 14 émulés, contre 29 sur 60 avant ; deux états sans demi-teinte et une cadence inchangée ; les zones écrêtées, qui laissent le toucher à la photo ; la rafale, doigt immobile, glissé ou sorti du bouton ; T5 et T6 joués à la lettre. Non vérifié par les relecteurs : rien sur un vrai téléphone, avec un processeur graphique ni dans Safari ; le menu de l'appui long sur le déclencheur, que l'émulation ne produit pas, même sur un texte ordinaire ; le seuil de 16 px ailleurs que dans Chromium émulé ; le thème sombre ; le coût de l'animation sur la fluidité du viseur, la machine étant chargée ; le passage direct d'un mode hors limites à l'autre ; les gestes pendant le calcul d'une loupe (COD-08, hors de ce sujet) ; un boîtier APS-C réellement choisi sous le contrôle des deux loupes ; le site publié. Contrôle final, le 17 novembre 2026, par un agent qui n'a écrit ni la version, ni la relecture, ni les corrections. D'après ses notes et ses journaux : construction et vérifications de fin refaites ; journaux de la routine de la CI lus sur les commits ba71b6d et 14d144c ; les deux blocs de la routine ajoutés ou changés par la relecture rejoués hors de la routine entière, avec et sans la ligne de COD-14 ; le cas du clic non reçu rejoué sur l'iPhone 14 émulé ; le contrôle d'INT-17 essayé derrière le bloc des deux loupes (« Essais »). Aucun défaut trouvé dans `app/` ni dans `scripts/test_app.cjs` ; quatre points laissés, tous dans les documents (F-1 à F-4). Second tour, le même jour : un agent a repris ces quatre points en cherchant d'abord à les réfuter. Aucun n'est réfuté ; les quatre sont corrigés, sans rien changer à `app/` ni à la routine. F-1 : le déclencheur qui change de place pendant une rafale tenue n'était suivi que dans cette section et dans le test T5, pas dans `docs/etat-des-travaux.md`, qui doit suffire à reprendre ; il y a son point. En cherchant à le réfuter, l'agent a retrouvé le défaut avec son propre script, sur le site de cette version comme sur celui de la version 0.3.61, selon l'écran et la police (« Essais » ; `docs/propositions.md`, section 5, choix 10 ajouté). F-2 : le contrôle final n'était écrit nulle part comme fait ; il l'est ici et dans `docs/etat-des-travaux.md`, avec ses mesures. F-3 : le choix 8 de `docs/propositions.md` écrivait encore que l'indicateur qui clignote n'avait été essayé qu'à la souris et au clavier, alors que la relecture l'a essayé au toucher émulé ; il est révisé. F-4 : « (48 cas) », plus haut dans ce paragraphe, était rattaché au pas de 1 px, qui n'en compte que 12 (journaux de la réfutation relus : trois écrans, quatre directions, quatre pas ; mesure non refaite). Non vérifié par ce second tour : les mesures du contrôle final, lues dans ses journaux et non refaites ; le déclencheur avec la police d'un vrai téléphone. Second contrôle final, le même jour, par un autre agent : rien dans `app/` ni dans `scripts/test_app.cjs` ; un point laissé, dans `docs/etat-des-travaux.md` (G-1 : « Où on en est » comptait trois comportements changés par la version, au lieu de quatre), relu, confirmé et corrigé par la session, sans troisième tour.

Essais, dans Chromium sans écran, en rendu logiciel (Playwright), sur le site construit ; scripts écrits pour cette version, hors du dépôt. Trois constructions hors du dépôt servent de témoins : le site d'avant (version 0.3.61), le site avec la ligne du plan telle quelle pour le clignotement, et le site corrigé sans la ligne de COD-14. « Relevés à 100 ms » désigne le délai demandé entre deux relevés, dont l'heure n'a pas été notée : en rendu logiciel, ils ne sont pas réguliers (refaits pour les zones écrêtées avec l'heure de chaque relevé : 60 relevés étalés sur 54 à 60 s). Leurs comptes disent quels états existent, pas leur durée ; le rythme se lit dans les mesures à instants imposés, animation en pause.

- Clignotement de l'indicateur (FEX-19, INT-21), écran de 1280 × 800, mode S à 1/4000 s sans ISO auto (« S · −0,5 IL », « f/1,4 » qui clignote), 60 relevés à 100 ms. Avant : bouton invisible à 32 relevés, élément sous le pointeur autre que le bouton (`meter-row`) à 32 relevés ; 20 clics de souris à des instants quelconques : 10 ouvertures de la fenêtre ; 10 essais au clavier : focus pris 8 fois, fenêtre ouverte par Entrée 8 fois. Avec la ligne du plan (`to { opacity: 0; }`, `steps(2, start)`) : clics 20 sur 20 et focus 10 sur 10, mais opacité de 0,5 à 33 relevés et de 0 à 27, jamais 1 : l'aspect change. Corrigé (`step-end`) : opacité de 1 à 32 relevés et de 0 à 28, jamais cachée, bouton sous le pointeur 60 fois sur 60 ; clics de souris : 20 ouvertures sur 20 ; clavier : focus 10 sur 10, fenêtre ouverte 10 sur 10.
- Durée d'un clic de Playwright, le geste de la routine (`page.click("#meter-value")`), site corrigé : pendant le clignotement, 12 clics, 12 ouvertures, de 7,5 à 9,7 s, médiane 8,9 s. Témoin au même état sans clignotement (réglage « réduire les animations ») : 12 clics, 12 ouvertures, de 9,3 à 11,0 s, médiane 10,4 s. Le clic n'est donc pas plus long que le témoin. En mode M à f/8, où le viseur coûte moins à rendre : de 4,9 à 6,4 s (18 clics, médianes 5,3 s) ; ce n'est pas le bon témoin (`docs/propositions.md`, section 5, choix 6).
- « Réduire les animations », site corrigé : l'indicateur ne clignote pas (aucune animation, opacité de 1 aux 60 relevés), clics 20 sur 20, focus 10 sur 10.
- Zones écrêtées de l'écran de revue, qui partagent l'animation, site corrigé, photo surexposée de 3,2 IL (51,1 % de l'image) : opacité de 1 ou de 0 aux 60 relevés, jamais de valeur intermédiaire (36 et 24) ; l'élément touché est la photo, 60 fois sur 60, au centre comme sur une zone écrêtée ; toucher une zone ouvre la loupe. Le rythme, une seconde en noir, une seconde invisibles (celui que décrit `docs/camera-physique.md` depuis la version 0.3.57), est mesuré à instants imposés par le premier agent de corrections, animation en pause, sur le site de cette version : opacité de 1 à 0, 500 et 999 ms, de 0 à 1000, 1500 et 1999 ms, période de 2 s ; 171 492 pixels presque noirs sur les 354 780 de la photo affichée à 500 ms, 1 322 à 1500 ms.
- Zones écrêtées et « réduire les animations » (relecture, constats C-1 et I-1), écran de 1280 × 800, photo surexposée de 3,2 IL, « Infos » deux fois, réglage émulé par Playwright. Site de cette version : le calque n'a aucune animation, opacité de 1 aux 60 relevés, trois captures de la photo identiques (172 033 pixels presque noirs sur 354 780), texte « … 51,9 % de l'image. Ces zones sont en noir sur la photo, sans clignoter : votre appareil demande de réduire les animations. », et l'élément au centre de la photo reste la photo. Sans le réglage, même site : animation `clignote` de 2 s, opacité de 1 à 29 relevés et de 0 à 31, texte « Ces zones clignotent en noir sur la photo. » (ligne précédente pour le rythme). Témoin, site d'avant la correction (commit 55002d6), avec le réglage : même texte « sans clignoter », animation `clignote` en cours, opacité de 1 à 28 relevés et de 0 à 32, 171 706 pixels presque noirs à 500 ms et 1 579 à 1500 ms : les zones disparaissaient bien de l'écran. Feuille de style construite seule, avec le réglage : ni l'indicateur, ni la valeur qui clignote avec lui, ni le calque n'ont d'animation ; sans lui, l'indicateur vaut 1 puis 0 à 500 ms (période de 1 s) et le calque 1 puis 0 à 1000 ms (période de 2 s). Le script construit a le même contenu, à l'octet près, que celui d'avant la correction (seul son nom haché change) : la correction ne touche que la feuille de style.
- Rafale au doigt (COD-09), Pixel 7 émulé, Continu L à 5 vues par seconde, doigt posé par `Input.dispatchTouchEvent`, puis glissé par six pas de 5 px. Avant : après le quatrième pas (20 px), `pointercancel` puis `lostpointercapture`, le bouton revient à « Déclencher », 6,7 s avant le lever du doigt, vers le haut comme de côté (séries de 8 et 9 vues). Corrigé : six `pointermove`, aucun `pointercancel`, `pointerup` au lever du doigt ; la rafale continue après le glissement (de 10 à 12 vues au compteur) et finit au lever du doigt, vers le haut comme de côté (séries de 13 vues) ; doigt immobile : `pointerup` au lever du doigt (6 vues). La page ne défile dans aucun cas. Les durées dépendent du rendu logiciel, pas l'ordre des événements.
- Deux loupes séparées par « Photo entière » (COD-14), réglages de la routine (M, f/8, 1/4000 s, ISO 6400), une photo, loupe au centre puis six points touchés, chacun après « Photo entière » ; écart moyen de luminance entre la fenêtre de la loupe et la zone touchée de la photo entière, réduites à 12 × 4 cases. Corrigé : de 0,4 à 1,1 niveau (ordinateur, fenêtre de 1256 × 466 px) et de 1,4 à 3,3 (Pixel 7 émulé, 388 × 301 px). Sans la ligne : de 54 à 77 (ordinateur) et de 52 à 110 (Pixel 7 émulé).
- Premier état du contrôle de routine, qui plaçait la zone d'après le point visé (85 % et 80 %) : sur la machine de Claude, 65 contrôles réussis et 0 échec sur les profils ordinateur (0,6 niveau), android (1,7) et iphone (3,7, fenêtre de 366 × 126 px) ; le profil webgl1 n'y a pas été passé dans ce premier état ; sur le site sans la ligne de COD-14, profil ordinateur : 64 réussis, 1 échec, ce contrôle (28,9 niveaux). Dans la CI, d'après le journal de la routine, il a échoué sur le profil iphone, correction en place : 12,6 niveaux, fenêtre de 366 × 98 px ; les trois autres profils y étaient verts. Cause, reproduite sur la machine de Claude avec la police de la CI (DejaVu Sans, viseur de 238 px) : la photo n'y est affichée qu'en 178 × 118 px, et le clic arrive à un pixel CSS entier, à 84,8 % et 80,5 % au lieu de 85 % et 80 %. Un pixel CSS y vaut 34 pixels de l'image complète : la fenêtre de la loupe est 21 pixels plus bas et 10 pixels plus à gauche que la zone attendue, soit 5 et 2,5 pixels de la photo entière, pour des cases de 7,5 × 6 pixels. Mesuré pour trois points touchés : de 7,0 à 16,0 niveaux d'après le point visé, de 0,6 à 2,1 d'après le point que la photo a reçu ; sans la ligne de COD-14, de 34,5 à 84,4 d'après le point visé. Ce n'est pas un défaut de la loupe, qui montre bien le point reçu. Le contrôle place donc la zone d'après le point reçu, lu sur le clic comme le fait l'application ; ni la grille ni le seuil ne changent.
- Routine `node scripts/test_app.cjs --photo`, contrôle final de la mise en œuvre (toucher à 85 % et 80 %, zone placée d'après le point reçu ; avant la relecture), un profil à la fois, sur le site construit à cette version, machine de Claude : ordinateur, 65 contrôles réussis, 0 échec, en 24 minutes ; android, 65 et 0, en 21 minutes ; iphone, 65 et 0, en 17 minutes ; webgl1, 65 et 0, en 21 minutes. Le nouveau contrôle y mesure 0,3 niveau (ordinateur, photo affichée en 729 × 486 px), 0,7 (android, 214 × 321 px), 1,0 (iphone, 220 × 146 px, fenêtre de 366 × 126 px) et 0,3 (webgl1). Profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px, point reçu à 84,8 % et 80,5 %) : 65 contrôles réussis, 0 échec, en 18 minutes, le nouveau contrôle à 2,0 niveaux ; un premier passage, sur le site construit avant l'écriture de cette section, avait donné 65 et 0, à 1,9 niveau. Ces passages émulent l'écran, le toucher et le navigateur, en rendu logiciel : ni processeur graphique, ni Safari, ni vrai téléphone ; et la routine clique à la souris, sur tous les profils.
- Ce contrôle final de la mise en œuvre échoue sans la correction : sur le site construit sans la ligne de COD-14 (construit avant l'écriture de cette section, il affiche encore 0.3.61), profil iphone avec la police de la CI, 64 contrôles réussis et 1 échec, ce contrôle (40,1 niveaux avec la zone touchée, 80,4 avec celle du centre). Les trois autres profils n'ont pas été passés sans la correction avec le contrôle final ; le profil ordinateur l'a été avec le premier état (« Premier état du contrôle de routine », plus haut).
- Après la relecture, routine `node scripts/test_app.cjs --photo` avec le contrôle des deux loupes au point (50 % ; 20 %) et le contrôle « réduire les animations », passée par le premier agent de corrections, un profil à la fois, machine de Claude, sur le site construit avec la feuille de style corrigée. Profil ordinateur : 66 contrôles réussis, 0 échec ; point reçu à 50,1 % et 20,0 %, 0,4 niveau avec la zone touchée, 51,8 avec celle du centre (fenêtre de 1256 × 466 px, photo affichée en 729 × 486 px). Profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px) : 66 et 0 ; point reçu à 50,0 % et 20,3 %, 0,7 niveau avec la zone touchée, 112,9 avec celle du centre. Sur les deux profils, contrôle « réduire les animations » : animation `clignote` sans le réglage ; avec lui, aucune animation, opacité de 1, bouton « Infos : hautes lumières » et texte « sans clignoter » ; animation revenue une fois le réglage rendu. Sans les corrections, les deux contrôles ajoutés ou changés par la relecture échouent, ce qui est attendu : la même routine sur le site construit sans la ligne de COD-14 (sources du commit 55002d6 avec `app/src/ui/shutter.ts` d'`origin/main` : il n'a donc pas non plus la feuille de style corrigée), profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px) : 64 contrôles réussis, 2 échecs. Contrôle des deux loupes : point reçu à 50,0 % et 20,3 %, 107,4 niveaux avec la zone touchée, 13,5 avec celle du centre ; le seuil et la condition du centre échouent l'un et l'autre. Contrôle « réduire les animations » : avec le réglage, animation `clignote` encore en cours sous le texte « sans clignoter ». Sur les autres profils, le point (50 % ; 20 %) n'est mesuré sans la correction de COD-14 que hors de la routine, par la réfutation : 77 niveaux contre 33 avec la zone du centre (ordinateur), 86 contre 22 (Pixel 7 émulé). Les profils android et webgl1 ne sont pas passés par les agents de corrections : la CI les passe sur le site corrigé. Mêmes limites que plus haut : rendu logiciel, écrans émulés, clics à la souris.
- Cas du clic qui n'arrive pas à la photo (relecture, constat R-4), hors de la routine, par le second agent de corrections : le bloc des deux loupes, repris tel quel de `scripts/test_app.cjs`, est joué sur le site de cette version, écran de 1280 × 800, photo aux réglages de départ, un calque posé sur la photo arrêtant le clic. Le contrôle échoue avec « le clic n'est pas arrivé à la photo (aucun point reçu en 30 s), aucune loupe n'a été demandée », 40 s après le clic, « Revenir au viseur » compris, au lieu d'attendre 300 s ; l'écran de revue se ferme, la photo suivante s'ouvre entière (1500 × 999 px, sans défilement) et une loupe s'y ouvre ; aucune erreur de page. Témoin sans le calque, même script : le contrôle réussit (point reçu à 50,1 % et 20,0 %, 0,2 niveau avec la zone touchée, 68,3 avec celle du centre). Ce cas n'a pas été provoqué dans la routine entière.
- Contrôle final (17 novembre 2026), d'après ses journaux, relus au second tour et non refaits. Le bloc des deux loupes et celui de « réduire les animations », repris tels quels de `scripts/test_app.cjs`, sont joués hors de la routine entière. Sur le site de cette version, écran de 1280 × 800 : les deux contrôles réussissent (0,3 niveau avec la zone touchée, 66,6 avec celle du centre). Sur le site construit sans la ligne de COD-14, qui n'a pas non plus la feuille de style corrigée, les deux échouent sur les trois profils que personne n'y avait passés : 58,4 niveaux avec la zone touchée contre 27,9 avec celle du centre (ordinateur), 61,0 contre 37,5 (Pixel 7 émulé), 58,8 contre 32,0 (ordinateur sans WebGL 2) ; une mesure indépendante y retrouve la loupe à 46,6 %, 48,7 % et 46,6 % de la hauteur de la photo, là où le défaut la place, et non à 20 %. Cas du clic qui n'arrive pas à la photo, rejoué sur l'iPhone 14 émulé avec la police de la CI (viseur de 238 px) : le contrôle échoue avec « le clic n'est pas arrivé à la photo (aucun point reçu en 30 s), aucune loupe n'a été demandée », et le contrôle de « réduire les animations » réussit ensuite. Contrôle d'INT-17 derrière le bloc des deux loupes : sur une copie de cette version sans la remise à zéro du défilement, iPhone 14 émulé avec la police de la CI, mêmes gestes que la routine, la photo suivante s'ouvre défilée de 154 px ; le contrôle d'INT-17 échouerait donc encore. Routine de la CI, journaux lus par le contrôle final : sur les commits ba71b6d et 14d144c, 66 contrôles réussis et 0 échec sur chacun des quatre profils ; sur 14d144c, contrôle des deux loupes : 0,4 niveau avec la zone touchée contre 68,7 avec celle du centre (ordinateur), 0,5 contre 78,4 (android), 0,7 contre 118,5 (iphone, viseur de 238 px), 0,4 contre 80,1 (webgl1).
- Déclencheur qui change de place pendant une rafale tenue (second tour, point F-1), par l'agent du second tour, avec son propre script : Continu L à 3 vues par seconde, doigt posé au centre du déclencheur par `Input.dispatchTouchEvent` et tenu sans bouger, place du bouton relevée toutes les 100 ms ; site construit au commit 55002d6, dont la mise en page est celle de cette version. iPhone 14 émulé (390 × 664 px), police Inter de la machine de Claude : avant l'appui, « Déclencher » (125 px de large) est à droite du bouton du mode, à 244 px du bord gauche de la fenêtre ; à « Rafale : 1 vue » (137 px), il passe au bord gauche de la rangée (à 12 px) et le bouton du mode se retrouve une ligne plus haut. Le doigt, resté en place, n'est plus sur le bouton ; la rafale continue (ni `pointerup` ni `pointercancel` avant le lever), et le bouton reprend sa place au lever. Même résultat sur le site de la version 0.3.61 : le défaut est antérieur à cette version. Pixel 7 émulé (412 × 839 px), même police : le bouton reste en place de 1 à 19 vues et passe au bord gauche à « Rafale : 20 vues » (159 px). iPhone 14 émulé avec la police de la CI (viseur de 238 px au chargement) : en Continu L, le bouton est déjà au bord gauche de la rangée avant l'appui, sous le bouton du mode, et ne bouge pas jusqu'à 20 vues (181 px). Le défaut dépend donc de la largeur de l'écran et de la police ; rien n'est établi avec la police d'un vrai téléphone. Une seule rafale par cas.
- `npm run build` (dont `tsc --noEmit`), `python3 scripts/changelog.py check --base origin/main`, `python3 scripts/check_public.py --commits all` : réussis (0 problème pour le dernier), refaits après les corrections ; les deux derniers refaits après le second tour, qui ne touche pas à `app/`. Le site construit dans le dépôt après les corrections a les mêmes fichiers, à l'octet près (`diff -rq` sans différence), que celui sur lequel la routine d'après la relecture a tourné.

### Corrigé

- Indicateur d'exposition qui clignote (FEX-19, INT-21), `app/src/style.css` : l'animation `clignote` passe par l'opacité et non par `visibility: hidden`. Hors des limites de l'appareil, en mode A ou S, l'indicateur est le bouton qui ouvre la fenêtre « Exposition » ; caché une demi-seconde sur deux, il ne prenait alors ni les clics ni le focus. Il les garde (essayé à la souris et au clavier par l'agent de mise en œuvre, au toucher émulé par la relecture ; pas avec un vrai doigt), et clignote comme avant : une demi-seconde visible, une demi-seconde invisible. Pour garder cet aspect, l'animation est écrite `step-end`, avec l'opacité à 0 de 50 % à la fin de la période, et non par la seule ligne du plan (« Essais »). Les zones écrêtées de l'écran de revue, qui partagent l'animation, clignotent au même rythme, une seconde en noir, une seconde invisibles, et ne prennent toujours pas les touchers.
- Zones écrêtées de l'écran de revue et « réduire les animations » (hors de l'audit : relevé pendant les essais de cette version, contre-vérifié par sa relecture, constats C-1 et I-1), `app/src/style.css` : avec ce réglage du système, l'écran de revue écrit que les zones sont en noir « sans clignoter », et elles clignotaient, depuis la version 0.3.57. La règle `prefers-reduced-motion` qui coupe l'animation du calque était écrite avec celle de l'indicateur, avant la règle du calque (`.review-highlights`), qui l'emportait à poids égal. Elle est écrite sous la règle du calque ; celle de l'indicateur ne change pas de place. Les zones restent en noir, comme le dit l'écran. Essayé dans Chromium, réglage émulé.
- Rafale au doigt (COD-09), `app/src/style.css` : `touch-action: none` sur le déclencheur. Un doigt qui glissait de 20 px sur le bouton arrêtait la rafale, doigt encore posé : le navigateur prenait le geste pour un défilement. La rafale finit au lever du doigt. Essayé dans Chromium sur un téléphone émulé seulement.
- Loupe de l'écran de revue (COD-14), `app/src/ui/shutter.ts` : « Photo entière » oublie la fenêtre de la loupe (`showWhole` appelle `dropLoupe`). Après « Photo entière », toucher la photo agrandissait un voisin de l'ancienne fenêtre, pas le point touché. L'appel de `showFrame`, qui finit par `showWhole`, devenait redondant : il est retiré.

### Ajouté

- Routine de test (`scripts/test_app.cjs`), avec `--photo` : contrôle « revue : après « Photo entière », la seconde loupe montre le point touché ». Sur la photo que la routine a déjà, après la loupe du centre et « Photo entière », la photo est touchée à 50 % de sa largeur et à 20 % de sa hauteur, sur les arbres (à 85 % et 80 %, sur le sol, avant la relecture) ; la fenêtre de la loupe doit ressembler à la zone touchée de la photo entière (écart inférieur à 10 niveaux, et inférieur à l'écart avec la zone du centre). La zone est placée d'après le point que la photo a reçu, lu sur le clic. Si le clic n'arrive pas à la photo, le contrôle échoue en le disant après 30 s, sans attendre une loupe. Aucun contrôle existant n'est modifié.
- Routine de test, avec `--photo` (relecture) : contrôle « « réduire les animations » : zones écrêtées en noir sans clignoter, comme l'écrit l'écran de revue ». Sur la photo surexposée, zones affichées, le réglage est émulé et « Infos » touché trois fois, pour que le texte soit réécrit : le calque ne doit avoir aucune animation, et le texte doit dire « sans clignoter » ; réglage rendu, l'animation doit revenir. La routine compte 66 contrôles par profil, au lieu de 65.
- `docs/tests-a-faire-faire.md` : tests T5 (rafale tenue, doigt qui glisse) et T6 (toucher l'indicateur pendant qu'il clignote), à faire sur un téléphone à la version 0.3.62.

### Modifié

- Documents : `docs/etat-des-travaux.md` (Sujet 2 écrit, relu et corrigé, sujet suivant : le Sujet 3 ; suspensions et redémarrages du 16 et du 17 novembre) ; `docs/propositions.md` (section 5, « Corrections d'une ligne », choix 1 à 10) ; `docs/camera-physique.md` (clignotement, anneau de focus, rafale au doigt, loupe après « Photo entière », et le défaut corrigé avec « réduire les animations ») ; `docs/audit/README.md` (une note datée sous le Sujet 2, sans réécrire le reste).

## [0.3.61] - 2026-11-16

Retrait de l'anglais, seconde des deux pull requests : le référentiel et la scène en français seul. Décision de Julien du 15 novembre 2026 : « Retire la traduction anglaise, on garde tout en full français. » Choix de Claude : `docs/propositions.md`, section 5, « Retrait de l'anglais » (choix 15 et 16 pour cette version). Rien ne change de ce que le visiteur voit, hors le numéro de version : l'accueil, les fiches et la fenêtre « Crédits » affichent les mêmes textes qu'avant. Numérotation : retirer un champ n'ajoute, ne retire ni ne reclasse aucune notion ni aucune situation, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- L'historique n'est pas réécrit (choix 6 et 12) : sections passées de ce fichier, `docs/historique.md`, `docs/audit/` (hors les deux notes datées dites plus bas), `REPRISE.md`, décisions datées, spécifications des fonctions déjà faites, dossiers de recherche. Ils citent encore l'anglais, les champs `title.en` ou `scripts/extract_reprise.py`. Les blocs YAML de `REPRISE.md` portent encore les champs `en`.
- Les titres anglais retirés ne sont recopiés nulle part (choix 7) ; ils restent dans l'historique du dépôt (tag `v0.3.60`), comme `scripts/extract_reprise.py`.
- Le reste du Sujet 45 du plan de corrections (l'avertissement en tête de `REPRISE.md` ; les lignes des README que le plan demande, dans `README.md` seul, `README.en.md` étant retiré depuis la version 0.3.60 ; la phrase de `CLAUDE.md` sur `docs/`, que le plan situe à la ligne 8 et qui est aujourd'hui à la ligne 9) : seule la suppression du script est avancée.
- `docs/tests-a-faire-faire.md` n'est pas modifié : cette version n'ajoute rien à voir sur un téléphone.

Relecture : la mise en œuvre a été relue par deux agents, l'un pour le code, les données et le comportement, l'autre pour la vérité des documents. Ils ont rendu 4 constats, 1 pour le code et 3 pour les documents. Un troisième agent les a repris pour chercher à les réfuter, en relisant lui-même le code et les documents. Verdicts : 4 confirmés, aucun réfuté. Les 4 sont corrigés dans cette version. Le premier : le commentaire de `readDomains`, dans `app/scripts/build-pages.mjs`, disait le format du bloc « domain » « contrôlé par validate.py » ; `scripts/validate.py` n'en contrôle que le schéma, alors que l'expression régulière exige « id » puis « title », deux espaces de retrait et un titre entre guillemets doubles. Essai du troisième agent, dans une copie hors du dépôt : le titre de `data/referentiel/lec.yaml` écrit sans guillemets passe `scripts/validate.py` (0 erreur, code de sortie 0) et n'est plus reconnu par l'expression régulière. Le commentaire est antérieur à cette version (il est sur `origin/main`) ; lui seul est rectifié, le comportement ne change pas (« Corrigé »). Les trois autres, dans cette section : « la ligne 8 de `CLAUDE.md` », alors que la phrase visée est à la ligne 9, et les lignes des README, que le Sujet 45 demande aussi, absentes du reste à faire ; « titre de la scène lu directement » dans `app/src/credits.ts`, qui ne le lit nulle part ; ce paragraphe, qui manquait, avec la phrase de `docs/etat-des-travaux.md` qui disait la relecture non faite. Les relecteurs ont aussi vérifié, sans constat : les données rechargées aux deux révisions (254 lignes `title:`, la valeur française reprise octet pour octet, rien d'autre ne change) ; `scene.json` (13 champs seulement) ; 27 essais négatifs sur les quatre schémas (ancienne forme, chaîne vide, nombre, titre ou rôle absent : refusés ; `changes` reste facultatif) ; le site construit depuis HEAD et depuis `origin/main` dans des copies hors du dépôt (ils ne diffèrent que par le numéro de version, le nom haché et la taille du script du simulateur, 6 octets de moins, et `scene.json` ; les 22 fiches sont identiques) ; la sortie de `scripts/coverage.py`, identique à l'octet près à celle d'`origin/main` ; l'ancien `scripts/extract_reprise.py` relancé vers un dossier vide (16 fichiers écrits, 15 différents de ceux d'`origin/main`, 14 portant des champs `en`). Non vérifié par les relecteurs : la routine de test et le rendu de la fenêtre « Crédits » dans un navigateur, faits par l'agent de mise en œuvre seulement.

Essais : `python3 scripts/validate.py` (191 notions, 49 situations, 172 sources, 1 jalon ; 0 erreur, 0 avertissement), `python3 scripts/check_scenes.py` (8 éléments, 36 fichiers ; 0 erreur), `npm run build`, `python3 scripts/changelog.py check --base origin/main`, `python3 scripts/check_public.py --commits all` (0 problème). Conversion : faite par un script jetable, hors du dépôt ; le diff de `data/` ne porte que sur des lignes `title:` (254 retirées, 254 ajoutées), et les données chargées avant et après, l'ancien objet ramené à sa valeur `fr`, sont identiques (référentiel, situations, jalon, manifeste de la scène). Schémas : dans une copie du dépôt, `data/referentiel/lec.yaml`, `data/situations.yaml` et `data/jalons.yaml` remis tour à tour à l'ancienne forme font échouer `scripts/validate.py` (« is not of type 'string' », code de sortie 1) ; l'ancien manifeste de la scène donne 13 erreurs contre le nouveau schéma, et un seul `title`, `role` ou `changes` remis en objet en donne une. `python3 scripts/coverage.py` : sortie identique à l'octet près avant et après (13 notions couvertes sur 191). Site construit avant et après les changements de code, comparé fichier par fichier : les 22 fiches sont identiques ; l'accueil ne diffère que par le nom haché et la taille du script du simulateur et par la taille de `scene.json`, dans la liste du bouton de téléchargement ; le script du simulateur ne diffère que par les deux lectures `.role.fr` et `.changes.fr`, devenues `.role` et `.changes` ; `scene.json` est le fichier converti. Routine `node scripts/test_app.cjs --photo` sur la machine de Claude, un profil à la fois, site construit depuis le commit 8cbf2d9 (le dernier qui touche au code ou aux données) : ordinateur, android, iphone et webgl1, 64 lignes « ok » et 0 échec chacun ; la CI lance les quatre profils sur le dernier commit, ses résultats sont dans la description de la pull request. Hors routine, dans Chromium à 1280 × 800 : la fenêtre « Crédits » du simulateur, ouverte sur le site construit avant et après, donne le même texte pour les 8 éléments (rôle en français, titre, auteur, licence, et « Modifications : … » pour les 4 modèles de Renderpeople), sans erreur de console ; la routine ne lit pas cette liste. Chromium en rendu logiciel, écrans émulés : rien sur un vrai téléphone, avec un processeur graphique ni dans Safari.

### Modifié

- Référentiel (`data/referentiel/*.yaml`, `data/situations.yaml`, `data/jalons.yaml`) : un titre est une chaîne, `title: "Exposition"` au lieu de `title: {fr: "Exposition", en: "exposure"}` (choix 15). 254 titres : 13 de domaines, 191 de notions, 49 de situations, 1 de jalon. Les textes français sont inchangés.
- Manifeste de la scène du parc (`app/public/scenes/parc/scene.json`) : `title` de la scène, `role` de chaque élément (8) et `changes` des éléments modifiés (4) sont des chaînes, la valeur française d'avant. Le fichier passe de 17 371 à 16 355 octets ; l'accueil, qui donne sa taille au bouton « Télécharger les ressources du simulateur », suit.
- Schémas : `schemas/domaine.schema.json` (titre du domaine, titre de chaque notion), `schemas/situations.schema.json`, `schemas/jalons.schema.json` et `schemas/scene.schema.json` (`title`, `role`, `changes`) exigent une chaîne non vide et refusent l'ancien objet.
- Lecteurs : `app/scripts/build-pages.mjs` (expression régulière des titres de domaines), `app/src/credits.ts` (`role` et `changes` lus directement ; le titre de la scène, que ce fichier ne lit pas, n'y change que de type), `scripts/coverage.py` (titres des domaines et du jalon). `scripts/validate.py`, `scripts/check_scenes.py` et `scripts/referentiel.py` ne lisent pas ces champs : ils passent par les schémas.
- Documents : `docs/lire-le-referentiel.md` (champ `title` d'une notion et d'un jalon), `docs/licences.md` (le rôle d'un élément de scène n'est plus dit « en français et en anglais »), `docs/architecture.md` (section « Langue »), `docs/etat-des-travaux.md` (version 0.3.60 fusionnée, cette pull request, sujet suivant : le Sujet 2), `docs/propositions.md` (choix 15 et 16).
- `docs/audit/README.md`, deux notes datées, sans réécrire le reste : la note du 16 novembre 2026 en tête du plan dit le retrait des champs `en` fait dans cette version ; une note sous le Sujet 45 dit `scripts/extract_reprise.py` supprimé.
- `README.md` : la ligne qui décrit `scripts/` ne cite plus l'extraction, le seul script d'extraction étant supprimé (« Retiré »). Relevé par l'agent qui a repris les constats de la relecture, hors des 4 constats.

### Corrigé

- `app/scripts/build-pages.mjs`, commentaire de `readDomains` : il dit ce que `scripts/validate.py` contrôle (le schéma), l'écriture que la construction attend du bloc « domain », et qu'elle échoue sinon. Aucun changement de comportement (« Relecture »).

### Retiré

- Les champs `en` des titres du référentiel (254) et du manifeste de la scène (13 : le titre, 8 rôles, 4 modifications).
- Dans les schémas : `$defs/bilingue` (`schemas/domaine.schema.json`), `$defs/bilingual` (`schemas/scene.schema.json`) et les deux objets `fr`/`en` écrits sur place (`schemas/situations.schema.json`, `schemas/jalons.schema.json`).
- Le type `Bilingual` de `app/src/credits.ts`.
- `scripts/extract_reprise.py` (choix 16) : lancé dans le dépôt, il réécrivait le référentiel, les situations et les sources depuis `REPRISE.md`, champs `en` compris. Aucun workflow, script ni document vivant ne l'appelait. Sa suppression était prévue au Sujet 45 du plan de corrections (constat CHX-06) ; elle est avancée.

## [0.3.60] - 2026-11-16

Retrait de l'anglais, première des deux pull requests : le site en français seul. Décision de Julien du 15 novembre 2026 : « Retire la traduction anglaise, on garde tout en full français. » Découpage et choix de Claude : `docs/propositions.md`, section 5, « Retrait de l'anglais » (choix 1 à 14). La seconde pull request, version 0.3.61, retirera les champs `en` du référentiel et de la scène.

Ce qui n'est pas fait :

- Les champs `en` de `data/referentiel/*.yaml`, de `data/situations.yaml`, de `data/jalons.yaml` et de `app/public/scenes/parc/scene.json`, avec leurs schémas : ils sont encore là, et leurs lecteurs lisent la clé `fr` (choix 11). C'est la version 0.3.61. `docs/lire-le-referentiel.md` et la phrase de `docs/licences.md` sur le rôle des éléments d'une scène décrivent encore ces champs.
- L'historique n'est pas réécrit (choix 6 et 12) : sections passées de ce fichier, `docs/historique.md`, `docs/audit/`, `REPRISE.md`, décisions datées, spécifications des fonctions déjà faites, dossiers de recherche. Ils citent encore l'anglais, `app/src/i18n.ts`, `content/fr/` ou `fiches/fr/`.
- Aucune redirection des anciennes adresses des fiches.

Relecture : la mise en œuvre a été relue par deux agents, l'un pour le code et le comportement du site, l'autre pour la vérité des documents. Ils ont rendu 13 constats. Un troisième agent en a repris 12 pour chercher à les réfuter, en relisant lui-même le code et les documents ; le treizième porte sur la description de la pull request et est traité à part, hors du dépôt. Verdicts des 12 : 11 confirmés, 1 confirmé en partie, aucun réfuté. Celui qui n'est confirmé qu'en partie dit incomplète la liste de ce que la seconde pull request doit faire : les quatre schémas étaient déjà nommés dans `docs/etat-des-travaux.md`, le reste manquait. Les 12 sont corrigés dans cette version : la fiche rechargée à la fin du chargement (« Corrigé ») ; les deux-points écrits de deux façons, la clé `meter` lue nulle part et les noms hérités des deux langues dans `scripts/coverage.py` (« Modifié », « Retiré ») ; dans les documents, « dans les deux langues » au présent, la liste de la seconde pull request, la règle de couverture de `docs/cadrage.md` réécrite sans trace de l'ancienne, deux choix sans ligne dans `docs/propositions.md` (choix 13 et 14), la place de « Ce qui n'est pas fait » et de « Essais » dans cette section (ils étaient des puces de « Retiré »), `docs/tests-a-faire-faire.md` non tenu à jour, le titre du point en tête de `docs/etat-des-travaux.md` et « `content/` (à venir) » dans `docs/licences.md`. Le relecteur de code a aussi vérifié, sans constat, avant ces corrections : la table des textes comparée clé par clé avec celle de la version 0.3.59 (224 clés avant, 223 après, seule `switchLang` retirée, aucune valeur française changée) ; les 241 liens internes du site construit, sans lien cassé ; le champ `used_in` de `data/sources.yaml` (172 sources avant et après, tous les chemins existent).

Essais : `python3 scripts/validate.py` (0 erreur, 0 avertissement), `python3 scripts/coverage.py`, `npm run build`, `python3 scripts/check_public.py --commits all` (0 problème). Sur la machine de Claude, routine `node scripts/test_app.cjs --photo`, un profil à la fois : profils ordinateur et iphone sur le site construit depuis le commit fcb77de, qui porte les corrections de code de la relecture, 64 lignes « ok » et 0 échec chacun ; profils android et webgl1 sur le site construit depuis le commit cf9a91b, avant ces corrections, 64 lignes « ok » et 0 échec chacun, non relancés sur cette machine depuis (la CI lance les quatre profils sur le dernier commit ; ses résultats sont dans la description de la pull request). Une ligne pour les liens internes des pages, 63 pour le profil ; 63 lignes avant cette version : un contrôle retiré, deux ajoutés. Deux essais hors routine, par l'agent qui a repris les constats, dans Chromium, site construit depuis le commit fcb77de. Le premier : la clé `tutophoto.lang` enregistrée à « en » avant l'ouverture des pages, écrans émulés de 1280 × 800 et d'un iPhone 14 ; l'accueil, la fiche NET-01 et le simulateur s'ouvrent en français, sans erreur de console, la ligne de diagnostic du simulateur reste vide, et la clé reste dans le stockage. Le relecteur de code avait fait le même essai, avec le même résultat. Le second, à 1280 × 800, le chargement de la scène ralenti de 15 s : la fiche SIT-01 ouverte depuis la fenêtre « Défis » pendant le chargement, défilée de 300 px. Avant la correction (commit 30da5af), elle est téléchargée deux fois et revient en haut à la fin du chargement ; après, une fois, et elle garde son défilement. Limites : Chromium en rendu logiciel, écrans émulés (1280 × 800 avec et sans WebGL 2, Pixel 7, iPhone 14) ; rien sur un vrai téléphone, avec un processeur graphique ni dans Safari.

Phrase périmée de la section 0.3.59, laissée telle qu'elle a été publiée :

- Sa rubrique « Modifié » dit « `docs/etat-des-travaux.md` : Sujet 1 fait, sujet suivant (Sujet 2) ». Le sujet suivant était le retrait de l'anglais, décidé par Julien le 15 novembre 2026 ; le Sujet 2 vient après. `docs/etat-des-travaux.md` le disait correctement.

### Ajouté

- Routine de test (`scripts/test_app.cjs`), deux contrôles par profil : « accueil ouvert avec ?lang=en : en français » et « simulateur ouvert avec ?lang=en : en français, sans bouton de langue ». La routine ouvre désormais le simulateur avec `?lang=en`, paramètre retiré, pour toute sa suite : les contrôles qui lisent un texte français de l'interface vérifient donc aussi que ce paramètre est ignoré.

### Modifié

- Simulateur : une seule langue. `app/src/i18n.ts` devient `app/src/texts.ts`, une seule table de textes en français, sous les mêmes clés ; la fonction `t` ne prend plus de langue. Les méthodes `setLang(lang)` des composants de l'interface et la fonction `applyLang()` de `app/src/main.ts` deviennent `applyTexts()`, sans argument : elles écrivent les textes, il n'y a plus de langue à changer. Les deux-points qui séparent deux textes assemblés sont écrits d'une seule façon, dans le gabarit (« … : … ») ; avant, une partie passait par la clé `balanceColon`, une autre par une constante locale. Les nombres gardent l'écriture française qu'ils avaient (virgule décimale, espace devant les deux-points et le point-virgule).
- Accueil et fiches (`app/scripts/build-pages.mjs`) : une seule langue dans la page d'accueil, au lieu de deux blocs dont un masqué. Le seul script de l'accueil est celui du bouton « Télécharger les ressources du simulateur » ; les fiches n'ont plus de script.
- Adresses des fiches : `fiches/EXP-04.html` au lieu de `fiches/fr/EXP-04.html`. Les anciennes adresses, `fiches/fr/…` et `fiches/en/…`, ne mènent plus nulle part : aucune redirection n'est posée (choix 2).
- Liens internes sans `?lang=` : accueil, fiches, simulateur, activité de LUM-02. Une adresse qui porte encore `?lang=en` ouvre la page en français (choix 3).
- Contenus : `content/fr/notions/` et `content/fr/situations/` deviennent `content/notions/` et `content/situations/` (19 fiches de notions, 3 de situations, textes inchangés).
- `data/relecture.yaml` et `schemas/relecture.schema.json` : une ligne par fiche, sans champ `langue` (`- {fiche: NET-01, date: 2026-11-12}`). La liste est vide ; `scripts/validate.py`, `app/scripts/build-pages.mjs` et la routine lisent la nouvelle forme.
- `data/sources.yaml`, champ `used_in` : les chemins `content/fr/…` deviennent `content/…`, les chemins `content/en/…` sont retirés ; aucune source n'est retirée (choix 9). `python3 scripts/validate.py` : 0 erreur, 0 avertissement.
- `scripts/coverage.py` : couverture en français seul. Une notion est couverte quand ses quatre briques existent ; la table des briques a une colonne au lieu de deux. Les comptes ne changent pas : 13 notions couvertes sur 191 (6,8 %), 3 situations rédigées sur 49, les fiches anglaises ayant eu les mêmes sections que les françaises. Deux restes des deux langues sont repris, la variable `both`, renommée `drafted`, et l'alias `h`, retiré : la sortie du script est identique à l'octet près avant et après.
- Routine de test : adresses et sélecteurs adaptés (fiches sous `fiches/`, plus de bloc de langue dans l'accueil). Le contrôle de l'accueil vérifie en plus qu'il ne reste aucun élément de choix de langue ; celui de la fiche NET-01 ne lit plus la clé `tutophoto.lang`.
- `CLAUDE.md`, première ligne : « en français » à la place de « bilingue FR/EN » (choix 8).
- `README.md` : plus de lien vers une version anglaise ; « en français » à la place de « en français et en anglais ».
- Documents mis à jour : `docs/contenus.md` (emplacement, titres des sections, règle de couverture, publication), `docs/pile-technique.md`, `docs/architecture.md` (la section « Bilinguisme » devient « Langue »), `docs/cadrage.md` (la décision du 6 novembre 2026 est dite remplacée ; règle de couverture, avec le rappel de l'ancienne), `docs/licences.md` (dont « `content/` (à venir) », devenu « `content/` » : le dossier porte 22 fiches), `docs/questions-ouvertes.md`, `docs/specifications/balance-des-blancs.md` (spécification reportée), `docs/historique.md` (une entrée datée), `docs/propositions.md` (choix 9 à 14), `docs/etat-des-travaux.md` (le point en tête devient « Point du 16 novembre 2026 »), `docs/tests-a-faire-faire.md` (test T4).
- `docs/audit/README.md` : une note datée du 16 novembre 2026, en tête du plan de corrections, dit que les parts anglaises des sujets tombent et donne les chemins qui ont changé. Les sujets et les rapports ne sont pas réécrits.

### Corrigé

- Simulateur, fenêtre d'une fiche (`app/src/ui/ficheDialog.ts`) : une fiche ouverte pendant le chargement de la scène n'est plus téléchargée une seconde fois ni remise en haut à la fin du chargement. La ligne en cause rechargeait la fiche ouverte au changement de langue ; depuis le retrait de la bascule, son seul effet était celui-là. Constat de la relecture (ci-dessus).

### Retiré

- La traduction anglaise du site : textes anglais du simulateur, de l'accueil, des fiches, de l'activité de LUM-02 et de la page des licences.
- Le bouton de langue du simulateur, de l'accueil, des fiches et de l'activité de LUM-02 ; le paramètre `?lang=` ; la clé `tutophoto.lang` du stockage du navigateur, qui n'est plus lue ni écrite (une clé déjà enregistrée chez un visiteur y reste, sans effet).
- `content/en/` (22 fiches en anglais : 19 notions et 3 situations) et `README.en.md`. Ils restent dans l'historique du dépôt (tag `v0.3.59`).
- Les titres anglais des notions recopiés dans `app/src/ui/challenges.ts` (choix 11).
- Routine de test : le contrôle « accueil : bouton de langue », qui n'a plus d'objet (choix 10).
- Deux clés de la table des textes du simulateur : `balanceColon` (« : », remplacée par le texte écrit dans le gabarit) et `meter` (« Exposition », lue nulle part, déjà dans la version 0.3.59). La table a 221 clés.

## [0.3.59] - 2026-11-15

Sujet 1 du plan de corrections de l'audit (`docs/audit/README.md`) : la version du site à l'écran (constat ARC-12, `docs/audit/architecture-application.md`). Jusqu'ici, rien à l'écran ne disait quelle version le navigateur avait chargée. Avec elle, sur décision de Julien du 15 novembre 2026 : la correction de deux contrôles de la routine de test qui échouaient par intermittence dans la CI, l'un par un défaut de l'application (l'écran de revue), l'autre par un défaut de la routine.

### Ajouté

- La version du site à l'écran : le numéro `X.Y.Z` du premier titre de version de ce fichier, lu à la construction. Sur une pull request, c'est la version à venir ; sur `main`, la version publiée. Il s'affiche à ces endroits :
  - le pied de l'accueil, en français et en anglais : « Version 0.3.59 » ;
  - la fenêtre des crédits du simulateur, au-dessus de la liste des crédits (demande de Julien du 15 novembre 2026) : « Version du site : 0.3.59 » (« Site version: 0.3.59 »). Elle est écrite dès l'ouverture de la page, avant la fin du chargement de la scène, et se lit à l'ouverture de la fenêtre, sans la faire défiler : vérifié sur les quatre profils de la routine (1280 × 800 avec et sans WebGL 2, Pixel 7 et iPhone 14 émulés), dans les deux langues, avec la police de la machine de Claude et avec celle de la CI ;
  - la ligne de diagnostic du simulateur, à la suite du message d'un problème : « Erreur : … · Version du site : 0.3.59 ». Sans problème, la ligne reste vide et masquée, comme avant ;
  - le message d'un chargement en échec (demande de Julien du 15 novembre 2026) : « La scène n'a pas pu être chargée. Version du site : 0.3.59. » (« The scene could not be loaded. Site version: 0.3.59. »). Le message d'un chargement en cours ne change pas ;
  - le texte du message d'un navigateur sans WebGL (même demande) : « Ce navigateur ne permet pas d'afficher la scène 3D (WebGL indisponible). Version du site : 0.3.59. ». Ce message n'est pas visible à l'écran, avant comme après ce changement : le canevas masqué garde toute la hauteur du viseur et pousse le message sous le bas de la fenêtre (constat COD-11 de l'audit, à corriger au Sujet 10 du plan ; mesuré de nouveau pour cette version à 1280 × 800 et sur l'iPhone 14 émulé). Sans WebGL, la version se lit dans la fenêtre des crédits.
- `app/scripts/version.mjs` : le seul lecteur de ce titre, commun aux deux constructions. `app/vite.config.ts` donne le numéro au simulateur par l'option `define` de Vite (`app/src/version.ts`) ; `app/scripts/build-pages.mjs` l'écrit dans le pied de l'accueil. Si le changelog n'a aucun titre « ## [X.Y.Z] - AAAA-MM-JJ », ou si le premier est mal formé, le lecteur échoue et la construction s'arrête : ni numéro vide ni « undefined » à l'écran. `app/scripts/version.d.mts` déclare ses types pour `vite.config.ts` ; `app/tsconfig.json` ne change pas.
- Ce qui n'est pas fait :
  - le numéro est écrit sans date : la date du titre est celle de la section du changelog, pas celle de la publication ;
  - les fiches, la page des licences et l'activité de LUM-02 n'affichent pas la version : le plan ne la demande pas là ;
  - dans « Version du site : 0.3.59 », l'espace devant les deux-points est une espace ordinaire : sur le Pixel 7 et l'iPhone 14 émulés, le message d'un chargement en échec tient sur trois lignes, et la coupure tombe juste avant les deux-points sur l'iPhone 14 avec la police de la machine de Claude, sur le Pixel 7 avec celle de la CI ;
  - `app/package.json` garde `"version": "0.0.0"` : il n'est pas la source de la version ;
  - aucun contrôle de la version n'est ajouté à la routine de test, le plan n'en demandant pas. Essais faits pour cette version dans Chromium en rendu logiciel, sur des écrans émulés (ordinateur, Pixel 7, iPhone 14) : rien sur un vrai téléphone, avec un processeur graphique ni dans Safari.

### Modifié

- Le numéro étant écrit dans le script du simulateur, le nom de ce fichier (`assets/simulateur-<empreinte>.js`, 4,18 Mo, 984 ko en gzip d'après Vite) change désormais à chaque version, même quand le code du simulateur ne change pas. Constaté sur des constructions hors dépôt : les versions 0.3.57 et 0.3.58 donnaient le même site, fichier pour fichier ; depuis cette version, changer le seul premier titre de version du changelog change le nom du script, et avec lui `simulateur/index.html` et la liste du bouton « Télécharger les ressources du simulateur » de l'accueil ; la feuille de style et l'activité de LUM-02 gardent leur nom. Effet sur le cache du navigateur : non mesuré. On ne sait pas si le navigateur réutilisait auparavant le script d'une version à l'autre : les en-têtes de GitHub Pages n'ont pas été lus (un agent de relecture l'a tenté : refus 403 du proxy de la session).
- `docs/etat-des-travaux.md` : Sujet 1 fait, sujet suivant (Sujet 2), où lire la version à l'écran pour juger une version sur un téléphone ; règle de branche sur `main` posée par Julien le 15 novembre 2026, et ce que Claude en a lu (`main` est dite protégée par la liste des branches ; le contenu de la règle n'a pas été relu) ; les deux échecs de la routine pendant ce sujet, leurs causes et leurs corrections, et ce que le Sujet 2 garde d'INT-17 ; un défaut de la fenêtre des crédits antérieur à cette version, non corrigé (son bouton « Fermer » sous la partie visible à l'ouverture).
- `docs/propositions.md` : section 5, les choix faits par Claude pour ce sujet, dont trois questions pour Julien, ses réponses, et les choix faits en les appliquant.
- `docs/tests-a-faire-faire.md` : un test de plus à faire sur un vrai téléphone (T3, l'écran de revue ouvert en haut).
- `docs/audit/README.md` : trois notes datées, aux Sujets 2, 10 et 42, sur ce que cette version fait d'INT-17, de COD-11 et d'INT-20.
- `docs/etat-des-travaux.md` et `docs/historique.md` : les décisions de Julien du 15 novembre 2026 (les 14 décisions de l'audit qui bloquaient un sujet, le retrait de l'anglais, les réglages de GitHub, les questions de ce sujet) et son mandat du même soir : finir la V1 en reprenant tout ce que l'audit a remonté, puis la V2, puis une V3 d'ergonomie et d'interface sans changement fonctionnel, Claude travaillant seul.
- `CLAUDE.md` : trois règles réécrites d'après ce mandat (Claude décide et Julien confirme après ; Claude crée la session suivante après chaque fusion quand Julien n'est pas là ; les tests avec des débutants ne bloquent pas) et une ligne qui renvoie au mandat. Rédaction de Claude, à confirmer (`docs/propositions.md`, section 5).
- `docs/pile-technique.md` (la version à l'écran, dans l'organisation du site ; le contrôle de la profondeur de champ et celui de l'écran de revue, dans la liste des contrôles de la routine), `docs/historique.md`.

### Corrigé

- Écran de revue (constat INT-17 de l'audit, `docs/audit/interface.md` ; la part « défilement gardé », que le plan mettait au Sujet 2) : chaque vue s'ouvre en haut de l'écran de revue, la photo visible (`app/src/ui/shutter.ts`). L'écran de revue gardait le défilement de la vue d'avant, même masqué entre deux photos : sur un petit écran, après « Infos » ou un défilement jusqu'à « Revenir au viseur », la photo suivante s'ouvrait le haut coupé. Et la photo n'avait aucune hauteur tant qu'elle n'était pas chargée : quand Chromium rendait une image entre l'affichage de l'écran de revue et le chargement de la photo, son ancrage du défilement ajoutait la hauteur de la photo au défilement gardé, et la photo sortait de l'écran (iPhone 14 émulé, police de la CI, photo retardée de 300 ms : défilement de 36 px devenu 154 px ; après la correction, 0 px). La remise à zéro vaut pour la photo suivante, la loupe, « Photo entière », les vues d'une rafale et le message d'erreur. Mesuré sur le même écran : la fenêtre de la loupe, coupée en haut de 24 px avant, s'ouvre entière. Contrepartie, mesurée aussi : dans une rafale, après « Vue suivante », l'écran de revue revient en haut, sur la photo, et le bouton repasse sous la partie visible ; avant, le bouton restait en place et la photo restait hors de l'écran. Pour le message d'erreur, aucun essai ne montre de différence : sur cet écran, il tenait déjà sans défilement. Essayé dans Chromium, sur des écrans émulés ; pas dans Safari.
- Fenêtre « Crédits » : elle s'ouvre en haut à chaque ouverture, là où est la ligne de version. Elle gardait le défilement de l'ouverture d'avant : à 1280 × 800, en français, fermée par son bouton du bas puis rouverte, elle s'ouvrait défilée de 115 px sur le site construit depuis `main` (version 0.3.58) et, pendant ce travail, la ligne de version déjà passée au-dessus de la liste, de 148 px, ce qui cachait cette ligne (police de la machine de Claude ; constat INT-20 de l'audit, corrigé ici pour cette seule fenêtre ; les autres attendent le Sujet 42 du plan). Sur le Pixel 7 et l'iPhone 14 émulés, elle se rouvrait déjà en haut : à l'ouverture, Chromium donne le focus au premier lien de la liste et fait défiler la fenêtre pour le montrer, ce qui, sur ces deux écrans, la ramenait à 0 px (essai : sans rien de focalisable dans la fenêtre, le défilement est gardé sur les trois écrans).
- Routine de test, contrôle « profondeur de champ du viseur » (`scripts/test_app.cjs`) : les deux mesures de netteté se font appareil déplacé à x = −6 m par la vue de dessus, puis l'appareil est ramené au départ ; le critère n'a pas changé (netteté avec l'effet inférieure à 60 % de la netteté sans l'effet). Appareil au point de départ, la zone mesurée n'était pas vide : dans la fenêtre de 1280 × 800, la tête de Sophia y entre pendant une partie de son animation et le promeneur la traverse, et l'horloge de la scène avance entre les deux mesures. Le contrôle pouvait donc échouer avec l'effet en place (CI du 15 novembre 2026, profil ordinateur : « 1.40 avec, 2.34 sans » ; refait à des instants choisis : 1,87 et 2,35) et réussir sans effet (effet retiré : 2,35 et 7,64). Corrigé, il mesure le même fond aux deux mesures (sans l'effet : 2,79 à 1280 × 800, à chaque passage ; sur l'iPhone 14 émulé avec la police de la CI, 4,17 ou 4,18 en trois passages ; avec la police de la machine de Claude, 3,57 sur cet écran et 2,08 sur le Pixel 7 émulé, un passage chacun) et il échoue quand l'effet est retiré (à 1280 × 800 : 2,79 et 2,79 ; Pixel 7 émulé : 2,07 et 2,07 ; iPhone 14 émulé : 4,18 et 4,18). Sur les petits écrans, la routine déplie la vue de dessus le temps des deux mesures ; les contrôles qui suivent gardent leurs valeurs.
- Routine de test, contrôle ajouté, « photo suivante : écran de revue ouvert en haut » : après une première photo, « Infos » et « Revenir au viseur », la photo suivante s'ouvre sans défilement, son haut dans l'écran de revue. Sur le site d'avant la correction, il échoue sur le profil iphone (défilement de 154 px dans la condition provoquée). Le contrôle « zones écrêtées posées sur la photo », qui échouait par intermittence sur ce profil dans la CI (il lisait l'en-tête au centre de la photo, sortie de l'écran), n'est pas modifié.

## [0.3.58] - 2026-11-15

### Ajouté

- `docs/audit/` : audit du travail fait avant le 12 novembre 2026, demandé par Julien. Douze rapports (modèle physique ; fiches d'exposition ; fiches de mise au point ; architecture de l'application ; choix et outils ; sources ; contenu du référentiel ; structure du référentiel ; code ; interface ; documentation ; licences, scripts et CI), chaque constat avec sa preuve et le verdict d'un autre agent qui a essayé de le réfuter (un second agent ; un troisième pour les neuf constats que le second a ajoutés) : 186 constats, 160 confirmés, 26 réfutés. Onze rapports sont nouveaux ; celui du modèle physique est modifié (voir plus bas).
- `docs/audit/README.md` : synthèse de l'audit et plan de corrections en 48 sujets, un par pull request ; 37 décisions qui attendent Julien ; réglages de GitHub que lui seul peut faire.
- `docs/audit/` garde aussi les scripts des deux workflows d'agents, les consignes des agents, les outils de la synthèse (index des constats et de leurs verdicts, contrôles de couverture du plan) et les quatre fiches de lot de la synthèse (`docs/audit/synthese/`, documents de travail).

### Modifié

- `CLAUDE.md` : règle de reprise (Julien, 13 novembre 2026). Chaque pull request fusionnée suffit à repartir d'une session neuve ; un seul sujet à la fois, poussé dès son premier commit ; `/clear` après chaque fusion ; seuls les constats d'audit contre-vérifiés sont corrigés.
- `docs/audit/modele-physique.md`, ajouté par la version 0.3.57 avec 20 constats non contre-vérifiés : contre-vérification écrite sous chaque constat, un constat ajouté par le second agent (PHY-21) ; 20 confirmés, 1 réfuté (PHY-16).
- `docs/etat-des-travaux.md` : état après l'audit, sujet suivant (Sujet 1 du plan de corrections), ce qui attend Julien. `docs/historique.md`.

## [0.3.57] - 2026-11-12

### Ajouté

- `docs/audit/modele-physique.md` : premier rapport de l'audit demandé par Julien le 12 novembre 2026 (20 constats, pas encore contre-vérifiés) ; `docs/specifications/balance-des-blancs.md` (fonction reportée) ; point d'état du 13 novembre en tête de `docs/etat-des-travaux.md`.
- Histogrammes et hautes lumières sur l'écran de revue (MES-06, « Histogramme » ; MES-07, « Alertes de surexposition et zébras »). Sous chaque photo, un bouton « Infos » fait défiler trois affichages, comme la commande DISP des boîtiers à la lecture : photo seule (par défaut), histogrammes, hautes lumières. Le choix est mémorisé et vaut pour les photos suivantes, pour chaque vue d'une série et pour la loupe.
  - « Histogrammes » : quatre histogrammes sous la photo réduite, dans l'ordre du Nikon Z 6 et du Sony A7 III (luminance, rouge, vert, bleu), le noir à gauche ; une ligne de texte donne la part des pixels dont au moins une couche est à la valeur maximale.
  - « Hautes lumières » : ces pixels clignotent en noir sur la photo, une seconde en noir, une seconde visibles, sans prendre les touchers, qui ouvrent toujours la loupe. Sans pixel à la valeur maximale, la photo ne change pas et le texte le dit.
  - Avec la loupe, histogrammes, part et zones portent sur la partie affichée, comme sur le Z 6.
  - Sources : pages « Photo Information » et « g6: Highlight Display » du manuel du Z 6, pages « Switching the screen display » et « List of icons on the monitor » du guide de l'A7 III.
  - Choix de TutoPhoto, non sourcés, à confirmer par Julien (`docs/propositions.md`, section 4) : la formule de la luminance (0,2126 R + 0,7152 V + 0,0722 B, sur les valeurs de la photo), l'échelle verticale des histogrammes, le seuil à 255, le clignotement pour tous les boîtiers et son rythme, un bouton qui fait défiler trois affichages.
  - Non simulé : l'histogramme en direct dans le viseur et les zébrures à la prise de vue, renvoyés à une autre version ; l'alerte des zones sous-exposées de Sony ; les réglages d'image du boîtier.
- Fiches MES-06 et MES-07, en français et en anglais : ce que disent Nikon et Sony de l'histogramme, des hautes lumières et des zébrures ; les affichages du simulateur, leurs calculs et ce qui n'est pas simulé ; deux exercices dans le parc (trois photos à −2, 0 et +2 IL ; exposer le plus clair possible sans faire clignoter le haut blanc de Sophia). Leurs situations ne sont pas rédigées : la brique « situation réelle » leur manque.
- `data/sources.yaml` : onze sources (pages « Photo Information », « g6: Highlight Display » et « Camera Controls » du Z 6, pages « Switching the screen display », « List of icons on the monitor » et « Zebra Setting » de l'A7 III, avec leurs versions françaises quand les fiches les citent ; article « sRGB » de Wikipedia).
- Routine de test, avec `--photo` : ni histogramme ni clignotement par défaut ; quatre histogrammes dont la somme des colonnes égale le nombre de pixels de la photo ; part écrêtée et zones posées sur la photo pour une photo surexposée de 3,2 IL ; aucune zone et luminance à gauche pour une photo sous-exposée de 3,2 IL ; retour à « photo seule ».
- `docs/specifications/histogramme-revue.md` : la spécification de la fonction, écrite par Claude sans Julien, avec les écarts de la mise en œuvre.

### Modifié

- Écran de revue : le bouton « Infos » s'ajoute sous la photo ; la légende et le bulletin descendent d'une ligne.
- `docs/camera-physique.md` (section « Histogrammes et hautes lumières sur l'écran de revue (version 0.3.57) »), `docs/propositions.md` (section 4 : onze choix à confirmer), `docs/questions-ouvertes.md`, `docs/historique.md`, `docs/etat-des-travaux.md`, `README.md`.
- `docs/dossiers/viseur-aides.md` : sections 3 et 4 relues à la source le 12 novembre 2026, rien à corriger, trois phrases ajoutées.

## [0.3.56] - 2026-11-12

### Ajouté

- Grilles de cadrage dans le viseur (CMP-02, « Tiers, centre, symétrie »). Dans la fenêtre « Aperçu », un groupe « Grille de cadrage » : « Aucune » (par défaut), « Tiers (3 × 3) », « Seize cases (4 × 4) », « Vingt-quatre cases (6 × 4) » ou « Tiers et diagonales ». Les mêmes grilles pour tous les boîtiers (décision de Julien du 12 novembre 2026) : celles que les manuels lus nomment ou montrent.
  - « Tiers » : deux lignes verticales et deux lignes horizontales, aux tiers du cadre, d'après le texte de Sony pour « Rule of 3rds Grid » sur les A7 III et A6000 (« grid lines that divide the image into thirds », guides d'aide de Sony).
  - « Seize cases » : trois lignes dans chaque sens, aux quarts du cadre, comme sur l'illustration de l'affichage « Framing grid » du Nikon D5600 (page Digitutor de Nikon).
  - « Vingt-quatre cases » et « Tiers et diagonales » : les grilles « 6x4 » et « 3x3+diag » de Canon (manuels des EOS 850D et EOS R6, boîtiers voisins de ceux du simulateur). Le sens de la première (six cases sur le grand côté) et le tracé des diagonales sont déduits du nom et de l'icône du menu.
  - La grille suit le cadre du viseur, laisse les touchers au viseur, et son choix est mémorisé avec les interrupteurs de l'aperçu ; il ne dépend pas de l'interrupteur général.
  - Décisions de Julien du 12 novembre 2026 (`docs/propositions.md`, section 4) : mêmes grilles pour tous les boîtiers ; grille masquée quand la loupe agrandit l'image ; pas de grille sur la photo ni sur l'écran de revue.
  - Non simulé : le quadrillage du Nikon Z 6, dont le manuel ne décrit pas le tracé ; les grilles « Square Grid » et « Diag. + Square Grid » de Sony.
- Fiche CMP-02, en français et en anglais : ce que disent Nikon et Sony de la grille, la règle des tiers d'après Wikipedia (source secondaire), les grilles du simulateur, et un exercice dans le parc (Sophia sur une ligne des tiers, puis au centre). Les pages lues ne disent pas quand centrer ni comment composer une image symétrique : la fiche l'écrit.
- `data/sources.yaml` : dix sources (réglages d9 et f2 du Z 6, d9 en français, « Grid Line » de l'A7 III en anglais et en français, « Grid Line » de l'A6000, page Digitutor du D5600, pages des manuels des Canon EOS 850D et EOS R6, article « Rule of thirds » de Wikipedia).
- Jalon de la V1 minimale : CMP-02 ajoutée (17 notions), et citée dans la fiche de SIT-01 (décision de Julien du 12 novembre 2026).
- Routine de test : aucune ligne par défaut ; quatre lignes à 1/3 et 2/3 du cadre pour « Tiers », six à 1/4, 1/2 et 3/4 pour « Seize cases », à 1 pixel près ; six cases sur le grand côté et quatre sur le petit pour « Vingt-quatre cases » ; deux diagonales sur tout le cadre pour « Tiers et diagonales » ; choix écrit dans `tutophoto.apercu` ; grille masquée par la loupe à 100 %, puis revenue.
- `docs/specifications/grilles.md` : la spécification de la fonction, écrite par Claude pendant que Julien dormait.

### Modifié

- `docs/camera-physique.md` (section « Grilles de cadrage (version 0.3.56) »), `docs/propositions.md` (section 4 : choix proposés par Claude, tranchés par Julien), `docs/questions-ouvertes.md`, `docs/historique.md`, `docs/etat-des-travaux.md`, `README.md`.
- `docs/dossiers/viseur-aides.md` : section 1 relue à la source le 12 novembre 2026, rien à corriger.

## [0.3.55] - 2026-11-12

### Corrigé

- Progression du chargement du simulateur : les cinq textes de licence du manifeste (`license.txt`), que la scène ne charge pas, étaient comptés parmi les fichiers attendus. Tous les autres fichiers reçus, le message restait sur « 34 / 34 Mio reçus » au lieu de « fichiers reçus, préparation », et après une minute la liste des fichiers en attente pouvait nommer ces textes. Ils ne sont plus comptés, comme dans le pré-téléchargement de l'accueil.

### Ajouté

- Routine de test : tout fichier compté par la progression doit avoir été chargé par la scène.

### Modifié

- `docs/pile-technique.md`, `docs/historique.md`, `docs/etat-des-travaux.md`.

## [0.3.54] - 2026-11-12

### Ajouté

- Workflow `routine.yml` : la CI lance la routine de test (`scripts/test_app.cjs --photo`) sur chaque pull request qui touche `app/`, `content/`, `data/` ou la routine, avec un job par profil (ordinateur, Android, iPhone, WebGL 1), en parallèle. Sur la machine de Claude, les quatre profils à la suite occupaient les quatre cœurs pendant 53 minutes (mesuré le 11 novembre 2026).

- `docs/etat-des-travaux.md` : où on en est, la file de travail, la méthode, comment reprendre, ce qui attend Julien. Demandé par Julien le 12 novembre 2026, pour pouvoir reprendre à tout moment ; mis à jour à chaque pull request.
- `docs/dossiers/` : trois dossiers de sources écrits dans la nuit par des agents de Claude (aides du viseur, balance des blancs, nouvelles scènes), avec citations et adresses. Ils ne sont pas encore relus à la source par un second agent, et le disent en tête.

### Corrigé

- Routine de test : le contrôle des collimateurs reprenait un cadre du viseur mesuré plus tôt, en AF-S. Avec la police de la CI, plus large, l'aide de la mise au point prend une ligne de plus en AF-S qu'en AF-C et le viseur change de hauteur : le contrôle échouait sur le profil iPhone (« repère à 98,0 % × 5,3 % », reproduit sur la machine de Claude avec la police DejaVu Sans). Le cadre est maintenant mesuré au moment du contrôle. Le changement de hauteur du viseur reste à corriger (`docs/etat-des-travaux.md`).
- Routine de test : le contrôle de la progression du chargement relisait le message par un second appel, après l'attente ; le chargement pouvait finir entre les deux et le message se vider. Vu une fois sur la machine de Claude le 11 novembre 2026, puis dans la CI le 12, les deux fois sur le profil WebGL 1. Le texte est maintenant rendu par l'attente elle-même, et la raison d'un échec est gardée.
- Routine de test : quand le déroulement d'un profil s'arrête sur une erreur, le message garde le journal d'appel de Playwright et l'état de la page (fenêtres ouvertes, posemètre, message affiché), au lieu de la première ligne seule. Dans la CI, il n'y a pas d'écran pour voir ce qui bloque.

### Modifié

- `CLAUDE.md` : la routine est lancée par la CI ; ses quatre jobs doivent être verts avant la fusion. Chaque pull request met à jour l'état des travaux.
- `docs/pile-technique.md`, `docs/historique.md` (dont la demande de Julien de la nuit du 11 au 12 novembre 2026 : continuer le développement complet).

## [0.3.53] - 2026-11-11

### Modifié

- Densité du viseur plafonnée à 2 (demande de Julien du 11 novembre 2026 : la version 0.3.52 est « beaucoup moins pixelsé », mais saccadée sur son téléphone). Babylon.js calcule 4 fois plus de pixels qu'à la taille en pixels CSS, au lieu d'environ 6,9 sur un écran de densité 2,625 et 9 sur un écran de densité 3. Les écrans de densité 2 ou moins ne changent pas. Version isolée : si elle ne convient pas, on l'annule par `git revert -m 1` de son commit de fusion.
- Routine de test : le rendu doit valoir la taille affichée multipliée par la densité de l'écran, plafonnée à 2.
- `docs/pile-technique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.52] - 2026-11-11

### Modifié

- Viseur calculé à la densité de l'écran, sans plafond (demande de Julien du 11 novembre 2026 : la scène paraissait pixelisée sur son téléphone). Babylon.js calculait l'image à la taille en pixels CSS, que le navigateur agrandissait d'environ 2,6 fois sur un téléphone. Le nombre de pixels calculés par image est multiplié par la densité au carré. Version isolée : si la fluidité ne suit pas, on l'annule par `git revert -m 1` de son commit de fusion.
- Loupe : « 100 % » reste un photosite par pixel CSS.
- Routine de test : le rendu doit valoir la taille affichée multipliée par la densité de l'écran.
- `docs/pile-technique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.51] - 2026-11-11

### Ajouté

- Progression du chargement dans le simulateur : « Chargement de la scène… 12 / 34 Mio reçus · 45 s », puis, après une minute, les fichiers encore attendus. Suite au chargement sans fin signalé par Julien le 11 novembre 2026, en données mobiles.
- Bouton « Télécharger les ressources du simulateur » sur l'accueil (proposé par Julien) : barre de progression en direct, Mio reçus, pourcentage, temps, débit mesuré en Mbit/s, puis un bilan avec les fichiers en échec et un bouton pour les réessayer. Les fichiers vont dans le cache ordinaire du navigateur (option A, choisie par Julien).
- Routine de test : le bouton de l'accueil ; le simulateur ouvert à une adresse sans barre finale, avec sa progression.

### Corrigé

- Une adresse sans barre finale (`…/simulateur`, `…/activites/LUM-02`) laissait la page sans code ni scène quand le serveur ne redirigeait pas : la page ajoute la barre elle-même.

### Modifié

- `docs/pile-technique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.50] - 2026-11-11

### Ajouté

- Activité interactive de LUM-02 (lumière dure ou douce), en schéma 2D (décision de Julien du 11 novembre 2026), sous `activites/LUM-02/` :
  - une vue de côté avec une source, un objet et un mur ; curseurs pour la taille de la source et sa distance à l'objet ;
  - l'ombre pleine et la pénombre dessinées sur le mur, avec trois valeurs : taille apparente de la source, largeur de la pénombre (taille × distance objet–mur ÷ distance source–objet, par triangles semblables) et hauteur de l'ombre pleine ;
  - trois exemples (petite lampe, grande fenêtre, réflecteur), dont les valeurs sont choisies pour l'activité ;
  - deux questions, corrigées d'après le guide Lowel de Tiffen.
- Bouton « Faire l'activité » sur la fiche LUM-02, à la place d'« Ouvrir le simulateur ».
- Routine de test : l'activité, sur les quatre profils.

### Modifié

- Fiche LUM-02 (FR et EN) : la section « Activité » décrit l'activité de TutoPhoto, et garde l'activité à faire chez soi.
- Construction : seconde passe de Vite pour les activités (`app/vite.activites.config.ts`).
- Sources `wikipedia-umbra-penumbra`, `tiffen-lowel-soft-light` et `pvc-adams-soft-light` : rattachées à la fiche et au code de l'activité.
- `docs/contenus.md`, `docs/pile-technique.md`, `docs/propositions.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.49] - 2026-11-11

### Modifié

- Décisions de Julien du 11 novembre 2026 sur les propositions, consignées dans `docs/propositions.md` et `docs/questions-ouvertes.md` :
  - activité de LUM-02 en schéma interactif 2D ;
  - protocole de test tel quel, avec 5 testeurs ;
  - extension seulement si tous les testeurs réussissent chaque défi sans aide et répondent mieux après qu'avant ;
  - ordre de travail après les tests tel quel.
- `docs/historique.md`.

## [0.3.48] - 2026-11-11

### Ajouté

- `docs/propositions.md`, propositions de Claude à trancher par Julien, rien n'étant construit :
  - trois formes pour l'activité interactive de LUM-02 (schéma en 2D recommandé) ;
  - un protocole de test avec les débutants : nombre, déroulé, relevé anonyme, critères pour étendre ;
  - un ordre de travail après la V1 minimale, avec ce que Julien a déjà renvoyé en V2.
- Sources `wikipedia-umbra-penumbra` et `wikipedia-angular-diameter` (secondaires), citées dans les propositions.

### Modifié

- `docs/questions-ouvertes.md` renvoie aux propositions ; README ; `docs/historique.md`.

## [0.3.47] - 2026-11-11

### Ajouté

- Bouton « Jouer le défi » sur la fiche de chaque situation qui a un défi : il ouvre le simulateur avec ce défi choisi (`simulateur/?defi=SIT-05`).
- Fenêtre de fiche par-dessus le simulateur (décision de Julien du 11 novembre 2026) : les notions « À revoir » du bulletin et le bouton « Fiche » de chaque défi l'ouvrent, sans perdre la scène ni les réglages. Les liens vers d'autres fiches restent dans la fenêtre ; les sources s'ouvrent dans un nouvel onglet ; un lien mène à la page complète.
- Routine de test : bouton « Jouer le défi », défi choisi par l'adresse, fiche ouverte depuis le bulletin puis depuis un lien de la fiche, fiche ouverte depuis la fenêtre « Défis ».

### Modifié

- `docs/contenus.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.46] - 2026-11-11

### Ajouté

- Accueil à la racine du site, avec les trois portes d'entrée : « Je suis en situation » (les trois situations et leurs fiches), « Je m'entraîne » (le simulateur, avec le poids de la scène calculé d'après son manifeste) et « J'apprends » (les seize notions, par domaine).
- Fiches des notions et des situations publiées sur le site, en français et en anglais (`fiches/fr/`, `fiches/en/`), produites à la construction depuis `content/` par `app/scripts/build-pages.mjs`. Les codes de notions et de situations deviennent des liens ; la fiche d'une notion liste ses situations.
- Bandeau « Fiche en cours de relecture » sur chaque fiche non relue, et marque « en relecture » sur l'accueil (décision de Julien du 11 novembre 2026). `data/relecture.yaml` liste les fiches relues ; son schéma et sa cohérence sont contrôlés par `scripts/validate.py`.
- Lien « Accueil » dans l'en-tête du simulateur.
- Routine de test : liens internes de toutes les pages, accueil (langue, bouton de langue), fiche NET-01 (bandeau, bouton du simulateur), sans défilement horizontal, sur les quatre profils.

### Modifié

- Le simulateur passe sous `simulateur/` (décision de Julien du 11 novembre 2026) ; ses chemins vers la scène et les licences sont relatifs à ce dossier.
- `docs/contenus.md`, `docs/pile-technique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.45] - 2026-11-11

### Ajouté

- Couverture de l'autofocus du Sony A7 III (MAP-06). Sony donne seulement « 693 phase-detection AF points covering approx. 93% of image area » (page de Sony Inde relevée par Julien), sans répartition entre largeur et hauteur. TutoPhoto partage cette surface également : √0,93 ≈ 96,4 % de chaque côté. Ce partage n'est pas sourcé ; Julien l'a retenu le 11 novembre 2026.
- Source `sony-ilce-7m3-af`, rattachée à MAP-06.
- Routine de test : couverture du Sony A7 III, en cadre horizontal et vertical ; un seul contrôle sert désormais aux deux boîtiers.

### Modifié

- Fiche MAP-06 (FR et EN), `docs/camera-physique.md` (les phrases qui disaient la couverture des cinq autres boîtiers non lue), `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.44] - 2026-11-11

### Ajouté

- Workflow `description.yml` : le titre et la description de chaque pull request passent par `scripts/check_public.py`, à chaque création ou modification. Ils ne sont pas dans git, et l'outil GitHub de Claude met un lien de session dans le pied de la description à la création.
- Option `--pull-request` de `scripts/check_public.py` : contrôle le titre et la description lus dans le fichier de l'événement GitHub. Les passer par des variables d'environnement les aurait écrits en clair dans le journal d'Actions, public.
- `docs/publication.md` : constat du 11 novembre 2026. 21 descriptions de pull requests (#15 à #49) contenaient le lien de la session ; il en a été retiré sur décision de Julien. Le journal du premier passage du contrôle, qui l'affichait, a été supprimé.

### Modifié

- `CLAUDE.md` : réécrire la description de chaque pull request aussitôt après sa création.

## [0.3.43] - 2026-11-11

### Ajouté

- Couverture de l'autofocus par boîtier (MAP-06) : le Canon EOS RP couvre 88 % du cadre en largeur et 100 % en hauteur (« 88% horizontal and 100% vertical coverage », fiche de Canon Royaume-Uni relevée par Julien) ; en cadrage vertical, les deux côtés s'échangent. Les boîtiers dont la couverture n'est pas chiffrée gardent celle du Z 6.
- Sources `canon-eos-rp-af` et `sony-ilce-6000-af` (« covering almost the entire image », sans pourcentage).
- Routine de test : couverture du Canon EOS RP, en cadre horizontal et vertical.

### Modifié

- Le point de mise au point est ramené dans la zone couverte quand le boîtier ou le cadrage change ; le déclencheur lit le point du boîtier virtuel au lieu d'en garder une copie.
- Source `canon-eos-rp-pixels` : capteur et définition confirmés par la fiche relevée par Julien.
- Fiche MAP-06, `docs/camera-physique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.42] - 2026-11-11

### Modifié

- Fiche EXP-06 (ISO), en français et en anglais : le bruit qui vient surtout du manque de lumière, l'écrêtage d'un cran de hautes lumières par cran d'ISO, et la définition de l'invariance ISO, d'après l'article de Richard Butler sur DPReview (« What is ISO invariance, and should I care? »), dont Julien a relevé le texte (le site refuse les lectures automatiques).
- Fiche EXP-06 : les deux familles de bruit (photonique, de la scène ; de lecture, de l'appareil) et le coût des ISO étendus simulés, d'après l'article de Spencer Cox sur Photography Life (« ISO Invariance Explained »), relevé par Julien.
- Sources `dpreview-iso-invariance` et `pl-iso-invariance` complétées et rattachées à la fiche ; `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.41] - 2026-11-11

### Modifié

- Couverture de l'autofocus par boîtier, décision de Julien du 11 novembre 2026 : celle du Z 6 pour la V1 minimale ; les hybrides Sony A7 III, Sony A6000 et Canon EOS RP à ajouter une fois leurs chiffres lus sur les pages officielles ; les reflex en V2 (`docs/camera-physique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`).

## [0.3.40] - 2026-11-11

### Ajouté

- Fiche de LUM-02 (lumière dure ou douce), en français et en anglais : explication d'après le guide Lowel de Tiffen et un article d'Art Adams (ProVideo Coalition, 2011), activité à faire chez soi (l'activité interactive dans TutoPhoto reste à construire), exercice sur le portrait doux. Sources `tiffen-lowel-soft-light` et `pvc-adams-soft-light`.

### Modifié

- Plan de la fiche de situation confirmé par Julien le 11 novembre 2026 (`docs/contenus.md`).
- Relecture des contenus : Julien et une relectrice qu'il a désignée (`docs/questions-ouvertes.md`).
- Couverture : 12 notions sur 191, 12 sur 16 dans le jalon de la V1 minimale.
- Sources de EXP-06 : DPReview et Photography Life refusent les lectures automatiques (403), même avec le proxy ouvert ; noté dans `docs/questions-ouvertes.md`.
- README, `docs/historique.md`.

## [0.3.39] - 2026-11-11

### Ajouté

- Fiches de 15 notions de la V1 minimale, en français et en anglais (`content/fr/notions/`, `content/en/notions/`) : EXP-04, EXP-05, EXP-06, MES-04, MES-10, BOI-07, BOI-08, BOI-12, MAP-04, MAP-05, MAP-06, MAP-09, NET-01, NET-06, MVT-01. Chaque fiche a son explication sourcée, son simulateur (ce que fait TutoPhoto et ce qu'il ne simule pas) et son exercice, adapté à la scène de parc quand celui du référentiel n'y est pas jouable ; chaque chiffre est calculé.
- Fiches des trois situations (SIT-01, SIT-05, SIT-06), en français et en anglais : cadre, recette écrite à la main (le solveur est en V2), défi, notions.
- Plan de la fiche de situation dans `docs/contenus.md`.

### Modifié

- Sources rattachées aux fiches qui les citent ; EXP-04, EXP-05, EXP-06 et MVT-01 reçoivent leurs sources dans le référentiel.
- Couverture : 11 notions sur 191, 11 sur 16 dans le jalon de la V1 minimale, et 3 situations sur 3. EXP-04, EXP-05, EXP-06 et MES-04 n'ont pas encore leur situation réelle (leurs situations ne sont pas dans la V1 minimale) ; LUM-02 attend une source fiable.
- README, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.38] - 2026-11-11

### Ajouté

- Défis des trois situations de la V1 minimale, validés par Julien le 11 novembre 2026, choisis dans la fenêtre « Défis » de l'en-tête :
  - SIT-01 : l'œil de Sophia net, le fond derrière elle hors de la zone nette ;
  - SIT-05 : Dennis, Sophia, Fabienne et Percy dans la zone nette ;
  - SIT-06 : le chien dans le cadre, net et figé.
- Bulletin sous chaque photo : exposition, zone nette, bruit au point visé, traînée des sujets en mouvement ; avec un défi, chaque critère, réussi ou manqué, et les notions à revoir.
- Critères tirés de mesures déjà sourcées : zone nette et flou acceptable (diagonale / 1500), traînée comparée au même flou acceptable.
- Routine de test : bulletin sous la photo ; défi SIT-05 réussi à f/8 ; défi SIT-01 à reprendre à f/22, le fond photo restant net (zone nette jusqu'à l'infini).

### Modifié

- L'écran de revue défile quand le bulletin dépasse la hauteur du viseur.
- `docs/camera-physique.md` (section « Défis et bulletin »), `docs/historique.md`, README.

## [0.3.37] - 2026-11-10

### Ajouté

- Vue de dessus (NET-01) : encart du viseur avec l'appareil, le champ de l'objectif, le plan de mise au point, la zone nette entre deux plans perpendiculaires à l'axe, les personnages et les objets, cerclés de vert dans la zone nette ; replié sur petit écran.
- Appareil déplaçable (NET-06) : toucher la carte place l'appareil, dans une zone de 12 m sur 11 m devant le groupe ; « Retour au départ ».
- Routine de test : appareil reculé de 4 m sur la carte, distance mesurée augmentée d'environ 4 m, puis ramenée.

### Modifié

- Zone nette calculée par un module commun (`camera/sharpZone.ts`), pour l'indicateur d'équilibre et la vue de dessus.
- Source `wikipedia-circle-of-confusion` rattachée à NET-01 et NET-06.
- `docs/camera-physique.md` (section « Vue de dessus et appareil déplaçable »), `docs/historique.md`, README.

## [0.3.36] - 2026-11-10

### Ajouté

- Modes d'exposition, correction d'exposition et ISO auto (BOI-07, BOI-08, MES-04, MES-10), décision de Julien du 10 novembre 2026, d'après le manuel du Nikon Z 6 :
  - fenêtre « Exposition », ouverte en touchant l'indicateur d'exposition : sélecteur de mode M, A (Auto à priorité ouverture), S (Auto à priorité vitesse), correction de −5 à +5 IL par tiers, contrôle de la sensibilité auto, sensibilité maximale, vitesse d'obturation minimale ;
  - en A et S, l'appareil choisit la vitesse ou l'ouverture ; hors de ses limites, elle clignote avec l'indicateur ;
  - ISO auto : en M, exposition visée de ISO 100 au plafond ; en A, hausse seulement sous la vitesse minimale ; en S, quand l'ouverture ne suffit plus ; plancher et règle en A tirés du manuel du D850, le manuel du Z 6 ne les donnant pas ;
  - en M, la correction ne déplace que l'indicateur, sauf avec l'ISO auto ;
  - légende de la photo : mode, réglages retenus, ISO auto et correction.
- Sources `nikon-z6-mode-dial`, `nikon-z6-mode-dial-fr`, `nikon-z6-indicators`, `nikon-z6-exposure-compensation`, `nikon-z6-exposure-compensation-fr`, `nikon-z6-iso-button`, `nikon-z6-iso-settings`, `nikon-z6-iso-settings-fr`, `nikon-z6-defaults`, `nikon-d850-auto-iso`, rattachées à BOI-07, BOI-08, MES-04 et MES-10.
- Routine de test : exposition par défaut (M, ISO auto), mode A (vitesse qui suit l'ouverture, qui clignote au-delà de 1/4000 s), mode S (ouverture qui clignote à f/1.4, puis ISO auto), M avec ISO auto et correction, légende de la photo.

### Modifié

- Réglages par défaut du Z 6 (page « Defaults » du manuel) : ISO auto activé ; AF-S au lieu d'AF-C ; Continu L à 3 vues par seconde, retardateur de 10 s et détection des visages et des yeux, déjà retenus, désormais sourcés.
- L'indicateur d'exposition devient un bouton (« M · −0,2 IL ») : il ouvre la fenêtre « Exposition » sans ajouter de bouton, qui réduirait le viseur sur téléphone.
- `docs/camera-physique.md` (section « Modes d'exposition, correction et ISO auto », mise au point, détection, déclenchement), `docs/historique.md`, README.

## [0.3.35] - 2026-11-10

### Modifié

- Découpage de la V1 minimale, décisions de Julien du 10 novembre 2026 sur le bilan présenté par Claude :
  - BOI-07 (priorité à l'ouverture), BOI-08 (priorité à la vitesse) et MES-04 (correction d'exposition) entrent dans le jalon `v1-min`, avec l'ISO auto (MES-10) ;
  - LUM-02 : simulateur en V2, activité interactive en V1 (`activity: true`), le fond de la scène de parc étant une photo par ciel couvert ;
  - solveur de situations en V2 : les recettes des trois situations sont écrites à la main dans leur fiche (notes du jalon).
- `docs/cadrage.md` (section « Découpage du 10 novembre 2026 »), `docs/historique.md`, `docs/questions-ouvertes.md`, `docs/camera-physique.md` (plan).

## [0.3.34] - 2026-11-10

### Ajouté

- Collimateurs (MAP-06), demande de Julien du 10 novembre 2026, d'après Nikon pour le Z 6 (273 points en point sélectif, couverture d'environ 90 % du cadre en largeur et en hauteur) :
  - le point de mise au point reste dans la zone couverte ; un toucher hors de cette zone le ramène sur son bord ;
  - zones larges et zone automatique rognées à la zone couverte ; la détection ne retient que les yeux qui s'y trouvent ;
  - zone couverte tracée en pointillés dans le viseur, loupe comprise (aide de TutoPhoto) ;
  - pas de grille : la disposition des 273 points n'est pas sourcée.
- Sources `nikon-z6-launch-2018`, `nikon-z6-eisa-2019` et `nikon-z6-product`, rattachées à MAP-06 avec `nikon-z6-focus`.
- Routine de test : un toucher dans le coin du cadre place le point à 5 % des bords, et la zone tracée fait 90 % × 90 % du cadre.

### Modifié

- Source `nikon-z6-focus` : déplacement du point au sélecteur secondaire ou multidirectionnel, réglage a5 (non simulés).
- `docs/camera-physique.md` (section « Collimateurs », zones larges et zone automatique), `docs/historique.md`, README.

## [0.3.33] - 2026-11-10

### Ajouté

- Modes de déclenchement (BOI-12), demande de Julien du 10 novembre 2026, d'après le manuel du Nikon Z 6 :
  - vue par vue, Continu L (1 à 5 vues par seconde), Continu H (5,5), Continu H (étendu) (12), retardateur (2, 5, 10 ou 20 s) ;
  - rafale tant que le déclencheur est tenu, une vue par intervalle, jamais plus vite que la durée de pose ; chaque vue à son instant et avec l'orientation de l'appareil alors ; mise au point refaite à chaque vue en AF-C, verrouillée sur la première en AF-S ;
  - série à trier dans l'écran de revue (« Vue 2/5 · +0,20 s ») ; 20 vues au plus par rafale, pour le temps de calcul.
- Sources `nikon-z6-release-mode` et `nikon-z6-release-mode-fr`, rattachées à BOI-12.
- Routine de test : rafale en Continu L à 5 vues par seconde, vues espacées de 0,2 s.

### Modifié

- Le déclencheur réagit à l'appui (et non plus au clic), avec capture du pointeur : le relâchement arrive au bouton même si son texte (nombre de vues) change sa taille sous le curseur, ce qui coupait la rafale à une vue sur le profil iPhone. Au clavier, un clic vaut un appui bref.
- Toucher du viseur : sa durée se mesure avec l'horodatage des événements, pour qu'une image longue entre l'appui et le relâchement ne le change pas en glissé (échec ponctuel de la routine sur Android).
- `docs/camera-physique.md` (section « Modes de déclenchement »), `docs/historique.md`, README.

## [0.3.32] - 2026-11-10

### Ajouté

- Figer le mouvement (MVT-01, « traînée mesurée en pixels ») : la ligne « vitesse » de l'indicateur d'équilibre donne aussi la traînée du sujet visé en pixels de la photo (traînée sur le capteur × 1500 / largeur du capteur), par exemple environ 8 px pour le chien à 1/100 s.
- Routine de test : la traînée du chien à 1/4000 s est sous 1 px.

### Modifié

- Fluidité du viseur jugée bonne par Julien sur son Google Pixel 8 Pro (10 novembre 2026) : `docs/camera-physique.md`, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.31] - 2026-11-10

### Ajouté

- Indicateur d'équilibre entre ouverture, vitesse et ISO, au point visé : forme B choisie par Julien (un triangle dans lequel un point bouge), avec des seuils sourcés seulement (principe du 10 novembre 2026) :
  - ouverture : zone nette, sans jugement, tirée de la formule du cercle de confusion avec le flou acceptable d/1500 ;
  - vitesse : traînée du sujet visé (chien, promeneur) comparée au même flou acceptable ;
  - ISO : rapport signal sur bruit au point visé, seuils 40:1 (excellent) et 10:1 (acceptable) de la norme des sensibilités numériques ;
  - le point part vers le réglage qui dépasse ; bloc repliable « Limites et lecture » ; interrupteur dans la fenêtre « Aperçu » ;
  - dans le viseur, en haut à gauche ; sur petit écran, le triangle seul, et les lignes au toucher.
- Source `wikipedia-circle-of-confusion` ; `wikipedia-film-speed` complétée (vitesse fondée sur le bruit).
- Routine de test : viseur d'au moins 35 % de la hauteur de la fenêtre ; indicateur aux réglages par défaut ; bruit au même point du sol à ISO 100 puis à ISO 6400 ; traînée du chien évaluée.

### Modifié

- Sujets en mouvement de la scène : identifiant et vitesse orientée, pour la traînée ; identifiant du visage suivi dans la cible de la zone automatique.
- `docs/camera-physique.md` (section « Indicateur d'équilibre »), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.30] - 2026-11-10

### Modifié

- `CLAUDE.md` : principe de Julien du 10 novembre 2026. On n'implémente que ce qui est sourcé ; le but est que des débutants découvrent la photo et maîtrisent leur boîtier et les bases, pas d'en faire des professionnels ; ce critère tranche les questions de conception.
- `docs/cadrage.md` : le texte complet de Julien et ce qu'il tranche, dont les deux questions sur l'indicateur d'équilibre (profondeur de champ montrée sans jugement, bougé de la main exclu tant qu'il n'est ni sourcé ni simulé).
- `docs/historique.md`, `docs/questions-ouvertes.md`, `docs/camera-physique.md`.

## [0.3.29] - 2026-11-09

### Ajouté

- AF zone automatique et détection des yeux (MAP-09), décision de Julien du 9 novembre 2026, d'après le manuel du Nikon Z 6 :
  - réglage « Détect. visage-yeux AF zone auto » : visages et yeux, visages seulement, animaux (le chien), désactivé ;
  - un œil est vu s'il est dans le cadre et si rien ne le cache ; seuils de taille du visage choisis pour TutoPhoto ; œil le plus proche de l'appareil ;
  - toucher le viseur choisit le visage le plus proche du point touché, que l'appareil suit ensuite ;
  - sans visage, le sujet le plus proche du cadre (règle du manuel du Nikon COOLPIX P1100, faute de texte pour le Z 6) ;
  - repère ambre autour de l'œil ou du visage, vert une fois verrouillé ; « œil », « visage » ou « sujet le plus proche » dans le viseur et la légende.
- Yeux des personnages : os du squelette pour Sophia et Nathan ; placés par visée sur le modèle pour Dennis, Fabienne, Percy et le chien, puis vérifiés par reprojection.
- Routine de test : œil détecté dans le groupe, sujet le plus proche sans détection, œil du chien en détection des animaux.
- Sources `nikon-z6-a4`, `nikon-z6-a4-fr`, `nikon-p1100-af-area`, rattachées à MAP-09.
- Serveur de développement seulement : accès `window.__tutophoto` (scène, caméra, horloge) pour les mesures, absent du site construit.

### Corrigé

- La carte de profondeur du viseur gardait la taille du canevas à sa création (Babylon ne la redimensionne pas) ; elle suit désormais le canevas, par exemple quand on tourne le téléphone.

### Modifié

- `docs/camera-physique.md` (section « Détection des yeux et zone automatique »), `docs/pile-technique.md` (tests, mesures sur la scène), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.28] - 2026-11-09

### Modifié

- `CLAUDE.md` : mot d'ordre de Julien du 9 novembre 2026, le réalisme partout. TutoPhoto est une sandbox de simulation pour s'entraîner : à chaque choix, le comportement le plus réaliste, sourcé, et ce qui ne l'est pas est dit.
- `docs/camera-physique.md` (décisions), `docs/historique.md` : ce mot d'ordre, et l'accord de Julien sur la détection des yeux (MAP-09).

## [0.3.27] - 2026-11-09

### Ajouté

- Modes de zone AF (MAP-05), décision de Julien du 9 novembre 2026, d'après le manuel du Nikon Z 6 :
  - AF point sélectif, comme avant ;
  - AF zone large (S) et (L) : mise au point sur le sujet le plus proche de la zone ; zones carrées de 10 % et de 20 % du grand côté du cadre, choisies pour TutoPhoto faute de source ; repère à la taille de la zone mesurée.
- Fenêtre « Mise au point » : mode (AF-S, AF-C) et mode de zone, avec les termes du manuel en français. Le bouton du boîtier l'ouvre et affiche les deux (« AF-C · Point »).
- Routine de test : la zone large (L) retient un sujet plus proche que le point sélectif au même endroit.
- Source `nikon-z6-focus-fr` ; `nikon-z6-focus` complétée (zone large, déclencheur tactile) ; les deux rattachées à MAP-05.

### Modifié

- Sans verrou, la photo prend la distance mesurée par l'autofocus du viseur au déclenchement, avec le mode de zone choisi.
- Zone dans l'indicateur du viseur et dans la légende de la photo.
- `docs/camera-physique.md` (section « Modes de zone AF »), `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.26] - 2026-11-09

### Ajouté

- AF ponctuel ou continu (MAP-04), décision de Julien du 9 novembre 2026 (« suivons ta reco »), d'après les manuels du Nikon Z 6 et du Sony α9 :
  - bouton « AF-S / AF-C » du boîtier, AF-C par défaut, choix mémorisé ;
  - toucher le viseur tient lieu de déclencheur à mi-course. En AF-S, la distance est mesurée au point touché et reste verrouillée jusqu'au toucher suivant, repère du point en vert ; la photo garde cette distance. En AF-C, la distance suit le point choisi ;
  - indicateur dans le viseur (« AF-S · verrouillée à 6,5 m ») et mode dans la légende de la photo.
- Routine de test : contrôle du verrou en AF-S (distance gardée en relevant l'appareil, puis sur la photo) et du suivi en AF-C.
- Sources `nikon-z6-focus` et citations de `sony-a9-focus-mode`, rattachées à MAP-04.

### Modifié

- La carte de profondeur du viseur passe de la profondeur de champ à l'autofocus. Aperçu de la profondeur de champ coupé, elle n'est plus rendue qu'avant chaque mesure.
- `docs/camera-physique.md` : section « Mise au point », décisions de Julien du 9 novembre 2026 (moment de la balance des blancs, des grilles et de l'histogramme ; forme de l'indicateur d'équilibre ; ordre des modes de mise au point) ; `docs/questions-ouvertes.md`, `docs/historique.md`, README.

## [0.3.25] - 2026-11-09

### Corrigé

- Chargement bloqué si un des fichiers de code chargés à la demande n'arrive pas : « Failed to fetch dynamically imported module », constaté sur le téléphone de Julien, avec un réseau instable, pour un shader de Babylon.js pourtant publié. Le site tient désormais en un seul fichier JavaScript (4,1 Mo, environ 950 ko compressé) au lieu de 324.

- Grain du flou du viseur sur les petits écrans : au moins 64 échantillons par pixel, sans dépasser 170, et même spirale pour tous les pixels. Le défaut est apparu au contrôle de la profondeur de champ de la routine sur iPhone : 9,01 de netteté avec l'effet, contre 8,84 sans.
- Flou ajouté par la mi-résolution compensé (0,92 pixel² de variance par axe) : 11,5 à 11,75 px mesurés pour 10,9 px attendus au 70 mm à f/2, contre 12,0 à 12,25 px sans la compensation.

### Modifié

- `docs/pile-technique.md`, `docs/historique.md`, `docs/camera-physique.md`.

## [0.3.24] - 2026-11-09

### Modifié

- `docs/camera-physique.md` : fonctions demandées par Julien le 9 novembre 2026, avec leur notion du référentiel et leur équivalent sur le Sony A7 III :
  - balance des blancs, grilles de composition et histogramme, dont la place avant ou après les tests de la V1 minimale reste à décider ;
  - correction de la photo après la prise, en V2 ;
  - équilibre entre ouverture, vitesse et ISO, et modes de mise au point, en discussion.
- Plan de mise en œuvre : BOI-12 désigne les modes d'entraînement, pas le flou de bougé.
- `docs/questions-ouvertes.md`, `docs/historique.md` ; source du guide d'aide Sony ILCE-7M3 complétée.

## [0.3.23] - 2026-11-09

### Modifié

- Profondeur de champ du viseur : flou en disque de taille physique, écrit pour TutoPhoto, à la place de l'effet de Babylon.js (décision de Julien du 9 novembre 2026, option B) :
  - diamètre du flou calculé avec la formule de la photo, en pixels du canevas, loupe comprise, plafonné à 64 px ;
  - flou par « scatter-as-gather » en une passe (Dennis Gustafsson, 2018, lu dans l'exemple 45-bokeh de bgfx), à mi-résolution, puis recomposition en pleine résolution ;
  - un fond flou ne déborde pas sur un sujet net ; un premier plan flou déborde sur un fond net ;
  - poids du pixel central corrigé (pas / 2 au lieu de 1), pour que les petits flous aient leur taille ;
  - spirale arrêtée au plus grand flou présent dans l'image : calcul presque gratuit aux réglages courants.
- Mesures : 10,5 à 11 px pour 10,9 px attendus (70 mm, f/2) ; 57,25 px pour 58,7 px attendus (135 mm, f/1.4), en forme de disque.
- Routine de test : délais allongés pour le rendu logiciel.
- `docs/camera-physique.md`, `docs/historique.md`, `docs/questions-ouvertes.md` ; téléphone de Julien : Google Pixel 8 Pro, Chrome.

### Ajouté

- Sources : billet de Dennis Gustafsson (copie archivée) et exemple 45-bokeh de bgfx.

### Corrigé

- `docs/camera-physique.md` : la section de profondeur de champ portait le numéro 0.3.21 au lieu de 0.3.22, resté de la renumérotation.
- CI : le téléchargement de gitleaks, qui a renvoyé une erreur 504 trois fois le 9 novembre 2026, est retenté jusqu'à cinq fois (`curl --retry 5 --retry-delay 10 --retry-all-errors`).

## [0.3.22] - 2026-11-09

### Ajouté

- Profondeur de champ approchée dans le viseur (`app/src/camera/viewfinderDof.ts`) :
  - effet de profondeur de champ de Babylon.js, alimenté par une carte de profondeur propre au viseur, sol compris ;
  - mise au point continue sur le point choisi ;
  - `lensSize` calé pour qu'un cercle de confusion de 1 corresponde au flou maximal mesuré de l'effet, 24 px, loupe comprise ;
  - case « Profondeur de champ (approchée) » dans la fenêtre « Aperçu », en marche par défaut ;
  - effet retiré pendant le calcul de la photo.
- Routine de test : contrôle de la profondeur de champ du viseur (fond flou au 135 mm à f/1.4, net sans l'effet), mesuré sur une zone de fond du cadre ; capture de cet état.

### Modifié

- `docs/camera-physique.md` : fonctionnement, mesure du flou maximal (19,75 à 28,5 px selon l'écran et la zone, 24 px retenus), écart à mi-course (environ −9 %), limites. `docs/questions-ouvertes.md`, `docs/pile-technique.md`, README.

## [0.3.21] - 2026-11-09

### Corrigé

- Viseur déformé : le moteur n'était redimensionné qu'au changement de taille de la fenêtre, pas quand le canevas changeait de taille avec le panneau du boîtier. Le rendu était étiré et le cadre perdait les proportions du capteur, avec par exemple un rapport de 2,08 au lieu de 1,50 sur un iPhone émulé. Le moteur suit désormais la taille du canevas.

### Ajouté

- Routine de test : contrôle que le rendu a la taille affichée et que le cadre a les proportions du capteur.

### Modifié

- `docs/camera-physique.md` : cause, mesures avant et après ; le bruit du viseur, remesuré, atteint 98 à 105 % du modèle (88 à 92 % sur le rendu étiré).

## [0.3.20] - 2026-11-09

### Corrigé

- Photo noire sur les appareils sans WebGL 2. Les textures du calcul (côtés qui ne sont pas des puissances de 2) étaient en répétition, avec un filtrage qui attend des mipmaps ; elles étaient donc incomplètes en WebGL 1. Elles sont désormais bornées aux bords et filtrées sans mipmaps. Le lissage près des bords ne prend plus de pixels du bord opposé.

### Modifié

- `docs/camera-physique.md` : cause et correction.

## [0.3.19] - 2026-11-09

### Ajouté

- Routine de test sur ordinateur et sur mobile, `scripts/test_app.cjs` : profils ordinateur, Android, iPhone et sans WebGL 2, en émulation (Playwright, Chromium en rendu logiciel). Elle vérifie le chargement, l'absence de problème affiché, le bruit du viseur, l'interrupteur de l'aperçu, la loupe, la photo et la loupe de l'écran de revue.

### Modifié

- `CLAUDE.md` : la routine est lancée avant toute pull request qui touche `app/`. `docs/pile-technique.md` : outil, profils, contrôles et limites.

## [0.3.18] - 2026-11-09

### Corrigé

- Chargement sans fin de la scène sur certains appareils : Babylon attend que les post-traitements de la caméra soient prêts, et un shader du bruit du viseur qui ne compile pas bloquait le chargement. Le bruit du viseur n'est attaché qu'une fois compilé ; en cas d'échec, le viseur reste sans bruit.
- Calcul de la photo : attend la compilation de ses shaders ; une erreur de compilation s'affiche dans la légende au lieu d'une photo noire.

### Ajouté

- Diagnostic à l'écran, pour les téléphones sans console : erreurs JavaScript, shader du bruit indisponible, scène affichée après 30 s sans être déclarée prête (avec les objets en attente).

### Modifié

- `docs/camera-physique.md`, `docs/historique.md`, `docs/questions-ouvertes.md`.

## [0.3.17] - 2026-11-09

### Ajouté

- Loupe du viseur (bouton « Loupe ») : 50 % puis 100 % (un pixel du canevas pour un photosite), centrée sur le point de mise au point, que le toucher déplace ; rotation ralentie d'autant ; bruit à l'échelle du grossissement. La photo couvre toujours tout le cadre.
- Loupe de l'écran de revue : toucher la photo recalcule une fenêtre à 100 % autour du point touché, au même instant, avec la même orientation et la même mise au point ; « Photo entière » pour revenir.
- Définition du capteur en pixels, calculée à partir des pixels effectifs et des dimensions du capteur.

### Modifié

- Bruit à 100 % : moins d'un photosite de chaque couleur par pixel, le modèle garde le bruit d'un photosite seul.
- `docs/camera-physique.md` : loupe, vérification du bruit à 50 % et à 100 %, limites (fond à 360° flou à 100 %). `docs/questions-ouvertes.md`, README.

## [0.3.16] - 2026-11-09

### Ajouté

- Aperçu dans le viseur réglable (bouton « Aperçu ») :
  - un interrupteur général et un par effet (luminosité, bruit), en marche par défaut, mémorisés dans le navigateur ;
  - coupé, le viseur reste correctement exposé et sans bruit : il faut lire la cellule et anticiper ;
  - luminosité coupée et bruit en marche : le bruit est celui de l'image réelle, ramené à une exposition correcte ;
  - bandeau dans le viseur qui dit ce qui n'est pas montré ;
  - la photo garde toujours tous les effets.

### Modifié

- `docs/camera-physique.md` : aperçu dans le viseur, réglages équivalents des Sony A7 III et Nikon Z 6, vérification ; décisions du 9 novembre 2026 sur la visibilité du bruit. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.15] - 2026-11-09

### Ajouté

- Bruit numérique physique, sur la photo et dans le viseur (`app/src/camera/noise.ts`) :
  - bruit de photons et bruit de lecture, en électrons, à partir de la capacité des photosites et du bruit de lecture mesurés par William J. Claff (PhotonsToPhotos) pour chacun des six boîtiers ;
  - bruit coloré selon la matrice de Bayer : rouge et bleu plus bruités que le vert ;
  - bruit brut, sans réduction de bruit ;
  - dans le viseur, nouveau tirage à chaque image ; retiré pendant le calcul de la photo, qui ajoute le sien.
- Définition des six capteurs (pixels effectifs), avec leurs sources.

### Modifié

- `docs/camera-physique.md` : fonctionnement, vérification (bruit mesuré dans le viseur contre bruit prévu) et visibilité du bruit ; temps de calcul de la photo mesurés sur le téléphone de Julien. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.14] - 2026-11-08

### Ajouté

- Photo calculée au déclenchement, par accumulation de rendus (`app/src/camera/photo.ts`) :
  - profondeur de champ exacte, avec le disque d'ouverture élargi de S / (S − f) pour retrouver la formule des lentilles minces ;
  - flou de mouvement ;
  - moyenne en lumière linéaire, puis exposition, écrêtage au blanc et courbe de Babylon ;
  - nombre de rendus selon le flou (16 à 256, 5 s au plus), puis lissage selon la profondeur.
- Mise au point en touchant le viseur : point marqué, distance lue au déclenchement.
- Bouton « Déclencher », barre de calcul, écran de revue (réglages, distance de mise au point, rendus, durée) et enregistrement de la photo en JPEG.
- Projection du sol de la photo à 360° sur un plan, pour que le sol garde sa distance dans la photo calculée.

### Modifié

- Positions et animations des sujets calculées à partir d'une horloge de scène, pour placer la scène à n'importe quel instant du temps de pose.
- `docs/camera-physique.md` : fonctionnement, vérifications et limites de la photo calculée. `docs/historique.md`, `docs/questions-ouvertes.md`, README.

## [0.3.13] - 2026-11-08

### Ajouté

- Boîtier virtuel minimal, première étape de la caméra physique :
  - réglages par tiers de diaphragme : ouverture de f/1.4 à f/22, vitesse de 30 s à 1/4000 s, ISO de 100 à 6400 ;
  - focale de 18 à 200 mm (objectif virtuel), marque et format (plein format ou APS-C) parmi les six boîtiers de référence ;
  - cellule qui affiche l'écart à l'exposition correcte, en IL, pour une scène calée sur EV₁₀₀ = 12,5 ;
  - aperçu de l'exposition dans le viseur : la lumière est multipliée par 2^écart, rapport vérifié sur le site construit.
- Viseur aux proportions du capteur, avec le champ de vue calculé à partir du capteur et de la focale.
- Neuf sources : échelles d'ouvertures, de vitesses et d'ISO (Wikipedia), caractéristiques du Nikon Z 6 et du Sony A7 III (manuels lus), dimensions des capteurs des quatre autres boîtiers (extraits de recherche, pages non ouvertes).

### Modifié

- `docs/camera-physique.md` : dimensions des capteurs d'après les constructeurs, crans par tiers et libellés non sourcés des vitesses intermédiaires, objectif virtuel, description du boîtier virtuel. `docs/historique.md`, README.
- La caméra 3D n'a plus de champ fixe de 50 mm : le boîtier virtuel le règle.

## [0.3.12] - 2026-11-08

### Ajouté

- `docs/camera-physique.md` : décisions du 8 novembre 2026 sur la caméra physique (effets approchés dans le viseur, photo exacte par accumulation de rendus au déclenchement ; plein format ou APS-C ; bruit physique ; trois paires de boîtiers de référence) et modèle proposé, sourcé : exposition d'après Filament, étalonnage de la scène sur EV₁₀₀ = 12,5, profondeur de champ, flou de mouvement, bruit d'après les mesures de PhotonsToPhotos. Plan de mise en œuvre en quatre pull requests.
- Onze sources dans `data/sources.yaml` : les six de la caméra physique, et cinq citées depuis la version 0.3.9 sans y avoir été versées (texte CC BY 4.0, licence de Poly Haven, API de téléchargement de Sketchfab, gros fichiers sur GitHub, historique des modifications sur GitHub).

### Modifié

- `docs/historique.md`, `docs/pile-technique.md`, `docs/questions-ouvertes.md` (méthode de rendu du flou de mouvement tranchée pour la photo), README.

## [0.3.11] - 2026-11-08

### Modifié

- `docs/publication.md` : décision de Julien sur la fuite du 8 novembre 2026, les descriptions des pull requests #1 à #14 restent en l'état.

## [0.3.10] - 2026-11-08

### Ajouté

- Scène de parc : quatre personnages de Renderpeople sous CC BY 4.0 (Dennis, Sophia, Fabienne & Percy, face à l'appareil, et Nathan, qui marche au fond), textures réduites de 8192 à 2048 px ; le malamute de striderrotk (CC BY 4.0), qui galope derrière le groupe. Scène portée à 34,4 Mio.
- Vitesses de marche et de galop mesurées dans les animations, pour que les pieds ne glissent pas ; calculs dans `docs/historique.md` et `app/src/scene.ts`.
- Crédits CC BY affichés avec l'auteur, la page d'origine, la licence et la modification apportée ; `license.txt` de Sketchfab gardé à côté de chaque modèle.

### Modifié

- Composition : groupe à 6,5 m, appareil un peu plus incliné vers le bas, banc et poubelles reculés.
- Chaque modèle est chargé sous un nœud porteur, qui garde la conversion de repère faite par Babylon.
- `docs/questions-ouvertes.md` : droit à l'image des personnes scannées par Renderpeople (non tranché), charge des personnages sur téléphone, vitesse du chien. `docs/historique.md`, `docs/licences.md`, README.

## [0.3.9] - 2026-11-08

### Ajouté

- Scène de parc, premier état : fond et éclairage tirés de la photo à 360° autumn_hockey (Greg Zaal), banc (Kirill Sannikov) et poubelles (GurJas Studios), tous trois de Poly Haven, sous CC0. Fichiers dans `app/public/scenes/parc/` (18,4 Mio).
- Appareil fixe au point de prise de vue de la photo, qui tourne au doigt ou à la souris, avec le champ d'un 50 mm sur plein format le long du grand côté de l'écran ; ombres de contact douces sous les objets.
- Bouton « Crédits » : auteurs, licences et pages d'origine des éléments de la scène, en français et en anglais.
- Manifeste de scène `scene.json` et son schéma `schemas/scene.schema.json`. `scripts/check_scenes.py`, lancé par la CI, vérifie les licences (CC0 ou CC BY), que chaque fichier est listé avec sa taille et son empreinte SHA-256, et les limites de taille (25 Mio par fichier, 100 Mio par scène, provisoires).
- Dépendance `@babylonjs/loaders` 9.35.0 (Apache-2.0), pour charger les modèles glTF.

### Corrigé

- `scripts/check_public.py` contrôle aussi les messages de commit, et reconnaît les liens de session et d'artefact Claude (claude.ai/code/…). Les 28 commits déjà publiés avec un tel lien sont listés dans `scripts/check_public_historique.txt`, sans réécriture de l'historique ; fuite décrite dans `docs/publication.md`. `CLAUDE.md` interdit ces liens dans les commits et les pull requests.

### Modifié

- Décisions du 8 novembre 2026 dans `docs/historique.md` et `docs/questions-ouvertes.md` : fond photo à 360° au lieu d'arbres 3D, trop lourds ; compte Sketchfab pour télécharger les personnages ; chien stylisé qui court pour SIT-06, Shiba Inu retiré. Points à surveiller du fond photo (hautes lumières écrêtées, fond à l'infini, hauteur de prise de vue, mémoire sur téléphone).
- `docs/licences.md` : format des crédits de scène et limites de taille ; `docs/pile-technique.md` : chargement glTF et composition de la scène.
- README : état au 8 novembre 2026 (96 sources, scène affichée), rôle de `app/public/scenes/` et de `scripts/check_scenes.py`. `CLAUDE.md` : lancer `scripts/check_scenes.py` avant toute pull request qui touche les scènes.
- Page des licences du site : `@babylonjs/loaders` et crédits de la scène.

## [0.3.8] - 2026-11-07

### Modifié

- `LICENSE` : titulaire du copyright, Julien Touzeau. `CLAUDE.md`, `docs/publication.md` et `docs/licences.md` en tiennent compte.
- Décisions consignées dans `docs/questions-ouvertes.md` et `docs/historique.md` : scène de parc entièrement en modèles et textures sous CC0 ou CC BY ; fichiers lourds stockés dans le dépôt, avec un contrôle de taille en CI à venir.

## [0.3.7] - 2026-11-07

### Modifié

- Site en ligne sur GitHub Pages (https://badmiaoo.github.io/TutoPhoto/) : adresse ajoutée aux README et à `CLAUDE.md`.
- `CLAUDE.md` et `docs/historique.md` : Julien autorise Claude à gérer la configuration de ce dépôt, et de lui seul.

## [0.3.6] - 2026-11-07

### Ajouté

- `scripts/check_public.py` : refuse secrets (clés privées, jetons d'API aux formats connus, mots de passe en clair), données personnelles (adresses électroniques hors « noreply », téléphones), liens vers des ressources privées et chemins locaux nominatifs dans les fichiers suivis, ainsi que les adresses de commit qui ne sont pas « noreply ».
- CI : job `confidentialite`, qui lance ce contrôle sur tout l'historique des commits, puis gitleaks 8.30.1 (binaire de la release officielle, vérifié par son empreinte SHA-256) sur tout l'historique git.
- `docs/publication.md` : ce qui ne doit jamais être publié, les contrôles, que faire en cas de fuite.
- Trois sources : gitleaks, recherche de secrets et protection des pushes dans la documentation GitHub.

### Modifié

- `CLAUDE.md` : règles du dépôt public.
- `REPRISE.md` : lien vers le Claude Doc d'origine, privé, retiré de la version courante.
- README, `docs/questions-ouvertes.md`, `docs/historique.md`.

## [0.3.5] - 2026-11-07

### Ajouté

- Squelette de l'application dans `app/` : TypeScript 7.0.2, Vite 8.3.6, Babylon.js 9.35.0 (versions épinglées). Une scène de départ (sol, sphère de repère, caméra orbitale), une interface en français et en anglais avec un choix de langue mémorisé, et une page `licences/` qui reprend la licence et le `NOTICE.md` de Babylon.js ainsi que les licences du projet.
- CI : le job `app` de `validate.yml` vérifie les types et construit le site à chaque pull request.
- Workflow `pages.yml` : publication sur GitHub Pages à chaque fusion sur `main`, ou à la main.
- Trois sources : @babylonjs/core, Vite et TypeScript dans le registre npm.

### Modifié

- README (lancer l'application), `CLAUDE.md`, `docs/pile-technique.md` (outillage), `docs/licences.md` (code de tiers dans le site publié), `docs/historique.md`, `.gitignore`.

## [0.3.4] - 2026-11-07

### Ajouté

- `docs/pile-technique.md` : comparaison de three.js, Babylon.js, PlayCanvas et three-gpu-pathtracer pour la V1 minimale (licence, profondeur de champ, flou de mouvement, glTF, API graphique), prise en charge de WebGL2 et WebGPU par les navigateurs, trois options. Constats tirés du code source de chaque moteur à sa dernière version publiée. Décision de Julien : Babylon.js.
- Huit sources : les quatre moteurs, three-mesh-bvh, xatlas-web, les données de compatibilité de MDN et le texte de la licence Apache-2.0.

### Modifié

- `docs/questions-ouvertes.md`, `docs/historique.md` et `CLAUDE.md` : pile technique tranchée (Babylon.js) ; README : liste des documents.

## [0.3.3] - 2026-11-07

### Modifié

- Décisions du 7 novembre 2026 consignées dans `docs/questions-ouvertes.md`, `docs/historique.md`, `CLAUDE.md` et les README : nom du projet TutoPhoto ; hébergement sur GitHub Pages d'abord, comme site statique ; testeurs de la V1 minimale pris dans l'entourage de Julien ; scène de parc décidée avec la pile technique.

### Ajouté

- Source `github-pages-limits` : limites de GitHub Pages (taille, bande passante, déploiement, usage).

## [0.3.2] - 2026-11-07

### Ajouté

- `LICENSE` (MIT) pour le code, `LICENSES/CC-BY-SA-4.0.txt` pour les contenus et les données ; textes repris du dépôt de référence SPDX.
- `docs/licences.md` : ce qui est sous quelle licence, ce que cela implique, règles pour les modèles et textures 3D de tiers (CC0 ou CC BY uniquement).
- Trois sources : textes SPDX de MIT, de CC BY-SA 4.0 et de CC0 1.0.

### Modifié

- README, `CLAUDE.md`, `docs/questions-ouvertes.md` et `docs/historique.md` : licences tranchées.

## [0.3.1] - 2026-11-07

### Ajouté

- `data/jalons.yaml` et son schéma : premier jalon `v1-min`, la V1 minimale décidée le 7 novembre 2026 (scène de parc). Il couvre SIT-01, SIT-05 et SIT-06, et 13 notions : leurs 10 notions clés, plus l'ouverture, la vitesse et l'ISO (EXP-04, EXP-05, EXP-06).
- `scripts/validate.py` contrôle les jalons : identifiants existants et non retirés, pas de doublon, et toutes les notions clés des situations du jalon présentes.
- `scripts/coverage.py` donne la couverture de chaque jalon.

### Modifié

- `docs/lire-le-referentiel.md`, `CLAUDE.md` et les README mentionnent les jalons.

## [0.3.0] - 2026-11-07

Décisions du 7 novembre 2026 : boîtiers reflex et hybrides uniquement, scènes en 3D de synthèse dès la V1, plus de découpage V1/V2, V1 minimale testée d'abord (scène de parc : SIT-01, SIT-05, SIT-06).

### Retiré

- Champ `version` (V1, V1→V2, V2) des 191 notions et des 49 situations : toutes relèvent de la V1. Les identifiants `SIT-V2-NN` restent tels quels.
- Champ `capture` des 42 situations qui l'avaient, et sa règle : il décrivait des captures 2.5D.
- `docs/v2-3d.md`, sans objet.
- Contrôles de `validate.py` propres aux versions (notion clé V2 dans une situation V1, notion V2 renvoyant à une situation V1).

### Modifié

- Introductions des domaines et spécifications des simulateurs qui décrivaient la 2.5D ou opposaient V1 et V2 (CMP-01, CMP-05, CMP-06, CMP-07, CMP-14, LUM-02, LUM-03, LUM-04, LUM-07, LUM-09, LUM-14, LUM-16, LUM-18, MVT-08, MVT-11, NET-06, OPT-01, OPT-06, OPT-12, OPT-13, OPT-17) ; chantiers des domaines MAP, MVT et LUM, désormais liés au choix du moteur de rendu 3D.
- BOI-28 : reflex ou hybride uniquement.
- Règle `flash` des situations, sans référence aux captures.
- Source `petschnigg-2004` : plus citée par les données, renvoi à `docs/historique.md`.
- Schémas, `validate.py` et `coverage.py` sans le champ `version` ; `coverage.py` compte les notions par domaine et par niveau.
- `docs/cadrage.md`, `docs/questions-ouvertes.md`, `docs/lire-le-referentiel.md` mis à jour ; `docs/architecture.md` marqué en partie caduc jusqu'au choix de la pile technique ; décisions consignées dans `docs/historique.md`.
- `CLAUDE.md` et les README : public, 3D de synthèse, V1 minimale ; la règle « pas de 3D avant la maquette 2.5D » devient « pas d'extension avant d'avoir testé la V1 minimale ».

## [0.2.4] - 2026-11-07

### Corrigé

- `scripts/changelog.py tag --github` traite toutes les versions au lieu de s'arrêter au premier refus. Le troisième passage de `tag.yml` a créé l'objet tag de `v0.2.0`, mais GitHub a refusé sa référence au jeton du workflow (HTTP 403, « Resource not accessible by integration »). Hypothèse non vérifiée : GitHub refuse ces références quand les fichiers de workflow du commit visé diffèrent de ceux de `main`, ce qui est le cas des anciennes versions.
- Un refus 403 sur une version devient un avertissement, avec la commande pour poser le tag à la main dans le résumé de l'exécution. Le workflow n'échoue que si la version la plus récente reste sans tag.

## [0.2.3] - 2026-11-07

### Corrigé

- Les tags sont créés par l'API de GitHub et non plus par `git push`. Le deuxième passage du workflow `tag.yml` a affiché la cause du refus : GitHub n'autorise pas le jeton d'un workflow, qui n'a pas le droit `workflows`, à pousser un tag dont le commit contient des fichiers de workflow.

### Ajouté

- Une release GitHub par version, avec le texte de sa section du changelog (`scripts/changelog.py tag --github`).

### Modifié

- `tag.yml` ne garde plus d'identifiants git après le checkout (`persist-credentials: false`).

## [0.2.2] - 2026-11-07

### Corrigé

- `scripts/changelog.py` affiche la sortie de git quand une commande échoue. Le premier passage du workflow `tag.yml`, après la fusion de 0.2.1, a trouvé les bons commits (`v0.2.0` sur `804a2de`, `v0.2.1` sur `3bd4ae0`), mais l'envoi du tag a échoué sans dire pourquoi.

### Ajouté

- Le workflow `tag.yml` peut aussi être relancé à la main (`workflow_dispatch`).

## [0.2.1] - 2026-11-07

### Ajouté

- `scripts/changelog.py` : `check` contrôle le format du changelog et, sur une pull request, qu'elle ajoute une version plus récente sans retirer de version publiée ; `tag` pose le tag annoté de chaque version qui n'en a pas, sur le commit de `main` qui a introduit sa section.
- Workflow `.github/workflows/tag.yml` : lance `scripts/changelog.py tag --push` à chaque mise à jour de `main`. La session de travail de Claude ne peut pas pousser de tags ; ce workflow les pose à sa place, et rattrape `v0.2.0`.

### Modifié

- Le workflow de validation contrôle aussi le changelog.
- `CLAUDE.md` et ce changelog décrivent la pose des tags par le workflow.

## [0.2.0] - 2026-11-07

Première version : le dépôt reprend le brouillon de référentiel v0.2 de `REPRISE.md`, tel quel, avec de quoi le contrôler.

### Ajouté

- `REPRISE.md`, fichier de reprise du 7 novembre 2026, gardé tel quel comme archive. C'est un brouillon, à remettre en question.
- Référentiel v0.2 dans `data/`, extrait de `REPRISE.md` sans retouche : 191 notions en 13 domaines (177 V1, 12 V1→V2, 2 V2), 49 situations (42 V1, 7 V2), 78 sources, 1 identifiant retiré.
- Schémas JSON des fichiers de `data/` et `scripts/validate.py`, qui contrôle les schémas puis la cohérence entre notions, situations et sources.
- `scripts/coverage.py` : comptes du référentiel et couverture des contenus en français et en anglais (0 sur 191).
- `docs/` : sections 1, 2, 3, 6, 8 et 9 de `REPRISE.md` copiées sans réécriture, et `docs/contenus.md` (emplacement des contenus, règle de couverture).
- `README.md`, `README.en.md`, `CLAUDE.md`, ce changelog.
- Workflow GitHub Actions qui lance `validate.py` et `coverage.py` sur chaque pull request et sur `main`.

[0.3.76]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.75...v0.3.76
[0.3.75]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.74...v0.3.75
[0.3.74]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.73...v0.3.74
[0.3.73]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.72...v0.3.73
[0.3.72]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.71...v0.3.72
[0.3.71]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.70...v0.3.71
[0.3.70]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.69...v0.3.70
[0.3.69]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.68...v0.3.69
[0.3.68]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.67...v0.3.68
[0.3.67]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.66...v0.3.67
[0.3.66]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.65...v0.3.66
[0.3.65]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.64...v0.3.65
[0.3.64]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.63...v0.3.64
[0.3.63]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.62...v0.3.63
[0.3.62]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.61...v0.3.62
[0.3.61]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.60...v0.3.61
[0.3.60]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.59...v0.3.60
[0.3.59]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.58...v0.3.59
[0.3.58]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.57...v0.3.58
[0.3.57]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.56...v0.3.57
[0.3.56]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.55...v0.3.56
[0.3.55]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.54...v0.3.55
[0.3.54]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.53...v0.3.54
[0.3.53]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.52...v0.3.53
[0.3.52]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.51...v0.3.52
[0.3.51]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.50...v0.3.51
[0.3.50]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.49...v0.3.50
[0.3.49]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.48...v0.3.49
[0.3.48]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.47...v0.3.48
[0.3.47]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.46...v0.3.47
[0.3.46]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.45...v0.3.46
[0.3.45]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.44...v0.3.45
[0.3.44]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.43...v0.3.44
[0.3.43]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.42...v0.3.43
[0.3.42]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.41...v0.3.42
[0.3.41]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.40...v0.3.41
[0.3.40]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.39...v0.3.40
[0.3.39]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.38...v0.3.39
[0.3.38]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.37...v0.3.38
[0.3.37]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.36...v0.3.37
[0.3.36]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.35...v0.3.36
[0.3.35]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.34...v0.3.35
[0.3.34]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.33...v0.3.34
[0.3.33]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.32...v0.3.33
[0.3.32]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.31...v0.3.32
[0.3.31]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.30...v0.3.31
[0.3.30]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.29...v0.3.30
[0.3.29]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.28...v0.3.29
[0.3.28]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.27...v0.3.28
[0.3.27]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.26...v0.3.27
[0.3.26]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.25...v0.3.26
[0.3.25]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.24...v0.3.25
[0.3.24]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.23...v0.3.24
[0.3.23]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.22...v0.3.23
[0.3.22]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.21...v0.3.22
[0.3.21]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.20...v0.3.21
[0.3.20]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.19...v0.3.20
[0.3.19]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.18...v0.3.19
[0.3.18]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.17...v0.3.18
[0.3.17]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.16...v0.3.17
[0.3.16]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.15...v0.3.16
[0.3.15]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.14...v0.3.15
[0.3.14]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.13...v0.3.14
[0.3.13]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.12...v0.3.13
[0.3.12]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.11...v0.3.12
[0.3.11]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.10...v0.3.11
[0.3.10]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.9...v0.3.10
[0.3.9]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.8...v0.3.9
[0.3.8]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.7...v0.3.8
[0.3.7]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Badmiaoo/TutoPhoto/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Badmiaoo/TutoPhoto/tree/v0.2.0
