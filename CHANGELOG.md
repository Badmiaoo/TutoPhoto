# Changelog

Évolutions du dépôt, de la plus récente à la plus ancienne. Chaque pull request fusionnée donne une version : elle ajoute ici sa section, que la CI contrôle (`scripts/changelog.py check`). Après la fusion, le workflow `.github/workflows/tag.yml` pose le tag annoté `vX.Y.Z` sur le commit de fusion et publie la release GitHub correspondante, avec le texte de cette section.

## Numérotation `vX.Y.Z`

- X : 0 jusqu'à la publication de la V1.
- Y : version du référentiel, celle du champ `since` des notions et des situations. Y augmente quand une notion ou une situation est ajoutée, retirée ou reclassée (niveau, notions clés) ; les nouveautés prennent alors `since: v0.Y`.
- Z : tout le reste (textes, sources, documentation, scripts, CI) ; remis à 0 quand Y augmente.

## Rubriques

Chaque version range ses changements sous : Ajouté, Modifié, Corrigé, Retiré.

## [0.3.62] - 2026-11-16

Sujet 2 du plan de corrections de l'audit (`docs/audit/README.md`) : trois corrections courtes du simulateur et un contrôle de routine. Constats, tous contre-vérifiés par un second agent : FEX-19 (`docs/audit/fiches-exposition.md`) et INT-21 (`docs/audit/interface.md`), même défaut ; COD-09 et COD-14 (`docs/audit/code.md`). La quatrième correction du sujet, le défilement gardé de l'écran de revue (INT-17), est faite depuis la version 0.3.59. S'y ajoute un défaut hors de l'audit, relevé pendant les essais de cette version et contre-vérifié par sa relecture : les zones écrêtées de l'écran de revue clignotaient malgré le réglage « réduire les animations » (« Corrigé »). Choix de Claude : `docs/propositions.md`, section 5, « Corrections d'une ligne ». Numérotation : ni notion ni situation ajoutée, retirée ou reclassée, donc c'est Z qui augmente.

Ce qui n'est pas fait :

