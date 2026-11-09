// Boîtier virtuel minimal : ouverture, vitesse, ISO, focale, boîtier de référence, cellule d'exposition.
// L'aperçu d'exposition multiplie la lumière de la scène par 2^écart (écart en IL, camera/exposure.ts),
// avant l'affichage ; sans courbe de tons, ce qui dépasse le blanc est écrêté.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { BODIES, findBody, type Body, type Brand, type Format } from "../camera/bodies";
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
import { t, type Lang, type MessageKey } from "../i18n";

/** Écart maximal affiché par la cellule, en IL. */
const METER_RANGE = 3;
const STORAGE_KEY = "tutophoto.boitier";

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
}

export class CameraPanel {
  private settings: ExposureSettings = { ...DEFAULT_SETTINGS };
  private focalIndex = DEFAULT_FOCAL_INDEX;
  private brand: Brand = "nikon";
  private format: Format = "ff";
  private lang: Lang;
  private frame: Frame | null = null;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: UniversalCamera,
    private readonly el: PanelElements,
    lang: Lang,
    private readonly noise: ViewfinderNoise,
  ) {
    this.lang = lang;
    this.restoreBody();
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

  /** Grise les réglages pendant le calcul d'une photo. */
  setEnabled(enabled: boolean): void {
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

    const offset = exposureOffset(this.settings);
    const shown = Math.max(-METER_RANGE, Math.min(METER_RANGE, offset));
    this.el.meterNeedle.style.left = `${((shown + METER_RANGE) / (2 * METER_RANGE)) * 100}%`;
    const sign = offset > 0.05 ? "+" : offset < -0.05 ? "−" : "";
    const amount = Math.abs(offset).toFixed(1);
    this.el.meterValue.textContent = `${tr("meter")} ${sign}${this.lang === "fr" ? amount.replace(".", ",") : amount} ${tr("meterUnit")}`;
    this.el.meterValue.title = tr("meterHelp");
    this.scene.imageProcessingConfiguration.exposure = 2 ** offset;

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
    // Bruit du viseur : chaque pixel du cadre regroupe effectivePixels / (largeur × hauteur) photosites.
    this.noise.update(body, isoValue(this.settings.iso), frame.width * frame.height);
    const fov = cameraFov(width, height, frame, body, FOCAL_LENGTHS[this.focalIndex]);
    this.camera.fovMode = fov.axis === "vertical" ? Camera.FOVMODE_VERTICAL_FIXED : Camera.FOVMODE_HORIZONTAL_FIXED;
    this.camera.fov = fov.fov;
    // Le canevas peut être dessiné à une autre résolution que sa taille à l'écran : on passe en pourcentages.
    const style = this.el.frame.style;
    style.left = `${(frame.left / width) * 100}%`;
    style.top = `${(frame.top / height) * 100}%`;
    style.width = `${(frame.width / width) * 100}%`;
    style.height = `${(frame.height / height) * 100}%`;
  }

  private restoreBody(): void {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { brand?: string; format?: string } | null;
      if (saved && BODIES.some((b) => b.brand === saved.brand && b.format === saved.format)) {
        this.brand = saved.brand as Brand;
        this.format = saved.format as Format;
      }
    } catch {
      // Stockage indisponible : boîtier par défaut.
    }
  }

  private saveBody(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ brand: this.brand, format: this.format }));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }
}
