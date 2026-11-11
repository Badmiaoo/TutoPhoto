// Crédits de la scène : auteurs, licences et adresses d'origine, lus dans scene.json.
// Les licences CC BY exigent d'attribuer l'œuvre ; on attribue aussi les éléments CC0, par courtoisie.

import { t, type Lang } from "./i18n";

interface Bilingual {
  fr: string;
  en: string;
}

interface SceneAsset {
  id: string;
  title: string;
  role: Bilingual;
  authors: string[];
  source: string;
  license: "CC0-1.0" | "CC-BY-4.0";
  license_url: string;
  changes?: Bilingual;
  /** Fichiers de l'élément, chemin relatif au dossier de la scène et taille en octets. */
  files?: { path: string; bytes: number }[];
}

export interface SceneManifest {
  title: Bilingual;
  assets: SceneAsset[];
}

const LICENSE_NAMES: Record<SceneAsset["license"], string> = {
  "CC0-1.0": "CC0 1.0",
  "CC-BY-4.0": "CC BY 4.0",
};

export async function loadManifest(url: string): Promise<SceneManifest> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} : ${response.status}`);
  return (await response.json()) as SceneManifest;
}

function link(href: string, text: string): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  a.rel = "noopener";
  a.target = "_blank";
  return a;
}

/** Remplit la liste des crédits dans la langue demandée. */
export function renderCredits(list: HTMLElement, manifest: SceneManifest, lang: Lang): void {
  list.replaceChildren();
  for (const asset of manifest.assets) {
    const item = document.createElement("li");
    const role = document.createElement("span");
    role.className = "role";
    role.textContent = asset.role[lang];
    item.append(
      role,
      document.createElement("br"),
      link(asset.source, asset.title),
      ` ${t(lang, "by")} ${asset.authors.join(", ")}, `,
      link(asset.license_url, LICENSE_NAMES[asset.license]),
    );
    if (asset.changes) {
      item.append(document.createElement("br"), `${t(lang, "changes")} ${asset.changes[lang]}`);
    }
    list.append(item);
  }
}