- COD-09 : `user-select: none` et `-webkit-touch-callout: none`, que le constat proposait contre le menu de l'appui long, ne sont pas ajoutés. Sa contre-vérification ne les retient pas : personne n'a constaté ce menu. Ils n'ont pas été essayés, et ne peuvent pas l'être ici : Safari n'est pas émulé. Si le menu se montre sur un vrai téléphone, ils sont à ajouter (`docs/tests-a-faire-faire.md`, test T5).
- L'anneau de focus de l'indicateur d'exposition n'est pas changé : au clavier, quand l'indicateur clignote, l'anneau clignote avec le bouton, invisible une demi-seconde sur deux, le focus restant sur le bouton (relecture, constat C-3). Avant cette version, le focus lui-même était perdu. Garder l'anneau visible change l'aspect du clignotement : choix laissé à Julien (`docs/propositions.md`, section 5, « Corrections d'une ligne », choix 9).
- Le déclencheur peut changer de place pendant une rafale tenue, quand son libellé s'allonge (« Rafale : N vues ») et que la rangée de boutons passe à la ligne : relevé par un agent de réfutation sur des téléphones émulés, antérieur à cette version, contre-vérifié par personne. Non corrigé ; le test T5 demande de le noter.
- Aucun contrôle de routine pour le clignotement de l'indicateur ni pour la rafale au doigt : le plan n'en demande pas, et la routine ne joue aucun toucher (INT-13, Sujet 4). Le seul contrôle qui touche au clignotement est celui des zones écrêtées avec « réduire les animations » (« Ajouté »).
- La cause de l'échec non expliqué de la CI à l'entrée du mode S (INT-21) n'est pas établie : aucun essai de cette version ne la prouve.
- La durée d'un clic de Playwright sur le site d'avant la correction n'a pas été remesurée : la série a été arrêtée par la limite de temps de l'essai. Les rapports la donnent (de 4 à 45 s).
- Après la relecture, la routine n'a été passée sur la machine de Claude que sur deux profils avec les corrections (ordinateur, et iphone avec la police de la CI) et sur un seul sans elles (iphone avec la police de la CI). La réfutation du constat R-1 demandait les quatre profils, avec et sans la correction, avant de changer le point touché : les profils android et webgl1 sont laissés à la CI, qui ne passe que le site corrigé, et sans la correction le point (50 % ; 20 %) n'y est mesuré que hors de la routine, sur un écran d'ordinateur et un Pixel 7 émulé (« Essais »).
- Rien n'est essayé sur un vrai téléphone, ni avec un processeur graphique, ni dans Safari : les essais émulent l'écran, le toucher et le navigateur, en rendu logiciel. COD-09 est à confirmer par Julien sur son téléphone (décision D37 en attente ; test T5).

Relecture : la mise en œuvre a été relue par quatre agents, chacun sous un angle : le code et le comportement du site, la routine de test, la vérité des documents, l'interface sur des téléphones émulés. Ils ont rendu 18 constats : 3 pour le code (C-1 à C-3), 4 pour la routine (R-1 à R-4), 8 pour les documents (D-1 à D-8), 3 pour l'interface (I-1 à I-3). Des agents de réfutation, un par angle, les ont repris pour chercher à les réfuter, en refaisant les essais avec leurs propres scripts. Verdicts : 15 confirmés, 2 confirmés en partie (D-3 et I-2), 1 réfuté (D-2), aucun non établi. Deux agents de corrections se sont suivis : le premier a fait les corrections et leurs essais, et a été coupé par la limite d'usage avant ses vérifications de fin ; le second a confronté chaque constat aux deux commits du premier, relu ses journaux d'essai, reporté son dernier passage de routine et fait les vérifications de fin (« Essais »). Trois constats portent sur des défauts antérieurs à cette version, qu'elle touche ou décrit : C-1 et I-1, le même défaut vu sous deux angles, et C-3. Les 17 constats confirmés, en entier ou en partie, sont corrigés dans cette version, les deux derniers pour leur part confirmée. C-1 et I-1 : avec « réduire les animations », les zones écrêtées clignotaient alors que l'écran dit « sans clignoter » ; l'agent de mise en œuvre l'avait relevé sans le corriger, faute de contre-vérification, et les deux relecteurs l'ont retrouvé chacun de son côté (« Corrigé », avec un contrôle de routine : « Ajouté » ; `docs/propositions.md`, section 5, choix 7 révisé). C-2 : le commentaire de `touch-action: none` donnait 20 px pour le seuil au-delà duquel le navigateur prend le geste pour un défilement ; c'est le premier multiple du pas de 5 px de l'essai. Au pas de 1 px, la réfutation mesure 16 px, dans Chromium, sur trois écrans émulés et dans les quatre directions (48 cas) ; le commentaire le dit, et la feuille de style construite ne change pas. Les phrases de cette section qui citent 20 px décrivent l'essai et restent justes. C-3 : au clavier, l'anneau de focus de l'indicateur clignote avec le bouton ; c'est écrit dans `docs/camera-physique.md`, et l'aspect n'est pas changé (« Ce qui n'est pas fait »). R-1 et R-2 : le contrôle des deux loupes touchait la photo à 85 % et 80 %, sur le sol de feuilles mortes, sans motif à l'échelle des cases. Sur les profils ordinateur et webgl1, une loupe ouverte ailleurs sur le sol, à plusieurs fenêtres du point touché, restait sous le seuil (de 7,7 à 8,9 niveaux, hors de la routine), et sans la correction de COD-14 l'écart avec la zone touchée restait inférieur à l'écart avec celle du centre sur trois profils sur quatre : seul le seuil y détectait le défaut. Le contrôle touche maintenant à 50 % et 20 %, sur les arbres, où les deux conditions distinguent (« Ajouté », « Essais » ; choix 4 révisé). R-3 : le choix 4 écrivait que le contrôle échouerait si le boîtier par défaut changeait ; la réfutation l'a essayé hors de la routine, avec le Canon EOS RP réellement choisi et le calcul du contrôle laissé à la taille du Z 6 : 0,9 niveau sur ordinateur et 2,8 sur le profil iphone avec la police de la CI, le contrôle réussit. La phrase est réécrite, dans le choix 4 et dans le commentaire de la routine. R-4 : le cas « le clic n'est pas arrivé à la photo » ne pouvait pas être atteint, la routine attendant d'abord 300 s une loupe que rien n'avait demandée, et son message n'était jamais affiché ; la routine attend le point reçu 30 s au plus et fait échouer le contrôle en le disant (cas provoqué hors de la routine : « Essais »). D-1, D-5 et D-8, `docs/etat-des-travaux.md` : le test T6 n'y est plus rangé sous COD-09, et les passages qui disent ce qui reste du Sujet 2 après la fusion comptent les deux essais, comme la note de `docs/audit/README.md` ; la description de la pull request, encore celle du premier commit, est dans le reste à faire ; « Ce qui attend Julien » nomme les choix des « Corrections d'une ligne ». D-3, D-4 et I-2, `docs/tests-a-faire-faire.md` : T5 ne demande plus un glissement d'un centimètre « sur le bouton », qui n'a que 40 px de haut, dit que le compteur s'arrête à 20 vues et où lire le résultat au lever du doigt ; T5 et T6 disent que le simulateur garde des réglages d'une visite à l'autre, et T6 fait vérifier la correction d'exposition (une correction gardée de −0,3 IL suffit pour que rien ne clignote, mesuré par la réfutation). D-6 : « (ligne précédente) », dans cette section, renvoyait à la mauvaise ligne. D-7 : l'en-tête des « Corrections d'une ligne », dans `docs/propositions.md`, ne citait pas l'iPhone 14 émulé, sur lequel repose le choix 4. I-3 : cette section citait 36 et 24 relevés à l'appui d'un rythme d'une seconde et une seconde ; ces relevés ne sont pas réguliers et ne mesurent pas un rythme (« Essais »). Non corrigés : D-2, réfuté (il disait que les durées de la routine finale n'étaient portées par aucun journal ; elles se retrouvent par les heures de fin que portent les journaux, relues par l'agent de corrections : 17 h 24, 17 h 45, 18 h 02, 18 h 23 et 18 h 41 UTC) ; la part non confirmée de D-3 (le geste d'un centimètre, essayé par la réfutation, donne bien le résultat que T5 attend, doigt sorti du bouton) ; celle d'I-2 (le compteur n'est pas toujours sous le doigt : selon l'écran, le bouton change de place quand son libellé s'allonge, ce qui est relevé à part dans « Ce qui n'est pas fait »). Les relecteurs ont aussi vérifié, sans constat. Code : `tsc --noEmit` et la construction ; l'animation à instants imposés (opacité de 1 puis de 0, et 0,5 puis 0 avec la ligne du plan : l'écart avec le plan est fondé) ; sur la feuille de style construite, 40 clics sur 40, 40 touchers émulés sur 40 et la touche Entrée 20 fois sur 20, contre 21 sur 40, 21 sur 40 et 12 sur 20 avant ; la rafale au doigt glissé, et la page qui ne défile sur aucun des écrans essayés, avant comme après ; les appelants de `showWhole`, `showFrame` et `dropLoupe`, et le cycle de vie de la loupe (29 adresses créées, 26 révoquées, les 3 vivantes étant les deux vues et la loupe affichée), photo suivante, rafale de deux vues et calcul en échec compris. Routine : le diff (un bloc ajouté, aucun contrôle existant modifié) ; le calcul de la zone attendue, le même que celui de `magnify` ; l'échec du contrôle d'alors sans la correction, par la routine entière, sur les profils android (64 réussis, 1 échec, 106,9 niveaux) et webgl1 (52,6) ; le viseur de 238 px de l'iPhone 14 émulé avec la police de la CI ; l'état laissé aux contrôles suivants. Documents : `scripts/check_public.py --commits all` et `scripts/changelog.py check` ; les chiffres de cette section recoupés avec les journaux de l'agent de mise en œuvre et avec le journal de la CI ; les trois constructions témoins ; les libellés que citent T5 et T6. Interface, au toucher émulé : l'indicateur qui clignote ouvre la fenêtre « Exposition » 60 fois sur 60 sur un Pixel 7 et un iPhone 14 émulés, contre 29 sur 60 avant ; deux états sans demi-teinte et une cadence inchangée ; les zones écrêtées, qui laissent le toucher à la photo ; la rafale, doigt immobile, glissé ou sorti du bouton ; T5 et T6 joués à la lettre. Non vérifié par les relecteurs : rien sur un vrai téléphone, avec un processeur graphique ni dans Safari ; le menu de l'appui long sur le déclencheur, que l'émulation ne produit pas, même sur un texte ordinaire ; le seuil de 16 px ailleurs que dans Chromium émulé ; le thème sombre ; le coût de l'animation sur la fluidité du viseur, la machine étant chargée ; le passage direct d'un mode hors limites à l'autre ; les gestes pendant le calcul d'une loupe (COD-08, hors de ce sujet) ; un boîtier APS-C réellement choisi sous le contrôle des deux loupes ; le site publié.

