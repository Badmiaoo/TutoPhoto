// Déclencheur : choix du point de mise au point en touchant le viseur, calcul de la photo, écran de revue.
// Loupe de l'écran de revue (décision du 9 novembre 2026) : toucher la photo recalcule, autour du point
// touché, une fenêtre à 100 % (un pixel de l'image pour un photosite, affiché sur un pixel CSS).

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { takePhoto, type GroundInfo, type PhotoRequest, type PhotoResult, type SceneTimeControl } from "../camera/photo";
import { sensorPixels } from "../camera/bodies";
import type { CameraPanel, CurrentSettings } from "./cameraPanel";
import type { ViewfinderNoise } from "../camera/noise";
import { t, type Lang, type MessageKey } from "../i18n";

/** Un toucher qui bouge de moins de 6 px et dure moins de 0,4 s choisit le point ; au-delà, on tourne. */
const TAP_MAX_MOVE_PX = 6;
const TAP_MAX_MS = 400;
/** Plus grand côté de la fenêtre de la loupe, en pixels. */
const LOUPE_MAX_SIDE = 1500;

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
  reviewHint: HTMLElement;
  reviewBack: HTMLButtonElement;
  reviewWhole: HTMLButtonElement;
  reviewSave: HTMLAnchorElement;
}

/** Dernière photo : réglages, demande et résultat, pour la loupe. */
interface Shot {
  settings: CurrentSettings;
  request: PhotoRequest;
  photo: PhotoResult;
}

/** Fenêtre affichée par la loupe, dans l'image à la définition du capteur. */
interface LoupeView {
  url: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
}

