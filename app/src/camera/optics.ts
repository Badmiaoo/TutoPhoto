// Optique et géométrie de la prise de vue, sans rendu (constat ARC-07 de l'audit, Sujet 27 du plan de corrections,
// version 0.3.87) : champ de vue, flou acceptable et zone nette, cercle de confusion, position et traînée sur le
// capteur, rayon d'un point du cadre et distance du sol, fenêtre d'une projection, format de la photo, et plan des
// rendus de la photo calculée. Ces formules étaient écrites dans les fichiers de rendu (camera/photo.ts,
// camera/viewfinderDof.ts, camera/autofocus.ts), dans l'interface (ui/balance.ts, ui/cameraPanel.ts, ui/topView.ts,
// ui/challenges.ts), dans le bulletin (camera/bulletin.ts) et dans deux petits modules (camera/sharpZone.ts,
// camera/exposure.ts), certaines deux fois ; elles sont ici une fois, et testées sans navigateur
// (app/tests/optics.test.ts). Les shaders gardent leur écriture en GLSL du cercle de confusion (camera/photo.ts,
// camera/viewfinderDof.ts) et de la distance du sol (camera/photo.ts) : ils reçoivent leurs facteurs de ce module, et
// ces écritures ne sont vérifiées que par la routine de test (scripts/test_app.cjs).
//
// Unités : focales, côtés du capteur, cercles de confusion et traînées en mm ; distances de la scène en mètres (une
// unité de la scène = 1 m) ; vitesses en m/s ; durées en secondes.

/** Point ou vecteur du repère de la caméra (x à droite, y en haut, z le long de l'axe de visée), en mètres. */
export interface CameraPoint {
  x: number;
  y: number;
  z: number;
}

/** Point du cadre, de 0 à 1, origine en haut à gauche. */
export interface FramePoint {
  x: number;
  y: number;
}

// ——— Champ de vue ———

/** Tangente du demi-champ le long d'un côté du capteur : côté / (2 × focale). */
export function halfFieldTangent(sideMm: number, focalMm: number): number {
  return sideMm / (2 * focalMm);
}

/** Champ de vue le long d'un côté du capteur, en radians : 2 × atan(côté / (2 × focale)). */
export function fieldOfView(sideMm: number, focalMm: number): number {
  return 2 * Math.atan(halfFieldTangent(sideMm, focalMm));
}

// ——— Zone nette et cercle de confusion ———
// Zone nette (NET-01) : limites proche et lointaine autour de la distance de mise au point, par la formule du cercle
// de confusion, c = A × |S₂ − S₁| / S₂ × f / (S₁ − f) avec A = f / N [wikipedia-circle-of-confusion]
// https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423 , en posant c égal au flou
// acceptable d / 1500 (d : diagonale du capteur). Avec q = c × N × (S₁ − f) / f², limite proche S₁ / (1 + q),
// limite lointaine S₁ / (1 − q), ou l'infini si q ≥ 1. Partagée par le bulletin, l'indicateur d'équilibre et la vue
// de dessus. Le flou de la photo et celui de l'aperçu du viseur suivent la même formule (cocAtInfinityMm, cocAt) :
// un point aux limites de la zone nette y a un flou égal au flou acceptable.

/** Diviseur du flou acceptable : diagonale du capteur / 1500 [wikipedia-circle-of-confusion]. */
const BLUR_LIMIT_DIVISOR = 1500;

/** Flou acceptable, en millimètres : diagonale du capteur / 1500. */
export function blurLimitMm(sensorWidthMm: number, sensorHeightMm: number): number {
  return Math.hypot(sensorWidthMm, sensorHeightMm) / BLUR_LIMIT_DIVISOR;
}

/** Limites de la zone nette, en mètres, pour une focale en mm, une ouverture N et une distance S₁ en mètres. */
export function sharpZone(focalMm: number, aperture: number, distanceM: number, blurMm: number): { near: number; far: number } {
  const q = (blurMm * aperture * (distanceM * 1000 - focalMm)) / (focalMm * focalMm);
  return { near: distanceM / (1 + q), far: q < 1 ? distanceM / (1 - q) : Infinity };
}

/**
 * Diamètre, en mm sur le capteur, du cercle de confusion d'un point à l'infini, mise au point à la distance S :
 * (f / N) × f / (S − f), limite de c = A × f × |D − S| / (D × (S − f)), A = f / N, quand D tend vers l'infini.
 */
export function cocAtInfinityMm(focalMm: number, aperture: number, focusDistanceM: number): number {
  const S = focusDistanceM * 1000;
  return (focalMm / aperture) * (focalMm / (S - focalMm));
}

