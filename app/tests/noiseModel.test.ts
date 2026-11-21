// Tests rapides de camera/noiseModel.ts (Sujet 27 du plan de corrections, constat ARC-07) : bruit de lecture, grille
// des tirages du viseur, paramètres du bruit, écart type et rapport signal sur bruit, seuils de l'indicateur
// d'équilibre. Valeurs attendues : formules de l'en-tête du module, exemple de docs/camera-physique.md (« Bruit
// numérique », Z 6 à ISO 6400), ou calcul écrit à côté du test. La loi écrite en GLSL (NOISE_GLSL) ne s'exécute pas
// ici : seul son texte est comparé à la loi en TypeScript ; la routine de test (scripts/test_app.cjs) la vérifie.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BODIES, findBody } from "../src/camera/bodies";
import { SCALES, isoValue } from "../src/camera/exposure";
import {
  GREEN,
  NOISE_GLSL,
  NOISE_TILE,
  NOISE_UNIFORMS,
  SNR_ACCEPTABLE,
  SNR_EXCELLENT,
  noiseLevel,
  noiseParameters,
  noiseSigma,
  readNoiseAt,
  signalToNoise,
  viewfinderNoiseGrid,
  type Channel,
} from "../src/camera/noiseModel";
import { PHOTO_LONG_SIDE, photoSize } from "../src/camera/optics";
import { assertClose } from "./approx";

const z6 = findBody("nikon");
const RED: Channel = 0;
const BLUE: Channel = 2;

test("bruit de lecture : la mesure à chaque ISO mesuré, la première en deçà, la dernière au-delà", () => {
  for (const body of BODIES) {
    // À un ISO mesuré, l'interpolation redonne la mesure à l'arrondi du calcul près (2^(log₂ rn_A + log₂(rn_B / rn_A))).
    for (const [iso, rn] of body.readNoise) assertClose(readNoiseAt(body, iso), rn, 1e-12 * rn, `${body.model}, ISO ${iso}`);
    assert.equal(readNoiseAt(body, 50), body.readNoise[0][1], `${body.model}, ISO 50`);
    assert.equal(readNoiseAt(body, 12800), body.readNoise[body.readNoise.length - 1][1], `${body.model}, ISO 12800`);
  }
});

test("bruit de lecture entre deux mesures : interpolé en log₂(ISO) et log₂(électrons)", () => {
  // À la moyenne géométrique de deux ISO mesurés, le bruit vaut la moyenne géométrique des deux mesures ; au quart du
  // chemin en log₂(ISO), il vaut rn_A^(3/4) × rn_B^(1/4).
  for (const body of BODIES) {
    for (let k = 1; k < body.readNoise.length; k++) {
      const [isoA, rnA] = body.readNoise[k - 1];
      const [isoB, rnB] = body.readNoise[k];
      const what = `${body.model}, ISO ${isoA} à ${isoB}`;
      assertClose(readNoiseAt(body, Math.sqrt(isoA * isoB)), Math.sqrt(rnA * rnB), 1e-12, what);
      assertClose(readNoiseAt(body, isoA ** 0.75 * isoB ** 0.25), rnA ** 0.75 * rnB ** 0.25, 1e-12, what);
    }
  }
});

test("paramètres : électrons à saturation, carré du bruit de lecture, photosites par canal (Bayer : ¼, ½, ¼)", () => {
  for (const body of BODIES) {
    for (let i = 0; i < SCALES.iso; i++) {
      const iso = isoValue(i);
      const p = noiseParameters(body, iso, 1500 * 1000);
      const k = body.effectivePixels / (1500 * 1000);
      const what = `${body.model}, ISO ${iso}`;
      assertClose(p.saturation, (body.fullWellElectrons * 100) / iso, 1e-9, what);
      assertClose(p.readNoise2, readNoiseAt(body, iso) ** 2, 1e-12, what);
      assert.deepEqual(p.photosites, [k / 4, k / 2, k / 4], what);
    }
  }
  // Moins d'un photosite de la couleur par pixel (loupe) : ramené à 1.
  const tiny = noiseParameters(z6, 100, z6.effectivePixels * 2);
  assert.deepEqual(tiny.photosites, [1, 1, 1]);
});

