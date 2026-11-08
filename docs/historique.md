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
