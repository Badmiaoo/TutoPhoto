// Affichage de diagnostic et capacités de l'appareil (Sujet 28 du plan de corrections, constats ARC-06 et ARC-13 de
// l'audit, version 0.3.88), part sans rendu : le paramètre de l'adresse qui ouvre l'affichage, les capacités de rendu
// en flottants que demandent la photo et l'autofocus, le compteur des images du viseur et les lignes de l'affichage.
// La part qui lit Babylon.js et écrit dans la page est ui/diagnosticView.ts ; le contrôle des capacités au démarrage
// et le refus du déclenchement sont dans main.ts et ui/shutter.ts. Ce que mesure l'affichage, et ses limites :
// docs/pile-technique.md, « Prise en charge des navigateurs ».

import { t, type MessageKey } from "./texts";

/** Paramètre de l'adresse qui ouvre l'affichage : « simulateur/?diagnostic », avec ou sans valeur. */
export const DIAGNOSTIC_PARAMETER = "diagnostic";

/** L'adresse demande-t-elle l'affichage de diagnostic ? `search` : la partie « ?… » de l'adresse. */
export function diagnosticRequested(search: string): boolean {
  return new URLSearchParams(search).has(DIAGNOSTIC_PARAMETER);
}

/**
 * Valeur du paramètre qui calcule aussi le viseur à la densité complète de l'écran, sans le plafond de 2 pixels calculés
 * par pixel CSS (main.ts, MAX_DEVICE_RATIO, version 0.3.53) : « simulateur/?diagnostic=densite-complete ». Elle charge
 * le processeur graphique, pour comparer deux versions par leur débit sous la cadence de l'écran quand la durée d'une
 * image ne se mesure pas côté processeur graphique (contre-vérification d'ARC-06 ; docs/pile-technique.md).
 */
export const FULL_DENSITY_VALUE = "densite-complete";

/** L'adresse demande-t-elle le viseur à la densité complète de l'écran ? */
export function fullDensityRequested(search: string): boolean {
  return new URLSearchParams(search).get(DIAGNOSTIC_PARAMETER) === FULL_DENSITY_VALUE;
}

/**
 * Capacités exigées, sous leur nom dans Babylon.js 9.35.0 (`engine.getCaps()`) : la photo rend chaque image dans une
 * texture en demi-flottants et fait sa somme dans deux textures en flottants de 32 bits (camera/photo.ts), et
 * l'autofocus rend sa carte de profondeur en flottants de 32 bits (camera/autofocus.ts), que l'aperçu de la profondeur
 * de champ lit aussi (camera/viewfinderDof.ts). Sans l'une d'elles, la photo sort presque noire ; sans
 * `textureFloatRender`, l'autofocus ne voit plus les sujets et l'aperçu floute tout le cadre autant que sa partie la
 * plus floue (constat ARC-13, et essais de la version 0.3.88, extension masquée). En WebGL 2, Babylon.js tire les deux
 * de la même extension ; en WebGL 1, il les essaie l'une après l'autre.
 */
export const REQUIRED_FLOAT_CAPS = ["textureFloatRender", "textureHalfFloatRender"] as const;

/**
 * Capacités affichées : les deux exigées, et trois que demanderait le viseur en demi-flottants du Sujet 40 ou un repli
 * en demi-flottants (décision D24) : en WebGL 2, Babylon.js tire les deux capacités exigées de la seule extension
 * EXT_color_buffer_float (`colorBufferFloat`), alors qu'un navigateur peut rendre en demi-flottants avec
 * EXT_color_buffer_half_float seule (`colorBufferHalfFloat`) ; la lecture bilinéaire d'une texture en demi-flottants
 * (`textureHalfFloatLinearFiltering`) sert au flou du viseur à mi-résolution (contre-vérifications d'ARC-13 et d'ARC-01).
 */
export const SHOWN_FLOAT_CAPS = [
  ...REQUIRED_FLOAT_CAPS,
  "colorBufferFloat",
  "colorBufferHalfFloat",
  "textureHalfFloatLinearFiltering",
] as const;

export type FloatCapName = (typeof SHOWN_FLOAT_CAPS)[number];
export type FloatCaps = Record<FloatCapName, boolean>;

/** Capacités exigées qui manquent, dans l'ordre de REQUIRED_FLOAT_CAPS ; une liste vide si rien ne manque. */
export function missingFloatRender(caps: Pick<FloatCaps, (typeof REQUIRED_FLOAT_CAPS)[number]>): string[] {
  return REQUIRED_FLOAT_CAPS.filter((name) => !caps[name]);
}

/**
 * Détail de la ligne des problèmes quand des capacités manquent (`missing`, non vide) : les capacités absentes et le
 * déclencheur désactivé ; puis, si `textureFloatRender` manque, la mise au point et l'aperçu de la profondeur de champ,
 * qui lisent la carte de profondeur en flottants de 32 bits.
 */
export function floatRenderMessage(missing: readonly string[]): string {
  const detail = t("floatRenderDetail").replace("{caps}", missing.join(", "));
  return missing.includes("textureFloatRender") ? `${detail} ${t("floatRenderFocus")}` : detail;
}

/** Bilan d'une fenêtre du compteur des images. Durées en millisecondes, côté processeur. */
export interface FrameWindow {
  /** Durée de la fenêtre, en secondes. */
  seconds: number;
  /** Images finies pendant la fenêtre. */
  frames: number;
  /** Images par seconde : images finies, divisées par la durée de la fenêtre. */
  fps: number;
  /** Durée moyenne d'une image, de son début à sa fin ; null sans image. */
  frameMs: number | null;
  /** Durée moyenne, par image, de la phase des textures de rendu ; null sans image. */
  targetsMs: number | null;
}

