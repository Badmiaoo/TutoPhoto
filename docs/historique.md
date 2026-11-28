# Historique des décisions et des audits

_Section 9 de `REPRISE.md` (7 novembre 2026), copiée sans réécriture ; seuls les niveaux de titre changent. Jusqu'au 16 novembre 2026, la page a reçu une ligne par version ; depuis le 19 novembre 2026 (Sujet 5 du plan de corrections), elle ne reçoit que les décisions de Julien, datées et citées. Le récit de chaque version est dans `CHANGELOG.md` ; ce qui attend une réponse de Julien, dans `docs/etat-des-travaux.md`, « Décisions en attente »._

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
- Boîtiers de référence : trois paires au choix de la marque, Nikon Z 6 et D5600, Sony A7 III et A6000, Canon EOS RP et EOS 2000D. La réponse de Julien, « 1,2,3 », est comprise comme « les trois ». Note du 19 novembre 2026 : la suite l'a confirmé de fait (le 11 novembre, Julien a relevé lui-même les fiches de l'EOS RP, de l'A7 III et de l'A6000) ; le 15 novembre, Julien a ramené les boîtiers de référence à trois, un par marque (D4, plus bas).
- Trois hôtes ajoutés à l'environnement de travail pour lire les sources : imaging.kodakalaris.com, www.photonstophotos.net, en.wikipedia.org.

## 8 novembre 2026 : boîtier virtuel

- Crans par tiers de diaphragme, comme sur les vrais boîtiers. Les libellés des vitesses intermédiaires (1/1250, 1/640, etc.) ne sont donnés par aucune source lue ; ils sont signalés comme non sourcés, et les calculs utilisent les valeurs exactes.
- Objectif virtuel : zoom de 18 à 200 mm ouvrant à f/1.4 sur toute la plage, présenté comme tel dans l'outil.
- Sites de manuels des constructeurs ajoutés à l'environnement de travail : onlinemanual.nikonimglib.com, downloadcenter.nikonimglib.com, helpguide.sony.net, cam.start.canon.

## 8 novembre 2026 : photo calculée

- Mise au point : le débutant touche le point du viseur qui doit être net ; sa distance est lue au déclenchement. Cela préfigure le choix des collimateurs.
- Nombre de rendus selon le flou : copies espacées de 4 px au plus, de 16 à 256 rendus, et 5 s de calcul au plus.
- Accumulation suivie d'un lissage, appliqué une fois sur la moyenne. Le résultat est identique à un lissage de chaque rendu, puisque le rayon ne dépend que de la profondeur de la vue centrale.
- Le sol de la photo à 360° est projeté sur un plan, pour que sa profondeur de champ soit juste. Note du 20 novembre 2026 : avec Babylon.js 9.35.0, cette projection est sans effet (relecture de la version 0.3.76 ; « Défauts connus, hors du plan » de `docs/etat-des-travaux.md`).

## 9 novembre 2026 : temps de calcul et bruit

- Mesures de Julien sur son téléphone (Google Pixel 8 Pro, Chrome, précisé le même jour) : photo calculée avec les réglages par défaut en 0,8 s (16 rendus), et un portrait au 135 mm à f/1.4 en 2,0 s (256 rendus). Le plafond de 5 s n'est pas atteint.
- Bruit numérique : coloré selon la matrice de Bayer, brut (sans réduction de bruit), visible dans le viseur comme sur la photo.
- Outil d'apprentissage : tout doit se voir dans le viseur et sur la photo. Un interrupteur, au choix de l'utilisateur, coupe l'aperçu dans le viseur, pour s'entraîner.
- Mise en œuvre : loupe dans le viseur (jusqu'à 100 %) et sur l'écran de revue ; un interrupteur général de l'aperçu et un par effet ; aperçu en marche par défaut.
- Chargement sans fin sur le téléphone de Julien après les versions 0.3.15 à 0.3.17. Mécanisme reproduit en simulant un shader du bruit qui ne compile pas : Babylon attend les post-traitements de la caméra. Version 0.3.18 : le bruit ne bloque plus le chargement, et les erreurs s'affichent à l'écran pour trouver la cause.
- Essai de Julien sur son Google Pixel 8 Pro (Chrome) avec la version 0.3.22 : tout se charge, aucun message d'erreur, viseur fluide. Le chargement est lent sur un mauvais réseau, ce qui est cohérent avec les 34 Mio de la scène.
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
- Version 0.3.36 : modes d'exposition M, A et S, correction d'exposition et ISO auto, d'après le manuel du Z 6 (et celui du D850 pour le plancher de l'ISO auto et sa règle en A). Les réglages par défaut du Z 6, lus le même soir, font passer TutoPhoto en AF-S par défaut et activent l'ISO auto ; ils confirment les 3 vues par seconde de Continu L et les 10 s du retardateur.
- Version 0.3.37 : vue de dessus de la zone nette (NET-01) et appareil déplaçable sur la carte (NET-06) ; les personnages ne se déplacent pas.

## 11 novembre 2026 : défis et bulletin

