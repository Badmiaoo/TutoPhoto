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
const manifest = loadManifest("scenes/parc/scene.json");
let lang: Lang = initialLang();
let statusKey: "loading" | "loadError" | null = "loading";
let cameraPanel: CameraPanel | null = null;
let shutter: Shutter | null = null;
let balance: BalanceIndicator | null = null;

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
  creditsButton.textContent = t(lang, "credits");
  element("credits-title").textContent = t(lang, "creditsTitle");
  element("credits-intro").textContent = t(lang, "creditsIntro");
  element("credits-close").textContent = t(lang, "close");
  element("no-webgl").textContent = t(lang, "noWebgl");
  canvas.setAttribute("aria-label", t(lang, "sceneLabel"));
  langButton.textContent = t(lang, "switchLang");
  status.textContent = statusKey ? t(lang, statusKey) : "";
  status.hidden = statusKey === null;
  manifest.then((m) => renderCredits(creditsList, m, lang)).catch(() => undefined);
  cameraPanel?.setLang(lang);
  shutter?.setLang(lang);
  balance?.setLang(lang);
  renderProblems();
}

langButton.addEventListener("click", () => {
  lang = lang === "fr" ? "en" : "fr";
  rememberLang(lang);
  applyLang();
});
creditsButton.addEventListener("click", () => creditsDialog.showModal());
applyLang();

if (!Engine.isSupported()) {
  canvas.hidden = true;
  element("camera-panel").hidden = true;
  statusKey = null;
  element("no-webgl").hidden = false;
  applyLang();
} else {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true });
  const { scene, camera, ready, time, subjects } = createScene(engine, canvas);
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
    },
    () => engine.runRenderLoop(render),
    lang,
    noise,
    dof,
    autofocus,
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
