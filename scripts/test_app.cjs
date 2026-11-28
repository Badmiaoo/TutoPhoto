#!/usr/bin/env node
// Routine de test du site construit, sur ordinateur et sur mobile (demande de Julien du 9 novembre 2026).
//
// Usage : node scripts/test_app.cjs [--dist app/dist] [--profils ordinateur,android,iphone,webgl1]
//                                   [--photo] [--sorties dossier]
// Prérequis : Playwright (licence Apache-2.0) et son Chromium, installés hors du dépôt ; le site construit
// (cd app && npm run build).
//
// Limites : Chromium seul, avec un rendu logiciel (SwiftShader). Les profils mobiles émulent la taille et la
// densité de l'écran et l'identification du navigateur (Babylon.js change de comportement sur iPhone et iPad), et
// déclarent un écran tactile ; mais un seul geste de la routine est un toucher, la fermeture d'une fenêtre par un
// toucher sur le fond (page.touchscreen.tap, profil iphone, checkPhoneLayout, depuis la version 0.4.10) : les autres
// clics, glissés et appuis tenus passent par la souris (constat INT-13 de l'audit). Ils n'émulent ni le processeur
// graphique ni le moteur Safari : un vrai téléphone reste nécessaire. Dans la liste des contrôles ci-dessous et dans leurs noms,
// « toucher » nomme le geste de l'application (toucher le viseur, la carte, la photo) : la routine le fait à la
// souris ; qu'un élément ne reçoive pas les touchers, elle le vérifie par l'élément qui se trouve sous le point
// visé, lu avec document.elementFromPoint (relecture de la version 0.3.64).
//
// Contrôles des pages statiques (version 0.3.46), une fois : chaque lien interne de chaque page HTML du site
// construit mène à un fichier qui existe, et chaque ancre à un seul élément de la page visée (version 0.3.73).
//
// Contrôles, pour chaque profil :
// - l'accueil s'affiche en français, sans bouton de langue ni défilement horizontal ; ouvert avec « ?lang=en »,
//   paramètre retiré en version 0.3.60, il reste en français, comme le simulateur ;
//   « Télécharger les ressources du simulateur » remplit sa barre et donne un bilan sans échec (version 0.3.51) ;
// - une fiche (NET-01) s'affiche sans défilement horizontal, avec le bandeau de relecture tant qu'elle n'est pas
//   listée dans data/relecture.yaml, et son bouton mène au simulateur ;
// - le simulateur (simulateur/) a un lien vers l'accueil et son propre titre, « Simulateur · TutoPhoto » (INT-19,
//   version 0.3.73) ;
// - accessibilité, lue dans les attributs de la page et non dans l'arbre d'accessibilité (Sujet 38, version 0.4.7 ;
//   constats INT-08, INT-15 et INT-16 de l'audit) : le viseur a tabindex 0, à sa place dans l'ordre de tabulation ;
//   chacune des quatre valeurs de molette est nommée par le nom de sa molette ; le « + » de l'ouverture dit « fermer »,
//   celui de la vitesse « pose plus longue » ; les noms des boutons de l'indicateur et de la mise au point commencent
//   par leur texte, et le premier n'est plus une zone vivante ; la zone vivante du message de la scène est le seul
//   message (#status-message), sans le compteur du chargement ;
// - sans WebGL (getContext rend null pour webgl et webgl2, dans un contexte à part) : le message du simulateur est
//   lisible, c'est-à-dire affiché dans la fenêtre, avec son texte et la version du site, rendu par
//   document.elementFromPoint en son centre, et aucun autre élément de main n'est affiché (le voile du cadre, qui ne
//   prend pas les touchers, le couvrait sans que elementFromPoint le voie) ; le canevas est masqué (constat COD-11 de
//   l'audit, version 0.3.70), le bouton « Défis » de l'en-tête aussi, et la page n'a aucune erreur ;
// - affichage de diagnostic et capacités de rendu en flottants (constats ARC-06 et ARC-13 de l'audit, version 0.3.88),
//   dans deux contextes à part : témoin, capacités du navigateur telles quelles, simulateur ouvert avec
//   « ?diagnostic=densite-complete » et scène chargée : l'affichage donne la version du site, WebGL 2 (WebGL 1 sur le
//   profil webgl1), un débit d'images, la durée d'une image côté processeur, la ligne du processeur graphique, les deux
//   capacités exigées à « oui », la ligne des textures (de 200 à 600 Mio demandés, et la limite du processeur
//   graphique, version 0.4.15) et un viseur à la
//   densité de l'écran, et aucun problème n'est affiché ; extension
//   masquée (getExtension rend null pour EXT_color_buffer_float en WebGL 2, pour OES_texture_float et
//   OES_texture_half_float en WebGL 1, comme les essais de la contre-vérification d'ARC-13), simulateur ouvert avec
//   « ?diagnostic » : le message le dit, avec la mise au point, l'aperçu de la profondeur de champ et la version du
//   site, le déclencheur est grisé, et, réactivé par la routine, un appui ne lance aucun calcul, n'ouvre pas l'écran de
//   revue et le regrise ; l'affichage donne les deux capacités à « non » et le viseur à la densité plafonnée à 2 ;
//   aucune erreur de la page dans les deux contextes, ni de la console dans le témoin ;
// - démarrage arrêté (version 0.4.4, demande de Julien du 22 novembre 2026), dans cinq contextes à part : contexte
//   WebGL perdu dès la création, puis le même restauré, puis perdu au premier createBuffer, les fonctions de création
//   de WebGL rendant null sur un contexte perdu, comme le code de WebKit des branches safari-7618 à safari-7624 (le
//   scénario qui reproduit l'écran de l'iPhone de la capture) ; et une exception sans perte du contexte ; et, depuis la
//   version 0.4.15 (demande de Julien du 23 novembre 2026), le contexte perdu pendant le chargement de la scène, au
//   premier envoi d'une image (texImage2D), puis restauré, avec l'affichage de diagnostic ; dans chaque cas, le message
//   du démarrage arrêté, avec la version du site et « Recharger », lisible et inchangé 2 s plus tard, aucun message des
//   capacités de rendu en flottants, le canevas, le panneau du boîtier et le bouton « Défis » masqués, la ligne des
//   problèmes vide ou avec l'exception rattrapée (pendant le chargement : seulement les exceptions « Unable to
//   create … » de Babylon.js), et aucune erreur non rattrapée (pendant le chargement : aucune autre que celles-là) ;
//   pendant le chargement, le message est suivi de la progression du chargement figée à l'arrêt, et l'affichage de
//   diagnostic reste affiché, sous la ligne des problèmes, avec la ligne « Textures relevées avant la perte du
//   contexte WebGL », restauration comprise ;
// - textures allégées (version 0.4.15), dans un contexte à part : ouvert avec « ?diagnostic=textures-legeres », le
//   simulateur charge sa scène, l'affichage de diagnostic dit les textures allégées, de 30 à 150 Mio demandés (de
//   200 à 600 Mio dans le témoin de l'affichage de diagnostic) et la limite du processeur graphique remise après le
//   chargement, sans problème ni erreur ;
// - mise en page sur téléphone (Sujet 42, version 0.4.10 ; constats INT-04, INT-12, INT-03, INT-11, INT-17, INT-20 et
//   INT-14 de l'audit), profil iphone seulement, dans un contexte à part : le simulateur chargé téléphone tenu à
//   l'horizontale (iPhone 14 émulé, 750 × 340 px) a son panneau à droite du viseur, un cadre d'au moins 60 % de la
//   hauteur de la fenêtre, la vue de dessus et l'indicateur d'équilibre repliés et le bouton « Vue de dessus » dans le
//   viseur ; à cette taille, puis à 390 × 664, 412 × 839, 600 × 960 et 320 × 664 px, onze gestes qui changent les textes
//   de l'en-tête et du panneau (mode et zone de mise au point, modes de déclenchement, boîtier, mode d'exposition et
//   correction, défi, libellés du déclencheur pendant une rafale et un compte à rebours, aperçu coupé, loupe à 100 %),
//   puis le retour aux réglages de départ, ne déplacent ni le viseur, ni le cadre (même sens, même grand côté à 1,5 px
//   près), ni le déclencheur ; aucun libellé n'est coupé, les pastilles restent dans le viseur et hors du bloc « Vue de dessus », la
//   page ne défile pas en largeur ; tenu droit, le viseur fait au moins 35 % de la hauteur de la fenêtre ; à
//   320 × 664 px, les fenêtres « Mise au point », « Aperçu » et « Exposition » montrent « Fermer » sans défiler, se
//   rouvrent en haut, se ferment par un toucher sur le fond (écran tactile émulé) et pas par un appui de souris commencé
//   dedans et relâché sur lui ; à
//   l'horizontale et à 320 × 664 px, l'écran de revue couvre tout l'écran, la photo y fait au moins 90 % de la largeur
//   du cadre, et « Revenir au viseur » et « Enregistrer la photo » sont visibles sans le faire défiler ;
// - la fiche SIT-05 a un bouton « Jouer le défi » (simulateur/?defi=SIT-05), et le simulateur ouvert à l'adresse
//   simulateur?defi=SIT-06, sans la barre finale, ajoute la barre, montre la progression du chargement et a le
//   défi SIT-06 choisi ; tout fichier compté par la progression est chargé par la scène (version 0.3.55) ; le
//   paramètre ?defi= est retiré de l'adresse une fois mémorisé, et après « Aucun défi » puis un rechargement, le
//   bouton dit « Défis » (constat COD-03, version 0.3.72) ;
// - mémoire des réglages (magasin de réglages, constat ARC-02, version 0.4.9) : des réglages mémorisés, changés dans
//   les fenêtres avant ce chargement pour le défi SIT-06 (Sony A6000, mode A, correction +0,7 IL, ISO auto coupé,
//   plafond ISO 1600, vitesse minimale 1/60 s, Continu L à 4 vues par seconde, retardateur de 5 s, AF-S, zone large (L),
//   détection des animaux, bruit et profondeur de champ du viseur coupés, grille des tiers, histogrammes à l'écran de
//   revue), sont écrits dans tutophoto.boitier, tutophoto.apercu et tutophoto.revue avec les champs d'avant le magasin,
//   dans le même ordre, puis relus au chargement (fenêtres, boutons du boîtier, de la mise au point et du
//   déclenchement, bouton « Infos ») ; pendant le chargement, rien n'est écrit dans ces trois clés (écritures comptées
//   par un script posé avant lui) ;
// - l'activité LUM-02 (activites/LUM-02/) : la fiche y mène ; l'exemple « Grande fenêtre » (120 cm à 200 cm) donne une
//   pénombre de 120 × 50 / 200 = 30 cm ; la bonne réponse à la première question est saluée ; pas de défilement horizontal ;
//   source à 150 cm et à 20 cm : pénombre de 30 × 70 / 20 + 150 × 50 / 20 = 480 cm de haut, dite « au-delà du mur
//   dessiné », sans « ombre pleine au centre » dans la légende ; « source », « objet » et « mur » écrits dans le dessin,
//   sans se chevaucher (constats FMA-10 et INT-02, version 0.3.74) ; le calcul de ces valeurs est aussi essayé sans
//   navigateur, par app/tests/lum02Model.test.ts (constat INT-14, version 0.3.87) : la routine lit ce que la page écrit ;
// - avec --photo : les notions « À revoir » du bulletin et le bouton « Fiche » de la fenêtre « Défis » ouvrent la
//   fiche par-dessus le simulateur, et un lien de la fiche vers une autre fiche reste dans la fenêtre ;
// - la scène se charge (le message de chargement disparaît) et aucun problème ne s'affiche à l'écran ; sans
//   « ?diagnostic » dans l'adresse, la page n'a pas d'affichage de diagnostic (version 0.3.88) ;
// - le rendu est à la densité de l'écran plafonnée à 2 (pixels CSS × min(densité, 2), version 0.3.53) et le cadre a les
//   proportions du capteur ;
// - à ISO 6400, le bruit du viseur varie d'une image à l'autre ; aperçu coupé, il disparaît ;
// - au 135 mm à f/1.4, la profondeur de champ du viseur floute le fond ; coupée, le fond redevient net ; les deux
//   mesures se font appareil déplacé de 6 m vers la gauche par la vue de dessus, là où aucun personnage n'entre
//   dans la zone mesurée, puis l'appareil est ramené au départ (version 0.3.59) ;
// - avec --photo, au même endroit (135 mm, f/1.4, mise au point verrouillée sur le sol), une photo à grand flou : le
//   diamètre du flou du bas de la zone de la mesure du viseur (de 15 à 35 % de la largeur, de 10 à 20 % de la hauteur ;
//   cette zone va de 2 à 20 %), ajusté entre elle et une photo de référence à f/22 prise juste avant, vaut de 85 à
//   115 % du flou attendu au fond, même quand le plafond de 5 s arrête le calcul (constat PHY-21 de l'audit, version 0.4.8 : avant,
//   une photo arrêtée après k rendus sur M avait un flou réduit de √(k / M)) ;
// - la loupe passe à 50 %, puis à 100 %, et l'indique ; centrée sur le fond, à ISO 6400, elle montre du bruit ; à
//   50 %, le bruit du vert vaut moins de 85 % de celui du rouge (k compté par pixel CSS : environ 71 %) ; à densité
//   2 (entière), ce bruit est tiré par pixel CSS : mesuré par pixel CSS, il vaut au moins 85 % de celui d'un pixel
//   calculé, aux deux crans (constat PHY-07 de l'audit, version 0.3.78 ; tiré par pixel calculé, il en valait 52 %) ;
// - grilles de cadrage (CMP-02, version 0.3.56) : aucune ligne par défaut ; « Tiers », choisi dans la fenêtre
//   « Aperçu », trace quatre lignes à 1/3 et 2/3 du cadre, « Seize cases » six lignes à 1/4, 1/2 et 3/4, à 1 pixel
//   près ; « Vingt-quatre cases » a six cases sur le grand côté du cadre et quatre sur le petit ; « Tiers et
//   diagonales » ajoute deux diagonales qui couvrent tout le cadre ; le choix est écrit dans tutophoto.apercu ;
//   les lignes ne reçoivent pas les touchers ; la grille est masquée quand la loupe est à 100 % et revient quand
//   elle est coupée ; « Aucune », choisie de nouveau, retire les lignes, et ce choix est écrit lui aussi ; les
//   positions des lignes sont aussi essayées sans navigateur, par app/tests/viewfinder.test.ts (constat INT-14,
//   version 0.3.87) : la routine mesure les lignes dessinées dans le cadre ;
// - le viseur garde au moins 35 % de la hauteur de la fenêtre (iPhone : 41 % avant l'indicateur d'équilibre) ;
// - indicateur d'équilibre : zone nette et bruit excellent aux réglages par défaut ; au même point du sol,
//   immobile, le rapport signal/bruit à ISO 6400 tombe sous 40 % de celui à ISO 100 (environ 17 % attendus :
//   6 IL de sensibilité en plus, 0,87 IL d'exposition en plus, bruit photonique) ; traînée du chien évaluée ;
// - exposition (BOI-07, BOI-08, MES-04, MES-10) : M et ISO auto (ISO 100) par défaut, comme le Z 6 ; en A à
//   ISO 6400, la vitesse qu'il faudrait dépasse 1/4000 s : elle reste à 1/4000 s et clignote, sa molette, en
//   automatique, grisée ; à ISO 100, la vitesse suit l'ouverture (1/100 s à f/8, 1/400 s à f/4) ; en S à 1/4000 s et
//   ISO 100, l'ouverture qu'il faudrait dépasse f/1.4 : elle reste à f/1.4 et clignote ; avec l'ISO auto, ISO 125, et
//   elle ne clignote plus ; en M, à f/8 et 1/100 s, avec l'ISO auto et une correction de +1 IL, ISO 200, et
//   l'indicateur montre −0,2 IL ;
// - vue de dessus (NET-01, NET-06), en AF-C, zone automatique et détection des yeux : la carte montre des sujets
//   dans la zone nette ; l'appareil reculé de 4 m en touchant la carte mesure de 3,5 à 4,5 m de plus, et « Retour
//   au départ » le ramène, à 0,3 m près ;
// - avec --photo : la photo se calcule et n'est pas noire, sa légende commence par le mode et les réglages
//   (« M · f/8 · 1/4000 s · ISO 6400 · 50 mm »), le bulletin qui la suit donne l'exposition et la zone nette, et la
//   loupe de l'écran de revue fonctionne ; après « Photo entière », une seconde loupe sur la même photo montre le
//   point touché (COD-14, version 0.3.62) ; une loupe suivie de « Revenir au viseur » pendant son calcul, écran de
//   revue défilé en bas et bouton cliqué en son centre, est jetée, l'écran de revue reste fermé (COD-08 ; B1 de la
//   relecture du Sujet 11) ; une photo en échec (canvas.toBlob mis en échec par la routine) après une bonne photo est
//   dite sans l'image, « Touche la photo… » ni « Enregistrer la photo » d'avant (B10 de la relecture de la version
//   0.3.70 ; version 0.3.71 pour les deux) ;
// - avec --photo, histogrammes et hautes lumières de l'écran de revue (MES-06, MES-07, version 0.3.57) : par défaut,
//   ni histogramme ni clignotement ; « Infos » une fois : quatre histogrammes (luminance, rouge, vert, bleu), la
//   somme des colonnes de chacun égale au nombre de pixels de la photo (le calcul des histogrammes est aussi essayé
//   sans navigateur, par app/tests/histogram.test.ts, version 0.3.86 : la routine lit les colonnes que l'écran de revue
//   a reçues), et la phrase des zones écrêtées visible en son centre, pas sous la barre collée en bas de l'écran de revue
//   (version 0.4.10) ; photo surexposée de 3,2 IL : elle s'ouvre en
//   haut de l'écran de revue, sans défilement gardé de la photo d'avant (INT-17, version 0.3.59), part écrêtée
//   supérieure à 0 dans le texte, puis « Infos » encore une fois : zones écrêtées posées sur la photo, sans prendre
//   les touchers, et la phrase visible ; avec « réduire les animations », émulé, le calque des zones n'a aucune animation et le texte dit
//   « sans clignoter » ; réglage rendu, il clignote de nouveau (version 0.3.62) ; photo sous-exposée de 3,2 IL :
//   aucune zone, plus de la moitié des pixels de luminance dans la moitié gauche ; retour à « photo seule » et aux
//   réglages de départ ;
// - avec --photo, défis, en AF-C, zone automatique et détection des yeux : à f/8, le défi SIT-05 (photo de groupe)
//   est réussi ; à f/22, le défi SIT-01 est à reprendre, le fond restant net, et le bulletin renvoie à NET-01 ;
// - avec --photo, rafale (BOI-12) : en Continu L à 5 vues par seconde, déclencheur tenu jusqu'à deux vues au
//   moins, espacées de 0,2 s sur l'horloge de la scène, que l'écran de revue fait défiler ;
// - mise au point (MAP-04, MAP-05, MAP-09) : AF-S et point sélectif par défaut, comme le Z 6, lus juste après le
//   chargement, avant tout réglage de la mise au point (constat INT-05 de l'audit, version 0.3.64) ; en fin de
//   test, parce que la vue change : retour à AF-S et point sélectif par la fenêtre « Mise au point » ; en zone
//   automatique, un œil est détecté dans le groupe ; détection coupée, l'appareil prend le
//   sujet le plus proche ; en détection des animaux, l'œil du chien est détecté quand il passe (au plus 30 s), puis,
//   l'appareil tourné vers la partie de sa course qu'aucun personnage ne cache, il n'est pas lâché à découvert
//   (FMA-23, version 0.3.66 ; une perte tolérée en 60 s) ;
//   en AF-S, toucher le bas du cadre verrouille la distance ; au même endroit, la zone large (L)
//   retient un sujet plus proche (le sol en bas du cadre) ; la distance ne bouge plus quand on relève
//   l'appareil (et, avec --photo, la photo la garde) ; repassé en AF-C, la distance suit la zone ;
// - avec --photo, pendant le calcul de cette photo, pointeur enfoncé et déplacé sur le viseur, bouton tenu jusqu'après
//   l'ouverture de l'écran de revue : l'orientation de l'appareil, lue sur la vue de dessus, n'a pas changé à la
//   reprise (COD-01, version 0.3.63) ; après la rafale, un glissé de 120 px sur le viseur tourne de nouveau
//   l'appareil, de plus de 0,01 rad : ses commandes sont rattachées après le calcul (relecture de la version 0.3.63) ;
// - collimateurs (MAP-06), en AF-C et point sélectif : un toucher en haut à droite du cadre (à 99 % de sa largeur et
//   1 % de sa hauteur) ramène le point dans la zone couverte par l'autofocus, au plus près du point touché, et cette
//   zone mesure 90 % × 90 % du cadre avec le Nikon Z 6 et avec le Sony A6000 (celle du Z 6, faute de pourcentage
//   sourcé), 90 % × 100 % avec le Canon EOS R50, grand et petit côtés échangés en cadre vertical ; avec l'EOS R50,
//   elle passe à 100 % × 100 % en zone automatique, où un toucher en haut à droite reste où il est touché, et revient
//   à 90 % × 100 % en point sélectif, le point ramené dedans (version 0.3.80) ;
// - en fin de profil (constat INT-06 de l'audit, version 0.3.64) : aucun problème affiché à la fin du parcours, la
//   ligne de diagnostic étant relue avant le rechargement du simulateur pour le défi SIT-06, qui l'efface, et après
//   lui ; et aucune erreur de la page ni de la console sur toutes les pages ouvertes par le profil (aucune n'est
//   admise), contrôle compté aussi quand le simulateur ne se charge pas ou que la routine s'arrête sur une exception.

"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");

let playwright;
try {
  playwright = require("playwright");
} catch {
  // Version à installer : celle de la CI, lue dans son workflow, qui est aussi celle de la machine de Claude (constat
  // CHX-08 de l'audit, version 0.3.64). Node.js ne cherche pas seul les modules installés par « npm install -g » :
  // la CI donne le dossier de Playwright par NODE_PATH. La ligne est lue sous ses trois écritures YAML (guillemets
  // doubles, simples, ou aucun) ; si elle ne l'est pas (workflow absent, routine copiée hors du dépôt, autre
  // écriture), le message le dit, sans commande : « npm install -g playwright@X.Y.Z » échoue, npm lisant « X.Y.Z »
  // comme une étiquette (relecture de la version 0.3.64).
  const workflow = path.join(__dirname, "..", ".github", "workflows", "routine.yml");
  const line = /^\s*PLAYWRIGHT_VERSION:[ \t]*(["']?)(\d+\.\d+\.\d+)\1[ \t]*(#.*)?\r?$/m;
  const version = fs.existsSync(workflow) ? line.exec(fs.readFileSync(workflow, "utf8"))?.[2] : undefined;
  console.error(
    version
      ? `Playwright est introuvable. Installe la version ${version}, celle de la CI (PLAYWRIGHT_VERSION dans ` +
          ".github/workflows/routine.yml), avec son Chromium, puis donne son dossier à Node.js par NODE_PATH :\n" +
          `  npm install -g playwright@${version} && playwright install chromium\n` +
          '  NODE_PATH="$(npm root -g)" node scripts/test_app.cjs\n' +
          "La CI ajoute --with-deps à « playwright install », qui installe aussi les bibliothèques du système " +
          "dont le navigateur a besoin."
      : "Playwright est introuvable, et sa version n'a pas pu être lue dans .github/workflows/routine.yml " +
          "(PLAYWRIGHT_VERSION : fichier absent, ou ligne écrite autrement). Installe la version écrite dans ce " +
          "fichier du dépôt, celle de la CI, avec son Chromium, puis donne son dossier à Node.js par NODE_PATH.",
  );
  process.exit(2);
}
const { chromium, devices } = playwright;

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const dist = path.resolve(option("--dist", path.join(__dirname, "..", "app", "dist")));
const profileNames = option("--profils", "ordinateur,android,iphone,webgl1").split(",");
const withPhoto = args.includes("--photo");
const outDir = option("--sorties", null);
if (outDir) fs.mkdirSync(outDir, { recursive: true });

const PROFILES = {
  ordinateur: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  android: { ...devices["Pixel 7"] },
  iphone: { ...devices["iPhone 14"] },
  // Ordinateur sans WebGL 2, comme certains appareils anciens.
  webgl1: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, noWebgl2: true },
};

// Erreurs admises par le contrôle « aucune erreur de la page ni de la console » (INT-06 de l'audit, version 0.3.64) :
// des expressions régulières, essayées sur le texte relevé (« page : … » ou « console : … »). La liste est partie de
// zéro. Une erreur n'y entre qu'avec sa cause établie, sans rapport avec un défaut, sa raison écrite ici et le choix
// noté dans docs/propositions.md.
//
// - « échec injecté par la routine » : erreur levée par la routine elle-même, dans canvas.toBlob, pour le contrôle
//   « photo en échec après une bonne photo » (version 0.3.71) ; le simulateur la journalise comme toute erreur du
//   calcul qui n'est pas un refus (app/src/ui/shutter.ts, report). Choix noté dans docs/propositions.md, section 5,
//   « Écran de revue, loupe et retardateur (Sujet 11) ».
const ADMITTED_ERRORS = [/échec injecté par la routine/];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".gltf": "model/gltf+json", ".bin": "application/octet-stream", ".hdr": "application/octet-stream", ".txt": "text/plain", ".md": "text/markdown" };

function serve(root) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(root, url);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/** Écart type de la différence entre deux captures, ÷ √2, sur le haut du cadre (fond immobile), par canal. */
async function frameNoise(page) {
  return page.evaluate(async () => {
    const canvas = document.getElementById("scene");
    const grab = () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        const copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        const g = copy.getContext("2d");
        g.drawImage(canvas, 0, 0);
        resolve(g.getImageData(0, 0, copy.width, Math.floor(copy.height / 4)).data);
      })));
    const a = await grab();
    await new Promise((r) => setTimeout(r, 300));
    const b = await grab();
    const sums = [0, 0, 0];
    const squares = [0, 0, 0];
    let n = 0;
    for (let i = 0; i < a.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const d = a[i + c] - b[i + c];
        sums[c] += d;
        squares[c] += d * d;
      }
      n++;
    }
    return sums.map((s, c) => Math.sqrt(Math.max(0, squares[c] / n - (s / n) ** 2)) / Math.SQRT2);
  });
}

