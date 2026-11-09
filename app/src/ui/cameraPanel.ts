// Boîtier virtuel minimal : ouverture, vitesse, ISO, focale, boîtier de référence, cellule d'exposition,
// mode de mise au point.
// L'aperçu d'exposition multiplie la lumière de la scène par 2^écart (écart en IL, camera/exposure.ts),
// avant l'affichage ; sans courbe de tons, ce qui dépasse le blanc est écrêté.
// Aperçu dans le viseur (décision du 9 novembre 2026) : un interrupteur général et un par effet
// (luminosité, bruit), en marche par défaut. Coupé, le viseur reste correctement exposé et sans bruit ;
// la photo garde toujours tous les effets.
// Loupe du viseur (même décision) : grossit l'image autour du point de mise au point, jusqu'à 100 % (un
// pixel du canevas pour un photosite), comme la fonction de grossissement des hybrides. Elle ne change
// que l'affichage : la photo couvre toujours tout le cadre.
// Mode de mise au point (MAP-04, décision du 9 novembre 2026) : AF-S ou AF-C (camera/autofocus.ts). Le
// viseur indique le mode et la distance ; le repère du point passe au vert quand la distance est verrouillée,
// comme le collimateur du Nikon Z 6 [nikon-z6-focus].

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import type { FreeCameraTouchInput } from "@babylonjs/core/Cameras/Inputs/freeCameraTouchInput";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { BODIES, findBody, sensorPixels, type Body, type Brand, type Format } from "../camera/bodies";
import {
  DEFAULT_FOCAL_INDEX,
  DEFAULT_SETTINGS,
  FOCAL_LENGTHS,
  SCALES,
  apertureLabel,
  apertureValue,
  exposureOffset,
  isoLabel,
  isoValue,
  shutterLabel,
  shutterSeconds,
  type ExposureSettings,
} from "../camera/exposure";
import { cameraFov, frameFor, type Frame } from "../camera/viewfinder";
import type { ViewfinderNoise } from "../camera/noise";
import type { ViewfinderDepthOfField } from "../camera/viewfinderDof";
import type { Autofocus, FocusMode } from "../camera/autofocus";
import { t, type Lang, type MessageKey } from "../i18n";

/** Écart maximal affiché par la cellule, en IL. */
const METER_RANGE = 3;
const STORAGE_KEY = "tutophoto.boitier";
const PREVIEW_STORAGE_KEY = "tutophoto.apercu";
/** Grossissements de la loupe, en fraction de la vue à 100 % ; un cran trop proche de 1 est sauté. */
const LOUPE_LEVELS = [0.5, 1] as const;
const LOUPE_MIN_ZOOM = 1.25;

/** Interrupteurs de l'aperçu dans le viseur. */
interface Preview {
  all: boolean;
  brightness: boolean;
  noise: boolean;
  depthOfField: boolean;
}

type Dial = "aperture" | "shutter" | "iso" | "focal";

/** Réglages courants, pour la photo calculée. */
export interface CurrentSettings {
  body: Body;
  focalMm: number;
  aperture: number;
  shutterSeconds: number;
  iso: number;
  exposure: number;
  frame: Frame;
  /** Réglages tels qu'affichés : « f/8 · 1/100 s · ISO 100 · 50 mm ». */
  summary: string;
}

interface PanelElements {
  panel: HTMLElement;
  frame: HTMLElement;
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
  afBadge: HTMLElement;
  focusMarker: HTMLElement;
  focusHint: HTMLElement;
}

type Point = { x: number; y: number };

