#!/usr/bin/env node
// Routine de test du site construit, sur ordinateur et sur mobile (demande de Julien du 9 novembre 2026).
//
// Usage : node scripts/test_app.cjs [--dist app/dist] [--profils ordinateur,android,iphone,webgl1]
//                                   [--photo] [--sorties dossier]
// Prérequis : Playwright (licence Apache-2.0) et son Chromium, installés hors du dépôt ; le site construit
// (cd app && npm run build).
//
// Limites : Chromium seul, avec un rendu logiciel (SwiftShader). Les profils mobiles émulent la taille
// d'écran, le toucher et l'identification du navigateur (Babylon.js change de comportement sur iPhone et
// iPad), mais pas le processeur graphique ni le moteur Safari : un vrai téléphone reste nécessaire.
//
// Contrôles, pour chaque profil :
// - la scène se charge (le message de chargement disparaît) et aucun problème ne s'affiche à l'écran ;
// - le rendu a la taille affichée et le cadre les proportions du capteur ;
// - à ISO 6400, le bruit du viseur varie d'une image à l'autre ; aperçu coupé, il disparaît ;
// - au 135 mm à f/1.4, la profondeur de champ du viseur floute le fond ; coupée, le fond redevient net ;
// - la loupe passe à 100 % et l'indique ;
// - avec --photo : la photo se calcule, n'est pas noire, et la loupe de l'écran de revue fonctionne.

"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");

let playwright;
try {
  playwright = require("playwright");
} catch {
  console.error("Playwright est introuvable : installez-le (npm install -g playwright) avec son Chromium.");
  process.exit(2);
}
const { chromium, devices } = playwright;

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const dist = path.resolve(option("--dist", path.join(__dirname, "..", "app", "dist")));
const profileNames = option("--profils", "ordinateur,android,iphone,webgl1").split(",");
const withPhoto = args.includes("--photo");
const outDir = option("--sorties", null);
if (outDir) fs.mkdirSync(outDir, { recursive: true });

const PROFILES = {
  ordinateur: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  android: { ...devices["Pixel 7"] },
  iphone: { ...devices["iPhone 14"] },
  // Ordinateur sans WebGL 2, comme certains appareils anciens.
  webgl1: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, noWebgl2: true },
};

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".gltf": "model/gltf+json", ".bin": "application/octet-stream", ".hdr": "application/octet-stream", ".txt": "text/plain", ".md": "text/markdown" };

function serve(root) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(root, url);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/** Écart type de la différence entre deux captures, ÷ √2, sur le haut du cadre (fond immobile), par canal. */
async function frameNoise(page) {
  return page.evaluate(async () => {
    const canvas = document.getElementById("scene");
    const grab = () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        const copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        const g = copy.getContext("2d");
        g.drawImage(canvas, 0, 0);
        resolve(g.getImageData(0, 0, copy.width, Math.floor(copy.height / 4)).data);
      })));
    const a = await grab();
    await new Promise((r) => setTimeout(r, 300));
    const b = await grab();
    const sums = [0, 0, 0];
    const squares = [0, 0, 0];
    let n = 0;
    for (let i = 0; i < a.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const d = a[i + c] - b[i + c];
        sums[c] += d;
        squares[c] += d * d;
      }
      n++;
    }
    return sums.map((s, c) => Math.sqrt(Math.max(0, squares[c] / n - (s / n) ** 2)) / Math.SQRT2);
  });
}

/**
 * Netteté d'une zone de fond : moyenne de la valeur absolue du laplacien, en niveaux de gris. Zone en haut à
 * gauche du cadre (de 15 à 35 % de sa largeur, de 2 à 20 % de sa hauteur) : au 135 mm, elle ne montre que le
 * fond, alors que le haut du canevas contient aussi les têtes nettes des personnages.
 */
