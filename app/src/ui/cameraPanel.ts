// Boîtier virtuel minimal : ouverture, vitesse, ISO, focale, boîtier de référence, cellule d'exposition,
// mode de mise au point.
// L'aperçu d'exposition multiplie la lumière de la scène par 2^écart (écart en IL, camera/exposure.ts),
// avant l'affichage ; sans courbe de tons, ce qui dépasse le blanc est écrêté.
// Aperçu dans le viseur (décision du 9 novembre 2026) : un interrupteur général et un par effet
// (luminosité, bruit), en marche par défaut. Coupé, le viseur reste correctement exposé et sans bruit ;
// la photo garde toujours tous les effets.
// Loupe du viseur (même décision) : grossit l'image autour du point de mise au point, jusqu'à 100 % (un
// pixel CSS pour un photosite depuis la version 0.3.52, zoomAt), comme la fonction de grossissement des hybrides.
// Elle ne change que l'affichage : la photo couvre toujours tout le cadre.
// Mise au point (décisions du 9 novembre 2026, camera/autofocus.ts) : mode AF-S ou AF-C (MAP-04) et mode de
// zone AF (MAP-05, MAP-09), point sélectif, zone large (S) ou (L), ou zone automatique avec la détection des
// visages et des yeux (réglage a4 du Z 6), choisis dans la fenêtre « Mise au point ». Le
// viseur indique le mode, la zone et la distance ; le repère passe au vert quand la distance est verrouillée,
// comme le point AF du Nikon Z 6 [nikon-z6-focus].
// Collimateurs (MAP-06, version 0.3.34 ; par boîtier depuis la version 0.3.43) : le point et les zones restent
// dans la zone couverte par l'autofocus (afMargins), affichée en pointillés dans le viseur.
// Exposition (BOI-07, BOI-08, MES-04, MES-10, version 0.3.36) : modes M, A et S, correction d'exposition et ISO auto,
// dans la fenêtre « Exposition » ouverte par l'indicateur ; l'appareil choisit ce que le mode lui laisse
// (camera/exposureModes.ts), et tout le reste (viseur, bruit, profondeur de champ, photo) suit ses réglages.
// Grilles de cadrage (CMP-02, version 0.3.56) : une aide du viseur, choisie dans la fenêtre « Aperçu », la même
// pour tous les boîtiers (GRIDS, camera/viewfinder.ts ; décision de Julien du 12 novembre 2026 : les grilles sont des
// outils de composition, les mêmes partout). Choix de TutoPhoto, non sourcés, confirmés par Julien : la grille est masquée
// quand la loupe agrandit l'image, et elle n'est dessinée ni sur la photo ni sur l'écran de revue (aucune page lue
// ne dit ce que fait un boîtier). Non simulé : le quadrillage du Nikon Z 6, dont le manuel ne décrit pas le tracé ;
// les grilles « Square Grid » et « Diag. + Square Grid » de Sony, non décrites.
// Réglages, valeurs de départ et mémoire du navigateur : camera/settings.ts (magasin de réglages, version 0.4.9). Le
// panneau y lit les réglages et y écrit ce que l'on choisit ; il se met à jour par son abonnement (settingsChanged).

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import type { FreeCameraTouchInput } from "@babylonjs/core/Cameras/Inputs/freeCameraTouchInput";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { BODIES, findBody, sensorPixels, type Body, type Brand } from "../camera/bodies";
import {
  FOCAL_LENGTHS,
  SCALES,
  apertureLabel,
  apertureValue,
  isoLabel,
  isoValue,
  shutterLabel,
  shutterSeconds,
  type ExposureSettings,
} from "../camera/exposure";
import { COMPENSATION_RANGE, resolveExposure, type ExposureMode, type ResolvedExposure } from "../camera/exposureModes";
import { cameraFov, frameFor, gridLines, isGridKind, type Frame } from "../camera/viewfinder";
import { windowProjection } from "../camera/optics";
import type { ViewfinderNoise } from "../camera/noise";
import type { ViewfinderDepthOfField } from "../camera/viewfinderDof";
import type { Autofocus, FocusArea, Rect } from "../camera/autofocus";
import type { Detection } from "../camera/faces";
import {
  CL_RATES,
  MAX_ISO_FIRST,
  RELEASE_FPS,
  TIMER_DELAYS,
  type AreaMode,
  type FocusMode,
  type ReleaseKind,
  type SettingKey,
  type Settings,
  type SettingsStore,
} from "../camera/settings";
import type { BalanceIndicator } from "./balance";
import { t, type MessageKey } from "../texts";

/**
 * Couverture de l'autofocus (MAP-06) : environ 90 % du cadre en largeur et en hauteur, au centre. Nikon, pour
 * le Z 6 : « 273 focus points*, enabling broad coverage of approximately 90% of the imaging area both
 * horizontally and vertically », avec « * With FX (36x24) format and single-point AF » (communiqué du
 * 23 août 2018) [nikon-z6-launch-2018] ; même chiffre dans le communiqué du 15 août 2019 [nikon-z6-eisa-2019]
 * et sur la page du produit [nikon-z6-product]. Appliquée à tous les modes de zone du Z 6. Chaque boîtier a sa
 * couverture quand elle est sourcée (camera/bodies.ts, afCoverage, depuis la version 0.3.43) : le Canon EOS R50,
 * 90 % sur le grand côté et 100 % sur le petit pour le collimateur choisi, 100 % sur les deux en zone automatique
 * (afCoverageAuto, version 0.3.80) ; le Sony A6000, dont la page ne donne pas de pourcentage, garde celle du Z 6,
 * ce qui n'est pas sourcé pour lui. La disposition des points n'est pas dans ces sources : le point se place
 * partout dans la zone couverte, sans grille.
 *   https://www.nikon.com/news/2018/0823_mirrorless_01.htm
 *   https://www.nikon.com/news/2019/0815_award_01.htm
 *   https://imaging.nikon.com/imaging/lineup/mirrorless/z_6/
 */
export const AF_COVERAGE = { horizontal: 0.9, vertical: 0.9 };

/** Écart maximal affiché par la cellule, en IL. */
const METER_RANGE = 3;
/** Grossissements de la loupe, en fraction de la vue à 100 % ; un cran trop proche de 1 est sauté. */
const LOUPE_LEVELS = [0.5, 1] as const;
const LOUPE_MIN_ZOOM = 1.25;
/**
 * Côté des zones larges, en fraction du grand côté du cadre : zones carrées. Le manuel du Z 6 dit seulement
 * que les zones (L) sont plus grandes que les zones (S) ; ces tailles sont choisies pour TutoPhoto.
 */
const WIDE_AREA_SIZE: Record<"wideS" | "wideL", number> = { wideS: 0.1, wideL: 0.2 };
const AREA_KEYS: Record<AreaMode, { label: MessageKey; short: MessageKey }> = {
  point: { label: "areaPoint", short: "areaPointShort" },
  wideS: { label: "areaWideS", short: "areaWideSShort" },
  wideL: { label: "areaWideL", short: "areaWideLShort" },
  auto: { label: "areaAuto", short: "areaAutoShort" },
};
const TARGET_KEYS: Record<"eye" | "face" | "nearest" | "point", MessageKey> = {
  eye: "targetEye",
  face: "targetFace",
  nearest: "targetNearest",
  point: "targetPoint",
};

