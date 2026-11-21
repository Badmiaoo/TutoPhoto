// Tests rapides de camera/exposure.ts (Sujet 26 du plan de corrections, constat ARC-05) : échelles par tiers d'IL,
// indice de lumination des réglages, écart à la scène, focales et champ de vue. Valeurs attendues : formules de
// l'en-tête du module et de camera/exposureModes.ts, exemples de docs/camera-physique.md (« Exposition », « Boîtier
// virtuel », « Modes d'exposition, correction et ISO auto »), ou calcul écrit à côté du test.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_FOCAL_INDEX,
  DEFAULT_SETTINGS,
  FOCAL_LENGTHS,
  SCALES,
  SCENE_EV100,
  apertureLabel,
  apertureValue,
  exposureOffset,
  fieldOfView,
  isoLabel,
  isoValue,
  settingsEv100,
  shutterIndexOf,
  shutterLabel,
  shutterSeconds,
} from "../src/camera/exposure";
import { assertClose } from "./approx";

/** Durée écrite par un libellé de vitesse : « 1/250 » vaut 1/250 s, « 0.8 » 0,8 s, « 30 » 30 s. */
function labelSeconds(label: string): number {
  const [numerator, denominator] = label.split("/");
  return denominator === undefined ? Number(numerator) : Number(numerator) / Number(denominator);
}

test("échelles : de f/1.4 à f/22, de 30 s à 1/4000 s, de ISO 100 à 6400, par tiers d'IL", () => {
  // docs/camera-physique.md, « Boîtier virtuel » : « ouverture de f/1.4 à f/22, vitesse de 30 s à 1/4000 s, ISO de 100
  // à 6400, par tiers ».
  assert.deepEqual(SCALES, { aperture: 25, shutter: 52, iso: 19 });
  assert.equal(apertureLabel(0), "1.4");
  assert.equal(apertureLabel(SCALES.aperture - 1), "22");
  assert.equal(shutterLabel(0), "30");
  assert.equal(shutterLabel(SCALES.shutter - 1), "1/4000");
  assert.equal(isoLabel(0), "100");
  assert.equal(isoLabel(SCALES.iso - 1), "6400");
  // Valeurs exactes des bornes : N = 2^(j/6) pour j = 3 et 27, t = 2^(−k/3) pour k = −15 et 36, S = 100 × 2^(i/3).
  assertClose(apertureValue(0), Math.SQRT2, 1e-12, "f/1.4");
  assertClose(apertureValue(SCALES.aperture - 1), 2 ** 4.5, 1e-12, "f/22");
  assertClose(shutterSeconds(0), 32, 1e-12, "30 s");
  assertClose(shutterSeconds(SCALES.shutter - 1), 2 ** -12, 1e-15, "1/4000 s");
  assertClose(isoValue(0), 100, 1e-12, "ISO 100");
  assertClose(isoValue(SCALES.iso - 1), 6400, 1e-9, "ISO 6400");
  // Trois crans font un IL : N² double, t est divisé par deux, S double.
  for (let a = 0; a + 3 < SCALES.aperture; a++) {
    assertClose(apertureValue(a + 3) ** 2 / apertureValue(a) ** 2, 2, 1e-12, `ouvertures ${a} et ${a + 3}`);
  }
  for (let s = 0; s + 3 < SCALES.shutter; s++) {
    assertClose(shutterSeconds(s + 3) / shutterSeconds(s), 0.5, 1e-12, `vitesses ${s} et ${s + 3}`);
  }
  for (let i = 0; i + 3 < SCALES.iso; i++) {
    assertClose(isoValue(i + 3) / isoValue(i), 2, 1e-12, `sensibilités ${i} et ${i + 3}`);
  }
});

