// Tests rapides de camera/bulletin.ts (Sujet 26 du plan de corrections, constat ARC-05) : mesure d'un sujet (dans le
// cadre, profondeur, netteté, traînée) et critères des défis SIT-01, SIT-05 et SIT-06. Comportement attendu : en-tête
// du module et docs/camera-physique.md, « Défis et bulletin ». Les vecteurs et les matrices sont ceux de Babylon.js,
// qui se chargent sans navigateur ; une matrice de vue identité place l'appareil à l'origine, visant les z positifs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { findBody } from "../src/camera/bodies";
import { CHALLENGES, judgeChallenge, measureShot, measureThing, type SceneThing, type ShotGeometry } from "../src/camera/bulletin";
import { apertureValue } from "../src/camera/exposure";
import { blurLimitMm, sharpZone } from "../src/camera/sharpZone";
import { assertClose } from "./approx";

const z6 = findBody("nikon");
const BLUR_Z6 = blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm);

/** Vue du Z 6 : 50 mm, f/8, 1/100 s, mise au point à 6,6 m, cadre horizontal, appareil à l'origine. */
function geometry(options: Partial<Omit<ShotGeometry, "things">> = {}): Omit<ShotGeometry, "things"> {
  return {
    view: Matrix.Identity(),
    focalMm: 50,
    aperture: 8,
    shutterSeconds: 1 / 100,
    focusDistance: 6.6,
    sensorWidthMm: z6.sensorWidthMm,
    sensorHeightMm: z6.sensorHeightMm,
    portrait: false,
    ...options,
  };
}

/** Sujet immobile ou mobile, d'un point ou de plusieurs, en coordonnées de la scène (mètres). */
function thing(id: string, points: [number, number, number][], velocity: [number, number, number] = [0, 0, 0]): SceneThing {
  return { id, points: points.map(([x, y, z]) => new Vector3(x, y, z)), velocity: new Vector3(...velocity) };
}

test("netteté : profondeur le long de l'axe, entre les limites de la zone nette", () => {
  // 50 mm, f/8, mise au point à 6,6 m : zone d'environ 4,1 m à 16,6 m (docs/camera-physique.md, « Défis et bulletin »).
  const g = geometry();
  const zone = sharpZone(50, 8, 6.6, BLUR_Z6);
  for (const [z, sharp] of [[3, false], [4.5, true], [6.6, true], [10, true], [20, false]] as const) {
    const m = measureThing(thing("sophia", [[0, 0, z]]), g);
    assert.equal(m.inFrame, true, `${z} m`);
    assertClose(m.depth, z, 1e-12, `${z} m`);
    assert.equal(m.sharp, sharp, `${z} m, zone de ${zone.near.toFixed(2)} à ${zone.far.toFixed(2)} m`);
  }
  // La profondeur est la distance le long de l'axe de visée, pas la distance à l'appareil : appareil à 1,6 m du sol
  // visant l'horizontale, un point à 3 m sur le côté et 4 m devant est à 4 m de profondeur, et à 5 m de l'appareil.
  const eye = new Vector3(0, 1.6, 0);
  const aside = measureThing(thing("bench", [[3, 1.6, 4]]), geometry({ view: Matrix.LookAtLH(eye, new Vector3(0, 1.6, 10), Vector3.Up()), focalMm: 18 }));
  assertClose(aside.depth, 4, 1e-9, "profondeur le long de l'axe");
});

test("dans le cadre : x = f X / Z et y = f Y / Z dans les demi-côtés du capteur ; en cadre vertical, ils s'échangent", () => {
  // Demi-côtés du Z 6 : 17,95 mm et 11,95 mm. À 50 mm et 10 m, |X| ≤ 3,59 m et |Y| ≤ 2,39 m en cadre horizontal.
  const g = geometry();
  assert.equal(measureThing(thing("bin", [[3.5, 0, 10]]), g).inFrame, true);
  assert.equal(measureThing(thing("bin", [[3.7, 0, 10]]), g).inFrame, false);
  assert.equal(measureThing(thing("bin", [[0, 2.3, 10]]), g).inFrame, true);
  assert.equal(measureThing(thing("bin", [[0, 2.5, 10]]), g).inFrame, false);
  const portrait = geometry({ portrait: true });
  assert.equal(measureThing(thing("bin", [[3.5, 0, 10]]), portrait).inFrame, false);
  assert.equal(measureThing(thing("bin", [[2.3, 0, 10]]), portrait).inFrame, true);
  assert.equal(measureThing(thing("bin", [[0, 3.5, 10]]), portrait).inFrame, true);
});

