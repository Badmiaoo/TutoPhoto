# Audit du lot « Fiches des notions de mise au point, de netteté, de mouvement et de lumière ; situations ; activité LUM-02 »

- Date : 13 novembre 2026.
- Demande : Julien, le 12 novembre 2026 : remettre en question tout le travail fait avant ce jour par le modèle précédent, et le modifier si nécessaire ; le 13 novembre : finir l'audit et pousser le résultat.
- Version auditée : copie de travail à la version 0.3.58. Les fiches du lot datent du 11 novembre 2026 (versions 0.3.40 à 0.3.50) ; la phrase « Cadrage » de SIT-01, ajoutée le 12 novembre, est hors du lot.
- État : constats non contre-vérifiés.
- Auteur : un agent de Claude, à partir de la première passe sur toutes les fiches (`docs/audit/fiches.md`, constats FIC, coupée par la limite d'usage). Chaque constat FIC qui porte sur ce lot a été relu (endroit visé, source, calcul) avant d'être repris ; la correspondance est dans la section « Constats FIC repris ».
- Avancement : rapport en cours d'écriture, repris le 13 novembre 2026 par un autre agent de Claude après une coupure. Écrits : les constats repris de la première passe (FMA-01 à FMA-10, FMA-02 et FMA-10 complétés) et les constats nouveaux FMA-11 à FMA-18 et FMA-20 à FMA-22. À venir : FMA-19 (défi SIT-06, essai en cours), les sections « Vérifié », « Je ne sais pas » et « Constats FIC repris », le classement par gravité.

## Périmètre

- Fiches : `content/fr/` et `content/en/`, notions MAP-04, MAP-05, MAP-06, MAP-09, NET-01, NET-06, MVT-01 et LUM-02 ; situations SIT-01, SIT-05 et SIT-06 (vingt-deux fichiers).
- Activité de LUM-02 : `app/src/activities/lum02.ts`, `app/src/activities/lum02.css`, `app/activites/LUM-02/index.html`.
- Lus pour les juger : `docs/contenus.md`, `docs/cadrage.md`, les notions et les situations dans `data/referentiel/` et `data/situations.yaml`, `data/sources.yaml`, `docs/camera-physique.md` (sections de la mise au point, des collimateurs, de l'indicateur d'équilibre, des défis), et le code que les fiches décrivent : `app/src/camera/` (`autofocus.ts`, `faces.ts`, `sharpZone.ts`, `bulletin.ts`, `exposure.ts`, `exposureModes.ts`, `bodies.ts`, `viewfinder.ts`), `app/src/ui/` (`cameraPanel.ts`, `shutter.ts`, `challenges.ts`, `balance.ts`, `topView.ts`), `app/src/scene.ts`, `app/src/i18n.ts`.
- Hors du lot : les fiches d'exposition, de mesure et de boîtier (`docs/audit/fiches-exposition.md`, constats FEX) ; le modèle physique lui-même (`docs/audit/modele-physique.md`, constats PHY), auquel ce rapport renvoie sans le refaire.

## Méthode

1. Lecture des vingt-deux fiches, phrase par phrase, français et anglais côte à côte.
2. Relecture de chaque source citée à son adresse, le 13 novembre 2026, quand l'hôte répond ; chaque affirmation de fiche est cherchée dans le texte extrait de la page enregistrée.
3. Chaque chiffre est refait par un script écrit pour ce rapport (`calculs.py`), avec les formules de `sharpZone.ts`, `exposure.ts`, `exposureModes.ts`, `bulletin.ts` et `lum02.ts`, et les valeurs exactes des crans.
4. Chaque phrase des sections « Simulateur », « Activité », « Exercice », « Recette » et « Défi » est confrontée au code.
5. Navigateur : les sorties de la première passe (`preuves-123.out`, `preuves-45678.out` : site construit hors du dépôt, Chromium sans écran, rendu logiciel, fenêtre de 1280 × 800, densité 1, interface en français) sont citées quand elles portent sur ce lot ; elles n'émulent ni un processeur graphique ni Safari. Les essais propres à ce rapport sont décrits avec les constats qui s'en servent.

Pages enregistrées, textes extraits, scripts et sorties : dossier `audit/fiches-mise-au-point/` du bloc-notes de la session, hors du dépôt (`pages/`, `texte/`, `scripts/`, `sorties/`) ; celui de la première passe est `audit/fiches/`. Rien n'y est gardé d'une session à l'autre : les preuves utiles sont recopiées ici. Les numéros de ligne sont ceux de la version 0.3.58.

## Sources

Toutes lues le 13 novembre 2026. Wikipedia est une source secondaire.

### Relues, citées par les fiches

| Source | Adresse lue | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, manuel en ligne Z 7/Z 6 (en), « Focus » | `https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html` | `nikon-z6-en-focus.html` |
| Nikon, manuel en ligne Z 7/Z 6 (fr), « Mise au point » | `https://onlinemanual.nikonimglib.com/z7_z6/fr/05_basic_settings_01.html` | `nikon-z6-fr-focus.html` |
| Nikon, manuel en ligne Z 7/Z 6, « a4: Auto-Area AF Face/Eye Detection » (en et fr) | `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_a04.html`, `…/fr/09_menu_guide_05_a04.html` | `nikon-z6-en-a4.html`, `nikon-z6-fr-a4.html` |
| Nikon, manuel en ligne Z 7/Z 6 (en), « Defaults » | `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html` | `nikon-z6-en-defaults.html` |
| Sony, guide d'aide ILCE-9, « Focus Mode » | `https://helpguide.sony.net/ilc/1650/v1/en/contents/TP0001486782.html` | `sony-a9-focus-mode.html` |
| Nikon, communiqué du 23 août 2018 | `https://www.nikon.com/news/2018/0823_mirrorless_01.htm` | `nikon-news-2018-0823.html` |
| Nikon, page du produit Z 6 | `https://imaging.nikon.com/imaging/lineup/mirrorless/z_6/` | `nikon-z6-product.html` |
| Wikipedia, « Circle of confusion », révision 1335590423 (30 janvier 2026) | `https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423` | `wiki-coc-1335590423.html` |
| Wikipedia, « Umbra, penumbra and antumbra », révision 1379008615 (7 octobre 2026) | `https://en.wikipedia.org/w/index.php?title=Umbra,_penumbra_and_antumbra&oldid=1379008615` | `wiki-umbra-1379008615.html` |
| Tiffen, guide Lowel « Foundations of Lighting: Understanding Soft Light » (page sans date) | `https://tiffen.reamaze.com/kb/lowel-guides/foundations-of-lighting-understanding-soft-light` | `tiffen-soft-light.html` |
| Art Adams, « Lighting Strategies: What Makes Soft Lights Cast Soft Shadows? », ProVideo Coalition, 27 décembre 2011 | `https://www.provideocoalition.com/lighting_strategies_what_makes_soft_lights_cast_soft_shadows/` | `pvc-adams-soft-light.html` |

### Lues en plus, pour vérifier ou proposer une correction

| Source | Adresse | Fichier (`pages/`) |
| --- | --- | --- |
| Nikon, manuel en ligne Z 7/Z 6 (en), « a5: Focus Points Used » | `https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_a05.html` | `nikon-z6-en-a5.html` |
| Nikon, manuel en ligne COOLPIX P1100, « AF area mode » (citée par le code, pas par les fiches) | `https://onlinemanual.nikonimglib.com/p1100/en/08-31.html` | `nikon-p1100-af-area.html` |
| Wikipedia, « Nikon D5600 » (révision 1345325532), « Canon EOS 2000D » (révision 1381131251) | `https://en.wikipedia.org/w/index.php?title=Nikon_D5600&oldid=1345325532`, `…title=Canon_EOS_2000D&oldid=1381131251` | `wiki-nikon-d5600-1345325532.html`, `wiki-canon-eos-2000d-1381131251.html` |
| Canon, manuel en ligne de l'EOS 850D : « AF Operation », « Selecting the AF Area and AF Point (Viewfinder Shooting) », « Selecting the AF Methods (Live View Shooting) », en anglais et en français | `https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0020.html`, `…_0030.html`, `…_0040.html`, et les mêmes sous `/fr/` | `canon-850d-en-afdrive-0020.html` et suivants, `canon-850d-fr-afdrive-0020.html` et suivants |
| Sony, guide d'aide de l'ILCE-7M3 (α7 III), « Focus Mode », « Focus Area », en anglais et en français | `https://helpguide.sony.net/ilc/1720/v1/en/print.pdf`, `…/fr/print.pdf` | fichiers enregistrés par l'audit des fiches d'exposition (`sony-ilce-7m3-en-print.pdf`, `sony-ilce-7m3-fr-print.pdf`), lus dans leur texte extrait |

### Non relues

| Source | Raison |
| --- | --- |
| Canon Royaume-Uni, fiche de l'EOS RP (`https://www.canon.co.uk/cameras/eos-rp/specifications/`), citée par MAP-06 | Source non relue : l'hôte répond 403 (« Access Denied ») le 13 novembre 2026. Seule trace : la citation gardée dans `data/sources.yaml` (`canon-eos-rp-af`), relevée par Julien le 11 novembre 2026. |
| Sony Inde, page de l'α7 III (`https://www.sony.co.in/interchangeable-lens-cameras/products/ilce-7m3-body-kit/feature2`), citée par MAP-06 | Source non relue : hôte non joignable (le proxy refuse la connexion). Seule trace : la citation gardée dans `data/sources.yaml` (`sony-ilce-7m3-af`), relevée par Julien le 11 novembre 2026. |

| Photography Life, « What is Lens Compression? » (`https://photographylife.com/what-is-lens-compression`), listée par le référentiel pour NET-01, pas citée par la fiche | Source non relue : l'hôte répond 403 le 13 novembre 2026 (constat FMA-15). |

## Constats

Rédaction en cours : FMA-01 à FMA-10 sont les constats de la première passe, relus un par un ; les suivants sont nouveaux. Le classement par gravité viendra à la fin.

### FMA-01 · incohérent · MAP-04, exercice : le bulletin ne dit « hors de la zone nette » que dans un défi, et ni le mode ni la vitesse ne sont écrits (repris de FIC-08)

- Endroit : `content/fr/notions/MAP-04.md`, l. 17 ; `content/en/notions/MAP-04.md`, l. 17.
- Ce qui est écrit : « En AF-S, verrouille la mise au point sur le groupe (6,5 m) puis photographie le chien quand il passe : le bulletin le dit hors de la zone nette à f/2. Recommence en AF-C, zone automatique et détection des animaux, en Continu H : le défi SIT-06 peut réussir. »
- Preuve (code) : sans défi, le bulletin n'a que quatre sortes de lignes : exposition, limites de la zone nette, bruit, traînée du promeneur et du chien (`app/src/ui/challenges.ts`, l. 153-167). Qu'un sujet soit ou non dans la zone nette n'est écrit que par les critères d'un défi (l. 168 : `if (extra.challenge)`). L'exercice ne nomme le défi SIT-06 qu'à sa dernière phrase.
- Preuve (mesure, sortie `preuves-45678.out` de la première passe, essai 8 : AF-S verrouillé à 6,4 m, mode A à f/2) : avec le défi SIT-06, le bulletin écrit « Manqué : chien dans la zone nette (9,0 m) » ; sans défi, il écrit seulement « Exposition : −0,2 IL », « Zone nette : 5,6 m – 7,4 m (mise au point à 6,4 m) », le bruit et « le promeneur : traînée de 0,1 px […] ».
- Preuve (calcul, `calculs.py`) : l'exercice dit « à f/2 » sans dire le mode. Au départ, le simulateur est en mode M, à f/8, 1/100 s, ISO auto (`app/src/camera/exposure.ts`, l. 80-84 ; `app/src/ui/cameraPanel.ts`, l. 243-247). En mode M, f/2 et 1/100 s donnent +3,8 IL (la sensibilité ne descend pas sous ISO 100), et le chien laisse 0,19 mm, soit 8,0 px pour une limite de 1,2 px : le critère « figé » du défi échoue quelle que soit la mise au point. En mode A à f/2, l'appareil prend 1/1600 s, et le défi peut réussir.
- Correction proposée : « Choisis le défi SIT-06 et le mode A à f/2. En AF-S, touche le groupe pour verrouiller la mise au point (environ 6,5 m), puis photographie le chien quand il passe : le bulletin écrit « Manqué : chien dans la zone nette », la zone nette s'arrêtant vers 7,6 m. […] » Même chose en anglais. Voir aussi FMA-11, sur ce que cet exercice montre vraiment.

### FMA-02 · non sourcé · MAP-06 : « Hors de cette zone, l'appareil ne peut pas faire le point » (repris de FIC-03)

- Endroit : `content/fr/notions/MAP-06.md`, l. 5 ; `content/en/notions/MAP-06.md`, l. 5 (« Outside this area, the camera cannot focus »).
- Preuve (sources relues) : aucune des trois pages citées ne le dit. Communiqué du 23 août 2018 : « the Z 6 has 273 focus points*, enabling broad coverage of approximately 90% of the imaging area both horizontally and vertically » ; page du produit : « 273-point hybrid AF system offering accurate focus across 90% of the frame » ; la page « Focus » ne parle pas du bord du cadre.
- La phrase est une déduction, et elle est trop large : la mise au point manuelle ne dépend pas des collimateurs (« Manual focus can be used when autofocus does not produce the desired results », page « Focus »), et l'AF-S permet de faire le point puis de recadrer (« focus will lock while the shutter-release button is pressed halfway », même page), ce que le simulateur reproduit (`app/src/camera/autofocus.ts`, l. 6-10).
- Source pour la correction (ajoutée à la reprise) : faire le point puis recadrer est écrit dans deux manuels lus le 13 novembre 2026. Canon, EOS 850D, « AF Operation » : « The focus remains locked while you hold down the shutter button halfway, allowing you to recompose the image before taking the picture. This is called “focus lock.” » (`https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0020.html`). Sony, guide d'aide de l'ILCE-7M3, « Focus Area », « Center » : « Use together with the focus-lock function to create the composition you want. »
- Correction proposée : « Les collimateurs ne couvrent que cette zone : on ne peut pas placer le point d'autofocus plus près du bord (déduction de TutoPhoto, les pages lues ne le disent pas). Pour un sujet au bord du cadre, on fait le point en AF-S, puis on recadre (MAP-04). » ; en anglais : « The focus points only cover this area: the autofocus point cannot be placed closer to the edge (TutoPhoto's deduction; the pages read do not say so). For a subject at the edge of the frame, focus in AF-S, then reframe (MAP-04). »

