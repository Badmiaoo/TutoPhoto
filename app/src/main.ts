import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createScene, SceneFileError } from "./scene";
import { whenSceneReady } from "./camera/photo";
import { loadManifest, renderCodeCredits, renderCredits, renderCreditsUnavailable, renderVersion } from "./credits";
import { CameraPanel } from "./ui/cameraPanel";
import { Shutter } from "./ui/shutter";
import { DOME_RADIUS, EYE_HEIGHT } from "./scene";
import { ViewfinderNoise } from "./camera/noise";
import { ViewfinderDepthOfField } from "./camera/viewfinderDof";
import { Autofocus } from "./camera/autofocus";
import { SettingsStore, browserStorage } from "./camera/settings";
import { BalanceIndicator } from "./ui/balance";
import { TopView } from "./ui/topView";
import { ChallengePicker } from "./ui/challenges";
import { FicheDialog } from "./ui/ficheDialog";
import { ReviewInfo } from "./ui/reviewInfo";
import { DiagnosticView } from "./ui/diagnosticView";
import { closeOnBackdrop, openDialog } from "./ui/dialogs";
import { diagnosticRequested, floatRenderMessage, fullDensityRequested, missingFloatRender } from "./diagnosticModel";
import { t } from "./texts";
import { siteVersion } from "./version";

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Élément #${id} absent de la page`);
  return found as T;
}

const canvas = element<HTMLCanvasElement>("scene");
const creditsButton = element<HTMLButtonElement>("credits");
const creditsDialog = element<HTMLDialogElement>("credits-dialog");
const creditsList = element<HTMLUListElement>("credits-list");
const status = element<HTMLParagraphElement>("status");
// Dans le message de la scène, la zone vivante (role="status") ne porte que le message : le compteur du chargement,
// réécrit chaque seconde, la faisait annoncer chaque seconde (constat INT-15 de l'audit, version 0.4.7). Le compteur
// et « Recharger » sont à côté d'elle, dans le même paragraphe.
const statusMessage = element<HTMLSpanElement>("status-message");
const statusDetail = element<HTMLSpanElement>("status-detail");
const diagnostic = element<HTMLParagraphElement>("diagnostic");
// Le simulateur est sous simulateur/ depuis la version 0.3.46 : la scène est un dossier plus haut.
const manifest = loadManifest("../scenes/parc/scene.json");

/** Densité maximale de calcul du viseur, en pixels calculés par pixel CSS (version 0.3.53, choix de Julien). */
const MAX_DEVICE_RATIO = 2;

// Progression du chargement (version 0.3.51). La scène pèse 34 Mio, et un message seul ne permettait pas de
// distinguer un réseau lent, un fichier bloqué ou une scène reçue mais pas prête (chargement sans fin signalé par
// Julien le 11 novembre 2026). Un fichier compte comme reçu quand le navigateur l'a reçu, d'après la Resource Timing
// API (performance.getEntriesByType("resource"), voir isReceived()) ; sa taille est celle du manifeste.
let sceneFiles: { path: string; bytes: number }[] = [];
const MISSING_AFTER_S = 60;
const MIB = 2 ** 20;

/**
 * Entrée de la Resource Timing API d'un fichier reçu (version 0.3.70, constat COD-06 de l'audit). Un chargement en
 * échec a aussi son entrée : avant, il comptait comme reçu. Dans Chromium, ses champs responseStatus, transferSize et
 * decodedBodySize valent 0 (contre 200 et la taille du fichier pour un fichier reçu, relevé de la contre-vérification
 * de COD-06). Un navigateur qui ne donne pas l'état de la réponse est jugé sur les tailles ; un navigateur qui ne donne
 * aucun de ces champs garde la règle d'avant (toute entrée compte), sans quoi la progression resterait à zéro.
 */
function isReceived(entry: PerformanceResourceTiming): boolean {
  const status = (entry as { responseStatus?: unknown }).responseStatus;
  if (typeof status === "number" && status > 0) return status >= 200 && status < 300;
  const sizes = [entry.transferSize, entry.decodedBodySize].filter((size): size is number => typeof size === "number");
  if (typeof status !== "number" && sizes.length === 0) return true;
  return sizes.some((size) => size > 0);
}

