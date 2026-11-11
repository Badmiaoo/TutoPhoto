// Activité interactive de LUM-02 (lumière dure ou douce), en schéma 2D : décision de Julien du 11 novembre 2026
// (docs/propositions.md, option A). Le simulateur de lumière reste prévu en V2.
//
// Ce que disent les sources lues :
// - une source est douce quand elle paraît grande par rapport au sujet ; reculer une source la rend plus dure ; un
//   réflecteur devient lui-même la source [tiffen-lowel-soft-light] ; le bord de l'ombre s'assombrit peu à peu quand
//   l'objet cache une grande source [pvc-adams-soft-light] ;
// - la pénombre est la zone où la source n'est cachée qu'en partie ; avec une source ponctuelle, il n'y a qu'une
//   ombre pleine [wikipedia-umbra-penumbra].
//   https://tiffen.reamaze.com/kb/lowel-guides/foundations-of-lighting-understanding-soft-light
//   https://www.provideocoalition.com/lighting_strategies_what_makes_soft_lights_cast_soft_shadows/
//   https://en.wikipedia.org/w/index.php?title=Umbra,_penumbra_and_antumbra&oldid=1379008615
//
// Calcul, en vue de côté (rayons en ligne droite, triangles semblables). Source de hauteur D à x = 0, objet de
// hauteur H à x = d₁, mur à x = d₁ + d₂, tous centrés sur le même axe. Un rayon qui part du point s de la source et
// rase le bord o de l'objet frappe le mur en y = s + (o − s) × (d₁ + d₂) / d₁. D'où, sur le mur :
// - largeur de la pénombre, de chaque côté : D × d₂ / d₁ ;
// - hauteur de l'ombre pleine : H × (d₁ + d₂) / d₁ − D × d₂ / d₁, nulle si la source déborde l'objet ;
// - éclairement d'un point du mur : part de la source qu'il voit, l'objet cachant les points s compris entre
//   (o − y d₁ / L) × L / d₂ pour o = bas et haut de l'objet (L = d₁ + d₂) ;
// - taille apparente de la source vue de l'objet : 2 × atan(D / (2 d₁)).
// Simplifications : coupe en 2D d'une source uniforme ; la largeur de la pénombre suit les triangles semblables,
// mais le dégradé d'une source ronde réelle n'a pas exactement cette forme. Les préréglages sont des exemples
// choisis pour TutoPhoto, pas des mesures.

import "./lum02.css";
import { initialLang, rememberLang, type Lang } from "../i18n";

/** Hauteur de l'objet et distance objet–mur, en cm (choix de TutoPhoto). */
const OBJECT_CM = 30;
const WALL_GAP_CM = 50;
const WALL_SAMPLES = 160;
const NS = "http://www.w3.org/2000/svg";

const PRESETS = {
  lamp: { size: 3, distance: 100 },
  window: { size: 120, distance: 200 },
  reflector: { size: 80, distance: 80 },
} as const;
type Preset = keyof typeof PRESETS;

