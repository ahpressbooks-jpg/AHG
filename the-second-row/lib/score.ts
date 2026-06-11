import { BEATS, OFF_BEAT_DAMP } from "./sources";
import { Certainty, Story, Tier } from "./types";

export const METHOD_VERSION = "v1.0";

export const TIER_ORDER: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
export const tierRank = (t: Tier) => TIER_ORDER.indexOf(t);

// ---------------------------------------------------------------------------
// The Board Method v1.0 — published at /method. Change it there when you
// change it here; the algorithm keeps a ledger of itself.
// ---------------------------------------------------------------------------

const THRESHOLDS: { tier: Tier; min: number }[] = [
  { tier: "FLASH", min: 85 },
  { tier: "BULLETIN", min: 68 },
  { tier: "URGENT", min: 48 },
  { tier: "DEVELOPING", min: 28 },
  { tier: "BRIEF", min: 0 },
];

const PROMOTE_MARGIN = 3; // must clear threshold + margin…
const PROMOTE_SWEEPS = 2; // …for this many consecutive sweeps (FLASH exempt)
const DEMOTE_MARGIN = 5; // and fall threshold − margin to drop
export const BUMP_BUDGET = 6; // re-seats per sweep beyond arrivals
const FLASH_MAX_AGE_MIN = 120; // a flash must be young…
const FLASH_MIN_OWNERS = 5; // …and broad
const FLASH_AUTO_DEMOTE_MIN = 45; // …and it steps down without new development

export function matchedBeats(headline: string): { beats: string[]; bonus: number; damp: number } {
  const h = " " + headline.toLowerCase() + " ";
  const beats: string[] = [];
  let bonus = 0;
  for (const b of BEATS) {
    if (b.terms.some((t) => h.includes(t))) {
      beats.push(b.beat);
      bonus = Math.max(bonus, b.bonus);
    }
  }
  const damp = OFF_BEAT_DAMP.terms.some((t) => h.includes(t)) && beats.length === 0
    ? OFF_BEAT_DAMP.factor
    : 1;
  return { beats, bonus: Math.min(bonus, 0.25), damp };
}

export interface ScoreInput {
  owners: number;
  maxSourceWeight: number; // 1..3
  minutesSinceDev: number;
  velocity45: number; // pickups in last 45 min
  beatsBonus: number; // 0..0.25
  damp: number; // off-beat damping factor
  gravity?: number; // optional LLM 0..10
  webCorroboration?: number; // extra distinct domains via Parallel
}

export function computeScore(s: ScoreInput): number {
  const corro = Math.min(s.owners + (s.webCorroboration ?? 0) * 0.5, 8) / 8; // 0..1
  const weightSig = s.maxSourceWeight / 3;
  const freshness = Math.pow(0.5, s.minutesSinceDev / 90); // half-life 90 min
  const velocity = Math.min(s.velocity45, 6) / 6;

  let subtotal =
    corro * 30 +
    weightSig * 15 +
    freshness * 27 +
    velocity * 28;

  subtotal *= 1 + s.beatsBonus;
  subtotal *= s.damp;

  if (typeof s.gravity === "number") {
    subtotal = subtotal * 0.85 + (s.gravity * 10) * 0.15;
  }

  return Math.round(Math.max(0, Math.min(100, subtotal)));
}

export function naturalTier(score: number): Tier {
  for (const t of THRESHOLDS) if (score >= t.min) return t.tier;
  return "BRIEF";
}

export function certaintyFor(owners: number, maxWeight: number): Certainty {
  // Coverage math, not truth verdicts — definitions published at /method.
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

/**
 * Hysteresis: the board moves like a newsroom, not a stock ticker.
 * - Promotion needs threshold + margin across consecutive sweeps.
 * - FLASH is exempt upward (breaking is breaking) but gated hard.
 * - Demotion needs a clear fall below the floor.
 */
export function decideTier(story: Story, score: number, ageMin: number, devAgeMin: number): TierDecision {
  const current = story.tier;
  let target = naturalTier(score);

  // FLASH gates: young, broad, fast — or it is not a flash.
  if (target === "FLASH") {
    const broad = story.owners + (story.workings.webCorroboration ?? 0) >= FLASH_MIN_OWNERS;
    const young = ageMin <= FLASH_MAX_AGE_MIN;
    if (!broad || !young) target = "BULLETIN";
  }

  // Standing FLASH cools on its own without new development.
  if (current === "FLASH" && devAgeMin > FLASH_AUTO_DEMOTE_MIN) {
    return { tier: "BULLETIN", changed: true, reason: "flash cooled — no new development" };
  }

  if (target === current) {
    return { tier: current, changed: false };
  }

  const up = tierRank(target) < tierRank(current);

  if (up) {
    if (target === "FLASH") {
      return { tier: "FLASH", changed: true, reason: "flash conditions met" };
    }
    const threshold = THRESHOLDS.find((t) => t.tier === target)!.min;
    if (score < threshold + PROMOTE_MARGIN) {
      return { tier: current, changed: false };
    }
    const pending =
      story.pending?.tier === target
        ? { tier: target, count: story.pending.count + 1 }
        : { tier: target, count: 1 };
    if (pending.count >= PROMOTE_SWEEPS) {
      return { tier: target, changed: true, reason: "held across sweeps" };
    }
    return { tier: current, pending, changed: false };
  }

  // Demotion: must fall clearly below the floor of the current tier.
  const floor = THRESHOLDS.find((t) => t.tier === current)!.min;
  if (score <= floor - DEMOTE_MARGIN) {
    return { tier: target, changed: true, reason: "cooled" };
  }
  return { tier: current, changed: false };
}

/** Seated order: desk pins first, then tier, then score. */
export function seatOrder(a: Story, b: Story): number {
  const pa = a.desk?.pinned ? 1 : 0;
  const pb = b.desk?.pinned ? 1 : 0;
  if (pa !== pb) return pb - pa;
  const tr = tierRank(a.tier) - tierRank(b.tier);
  if (tr !== 0) return tr;
  return b.score - a.score;
}
