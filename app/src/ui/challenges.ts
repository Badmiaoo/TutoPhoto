// Défis des trois situations de la V1 minimale et bulletin de la photo dans l'écran de revue (camera/bulletin.ts).
// Le défi se choisit dans la fenêtre « Défis » de l'en-tête ; le bulletin s'affiche sous chaque photo, défi ou non.

import { CHALLENGES, type Bulletin, type ChallengeId, type Criterion } from "../camera/bulletin";
import { t, type Lang, type MessageKey } from "../i18n";

const STORAGE_KEY = "tutophoto.defi";

/** Titres des notions à revoir, repris du référentiel (data/referentiel). */
const NOTION_TITLES: Record<string, { fr: string; en: string }> = {
  "BOI-08": { fr: "Priorité à la vitesse", en: "shutter priority, S/Tv" },
  "BOI-12": { fr: "Modes d'entraînement", en: "drive modes" },
  "MAP-04": { fr: "AF ponctuel ou continu", en: "single AF, continuous AF" },
  "MAP-05": { fr: "Modes de zone AF", en: "AF area modes" },
  "MAP-06": { fr: "Collimateurs", en: "AF points" },
  "MAP-09": { fr: "Détection des yeux et des sujets", en: "eye, face, subject detection" },
  "MES-10": { fr: "ISO auto", en: "auto ISO" },
  "MVT-01": { fr: "Figer le mouvement", en: "freezing motion" },
  "NET-01": { fr: "Profondeur de champ", en: "depth of field" },
  "NET-06": { fr: "Distance sujet-fond", en: "subject-background distance" },
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
    private lang: Lang,
  ) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (CHALLENGES.includes(saved as ChallengeId)) this.active = saved as ChallengeId;
    } catch {
      // Stockage indisponible : pas de défi.
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

  setLang(lang: Lang): void {
    this.lang = lang;
    this.update();
  }

  private update(): void {
    const tr = (key: MessageKey) => t(this.lang, key);
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
    for (const input of dialog.querySelectorAll<HTMLInputElement>("input[name=challenge]")) {
      input.checked = input.value === (this.active ?? "none");
    }
  }
}

/** Bulletin d'une vue : exposition, zone nette, bruit, sujets en mouvement, puis le défi et les notions à revoir. */
export function renderBulletin(
  list: HTMLElement,
  lang: Lang,
  bulletin: Bulletin,
  extra: { exposureOffset: number; focusDistance: number; challenge: ChallengeId | null; noise: NoiseReading | null; longSideMm: number },
): void {
  const tr = (key: MessageKey) => t(lang, key);
  const decimal = (value: number, digits = 1) => {
    const text = value.toFixed(digits);
    return lang === "fr" ? text.replace(".", ",") : text;
  };
  const metres = (value: number) => (Number.isFinite(value) ? `${decimal(value)} m` : "∞");
  const name = (id: string) => (THING_KEYS[id] ? tr(THING_KEYS[id]) : id);
  const lines: { text: string; className?: string }[] = [];
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
    lines.push({ text: `${name(m.id)}${tr("balanceColon")}${tr("bulletinTrailIs")} ${decimal(m.trailPx)} px, ${verdict} (${tr("bulletinLimit")} ${decimal(limitPx)} px)` });
  }
  if (extra.challenge) {
    const keys = CHALLENGE_KEYS[extra.challenge];
    const passed = bulletin.criteria.every((c) => c.ok);
    lines.push({
      text: `${tr("challengeShort")} ${extra.challenge} · ${tr(keys.title)}${tr("balanceColon")}${tr(passed ? "challengePassed" : "challengeRetry")}`,
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
      if (!c.ok && names) detail += `${tr("balanceColon")}${tr(c.key === "backgroundBlurred" ? "critStillSharp" : "critMissed")} ${names}`;
      lines.push({ text: `${tr(c.ok ? "critOk" : "critFailed")} ${tr(CRITERION_KEYS[c.key])}${detail}`, className: c.ok ? "passed" : "failed" });
    }
    const review = [...new Set(bulletin.criteria.filter((c) => !c.ok).flatMap((c) => c.notions))];
    if (review.length > 0) {
      lines.push({ text: `${tr("bulletinReview")} ${review.map((id) => `${id} ${NOTION_TITLES[id]?.[lang] ?? ""}`.trim()).join(" ; ")}` });
    }
  }
  list.replaceChildren(
    ...lines.map((line) => {
      const li = document.createElement("li");
      li.textContent = line.text;
      if (line.className) li.className = line.className;
      return li;
    }),
  );
  list.hidden = false;
}
