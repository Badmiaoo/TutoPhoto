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
// - La spirale s'arrête au plus grand flou présent dans l'image : celui d'un point à l'infini (le fond) ou
//   celui du sol en bas du cadre, s'il est plus grand. Aux réglages courants, le flou est minuscule et le
//   calcul presque gratuit.
// - Carte de profondeur et distance de mise au point fournies par l'autofocus du viseur (camera/autofocus.ts),
//   en AF ponctuel ou continu.
// - Les post-traitements ne sont attachés à la caméra qu'une fois compilés (voir camera/noise.ts).

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { ShaderStore } from "@babylonjs/core/Engines/shaderStore";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { PassPostProcess } from "@babylonjs/core/PostProcesses/passPostProcess";
import { groundDepth, type GroundInfo } from "./photo";
import type { Autofocus } from "./autofocus";

/** Rayon maximal du flou, en pixels du canevas (diamètre de 64 px). */
export const MAX_BLUR_RADIUS_PX = 32;
/**
 * Pas de la spirale d'échantillons, en pixels de la passe à mi-résolution. Une spirale de rayon R et de pas p
 * compte environ R² / (2p) échantillons : au plus 0,75 (environ 170 échantillons au plafond), et moins pour
 * les petits flous, afin d'en garder au moins MIN_SAMPLES. Avec trop peu d'échantillons, le flou montrait un
 * grain visible sur les petits écrans (9 novembre 2026).
 */
const RADIUS_STEP = 0.75;
const MIN_SAMPLES = 64;
const COMPILE_TIMEOUT_MS = 20000;

const BLUR_SHADER = "viseurPdcFlou";
const COMPOSITE_SHADER = "viseurPdcComposition";

/** Rayon du flou, signé (négatif devant le plan de netteté), en pixels de la passe. */
const BLUR_RADIUS_GLSL = `
uniform sampler2D depthSampler;
uniform float focusDistance;
uniform float cocScale;
uniform float maxRadius;
// Le passage par la mi-résolution ajoute lui-même un flou : lecture de l'image par blocs de 2 × 2 pixels
// (variance (2² − 1) / 12 = 0,25 pixel² du canevas par axe) et agrandissement bilinéaire final (2² / 6 ≈ 0,67).
// Un disque de diamètre D ayant une variance D² / 16 par axe, on réduit le disque calculé pour que la somme
// donne le diamètre voulu : r² − 0,92 en rayon de la passe à mi-résolution (r = D / 4).
const float RESAMPLING_VARIANCE = 0.92;
float blurRadius(vec2 uv) {
  float z = max(texture2D(depthSampler, uv).r, 0.001);
  float r = clamp(0.5 * cocScale * (z - focusDistance) / z, -maxRadius, maxRadius);
  return sign(r) * sqrt(max(r * r - RESAMPLING_VARIANCE, 0.0));
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
  // Même spirale pour tous les pixels : avec au moins 64 échantillons, une rotation propre à chaque pixel
  // n'est plus nécessaire, et elle laissait un grain à l'échelle du pixel.
  float theta = 0.0;
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
  private readonly copy: PassPostProcess;
  private readonly blur: PostProcess;
  private readonly composite: PostProcess;
  private compiled = false;
  private failed = false;
  private enabled = true;
  private suspended = false;
  private attached = false;
  private settings: DofSettings | null = null;
  /** Rayon maximal du flou pour l'image en cours, en pixels du canevas (au moins 1). */
  private radiusLimit = 1;

  /** afterAttach : appelé quand l'effet vient d'être attaché, pour remettre le bruit après lui. */
  constructor(
    scene: Scene,
    private readonly camera: Camera,
    private readonly ground: GroundInfo,
    private readonly autofocus: Autofocus,
    private readonly afterAttach: () => void,
    onFailure: (message: string) => void,
  ) {
    const engine = scene.getEngine();
    const map = autofocus.depthMap();

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
      this.radiusLimit = this.largestRadius();
      effect.setTexture("depthSampler", map);
      effect.setFloat("focusDistance", this.focusMeters());
      effect.setFloat("cocScale", s ? this.cocAtInfinity(s) / 2 : 0);
      const halfRadius = this.radiusLimit / 2;
      effect.setFloat("maxRadius", halfRadius);
      effect.setFloat("radiusStep", Math.min(RADIUS_STEP, Math.max(0.01, (halfRadius * halfRadius) / (2 * MIN_SAMPLES))));
      effect.setFloat2("texelSize", 1 / Math.max(1, this.blur.width), 1 / Math.max(1, this.blur.height));
    };
    this.composite.onApply = (effect) => {
      effect.setTextureFromPostProcessOutput("sceneSampler", this.copy);
      effect.setFloat("maxRadius", this.radiusLimit);
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

  /** Distance de mise au point, au moins un peu plus que la focale (formule des lentilles minces). */
  private focusMeters(): number {
    const f = (this.settings?.focalMm ?? 50) / 1000;
    return Math.max(this.autofocus.distance(), f * 1.01);
  }

  /** Diamètre du cercle de confusion d'un point à l'infini, en pixels du canevas : (f / N) × f / (S − f). */
  private cocAtInfinity(s: DofSettings): number {
    const f = s.focalMm;
    const S = this.focusMeters() * 1000;
    return (f / s.aperture) * (f / (S - f)) * s.pixelsPerMm;
  }

  /**
   * Plus grand rayon de flou présent dans l'image, en pixels du canevas, plafonné à MAX_BLUR_RADIUS_PX : celui
   * d'un point à l'infini, ou celui du sol en bas du canevas (au centre et aux coins), s'il est plus proche
   * que la moitié de la distance de mise au point.
   */
  private largestRadius(): number {
    const s = this.settings;
    if (!s) return 1;
    const S = this.focusMeters();
    const infinity = this.cocAtInfinity(s);
    let largest = infinity;
    const upInCamera = Vector3.TransformNormal(Vector3.Up(), this.camera.getViewMatrix());
    const projection = this.camera.getProjectionMatrix();
    for (const x of [0, 0.5, 1]) {
      const d = groundDepth(projection, upInCamera, this.ground, { x, y: 1 });
      if (Number.isFinite(d) && d > 0) largest = Math.max(largest, (infinity * Math.abs(d - S)) / d);
    }
    // Rayon = demi-diamètre ; un pixel de marge pour la transition entre net et flou.
    return Math.min(MAX_BLUR_RADIUS_PX, Math.max(1, largest / 2 + 1));
  }

  private sync(): void {
    const wanted = this.compiled && !this.failed && this.enabled && !this.suspended;
    if (wanted === this.attached) return;
    if (wanted) {
      this.autofocus.setDepthEveryFrame(true);
      this.camera.attachPostProcess(this.copy);
      this.camera.attachPostProcess(this.blur);
      this.camera.attachPostProcess(this.composite);
      this.attached = true;
      this.afterAttach();
    } else {
      this.camera.detachPostProcess(this.composite);
      this.camera.detachPostProcess(this.blur);
      this.camera.detachPostProcess(this.copy);
      this.autofocus.setDepthEveryFrame(false);
      this.attached = false;
    }
  }
}
