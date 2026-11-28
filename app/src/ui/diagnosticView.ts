// Affichage de diagnostic (Sujet 28 du plan de corrections, constat ARC-06 de l'audit, version 0.3.88), ouvert par le
// paramètre « ?diagnostic » de l'adresse ; sans lui, main.ts ne crée pas cet affichage et rien ne change. Un calque en
// bas à gauche du viseur, qui ne prend pas les touchers, réécrit chaque seconde : version du site, WebGL et processeur
// graphique, densité et taille de l'image calculée, images par seconde, durée moyenne d'une image et de sa phase des
// textures de rendu côté processeur, durée d'une image côté processeur graphique quand le navigateur expose l'extension
// de mesure, capacités de rendu en flottants, textures (version 0.4.15). Lignes et compteur : diagnosticModel.ts ; ce
// que valent ces chiffres, et comment comparer deux versions : docs/pile-technique.md, « Prise en charge des
// navigateurs ».

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
// Mesure côté processeur graphique : Babylon.js 9.35.0 l'écrit dans deux extensions du moteur, que Engines/engine.js
// n'importe pas. Leurs modules « .pure » n'ont pas d'effet à l'import : les fonctions Register… ajoutent ces méthodes au
// moteur, appelées ici seulement, donc seulement avec le paramètre de l'adresse.
import { RegisterAbstractEngineTimeQuery } from "@babylonjs/core/Engines/AbstractEngine/abstractEngine.timeQuery.pure";
import { RegisterEnginesExtensionsEngineQuery } from "@babylonjs/core/Engines/Extensions/engine.query.pure";
import { EngineInstrumentation } from "@babylonjs/core/Instrumentation/engineInstrumentation";
import {
  FrameMeter,
  SHOWN_FLOAT_CAPS,
  diagnosticLines,
  estimatedTextureBytes,
  type FloatCaps,
  type GpuReading,
  type TextureReading,
} from "../diagnosticModel";
import { siteVersion } from "../version";

/** Intervalle de réécriture de l'affichage, et durée de la fenêtre du compteur des images. */
const REFRESH_MS = 1000;
/** Nanosecondes par milliseconde : la mesure côté processeur graphique est en nanosecondes (TIME_ELAPSED_EXT). */
const NS_PER_MS = 1e6;

export class DiagnosticView {
  /** Lecture des textures figée par main.ts quand le démarrage s'arrête (freezeTextures). */
  private texturesFrozen = false;