function loadingProgress(): string {
  const seconds = Math.round(performance.now() / 1000);
  if (sceneFiles.length === 0) return ` · ${seconds} s`;
  const loaded = new Set(
    (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).filter(isReceived).map((e) => {
      try {
        return decodeURIComponent(new URL(e.name).pathname);
      } catch {
        return e.name;
      }
    }),
  );
  const done = (path: string) => [...loaded].some((name) => name.endsWith(`/scenes/parc/${path}`));
  const missing = sceneFiles.filter((f) => !done(f.path));
  const total = sceneFiles.reduce((sum, f) => sum + f.bytes, 0);
  const received = total - missing.reduce((sum, f) => sum + f.bytes, 0);
  const fill = (text: string) => text.replace("{s}", String(seconds));
  if (missing.length === 0) return ` ${fill(t("loadingPreparing"))}`;
  let text = ` ${fill(t("loadingProgress")).replace("{done}", String(Math.round(received / MIB))).replace("{total}", String(Math.round(total / MIB)))}`;
  if (seconds >= MISSING_AFTER_S) {
    const names = missing.slice(0, 3).map((f) => f.path.split("/").pop());
    text += ` · ${t("loadingMissing").replace("{files}", names.join(", ") + (missing.length > 3 ? "…" : ""))}`;
  }
  return text;
}
// Les textes de licence du manifeste (license.txt) ne sont pas chargés par la scène : comptés, ils restaient « en
// attente » pour toujours, et « préparation » ne s'affichait jamais (corrigé en version 0.3.55 ; constaté dans
// Chromium : après le chargement, ces fichiers sont les seuls absents de la Resource Timing API). Même règle que le
// pré-téléchargement de l'accueil (app/scripts/build-pages.mjs).
manifest
  .then((m) => (sceneFiles = m.assets.flatMap((asset) => asset.files ?? []).filter((f) => !f.path.endsWith(".txt"))))
  .catch(() => undefined);
// Mise à jour de la progression chaque seconde, tant que la scène se charge.
const loadingTimer = window.setInterval(() => {
  if (statusKey !== "loading") window.clearInterval(loadingTimer);
  else renderStatus();
}, 1000);
/**
 * Message de la scène : chargement en cours, chargement en échec, ou démarrage arrêté (version 0.4.4) par un contexte
 * WebGL perdu dès la création du moteur ou pendant le démarrage (startContextLost), perdu pendant le chargement de la
 * scène (startContextLostLoading, version 0.4.15) ou par une autre exception (startError) ; null quand la scène est
 * prête.
 */
type StartFailure = "startContextLost" | "startContextLostLoading" | "startError";
let statusKey: "loading" | "loadError" | StartFailure | null = "loading";
/** Fichier nommé par l'échec du chargement, s'il est connu (version 0.3.70). */
let failedFile: string | null = null;
/** Contexte WebGL perdu, en attente de sa restauration (version 0.3.70, constat COD-12 de l'audit). */
let contextLost = false;
/**
 * Chargement de la scène en cours (version 0.4.15) : jusqu'à ce que la scène soit prête (ready résolue), ou, après
 * l'échec d'un fichier, jusqu'à la fin du chargement de chacun (filesSettled). Une perte du contexte pendant ce temps
 * arrête le démarrage ; après, c'est une perte en cours d'usage.
 */
let sceneLoading = true;
/**
 * Chargement en échec, et scène toujours pas prête 20 s après l'arrivée ou l'échec du dernier fichier : une photo est
 * alors refusée tout de suite, au lieu d'attendre 20 s pour échouer (relecture du Sujet 10, version 0.3.70).
 */
let sceneStuck = false;
let cameraPanel: CameraPanel | null = null;
let shutter: Shutter | null = null;
let balance: BalanceIndicator | null = null;
let topView: TopView | null = null;
let challenges: ChallengePicker | null = null;
let ficheDialog: FicheDialog | null = null;

// Problèmes affichés à l'écran, pour diagnostiquer sur un téléphone sans console : erreurs JavaScript,
// shader du bruit qui ne compile pas, scène affichée avant d'être prête, rendu en flottants absent (version 0.3.88).
type ProblemKey = "problemError" | "problemNoise" | "problemDepthOfField" | "problemLate" | "problemFloatRender";
const problems: { key: ProblemKey; detail: string }[] = [];

