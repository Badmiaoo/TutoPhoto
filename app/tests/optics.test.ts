// Tests rapides de camera/optics.ts (Sujet 27 du plan de corrections, constat ARC-07) : champ de vue, flou acceptable
// et zone nette (tests du Sujet 26, écrits pour camera/sharpZone.ts, passé dans ce module), cercle de confusion,
// position et traînée sur le capteur, format de la photo, rayon d'un point du cadre et distance du sol, fenêtre d'une
// projection, plan des rendus de la photo. Valeurs attendues : formules de l'en-tête du module
// [wikipedia-circle-of-confusion], exemples de docs/camera-physique.md, ou calcul écrit à côté du test. Les matrices
// de projection sont celles de Babylon.js, qui se chargent sans navigateur.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { BODIES, findBody } from "../src/camera/bodies";
import { FOCAL_LENGTHS, SCALES, apertureValue } from "../src/camera/exposure";
import {
  MAX_SAMPLES,
  MIN_SAMPLES,
  PHOTO_LONG_SIDE,
  backdropDepth,
  blurLimitMm,
  cocAt,
  cocAtInfinityMm,
  depthOrGround,
  eyeDiskRadiusM,
  eyeOffset,
  fieldOfView,
  frontalTrailMm,
  groundDepth,
  halfFieldTangent,
  instantStride,
  minFocusDistanceM,
  onSensor,
  photoSize,
  pixelWindow,
  plannedSamples,
  rayThrough,
  sampleInstant,
  sensorMmToPixels,
  sensorPosition,
  sensorVelocity,
  sharpZone,
  shiftedProjection,
  smoothingFactor,
  trailMm,
  windowProjection,
  type GroundInfo,
} from "../src/camera/optics";
import { assertClose } from "./approx";

const z6 = findBody("nikon");

/**
 * Cercle de confusion, en mm, d'un point à la distance S₂ quand la mise au point est à S₁ (en mètres) :
 * c = A × |S₂ − S₁| / S₂ × f / (S₁ − f), avec A = f / N (en-tête du module).
 */
function circleOfConfusion(focalMm: number, aperture: number, focusM: number, pointM: number): number {
  const s1 = focusM * 1000;
  const s2 = pointM * 1000;
  return (focalMm / aperture) * (Math.abs(s2 - s1) / s2) * (focalMm / (s1 - focalMm));
}

test("flou acceptable : diagonale du capteur / 1500, soit 0,0288 mm pour le Z 6", () => {
  for (const body of BODIES) {
    assertClose(blurLimitMm(body.sensorWidthMm, body.sensorHeightMm), Math.hypot(body.sensorWidthMm, body.sensorHeightMm) / 1500, 1e-15, body.model);
  }
  // √(35,9² + 23,9²) = 43,13 mm ; docs/camera-physique.md écrit 0,02875 mm.
  assertClose(blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm), 0.02875, 0.000005, "Z 6");
});

test("aux limites de la zone nette, le cercle de confusion vaut le flou acceptable", () => {
  // Par définition des limites : c(proche) = c(lointaine) = flou acceptable, c < flou acceptable entre les deux.
  // Toutes les focales, toutes les ouvertures, mises au point de 1 à 30 m, pour les trois boîtiers.
  for (const body of BODIES) {
    const blur = blurLimitMm(body.sensorWidthMm, body.sensorHeightMm);
    for (const focal of FOCAL_LENGTHS) {
      for (let a = 0; a < SCALES.aperture; a++) {
        const n = apertureValue(a);
        for (const focus of [1, 2, 3.5, 6.6, 10, 30]) {
          const zone = sharpZone(focal, n, focus, blur);
          const what = `${body.model}, ${focal} mm, f/${n.toFixed(2)}, ${focus} m`;
          assert.ok(zone.near < focus && focus < zone.far, what);
          assertClose(circleOfConfusion(focal, n, focus, zone.near), blur, 1e-12, `${what}, limite proche`);
          if (Number.isFinite(zone.far)) assertClose(circleOfConfusion(focal, n, focus, zone.far), blur, 1e-12, `${what}, limite lointaine`);
          // Entre les limites, à mi-chemin en profondeur, le flou reste en deçà.
          assert.ok(circleOfConfusion(focal, n, focus, (zone.near + focus) / 2) < blur, what);
        }
      }
    }
  }
});

