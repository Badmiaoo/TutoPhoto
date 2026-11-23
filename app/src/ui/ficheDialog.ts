// Fiche d'une notion ou d'une situation, ouverte par-dessus le simulateur (décision de Julien du 11 novembre 2026 :
// on ne perd ni la scène ni les réglages). La fenêtre affiche la page statique de la fiche (fiches/<ID>.html,
// produite par app/scripts/build-pages.mjs), sans son en-tête ni son bouton vers le simulateur. Les liens vers
// d'autres fiches restent dans la fenêtre ; les liens vers les sources s'ouvrent dans un nouvel onglet.
// Tout élément qui porte data-fiche="ID" (bulletin, fenêtre « Défis ») ouvre la fiche ID.

import { FICHE_ID } from "../ficheId.mjs";
import { t } from "../texts";

// Identifiant de fiche, et lien vers une autre fiche dans la page affichée : la même forme que la construction des
// pages, « SIT-V2-02 » compris (ficheId.mjs ; constat RST-01 de l'audit, Sujet 21, version 0.3.81).
const ID = new RegExp(`^${FICHE_ID}$`);
const LINK = new RegExp(`^(${FICHE_ID})\\.html$`);

interface FicheElements {
  dialog: HTMLDialogElement;
  body: HTMLElement;
  page: HTMLAnchorElement;
  close: HTMLButtonElement;
}

export class FicheDialog {
  private current: string | null = null;

  constructor(
    private readonly el: FicheElements,
  ) {
    document.addEventListener("click", (e) => {
      const opener = (e.target as Element | null)?.closest<HTMLElement>("[data-fiche]");
      if (!opener?.dataset.fiche) return;
      e.preventDefault();
      void this.open(opener.dataset.fiche);
    });
    el.body.addEventListener("click", (e) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      const m = link ? LINK.exec(link.getAttribute("href") ?? "") : null;
      if (!m) return;
      e.preventDefault();
      void this.open(m[1]);
    });
    this.applyTexts();
  }

  applyTexts(): void {
    this.el.page.textContent = t("fichePage");
    this.el.close.textContent = t("close");
  }

  async open(id: string): Promise<void> {
    if (!ID.test(id)) return;
    this.current = id;
    const url = `../fiches/${id}.html`;
    this.el.page.href = url;
    let nodes: Node[];
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const page = new DOMParser().parseFromString(await response.text(), "text/html");
      const main = page.querySelector("main");
      if (!main) throw new Error("main");
      main.querySelectorAll(".crumb, .actions, script").forEach((n) => n.remove());
      // Le titre de la fiche devient un titre de niveau 2, sous celui de la page : ses sections descendent d'un niveau,
      // pour ne pas être au niveau de son titre (constat INT-19 de l'audit, point 8, version 0.4.7 ; critère « Info and
      // Relationships » du WCAG 2.2 [wcag-22-info-and-relationships]). Du plus profond
      // au moins profond, pour ne descendre chaque titre qu'une fois.
      for (const level of [5, 4, 3, 2]) {
        main.querySelectorAll(`h${level}`).forEach((heading) => {
          const lower = page.createElement(`h${level + 1}`);
          for (const attribute of heading.attributes) lower.setAttribute(attribute.name, attribute.value);
          lower.append(...heading.childNodes);
          heading.replaceWith(lower);
        });
      }
      const title = main.querySelector("h1");
      if (title) {
        const h2 = page.createElement("h2");
        h2.id = "fiche-title";
        h2.append(...title.childNodes);
        title.replaceWith(h2);
      }
      main.querySelectorAll<HTMLAnchorElement>("a[href^='https://']").forEach((a) => {
        a.target = "_blank";
        a.rel = "noopener";
      });
      nodes = [...main.childNodes].map((n) => document.importNode(n, true));
    } catch {
      const p = document.createElement("p");
      p.id = "fiche-title";
      p.textContent = `${id}\u00a0: ${t("ficheUnavailable")}`;
      nodes = [p];
    }
    // La fiche a pu changer pendant le chargement (deux clics rapides) : on n'affiche que la dernière.
    if (this.current !== id) return;
    this.el.body.replaceChildren(...nodes);
    this.el.body.scrollTop = 0;
    this.el.dialog.scrollTop = 0;
    if (!this.el.dialog.open) this.el.dialog.showModal();
  }
}