function report(key: ProblemKey, detail: string): void {
  if (problems.length >= 4 || problems.some((p) => p.key === key && p.detail === detail)) return;
  problems.push({ key, detail });
  renderProblems();
}

function renderProblems(): void {
  const parts = problems.map((p) => `${t(p.key)}\u00a0: ${p.detail}`);
  // La version du site suit le message d'un problème (version 0.3.59), pour rattacher une capture d'écran à une
  // version. Sans problème, la ligne reste vide et masquée : la routine de test le contrôle (« aucun problème
  // affiché »).
  if (parts.length > 0) parts.push(siteVersion());
  diagnostic.textContent = parts.join(" · ");
  diagnostic.hidden = problems.length === 0;
}

/**
 * Message d'un échec, suivi de la version du site : « La scène n'a pas pu être chargée. Version du site : X.Y.Z. »
 * (version 0.3.59, demande de Julien du 15 novembre 2026). Pour un chargement en échec, pour un navigateur sans WebGL
 * (message visible à l'écran depuis la version 0.3.70) et, depuis cette version, pour un affichage interrompu par la
 * perte du contexte WebGL. Une capture d'écran se rattache ainsi à une version. Le message d'un chargement en cours ne
 * la porte pas.
 */
function withVersion(message: string): string {
  return `${message} ${siteVersion()}.`;
}

/** Bouton « Recharger » des messages d'échec (version 0.3.70, constat COD-06 de l'audit). */
const reloadButton = document.createElement("button");
reloadButton.type = "button";
reloadButton.addEventListener("click", () => window.location.reload());

/**
 * Message de la scène : chargement en cours, chargement en échec (avec le fichier en cause et « Recharger »), ou
 * affichage interrompu par la perte du contexte WebGL (avec « Recharger »), qui passe avant les deux autres. Un
 * démarrage arrêté (version 0.4.4, avec « Recharger ») passe avant tout : la scène n'a pas été créée, et le message
 * de la perte du contexte, qui dit que l'affichage peut reprendre seul, serait faux.
 */
let renderedStatus: string | null = null;
function renderStatus(): void {
  if (reloadButton.textContent !== t("reload")) reloadButton.textContent = t("reload");
  let message: string;
  let detail = "";
  let reload = true;
  if (statusKey === "startContextLost" || statusKey === "startContextLostLoading" || statusKey === "startError") {
    message = withVersion(t(statusKey));
  } else if (contextLost) {
    message = withVersion(t("contextLost"));
  } else if (statusKey === "loadError") {
    message = withVersion(failedFile ? t("loadErrorFile").replace("{file}", failedFile) : t("loadError"));
  } else {
    message = statusKey === "loading" ? t("loading") : "";
    detail = statusKey === "loading" ? loadingProgress() : "";
    reload = false;
  }
  // Réécrit seulement quand le texte change (relecture du Sujet 10) : pendant une perte du contexte en cours de
  // chargement, la mise à jour de chaque seconde retirait et remettait « Recharger », qui perdait le focus. La zone
  // vivante n'est réécrite que quand son message change, pas à chaque seconde du compteur.
  if (statusMessage.textContent !== message) statusMessage.textContent = message;
  if (statusDetail.textContent !== detail) statusDetail.textContent = detail;
  const key = reload ? "R" : "-";
  if (key !== renderedStatus) {
    renderedStatus = key;
    if (reload) status.replaceChildren(statusMessage, statusDetail, " ", reloadButton);
    else status.replaceChildren(statusMessage, statusDetail);
  }
  status.hidden = statusKey === null && !contextLost;
}

window.addEventListener("error", (event) => report("problemError", event.message || String(event.error)));
window.addEventListener("unhandledrejection", (event) => report("problemError", String(event.reason)));