test("distance hyperfocale H = f² / (N c) + f : au-delà, la zone va jusqu'à l'infini ; en deçà, elle s'arrête", () => {
  // Avec q = c × N × (S₁ − f) / f² (en-tête du module), q = 1 pour S₁ = H : mise au point à H, la zone irait de H / 2 à
  // l'infini. Le test se tient à 0,1 % de part et d'autre de H, pour ne pas dépendre de l'arrondi de q = 1 : à 1,001 H,
  // limite lointaine infinie et limite proche à 0,1 % de H / 2 ; à 0,999 H, limite lointaine finie.
  const blur = blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm);
  for (const focal of FOCAL_LENGTHS) {
    for (const n of [2, 4, 8, 16]) {
      const hyperfocalM = ((focal * focal) / (n * blur) + focal) / 1000;
      const beyond = sharpZone(focal, n, hyperfocalM * 1.001, blur);
      assert.equal(beyond.far, Infinity, `${focal} mm à f/${n}, au-delà`);
      assertClose(beyond.near / (hyperfocalM / 2), 1, 1e-3, `${focal} mm à f/${n}, limite proche`);
      assert.ok(Number.isFinite(sharpZone(focal, n, hyperfocalM * 0.999, blur).far), `${focal} mm à f/${n}, en deçà`);
    }
  }
});

test("exemples de docs/camera-physique.md : 50 mm, mise au point à 6,6 m, Z 6", () => {
  const blur = blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm);
  // « 50 mm à f/8 : la zone nette va d'environ 4 m à 17 m » (q = 0,02875 × 8 × 6550 / 2500 = 0,603).
  const f8 = sharpZone(50, 8, 6.6, blur);
  assert.equal(Math.round(f8.near), 4);
  assert.equal(Math.round(f8.far), 17);
  // « À f/1.4, la limite lointaine tombe à 7,4 m » (la page prend N = 1,4 : q ≈ 0,105, 6,6 / (1 − 0,105) ≈ 7,4 m). Avec
  // N = √2, valeur exacte du cran f/1.4, q ≈ 0,1065 et la limite vaut 7,39 m : 7,4 m au dixième près, comme la page.
  const f14 = sharpZone(50, apertureValue(0), 6.6, blur);
  assertClose(f14.far, 7.4, 0.05, "limite lointaine à f/1.4");
  // « La routine de test juge donc SIT-01 à f/22 : la distance hyperfocale vaut 2500 / (22 × 0,02875) ≈ 4 m, la zone
  // nette va jusqu'à l'infini » (N = 2^4,5 ≈ 22,6, valeur exacte du cran f/22).
  assert.equal(sharpZone(50, apertureValue(SCALES.aperture - 1), 6.6, blur).far, Infinity);
});

test("la zone s'élargit quand on ferme le diaphragme ou que la mise au point s'éloigne", () => {
  const blur = blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm);
  for (const focal of FOCAL_LENGTHS) {
    let previous = sharpZone(focal, apertureValue(0), 3, blur);
    for (let a = 1; a < SCALES.aperture; a++) {
      const zone = sharpZone(focal, apertureValue(a), 3, blur);
      assert.ok(zone.near < previous.near && zone.far >= previous.far, `${focal} mm, f/${apertureValue(a).toFixed(2)}`);
      previous = zone;
    }
    let before = sharpZone(focal, 8, 1, blur);
    for (const focus of [1.5, 2, 4, 8, 16]) {
      const zone = sharpZone(focal, 8, focus, blur);
      assert.ok(zone.far - zone.near >= before.far - before.near, `${focal} mm à f/8, ${focus} m`);
      before = zone;
    }
  }
});

