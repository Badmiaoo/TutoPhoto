// Textes de l'interface, en français et en anglais : chaque texte a une clé stable et deux langues.

export type Lang = "fr" | "en";

const messages = {
  fr: {
    subtitle: "Simulateur photo : la scène de parc, en construction",
    switchLang: "English",
    licences: "Licences",
    credits: "Crédits",
    creditsTitle: "Crédits de la scène",
    creditsIntro: "Les éléments de la scène, leurs auteurs et leurs licences.",
    by: "par",
    changes: "Modifications :",
    close: "Fermer",
    aperture: "Ouverture",
    shutter: "Vitesse",
    iso: "ISO",
    focal: "Focale",
    decrease: "moins",
    increase: "plus",
    meter: "Exposition",
    meterUnit: "IL",
    meterHelp: "0 : exposition correcte. Plus : photo plus claire. Moins : photo plus sombre.",
    bodyTitle: "Boîtier de référence",
    brand: "Marque",
    format: "Format",
    fullFrame: "Plein format",
    apsc: "APS-C",
    sensor: "Capteur",
    shutterButton: "Déclencher",
    computing: "Calcul de la photo…",
    reviewBack: "Revenir au viseur",
    save: "Enregistrer la photo",
    focusHint: "Touchez le viseur pour choisir le point de mise au point.",
    focusPoint: "Point de mise au point",
    renders: "rendus",
    computedIn: "calculée en",
    focusedAt: "mise au point à",
    photoError: "La photo n'a pas pu être calculée.",
    previewButton: "Aperçu",
    previewTitle: "Aperçu dans le viseur",
    previewAll: "Aperçu des réglages",
    previewBrightness: "Luminosité (exposition)",
    previewNoise: "Bruit numérique",
    previewNote:
      "Coupé, le viseur reste correctement exposé et sans bruit, quels que soient les réglages : il faut lire la cellule et anticiper. Le Sony A7 III (« Live View Display ») et le Nikon Z 6 (« Apply settings to live view ») proposent ce choix pour la luminosité. La photo garde toujours tous les effets.",
    previewOff: "Aperçu coupé",
    previewBrightnessShort: "luminosité",
    previewNoiseShort: "bruit",
    and: " et ",
    loupe: "Loupe",
    problemError: "Erreur",
    problemNoise: "Bruit du viseur indisponible sur cet appareil",
    problemLate: "Scène affichée avant d'être prête, éléments en attente",
    percent: " %",
    loupeHelp: "Grossit l'image autour du point de mise au point, jusqu'à 100 % : un pixel de l'écran pour un photosite du capteur.",
    reviewWhole: "Photo entière",
    reviewHint: "Touchez la photo pour la voir à 100 % à cet endroit.",
    lensNote: "Objectif virtuel : zoom de 18 à 200 mm ouvrant à f/1.4 sur toute la plage. Il n'existe pas ; il sert à couvrir les trois situations.",
    sceneLabel: "Viseur : un parc en automne. Faire glisser pour tourner l'appareil.",
    loading: "Chargement de la scène…",
    loadError: "La scène n'a pas pu être chargée.",
    noWebgl: "Ce navigateur ne permet pas d'afficher la scène 3D (WebGL indisponible).",
  },
  en: {
    subtitle: "Photography simulator: the park scene, under construction",
    switchLang: "Français",
    licences: "Licenses",
    credits: "Credits",
    creditsTitle: "Scene credits",
    creditsIntro: "The elements of the scene, their authors and their licenses.",
    by: "by",
    changes: "Changes:",
    close: "Close",
    aperture: "Aperture",
    shutter: "Shutter speed",
    iso: "ISO",
    focal: "Focal length",
    decrease: "less",
    increase: "more",
    meter: "Exposure",
    meterUnit: "EV",
    meterHelp: "0: correct exposure. Plus: brighter photo. Minus: darker photo.",
    bodyTitle: "Reference camera",
    brand: "Brand",
    format: "Format",
    fullFrame: "Full frame",
    apsc: "APS-C",
    sensor: "Sensor",
    shutterButton: "Release shutter",
    computing: "Computing the photo…",
    reviewBack: "Back to the viewfinder",
    save: "Save the photo",
    focusHint: "Tap the viewfinder to choose the focus point.",
    focusPoint: "Focus point",
    renders: "renders",
    computedIn: "computed in",
    focusedAt: "focused at",
    photoError: "The photo could not be computed.",
    previewButton: "Preview",
    previewTitle: "Viewfinder preview",
    previewAll: "Preview of the settings",
    previewBrightness: "Brightness (exposure)",
    previewNoise: "Digital noise",
    previewNote:
      "When off, the viewfinder stays correctly exposed and free of noise whatever the settings: read the meter and anticipate. The Sony A7 III (“Live View Display”) and the Nikon Z 6 (“Apply settings to live view”) offer this choice for brightness. The photo always keeps every effect.",
    previewOff: "Preview off",
    previewBrightnessShort: "brightness",
    previewNoiseShort: "noise",
    and: " and ",
    loupe: "Magnifier",
    problemError: "Error",
    problemNoise: "Viewfinder noise unavailable on this device",
    problemLate: "Scene shown before it was ready, elements still waiting",
    percent: "%",
    loupeHelp: "Enlarges the image around the focus point, up to 100%: one screen pixel per sensor photosite.",
    reviewWhole: "Whole photo",
    reviewHint: "Tap the photo to see it at 100% at that spot.",
    lensNote: "Virtual lens: an 18–200 mm zoom with f/1.4 across the whole range. It does not exist; it covers the three situations.",
    sceneLabel: "Viewfinder: a park in autumn. Drag to turn the camera.",
    loading: "Loading the scene…",
    loadError: "The scene could not be loaded.",
    noWebgl: "This browser cannot display the 3D scene (WebGL unavailable).",
  },
} satisfies Record<Lang, Record<string, string>>;

export type MessageKey = keyof typeof messages.fr;

const STORAGE_KEY = "tutophoto.lang";

/** Langue choisie : paramètre ?lang=, sinon choix mémorisé, sinon langue du navigateur, sinon français. */
export function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (fromUrl === "fr" || fromUrl === "en") return fromUrl;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en") return saved;
  } catch {
    // Stockage indisponible (navigation privée, réglages) : on continue sans.
  }
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function rememberLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Sans stockage, le choix vaut pour la page en cours seulement.
  }
}

export function t(lang: Lang, key: MessageKey): string {
  return messages[lang][key];
}
