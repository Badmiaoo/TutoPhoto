// Tests rapides de camera/viewfinder.ts (Sujet 26 du plan de corrections, constat ARC-05) : cadre du viseur et champ de
// vue de la caméra 3D. Comportement attendu : en-tête du module et docs/camera-physique.md, « Boîtier virtuel » (cadre
// vertical si la zone du viseur est plus haute que large, horizontal sinon ; champ de vue de 2 × atan(grand côté du
// capteur / (2 × focale)) le long de son grand côté).
import { test } from "node:test";
import assert from "node:assert/strict";
import { BODIES, findBody } from "../src/camera/bodies";
import { FOCAL_LENGTHS, fieldOfView } from "../src/camera/exposure";
import { cameraFov, frameFor } from "../src/camera/viewfinder";
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
