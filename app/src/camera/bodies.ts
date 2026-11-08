// Boîtiers de référence (décision du 8 novembre 2026, docs/camera-physique.md) : trois marques, chacune
// avec un plein format et un APS-C. Pour l'instant, seules les dimensions du capteur servent (champ de vue).
// Sources des dimensions, par boîtier, dans data/sources.yaml (identifiants entre crochets).

export type Brand = "nikon" | "sony" | "canon";
export type Format = "ff" | "apsc";

export interface Body {
  brand: Brand;
  format: Format;
  model: string;
  /** Dimensions du capteur, en millimètres (grand côté, petit côté). */
  sensorWidthMm: number;
  sensorHeightMm: number;
}

export const BODIES: readonly Body[] = [
  // [nikon-z6-specifications] : manuel en ligne Nikon, « 35.9 × 23.9 mm CMOS sensor ».
  { brand: "nikon", format: "ff", model: "Nikon Z 6", sensorWidthMm: 35.9, sensorHeightMm: 23.9 },
  // [nikon-d5600-sensor] : extrait de recherche, page non ouverte.
  { brand: "nikon", format: "apsc", model: "Nikon D5600", sensorWidthMm: 23.5, sensorHeightMm: 15.6 },
  // [sony-ilce-7m3-help-guide] : guide d'aide Sony, « 35.6 mm × 23.8 mm ».
  { brand: "sony", format: "ff", model: "Sony A7 III", sensorWidthMm: 35.6, sensorHeightMm: 23.8 },
  // [sony-ilce-6000-sensor] : extrait de recherche de la fiche Sony, page non ouverte.
  { brand: "sony", format: "apsc", model: "Sony A6000", sensorWidthMm: 23.5, sensorHeightMm: 15.6 },
  // [canon-eos-rp-sensor] : extrait de recherche de la fiche Canon, page non ouverte.
  { brand: "canon", format: "ff", model: "Canon EOS RP", sensorWidthMm: 35.9, sensorHeightMm: 24.0 },
  // [canon-eos-2000d-sensor] : extrait de recherche de la fiche Canon, page non ouverte.
  { brand: "canon", format: "apsc", model: "Canon EOS 2000D", sensorWidthMm: 22.3, sensorHeightMm: 14.9 },
];

export function findBody(brand: Brand, format: Format): Body {
  const body = BODIES.find((b) => b.brand === brand && b.format === format);
  if (!body) throw new Error(`Boîtier inconnu : ${brand} ${format}`);
  return body;
}