/**
 * Bruit de la loupe du viseur (constat PHY-07 de l'audit, version 0.3.78), par canal : écart type de la différence entre
 * deux captures, ÷ √2, sur une zone du cadre (de 20 à 80 % de sa largeur et de sa hauteur ; l'appelant centre la loupe
 * sur un point du fond immobile), par pixel calculé et par pixel CSS. Le bruit par pixel CSS est celui de la moyenne
 * des densité × densité pixels calculés d'un pixel CSS, en blocs alignés sur la grille des tirages du shader, dont
 * l'origine est en bas à gauche du canevas (gl_FragCoord). Tiré par pixel CSS, le bruit est le même pour les pixels
 * calculés d'un bloc : les deux mesures se valent. Tiré par pixel calculé, à densité 2, le bruit par pixel CSS vaut la
 * moitié du bruit par pixel calculé. Trois paires de captures, variances moyennées. La mesure par pixel CSS ne vaut
 * qu'à une densité entière (integer) : à 1,5, les cellules du shader ont 1 ou 2 pixels calculés de côté, et des blocs
 * de 2 × 2 ne les suivent pas (relecture de la version 0.3.78).
 */
async function loupeNoise(page) {
  return page.evaluate(async () => {
    const canvas = document.getElementById("scene");
    const box = canvas.getBoundingClientRect();
    const frame = document.getElementById("frame").getBoundingClientRect();
    const sx = canvas.width / box.width;
    const sy = canvas.height / box.height;
    const d = Math.max(1, Math.round(sx));
    // x0 multiple de d ; y0 tel que les d lignes d'un bloc (de haut en bas) soient celles d'une cellule du shader :
    // la ligne i a pour ligne du shader H − 1 − i, et une cellule groupe les lignes du shader d·m à d·m + d − 1.
    let x0 = Math.round((frame.left - box.left + 0.2 * frame.width) * sx);
    let y0 = Math.round((frame.top - box.top + 0.2 * frame.height) * sy);
    x0 -= x0 % d;
    while ((canvas.height - 1 - y0) % d !== d - 1) y0++;
    let w = Math.round(0.6 * frame.width * sx);
    let h = Math.round(0.6 * frame.height * sy);
    w -= w % d;
    h -= h % d;
    const grab = () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        const copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        const g = copy.getContext("2d");
        g.drawImage(canvas, 0, 0);
        resolve(g.getImageData(x0, y0, w, h).data);
      })));
    const px = [0, 0, 0];
    const css = [0, 0, 0];
    const PAIRS = 3;
    for (let p = 0; p < PAIRS; p++) {
      const a = await grab();
      await new Promise((r) => setTimeout(r, 300));
      const b = await grab();
      for (let c = 0; c < 3; c++) {
        let s = 0, s2 = 0, n = 0, bs = 0, bs2 = 0, nb = 0;
        for (let by = 0; by < h; by += d) {
          for (let bx = 0; bx < w; bx += d) {
            let block = 0;
            for (let yy = 0; yy < d; yy++) {
              for (let xx = 0; xx < d; xx++) {
                const i = ((by + yy) * w + bx + xx) * 4 + c;
                const diff = (a[i] - b[i]) / Math.SQRT2;
                s += diff;
                s2 += diff * diff;
                n++;
                block += diff;
              }
            }
            block /= d * d;
            bs += block;
            bs2 += block * block;
            nb++;
          }
        }
        px[c] += Math.max(0, s2 / n - (s / n) ** 2) / PAIRS;
        css[c] += Math.max(0, bs2 / nb - (bs / nb) ** 2) / PAIRS;
      }
    }
    const integer = Math.abs(sx - d) < 0.01 && Math.abs(sy - d) < 0.01;
    return { density: d, integer, px: px.map(Math.sqrt), css: css.map(Math.sqrt), zone: `${w}×${h}` };
  });
}

/**
 * Netteté d'une zone du cadre : moyenne de la valeur absolue du laplacien, en niveaux de gris. Zone en haut à
 * gauche du cadre (de 15 à 35 % de sa largeur, de 2 à 20 % de sa hauteur). Au 135 mm, appareil au point de
 * départ, cette zone ne montre pas que le fond (mesuré le 15 novembre 2026 sur le profil ordinateur, fenêtre de
 * 1280 × 800) : la tête de Sophia, qui bouge, y entre par la droite pendant une partie de son animation, et le
 * promeneur la traverse. L'appelant déplace donc l'appareil là où la zone ne montre que le fond (contrôle
 * « profondeur de champ du viseur »).
 */
async function sharpness(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        const canvas = document.getElementById("scene");
        const frame = document.getElementById("frame").getBoundingClientRect();
        const box = canvas.getBoundingClientRect();
        const sx = canvas.width / box.width;
        const sy = canvas.height / box.height;
        const x0 = Math.round((frame.left - box.left + 0.15 * frame.width) * sx);
        const y0 = Math.round((frame.top - box.top + 0.02 * frame.height) * sy);
        const w = Math.round(0.2 * frame.width * sx);
        const h = Math.round(0.18 * frame.height * sy);
        const copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        const g = copy.getContext("2d");
        g.drawImage(canvas, 0, 0);
        const d = g.getImageData(x0, y0, w, h).data;
        const grey = (x, y) => { const i = (y * w + x) * 4; return (d[i] + d[i + 1] + d[i + 2]) / 3; };
        let sum = 0;
        let n = 0;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            sum += Math.abs(4 * grey(x, y) - grey(x - 1, y) - grey(x + 1, y) - grey(x, y - 1) - grey(x, y + 1));
            n++;
          }
        }
        resolve(sum / n);
      }))),
  );
}

/**
 * Diamètre du flou d'une zone d'une photo, en pixels de la photo (Sujet 39, version 0.4.8 ; constat PHY-21 de l'audit) :
 * celui du disque uniforme qui, appliqué à une photo de référence de la même vue, approche le mieux la photo floue sur
 * la zone, au sens des moindres carrés, avec un gain et un décalage libres ; méthode de la contre-vérification du
 * constat, qui ajustait un disque sur une photo de référence à f/22. Chaque région est la zone et une marge de `margin`
 * pixels de chaque côté, en lumière linéaire : moyenne des trois couches, chacune à la puissance 2,2, la photo étant
 * écrite à la puissance 1/2,2 (app/src/camera/photo.ts). Le disque est appliqué ligne par ligne : demi-largeur
 * √(r² − dy²), le dernier pixel de chaque côté compté pour sa part. Diamètres essayés : de 2 à 2 × margin, de 2 en 2,
 * puis au demi-pixel près autour du meilleur, et sommet de la parabole des trois meilleurs.
 */
function blurDiameter(reference, photo, margin) {
  const width = reference.width;
  const height = reference.height;
  const zoneWidth = width - 2 * margin;
  const zoneHeight = height - 2 * margin;
  const prefix = new Float64Array(height * (width + 1));
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      sum += reference.luma[y * width + x];
      prefix[y * (width + 1) + x + 1] = sum;
    }
  }
  const row = (y, from, to) => prefix[y * (width + 1) + to + 1] - prefix[y * (width + 1) + from];
  const error = (diameter) => {
    const r = diameter / 2;
    const lines = [];
    let weight = 0;
    for (let dy = -Math.floor(r); dy <= Math.floor(r); dy++) {
      const half = Math.sqrt(r * r - dy * dy);
      const full = Math.floor(half);
      lines.push({ dy, full, part: half - full });
      weight += 2 * full + 1 + 2 * (half - full);
    }
    let n = 0;
    let sb = 0;
    let st = 0;
    let sbb = 0;
    let sbt = 0;
    let stt = 0;
    for (let y = margin; y < margin + zoneHeight; y++) {
      for (let x = margin; x < margin + zoneWidth; x++) {
        let b = 0;
        for (const { dy, full, part } of lines) {
          const yy = y + dy;
          b += row(yy, x - full, x + full) + part * (reference.luma[yy * width + x - full - 1] + reference.luma[yy * width + x + full + 1]);
        }
        b /= weight;
        const t = photo.luma[y * width + x];
        n++;
        sb += b;
        st += t;
        sbb += b * b;
        sbt += b * t;
        stt += t * t;
      }
    }
    // Moindres carrés de t ≈ gain × b + décalage : résidu = variance de t − covariance² / variance de b.
    const vb = sbb / n - (sb / n) ** 2;
    const vt = stt / n - (st / n) ** 2;
    const cbt = sbt / n - (sb / n) * (st / n);
    return vt - (cbt * cbt) / vb;
  };
  let best = 2;
  let bestError = Infinity;
  for (let d = 2; d <= 2 * margin; d += 2) {
    const e = error(d);
    if (e < bestError) {
      bestError = e;
      best = d;
    }
  }
  const tried = [];
  for (let d = Math.max(1, best - 2); d <= Math.min(2 * margin, best + 2); d += 0.5) tried.push([d, error(d)]);
  tried.sort((a, b) => a[1] - b[1]);
  const [[d0, e0]] = tried;
  const left = tried.find(([d]) => Math.abs(d - (d0 - 0.5)) < 1e-9);
  const right = tried.find(([d]) => Math.abs(d - (d0 + 0.5)) < 1e-9);
  if (!left || !right) return d0;
  const curvature = left[1] - 2 * e0 + right[1];
  return curvature > 0 ? d0 + (0.25 * (left[1] - right[1])) / curvature : d0;
}

/**
 * Liens internes des pages HTML du site construit : fichier visé présent, ancre portée par un seul élément de la
 * page visée (un identifiant en double fait viser le premier, peut-être masqué : INT-01, Sujet 13).
 */
function checkLinks(root) {
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) pages.push(full);
    }
  };
  walk(root);
  const broken = [];
  let links = 0;
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|data:)/.test(target) || target.startsWith("/src/")) continue;
      links++;
      const [pathAndQuery, anchor] = target.split("#");
      const rel = pathAndQuery.split("?")[0];
      let dest = rel === "" ? file : path.resolve(path.dirname(file), rel);
      if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) dest = path.join(dest, "index.html");
      const where = `${path.relative(root, file)} → ${target}`;
      if (!fs.existsSync(dest)) broken.push(where);
      else if (anchor) {
        const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const count = (fs.readFileSync(dest, "utf8").match(new RegExp(`\\sid="${escaped}"`, "g")) ?? []).length;
        if (count !== 1) broken.push(`${where} (ancre ${count === 0 ? "absente" : `portée par ${count} éléments`})`);
      }
    }
  }
  return [{
    label: "liens internes des pages",
    ok: broken.length === 0 && links > 0,
    detail: broken.length ? `${broken.length} cassé(s) : ${broken.slice(0, 5).join(" ; ")}` : `${pages.length} pages, ${links} liens`,
  }];
}

/** Fiche relue dans data/relecture.yaml (même forme de ligne que app/scripts/build-pages.mjs). */
function isReviewed(id) {
  const text = fs.readFileSync(path.join(__dirname, "..", "data", "relecture.yaml"), "utf8");
  return new RegExp(`^  - \\{fiche: ${id}, date: `, "m").test(text);
}

