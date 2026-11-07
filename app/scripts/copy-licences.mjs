// Copie les textes de licence dans le site construit (dist/licences/).
// Babylon.js (Apache-2.0) : sa licence et les mentions de NOTICE.md doivent accompagner toute redistribution
// (section 4, alinéas a et d de la licence Apache-2.0). Notre code est sous MIT, nos contenus sous CC BY-SA 4.0.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
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

mkdirSync(out, { recursive: true });
for (const [from, name] of files) {
  if (!existsSync(from)) {
    console.error(`Licence introuvable : ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(out, name));
  console.log(`licences/${name}`);
}