/**
 * Cercle de confusion d'un point à la profondeur D, mise au point à la distance S, dans l'unité de cocAtInfinity (mm du
 * capteur, ou pixels) : cocAtInfinity × |D − S| / D. Écrit aussi en GLSL dans les shaders de la photo et du viseur.
 */
export function cocAt(cocAtInfinity: number, focusDistanceM: number, depthM: number): number {
  return (cocAtInfinity * Math.abs(depthM - focusDistanceM)) / depthM;
}

/**
 * Distance de mise au point la plus courte que les formules admettent, en mètres : 1,01 × la focale. Le cercle de
 * confusion et le disque d'ouverture de la photo divisent par S − f, qui doit rester positif (lentille mince).
 */
export function minFocusDistanceM(focalMm: number): number {
  return (focalMm / 1000) * 1.01;
}

// ——— Position et traînée sur le capteur ———
// Projection d'un point (X, Y, Z) du repère de la caméra : x = f X / Z, y = f Y / Z. Un point de vitesse
// (V_X, V_Y, V_Z) se déplace sur le capteur de f (V_X Z − X V_Z) / Z² par seconde (et de même en y) ; sa traînée
// pendant la pose est cette vitesse × la durée de pose. Jugée par le bulletin, l'indicateur d'équilibre et la vue de
// dessus (camera/bulletin.ts, measureThing ; constat PHY-17, version 0.3.69).

/** Position sur le capteur, en mm depuis son centre, d'un point du repère de la caméra : x = f X / Z, y = f Y / Z. */
export function sensorPosition(p: CameraPoint, focalMm: number): { x: number; y: number } {
  return { x: (focalMm * p.x) / p.z, y: (focalMm * p.y) / p.z };
}

/** Le point du capteur est-il dans le cadre : |x| ≤ largeur / 2 et |y| ≤ hauteur / 2, côtés échangés en cadre vertical. */
export function onSensor(position: { x: number; y: number }, sensorWidthMm: number, sensorHeightMm: number, portrait: boolean): boolean {
  const halfW = (portrait ? sensorHeightMm : sensorWidthMm) / 2;
  const halfH = (portrait ? sensorWidthMm : sensorHeightMm) / 2;
  return Math.abs(position.x) <= halfW && Math.abs(position.y) <= halfH;
}

/** Vitesse sur le capteur, en mm/s, d'un point P du repère de la caméra de vitesse V : f (V_X Z − X V_Z) / Z², de même en y. */
export function sensorVelocity(p: CameraPoint, v: CameraPoint, focalMm: number): { x: number; y: number } {
  return {
    x: (focalMm * (v.x * p.z - p.x * v.z)) / (p.z * p.z),
    y: (focalMm * (v.y * p.z - p.y * v.z)) / (p.z * p.z),
  };
}

/** Traînée pendant la pose, en mm sur le capteur : norme de la vitesse sur le capteur × durée de pose. */
export function trailMm(velocityOnSensor: { x: number; y: number }, shutterSeconds: number): number {
  return Math.hypot(velocityOnSensor.x, velocityOnSensor.y) * shutterSeconds;
}

/**
 * Traînée d'un sujet vu de face à la profondeur D, en mm sur le capteur : v × t × f / D. Estimation dont la photo se
 * sert pour choisir son nombre de rendus (camera/photo.ts), à la position au sol des sujets ; la traînée jugée est
 * celle de sensorVelocity, aux points jugés. Les deux s'accordent pour un point sur l'axe qui se déplace en travers.
 */
export function frontalTrailMm(speed: number, shutterSeconds: number, focalMm: number, depthM: number): number {
  return (speed * shutterSeconds * focalMm) / depthM;
}

// ——— Format de la photo ———

/** Grand côté de la photo, en pixels. */
export const PHOTO_LONG_SIDE = 1500;

/**
 * Dimensions, en pixels, d'une image du capteur dont le grand côté fait longSide pixels : petit côté arrondi aux
 * proportions du capteur (grand côté d'abord, camera/bodies.ts) ; largeur et hauteur échangées en cadre vertical.
 */
export function photoSize(sensorWidthMm: number, sensorHeightMm: number, longSide: number, portrait: boolean): { width: number; height: number } {
  const shortSide = Math.round((longSide * sensorHeightMm) / sensorWidthMm);
  return portrait ? { width: shortSide, height: longSide } : { width: longSide, height: shortSide };
}

/** Longueur sur le capteur, en mm, convertie en pixels d'une image de grand côté longSide : mm × longSide / grand côté. */
export function sensorMmToPixels(mm: number, sensorLongSideMm: number, longSide: number = PHOTO_LONG_SIDE): number {
  return (mm * longSide) / sensorLongSideMm;
}

