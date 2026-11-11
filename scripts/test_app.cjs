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
// - le viseur garde au moins 35 % de la hauteur de la fenêtre (iPhone : 41 % avant l'indicateur d'équilibre) ;
// - indicateur d'équilibre : zone nette et bruit excellent aux réglages par défaut ; au même point du sol,
//   immobile, le rapport signal/bruit à ISO 6400 tombe sous 40 % de celui à ISO 100 (environ 17 % attendus :
//   6 IL de sensibilité en plus, 0,87 IL d'exposition en plus, bruit photonique) ; traînée du chien évaluée ;
// - avec --photo : la photo se calcule, n'est pas noire, et la loupe de l'écran de revue fonctionne ;
// - avec --photo, rafale (BOI-12) : en Continu L à 5 vues par seconde, déclencheur tenu jusqu'à deux vues au
//   moins, espacées de 0,2 s sur l'horloge de la scène, que l'écran de revue fait défiler ;
// - mise au point (MAP-04, MAP-05, MAP-09), en fin de test parce que la vue change : AF-C et point sélectif par
//   défaut ; en zone automatique, un œil est détecté dans le groupe ; détection coupée, l'appareil prend le
//   sujet le plus proche ; en détection des animaux, l'œil du chien est détecté quand il passe (au plus 30 s) ;
//   en AF-S, toucher le bas du cadre verrouille la distance ; au même endroit, la zone large (L)
//   retient un sujet plus proche (le sol en bas du cadre) ; la distance ne bouge plus quand on relève
//   l'appareil (et, avec --photo, la photo la garde) ; repassé en AF-C, la distance suit la zone.

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
  // En rendu logiciel, une image avec profondeur de champ peut prendre plusieurs secondes.
  page.setDefaultTimeout(300000);
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

    const viewfinder = await page.evaluate(() => ({ h: document.getElementById("scene").clientHeight, vh: window.innerHeight }));
    check("viseur assez grand", viewfinder.h >= 0.35 * viewfinder.vh, `${viewfinder.h} px de haut, fenêtre de ${viewfinder.vh} px`);

    // Indicateur d'équilibre, réglages par défaut (50 mm, f/8, 1/100 s, ISO 100).
    const balanceLine = (id, pattern) =>
      page
        .waitForFunction(
          ([lineId, source]) => {
            const text = document.getElementById(lineId).textContent;
            return new RegExp(source).test(text) ? text : null;
          },
          [id, pattern.source],
          { timeout: 30000 },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => null);
    const noiseDefault = (await balanceLine("balance-noise", /bruit /)) ?? (await page.evaluate(() => document.getElementById("balance-noise").textContent));
    const dofDefault = await page.evaluate(() => document.getElementById("balance-dof").textContent);
    check(
      "indicateur d'équilibre aux réglages par défaut",
      /zone nette : \d+,\d m – (\d+,\d m|∞)/.test(dofDefault) && /ISO 100 · bruit excellent/.test(noiseDefault),
      `${dofDefault} | ${noiseDefault}`,
    );
    // Exposition (BOI-07, BOI-08, MES-04, MES-10) : M et ISO auto par défaut, comme le Z 6. L'ISO auto est coupé
    // pour les contrôles suivants, qui règlent l'ISO à la main.
    const setExposure = async ({ mode, autoIso, compensation }) => {
      await page.click("#meter-value");
      if (mode) await page.check(`#exposure-dialog input[name="exposureMode"][value="${mode}"]`);
      if (autoIso === true) await page.check('#exposure-dialog input[name="autoIso"]');
      if (autoIso === false) await page.uncheck('#exposure-dialog input[name="autoIso"]');
      if (compensation !== undefined) await page.selectOption('#exposure-dialog select[name="compensation"]', String(compensation));
      await page.click("#exposure-close");
    };
    const dialState = (dial) =>
      page.evaluate((d) => {
        const box = document.querySelector(`[data-box="${d}"]`);
        const out = box.querySelector("output");
        return {
          name: box.querySelector(".dial-name").textContent,
          value: out.textContent,
          flashing: out.classList.contains("flashing"),
          disabled: box.querySelector("button[data-step]").disabled,
        };
      }, dial);
    const meterText = () => page.evaluate(() => document.getElementById("meter-value").textContent);
    const isoDefault = await dialState("iso");
    const meterDefault = await meterText();
    check("exposition par défaut : M et ISO auto (Z 6)", /^M · /.test(meterDefault) && isoDefault.name === "ISO auto" && isoDefault.value === "100", `${meterDefault} ; ${isoDefault.name} ${isoDefault.value}`);
    await setExposure({ autoIso: false });

    // Vue de dessus (NET-01) et appareil déplaçable (NET-06). AF-C, zone automatique : l'œil de Sophia vers 6,6 m
    // (le point central, au bord de Sophia une fois l'appareil reculé, tombait parfois à côté d'elle sur le profil
    // Android). Reculé de 4 m en touchant la carte (x = 0, z = −4), l'appareil mesure environ 4 m de plus ;
    // « Retour au départ » le ramène. Carte : x de −8 à 8 m, z de 15 m (en haut) à −7 m (en bas).
    const badgeMetres = async () => {
      const m = /(\d+[,.]\d) m$/.exec(await page.evaluate(() => document.getElementById("af-badge").textContent));
      return m ? Number(m[1].replace(",", ".")) : NaN;
    };
    // Attend que la distance affichée en AF-C vérifie la condition (le rendu logiciel peut être lent) ; au plus 30 s.
    // « group » : le groupe, à moins de 9 m ; « farther » : plus de v + 3 m ; « back » : à 0,3 m près de v.
    const waitMetres = (kind, arg) =>
      page
        .waitForFunction(
          ([mode, value]) => {
            const m = /^AF-C · Auto · .* (\d+[,.]\d) m$/.exec(document.getElementById("af-badge").textContent);
            if (!m) return false;
            const d = Number(m[1].replace(",", "."));
            return mode === "group" ? d < 9 : mode === "farther" ? d > value + 3 : Math.abs(d - value) < 0.3;
          },
          [kind, arg],
          { timeout: 30000 },
        )
        .catch(() => undefined);
    const topCollapsed = !(await page.locator("#top-view-map").isVisible());
    if (topCollapsed) await page.click("#top-view-toggle");
    await page.click("#af-button");
    await page.check('#af-dialog input[name="focusMode"][value="continuous"]');
    await page.check('#af-dialog input[name="areaMode"][value="auto"]');
    await page.check('#af-dialog input[name="detection"][value="faceEye"]');
    await page.click("#af-close");
    await waitMetres("group", 0);
    const fromStart = await badgeMetres();
    const sharpCount = await page.evaluate(() => document.querySelectorAll("#top-view-map .top-things .sharp").length);
    const map = await page.locator("#top-view-map").boundingBox();
    await page.mouse.click(map.x + ((0 + 8) / 16) * map.width, map.y + ((4 + 15) / 22) * map.height);
    await waitMetres("farther", fromStart);
    const fromBack = await badgeMetres();
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-vue-de-dessus.png`), timeout: 120000 });
    await page.click("#top-view-reset");
    await waitMetres("back", fromStart);
    const fromReset = await badgeMetres();
    check(
      "vue de dessus : appareil reculé de 4 m, puis ramené",
      sharpCount > 0 && fromBack - fromStart > 3.5 && fromBack - fromStart < 4.5 && Math.abs(fromReset - fromStart) < 0.3,
      `${fromStart} m au départ, ${fromBack} m reculé, ${fromReset} m ramené ; ${sharpCount} sujets dans la zone nette`,
    );
    await page.click("#af-button");
    await page.check('#af-dialog input[name="focusMode"][value="single"]');
    await page.check('#af-dialog input[name="areaMode"][value="point"]');
    await page.click("#af-close");
    if (topCollapsed) await page.click("#top-view-toggle");

    // Point de mise au point sur le sol, immobile, en bas du cadre, pour comparer le bruit à deux ISO.
    const snrOf = (text) => {
      const m = /signal\/bruit (\d+):1/.exec(text ?? "");
      return m ? Number(m[1]) : NaN;
    };
    const groundBox = await page.locator("#frame").boundingBox();
    await page.mouse.click(groundBox.x + groundBox.width / 2, groundBox.y + 0.95 * groundBox.height);
    await page.waitForTimeout(2000);
    const groundLow = await page.evaluate(() => document.getElementById("balance-noise").textContent);

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
    const noiseHigh = (await balanceLine("balance-noise", /ISO 6400 · bruit /)) ?? (await page.evaluate(() => document.getElementById("balance-noise").textContent));
    const snrRatio = snrOf(noiseHigh) / snrOf(groundLow);
    check(
      "indicateur : bruit au même point du sol, ISO 6400 contre ISO 100",
      /ISO 100 · bruit excellent/.test(groundLow) && snrRatio < 0.4,
      `${groundLow} → ${noiseHigh} (rapport ${snrRatio.toFixed(2)})`,
    );
    await page.mouse.click(groundBox.x + groundBox.width / 2, groundBox.y + groundBox.height / 2);
    await page.click("#preview-button");
    await page.uncheck('#preview-dialog input[value="all"]');
    await page.click("#preview-close");
    await page.waitForTimeout(500);
    const quiet = await frameNoise(page);
    check("aperçu coupé : pas de bruit", Math.max(...quiet) < 0.05, quiet.map((v) => v.toFixed(2)).join(" / "));
    await page.click("#preview-button");
    await page.check('#preview-dialog input[value="all"]');
    await page.click("#preview-close");

    // Modes d'exposition, réglages de départ f/8, 1/4000 s, ISO 6400 sans ISO auto. Scène à 12,5 IL : en indices
    // d'échelle (tiers d'IL), ouverture + vitesse − ISO = 49,5 − correction (camera/exposureModes.ts).
    // A à ISO 6400 : vitesse 49,5 − 15 + 18 = 52,5, au-delà de 1/4000 s : elle clignote (trop de lumière).
    await setExposure({ mode: "A" });
    const aBright = await dialState("shutter");
    check(
      "mode A : vitesse au-delà de 1/4000 s, qui clignote",
      aBright.value === "1/4000 s" && aBright.flashing && aBright.disabled && /\(auto\)/.test(aBright.name),
      `${aBright.name} ${aBright.value}${aBright.flashing ? ", clignote" : ""}${aBright.disabled ? ", molette grisée" : ""}`,
    );
    // ISO 100 puis f/4 : vitesse 34,5 → 1/100 s, puis 40,5 → 1/400 s (à égalité, le cran qui assombrit).
    await clicks('[data-dial="iso"][data-step="-1"]', 18);
    const a8 = await dialState("shutter");
    await clicks('[data-dial="aperture"][data-step="-1"]', 6);
    const a4 = await dialState("shutter");
    check("mode A : la vitesse suit l'ouverture", a8.value === "1/100 s" && a4.value === "1/400 s" && !a4.flashing, `f/8 : ${a8.value} ; f/4 : ${a4.value}`);
    await clicks('[data-dial="aperture"][data-step="1"]', 6);
    // S à 1/4000 s, ISO 100 : ouverture −1,5, plus grande que f/1.4 : elle clignote (pas assez de lumière). Avec
    // l'ISO auto, ISO 125 et f/1.4.
    await setExposure({ mode: "S" });
    const sDark = await dialState("aperture");
    await setExposure({ autoIso: true });
    const sAuto = await dialState("aperture");
    const sIso = await dialState("iso");
    check(
      "mode S : ouverture à f/1.4 qui clignote, puis ISO auto",
      sDark.value === "f/1,4" && sDark.flashing && !sAuto.flashing && sIso.name === "ISO auto" && sIso.value === "125",
      `${sDark.value}${sDark.flashing ? " clignote" : ""} ; ISO auto : ${sAuto.value}, ${sIso.name} ${sIso.value}`,
    );
    // M, 1/100 s, ISO auto, correction +1 IL : ISO 15 + 35 − 46,5 = 3,5 → ISO 200 ; l'indicateur montre l'écart à
    // l'exposition visée, −0,2 IL.
    await clicks('[data-dial="shutter"][data-step="1"]', 16);
    await setExposure({ mode: "M", compensation: 3 });
    const mIso = await dialState("iso");
    const mMeter = await meterText();
    check(
      "mode M : ISO auto avec correction d'exposition",
      mIso.value === "200" && /^M · −0,2 IL · corr\. \+1,0$/.test(mMeter),
      `${mIso.name} ${mIso.value} ; ${mMeter}`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-exposition.png`), timeout: 120000 });
    // Retour aux réglages d'avant : M, sans correction ni ISO auto, f/8, 1/4000 s, ISO 6400.
    await setExposure({ compensation: 0, autoIso: false });
    await clicks('[data-dial="shutter"][data-step="-1"]', 16);
    await clicks('[data-dial="iso"][data-step="1"]', 18);

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
      check("légende : mode et réglages retenus", /^M · f\/8 · 1\/4000 s · ISO 6400 · 50 mm · /.test(photo.caption), photo.caption.slice(0, 60));
      const bulletinText = await page.evaluate(() => document.getElementById("review-bulletin").innerText);
      check("bulletin sous la photo", /Exposition : /.test(bulletinText) && /Zone nette : /.test(bulletinText), bulletinText.split("\n").slice(0, 3).join(" | "));
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-photo.png`), timeout: 120000 });
      const box = await page.locator("#review-image").boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(() => document.getElementById("progress").hidden && !document.getElementById("review-whole").hidden, null, { timeout: 300000 });
      const caption = await page.evaluate(() => document.getElementById("review-caption").textContent);
      check("loupe de l'écran de revue", /100/.test(caption), caption);
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-revue-loupe.png`), timeout: 120000 });
      await page.click("#review-back");
    }

    if (withPhoto) {
      // Défis (SIT-05, SIT-01), zone automatique avec détection des yeux : mise au point sur l'œil de Sophia, vers
      // 6,6 m. À f/8 et 50 mm, zone nette d'environ 4 m à 17 m : le groupe y est (SIT-05 réussi). À f/22, la distance
      // hyperfocale vaut 2500 / (22 × 0,02875) ≈ 4 m : mise au point à 6,6 m, la zone nette va jusqu'à l'infini et le
      // fond photo est net (SIT-01 à reprendre), quel que soit le cadrage (vertical sur le profil Android, où la
      // poubelle sort du cadre).
      const challengeShot = async (id) => {
        await page.click("#challenge-button");
        await page.check(`#challenge-dialog input[name="challenge"][value="${id}"]`);
        await page.click("#challenge-close");
        await page.click("#shutter-button");
        await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden && !document.getElementById("review-bulletin").hidden, null, { timeout: 300000 });
        const text = await page.evaluate(() => document.getElementById("review-bulletin").innerText);
        if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-defi-${id}.png`), timeout: 120000 });
        await page.click("#review-back");
        return text;
      };
      await page.click("#af-button");
      await page.check('#af-dialog input[name="focusMode"][value="continuous"]');
      await page.check('#af-dialog input[name="areaMode"][value="auto"]');
      await page.check('#af-dialog input[name="detection"][value="faceEye"]');
      await page.click("#af-close");
      await page
        .waitForFunction(() => /^AF-C · Auto · œil · /.test(document.getElementById("af-badge").textContent), null, { timeout: 30000 })
        .catch(() => undefined);
      const group = await challengeShot("SIT-05");
      check("défi SIT-05 : groupe net, réussi", /Défi SIT-05 · Photo de groupe : réussi/.test(group), group.split("\n").filter((l) => /Défi|Réussi|Manqué/.test(l)).join(" | "));
      await clicks('[data-dial="aperture"][data-step="1"]', 9);
      const portrait = await challengeShot("SIT-01");
      await clicks('[data-dial="aperture"][data-step="-1"]', 9);
      check(
        "défi SIT-01 à f/22 : fond encore net, à reprendre",
        /Défi SIT-01 · .* : à reprendre/.test(portrait) && /Manqué : fond derrière Sophia hors de la zone nette : encore net : .*le fond photo/.test(portrait) && /À revoir : NET-01/.test(portrait),
        portrait.split("\n").filter((l) => /Défi|Réussi|Manqué|À revoir/.test(l)).join(" | "),
      );
      await page.click("#challenge-button");
      await page.check('#challenge-dialog input[name="challenge"][value="none"]');
      await page.click("#challenge-close");
      await page.click("#af-button");
      await page.check('#af-dialog input[name="focusMode"][value="single"]');
      await page.check('#af-dialog input[name="areaMode"][value="point"]');
      await page.click("#af-close");
    }

    // Mise au point. Le bas du cadre montre le sol, proche ; relever l'appareil y amène le sol lointain ou le
    // fond. Les personnages bougent : en AF-C, on attend que la distance change, au plus 15 s.
    const afText = () => page.evaluate(() => document.getElementById("af-badge").textContent);
    const lockedMetres = (text) => {
      const m = /(\d+[,.]\d) m/.exec(text);
      return m ? Number(m[1].replace(",", ".")) : NaN;
    };
    const setAf = async (mode, area, detection) => {
      await page.click("#af-button");
      await page.check(`#af-dialog input[name="focusMode"][value="${mode}"]`);
      await page.check(`#af-dialog input[name="areaMode"][value="${area}"]`);
      if (detection) await page.check(`#af-dialog input[name="detection"][value="${detection}"]`);
      await page.click("#af-close");
    };
    // Attend que l'indicateur corresponde au motif et renvoie ce texte-là ; null au bout du délai.
    const waitBadge = (pattern, timeout) =>
      page
        .waitForFunction(
          (source) => {
            const text = document.getElementById("af-badge").textContent;
            return new RegExp(source).test(text) ? text : null;
          },
          pattern.source,
          { timeout },
        )
        .then((handle) => handle.jsonValue())
        .catch(() => null);
    const startText = await afText();
    check("mise au point : AF-S et point sélectif par défaut (Z 6)", /^AF-S · Point · /.test(startText), startText);

    // Zone automatique, vue de départ : le groupe est à environ 6,5 m.
    await setAf("continuous", "auto", "faceEye");
    const eyeText = (await waitBadge(/^AF-C · Auto · œil · \d+,\d m$/, 30000)) ?? (await afText());
    const eyeAt = lockedMetres(eyeText);
    const amber = await page.evaluate(() => document.getElementById("focus-marker").classList.contains("detected"));
    check("zone automatique : œil détecté dans le groupe", /œil/.test(eyeText) && amber && eyeAt > 5.5 && eyeAt < 7.5, `${eyeText}${amber ? ", repère ambre" : ""}`);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-zone-auto.png`), timeout: 120000 });
    await setAf("continuous", "auto", "off");
    const nearestText = (await waitBadge(/^AF-C · Auto · sujet le plus proche · /, 30000)) ?? (await afText());
    check(
      "zone automatique sans détection : sujet le plus proche",
      /sujet le plus proche/.test(nearestText) && lockedMetres(nearestText) < eyeAt,
      `${nearestText} ; œil : ${eyeText}`,
    );
    await setAf("continuous", "auto", "animal");
    // Le chien court entre x = −5 et 5 m, à 9 m de l'appareil, de profil.
    const dogText = await waitBadge(/^AF-C · Auto · (œil|visage) · /, 30000);
    const dogAt = dogText ? lockedMetres(dogText) : NaN;
    check("détection des animaux : œil ou visage du chien", Boolean(dogText) && dogAt > 8 && dogAt < 12, dogText ?? (await afText()));
    // À 1/4000 s, le chien (3,5 m/s à 9 m, 50 mm) laisse 50 × 3,5 × 0,00025 / 9 ≈ 0,005 mm, sous la limite,
    // soit 0,005 × 1500 / 35,9 ≈ 0,2 px sur la photo.
    const dogMotion = await balanceLine("balance-motion", /chien : /);
    const dogPixels = /\((\d+(?:,\d)?) px sur la photo\)/.exec(dogMotion ?? "");
    check(
      "indicateur : traînée du chien évaluée, en pixels",
      /1\/4000 s · chien : net/.test(dogMotion ?? "") && Boolean(dogPixels) && Number(dogPixels[1].replace(",", ".")) < 1,
      dogMotion ?? "chien non visé",
    );
    await setAf("continuous", "auto", "faceEye");
    await setAf("single", "point");
    const frameBox = await page.locator("#frame").boundingBox();
    const tapLow = async (previous) => {
      await page.mouse.click(frameBox.x + frameBox.width / 2, frameBox.y + 0.92 * frameBox.height);
      await page
        .waitForFunction(
          (before) => {
            const text = document.getElementById("af-badge").textContent;
            return document.getElementById("focus-marker").classList.contains("locked") && text !== before;
          },
          previous,
          { timeout: 30000 },
        )
        .catch(() => undefined);
      return afText();
    };
    const pointText = await tapLow(startText);
    const pointAt = lockedMetres(pointText);
    check("AF-S : toucher le viseur verrouille la distance", /^AF-S · Point · verrouillée à /.test(pointText), pointText);
    await setAf("single", "wideL");
    const lockedText = await tapLow(await afText());
    const lockedAt = lockedMetres(lockedText);
    check(
      "zone large (L) : sujet le plus proche de la zone",
      /^AF-S · Zone L · verrouillée à /.test(lockedText) && lockedAt < pointAt - 0.1,
      `${lockedText} ; point sélectif : ${pointText}`,
    );
    const cx = frameBox.x + frameBox.width / 2;
    const cy = frameBox.y + frameBox.height / 2;
    for (let k = 0; k < 2; k++) {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(cx, cy - 15 * i);
      await page.mouse.up();
    }
    await page.waitForTimeout(2500);
    const tiltedText = await afText();
    check("AF-S : distance gardée en relevant l'appareil", tiltedText === lockedText, tiltedText);
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-af-s.png`), timeout: 120000 });
    if (withPhoto) {
      await page.click("#shutter-button");
      await page.waitForFunction(() => !document.getElementById("review").hidden && document.getElementById("progress").hidden, null, { timeout: 300000 });
      const caption = await page.evaluate(() => document.getElementById("review-caption").textContent);
      const m = /AF-S · Zone L · mise au point verrouillée à (\d+[,.]\d) m/.exec(caption);
      check("AF-S : la photo garde la distance verrouillée", Boolean(m) && Number(m[1].replace(",", ".")) === lockedAt, caption);
      await page.click("#review-back");
    }
    await setAf("continuous", "wideL");
    const followed = await page
      .waitForFunction(
        (locked) => {
          const text = document.getElementById("af-badge").textContent;
          const m = /^AF-C · Zone L · (\d+[,.]\d) m/.exec(text);
          // Seuil de 0,2 m (deux pas d'affichage). Depuis la version 0.3.34, la zone large est rognée à la zone couverte
          // par l'autofocus : la distance verrouillée vaut 5,8 m au lieu de 5,4 m, et l'écart avec la mesure en AF-C
          // après avoir relevé l'appareil (6,2 à 6,5 m dans les routines) n'est plus que de 0,5 à 0,7 m.
          return Boolean(m) && Math.abs(Number(m[1].replace(",", ".")) - locked) > 0.2;
        },
        lockedAt,
        { timeout: 15000 },
      )
      .then(() => true)
      .catch(() => false);
    check("AF-C : la distance suit la zone", followed, `${await afText()} ; avant : ${lockedText}`);

    // Collimateurs (MAP-06) : la couverture de l'AF du Z 6 est d'environ 90 % du cadre en largeur et en
    // hauteur. Un toucher dans le coin haut droit du cadre (l'indicateur d'équilibre occupe le coin haut gauche)
    // ramène le point au bord de la zone couverte, à 5 % des bords.
    await setAf("continuous", "point");
    await page.mouse.click(frameBox.x + 0.99 * frameBox.width, frameBox.y + 0.01 * frameBox.height);
    await page.waitForTimeout(500);
    const coverage = await page.locator("#af-coverage").boundingBox();
    const marker = await page.locator("#focus-marker").boundingBox();
    const at = (box) => ({
      x: (box.x + box.width / 2 - frameBox.x) / frameBox.width,
      y: (box.y + box.height / 2 - frameBox.y) / frameBox.height,
    });
    const markerAt = marker ? at(marker) : { x: NaN, y: NaN };
    const coverageShare = coverage ? { x: coverage.width / frameBox.width, y: coverage.height / frameBox.height } : { x: NaN, y: NaN };
    check(
      "collimateurs : point ramené dans la zone couverte (90 %)",
      Math.abs(markerAt.x - 0.95) < 0.01 && Math.abs(markerAt.y - 0.05) < 0.01 && Math.abs(coverageShare.x - 0.9) < 0.01 && Math.abs(coverageShare.y - 0.9) < 0.01,
      `repère à ${(markerAt.x * 100).toFixed(1)} % × ${(markerAt.y * 100).toFixed(1)} % du cadre ; zone couverte ${(coverageShare.x * 100).toFixed(1)} % × ${(coverageShare.y * 100).toFixed(1)} %`,
    );
    if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-collimateurs.png`), timeout: 120000 });
    // Canon EOS RP : « 88% horizontal and 100% vertical coverage » (fiche de Canon) ; en cadre vertical (profil
    // Android), grand et petit côtés du capteur sont échangés.
    const setBody = async (brand) => {
      await page.click("#body-button");
      await page.check(`#body-dialog input[name="brand"][value="${brand}"]`);
      await page.check('#body-dialog input[name="format"][value="ff"]');
      await page.click("#body-close");
    };
    await setBody("canon");
    const rpFrame = await page.locator("#frame").boundingBox();
    await page.mouse.click(rpFrame.x + 0.99 * rpFrame.width, rpFrame.y + 0.01 * rpFrame.height);
    await page.waitForTimeout(500);
    const rpCoverage = await page.locator("#af-coverage").boundingBox();
    const rpMarker = await page.locator("#focus-marker").boundingBox();
    const rpAt = rpMarker
      ? { x: (rpMarker.x + rpMarker.width / 2 - rpFrame.x) / rpFrame.width, y: (rpMarker.y + rpMarker.height / 2 - rpFrame.y) / rpFrame.height }
      : { x: NaN, y: NaN };
    const rpShare = rpCoverage ? { x: rpCoverage.width / rpFrame.width, y: rpCoverage.height / rpFrame.height } : { x: NaN, y: NaN };
    const vertical = rpFrame.height > rpFrame.width;
    const expected = vertical ? { x: 0.99, y: 0.06, w: 1, h: 0.88 } : { x: 0.94, y: 0.01, w: 0.88, h: 1 };
    check(
      "collimateurs : couverture du Canon EOS RP (88 % × 100 %)",
      Math.abs(rpAt.x - expected.x) < 0.01 && Math.abs(rpAt.y - expected.y) < 0.01 && Math.abs(rpShare.x - expected.w) < 0.01 && Math.abs(rpShare.y - expected.h) < 0.01,
      `cadre ${vertical ? "vertical" : "horizontal"} ; repère à ${(rpAt.x * 100).toFixed(1)} % × ${(rpAt.y * 100).toFixed(1)} % ; zone couverte ${(rpShare.x * 100).toFixed(1)} % × ${(rpShare.y * 100).toFixed(1)} %`,
    );
    await setBody("nikon");
    await page.mouse.click(frameBox.x + frameBox.width / 2, frameBox.y + frameBox.height / 2);

    if (withPhoto) {
      // Rafale : Continu L à 5 vues par seconde. En rendu logiciel, l'horloge de la scène avance moins vite que
      // le temps réel (100 ms au plus par image) : le déclencheur est relâché quand le bouton annonce au moins
      // deux vues, et non au bout d'une durée fixe (une seconde ne suffisait pas sur les profils mobiles).
      await page.click("#release-button");
      await page.check('#release-dialog input[name="release"][value="cl"]');
      await page.selectOption('#release-dialog select[name="clRate"]', "5");
      await page.click("#release-close");
      const shutterBox = await page.locator("#shutter-button").boundingBox();
      await page.mouse.move(shutterBox.x + shutterBox.width / 2, shutterBox.y + shutterBox.height / 2);
      await page.mouse.down();
      await page.waitForFunction(() => /Rafale : ([2-9]|\d\d) vues/.test(document.getElementById("shutter-button").textContent), null, { timeout: 60000 });
      await page.mouse.up();
      await page.waitForFunction(() => !document.getElementById("review").hidden && !document.getElementById("review-series").hidden, null, { timeout: 300000 });
      const first = await page.evaluate(() => ({ count: document.getElementById("review-count").textContent, caption: document.getElementById("review-caption").textContent }));
      await page.click("#review-next");
      const second = await page.evaluate(() => document.getElementById("review-caption").textContent);
      check(
        "rafale : série de vues espacées de 0,2 s",
        /^Vue 1\/[2-9]\d* · \+0,00 s · /.test(first.caption) && /^Vue 2\/\d+ · \+0,20 s · /.test(second),
        `${first.count} ; ${first.caption.slice(0, 60)} | ${second.slice(0, 60)}`,
      );
      if (outDir) await page.screenshot({ path: path.join(outDir, `${name}-rafale.png`), timeout: 120000 });
      await page.click("#review-back");
      await page.click("#release-button");
      await page.check('#release-dialog input[name="release"][value="single"]');
      await page.click("#release-close");
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