test("plusieurs points : le plus proche donne la profondeur ; un seul dans le cadre suffit ; ceux de derrière ne comptent pas", () => {
  const g = geometry();
  // Le point à 6 m est hors du cadre (x = 50 × 5 / 6 ≈ 41,7 mm), celui à 8 m dedans.
  const m = measureThing(thing("dennis", [[0, 0, 8], [5, 0, 6]]), g);
  assert.equal(m.inFrame, true);
  assertClose(m.depth, 6, 1e-12, "point le plus proche");
  // Un point derrière l'appareil est ignoré.
  const half = measureThing(thing("dennis", [[0, 0, -2], [0, 0, 8]]), g);
  assertClose(half.depth, 8, 1e-12, "point derrière ignoré");
  // Aucun point devant : hors du cadre, profondeur infinie, ni net ni traînée.
  const behind = measureThing(thing("dennis", [[0, 0, -5]], [3, 0, 0]), g);
  assert.deepEqual(behind, { id: "dennis", inFrame: false, depth: Infinity, sharp: false, trailMm: 0, trailPx: 0, frozen: true });
});

test("traînée : f (vX Z − X vZ) / Z² × t sur le capteur ; figé si elle ne dépasse pas le flou acceptable", () => {
  // Chien à 3,5 m/s (vitesse de jim dans app/src/scene.ts), en travers, à 8 m, au 50 mm : 50 × 3,5 / 8 = 21,9 mm/s.
  const dog = thing("jim", [[0, 0.3, 8]], [3.5, 0, 0]);
  const at1000 = measureThing(dog, geometry({ shutterSeconds: 1 / 1000, focusDistance: 8 }));
  assertClose(at1000.trailMm, 0.021875, 1e-12, "à 1/1000 s");
  assert.equal(at1000.frozen, true, "0,0219 mm ≤ 0,0288 mm");
  const at500 = measureThing(dog, geometry({ shutterSeconds: 1 / 500, focusDistance: 8 }));
  assertClose(at500.trailMm, 0.04375, 1e-12, "à 1/500 s");
  assert.equal(at500.frozen, false);
  // En pixels d'une photo de 1500 px de grand côté : traînée × 1500 / grand côté du capteur.
  assertClose(at500.trailPx, (0.04375 * 1500) / z6.sensorWidthMm, 1e-12, "en pixels");
  // Limite du figé en pixels : (d / 1500) × 1500 / grand côté = d / grand côté, environ 1,2 px pour le Z 6
  // (docs/camera-physique.md, « Bulletin »).
  assertClose((BLUR_Z6 * 1500) / z6.sensorWidthMm, 1.2, 0.005, "limite en pixels");
  // Un point sur l'axe qui avance sur l'axe ne bouge pas sur le capteur ; hors de l'axe, il glisse :
  // X = 1 m, Z = 5 m, vZ = −2 m/s : 50 × (0 × 5 − 1 × (−2)) / 25 = 4 mm/s, soit 0,04 mm à 1/100 s.
  assert.equal(measureThing(thing("nathan", [[0, 0, 5]], [0, 0, -2]), geometry()).trailMm, 0);
  assertClose(measureThing(thing("nathan", [[1, 0, 5]], [0, 0, -2]), geometry()).trailMm, 0.04, 1e-12, "hors de l'axe");
});

test("bulletin : limites de la zone nette et mesure de chaque sujet, sans critère avant le défi", () => {
  const things = [thing("sophia", [[0, 0, 6.6]]), thing("bin", [[3.2, 0, 10.5]])];
  const b = measureShot({ ...geometry(), things });
  const zone = sharpZone(50, 8, 6.6, BLUR_Z6);
  assert.equal(b.near, zone.near);
  assert.equal(b.far, zone.far);
  assert.equal(b.blurMm, BLUR_Z6);
  assert.deepEqual(b.measures.map((m) => m.id), ["sophia", "bin"]);
  assert.deepEqual(b.criteria, []);
});

test("défis : SIT-01, SIT-05 et SIT-06", () => {
  assert.deepEqual([...CHALLENGES], ["SIT-01", "SIT-05", "SIT-06"]);
});

