// Tests rapides de camera/exposureModes.ts (Sujet 26 du plan de corrections, constat ARC-05) : modes M, A et S,
// correction d'exposition et ISO auto. Comportement attendu : en-tête du module (manuel du Nikon Z 6 et, pour le bas de
// l'ISO auto, celui du D850) et docs/camera-physique.md, « Modes d'exposition, correction et ISO auto ».
//
// Calcul des valeurs attendues (en-tête du module) : en places a, s et i dans les échelles (0 pour f/1.4, 30 s et
// ISO 100), EV₁₀₀ = (a + s − i − 12) / 3, et l'exposition correcte de la scène à 12,5 IL, avec une correction de c
// tiers d'IL, demande a + s − i = 3 × 12,5 + 12 − c = 49,5 − c. La somme visée n'est jamais entière : l'appareil
// choisit entre deux crans à égalité, et prend celui qui assombrit la photo (choix de TutoPhoto, non sourcé), d'où
// a + s − i = 50 − c, et un écart de −1/6 IL quand rien ne bute sur une limite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { SCALES, apertureLabel, isoLabel, shutterLabel } from "../src/camera/exposure";
import { COMPENSATION_RANGE, resolveExposure, type ExposureControl, type ExposureMode } from "../src/camera/exposureModes";
import { assertClose } from "./approx";

function placeOf(label: (index: number) => string, size: number, wanted: string): number {
  for (let index = 0; index < size; index++) if (label(index) === wanted) return index;
  throw new Error(`libellé absent de l'échelle : ${wanted}`);
}
const A = (label: string) => placeOf(apertureLabel, SCALES.aperture, label);
const S = (label: string) => placeOf(shutterLabel, SCALES.shutter, label);
const I = (label: string) => placeOf(isoLabel, SCALES.iso, label);

/** Écart à la scène de réglages en places, d'après la forme en places de l'en-tête. */
const offsetOf = (a: number, s: number, i: number) => 12.5 - (a + s - i - 12) / 3;

/**
 * Commande d'exposition. Par défaut : sans correction, ISO auto coupé, et les valeurs de départ du simulateur pour la
 * sensibilité maximale (ISO 6400) et la vitesse minimale (1/30 s) (docs/camera-physique.md, « Par défaut »).
 */
function control(mode: ExposureMode, aperture: string, shutter: string, iso: string, options: Partial<ExposureControl> = {}): ExposureControl {
  return {
    mode,
    chosen: { aperture: A(aperture), shutter: S(shutter), iso: I(iso) },
    compensation: 0,
    autoIso: false,
    maxIso: I("6400"),
    minShutter: S("1/30"),
    ...options,
  };
}

test("M sans ISO auto : les réglages choisis ; la correction ne change que l'indicateur", () => {
  // [nikon-z6-exposure-compensation] : « In mode M, exposure compensation affects only the exposure indicator ».
  const plain = resolveExposure(control("M", "8", "1/100", "100"));
  assert.deepEqual(plain.settings, { aperture: A("8"), shutter: S("1/100"), iso: I("100") });
  assertClose(plain.offset, -1 / 6, 1e-12, "écart");
  assertClose(plain.indicator, -1 / 6, 1e-12, "indicateur");
  assert.equal(plain.flashing, null);
  assert.equal(plain.isoAltered, false);
  const corrected = resolveExposure(control("M", "8", "1/100", "100", { compensation: 3 }));
  assert.deepEqual(corrected.settings, plain.settings);
  assertClose(corrected.offset, -1 / 6, 1e-12, "écart avec +1 IL de correction");
  assertClose(corrected.indicator, -1 / 6 - 1, 1e-12, "indicateur avec +1 IL de correction");
  // En M, rien ne clignote, même loin de l'exposition correcte.
  const dark = resolveExposure(control("M", "22", "1/4000", "100"));
  assert.equal(dark.flashing, null);
  assertClose(dark.offset, offsetOf(A("22"), S("1/4000"), 0), 1e-12, "écart à f/22, 1/4000 s");
});

