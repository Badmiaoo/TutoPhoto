// Fiche d'une notion ou d'une situation, ouverte par-dessus le simulateur (décision de Julien du 11 novembre 2026 :
// on ne perd ni la scène ni les réglages). La fenêtre affiche la page statique de la fiche (fiches/<langue>/<ID>.html,
// produite par app/scripts/build-pages.mjs), sans son en-tête ni son bouton vers le simulateur. Les liens vers
// d'autres fiches restent dans la fenêtre ; les liens vers les sources s'ouvrent dans un nouvel onglet.
// Tout élément qui porte data-fiche="ID" (bulletin, fenêtre « Défis ») ouvre la fiche ID.

import { t, type Lang } from "../i18n";

const ID = /^[A-Z]{3}-\d{2}$/;

interface FicheElements {
  dialog: HTMLDialogElement;
  body: HTMLElement;
  page: HTMLAnchorElement;
  close: HTMLButtonElement;
}

export class FicheDialog {
  private lang: Lang;
  private current: string | null = null;

  constructor(
    private readonly el: FicheElements,
    lang: Lang,
  ) {
    this.lang = lang;
    document.addEventListener("click", (e) => {
      const opener = (e.target as Element | null)?.closest<HTMLElement>("[data-fiche]");
      if (!opener?.dataset.fiche) return;
      e.preventDefault();
      void this.open(opener.dataset.fiche);
    });
    el.body.addEventListener("click", (e) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      const m = link ? /^([A-Z]{3}-\d{2})\.html$/.exec(link.getAttribute("href") ?? "") : null;
      if (!m) return;
      e.preventDefault();
      void this.open(m[1]);
    });
    this.setLang(lang);
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    this.el.page.textContent = t(lang, "fichePage");
    this.el.close.textContent = t(lang, "close");
    if (this.current && this.el.dialog.open) void this.open(this.current);
  }

  async open(id: string): Promise<void> {
    if (!ID.test(id)) return;
    this.current = id;
    const url = `../fiches/${this.lang}/${id}.html`;
    this.el.page.href = url;
    let nodes: Node[];
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const page = new DOMParser().parseFromString(await response.text(), "text/html");
      const main = page.querySelector("main");
      if (!main) throw new Error("main");
      main.querySelectorAll(".crumb, .actions, script").forEach((n) => n.remove());
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
      p.textContent = `${id} : ${t(this.lang, "ficheUnavailable")}`;
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