test("SIT-01 : l'œil de Sophia net, et rien de net à plus de 1 m derrière lui, fond photo à 500 m compris", () => {
  const sophia = thing("sophia", [[0, 0, 6.6]]);
  const bench = thing("bench", [[-1, 0, 9]]); // 2,4 m derrière, dans le cadre
  const fabienne = thing("fabienne", [[0.5, 0, 7.1]]); // 0,5 m derrière : pas « derrière »
  const walker = thing("nathan", [[8, 0, 9]]); // derrière, hors du cadre (x ≈ 44 mm)
  const judge = (aperture: number, things: SceneThing[]) => judgeChallenge("SIT-01", measureShot({ ...geometry({ aperture }), things }));
  // f/1.4 : zone d'environ 6,0 à 7,4 m ; le banc à 9 m est flou, le fond aussi.
  const open = judge(apertureValue(0), [sophia, bench, fabienne, walker]);
  assert.deepEqual(open.map((c) => [c.key, c.ok]), [["eyeSharp", true], ["backgroundBlurred", true]]);
  // f/8 : zone jusqu'à 16,6 m ; le banc est net. Fabienne, nette mais à moins de 1 m, et le promeneur, hors du
  // cadre, ne comptent pas.
  const closed = judge(8, [sophia, bench, fabienne, walker]);
  assert.equal(closed[0].ok, true);
  assert.equal(closed[1].ok, false);
  assert.equal(closed[1].values.sharp, "bench");
  // f/22 : zone jusqu'à l'infini ; le fond photo, à 500 m, est net aussi.
  const deep = judge(apertureValue(24), [sophia, bench]);
  assert.equal(deep[1].values.sharp, "bench, backdrop");
  // Sans Sophia dans les mesures, ni l'un ni l'autre critère ne passe.
  const absent = judge(apertureValue(0), [bench]);
  assert.deepEqual(absent.map((c) => c.ok), [false, false]);
  assert.ok(Number.isNaN(absent[0].values.depth));
});

test("SIT-05 : les yeux des quatre personnages dans le cadre et nets ; les manqués nommés", () => {
  // 85 mm, f/1.4, mise au point à 6,6 m : zone d'environ 6,37 à 6,85 m. Dennis à 6,2 m et Percy à 7,4 m en sortent.
  const group = [
    thing("dennis", [[-1, 0, 6.2]]),
    thing("sophia", [[-0.2, 0, 6.6]]),
    thing("fabienne", [[0.5, 0, 6.8]]),
    thing("percy", [[1.2, 0, 7.4]]),
  ];
  const open = judgeChallenge("SIT-05", measureShot({ ...geometry({ focalMm: 85, aperture: apertureValue(0) }), things: group }));
  assert.equal(open.length, 1);
  assert.equal(open[0].key, "groupSharp");
  assert.equal(open[0].ok, false);
  assert.equal(open[0].values.missed, "dennis, percy");
  // À f/8, tous nets.
  const closed = judgeChallenge("SIT-05", measureShot({ ...geometry({ focalMm: 85 }), things: group }));
  assert.equal(closed[0].ok, true);
  assert.equal(closed[0].values.missed, "");
  // Un personnage absent des mesures compte comme manqué, nommé « ? ».
  const three = judgeChallenge("SIT-05", measureShot({ ...geometry({ focalMm: 85 }), things: group.slice(0, 3) }));
  assert.equal(three[0].values.missed, "?");
});

test("SIT-06 : le chien dans le cadre, net et figé", () => {
  const run = (shutterSeconds: number, x: number) =>
    judgeChallenge("SIT-06", measureShot({ ...geometry({ shutterSeconds, focusDistance: 8 }), things: [thing("jim", [[x, 0.3, 8]], [3.5, 0, 0])] }));
  const ok = (criteria: ReturnType<typeof run>) => criteria.map((c) => [c.key, c.ok]);
  assert.deepEqual(ok(run(1 / 1000, 0)), [["dogInFrame", true], ["dogSharp", true], ["dogFrozen", true]]);
  assert.deepEqual(ok(run(1 / 500, 0)), [["dogInFrame", true], ["dogSharp", true], ["dogFrozen", false]]);
  // Chien hors du cadre (x = 50 × 5 / 8 ≈ 31 mm) : ni dans le cadre, ni net. Le critère « figé » n'est pas jugé ici :
  // qu'il réussisse alors est un défaut connu (constat B17 de la relecture de la version 0.3.68, « Défauts connus »
  // de docs/etat-des-travaux.md), que ce test ne fige pas.
  const outside = run(1 / 1000, 5);
  assert.deepEqual(outside.slice(0, 2).map((c) => [c.key, c.ok]), [["dogInFrame", false], ["dogSharp", false]]);
  // Sans le chien dans les mesures : rien ne passe.
  const none = judgeChallenge("SIT-06", measureShot({ ...geometry(), things: [] }));
  assert.deepEqual(none.map((c) => c.ok), [false, false, false]);
});