export class CameraPanel {
  private settings: ExposureSettings = { ...DEFAULT_SETTINGS };
  private focalIndex = DEFAULT_FOCAL_INDEX;
  private brand: Brand = "nikon";
  private format: Format = "ff";
  private lang: Lang;
  private frame: Frame | null = null;
  private preview: Preview = { all: true, brightness: true, noise: true, depthOfField: true };
  private dof: ViewfinderDepthOfField | null = null;
  private autofocus: Autofocus | null = null;
  private focusMode: FocusMode = "continuous";
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
    lang: Lang,
    private readonly noise: ViewfinderNoise,
  ) {
    this.lang = lang;
    this.baseAngularSensibility = camera.angularSensibility;
    const touch = camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
    this.baseTouchSensibility = touch ? touch.touchAngularSensibility : null;
    el.loupeButton.addEventListener("click", () => this.cycleLoupe());
    el.afButton.addEventListener("click", () => this.toggleFocusMode());
    this.restoreBody();
    this.restorePreview();
    for (const button of el.panel.querySelectorAll<HTMLButtonElement>("button[data-dial]")) {
      button.addEventListener("click", () => this.step(button.dataset.dial as Dial, Number(button.dataset.step)));
    }
    el.bodyButton.addEventListener("click", () => el.bodyDialog.showModal());
    for (const input of el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.addEventListener("change", () => {
        if (input.name === "brand") this.brand = input.value as Brand;
        if (input.name === "format") this.format = input.value as Format;
        this.saveBody();
        this.update();
      });
    }
    el.previewButton.addEventListener("click", () => el.previewDialog.showModal());
    for (const input of el.previewDialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.addEventListener("change", () => {
        this.preview[input.value as keyof Preview] = input.checked;
        this.savePreview();
        this.update();
      });
    }
    engine.onResizeObservable.add(() => this.applyView());
    this.update();
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.update();
  }

  current(): CurrentSettings {
    if (!this.frame) this.applyView();
    return {
      body: this.body(),
      focalMm: FOCAL_LENGTHS[this.focalIndex],
      aperture: apertureValue(this.settings.aperture),
      shutterSeconds: shutterSeconds(this.settings.shutter),
      iso: isoValue(this.settings.iso),
      exposure: 2 ** exposureOffset(this.settings),
      frame: this.frame!,
      summary: [this.label("aperture"), this.label("shutter"), `ISO ${this.label("iso")}`, this.label("focal")].join(" · "),
    };
  }

  /** Autofocus du viseur, créé après le panneau (il lit le point de mise au point). */
  attachAutofocus(autofocus: Autofocus): void {
    this.autofocus = autofocus;
    autofocus.setMode(this.focusMode);
    autofocus.onChange(() => this.updateFocus());
    this.updateFocus();
  }

  /** Profondeur de champ du viseur, créée après le panneau (elle lit le point de mise au point). */
  attachDepthOfField(dof: ViewfinderDepthOfField): void {
    this.dof = dof;
    this.update();
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

  /** Appelé à chaque changement du viseur (taille, focale, boîtier, loupe). */
  onViewChange(listener: () => void): void {
    this.viewListeners.push(listener);
  }

  /** Point de mise au point choisi : la loupe se centre dessus ; en AF-S, le toucher fait le point. */
  setFocusPoint(point: Point): void {
    this.focusPoint = point;
    this.applyView();
    if (this.autofocus?.mode() === "single") void this.autofocus.focusNow();
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

  /** Grise les réglages pendant le calcul d'une photo. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    for (const button of this.el.panel.querySelectorAll<HTMLButtonElement>("button")) button.disabled = !enabled;
  }

  private body() {
    return findBody(this.brand, this.format);
  }

  /** « + » augmente la valeur affichée : nombre f, durée de pose, ISO, focale. */
  private step(dial: Dial, delta: number): void {
    const clamp = (value: number, size: number) => Math.min(size - 1, Math.max(0, value));
    if (dial === "aperture") this.settings.aperture = clamp(this.settings.aperture + delta, SCALES.aperture);
    // L'échelle des vitesses va de 30 s à 1/4000 s : une pose plus longue est un indice plus petit.
    if (dial === "shutter") this.settings.shutter = clamp(this.settings.shutter - delta, SCALES.shutter);
    if (dial === "iso") this.settings.iso = clamp(this.settings.iso + delta, SCALES.iso);
    if (dial === "focal") this.focalIndex = clamp(this.focalIndex + delta, FOCAL_LENGTHS.length);
    this.update();
  }

  private label(dial: Dial): string {
    const decimal = (text: string) => (this.lang === "fr" ? text.replace(".", ",") : text);
    switch (dial) {
      case "aperture":
        return `f/${decimal(apertureLabel(this.settings.aperture))}`;
      case "shutter": {
        const label = shutterLabel(this.settings.shutter);
        return label.includes("/") ? `${label} s` : `${decimal(label)} s`;
      }
      case "iso":
        return isoLabel(this.settings.iso);
      case "focal":
        return `${FOCAL_LENGTHS[this.focalIndex]} mm`;
    }
  }

  private update(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const colon = this.lang === "fr" ? " : " : ": ";
    for (const dial of ["aperture", "shutter", "iso", "focal"] as const) {
      const box = this.el.panel.querySelector<HTMLElement>(`[data-box="${dial}"]`);
      if (!box) continue;
      box.querySelector(".dial-name")!.textContent = tr(dial);
      box.querySelector("output")!.textContent = this.label(dial);
      box.querySelector<HTMLButtonElement>('[data-step="-1"]')!.setAttribute("aria-label", `${tr(dial)}${colon}${tr("decrease")}`);
      box.querySelector<HTMLButtonElement>('[data-step="1"]')!.setAttribute("aria-label", `${tr(dial)}${colon}${tr("increase")}`);
    }

    this.el.loupeButton.title = tr("loupeHelp");
    this.updateFocus();
    const offset = exposureOffset(this.settings);
    const shown = Math.max(-METER_RANGE, Math.min(METER_RANGE, offset));
    this.el.meterNeedle.style.left = `${((shown + METER_RANGE) / (2 * METER_RANGE)) * 100}%`;
    const sign = offset > 0.05 ? "+" : offset < -0.05 ? "−" : "";
    const amount = Math.abs(offset).toFixed(1);
    this.el.meterValue.textContent = `${tr("meter")} ${sign}${this.lang === "fr" ? amount.replace(".", ",") : amount} ${tr("meterUnit")}`;
    this.el.meterValue.title = tr("meterHelp");
    // Aperçu de la luminosité coupé : exposition correcte quels que soient les réglages.
    this.scene.imageProcessingConfiguration.exposure = this.showsBrightness() ? 2 ** offset : 1;
    this.noise.setEnabled(this.showsNoise());
    this.dof?.setEnabled(this.showsDepthOfField());
    this.updatePreview(tr, colon);

    const body = this.body();
    const mm = (value: number) => (this.lang === "fr" ? String(value).replace(".", ",") : String(value));
    this.el.bodyButton.textContent = body.model;
    this.el.bodyButton.title = `${tr("bodyTitle")}${colon}${body.model}`;
    this.el.bodyDialog.querySelector("#body-title")!.textContent = tr("bodyTitle");
    this.el.bodyDialog.querySelector("#brand-legend")!.textContent = tr("brand");
    this.el.bodyDialog.querySelector("#format-legend")!.textContent = tr("format");
    this.el.bodyDialog.querySelector("#format-ff-label")!.textContent = tr("fullFrame");
    this.el.bodyDialog.querySelector("#format-apsc-label")!.textContent = tr("apsc");
    this.el.bodyDialog.querySelector("#lens-note")!.textContent = tr("lensNote");
    this.el.bodyDialog.querySelector("#body-close")!.textContent = tr("close");
    const sensors = BODIES.filter((b) => b.brand === this.brand)
      .map((b) => `${b.model}${colon}${mm(b.sensorWidthMm)} × ${mm(b.sensorHeightMm)} mm`)
      .join(this.lang === "fr" ? " ; " : "; ");
    this.el.bodyDialog.querySelector("#sensor-note")!.textContent = `${tr("sensor")}${colon}${sensors}`;
    for (const input of this.el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.checked = input.value === (input.name === "brand" ? this.brand : this.format);
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
    const fov = cameraFov(width, height, frame, body, FOCAL_LENGTHS[this.focalIndex]);
    this.camera.fovMode = fov.axis === "vertical" ? Camera.FOVMODE_VERTICAL_FIXED : Camera.FOVMODE_HORIZONTAL_FIXED;
    this.camera.fov = fov.fov;
    if (this.enabled) this.applyLoupe(frame, body);
    // Bruit du viseur : chaque pixel du cadre regroupe effectivePixels / (largeur × hauteur × grossissement²)
    // photosites.
    const gain = this.showsBrightness() ? 1 : 2 ** exposureOffset(this.settings);
    this.noise.update(body, isoValue(this.settings.iso), frame.width * frame.height * this.loupeZoom ** 2, gain);
    // Profondeur de champ : pixels du canevas par millimètre de capteur, loupe comprise.
    this.dof?.update({
      focalMm: FOCAL_LENGTHS[this.focalIndex],
      aperture: apertureValue(this.settings.aperture),
      pixelsPerMm: (Math.max(frame.width, frame.height) / body.sensorWidthMm) * this.loupeZoom,
    });
    // Le canevas peut être dessiné à une autre résolution que sa taille à l'écran : on passe en pourcentages.
    const style = this.el.frame.style;
    style.left = `${(frame.left / width) * 100}%`;
    style.top = `${(frame.top / height) * 100}%`;
    style.width = `${(frame.width / width) * 100}%`;
    style.height = `${(frame.height / height) * 100}%`;
    for (const listener of this.viewListeners) listener();
  }

  /** Grossissement de la loupe au cran donné : 100 % = définition du capteur / grand côté du cadre. */
  private zoomAt(level: number, frame: Frame, body: Body): number {
    const full = sensorPixels(body).long / Math.max(frame.width, frame.height);
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
   * coordonnées normalisées, soit m0 et m5 multipliés et m8, m9 décalés. La zone grossie reste dans le cadre.
   */
  private applyLoupe(frame: Frame, body: Body): void {
    const tr = (key: MessageKey) => t(this.lang, key);
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
    const m = Array.from(this.camera.getProjectionMatrix(true).asArray());
    m[0] *= zoom;
    m[5] *= zoom;
    m[8] = (m[8] - this.loupeCenter.x) * zoom;
    m[9] = (m[9] - this.loupeCenter.y) * zoom;
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

  private toggleFocusMode(): void {
    this.focusMode = this.focusMode === "single" ? "continuous" : "single";
    this.saveBody();
    this.autofocus?.setMode(this.focusMode);
    this.updateFocus();
  }

  /** Bouton du mode, consigne sous le viseur, indicateur dans le viseur (mode, distance, verrou), repère. */
  private updateFocus(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const colon = this.lang === "fr" ? " : " : ": ";
    const single = this.focusMode === "single";
    const short = single ? "AF-S" : "AF-C";
    this.el.afButton.textContent = short;
    this.el.afButton.title = tr("afHelp");
    this.el.afButton.setAttribute("aria-label", `${tr("afMode")}${colon}${tr(single ? "afSingle" : "afContinuous")}`);
    this.el.focusHint.textContent = tr(single ? "focusHintSingle" : "focusHint");
    const af = this.autofocus;
    this.el.afBadge.hidden = !af;
    if (!af) return;
    const locked = af.locked();
    const meters = af.distance().toFixed(1);
    const distance = `${this.lang === "fr" ? meters.replace(".", ",") : meters} m`;
    const text = locked ? `${short} · ${tr("lockedAt")} ${distance}` : `${short} · ${distance}`;
    if (this.el.afBadge.textContent !== text) this.el.afBadge.textContent = text;
    this.el.focusMarker.classList.toggle("locked", locked);
  }

  private showsBrightness(): boolean {
    return this.preview.all && this.preview.brightness;
  }

  private showsNoise(): boolean {
    return this.preview.all && this.preview.noise;
  }

  private showsDepthOfField(): boolean {
    return this.preview.all && this.preview.depthOfField;
  }

  /** Textes de la fenêtre de l'aperçu, cases cochées, et rappel dans le viseur de ce qui n'est pas montré. */
  private updatePreview(tr: (key: MessageKey) => string, colon: string): void {
    const dialog = this.el.previewDialog;
    this.el.previewButton.textContent = tr("previewButton");
    this.el.previewButton.title = tr("previewTitle");
    dialog.querySelector("#preview-title")!.textContent = tr("previewTitle");
    dialog.querySelector("#preview-all-label")!.textContent = tr("previewAll");
    dialog.querySelector("#preview-brightness-label")!.textContent = tr("previewBrightness");
    dialog.querySelector("#preview-noise-label")!.textContent = tr("previewNoise");
    dialog.querySelector("#preview-dof-label")!.textContent = tr("previewDepthOfField");
    dialog.querySelector("#preview-note")!.textContent = tr("previewNote");
    dialog.querySelector("#preview-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.checked = this.preview[input.value as keyof Preview];
      if (input.value !== "all") input.disabled = !this.preview.all;
    }
    const hidden: string[] = [];
    if (!this.showsBrightness()) hidden.push(tr("previewBrightnessShort"));
    if (!this.showsNoise()) hidden.push(tr("previewNoiseShort"));
    if (!this.showsDepthOfField()) hidden.push(tr("previewDepthOfFieldShort"));
    this.el.previewBadge.hidden = hidden.length === 0;
    const list = hidden.length > 1 ? `${hidden.slice(0, -1).join(", ")}${tr("and")}${hidden[hidden.length - 1]}` : hidden.join("");
    this.el.previewBadge.textContent = `${tr("previewOff")}${colon}${list}`;
  }

  private restorePreview(): void {
    try {
      const saved = JSON.parse(window.localStorage.getItem(PREVIEW_STORAGE_KEY) ?? "null") as Partial<Preview> | null;
      if (saved) {
        for (const key of ["all", "brightness", "noise", "depthOfField"] as const) {
          if (typeof saved[key] === "boolean") this.preview[key] = saved[key];
        }
      }
    } catch {
      // Stockage indisponible : aperçu complet.
    }
  }

  private savePreview(): void {
    try {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(this.preview));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }

  private restoreBody(): void {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { brand?: string; format?: string; focusMode?: string } | null;
      if (saved && BODIES.some((b) => b.brand === saved.brand && b.format === saved.format)) {
        this.brand = saved.brand as Brand;
        this.format = saved.format as Format;
      }
      if (saved?.focusMode === "single" || saved?.focusMode === "continuous") this.focusMode = saved.focusMode;
    } catch {
      // Stockage indisponible : boîtier par défaut.
    }
  }

  private saveBody(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ brand: this.brand, format: this.format, focusMode: this.focusMode }));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }
}
