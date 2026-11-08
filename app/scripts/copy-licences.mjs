// Copie les textes de licence dans le site construit (dist/licences/).
// Babylon.js (Apache-2.0) : sa licence et les mentions de NOTICE.md doivent accompagner toute redistribution
// (section 4, alinéas a et d de la licence Apache-2.0). Notre code est sous MIT, nos contenus sous CC BY-SA 4.0.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(app, "dist", "licences");
const files = [
  [join(app, "..", "LICENSE"), "tutophoto-LICENSE.txt"],
  [join(app, "..", "LICENSES", "CC-BY-SA-4.0.txt"), "CC-BY-SA-4.0.txt"],
  [join(app, "node_modules", "@babylonjs", "core", "license.md"), "babylonjs-license.md"],
  [join(app, "node_modules", "@babylonjs", "core", "NOTICE.md"), "babylonjs-NOTICE.md"],
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

mkdirSync(out, { recursive: true });
for (const [from, name] of files) {
  if (!existsSync(from)) {
    console.error(`Licence introuvable : ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(out, name));
  console.log(`licences/${name}`);
}
