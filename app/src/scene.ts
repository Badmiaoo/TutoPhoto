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
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { SceneTimeControl } from "./camera/photo";
import "@babylonjs/loaders/glTF/2.0";
// Effet de bord requis par Babylon (matériau par défaut des maillages).
import "@babylonjs/core/Materials/standardMaterial";

const SCENE_URL = "scenes/parc/";

/** Hauteur de l'œil, en mètres. Poly Haven ne publie pas la hauteur de prise de vue : valeur supposée. */
export const EYE_HEIGHT = 1.6;

/** Rayon de la sphère du fond, en mètres : la photo est vue comme si elle était à 500 m. */
export const DOME_RADIUS = 500;

/**
 * Rotation du fond autour de la verticale. Mesurée le 8 novembre 2026 en comparant, dans la même
 * direction, la photo affichée en fond et le fichier HDR d'éclairage : avec un quart de tour,
 * les deux montrent la même haie et les mêmes arbres.
 */
const DOME_ROTATION = Math.PI / 2;

export interface ParkScene {
  scene: Scene;
  /** Caméra 3D de l'appareil : son champ de vue est réglé par le boîtier virtuel (camera/viewfinder.ts). */
  camera: UniversalCamera;
  /** Résolue quand tous les fichiers de la scène sont chargés. */
  /** Noms des objets pas encore prêts si la scène s'affiche après le délai ; vide sinon. */
  ready: Promise<string[]>;
  /** Horloge, position de l'œil et sujets en mouvement, pour la photo calculée (camera/photo.ts). */
  time: SceneTimeControl;
}

/** Délai au-delà duquel la scène s'affiche même si Babylon ne la déclare pas prête, en millisecondes. */
const READY_TIMEOUT_MS = 30000;

/**
 * Attend que Babylon déclare la scène prête. Au-delà de READY_TIMEOUT_MS, on affiche quand même, et l'on
 * renvoie les noms des objets qui ne sont pas prêts, pour le diagnostic.
 */
async function readyOrLate(scene: Scene): Promise<string[]> {
  const ready = scene.whenReadyAsync().then(() => true);
  const late = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), READY_TIMEOUT_MS));
  if (await Promise.race([ready, late])) return [];
  const waiting = scene.meshes.filter((mesh) => mesh.isEnabled() && !mesh.isReady(true)).map((mesh) => mesh.name);
  return waiting.length > 0 ? waiting : ["?"];
}

