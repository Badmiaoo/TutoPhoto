// Tests rapides (Sujet 26 du plan de corrections, constat ARC-05) : complète l'extension des imports.
//
// Le code de l'application importe ses modules sans extension (« ./exposure », « @babylonjs/core/Maths/math.vector »),
// comme Vite le permet. Node.js exige l'extension dans un import : « file extensions are mandatory in `import`
// statements » [nodejs-22-typescript]. Ce fichier, chargé par « node --import » (script « test » de package.json), essaie
// « .ts », puis « .js », quand Node.js ne trouve pas un module tel qu'il est écrit, par un crochet de résolution
// synchrone : « module.registerHooks », ajouté à Node.js 22.15.0, et dont la documentation dit « Stability: 1.1 -
// Active development » [nodejs-22-module-hooks]. Il ne change rien au code de l'application, ni à un import que
// Node.js trouve sans lui.
//   https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/typescript.md
//   https://raw.githubusercontent.com/nodejs/node/60553651579ec33ca1aef9e1eedab2c3855f1f7e/doc/api/module.md
import { registerHooks } from "node:module";

const EXTENSIONS = [".ts", ".js"];
const HAS_EXTENSION = /\.(?:[cm]?[jt]s|json)$/;

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code !== "ERR_MODULE_NOT_FOUND" || HAS_EXTENSION.test(specifier)) throw error;
      for (const extension of EXTENSIONS) {
        try {
          return nextResolve(specifier + extension, context);
        } catch (retry) {
          if (retry?.code !== "ERR_MODULE_NOT_FOUND") throw retry;
        }
      }
      throw error;
    }
  },
});
