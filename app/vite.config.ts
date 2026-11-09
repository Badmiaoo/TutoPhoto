import { defineConfig } from "vite";

export default defineConfig({
  // Chemins relatifs : le site fonctionne sous https://<compte>.github.io/TutoPhoto/ comme en local.
  base: "./",
  build: {
    outDir: "dist",
    // Pas de polyfill de préchargement : le site publié ne contient ainsi que notre code et celui de Babylon.js.
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        // Un seul fichier JavaScript au lieu de 324 : Babylon.js charge ses shaders par des imports dynamiques,
        // et un seul fichier qui manque (réseau instable, 9 novembre 2026) bloquait tout le chargement.
        inlineDynamicImports: true,
      },
    },
  },
});
