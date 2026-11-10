// Vue de dessus (NET-01, « Zone nette visualisée en vue de dessus » ; NET-06, « Sujet et appareil déplaçables »),
// proposée dans le bilan du 10 novembre 2026 et lancée par Julien le même soir.
// - Zone nette : entre deux plans perpendiculaires à l'axe de visée, aux limites proche et lointaine de
//   camera/sharpZone.ts. Vue de dessus : l'inclinaison de l'appareil vers le haut ou le bas est négligée.
// - Champ : angle horizontal du cadre, 2 × atan(côté / (2 × focale)), avec le côté horizontal du capteur.
// - Personnages et objets aux positions de la scène ; le promeneur et le chien à l'instant présent. Sont marqués
//   nets ceux dont la distance à l'appareil, le long de l'axe, est dans la zone nette.
// - Déplacement (NET-06) : toucher la carte place l'appareil, dans une zone choisie pour TutoPhoto, de 12 m sur
//   11 m : devant les personnages (jusqu'à 5 m de l'appareil de départ vers eux, 1,5 m avant le groupe) et sur le
//   sol où les ombres sont calculées. L'orientation de l'appareil ne change pas.
// Non simulé : déplacer les personnages ; le fond photo à 360° est pris d'un seul point, et ce qu'il montre
// (arbres, bâtiments) ne change pas de perspective quand l'appareil se déplace.

import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import type { Autofocus } from "../camera/autofocus";
import type { SceneTimeControl } from "../camera/photo";
import { blurLimitMm, sharpZone } from "../camera/sharpZone";
import { LANDMARKS, type EyeControl } from "../scene";
import { t, type Lang, type MessageKey } from "../i18n";
import type { CameraPanel } from "./cameraPanel";

/** Zone où l'appareil peut aller, en mètres (x vers la droite, z vers le groupe). */
export const MOVE_AREA = { minX: -6, maxX: 6, minZ: -6, maxZ: 5 } as const;
/** Étendue de la carte, en mètres. */
const MAP = { minX: -8, maxX: 8, minZ: -7, maxZ: 15 } as const;
/** Longueur des côtés du champ dessinés, en mètres (au-delà de la carte). */
const RAY = 30;
const REFRESH_MS = 250;
const NS = "http://www.w3.org/2000/svg";

interface TopViewElements {
  root: HTMLElement;
  toggle: HTMLButtonElement;
  reset: HTMLButtonElement;
  map: SVGSVGElement;
  note: HTMLElement;
}

export class TopView {
  private lang: Lang;
  private expanded: boolean;
  private readonly layers: Record<"area" | "zone" | "field" | "focus" | "things" | "camera", SVGGElement>;