### FMA-03 · non sourcé · SIT-05 et MAP-05 : « souvent le sol devant les pieds », une règle du simulateur donnée pour celle du boîtier (repris de FIC-04)

- Endroit : `content/fr/situations/SIT-05.md`, l. 11 (« Attention à la zone large : elle prend le sujet le plus proche, souvent le sol devant les pieds (MAP-05) ») ; `content/fr/notions/MAP-05.md`, l. 16 (« la zone large fait le point plus près, sur le sol […], parce qu'elle prend le sujet le plus proche ») ; mêmes lignes en anglais.
- Preuve (source relue) : le manuel dit seulement « If the selected focus area contains subjects at different distances from the camera, the camera will assign priority to the closest subject » (« Focus », AF zone large). Il ne dit pas que le sol compte comme un sujet. Je ne sais pas ce que fait un Z 6 quand le sol entre dans une zone large.
- Preuve (code) : le simulateur retient la plus petite distance de la zone, quelle qu'elle soit, sol invisible compris (`app/src/camera/autofocus.ts`, l. 18-20 et 35 ; fonction `nearestIn`, l. 337-382). Il l'écrit lui-même comme une limite : « Non simulé : […] la taille minimale d'un sujet pour qu'une zone large le retienne » (l. 30-33), et `docs/camera-physique.md`, l. 369 : « un seul pixel suffit ici ».
- Preuve (mesure, sortie `preuves-123.out` de la première passe, essai 3, cadre horizontal de 910 × 606 px, 50 mm) : en bas du cadre, le point sélectif donne 6,6 m, 7,1 m, 6,4 m, 6,1 m et 5,9 m à 80 %, 85 %, 90 %, 92,5 % et 94 % de la hauteur ; la zone large (L) donne 5,8 m dans les cinq cas, la distance du sol au bas de la zone couverte. Posée sur le visage de Dennis, elle donne 6,3 m, comme le point sélectif et la zone large (S) : « souvent le sol » ne vaut que si la zone descend jusqu'au sol.
- Preuve (calcul) : avec la recette de SIT-05 (f/8), une mise au point à 5,8 m donne une zone nette de 3,8 à 12,3 m : le groupe y reste, et le défi réussit quand même. Le piège annoncé ne se voit qu'à grande ouverture (à f/1.4 et 5,8 m, la zone nette s'arrête à 6,4 m, devant les yeux de Sophia).
- Correction proposée :
  - SIT-05 : « Attention à la zone large : dans TutoPhoto, elle fait le point au plus près dans la zone. Posée sur les pieds, elle prend le sol devant le groupe ; posée sur un visage, elle reste sur les personnages (MAP-05). À f/8, la zone nette pardonne cet écart ; à f/1.4, non. »
  - MAP-05, section « Simulateur » : ajouter « Dans une zone large, TutoPhoto retient le point le plus proche, même le sol : le manuel parle du sujet le plus proche, sans dire ce qui compte comme un sujet. »

