// Photo calculée au déclenchement, par accumulation de rendus (Haeberli et Akeley, 1990 ;
// docs/camera-physique.md, décisions du 8 novembre 2026).
//
// - Profondeur de champ : chaque rendu place l'œil en un point du disque d'ouverture et décentre le
//   cadrage pour garder fixe le plan de netteté. Ce modèle d'œil déplacé donne un flou plus petit que
//   la formule des lentilles minces d'un facteur (S − f) / S ; on élargit donc le disque de S / (S − f)
//   pour retrouver c = A × f × |D − S| / (D × (S − f)), avec A = f / N.
// - Flou de mouvement : chaque rendu correspond à un instant du temps de pose (horloge de la scène).
// - Moyenne en lumière linéaire, en virgule flottante ; puis exposition 2^écart, bruit du capteur
//   (camera/noise.ts), écrêtage au blanc et courbe de Babylon (puissance 1/2,2), comme dans le viseur.
// - Nombre de rendus : de quoi espacer les copies d'un grand flou de 4 px au plus (espacement estimé
//   à 0,9 × flou / √M sur un disque, flou / M le long d'un mouvement), de 16 à 256, et 5 s au plus.
// - Lissage : flou résiduel de rayon 0,45 × flou / √M, selon la profondeur de la vue centrale. Le
//   rayon ne dépendant que de cette profondeur, lisser la moyenne revient à lisser chaque rendu.
// - Loupe de l'écran de revue : la même photo (même instant, même orientation, même mise au point) est
//   recalculée sur une fenêtre de l'image, à la définition du capteur. La fenêtre est obtenue en
//   resserrant la projection : x' = (x − centre) / demi-largeur, en coordonnées normalisées.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Constants } from "@babylonjs/core/Engines/constants";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { EffectRenderer, EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";
import "@babylonjs/core/Shaders/postprocess.vertex";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import type { Body } from "./bodies";
import { NOISE_GLSL, NOISE_UNIFORMS, bindNoise, noiseParameters } from "./noise";

/** Hauteur de l'œil au-dessus du sol et rayon de la sphère du fond (scene.ts), en mètres. */
export interface GroundInfo {
  eyeHeight: number;
  domeRadius: number;
}

/** Grand côté de la photo, en pixels. */
export const PHOTO_LONG_SIDE = 1500;
const MAX_SPACING_PX = 4;
const MIN_SAMPLES = 16;
const MAX_SAMPLES = 256;
const TIME_BUDGET_MS = 5000;
/** Angle d'or, en radians : π × (3 − √5). Répartit régulièrement les points sur le disque. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export interface SceneTimeControl {
  /** Fige l'horloge de la scène et la place à l'instant donné, en secondes. */
  setFrozenTime(time: number): void;
  /** Rend la main à l'horloge, qui repart de l'instant donné. */
  release(time: number): void;
  /** Instant présent de l'horloge, en secondes. */
  now(): number;
  /** Décalage de l'œil dans le repère monde, en mètres (null : œil au centre de l'objectif). */
  setEyeOffset(offset: Vector3 | null): void;
  /** Sujets en mouvement : position et vitesse, pour estimer le flou de mouvement. */
  movers(): { position: Vector3; speed: number }[];
}

export interface PhotoRequest {
  body: Body;
  focalMm: number;
  aperture: number;
  shutterSeconds: number;
  /** Sensibilité ISO exacte (camera/exposure.ts). */
  iso: number;
  /** Multiplicateur d'exposition : 2^écart (camera/exposure.ts). */
  exposure: number;
  /** Point de mise au point dans le cadre, de 0 à 1 (0, 0 en haut à gauche). */
  focusPoint: { x: number; y: number };
  portrait: boolean;
  /**
   * Image à calculer : grand côté de l'image complète, en pixels, et fenêtre de cette image (par défaut, toute
   * l'image de PHOTO_LONG_SIDE pixels).
   */
  view?: { longSide: number; crop?: PhotoWindow };
  /** Recalcul d'une photo déjà prise (loupe) : même instant, même orientation, même mise au point. */
  replay?: PhotoReplay;
}

