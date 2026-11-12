// Boîtier virtuel minimal : ouverture, vitesse, ISO, focale, boîtier de référence, cellule d'exposition,
// mode de mise au point.
// L'aperçu d'exposition multiplie la lumière de la scène par 2^écart (écart en IL, camera/exposure.ts),
// avant l'affichage ; sans courbe de tons, ce qui dépasse le blanc est écrêté.
// Aperçu dans le viseur (décision du 9 novembre 2026) : un interrupteur général et un par effet
// (luminosité, bruit), en marche par défaut. Coupé, le viseur reste correctement exposé et sans bruit ;
// la photo garde toujours tous les effets.
// Loupe du viseur (même décision) : grossit l'image autour du point de mise au point, jusqu'à 100 % (un
// pixel du canevas pour un photosite), comme la fonction de grossissement des hybrides. Elle ne change
// que l'affichage : la photo couvre toujours tout le cadre.
// Mise au point (décisions du 9 novembre 2026, camera/autofocus.ts) : mode AF-S ou AF-C (MAP-04) et mode de
// zone AF (MAP-05, MAP-09), point sélectif, zone large (S) ou (L), ou zone automatique avec la détection des
// visages et des yeux (réglage a4 du Z 6), choisis dans la fenêtre « Mise au point ». Le
// viseur indique le mode, la zone et la distance ; le repère passe au vert quand la distance est verrouillée,
// comme le point AF du Nikon Z 6 [nikon-z6-focus].
// Collimateurs (MAP-06, version 0.3.34 ; par boîtier depuis la version 0.3.43) : le point et les zones restent
// dans la zone couverte par l'autofocus (afMargins), affichée en pointillés dans le viseur.
// Exposition (BOI-07, BOI-08, MES-04, MES-10, version 0.3.36) : modes M, A et S, correction d'exposition et ISO auto,
// dans la fenêtre « Exposition » ouverte par l'indicateur ; l'appareil choisit ce que le mode lui laisse
// (camera/exposureModes.ts), et tout le reste (viseur, bruit, profondeur de champ, photo) suit ses réglages.
// Grilles de cadrage (CMP-02, version 0.3.56) : une aide du viseur, choisie dans la fenêtre « Aperçu », la même
// pour tous les boîtiers (GRIDS ; décision de Julien du 12 novembre 2026 : les grilles sont des outils de
// composition, les mêmes partout). Choix de TutoPhoto, non sourcés, confirmés par Julien : la grille est masquée
// quand la loupe agrandit l'image, et elle n'est dessinée ni sur la photo ni sur l'écran de revue (aucune page lue
// ne dit ce que fait un boîtier). Non simulé : le quadrillage du Nikon Z 6, dont le manuel ne décrit pas le tracé ;
// les grilles « Square Grid » et « Diag. + Square Grid » de Sony, non décrites.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import type { FreeCameraTouchInput } from "@babylonjs/core/Cameras/Inputs/freeCameraTouchInput";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { BODIES, findBody, sensorPixels, type Body, type Brand, type Format } from "../camera/bodies";
import {
  DEFAULT_FOCAL_INDEX,
  DEFAULT_SETTINGS,
  FOCAL_LENGTHS,
  SCALES,
  apertureLabel,
  apertureValue,
  isoLabel,
  isoValue,
  shutterIndexOf,
  shutterLabel,
  shutterSeconds,
  type ExposureSettings,
} from "../camera/exposure";
import { COMPENSATION_RANGE, resolveExposure, type ExposureMode, type ResolvedExposure } from "../camera/exposureModes";
import { cameraFov, frameFor, type Frame } from "../camera/viewfinder";
import type { ViewfinderNoise } from "../camera/noise";
import type { ViewfinderDepthOfField } from "../camera/viewfinderDof";
import type { AreaMode, Autofocus, FocusArea, FocusMode, Rect } from "../camera/autofocus";
import type { Detection } from "../camera/faces";
import type { BalanceIndicator } from "./balance";

/**
 * Couverture de l'autofocus (MAP-06) : environ 90 % du cadre en largeur et en hauteur, au centre. Nikon, pour
 * le Z 6 : « 273 focus points*, enabling broad coverage of approximately 90% of the imaging area both
 * horizontally and vertically », avec « * With FX (36x24) format and single-point AF » (communiqué du
 * 23 août 2018) [nikon-z6-launch-2018] ; même chiffre dans le communiqué du 15 août 2019 [nikon-z6-eisa-2019]
 * et sur la page du produit [nikon-z6-product]. Appliquée à tous les modes de zone. Depuis la version 0.3.43,
 * chaque boîtier a sa couverture quand elle est sourcée (camera/bodies.ts, afCoverage : Canon EOS RP, 88 % sur
 * le grand côté et 100 % sur le petit ; depuis la 0.3.45, Sony A7 III, 93 % de la surface, partagés également
 * entre les deux côtés) ; les autres gardent celle du Z 6, ce qui n'est pas sourcé pour eux
 * (décision de Julien du 11 novembre 2026 : hybrides ajoutés une fois lus, reflex en V2). La disposition des
 * points n'est pas dans ces sources : le point se place partout dans la zone couverte, sans grille.
 *   https://www.nikon.com/news/2018/0823_mirrorless_01.htm
 *   https://www.nikon.com/news/2019/0815_award_01.htm
 *   https://imaging.nikon.com/imaging/lineup/mirrorless/z_6/
 */
export const AF_COVERAGE = { horizontal: 0.9, vertical: 0.9 };

/**
 * Mode de déclenchement (BOI-12), d'après le manuel du Nikon Z 6 (« The Release Mode/Self-Timer Button »,
 * lu le 10 novembre 2026) [nikon-z6-release-mode]
 * https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_04.html : vue par vue ; Continu L, 1 à 5 vues par seconde ; Continu H,
 * jusqu'à environ 5,5 ; Continu H (étendu), 12 au Z 6 en JPEG ; retardateur de 2, 5, 10 ou 20 s. Réglages par
 * défaut du Z 6 (« Defaults », lu le 10 novembre 2026) [nikon-z6-defaults] : 3 vues par seconde (d1), 10 s (c2).
 */
export type ReleaseKind = "single" | "cl" | "ch" | "chx" | "timer";
export interface ReleaseMode {
  kind: ReleaseKind;
  /** Vues par seconde au plus, en rafale. */
  fps: number;
  /** Délai du retardateur, en secondes. */
  delay: number;
}
const RELEASE_FPS: Record<"ch" | "chx", number> = { ch: 5.5, chx: 12 };
const EXPOSURE_MODES: readonly ExposureMode[] = ["M", "A", "S"];
/** Sensibilité maximale de l'ISO auto : de ISO 200 (Z 6) au haut de l'échelle de TutoPhoto, ISO 6400. */
const MAX_ISO_FIRST = 3;
/**
 * Vitesse minimale par défaut. Le Z 6 a « Auto » par défaut [nikon-z6-defaults], selon la focale, sans règle
 * publiée ; le manuel du D850 fixe 1/30 s quand « Auto » ne peut pas fonctionner (objectif sans données)
 * [nikon-d850-auto-iso].
 *   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html
 *   https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html
 */
const DEFAULT_MIN_SHUTTER = "1/30";
const CL_RATES = [1, 2, 3, 4, 5] as const;
const TIMER_DELAYS = [2, 5, 10, 20] as const;
import { t, type Lang, type MessageKey } from "../i18n";

/** Écart maximal affiché par la cellule, en IL. */
const METER_RANGE = 3;
const STORAGE_KEY = "tutophoto.boitier";
const PREVIEW_STORAGE_KEY = "tutophoto.apercu";
/** Grossissements de la loupe, en fraction de la vue à 100 % ; un cran trop proche de 1 est sauté. */
const LOUPE_LEVELS = [0.5, 1] as const;
const LOUPE_MIN_ZOOM = 1.25;
/**
 * Côté des zones larges, en fraction du grand côté du cadre : zones carrées. Le manuel du Z 6 dit seulement
 * que les zones (L) sont plus grandes que les zones (S) ; ces tailles sont choisies pour TutoPhoto.
 */
