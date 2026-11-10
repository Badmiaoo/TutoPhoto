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
// - AF zone automatique (MAP-09, décision du 9 novembre 2026) : priorité aux visages et aux yeux détectés
//   (camera/faces.ts), selon le réglage a4 du Z 6. Toucher le viseur choisit le visage le plus proche du point
//   touché, que l'appareil suit ensuite (« the camera will track the selected subject as it moves through
//   the frame ») ; sans toucher, le visage le plus proche du point de mise au point. Sans visage détecté,
//   le sujet le plus proche dans tout le cadre, règle écrite dans le manuel du Nikon COOLPIX P1100 (« the
//   camera automatically selects one or more of the nine focus areas containing the subject closest to the
//   camera ») [nikon-p1100-af-area], faute de règle écrite pour le Z 6 ; ou, après un toucher sans visage, le
//   point touché, comme le déclencheur tactile du Z 6 (« focus on the selected point »).
//   https://onlinemanual.nikonimglib.com/p1100/en/08-31.html
// Non simulé : les échecs et les hésitations de l'autofocus (sujet peu contrasté, faible lumière), la
// priorité au déclenchement ou à la mise au point, la prédiction du mouvement (la distance mesurée au
// déclenchement est exacte), la taille minimale d'un sujet pour qu'une zone large le retienne, le suivi d'un
// sujet qui n'est pas un visage.
//
// Carte de profondeur propre au viseur (z dans le repère de la caméra, en mètres), sol invisible compris.
// Rendue à chaque image quand la profondeur de champ du viseur s'en sert, sinon seulement avant chaque
// mesure ; redimensionnée avec le canevas (Babylon la crée à la taille du moment). Sur le fond à 360°, la
// distance est celle du plan du sol le long du rayon, comme pour la photo.

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DepthRenderer } from "@babylonjs/core/Rendering/depthRenderer";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { groundDepth, type GroundInfo } from "./photo";
import { detectFaces, nearestFace, type CanvasPoint, type DetectionView, type FaceSubject } from "./faces";

export type FocusMode = "single" | "continuous";
/** Mode de zone AF : point sélectif, zone large (S) ou (L), zone automatique. */
export type AreaMode = "point" | "wideS" | "wideL" | "auto";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Où mesurer, dans le canevas (de 0 à 1, origine en haut à gauche). */
export interface FocusArea {
  /** Point de mise au point. */
  point: CanvasPoint;
  /**
   * Zone large, ou toute la zone couverte par l'autofocus en zone automatique, rognée à cette couverture ;
   * null pour le point sélectif.
   */
  zone: Rect | null;
  /** Zone automatique : réglage de détection et échelle du cadre ; null pour les autres modes. */
  auto: DetectionView | null;
}

/** Ce sur quoi la zone automatique a fait le point, pour le repère du viseur. */
export interface FocusTarget {
  kind: "eye" | "face" | "nearest" | "point";
  /** Sujet du visage retenu (camera/faces.ts), pour l'œil ou le visage. */
  id?: string;
  point: CanvasPoint;
  /** Côté du repère, en fraction de la largeur du canevas ; 0 : taille de la feuille de style. */
  size: number;
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
  /** Zone automatique : sujet suivi, choix à refaire après un toucher, toucher sans visage. */
  private selectedId: string | null = null;
  private reselect = false;
  private touchedWithoutFace = false;
  private wasAuto = false;
  private focusTarget: FocusTarget | null = null;