  /**
   * `host` : l'élément `main` de la page. Le calque y est placé juste avant l'écran de revue : à z-index égal (1), celui-ci
   * le couvre, et la bande de calcul, la ligne des problèmes et les messages de la scène passent au-dessus de lui
   * (style.css, .diagnostic-view ; relecture de la version 0.3.88, constat C4). À créer après l'autofocus : sa
   * préparation des os, au début de la phase des textures de rendu, reste ainsi hors de la part mesurée (constat C7).
   */
  constructor(engine: Engine, scene: Scene, host: HTMLElement, textures: Pick<TextureReading, "maxSize" | "light">) {
    const element = document.createElement("div");
    element.id = "diagnostic-view";
    element.className = "diagnostic-view";
    host.insertBefore(element, document.getElementById("review"));

    // Images de la boucle de rendu : le moteur notifie onBeginFrameObservable et onEndFrameObservable avant et après
    // chacune (Babylon.js 9.35.0, Engines/abstractEngine.pure.js, _processFrame). La phase des textures de rendu (carte
    // d'ombres, carte de profondeur du viseur) : entre onBeforeRenderTargetsRenderObservable et
    // onAfterRenderTargetsRenderObservable de la scène, notifiés autour de chaque phase (scene.pure.js, render et
    // _renderForCamera) ; un observateur ajouté s'exécute après ceux qui l'étaient déjà (Misc/observable.pure.js).
    const meter = new FrameMeter(performance.now());
    engine.onBeginFrameObservable.add(() => meter.beginFrame(performance.now()));
    scene.onBeforeRenderTargetsRenderObservable.add(() => meter.beginTargets(performance.now()));
    scene.onAfterRenderTargetsRenderObservable.add(() => meter.endTargets(performance.now()));
    engine.onEndFrameObservable.add(() => meter.endFrame(performance.now()));

    const caps = engine.getCaps();
    // Extension de mesure côté processeur graphique (Engines/thinEngine.pure.js, capacité timerQuery) : en WebGL 2,
    // EXT_disjoint_timer_query_webgl2, en WebGL 1, EXT_disjoint_timer_query. En WebGL 1 sans horodatage
    // (canUseTimestampForTimerQuery), Babylon.js 9.35.0 ne mesure qu'une image : endTimeQuery ne remet à zéro le jeton de
    // la mesure en cours que dans la branche WebGL 2 (Engines/Extensions/engine.query.pure.js, startTimeQuery et
    // endTimeQuery), et startTimeQuery rend ensuite toujours ce jeton vidé (relecture de la version 0.3.88, constat C2).
    const extension = engine.webGLVersion > 1 ? "EXT_disjoint_timer_query_webgl2" : "EXT_disjoint_timer_query";
    let unmeasured: GpuReading | null = null;
    if (!caps.timerQuery) unmeasured = { state: "missing", extension };
    else if (engine.webGLVersion === 1 && !caps.canUseTimestampForTimerQuery) unmeasured = { state: "unsupported" };
    let gpu: EngineInstrumentation | null = null;
    if (unmeasured === null) {
      RegisterAbstractEngineTimeQuery();
      RegisterEnginesExtensionsEngineQuery();
      gpu = new EngineInstrumentation(engine);
      gpu.captureGPUFrameTime = true;
    }
    const floatCaps = Object.fromEntries(SHOWN_FLOAT_CAPS.map((name) => [name, Boolean(caps[name])])) as FloatCaps;
    const renderer = engine.getGlInfo().renderer;

    // Nombre de mesures côté processeur graphique à la réécriture précédente : une durée n'est écrite que si une mesure
    // est arrivée depuis. Babylon.js n'en commence une qu'une fois le résultat de la précédente lu, et sa moyenne
    // (PerfCounter.lastSecAverage, Misc/perfCounter.js) est celle des mesures arrivées pendant la dernière seconde
    // écoulée, la première mesure seule au début ; elle garde sa valeur quand plus rien n'arrive (constat C3).
    let measuredBefore = 0;
    const gpuReading = (): GpuReading => {
      if (unmeasured !== null || gpu === null) return unmeasured ?? { state: "waiting" };
      const counter = gpu.gpuFrameTimeCounter;
      const fresh = counter.count > measuredBefore && counter.lastSecAverage > 0;
      measuredBefore = counter.count;
      return fresh ? { state: "measured", ms: counter.lastSecAverage / NS_PER_MS } : { state: "waiting" };
    };

    // Textures que Babylon.js a créées, textures de rendu comprises (version 0.4.15), relues à chaque réécriture, et
    // limite de taille que Babylon.js applique à cet instant (`caps.maxTextureSize`, que main.ts abaisse pendant le
    // chargement aux textures allégées). Sur un contexte perdu, Babylon.js continue d'inscrire et de dimensionner des
    // textures que le navigateur ne crée pas (Engines/thinEngine.pure.js, `_prepareWebGLTexture`) : la lecture garde
    // alors le nombre et les octets de la dernière réécriture avant la perte, et, après un démarrage arrêté, même si
    // le contexte est restauré (relecture de la version 0.4.15, R5).
    let seen = { count: 0, bytes: 0 };
    const textureReading = (): TextureReading => {
      const lost = this.texturesFrozen || engine._gl.isContextLost();
      if (!lost) {
        const cache = engine.getLoadedTexturesCache();
        seen = { count: cache.length, bytes: cache.reduce((sum, texture) => sum + estimatedTextureBytes(texture), 0) };
      }
      return { ...textures, ...seen, currentMaxSize: caps.maxTextureSize, lost };
    };

    const render = () => {
      element.textContent = diagnosticLines({
        version: siteVersion(),
        webgl: engine.webGLVersion,
        renderer,
        screenDensity: window.devicePixelRatio,
        renderDensity: 1 / engine.getHardwareScalingLevel(),
        renderWidth: engine.getRenderWidth(),
        renderHeight: engine.getRenderHeight(),
        window: meter.take(performance.now()),
        gpu: gpuReading(),
        caps: floatCaps,
        textures: textureReading(),
      }).join("\n");
    };
    render();
    window.setInterval(render, REFRESH_MS);
  }

  /**
   * Démarrage arrêté sur une perte du contexte (main.ts, failStart) : la ligne des textures garde ce qui était relevé
   * avant, pour qu'une capture d'écran dise où en était le chargement.
   */
  freezeTextures(): void {
    this.texturesFrozen = true;
  }
}
