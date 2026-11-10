# Historique des décisions et des audits

_Section 9 de `REPRISE.md` (7 novembre 2026), copiée sans réécriture ; seuls les niveaux de titre changent._

## 6 novembre 2026 : cadrage

Les cinq décisions de la section 1.

## 7 novembre 2026 : premier audit

Corrections et propositions, consignées dans l'onglet « Audit du 7 novembre » du Claude Doc. L'audit suivant y a relevé cinq erreurs, toutes corrigées : un exemple de vocabulaire sans changement de nom (EOS 80D contre EOS-1D X Mark II), une confusion entre IL et cran de molette, le flash calculé par profondeur gardé comme approche principale, une liste incomplète des situations au flash, et un contrôle des renvois dans un seul sens.

## 7 novembre 2026 : audit indépendant

Deux relecteurs sans accès à la rédaction ni au premier audit (A pour les faits et les sources, B pour la complétude et la cohérence) ont relu le référentiel ; chaque constat a été contre-vérifié avant correction. 34 corrections ont été appliquées au doc, dont :

- le premier plan flou, qui laisse voir ce qui est caché derrière lui : scènes en couches ([Sheng et al., 2023](https://arxiv.org/abs/2308.08843)) ;
- le flash en V1 fondé sur deux captures, ambiante et flash seul, la profondeur ne donnant pas la réflectance ([Petschnigg et al., 2004](https://hhoppe.com/proj/flash/)) ;
- le vocabulaire des marques tenu par famille d'appareils (EOS R5 « AF method », EOS R5 Mark II « AF area ») ;
- les droits : passants isolés par le zoom, mineurs (art. 372-1 du Code civil), œuvres protégées et exception de panorama.

## 7 novembre 2026 : « garde tout », v0.2

Julien a accepté toute la liste consolidée de l'audit indépendant. Ce fichier en est le résultat.

- 29 notions ajoutées : les 24 de l'audit (EXP-13, EXP-14, MES-12, MES-13, BOI-28 à BOI-35, MAP-19 à MAP-22, NET-09, MVT-12, OPT-16, OPT-17, LUM-17, CMP-13, CMP-14, RET-14), BOI-36 issue de la scission de BOI-21, et quatre notions de périmètre (PLA-09 drone, COU-09 et LUM-18 sous l'eau, RET-15 restauration).
- 1 notion retirée : MAP-13, fusionnée dans MAP-08.
- 15 compléments : BOI-03 (luminosité de l'écran), BOI-10 (pose T), BOI-16 (HEIF, compression du RAW), COU-02 (balance auto ambiance ou blanc), EXP-06 (ISO étendus), LUM-10 (mémorisation de la puissance du flash), MES-08 (bracketing de balance des blancs et d'optimiseur), MVT-08 (light painting), OPT-14 (bonnettes), OPT-15 (montures et adaptateurs), RET-10 (moyennage contre le bruit), RET-11 (édition non destructive, archivage), RET-12 (épreuvage), PLA-06 (marées), PLA-07 (faune, droit d'auteur du photographe).
- 11 situations ajoutées : SIT-32 à SIT-40 de l'audit, SIT-41 (drone) et SIT-42 (sous l'eau).
- Classement et niveaux : LUM-07, CMP-07, LUM-14 et LUM-16 en V1→V2 ; exercice d'OPT-06 jouable en V1 sur variantes capturées ; LUM-04 traite la qualité de la lumière, PLA-01 le calcul des horaires ; MES-10 en N2 ; BOI-21 scindée (formatage N1, doubles emplacements N2 dans BOI-36) ; activité interactive sur CMP-12, RET-13, PLA-06 et LEC-04 ; un niveau par situation.
- Structure : le référentiel est découpé en fichiers de données ; le schéma d'architecture a une flèche de « J'apprends » vers le moteur de rendu et distingue le solveur de situations du moteur de rendu ; la lisibilité sur téléphone est reportée à la maquette.
- Ajouts de cohérence faits pendant l'intégration, au-delà de la liste : renvois réciproques pour les nouvelles situations ; SIT-39, SIT-25 et SIT-03 rattachées à CMP-07, LUM-14 et LUM-16 pour que leur partie V1 ait une situation ; PLA-07 devient notion clé de SIT-08 ; captures enrichies (réflecteur pour SIT-03, flash rebondi pour SIT-25, poses pour SIT-01, SIT-04 et SIT-05) ; règle de niveau des situations (médiane) ; sources trouvées et vérifiées pour les propositions que l'audit marquait « non revérifié » (Sony, Fujifilm, Nikon) et pour les compléments.

Comptes, de la v0.1 à la v0.2 : notions 163 → 191 ; V1 153 → 177 ; V1→V2 6 → 12 ; V2 4 → 2 ; situations V1 31 → 42 ; situations V2 7 → 7 ; sources 41 → 78.

Non vérifié à ce jour, je ne sais pas : la licence des modèles métriques de Depth Anything ; le numéro de version de SunCalc ; la faisabilité des scènes en couches, du flash par captures et du flou de défilement, que seule la maquette dira.

---

## 7 novembre 2026 : session 1 (après REPRISE.md)

- `REPRISE.md` poussé directement sur `main`, sur demande explicite : c'est le premier commit du dépôt, alors vide. Tout le reste passe par une branche et une pull request.
- Périmètre de la pull request de bootstrap : le plan complet de la section 0.7 de `REPRISE.md`, sans fichier de licence tant que la licence n'est pas tranchée.
- Contenus rangés par langue : `content/fr/notions/<ID>.md`, `content/en/notions/<ID>.md`, et de même pour les situations (`docs/contenus.md`).
- Quatrième brique, la situation réelle : comptée dès qu'une situation liée à la notion est rédigée en français et en anglais ; pour une notion `situations: all` ou sans situation, par une section « Situation réelle » dans la fiche.
- Identité entre `data/` et les blocs YAML de `REPRISE.md` : vérifiée une fois, dans la pull request de bootstrap, et pas en CI, puisque `REPRISE.md` reste figé alors que `data/` va évoluer.
- `REPRISE.md` est un brouillon, probablement incomplet, mal écrit par endroits et avec des erreurs : tout peut être remis en question, y compris ce que la section 0.6 dit « acté ».
- Claude fusionne lui-même ses pull requests quand la CI est verte, et gère les versions : un tag annoté `vX.Y.Z` par pull request fusionnée, décrit dans `CHANGELOG.md`. Y suit la version du référentiel.

## 7 novembre 2026 : public, 3D de synthèse et V1 minimale

- Public : uniquement les boîtiers reflex et hybrides. La photo au smartphone est hors périmètre, comme les compacts et les bridges ; BOI-28 est mis à jour en conséquence.
- Scènes en 3D de synthèse dès la V1. La 2.5D (photos réelles et carte de profondeur) est abandonnée, avec la règle de découpage V1/V2, le format de scène 2.5D et le flash par captures.
- Le champ `version` (V1, V1→V2, V2) est retiré du référentiel : les 191 notions et les 49 situations relèvent toutes de la V1. Les identifiants `SIT-V2-NN` restent tels quels. Le champ `capture` des situations, qui décrivait des captures 2.5D, est retiré aussi ; les besoins de chaque scène 3D seront décrits à sa conception.
- V1 minimale testée d'abord : une scène de parc avec SIT-01, SIT-05 et SIT-06, testée avec quelques débutants avant d'étendre.
- `docs/v2-3d.md` est supprimé, sans objet ; `docs/architecture.md` est marqué en partie caduc jusqu'au choix de la pile technique.

## 7 novembre 2026 : licences

- Code sous MIT, contenus et données sous CC BY-SA 4.0, modèles et textures 3D de tiers acceptés seulement sous CC0 ou CC BY. Détail dans `docs/licences.md`.
- Textes des licences repris du dépôt de référence SPDX ; titulaire indiqué dans `LICENSE` : « les contributeurs de TutoPhoto ».

## 7 novembre 2026 : nom, hébergement, tests

- Nom du projet : TutoPhoto.
- Hébergement : GitHub Pages d'abord, comme site statique. Contraintes relevées dans la [documentation de GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) (source du dépôt `github/docs`, commit `8cd1075` du 6 novembre 2026) : site publié de 1 Go au plus, bande passante « souple » de 100 Go par mois, déploiement limité à 10 minutes, pas d'usage commercial. Bascule vers le serveur de Julien si le moteur 3D exige des en-têtes HTTP particuliers (point que la page ne documente pas) ou si les scènes dépassent ces limites.
- Ordre de grandeur, sur une hypothèse de scène de 50 Mo : 100 Go ÷ 50 Mo = 100 000 Mo ÷ 50 Mo, soit environ 2 000 chargements complets par mois.
- Testeurs de la V1 minimale : des débutants de l'entourage de Julien.
- Scène de parc : mode de production à décider avec la pile technique.

## 7 novembre 2026 : pile technique

- Moteur 3D : Babylon.js (option B de `docs/pile-technique.md`), seul moteur temps réel lu qui fournit d'origine une profondeur de champ physique et un flou de mouvement par objet, en WebGL2.
- Écartés : three.js avec une couche écrite par nous (option A), three.js avec une photo calculée par lancer de rayons (option C, WebGPU obligatoire), PlayCanvas.

## 7 novembre 2026 : squelette de l'application

- Code de l'application en TypeScript, construit avec Vite, dans `app/` ; publication sur GitHub Pages à chaque fusion sur `main`.
- Premier écran : une scène Babylon.js de départ (sol, sphère de repère, caméra orbitale), une interface en français et en anglais, et une page des licences.

## 7 novembre 2026 : dépôt public

- GitHub Pages n'est gratuit que pour un dépôt public : Julien passe le dépôt en public. Son nom comme auteur des commits est accepté.
- Règles et contrôles pour que rien de privé n'entre dans le dépôt : `docs/publication.md`, `CLAUDE.md`, `scripts/check_public.py` et gitleaks dans la CI.
- Le lien vers le Claude Doc d'origine est retiré de `REPRISE.md` ; il reste dans l'historique, vers un document privé.

## 7 novembre 2026 : site en ligne

- Dépôt passé en public et GitHub Pages activé par Julien ; première publication réussie : https://badmiaoo.github.io/TutoPhoto/
- Julien autorise Claude à gérer la configuration de ce dépôt, et de lui seul. Les réglages de GitHub hors de portée des outils de Claude (protection de `main`, options de sécurité, Pages) restent faits par Julien, sur indication de Claude.

## 7 novembre 2026 : scène de parc, stockage, copyright

- Scène de parc de la V1 minimale : entièrement assemblée à partir de modèles et de textures sous CC0 ou CC BY (décor, personnages, chien, ciel), chacun avec son auteur, son adresse d'origine et sa licence.
- Fichiers lourds (modèles glTF, textures, ciels) : dans le dépôt, sous `app/public/`, avec un contrôle de taille en CI dont le seuil sera fixé quand le poids réel sera connu.
- Titulaire du copyright dans `LICENSE` : Julien Touzeau, au lieu de « les contributeurs de TutoPhoto ».

## 8 novembre 2026 : scène de parc, fond et sujets

- Les arbres de Poly Haven retenus sont trop lourds pour un navigateur. island_tree_01 compte 1 599 403 triangles (feuillage 1 060 032, branches 504 584, tronc 34 787) et pèse 66,3 Mo avec ses textures 1k. Aucun arbre de parc de Poly Haven ne descend sous 300 000 polygones : le plus léger, jacaranda_tree, en compte 312 356 (chiffres de l'API Poly Haven). Simplifié à 10 % des triangles avec gltf-transform 4.5.1 (meshoptimizer), puis quantifié, island_tree_01 tombe à 157 494 triangles et 11,9 Mo, avec un rendu peu changé à 9 m.
- Décision de Julien : le fond et l'éclairage viennent d'une photo à 360° (autumn_hockey, de Greg Zaal, CC0). En 3D, seulement le premier plan : personnages, chien, banc, poubelles. Pas d'arbre 3D en V1. Conséquence : l'appareil reste au point de prise de vue de la photo. On tourne et on zoome sans se déplacer ; les sujets, eux, bougent.
- Sketchfab : télécharger un modèle exige un compte (« Downloading models requires users to be authenticated with a Sketchfab account », [Download API](https://sketchfab.com/developers/download-api), lue le 7 novembre 2026). Julien a créé un compte ; sa clé d'API est enregistrée dans l'environnement de travail de Claude, jamais dans le dépôt.
- SIT-06 : le Shiba Inu retenu n'a aucune animation de course. Ses cinq animations : faire le mort, se rouler, s'ébrouer, assis, debout. Aucun chien réaliste avec une course, sous CC0 ou CC BY, n'a été trouvé sur Sketchfab ni ailleurs. Benny the Rottweiler (OpenGameArt) court, mais il est sous CC BY-SA 3.0, une licence que nos règles refusent. Décision de Julien : un chien stylisé qui court vraiment (le malamute de striderrotk, CC BY 4.0), en attendant mieux. Le Shiba Inu est retiré.
- Le format des crédits de scène et les limites de taille sont décrits dans `docs/licences.md`.

## 8 novembre 2026 : personnages et chien de la scène de parc

- Quatre personnages de Renderpeople, sous CC BY 4.0, téléchargés depuis Sketchfab avec le compte de Julien : Dennis et Fabienne & Percy (poses fixes), Sophia (debout, animée), Nathan (marche). Les archives glTF contiennent des textures de 8192 × 8192 px ; elles sont réduites à 2048 px, modification indiquée dans les crédits comme l'exige CC BY 4.0.
- Chien de SIT-06 : le malamute de striderrotk (CC BY 4.0). Le fichier contient deux chiens ; seul « Jim », qui galope, est affiché.
- Taille du chien : 0,6 m au garrot, valeur choisie. Le standard de la race n'a pas pu être lu : les sites du club de race américain et du Canadian Kennel Club ne sont pas joignables depuis la session de travail. Un extrait de recherche attribue au standard du Canadian Kennel Club 63,5 cm (25 pouces) au garrot pour un mâle, mais la page n'a pas été ouverte.
- Vitesses, mesurées dans les animations elles-mêmes, pour que les pieds ne glissent pas : pendant l'appui, un pied posé recule à la vitesse d'avance du sujet.
  - Nathan : 1,23 à 1,27 m/s selon le pied et le point mesuré ; 1,25 m/s retenu.
  - Jim : de 2,4 à 13,3 unités/s selon la patte (médiane 10,6 ; deux pattes concordent vers 13). L'épaule est à 2,05 unités du sol, donc 0,6 / 2,05 ≈ 0,29 m par unité, soit 3,1 à 3,9 m/s entre la médiane et la valeur concordante. 3,5 m/s retenu ; mesure imprécise.
- Le Shiba Inu, retiré, n'avait jamais été intégré.

## 8 novembre 2026 : caméra physique

- Rendu : le viseur montre en temps réel le cadrage, l'exposition et une profondeur de champ approchée (effets de Babylon.js) ; au déclenchement, la photo est calculée exactement par accumulation de rendus (Haeberli et Akeley, 1990). Babylon.js plafonne son flou d'arrière-plan et règle son flou de mouvement à la main ; le détail est dans `docs/camera-physique.md`.
- Capteur : plein format ou APS-C, au choix du débutant.
- Bruit : modèle physique (bruit photonique et bruit de lecture), à partir des mesures de William J. Claff (PhotonsToPhotos).
- Boîtiers de référence : trois paires au choix de la marque, Nikon Z 6 et D5600, Sony A7 III et A6000, Canon EOS RP et EOS 2000D. La réponse de Julien, « 1,2,3 », est comprise comme « les trois ».
- Trois hôtes ajoutés à l'environnement de travail pour lire les sources : imaging.kodakalaris.com, www.photonstophotos.net, en.wikipedia.org.

## 8 novembre 2026 : boîtier virtuel

- Crans par tiers de diaphragme, comme sur les vrais boîtiers. Les libellés des vitesses intermédiaires (1/1250, 1/640, etc.) ne sont donnés par aucune source lue ; ils sont signalés comme non sourcés, et les calculs utilisent les valeurs exactes.
- Objectif virtuel : zoom de 18 à 200 mm ouvrant à f/1.4 sur toute la plage, présenté comme tel dans l'outil.
- Sites de manuels des constructeurs ajoutés à l'environnement de travail : onlinemanual.nikonimglib.com, downloadcenter.nikonimglib.com, helpguide.sony.net, cam.start.canon.

## 8 novembre 2026 : photo calculée

- Mise au point : le débutant touche le point du viseur qui doit être net ; sa distance est lue au déclenchement. Cela préfigure le choix des collimateurs.
- Nombre de rendus selon le flou : copies espacées de 4 px au plus, de 16 à 256 rendus, et 5 s de calcul au plus.
- Accumulation suivie d'un lissage, appliqué une fois sur la moyenne. Le résultat est identique à un lissage de chaque rendu, puisque le rayon ne dépend que de la profondeur de la vue centrale.
- Le sol de la photo à 360° est projeté sur un plan, pour que sa profondeur de champ soit juste.

## 9 novembre 2026 : temps de calcul et bruit

- Mesures de Julien sur son téléphone (Google Pixel 8 Pro, Chrome, précisé le même jour) : photo calculée avec les réglages par défaut en 0,8 s (16 rendus), et un portrait au 135 mm à f/1.4 en 2,0 s (256 rendus). Le plafond de 5 s n'est pas atteint.
- Bruit numérique : coloré selon la matrice de Bayer, brut (sans réduction de bruit), visible dans le viseur comme sur la photo.
- Outil d'apprentissage : tout doit se voir dans le viseur et sur la photo. Un interrupteur, au choix de l'utilisateur, coupe l'aperçu dans le viseur, pour s'entraîner.
- Mise en œuvre : loupe dans le viseur (jusqu'à 100 %) et sur l'écran de revue ; un interrupteur général de l'aperçu et un par effet ; aperçu en marche par défaut.
- Chargement sans fin sur le téléphone de Julien après les versions 0.3.15 à 0.3.17. Mécanisme reproduit en simulant un shader du bruit qui ne compile pas : Babylon attend les post-traitements de la caméra. Version 0.3.18 : le bruit ne bloque plus le chargement, et les erreurs s'affichent à l'écran pour trouver la cause.
- Essai de Julien sur son Google Pixel 8 Pro (Chrome) avec la version 0.3.22 : tout se charge, aucun message d'erreur, viseur fluide. Le chargement est lent sur un mauvais réseau, ce qui est cohérent avec les 34 Mo de la scène.
- Profondeur de champ du viseur : Julien choisit l'option B, un flou en disque de taille physique écrit pour TutoPhoto, à la place de l'effet de Babylon.js (version 0.3.23).
- Demandes de Julien : ajouter à la conception la balance des blancs, les grilles de composition et l'histogramme ; discuter d'un indicateur d'équilibre entre ouverture, vitesse et ISO selon le point visé, et des modes de mise au point autres qu'un collimateur unique ; prévoir en V2 des curseurs de correction de la photo (exposition, hautes lumières, ombres, noirs, contraste).
- Chargement bloqué sur le téléphone de Julien, avec le message « Failed to fetch dynamically imported module » pour un shader de Babylon.js présent dans la version publiée. Version 0.3.25 : tout le code tient dans un seul fichier, au lieu de 324 chargés à la demande.
- Réponses de Julien :
  - balance des blancs, grilles et histogramme : « quand tu estimes que c'est le meilleur moment ». Claude les place après les tests de la V1 minimale, que `CLAUDE.md` demande avant toute extension ;
  - indicateur d'équilibre : forme B, un triangle dans lequel un point bouge ;
  - modes de mise au point : « suivons ta reco », soit AF ponctuel ou continu, puis modes de zone, puis détection des yeux.
- Version 0.3.26 : AF ponctuel (AF-S) ou continu (AF-C). Toucher le viseur tient lieu de déclencheur à mi-course ; en AF-S, la distance reste verrouillée jusqu'au toucher suivant.
- Modes de zone AF : Julien valide les quatre points proposés (point sélectif ; zone large S et L, priorité au sujet le plus proche ; zone automatique avec la détection des yeux ; pinpoint et zone dynamique laissés de côté). Version 0.3.27.
- Détection des yeux et zone automatique (MAP-09) : Julien valide les cinq points proposés et le placement à la main des yeux des modèles sans squelette et du chien. Pour la zone automatique sans visage : « fais ce qu'il y a de plus réaliste, ça reste une sandbox de simulation pour entraînement. Ça doit être le mot d'ordre partout. » Le mot d'ordre entre dans `CLAUDE.md` (version 0.3.28).
- Version 0.3.29 : AF zone automatique avec détection des visages et des yeux (personnes, ou chien), suivi du sujet touché, et repli sur le sujet le plus proche sans visage. Yeux des modèles figés et du chien placés par visée sur le modèle.

## 10 novembre 2026 : principe de conception

- Principe de Julien : n'implémenter que ce qui est sourcé, pour un simulateur au plus près de la réalité, au service de débutants qui veulent comprendre la photo et maîtriser leur boîtier. Texte complet dans `docs/cadrage.md` ; règle ajoutée à `CLAUDE.md` (version 0.3.30).
- Conséquences pour l'indicateur d'équilibre : profondeur de champ montrée sans jugement sans source ; bougé de la main exclu tant qu'il n'est ni sourcé ni simulé.
- Version 0.3.31 : indicateur d'équilibre, triangle et trois lignes au point visé (zone nette, traînée du sujet, bruit), seuils sourcés.
- Essai de Julien sur son Google Pixel 8 Pro : « La fluidité semble bonne. » Il demande d'enchaîner : figer le mouvement (MVT-01), modes d'entraînement (BOI-12), collimateurs (MAP-06).
- Version 0.3.32 : traînée du sujet visé en pixels de la photo (MVT-01).
- Version 0.3.33 : modes de déclenchement (BOI-12), vue par vue, rafales Continu L, H et H (étendu) du Z 6, retardateur ; série à trier dans l'écran de revue.
- Version 0.3.34 : collimateurs (MAP-06). Le point et les zones de mise au point restent dans la zone couverte par l'autofocus du Z 6, environ 90 % du cadre en largeur et en hauteur d'après Nikon, tracée dans le viseur. La disposition des 273 points n'est pas sourcée : pas de grille.

## 10 novembre 2026 : bilan de la V1 minimale et découpage

- Julien demande, pour l'ISO auto (MES-10), l'option la plus large : priorité à l'ouverture (BOI-07), correction d'exposition (MES-04) « + la priorité vitesse » (BOI-08). Les trois notions entrent dans le jalon `v1-min`.
- Bilan présenté par Claude : simulateur fait pour 9 des 13 notions du jalon, NET-01 en partie ; produit presque entièrement à faire (écrans, fiches, défis, bulletin, solveur) ; couverture 0 sur 13.
- Décisions de Julien (« Oui ») :
  - LUM-02 : simulateur en V2, le fond de la scène de parc étant une photo par ciel couvert ; en V1, une activité interactive le remplace (`activity: true`) ;
  - solveur de situations : en V2 ; pour les trois situations de la V1 minimale, la recette est écrite à la main dans leur fiche.
- « Je vais me coucher, traite tout ce que tu peux sans moi sans attendre mon go » : Claude enchaîne les modes d'exposition et l'ISO auto, puis la vue de dessus de NET-01 et le déplacement de l'appareil de NET-06.
