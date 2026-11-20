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
// - bord extérieur de la pénombre, depuis l'axe : (H × L + D × d₂) / (2 d₁) ; le mur dessiné va de −100 à +100 cm, et
//   ce bord le dépasse quand l'objet est tout près d'une grande source (constat FMA-10 de l'audit) ;
// - sans ombre pleine, la pénombre couvre toute l'ombre, sur 2 × ce bord : H × L / d₁ + D × d₂ / d₁.
// Simplifications : coupe en 2D d'une source uniforme ; la largeur de la pénombre suit les triangles semblables,
// mais le dégradé d'une source ronde réelle n'a pas exactement cette forme. Un point du mur que rien ne cache est
// éclairé pareil à toute distance, alors que doubler la distance divise l'éclairement par quatre, à moins de 1 %
// près quand la source mesure moins du cinquième de sa distance au sujet [wikipedia-inverse-square-law] ; l'ombre pleine est noire, sans la lumière que renvoient les surfaces voisines,
// murs et plafond compris [tiffen-lowel-soft-light]. La page le dit (texte « Calcul »). Les préréglages sont des
// exemples choisis pour TutoPhoto, pas des mesures.
//   https://en.wikipedia.org/w/index.php?title=Inverse-square_law&oldid=1384166303

import "./lum02.css";
import { frenchSpaces } from "../frenchSpaces";

/** Hauteur de l'objet et distance objet–mur, en cm (choix de TutoPhoto). */
const OBJECT_CM = 30;
const WALL_GAP_CM = 50;
const WALL_SAMPLES = 160;
/** Demi-hauteur du mur dessiné, en cm. */
const WALL_HALF_CM = 100;
const NS = "http://www.w3.org/2000/svg";

const PRESETS = {
  lamp: { size: 3, distance: 100 },
  window: { size: 120, distance: 200 },
  reflector: { size: 80, distance: 80 },
} as const;
type Preset = keyof typeof PRESETS;

const TEXT = {
  fiche: "Fiche LUM-02",
  title: "Lumière dure ou douce : l'ombre",
  intro:
    "Vue de côté : une source de lumière à gauche, un objet au milieu, un mur à droite. Change la taille de la source et sa distance à l'objet, et regarde le bord de l'ombre sur le mur.",
  scene: "Schéma vu de côté : source, objet et ombre sur le mur",
  legend: "Sur le mur : ombre pleine au centre, pénombre en dégradé sur les bords, là où la source n'est cachée qu'en partie.",
  legendNoUmbra: "Sur le mur : pas d'ombre pleine, seulement une pénombre en dégradé, là où la source n'est cachée qu'en partie.",
  labelSource: "source",
  labelObject: "objet",
  labelWall: "mur",
  size: "Taille de la source :",
  distance: "Distance source–objet :",
  presets: "Exemples :",
  lamp: "Petite lampe",
  window: "Grande fenêtre",
  reflector: "Réflecteur",
  angle: (deg: string) => `Taille apparente de la source, vue de l'objet : ${deg}°`,
  penumbra: (cm: string) => `Pénombre sur le mur : ${cm} cm de chaque côté de l'ombre`,
  penumbraAll: (cm: string) => `Pénombre sur le mur : toute l'ombre, sur ${cm} cm de haut`,
  beyondWall: " (au-delà du mur dessiné)",
  umbra: (cm: string) => `Ombre pleine : ${cm} cm de haut`,
  noUmbra: "Pas d'ombre pleine : la source, vue du mur, déborde l'objet de toutes parts.",
  calc: `Calcul (triangles semblables) : pénombre = taille de la source × distance objet–mur ÷ distance source–objet. Ici, l'objet mesure ${OBJECT_CM} cm et le mur est à ${WALL_GAP_CM} cm derrière. Coupe en 2D : la largeur de la pénombre est juste, la forme exacte du dégradé est simplifiée ; les exemples sont des valeurs choisies pour l'activité. Le schéma ne montre que la part de la source vue de chaque point du mur : il ne dit pas que la lampe éclaire plus fort de près (pour une source petite devant sa distance, deux fois plus loin donne quatre fois moins de lumière), ni que la pièce renvoie de la lumière dans l'ombre, qu'il laisse noire.`,
  sources:
    "Sources : guide Lowel de Tiffen « Understanding Soft Light » ; Art Adams, ProVideo Coalition, 27 décembre 2011 ; Wikipedia, « Umbra, penumbra and antumbra », révision 1379008615, et « Inverse-square law », révision 1384166303 (sources secondaires). Détail dans la fiche LUM-02.",
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
} as const;

const el = <T extends Element = HTMLElement>(id: string) => document.getElementById(id) as unknown as T;
const size = el<HTMLInputElement>("act-size");
const distance = el<HTMLInputElement>("act-distance");
const svg = el<SVGSVGElement>("act-scene");

