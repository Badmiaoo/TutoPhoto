// Modèle du bruit du capteur, sans rendu (constat ARC-07 de l'audit, Sujet 27 du plan de corrections, version 0.3.87) :
// bruit de lecture, paramètres du bruit d'une image, grille des tirages du viseur, écart type et rapport signal sur
// bruit, seuils de l'indicateur d'équilibre. La même loi est écrite deux fois, côte à côte dans ce fichier : en
// TypeScript (noiseSigma), pour l'indicateur d'équilibre (ui/balance.ts), et en GLSL (NOISE_GLSL), pour le viseur
// (camera/noise.ts) et la photo (camera/photo.ts). Les tests rapides vérifient la première sur des valeurs
// (app/tests/noiseModel.test.ts), et de la seconde seulement le texte de ses lignes ; à l'exécution, la routine de
// test (scripts/test_app.cjs) ne vérifie le bruit qu'en gros (visible à ISO 6400, absent quand l'aperçu est coupé).
//
// Bruit numérique physique (docs/camera-physique.md ; décisions du 9 novembre 2026 : bruit coloré selon la matrice de
// Bayer, bruit brut sans réduction, dans le viseur et sur la photo).
//
// Pour un photosite, à la sensibilité S :
// - électrons à saturation : e_sat = capacité × 100 / S ;
// - électrons reçus : n = v × e_sat, v étant la valeur rapportée à la saturation (exposition comprise) ;
// - écart type : √(n + σ_r²), σ_r le bruit de lecture mesuré à cet ISO (interpolé en log-log).
// Un pixel de l'image regroupe k photosites ; pour chaque canal, seule une part capte sa couleur :
// la moitié pour le vert, un quart pour le rouge et pour le bleu (matrice de Bayer, deux fois plus de
// verts que de rouges ou de bleus [wikipedia-bayer-filter]
// https://en.wikipedia.org/w/index.php?title=Bayer_filter&oldid=1384004962 ). Écart type relatif à la saturation, par
// canal :
// σ = √(n + σ_r²) / (e_sat × √(k × part)).
// Vue à 100 % ou presque (loupe) : moins d'un photosite de la couleur par pixel. Le dématriçage interpole
// les couleurs manquantes, d'une manière propre à chaque boîtier et non documentée dans les sources lues ;
// on garde alors le bruit d'un photosite seul : k × part est ramené à 1 au moins.
// Viseur à une densité supérieure à 1 (version 0.3.52 : densité de l'écran, plafonnée à 2 en version 0.3.53) : un
// tirage indépendant par pixel calculé, k compté par pixel calculé. Quand un pixel calculé compte moins d'un
// photosite de rouge ou de bleu (loupe), le plancher de 1 laisse à chaque pixel calculé le bruit d'un photosite, et
// les densité² tirages d'un pixel CSS se moyennent : à densité 2, le bruit vu par pixel CSS était divisé par deux à
// 100 % (constat PHY-07 de l'audit ; mesuré le 20 novembre 2026 : 0,52 fois le bruit de la densité 1,
// docs/camera-physique.md, « Loupe »). Le tirage se fait alors sur la grille des pixels CSS, avec k compté par
// pixel CSS, comme dans le viseur à densité 1 (viewfinderNoiseGrid).
//
// Seuils du rapport signal sur bruit (indicateur d'équilibre et bulletin) : ceux de la norme des sensibilités
// numériques, 40:1, « excellent image quality », et 10:1, « acceptable image quality », définis pour 70 pixels par cm
// vus à 25 cm [wikipedia-film-speed] https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213 .

import type { Body } from "./bodies";

/** Part des photosites qui captent chaque canal (rouge, vert, bleu) dans une matrice de Bayer. */
const BAYER_SHARE = [0.25, 0.5, 0.25] as const;
/** Côté de la texture de tirages gaussiens, en pixels. */
export const NOISE_TILE = 512;

/** Canal de l'image : 0 rouge, 1 vert, 2 bleu (indice de NoiseParameters.photosites). */
export type Channel = 0 | 1 | 2;
/** Canal vert, seul lu par l'indicateur d'équilibre (ui/balance.ts). */
export const GREEN: Channel = 1;

export interface NoiseParameters {
  /** Électrons à saturation, par photosite. */
  saturation: number;
  /** Carré du bruit de lecture, en électrons². */
  readNoise2: number;
  /** Photosites par pixel de l'image, pour chaque canal. */
  photosites: [number, number, number];
}