test("A : la vitesse donne l'exposition correcte pour les 475 couples d'ouverture et d'ISO, et clignote au-delà de 1/4000 s", () => {
  // a + s − i = 50, d'où s = 50 − a + i. Au-delà de la place 51 (1/4000 s), la vitesse reste à 1/4000 s et clignote
  // avec l'indicateur [nikon-z6-indicators] : la photo est surexposée. Sous la place 0 (30 s), jamais ici : s ≥ 26.
  let flashing = 0;
  for (let a = 0; a < SCALES.aperture; a++) {
    for (let i = 0; i < SCALES.iso; i++) {
      const c: ExposureControl = { ...control("A", "8", "1/100", "100"), chosen: { aperture: a, shutter: 0, iso: i } };
      const r = resolveExposure(c);
      const wanted = 50 - a + i;
      const what = `f/${apertureLabel(a)}, ISO ${isoLabel(i)}`;
      assert.equal(r.settings.aperture, a, what);
      assert.equal(r.settings.iso, i, what);
      assert.equal(r.isoAltered, false, what);
      if (wanted <= SCALES.shutter - 1) {
        assert.equal(r.settings.shutter, wanted, what);
        assert.equal(r.flashing, null, what);
        assertClose(r.offset, -1 / 6, 1e-12, what);
      } else {
        flashing++;
        assert.equal(r.settings.shutter, SCALES.shutter - 1, what);
        assert.equal(r.flashing, "shutter", what);
        assertClose(r.offset, offsetOf(a, SCALES.shutter - 1, i), 1e-12, what);
        assert.ok(r.offset > 0, what);
      }
      assertClose(r.indicator, r.offset, 1e-12, what);
    }
  }
  // Couples où i − a ≥ 2 : 17 + 16 + … + 1.
  assert.equal(flashing, 153);
});

test("A, scène sombre : la vitesse bute sur 30 s et clignote, photo sous-exposée", () => {
  // resolveExposure prend la luminosité de la scène en paramètre (12,5 IL par défaut) ; avec la scène du parc, la
  // vitesse ne descend jamais sous 30 s (s ≥ 26). Scène à EV₁₀₀ 0 : a + s − i = 3 × 0 + 12 = 12, d'où, à f/8 et
  // ISO 100, s = 12 − 15 = −3 : la vitesse reste à 30 s et clignote [nikon-z6-indicators] (« Subject too dark »), et
  // la photo est sous-exposée de 0 − (15 + 0 − 0 − 12) / 3 = −1 IL.
  const dark = resolveExposure(control("A", "8", "1/100", "100"), 0);
  assert.equal(shutterLabel(dark.settings.shutter), "30");
  assert.equal(dark.flashing, "shutter");
  assertClose(dark.offset, -1, 1e-12, "écart");
});

test("A, exemples de docs/camera-physique.md : f/4 et ISO 100 donnent 1/400 s ; avec +1 IL de correction, 1/200 s", () => {
  // « en A à f/4 (a = 9) et ISO 100, s = 40,5 ; l'appareil prend 1/400 s (s = 41) » ; « avec +1 IL, s = 49,5 − 3 − 9
  // = 37,5, d'où 1/200 s ».
  const plain = resolveExposure(control("A", "4", "1/100", "100"));
  assert.equal(shutterLabel(plain.settings.shutter), "1/400");
  const corrected = resolveExposure(control("A", "4", "1/100", "100", { compensation: 3 }));
  assert.equal(shutterLabel(corrected.settings.shutter), "1/200");
  // En A, l'indicateur montre l'écart à l'exposition mesurée, donc la correction : +1 IL − 1/6 IL.
  assertClose(corrected.indicator, 5 / 6, 1e-12, "indicateur avec +1 IL");
});

test("S : l'ouverture donne l'exposition correcte pour les 988 couples de vitesse et d'ISO, et clignote hors de f/1.4 à f/22", () => {
  // a + s − i = 50, d'où a = 50 − s + i, bornée à 0 (f/1.4 : photo sous-exposée) et 24 (f/22 : surexposée).
  let tooDark = 0;
  let tooBright = 0;
  for (let s = 0; s < SCALES.shutter; s++) {
    for (let i = 0; i < SCALES.iso; i++) {
      const c: ExposureControl = { ...control("S", "8", "1/100", "100"), chosen: { aperture: 0, shutter: s, iso: i } };
      const r = resolveExposure(c);
      const wanted = 50 - s + i;
      const what = `${shutterLabel(s)} s, ISO ${isoLabel(i)}`;
      assert.equal(r.settings.shutter, s, what);
      assert.equal(r.settings.iso, i, what);
      if (wanted < 0) {
        tooDark++;
        assert.equal(r.settings.aperture, 0, what);
        assert.equal(r.flashing, "aperture", what);
        assert.ok(r.offset < -1 / 6, what);
      } else if (wanted > SCALES.aperture - 1) {
        tooBright++;
        assert.equal(r.settings.aperture, SCALES.aperture - 1, what);
        assert.equal(r.flashing, "aperture", what);
        assert.ok(r.offset > 0, what);
      } else {
        assert.equal(r.settings.aperture, wanted, what);
        assert.equal(r.flashing, null, what);
        assertClose(r.offset, -1 / 6, 1e-12, what);
      }
      assertClose(r.offset, offsetOf(r.settings.aperture, s, i), 1e-12, what);
    }
  }
  // Sous-exposition : s − i ≥ 51, soit s = 51 et i = 0 : 1 couple. Surexposition : s − i ≤ 25, soit, pour chaque i de
  // 0 à 18, s de 0 à 25 + i : 26 + i couples, en tout 19 × 26 + (0 + 1 + … + 18) = 494 + 171 = 665. Le reste,
  // 988 − 1 − 665 = 322 couples, donne l'exposition correcte.
  assert.equal(tooDark, 1);
  assert.equal(tooBright, 665);
});

