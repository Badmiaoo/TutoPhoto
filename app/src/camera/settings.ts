// Magasin de réglages du boîtier virtuel (Sujet 41 du plan de corrections, constat ARC-02 de l'audit, premier temps ;
// version 0.4.9). Une table, SETTINGS : chaque réglage y a sa valeur de départ et sa validation ; ceux que la mémoire
// du navigateur garde y ont aussi leur place, dans STORAGE (clé et champ). Une lecture (get, all), une écriture (set)
// et un abonnement (subscribe), dans SettingsStore : le panneau (ui/cameraPanel.ts), l'autofocus (camera/autofocus.ts),
// le déclencheur (ui/shutter.ts) et l'écran de revue (ui/reviewInfo.ts) y lisent les réglages ; le panneau et l'écran
// de revue y écrivent ceux que l'on choisit, et chacun se met à jour par son abonnement. La classe reçoit la mémoire
// (SettingsStorage) : seule browserStorage(), qu'appelle main.ts, lit window.localStorage. Le module ne touche ni à la
// page ni au rendu, et les tests rapides l'essaient sans navigateur, sur une mémoire de test (app/tests/settings.test.ts).
//
// Mémoire du navigateur : les clés, les champs et les valeurs qu'écrivaient ui/cameraPanel.ts et ui/reviewInfo.ts
// avant ce module (version 0.4.8), pour que les réglages déjà mémorisés restent :
// - « tutophoto.boitier » : brand, focusMode, areaMode, detection, release, clRate, timerDelay, exposureMode,
//   compensation, autoIso, maxIso, minShutter ;
// - « tutophoto.apercu » : all, brightness, noise, depthOfField, balance, grid ;
// - « tutophoto.revue » : display.
// Comme avant : quand l'un de ses réglages change, une clé s'écrit en entier, ses champs dans cet ordre ; rien ne
// s'écrit au chargement. À la lecture, chaque champ est validé seul : absent, inconnu ou d'un autre type, il laisse la
// valeur de départ ; une clé absente ou illisible (JSON invalide), ou une mémoire indisponible, les laisse toutes. Un
// champ que la table ne connaît pas est ignoré, comme « format », que les versions 0.3.13 à 0.3.79 écrivaient avec la
// marque (le boîtier se choisissait alors par sa marque et son format) : le boîtier de la marque est retenu.
// Non mémorisées, comme avant : les molettes (ouverture, vitesse, ISO, focale), remises à leur valeur de départ à
// chaque chargement. Le défi choisi (« tutophoto.defi ») n'est pas un réglage du boîtier : il reste dans
// ui/challenges.ts, avec le paramètre « ?defi= » de l'adresse.

import { BODIES, type Brand } from "./bodies";
import { DEFAULT_FOCAL_INDEX, DEFAULT_SETTINGS, FOCAL_LENGTHS, SCALES, shutterIndexOf } from "./exposure";
import { COMPENSATION_RANGE, type ExposureMode } from "./exposureModes";
import type { Detection } from "./faces";
import { isGridKind, type GridKind } from "./viewfinder";

/** Modes de mise au point : AF ponctuel (AF-S) ou continu (AF-C) (camera/autofocus.ts). */
export const FOCUS_MODES = ["single", "continuous"] as const;
export type FocusMode = (typeof FOCUS_MODES)[number];
/** Modes de zone AF : point sélectif, zone large (S) ou (L), zone automatique (camera/autofocus.ts). */
export const AREA_MODES = ["point", "wideS", "wideL", "auto"] as const;
export type AreaMode = (typeof AREA_MODES)[number];
/** Détection de la zone automatique (camera/faces.ts) ; un objet pour que le compilateur exige chaque valeur. */
const DETECTIONS: Record<Detection, true> = { faceEye: true, face: true, animal: true, off: true };
const EXPOSURE_MODES: Record<ExposureMode, true> = { M: true, A: true, S: true };

/**
 * Mode de déclenchement (BOI-12), d'après le manuel du Nikon Z 6 (« The Release Mode/Self-Timer Button », lu le
 * 10 novembre 2026) [nikon-z6-release-mode]
 * https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_04.html : vue par vue ; Continu L, 1 à 5 vues par
 * seconde ; Continu H, jusqu'à environ 5,5 ; Continu H (étendu), 12 au Z 6 en JPEG ; retardateur de 2, 5, 10 ou 20 s.
 */
