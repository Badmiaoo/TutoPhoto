// Pages statiques du site, produites après Vite : l'accueil (dist/index.html) et les fiches des notions et des
// situations (dist/fiches/fr|en/<identifiant>.html), d'après content/ (docs/contenus.md). Décisions de Julien du
// 11 novembre 2026 : accueil à la racine, simulateur sous simulateur/, fiches publiées avec un bandeau « en cours
// de relecture » tant qu'elles ne sont pas listées dans data/relecture.yaml, convertisseur écrit pour TutoPhoto.
//
// Le convertisseur ne reconnaît que ce qu'emploient les fiches : un titre de niveau 1 (« # ID · Titre »), des
// sections de niveau 2 aux titres de docs/contenus.md, des paragraphes, des listes à tirets, du gras (**…**) et des
// liens [texte](https://…). Tout le reste fait échouer la construction, comme un code de notion ou de situation
// sans fiche dans la même langue : une fiche mal formée se voit avant la publication.
//
// Les pages se lisent sans JavaScript ; un petit script retient la langue choisie, au même endroit que le simulateur
// (clé « tutophoto.lang », app/src/i18n.ts).

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(app, "..");
const dist = join(app, "dist");
const LANGS = ["fr", "en"];
// Ordre des domaines de scripts/referentiel.py (DOMAIN_ORDER).
const DOMAIN_ORDER = ["EXP", "MES", "BOI", "MAP", "NET", "MVT", "OPT", "LUM", "COU", "CMP", "PLA", "RET", "LEC"];
const ID = /\b(?:[A-Z]{3}-\d{2})\b/g;

const problems = [];
const fail = (msg) => problems.push(msg);

const TEXT = {
  fr: {
    tagline: "Simulateur photo pour débutants, avec un reflex ou un hybride.",
    status: (n, s) => `Version en construction : une scène de parc, ${s} situations et ${n} notions.`,
    situationDoor: "Je suis en situation",
    situationIntro: "Chaque situation donne sa recette de réglages, avec les raisons de chaque réglage et un plan B.",
    trainDoor: "Je m'entraîne",
    trainIntro: "Le simulateur : un boîtier virtuel dans la scène de parc, en entraînement libre ou avec un défi par situation.",
    trainSize: (mib) => `Il télécharge la scène 3D, ${mib} Mio.`,
    learnDoor: "J'apprends",
    learnIntro: "Chaque notion a une explication, ce qu'en montre le simulateur et un exercice.",
    openSimulator: "Ouvrir le simulateur",
    simulator: "Simulateur",
    reviewMark: "en relecture",
    reviewLegend: "Une fiche marquée « en relecture » n'a pas encore été vérifiée.",
    banner: "Fiche en cours de relecture : son contenu et ses sources n'ont pas encore été vérifiés par les relecteurs de TutoPhoto.",
    situations: "Situations",
    licences: "Licences",
    contentLicence: "Textes sous licence CC BY-SA 4.0, code sous licence MIT.",
    source: "Code source",
    switchLang: "English",
    anchors: { situation: "situation", train: "entrainement", learn: "apprendre" },
  },
  en: {
    tagline: "A photography simulator for beginners with a DSLR or a mirrorless camera.",
    status: (n, s) => `Work in progress: a park scene, ${s} situations and ${n} notions.`,
    situationDoor: "I'm in a situation",
    situationIntro: "Each situation gives its recipe of settings, with the reason for each setting and a plan B.",
    trainDoor: "I'm practising",
    trainIntro: "The simulator: a virtual camera in the park scene, for free practice or with one challenge per situation.",
    trainSize: (mib) => `It downloads the 3D scene, ${mib} MiB.`,
    learnDoor: "I'm learning",
    learnIntro: "Each notion has an explanation, what the simulator shows of it, and an exercise.",
    openSimulator: "Open the simulator",
    simulator: "Simulator",
    reviewMark: "under review",
    reviewLegend: "A page marked “under review” has not been checked yet.",
    banner: "This page is under review: its content and sources have not yet been checked by TutoPhoto's reviewers.",
    situations: "Situations",
    licences: "Licenses",
    contentLicence: "Texts under the CC BY-SA 4.0 license, code under the MIT license.",
    source: "Source code",
    switchLang: "Français",
    anchors: { situation: "situation", train: "practice", learn: "learn" },
  },
};