export class Shutter {
  /** Point de mise au point dans le cadre, de 0 à 1, origine en haut à gauche ; centre par défaut. */
  private focusPoint = { x: 0.5, y: 0.5 };
  private busy = false;
  private shot: Shot | null = null;
  private loupe: LoupeView | null = null;
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
    el.reviewWhole.addEventListener("click", () => this.showWhole());
    el.reviewImage.addEventListener("click", (e) => void this.magnify(e));
    panel.onViewChange(() => this.placeMarker());
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
    this.el.reviewWhole.textContent = tr("reviewWhole");
    this.el.reviewHint.textContent = tr("reviewHint");
    this.el.reviewSave.textContent = tr("save");
    if (this.lastCaption) this.el.reviewCaption.textContent = this.lastCaption();
  }

  /** Toucher le viseur : avec la loupe, le point touché est ramené au cadre complet. */
  private choosePoint(clientX: number, clientY: number): void {
    const rect = this.el.frame.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const point = this.panel.displayedToFrame({ x, y });
    this.focusPoint = { x: Math.min(1, Math.max(0, point.x)), y: Math.min(1, Math.max(0, point.y)) };
    this.panel.setFocusPoint(this.focusPoint);
  }

  /** Le repère du point suit le cadre (en pourcentage du canevas, comme le cadre) et la loupe. */
  private placeMarker(): void {
    const frame = this.el.frame.style;
    const left = parseFloat(frame.left) || 0;
    const top = parseFloat(frame.top) || 0;
    const width = parseFloat(frame.width) || 100;
    const height = parseFloat(frame.height) || 100;
    const shown = this.panel.frameToDisplayed(this.focusPoint);
    this.el.marker.hidden = shown.x < 0 || shown.x > 1 || shown.y < 0 || shown.y > 1;
    this.el.marker.style.left = `${left + shown.x * width}%`;
    this.el.marker.style.top = `${top + shown.y * height}%`;
  }

  /** Calcul sans affichage du viseur : boucle de rendu arrêtée, bruit du viseur retiré, réglages grisés. */
  private async compute(request: PhotoRequest): Promise<PhotoResult> {
    this.busy = true;
    this.panel.setEnabled(false);
    this.el.progress.hidden = false;
    this.el.progressBar.style.width = "0%";
    this.engine.stopRenderLoop();
    this.noise.suspend();
    try {
      return await takePhoto(this.engine, this.scene, this.camera, this.time, this.ground, request, (fraction) => {
        this.el.progressBar.style.width = `${Math.round(fraction * 100)}%`;
      });
    } finally {
      this.el.progress.hidden = true;
      this.noise.resume();
      this.panel.setEnabled(true);
      this.panel.restoreView();
      this.resumeRendering();
      this.busy = false;
    }
  }

  private async release(): Promise<void> {
    if (this.busy) return;
    const settings = this.panel.current();
    const request: PhotoRequest = {
      body: settings.body,
      focalMm: settings.focalMm,
      aperture: settings.aperture,
      shutterSeconds: settings.shutterSeconds,
      iso: settings.iso,
      exposure: settings.exposure,
      focusPoint: { ...this.focusPoint },
      portrait: settings.frame.portrait,
    };
    try {
      const photo = await this.compute(request);
      if (this.shot) URL.revokeObjectURL(this.shot.photo.url);
      this.dropLoupe();
      this.shot = { settings, request, photo };
      this.el.reviewSave.href = photo.url;
      this.showWhole();
    } catch (error) {
      console.error(error);
      this.showError();
    }
  }

  /** Photo entière, avec ses réglages, la distance de mise au point, les rendus et la durée du calcul. */
  private showWhole(): void {
    const shot = this.shot;
    if (!shot) return;
    const { photo, settings } = shot;
    this.setImage(photo.url, photo.width, photo.height);
    this.el.reviewWhole.hidden = true;
    this.el.reviewHint.hidden = false;
    this.lastCaption = () => {
      const tr = (key: MessageKey) => t(this.lang, key);
      return `${settings.summary} · ${settings.body.model} · ${tr("focusedAt")} ${this.decimal(photo.focusDistance, 1)} m · ${this.computedText(photo)}`;
    };
    this.showCaption();
  }

  /** Toucher la photo, ou la fenêtre de la loupe : fenêtre à 100 % centrée sur le point touché. */
  private async magnify(event: MouseEvent): Promise<void> {
    const shot = this.shot;
    if (!shot || this.busy) return;
    const image = this.el.reviewImage;
    const u = event.offsetX / image.clientWidth;
    const v = event.offsetY / image.clientHeight;
    // Point touché, en fraction de l'image complète.
    const at = this.loupe
      ? { x: (this.loupe.left + u * this.loupe.width) / this.loupe.fullWidth, y: (this.loupe.top + v * this.loupe.height) / this.loupe.fullHeight }
      : { x: u, y: v };
    const pixels = sensorPixels(shot.request.body);
    const fullWidth = Math.round(shot.request.portrait ? pixels.short : pixels.long);
    const fullHeight = Math.round(shot.request.portrait ? pixels.long : pixels.short);
    // Fenêtre de la taille de la zone d'affichage, en pixels CSS, sans dépasser l'image complète.
    const width = Math.min(fullWidth, LOUPE_MAX_SIDE, Math.max(64, Math.floor(this.el.review.clientWidth - 24)));
    const height = Math.min(fullHeight, LOUPE_MAX_SIDE, Math.max(64, Math.floor(this.el.review.clientHeight - 140)));
    const clamp = (value: number, max: number) => Math.min(max, Math.max(0, Math.round(value)));
    const left = clamp(at.x * fullWidth - width / 2, fullWidth - width);
    const top = clamp(at.y * fullHeight - height / 2, fullHeight - height);
    try {
      const photo = await this.compute({
        ...shot.request,
        view: { longSide: Math.round(pixels.long), crop: { left, top, width, height } },
        replay: shot.photo.replay,
      });
      this.dropLoupe();
      this.loupe = { url: photo.url, left, top, width, height, fullWidth: photo.fullWidth, fullHeight: photo.fullHeight };
      this.setImage(photo.url, photo.width, photo.height);
      this.el.reviewWhole.hidden = false;
      this.el.reviewHint.hidden = false;
      this.lastCaption = () => `${t(this.lang, "loupe")} 100${t(this.lang, "percent")} · ${this.computedText(photo)}`;
      this.showCaption();
    } catch (error) {
      console.error(error);
      this.showError();
    }
  }

  private setImage(url: string, width: number, height: number): void {
    this.el.reviewImage.src = url;
    this.el.reviewImage.width = width;
    this.el.reviewImage.height = height;
  }

  private showCaption(): void {
    this.el.reviewCaption.textContent = this.lastCaption!();
    this.el.reviewImage.alt = this.lastCaption!();
    this.el.review.hidden = false;
  }

  private showError(): void {
    this.lastCaption = () => t(this.lang, "photoError");
    this.el.reviewCaption.textContent = this.lastCaption();
    this.el.review.hidden = false;
  }

  /** « 64 rendus, calculée en 1,2 s » ; « 120/256 » si le calcul a été arrêté par la limite de temps. */
  private computedText(photo: PhotoResult): string {
    const tr = (key: MessageKey) => t(this.lang, key);
    const samples = photo.samples < photo.plannedSamples ? `${photo.samples}/${photo.plannedSamples}` : `${photo.samples}`;
    return `${samples} ${tr("renders")}, ${tr("computedIn")} ${this.decimal(photo.milliseconds / 1000, 1)} s`;
  }

  private decimal(value: number, digits: number): string {
    const text = value.toFixed(digits);
    return this.lang === "fr" ? text.replace(".", ",") : text;
  }

  private dropLoupe(): void {
    if (this.loupe) URL.revokeObjectURL(this.loupe.url);
    this.loupe = null;
  }

  private closeReview(): void {
    this.el.review.hidden = true;
  }
}