const TEXT = {
  fr: {
    switchLang: "English",
    fiche: "Fiche LUM-02",
    title: "Lumière dure ou douce : l'ombre",
    intro:
      "Vue de côté : une source de lumière à gauche, un objet au milieu, un mur à droite. Change la taille de la source et sa distance à l'objet, et regarde le bord de l'ombre sur le mur.",
    scene: "Schéma vu de côté : source, objet et ombre sur le mur",
    legend: "Sur le mur : ombre pleine au centre, pénombre en dégradé sur les bords, là où la source n'est cachée qu'en partie.",
    size: "Taille de la source :",
    distance: "Distance source–objet :",
    presets: "Exemples :",
    lamp: "Petite lampe",
    window: "Grande fenêtre",
    reflector: "Réflecteur",
    angle: (deg: string) => `Taille apparente de la source, vue de l'objet : ${deg}°`,
    penumbra: (cm: string) => `Pénombre sur le mur : ${cm} cm de chaque côté de l'ombre`,
    umbra: (cm: string) => `Ombre pleine : ${cm} cm de haut`,
    noUmbra: "Pas d'ombre pleine : la source, vue du mur, déborde l'objet de toutes parts.",
    calc: `Calcul (triangles semblables) : pénombre = taille de la source × distance objet–mur ÷ distance source–objet. Ici, l'objet mesure ${OBJECT_CM} cm et le mur est à ${WALL_GAP_CM} cm derrière. Coupe en 2D : la largeur de la pénombre est juste, la forme exacte du dégradé est simplifiée ; les exemples sont des valeurs choisies pour l'activité.`,
    sources:
      "Sources : guide Lowel de Tiffen « Understanding Soft Light » ; Art Adams, ProVideo Coalition, 27 décembre 2011 ; Wikipedia, « Umbra, penumbra and antumbra », révision 1379008615 (source secondaire). Détail dans la fiche LUM-02.",
    cm: (v: number) => `${v} cm`,
    questions: [
      {
        q: "Ta lampe donne une ombre trop dure. Sans changer de lampe, que fais-tu pour l'adoucir ?",
        answers: ["Je la rapproche de l'objet", "Je l'éloigne de l'objet", "Rien : seule la taille de la lampe compte"],
        correct: 0,
        why: "Rapprochée, la lampe paraît plus grande vue de l'objet : la pénombre s'élargit et le bord de l'ombre s'adoucit. Reculer une source la rend plus dure (Tiffen). Essaie avec le curseur de distance.",
      },
      {
        q: "Tu tournes la lampe vers un grand carton blanc, qui renvoie sa lumière sur l'objet. Que devient l'ombre ?",
        answers: ["Plus douce", "Plus dure", "Pareille"],
        correct: 0,
        why: "Le carton devient lui-même la source, bien plus grande que l'ampoule : la lumière est plus douce (Tiffen). Essaie l'exemple « Réflecteur ».",
      },
    ],
    right: "Juste. ",
    wrong: "Pas tout à fait. ",
  },
  en: {
    switchLang: "Français",
    fiche: "LUM-02 page",
    title: "Hard or soft light: the shadow",
    intro:
      "Side view: a light source on the left, an object in the middle, a wall on the right. Change the size of the source and its distance to the object, and look at the edge of the shadow on the wall.",
    scene: "Side-view diagram: source, object and shadow on the wall",
    legend: "On the wall: full shadow in the middle, penumbra fading at the edges, where the source is only partly hidden.",
    size: "Source size:",
    distance: "Source–object distance:",
    presets: "Examples:",
    lamp: "Small lamp",
    window: "Large window",
    reflector: "Reflector",
    angle: (deg: string) => `Apparent size of the source, seen from the object: ${deg}°`,
    penumbra: (cm: string) => `Penumbra on the wall: ${cm} cm on each side of the shadow`,
    umbra: (cm: string) => `Full shadow: ${cm} cm high`,
    noUmbra: "No full shadow: seen from the wall, the source extends beyond the object on all sides.",
    calc: `Calculation (similar triangles): penumbra = source size × object–wall distance ÷ source–object distance. Here, the object is ${OBJECT_CM} cm tall and the wall is ${WALL_GAP_CM} cm behind it. 2D cross-section: the width of the penumbra is right, the exact shape of the gradient is simplified; the examples are values chosen for the activity.`,
    sources:
      "Sources: Tiffen's Lowel guide “Understanding Soft Light”; Art Adams, ProVideo Coalition, 27 December 2011; Wikipedia, “Umbra, penumbra and antumbra”, revision 1379008615 (secondary source). Details on the LUM-02 page.",
    cm: (v: number) => `${v} cm`,
    questions: [
      {
        q: "Your lamp gives too hard a shadow. Without changing lamps, what do you do to soften it?",
        answers: ["Move it closer to the object", "Move it further away", "Nothing: only the size of the lamp matters"],
        correct: 0,
        why: "Closer, the lamp looks bigger from the object: the penumbra widens and the edge of the shadow softens. Moving a source back makes it harder (Tiffen). Try it with the distance slider.",
      },
      {
        q: "You turn the lamp towards a large white card, which bounces its light onto the object. What happens to the shadow?",
        answers: ["Softer", "Harder", "The same"],
        correct: 0,
        why: "The card itself becomes the source, much larger than the bulb: the light is softer (Tiffen). Try the “Reflector” example.",
      },
    ],
    right: "Right. ",
    wrong: "Not quite. ",
  },
} as const;

const el = <T extends Element = HTMLElement>(id: string) => document.getElementById(id) as unknown as T;
const size = el<HTMLInputElement>("act-size");
const distance = el<HTMLInputElement>("act-distance");
const svg = el<SVGSVGElement>("act-scene");
let lang: Lang = initialLang();

/** Grandeurs de l'ombre pour une source de taille d (cm) à la distance d1 (cm) de l'objet. */
export function shadow(d: number, d1: number): { angleDeg: number; penumbraCm: number; umbraCm: number } {
  const L = d1 + WALL_GAP_CM;
  return {
    angleDeg: (2 * Math.atan(d / (2 * d1)) * 180) / Math.PI,
    penumbraCm: (d * WALL_GAP_CM) / d1,
    umbraCm: Math.max(0, (OBJECT_CM * L) / d1 - (d * WALL_GAP_CM) / d1),
  };
}

/** Part de la source visible depuis le point du mur à la hauteur y (cm), de 0 (ombre pleine) à 1 (plein éclairage). */
function litFraction(y: number, d: number, d1: number): number {
  const L = d1 + WALL_GAP_CM;
  const at = (o: number) => ((o - (y * d1) / L) * L) / WALL_GAP_CM;
  const lo = Math.max(-d / 2, at(-OBJECT_CM / 2));
  const hi = Math.min(d / 2, at(OBJECT_CM / 2));
  return 1 - Math.max(0, hi - lo) / d;
}