test("chaque libellé désigne son cran : à moins d'un sixième d'IL de la valeur exacte du calcul", () => {
  // Les écrans montrent les libellés usuels, les calculs prennent les valeurs exactes (en-tête du module). Écart en IL
  // entre les deux : 2 × log₂(N du libellé / N exact) pour une ouverture (l'IL compte N²), log₂ du rapport pour une
  // vitesse ou une sensibilité. Au-delà d'un sixième d'IL, la moitié d'un cran, le libellé serait plus près du cran
  // voisin que du sien. Les plus grands écarts sont de 0,08 IL (f/11, f/22) et 0,09 IL (30 s, 15 s, 1/15 s, 1/30 s,
  // 1/60 s).
  for (let a = 0; a < SCALES.aperture; a++) {
    const gap = 2 * Math.abs(Math.log2(Number(apertureLabel(a)) / apertureValue(a)));
    assert.ok(gap < 1 / 6, `f/${apertureLabel(a)} : ${gap.toFixed(3)} IL de la valeur exacte`);
    if (a > 0) assert.ok(Number(apertureLabel(a)) > Number(apertureLabel(a - 1)), `f/${apertureLabel(a)} après f/${apertureLabel(a - 1)}`);
  }
  for (let s = 0; s < SCALES.shutter; s++) {
    const gap = Math.abs(Math.log2(labelSeconds(shutterLabel(s)) / shutterSeconds(s)));
    assert.ok(gap < 1 / 6, `${shutterLabel(s)} s : ${gap.toFixed(3)} IL de la valeur exacte`);
    if (s > 0) assert.ok(labelSeconds(shutterLabel(s)) < labelSeconds(shutterLabel(s - 1)), `${shutterLabel(s)} s après ${shutterLabel(s - 1)} s`);
  }
  for (let i = 0; i < SCALES.iso; i++) {
    const gap = Math.abs(Math.log2(Number(isoLabel(i)) / isoValue(i)));
    assert.ok(gap < 1 / 6, `ISO ${isoLabel(i)} : ${gap.toFixed(3)} IL de la valeur exacte`);
    if (i > 0) assert.ok(Number(isoLabel(i)) > Number(isoLabel(i - 1)), `ISO ${isoLabel(i)} après ISO ${isoLabel(i - 1)}`);
  }
});

test("shutterIndexOf retrouve la place de chaque libellé de vitesse, et rend −1 hors de l'échelle", () => {
  for (let s = 0; s < SCALES.shutter; s++) assert.equal(shutterIndexOf(shutterLabel(s)), s);
  assert.equal(shutterIndexOf("1/90"), -1);
  assert.equal(shutterIndexOf(""), -1);
});

test("EV₁₀₀ des réglages : log₂(N²/t) − log₂(S/100), soit (a + s − i − 12) / 3 en places dans les échelles", () => {
  // Formule de Filament [filament-pbr] ; sa forme en places a, s et i (0 pour f/1.4, 30 s et ISO 100) est écrite dans
  // l'en-tête de camera/exposureModes.ts et dans docs/camera-physique.md (« Modes d'exposition, correction et ISO
  // auto », « Calcul »). Les 25 × 52 × 19 = 24 700 réglages possibles.
  for (let a = 0; a < SCALES.aperture; a++) {
    for (let s = 0; s < SCALES.shutter; s++) {
      for (let i = 0; i < SCALES.iso; i++) {
        assertClose(settingsEv100({ aperture: a, shutter: s, iso: i }), (a + s - i - 12) / 3, 1e-12, `a = ${a}, s = ${s}, i = ${i}`);
      }
    }
  }
  // Exemple : f/16 (N = 2^4 exactement), « 1/125 » (t = 2^−7 exactement) et ISO 100 : log₂(256 × 128) = 15.
  const f16 = { aperture: 21, shutter: shutterIndexOf("1/125"), iso: 0 };
  assert.equal(apertureLabel(f16.aperture), "16");
  assertClose(settingsEv100(f16), 15, 1e-12, "f/16, 1/125 s, ISO 100");
});