export const RELEASE_KINDS = ["single", "cl", "ch", "chx", "timer"] as const;
export type ReleaseKind = (typeof RELEASE_KINDS)[number];
export const RELEASE_FPS: Readonly<Record<"ch" | "chx", number>> = { ch: 5.5, chx: 12 };
export const CL_RATES = [1, 2, 3, 4, 5] as const;
export const TIMER_DELAYS = [2, 5, 10, 20] as const;

/** Affichages de l'écran de revue, dans l'ordre où le bouton « Infos » les fait défiler (ui/reviewInfo.ts). */
export const REVIEW_DISPLAYS = ["photo", "histograms", "highlights"] as const;
export type ReviewDisplay = (typeof REVIEW_DISPLAYS)[number];

/**
 * Sensibilité maximale de l'ISO auto : de ISO 200, la plus basse que propose ce réglage sur le Z 6 [nikon-z6-iso-button],
 * au haut de l'échelle de TutoPhoto, ISO 6400.
 */
export const MAX_ISO_FIRST = 3;
/**
 * Vitesse minimale par défaut. Le Z 6 a « Auto » par défaut [nikon-z6-defaults], selon la focale ; la page ne donne
 * pas la règle ; le manuel du D850 fixe 1/30 s quand « Auto » ne peut pas fonctionner (objectif sans données)
 * [nikon-d850-auto-iso].
 *   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html
 *   https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html
 */
const DEFAULT_MIN_SHUTTER = "1/30";

/** Les réglages du boîtier virtuel et de ses aides. */
export interface Settings {
  // Molettes, non mémorisées : indices dans les échelles de camera/exposure.ts (SCALES, FOCAL_LENGTHS).
  aperture: number;
  shutter: number;
  iso: number;
  focalIndex: number;
  // « tutophoto.boitier ».
  brand: Brand;
  exposureMode: ExposureMode;
  /** Correction d'exposition, en tiers d'IL. */
  compensation: number;
  autoIso: boolean;
  /** Plafond de l'ISO auto, indice dans l'échelle des ISO. */
  maxIso: number;
  /** Vitesse minimale de l'ISO auto, indice dans l'échelle des vitesses. */
  minShutter: number;
  focusMode: FocusMode;
  areaMode: AreaMode;
  detection: Detection;
  release: ReleaseKind;
  /** Cadence du mode Continu L, en vues par seconde. */
  clRate: number;
  /** Délai du retardateur, en secondes. */
  timerDelay: number;
  // « tutophoto.apercu » : interrupteurs de l'aperçu dans le viseur et grille de cadrage.
  previewAll: boolean;
  previewBrightness: boolean;
  previewNoise: boolean;
  previewDepthOfField: boolean;
  /** Indicateur d'équilibre (ui/balance.ts) : une aide, que l'on peut couper pour s'entraîner. */
  previewBalance: boolean;
  /** Grille de cadrage : une aide, qui ne dépend pas de l'interrupteur général. */
  grid: GridKind;
  // « tutophoto.revue ».
  reviewDisplay: ReviewDisplay;
}

export type SettingKey = keyof Settings;

interface Spec<T> {
  /** Valeur de départ : au premier chargement, et quand la mémoire n'en donne pas de valide. */
  readonly initial: T;
  /** Vrai si la valeur est permise. */
  readonly valid: (value: unknown) => boolean;
}

/** Une valeur de la liste (comparaison stricte : 3 et « 3 » diffèrent). */
const oneOf =
  (values: readonly unknown[]) =>
  (value: unknown): boolean =>
    values.includes(value);
/** Un entier de min à max. */
const index =
  (min: number, max: number) =>
  (value: unknown): boolean =>
    Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
const isBoolean = (value: unknown): boolean => typeof value === "boolean";