async function sharpness(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        const canvas = document.getElementById("scene");
        const frame = document.getElementById("frame").getBoundingClientRect();
        const box = canvas.getBoundingClientRect();
        const sx = canvas.width / box.width;
        const sy = canvas.height / box.height;
        const x0 = Math.round((frame.left - box.left + 0.15 * frame.width) * sx);
        const y0 = Math.round((frame.top - box.top + 0.02 * frame.height) * sy);
        const w = Math.round(0.2 * frame.width * sx);
        const h = Math.round(0.18 * frame.height * sy);
        const copy = document.createElement("canvas");
        copy.width = canvas.width;
        copy.height = canvas.height;
        const g = copy.getContext("2d");
        g.drawImage(canvas, 0, 0);
        const d = g.getImageData(x0, y0, w, h).data;
        const grey = (x, y) => { const i = (y * w + x) * 4; return (d[i] + d[i + 1] + d[i + 2]) / 3; };
        let sum = 0;
        let n = 0;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            sum += Math.abs(4 * grey(x, y) - grey(x - 1, y) - grey(x + 1, y) - grey(x, y - 1) - grey(x, y + 1));
            n++;
          }
        }
        resolve(sum / n);
      }))),
  );
}

async function runProfile(browser, name, base) {
  const profile = PROFILES[name];
  if (!profile) throw new Error(`Profil inconnu : ${name}`);
  const { noWebgl2, ...contextOptions } = profile;
  const context = await browser.newContext(contextOptions);
  // Le rendu logiciel ne permet pas de lire le canevas WebGL sans conserver le tampon de dessin.
  await context.addInitScript((noWebgl2) => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      if (noWebgl2 && type === "webgl2") return null;
      if (type === "webgl2" || type === "webgl") attributes = { ...(attributes || {}), preserveDrawingBuffer: true };
      return original.call(this, type, attributes);
    };
  }, Boolean(noWebgl2));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  const checks = [];
  const check = (label, ok, detail = "") => checks.push({ label, ok, detail });
  const started = Date.now();
  try {
    await page.goto(`${base}/?lang=fr`);
    const loaded = await page
      .waitForFunction(() => document.getElementById("status").hidden, null, { timeout: 300000 })
      .then(() => true)
      .catch(() => false);
    check("chargement", loaded, `${Math.round((Date.now() - started) / 1000)} s`);
    const diagnostic = await page.evaluate(() => {
      const d = document.getElementById("diagnostic");
      return d && !d.hidden ? d.textContent : "";
    });
    check("aucun problème affiché", !diagnostic, diagnostic);
    if (!loaded) return { name, checks, errors };

    // Le rendu a la taille affichée, et le cadre les proportions du capteur (Nikon Z 6 : 35,9 / 23,9).
    await page.waitForTimeout(500);
    const geometry = await page.evaluate(() => {
      const c = document.getElementById("scene");
      const f = document.getElementById("frame").getBoundingClientRect();
      return { rw: c.width, rh: c.height, cw: c.clientWidth, ch: c.clientHeight, ratio: Math.max(f.width, f.height) / Math.min(f.width, f.height) };
    });
    check("rendu à la taille affichée", Math.abs(geometry.rw - geometry.cw) <= 1 && Math.abs(geometry.rh - geometry.ch) <= 1, `${geometry.rw}×${geometry.rh} rendu, ${geometry.cw}×${geometry.ch} affiché`);
    check("cadre aux proportions du capteur", Math.abs(geometry.ratio - 35.9 / 23.9) < 0.02, `rapport ${geometry.ratio.toFixed(3)}, attendu ${(35.9 / 23.9).toFixed(3)}`);

    // Profondeur de champ : 135 mm, f/1.4, vitesse ajustée pour rester près de l'exposition correcte. Les
    // réglages se font effet coupé, puis l'effet reste coupé : en rendu logiciel, il ralentit chaque image.
    const clicks = async (selector, n) => { for (let i = 0; i < n; i++) await page.click(selector); };
    const setDof = async (on) => {
      await page.click("#preview-button");
      if (on) await page.check('#preview-dialog input[value="depthOfField"]');
      else await page.uncheck('#preview-dialog input[value="depthOfField"]');
      await page.click("#preview-close");
    };
    await setDof(false);
    await clicks('[data-dial="focal"][data-step="1"]', 4);
    await clicks('[data-dial="aperture"][data-step="-1"]', 15);
    await clicks('[data-dial="shutter"][data-step="-1"]', 14);
    await setDof(true);
    await page.waitForTimeout(1500);
    const blurred = await sharpness(page);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-profondeur-de-champ.png`), timeout: 120000 });
    await setDof(false);
    await page.waitForTimeout(800);
    const sharp = await sharpness(page);
    check("profondeur de champ du viseur", blurred < 0.6 * sharp, `netteté du fond ${blurred.toFixed(2)} avec, ${sharp.toFixed(2)} sans`);
    await clicks('[data-dial="focal"][data-step="-1"]', 4);
    await clicks('[data-dial="aperture"][data-step="1"]', 15);
    await clicks('[data-dial="shutter"][data-step="1"]', 14);

    for (let i = 0; i < 18; i++) await page.click('[data-dial="iso"][data-step="1"]');
    for (let i = 0; i < 16; i++) await page.click('[data-dial="shutter"][data-step="-1"]');
    await page.waitForTimeout(800);
    const noisy = await frameNoise(page);
    check("bruit du viseur à ISO 6400", Math.max(...noisy) > 0.3, noisy.map((v) => v.toFixed(2)).join(" / "));
    await page.click("#preview-button");
    await page.uncheck('#preview-dialog input[value="all"]');
    await page.click("#preview-close");
    await page.waitForTimeout(500);
    const quiet = await frameNoise(page);
    check("aperçu coupé : pas de bruit", Math.max(...quiet) < 0.05, quiet.map((v) => v.toFixed(2)).join(" / "));
    await page.click("#preview-button");
    await page.check('#preview-dialog input[value="all"]');
    await page.click("#preview-close");

    await page.click("#loupe-button");
    await page.click("#loupe-button");
    const loupe = await page.evaluate(() => document.getElementById("loupe-badge").textContent);
    check("loupe du viseur à 100 %", /100/.test(loupe), loupe);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-loupe.png`), timeout: 120000 });
    await page.click("#loupe-button");

    if (withPhoto) {
      await page.click("#shutter-button");
      await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("review-image").complete, null, { timeout: 300000 });
      const photo = await page.evaluate(() => {
        const img = document.getElementById("review-image");
        if (!img.naturalWidth) return { mean: 0, caption: document.getElementById("review-caption").textContent };
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let s = 0;
        for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 3;
        return { mean: s / (d.length / 4), size: `${c.width}×${c.height}`, caption: document.getElementById("review-caption").textContent };
      });
      check("photo calculée, pas noire", photo.mean > 5, `${photo.size ?? "-"}, niveau moyen ${photo.mean.toFixed(1)} ; ${photo.caption}`);
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-photo.png`), timeout: 120000 });
      const box = await page.locator("#review-image").boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(() => document.getElementById("progress").hidden && !document.getElementById("review-whole").hidden, null, { timeout: 300000 });
      const caption = await page.evaluate(() => document.getElementById("review-caption").textContent);
      check("loupe de l'écran de revue", /100/.test(caption), caption);
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-loupe.png`), timeout: 120000 });
    }
  } catch (error) {
    check("déroulement du test", false, String(error).split("\n")[0]);
  } finally {
    await context.close();
  }
  return { name, checks, errors };
}

(async () => {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error(`Site construit introuvable dans ${dist} : lancez d'abord cd app && npm run build.`);
    process.exit(2);
  }
  const server = await serve(dist);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  let failed = 0;
  for (const name of profileNames) {
    const result = await runProfile(browser, name, base);
    console.log(`\n== ${name}`);
    for (const c of result.checks) {
      if (!c.ok) failed++;
      console.log(`${c.ok ? "ok    " : "ÉCHEC "} ${c.label}${c.detail ? ` : ${c.detail}` : ""}`);
    }
    const errors = [...new Set(result.errors)];
    if (errors.length) console.log(`erreurs de la console (${errors.length}) : ${errors.slice(0, 3).join(" | ")}`);
  }
  await browser.close();
  server.close();
  console.log(`\n${failed} échec(s)`);
  process.exit(failed ? 1 : 0);
})();