  constructor(
    private readonly camera: UniversalCamera,
    private readonly time: SceneTimeControl,
    private readonly eye: EyeControl,
    private readonly autofocus: Autofocus,
    private readonly panel: CameraPanel,
    private readonly el: TopViewElements,
    lang: Lang,
  ) {
    this.lang = lang;
    // Replié sur petit écran, comme l'indicateur d'équilibre.
    this.expanded = window.innerWidth > 700;
    el.map.setAttribute("viewBox", `${MAP.minX} ${-MAP.maxZ} ${MAP.maxX - MAP.minX} ${MAP.maxZ - MAP.minZ}`);
    const group = (name: string) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", `top-${name}`);
      el.map.append(g);
      return g;
    };
    this.layers = { area: group("area"), zone: group("zone"), field: group("field"), focus: group("focus"), things: group("things"), camera: group("camera") };
    const area = document.createElementNS(NS, "rect");
    area.setAttribute("x", String(MOVE_AREA.minX));
    area.setAttribute("y", String(-MOVE_AREA.maxZ));
    area.setAttribute("width", String(MOVE_AREA.maxX - MOVE_AREA.minX));
    area.setAttribute("height", String(MOVE_AREA.maxZ - MOVE_AREA.minZ));
    this.layers.area.append(area);
    el.toggle.addEventListener("click", () => {
      this.expanded = !this.expanded;
      this.draw();
    });
    el.map.addEventListener("click", (e) => this.moveTo(e.clientX, e.clientY));
    el.reset.addEventListener("click", () => {
      if (!this.panel.isEnabled()) return;
      this.eye.set(0, 0);
      this.draw();
    });
    setInterval(() => this.draw(), REFRESH_MS);
    this.setLang(lang);
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.draw();
  }

  /** Toucher la carte : l'appareil va au point touché, ramené dans la zone permise. */
  private moveTo(clientX: number, clientY: number): void {
    // Pas pendant le calcul d'une photo.
    if (!this.panel.isEnabled()) return;
    const matrix = this.el.map.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    this.eye.set(clamp(point.x, MOVE_AREA.minX, MOVE_AREA.maxX), clamp(-point.y, MOVE_AREA.minZ, MOVE_AREA.maxZ));
    this.draw();
  }

  private draw(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const el = this.el;
    el.root.classList.toggle("collapsed", !this.expanded);
    el.toggle.setAttribute("aria-expanded", String(this.expanded));
    el.toggle.textContent = tr("topViewTitle");
    el.map.setAttribute("aria-label", tr("topViewLabel"));
    el.reset.textContent = tr("topViewReset");
    el.reset.hidden = !this.expanded;
    if (!this.expanded) return;

    const s = this.panel.current();
    const { x: cx, z: cz } = this.eye.get();
    const yaw = this.camera.rotation.y;
    const forward = { x: Math.sin(yaw), z: Math.cos(yaw) };
    const side = { x: forward.z, z: -forward.x };
    const sensorSide = s.frame.portrait ? s.body.sensorHeightMm : s.body.sensorWidthMm;
    const halfTan = sensorSide / (2 * s.focalMm);
    const distance = this.autofocus.distance();
    const zone = sharpZone(s.focalMm, s.aperture, distance, blurLimitMm(s.body.sensorWidthMm, s.body.sensorHeightMm));
    // Point à la profondeur d le long de l'axe, décalé de w sur le côté ; en coordonnées de la carte (y = −z).
    const at = (d: number, w: number) => `${cx + forward.x * d + side.x * w},${-(cz + forward.z * d + side.z * w)}`;
    const polygon = (layer: SVGGElement, points: string[], className = "") => {
      const p = document.createElementNS(NS, "polygon");
      p.setAttribute("points", points.join(" "));
      if (className) p.setAttribute("class", className);
      layer.replaceChildren(p);
    };
    const far = Math.min(zone.far, RAY);
    polygon(this.layers.zone, [at(zone.near, -zone.near * halfTan), at(zone.near, zone.near * halfTan), at(far, far * halfTan), at(far, -far * halfTan)]);
    polygon(this.layers.field, [at(RAY, -RAY * halfTan), at(0, 0), at(RAY, RAY * halfTan)]);
    const focus = document.createElementNS(NS, "line");
    const [x1, y1] = at(distance, -distance * halfTan).split(",");
    const [x2, y2] = at(distance, distance * halfTan).split(",");
    focus.setAttribute("x1", x1);
    focus.setAttribute("y1", y1);
    focus.setAttribute("x2", x2);
    focus.setAttribute("y2", y2);
    this.layers.focus.replaceChildren(focus);
    polygon(this.layers.camera, [at(0.6, 0), at(-0.3, -0.35), at(-0.3, 0.35)]);

    // Personnages, objets, promeneur et chien : nets si leur profondeur est dans la zone nette.
    const depth = (x: number, z: number) => (x - cx) * forward.x + (z - cz) * forward.z;
    const things: { id: string; kind: string; x: number; z: number }[] = [
      ...LANDMARKS,
      ...this.time.movers().map((m) => ({ id: m.id, kind: m.id === "jim" ? "animal" : "person", x: m.position.x, z: m.position.z })),
    ];
    const shapes = things.map((thing) => {
      const d = depth(thing.x, thing.z);
      const sharp = d >= zone.near && d <= zone.far;
      const shape = document.createElementNS(NS, thing.id === "bench" ? "rect" : "circle");
      if (thing.id === "bench") {
        shape.setAttribute("x", String(thing.x - 0.8));
        shape.setAttribute("y", String(-thing.z - 0.25));
        shape.setAttribute("width", "1.6");
        shape.setAttribute("height", "0.5");
      } else {
        shape.setAttribute("cx", String(thing.x));
        shape.setAttribute("cy", String(-thing.z));
        shape.setAttribute("r", thing.kind === "object" ? "0.3" : "0.35");
      }
      shape.setAttribute("class", `${thing.kind}${sharp ? " sharp" : ""}`);
      return shape;
    });
    this.layers.things.replaceChildren(...shapes);

    const decimal = (value: number) => (this.lang === "fr" ? value.toFixed(1).replace(".", ",") : value.toFixed(1));
    const farText = Number.isFinite(zone.far) ? `${decimal(zone.far)} m` : "∞";
    el.note.textContent = `${tr("topViewZone")} ${decimal(zone.near)} m – ${farText}. ${tr("topViewMove")}`;
  }
}
