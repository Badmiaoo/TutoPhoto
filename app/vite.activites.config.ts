import { defineConfig } from "vite";

// Activités interactives (version 0.3.50 : LUM-02), construites après le simulateur, dans le même dossier dist/.
// Construction à part : le simulateur tient en un seul fichier JavaScript (vite.config.ts), réglage que Vite
// n'accepte qu'avec une seule entrée.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    // Ne pas effacer le simulateur construit juste avant.
    emptyOutDir: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: { "activite-LUM-02": "activites/LUM-02/index.html" },
    },
  },
});