// ——— Rayon d'un point du cadre et distance du sol ———
// Projection de la caméra : le tableau de Matrix.asArray() de Babylon.js ; un point du repère de la caméra se projette
// en x_ndc = x × m0 / z + m8 et y_ndc = y × m5 / z + m9 (coordonnées normalisées, de −1 à 1, y vers le haut).

/** Hauteur de l'œil au-dessus du sol et rayon de la sphère du fond (scene.ts), en mètres. */
export interface GroundInfo {
  eyeHeight: number;
  domeRadius: number;
}

/**
 * Direction, dans le repère de la caméra et à z = 1, du rayon qui passe par un point du cadre (de 0 à 1, origine en
 * haut à gauche) : x = (2 x_cadre − 1 − m8) / m0, y = (1 − 2 y_cadre − m9) / m5. Un point vu à la profondeur z est en
 * z × ce rayon.
 */
export function rayThrough(projection: ArrayLike<number>, point: FramePoint): CameraPoint {
  const m = projection;
  return { x: (point.x * 2 - 1 - m[8]) / m[0], y: (1 - point.y * 2 - m[9]) / m[5], z: 1 };
}

/**
 * Distance du plan du sol le long du rayon qui passe par le point donné du cadre, en z dans le repère de la caméra :
 * −hauteur de l'œil / pente, la pente étant le produit scalaire du rayon et de la verticale vue de la caméra ;
 * au plus le rayon de la sphère du fond, et Infinity si le rayon ne descend pas. Écrite aussi en GLSL dans le shader
 * de la photo (camera/photo.ts).
 */
export function groundDepth(projection: { asArray(): ArrayLike<number> }, upInCamera: CameraPoint, ground: GroundInfo, point: FramePoint): number {
  const ray = rayThrough(projection.asArray(), point);
  const slope = upInCamera.x * ray.x + upInCamera.y * ray.y + upInCamera.z * ray.z;
  return slope < 0 ? Math.min(ground.domeRadius, -ground.eyeHeight / slope) : Infinity;
}

/**
 * Part du rayon de la sphère du fond au-delà de laquelle une profondeur de la carte est celle de la sphère, et non
 * d'un objet de la scène : 0,8 (choix de TutoPhoto).
 */
const BACKDROP_DEPTH_SHARE = 0.8;

/** Profondeur au-delà de laquelle la carte de profondeur voit la sphère du fond, en mètres : 0,8 × son rayon. */
export function backdropDepth(ground: GroundInfo): number {
  return BACKDROP_DEPTH_SHARE * ground.domeRadius;
}

/**
 * Profondeur d'un point du cadre, en mètres : celle lue dans la carte de profondeur, sauf si elle n'est pas au-delà du
 * plan proche de la caméra (minZ), ou si c'est celle de la sphère du fond (au-delà de backdropDepth). Le sol de la
 * photo n'étant pas dans la carte, on prend alors la distance du plan du sol le long du rayon, au plus le rayon du
 * fond. Mesure de l'autofocus (camera/autofocus.ts) et de la photo au déclenchement (camera/photo.ts).
 */
export function depthOrGround(
  mapDepth: number,
  minZ: number,
  projection: { asArray(): ArrayLike<number> },
  upInCamera: CameraPoint,
  ground: GroundInfo,
  point: FramePoint,
): number {
  if (!(mapDepth > minZ) || mapDepth > backdropDepth(ground)) {
    return Math.min(ground.domeRadius, groundDepth(projection, upInCamera, ground, point));
  }
  return mapDepth;
}

// ——— Fenêtre d'une projection ———

/**
 * Projection resserrée sur une fenêtre de l'image, en coordonnées normalisées : x' = (x − centre) × grossissement, soit
 * m0 et m8 − centre multipliés par le grossissement horizontal, m5 et m9 − centre par le grossissement vertical. La
 * loupe du viseur (ui/cameraPanel.ts) et la fenêtre calculée d'une photo (camera/photo.ts, loupe de l'écran de revue)
 * passent par elle.
 */
export function windowProjection(projection: ArrayLike<number>, center: { x: number; y: number }, zoom: { x: number; y: number }): number[] {
  const m = Array.from(projection);
  m[0] *= zoom.x;
  m[5] *= zoom.y;
  m[8] = (m[8] - center.x) * zoom.x;
  m[9] = (m[9] - center.y) * zoom.y;
  return m;
}

/**
 * Fenêtre d'une image de fullWidth × fullHeight pixels (gauche, haut, largeur, hauteur, en pixels, origine en haut à
 * gauche), en coordonnées normalisées : centre et grossissement à donner à windowProjection.
 */
