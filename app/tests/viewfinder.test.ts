// Tests rapides de camera/viewfinder.ts (Sujet 26 du plan de corrections, constat ARC-05) : cadre du viseur et champ de
// vue de la caméra 3D. Comportement attendu : en-tête du module et docs/camera-physique.md, « Boîtier virtuel » (cadre
// vertical si la zone du viseur est plus haute que large, horizontal sinon ; champ de vue de 2 × atan(grand côté du
// capteur / (2 × focale)) le long de son grand côté). Depuis la version 0.3.87 (Sujet 27, constat INT-14), aussi les
// positions des lignes des grilles de cadrage, que la routine de test vérifiait seule (scripts/test_app.cjs) : elle
// mesure toujours leur dessin dans la page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BODIES, findBody } from "../src/camera/bodies";
import { FOCAL_LENGTHS } from "../src/camera/exposure";
import { fieldOfView } from "../src/camera/optics";
import { GRIDS, cameraFov, frameFor, gridLines, isGridKind } from "../src/camera/viewfinder";
import { assertClose } from "./approx";

// Tailles de canevas : fenêtre du profil ordinateur de la routine (1280 × 800, scripts/test_app.cjs), prise ici comme
// canevas ; viseur du Pixel 7 émulé relevé dans la CI (412 × 445) et
// de l'iPhone SE émulé, vue de dessus dépliée (320 × 63), tous deux dans « Défauts connus » de
// docs/etat-des-travaux.md ; et d'autres formes, dont un carré et un canevas plus haut que large.
const CANVASES: readonly [number, number][] = [
  [1280, 800],
  [412, 445],
  [390, 273],
  [320, 63],
  [800, 800],
  [300, 1000],
];

test("cadre : le plus grand aux proportions du capteur qui tient dans le canevas, centré", () => {
  for (const body of BODIES) {
    const ratio = body.sensorWidthMm / body.sensorHeightMm;
    for (const [w, h] of CANVASES) {
      const frame = frameFor(w, h, body);
      const what = `${body.model}, ${w} × ${h}`;
      assert.equal(frame.portrait, h > w, what);
      assertClose(frame.width / frame.height, frame.portrait ? 1 / ratio : ratio, 1e-12, what);
      assert.ok(frame.width <= w + 1e-9 && frame.height <= h + 1e-9, what);
      // Le plus grand : il touche deux bords opposés du canevas.
      assert.ok(Math.abs(frame.width - w) < 1e-9 || Math.abs(frame.height - h) < 1e-9, what);
      assertClose(2 * frame.left + frame.width, w, 1e-9, `${what}, centré en largeur`);
      assertClose(2 * frame.top + frame.height, h, 1e-9, `${what}, centré en hauteur`);
    }
  }
});

test("exemple : canevas de 1280 × 800, Z 6 : cadre horizontal de 800 × 35,9 / 23,9 ≈ 1201,7 px de large", () => {
  const frame = frameFor(1280, 800, findBody("nikon"));
  assert.equal(frame.portrait, false);
  assert.equal(frame.height, 800);
  assertClose(frame.width, (800 * 35.9) / 23.9, 1e-9, "largeur");
  assertClose(frame.left, (1280 - (800 * 35.9) / 23.9) / 2, 1e-9, "marge");
  assert.equal(frame.top, 0);
});

test("champ de vue : le cadre montre le champ du grand côté du capteur ; le canevas, plus grand, voit un peu plus", () => {
  for (const body of BODIES) {
    for (const focal of FOCAL_LENGTHS) {
      const sensorFov = fieldOfView(body.sensorWidthMm, focal);
      for (const [w, h] of CANVASES) {
        const frame = frameFor(w, h, body);
        const camera = cameraFov(w, h, frame, body, focal);
        const what = `${body.model}, ${focal} mm, ${w} × ${h}`;
        assert.equal(camera.axis, frame.portrait ? "vertical" : "horizontal", what);
        // Le long de cet axe, le cadre occupe frame / canevas de la largeur de l'image : sous la caméra 3D, il se voit
        // sous l'angle 2 × atan(tan(champ / 2) × frame / canevas), qui doit valoir le champ du capteur.
        const share = frame.portrait ? frame.height / h : frame.width / w;
        assertClose(2 * Math.atan(Math.tan(camera.fov / 2) * share), sensorFov, 1e-12, what);
        assert.ok(camera.fov >= sensorFov - 1e-12, what);
      }
    }
  }
});

test("grilles de cadrage : tiers, seize cases, vingt-quatre cases, tiers et diagonales ; aucune ligne pour « none »", () => {
  assert.deepEqual(Object.keys(GRIDS), ["none", "thirds", "sixteen", "twentyFour", "thirdsDiagonals"]);
  const close = (actual: readonly number[], expected: number[], what: string) => {
    assert.equal(actual.length, expected.length, what);
    expected.forEach((value, i) => assertClose(actual[i], value, 1e-15, `${what}, ligne ${i + 1}`));
  };
  // « none » : aucune ligne, sans diagonale.
  assert.deepEqual(gridLines("none", false), { vertical: [], horizontal: [], diagonals: false });
  for (const tall of [false, true]) {
    const sens = tall ? "cadre vertical" : "cadre horizontal";
    // « Tiers » : quatre lignes à 1/3 et 2/3 du cadre.
    const thirds = gridLines("thirds", tall);
    close(thirds.vertical, [1 / 3, 2 / 3], `tiers, verticales, ${sens}`);
    close(thirds.horizontal, [1 / 3, 2 / 3], `tiers, horizontales, ${sens}`);
    assert.equal(thirds.diagonals, false);
    // « Seize cases » : six lignes à 1/4, 1/2 et 3/4.
    const sixteen = gridLines("sixteen", tall);
    close(sixteen.vertical, [1 / 4, 1 / 2, 3 / 4], `seize cases, verticales, ${sens}`);
    close(sixteen.horizontal, [1 / 4, 1 / 2, 3 / 4], `seize cases, horizontales, ${sens}`);
    // « Tiers et diagonales » : les tiers, et deux diagonales.
    const diagonals = gridLines("thirdsDiagonals", tall);
    close(diagonals.vertical, [1 / 3, 2 / 3], `tiers et diagonales, ${sens}`);
    assert.equal(diagonals.diagonals, true);
  }
  // « Vingt-quatre cases » : six cases sur le grand côté du cadre (cinq lignes) et quatre sur le petit (trois), qui
  // suivent le grand côté quand le cadre est vertical.
  const sixths = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6];
  const wide = gridLines("twentyFour", false);
  close(wide.vertical, sixths, "vingt-quatre cases, cadre horizontal, verticales");
  close(wide.horizontal, [1 / 4, 1 / 2, 3 / 4], "vingt-quatre cases, cadre horizontal, horizontales");
  const tall = gridLines("twentyFour", true);
  close(tall.vertical, [1 / 4, 1 / 2, 3 / 4], "vingt-quatre cases, cadre vertical, verticales");
  close(tall.horizontal, sixths, "vingt-quatre cases, cadre vertical, horizontales");
});

test("grilles : seuls les cinq noms connus sont acceptés à la relecture de la mémoire du navigateur", () => {
  for (const kind of Object.keys(GRIDS)) assert.equal(isGridKind(kind), true, kind);
  for (const value of ["", "Thirds", "toString", "__proto__", 3, null, undefined]) assert.equal(isGridKind(value), false, String(value));
});
