import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene } from "./scene";
import { loadManifest, renderCredits } from "./credits";
import { CameraPanel } from "./ui/cameraPanel";
import { Shutter } from "./ui/shutter";
import { DOME_RADIUS, EYE_HEIGHT } from "./scene";
import { ViewfinderNoise } from "./camera/noise";
import { ViewfinderDepthOfField } from "./camera/viewfinderDof";
import { Autofocus } from "./camera/autofocus";
import { BalanceIndicator } from "./ui/balance";
import { TopView } from "./ui/topView";
import { ChallengePicker } from "./ui/challenges";
import { FicheDialog } from "./ui/ficheDialog";
import { initialLang, rememberLang, t, type Lang } from "./i18n";

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Élément #${id} absent de la page`);
  return found as T;
}

const canvas = element<HTMLCanvasElement>("scene");
const langButton = element<HTMLButtonElement>("lang");
const creditsButton = element<HTMLButtonElement>("credits");
const creditsDialog = element<HTMLDialogElement>("credits-dialog");
const creditsList = element<HTMLUListElement>("credits-list");
const status = element<HTMLParagraphElement>("status");
const diagnostic = element<HTMLParagraphElement>("diagnostic");
// Le simulateur est sous simulateur/ depuis la version 0.3.46 : la scène est un dossier plus haut.
const manifest = loadManifest("../scenes/parc/scene.json");
let lang: Lang = initialLang();

/** Densité maximale de calcul du viseur, en pixels calculés par pixel CSS (version 0.3.53, choix de Julien). */
const MAX_DEVICE_RATIO = 2;

// Progression du chargement (version 0.3.51). La scène pèse 34 Mio, et un message seul ne permettait pas de
// distinguer un réseau lent, un fichier bloqué ou une scène reçue mais pas prête (chargement sans fin signalé par
// Julien le 11 novembre 2026). Un fichier compte comme reçu quand le navigateur en a fini le chargement, d'après
// la Resource Timing API (performance.getEntriesByType("resource")) ; sa taille est celle du manifeste.
let sceneFiles: { path: string; bytes: number }[] = [];
const MISSING_AFTER_S = 60;
const MIB = 2 ** 20;

function loadingProgress(): string {
  const seconds = Math.round(performance.now() / 1000);
  if (sceneFiles.length === 0) return ` · ${seconds} s`;
  const loaded = new Set(
    (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).map((e) => {
      try {
        return decodeURIComponent(new URL(e.name).pathname);
      } catch {
        return e.name;
      }
    }),
  );
  const done = (path: string) => [...loaded].some((name) => name.endsWith(`/scenes/parc/${path}`));
  const missing = sceneFiles.filter((f) => !done(f.path));
  const total = sceneFiles.reduce((sum, f) => sum + f.bytes, 0);
  const received = total - missing.reduce((sum, f) => sum + f.bytes, 0);
  const fill = (text: string) => text.replace("{s}", String(seconds));
  if (missing.length === 0) return ` ${fill(t(lang, "loadingPreparing"))}`;
  let text = ` ${fill(t(lang, "loadingProgress")).replace("{done}", String(Math.round(received / MIB))).replace("{total}", String(Math.round(total / MIB)))}`;
  if (seconds >= MISSING_AFTER_S) {
    const names = missing.slice(0, 3).map((f) => f.path.split("/").pop());
    text += ` · ${t(lang, "loadingMissing").replace("{files}", names.join(", ") + (missing.length > 3 ? "…" : ""))}`;
  }
  return text;
}
// Les textes de licence du manifeste (license.txt) ne sont pas chargés par la scène : comptés, ils restaient « en
// attente » pour toujours, et « préparation » ne s'affichait jamais (corrigé en version 0.3.55 ; constaté dans
// Chromium : après le chargement, ces fichiers sont les seuls absents de la Resource Timing API). Même règle que le
// pré-téléchargement de l'accueil (app/scripts/build-pages.mjs).
manifest
  .then((m) => (sceneFiles = m.assets.flatMap((asset) => asset.files ?? []).filter((f) => !f.path.endsWith(".txt"))))
  .catch(() => undefined);
// Mise à jour de la progression chaque seconde, tant que la scène se charge.
const loadingTimer = window.setInterval(() => {
  if (statusKey !== "loading") window.clearInterval(loadingTimer);
  else status.textContent = t(lang, "loading") + loadingProgress();
}, 1000);
let statusKey: "loading" | "loadError" | null = "loading";
let cameraPanel: CameraPanel | null = null;
let shutter: Shutter | null = null;
let balance: BalanceIndicator | null = null;
let topView: TopView | null = null;
let challenges: ChallengePicker | null = null;
let ficheDialog: FicheDialog | null = null;

