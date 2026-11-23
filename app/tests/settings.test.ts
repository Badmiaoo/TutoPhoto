// Tests rapides de camera/settings.ts, le magasin de réglages (Sujet 41 du plan de corrections, constat ARC-02, premier
// temps ; version 0.4.9) : la validation de chaque réglage, l'aller et retour avec la mémoire du navigateur, et la
// relecture de ce que la mémoire contient aujourd'hui, écrit par les versions d'avant le magasin. Ce qui est attendu :
// les valeurs de départ, les clés, les champs, les valeurs et l'ordre des champs de la version 0.4.8 (champs de
// CameraPanel et de ReviewInfo ; saveBody et savePreview de ui/cameraPanel.ts, next de ui/reviewInfo.ts), recopiés ici
// en chaînes JSON ; et, pour les formats plus anciens, les champs qu'écrivaient les versions 0.3.13 (marque et format),
// 0.3.16 (trois interrupteurs de l'aperçu), 0.3.29 (mise au point, MAP-09) et 0.3.36 à 0.3.79 (treize champs, format
// compris), relus dans l'historique de git.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SETTINGS,
  STORAGE,
  SettingsStore,
  initialSettings,
  readSettings,
  releaseMode,
  type SettingKey,
  type Settings,
  type SettingsStorage,
} from "../src/camera/settings";
import { FOCAL_LENGTHS, apertureLabel, isoLabel, shutterLabel } from "../src/camera/exposure";

/** Mémoire de test : un dictionnaire, avec la liste des clés écrites. */
class MemoryStorage implements SettingsStorage {
  readonly items = new Map<string, string>();
  readonly writes: string[] = [];
  constructor(initial: Record<string, string> = {}) {
    for (const [key, value] of Object.entries(initial)) this.items.set(key, value);
  }
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.writes.push(key);
    this.items.set(key, value);
  }
}

const BOX = "tutophoto.boitier";
const PREVIEW = "tutophoto.apercu";
const REVIEW = "tutophoto.revue";

/** Valeurs de départ de la version 0.4.8, telles que l'interface les montre. */
function assertInitial(settings: Readonly<Settings>, what: string): void {
  assert.equal(apertureLabel(settings.aperture), "8", what);
  assert.equal(shutterLabel(settings.shutter), "1/100", what);
  assert.equal(isoLabel(settings.iso), "100", what);
  assert.equal(FOCAL_LENGTHS[settings.focalIndex], 50, what);
  assert.equal(isoLabel(settings.maxIso), "6400", what);
  assert.equal(shutterLabel(settings.minShutter), "1/30", what);
  const { aperture, shutter, iso, focalIndex, maxIso, minShutter, ...rest } = settings;
  void [aperture, shutter, iso, focalIndex, maxIso, minShutter];
  assert.deepEqual(
    rest,
    {
      brand: "nikon",
      exposureMode: "M",
      compensation: 0,
      autoIso: true,
      focusMode: "single",
      areaMode: "point",
      detection: "faceEye",
      release: "single",
      clRate: 3,
      timerDelay: 10,
      previewAll: true,
      previewBrightness: true,
      previewNoise: true,
      previewDepthOfField: true,
      previewBalance: true,
      grid: "none",
      reviewDisplay: "photo",
    },
    what,
  );
}

test("valeurs de départ : celles de la version 0.4.8, sans mémoire, mémoire vide ou indisponible", () => {
  assertInitial(initialSettings(), "initialSettings");
  assertInitial(new SettingsStore(null).all(), "sans mémoire");
  assertInitial(new SettingsStore(new MemoryStorage()).all(), "mémoire vide");
  const failing: SettingsStorage = {
    getItem: () => {
      throw new Error("mémoire indisponible");
    },
    setItem: () => {
      throw new Error("mémoire indisponible");
    },
  };
  assertInitial(new SettingsStore(failing).all(), "mémoire qui lève une exception");
  // Chaque valeur de départ est permise par sa propre validation.
  for (const key of Object.keys(SETTINGS) as SettingKey[]) assert.ok(SETTINGS[key].valid(SETTINGS[key].initial), key);
});