/** Fenêtre de l'image complète, en pixels, origine en haut à gauche. */
export interface PhotoWindow {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PhotoReplay {
  /** Début du temps de pose, sur l'horloge de la scène. */
  t0: number;
  /** Orientation de l'appareil au déclenchement. */
  rotation: Vector3;
  focusDistance: number;
}

export interface PhotoResult {
  url: string;
  width: number;
  height: number;
  samples: number;
  plannedSamples: number;
  milliseconds: number;
  focusDistance: number;
  /** De quoi recalculer une fenêtre de cette photo (loupe). */
  replay: PhotoReplay;
  /** Dimensions de l'image complète, en pixels. */
  fullWidth: number;
  fullHeight: number;
}

const ACCUMULATE = `
precision highp float;
varying vec2 vUV;
uniform sampler2D accumulated;
uniform sampler2D sampleTexture;
uniform float first;
void main(void) {
  vec3 previous = first > 0.5 ? vec3(0.0) : texture2D(accumulated, vUV).rgb;
  gl_FragColor = vec4(previous + texture2D(sampleTexture, vUV).rgb, 1.0);
}`;

const FINISH = `
precision highp float;
varying vec2 vUV;
uniform sampler2D accumulated;
uniform sampler2D depthSampler;
uniform float invSamples;
uniform float exposure;
uniform float cocScale;
uniform float focusDistance;
uniform float smoothingFactor;
uniform vec2 texelSize;
uniform vec2 projectionScale;
uniform vec2 projectionOffset;
uniform vec3 upInCamera;
uniform float eyeHeight;
uniform float domeDistance;
${NOISE_GLSL}
const float GOLDEN_ANGLE = 2.39996323;
void main(void) {
  float z = max(texture2D(depthSampler, vUV).r, 0.001);
  // Le sol de la photo n'est pas dans la carte de profondeur : distance du plan du sol le long du rayon.
  if (z > domeDistance) {
    vec3 ray = vec3((vUV.x * 2.0 - 1.0 - projectionOffset.x) / projectionScale.x, (vUV.y * 2.0 - 1.0 - projectionOffset.y) / projectionScale.y, 1.0);
    float slope = dot(upInCamera, ray);
    if (slope < 0.0) z = min(z, -eyeHeight / slope);
  }
  float coc = cocScale * abs(z - focusDistance) / z;
  float radius = smoothingFactor * coc;
  vec3 sum = vec3(0.0);
  if (radius < 0.5) {
    sum = texture2D(accumulated, vUV).rgb;
  } else {
    radius = min(radius, 12.0);
    for (int i = 0; i < 16; i++) {
      float r = radius * sqrt((float(i) + 0.5) / 16.0);
      float a = float(i) * GOLDEN_ANGLE;
      sum += texture2D(accumulated, vUV + vec2(cos(a), sin(a)) * r * texelSize).rgb;
    }
    sum /= 16.0;
  }
  // Bruit du capteur, ajouté après le flou optique et avant l'écrêtage, comme sur un capteur.
  vec3 color = clamp(addSensorNoise(sum * invSamples * exposure, gl_FragCoord.xy), 0.0, 1.0);
  gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}`;

/**
 * Distance du plan du sol le long du rayon qui passe par le point donné du cadre (de 0 à 1, origine en
 * haut à gauche), en z dans le repère de la caméra ; Infinity si le rayon ne descend pas.
 */
function groundDepth(projection: Matrix, upInCamera: Vector3, ground: GroundInfo, point: { x: number; y: number }): number {
  const m = projection.asArray();
  const ray = new Vector3((point.x * 2 - 1 - m[8]) / m[0], (1 - point.y * 2 - m[9]) / m[5], 1);
  const slope = Vector3.Dot(upInCamera, ray);
  return slope < 0 ? Math.min(ground.domeRadius, -ground.eyeHeight / slope) : Infinity;
}

export async function takePhoto(
  engine: Engine,
  scene: Scene,
  camera: UniversalCamera,
  time: SceneTimeControl,
  ground: GroundInfo,
  request: PhotoRequest,
  onProgress: (fraction: number) => void,
): Promise<PhotoResult> {
  const started = performance.now();
  const longSide = request.view?.longSide ?? PHOTO_LONG_SIDE;
  const shortSide = Math.round((longSide * request.body.sensorHeightMm) / request.body.sensorWidthMm);
  const fullWidth = request.portrait ? shortSide : longSide;
  const fullHeight = request.portrait ? longSide : shortSide;
  const crop = request.view?.crop ?? { left: 0, top: 0, width: fullWidth, height: fullHeight };
  const width = crop.width;
  const height = crop.height;
  // L'horloge repart de l'instant présent ; une photo recalculée reprend l'instant et l'orientation du déclenchement.
  const resumeAt = time.now();
  const t0 = request.replay ? request.replay.t0 : resumeAt;
  const savedRotation = camera.rotation.clone();
  if (request.replay) {
    camera.rotation.copyFrom(request.replay.rotation);
    camera.getViewMatrix(true);
  }
  const f = request.focalMm / 1000; // mètres
  const sensorLong = request.body.sensorWidthMm / 1000;
  const sensorShort = request.body.sensorHeightMm / 1000;

  // Projection de la photo : le cadre couvre exactement le capteur ; puis resserrée sur la fenêtre calculée.
  const fovVertical = 2 * Math.atan((request.portrait ? sensorLong : sensorShort) / (2 * f));
  const full = Matrix.PerspectiveFovLH(fovVertical, fullWidth / fullHeight, camera.minZ, camera.maxZ, engine.isNDCHalfZRange, 0, engine.useReverseDepthBuffer);
  const x0 = (crop.left / fullWidth) * 2 - 1;
  const x1 = ((crop.left + crop.width) / fullWidth) * 2 - 1;
  const yTop = 1 - (crop.top / fullHeight) * 2;
  const yBottom = 1 - ((crop.top + crop.height) / fullHeight) * 2;
  const windowed = (values: ArrayLike<number>): Matrix => {
    const m = Array.from(values);
    const sx = (x1 - x0) / 2;
    const sy = (yTop - yBottom) / 2;
    m[0] /= sx;
    m[8] = (m[8] - (x0 + x1) / 2) / sx;
    m[5] /= sy;
    m[9] = (m[9] - (yTop + yBottom) / 2) / sy;
    return Matrix.FromArray(m);
  };
  const base = windowed(full.asArray());
  const imageProcessing = scene.imageProcessingConfiguration;
  const processingWasByPostProcess = imageProcessing.applyByPostProcess;

  const color = new RenderTargetTexture("photo-rendu", { width, height }, scene, {
    type: Constants.TEXTURETYPE_HALF_FLOAT,
    generateMipMaps: false,
    generateDepthBuffer: true,
  });
  const accumulation = [0, 1].map(
    (i) =>
      new RenderTargetTexture(`photo-somme-${i}`, { width, height }, scene, {
        type: Constants.TEXTURETYPE_FLOAT,
        generateMipMaps: false,
        generateDepthBuffer: false,
      }),
  );
  const output = new RenderTargetTexture("photo-sortie", { width, height }, scene, {
    type: Constants.TEXTURETYPE_UNSIGNED_BYTE,
    generateMipMaps: false,
    generateDepthBuffer: false,
  });
  const effectRenderer = new EffectRenderer(engine);
  const accumulate = new EffectWrapper({ engine, name: "photo-accumulation", fragmentShader: ACCUMULATE, samplers: ["accumulated", "sampleTexture"], uniforms: ["first"] });
  const finish = new EffectWrapper({
    engine,
    name: "photo-finition",
    fragmentShader: FINISH,
    samplers: ["accumulated", "depthSampler", "noiseSampler"],
    uniforms: ["invSamples", "exposure", "cocScale", "focusDistance", "smoothingFactor", "texelSize", "projectionScale", "projectionOffset", "upInCamera", "eyeHeight", "domeDistance", ...NOISE_UNIFORMS],
  });

  try {
    camera.freezeProjectionMatrix(base);
    time.setFrozenTime(t0 + request.shutterSeconds / 2);

    // Profondeur de la vue centrale (z dans le repère de la caméra, en mètres), pour la mise au point, le
    // nombre de rendus et le lissage. On attend que ses shaders soient compilés : sinon Babylon saute
    // les objets au premier rendu et la carte reste vide.
    const depthRenderer = scene.enableDepthRenderer(camera, false, true, undefined, true);
    await scene.whenReadyAsync();
    scene.render();
    const depthMap = depthRenderer.getDepthMap();
    const depths = (await depthMap.readPixels(0, 0, null, true)) as Float32Array;
    // La carte reste celle de la vue centrale : plus de mise à jour pendant les rendus.
    depthMap.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    const mapSize = depthMap.getSize();

    // Distance de mise au point au point choisi, au déclenchement. Les pixels lus commencent par la ligne
    // du bas. Sur le sol de la photo, absent de la carte, on prend la distance du plan du sol.
    const upInCamera = Vector3.TransformNormal(Vector3.Up(), camera.getViewMatrix());
    const domeDistance = 0.8 * ground.domeRadius;
    const px = Math.min(mapSize.width - 1, Math.max(0, Math.round(request.focusPoint.x * (mapSize.width - 1))));
    const py = Math.min(mapSize.height - 1, Math.max(0, Math.round((1 - request.focusPoint.y) * (mapSize.height - 1))));
    let measured = depths[(py * mapSize.width + px) * 4];
    if (!(measured > camera.minZ) || measured > domeDistance) {
      measured = Math.min(ground.domeRadius, groundDepth(base, upInCamera, ground, request.focusPoint));
    }
    const focusDistance = request.replay ? request.replay.focusDistance : Math.max(measured, f * 1.01);
    let nearest = Infinity;
    for (let i = 0; i < depths.length; i += 4) if (depths[i] > camera.minZ) nearest = Math.min(nearest, depths[i]);
    // Le sol de la photo est le plus proche en bas du cadre.
    for (const x of [0, 0.5, 1]) nearest = Math.min(nearest, groundDepth(base, upInCamera, ground, { x, y: 1 }));

    // Flou de mise au point en pixels : c = A × f × |D − S| / (D × (S − f)), ramené à la largeur de l'image.
    const A = f / request.aperture;
    const pxPerMeter = longSide / sensorLong;
    const cocScale = ((A * f) / (focusDistance - f)) * pxPerMeter; // × |D − S| / D
    const cocAt = (d: number) => (cocScale * Math.abs(d - focusDistance)) / d;
    const cocMax = Math.max(cocScale, Number.isFinite(nearest) ? cocAt(nearest) : 0); // cocScale : flou à l'infini
    // Traînée la plus longue d'un sujet en mouvement, vu de face : v × t × f / D.
    const view = camera.getViewMatrix();
    let trail = 0;
    for (const m of time.movers()) {
      const depth = Vector3.TransformCoordinates(m.position, view).z;
      if (depth > 0.1) trail = Math.max(trail, ((m.speed * request.shutterSeconds * f) / depth) * pxPerMeter);
    }
    const planned = Math.min(
      MAX_SAMPLES,
      Math.max(MIN_SAMPLES, Math.ceil(((0.9 * cocMax) / MAX_SPACING_PX) ** 2), Math.ceil(trail / MAX_SPACING_PX)),
    );

    // Disque d'ouverture élargi de S / (S − f) (voir l'en-tête), et repère de l'objectif.
    const lensRadius = (A / 2) * (focusDistance / (focusDistance - f));
    const right = camera.getDirection(Axis.X);
    const up = camera.getDirection(Axis.Y);
    // Permutation des instants, décorrélée des positions sur le disque : pas premier avec planned.
    let stride = Math.max(1, Math.round(planned * 0.618));
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    while (gcd(stride, planned) !== 1) stride++;

    // Rendus en lumière linéaire. Le traitement d'image des matériaux passe en gamma et écrête à 1, même
    // désactivé (applyImageProcessing, pbrBlockImageProcessing) ; avec applyByPostProcess, ils rendent la
    // lumière linéaire, plafonnée à 30. Les matériaux recompilent leurs shaders : on attend qu'ils soient prêts.
    imageProcessing.applyByPostProcess = true;
    await scene.whenReadyAsync();
    camera.outputRenderTarget = color;
    let done = 0;
    for (let i = 0; i < planned; i++) {
      const r = lensRadius * Math.sqrt((i + 0.5) / planned);
      const a = i * GOLDEN_ANGLE;
      const dx = r * Math.cos(a);
      const dy = r * Math.sin(a);
      // Projection décentrée : x_ndc = x × m0 / z + m8 ; m8 = dx × m0 / S garde fixe le plan z = S.
      const m = Array.from(full.asArray());
      m[8] += (dx * m[0]) / focusDistance;
      m[9] += (dy * m[5]) / focusDistance;
      camera.freezeProjectionMatrix(windowed(m));
      time.setEyeOffset(right.scale(dx).add(up.scale(dy)));
      time.setFrozenTime(t0 + request.shutterSeconds * ((((i * stride) % planned) + 0.5) / planned));
      scene.render();

      const source = accumulation[i % 2];
      const target = accumulation[(i + 1) % 2];
      accumulate.onApplyObservable.addOnce(() => {
        accumulate.effect.setTexture("accumulated", source);
        accumulate.effect.setTexture("sampleTexture", color);
        accumulate.effect.setFloat("first", i === 0 ? 1 : 0);
      });
      effectRenderer.render(accumulate, target);
      done = i + 1;
      if (performance.now() - started > TIME_BUDGET_MS) break;
      if (i % 4 === 3) {
        onProgress(done / planned);
        await new Promise(requestAnimationFrame);
      }
    }

    const sum = accumulation[done % 2];
    finish.onApplyObservable.addOnce(() => {
      const e = finish.effect;
      e.setTexture("accumulated", sum);
      e.setTexture("depthSampler", depthMap);
      e.setFloat("invSamples", 1 / done);
      e.setFloat("exposure", request.exposure);
      e.setFloat("cocScale", cocScale);
      e.setFloat("focusDistance", focusDistance);
      e.setFloat("smoothingFactor", 0.45 / Math.sqrt(done));
      e.setFloat2("texelSize", 1 / width, 1 / height);
      const bm = base.asArray();
      e.setFloat2("projectionScale", bm[0], bm[5]);
      e.setFloat2("projectionOffset", bm[8], bm[9]);
      e.setFloat3("upInCamera", upInCamera.x, upInCamera.y, upInCamera.z);
      e.setFloat("eyeHeight", ground.eyeHeight);
      e.setFloat("domeDistance", domeDistance);
      bindNoise(e, scene, noiseParameters(request.body, request.iso, fullWidth * fullHeight));
    });
    effectRenderer.render(finish, output);
    const pixels = (await output.readPixels()) as Uint8Array;

    // Les lignes lues commencent par le bas : on les retourne.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d")!;
    const image = context.createImageData(width, height);
    const rowBytes = width * 4;
    for (let y = 0; y < height; y++) {
      image.data.set(pixels.subarray((height - 1 - y) * rowBytes, (height - y) * rowBytes), y * rowBytes);
    }
    context.putImageData(image, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Photo vide"))), "image/jpeg", 0.92),
    );
    onProgress(1);
    return {
      url: URL.createObjectURL(blob),
      width,
      height,
      samples: done,
      plannedSamples: planned,
      milliseconds: performance.now() - started,
      focusDistance,
      replay: { t0, rotation: camera.rotation.clone(), focusDistance },
      fullWidth,
      fullHeight,
    };
  } finally {
    scene.disableDepthRenderer(camera);
    camera.outputRenderTarget = null;
    camera.unfreezeProjectionMatrix();
    imageProcessing.applyByPostProcess = processingWasByPostProcess;
    time.setEyeOffset(null);
    camera.rotation.copyFrom(savedRotation);
    time.release(resumeAt);
    color.dispose();
    for (const texture of accumulation) texture.dispose();
    output.dispose();
    accumulate.dispose();
    finish.dispose();
    effectRenderer.dispose();
  }
}
