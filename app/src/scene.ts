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
import type { FaceSubject } from "./camera/faces";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { SceneTimeControl } from "./camera/photo";
import "@babylonjs/loaders/glTF/2.0";
// Effet de bord requis par Babylon (matériau par défaut des maillages).
import "@babylonjs/core/Materials/standardMaterial";

// Relatif au simulateur (simulateur/index.html, version 0.3.46) : la scène est dans scenes/ à la racine du site.
const SCENE_URL = "../scenes/parc/";

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

/** Repère de la vue de dessus (ui/topView.ts) : objet ou personnage immobile, position au sol en mètres. */
export interface Landmark {
  id: string;
  kind: "person" | "object";
  x: number;
  z: number;
}

/**
 * Objets et personnages immobiles de la scène, aux positions où ils sont chargés. Le promeneur et le chien
 * bougent : leur position vient de time.movers().
 */
export const LANDMARKS: readonly Landmark[] = [
  { id: "bench", kind: "object", x: -3.4, z: 8 },
  { id: "bin", kind: "object", x: 3.2, z: 10.5 },
  { id: "dennis", kind: "person", x: -1.0, z: 6.5 },
  { id: "sophia", kind: "person", x: -0.2, z: 6.6 },
  { id: "fabienne-percy", kind: "person", x: 0.75, z: 6.5 },
];
const place = (id: string): Landmark => LANDMARKS.find((l) => l.id === id)!;

/** Position de l'appareil au sol (NET-06), en mètres ; l'œil reste à EYE_HEIGHT. */
export interface EyeControl {
  get(): { x: number; z: number };
  set(x: number, z: number): void;
}

export interface ParkScene {
  scene: Scene;
  /** Caméra 3D de l'appareil : son champ de vue est réglé par le boîtier virtuel (camera/viewfinder.ts). */
  camera: UniversalCamera;
  /** Résolue quand tous les fichiers de la scène sont chargés. */
  /** Noms des objets pas encore prêts si la scène s'affiche après le délai ; vide sinon. */
  ready: Promise<string[]>;
  /** Horloge, position de l'œil et sujets en mouvement, pour la photo calculée (camera/photo.ts). */
  time: SceneTimeControl;
  /** Visages et yeux des personnages et du chien, pour l'AF zone automatique (camera/faces.ts). */
  subjects: FaceSubject[];
  /** Déplacement de l'appareil sur le sol (vue de dessus). */
  eye: EyeControl;
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
  const walkers: { id: string; holder: TransformNode; speed: number; minX: number; maxX: number; phase: number }[] = [];

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
    // Sens de marche : le porteur est tourné de +π/2 vers les x croissants, de −π/2 vers les x décroissants.
    movers: () =>
      walkers.map((w) => ({
        id: w.id,
        position: w.holder.position.clone(),
        speed: w.speed,
        velocity: new Vector3(Math.sign(w.holder.rotation.y) * w.speed, 0, 0),
      })),
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

  // Yeux, pour l'AF zone automatique. Sophia et Nathan ont un squelette avec des os pour les yeux. Les
  // modèles figés (Dennis, Fabienne et Percy) et le chien n'en ont pas : leurs yeux ont été placés à la main
  // le 9 novembre 2026, en visant la pupille sur une vue rapprochée de face et en lisant la profondeur à ce
  // pixel ; points vérifiés en les reprojetant sur une autre vue (et, pour le chien, à deux autres instants
  // du galop). Coordonnées dans le repère du porteur du modèle (centimètres), ou de l'os de la tête du chien.
  // L'œil gauche de Fabienne, collé à la joue de Percy dans cette pose, n'est pas placé.
  const subjects: FaceSubject[] = [];
  const localEyes = (node: TransformNode, points: [number, number, number][]) => () => {
    node.computeWorldMatrix(true);
    return points.map((p) => Vector3.TransformCoordinates(new Vector3(...p), node.getWorldMatrix()));
  };
  const spacing = (eyes: Vector3[]) => (eyes.length === 2 ? Vector3.Distance(eyes[0], eyes[1]) : 0);
  /** Écart des yeux mesuré sur Dennis (6,5 cm), pour Fabienne dont un seul œil est placé. */
  const ADULT_SPACING = 0.065;
  const boneEyes = (id: string, nodes: TransformNode[]) => {
    const eyes = nodes.filter((n) => /_eye_[lr]_\d+$/.test(n.name));
    if (eyes.length !== 2) return;
    const get = () =>
      eyes.map((n) => {
        n.computeWorldMatrix(true);
        return n.getAbsolutePosition().clone();
      });
    subjects.push({ id, kind: "human", eyes: get, eyeSpacing: spacing(get()) });
  };

