import { BEATS, OFF_BEAT_DAMP } from "./sources";
import { Certainty, Story, Tier } from "./types";

export const METHOD_VERSION = "GRAVITY v2.0";

export const TIER_ORDER: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
export const tierRank = (t: Tier) => TIER_ORDER.indexOf(t);

// ---------------------------------------------------------------------------
// GRAVITY — the algorithm, explainable out loud:
// "Five measurable signals — how many independent newsrooms, how fast it's
//  spreading, how many people it touches, whether power is being exercised,
//  and how fresh it is — combine into one score. High gravity rises to the
//  Board. Low gravity stays in the Lobby. The math is public."
// Published at /gravity. Versioned. Changing this file = bumping the version.
// ---------------------------------------------------------------------------

export const GRAVITY_WEIGHTS = {
  corroboration: 25,
  velocity: 20,
  consequence: 25,
  power: 15,
  freshness: 15,
} as const;

const THRESHOLDS: { tier: Tier; min: number }[] = [
  { tier: "FLASH", min: 85 },
  { tier: "BULLETIN", min: 70 },
  { tier: "URGENT", min: 55 },
  { tier: "DEVELOPING", min: 40 },
  { tier: "BRIEF", min: 0 }, // the Lobby
];

const PROMOTE_MARGIN = 3;
const PROMOTE_SWEEPS = 2;
const DEMOTE_MARGIN = 5;
export const BUMP_BUDGET = 6;
const FLASH_MAX_AGE_MIN = 120;
const FLASH_MIN_OWNERS = 5;
const FLASH_AUTO_DEMOTE_MIN = 45;

// Each beat carries a civic-gravity prior: how consequential, how much about
// power. The rubric is public on /gravity; the desk owns the numbers.
const BEAT_GRAVITY: Record<string, { consequence: number; power: number }> = {
  "war-peace": { consequence: 9, power: 8 },
  courts: { consequence: 7, power: 9 },
  "white-house": { consequence: 7, power: 9 },
  congress: { consequence: 7, power: 8 },
  elections: { consequence: 8, power: 8 },
  disaster: { consequence: 8, power: 3 },
  economy: { consequence: 7, power: 6 },
  "health-policy": { consequence: 6, power: 5 },
  statehouse: { consequence: 5, power: 6 },
};

export function matchedBeats(headline: string): { beats: string[]; damp: number } {
  const h = " " + headline.toLowerCase() + " ";
  const beats: string[] = [];
  for (const b of BEATS) {
    if (b.terms.some((t) => h.includes(t))) beats.push(b.beat);
  }
  const damp =
    OFF_BEAT_DAMP.terms.some((t) => h.includes(t)) && beats.length === 0
      ? OFF_BEAT_DAMP.factor
      : 1;
  return { beats, damp };
}

/** Heuristic consequence/power from matched beats; the triage LLM refines. */
export function beatGravity(beats: string[]): { consequence: number; power: number } {
  let consequence = 2; // anything on the wire touches someone
  let power = 1;
  for (const b of beats) {
    const g = BEAT_GRAVITY[b];
    if (g) {
      consequence = Math.max(consequence, g.consequence);
      power = Math.max(power, g.power);
    }
  }
  return { consequence, power };
}

export interface ScoreInput {
  owners: number;
  maxSourceWeight: number;
  minutesSinceDev: number;
  velocity45: number;
  consequence: number; // 0..10
  power: number; // 0..10
  damp: number;
  webCorroboration?: number;
}

export function computeScore(s: ScoreInput): number {
  const corro = Math.min(s.owners + (s.webCorroboration ?? 0) * 0.5, 8) / 8;
  const velocity = Math.min(s.velocity45, 6) / 6;
  const consequence = Math.min(10, Math.max(0, s.consequence)) / 10;
  const power = Math.min(10, Math.max(0, s.power)) / 10;
  const freshness = Math.pow(0.5, s.minutesSinceDev / 90); // half-life 90 min
  // Source weight nudges corroboration quality rather than owning a slot.
  const weightNudge = 0.85 + (s.maxSourceWeight / 3) * 0.15;

  let subtotal =
    corro * GRAVITY_WEIGHTS.corroboration * weightNudge +
    velocity * GRAVITY_WEIGHTS.velocity +
    consequence * GRAVITY_WEIGHTS.consequence +
    power * GRAVITY_WEIGHTS.power +
    freshness * GRAVITY_WEIGHTS.freshness;

  subtotal *= s.damp;
  return Math.round(Math.max(0, Math.min(100, subtotal)));
}

export function naturalTier(score: number): Tier {
  for (const t of THRESHOLDS) if (score >= t.min) return t.tier;
  return "BRIEF";
}

export function certaintyFor(owners: number, maxWeight: number): Certainty {
  if (owners >= 4 && maxWeight >= 3) return "CONFIRMED";
  if (owners >= 2) return "REPORTED";
  return "DEVELOPING";
}

export interface TierDecision {
  tier: Tier;
  pending?: { tier: Tier; count: number };
  changed: boolean;
  reason?: string;
}

export function decideTier(story: Story, score: number, ageMin: number, devAgeMin: number): TierDecision {
  const current = story.tier;
  let target = naturalTier(score);

  if (target === "FLASH") {
    const broad = story.owners + (story.workings.webCorroboration ?? 0) >= FLASH_MIN_OWNERS;
    const young = ageMin <= FLASH_MAX_AGE_MIN;
    if (!broad || !young) target = "BULLETIN";
  }

  if (current === "FLASH" && devAgeMin > FLASH_AUTO_DEMOTE_MIN) {
    return { tier: "BULLETIN", changed: true, reason: "flash cooled — no new development" };
  }

  if (target === current) return { tier: current, changed: false };

  const up = tierRank(target) < tierRank(current);

  if (up) {
    if (target === "FLASH") return { tier: "FLASH", changed: true, reason: "flash conditions met" };
    const threshold = THRESHOLDS.find((t) => t.tier === target)!.min;
    if (score < threshold + PROMOTE_MARGIN) return { tier: current, changed: false };
    const pending =
      story.pending?.tier === target
        ? { tier: target, count: story.pending.count + 1 }
        : { tier: target, count: 1 };
    if (pending.count >= PROMOTE_SWEEPS) {
      return { tier: target, changed: true, reason: "held across sweeps" };
    }
    return { tier: current, pending, changed: false };
  }

  const floor = THRESHOLDS.find((t) => t.tier === current)!.min;
  if (score <= floor - DEMOTE_MARGIN) {
    return { tier: target, changed: true, reason: "cooled" };
  }
  return { tier: current, changed: false };
}

export function seatOrder(a: Story, b: Story): number {
  const pa = a.desk?.pinned ? 1 : 0;
  const pb = b.desk?.pinned ? 1 : 0;
  if (pa !== pb) return pb - pa;
  const tr = tierRank(a.tier) - tierRank(b.tier);
  if (tr !== 0) return tr;
  return b.score - a.score;
}