test("M avec ISO auto : la sensibilité donne l'exposition visée, de ISO 100 au plafond, correction comprise", () => {
  // [nikon-z6-mode-dial] : en M, « ISO sensitivity will automatically be adjusted for optimal exposure at the selected
  // shutter speed and aperture » ; [nikon-z6-exposure-compensation] : l'ISO auto tient compte de la correction.
  const auto = { autoIso: true };
  // Aux réglages de départ, ISO 100 : « la vue de départ ne change pas » (docs/camera-physique.md).
  const start = resolveExposure(control("M", "8", "1/100", "100", auto));
  assert.equal(isoLabel(start.settings.iso), "100");
  assert.equal(start.isoAltered, false);
  // f/8 et 1/1000 s : i = a + s − 50 = 15 + 45 − 50 = 10, ISO 1000.
  const fast = resolveExposure(control("M", "8", "1/1000", "100", auto));
  assert.equal(isoLabel(fast.settings.iso), "1000");
  assert.equal(fast.isoAltered, true);
  assertClose(fast.offset, -1 / 6, 1e-12, "écart à ISO 1000");
  // Plafond ISO 400 : la sensibilité s'y arrête, la photo reste sous-exposée de (10 − 6) / 3 + 1/6 = 1,5 IL.
  const capped = resolveExposure(control("M", "8", "1/1000", "100", { ...auto, maxIso: I("400") }));
  assert.equal(isoLabel(capped.settings.iso), "400");
  assertClose(capped.offset, -1.5, 1e-12, "écart au plafond");
  assertClose(capped.indicator, -1.5, 1e-12, "indicateur au plafond");
  // Avec +1 IL de correction : i = 15 + 45 − 47 = 13, ISO 2000 ; l'indicateur retranche la correction.
  const corrected = resolveExposure(control("M", "8", "1/1000", "100", { ...auto, compensation: 3 }));
  assert.equal(isoLabel(corrected.settings.iso), "2000");
  assertClose(corrected.offset, 5 / 6, 1e-12, "écart avec +1 IL");
  assertClose(corrected.indicator, -1 / 6, 1e-12, "indicateur avec +1 IL");
  // f/1.4 et 1/100 s : i = 0 + 35 − 49,5 = −14,5, sous ISO 100 ; la sensibilité reste à ISO 100, et la photo est
  // surexposée de 12,5 − (0 + 35 − 0 − 12) / 3 = 12,5 − 23/3 ≈ +4,83 IL.
  const floor = resolveExposure(control("M", "1.4", "1/100", "100", auto));
  assert.equal(isoLabel(floor.settings.iso), "100");
  assertClose(floor.offset, 12.5 - 23 / 3, 1e-12, "écart au plancher");
  // Valeur choisie plus haute que le plafond : c'est elle qui sert de plafond ([nikon-z6-iso-settings]).
  const above = resolveExposure(control("M", "8", "1/4000", "3200", { ...auto, maxIso: I("400") }));
  assert.equal(isoLabel(above.settings.iso), "3200");
  assertClose(above.offset, -0.5, 1e-12, "écart au plafond relevé");
});

