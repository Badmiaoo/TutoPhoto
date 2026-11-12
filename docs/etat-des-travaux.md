# État des travaux

Tenu à jour à chaque pull request, à la demande de Julien (12 novembre 2026) : « Oublie pas de tout consigner en cas de limitation par la limite de token, que on puisse reprendre a tout moment. » But : qu'une nouvelle session de Claude, ou Julien, reprenne le travail avec le dépôt seul.

## Mandat en cours

Dans la nuit du 11 au 12 novembre 2026, Julien demande à Claude de continuer seul :
- « Si jamais tu te retrouves sans plus rien a faire termine la v1. Et si jamais tu l'as terminé alors commence la v2. Je t'autorise a continuer jusqu'à épuiser tout le stock de token. »
- « Reprends le développement complet de l outils. Tu as les règles. Créer un simulateur complet pour photographe débutant, vas aussi loins que possible. »

Ce que Claude en fait :
- l'attente des tests avec les débutants avant d'étendre (`CLAUDE.md`) est levée par cette demande ; les règles de fond restent : réalisme, rien sans source, une pull request par sujet ;
- l'ordre de travail est celui que Julien a retenu le 11 novembre (`docs/propositions.md`, section 3) ;
- chaque fonction a sa version, annulable par `git revert -m 1` de son commit de fusion ;
- `CLAUDE.md` demande de proposer avant de produire : Julien dormant, chaque choix fait sans lui est listé dans `docs/propositions.md` (section « Choix faits par Claude, à confirmer »), et la spécification de chaque fonction est gardée dans `docs/specifications/`.

## Où on en est

- En ligne après la fusion de cette pull request : version 0.3.56 (grilles de cadrage, CMP-02).
- Version 0.3.53 (densité du viseur plafonnée à 2) : fusionnée ; Julien doit la juger sur son téléphone (netteté et fluidité).
- Interruption de la nuit : trois séries d'agents lancées en parallèle (carte du code, dossiers de sources) ont épuisé la limite d'usage de 5 heures en vingt minutes, vers 23 h 40 UTC le 11 novembre. La session est restée suspendue jusqu'à 5 h 50 UTC le 12. Depuis : un ou deux agents à la fois, et d'abord publier ce qui est prêt.

## File de travail

Dans l'ordre. « Écrit » : le code existe sur la machine de Claude, pas encore dans le dépôt ; s'il est perdu, la colonne « Pour refaire » suffit.

| N° | Sujet | Notions | État | Pour refaire |
| --- | --- | --- | --- | --- |
| 1 | Densité du viseur plafonnée à 2 | | Fait, 0.3.53 | |
| 2 | Routine de test dans la CI ; ce fichier | | Fait, 0.3.54 | |
| 3 | Progression du chargement sans les textes de licence | | Fait, 0.3.55 | |
| 4 | Grilles de cadrage dans le viseur | CMP-02 | Fait, 0.3.56 | Spécification `docs/specifications/grilles.md` ; section 1 du dossier `docs/dossiers/viseur-aides.md` relue à la source le 12 novembre 2026. Sept choix à confirmer par Julien (`docs/propositions.md`, section 4). |
| 5 | Histogramme (viseur et revue), alerte des hautes lumières | MES-06, MES-07 | À faire | Dossier `docs/dossiers/viseur-aides.md`, sections 2 à 4, écrit, à relire à la source. |
| 6 | Balance des blancs | COU-01, COU-02, COU-04 | À faire | Dossier `docs/dossiers/balance-des-blancs.md`, écrit, à relire à la source. Babylon.js 9.35.0 a déjà une balance (`imageProcessingConfiguration.whiteBalanceEnabled`, `temperature`, `tint`) ; la photo calculée ne passe pas par elle. |
| 7 | Situations jouables dans le parc | SIT-28, SIT-V2-02, SIT-V2-06 | À faire | Fiches, défis ; sources à chercher pour OPT-06 et CMP-07. |
| 8 | Solveur de situations | | À faire | Dossier de sources à faire (coupé par la limite d'usage). |
| 9 | Nouvelles scènes (photos à 360° de Poly Haven, CC0) | selon la scène | À faire | Dossier `docs/dossiers/scenes.md`, écrit, à relire à la source : 38 photos candidates, toutes sous CC0 ; ordre proposé : socle commun, neige, intérieur près d'une fenêtre. Avec elles : une vraie mesure de la lumière (aujourd'hui, les modes A et S visent une constante de 12,5 IL), les modes de mesure, le mode P, la mise au point manuelle (dossiers de sources à faire). |
| 10 | Simulateur de LUM-02 et notions de lumière | LUM-02 | À faire | Demande une scène dont l'éclairage change. |

