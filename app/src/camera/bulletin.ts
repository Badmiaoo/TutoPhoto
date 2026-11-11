// Bulletin de la photo et défis des trois situations de la V1 minimale (SIT-01, SIT-05, SIT-06), proposés le
// 10 novembre 2026 et validés par Julien le 11 novembre (« Suivons tes propositions »).
//
// Critères, tous tirés de mesures déjà sourcées :
// - zone nette : limites de camera/sharpZone.ts, flou acceptable d / 1500 [wikipedia-circle-of-confusion] ;
// - sujet figé : traînée pendant la pose, sur le capteur, au plus égale au même flou acceptable, comme
//   l'indicateur d'équilibre (ui/balance.ts) : un point (X, Y, Z) de la caméra de vitesse (vX, vY, vZ) se déplace
//   sur le capteur de f (vX Z − X vZ) / Z² × t (et de même en y) ;
// - dans le cadre : le point se projette dans le capteur (x = f X / Z, |x| ≤ largeur / 2, de même en y).
// Choix de TutoPhoto : « derrière le sujet » veut dire à plus de 1 m derrière lui ; le fond photo à 360° compte
// comme un fond à 500 m, toujours dans le cadre. La distance est la profondeur le long de l'axe (z de la caméra),
// celle de la mise au point.

import { Vector3, type Matrix } from "@babylonjs/core/Maths/math.vector";
import { blurLimitMm, sharpZone } from "./sharpZone";

export type ChallengeId = "SIT-01" | "SIT-05" | "SIT-06";
export const CHALLENGES: readonly ChallengeId[] = ["SIT-01", "SIT-05", "SIT-06"];

/** Sujet de la scène à l'instant de la vue : position (yeux ou centre) et vitesse, dans la scène. */
export interface SceneThing {
  id: string;
  /** Points à juger : les yeux pour un visage, sinon un point du corps. */
  points: Vector3[];
  velocity: Vector3;
}

/** Ce qu'il faut savoir de la vue pour la juger. */
export interface ShotGeometry {
  /** Matrice de vue de l'appareil à l'instant de la vue. */
  view: Matrix;
  focalMm: number;
  aperture: number;
  shutterSeconds: number;
  focusDistance: number;
  sensorWidthMm: number;
  sensorHeightMm: number;
  portrait: boolean;
  things: SceneThing[];
}

/** Mesure d'un sujet sur la photo. */
export interface ThingMeasure {
  id: string;
  inFrame: boolean;
  /** Profondeur du point le plus proche, en mètres (z de la caméra). */
  depth: number;
  sharp: boolean;
  /** Traînée sur le capteur, en mm, et en pixels d'une photo de 1500 px de grand côté. */
  trailMm: number;
  trailPx: number;
  frozen: boolean;
}

export interface Criterion {
  /** Clé du texte (i18n), complétée par les valeurs. */
  key: "eyeSharp" | "backgroundBlurred" | "groupSharp" | "dogInFrame" | "dogSharp" | "dogFrozen";
  ok: boolean;
  /** Valeurs à afficher. */
  values: Record<string, number | string>;
  /** Notions à revoir si le critère échoue. */
  notions: string[];
}

export interface Bulletin {
  near: number;
  far: number;
  blurMm: number;
  measures: ThingMeasure[];
  criteria: Criterion[];
}

/** Profondeur au-delà de laquelle un élément est « derrière » le sujet (choix de TutoPhoto). */
const BEHIND_M = 1;
/** Fond photo à 360° : à 500 m (scene.ts, DOME_RADIUS). */
const BACKDROP_M = 500;

