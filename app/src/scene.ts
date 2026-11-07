// Scène de départ : un sol, une sphère de repère, une lumière et une caméra orbitale.
// La scène de parc et la caméra physique viendront dans les étapes suivantes.

import type { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.62, 0.78, 0.92, 1);

  // Unités : 1 unité de scène = 1 mètre.
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.4, 6, new Vector3(0, 1, 0), scene);
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 30;
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("ciel", new Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  const grass = new StandardMaterial("herbe", scene);
  grass.diffuseColor = new Color3(0.33, 0.55, 0.25);
  const ground = CreateGround("sol", { width: 40, height: 40 }, scene);
  ground.material = grass;

  const marker = new StandardMaterial("repere", scene);
  marker.diffuseColor = new Color3(0.85, 0.85, 0.85);
  const sphere = CreateSphere("repere", { diameter: 1, segments: 32 }, scene);
  sphere.position.y = 0.5;
  sphere.material = marker;

  return scene;
}
