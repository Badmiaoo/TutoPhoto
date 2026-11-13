// Affichages de l'écran de revue : photo seule, histogrammes, hautes lumières (MES-06, MES-07 ; version 0.3.57).
// Spécification : docs/specifications/histogramme-revue.md ; calculs : camera/histogram.ts.
//
// Ce que disent les manuels (pages lues le 12 novembre 2026) :
// - Nikon Z 6, « Photo Information » [nikon-z6-photo-information] : à la lecture, la commande DISP fait défiler des
//   pages d'information, dont « None (image only) », « RGB histogram » et « Highlights » ; avec la loupe, « The
//   histogram will be updated to show only the data for the portion of the image visible in the display. »
// - Sony A7 III, « Switching the screen display » [sony-a7iii-switching-display] : à la lecture, DISP fait défiler
//   « Display Info. → Histogram → No Disp. Info. » ; « If the image has an overexposed or underexposed area, the
//   corresponding section will blink on the histogram display (overexposed/underexposed warning). » ; « The settings
//   for playback are also applied in [Auto Review]. »
// - Les illustrations des deux manuels montrent la photo en vignette à côté de quatre histogrammes empilés.
//   https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html
//   https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001653116.html
//
// Dans TutoPhoto : un bouton « Infos » fait défiler trois affichages, comme la commande DISP. Le choix est mémorisé
// (clé tutophoto.revue) et vaut pour les photos suivantes, pour chaque vue d'une série et pour la loupe.
//
// Choix de TutoPhoto, non sourcés :
// - trois affichages seulement, dans l'ordre photo seule, histogrammes, hautes lumières ;
// - rythme du clignotement : une seconde en noir, une seconde visible (Sony écrit que la zone clignote, sans rythme ;
//   le manuel du Z 6 ne dit pas comment sa page « Highlights » marque les zones). Si le système demande de réduire les
//   animations, les zones restent en noir, sans clignoter ;
// - échelle verticale des histogrammes (camera/histogram.ts) ; avec les histogrammes, la photo est réduite pour
//   qu'ils tiennent sous elle, sauf avec la loupe, qui garde un pixel de l'image par pixel de l'écran.
//
// Non simulé : l'alerte des zones sous-exposées de Sony ; les autres pages d'information ; le réglage « Playback
// display options » du Z 6, qui choisit les pages affichées.

import { TONE_CHANNELS, TONE_LEVELS, columnHeights, type PhotoTones, type ToneChannel } from "../camera/histogram";
import { t, type Lang, type MessageKey } from "../i18n";

const STORAGE_KEY = "tutophoto.revue";
const DISPLAYS = ["photo", "histograms", "highlights"] as const;
type ReviewDisplay = (typeof DISPLAYS)[number];

const DISPLAY_KEYS: Record<ReviewDisplay, MessageKey> = {
  photo: "reviewDisplayPhoto",
  histograms: "reviewDisplayHistograms",
  highlights: "reviewDisplayHighlights",
};
const CHANNEL_KEYS: Record<ToneChannel, MessageKey> = {
  luminance: "histogramLuminance",
  red: "histogramRed",
  green: "histogramGreen",
  blue: "histogramBlue",
};
const SVG = "http://www.w3.org/2000/svg";
/** Hauteur du tracé d'un histogramme, en unités du dessin (largeur : une unité par colonne). */
const PLOT_HEIGHT = 100;

export interface ReviewInfoElements {
  review: HTMLElement;
  image: HTMLImageElement;
  /** Zones écrêtées, placées sur la photo. */
  highlights: HTMLCanvasElement;
  row: HTMLElement;
  button: HTMLButtonElement;
  histograms: HTMLElement;
  clipping: HTMLElement;
  details: HTMLElement;
  limits: HTMLElement;
  note: HTMLElement;
}

