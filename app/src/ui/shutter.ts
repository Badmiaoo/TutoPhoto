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
// Histogrammes et hautes lumières (MES-06, MES-07 ; version 0.3.57) : chaque photo garde ses mesures
// (camera/histogram.ts), la fenêtre de la loupe a les siennes ; ui/reviewInfo.ts les affiche selon le bouton « Infos ».

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Observer } from "@babylonjs/core/Misc/observable";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { SceneNotReadyError, takePhoto, type GroundInfo, type PhotoRequest, type PhotoResult, type SceneTimeControl } from "../camera/photo";
import { sensorPixels } from "../camera/bodies";
import type { CameraPanel, CurrentSettings, ReleaseMode } from "./cameraPanel";
import type { ViewfinderNoise } from "../camera/noise";
import type { ViewfinderDepthOfField } from "../camera/viewfinderDof";
import type { AreaMode, Autofocus, FocusMode } from "../camera/autofocus";
import { t, type MessageKey } from "../texts";
import { judgeChallenge, measureShot, type Bulletin, type ChallengeId, type SceneThing } from "../camera/bulletin";
import type { FaceSubject } from "../camera/faces";
import { LANDMARKS } from "../scene";
import { renderBulletin, type NoiseReading } from "./challenges";
import type { ReviewInfo } from "./reviewInfo";

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
  reviewBulletin: HTMLElement;
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
  /** Bulletin de la vue (camera/bulletin.ts), défi en cours et bruit lu dans le viseur au déclenchement. */
  bulletin: Bulletin;
  challenge: ChallengeId | null;
  noise: NoiseReading | null;
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

/** Photo refusée ou interrompue : la phrase dite avant le détail technique (relecture du Sujet 10, version 0.3.70). */
class PhotoRefused extends Error {
  constructor(
    readonly hint: MessageKey,
    detail: string,
  ) {
    super(detail);
    this.name = "PhotoRefused";
  }
}

/**
 * Loupe arrêtée en cours de calcul parce que sa vue a changé (relecture du Sujet 11, version 0.3.71) : levée par le
 * suivi de la progression, elle interrompt takePhoto, dont le bloc finally rend la scène et libère les textures.
 */
class LoupeDropped extends Error {
  constructor() {
    super("loupe jetée");
    this.name = "LoupeDropped";
  }
}

export class Shutter {
  private busy = false;
  /** Contexte WebGL perdu, et nombre de pertes depuis l'ouverture (relecture du Sujet 10). */
  private contextLost = false;
  private losses = 0;