/** Grandeurs de l'ombre pour une source de taille d (cm) à la distance d1 (cm) de l'objet. */
export function shadow(d: number, d1: number): { angleDeg: number; penumbraCm: number; umbraCm: number; outerCm: number } {
  const L = d1 + WALL_GAP_CM;
  return {
    angleDeg: (2 * Math.atan(d / (2 * d1)) * 180) / Math.PI,
    penumbraCm: (d * WALL_GAP_CM) / d1,
    umbraCm: Math.max(0, (OBJECT_CM * L) / d1 - (d * WALL_GAP_CM) / d1),
    // Bord extérieur de la pénombre, depuis l'axe.
    outerCm: (OBJECT_CM * L + d * WALL_GAP_CM) / (2 * d1),
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
  return text.replace(".", ",");
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
  const t = TEXT;
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
  // Source : hauteur à l'échelle (c'est elle que l'activité fait changer), largeur fixe de 10 cm, et un cadre sombre
  // de 1,5 px à l'écran tracé autour d'elle, à l'extérieur, pour qu'une lampe de 1 cm reste visible et jaune
  // (constat INT-02 de l'audit ; un trait centré sur le bord couvrait le jaune d'une source de 2 px : relecture, R1).
  const unit = 500 / (svg.getBoundingClientRect().width || 500);
  const frame = 1.5 * unit;
  items.push(svgNode("rect", { x: -10 - frame, y: -d / 2 - frame, width: 10 + 2 * frame, height: d + 2 * frame, class: "act-source-frame" }));
  items.push(svgNode("rect", { x: -10, y: -d / 2, width: 10, height: d, class: "act-source" }));
  // Noms écrits dans le dessin, à 13 px à l'écran quelle que soit la largeur du schéma : « objet » en haut, au-dessus
  // de l'objet ; « source » sous la source, et sous le bas de l'objet pour ne pas le toucher, ou en bas du schéma pour
  // une grande source ; « mur » en haut, à droite du mur, ou en bas à sa gauche quand la place manque à droite
  // (largeur mesurée après le tracé : elle dépend de la police).
  const font = 13 * unit;
  const top = -110 + font + 2;
  const bottom = 110 - 0.3 * font - 2;
  const label = (x: number, y: number, anchor: string, text: string) => {
    const node = svgNode("text", { x, y, "text-anchor": anchor, "font-size": font, "stroke-width": 0.25 * font, class: "act-label" });
    node.textContent = text;
    return node;
  };
  const wallLabel = label(L + 18, top, "start", t.labelWall);
  items.push(label(-16, Math.min(bottom, Math.max(d / 2, OBJECT_CM / 2) + 1.2 * font), "start", t.labelSource), label(d1, top, "middle", t.labelObject), wallLabel);
  svg.replaceChildren(...items);
  if (L + 18 + wallLabel.getComputedTextLength() > 478) {
    wallLabel.setAttribute("x", String(L - 4));
    wallLabel.setAttribute("y", String(bottom));
    wallLabel.setAttribute("text-anchor", "end");
  }
  svg.setAttribute("aria-label", t.scene);

  const r = shadow(d, d1);
  const umbra = r.umbraCm > 0;
  const beyond = r.outerCm > WALL_HALF_CM ? t.beyondWall : "";
  el("act-size-value").textContent = t.cm(d);
  el("act-distance-value").textContent = t.cm(d1);
  el("act-angle").textContent = frenchSpaces(t.angle(decimal(r.angleDeg, 1)));
  el("act-penumbra").textContent = frenchSpaces((umbra ? t.penumbra(decimal(r.penumbraCm, 1)) : t.penumbraAll(decimal(2 * r.outerCm, 1))) + beyond);
  el("act-umbra").textContent = frenchSpaces(umbra ? t.umbra(decimal(r.umbraCm, 1)) : t.noUmbra);
  el("act-legend").textContent = frenchSpaces(umbra ? t.legend : t.legendNoUmbra);
}

function renderQuiz(): void {
  const t = TEXT;
  const quiz = el("act-quiz");
  quiz.replaceChildren(
    ...t.questions.map((question, qi) => {
      const block = document.createElement("div");
      block.className = "act-question";
      const p = document.createElement("p");
      p.textContent = frenchSpaces(question.q);
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
        button.textContent = frenchSpaces(answer);
        button.addEventListener("click", () => {
          const ok = ai === question.correct;
          feedback.textContent = frenchSpaces((ok ? t.right : t.wrong) + question.why);
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

function applyTexts(): void {
  const t = TEXT;
  document.title = `LUM-02 · ${frenchSpaces(t.title)} · TutoPhoto`;
  el("act-fiche").textContent = t.fiche;
  el("act-title").textContent = frenchSpaces(t.title);
  el("act-intro").textContent = frenchSpaces(t.intro);
  el("act-size-label").textContent = frenchSpaces(t.size);
  el("act-distance-label").textContent = frenchSpaces(t.distance);
  el("act-presets-label").textContent = frenchSpaces(t.presets);
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-preset]")) button.textContent = t[button.dataset.preset as Preset];
  el("act-calc").textContent = frenchSpaces(t.calc);
  el("act-sources").textContent = frenchSpaces(t.sources);
  renderQuiz();
  draw();
}

size.addEventListener("input", draw);
window.addEventListener("resize", draw);
distance.addEventListener("input", draw);
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-preset]")) {
  button.addEventListener("click", () => {
    const preset = PRESETS[button.dataset.preset as Preset];
    size.value = String(preset.size);
    distance.value = String(preset.distance);
    draw();
  });
}
applyTexts();
