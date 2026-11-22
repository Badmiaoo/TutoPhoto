// Bruit du capteur, côté rendu : texture des tirages gaussiens, liaison des uniformes du bruit à un shader, et
// post-traitement du viseur. La loi du bruit (paramètres, écart type, la même loi en GLSL) est dans
// camera/noiseModel.ts, sans rendu (constat ARC-07 de l'audit, version 0.3.87) ; elle y est décrite.

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import type { Effect } from "@babylonjs/core/Materials/effect";
import { Constants } from "@babylonjs/core/Engines/constants";
import { RawTexture } from "@babylonjs/core/Materials/Textures/rawTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { ShaderStore } from "@babylonjs/core/Engines/shaderStore";
import type { Body } from "./bodies";
import { NOISE_GLSL, NOISE_TILE, NOISE_UNIFORMS, noiseParameters, viewfinderNoiseGrid, type NoiseParameters } from "./noiseModel";

let sharedTexture: RawTexture | null = null;

/** Texture de tirages gaussiens indépendants (méthode de Box-Muller), créée une fois. */
export function gaussianTexture(scene: Scene): RawTexture {
  if (sharedTexture) return sharedTexture;
  const data = new Float32Array(NOISE_TILE * NOISE_TILE * 4);
  for (let i = 0; i < data.length; i += 2) {
    const u = 1 - Math.random();
    const v = Math.random();
    const r = Math.sqrt(-2 * Math.log(u));
    data[i] = r * Math.cos(2 * Math.PI * v);
    data[i + 1] = r * Math.sin(2 * Math.PI * v);
  }
  sharedTexture = RawTexture.CreateRGBATexture(
    data,
    NOISE_TILE,
    NOISE_TILE,
    scene,
    false,
    false,
    Texture.NEAREST_SAMPLINGMODE,
    Constants.TEXTURETYPE_FLOAT,
  );
  sharedTexture.wrapU = Texture.WRAP_ADDRESSMODE;
  sharedTexture.wrapV = Texture.WRAP_ADDRESSMODE;
  return sharedTexture;
}

export function bindNoise(effect: Effect, scene: Scene, params: NoiseParameters): void {
  effect.setTexture("noiseSampler", gaussianTexture(scene));
  effect.setFloat("noiseSaturation", params.saturation);
  effect.setFloat("noiseRead2", params.readNoise2);
  effect.setFloat3("noisePhotosites", ...params.photosites);
  const r = () => Math.random() * NOISE_TILE;
  effect.setFloat4("noiseOffsets", r(), r(), r(), r());
}

const VIEWFINDER_SHADER = "viseurBruit";
ShaderStore.ShadersStore[`${VIEWFINDER_SHADER}FragmentShader`] = `
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float noiseGain;
uniform float noiseCellScale;
${NOISE_GLSL}
void main(void) {
  // L'image du viseur est déjà encodée (puissance 1/2,2) et écrêtée : on revient en lumière linéaire,
  // on ajoute le bruit, puis on réencode. Approximation : les hautes lumières écrêtées n'ont plus de bruit.
  vec3 linear = pow(texture2D(textureSampler, vUV).rgb, vec3(2.2));
  // Aperçu de la luminosité coupé : l'image affichée vaut l'image réelle divisée par noiseGain. Le bruit
  // est celui de l'image réelle, ramené à l'échelle de l'image affichée.
  vec3 real = min(linear * noiseGain, 1.0);
  // Cellule du tirage (viewfinderNoiseGrid) : le pixel calculé (noiseCellScale = 1, coordonnées inchangées) ou le
  // pixel CSS qui le contient (noiseCellScale = 1 / densité), centre de la cellule.
  vec2 cell = floor(gl_FragCoord.xy * noiseCellScale) + 0.5;
  vec3 noisy = clamp(linear + (addSensorNoise(real, cell) - real) / noiseGain, 0.0, 1.0);
  gl_FragColor = vec4(pow(noisy, vec3(1.0 / 2.2)), 1.0);
}`;

/** Délai laissé à la compilation du shader du bruit du viseur, en millisecondes. */
const COMPILE_TIMEOUT_MS = 20000;

/**
 * Bruit du viseur : post-traitement de la caméra, nouveau tirage à chaque image. Il n'est attaché à la
 * caméra qu'une fois son shader compilé : Babylon attend que les post-traitements de la caméra soient
 * prêts avant de déclarer la scène prête, et un shader qui ne compile pas bloquait le chargement.
 */
export class ViewfinderNoise {
  private readonly postProcess: PostProcess;
  private params: NoiseParameters | null = null;
  private gain = 1;
  private cellScale = 1;
  private enabled = true;
  private suspended = false;
  private compiled = false;
  private attached = false;

  /** onFailure : appelé avec l'erreur de compilation si le shader ne compile pas ; le viseur reste sans bruit. */
  constructor(
    scene: Scene,
    private readonly camera: Camera,
    onFailure: (message: string) => void,
  ) {
    this.postProcess = new PostProcess(
      "viseur-bruit",
      VIEWFINDER_SHADER,
      [...NOISE_UNIFORMS, "noiseGain", "noiseCellScale"],
      ["noiseSampler"],
      1,
      null,
      Texture.NEAREST_SAMPLINGMODE,
      scene.getEngine(),
    );
    this.postProcess.onApply = (effect) => {
      if (this.params) bindNoise(effect, scene, this.params);
      effect.setFloat("noiseGain", this.gain);
      effect.setFloat("noiseCellScale", this.cellScale);
    };
    const started = performance.now();
    const check = () => {
      const effect = this.postProcess.getEffect();
      if (effect?.isReady()) {
        this.compiled = true;
        this.sync();
        return;
      }
      const error = effect?.getCompilationError();
      if (error || performance.now() - started > COMPILE_TIMEOUT_MS) {
        this.postProcess.dispose();
        onFailure(error ? error.trim().split("\n").slice(0, 3).join(" ") : `> ${COMPILE_TIMEOUT_MS / 1000} s`);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  }

  /**
   * Paramètres du bruit. framePixels : pixels calculés du cadre, multipliés par le carré du grossissement de la loupe ;
   * scalingLevel : niveau de mise à l'échelle du moteur (1 / densité) ; gain : rapport entre l'image réelle et l'image
   * affichée, 1 quand le viseur montre la luminosité réelle, 2^écart quand l'aperçu de la luminosité est coupé.
   */
  update(body: Body, iso: number, framePixels: number, scalingLevel: number, gain: number): void {
    const grid = viewfinderNoiseGrid(body, framePixels, scalingLevel);
    this.params = noiseParameters(body, iso, grid.imagePixels);
    this.cellScale = grid.cellScale;
    this.gain = gain;
  }

  /** Interrupteur de l'aperçu du bruit dans le viseur. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.sync();
  }

  /** Retire le bruit du viseur pendant le calcul d'une photo, qui ajoute le sien. */
  suspend(): void {
    this.suspended = true;
    this.sync();
  }

  resume(): void {
    this.suspended = false;
    this.sync();
  }

  /** Remet le bruit en dernier post-traitement, après un effet attaché depuis (profondeur de champ). */
  moveToEnd(): void {
    if (!this.attached) return;
    this.camera.detachPostProcess(this.postProcess);
    this.camera.attachPostProcess(this.postProcess);
  }

  private sync(): void {
    const wanted = this.compiled && this.enabled && !this.suspended;
    if (wanted === this.attached) return;
    if (wanted) this.camera.attachPostProcess(this.postProcess);
    else this.camera.detachPostProcess(this.postProcess);
    this.attached = wanted;
  }
}
