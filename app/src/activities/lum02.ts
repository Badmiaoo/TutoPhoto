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
// Calcul, en vue de côté (rayons en ligne droite, triangles semblables) : activities/lum02Model.ts, sans page, où les
// tests rapides le vérifient (version 0.3.87).
// Simplifications : coupe en 2D d'une source uniforme ; la largeur de la pénombre suit les triangles semblables,
// mais le dégradé d'une source ronde réelle n'a pas exactement cette forme. Un point du mur que rien ne cache est
// éclairé pareil à toute distance, alors que doubler la distance divise l'éclairement par quatre, à moins de 1 %
// près quand la source mesure moins du cinquième de sa distance au sujet [wikipedia-inverse-square-law] ; l'ombre pleine est noire, sans la lumière que renvoient les surfaces voisines,
// murs et plafond compris [tiffen-lowel-soft-light]. La page le dit (texte « Calcul »). Les préréglages sont des
// exemples choisis pour TutoPhoto, pas des mesures.
//   https://en.wikipedia.org/w/index.php?title=Inverse-square_law&oldid=1384166303

import "./lum02.css";
import { frenchSpaces } from "../frenchSpaces";
import { OBJECT_CM, PRESETS, WALL_GAP_CM, WALL_HALF_CM, litFraction, penumbraReading, rayOnWall, shadow, type Preset } from "./lum02Model";

const WALL_SAMPLES = 160;
const NS = "http://www.w3.org/2000/svg";

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
      items.push(svgNode("line", { x1: 0, y1: -s, x2: L, y2: -rayOnWall(s, o, d1), class: "act-ray" }));
    }
  }
  // Éclairement du mur dessiné, de −WALL_HALF_CM à +WALL_HALF_CM, point par point.
  const step = (2 * WALL_HALF_CM) / WALL_SAMPLES;
  for (let i = 0; i < WALL_SAMPLES; i++) {
    const y = -WALL_HALF_CM + (i + 0.5) * step;
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
  const reading = penumbraReading(d, d1);
  const beyond = reading.beyondWall ? t.beyondWall : "";
  el("act-size-value").textContent = t.cm(d);
  el("act-distance-value").textContent = t.cm(d1);
  el("act-angle").textContent = frenchSpaces(t.angle(decimal(r.angleDeg, 1)));
  el("act-penumbra").textContent = frenchSpaces((reading.wholeShadow ? t.penumbraAll(decimal(reading.cm, 1)) : t.penumbra(decimal(reading.cm, 1))) + beyond);
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
      // La réponse est dans une zone vivante, présente dans la page avant la réponse, pour être annoncée sans prendre
      // le focus (constat INT-15 de l'audit, point 7, version 0.4.7 ; critère « Status Messages » du WCAG 2.2,
      // [wcag-22-status-messages]).
      const live = document.createElement("div");
      live.setAttribute("role", "status");
      live.append(feedback);
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
      block.append(p, answers, live);
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