/** La table des réglages. */
export const SETTINGS: { readonly [K in SettingKey]: Spec<Settings[K]> } = {
  // Réglages de départ : f/8, 1/100 s, ISO 100, 50 mm (camera/exposure.ts).
  aperture: { initial: DEFAULT_SETTINGS.aperture, valid: index(0, SCALES.aperture - 1) },
  shutter: { initial: DEFAULT_SETTINGS.shutter, valid: index(0, SCALES.shutter - 1) },
  iso: { initial: DEFAULT_SETTINGS.iso, valid: index(0, SCALES.iso - 1) },
  focalIndex: { initial: DEFAULT_FOCAL_INDEX, valid: index(0, FOCAL_LENGTHS.length - 1) },
  // Un boîtier par marque (camera/bodies.ts) : une marque sans boîtier n'est pas permise.
  brand: { initial: "nikon", valid: oneOf(BODIES.map((body) => body.brand)) },
  exposureMode: { initial: "M", valid: oneOf(Object.keys(EXPOSURE_MODES)) },
  // La correction d'exposition ne se remet pas à zéro à l'extinction du Z 6 [nikon-z6-exposure-compensation] : elle
  // est mémorisée.
  compensation: { initial: 0, valid: index(-COMPENSATION_RANGE, COMPENSATION_RANGE) },
  // Contrôle de la sensibilité auto : activé par défaut sur le Z 6 [nikon-z6-defaults].
  autoIso: { initial: true, valid: isBoolean },
  maxIso: { initial: SCALES.iso - 1, valid: index(MAX_ISO_FIRST, SCALES.iso - 1) },
  minShutter: { initial: shutterIndexOf(DEFAULT_MIN_SHUTTER), valid: index(0, SCALES.shutter - 1) },
  // Réglages par défaut du Z 6 [nikon-z6-defaults] : AF ponctuel (« Single AF »), AF point sélectif, détection des
  // visages et des yeux (a4). AF-S depuis la version 0.3.36 ; AF-C avant, choisi faute d'avoir lu cette page.
  focusMode: { initial: "single", valid: oneOf(FOCUS_MODES) },
  areaMode: { initial: "point", valid: oneOf(AREA_MODES) },
  detection: { initial: "faceEye", valid: oneOf(Object.keys(DETECTIONS)) },
  // Réglages par défaut du Z 6 (« Defaults », lu le 10 novembre 2026) [nikon-z6-defaults] : Continu L à 3 vues par
  // seconde (d1), retardateur de 10 s (c2).
  release: { initial: "single", valid: oneOf(RELEASE_KINDS) },
  clRate: { initial: 3, valid: oneOf(CL_RATES) },
  timerDelay: { initial: 10, valid: oneOf(TIMER_DELAYS) },
  // Aperçu dans le viseur en marche par défaut (décision du 9 novembre 2026, ui/cameraPanel.ts) ; grille « Aucune » par
  // défaut, comme sur le Z 6 (réglage d9, « Off ») [nikon-z6-defaults] et l'A6000 (« Off (default setting) »)
  // [sony-a6000-grid-line] (docs/camera-physique.md, « Grilles de cadrage »).
  previewAll: { initial: true, valid: isBoolean },
  previewBrightness: { initial: true, valid: isBoolean },
  previewNoise: { initial: true, valid: isBoolean },
  previewDepthOfField: { initial: true, valid: isBoolean },
  previewBalance: { initial: true, valid: isBoolean },
  grid: { initial: "none", valid: isGridKind },
  reviewDisplay: { initial: "photo", valid: oneOf(REVIEW_DISPLAYS) },
};

/** Clés de la mémoire du navigateur : chacune avec ses champs, dans l'ordre où ils s'écrivent, et leur réglage. */
export const STORAGE: readonly { readonly key: string; readonly fields: readonly (readonly [field: string, setting: SettingKey])[] }[] = [
  {
    key: "tutophoto.boitier",
    fields: [
      ["brand", "brand"],
      ["focusMode", "focusMode"],
      ["areaMode", "areaMode"],
      ["detection", "detection"],
      ["release", "release"],
      ["clRate", "clRate"],
      ["timerDelay", "timerDelay"],
      ["exposureMode", "exposureMode"],
      ["compensation", "compensation"],
      ["autoIso", "autoIso"],
      ["maxIso", "maxIso"],
      ["minShutter", "minShutter"],
    ],
  },
  {
    key: "tutophoto.apercu",
    fields: [
      ["all", "previewAll"],
      ["brightness", "previewBrightness"],
      ["noise", "previewNoise"],
      ["depthOfField", "previewDepthOfField"],
      ["balance", "previewBalance"],
      ["grid", "grid"],
    ],
  },
  { key: "tutophoto.revue", fields: [["display", "reviewDisplay"]] },
];

