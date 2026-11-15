// Types de version.mjs, pour vite.config.ts : tsc ne lit pas les fichiers JavaScript (tsconfig.json sans « allowJs »).

/**
 * Numéro X.Y.Z du premier titre de version du changelog ; échoue s'il n'y en a pas ou s'il est mal formé.
 * @param path Chemin du changelog ; par défaut, CHANGELOG.md à la racine du dépôt.
 */
export function readVersion(path?: string): string;
