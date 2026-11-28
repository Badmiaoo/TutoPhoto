// Textes de l'interface du simulateur : une seule table, en français, chaque texte sous une clé stable.

import { frenchSpaces } from "./frenchSpaces";

const messages = {
  subtitle: "Simulateur photo : la scène de parc, en construction",
  home: "Accueil",
  ficheOpen: "Fiche",
  // Nom accessible de chacun des trois boutons « Fiche » de la fenêtre « Défis » (constat INT-19 de l'audit, point 7,
  // version 0.4.7) : le texte affiché, puis l'identifiant de la situation.
  ficheOpenNamed: "Fiche {id}",
  fichePage: "Ouvrir la page de la fiche",
  ficheUnavailable: "fiche indisponible.",
  licences: "Licences",
  credits: "Crédits",
  creditsTitle: "Crédits",
  creditsIntro: "Les éléments de la scène, leurs auteurs et leurs licences, puis le code de tiers du simulateur.",
  // Code de tiers du simulateur, sous la liste des crédits de la scène (version 0.4.14, décision D13 ; constats PHY-19
  // et LIC-08 de l'audit). Les mentions et les textes des licences sont sur la page des licences (docs/licences.md).
  creditsCode:
    "Code de tiers : Babylon.js (Apache-2.0) ; la boucle du flou du viseur, reprise de l'exemple 45-bokeh de bgfx (Copyright 2021 elven cache ; licence BSD à 2 clauses de bgfx) ; la fonction de préchargement de Vite et deux fonctions d'assemblage de Rolldown, que la construction ajoute (MIT). Mentions et textes des licences :",
  creditsCodeLink: "page des licences",
  by: "par",
  changes: "Modifications :",
  siteVersion: "Version du site : {version}",
  close: "Fermer",
  aperture: "Ouverture",
  shutter: "Vitesse",
  iso: "ISO",
  focal: "Focale",
  decrease: "moins",
  increase: "plus",
  // Effet de chaque bouton de molette, dans son nom accessible et son infobulle (constat INT-16 de l'audit, version
  // 0.4.7) : « + » augmente le nombre affiché (nombre f, durée de pose, ISO, focale), ce qui ferme le diaphragme et
  // allonge la pose ; les noms « Ouverture : plus » et « Vitesse : plus » disaient l'inverse. Les signes sont des
  // symboles, pas des textes affichés au sens du critère « Label in Name » [wcag-22-label-in-name-understanding] : le
  // nom dit l'effet, après le mot du signe, gardé pour qui le prononce. Ouvertures, vitesses et
  // ISO vont par tiers de cran (camera/exposure.ts) ; les focales suivent la liste de l'objectif virtuel.
  apertureDecrease: "ouvrir d'un tiers de cran (nombre f plus petit)",
  apertureIncrease: "fermer d'un tiers de cran (nombre f plus grand)",
  shutterDecrease: "pose plus courte d'un tiers de cran",
  shutterIncrease: "pose plus longue d'un tiers de cran",
  isoDecrease: "sensibilité plus basse d'un tiers de cran",
  isoIncrease: "sensibilité plus élevée d'un tiers de cran",
  // Avec l'ISO auto, les boutons changent la valeur choisie, que l'appareil peut ne pas retenir : en M, il règle la
  // sensibilité sans en partir ; elle ne compte que comme plafond, quand elle dépasse la sensibilité maximale
  // (camera/exposureModes.ts, resolveExposure ; relecture de la version 0.4.7, R1 ; contrôle final, F3).
  isoDecreaseAuto: "valeur choisie plus basse d'un tiers de cran",
  isoIncreaseAuto: "valeur choisie plus élevée d'un tiers de cran",
  focalDecrease: "focale plus courte",
  focalIncrease: "focale plus longue",
  meterUnit: "IL",
  // Dans la fenêtre « Exposition » et l'infobulle du bouton de l'indicateur (constat INT-09 de l'audit, version 0.4.7).
  meterHelp: "Indicateur d'exposition : 0 pour une exposition correcte, plus pour une photo plus claire, moins pour une photo plus sombre.",
  bodyTitle: "Boîtier de référence",
  brand: "Marque",
  // Dans la note des capteurs de la fenêtre « Boîtier de référence » : « Nikon Z 6, plein format de 35,9 × 23,9 mm ».
  // Trait d'union insécable (\u2011) dans « APS-C » : « APS- » puis « C » se coupaient (iPhone SE émulé).
  fullFrame: "plein format",
  apsc: "APS\u2011C",
  sensor: "Capteurs",
  // Décision D3 de Julien (15 novembre 2026, docs/historique.md) : « Les noms des modes et des menus restent ceux du
  // Nikon Z 6 ». La première phrase dit ce que change le boîtier (camera/bodies.ts : taille et définition du capteur,
  // capacité des photosites et bruit de lecture ; couverture de l'autofocus quand elle est sourcée, sinon celle du Z 6,
  // ui/cameraPanel.ts). Espaces insécables (\u00a0) dans « Z 6 », pour qu'il ne se coupe pas en fin de ligne.
  bodyNote:
    "Le boîtier choisi ne change que le capteur (taille, définition, bruit) et la zone couverte par l'autofocus, quand elle est connue (sinon, celle du Z\u00a06). Les noms des modes et des menus restent ceux du Nikon Z\u00a06.",
  shutterButton: "Déclencher",
  computing: "Calcul de la photo…",
  computingLoupe: "Calcul de la loupe…",
  reviewBack: "Revenir au viseur",
  save: "Enregistrer la photo",
  focusHint: "AF-C : touche le viseur pour choisir le point de mise au point ; la mise au point le suit.",
  renders: "rendus",
  computedIn: "calculée en",
  focusedAt: "mise au point à",
  focusLockedAt: "mise au point verrouillée à",
  lockedAt: "verrouillée à",
  afTitle: "Mise au point",
  afMode: "Mode de mise au point",
  afSingle: "AF-S : AF ponctuel",
  afContinuous: "AF-C : AF continu",
  // Nom accessible du bouton de la mise au point : le texte affiché (« AF-S · Point »), puis ce qu'il ouvre et les
  // réglages en toutes lettres (constat INT-15 de l'audit, version 0.4.7 ; critère « Label in Name » du WCAG 2.2,
  // [wcag-22-label-in-name]).
  afButtonName: "mise au point, {mode}, {area}",
  afSingleName: "AF ponctuel",
  afContinuousName: "AF continu",
  areaMode: "Mode de zone AF",
  areaPoint: "AF point sélectif",
  areaWideS: "AF zone large (S)",
  areaWideL: "AF zone large (L)",
  areaPointShort: "Point",
  areaWideSShort: "Zone S",
  areaWideLShort: "Zone L",
  areaAuto: "AF zone automatique",
  areaAutoShort: "Auto",
  detectionLegend: "Détect. visage-yeux AF zone auto",
  detFaceEye: "Détection visage/yeux activée",
  detFace: "Détection des visages activée",
  detAnimal: "Détection des animaux",
  detOff: "Désactivée",
  targetEye: "œil",
  targetFace: "visage",
  targetNearest: "sujet le plus proche",
  targetPoint: "point touché",
  afHelp:
    "AF-S : toucher le viseur fait le point et verrouille la distance jusqu'au toucher suivant. AF-C : la mise au point suit le point choisi jusqu'au déclenchement. En zone large, l'appareil fait le point sur le sujet le plus proche de la zone, comme le Nikon Z 6 ; le manuel ne donne pas la taille des zones, choisie pour TutoPhoto. En zone automatique, il fait le point sur un œil ou un visage détecté, celui que tu touches, puis le suit ; sans visage, sur le sujet le plus proche. Les seuils de détection sont choisis pour TutoPhoto. Termes du manuel du Z 6.",
  focusHintSingle: "AF-S : touche le viseur pour faire le point ; la distance reste verrouillée jusqu'au toucher suivant.",
  photoError: "La photo n'a pas pu être calculée.",
  loupeError: "La loupe n'a pas pu être calculée ; ta photo n'est pas perdue : « Photo entière » la remontre.",
  photoContextLost: "L'affichage 3D est interrompu ; attends qu'il reprenne, ou recharge la page.",
  photoNotReadyFile:
    "La scène n'est pas prête, et un de ses fichiers n'a pas été reçu (message en haut du viseur) ; recharge la page.",
  photoNotReady: "La scène n'est pas encore prête ; réessaie dans un moment, ou recharge la page.",
  photoUnknown: "TutoPhoto ne reconnaît pas la cause ; réessaie, et si l'échec revient, recharge la page.",
  previewButton: "Aperçu",
  previewTitle: "Aperçu dans le viseur",
  previewAll: "Aperçu des réglages",
  previewBrightness: "Luminosité (exposition)",
  previewNoise: "Bruit numérique",
  // Noms français des réglages, lus le 20 novembre 2026 : https://helpguide.sony.net/ilc/1720/v1/fr/contents/TP0001629952.html
  // et https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_05_d08.html (data/sources.yaml).
  previewNote:
    "Coupé, le viseur reste correctement exposé, sans bruit et net partout, quels que soient les réglages : il faut lire l'indicateur d'exposition et anticiper. Le Sony A7 III (« Affichage Live View ») et le Nikon Z 6 (réglage d8, « Appliquer réglages à visée écran ») proposent ce choix pour la luminosité. La photo garde toujours tous les effets.",
  previewOff: "Aperçu coupé",
  previewBrightnessShort: "luminosité",
  previewNoiseShort: "bruit",
  previewDepthOfField: "Profondeur de champ (approchée)",
  previewDepthOfFieldShort: "profondeur de champ",
  previewBalance: "Indicateur d'équilibre",
  previewBalanceShort: "indicateur",
  gridLegend: "Grille de cadrage",
  gridNone: "Aucune",
  gridThirds: "Tiers (3 × 3)",
  gridSixteen: "Seize cases (4 × 4)",
  gridTwentyFour: "Vingt-quatre cases (6 × 4)",
  gridThirdsDiagonals: "Tiers et diagonales",
  gridNote:
    "La grille aide à cadrer ; TutoPhoto ne la dessine pas sur la photo. Ce sont les mêmes grilles pour tous les boîtiers, celles que les manuels lus nomment ou montrent. Tiers : « Grille règle des tiers » de Sony (nom français lu dans le guide de l'A7 III) et « 3x3 » de Canon. Seize cases : affichage « Framing grid » du Nikon D5600, d'après une illustration de Nikon. Vingt-quatre cases et diagonales : « 6x4 » et « 3x3+diag » de Canon (manuels des EOS 850D et EOS R6). Le manuel du Nikon Z 6 dit seulement qu'un quadrillage s'affiche, sans le décrire.",
  releaseTitle: "Mode de déclenchement",
  releaseSingle: "Vue par vue",
  releaseCL: "Continu L",
  releaseCH: "Continu H",
  releaseCHX: "Continu H (étendu)",
  releaseTimer: "Retardateur",
  releaseClRate: "Cadence en Continu L",
  releaseDelay: "Délai du retardateur",
  challengesTitle: "Défis",
  challengeShort: "Défi",
  challengeNone: "Aucun défi : entraînement libre",
  challengeNote:
    "Le bulletin, sous chaque photo, dit ce qui est réussi et les notions à revoir. Critères : zone nette et flou acceptable (diagonale du capteur / 1500), comme l'indicateur d'équilibre ; un élément est « derrière » le sujet à plus de 1 m derrière lui. Le défi ne juge ni l'exposition ni le bruit : lis aussi la ligne « Exposition » du bulletin.",
  // Titres des défis : ceux des situations dans data/situations.yaml, contrôlés par scripts/validate.py (version 0.3.83).
  challenge01Title: "Portrait à l'ombre ou par ciel couvert",
  challenge01Goal: "le regard de Sophia net, le fond derrière elle flou",
  challenge05Title: "Photo de groupe",
  challenge05Goal: "Dennis, Sophia, Fabienne et Percy nets",
  challenge06Title: "Enfant ou chien qui court",
  challenge06Goal: "le chien dans le cadre, net et figé",
  challengePassed: "réussi",
  challengeRetry: "à reprendre",
  thingDennis: "Dennis",
  thingSophia: "Sophia",
  thingFabienne: "Fabienne",
  thingPercy: "Percy",
  thingWalker: "le promeneur",
  thingDog: "le chien",
  thingBench: "le banc",
  thingBin: "la poubelle",
  thingBackdrop: "le fond photo",
  critEyeSharp: "œil de Sophia dans le cadre et dans la zone nette",
  critBackgroundBlurred: "fond derrière Sophia hors de la zone nette",
  critGroupSharp: "les quatre visages du groupe dans le cadre et dans la zone nette",
  critDogInFrame: "chien dans le cadre",
  critDogSharp: "chien dans la zone nette",
  critDogFrozen: "chien figé, traînée sous le flou acceptable",
  critOk: "Réussi :",
  critFailed: "Manqué :",
  critStillSharp: "encore net :",
  critMissed: "manqués :",
  bulletinExposure: "Exposition :",
  bulletinZone: "Zone nette :",
  bulletinFocus: "mise au point à",
  bulletinNoise: "Bruit au point visé, lu dans le viseur au déclenchement :",
  bulletinTrailIs: "traînée de",
  bulletinFrozen: "sous le flou acceptable",
  bulletinTrail: "au-delà du flou acceptable",
  bulletinLimit: "limite",
  bulletinReview: "À revoir :",
  topViewTitle: "Vue de dessus",
  topViewLabel:
    "Vue de dessus : l'appareil, le champ de l'objectif, le plan de mise au point et la zone nette ; personnages et objets, cerclés de vert quand la photo les jugerait nets, sur leurs yeux pour les personnages et le chien ; le cercle commun à Fabienne et Percy, quand les deux le sont. Le vert ne dit que la netteté, pas si le sujet est dans le cadre.",
  topViewZone: "Zone nette :",
  topViewMove: "Touche la carte pour déplacer l'appareil.",
  topViewReset: "Retour au départ",
  exposureTitle: "Exposition",
  exposureButtonTitle: "Mode d'exposition, correction d'exposition et ISO auto",
  // Nom accessible du bouton de l'indicateur : son texte (« M · −0,2 IL »), puis ce qu'il ouvre (constat INT-15 de
  // l'audit, version 0.4.7).
  exposureButtonName: "mode d'exposition, correction d'exposition et ISO auto",
  exposureModeLegend: "Sélecteur de mode",
  modeM: "M : Manuel",
  modeA: "A : Auto à priorité ouverture",
  modeS: "S : Auto à priorité vitesse",
  compensation: "Correction d'exposition",
  compensationShort: "corr.",
  autoIsoLegend: "Contrôle de la sensibilité auto.",
  autoIsoOn: "Activé",
  maxIso: "Sensibilité maximale",
  minShutter: "Vitesse d'obturation minimale (mode A)",
  isoAuto: "ISO auto",
  isoChosen: "valeur choisie",
  setByCamera: "auto",
  // Les mots du manuel du Nikon Z 6 [nikon-z6-indicators-fr] : quand « les indicateurs d'exposition et l'affichage de
  // la vitesse d'obturation ou de l'ouverture clignotent », « Le sujet est trop clair ; la photo sera surexposée. » ou
  // « Le sujet est trop sombre ; la photo sera sous-exposée. ». Écrits dans la fenêtre « Exposition » tant que la
  // valeur clignote, et plus seulement dans une infobulle (constat INT-09 de l'audit, version 0.4.7).
  tooBright: "le sujet est trop clair ; la photo sera surexposée",
  tooDark: "le sujet est trop sombre ; la photo sera sous-exposée",
  limitShutter: "La vitesse clignote avec l'indicateur d'exposition",
  limitAperture: "L'ouverture clignote avec l'indicateur d'exposition",
  // Limite de TutoPhoto (constat PHY-12 de l'audit) : la scène vaut 12,5 IL où que l'on vise (SCENE_EV100,
  // camera/exposure.ts). Phrase provisoire, à retirer avec la mesure de la lumière ; la phrase de la fiche MES-04,
  // complétée sur le mode de mesure. Espaces insécables (\u00a0) dans « Z 6 », « ISO 100 », « 12,5 IL » et « mode P » :
  // « Z 6 » se coupait en fin de ligne dans lensNote, et « le mode » / « P » dans cette note (Pixel 7 émulé).
  exposureNote:
    "D'après le manuel du Nikon Z\u00a06. En A et en S, l'appareil choisit la vitesse ou l'ouverture ; hors de ses limites, elle clignote avec l'indicateur. En M, la correction ne déplace que l'indicateur, sauf avec l'ISO auto, qui en tient compte. L'ISO auto va de ISO\u00a0100 à la sensibilité maximale ; en A, il ne monte que si la vitesse passerait sous la vitesse minimale. Limite de TutoPhoto : sa mesure de la lumière donne la même valeur où que tu vises (toute la scène vaut 12,5\u00a0IL), et tu ne peux pas choisir de mode de mesure. Non simulés : le mode\u00a0P, l'option « Automatique » de la vitesse minimale, les poses longues.",
  releaseFpsShort: "vps",
  // Réglages par défaut du Z 6, page « Defaults » [nikon-z6-defaults] : « CL mode shooting speed 3 fps », « Self-timer delay 10 s ».
  releaseNote:
    "Termes et cadences du manuel du Nikon Z 6 (12 vues par seconde en Continu H (étendu) pour le JPEG). En rafale, maintiens le déclencheur appuyé : une vue par intervalle, jamais plus vite que la durée de pose ; en AF-C, la mise au point est refaite à chaque vue, en AF-S elle reste celle de la première. TutoPhoto calcule au plus 20 vues par rafale, pour le temps de calcul ; le Z 6 en accepte jusqu'à 200 (réglage d2). Réglages par défaut du Z 6 : 3 vues par seconde en Continu L, 10 s pour le retardateur.",
  burstCount: "Rafale :",
  burstFrame: "vue",
  burstFrames: "vues",
  burstTruncated: "Rafale interrompue : la vue {failed} n'a pas pu être calculée",
  burstShown: "{done} vues sur {count} sont montrées.",
  burstShownOne: "1 vue sur {count} est montrée.",
  burstShownNone: "aucune vue n'est montrée.",
  timerCountdown: "Retardateur :",
  computingFrame: "Calcul de la vue",
  reviewPrev: "Vue précédente",
  reviewNext: "Vue suivante",
  reviewFrame: "Vue",
  balanceTitle: "Équilibre au point visé",
  balanceLimits: "Limites et lecture",
  balanceToggle: "Indicateur d'équilibre : afficher ou masquer le détail",
  balanceDof: "zone nette :",
  balanceDog: "chien",
  balanceWalker: "promeneur",
  balanceSharp: "net, traînée sous la limite",
  balanceTrail: "traînée de",
  balanceTimesLimit: "fois la limite",
  balancePixels: "px sur la photo",
  balanceStill: "sujet visé immobile",
  balanceNoise: "bruit",
  balanceExcellent: "excellent",
  balanceAcceptable: "acceptable",
  balanceInsufficient: "insuffisant",
  balanceSnr: "signal/bruit",
  balanceNoiseUnknown: "bruit non mesuré",
  balanceClipped: "hautes lumières écrêtées au point visé",
  balanceNote:
    "Sommets du triangle : ouverture en haut, vitesse en bas à gauche, ISO en bas à droite. Point au centre : rien ne dépasse les limites. Il part vers l'ISO quand le bruit dépasse, vers la vitesse quand le sujet visé laisse une traînée ; la profondeur de champ est indiquée sans jugement. Limites : flou acceptable égal à la diagonale du capteur divisée par 1500 (0,029 mm en plein format) ; rapport signal/bruit de 40:1 (excellent) et 10:1 (acceptable), pour une photo d'environ 21 cm de large vue à 25 cm. Bougé de la main non simulé.",
  and: " et ",
  loupe: "Loupe",
  problemError: "Erreur",
  problemNoise: "Bruit du viseur indisponible sur cet appareil",
  problemDepthOfField: "Profondeur de champ du viseur indisponible sur cet appareil",
  problemLate: "Scène affichée avant d'être prête, éléments en attente",
  // Capacités de rendu en flottants (constat ARC-13 de l'audit, version 0.3.88 ; diagnosticModel.ts, floatRenderMessage) :
  // la ligne des problèmes, en haut du viseur, avec le détail floatRenderDetail, suivi de floatRenderFocus quand
  // textureFloatRender manque, la seule dont dépend la carte de profondeur de l'autofocus et de l'aperçu de la
  // profondeur de champ. Sans ces capacités, la photo sort presque noire, l'autofocus rend la distance du sol ou du
  // fond, et l'aperçu floute tout le cadre autant que sa partie la plus floue (essais : docs/pile-technique.md,
  // « Prise en charge des navigateurs »).
  problemFloatRender: "Photo impossible sur cet appareil",
  floatRenderDetail:
    "son navigateur ne sait pas rendre l'image dans des textures en flottants ({caps} : non) ; le bouton « Déclencher » est désactivé.",
  floatRenderFocus:
    "La mise au point ne voit pas les sujets (elle se fait sur le sol ou le fond), et l'aperçu de la profondeur de champ floute tout le cadre, autant que sa partie la plus floue.",
  percent: "\u00a0%",
  // Infobulle du bouton « Loupe », et note de la fenêtre « Mise au point » après loupeNoteLead (constat INT-09 de
  // l'audit, version 0.4.7) : la loupe grossit autour du point de mise au point.
  loupeNoteLead: "Bouton « Loupe » :",
  loupeHelp: "Grossit l'image autour du point de mise au point, jusqu'à 100\u00a0% : un pixel de la page pour un photosite du capteur (sur un écran à haute densité, comme celui d'un téléphone, ce pixel en couvre plusieurs de l'écran).",
  reviewWhole: "Photo entière",
  reviewHint: "Touche la photo pour la voir à 100\u00a0% à cet endroit.",
  reviewInfo: "Infos",
  reviewInfoTitle: "Affichage de l'écran de revue : photo seule, histogrammes ou hautes lumières",
  reviewDisplayPhoto: "photo seule",
  reviewDisplayHistograms: "histogrammes",
  reviewDisplayHighlights: "hautes lumières",
  histogramOf: "Histogramme :",
  histogramLuminance: "Luminance",
  histogramRed: "Rouge",
  histogramGreen: "Vert",
  histogramBlue: "Bleu",
  clippedShare: "Pixels à la valeur maximale sur au moins une couche",
  clippedNone: "Aucun pixel à la valeur maximale",
  clippedNothingBlinks: "rien ne clignote",
  clippedOfImage: "de l'image",
  clippedOfPart: "de la partie affichée",
  clippedBlink: "Ces zones clignotent en noir sur la photo.",
  clippedStill: "Ces zones sont en noir sur la photo, sans clignoter : ton appareil demande de réduire les animations.",
  lessThan: "moins de",
  reviewInfoLimits: "Lecture et limites",
  reviewInfoNote:
    "Histogrammes : luminosité du pixel sur l'axe horizontal, plus sombre vers la gauche (0), plus claire vers la droite (255), et nombre de pixels sur l'axe vertical (manuels du Nikon Z 6 et du Sony A7 III). Ordre de leurs affichages : luminance, rouge, vert, bleu. Avec la loupe, tout porte sur la partie affichée, comme sur le Z 6. Choix de TutoPhoto, non sourcés : luminance = 0,2126 R + 0,7152 V + 0,0722 B, sur les valeurs de la photo ; hauteur rapportée à la plus haute colonne, sans compter les colonnes 0 et 255 ; zone signalée quand au moins une couche vaut 255. Le clignotement est décrit par Sony ; le manuel du Z 6 ne dit pas comment sa page « Hautes lumières » marque les zones, ni à quel seuil. Non simulés : les réglages d'image du boîtier (« Picture Control » sur le Z 6), que TutoPhoto n'applique pas à sa photo ; l'alerte des zones sous-exposées de Sony ; l'histogramme et les zébrures à la prise de vue. Nikon prévient que les histogrammes de l'appareil ne doivent servir que de référence.",
  // Diffraction (constat PHY-11 de l'audit) [wikipedia-airy-disk]
  // (https://en.wikipedia.org/w/index.php?title=Airy_disk&oldid=1369075623) : diamètre du premier anneau sombre
  // 2,44 × λ × N ; à f/22 (N = 22,63), 23 µm à 420 nm (le violet, longueur d'onde visible la plus courte d'après
  // l'article) et 31 µm à 560 nm (moyenne des longueurs d'onde visibles) ; photosite du Z 6 : 35,9 mm / 6066 ≈ 5,9 µm.
  // Calcul dans docs/camera-physique.md, « Photo calculée », limites. Espaces insécables (\u00a0) dans « Z 6 » et entre
  // les nombres et leur unité : « du Z » / « 6 » (Pixel 7 émulé) et « (31 » / « µm » (iPhone 14 émulé) se coupaient.
  lensNote:
    "Objectif virtuel : zoom de 18 à 200\u00a0mm ouvrant à f/1.4 sur toute la plage. Il n'existe pas ; il sert à couvrir les trois situations. Diffraction non simulée : à f/22, un point lumineux s'étale en une tache d'au moins 23\u00a0µm de diamètre (31\u00a0µm pour la longueur d'onde moyenne de la lumière visible), la largeur de 4 à 5 photosites du Nikon Z\u00a06 ; TutoPhoto ne la dessine pas : ici, fermer le diaphragme ne fait perdre aucun piqué par diffraction.",
  sceneLabel: "Viseur : un parc en automne. Faire glisser pour tourner l'appareil.",
  loading: "Chargement de la scène…",
  loadingProgress: "{done} / {total} Mio reçus · {s} s",
  loadingPreparing: "fichiers reçus, préparation · {s} s",
  loadingMissing: "en attente : {files}",
  loadError: "La scène n'a pas pu être chargée.",
  loadErrorFile:
    "Un fichier de la scène n'a pas été reçu ({file}). Le viseur peut être incomplet, et les photos échouer. Vérifie ta connexion.",
  reload: "Recharger",
  contextLost: "Affichage 3D interrompu par le navigateur. Il peut reprendre seul ; sinon, recharge la page.",
  // Démarrage arrêté (version 0.4.4, demande de Julien du 22 novembre 2026 ; main.ts, startOrFail) : contexte WebGL
  // perdu dès la création du moteur ou pendant le démarrage, perdu pendant le chargement de la scène (version 0.4.15,
  // demande de Julien du 23 novembre 2026), ou autre exception, dont le détail est dans la ligne des problèmes. La
  // version du site et « Recharger » suivent le message.
  startContextLost:
    "Le simulateur n'a pas pu démarrer : le navigateur a perdu l'affichage 3D (contexte WebGL) dès l'ouverture de la page. Recharge la page.",
  startContextLostLoading:
    "Le simulateur n'a pas pu démarrer : le navigateur a perdu l'affichage 3D (contexte WebGL) pendant le chargement de la scène. Recharge la page.",
  startError: "Le simulateur n'a pas pu démarrer. Recharge la page.",
  // Où en était le chargement quand il s'est arrêté sur une perte du contexte (version 0.4.15) : après la version du
  // site, pour qu'une capture d'écran le dise ; {progress} est la progression du chargement, figée à l'arrêt.
  startProgress: "Chargement à ce moment : {progress}.",
  creditsUnavailable:
    "Crédits indisponibles : la liste des éléments de la scène (scenes/parc/scene.json) n'a pas pu être chargée. Recharge la page pour réessayer.",
  noWebgl: "Ce navigateur ne permet pas d'afficher la scène 3D (WebGL indisponible).",
  // Affichage de diagnostic, ouvert par « ?diagnostic » dans l'adresse (constat ARC-06 de l'audit, version 0.3.88 ;
  // diagnosticModel.ts, ui/diagnosticView.ts). Les capacités et l'extension gardent leur nom technique : c'est celui que
  // relèvent Julien et les testeurs, et que cite docs/pile-technique.md.
  diagTitle: "Diagnostic (moyennes sur 1 s)",
  diagWebgl: "WebGL {version} · {renderer}",
  diagDensity: "Densité : écran {screen}, viseur {density} · image de {width} × {height} px",
  diagFps: "Images par seconde : {fps}",
  diagFrame: "Durée d'une image, processeur : {frame} ms (textures de rendu : {targets} ms)",
  diagNoFrame: "Aucune image du viseur dans la dernière seconde (calcul d'une photo ou de la loupe, ou page cachée)",
  diagGpu: "Durée d'une image, processeur graphique : {gpu} ms",
  diagGpuWaiting: "Durée d'une image, processeur graphique : en attente d'une mesure",
  diagGpuMissing: "Durée d'une image, processeur graphique : non mesurée ({extension} absente)",
  diagGpuUnsupported: "Durée d'une image, processeur graphique : non mesurée (WebGL 1 sans horodatage, que Babylon.js 9.35.0 ne mesure qu'une fois)",
  diagCaps: "Rendu en flottants : {caps}",
  // Textures créées par Babylon.js, plus grand côté de texture que le processeur graphique accepte, et textures
  // allégées de « ?diagnostic=textures-legeres » (version 0.4.15).
  diagTextures: "Textures : {count}, environ {mio} Mio demandés · limite du processeur graphique : {max} px de côté",
  diagTexturesLowered:
    "Textures : {count}, environ {mio} Mio demandés · limite du processeur graphique : {max} px de côté, abaissée à {current} px pour le chargement",
  diagTexturesLost: "Textures relevées avant la perte du contexte WebGL, une seconde au plus avant elle",
  diagTexturesLight: "Textures allégées pour cet essai : images réduites à {size} px de côté au plus pendant le chargement",
  diagYes: "oui",
  diagNo: "non",
} satisfies Record<string, string>;

export type MessageKey = keyof typeof messages;

export { frenchSpaces };

const spaced = Object.fromEntries(Object.entries(messages).map(([key, text]) => [key, frenchSpaces(text)])) as Record<MessageKey, string>;

export function t(key: MessageKey): string {
  return spaced[key];
}
