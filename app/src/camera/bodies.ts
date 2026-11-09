// Boîtiers de référence (décision du 8 novembre 2026, docs/camera-physique.md) : trois marques, chacune
// avec un plein format et un APS-C. Dimensions et définition du capteur (champ de vue, bruit), capacité des
// photosites et bruit de lecture (bruit). Sources dans data/sources.yaml (identifiants entre crochets).
//
// Capacité : « DxOMark Derived Sensor Characteristics » de William J. Claff [photonstophotos-sensor-characteristics] ;
// Claff juge ces valeurs dérivées peu sûres pour les petits capteurs. Bruit de lecture rapporté à l'entrée,
// en électrons, par réglage ISO : graphique « Input-referred Read Noise versus ISO Setting » du même auteur
// [photonstophotos-read-noise], converti de log₂ ; ISO exacts des tiers (100 × 2^(i/3)), arrondis.

export type Brand = "nikon" | "sony" | "canon";
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
}

export const BODIES: readonly Body[] = [
  // [nikon-z6-specifications] : manuel en ligne Nikon, « 35.9 × 23.9 mm CMOS sensor ».
  // Définition [nikon-z6-specifications] : « 24.5 million » pixels effectifs.
  { brand: "nikon", format: "ff", model: "Nikon Z 6", sensorWidthMm: 35.9, sensorHeightMm: 23.9,
    effectivePixels: 24500000, fullWellElectrons: 83698,
    readNoise: [[100, 6.87], [126, 7.62], [159, 7.84], [200, 5.98], [251, 5.78], [318, 5.58], [400, 5.31], [503, 5.21], [636, 5.13], [800, 1.62], [1006, 1.49], [1273, 1.47], [1600, 1.37], [2011, 1.39], [2546, 1.37], [3200, 1.27], [4022, 1.25], [5091, 1.2], [6400, 1.21]] },
  // [nikon-d5600-sensor] : extrait de recherche, page non ouverte.
  // Définition [nikon-d5600-pixels] : 24,2 millions, extrait de recherche. Bruit mesuré jusqu'à ISO 2546 seulement.
  { brand: "nikon", format: "apsc", model: "Nikon D5600", sensorWidthMm: 23.5, sensorHeightMm: 15.6,
    effectivePixels: 24200000, fullWellElectrons: 33963,
    readNoise: [[100, 3.05], [126, 2.93], [159, 2.79], [200, 2.68], [251, 2.6], [318, 2.46], [400, 2.41], [503, 2.3], [636, 2.27], [800, 2.16], [1006, 2.13], [1273, 2.11], [1600, 2.07], [2011, 2.04], [2546, 2.03]] },
  // [sony-ilce-7m3-help-guide] : guide d'aide Sony, « 35.6 mm × 23.8 mm ».
  // Définition [sony-ilce-7m3-help-guide] : « Approx. 24 200 000 pixels ».
  { brand: "sony", format: "ff", model: "Sony A7 III", sensorWidthMm: 35.6, sensorHeightMm: 23.8,
    effectivePixels: 24200000, fullWellElectrons: 95764,
    readNoise: [[100, 6.41], [126, 6.11], [159, 5.74], [200, 5.39], [251, 5.43], [318, 5.1], [400, 4.99], [503, 4.92], [636, 1.44], [800, 1.34], [1006, 1.39], [1273, 1.31], [1600, 1.37], [2011, 1.27], [2546, 1.24], [3200, 1.26], [4022, 1.24], [5091, 1.26], [6400, 1.19]] },
  // [sony-ilce-6000-sensor] : extrait de recherche de la fiche Sony, page non ouverte.
  // Définition [wikipedia-sony-a6000] : « 24.3 MP », source secondaire.
  { brand: "sony", format: "apsc", model: "Sony A6000", sensorWidthMm: 23.5, sensorHeightMm: 15.6,
    effectivePixels: 24300000, fullWellElectrons: 33083,
    readNoise: [[100, 4.96], [126, 4.56], [159, 4.03], [200, 3.66], [251, 3.48], [318, 3.25], [400, 3.1], [503, 2.95], [636, 2.83], [800, 2.71], [1006, 2.64], [1273, 2.51], [1600, 2.41], [2011, 2.35], [2546, 2.28], [3200, 2.19], [4022, 2.2], [5091, 2.14], [6400, 2.04]] },
  // [canon-eos-rp-sensor] : extrait de recherche de la fiche Canon, page non ouverte.
  // Définition [canon-eos-rp-pixels] : environ 26,2 millions, extrait de recherche.
  { brand: "canon", format: "ff", model: "Canon EOS RP", sensorWidthMm: 35.9, sensorHeightMm: 24.0,
    effectivePixels: 26200000, fullWellElectrons: 82327,
    readNoise: [[100, 36.25], [126, 36.25], [159, 19.84], [200, 19.7], [251, 19.7], [318, 10.13], [400, 10.2], [503, 10.27], [636, 5.86], [800, 5.86], [1006, 5.94], [1273, 3.84], [1600, 3.86], [2011, 3.86], [2546, 2.79], [3200, 2.83], [4022, 2.85], [5091, 2.58], [6400, 2.62]] },
  // [canon-eos-2000d-sensor] : extrait de recherche de la fiche Canon, page non ouverte.
  // Définition [canon-eos-2000d-sensor] : 24,1 millions, extrait de recherche. Bruit mesuré par crans entiers.
  { brand: "canon", format: "apsc", model: "Canon EOS 2000D", sensorWidthMm: 22.3, sensorHeightMm: 14.9,
    effectivePixels: 24100000, fullWellElectrons: 24222,
    readNoise: [[100, 10.27], [200, 5.39], [400, 3.07], [800, 2.03], [1600, 1.55], [3200, 1.27], [6400, 1.1]] },
];

export function findBody(brand: Brand, format: Format): Body {
  const body = BODIES.find((b) => b.brand === brand && b.format === format);
  if (!body) throw new Error(`Boîtier inconnu : ${brand} ${format}`);
  return body;
}
