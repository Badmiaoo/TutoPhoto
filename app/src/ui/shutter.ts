// Déclencheur : choix du point de mise au point en touchant le viseur, calcul de la photo, écran de revue.
// Loupe de l'écran de revue (décision du 9 novembre 2026) : toucher la photo recalcule, autour du point
// touché, une fenêtre à 100 % (un pixel de l'image pour un photosite, affiché sur un pixel CSS).
// Mise au point (camera/autofocus.ts) : en AF-S, la photo prend la distance verrouillée ; sans verrou,
// l'autofocus fait le point au déclenchement, avec le mode de zone choisi, et cette distance est verrouillée.
// En AF-C, il fait le point au déclenchement.
// Mode de déclenchement (BOI-12, ui/cameraPanel.ts) : vue par vue au toucher ; en rafale, des vues tant que le
// déclencheur reste appuyé, une par intervalle (1 / cadence, jamais moins que la durée de pose), chacune
// calculée à son instant et avec l'orientation de l'appareil à cet instant (on peut suivre le sujet). En AF-C,
// la mise au point est refaite à chaque vue ; en AF-S, elle reste celle de la première (verrouillée à
// mi-course, manuel du Z 6). Au plus MAX_BURST vues, pour le temps de calcul. Retardateur : une vue après le
// délai. L'écran de revue fait défiler la série, pour la trier.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Observer } from "@babylonjs/core/Misc/observable";
import type { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { takePhoto, type GroundInfo, type PhotoRequest, type PhotoResult, type SceneTimeControl } from "../camera/photo";
import { sensorPixels } from "../camera/bodies";
import type { CameraPanel, CurrentSettings, ReleaseMode } from "./cameraPanel";
import type { ViewfinderNoise } from "../camera/noise";
import type { ViewfinderDepthOfField } from "../camera/viewfinderDof";
import type { AreaMode, Autofocus, FocusMode } from "../camera/autofocus";
import { t, type Lang, type MessageKey } from "../i18n";

/** Un toucher qui bouge de moins de 6 px et dure moins de 0,4 s choisit le point ; au-delà, on tourne. */
const TAP_MAX_MOVE_PX = 6;
const TAP_MAX_MS = 400;
/** Plus grand côté de la fenêtre de la loupe, en pixels. */
const LOUPE_MAX_SIDE = 1500;
/** Vues calculées au plus par rafale (limite de TutoPhoto, pour le temps de calcul ; le Z 6 va jusqu'à 200). */
const MAX_BURST = 20;

interface ShutterElements {
  canvas: HTMLCanvasElement;
  frame: HTMLElement;
  marker: HTMLElement;
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
  reviewSeries: HTMLElement;
  reviewPrev: HTMLButtonElement;
  reviewNext: HTMLButtonElement;
  reviewCount: HTMLElement;
}

/** Instant d'une vue : début de la pose sur l'horloge de la scène, et orientation de l'appareil alors. */
interface Moment {
  t0: number;
  rotation: Vector3;
}

/** Dernière photo : réglages, demande et résultat, pour la loupe ; mode de mise au point et verrou. */
interface Shot {
  settings: CurrentSettings;
  request: PhotoRequest;
  photo: PhotoResult;
  focusMode: FocusMode;
  areaMode: AreaMode;
  focusLocked: boolean;
  /** Zone automatique : œil, visage, sujet le plus proche ou point touché. */
  target: "eye" | "face" | "nearest" | "point" | null;
  /** Vue d'une rafale : rang, nombre de vues, écart au début de la rafale en secondes. */
  frame: { index: number; count: number; offset: number } | null;
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
  /** Prise de vue en cours (une vue, une rafale ou un retardateur). */
  private shooting = false;
  private shots: Shot[] = [];
  private shotIndex = 0;
  /** Déclencheur tenu en rafale : début, orientations relevées à chaque image, observateur. */
  private press: { start: number; samples: Moment[]; observer: Observer<Scene> | null; mode: ReleaseMode } | null = null;
  private countdown: number | null = null;
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
    private readonly dof: ViewfinderDepthOfField,
    private readonly autofocus: Autofocus,
  ) {
    let down: { x: number; y: number; at: number } | null = null;
    el.canvas.addEventListener("pointerdown", (e) => (down = { x: e.clientX, y: e.clientY, at: performance.now() }));
    el.canvas.addEventListener("pointerup", (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < TAP_MAX_MOVE_PX && performance.now() - down.at < TAP_MAX_MS) this.choosePoint(e.clientX, e.clientY);
      down = null;
    });
    // Déclencheur : appui et relâchement (rafale) ; au clavier, un clic sans pointeur vaut un appui bref.
    el.button.addEventListener("pointerdown", () => this.pressStart());
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) el.button.addEventListener(type, () => void this.pressEnd());
    el.button.addEventListener("click", (e) => {
      if (e.detail !== 0) return;
      this.pressStart();
      void this.pressEnd();
    });
    el.reviewPrev.addEventListener("click", () => this.showFrame(this.shotIndex - 1));
    el.reviewNext.addEventListener("click", () => this.showFrame(this.shotIndex + 1));
    el.reviewBack.addEventListener("click", () => this.closeReview());
    el.reviewWhole.addEventListener("click", () => this.showWhole());
    el.reviewImage.addEventListener("click", (e) => void this.magnify(e));
    panel.onViewChange(() => this.placeMarker());
    autofocus.onChange(() => this.placeMarker());
    this.setLang(lang);
    requestAnimationFrame(() => this.placeMarker());
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    const tr = (key: MessageKey) => t(lang, key);
    this.el.button.textContent = tr("shutterButton");
    this.el.marker.title = tr("focusPoint");
    this.el.progressLabel.textContent = tr("computing");
    this.el.reviewBack.textContent = tr("reviewBack");
    this.el.reviewWhole.textContent = tr("reviewWhole");
    this.el.reviewHint.textContent = tr("reviewHint");
    this.el.reviewSave.textContent = tr("save");
    this.el.reviewPrev.textContent = tr("reviewPrev");
    this.el.reviewNext.textContent = tr("reviewNext");
    if (this.shots.length > 1) this.el.reviewCount.textContent = `${tr("reviewFrame")} ${this.shotIndex + 1}/${this.shots.length}`;
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
    const style = this.el.marker.style;
    // Zone automatique : le repère entoure ce sur quoi l'appareil a fait le point (œil, visage, sujet).
    const area = this.panel.focusArea();
    const target = area.auto ? this.autofocus.target() : null;
    if (area.auto) {
      const point = target?.point ?? area.point;
      this.el.marker.hidden = false;
      style.left = `${point.x * 100}%`;
      style.top = `${point.y * 100}%`;
      const side = target && target.size > 0 ? target.size : 0;
      style.width = side ? `${side * 100}%` : "";
      style.height = side ? `${side * area.auto.canvasWidth * (100 / area.auto.canvasHeight)}%` : "";
      return;
    }
    // Zone large : le repère montre la zone mesurée, rognée au cadre ; point sélectif : un carré centré sur le
    // point, à la taille de la feuille de style.
    const zone = area.zone;
    style.left = zone ? `${((zone.left + zone.right) / 2) * 100}%` : `${left + shown.x * width}%`;
    style.top = zone ? `${((zone.top + zone.bottom) / 2) * 100}%` : `${top + shown.y * height}%`;
    style.width = zone ? `${(zone.right - zone.left) * 100}%` : "";
    style.height = zone ? `${(zone.bottom - zone.top) * 100}%` : "";
  }

  /** Calcul sans affichage du viseur : boucle de rendu arrêtée, bruit du viseur retiré, réglages grisés. */
  private async compute(request: PhotoRequest, frame: { index: number; count: number } | null = null): Promise<PhotoResult> {
    this.busy = true;
    this.panel.setEnabled(false);
    this.el.progressLabel.textContent = frame
      ? `${t(this.lang, "computingFrame")} ${frame.index + 1}/${frame.count}…`
      : t(this.lang, "computing");
    this.el.progress.hidden = false;
    this.el.progressBar.style.width = "0%";
    this.engine.stopRenderLoop();
    this.noise.suspend();
    this.dof.suspend();
    this.autofocus.suspend();
    try {
      return await takePhoto(this.engine, this.scene, this.camera, this.time, this.ground, request, (fraction) => {
        this.el.progressBar.style.width = `${Math.round(fraction * 100)}%`;
      });
    } finally {
      this.el.progress.hidden = true;
      this.autofocus.resume();
      this.dof.resume();
      this.noise.resume();
      this.noise.moveToEnd();
      this.panel.setEnabled(true);
      this.panel.restoreView();
      this.resumeRendering();
      this.busy = false;
    }
  }

  /** Appui sur le déclencheur : vue par vue tout de suite, rafale jusqu'au relâchement, ou retardateur. */
  private pressStart(): void {
    if (this.busy || this.shooting || this.press || this.countdown !== null) return;
    const mode = this.panel.releaseMode();
    if (mode.kind === "timer") {
      this.startCountdown(mode.delay);
      return;
    }
    const start = this.time.now();
    const samples: Moment[] = [{ t0: start, rotation: this.camera.rotation.clone() }];
    let observer: Observer<Scene> | null = null;
    if (mode.kind !== "single") {
      const interval = this.interval(mode);
      observer = this.scene.onBeforeRenderObservable.add(() => {
        const now = this.time.now();
        samples.push({ t0: now, rotation: this.camera.rotation.clone() });
        const count = Math.min(MAX_BURST, 1 + Math.floor((now - start) / interval + 1e-9));
        this.el.button.textContent = `${t(this.lang, "burstCount")} ${count} ${t(this.lang, count === 1 ? "burstFrame" : "burstFrames")}`;
      });
    }
    this.press = { start, samples, observer, mode };
    if (mode.kind === "single") void this.pressEnd();
  }

  /** Relâchement : les instants des vues, puis leur calcul. */
  private async pressEnd(): Promise<void> {
    const press = this.press;
    if (!press) return;
    this.press = null;
    if (press.observer) this.scene.onBeforeRenderObservable.remove(press.observer);
    this.el.button.textContent = t(this.lang, "shutterButton");
    if (press.mode.kind === "single") {
      await this.shootSeries([press.samples[0]], null);
      return;
    }
    const end = this.time.now();
    const interval = this.interval(press.mode);
    const count = Math.min(MAX_BURST, 1 + Math.floor((end - press.start) / interval + 1e-9));
    const moments: Moment[] = [];
    for (let i = 0; i < count; i++) {
      const t0 = press.start + i * interval;
      // Orientation relevée la plus récente à cet instant.
      let rotation = press.samples[0].rotation;
      for (const sample of press.samples) if (sample.t0 <= t0 + 1e-9) rotation = sample.rotation;
      moments.push({ t0, rotation: rotation.clone() });
    }
    await this.shootSeries(moments, Math.max(end, press.start + (count - 1) * interval));
  }

  /** Intervalle entre deux vues d'une rafale : 1 / cadence, et jamais moins que la durée de pose. */
  private interval(mode: ReleaseMode): number {
    return Math.max(1 / mode.fps, this.panel.current().shutterSeconds);
  }

  /** Retardateur : compte à rebours en secondes, puis une vue. */
  private startCountdown(delay: number): void {
    let left = delay;
    const show = () => (this.el.button.textContent = `${t(this.lang, "timerCountdown")} ${left} s`);
    show();
    const tick = () => {
      left--;
      if (left > 0) {
        show();
        this.countdown = window.setTimeout(tick, 1000);
        return;
      }
      this.countdown = null;
      this.el.button.textContent = t(this.lang, "shutterButton");
      void this.shootSeries([{ t0: this.time.now(), rotation: this.camera.rotation.clone() }], null);
    };
    this.countdown = window.setTimeout(tick, 1000);
  }

  /**
   * Calcule les vues aux instants donnés. Mise au point : verrou AF-S tel quel ; sinon mesure à l'instant de
   * la vue (horloge figée, appareil orienté comme alors), avec le mode de zone, puis verrou en AF-S. Si la
   * mesure échoue, la photo mesure elle-même la distance au point. resumeAt : instant où l'horloge repart.
   */
  private async shootSeries(moments: Moment[], resumeAt: number | null): Promise<void> {
    if (this.busy || this.shooting) return;
    this.shooting = true;
    const settings = this.panel.current();
    const focusMode = this.autofocus.mode();
    const areaMode = this.panel.area();
    const current = this.camera.rotation.clone();
    const shots: Shot[] = [];
    try {
      await this.autofocus.settled();
      for (let i = 0; i < moments.length; i++) {
        const moment = moments[i];
        const focusLocked = this.autofocus.locked();
        let measured = focusLocked;
        if (!focusLocked) {
          this.time.setFrozenTime(moment.t0);
          this.camera.rotation.copyFrom(moment.rotation);
          measured = await this.autofocus.measureNow();
        }
        const request: PhotoRequest = {
          body: settings.body,
          focalMm: settings.focalMm,
          aperture: settings.aperture,
          shutterSeconds: settings.shutterSeconds,
          iso: settings.iso,
          exposure: settings.exposure,
          focusPoint: { ...this.focusPoint },
          focusDistance: measured ? this.autofocus.distance() : undefined,
          portrait: settings.frame.portrait,
          moment,
        };
        const series = moments.length > 1 ? { index: i, count: moments.length } : null;
        const photo = await this.compute(request, series);
        if (focusMode === "single" && !focusLocked) this.autofocus.lockAt(photo.focusDistance);
        const target = areaMode === "auto" ? (this.autofocus.target()?.kind ?? null) : null;
        const frame = series ? { ...series, offset: moment.t0 - moments[0].t0 } : null;
        shots.push({ settings, request, photo, focusMode, areaMode, focusLocked, target, frame });
      }
    } catch (error) {
      console.error(error);
      this.showError(error);
    } finally {
      this.camera.rotation.copyFrom(current);
      if (resumeAt !== null) this.time.release(resumeAt);
      this.shooting = false;
    }
    if (shots.length === 0) return;
    for (const old of this.shots) URL.revokeObjectURL(old.photo.url);
    this.shots = shots;
    this.showFrame(0);
  }

  /** Vue de la série à afficher, avec les boutons de la série. */
  private showFrame(index: number): void {
    if (index < 0 || index >= this.shots.length) return;
    this.shotIndex = index;
    this.dropLoupe();
    const shot = this.shots[index];
    this.el.reviewSave.href = shot.photo.url;
    const many = this.shots.length > 1;
    this.el.reviewSeries.hidden = !many;
    this.el.reviewCount.textContent = many ? `${t(this.lang, "reviewFrame")} ${index + 1}/${this.shots.length}` : "";
    this.el.reviewPrev.disabled = index === 0;
    this.el.reviewNext.disabled = index === this.shots.length - 1;
    this.showWhole();
  }

  /** Photo entière : réglages, mode et distance de mise au point, rendus et durée du calcul. */
  private showWhole(): void {
    const shot = this.shots[this.shotIndex];
    if (!shot) return;
    const { photo, settings, focusMode, areaMode, focusLocked, target, frame } = shot;
    this.setImage(photo.url, photo.width, photo.height);
    this.el.reviewWhole.hidden = true;
    this.el.reviewHint.hidden = false;
    this.lastCaption = () => {
      const tr = (key: MessageKey) => t(this.lang, key);
      const areaKeys: Record<AreaMode, MessageKey> = { point: "areaPointShort", wideS: "areaWideSShort", wideL: "areaWideLShort", auto: "areaAutoShort" };
      const targetKeys: Record<NonNullable<Shot["target"]>, MessageKey> = { eye: "targetEye", face: "targetFace", nearest: "targetNearest", point: "targetPoint" };
      const what = target ? ` · ${tr(targetKeys[target])}` : "";
      const mode = `${focusMode === "single" ? "AF-S" : "AF-C"} · ${tr(areaKeys[areaMode])}${what}`;
      const focus = `${tr(focusLocked ? "focusLockedAt" : "focusedAt")} ${this.decimal(photo.focusDistance, 1)} m`;
      const series = frame ? `${tr("reviewFrame")} ${frame.index + 1}/${frame.count} · +${this.decimal(frame.offset, 2)} s · ` : "";
      return `${series}${settings.summary} · ${settings.body.model} · ${mode} · ${focus} · ${this.computedText(photo)}`;
    };
    this.showCaption();
  }

  /** Toucher la photo, ou la fenêtre de la loupe : fenêtre à 100 % centrée sur le point touché. */
  private async magnify(event: MouseEvent): Promise<void> {
    const shot = this.shots[this.shotIndex];
    if (!shot || this.busy || this.shooting) return;
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
      this.showError(error);
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

  /** Message d'erreur, avec le détail technique pour le diagnostic sur téléphone. */
  private showError(error: unknown): void {
    const detail = error instanceof Error ? error.message : String(error);
    this.lastCaption = () => `${t(this.lang, "photoError")} (${detail})`;
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
