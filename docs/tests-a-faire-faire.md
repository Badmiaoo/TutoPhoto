# Tests à faire faire

Liste tenue par Claude, à la demande de Julien (15 novembre 2026) : « Continue avec tes propres testes, tu me feras un fichiers avec la liste des testes a faire faire que je ferais faire et que je te donnerais pour ajuster. Mais c'est pas bloquant. »

Ce que les tests de Claude ne peuvent pas établir : ils tournent dans Chromium en rendu logiciel, sur des écrans émulés, avec les gestes d'une souris. Rien n'y est essayé sur un vrai téléphone, avec un processeur graphique, ni dans Safari. Chaque version ajoute ici ce qui reste à voir de cette façon ; rien de cette liste ne bloque le travail.

## Comment rendre un résultat

Pour chaque test : son numéro ; la version lue à l'écran ; l'appareil et le navigateur ; ce qui a été fait ; ce qui a été vu ; une capture d'écran si possible. Julien donne les résultats à Claude, qui note ici le résultat et ce qu'il en fait.

## Avant tout test : lire la version

Depuis la version 0.3.59, le site dit quelle version il est : en bas de la page d'accueil (« Version X.Y.Z ») et dans la fenêtre « Crédits » du simulateur, au-dessus de la liste des crédits (« Version du site : X.Y.Z ») ; la ligne se lit à l'ouverture de la fenêtre, sans la faire défiler. Le numéro de la fenêtre des crédits est celui du code du simulateur que le navigateur a chargé : c'est lui qui compte. Un numéro plus ancien que la version attendue veut dire que le navigateur n'a pas chargé la dernière version publiée.

## Sur un téléphone

| N° | Depuis la version | Quoi faire | Quoi regarder | Résultat |
| --- | --- | --- | --- | --- |
| T1 | 0.3.59 | Ouvrir l'accueil, puis le simulateur et sa fenêtre « Crédits ». | Le numéro de version se lit aux deux endroits, et c'est celui de la dernière version publiée. | À faire |
| T2 | 0.3.53 | Cadrer dans le simulateur, bouger l'appareil, changer les réglages. | La netteté et la fluidité du viseur (densité du viseur plafonnée à 2 depuis cette version). | À faire |
| T3 | 0.3.59 | Dans le simulateur : prendre une photo, toucher « Infos », toucher « Revenir au viseur », reprendre une photo. | La seconde photo s'ouvre-t-elle en haut de l'écran de revue, entière ? Avant cette version, dans Chromium sur un iPhone 14 émulé, elle pouvait s'ouvrir défilée, ou hors de l'écran. La correction n'a été essayée que là : Safari n'a pas été essayé, et Claude ne sait pas si le défaut s'y produisait. | À faire |
| T4 | 0.3.60 | Ouvrir l'accueil, une fiche (par exemple NET-01) et le simulateur, sans rien effacer du navigateur avant. À faire de préférence sur un téléphone où l'anglais avait été choisi avant cette version. | Les trois pages s'ouvrent-elles en français, sans bouton de langue ? Depuis cette version, le site est en français seul et ne lit plus le choix de langue enregistré par le navigateur (clé `tutophoto.lang`). Essayé seulement dans Chromium, sur un écran de 1280 × 800 et sur un iPhone 14 émulé, avec la clé enregistrée à « en » : pages en français, sans erreur de console. Rien sur un vrai téléphone ni dans Safari. | À faire |

À venir, chacun après la fusion du sujet nommé (liste de `docs/audit/README.md`, « Réglages que seul Julien peut faire ») : la rafale tenue, doigt qui glisse (COD-09, Sujet 2) ; la photo prise un doigt posé sur le viseur (COD-01, Sujet 3) ; le rapport signal sur bruit au point visé retenu, pour une valeur lue dans la fiche EXP-06 (FEX-05, Sujet 7) ; la texture d'éclairage recréée après une perte de contexte (COD-12, Sujet 10) ; les chiffres de l'affichage de diagnostic et les capacités de rendu en flottants (Sujet 28) ; la fluidité du viseur après la refonte (Sujet 40) ; le coût d'un plafond de flou relevé (D25). Claude écrit la ligne de chaque test, avec ses gestes, quand le sujet est fusionné.

## Avec des débutants

Protocole retenu par Julien le 11 novembre 2026 : `docs/propositions.md`, section 2 (cinq testeurs). La grille de relevé reste à écrire (`docs/etat-des-travaux.md`, « À côté de la file ») ; Claude l'ajoute ici quand elle est écrite.
