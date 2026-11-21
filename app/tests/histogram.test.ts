// Tests rapides de camera/histogram.ts (Sujet 26 du plan de corrections, constat ARC-05) : histogrammes, zones
// écrêtées et hauteurs des colonnes de l'écran de revue. Comportement attendu : en-tête du module (choix de TutoPhoto
// pour la luminance, le seuil de 255 et la mise à l'échelle) et docs/camera-physique.md, « Histogrammes et hautes
// lumières sur l'écran de revue ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { TONE_CHANNELS, TONE_LEVELS, columnHeights, measureTones } from "../src/camera/histogram";

/** Tirage pseudo-aléatoire reproductible (mulberry32), pour des images de test toujours les mêmes. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Image RGBA 8 bits faite des pixels donnés, opacité 255. */
function image(pixels: readonly (readonly [number, number, number])[]): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(pixels.length * 4);
  pixels.forEach(([r, g, b], p) => rgba.set([r, g, b, 255], p * 4));
  return rgba;
}

test("quatre histogrammes de 256 colonnes, dans l'ordre luminance, rouge, vert, bleu", () => {
  // Ordre d'affichage du Sony A7 III et du Nikon Z 6 (en-tête du module).
  assert.equal(TONE_LEVELS, 256);
  assert.deepEqual([...TONE_CHANNELS], ["luminance", "red", "green", "blue"]);
  const tones = measureTones(image([[0, 0, 0]]), 1, 1);
  for (const channel of TONE_CHANNELS) assert.equal(tones.histograms[channel].length, TONE_LEVELS, channel);
});

test("chaque histogramme compte chaque pixel une fois, dans la colonne de sa valeur", () => {
  const next = random(26);
  const width = 37;
  const height = 23;
  const pixels = Array.from({ length: width * height }, () => [0, 1, 2].map(() => Math.floor(next() * 256)) as [number, number, number]);
  const tones = measureTones(image(pixels), width, height);
  assert.equal(tones.width, width);
  assert.equal(tones.height, height);
  ["red", "green", "blue"].forEach((channel, k) => {
    const expected = new Array<number>(TONE_LEVELS).fill(0);
    for (const pixel of pixels) expected[pixel[k]]++;
    assert.deepEqual(Array.from(tones.histograms[channel as "red" | "green" | "blue"]), expected, channel);
  });
  for (const channel of TONE_CHANNELS) {
    assert.equal(tones.histograms[channel].reduce((sum, n) => sum + n, 0), width * height, channel);
  }
});

test("luminance : 0,2126 R + 0,7152 V + 0,0722 B, arrondie, sur les valeurs encodées", () => {
  // Rouge pur : 54,2 ; vert pur : 182,4 ; bleu pur : 18,4 ; un gris garde sa valeur (coefficients de somme 1).
  const cases: [readonly [number, number, number], number][] = [
    [[255, 0, 0], 54],
    [[0, 255, 0], 182],
    [[0, 0, 255], 18],
    [[255, 255, 255], 255],
    [[0, 0, 0], 0],
    [[200, 100, 50], 118], // 42,52 + 71,52 + 3,61 = 117,65
  ];
  for (const [pixel, level] of cases) {
    const tones = measureTones(image([pixel]), 1, 1);
    assert.equal(tones.histograms.luminance[level], 1, `(${pixel.join(", ")}) dans la colonne ${level}`);
  }
  for (let v = 0; v < TONE_LEVELS; v++) {
    assert.equal(measureTones(image([[v, v, v]]), 1, 1).histograms.luminance[v], 1, `gris ${v}`);
  }
});

test("zones écrêtées : au moins une couche à 255 ; un bit par pixel, bit de poids faible d'abord", () => {
  // Image de 3 × 3 : pixels 0, 4 et 8 écrêtés (une seule couche à 255 pour les deux derniers), les autres à 254.
  const pixels = Array.from({ length: 9 }, () => [254, 254, 254] as [number, number, number]);
  pixels[0] = [255, 255, 255];
  pixels[4] = [255, 0, 0];
  pixels[8] = [0, 0, 255];
  const tones = measureTones(image(pixels), 3, 3);
  assert.equal(tones.clipped, 3);
  // Pixel p : octet p >> 3, bit p & 7. Pixels 0 et 4 dans l'octet 0 (1 + 16), pixel 8 dans l'octet 1.
  assert.deepEqual(Array.from(tones.mask ?? []), [17, 1]);
  // Une image sans couche à 255 n'a pas de masque.
  const none = measureTones(image([[254, 254, 254], [0, 0, 0]]), 2, 1);
  assert.equal(none.clipped, 0);
  assert.equal(none.mask, null);
});

test("hauteurs des colonnes : rapportées à la plus haute hors des colonnes 0 et 255, plafonnées à 1", () => {
  const columns = new Uint32Array(TONE_LEVELS);
  columns[0] = 100;
  columns[2] = 5;
  columns[3] = 10;
  columns[255] = 7;
  const heights = columnHeights(columns);
  assert.equal(heights.length, TONE_LEVELS);
  assert.equal(heights[3], 1);
  assert.equal(heights[2], 0.5);
  assert.equal(heights[0], 1, "pic d'écrêtage plafonné au bord");
  assert.equal(heights[255], 0.7);
  assert.equal(heights[100], 0);
  // Tous les pixels dans les colonnes 0 et 255 : le maximum est pris sur elles.
  const edges = new Uint32Array(TONE_LEVELS);
  edges[0] = 30;
  edges[255] = 60;
  const edgeHeights = columnHeights(edges);
  assert.equal(edgeHeights[0], 0.5);
  assert.equal(edgeHeights[255], 1);
  // Aucun pixel : toutes les hauteurs à 0.
  assert.ok(columnHeights(new Uint32Array(TONE_LEVELS)).every((h) => h === 0));
});