test("exemple de docs/camera-physique.md : Z 6 à ISO 6400, v = 0,10, photo de 1500 px", () => {
  // « e_sat = 83 698 × 100 / 6400 ≈ 1308 électrons, n ≈ 131 électrons, σ = √(131 + 1,21²) ≈ 11,5 électrons » ;
  // « chaque pixel regroupe k ≈ 16,3 photosites, dont environ 8,2 verts et 4,1 rouges ou bleus » ; « le bruit relatif
  // tombe à 8,8 / √8,2 ≈ 3,1 % pour le vert et 8,8 / √4,1 ≈ 4,3 % pour le rouge et le bleu ». Les écarts permis sont
  // les arrondis de la page.
  const size = photoSize(z6.sensorWidthMm, z6.sensorHeightMm, PHOTO_LONG_SIDE, false);
  const p = noiseParameters(z6, 6400, size.width * size.height);
  assertClose(p.saturation, 1308, 0.5, "e_sat");
  assertClose(Math.sqrt(0.1 * p.saturation + p.readNoise2), 11.5, 0.05, "σ d'un photosite, en électrons");
  assertClose(p.photosites[GREEN], 8.2, 0.05, "photosites verts");
  assertClose(p.photosites[RED], 4.1, 0.05, "photosites rouges");
  assertClose(noiseSigma(0.1, p, GREEN) / 0.1, 0.031, 0.0005, "bruit relatif du vert");
  assertClose(noiseSigma(0.1, p, RED) / 0.1, 0.043, 0.0005, "bruit relatif du rouge");
  assertClose(noiseSigma(0.1, p, BLUE) / 0.1, 0.043, 0.0005, "bruit relatif du bleu");
});

test("écart type : √(n + σ_r²) / (e_sat × √(k × part)), n = max(v, 0) × e_sat", () => {
  const p = { saturation: 2000, readNoise2: 9, photosites: [4, 8, 4] as [number, number, number] };
  // v = 0,5 : n = 1000 électrons ; √(1000 + 9) / (2000 × √8) pour le vert.
  assertClose(noiseSigma(0.5, p, GREEN), Math.sqrt(1009) / (2000 * Math.sqrt(8)), 1e-15, "vert");
  assertClose(noiseSigma(0.5, p, RED), Math.sqrt(1009) / (2000 * 2), 1e-15, "rouge");
  // Noir et valeur négative : le bruit de lecture seul.
  assertClose(noiseSigma(0, p, GREEN), 3 / (2000 * Math.sqrt(8)), 1e-15, "noir");
  assert.equal(noiseSigma(-0.2, p, GREEN), noiseSigma(0, p, GREEN));
  // Deux fois plus de photosites verts que de rouges : bruit du rouge = √2 × bruit du vert, à toute valeur.
  for (const v of [0, 0.01, 0.18, 1]) assertClose(noiseSigma(v, p, RED) / noiseSigma(v, p, GREEN), Math.SQRT2, 1e-12, `v = ${v}`);
});

test("rapport signal sur bruit : v / σ ; limité par le bruit photonique, il suit √(v × e_sat × k × part)", () => {
  for (const body of BODIES) {
    for (const iso of [100, 800, 6400]) {
      const p = noiseParameters(body, iso, 1500 * 1000);
      for (const v of [0.01, 0.18, 0.9]) {
        const what = `${body.model}, ISO ${iso}, v = ${v}`;
        assertClose(signalToNoise(v, p, GREEN), v / noiseSigma(v, p, GREEN), 1e-12, what);
        // Avec n = v × e_sat : SNR = n √(k part) / √(n + σ_r²) = √(n × k × part) × √(n / (n + σ_r²)), sous la limite du
        // bruit photonique seul, √(n × k × part).
        const n = v * p.saturation;
        const photon = Math.sqrt(n * p.photosites[GREEN]);
        const snr = signalToNoise(v, p, GREEN);
        assert.ok(snr < photon, what);
        assertClose(snr, photon * Math.sqrt(n / (n + p.readNoise2)), 1e-12 * photon, what);
      }
    }
  }
  // Noir : rapport nul.
  assert.equal(signalToNoise(0, noiseParameters(z6, 100, 1500 * 1000), GREEN), 0);
  // À la même valeur reçue, monter de 6 IL de sensibilité (ISO 100 à 6400) divise e_sat par 64 : le rapport baisse.
  const v = 0.18;
  const low = signalToNoise(v, noiseParameters(z6, 100, 1500 * 1000), GREEN);
  const high = signalToNoise(v, noiseParameters(z6, 6400, 1500 * 1000), GREEN);
  assert.ok(high < low / 6);
});

test("seuils : 40:1 « excellent », 10:1 « acceptable », en deçà « insuffisant » (norme des sensibilités numériques)", () => {
  assert.equal(SNR_EXCELLENT, 40);
  assert.equal(SNR_ACCEPTABLE, 10);
  assert.equal(noiseLevel(1000), "ok");
  assert.equal(noiseLevel(40), "ok");
  assert.equal(noiseLevel(39.999), "warn");
  assert.equal(noiseLevel(10), "warn");
  assert.equal(noiseLevel(9.999), "bad");
  assert.equal(noiseLevel(0), "bad");
});