/** Bruit de lecture à un ISO donné, interpolé entre les mesures en log₂(ISO) et log₂(électrons). */
export function readNoiseAt(body: Body, iso: number): number {
  const points = body.readNoise;
  if (iso <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  // Au-delà de la dernière mesure, on garde la dernière valeur (les trois boîtiers ont des mesures jusqu'à ISO 6400,
  // le haut de l'échelle de TutoPhoto).
  if (iso >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [isoB, rnB] = points[i];
    if (iso <= isoB) {
      const [isoA, rnA] = points[i - 1];
      const t = Math.log2(iso / isoA) / Math.log2(isoB / isoA);
      return 2 ** (Math.log2(rnA) + t * Math.log2(rnB / rnA));
    }
  }
  return last[1];
}

/** Grille des tirages du bruit du viseur : pixels de l'image pour compter k, taille d'une cellule de tirage. */
export interface NoiseGrid {
  /** Pixels de l'image (cadre entier, loupe comprise) sur lesquels k est compté. */
  imagePixels: number;
  /**
   * Facteur appliqué aux coordonnées du pixel calculé avant l'arrondi vers le bas : 1, un tirage par pixel calculé ;
   * le niveau de mise à l'échelle (1 / densité), un tirage par pixel CSS.
   */
  cellScale: number;
}

/**
 * Grille des tirages du viseur. computedPixels : pixels calculés du cadre, multipliés par le carré du grossissement de
 * la loupe ; scalingLevel : niveau de mise à l'échelle de Babylon.js, pixels CSS par pixel calculé (1 / densité).
 * Un tirage par pixel calculé tant que chacun compte au moins un photosite de chaque couleur (de rouge et de bleu, les
 * moins nombreux) ; sinon, à une densité supérieure à 1, un tirage par pixel CSS, k compté par pixel CSS (constat
 * PHY-07 de l'audit). À densité 1, rien ne change : pixels calculés et pixels CSS se confondent.
 */
export function viewfinderNoiseGrid(body: Body, computedPixels: number, scalingLevel: number): NoiseGrid {
  const k = body.effectivePixels / Math.max(1, computedPixels);
  if (scalingLevel >= 1 || k * Math.min(...BAYER_SHARE) >= 1) return { imagePixels: computedPixels, cellScale: 1 };
  return { imagePixels: computedPixels * scalingLevel * scalingLevel, cellScale: scalingLevel };
}

export function noiseParameters(body: Body, iso: number, imagePixels: number): NoiseParameters {
  const k = body.effectivePixels / Math.max(1, imagePixels);
  const rn = readNoiseAt(body, iso);
  return {
    saturation: (body.fullWellElectrons * 100) / iso,
    readNoise2: rn * rn,
    photosites: [Math.max(1, k * BAYER_SHARE[0]), Math.max(1, k * BAYER_SHARE[1]), Math.max(1, k * BAYER_SHARE[2])],
  };
}

/**
 * Écart type du bruit d'un canal, rapporté à la saturation, pour une valeur linéaire v rapportée à la saturation
 * (exposition comprise) : σ = √(n + σ_r²) / (e_sat × √(k × part)), avec n = max(v, 0) × e_sat. Même loi que
 * addSensorNoise, dans NOISE_GLSL ci-dessous.
 */
export function noiseSigma(v: number, params: NoiseParameters, channel: Channel): number {
  const electrons = Math.max(v, 0) * params.saturation;
  return Math.sqrt(electrons + params.readNoise2) / (params.saturation * Math.sqrt(params.photosites[channel]));
}

/** Rapport signal sur bruit d'un canal, pour la valeur linéaire v : v / σ. */
export function signalToNoise(v: number, params: NoiseParameters, channel: Channel): number {
  return v / noiseSigma(v, params, channel);
}

/** Seuil « excellent » du rapport signal sur bruit, 40:1 [wikipedia-film-speed]. */
export const SNR_EXCELLENT = 40;
/** Seuil « acceptable » du rapport signal sur bruit, 10:1 [wikipedia-film-speed]. */
export const SNR_ACCEPTABLE = 10;

/** Jugement du bruit : « ok » à 40:1 et au-delà, « warn » de 10:1 à 40:1, « bad » en deçà de 10:1. */
export type NoiseLevel = "ok" | "warn" | "bad";

export function noiseLevel(snr: number): NoiseLevel {
  return snr >= SNR_EXCELLENT ? "ok" : snr >= SNR_ACCEPTABLE ? "warn" : "bad";
}

/** Fonctions GLSL communes : ajout du bruit à une valeur linéaire rapportée à la saturation. */
export const NOISE_GLSL = `
uniform sampler2D noiseSampler;
uniform float noiseSaturation;
uniform float noiseRead2;
uniform vec3 noisePhotosites;
uniform vec4 noiseOffsets;
// Deux lectures de la texture de tirages gaussiens, la seconde tournée de 37 degrés, pour casser la
// répétition du motif ; la somme de deux tirages indépendants, divisée par racine de 2, reste gaussienne.
vec3 gaussianAt(vec2 pixel) {
  const float c = 0.79863551;
  const float s = 0.60181502;
  vec2 rotated = vec2(c * pixel.x - s * pixel.y, s * pixel.x + c * pixel.y);
  vec3 a = texture2D(noiseSampler, (pixel + noiseOffsets.xy) / ${NOISE_TILE.toFixed(1)}).rgb;
  vec3 b = texture2D(noiseSampler, (rotated + noiseOffsets.zw) / ${NOISE_TILE.toFixed(1)}).rgb;
  return (a + b) * 0.70710678;
}
vec3 addSensorNoise(vec3 v, vec2 pixel) {
  vec3 electrons = max(v, 0.0) * noiseSaturation;
  vec3 sigma = sqrt(electrons + noiseRead2) / (noiseSaturation * sqrt(noisePhotosites));
  return v + gaussianAt(pixel) * sigma;
}`;

/** Uniformes de NOISE_GLSL, à déclarer par les shaders qui l'incluent (texture des tirages à part). */
export const NOISE_UNIFORMS = ["noiseSaturation", "noiseRead2", "noisePhotosites", "noiseOffsets"];