/** Ce que le magasin demande de la mémoire du navigateur ; window.localStorage l'est. */
export interface SettingsStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** La mémoire du navigateur, ou null quand y accéder lève une exception (stockage bloqué par le navigateur). */
export function browserStorage(): SettingsStorage | null {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Valeurs de départ de tous les réglages. */
export function initialSettings(): Settings {
  const settings = {} as Record<SettingKey, unknown>;
  for (const key of Object.keys(SETTINGS) as SettingKey[]) settings[key] = SETTINGS[key].initial;
  return settings as unknown as Settings;
}

/** Contenu d'une clé de la mémoire, s'il est un objet JSON ; null sinon (clé absente, illisible, mémoire indisponible). */
function readKey(storage: SettingsStorage | null, key: string): Record<string, unknown> | null {
  if (!storage) return null;
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? "null");
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Réglages relus dans la mémoire : chaque champ valide remplace la valeur de départ de son réglage. */
export function readSettings(storage: SettingsStorage | null): Settings {
  const settings = initialSettings() as unknown as Record<SettingKey, unknown>;
  for (const { key, fields } of STORAGE) {
    const saved = readKey(storage, key);
    if (!saved) continue;
    for (const [field, setting] of fields) {
      const value = saved[field];
      if (SETTINGS[setting].valid(value)) settings[setting] = value;
    }
  }
  return settings as unknown as Settings;
}

/** Écrit en entier chaque clé dont un réglage a changé. */
function writeSettings(storage: SettingsStorage | null, settings: Readonly<Settings>, changed: ReadonlySet<SettingKey>): void {
  if (!storage) return;
  for (const { key, fields } of STORAGE) {
    if (!fields.some(([, setting]) => changed.has(setting))) continue;
    const saved: Record<string, unknown> = {};
    for (const [field, setting] of fields) saved[field] = settings[setting];
    try {
      storage.setItem(key, JSON.stringify(saved));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }
}

/** Mode de déclenchement retenu : vues par seconde au plus en rafale, délai du retardateur en secondes. */
export interface ReleaseMode {
  kind: ReleaseKind;
  /** Vues par seconde au plus, en rafale ; 1 hors rafale. */
  fps: number;
  /** Délai du retardateur, en secondes. */
  delay: number;
}

export function releaseMode(settings: Pick<Settings, "release" | "clRate" | "timerDelay">): ReleaseMode {
  const kind = settings.release;
  const fps = kind === "cl" ? settings.clRate : kind === "ch" || kind === "chx" ? RELEASE_FPS[kind] : 1;
  return { kind, fps, delay: settings.timerDelay };
}

/** Appelé après chaque écriture qui change au moins un réglage, avec les réglages changés. */
export type SettingsListener = (changed: ReadonlySet<SettingKey>) => void;

export class SettingsStore {
  /** Mémoire du navigateur ; null : sans mémoire. */
  private readonly storage: SettingsStorage | null;
  /** Réglages courants ; un nouvel objet, figé, à chaque changement. */
  private state: Readonly<Settings>;
  private readonly listeners: SettingsListener[] = [];

  /**
   * Relit la mémoire (null : sans mémoire, valeurs de départ). Les champs sont posés un par un, sans paramètre de
   * propriété : les tests rapides chargent ce module par Node.js, qui ne retire que les types et refuse les « parameter
   * properties » [nodejs-22-typescript].
   */
  constructor(storage: SettingsStorage | null) {
    this.storage = storage;
    this.state = Object.freeze(readSettings(storage));
  }

  get<K extends SettingKey>(key: K): Settings[K] {
    return this.state[key];
  }

  /** Tous les réglages courants, figés : l'objet reste valable après un changement, qui en crée un autre. */
  all(): Readonly<Settings> {
    return this.state;
  }

  /**
   * Change un ou plusieurs réglages d'un coup. Un réglage inconnu ou une valeur refusée lèvent une exception, sans rien
   * changer : c'est une erreur du code, pas un choix de l'utilisateur. Puis les clés de la mémoire touchées s'écrivent,
   * et les abonnés sont prévenus une fois ; rien de tout cela si aucune valeur ne change.
   */
  set(changes: Partial<Settings>): void {
    const next = { ...this.state } as Record<SettingKey, unknown>;
    const changed = new Set<SettingKey>();
    for (const [key, value] of Object.entries(changes) as [SettingKey, unknown][]) {
      if (!Object.prototype.hasOwnProperty.call(SETTINGS, key)) throw new Error(`Réglage inconnu : ${key}`);
      if (!SETTINGS[key].valid(value)) throw new Error(`Valeur refusée pour le réglage ${key} : ${JSON.stringify(value)}`);
      if (next[key] === value) continue;
      next[key] = value;
      changed.add(key);
    }
    if (changed.size === 0) return;
    this.state = Object.freeze(next as unknown as Settings);
    writeSettings(this.storage, this.state, changed);
    for (const listener of [...this.listeners]) listener(changed);
  }

  /** Abonnement aux changements ; renvoie de quoi se désabonner. */
  subscribe(listener: SettingsListener): () => void {
    this.listeners.push(listener);
    return () => {
      const at = this.listeners.indexOf(listener);
      if (at >= 0) this.listeners.splice(at, 1);
    };
  }
}
