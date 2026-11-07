// Textes de l'interface, en français et en anglais : chaque texte a une clé stable et deux langues.

export type Lang = "fr" | "en";

const messages = {
  fr: {
    subtitle: "Simulateur photo : squelette de l'application",
    switchLang: "English",
    licences: "Licences",
    sceneLabel: "Scène 3D",
    noWebgl: "Ce navigateur ne permet pas d'afficher la scène 3D (WebGL indisponible).",
  },
  en: {
    subtitle: "Photography simulator: application skeleton",
    switchLang: "Français",
    licences: "Licenses",
    sceneLabel: "3D scene",
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
