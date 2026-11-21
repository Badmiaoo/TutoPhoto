// Pages statiques du site, produites après Vite : l'accueil (dist/index.html) et les fiches des notions et des
// situations (dist/fiches/<identifiant>.html), d'après content/ (docs/contenus.md). Décisions de Julien du
// 11 novembre 2026 : accueil à la racine, simulateur sous simulateur/, fiches publiées avec un bandeau « en cours
// de relecture » tant qu'elles ne sont pas listées dans data/relecture.yaml, convertisseur écrit pour TutoPhoto.
//
// Le convertisseur ne reconnaît que ce qu'emploient les fiches : un titre de niveau 1 (« # ID · Titre »), des
// sections de niveau 2 aux titres de docs/contenus.md, des paragraphes, des listes à tirets, du gras (**…**) et des
// liens [texte](https://…). Tout le reste fait échouer la construction, comme un code de notion ou de situation
// sans fiche : une fiche mal formée se voit avant la publication. Depuis la version 0.3.81 (constats RST-01 et RST-13
// de l'audit, Sujet 21, et sa relecture) : un identifiant de fiche, nom de fichier compris, a la forme de
// src/ficheId.mjs, partagée avec le simulateur (« SIT-V2-02 » compris) ; une fiche sans section, une section sans
// texte, une puce vide et une fiche de situation sans recette font aussi échouer la construction ; depuis la version
// 0.3.83, une ligne de séparation (« --- ») ou de soulignement de titre (« === »). scripts/validate.py contrôle en plus
// que chaque fiche porte l'identifiant et le titre d'une notion ou d'une situation du référentiel.
//
// Le site est en français seul depuis la version 0.3.60 (décision de Julien du 15 novembre 2026). Les pages se lisent
// sans JavaScript ; le seul script de l'accueil est celui du pré-téléchargement.

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FICHE_ID } from "../src/ficheId.mjs";
import { readVersion } from "./version.mjs";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(app, "..");
const dist = join(app, "dist");
// Ordre des domaines de scripts/referentiel.py (DOMAIN_ORDER).
const DOMAIN_ORDER = ["EXP", "MES", "BOI", "MAP", "NET", "MVT", "OPT", "LUM", "COU", "CMP", "PLA", "RET", "LEC"];
// Identifiants de fiches : codes cités dans un texte, nom d'un fichier de content/, ligne de data/relecture.yaml,
// titre d'une fiche.
const ID = new RegExp(`\\b${FICHE_ID}\\b`, "g");
const FILE_ID = new RegExp(`^${FICHE_ID}$`);
const REVIEWED_LINE = new RegExp(`^  - \\{fiche: (${FICHE_ID}), date: \\d{4}-\\d{2}-\\d{2}\\}$`);
const TITLE_LINE = new RegExp(`^# (${FICHE_ID}) · (.+)$`);

const problems = [];
const fail = (msg) => problems.push(msg);

const TEXT = {
  tagline: "Simulateur photo pour débutants, avec un reflex ou un hybride.",
  status: (n, s) => `Version en construction : une scène de parc, ${s} situations et ${n} notions.`,
  situationDoor: "Je suis en situation",
  situationIntro: "Chaque situation donne sa recette de réglages, avec les raisons de chaque réglage et un plan B.",
  trainDoor: "Je m'entraîne",
  trainIntro: "Le simulateur : un boîtier virtuel dans la scène de parc, en entraînement libre ou avec un défi par situation.",
  trainSize: (mib) => `Il télécharge la scène 3D, ${mib} Mio.`,
  prefetch: "Télécharger les ressources du simulateur",
  prefetchNote: "Pour mesurer ton réseau ou préparer le simulateur à l'avance : la progression et le débit s'affichent en direct.",
  learnDoor: "J'apprends",
  learnIntro: "Chaque notion a une explication, ce qu'en montre le simulateur et un exercice.",
  openSimulator: "Ouvrir le simulateur",
  playChallenge: "Jouer le défi",
  doActivity: "Faire l'activité",
  simulator: "Simulateur",
  reviewMark: "en relecture",
  reviewLegend: "Une fiche marquée « en relecture » n'a pas encore été vérifiée.",
  banner: "Fiche en cours de relecture : son contenu et ses sources n'ont pas encore été vérifiés par les relecteurs de TutoPhoto.",
  situations: "Situations",
  licences: "Licences",
  contentLicence: "Textes sous licence CC BY-SA 4.0, code sous licence MIT.",
  source: "Code source",
  version: (v) => `Version ${v}`,
  anchors: { situation: "situation", train: "entrainement", learn: "apprendre" },
};