function applyTexts(): void {
  element("subtitle").textContent = t("subtitle");
  element("licences").textContent = t("licences");
  element("home").textContent = t("home");
  creditsButton.textContent = t("credits");
  element("credits-title").textContent = t("creditsTitle");
  element("credits-intro").textContent = t("creditsIntro");
  renderVersion(element("credits-version"));
  renderCodeCredits(element("credits-code"));
  element("credits-close").textContent = t("close");
  element("no-webgl").textContent = withVersion(t("noWebgl"));
  canvas.setAttribute("aria-label", t("sceneLabel"));
  renderStatus();
  // Manifeste non reçu : la fenêtre le dit, au lieu d'une liste vide (version 0.3.70, constat COD-06 de l'audit).
  manifest.then((m) => renderCredits(creditsList, m)).catch(() => renderCreditsUnavailable(creditsList));
  cameraPanel?.applyTexts();
  shutter?.applyTexts();
  balance?.applyTexts();
  topView?.applyTexts();
  challenges?.applyTexts();
  ficheDialog?.applyTexts();
  renderProblems();
}

// La fenêtre « Crédits » s'ouvre en haut, où est la ligne de version (version 0.3.59), comme toutes les fenêtres depuis
// la version 0.4.10 (ui/dialogs.ts, constat INT-20 de l'audit).
creditsButton.addEventListener("click", () => openDialog(creditsDialog));
// Toutes les fenêtres se ferment par un toucher sur le fond, hors d'elles (constat INT-20 de l'audit, version 0.4.10).
// Fermée pendant que l'écran de revue couvre tout l'écran, une fenêtre ne peut pas rendre le focus à son bouton,
// devenu inerte : il va à « Revenir au viseur » (contrôle final de la version 0.4.10, F9).
for (const dialog of document.querySelectorAll("dialog")) {
  closeOnBackdrop(dialog);
  dialog.addEventListener("close", () => shutter?.keepFocusInReview());
}
// Fiches ouvertes par-dessus le simulateur (bulletin, fenêtre « Défis ») : indépendant de la scène 3D.
ficheDialog = new FicheDialog(
  {
    dialog: element<HTMLDialogElement>("fiche-dialog"),
    body: element("fiche-body"),
    page: element<HTMLAnchorElement>("fiche-page"),
    close: element<HTMLButtonElement>("fiche-close"),
  },
);
applyTexts();

if (!Engine.isSupported()) {
  // Sans WebGL, seul le message reste dans main (version 0.3.70, constat COD-11 de l'audit) : la classe masque le
  // canevas, le voile du cadre, l'indicateur d'équilibre, la vue de dessus et les repères, qui le cachaient, et le
  // bouton « Défis », que seule la branche avec WebGL remplit (style.css).
  document.body.classList.add("no-webgl");
  canvas.hidden = true;
  element("camera-panel").hidden = true;
  statusKey = null;
  element("no-webgl").hidden = false;
  applyTexts();
} else startOrFail();

/**
 * Démarrage du simulateur, ou message qui dit qu'il n'a pas pu démarrer (version 0.4.4, demande de Julien du
 * 22 novembre 2026). Sur l'iPhone de la capture, dans Safari, les capacités lues valaient toutes « non », et Babylon.js a
 * levé « Unable to create vertex buffer », `createBuffer()` ayant rendu null, avant que le panneau du boîtier ait reçu ses
 * textes (dans le scénario reproduit dans Chromium : à la création de la scène) : tout indique un contexte WebGL
 * inutilisable dès l'ouverture, sans que `isContextLost()` y ait été lu. L'exception arrêtait le
 * démarrage sans que rien ne le dise : la ligne des problèmes l'écrivait, mais la progression du chargement comptait
 * les secondes sans fin, les boutons du boîtier restaient sans texte, rien ne disait de recharger, et le message des
 * capacités imputait la panne au rendu en flottants. Un contexte perdu dès la création du moteur, ou une exception
 * pendant le démarrage, arrêtent maintenant le démarrage avec un message et « Recharger », et le message des capacités
 * n'est donné que pour un contexte qui n'est pas perdu. Depuis la version 0.4.15 (demande de Julien du 23 novembre
 * 2026), un contexte perdu pendant le chargement de la scène l'arrête aussi. Ce qui est établi, et ce qui ne l'est pas :
 * docs/pile-technique.md, « Contexte perdu au démarrage ».
 */
