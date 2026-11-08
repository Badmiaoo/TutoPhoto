import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene } from "./scene";
import { loadManifest, renderCredits } from "./credits";
import { CameraPanel } from "./ui/cameraPanel";
import { Shutter } from "./ui/shutter";
import { DOME_RADIUS, EYE_HEIGHT } from "./scene";
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
const manifest = loadManifest("scenes/parc/scene.json");
let lang: Lang = initialLang();
let statusKey: "loading" | "loadError" | null = "loading";
let cameraPanel: CameraPanel | null = null;
let shutter: Shutter | null = null;

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
    },
    lang,
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
      reviewBack: element<HTMLButtonElement>("review-back"),
      reviewSave: element<HTMLAnchorElement>("review-save"),
    },
    () => engine.runRenderLoop(render),
    lang,
  );
  ready
    .then(() => {
      statusKey = null;
    })
    .catch((error: unknown) => {
      console.error(error);
      statusKey = "loadError";
    })
    .finally(applyLang);
  engine.runRenderLoop(render);
  window.addEventListener("resize", () => engine.resize());
}