// Titres des sections, par type de fiche (docs/contenus.md).
const SECTIONS = {
  notions: ["Explication", "Simulateur", "Activité", "Exercice", "Situation réelle"],
  situations: ["Où, quand, quoi, pourquoi", "Recette", "Défi", "Notions"],
};

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// --- Données ------------------------------------------------------------------------------------------------------

/**
 * Texte d'un fichier lu par cette construction, sans la marque d'ordre des octets (U+FEFF) qu'un éditeur peut mettre
 * en tête, et avec les fins de ligne de Windows (CRLF) ramenées à « \n », que scripts/validate.py accepte aussi
 * (Python et PyYAML). Sans cela, la première ligne d'une fiche, une ligne de data/relecture.yaml ou le bloc
 * « domain » d'un fichier du référentiel n'étaient pas reconnus, et le message redemandait la ligne lue (relecture
 * de la version 0.3.81, constat C2, et son contrôle final, F3).
 */
function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

/**
 * Titres des domaines, lus dans le bloc « domain: » de chaque fichier du référentiel. validate.py n'en contrôle que le
 * schéma (« id », « title » : chaîne non vide), pas l'écriture. Celle qui est lue ici : « id » puis « title », deux
 * espaces de retrait, le titre entre guillemets doubles ; sinon la construction échoue, avec le nom du fichier.
 */
function readDomains() {
  const dir = join(root, "data", "referentiel");
  const domains = {};
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".yaml") || name === "retired.yaml") continue;
    const text = readText(join(dir, name));
    const m = /^domain:\n  id: ([A-Z]{3})\n  title: "([^"]+)"$/m.exec(text);
    if (!m) {
      fail(`data/referentiel/${name} : bloc « domain » non reconnu (id puis title sur une ligne)`);
      continue;
    }
    domains[m[1]] = m[2];
  }
  return domains;
}

/** Fiches relues : data/relecture.yaml, une ligne par fiche, sous la forme exacte de son en-tête. */
function readReviewed() {
  const reviewed = new Set();
  const lines = readText(join(root, "data", "relecture.yaml")).split("\n");
  let seenKey = false;
  lines.forEach((line, i) => {
    if (line.trim() === "" || line.trimStart().startsWith("#")) return;
    if (line === "relues: []" || line === "relues:") {
      seenKey = true;
      return;
    }
    const m = REVIEWED_LINE.exec(line);
    if (seenKey && m) reviewed.add(m[1]);
    else fail(`data/relecture.yaml:${i + 1} : ligne non reconnue`);
  });
  if (!seenKey) fail("data/relecture.yaml : clé « relues » absente");
  return reviewed;
}

/**
 * Version du site (version 0.3.59) : le numéro du premier titre de version de CHANGELOG.md, par le lecteur commun à
 * cette construction et à celle du simulateur (version.mjs, vite.config.ts). Sans titre de version, c'est un problème
 * comme un autre : aucune page n'est produite.
 */
function siteVersion() {
  try {
    return readVersion();
  } catch (error) {
    fail(error.message);
    return "";
  }
}

/** Taille de la scène de parc, d'après son manifeste (somme des fichiers), en Mio. */
function sceneMib() {
  const manifest = JSON.parse(readFileSync(join(app, "public", "scenes", "parc", "scene.json"), "utf8"));
  const bytes = manifest.assets.flatMap((a) => a.files).reduce((sum, f) => sum + f.bytes, 0);
  return Math.round(bytes / 2 ** 20);
}

