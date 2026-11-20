// Espaces de la ponctuation française, pour les textes du simulateur (`texts.ts`) et de l'activité de LUM-02.

/**
 * Espaces de la ponctuation française, posées ici pour tous les textes plutôt qu'écrites dans chacun : espace
 * insécable (U+00A0) avant « : » et à l'intérieur des guillemets, espace fine insécable (U+202F) avant « ; », « ? »
 * et « ! » (https://en.wikipedia.org/wiki/Non-breaking_space, section « Spacing punctuation in French », d'après le Lexique
 * des règles typographiques de l'Imprimerie nationale ; `data/sources.yaml`, wikipedia-non-breaking-space). Une ligne ne peut
 * plus commencer par la ponctuation (Sujet 13). Les textes composés dans `ui/` écrivent ces espaces eux-mêmes. Module à part pour que l'activité de LUM-02 s'en serve sans charger la table du simulateur (Sujet 14).
 */
export function frenchSpaces(text: string): string {
  return text
    .replace(/ :/g, "\u00a0:")
    .replace(/ ([;?!])/g, "\u202f$1")
    .replace(/« /g, "«\u00a0")
    .replace(/ »/g, "\u00a0»");
}