// Problèmes affichés à l'écran, pour diagnostiquer sur un téléphone sans console : erreurs JavaScript,
// shader du bruit qui ne compile pas, scène affichée avant d'être prête.
type ProblemKey = "problemError" | "problemNoise" | "problemDepthOfField" | "problemLate";
const problems: { key: ProblemKey; detail: string }[] = [];

function report(key: ProblemKey, detail: string): void {
  if (problems.length >= 4 || problems.some((p) => p.key === key && p.detail === detail)) return;
  problems.push({ key, detail });
  renderProblems();
}

function renderProblems(): void {
  const colon = lang === "fr" ? " : " : ": ";
  diagnostic.textContent = problems.map((p) => `${t(lang, p.key)}${colon}${p.detail}`).join(" · ");
  diagnostic.hidden = problems.length === 0;
}

window.addEventListener("error", (event) => report("problemError", event.message || String(event.error)));
window.addEventListener("unhandledrejection", (event) => report("problemError", String(event.reason)));

function applyLang(): void {
  document.documentElement.lang = lang;
  element("subtitle").textContent = t(lang, "subtitle");
  element("licences").textContent = t(lang, "licences");
  element("home").textContent = t(lang, "home");
  creditsButton.textContent = t(lang, "credits");
  element("credits-title").textContent = t(lang, "creditsTitle");
  element("credits-intro").textContent = t(lang, "creditsIntro");
  element("credits-close").textContent = t(lang, "close");
  element("no-webgl").textContent = t(lang, "noWebgl");
  canvas.setAttribute("aria-label", t(lang, "sceneLabel"));
  langButton.textContent = t(lang, "switchLang");
  status.textContent = statusKey ? t(lang, statusKey) + (statusKey === "loading" ? loadingProgress() : "") : "";
  status.hidden = statusKey === null;
  manifest.then((m) => renderCredits(creditsList, m, lang)).catch(() => undefined);
  cameraPanel?.setLang(lang);
  shutter?.setLang(lang);
  balance?.setLang(lang);
  topView?.setLang(lang);
  challenges?.setLang(lang);
  ficheDialog?.setLang(lang);
  renderProblems();
}

langButton.addEventListener("click", () => {
  lang = lang === "fr" ? "en" : "fr";
  rememberLang(lang);
  applyLang();
});
creditsButton.addEventListener("click", () => creditsDialog.showModal());
// Fiches ouvertes par-dessus le simulateur (bulletin, fenêtre « Défis ») : indépendant de la scène 3D.
ficheDialog = new FicheDialog(
  {
    dialog: element<HTMLDialogElement>("fiche-dialog"),
    body: element("fiche-body"),
    page: element<HTMLAnchorElement>("fiche-page"),
    close: element<HTMLButtonElement>("fiche-close"),
  },
  lang,
);
applyLang();