/**
 * Fichiers que charge le simulateur, pour le bouton « Télécharger les ressources du simulateur » de l'accueil
 * (proposé par Julien le 11 novembre 2026, option A : cache ordinaire du navigateur) : le code et la feuille de style
 * du simulateur, lus dans dist/simulateur/index.html, le manifeste de la scène et les fichiers qu'il liste, sauf les
 * textes de licence, que le simulateur ne charge pas. Adresses relatives à l'accueil, tailles en octets.
 */
function prefetchFiles() {
  const page = readFileSync(join(dist, "simulateur", "index.html"), "utf8");
  const assets = [...page.matchAll(/(?:src|href)="\.\.\/(assets\/[^"]+)"/g)].map((m) => m[1]);
  if (assets.length === 0) fail("dist/simulateur/index.html : code du simulateur introuvable");
  const manifestPath = join(app, "public", "scenes", "parc", "scene.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const files = [
    ...assets.map((path) => ({ url: path, bytes: statSync(join(dist, path)).size })),
    { url: "scenes/parc/scene.json", bytes: statSync(manifestPath).size },
    ...manifest.assets
      .flatMap((asset) => asset.files)
      .filter((f) => !f.path.endsWith(".txt"))
      .map((f) => ({ url: `scenes/parc/${f.path.split("/").map(encodeURIComponent).join("/")}`, bytes: f.bytes })),
  ];
  return files;
}