function startOrFail(): void {
  // Viseur calculé à la densité de l'écran (version 0.3.52, demande de Julien du 11 novembre 2026 : la scène
  // paraissait pixelisée sur son téléphone). Par défaut, Babylon.js calcule l'image à la taille en pixels CSS
  // (adaptToDeviceRatio faux : niveau de mise à l'échelle 1) et le navigateur l'agrandit à la densité de l'écran,
  // soit environ 2,6 pixels d'écran par pixel calculé sur un téléphone. Densité complète en version 0.3.52 : plus net,
  // mais saccadé sur le téléphone de Julien ; densité plafonnée à 2 en version 0.3.53, à sa demande (version isolée,
  // à annuler si elle ne convient pas). Babylon.js applique le plafond à la création du moteur (niveau de mise à
  // l'échelle 1 / min(plafond, densité)) ; si la densité change ensuite (zoom du navigateur), il multiplie ce niveau
  // par le rapport des densités, sans réappliquer le plafond. Seule exception : l'affichage de diagnostic ouvert par
  // « ?diagnostic=densite-complete » (version 0.3.88) calcule le viseur à la densité complète de l'écran, pour charger
  // le processeur graphique quand on compare deux versions par leur débit (diagnosticModel.ts) ; sans limite donnée,
  // Babylon.js 9.35.0 prend la densité de l'écran (abstractEngine.pure.js, constructeur).
  const limitDeviceRatio = fullDensityRequested(window.location.search) ? undefined : MAX_DEVICE_RATIO;
  let engine: Engine | null = null;
  try {
    // canvasTabIndex 0 : le viseur prend le focus à sa place dans la page, après l'en-tête, et non en premier (constat
    // INT-08 de l'audit, première étape, version 0.4.7 ; critère « Focus Order » du WCAG 2.2 [wcag-22-focus-order]).
    // Babylon.js 9.35.0 lui donne sinon tabindex="1", qui le met
    // avant tout le reste dans l'ordre de tabulation (abstractEngine.pure.js, valeur par défaut, et
    // DeviceInput/webDeviceInputSystem.js, qui la pose sur le canevas).
    const created = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, limitDeviceRatio, canvasTabIndex: 0 }, true);
    engine = created;
    // Perte du contexte WebGL (constat COD-12 de l'audit, version 0.3.70) : Babylon.js reprend seul le rendu à la
    // restauration, si le navigateur la fait ; entre les deux, le viseur restait figé sans rien dire. Branchée dès la
    // création du moteur depuis la version 0.4.4 : branchée en fin de démarrage, elle ne disait rien d'une perte
    // pendant le démarrage. Depuis la version 0.4.15 (demande de Julien du 23 novembre 2026), une perte pendant le
    // chargement de la scène arrête le démarrage : sur l'iPhone de la capture, le message de la perte en cours d'usage,
    // qui dit que l'affichage peut reprendre seul, s'affichait, puis Babylon.js levait « Unable to create texture »
    // (`gl.createTexture()` rendant null, Engines/thinEngine.pure.js, `_createTexture`), et le viseur restait vide. Une
    // texture dont la création a échoué manque à la scène même si le contexte est restauré ensuite.
    // L'événement de la perte arrive par une tâche, après la fin du code en cours : une perte pendant startSimulator
    // est vue ici après lui, ou par l'exception qu'il rattrape (startContextLost).
    // Dans Chromium, la page faisant rendre null aux fonctions de création comme ces branches de WebKit, l'exception
    // de Babylon.js arrive avant l'événement, et fait échouer le chargement d'un fichier : le démarrage s'arrête alors
    // aussi après l'échec d'un fichier (loadError), tant que le chargement n'est pas fini, et ready.catch, plus bas,
    // regarde le contexte.
    engine.onContextLostObservable.add(() => {
      contextLost = true;
      if (sceneLoading && (statusKey === "loading" || statusKey === "loadError")) failStart("startContextLostLoading", created);
      else renderStatus();
    });
    engine.onContextRestoredObservable.add(() => {
      contextLost = false;
      renderStatus();
    });
    // Contexte déjà perdu à la création du moteur : toutes les capacités lues valent « non », et le démarrage
    // échouerait à la création de la scène (navigateurs dont `createBuffer()` rend null sur un contexte perdu).
    if (engine._gl.isContextLost()) {
      failStart("startContextLost", engine);
      return;
    }
    startSimulator(engine);
  } catch (error) {
    console.error(error);
    report("problemError", String(error));
    failStart(engine !== null && engine._gl.isContextLost() ? "startContextLost" : "startError", engine);
  }
}