test("réglages de départ : f/8, 1/100 s, ISO 100, soit EV₁₀₀ 38/3 ≈ 12,67, à −1/6 IL de la scène à 12,5", () => {
  // Commentaire de DEFAULT_SETTINGS ; scène de parc à EV₁₀₀ 12,5 (docs/camera-physique.md, « Exposition »).
  assert.equal(SCENE_EV100, 12.5);
  assert.equal(apertureLabel(DEFAULT_SETTINGS.aperture), "8");
  assert.equal(shutterLabel(DEFAULT_SETTINGS.shutter), "1/100");
  assert.equal(isoLabel(DEFAULT_SETTINGS.iso), "100");
  assertClose(settingsEv100(DEFAULT_SETTINGS), 38 / 3, 1e-12, "EV₁₀₀ de départ");
  assertClose(exposureOffset(DEFAULT_SETTINGS), -1 / 6, 1e-12, "écart de départ");
});

test("exemple de docs/camera-physique.md : à ISO 100 et f/8, l'exposition correcte demande t = 64 / 2^12,5 ≈ 1/90 s", () => {
  // « Exemple : à ISO 100 et f/8, l'exposition correcte demande N²/t = 2^12,5 ≈ 5 793, soit t = 64 / 5 793 ≈ 1/90 s. »
  // 2^12,5 / 64 = 90,51 : 1/t vaut 90,5 à 0,05 près.
  assertClose(1 / (64 / 2 ** SCENE_EV100), 90.5, 0.05, "1 / t");
  // Ce temps tombe à mi-chemin, en IL, entre les crans « 1/80 » (t = 2^(−19/3)) et « 1/100 » (t = 2^(−20/3)) :
  // +1/6 IL d'un côté, −1/6 IL de l'autre. C'est l'égalité entre deux crans que tranche camera/exposureModes.ts.
  const f8 = DEFAULT_SETTINGS.aperture;
  assertClose(exposureOffset({ aperture: f8, shutter: shutterIndexOf("1/80"), iso: 0 }), 1 / 6, 1e-12, "à 1/80 s");
  assertClose(exposureOffset({ aperture: f8, shutter: shutterIndexOf("1/100"), iso: 0 }), -1 / 6, 1e-12, "à 1/100 s");
});

test("écart à la scène : un cran vaut un tiers d'IL, une scène plus claire d'un IL surexpose d'un IL", () => {
  // exposureOffset = EV₁₀₀ de la scène − EV₁₀₀ des réglages : positif si la photo est surexposée.
  const base = DEFAULT_SETTINGS;
  const offset = exposureOffset(base);
  assertClose(exposureOffset({ ...base, iso: base.iso + 1 }) - offset, 1 / 3, 1e-12, "un cran d'ISO de plus");
  assertClose(exposureOffset({ ...base, iso: base.iso + 3 }) - offset, 1, 1e-12, "sensibilité doublée");
  assertClose(exposureOffset({ ...base, shutter: base.shutter + 1 }) - offset, -1 / 3, 1e-12, "vitesse plus rapide d'un cran");
  assertClose(exposureOffset({ ...base, aperture: base.aperture + 1 }) - offset, -1 / 3, 1e-12, "diaphragme fermé d'un cran");
  assertClose(exposureOffset(base, SCENE_EV100 + 1) - offset, 1, 1e-12, "scène plus claire d'un IL");
});

test("focales : de 18 à 200 mm, 50 mm au départ", () => {
  // docs/camera-physique.md, « Boîtier virtuel » : « focale de 18 à 200 mm ».
  assert.equal(FOCAL_LENGTHS[0], 18);
  assert.equal(FOCAL_LENGTHS[FOCAL_LENGTHS.length - 1], 200);
  assert.equal(FOCAL_LENGTHS[DEFAULT_FOCAL_INDEX], 50);
  for (let k = 1; k < FOCAL_LENGTHS.length; k++) assert.ok(FOCAL_LENGTHS[k] > FOCAL_LENGTHS[k - 1]);
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
