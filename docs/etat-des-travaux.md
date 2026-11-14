# État des travaux

## Point du 13 novembre 2026 : à lire d'abord

Ce point prime sur l'ordre de la file plus bas.

**Deux demandes de Julien, le 12 novembre au soir.**
- Remettre en question tout le travail fait avant le 12 novembre 2026, par le modèle précédent : il « doit être challengé et si nécessaire modifier ».
- « Que ce soit l'archi, les choix stratégiques ou les outils si tu pense que l'existant peut être amélioré fait le ne te contente pas de continuer sur un chemin défaillant, évitons les dettes techniques pour un mini projet en cours de développement ».

**Règle de reprise (Julien, 13 novembre 2026).** « a chaque mr fusionné on incluera dedans toutes les informations nécessaires à la reprise depuis une nouvelle session. Et ensuite une fois chaque MR fusionner, on clean la session et on repart de zéro ». Et : « je ne veux plus de sujets commencé non poussé ». Donc : un seul sujet à la fois, poussé dès son premier commit dans une pull request en brouillon ; après chaque fusion, Claude écrit à Julien « Tu peux lancer /clear », et Julien répond ensuite « Reprends à partir de docs/etat-des-travaux.md ».

**Limite d'usage.** La limite de 5 heures a suspendu la session cinq fois entre le 11 et le 13 novembre ; elle laisse passer environ un agent par tranche quand la conversation est longue. Une conversation longue relit tout son contenu à chaque action : c'est elle qui consomme le plus, d'où la règle ci-dessus. Travailler par agents, et agir peu dans la conversation. Mesure du 13 novembre, un agent à la fois : dans la tranche ouverte vers 11 h UTC, trois agents menés au bout et un quatrième coupé à 13 h 28 UTC (septième suspension), pour 1,7 million de jetons d'agents ; dans la tranche ouverte à 16 h UTC, quatre agents menés au bout et un cinquième coupé vers 18 h 35 UTC (huitième suspension), pour 2,3 millions de jetons d'agents ; dans la tranche ouverte à 21 h UTC, quatre agents menés au bout et un cinquième coupé vers 23 h UTC (neuvième suspension), pour 1,8 million de jetons d'agents, cette fois par une limite propre au modèle utilisé (son message propose de changer de modèle ; Claude ne l'a pas fait, c'est à Julien d'en décider), rouverte à 1 h UTC le 14. Compter donc trois ou quatre agents par tranche, soit environ deux heures de travail, et un point de contrôle programmé juste après la réouverture pour relancer : sans lui, la session reste arrêtée (une heure perdue dans la nuit du 13 au 14).

**Où on en est.**
- En ligne : version 0.3.57 (histogrammes et hautes lumières sur l'écran de revue).
- En cours, un seul sujet : **l'audit du travail antérieur**, dans la pull request 64, en brouillon (version 0.3.58). Un workflow d'agents le mène ; chaque agent pousse son rapport sous `docs/audit/` au fur et à mesure. Script : `docs/audit/audit-workflow.js.txt` (son en-tête dit comment le relancer) ; consignes des agents : `docs/audit/consignes-agents.md`.
- Douze rapports, chacun en trois étapes : audit par un agent, réfutation de chaque constat par un second, contre-vérification par un troisième des constats que le second a ajoutés. Un seul agent à la fois, et chaque rapport mené jusqu'au bout avant le suivant. Ordre, et état le 14 novembre à 2 h UTC : `modele-physique.md` (fini : 20 constats confirmés, 1 réfuté), `fiches-exposition.md` (fini : 18 confirmés, 1 réfuté), `fiches-mise-au-point.md` (fini : 21 confirmés, 2 réfutés), `architecture-application.md` (fini : 12 confirmés, 2 réfutés), `choix-et-outils.md` (fini : 6 confirmés, 5 réfutés) ; pas commencés : `sources.md`, `referentiel-contenu.md`, `referentiel-structure.md`, `code.md`, `interface.md`, `documentation.md`, `licences-scripts-ci.md` ; puis la synthèse et le plan de corrections (`docs/audit/README.md`).
- Lire où en est un rapport, dans le dépôt : pas de fichier, rien n'est fait ; « État : constats non contre-vérifiés » en tête, l'audit est fait ou en cours et la réfutation reste à faire ; un bilan de contre-vérification en tête, la réfutation est faite ; un constat « ajouté à la contre-vérification » sans ligne « Contre-vérification » dessous, la troisième étape reste à faire. Un rapport commencé est repris par l'agent suivant, pas refait (c'est dans les missions du script).
- Coupure du 13 novembre, vers 7 h 10 UTC (sixième suspension par la limite de 5 heures) : le workflow de la première version tournait encore quand la session a été vidée, et la deuxième version a été lancée par-dessus, deux agents de front ; cinq agents coupés en dix-huit minutes. Avant de lancer un workflow, vérifier qu'aucun autre ne tourne. Reste de la coupure : `docs/audit/fiches.md`, rapport partiel de la première version sur toutes les fiches (constats FIC, non contre-vérifiés). Ses dix-neuf constats ont été repris, après vérification, par `fiches-exposition.md` et `fiches-mise-au-point.md` (section « Constats FIC repris » de chacun), et le fichier a été retiré le 13 novembre ; il reste dans l'historique (commit 4f7c07a).
- Tant que le workflow tourne, ne pas toucher au dépôt local de la session (les agents y travaillent) : lire l'état sur GitHub.
- Si le workflow s'arrête (limite d'usage) : le relancer pour les rapports qui ne sont pas finis, dans l'ordre ci-dessus.
- Quand la synthèse est poussée : la relire, passer la pull request en prête, attendre la CI, fusionner, vérifier le tag, puis dire à Julien de lancer `/clear`. Le sujet suivant est la première pull request du plan de corrections de la synthèse.
- Balance des blancs : spécification dans `docs/specifications/balance-des-blancs.md`, reportée (voir sa note). Le début de code écrit le 12 novembre est abandonné : il sera réécrit après l'audit de l'architecture.