/**
 * Démarrage arrêté (version 0.4.4) : le message dit que le simulateur n'a pas pu démarrer, avec la version du site et
 * « Recharger », suivi de la ligne des problèmes ; le canevas, le panneau du boîtier, dont les boutons n'ont pas reçu
 * leur texte, et les éléments du viseur que le démarrage n'a pas remplis sont masqués (style.css, body.start-failed) ;
 * l'affichage de diagnostic, s'il a été créé, reste sous eux (version 0.4.15). La boucle de rendu est arrêtée. Rien
 * d'autre n'est libéré : arrêté après la création de la scène (pendant son chargement, depuis la version 0.4.15), le
 * démarrage laisse le chargement aller au bout, et les minuteries des objets déjà créés tourner (autofocus,
 * indicateur d'équilibre, vue de dessus, affichage de diagnostic).
 *
 * L'écouteur de restauration de Babylon.js 9.35.0 est retiré : Babylon.js demande au navigateur de restaurer un
 * contexte perdu (`evt.preventDefault()`, Engines/thinEngine.pure.js, l. 186), et WebKit essaie de le faire ; mais sur un moteur
 * créé avec un contexte déjà perdu, sa remise en état lève une TypeError (« Cannot set properties of undefined
 * (setting 'active') », `disableAttributeByIndex`, l. 1534 : les pointeurs des attributs, l. 265-267, n'ont pas été
 * créés, MAX_VERTEX_ATTRIBS valant null sur un contexte perdu), que la ligne des problèmes écrivait sous le message
 * (relecture de la version 0.4.4). Le démarrage arrêté ne se sert pas de la restauration.
 */
function failStart(key: StartFailure, engine: Engine | null): void {
  engine?.stopRenderLoop();
  const onRestored = (engine as unknown as { _onContextRestored?: (event: Event) => void } | null)?._onContextRestored;
  if (onRestored) canvas.removeEventListener("webglcontextrestored", onRestored);
  statusKey = key;
  document.body.classList.add("start-failed");
  // L'affichage de diagnostic, inséré avant l'écran de revue, passe sous la ligne des problèmes : le message reste en
  // haut (version 0.4.15).
  const view = document.getElementById("diagnostic-view");
  if (view) diagnostic.after(view);
  applyTexts();
}

