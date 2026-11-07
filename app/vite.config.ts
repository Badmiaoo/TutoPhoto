import { defineConfig } from "vite";

export default defineConfig({
  // Chemins relatifs : le site fonctionne sous https://<compte>.github.io/TutoPhoto/ comme en local.
  base: "./",
  build: {
    outDir: "dist",
    // Pas de polyfill de préchargement : le site publié ne contient ainsi que notre code et celui de Babylon.js.
    modulePreload: { polyfill: false },
  },
});
