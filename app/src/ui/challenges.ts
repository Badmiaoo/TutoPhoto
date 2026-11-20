// Défis des trois situations de la V1 minimale et bulletin de la photo dans l'écran de revue (camera/bulletin.ts).
// Le défi se choisit dans la fenêtre « Défis » de l'en-tête ; le bulletin s'affiche sous chaque photo, défi ou non.

import { CHALLENGES, type Bulletin, type ChallengeId, type Criterion } from "../camera/bulletin";
import { t, type MessageKey } from "../texts";

const STORAGE_KEY = "tutophoto.defi";

/** Titres des notions à revoir, repris du référentiel (data/referentiel). */
const NOTION_TITLES: Record<string, string> = {
  "BOI-08": "Priorité à la vitesse",
  "BOI-12": "Modes d'entraînement",
  "MAP-04": "AF ponctuel ou continu",
  "MAP-05": "Modes de zone AF",
  "MAP-06": "Collimateurs",
  "MAP-09": "Détection des yeux et des sujets",
  "MES-10": "ISO auto",
  "MVT-01": "Figer le mouvement",
  "NET-01": "Profondeur de champ",
  "NET-06": "Distance sujet-fond",
};

const CHALLENGE_KEYS: Record<ChallengeId, { title: MessageKey; goal: MessageKey }> = {
  "SIT-01": { title: "challenge01Title", goal: "challenge01Goal" },
  "SIT-05": { title: "challenge05Title", goal: "challenge05Goal" },
  "SIT-06": { title: "challenge06Title", goal: "challenge06Goal" },
};

const THING_KEYS: Record<string, MessageKey> = {
  dennis: "thingDennis",
  sophia: "thingSophia",
  fabienne: "thingFabienne",
  percy: "thingPercy",
  nathan: "thingWalker",
  jim: "thingDog",
  bench: "thingBench",
  bin: "thingBin",
  backdrop: "thingBackdrop",
};

const CRITERION_KEYS: Record<Criterion["key"], MessageKey> = {
  eyeSharp: "critEyeSharp",
  backgroundBlurred: "critBackgroundBlurred",
  groupSharp: "critGroupSharp",
  dogInFrame: "critDogInFrame",
  dogSharp: "critDogSharp",
  dogFrozen: "critDogFrozen",
};

export interface NoiseReading {
  snr: number;
  level: "ok" | "warn" | "bad";
}

interface ChallengeElements {
  button: HTMLButtonElement;
  dialog: HTMLDialogElement;
}

/** Fenêtre « Défis » : aucun défi (entraînement libre) ou un défi par situation. */
export class ChallengePicker {
  private active: ChallengeId | null = null;

  constructor(
    private readonly el: ChallengeElements,
  ) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (CHALLENGES.includes(saved as ChallengeId)) this.active = saved as ChallengeId;
    } catch {
      // Stockage indisponible : pas de défi.
    }
    // Défi choisi depuis la fiche d'une situation (« Jouer le défi » : simulateur/?defi=SIT-05) : il est retenu
    // comme un défi choisi dans la fenêtre, puis le paramètre est retiré de l'adresse (constat COD-03 de l'audit,
    // version 0.3.72). Il vaut pour l'arrivée ; ensuite, c'est le choix mémorisé qui vaut, et un rechargement
    // de la page ne remet plus le défi de l'adresse par-dessus un choix fait dans la fenêtre.
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("defi");
    if (CHALLENGES.includes(fromUrl as ChallengeId)) {
      this.active = fromUrl as ChallengeId;
      try {
        window.localStorage.setItem(STORAGE_KEY, this.active);
      } catch {
        // Sans stockage, le choix vaut pour la page en cours.
      }
    }
    if (url.searchParams.has("defi")) {
      // Un défi inconnu est retiré aussi : il n'a rien choisi. Les autres paramètres et l'ancre restent.
      url.searchParams.delete("defi");
      try {
        window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
      } catch {
        // Adresse non modifiable : le défi de l'adresse revient au rechargement, comme avant.
      }
    }
    el.button.addEventListener("click", () => el.dialog.showModal());
    for (const input of el.dialog.querySelectorAll<HTMLInputElement>("input[name=challenge]")) {
      input.addEventListener("change", () => {
        this.active = input.value === "none" ? null : (input.value as ChallengeId);
        try {
          window.localStorage.setItem(STORAGE_KEY, input.value);
        } catch {
          // Sans stockage, le choix vaut pour la page en cours.
        }
        this.update();
      });
    }
    this.update();
  }

  current(): ChallengeId | null {
    return this.active;
  }

  applyTexts(): void {
    this.update();
  }

  private update(): void {
    const tr = t;
    this.el.button.textContent = this.active ? `${tr("challengeShort")} ${this.active}` : tr("challengesTitle");
    const dialog = this.el.dialog;
    dialog.querySelector("#challenge-title")!.textContent = tr("challengesTitle");
    dialog.querySelector("#challenge-none-label")!.textContent = tr("challengeNone");
    for (const id of CHALLENGES) {
      const label = dialog.querySelector(`#challenge-${id}-label`)!;
      label.textContent = `${id} · ${tr(CHALLENGE_KEYS[id].title)} : ${tr(CHALLENGE_KEYS[id].goal)}`;
    }
    dialog.querySelector("#challenge-note")!.textContent = tr("challengeNote");
    dialog.querySelector("#challenge-close")!.textContent = tr("close");
    for (const button of dialog.querySelectorAll<HTMLButtonElement>(".fiche-open")) button.textContent = tr("ficheOpen");
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=challenge]")) {
      input.checked = input.value === (this.active ?? "none");
    }
  }
}