/** Pour chaque réglage : des valeurs permises, puis des valeurs refusées. */
const CASES: Record<SettingKey, [accepted: unknown[], refused: unknown[]]> = {
  aperture: [[0, 15, 24], [-1, 25, 1.5, "15", null]],
  shutter: [[0, 35, 51], [-1, 52, 35.5, "35"]],
  iso: [[0, 18], [-1, 19, "0"]],
  focalIndex: [[0, 4, 9], [-1, 10, 4.5]],
  brand: [["nikon", "sony", "canon"], ["pentax", "fujifilm", "Nikon", "", null, 1]],
  exposureMode: [["M", "A", "S"], ["P", "m", "", undefined]],
  compensation: [[-15, -1, 0, 1, 15], [-16, 16, 1.5, "3", null, true]],
  autoIso: [[true, false], ["true", 1, 0, null]],
  maxIso: [[3, 12, 18], [2, 19, 0, 12.5, "12"]],
  minShutter: [[0, 30, 51], [-1, 52, 30.5, "30"]],
  focusMode: [["single", "continuous"], ["manual", "Single", "AF-S"]],
  // ["auto"] : un tableau, que la version 0.4.8 acceptait (hasOwnProperty le convertit en « auto ») et gardait tel quel.
  areaMode: [["point", "wideS", "wideL", "auto"], ["Auto", "wide", ["auto"], "toString"]],
  detection: [["faceEye", "face", "animal", "off"], ["eye", "", "Off"]],
  release: [["single", "cl", "ch", "chx", "timer"], ["burst", "CL", ""]],
  clRate: [[1, 2, 3, 4, 5], [0, 6, 2.5, "3"]],
  timerDelay: [[2, 5, 10, 20], [0, 3, 15, "10"]],
  previewAll: [[true, false], ["false", 0]],
  previewBrightness: [[true, false], [null, 1]],
  previewNoise: [[true, false], ["true"]],
  previewDepthOfField: [[true, false], [undefined]],
  previewBalance: [[true, false], [0]],
  grid: [["none", "thirds", "sixteen", "twentyFour", "thirdsDiagonals"], ["golden", "toString", "", null]],
  reviewDisplay: [["photo", "histograms", "highlights"], ["info", "Photo", ""]],
};

test("validation : chaque réglage accepte ses valeurs et refuse les autres", () => {
  assert.deepEqual(Object.keys(CASES).sort(), Object.keys(SETTINGS).sort());
  for (const key of Object.keys(CASES) as SettingKey[]) {
    const [accepted, refused] = CASES[key];
    for (const value of accepted) assert.ok(SETTINGS[key].valid(value), `${key} = ${JSON.stringify(value)} doit être permis`);
    for (const value of refused) assert.ok(!SETTINGS[key].valid(value), `${key} = ${JSON.stringify(value)} doit être refusé`);
  }
});

test("écriture refusée : réglage inconnu ou valeur refusée, une exception et rien ne change", () => {
  const memory = new MemoryStorage();
  const store = new SettingsStore(memory);
  const before = store.all();
  let calls = 0;
  store.subscribe(() => calls++);
  assert.throws(() => store.set({ clRate: 6 }), /Valeur refusée pour le réglage clRate : 6/);
  // Une valeur valide avant une valeur refusée, dans la même écriture : rien n'est pris.
  assert.throws(() => store.set({ brand: "canon", compensation: 1.5 }), /compensation : 1.5/);
  assert.throws(() => store.set({ lang: "en" } as unknown as Partial<Settings>), /Réglage inconnu : lang/);
  assert.equal(store.all(), before);
  assert.equal(calls, 0);
  assert.deepEqual(memory.writes, []);
});