test("champ de vue : 2 × atan(côté / (2 × focale))", () => {
  // Un côté égal à deux fois la focale se voit sous un angle droit : 2 × atan(1) = 90°.
  assertClose(fieldOfView(36, 18), Math.PI / 2, 1e-12, "36 mm à 18 mm");
  // Le champ se resserre quand la focale s'allonge ; tan(champ / 2) × 2 × focale redonne le côté.
  for (const side of [35.9, 23.9, 23.5, 22.3]) {
    let previous = Math.PI;
    for (const focal of FOCAL_LENGTHS) {
      const fov = fieldOfView(side, focal);
      assert.ok(fov < previous, `${side} mm à ${focal} mm`);
      assertClose(Math.tan(fov / 2) * 2 * focal, side, 1e-9, `${side} mm à ${focal} mm`);
      previous = fov;
    }
  }
});

test("demi-champ : côté / (2 × focale), écrit une fois pour le champ de vue et la vue de dessus", () => {
  for (const body of BODIES) {
    for (const side of [body.sensorWidthMm, body.sensorHeightMm]) {
      for (const focal of FOCAL_LENGTHS) {
        assert.equal(halfFieldTangent(side, focal), side / (2 * focal));
        assert.equal(fieldOfView(side, focal), 2 * Math.atan(side / (2 * focal)));
      }
    }
  }
});

test("cercle de confusion : (f / N) × f / (S − f) pour un point à l'infini, × |D − S| / D à la profondeur D", () => {
  for (const focal of FOCAL_LENGTHS) {
    for (const a of [0, 6, 15, 24]) {
      const n = apertureValue(a);
      for (const focus of [0.5, 1, 2, 6.6, 26.7]) {
        const what = `${focal} mm, f/${n.toFixed(2)}, ${focus} m`;
        const infinity = cocAtInfinityMm(focal, n, focus);
        assertClose(infinity, (focal / n) * (focal / (focus * 1000 - focal)), 1e-15 * infinity, what);
        for (const depth of [0.3, 1, 3, 10, 100, 500]) {
          assertClose(cocAt(infinity, focus, depth), circleOfConfusion(focal, n, focus, depth), 1e-12, `${what}, ${depth} m`);
        }
        assert.equal(cocAt(infinity, focus, focus), 0, what);
        // Très loin, le cercle tend vers celui de l'infini : à D = 10¹² m, il en diffère de S / D, moins de 1e-10.
        assertClose(cocAt(infinity, focus, 1e12), infinity, infinity * 1e-10, `${what}, 10¹² m`);
      }
    }
  }
});

test("la photo et l'aperçu du viseur floutent les limites de la zone nette du flou acceptable, ni plus ni moins", () => {
  // Formule commune (cocAtInfinityMm, cocAt) et zone nette du bulletin (sharpZone) : aux limites proche et lointaine,
  // le cercle de confusion vaut le flou acceptable, pour les trois boîtiers, toutes les focales et des ouvertures de
  // f/1.4 à f/22.
  for (const body of BODIES) {
    const blur = blurLimitMm(body.sensorWidthMm, body.sensorHeightMm);
    for (const focal of FOCAL_LENGTHS) {
      for (const a of [0, 3, 9, 15, 21, 24]) {
        const n = apertureValue(a);
        for (const focus of [1, 3.5, 6.6, 26.7]) {
          const zone = sharpZone(focal, n, focus, blur);
          const infinity = cocAtInfinityMm(focal, n, focus);
          const what = `${body.model}, ${focal} mm, f/${n.toFixed(2)}, ${focus} m`;
          assertClose(cocAt(infinity, focus, zone.near), blur, 1e-12, `${what}, limite proche`);
          if (Number.isFinite(zone.far)) assertClose(cocAt(infinity, focus, zone.far), blur, 1e-12, `${what}, limite lointaine`);
          else assert.ok(infinity <= blur * (1 + 1e-12), `${what}, zone jusqu'à l'infini`);
        }
      }
    }
  }
});

