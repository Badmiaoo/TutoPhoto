// Affichage de diagnostic et capacités de l'appareil (Sujet 28 du plan de corrections, constats ARC-06 et ARC-13 de
// l'audit, version 0.3.88), part sans rendu : le paramètre de l'adresse qui ouvre l'affichage, les capacités de rendu
// en flottants que demandent la photo et l'autofocus, le compteur des images du viseur et les lignes de l'affichage.
// La part qui lit Babylon.js et écrit dans la page est ui/diagnosticView.ts ; le contrôle des capacités au démarrage
// et le refus du déclenchement sont dans main.ts et ui/shutter.ts. Ce que mesure l'affichage, et ses limites :
// docs/outillage.md, « Affichage de diagnostic ».

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
 * image ne se mesure pas côté processeur graphique (contre-vérification d'ARC-06 ; docs/outillage.md, « Affichage de
 * diagnostic »).
 */
export const FULL_DENSITY_VALUE = "densite-complete";

/** L'adresse demande-t-elle le viseur à la densité complète de l'écran ? */
export function fullDensityRequested(search: string): boolean {
  return new URLSearchParams(search).get(DIAGNOSTIC_PARAMETER) === FULL_DENSITY_VALUE;
}

/**
 * Valeur du paramètre qui charge la scène avec des textures allégées : « simulateur/?diagnostic=textures-legeres »
 * (version 0.4.15, demande de Julien du 23 novembre 2026 : sur un iPhone, le navigateur perd l'affichage 3D au
 * chargement, sans que la cause soit établie). Pendant le chargement de la scène, Babylon.js réduit alors toute image
 * à LIGHT_TEXTURE_SIZE pixels de côté au plus avant de l'envoyer au processeur graphique (main.ts, startSimulator) :
 * la photo de fond, de 8192 × 4096 px, et les textures de 2048 px des personnages et du chien. Le fond et les
 * personnages sont moins nets : ce n'est pas un réglage du simulateur, mais un essai, pour voir sur le téléphone en
 * panne si elle tient à la taille des images de la scène, par la mémoire des textures ou par leur envoi au processeur
 * graphique, sans séparer les deux (essai T29, docs/tests-a-faire-faire.md ;
 * docs/outillage.md, « Contexte perdu pendant le chargement »).
 */
export const LIGHT_TEXTURES_VALUE = "textures-legeres";

/** Côté maximal d'une image envoyée au processeur graphique avec les textures allégées, en pixels. */
export const LIGHT_TEXTURE_SIZE = 1024;

/** L'adresse demande-t-elle les textures allégées ? */
export function lightTexturesRequested(search: string): boolean {
  return new URLSearchParams(search).get(DIAGNOSTIC_PARAMETER) === LIGHT_TEXTURES_VALUE;
}

/**
 * Ce que l'affichage lit d'une texture de Babylon.js 9.35.0 (`InternalTexture`, `engine.getLoadedTexturesCache()`) :
 * taille, profondeur (0 pour une texture à deux dimensions), cube ou non, niveaux de mipmap ou non, format et type
 * (constantes TEXTUREFORMAT_ et TEXTURETYPE_ de Engines/constants.js ; -1 tant qu'ils ne sont pas fixés).
 */
export interface TextureInfo {
  width: number;
  height: number;
  depth: number;
  isCube: boolean;
  generateMipMaps: boolean;
  format: number;
  type: number;
}

/** Octets par pixel des formats de profondeur de Babylon.js : DEPTH16 (15), DEPTH32FLOAT_STENCIL8 (18), les autres. */
const DEPTH_BYTES: Record<number, number> = { 13: 4, 14: 4, 15: 2, 16: 4, 17: 4, 18: 8 };
/** Canaux des formats de couleur : ALPHA (0), LUMINANCE (1), LUMINANCE_ALPHA (2), RGB (4), RGBA (5), R (6), RG (7). */
const CHANNELS: Record<number, number> = { 0: 1, 1: 1, 2: 2, 4: 3, 5: 4, 6: 1, 7: 2 };
const TYPE_FLOAT = 1;
const TYPE_HALF_FLOAT = 2;
const MIB = 2 ** 20;

/**
 * Octets qu'une texture demande au processeur graphique, par estimation : largeur × hauteur (× profondeur, × 6 faces
 * pour un cube) × octets par pixel, un tiers de plus avec ses niveaux de mipmap (1 + 1/4 + 1/16 + … = 4/3). Octets par
 * pixel : le nombre de canaux du format (1 pour ALPHA, LUMINANCE et R ; 2 pour LUMINANCE_ALPHA et RG ; 3 pour RGB ;
 * 4 pour RGBA et pour un format non fixé ou inconnu) × 1 octet, 2 en demi-flottants, 4 en flottants ; pour une
 * texture de profondeur, 2 (DEPTH16), 8 (DEPTH32FLOAT_STENCIL8) ou 4 octets. C'est ce que la page demande : ce que le
 * processeur graphique alloue réellement n'est pas mesuré.
 */
export function estimatedTextureBytes(texture: TextureInfo): number {
  const pixels = texture.width * texture.height * Math.max(1, texture.depth) * (texture.isCube ? 6 : 1);
  const depthBytes = DEPTH_BYTES[texture.format];
  const perChannel = texture.type === TYPE_FLOAT ? 4 : texture.type === TYPE_HALF_FLOAT ? 2 : 1;
  const perPixel = depthBytes ?? (CHANNELS[texture.format] ?? 4) * perChannel;
  return Math.round(pixels * perPixel * (texture.generateMipMaps ? 4 / 3 : 1));
}

/**
 * Textures que Babylon.js a créées : leur nombre, l'estimation des octets qu'elles demandent (estimatedTextureBytes),
 * le plus grand côté de texture que le processeur graphique accepte (MAX_TEXTURE_SIZE de WebGL, lu à la création du
 * moteur), la limite que Babylon.js applique à l'instant de la lecture (plus basse pendant le chargement aux textures
 * allégées, main.ts), l'état de la lecture, et si les textures allégées sont demandées (LIGHT_TEXTURES_VALUE). État :
 * « read », lu à l'instant ; « frozen », le nombre et les octets sont ceux de la dernière lecture avant une perte du
 * contexte WebGL ; « unread », aucune lecture n'a eu lieu avant la perte, et ils ne sont pas écrits
 * (ui/diagnosticView.ts).
 */
export interface TextureReading {
  count: number;
  bytes: number;
  maxSize: number;
  currentMaxSize: number;
  state: "read" | "frozen" | "unread";
  light: boolean;
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
  /** Textures créées par Babylon.js (version 0.4.15). */
  textures: TextureReading;
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
  // Textures (version 0.4.15) : en dernier, après les lignes de la version 0.3.88. Quand le contexte est perdu, ou
  // que le démarrage s'est arrêté sur sa perte, la ligne garde les textures relevées avant, et une ligne le dit.
  const textures = r.textures;
  const values = { count: String(textures.count), mio: String(Math.round(textures.bytes / MIB)), max: String(textures.maxSize) };
  if (textures.state === "unread") lines.push(fill("diagTexturesUnread", { max: values.max }));
  else if (textures.currentMaxSize < textures.maxSize) lines.push(fill("diagTexturesLowered", { ...values, current: String(textures.currentMaxSize) }));
  else lines.push(fill("diagTextures", values));
  if (textures.state === "frozen") lines.push(t("diagTexturesLost"));
  if (textures.light) lines.push(fill("diagTexturesLight", { size: String(LIGHT_TEXTURE_SIZE) }));
  return lines;
}
