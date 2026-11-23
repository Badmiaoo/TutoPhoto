// Copie les textes de licence dans le site construit (dist/licences/).
// Babylon.js (Apache-2.0) : sa licence et les mentions de NOTICE.md doivent accompagner toute redistribution
// (section 4, alinéas a et d de la licence Apache-2.0). Notre code est sous MIT, nos contenus sous CC BY-SA 4.0.
// Depuis la version 0.4.14 (Sujet 46 du plan de corrections, décision D13 ; constats LIC-08 et PHY-19 de l'audit) :
// - Vite et Rolldown (MIT) : la construction ajoute au fichier du simulateur la fonction de préchargement de Vite et
//   deux fonctions d'assemblage de Rolldown ([vite-preload-helper], [rolldown-runtime-base]). La licence MIT demande
//   que sa notice accompagne « all copies or substantial portions of the Software » ; si ces fonctions en sont une, je
//   ne sais pas : leurs licences sont recopiées par prudence. De LICENSE.md de Vite, le premier bloc seulement
//   (« Vite core license ») : la suite porte sur les dépendances que le paquet embarque pour l'outil lui-même,
//   absentes du site [npm-vite]. De Rolldown, LICENSE et THIRD-PARTY-LICENSE, auquel LICENSE renvoie pour les parties
//   tirées d'autres bibliothèques [npm-rolldown].
// - bgfx (BSD à 2 clauses) : la boucle du flou du viseur et sa recomposition (src/camera/viewfinderDof.ts) reprennent
//   celles de l'exemple 45-bokeh de bgfx ; sa licence, recopiée telle quelle, est gardée dans le dépôt
//   (LICENSES/bgfx-LICENSE.txt) [bgfx-license].
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(app, "dist", "licences");
const files = [
  [join(app, "..", "LICENSE"), "tutophoto-LICENSE.txt"],
  [join(app, "..", "LICENSES", "CC-BY-SA-4.0.txt"), "CC-BY-SA-4.0.txt"],
  [join(app, "node_modules", "@babylonjs", "core", "license.md"), "babylonjs-license.md"],
  [join(app, "node_modules", "@babylonjs", "core", "NOTICE.md"), "babylonjs-NOTICE.md"],
  [join(app, "..", "LICENSES", "bgfx-LICENSE.txt"), "bgfx-LICENSE.txt"],
  [join(app, "node_modules", "rolldown", "LICENSE"), "rolldown-LICENSE.txt"],
  [join(app, "node_modules", "rolldown", "THIRD-PARTY-LICENSE"), "rolldown-THIRD-PARTY-LICENSE.txt"],
];

// @babylonjs/loaders a le même texte de licence que @babylonjs/core, et pas de NOTICE.md (vérifié le
// 8 novembre 2026, version 9.35.0) : une seule copie suffit, tant que les deux textes restent identiques.
const coreLicense = readFileSync(join(app, "node_modules", "@babylonjs", "core", "license.md"));
const loadersLicense = readFileSync(join(app, "node_modules", "@babylonjs", "loaders", "license.md"));
if (!coreLicense.equals(loadersLicense)) {
  console.error("Les licences de @babylonjs/core et @babylonjs/loaders diffèrent : copier les deux.");
  process.exit(1);
}
if (existsSync(join(app, "node_modules", "@babylonjs", "loaders", "NOTICE.md"))) {
  console.error("@babylonjs/loaders a désormais un NOTICE.md : le copier aussi.");
  process.exit(1);
}

// LICENSE.md de Vite : son premier bloc, du titre « # Vite core license » au titre « # Licenses of bundled
// dependencies » exclu (l. 1-24 dans Vite 8.3.6). La construction s'arrête si le fichier change de forme : relire
// alors ce qu'il faut en recopier.
const viteLicensePath = join(app, "node_modules", "vite", "LICENSE.md");
if (!existsSync(viteLicensePath)) {
  console.error(`Licence introuvable : ${viteLicensePath}`);
  process.exit(1);
}
const viteLicense = readFileSync(viteLicensePath, "utf8");
const bundled = viteLicense.indexOf("\n# Licenses of bundled dependencies");
const viteCore = bundled < 0 ? "" : `${viteLicense.slice(0, bundled).trimEnd()}\n`;
if (!viteCore.startsWith("# Vite core license\n") || !viteCore.includes("Permission is hereby granted")) {
  console.error("LICENSE.md de Vite a changé de forme : relire son premier bloc avant de le recopier.");
  process.exit(1);
}

mkdirSync(out, { recursive: true });
for (const [from, name] of files) {
  if (!existsSync(from)) {
    console.error(`Licence introuvable : ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(out, name));
  console.log(`licences/${name}`);
}
writeFileSync(join(out, "vite-LICENSE.md"), viteCore);
console.log("licences/vite-LICENSE.md");
