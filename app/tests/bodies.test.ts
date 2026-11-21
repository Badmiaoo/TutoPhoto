// Tests rapides de camera/bodies.ts (Sujet 26 du plan de corrections, constat ARC-05) : les trois boîtiers de
// référence et la définition du capteur. Ce qui est attendu : en-tête du module et commentaires de ses champs
// (décision D4, choix 4 et 5 de la version 0.3.79). Les valeurs mesurées (dimensions, capacité, bruit de lecture) ne
// sont pas recopiées ici : leurs sources sont dans data/sources.yaml, et un test qui les recopierait ne vérifierait
// rien de plus que le fichier lui-même.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BODIES, findBody, sensorPixels, type Brand } from "../src/camera/bodies";
import { SCALES, isoValue } from "../src/camera/exposure";
import { assertClose } from "./approx";

test("trois boîtiers de référence, un par marque : Nikon Z 6, Sony A6000, Canon EOS R50", () => {
  assert.deepEqual(
    BODIES.map((b) => [b.brand, b.model, b.format]),
    [
      ["nikon", "Nikon Z 6", "ff"],
      ["sony", "Sony A6000", "apsc"],
      ["canon", "Canon EOS R50", "apsc"],
    ],
  );
  for (const body of BODIES) assert.equal(findBody(body.brand), body);
  assert.throws(() => findBody("pentax" as Brand), /Boîtier inconnu : pentax/);
});

test("capteur : grand côté d'abord, définition et capacité positives, couverture de l'autofocus dans le cadre", () => {
  for (const body of BODIES) {
    assert.ok(body.sensorWidthMm > body.sensorHeightMm && body.sensorHeightMm > 0, body.model);
    assert.ok(body.effectivePixels > 0 && body.fullWellElectrons > 0, body.model);
    for (const coverage of [body.afCoverage, body.afCoverageAuto]) {
      if (!coverage) continue;
      for (const fraction of [coverage.horizontal, coverage.vertical]) assert.ok(fraction > 0 && fraction <= 1, body.model);
    }
  }
});

test("bruit de lecture : une mesure par cran de l'échelle des ISO, par ISO croissant", () => {
  // « ISO lus sur le graphique, 3,125 × 2^x arrondi » (en-tête du module) : chaque mesure est celle d'un cran de
  // l'échelle de TutoPhoto (100 × 2^(i/3)), à moins d'un sixième d'IL, la moitié d'un cran (251 pour 252, par exemple).
  for (const body of BODIES) {
    assert.equal(body.readNoise.length, SCALES.iso, body.model);
    body.readNoise.forEach(([iso, electrons], i) => {
      const what = `${body.model}, ISO ${iso}`;
      assert.ok(Math.abs(Math.log2(iso / isoValue(i))) < 1 / 6, what);
      assert.ok(electrons > 0, what);
      if (i > 0) assert.ok(iso > body.readNoise[i - 1][0], what);
    });
  }
});

test("définition du capteur : grand côté × petit côté = pixels effectifs, dans les proportions du capteur", () => {
  // Commentaire de sensorPixels : √(pixels effectifs × grand côté / petit côté) et son complément.
  for (const body of BODIES) {
    const { long, short } = sensorPixels(body);
    assertClose(long * short, body.effectivePixels, body.effectivePixels * 1e-12, body.model);
    assertClose(long / short, body.sensorWidthMm / body.sensorHeightMm, 1e-12, body.model);
  }
});