/** Accueil et fiche, avant le simulateur. */
async function checkPages(page, base, name, check) {
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  // Lecture de l'accueil : langue de la page, fiches listées, premier titre de porte, restes d'un choix de langue.
  const readHome = () =>
    page.evaluate(() => ({
      lang: document.documentElement.lang,
      items: document.querySelectorAll("main li a[href^='fiches/']").length,
      door: document.querySelector("main h2")?.textContent ?? "",
      switches: document.querySelectorAll(".lang-switch, [data-lang-block], [data-lang], [hreflang]").length,
    }));
  await page.goto(`${base}/`);
  const home = await readHome();
  const homeOverflow = await overflow();
  check(
    "accueil en français, sans bouton de langue",
    home.lang === "fr" && home.items > 0 && home.door === "Je suis en situation" && home.switches === 0 && homeOverflow <= 0,
    `langue ${home.lang}, ${home.items} fiches listées, « ${home.door} », ${home.switches} élément(s) de choix de langue, débordement ${homeOverflow} px`,
  );
  // Le paramètre ?lang= est retiré (version 0.3.60) : une adresse qui le porte encore ouvre l'accueil en français.
  await page.goto(`${base}/?lang=en`);
  const homeEn = await readHome();
  check(
    "accueil ouvert avec ?lang=en : en français",
    homeEn.lang === "fr" && homeEn.items === home.items && homeEn.door === "Je suis en situation",
    `langue ${homeEn.lang}, ${homeEn.items} fiches listées, « ${homeEn.door} »`,
  );
  // Bouton « Télécharger les ressources du simulateur » (version 0.3.51) : barre à 100 %, bilan sans échec.
  await page.click("[data-prefetch]");
  const prefetch = await page
    .waitForFunction(() => /Téléchargé|échec/.test(document.querySelector(".prefetch-status")?.textContent ?? ""), null, { timeout: 120000 })
    .then(() =>
      page.evaluate(() => {
        const block = document.querySelector("main");
        return { text: block.querySelector(".prefetch-status").textContent, value: block.querySelector(".prefetch progress").value, errors: block.querySelectorAll(".prefetch-errors li").length };
      }),
    )
    .catch(() => ({ text: "", value: 0, errors: -1 }));
  check(
    "accueil : téléchargement des ressources du simulateur",
    /^Téléchargé : \d+,\d Mio en .*, débit moyen \d+,\d Mbit\/s\./.test(prefetch.text) && prefetch.value === 100 && prefetch.errors === 0,
    `${prefetch.text.slice(0, 90)} ; barre ${Math.round(prefetch.value)} % ; ${prefetch.errors} échec(s)`,
  );
  if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-accueil.png`), fullPage: true });
  await page.goto(`${base}/fiches/NET-01.html`);
  const fiche = await page.evaluate(() => ({
    title: document.querySelector("h1")?.textContent ?? "",
    banner: document.querySelectorAll(".banner").length,
    sections: [...document.querySelectorAll("h2")].map((h) => h.textContent).join(", "),
    simulator: document.querySelector(".actions a")?.getAttribute("href") ?? "",
  }));
  const ficheOverflow = await overflow();
  const banner = isReviewed("NET-01") ? 0 : 1;
  check(
    "fiche NET-01 en français",
    fiche.title.startsWith("NET-01") && fiche.banner === banner && fiche.simulator === "../simulateur/" && ficheOverflow <= 0,
    `${fiche.title} ; bandeau de relecture : ${fiche.banner ? "oui" : "non"} ; sections : ${fiche.sections} ; débordement ${ficheOverflow} px`,
  );
  if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-fiche.png`), fullPage: true });
  await page.goto(`${base}/fiches/SIT-05.html`);
  const play = await page.evaluate(() => {
    const a = document.querySelector(".actions a");
    return { text: a?.textContent ?? "", href: a?.getAttribute("href") ?? "" };
  });
  check("fiche SIT-05 : bouton « Jouer le défi »", play.text === "Jouer le défi" && play.href === "../simulateur/?defi=SIT-05", `« ${play.text} » → ${play.href}`);
  // Activité LUM-02 (version 0.3.50).
  await page.goto(`${base}/fiches/LUM-02.html`);
  const toActivity = await page.evaluate(() => document.querySelector(".actions a")?.getAttribute("href") ?? "");
  await page.goto(`${base}/activites/LUM-02/`);
  await page.click('[data-preset="window"]');
  const penumbra = await page.evaluate(() => document.getElementById("act-penumbra").textContent);
  await page.click('[data-question="0"][data-answer="0"]');
  const feedback = await page.evaluate(() => document.querySelector(".act-feedback")?.className ?? "");
  const activityOverflow = await overflow();
  check(
    "activité LUM-02 : pénombre et question",
    toActivity === "../activites/LUM-02/" && /30,0 cm/.test(penumbra) && /passed/.test(feedback) && activityOverflow <= 0,
    `fiche → ${toActivity} ; ${penumbra} ; réponse : ${feedback} ; débordement ${activityOverflow} px`,
  );
  // Pénombre hors du mur dessiné et légende sans ombre pleine (FMA-10) ; noms dans le dessin (INT-02).
  const beyond = await page.evaluate(() => {
    const size = document.getElementById("act-size");
    const distance = document.getElementById("act-distance");
    size.value = "150";
    distance.value = "20";
    size.dispatchEvent(new Event("input"));
    const boxes = [...document.querySelectorAll(".act-label")].map((node) => ({ text: node.textContent, box: node.getBoundingClientRect() }));
    const overlap = boxes.some((a, i) => boxes.slice(i + 1).some((b) => a.box.left < b.box.right && b.box.left < a.box.right && a.box.top < b.box.bottom && b.box.top < a.box.bottom));
    return {
      penumbra: document.getElementById("act-penumbra").textContent,
      legend: document.getElementById("act-legend").textContent,
      labels: boxes.map((b) => b.text).join(", "),
      overlap,
    };
  });
  check(
    "activité LUM-02 : pénombre hors du mur, légende, noms du dessin",
    /480,0 cm/.test(beyond.penumbra) && /au-delà du mur dessiné/.test(beyond.penumbra) && !/ombre pleine au centre/.test(beyond.legend) && beyond.labels === "source, objet, mur" && !beyond.overlap,
    `${beyond.penumbra} ; ${beyond.legend} ; noms : ${beyond.labels}${beyond.overlap ? " (chevauchés)" : ""}`,
  );
  if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-activite-LUM-02.png`), fullPage: true });
}

/**
 * Simulateur sans WebGL (constat COD-11 de l'audit, version 0.3.70), dans un contexte à part, aux dimensions du
 * profil : le message doit être lisible, pas seulement présent.
 */
async function checkNoWebgl(browser, contextOptions, base, check) {
  const context = await browser.newContext(contextOptions);
  try {
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, attributes) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
        return original.call(this, type, attributes);
      };
    });
    const page = await context.newPage();
    // Erreurs de ce contexte, relevées à part du contexte principal (relecture du Sujet 10).
    const errors = [];
    page.on("pageerror", (error) => errors.push(`page : ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console : ${message.text()}`);
    });
    await page.goto(`${base}/simulateur/`);
    await page.waitForFunction(() => !document.getElementById("no-webgl").hidden, null, { timeout: 30000 });
    const r = await page.evaluate(() => {
      const message = document.getElementById("no-webgl");
      const canvas = document.getElementById("scene");
      const box = message.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const shown = [...document.querySelector("main").children]
        .filter((e) => e !== message && getComputedStyle(e).display !== "none")
        .map((e) => e.id || e.className);
      return {
        text: message.textContent,
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        height: innerHeight,
        hit: hit !== null && message.contains(hit),
        shown,
        canvas: getComputedStyle(canvas).display,
        challenges: getComputedStyle(document.getElementById("challenge-button")).display,
      };
    });
    check(
      "sans WebGL : message lisible, rectangle de la scène masqué",
      /WebGL indisponible/.test(r.text) &&
        /Version du site\u00a0: \d+\.\d+\.\d+\.$/.test(r.text) &&
        r.top >= 0 &&
        r.bottom <= r.height &&
        r.hit &&
        r.shown.length === 0 &&
        r.canvas === "none" &&
        r.challenges === "none" &&
        errors.length === 0,
      `« ${r.text} » ; de ${r.top} à ${r.bottom} px sur ${r.height} ; rendu en son centre : ${r.hit ? "oui" : "non"} ; autres éléments affichés : ${r.shown.join(", ") || "aucun"} ; canevas : ${r.canvas} ; bouton « Défis » : ${r.challenges} ; erreurs : ${errors.join(" | ") || "aucune"}`,
    );
  } finally {
    await context.close();
  }
}

/**
 * Démarrage arrêté (version 0.4.4, demande de Julien du 22 novembre 2026), dans cinq contextes à part, aux dimensions
 * du profil (WebGL 1 sur le profil webgl1). Dans les trois premiers, la page perd le contexte WebGL du canevas de la
 * scène et fait rendre null aux fonctions de création de WebGL (createBuffer, createTexture…) tant qu'il est perdu,
 * comme le code de WebKit des branches safari-7618 à safari-7624 (Chromium rend un objet marqué perdu, comme la branche
 * safari-7625 et le brouillon de la spécification de WebGL) : c'est le scénario qui reproduit l'écran de l'iPhone de la
 * capture envoyée par Julien (docs/pile-technique.md, « Contexte perdu au démarrage »). Perdu dès la création : avant
 * que getContext rende le contexte ; puis restauré : même cas, puis la page restaure le contexte (restoreContext),
 * comme WebKit essaie de le faire quand l'événement de la perte a été annulé, ce que fait Babylon.js, et le contrôle
 * exige l'événement webglcontextrestored ; perdu au premier createBuffer : la création du premier tampon perd le
 * contexte et rend null, comme quand le processeur graphique ne crée pas le tampon. Quatrième contexte : une exception
 * sans perte du contexte, le constructeur de ResizeObserver levant une erreur injectée. Cinquième contexte (version
 * 0.4.15, demande de Julien du 23 novembre 2026 : sur l'iPhone de la capture, le contexte se perdait aussi pendant le
 * chargement, puis Babylon.js levait « Unable to create texture ») : la page perd le contexte au premier envoi d'une
 * image (texImage2D dont la source n'est pas un tableau d'octets), après son chargement, donc pendant le chargement de
 * la scène et après la fin de startSimulator ; mêmes fonctions de création rendant null ; affichage de diagnostic
 * ouvert ; puis la page restaure le contexte, comme dans le deuxième cas. Dans chaque cas : le message du démarrage
 * arrêté (celui du contexte perdu dès l'ouverture dans les trois premiers, le message général dans le quatrième, celui
 * du contexte perdu pendant le chargement dans le cinquième, suivi de la progression du chargement figée à l'arrêt,
 * « Chargement à ce moment : … »), avec la version du site et « Recharger », lisible (dans
 * la fenêtre, rendu en son centre, comme le bouton) et inchangé 2 s plus tard (restauration comprise) ; aucun message
 * des capacités de rendu en flottants ; le canevas, le panneau du boîtier et le bouton « Défis » masqués ; la ligne
 * des problèmes vide, ou qui donne l'exception rattrapée (premier createBuffer, exception injectée) ; aucune erreur non
 * rattrapée de la page. Pendant le chargement, le chargement continue après l'arrêt et ses textures ne peuvent pas être
 * créées tant que le contexte est perdu : la ligne des problèmes peut donner, et changer pour donner, les exceptions
 * « Unable to create … » de Babylon.js, seules erreurs non rattrapées admises ; l'affichage de diagnostic reste
 * affiché, sous la ligne des problèmes, et sa ligne des textures garde le relevé d'avant la perte (« Textures relevées
 * avant la perte du contexte WebGL »), même le contexte restauré. Passé 60 s de chargement, la progression figée
 * nomme aussi les fichiers en attente. main.ts écrit aussi l'exception rattrapée dans la console : la console n'est
 * pas contrôlée.
 */
async function checkLostAtStart(browser, contextOptions, base, check, webgl1) {
  const cases = [
    { mode: "creation", label: "contexte WebGL perdu dès la création" },
    { mode: "restore", label: "contexte WebGL perdu dès la création, puis restauré" },
    { mode: "buffer", label: "contexte WebGL perdu au premier createBuffer" },
    { mode: "exception", label: "exception sans perte du contexte (ResizeObserver)" },
    { mode: "loading", label: "contexte WebGL perdu pendant le chargement de la scène, puis restauré" },
  ];
  for (const { mode, label } of cases) {
    const context = await browser.newContext(contextOptions);
    try {
      await context.addInitScript(
        ({ webgl1, mode }) => {
          if (mode === "exception") {
            window.ResizeObserver = class {
              constructor() {
                throw new Error("échec injecté par la routine (ResizeObserver)");
              }
            };
          }
          const original = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, attributes) {
            if (webgl1 && type === "webgl2") return null;
            const gl = original.call(this, type, attributes);
            if (mode === "exception" || !gl || this.id !== "scene" || !["webgl", "webgl2", "experimental-webgl"].includes(type)) return gl;
            const lose = gl.getExtension("WEBGL_lose_context");
            window.__routineLoseContext = lose;
            this.addEventListener("webglcontextrestored", () => {
              window.__routineRestored = true;
            });
            for (const name of ["createBuffer", "createTexture", "createFramebuffer", "createRenderbuffer", "createProgram", "createShader", "createVertexArray", "createQuery"]) {
              if (typeof gl[name] !== "function") continue;
              const create = gl[name].bind(gl);
              gl[name] = (...args) => {
                if (mode === "buffer" && name === "createBuffer" && !gl.isContextLost()) lose.loseContext();
                return gl.isContextLost() ? null : create(...args);
              };
            }
            if (mode === "loading") {
              const upload = gl.texImage2D.bind(gl);
              let lost = false;
              gl.texImage2D = (...args) => {
                const source = args[args.length - 1];
                if (!lost && source !== null && typeof source === "object" && !ArrayBuffer.isView(source)) {
                  lost = true;
                  lose.loseContext();
                }
                return upload(...args);
              };
            }
            if (mode !== "buffer" && mode !== "loading") lose.loseContext();
            return gl;
          };
        },
        { webgl1, mode },
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`page : ${error.message}`));
      await page.goto(`${base}/simulateur/${mode === "loading" ? "?diagnostic" : ""}`);
      const shown = await page
        .waitForFunction(() => document.body.classList.contains("start-failed"), null, { timeout: 60000 })
        .then(() => true)
        .catch(() => false);
      const read = () =>
        page.evaluate(() => {
          const status = document.getElementById("status");
          const box = status.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          const button = status.querySelector("button");
          const b = button?.getBoundingClientRect();
          const line = document.getElementById("diagnostic");
          return {
            text: status.hidden ? "" : status.textContent,
            reload: [...status.querySelectorAll("button")].map((e) => e.textContent).join(", "),
            top: Math.round(box.top),
            bottom: Math.round(box.bottom),
            height: innerHeight,
            hit: hit !== null && status.contains(hit),
            reloadHit: Boolean(b) && document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2) === button && b.bottom <= innerHeight,
            problem: line.hidden ? "" : line.textContent,
            canvas: getComputedStyle(document.getElementById("scene")).display,
            panel: getComputedStyle(document.getElementById("camera-panel")).display,
            challenges: getComputedStyle(document.getElementById("challenge-button")).display,
            diagnosticText: document.querySelector(".diagnostic-view")?.textContent ?? "",
            // Affichage de diagnostic : affiché, et sous la ligne des problèmes (ou sous le message, sans problème).
            diagnosticView: (() => {
              const view = document.querySelector(".diagnostic-view");
              if (!view) return "absent";
              if (getComputedStyle(view).display === "none") return "masqué";
              const above = (line.hidden ? status : line).getBoundingClientRect().bottom;
              return view.getBoundingClientRect().top >= above - 1 ? "affiché, sous la ligne des problèmes" : "affiché, sur la ligne des problèmes";
            })(),
          };
        });
      const first = await read();
      let restored = "";
      if (mode === "restore" || mode === "loading") {
        restored = await page.evaluate(() => {
          const lose = window.__routineLoseContext;
          if (!lose) return "extension absente";
          lose.restoreContext();
          return "restauration demandée";
        });
      }
      await page.waitForTimeout(2000);
      const r = await read();
      // Restauration constatée par l'événement webglcontextrestored, que la page écoute à part de Babylon.js (contrôle
      // final de la version 0.4.4 : sans cela, le cas resterait vert si la restauration n'avait plus lieu).
      if ((mode === "restore" || mode === "loading") && restored === "restauration demandée") {
        const done = await page.evaluate(() => window.__routineRestored === true);
        restored = done ? "contexte restauré" : "restauration demandée, pas constatée";
      }
      const expected =
        mode === "exception"
          ? "Le simulateur n'a pas pu démarrer. Recharge la page."
          : mode === "loading"
            ? "Le simulateur n'a pas pu démarrer\u00a0: le navigateur a perdu l'affichage 3D (contexte WebGL) pendant le chargement de la scène. Recharge la page."
            : "Le simulateur n'a pas pu démarrer\u00a0: le navigateur a perdu l'affichage 3D (contexte WebGL) dès l'ouverture de la page. Recharge la page.";
      // Exceptions de Babylon.js quand une fonction de création rend null (« Unable to create texture », « … vertex
      // buffer », « … VAO », « … webGL texture »…), seules admises pendant le chargement, dans la ligne des problèmes
      // et comme erreurs de la page.
      const creationFailure = /^(Erreur\u00a0: (Uncaught )?Error: Unable to create [A-Za-z ]+ · )+Version du site\u00a0: \d+\.\d+\.\d+$/;
      const problemOk =
        mode === "buffer"
          ? /^Erreur\u00a0: Error: Unable to create vertex buffer · Version du site\u00a0: \d+\.\d+\.\d+$/.test(r.problem)
          : mode === "exception"
            ? /^Erreur\u00a0: Error: échec injecté par la routine \(ResizeObserver\) · Version du site\u00a0: \d+\.\d+\.\d+$/.test(r.problem)
            : mode === "loading"
              ? r.problem === "" || creationFailure.test(r.problem)
              : r.problem === "";
      const unexpected = mode === "loading" ? errors.filter((e) => !/^page : Unable to create [A-Za-z ]+$/.test(e)) : errors;
      check(
        `démarrage arrêté, ${label} (WebGL ${webgl1 ? 1 : 2}) : message lisible avec la version et « Recharger », inchangé 2 s plus tard, sans message des flottants, canevas et panneau du boîtier masqués, ${mode === "loading" ? "affichage de diagnostic sous la ligne des problèmes, textures relevées avant la perte, aucune erreur non rattrapée autre que « Unable to create … »" : "aucune erreur non rattrapée"}`,
        shown &&
          r.text.startsWith(expected) &&
          (mode === "loading"
            ? /Version du site\u00a0: \d+\.\d+\.\d+\. Chargement à ce moment\u00a0: .*\d+ s(\.| · en attente\u00a0: .+[.…]) Recharger$/
            : /Version du site\u00a0: \d+\.\d+\.\d+\. Recharger$/
          ).test(r.text) &&
          r.reload === "Recharger" &&
          r.reloadHit &&
          r.text === first.text &&
          (mode === "loading" || r.problem === first.problem) &&
          r.top >= 0 &&
          r.bottom <= r.height &&
          r.hit &&
          problemOk &&
          r.canvas === "none" &&
          r.panel === "none" &&
          r.challenges === "none" &&
          (mode !== "restore" || restored === "contexte restauré") &&
          (mode !== "loading" ||
            (restored === "contexte restauré" &&
              r.diagnosticView === "affiché, sous la ligne des problèmes" &&
              /^Textures relevées avant la perte du contexte WebGL, une seconde au plus avant elle$/m.test(r.diagnosticText))) &&
          unexpected.length === 0,
        `${shown ? "" : "démarrage non arrêté ; "}${restored ? `${restored} ; ` : ""}« ${r.text} »${r.text === first.text ? "" : ` (2 s avant : « ${first.text} »)`} ; de ${r.top} à ${r.bottom} px sur ${r.height} ; rendu en son centre : ${r.hit ? "oui" : "non"} ; « Recharger » rendu en son centre : ${r.reloadHit ? "oui" : "non"} ; problème : ${r.problem || "aucun"}${r.problem === first.problem ? "" : ` (2 s avant : ${first.problem || "aucun"})`} ; canevas : ${r.canvas} ; panneau : ${r.panel} ; bouton « Défis » : ${r.challenges}${mode === "loading" ? ` ; affichage de diagnostic : ${r.diagnosticView} ; ${(/^Textures.*$/m.exec(r.diagnosticText) ?? ["ligne des textures absente"])[0]}${/^Textures relevées avant la perte/m.test(r.diagnosticText) ? " ; relevé d'avant la perte" : " ; ligne « Textures relevées avant la perte » absente"}` : ""} ; erreurs : ${errors.join(" | ") || "aucune"}`,
      );
    } finally {
      await context.close();
    }
  }
}

/**
 * Textures allégées (version 0.4.15, demande de Julien du 23 novembre 2026), dans un contexte à part, aux dimensions du
 * profil (WebGL 1 sur le profil webgl1) : le simulateur ouvert avec « ?diagnostic=textures-legeres » charge sa scène,
 * et l'affichage de diagnostic donne la ligne « Textures allégées pour cet essai », des textures qui demandent entre
 * 30 et 150 Mio (environ 105 Mio mesurés, contre environ 294 Mio sans le réglage : la photo de fond et les textures de
 * 2048 px réduites à 1024 px de côté au plus), la limite du processeur graphique, que main.ts abaisse à 1024 px pour
 * le chargement, remise ensuite (la ligne des textures ne dit plus « abaissée » : attendu jusqu'à 120 s), un débit du
 * viseur, aucun problème affiché et aucune erreur de la page ni de la console.
 */
async function checkLightTextures(browser, contextOptions, base, check, webgl1) {
  const context = await browser.newContext(contextOptions);
  try {
    if (webgl1) {
      await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, attributes) {
          return type === "webgl2" ? null : original.call(this, type, attributes);
        };
      });
    }
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(`page : ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console : ${message.text().slice(0, 200)}`);
    });
    await page.goto(`${base}/simulateur/?diagnostic=textures-legeres`);
    const loaded = await page
      .waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 })
      .then(() => true)
      .catch(() => false);
    const view = await page
      .waitForFunction(
        () => {
          const text = document.getElementById("diagnostic-view")?.textContent ?? "";
          return /Images par seconde/.test(text) && !/abaissée/.test(text) ? text : null;
        },
        null,
        { timeout: 120000 },
      )
      .then((handle) => handle.jsonValue())
      .catch(() => "");
    const problem = await page.evaluate(() => {
      const line = document.getElementById("diagnostic");
      return line.hidden ? "" : line.textContent;
    });
    const textures = /^Textures\u00a0: (\d+), environ (\d+) Mio demandés · limite du processeur graphique\u00a0: (\d+) px de côté$/m.exec(view);
    const fps = /^Images par seconde\u00a0: (\d+,\d)$/m.exec(view);
    check(
      `textures allégées (?diagnostic=textures-legeres, WebGL ${webgl1 ? 1 : 2}) : scène chargée, ligne « Textures allégées », de 30 à 150 Mio demandés, limite du processeur graphique remise après le chargement, débit du viseur, aucun problème ni erreur`,
      loaded &&
        Boolean(textures) &&
        Number(textures[1]) >= 20 &&
        Number(textures[2]) >= 30 &&
        Number(textures[2]) <= 150 &&
        Number(textures[3]) > 1024 &&
        /^Textures allégées pour cet essai\u00a0: images réduites à 1024 px de côté au plus pendant le chargement$/m.test(view) &&
        Boolean(fps) &&
        Number(fps[1].replace(",", ".")) > 0 &&
        !problem &&
        errors.length === 0,
      `scène ${loaded ? "chargée" : "non chargée"} ; ${view.replace(/\n/g, " | ") || "affichage absent, ou limite du processeur graphique restée abaissée"} ; problème : ${problem || "aucun"} ; erreurs : ${errors.join(" | ") || "aucune"}`,
    );
  } finally {
    await context.close();
  }
}

/**
 * Affichage de diagnostic et capacités de rendu en flottants (constats ARC-06 et ARC-13 de l'audit, version 0.3.88),
 * dans deux contextes à part, aux dimensions du profil. Témoin, ouvert avec « ?diagnostic=densite-complete » et scène
 * chargée : l'affichage donne la version, WebGL, un débit, les durées, la ligne du processeur graphique, les deux
 * capacités exigées à « oui », la ligne des textures (au moins 20, de 200 à 600 Mio demandés, une limite du processeur
 * graphique d'au moins 1024 px, sans la ligne des textures allégées ; version 0.4.15) et un viseur à la densité de
 * l'écran ; aucun problème affiché, aucune erreur de la page ni de la console. Extension masquée, ouvert avec « ?diagnostic » : le message, avec la mise au point et l'aperçu ; le
 * déclencheur grisé, et, réactivé par la routine, un appui qui ne calcule rien et le regrise ; l'affichage donne les
 * deux capacités à « non » et la densité du viseur plafonnée à 2. Dans ce contexte, Babylon.js et le pilote écrivent
 * des avertissements sur les cibles de rendu incomplètes (« Render to float textures is not supported », « Framebuffer
 * is incomplete ») : la console n'y est pas contrôlée, seules les erreurs de la page le sont. La ligne du processeur
 * graphique est contrôlée dans sa forme (une durée, l'attente d'une mesure, ou « non mesurée » et sa raison), pas dans
 * sa valeur : selon la machine, Chromium expose ou non l'extension de mesure (docs/pile-technique.md, « Affichage de
 * diagnostic »). N'est pas essayée : une photo prise avec l'affichage ouvert.
 */
async function checkFloatRender(browser, contextOptions, base, check, webgl1) {
  const version = webgl1 ? 1 : 2;
  const mask = webgl1 ? ["OES_texture_float", "OES_texture_half_float"] : ["EXT_color_buffer_float"];
  // Densités écrites par l'affichage : deux décimales, virgule (app/src/diagnosticModel.ts, decimal).
  const decimal2 = (value) => value.toFixed(2).replace(".", ",");
  const screen = contextOptions.deviceScaleFactor ?? 1;
  for (const masked of [false, true]) {
    const context = await browser.newContext(contextOptions);
    try {
      await context.addInitScript(
        ({ webgl1, mask }) => {
          const original = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, attributes) {
            if (webgl1 && type === "webgl2") return null;
            const gl = original.call(this, type, attributes);
            if (gl && mask.length > 0 && (type === "webgl" || type === "webgl2" || type === "experimental-webgl")) {
              const getExtension = gl.getExtension.bind(gl);
              gl.getExtension = (extension) => (mask.includes(extension) ? null : getExtension(extension));
              const supported = gl.getSupportedExtensions.bind(gl);
              gl.getSupportedExtensions = () => (supported() ?? []).filter((extension) => !mask.includes(extension));
            }
            return gl;
          };
        },
        { webgl1, mask: masked ? mask : [] },
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`page : ${error.message}`));
      page.on("console", (message) => {
        if (!masked && message.type() === "error") errors.push(`console : ${message.text().slice(0, 200)}`);
      });
      await page.goto(`${base}/simulateur/${masked ? "?diagnostic" : "?diagnostic=densite-complete"}`);
      // Témoin : scène chargée (le message de chargement disparaît), comme dans le contexte principal du profil.
      const loaded = masked
        ? true
        : await page
            .waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 })
            .then(() => true)
            .catch(() => false);
      // L'affichage réécrit ses lignes chaque seconde : le texte est lu dans l'écriture même qui a une ligne du débit
      // (relu à part, il pouvait avoir changé entre-temps ; relecture de la version 0.3.88, constat C6).
      const view = await page
        .waitForFunction(
          () => {
            const text = document.getElementById("diagnostic-view")?.textContent ?? "";
            return /Images par seconde/.test(text) ? text : null;
          },
          null,
          { timeout: 120000 },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => "");
      const problem = await page.evaluate(() => {
        const line = document.getElementById("diagnostic");
        return line.hidden ? "" : line.textContent;
      });
      const lines = view.split("\n");
      const caps = lines.find((line) => line.startsWith("Rendu en flottants")) ?? "";
      const fps = /^Images par seconde\u00a0: (\d+,\d)$/m.exec(view);
      const density = /^Densité\u00a0: écran (\d+,\d\d), viseur (\d+,\d\d) · image de (\d+) × (\d+) px$/m.exec(view);
      const viewfinder = masked ? Math.min(2, screen) : screen;
      const densityOk =
        Boolean(density) && density[1] === decimal2(screen) && density[2] === decimal2(viewfinder) && Number(density[3]) > 0 && Number(density[4]) > 0;
      const densityText = density ? density[0] : "ligne des densités absente";
      // Ligne des textures (version 0.4.15) : la scène chargée en demande environ 294 Mio, d'après l'estimation de
      // l'affichage comme d'après les appels à WebGL relevés à part (docs/pile-technique.md, « Contexte perdu pendant
      // le chargement » et « Affichage de diagnostic ») ; bornes larges, pour une scène dont une texture changerait.
      const textures = /^Textures\u00a0: (\d+), environ (\d+) Mio demandés · limite du processeur graphique\u00a0: (\d+) px de côté$/m.exec(view);
      const texturesOk = Boolean(textures) && Number(textures[1]) >= 20 && Number(textures[2]) >= 200 && Number(textures[2]) <= 600 && Number(textures[3]) >= 1024;
      if (!masked) {
        check(
          `affichage de diagnostic (?diagnostic=densite-complete), témoin, scène chargée : version, WebGL ${version}, débit, durées, capacités exigées à « oui », textures (de 200 à 600 Mio demandés), viseur à la densité de l'écran (${decimal2(screen)}), aucun problème`,
          loaded &&
            /^Diagnostic \(moyennes sur 1 s\) · Version du site\u00a0: \d+\.\d+\.\d+$/.test(lines[0]) &&
            (lines[1] ?? "").startsWith(`WebGL ${version} · `) &&
            Boolean(fps) &&
            Number(fps[1].replace(",", ".")) > 0 &&
            /^Durée d'une image, processeur\u00a0: \d+,\d ms \(textures de rendu\u00a0: \d+,\d ms\)$/m.test(view) &&
            /^Durée d'une image, processeur graphique\u00a0: (\d+,\d ms|en attente d'une mesure|non mesurée \(.+\))$/m.test(view) &&
            caps.includes("textureFloatRender oui, textureHalfFloatRender oui") &&
            densityOk &&
            texturesOk &&
            !/Textures allégées/.test(view) &&
            !problem &&
            errors.length === 0,
          `scène ${loaded ? "chargée" : "non chargée"} ; ${view.replace(/\n/g, " | ") || "affichage absent"} ; problème : ${problem || "aucun"} ; erreurs : ${errors.join(" | ") || "aucune"}`,
        );
        continue;
      }
      // Déclencheur grisé dès le départ ; réactivé par la routine, un appui (clic sans pointeur, comme au clavier) ne
      // lance aucun calcul, n'ouvre pas l'écran de revue et le regrise (ui/shutter.ts, refusedForCapabilities).
      const greyed = await page.evaluate(() => document.getElementById("shutter-button").disabled);
      await page.evaluate(() => {
        const button = document.getElementById("shutter-button");
        button.disabled = false;
        button.click();
      });
      await page.waitForTimeout(1500);
      const after = await page.evaluate(() => ({
        review: !document.getElementById("review").hidden,
        progress: !document.getElementById("progress").hidden,
        greyed: document.getElementById("shutter-button").disabled,
      }));
      check(
        `rendu en flottants absent (${mask.join(" et ")} ${mask.length > 1 ? "masquées" : "masquée"}, WebGL ${version}) : message affiché, déclencheur grisé, appui sans calcul, capacités à « non », densité du viseur plafonnée (${decimal2(Math.min(2, screen))})`,
        Boolean(fps) &&
          problem.startsWith("Photo impossible sur cet appareil\u00a0: ") &&
          problem.includes("textureFloatRender, textureHalfFloatRender\u00a0: non") &&
          problem.includes("le bouton «\u00a0Déclencher\u00a0» est désactivé.") &&
          problem.includes("floute tout le cadre, autant que sa partie la plus floue.") &&
          /Version du site\u00a0: \d+\.\d+\.\d+$/.test(problem) &&
          greyed &&
          !after.review &&
          !after.progress &&
          after.greyed &&
          caps.includes("textureFloatRender non, textureHalfFloatRender non") &&
          densityOk &&
          errors.length === 0,
        `problème : « ${problem} » ; déclencheur ${greyed ? "grisé" : "actif"} au départ ; après l'appui forcé : écran de revue ${after.review ? "ouvert" : "fermé"}, calcul ${after.progress ? "en cours" : "non"}, déclencheur ${after.greyed ? "grisé" : "actif"} ; ${caps || "ligne des capacités absente"} ; ${densityText} ; erreurs : ${errors.join(" | ") || "aucune"}`,
      );
    } finally {
      await context.close();
    }
  }
}

// Mise en page sur téléphone (Sujet 42, version 0.4.10 ; constats INT-04, INT-12, INT-03, INT-11, INT-17, INT-20 et
// INT-14 de l'audit). Un contexte à part, ouvert par le profil iphone : le simulateur chargé téléphone tenu à
// l'horizontale (iPhone 14 émulé, 750 × 340 px), puis la même page à 390 × 664 px (tenu droit), 412 × 839 px (taille du
// Pixel 7 émulé), 600 × 960 px et 320 × 664 px. À chaque taille, des gestes qui changent les textes de l'en-tête et du panneau, puis
// leur retour : le viseur, le cadre et le déclencheur ne doivent pas bouger, aucun libellé ne doit être coupé, les
// pastilles doivent rester dans le viseur et hors du bloc « Vue de dessus ». Puis les fenêtres et l'écran de revue.
// Le chargement à l'horizontale vérifie aussi ce qu'un téléphone tenu ainsi montre au départ ; la page tournée ensuite
// garde la vue de dessus et l'indicateur d'équilibre comme ils étaient, comme un vrai téléphone qu'on tourne.
const LAYOUT_STEPS = [
  ["AF-C", () => document.querySelector('input[name="focusMode"][value="continuous"]').click()],
  ["zone automatique", () => document.querySelector('input[name="areaMode"][value="auto"]').click()],
  ["Continu H (étendu)", () => document.querySelector('input[name="release"][value="chx"]').click()],
  ["retardateur", () => document.querySelector('input[name="release"][value="timer"]').click()],
  ["Canon EOS R50", () => document.querySelector('input[name="brand"][value="canon"]').click()],
  [
    "mode A avec une correction",
    () => {
      document.querySelector('input[name="exposureMode"][value="A"]').click();
      const select = document.querySelector('select[name="compensation"]');
      select.value = [...select.options].find((o) => /−/.test(o.textContent)).value;
      select.dispatchEvent(new Event("change"));
    },
  ],
  ["défi SIT-05", () => document.querySelector('input[name="challenge"][value="SIT-05"]').click()],
  // Libellés du déclencheur pendant une rafale et un compte à rebours, posés à la main : au plus 20 vues par rafale
  // (MAX_BURST, ui/shutter.ts) et 20 s de retardateur (TIMER_DELAYS, camera/settings.ts).
  ["libellé d'une rafale", () => (document.getElementById("shutter-button").textContent = "Rafale\u00a0: 20 vues")],
  ["libellé d'un compte à rebours", () => (document.getElementById("shutter-button").textContent = "Retardateur\u00a0: 20 s")],
  [
    "aperçu coupé",
    () => {
      document.getElementById("shutter-button").textContent = "Déclencher";
      const all = document.querySelector('#preview-dialog input[value="all"]');
      if (all.checked) all.click();
    },
  ],
  // La loupe passe à 100 % (« Loupe 100 % ») ; le bouton parcourt 50 %, 100 %, puis rien.
  [
    "loupe à 100 %",
    () => {
      const loupe = document.getElementById("loupe-button");
      for (let i = 0; i < 3 && !/100/.test(loupe.textContent); i++) loupe.click();
    },
  ],
  [
    "réglages de départ",
    () => {
      const loupe = document.getElementById("loupe-button");
      for (let i = 0; i < 3 && /\d/.test(loupe.textContent); i++) loupe.click();
      const all = document.querySelector('#preview-dialog input[value="all"]');
      if (!all.checked) all.click();
      document.querySelector('input[name="challenge"][value="none"]').click();
      const select = document.querySelector('select[name="compensation"]');
      select.value = "0";
      select.dispatchEvent(new Event("change"));
      document.querySelector('input[name="exposureMode"][value="M"]').click();
      document.querySelector('input[name="brand"][value="nikon"]').click();
      document.querySelector('input[name="release"][value="single"]').click();
      document.querySelector('input[name="areaMode"][value="point"]').click();
      document.querySelector('input[name="focusMode"][value="single"]').click();
    },
  ],
];

/** Relevé de la mise en page : viseur, cadre, déclencheur, libellés coupés, pastilles, défilement horizontal. */
function layoutState() {
  const box = (e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  };
  const main = box(document.querySelector("main"));
  const shutter = box(document.getElementById("shutter-button"));
  const top = box(document.getElementById("top-view"));
  const meets = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 0.5;
  const faults = [];
  for (const e of document.querySelectorAll("#camera-panel button, .bar a, .bar button")) {
    if (e.offsetParent && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1)) faults.push(`libellé coupé : « ${e.textContent} »`);
  }
  for (const id of ["preview-badge", "af-badge", "loupe-badge"]) {
    const e = document.getElementById(id);
    if (e.hidden) continue;
    const b = box(e);
    if (b.x < main.x - 0.5 || b.right > main.right + 0.5 || b.y < main.y - 0.5 || b.bottom > main.bottom + 0.5) faults.push(`${id} hors du viseur`);
    if (id !== "preview-badge" && meets(b, top)) faults.push(`${id} sous la vue de dessus`);
  }
  if (document.documentElement.scrollWidth > innerWidth) faults.push(`défilement horizontal (${document.documentElement.scrollWidth} px)`);
  const inside = shutter.y >= 0 && shutter.bottom <= innerHeight && shutter.x >= 0 && shutter.right <= innerWidth;
  if (!inside) faults.push("déclencheur hors de l'écran");
  const frame = box(document.getElementById("frame"));
  return { main: main.h, mainW: main.w, frame: `${Math.round(frame.w)} × ${Math.round(frame.h)}`, frameW: frame.w, frameH: frame.h, shutter: `${shutter.x.toFixed(1)},${shutter.y.toFixed(1)},${shutter.w.toFixed(1)}×${shutter.h.toFixed(1)}`, faults };
}