const decimal = (value: number, digits: number) => {
  const text = value.toFixed(digits);
  return lang === "fr" ? text.replace(".", ",") : text;
};

function svgNode<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

function draw(): void {
  const d = Number(size.value);
  const d1 = Number(distance.value);
  const L = d1 + WALL_GAP_CM;
  const t = TEXT[lang];
  // Échelle fixe, en cm : x de −20 à 480, y de −110 à 110 (y vers le haut, d'où le signe).
  svg.setAttribute("viewBox", "-20 -110 500 220");
  const items: SVGElement[] = [];
  // Rayons qui rasent les bords de l'objet, depuis le haut et le bas de la source.
  for (const s of [-d / 2, d / 2]) {
    for (const o of [-OBJECT_CM / 2, OBJECT_CM / 2]) {
      const yWall = s + ((o - s) * L) / d1;
      items.push(svgNode("line", { x1: 0, y1: -s, x2: L, y2: -yWall, class: "act-ray" }));
    }
  }
  // Éclairement du mur, point par point.
  const step = 200 / WALL_SAMPLES;
  for (let i = 0; i < WALL_SAMPLES; i++) {
    const y = -100 + (i + 0.5) * step;
    const lit = litFraction(y, d, d1);
    items.push(svgNode("rect", { x: L, y: -y - step / 2, width: 14, height: step + 0.2, fill: `rgb(${Math.round(40 + 215 * lit)} ${Math.round(40 + 205 * lit)} ${Math.round(40 + 160 * lit)})` }));
  }
  items.push(svgNode("line", { x1: L, y1: -105, x2: L, y2: 105, class: "act-wall" }));
  items.push(svgNode("rect", { x: d1 - 3, y: -OBJECT_CM / 2, width: 6, height: OBJECT_CM, class: "act-object" }));
  items.push(svgNode("rect", { x: -6, y: -d / 2, width: 6, height: d, class: "act-source" }));
  svg.replaceChildren(...items);
  svg.setAttribute("aria-label", t.scene);

  const r = shadow(d, d1);
  el("act-size-value").textContent = t.cm(d);
  el("act-distance-value").textContent = t.cm(d1);
  el("act-angle").textContent = t.angle(decimal(r.angleDeg, 1));
  el("act-penumbra").textContent = t.penumbra(decimal(r.penumbraCm, 1));
  el("act-umbra").textContent = r.umbraCm > 0 ? t.umbra(decimal(r.umbraCm, 1)) : t.noUmbra;
}

function renderQuiz(): void {
  const t = TEXT[lang];
  const quiz = el("act-quiz");
  quiz.replaceChildren(
    ...t.questions.map((question, qi) => {
      const block = document.createElement("div");
      block.className = "act-question";
      const p = document.createElement("p");
      p.textContent = question.q;
      const answers = document.createElement("p");
      answers.className = "act-answers";
      const feedback = document.createElement("p");
      feedback.className = "act-feedback";
      feedback.hidden = true;
      question.answers.forEach((answer, ai) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.question = String(qi);
        button.dataset.answer = String(ai);
        button.textContent = answer;
        button.addEventListener("click", () => {
          const ok = ai === question.correct;
          feedback.textContent = (ok ? t.right : t.wrong) + question.why;
          feedback.className = `act-feedback ${ok ? "passed" : "failed"}`;
          feedback.hidden = false;
        });
        answers.append(button);
      });
      block.append(p, answers, feedback);
      return block;
    }),
  );
}

function applyLang(): void {
  const t = TEXT[lang];
  document.documentElement.lang = lang;
  document.title = `LUM-02 · ${t.title} · TutoPhoto`;
  el<HTMLAnchorElement>("act-home").href = `../../?lang=${lang}`;
  const fiche = el<HTMLAnchorElement>("act-fiche");
  fiche.href = `../../fiches/${lang}/LUM-02.html`;
  fiche.textContent = t.fiche;
  el("act-lang").textContent = t.switchLang;
  el("act-title").textContent = t.title;
  el("act-intro").textContent = t.intro;
  el("act-legend").textContent = t.legend;
  el("act-size-label").textContent = t.size;
  el("act-distance-label").textContent = t.distance;
  el("act-presets-label").textContent = t.presets;
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-preset]")) button.textContent = t[button.dataset.preset as Preset];
  el("act-calc").textContent = t.calc;
  el("act-sources").textContent = t.sources;
  renderQuiz();
  draw();
}

size.addEventListener("input", draw);
distance.addEventListener("input", draw);
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-preset]")) {
  button.addEventListener("click", () => {
    const preset = PRESETS[button.dataset.preset as Preset];
    size.value = String(preset.size);
    distance.value = String(preset.distance);
    draw();
  });
}
el("act-lang").addEventListener("click", () => {
  lang = lang === "fr" ? "en" : "fr";
  rememberLang(lang);
  applyLang();
});
applyLang();