### FMA-04 · à améliorer · NET-06 : quand l'appareil avance, le fond photo ne change pas ; la fiche ne le dit pas (repris de FIC-12)

- Endroit : `content/fr/notions/NET-06.md`, l. 11 ; `content/en/notions/NET-06.md`, l. 11.
- Ce qui est écrit : « Les personnages, eux, ne se déplacent pas encore […]. Le fond photo à 360° est à 500 m, ce qui revient à l'infini. »
- Preuve (code) : `app/src/ui/topView.ts`, l. 11-12 : « Non simulé : déplacer les personnages ; le fond photo à 360° est pris d'un seul point, et ce qu'il montre (arbres, bâtiments) ne change pas de perspective quand l'appareil se déplace. » La fiche dit la première limite, pas la seconde.
- Conséquence : l'exercice fait avancer l'appareil de 3 m. Dans un vrai parc, les arbres proches grossiraient et se décaleraient ; ici ils ne bougent pas, et leur flou est toujours celui d'un fond à 500 m, quelle que soit leur distance réelle. Calcul (`calculs.py`, 50 mm, f/4, mise au point à 6,6 m) : 0,094 mm pour un fond à 500 m, 0,095 mm à l'infini ; un arbre qui serait à 30 m donnerait 0,074 mm. Je ne sais pas à quelle distance sont les arbres de la photo : Poly Haven ne le publie pas.
- Correction proposée : ajouter « Le fond est une photo prise d'un seul point : quand l'appareil se déplace, les arbres et les bâtiments qu'elle montre ne changent ni de taille ni de place, et leur flou est celui d'un fond très lointain, même s'ils étaient proches. » ; en anglais : « The background is a photo taken from a single point: when the camera moves, the trees and buildings it shows change neither size nor place, and their blur is that of a very distant background, even if they were close. »

### FMA-05 · à améliorer · MAP-06 : la couverture du Z 6 prêtée aux trois autres boîtiers, dont deux reflex, sans dire que ce n'est pas sourcé (repris de FIC-13)

