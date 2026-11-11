// Indicateur d'équilibre entre ouverture, vitesse et ISO, au point visé (forme B choisie par Julien le
// 9 novembre 2026 : un triangle dans lequel un point bouge). Principe du 10 novembre 2026 : seuls des
// critères sourcés (docs/cadrage.md).
//
// - Ouverture : zone nette, sans jugement. Limites tirées de la formule du cercle de confusion,
//   c = A × |S₂ − S₁| / S₂ × f / (S₁ − f) avec A = f / N, en posant c égal au flou acceptable d / 1500
//   (d : diagonale du capteur ; 0,029 mm en plein format) [wikipedia-circle-of-confusion]
//   https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423 . Avec
//   q = c × N × (S₁ − f) / f² : limite proche S₁ / (1 + q), limite lointaine S₁ / (1 − q), ou l'infini si q ≥ 1.
// - Vitesse : traînée du sujet visé pendant la pose, sur le capteur, comparée au même flou acceptable.
//   Projection d'un point (X, Y, Z) de la caméra : x = f X / Z ; un sujet de vitesse (vX, vY, vZ) se déplace
//   de f (vX Z − X vZ) / Z² × t (et de même en y). Sujets en mouvement de la scène : le promeneur et le chien.
//   Traînée aussi donnée en pixels de la photo (MVT-01, « traînée mesurée en pixels ») : traînée sur le capteur
//   × 1500 / largeur du capteur, la photo faisant 1500 px sur le grand côté du capteur.
// - ISO : rapport signal sur bruit d'un pixel de la photo (1500 px de grand côté) au point visé, avec le
//   modèle de bruit du viseur (camera/noise.ts). Seuils de la norme des sensibilités numériques : 40:1,
//   « excellent image quality », et 10:1, « acceptable image quality », définis pour 70 pixels par cm vus à
//   25 cm [wikipedia-film-speed] https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213 ;
//   une photo de 1500 px y fait environ 21 cm de large (1500 / 70 ≈ 21,4 cm). Approximation :
//   canal vert seul, la norme pondérant luminance et couleur d'une façon que l'article ne détaille pas.
// - Le point : au centre quand rien ne dépasse ; il s'écarte vers l'ISO si le bruit dépasse 40:1 (un peu)
//   ou 10:1 (beaucoup), vers la vitesse si la traînée dépasse le flou acceptable. Géométrie choisie pour
//   l'affichage ; les seuils, eux, sont sourcés.
// Non simulé : le bougé de la main (MVT-01), sans source ni simulation à ce jour.

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Autofocus } from "../camera/autofocus";
import { blurLimitMm, sharpZone } from "../camera/sharpZone";
import { noiseParameters } from "../camera/noise";
import { PHOTO_LONG_SIDE, type SceneTimeControl } from "../camera/photo";
import type { CameraPanel } from "./cameraPanel";
import { t, type Lang, type MessageKey } from "../i18n";

const REFRESH_MS = 300;
/** Côté du carré de pixels lus autour du point visé, pour moyenner le bruit du viseur. */
const SAMPLE_SIDE = 5;
/** Distance horizontale au-delà de laquelle le point visé n'est pas sur un sujet en mouvement (choisie). */
const MOVER_RADIUS_M = 1;

type Status = "ok" | "warn" | "bad" | "neutral";

interface BalanceElements {
  root: HTMLElement;
  toggle: HTMLButtonElement;
  title: HTMLElement;
  aperture: SVGElement;
  shutter: SVGElement;
  iso: SVGElement;
  point: SVGElement;
  dof: HTMLElement;
  motion: HTMLElement;
  noise: HTMLElement;
  note: HTMLElement;
}

export class BalanceIndicator {
  private enabled = true;
  private busy = false;

