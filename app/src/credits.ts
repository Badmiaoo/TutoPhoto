// Crédits de la scène : auteurs, licences et adresses d'origine, lus dans scene.json.
// Les licences CC BY exigent d'attribuer l'œuvre ; on attribue aussi les éléments CC0, par courtoisie.
// La fenêtre donne aussi la version du site, au-dessus de la liste des crédits (version 0.3.59).

import { frenchSpaces, t } from "./texts";
import { siteVersion } from "./version";

interface SceneAsset {
  id: string;
  title: string;
  role: string;
  authors: string[];
  source: string;
  license: "CC0-1.0" | "CC-BY-4.0";
  license_url: string;
  changes?: string;
  /** Fichiers de l'élément, chemin relatif au dossier de la scène et taille en octets. */
  files?: { path: string; bytes: number }[];
}

export interface SceneManifest {
  title: string;
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

/** Remplit la liste des crédits. */
export function renderCredits(list: HTMLElement, manifest: SceneManifest): void {
  list.replaceChildren();
  for (const asset of manifest.assets) {
    const item = document.createElement("li");
    const role = document.createElement("span");
    role.className = "role";
    role.textContent = frenchSpaces(asset.role); // textes du manifeste : mêmes espaces que l'interface (Sujet 13)
    item.append(
      role,
      document.createElement("br"),
      link(asset.source, asset.title),
      ` ${t("by")} ${asset.authors.join(", ")}, `,
      link(asset.license_url, LICENSE_NAMES[asset.license]),
    );
    if (asset.changes) {
      item.append(document.createElement("br"), `${t("changes")} ${frenchSpaces(asset.changes)}`);
    }
    list.append(item);
  }
}

/**
 * Manifeste non reçu : les licences CC BY de la scène demandent l'attribution, la fenêtre dit donc pourquoi la liste
 * manque, au lieu de rester vide (version 0.3.70, constat COD-06 de l'audit).
 */
export function renderCreditsUnavailable(list: HTMLElement): void {
  const item = document.createElement("li");
  item.textContent = t("creditsUnavailable");
  list.replaceChildren(item);
}

/**
 * Écrit la version du site dans la fenêtre des crédits. À part de renderCredits : la version ne dépend pas du
 * manifeste de la scène, et doit se lire même quand la scène ne se charge pas.
 */
export function renderVersion(target: HTMLElement): void {
  target.textContent = siteVersion();
}