/** Lit les fiches : { id: { kind, title, sections: [{ title, at, lines }] } }. */
function readFiches() {
  const fiches = {};
  for (const kind of ["notions", "situations"]) {
    const dir = join(root, "content", kind);
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".md")) continue;
      const id = name.slice(0, -3);
      const where = `content/${kind}/${name}`;
      if (!FILE_ID.test(id)) {
        fail(`${where} : le nom du fichier n'est pas un identifiant de fiche (EXP-04, SIT-05 ou SIT-V2-02)`);
        continue;
      }
      const lines = readText(join(dir, name)).split("\n");
      const first = lines.findIndex((l) => l.trim() !== "");
      const h1 = TITLE_LINE.exec(lines[first] ?? "");
      if (!h1 || h1[1] !== id) {
        fail(`${where} : la première ligne doit être « # ${id} · Titre »`);
        continue;
      }
      const sections = [];
      lines.slice(first + 1).forEach((line, i) => {
        const at = `${where}:${first + 2 + i}`;
        if (line.startsWith("## ")) {
          const title = line.slice(3).trim();
          if (!SECTIONS[kind].includes(title)) fail(`${at} : section « ${title} » non prévue par docs/contenus.md`);
          sections.push({ title, at, lines: [] });
        } else if (line.trim() === "" || sections.length > 0) {
          if (sections.length > 0) sections[sections.length - 1].lines.push({ line, at });
        } else {
          fail(`${at} : texte avant la première section`);
        }
      });
      // Une fiche réduite à son titre, ou une section sans texte, n'est pas publiée (constat RST-13 de l'audit) : la
      // page serait vide, et l'accueil la listerait comme les autres.
      if (sections.length === 0) fail(`${where} : aucune section ; leurs titres sont dans docs/contenus.md`);
      for (const s of sections) {
        if (!s.lines.some((l) => l.line.trim() !== "")) fail(`${s.at} : section « ${s.title} » vide`);
      }
      // Une fiche de situation donne sa recette : l'accueil le promet (« Je suis en situation »), et scripts/coverage.py
      // ne compte une situation comme rédigée que par elle (relecture de la version 0.3.81, constat C4).
      const recipe = SECTIONS.situations[1];
      if (kind === "situations" && sections.length > 0 && !sections.some((s) => s.title === recipe)) {
        fail(`${where} : pas de section « ${recipe} » ; une fiche de situation donne sa recette (docs/contenus.md)`);
      }
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
        fail(`${at} : ${id} n'a pas de fiche`);
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
    // Une puce sans texte, « - » avec ou sans blanc après, donnerait un élément de liste vide ou un paragraphe « - »
    // (relecture de la version 0.3.81, constat C1, et son contrôle final, F1). De même « + » et « * » seuls, deux autres
    // puces de Markdown (version 0.3.83).
    else if (/^[-+*]$/.test(line.trim())) fail(`${at} : élément de liste vide`);
    // Une ligne faite seulement de « - », « = », « _ », « * », « + » et de blancs est, pour Markdown, une ligne de
    // séparation (« --- », « - - - ») ou le soulignement d'un titre (« === » sous une ligne) : jusqu'à la version 0.3.83,
    // publiée comme du texte, « --- » seul en paragraphe ou « - - » en puce (contrôle final de la version 0.3.81, F7).
    else if (/^[-=_*+\s]+$/.test(line)) fail(`${at} : balisage non reconnu (ligne de séparation ou soulignement de titre)`);
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
.actions-row { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.button.secondary { background: transparent; color: var(--accent); border: 1px solid var(--accent); font: inherit; font-weight: 600; cursor: pointer; }
.prefetch progress { width: 100%; height: 1rem; }
.prefetch-status { margin: 0.25rem 0; }
.prefetch-errors { color: var(--muted); font-size: 0.9rem; }
`;

function page({ title, description, css, body, script = "" }) {
  return `<!doctype html>
<html lang="fr">
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

// Pied commun à l'accueil et aux fiches. Seul l'accueil donne la version du site (plan de corrections de l'audit,
// Sujet 1) : il passe son numéro, les fiches n'en passent pas.
const footer = (up, version = null) => {
  const t = TEXT;
  return `<footer>
  <p>${t.contentLicence} <a href="${up}licences/">${t.licences}</a> · <a href="https://github.com/Badmiaoo/TutoPhoto">${t.source}</a></p>${
    version === null ? "" : `\n  <p>${escapeHtml(t.version(version))}</p>`
  }
</footer>`;
};

function fichePage(id, fiche, ctx) {
  const t = TEXT;
  const reviewed = ctx.reviewed.has(id);
  const sections = fiche.sections
    .map((s) => `<section>\n<h2>${escapeHtml(s.title)}</h2>\n${block(s.lines, { ...ctx, self: id })}\n</section>`)
    .join("\n");
  let related = "";
  if (fiche.kind === "notions") {
    const list = ctx.situationsOf(id).map((sid) => `<li><a href="${sid}.html">${sid} · ${escapeHtml(ctx.fiches[sid].title)}</a></li>`);
    if (list.length) related = `<section>\n<h2>${t.situations}</h2>\n<ul>\n${list.join("\n")}\n</ul>\n</section>`;
  }
  const domain = fiche.kind === "notions" ? ctx.domains[id.slice(0, 3)] : null;
  const door = fiche.kind === "notions" ? [t.learnDoor, t.anchors.learn] : [t.situationDoor, t.anchors.situation];
  // Une situation qui a une section « Défi » ouvre le simulateur avec ce défi (simulateur/?defi=…, version 0.3.47).
  const hasChallenge = fiche.kind === "situations" && fiche.sections.some((s) => s.title === SECTIONS.situations[2]);
  // Une notion qui a une section « Activité » et une page d'activité construite par Vite (activites/<ID>/, version
  // 0.3.50) propose l'activité à la place du simulateur.
  const hasActivity =
    fiche.kind === "notions" &&
    fiche.sections.some((s) => s.title === SECTIONS.notions[2]) &&
    existsSync(join(dist, "activites", id, "index.html"));
  const action = hasChallenge
    ? `<a class="button" href="../simulateur/?defi=${id}">${t.playChallenge}</a>`
    : hasActivity
      ? `<a class="button" href="../activites/${id}/">${t.doActivity}</a>`
      : `<a class="button" href="../simulateur/">${t.openSimulator}</a>`;
  const crumb = `<a href="../#${door[1]}">${door[0]}</a>${domain ? ` · ${escapeHtml(capitalize(domain))}` : ""}`;
  const body = `<header class="bar">
  <a class="brand" href="../">TutoPhoto</a>
  <nav>
    <a href="../simulateur/">${t.simulator}</a>
  </nav>
</header>
<main class="fiche">
<p class="crumb">${crumb}</p>
<h1><span class="code">${id}</span>${escapeHtml(fiche.title)}</h1>
${reviewed ? "" : `<p class="banner" role="note">${t.banner}</p>`}
${sections}
${related}
<p class="actions">${action}</p>
</main>
${footer("../")}`;
  return page({
    title: `${id} · ${fiche.title} · TutoPhoto`,
    description: `${id} · ${fiche.title}`,
    css: "../pages.css",
    body,
  });
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function homeBody(ctx) {
  const t = TEXT;
  const fiches = ctx.fiches;
  const item = (id) => {
    const mark = ctx.reviewed.has(id) ? "" : ` <span class="mark">· ${t.reviewMark}</span>`;
    return `<li><a href="fiches/${id}.html"><span class="code">${id}</span>${escapeHtml(fiches[id].title)}</a>${mark}</li>`;
  };
  const situations = Object.keys(fiches).filter((id) => fiches[id].kind === "situations").sort();
  const notions = Object.keys(fiches).filter((id) => fiches[id].kind === "notions");
  const byDomain = DOMAIN_ORDER.filter((d) => notions.some((id) => id.startsWith(`${d}-`))).map((d) => {
    const ids = notions.filter((id) => id.startsWith(`${d}-`)).sort();
    return `<h3>${escapeHtml(capitalize(ctx.domains[d] ?? d))}</h3>\n<ul>\n${ids.map(item).join("\n")}\n</ul>`;
  });
  return `<header class="bar">
  <span class="brand">TutoPhoto</span>
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
<p class="actions-row"><a class="button" href="simulateur/">${t.openSimulator}</a> <button type="button" class="button secondary" data-prefetch>${t.prefetch}</button></p>
<p class="mark">${t.prefetchNote}</p>
<div class="prefetch" data-prefetch-panel hidden>
<progress max="100" value="0"></progress>
<p class="prefetch-status" aria-live="polite"></p>
<ul class="prefetch-errors"></ul>
</div>
</section>
<section class="door" id="${t.anchors.learn}">
<h2>${t.learnDoor}</h2>
<p>${t.learnIntro}</p>
${byDomain.join("\n")}
</section>
<p class="mark">${t.reviewLegend}</p>
</main>
${footer("", ctx.version)}`;
}

// Pré-téléchargement des ressources du simulateur (version 0.3.51). Trois téléchargements à la fois ; les octets
// sont comptés à mesure qu'ils arrivent (flux de la réponse), d'où une barre en direct. Débit = octets reçus × 8 ÷ durée.
// Les fichiers vont dans le cache ordinaire du navigateur (option A, décision de Julien du 11 novembre 2026) : ce
// qu'il en garde dépend du serveur et du navigateur, d'où la formulation prudente du bilan.
const PREFETCH_TEXT = {
  progress: "{done} / {total} Mio · {pct} % · {time} · {rate} Mbit/s",
  stall: "aucune donnée reçue depuis {s} s",
  done: "Téléchargé : {total} Mio en {time}, débit moyen {rate} Mbit/s.",
  cache: "Si le navigateur garde ces fichiers en mémoire, le simulateur s'ouvrira plus vite.",
  failed: "{n} fichier(s) en échec : réessaie, ou change de réseau.",
  retry: "Réessayer les fichiers en échec",
  network: "erreur réseau",
  min: "min",
};

const PREFETCH_SCRIPT = `<script>
(function () {
  var files = JSON.parse(document.getElementById("prefetch-files").textContent);
  var t = ${JSON.stringify(PREFETCH_TEXT)};
  var total = files.reduce(function (sum, f) { return sum + f.bytes; }, 0);
  var MIB = 1048576;
  var STALL_S = 15;
  var PARALLEL = 3;
  document.querySelectorAll("[data-prefetch]").forEach(function (button) {
    var panel = document.querySelector("[data-prefetch-panel]");
    var bar = panel.querySelector("progress");
    var status = panel.querySelector(".prefetch-status");
    var errors = panel.querySelector(".prefetch-errors");
    var label = button.textContent;
    var got = {};
    var ok = {};
    var running = false;
    var num = function (v, d) { return v.toFixed(d).replace(".", ","); };
    var duration = function (s) { return s < 60 ? Math.round(s) + " s" : Math.floor(s / 60) + " " + t.min + " " + Math.round(s % 60) + " s"; };
    button.addEventListener("click", function () {
      if (running) return;
      running = true;
      button.disabled = true;
      panel.hidden = false;
      errors.replaceChildren();
      var todo = files.filter(function (f) { return !ok[f.url]; });
      todo.forEach(function (f) { got[f.url] = 0; });
      var failed = [];
      var start = performance.now();
      var startBytes = files.reduce(function (sum, f) { return sum + (ok[f.url] ? f.bytes : 0); }, 0);
      var last = start;
      var received = function () { return files.reduce(function (sum, f) { return sum + (ok[f.url] ? f.bytes : got[f.url] || 0); }, 0); };
      var show = function (final) {
        var now = performance.now();
        var bytes = received();
        var seconds = (now - start) / 1000;
        var rate = seconds > 0 ? ((bytes - startBytes) * 8) / seconds / 1e6 : 0;
        bar.value = Math.min(100, (100 * bytes) / total);
        var fill = function (text) {
          return text.replace("{done}", num(bytes / MIB, 1)).replace("{total}", num(total / MIB, 1)).replace("{pct}", Math.floor((100 * bytes) / total))
            .replace("{time}", duration(seconds)).replace("{rate}", num(rate, 1));
        };
        if (!final) {
          var idle = (now - last) / 1000;
          status.textContent = fill(t.progress) + (idle >= STALL_S ? " · " + t.stall.replace("{s}", Math.round(idle)) : "");
        } else if (failed.length === 0) {
          status.textContent = fill(t.done) + " " + t.cache;
        } else {
          status.textContent = t.failed.replace("{n}", failed.length);
        }
      };
      var timer = setInterval(function () { show(false); }, 250);
      var queue = todo.slice();
      var one = function () {
        var f = queue.shift();
        if (!f) return Promise.resolve();
        return fetch(f.url)
          .then(function (response) {
            if (!response.ok) throw new Error(String(response.status));
            if (!response.body || !response.body.getReader) {
              return response.arrayBuffer().then(function (buffer) { got[f.url] = buffer.byteLength; last = performance.now(); });
            }
            var reader = response.body.getReader();
            var pump = function () {
              return reader.read().then(function (step) {
                if (step.done) return;
                got[f.url] += step.value.length;
                last = performance.now();
                return pump();
              });
            };
            return pump();
          })
          .then(function () { ok[f.url] = true; })
          .catch(function (error) {
            got[f.url] = 0;
            var reason = /^\\d+$/.test(error.message) ? error.message : t.network;
            failed.push(f.url.split("/").pop() + " (" + reason + ")");
          })
          .then(one);
      };
      var workers = [];
      for (var i = 0; i < PARALLEL; i++) workers.push(one());
      Promise.all(workers).then(function () {
        clearInterval(timer);
        show(true);
        errors.replaceChildren.apply(errors, failed.map(function (name) { var li = document.createElement("li"); li.textContent = name; return li; }));
        running = false;
        button.disabled = false;
        button.textContent = failed.length ? t.retry : label;
      });
    });
  });
})();
</script>`;

// --- Construction ------------------------------------------------------------------------------------------------

const domains = readDomains();
const reviewed = readReviewed();
const version = siteVersion();
const fiches = readFiches();
const ctx = {
  fiches,
  domains,
  reviewed,
  version,
  sceneMib: sceneMib(),
  // Situations dont la section « Notions » cite la notion.
  situationsOf: (nid) =>
    Object.entries(fiches)
      .filter(([, f]) => f.kind === "situations")
      .filter(([, f]) => f.sections.some((s) => SECTIONS.situations.indexOf(s.title) === 3 && s.lines.some((l) => l.line.includes(nid))))
      .map(([sid]) => sid)
      .sort(),
};

const outputs = [];
for (const [id, fiche] of Object.entries(fiches)) outputs.push([join("fiches", `${id}.html`), fichePage(id, fiche, ctx)]);
const home = page({
  title: "TutoPhoto",
  description: TEXT.tagline,
  css: "pages.css",
  body: homeBody(ctx),
  script: `<script type="application/json" id="prefetch-files">${JSON.stringify(prefetchFiles()).replace(/</g, "\\u003c")}</script>\n${PREFETCH_SCRIPT}`,
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
