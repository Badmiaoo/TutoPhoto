# Questions ouvertes et prochaines étapes

_Repris de la section 8 de `REPRISE.md` (7 novembre 2026), puis mis à jour le même jour avec les décisions de la session 1 ; détail dans `docs/historique.md`._

## Questions ouvertes


- [x] Taille de la V1 : tranché le 7 novembre 2026. V1 minimale testée d'abord (scène de parc : SIT-01, SIT-05, SIT-06), puis extension.
- [x] Nom du projet : tranché le 7 novembre 2026, TutoPhoto.
- [x] Licences : tranché le 7 novembre 2026. Code sous MIT, contenus et données sous CC BY-SA 4.0, modèles et textures 3D de tiers sous CC0 ou CC BY (`docs/licences.md`).
- [x] Smartphone : tranché le 7 novembre 2026. Hors périmètre, comme les compacts et les bridges : reflex et hybrides uniquement.
- [ ] Scènes 3D (pour la scène de parc : à décider avec la pile technique) : qui les modélise (le porteur du projet, des contributeurs, des bibliothèques de modèles sous licence libre), avec quel niveau de réalisme, et où stocker les fichiers lourds (hors du dépôt Git ou non) ?
- [ ] Relecture : qui valide l'exactitude des contenus et de leurs sources avant publication, en français et en anglais ?
- [x] Flash en 2.5D : sans objet depuis le passage à la 3D de synthèse. Le rendu du flash reste à vérifier dans la maquette (chantier du domaine LUM).
- [x] Hébergement : tranché le 7 novembre 2026. Dépôt public (`docs/publication.md`) et GitHub Pages d'abord (site statique), avec bascule vers le serveur de Julien si le moteur 3D exige des en-têtes HTTP particuliers ou si les scènes dépassent les [limites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- [x] Pile technique : tranché le 7 novembre 2026, Babylon.js (comparaison et points à traiter dans `docs/pile-technique.md`).
- [ ] Tests de la V1 minimale : les testeurs sont des débutants de l'entourage de Julien (tranché le 7 novembre 2026) ; restent le nombre, le protocole et les critères pour décider d'étendre.

## Points à surveiller

- Réalisme de la 3D de synthèse : à évaluer dans la maquette, avec les débutants.
- Rendu, au choix du moteur : flou d'un premier plan qui déborde sur le sujet, flou de mouvement et poses longues, flash (chantiers des domaines MAP, MVT et LUM).
- Niveaux des situations : la règle de la médiane est un choix par défaut de la v0.2, à confirmer en écrivant les premiers défis.
- Lisibilité sur téléphone, demandée par l'audit indépendant : intitulé anglais à la ligne, codes cliquables, textes lisibles. À appliquer dans la maquette.
- SunCalc : le dépôt n'affiche aucune version publiée et la v2.0 a changé unités et conventions ; figer un commit.
- Sources et vérifications à compléter, d'après les champs `todo` du référentiel :

  - MES-04, BOI-14, BOI-19, MAP-03, NET-02, NET-03, NET-04, MVT-02, MVT-09, OPT-03, LUM-08, LUM-11, LUM-12, COU-01, COU-06, PLA-05 : sourcer les affirmations à la rédaction de la fiche (audit A du 7 novembre 2026).
  - MES-13 : ajouter une source primaire (Wikipedia est secondaire).
  - BOI-28 : source ancienne, à compléter par une source récente.
  - OPT-12 : ajouter une source pour la polarisation du ciel, maximale à 90° du soleil.
  - LUM-04 : sourcer la qualité de la lumière à ces heures à la rédaction ; le calcul des horaires relève de PLA-01.
  - COU-05 : remplacer Canon Print Studio Pro, source indirecte, par une source directe (audit A).
  - COU-09 : sourcer la pratique de la balance des blancs sous l'eau à la rédaction.
  - PLA-07 : écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé.
  - PLA-09 : écrire le contenu juridique pays par pays, à partir des textes officiels ; aucun chiffre ni article inventé.
  - Domaine MAP : vérifier, au choix du moteur de rendu, que le flou d'un premier plan qui déborde sur le sujet est rendu correctement.
  - Domaine MVT : choisir, avec le moteur de rendu, la méthode de rendu du flou de mouvement et des poses longues.
  - Domaine LUM : vérifier, dans la maquette 3D, le rendu du flash direct, rebondi et déporté.

## Prochaines étapes

On n'étend au-delà de la V1 minimale qu'après l'avoir testée avec des débutants.

1. Verser le référentiel dans le dépôt : fait le 7 novembre 2026 (version 0.2.0), à l'état de brouillon à remettre en question.
2. Trancher les questions ouvertes, au fil des étapes.
3. Proposer la pile technique de la maquette et du moteur de rendu 3D : deux ou trois options comparées sur le réalisme, la profondeur de champ, le flou de mouvement, le bruit, le flash, les performances sur téléphone et les licences. Julien choisit.
4. Maquetter les écrans clés de la V1 minimale, lisibles sur téléphone : accueil et trois portes, questionnaire de situation, recette expliquée, boîtier virtuel et viseur avec collimateurs, simulation et bulletin, fiche notion.
5. Prouver le moteur de rendu sur la scène de parc : exposition, mise au point, profondeur de champ, bruit, flou de bougé et de sujet.
6. Rédiger en français et en anglais les contenus des notions et des situations de la V1 minimale, sources à l'appui, en relevant les termes des manuels des constructeurs.
7. Tester avec des débutants, corriger, puis étendre aux autres situations.