export class ReviewInfo {
  private display: ReviewDisplay;
  /** Mesures de l'image affichée (photo ou fenêtre de la loupe) ; null : rien à montrer. */
  private tones: PhotoTones | null = null;
  /** L'image affichée est une partie de la photo (loupe). */
  private part = false;
  /** Mesures dont les zones écrêtées sont dessinées, pour ne pas les redessiner. */
  private drawn: PhotoTones | null = null;
  private readonly plots: { channel: ToneChannel; svg: SVGSVGElement; path: SVGPathElement; caption: HTMLElement }[] = [];

  constructor(
    private readonly el: ReviewInfoElements,
    private lang: Lang,
  ) {
    this.display = this.restore();
    for (const channel of TONE_CHANNELS) {
      const figure = document.createElement("figure");
      figure.className = `histogram ${channel}`;
      const svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("viewBox", `0 0 ${TONE_LEVELS} ${PLOT_HEIGHT}`);
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("role", "img");
      svg.dataset.channel = channel;
      const path = document.createElementNS(SVG, "path");
      svg.append(path);
      const caption = document.createElement("figcaption");
      figure.append(svg, caption);
      el.histograms.append(figure);
      this.plots.push({ channel, svg, path, caption });
    }
    el.button.addEventListener("click", () => this.next());
    // Les zones écrêtées suivent la photo : sa place change avec la fenêtre, la langue, le bulletin, la loupe.
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => this.place());
      observer.observe(el.review);
      for (const child of Array.from(el.review.children)) if (child !== el.highlights) observer.observe(child);
    }
    window.addEventListener("resize", () => this.place());
    el.image.addEventListener("load", () => this.place());
    this.render();
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.render();
  }

  /** Image affichée par l'écran de revue : ses mesures, et si c'est une partie de la photo (loupe). Null : rien. */
  show(tones: PhotoTones | null, part = false): void {
    this.tones = tones;
    this.part = part;
    this.render();
  }

  /** Bouton « Infos » : affichage suivant, mémorisé. */
  private next(): void {
    this.display = DISPLAYS[(DISPLAYS.indexOf(this.display) + 1) % DISPLAYS.length];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ display: this.display }));
    } catch {
      // Sans stockage, le choix vaut pour la page en cours seulement.
    }
    this.render();
    // Ce qui vient de s'afficher sous la photo est amené dans l'écran de revue, qui défile.
    if (this.display !== "photo" && this.tones) {
      const review = this.el.review;
      const bottom = this.el.clipping.getBoundingClientRect().bottom - review.getBoundingClientRect().top + review.scrollTop + 8;
      if (bottom > review.scrollTop + review.clientHeight) review.scrollTop = bottom - review.clientHeight;
    }
  }

  private restore(): ReviewDisplay {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { display?: unknown } | null;
      const found = DISPLAYS.find((d) => d === saved?.display);
      // Une valeur inconnue vaut « photo », la valeur par défaut.
      if (found) return found;
    } catch {
      // Stockage indisponible ou illisible : photo seule.
    }
    return "photo";
  }

  private render(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
    const { el, tones } = this;
    el.button.textContent = `${tr("reviewInfo")}${tr("balanceColon")}${tr(DISPLAY_KEYS[this.display])}`;
    el.button.title = tr("reviewInfoTitle");
    el.limits.textContent = tr("reviewInfoLimits");
    el.note.textContent = tr("reviewInfoNote");
    for (const plot of this.plots) {
      plot.caption.textContent = tr(CHANNEL_KEYS[plot.channel]);
      plot.svg.setAttribute("aria-label", `${tr("histogramOf")} ${tr(CHANNEL_KEYS[plot.channel])}`);
    }
    // Sans mesures (photo qui n'a pas pu être calculée), ni bouton ni affichage.
    const display = tones ? this.display : "photo";
    el.row.hidden = !tones;
    el.histograms.hidden = display !== "histograms";
    el.clipping.hidden = display === "photo";
    el.details.hidden = display === "photo";
    // Avec les histogrammes, la photo est réduite pour qu'ils tiennent sous elle ; pas avec la loupe.
    el.review.classList.toggle("with-histograms", display === "histograms" && !this.part);
    const blinking = display === "highlights" && tones !== null && tones.mask !== null;
    el.highlights.hidden = !blinking;
    if (!tones) return;
    if (display === "histograms") {
      for (const plot of this.plots) this.plot(plot.svg, plot.path, tones.histograms[plot.channel]);
    }
    if (display !== "photo") el.clipping.textContent = this.clippingText(tones, display === "highlights");
    if (blinking) {
      if (this.drawn !== tones) this.draw(tones);
      this.place();
    }
  }

  /**
   * Tracé d'un histogramme : une marche par colonne, le noir à gauche. Les nombres de pixels sont aussi écrits dans
   * l'attribut data-columns, que lit la routine de test (scripts/test_app.cjs).
   */
  private plot(svg: SVGSVGElement, path: SVGPathElement, columns: Uint32Array): void {
    let d = `M0 ${PLOT_HEIGHT}`;
    columnHeights(columns).forEach((h, i) => (d += `V${(PLOT_HEIGHT * (1 - h)).toFixed(1)}H${i + 1}`));
    path.setAttribute("d", `${d}V${PLOT_HEIGHT}Z`);
    svg.dataset.columns = Array.from(columns).join(",");
  }

  /** « Pixels à la valeur maximale sur au moins une couche : 3,2 % de l'image », ou « Aucun pixel… ». */
  private clippingText(tones: PhotoTones, highlights: boolean): string {
    const tr = (key: MessageKey) => t(this.lang, key);
    const colon = tr("balanceColon");
    if (tones.clipped === 0) return highlights ? `${tr("clippedNone")}${colon}${tr("clippedNothingBlinks")}` : tr("clippedNone");
    const decimal = (value: number) => (this.lang === "fr" ? value.toFixed(1).replace(".", ",") : value.toFixed(1));
    const share = (100 * tones.clipped) / (tones.width * tones.height);
    // Une part non nulle ne s'écrit pas « 0,0 % ».
    const value = share < 0.1 ? `${tr("lessThan")} ${decimal(0.1)}` : decimal(share);
    // Espace insécable devant « % » en français : le nombre et son unité ne se séparent pas en fin de ligne.
    const percent = tr("percent").replace(" ", "\u00a0");
    const text = `${tr("clippedShare")}${colon}${value}${percent} ${tr(this.part ? "clippedOfPart" : "clippedOfImage")}`;
    if (!highlights) return text;
    const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return `${text}. ${tr(still ? "clippedStill" : "clippedBlink")}`;
  }

  /** Zones écrêtées en noir opaque, le reste transparent, à la définition de l'image mesurée. */
  private draw(tones: PhotoTones): void {
    const canvas = this.el.highlights;
    canvas.width = tones.width;
    canvas.height = tones.height;
    const context = canvas.getContext("2d");
    const mask = tones.mask;
    if (!context || !mask) return;
    const image = context.createImageData(tones.width, tones.height);
    const count = tones.width * tones.height;
    // Rouge, vert et bleu restent à 0 : seule l'opacité est posée.
    for (let p = 0; p < count; p++) if (mask[p >> 3] & (1 << (p & 7))) image.data[p * 4 + 3] = 255;
    context.putImageData(image, 0, 0);
    this.drawn = tones;
  }

  /**
   * Pose les zones écrêtées exactement sur la photo. L'image reste le premier élément de l'écran de revue, sans
   * conteneur (la feuille de style et la loupe en dépendent) : le calque est placé par ses coordonnées dans l'écran
   * de revue, avec lequel il défile.
   */
  private place(): void {
    const { review, image, highlights } = this.el;
    if (highlights.hidden) return;
    const outer = review.getBoundingClientRect();
    const inner = image.getBoundingClientRect();
    const style = highlights.style;
    style.left = `${inner.left - outer.left - review.clientLeft + review.scrollLeft}px`;
    style.top = `${inner.top - outer.top - review.clientTop + review.scrollTop}px`;
    style.width = `${inner.width}px`;
    style.height = `${inner.height}px`;
  }
}