test("aller et retour avec la mémoire : mêmes clés, mêmes champs, dans le même ordre, mêmes valeurs", () => {
  const memory = new MemoryStorage();
  const store = new SettingsStore(memory);
  const chosen: Partial<Settings> = {
    aperture: 0,
    shutter: 51,
    iso: 18,
    focalIndex: 9,
    brand: "canon",
    exposureMode: "A",
    compensation: -2,
    autoIso: false,
    maxIso: 12,
    minShutter: 33,
    focusMode: "continuous",
    areaMode: "wideL",
    detection: "animal",
    release: "cl",
    clRate: 4,
    timerDelay: 5,
    previewAll: false,
    previewBrightness: false,
    previewNoise: true,
    previewDepthOfField: false,
    previewBalance: false,
    grid: "thirdsDiagonals",
    reviewDisplay: "highlights",
  };
  store.set(chosen);
  // Les chaînes qu'écrivaient saveBody, savePreview (ui/cameraPanel.ts) et next (ui/reviewInfo.ts) à la version 0.4.8.
  assert.equal(
    memory.getItem(BOX),
    '{"brand":"canon","focusMode":"continuous","areaMode":"wideL","detection":"animal","release":"cl","clRate":4,"timerDelay":5,"exposureMode":"A","compensation":-2,"autoIso":false,"maxIso":12,"minShutter":33}',
  );
  assert.equal(memory.getItem(PREVIEW), '{"all":false,"brightness":false,"noise":true,"depthOfField":false,"balance":false,"grid":"thirdsDiagonals"}');
  assert.equal(memory.getItem(REVIEW), '{"display":"highlights"}');
  assert.deepEqual([...memory.items.keys()].sort(), [BOX, PREVIEW, REVIEW].sort());
  // Relu au chargement suivant : tout, sauf les molettes, qui reviennent à leur valeur de départ.
  const reloaded = new SettingsStore(memory).all();
  const initial = initialSettings();
  for (const key of Object.keys(chosen) as SettingKey[]) {
    const dial = key === "aperture" || key === "shutter" || key === "iso" || key === "focalIndex";
    assert.equal(reloaded[key], dial ? initial[key] : chosen[key], key);
  }
  // Toute la table est couverte : chaque réglage mémorisé a un champ, et un seul.
  const stored = STORAGE.flatMap((entry) => entry.fields.map(([, setting]) => setting));
  assert.equal(new Set(stored).size, stored.length);
  assert.deepEqual(
    (Object.keys(SETTINGS) as SettingKey[]).filter((key) => !stored.includes(key)),
    ["aperture", "shutter", "iso", "focalIndex"],
  );
});

test("écriture : une clé en entier quand l'un de ses réglages change ; rien au chargement, pour les molettes ou sans changement", () => {
  // Une mémoire au contenu en partie refusé n'est pas récrite au chargement : elle reste telle quelle.
  const memory = new MemoryStorage({ [BOX]: '{"brand":"pentax","clRate":4}' });
  const store = new SettingsStore(memory);
  assert.deepEqual(memory.writes, []);
  assert.equal(store.get("brand"), "nikon");
  assert.equal(store.get("clRate"), 4);
  store.set({ aperture: 3, focalIndex: 8 });
  assert.deepEqual(memory.writes, []);
  store.set({ previewNoise: false });
  assert.deepEqual(memory.writes, [PREVIEW]);
  store.set({ previewNoise: false, clRate: 4 });
  assert.deepEqual(memory.writes, [PREVIEW]);
  store.set({ release: "cl", clRate: 5 });
  assert.deepEqual(memory.writes, [PREVIEW, BOX]);
  // La clé s'écrit en entier : la marque refusée est remplacée par la valeur de départ, comme saveBody le faisait.
  assert.equal(
    memory.getItem(BOX),
    '{"brand":"nikon","focusMode":"single","areaMode":"point","detection":"faceEye","release":"cl","clRate":5,"timerDelay":10,"exposureMode":"M","compensation":0,"autoIso":true,"maxIso":18,"minShutter":30}',
  );
  store.set({ reviewDisplay: "histograms", grid: "thirds", brand: "sony" });
  assert.deepEqual(memory.writes, [PREVIEW, BOX, BOX, PREVIEW, REVIEW]);
});