  /**
   * Contexte perdu : le drapeau, et le contexte lui-même, perdu avant que l'événement de la perte n'arrive.
   */
  private lost(): boolean {
    return this.contextLost || this.engine._gl.isContextLost();
  }
  /** Prise de vue en cours (une vue, une rafale ou un retardateur). */
  private shooting = false;
  private shots: Shot[] = [];
  private shotIndex = 0;
  /** Déclencheur tenu en rafale : début, orientations relevées à chaque image, observateur. */
  /**
   * Déclencheur tenu en rafale : début, intervalle lu à l'appui (gardé pour le relâchement : relevés et vues suivent
   * le même intervalle, relecture du Sujet 11), orientations relevées à chaque image, observateur.
   */
  private press: { start: number; interval: number; samples: Moment[]; observer: Observer<Scene> | null; mode: ReleaseMode } | null = null;
  private countdown: number | null = null;
  private loupe: LoupeView | null = null;
  private lastCaption: (() => string) | null = null;
  /**
   * Numéro de la vue affichée par l'écran de revue (version 0.3.71, constat COD-08 de l'audit) : augmenté par
   * showWhole (donc par showFrame), closeReview et showError. Une loupe dont la vue a changé pendant son calcul est
   * jetée : avant, « Revenir au viseur », « Vue suivante » ou « Photo entière » touchés pendant ce calcul étaient
   * suivis de la fenêtre de la loupe, écran de revue rouvert, sous le compteur d'une autre vue.
   */
  private view = 0;
  /**
   * Rafale tronquée par une vue en échec (version 0.3.71, constat COD-05) : la phrase mise en tête de la légende de
   * chaque vue calculée, sur sa ligne, ou null. Avant, le message d'erreur était aussitôt remplacé par la première vue
   * réussie.
   */
  private truncation: (() => string) | null = null;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: UniversalCamera,
    private readonly time: SceneTimeControl,
    private readonly ground: GroundInfo,
    private readonly panel: CameraPanel,
    private readonly el: ShutterElements,
    private readonly resumeRendering: () => void,
    private readonly noise: ViewfinderNoise,
    private readonly dof: ViewfinderDepthOfField,
    private readonly autofocus: Autofocus,
    private readonly subjects: readonly FaceSubject[],
    private readonly challenge: () => ChallengeId | null,
    private readonly noiseReading: () => NoiseReading | null,
    private readonly info: ReviewInfo,
    /** État du chargement : un fichier en échec (failed), et la scène toujours pas prête après (stuck). */
    private readonly sceneState: () => { failed: boolean; stuck: boolean },
  ) {
    // Perte du contexte WebGL (relecture du Sujet 10, version 0.3.70) : pendant la perte, le rendu donnait une photo
    // toute noire, avec son bulletin ; perdu pendant le calcul, le contexte peut aussi fausser la photo.
    engine.onContextLostObservable.add(() => {
      this.contextLost = true;
      this.losses++;
    });
    engine.onContextRestoredObservable.add(() => (this.contextLost = false));
    // Durée du toucher d'après l'horodatage des événements : une image longue entre l'appui et le relâchement
    // ne transforme pas un toucher en glissé. Un appui fait pendant le calcul d'une photo n'est pas retenu, même
    // relâché après la fin du calcul (version 0.3.63) ; un relâchement pendant le calcul est écarté par choosePoint.
    let down: { x: number; y: number; at: number } | null = null;
    el.canvas.addEventListener("pointerdown", (e) => (down = this.panel.isEnabled() ? { x: e.clientX, y: e.clientY, at: e.timeStamp } : null));
    el.canvas.addEventListener("pointerup", (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < TAP_MAX_MOVE_PX && e.timeStamp - down.at < TAP_MAX_MS) this.choosePoint(e.clientX, e.clientY);
      down = null;
    });
    // Déclencheur : appui et relâchement (rafale) ; au clavier, un clic sans pointeur vaut un appui bref. Le
    // pointeur est capturé à l'appui : le relâchement arrive au bouton même si celui-ci change de taille sous le
    // doigt ou le curseur (son texte affiche le nombre de vues pendant la rafale).
    // Bouton principal seul (version 0.3.71, constat COD-13) : le clic droit et le clic du milieu ne déclenchent pas.
    // Un toucher émulé dans Chromium donne button 0 (essai du 20 novembre 2026) ; non essayé sur un téléphone.
    el.button.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      el.button.setPointerCapture(e.pointerId);
      this.pressStart();
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) el.button.addEventListener(type, () => void this.pressEnd());
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
    this.applyTexts();
    requestAnimationFrame(() => this.placeMarker());
  }

  applyTexts(): void {
    const tr = t;
    this.el.button.textContent = tr("shutterButton");
    this.el.marker.title = tr("focusPoint");
    this.el.progressLabel.textContent = tr("computing");
    this.el.reviewBack.textContent = tr("reviewBack");
    this.el.reviewWhole.textContent = tr("reviewWhole");
    this.el.reviewHint.textContent = tr("reviewHint");
    this.el.reviewSave.textContent = tr("save");
    this.el.reviewPrev.textContent = tr("reviewPrev");
    this.el.reviewNext.textContent = tr("reviewNext");
    if (this.shots.length > 1) this.el.reviewCount.textContent = this.countText();
    if (this.lastCaption) this.el.reviewCaption.textContent = this.lastCaption();
    if (!this.el.reviewBulletin.hidden) this.showBulletin();
    this.info.applyTexts();
  }

  /** Toucher le viseur : avec la loupe, le point touché est ramené au cadre complet. */
  private choosePoint(clientX: number, clientY: number): void {
    const rect = this.el.frame.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    // Pendant le calcul d'une photo, l'autofocus est suspendu : le toucher déplacerait le repère sans faire le point.
    if (!this.panel.isEnabled()) return;
    // Hors de la zone couverte par l'autofocus, le point est ramené au bord de cette zone (cameraPanel.ts).
    this.panel.setFocusPoint(this.panel.displayedToFrame({ x, y }));
  }

  /** Le repère du point suit le cadre (en pourcentage du canevas, comme le cadre) et la loupe. */
  private placeMarker(): void {
    const frame = this.el.frame.style;
    const left = parseFloat(frame.left) || 0;
    const top = parseFloat(frame.top) || 0;
    const width = parseFloat(frame.width) || 100;
    const height = parseFloat(frame.height) || 100;
    const shown = this.panel.frameToDisplayed(this.panel.focusPointInFrame());
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
    // Zone large : le repère montre la zone mesurée, rognée à la zone couverte par l'autofocus ; point sélectif : un carré centré sur le
    // point, à la taille de la feuille de style.
    const zone = area.zone;
    style.left = zone ? `${((zone.left + zone.right) / 2) * 100}%` : `${left + shown.x * width}%`;
    style.top = zone ? `${((zone.top + zone.bottom) / 2) * 100}%` : `${top + shown.y * height}%`;
    style.width = zone ? `${(zone.right - zone.left) * 100}%` : "";
    style.height = zone ? `${(zone.bottom - zone.top) * 100}%` : "";
  }

  /**
   * Calcul sans affichage du viseur : boucle de rendu arrêtée, bruit du viseur retiré, réglages grisés, commandes
   * de la caméra détachées. À la reprise, les commandes sont rattachées et ce que les gestes ont accumulé est
   * effacé : un geste fait pendant le calcul ne tourne pas le viseur ; un doigt resté posé ne le tourne plus tant
   * qu'il n'est pas relevé puis reposé.
   */
  private async compute(request: PhotoRequest, label: string, abandoned: () => boolean = () => false): Promise<PhotoResult> {
    if (this.lost()) throw new PhotoRefused("photoContextLost", "contexte WebGL perdu");
    const losses = this.losses;
    this.busy = true;
    this.panel.setEnabled(false);
    this.el.progressLabel.textContent = label;
    this.el.progress.hidden = false;
    this.el.progressBar.style.width = "0%";
    this.engine.stopRenderLoop();
    this.noise.suspend();
    this.dof.suspend();
    this.autofocus.suspend();
    this.camera.detachControl();
    try {
      let photo: PhotoResult | null = null;
      try {
        // Un calcul abandonné (loupe dont la vue a changé) s'arrête au point de progression suivant.
        photo = await takePhoto(this.engine, this.scene, this.camera, this.time, this.ground, request, (fraction) => {
          if (abandoned()) throw new LoupeDropped();
          this.el.progressBar.style.width = `${Math.round(fraction * 100)}%`;
        });
      } catch (error) {
        if (this.losses === losses && !this.lost()) throw error;
      }
      // Contexte perdu pendant le calcul : la photo, si elle est finie, n'est pas gardée.
      if (photo === null || this.losses !== losses || this.lost()) {
        if (photo) URL.revokeObjectURL(photo.url);
        throw new PhotoRefused("photoContextLost", "contexte WebGL perdu pendant le calcul");
      }
      return photo;
    } finally {
      this.camera.attachControl(this.el.canvas, true);
      this.camera.cameraRotation.set(0, 0);
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
    const interval = mode.kind === "single" ? 0 : this.interval(mode);
    if (mode.kind !== "single") {
      // Instant de la dernière vue possible : au-delà, une orientation relevée ne servirait à aucune vue (pressEnd
      // prend, pour chaque vue, la plus récente relevée avant son instant). Le texte du bouton n'est réécrit que quand
      // le nombre de vues change (version 0.3.71, constat COD-13).
      const last = start + (MAX_BURST - 1) * interval;
      let shown = 0;
      observer = this.scene.onBeforeRenderObservable.add(() => {
        const now = this.time.now();
        if (now <= last + 1e-9) samples.push({ t0: now, rotation: this.camera.rotation.clone() });
        const count = Math.min(MAX_BURST, 1 + Math.floor((now - start) / interval + 1e-9));
        if (count === shown) return;
        shown = count;
        this.el.button.textContent = `${t("burstCount")} ${count} ${t(count === 1 ? "burstFrame" : "burstFrames")}`;
      });
    }
    this.press = { start, interval, samples, observer, mode };
    if (mode.kind === "single") void this.pressEnd();
  }

  /** Relâchement : les instants des vues, puis leur calcul. */
  private async pressEnd(): Promise<void> {
    const press = this.press;
    if (!press) return;
    this.press = null;
    if (press.observer) this.scene.onBeforeRenderObservable.remove(press.observer);
    this.el.button.textContent = t("shutterButton");
    if (press.mode.kind === "single") {
      await this.shootSeries([press.samples[0]], null);
      return;
    }
    const end = this.time.now();
    const interval = press.interval;
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
    const show = () => (this.el.button.textContent = `${t("timerCountdown")} ${left} s`);
    show();
    // Pas de loupe pendant le compte (magnify) : la consigne « Touchez la photo… » est masquée jusqu'à la fin du compte
    // (relecture du Sujet 11, constat B6).
    this.el.reviewHint.hidden = true;
    const tick = () => {
      left--;
      if (left > 0) {
        show();
        this.countdown = window.setTimeout(tick, 1000);
        return;
      }
      this.countdown = null;
      this.el.button.textContent = t("shutterButton");
      this.el.reviewHint.hidden = this.el.reviewImage.hidden;
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
    // Refus immédiat (relecture du Sujet 10) : contexte perdu, ou scène en échec restée pas prête 20 s après l'arrivée
    // ou l'échec du dernier fichier ; la photo aurait été noire, ou aurait attendu 20 s pour échouer.
    const refusal = this.refusal();
    if (refusal) {
      this.showError(refusal);
      return;
    }
    this.shooting = true;
    const settings = this.panel.current();
    const focusMode = this.autofocus.mode();
    const areaMode = this.panel.area();
    const current = this.camera.rotation.clone();
    const challenge = this.challenge();
    const noise = this.noiseReading();
    const shots: Shot[] = [];
    let failure: unknown = null;
    try {
      await this.autofocus.settled();
      for (let i = 0; i < moments.length; i++) {
        const moment = moments[i];
        const focusLocked = this.autofocus.locked();
        let measured = focusLocked;
        // Scène à l'instant de la vue, appareil orienté comme alors : pour la mesure et pour le bulletin.
        this.time.setFrozenTime(moment.t0);
        this.camera.rotation.copyFrom(moment.rotation);
        if (!focusLocked) measured = await this.autofocus.measureNow();
        else this.scene.render();
        const snapshot = this.snapshot();
        const request: PhotoRequest = {
          body: settings.body,
          focalMm: settings.focalMm,
          aperture: settings.aperture,
          shutterSeconds: settings.shutterSeconds,
          iso: settings.iso,
          exposure: settings.exposure,
          focusPoint: this.panel.focusPointInFrame(),
          focusDistance: measured ? this.autofocus.distance() : undefined,
          portrait: settings.frame.portrait,
          moment,
        };
        const series = moments.length > 1 ? { index: i, count: moments.length } : null;
        const photo = await this.compute(request, series ? `${t("computingFrame")} ${i + 1}/${moments.length}…` : t("computing"));
        if (focusMode === "single" && !focusLocked) this.autofocus.lockAt(photo.focusDistance);
        const target = areaMode === "auto" ? (this.autofocus.target()?.kind ?? null) : null;
        const frame = series ? { ...series, offset: moment.t0 - moments[0].t0 } : null;
        const bulletin = measureShot({
          ...snapshot,
          focalMm: settings.focalMm,
          aperture: settings.aperture,
          shutterSeconds: settings.shutterSeconds,
          focusDistance: photo.focusDistance,
          sensorWidthMm: settings.body.sensorWidthMm,
          sensorHeightMm: settings.body.sensorHeightMm,
          portrait: settings.frame.portrait,
        });
        if (challenge) bulletin.criteria = judgeChallenge(challenge, bulletin);
        shots.push({ settings, request, photo, focusMode, areaMode, focusLocked, target, frame, bulletin, challenge, noise });
      }
    } catch (error) {
      this.report(error);
      failure = error;
    } finally {
      this.camera.rotation.copyFrom(current);
      if (resumeAt !== null) this.time.release(resumeAt);
      this.shooting = false;
    }
    // Rafale tronquée (version 0.3.71, constat COD-05) : la vue en échec est la première non calculée ; la phrase dit
    // laquelle, et combien de vues sont montrées (relecture du Sujet 11, constats B3 et A4).
    const done = shots.length;
    const requested = moments.length;
    const truncated = () => {
      const shown = done === 0 ? t("burstShownNone") : (done === 1 ? t("burstShownOne") : t("burstShown")).replace("{done}", String(done));
      return `${t("burstTruncated").replace("{failed}", String(done + 1))} ; ${shown.replace("{count}", String(requested))}`;
    };
    if (shots.length === 0) {
      if (failure !== null) this.showError(failure, requested > 1 ? truncated : undefined);
      return;
    }
    for (const old of this.shots) URL.revokeObjectURL(old.photo.url);
    this.shots = shots;
    this.truncation = failure === null ? null : () => this.errorText(failure, truncated());
    this.showFrame(0);
  }

  /**
   * Erreur du calcul dans la console, sauf un refus, une scène pas prête après la borne de 20 s ou une loupe jetée : ce
   * ne sont pas des fautes du programme ; l'écran de revue dit les deux premiers en clair (version 0.3.71 pour la scène
   * pas prête et la loupe jetée).
   */
  private report(error: unknown): void {
    if (!(error instanceof PhotoRefused) && !(error instanceof SceneNotReadyError) && !(error instanceof LoupeDropped)) console.error(error);
  }

  /**
   * Relevé de la scène à l'instant présent (horloge figée) : matrice de vue de l'appareil, yeux des personnages et
   * du chien, banc et poubelle ; vitesses du promeneur et du chien.
   */
  private snapshot(): { view: ReturnType<UniversalCamera["getViewMatrix"]>; things: SceneThing[] } {
    const view = this.camera.getViewMatrix(true).clone();
    const movers = this.time.movers();
    const velocityOf = (id: string) => movers.find((m) => m.id === id)?.velocity.clone() ?? Vector3.Zero();
    const things: SceneThing[] = this.subjects.map((s) => ({ id: s.id, points: s.eyes().map((e) => e.clone()), velocity: velocityOf(s.id) }));
    for (const l of LANDMARKS) {
      if (l.kind === "object") things.push({ id: l.id, points: [new Vector3(l.x, 0.5, l.z)], velocity: Vector3.Zero() });
    }
    return { view, things };
  }

  /** Bulletin de la vue affichée, sous la légende. */
  private showBulletin(): void {
    const shot = this.shots[this.shotIndex];
    if (!shot) return;
    renderBulletin(this.el.reviewBulletin, shot.bulletin, {
      exposureOffset: Math.log2(shot.settings.exposure),
      focusDistance: shot.photo.focusDistance,
      challenge: shot.challenge,
      noise: shot.noise,
      longSideMm: Math.max(shot.settings.body.sensorWidthMm, shot.settings.body.sensorHeightMm),
    });
  }

  /**
   * Compteur de la série : rang parmi les vues demandées, comme la légende (relecture du Sujet 11, constat B3) ; avant,
   * une rafale tronquée disait « Vue 1/2 » au compteur et « Vue 1/5 » dans la légende.
   */
  private countText(): string {
    const frame = this.shots[this.shotIndex]?.frame;
    return frame ? `${t("reviewFrame")} ${frame.index + 1}/${frame.count}` : `${t("reviewFrame")} ${this.shotIndex + 1}/${this.shots.length}`;
  }

  /** Vue de la série à afficher, avec les boutons de la série. */
  private showFrame(index: number): void {
    if (index < 0 || index >= this.shots.length) return;
    this.shotIndex = index;
    const shot = this.shots[index];
    this.el.reviewSave.href = shot.photo.url;
    const many = this.shots.length > 1;
    this.el.reviewSeries.hidden = !many;
    this.el.reviewCount.textContent = many ? this.countText() : "";
    this.el.reviewPrev.disabled = index === 0;
    this.el.reviewNext.disabled = index === this.shots.length - 1;
    this.showWhole();
  }

  /** Photo entière : réglages, mode et distance de mise au point, rendus et durée du calcul. */
  private showWhole(): void {
    const shot = this.shots[this.shotIndex];
    if (!shot) return;
    const focused = document.activeElement;
    // La fenêtre de la loupe est oubliée : le toucher suivant porte sur la photo entière, pas sur l'ancienne fenêtre.
    this.dropLoupe();
    this.view++;
    const { photo, settings, focusMode, areaMode, focusLocked, target, frame } = shot;
    this.setImage(photo.url, photo.width, photo.height);
    // Ce que showError a masqué revient avec la photo.
    this.showPhotoParts(true);
    this.el.reviewWhole.hidden = true;
    const truncation = this.truncation;
    this.lastCaption = () => {
      const tr = t;
      const areaKeys: Record<AreaMode, MessageKey> = { point: "areaPointShort", wideS: "areaWideSShort", wideL: "areaWideLShort", auto: "areaAutoShort" };
      const targetKeys: Record<NonNullable<Shot["target"]>, MessageKey> = { eye: "targetEye", face: "targetFace", nearest: "targetNearest", point: "targetPoint" };
      const what = target ? ` · ${tr(targetKeys[target])}` : "";
      const mode = `${focusMode === "single" ? "AF-S" : "AF-C"} · ${tr(areaKeys[areaMode])}${what}`;
      const focus = `${tr(focusLocked ? "focusLockedAt" : "focusedAt")} ${this.decimal(photo.focusDistance, 1)} m`;
      const series = frame ? `${tr("reviewFrame")} ${frame.index + 1}/${frame.count} · +${this.decimal(frame.offset, 2)} s · ` : "";
      const caption = `${series}${settings.summary} · ${settings.body.model} · ${mode} · ${focus} · ${this.computedText(photo)}`;
      return truncation ? `${truncation()}\n${caption}` : caption;
    };
    this.showCaption();
    this.showBulletin();
    this.info.show(photo.tones);
    this.keepFocus(focused);
  }

  /** Toucher la photo, ou la fenêtre de la loupe : fenêtre à 100 % centrée sur le point touché. */
  private async magnify(event: MouseEvent): Promise<void> {
    const shot = this.shots[this.shotIndex];
    // Pas de loupe pendant un compte à rebours du retardateur (version 0.3.71, constat COD-02) : si le compte finissait
    // pendant le calcul de la loupe, la vue n'était pas prise, sans message.
    if (!shot || this.busy || this.shooting || this.countdown !== null) return;
    const view = this.view;
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
      // Loupe dont la vue a changé : son calcul s'arrête au point de progression suivant, et le viseur revient
      // (relecture du Sujet 11, constat B2 ; avant, il restait sous la bande de calcul jusqu'à la fin de la loupe).
      const photo = await this.compute(
        { ...shot.request, view: { longSide: Math.round(pixels.long), crop: { left, top, width, height } }, replay: shot.photo.replay },
        t("computingLoupe"),
        () => this.view !== view,
      );
      // La vue a changé pendant le calcul (écran de revue fermé, autre vue, photo entière) : la loupe est jetée.
      if (this.view !== view) {
        URL.revokeObjectURL(photo.url);
        return;
      }
      this.dropLoupe();
      this.loupe = { url: photo.url, left, top, width, height, fullWidth: photo.fullWidth, fullHeight: photo.fullHeight };
      this.setImage(photo.url, photo.width, photo.height);
      this.el.reviewWhole.hidden = false;
      this.el.reviewHint.hidden = false;
      this.lastCaption = () => `${t("loupe")} 100${t("percent")} · ${this.computedText(photo)}`;
      this.el.reviewBulletin.hidden = true;
      this.showCaption();
      // Avec la loupe, histogrammes et zones écrêtées portent sur la partie affichée, comme sur le Z 6.
      this.info.show(photo.tones, true);
    } catch (error) {
      this.report(error);
      // Vue changée pendant le calcul : l'erreur ne rouvre pas l'écran de revue. Sinon, la photo est masquée comme
      // pour toute erreur, et « Photo entière » la remontre.
      if (this.view !== view) return;
      // Loupe en échec : la photo, gardée, n'est pas perdue ; le message le dit (relecture du Sujet 11, constat B4).
      this.showError(error, () => t("loupeError"));
      this.el.reviewWhole.hidden = false;
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
    this.openReview();
  }

  /**
   * Affiche l'écran de revue, défilement remis à zéro : chaque vue s'ouvre en haut, la photo visible (constat
   * INT-17 de l'audit, version 0.3.59). Masqué entre deux photos, l'écran de revue gardait le défilement de la vue
   * d'avant. Et la photo n'avait aucune hauteur tant qu'elle n'était pas chargée : dans Chromium, quand une image
   * était rendue avant ce chargement, l'ancrage du défilement ajoutait la hauteur de la photo au défilement gardé,
   * et la photo sortait de l'écran. La remise à zéro vient après l'affichage : sur un élément masqué, elle n'a pas
   * d'effet.
   */
  private openReview(): void {
    this.el.review.hidden = false;
    this.el.review.scrollTop = 0;
  }

  /** Raison de refuser une photo avant tout calcul, ou null. */
  private refusal(): PhotoRefused | null {
    if (this.lost()) return new PhotoRefused("photoContextLost", "contexte WebGL perdu");
    if (this.sceneState().stuck && !this.scene.isReady()) return new PhotoRefused("photoNotReadyFile", "fichier non reçu, scène pas prête");
    return null;
  }

  /**
   * Message d'erreur à la place de la photo (errorText), après la phrase lead si elle est donnée. La vue affichée
   * change : une loupe en calcul sera jetée.
   */
  private showError(error: unknown, lead?: () => string): void {
    const focused = document.activeElement;
    this.view++;
    this.dropLoupe();
    this.el.reviewBulletin.hidden = true;
    this.info.show(null);
    // Rien de la photo d'avant ne reste sous le message (version 0.3.71, constat B10 de la relecture de la version
    // 0.3.70) : ni l'image, ni la série, ni « Touchez la photo… », ni « Enregistrer la photo », qui l'aurait sauvée.
    this.showPhotoParts(false);
    this.el.reviewWhole.hidden = true;
    this.lastCaption = () => this.errorText(error, lead?.());
    this.el.reviewCaption.textContent = this.lastCaption();
    this.el.reviewImage.alt = "";
    this.openReview();
    this.keepFocus(focused);
  }

  /**
   * Focus clavier gardé dans l'écran de revue (relecture du Sujet 11, constat B8) : quand l'élément qui l'avait vient
   * d'être masqué (« Enregistrer la photo » sous un message d'erreur, « Photo entière » après son appui), il passe à
   * « Revenir au viseur », sans faire défiler l'écran de revue. Avant, il tombait sur la page.
   */
  private keepFocus(focused: Element | null): void {
    if (!(focused instanceof HTMLElement) || !this.el.review.contains(focused) || this.el.review.hidden) return;
    if (focused.getClientRects().length > 0) return;
    this.el.reviewBack.focus({ preventScroll: true });
  }

  /** Image, lien « Enregistrer la photo », phrase de la loupe et boutons de la série : affichés ou masqués. */
  private showPhotoParts(shown: boolean): void {
    this.el.reviewImage.hidden = !shown;
    this.el.reviewSave.hidden = !shown;
    this.el.reviewHint.hidden = !shown;
    this.el.reviewSeries.hidden = !shown || this.shots.length <= 1;
  }

  /**
   * Texte d'une erreur : la phrase de tête (« La photo n'a pas pu être calculée. » par défaut), une phrase en clair
   * quand la cause est connue (relecture du Sujet 10), puis le détail technique pour le diagnostic sur téléphone.
   */
  private errorText(error: unknown, lead: string = t("photoError")): string {
    const detail = error instanceof Error ? error.message : String(error);
    const hint: MessageKey | null =
      error instanceof PhotoRefused
        ? error.hint
        : error instanceof SceneNotReadyError
          ? this.sceneState().failed
            ? "photoNotReadyFile"
            : "photoNotReady"
          : null;
    return hint ? `${lead} ${t(hint)} (${detail})` : `${lead} (${detail})`;
  }

  /** « 64 rendus, calculée en 1,2 s » ; « 120/256 » si le calcul a été arrêté par la limite de temps. */
  private computedText(photo: PhotoResult): string {
    const tr = t;
    const samples = photo.samples < photo.plannedSamples ? `${photo.samples}/${photo.plannedSamples}` : `${photo.samples}`;
    return `${samples} ${tr("renders")}, ${tr("computedIn")} ${this.decimal(photo.milliseconds / 1000, 1)} s`;
  }

  private decimal(value: number, digits: number): string {
    const text = value.toFixed(digits);
    return text.replace(".", ",");
  }

  private dropLoupe(): void {
    if (this.loupe) URL.revokeObjectURL(this.loupe.url);
    this.loupe = null;
  }

  private closeReview(): void {
    this.view++;
    this.el.review.hidden = true;
  }
}
