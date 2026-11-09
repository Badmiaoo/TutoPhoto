// Profondeur de champ approchée dans le viseur. Décision de Julien du 9 novembre 2026 (option B) : flou en
// disque de taille physique, écrit pour TutoPhoto, à la place de l'effet de Babylon.js ; la photo, elle,
// reste calculée exactement par accumulation (camera/photo.ts).
//
// - Diamètre du cercle de confusion, en pixels du canevas, avec la formule de la photo :
//   c = (f / N) × f / (S − f) × |D − S| / D, multiplié par les pixels du canevas par mm de capteur (loupe
//   comprise). Le rayon est plafonné à MAX_BLUR_RADIUS_PX.
// - Flou par « scatter-as-gather » en une passe, d'après Dennis Gustafsson, « Bokeh depth of field in a
//   single pass » (4 mai 2018), lu dans sa reproduction par l'exemple 45-bokeh de bgfx
//   [gustafsson-bokeh-single-pass, bgfx-bokeh-example] : échantillons en spirale (angle d'or), chacun compté
//   s'il couvre le pixel central ; un échantillon plus loin que le pixel central voit son flou limité au
//   double de celui du centre, pour que le fond ne déborde pas sur un sujet net.
// - Calcul à mi-résolution, puis recomposition en pleine résolution selon la taille moyenne du flou des
//   échantillons, comme dans l'exemple de bgfx.
// - Carte de profondeur propre au viseur (z dans le repère de la caméra, en mètres), sol invisible compris.
// - Mise au point continue sur le point choisi : distance relue dans la carte toutes les 200 ms ; sur le
//   fond à 360°, distance du plan du sol le long du rayon, comme pour la photo.
// - Les post-traitements ne sont attachés à la caméra qu'une fois compilés (voir camera/noise.ts).

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { ShaderStore } from "@babylonjs/core/Engines/shaderStore";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DepthRenderer } from "@babylonjs/core/Rendering/depthRenderer";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { PassPostProcess } from "@babylonjs/core/PostProcesses/passPostProcess";
import { groundDepth, type GroundInfo } from "./photo";

/** Rayon maximal du flou, en pixels du canevas (diamètre de 64 px). */
export const MAX_BLUR_RADIUS_PX = 32;
/** Pas de la spirale d'échantillons, en pixels de la passe à mi-résolution (environ 170 échantillons). */
const RADIUS_STEP = 0.75;
const COMPILE_TIMEOUT_MS = 20000;
const FOCUS_REFRESH_MS = 200;

const BLUR_SHADER = "viseurPdcFlou";
const COMPOSITE_SHADER = "viseurPdcComposition";

/** Rayon du flou, signé (négatif devant le plan de netteté), en pixels de la passe. */
const BLUR_RADIUS_GLSL = `
uniform sampler2D depthSampler;
uniform float focusDistance;
uniform float cocScale;
uniform float maxRadius;
float blurRadius(vec2 uv) {
  float z = max(texture2D(depthSampler, uv).r, 0.001);
  return clamp(0.5 * cocScale * (z - focusDistance) / z, -maxRadius, maxRadius);
}`;

ShaderStore.ShadersStore[`${BLUR_SHADER}FragmentShader`] = `
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float radiusStep;
uniform vec2 texelSize;
${BLUR_RADIUS_GLSL}
const float GOLDEN_ANGLE = 2.39996323;
void main(void) {
  float centerSize = blurRadius(vUV);
  float absCenter = abs(centerSize);
  // Poids du pixel central. Sur la spirale, chaque échantillon représente une couronne de surface
  // 2π × pas (un échantillon tous les pas / r de rayon) ; le centre ne représente que le disque de rayon pas,
  // de surface π × pas². Son poids, rapporté à celui d'un échantillon, vaut donc pas / 2. Avec un poids 1,
  // comme dans l'algorithme d'origine, les petits flous, qui ont peu d'échantillons, étaient trop nets.
  float total = 0.5 * radiusStep;
  vec3 color = texture2D(textureSampler, vUV).rgb * total;
  float sizes = 0.0;
  float counted = 0.0;
  float radius = radiusStep;
  // Rotation de départ propre à chaque pixel, fixe d'une image à l'autre : casse les motifs réguliers.
  float theta = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831853;
  for (int i = 0; i < 400; i++) {
    if (radius >= maxRadius) break;
    vec2 uv = vUV + vec2(cos(theta), sin(theta)) * texelSize * radius;
    vec3 sampleColor = texture2D(textureSampler, uv).rgb;
    float sampleSize = blurRadius(uv);
    float absSample = abs(sampleSize);
    // Échantillon plus loin que le centre : son flou ne déborde pas sur un centre plus net.
    if (sampleSize > centerSize) absSample = min(absSample, absCenter * 2.0);
    float m = smoothstep(radius - 0.5, radius + 0.5, absSample);
    color += mix(color / total, sampleColor, m);
    sizes += absSample;
    counted += 1.0;
    total += 1.0;
    radius += radiusStep / radius;
    theta += GOLDEN_ANGLE;
  }
  // Alpha : taille moyenne du flou des échantillons, rapportée au maximum, pour la recomposition.
  gl_FragColor = vec4(color / total, sizes / max(1.0, counted) / maxRadius);
}`;