export function measureShot(g: ShotGeometry): Bulletin {
  const blurMm = blurLimitMm(g.sensorWidthMm, g.sensorHeightMm);
  const zone = sharpZone(g.focalMm, g.aperture, g.focusDistance, blurMm);
  const halfW = (g.portrait ? g.sensorHeightMm : g.sensorWidthMm) / 2;
  const halfH = (g.portrait ? g.sensorWidthMm : g.sensorHeightMm) / 2;
  const longSide = Math.max(g.sensorWidthMm, g.sensorHeightMm);
  const measures = g.things.map((thing): ThingMeasure => {
    // Profondeur et traînée du point le plus proche ; dans le cadre si l'un des points l'est.
    let best: { depth: number; trailMm: number } | null = null;
    let inFrame = false;
    for (const world of thing.points) {
      const p = Vector3.TransformCoordinates(world, g.view);
      if (!(p.z > 0)) continue;
      // Vitesse dans le repère de la caméra : différence des transformés du point et du point déplacé d'1 s.
      const q = Vector3.TransformCoordinates(world.add(thing.velocity), g.view).subtract(p);
      const x = (g.focalMm * p.x) / p.z;
      const y = (g.focalMm * p.y) / p.z;
      if (Math.abs(x) <= halfW && Math.abs(y) <= halfH) inFrame = true;
      const vx = (g.focalMm * (q.x * p.z - p.x * q.z)) / (p.z * p.z);
      const vy = (g.focalMm * (q.y * p.z - p.y * q.z)) / (p.z * p.z);
      if (!best || p.z < best.depth) best = { depth: p.z, trailMm: Math.hypot(vx, vy) * g.shutterSeconds };
    }
    if (!best) return { id: thing.id, inFrame: false, depth: Infinity, sharp: false, trailMm: 0, trailPx: 0, frozen: true };
    return {
      id: thing.id,
      inFrame,
      depth: best.depth,
      sharp: best.depth >= zone.near && best.depth <= zone.far,
      trailMm: best.trailMm,
      trailPx: (best.trailMm * 1500) / longSide,
      frozen: best.trailMm <= blurMm,
    };
  });
  return { near: zone.near, far: zone.far, blurMm, measures, criteria: [] };
}

/** Critères du défi, sur une vue déjà mesurée. */
export function judgeChallenge(id: ChallengeId, b: Bulletin): Criterion[] {
  const get = (thing: string) => b.measures.find((m) => m.id === thing);
  if (id === "SIT-01") {
    const sophia = get("sophia");
    const eyeOk = Boolean(sophia && sophia.inFrame && sophia.sharp);
    const behind = b.measures.filter((m) => sophia && m.id !== "sophia" && m.inFrame && m.depth > sophia.depth + BEHIND_M);
    const sharpBehind = behind.filter((m) => m.sharp).map((m) => m.id);
    // Le fond photo, à 500 m, est flou si la limite lointaine est en deçà.
    if (b.far >= BACKDROP_M) sharpBehind.push("backdrop");
    return [
      { key: "eyeSharp", ok: eyeOk, values: { depth: sophia?.depth ?? NaN }, notions: ["MAP-06", "MAP-09", "NET-01"] },
      { key: "backgroundBlurred", ok: Boolean(sophia) && sharpBehind.length === 0, values: { sharp: sharpBehind.join(", ") }, notions: ["NET-01", "NET-06"] },
    ];
  }
  if (id === "SIT-05") {
    const group = ["dennis", "sophia", "fabienne", "percy"].map((g) => get(g));
    const missed = group.filter((m) => !m || !m.inFrame || !m.sharp).map((m) => m?.id ?? "?");
    return [{ key: "groupSharp", ok: missed.length === 0, values: { missed: missed.join(", ") }, notions: ["NET-01", "MAP-05", "MAP-09"] }];
  }
  const dog = get("jim");
  return [
    { key: "dogInFrame", ok: Boolean(dog?.inFrame), values: {}, notions: ["MAP-04", "BOI-12"] },
    { key: "dogSharp", ok: Boolean(dog?.inFrame && dog.sharp), values: { depth: dog?.depth ?? NaN }, notions: ["MAP-04", "MAP-05", "NET-01"] },
    { key: "dogFrozen", ok: Boolean(dog?.frozen), values: { px: dog?.trailPx ?? NaN }, notions: ["MVT-01", "BOI-08", "MES-10"] },
  ];
}
