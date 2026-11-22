// Affichage de diagnostic (Sujet 28 du plan de corrections, constat ARC-06 de l'audit, version 0.3.88), ouvert par le
// paramètre « ?diagnostic » de l'adresse ; sans lui, main.ts ne crée pas cet affichage et rien ne change. Un calque en
// bas à gauche du viseur, qui ne prend pas les touchers, réécrit chaque seconde : version du site, WebGL et processeur
// graphique, densité et taille de l'image calculée, images par seconde, durée moyenne d'une image et de sa phase des
// textures de rendu côté processeur, durée d'une image côté processeur graphique quand le navigateur expose l'extension
// de mesure, capacités de rendu en flottants. Lignes et compteur : diagnosticModel.ts ; ce que valent ces chiffres, et
// comment comparer deux versions : docs/pile-technique.md, « Prise en charge des navigateurs ».

import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
// Mesure côté processeur graphique : Babylon.js 9.35.0 l'écrit dans deux extensions du moteur, que Engines/engine.js
// n'importe pas. Leurs modules « .pure » n'ont pas d'effet à l'import : les fonctions Register… ajoutent ces méthodes au
// moteur, appelées ici seulement, donc seulement avec le paramètre de l'adresse.
import { RegisterAbstractEngineTimeQuery } from "@babylonjs/core/Engines/AbstractEngine/abstractEngine.timeQuery.pure";
import { RegisterEnginesExtensionsEngineQuery } from "@babylonjs/core/Engines/Extensions/engine.query.pure";
import { EngineInstrumentation } from "@babylonjs/core/Instrumentation/engineInstrumentation";
import { FrameMeter, SHOWN_FLOAT_CAPS, diagnosticLines, type FloatCaps } from "../diagnosticModel";
import { siteVersion } from "../version";

/** Intervalle de réécriture de l'affichage, et durée de la fenêtre du compteur des images. */
const REFRESH_MS = 1000;
/** Nanosecondes par milliseconde : la mesure côté processeur graphique est en nanosecondes (TIME_ELAPSED_EXT). */
const NS_PER_MS = 1e6;

export class DiagnosticView {
  constructor(engine: Engine, scene: Scene, host: HTMLElement) {
    const element = document.createElement("div");
    element.id = "diagnostic-view";
    element.className = "diagnostic-view";
    host.append(element);

    // Images de la boucle de rendu : le moteur notifie onBeginFrameObservable et onEndFrameObservable avant et après
    // chacune (Babylon.js 9.35.0, Engines/abstractEngine.pure.js, _processFrame). La phase des textures de rendu (carte
    // d'ombres, carte de profondeur du viseur) : entre onBeforeRenderTargetsRenderObservable et
    // onAfterRenderTargetsRenderObservable de la scène, notifiés autour de chaque phase (scene.pure.js, render et
    // _renderForCamera).
    const meter = new FrameMeter(performance.now());
    engine.onBeginFrameObservable.add(() => meter.beginFrame(performance.now()));
    scene.onBeforeRenderTargetsRenderObservable.add(() => meter.beginTargets(performance.now()));
    scene.onAfterRenderTargetsRenderObservable.add(() => meter.endTargets(performance.now()));
    engine.onEndFrameObservable.add(() => meter.endFrame(performance.now()));

    const caps = engine.getCaps();
    // Extension de mesure côté processeur graphique (Engines/thinEngine.pure.js, capacité timerQuery) : en WebGL 2,
    // EXT_disjoint_timer_query_webgl2, en WebGL 1, EXT_disjoint_timer_query.
    const extension = engine.webGLVersion > 1 ? "EXT_disjoint_timer_query_webgl2" : "EXT_disjoint_timer_query";
    let gpu: EngineInstrumentation | null = null;
    if (caps.timerQuery) {
      RegisterAbstractEngineTimeQuery();
      RegisterEnginesExtensionsEngineQuery();
      gpu = new EngineInstrumentation(engine);
      gpu.captureGPUFrameTime = true;
    }
    const floatCaps = Object.fromEntries(SHOWN_FLOAT_CAPS.map((name) => [name, Boolean(caps[name])])) as FloatCaps;
    const renderer = engine.getGlInfo().renderer;

    const render = () => {
      const counter = gpu?.gpuFrameTimeCounter ?? null;
      // Moyenne de la dernière seconde (PerfCounter de Babylon.js) : nulle tant qu'une seconde de mesures n'est pas passée.
      const gpuNs = counter && counter.lastSecAverage > 0 ? counter.lastSecAverage : null;
      element.textContent = diagnosticLines({
        version: siteVersion(),
        webgl: engine.webGLVersion,
        renderer,
        screenDensity: window.devicePixelRatio,
        renderDensity: 1 / engine.getHardwareScalingLevel(),
        renderWidth: engine.getRenderWidth(),
        renderHeight: engine.getRenderHeight(),
        window: meter.take(performance.now()),
        gpuMs: gpuNs === null ? null : gpuNs / NS_PER_MS,
        gpuMissing: caps.timerQuery ? null : extension,
        caps: floatCaps,
      }).join("\n");
    };
    render();
    window.setInterval(render, REFRESH_MS);
  }
}