async function checkPhoneLayout(browser, base, check) {
  const context = await browser.newContext({ ...devices["iPhone 14 landscape"] });
  const page = await context.newPage();
  page.setDefaultTimeout(300000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(`page : ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console : ${message.text()}`);
  });
  const cycle = async (label) => {
    const states = [{ step: "chargé", ...(await page.evaluate(layoutState)) }];
    for (const [step, act] of LAYOUT_STEPS) {
      await page.evaluate(act);
      await page.waitForTimeout(400);
      states.push({ step, ...(await page.evaluate(layoutState)) });
    }
    const changes = (key) => states.filter((s, i) => i > 0 && s[key] !== states[i - 1][key]).map((s) => `${s.step} : ${s[key]}`);
    const mains = states.map((s) => s.main);
    // Le cadre suit les proportions du capteur : avec l'EOS R50 (22,3 × 14,9 mm, rapport 1,497 ; Z 6 : 1,502), il change
    // d'un pixel au plus. On vérifie qu'il garde son sens et son grand côté, à 1,5 px près.
    const shapes = new Set(states.map((s) => (s.frameW >= s.frameH ? "horizontal" : "vertical")));
    const longs = states.map((s) => Math.max(s.frameW, s.frameH));
    const frameMoved = shapes.size > 1 || Math.max(...longs) - Math.min(...longs) > 1.5;
    const moved = Math.max(...mains) - Math.min(...mains) > 0.5 || frameMoved || changes("shutter").length > 0;
    check(
      `${label} : viseur, cadre et déclencheur immobiles quand les textes changent (INT-04, INT-12)`,
      !moved,
      `viseur de ${Math.min(...mains).toFixed(1)} à ${Math.max(...mains).toFixed(1)} px de haut ; cadre ${[...shapes].join(" puis ")}, ${states[0].frame}${frameMoved ? `, puis ${changes("frame").join(", ")}` : ""} ; déclencheur ${changes("shutter").length ? `déplacé (${changes("shutter").join(", ")})` : "immobile"} ; ${states.length - 1} étapes`,
    );
    const faults = states.flatMap((s) => s.faults.map((f) => `${s.step} : ${f}`));
    check(
      `${label} : libellés entiers, pastilles dans le viseur et hors de la vue de dessus, déclencheur à l'écran (INT-11)`,
      faults.length === 0,
      faults.length ? [...new Set(faults)].slice(0, 8).join(" ; ") : `${states.length} relevés sans défaut`,
    );
    return states[0];
  };
  const review = async (label) => {
    const before = await page.evaluate(layoutState);
    await page.evaluate(() => document.getElementById("shutter-button").click());
    await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden && document.getElementById("review-image").complete, null, { timeout: 300000 });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const box = (id) => document.getElementById(id).getBoundingClientRect();
      const visible = (b) => b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth;
      const review = box("review");
      const image = box("review-image");
      return { width: image.width, height: image.height, covers: review.top <= 0.5 && review.bottom >= innerHeight - 0.5 && review.left <= 0.5 && review.right >= innerWidth - 0.5, back: visible(box("review-back")), save: visible(box("review-save")) };
    });
    check(
      `${label} : écran de revue sur tout l'écran, photo d'au moins 90 % de la largeur du cadre, « Revenir au viseur » et « Enregistrer la photo » visibles (INT-17)`,
      r.covers && r.width >= 0.9 * before.frameW && r.back && r.save,
      `photo de ${Math.round(r.width)} × ${Math.round(r.height)} px, cadre du viseur de ${before.frame} px ; ${r.covers ? "tout l'écran" : "pas tout l'écran"} ; « Revenir au viseur » ${r.back ? "visible" : "hors de l'écran"}, « Enregistrer la photo » ${r.save ? "visible" : "hors de l'écran"}`,
    );
    await page.evaluate(() => document.getElementById("review-back").click());
    await page.waitForFunction(() => document.getElementById("review").hidden, null, { timeout: 60000 });
  };
  try {
    await page.goto(`${base}/simulateur/`);
    const loaded = await page
      .waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 })
      .then(() => true)
      .catch(() => false);
    check("à l'horizontale (750 × 340) : chargement", loaded);
    if (!loaded) return;
    await page.waitForTimeout(800);
    const start = await page.evaluate(() => {
      const box = (id) => document.getElementById(id).getBoundingClientRect();
      const main = document.querySelector("main").getBoundingClientRect();
      const toggle = box("top-view-toggle");
      return {
        topCollapsed: document.getElementById("top-view").classList.contains("collapsed"),
        balanceCollapsed: document.getElementById("balance").classList.contains("collapsed"),
        toggleInside: toggle.top >= main.top && toggle.bottom <= main.bottom && toggle.left >= main.left && toggle.right <= main.right,
        panelBeside: box("camera-panel").left >= main.right - 0.5,
        frameH: box("frame").height,
        vh: innerHeight,
      };
    });
    check(
      "à l'horizontale (750 × 340) : panneau à droite du viseur, cadre d'au moins 60 % de la hauteur de la fenêtre, vue de dessus et indicateur d'équilibre repliés, bouton « Vue de dessus » dans le viseur (INT-03)",
      start.panelBeside && start.frameH >= 0.6 * start.vh && start.topCollapsed && start.balanceCollapsed && start.toggleInside,
      `panneau ${start.panelBeside ? "à droite" : "pas à droite"} ; cadre de ${Math.round(start.frameH)} px de haut pour ${start.vh} ; vue de dessus ${start.topCollapsed ? "repliée" : "dépliée"}, indicateur ${start.balanceCollapsed ? "replié" : "déplié"} ; bouton ${start.toggleInside ? "dans le viseur" : "hors du viseur"}`,
    );
    await cycle("à l'horizontale (750 × 340)");
    await review("à l'horizontale (750 × 340)");
    for (const [width, height, label] of [[390, 664, "droit (390 × 664)"], [412, 839, "droit (412 × 839)"], [600, 960, "droit (600 × 960)"], [320, 664, "droit (320 × 664)"]]) {
      await page.setViewportSize({ width, height });
      // Le cadre n'est replacé qu'au rendu suivant (ResizeObserver, puis le moteur, puis le panneau), qui prend plus d'une
      // demi-seconde dans la CI : on attend qu'il remplisse la zone du viseur sur un de ses côtés (relecture de la
      // version 0.4.10, R7).
      await page.waitForFunction(
        () => {
          const m = document.querySelector("main").getBoundingClientRect();
          const f = document.getElementById("frame").getBoundingClientRect();
          // Le cadre d'avant peut remplir la nouvelle zone sur un côté et la dépasser sur l'autre : il doit aussi y tenir
          // (contrôle final de la version 0.4.10, F7).
          return (Math.abs(f.width - m.width) < 1 || Math.abs(f.height - m.height) < 1) && f.width <= m.width + 1 && f.height <= m.height + 1;
        },
        null,
        { timeout: 60000 },
      );
      await page.waitForTimeout(400);
      const first = await cycle(label);
      check(`${label} : viseur assez grand (INT-04)`, first.main >= 0.35 * height, `${first.main.toFixed(1)} px de haut, fenêtre de ${height} px`);
    }
    // Fenêtres (INT-20), à 320 × 664 px : « Fermer » visible sans faire défiler ; rouverte, la fenêtre est en haut ;
    // un toucher sur le fond la ferme, un doigt posé dedans et levé sur le fond ne la ferme pas.
    const dialogs = [];
    for (const [button, id, close] of [["af-button", "af-dialog", "af-close"], ["preview-button", "preview-dialog", "preview-close"], ["meter-value", "exposure-dialog", "exposure-close"]]) {
      await page.evaluate((b) => document.getElementById(b).click(), button);
      await page.waitForTimeout(200);
      const shown = await page.evaluate(({ id, close }) => {
        const d = document.getElementById(id);
        const db = d.getBoundingClientRect();
        const cb = document.getElementById(close).getBoundingClientRect();
        return { open: d.open, taller: d.scrollHeight > d.clientHeight + 1, closeVisible: cb.top >= db.top && cb.bottom <= db.bottom && cb.bottom <= innerHeight };
      }, { id, close });
      await page.evaluate((id) => {
        const d = document.getElementById(id);
        d.scrollTop = d.scrollHeight;
      }, id);
      await page.evaluate((c) => document.getElementById(c).click(), close);
      await page.waitForTimeout(150);
      await page.evaluate((b) => document.getElementById(b).click(), button);
      await page.waitForTimeout(150);
      const reopened = await page.evaluate((id) => document.getElementById(id).scrollTop, id);
      // Un toucher de l'écran tactile émulé, en haut à gauche, sur le fond.
      await page.touchscreen.tap(3, 3);
      await page.waitForTimeout(150);
      const closedByBackdrop = await page.evaluate((id) => !document.getElementById(id).open, id);
      if (!closedByBackdrop) await page.keyboard.press("Escape");
      await page.evaluate((b) => document.getElementById(b).click(), button);
      await page.waitForTimeout(150);
      const inside = await page.evaluate((id) => {
        const b = document.querySelector(`#${id} h2`).getBoundingClientRect();
        return { x: b.left + 5, y: b.top + 5 };
      }, id);
      await page.mouse.move(inside.x, inside.y);
      await page.mouse.down();
      await page.mouse.move(3, 3);
      await page.mouse.up();
      await page.waitForTimeout(150);
      const keptOpen = await page.evaluate((id) => document.getElementById(id).open, id);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(100);
      dialogs.push({ id, ...shown, reopened, closedByBackdrop, keptOpen });
    }
    const bad = dialogs.filter((d) => !d.open || !d.closeVisible || d.reopened !== 0 || !d.closedByBackdrop || !d.keptOpen);
    check(
      "droit (320 × 664) : fenêtres « Mise au point », « Aperçu » et « Exposition » : « Fermer » visible sans faire défiler, rouvertes en haut, fermées par un toucher sur le fond, pas par un appui de souris commencé dedans et relâché sur lui (INT-20)",
      bad.length === 0 && dialogs.some((d) => d.taller),
      dialogs.map((d) => `${d.id} : ${d.taller ? "plus haute que l'écran" : "tient dans l'écran"}, « Fermer » ${d.closeVisible ? "visible" : "caché"}, rouverte à ${Math.round(d.reopened)} px, ${d.closedByBackdrop ? "fermée" : "pas fermée"} par un toucher sur le fond, ${d.keptOpen ? "ouverte" : "fermée"} après un appui relâché sur le fond`).join(" ; "),
    );
    await review("droit (320 × 664)");
  } catch (error) {
    check("mise en page sur téléphone : déroulement", false, String(error).split("\n").slice(0, 8).join(" ⏎ "));
  } finally {
    check("mise en page sur téléphone : aucune erreur de la page ni de la console", errors.length === 0, errors.length ? errors.slice(0, 5).join(" | ") : "aucune");
    await context.close();
  }
}