- Julien, sur le point du matin : « Suivons tes propositions ». Ordre retenu : un défi par situation, un bulletin après chaque photo, puis les fiches des notions et des situations.
- Version 0.3.38 : défis SIT-01, SIT-05 et SIT-06, jugés sur la photo avec les critères déjà sourcés (zone nette, traînée) ; bulletin sous chaque photo, avec les notions à revoir.
- Version 0.3.39 : fiches de 15 notions et des 3 situations de la V1 minimale, en français et en anglais, sourcées ; couverture 11 sur 191. La fiche de LUM-02 attend une source fiable ; deux sources de EXP-06 (DPReview, Photography Life) n'étaient pas joignables depuis la session de travail : la fiche s'appuie sur le manuel du Z 6 et sur l'article « Film speed ».
- Réponses de Julien : chercher en profondeur une source pour LUM-02 ; débloquer les sources (hôtes ajoutés à l'environnement de la session) ; plan de la fiche de situation confirmé ; relecture des contenus par Julien et une relectrice qu'il a désignée.
- Version 0.3.40 : fiche de LUM-02 d'après le guide Lowel de Tiffen et un article d'Art Adams ; couverture 12 sur 191. DPReview et Photography Life refusent toujours les lectures automatiques.
- Julien propose de relever lui-même les passages des sites qui refusent les lectures automatiques, et valide la proposition sur la couverture de l'autofocus (« Ok ») : Z 6 pour la V1 minimale, autres hybrides plus tard, reflex en V2. Version 0.3.41.
- Julien relève le texte de l'article de DPReview sur l'invariance ISO ; la fiche EXP-06 le cite (version 0.3.42).
- Julien relève aussi l'article de Photography Life sur l'invariance ISO ; la fiche EXP-06 le cite (version 0.3.42).
- Julien relève la fiche technique de l'EOS RP (couverture AF de 88 % en largeur et 100 % en hauteur) et la page de l'A6000 (sans pourcentage) ; la page proposée pour l'A7 III ne donnait pas l'information. Version 0.3.43 : couverture de l'autofocus par boîtier, EOS RP compris.
- Claude constate que 21 descriptions de pull requests (#15 à #49) finissent par un lien vers sa session, mis par son outil GitHub à la création. Décisions de Julien : retirer le lien de ces descriptions, et, pour la suite, créer puis réécrire la description, avec un contrôle dans la CI. Julien relève aussi la page de Sony Inde sur l'autofocus de l'A7 III (« approx. 93% of image area ») et choisit un partage égal entre largeur et hauteur. Version 0.3.44 : contrôle des descriptions.
- Version 0.3.45 : couverture de l'autofocus du Sony A7 III, 93 % de la surface partagés également entre largeur et hauteur (choix de Julien). Le Sony A6000 et les deux reflex gardent celle du Z 6.
- Plan des écrans présenté par Claude ; décisions de Julien : fiches publiées avant relecture avec un bandeau, pour voir celles qui restent à relire ; accueil à la racine et simulateur sous `simulateur/` ; convertisseur des fiches écrit pour TutoPhoto ; fiches ouvertes par-dessus le simulateur depuis le bulletin. Version 0.3.46 : accueil et fiches.
- Julien part pour quatre heures et demande à Claude de continuer seul pour compléter la V1, puis de préparer la V2 s'il le peut. Version 0.3.47 : seconde partie du plan des écrans (« Jouer le défi », fiches ouvertes par-dessus le simulateur).
- Version 0.3.48 : propositions à trancher (`docs/propositions.md`) : forme de l'activité interactive de LUM-02, protocole de test avec les débutants, ordre de travail après la V1 minimale.
- Au retour de Julien, décisions sur les propositions : activité de LUM-02 en schéma 2D ; protocole de test tel quel (5 testeurs) ; extension seulement si tous les testeurs réussissent chaque défi sans aide et répondent mieux après qu'avant ; ordre de travail après les tests tel quel. Version 0.3.49.
- Version 0.3.50 : activité interactive de LUM-02 en schéma 2D (source, objet, mur ; ombre pleine et pénombre ; deux questions), dernière brique de la V1 minimale qui ne dépendait que de Claude.
- Julien signale un chargement sans fin du simulateur sur son téléphone, en données mobiles avec une réception faible ; ses captures montrent le code chargé mais pas la scène. Il propose un bouton de pré-téléchargement des ressources avec une barre de progression, pour diagnostiquer le réseau, et choisit le cache ordinaire du navigateur (option A). Version 0.3.51.
- Julien confirme qu'en Wi-Fi la scène se charge, et trouve la scène pixelisée sur son téléphone. Cause trouvée : le viseur était calculé à la taille en pixels CSS. Julien choisit la densité complète, dans une version isolée qu'on puisse annuler si la fluidité ne suit pas. Version 0.3.52.
- Julien trouve la 0.3.52 « beaucoup moins pixelsé », mais saccadée sur son téléphone, et demande la solution intermédiaire : densité plafonnée à 2, elle aussi dans une version isolée. Version 0.3.53.
- Dans la nuit du 11 au 12 novembre 2026, Julien demande à Claude de continuer seul : « Si jamais tu te retrouves sans plus rien a faire termine la v1. Et si jamais tu l'as terminé alors commence la v2. », puis « Reprends le développement complet de l outils. Tu as les règles. Créer un simulateur complet pour photographe débutant, vas aussi loins que possible. » Claude le comprend comme la levée, par Julien, de l'attente des tests avec les débutants avant d'étendre (`CLAUDE.md`), dans l'ordre de travail retenu le 11 novembre (`docs/propositions.md`, section 3). Chaque fonction ajoutée a sa version, annulable ; les choix faits sans lui sont listés dans `docs/propositions.md`, à confirmer. Note du 19 novembre 2026 : le premier message continuait par « Je t'autorise a continuer jusqu'à épuiser tout le stock de token. » (citation gardée jusque-là dans `docs/etat-des-travaux.md`).
- Version 0.3.54 : la routine de test passe dans la CI, un job par profil, pour ne plus occuper la machine de Claude pendant 53 minutes par pull request.
- Version 0.3.55 : en cherchant la cause d'un échec isolé de la routine de test, Claude constate que la progression du chargement comptait les textes de licence, que la scène ne charge jamais : « préparation » ne pouvait pas s'afficher, et la liste des fichiers en attente pouvait les nommer. Corrigé, avec un contrôle dans la routine.
- Version 0.3.56 : grilles de cadrage dans le viseur (CMP-02), première fonction ajoutée après la V1 minimale. Deux grilles, choisies dans la fenêtre « Aperçu » : « Tiers » (texte de Sony pour « Rule of 3rds Grid ») et « Seize cases » (illustration de Nikon pour le D5600) ; le quadrillage du Z 6 n'est pas simulé, son manuel n'en décrivant pas le tracé. Fiche CMP-02 en français et en anglais. Spécification écrite par Claude pendant que Julien dormait (`docs/specifications/grilles.md`) ; sept choix à confirmer (`docs/propositions.md`, section 4).
- Le 12 novembre 2026, avant la fusion de la version 0.3.56, Julien tranche ces choix. Il choisit d'abord un menu par boîtier, puis se ravise : « Mmmh en vrai les grilles sont des outils plutôt "global" ça fait partie de la composition et en vrai tous les boitiers ont les mêmes. Donc faisons les même pour tous les boitiers, 3*3 9*9 ect.. tous les plus communes ». Claude ajoute donc les deux autres grilles que les manuels lus nomment (« 6x4 » et « 3x3+diag » de Canon) ; aucune page lue ne nomme une grille « 9*9 ». Julien retient la grille masquée sous la loupe et le viseur seulement, demande une source pour le centrage et la symétrie, et ajoute CMP-02 au jalon de la V1 minimale (17 notions), citée dans la fiche de SIT-01.
- Version 0.3.57 : histogrammes et hautes lumières sur l'écran de revue (MES-06, MES-07). Sous la photo, un bouton « Infos » fait défiler photo seule, histogrammes (luminance, rouge, vert, bleu) et hautes lumières (les zones à la valeur maximale clignotent en noir), d'après les pages de lecture du Nikon Z 6 et du Sony A7 III. La formule de la luminance, l'échelle des histogrammes, le seuil à 255 et le rythme du clignotement sont des choix de TutoPhoto, dits comme tels ; l'histogramme du viseur et les zébrures restent à faire. Fiches MES-06 et MES-07 en français et en anglais. Spécification écrite par Claude sans Julien (`docs/specifications/histogramme-revue.md`) ; onze choix à confirmer (`docs/propositions.md`, section 4).
- Le 12 novembre 2026 au soir, Julien demande de remettre en question tout le travail fait avant ce jour par le modèle précédent, et de le modifier si nécessaire ; puis d'améliorer l'architecture, les choix stratégiques et les outils là où l'existant est défaillant, pour éviter la dette technique. Claude lance un audit par lots (constats avec preuves, puis réfutation par un second agent) et reporte la balance des blancs, qui aurait été écrite deux fois. Ses mots, gardés jusqu'au 19 novembre 2026 dans `docs/etat-des-travaux.md` : le travail fait avant le 12 novembre « doit être challengé et si nécessaire modifier » ; « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ». Le même jour : « Oublie pas de tout consigner en cas de limitation par la limite de token, que on puisse reprendre a tout moment. »
- Le 13 novembre 2026, la limite hebdomadaire d'usage du modèle de Claude est atteinte, jusqu'au 14 novembre à 1 h UTC. Le premier rapport d'audit (modèle physique, 20 constats non contre-vérifiés) est gardé dans `docs/audit/`. Note du 19 novembre 2026 (constat DOC-12 de l'audit) : ce qui suit ne s'accorde pas avec cette ligne. La branche de l'audit a reçu 67 commits le 13 novembre entre 6 h et 23 h UTC, et l'état des travaux de l'époque place la suspension par une limite propre au modèle utilisé vers 23 h UTC ce jour-là (`git show 2d3d982:docs/etat-des-travaux.md`, « Limite d'usage »). Je ne sais pas laquelle des deux pages décrit ce qui s'est passé.
- Le 13 novembre 2026, Julien demande de ne plus laisser de sujet commencé sans le pousser, de finir l'audit et d'en pousser le résultat, puis fixe la règle de reprise : chaque pull request fusionnée contient tout ce qu'il faut pour repartir d'une session neuve, et la session est vidée après chaque fusion (`CLAUDE.md`). Version 0.3.57 fusionnée ; version 0.3.58 : l'audit, lot par lot. Ses mots : « a chaque mr fusionné on incluera dedans toutes les informations nécessaires à la reprise depuis une nouvelle session. Et ensuite une fois chaque MR fusionner, on clean la session et on repart de zéro » ; « je ne veux plus de sujets commencé non poussé ».
- Du 13 au 15 novembre 2026, l'audit est mené par des agents, un à la fois après la coupure du 13 au matin (deux workflows de front), entre huit suspensions par la limite d'usage (de la sixième à la treizième ; récit : `git show 2d3d982:docs/etat-des-travaux.md`, « Limite d'usage ») : douze rapports, 186 constats, dont 160 confirmés et 26 réfutés à la contre-vérification (par un second agent ; par un troisième pour les neuf constats que le second a ajoutés). Julien fait lever la limite d'usage (il l'écrit le 15 novembre) et demande que les relances soient automatiques. La synthèse (`docs/audit/README.md`) propose un plan de corrections en 48 sujets et pose 37 décisions à Julien. Version 0.3.58. Ses mots, le 15 novembre : « J'ai fait lever la limite pour qu'elle reparte a zero du coup remet en place tes relance automatique pour consommer les token quand c'est disponible ».
- Le 15 novembre 2026, Julien écrit avoir posé la règle de branche sur `main` que l'audit lui demandait (CHX-03) : « pull request obligatoire, 0 approbation, Merge seul, contrôles requis validate, confidentialite, app et description ». Son message, coupé, mentionne aussi l'approbation des workflows des pull requests ; l'option choisie est confirmée par Julien le soir même (point suivant). Ce jour-là, la liste des branches donne `main` protégée (`"protected": true`, contre `false` le 13 novembre) ; Claude n'a pas relu le contenu de la règle. Claude commence le plan de corrections par le Sujet 1, la version du site à l'écran (ARC-12). Version 0.3.59 : le numéro de la version, lu à la construction dans le premier titre de version de `CHANGELOG.md`, s'affiche en bas de l'accueil, dans la fenêtre des crédits du simulateur et, quand un problème s'affiche, à la suite de son message dans la ligne de diagnostic. Julien peut ainsi rattacher ce qu'il voit sur son téléphone à une version. Premier sujet du plan fait ; le Sujet 2 suit.
- Le 15 novembre 2026 au soir, Julien demande que les questions lui soient posées dans la session, par des questions à choix, et y répond. Il tranche les 14 décisions de l'audit qui bloquaient un sujet (D1 à D14) : pas d'annulation du retardateur par un second appui ; retrait du champ `used_in` ; champ `terms` par notion et une phrase courte dans l'interface pour le vocabulaire des marques ; trois boîtiers de référence au lieu de six, un par marque, « les plus communs », que Claude choisit ; « f/5.6 » avec le point ; les trois changements de `CLAUDE.md` acceptés ; abandon des trois tags `v0.2.x` ; le passage d'une notion en activité compte comme un reclassement et le référentiel est à la version v0.3 ; les neuf refontes de l'audit ; un seul développement pour le viseur et la photo ; Claude autonome sur la mise en page sur téléphone et sur les notices de licence ; les tests avec des débutants juste après les corrections. À la question du titre anglais des fiches, il répond : « Retire la traduction anglaise, on garde tout en full français. », pour tout le site et le dépôt, juste après la pull request du Sujet 1. Il confirme avoir choisi « Require approval for all external contributors » pour les workflows des pull requests de tiers. Pour le Sujet 1 : le numéro reste dans le script du simulateur ; la ligne de version passe au-dessus de la liste des crédits ; la version est ajoutée aux messages d'échec ; la correction de deux contrôles de la routine, rouges dans la CI, entre dans la même pull request. Détail : « 15 novembre 2026 : réponses de Julien », plus bas. Ces réponses sont appliquées dans la version 0.3.59. Les deux contrôles échouaient par intermittence pour un même site : l'un par un défaut de l'application (l'écran de revue gardait son défilement d'une photo à la suivante, constat INT-17 de l'audit, et la photo pouvait sortir de l'écran), l'autre par un défaut de la routine (des personnages passaient dans la zone où elle mesure la netteté du fond).
- Le même soir, Julien donne un nouveau mandat : « Voilà avec tout ça tu devrais avoir de quoi terminer la v1 intégralement. Reprendre tout ce que l'audit a remonter pour refondre la v1 actuelle. Puis tu pourra enchaîner sur la v2 directement, tout ça avec tes auto relance quand la limite a été atteinte. Grossomodo termine le sujet dans son intégralité. Un simulateur d'appareil photo pour débutant avec mise en scène exercice et tuto. La simulation comprends des boitiers commun et connu de tous, couvre toutes les fonctionnalités de chaque boutier et surtout toutes les notions de photographie du triangle d'exposition a la composition. Tu devrais avoir tout ce qu'il te faut pour faire ça » Il précise que les tests avec des débutants ne bloquent pas (« Continue avec tes propres testes, tu me feras un fichiers avec la liste des testes a faire faire que je ferais faire et que je te donnerais pour ajuster. Mais c'est pas bloquant. »), que Claude crée lui-même la session suivante après chaque fusion, et que Claude décide sans l'attendre, lui confirmant après. Trois règles de `CLAUDE.md` sont réécrites dans ce sens. Il annonce ensuite une V3, après la V2 : « Ensuite on aura un v3. Qui sera uniquement un embellissement de l'appli, on touche pas au fonctionnel on fera seulement une passe EXTRÊMEMENT MEGA OVER GIGA sur l'ergonomie, l'ux/l'ui pour avoir quelque chose de léger, lisible compréhensible, TDAH compatible et surtout extrememt jolie pour que ça attire les débutants et surtout que ça les aide. » Et, pour l'outil : « On se servira de Claude design pour c.a ».
- Le 16 novembre 2026, le retrait de l'anglais, décidé par Julien le 15 novembre (« Retire la traduction anglaise, on garde tout en full français. »), est découpé par Claude en deux pull requests (`docs/propositions.md`, section 5). Version 0.3.60, la première : le site en français seul. Le simulateur, l'accueil, les fiches et l'activité de LUM-02 n'ont plus de seconde langue ni de bouton de langue ; `content/en/` et `README.en.md` sont retirés ; les fiches passent de `content/fr/` à `content/` dans le dépôt et de `fiches/fr/` à `fiches/` sur le site ; `app/src/i18n.ts` devient `app/src/texts.ts`. Les champs `en` du référentiel et de la scène restent pour la version suivante.

## 15 novembre 2026 : réponses de Julien

Table reprise de `docs/etat-des-travaux.md`, où elle était jusqu'au 19 novembre 2026, sans autre changement que deux renvois ; la colonne « Ce que cela change » est celle de cette page, écrite entre le 15 et le 19 novembre, et peut être en retard : l'état d'aujourd'hui est dans `docs/etat-des-travaux.md`. Réponses données dans la session, à des questions à choix posées par Claude ; « libre » marque une réponse écrite par Julien, citée mot pour mot. Les numéros D renvoient à `docs/audit/README.md`, « Décisions qui attendent Julien ». Le même soir, Julien précise que Claude décide sans l'attendre et qu'il confirme après (dernière ligne de la table) : partout où la table dit « à montrer avant d'écrire » ou « proposé avant d'être produit », lire « écrit ou produit par Claude, noté dans `docs/propositions.md`, puis confirmé ou annulé par Julien ».

| Objet | Réponse de Julien | Ce que cela change |
| --- | --- | --- |
| Routine rouge sur la pull request 65 | La correction va dans la pull request 65. | Fait dans la version 0.3.59 : l'écran de revue s'ouvre en haut (INT-17), avec un contrôle de routine de plus ; le contrôle « profondeur de champ du viseur » mesure un fond vide de personnages. |
| Approbation des workflows des pull requests de tiers | « Tous les contributeurs externes » (« Require approval for all external contributors »). | Second réglage demandé par l'audit : fait, d'après Julien ; non relu sur GitHub par Claude. |
| Numéro de version dans le script du simulateur (`docs/propositions.md`, section 5, choix 1) | Le garder dans le script. | Rien à changer. |
| Place de la ligne de version dans la fenêtre des crédits (choix 2) | Au-dessus de la liste, dans la pull request 65. | Fait dans la version 0.3.59 : la ligne est entre la phrase d'introduction et la liste, et la fenêtre s'ouvre en haut à chaque ouverture. |
| Version dans le message d'un chargement en échec et dans celui d'un navigateur sans WebGL (choix 5) | Oui, l'ajouter. | Fait dans la version 0.3.59. Le message d'un navigateur sans WebGL porte la version dans son texte, mais il n'est pas visible à l'écran (COD-11, Sujet 10 du plan). |
| Façon de poser les décisions de l'audit | Les 14 qui bloquent, tout de suite. | Fait le même jour ; D15 à D37 restent. |
| D1, retardateur | Non, ne rien changer. | Cette part du Sujet 11 n'est pas faite. |
| D2, champ `used_in` | Le retirer. | Sujet 34 : voie (a), avec le contrôle inverse que demande la contre-vérification. |
| D3, vocabulaire des marques | Dans le référentiel : un champ `terms` par notion. Dans l'interface : une phrase courte, « Les noms des modes et des menus restent ceux du Nikon Z 6 ». | Sujet 19. La contre-vérification renvoyait à la forme déjà prévue, `data/vocabulaire.yaml` : Julien retient `terms`. |
| D4, boîtiers de référence | Libre : « Un boîtier Nikon, un Sony et un canon suffiseny largement. » Lesquels, libre : « Je te laisse choisir. Prend les boitiers les plus communs pour chaque. » Capteurs sans source primaire : ajouter les hôtes des constructeurs à l'environnement de Claude. | Trois boîtiers au lieu de six. Claude ne sait pas aujourd'hui lesquels sont les plus communs : le choix est à sourcer, puis à montrer à Julien ; Claude lui donne ensuite la liste des hôtes à ajouter. Sujets 19 et 36. |
| D5, ouvertures en français | Le point partout : « f/5.6 ». | Sujet 20 : c'est l'interface qui change, et la note de l'objectif suit. |
| D6, trois changements de `CLAUDE.md` | Les trois sont acceptés : la phrase sur les tests, la table des pages, la ligne 8 sur `REPRISE.md`. | La rédaction est à montrer à Julien avant d'être écrite (Sujets 4, 5, 45 et 48) ; depuis, Claude l'écrit et Julien la confirme après (ligne « Points à montrer avant d'écrire », plus bas). La phrase sur les tests est écrite dans la version 0.3.64 (Sujet 4 ; `docs/propositions.md`, section 5, « Routine de test », choix 6). |
| D7, titre anglais des fiches | Libre : « Retire la traduction anglaise, on garde tout en full français. » Périmètre : tout, le site et le dépôt. Moment : juste après la pull request 65. | Sujet nouveau, avant le Sujet 2 : simulateur, accueil et fiches en français seul ; `README.en.md` et les champs anglais du référentiel sont retirés ; la première ligne de `CLAUDE.md` (« bilingue FR/EN ») change, rédaction à montrer avant d'écrire. Claude propose le découpage avant de produire. D7 n'a plus d'objet, et les parts anglaises des sujets du plan tombent. |
| D8, tags `v0.2.0`, `v0.2.1` et `v0.2.2` | Il y renonce. | Sujet 25 : `scripts/changelog.py` cesse de les réessayer, et les quatre liens du bas de `CHANGELOG.md` visent les commits. |
| D9, règle du numéro Y | Le passage d'une notion en activité compte comme un reclassement. Le référentiel est à la version v0.3. | La règle est à compléter (`CHANGELOG.md`, `docs/lire-le-referentiel.md`) et `README.md` à corriger (Sujets 32 et 33). |
| D10, refontes de l'architecture | Les neuf refontes de l'audit. | Le plan suit la version réduite par la contre-vérification : il est à revoir sur ce point, à partir de `docs/audit/architecture-application.md`. |
| D11, un seul développement pour le viseur et la photo | Oui, le partager. | Sujet 40. Les réserves de la contre-vérification restent : la refonte change l'image du viseur, elle est proposée à Julien avant d'être produite, et lancée avec les chiffres du diagnostic relevés sur son téléphone. |
| D12, mise en page du simulateur sur téléphone | Libre : « Tu va devoir être autonome sur ce sujet et prendre les meilleurs décision. » | Sujet 42 : Claude essaie les variantes dans un navigateur, choisit, et note ses choix dans `docs/propositions.md`. |
| D13, deux notices de licence | Libre : « Je te laisse autonome pour prendre les meilleurs décision sur le sujet » | Sujet 46 : Claude choisit, et note son choix dans `docs/propositions.md`. |
| D14, tests avec des débutants ou nouvelles fonctions | D'abord : les tests après les corrections. Puis, après son mandat du même soir, libre : « Continue avec tes propres testes, tu me feras un fichiers avec la liste des testes a faire faire que je ferais faire et que je te donnerais pour ajuster. Mais c'est pas bloquant. » | Les tests ne bloquent rien : Claude continue après les corrections, avec ses propres tests, et tient `docs/tests-a-faire-faire.md`. La règle de `CLAUDE.md` est réécrite dans ce sens. |
| Session neuve après chaque fusion, en l'absence de Julien | Claude crée la session suivante. | `CLAUDE.md` et `docs/etat-des-travaux.md`, « Mandat en cours ». |
| Points à montrer avant d'écrire (rédaction de `CLAUDE.md`, découpage du retrait de l'anglais, choix des boîtiers, refonte de l'image du viseur) | Claude décide, Julien confirme après. | `CLAUDE.md` et `docs/etat-des-travaux.md`, « Mandat en cours ». |

## 19 novembre 2026 : suite de la chaîne des sessions

Question posée dans la session des Sujets 8 et 9, après la fusion de la version 0.3.68 : la session est à la profondeur 8 sur 8, l'outil refuse de créer la session suivante et de poser une relance horaire ; continuer ici, ouvrir une session neuve, ou arrêter après le Sujet 9 ? Réponse de Julien, vers 18 h UTC : « Tu continues sur le même model, une session par sujets avec la relance horaire et tu continues tant que on a pas fini tous les sujets ».

Ce que Claude en fait : le modèle de travail reste le même (un sujet, une pull request, une version ; relecteurs, correction, contrôle final ; CI verte avant de fusionner) jusqu'à la fin de tous les sujets. Cette session ne peut ni créer de session ni poser de relance (« No user or organization setting changes this limit », message de l'outil) : elle enchaîne donc les sujets elle-même, sans relance, et l'a dit à Julien dans la session. Une session ouverte par Julien repart à la profondeur 0 et reprend la chaîne « une session par sujet, avec relance horaire » (`docs/etat-des-travaux.md`, « Mandat en cours »).

Puis, le même soir, vers 20 h 05 UTC, Julien ouvre depuis l'application une session neuve sur le dépôt (profondeur 0), avec ce premier message, mot pour mot : « Pour retrouver « une session par sujet avec relance », il suffit que tu ouvres toi-même une session neuve sur le dépôt, avec la consigne de reprendre à partir de docs/etat-des-travaux.md. Sa profondeur repart de zéro, et elle peut recréer la chaîne et ses relances. Le meilleur moment, c'est entre deux sujets, après une fusion. » (le passage de la réponse de Claude qu'il recopie). Ce que Claude en fait : la session de profondeur 0 crée la session du Sujet 10 après la fusion de la version 0.3.69, et la chaîne « une session par sujet, avec relance horaire » reprend ; la session des Sujets 8 et 9 s'arrête après cette fusion (`docs/etat-des-travaux.md`, « Lignée des sessions » et « Mandat en cours »).

## 20 novembre 2026 : niveau d'effort des sessions

Message de Julien dans la session du Sujet 15, vers 9 h 51 UTC, mot pour mot sauf le nom du modèle, remplacé par « [modèle] » (`docs/etat-des-travaux.md`, « Leçons pratiques », « Commits » : aucun nom de modèle dans le dépôt) : « Il y a un tic qui me dérange tu n'utilise pas [modèle] effort max dans tes session. Oublie toi a l'utiliser dans chaque session »

Ce que Claude en fait : chaque session de la chaîne est créée avec le même modèle et le niveau d'effort le plus haut, « max » (paramètre `effort` de l'outil qui crée une session), et la consigne de la session suivante le redit. Une session ne peut pas changer son propre niveau d'effort : la session du Sujet 15, créée sans ce paramètre, finit son sujet au niveau qu'elle a. Les agents lancés dans une session gardent leur niveau par défaut tant que Julien ne demande rien pour eux.

## 22 novembre 2026 : erreur du simulateur sur un iPhone

Message de Julien dans la session du Sujet 35, après 18 h 03 UTC, juste après la fusion de la version 0.4.3, mot pour mot : « J'ai une erreur sur le site faut corriger ! », avec une capture d'écran d'un iPhone (transcrite dans `docs/tests-a-faire-faire.md`, T22). Puis, dans la même session, avant 18 h 10 UTC : « Le soucis vient de safari sur iphone ». Ses réponses aux questions à choix de la session suivante, le même soir, sont des résultats d'essai : `docs/tests-a-faire-faire.md`, T22.

Ce que Claude en fait : un sujet à part entière, traité avant le Sujet 36 du plan de corrections, version 0.4.4. Ce qui est établi et ce qui ne l'est pas : `docs/pile-technique.md`, « Contexte perdu au démarrage » ; les choix : `docs/propositions.md`, « Erreur du simulateur sur iPhone ».

## 23 novembre 2026 : erreur du simulateur sur un iPhone, au chargement

Message de Julien dans la session du Sujet 46, après 20 h 47 UTC, pendant ce sujet, mot pour mot : « Il y a un bug », avec une capture d'écran d'un iPhone (transcrite dans `docs/tests-a-faire-faire.md`, T22). Ses réponses aux questions à choix de la session, avant 20 h 58 UTC : la panne est arrivée « Dès le chargement » ; au rechargement, « Nouveau message d'erreur au rechargement je te donne la capture d'écran » ; elle arrive « Régulièrement très régulièrement » ; à la question de savoir si l'essai T21 était suivi : « Je ne sais pas c'est pas moi qui utilise l'outil ». Puis, vers 20 h 58 UTC, la seconde capture, du rechargement (transcrite au même endroit).

Ce que Claude en fait : un sujet à part entière, le suivant, après le Sujet 46, en cours à l'arrivée du message, et avant le Sujet 47 du plan de corrections ; les choix : `docs/propositions.md`, « Licences et publication », choix 14.

## 24 novembre 2026 : session de la demande du 23 novembre, modèle changé, « Reprends »

Dans la session de la demande du 23 novembre 2026, que la limite d'usage hebdomadaire arrêtait depuis 23 h 14 UTC la veille, Julien a changé le modèle de la session, par la commande de l'application, à 0 h 05 min 58 s UTC, puis écrit, mot pour mot : « Reprends ».

Ce que Claude en fait : la limite refusait encore chaque tour ; le travail a repris le 28 novembre 2026 à 1 h 52 UTC, après sa réouverture (`CHANGELOG.md`, section 0.4.15). La session finit son sujet avec le modèle choisi par Julien, et crée la suivante avec ce modèle, au niveau d'effort « max » (consigne du 20 novembre 2026, plus haut). Le nom du modèle n'est pas écrit dans le dépôt.

## 28 novembre 2026 : modèle des sessions suivantes ; réponses sur l'iPhone

Réponses de Julien aux questions à choix que la session de la demande du 23 novembre 2026 lui a posées à sa fin, après la fusion de la version 0.4.15 ; cette session les a relayées à celle du Sujet 47, qui les a relues dans le relevé de la session où Julien a répondu. À 8 h 14 UTC, quatre réponses sur l'iPhone où le simulateur s'arrête au chargement : ce sont des résultats d'essai, notés dans `docs/tests-a-faire-faire.md`, T29. À 8 h 49 UTC, à la question « Le 24 novembre, tu as changé le modèle de cette session TutoPhoto. J'ai créé la session suivante (Sujet 47) avec ce modèle-là, au niveau d'effort « max ». Quel modèle pour les sessions d'après ? », qui proposait « Garder ce modèle » et « Revenir au modèle d'avant », il a répondu en texte libre, mot pour mot sauf le nom du modèle, remplacé par « [modèle] » (`docs/etat-des-travaux.md`, « Leçons pratiques », « Commits » : aucun nom de modèle dans le dépôt) : « Je veux [modèle] effort max ».

Ce que Claude en fait : le modèle qu'il nomme est celui des sessions d'avant le 24 novembre 2026, celui avec lequel la session de la demande du 23 novembre avait été créée (d'après l'outil qui décrit la session). La session du Sujet 47, créée avant cette réponse avec l'autre modèle, finit son sujet avec le sien, qu'elle ne peut pas changer ; elle crée la suivante avec le modèle que Julien nomme, au niveau d'effort « max », et la consigne de chaque session le redit. Le choix 13 de la version 0.4.15 (`docs/propositions.md`, « Erreur du simulateur sur iPhone, au chargement ») est tranché par cette réponse.

## 28 novembre 2026 : Sujet 48, à faire maintenant

Réponse de Julien à la question à choix que la session du Sujet 47 lui a posée à sa fin, après la fusion de la version 0.4.16, à 13 h 51 min 24 s UTC ; cette session l'a relayée à celle de la révision du plan d'après D10, qui l'a relue dans le relevé de la session où Julien a répondu. La question : « Sujet 48 du plan de l'audit, facultatif : couper la page `docs/pile-technique.md` en deux (d'un côté la comparaison des moteurs 3D, figée à sa date ; de l'autre l'outillage, dans une page de référence). Le plan demande de te le proposer avant de le faire, puisque rien ne l'exige. Que décides-tu ? » Les trois options, avec leur texte : « Plus tard, après la V1 », que la session recommandait (« Le sujet reste dans la file, derrière ceux qui font avancer la V1. Rien n'en dépend, et chaque version consomme de la limite d'usage hebdomadaire, au statut d'avertissement depuis le 28 novembre 2026. ») ; « Le faire maintenant » (« La session au travail le prend après son sujet en cours (la révision du plan d'après D10) : une version de documentation, avec les renvois des autres pages à corriger. ») ; « Ne pas le faire » (« Le sujet sort de la file ; `docs/pile-technique.md` reste une seule page. »). À 14 h 25 min 45 s UTC, Julien a choisi « Le faire maintenant », sans texte libre.

Ce que Claude en fait : le Sujet 48 est le sujet suivant, juste après la révision du plan (version 0.4.17) ; la session créée après la fusion de cette version le prend. Le sujet suit le plan (`docs/audit/README.md`, Sujet 48) ; le renvoi de `CLAUDE.md` à la page, que le plan change « après accord », Claude l'écrit et Julien le confirme après (règle du 15 novembre 2026). La réponse ne dit rien des essais T21 et T29 : Claude garde la priorité que leur donne la file, si leur résultat arrive avant que le sujet commence (`docs/propositions.md`, « Révision du plan d'après D10 », choix 13).

## 28 novembre 2026 : archiver les sessions finies

Consigne de Julien pour la chaîne des sessions, écrite dans la session de la demande du 23 novembre 2026 à 14 h 25 min 59 s UTC, mot pour mot : « Archive automatiquement les conversations de cette suite uniquement quand elles sont finies ». Cette session l'a relayée à celle de la révision du plan d'après D10, puis s'est archivée elle-même ; la session de la révision du plan l'a relue dans le relevé de la session où Julien l'a écrite.

Ce que Claude en fait : une session de la chaîne est finie quand sa version est fusionnée et son tag relu, la session suivante créée, sa relance supprimée, rien de non poussé, et qu'aucune question posée à Julien n'y attend de réponse ; elle s'archive alors elle-même, en dernier. Une session qui travaille ou qui attend une réponse de Julien ne s'archive pas, ni une session d'un autre projet du compte. Comment la consigne s'applique, et ce qui n'a pas pu se faire : `docs/etat-des-travaux.md`, « Mandat en cours » ; `docs/propositions.md`, « Révision du plan d'après D10 », choix 16.
