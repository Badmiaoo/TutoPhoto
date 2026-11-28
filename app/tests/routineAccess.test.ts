// Tests rapides de routineAccess.ts, l'accès de la routine de test au simulateur (Sujet 49 du plan de corrections,
// version 0.4.19) : le paramètre de l'adresse qui le pose, et la remise au départ par un seul appel au magasin de
// réglages, avec l'appareil à sa place et à son orientation de départ, sans élan.
import { test } from "node:test";
import assert from "node:assert/strict";
import { initialSettings, SettingsStore, type Settings } from "../src/camera/settings";
import { routineAccess, routineRequested } from "../src/routineAccess";

test("paramètre « routine » : avec ou sans valeur, seul ou avec d'autres", () => {
  for (const search of ["?routine", "?routine=1", "?lang=en&routine", "?diagnostic&routine"]) {
    assert.equal(routineRequested(search), true, search);
  }
  for (const search of ["", "?", "?diagnostic", "?routines", "?defi=SIT-06", "?r=routine"]) {
    assert.equal(routineRequested(search), false, search);
  }
});

/** Caméra et œil de test, à l'orientation que scene.ts donne au départ (lacet nul, tangage vers le bas). */
function targets() {
  const calls: Partial<Settings>[] = [];
  const store = new SettingsStore(null);
  const settings = {
    set(changes: Partial<Settings>) {
      calls.push(changes);
      store.set(changes);
    },
  };
  const eyeAt = { x: 0, z: 0 };
  const eye = {
    set(x: number, z: number) {
      eyeAt.x = x;
      eyeAt.z = z;
    },
  };
  const camera = { rotation: { x: 0.06, y: 0, z: 0 }, cameraRotation: { x: 0, y: 0 } };
  return { calls, store, settings, eye, eyeAt, camera };
}

test("remise au départ : un seul appel au magasin, avec les écarts demandés, et l'appareil au départ", () => {
  const t = targets();
  const access = routineAccess({ settings: t.settings, eye: t.eye, camera: t.camera });
  // Ce qu'une étape a pu changer : des réglages, la place de l'appareil, son orientation et son élan.
  t.store.set({ iso: 18, focusMode: "continuous", grid: "thirds", reviewDisplay: "highlights" });
  t.eye.set(-6, 0);
  t.camera.rotation.x = -0.6;
  t.camera.rotation.y = 0.65;
  t.camera.cameraRotation.x = 0.01;
  t.camera.cameraRotation.y = -0.02;
  t.calls.length = 0;
  access.reset({ autoIso: false, previewDepthOfField: false });
  assert.equal(t.calls.length, 1);
  assert.deepEqual(t.store.all(), { ...initialSettings(), autoIso: false, previewDepthOfField: false });
  assert.deepEqual(t.eyeAt, { x: 0, z: 0 });
  assert.deepEqual(t.camera.rotation, { x: 0.06, y: 0, z: 0 });
  assert.deepEqual(access.pose(), { yaw: 0, pitch: 0.06, turning: 0 });
  // Sans écart : les réglages de départ, tous.
  access.reset();
  assert.deepEqual(t.store.all(), initialSettings());
  assert.deepEqual(access.initial(), initialSettings());
});

test("remise au départ : un réglage refusé lève une exception, sans rien changer", () => {
  const t = targets();
  const access = routineAccess({ settings: t.settings, eye: t.eye, camera: t.camera });
  t.store.set({ iso: 18 });
  t.camera.rotation.y = 0.65;
  assert.throws(() => access.reset({ iso: -1 }));
  assert.equal(t.store.get("iso"), 18);
  assert.equal(t.camera.rotation.y, 0.65);
});

test("orientation : lacet, tangage et élan qui reste", () => {
  const t = targets();
  const access = routineAccess({ settings: t.settings, eye: t.eye, camera: t.camera });
  t.camera.rotation.x = -0.3;
  t.camera.rotation.y = 0.2;
  t.camera.cameraRotation.x = 0.003;
  t.camera.cameraRotation.y = 0.004;
  const pose = access.pose();
  assert.equal(pose.yaw, 0.2);
  assert.equal(pose.pitch, -0.3);
  assert.ok(Math.abs(pose.turning - 0.005) < 1e-12);
});