export function createScene(engine: Engine, canvas: HTMLCanvasElement): ParkScene {
  const scene = new Scene(engine);

  const eye = new Vector3(0, EYE_HEIGHT, 0);
  const camera = new UniversalCamera("appareil", eye.clone(), scene);
  camera.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED;
  camera.minZ = 0.05;
  camera.maxZ = 2000;
  camera.setTarget(new Vector3(0, EYE_HEIGHT - 0.6, 10));
  // On tourne seulement : pas de clavier, de molette ni de manette, qui déplaceraient l'appareil.
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.removeByType("FreeCameraMouseWheelInput");
  camera.inputs.removeByType("FreeCameraGamepadInput");
  const touch = camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
  if (touch) touch.singleFingerRotate = true;
  camera.angularSensibility = 4000;
  camera.attachControl(canvas, true);
  // Horloge de la scène : positions et animations sont calculées à partir de l'instant présent, si bien
  // que la photo peut placer la scène à n'importe quel instant du temps de pose.
  let clock = 0;
  let frozen = false;
  let eyeOffset: Vector3 | null = null;
  const animations: { group: AnimationGroup; from: number; to: number; fps: number }[] = [];
  const walkers: { holder: TransformNode; speed: number; minX: number; maxX: number; phase: number }[] = [];

  /** Aller-retour à vitesse constante entre minX et maxX : position et sens à l'instant donné. */
  const applyTime = (time: number): void => {
    for (const w of walkers) {
      const span = w.maxX - w.minX;
      const travelled = (((w.speed * time + w.phase) % (2 * span)) + 2 * span) % (2 * span);
      const forward = travelled < span;
      w.holder.position.x = forward ? w.minX + travelled : w.maxX - (travelled - span);
      w.holder.rotation.y = forward ? Math.PI / 2 : -Math.PI / 2;
    }
    for (const a of animations) {
      const length = a.to - a.from;
      a.group.goToFrame(a.from + ((((time * a.fps) % length) + length) % length));
    }
  };

  scene.onBeforeRenderObservable.add(() => {
    if (!frozen) clock += Math.min(engine.getDeltaTime(), 100) / 1000;
    applyTime(clock);
    camera.position.copyFrom(eye);
    if (eyeOffset) camera.position.addInPlace(eyeOffset);
    camera.rotation.x = Math.min(0.7, Math.max(-0.7, camera.rotation.x));
  });

  /** Lance une animation en boucle, pilotée par l'horloge. */
  const animate = (group: AnimationGroup): void => {
    group.start(true);
    group.pause();
    animations.push({ group, from: group.from, to: group.to, fps: group.targetedAnimations[0]?.animation.framePerSecond ?? 30 });
  };

  const time: SceneTimeControl = {
    setFrozenTime(t) {
      frozen = true;
      clock = t;
    },
    release(t) {
      clock = t;
      frozen = false;
    },
    now: () => clock,
    setEyeOffset(offset) {
      eyeOffset = offset;
    },
    movers: () => walkers.map((w) => ({ position: w.holder.position.clone(), speed: w.speed })),
  };

  // Fond : la photo à 360° en 8192 × 4096 px. Babylon la réduit si l'appareil n'accepte pas cette taille.
  // Projection du sol : le bas de la photo est lu comme un sol plat, à la hauteur de l'œil sous le centre
  // de la sphère, si bien qu'il garde sa distance quand l'œil se déplace sur l'ouverture (photo calculée).
  const dome = new PhotoDome(
    "fond",
    `${SCENE_URL}autumn_hockey/autumn_hockey.jpg`,
    { resolution: 64, size: 2 * DOME_RADIUS },
    scene,
  );
  dome.mesh.rotation.y = DOME_ROTATION;
  dome.material.enableGroundProjection = true;
  dome.material.projectedGroundRadius = DOME_RADIUS;
  dome.material.projectedGroundHeight = EYE_HEIGHT;

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

  /**
   * Charge un modèle glTF sous un nœud porteur qu'on place, tourne et met à l'échelle ; le nœud racine
   * créé par Babylon garde sa conversion de repère. Angle 0 : le modèle regarde vers +Z, à l'opposé de
   * l'appareil ; π : il regarde l'appareil.
   */
  const load = async (path: string, x: number, z: number, rotationY: number, scale = 1) => {
    const result = await ImportMeshAsync(`${SCENE_URL}${path}`, scene);
    const holder = new TransformNode(path, scene);
    result.meshes[0].parent = holder;
    holder.position.set(x, 0, z);
    holder.rotation.y = rotationY;
    holder.scaling.setAll(scale);
    for (const mesh of result.meshes) shadows.addShadowCaster(mesh, false);
    return { holder, result };
  };

  // Personnages Renderpeople : modèles en centimètres, d'où l'échelle 0,01.
  const CM = 0.01;

  const ready = Promise.all([
    load("painted_wooden_bench/painted_wooden_bench_1k.gltf", -3.4, 8, 0.35 - Math.PI),
    load("metal_trash_can/metal_trash_can_1k.gltf", 3.2, 10.5, -0.3),
    // Groupe (SIT-05) et portrait (SIT-01), face à l'appareil.
    load("dennis_posed_004/scene.gltf", -1.0, 6.5, Math.PI, CM),
    load("sophia_animated_003/scene.gltf", -0.2, 6.6, Math.PI, CM).then(({ result }) => {
      for (const group of result.animationGroups) animate(group);
    }),
    load("fabienne_percy_posed_001/scene.gltf", 0.75, 6.5, Math.PI, CM),
    // Homme qui marche en arrière-plan. Vitesse mesurée dans l'animation (8 novembre 2026) : pendant
    // l'appui, le pied posé recule de 1,23 à 1,27 m/s selon le pied et le point mesuré.
    load("nathan_animated_003/scene.gltf", -4, 12.5, Math.PI / 2, CM).then(({ holder, result }) => {
      for (const group of result.animationGroups) animate(group);
      walkers.push({ holder, speed: 1.25, minX: -5, maxX: 5, phase: 1 });
    }),
    // Chien qui court (SIT-06). Le fichier contient deux chiens : on ne garde que « Jim », qui galope.
    // Échelle : 0,6 m au garrot, valeur choisie ; l'épaule de Jim est à 2,05 unités du sol, soit
    // 0,6 / 2,05 ≈ 0,29 m par unité. Décalage : ramène Jim au centre et ses pattes au sol (mesuré).
    // Vitesse, estimée dans l'animation : pendant l'appui, la patte posée recule de 2,4 à 13,3 unités/s
    // selon la patte (médiane 10,6 ; deux pattes concordent vers 13), soit 3,1 à 3,9 m/s entre la médiane
    // et la valeur concordante. 3,5 m/s retenu ; mesure imprécise, à revoir.
    load("alaskan_malamute/scene.gltf", -5, 9, Math.PI / 2, 0.6 / 2.05).then(({ holder, result }) => {
      result.meshes[0].position.set(0.87, 2.45, 0.11);
      for (const node of result.transformNodes) {
        if (node.name === "Armature Ethan" || node.name === "Ethan") node.dispose();
      }
      for (const group of result.animationGroups) {
        if (group.name === "Jim canter") animate(group);
        else group.dispose();
      }
      walkers.push({ holder, speed: 3.5, minX: -5, maxX: 5, phase: 0 });
    }),
    new Promise<void>((resolve, reject) => {
      dome.onLoadObservable.addOnce(() => resolve());
      dome.onLoadErrorObservable.addOnce((message) => reject(new Error(message)));
    }),
  ]).then(() => readyOrLate(scene));

  return { scene, camera, ready, time };
}
