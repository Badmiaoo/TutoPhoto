// Détection des visages et des yeux pour l'AF zone automatique (MAP-09, décision de Julien du 9 novembre 2026).
// Comportement du Nikon Z 6, d'après son manuel (« Focus » et réglage a4 « Auto-area AF face/eye detection »,
// lus le 9 novembre 2026) [nikon-z6-focus, nikon-z6-a4] :
//   https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_a04.html
// - le réglage a4 choisit ce qui est détecté : visages et yeux des personnes, visages seulement, chiens et
//   chats (« Animal detection »), ou rien ; personnes et animaux ne sont pas détectés en même temps ;
// - « it automatically focuses on one or the other of the subject's eyes, or on the subject's face if the
//   eyes are not detected » ;
// - la détection peut échouer si « the subject's face occupies a very large or very small proportion of the
//   frame » ou si les yeux sont cachés.
//
// Simulation (le manuel ne donne ni seuils ni règle de choix ; valeurs choisies pour TutoPhoto) :
// - un œil est vu s'il est dans la zone couverte par l'autofocus (MAP-06, ui/cameraPanel.ts) et si la carte
//   de profondeur, à son pixel, montre une surface à moins de 4 cm de l'œil : ni obstacle devant (nez, autre
//   personne), ni fond derrière quand le pixel tombe à côté de l'œil (le centre de l'œil d'un squelette est
//   environ 1 cm derrière la surface) ;
// - taille du visage : écart entre les yeux, rapporté au grand côté du cadre, sans la loupe ; visage
//   détecté de 0,4 % à 25 %, yeux détectés à partir de 0,8 % ;
// - œil retenu : le plus proche de l'appareil parmi les yeux vus.
// Non simulé : lumière, lunettes, cheveux, flou de mouvement, races ou espèces mal reconnues.

import { Vector3, type Matrix } from "@babylonjs/core/Maths/math.vector";

export type Detection = "faceEye" | "face" | "animal" | "off";
export type SubjectKind = "human" | "animal";

/** Visage d'un sujet de la scène : ses yeux (un ou deux) et l'écart réel entre eux. */
export interface FaceSubject {
  id: string;
  kind: SubjectKind;
  /** Positions des yeux dans la scène, à l'instant présent. */
  eyes(): Vector3[];
  /** Écart entre les yeux, en mètres, pour la taille du visage dans le cadre. */
  eyeSpacing: number;
}

/** Point dans le canevas (de 0 à 1, origine en haut à gauche). */
export interface CanvasPoint {
  x: number;
  y: number;
}

export interface DetectedFace {
  id: string;
  /** Œil retenu, si les yeux sont détectés ; sinon le visage. */
  target: "eye" | "face";
  /** Point de mise au point : l'œil retenu, ou le milieu des yeux vus. */
  point: CanvasPoint;
  /** Écart entre les yeux dans le canevas, en fraction de sa largeur (taille du repère). */
  spacing: number;
}

export interface DetectionView {
  detection: Detection;
  /** Zone couverte par l'autofocus dans le canevas, en fractions : les yeux hors de cette zone ne sont pas vus. */
  frame: { left: number; top: number; right: number; bottom: number };
  /** Grand côté du cadre, en pixels du canevas, sans la loupe. */
  frameLongSidePx: number;
  /** Grossissement de la loupe (1 sans loupe). */
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
}

const OCCLUSION_TOLERANCE_M = 0.04;
const FACE_MIN = 0.004;
const FACE_MAX = 0.25;
const EYES_MIN = 0.008;

/**
 * Visages détectés. depthAt lit la carte de profondeur du viseur (z dans le repère de la caméra, en mètres)
 * au point du canevas donné ; null si la lecture échoue.
 */
export async function detectFaces(
  subjects: readonly FaceSubject[],
  view: Matrix,
  projection: Matrix,
  minZ: number,
  settings: DetectionView,
  depthAt: (point: CanvasPoint) => Promise<number | null>,
): Promise<DetectedFace[]> {
  if (settings.detection === "off") return [];
  const kind: SubjectKind = settings.detection === "animal" ? "animal" : "human";
  const m = projection.asArray();
  // Distance focale en pixels du canevas, loupe comprise : m0 × largeur / 2.
  const focalPx = (m[0] * settings.canvasWidth) / 2;
  const found: DetectedFace[] = [];
  for (const subject of subjects) {
    if (subject.kind !== kind) continue;
    const seen: { point: CanvasPoint; z: number }[] = [];
    let zSum = 0;
    let zCount = 0;
    for (const world of subject.eyes()) {
      const eye = Vector3.TransformCoordinates(world, view);
      if (!(eye.z > minZ)) continue;
      zSum += eye.z;
      zCount++;
      const clip = Vector3.TransformCoordinates(eye, projection);
      const point = { x: (clip.x + 1) / 2, y: (1 - clip.y) / 2 };
      const f = settings.frame;
      if (point.x < f.left || point.x > f.right || point.y < f.top || point.y > f.bottom) continue;
      const surface = await depthAt(point);
      if (surface === null || Math.abs(surface - eye.z) > OCCLUSION_TOLERANCE_M) continue;
      seen.push({ point, z: eye.z });
    }
    if (seen.length === 0 || zCount === 0) continue;
    // Taille : écart réel des yeux projeté, sans la loupe, rapporté au grand côté du cadre.
    const spacingPx = (subject.eyeSpacing * focalPx) / (zSum / zCount);
    const size = spacingPx / settings.zoom / settings.frameLongSidePx;
    if (size < FACE_MIN || size > FACE_MAX) continue;
    const eyes = settings.detection !== "face" && size >= EYES_MIN;
    const nearest = seen.reduce((a, b) => (b.z < a.z ? b : a));
    const point = eyes
      ? nearest.point
      : { x: seen.reduce((s, e) => s + e.point.x, 0) / seen.length, y: seen.reduce((s, e) => s + e.point.y, 0) / seen.length };
    found.push({ id: subject.id, target: eyes ? "eye" : "face", point, spacing: spacingPx / settings.canvasWidth });
  }
  return found;
}

/** Visage dont le point est le plus proche du point donné, dans le canevas (en pixels). */
export function nearestFace(faces: readonly DetectedFace[], point: CanvasPoint, width: number, height: number): DetectedFace | null {
  let best: DetectedFace | null = null;
  let bestDistance = Infinity;
  for (const face of faces) {
    const d = Math.hypot((face.point.x - point.x) * width, (face.point.y - point.y) * height);
    if (d < bestDistance) {
      best = face;
      bestDistance = d;
    }
  }
  return best;
}