  const ready = Promise.all([
    load("painted_wooden_bench/painted_wooden_bench_1k.gltf", place("bench").x, place("bench").z, 0.35 - Math.PI),
    load("metal_trash_can/metal_trash_can_1k.gltf", place("bin").x, place("bin").z, -0.3),
    // Groupe (SIT-05) et portrait (SIT-01), face à l'appareil.
    load("dennis_posed_004/scene.gltf", place("dennis").x, place("dennis").z, Math.PI, CM).then(({ holder }) => {
      const eyes = localEyes(holder, [
        [5.602, 169.306, 18.183],
        [-0.48, 168.615, 20.398],
      ]);
      subjects.push({ id: "dennis", kind: "human", eyes, eyeSpacing: spacing(eyes()) });
    }),
    load("sophia_animated_003/scene.gltf", place("sophia").x, place("sophia").z, Math.PI, CM).then(({ result }) => {
      for (const group of result.animationGroups) animate(group);
      boneEyes("sophia", result.transformNodes);
    }),
    load("fabienne_percy_posed_001/scene.gltf", place("fabienne-percy").x, place("fabienne-percy").z, Math.PI, CM).then(({ holder }) => {
      subjects.push({ id: "fabienne", kind: "human", eyes: localEyes(holder, [[10.071, 151.36, 9.096]]), eyeSpacing: ADULT_SPACING });
      const percy = localEyes(holder, [
        [4.106, 152.09, 15.159],
        [0.415, 151.445, 19.793],
      ]);
      subjects.push({ id: "percy", kind: "human", eyes: percy, eyeSpacing: spacing(percy()) });
    }),
    // Homme qui marche en arrière-plan. Vitesse mesurée dans l'animation (8 novembre 2026) : pendant
    // l'appui, le pied posé recule de 1,23 à 1,27 m/s selon le pied et le point mesuré.
    load("nathan_animated_003/scene.gltf", -4, 12.5, Math.PI / 2, CM).then(({ holder, result }) => {
      for (const group of result.animationGroups) animate(group);
      walkers.push({ id: "nathan", holder, speed: 1.25, minX: -5, maxX: 5, phase: 1 });
      boneEyes("nathan", result.transformNodes);
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
      walkers.push({ id: "jim", holder, speed: 3.5, minX: -5, maxX: 5, phase: 0 });
      // Os de la tête de Jim (nommé « Ethan_Head_013 » dans le fichier, sous la cible de tête de Jim).
      const head = result.transformNodes.find((node) => node.name === "Ethan_Head_013");
      if (head) {
        const eyes = localEyes(head, [
          [-0.1376, 0.4689, 0.0387],
          [0.1779, 0.4472, 0.0316],
        ]);
        subjects.push({ id: "jim", kind: "animal", eyes, eyeSpacing: spacing(eyes()) });
      }
    }),
    new Promise<void>((resolve, reject) => {
      dome.onLoadObservable.addOnce(() => resolve());
      dome.onLoadErrorObservable.addOnce((message) => reject(new Error(message)));
    }),
  ]).then(() => readyOrLate(scene));

  const eyeControl: EyeControl = {
    get: () => ({ x: eye.x, z: eye.z }),
    set(x, z) {
      eye.x = x;
      eye.z = z;
    },
  };
  return { scene, camera, ready, time, subjects, eye: eyeControl };
}