test("exemple de docs/camera-physique.md : 135 mm à f/1.4, au point à 6,6 m, fond à 500 m", () => {
  // « c = (135 / 1,4) × 135 / (6600 − 135) × (500 000 − 6600) / 500 000 ≈ 1,99 mm sur le capteur ; × 1060 / 35,9 ≈
  // 29,5 pixels par mm sur un écran de 1200 × 900, d'où 58,7 px ; × 453 / 35,9 ≈ 12,6 pixels par mm sur un téléphone
  // de 390 × 844 tenu à la verticale, d'où 25,1 px » (la page prend N = 1,4). Écarts permis : arrondis de la page.
  const c = cocAt(cocAtInfinityMm(135, 1.4, 6.6), 6.6, 500);
  assertClose(c, 1.99, 0.005, "flou sur le capteur");
  assertClose((c * 1060) / 35.9, 58.7, 0.05, "écran de 1200 × 900");
  assertClose((c * 453) / 35.9, 25.1, 0.05, "téléphone de 390 × 844");
});

test("distance de mise au point la plus courte : 1,01 × la focale, où S − f reste positif", () => {
  assertClose(minFocusDistanceM(50), 0.0505, 1e-15, "50 mm");
  for (const focal of FOCAL_LENGTHS) {
    const shortest = minFocusDistanceM(focal);
    assertClose(shortest, (focal / 1000) * 1.01, 1e-15, `${focal} mm`);
    const c = cocAtInfinityMm(focal, apertureValue(0), shortest);
    assert.ok(Number.isFinite(c) && c > 0, `${focal} mm`);
    assert.ok(eyeDiskRadiusM(focal, apertureValue(0), shortest) > 0, `${focal} mm`);
  }
});

test("position sur le capteur : x = f X / Z, y = f Y / Z ; dans le cadre si |x| et |y| tiennent dans les demi-côtés", () => {
  assert.deepEqual(sensorPosition({ x: 1, y: 0.5, z: 10 }, 50), { x: 5, y: 2.5 });
  assert.deepEqual(sensorPosition({ x: -2, y: 0, z: 4 }, 200), { x: -100, y: 0 });
  // Z 6 : demi-côtés de 17,95 et 11,95 mm, échangés en cadre vertical.
  const inside = (x: number, y: number, portrait = false) => onSensor({ x, y }, z6.sensorWidthMm, z6.sensorHeightMm, portrait);
  assert.equal(inside(17.95, 11.95), true);
  assert.equal(inside(-17.95, -11.95), true);
  assert.equal(inside(17.96, 0), false);
  assert.equal(inside(0, 11.96), false);
  assert.equal(inside(11.95, 17.95, true), true);
  assert.equal(inside(17.95, 0, true), false);
});

test("traînée : vitesse sur le capteur f (V_X Z − X V_Z) / Z², × la durée de pose", () => {
  // Point sur l'axe à 10 m, en travers à 2 m/s, au 50 mm : 50 × 2 / 10 = 10 mm/s ; en 1/100 s, 0,1 mm.
  const across = sensorVelocity({ x: 0, y: 0, z: 10 }, { x: 2, y: 0, z: 0 }, 50);
  assert.equal(across.x, 10);
  assert.equal(across.y, 0);
  assertClose(trailMm(across, 1 / 100), 0.1, 1e-15, "en travers");
  // Le même point qui s'approche de l'appareil le long de l'axe ne bouge pas sur le capteur.
  const toward = sensorVelocity({ x: 0, y: 0, z: 10 }, { x: 0, y: 0, z: -5 }, 50);
  assert.equal(trailMm(toward, 1 / 100), 0);
  // Hors de l'axe, à 1 m du centre et à 10 m, qui s'approche à 5 m/s : il s'écarte du centre de
  // 50 × (0 × 10 − 1 × (−5)) / 10² = 2,5 mm/s.
  assertClose(sensorVelocity({ x: 1, y: 0, z: 10 }, { x: 0, y: 0, z: -5 }, 50).x, 2.5, 1e-15, "en approche");
  // En hauteur, de même : y = f Y / Z, vitesse f (V_Y Z − Y V_Z) / Z².
  assertClose(sensorVelocity({ x: 0, y: -1, z: 5 }, { x: 0, y: 1, z: 1 }, 100).y, (100 * (1 * 5 - -1 * 1)) / 25, 1e-12, "en hauteur");
  // Traînée : norme des deux composantes.
  assertClose(trailMm({ x: 3, y: 4 }, 0.5), 2.5, 1e-15, "norme");
});

