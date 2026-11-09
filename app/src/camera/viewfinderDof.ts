// Profondeur de champ approchée dans le viseur (décision du 8 novembre 2026, docs/camera-physique.md) : effet
// de profondeur de champ de Babylon.js, en temps réel ; la photo, elle, est calculée exactement.
//
// - Carte de profondeur propre au viseur : z dans le repère de la caméra, en mètres, y compris le sol
//   invisible qui reçoit les ombres (40 × 40 m). Au-delà, le sol de la photo à 360° est pris sur le plan du
//   sol, comme pour la photo.
// - Cercle de confusion de Babylon : (lensSize / N) × f / (S − f) × |S − D| / D, plafonné à 1, qui règle le
//   mélange entre l'image nette et des images floutées de taille fixe. Avec lensSize = f × pixels par mm ×
//   grossissement / DOF_MAX_BLUR_PX, la valeur 1 correspond au flou réel de DOF_MAX_BLUR_PX pixels.
// - Mise au point continue sur le point choisi : distance relue dans la carte toutes les 200 ms.
// - Les post-traitements ne sont attachés à la caméra qu'une fois compilés (voir camera/noise.ts).

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DepthRenderer } from "@babylonjs/core/Rendering/depthRenderer";
import { DepthOfFieldEffect, DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { PostProcessRenderPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipeline";
import "@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent";
import { groundDepth, type GroundInfo } from "./photo";

/**
 * Flou, en pixels, auquel correspond un cercle de confusion de 1 dans l'effet de Babylon (niveau Medium) :
 * diamètre du disque qui, appliqué à l'image nette, reproduit le mieux l'image floutée au maximum. Mesuré le
 * 9 novembre 2026 (docs/camera-physique.md).
 */
export const DOF_MAX_BLUR_PX = 24;
const PIPELINE = "viseur-profondeur-de-champ";
const COMPILE_TIMEOUT_MS = 20000;
const FOCUS_REFRESH_MS = 200;

export interface DofSettings {
  focalMm: number;
  aperture: number;
  /** Pixels du canevas par millimètre de capteur, loupe comprise. */
  pixelsPerMm: number;
}

export class ViewfinderDepthOfField {
  private readonly depth: DepthRenderer;
  private readonly effect: DepthOfFieldEffect;
  private readonly pipeline: PostProcessRenderPipeline;
  private compiled = false;
  private failed = false;
  private enabled = true;
  private suspended = false;
  private attached = false;
  private settings: DofSettings | null = null;
  /** Distance de mise au point en mètres, relue au point choisi. */
  private focusDistance = 5;
  private reading = false;
  private readonly pixel = new Float32Array(4);

  /**
   * focusOnCanvas : point de mise au point dans le canevas (de 0 à 1, origine en haut à gauche).
   * afterAttach : appelé quand l'effet vient d'être attaché, pour remettre le bruit après lui.
   */
  constructor(
    private readonly scene: Scene,
    private readonly camera: Camera,
    private readonly ground: GroundInfo,
    private readonly focusOnCanvas: () => { x: number; y: number },
    private readonly afterAttach: () => void,
    onFailure: (message: string) => void,
  ) {
    this.depth = new DepthRenderer(scene, Constants.TEXTURETYPE_FLOAT, camera, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE, true, "viseur-profondeur");
    this.depth.forceDepthWriteTransparentMeshes = true;
    this.effect = new DepthOfFieldEffect(scene, this.depth.getDepthMap(), DepthOfFieldEffectBlurLevel.Medium, Constants.TEXTURETYPE_UNSIGNED_BYTE, false, true);
    this.pipeline = new PostProcessRenderPipeline(scene.getEngine(), PIPELINE);
    this.pipeline.addEffect(this.effect);
    scene.postProcessRenderPipelineManager.addPipeline(this.pipeline);

    const started = performance.now();
    const check = () => {
      if (this.effect._isReady()) {
        this.compiled = true;
        this.sync();
        return;
      }
      const error = this.effect._effects.map((pp) => pp.getEffect()?.getCompilationError()).find(Boolean);
      if (error || performance.now() - started > COMPILE_TIMEOUT_MS) {
        this.failed = true;
        onFailure(error ? error.trim().split("\n").slice(0, 3).join(" ") : `> ${COMPILE_TIMEOUT_MS / 1000} s`);
        return;
      }
      setTimeout(check, 100);
    };
    check();
    setInterval(() => void this.refreshFocus(), FOCUS_REFRESH_MS);
  }

  /** Réglages de l'objectif et échelle du viseur. */
  update(settings: DofSettings): void {
    this.settings = settings;
    this.apply();
  }

  /** Interrupteur de l'aperçu de la profondeur de champ. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.sync();
  }

  /** Retire l'effet pendant le calcul d'une photo, qui calcule son propre flou. */
  suspend(): void {
    this.suspended = true;
    this.sync();
  }

  resume(): void {
    this.suspended = false;
    this.sync();
  }

  /** Distance de mise au point courante, en mètres. */
  distance(): number {
    return this.focusDistance;
  }

  private apply(): void {
    const s = this.settings;
    if (!s) return;
    const f = s.focalMm;
    this.effect.focalLength = f;
    this.effect.fStop = s.aperture;
    this.effect.focusDistance = Math.max(this.focusDistance * 1000, f * 1.01);
    this.effect.lensSize = (f * s.pixelsPerMm) / DOF_MAX_BLUR_PX;
  }

  private sync(): void {
    const wanted = this.compiled && !this.failed && this.enabled && !this.suspended;
    if (wanted === this.attached) return;
    const manager = this.scene.postProcessRenderPipelineManager;
    const targets = this.scene.customRenderTargets;
    const map = this.depth.getDepthMap();
    if (wanted) {
      if (!targets.includes(map)) targets.push(map);
      manager.attachCamerasToRenderPipeline(PIPELINE, this.camera);
      this.attached = true;
      this.afterAttach();
    } else {
      manager.detachCamerasFromRenderPipeline(PIPELINE, this.camera);
      const index = targets.indexOf(map);
      if (index >= 0) targets.splice(index, 1);
      this.attached = false;
    }
  }

  /** Relit la profondeur au point choisi ; sur le fond à 360°, distance du plan du sol le long du rayon. */
  private async refreshFocus(): Promise<void> {
    if (!this.attached || this.reading) return;
    const map = this.depth.getDepthMap();
    const size = map.getSize();
    if (!size.width || !size.height) return;
    const point = this.focusOnCanvas();
    const x = Math.min(size.width - 1, Math.max(0, Math.round(point.x * (size.width - 1))));
    const y = Math.min(size.height - 1, Math.max(0, Math.round((1 - point.y) * (size.height - 1))));
    this.reading = true;
    try {
      await map.readPixels(0, 0, this.pixel, true, false, x, y, 1, 1);
      let z = this.pixel[0];
      const domeDistance = 0.8 * this.ground.domeRadius;
      if (!(z > this.camera.minZ) || z > domeDistance) {
        const upInCamera = Vector3.TransformNormal(Vector3.Up(), this.camera.getViewMatrix());
        z = Math.min(this.ground.domeRadius, groundDepth(this.camera.getProjectionMatrix(), upInCamera, this.ground, point));
      }
      if (Number.isFinite(z) && z > 0) {
        this.focusDistance = z;
        this.apply();
      }
    } catch {
      // Lecture impossible pendant un changement de taille : on garde la distance précédente.
    } finally {
      this.reading = false;
    }
  }
}