ShaderStore.ShadersStore[`${COMPOSITE_SHADER}FragmentShader`] = `
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D sceneSampler;
uniform float maxRadius;
void main(void) {
  vec4 blurred = texture2D(textureSampler, vUV);
  vec3 sharp = texture2D(sceneSampler, vUV).rgb;
  // Taille moyenne du flou autour du pixel, en pixels du canevas : nette en dessous d'un pixel.
  float size = blurred.a * maxRadius;
  gl_FragColor = vec4(mix(sharp, blurred.rgb, clamp(size - 1.0, 0.0, 1.0)), 1.0);
}`;

export interface DofSettings {
  focalMm: number;
  aperture: number;
  /** Pixels du canevas par millimètre de capteur, loupe comprise. */
  pixelsPerMm: number;
}

export class ViewfinderDepthOfField {
  private readonly depth: DepthRenderer;
  private readonly copy: PassPostProcess;
  private readonly blur: PostProcess;
  private readonly composite: PostProcess;
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
    const engine = scene.getEngine();
    this.depth = new DepthRenderer(scene, Constants.TEXTURETYPE_FLOAT, camera, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE, true, "viseur-profondeur");
    this.depth.forceDepthWriteTransparentMeshes = true;
    const map = this.depth.getDepthMap();
    map.wrapU = Constants.TEXTURE_CLAMP_ADDRESSMODE;
    map.wrapV = Constants.TEXTURE_CLAMP_ADDRESSMODE;

    this.copy = new PassPostProcess("viseur-pdc-copie", 1, null, Constants.TEXTURE_BILINEAR_SAMPLINGMODE, engine);
    this.blur = new PostProcess(
      "viseur-pdc-flou",
      BLUR_SHADER,
      ["focusDistance", "cocScale", "maxRadius", "radiusStep", "texelSize"],
      ["depthSampler"],
      0.5,
      null,
      Constants.TEXTURE_BILINEAR_SAMPLINGMODE,
      engine,
    );
    this.composite = new PostProcess(
      "viseur-pdc-composition",
      COMPOSITE_SHADER,
      ["maxRadius"],
      ["sceneSampler"],
      1,
      null,
      Constants.TEXTURE_BILINEAR_SAMPLINGMODE,
      engine,
    );
    // Passe à mi-résolution : distances en pixels de cette passe, soit la moitié des pixels du canevas.
    this.blur.onApply = (effect) => {
      const s = this.settings;
      effect.setTexture("depthSampler", map);
      effect.setFloat("focusDistance", this.focusMeters());
      effect.setFloat("cocScale", s ? this.cocAtInfinity(s) / 2 : 0);
      effect.setFloat("maxRadius", MAX_BLUR_RADIUS_PX / 2);
      effect.setFloat("radiusStep", RADIUS_STEP);
      effect.setFloat2("texelSize", 1 / Math.max(1, this.blur.width), 1 / Math.max(1, this.blur.height));
    };
    this.composite.onApply = (effect) => {
      effect.setTextureFromPostProcessOutput("sceneSampler", this.copy);
      effect.setFloat("maxRadius", MAX_BLUR_RADIUS_PX);
    };

    const passes = [this.copy, this.blur, this.composite];
    const started = performance.now();
    const check = () => {
      if (passes.every((pp) => pp.isReady())) {
        this.compiled = true;
        this.sync();
        return;
      }
      const error = passes.map((pp) => pp.getEffect()?.getCompilationError()).find(Boolean);
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

  /** Distance de mise au point, au moins un peu plus que la focale (formule des lentilles minces). */
  private focusMeters(): number {
    const f = (this.settings?.focalMm ?? 50) / 1000;
    return Math.max(this.focusDistance, f * 1.01);
  }

  /** Diamètre du cercle de confusion d'un point à l'infini, en pixels du canevas : (f / N) × f / (S − f). */
  private cocAtInfinity(s: DofSettings): number {
    const f = s.focalMm;
    const S = this.focusMeters() * 1000;
    return (f / s.aperture) * (f / (S - f)) * s.pixelsPerMm;
  }

  private sync(): void {
    const wanted = this.compiled && !this.failed && this.enabled && !this.suspended;
    if (wanted === this.attached) return;
    const targets = this.scene.customRenderTargets;
    const map = this.depth.getDepthMap();
    if (wanted) {
      if (!targets.includes(map)) targets.push(map);
      this.camera.attachPostProcess(this.copy);
      this.camera.attachPostProcess(this.blur);
      this.camera.attachPostProcess(this.composite);
      this.attached = true;
      this.afterAttach();
    } else {
      this.camera.detachPostProcess(this.composite);
      this.camera.detachPostProcess(this.blur);
      this.camera.detachPostProcess(this.copy);
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
      if (Number.isFinite(z) && z > 0) this.focusDistance = z;
    } catch {
      // Lecture impossible pendant un changement de taille : on garde la distance précédente.
    } finally {
      this.reading = false;
    }
  }
}
