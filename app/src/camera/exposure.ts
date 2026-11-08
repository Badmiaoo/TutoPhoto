// Réglages d'exposition par tiers de diaphragme, et calcul de l'exposition (docs/camera-physique.md).
//
// Les calculs utilisent les valeurs exactes des crans (puissances de 2), les écrans montrent les libellés
// usuels, comme sur un boîtier :
// - ouvertures : échelle par tiers de Wikipedia, article « F-number » [wikipedia-f-number] ;
// - ISO : échelle de Wikipedia, article « Film speed » [wikipedia-film-speed] ;
// - vitesses : crans entiers de 1/1000 à 1 s d'après Wikipedia, article « Shutter speed »
//   [wikipedia-shutter-speed], prolongés par doublement ; les libellés des crans intermédiaires
//   (1/1250, 1/640, etc.) sont les libellés usuels des boîtiers, non sourcés (décision du 8 novembre 2026).

/** Ouvertures : N exact = 2^(j/6), de f/1.4 (j = 3) à f/22 (j = 27). */
const APERTURE_LABELS = [
  "1.4", "1.6", "1.8", "2", "2.2", "2.5", "2.8", "3.2", "3.5", "4", "4.5", "5", "5.6",
  "6.3", "7.1", "8", "9", "10", "11", "13", "14", "16", "18", "20", "22",
] as const;
const APERTURE_FIRST_J = 3;

/** Vitesses : t exact = 2^(−k/3) secondes, de 30 s (k = −15) à 1/4000 s (k = 36). */
const SHUTTER_LABELS = [
  "30", "25", "20", "15", "13", "10", "8", "6", "5", "4", "3.2", "2.5", "2", "1.6", "1.3", "1",
  "0.8", "0.6", "1/2", "0.4", "0.3", "1/4", "1/5", "1/6", "1/8", "1/10", "1/13", "1/15", "1/20",
  "1/25", "1/30", "1/40", "1/50", "1/60", "1/80", "1/100", "1/125", "1/160", "1/200", "1/250",
  "1/320", "1/400", "1/500", "1/640", "1/800", "1/1000", "1/1250", "1/1600", "1/2000", "1/2500",
  "1/3200", "1/4000",
] as const;
const SHUTTER_FIRST_K = -15;

/** ISO : S exact = 100 × 2^(i/3), de 100 (i = 0) à 6400 (i = 18). */
const ISO_LABELS = [
  "100", "125", "160", "200", "250", "320", "400", "500", "640", "800", "1000", "1250", "1600",
  "2000", "2500", "3200", "4000", "5000", "6400",
] as const;

/**
 * Indice de lumination de la scène de parc pour ISO 100 (docs/camera-physique.md) : 12,5, à mi-chemin
 * entre « couvert lumineux » (13) et « couvert épais » (12) de la table de Wikipedia [wikipedia-exposure-value].
 */
export const SCENE_EV100 = 12.5;

export interface ExposureSettings {
  /** Position dans l'échelle des ouvertures (0 = f/1.4). */
  aperture: number;
  /** Position dans l'échelle des vitesses (0 = 30 s). */
  shutter: number;
  /** Position dans l'échelle des ISO (0 = ISO 100). */
  iso: number;
}

export const SCALES = {
  aperture: APERTURE_LABELS.length,
  shutter: SHUTTER_LABELS.length,
  iso: ISO_LABELS.length,
} as const;

export const apertureValue = (index: number): number => 2 ** ((APERTURE_FIRST_J + index) / 6);
export const shutterSeconds = (index: number): number => 2 ** (-(SHUTTER_FIRST_K + index) / 3);
export const isoValue = (index: number): number => 100 * 2 ** (index / 3);

export const apertureLabel = (index: number): string => APERTURE_LABELS[index];
export const shutterLabel = (index: number): string => SHUTTER_LABELS[index];
export const isoLabel = (index: number): string => ISO_LABELS[index];

/** EV₁₀₀ des réglages : log₂(N²/t) − log₂(S/100) (Filament [filament-pbr]). */
export function settingsEv100(s: ExposureSettings): number {
  const n = apertureValue(s.aperture);
  return Math.log2((n * n) / shutterSeconds(s.shutter)) - Math.log2(isoValue(s.iso) / 100);
}

/**
 * Écart à l'exposition correcte, en IL : positif si la photo est surexposée.
 * La scène reçoit 2^écart fois la lumière d'une exposition correcte.
 */
export function exposureOffset(s: ExposureSettings, sceneEv100 = SCENE_EV100): number {
  return sceneEv100 - settingsEv100(s);
}

/** Réglages de départ : f/8, 1/100 s, ISO 100, soit EV₁₀₀ 12,67, à −1/6 IL de la scène. */
export const DEFAULT_SETTINGS: ExposureSettings = {
  aperture: APERTURE_LABELS.indexOf("8"),
  shutter: SHUTTER_LABELS.indexOf("1/100"),
  iso: 0,
};

/** Focales proposées par l'objectif virtuel (18 à 200 mm, ouvrant à f/1.4 partout ; décision du 8 novembre 2026). */
export const FOCAL_LENGTHS = [18, 24, 28, 35, 50, 70, 85, 105, 135, 200] as const;
export const DEFAULT_FOCAL_INDEX = FOCAL_LENGTHS.indexOf(50);

/** Champ de vue le long d'un côté du capteur : 2 × atan(côté / (2 × focale)). */
export function fieldOfView(sideMm: number, focalMm: number): number {
  return 2 * Math.atan(sideMm / (2 * focalMm));
}
