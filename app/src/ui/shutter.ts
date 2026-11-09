// Déclencheur : choix du point de mise au point en touchant le viseur, calcul de la photo, écran de revue.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { takePhoto, type GroundInfo, type SceneTimeControl } from "../camera/photo";
import type { CameraPanel } from "./cameraPanel";
import type { ViewfinderNoise } from "../camera/noise";
import { t, type Lang, type MessageKey } from "../i18n";

/** Un toucher qui bouge de moins de 6 px et dure moins de 0,4 s choisit le point ; au-delà, on tourne. */
const TAP_MAX_MOVE_PX = 6;
const TAP_MAX_MS = 400;

interface ShutterElements {
  canvas: HTMLCanvasElement;
  frame: HTMLElement;
  marker: HTMLElement;
  hint: HTMLElement;
  button: HTMLButtonElement;
  progress: HTMLElement;
  progressLabel: HTMLElement;
  progressBar: HTMLElement;
  review: HTMLElement;
  reviewImage: HTMLImageElement;
  reviewCaption: HTMLElement;
  reviewBack: HTMLButtonElement;
  reviewSave: HTMLAnchorElement;
}

export class Shutter {
  /** Point de mise au point dans le cadre, de 0 à 1, origine en haut à gauche ; centre par défaut. */
  private focusPoint = { x: 0.5, y: 0.5 };
  private busy = false;
  private photoUrl: string | null = null;
  private lastCaption: (() => string) | null = null;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: UniversalCamera,
    private readonly time: SceneTimeControl,
    private readonly ground: GroundInfo,
    private readonly panel: CameraPanel,
    private readonly el: ShutterElements,
    private readonly resumeRendering: () => void,
    private lang: Lang,
    private readonly noise: ViewfinderNoise,
  ) {
    let down: { x: number; y: number; at: number } | null = null;
    el.canvas.addEventListener("pointerdown", (e) => (down = { x: e.clientX, y: e.clientY, at: performance.now() }));
    el.canvas.addEventListener("pointerup", (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < TAP_MAX_MOVE_PX && performance.now() - down.at < TAP_MAX_MS) this.choosePoint(e.clientX, e.clientY);
      down = null;
    });
    el.button.addEventListener("click", () => void this.release());
    el.reviewBack.addEventListener("click", () => this.closeReview());
    engine.onResizeObservable.add(() => this.placeMarker());
    this.setLang(lang);
    requestAnimationFrame(() => this.placeMarker());
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    const tr = (key: MessageKey) => t(lang, key);
    this.el.button.textContent = tr("shutterButton");
    this.el.hint.textContent = tr("focusHint");
    this.el.marker.title = tr("focusPoint");
    this.el.progressLabel.textContent = tr("computing");
    this.el.reviewBack.textContent = tr("reviewBack");
    this.el.reviewSave.textContent = tr("save");
    if (this.lastCaption) this.el.reviewCaption.textContent = this.lastCaption();
  }

  private choosePoint(clientX: number, clientY: number): void {
    const rect = this.el.frame.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    this.focusPoint = { x, y };
    this.placeMarker();
  }

  /** Le repère du point suit le cadre (en pourcentage du canevas, comme le cadre). */
  private placeMarker(): void {
    const frame = this.el.frame.style;
    const left = parseFloat(frame.left) || 0;
    const top = parseFloat(frame.top) || 0;
    const width = parseFloat(frame.width) || 100;
    const height = parseFloat(frame.height) || 100;
    this.el.marker.style.left = `${left + this.focusPoint.x * width}%`;
    this.el.marker.style.top = `${top + this.focusPoint.y * height}%`;
  }

  private async release(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    const settings = this.panel.current();
    this.panel.setEnabled(false);
    this.el.progress.hidden = false;
    this.el.progressBar.style.width = "0%";
    this.engine.stopRenderLoop();
    this.noise.suspend();
    try {
      const photo = await takePhoto(
        this.engine,
        this.scene,
        this.camera,
        this.time,
        this.ground,
        {
          body: settings.body,
          focalMm: settings.focalMm,
          aperture: settings.aperture,
          shutterSeconds: settings.shutterSeconds,
          iso: settings.iso,
          exposure: settings.exposure,
          focusPoint: this.focusPoint,
          portrait: settings.frame.portrait,
        },
        (fraction) => (this.el.progressBar.style.width = `${Math.round(fraction * 100)}%`),
      );
      if (this.photoUrl) URL.revokeObjectURL(this.photoUrl);
      this.photoUrl = photo.url;
      this.el.reviewImage.src = photo.url;
      this.el.reviewImage.width = photo.width;
      this.el.reviewImage.height = photo.height;
      this.el.reviewSave.href = photo.url;
      this.lastCaption = () => {
        const tr = (key: MessageKey) => t(this.lang, key);
        const decimal = (value: number, digits: number) => {
          const text = value.toFixed(digits);
          return this.lang === "fr" ? text.replace(".", ",") : text;
        };
        const samples = photo.samples < photo.plannedSamples ? `${photo.samples}/${photo.plannedSamples}` : `${photo.samples}`;
        return `${settings.summary} · ${settings.body.model} · ${tr("focusedAt")} ${decimal(photo.focusDistance, 1)} m · ${samples} ${tr("renders")}, ${tr("computedIn")} ${decimal(photo.milliseconds / 1000, 1)} s`;
      };
      this.el.reviewCaption.textContent = this.lastCaption();
      this.el.reviewImage.alt = this.lastCaption();
      this.el.review.hidden = false;
    } catch (error) {
      console.error(error);
      this.lastCaption = () => t(this.lang, "photoError");
      this.el.reviewCaption.textContent = this.lastCaption();
      this.el.review.hidden = false;
    } finally {
      this.el.progress.hidden = true;
      this.noise.resume();
      this.panel.setEnabled(true);
      this.resumeRendering();
      this.busy = false;
    }
  }

  private closeReview(): void {
    this.el.review.hidden = true;
  }
}