test("relecture de la mémoire écrite avant le magasin : formats des versions 0.3.13 à 0.4.8", () => {
  const read = (items: Record<string, string>) => readSettings(new MemoryStorage(items));
  // Version 0.4.8 (et depuis 0.3.80) : douze champs ; ici, après le choix du Sony A6000.
  const v048 = read({
    [BOX]: '{"brand":"sony","focusMode":"single","areaMode":"point","detection":"faceEye","release":"single","clRate":3,"timerDelay":10,"exposureMode":"M","compensation":0,"autoIso":true,"maxIso":18,"minShutter":30}',
  });
  assertInitial({ ...v048, brand: "nikon" }, "0.4.8");
  assert.equal(v048.brand, "sony");
  // Versions 0.3.36 à 0.3.79 : treize champs, dont « format », ignoré : le boîtier de la marque.
  const v0379 = read({
    [BOX]: '{"brand":"canon","format":"ff","focusMode":"continuous","areaMode":"auto","detection":"face","release":"timer","clRate":5,"timerDelay":2,"exposureMode":"S","compensation":3,"autoIso":false,"maxIso":9,"minShutter":45}',
  });
  assert.deepEqual(
    [v0379.brand, v0379.focusMode, v0379.areaMode, v0379.detection, v0379.release, v0379.clRate, v0379.timerDelay],
    ["canon", "continuous", "auto", "face", "timer", 5, 2],
  );
  assert.deepEqual([v0379.exposureMode, v0379.compensation, v0379.autoIso, v0379.maxIso, v0379.minShutter], ["S", 3, false, 9, 45]);
  // Version 0.3.13 : la marque et le format seulement ; le reste garde sa valeur de départ.
  const v0313 = read({ [BOX]: '{"brand":"nikon","format":"apsc"}' });
  assertInitial(v0313, "0.3.13");
  // Version 0.3.29 (détection des yeux et zone automatique, MAP-09) : cinq champs.
  const map09 = read({ [BOX]: '{"brand":"sony","format":"apsc","focusMode":"single","areaMode":"auto","detection":"off"}' });
  assertInitial({ ...map09, brand: "nikon", areaMode: "point", detection: "faceEye" }, "MAP-09");
  assert.deepEqual([map09.brand, map09.areaMode, map09.detection], ["sony", "auto", "off"]);
  // Aperçu de la version 0.3.16 : trois interrupteurs ; depuis la version 0.3.56, avec la grille.
  const v0316 = read({ [PREVIEW]: '{"all":false,"brightness":true,"noise":false}' });
  assertInitial({ ...v0316, previewAll: true, previewNoise: true }, "0.3.16");
  assert.deepEqual([v0316.previewAll, v0316.previewBrightness, v0316.previewNoise], [false, true, false]);
  const v048Preview = read({ [PREVIEW]: '{"all":true,"brightness":true,"noise":true,"depthOfField":false,"balance":false,"grid":"sixteen"}' });
  assert.deepEqual([v048Preview.previewDepthOfField, v048Preview.previewBalance, v048Preview.grid], [false, false, "sixteen"]);
  // Écran de revue (depuis la version 0.3.57).
  assert.equal(read({ [REVIEW]: '{"display":"histograms"}' }).reviewDisplay, "histograms");
});

