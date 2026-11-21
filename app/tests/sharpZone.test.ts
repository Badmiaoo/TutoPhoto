// Tests rapides de camera/sharpZone.ts (Sujet 26 du plan de corrections, constat ARC-05) : flou acceptable et limites
// de la zone nette. Valeurs attendues : formule du cercle de confusion de l'en-tête du module
// [wikipedia-circle-of-confusion], et exemples de docs/camera-physique.md, « Défis et bulletin ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { BODIES, findBody } from "../src/camera/bodies";
import { FOCAL_LENGTHS, SCALES, apertureValue } from "../src/camera/exposure";
import { blurLimitMm, sharpZone } from "../src/camera/sharpZone";
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