test("estimation de face de la photo, v × t × f / D : égale à la traînée jugée pour un point sur l'axe qui passe en travers", () => {
  for (const focal of FOCAL_LENGTHS) {
    for (const [speed, depth, t] of [[1.4, 5, 1 / 100], [3.5, 8, 1 / 500], [2, 20, 1 / 30]] as const) {
      const judged = trailMm(sensorVelocity({ x: 0, y: 0, z: depth }, { x: speed, y: 0, z: 0 }, focal), t);
      assertClose(frontalTrailMm(speed, t, focal, depth), judged, 1e-12 * judged, `${focal} mm, ${speed} m/s à ${depth} m`);
    }
  }
});

test("format de la photo : 1500 px de grand côté, petit côté aux proportions du capteur ; 1500 × 999 pour le Z 6", () => {
  assert.equal(PHOTO_LONG_SIDE, 1500);
  // docs/camera-physique.md : « Les textures du calcul (1500 × 999 pixels) » ; 1500 × 23,9 / 35,9 ≈ 998,6.
  assert.deepEqual(photoSize(z6.sensorWidthMm, z6.sensorHeightMm, PHOTO_LONG_SIDE, false), { width: 1500, height: 999 });
  assert.deepEqual(photoSize(z6.sensorWidthMm, z6.sensorHeightMm, PHOTO_LONG_SIDE, true), { width: 999, height: 1500 });
  // A6000 : 1500 × 15,6 / 23,5 ≈ 995,7 ; EOS R50 : 1500 × 14,9 / 22,3 ≈ 1002,2.
  assert.deepEqual(photoSize(23.5, 15.6, PHOTO_LONG_SIDE, false), { width: 1500, height: 996 });
  assert.deepEqual(photoSize(22.3, 14.9, PHOTO_LONG_SIDE, false), { width: 1500, height: 1002 });
  for (const body of BODIES) {
    const size = photoSize(body.sensorWidthMm, body.sensorHeightMm, 6000, false);
    assert.equal(size.width, 6000, body.model);
    assert.ok(Math.abs(size.height - (6000 * body.sensorHeightMm) / body.sensorWidthMm) <= 0.5, body.model);
  }
});

test("longueurs du capteur en pixels de la photo : mm × 1500 / grand côté ; flou acceptable du Z 6 ≈ 1,2 px", () => {
  // docs/camera-physique.md, « Défis et bulletin » : « (d / 1500) × 1500 / grand côté du capteur = d / grand côté,
  // soit 43,1 / 35,9 ≈ 1,2 px pour le Z 6 ».
  const blur = blurLimitMm(z6.sensorWidthMm, z6.sensorHeightMm);
  assertClose(sensorMmToPixels(blur, z6.sensorWidthMm), Math.hypot(35.9, 23.9) / 35.9, 1e-12, "flou acceptable");
  assert.equal(sensorMmToPixels(blur, z6.sensorWidthMm).toFixed(1), "1.2");
  assertClose(sensorMmToPixels(z6.sensorWidthMm, z6.sensorWidthMm), 1500, 1e-9, "grand côté");
  // Autre définition, en troisième argument : à 6048 px, un mm du capteur du Z 6 en vaut 6048 / 35,9 ≈ 168,5.
  assertClose(sensorMmToPixels(1, 35.9, 6048), 6048 / 35.9, 1e-12, "6048 px");
});

/** Projection de la photo d'un Z 6 au 50 mm, cadre horizontal : champ vertical le long du petit côté (camera/photo.ts). */
const photoProjection = Matrix.PerspectiveFovLH(fieldOfView(z6.sensorHeightMm, 50), 1500 / 999, 0.1, 1000);
const parc: GroundInfo = { eyeHeight: 1.6, domeRadius: 500 };

