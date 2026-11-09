# Questions ouvertes et prochaines étapes

_Repris de la section 8 de `REPRISE.md` (7 novembre 2026), puis mis à jour le même jour avec les décisions de la session 1 ; détail dans `docs/historique.md`._

## Questions ouvertes


- [x] Taille de la V1 : tranché le 7 novembre 2026. V1 minimale testée d'abord (scène de parc : SIT-01, SIT-05, SIT-06), puis extension.
- [x] Nom du projet : tranché le 7 novembre 2026, TutoPhoto.
- [x] Licences : tranché le 7 novembre 2026. Code sous MIT, contenus et données sous CC BY-SA 4.0, modèles et textures 3D de tiers sous CC0 ou CC BY (`docs/licences.md`).
- [x] Smartphone : tranché le 7 novembre 2026. Hors périmètre, comme les compacts et les bridges : reflex et hybrides uniquement.
- [ ] Scènes 3D. Pour la scène de parc, tranché les 7 et 8 novembre 2026 : modèles, textures et photos sous CC0 ou CC BY, stockés dans le dépôt ; fond et éclairage tirés d'une photo à 360°, premier plan en 3D (`docs/historique.md`). Reste ouvert pour les autres scènes : qui les assemble, avec quel niveau de réalisme.
- [ ] Droit à l'image des personnes scannées par Renderpeople (personnages de la scène de parc). La licence CC BY 4.0 porte sur le droit d'auteur du modèle 3D ; elle exclut les droits de la personnalité (« nor are publicity, privacy, and/or other similar personality rights », section 2(b)(1) du [texte CC BY 4.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC-BY-4.0.txt)). Je ne sais pas si Renderpeople a obtenu des personnes scannées une autorisation qui couvre ce type d'usage : ses conditions n'ont pas été lues (site non joignable depuis la session de travail). À vérifier avant toute diffusion large.
- [ ] Relecture : qui valide l'exactitude des contenus et de leurs sources avant publication, en français et en anglais ?
- [x] Flash en 2.5D : sans objet depuis le passage à la 3D de synthèse. Le rendu du flash reste à vérifier dans la maquette (chantier du domaine LUM).
- [x] Hébergement : tranché le 7 novembre 2026. Dépôt public (`docs/publication.md`) et GitHub Pages d'abord (site statique), avec bascule vers le serveur de Julien si le moteur 3D exige des en-têtes HTTP particuliers ou si les scènes dépassent les [limites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- [x] Pile technique : tranché le 7 novembre 2026, Babylon.js (comparaison et points à traiter dans `docs/pile-technique.md`).
- [ ] Tests de la V1 minimale : les testeurs sont des débutants de l'entourage de Julien (tranché le 7 novembre 2026) ; restent le nombre, le protocole et les critères pour décider d'étendre.

## Points à surveiller

- Réalisme de la 3D de synthèse : à évaluer dans la maquette, avec les débutants.
- Fond photo à 360° de la scène de parc :
  - L'image affichée est la version JPG de Poly Haven, en 8 bits et déjà tonemappée : ses hautes lumières sont écrêtées. Seul l'éclairage vient du fichier HDR (1024 × 512 px). À réévaluer quand l'exposition sera simulée (surexposition, sous-exposition du ciel).
  - Profondeur de champ : le fond est placé à 500 m, ce qui revient à l'infini. Le flou d'un arrière-plan à la distance d, pour une mise au point à s, vaut (1 − s/d) fois le flou à l'infini. Exemple : portrait à s = 2 m devant des arbres à d = 30 m, 1 − 2/30 ≈ 0,93, soit un flou réel inférieur d'environ 7 % à celui affiché. La distance réelle des arbres de la photo n'est pas connue.
  - Hauteur de prise de vue de la photo : non publiée par Poly Haven ; 1,6 m supposé. Si elle est fausse, les objets 3D paraissent posés trop près ou trop loin sur le sol de la photo.
  - Mémoire sur téléphone : la photo fait 8192 × 4096 px. Babylon la réduit si l'appareil n'accepte pas cette taille de texture, mais la mémoire utilisée reste à mesurer sur les téléphones des testeurs.
  - Ombres de contact sous les objets 3D : réglées à l'œil le 8 novembre 2026.
  - Sol de la photo : projeté sur un plan pour la photo calculée (`docs/camera-physique.md`), donc supposé plat.
- Photo calculée : sur le téléphone de Julien, 0,8 s avec les réglages par défaut et 2,0 s pour 256 rendus (9 novembre 2026). Reste à mesurer sur les appareils des autres testeurs.
- Bruit : discret sur une photo de 1500 px (environ 3 % dans les tons moyens à ISO 6400 pour le Z 6), plus visible à 100 %. Une loupe à 100 % et l'extension des ISO au-delà de 6400 restent à décider.
- Personnages et chien de la scène de parc :
  - Fabienne & Percy compte 199 850 triangles (version « 200k » de l'archive) et Dennis 99 964 : charge à mesurer sur téléphone, avec réduction possible.
  - Le chien est stylisé, les personnages réalistes : écart de rendu à juger avec les débutants.
  - Vitesse du chien (3,5 m/s) estimée dans son animation, de façon imprécise ; elle compte pour le flou de bougé de SIT-06.
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
  - Domaine MAP : vérifier, au choix du moteur de rendu, que le flou d'un premier plan qui déborde sur le sujet est rendu correctement. L'accumulation de rendus retenue pour la photo le traite par construction ; à vérifier dans la mise en œuvre.
  - Domaine MVT : choisir, avec le moteur de rendu, la méthode de rendu du flou de mouvement et des poses longues. Pour la photo, tranché le 8 novembre 2026 : accumulation de rendus (`docs/camera-physique.md`).
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
