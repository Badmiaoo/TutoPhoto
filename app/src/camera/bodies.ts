// Boîtiers de référence : un par marque, « les plus communs » (décision D4 de Julien, 15 novembre 2026,
// docs/historique.md), choisis par Claude le 20 novembre 2026 (version 0.3.79 ; règle et sources :
// docs/propositions.md, section 5, « Termes de Canon et de Sony, trois boîtiers de référence », choix 4 et 5) :
// Nikon Z 6, Sony A6000, Canon EOS R50. Dimensions et définition du capteur (champ de vue, bruit), capacité des
// photosites et bruit de lecture (bruit), couverture de l'autofocus quand elle est sourcée. Sources dans
// data/sources.yaml (identifiants entre crochets). Le reste (commandes, termes, réglages par défaut) vient du
// manuel du Z 6 pour les trois (décision D3, fenêtre « Boîtier de référence »).
//
// Capacité du Z 6 et de l'A6000 : « DxOMark Derived Sensor Characteristics » de William J. Claff
// [photonstophotos-sensor-characteristics] ; Claff juge ces valeurs dérivées peu sûres pour les petits capteurs.
// L'EOS R50 n'y est pas (page révisée le 15 décembre 2025, relue le 21 novembre 2026) : sa capacité est la
// saturation à ISO 100 de la page du bruit de lecture, colonne « Saturation (e-) » du tableau que la page ouvre d'un
// clic sur le nom du boîtier dans la légende du graphique, égale au paramètre fwc de sa série
// [photonstophotos-read-noise] ; la page ne dit pas comment elle obtient cette saturation. Pour les deux autres, cette
// colonne donne 80 359 (Z 6) et 32 205 (A6000), soit 4,0 % et 2,7 % de moins que leur capacité dérivée : un
// recoupement, qui ne remplace pas les valeurs retenues (constat PHY-13 de l'audit ; effet sur le bruit de 2,1 % pour le Z 6, 1,4 % pour l'A6000).
// Bruit de lecture rapporté à l'entrée, en électrons, par réglage ISO : graphique « Input-referred Read Noise
// versus ISO Setting » du même auteur [photonstophotos-read-noise], converti de log₂ ; ISO lus sur le graphique,
// 3,125 × 2^x arrondi, x étant donné au centième (251 pour le tiers 100 × 2^(4/3) ≈ 252, par exemple). Les mesures
// retenues, d'ISO 100 à 6400, sont toutes dans la plage analogique de la page : aucune n'a le symbole ouvert de « Open
// symbols indicate values outside the normal analog range » (relu le 22 novembre 2026). Ce n'est pas dire qu'elles
// viennent toutes d'un gain analogique : « Flat spots in groups of three in the analog region usually indicate where
// digital intermediate ISO gain is present », et l'EOS R50 et le Z 6 ont de tels groupes de trois mesures presque
// égales ; elles sont prises telles quelles.

export type Brand = "nikon" | "sony" | "canon";
/**
 * Format du capteur : plein format (Z 6 : « Capteur CMOS 35,9 × 23,9 mm (format Nikon FX) »,
 * [nikon-z6-specifications-fr]) ou APS-C (Sony A6000, Canon EOS R50).
 */
export type Format = "ff" | "apsc";

export interface Body {
  brand: Brand;
  format: Format;
  model: string;
  /** Dimensions du capteur, en millimètres (grand côté, petit côté). */
  sensorWidthMm: number;
  sensorHeightMm: number;
  /** Nombre de pixels effectifs. */
  effectivePixels: number;
  /** Capacité d'un photosite à ISO 100, en électrons. */
  fullWellElectrons: number;
  /** Bruit de lecture mesuré : [ISO, électrons], par ISO croissant. */
  readNoise: readonly (readonly [number, number])[];
  /**
   * Couverture de l'autofocus (MAP-06), en fraction du grand côté (horizontal) et du petit côté (vertical) du
   * capteur, au centre, pour le point ou la zone que l'on place ; absente quand elle n'est pas sourcée
   * (ui/cameraPanel.ts prend alors celle du Z 6).
   */
  afCoverage?: { horizontal: number; vertical: number };
  /**
   * Couverture en zone automatique, quand la fiche du boîtier en donne une autre ; sinon afCoverage.
   */
  afCoverageAuto?: { horizontal: number; vertical: number };
}