Essais, dans Chromium sans écran, en rendu logiciel (Playwright), sur le site construit ; scripts écrits pour cette version, hors du dépôt. Trois constructions hors du dépôt servent de témoins : le site d'avant (version 0.3.61), le site avec la ligne du plan telle quelle pour le clignotement, et le site corrigé sans la ligne de COD-14. « Relevés à 100 ms » désigne le délai demandé entre deux relevés, dont l'heure n'a pas été notée : en rendu logiciel, ils ne sont pas réguliers (refaits pour les zones écrêtées avec l'heure de chaque relevé : 60 relevés étalés sur 54 à 60 s). Leurs comptes disent quels états existent, pas leur durée ; le rythme se lit dans les mesures à instants imposés, animation en pause.

- Clignotement de l'indicateur (FEX-19, INT-21), écran de 1280 × 800, mode S à 1/4000 s sans ISO auto (« S · −0,5 IL », « f/1,4 » qui clignote), 60 relevés à 100 ms. Avant : bouton invisible à 32 relevés, élément sous le pointeur autre que le bouton (`meter-row`) à 32 relevés ; 20 clics de souris à des instants quelconques : 10 ouvertures de la fenêtre ; 10 essais au clavier : focus pris 8 fois, fenêtre ouverte par Entrée 8 fois. Avec la ligne du plan (`to { opacity: 0; }`, `steps(2, start)`) : clics 20 sur 20 et focus 10 sur 10, mais opacité de 0,5 à 33 relevés et de 0 à 27, jamais 1 : l'aspect change. Corrigé (`step-end`) : opacité de 1 à 32 relevés et de 0 à 28, jamais cachée, bouton sous le pointeur 60 fois sur 60 ; clics de souris : 20 ouvertures sur 20 ; clavier : focus 10 sur 10, fenêtre ouverte 10 sur 10.
- Durée d'un clic de Playwright, le geste de la routine (`page.click("#meter-value")`), site corrigé : pendant le clignotement, 12 clics, 12 ouvertures, de 7,5 à 9,7 s, médiane 8,9 s. Témoin au même état sans clignotement (réglage « réduire les animations ») : 12 clics, 12 ouvertures, de 9,3 à 11,0 s, médiane 10,4 s. Le clic n'est donc pas plus long que le témoin. En mode M à f/8, où le viseur coûte moins à rendre : de 4,9 à 6,4 s (18 clics, médianes 5,3 s) ; ce n'est pas le bon témoin (`docs/propositions.md`, section 5, choix 6).
- « Réduire les animations », site corrigé : l'indicateur ne clignote pas (aucune animation, opacité de 1 aux 60 relevés), clics 20 sur 20, focus 10 sur 10.
- Zones écrêtées de l'écran de revue, qui partagent l'animation, site corrigé, photo surexposée de 3,2 IL (51,1 % de l'image) : opacité de 1 ou de 0 aux 60 relevés, jamais de valeur intermédiaire (36 et 24) ; l'élément touché est la photo, 60 fois sur 60, au centre comme sur une zone écrêtée ; toucher une zone ouvre la loupe. Le rythme, une seconde en noir, une seconde invisibles (celui que décrit `docs/camera-physique.md` depuis la version 0.3.57), est mesuré à instants imposés par l'agent de corrections, animation en pause, sur le site de cette version : opacité de 1 à 0, 500 et 999 ms, de 0 à 1000, 1500 et 1999 ms, période de 2 s ; 171 492 pixels presque noirs sur les 354 780 de la photo affichée à 500 ms, 1 322 à 1500 ms.
- Zones écrêtées et « réduire les animations » (relecture, constats C-1 et I-1), écran de 1280 × 800, photo surexposée de 3,2 IL, « Infos » deux fois, réglage émulé par Playwright. Site de cette version : le calque n'a aucune animation, opacité de 1 aux 60 relevés, trois captures de la photo identiques (172 033 pixels presque noirs sur 354 780), texte « … 51,9 % de l'image. Ces zones sont en noir sur la photo, sans clignoter : votre appareil demande de réduire les animations. », et l'élément au centre de la photo reste la photo. Sans le réglage, même site : animation `clignote` de 2 s, opacité de 1 à 29 relevés et de 0 à 31, texte « Ces zones clignotent en noir sur la photo. » (ligne précédente pour le rythme). Témoin, site d'avant la correction (commit 55002d6), avec le réglage : même texte « sans clignoter », animation `clignote` en cours, opacité de 1 à 28 relevés et de 0 à 32, 171 706 pixels presque noirs à 500 ms et 1 579 à 1500 ms : les zones disparaissaient bien de l'écran. Feuille de style construite seule, avec le réglage : ni l'indicateur, ni la valeur qui clignote avec lui, ni le calque n'ont d'animation ; sans lui, l'indicateur vaut 1 puis 0 à 500 ms (période de 1 s) et le calque 1 puis 0 à 1000 ms (période de 2 s). Le script construit a le même contenu, à l'octet près, que celui d'avant la correction (seul son nom haché change) : la correction ne touche que la feuille de style.
- Rafale au doigt (COD-09), Pixel 7 émulé, Continu L à 5 vues par seconde, doigt posé par `Input.dispatchTouchEvent`, puis glissé par six pas de 5 px. Avant : après le quatrième pas (20 px), `pointercancel` puis `lostpointercapture`, le bouton revient à « Déclencher », 6,7 s avant le lever du doigt, vers le haut comme de côté (séries de 8 et 9 vues). Corrigé : six `pointermove`, aucun `pointercancel`, `pointerup` au lever du doigt ; la rafale continue après le glissement (de 10 à 12 vues au compteur) et finit au lever du doigt, vers le haut comme de côté (séries de 13 vues) ; doigt immobile : `pointerup` au lever du doigt (6 vues). La page ne défile dans aucun cas. Les durées dépendent du rendu logiciel, pas l'ordre des événements.
- Deux loupes séparées par « Photo entière » (COD-14), réglages de la routine (M, f/8, 1/4000 s, ISO 6400), une photo, loupe au centre puis six points touchés, chacun après « Photo entière » ; écart moyen de luminance entre la fenêtre de la loupe et la zone touchée de la photo entière, réduites à 12 × 4 cases. Corrigé : de 0,4 à 1,1 niveau (ordinateur, fenêtre de 1256 × 466 px) et de 1,4 à 3,3 (Pixel 7 émulé, 388 × 301 px). Sans la ligne : de 54 à 77 (ordinateur) et de 52 à 110 (Pixel 7 émulé).
- Premier état du contrôle de routine, qui plaçait la zone d'après le point visé (85 % et 80 %) : sur la machine de Claude, 65 contrôles réussis et 0 échec sur les profils ordinateur (0,6 niveau), android (1,7) et iphone (3,7, fenêtre de 366 × 126 px) ; le profil webgl1 n'y a pas été passé dans ce premier état ; sur le site sans la ligne de COD-14, profil ordinateur : 64 réussis, 1 échec, ce contrôle (28,9 niveaux). Dans la CI, d'après le journal de la routine, il a échoué sur le profil iphone, correction en place : 12,6 niveaux, fenêtre de 366 × 98 px ; les trois autres profils y étaient verts. Cause, reproduite sur la machine de Claude avec la police de la CI (DejaVu Sans, viseur de 238 px) : la photo n'y est affichée qu'en 178 × 118 px, et le clic arrive à un pixel CSS entier, à 84,8 % et 80,5 % au lieu de 85 % et 80 %. Un pixel CSS y vaut 34 pixels de l'image complète : la fenêtre de la loupe est 21 pixels plus bas et 10 pixels plus à gauche que la zone attendue, soit 5 et 2,5 pixels de la photo entière, pour des cases de 7,5 × 6 pixels. Mesuré pour trois points touchés : de 7,0 à 16,0 niveaux d'après le point visé, de 0,6 à 2,1 d'après le point que la photo a reçu ; sans la ligne de COD-14, de 34,5 à 84,4 d'après le point visé. Ce n'est pas un défaut de la loupe, qui montre bien le point reçu. Le contrôle place donc la zone d'après le point reçu, lu sur le clic comme le fait l'application ; ni la grille ni le seuil ne changent.
- Routine `node scripts/test_app.cjs --photo`, contrôle final de la mise en œuvre (toucher à 85 % et 80 %, zone placée d'après le point reçu ; avant la relecture), un profil à la fois, sur le site construit à cette version, machine de Claude : ordinateur, 65 contrôles réussis, 0 échec, en 24 minutes ; android, 65 et 0, en 21 minutes ; iphone, 65 et 0, en 17 minutes ; webgl1, 65 et 0, en 21 minutes. Le nouveau contrôle y mesure 0,3 niveau (ordinateur, photo affichée en 729 × 486 px), 0,7 (android, 214 × 321 px), 1,0 (iphone, 220 × 146 px, fenêtre de 366 × 126 px) et 0,3 (webgl1). Profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px, point reçu à 84,8 % et 80,5 %) : 65 contrôles réussis, 0 échec, en 18 minutes, le nouveau contrôle à 2,0 niveaux ; un premier passage, sur le site construit avant l'écriture de cette section, avait donné 65 et 0, à 1,9 niveau. Ces passages émulent l'écran, le toucher et le navigateur, en rendu logiciel : ni processeur graphique, ni Safari, ni vrai téléphone ; et la routine clique à la souris, sur tous les profils.
- Ce contrôle final de la mise en œuvre échoue sans la correction : sur le site construit sans la ligne de COD-14 (construit avant l'écriture de cette section, il affiche encore 0.3.61), profil iphone avec la police de la CI, 64 contrôles réussis et 1 échec, ce contrôle (40,1 niveaux avec la zone touchée, 80,4 avec celle du centre). Les trois autres profils n'ont pas été passés sans la correction avec le contrôle final ; le profil ordinateur l'a été avec le premier état (« Premier état du contrôle de routine », plus haut).
- Après la relecture, routine `node scripts/test_app.cjs --photo` avec le contrôle des deux loupes au point (50 % ; 20 %) et le contrôle « réduire les animations », passée par l'agent de corrections, un profil à la fois, machine de Claude, sur le site construit avec la feuille de style corrigée. Profil ordinateur : 66 contrôles réussis, 0 échec ; point reçu à 50,1 % et 20,0 %, 0,4 niveau avec la zone touchée, 51,8 avec celle du centre (fenêtre de 1256 × 466 px, photo affichée en 729 × 486 px). Profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px) : 66 et 0 ; point reçu à 50,0 % et 20,3 %, 0,7 niveau avec la zone touchée, 112,9 avec celle du centre. Sur les deux profils, contrôle « réduire les animations » : animation `clignote` sans le réglage ; avec lui, aucune animation, opacité de 1, bouton « Infos : hautes lumières » et texte « sans clignoter » ; animation revenue une fois le réglage rendu. Sans les corrections, les deux contrôles ajoutés ou changés par la relecture échouent, ce qui est attendu : la même routine sur le site construit sans la ligne de COD-14 (sources du commit 55002d6 avec `app/src/ui/shutter.ts` d'`origin/main` : il n'a donc pas non plus la feuille de style corrigée), profil iphone avec la police de la CI (viseur de 238 px, fenêtre de 366 × 98 px, photo affichée en 178 × 118 px) : 64 contrôles réussis, 2 échecs. Contrôle des deux loupes : point reçu à 50,0 % et 20,3 %, 107,4 niveaux avec la zone touchée, 13,5 avec celle du centre ; le seuil et la condition du centre échouent l'un et l'autre. Contrôle « réduire les animations » : avec le réglage, animation `clignote` encore en cours sous le texte « sans clignoter ». Sur les autres profils, le point (50 % ; 20 %) n'est mesuré sans la correction de COD-14 que hors de la routine, par la réfutation : 77 niveaux contre 33 avec la zone du centre (ordinateur), 86 contre 22 (Pixel 7 émulé). Les profils android et webgl1 ne sont pas passés par l'agent de corrections : la CI les passe sur le site corrigé. Mêmes limites que plus haut : rendu logiciel, écrans émulés, clics à la souris.
- Cas du clic qui n'arrive pas à la photo (relecture, constat R-4), hors de la routine, par le second agent de corrections : le bloc des deux loupes, repris tel quel de `scripts/test_app.cjs`, est joué sur le site de cette version, écran de 1280 × 800, photo aux réglages de départ, un calque posé sur la photo arrêtant le clic. Le contrôle échoue avec « le clic n'est pas arrivé à la photo (aucun point reçu en 30 s), aucune loupe n'a été demandée », 40 s après le clic, « Revenir au viseur » compris, au lieu d'attendre 300 s ; l'écran de revue se ferme, la photo suivante s'ouvre entière (1500 × 999 px, sans défilement) et une loupe s'y ouvre ; aucune erreur de page. Témoin sans le calque, même script : le contrôle réussit (point reçu à 50,1 % et 20,0 %, 0,2 niveau avec la zone touchée, 68,3 avec celle du centre). Ce cas n'a pas été provoqué dans la routine entière.
- `npm run build` (dont `tsc --noEmit`), `python3 scripts/changelog.py check --base origin/main`, `python3 scripts/check_public.py --commits all` : réussis (0 problème pour le dernier), refaits après les corrections. Le site construit dans le dépôt après les corrections a les mêmes fichiers, à l'octet près (`diff -rq` sans différence), que celui sur lequel la routine d'après la relecture a tourné.

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

- Documents : `docs/etat-des-travaux.md` (Sujet 2 écrit, relu et corrigé, sujet suivant : le Sujet 3 ; suspensions et redémarrages du 16 et du 17 novembre) ; `docs/propositions.md` (section 5, « Corrections d'une ligne », choix 1 à 9) ; `docs/camera-physique.md` (clignotement, anneau de focus, rafale au doigt, loupe après « Photo entière », et le défaut corrigé avec « réduire les animations ») ; `docs/audit/README.md` (une note datée sous le Sujet 2, sans réécrire le reste).

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