/** Démarrage du simulateur sur un moteur dont le contexte n'est pas perdu (version 0.4.4 : avant, dans main). */
function startSimulator(engine: Engine): void {
  // Capacités de rendu en flottants (constat ARC-13 de l'audit, version 0.3.88) : la photo et l'autofocus en ont besoin,
  // et Babylon.js crée leurs textures sans vérifier qu'il peut y rendre. Sans elles, la photo sortait presque noire, avec
  // sa légende ordinaire, et l'autofocus ne voyait plus les sujets, sans aucun message. Le message le dit dès le
  // démarrage, et ui/shutter.ts grise le déclencheur et refuse tout calcul. Aucun repli n'est écrit (décision D24 en
  // attente).
  const missingFloat = missingFloatRender(engine.getCaps());
  if (missingFloat.length > 0) report("problemFloatRender", floatRenderMessage(missingFloat));
  const { scene, camera, ready, filesSettled, time, subjects, eye } = createScene(engine, canvas);
  // Serveur de développement seulement (absent du site construit) : accès pour les mesures sur la scène.
  if (import.meta.env.DEV) {
    void import("@babylonjs/core/Culling/ray");
    Object.assign(window, { __tutophoto: { scene, camera, time } });
  }
  const noise = new ViewfinderNoise(scene, camera, (message) => report("problemNoise", message));
  // Magasin de réglages (camera/settings.ts, version 0.4.9) : relit la mémoire du navigateur ; le panneau, l'autofocus,
  // le déclencheur et l'écran de revue y lisent les réglages.
  const settings = new SettingsStore(browserStorage());
  cameraPanel = new CameraPanel(
    engine,
    scene,
    camera,
    {
      panel: element("camera-panel"),
      frame: element("frame"),
      grid: element("frame-grid"),
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
      exposureDialog: element<HTMLDialogElement>("exposure-dialog"),
      afBadge: element("af-badge"),
      focusMarker: element("focus-marker"),
      afCoverage: element("af-coverage"),
      focusHint: element("focus-hint"),
    },
    noise,
    settings,
  );
  const panel = cameraPanel;
  const ground = { eyeHeight: EYE_HEIGHT, domeRadius: DOME_RADIUS };
  const autofocus = new Autofocus(scene, camera, ground, settings, () => panel.focusArea(), subjects);
  panel.attachAutofocus(autofocus);
  // Affichage de diagnostic (constat ARC-06 de l'audit, version 0.3.88) : seulement avec « ?diagnostic » dans l'adresse ;
  // créé après l'autofocus (ui/diagnosticView.ts).
  if (diagnosticRequested(window.location.search)) new DiagnosticView(engine, scene, canvas.parentElement ?? document.body);
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
  challenges = new ChallengePicker(
    { button: element<HTMLButtonElement>("challenge-button"), dialog: element<HTMLDialogElement>("challenge-dialog") },
  );
  shutter = new Shutter(
    engine,
    scene,
    camera,
    time,
    ground,
    cameraPanel,
    settings,
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
      reviewBulletin: element("review-bulletin"),
      covered: [element("header"), element("camera-panel"), element("top-view"), element("balance")],
    },
    () => engine.runRenderLoop(render),
    noise,
    dof,
    autofocus,
    subjects,
    () => challenges?.current() ?? null,
    () => balance?.lastNoise() ?? null,
    // Affichages de l'écran de revue (version 0.3.57) : photo seule, histogrammes, hautes lumières.
    new ReviewInfo(
      {
        review: element("review"),
        image: element<HTMLImageElement>("review-image"),
        highlights: element<HTMLCanvasElement>("review-highlights"),
        row: element("review-info-row"),
        button: element<HTMLButtonElement>("review-info"),
        histograms: element("review-histograms"),
        clipping: element("review-clipping"),
        details: element("review-info-details"),
        limits: element("review-info-limits"),
        note: element("review-info-note"),
      },
      settings,
    ),
    () => ({ failed: statusKey === "loadError", stuck: sceneStuck }),
    missingFloat,
  );
  balance = new BalanceIndicator(
    engine,
    scene,
    camera,
    time,
    autofocus,
    panel,
    subjects,
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
  );
  panel.attachBalance(balance);
  topView = new TopView(
    camera,
    time,
    eye,
    autofocus,
    panel,
    subjects,
    {
      root: element("top-view"),
      toggle: element<HTMLButtonElement>("top-view-toggle"),
      reset: element<HTMLButtonElement>("top-view-reset"),
      map: document.getElementById("top-view-map") as unknown as SVGSVGElement,
      note: element("top-view-note"),
    },
  );
  ready
    .then((waiting) => {
      sceneLoading = false;
      // Un démarrage arrêté après la création de la scène garde son message (version 0.4.4).
      if (statusKey !== "loading") return;
      statusKey = null;
      if (waiting.length > 0) report("problemLate", waiting.slice(0, 5).join(", "));
    })
    .catch((error: unknown) => {
      console.error(error);
      void filesSettled.then(() => {
        sceneLoading = false;
      });
      if (statusKey !== "loading") return;
      // Fichier en échec parce que le contexte est perdu (version 0.4.15) : sa texture n'a pas pu être créée ; le
      // démarrage s'arrête, au lieu de dire le fichier non reçu.
      if (engine._gl.isContextLost()) {
        failStart("startContextLostLoading", engine);
        return;
      }
      statusKey = "loadError";
      // Chemin relatif au dossier de la scène (relecture du Sujet 10) : cinq modèles ont un scene.bin, et le nom seul
      // ne disait pas lequel manquait.
      if (error instanceof SceneFileError) failedFile = error.file;
      void filesSettled
        .then(() => whenSceneReady(scene))
        .catch(() => {
          sceneStuck = true;
        });
    })
    .finally(applyTexts);
  engine.runRenderLoop(render);
  // La taille du canevas change aussi sans que la fenêtre change : quand le panneau du boîtier passe sur
  // plusieurs lignes, par exemple après l'affichage des textes. Sans redimensionnement du moteur, le rendu
  // gardait l'ancienne taille, étiré à l'affichage, et le cadre perdait les proportions du capteur.
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => engine.resize()).observe(canvas);
  window.addEventListener("resize", () => engine.resize());
}
