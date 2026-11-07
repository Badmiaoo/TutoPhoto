# Questions ouvertes et prochaines étapes

_Section 8 de `REPRISE.md` (7 novembre 2026), copiée sans réécriture ; seuls les niveaux de titre changent._

## Questions ouvertes

Neuf points. Les licences se tranchent avant tout contenu ; le flash se tranche pendant la preuve du moteur.

- [ ] Taille de la V1 : 189 notions, dont 12 en partie, et 42 situations d'un seul bloc, ou des jalons internes (par exemple boîtier, exposition et mise au point d'abord) ?
- [ ] Nom du projet et du dépôt.
- [ ] Licences : laquelle pour le code (permissive ou copyleft), laquelle pour les contenus (famille Creative Commons) ?
- [ ] Smartphone : un profil « smartphone » dans le boîtier virtuel dès la V1, ou hors périmètre ? BOI-28 en dépend.
- [ ] Scènes : qui les capture (le porteur du projet, des contributeurs, des banques d'images sous licence libre), avec quel protocole, et où les stocker (fichiers lourds hors du dépôt Git ou non) ?
- [ ] Relecture : qui valide l'exactitude des contenus et de leurs sources avant publication, en français et en anglais ?
- [ ] Flash en 2.5D : les captures ambiante et flash seul suffisent-elles, ou faut-il aussi le calcul par carte de profondeur ? Si aucune approche ne tient, le flash passe entièrement en V2, et avec lui SIT-02, SIT-25 et SIT-34.
- [ ] Hébergement : serveur personnel, hébergement statique public, ou les deux ?
- [ ] Pile technique de la maquette et du moteur de rendu : Claude Code propose des options, Julien tranche.

## Points à surveiller

- Faisabilité, à prouver en maquette : scènes en couches, flash par captures, flou de défilement (SIT-29), poses longues reconstruites par séquences.
- Niveaux des situations : la règle de la médiane est un choix par défaut de la v0.2, à confirmer en écrivant les premiers défis.
- Lisibilité sur téléphone, demandée par l'audit indépendant : intitulé anglais à la ligne, codes cliquables, textes lisibles. À appliquer dans la maquette.
- SunCalc : le dépôt n'affiche aucune version publiée et la v2.0 a changé unités et conventions ; figer un commit.
- Licence des modèles métriques de Depth Anything : je ne sais pas ; seule la version Small (Apache-2.0) est vérifiée.
- Sources et vérifications à compléter, d'après les champs `todo` du référentiel :

  - MES-04, BOI-14, BOI-19, MAP-03, NET-02, NET-03, NET-04, MVT-02, MVT-09, OPT-03, LUM-08, LUM-11, LUM-12, COU-01, COU-06, PLA-05 : sourcer les affirmations à la rédaction de la fiche (audit A du 7 novembre 2026).
  - MES-13 : ajouter une source primaire (Wikipedia est secondaire).
  - BOI-28 : dépend de la question ouverte sur le smartphone.
  - BOI-28 : source ancienne, à compléter par une source récente.
  - OPT-12 : ajouter une source pour la polarisation du ciel, maximale à 90° du soleil.
  - LUM-04 : sourcer la qualité de la lumière à ces heures à la rédaction ; le calcul des horaires relève de PLA-01.
  - COU-05 : remplacer Canon Print Studio Pro, source indirecte, par une source directe (audit A).
  - COU-09 : sourcer la pratique de la balance des blancs sous l'eau à la rédaction.
  - PLA-07 : écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé.
  - PLA-09 : écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé.
  - Domaine MAP : faisabilité des scènes en couches à valider en maquette (étape 5).
  - Domaine MVT : flou reconstruit par séquences et flou de défilement (SIT-29) à valider en maquette.
  - Domaine LUM : flash par captures ambiante et flash seul à valider en maquette (étape 5).

## Prochaines étapes

La 3D ne démarre qu'une fois la maquette 2.5D validée.

1. Valider le référentiel : fait le 7 novembre 2026, v0.2.
2. Trancher les questions ouvertes, au fil des étapes.
3. Verser le référentiel dans le dépôt sous forme de fichiers de données : source unique pour l'outil, la couverture et les traductions (session 1, section 0.7).
4. Maquetter en 2.5D les écrans clés : accueil et trois portes, questionnaire de situation, recette expliquée, boîtier virtuel et viseur avec collimateurs, simulation et bulletin, fiche notion, carte du référentiel avec sa couverture.
5. Prouver le moteur de rendu sur une seule scène : exposition, mise au point, profondeur de champ, bruit, flou de bougé, flash direct à partir des captures ambiante et flash seul.
6. Valider la maquette, puis écrire la doc fonctionnelle et technique et produire les contenus FR/EN notion par notion, en relevant les termes des manuels français des constructeurs.
7. V2 : passage en 3D et contenus débloqués.
