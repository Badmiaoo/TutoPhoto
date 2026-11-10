// Modes d'exposition M, A et S, correction d'exposition et ISO auto (BOI-07, BOI-08, MES-04, MES-10 ; décision de
// Julien du 10 novembre 2026). Comportement du Nikon Z 6, d'après son manuel en ligne, lu le 10 novembre 2026 :
// - « The Mode Dial » [nikon-z6-mode-dial] : en S, « you choose the shutter speed while the camera automatically
//   selects the aperture that will produce the optimal exposure » ; en A, l'inverse ; en M, « you control both
//   shutter speed and aperture », et avec l'ISO auto « ISO sensitivity will automatically be adjusted for optimal
//   exposure at the selected shutter speed and aperture » ;
// - « Indicators and Error Messages » [nikon-z6-indicators] : hors des limites de l'appareil, « Exposure
//   indicators and shutter speed or aperture display flash » (« Subject too bright » ou « too dark ») ;
// - « The E (Exposure Compensation) Button » [nikon-z6-exposure-compensation] : de −5 à +5 IL par tiers ; « In mode
//   M, exposure compensation affects only the exposure indicator », sauf avec l'ISO auto, qui en tient compte ;
// - « The S (ISO Sensitivity) Button » et « ISO sensitivity settings » [nikon-z6-iso-button, nikon-z6-iso-settings] :
//   l'ISO auto agit « if optimal exposure cannot be achieved at the value selected » ; plafond (« Maximum
//   sensitivity »), qui cède à la valeur choisie si elle est plus haute ; vitesse minimale « below which auto ISO
//   sensitivity control will kick in to prevent underexposure in modes P and A ».
// Le manuel du Z 6 ne donne pas la sensibilité la plus basse de l'ISO auto, ni s'il baisse la sensibilité en A.
// Celui du D850 [nikon-d850-auto-iso] le dit : « the minimum value for auto ISO sensitivity is automatically set to
// ISO 64 » (sa sensibilité la plus basse ; ISO 100 au Z 6, et dans TutoPhoto) et, en P et A, « sensitivity will only
// be adjusted if underexposure would result at the shutter speed selected for Minimum shutter speed ». Retenu ici.
//   https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_01.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/13_troubleshooting_02.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_03.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_02.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_08.html
//   https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html
//
// Choix de TutoPhoto, non sourcés : l'appareil choisit la vitesse, l'ouverture ou la sensibilité par tiers d'IL,
// sur les échelles du boîtier virtuel ; à égalité entre deux crans (la scène est à 12,5 IL), il prend celui qui
// assombrit la photo.
//
// Calcul. EV₁₀₀ des réglages : log₂(N²) − log₂(t) − log₂(S/100). Sur les échelles (camera/exposure.ts), N² = 2^((3 + a)/3),
// t = 2^(−(s − 15)/3), S/100 = 2^(i/3) ; d'où EV₁₀₀ = (a + s − i − 12)/3, en indices a, s, i. L'exposition optimale
// avec une correction de c tiers d'IL demande EV₁₀₀ = EV₁₀₀ de la scène − c/3, soit a + s − i = 3 × EV₁₀₀ scène + 12 − c.

import { SCALES, SCENE_EV100, exposureOffset, type ExposureSettings } from "./exposure";

export type ExposureMode = "M" | "A" | "S";

export interface ExposureControl {
  mode: ExposureMode;
  /** Réglages choisis : ouverture (A et M), vitesse (S et M), sensibilité de la commande ISO. */
  chosen: ExposureSettings;
  /** Correction d'exposition, en tiers d'IL (de −15 à 15). */
  compensation: number;
  /** Contrôle de la sensibilité auto. */
  autoIso: boolean;
  /** Sensibilité maximale de l'ISO auto : indice dans l'échelle des ISO. */
  maxIso: number;
  /** Vitesse d'obturation minimale de l'ISO auto (mode A) : indice dans l'échelle des vitesses. */
  minShutter: number;
}