async function runProfile(browser, name, base) {
  const profile = PROFILES[name];
  if (!profile) throw new Error(`Profil inconnu : ${name}`);
  const { noWebgl2, ...contextOptions } = profile;
  const context = await browser.newContext(contextOptions);
  // Le rendu logiciel ne permet pas de lire le canevas WebGL sans conserver le tampon de dessin.
  await context.addInitScript((noWebgl2) => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      if (noWebgl2 && type === "webgl2") return null;
      if (type === "webgl2" || type === "webgl") attributes = { ...(attributes || {}), preserveDrawingBuffer: true };
      return original.call(this, type, attributes);
    };
  }, Boolean(noWebgl2));
  const page = await context.newPage();
  // En rendu logiciel, une image avec profondeur de champ peut prendre plusieurs secondes.
  page.setDefaultTimeout(300000);
  // Erreurs des pages (exceptions non rattrapées, promesses rejetées sans traitement), avec l'adresse de la page, et
  // messages d'erreur de la console (dont les fichiers qui ne se chargent pas, avec leur adresse), pour le contrôle
  // « aucune erreur de la page ni de la console » de la fin du profil (INT-06 de l'audit, version 0.3.64). Les
  // écouteurs sont posés sur le contexte, avant l'accueil : ils entendent toutes ses pages. Le profil ouvre les
  // siennes dans cet onglet (accueil, fiches, activité LUM-02, simulateur ; les fiches ouvertes par-dessus le
  // simulateur sont chargées dans sa page) ; une fenêtre ouverte à part, par un lien « target="_blank" » ou par
  // window.open, serait entendue aussi, ce qu'un écouteur de la page ne fait pas (relecture de la version 0.3.64).
  const errors = [];
  context.on("weberror", (e) => {
    const where = e.page()?.url().replace(base, "") ?? "";
    errors.push(`page : ${e.error().message.slice(0, 200)}${where ? ` (${where})` : ""}`);
  });
  context.on("console", (m) => {
    if (m.type() !== "error") return;
    const url = m.location().url;
    errors.push(`console : ${m.text().slice(0, 200)}${url ? ` (${url.replace(base, "")})` : ""}`);
  });
  const checks = [];
  const check = (label, ok, detail = "") => checks.push({ label, ok, detail });
  const started = Date.now();
  try {
    await checkPages(page, base, name, check);
    await checkNoWebgl(browser, contextOptions, base, check);
    await checkFloatRender(browser, contextOptions, base, check, Boolean(noWebgl2));
    await checkLostAtStart(browser, contextOptions, base, check, Boolean(noWebgl2));
    await checkLightTextures(browser, contextOptions, base, check, Boolean(noWebgl2));
    // Mise en page sur téléphone, dans un contexte à part (Sujet 42, version 0.4.10) : profil iphone seulement, pour ne
    // charger la scène qu'une fois de plus.
    if (name === "iphone") await checkPhoneLayout(browser, base, check);
    // Le simulateur est ouvert avec « ?lang=en », paramètre retiré en version 0.3.60 : il doit s'ouvrir en français,
    // sans bouton de langue. Toute la suite de la routine lit des textes français sur cette page.
    await page.goto(`${base}/simulateur/?lang=en`);
    const french = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      subtitle: document.getElementById("subtitle")?.textContent ?? "",
      button: document.getElementById("lang") ? 1 : 0,
      saved: localStorage.getItem("tutophoto.lang"),
    }));
    check(
      "simulateur ouvert avec ?lang=en : en français, sans bouton de langue",
      french.lang === "fr" && french.subtitle.startsWith("Simulateur photo") && french.button === 0 && french.saved === null,
      `langue ${french.lang}, « ${french.subtitle} », ${french.button} bouton de langue, clé tutophoto.lang : ${french.saved}`,
    );
    const loaded = await page
      .waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 })
      .then(() => true)
      .catch(() => false);
    check("chargement", loaded, `${Math.round((Date.now() - started) / 1000)} s`);
    const home = await page.evaluate(() => ({ text: document.getElementById("home")?.textContent ?? "", href: document.getElementById("home")?.getAttribute("href") ?? "" }));
    check("simulateur : lien vers l'accueil", home.text === "Accueil" && home.href === "../", `« ${home.text} » → ${home.href}`);
    // Titre propre au simulateur, distinct de celui de l'accueil dans l'historique et les onglets (INT-19, Sujet 13).
    const simTitle = await page.title();
    check("simulateur : titre de la page", simTitle === "Simulateur · TutoPhoto", `« ${simTitle} »`);
    // Ligne de diagnostic (app/src/main.ts) : erreurs JavaScript, bruit ou profondeur de champ du viseur
    // indisponibles, rendu en flottants absent, scène affichée avant d'être prête ; vide et masquée sans problème. Lue
    // ici, puis en fin de parcours (« aucun problème affiché à la fin du parcours », plus bas).
    const diagnosticText = () =>
      page.evaluate(() => {
        const d = document.getElementById("diagnostic");
        return d && !d.hidden ? d.textContent : "";
      });
    const diagnostic = await diagnosticText();
    check("aucun problème affiché", !diagnostic, diagnostic);
    // Affichage de diagnostic (version 0.3.88) : créé seulement avec « ?diagnostic » dans l'adresse.
    const diagnosticView = await page.evaluate(() => document.getElementById("diagnostic-view") !== null);
    check("sans ?diagnostic : pas d'affichage de diagnostic", !diagnosticView, diagnosticView ? "affichage présent" : "absent");
    // Sans scène, la suite n'a pas d'objet ; le bloc finally ajoute encore à checks le contrôle des erreurs.
    if (!loaded) return { name, checks };
    // Accessibilité (Sujet 38, version 0.4.7 ; constats INT-08, INT-15 et INT-16 de l'audit), lue dans les attributs.
    const a11y = await page.evaluate(() => {
      const named = (id) => {
        const e = document.getElementById(id);
        return { text: e?.textContent ?? "", label: e?.getAttribute("aria-label") ?? "", live: e?.hasAttribute("aria-live") ?? true };
      };
      return {
        tabIndex: document.getElementById("scene").getAttribute("tabindex"),
        outputs: [...document.querySelectorAll(".dial output")].map((o) => document.getElementById(o.getAttribute("aria-labelledby") ?? "")?.textContent ?? ""),
        aperture: document.querySelector('[data-dial="aperture"][data-step="1"]')?.getAttribute("aria-label") ?? "",
        shutter: document.querySelector('[data-dial="shutter"][data-step="1"]')?.getAttribute("aria-label") ?? "",
        meter: named("meter-value"),
        af: named("af-button"),
        statusRole: document.getElementById("status").getAttribute("role"),
        messageRole: document.getElementById("status-message")?.getAttribute("role") ?? "",
      };
    });
    check(
      "accessibilité : viseur à sa place dans la tabulation, valeurs et boutons nommés",
      a11y.tabIndex === "0" &&
        a11y.outputs.length === 4 &&
        a11y.outputs.every((n) => n !== "") &&
        /fermer/.test(a11y.aperture) &&
        /pose plus longue/.test(a11y.shutter) &&
        a11y.meter.text !== "" &&
        a11y.meter.label.startsWith(a11y.meter.text) &&
        !a11y.meter.live &&
        a11y.af.text !== "" &&
        a11y.af.label.startsWith(a11y.af.text) &&
        a11y.statusRole === null &&
        a11y.messageRole === "status",
      `tabindex ${a11y.tabIndex} ; valeurs nommées : ${a11y.outputs.join(", ")} ; « ${a11y.aperture} » ; « ${a11y.shutter} » ; « ${a11y.meter.label} » ; « ${a11y.af.label} »`,
    );
    // Mise au point par défaut (MAP-04, MAP-05) : AF-S et point sélectif, comme le Z 6 (app/src/camera/settings.ts,
    // [nikon-z6-defaults]). Lue avant que la routine ne règle quoi que ce soit en mise au point (INT-05 de l'audit,
    // version 0.3.64) : en fin de test, « mise au point : retour à AF-S et point sélectif » relit un réglage que la
    // routine vient de faire dans la fenêtre « Mise au point ».
    const afDefault = await page.evaluate(() => document.getElementById("af-badge").textContent);
    check("mise au point : AF-S et point sélectif par défaut (Z 6)", /^AF-S · Point · /.test(afDefault), afDefault);

    // Le rendu est à la densité de l'écran, plafonnée à 2 (version 0.3.53 : pixels calculés = pixels CSS ×
    // min(densité, 2)), et le cadre a les proportions du capteur (Nikon Z 6 : 35,9 / 23,9).
    await page.waitForTimeout(500);
    const geometry = await page.evaluate(() => {
      const c = document.getElementById("scene");
      const f = document.getElementById("frame").getBoundingClientRect();
      return { rw: c.width, rh: c.height, cw: c.clientWidth, ch: c.clientHeight, dpr: window.devicePixelRatio, ratio: Math.max(f.width, f.height) / Math.min(f.width, f.height) };
    });
    check(
      "rendu à la densité de l'écran",
      Math.abs(geometry.rw - geometry.cw * Math.min(geometry.dpr, 2)) <= 2 && Math.abs(geometry.rh - geometry.ch * Math.min(geometry.dpr, 2)) <= 2,
      `${geometry.rw}×${geometry.rh} rendu, ${geometry.cw}×${geometry.ch} affiché, densité ${geometry.dpr}, plafond 2`,
    );
    check("cadre aux proportions du capteur", Math.abs(geometry.ratio - 35.9 / 23.9) < 0.02, `rapport ${geometry.ratio.toFixed(3)}, attendu ${(35.9 / 23.9).toFixed(3)}`);

    const viewfinder = await page.evaluate(() => ({ h: document.getElementById("scene").clientHeight, vh: window.innerHeight }));
    check("viseur assez grand", viewfinder.h >= 0.35 * viewfinder.vh, `${viewfinder.h} px de haut, fenêtre de ${viewfinder.vh} px`);

    // Indicateur d'équilibre, réglages par défaut (50 mm, f/8, 1/100 s, ISO 100).
    const balanceLine = (id, pattern) =>
      page
        .waitForFunction(
          ([lineId, source]) => {
            const text = document.getElementById(lineId).textContent;
            return new RegExp(source).test(text) ? text : null;
          },
          [id, pattern.source],
          { timeout: 30000 },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => null);
    const noiseDefault = (await balanceLine("balance-noise", /bruit /)) ?? (await page.evaluate(() => document.getElementById("balance-noise").textContent));
    const dofDefault = await page.evaluate(() => document.getElementById("balance-dof").textContent);
    check(
      "indicateur d'équilibre aux réglages par défaut",
      /zone nette\u00a0: \d+,\d m – (\d+,\d m|∞)/.test(dofDefault) && /ISO 100 · bruit excellent/.test(noiseDefault),
      `${dofDefault} | ${noiseDefault}`,
    );
    // Exposition (BOI-07, BOI-08, MES-04, MES-10) : M et ISO auto par défaut, comme le Z 6. L'ISO auto est coupé
    // pour les contrôles suivants, qui règlent l'ISO à la main.
    const setExposure = async ({ mode, autoIso, compensation }) => {
      await page.click("#meter-value");
      if (mode) await page.check(`#exposure-dialog input[name="exposureMode"][value="${mode}"]`);
      if (autoIso === true) await page.check('#exposure-dialog input[name="autoIso"]');
      if (autoIso === false) await page.uncheck('#exposure-dialog input[name="autoIso"]');
      if (compensation !== undefined) await page.selectOption('#exposure-dialog select[name="compensation"]', String(compensation));
      await page.click("#exposure-close");
    };
    const dialState = (dial) =>
      page.evaluate((d) => {
        const box = document.querySelector(`[data-box="${d}"]`);
        const out = box.querySelector("output");
        return {
          name: box.querySelector(".dial-name").textContent,
          value: out.textContent,
          flashing: out.classList.contains("flashing"),
          disabled: box.querySelector("button[data-step]").disabled,
        };
      }, dial);
    const meterText = () => page.evaluate(() => document.getElementById("meter-value").textContent);
    const isoDefault = await dialState("iso");
    const meterDefault = await meterText();
    check("exposition par défaut : M et ISO auto (Z 6)", /^M · /.test(meterDefault) && isoDefault.name === "ISO auto" && isoDefault.value === "100", `${meterDefault} ; ${isoDefault.name} ${isoDefault.value}`);
    await setExposure({ autoIso: false });

    // Vue de dessus (NET-01) et appareil déplaçable (NET-06). AF-C, zone automatique : l'œil de Sophia vers 6,6 m
    // (le point central, au bord de Sophia une fois l'appareil reculé, tombait parfois à côté d'elle sur le profil
    // Android). Reculé de 4 m en touchant la carte (x = 0, z = −4), l'appareil mesure environ 4 m de plus ;
    // « Retour au départ » le ramène. Carte : x de −8 à 8 m, z de 15 m (en haut) à −7 m (en bas).
    const badgeMetres = async () => {
      const m = /(\d+[,.]\d) m$/.exec(await page.evaluate(() => document.getElementById("af-badge").textContent));
      return m ? Number(m[1].replace(",", ".")) : NaN;
    };
    // Attend que la distance affichée en AF-C vérifie la condition (le rendu logiciel peut être lent) ; au plus 30 s.
    // « group » : le groupe, à moins de 9 m ; « farther » : plus de v + 3 m ; « back » : à 0,3 m près de v.
    const waitMetres = (kind, arg) =>
      page
        .waitForFunction(
          ([mode, value]) => {
            const m = /^AF-C · Auto · .* (\d+[,.]\d) m$/.exec(document.getElementById("af-badge").textContent);
            if (!m) return false;
            const d = Number(m[1].replace(",", "."));
            return mode === "group" ? d < 9 : mode === "farther" ? d > value + 3 : Math.abs(d - value) < 0.3;
          },
          [kind, arg],
          { timeout: 30000 },
        )
        .catch(() => undefined);
    const topCollapsed = !(await page.locator("#top-view-map").isVisible());
    if (topCollapsed) await page.click("#top-view-toggle");
    await page.click("#af-button");
    await page.check('#af-dialog input[name="focusMode"][value="continuous"]');
    await page.check('#af-dialog input[name="areaMode"][value="auto"]');
    await page.check('#af-dialog input[name="detection"][value="faceEye"]');
    await page.click("#af-close");
    await waitMetres("group", 0);
    const fromStart = await badgeMetres();
    const sharpCount = await page.evaluate(() => document.querySelectorAll("#top-view-map .top-things .sharp").length);
    const map = await page.locator("#top-view-map").boundingBox();
    await page.mouse.click(map.x + ((0 + 8) / 16) * map.width, map.y + ((4 + 15) / 22) * map.height);
    await waitMetres("farther", fromStart);
    const fromBack = await badgeMetres();
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-vue-de-dessus.png`), timeout: 120000 });
    await page.click("#top-view-reset");
    await waitMetres("back", fromStart);
    const fromReset = await badgeMetres();
    check(
      "vue de dessus : appareil reculé de 4 m, puis ramené",
      sharpCount > 0 && fromBack - fromStart > 3.5 && fromBack - fromStart < 4.5 && Math.abs(fromReset - fromStart) < 0.3,
      `${fromStart} m au départ, ${fromBack} m reculé, ${fromReset} m ramené ; ${sharpCount} sujets dans la zone nette`,
    );
    await page.click("#af-button");
    await page.check('#af-dialog input[name="focusMode"][value="single"]');
    await page.check('#af-dialog input[name="areaMode"][value="point"]');
    await page.click("#af-close");
    if (topCollapsed) await page.click("#top-view-toggle");

    // Point de mise au point sur le sol, immobile, en bas du cadre, pour comparer le bruit à deux ISO.
    const snrOf = (text) => {
      const m = /signal\/bruit (\d+):1/.exec(text ?? "");
      return m ? Number(m[1]) : NaN;
    };
    const groundBox = await page.locator("#frame").boundingBox();
    await page.mouse.click(groundBox.x + groundBox.width / 2, groundBox.y + 0.95 * groundBox.height);
    await page.waitForTimeout(2000);
    const groundLow = await page.evaluate(() => document.getElementById("balance-noise").textContent);

    // Profondeur de champ : 135 mm, f/1.4, vitesse ajustée pour rester près de l'exposition correcte. Les
    // réglages se font effet coupé, puis l'effet reste coupé : en rendu logiciel, il ralentit chaque image.
    const clicks = async (selector, n) => { for (let i = 0; i < n; i++) await page.click(selector); };
    const setDof = async (on) => {
      await page.click("#preview-button");
      if (on) await page.check('#preview-dialog input[value="depthOfField"]');
      else await page.uncheck('#preview-dialog input[value="depthOfField"]');
      await page.click("#preview-close");
    };
    await setDof(false);
    await clicks('[data-dial="focal"][data-step="1"]', 4);
    await clicks('[data-dial="aperture"][data-step="-1"]', 15);
    await clicks('[data-dial="shutter"][data-step="-1"]', 14);
    // Les deux mesures doivent comparer le même fond. Appareil au point de départ, ce n'était pas toujours le cas :
    // la tête de Sophia (animée, presque dans le plan de netteté) et le promeneur (à 12,5 m, x de −5 à 5 m) passent
    // dans la zone mesurée, et l'horloge de la scène avance entre les deux mesures. Selon l'instant, le contrôle
    // échouait avec l'effet en place (« 1.40 avec, 2.34 sans », profil ordinateur, CI du 15 novembre 2026) et
    // pouvait réussir sans effet. Appareil déplacé à x = −6 m (bord de la zone permise, même orientation), le cadre
    // du 135 mm couvre à 12,5 m, en paysage, x de −7,7 à −4,3 m, et la zone mesurée x de −7,2 à −6,5 m (cadre
    // vertical : plus étroit) : aucun personnage n'y va. Le critère n'a pas changé.
    // Position de l'appareil, lue sur la vue de dessus : le centre du triangle qui le représente (ui/topView.ts),
    // en mètres, x vers la droite et y = −z ; la vue de dessus doit être dépliée pour que ce triangle suive l'appareil.
    const cameraAt = (x, z = null) =>
      page.waitForFunction(
        ([targetX, targetZ]) => {
          const points = document.querySelector("#top-view-map .top-camera polygon")?.getAttribute("points");
          if (!points) return false;
          const corners = points.split(" ").map((point) => point.split(",").map(Number));
          const centre = (k) => corners.reduce((sum, corner) => sum + corner[k], 0) / corners.length;
          return Math.abs(centre(0) - targetX) < 0.05 && (targetZ === null || Math.abs(-centre(1) - targetZ) < 0.05);
        },
        [x, z],
        { timeout: 30000 },
      );
    if (topCollapsed) await page.click("#top-view-toggle");
    // Toucher à x = −7 m, z = 0 : l'application ramène l'appareil au bord de la zone permise, x = −6 m.
    const dofMap = await page.locator("#top-view-map").boundingBox();
    await page.mouse.click(dofMap.x + ((-7 + 8) / 16) * dofMap.width, dofMap.y + ((0 + 15) / 22) * dofMap.height);
    await cameraAt(-6);
    await setDof(true);
    await page.waitForTimeout(1500);
    const blurred = await sharpness(page);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-profondeur-de-champ.png`), timeout: 120000 });
    await setDof(false);
    await page.waitForTimeout(800);
    const sharp = await sharpness(page);
    check("profondeur de champ du viseur", blurred < 0.6 * sharp, `netteté du fond ${blurred.toFixed(2)} avec, ${sharp.toFixed(2)} sans`);
    // Photo à grand flou (constat PHY-21 de l'audit, Sujet 39, version 0.4.8) : au même endroit, au 135 mm à f/1.4, le
    // fond de la photo doit avoir le flou de l'ouverture, même quand le plafond de 5 s arrête le calcul, ce qu'il fait
    // d'ordinaire en rendu logiciel (« 97/256 rendus, calculée en 47,2 s » dans l'essai de la contre-vérification du
    // constat). Avant la version 0.4.8, les rendus allaient du centre du disque d'ouverture vers son bord, et une photo
    // arrêtée après k rendus sur M avait un flou réduit de √(k / M). Mesure : photo de référence à f/22 (8 crans
    // d'ouverture et 8 crans de vitesse plus loin, même exposition), puis photo à f/1.4 ; diamètre du flou du bas de la
    // zone de la mesure du viseur, plus bas (de 15 à 35 % de la largeur, de 10 à 20 % de la hauteur ; cette zone va de 2
    // à 20 %), ajusté entre les deux (blurDiameter) ; diamètre attendu au fond, la sphère du fond étant à 500 m
    // (DOME_RADIUS, app/src/scene.ts) : c = A × f × (D − S) / (D × (S − f)),
    // A = f / N [wikipedia-circle-of-confusion], N = √2 (apertureValue, app/src/camera/exposure.ts), S la distance de
    // mise au point de la légende (verrouillée par le toucher du sol, plus haut), ramené à la photo de 1500 px de grand
    // côté (PHOTO_LONG_SIDE, app/src/camera/optics.ts) pour les 35,9 mm du Z 6 (app/src/camera/bodies.ts). Seuil : de
    // 85 à 115 %. Essai de cette séquence pour la version 0.4.8 (CHANGELOG.md), photo arrêtée de force après 64, 97 ou
    // 256 rendus, mise au point à 5,8 m : de 98,6 à 99,2 % du flou attendu ; avec l'ancien ordre, 49,9 % à 64 rendus
    // et 60,7 % à 97.
    if (withPhoto) {
      const margin = 80;
      const press = (selector, n) => page.evaluate(([s, k]) => { for (let i = 0; i < k; i++) document.querySelector(s).click(); }, [selector, n]);
      const shootRegion = async () => {
        await page.evaluate(() => document.getElementById("shutter-button").click());
        await page.waitForFunction(
          () => !document.getElementById("review").hidden && document.getElementById("progress").hidden && document.getElementById("review-image").complete && document.getElementById("review-image").naturalWidth > 0,
          null,
          { timeout: 600000 },
        );
        const region = await page.evaluate((m) => {
          const img = document.getElementById("review-image");
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const g = canvas.getContext("2d");
          g.drawImage(img, 0, 0);
          const w = Math.round(0.2 * width) + 2 * m;
          const h = Math.round(0.1 * height) + 2 * m;
          const d = g.getImageData(Math.round(0.15 * width) - m, Math.round(0.1 * height) - m, w, h).data;
          const luma = new Array(w * h);
          for (let i = 0; i < w * h; i++) luma[i] = ((d[4 * i] / 255) ** 2.2 + (d[4 * i + 1] / 255) ** 2.2 + (d[4 * i + 2] / 255) ** 2.2) / 3;
          return { width: w, height: h, luma, size: `${width}×${height}`, caption: document.getElementById("review-caption").textContent };
        }, margin);
        await page.evaluate(() => document.getElementById("review-back").click());
        await page.waitForFunction(() => document.getElementById("review").hidden, null, { timeout: 60000 });
        return region;
      };
      await press('[data-dial="aperture"][data-step="1"]', 24);
      await press('[data-dial="shutter"][data-step="1"]', 24);
      const reference = await shootRegion();
      await press('[data-dial="aperture"][data-step="-1"]', 24);
      await press('[data-dial="shutter"][data-step="-1"]', 24);
      const wide = await shootRegion();
      const focusMatch = /(?:mise au point|verrouillée) à (\d+,\d) m/.exec(wide.caption);
      const focusM = focusMatch ? Number(focusMatch[1].replace(",", ".")) : NaN;
      const f = 135;
      const expected = ((((f / Math.SQRT2) * f * (500 - focusM)) / (500 * (focusM * 1000 - f))) * 1500) / 35.9;
      const measured = blurDiameter(reference, wide, margin);
      const ratio = measured / expected;
      const renders = /(\d+(?:\/\d+)?) rendus, calculée en ([\d,]+) s/.exec(wide.caption);
      check(
        "photo à grand flou : flou du fond gardé (135 mm, f/1.4)",
        /^M · f\/1.4 · /.test(wide.caption) && /^M · f\/22 · /.test(reference.caption) && focusM > 0 && ratio >= 0.85 && ratio <= 1.15,
        `${wide.size}, ${renders ? `${renders[1]} rendus en ${renders[2]} s` : wide.caption} ; flou du fond ${measured.toFixed(1)} px pour ${expected.toFixed(1)} px attendus (${(100 * ratio).toFixed(0)} %, mise au point à ${focusM} m) ; référence : ${reference.caption.split(" · ").slice(0, 2).join(" · ")}`,
      );
    }
    // Retour au point de départ avant la suite, vue de dessus repliée comme elle l'était.
    await page.click("#top-view-reset");
    await cameraAt(0, 0);
    if (topCollapsed) await page.click("#top-view-toggle");
    await clicks('[data-dial="focal"][data-step="-1"]', 4);
    await clicks('[data-dial="aperture"][data-step="1"]', 15);
    await clicks('[data-dial="shutter"][data-step="1"]', 14);

    for (let i = 0; i < 18; i++) await page.click('[data-dial="iso"][data-step="1"]');
    for (let i = 0; i < 16; i++) await page.click('[data-dial="shutter"][data-step="-1"]');
    await page.waitForTimeout(800);
    const noisy = await frameNoise(page);
    check("bruit du viseur à ISO 6400", Math.max(...noisy) > 0.3, noisy.map((v) => v.toFixed(2)).join(" / "));
    const noiseHigh = (await balanceLine("balance-noise", /ISO 6400 · bruit /)) ?? (await page.evaluate(() => document.getElementById("balance-noise").textContent));
    const snrRatio = snrOf(noiseHigh) / snrOf(groundLow);
    check(
      "indicateur : bruit au même point du sol, ISO 6400 contre ISO 100",
      /ISO 100 · bruit excellent/.test(groundLow) && snrRatio < 0.4,
      `${groundLow} → ${noiseHigh} (rapport ${snrRatio.toFixed(2)})`,
    );
    await page.mouse.click(groundBox.x + groundBox.width / 2, groundBox.y + groundBox.height / 2);
    await page.click("#preview-button");
    await page.uncheck('#preview-dialog input[value="all"]');
    await page.click("#preview-close");
    await page.waitForTimeout(500);
    const quiet = await frameNoise(page);
    check("aperçu coupé : pas de bruit", Math.max(...quiet) < 0.05, quiet.map((v) => v.toFixed(2)).join(" / "));
    await page.click("#preview-button");
    await page.check('#preview-dialog input[value="all"]');
    await page.click("#preview-close");

    // Modes d'exposition, réglages de départ f/8, 1/4000 s, ISO 6400 sans ISO auto. Scène à 12,5 IL : en indices
    // d'échelle (tiers d'IL), ouverture + vitesse − ISO = 49,5 − correction (camera/exposureModes.ts).
    // A à ISO 6400 : vitesse 49,5 − 15 + 18 = 52,5, au-delà de 1/4000 s : elle clignote (trop de lumière).
    await setExposure({ mode: "A" });
    const aBright = await dialState("shutter");
    check(
      "mode A : vitesse au-delà de 1/4000 s, qui clignote",
      aBright.value === "1/4000 s" && aBright.flashing && aBright.disabled && /\(auto\)/.test(aBright.name),
      `${aBright.name} ${aBright.value}${aBright.flashing ? ", clignote" : ""}${aBright.disabled ? ", molette grisée" : ""}`,
    );
    // ISO 100 puis f/4 : vitesse 34,5 → 1/100 s, puis 40,5 → 1/400 s (à égalité, le cran qui assombrit).
    await clicks('[data-dial="iso"][data-step="-1"]', 18);
    const a8 = await dialState("shutter");
    await clicks('[data-dial="aperture"][data-step="-1"]', 6);
    const a4 = await dialState("shutter");
    check("mode A : la vitesse suit l'ouverture", a8.value === "1/100 s" && a4.value === "1/400 s" && !a4.flashing, `f/8 : ${a8.value} ; f/4 : ${a4.value}`);
    await clicks('[data-dial="aperture"][data-step="1"]', 6);
    // S à 1/4000 s, ISO 100 : ouverture −1,5, plus grande que f/1.4 : elle clignote (pas assez de lumière). Avec
    // l'ISO auto, ISO 125 et f/1.4.
    await setExposure({ mode: "S" });
    const sDark = await dialState("aperture");
    await setExposure({ autoIso: true });
    const sAuto = await dialState("aperture");
    const sIso = await dialState("iso");
    check(
      "mode S : ouverture à f/1.4 qui clignote, puis ISO auto",
      sDark.value === "f/1.4" && sDark.flashing && !sAuto.flashing && sIso.name === "ISO auto" && sIso.value === "125",
      `${sDark.value}${sDark.flashing ? " clignote" : ""} ; ISO auto : ${sAuto.value}, ${sIso.name} ${sIso.value}`,
    );
    // M, 1/100 s, ISO auto, correction +1 IL : ISO 15 + 35 − 46,5 = 3,5 → ISO 200 ; l'indicateur montre l'écart à
    // l'exposition visée, −0,2 IL.
    await clicks('[data-dial="shutter"][data-step="1"]', 16);
    await setExposure({ mode: "M", compensation: 3 });
    const mIso = await dialState("iso");
    const mMeter = await meterText();
    check(
      "mode M : ISO auto avec correction d'exposition",
      mIso.value === "200" && /^M · −0,2 IL · corr\. \+1,0$/.test(mMeter),
      `${mIso.name} ${mIso.value} ; ${mMeter}`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-exposition.png`), timeout: 120000 });
    // Retour aux réglages d'avant : M, sans correction ni ISO auto, f/8, 1/4000 s, ISO 6400.
    await setExposure({ compensation: 0, autoIso: false });
    await clicks('[data-dial="shutter"][data-step="-1"]', 16);
    await clicks('[data-dial="iso"][data-step="1"]', 18);

    // Grilles de cadrage (CMP-02, version 0.3.56), choisies dans la fenêtre « Aperçu ». Lignes visibles du cadre :
    // position du milieu de chaque ligne, en fraction du cadre, et plus grand écart en pixels aux positions
    // attendues (k / n de la largeur pour les verticales, k / m de la hauteur pour les horizontales).
    const gridState = (across, down = across) =>
      page.evaluate(([partsAcross, partsDown]) => {
        const frame = document.getElementById("frame").getBoundingClientRect();
        const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
        const lines = [...document.querySelectorAll("#frame-grid .grid-line")].filter(visible);
        const middle = (el, vertical) => {
          const r = el.getBoundingClientRect();
          return vertical ? r.left + r.width / 2 - frame.left : r.top + r.height / 2 - frame.top;
        };
        const vertical = lines.filter((el) => el.classList.contains("vertical")).map((el) => middle(el, true)).sort((a, b) => a - b);
        const horizontal = lines.filter((el) => el.classList.contains("horizontal")).map((el) => middle(el, false)).sort((a, b) => a - b);
        const worst = (found, size, parts) => Math.max(0, ...found.map((v, k) => Math.abs(v - ((k + 1) * size) / parts)));
        // Diagonales : deux traits clairs, dans un dessin qui couvre tout le cadre.
        const diagonals = [...document.querySelectorAll("#frame-grid .grid-diagonal.light")].filter(visible);
        const drawing = document.querySelector("#frame-grid .grid-diagonals")?.getBoundingClientRect();
        const spread = drawing ? Math.max(Math.abs(drawing.left - frame.left), Math.abs(drawing.top - frame.top), Math.abs(drawing.width - frame.width), Math.abs(drawing.height - frame.height)) : NaN;
        // Les lignes ne reçoivent pas les touchers : au croisement des deux premières, l'élément touché n'est ni une
        // ligne ni le cadre.
        const hit = vertical.length && horizontal.length ? document.elementFromPoint(frame.left + vertical[0], frame.top + horizontal[0]) : null;
        let saved = null;
        try {
          saved = JSON.parse(localStorage.getItem("tutophoto.apercu") ?? "null")?.grid ?? null;
        } catch {
          saved = "illisible";
        }
        return {
          vertical: vertical.length,
          horizontal: horizontal.length,
          error: Math.max(worst(vertical, frame.width, partsAcross), worst(horizontal, frame.height, partsDown)),
          diagonals: diagonals.length,
          spread,
          tall: frame.height > frame.width,
          at: `${vertical.map((v) => ((100 * v) / frame.width).toFixed(1)).join(" / ")} % × ${horizontal.map((v) => ((100 * v) / frame.height).toFixed(1)).join(" / ")} %`,
          caught: Boolean(hit && hit.closest("#frame")),
          checked: document.querySelector('#preview-dialog input[name="grid"]:checked')?.value ?? "",
          saved,
        };
      }, [across, down]);
    const setGrid = async (kind) => {
      await page.click("#preview-button");
      await page.check(`#preview-dialog input[name="grid"][value="${kind}"]`);
      await page.click("#preview-close");
    };
    const gridDefault = await gridState(3);
    check(
      "grille de cadrage : aucune par défaut",
      gridDefault.vertical + gridDefault.horizontal === 0 && gridDefault.checked === "none",
      `${gridDefault.vertical + gridDefault.horizontal} ligne(s) visible(s) ; bouton coché : ${gridDefault.checked}`,
    );
    await setGrid("thirds");
    const thirds = await gridState(3);
    check(
      "grille « Tiers » : quatre lignes à 1/3 et 2/3 du cadre",
      thirds.vertical === 2 && thirds.horizontal === 2 && thirds.error <= 1 && !thirds.caught && thirds.saved === "thirds",
      `${thirds.vertical} + ${thirds.horizontal} lignes à ${thirds.at} ; écart ${thirds.error.toFixed(2)} px ; toucher ${thirds.caught ? "pris par la grille" : "laissé au viseur"} ; tutophoto.apercu : ${thirds.saved}`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-grille-tiers.png`), timeout: 120000 });
    // « Vingt-quatre cases » : six cases sur le grand côté du cadre, quatre sur le petit (cadre vertical sur le profil
    // Android). « Tiers et diagonales » : les tiers, et deux diagonales d'un coin du cadre à l'autre.
    await setGrid("twentyFour");
    const tall = thirds.tall;
    const twentyFour = await gridState(tall ? 4 : 6, tall ? 6 : 4);
    check(
      "grille « Vingt-quatre cases » : six cases sur le grand côté, quatre sur le petit",
      twentyFour.vertical === (tall ? 3 : 5) && twentyFour.horizontal === (tall ? 5 : 3) && twentyFour.error <= 1 && twentyFour.diagonals === 0 && twentyFour.saved === "twentyFour",
      `cadre ${tall ? "vertical" : "horizontal"} ; ${twentyFour.vertical} + ${twentyFour.horizontal} lignes à ${twentyFour.at} ; écart ${twentyFour.error.toFixed(2)} px`,
    );
    await setGrid("thirdsDiagonals");
    const withDiagonals = await gridState(3);
    check(
      "grille « Tiers et diagonales » : tiers et deux diagonales sur tout le cadre",
      withDiagonals.vertical === 2 && withDiagonals.horizontal === 2 && withDiagonals.error <= 1 && withDiagonals.diagonals === 2 && withDiagonals.spread <= 1 && !withDiagonals.caught && withDiagonals.saved === "thirdsDiagonals",
      `${withDiagonals.vertical} + ${withDiagonals.horizontal} lignes, ${withDiagonals.diagonals} diagonale(s) ; dessin à ${Number.isFinite(withDiagonals.spread) ? withDiagonals.spread.toFixed(2) : "?"} px du cadre ; toucher ${withDiagonals.caught ? "pris par la grille" : "laissé au viseur"}`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-grille-diagonales.png`), timeout: 120000 });
    await setGrid("sixteen");
    const sixteen = await gridState(4);
    check(
      "grille « Seize cases » : six lignes à 1/4, 1/2 et 3/4 du cadre",
      sixteen.vertical === 3 && sixteen.horizontal === 3 && sixteen.error <= 1 && !sixteen.caught && sixteen.saved === "sixteen",
      `${sixteen.vertical} + ${sixteen.horizontal} lignes à ${sixteen.at} ; écart ${sixteen.error.toFixed(2)} px ; tutophoto.apercu : ${sixteen.saved}`,
    );

    // Loupe du viseur et son bruit (constat PHY-07 de l'audit, version 0.3.78), à ISO 6400 (M, f/8, 1/4000 s, sans ISO
    // auto). Le point de mise au point est d'abord posé en haut du cadre, au milieu, sur le fond : la loupe se centre
    // sur lui, et la zone mesurée ne montre que le fond, immobile. À densité 2, le bruit doit être tiré par pixel CSS :
    // mesuré par pixel CSS, il vaut alors celui d'un pixel calculé ; tiré par pixel calculé, il en valait la moitié
    // (0,52 fois, mesuré le 20 novembre 2026 : docs/camera-physique.md, « Loupe »). À densité 1, pixels CSS et pixels
    // calculés se confondent : ce rapport n'est pas contrôlé. À toute densité, la loupe doit montrer du bruit, et le
    // rapport du vert au rouge à 50 % dit si k est compté par pixel CSS. Le point est ramené au centre une fois la
    // loupe coupée.
    const loupeFrame = await page.locator("#frame").boundingBox();
    // Premier point, en haut du cadre, où le clic arrive au viseur (sur un téléphone, une aide du viseur peut couvrir
    // le haut du cadre ; document.elementFromPoint donne l'élément qui recevrait le clic).
    const loupeTarget = await page.evaluate((box) => {
      const canvas = document.getElementById("scene");
      for (const [u, v] of [[0.5, 0.15], [0.5, 0.25], [0.65, 0.15], [0.35, 0.15]]) {
        if (document.elementFromPoint(box.x + u * box.width, box.y + v * box.height) === canvas) return { u, v };
      }
      return null;
    }, loupeFrame);
    if (loupeTarget) await page.mouse.click(loupeFrame.x + loupeTarget.u * loupeFrame.width, loupeFrame.y + loupeTarget.v * loupeFrame.height);
    await page.waitForTimeout(1500);
    await page.click("#loupe-button");
    const loupeHalf = await page.evaluate(() => document.getElementById("loupe-badge").textContent);
    await page.waitForTimeout(1500);
    const noiseHalf = await loupeNoise(page);
    await page.click("#loupe-button");
    const loupe = await page.evaluate(() => document.getElementById("loupe-badge").textContent);
    check("loupe du viseur à 100 %", /100/.test(loupe), loupe);
    await page.waitForTimeout(1500);
    const noiseFull = await loupeNoise(page);
    const cssShare = (m) => m.css.map((v, c) => v / Math.max(1e-6, m.px[c]));
    const loupeNoiseText = (label, m) =>
      `${label} : ${m.px.map((v) => v.toFixed(2)).join(" / ")} par pixel calculé, ${m.css.map((v) => v.toFixed(2)).join(" / ")} par pixel CSS`;
    // k compté par pixel CSS : à 50 %, un pixel CSS compte environ 4 photosites, dont 2 verts et 1 rouge ; le bruit du
    // vert vaut environ 1 / √2 = 71 % de celui du rouge (mesuré de 71 à 74 %, Sujet 18). Avec k compté par pixel
    // calculé à densité 2, les deux couleurs auraient le bruit d'un photosite (rapport de 1,05 mesuré avec le code
    // d'avant) : ce rapport garde le compte de k, que le rapport entre pixels CSS et pixels calculés ne voit pas
    // (relecture de la version 0.3.78).
    const greenToRed = noiseHalf.css[1] / Math.max(1e-6, noiseHalf.css[0]);
    const densityOk = noiseFull.density === 1 || !noiseFull.integer || [...cssShare(noiseHalf), ...cssShare(noiseFull)].every((r) => r > 0.85);
    check(
      `loupe du viseur : bruit tiré par pixel CSS, k compté par pixel CSS (densité ${noiseFull.density}${noiseFull.integer ? "" : ", non entière"})`,
      loupeTarget !== null && /50/.test(loupeHalf) && noiseFull.px.every((v) => v > 1) && greenToRed < 0.85 && densityOk,
      `${loupeTarget ? `point posé à ${Math.round(100 * loupeTarget.u)} % et ${Math.round(100 * loupeTarget.v)} % du cadre` : "aucun point du haut du cadre ne reçoit le clic"} ; ${loupeNoiseText(loupeHalf, noiseHalf)} ; ${loupeNoiseText(loupe, noiseFull)} ; vert / rouge à 50 % : ${greenToRed.toFixed(2)} ; zone de ${noiseFull.zone} pixels calculés${noiseFull.integer ? "" : " ; densité non entière : rapport entre pixels CSS et pixels calculés non contrôlé"}`,
    );
    const gridMagnified = await gridState(4);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-loupe.png`), timeout: 120000 });
    await page.click("#loupe-button");
    await page.mouse.click(loupeFrame.x + loupeFrame.width / 2, loupeFrame.y + loupeFrame.height / 2);
    await page.waitForTimeout(500);
    const gridBack = await gridState(4);
    check(
      "grille masquée par la loupe à 100 %, revenue ensuite",
      gridMagnified.vertical + gridMagnified.horizontal === 0 && gridBack.vertical === 3 && gridBack.horizontal === 3 && gridBack.error <= 1,
      `loupe à 100 % : ${gridMagnified.vertical + gridMagnified.horizontal} ligne(s) visible(s) ; loupe coupée : ${gridBack.vertical + gridBack.horizontal}`,
    );
    // Retour à « Aucune » avant la suite.
    await setGrid("none");
    const gridOff = await gridState(3);
    check("grille de cadrage : retour à « Aucune »", gridOff.vertical + gridOff.horizontal === 0 && gridOff.saved === "none", `${gridOff.vertical + gridOff.horizontal} ligne(s) visible(s) ; tutophoto.apercu : ${gridOff.saved}`);

    if (withPhoto) {
      await page.click("#shutter-button");
      await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("review-image").complete, null, { timeout: 300000 });
      const photo = await page.evaluate(() => {
        const img = document.getElementById("review-image");
        if (!img.naturalWidth) return { mean: 0, caption: document.getElementById("review-caption").textContent };
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let s = 0;
        for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 3;
        return { mean: s / (d.length / 4), size: `${c.width}×${c.height}`, caption: document.getElementById("review-caption").textContent };
      });
      check("photo calculée, pas noire", photo.mean > 5, `${photo.size ?? "-"}, niveau moyen ${photo.mean.toFixed(1)} ; ${photo.caption}`);
      check("légende : mode et réglages retenus", /^M · f\/8 · 1\/4000 s · ISO 6400 · 50 mm · /.test(photo.caption), photo.caption.slice(0, 60));
      const bulletinText = await page.evaluate(() => document.getElementById("review-bulletin").innerText);
      check("bulletin sous la photo", /Exposition\u00a0: /.test(bulletinText) && /Zone nette\u00a0: /.test(bulletinText), bulletinText.split("\n").slice(0, 3).join(" | "));
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-photo.png`), timeout: 120000 });

      // Histogrammes et hautes lumières de l'écran de revue (MES-06, MES-07 ; version 0.3.57). Le bouton « Infos »
      // fait défiler : photo seule (par défaut), histogrammes, hautes lumières. État lu dans la page :
      // - histogrammes visibles, avec les nombres de pixels de leurs colonnes (attribut data-columns) ;
      // - texte de la part écrêtée (« … : 3,2 % de l'image », avec une espace insécable devant « % », ou « Aucun
      //   pixel à la valeur maximale ») ;
      // - calque des zones écrêtées : affiché ou non (il clignote : sa visibilité ne compte pas), pixels opaques,
      //   écart en pixels entre son rectangle et celui de la photo, et élément touché au centre de la photo.
      const reviewInfo = () =>
        page.evaluate(() => {
          const shown = (el) => !el.hidden && el.getClientRects().length > 0;
          const img = document.getElementById("review-image");
          const pixels = img.naturalWidth * img.naturalHeight;
          const histograms = [...document.querySelectorAll("#review-histograms svg[data-channel]")].filter(shown).map((svg) => {
            const columns = (svg.dataset.columns ?? "").split(",").map(Number);
            const sum = (list) => list.reduce((a, b) => a + b, 0);
            return { channel: svg.dataset.channel, count: columns.length, total: sum(columns), left: sum(columns.slice(0, 128)) };
          });
          const clipping = document.getElementById("review-clipping");
          const text = shown(clipping) ? clipping.textContent : "";
          // La phrase, visible en son centre et pas sous la barre collée en bas de l'écran de revue (relecture de la
          // version 0.4.10, R2) ; null quand elle n'est pas affichée.
          let textVisible = null;
          if (shown(clipping)) {
            const c = clipping.getBoundingClientRect();
            textVisible = clipping.contains(document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2));
          }
          const m = /: (\d+,\d)\s% de l'image/.exec(text);
          const overlay = document.getElementById("review-highlights");
          const zones = { shown: shown(overlay), opaque: 0, gap: NaN };
          if (zones.shown) {
            const data = overlay.getContext("2d").getImageData(0, 0, overlay.width, overlay.height).data;
            for (let i = 3; i < data.length; i += 4) if (data[i] === 255) zones.opaque++;
            const a = overlay.getBoundingClientRect();
            const b = img.getBoundingClientRect();
            zones.gap = Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top), Math.abs(a.right - b.right), Math.abs(a.bottom - b.bottom));
          }
          const box = img.getBoundingClientRect();
          let saved = null;
          try {
            saved = JSON.parse(localStorage.getItem("tutophoto.revue") ?? "null")?.display ?? null;
          } catch {
            saved = "illisible";
          }
          return {
            button: document.getElementById("review-info").textContent,
            pixels,
            histograms,
            text,
            textVisible,
            share: m ? Number(m[1].replace(",", ".")) : /^Aucun pixel à la valeur maximale/.test(text) ? 0 : NaN,
            zones,
            touched: document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)?.id ?? "",
            exposure: /Exposition\u00a0: (\S+ IL)/.exec(document.getElementById("review-bulletin").innerText)?.[1] ?? "",
            saved,
          };
        });
      const infoDefault = await reviewInfo();
      check(
        "revue : ni histogramme ni clignotement par défaut",
        infoDefault.button === "Infos\u00a0: photo seule" && infoDefault.histograms.length === 0 && !infoDefault.zones.shown && infoDefault.text === "" && infoDefault.saved === null,
        `bouton « ${infoDefault.button} » ; ${infoDefault.histograms.length} histogramme(s) ; zones écrêtées ${infoDefault.zones.shown ? "affichées" : "masquées"} ; tutophoto.revue : ${infoDefault.saved}`,
      );
      await page.click("#review-info");
      const infoHistograms = await reviewInfo();
      check(
        "revue, « Infos » une fois : quatre histogrammes, somme des colonnes égale au nombre de pixels",
        infoHistograms.button === "Infos\u00a0: histogrammes" &&
          infoHistograms.histograms.map((h) => h.channel).join() === "luminance,red,green,blue" &&
          infoHistograms.histograms.every((h) => h.count === 256 && h.total === infoHistograms.pixels) &&
          infoHistograms.pixels > 0 &&
          infoHistograms.saved === "histograms" &&
          infoHistograms.textVisible === true,
        `${infoHistograms.histograms.map((h) => `${h.channel} ${h.total}`).join(", ")} ; photo de ${infoHistograms.pixels} pixels ; ${infoHistograms.text} ; phrase ${infoHistograms.textVisible ? "visible" : "cachée"} ; tutophoto.revue : ${infoHistograms.saved}`,
      );
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-histogrammes.png`), timeout: 120000 });
      // Retour à « photo seule » (par « hautes lumières ») : la loupe de l'écran de revue est contrôlée comme avant.
      await page.click("#review-info");
      await page.click("#review-info");
      const box = await page.locator("#review-image").boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(() => document.getElementById("progress").hidden && !document.getElementById("review-whole").hidden, null, { timeout: 300000 });
      const caption = await page.evaluate(() => document.getElementById("review-caption").textContent);
      check("loupe de l'écran de revue", /100/.test(caption), caption);
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-loupe.png`), timeout: 120000 });

      // Deux loupes séparées par « Photo entière », sur la même photo (constat COD-14 de l'audit, version 0.3.62).
      // La première loupe, ci-dessus, est au centre. Après « Photo entière », la photo est touchée à 50 % de sa
      // largeur et à 20 % de sa hauteur : la seconde loupe doit montrer cet endroit. Avant la correction, le toucher
      // était lu comme une position dans la fenêtre de la première loupe, et la seconde loupe montrait un voisin du
      // centre : pour ce point, le centre remonté de trois dixièmes de la hauteur de la fenêtre. Mesure, sur une
      // seule photo (les sujets bougent d'une photo à l'autre ; la loupe rejoue l'instant de la photo) : la fenêtre
      // de la loupe et une zone de la photo entière sont réduites à 12 × 4 cases, et l'écart est la moyenne, sur les
      // cases, de la différence de luminance en valeur absolue (niveaux de 0 à 255). L'écart est pris avec la zone
      // touchée, puis avec la zone du centre. La place d'une zone dans la photo entière vient de la taille de l'image
      // complète du Nikon Z 6 (24,5 millions de pixels, capteur de 35,9 × 23,9 mm : sensorPixels,
      // app/src/camera/bodies.ts) et de celle de la fenêtre, qui est à 100 % ; calcul de magnify
      // (app/src/ui/shutter.ts). Cette taille est écrite ici en dur. Avec un autre boîtier par défaut, la zone serait
      // fausse et le contrôle réussirait encore : la relecture de la version 0.3.62 l'a mesuré, hors de la routine,
      // avec la taille du Canon EOS RP, boîtier retiré depuis (version 0.3.80) : 3 % en étendue, 2,5 niveaux sur
      // ordinateur à ce point. C'est un changement du centrage de la fenêtre qui le fait échouer. La photo entière est relue à l'adresse du lien
      // « Enregistrer ». Le contrôle demande un écart avec la zone touchée inférieur à 10 niveaux, et inférieur à
      // l'écart avec la zone du centre.
      //
      // Le point touché est dans le haut de la photo, sur les arbres et les troncs. Le premier état du contrôle
      // touchait à 85 % et 80 %, sur le sol de feuilles mortes, sans motif à l'échelle des cases. La relecture de la
      // version 0.3.62 y a mesuré deux faiblesses, hors de la routine : sur les profils ordinateur et webgl1 (fenêtre
      // de 1256 × 466), une loupe ouverte ailleurs sur le sol, à plusieurs fenêtres du point touché, restait sous 10
      // niveaux (de 7,7 à 8,9) ; et sans la correction, l'écart avec la zone touchée restait inférieur à l'écart avec
      // celle du centre sur trois profils sur quatre, où seul le seuil de 10 détectait le défaut. À 50 % et 20 %,
      // même relecture, hors de la routine : avec la correction, 0,4 niveau (ordinateur, Pixel 7 émulé) et 0,7
      // (iPhone 14 émulé, police de la CI) ; sans elle, 77 niveaux avec la zone touchée contre 33 avec celle du
      // centre (ordinateur) et 86 contre 22 (Pixel 7 émulé) ; une image unie, au niveau moyen de la loupe, est à 14
      // niveaux au moins. Dans la routine, le 17 novembre 2026, avec la correction : 0,4 niveau avec la zone touchée
      // contre 51,8 avec celle du centre (ordinateur), 0,7 contre 112,9 (iphone, police de la CI).
      //
      // La zone touchée est placée d'après le point que la photo a reçu (décalage du clic dans l'image, divisé par sa
      // taille affichée : ce que lit magnify), et non d'après le point visé : le clic arrive à un pixel CSS entier, et
      // sur le profil iphone, avec la police de la CI (viseur de 238 px), la photo n'est affichée qu'en 178 × 118 px.
      // Un pixel CSS y vaut 34 pixels de l'image complète, soit 8,5 pixels de la photo entière, plus qu'une case
      // (7,5 × 6 pixels). Placé d'après le point visé, le premier état du contrôle échouait dans la CI sur ce profil,
      // correction en place (16 novembre 2026, toucher à 85 % et 80 % : 12,6 niveaux ; refait sur la machine de
      // Claude avec cette police : 12,9 d'après le point visé, 2,1 d'après le point reçu). Si le clic n'arrive pas à
      // la photo (aucun point reçu en 30 s), aucune loupe n'est demandée : le contrôle échoue en le disant, sans
      // attendre 300 s une loupe qui ne viendra pas.
      await page.click("#review-whole");
      await page.waitForFunction(() => document.getElementById("review-whole").hidden && document.getElementById("review-image").complete, null, { timeout: 300000 });
      const secondTouch = { u: 0.5, v: 0.2 };
      await page.evaluate(() => {
        const image = document.getElementById("review-image");
        window.routineSecondTouch = null;
        image.addEventListener(
          "click",
          (e) => (window.routineSecondTouch = { u: e.offsetX / image.clientWidth, v: e.offsetY / image.clientHeight, shown: `${image.clientWidth}×${image.clientHeight}` }),
          { capture: true, once: true },
        );
      });
      const wholeBox = await page.locator("#review-image").boundingBox();
      await page.mouse.click(wholeBox.x + wholeBox.width * secondTouch.u, wholeBox.y + wholeBox.height * secondTouch.v);
      // Le clic est reçu par la photo avant que magnify commence : sans point reçu, « Photo entière » restera masqué.
      const secondArrived = await page.waitForFunction(() => window.routineSecondTouch !== null, null, { timeout: 30000 }).then(
        () => true,
        () => false,
      );
      if (secondArrived) {
        await page.waitForFunction(
          () => document.getElementById("progress").hidden && !document.getElementById("review-whole").hidden && document.getElementById("review-image").complete,
          null,
          { timeout: 300000 },
        );
      }
      const secondLoupe = !secondArrived ? null : await page.evaluate(async () => {
        const received = window.routineSecondTouch;
        const { u, v } = received;
        const COLUMNS = 12;
        const ROWS = 4;
        const load = (src) =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("image illisible"));
            image.src = src;
          });
        // Luminance moyenne (Rec. 709) de chaque case d'une zone de l'image, donnée en pixels de l'image.
        const cells = (image, x0, y0, width, height) => {
          const c = document.createElement("canvas");
          c.width = image.naturalWidth;
          c.height = image.naturalHeight;
          const g = c.getContext("2d");
          g.drawImage(image, 0, 0);
          const out = [];
          for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
              const xa = Math.min(c.width - 1, Math.round(x0 + (column * width) / COLUMNS));
              const xb = Math.min(c.width, Math.max(xa + 1, Math.round(x0 + ((column + 1) * width) / COLUMNS)));
              const ya = Math.min(c.height - 1, Math.round(y0 + (row * height) / ROWS));
              const yb = Math.min(c.height, Math.max(ya + 1, Math.round(y0 + ((row + 1) * height) / ROWS)));
              const d = g.getImageData(xa, ya, xb - xa, yb - ya).data;
              let sum = 0;
              for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
              out.push(sum / (d.length / 4));
            }
          }
          return out;
        };
        const gap = (a, b) => a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / a.length;
        const loupe = await load(document.getElementById("review-image").src);
        const photo = await load(document.getElementById("review-save").href);
        const long = Math.sqrt((24.5e6 * 35.9) / 23.9);
        const portrait = photo.naturalHeight > photo.naturalWidth;
        const fullWidth = Math.round(portrait ? 24.5e6 / long : long);
        const fullHeight = Math.round(portrait ? long : 24.5e6 / long);
        const width = loupe.naturalWidth;
        const height = loupe.naturalHeight;
        // Fenêtre centrée sur le point, ramenée dans l'image complète, puis rapportée à la photo entière.
        const zone = (x, y) => {
          const left = Math.min(fullWidth - width, Math.max(0, Math.round(x * fullWidth - width / 2)));
          const top = Math.min(fullHeight - height, Math.max(0, Math.round(y * fullHeight - height / 2)));
          const sx = photo.naturalWidth / fullWidth;
          const sy = photo.naturalHeight / fullHeight;
          return cells(photo, left * sx, top * sy, width * sx, height * sy);
        };
        const shown = cells(loupe, 0, 0, width, height);
        return {
          touched: gap(shown, zone(u, v)),
          centre: gap(shown, zone(0.5, 0.5)),
          loupe: `${width}×${height}`,
          photo: `${photo.naturalWidth}×${photo.naturalHeight}`,
          shown: received.shown,
          u,
          v,
          caption: document.getElementById("review-caption").textContent,
        };
      });
      check(
        "revue : après « Photo entière », la seconde loupe montre le point touché",
        secondLoupe !== null && /100/.test(secondLoupe.caption) && secondLoupe.touched < 10 && secondLoupe.touched < secondLoupe.centre,
        `toucher à ${(100 * secondTouch.u).toFixed(0)} % et ${(100 * secondTouch.v).toFixed(0)} %` +
          (secondLoupe === null
            ? " : le clic n'est pas arrivé à la photo (aucun point reçu en 30 s), aucune loupe n'a été demandée"
            : `, reçu à ${(100 * secondLoupe.u).toFixed(1)} % et ${(100 * secondLoupe.v).toFixed(1)} % : écart de ${secondLoupe.touched.toFixed(1)} niveau(x) avec la zone touchée, de ${secondLoupe.centre.toFixed(1)} avec celle du centre ; fenêtre ${secondLoupe.loupe}, photo ${secondLoupe.photo}, affichée en ${secondLoupe.shown}`),
      );
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-loupe-2.png`), timeout: 120000 });

      // Loupe, puis « Revenir au viseur » pendant son calcul (constat COD-08 de l'audit, version 0.3.71) : la loupe doit
      // être jetée, l'écran de revue rester fermé. Avant la correction, il se rouvrait à la fin du calcul avec la
      // fenêtre de la loupe (essai du 20 novembre 2026, construction de origin/main, hors de la routine). À la tâche
      // suivante du toucher de la photo, calcul commencé, la routine fait défiler l'écran de revue en bas ; puis elle
      // clique « Revenir au viseur » à la souris, en son centre : écran défilé en bas, la bande « Calcul de la
      // loupe… » recouvrait le bouton et prenait le clic (constat B1 de la relecture du Sujet 11, version 0.3.71). Le
      // contrôle relève l'élément sous le centre du bouton, que le clic est arrivé au bouton pendant le calcul, et lit
      // l'écran de revue une seconde après la fin du calcul ; il donne le temps entre le clic et la fin du calcul.
      await page.waitForFunction(() => document.getElementById("progress").hidden && !document.getElementById("review").hidden);
      await page.evaluate(() => {
        window.routineBack = null;
        window.routineBackClick = null;
        window.routineProgressEnd = null;
        const progress = document.getElementById("progress");
        new MutationObserver((_, observer) => {
          if (progress.hidden && window.routineBackClick) {
            window.routineProgressEnd = performance.now();
            observer.disconnect();
          }
        }).observe(progress, { attributes: true, attributeFilter: ["hidden"] });
        document.getElementById("review-back").addEventListener(
          "click",
          () => (window.routineBackClick = { at: performance.now(), computing: !progress.hidden, label: document.getElementById("progress-label").textContent }),
          { once: true },
        );
        document.getElementById("review-image").addEventListener(
          "click",
          () =>
            setTimeout(() => {
              const review = document.getElementById("review");
              review.scrollTop = review.scrollHeight;
              window.routineBack = { computing: !progress.hidden };
            }, 0),
          { once: true },
        );
      });
      const backBox = await page.locator("#review-image").boundingBox();
      await page.mouse.click(backBox.x + backBox.width / 2, backBox.y + backBox.height / 2);
      const backArrived = await page.waitForFunction(() => window.routineBack !== null, null, { timeout: 30000 }).then(
        () => true,
        () => false,
      );
      let backUnder = null;
      if (backArrived) {
        const button = await page.evaluate(() => {
          const b = document.getElementById("review-back").getBoundingClientRect();
          const x = b.left + b.width / 2;
          const y = b.top + b.height / 2;
          const under = document.elementFromPoint(x, y);
          return { x, y, under: under ? under.id || under.className || under.tagName : null };
        });
        backUnder = button.under;
        await page.mouse.click(button.x, button.y);
      }
      await page.waitForFunction(() => document.getElementById("progress").hidden);
      await page.waitForTimeout(1000);
      const back = await page.evaluate(() => ({
        ...(window.routineBack ?? {}),
        click: window.routineBackClick,
        ended: window.routineProgressEnd && window.routineBackClick ? (window.routineProgressEnd - window.routineBackClick.at) / 1000 : null,
        review: !document.getElementById("review").hidden,
        caption: document.getElementById("review-caption").textContent,
      }));
      check(
        "revue : loupe jetée après « Revenir au viseur » pendant son calcul, écran défilé en bas (COD-08, B1)",
        backArrived && back.computing === true && back.click?.computing === true && !back.review,
        !backArrived
          ? "le clic n'est pas arrivé à la photo en 30 s"
          : `sous le centre de « Revenir au viseur » : ${backUnder} ; clic ${back.click ? `arrivé au bouton, calcul ${back.click.computing ? `en cours (« ${back.click.label} »)` : "fini"}` : "pas arrivé au bouton"} ; écran de revue ${back.review ? `rouvert (« ${back.caption.slice(0, 60)} »)` : "resté fermé"}` +
            (back.ended !== null ? ` ; calcul fini ${back.ended.toFixed(1).replace(".", ",")} s après le clic` : ""),
      );

      // Photo en échec après une bonne photo (constat B10 de la relecture de la version 0.3.70, version 0.3.71) : le
      // message seul, sans l'image, « Touche la photo… » ni « Enregistrer la photo » de la photo d'avant, qui restaient
      // affichés. La photo d'avant est une vue seule : les boutons de la série, relevés aussi, ne peuvent pas être
      // affichés ici, et ce contrôle ne les vérifie pas (constat A1 de la relecture du Sujet 11). L'échec est provoqué par la routine : canvas.toBlob, dernière étape du calcul
      // (app/src/camera/photo.ts), lève une erreur au texte reconnaissable, admise dans ADMITTED_ERRORS ; toBlob est
      // rendu ensuite.
      if (await page.isVisible("#review")) await page.click("#review-back");
      await page.evaluate(() => {
        const original = HTMLCanvasElement.prototype.toBlob;
        window.routineRestoreBlob = () => (HTMLCanvasElement.prototype.toBlob = original);
        HTMLCanvasElement.prototype.toBlob = function () {
          throw new Error("échec injecté par la routine");
        };
      });
      await page.click("#shutter-button");
      const failedShown = await page
        .waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden && /n'a pas pu/.test(document.getElementById("review-caption").textContent), null, { timeout: 300000 })
        .then(() => true, () => false);
      await page.evaluate(() => window.routineRestoreBlob());
      const failedView = await page.evaluate(() => {
        const shown = (id) => {
          const el = document.getElementById(id);
          return !el.hidden && el.getClientRects().length > 0;
        };
        return {
          caption: document.getElementById("review-caption").textContent,
          left: ["review-image", "review-save", "review-hint", "review-series", "review-whole"].filter(shown),
        };
      });
      check(
        "revue : photo en échec après une bonne photo, sans l'image ni « Enregistrer » d'avant (B10)",
        failedShown && /échec injecté par la routine/.test(failedView.caption) && /ne reconnaît pas la cause\u202f; réessaie/.test(failedView.caption) && failedView.left.length === 0,
        `« ${failedView.caption.slice(0, 90)} » ; encore affichés : ${failedView.left.join(", ") || "rien"}`,
      );
      await page.click("#review-back");

      // Photo surexposée, puis sous-exposée (MES-06, MES-07). Réglages de départ : M, f/8, 1/4000 s, ISO 6400, soit
      // +0,5 IL (12,5 − 12). Les crans valent un tiers d'IL et la scène est à un demi-tiers : 3 IL exactement
      // n'existe pas. Vitesse à 1/640 s (8 crans) : +0,5 + 8/3 = +3,2 IL. Puis 1/4000 s et ISO 500 (11 crans) :
      // +0,5 − 11/3 = −3,2 IL.
      const shoot = async () => {
        await page.click("#shutter-button");
        await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden && document.getElementById("review-image").complete, null, { timeout: 300000 });
      };
      await clicks('[data-dial="shutter"][data-step="1"]', 8);
      await shoot();
      // La photo suivante s'ouvre en haut de l'écran de revue (constat INT-17 de l'audit, version 0.3.59). Sur le
      // profil iphone, avec la police de la CI (viseur de 238 px), « Infos » a fait défiler l'écran de revue de la
      // première photo de 36 px ; ce défilement était gardé, et la photo, sans hauteur tant qu'elle n'était pas
      // chargée, pouvait être poussée hors de l'écran par l'ancrage du défilement de Chromium : le contrôle « zones
      // écrêtées posées sur la photo », plus bas, lisait alors l'en-tête au centre de la photo (CI du 15 novembre
      // 2026). Sur les profils android et ordinateur, rien ne fait défiler l'écran de revue avant cette photo : ce
      // contrôle y réussit aussi sur le site d'avant la correction, il n'y distingue pas le défaut.
      const reopened = await page.evaluate(() => {
        const review = document.getElementById("review");
        return { scroll: review.scrollTop, top: document.getElementById("review-image").getBoundingClientRect().top - review.getBoundingClientRect().top };
      });
      check(
        "photo suivante : écran de revue ouvert en haut",
        reopened.scroll === 0 && reopened.top >= 0,
        `défilement ${reopened.scroll.toFixed(0)} px ; haut de la photo à ${reopened.top.toFixed(0)} px du haut de l'écran de revue`,
      );
      await page.click("#review-info");
      const over = await reviewInfo();
      check(
        "photo surexposée de 3,2 IL : part écrêtée supérieure à 0 dans le texte",
        over.exposure === "+3,2 IL" && over.share > 0 && over.histograms.length === 4 && over.histograms.every((h) => h.total === over.pixels),
        `exposition ${over.exposure} ; ${over.text}`,
      );
      await page.click("#review-info");
      const overZones = await reviewInfo();
      const zoneShare = (100 * overZones.zones.opaque) / overZones.pixels;
      check(
        "« Infos » encore une fois : zones écrêtées posées sur la photo",
        overZones.button === "Infos\u00a0: hautes lumières" && overZones.zones.shown && overZones.zones.opaque > 0 && Math.abs(zoneShare - overZones.share) < 0.06 && overZones.zones.gap <= 1 && overZones.touched === "review-image" && overZones.histograms.length === 0 && overZones.textVisible === true,
        `${overZones.zones.opaque} pixels en noir, soit ${zoneShare.toFixed(2)} % ; ${overZones.text} ; phrase ${overZones.textVisible ? "visible" : "cachée"} ; écart avec la photo ${overZones.zones.gap.toFixed(2)} px ; toucher au centre de la photo : ${overZones.touched}`,
      );
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-hautes-lumieres.png`), timeout: 120000 });
      // « Réduire les animations » (réglage du système, émulé par Playwright) : l'écran de revue écrit alors que les
      // zones sont en noir « sans clignoter », et le calque ne doit avoir aucune animation. Des versions 0.3.57 à
      // 0.3.61, la règle qui coupe l'animation était écrite avant celle du calque, qui l'emportait : les zones
      // clignotaient (relecture de la version 0.3.62). Le texte n'est écrit qu'au changement d'affichage : trois
      // touchers sur « Infos » ramènent à « hautes lumières » sous le réglage émulé. C'est l'état du calque qui est
      // lu, et non des captures d'écran : en rendu logiciel, deux captures à une seconde d'écart ne distinguent pas
      // le défaut de façon sûre. Le réglage est rendu ensuite, et le calque doit retrouver son animation ; le texte
      // reste celui du réglage émulé jusqu'à la photo suivante, qui le réécrit.
      const blinkState = () =>
        page.evaluate(() => {
          const overlay = document.getElementById("review-highlights");
          const style = getComputedStyle(overlay);
          const clipping = document.getElementById("review-clipping");
          return {
            asked: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            shown: !overlay.hidden && overlay.getClientRects().length > 0,
            animation: style.animationName,
            running: overlay.getAnimations().length,
            opacity: style.opacity,
            button: document.getElementById("review-info").textContent,
            text: !clipping.hidden && clipping.getClientRects().length > 0 ? clipping.textContent : "",
          };
        });
      const blinking = await blinkState();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await clicks("#review-info", 3);
      const still = await blinkState();
      await page.emulateMedia({ reducedMotion: null });
      const blinkingAgain = await blinkState();
      check(
        "« réduire les animations » : zones écrêtées en noir sans clignoter, comme l'écrit l'écran de revue",
        !blinking.asked && blinking.animation === "clignote" && blinking.running === 1 && /Ces zones clignotent en noir sur la photo\.$/.test(blinking.text) &&
          still.asked && still.shown && still.button === "Infos\u00a0: hautes lumières" && still.animation === "none" && still.running === 0 && still.opacity === "1" && /sans clignoter/.test(still.text) &&
          !blinkingAgain.asked && blinkingAgain.animation === "clignote" && blinkingAgain.running === 1,
        `sans le réglage : animation « ${blinking.animation} », ${blinking.running} en cours ; avec : « ${still.animation} », ${still.running} en cours, opacité ${still.opacity}, bouton « ${still.button} », « ${still.text.split(". ").pop()} » ; réglage rendu : « ${blinkingAgain.animation} », ${blinkingAgain.running} en cours`,
      );
      await page.click("#review-back");
      await clicks('[data-dial="shutter"][data-step="-1"]', 8);
      await clicks('[data-dial="iso"][data-step="-1"]', 11);
      // L'affichage « hautes lumières » est gardé pour la photo suivante : sans zone écrêtée, rien ne clignote.
      await shoot();
      const underZones = await reviewInfo();
      await page.click("#review-info");
      await page.click("#review-info");
      const under = await reviewInfo();
      const luminance = under.histograms.find((h) => h.channel === "luminance") ?? { left: 0, total: 0 };
      check(
        "photo sous-exposée de 3,2 IL : aucune zone écrêtée, luminance dans la moitié gauche",
        under.exposure === "−3,2 IL" && underZones.button === "Infos\u00a0: hautes lumières" && underZones.share === 0 && !underZones.zones.shown && under.share === 0 && luminance.left > under.pixels / 2 && luminance.total === under.pixels,
        `exposition ${under.exposure} ; hautes lumières : ${underZones.text} ; ${luminance.left} pixels sur ${under.pixels} dans la moitié gauche de la luminance`,
      );
      // Retour à « photo seule » et aux réglages de départ avant la suite.
      await page.click("#review-info");
      await page.click("#review-info");
      const infoOff = await reviewInfo();
      check(
        "revue : retour à « photo seule »",
        infoOff.button === "Infos\u00a0: photo seule" && infoOff.histograms.length === 0 && !infoOff.zones.shown && infoOff.text === "" && infoOff.saved === "photo",
        `bouton « ${infoOff.button} » ; tutophoto.revue : ${infoOff.saved}`,
      );
      await page.click("#review-back");
      await clicks('[data-dial="iso"][data-step="1"]', 11);
    }

    if (withPhoto) {
      // Défis (SIT-05, SIT-01), zone automatique avec détection des yeux : mise au point sur l'œil de Sophia, vers
      // 6,6 m. À f/8 et 50 mm, zone nette d'environ 4 m à 17 m : le groupe y est (SIT-05 réussi). À f/22, la distance
      // hyperfocale vaut 2500 / (22 × 0,02875) ≈ 4 m : mise au point à 6,6 m, la zone nette va jusqu'à l'infini et le
      // fond photo est net (SIT-01 à reprendre), quel que soit le cadrage (vertical sur le profil Android, où la
      // poubelle sort du cadre).
      const challengeShot = async (id, during = null) => {
        await page.click("#challenge-button");
        await page.check(`#challenge-dialog input[name="challenge"][value="${id}"]`);
        await page.click("#challenge-close");
        await page.click("#shutter-button");
        await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden && !document.getElementById("review-bulletin").hidden, null, { timeout: 300000 });
        const text = await page.evaluate(() => document.getElementById("review-bulletin").innerText);
        if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-defi-${id}.png`), timeout: 120000 });
        if (during) await during();
        await page.click("#review-back");
        return text;
      };
      await page.click("#af-button");
      await page.check('#af-dialog input[name="focusMode"][value="continuous"]');
      await page.check('#af-dialog input[name="areaMode"][value="auto"]');
      await page.check('#af-dialog input[name="detection"][value="faceEye"]');
      await page.click("#af-close");
      await page
        .waitForFunction(() => /^AF-C · Auto · œil · /.test(document.getElementById("af-badge").textContent), null, { timeout: 30000 })
        .catch(() => undefined);
      const group = await challengeShot("SIT-05");
      check("défi SIT-05 : groupe net, réussi", /Défi SIT-05 · Photo de groupe\u00a0: réussi/.test(group), group.split("\n").filter((l) => /Défi|Réussi|Manqué/.test(l)).join(" | "));
      await clicks('[data-dial="aperture"][data-step="1"]', 9);
      // Fiche ouverte depuis le bulletin, puis une autre fiche depuis un lien de la première (version 0.3.47).
      const ficheTitle = (prefix) =>
        page
          .waitForFunction((p) => document.getElementById("fiche-dialog").open && (document.getElementById("fiche-title")?.textContent ?? "").startsWith(p), prefix, { timeout: 30000 })
          .then(() => page.evaluate(() => ({ title: document.getElementById("fiche-title").textContent, banner: document.querySelectorAll("#fiche-body .banner").length })))
          .catch(() => ({ title: "", banner: 0 }));
      let fromBulletin = { title: "", banner: 0 };
      let fromLink = { title: "", banner: 0 };
      const portrait = await challengeShot("SIT-01", async () => {
        await page.click("#review-bulletin [data-fiche]");
        fromBulletin = await ficheTitle("NET-01");
        await page.click('#fiche-body a[href="SIT-01.html"]');
        fromLink = await ficheTitle("SIT-01");
        if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-fiche-fenetre.png`), timeout: 120000 });
        await page.click("#fiche-close");
      });
      check(
        "bulletin : fiche ouverte par-dessus le simulateur",
        fromBulletin.title.startsWith("NET-01") && fromBulletin.banner === (isReviewed("NET-01") ? 0 : 1) && fromLink.title.startsWith("SIT-01"),
        `${fromBulletin.title} (bandeau : ${fromBulletin.banner ? "oui" : "non"}) puis ${fromLink.title}`,
      );
      await clicks('[data-dial="aperture"][data-step="-1"]', 9);
      check(
        "défi SIT-01 à f/22 : fond encore net, à reprendre",
        /Défi SIT-01 · .*\u00a0: à reprendre/.test(portrait) && /Manqué\u00a0: fond derrière Sophia hors de la zone nette\u00a0: encore net\u00a0: .*le fond photo/.test(portrait) && /À revoir\u00a0: NET-01/.test(portrait),
        portrait.split("\n").filter((l) => /Défi|Réussi|Manqué|À revoir/.test(l)).join(" | "),
      );
      await page.click("#challenge-button");
      await page.check('#challenge-dialog input[name="challenge"][value="none"]');
      // Bouton « Fiche » de la fenêtre « Défis » : la fiche s'ouvre par-dessus, la fenêtre « Défis » reste derrière.
      await page.click('#challenge-dialog .fiche-open[data-fiche="SIT-05"]');
      const fromChallenges = await ficheTitle("SIT-05");
      await page.click("#fiche-close");
      const challengesOpen = await page.evaluate(() => document.getElementById("challenge-dialog").open);
      check("défis : fiche de la situation", fromChallenges.title.startsWith("SIT-05") && challengesOpen, `${fromChallenges.title} ; fenêtre « Défis » encore ouverte : ${challengesOpen ? "oui" : "non"}`);
      await page.click("#challenge-close");
      await page.click("#af-button");
      await page.check('#af-dialog input[name="focusMode"][value="single"]');
      await page.check('#af-dialog input[name="areaMode"][value="point"]');
      await page.click("#af-close");
    }

    // Mise au point. Le bas du cadre montre le sol, proche ; relever l'appareil y amène le sol lointain ou le
    // fond. Les personnages bougent : en AF-C, on attend que la distance change, au plus 15 s.
    const afText = () => page.evaluate(() => document.getElementById("af-badge").textContent);
    const lockedMetres = (text) => {
      const m = /(\d+[,.]\d) m/.exec(text);
      return m ? Number(m[1].replace(",", ".")) : NaN;
    };
    const setAf = async (mode, area, detection) => {
      await page.click("#af-button");
      await page.check(`#af-dialog input[name="focusMode"][value="${mode}"]`);
      await page.check(`#af-dialog input[name="areaMode"][value="${area}"]`);
      if (detection) await page.check(`#af-dialog input[name="detection"][value="${detection}"]`);
      await page.click("#af-close");
    };
    // Attend que l'indicateur corresponde au motif et renvoie ce texte-là ; null au bout du délai.
    const waitBadge = (pattern, timeout) =>
      page
        .waitForFunction(
          (source) => {
            const text = document.getElementById("af-badge").textContent;
            return new RegExp(source).test(text) ? text : null;
          },
          pattern.source,
          { timeout },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => null);
    // AF-S et point sélectif sont le dernier réglage que la routine a fait dans la fenêtre « Mise au point » : ce
    // contrôle prouve que la fenêtre remet ce mode, pas le réglage de départ, contrôlé après le chargement (INT-05).
    const startText = await afText();
    check("mise au point : retour à AF-S et point sélectif", /^AF-S · Point · /.test(startText), startText);

    // Zone automatique, vue de départ : le groupe est à environ 6,5 m.
    await setAf("continuous", "auto", "faceEye");
    const eyeText = (await waitBadge(/^AF-C · Auto · œil · \d+,\d m$/, 30000)) ?? (await afText());
    const eyeAt = lockedMetres(eyeText);
    const amber = await page.evaluate(() => document.getElementById("focus-marker").classList.contains("detected"));
    check("zone automatique : œil détecté dans le groupe", /œil/.test(eyeText) && amber && eyeAt > 5.5 && eyeAt < 7.5, `${eyeText}${amber ? ", repère ambre" : ""}`);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-zone-auto.png`), timeout: 120000 });
    await setAf("continuous", "auto", "off");
    const nearestText = (await waitBadge(/^AF-C · Auto · sujet le plus proche · /, 30000)) ?? (await afText());
    check(
      "zone automatique sans détection : sujet le plus proche",
      /sujet le plus proche/.test(nearestText) && lockedMetres(nearestText) < eyeAt,
      `${nearestText} ; œil : ${eyeText}`,
    );
    await setAf("continuous", "auto", "animal");
    // Le chien court entre x = −5 et 5 m, à 9 m de l'appareil, de profil.
    const dogText = await waitBadge(/^AF-C · Auto · (œil|visage) · /, 30000);
    const dogAt = dogText ? lockedMetres(dogText) : NaN;
    check("détection des animaux : œil ou visage du chien", Boolean(dogText) && dogAt > 8 && dogAt < 12, dogText ?? (await afText()));
    // À 1/4000 s, le chien (3,5 m/s à 9 m, 50 mm) laisse 50 × 3,5 × 0,00025 / 9 ≈ 0,005 mm, sous la limite,
    // soit 0,005 × 1500 / 35,9 ≈ 0,2 px sur la photo.
    const dogMotion = await balanceLine("balance-motion", /chien\u00a0: /);
    const dogPixels = /\((\d+(?:,\d)?) px sur la photo\)/.exec(dogMotion ?? "");
    check(
      "indicateur : traînée du chien évaluée, en pixels",
      /1\/4000 s · chien\u00a0: net/.test(dogMotion ?? "") && Boolean(dogPixels) && Number(dogPixels[1].replace(",", ".")) < 1,
      dogMotion ?? "chien non visé",
    );
    // Suivi du chien à découvert (FMA-23, version 0.3.66). L'appareil tourne vers la droite jusqu'à ce que le cadre
    // ne montre que la partie de la course du chien qu'aucun personnage ne cache (lacet de 0,55 à 0,7 rad, lu sur la
    // vue de dessus : au 50 mm, le bord gauche du cadre coupe la course du chien vers x ≈ 1,9 m à 0,55 rad et
    // x ≈ 2,7 m à 0,7 rad, et le groupe, à 6,5 m, ne le cache qu'en deçà de x ≈ 1,45 m). L'indicateur est noté à chaque changement, avec l'heure, pendant 60 s. Le chien y passe
    // en séries de lectures « œil » ou « visage », séparées par de longues séries « sujet le plus proche » quand il
    // est hors du cadre (environ 4,4 s d'horloge de la scène, contre 1,3 s dans le cadre). Une perte du chien à
    // découvert est une série « sujet le plus proche » entre deux séries « œil » ou « visage », plus courte que la
    // plus longue série « œil » ou « visage » : à cadence constante, une sortie du cadre dure plus de trois fois plus
    // longtemps. Mesuré hors de la routine (serveur de développement, rendu logiciel, environ 3,3 images par seconde,
    // même lacet de 0,6 rad) : avant la correction, 13 pertes en 57 s d'horloge de la scène, et le chien détecté sur
    // 46 des 86 images où son œil était à découvert et dans la zone couverte ; après, aucune perte en 60 s, 96 sur 96
    // (CHANGELOG.md, section 0.3.66). Le contrôle tolère une perte.
    // L'appareil est ramené ensuite à son lacet de départ.
    {
      const topClosed = !(await page.locator("#top-view-map").isVisible());
      if (topClosed) await page.click("#top-view-toggle");
      const readYaw = () =>
        page.evaluate(() => {
          const points = document.querySelector("#top-view-map .top-camera polygon")?.getAttribute("points");
          if (!points) return NaN;
          const [nose, left, right] = points.split(" ").map((point) => point.split(",").map(Number));
          return Math.atan2(nose[0] - (left[0] + right[0]) / 2, -(nose[1] - (left[1] + right[1]) / 2));
        });
      const box = await page.locator("#frame").boundingBox();
      // Glissés vers la droite (lacet croissant) ou vers la gauche, de longueur proportionnelle à l'écart qui reste
      // jusqu'au milieu de la fenêtre : 400 px par radian, au moins 8 px (au-delà du seuil d'un toucher, 6 px), au plus
      // 120 px. Un glissé de 120 px tourne l'appareil de 0,10 à 0,14 rad sur un écran de 1280 × 800 (contrôle d'après
      // la rafale) et de 0,30 rad sur un Pixel 7 émulé (mesuré hors de la routine) : à 400 px par radian, chaque glissé
      // reprend de 40 % à 100 % de l'écart, sans le dépasser.
      const turnTo = async (low, high) => {
        let current = await readYaw();
        for (let i = 0; i < 30 && Number.isFinite(current) && !(current >= low && current <= high); i++) {
          const error = (low + high) / 2 - current;
          const length = Math.min(120, Math.max(8, Math.round(Math.abs(error) * 400)));
          const step = Math.sign(error);
          // Départ au centre du cadre, comme le glissé du contrôle d'après la rafale : sur le profil Android, un départ à
          // 60 px à droite du centre tombe sur la carte de la vue de dessus, dépliée pour lire le lacet, et le glissé ne
          // tourne pas l'appareil (CI du commit a3df28e ; vérifié hors de la routine sur un Pixel 7 émulé).
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          await page.mouse.move(cx, cy);
          await page.mouse.down();
          for (let k = 1; k <= 6; k++) await page.mouse.move(cx + (step * length * k) / 6, cy);
          await page.mouse.up();
          // La caméra tourne image par image (inertie, éteinte en une seconde environ) et la vue de dessus se
          // redessine toutes les 250 ms : relire toutes les 600 ms jusqu'à deux lectures égales.
          let previous = NaN;
          for (let k = 0; k < 20 && !(Math.abs(current - previous) < 1e-4); k++) {
            await page.waitForTimeout(600);
            previous = current;
            current = await readYaw();
          }
        }
        return current;
      };
      const yawStart = await readYaw();
      const yawDog = await turnTo(0.55, 0.7);
      await page.evaluate(() => {
        window.routineBadges = [];
        const badge = document.getElementById("af-badge");
        const note = () => window.routineBadges.push({ at: performance.now(), text: badge.textContent });
        note();
        window.routineBadgeObserver = new MutationObserver(note);
        window.routineBadgeObserver.observe(badge, { childList: true, characterData: true, subtree: true });
      });
      await page.waitForTimeout(60000);
      const badges = await page.evaluate(() => {
        window.routineBadgeObserver.disconnect();
        return window.routineBadges;
      });
      // Séries : [vu, durée en ms], la dernière, en cours, exclue.
      const runs = [];
      for (let i = 0; i + 1 < badges.length; i++) {
        const seen = /· (œil|visage) ·/.test(badges[i].text);
        const duration = badges[i + 1].at - badges[i].at;
        if (runs.length && runs[runs.length - 1][0] === seen) runs[runs.length - 1][1] += duration;
        else runs.push([seen, duration]);
      }
      const longestSeen = Math.max(0, ...runs.filter((r) => r[0]).map((r) => r[1]));
      const passes = runs.filter((r) => r[0]).length;
      const losses = runs.filter((r, i) => !r[0] && i > 0 && i + 1 < runs.length && r[1] < longestSeen).length;
      // Garde contre un faux vert : un chien vu un instant à l'entrée de chaque passage, puis perdu jusqu'à la sortie,
      // ne compte aucune perte. Dans le cadre pendant environ 1,7 s d'horloge sur un aller-retour de 5,7 s, il doit être
      // vu, dans la plus longue série, au moins 0,15 fois la plus longue série « perdu » (environ 0,4 attendu).
      const longestLost = Math.max(0, ...runs.filter((r) => !r[0]).map((r) => r[1]));
      const yawBack = await turnTo(yawStart - 0.03, yawStart + 0.03);
      if (topClosed) await page.click("#top-view-toggle");
      check(
        "détection des animaux : le chien à découvert n'est pas lâché (FMA-23)",
        yawDog >= 0.55 && yawDog <= 0.7 && passes >= 2 && losses <= 1 && longestSeen >= 0.15 * longestLost && Math.abs(yawBack - yawStart) <= 0.03,
        `lacet ${yawDog.toFixed(3)} rad ; ${passes} série(s) « œil » ou « visage », la plus longue de ${(longestSeen / 1000).toFixed(1)} s (plus longue série « perdu » : ${(longestLost / 1000).toFixed(1)} s) ; ${losses} perte(s) à découvert ; séries : ${runs.map((r) => `${r[0] ? "vu" : "perdu"} ${(r[1] / 1000).toFixed(1)} s`).join(", ")} ; lacet ramené à ${yawBack.toFixed(3)} rad (départ ${yawStart.toFixed(3)})`,
      );
    }
    await setAf("continuous", "auto", "faceEye");
    await setAf("single", "point");
    const frameBox = await page.locator("#frame").boundingBox();
    const tapLow = async (previous) => {
      await page.mouse.click(frameBox.x + frameBox.width / 2, frameBox.y + 0.92 * frameBox.height);
      await page
        .waitForFunction(
          (before) => {
            const text = document.getElementById("af-badge").textContent;
            return document.getElementById("focus-marker").classList.contains("locked") && text !== before;
          },
          previous,
          { timeout: 30000 },
        )
        .catch(() => undefined);
      return afText();
    };
    const pointText = await tapLow(startText);
    const pointAt = lockedMetres(pointText);
    check("AF-S : toucher le viseur verrouille la distance", /^AF-S · Point · verrouillée à /.test(pointText), pointText);
    await setAf("single", "wideL");
    const lockedText = await tapLow(await afText());
    const lockedAt = lockedMetres(lockedText);
    check(
      "zone large (L) : sujet le plus proche de la zone",
      /^AF-S · Zone L · verrouillée à /.test(lockedText) && lockedAt < pointAt - 0.1,
      `${lockedText} ; point sélectif : ${pointText}`,
    );
    const cx = frameBox.x + frameBox.width / 2;
    const cy = frameBox.y + frameBox.height / 2;
    for (let k = 0; k < 2; k++) {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(cx, cy - 15 * i);
      await page.mouse.up();
    }
    await page.waitForTimeout(2500);
    const tiltedText = await afText();
    check("AF-S : distance gardée en relevant l'appareil", tiltedText === lockedText, tiltedText);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-af-s.png`), timeout: 120000 });
    // Orientation de l'appareil, lue sur la vue de dessus (triangle de l'appareil, ui/topView.ts) : pour les deux
    // contrôles du viseur et du calcul d'une photo (COD-01, version 0.3.63), plus bas.
    const yaw = () =>
      page.evaluate(() => {
        const points = document.querySelector("#top-view-map .top-camera polygon")?.getAttribute("points");
        if (!points) return NaN;
        const [nose, left, right] = points.split(" ").map((point) => point.split(",").map(Number));
        return Math.atan2(nose[0] - (left[0] + right[0]) / 2, -(nose[1] - (left[1] + right[1]) / 2));
      });
    if (withPhoto) {
      // Glissé sur le viseur pendant le calcul de cette photo (COD-01, version 0.3.63). Pendant le calcul, la caméra
      // n'a plus de commandes ; à la reprise, elles sont rattachées sans rien de ce que le geste a pu accumuler, et un
      // bouton resté enfoncé ne la tourne plus tant qu'il n'est pas relâché puis enfoncé de nouveau. Le pointeur est
      // enfoncé au centre du viseur une fois le calcul commencé, déplacé vers la gauche (2 px toutes les 100 ms, 100 px
      // au plus), puis, l'écran de revue ouvert, cinq fois de 8 px encore, bouton tenu, avant d'être relâché.
      // L'orientation de l'appareil est lue sur la vue de dessus, dépliée le temps du contrôle sur les petits écrans.
      // Avant la correction, la caméra, qui avait capturé le pointeur à l'appui, tournait avec ces derniers
      // déplacements, même sous l'écran de revue : le contrôle échoue sur ce site-là. Il réussit aussi quand les
      // commandes ne sont jamais rattachées après le calcul : le contrôle d'après la rafale, plus bas, le voit et le
      // nomme ; sur une copie sans le rattachement, « AF-C : la distance suit la zone » échoue aussi, sans nommer la
      // cause (l'appareil relevé plus haut ne tourne plus, ce relevé venant après les premières photos de la routine).
      // Il ne voit pas la surimpression dans la photo elle-même (rendus de la photo sans mise à jour de la caméra) :
      // il faudrait lire la caméra à chaque rendu, ce que le site construit n'expose pas.
      if (topCollapsed) await page.click("#top-view-toggle");
      const yawBefore = await yaw();
      await page.evaluate(() => {
        window.routinePress = null;
        document.getElementById("scene").addEventListener("pointerdown", () => (window.routinePress = !document.getElementById("progress").hidden), { once: true });
      });
      await page.click("#shutter-button");
      await page.waitForFunction(() => !document.getElementById("progress").hidden, null, { polling: 20, timeout: 60000 });
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      const reviewOpen = () => page.evaluate(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden);
      let dragged = 0;
      for (let i = 0; i < 3000 && !(await reviewOpen()); i++) {
        if (dragged < 100) {
          dragged += 2;
          await page.mouse.move(cx - dragged, cy);
        }
        await page.waitForTimeout(100);
      }
      const duringCompute = dragged;
      for (let i = 0; i < 5; i++) {
        dragged += 8;
        await page.mouse.move(cx - dragged, cy);
      }
      await page.mouse.up();
      const caption = await page.evaluate(() => document.getElementById("review-caption").textContent);
      const m = /AF-S · Zone L · mise au point verrouillée à (\d+[,.]\d) m/.exec(caption);
      check("AF-S : la photo garde la distance verrouillée", Boolean(m) && Number(m[1].replace(",", ".")) === lockedAt, caption);
      await page.click("#review-back");
      await page.waitForTimeout(1500);
      const yawAfter = await yaw();
      if (topCollapsed) await page.click("#top-view-toggle");
      const pressed = await page.evaluate(() => window.routinePress);
      check(
        "photo : glissé sur le viseur pendant le calcul, viseur inchangé à la reprise (COD-01)",
        pressed === true && Number.isFinite(yawBefore) && Math.abs(yawAfter - yawBefore) < 1e-4,
        `pointeur enfoncé sur le viseur ${pressed === true ? "pendant le calcul" : pressed === false ? "après le calcul" : "jamais (appui non reçu)"}, déplacé de ${duringCompute} px pendant le calcul et de ${dragged - duringCompute} px l'écran de revue ouvert ; orientation de l'appareil (vue de dessus) : ${yawBefore.toFixed(5)} rad avant, ${yawAfter.toFixed(5)} rad après, écart de ${(yawAfter - yawBefore).toFixed(5)} rad`,
      );
    }
    await setAf("continuous", "wideL");
    const followed = await page
      .waitForFunction(
        (locked) => {
          const text = document.getElementById("af-badge").textContent;
          const m = /^AF-C · Zone L · (\d+[,.]\d) m/.exec(text);
          // Seuil de 0,2 m (deux pas d'affichage). Depuis la version 0.3.34, la zone large est rognée à la zone couverte
          // par l'autofocus : la distance verrouillée vaut 5,8 m au lieu de 5,4 m, et l'écart avec la mesure en AF-C
          // après avoir relevé l'appareil (6,2 à 6,5 m dans les routines) n'est plus que de 0,5 à 0,7 m.
          return Boolean(m) && Math.abs(Number(m[1].replace(",", ".")) - locked) > 0.2;
        },
        lockedAt,
        { timeout: 15000 },
      )
      .then(() => true)
      .catch(() => false);
    check("AF-C : la distance suit la zone", followed, `${await afText()} ; avant : ${lockedText}`);

    // Collimateurs (MAP-06) : la couverture de l'AF du Z 6 est d'environ 90 % du cadre en largeur et en
    // hauteur. Un toucher dans le coin haut droit du cadre (l'indicateur d'équilibre occupe le coin haut gauche)
    // ramène le point au bord de la zone couverte, à 5 % des bords.
    await setAf("continuous", "point");
    // Le cadre est mesuré ici, pas repris de plus haut : sa taille peut changer avec le mode AF. Sur le profil
    // iPhone, avec une police plus large que celle de la machine de Claude (DejaVu Sans, celle de la CI), l'aide
    // de la mise au point prend une ligne de plus en AF-S et le viseur perd 16 pixels de haut ; le cadre mesuré en
    // AF-S donnait alors « repère à 98,0 % × 5,3 %, zone couverte 96,1 % × 96,0 % » (premier passage de la routine
    // dans la CI, 12 novembre 2026, reproduit ensuite avec cette police).
    await page.waitForTimeout(500);
    const pointBox = await page.locator("#frame").boundingBox();
    await page.mouse.click(pointBox.x + 0.99 * pointBox.width, pointBox.y + 0.01 * pointBox.height);
    await page.waitForTimeout(500);
    const coverage = await page.locator("#af-coverage").boundingBox();
    const marker = await page.locator("#focus-marker").boundingBox();
    const at = (box) => ({
      x: (box.x + box.width / 2 - pointBox.x) / pointBox.width,
      y: (box.y + box.height / 2 - pointBox.y) / pointBox.height,
    });
    const markerAt = marker ? at(marker) : { x: NaN, y: NaN };
    const coverageShare = coverage ? { x: coverage.width / pointBox.width, y: coverage.height / pointBox.height } : { x: NaN, y: NaN };
    check(
      "collimateurs : point ramené dans la zone couverte (90 %)",
      Math.abs(markerAt.x - 0.95) < 0.01 && Math.abs(markerAt.y - 0.05) < 0.01 && Math.abs(coverageShare.x - 0.9) < 0.01 && Math.abs(coverageShare.y - 0.9) < 0.01,
      `repère à ${(markerAt.x * 100).toFixed(1)} % × ${(markerAt.y * 100).toFixed(1)} % du cadre ; zone couverte ${(coverageShare.x * 100).toFixed(1)} % × ${(coverageShare.y * 100).toFixed(1)} %`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-collimateurs.png`), timeout: 120000 });
    // Couverture par boîtier : un toucher en (99 % ; 1 %) du cadre est ramené au bord de la zone couverte. En cadre
    // vertical (profil Android), grand et petit côtés du capteur sont échangés.
    // Un boîtier par marque depuis la version 0.3.80 : la fenêtre n'a plus de choix du format.
    const setBody = async (brand) => {
      await page.click("#body-button");
      await page.check(`#body-dialog input[name="brand"][value="${brand}"]`);
      await page.click("#body-close");
    };
    const checkBodyCoverage = async (brand, label, long, short) => {
      await setBody(brand);
      const box = await page.locator("#frame").boundingBox();
      await page.mouse.click(box.x + 0.99 * box.width, box.y + 0.01 * box.height);
      await page.waitForTimeout(500);
      const zone = await page.locator("#af-coverage").boundingBox();
      const mark = await page.locator("#focus-marker").boundingBox();
      const got = mark
        ? { x: (mark.x + mark.width / 2 - box.x) / box.width, y: (mark.y + mark.height / 2 - box.y) / box.height }
        : { x: NaN, y: NaN };
      const share = zone ? { x: zone.width / box.width, y: zone.height / box.height } : { x: NaN, y: NaN };
      const vertical = box.height > box.width;
      const w = vertical ? short : long;
      const h = vertical ? long : short;
      const expected = { x: Math.min(0.99, 1 - (1 - w) / 2), y: Math.max(0.01, (1 - h) / 2), w, h };
      check(
        label,
        Math.abs(got.x - expected.x) < 0.01 && Math.abs(got.y - expected.y) < 0.01 && Math.abs(share.x - expected.w) < 0.01 && Math.abs(share.y - expected.h) < 0.01,
        `cadre ${vertical ? "vertical" : "horizontal"} ; repère à ${(got.x * 100).toFixed(1)} % × ${(got.y * 100).toFixed(1)} % ; zone couverte ${(share.x * 100).toFixed(1)} % × ${(share.y * 100).toFixed(1)} %`,
      );
    };
    // Canon EOS R50 : « Positions sélectionnables pour le collimateur AF », « Horizontal : environ 90 %, vertical :
    // environ 100 % » (manuel en français, « Caractéristiques techniques »).
    await checkBodyCoverage("canon", "collimateurs : couverture du Canon EOS R50 (90 % × 100 %)", 0.9, 1);
    // EOS R50 en zone automatique : « sélection automatique », « Horizontal : environ 100 %, vertical : environ
    // 100 % » (même page). La zone tracée suit le mode de zone : 100 % × 100 % en zone automatique, puis de nouveau
    // 90 % × 100 % en point sélectif, sans autre geste que le changement de mode (version 0.3.80). Le point la suit
    // aussi : en zone automatique sans détection, un toucher en (99 % ; 1 %) reste où il est touché (« point
    // touché ») ; revenu en point sélectif, il est ramené dans la zone, à 95 % × 1 % en cadre horizontal et 99 % × 5 %
    // en cadre vertical (relecture de la version 0.3.80, constat C2). La détection est ensuite remise à « faceEye »,
    // celle d'avant ce passage.
    const coverageShareNow = async () => {
      const box = await page.locator("#frame").boundingBox();
      const zone = await page.locator("#af-coverage").boundingBox();
      return {
        vertical: box.height > box.width,
        x: zone ? zone.width / box.width : NaN,
        y: zone ? zone.height / box.height : NaN,
      };
    };
    const markerShareNow = async () => {
      const box = await page.locator("#frame").boundingBox();
      const mark = await page.locator("#focus-marker").boundingBox();
      return mark
        ? { x: (mark.x + mark.width / 2 - box.x) / box.width, y: (mark.y + mark.height / 2 - box.y) / box.height }
        : { x: NaN, y: NaN };
    };
    await setAf("continuous", "auto", "off");
    await page.waitForTimeout(500);
    const autoShare = await coverageShareNow();
    check(
      "collimateurs : couverture du Canon EOS R50 en zone automatique (100 % × 100 %)",
      Math.abs(autoShare.x - 1) < 0.01 && Math.abs(autoShare.y - 1) < 0.01,
      `cadre ${autoShare.vertical ? "vertical" : "horizontal"} ; zone couverte ${(autoShare.x * 100).toFixed(1)} % × ${(autoShare.y * 100).toFixed(1)} %`,
    );
    const autoBox = await page.locator("#frame").boundingBox();
    await page.mouse.click(autoBox.x + 0.99 * autoBox.width, autoBox.y + 0.01 * autoBox.height);
    const autoTouched = await waitBadge(/point touché/, 30000);
    await page.waitForTimeout(500);
    const autoMark = await markerShareNow();
    check(
      "collimateurs : Canon EOS R50 en zone automatique, toucher gardé à 99 % × 1 %",
      autoTouched !== null && Math.abs(autoMark.x - 0.99) < 0.01 && Math.abs(autoMark.y - 0.01) < 0.01,
      `${autoTouched ?? await afText()} ; repère à ${(autoMark.x * 100).toFixed(1)} % × ${(autoMark.y * 100).toFixed(1)} %`,
    );
    await setAf("continuous", "point");
    await page.waitForTimeout(500);
    const pointShare = await coverageShareNow();
    const pointMark = await markerShareNow();
    const pointW = pointShare.vertical ? 1 : 0.9;
    const pointH = pointShare.vertical ? 0.9 : 1;
    const pointBack = pointShare.vertical ? { x: 0.99, y: 0.05 } : { x: 0.95, y: 0.01 };
    check(
      "collimateurs : Canon EOS R50 revenu en point sélectif (90 % × 100 %), point ramené dans la zone",
      Math.abs(pointShare.x - pointW) < 0.01 && Math.abs(pointShare.y - pointH) < 0.01 && Math.abs(pointMark.x - pointBack.x) < 0.01 && Math.abs(pointMark.y - pointBack.y) < 0.01,
      `cadre ${pointShare.vertical ? "vertical" : "horizontal"} ; zone couverte ${(pointShare.x * 100).toFixed(1)} % × ${(pointShare.y * 100).toFixed(1)} % ; repère à ${(pointMark.x * 100).toFixed(1)} % × ${(pointMark.y * 100).toFixed(1)} %`,
    );
    await setAf("continuous", "auto", "faceEye");
    await setAf("continuous", "point");
    // Sony A6000 : « 179 phase detection points (covering almost the entire image) », sans pourcentage (page de
    // Sony) : il garde la couverture du Z 6.
    await checkBodyCoverage("sony", "collimateurs : couverture du Sony A6000 (celle du Z 6, 90 % × 90 %)", 0.9, 0.9);
    await setBody("nikon");
    const centreBox = await page.locator("#frame").boundingBox();
    await page.mouse.click(centreBox.x + centreBox.width / 2, centreBox.y + centreBox.height / 2);

    if (withPhoto) {
      // Rafale : Continu L à 5 vues par seconde. En rendu logiciel, l'horloge de la scène avance moins vite que
      // le temps réel (100 ms au plus par image) : le déclencheur est relâché quand le bouton annonce au moins
      // deux vues, et non au bout d'une durée fixe (une seconde ne suffisait pas sur les profils mobiles).
      await page.click("#release-button");
      await page.check('#release-dialog input[name="release"][value="cl"]');
      await page.selectOption('#release-dialog select[name="clRate"]', "5");
      await page.click("#release-close");
      const shutterBox = await page.locator("#shutter-button").boundingBox();
      await page.mouse.move(shutterBox.x + shutterBox.width / 2, shutterBox.y + shutterBox.height / 2);
      await page.mouse.down();
      await page.waitForFunction(() => /Rafale\u00a0: ([2-9]|\d\d) vues/.test(document.getElementById("shutter-button").textContent), null, { timeout: 60000 });
      await page.mouse.up();
      await page.waitForFunction(() => !document.getElementById("review").hidden && !document.getElementById("review-series").hidden, null, { timeout: 300000 });
      const first = await page.evaluate(() => ({ count: document.getElementById("review-count").textContent, caption: document.getElementById("review-caption").textContent }));
      await page.click("#review-next");
      const second = await page.evaluate(() => document.getElementById("review-caption").textContent);
      check(
        "rafale : série de vues espacées de 0,2 s",
        /^Vue 1\/[2-9]\d* · \+0,00 s · /.test(first.caption) && /^Vue 2\/\d+ · \+0,20 s · /.test(second),
        `${first.count} ; ${first.caption.slice(0, 60)} | ${second.slice(0, 60)}`,
      );
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-rafale.png`), timeout: 120000 });
      await page.click("#review-back");
      await page.click("#release-button");
      await page.check('#release-dialog input[name="release"][value="single"]');
      await page.click("#release-close");
      // Viseur de nouveau commandé après les calculs (relecture de la version 0.3.63, constat C-2) : après la rafale,
      // plusieurs calculs de suite, un glissé de 120 px sur le viseur, bouton relâché, doit tourner l'appareil de plus
      // de 0,01 rad, lu sur la vue de dessus (dépliée le temps du contrôle sur les petits écrans). Mesuré hors de la
      // routine, sur un écran de 1280 × 800 : de 0,10 à 0,14 rad avec les commandes rattachées à la fin du calcul,
      // 0 sur une copie qui ne les rattache pas, sur laquelle le contrôle du glissé pendant le calcul réussit.
      // L'orientation est relue toutes les 250 ms, 10 s au plus : la caméra tourne image par image (inertie).
      const dragBox = await page.locator("#frame").boundingBox();
      const dx = dragBox.x + dragBox.width / 2;
      const dy = dragBox.y + dragBox.height / 2;
      if (topCollapsed) await page.click("#top-view-toggle");
      const yawRest = await yaw();
      await page.mouse.move(dx, dy);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(dx + 12 * i, dy);
      await page.mouse.up();
      let yawDragged = yawRest;
      for (let i = 0; i < 40 && !(Math.abs(yawDragged - yawRest) > 0.01); i++) {
        await page.waitForTimeout(250);
        yawDragged = await yaw();
      }
      if (topCollapsed) await page.click("#top-view-toggle");
      check(
        "après la rafale : un glissé sur le viseur tourne l'appareil (commandes rattachées après le calcul)",
        Number.isFinite(yawRest) && Math.abs(yawDragged - yawRest) > 0.01,
        `glissé de 120 px sur le viseur ; orientation de l'appareil (vue de dessus) : ${yawRest.toFixed(5)} rad avant, ${yawDragged.toFixed(5)} rad après, écart de ${(yawDragged - yawRest).toFixed(5)} rad`,
      );
    }
    // Défi choisi depuis la fiche d'une situation : simulateur?defi=SIT-06 (version 0.3.47), ici sans la barre finale
    // de simulateur/ : le serveur de la routine ne redirige pas, la page doit ajouter la barre elle-même (0.3.51).
    // Pendant le chargement, la progression s'affiche en Mio reçus.
    // Le texte est rendu par le contrôle d'attente lui-même : le relire ensuite par un second appel laissait le temps
    // au chargement de finir et au message de se vider (échec isolé du 11 novembre 2026 sur la machine de Claude,
    // puis dans la CI le 12, les deux fois sur le profil webgl1, texte lu vide). Si l'attente échoue, sa raison est
    // gardée.
    // La ligne de diagnostic est relue juste avant ce rechargement, qui l'efface : elle garde ce que la page a signalé
    // pendant tout le parcours du simulateur (INT-06 de l'audit, version 0.3.64) ; puis une fois encore à la fin.
    // Mémoire des réglages (magasin de réglages, constat ARC-02 de l'audit, version 0.4.9) : des réglages mémorisés,
    // changés ici dans les fenêtres, par le code de la page (un clic de Playwright prend plusieurs secondes en rendu
    // logiciel), doivent être relus au chargement qui suit. Choisis pour ne rien coûter au rendu de la suite : AF-S, bruit
    // et profondeur de champ du viseur coupés. Le relevé des fenêtres et des boutons, avant et après, doit être le même.
    const memoryState = () =>
      page.evaluate(() => ({
        storage: Object.fromEntries(["tutophoto.boitier", "tutophoto.apercu", "tutophoto.revue"].map((key) => [key, localStorage.getItem(key)])),
        inputs: [
          ...document.querySelectorAll(
            "#exposure-dialog input, #exposure-dialog select, #release-dialog input, #release-dialog select, #af-dialog input, #body-dialog input, #preview-dialog input",
          ),
        ]
          .map((e) => `${e.name}=${e.type === "radio" || e.type === "checkbox" ? (e.checked ? e.value : "") : e.value}`)
          .filter((text) => !text.endsWith("="))
          .join(" "),
        buttons: ["body-button", "af-button", "release-button", "review-info"].map((id) => document.getElementById(id)?.textContent ?? "").join(" | "),
      }));
    await page.evaluate(() => {
      const radio = (dialog, name, value) => document.querySelector(`#${dialog} input[name=${name}][value=${value}]`).click();
      const choose = (dialog, name, value) => {
        const select = document.querySelector(`#${dialog} select[name=${name}]`);
        select.value = value;
        select.dispatchEvent(new Event("change"));
      };
      const tick = (selector, checked) => {
        const box = document.querySelector(selector);
        if (box.checked !== checked) box.click();
      };
      radio("body-dialog", "brand", "sony");
      radio("exposure-dialog", "exposureMode", "A");
      choose("exposure-dialog", "compensation", "2");
      // Plafond et vitesse minimale avant de couper l'ISO auto, qui grise leurs listes.
      tick("#exposure-dialog input[name=autoIso]", true);
      choose("exposure-dialog", "maxIso", "12");
      choose("exposure-dialog", "minShutter", "33");
      tick("#exposure-dialog input[name=autoIso]", false);
      radio("release-dialog", "release", "cl");
      choose("release-dialog", "clRate", "4");
      choose("release-dialog", "timerDelay", "5");
      radio("af-dialog", "focusMode", "single");
      // La détection ne se choisit qu'en zone automatique.
      radio("af-dialog", "areaMode", "auto");
      radio("af-dialog", "detection", "animal");
      radio("af-dialog", "areaMode", "wideL");
      tick("#preview-dialog input[type=checkbox][value=all]", true);
      tick("#preview-dialog input[type=checkbox][value=noise]", false);
      tick("#preview-dialog input[type=checkbox][value=depthOfField]", false);
      radio("preview-dialog", "grid", "thirds");
      for (let i = 0; i < 3 && JSON.parse(localStorage.getItem("tutophoto.revue") ?? "null")?.display !== "histograms"; i++) {
        document.getElementById("review-info").click();
      }
    });
    const memoryBefore = await memoryState();
    // Écritures dans les trois clés pendant le chargement qui suit, comptées par un script posé avant lui (il vaut pour les
    // pages suivantes de l'onglet, sans rien changer d'autre). Comparer les chaînes avant et après ne suffisait pas : une
    // écriture des mêmes réglages redonne les mêmes chaînes (relecture de la version 0.4.9, R1).
    await page.addInitScript(() => {
      const setItem = Storage.prototype.setItem;
      window.__tutophotoMemoryWrites = [];
      Storage.prototype.setItem = function (key, value) {
        if (["tutophoto.boitier", "tutophoto.apercu", "tutophoto.revue"].includes(String(key))) window.__tutophotoMemoryWrites.push(String(key));
        return setItem.call(this, key, value);
      };
    });
    const problemBeforeReload = await diagnosticText();
    await page.goto(`${base}/simulateur?defi=SIT-06`);
    const progress = await page
      .waitForFunction(() => {
        const text = document.getElementById("status")?.textContent ?? "";
        return /Mio reçus|préparation/.test(text) ? text : false;
      }, null, { timeout: 60000 })
      .then((handle) => handle.jsonValue())
      .catch((error) => `attente échouée : ${String(error).split("\n")[0]}`);
    await page.waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 }).catch(() => undefined);
    const chosen = await page.evaluate(() => ({ text: document.getElementById("challenge-button").textContent, path: location.pathname, search: location.search }));
    check(
      "adresse sans barre finale, défi choisi par l'adresse, progression du chargement",
      /SIT-06$/.test(chosen.text) && chosen.path === "/simulateur/" && /Mio reçus|préparation/.test(progress) && !/^attente échouée/.test(progress),
      `${chosen.path} ; ${chosen.text} ; pendant le chargement : « ${progress} »`,
    );
    {
      const memoryAfter = await memoryState();
      const memoryWrites = await page.evaluate(() => window.__tutophotoMemoryWrites ?? null);
      const saved = (key) => {
        try {
          return JSON.parse(memoryBefore.storage[key] ?? "null") ?? {};
        } catch {
          return {};
        }
      };
      const box = saved("tutophoto.boitier");
      const preview = saved("tutophoto.apercu");
      const fields = [
        Object.keys(box).join(","),
        Object.keys(preview).join(","),
        Object.keys(saved("tutophoto.revue")).join(","),
      ];
      const written =
        fields[0] === "brand,focusMode,areaMode,detection,release,clRate,timerDelay,exposureMode,compensation,autoIso,maxIso,minShutter" &&
        fields[1] === "all,brightness,noise,depthOfField,balance,grid" &&
        fields[2] === "display" &&
        JSON.stringify([box.brand, box.focusMode, box.areaMode, box.detection, box.release, box.clRate, box.timerDelay]) ===
          JSON.stringify(["sony", "single", "wideL", "animal", "cl", 4, 5]) &&
        JSON.stringify([box.exposureMode, box.compensation, box.autoIso, box.maxIso, box.minShutter]) === JSON.stringify(["A", 2, false, 12, 33]) &&
        JSON.stringify([preview.all, preview.noise, preview.depthOfField, preview.grid]) === JSON.stringify([true, false, false, "thirds"]) &&
        saved("tutophoto.revue").display === "histograms";
      check(
        "mémoire des réglages : écrite avec les champs d'avant le magasin, relue au chargement, pas récrite (ARC-02)",
        written &&
          Array.isArray(memoryWrites) &&
          memoryWrites.length === 0 &&
          JSON.stringify(memoryAfter.storage) === JSON.stringify(memoryBefore.storage) &&
          memoryAfter.inputs === memoryBefore.inputs &&
          memoryAfter.buttons === memoryBefore.buttons &&
          /^Sony A6000 \| AF-S · Zone L \| Continu L · 4 vps/.test(memoryAfter.buttons),
        `champs : ${fields.join(" ; ")} ; boutons avant : ${memoryBefore.buttons} ; après : ${memoryAfter.buttons} ; fenêtres ${memoryAfter.inputs === memoryBefore.inputs ? "identiques" : `avant : ${memoryBefore.inputs} ; après : ${memoryAfter.inputs}`} ; écritures pendant le chargement : ${memoryWrites === null ? "non comptées" : memoryWrites.join(", ") || "aucune"} ; mémoire ${JSON.stringify(memoryAfter.storage) === JSON.stringify(memoryBefore.storage) ? "inchangée" : `changée : ${JSON.stringify(memoryAfter.storage)}`}`,
      );
    }
    // Le paramètre ?defi= est retiré de l'adresse une fois lu et mémorisé (constat COD-03 de l'audit, version 0.3.72).
    check(
      "défi de l'adresse : mémorisé, puis retiré de l'adresse",
      chosen.search === "" && (await page.evaluate(() => localStorage.getItem("tutophoto.defi"))) === "SIT-06",
      `adresse après le chargement : ${chosen.path}${chosen.search || " (sans paramètre)"} ; tutophoto.defi : ${await page.evaluate(() => localStorage.getItem("tutophoto.defi"))}`,
    );
    // Progression du chargement (version 0.3.55) : tout fichier compté par la progression (ceux du manifeste, sauf
    // les textes de licence) doit avoir été chargé par la scène, sinon elle n'atteint jamais « préparation ».
    await page.waitForTimeout(1500);
    const counted = await page.evaluate(async () => {
      const manifest = await (await fetch("../scenes/parc/scene.json")).json();
      const files = manifest.assets.flatMap((asset) => asset.files ?? []).filter((f) => !f.path.endsWith(".txt"));
      const loaded = performance.getEntriesByType("resource").map((e) => decodeURIComponent(new URL(e.name).pathname));
      return { count: files.length, missing: files.filter((f) => !loaded.some((name) => name.endsWith(`/scenes/parc/${f.path}`))).map((f) => f.path) };
    });
    check(
      "progression du chargement : tous les fichiers comptés sont chargés par la scène",
      counted.count > 0 && counted.missing.length === 0,
      `${counted.count} fichiers comptés ; jamais chargés : ${counted.missing.join(", ") || "aucun"}`,
    );
    // Seconde lecture de la ligne de diagnostic, même critère que « aucun problème affiché » au chargement.
    const problemAtEnd = await diagnosticText();
    check(
      "aucun problème affiché à la fin du parcours",
      !problemBeforeReload && !problemAtEnd,
      `avant le rechargement : ${problemBeforeReload ? `« ${problemBeforeReload} »` : "ligne vide"} ; à la fin, page rechargée pour le défi SIT-06 : ${problemAtEnd ? `« ${problemAtEnd} »` : "ligne vide"}`,
    );
    // Chemin de la contre-vérification de COD-03 : arrivée par ?defi=SIT-06, « Aucun défi » choisi dans la fenêtre,
    // puis rechargement. Avant la version 0.3.72, le défi de l'adresse revenait et écrasait le choix mémorisé.
    // Placé après les contrôles qui lisent la page chargée : le rechargement n'attend que le texte du bouton
    // « Défis », écrit au démarrage, pas la fin du chargement de la scène.
    await page.click("#challenge-button");
    await page.check('#challenge-dialog input[name="challenge"][value="none"]');
    await page.click("#challenge-close");
    await page.reload();
    await page.waitForFunction(() => (document.getElementById("challenge-button")?.textContent ?? "") !== "", null, { timeout: 60000 }).catch(() => undefined);
    const afterReload = await page.evaluate(() => ({
      text: document.getElementById("challenge-button").textContent,
      saved: localStorage.getItem("tutophoto.defi"),
      address: location.pathname + location.search,
    }));
    check(
      "défi de l'adresse, puis « Aucun défi » et rechargement : le choix fait dans la page reste (COD-03)",
      afterReload.text === "Défis" && afterReload.saved === "none" && afterReload.address === "/simulateur/",
      `bouton « ${afterReload.text} » ; tutophoto.defi : ${afterReload.saved} ; adresse rechargée : ${afterReload.address}`,
    );
  } catch (error) {
    // Dans la CI, il n'y a ni écran ni capture : le message garde le journal d'appel de Playwright (ce qu'il
    // attendait de l'élément) et l'état de la page, lu en 10 secondes au plus au cas où elle ne répondrait plus.
    const state = await Promise.race([
      page.evaluate(() => ({
        open: [...document.querySelectorAll("dialog[open]")].map((d) => d.id).join(", ") || "aucune",
        meter: document.getElementById("meter-value")?.textContent ?? "",
        status: document.getElementById("status")?.hidden ? "" : (document.getElementById("status")?.textContent ?? ""),
        problem: document.getElementById("diagnostic")?.hidden ? "" : (document.getElementById("diagnostic")?.textContent ?? ""),
      })),
      new Promise((resolve) => setTimeout(() => resolve(null), 10000)),
    ]).catch(() => null);
    const where = state
      ? `fenêtres ouvertes : ${state.open} ; posemètre : « ${state.meter} »${state.status ? ` ; message : « ${state.status} »` : ""}${state.problem ? ` ; problème affiché : « ${state.problem} »` : ""}`
      : "la page ne répond plus";
    check("déroulement du test", false, `${String(error).split("\n").slice(0, 25).join(" ⏎ ")} ; ${where}`);
  } finally {
    // Erreurs des pages et de la console (INT-06 de l'audit, version 0.3.64) : un contrôle compté comme les autres,
    // fait ici pour l'être aussi quand le simulateur ne se charge pas (retour anticipé, plus haut) ou que la routine
    // s'arrête sur une exception (« déroulement du test »). Chaque erreur distincte est nommée, avec son nombre
    // d'occurrences ; au-delà de 40, le nombre de celles qui restent.
    const describe = (list) => {
      const counts = new Map();
      for (const e of list) counts.set(e, (counts.get(e) ?? 0) + 1);
      const named = [...counts].slice(0, 40).map(([e, n]) => (n > 1 ? `${e} (${n} fois)` : e));
      return named.join(" | ") + (counts.size > 40 ? ` | et ${counts.size - 40} autre(s) erreur(s) distincte(s)` : "");
    };
    const admitted = errors.filter((e) => ADMITTED_ERRORS.some((pattern) => pattern.test(e)));
    const unexpected = errors.filter((e) => !admitted.includes(e));
    check(
      "aucune erreur de la page ni de la console",
      unexpected.length === 0,
      (unexpected.length ? `${unexpected.length} erreur(s) : ${describe(unexpected)}` : "aucune") +
        (admitted.length ? ` ; admises : ${describe(admitted)}` : ""),
    );
    await context.close();
  }
  return { name, checks };
}

(async () => {
  if (!fs.existsSync(path.join(dist, "simulateur", "index.html")) || !fs.existsSync(path.join(dist, "index.html"))) {
    console.error(`Site construit introuvable dans ${dist} : lance d'abord cd app && npm run build.`);
    process.exit(2);
  }
  const server = await serve(dist);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  let failed = 0;
  console.log("\n== pages");
  for (const c of checkLinks(dist)) {
    if (!c.ok) failed++;
    console.log(`${c.ok ? "ok    " : "ÉCHEC "} ${c.label}${c.detail ? ` : ${c.detail}` : ""}`);
  }
  for (const name of profileNames) {
    const result = await runProfile(browser, name, base);
    console.log(`\n== ${name}`);
    for (const c of result.checks) {
      if (!c.ok) failed++;
      console.log(`${c.ok ? "ok    " : "ÉCHEC "} ${c.label}${c.detail ? ` : ${c.detail}` : ""}`);
    }
  }
  await browser.close();
  server.close();
  console.log(`\n${failed} échec(s)`);
  process.exit(failed ? 1 : 0);
})();