const WIDE_AREA_SIZE: Record<"wideS" | "wideL", number> = { wideS: 0.1, wideL: 0.2 };
const AREA_KEYS: Record<AreaMode, { label: MessageKey; short: MessageKey }> = {
  point: { label: "areaPoint", short: "areaPointShort" },
  wideS: { label: "areaWideS", short: "areaWideSShort" },
  wideL: { label: "areaWideL", short: "areaWideLShort" },
  auto: { label: "areaAuto", short: "areaAutoShort" },
};
const DETECTIONS: readonly Detection[] = ["faceEye", "face", "animal", "off"];
const TARGET_KEYS: Record<"eye" | "face" | "nearest" | "point", MessageKey> = {
  eye: "targetEye",
  face: "targetFace",
  nearest: "targetNearest",
  point: "targetPoint",
};

/**
 * Grilles de cadrage (CMP-02, version 0.3.56) : positions des lignes, en fractions du grand côté et du petit côté du
 * cadre. Les mêmes grilles pour tous les boîtiers (décision de Julien du 12 novembre 2026) : celles que les manuels
 * lus nomment ou montrent.
 * - « thirds » : deux lignes dans chaque sens, aux tiers. Sony, « Grid Line », « Rule of 3rds Grid » : « Place
 *   main subjects close to one of the grid lines that divide the image into thirds for a well-balanced
 *   composition » (guides d'aide de l'A7 III et de l'A6000) [sony-a7iii-grid-line] [sony-a6000-grid-line] ; le
 *   nombre de lignes est déduit de ce texte, la page n'a pas d'illustration. Canon, « 3x3 » : « Displays grid lines
 *   in a 3x3 pattern » (manuel de l'EOS 850D) [canon-850d-grid-display].
 * - « sixteen » : trois lignes dans chaque sens, aux quarts, soit seize cases. Nikon, Digitutor du D5600, « Framing
 *   Grid (Live View) » : c'est ce que montre l'illustration de l'affichage « Framing grid » ; le texte de la page
 *   ne donne pas ce nombre [nikon-d5600-digitutor-framing-grid]. Lignes mesurées sur l'illustration à environ
 *   25 %, 50 % et 75 % du cadre ; les quarts exacts sont retenus.
 * - « twentyFour » : Canon, « 6x4 » : « Displays grid lines in a 6x4 pattern » [canon-850d-grid-display]. Six
 *   cases sur le grand côté et quatre sur le petit : sens déduit du nom, la page ne le dit pas (sur un capteur
 *   3:2, les cases sont alors carrées).
 * - « thirdsDiagonals » : Canon, « 3x3+diag » : « Displays a grid together with diagonal lines »
 *   [canon-850d-grid-display]. Deux diagonales d'un coin du cadre à l'autre : tracé déduit de l'icône du menu
 *   (capture du manuel de l'EOS R6) [canon-r6-shooting-info-display], la page ne le décrit pas.
 * Les manuels de Canon lus sont ceux de l'EOS 850D et de l'EOS R6, pas ceux des boîtiers du simulateur.
 * Par défaut, aucune grille : « d9 Framing grid display Off » sur le Z 6 [nikon-z6-defaults], « Off (default
 * setting) » sur l'A6000 [sony-a6000-grid-line]. Le manuel du Z 6 dit seulement « Choose On to display a grid for
 * reference when framing shots » [nikon-z6-d9] : son tracé n'est pas simulé.
 *   https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653165.html
 *   https://helpguide.sony.net/gbmig/45349331/v1/en/contents/TP0000518347.html
 *   https://imaging.nikon.com/imaging/support/digitutor/d5600/functions/framing_grid_liveview.html
 *   https://cam.start.canon/en/C002/manual/html/UG-09_Set-up_0200.html
 *   https://cam.start.canon/en/C004/manual/html/UG-03_Shooting-1_0360.html
 *   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_d09.html
 */
type GridKind = "none" | "thirds" | "sixteen" | "twentyFour" | "thirdsDiagonals";
interface GridLayout {
  /** Lignes qui divisent le grand côté du cadre, puis le petit côté, en fractions de ce côté. */
  long: readonly number[];
  short: readonly number[];
  diagonals: boolean;
}
const THIRDS = [1 / 3, 2 / 3] as const;
const QUARTERS = [1 / 4, 1 / 2, 3 / 4] as const;
const GRIDS: Record<GridKind, GridLayout> = {
  none: { long: [], short: [], diagonals: false },
  thirds: { long: THIRDS, short: THIRDS, diagonals: false },
  sixteen: { long: QUARTERS, short: QUARTERS, diagonals: false },
  twentyFour: { long: [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6], short: QUARTERS, diagonals: false },
  thirdsDiagonals: { long: THIRDS, short: THIRDS, diagonals: true },
};
const isGridKind = (value: unknown): value is GridKind => typeof value === "string" && Object.prototype.hasOwnProperty.call(GRIDS, value);
const SVG_NS = "http://www.w3.org/2000/svg";

/** Interrupteurs de l'aperçu dans le viseur. */
const PREVIEW_SWITCHES = ["all", "brightness", "noise", "depthOfField", "balance"] as const;
type PreviewSwitch = (typeof PREVIEW_SWITCHES)[number];

/** Aperçu dans le viseur : interrupteurs et grille de cadrage. */
interface Preview {
  all: boolean;
  brightness: boolean;
  noise: boolean;
  depthOfField: boolean;
  /** Indicateur d'équilibre (ui/balance.ts) : une aide, que l'on peut couper pour s'entraîner. */
  balance: boolean;
  /** Grille de cadrage : une aide, qui ne dépend pas de l'interrupteur général. */
  grid: GridKind;
}

type Dial = "aperture" | "shutter" | "iso" | "focal";

/** Réglages courants, pour la photo calculée. */
export interface CurrentSettings {
  body: Body;
  focalMm: number;
  aperture: number;
  shutterSeconds: number;
  iso: number;
  exposure: number;
  frame: Frame;
  /** Réglages tels qu'affichés : « M · f/8 · 1/100 s · ISO 100 · 50 mm ». */
  summary: string;
  /** Libellés des réglages retenus, un par un : « f/8 », « 1/100 s », « ISO 100 », « 50 mm ». */
  labels: { aperture: string; shutter: string; iso: string; focal: string };
}

interface PanelElements {
  panel: HTMLElement;
  frame: HTMLElement;
  /** Conteneur des lignes de la grille de cadrage, dans le cadre du viseur. */
  grid: HTMLElement;
  meterNeedle: HTMLElement;
  meterValue: HTMLElement;
  bodyButton: HTMLButtonElement;
  bodyDialog: HTMLDialogElement;
  previewButton: HTMLButtonElement;
  previewDialog: HTMLDialogElement;
  previewBadge: HTMLElement;
  loupeButton: HTMLButtonElement;
  loupeBadge: HTMLElement;
  afButton: HTMLButtonElement;
  afDialog: HTMLDialogElement;
  releaseButton: HTMLButtonElement;
  releaseDialog: HTMLDialogElement;
  exposureDialog: HTMLDialogElement;
  afBadge: HTMLElement;
  focusMarker: HTMLElement;
  afCoverage: HTMLElement;
  focusHint: HTMLElement;
}

type Point = { x: number; y: number };

