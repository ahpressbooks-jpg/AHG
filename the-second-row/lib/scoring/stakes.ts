import { FloorLevel, Stakes } from "../floor";

// ---------------------------------------------------------------------------
// STAKES SIGNALS — pure, deterministic, no network. Seeds the five signals from
// rule-based heuristics over an item's metadata. The desk can override any
// signal item-by-item from the control room, and every override is a logged
// public event on the item's biography — a hand-tuned score is never hidden as
// an algorithmic one. Unit-testable in isolation (no imports beyond types).
// ---------------------------------------------------------------------------

export interface StakesInput {
  level: FloorLevel;
  title: string; // official + plain, concatenated
  actionText?: string; // latest action / status text
  cosponsors?: number;
  hasFiscalNote?: boolean;
  daysToDeadline?: number | null; // vote or comment-window close
  ageDays?: number; // since last action
}

const FORCE_WORDS = [
  "tax", "penalty", "crime", "felony", "mandate", "require", "prohibit", "ban",
  "appropriat", "spending", "fund", "fee", "fine", "sentence", "license", "permit",
];
const REACH_WORDS = ["national", "federal", "all ", "every", "medicare", "medicaid", "social security", "veterans", "students", "workers", "families"];

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
function hits(text: string, words: string[]): number {
  const t = text.toLowerCase();
  return words.reduce((n, w) => (t.includes(w) ? n + 1 : n), 0);
}

export function computeStakes(input: StakesInput): Stakes {
  const text = input.title.toLowerCase();

  // REACH — federal/national scope + population keywords.
  const levelReach = input.level === "FEDERAL" ? 55 : input.level === "REGULATORY" ? 45 : input.level === "STATE" ? 35 : 25;
  const reach = clamp(levelReach + hits(text, REACH_WORDS) * 9);

  // FORCE — coercion / money verbs, plus a fiscal note.
  const force = clamp(24 + hits(text, FORCE_WORDS) * 11 + (input.hasFiscalNote ? 16 : 0));

  // MOTION — velocity through the process (fresh action = moving).
  const age = input.ageDays ?? 30;
  const motion = clamp(age <= 2 ? 82 : age <= 7 ? 62 : age <= 21 ? 40 : age <= 60 ? 22 : 8);

  // ODDS — likelihood of passage from cosponsor count + status momentum.
  const co = input.cosponsors ?? 0;
  const statusBoost = /passed|agreed to|reported/i.test(input.actionText ?? "") ? 22 : /introduced|referred/i.test(input.actionText ?? "") ? 4 : 12;
  const odds = clamp(18 + Math.min(co, 60) * 0.9 + statusBoost);

  // CLOCK — time pressure. Nearer deadline = higher.
  const d = input.daysToDeadline;
  const clock = clamp(d == null ? 12 : d <= 3 ? 96 : d <= 7 ? 78 : d <= 14 ? 58 : d <= 30 ? 36 : 16);

  return { reach, force, motion, odds, clock };
}
