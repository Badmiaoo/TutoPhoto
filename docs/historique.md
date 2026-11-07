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
