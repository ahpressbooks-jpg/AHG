import { BoardState, Story } from "./types";

// ---------------------------------------------------------------------------
// THE INSTRUMENT — the new mechanics computed on the existing Wire engine.
// The Wire stops being a leaderboard and becomes a model of how public
// knowledge forms: hardening, decaying, and breathing with the day.
// ---------------------------------------------------------------------------

// HALF-LIFE — a live estimate of when a story will stop mattering. Derived
// from how far it sits above the fade floor and whether coverage is still
// accelerating. Returns hours-to-fade + a 0..100 vitality.
export function halfLife(s: Story): { hours: number; vitality: number } {
  const score = s.score;
  const v = s.workings.velocity45;
  const base = Math.max(0.5, (score - 28) / 6); // hours of altitude above the floor
  const momentum = 1 + Math.min(v, 6) * 0.55; // sustained coverage extends life
  const hours = Math.max(1, Math.min(120, base * momentum));
  const vitality = Math.max(2, Math.min(100, Math.round(score * 0.6 + Math.min(v, 6) * 6)));
  return { hours, vitality };
}

export function fadeLabel(hours: number, nowMs: number): string {
  const t = new Date(nowMs + hours * 3600_000);
  if (hours < 6) return `fades in ~${Math.round(hours)}h`;
  if (hours < 36) return `fades ${t.toLocaleString([], { weekday: "short", hour: "numeric" })}`;
  return `holds ~${Math.round(hours / 24)}d`;
}

// CRYSTALLIZATION — how much of a story has hardened from rumor to record.
// settled = corroborated/confirmed share; contested = still one-source/framed.
export function crystallize(s: Story): { settled: number; contested: number } {
  const byOwners = Math.min(s.owners, 6) * 14;
  const byCertainty = s.certainty === "CONFIRMED" ? 36 : s.certainty === "REPORTED" ? 18 : 2;
  const settled = Math.max(4, Math.min(96, byOwners + byCertainty));
  return { settled, contested: 100 - settled };
}

// THE BREATHING BOARD — the day's civic load and the interface's resulting
// mood. Heavy days intensify; quiet days are told to go outside.
export type Mood = "STORM" | "ELEVATED" | "STEADY" | "CALM";
export function civicTempo(b: BoardState | null): { load: number; mood: Mood; bpm: number; tagline: string } {
  const top = (b?.stories ?? []).slice(0, 10);
  const load = top.length ? Math.round(top.reduce((a, s) => a + s.score, 0) / top.length) : 0;
  const mood: Mood = load >= 70 ? "STORM" : load >= 55 ? "ELEVATED" : load >= 40 ? "STEADY" : "CALM";
  const bpm = Math.round(46 + (load / 100) * 62); // resting → racing
  const tagline =
    mood === "STORM" ? "Heavy weather over the board. Read closely."
    : mood === "ELEVATED" ? "A front is moving in. Several stories carry real weight."
    : mood === "STEADY" ? "A normal civic day. Nothing is on fire; some things matter."
    : "A quiet board. When you're caught up, close the tab and go live your life.";
  return { load, mood, bpm, tagline };
}

// SILENCE — stories carrying weight (consequence/power) that the wire is
// UNDER-covering relative to that weight. The photographic negative of the news.
export function silence(b: BoardState | null): { story: Story; gap: number }[] {
  const stories = b?.stories ?? [];
  return stories
    .map((s) => {
      const weight = (s.workings.consequence ?? 0) + (s.workings.power ?? 0); // 0..20
      const coverage = Math.min(s.owners, 8) / 8; // 0..1
      const gap = Math.round(weight * 5 * (1 - coverage)); // high weight, low coverage → big gap
      return { story: s, gap };
    })
    .filter((x) => x.gap >= 30)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);
}

// ---- the ten features, as destinations -----------------------------------
export interface Feature {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "calibrating" | "early";
  how: string;
  shows: string;
}

export const FEATURES: Feature[] = [
  { slug: "wire", name: "The Wire", tagline: "What carries weight, right now.", status: "live",
    how: "Every newsroom on earth, swept each minute, scored by GRAVITY — independent corroboration, velocity, consequence, power, and freshness.", shows: "The day, ordered by weight instead of clicks." },
  { slug: "breathing-board", name: "The Breathing Board", tagline: "An interface with a pulse and a conscience.", status: "live",
    how: "The whole surface takes a tempo from the day's civic load — heavy days intensify; quiet days slow down and tell you to leave.", shows: "How heavy today actually is, before you read a word." },
  { slug: "half-life", name: "Half-Life", tagline: "The future of attention, not just the present.", status: "live",
    how: "Each story carries a live decay clock predicting when it will stop mattering, from its altitude and whether coverage still accelerates.", shows: "Which stories are permanent and which are loud-and-gone — while they're still loud." },
  { slug: "silence", name: "The Silence Board", tagline: "The photographic negative of the news.", status: "live",
    how: "When a story's weight (consequence, power) far outruns its coverage, it surfaces here — what the front pages are conspicuously not telling you.", shows: "What everyone is missing. One row back, full view." },
  { slug: "crystallization", name: "Crystallization", tagline: "Watch the news harden from rumor to record.", status: "calibrating",
    how: "Every story splits into a settled core and a contested ring; facts visibly migrate inward as corroboration arrives.", shows: "The act of something becoming true, in real time." },
  { slug: "claim-lineage", name: "Claim Lineage", tagline: "Trace any claim to its single origin.", status: "early",
    how: "Tap a sentence and it collapses backward down its own family tree to the one original report it descended from, across every outlet that echoed it.", shows: "That 'everyone is reporting it' often means one newsroom said it and forty repeated it." },
  { slug: "branch-view", name: "Branch View", tagline: "The news as a decision tree of reality.", status: "early",
    how: "Developing stories render as a live 'what would have to be true' tree — the ways it could go and the evidence that would tip each, pruned as facts land.", shows: "How to reason about outcomes instead of doom-refreshing." },
  { slug: "frame-drift", name: "Frame Drift", tagline: "The etymology of spin, animated.", status: "calibrating",
    how: "A live view of how the words describing a story mutate across outlets and time — 'protest' drifting toward 'unrest' toward 'riot', timestamped.", shows: "Bias as something you watch happen, not something you argue about." },
  { slug: "sensor-network", name: "The Sensor Network", tagline: "The audience as distributed verification.", status: "early",
    how: "Readers who are near a story or hold relevant expertise add one structured signal that becomes a transparent input to corroboration on the board.", shows: "Accountable citizen verification, wired into the ranking in the open." },
  { slug: "attention-budget", name: "Attention Budget", tagline: "Crowd curation without the engagement bait.", status: "early",
    how: "Every reader gets a small, daily, non-bankable allotment to push a story up. Attention is scarce by design, so you must choose what truly matters.", shows: "The opposite of an infinite like button." },
];

export const featureBySlug = (slug: string) => FEATURES.find((f) => f.slug === slug);
