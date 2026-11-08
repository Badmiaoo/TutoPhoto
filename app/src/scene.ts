// Scène de parc de la V1 minimale (décision du 8 novembre 2026, docs/historique.md).
// Le fond et l'éclairage viennent d'une photo à 360° (autumn_hockey, Poly Haven, CC0) ;
// seul le premier plan est en 3D. L'appareil reste au point de prise de vue de la photo :
// on tourne et on zoome, on ne s'y déplace pas. Unités : 1 unité de scène = 1 mètre.
// Auteurs, licences et adresses d'origine : public/scenes/parc/scene.json.

import type { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import type { FreeCameraTouchInput } from "@babylonjs/core/Cameras/Inputs/freeCameraTouchInput";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { BackgroundMaterial } from "@babylonjs/core/Materials/Background/backgroundMaterial";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { PhotoDome } from "@babylonjs/core/Helpers/photoDome";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import "@babylonjs/loaders/glTF/2.0";
// Effet de bord requis par Babylon (matériau par défaut des maillages).
import "@babylonjs/core/Materials/standardMaterial";

const SCENE_URL = "scenes/parc/";

/** Hauteur de l'œil, en mètres. Poly Haven ne publie pas la hauteur de prise de vue : valeur supposée. */
const EYE_HEIGHT = 1.6;

/**
 * Champ d'un 50 mm sur plein format (24 × 36 mm), le long du grand côté : 2 × atan(36 / (2 × 50)) ≈ 39,6°.
 * Appliqué au grand côté de l'écran, comme un appareil tenu à l'horizontale ou à la verticale.
 */
const FOV_50MM = 2 * Math.atan(36 / (2 * 50));

/**
 * Rotation du fond autour de la verticale. Mesurée le 8 novembre 2026 en comparant, dans la même
 * direction, la photo affichée en fond et le fichier HDR d'éclairage : avec un quart de tour,
 * les deux montrent la même haie et les mêmes arbres.
 */
const DOME_ROTATION = Math.PI / 2;

export interface ParkScene {
  scene: Scene;
  /** Résolue quand tous les fichiers de la scène sont chargés. */
  ready: Promise<void>;
}

export function createScene(engine: Engine, canvas: HTMLCanvasElement): ParkScene {
  const scene = new Scene(engine);

  const eye = new Vector3(0, EYE_HEIGHT, 0);
  const camera = new UniversalCamera("appareil", eye.clone(), scene);
  camera.fov = FOV_50MM;
  const fitFov = (): void => {
    const landscape = engine.getRenderWidth() >= engine.getRenderHeight();
    camera.fovMode = landscape ? Camera.FOVMODE_HORIZONTAL_FIXED : Camera.FOVMODE_VERTICAL_FIXED;
  };
  fitFov();
  engine.onResizeObservable.add(fitFov);
  camera.minZ = 0.05;
  camera.maxZ = 2000;
  camera.setTarget(new Vector3(0, EYE_HEIGHT - 0.1, 10));
  // On tourne seulement : pas de clavier, de molette ni de manette, qui déplaceraient l'appareil.
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.removeByType("FreeCameraMouseWheelInput");
  camera.inputs.removeByType("FreeCameraGamepadInput");
  const touch = camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
  if (touch) touch.singleFingerRotate = true;
  camera.angularSensibility = 4000;
  camera.attachControl(canvas, true);
  scene.onBeforeRenderObservable.add(() => {
    camera.position.copyFrom(eye);
    camera.rotation.x = Math.min(0.7, Math.max(-0.7, camera.rotation.x));
  });

  // Fond : la photo à 360° en 8192 × 4096 px. Babylon la réduit si l'appareil n'accepte pas cette taille.
  const dome = new PhotoDome(
    "fond",
    `${SCENE_URL}autumn_hockey/autumn_hockey.jpg`,
    { resolution: 64, size: 1000 },
    scene,
  );
  dome.mesh.rotation.y = DOME_ROTATION;

  // Éclairage et reflets : la même prise de vue en HDR (1024 × 512 px), qui garde les hautes lumières.
  const environment = new HDRCubeTexture(
    `${SCENE_URL}autumn_hockey/autumn_hockey_1k.hdr`,
    scene,
    256,
    false,
    true,
    false,
    true,
  );
  scene.environmentTexture = environment;

  // Ombres de contact : un sol invisible qui ne reçoit que les ombres, sous une lumière presque zénithale
  // qui n'éclaire rien (intensité nulle) et ne sert qu'à projeter les ombres. Ciel couvert : ombres
  // floues. La lumière penche un peu vers l'appareil pour que l'ombre déborde devant les objets.
  // Réglage choisi à l'œil le 8 novembre 2026, à revoir avec la caméra physique.
  const sun = new DirectionalLight("ciel", new Vector3(0.1, -1, -0.3), scene);
  sun.intensity = 0;
  sun.position = new Vector3(0, 20, 0);
  const shadows = new ShadowGenerator(1024, sun);
  shadows.useBlurExponentialShadowMap = true;
  shadows.blurKernel = 16;
  // Opacité de l'ombre : 1 - darkness, soit 45 %.
  shadows.darkness = 0.55;
  const ground = CreateGround("sol", { width: 40, height: 40 }, scene);
  const groundMaterial = new BackgroundMaterial("sol", scene);
  // En mode shadowOnly, Babylon peint l'ombre avec primaryColor, opaque là où l'ombre est complète.
  groundMaterial.shadowOnly = true;
  groundMaterial.primaryColor = new Color3(0, 0, 0);
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  const place = (meshes: AbstractMesh[], x: number, z: number, rotationY: number): void => {
    const root = meshes[0];
    root.position = new Vector3(x, 0, z);
    root.rotationQuaternion = null;
    root.rotation = new Vector3(0, rotationY, 0);
    for (const mesh of meshes) shadows.addShadowCaster(mesh, false);
  };

  const ready = Promise.all([
    ImportMeshAsync(`${SCENE_URL}painted_wooden_bench/painted_wooden_bench_1k.gltf`, scene).then((r) =>
      place(r.meshes, -1.8, 6.5, 0.35),
    ),
    ImportMeshAsync(`${SCENE_URL}metal_trash_can/metal_trash_can_1k.gltf`, scene).then((r) =>
      place(r.meshes, 1.6, 7.5, Math.PI - 0.3),
    ),
    new Promise<void>((resolve, reject) => {
      dome.onLoadObservable.addOnce(() => resolve());
      dome.onLoadErrorObservable.addOnce((message) => reject(new Error(message)));
    }),
  ]).then(() => scene.whenReadyAsync());

  return { scene, ready };
}
