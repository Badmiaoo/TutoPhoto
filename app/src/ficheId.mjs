// Identifiant d'une fiche, notion ou situation (constat RST-01 de l'audit, Sujet 21, version 0.3.81) : trois lettres
// majuscules, un tiret et deux chiffres (« EXP-04 », « SIT-05 »), ou « SIT-V2- » et deux chiffres, les identifiants des
// anciennes situations V2, gardés tels quels (docs/lire-le-referentiel.md ; schemas/situations.schema.json). Jusqu'à
// la version 0.3.80, la construction des pages et la fenêtre de fiche du simulateur ne connaissaient que la première
// forme : une fiche SIT-V2-02 arrêtait la construction, et le simulateur ne l'ouvrait pas.
//
// Une seule expression pour ses deux lecteurs : app/scripts/build-pages.mjs, qui construit les pages des fiches, et
// src/ui/ficheDialog.ts, qui les ouvre par-dessus le simulateur. Ce fichier est en JavaScript pour que Node le lise
// sans compilation ; sa déclaration de types, pour ficheDialog.ts, est dans ficheId.d.mts : les deux fichiers changent
// ensemble. schemas/relecture.schema.json écrit la même forme pour data/relecture.yaml.

/** Forme d'un identifiant de fiche, sans ancre ni groupe capturant, à placer dans une expression régulière. */
export const FICHE_ID = "(?:[A-Z]{3}|SIT-V2)-\\d{2}";
