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
// Toucher pour faire le point sans déclencher existe sur le Z 6 (« Touch the display to focus on the selected
// point. Lifting your finger from the display does not release the shutter »).
// Modes de zone AF (MAP-05, décision de Julien du 9 novembre 2026), d'après le même manuel :
// - AF point sélectif : la distance au point choisi ;
// - AF zone large (S) et (L) : « If the selected focus area contains subjects at different distances from the
//   camera, the camera will assign priority to the closest subject » ; ici, la plus petite distance de la
//   zone. Le manuel ne donne pas la taille des zones : elle est choisie pour TutoPhoto (ui/cameraPanel.ts).
// Non simulé : les échecs et les hésitations de l'autofocus (sujet peu contrasté, faible lumière), la
// priorité au déclenchement ou à la mise au point, la prédiction du mouvement (la distance mesurée au
// déclenchement est exacte), la taille minimale d'un sujet pour qu'une zone large le retienne.
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
/** Mode de zone AF : point sélectif, zone large (S) ou (L). */
export type AreaMode = "point" | "wideS" | "wideL";

/** Où mesurer, dans le canevas (de 0 à 1, origine en haut à gauche). */
export interface FocusArea {
  /** Point de mise au point. */
  point: { x: number; y: number };
  /** Zone large, rognée au cadre ; null pour le point sélectif. */
  zone: { left: number; top: number; right: number; bottom: number } | null;
}

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
  private pixels = new Float32Array(4);
  /** Mesures en cours, l'une après l'autre. */
  private queue: Promise<void> = Promise.resolve();
  private measuring = false;
  /** Faux tant qu'aucune mesure n'a abouti : la première se fait aussi en AF-S, pour placer l'objectif. */
  private measuredOnce = false;
  private readonly listeners: (() => void)[] = [];

  /** focusArea : point ou zone de mise au point, dans le canevas, loupe comprise. */
  constructor(
    private readonly scene: Scene,
    private readonly camera: Camera,
    private readonly ground: GroundInfo,
    private readonly focusArea: () => FocusArea,
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

  /** Mesure immédiate (au déclenchement, sans verrou) ; faux si elle n'a pas abouti. */
  async measureNow(): Promise<boolean> {
    let measured = false;
    await this.measure(() => {
      measured = true;
    });
    return measured;
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
   * Distance au point choisi, ou plus petite distance de la zone large, lue dans une image rendue après la
   * demande (la projection a pu changer avec la loupe). Sur le fond à 360°, distance du plan du sol le long
   * du rayon de chaque pixel. Null si la lecture échoue.
   */
  private async read(): Promise<number | null> {
    if (this.suspended) return null;
    const map = this.depthMap();
    map.resetRefreshCounter();
    const rendered = await this.nextRender();
    if (!rendered || this.suspended) return null;
    const size = map.getSize();
    if (!size.width || !size.height) return null;
    const { width: W, height: H } = size;
    const area = this.focusArea();
    // Rectangle à lire, en pixels de la carte ; les lignes de la carte commencent en bas.
    const column = (x: number) => Math.min(W - 1, Math.max(0, Math.round(x * (W - 1))));
    const row = (y: number) => Math.min(H - 1, Math.max(0, Math.round((1 - y) * (H - 1))));
    const zone = area.zone ?? { left: area.point.x, right: area.point.x, top: area.point.y, bottom: area.point.y };
    const x0 = column(zone.left);
    const x1 = column(zone.right);
    const y0 = row(zone.bottom);
    const y1 = row(zone.top);
    const w = x1 - x0 + 1;
    const h = y1 - y0 + 1;
    if (this.pixels.length !== w * h * 4) this.pixels = new Float32Array(w * h * 4);
    try {
      await map.readPixels(0, 0, this.pixels, true, false, x0, y0, w, h);
    } catch {
      // Lecture impossible pendant un changement de taille : on garde la distance précédente.
      return null;
    }
    const domeDistance = 0.8 * this.ground.domeRadius;
    const upInCamera = Vector3.TransformNormal(Vector3.Up(), this.camera.getViewMatrix());
    const projection = this.camera.getProjectionMatrix();
    let nearest = Infinity;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        let z = this.pixels[(j * w + i) * 4];
        if (!(z > this.camera.minZ) || z > domeDistance) {
          const point = area.zone ? { x: (x0 + i) / Math.max(1, W - 1), y: 1 - (y0 + j) / Math.max(1, H - 1) } : area.point;
          z = Math.min(this.ground.domeRadius, groundDepth(projection, upInCamera, this.ground, point));
        }
        if (z > 0 && z < nearest) nearest = z;
      }
    }
    return Number.isFinite(nearest) ? nearest : null;
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
