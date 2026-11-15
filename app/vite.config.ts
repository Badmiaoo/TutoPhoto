import { defineConfig } from "vite";
import { readVersion } from "./scripts/version.mjs";

export default defineConfig({
  // Chemins relatifs : le site fonctionne sous https://<compte>.github.io/TutoPhoto/ comme en local.
  base: "./",
  // Version du site (version 0.3.59) : le numéro du premier titre de version de CHANGELOG.md, lu par le lecteur
  // commun à cette construction et à scripts/build-pages.mjs. Sans titre de version, readVersion() échoue et la
  // construction s'arrête. La constante n'existe que dans le simulateur (src/version.ts) : l'activité de LUM-02
  // a sa propre construction, sans elle.
  define: { __TUTOPHOTO_VERSION__: JSON.stringify(readVersion()) },
  build: {
    outDir: "dist",
    // Pas de polyfill de préchargement : le site publié ne contient ainsi que notre code et celui de Babylon.js.
    modulePreload: { polyfill: false },
    rollupOptions: {
      // Le simulateur est sous simulateur/ depuis la version 0.3.46 ; l'activité de LUM-02 a sa propre construction
      // (vite.activites.config.ts) ; l'accueil et les fiches sont des pages
      // statiques produites après Vite par scripts/build-pages.mjs.
      // Chemin relatif à la racine du projet Vite (app/).
      input: { simulateur: "simulateur/index.html" },
      output: {
        // Un seul fichier JavaScript au lieu de 324 : Babylon.js charge ses shaders par des imports dynamiques,
        // et un seul fichier qui manque (réseau instable, 9 novembre 2026) bloquait tout le chargement.
        inlineDynamicImports: true,
      },
    },
  },
});