test("rayon d'un point du cadre : le point vu à la profondeur z, en z × rayon, se projette sur ce point du cadre", () => {
  assert.deepEqual(rayThrough(photoProjection.asArray(), { x: 0.5, y: 0.5 }), { x: 0, y: 0, z: 1 });
  // Coin en haut à droite : tangentes des demi-champs, horizontal (aux proportions 1500 / 999) et vertical.
  const corner = rayThrough(photoProjection.asArray(), { x: 1, y: 0 });
  assertClose(corner.y, halfFieldTangent(z6.sensorHeightMm, 50), 1e-6, "demi-champ vertical");
  assertClose(corner.x, (1500 / 999) * halfFieldTangent(z6.sensorHeightMm, 50), 1e-6, "demi-champ horizontal");
  for (const point of [{ x: 0.1, y: 0.2 }, { x: 0.5, y: 0.9 }, { x: 0.97, y: 0.03 }]) {
    for (const depth of [0.5, 6.6, 120]) {
      const ray = rayThrough(photoProjection.asArray(), point);
      const ndc = Vector3.TransformCoordinates(new Vector3(ray.x * depth, ray.y * depth, depth), photoProjection);
      assertClose(ndc.x, point.x * 2 - 1, 1e-6, `x, ${depth} m`);
      assertClose(ndc.y, 1 - point.y * 2, 1e-6, `y, ${depth} m`);
    }
  }
});

test("distance du sol : hauteur de l'œil / pente du rayon vers le bas, au plus le rayon du fond", () => {
  const level = { x: 0, y: 1, z: 0 };
  // Appareil horizontal : en bas du cadre, pente = tan(demi-champ vertical) = 23,9 / 100 ; sol à 1,6 / 0,239 ≈ 6,69 m.
  assertClose(groundDepth(photoProjection, level, parc, { x: 0.5, y: 1 }), 1.6 / 0.239, 1e-5, "bas du cadre");
  assert.equal(groundDepth(photoProjection, level, parc, { x: 0.5, y: 0.5 }), Infinity);
  assert.equal(groundDepth(photoProjection, level, parc, { x: 0.5, y: 0 }), Infinity);
  // Juste sous l'horizon, le sol serait au-delà de la sphère du fond : ramené à 500 m.
  assert.equal(groundDepth(photoProjection, level, parc, { x: 0.5, y: 0.5001 }), 500);
  // Appareil incliné de 10° vers le bas : la verticale vue de l'appareil est (0, cos 10°, −sin 10°) ; au centre du
  // cadre, le sol est à 1,6 / sin 10° ≈ 9,21 m le long de l'axe.
  const tilt = (10 * Math.PI) / 180;
  const down = { x: 0, y: Math.cos(tilt), z: -Math.sin(tilt) };
  assertClose(groundDepth(photoProjection, down, parc, { x: 0.5, y: 0.5 }), 1.6 / Math.sin(tilt), 1e-9, "incliné");
});

test("profondeur d'un point : celle de la carte, sinon (invalide, ou sur la sphère du fond) la distance du sol", () => {
  const level = { x: 0, y: 1, z: 0 };
  const bottom = { x: 0.5, y: 1 };
  const horizon = { x: 0.5, y: 0.5 };
  assert.equal(backdropDepth(parc), 400);
  const depth = (mapDepth: number, point = bottom) => depthOrGround(mapDepth, 0.1, photoProjection, level, parc, point);
  assert.equal(depth(12), 12);
  assert.equal(depth(400), 400);
  const ground = groundDepth(photoProjection, level, parc, bottom);
  assert.equal(depth(0.05), ground);
  assert.equal(depth(NaN), ground);
  assert.equal(depth(450), ground);
  // Rayon qui ne descend pas : le rayon du fond.
  assert.equal(depth(450, horizon), 500);
  assert.equal(depth(0, horizon), 500);
});

