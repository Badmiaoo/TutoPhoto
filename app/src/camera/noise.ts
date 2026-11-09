// Bruit numérique physique (docs/camera-physique.md ; décisions du 9 novembre 2026 : bruit coloré selon
// la matrice de Bayer, bruit brut sans réduction, dans le viseur et sur la photo).
//
// Pour un photosite, à la sensibilité S :
// - électrons à saturation : e_sat = capacité × 100 / S ;
// - électrons reçus : n = v × e_sat, v étant la valeur rapportée à la saturation (exposition comprise) ;
// - écart type : √(n + σ_r²), σ_r le bruit de lecture mesuré à cet ISO (interpolé en log-log).
// Un pixel de l'image regroupe k photosites ; pour chaque canal, seule une part capte sa couleur :
// la moitié pour le vert, un quart pour le rouge et pour le bleu (matrice de Bayer, deux fois plus de
// verts que de rouges ou de bleus [wikipedia-bayer-filter]). Écart type relatif à la saturation, par canal :
// σ = √(n + σ_r²) / (e_sat × √(k × part)).

import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import type { Effect } from "@babylonjs/core/Materials/effect";
import { Constants } from "@babylonjs/core/Engines/constants";
import { RawTexture } from "@babylonjs/core/Materials/Textures/rawTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { ShaderStore } from "@babylonjs/core/Engines/shaderStore";
import type { Body } from "./bodies";

/** Part des photosites qui captent chaque canal (rouge, vert, bleu) dans une matrice de Bayer. */
const BAYER_SHARE = [0.25, 0.5, 0.25] as const;
/** Côté de la texture de tirages gaussiens, en pixels. */
export const NOISE_TILE = 512;

export interface NoiseParameters {
  /** Électrons à saturation, par photosite. */
  saturation: number;
  /** Carré du bruit de lecture, en électrons². */
  readNoise2: number;
  /** Photosites par pixel de l'image, pour chaque canal. */
  photosites: [number, number, number];
}

/** Bruit de lecture à un ISO donné, interpolé entre les mesures en log₂(ISO) et log₂(électrons). */
export function readNoiseAt(body: Body, iso: number): number {
  const points = body.readNoise;
  if (iso <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  // Au-delà de la dernière mesure, on garde la dernière valeur (D5600 : mesuré jusqu'à ISO 2546).
  if (iso >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [isoB, rnB] = points[i];
    if (iso <= isoB) {
      const [isoA, rnA] = points[i - 1];
      const t = Math.log2(iso / isoA) / Math.log2(isoB / isoA);
      return 2 ** (Math.log2(rnA) + t * Math.log2(rnB / rnA));
    }
  }
  return last[1];
}

export function noiseParameters(body: Body, iso: number, imagePixels: number): NoiseParameters {
  const k = body.effectivePixels / Math.max(1, imagePixels);
  const rn = readNoiseAt(body, iso);
  return {
    saturation: (body.fullWellElectrons * 100) / iso,
    readNoise2: rn * rn,
    photosites: [k * BAYER_SHARE[0], k * BAYER_SHARE[1], k * BAYER_SHARE[2]],
  };
}

/** Fonctions GLSL communes : ajout du bruit à une valeur linéaire rapportée à la saturation. */
export const NOISE_GLSL = `
uniform sampler2D noiseSampler;
uniform float noiseSaturation;
uniform float noiseRead2;
uniform vec3 noisePhotosites;
uniform vec4 noiseOffsets;
// Deux lectures de la texture de tirages gaussiens, la seconde tournée de 37 degrés, pour casser la
// répétition du motif ; la somme de deux tirages indépendants, divisée par racine de 2, reste gaussienne.
vec3 gaussianAt(vec2 pixel) {
  const float c = 0.79863551;
  const float s = 0.60181502;
  vec2 rotated = vec2(c * pixel.x - s * pixel.y, s * pixel.x + c * pixel.y);
  vec3 a = texture2D(noiseSampler, (pixel + noiseOffsets.xy) / ${NOISE_TILE.toFixed(1)}).rgb;
  vec3 b = texture2D(noiseSampler, (rotated + noiseOffsets.zw) / ${NOISE_TILE.toFixed(1)}).rgb;
  return (a + b) * 0.70710678;
}
vec3 addSensorNoise(vec3 v, vec2 pixel) {
  vec3 electrons = max(v, 0.0) * noiseSaturation;
  vec3 sigma = sqrt(electrons + noiseRead2) / (noiseSaturation * sqrt(noisePhotosites));
  return v + gaussianAt(pixel) * sigma;
}`;

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

export const NOISE_UNIFORMS = ["noiseSaturation", "noiseRead2", "noisePhotosites", "noiseOffsets"];

const VIEWFINDER_SHADER = "viseurBruit";
ShaderStore.ShadersStore[`${VIEWFINDER_SHADER}FragmentShader`] = `
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
${NOISE_GLSL}
void main(void) {
  // L'image du viseur est déjà encodée (puissance 1/2,2) et écrêtée : on revient en lumière linéaire,
  // on ajoute le bruit, puis on réencode. Approximation : les hautes lumières écrêtées n'ont plus de bruit.
  vec3 linear = pow(texture2D(textureSampler, vUV).rgb, vec3(2.2));
  vec3 noisy = clamp(addSensorNoise(linear, gl_FragCoord.xy), 0.0, 1.0);
  gl_FragColor = vec4(pow(noisy, vec3(1.0 / 2.2)), 1.0);
}`;

/** Bruit du viseur : post-traitement de la caméra, nouveau tirage à chaque image. */
export class ViewfinderNoise {
  private readonly postProcess: PostProcess;
  private params: NoiseParameters | null = null;

  constructor(
    scene: Scene,
    private readonly camera: Camera,
  ) {
    this.postProcess = new PostProcess("viseur-bruit", VIEWFINDER_SHADER, NOISE_UNIFORMS, ["noiseSampler"], 1, camera);
    this.postProcess.onApply = (effect) => {
      if (this.params) bindNoise(effect, scene, this.params);
    };
  }

  update(body: Body, iso: number, framePixels: number): void {
    this.params = noiseParameters(body, iso, framePixels);
  }

  /** Retire le bruit du viseur pendant le calcul d'une photo, qui ajoute le sien. */
  detach(): void {
    this.camera.detachPostProcess(this.postProcess);
  }

  attach(): void {
    this.camera.attachPostProcess(this.postProcess);
  }
}