if (!Engine.isSupported()) {
  canvas.hidden = true;
  element("camera-panel").hidden = true;
  statusKey = null;
  element("no-webgl").hidden = false;
  applyLang();
} else {
  // Viseur calculé à la densité de l'écran (version 0.3.52, demande de Julien du 11 novembre 2026 : la scène
  // paraissait pixelisée sur son téléphone). Par défaut, Babylon.js calcule l'image à la taille en pixels CSS
  // (adaptToDeviceRatio faux : niveau de mise à l'échelle 1) et le navigateur l'agrandit à la densité de l'écran,
  // soit environ 2,6 pixels d'écran par pixel calculé sur un téléphone. Densité complète en version 0.3.52 : plus net,
  // mais saccadé sur le téléphone de Julien ; densité plafonnée à 2 en version 0.3.53, à sa demande (version isolée,
  // à annuler si elle ne convient pas). Babylon.js applique le plafond à la création du moteur (niveau de mise à
  // l'échelle 1 / min(plafond, densité)) ; si la densité change ensuite (zoom du navigateur), il multiplie ce niveau
  // par le rapport des densités, sans réappliquer le plafond.
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, limitDeviceRatio: MAX_DEVICE_RATIO }, true);
  const { scene, camera, ready, time, subjects, eye } = createScene(engine, canvas);
  // Serveur de développement seulement (absent du site construit) : accès pour les mesures sur la scène.
  if (import.meta.env.DEV) {
    void import("@babylonjs/core/Culling/ray");
    Object.assign(window, { __tutophoto: { scene, camera, time } });
  }
  const noise = new ViewfinderNoise(scene, camera, (message) => report("problemNoise", message));
  cameraPanel = new CameraPanel(
    engine,
    scene,
    camera,
    {
      panel: element("camera-panel"),
      frame: element("frame"),
      grid: element("frame-grid"),
      meterNeedle: element("meter-needle"),
      meterValue: element("meter-value"),
      bodyButton: element<HTMLButtonElement>("body-button"),
      bodyDialog: element<HTMLDialogElement>("body-dialog"),
      previewButton: element<HTMLButtonElement>("preview-button"),
      previewDialog: element<HTMLDialogElement>("preview-dialog"),
      previewBadge: element("preview-badge"),
      loupeButton: element<HTMLButtonElement>("loupe-button"),
      loupeBadge: element("loupe-badge"),
      afButton: element<HTMLButtonElement>("af-button"),
      afDialog: element<HTMLDialogElement>("af-dialog"),
      releaseButton: element<HTMLButtonElement>("release-button"),
      releaseDialog: element<HTMLDialogElement>("release-dialog"),
      exposureDialog: element<HTMLDialogElement>("exposure-dialog"),
      afBadge: element("af-badge"),
      focusMarker: element("focus-marker"),
      afCoverage: element("af-coverage"),
      focusHint: element("focus-hint"),
    },
    lang,
    noise,
  );
  const panel = cameraPanel;
  const ground = { eyeHeight: EYE_HEIGHT, domeRadius: DOME_RADIUS };
  const autofocus = new Autofocus(scene, camera, ground, () => panel.focusArea(), subjects);
  panel.attachAutofocus(autofocus);
  const dof = new ViewfinderDepthOfField(
    scene,
    camera,
    ground,
    autofocus,
    () => noise.moveToEnd(),
    (message) => report("problemDepthOfField", message),
  );
  panel.attachDepthOfField(dof);
  const render = () => scene.render();
  challenges = new ChallengePicker(
    { button: element<HTMLButtonElement>("challenge-button"), dialog: element<HTMLDialogElement>("challenge-dialog") },
    lang,
  );
  shutter = new Shutter(
    engine,
    scene,
    camera,
    time,
    ground,
    cameraPanel,
    {
      canvas,
      frame: element("frame"),
      marker: element("focus-marker"),
      button: element<HTMLButtonElement>("shutter-button"),
      progress: element("progress"),
      progressLabel: element("progress-label"),
      progressBar: element("progress-bar"),
      review: element("review"),
      reviewImage: element<HTMLImageElement>("review-image"),
      reviewCaption: element("review-caption"),
      reviewHint: element("review-hint"),
      reviewBack: element<HTMLButtonElement>("review-back"),
      reviewWhole: element<HTMLButtonElement>("review-whole"),
      reviewSave: element<HTMLAnchorElement>("review-save"),
      reviewSeries: element("review-series"),
      reviewPrev: element<HTMLButtonElement>("review-prev"),
      reviewNext: element<HTMLButtonElement>("review-next"),
      reviewCount: element("review-count"),
      reviewBulletin: element("review-bulletin"),
    },
    () => engine.runRenderLoop(render),
    lang,
    noise,
    dof,
    autofocus,
    subjects,
    () => challenges?.current() ?? null,
    () => balance?.lastNoise() ?? null,
  );
  balance = new BalanceIndicator(
    engine,
    scene,
    camera,
    time,
    autofocus,
    panel,
    {
      root: element("balance"),
      toggle: element<HTMLButtonElement>("balance-toggle"),
      title: element("balance-title"),
      aperture: document.getElementById("balance-aperture") as unknown as SVGElement,
      shutter: document.getElementById("balance-shutter") as unknown as SVGElement,
      iso: document.getElementById("balance-iso") as unknown as SVGElement,
      point: document.getElementById("balance-point") as unknown as SVGElement,
      dof: element("balance-dof"),
      motion: element("balance-motion"),
      noise: element("balance-noise"),
      note: element("balance-note"),
    },
    lang,
  );
  panel.attachBalance(balance);
  topView = new TopView(
    camera,
    time,
    eye,
    autofocus,
    panel,
    {
      root: element("top-view"),
      toggle: element<HTMLButtonElement>("top-view-toggle"),
      reset: element<HTMLButtonElement>("top-view-reset"),
      map: document.getElementById("top-view-map") as unknown as SVGSVGElement,
      note: element("top-view-note"),
    },
    lang,
  );
  ready
    .then((waiting) => {
      statusKey = null;
      if (waiting.length > 0) report("problemLate", waiting.slice(0, 5).join(", "));
    })
    .catch((error: unknown) => {
      console.error(error);
      statusKey = "loadError";
    })
    .finally(applyLang);
  engine.runRenderLoop(render);
  // La taille du canevas change aussi sans que la fenêtre change : quand le panneau du boîtier passe sur
  // plusieurs lignes, par exemple après l'affichage des textes. Sans redimensionnement du moteur, le rendu
  // gardait l'ancienne taille, étiré à l'affichage, et le cadre perdait les proportions du capteur.
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => engine.resize()).observe(canvas);
  window.addEventListener("resize", () => engine.resize());
}