test("fenêtre d'une projection : x' = (x − centre) × grossissement ; la fenêtre entière ne change rien", () => {
  const m = Array.from(photoProjection.asArray());
  const whole = pixelWindow({ left: 0, top: 0, width: 1500, height: 999 }, 1500, 999);
  assert.deepEqual(whole, { center: { x: 0, y: 0 }, zoom: { x: 1, y: 1 } });
  assert.deepEqual(windowProjection(m, whole.center, whole.zoom), m);
  // Moitié droite, tiers du haut : centre (0,5 ; 2/3), grossissement (2 ; 3).
  const part = pixelWindow({ left: 750, top: 0, width: 750, height: 333 }, 1500, 999);
  assertClose(part.center.x, 0.5, 1e-15, "centre x");
  assertClose(part.center.y, 2 / 3, 1e-15, "centre y");
  assertClose(part.zoom.x, 2, 1e-15, "grossissement x");
  assertClose(part.zoom.y, 3, 1e-12, "grossissement y");
  const windowed = Matrix.FromArray(windowProjection(m, part.center, part.zoom));
  for (const p of [new Vector3(0.3, 0.2, 5), new Vector3(-1, 0.5, 10), new Vector3(2, -1, 30)]) {
    const a = Vector3.TransformCoordinates(p, photoProjection);
    const b = Vector3.TransformCoordinates(p, windowed);
    assertClose(b.x, (a.x - part.center.x) * part.zoom.x, 1e-5, `x de ${p.toString()}`);
    assertClose(b.y, (a.y - part.center.y) * part.zoom.y, 1e-5, `y de ${p.toString()}`);
  }
  // Loupe du viseur : même grossissement sur les deux axes, autour d'un point.
  const loupe = windowProjection(m, { x: -0.2, y: 0.1 }, { x: 4, y: 4 });
  assert.equal(loupe[0], m[0] * 4);
  assert.equal(loupe[5], m[5] * 4);
  assert.equal(loupe[8], (m[8] + 0.2) * 4);
  assert.equal(loupe[9], (m[9] - 0.1) * 4);
});

test("nombre de rendus : (0,9 × flou / 4)² sur le disque, traînée / 4 le long d'un mouvement, de 16 à 256", () => {
  assert.equal(MIN_SAMPLES, 16);
  assert.equal(MAX_SAMPLES, 256);
  assert.equal(plannedSamples(0, 0), 16);
  // (0,9 × 30 / 4)² = 45,56 : 46 ; 100 / 4 = 25 ; le plus grand des deux.
  assert.equal(plannedSamples(30, 0), 46);
  assert.equal(plannedSamples(0, 100), 25);
  assert.equal(plannedSamples(30, 200), 50);
  assert.equal(plannedSamples(1000, 0), 256);
  assert.equal(plannedSamples(0, 5000), 256);
  // Exemples de docs/camera-physique.md (« Photo ») : « réglages par défaut : 16 rendus » ; « 135 mm à f/1.4, au point
  // sur Sophia : 256 rendus » (flou d'un point à l'infini : (135 / √2) × 135 / (6600 − 135) ≈ 1,99 mm, soit 83 px).
  const pixelsPerMm = PHOTO_LONG_SIDE / z6.sensorWidthMm;
  assert.equal(plannedSamples(cocAtInfinityMm(50, 8, 6.6) * pixelsPerMm, 0), 16);
  assert.equal(plannedSamples(cocAtInfinityMm(135, apertureValue(0), 6.6) * pixelsPerMm, 0), 256);
});