export interface ResolvedExposure {
  /** Réglages retenus par l'appareil. */
  settings: ExposureSettings;
  /** Écart à l'exposition correcte de la scène, en IL : la photo reçoit 2^écart fois la lumière correcte. */
  offset: number;
  /**
   * Indicateur d'exposition, en IL : en M, écart à l'exposition visée (correction comprise) ; en A et S, écart à
   * l'exposition mesurée, qui montre donc la correction.
   */
  indicator: number;
  /** Limites dépassées en A ou en S : la vitesse (A) ou l'ouverture (S) clignote avec l'indicateur. */
  flashing: "aperture" | "shutter" | null;
  /** La sensibilité retenue n'est pas celle de la commande ISO. */
  isoAltered: boolean;
}

/** Correction d'exposition : de −5 à +5 IL par tiers [nikon-z6-exposure-compensation]. */
export const COMPENSATION_RANGE = 15;

/** Cran le plus proche ; à égalité, celui qui va dans le sens « darker » (+1 ou −1). */
function nearest(value: number, darker: 1 | -1): number {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (Math.abs(fraction - 0.5) < 1e-9) return darker > 0 ? floor + 1 : floor;
  return Math.round(value);
}

const clampIndex = (value: number, size: number) => Math.min(size - 1, Math.max(0, value));

/** Réglages retenus par l'appareil pour la scène de luminosité sceneEv100. */
export function resolveExposure(control: ExposureControl, sceneEv100 = SCENE_EV100): ResolvedExposure {
  const { mode, chosen, compensation, autoIso } = control;
  // Somme visée a + s − i (voir l'en-tête).
  const target = 3 * sceneEv100 + 12 - compensation;
  const upperIso = Math.max(control.maxIso, chosen.iso);
  let { aperture, shutter, iso } = chosen;
  let flashing: ResolvedExposure["flashing"] = null;

  if (mode === "M") {
    // Avec l'ISO auto, la sensibilité donne l'exposition visée, de ISO 100 au plafond.
    if (autoIso) iso = Math.min(upperIso, clampIndex(nearest(aperture + shutter - target, -1), SCALES.iso));
  } else if (mode === "A") {
    let needed = target - aperture + iso;
    // ISO auto : la sensibilité ne monte que si la vitesse passerait sous la vitesse minimale.
    if (autoIso && needed < control.minShutter) {
      iso = Math.min(upperIso, Math.max(chosen.iso, nearest(control.minShutter + aperture - target, -1)));
      needed = target - aperture + iso;
      if (nearest(needed, 1) < control.minShutter && iso < upperIso) {
        iso++;
        needed = target - aperture + iso;
      }
    }
    shutter = nearest(needed, 1);
    if (shutter < 0 || shutter > SCALES.shutter - 1) flashing = "shutter";
    shutter = clampIndex(shutter, SCALES.shutter);
  } else {
    let needed = target - shutter + iso;
    // ISO auto : la sensibilité change quand l'ouverture ne suffit plus, dans un sens ou dans l'autre.
    if (autoIso && (needed < 0 || needed > SCALES.aperture - 1)) {
      const edge = needed < 0 ? 0 : SCALES.aperture - 1;
      iso = clampIndex(Math.min(upperIso, nearest(edge + shutter - target, -1)), SCALES.iso);
      needed = target - shutter + iso;
    }
    aperture = nearest(needed, 1);
    if (aperture < 0 || aperture > SCALES.aperture - 1) flashing = "aperture";
    aperture = clampIndex(aperture, SCALES.aperture);
  }

  const settings = { aperture, shutter, iso };
  const offset = exposureOffset(settings, sceneEv100);
  return {
    settings,
    offset,
    indicator: mode === "M" ? offset - compensation / 3 : offset,
    flashing,
    isoAltered: iso !== chosen.iso,
  };
}