const SVG_NS = "http://www.w3.org/2000/svg";

/** Interrupteurs de l'aperçu dans le viseur : valeur de la case de la fenêtre « Aperçu », et le réglage qu'elle coche. */
const PREVIEW_SWITCHES = {
  all: "previewAll",
  brightness: "previewBrightness",
  noise: "previewNoise",
  depthOfField: "previewDepthOfField",
  balance: "previewBalance",
} as const satisfies Record<string, SettingKey>;
type PreviewSwitch = keyof typeof PREVIEW_SWITCHES;

/**
 * Ce que chaque réglage met à jour quand il change (settingsChanged) : tout le panneau ; le seul mode de
 * déclenchement ; la seule mise au point, puis la vue ; rien (affichage de l'écran de revue, ui/reviewInfo.ts). Les
 * mêmes mises à jour qu'avant le magasin de réglages, fenêtre par fenêtre.
 */
const REFRESH: Record<SettingKey, "panel" | "release" | "focus" | "none"> = {
  aperture: "panel",
  shutter: "panel",
  iso: "panel",
  focalIndex: "panel",
  brand: "panel",
  exposureMode: "panel",
  compensation: "panel",
  autoIso: "panel",
  maxIso: "panel",
  minShutter: "panel",
  focusMode: "focus",
  areaMode: "focus",
  detection: "focus",
  release: "release",
  clRate: "release",
  timerDelay: "release",
  previewAll: "panel",
  previewBrightness: "panel",
  previewNoise: "panel",
  previewDepthOfField: "panel",
  previewBalance: "panel",
  grid: "panel",
  reviewDisplay: "none",
};

type Dial = "aperture" | "shutter" | "iso" | "focal";

/**
 * Effet de chaque bouton de molette, « − » puis « + », pour son nom accessible et son infobulle (constat INT-16 de
 * l'audit, version 0.4.7). Voir step() : « + » augmente le nombre f, la durée de pose, l'ISO et la focale.
 */
const DIAL_EFFECTS: Record<Dial, { decrease: MessageKey; increase: MessageKey }> = {
  aperture: { decrease: "apertureDecrease", increase: "apertureIncrease" },
  shutter: { decrease: "shutterDecrease", increase: "shutterIncrease" },
  iso: { decrease: "isoDecrease", increase: "isoIncrease" },
  focal: { decrease: "focalDecrease", increase: "focalIncrease" },
};
/** Avec l'ISO auto, les boutons de la molette « ISO auto » changent la valeur choisie (relecture de la version 0.4.7, R1). */
const AUTO_ISO_EFFECTS: { decrease: MessageKey; increase: MessageKey } = { decrease: "isoDecreaseAuto", increase: "isoIncreaseAuto" };

/** Réglages courants, pour la photo calculée. */
export interface CurrentSettings {
  body: Body;
  focalMm: number;
  aperture: number;
  shutterSeconds: number;
  iso: number;
  exposure: number;
  frame: Frame;
  /** Réglages tels qu'affichés : « M · f/8 · 1/100 s · ISO 100 · 50 mm ». */
  summary: string;
  /** Libellés des réglages retenus, un par un : « f/8 », « 1/100 s », « ISO 100 », « 50 mm ». */
  labels: { aperture: string; shutter: string; iso: string; focal: string };
}

interface PanelElements {
  panel: HTMLElement;
  frame: HTMLElement;
  /** Conteneur des lignes de la grille de cadrage, dans le cadre du viseur. */
  grid: HTMLElement;
  meterNeedle: HTMLElement;
  meterValue: HTMLElement;
  bodyButton: HTMLButtonElement;
  bodyDialog: HTMLDialogElement;
  previewButton: HTMLButtonElement;
  previewDialog: HTMLDialogElement;
  previewBadge: HTMLElement;
  loupeButton: HTMLButtonElement;
  loupeBadge: HTMLElement;
  afButton: HTMLButtonElement;
  afDialog: HTMLDialogElement;
  releaseButton: HTMLButtonElement;
  releaseDialog: HTMLDialogElement;
  exposureDialog: HTMLDialogElement;
  afBadge: HTMLElement;
  focusMarker: HTMLElement;
  afCoverage: HTMLElement;
  focusHint: HTMLElement;
}

type Point = { x: number; y: number };