export function pixelWindow(
  crop: { left: number; top: number; width: number; height: number },
  fullWidth: number,
  fullHeight: number,
): { center: { x: number; y: number }; zoom: { x: number; y: number } } {
  const x0 = (crop.left / fullWidth) * 2 - 1;
  const x1 = ((crop.left + crop.width) / fullWidth) * 2 - 1;
  const yTop = 1 - (crop.top / fullHeight) * 2;
  const yBottom = 1 - ((crop.top + crop.height) / fullHeight) * 2;
  return {
    center: { x: (x0 + x1) / 2, y: (yTop + yBottom) / 2 },
    zoom: { x: 2 / (x1 - x0), y: 2 / (yTop - yBottom) },
  };
}

// ——— Photo par accumulation de rendus (camera/photo.ts) ———
// Haeberli et Akeley, 1990 (docs/camera-physique.md, décisions du 8 novembre 2026). Chaque rendu place l'œil en un
// point du disque d'ouverture et décentre le cadrage pour garder fixe le plan de netteté ; ce modèle d'œil déplacé
// donne un flou plus petit que la formule des lentilles minces d'un facteur (S − f) / S, d'où un disque élargi de
// S / (S − f). Chaque rendu correspond aussi à un instant du temps de pose.
// - Nombre de rendus M : de quoi espacer les copies d'un grand flou de 4 px au plus (espacement estimé à
//   0,9 × flou / √M sur un disque, flou / M le long d'un mouvement), de 16 à 256 ; la photo s'arrête aussi à 5 s.
// - Lissage : flou résiduel de rayon 0,45 × flou / √M, selon la profondeur de la vue centrale.

/** Espacement visé entre les copies d'un flou, en pixels de la photo. */
const MAX_SPACING_PX = 4;
/** Nombre de rendus d'une photo, au moins et au plus. */
export const MIN_SAMPLES = 16;
export const MAX_SAMPLES = 256;
/** Angle d'or, en radians : π × (3 − √5). Répartit régulièrement les points sur le disque. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Nombre de rendus prévu : (0,9 × plus grand flou de mise au point / 4)², arrondi au-dessus, pour le disque, et
 * plus longue traînée / 4, arrondie au-dessus, pour le mouvement, en pixels de la photo ; le plus grand des deux,
 * de 16 à 256.
 */
export function plannedSamples(largestCocPx: number, longestTrailPx: number): number {
  return Math.min(
    MAX_SAMPLES,
    Math.max(MIN_SAMPLES, Math.ceil(((0.9 * largestCocPx) / MAX_SPACING_PX) ** 2), Math.ceil(longestTrailPx / MAX_SPACING_PX)),
  );
}

/** Rayon du disque d'ouverture où se place l'œil, en mètres : (A / 2) × S / (S − f), A = f / N. */
export function eyeDiskRadiusM(focalMm: number, aperture: number, focusDistanceM: number): number {
  const f = focalMm / 1000;
  const A = f / aperture;
  return (A / 2) * (focusDistanceM / (focusDistanceM - f));
}

/** Place de l'œil pour le rendu i sur M : rayon × √((i + 0,5) / M), à l'angle i × angle d'or, en mètres. */
export function eyeOffset(i: number, samples: number, radiusM: number): { x: number; y: number } {
  const r = radiusM * Math.sqrt((i + 0.5) / samples);
  const a = i * GOLDEN_ANGLE;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

/**
 * Projection décentrée pour l'œil déplacé de (dx, dy), qui garde fixe le plan de netteté z = S :
 * m8 + dx × m0 / S et m9 + dy × m5 / S.
 */
export function shiftedProjection(projection: ArrayLike<number>, dx: number, dy: number, focusDistanceM: number): number[] {
  const m = Array.from(projection);
  m[8] += (dx * m[0]) / focusDistanceM;
  m[9] += (dy * m[5]) / focusDistanceM;
  return m;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Pas de la permutation des instants, décorrélée des places sur le disque : environ 0,618 × M, augmenté jusqu'à être
 * premier avec M, pour que i × pas modulo M parcoure chaque instant une fois.
 */
export function instantStride(samples: number): number {
  let stride = Math.max(1, Math.round(samples * 0.618));
  while (gcd(stride, samples) !== 1) stride++;
  return stride;
}

/** Instant du rendu i, en part du temps de pose, de 0 à 1 : ((i × pas) modulo M + 0,5) / M. */
export function sampleInstant(i: number, samples: number, stride: number): number {
  return (((i * stride) % samples) + 0.5) / samples;
}

/** Facteur du lissage de la photo, pour M rendus : 0,45 / √M (rayon = facteur × flou). */
export function smoothingFactor(samples: number): number {
  return 0.45 / Math.sqrt(samples);
}
