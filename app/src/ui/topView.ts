// Vue de dessus (NET-01, « Zone nette visualisée en vue de dessus » ; NET-06, « Sujet et appareil déplaçables »),
// proposée dans le bilan du 10 novembre 2026 et lancée par Julien le même soir.
// - Zone nette : entre deux plans perpendiculaires à l'axe de visée, aux limites proche et lointaine de
//   camera/optics.ts (sharpZone), profondeurs le long de cet axe. Appareil incliné vers le haut ou le bas de l'angle i :
//   limites et plan de mise au point sont dessinés à la distance horizontale où un point à la hauteur de l'œil
//   de l'appareil a cette profondeur, profondeur / cos(i) (version 0.3.69, relecture du Sujet 9), pour que la bande
//   et le jugement des sujets (ci-dessous) concordent. Pour un point plus haut ou plus bas de h, l'écart reste
//   h × tan(i) : environ 0,3 m à 17° d'inclinaison pour le banc et la poubelle (jugés à 0,5 m du sol) et pour le
//   chien (yeux vers 0,67 m) ; quelques centimètres pour les yeux des personnages (1,51 m à 1,71 m).
// - Champ : angle horizontal du cadre, 2 × atan(côté / (2 × focale)), avec le côté horizontal du capteur
//   (camera/optics.ts, halfFieldTangent), le champ d'une mise au point à l'infini (fieldOfView).
// - Personnages et objets dessinés à leur position au sol ; le promeneur et le chien à l'instant présent. Sont
//   marqués nets ceux que le bulletin de la photo jugerait nets (camera/bulletin.ts, measureThing ; constat FMA-12,
//   version 0.3.69) : profondeur le long de l'axe de visée de l'appareil (z de la caméra, inclinaison comprise) du
//   point jugé le plus proche, dans la zone nette. Points jugés : les yeux des personnages et du chien, un point à
//   0,5 m du sol pour le banc et la poubelle. Le cercle commun à Fabienne et Percy est vert si les deux sont nets.
//   Les yeux sont jusqu'à 20 cm plus près de l'appareil que la position au sol : un cercle peut rester gris
//   alors que son centre est dans la bande de la zone nette.
// - Déplacement (NET-06) : toucher la carte place l'appareil, dans une zone choisie pour TutoPhoto, de 12 m sur
//   11 m : devant les personnages (jusqu'à 5 m de l'appareil de départ vers eux, 1,5 m avant le groupe) et sur le
//   sol où les ombres sont calculées. L'orientation de l'appareil ne change pas.
// Non simulé : déplacer les personnages ; le fond photo à 360° est pris d'un seul point, et ce qu'il montre
// (arbres, bâtiments) ne change pas de perspective quand l'appareil se déplace.

