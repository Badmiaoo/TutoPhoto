// Viseur : cadre aux proportions du capteur, et champ de vue de la caméra 3D réglé pour que ce cadre
// montre exactement ce que verrait le capteur avec la focale choisie ; positions des lignes des grilles de cadrage
// (depuis la version 0.3.87, sorties de ui/cameraPanel.ts pour les tests rapides).

import type { Body } from "./bodies";
import { fieldOfView } from "./optics";

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

/**
 * Grilles de cadrage (CMP-02, version 0.3.56 ; sorties de ui/cameraPanel.ts dans la version 0.3.87, pour les tests
 * rapides) : positions des lignes, en fractions du grand côté et du petit côté du cadre. Les mêmes grilles pour tous
 * les boîtiers (décision de Julien du 12 novembre 2026) : celles que les manuels lus nomment ou montrent.
 * - « thirds » : deux lignes dans chaque sens, aux tiers. Sony, « Grid Line », « Rule of 3rds Grid » : « Place
 *   main subjects close to one of the grid lines that divide the image into thirds for a well-balanced
 *   composition » (guides d'aide de l'A7 III et de l'A6000) [sony-a7iii-grid-line] [sony-a6000-grid-line] ; le
 *   nombre de lignes est déduit de ce texte, la page n'a pas d'illustration. Canon, « 3x3 » : « Displays grid lines
 *   in a 3x3 pattern » (manuel de l'EOS 850D) [canon-850d-grid-display].
 * - « sixteen » : trois lignes dans chaque sens, aux quarts, soit seize cases. Nikon, Digitutor du D5600, « Framing
 *   Grid (Live View) » : c'est ce que montre l'illustration de l'affichage « Framing grid » ; le texte de la page
 *   ne donne pas ce nombre [nikon-d5600-digitutor-framing-grid]. Lignes mesurées sur l'illustration à environ
 *   25 %, 50 % et 75 % du cadre ; les quarts exacts sont retenus.
 * - « twentyFour » : Canon, « 6x4 » : « Displays grid lines in a 6x4 pattern » [canon-850d-grid-display]. Six
 *   cases sur le grand côté et quatre sur le petit : sens déduit du nom, la page ne le dit pas (sur un capteur
 *   3:2, les cases sont alors carrées).
 * - « thirdsDiagonals » : Canon, « 3x3+diag » : « Displays a grid together with diagonal lines »
 *   [canon-850d-grid-display]. Deux diagonales d'un coin du cadre à l'autre : tracé déduit de l'icône du menu
 *   (capture du manuel de l'EOS R6) [canon-r6-shooting-info-display], la page ne le décrit pas.
 * Les manuels de Canon lus sont ceux de l'EOS 850D et de l'EOS R6, pas ceux des boîtiers du simulateur.
 * Par défaut, aucune grille : « d9 Framing grid display Off » sur le Z 6 [nikon-z6-defaults], « Off (default
 * setting) » sur l'A6000 [sony-a6000-grid-line]. Le manuel du Z 6 dit seulement « Choose On to display a grid for
 * reference when framing shots » [nikon-z6-d9] : son tracé n'est pas simulé.
 *   https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653165.html
 *   https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000518347.html
 *   https://imaging.nikon.com/imaging/support/digitutor/d5600/functions/framing_grid_liveview.html
 *   https://cam.start.canon/en/C002/manual/html/UG-09_Set-up_0200.html
 *   https://cam.start.canon/en/C004/manual/html/UG-03_Shooting-1_0360.html
 *   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_d09.html
 *   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html
 */
export type GridKind = "none" | "thirds" | "sixteen" | "twentyFour" | "thirdsDiagonals";
export interface GridLayout {
  /** Lignes qui divisent le grand côté du cadre, puis le petit côté, en fractions de ce côté. */
  long: readonly number[];
  short: readonly number[];
  diagonals: boolean;
}
const THIRDS = [1 / 3, 2 / 3] as const;
const QUARTERS = [1 / 4, 1 / 2, 3 / 4] as const;
export const GRIDS: Record<GridKind, GridLayout> = {
  none: { long: [], short: [], diagonals: false },
  thirds: { long: THIRDS, short: THIRDS, diagonals: false },
  sixteen: { long: QUARTERS, short: QUARTERS, diagonals: false },
  twentyFour: { long: [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6], short: QUARTERS, diagonals: false },
  thirdsDiagonals: { long: THIRDS, short: THIRDS, diagonals: true },
};
export const isGridKind = (value: unknown): value is GridKind => typeof value === "string" && Object.prototype.hasOwnProperty.call(GRIDS, value);

/**
 * Lignes d'une grille dans le cadre, en fractions de sa largeur (lignes verticales) et de sa hauteur (lignes
 * horizontales). Cadre vertical, plus haut que large : le grand côté du capteur est vertical, et les lignes du grand
 * côté (les six cases de « 6 × 4 ») le suivent.
 */
export function gridLines(kind: GridKind, tall: boolean): { vertical: readonly number[]; horizontal: readonly number[]; diagonals: boolean } {
  const layout = GRIDS[kind];
  return { vertical: tall ? layout.short : layout.long, horizontal: tall ? layout.long : layout.short, diagonals: layout.diagonals };
}
