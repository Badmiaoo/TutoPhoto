// Accès de la routine de test (scripts/test_app.cjs) au simulateur, dans le site construit (Sujet 49 du plan de
// corrections, version 0.4.19 ; refonte 3 du rapport d'architecture, constat ARC-05 de l'audit). Seulement avec
// « ?routine » dans l'adresse : main.ts pose alors window.__tutophotoRoutine. Au début de chaque étape, la routine y
// remet les réglages de départ par un seul appel au magasin de réglages (camera/settings.ts), avec les écarts que
// l'étape demande, et l'appareil à sa place et à son orientation de départ, sans élan ; elle y lit aussi l'orientation
// de l'appareil, dont la page ne montre que le lacet (vue de dessus). Sans le paramètre, rien n'est posé ; avec lui,
// le simulateur se comporte de même tant que la routine n'appelle rien. Le module ne touche ni à la page ni au rendu,
// et les tests rapides l'essaient sans navigateur (app/tests/routineAccess.test.ts).

import { initialSettings, type Settings } from "./camera/settings";

/** Paramètre de l'adresse qui pose l'accès : « simulateur/?routine ». */
export const ROUTINE_PARAMETER = "routine";

/** Vrai si l'adresse demande l'accès de la routine, avec ou sans valeur (« ?routine », « ?lang=en&routine »). */
export function routineRequested(search: string): boolean {
  return new URLSearchParams(search).has(ROUTINE_PARAMETER);
}

/**
 * Ce que l'accès touche : le magasin de réglages, la position de l'œil sur le sol (scene.ts, EyeControl ; celle que
 * remet aussi « Retour au départ » de la vue de dessus) et la caméra de Babylon.js, son orientation (rotation, en
 * radians : x le tangage, positif vers le bas ; y le lacet) et son élan (cameraRotation, que l'inertie fait décroître
 * à chaque image après un glissé).
 */
export interface RoutineTargets {
  settings: { set(changes: Partial<Settings>): void };
  eye: { set(x: number, z: number): void };
  camera: {
    rotation: { x: number; y: number; z: number };
    cameraRotation: { x: number; y: number };
  };
}

/** Orientation de l'appareil : lacet et tangage, en radians, et élan qui reste (0 quand l'appareil ne tourne plus). */
export interface RoutinePose {
  yaw: number;
  pitch: number;
  turning: number;
}

export interface RoutineAccess {
  /** Réglages de départ, ceux d'un premier chargement sans mémoire (camera/settings.ts, initialSettings). */
  initial(): Settings;
  /**
   * Réglages de départ, changés par `changes`, posés par un seul appel au magasin (qui écrit la mémoire du navigateur
   * comme pour un choix fait dans les fenêtres, et lève une exception pour un réglage inconnu ou une valeur refusée) ;
   * puis l'appareil remis à sa place et à son orientation de départ, sans élan.
   */
  reset(changes?: Partial<Settings>): void;
  pose(): RoutinePose;
}

/**
 * L'accès, pour la caméra telle qu'elle est à l'appel : main.ts l'appelle au démarrage, avant tout geste, et cette
 * orientation est celle de départ (scene.ts, setTarget).
 */
export function routineAccess(targets: RoutineTargets): RoutineAccess {
  const { settings, eye, camera } = targets;
  const start = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };
  return {
    initial: () => initialSettings(),
    reset(changes = {}) {
      settings.set({ ...initialSettings(), ...changes });
      eye.set(0, 0);
      camera.rotation.x = start.x;
      camera.rotation.y = start.y;
      camera.rotation.z = start.z;
      camera.cameraRotation.x = 0;
      camera.cameraRotation.y = 0;
    },
    pose: () => ({
      yaw: camera.rotation.y,
      pitch: camera.rotation.x,
      turning: Math.hypot(camera.cameraRotation.x, camera.cameraRotation.y),
    }),
  };
}