/**
 * Compteur des images du viseur. Une image va de `beginFrame` à `endFrame` (dans l'application : les observables
 * onBeginFrameObservable et onEndFrameObservable du moteur, que la boucle de rendu notifie avant et après chaque
 * image ; le calcul d'une photo rend la scène hors de cette boucle, arrêtée pendant lui, et n'est pas compté). La phase
 * des textures de rendu va de `beginTargets` à `endTargets` (observables onBeforeRenderTargetsRenderObservable et
 * onAfterRenderTargetsRenderObservable de la scène) ; une image peut en avoir plusieurs, additionnées. Une phase hors
 * d'une image n'est pas comptée. Les instants sont ceux de `performance.now()`, en millisecondes.
 */
export class FrameMeter {
  private start: number;
  private frames = 0;
  private frameTotal = 0;
  private targetsTotal = 0;
  private frameStart: number | null = null;
  private targetsStart: number | null = null;
  private frameTargets = 0;

  constructor(now: number) {
    this.start = now;
  }

  beginFrame(now: number): void {
    this.frameStart = now;
    this.targetsStart = null;
    this.frameTargets = 0;
  }

  beginTargets(now: number): void {
    if (this.frameStart !== null) this.targetsStart = now;
  }

  endTargets(now: number): void {
    if (this.targetsStart === null) return;
    this.frameTargets += now - this.targetsStart;
    this.targetsStart = null;
  }

  endFrame(now: number): void {
    if (this.frameStart === null) return;
    this.frames++;
    this.frameTotal += now - this.frameStart;
    this.targetsTotal += this.frameTargets;
    this.frameStart = null;
    this.targetsStart = null;
    this.frameTargets = 0;
  }

  /**
   * Bilan des images finies depuis le bilan précédent (ou depuis la création du compteur), puis une fenêtre neuve qui
   * commence à `now`. Une image commencée et pas encore finie compte dans la fenêtre où elle finit.
   */
  take(now: number): FrameWindow {
    const seconds = Math.max(0, now - this.start) / 1000;
    const frames = this.frames;
    const result: FrameWindow = {
      seconds,
      frames,
      fps: seconds > 0 ? frames / seconds : 0,
      frameMs: frames > 0 ? this.frameTotal / frames : null,
      targetsMs: frames > 0 ? this.targetsTotal / frames : null,
    };
    this.start = now;
    this.frames = 0;
    this.frameTotal = 0;
    this.targetsTotal = 0;
    return result;
  }
}

/** Nombre écrit avec la virgule décimale : `decimal(59.83, 1)` donne « 59,8 ». */
export function decimal(value: number, digits: number): string {
  return value.toFixed(digits).replace(".", ",");
}

/** Ce que l'affichage écrit, relevé par ui/diagnosticView.ts. */
export interface DiagnosticReading {
  /** « Version du site : X.Y.Z » (version.ts). */
  version: string;
  /** Version de WebGL du moteur : 1 ou 2. */
  webgl: number;
  /** Processeur graphique, tel que Babylon.js le lit (`engine.getGlInfo().renderer`). */
  renderer: string;
  /** Densité de l'écran (`devicePixelRatio`). */
  screenDensity: number;
  /** Pixels calculés par pixel CSS dans le viseur (1 / `engine.getHardwareScalingLevel()`). */
  renderDensity: number;
  /** Taille de l'image calculée du viseur, en pixels (`engine.getRenderWidth()`, `getRenderHeight()`). */
  renderWidth: number;
  renderHeight: number;
  /** Bilan de la dernière fenêtre du compteur des images. */
  window: FrameWindow;
  /** Durée d'une image côté processeur graphique. */
  gpu: GpuReading;
  caps: FloatCaps;
}

/**
 * Mesure côté processeur graphique : extension absente (son nom), WebGL 1 sans horodatage (Babylon.js 9.35.0 n'y mesure
 * qu'une image : ui/diagnosticView.ts), aucune mesure arrivée depuis la réécriture précédente, ou une durée en
 * millisecondes.
 */
export type GpuReading =
  | { state: "missing"; extension: string }
  | { state: "unsupported" }
  | { state: "waiting" }
  | { state: "measured"; ms: number };

/** Lignes de l'affichage, dans l'ordre. */
export function diagnosticLines(r: DiagnosticReading): string[] {
  const fill = (key: MessageKey, values: Record<string, string>) =>
    Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), t(key));
  const lines = [
    `${t("diagTitle")} · ${r.version}`,
    fill("diagWebgl", { version: String(r.webgl), renderer: r.renderer }),
    fill("diagDensity", {
      screen: decimal(r.screenDensity, 2),
      density: decimal(r.renderDensity, 2),
      width: String(r.renderWidth),
      height: String(r.renderHeight),
    }),
  ];
  const w = r.window;
  if (w.frames === 0 || w.frameMs === null || w.targetsMs === null) lines.push(t("diagNoFrame"));
  else {
    lines.push(fill("diagFps", { fps: decimal(w.fps, 1) }));
    lines.push(fill("diagFrame", { frame: decimal(w.frameMs, 1), targets: decimal(w.targetsMs, 1) }));
  }
  const gpu = r.gpu;
  if (gpu.state === "missing") lines.push(fill("diagGpuMissing", { extension: gpu.extension }));
  else if (gpu.state === "unsupported") lines.push(t("diagGpuUnsupported"));
  else if (gpu.state === "waiting") lines.push(t("diagGpuWaiting"));
  else lines.push(fill("diagGpu", { gpu: decimal(gpu.ms, 1) }));
  const caps = SHOWN_FLOAT_CAPS.map((name) => `${name} ${t(r.caps[name] ? "diagYes" : "diagNo")}`).join(", ");
  lines.push(fill("diagCaps", { caps }));
  return lines;
}
