import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene } from "./scene";
import { initialLang, rememberLang, t, type Lang } from "./i18n";

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Élément #${id} absent de la page`);
  return found as T;
}

const canvas = element<HTMLCanvasElement>("scene");
const langButton = element<HTMLButtonElement>("lang");
let lang: Lang = initialLang();

function applyLang(): void {
  document.documentElement.lang = lang;
  element("subtitle").textContent = t(lang, "subtitle");
  element("licences").textContent = t(lang, "licences");
  element("no-webgl").textContent = t(lang, "noWebgl");
  canvas.setAttribute("aria-label", t(lang, "sceneLabel"));
  langButton.textContent = t(lang, "switchLang");
}

langButton.addEventListener("click", () => {
  lang = lang === "fr" ? "en" : "fr";
  rememberLang(lang);
  applyLang();
});
applyLang();

if (!Engine.isSupported()) {
  canvas.hidden = true;
  element("no-webgl").hidden = false;
} else {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true });
  const scene = createScene(engine, canvas);
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
}
