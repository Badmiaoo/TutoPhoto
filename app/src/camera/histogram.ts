// Histogrammes et zones écrêtées de la photo calculée (MES-06, MES-07 ; version 0.3.57).
// Spécification : docs/specifications/histogramme-revue.md ; sources : docs/dossiers/viseur-aides.md, sections 3 et 4.
//
// Ce que disent les manuels (pages lues le 12 novembre 2026) :
// - Nikon Z 6, « Photo Information » [nikon-z6-photo-information] : « Histograms show tone distribution, with pixel
//   brightness (tone) plotted on the horizontal axis and the number of pixels on the vertical axis. » ; page « RGB
//   histogram », quatre histogrammes : « Histogram (RGB channel) », puis « red channel », « green channel », « blue
//   channel » ; page « Highlights » : « Highlights (areas that may be overexposed) ».
// - Sony A7 III, « List of icons on the monitor » [sony-a7iii-icons] : « Histogram (Luminance/R/G/B) ».
// - Nikon Z 6, « g6: Highlight Display » (vidéo) [nikon-z6-g6] : « If 255 is selected, the highlight display will
//   show only areas that are potentially overexposed. » C'est la seule valeur de seuil écrite dans les pages lues.
//   https://onlinemanual.nikonimglib.com/z7_z6/en/08_more_about_playback_02.html
//   https://helpguide.sony.net/ilc/1720/v1/en/contents/TP0001667671.html
//   https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_05_g06.html
//
// Calcul : sur les pixels 8 bits de la photo finale (après l'exposition, le bruit, l'écrêtage et la courbe), avant sa
// compression en JPEG. La loupe de l'écran de revue recalcule une fenêtre de la photo : ses mesures portent sur cette
// fenêtre, comme sur le Z 6 (« The histogram will be updated to show only the data for the portion of the image
// visible in the display. »).
//
// Choix de TutoPhoto, non sourcés (aucune page lue ne donne le calcul d'un boîtier) :
// - luminance : Y = 0,2126 R + 0,7152 V + 0,0722 B, arrondi à l'entier, sur les valeurs encodées de la photo. Les
//   coefficients sont ceux de la norme sRGB, tels que les donne Wikipedia [wikipedia-srgb], où ils pondèrent des
//   valeurs linéaires ; les appliquer aux valeurs encodées est un choix de TutoPhoto
//   (https://en.wikipedia.org/w/index.php?title=SRGB&oldid=1378992844, source secondaire) ;
// - 256 colonnes par histogramme, une par valeur ;
// - zone écrêtée : pixel dont au moins une couche vaut 255, appuyé sur la phrase de Nikon pour le seuil 255.
//
// Non simulé : les réglages d'image du boîtier (« Picture Control » sur le Z 6), que TutoPhoto n'applique pas à sa
// photo. Les pages lues ne disent pas sur quelle image un boîtier calcule ses histogrammes ; Nikon prévient que
// « Camera histograms are intended as a guide only and may differ from those displayed in imaging applications. »

/** Nombre de colonnes d'un histogramme : une par valeur d'un pixel 8 bits. */
export const TONE_LEVELS = 256;

/** Histogrammes dans l'ordre d'affichage du Sony A7 III et du Nikon Z 6 : luminance, rouge, vert, bleu. */
export const TONE_CHANNELS = ["luminance", "red", "green", "blue"] as const;
export type ToneChannel = (typeof TONE_CHANNELS)[number];

export interface PhotoTones {
  /** Nombre de pixels par valeur, de 0 (noir) à 255, pour chaque histogramme. */
  histograms: Record<ToneChannel, Uint32Array>;
  /** Dimensions de l'image mesurée, en pixels. */
  width: number;
  height: number;
  /** Nombre de pixels dont au moins une couche vaut 255. */
  clipped: number;
  /**
   * Zones écrêtées : un bit par pixel, lignes de haut en bas, bit de poids faible d'abord (pixel p : octet p >> 3,
   * bit p & 7). Null quand aucun pixel n'est écrêté.
   */
  mask: Uint8Array | null;
}

/** Mesure une image RGBA 8 bits, lignes de haut en bas (ImageData). */
export function measureTones(rgba: ArrayLike<number>, width: number, height: number): PhotoTones {
  const luminance = new Uint32Array(TONE_LEVELS);
  const red = new Uint32Array(TONE_LEVELS);
  const green = new Uint32Array(TONE_LEVELS);
  const blue = new Uint32Array(TONE_LEVELS);
  const count = width * height;
  const mask = new Uint8Array(Math.ceil(count / 8));
  let clipped = 0;
  for (let p = 0, i = 0; p < count; p++, i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    red[r]++;
    green[g]++;
    blue[b]++;
    luminance[Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)]++;
    if (r === 255 || g === 255 || b === 255) {
      mask[p >> 3] |= 1 << (p & 7);
      clipped++;
    }
  }
  return { histograms: { luminance, red, green, blue }, width, height, clipped, mask: clipped > 0 ? mask : null };
}

/**
 * Hauteurs des colonnes, de 0 à 1. Choix de TutoPhoto, non sourcé : l'histogramme est rapporté à sa colonne la plus
 * haute, colonnes 0 et 255 exclues du calcul de ce maximum, pour qu'un pic d'écrêtage n'écrase pas le reste ; ces
 * deux colonnes sont tracées à leur vraie hauteur, plafonnée au bord. Si tous les pixels sont dans ces deux colonnes,
 * le maximum est pris sur elles.
 */
export function columnHeights(columns: ArrayLike<number>): number[] {
  let max = 0;
  for (let i = 1; i < columns.length - 1; i++) max = Math.max(max, columns[i]);
  if (max === 0) max = Math.max(columns[0], columns[columns.length - 1]);
  return Array.from(columns, (n) => (max > 0 ? Math.min(1, n / max) : 0));
}
