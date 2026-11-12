# Questions ouvertes et prochaines étapes

_Repris de la section 8 de `REPRISE.md` (7 novembre 2026), puis mis à jour le même jour avec les décisions de la session 1 ; détail dans `docs/historique.md`._

## Questions ouvertes


- [x] Taille de la V1 : tranché le 7 novembre 2026. V1 minimale testée d'abord (scène de parc : SIT-01, SIT-05, SIT-06), puis extension.
- [x] Nom du projet : tranché le 7 novembre 2026, TutoPhoto.
- [x] Licences : tranché le 7 novembre 2026. Code sous MIT, contenus et données sous CC BY-SA 4.0, modèles et textures 3D de tiers sous CC0 ou CC BY (`docs/licences.md`).
- [x] Smartphone : tranché le 7 novembre 2026. Hors périmètre, comme les compacts et les bridges : reflex et hybrides uniquement.
- [ ] Scènes 3D. Pour la scène de parc, tranché les 7 et 8 novembre 2026 : modèles, textures et photos sous CC0 ou CC BY, stockés dans le dépôt ; fond et éclairage tirés d'une photo à 360°, premier plan en 3D (`docs/historique.md`). Reste ouvert pour les autres scènes : qui les assemble, avec quel niveau de réalisme.
- [ ] Droit à l'image des personnes scannées par Renderpeople (personnages de la scène de parc). La licence CC BY 4.0 porte sur le droit d'auteur du modèle 3D ; elle exclut les droits de la personnalité (« nor are publicity, privacy, and/or other similar personality rights », section 2(b)(1) du [texte CC BY 4.0](https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/CC-BY-4.0.txt)). Je ne sais pas si Renderpeople a obtenu des personnes scannées une autorisation qui couvre ce type d'usage : ses conditions n'ont pas été lues (site non joignable depuis la session de travail). À vérifier avant toute diffusion large.
- [x] Relecture : tranché le 11 novembre 2026. Julien et une relectrice qu'il a désignée valident l'exactitude des contenus et de leurs sources, en français et en anglais. Le même jour, Julien décide de publier les fiches avant leur relecture, avec un bandeau « Fiche en cours de relecture », pour voir celles qui restent à relire ; `data/relecture.yaml` liste les fiches relues (version 0.3.46).
- [x] Flash en 2.5D : sans objet depuis le passage à la 3D de synthèse. Le rendu du flash reste à vérifier dans la maquette (chantier du domaine LUM).
- [x] Hébergement : tranché le 7 novembre 2026. Dépôt public (`docs/publication.md`) et GitHub Pages d'abord (site statique), avec bascule vers le serveur de Julien si le moteur 3D exige des en-têtes HTTP particuliers ou si les scènes dépassent les [limites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- [x] Pile technique : tranché le 7 novembre 2026, Babylon.js (comparaison et points à traiter dans `docs/pile-technique.md`).
- [x] Tests de la V1 minimale : les testeurs sont des débutants de l'entourage de Julien (tranché le 7 novembre 2026). Nombre, déroulé et critères tranchés le 11 novembre 2026 : 5 testeurs, protocole de `docs/propositions.md`, extension seulement si tous les testeurs réussissent chaque défi sans aide et répondent mieux après qu'avant, sans blocage technique et après correction des problèmes relevés. Reste à faire passer les tests.

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
- Balance des blancs (COU-02), grilles de composition (CMP-02), histogramme (MES-06), demandés par Julien le 9 novembre 2026 : Julien laisse le moment à Claude, qui les place après les tests de la V1 minimale. Pour la balance des blancs, la température de couleur de la scène reste à mesurer. Dans la nuit du 11 au 12 novembre 2026, Julien demande à Claude de continuer seul ; Claude le comprend comme la levée de l'attente des tests (`docs/etat-des-travaux.md`) : grilles de cadrage faites en version 0.3.56.
- Grilles de cadrage (CMP-02, version 0.3.56), choix faits sans Julien, à confirmer (`docs/propositions.md`, section 4). Ce que les pages lues ne disent pas :
  - le tracé du quadrillage du Nikon Z 6 (réglage d9) : le manuel écrit seulement « a grid ». À relever sur un boîtier ou sur une capture officielle ; d'ici là, TutoPhoto ne le simule pas et propose deux grilles communes à tous les boîtiers ;
  - les grilles des Canon EOS RP et EOS 2000D : manuels introuvables sur les sites que Claude peut joindre (`docs/dossiers/viseur-aides.md`, section 0) ;
  - le nombre de cases de « Square Grid » et le tracé de « Diag. + Square Grid » de Sony, le réglage par défaut de « Grid Line » sur l'A7 III, et les noms français du réglage sur l'A6000 (page française introuvable, 404) ;
  - la grille du viseur optique du Nikon D5600 (seul l'affichage « Framing grid » de la visée écran est lu, sur une page d'aide) ;
  - ce que devient la grille d'un boîtier quand on agrandit l'image, et le fait qu'elle n'est pas enregistrée sur la photo ;
  - pour la fiche CMP-02 : quand centrer le sujet, et la symétrie. L'article de Wikipedia « Rule of thirds » (révision 1383322855) n'en dit rien : une source reste à trouver.