test("grille des tirages du viseur : par pixel calculé, sauf à densité supérieure à 1 sous un photosite de rouge par pixel", () => {
  // Densité 1 (niveau de mise à l'échelle 1) : toujours par pixel calculé, même à la loupe.
  for (const pixels of [1200 * 800, z6.effectivePixels, z6.effectivePixels * 4]) {
    assert.deepEqual(viewfinderNoiseGrid(z6, pixels, 1), { imagePixels: pixels, cellScale: 1 });
  }
  // Densité 2 (niveau 0,5) : cadre de 2400 × 1600 pixels calculés, k = 24,5 M / 3,84 M ≈ 6,4, soit 1,6 photosite de
  // rouge par pixel : par pixel calculé.
  assert.deepEqual(viewfinderNoiseGrid(z6, 2400 * 1600, 0.5), { imagePixels: 2400 * 1600, cellScale: 1 });
  // Loupe à 100 % à densité 2 : 4 × 24,5 M pixels calculés, k = 0,25, moins d'un photosite de rouge : par pixel CSS,
  // k compté sur le quart des pixels calculés.
  const loupe = viewfinderNoiseGrid(z6, z6.effectivePixels * 4, 0.5);
  assert.deepEqual(loupe, { imagePixels: z6.effectivePixels, cellScale: 0.5 });
  // Seuil : un photosite de rouge exactement (k × ¼ = 1) reste par pixel calculé.
  assert.deepEqual(viewfinderNoiseGrid(z6, z6.effectivePixels / 4, 0.5), { imagePixels: z6.effectivePixels / 4, cellScale: 1 });
  // Entre les deux (relecture de la version 0.3.87, C4) : k = 3, soit 0,75 photosite de rouge et 1,5 de vert par pixel
  // calculé ; le seuil porte sur le rouge, le moins nombreux : par pixel CSS.
  assert.deepEqual(viewfinderNoiseGrid(z6, z6.effectivePixels / 3, 0.5), { imagePixels: (z6.effectivePixels / 3) * 0.25, cellScale: 0.5 });
});

test("la loi en GLSL est écrite comme celle en TypeScript, et ses uniformes sont déclarés", () => {
  // Texte seulement : le GLSL ne s'exécute pas ici. Ce test arrête un changement de la forme de la loi, de ses
  // constantes ou de la façon d'ajouter le tirage ; la loi en TypeScript a ses tests chiffrés ; une faute du GLSL qui
  // garderait ce texte n'est vue que par la routine (relecture de la version 0.3.87, C5).
  assert.ok(NOISE_GLSL.includes("vec3 electrons = max(v, 0.0) * noiseSaturation;"));
  assert.ok(NOISE_GLSL.includes("vec3 sigma = sqrt(electrons + noiseRead2) / (noiseSaturation * sqrt(noisePhotosites));"));
  assert.ok(NOISE_GLSL.includes("return v + gaussianAt(pixel) * sigma;"));
  assert.ok(NOISE_GLSL.includes(`/ ${NOISE_TILE.toFixed(1)}).rgb`));
  // Deux tirages, le second lu sur une grille tournée de 37° (cos et sin de 37° à 1e-8 près), sommés et divisés par √2.
  assert.ok(NOISE_GLSL.includes("vec2 rotated = vec2(c * pixel.x - s * pixel.y, s * pixel.x + c * pixel.y);"));
  const c = Number(/const float c = ([\d.]+);/.exec(NOISE_GLSL)?.[1]);
  const s = Number(/const float s = ([\d.]+);/.exec(NOISE_GLSL)?.[1]);
  assertClose(c, Math.cos((37 * Math.PI) / 180), 1e-8, "cosinus de 37°");
  assertClose(s, Math.sin((37 * Math.PI) / 180), 1e-8, "sinus de 37°");
  const half = Number(/return \(a \+ b\) \* ([\d.]+);/.exec(NOISE_GLSL)?.[1]);
  assertClose(half, Math.SQRT1_2, 1e-8, "1 / √2");
  for (const name of NOISE_UNIFORMS) assert.match(NOISE_GLSL, new RegExp(`uniform \\w+ ${name};`), name);
  const declared = [...NOISE_GLSL.matchAll(/uniform (\w+) (\w+);/g)].filter(([, type]) => type !== "sampler2D").map(([, , name]) => name);
  assert.deepEqual(declared, NOISE_UNIFORMS);
});