- Endroit : `content/fr/notions/MAP-06.md`, l. 9 (« Les boîtiers dont la couverture n'est pas encore chiffrée gardent celle du Z 6 ») ; `content/en/notions/MAP-06.md`, l. 9.
- Preuve (code) : `app/src/ui/cameraPanel.ts`, l. 62-66 : « les autres gardent celle du Z 6, ce qui n'est pas sourcé pour eux (décision de Julien du 11 novembre 2026 : hybrides ajoutés une fois lus, reflex en V2) ». Les boîtiers sans `afCoverage` sont le Nikon D5600, le Sony A6000 et le Canon EOS 2000D (`app/src/camera/bodies.ts`, l. 42, 58 et 72). La fiche dit « non sourcé » pour le partage égal du Sony A7 III, pas pour ce report.
- Preuve (source secondaire, relue pour l'audit) : Wikipedia, « Nikon D5600 », révision 1345325532 : « 39 point AF sensor with 9 central cross-type points » ; Wikipedia, « Canon EOS 2000D », révision 1381131251 : « 9 AF points with 1 cross-type point in the center ». Ce sont deux reflex, dont l'autofocus du viseur n'est pas celui d'un hybride. Je ne sais pas quelle part du cadre ces points couvrent : aucune page lue ne le dit.
- Correction proposée : « Les trois autres boîtiers gardent la couverture du Z 6, ce qui n'est pas sourcé : celle du Sony A6000 reste à lire, et les deux reflex (Nikon D5600, Canon EOS 2000D) ont un autofocus de viseur à 39 et 9 points, dont la couverture n'est pas lue. » Même chose en anglais.

### FMA-06 · à améliorer · MVT-01 : le critère « figé » est un choix de TutoPhoto présenté comme une règle, et il ne juge que le déplacement d'ensemble (repris de FIC-14)

- Endroit : `content/fr/notions/MVT-01.md`, l. 5 et 11 ; `content/en/notions/MVT-01.md`, l. 5 et 11.
- Ce qui est écrit : « On juge le sujet figé quand cette traînée reste sous le flou acceptable, la diagonale du capteur divisée par 1500 », avec l'article « Circle of confusion » pour source ; « La photo calculée montre le flou de mouvement réel, vue par vue en rafale. »
- Preuve (source relue) : l'article donne d / 1500 pour le flou de mise au point (« a widely used CoC limit is d/1500, or 0.029 mm for full-frame 35 mm format »). Sa partie historique dit qu'une limite de ce genre a servi pour le mouvement : « The common 1/100 inch CoC limit has been applied to blur other than defocus blur. For example, Wall (1889, p. 92) says: To find how quickly a shutter must act to take an object in motion […] » (constat PHY-20). Prendre d / 1500 pour le mouvement reste un choix de TutoPhoto ; « on juge » le présente comme une règle admise.
- Preuve (code) : la traînée jugée est celle du déplacement du porteur du modèle, à vitesse constante, 3,5 m/s pour le chien et 1,25 m/s pour le promeneur (`app/src/scene.ts`, l. 172-178 ; `app/src/camera/bulletin.ts`, l. 91-98). Les pattes du chien et les bras du promeneur vont plus vite que le corps : la photo calculée peut les montrer flous à une vitesse où le bulletin écrit « sous le flou acceptable ». Et l'appareil reste immobile pendant la pose (constat PHY-01) : le flou « réel » est un flou calculé, sans filé.
- Correction proposée : « TutoPhoto juge le sujet figé quand cette traînée reste sous le flou acceptable […] : il applique au mouvement la limite du flou de mise au point, comme on le faisait déjà en 1889 (même source) ; c'est un choix. » ; dans « Simulateur » : « Le bulletin juge le déplacement du corps : les pattes du chien, plus rapides, peuvent rester floues. La photo calculée montre ce flou de mouvement, vue par vue en rafale ; l'appareil, lui, ne bouge pas pendant la pose. » Même chose en anglais.

### FMA-07 · à améliorer · SIT-01 : la lumière, qui est dans le titre et dans les notions clés, n'est pas dans la recette (repris de FIC-15)

- Endroit : `content/fr/situations/SIT-01.md`, l. 1, 9-14 et 22 ; `content/en/situations/SIT-01.md`, mêmes lignes.
- Preuve : le titre est « Portrait à l'ombre ou par ciel couvert » ; LUM-02 est une notion clé de la situation (`data/situations.yaml`, SIT-01, `key_notions`) et la section « Notions » la cite. Les quatre autres notions clés ont leur ligne dans la recette (MAP-06, MAP-09, NET-01, NET-06) ; LUM-02 n'y apparaît pas, et la recette ne dit rien de la lumière. L'exercice de LUM-02 porte pourtant sur ce portrait (« Pour le portrait de Sophia […] »).
- Correction proposée : une ligne de recette, « **Lumière** : par ciel couvert, tout le ciel est la source, bien plus grande que Sophia : lumière douce, ombres peu marquées (LUM-02). Rien à régler : la scène n'a que cette lumière. » ; en anglais : « **Light**: under an overcast sky, the whole sky is the source, much larger than Sophia: soft light, faint shadows (LUM-02). Nothing to set: the scene only has this light. »

### FMA-08 · à améliorer · Formulations ambiguës dans trois exercices (repris de FIC-17, deuxième à quatrième points)

- `content/fr/notions/MAP-09.md`, l. 13 : « l'appareil prend le visage le plus proche du point de départ ». Le code prend le visage le plus proche du point de mise au point (`app/src/camera/autofocus.ts`, l. 21-24 et 306 ; `app/src/camera/faces.ts`, `nearestFace`), qui est au centre du cadre tant qu'on n'a rien touché (`app/src/ui/cameraPanel.ts`, l. 277). « Point de départ » peut se lire comme l'endroit d'où l'on photographie (la vue de dessus a un bouton « Retour au départ »). Correction : « le visage le plus proche du point de mise au point, au centre du cadre au départ » ; « the face closest to the focus point, at the centre of the frame at start ».
- `content/fr/notions/LUM-02.md`, l. 23 : « compare le plein soleil et le ciel couvert de la scène de parc ». La scène n'a que le ciel couvert (`content/fr/situations/SIT-06.md`, l. 5 ; `data/referentiel/lum.yaml`, note de LUM-02). Correction : « compare un plein soleil, que TutoPhoto ne montre pas, et le ciel couvert de la scène de parc » ; « compare full sun, which TutoPhoto does not show, with the park scene's overcast sky ».
- `content/fr/notions/MAP-05.md`, l. 16 : « (environ 5,8 m contre 6,1 m) » ne vaut que pour un cadre horizontal et un toucher tout en bas (92,5 % de la hauteur dans la mesure citée par FMA-03 ; à 80 % et 85 %, « près des pieds du groupe », le point sélectif donne 6,6 m et 7,1 m). La dernière phrase, « Choisis ensuite le mode adapté à chacun des trois défis et explique ton choix », n'a pas de réponse, alors que les autres exercices du lot donnent la leur. Correction : écrire « tout en bas du viseur, sous les pieds du groupe », et donner une réponse (SIT-01 : point sélectif sur l'œil, ou zone automatique ; SIT-05 : zone automatique, ou point sélectif sur un visage ; SIT-06 : zone automatique avec la détection des animaux).

### FMA-09 · à améliorer · NET-01, NET-06 et MVT-01 : Wikipedia citée sans dire que c'est une source secondaire ; dates de lecture qui ne sont pas celle de `data/sources.yaml` (repris de FIC-18, complété)

- Endroit : `content/fr/notions/NET-01.md`, l. 5 ; `NET-06.md`, l. 5 ; `MVT-01.md`, l. 5 ; mêmes lignes en anglais.
- Preuve :
  1. Les trois fiches citent la révision 1335590423 de « Circle of confusion » comme seule source d'une définition ou d'une formule, sans la qualifier ; `LUM-02.md` (l. 11) le fait (« source secondaire »), et `data/sources.yaml` aussi (`wikipedia-circle-of-confusion` : « source secondaire »).
  2. NET-01 et NET-06 écrivent « lue le 11 novembre 2026 » ; l'entrée de `data/sources.yaml` dit « lue le 10 novembre 2026 ». MVT-01 ne donne pas de date de lecture.
  3. Le libellé de l'entrée ne décrit que ce que le code en tire (flou acceptable, formule du diamètre). Ce que NET-01 en tire de plus (« A lens can precisely focus objects at only one distance », la valeur qui « depends on visual acuity, viewing conditions, and the amount of enlargement ») n'y est pas, ni le passage sur Wall (1889) dont MVT-01 a besoin (FMA-06).
- Ce qui est juste : toutes ces affirmations sont dans la révision citée (section « Vérifié »).
- Correction proposée : celle retenue pour FEX-18 à sa contre-vérification : écrire la règle une fois dans `docs/contenus.md` (une source secondaire est dite telle dans la fiche) et l'appliquer à toutes les fiches en une passe ; compléter le libellé de `wikipedia-circle-of-confusion` (ce que les fiches en tirent, lecture du 11 novembre) ; donner une date de lecture dans MVT-01.

### FMA-10 · à améliorer · Activité de LUM-02 : la pénombre annoncée peut dépasser le mur dessiné, et le mur paraît alors uniforme (repris de FIC-19, complété)

- Endroit : `app/src/activities/lum02.ts`, l. 165 et 175-181 ; `app/activites/LUM-02/index.html`, l. 28 et 30.
- Preuve (code) : le mur est dessiné de −100 à +100 cm (l. 175-181), dans une vue de −110 à +110 cm (l. 165). Les curseurs vont de 1 à 150 cm pour la taille et de 20 à 400 cm pour la distance (`index.html`, l. 28 et 30).
- Preuve (calcul, `calculs.py`, formules de `lum02.ts`, l. 130-146) : le bord extérieur de la pénombre est à (30 × (d₁ + 50) + 50 × D) / (2 × d₁) de l'axe. Il dépasse 100 cm pour 427 des 11 550 positions des curseurs (3,7 %), toutes à 50 cm ou moins de l'objet. À 150 cm et 20 cm : « Pénombre sur le mur : 375,0 cm de chaque côté de l'ombre », bord extérieur à ±240 cm. Le mur dessiné est alors éclairé partout à 72 % (0,72 à 0, 50 et 100 cm de l'axe) : aucun bord d'ombre n'est visible, alors que la consigne est de « regarde[r] le bord de l'ombre sur le mur ». Les rayons tracés sortent de la vue. Les trois exemples tiennent dans le mur (bord extérieur à ±23, ±34 et ±49 cm).
- Deuxième point : sans ombre pleine (2 035 positions sur 11 550, dont l'exemple « Réflecteur », où elle vaut −1,25 cm), la légende reste « Sur le mur : ombre pleine au centre […] » et la ligne « Pénombre sur le mur : 50,0 cm de chaque côté de l'ombre », alors que la troisième ligne écrit « Pas d'ombre pleine ».
- Preuve (mesure, ajoutée à la reprise : `activite.cjs`, page construite de l'activité, Chromium sans écran, fenêtres de 1280 × 800 et de 390 × 844) : curseurs à 150 cm et 20 cm, la page écrit « Pénombre sur le mur : 375,0 cm de chaque côté de l'ombre » et « Pas d'ombre pleine […] », et les 160 rectangles du mur ont une seule couleur, `rgb(195 188 155)` ; exemple « Réflecteur », « Pénombre sur le mur : 50,0 cm de chaque côté de l'ombre », « Pas d'ombre pleine : la source, vue du mur, déborde l'objet de toutes parts. », sous la légende « Sur le mur : ombre pleine au centre […] ». Mêmes textes en anglais.
- Troisième point (ajouté à la reprise) : ce que le schéma ne simule pas et que ni la page ni la fiche ne disent. Un point du mur que rien ne cache a toujours le même éclairement, quelle que soit la distance de la source (`lum02.ts`, l. 140-146 : `litFraction` rend 1 ; mesure : `rgb(255 245 200)` pour la lampe de 3 cm à 20 cm comme à 400 cm). Dans la réalité, rapprocher une lampe éclaire plus : « doubling the distance reduces illumination to one quarter » (Wikipedia, « Inverse-square law », révision 1384166303 du 6 novembre 2026, source secondaire, `https://en.wikipedia.org/w/index.php?title=Inverse-square_law&oldid=1384166303`, lue le 13 novembre 2026). Et l'ombre pleine est noire, sans lumière renvoyée par la pièce. La fiche dit seulement : « la largeur de la pénombre est juste, la forme exacte du dégradé est simplifiée ».
- Correction proposée : quand le bord extérieur dépasse 100 cm, ajouter « (au-delà du mur dessiné) » à la ligne de la pénombre ; sans ombre pleine, écrire « Pénombre sur le mur : … cm de chaque côté ; les deux se rejoignent » et retirer « ombre pleine au centre » de la légende. Ou borner la distance minimale du curseur à 55 cm, ce qui supprime le premier cas. Pour le troisième point, une phrase dans le texte « Calcul » de la page et dans la fiche : « Le schéma ne montre que la part de la source vue de chaque point du mur : il ne dit pas que la lampe éclaire plus fort de près, ni que la pièce renvoie de la lumière dans l'ombre. » ; « The diagram only shows how much of the source each point of the wall sees: it does not show that the lamp lights more strongly up close, nor that the room bounces light into the shadow. »

### FMA-12 · incohérent · NET-01 : la vue de dessus cercle de vert un personnage que le bulletin déclare hors de la zone nette

- Endroit : `content/fr/notions/NET-01.md`, l. 11 ; `content/en/notions/NET-01.md`, l. 11 ; `app/src/ui/topView.ts`, l. 142-150 ; `app/src/ui/shutter.ts`, l. 405.
- Ce qui est écrit : « la vue de dessus, qui dessine la zone nette entre deux plans perpendiculaires à l'axe et cercle de vert les sujets qui y sont. L'indicateur d'équilibre et le bulletin donnent les limites en mètres. »
- Preuve (code) : la vue de dessus juge un personnage à sa position de chargement, au sol (`topView.ts`, l. 143-150, avec `LANDMARKS`, `app/src/scene.ts`, l. 58-64 : Dennis à 6,5 m, Sophia à 6,6 m, Fabienne et Percy à 6,5 m, un seul cercle pour les deux). Le bulletin et les défis jugent les yeux (`shutter.ts`, l. 405 : `points: s.eyes()` ; `app/src/camera/bulletin.ts`, l. 84-105). Positions des yeux relues dans les fichiers glTF par la première passe (`yeux_gltf.py`) : Dennis à 6,30 et 6,32 m, Percy à 6,30 et 6,35 m, Fabienne à 6,41 m, Sophia de 6,54 à 6,64 m selon l'instant. Les yeux de Dennis sont donc 18 à 20 cm devant son repère.
- Preuve (mesure, `essais.cjs`, essai 4 : 85 mm, mode A à f/1,4, AF-S, zone automatique, visages et yeux, défi SIT-05, un toucher sur le groupe) : l'autofocus écrit « œil · verrouillée à 6,5 m » ; la vue de dessus cercle de vert Dennis, Sophia et le cercle de Fabienne et Percy, avec la note « Zone nette : 6,3 m – 6,8 m » ; le bulletin de la photo prise aussitôt écrit « Zone nette : 6,3 m – 6,8 m (mise au point à 6,5 m) », puis « Manqué : les quatre visages du groupe dans le cadre et dans la zone nette : manqués : Dennis, Percy ». La vue de dessus, relue après la photo, n'a pas changé.
- Calcul (`calculs2.py`) : au 85 mm et à f/1.4, une mise au point à 6,55 m donne une zone nette de 6,32 à 6,80 m ; les repères au sol (6,5 m) y sont, les yeux de Dennis (6,30 et 6,32 m) n'y sont pas.
- Conséquence : le débutant qui se fie à la vue de dessus pour le défi SIT-05 voit tout le groupe cerclé de vert, puis lit « Manqué ». La fiche présente les deux affichages comme la même mesure.
- Correction proposée : dans `topView.ts`, juger les personnages et le chien sur les points que juge le bulletin (leurs yeux, `subjects`), et garder la position au sol pour le dessin ; la phrase de la fiche devient alors juste. Tant que le code n'est pas corrigé, écrire dans la fiche : « cercle de vert les personnages dont la position au sol y est ; le bulletin, lui, juge leurs yeux, jusqu'à 20 cm plus près de l'appareil ». Même chose en anglais.

### FMA-13 · à améliorer · MVT-01, exercice : « 1/200 s » et « 1/800 s » ne valent qu'avec un boîtier plein format et au 50 mm, ce que l'exercice ne dit pas

- Endroit : `content/fr/notions/MVT-01.md`, l. 15 ; `content/en/notions/MVT-01.md`, l. 15.
- Ce qui est écrit : « Trouve la vitesse la plus lente qui fige le promeneur (1/200 s), puis celle qui fige le chien (1/800 s), et vérifie-les avec le bulletin ; réussis le défi SIT-06. »
- Preuve (calcul, `calculs2.py`, formules de `bulletin.ts`, valeurs exactes des crans ; chien à 3,5 m/s et 9 m, promeneur à 1,25 m/s et 12,5 m) : première pose « figée » de l'échelle, selon le boîtier et la focale.

  | Focale | Plein format (Nikon Z 6, Sony A7 III, Canon EOS RP) | APS-C (Nikon D5600, Sony A6000, Canon EOS 2000D) |
  | --- | --- | --- |
  | 50 mm | promeneur 1/200 s ; chien 1/800 s | promeneur 1/320 s ; chien 1/1250 s |
  | 85 mm | promeneur 1/320 s ; chien 1/1250 s | promeneur 1/500 s ; chien 1/2000 s |
  | 135 mm | promeneur 1/500 s ; chien 1/2000 s | promeneur 1/800 s ; chien 1/3200 s |

- Preuve (mesure, `essais.cjs`, essai 7 : Nikon Z 6, 50 mm, mode S, AF-C, zone automatique, détection des animaux, défi SIT-06) : à 1/800 s, « le chien : traînée de 1,0 px, sous le flou acceptable (limite 1,2 px) », défi réussi ; à 1/640 s, « 1,3 px, au-delà du flou acceptable », « Manqué : chien figé » ; à 1/200 s, « le promeneur : traînée de 1,0 px, sous le flou acceptable » ; à 1/160 s, « le promeneur : traînée de 1,3 px, au-delà du flou acceptable ». Les deux réponses de la fiche sont donc justes avec le boîtier et la focale de départ.
- Ce qui manque : l'explication dit « en plein format » (l. 5) et « au 50 mm » (l. 7) pour son calcul, mais l'exercice ne reprend ni le boîtier ni la focale. Le simulateur propose trois boîtiers APS-C et garde le choix d'une visite à l'autre (constat FEX-13, même cause, pour MES-10, BOI-08 et BOI-12) ; avec l'un d'eux, le débutant qui règle 1/800 s lit « Manqué : chien figé » et une fiche qui lui dit le contraire.
- Correction proposée : « Avec le boîtier de départ (Nikon Z 6) et le 50 mm : trouve la vitesse la plus lente qui fige le promeneur (1/200 s), puis celle qui fige le chien (1/800 s) […]. Avec un boîtier APS-C, le flou acceptable est plus petit : 1/320 s et 1/1250 s. Une focale plus longue grossit le sujet et sa traînée : au 85 mm, 1/320 s et 1/1250 s en plein format. » Même chose en anglais.

### FMA-14 · à améliorer · MAP-04, MAP-05, MAP-06 et MAP-09 : les seuls noms de Nikon, alors que le simulateur propose des boîtiers Canon et Sony ; en français, Nikon n'écrit pas « collimateur »

- Endroit : `content/fr/notions/MAP-04.md`, l. 5-9 ; `MAP-05.md`, l. 5-8 ; `MAP-06.md`, l. 1 et 5 ; `MAP-09.md`, l. 5 ; mêmes lignes en anglais.
- Ce qui est écrit : « AF-S » et « AF-C », « AF point sélectif », « AF zone large (S) et (L) », « AF zone automatique », « réglage a4 », d'après le manuel du Z 6 ; pour MAP-04 seulement, « Le Sony α9 décrit les mêmes modes ». MAP-06 a pour titre « Collimateurs » et écrit « 273 collimateurs ».
- Preuve (dépôt) : le simulateur propose deux boîtiers Canon et deux Sony (`app/src/camera/bodies.ts`, l. 52-74) ; sa fenêtre « Mise au point » n'a que les noms de Nikon (`app/src/i18n.ts`, l. 46-59 et 280-296). Le référentiel cite pour MAP-04 et MAP-05 des manuels de Canon, de Sony et de Fujifilm (`data/referentiel/map.yaml` : `canon-r5-af-operation`, `canon-r5ii-af-area`, `sony-a7iv-focus-area`, `sony-a7riv-automatic-af`, `fujifilm-gfx100-af`) ; aucune de ces sources n'a de date de lecture ni de citation dans `data/sources.yaml`, et les fiches ne s'en servent pas.
- Preuve (sources lues le 13 novembre 2026) :

  | Marque | Sujet immobile, sujet en mouvement | Zone de mise au point | Mot pour le point de mesure, en français |
  | --- | --- | --- | --- |
  | Nikon Z 6 | « AF-S AF ponctuel », « AF-C AF continu » ; « Single AF », « Continuous AF » | « AF point sélectif », « AF zone large (S) », « AF zone automatique » ; « Single-point AF », « Wide-area AF (S) », « Auto-area AF » | « point AF » (33 fois dans la page « Mise au point ») ; « collimateur de mise au point » n'y est que pour la mise au point manuelle (2 fois) |
  | Sony A7 III | « AF ponctuel », « AF continu » ; « Single-shot AF », « Continuous AF » | « Zone mise au point » : « Large », « Zone », « Centre », « Spot flexible » ; « Focus Area » : « Wide », « Zone », « Center », « Flexible Spot » | « collimateur » (« le collimateur souhaité ») |
  | Canon EOS 850D (boîtier voisin) | « AF One-Shot », « AF Ai Servo » au viseur, « AF Servo » en visée par l'écran ; « One-Shot AF », « AI Servo AF », « Servo AF » | visée par l'écran : « 1 collimateur AF », « Zone AF », « +Suivi » ; « 1-point AF », « Zone AF », « +Tracking » | « collimateur AF » |

  Adresses : Nikon, pages citées par les fiches ; Sony, `https://helpguide.sony.net/ilc/1720/v1/fr/print.pdf` et `…/en/print.pdf` (« Mode mise au point », « Zone mise au point » ; lus dans le texte extrait par l'audit des fiches d'exposition, fichiers `sony-ilce-7m3-fr.txt` et `sony-ilce-7m3-en.txt` de son dossier) ; Canon, `https://cam.start.canon/fr/C002/manual/html/UG-04_AF-Drive_0020.html` (« Opération autofocus »), `…_0030.html` et `…_0040.html`, et les mêmes sous `/en/` (fichiers `canon-850d-fr-afdrive-0020.html` et suivants). Les manuels de l'EOS RP et de l'EOS 2000D n'ont pas été trouvés sur l'hôte joignable (constat FEX-15) : les termes de Canon viennent d'un boîtier voisin.
- Conséquence : un débutant qui a un Canon ne trouvera ni « AF-S » ni « AF-C » sur son boîtier, alors que le simulateur lui propose son boîtier ; un débutant qui a un Nikon réglé en français ne trouvera pas « collimateur » dans ses menus, mais « point AF » (« a5 : Points AF utilisés »).
- Correction proposée, une phrase par fiche, avec ces sources (à ajouter à `data/sources.yaml` pour Canon) :
  - MAP-04 : « Canon appelle ces modes « AF One-Shot » et « AF Servo » (« AF Ai Servo » au viseur d'un reflex). » ; « Canon calls these modes One-Shot AF and Servo AF (AI Servo AF through a DSLR's viewfinder). »
  - MAP-05 : « Sony les range sous « Zone mise au point » (« Large », « Zone », « Centre », « Spot flexible ») ; Canon, en visée par l'écran, sous « Méthode autofocus » (« 1 collimateur AF », « Zone AF », « +Suivi »). » ; en anglais, les termes de la colonne.
  - MAP-06 : « Les menus français de Nikon écrivent « point AF » ; ceux de Canon et de Sony, « collimateur ». »
  - Même réserve que pour FEX-15 : le manuel de Canon lu est celui de l'EOS 850D. Que la fenêtre « Mise au point » suive la marque choisie est une autre question, pour le rapport de l'interface et pour Julien.

### FMA-15 · à améliorer · Référentiel : les sources des notions NET-01, LUM-02 et MAP-04 ne sont pas celles de leurs fiches

- Endroit : `data/referentiel/net.yaml` (NET-01), `lum.yaml` (LUM-02), `map.yaml` (MAP-04), champ `sources`.
- Preuve (script : adresses citées par chaque fiche, rapportées aux identifiants de `data/sources.yaml`, puis comparées au champ `sources` de la notion) :
  1. NET-01 : la fiche ne cite que `wikipedia-circle-of-confusion` ; la notion ne liste que `pl-lens-compression` (« Photography Life, What is Lens Compression? »), entrée sans date de lecture, sans citation et sans `used_in`. L'adresse répond 403 le 13 novembre 2026 : source non relue. Le domaine NET, lui, liste bien les deux.
  2. LUM-02 : la fiche et l'activité citent `wikipedia-umbra-penumbra` ; la notion ne liste que `tiffen-lowel-soft-light` et `pvc-adams-soft-light`.
  3. MAP-04 : la fiche cite `nikon-z6-defaults` (« L'AF-S est le réglage par défaut du Z 6 ») ; la notion ne le liste pas.
- Pour les cinq autres notions du lot, toutes les sources citées par la fiche sont dans le champ `sources`.
- Règle : `docs/lire-le-referentiel.md`, « `sources` : identifiants de `data/sources.yaml` », sans dire s'il s'agit des sources de la fiche ou de la spécification. `scripts/validate.py` contrôle que l'identifiant existe, pas que la fiche et la notion concordent.
- Correction proposée : ajouter `wikipedia-circle-of-confusion` à NET-01, `wikipedia-umbra-penumbra` à LUM-02 et `nikon-z6-defaults` à MAP-04 ; pour `pl-lens-compression`, la lire (Julien peut la relever, comme les pages de Canon et de Sony) ou la retirer de NET-01, où rien ne s'en sert. Écrire dans `docs/lire-le-referentiel.md` que le champ contient au moins les sources de la fiche.

### FMA-16 · à améliorer · NET-06, exercice : après le déplacement, la mise au point reste verrouillée là où elle était ; l'exercice ne dit pas de la refaire

- Endroit : `content/fr/notions/NET-06.md`, l. 15 ; `content/en/notions/NET-06.md`, l. 15.
- Ce qui est écrit : « Depuis le point de départ, à f/4 et au 50 mm, la zone nette autour de Sophia va jusqu'à 9,5 m. Avance l'appareil sur la carte jusqu'à environ 3,6 m d'elle : la zone nette se réduit à 3,1–4,3 m et tout ce qui est derrière elle en sort. »
- Preuve (code) : le simulateur démarre en AF-S (`app/src/ui/cameraPanel.ts`, l. 265). En AF-S, la distance est « verrouillée jusqu'au toucher suivant » (`app/src/camera/autofocus.ts`, l. 6-10). Toucher la carte ne fait que déplacer l'œil et redessiner la vue (`app/src/ui/topView.ts`, l. 89-99 : `this.eye.set(…)`, `this.draw()`) : aucune mesure de distance n'est relancée.
- Preuve (mesure, `essais.cjs`, essai 5) : après la photo prise à 3,5 m de Sophia, le bouton « Retour au départ » ramène l'appareil à 6,6 m d'elle, et l'autofocus écrit toujours « AF-S · Auto · œil · verrouillée à 3,5 m ».
- Preuve (mesure, `essais2.cjs`, essai 11, dans l'autre sens, défi SIT-01) : un toucher au départ verrouille la mise au point (ici sur le visage du promeneur, à 12,4 m, voir la section « Vérifié », MAP-09) ; l'appareil est ensuite avancé de 3 m sur la carte, sans retoucher le viseur : l'autofocus écrit toujours « verrouillée à 12,4 m », et l'indicateur d'équilibre comme la vue de dessus gardent « zone nette : 7,9 m – 28,7 m ». La photo prise ainsi : « Zone nette : 7,9 m – 28,7 m (mise au point à 12,4 m) », « Manqué : œil de Sophia dans le cadre et dans la zone nette (3,6 m) ». Après un nouveau toucher sur Sophia : « œil · verrouillée à 3,5 m », « Zone nette : 3,0 m – 4,2 m ».
- Calcul (`calculs2.py`, 50 mm, f/4) : mise au point restée à 6,6 m, la zone nette va de 5,07 à 9,45 m de l'appareil ; une fois l'appareil avancé de 3 m, l'œil de Sophia est à 3,55 m, hors de cette zone, qui couvre maintenant ce qui est derrière elle. La zone ne « se réduit » qu'après une nouvelle mise au point : 3,06 à 4,23 m pour 3,55 m.
- Conséquence : le débutant qui a fait le point sur Sophia pour lire « jusqu'à 9,5 m » (ce qui verrouille la distance), puis avance, voit dans la vue de dessus une zone nette de 4,4 m de profondeur derrière elle, et sa photo manque le premier critère du défi.
- Correction proposée : « Avance l'appareil sur la carte jusqu'à environ 3,6 m d'elle, puis touche de nouveau son œil : en AF-S, la mise au point reste à la distance verrouillée tant qu'on ne retouche pas le viseur (MAP-04). La zone nette se réduit alors à 3,1–4,3 m […]. » ; en anglais : « […] then tap her eye again: in AF-S, focus stays at the locked distance until the viewfinder is tapped again (MAP-04). The sharp zone then shrinks to 3.1–4.3 m […]. »

### FMA-17 · à améliorer · SIT-01 : le défi est « réussi » sur une photo surexposée de 3,8 IL ; aucun défi ne regarde l'exposition, et la fiche ne le dit pas

- Endroit : `content/fr/situations/SIT-01.md`, l. 10 et 18 ; `content/en/situations/SIT-01.md`, mêmes lignes ; `app/src/camera/bulletin.ts`, l. 115-140.
- Ce qui est écrit : recette, « **Mode A, f/2** » ; défi, « l'œil de Sophia dans le cadre et dans la zone nette, et le fond derrière elle hors de la zone nette ».
- Preuve (code) : les critères des trois défis ne lisent que le cadre, la zone nette et la traînée (`bulletin.ts`, l. 115-140). L'écart d'exposition est une ligne du bulletin, sans jugement (`app/src/ui/challenges.ts`, l. 153-155).
- Preuve (mesure, sortie `essais-123.out`, essai 2 : mode M de départ, f/2, 1/100 s, ISO auto, défi SIT-01) : l'écran écrit « M · +3,8 IL » ; le bulletin, « Exposition : +3,8 IL », puis « Défi SIT-01 · Portrait à l'ombre ou par ciel couvert : réussi », « Réussi : œil de Sophia dans le cadre et dans la zone nette (6,6 m) », « Réussi : fond derrière Sophia hors de la zone nette ».
- Preuve (mesure refaite, `essais2.cjs`, essai 14 : mêmes réglages, un toucher sur Sophia pour que la mise au point soit sur son œil) : « M · +3,8 IL », « AF-S · Auto · œil · verrouillée à 6,6 m » ; bulletin : « Exposition : +3,8 IL », « Zone nette : 5,7 m – 7,7 m (mise au point à 6,6 m) », « Défi SIT-01 · Portrait à l'ombre ou par ciel couvert : réussi ».
- Comment on y arrive : le simulateur démarre en mode M, à f/8 et 1/100 s, ISO auto (`cameraPanel.ts`, l. 243-247 ; `app/src/camera/exposure.ts`, l. 80-84). Le débutant qui ouvre à f/2 sans passer en mode A garde 1/100 s ; la sensibilité ne descend pas sous ISO 100 : la photo reçoit 2^3,8 ≈ 14 fois trop de lumière.
- Conséquence : le bulletin écrit « réussi » sous un portrait brûlé. Les trois défis sont dans ce cas ; SIT-01 y est le plus exposé, parce que sa recette demande d'ouvrir.
- Correction proposée :
  - fiche, section « Défi » : « Le défi ne juge ni l'exposition ni le bruit : lis aussi la ligne « Exposition » du bulletin (EXP-04). » ; « The challenge judges neither exposure nor noise: also read the report's "Exposure" line (EXP-04). »
  - simulateur, Julien tranche : ajouter aux défis un critère d'exposition. Le seuil est à sourcer ; sans seuil, le bulletin peut au moins répéter l'écart d'exposition à côté du verdict du défi.

### FMA-18 · à améliorer · SIT-05 : au 50 mm, le défi réussit à toutes les ouvertures ; la profondeur de champ, première notion clé de la situation, n'y joue pas

- Endroit : `content/fr/situations/SIT-05.md`, l. 10 et 16 ; `content/en/situations/SIT-05.md`, mêmes lignes.
- Ce qui est écrit : « **Mode A, f/8** : […] Le groupe est sur un seul rang : une petite ouverture n'est pas indispensable, mais elle laisse de la marge si la mise au point tombe un peu devant ou derrière. »
- Preuve (calcul, `calculs2.py`) : les yeux du groupe sont entre 6,30 m (Dennis, Percy) et 6,64 m (Sophia), soit 34 cm de profondeur. Au 50 mm, mise au point à 6,6 m, la zone nette va de 5,96 à 7,39 m à f/1.4 : tout le groupe y est, comme à f/2, f/2.8, f/4, f/5.6 et f/8. Mise au point sur l'œil de Dennis (6,30 m), à f/1.4 : de 5,72 à 7,01 m, tout le groupe encore.
- Preuve (mesure) : à f/1,4 et au 50 mm, mise au point sur l'œil de Sophia, « Zone nette : 5,9 m – 7,4 m (mise au point à 6,6 m) », « Défi SIT-05 · Photo de groupe : réussi », « Réussi : les quatre visages du groupe dans le cadre et dans la zone nette » (`essais2.cjs`, essai 12). À f/8, défi réussi, mise au point sur Percy à 6,3 m (`essais.cjs`, essai 8) ou sur Sophia à 6,6 m (première passe, essai 5). Au 50 mm, le défi n'échoue que si le point n'est pas sur le groupe : à l'ouverture du simulateur, le point sélectif vise entre Sophia et Fabienne, « AF-S · Point · 26,7 m », zone nette « 7,7 m – ∞ ».
- Ce qui est juste : la fiche dit elle-même que f/8 « n'est pas indispensable ». Mais la situation a pour intention « Tout le monde net » et pour première notion clé NET-01 : telle qu'elle est écrite, elle ne fait jamais sentir pourquoi on ferme le diaphragme pour un groupe.
- Ce que la scène permet déjà (mesure, essai 4, constat FMA-12) : au 85 mm et à f/1,4, mise au point sur Sophia, le bulletin écrit « manqués : Dennis, Percy ». Calcul : au 85 mm, mise au point à 6,5 m, la zone nette va de 6,27 à 6,74 m à f/1.4 et de 6,06 à 7,01 m à f/2.8.
- Correction proposée : ajouter à la recette « Pour voir la profondeur de champ jouer : passe au 85 mm et ouvre à f/1.4, le point sur Sophia. Le bulletin écrit « manqués : Dennis, Percy » : leurs yeux sont 30 cm devant les siens. Ferme à f/2.8 pour les retrouver (NET-01). » ; même chose en anglais. Les deux valeurs sont à rejouer dans le simulateur avant d'être écrites (la mise au point sur l'œil de Sophia varie de 6,5 à 6,6 m selon l'instant).

### FMA-20 · à améliorer · SIT-05, SIT-06, NET-01 et NET-06 : trois chiffres ne sont pas ceux que le simulateur affiche avec les réglages annoncés

- `content/fr/notions/NET-01.md`, l. 15, et `NET-06.md`, l. 15 (et l'anglais) : « la zone nette va de 5,1 m à 9,5 m », « va jusqu'à 9,5 m ». Le bulletin écrit « Zone nette : 5,1 m – 9,4 m (mise au point à 6,6 m) » (`essais.cjs`, essai 10 : mode A, f/4, 50 mm, œil de Sophia). Calcul (`calculs.py`) : 9,446 m, qui s'arrondit à 9,4 ; f/4 est un cran entier, le libellé n'y change rien.
- `content/fr/situations/SIT-06.md`, l. 11 (et l'anglais) : « la zone nette autour de 9 m va de 7,2 m à 12,1 m ». Le bulletin écrit « Zone nette : 7,1 m – 12,1 m (mise au point à 9,0 m) » (première passe, sortie `preuves-45678.out`, essai 7, mode S à 1/1000 s, « Ouverture (auto) f/2,5 »). Calcul (`calculs.py`) : avec la valeur exacte du cran, 2^(8/6) ≈ 2,52, la limite proche est à 7,146 m ; avec le libellé 2,5, à 7,158 m, d'où « 7,2 ». Même cause que le constat PHY-16 (exemples calculés avec les libellés).
- `content/fr/situations/SIT-05.md`, l. 10 (et l'anglais) : « mise au point à 6,5 m, la zone nette va de 4,1 m à 16 m ». Avec le réglage de la recette (zone automatique, visages et yeux), l'appareil prend l'œil de Sophia, le visage le plus proche du centre : le bulletin écrit « Zone nette : 4,1 m – 16,5 m (mise au point à 6,6 m) » (même sortie, essai 5). Calcul : 15,99 m pour 6,5 m ; 16,61 m pour 6,6 m.
- Les autres chiffres des trois recettes sont ceux du simulateur (section « Vérifié »).
- Correction proposée : NET-01 et NET-06, « 9,4 m » ; SIT-06, « de 7,1 m à 12,1 m » ; SIT-05, « mise au point sur l'œil de Sophia, à 6,6 m, la zone nette va de 4,1 m à 16,5 m environ ». Même chose en anglais.

### FMA-11 · incohérent · MAP-04 : dans le parc, l'AF-S verrouillé sur le chien réussit le défi SIT-06 comme l'AF-C ; l'exercice n'oppose pas deux modes, mais deux endroits où faire le point

- Endroit : `content/fr/notions/MAP-04.md`, l. 13 et 17 ; `content/en/notions/MAP-04.md`, mêmes lignes ; `data/referentiel/map.yaml`, MAP-04, `spec`.
- Ce qui est écrit : « En AF-S, verrouille la mise au point sur le groupe (6,5 m) puis photographie le chien quand il passe : le bulletin le dit hors de la zone nette à f/2. Recommence en AF-C, zone automatique et détection des animaux, en Continu H : le défi SIT-06 peut réussir. »
- Ce que la notion annonce (`data/referentiel/map.yaml`) : simulateur, « Sujet qui approche : en ponctuel la netteté décroche, en continu elle suit » ; exercice, « Rafale nette sur un chien qui court vers soi ». La fiche dit, elle, que « dans le parc, le chien court de côté, à environ 9 m ».
- Preuve (code) : le chien fait des allers-retours le long de x, à z = 9 m (`app/src/scene.ts`, l. 307 et 316). La zone nette est limitée par deux plans perpendiculaires à l'axe, et le chien est jugé à sa profondeur le long de l'axe (`app/src/camera/bulletin.ts`, l. 10-12 et 105). Appareil non tourné, cette profondeur reste 9,0 m d'un bout à l'autre du trajet : une distance verrouillée sur lui reste bonne.
- Preuve (mesure, `essais.cjs`, essai 9 : mode S à 1/1000 s, AF-S, zone automatique, détection des animaux, défi SIT-06 ; un toucher quand le chien est dans le cadre donne « AF-S · Auto · œil · verrouillée à 9,0 m ») : trois photos, le chien à trois endroits de son trajet (x = −3,8 m, 0,8 m et 3,4 m à l'appel) ; chaque fois « mise au point verrouillée à 9,0 m », « Zone nette : 7,1 m – 12,1 m », « Défi SIT-06 · Enfant ou chien qui court : réussi », les trois critères réussis.
- Calcul (`calculs.py`, `calculs2.py`) : si l'on tourne l'appareil pour suivre le chien jusqu'au bout de son trajet (x = 5 m), il est à 10,3 m. Une mise au point restée à 9 m couvre de 7,15 à 12,15 m à f/2.5, de 7,46 à 11,33 m à f/2, de 7,86 à 10,53 m à f/1.4 : le chien y reste. L'écart entre les deux modes ne se verrait qu'au téléobjectif (200 mm, f/1.4 : de 8,92 à 9,08 m).
- Conséquence : l'exercice fait conclure « l'AF-S échoue, l'AF-C réussit », alors que ce qui échoue est d'avoir fait le point sur le groupe et non sur le chien. Le débutant qui essaie l'AF-S sur le chien voit le simulateur contredire la leçon.
- Deux comportements de l'AF-S que la section « Simulateur » (l. 13) ne dit pas, et qui jouent dans cet exercice :
  1. une photo prise sans avoir touché le viseur fait le point au déclenchement, et cette distance reste verrouillée ensuite (`app/src/camera/autofocus.ts`, l. 9-10 et 209-216). Mesure (sortie `essais-123.out`, essai 1) : première photo prise quand le chien était hors du cadre, « sujet le plus proche · mise au point à 5,8 m » ; les suivantes, « verrouillée à 5,8 m », « Manqué : chien dans la zone nette (9,0 m) » ;
  2. en zone automatique, un toucher quand aucun animal n'est détecté verrouille la distance du point touché (`autofocus.ts`, l. 318-322). Mesure (essai 9) : les deux premiers touchers, le chien hors du cadre puis caché, donnent « point touché · verrouillée à 500,0 m ».
- Correction proposée :
  - fiche, exercice : « Dans le parc, le chien reste à 9 m de l'appareil : une distance verrouillée sur lui reste bonne, et l'AF-S réussit aussi le défi. Ce que l'exercice montre : en AF-S, la distance ne suit pas un changement de sujet (du groupe au chien) ; en AF-C, elle suit. La différence entre les deux modes sur un sujet qui approche attend une scène où le sujet vient vers l'appareil. » ; section « Simulateur » : « En AF-S, une photo prise sans toucher le viseur fait le point au déclenchement, et cette distance reste verrouillée ensuite. » Même chose en anglais ;
  - scène, plus tard, Julien tranche : un sujet qui court vers l'appareil est ce que demande le référentiel ; `CLAUDE.md` interdit d'étendre la V1 minimale avant son test avec des débutants.

### FMA-21 · à améliorer · Section « Notions » des situations : la liste ne suit ni les notions clés ni les notions citées par la recette

- Endroit : `content/fr/situations/SIT-01.md`, l. 22 ; `SIT-06.md`, l. 21 ; mêmes lignes en anglais ; `docs/contenus.md`, l. 46 et 71.
- Preuve (fiches et `data/situations.yaml`) :

  | Situation | Notions clés (`key_notions`) | Citées par la recette | Section « Notions » |
  | --- | --- | --- | --- |
  | SIT-01 | MAP-06, MAP-09, NET-01, NET-06, LUM-02 | BOI-07, NET-01, MAP-04, MAP-09, MAP-06, CMP-02, NET-06 | les cinq notions clés et CMP-02 ; ni BOI-07 ni MAP-04 |
  | SIT-05 | NET-01, MAP-05, MAP-09 | NET-01, MAP-05, MAP-09 | les trois |
  | SIT-06 | MAP-04, MAP-05, MVT-01, MES-10, BOI-12 | BOI-08, MVT-01, MES-10, MAP-04, MAP-05, MAP-09, BOI-12 | les cinq notions clés et BOI-08 ; pas MAP-09 |

- Règle écrite : `docs/contenus.md`, l. 46, « Les notions liées », sans dire lesquelles. Effet (`docs/contenus.md`, l. 71 ; `app/scripts/build-pages.mjs`, l. 594-595) : la page d'une notion liste les situations dont la section « Notions » la cite. La page de MAP-09 ne liste donc pas SIT-06, dont la recette demande la détection des animaux, et celle de MAP-04 ne liste pas SIT-01, dont la recette demande l'AF-S.
- Correction proposée : écrire la règle dans `docs/contenus.md` (les notions clés, puis toute notion que la recette cite), et compléter SIT-01 (BOI-07, MAP-04) et SIT-06 (MAP-09), en français et en anglais.

### FMA-22 · à améliorer · MAP-09, « Simulateur » : en AF-S, le repère n'entoure aucun visage avant le toucher ; la fiche décrit le comportement du Z 6, pas celui du simulateur

- Endroit : `content/fr/notions/MAP-09.md`, l. 9 ; `content/en/notions/MAP-09.md`, l. 9 ; `app/src/camera/autofocus.ts`, l. 138-140 et 160-165.
- Ce qui est écrit : « Le repère entoure l'œil ou le visage retenu, en ambre, puis en vert une fois verrouillé en AF-S. »
- Preuve (code) : la détection n'est relancée en continu qu'en AF-C ; en AF-S, elle n'a lieu qu'au toucher ou au déclenchement (`autofocus.ts`, l. 138-140 : `if ((this.focusMode === "continuous" || !this.measuredOnce) && …) void this.measure()`). Le repère est ambre quand une cible est détectée sans verrou, vert quand la distance est verrouillée (`app/src/ui/cameraPanel.ts`, l. 996-998 ; `app/src/style.css`, l. 574-576 et 668-670). En AF-S, un toucher mesure et verrouille d'un coup : le repère passe au vert sans étape ambre.
- Preuve (mesure) :
  1. première passe, sortie `preuves-45678.out`, essai 4, à l'ouverture du simulateur (AF-S), zone automatique et détection des visages et des yeux choisies, viseur non touché : « AF-S · Auto · 26,7 m », repère au centre du cadre (50 % ; 50 %), sur aucun visage ; la photo, elle, fait le point sur l'œil (« AF-S · Auto · œil · mise au point à 6,6 m ») ;
  2. `essais.cjs`, essai 8, juste après être passé de l'AF-C avec détection des animaux à l'AF-S avec détection des visages : l'autofocus écrit encore « AF-S · Auto · œil · 9,0 m », repère resté à l'endroit où le chien était (42,8 % ; 58,1 % du cadre). Le passage en AF-S garde l'ancienne cible (`autofocus.ts`, l. 160-165) : un cadre ambre reste affiché sur du vide.
- Preuve (source relue) : sur le Z 6, la bordure ambre apparaît dès qu'un visage est détecté : « If Face and eye detection on is selected and a portrait subject is detected, an amber border indicating the focus point will appear around the subject's face or, if the camera detects the subject's eyes, one or the other of their eyes […]. If AF-C is selected for focus mode, the focus point will light amber when faces or eyes are detected, while if AF-S is selected, the focus point will turn green when the camera focuses. » (« Focus »). La phrase de la fiche décrit cela, que le simulateur ne fait qu'en AF-C.
- Conséquence : le simulateur démarre en AF-S. Le débutant qui choisit la zone automatique ne voit aucun cadre sur les visages tant qu'il n'a pas touché le viseur ou déclenché, et ne peut pas savoir quel visage l'appareil prendra.
- Correction proposée :
  - fiche : « En AF-C, le repère suit l'œil ou le visage retenu, en ambre. En AF-S, TutoPhoto ne détecte rien avant le toucher ou le déclenchement : le repère passe alors au vert sur l'œil retenu. » ; en anglais : « In AF-C, the marker follows the eye or face chosen, in amber. In AF-S, TutoPhoto detects nothing before the tap or the shutter release: the marker then turns green on the eye chosen. »
  - simulateur, Julien tranche : en AF-S, relancer la détection (sans refaire la mise au point) pour afficher le cadre ambre, comme le décrit le manuel ; effacer la cible quand le mode ou la détection changent.

## Vérifié

À écrire.

## Je ne sais pas

À écrire.

## Constats FIC repris

À écrire.
