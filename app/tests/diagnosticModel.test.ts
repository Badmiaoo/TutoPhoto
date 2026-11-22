// Tests rapides de diagnosticModel.ts (Sujet 28 du plan de corrections, constats ARC-06 et ARC-13) : paramètre de
// l'adresse, capacités de rendu en flottants exigées, compteur des images du viseur et lignes de l'affichage. Valeurs
// attendues : règles de l'en-tête du module, ou calcul écrit à côté du test. La lecture de Babylon.js et de la page
// (ui/diagnosticView.ts, main.ts, ui/shutter.ts) ne s'exécute pas ici : la routine de test (scripts/test_app.cjs)
// l'essaie dans le navigateur, extension masquée et témoin.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  REQUIRED_FLOAT_CAPS,
  SHOWN_FLOAT_CAPS,
  FrameMeter,
  decimal,
  diagnosticLines,
  diagnosticRequested,
  floatRenderMessage,
  fullDensityRequested,
  missingFloatRender,
  type DiagnosticReading,
  type FloatCaps,
} from "../src/diagnosticModel";
import { assertClose } from "./approx";

const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);

test("paramètre de l'adresse : « diagnostic », avec ou sans valeur, parmi d'autres", () => {
  for (const search of ["?diagnostic", "?diagnostic=1", "?diagnostic=", "?defi=SIT-05&diagnostic", "?diagnostic&defi=SIT-06"]) {
    assert.equal(diagnosticRequested(search), true, search);
  }
  for (const search of ["", "?", "?defi=SIT-05", "?diagnostics", "?Diagnostic", "?diag", "?x=diagnostic"]) {
    assert.equal(diagnosticRequested(search), false, search);
  }
});

test("densité complète : seulement « diagnostic=densite-complete »", () => {
  for (const search of ["?diagnostic=densite-complete", "?defi=SIT-01&diagnostic=densite-complete"]) {
    assert.equal(fullDensityRequested(search), true, search);
  }
  for (const search of ["", "?diagnostic", "?diagnostic=1", "?densite-complete", "?diagnostic=densite", "?diagnostic=Densite-complete"]) {
    assert.equal(fullDensityRequested(search), false, search);
  }
});

test("capacités exigées : les deux de la photo et de l'autofocus, et celles qui manquent, dans l'ordre", () => {
  assert.deepEqual([...REQUIRED_FLOAT_CAPS], ["textureFloatRender", "textureHalfFloatRender"]);
  assert.deepEqual(missingFloatRender({ textureFloatRender: true, textureHalfFloatRender: true }), []);
  assert.deepEqual(missingFloatRender({ textureFloatRender: false, textureHalfFloatRender: true }), ["textureFloatRender"]);
  assert.deepEqual(missingFloatRender({ textureFloatRender: true, textureHalfFloatRender: false }), ["textureHalfFloatRender"]);
  assert.deepEqual(missingFloatRender({ textureFloatRender: false, textureHalfFloatRender: false }), [
    "textureFloatRender",
    "textureHalfFloatRender",
  ]);
});

test("message des capacités : le déclencheur désactivé ; la mise au point et l'aperçu seulement sans textureFloatRender", () => {
  const both = floatRenderMessage(["textureFloatRender", "textureHalfFloatRender"]);
  assert.equal(
    both,
    `son navigateur ne sait pas rendre l'image dans des textures en flottants (textureFloatRender, textureHalfFloatRender${NBSP}: non)${NNBSP}; le bouton «${NBSP}Déclencher${NBSP}» est désactivé. La mise au point ne voit pas les sujets (elle se fait sur le sol ou le fond), et l'aperçu de la profondeur de champ floute tout le cadre.`,
  );
  // En WebGL 1, Babylon.js essaie les deux capacités l'une après l'autre : sans les demi-flottants seulement, la carte
  // de profondeur en flottants de 32 bits se rend, et rien n'est dit de la mise au point.
  const half = floatRenderMessage(["textureHalfFloatRender"]);
  assert.ok(half.includes(`(textureHalfFloatRender${NBSP}: non)`), half);
  assert.ok(!half.includes("mise au point"), half);
  assert.ok(floatRenderMessage(["textureFloatRender"]).endsWith("floute tout le cadre."));
});

