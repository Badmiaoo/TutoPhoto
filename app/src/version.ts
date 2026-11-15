// Version du site, pour la fenêtre des crédits et la ligne de diagnostic (constat ARC-12 de l'audit, version 0.3.59).
// Vite remplace __TUTOPHOTO_VERSION__ à la construction (option « define » de vite.config.ts) par le numéro du
// premier titre de version de CHANGELOG.md, lu par scripts/version.mjs : sur une pull request, la version à venir ;
// sur main, la version publiée. À n'importer que du simulateur : la construction de l'activité de LUM-02
// (vite.activites.config.ts) ne définit pas cette constante.

import { t, type Lang } from "./i18n";

declare const __TUTOPHOTO_VERSION__: string;

/** Numéro de la version, sous la forme X.Y.Z. */
export const VERSION: string = __TUTOPHOTO_VERSION__;

/** « Version du site : X.Y.Z », dans la langue demandée. */
export function siteVersion(lang: Lang): string {
  return t(lang, "siteVersion").replace("{version}", VERSION);
}