import type { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import type { Autofocus } from "../camera/autofocus";
import type { SceneTimeControl } from "../camera/photo";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { measureThing } from "../camera/bulletin";
import type { FaceSubject } from "../camera/faces";
import { blurLimitMm, halfFieldTangent, sharpZone } from "../camera/optics";
import { judgedPoints, LANDMARKS, type EyeControl } from "../scene";
import { t } from "../texts";
import type { CameraPanel } from "./cameraPanel";

/** Zone où l'appareil peut aller, en mètres (x vers la droite, z vers le groupe). */
export const MOVE_AREA = { minX: -6, maxX: 6, minZ: -6, maxZ: 5 } as const;
/** Étendue de la carte, en mètres. */
const MAP = { minX: -8, maxX: 8, minZ: -7, maxZ: 15 } as const;
/** Longueur des côtés du champ dessinés, en mètres (au-delà de la carte). */
const RAY = 30;
const REFRESH_MS = 250;
const NS = "http://www.w3.org/2000/svg";
/** Repère commun à plusieurs personnages : ceux qu'il faut juger (vert si tous sont nets). */
const JUDGED: Record<string, string[]> = { "fabienne-percy": ["fabienne", "percy"] };

interface TopViewElements {
  root: HTMLElement;
  toggle: HTMLButtonElement;
  reset: HTMLButtonElement;
  map: SVGSVGElement;
  note: HTMLElement;
}

export class TopView {
  private expanded: boolean;
  private readonly layers: Record<"area" | "zone" | "field" | "focus" | "things" | "camera", SVGGElement>;

  constructor(
    private readonly camera: UniversalCamera,
    private readonly time: SceneTimeControl,
    private readonly eye: EyeControl,
    private readonly autofocus: Autofocus,
    private readonly panel: CameraPanel,
    private readonly subjects: readonly FaceSubject[],
    private readonly el: TopViewElements,
  ) {
    // Replié sur petit écran, comme l'indicateur d'équilibre : fenêtre de 700 px de large ou moins, ou de 500 px de haut
    // ou moins, comme un téléphone tenu à l'horizontale. Déplié dans un tel viseur, il en couvrait la droite, son bouton
    // hors de la page (constat INT-03 de l'audit : iPhone 14 émulé, 750 × 340 px ; version 0.4.10).
    this.expanded = window.matchMedia("(min-width: 701px) and (min-height: 501px)").matches;
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
      this.drawAfterMove();
    });
    setInterval(() => this.draw(), REFRESH_MS);
    this.applyTexts();
  }

  applyTexts(): void {
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
    this.drawAfterMove();
  }

  /**
   * Dessin après un déplacement : la caméra ne prend la nouvelle position qu'avant l'image suivante (scene.ts) ;
   * dessiner tout de suite jugerait les sujets avec l'ancienne vue (relecture du Sujet 9).
   */
  private drawAfterMove(): void {
    this.camera.getScene().onAfterRenderObservable.addOnce(() => this.draw());
  }

  private draw(): void {
    const tr = t;
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
    const halfTan = halfFieldTangent(sensorSide, s.focalMm);
    const distance = this.autofocus.distance();
    const zone = sharpZone(s.focalMm, s.aperture, distance, blurLimitMm(s.body.sensorWidthMm, s.body.sensorHeightMm));
    // Point à la distance horizontale d le long de l'axe, décalé de w sur le côté ; en coordonnées de la carte (y = −z).
    const at = (d: number, w: number) => `${cx + forward.x * d + side.x * w},${-(cz + forward.z * d + side.z * w)}`;
    // Distance horizontale d'un point à la hauteur de l'œil de l'appareil, de profondeur p le long de l'axe incliné.
    const tilt = Math.cos(this.camera.rotation.x);
    const level = (p: number) => p / tilt;
    const polygon = (layer: SVGGElement, points: string[], className = "") => {
      const p = document.createElementNS(NS, "polygon");
      p.setAttribute("points", points.join(" "));
      if (className) p.setAttribute("class", className);
      layer.replaceChildren(p);
    };
    const near = level(zone.near);
    const far = Math.min(level(zone.far), RAY);
    polygon(this.layers.zone, [at(near, -near * halfTan), at(near, near * halfTan), at(far, far * halfTan), at(far, -far * halfTan)]);
    polygon(this.layers.field, [at(RAY, -RAY * halfTan), at(0, 0), at(RAY, RAY * halfTan)]);
    const focus = document.createElementNS(NS, "line");
    const plane = level(distance);
    const [x1, y1] = at(plane, -plane * halfTan).split(",");
    const [x2, y2] = at(plane, plane * halfTan).split(",");
    focus.setAttribute("x1", x1);
    focus.setAttribute("y1", y1);
    focus.setAttribute("x2", x2);
    focus.setAttribute("y2", y2);
    this.layers.focus.replaceChildren(focus);
    polygon(this.layers.camera, [at(0.6, 0), at(-0.3, -0.35), at(-0.3, 0.35)]);

    // Personnages, objets, promeneur et chien : dessinés à leur position au sol, jugés sur les points que juge le
    // bulletin (camera/bulletin.ts, measureThing) : les yeux des personnages et du chien, un point à 0,5 m du sol
    // pour le banc et la poubelle ; un cercle commun à deux personnages est vert si les deux sont nets.
    const geometry = {
      view: this.camera.getViewMatrix(),
      focalMm: s.focalMm,
      aperture: s.aperture,
      shutterSeconds: s.shutterSeconds,
      focusDistance: distance,
      sensorWidthMm: s.body.sensorWidthMm,
      sensorHeightMm: s.body.sensorHeightMm,
      portrait: s.frame.portrait,
    };
    const sharpAt = (id: string, points: Vector3[]) => measureThing({ id, points, velocity: Vector3.Zero() }, geometry).sharp;
    const judged = (id: string, kind: string, ground: { x: number; z: number }) =>
      kind === "object"
        ? sharpAt(id, [new Vector3(ground.x, 0.5, ground.z)])
        : (JUDGED[id] ?? [id]).every((who) => sharpAt(who, judgedPoints(this.subjects, who, ground)));
    const things: { id: string; kind: string; x: number; z: number; sharp: boolean }[] = [
      ...LANDMARKS.map((l) => ({ ...l, sharp: judged(l.id, l.kind, l) })),
      ...this.time.movers().map((m) => {
        const kind = m.id === "jim" ? "animal" : "person";
        return { id: m.id, kind, x: m.position.x, z: m.position.z, sharp: judged(m.id, kind, { x: m.position.x, z: m.position.z }) };
      }),
    ];
    const shapes = things.map((thing) => {
      const sharp = thing.sharp;
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

    const decimal = (value: number) => value.toFixed(1).replace(".", ",");
    const farText = Number.isFinite(zone.far) ? `${decimal(zone.far)} m` : "∞";
    el.note.textContent = `${tr("topViewZone")} ${decimal(zone.near)} m – ${farText}. ${tr("topViewMove")}`;
  }
}