export class CameraPanel {
  /** Réglages choisis avec les molettes ; l'appareil peut en changer certains (resolved). */
  private settings: ExposureSettings = { ...DEFAULT_SETTINGS };
  private exposureMode: ExposureMode = "M";
  /** Correction d'exposition, en tiers d'IL. */
  private compensation = 0;
  /** Contrôle de la sensibilité auto : activé par défaut sur le Z 6 [nikon-z6-defaults]. */
  private autoIso = true;
  private maxIso = SCALES.iso - 1;
  private minShutter = shutterIndexOf(DEFAULT_MIN_SHUTTER);
  private focalIndex = DEFAULT_FOCAL_INDEX;
  private brand: Brand = "nikon";
  private format: Format = "ff";
  private lang: Lang;
  private frame: Frame | null = null;
  private preview: Preview = { all: true, brightness: true, noise: true, depthOfField: true, balance: true, grid: "none" };
  /** Grille dont les lignes sont tracées dans le cadre ; null avant le premier tracé. */
  private drawnGrid: string | null = null;
  private balance: BalanceIndicator | null = null;
  private dof: ViewfinderDepthOfField | null = null;
  private autofocus: Autofocus | null = null;
  /**
   * Réglages par défaut du Z 6 [nikon-z6-defaults] : AF ponctuel (« Single AF »), AF point sélectif, détection des
   * visages et des yeux (a4). AF-S depuis la version 0.3.36 ; AF-C avant, choisi faute d'avoir lu cette page.
   */
  private focusMode: FocusMode = "single";
  private areaMode: AreaMode = "point";
  private detection: Detection = "faceEye";
  private releaseKind: ReleaseKind = "single";
  private clRate = 3;
  private timerDelay = 10;
  /** Cran de la loupe dans LOUPE_LEVELS ; -1 : pas de loupe. */
  private loupeLevel = -1;
  private loupeZoom = 1;
  /** Centre de la zone grossie, en coordonnées normalisées du canevas (de -1 à 1, y vers le haut). */
  private loupeCenter: Point = { x: 0, y: 0 };
  /** Point de mise au point, dans le cadre complet (de 0 à 1, origine en haut à gauche). */
  private focusPoint: Point = { x: 0.5, y: 0.5 };
  private canvasSize = { width: 1, height: 1 };
  private readonly baseAngularSensibility: number;
  private readonly baseTouchSensibility: number | null;
  private readonly viewListeners: (() => void)[] = [];
  /** Faux pendant le calcul d'une photo, qui a sa propre projection : la loupe n'y touche pas. */
  private enabled = true;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: UniversalCamera,
    private readonly el: PanelElements,
    lang: Lang,
    private readonly noise: ViewfinderNoise,
  ) {
    this.lang = lang;
    this.baseAngularSensibility = camera.angularSensibility;
    const touch = camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
    this.baseTouchSensibility = touch ? touch.touchAngularSensibility : null;
    el.loupeButton.addEventListener("click", () => this.cycleLoupe());
    el.afButton.addEventListener("click", () => el.afDialog.showModal());
    el.releaseButton.addEventListener("click", () => el.releaseDialog.showModal());
    el.meterValue.addEventListener("click", () => el.exposureDialog.showModal());
    for (const input of el.exposureDialog.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select")) {
      input.addEventListener("change", () => {
        if (input.name === "exposureMode") this.exposureMode = input.value as ExposureMode;
        if (input.name === "compensation") this.compensation = Number(input.value);
        if (input.name === "autoIso") this.autoIso = (input as HTMLInputElement).checked;
        if (input.name === "maxIso") this.maxIso = Number(input.value);
        if (input.name === "minShutter") this.minShutter = Number(input.value);
        this.saveBody();
        this.update();
      });
    }
    for (const input of el.releaseDialog.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[type=radio], select")) {
      input.addEventListener("change", () => {
        if (input.name === "release") this.releaseKind = input.value as ReleaseKind;
        if (input.name === "clRate") this.clRate = Number(input.value);
        if (input.name === "timerDelay") this.timerDelay = Number(input.value);
        this.saveBody();
        this.updateRelease();
      });
    }
    for (const input of el.afDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.addEventListener("change", () => {
        if (input.name === "focusMode") this.focusMode = input.value as FocusMode;
        if (input.name === "areaMode") this.areaMode = input.value as AreaMode;
        if (input.name === "detection") this.detection = input.value as Detection;
        this.saveBody();
        this.autofocus?.setMode(this.focusMode);
        this.updateFocus();
        for (const listener of this.viewListeners) listener();
      });
    }
    this.restoreBody();
    this.restorePreview();
    for (const button of el.panel.querySelectorAll<HTMLButtonElement>("button[data-dial]")) {
      button.addEventListener("click", () => this.step(button.dataset.dial as Dial, Number(button.dataset.step)));
    }
    el.bodyButton.addEventListener("click", () => el.bodyDialog.showModal());
    for (const input of el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.addEventListener("change", () => {
        if (input.name === "brand") this.brand = input.value as Brand;
        if (input.name === "format") this.format = input.value as Format;
        this.saveBody();
        this.update();
      });
    }
    el.previewButton.addEventListener("click", () => el.previewDialog.showModal());
    for (const input of el.previewDialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.addEventListener("change", () => {
        this.preview[input.value as PreviewSwitch] = input.checked;
        this.savePreview();
        this.update();
      });
    }
    for (const input of el.previewDialog.querySelectorAll<HTMLInputElement>("input[name=grid]")) {
      input.addEventListener("change", () => {
        if (isGridKind(input.value)) this.preview.grid = input.value;
        this.savePreview();
        this.update();
      });
    }
    engine.onResizeObservable.add(() => this.applyView());
    this.update();
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.update();
  }

  current(): CurrentSettings {
    if (!this.frame) this.applyView();
    const resolved = this.resolved();
    return {
      body: this.body(),
      focalMm: FOCAL_LENGTHS[this.focalIndex],
      aperture: apertureValue(resolved.settings.aperture),
      shutterSeconds: shutterSeconds(resolved.settings.shutter),
      iso: isoValue(resolved.settings.iso),
      exposure: 2 ** resolved.offset,
      frame: this.frame!,
      summary: this.summary(resolved),
      labels: {
        aperture: this.label("aperture", resolved),
        shutter: this.label("shutter", resolved),
        iso: `ISO ${this.label("iso", resolved)}`,
        focal: this.label("focal", resolved),
      },
    };
  }

  /** Réglages retenus par l'appareil, selon le mode, la correction et l'ISO auto. */
  private resolved(): ResolvedExposure {
    return resolveExposure({
      mode: this.exposureMode,
      chosen: this.settings,
      compensation: this.compensation,
      autoIso: this.autoIso,
      maxIso: this.maxIso,
      minShutter: this.minShutter,
    });
  }

  /** « A · f/4 · 1/200 s · ISO 100 (auto) · corr. +1,0 IL · 50 mm ». */
  private summary(resolved: ResolvedExposure): string {
    const tr = (key: MessageKey) => t(this.lang, key);
    const iso = `ISO ${this.label("iso", resolved)}${this.autoIso ? ` (${tr("setByCamera")})` : ""}`;
    const parts = [this.exposureMode, this.label("aperture", resolved), this.label("shutter", resolved), iso];
    if (this.compensation !== 0) parts.push(`${tr("compensationShort")} ${this.compensationText(this.compensation)} ${tr("meterUnit")}`);
    parts.push(this.label("focal", resolved));
    return parts.join(" · ");
  }

  /** Correction en IL, avec un chiffre après la virgule, comme l'affiche le Z 6 (« ±0.0 »). */
  private compensationText(thirds: number): string {
    const value = (Math.abs(thirds) / 3).toFixed(1);
    const sign = thirds > 0 ? "+" : thirds < 0 ? "−" : "±";
    return `${sign}${this.lang === "fr" ? value.replace(".", ",") : value}`;
  }

  /** Indicateur d'équilibre, créé après le panneau. */
  attachBalance(balance: BalanceIndicator): void {
    this.balance = balance;
    this.update();
  }

  /** Rapport entre l'image réelle et l'image affichée : 2^écart quand l'aperçu de la luminosité est coupé. */
  displayGain(): number {
    return this.showsBrightness() ? 1 : 2 ** this.resolved().offset;
  }

  /** Autofocus du viseur, créé après le panneau (il lit le point de mise au point). */
  attachAutofocus(autofocus: Autofocus): void {
    this.autofocus = autofocus;
    autofocus.setMode(this.focusMode);
    autofocus.onChange(() => this.updateFocus());
    this.updateFocus();
  }

  /** Profondeur de champ du viseur, créée après le panneau (elle lit le point de mise au point). */
  attachDepthOfField(dof: ViewfinderDepthOfField): void {
    this.dof = dof;
    this.update();
  }

  /** Point de mise au point dans le cadre complet (de 0 à 1, origine en haut à gauche). */
  focusPointInFrame(): Point {
    return { ...this.focusPoint };
  }

  /** Point de mise au point dans le canevas (de 0 à 1, origine en haut à gauche), loupe comprise. */
  focusOnCanvas(): Point {
    if (!this.frame) return { x: 0.5, y: 0.5 };
    const shown = this.frameToDisplayed(this.focusPoint);
    const frame = this.frame;
    return {
      x: (frame.left + shown.x * frame.width) / this.canvasSize.width,
      y: (frame.top + shown.y * frame.height) / this.canvasSize.height,
    };
  }

  /**
   * Point et zone de mise au point dans le canevas, loupe comprise : zone large rognée à la zone couverte par
   * l'autofocus, ou toute cette zone et le réglage de détection en zone automatique.
   */
  focusArea(): FocusArea {
    const point = this.focusOnCanvas();
    const bounds = this.coverageOnCanvas();
    if (!this.frame || !bounds) return { point, zone: null, auto: null };
    const frame = this.frame;
    const { width, height } = this.canvasSize;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    if (this.areaMode === "auto") {
      return {
        point,
        zone: bounds,
        auto: {
          detection: this.detection,
          frame: bounds,
          frameLongSidePx: Math.max(frame.width, frame.height),
          zoom: this.loupeZoom,
          canvasWidth: width,
          canvasHeight: height,
        },
      };
    }
    const size = this.zoneOnCanvas();
    if (!size) return { point, zone: null, auto: null };
    return {
      point,
      zone: {
        left: clamp(point.x - size.width / 2, bounds.left, bounds.right),
        right: clamp(point.x + size.width / 2, bounds.left, bounds.right),
        top: clamp(point.y - size.height / 2, bounds.top, bounds.bottom),
        bottom: clamp(point.y + size.height / 2, bounds.top, bounds.bottom),
      },
      auto: null,
    };
  }

  /**
   * Zone couverte par l'autofocus dans le canevas (fractions), loupe comprise, rognée à la partie visible du
   * cadre ; null avant la première mise en page.
   */
  coverageOnCanvas(): Rect | null {
    if (!this.frame) return null;
    const frame = this.frame;
    const { width, height } = this.canvasSize;
    const onCanvas = (point: Point) => {
      const shown = this.frameToDisplayed(point);
      return {
        x: (frame.left + Math.min(1, Math.max(0, shown.x)) * frame.width) / width,
        y: (frame.top + Math.min(1, Math.max(0, shown.y)) * frame.height) / height,
      };
    };
    const margin = this.afMargins();
    const start = onCanvas({ x: margin.x, y: margin.y });
    const end = onCanvas({ x: 1 - margin.x, y: 1 - margin.y });
    return { left: start.x, top: start.y, right: end.x, bottom: end.y };
  }

  /**
   * Marges de la zone couverte par l'autofocus, en fractions du cadre (x en largeur, y en hauteur) : couverture du
   * boîtier, ou celle du Z 6 quand elle n'est pas sourcée ; grand et petit côtés échangés en cadrage vertical.
   */
  private afMargins(): { x: number; y: number } {
    const coverage = this.body().afCoverage ?? AF_COVERAGE;
    const portrait = this.frame?.portrait ?? false;
    const across = portrait ? coverage.vertical : coverage.horizontal;
    const down = portrait ? coverage.horizontal : coverage.vertical;
    return { x: (1 - across) / 2, y: (1 - down) / 2 };
  }

  /** Point du cadre ramené dans la zone couverte par l'autofocus, au plus près. */
  private clampToCoverage(point: Point): Point {
    const margin = this.afMargins();
    const clamp = (value: number, m: number) => Math.min(1 - m, Math.max(m, value));
    return { x: clamp(point.x, margin.x), y: clamp(point.y, margin.y) };
  }

  /** Taille de la zone large dans le canevas (fractions de sa largeur et de sa hauteur) ; null pour un point. */
  zoneOnCanvas(): { width: number; height: number } | null {
    if (this.areaMode === "point" || this.areaMode === "auto" || !this.frame) return null;
    const side = WIDE_AREA_SIZE[this.areaMode] * Math.max(this.frame.width, this.frame.height) * this.loupeZoom;
    return { width: side / this.canvasSize.width, height: side / this.canvasSize.height };
  }

  /** Mode de déclenchement courant. */
  releaseMode(): ReleaseMode {
    const fps = this.releaseKind === "cl" ? this.clRate : this.releaseKind === "ch" || this.releaseKind === "chx" ? RELEASE_FPS[this.releaseKind] : 1;
    return { kind: this.releaseKind, fps, delay: this.timerDelay };
  }

  /** Bouton et fenêtre « Mode de déclenchement ». */
  private updateRelease(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const fpsText = (fps: number) => `${this.lang === "fr" ? String(fps).replace(".", ",") : fps} ${tr("releaseFpsShort")}`;
    const labels: Record<ReleaseKind, string> = {
      single: tr("releaseSingle"),
      cl: `${tr("releaseCL")} · ${fpsText(this.clRate)}`,
      ch: `${tr("releaseCH")} · ${fpsText(RELEASE_FPS.ch)}`,
      chx: `${tr("releaseCHX")} · ${fpsText(RELEASE_FPS.chx)}`,
      timer: `${tr("releaseTimer")} · ${this.timerDelay} s`,
    };
    this.el.releaseButton.textContent = labels[this.releaseKind];
    this.el.releaseButton.title = tr("releaseTitle");
    const dialog = this.el.releaseDialog;
    dialog.querySelector("#release-title")!.textContent = tr("releaseTitle");
    dialog.querySelector("#release-single-label")!.textContent = tr("releaseSingle");
    dialog.querySelector("#release-cl-label")!.textContent = tr("releaseCL");
    dialog.querySelector("#release-ch-label")!.textContent = `${tr("releaseCH")} (${fpsText(RELEASE_FPS.ch)})`;
    dialog.querySelector("#release-chx-label")!.textContent = `${tr("releaseCHX")} (${fpsText(RELEASE_FPS.chx)})`;
    dialog.querySelector("#release-timer-label")!.textContent = tr("releaseTimer");
    dialog.querySelector("#release-cl-rate-label")!.textContent = tr("releaseClRate");
    dialog.querySelector("#release-delay-label")!.textContent = tr("releaseDelay");
    dialog.querySelector("#release-note")!.textContent = tr("releaseNote");
    dialog.querySelector("#release-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) input.checked = input.value === this.releaseKind;
    const rate = dialog.querySelector<HTMLSelectElement>("select[name=clRate]")!;
    const delay = dialog.querySelector<HTMLSelectElement>("select[name=timerDelay]")!;
    rate.replaceChildren(...CL_RATES.map((r) => new Option(fpsText(r), String(r), false, r === this.clRate)));
    delay.replaceChildren(...TIMER_DELAYS.map((d) => new Option(`${d} s`, String(d), false, d === this.timerDelay)));
  }

  /** Pourquoi la vitesse (A) ou l'ouverture (S) clignote : trop ou pas assez de lumière. */
  private limitText(resolved: ResolvedExposure): string {
    return t(this.lang, resolved.offset - this.compensation / 3 > 0 ? "tooBright" : "tooDark");
  }

  /** Fenêtre « Exposition » : mode, correction, ISO auto. */
  private updateExposureDialog(tr: (key: MessageKey) => string): void {
    const dialog = this.el.exposureDialog;
    dialog.querySelector("#exposure-title")!.textContent = tr("exposureTitle");
    dialog.querySelector("#exposure-mode-legend")!.textContent = tr("exposureModeLegend");
    dialog.querySelector("#exposure-m-label")!.textContent = tr("modeM");
    dialog.querySelector("#exposure-a-label")!.textContent = tr("modeA");
    dialog.querySelector("#exposure-s-label")!.textContent = tr("modeS");
    dialog.querySelector("#exposure-comp-label")!.textContent = tr("compensation");
    dialog.querySelector("#exposure-auto-legend")!.textContent = tr("autoIsoLegend");
    dialog.querySelector("#exposure-auto-label")!.textContent = tr("autoIsoOn");
    dialog.querySelector("#exposure-max-label")!.textContent = tr("maxIso");
    dialog.querySelector("#exposure-min-label")!.textContent = tr("minShutter");
    dialog.querySelector("#exposure-note")!.textContent = tr("exposureNote");
    dialog.querySelector("#exposure-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=exposureMode]")) input.checked = input.value === this.exposureMode;
    dialog.querySelector<HTMLInputElement>("input[name=autoIso]")!.checked = this.autoIso;
    const unit = tr("meterUnit");
    const compensation = dialog.querySelector<HTMLSelectElement>("select[name=compensation]")!;
    const steps = Array.from({ length: 2 * COMPENSATION_RANGE + 1 }, (_, k) => COMPENSATION_RANGE - k);
    compensation.replaceChildren(...steps.map((c) => new Option(`${this.compensationText(c)} ${unit}`, String(c), false, c === this.compensation)));
    const maxIso = dialog.querySelector<HTMLSelectElement>("select[name=maxIso]")!;
    const isoSteps = Array.from({ length: SCALES.iso - MAX_ISO_FIRST }, (_, k) => MAX_ISO_FIRST + k);
    maxIso.replaceChildren(...isoSteps.map((i) => new Option(`ISO ${isoLabel(i)}`, String(i), false, i === this.maxIso)));
    maxIso.disabled = !this.autoIso;
    const minShutter = dialog.querySelector<HTMLSelectElement>("select[name=minShutter]")!;
    // Du plus rapide au plus lent, comme la liste du Z 6 (« from 1/4000 s to 30 s »).
    const shutterSteps = Array.from({ length: SCALES.shutter }, (_, k) => SCALES.shutter - 1 - k);
    minShutter.replaceChildren(
      ...shutterSteps.map((k) => new Option(this.label("shutter", { settings: { ...this.settings, shutter: k } }), String(k), false, k === this.minShutter)),
    );
    minShutter.disabled = !this.autoIso;
  }

  /** Mode de zone AF, pour la légende de la photo. */
  area(): AreaMode {
    return this.areaMode;
  }

  /** Appelé à chaque changement du viseur (taille, focale, boîtier, loupe). */
  onViewChange(listener: () => void): void {
    this.viewListeners.push(listener);
  }

  /**
   * Point de mise au point choisi, dans le cadre complet : ramené dans la zone couverte par l'autofocus (le plus
   * près du point touché), puis la loupe se centre dessus ; en AF-S, le toucher fait le point. Renvoie le point
   * retenu.
   */
  setFocusPoint(point: Point): Point {
    this.focusPoint = this.clampToCoverage(point);
    this.applyView();
    void this.autofocus?.touch();
    return { ...this.focusPoint };
  }

  /** Remet la projection du viseur (et la loupe) après le calcul d'une photo, qui la remplace. */
  restoreView(): void {
    this.applyView();
  }

  /** Point touché dans le cadre affiché (de 0 à 1) vers le point correspondant du cadre complet. */
  displayedToFrame(point: Point): Point {
    if (this.loupeZoom <= 1) return point;
    const ndc = this.frameToNdc(point);
    return this.ndcToFrame({ x: ndc.x / this.loupeZoom + this.loupeCenter.x, y: ndc.y / this.loupeZoom + this.loupeCenter.y });
  }

  /** Point du cadre complet vers sa position dans le cadre affiché (hors de 0 à 1 s'il n'est pas visible). */
  frameToDisplayed(point: Point): Point {
    if (this.loupeZoom <= 1) return point;
    const ndc = this.frameToNdc(point);
    return this.ndcToFrame({ x: (ndc.x - this.loupeCenter.x) * this.loupeZoom, y: (ndc.y - this.loupeCenter.y) * this.loupeZoom });
  }

  /** Faux pendant le calcul d'une photo. */
  isEnabled(): boolean {
    return this.enabled;
  }

  /** Grise les réglages pendant le calcul d'une photo. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    for (const button of this.el.panel.querySelectorAll<HTMLButtonElement>("button")) button.disabled = !enabled;
    // Les molettes que l'appareil règle lui-même (vitesse en A, ouverture en S) restent grisées.
    if (enabled) this.update();
  }

  private body() {
    return findBody(this.brand, this.format);
  }

  /** « + » augmente la valeur affichée : nombre f, durée de pose, ISO, focale. */
  private step(dial: Dial, delta: number): void {
    const clamp = (value: number, size: number) => Math.min(size - 1, Math.max(0, value));
    // En S, l'appareil choisit l'ouverture ; en A, la vitesse.
    if (dial === "aperture" && this.exposureMode !== "S") this.settings.aperture = clamp(this.settings.aperture + delta, SCALES.aperture);
    // L'échelle des vitesses va de 30 s à 1/4000 s : une pose plus longue est un indice plus petit.
    if (dial === "shutter" && this.exposureMode !== "A") this.settings.shutter = clamp(this.settings.shutter - delta, SCALES.shutter);
    if (dial === "iso") this.settings.iso = clamp(this.settings.iso + delta, SCALES.iso);
    if (dial === "focal") this.focalIndex = clamp(this.focalIndex + delta, FOCAL_LENGTHS.length);
    this.update();
  }

  /** Libellé d'un réglage retenu par l'appareil (ou choisi, pour les listes de la fenêtre « Exposition »). */
  private label(dial: Dial, resolved: { settings: ExposureSettings } = this.resolved()): string {
    const decimal = (text: string) => (this.lang === "fr" ? text.replace(".", ",") : text);
    const settings = resolved.settings;
    switch (dial) {
      case "aperture":
        return `f/${decimal(apertureLabel(settings.aperture))}`;
      case "shutter": {
        const label = shutterLabel(settings.shutter);
        return label.includes("/") ? `${label} s` : `${decimal(label)} s`;
      }
      case "iso":
        return isoLabel(settings.iso);
      case "focal":
        return `${FOCAL_LENGTHS[this.focalIndex]} mm`;
    }
  }

  private update(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const colon = this.lang === "fr" ? " : " : ": ";
    const resolved = this.resolved();
    for (const dial of ["aperture", "shutter", "iso", "focal"] as const) {
      const box = this.el.panel.querySelector<HTMLElement>(`[data-box="${dial}"]`);
      if (!box) continue;
      const byCamera = (dial === "aperture" && this.exposureMode === "S") || (dial === "shutter" && this.exposureMode === "A");
      const name = dial === "iso" && this.autoIso ? tr("isoAuto") : byCamera ? `${tr(dial)} (${tr("setByCamera")})` : tr(dial);
      box.querySelector(".dial-name")!.textContent = name;
      const output = box.querySelector("output")!;
      output.textContent = this.label(dial, resolved);
      output.classList.toggle("by-camera", byCamera || (dial === "iso" && resolved.isoAltered));
      output.classList.toggle("flashing", resolved.flashing === dial);
      output.title =
        dial === "iso" && resolved.isoAltered ? `${tr("isoChosen")}${colon}${isoLabel(this.settings.iso)}` : resolved.flashing === dial ? this.limitText(resolved) : "";
      for (const button of box.querySelectorAll<HTMLButtonElement>("button[data-step]")) button.disabled = !this.enabled || byCamera;
      box.querySelector<HTMLButtonElement>('[data-step="-1"]')!.setAttribute("aria-label", `${name}${colon}${tr("decrease")}`);
      box.querySelector<HTMLButtonElement>('[data-step="1"]')!.setAttribute("aria-label", `${name}${colon}${tr("increase")}`);
    }

    this.el.loupeButton.title = tr("loupeHelp");
    this.updateFocus();
    this.updateRelease();
    const offset = resolved.offset;
    // Indicateur d'exposition : en M, écart à l'exposition visée ; en A et S, il montre la correction.
    const indicator = resolved.indicator;
    const shown = Math.max(-METER_RANGE, Math.min(METER_RANGE, indicator));
    this.el.meterNeedle.style.left = `${((shown + METER_RANGE) / (2 * METER_RANGE)) * 100}%`;
    this.el.meterNeedle.classList.toggle("flashing", resolved.flashing !== null);
    const sign = indicator > 0.05 ? "+" : indicator < -0.05 ? "−" : "";
    const amount = Math.abs(indicator).toFixed(1);
    const correction = this.compensation !== 0 ? ` · ${tr("compensationShort")} ${this.compensationText(this.compensation)}` : "";
    this.el.meterValue.textContent = `${this.exposureMode} · ${sign}${this.lang === "fr" ? amount.replace(".", ",") : amount} ${tr("meterUnit")}${correction}`;
    this.el.meterValue.classList.toggle("flashing", resolved.flashing !== null);
    this.el.meterValue.title = `${tr("exposureButtonTitle")}. ${tr("meterHelp")}${resolved.flashing ? ` ${this.limitText(resolved)}.` : ""}`;
    this.updateExposureDialog(tr);
    // Aperçu de la luminosité coupé : exposition correcte quels que soient les réglages.
    this.scene.imageProcessingConfiguration.exposure = this.showsBrightness() ? 2 ** offset : 1;
    this.noise.setEnabled(this.showsNoise());
    this.dof?.setEnabled(this.showsDepthOfField());
    this.balance?.setEnabled(this.showsBalance());
    this.updatePreview(tr, colon);

    const body = this.body();
    const mm = (value: number) => (this.lang === "fr" ? String(value).replace(".", ",") : String(value));
    this.el.bodyButton.textContent = body.model;
    this.el.bodyButton.title = `${tr("bodyTitle")}${colon}${body.model}`;
    this.el.bodyDialog.querySelector("#body-title")!.textContent = tr("bodyTitle");
    this.el.bodyDialog.querySelector("#brand-legend")!.textContent = tr("brand");
    this.el.bodyDialog.querySelector("#format-legend")!.textContent = tr("format");
    this.el.bodyDialog.querySelector("#format-ff-label")!.textContent = tr("fullFrame");
    this.el.bodyDialog.querySelector("#format-apsc-label")!.textContent = tr("apsc");
    this.el.bodyDialog.querySelector("#lens-note")!.textContent = tr("lensNote");
    this.el.bodyDialog.querySelector("#body-close")!.textContent = tr("close");
    const sensors = BODIES.filter((b) => b.brand === this.brand)
      .map((b) => `${b.model}${colon}${mm(b.sensorWidthMm)} × ${mm(b.sensorHeightMm)} mm`)
      .join(this.lang === "fr" ? " ; " : "; ");
    this.el.bodyDialog.querySelector("#sensor-note")!.textContent = `${tr("sensor")}${colon}${sensors}`;
    for (const input of this.el.bodyDialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      input.checked = input.value === (input.name === "brand" ? this.brand : this.format);
    }
    this.applyView();
  }

  /** Cadre du viseur et champ de vue, selon la taille du canevas, le capteur et la focale. */
  private applyView(): void {
    const width = this.engine.getRenderWidth();
    const height = this.engine.getRenderHeight();
    if (width === 0 || height === 0) return;
    const body = this.body();
    const frame = frameFor(width, height, body);
    this.frame = frame;
    this.canvasSize = { width, height };
    // Le boîtier ou le cadrage a pu changer : le point reste dans la zone couverte.
    this.focusPoint = this.clampToCoverage(this.focusPoint);
    const fov = cameraFov(width, height, frame, body, FOCAL_LENGTHS[this.focalIndex]);
    this.camera.fovMode = fov.axis === "vertical" ? Camera.FOVMODE_VERTICAL_FIXED : Camera.FOVMODE_HORIZONTAL_FIXED;
    this.camera.fov = fov.fov;
    if (this.enabled) this.applyLoupe(frame, body);
    this.updateGrid();
    // Bruit du viseur : chaque pixel du cadre regroupe effectivePixels / (largeur × hauteur × grossissement²)
    // photosites.
    const resolved = this.resolved();
    const gain = this.showsBrightness() ? 1 : 2 ** resolved.offset;
    this.noise.update(body, isoValue(resolved.settings.iso), frame.width * frame.height * this.loupeZoom ** 2, gain);
    // Profondeur de champ : pixels du canevas par millimètre de capteur, loupe comprise.
    this.dof?.update({
      focalMm: FOCAL_LENGTHS[this.focalIndex],
      aperture: apertureValue(resolved.settings.aperture),
      pixelsPerMm: (Math.max(frame.width, frame.height) / body.sensorWidthMm) * this.loupeZoom,
    });
    // Le canevas peut être dessiné à une autre résolution que sa taille à l'écran : on passe en pourcentages.
    const style = this.el.frame.style;
    style.left = `${(frame.left / width) * 100}%`;
    style.top = `${(frame.top / height) * 100}%`;
    style.width = `${(frame.width / width) * 100}%`;
    style.height = `${(frame.height / height) * 100}%`;
    // Zone couverte par l'autofocus, loupe comprise : une aide de TutoPhoto, le manuel lu ne dit pas si le Z 6
    // l'affiche.
    const coverage = this.coverageOnCanvas();
    const covered = this.el.afCoverage.style;
    if (coverage) {
      covered.left = `${coverage.left * 100}%`;
      covered.top = `${coverage.top * 100}%`;
      covered.width = `${(coverage.right - coverage.left) * 100}%`;
      covered.height = `${(coverage.bottom - coverage.top) * 100}%`;
    }
    for (const listener of this.viewListeners) listener();
  }

  /**
   * Grille de cadrage : lignes placées en pourcentages du cadre, qu'elles suivent quand il change de forme (boîtier,
   * écran vertical). Masquée quand la loupe agrandit l'image : le cadre garde sa place alors que l'image est
   * grossie, et les lignes ne diviseraient plus l'image entière (choix de TutoPhoto, non sourcé).
   */
  private updateGrid(): void {
    const kind = this.preview.grid;
    const grid = this.el.grid;
    // Cadre vertical (téléphone tenu droit) : le grand côté du capteur est vertical, les six cases de « 6 × 4 » aussi.
    const tall = this.frame !== null && this.frame.height > this.frame.width;
    const key = `${kind}:${tall ? "vertical" : "horizontal"}`;
    if (this.drawnGrid !== key) {
      const layout = GRIDS[kind];
      const line = (direction: "vertical" | "horizontal", at: number) => {
        const element = document.createElement("div");
        element.className = `grid-line ${direction}`;
        element.style.setProperty(direction === "vertical" ? "left" : "top", `${at * 100}%`);
        return element;
      };
      // Diagonales : un dessin vectoriel étiré aux dimensions du cadre, traits d'épaisseur constante.
      const diagonals = () => {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "grid-diagonals");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        for (const [x1, x2] of [[0, 100], [100, 0]]) {
          for (const tone of ["shade", "light"]) {
            const stroke = document.createElementNS(SVG_NS, "line");
            stroke.setAttribute("class", `grid-diagonal ${tone}`);
            stroke.setAttribute("x1", String(x1));
            stroke.setAttribute("y1", "0");
            stroke.setAttribute("x2", String(x2));
            stroke.setAttribute("y2", "100");
            svg.append(stroke);
          }
        }
        return svg;
      };
      grid.replaceChildren(
        ...(tall ? layout.short : layout.long).map((at) => line("vertical", at)),
        ...(tall ? layout.long : layout.short).map((at) => line("horizontal", at)),
        ...(layout.diagonals ? [diagonals()] : []),
      );
      grid.dataset.grid = kind;
      this.drawnGrid = key;
    }
    grid.hidden = kind === "none" || this.loupeZoom > 1;
  }

  /** Grossissement de la loupe au cran donné : 100 % = définition du capteur / grand côté du cadre. */
  private zoomAt(level: number, frame: Frame, body: Body): number {
    // 100 % : un photosite par pixel CSS. Le cadre est mesuré en pixels calculés ; à la densité de l'écran (version
    // 0.3.52), un pixel CSS en compte 1 / niveau de mise à l'échelle.
    const cssLong = Math.max(frame.width, frame.height) * this.engine.getHardwareScalingLevel();
    const full = sensorPixels(body).long / cssLong;
    return Math.max(1, LOUPE_LEVELS[level] * full);
  }

  /** Crans successifs : pas de loupe, 50 % (si assez grossi), 100 %, puis retour sans loupe. */
  private cycleLoupe(): void {
    if (!this.frame) this.applyView();
    const frame = this.frame!;
    const body = this.body();
    let next = this.loupeLevel + 1;
    while (next < LOUPE_LEVELS.length - 1 && this.zoomAt(next, frame, body) < LOUPE_MIN_ZOOM) next++;
    this.loupeLevel = next >= LOUPE_LEVELS.length ? -1 : next;
    this.applyView();
  }

  /**
   * Projection du viseur grossie autour du point de mise au point : x' = (x − centre) × grossissement, en
   * coordonnées normalisées, soit m0 et m5 multipliés et m8, m9 décalés. La zone grossie reste dans le cadre.
   */
  private applyLoupe(frame: Frame, body: Body): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    this.camera.unfreezeProjectionMatrix();
    this.loupeZoom = this.loupeLevel < 0 ? 1 : this.zoomAt(this.loupeLevel, frame, body);
    const touch = this.camera.inputs.attached["touch"] as FreeCameraTouchInput | undefined;
    // On tourne plus lentement quand l'image est grossie.
    this.camera.angularSensibility = this.baseAngularSensibility * this.loupeZoom;
    if (touch && this.baseTouchSensibility !== null) touch.touchAngularSensibility = this.baseTouchSensibility * this.loupeZoom;
    const percent = this.loupeLevel < 0 ? 0 : Math.round(LOUPE_LEVELS[this.loupeLevel] * 100);
    this.el.loupeButton.textContent = this.loupeLevel < 0 ? tr("loupe") : `${tr("loupe")} ${percent}${tr("percent")}`;
    this.el.loupeButton.setAttribute("aria-pressed", String(this.loupeLevel >= 0));
    this.el.loupeBadge.hidden = this.loupeLevel < 0;
    this.el.loupeBadge.textContent = `${tr("loupe")} ${percent}${tr("percent")}`;
    if (this.loupeZoom <= 1) {
      this.loupeCenter = { x: 0, y: 0 };
      return;
    }
    const zoom = this.loupeZoom;
    const halfX = frame.width / this.canvasSize.width;
    const halfY = frame.height / this.canvasSize.height;
    const target = this.frameToNdc(this.focusPoint);
    const limit = (half: number) => half - half / zoom;
    const clamp = (value: number, max: number) => Math.min(max, Math.max(-max, value));
    this.loupeCenter = { x: clamp(target.x, limit(halfX)), y: clamp(target.y, limit(halfY)) };
    const m = Array.from(this.camera.getProjectionMatrix(true).asArray());
    m[0] *= zoom;
    m[5] *= zoom;
    m[8] = (m[8] - this.loupeCenter.x) * zoom;
    m[9] = (m[9] - this.loupeCenter.y) * zoom;
    this.camera.freezeProjectionMatrix(Matrix.FromArray(m));
  }

  /** Point du cadre (de 0 à 1, origine en haut à gauche) vers les coordonnées normalisées du canevas. */
  private frameToNdc(point: Point): Point {
    const frame = this.frame!;
    const { width, height } = this.canvasSize;
    return {
      x: ((frame.left + point.x * frame.width) / width) * 2 - 1,
      y: 1 - ((frame.top + point.y * frame.height) / height) * 2,
    };
  }

  private ndcToFrame(ndc: Point): Point {
    const frame = this.frame!;
    const { width, height } = this.canvasSize;
    return {
      x: (((ndc.x + 1) / 2) * width - frame.left) / frame.width,
      y: (((1 - ndc.y) / 2) * height - frame.top) / frame.height,
    };
  }

  /**
   * Bouton et fenêtre « Mise au point », consigne sous le viseur, indicateur dans le viseur (mode, zone,
   * distance, verrou), repère.
   */
  private updateFocus(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const colon = this.lang === "fr" ? " : " : ": ";
    const single = this.focusMode === "single";
    const short = single ? "AF-S" : "AF-C";
    const areaShort = tr(AREA_KEYS[this.areaMode].short);
    this.el.afButton.textContent = `${short} · ${areaShort}`;
    this.el.afButton.title = tr("afTitle");
    this.el.afButton.setAttribute(
      "aria-label",
      `${tr("afTitle")}${colon}${tr(single ? "afSingle" : "afContinuous")}, ${tr(AREA_KEYS[this.areaMode].label)}`,
    );
    const dialog = this.el.afDialog;
    dialog.querySelector("#af-title")!.textContent = tr("afTitle");
    dialog.querySelector("#af-mode-legend")!.textContent = tr("afMode");
    dialog.querySelector("#af-single-label")!.textContent = tr("afSingle");
    dialog.querySelector("#af-continuous-label")!.textContent = tr("afContinuous");
    dialog.querySelector("#af-area-legend")!.textContent = tr("areaMode");
    dialog.querySelector("#af-point-label")!.textContent = tr("areaPoint");
    dialog.querySelector("#af-wide-s-label")!.textContent = tr("areaWideS");
    dialog.querySelector("#af-wide-l-label")!.textContent = tr("areaWideL");
    dialog.querySelector("#af-auto-label")!.textContent = tr("areaAuto");
    dialog.querySelector("#af-detection-legend")!.textContent = tr("detectionLegend");
    dialog.querySelector("#af-det-face-eye-label")!.textContent = tr("detFaceEye");
    dialog.querySelector("#af-det-face-label")!.textContent = tr("detFace");
    dialog.querySelector("#af-det-animal-label")!.textContent = tr("detAnimal");
    dialog.querySelector("#af-det-off-label")!.textContent = tr("detOff");
    dialog.querySelector("#af-note")!.textContent = tr("afHelp");
    dialog.querySelector("#af-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=radio]")) {
      const current = input.name === "focusMode" ? this.focusMode : input.name === "areaMode" ? this.areaMode : this.detection;
      input.checked = input.value === current;
      if (input.name === "detection") input.disabled = this.areaMode !== "auto";
    }
    this.el.focusHint.textContent = tr(single ? "focusHintSingle" : "focusHint");
    const af = this.autofocus;
    this.el.afBadge.hidden = !af;
    if (!af) return;
    const locked = af.locked();
    const meters = af.distance().toFixed(1);
    const distance = `${this.lang === "fr" ? meters.replace(".", ",") : meters} m`;
    // Zone automatique : ce sur quoi l'appareil a fait le point (œil, visage, sujet le plus proche, point touché).
    const target = this.areaMode === "auto" ? af.target() : null;
    const what = target ? `${tr(TARGET_KEYS[target.kind])} · ` : "";
    const text = `${short} · ${areaShort} · ${what}${locked ? `${tr("lockedAt")} ` : ""}${distance}`;
    if (this.el.afBadge.textContent !== text) this.el.afBadge.textContent = text;
    this.el.focusMarker.classList.toggle("locked", locked);
    // Visage ou œil détecté : repère ambre, comme sur le Z 6 ; vert une fois la distance verrouillée en AF-S.
    this.el.focusMarker.classList.toggle("detected", !locked && (target?.kind === "eye" || target?.kind === "face"));
  }

  private showsBrightness(): boolean {
    return this.preview.all && this.preview.brightness;
  }

  private showsNoise(): boolean {
    return this.preview.all && this.preview.noise;
  }

  private showsDepthOfField(): boolean {
    return this.preview.all && this.preview.depthOfField;
  }

  private showsBalance(): boolean {
    return this.preview.all && this.preview.balance;
  }

  /** Textes de la fenêtre de l'aperçu, cases cochées, grille choisie, et rappel dans le viseur de ce qui n'est pas montré. */
  private updatePreview(tr: (key: MessageKey) => string, colon: string): void {
    const dialog = this.el.previewDialog;
    this.el.previewButton.textContent = tr("previewButton");
    this.el.previewButton.title = tr("previewTitle");
    dialog.querySelector("#preview-title")!.textContent = tr("previewTitle");
    dialog.querySelector("#preview-all-label")!.textContent = tr("previewAll");
    dialog.querySelector("#preview-brightness-label")!.textContent = tr("previewBrightness");
    dialog.querySelector("#preview-noise-label")!.textContent = tr("previewNoise");
    dialog.querySelector("#preview-dof-label")!.textContent = tr("previewDepthOfField");
    dialog.querySelector("#preview-balance-label")!.textContent = tr("previewBalance");
    dialog.querySelector("#preview-note")!.textContent = tr("previewNote");
    dialog.querySelector("#preview-grid-legend")!.textContent = tr("gridLegend");
    dialog.querySelector("#preview-grid-none-label")!.textContent = tr("gridNone");
    dialog.querySelector("#preview-grid-thirds-label")!.textContent = tr("gridThirds");
    dialog.querySelector("#preview-grid-sixteen-label")!.textContent = tr("gridSixteen");
    dialog.querySelector("#preview-grid-twentyfour-label")!.textContent = tr("gridTwentyFour");
    dialog.querySelector("#preview-grid-diagonals-label")!.textContent = tr("gridThirdsDiagonals");
    dialog.querySelector("#preview-grid-note")!.textContent = tr("gridNote");
    dialog.querySelector("#preview-close")!.textContent = tr("close");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
      input.checked = this.preview[input.value as PreviewSwitch];
      if (input.value !== "all") input.disabled = !this.preview.all;
    }
    // La grille ne dépend pas de l'interrupteur général : il ne la grise pas, et elle ne compte pas dans le rappel.
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=grid]")) input.checked = input.value === this.preview.grid;
    const hidden: string[] = [];
    if (!this.showsBrightness()) hidden.push(tr("previewBrightnessShort"));
    if (!this.showsNoise()) hidden.push(tr("previewNoiseShort"));
    if (!this.showsDepthOfField()) hidden.push(tr("previewDepthOfFieldShort"));
    if (!this.showsBalance()) hidden.push(tr("previewBalanceShort"));
    this.el.previewBadge.hidden = hidden.length === 0;
    const list = hidden.length > 1 ? `${hidden.slice(0, -1).join(", ")}${tr("and")}${hidden[hidden.length - 1]}` : hidden.join("");
    this.el.previewBadge.textContent = `${tr("previewOff")}${colon}${list}`;
  }

  private restorePreview(): void {
    try {
      const saved = JSON.parse(window.localStorage.getItem(PREVIEW_STORAGE_KEY) ?? "null") as (Partial<Record<PreviewSwitch, unknown>> & { grid?: unknown }) | null;
      if (saved) {
        for (const key of PREVIEW_SWITCHES) {
          const value = saved[key];
          if (typeof value === "boolean") this.preview[key] = value;
        }
        // Une valeur inconnue vaut « none », la valeur par défaut.
        if (isGridKind(saved.grid)) this.preview.grid = saved.grid;
      }
    } catch {
      // Stockage indisponible : aperçu complet.
    }
  }

  private savePreview(): void {
    try {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(this.preview));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }

  private restoreBody(): void {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as {
        brand?: string;
        format?: string;
        focusMode?: string;
        areaMode?: string;
        detection?: string;
        release?: string;
        clRate?: number;
        timerDelay?: number;
        exposureMode?: string;
        compensation?: number;
        autoIso?: boolean;
        maxIso?: number;
        minShutter?: number;
      } | null;
      if (saved && BODIES.some((b) => b.brand === saved.brand && b.format === saved.format)) {
        this.brand = saved.brand as Brand;
        this.format = saved.format as Format;
      }
      if (saved?.focusMode === "single" || saved?.focusMode === "continuous") this.focusMode = saved.focusMode;
      if (saved?.areaMode && Object.prototype.hasOwnProperty.call(AREA_KEYS, saved.areaMode)) this.areaMode = saved.areaMode as AreaMode;
      if (DETECTIONS.includes(saved?.detection as Detection)) this.detection = saved!.detection as Detection;
      if (["single", "cl", "ch", "chx", "timer"].includes(saved?.release ?? "")) this.releaseKind = saved!.release as ReleaseKind;
      if ((CL_RATES as readonly number[]).includes(saved?.clRate ?? 0)) this.clRate = saved!.clRate!;
      if ((TIMER_DELAYS as readonly number[]).includes(saved?.timerDelay ?? 0)) this.timerDelay = saved!.timerDelay!;
      // La correction d'exposition ne se remet pas à zéro à l'extinction du Z 6 [nikon-z6-exposure-compensation].
      if (EXPOSURE_MODES.includes(saved?.exposureMode as ExposureMode)) this.exposureMode = saved!.exposureMode as ExposureMode;
      const isIndex = (value: unknown, min: number, max: number) => Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
      if (isIndex(saved?.compensation, -COMPENSATION_RANGE, COMPENSATION_RANGE)) this.compensation = saved!.compensation!;
      if (typeof saved?.autoIso === "boolean") this.autoIso = saved.autoIso;
      if (isIndex(saved?.maxIso, MAX_ISO_FIRST, SCALES.iso - 1)) this.maxIso = saved!.maxIso!;
      if (isIndex(saved?.minShutter, 0, SCALES.shutter - 1)) this.minShutter = saved!.minShutter!;
    } catch {
      // Stockage indisponible : boîtier par défaut.
    }
  }

  private saveBody(): void {
    try {
      const saved = {
        brand: this.brand,
        format: this.format,
        focusMode: this.focusMode,
        areaMode: this.areaMode,
        detection: this.detection,
        release: this.releaseKind,
        clRate: this.clRate,
        timerDelay: this.timerDelay,
        exposureMode: this.exposureMode,
        compensation: this.compensation,
        autoIso: this.autoIso,
        maxIso: this.maxIso,
        minShutter: this.minShutter,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
  }
}