// Titres des sections, par type de fiche et par langue (docs/contenus.md).
const SECTIONS = {
  notions: {
    fr: ["Explication", "Simulateur", "Activité", "Exercice", "Situation réelle"],
    en: ["Explanation", "Simulator", "Activity", "Exercise", "Real-world situation"],
  },
  situations: {
    fr: ["Où, quand, quoi, pourquoi", "Recette", "Défi", "Notions"],
    en: ["Where, when, what, why", "Recipe", "Challenge", "Notions"],
  },
};

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// --- Données ------------------------------------------------------------------------------------------------------

/** Titres des domaines, lus dans le bloc « domain: » de chaque fichier du référentiel (format contrôlé par validate.py). */
function readDomains() {
  const dir = join(root, "data", "referentiel");
  const domains = {};
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".yaml") || name === "retired.yaml") continue;
    const text = readFileSync(join(dir, name), "utf8");
    const m = /^domain:\n  id: ([A-Z]{3})\n  title: \{fr: "([^"]+)", en: "([^"]+)"\}$/m.exec(text);
    if (!m) {
      fail(`data/referentiel/${name} : bloc « domain » non reconnu (id puis title sur une ligne)`);
      continue;
    }
    domains[m[1]] = { fr: m[2], en: m[3] };
  }
  return domains;
}

/** Fiches relues : data/relecture.yaml, une ligne par fiche et par langue, sous la forme exacte de son en-tête. */
function readReviewed() {
  const reviewed = new Set();
  const lines = readFileSync(join(root, "data", "relecture.yaml"), "utf8").split("\n");
  let seenKey = false;
  lines.forEach((line, i) => {
    if (line.trim() === "" || line.trimStart().startsWith("#")) return;
    if (line === "relues: []" || line === "relues:") {
      seenKey = true;
      return;
    }
    const m = /^  - \{fiche: ((?:[A-Z]{3})-\d{2}), langue: (fr|en), date: \d{4}-\d{2}-\d{2}\}$/.exec(line);
    if (seenKey && m) reviewed.add(`${m[2]}/${m[1]}`);
    else fail(`data/relecture.yaml:${i + 1} : ligne non reconnue`);
  });
  if (!seenKey) fail("data/relecture.yaml : clé « relues » absente");
  return reviewed;
}

/** Taille de la scène de parc, d'après son manifeste (somme des fichiers), en Mio. */
function sceneMib() {
  const manifest = JSON.parse(readFileSync(join(app, "public", "scenes", "parc", "scene.json"), "utf8"));
  const bytes = manifest.assets.flatMap((a) => a.files).reduce((sum, f) => sum + f.bytes, 0);
  return Math.round(bytes / 2 ** 20);
}

/** Lit les fiches d'une langue : { id: { kind, title, sections: [{ title, lines }] } }. */
function readFiches(lang) {
  const fiches = {};
  for (const kind of ["notions", "situations"]) {
    const dir = join(root, "content", lang, kind);
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".md")) continue;
      const id = name.slice(0, -3);
      const where = `content/${lang}/${kind}/${name}`;
      const lines = readFileSync(join(dir, name), "utf8").split("\n");
      const first = lines.findIndex((l) => l.trim() !== "");
      const h1 = /^# ((?:[A-Z]{3})-\d{2}) · (.+)$/.exec(lines[first] ?? "");
      if (!h1 || h1[1] !== id) {
        fail(`${where} : la première ligne doit être « # ${id} · Titre »`);
        continue;
      }
      const sections = [];
      lines.slice(first + 1).forEach((line, i) => {
        const at = `${where}:${first + 2 + i}`;
        if (line.startsWith("## ")) {
          const title = line.slice(3).trim();
          if (!SECTIONS[kind][lang].includes(title)) fail(`${at} : section « ${title} » non prévue par docs/contenus.md`);
          sections.push({ title, lines: [] });
        } else if (line.trim() === "" || sections.length > 0) {
          if (sections.length > 0) sections[sections.length - 1].lines.push({ line, at });
        } else {
          fail(`${at} : texte avant la première section`);
        }
      });
      fiches[id] = { kind, title: h1[2], sections };
    }
  }
  return fiches;
}

// --- Conversion --------------------------------------------------------------------------------------------------