**Nouvel ordre de travail.**

| N° | Sujet | État |
| --- | --- | --- |
| 1 | Audit du modèle physique | Fini : `docs/audit/modele-physique.md`, 20 constats confirmés, 1 réfuté (PHY-16). PHY-21, ajouté par le second agent, est confirmé par un troisième ; sa correction est à revoir (c'est écrit sous le constat). |
| 2 | Audit des fiches (16 notions, 3 situations, activité LUM-02) | Fini. `docs/audit/fiches-exposition.md` : 18 constats confirmés, 1 réfuté (FEX-10), aucun ajouté. `docs/audit/fiches-mise-au-point.md` : 21 confirmés (dont FMA-23, ajouté par le second agent et confirmé par un troisième), 2 réfutés (FMA-05, FMA-20). |
| 3 | Audit de l'architecture, des choix techniques et des outils | Fini. `docs/audit/architecture-application.md` : 12 constats confirmés (dont ARC-13 et ARC-14, ajoutés par le second agent et confirmés par un troisième), 2 réfutés (ARC-04, ARC-11) ; plan ramené de neuf refontes à cinq par la contre-vérification. `docs/audit/choix-et-outils.md` : 6 confirmés, 5 réfutés (CHX-04, CHX-07, CHX-08, CHX-09, CHX-11) ; il pose des questions à Julien, à reprendre dans la synthèse. Hypothèses de Claude, vérifiées par ces deux rapports : deux chaînes d'image (viseur, photo) qui obligent à tout écrire deux fois ; réglages du boîtier câblés à la main dans un fichier de plus de 1 000 lignes ; scène écrite en dur ; aucune mesure de la lumière ; un seul long scénario de test et aucun test rapide des formules ; documentation qui se recouvre. |
| 4 | Audits restants : sources, référentiel (contenu, structure), code, interface, documentation, licences et CI | En cours, sept rapports (liste plus haut), dans l'ordre. |
| 5 | Corrections et refontes issues des audits, une pull request par sujet | À faire. |
| 6 | Nouvelles fonctions, sur la base assainie : balance des blancs, histogramme en direct, puis la suite de la file | Après le point 5. |

**Méthode d'un audit.** Un agent relit chaque source à son adresse, refait chaque calcul et confronte le code à la documentation ; un second agent essaie de réfuter chaque constat ; seuls les constats qui résistent sont corrigés.

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

- En ligne après la fusion de cette pull request : version 0.3.57 (histogrammes et hautes lumières sur l'écran de revue, MES-06 et MES-07).
- Version 0.3.53 (densité du viseur plafonnée à 2) : fusionnée ; Julien doit la juger sur son téléphone (netteté et fluidité).
- Interruption de la nuit : trois séries d'agents lancées en parallèle (carte du code, dossiers de sources) ont épuisé la limite d'usage de 5 heures en vingt minutes, vers 23 h 40 UTC le 11 novembre. La session est restée suspendue jusqu'à 5 h 50 UTC le 12. Depuis : un ou deux agents à la fois, et d'abord publier ce qui est prêt.

## File de travail

Dans l'ordre. « Écrit » : le code existe sur la machine de Claude, pas encore dans le dépôt ; s'il est perdu, la colonne « Pour refaire » suffit.

| N° | Sujet | Notions | État | Pour refaire |
| --- | --- | --- | --- | --- |
| 1 | Densité du viseur plafonnée à 2 | | Fait, 0.3.53 | |
| 2 | Routine de test dans la CI ; ce fichier | | Fait, 0.3.54 | |
| 3 | Progression du chargement sans les textes de licence | | Fait, 0.3.55 | |
| 4 | Grilles de cadrage dans le viseur | CMP-02 | Fait, 0.3.56 | Spécification `docs/specifications/grilles.md` ; section 1 du dossier `docs/dossiers/viseur-aides.md` relue à la source le 12 novembre 2026. Choix tranchés par Julien le 12 novembre 2026 (`docs/propositions.md`, section 4). |
| 5 | Histogramme (viseur et revue), alerte des hautes lumières | MES-06, MES-07 | Écran de revue fait, 0.3.57 ; viseur à faire | Spécification `docs/specifications/histogramme-revue.md` ; sections 3 et 4 du dossier `docs/dossiers/viseur-aides.md` relues à la source le 12 novembre 2026. Onze choix à confirmer par Julien (`docs/propositions.md`, section 4). Reste : l'histogramme en direct dans le viseur (mesurer d'abord le coût de la lecture des pixels sur téléphone ; section 2 du dossier à finir de relire), les zébrures (échelle IRE à sourcer), l'alerte des zones sous-exposées. |
| 6 | Balance des blancs | COU-01, COU-02, COU-04 | À faire | Dossier `docs/dossiers/balance-des-blancs.md`, écrit, à relire à la source. Babylon.js 9.35.0 a déjà une balance (`imageProcessingConfiguration.whiteBalanceEnabled`, `temperature`, `tint`) ; la photo calculée ne passe pas par elle. |
| 7 | Situations jouables dans le parc | SIT-28, SIT-V2-02, SIT-V2-06 | À faire | Fiches, défis ; sources à chercher pour OPT-06 et CMP-07. |
| 8 | Solveur de situations | | À faire | Dossier de sources à faire (coupé par la limite d'usage). |
| 9 | Nouvelles scènes (photos à 360° de Poly Haven, CC0) | selon la scène | À faire | Dossier `docs/dossiers/scenes.md`, écrit, à relire à la source : 38 photos candidates, toutes sous CC0 ; ordre proposé : socle commun, neige, intérieur près d'une fenêtre. Avec elles : une vraie mesure de la lumière (aujourd'hui, les modes A et S visent une constante de 12,5 IL), les modes de mesure, le mode P, la mise au point manuelle (dossiers de sources à faire). |
| 10 | Simulateur de LUM-02 et notions de lumière | LUM-02 | À faire | Demande une scène dont l'éclairage change. |

À côté de la file :
- quatre notions du jalon de la V1 minimale n'ont pas leur brique « situation réelle » (`python3 scripts/coverage.py` : 13 sur 17 depuis l'ajout de CMP-02 au jalon) : EXP-04, EXP-05, EXP-06 et MES-04 renvoient à des situations non rédigées. Les recettes de SIT-01 et de SIT-06 utilisent pourtant l'ouverture, la vitesse et l'ISO : ajouter ces renvois au référentiel est à proposer à Julien ; MES-04 attend une scène claire ou à contre-jour ;
- mise en page à corriger : sur un écran étroit, avec une police plus large que celle de la machine de Claude (DejaVu Sans), l'aide de la mise au point prend une ligne de plus en AF-S qu'en AF-C, et le viseur change de hauteur (238 ou 254 pixels sur l'iPhone 14 émulé). Trouvé au premier passage de la routine dans la CI, le 12 novembre 2026 ; le contrôle des collimateurs mesure maintenant le cadre au moment où il s'en sert ;
- routine de test dans la CI, échec non expliqué : au deuxième passage de la pull request de la version 0.3.54, le profil ordinateur s'est arrêté sur un délai dépassé à l'entrée du mode S (`page.check: Timeout 300000ms exceeded`). Non reproduit sur la machine de Claude avec la police de la CI, ni au quatrième passage. La routine garde depuis le journal d'appel de Playwright et l'état de la page : si l'échec revient, lire ce message avant toute relance. Les durées varient beaucoup d'un passage à l'autre (de 7 à 23 minutes par profil) ;
- fiche CMP-02 : une source est à chercher pour « quand centrer » et pour la symétrie, que les pages lues ne traitent pas (décision de Julien du 12 novembre 2026) ;
- écran de revue qui s'ouvre déjà défilé : dans Chromium, l'écran de revue garde son défilement d'une photo à la suivante ; après avoir fait défiler jusqu'à « Revenir au viseur », la photo suivante s'ouvre le haut coupé. Constaté le 12 novembre 2026 pendant les essais de la version 0.3.57, et déjà visible sur les captures de la routine de la version 0.3.52 ; non corrigé dans cette version, pour ne pas mêler deux sujets ;
- vêtements clairs à la valeur maximale dès l'exposition jugée correcte (0,8 % de l'image à −0,2 IL, mesuré avec les histogrammes de la version 0.3.57) : étalonnage de la scène à revoir avec la mesure de la lumière (ligne 9 de la file ; `docs/questions-ouvertes.md`) ;
- fiches MES-06 et MES-07 : leur brique « situation réelle » manque, leurs situations (SIT-02, SIT-10, SIT-13) n'étant pas rédigées ;
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
- Confirmer ou annuler les choix faits sans lui (`docs/propositions.md`, dernière section), à mesure qu'ils s'ajoutent. Premiers choix : les grilles de cadrage (version 0.3.56), puis les histogrammes et les hautes lumières de l'écran de revue (version 0.3.57).
- Renderpeople : date et périmètre de l'accord déjà obtenu, pour le documenter (`docs/questions-ouvertes.md`).
- Relecture des fiches : les signaler relues pour `data/relecture.yaml`.
- Tests avec cinq débutants (`docs/propositions.md`, section 2).