  constructor(
    private readonly engine: Engine,
    private readonly scene: Scene,
    private readonly camera: Camera,
    private readonly time: SceneTimeControl,
    private readonly autofocus: Autofocus,
    private readonly panel: CameraPanel,
    private readonly el: BalanceElements,
    private lang: Lang,
  ) {
    setInterval(() => void this.refresh(), REFRESH_MS);
    // Petit écran : le triangle seul au départ ; un toucher affiche ou masque les lignes.
    let collapsed = window.matchMedia("(max-width: 700px)").matches;
    const apply = () => {
      el.root.classList.toggle("collapsed", collapsed);
      el.toggle.setAttribute("aria-expanded", String(!collapsed));
    };
    el.toggle.addEventListener("click", () => {
      collapsed = !collapsed;
      apply();
    });
    apply();
    this.setLang(lang);
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.el.title.textContent = t(lang, "balanceTitle");
    this.el.note.textContent = t(lang, "balanceNote");
    const limits = this.el.root.querySelector("#balance-limits");
    if (limits) limits.textContent = t(lang, "balanceLimits");
    this.el.toggle.setAttribute("aria-label", t(lang, "balanceToggle"));
    this.el.toggle.title = t(lang, "balanceToggle");
  }

  /** Interrupteur de l'indicateur, dans la fenêtre « Aperçu ». */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.el.root.hidden = !enabled;
  }

  private async refresh(): Promise<void> {
    if (!this.enabled || this.busy) return;
    this.busy = true;
    try {
      const tr = (key: MessageKey) => t(this.lang, key);
      const s = this.panel.current();
      const f = s.focalMm;
      const N = s.aperture;
      const tSec = s.shutterSeconds;
      const S1 = this.autofocus.distance();
      const body = s.body;
      const blurLimit = blurLimitMm(body.sensorWidthMm, body.sensorHeightMm);

      // Ouverture : zone nette (camera/sharpZone.ts).
      const { near, far } = sharpZone(f, N, S1, blurLimit);
      const farText = Number.isFinite(far) ? `${this.decimal(far, 1)} m` : "∞";
      this.el.dof.textContent = `${s.labels.aperture} · ${tr("balanceDof")} ${this.decimal(near, 1)} m – ${farText}`;

      // Point visé : œil ou visage suivi, sinon point de mise au point ; position dans la caméra et la scène.
      const target = this.autofocus.target();
      const point = target?.point ?? this.panel.focusOnCanvas();
      const m = this.camera.getProjectionMatrix().asArray();
      const aimed = new Vector3((((point.x * 2 - 1) - m[8]) / m[0]) * S1, (((1 - point.y * 2) - m[9]) / m[5]) * S1, S1);
      const view = this.camera.getViewMatrix();
      const aimedWorld = Vector3.TransformCoordinates(aimed, view.clone().invert());

      // Vitesse : traînée du sujet visé.
      const movers = this.time.movers();
      let mover = target?.id ? movers.find((mv) => mv.id === target.id) : undefined;
      if (!mover) {
        let best = MOVER_RADIUS_M;
        for (const mv of movers) {
          const d = Math.hypot(mv.position.x - aimedWorld.x, mv.position.z - aimedWorld.z);
          if (d < best) {
            best = d;
            mover = mv;
          }
        }
      }
      let motion: Status = "neutral";
      const shutterText = s.labels.shutter;
      if (mover) {
        const v = Vector3.TransformNormal(mover.velocity, view);
        const dx = ((f * (v.x * aimed.z - aimed.x * v.z)) / (aimed.z * aimed.z)) * tSec;
        const dy = ((f * (v.y * aimed.z - aimed.y * v.z)) / (aimed.z * aimed.z)) * tSec;
        const trail = Math.hypot(dx, dy);
        const ratio = trail / blurLimit;
        const who = tr(mover.id === "jim" ? "balanceDog" : "balanceWalker");
        const pixels = (trail * PHOTO_LONG_SIDE) / body.sensorWidthMm;
        const pixelText = `${this.decimal(pixels, pixels < 10 ? 1 : 0)} ${tr("balancePixels")}`;
        motion = ratio <= 1 ? "ok" : "bad";
        this.el.motion.textContent =
          ratio <= 1
            ? `${shutterText} · ${who}${tr("balanceColon")}${tr("balanceSharp")} (${pixelText})`
            : `${shutterText} · ${who}${tr("balanceColon")}${tr("balanceTrail")} ${this.decimal(ratio, 1)} ${tr("balanceTimesLimit")} (${pixelText})`;
      } else {
        this.el.motion.textContent = `${shutterText} · ${tr("balanceStill")}`;
      }

      // ISO : rapport signal sur bruit au point visé.
      const isoText = s.labels.iso;
      const green = await this.greenAt(point);
      let noise: Status = "neutral";
      if (green === null) {
        this.el.noise.textContent = `${isoText} · ${tr("balanceNoiseUnknown")}`;
      } else {
        const v = Math.min(1, green * this.panel.displayGain());
        if (v >= 0.99) {
          this.el.noise.textContent = `${isoText} · ${tr("balanceClipped")}`;
        } else {
          const pixels = PHOTO_LONG_SIDE * Math.round((PHOTO_LONG_SIDE * body.sensorHeightMm) / body.sensorWidthMm);
          const p = noiseParameters(body, s.iso, pixels);
          const electrons = Math.max(v, 1e-6) * p.saturation;
          const sigma = Math.sqrt(electrons + p.readNoise2) / (p.saturation * Math.sqrt(p.photosites[1]));
          const snr = v / sigma;
          noise = snr >= 40 ? "ok" : snr >= 10 ? "warn" : "bad";
          const level = tr(noise === "ok" ? "balanceExcellent" : noise === "warn" ? "balanceAcceptable" : "balanceInsufficient");
          this.el.noise.textContent = `${isoText} · ${tr("balanceNoise")} ${level} (${tr("balanceSnr")} ${Math.round(snr)}:1)`;
        }
      }

      this.draw(motion, noise);
    } finally {
      this.busy = false;
    }
  }

  /** Couleurs des sommets et position du point : au centre, tiré vers l'ISO ou la vitesse en cas de dépassement. */
  private draw(motion: Status, noise: Status): void {
    this.el.aperture.setAttribute("class", "balance-vertex neutral");
    this.el.shutter.setAttribute("class", `balance-vertex ${motion}`);
    this.el.iso.setAttribute("class", `balance-vertex ${noise}`);
    const vertices = { aperture: [60, 10], shutter: [10, 96], iso: [110, 96] };
    const weights = { aperture: 1, shutter: 1 + (motion === "bad" ? 3 : 0), iso: 1 + (noise === "bad" ? 3 : noise === "warn" ? 1 : 0) };
    const total = weights.aperture + weights.shutter + weights.iso;
    const x = (weights.aperture * vertices.aperture[0] + weights.shutter * vertices.shutter[0] + weights.iso * vertices.iso[0]) / total;
    const y = (weights.aperture * vertices.aperture[1] + weights.shutter * vertices.shutter[1] + weights.iso * vertices.iso[1]) / total;
    this.el.point.setAttribute("cx", x.toFixed(1));
    this.el.point.setAttribute("cy", y.toFixed(1));
    const worst = [motion, noise].includes("bad") ? "bad" : [motion, noise].includes("warn") ? "warn" : "ok";
    this.el.point.setAttribute("class", `balance-point ${worst}`);
  }

  /**
   * Valeur linéaire moyenne du canal vert affiché autour du point visé (de 0 à 1), lue juste après une image
   * (l'image du viseur est encodée en puissance 1/2,2, voir camera/noise.ts). Null si aucune image n'est rendue
   * à temps (calcul d'une photo) ou si la lecture échoue.
   */
  private greenAt(point: { x: number; y: number }): Promise<number | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.scene.onAfterRenderObservable.remove(observer);
        resolve(null);
      }, 1000);
      const observer = this.scene.onAfterRenderObservable.addOnce(() => {
        clearTimeout(timer);
        const width = this.engine.getRenderWidth();
        const height = this.engine.getRenderHeight();
        const half = Math.floor(SAMPLE_SIDE / 2);
        const x = Math.min(width - SAMPLE_SIDE, Math.max(0, Math.round(point.x * width) - half));
        const y = Math.min(height - SAMPLE_SIDE, Math.max(0, Math.round((1 - point.y) * height) - half));
        this.engine
          .readPixels(x, y, SAMPLE_SIDE, SAMPLE_SIDE, true, false)
          .then((data) => {
            const bytes = data as Uint8Array;
            let sum = 0;
            for (let i = 1; i < bytes.length; i += 4) sum += (bytes[i] / 255) ** 2.2;
            resolve(sum / (bytes.length / 4));
          })
          .catch(() => resolve(null));
      });
    });
  }

  private decimal(value: number, digits: number): string {
    const text = value.toFixed(digits);
    return this.lang === "fr" ? text.replace(".", ",") : text;
  }
}
