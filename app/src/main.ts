import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene } from "./scene";
import { loadManifest, renderCredits } from "./credits";
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
  statusKey = null;
  element("no-webgl").hidden = false;
  applyLang();
} else {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true });
  const { scene, ready } = createScene(engine, canvas);
  ready
    .then(() => {
      statusKey = null;
    })
    .catch((error: unknown) => {
      console.error(error);
      statusKey = "loadError";
    })
    .finally(applyLang);
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}