test("disque de l'œil élargi de S / (S − f) : au bord du disque, un point à la profondeur D bouge d'un demi-cercle de confusion", () => {
  // 50 mm à f/2, au point à 1 m : A = 25 mm ; rayon 12,5 mm × 1 / 0,95 ≈ 13,16 mm.
  assertClose(eyeDiskRadiusM(50, 2, 1), 0.0125 / 0.95, 1e-15, "exemple");
  // Œil déplacé du rayon du disque, projection décentrée (shiftedProjection) : sur le capteur (x_ndc × largeur / 2),
  // un point du plan de netteté ne bouge pas, et un point à la profondeur D bouge de cocAt(…) / 2 ; le flou de la
  // photo est donc celui de la lentille mince (c = A f |D − S| / (D (S − f))), malgré le modèle d'œil déplacé.
  for (const [focal, n, focus] of [[50, 2, 1], [135, apertureValue(0), 6.6], [24, 8, 3]] as const) {
    const projection = Matrix.PerspectiveFovLH(fieldOfView(z6.sensorHeightMm, focal), z6.sensorWidthMm / z6.sensorHeightMm, 0.01, 1000);
    const radius = eyeDiskRadiusM(focal, n, focus);
    const shifted = Matrix.FromArray(shiftedProjection(projection.asArray(), radius, 0, focus));
    const infinity = cocAtInfinityMm(focal, n, focus);
    for (const [x, depth] of [[0.3, focus], [0.3, focus / 2], [-1, focus * 3], [2, 100]] as const) {
      const central = Vector3.TransformCoordinates(new Vector3(x, 0.1, depth), projection).x;
      const moved = Vector3.TransformCoordinates(new Vector3(x - radius, 0.1, depth), shifted).x;
      const shiftMm = Math.abs(moved - central) * (z6.sensorWidthMm / 2);
      const what = `${focal} mm, f/${n.toFixed(2)}, au point à ${focus} m, point à ${depth} m`;
      assertClose(shiftMm, cocAt(infinity, focus, depth) / 2, 2e-5 * Math.max(1, infinity), what);
    }
  }
});

test("places de l'œil : rayon × √((i + 0,5) / M) à i × angle d'or ; chaque place vaut la même surface du disque", () => {
  for (const samples of [16, 17, 46, 256]) {
    let sumX = 0;
    let sumY = 0;
    let inner = 0;
    for (let i = 0; i < samples; i++) {
      const o = eyeOffset(i, samples, 2);
      const r = Math.hypot(o.x, o.y);
      assertClose(r, 2 * Math.sqrt((i + 0.5) / samples), 1e-12, `${samples} rendus, place ${i}`);
      assert.ok(r < 2);
      if (r <= 1) inner++;
      sumX += o.x;
      sumY += o.y;
    }
    // Un quart des places dans le demi-rayon : (i + 0,5) / M ≤ 1/4, soit ⌊M / 4 − 0,5⌋ + 1 places.
    assert.equal(inner, Math.floor(samples / 4 - 0.5) + 1, `${samples} rendus`);
    // Les places entourent le centre : leur moyenne en est à moins de 5 % du rayon (calcul de Claude, de 16 à 256 rendus :
    // 3,5 % au plus, pour 17).
    assert.ok(Math.hypot(sumX, sumY) / samples < 0.05 * 2, `${samples} rendus`);
  }
});

test("instants : i × pas modulo M parcourt chaque instant une fois, au milieu de M tranches égales du temps de pose", () => {
  // M = 16 : 0,618 × 16 ≈ 9,9, arrondi à 10, qui n'est pas premier avec 16 ; 11 l'est.
  assert.equal(instantStride(16), 11);
  assertClose(sampleInstant(1, 16, 11), 11.5 / 16, 1e-15, "deuxième rendu sur 16");
  for (let samples = MIN_SAMPLES; samples <= MAX_SAMPLES; samples++) {
    const stride = instantStride(samples);
    assert.ok(stride >= Math.round(samples * 0.618), `${samples}`);
    const slices = new Set<number>();
    for (let i = 0; i < samples; i++) {
      const t = sampleInstant(i, samples, stride);
      assert.ok(t > 0 && t < 1, `${samples}, rendu ${i}`);
      const slice = t * samples - 0.5;
      assertClose(slice, Math.round(slice), 1e-9, `${samples}, rendu ${i}`);
      slices.add(Math.round(slice));
    }
    assert.equal(slices.size, samples, `${samples} rendus`);
  }
});

test("lissage de la photo : 0,45 / √M", () => {
  assert.equal(smoothingFactor(16), 0.1125);
  assertClose(smoothingFactor(256), 0.028125, 1e-15, "256 rendus");
  assertClose(smoothingFactor(46), 0.45 / Math.sqrt(46), 1e-15, "46 rendus");
});
