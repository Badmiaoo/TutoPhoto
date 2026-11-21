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
// saturation à ISO 100 de la page du bruit de lecture, colonne « Saturation (e-) » du tableau que la page ouvre
// pour chaque boîtier, égale au paramètre fwc de sa série [photonstophotos-read-noise]. Pour les deux autres, cette
// colonne donne 80 359 (Z 6) et 32 205 (A6000), soit 4,0 % et 2,7 % de moins que leur capacité dérivée.
// Bruit de lecture rapporté à l'entrée, en électrons, par réglage ISO : graphique « Input-referred Read Noise
// versus ISO Setting » du même auteur [photonstophotos-read-noise], converti de log₂ ; ISO exacts des tiers
// (100 × 2^(i/3)), arrondis.

export type Brand = "nikon" | "sony" | "canon";
/** Format du capteur, tel que le nomme la fiche du constructeur (Nikon : « format FX », 36 × 24). */
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
  // [sony-ilce-6000-sensor] : extrait de recherche de la fiche Sony, page non ouverte.
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
  // environ 100 %, vertical : environ 100 % ». La page ne chiffre pas les zones (« Élargir zone AF », « AF zone
  // flexible ») : TutoPhoto leur applique la couverture du collimateur, ce qui n'est pas sourcé.
  // Capacité : 34 577 électrons (saturation à ISO 100, voir plus haut). Bruit de lecture : les mesures d'ISO 100 à
  // 636 et celle d'ISO 6400 sont marquées d'un triangle pointe en bas, « triangle down indicates noise reduction »
  // (sous-titre du graphique) : Claff a relevé une réduction du bruit dans les fichiers RAW de l'EOS R50 à ces
  // réglages. TutoPhoto prend ces valeurs telles quelles et ne simule pas cette réduction.
  { brand: "canon", format: "apsc", model: "Canon EOS R50", sensorWidthMm: 22.3, sensorHeightMm: 14.9,
    afCoverage: { horizontal: 0.9, vertical: 1 }, afCoverageAuto: { horizontal: 1, vertical: 1 },
    effectivePixels: 24200000, fullWellElectrons: 34577,
    readNoise: [[100, 4.32], [126, 4.5], [159, 4.86], [200, 3.07], [251, 3.16], [318, 3.36], [400, 2.57], [503, 2.68], [636, 2.79], [800, 2.5], [1006, 2.6], [1273, 2.6], [1600, 2.35], [2011, 2.36], [2546, 2.36], [3200, 2.11], [4022, 2.13], [5091, 2.11], [6400, 1.43]] },
];

/**
 * Définition du capteur en pixels, le long de ses deux côtés : √(pixels effectifs × grand côté / petit côté)
 * et son complément. Approximation : la forme exacte de l'image n'est pas lue dans les sources.
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