/** Texte d'une ligne : gras, liens https, codes de fiches ; tout autre balisage est refusé. */
function inline(text, at, ctx) {
  const token = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let out = "";
  let last = 0;
  const plain = (segment, linkIds) => {
    if (/[*`[\]<>]|\]\(/.test(segment)) fail(`${at} : balisage non reconnu dans « ${segment.trim().slice(0, 60)} »`);
    const escaped = escapeHtml(segment);
    if (!linkIds) return escaped;
    return escaped.replace(ID, (id) => {
      if (id === ctx.self) return id;
      if (!ctx.fiches[id]) {
        fail(`${at} : ${id} n'a pas de fiche en ${ctx.lang}`);
        return id;
      }
      return `<a href="${id}.html">${id}</a>`;
    });
  };
  for (const m of text.matchAll(token)) {
    out += plain(text.slice(last, m.index), true);
    if (m[1] !== undefined) out += `<a href="${escapeHtml(m[2])}">${plain(m[1], false)}</a>`;
    else out += `<strong>${plain(m[3], true)}</strong>`;
    last = m.index + m[0].length;
  }
  return out + plain(text.slice(last), true);
}

/** Corps d'une section : paragraphes et listes à tirets. */
function block(lines, ctx) {
  const out = [];
  let paragraph = [];
  let list = [];
  const flush = () => {
    if (paragraph.length) out.push(`<p>${paragraph.map((p) => inline(p.line.trim(), p.at, ctx)).join(" ")}</p>`);
    if (list.length) out.push(`<ul>\n${list.map((l) => `<li>${inline(l.line.slice(2).trim(), l.at, ctx)}</li>`).join("\n")}\n</ul>`);
    paragraph = [];
    list = [];
  };
  for (const item of lines) {
    const { line, at } = item;
    if (line.trim() === "") flush();
    else if (line.startsWith("- ")) {
      if (paragraph.length) flush();
      list.push(item);
    } else if (/^(#|>|\||\d+[.)] |[*+] |\s)/.test(line)) fail(`${at} : balisage non reconnu en début de ligne`);
    else {
      if (list.length) flush();
      paragraph.push(item);
    }
  }
  flush();
  return out.join("\n");
}

// --- Pages -------------------------------------------------------------------------------------------------------

const CSS = `:root { color-scheme: light dark; --fg: #1d1d1b; --bg: #fbfbf9; --muted: #5d5d58; --line: #d9d9d4; --accent: #1f5fbf;
  --note-bg: #fff4d6; --note-fg: #4a3800; }
@media (prefers-color-scheme: dark) { :root { --fg: #ececea; --bg: #161615; --muted: #a9a9a3; --line: #3a3a37; --accent: #9cc3ff;
  --note-bg: #3b3115; --note-fg: #f5e3b3; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.55; font-size: 1.0625rem; }
a { color: var(--accent); overflow-wrap: anywhere; }
.bar { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; border-bottom: 1px solid var(--line); }
.brand { font-weight: 700; font-size: 1.15rem; color: var(--fg); text-decoration: none; }
.bar nav { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; }
main { max-width: 44rem; margin: 0 auto; padding: 1rem 1rem 2rem; }
h1 { font-size: 1.6rem; line-height: 1.25; margin: 0.5rem 0 1rem; }
h2 { font-size: 1.25rem; margin: 1.75rem 0 0.5rem; }
.code { color: var(--muted); font-weight: 600; margin-right: 0.4rem; }
.crumb { color: var(--muted); margin: 0; font-size: 0.95rem; }
.banner { background: var(--note-bg); color: var(--note-fg); border-radius: 6px; padding: 0.6rem 0.8rem; }
.mark { color: var(--muted); font-size: 0.9rem; }
.door { border-top: 1px solid var(--line); padding-top: 0.25rem; margin-top: 1.5rem; }
.door ul, .fiche ul { padding-left: 1.25rem; }
.door li { margin: 0.35rem 0; }
h3 { font-size: 1.05rem; margin: 1rem 0 0.25rem; }
.button { display: inline-block; padding: 0.6rem 1rem; border-radius: 6px; background: var(--accent); color: var(--bg);
  text-decoration: none; font-weight: 600; }
.actions { margin-top: 2rem; }
footer { max-width: 44rem; margin: 0 auto; padding: 1rem; border-top: 1px solid var(--line); color: var(--muted);
  font-size: 0.9rem; }
[hidden] { display: none !important; }
`;

/** Retient la langue de la page, ou celle qu'on choisit, comme le simulateur. */
const LANG_SCRIPT = (lang) =>
  `<script>try { localStorage.setItem("tutophoto.lang", ${JSON.stringify(lang)}); } catch (e) {}</script>`;

function page({ lang, title, description, css, body, script = "" }) {
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="stylesheet" href="${css}" />
  </head>
  <body>
${body}
${script}
  </body>
</html>
`;
}

const footer = (lang, up) => {
  const t = TEXT[lang];
  return `<footer>
  <p>${t.contentLicence} <a href="${up}licences/">${t.licences}</a> · <a href="https://github.com/Badmiaoo/TutoPhoto">${t.source}</a></p>
</footer>`;
};

function fichePage(lang, id, fiche, ctx) {
  const t = TEXT[lang];
  const other = lang === "fr" ? "en" : "fr";
  const reviewed = ctx.reviewed.has(`${lang}/${id}`);
  const sections = fiche.sections
    .map((s) => `<section>\n<h2>${escapeHtml(s.title)}</h2>\n${block(s.lines, { ...ctx, self: id })}\n</section>`)
    .join("\n");
  let related = "";
  if (fiche.kind === "notions") {
    const list = ctx.situationsOf(id).map((sid) => `<li><a href="${sid}.html">${sid} · ${escapeHtml(ctx.fiches[sid].title)}</a></li>`);
    if (list.length) related = `<section>\n<h2>${t.situations}</h2>\n<ul>\n${list.join("\n")}\n</ul>\n</section>`;
  }
  const domain = fiche.kind === "notions" ? ctx.domains[id.slice(0, 3)]?.[lang] : null;
  const door = fiche.kind === "notions" ? [t.learnDoor, t.anchors.learn] : [t.situationDoor, t.anchors.situation];
  const crumb = `<a href="../../?lang=${lang}#${door[1]}">${door[0]}</a>${domain ? ` · ${escapeHtml(capitalize(domain))}` : ""}`;
  const body = `<header class="bar">
  <a class="brand" href="../../?lang=${lang}">TutoPhoto</a>
  <nav>
    <a href="../../simulateur/?lang=${lang}">${t.simulator}</a>
    <a href="../${other}/${id}.html" hreflang="${other}" lang="${other}" data-lang="${other}">${t.switchLang}</a>
  </nav>
</header>
<main class="fiche">
<p class="crumb">${crumb}</p>
<h1><span class="code">${id}</span>${escapeHtml(fiche.title)}</h1>
${reviewed ? "" : `<p class="banner" role="note">${t.banner}</p>`}
${sections}
${related}
<p class="actions"><a class="button" href="../../simulateur/?lang=${lang}">${t.openSimulator}</a></p>
</main>
${footer(lang, "../../")}`;
  return page({
    lang,
    title: `${id} · ${fiche.title} · TutoPhoto`,
    description: `${id} · ${fiche.title}`,
    css: "../../pages.css",
    body,
    script: LANG_SCRIPT(lang),
  });
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function homeBlock(lang, all, ctx) {
  const t = TEXT[lang];
  const fiches = all[lang];
  const item = (id) => {
    const mark = ctx.reviewed.has(`${lang}/${id}`) ? "" : ` <span class="mark">· ${t.reviewMark}</span>`;
    return `<li><a href="fiches/${lang}/${id}.html"><span class="code">${id}</span>${escapeHtml(fiches[id].title)}</a>${mark}</li>`;
  };
  const situations = Object.keys(fiches).filter((id) => fiches[id].kind === "situations").sort();
  const notions = Object.keys(fiches).filter((id) => fiches[id].kind === "notions");
  const byDomain = DOMAIN_ORDER.filter((d) => notions.some((id) => id.startsWith(`${d}-`))).map((d) => {
    const ids = notions.filter((id) => id.startsWith(`${d}-`)).sort();
    return `<h3>${escapeHtml(capitalize(ctx.domains[d]?.[lang] ?? d))}</h3>\n<ul>\n${ids.map(item).join("\n")}\n</ul>`;
  });
  return `<div class="lang-block" lang="${lang}" data-lang-block="${lang}"${lang === "fr" ? "" : " hidden"}>
<header class="bar">
  <span class="brand">TutoPhoto</span>
  <nav><button type="button" class="lang-switch" data-to="${lang === "fr" ? "en" : "fr"}">${t.switchLang}</button></nav>
</header>
<main>
<h1>TutoPhoto</h1>
<p>${t.tagline}</p>
<p>${t.status(notions.length, situations.length)}</p>
<section class="door" id="${t.anchors.situation}">
<h2>${t.situationDoor}</h2>
<p>${t.situationIntro}</p>
<ul>
${situations.map(item).join("\n")}
</ul>
</section>
<section class="door" id="${t.anchors.train}">
<h2>${t.trainDoor}</h2>
<p>${t.trainIntro} ${t.trainSize(ctx.sceneMib)}</p>
<p><a class="button" href="simulateur/?lang=${lang}">${t.openSimulator}</a></p>
</section>
<section class="door" id="${t.anchors.learn}">
<h2>${t.learnDoor}</h2>
<p>${t.learnIntro}</p>
${byDomain.join("\n")}
</section>
<p class="mark">${t.reviewLegend}</p>
</main>
${footer(lang, "")}
</div>`;
}

// Accueil : les deux langues dans la page, une seule affichée (paramètre ?lang=, choix retenu, langue du navigateur,
// comme initialLang() dans app/src/i18n.ts) ; sans JavaScript, le français.
const HOME_SCRIPT = `<script>
(function () {
  var lang = new URLSearchParams(location.search).get("lang");
  if (lang !== "fr" && lang !== "en") {
    try { lang = localStorage.getItem("tutophoto.lang"); } catch (e) { lang = null; }
  }
  if (lang !== "fr" && lang !== "en") lang = navigator.language.toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  function show(l, remember) {
    document.documentElement.lang = l;
    document.querySelectorAll("[data-lang-block]").forEach(function (b) { b.hidden = b.getAttribute("data-lang-block") !== l; });
    if (remember) { try { localStorage.setItem("tutophoto.lang", l); } catch (e) {} }
  }
  document.querySelectorAll(".lang-switch").forEach(function (b) {
    b.addEventListener("click", function () { show(b.getAttribute("data-to"), true); });
  });
  show(lang, false);
})();
</script>`;

// --- Construction ------------------------------------------------------------------------------------------------

const domains = readDomains();
const reviewed = readReviewed();
const all = Object.fromEntries(LANGS.map((lang) => [lang, readFiches(lang)]));
for (const lang of LANGS) {
  const other = lang === "fr" ? "en" : "fr";
  for (const id of Object.keys(all[lang])) if (!all[other][id]) fail(`${id} : fiche en ${lang} sans fiche en ${other}`);
}
const ctxFor = (lang) => ({
  lang,
  fiches: all[lang],
  domains,
  reviewed,
  sceneMib: sceneMib(),
  // Situations dont la section « Notions » cite la notion.
  situationsOf: (nid) =>
    Object.entries(all[lang])
      .filter(([, f]) => f.kind === "situations")
      .filter(([, f]) => f.sections.some((s) => SECTIONS.situations[lang].indexOf(s.title) === 3 && s.lines.some((l) => l.line.includes(nid))))
      .map(([sid]) => sid)
      .sort(),
});

const outputs = [];
for (const lang of LANGS) {
  const ctx = ctxFor(lang);
  for (const [id, fiche] of Object.entries(all[lang])) outputs.push([join("fiches", lang, `${id}.html`), fichePage(lang, id, fiche, ctx)]);
}
const home = page({
  lang: "fr",
  title: "TutoPhoto",
  description: `${TEXT.fr.tagline} ${TEXT.en.tagline}`,
  css: "pages.css",
  body: LANGS.map((lang) => homeBlock(lang, all, ctxFor(lang))).join("\n"),
  script: HOME_SCRIPT,
});
outputs.push(["index.html", home], ["pages.css", CSS]);

if (problems.length) {
  for (const p of problems) console.error(`ERREUR : ${p}`);
  console.error(`${problems.length} problème(s) : pages non produites.`);
  process.exit(1);
}
for (const [path, content] of outputs) {
  mkdirSync(dirname(join(dist, path)), { recursive: true });
  writeFileSync(join(dist, path), content);
}
const ficheCount = outputs.length - 2;
console.log(`Pages : accueil, ${ficheCount} fiche(s), ${reviewed.size} relue(s)`);