test("A avec ISO auto : la sensibilité ne monte que si la vitesse passerait sous la vitesse minimale", () => {
  // [nikon-z6-iso-settings] ; en A, la sensibilité ne baisse pas ([nikon-d850-auto-iso] : « sensitivity will only be
  // adjusted if underexposure would result at the shutter speed selected for Minimum shutter speed »).
  const auto = { autoIso: true };
  // f/4, ISO 100 : 1/400 s, plus rapide que 1/30 s ; rien ne change.
  const enough = resolveExposure(control("A", "4", "1/100", "100", auto));
  assert.equal(shutterLabel(enough.settings.shutter), "1/400");
  assert.equal(enough.isoAltered, false);
  // f/22, ISO 100, vitesse minimale 1/125 s : sans ISO auto, s = 26 (1/13 s). Avec : i = 36 + 24 − 49,5 = 10,5,
  // arrondi vers le cran le plus sombre, ISO 1000 ; puis s = 49,5 − 24 + 10 = 35,5, d'où 1/125 s.
  const raised = resolveExposure(control("A", "22", "1/100", "100", { ...auto, minShutter: S("1/125") }));
  assert.equal(isoLabel(raised.settings.iso), "1000");
  assert.equal(shutterLabel(raised.settings.shutter), "1/125");
  assert.equal(raised.isoAltered, true);
  assertClose(raised.offset, -1 / 6, 1e-12, "écart");
  // Même cas, plafond ISO 400 : la vitesse descend sous le minimum (s = 31,5, d'où 1/50 s), sans clignoter.
  const capped = resolveExposure(control("A", "22", "1/100", "100", { ...auto, minShutter: S("1/125"), maxIso: I("400") }));
  assert.equal(isoLabel(capped.settings.iso), "400");
  assert.equal(shutterLabel(capped.settings.shutter), "1/50");
  assert.equal(capped.flashing, null);
  assertClose(capped.offset, -1 / 6, 1e-12, "écart au plafond");
  // f/8, ISO 1600 choisi : 1/1600 s, plus rapide que le minimum ; la sensibilité n'est pas baissée.
  const high = resolveExposure(control("A", "8", "1/100", "1600", auto));
  assert.equal(isoLabel(high.settings.iso), "1600");
  assert.equal(shutterLabel(high.settings.shutter), "1/1600");
  assert.equal(high.isoAltered, false);
});

test("S avec ISO auto : la sensibilité change quand l'ouverture ne suffit plus, dans un sens ou dans l'autre", () => {
  // En-tête du module ; jusqu'à ISO 100 vers le bas ([nikon-d850-auto-iso], ISO 100 dans TutoPhoto).
  const auto = { autoIso: true };
  // 1/4000 s, ISO 100 : sans ISO auto, f/1.4 ne suffit pas (a = −1). Avec : i = 51 − 49,5 = 1,5, d'où ISO 125, f/1.4.
  const up = resolveExposure(control("S", "8", "1/4000", "100", auto));
  assert.equal(isoLabel(up.settings.iso), "125");
  assert.equal(apertureLabel(up.settings.aperture), "1.4");
  assert.equal(up.flashing, null);
  assertClose(up.offset, -1 / 6, 1e-12, "écart à 1/4000 s");
  // 1/30 s, ISO 6400 : f/22 ne suffit pas (a = 38). Avec ISO auto : i = 24 + 30 − 49,5 = 4,5, d'où ISO 250, f/22.
  const down = resolveExposure(control("S", "8", "1/30", "6400", auto));
  assert.equal(isoLabel(down.settings.iso), "250");
  assert.equal(apertureLabel(down.settings.aperture), "22");
  assert.equal(down.flashing, null);
  assertClose(down.offset, -1 / 6, 1e-12, "écart à 1/30 s");
  // 30 s, ISO 3200 : même à ISO 100, f/22 ne suffit pas ; l'ouverture clignote, photo surexposée de 8,5 IL.
  const floor = resolveExposure(control("S", "8", "30", "3200", auto));
  assert.equal(isoLabel(floor.settings.iso), "100");
  assert.equal(apertureLabel(floor.settings.aperture), "22");
  assert.equal(floor.flashing, "aperture");
  assertClose(floor.offset, 8.5, 1e-12, "écart à 30 s");
});

test("correction d'exposition : de −5 à +5 IL par tiers ; en A, l'indicateur la montre", () => {
  // [nikon-z6-exposure-compensation] : de −5 à +5 IL par tiers. En A à f/8 et ISO 100, s = 35 − c, d'où un écart de
  // c / 3 − 1/6 IL.
  assert.equal(COMPENSATION_RANGE, 15);
  for (let c = -COMPENSATION_RANGE; c <= COMPENSATION_RANGE; c++) {
    const r = resolveExposure(control("A", "8", "1/100", "100", { compensation: c }));
    assert.equal(r.settings.shutter, 35 - c, `correction ${c}`);
    assertClose(r.indicator, c / 3 - 1 / 6, 1e-12, `correction ${c}`);
  }
});
