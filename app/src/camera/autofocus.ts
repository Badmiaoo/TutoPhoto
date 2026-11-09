// Autofocus du viseur : mesure de la distance au point de mise au point, en AF ponctuel ou continu (MAP-04,
// décision de Julien du 9 novembre 2026). Comportement des boîtiers, d'après les manuels de Nikon (Z 7 et
// Z 6, « Focus ») et de Sony (α9, « Focus Mode ») [nikon-z6-focus, sony-a9-focus-mode], lus le 9 novembre :
//   https://onlinemanual.nikonimglib.com/z7_z6/en/05_basic_settings_01.html
//   https://helpguide.sony.net/ilc/1650/v1/en/contents/TP0001486782.html
// - AF-S (ponctuel) : la mise au point se fait à mi-course du déclencheur, puis reste verrouillée tant que
//   le déclencheur est tenu à mi-course. Ici, toucher le viseur joue le rôle de la mi-course : la distance
//   est mesurée au point touché, puis verrouillée jusqu'au toucher suivant, comme si le déclencheur restait
//   à mi-course entre les photos. Sans toucher depuis le passage en AF-S, la photo fait le point au
//   déclenchement, et cette distance reste verrouillée.
// - AF-C (continu) : la mise au point suit le sujet tant que le déclencheur est à mi-course. Ici, la
//   distance est relue au point choisi toutes les 200 ms, comme si le déclencheur était tenu à mi-course en
//   permanence ; la photo mesure la distance au déclenchement.
// Non simulé : les échecs et les hésitations de l'autofocus (sujet peu contrasté, faible lumière), la
// priorité au déclenchement ou à la mise au point, la prédiction du mouvement (la distance mesurée au
// déclenchement est exacte).
//
// Carte de profondeur propre au viseur (z dans le repère de la caméra, en mètres), sol invisible compris.
// Rendue à chaque image quand la profondeur de champ du viseur s'en sert, sinon seulement avant chaque
// mesure. Sur le fond à 360°, la distance est celle du plan du sol le long du rayon, comme pour la photo.

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DepthRenderer } from "@babylonjs/core/Rendering/depthRenderer";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { groundDepth, type GroundInfo } from "./photo";

export type FocusMode = "single" | "continuous";

const FOCUS_REFRESH_MS = 200;
/**
 * Attente maximale d'une image de la carte de profondeur avant la lecture : une garde si le rendu s'arrête,
 * large parce qu'une image peut prendre plus d'une seconde en rendu logiciel.
 */
const RENDER_WAIT_MS = 5000;

export class Autofocus {
  private readonly depth: DepthRenderer;
  private focusMode: FocusMode = "continuous";
  /** Distance de mise au point en mètres. */
  private focusDistance = 5;
  /** AF-S : distance verrouillée par un toucher ou par une photo. */
  private isLocked = false;
  private suspended = false;
  private everyFrame = false;
  private readonly pixel = new Float32Array(4);
  /** Mesures en cours, l'une après l'autre. */
  private queue: Promise<void> = Promise.resolve();
  private measuring = false;
  /** Faux tant qu'aucune mesure n'a abouti : la première se fait aussi en AF-S, pour placer l'objectif. */
  private measuredOnce = false;
  private readonly listeners: (() => void)[] = [];

  /** focusOnCanvas : point de mise au point dans le canevas (de 0 à 1, origine en haut à gauche). */
  constructor(
    private readonly scene: Scene,
    private readonly camera: Camera,
    private readonly ground: GroundInfo,
    private readonly focusOnCanvas: () => { x: number; y: number },
  ) {
    this.depth = new DepthRenderer(scene, Constants.TEXTURETYPE_FLOAT, camera, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE, true, "viseur-profondeur");
    this.depth.forceDepthWriteTransparentMeshes = true;
    const map = this.depth.getDepthMap();
    map.wrapU = Constants.TEXTURE_CLAMP_ADDRESSMODE;
    map.wrapV = Constants.TEXTURE_CLAMP_ADDRESSMODE;
    this.applyRefreshRate();
    scene.customRenderTargets.push(map);
    setInterval(() => {
      if ((this.focusMode === "continuous" || !this.measuredOnce) && !this.measuring && !this.suspended) void this.measure();
    }, FOCUS_REFRESH_MS);
  }

  /** Carte de profondeur du viseur, pour la profondeur de champ. */
  depthMap(): RenderTargetTexture {
    return this.depth.getDepthMap();
  }

  /** La profondeur de champ du viseur lit la carte à chaque image. */
  setDepthEveryFrame(everyFrame: boolean): void {
    if (everyFrame === this.everyFrame) return;
    this.everyFrame = everyFrame;
    this.applyRefreshRate();
  }