/** Bouton qui ouvre une fiche par-dessus le simulateur (ui/ficheDialog.ts). */
function ficheButton(id: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fiche-link";
  button.dataset.fiche = id;
  button.textContent = label;
  return button;
}

/** Bulletin d'une vue : exposition, zone nette, bruit, sujets en mouvement, puis le défi et les notions à revoir. */
export function renderBulletin(
  list: HTMLElement,
  bulletin: Bulletin,
  extra: { exposureOffset: number; focusDistance: number; challenge: ChallengeId | null; noise: NoiseReading | null; longSideMm: number },
): void {
  const tr = t;
  const decimal = (value: number, digits = 1) => {
    const text = value.toFixed(digits);
    return text.replace(".", ",");
  };
  const metres = (value: number) => (Number.isFinite(value) ? `${decimal(value)} m` : "∞");
  const name = (id: string) => (THING_KEYS[id] ? tr(THING_KEYS[id]) : id);
  const lines: { text: string; className?: string; fiches?: string[] }[] = [];
  const offset = extra.exposureOffset;
  const sign = offset > 0.05 ? "+" : offset < -0.05 ? "−" : "";
  lines.push({ text: `${tr("bulletinExposure")} ${sign}${decimal(Math.abs(offset))} ${tr("meterUnit")}` });
  lines.push({ text: `${tr("bulletinZone")} ${metres(bulletin.near)} – ${metres(bulletin.far)} (${tr("bulletinFocus")} ${metres(extra.focusDistance)})` });
  if (extra.noise) {
    const level = tr(extra.noise.level === "ok" ? "balanceExcellent" : extra.noise.level === "warn" ? "balanceAcceptable" : "balanceInsufficient");
    lines.push({ text: `${tr("bulletinNoise")} ${level} (${tr("balanceSnr")} ${Math.round(extra.noise.snr)}:1)` });
  }
  // Flou acceptable en pixels de la photo : (diagonale / 1500) × 1500 / grand côté.
  const limitPx = (bulletin.blurMm * 1500) / extra.longSideMm;
  for (const m of bulletin.measures) {
    if (!m.inFrame || m.trailMm === 0) continue;
    const verdict = tr(m.frozen ? "bulletinFrozen" : "bulletinTrail");
    lines.push({ text: `${name(m.id)} : ${tr("bulletinTrailIs")} ${decimal(m.trailPx)} px, ${verdict} (${tr("bulletinLimit")} ${decimal(limitPx)} px)` });
  }
  if (extra.challenge) {
    const keys = CHALLENGE_KEYS[extra.challenge];
    const passed = bulletin.criteria.every((c) => c.ok);
    lines.push({
      text: `${tr("challengeShort")} ${extra.challenge} · ${tr(keys.title)} : ${tr(passed ? "challengePassed" : "challengeRetry")}`,
      className: passed ? "passed" : "failed",
    });
    for (const c of bulletin.criteria) {
      let detail = "";
      if (typeof c.values.depth === "number" && Number.isFinite(c.values.depth)) detail = ` (${metres(c.values.depth)})`;
      if (typeof c.values.px === "number" && Number.isFinite(c.values.px)) detail = ` (${decimal(c.values.px)} px)`;
      const names = String(c.values.sharp ?? c.values.missed ?? "")
        .split(", ")
        .filter(Boolean)
        .map(name)
        .join(", ");
      if (!c.ok && names) detail += ` : ${tr(c.key === "backgroundBlurred" ? "critStillSharp" : "critMissed")} ${names}`;
      lines.push({ text: `${tr(c.ok ? "critOk" : "critFailed")} ${tr(CRITERION_KEYS[c.key])}${detail}`, className: c.ok ? "passed" : "failed" });
    }
    const review = [...new Set(bulletin.criteria.filter((c) => !c.ok).flatMap((c) => c.notions))];
    if (review.length > 0) {
      lines.push({ text: tr("bulletinReview"), fiches: review });
    }
  }
  list.replaceChildren(
    ...lines.map((line) => {
      const li = document.createElement("li");
      li.textContent = line.text;
      if (line.className) li.className = line.className;
      // Notions à revoir : chacune ouvre sa fiche (« À revoir : NET-01 Profondeur de champ ; NET-06 … »).
      line.fiches?.forEach((id, i) => {
        li.append(i === 0 ? " " : " ; ", ficheButton(id, `${id} ${NOTION_TITLES[id] ?? ""}`.trim()));
      });
      return li;
    }),
  );
  list.hidden = false;
}