- « Équilibre » entre ouverture, vitesse et ISO : forme B choisie par Julien le 9 novembre 2026, un triangle dans lequel un point bouge. Critères sourcés proposés le 9 novembre : bruit (rapport signal/bruit 40:1 et 10:1), traînée du sujet (cercle de confusion d/1500). Tranché le 10 novembre par le principe de Julien (`docs/cadrage.md`) : profondeur de champ montrée sans jugement, bougé de la main exclu tant qu'il n'est ni sourcé ni simulé. Fait en version 0.3.31 ; le bruit est calculé sur le seul canal vert, la norme pondérant luminance et couleur d'une façon que la source lue ne détaille pas.
- Modes de mise au point (MAP-04, MAP-05, MAP-09, dans la V1 minimale) : ordre recommandé, accepté par Julien le 9 novembre 2026. AF ponctuel ou continu fait en version 0.3.26 ; modes de zone faits en version 0.3.27 ; détection des yeux et zone automatique faites en version 0.3.29. Les échecs, les hésitations et le temps de l'autofocus ne sont pas simulés, ni le délai de suivi (réglage a3) : à revoir si les tests avec les débutants le demandent.
- Détection des yeux : seuils de taille (0,4 % et 0,8 % du grand côté du cadre pour l'écart entre les yeux, 25 % au plus) choisis pour TutoPhoto ; le manuel du Z 6 n'en donne pas. Sans visage, la règle du sujet le plus proche vient d'un compact Nikon (COOLPIX P1100), faute de texte pour le Z 6.
- Taille des zones larges (S) et (L) : non trouvée pour le Nikon Z 6 ; carrés de 10 % et de 20 % du grand côté du cadre, choisis pour TutoPhoto. À remplacer si une source la donne.
- Profondeur de champ du viseur : option B choisie par Julien le 9 novembre 2026 (flou en disque de taille physique, version 0.3.23). Fluidité « bonne » sur son Google Pixel 8 Pro (10 novembre 2026) ; reste à vérifier sur les appareils des testeurs. Version 0.3.52 : viseur calculé à la densité complète de l'écran (environ 7 fois plus de pixels sur un téléphone), plus net mais saccadé sur le téléphone de Julien. Version 0.3.53 : densité plafonnée à 2 (4 fois plus de pixels) ; netteté et fluidité à revérifier, sur son téléphone puis sur ceux des testeurs.
- Chargement sans fin sur le téléphone de Julien (9 novembre 2026) : la cause exacte (shader du bruit qui ne compile pas, ou autre) reste à identifier avec le diagnostic affiché à l'écran depuis la version 0.3.18, et le modèle du téléphone et le navigateur.
  - Nouveau cas le 11 novembre 2026 : même téléphone, Chrome, données mobiles avec une réception faible ; la scène ne s'affiche toujours pas après environ deux minutes. Les captures de Julien montrent la page et le code du simulateur chargés (adresse avec la barre finale, boutons étiquetés, aucune ligne de diagnostic) : seuls les fichiers de la scène n'étaient pas arrivés. Piste la plus probable : le débit. 34 Mio demandent environ 2 min 24 s à 2 Mbit/s et près de 5 min à 1 Mbit/s (34 × 2²⁰ × 8 bits ÷ débit). Non confirmé : la page n'affichait aucune progression.
  - Version 0.3.51 : progression affichée pendant le chargement (Mio reçus, temps, puis fichiers attendus après une minute) ; bouton « Télécharger les ressources du simulateur » sur l'accueil, avec débit mesuré (proposé par Julien) ; barre finale ajoutée aux adresses `…/simulateur` et `…/activites/LUM-02`. À refaire sur le téléphone de Julien, en données mobiles puis en Wi-Fi.
- Bruit : discret sur une photo de 1500 px (environ 3 % pour le vert dans les tons moyens à ISO 6400 avec le Z 6, contre 8,8 % pour un photosite seul). Tout doit se voir (décision du 9 novembre 2026) : loupe à 100 % dans le viseur et sur l'écran de revue depuis la version 0.3.17. À 100 %, le fond à 360° (8192 pixels pour 360°) paraît flou ; une photo de fond plus fine reste à chercher si les testeurs s'en plaignent. Extension des ISO au-delà de 6400 à décider.
- Personnages et chien de la scène de parc :
  - Fabienne & Percy compte 199 850 triangles (version « 200k » de l'archive) et Dennis 99 964 : charge à mesurer sur téléphone, avec réduction possible.
  - Le chien est stylisé, les personnages réalistes : écart de rendu à juger avec les débutants.
  - Vitesse du chien (3,5 m/s) estimée dans son animation, de façon imprécise ; elle compte pour le flou de bougé de SIT-06.
- Couverture de l'autofocus par boîtier (décision de Julien du 11 novembre 2026) : celle du Z 6 pour la V1 minimale ; celle des hybrides Sony A7 III, Sony A6000 et Canon EOS RP à ajouter quand Julien aura relevé les chiffres sur les pages officielles ; les reflex Nikon D5600 et Canon EOS 2000D (collimateurs fixes du viseur optique) en V2. EOS RP simulé depuis la version 0.3.43 (88 % en largeur, 100 % en hauteur, fiche de Canon relevée par Julien). A6000 : Sony écrit « covering almost the entire image », sans pourcentage ; il garde celle du Z 6. A7 III simulé depuis la version 0.3.45 : environ 93 % de la surface d'après la page de Sony relevée par Julien, partagés également entre largeur et hauteur (choix de TutoPhoto, non sourcé).
- Sources de EXP-06 : DPReview (« What is ISO invariance, and should I care? ») et Photography Life (« ISO Invariance Explained ») ne se lisent pas depuis la session de travail : le proxy les laisse passer depuis le 11 novembre 2026, mais les deux sites répondent 403 aux lectures automatiques. Julien a relevé leur texte le 11 novembre 2026 : les deux articles sont cités dans la fiche depuis la version 0.3.42.
- LUM-02 (lumière dure ou douce) : fiche rédigée en version 0.3.40, d'après le guide Lowel de Tiffen et un article d'Art Adams (ProVideo Coalition, 2011). L'article de Wikipedia « Hard and soft light » (révision 1356519852) n'est pas retenu : marqué « Refimprove », son passage sur la distance de la source se lit mal. L'activité de la fiche se fait chez soi ; l'activité interactive dans TutoPhoto reste à construire. Simulateur en V2, décision de Julien du 10 novembre 2026. Le fond de la scène de parc est une photo à 360° prise par ciel couvert, qu'un soleil direct contredirait ; en V1, une activité interactive le remplace. Activité interactive dans TutoPhoto : schéma en 2D, choisi par Julien le 11 novembre 2026 (`docs/propositions.md`), construit en version 0.3.50 (`activites/LUM-02/`).
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
4. Maquetter les écrans clés de la V1 minimale, lisibles sur téléphone : accueil et trois portes, questionnaire de situation, recette expliquée, boîtier virtuel et viseur avec collimateurs, simulation et bulletin, fiche notion. Depuis le 10 novembre 2026, le solveur de situations est en V2 : la recette des trois situations est écrite à la main dans leur fiche (`docs/cadrage.md`). Version 0.3.46 : accueil avec les trois portes, fiches des notions et des situations publiées (bandeau de relecture), simulateur sous `simulateur/`. Version 0.3.47 : « Jouer le défi » depuis la fiche d'une situation, fiches ouvertes par-dessus le simulateur depuis le bulletin et la fenêtre « Défis ».
5. Prouver le moteur de rendu sur la scène de parc : exposition, mise au point, profondeur de champ, bruit, flou de bougé et de sujet.
6. Rédiger en français et en anglais les contenus des notions et des situations de la V1 minimale, sources à l'appui, en relevant les termes des manuels des constructeurs.
7. Tester avec des débutants, corriger, puis étendre aux autres situations. Ordre de travail pour la suite, retenu par Julien le 11 novembre 2026 : `docs/propositions.md`.