  mode(): FocusMode {
    return this.focusMode;
  }

  /** Passage en AF-S : l'objectif reste à la distance courante, sans verrou. Passage en AF-C : plus de verrou. */
  setMode(mode: FocusMode): void {
    if (mode === this.focusMode) return;
    this.focusMode = mode;
    this.isLocked = false;
    this.notify();
  }

  /** Distance de mise au point courante, en mètres. */
  distance(): number {
    return this.focusDistance;
  }

  /** AF-S : distance verrouillée. */
  locked(): boolean {
    return this.focusMode === "single" && this.isLocked;
  }

  /** Toucher le viseur en AF-S, l'équivalent de la mi-course : mesure au point choisi, puis verrou. */
  focusNow(): Promise<void> {
    if (this.focusMode !== "single") return this.queue;
    return this.measure(() => {
      if (this.focusMode === "single") this.isLocked = true;
    });
  }

  /** Photo prise en AF-S sans verrou : l'objectif a fait le point au déclenchement, la distance est verrouillée. */
  lockAt(distance: number): void {
    if (this.focusMode !== "single") return;
    this.focusDistance = distance;
    this.measuredOnce = true;
    this.isLocked = true;
    this.notify();
  }

  /** Fin des mesures en cours (avant le déclenchement). */
  settled(): Promise<void> {
    return this.queue;
  }

  /** Appelé quand la distance, le mode ou le verrou changent. */
  onChange(listener: () => void): void {
    this.listeners.push(listener);
  }

  /** Pendant le calcul d'une photo, qui a sa propre carte de profondeur : plus de rendu ni de mesure. */
  suspend(): void {
    if (this.suspended) return;
    this.suspended = true;
    const targets = this.scene.customRenderTargets;
    const index = targets.indexOf(this.depthMap());
    if (index >= 0) targets.splice(index, 1);
  }

  resume(): void {
    if (!this.suspended) return;
    this.suspended = false;
    const map = this.depthMap();
    if (!this.scene.customRenderTargets.includes(map)) this.scene.customRenderTargets.push(map);
    this.applyRefreshRate();
  }

  private applyRefreshRate(): void {
    // 0 : rendue une fois, puis seulement après resetRefreshCounter() (Babylon.js, ObjectRenderer).
    this.depthMap().refreshRate = this.everyFrame ? 1 : RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
  }

  /** Mesure au point choisi, après les mesures en cours ; done est appelé si la mesure a abouti. */
  private measure(done?: () => void): Promise<void> {
    this.queue = this.queue
      .then(async () => {
        this.measuring = true;
        try {
          const distance = await this.read();
          if (distance === null) return;
          this.focusDistance = distance;
          this.measuredOnce = true;
          done?.();
          this.notify();
        } finally {
          this.measuring = false;
        }
      })
      .catch((error: unknown) => console.error(error));
    return this.queue;
  }

  /**
   * Profondeur au point choisi, lue dans une image rendue après la demande (la projection a pu changer avec
   * la loupe) ; sur le fond à 360°, distance du plan du sol le long du rayon. Null si la lecture échoue.
   */
  private async read(): Promise<number | null> {
    if (this.suspended) return null;
    const map = this.depthMap();
    map.resetRefreshCounter();
    const rendered = await this.nextRender();
    if (!rendered || this.suspended) return null;
    const size = map.getSize();
    if (!size.width || !size.height) return null;
    const point = this.focusOnCanvas();
    const x = Math.min(size.width - 1, Math.max(0, Math.round(point.x * (size.width - 1))));
    const y = Math.min(size.height - 1, Math.max(0, Math.round((1 - point.y) * (size.height - 1))));
    try {
      await map.readPixels(0, 0, this.pixel, true, false, x, y, 1, 1);
    } catch {
      // Lecture impossible pendant un changement de taille : on garde la distance précédente.
      return null;
    }
    let z = this.pixel[0];
    const domeDistance = 0.8 * this.ground.domeRadius;
    if (!(z > this.camera.minZ) || z > domeDistance) {
      const upInCamera = Vector3.TransformNormal(Vector3.Up(), this.camera.getViewMatrix());
      z = Math.min(this.ground.domeRadius, groundDepth(this.camera.getProjectionMatrix(), upInCamera, this.ground, point));
    }
    return Number.isFinite(z) && z > 0 ? z : null;
  }

  /** Attend la fin de la prochaine image ; faux si aucune image n'a été rendue à temps. */
  private nextRender(): Promise<boolean> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.scene.onAfterRenderObservable.remove(observer);
        resolve(false);
      }, RENDER_WAIT_MS);
      const observer = this.scene.onAfterRenderObservable.addOnce(() => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}