  /** focusArea : point ou zone de mise au point, dans le canevas, loupe comprise. */
  constructor(
    private readonly scene: Scene,
    private readonly camera: Camera,
    private readonly ground: GroundInfo,
    private readonly focusArea: () => FocusArea,
    private readonly subjects: readonly FaceSubject[] = [],
  ) {
    this.depth = new DepthRenderer(scene, Constants.TEXTURETYPE_FLOAT, camera, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE, true, "viseur-profondeur");
    this.depth.forceDepthWriteTransparentMeshes = true;
    const map = this.depth.getDepthMap();
    map.wrapU = Constants.TEXTURE_CLAMP_ADDRESSMODE;
    map.wrapV = Constants.TEXTURE_CLAMP_ADDRESSMODE;
    this.applyRefreshRate();
    scene.customRenderTargets.push(map);
    const engine = scene.getEngine();
    engine.onResizeObservable.add(() => {
      const width = engine.getRenderWidth();
      const height = engine.getRenderHeight();
      const size = map.getSize();
      if (width > 0 && height > 0 && (size.width !== width || size.height !== height)) {
        map.resize({ width, height });
        map.resetRefreshCounter();
      }
    });
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

  /** Ce sur quoi la zone automatique a fait le point ; null dans les autres modes. */
  target(): FocusTarget | null {
    return this.focusTarget;
  }

  /**
   * Toucher le viseur : en zone automatique, choisir le visage le plus proche du point touché ; en AF-S,
   * faire le point et verrouiller.
   */
  touch(): Promise<void> {
    this.reselect = true;
    if (this.focusMode === "single") return this.focusNow();
    return this.measure();
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
          const result = await this.read();
          if (result === null) return;
          this.focusDistance = result.distance;
          this.focusTarget = result.target;
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
   * Distance de mise au point, lue dans une image rendue après la demande (la projection a pu changer avec la
   * loupe) : au point choisi, plus petite distance de la zone large, ou zone automatique. Null si la lecture
   * échoue.
   */
  private async read(): Promise<{ distance: number; target: FocusTarget | null } | null> {
    if (this.suspended) return null;
    const map = this.depthMap();
    map.resetRefreshCounter();
    const rendered = await this.nextRender();
    if (!rendered || this.suspended) return null;
    const size = map.getSize();
    if (!size.width || !size.height) return null;
    const area = this.focusArea();
    if (!area.auto) {
      this.wasAuto = false;
      const distance = area.zone ? ((await this.nearestIn(area.zone))?.distance ?? null) : await this.depthAt(area.point);
      return distance === null ? null : { distance, target: null };
    }
    return this.readAuto(area, area.auto);
  }

  /** Zone automatique : visage suivi ou le plus proche du point ; sinon point touché ou sujet le plus proche. */
  private async readAuto(area: FocusArea, view: DetectionView): Promise<{ distance: number; target: FocusTarget } | null> {
    if (!this.wasAuto) {
      this.wasAuto = true;
      this.selectedId = null;
      this.touchedWithoutFace = false;
    }
    const faces = await detectFaces(this.subjects, this.camera.getViewMatrix(), this.camera.getProjectionMatrix(), this.camera.minZ, view, (p) =>
      this.depthAt(p),
    );
    const reselect = this.reselect;
    this.reselect = false;
    let face = reselect ? null : (faces.find((f) => f.id === this.selectedId) ?? null);
    if (!face) face = nearestFace(faces, area.point, view.canvasWidth, view.canvasHeight);
    this.selectedId = face?.id ?? null;
    if (face) {
      this.touchedWithoutFace = false;
      const distance = await this.depthAt(face.point);
      if (distance === null) return null;
      // Repère autour de l'œil (0,8 écart des yeux) ou du visage (2,5 écarts) : tailles choisies pour l'affichage.
      return {
        distance,
        target: { kind: face.target, id: face.id, point: face.point, size: face.spacing * (face.target === "eye" ? 0.8 : 2.5) },
      };
    }
    if (reselect) this.touchedWithoutFace = true;
    if (this.touchedWithoutFace) {
      const distance = await this.depthAt(area.point);
      return distance === null ? null : { distance, target: { kind: "point", point: area.point, size: 0 } };
    }
    const nearest = area.zone ? await this.nearestIn(area.zone) : null;
    return nearest ? { distance: nearest.distance, target: { kind: "nearest", point: nearest.at, size: 0 } } : null;
  }

  /** Distance au point donné du canevas ; sur le fond à 360°, distance du plan du sol le long du rayon. */
  private async depthAt(point: CanvasPoint): Promise<number | null> {
    const found = await this.nearestIn({ left: point.x, right: point.x, top: point.y, bottom: point.y });
    return found?.distance ?? null;
  }

  /**
   * Plus petite distance d'un rectangle du canevas, et son emplacement. Sur le fond à 360°, chaque pixel prend
   * la distance du plan du sol le long de son rayon. Null si la lecture échoue.
   */
  private async nearestIn(rect: Rect): Promise<{ distance: number; at: CanvasPoint } | null> {
    const map = this.depthMap();
    const { width: W, height: H } = map.getSize();
    if (!W || !H) return null;
    // Rectangle à lire, en pixels de la carte ; les lignes de la carte commencent en bas.
    const column = (x: number) => Math.min(W - 1, Math.max(0, Math.round(x * (W - 1))));
    const row = (y: number) => Math.min(H - 1, Math.max(0, Math.round((1 - y) * (H - 1))));
    const x0 = column(rect.left);
    const x1 = column(rect.right);
    const y0 = row(rect.bottom);
    const y1 = row(rect.top);
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
    const single = w === 1 && h === 1;
    let nearest = Infinity;
    let at: CanvasPoint = { x: rect.left, y: rect.top };
    // Distances égales à 5 mm près (le sol en bas du cadre, appareil horizontal) : le point le plus proche du
    // centre du rectangle, pour un repère lisible.
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    const offCenter = (p: CanvasPoint) => (p.x - cx) ** 2 + (p.y - cy) ** 2;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        let z = this.pixels[(j * w + i) * 4];
        const point = single ? { x: rect.left, y: rect.top } : { x: (x0 + i) / Math.max(1, W - 1), y: 1 - (y0 + j) / Math.max(1, H - 1) };
        if (!(z > this.camera.minZ) || z > domeDistance) {
          z = Math.min(this.ground.domeRadius, groundDepth(projection, upInCamera, this.ground, point));
        }
        if (z > 0 && (z < nearest - 0.005 || (z <= nearest + 0.005 && offCenter(point) < offCenter(at)))) {
          nearest = Math.min(nearest, z);
          at = point;
        }
      }
    }
    return Number.isFinite(nearest) ? { distance: nearest, at } : null;
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
