// Bulletin de la photo et défis des trois situations de la V1 minimale (SIT-01, SIT-05, SIT-06), proposés le
// 10 novembre 2026 et validés par Julien le 11 novembre (« Suivons tes propositions »).
//
// Critères, tous tirés de mesures déjà sourcées :
// - zone nette : limites de camera/optics.ts (sharpZone), flou acceptable d / 1500 [wikipedia-circle-of-confusion] ;
// - sujet figé : traînée pendant la pose, sur le capteur, au plus égale au même flou acceptable, par la même
//   fonction que l'indicateur d'équilibre (measureThing, appelée aussi par ui/balance.ts) : un point (X, Y, Z) de la
//   caméra de vitesse (vX, vY, vZ) se déplace sur le capteur de f (vX Z − X vZ) / Z² × t (et de même en y)
//   (camera/optics.ts, sensorVelocity et trailMm) ;
// - dans le cadre : le point se projette dans le capteur (x = f X / Z, |x| ≤ largeur / 2, de même en y)
//   (camera/optics.ts, sensorPosition et onSensor).
// Choix de TutoPhoto : « derrière le sujet » veut dire à plus de 1 m derrière lui ; le fond photo à 360° compte
// comme un fond à la distance de la sphère du fond (500 m dans la scène du parc : scene.ts, DOME_RADIUS), toujours
// dans le cadre ; cette distance est donnée par l'appelant (judgeChallenge). La distance est la profondeur le long de
// l'axe (z de la caméra), celle de la mise au point.

import { Vector3, type Matrix } from "@babylonjs/core/Maths/math.vector";
import { blurLimitMm, onSensor, sensorMmToPixels, sensorPosition, sensorVelocity, sharpZone, trailMm } from "./optics";

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
  /** Traînée sur le capteur, en mm, et en pixels de la photo (PHOTO_LONG_SIDE, 1500 px de grand côté). */
  trailMm: number;
  trailPx: number;
  frozen: boolean;
}

export interface Criterion {
  /** Clé du texte (texts.ts), complétée par les valeurs. */
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

/**
 * Mesure d'un sujet vu par l'appareil : profondeur et traînée de son point le plus proche, dans le cadre si l'un
 * de ses points l'est. Seule formule qui juge la traînée et la netteté d'un sujet, pour le bulletin, l'indicateur
 * d'équilibre (ui/balance.ts) et la vue de dessus (ui/topView.ts). La photo (camera/photo.ts) estime aussi une
 * traînée, à la position au sol des sujets, mais seulement pour choisir le nombre de rendus de la pose.
 */
export function measureThing(thing: SceneThing, g: Omit<ShotGeometry, "things">): ThingMeasure {
  const blurMm = blurLimitMm(g.sensorWidthMm, g.sensorHeightMm);
  const zone = sharpZone(g.focalMm, g.aperture, g.focusDistance, blurMm);
  const longSide = Math.max(g.sensorWidthMm, g.sensorHeightMm);
  let best: { depth: number; trailMm: number } | null = null;
  let inFrame = false;
  for (const world of thing.points) {
    const p = Vector3.TransformCoordinates(world, g.view);
    if (!(p.z > 0)) continue;
    // Vitesse dans le repère de la caméra : différence des transformés du point et du point déplacé d'1 s.
    const q = Vector3.TransformCoordinates(world.add(thing.velocity), g.view).subtract(p);
    if (onSensor(sensorPosition(p, g.focalMm), g.sensorWidthMm, g.sensorHeightMm, g.portrait)) inFrame = true;
    if (!best || p.z < best.depth) best = { depth: p.z, trailMm: trailMm(sensorVelocity(p, q, g.focalMm), g.shutterSeconds) };
  }
  if (!best) return { id: thing.id, inFrame: false, depth: Infinity, sharp: false, trailMm: 0, trailPx: 0, frozen: true };
  return {
    id: thing.id,
    inFrame,
    depth: best.depth,
    sharp: best.depth >= zone.near && best.depth <= zone.far,
    trailMm: best.trailMm,
    trailPx: sensorMmToPixels(best.trailMm, longSide),
    frozen: best.trailMm <= blurMm,
  };
}

export function measureShot(g: ShotGeometry): Bulletin {
  const blurMm = blurLimitMm(g.sensorWidthMm, g.sensorHeightMm);
  const zone = sharpZone(g.focalMm, g.aperture, g.focusDistance, blurMm);
  const measures = g.things.map((thing) => measureThing(thing, g));
  return { near: zone.near, far: zone.far, blurMm, measures, criteria: [] };
}

/**
 * Critères du défi, sur une vue déjà mesurée. backdropDistanceM : distance à laquelle le fond photo à 360° est vu, le
 * rayon de la sphère du fond (scene.ts, DOME_RADIUS, 500 m dans la scène du parc).
 */
export function judgeChallenge(id: ChallengeId, b: Bulletin, backdropDistanceM: number): Criterion[] {
  const get = (thing: string) => b.measures.find((m) => m.id === thing);
  if (id === "SIT-01") {
    const sophia = get("sophia");
    const eyeOk = Boolean(sophia && sophia.inFrame && sophia.sharp);
    const behind = b.measures.filter((m) => sophia && m.id !== "sophia" && m.inFrame && m.depth > sophia.depth + BEHIND_M);
    const sharpBehind = behind.filter((m) => m.sharp).map((m) => m.id);
    // Le fond photo, vu à backdropDistanceM, est flou si la limite lointaine est en deçà.
    if (b.far >= backdropDistanceM) sharpBehind.push("backdrop");
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