test("capacités affichées : les deux exigées d'abord, puis colorBufferFloat et colorBufferHalfFloat (plan du Sujet 28)", () => {
  assert.deepEqual(SHOWN_FLOAT_CAPS.slice(0, 2), [...REQUIRED_FLOAT_CAPS]);
  for (const name of ["colorBufferFloat", "colorBufferHalfFloat", "textureHalfFloatLinearFiltering"]) {
    assert.ok((SHOWN_FLOAT_CAPS as readonly string[]).includes(name), name);
  }
  assert.equal(new Set(SHOWN_FLOAT_CAPS).size, SHOWN_FLOAT_CAPS.length);
});

test("compteur des images : moyenne des durées, phases des textures additionnées, images par seconde", () => {
  const meter = new FrameMeter(1000);
  // Image 1 : de 1000 à 1010 ms (10 ms), textures de 1001 à 1003 (2 ms).
  meter.beginFrame(1000);
  meter.beginTargets(1001);
  meter.endTargets(1003);
  meter.endFrame(1010);
  // Image 2 : de 1500 à 1520 ms (20 ms), deux phases, de 1501 à 1504 (3 ms) et de 1510 à 1511 (1 ms).
  meter.beginFrame(1500);
  meter.beginTargets(1501);
  meter.endTargets(1504);
  meter.beginTargets(1510);
  meter.endTargets(1511);
  meter.endFrame(1520);
  const w = meter.take(2000);
  // Fenêtre de 1000 ms ; 2 images ; durée moyenne (10 + 20) / 2 = 15 ms ; textures (2 + 4) / 2 = 3 ms.
  assert.equal(w.frames, 2);
  assertClose(w.seconds, 1, 1e-12, "durée de la fenêtre");
  assertClose(w.fps, 2, 1e-12, "images par seconde");
  assertClose(w.frameMs ?? NaN, 15, 1e-12, "durée moyenne d'une image");
  assertClose(w.targetsMs ?? NaN, 3, 1e-12, "durée moyenne des textures de rendu");
});

test("compteur des images : débit sur une fenêtre de 2 s ; deux fenêtres pleines de suite, chacune ses propres images", () => {
  const meter = new FrameMeter(0);
  // Trois images de 10, 20 et 30 ms en 2 s : 1,5 image par seconde, durée moyenne 20 ms.
  for (const [start, length] of [[100, 10], [700, 20], [1500, 30]]) {
    meter.beginFrame(start);
    meter.beginTargets(start + 1);
    meter.endTargets(start + 1 + length / 10);
    meter.endFrame(start + length);
  }
  const first = meter.take(2000);
  assertClose(first.fps, 1.5, 1e-12, "images par seconde sur 2 s");
  assertClose(first.frameMs ?? NaN, 20, 1e-12, "durée moyenne, première fenêtre");
  assertClose(first.targetsMs ?? NaN, 2, 1e-12, "textures, première fenêtre ((1 + 2 + 3) / 3)");
  // Seconde fenêtre, de 2000 à 2500 ms : une image de 4 ms, textures de 1 ms ; rien de la première n'y reste.
  meter.beginFrame(2100);
  meter.beginTargets(2101);
  meter.endTargets(2102);
  meter.endFrame(2104);
  const second = meter.take(2500);
  assert.equal(second.frames, 1);
  assertClose(second.fps, 2, 1e-12, "une image en 0,5 s");
  assertClose(second.frameMs ?? NaN, 4, 1e-12, "durée moyenne, seconde fenêtre");
  assertClose(second.targetsMs ?? NaN, 1, 1e-12, "textures, seconde fenêtre");
});

test("compteur des images : fenêtre neuve après un bilan ; sans image, ni durée ni débit", () => {
  const meter = new FrameMeter(0);
  meter.beginFrame(10);
  meter.endFrame(14);
  assert.equal(meter.take(500).frames, 1);
  const empty = meter.take(1500);
  assert.deepEqual(empty, { seconds: 1, frames: 0, fps: 0, frameMs: null, targetsMs: null });
  // Fenêtre de durée nulle : pas de division par zéro.
  assert.equal(meter.take(1500).fps, 0);
});

test("compteur des images : image finie dans la fenêtre suivante, phase hors d'une image, fin sans début", () => {
  const meter = new FrameMeter(0);
  // Phase des textures hors d'une image (rendu de la scène hors de la boucle) : ignorée.
  meter.beginTargets(5);
  meter.endTargets(50);
  // Fin d'image sans début : ignorée.
  meter.endFrame(60);
  // Image commencée avant le bilan, finie après : comptée dans la fenêtre où elle finit, avec sa durée entière.
  meter.beginFrame(900);
  meter.beginTargets(950);
  const first = meter.take(1000);
  assert.equal(first.frames, 0);
  meter.endTargets(1010);
  meter.endFrame(1100);
  const second = meter.take(2000);
  assert.equal(second.frames, 1);
  assertClose(second.frameMs ?? NaN, 200, 1e-12, "durée de l'image à cheval sur deux fenêtres");
  assertClose(second.targetsMs ?? NaN, 60, 1e-12, "textures de l'image à cheval");
});

