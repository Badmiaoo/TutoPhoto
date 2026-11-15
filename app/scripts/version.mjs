// Version du site : le numéro X.Y.Z du premier titre de version de CHANGELOG.md (constat ARC-12 de l'audit,
// version 0.3.59). Sur une pull request, c'est la version à venir ; sur main, la version publiée : le tag n'est posé
// qu'après la fusion (.github/workflows/tag.yml).
//
// Un seul lecteur pour les deux constructions : vite.config.ts le donne au simulateur (option « define »),
// build-pages.mjs l'écrit dans le pied de l'accueil. Sa déclaration de types, pour vite.config.ts, est dans
// version.d.mts : les deux fichiers changent ensemble.
//
// Le titre a la forme contrôlée par scripts/changelog.py : « ## [X.Y.Z] - AAAA-MM-JJ ». La date du titre est celle
// de la section du changelog, pas celle de la publication : elle n'est pas rendue.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHANGELOG = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "CHANGELOG.md");
const HEADING = /^## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}$/;

/**
 * Numéro de version du premier titre de version du changelog.
 * Échoue si le changelog n'a aucun titre de version, ou si le premier est mal formé : la construction s'arrête,
 * plutôt que de publier un site sans numéro ou avec celui d'une version plus ancienne.
 * @param {string} [path] Chemin du changelog ; par défaut, CHANGELOG.md à la racine du dépôt.
 * @returns {string} Le numéro seul, par exemple « 0.3.59 ».
 */
export function readVersion(path = CHANGELOG) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const index = lines.findIndex((line) => line.startsWith("## ["));
  if (index < 0) {
    throw new Error(`${path} : aucun titre de version, attendu « ## [X.Y.Z] - AAAA-MM-JJ »`);
  }
  const match = HEADING.exec(lines[index]);
  if (!match) {
    throw new Error(`${path}:${index + 1} : premier titre de version mal formé, attendu « ## [X.Y.Z] - AAAA-MM-JJ » : ${lines[index]}`);
  }
  return match[1];
}