À côté de la file :
- quatre notions du jalon de la V1 minimale n'ont pas leur brique « situation réelle » (`python3 scripts/coverage.py` : 12 sur 16) : EXP-04, EXP-05, EXP-06 et MES-04 renvoient à des situations non rédigées. Les recettes de SIT-01 et de SIT-06 utilisent pourtant l'ouverture, la vitesse et l'ISO : ajouter ces renvois au référentiel est à proposer à Julien ; MES-04 attend une scène claire ou à contre-jour ;
- mise en page à corriger : sur un écran étroit, avec une police plus large que celle de la machine de Claude (DejaVu Sans), l'aide de la mise au point prend une ligne de plus en AF-S qu'en AF-C, et le viseur change de hauteur (238 ou 254 pixels sur l'iPhone 14 émulé). Trouvé au premier passage de la routine dans la CI, le 12 novembre 2026 ; le contrôle des collimateurs mesure maintenant le cadre au moment où il s'en sert ;
- routine de test dans la CI, échec non expliqué : au deuxième passage de la pull request de la version 0.3.54, le profil ordinateur s'est arrêté sur un délai dépassé à l'entrée du mode S (`page.check: Timeout 300000ms exceeded`). Non reproduit sur la machine de Claude avec la police de la CI, ni au quatrième passage. La routine garde depuis le journal d'appel de Playwright et l'état de la page : si l'échec revient, lire ce message avant toute relance. Les durées varient beaucoup d'un passage à l'autre (de 7 à 23 minutes par profil) ;
- grille de relevé pour les tests avec les débutants (`docs/propositions.md`, section 2) : à écrire ;
- bougé de la main : dossier de sources à faire ; rien n'est simulé tant qu'aucun modèle n'est sourcé ;
- carte du code (points d'extension pour chaque fonction de la file) et classement des notions des domaines EXP, MES et BOI : faits cette nuit sur la machine de Claude, à refaire au besoin ; constat utile : le simulateur n'a aucune mesure de la lumière, et la photo calculée ne passe pas par le traitement d'image de Babylon.js.

## Méthode de la nuit

Pour chaque fonction :
1. un dossier de sources : citations exactes des manuels des boîtiers, à relire une seconde fois à la source par un agent indépendant ; gardé dans `docs/dossiers/`, avec en tête la mention « pas encore relu » tant que ce n'est pas fait ;
2. une spécification, critiquée sous deux angles (fidélité aux sources ; débutant, interface et code), puis révisée ; gardée dans `docs/specifications/` ;
3. la mise en œuvre, relue sous trois angles (correction du code ; sources et vérité ; interface et mobile), puis corrigée ;
4. la pull request, avec la routine de test lancée par la CI.

Limite : l'environnement de travail de Claude ne joint que certains sites (manuels en ligne de Nikon, guides d'aide de Sony, manuels de Canon, Wikipedia, Poly Haven, ambientCG, Sketchfab, et quelques sites déjà cités dans `data/sources.yaml`). Une source ailleurs demande que Julien ajoute son hôte à l'environnement.

## Comment reprendre

1. Lire `CLAUDE.md`, ce fichier, `docs/propositions.md` et `docs/questions-ouvertes.md`.
2. Regarder l'état réel : dernier tag, pull requests ouvertes, branche de travail alignée ou non sur `main`.
3. Prendre le premier sujet « Écrit » ou « À faire » de la file ; lire son dossier et sa spécification s'ils sont dans le dépôt, sinon les refaire.
4. Suivre le flux d'une pull request de `CLAUDE.md`. Pièges déjà rencontrés (`docs/publication.md`) : réécrire la description aussitôt après la création ; le contrôle `description` lancé à la création peut échouer après coup, une nouvelle modification de la description le relance ; attendre les quatre jobs de la routine.
5. Mettre ce fichier à jour dans la pull request.

Commits : auteur Julien avec son adresse « noreply » de GitHub (`git commit --author=…`), sans changer l'identité par défaut de l'environnement de Claude, qui signe le commit comme committer (adresse « noreply » d'Anthropic) ; GitHub les affiche alors comme vérifiés. Les commits d'avant le 12 novembre 2026 avaient Julien pour committer et n'étaient pas signés.

## Ce qui attend Julien

- Juger la version 0.3.53 sur son téléphone.
- Confirmer ou annuler les choix faits sans lui (`docs/propositions.md`, dernière section), à mesure qu'ils s'ajoutent. Premiers choix : les grilles de cadrage (version 0.3.56).
- Renderpeople : date et périmètre de l'accord déjà obtenu, pour le documenter (`docs/questions-ouvertes.md`).
- Relecture des fiches : les signaler relues pour `data/relecture.yaml`.
- Tests avec cinq débutants (`docs/propositions.md`, section 2).
