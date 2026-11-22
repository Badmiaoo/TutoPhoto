// Tests rapides de activities/lum02Model.ts (Sujet 27 du plan de corrections, constat INT-14) : le calcul de l'ombre de
// l'activité de LUM-02, que la routine de test vérifiait seule, dans la page (scripts/test_app.cjs, « activité
// LUM-02 »), et qu'elle y vérifie toujours, avec le texte écrit et le dessin. Valeurs attendues : formules de l'en-tête
// du module (triangles semblables), et les deux cas de la routine.
import { test } from "node:test";
import assert from "node:assert/strict";
import { OBJECT_CM, PRESETS, WALL_GAP_CM, WALL_HALF_CM, litFraction, penumbraReading, rayOnWall, shadow } from "../src/activities/lum02Model";
import { assertClose } from "./approx";

test("dimensions de l'activité : objet de 30 cm, mur à 50 cm derrière, mur dessiné de −100 à +100 cm ; trois exemples", () => {
  assert.equal(OBJECT_CM, 30);
  assert.equal(WALL_GAP_CM, 50);
  assert.equal(WALL_HALF_CM, 100);
  assert.deepEqual(PRESETS, { lamp: { size: 3, distance: 100 }, window: { size: 120, distance: 200 }, reflector: { size: 80, distance: 80 } });
});

test("exemple « Grande fenêtre » de la routine : 120 cm à 200 cm, pénombre de 120 × 50 / 200 = 30 cm", () => {
  const { size, distance } = PRESETS.window;
  assert.deepEqual([size, distance], [120, 200]);
  const r = shadow(size, distance);
  assertClose(r.penumbraCm, 30, 1e-12, "pénombre");
  // Ombre pleine : 30 × 250 / 200 − 30 = 7,5 cm ; bord extérieur : (30 × 250 + 120 × 50) / 400 = 33,75 cm.
  assertClose(r.umbraCm, 7.5, 1e-12, "ombre pleine");
  assertClose(r.outerCm, 33.75, 1e-12, "bord extérieur");
  // Taille apparente de la source vue de l'objet : 2 × atan(120 / 400) ≈ 33,4°.
  assertClose(r.angleDeg, (2 * Math.atan(0.3) * 180) / Math.PI, 1e-12, "taille apparente");
  assert.deepEqual(penumbraReading(size, distance), { cm: r.penumbraCm, wholeShadow: false, beyondWall: false });
});

test("cas de la routine : source de 150 cm à 20 cm, pas d'ombre pleine, pénombre de 480 cm, au-delà du mur dessiné", () => {
  // 30 × 70 / 20 + 150 × 50 / 20 = 105 + 375 = 480 cm de haut ; bord extérieur à 240 cm de l'axe, au-delà de 100 cm.
  const r = shadow(150, 20);
  assert.equal(r.umbraCm, 0);
  assertClose(r.outerCm, 240, 1e-12, "bord extérieur");
  const reading = penumbraReading(150, 20);
  assertClose(reading.cm, 480, 1e-12, "pénombre");
  assert.equal(reading.wholeShadow, true);
  assert.equal(reading.beyondWall, true);
  // Bord extérieur à 100 cm exactement, au bord du mur dessiné ((30 × 70 + 38 × 50) / 40 = 100) : pas au-delà ; à
  // 101,25 cm (39 cm de source), au-delà (relecture de la version 0.3.87, C6). Deux réglages permis par les curseurs.
  assert.equal(shadow(38, 20).outerCm, 100);
  assert.equal(penumbraReading(38, 20).beyondWall, false);
  assert.equal(penumbraReading(39, 20).beyondWall, true);
});

test("ombre pleine : nulle dès que la source, vue du mur, déborde l'objet ; pénombre de D × d₂ / d₁ sinon", () => {
  for (const d1 of [20, 50, 100, 200]) {
    for (const d of [1, 3, 30, 80, 120, 150]) {
      const r = shadow(d, d1);
      const what = `${d} cm à ${d1} cm`;
      assertClose(r.penumbraCm, (d * WALL_GAP_CM) / d1, 1e-12, what);
      assertClose(r.umbraCm, Math.max(0, (OBJECT_CM * (d1 + WALL_GAP_CM)) / d1 - (d * WALL_GAP_CM) / d1), 1e-12, what);
      // Ombre pleine + deux pénombres = 2 × bord extérieur, tant qu'il y a une ombre pleine.
      if (r.umbraCm > 0) assertClose(r.umbraCm + 2 * r.penumbraCm, 2 * r.outerCm, 1e-9, what);
      const reading = penumbraReading(d, d1);
      assert.equal(reading.wholeShadow, r.umbraCm === 0, what);
      assert.equal(reading.beyondWall, r.outerCm > WALL_HALF_CM, what);
    }
  }
  // Lampe de 3 cm à 100 cm : pénombre de 1,5 cm, ombre pleine de 30 × 150 / 100 − 1,5 = 43,5 cm.
  assertClose(shadow(PRESETS.lamp.size, PRESETS.lamp.distance).umbraCm, 43.5, 1e-12, "lampe");
});

test("rayons dessinés : ceux qui rasent l'objet bordent l'ombre pleine et la pénombre calculées", () => {
  // Rayon du haut de la source qui rase le bas de l'objet : bord extérieur de la pénombre, en bas ; rayon du bas de la
  // source qui rase le bas de l'objet : bord de l'ombre pleine, en bas (relecture de la version 0.3.87, C8).
  for (const [d, d1] of [[120, 200], [3, 100], [80, 80], [10, 40]] as const) {
    const r = shadow(d, d1);
    const what = `${d} cm à ${d1} cm`;
    assertClose(rayOnWall(d / 2, -OBJECT_CM / 2, d1), -r.outerCm, 1e-12, `${what}, bord extérieur`);
    assertClose(rayOnWall(-d / 2, OBJECT_CM / 2, d1), r.outerCm, 1e-12, `${what}, bord extérieur, en haut`);
    if (r.umbraCm > 0) assertClose(rayOnWall(-d / 2, -OBJECT_CM / 2, d1), -r.umbraCm / 2, 1e-12, `${what}, ombre pleine`);
  }
  // Grande fenêtre : 60 + (−15 − 60) × 250 / 200 = −33,75 cm.
  assertClose(rayOnWall(60, -15, 200), -33.75, 1e-12, "grande fenêtre");
});

test("éclairement du mur : 0 dans l'ombre pleine, 1 hors de l'ombre, entre les deux dans la pénombre", () => {
  // Grande fenêtre : ombre pleine sur |y| ≤ 3,75 cm, pénombre jusqu'à 33,75 cm.
  const { size, distance } = PRESETS.window;
  assert.equal(litFraction(0, size, distance), 0);
  assert.equal(litFraction(3, size, distance), 0);
  assert.equal(litFraction(34, size, distance), 1);
  assert.equal(litFraction(-90, size, distance), 1);
  let previous = 0;
  for (let y = 3.75; y <= 33.75; y += 2.5) {
    const lit = litFraction(y, size, distance);
    assert.ok(lit >= previous && lit <= 1, `y = ${y} cm`);
    previous = lit;
  }
  // Au milieu de la pénombre (y = 18,75 cm), la moitié de la source est vue.
  assertClose(litFraction(18.75, size, distance), 0.5, 1e-12, "milieu de la pénombre");
});