test("relecture : champ par champ, une valeur refusée ou une clé illisible laisse la valeur de départ", () => {
  const read = (items: Record<string, string>) => readSettings(new MemoryStorage(items));
  // Toutes les valeurs refusées, chacune à sa place : rien n'est pris.
  const refused = read({
    [BOX]: '{"brand":"pentax","focusMode":"manual","areaMode":["auto"],"detection":"eye","release":"burst","clRate":"3","timerDelay":3,"exposureMode":"P","compensation":1.5,"autoIso":"false","maxIso":2,"minShutter":52}',
    [PREVIEW]: '{"all":"false","brightness":0,"noise":null,"depthOfField":"no","balance":1,"grid":"golden"}',
    [REVIEW]: '{"display":"info"}',
  });
  assertInitial(refused, "valeurs refusées");
  // Une valeur refusée ne touche pas ses voisines.
  const mixed = read({ [BOX]: '{"brand":"canon","clRate":9,"timerDelay":20}', [PREVIEW]: '{"noise":false,"grid":"golden"}' });
  assert.deepEqual([mixed.brand, mixed.clRate, mixed.timerDelay, mixed.previewNoise, mixed.grid], ["canon", 3, 20, false, "none"]);
  // JSON illisible dans une clé : ses réglages gardent leur valeur de départ, les autres clés sont lues.
  const broken = read({ [BOX]: '{"brand":', [PREVIEW]: '{"grid":"thirds"}', [REVIEW]: '{"display":"highlights"' });
  assertInitial({ ...broken, grid: "none" }, "clé illisible");
  assert.equal(broken.grid, "thirds");
  // Contenus qui ne sont pas un objet.
  for (const text of ["null", "5", '"canon"', "true", "[]", '["canon"]', ""]) {
    assertInitial(read({ [BOX]: text, [PREVIEW]: text, [REVIEW]: text }), `contenu ${JSON.stringify(text)}`);
  }
});

test("mémoire indisponible : les réglages changent quand même, pour la page en cours", () => {
  const failing: SettingsStorage = {
    getItem: () => null,
    setItem: () => {
      throw new Error("quota dépassé");
    },
  };
  for (const storage of [null, failing]) {
    const store = new SettingsStore(storage);
    const seen: SettingKey[][] = [];
    store.subscribe((changed) => seen.push([...changed]));
    store.set({ brand: "sony", previewAll: false });
    assert.equal(store.get("brand"), "sony");
    assert.equal(store.get("previewAll"), false);
    assert.deepEqual(seen, [["brand", "previewAll"]]);
  }
});

test("abonnement : une fois par écriture qui change quelque chose, avec les réglages changés", () => {
  const store = new SettingsStore(null);
  const first = store.all();
  const seen: { changed: SettingKey[]; brand: string }[] = [];
  const unsubscribe = store.subscribe((changed) => seen.push({ changed: [...changed].sort(), brand: store.get("brand") }));
  store.set({ brand: "canon", iso: 3 });
  store.set({ brand: "canon" });
  store.set({});
  store.set({ focusMode: "continuous" });
  assert.deepEqual(seen, [
    { changed: ["brand", "iso"], brand: "canon" },
    { changed: ["focusMode"], brand: "canon" },
  ]);
  // L'objet lu avant reste celui d'avant : chaque changement crée un nouvel objet, figé.
  assert.equal(first.brand, "nikon");
  assert.ok(Object.isFrozen(first) && Object.isFrozen(store.all()));
  assert.notEqual(store.all(), first);
  unsubscribe();
  store.set({ brand: "sony" });
  assert.equal(seen.length, 2);
  // Un abonné qui se désabonne pendant la notification n'empêche pas les suivants d'être prévenus.
  let later = 0;
  const off = store.subscribe(() => off());
  store.subscribe(() => later++);
  store.set({ brand: "nikon" });
  store.set({ brand: "canon" });
  assert.equal(later, 2);
});

test("mode de déclenchement : vues par seconde et délai, d'après le mode choisi", () => {
  const base = { release: "single", clRate: 4, timerDelay: 5 } as const;
  assert.deepEqual(releaseMode(base), { kind: "single", fps: 1, delay: 5 });
  assert.deepEqual(releaseMode({ ...base, release: "cl" }), { kind: "cl", fps: 4, delay: 5 });
  assert.deepEqual(releaseMode({ ...base, release: "ch" }), { kind: "ch", fps: 5.5, delay: 5 });
  assert.deepEqual(releaseMode({ ...base, release: "chx" }), { kind: "chx", fps: 12, delay: 5 });
  assert.deepEqual(releaseMode({ ...base, release: "timer" }), { kind: "timer", fps: 1, delay: 5 });
});
