import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene } from "./scene";
import { loadManifest, renderCredits } from "./credits";
import { CameraPanel } from "./ui/cameraPanel";
import { Shutter } from "./ui/shutter";
import { DOME_RADIUS, EYE_HEIGHT } from "./scene";
import { ViewfinderNoise } from "./camera/noise";
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

// Problèmes affichés à l'écran, pour diagnostiquer sur un téléphone sans console : erreurs JavaScript,
// shader du bruit qui ne compile pas, scène affichée avant d'être prête.
type ProblemKey = "problemError" | "problemNoise" | "problemLate";
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
  const { scene, camera, ready, time } = createScene(engine, canvas);
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
    },
    lang,
    noise,
  );
  const render = () => scene.render();
  shutter = new Shutter(
    engine,
    scene,
    camera,
    time,
    { eyeHeight: EYE_HEIGHT, domeRadius: DOME_RADIUS },
    cameraPanel,
    {
      canvas,
      frame: element("frame"),
      marker: element("focus-marker"),
      hint: element("focus-hint"),
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
    },
    () => engine.runRenderLoop(render),
    lang,
    noise,
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
  window.addEventListener("resize", () => engine.resize());
}