export const BODIES: readonly Body[] = [
  // [nikon-z6-specifications] : manuel en ligne Nikon, « 35.9 × 23.9 mm CMOS sensor ».
  // Définition [nikon-z6-specifications] : « 24.5 million » pixels effectifs.
  // Couverture AF [nikon-z6-launch-2018] : « approximately 90% of the imaging area both horizontally and vertically »,
  // « With FX (36x24) format and single-point AF ».
  { brand: "nikon", format: "ff", model: "Nikon Z 6", sensorWidthMm: 35.9, sensorHeightMm: 23.9, afCoverage: { horizontal: 0.9, vertical: 0.9 },
    effectivePixels: 24500000, fullWellElectrons: 83698,
    readNoise: [[100, 6.87], [126, 7.62], [159, 7.84], [200, 5.98], [251, 5.78], [318, 5.58], [400, 5.31], [503, 5.21], [636, 5.13], [800, 1.62], [1006, 1.49], [1273, 1.47], [1600, 1.37], [2011, 1.39], [2546, 1.37], [3200, 1.27], [4022, 1.25], [5091, 1.2], [6400, 1.21]] },
  // Capteur : « 23.5 × 15.6 mm (APS-C type) » [wikipedia-sony-a6000], source secondaire ; la fiche de Sony
  // [sony-ilce-6000-sensor] n'est connue que par un extrait de recherche, page non ouverte (hôte refusé) : aucune
  // source primaire lue pour le capteur.
  // Définition [wikipedia-sony-a6000] : « 24.3 MP », source secondaire.
  // Couverture AF : « 179 phase detection points (covering almost the entire image) », sans pourcentage
  // [sony-ilce-6000-af] : celle du Z 6, non sourcée pour l'A6000.
  { brand: "sony", format: "apsc", model: "Sony A6000", sensorWidthMm: 23.5, sensorHeightMm: 15.6,
    effectivePixels: 24300000, fullWellElectrons: 33083,
    readNoise: [[100, 4.96], [126, 4.56], [159, 4.03], [200, 3.66], [251, 3.48], [318, 3.25], [400, 3.1], [503, 2.95], [636, 2.83], [800, 2.71], [1006, 2.64], [1273, 2.51], [1600, 2.41], [2011, 2.35], [2546, 2.28], [3200, 2.19], [4022, 2.2], [5091, 2.14], [6400, 2.04]] },
  // [canon-eos-r50-specifications-fr] : manuel de l'EOS R50 en français, « Caractéristiques techniques » :
  // « Capteur CMOS APS-C », « Environ 22,3 × 14,9 mm », « Pixels effectifs […] Environ 24,2 mégapixels max. »
  // (arrondi aux 100 000 les plus proches).
  // Couverture AF, même page : « Positions sélectionnables pour le collimateur AF », « Horizontal : environ 90 %,
  // vertical : environ 100 % » (« En cas de réglage sur [1 collimateur AF] et de sélection avec les touches
  // directionnelles ») ; « Nombre de zones autofocus disponibles pour la sélection automatique », « Horizontal :
  // environ 100 %, vertical : environ 100 % », avec, sous ce tableau, « Peut varier selon les réglages. ». La page ne
  // chiffre pas les zones (« Élargir zone AF », « AF zone flexible ») : TutoPhoto leur applique la couverture du
  // collimateur, ce qui n'est pas sourcé. Non simulé : la couverture selon l'objectif (« Compatibilité des objectifs
  // d'après la zone de mise au point : reportez-vous au site Web de Canon » ; [canon-eos-r50-af-area-fr] : « avec
  // certains objectifs, il peut ne pas se déplacer au bord de l'écran »). TutoPhoto place le collimateur au toucher,
  // ce que l'EOS R50 permet aussi ([canon-eos-r50-af-area-fr]), mais la page ne chiffre la couverture que pour les
  // touches directionnelles.
  // Capacité : 34 577 électrons (saturation à ISO 100, voir plus haut). Bruit de lecture : les mesures d'ISO 100 à
  // 636 et celle d'ISO 6400 sont marquées d'un triangle pointe en bas, « triangle down indicates noise reduction »
  // (sous-titre du graphique) : Claff signale une réduction du bruit à ces réglages. Ces mesures en portent déjà la
  // baisse, de combien la page ne le dit pas (2,11 électrons à ISO 5091, 1,43 à ISO 6400). TutoPhoto les prend
  // telles quelles ; ce que la réduction fait au grain n'est pas simulé.
  { brand: "canon", format: "apsc", model: "Canon EOS R50", sensorWidthMm: 22.3, sensorHeightMm: 14.9,
    afCoverage: { horizontal: 0.9, vertical: 1 }, afCoverageAuto: { horizontal: 1, vertical: 1 },
    effectivePixels: 24200000, fullWellElectrons: 34577,
    readNoise: [[100, 4.32], [126, 4.5], [159, 4.86], [200, 3.07], [251, 3.16], [318, 3.36], [400, 2.57], [503, 2.68], [636, 2.79], [800, 2.5], [1006, 2.6], [1273, 2.6], [1600, 2.35], [2011, 2.36], [2546, 2.36], [3200, 2.11], [4022, 2.13], [5091, 2.11], [6400, 1.43]] },
];

/**
 * Définition du capteur en pixels, le long de ses deux côtés : √(pixels effectifs × grand côté / petit côté)
 * et son complément, calculée par Claude ; elle fixe le « 100 % » des loupes du viseur et de l'écran de revue (un pixel
 * de l'image par photosite). Approximation : les trois boîtiers enregistrent des images dont la taille est lue, Z 6
 * 6048 × 4024 [nikon-z6-specifications-fr], A6000 et EOS R50 6000 × 4000 [sony-a6000-image-size-fr]
 * [canon-eos-r50-specifications-fr] ; le calcul les dépasse de 0,3 % (Z 6, EOS R50) à 0,8 % (A6000) sur le grand
 * côté, et TutoPhoto le garde (constat PHY-14 de l'audit ; docs/propositions.md, section 5, « Sources du modèle »).
 * Le bruit compte les pixels effectifs, pas ceux de l'image : rien de lu ne dit lequel des deux nombres couvre le
 * capteur.
 */
export function sensorPixels(body: Body): { long: number; short: number } {
  const long = Math.sqrt((body.effectivePixels * body.sensorWidthMm) / body.sensorHeightMm);
  return { long, short: body.effectivePixels / long };
}

/** Boîtier de la marque : un par marque. */
export function findBody(brand: Brand): Body {
  const body = BODIES.find((b) => b.brand === brand);
  if (!body) throw new Error(`Boîtier inconnu : ${brand}`);
  return body;
}