test("compteur des images : une image recommencée avant sa fin ne garde que le second début", () => {
  const meter = new FrameMeter(0);
  meter.beginFrame(10);
  meter.beginTargets(11);
  meter.endTargets(15);
  meter.beginFrame(20);
  meter.endFrame(30);
  const w = meter.take(1000);
  assert.equal(w.frames, 1);
  assertClose(w.frameMs ?? NaN, 10, 1e-12, "durée depuis le second début");
  assertClose(w.targetsMs ?? NaN, 0, 1e-12, "textures du premier début oubliées");
});

test("nombres à virgule décimale", () => {
  assert.equal(decimal(59.83, 1), "59,8");
  assert.equal(decimal(2, 2), "2,00");
  assert.equal(decimal(0.05, 1), "0,1");
  assert.equal(decimal(12, 0), "12");
});

const allCaps = (value: boolean): FloatCaps =>
  Object.fromEntries(SHOWN_FLOAT_CAPS.map((name) => [name, value])) as FloatCaps;

function reading(overrides: Partial<DiagnosticReading> = {}): DiagnosticReading {
  return {
    version: `Version du site${NBSP}: 0.3.88`,
    webgl: 2,
    renderer: "processeur d'essai",
    screenDensity: 2.625,
    renderDensity: 2,
    renderWidth: 824,
    renderHeight: 882,
    window: { seconds: 1, frames: 60, fps: 59.83, frameMs: 4.24, targetsMs: 1.06 },
    gpu: { state: "measured", ms: 12.34 },
    caps: allCaps(true),
    ...overrides,
  };
}

test("lignes de l'affichage : version, WebGL, densités, débit, durées, capacités", () => {
  const lines = diagnosticLines(reading());
  assert.deepEqual(lines, [
    `Diagnostic (moyennes sur 1 s) · Version du site${NBSP}: 0.3.88`,
    "WebGL 2 · processeur d'essai",
    `Densité${NBSP}: écran 2,63, viseur 2,00 · image de 824 × 882 px`,
    `Images par seconde${NBSP}: 59,8`,
    `Durée d'une image, processeur${NBSP}: 4,2 ms (textures de rendu${NBSP}: 1,1 ms)`,
    `Durée d'une image, processeur graphique${NBSP}: 12,3 ms`,
    `Rendu en flottants${NBSP}: textureFloatRender oui, textureHalfFloatRender oui, colorBufferFloat oui, colorBufferHalfFloat oui, textureHalfFloatLinearFiltering oui`,
  ]);
});

test("lignes de l'affichage : sans image, sans extension de mesure, WebGL 1 sans horodatage, en attente, capacités absentes", () => {
  const stopped = diagnosticLines(
    reading({ window: { seconds: 1, frames: 0, fps: 0, frameMs: null, targetsMs: null }, gpu: { state: "missing", extension: "EXT_disjoint_timer_query_webgl2" } }),
  );
  assert.equal(stopped.length, 6);
  assert.ok(stopped[3].startsWith("Aucune image du viseur dans la dernière seconde"), stopped[3]);
  assert.equal(stopped[4], `Durée d'une image, processeur graphique${NBSP}: non mesurée (EXT_disjoint_timer_query_webgl2 absente)`);
  const waiting = diagnosticLines(reading({ gpu: { state: "waiting" } }));
  assert.equal(waiting[5], `Durée d'une image, processeur graphique${NBSP}: en attente d'une mesure`);
  const webgl1 = diagnosticLines(reading({ webgl: 1, gpu: { state: "unsupported" } }));
  assert.equal(webgl1[5], `Durée d'une image, processeur graphique${NBSP}: non mesurée (WebGL 1 sans horodatage, que Babylon.js 9.35.0 ne mesure qu'une fois)`);
  const masked = diagnosticLines(reading({ caps: { ...allCaps(true), textureFloatRender: false, textureHalfFloatRender: false, colorBufferFloat: false } }));
  assert.equal(
    masked[6],
    `Rendu en flottants${NBSP}: textureFloatRender non, textureHalfFloatRender non, colorBufferFloat non, colorBufferHalfFloat oui, textureHalfFloatLinearFiltering oui`,
  );
});