export class CameraPanel {
  private frame: Frame | null = null;
  /** Grille dont les lignes sont tracées dans le cadre ; null avant le premier tracé. */
  private drawnGrid: string | null = null;
  private balance: BalanceIndicator | null = null;
  private dof: ViewfinderDepthOfField | null = null;
  private autofocus: Autofocus | null = null;
  /** Cran de la loupe dans LOUPE_LEVELS ; -1 : pas de loupe. */
  private loupeLevel = -1;
  private loupeZoom = 1;
  /** Centre de la zone grossie, en coordonnées normalisées du canevas (de -1 à 1, y vers le haut). */
  private loupeCenter: Point = { x: 0, y: 0 };
  /** Point de mise au point, dans le cadre complet (de 0 à 1, origine en haut à gauche). */
  private focusPoint: Point = { x: 0.5, y: 0.5 };
  private canvasSize = { width: 1, height: 1 };
  private readonly baseAngularSensibility: number;
  private readonly baseTouchSensibility: number | null;
  private readonly viewListeners: (() => void)[] = [];
  /** Faux pendant le calcul d'une photo, qui a sa propre projection : la loupe n'y touche pas. */
  private enabled = true;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: UniversalCamera,
    private readonly el: PanelElements,
    private readonly noise: ViewfinderNoise,
    /** Magasin de réglages (camera/settings.ts), relu dans la mémoire du navigateur avant le panneau. */
    private readonly settings: SettingsStore,
  ) {
    this.baseAngularSensibility = camera.angularSensibility;
    const touch = camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
    this.baseTouchSensibility = touch ? touch.touchAngularSensibility : null;
    el.loupeButton.addEventListener("click", () => this.cycleLoupe());
    el.afButton.addEventListener("click", () => el.afDialog.showModal());
    el.releaseButton.addEventListener("click", () => el.releaseDialog.showModal());
    el.meterValue.addEventListener("click", () => el.exposureDialog.showModal());
    // Chaque choix des fenêtres s'écrit dans le magasin, qui le mémorise ; l'affichage suit par l'abonnement.
    for (const input of el.exposureDialog.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select")) {
      input.addEventListener("change", () => {
        if (input.name === "exposureMode") settings.set({ exposureMode: input.value as ExposureMode });
        if (input.name === "compensation") settings.set({ compensation: Number(input.value) });
        if (input.name === "autoIso") settings.set({ autoIso: (input as HTMLInputElement).checked });
        if (input.name === "maxIso") settings.set({ maxIso: Number(input.value) });
        if (input.name === "minShutter") settings.set({ minShutter: Number(input.value) });
      });
    }
    for (const input of el.releaseDialog.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[type=radio], select")) {
      input.addEventListener("change", () => {
        if (input.name === "release") settings.set({ release: input.value as ReleaseKind });
        if (input.name === "clRate") settings.set({ clRate: Number(input.value) });
        if (input.name === "timerDelay") settings.set({ timerDelay: Number(input.value) });
      });
    }
    for (const input of el.afDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.addEventListener("change", () => {
        if (input.name === "focusMode") settings.set({ focusMode: input.value as FocusMode });
        if (input.name === "areaMode") settings.set({ areaMode: input.value as AreaMode });
        if (input.name === "detection") settings.set({ detection: input.value as Detection });
      });
    }
    for (const button of el.panel.querySelectorAll<HTMLButtonElement>("button[data-dial]")) {
      button.addEventListener("click", () => this.step(button.dataset.dial as Dial, Number(button.dataset.step)));
    }
    el.bodyButton.addEventListener("click", () => el.bodyDialog.showModal());
    for (const input of el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.addEventListener("change", () => {
        if (input.name === "brand") settings.set({ brand: input.value as Brand });
      });
    }
    el.previewButton.addEventListener("click", () => el.previewDialog.showModal());
    for (const input of el.previewDialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.addEventListener("change", () => {
        settings.set({ [PREVIEW_SWITCHES[input.value as PreviewSwitch]]: input.checked } as Partial<Settings>);
      });
    }
    for (const input of el.previewDialog.querySelectorAll<HTMLInputElement>("input[name=grid]")) {
      input.addEventListener("change", () => {
        if (isGridKind(input.value)) settings.set({ grid: input.value });
      });
    }
    settings.subscribe((changed) => this.settingsChanged(changed));
    engine.onResizeObservable.add(() => this.applyView());
    this.update();
  }

  /** Abonnement au magasin de réglages : les mises à jour que demandent les réglages changés (REFRESH). */
  private settingsChanged(changed: ReadonlySet<SettingKey>): void {
    const kinds = new Set([...changed].map((key) => REFRESH[key]));
    // update() refait aussi la mise au point, le mode de déclenchement et la vue.
    if (kinds.has("panel")) {
      this.update();
      return;
    }
    if (kinds.has("release")) this.updateRelease();
    if (kinds.has("focus")) {
      this.updateFocus();
      // La zone couverte peut changer avec le mode de zone (EOS R50, afCoverageAuto) : applyView la redessine, y
      // ramène le point et prévient les écouteurs.
      if (changed.has("areaMode")) this.applyView();
      else for (const listener of this.viewListeners) listener();
    }
  }

  /** Ouverture, vitesse et ISO choisis avec les molettes ; l'appareil peut en changer certains (resolved). */
  private chosen(): ExposureSettings {
    const s = this.settings.all();
    return { aperture: s.aperture, shutter: s.shutter, iso: s.iso };
  }

  applyTexts(): void {
    this.update();
  }

  current(): CurrentSettings {
    if (!this.frame) this.applyView();
    const resolved = this.resolved();
    return {
      body: this.body(),
      focalMm: FOCAL_LENGTHS[this.settings.get("focalIndex")],
      aperture: apertureValue(resolved.settings.aperture),
      shutterSeconds: shutterSeconds(resolved.settings.shutter),
      iso: isoValue(resolved.settings.iso),
      exposure: 2 ** resolved.offset,
      frame: this.frame!,
      summary: this.summary(resolved),
      labels: {
        aperture: this.label("aperture", resolved),
        shutter: this.label("shutter", resolved),
        iso: `ISO ${this.label("iso", resolved)}`,
        focal: this.label("focal", resolved),
      },
    };
  }

  /** Réglages retenus par l'appareil, selon le mode, la correction et l'ISO auto. */
  private resolved(): ResolvedExposure {
    const s = this.settings.all();
    return resolveExposure({
      mode: s.exposureMode,
      chosen: this.chosen(),
      compensation: s.compensation,
      autoIso: s.autoIso,
      maxIso: s.maxIso,
      minShutter: s.minShutter,
    });
  }

  /** « A · f/4 · 1/200 s · ISO 100 (auto) · corr. +1,0 IL · 50 mm ». */
  private summary(resolved: ResolvedExposure): string {
    const tr = t;
    const s = this.settings.all();
    const iso = `ISO ${this.label("iso", resolved)}${s.autoIso ? ` (${tr("setByCamera")})` : ""}`;
    const parts = [s.exposureMode, this.label("aperture", resolved), this.label("shutter", resolved), iso];
    if (s.compensation !== 0) parts.push(`${tr("compensationShort")} ${this.compensationText(s.compensation)} ${tr("meterUnit")}`);
    parts.push(this.label("focal", resolved));
    return parts.join(" · ");
  }

  /** Correction en IL, avec un chiffre après la virgule, comme l'affiche le Z 6 (« ±0.0 »). */
  private compensationText(thirds: number): string {
    const value = (Math.abs(thirds) / 3).toFixed(1);
    const sign = thirds > 0 ? "+" : thirds < 0 ? "−" : "±";
    return `${sign}${value.replace(".", ",")}`;
  }

  /** Indicateur d'équilibre, créé après le panneau. */
  attachBalance(balance: BalanceIndicator): void {
    this.balance = balance;
    this.update();
  }

  /** Rapport entre l'image réelle et l'image affichée : 2^écart quand l'aperçu de la luminosité est coupé. */
  displayGain(): number {
    return this.showsBrightness() ? 1 : 2 ** this.resolved().offset;
  }

  /** Autofocus du viseur, créé après le panneau (il lit le point de mise au point, et son mode dans le magasin). */
  attachAutofocus(autofocus: Autofocus): void {
    this.autofocus = autofocus;
    autofocus.onChange(() => this.updateFocus());
    this.updateFocus();
  }

  /** Profondeur de champ du viseur, créée après le panneau (elle lit le point de mise au point). */
  attachDepthOfField(dof: ViewfinderDepthOfField): void {
    this.dof = dof;
    this.update();
  }

  /** Point de mise au point dans le cadre complet (de 0 à 1, origine en haut à gauche). */
  focusPointInFrame(): Point {
    return { ...this.focusPoint };
  }

  /** Point de mise au point dans le canevas (de 0 à 1, origine en haut à gauche), loupe comprise. */
  focusOnCanvas(): Point {
    if (!this.frame) return { x: 0.5, y: 0.5 };
    const shown = this.frameToDisplayed(this.focusPoint);
    const frame = this.frame;
    return {
      x: (frame.left + shown.x * frame.width) / this.canvasSize.width,
      y: (frame.top + shown.y * frame.height) / this.canvasSize.height,
    };
  }

  /**
   * Point et zone de mise au point dans le canevas, loupe comprise : zone large rognée à la zone couverte par
   * l'autofocus, ou toute cette zone et le réglage de détection en zone automatique.
   */
  focusArea(): FocusArea {
    const point = this.focusOnCanvas();
    const bounds = this.coverageOnCanvas();
    if (!this.frame || !bounds) return { point, zone: null, auto: null };
    const frame = this.frame;
    const { width, height } = this.canvasSize;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    if (this.settings.get("areaMode") === "auto") {
      return {
        point,
        zone: bounds,
        auto: {
          detection: this.settings.get("detection"),
          frame: bounds,
          frameLongSidePx: Math.max(frame.width, frame.height),
          zoom: this.loupeZoom,
          canvasWidth: width,
          canvasHeight: height,
        },
      };
    }
    const size = this.zoneOnCanvas();
    if (!size) return { point, zone: null, auto: null };
    return {
      point,
      zone: {
        left: clamp(point.x - size.width / 2, bounds.left, bounds.right),
        right: clamp(point.x + size.width / 2, bounds.left, bounds.right),
        top: clamp(point.y - size.height / 2, bounds.top, bounds.bottom),
        bottom: clamp(point.y + size.height / 2, bounds.top, bounds.bottom),
      },
      auto: null,
    };
  }

  /**
   * Zone couverte par l'autofocus dans le canevas (fractions), loupe comprise, rognée à la partie visible du
   * cadre ; null avant la première mise en page.
   */
  coverageOnCanvas(): Rect | null {
    if (!this.frame) return null;
    const frame = this.frame;
    const { width, height } = this.canvasSize;
    const onCanvas = (point: Point) => {
      const shown = this.frameToDisplayed(point);
      return {
        x: (frame.left + Math.min(1, Math.max(0, shown.x)) * frame.width) / width,
        y: (frame.top + Math.min(1, Math.max(0, shown.y)) * frame.height) / height,
      };
    };
    const margin = this.afMargins();
    const start = onCanvas({ x: margin.x, y: margin.y });
    const end = onCanvas({ x: 1 - margin.x, y: 1 - margin.y });
    return { left: start.x, top: start.y, right: end.x, bottom: end.y };
  }

  /**
   * Marges de la zone couverte par l'autofocus, en fractions du cadre (x en largeur, y en hauteur) : couverture du
   * boîtier, celle de sa zone automatique quand sa fiche en donne une à part, ou celle du Z 6 quand elle n'est pas
   * sourcée ; grand et petit côtés échangés en cadrage vertical.
   */
  private afMargins(): { x: number; y: number } {
    const body = this.body();
    const coverage = (this.settings.get("areaMode") === "auto" ? body.afCoverageAuto : undefined) ?? body.afCoverage ?? AF_COVERAGE;
    const portrait = this.frame?.portrait ?? false;
    const across = portrait ? coverage.vertical : coverage.horizontal;
    const down = portrait ? coverage.horizontal : coverage.vertical;
    return { x: (1 - across) / 2, y: (1 - down) / 2 };
  }

  /** Point du cadre ramené dans la zone couverte par l'autofocus, au plus près. */
  private clampToCoverage(point: Point): Point {
    const margin = this.afMargins();
    const clamp = (value: number, m: number) => Math.min(1 - m, Math.max(m, value));
    return { x: clamp(point.x, margin.x), y: clamp(point.y, margin.y) };
  }

  /** Taille de la zone large dans le canevas (fractions de sa largeur et de sa hauteur) ; null pour un point. */
  zoneOnCanvas(): { width: number; height: number } | null {
    const areaMode = this.settings.get("areaMode");
    if (areaMode === "point" || areaMode === "auto" || !this.frame) return null;
    const side = WIDE_AREA_SIZE[areaMode] * Math.max(this.frame.width, this.frame.height) * this.loupeZoom;
    return { width: side / this.canvasSize.width, height: side / this.canvasSize.height };
  }

  /** Bouton et fenêtre « Mode de déclenchement ». */
  private updateRelease(): void {
    const tr = t;
    const { release, clRate, timerDelay } = this.settings.all();
    const fpsText = (fps: number) => `${String(fps).replace(".", ",")} ${tr("releaseFpsShort")}`;
    const labels: Record<ReleaseKind, string> = {
      single: tr("releaseSingle"),
      cl: `${tr("releaseCL")} · ${fpsText(clRate)}`,
      ch: `${tr("releaseCH")} · ${fpsText(RELEASE_FPS.ch)}`,
      chx: `${tr("releaseCHX")} · ${fpsText(RELEASE_FPS.chx)}`,
      timer: `${tr("releaseTimer")} · ${timerDelay} s`,
    };
    this.el.releaseButton.textContent = labels[release];
    this.el.releaseButton.title = tr("releaseTitle");
    const dialog = this.el.releaseDialog;
    dialog.querySelector("#release-title")!.textContent = tr("releaseTitle");
    dialog.querySelector("#release-single-label")!.textContent = tr("releaseSingle");
    dialog.querySelector("#release-cl-label")!.textContent = tr("releaseCL");
    dialog.querySelector("#release-ch-label")!.textContent = `${tr("releaseCH")} (${fpsText(RELEASE_FPS.ch)})`;
    dialog.querySelector("#release-chx-label")!.textContent = `${tr("releaseCHX")} (${fpsText(RELEASE_FPS.chx)})`;
    dialog.querySelector("#release-timer-label")!.textContent = tr("releaseTimer");
    dialog.querySelector("#release-cl-rate-label")!.textContent = tr("releaseClRate");
    dialog.querySelector("#release-delay-label")!.textContent = tr("releaseDelay");
    dialog.querySelector("#release-note")!.textContent = tr("releaseNote");
    dialog.querySelector("#release-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) input.checked = input.value === release;
    const rate = dialog.querySelector<HTMLSelectElement>("select[name=clRate]")!;
    const delay = dialog.querySelector<HTMLSelectElement>("select[name=timerDelay]")!;
    rate.replaceChildren(...CL_RATES.map((r) => new Option(fpsText(r), String(r), false, r === clRate)));
    delay.replaceChildren(...TIMER_DELAYS.map((d) => new Option(`${d} s`, String(d), false, d === timerDelay)));
  }

  /** Pourquoi la vitesse (A) ou l'ouverture (S) clignote : trop ou pas assez de lumière. */
  private limitText(resolved: ResolvedExposure): string {
    return t(resolved.offset - this.settings.get("compensation") / 3 > 0 ? "tooBright" : "tooDark");
  }

  /** « La vitesse clignote avec l'indicateur d'exposition : le sujet est trop clair ; la photo sera surexposée. » */
  private limitSentence(resolved: ResolvedExposure): string {
    if (!resolved.flashing) return "";
    return `${t(resolved.flashing === "shutter" ? "limitShutter" : "limitAperture")}\u00a0: ${this.limitText(resolved)}.`;
  }

  /** Fenêtre « Exposition » : mode, correction, ISO auto. */
  private updateExposureDialog(tr: (key: MessageKey) => string, resolved: ResolvedExposure): void {
    const dialog = this.el.exposureDialog;
    dialog.querySelector("#exposure-title")!.textContent = tr("exposureTitle");
    // Ce que dit l'indicateur, et la phrase du clignotement tant qu'il dure : écrites dans la fenêtre que le bouton de
    // l'indicateur ouvre, au doigt et au clavier, et plus seulement dans son infobulle (constat INT-09 de l'audit,
    // version 0.4.7). La phrase n'est réécrite que quand elle change : elle est dans une zone vivante.
    dialog.querySelector("#exposure-meter-help")!.textContent = tr("meterHelp");
    const limit = dialog.querySelector<HTMLElement>("#exposure-limit")!;
    const sentence = this.limitSentence(resolved);
    if (limit.textContent !== sentence) limit.textContent = sentence;
    limit.hidden = sentence === "";
    dialog.querySelector("#exposure-mode-legend")!.textContent = tr("exposureModeLegend");
    dialog.querySelector("#exposure-m-label")!.textContent = tr("modeM");
    dialog.querySelector("#exposure-a-label")!.textContent = tr("modeA");
    dialog.querySelector("#exposure-s-label")!.textContent = tr("modeS");
    dialog.querySelector("#exposure-comp-label")!.textContent = tr("compensation");
    dialog.querySelector("#exposure-auto-legend")!.textContent = tr("autoIsoLegend");
    dialog.querySelector("#exposure-auto-label")!.textContent = tr("autoIsoOn");
    dialog.querySelector("#exposure-max-label")!.textContent = tr("maxIso");
    dialog.querySelector("#exposure-min-label")!.textContent = tr("minShutter");
    dialog.querySelector("#exposure-note")!.textContent = tr("exposureNote");
    dialog.querySelector("#exposure-close")!.textContent = tr("close");
    const s = this.settings.all();
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=exposureMode]")) input.checked = input.value === s.exposureMode;
    dialog.querySelector<HTMLInputElement>("input[name=autoIso]")!.checked = s.autoIso;
    const unit = tr("meterUnit");
    const compensation = dialog.querySelector<HTMLSelectElement>("select[name=compensation]")!;
    const steps = Array.from({ length: 2 * COMPENSATION_RANGE + 1 }, (_, k) => COMPENSATION_RANGE - k);
    compensation.replaceChildren(...steps.map((c) => new Option(`${this.compensationText(c)} ${unit}`, String(c), false, c === s.compensation)));
    const maxIso = dialog.querySelector<HTMLSelectElement>("select[name=maxIso]")!;
    const isoSteps = Array.from({ length: SCALES.iso - MAX_ISO_FIRST }, (_, k) => MAX_ISO_FIRST + k);
    maxIso.replaceChildren(...isoSteps.map((i) => new Option(`ISO ${isoLabel(i)}`, String(i), false, i === s.maxIso)));
    maxIso.disabled = !s.autoIso;
    const minShutter = dialog.querySelector<HTMLSelectElement>("select[name=minShutter]")!;
    // Du plus rapide au plus lent, comme la liste du Z 6 (« from 1/4000 s to 30 s »).
    const shutterSteps = Array.from({ length: SCALES.shutter }, (_, k) => SCALES.shutter - 1 - k);
    const chosen = this.chosen();
    minShutter.replaceChildren(
      ...shutterSteps.map((k) => new Option(this.label("shutter", { settings: { ...chosen, shutter: k } }), String(k), false, k === s.minShutter)),
    );
    minShutter.disabled = !s.autoIso;
  }

  /** Appelé à chaque changement du viseur (taille, focale, boîtier, loupe). */
  onViewChange(listener: () => void): void {
    this.viewListeners.push(listener);
  }

  /**
   * Point de mise au point choisi, dans le cadre complet : ramené dans la zone couverte par l'autofocus (le plus
   * près du point touché), puis la loupe se centre dessus ; en AF-S, le toucher fait le point. Renvoie le point
   * retenu.
   */
  setFocusPoint(point: Point): Point {
    this.focusPoint = this.clampToCoverage(point);
    this.applyView();
    void this.autofocus?.touch();
    return { ...this.focusPoint };
  }

  /** Remet la projection du viseur (et la loupe) après le calcul d'une photo, qui la remplace. */
  restoreView(): void {
    this.applyView();
  }

  /** Point touché dans le cadre affiché (de 0 à 1) vers le point correspondant du cadre complet. */
  displayedToFrame(point: Point): Point {
    if (this.loupeZoom <= 1) return point;
    const ndc = this.frameToNdc(point);
    return this.ndcToFrame({ x: ndc.x / this.loupeZoom + this.loupeCenter.x, y: ndc.y / this.loupeZoom + this.loupeCenter.y });
  }

  /** Point du cadre complet vers sa position dans le cadre affiché (hors de 0 à 1 s'il n'est pas visible). */
  frameToDisplayed(point: Point): Point {
    if (this.loupeZoom <= 1) return point;
    const ndc = this.frameToNdc(point);
    return this.ndcToFrame({ x: (ndc.x - this.loupeCenter.x) * this.loupeZoom, y: (ndc.y - this.loupeCenter.y) * this.loupeZoom });
  }

  /** Faux pendant le calcul d'une photo. */
  isEnabled(): boolean {
    return this.enabled;
  }

  /** Grise les réglages pendant le calcul d'une photo. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    for (const button of this.el.panel.querySelectorAll<HTMLButtonElement>("button")) button.disabled = !enabled;
    // Les molettes que l'appareil règle lui-même (vitesse en A, ouverture en S) restent grisées.
    if (enabled) this.update();
  }

  private body() {
    return findBody(this.settings.get("brand"));
  }

  /** « + » augmente la valeur affichée : nombre f, durée de pose, ISO, focale. */
  private step(dial: Dial, delta: number): void {
    const clamp = (value: number, size: number) => Math.min(size - 1, Math.max(0, value));
    const s = this.settings.all();
    // En S, l'appareil choisit l'ouverture ; en A, la vitesse.
    if (dial === "aperture" && s.exposureMode !== "S") this.settings.set({ aperture: clamp(s.aperture + delta, SCALES.aperture) });
    // L'échelle des vitesses va de 30 s à 1/4000 s : une pose plus longue est un indice plus petit.
    if (dial === "shutter" && s.exposureMode !== "A") this.settings.set({ shutter: clamp(s.shutter - delta, SCALES.shutter) });
    if (dial === "iso") this.settings.set({ iso: clamp(s.iso + delta, SCALES.iso) });
    if (dial === "focal") this.settings.set({ focalIndex: clamp(s.focalIndex + delta, FOCAL_LENGTHS.length) });
    // Au bout d'une échelle, rien ne change et le magasin ne prévient personne : le panneau est redessiné quand même,
    // comme avant le magasin de réglages, et la valeur récrite dans sa zone vivante (relecture de la version 0.4.9, R3).
    if (this.settings.all() === s) this.update();
  }

  /** Libellé d'un réglage retenu par l'appareil (ou choisi, pour les listes de la fenêtre « Exposition »). */
  private label(dial: Dial, resolved: { settings: ExposureSettings } = this.resolved()): string {
    const decimal = (text: string) => text.replace(".", ",");
    const settings = resolved.settings;
    switch (dial) {
      case "aperture":
        // Ouverture écrite avec le point, comme dans les fiches (« f/5.6 », décision D5 de Julien, 15 novembre 2026).
        return `f/${apertureLabel(settings.aperture)}`;
      case "shutter": {
        const label = shutterLabel(settings.shutter);
        return label.includes("/") ? `${label} s` : `${decimal(label)} s`;
      }
      case "iso":
        return isoLabel(settings.iso);
      case "focal":
        return `${FOCAL_LENGTHS[this.settings.get("focalIndex")]} mm`;
    }
  }

  private update(): void {
    const tr = t;
    const resolved = this.resolved();
    const s = this.settings.all();
    for (const dial of ["aperture", "shutter", "iso", "focal"] as const) {
      const box = this.el.panel.querySelector<HTMLElement>(`[data-box="${dial}"]`);
      if (!box) continue;
      const byCamera = (dial === "aperture" && s.exposureMode === "S") || (dial === "shutter" && s.exposureMode === "A");
      const name = dial === "iso" && s.autoIso ? tr("isoAuto") : byCamera ? `${tr(dial)} (${tr("setByCamera")})` : tr(dial);
      box.querySelector(".dial-name")!.textContent = name;
      const output = box.querySelector("output")!;
      output.textContent = this.label(dial, resolved);
      output.classList.toggle("by-camera", byCamera || (dial === "iso" && resolved.isoAltered));
      output.classList.toggle("flashing", resolved.flashing === dial);
      output.title =
        dial === "iso" && resolved.isoAltered ? `${tr("isoChosen")}\u00a0: ${isoLabel(s.iso)}` : resolved.flashing === dial ? this.limitText(resolved) : "";
      for (const button of box.querySelectorAll<HTMLButtonElement>("button[data-step]")) button.disabled = !this.enabled || byCamera;
      // Nom et infobulle : la molette, le signe affiché, puis l'effet (constat INT-16 de l'audit, version 0.4.7). Les
      // signes ne changent pas : « + » augmente le nombre affiché pour les quatre molettes.
      const effects = dial === "iso" && s.autoIso ? AUTO_ISO_EFFECTS : DIAL_EFFECTS[dial];
      for (const [step, sign, effect] of [["-1", "decrease", effects.decrease], ["1", "increase", effects.increase]] as const) {
        const button = box.querySelector<HTMLButtonElement>(`[data-step="${step}"]`)!;
        const text = `${name}, ${tr(sign)}\u00a0: ${tr(effect)}`;
        button.setAttribute("aria-label", text);
        button.title = text;
      }
    }

    this.el.loupeButton.title = tr("loupeHelp");
    this.updateFocus();
    this.updateRelease();
    const offset = resolved.offset;
    // Indicateur d'exposition : en M, écart à l'exposition visée ; en A et S, il montre la correction.
    const indicator = resolved.indicator;
    const shown = Math.max(-METER_RANGE, Math.min(METER_RANGE, indicator));
    this.el.meterNeedle.style.left = `${((shown + METER_RANGE) / (2 * METER_RANGE)) * 100}%`;
    this.el.meterNeedle.classList.toggle("flashing", resolved.flashing !== null);
    const sign = indicator > 0.05 ? "+" : indicator < -0.05 ? "−" : "";
    const amount = Math.abs(indicator).toFixed(1);
    const correction = s.compensation !== 0 ? ` · ${tr("compensationShort")} ${this.compensationText(s.compensation)}` : "";
    const meterText = `${s.exposureMode} · ${sign}${amount.replace(".", ",")} ${tr("meterUnit")}${correction}`;
    this.el.meterValue.textContent = meterText;
    this.el.meterValue.classList.toggle("flashing", resolved.flashing !== null);
    // Nom accessible : le texte affiché, puis ce que le bouton ouvre (constat INT-15 de l'audit, version 0.4.7) ; avant,
    // son nom était sa seule valeur. L'infobulle garde l'aide, écrite aussi dans la fenêtre « Exposition » (INT-09).
    this.el.meterValue.setAttribute("aria-label", `${meterText}\u00a0: ${tr("exposureButtonName")}`);
    this.el.meterValue.title = `${tr("exposureButtonTitle")}. ${tr("meterHelp")}${resolved.flashing ? ` ${this.limitSentence(resolved)}` : ""}`;
    this.updateExposureDialog(tr, resolved);
    // Aperçu de la luminosité coupé : exposition correcte quels que soient les réglages.
    this.scene.imageProcessingConfiguration.exposure = this.showsBrightness() ? 2 ** offset : 1;
    this.noise.setEnabled(this.showsNoise());
    this.dof?.setEnabled(this.showsDepthOfField());
    this.balance?.setEnabled(this.showsBalance());
    this.updatePreview(tr);

    const body = this.body();
    const mm = (value: number) => String(value).replace(".", ",");
    this.el.bodyButton.textContent = body.model;
    this.el.bodyButton.title = `${tr("bodyTitle")}\u00a0: ${body.model}`;
    this.el.bodyDialog.querySelector("#body-title")!.textContent = tr("bodyTitle");
    this.el.bodyDialog.querySelector("#brand-legend")!.textContent = tr("brand");
    // Les choix nomment le boîtier de chaque marque, d'après BODIES, sans coupure dans le nom.
    for (const b of BODIES) {
      this.el.bodyDialog.querySelector(`#brand-${b.brand}-label`)!.textContent = b.model.replace(/ /g, "\u00a0");
    }
    this.el.bodyDialog.querySelector("#body-note")!.textContent = tr("bodyNote");
    this.el.bodyDialog.querySelector("#lens-note")!.textContent = tr("lensNote");
    this.el.bodyDialog.querySelector("#body-close")!.textContent = tr("close");
    // Les trois capteurs, pour les comparer. Espaces insécables dans les noms et entre les nombres et leur unité,
    // pour qu'ils ne se coupent pas en fin de ligne.
    const sensors = BODIES.map(
      (b) =>
        `${b.model.replace(/ /g, "\u00a0")}, ${tr(b.format === "ff" ? "fullFrame" : "apsc")} de ${mm(b.sensorWidthMm)}\u00a0×\u00a0${mm(b.sensorHeightMm)}\u00a0mm`,
    ).join("\u202f; ");
    this.el.bodyDialog.querySelector("#sensor-note")!.textContent = `${tr("sensor")}\u00a0: ${sensors}.`;
    for (const input of this.el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.checked = input.value === s.brand;
    }
    this.applyView();
  }

  /** Cadre du viseur et champ de vue, selon la taille du canevas, le capteur et la focale. */
  private applyView(): void {
    const width = this.engine.getRenderWidth();
    const height = this.engine.getRenderHeight();
    if (width === 0 || height === 0) return;
    const body = this.body();
    const frame = frameFor(width, height, body);
    this.frame = frame;
    this.canvasSize = { width, height };
    // Le boîtier ou le cadrage a pu changer : le point reste dans la zone couverte.
    this.focusPoint = this.clampToCoverage(this.focusPoint);
    const focalMm = FOCAL_LENGTHS[this.settings.get("focalIndex")];
    const fov = cameraFov(width, height, frame, body, focalMm);
    this.camera.fovMode = fov.axis === "vertical" ? Camera.FOVMODE_VERTICAL_FIXED : Camera.FOVMODE_HORIZONTAL_FIXED;
    this.camera.fov = fov.fov;
    if (this.enabled) this.applyLoupe(frame, body);
    this.updateGrid();
    // Bruit du viseur : chaque pixel du cadre regroupe effectivePixels / (largeur × hauteur × grossissement²)
    // photosites, compté par pixel calculé, ou par pixel CSS quand un pixel calculé compte moins d'un photosite de
    // rouge ou de bleu (loupe, à une densité supérieure à 1 : viewfinderNoiseGrid, camera/noiseModel.ts).
    const resolved = this.resolved();
    const gain = this.showsBrightness() ? 1 : 2 ** resolved.offset;
    this.noise.update(
      body,
      isoValue(resolved.settings.iso),
      frame.width * frame.height * this.loupeZoom ** 2,
      this.engine.getHardwareScalingLevel(),
      gain,
    );
    // Profondeur de champ : pixels du canevas par millimètre de capteur, loupe comprise.
    this.dof?.update({
      focalMm,
      aperture: apertureValue(resolved.settings.aperture),
      pixelsPerMm: (Math.max(frame.width, frame.height) / body.sensorWidthMm) * this.loupeZoom,
    });
    // Le canevas peut être dessiné à une autre résolution que sa taille à l'écran : on passe en pourcentages.
    const style = this.el.frame.style;
    style.left = `${(frame.left / width) * 100}%`;
    style.top = `${(frame.top / height) * 100}%`;
    style.width = `${(frame.width / width) * 100}%`;
    style.height = `${(frame.height / height) * 100}%`;
    // Zone couverte par l'autofocus, loupe comprise : une aide de TutoPhoto, le manuel lu ne dit pas si le Z 6
    // l'affiche.
    const coverage = this.coverageOnCanvas();
    const covered = this.el.afCoverage.style;
    if (coverage) {
      covered.left = `${coverage.left * 100}%`;
      covered.top = `${coverage.top * 100}%`;
      covered.width = `${(coverage.right - coverage.left) * 100}%`;
      covered.height = `${(coverage.bottom - coverage.top) * 100}%`;
    }
    for (const listener of this.viewListeners) listener();
  }

  /**
   * Grille de cadrage : lignes placées en pourcentages du cadre, qu'elles suivent quand il change de forme (boîtier,
   * zone du viseur plus haute que large). Masquée quand la loupe agrandit l'image : le cadre garde sa place alors que l'image est
   * grossie, et les lignes ne diviseraient plus l'image entière (choix de TutoPhoto, non sourcé).
   */
  private updateGrid(): void {
    const kind = this.settings.get("grid");
    const grid = this.el.grid;
    // Cadre vertical (zone du viseur plus haute que large) : le grand côté du capteur est vertical, les six cases de
    // « 6 × 4 » aussi.
    const tall = this.frame !== null && this.frame.height > this.frame.width;
    const key = `${kind}:${tall ? "vertical" : "horizontal"}`;
    if (this.drawnGrid !== key) {
      const layout = gridLines(kind, tall);
      const line = (direction: "vertical" | "horizontal", at: number) => {
        const element = document.createElement("div");
        element.className = `grid-line ${direction}`;
        element.style.setProperty(direction === "vertical" ? "left" : "top", `${at * 100}%`);
        return element;
      };
      // Diagonales : un dessin vectoriel étiré aux dimensions du cadre, traits d'épaisseur constante.
      const diagonals = () => {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "grid-diagonals");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        for (const [x1, x2] of [[0, 100], [100, 0]]) {
          for (const tone of ["shade", "light"]) {
            const stroke = document.createElementNS(SVG_NS, "line");
            stroke.setAttribute("class", `grid-diagonal ${tone}`);
            stroke.setAttribute("x1", String(x1));
            stroke.setAttribute("y1", "0");
            stroke.setAttribute("x2", String(x2));
            stroke.setAttribute("y2", "100");
            svg.append(stroke);
          }
        }
        return svg;
      };
      grid.replaceChildren(
        ...layout.vertical.map((at) => line("vertical", at)),
        ...layout.horizontal.map((at) => line("horizontal", at)),
        ...(layout.diagonals ? [diagonals()] : []),
      );
      grid.dataset.grid = kind;
      this.drawnGrid = key;
    }
    grid.hidden = kind === "none" || this.loupeZoom > 1;
  }

  /** Grossissement de la loupe au cran donné : 100 % = définition du capteur / grand côté du cadre. */
  private zoomAt(level: number, frame: Frame, body: Body): number {
    // 100 % : un photosite par pixel CSS. Le cadre est mesuré en pixels calculés ; à la densité de l'écran (version
    // 0.3.52), un pixel CSS en compte 1 / niveau de mise à l'échelle.
    const cssLong = Math.max(frame.width, frame.height) * this.engine.getHardwareScalingLevel();
    const full = sensorPixels(body).long / cssLong;
    return Math.max(1, LOUPE_LEVELS[level] * full);
  }

  /** Crans successifs : pas de loupe, 50 % (si assez grossi), 100 %, puis retour sans loupe. */
  private cycleLoupe(): void {
    if (!this.frame) this.applyView();
    const frame = this.frame!;
    const body = this.body();
    let next = this.loupeLevel + 1;
    while (next < LOUPE_LEVELS.length - 1 && this.zoomAt(next, frame, body) < LOUPE_MIN_ZOOM) next++;
    this.loupeLevel = next >= LOUPE_LEVELS.length ? -1 : next;
    this.applyView();
  }

  /**
   * Projection du viseur grossie autour du point de mise au point : x' = (x − centre) × grossissement, en
   * coordonnées normalisées, soit m0 et m5 multipliés et m8, m9 décalés (camera/optics.ts, windowProjection). La zone
   * grossie reste dans le cadre.
   */
  private applyLoupe(frame: Frame, body: Body): void {
    const tr = t;
    this.camera.unfreezeProjectionMatrix();
    this.loupeZoom = this.loupeLevel < 0 ? 1 : this.zoomAt(this.loupeLevel, frame, body);
    const touch = this.camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
    // On tourne plus lentement quand l'image est grossie.
    this.camera.angularSensibility = this.baseAngularSensibility * this.loupeZoom;
    if (touch && this.baseTouchSensibility !== null) touch.touchAngularSensibility = this.baseTouchSensibility * this.loupeZoom;
    const percent = this.loupeLevel < 0 ? 0 : Math.round(LOUPE_LEVELS[this.loupeLevel] * 100);
    this.el.loupeButton.textContent = this.loupeLevel < 0 ? tr("loupe") : `${tr("loupe")} ${percent}${tr("percent")}`;
    this.el.loupeButton.setAttribute("aria-pressed", String(this.loupeLevel >= 0));
    this.el.loupeBadge.hidden = this.loupeLevel < 0;
    this.el.loupeBadge.textContent = `${tr("loupe")} ${percent}${tr("percent")}`;
    if (this.loupeZoom <= 1) {
      this.loupeCenter = { x: 0, y: 0 };
      return;
    }
    const zoom = this.loupeZoom;
    const halfX = frame.width / this.canvasSize.width;
    const halfY = frame.height / this.canvasSize.height;
    const target = this.frameToNdc(this.focusPoint);
    const limit = (half: number) => half - half / zoom;
    const clamp = (value: number, max: number) => Math.min(max, Math.max(-max, value));
    this.loupeCenter = { x: clamp(target.x, limit(halfX)), y: clamp(target.y, limit(halfY)) };
    const m = windowProjection(this.camera.getProjectionMatrix(true).asArray(), this.loupeCenter, { x: zoom, y: zoom });
    this.camera.freezeProjectionMatrix(Matrix.FromArray(m));
  }

  /** Point du cadre (de 0 à 1, origine en haut à gauche) vers les coordonnées normalisées du canevas. */
  private frameToNdc(point: Point): Point {
    const frame = this.frame!;
    const { width, height } = this.canvasSize;
    return {
      x: ((frame.left + point.x * frame.width) / width) * 2 - 1,
      y: 1 - ((frame.top + point.y * frame.height) / height) * 2,
    };
  }

  private ndcToFrame(ndc: Point): Point {
    const frame = this.frame!;
    const { width, height } = this.canvasSize;
    return {
      x: (((ndc.x + 1) / 2) * width - frame.left) / frame.width,
      y: (((1 - ndc.y) / 2) * height - frame.top) / frame.height,
    };
  }

  /**
   * Bouton et fenêtre « Mise au point », consigne sous le viseur, indicateur dans le viseur (mode, zone,
   * distance, verrou), repère.
   */
  private updateFocus(): void {
    const tr = t;
    const { focusMode, areaMode, detection } = this.settings.all();
    const single = focusMode === "single";
    const short = single ? "AF-S" : "AF-C";
    const areaShort = tr(AREA_KEYS[areaMode].short);
    const afText = `${short} · ${areaShort}`;
    this.el.afButton.textContent = afText;
    this.el.afButton.title = tr("afTitle");
    // Nom accessible : le texte affiché d'abord (constat INT-15 de l'audit, version 0.4.7 ; avant, « Mise au point :
    // AF-S : AF ponctuel, AF point sélectif » pour le texte « AF-S · Point »).
    const afName = tr("afButtonName")
      .replace("{mode}", tr(single ? "afSingleName" : "afContinuousName"))
      .replace("{area}", tr(AREA_KEYS[areaMode].label));
    this.el.afButton.setAttribute("aria-label", `${afText}\u00a0: ${afName}`);
    const dialog = this.el.afDialog;
    dialog.querySelector("#af-title")!.textContent = tr("afTitle");
    dialog.querySelector("#af-mode-legend")!.textContent = tr("afMode");
    dialog.querySelector("#af-single-label")!.textContent = tr("afSingle");
    dialog.querySelector("#af-continuous-label")!.textContent = tr("afContinuous");
    dialog.querySelector("#af-area-legend")!.textContent = tr("areaMode");
    dialog.querySelector("#af-point-label")!.textContent = tr("areaPoint");
    dialog.querySelector("#af-wide-s-label")!.textContent = tr("areaWideS");
    dialog.querySelector("#af-wide-l-label")!.textContent = tr("areaWideL");
    dialog.querySelector("#af-auto-label")!.textContent = tr("areaAuto");
    dialog.querySelector("#af-detection-legend")!.textContent = tr("detectionLegend");
    dialog.querySelector("#af-det-face-eye-label")!.textContent = tr("detFaceEye");
    dialog.querySelector("#af-det-face-label")!.textContent = tr("detFace");
    dialog.querySelector("#af-det-animal-label")!.textContent = tr("detAnimal");
    dialog.querySelector("#af-det-off-label")!.textContent = tr("detOff");
    dialog.querySelector("#af-note")!.textContent = tr("afHelp");
    // La loupe grossit autour du point de mise au point : son aide est écrite dans cette fenêtre, et plus seulement dans
    // l'infobulle de son bouton (constat INT-09 de l'audit, version 0.4.7).
    const loupeHelp = tr("loupeHelp");
    dialog.querySelector("#af-loupe-note")!.textContent = `${tr("loupeNoteLead")} ${loupeHelp.charAt(0).toLowerCase()}${loupeHelp.slice(1)}`;
    dialog.querySelector("#af-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      const current = input.name === "focusMode" ? focusMode : input.name === "areaMode" ? areaMode : detection;
      input.checked = input.value === current;
      if (input.name === "detection") input.disabled = areaMode !== "auto";
    }
    this.el.focusHint.textContent = tr(single ? "focusHintSingle" : "focusHint");
    const af = this.autofocus;
    this.el.afBadge.hidden = !af;
    if (!af) return;
    const locked = af.locked();
    const meters = af.distance().toFixed(1);
    const distance = `${meters.replace(".", ",")} m`;
    // Zone automatique : ce sur quoi l'appareil a fait le point (œil, visage, sujet le plus proche, point touché).
    const target = areaMode === "auto" ? af.target() : null;
    const what = target ? `${tr(TARGET_KEYS[target.kind])} · ` : "";
    const text = `${short} · ${areaShort} · ${what}${locked ? `${tr("lockedAt")} ` : ""}${distance}`;
    if (this.el.afBadge.textContent !== text) this.el.afBadge.textContent = text;
    this.el.focusMarker.classList.toggle("locked", locked);
    // Visage ou œil détecté : repère ambre, comme sur le Z 6 ; vert une fois la distance verrouillée en AF-S.
    this.el.focusMarker.classList.toggle("detected", !locked && (target?.kind === "eye" || target?.kind === "face"));
  }

  private showsBrightness(): boolean {
    const s = this.settings.all();
    return s.previewAll && s.previewBrightness;
  }

  private showsNoise(): boolean {
    const s = this.settings.all();
    return s.previewAll && s.previewNoise;
  }

  private showsDepthOfField(): boolean {
    const s = this.settings.all();
    return s.previewAll && s.previewDepthOfField;
  }

  private showsBalance(): boolean {
    const s = this.settings.all();
    return s.previewAll && s.previewBalance;
  }

  /** Textes de la fenêtre de l'aperçu, cases cochées, grille choisie, et rappel dans le viseur de ce qui n'est pas montré. */
  private updatePreview(tr: (key: MessageKey) => string): void {
    const dialog = this.el.previewDialog;
    this.el.previewButton.textContent = tr("previewButton");
    this.el.previewButton.title = tr("previewTitle");
    dialog.querySelector("#preview-title")!.textContent = tr("previewTitle");
    dialog.querySelector("#preview-all-label")!.textContent = tr("previewAll");
    dialog.querySelector("#preview-brightness-label")!.textContent = tr("previewBrightness");
    dialog.querySelector("#preview-noise-label")!.textContent = tr("previewNoise");
    dialog.querySelector("#preview-dof-label")!.textContent = tr("previewDepthOfField");
    dialog.querySelector("#preview-balance-label")!.textContent = tr("previewBalance");
    dialog.querySelector("#preview-note")!.textContent = tr("previewNote");
    dialog.querySelector("#preview-grid-legend")!.textContent = tr("gridLegend");
    dialog.querySelector("#preview-grid-none-label")!.textContent = tr("gridNone");
    dialog.querySelector("#preview-grid-thirds-label")!.textContent = tr("gridThirds");
    dialog.querySelector("#preview-grid-sixteen-label")!.textContent = tr("gridSixteen");
    dialog.querySelector("#preview-grid-twentyfour-label")!.textContent = tr("gridTwentyFour");
    dialog.querySelector("#preview-grid-diagonals-label")!.textContent = tr("gridThirdsDiagonals");
    dialog.querySelector("#preview-grid-note")!.textContent = tr("gridNote");
    dialog.querySelector("#preview-close")!.textContent = tr("close");
    const s = this.settings.all();
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.checked = s[PREVIEW_SWITCHES[input.value as PreviewSwitch]];
      if (input.value !== "all") input.disabled = !s.previewAll;
    }
    // La grille ne dépend pas de l'interrupteur général : il ne la grise pas, et elle ne compte pas dans le rappel.
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=grid]")) input.checked = input.value === s.grid;
    const hidden: string[] = [];
    if (!this.showsBrightness()) hidden.push(tr("previewBrightnessShort"));
    if (!this.showsNoise()) hidden.push(tr("previewNoiseShort"));
    if (!this.showsDepthOfField()) hidden.push(tr("previewDepthOfFieldShort"));
    if (!this.showsBalance()) hidden.push(tr("previewBalanceShort"));
    this.el.previewBadge.hidden = hidden.length === 0;
    const list = hidden.length > 1 ? `${hidden.slice(0, -1).join(", ")}${tr("and")}${hidden[hidden.length - 1]}` : hidden.join("");
    this.el.previewBadge.textContent = `${tr("previewOff")}\u00a0: ${list}`;
  }
}
