// Viseur : cadre aux proportions du capteur, et champ de vue de la caméra 3D réglé pour que ce cadre
// montre exactement ce que verrait le capteur avec la focale choisie.

import type { Body } from "./bodies";
import { fieldOfView } from "./exposure";

export interface Frame {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Appareil tenu à la verticale : le grand côté du capteur est vertical. */
  portrait: boolean;
}

export interface CameraFov {
  /** Champ de vue de la caméra 3D, en radians, le long de l'axe donné. */
  fov: number;
  axis: "horizontal" | "vertical";
}

/** Plus grand cadre aux proportions du capteur qui tient dans le canevas, centré. */
export function frameFor(canvasWidth: number, canvasHeight: number, body: Body): Frame {
  const portrait = canvasHeight > canvasWidth;
  const ratio = body.sensorWidthMm / body.sensorHeightMm; // grand côté / petit côté
  const frameRatio = portrait ? 1 / ratio : ratio; // largeur / hauteur du cadre
  let width = canvasWidth;
  let height = width / frameRatio;
  if (height > canvasHeight) {
    height = canvasHeight;
    width = height * frameRatio;
  }
  return { left: (canvasWidth - width) / 2, top: (canvasHeight - height) / 2, width, height, portrait };
}

/**
 * Champ de vue de la caméra 3D : le cadre couvre le champ du capteur le long de son grand côté,
 * 2 × atan(grand côté / (2 × focale)) ; le canevas, plus grand que le cadre, voit un peu plus.
 */
export function cameraFov(canvasWidth: number, canvasHeight: number, frame: Frame, body: Body, focalMm: number): CameraFov {
  const half = Math.tan(fieldOfView(body.sensorWidthMm, focalMm) / 2);
  return frame.portrait
    ? { axis: "vertical", fov: 2 * Math.atan((half * canvasHeight) / frame.height) }
    : { axis: "horizontal", fov: 2 * Math.atan((half * canvasWidth) / frame.width) };
}
