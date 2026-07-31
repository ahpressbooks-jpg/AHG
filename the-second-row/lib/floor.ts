import { getJSON, setJSON } from "./store";

// ---------------------------------------------------------------------------
// THE FLOOR — the live board of the law being written. Bills, agency rules, and
// ballot measures, scored by STAKES 0–100 and seated by where they actually sit
// in the process (not by how loud they are). Store-backed (Redis/memory), with
// a transparent SAMPLE seed so the board reads before the intake pipes fill it —
// same honesty as the Wire's SAMPLE_BOARD. Postgres/Drizzle is the production
// hardening target; the shape here ports to relational tables 1:1.
// ---------------------------------------------------------------------------

export type FloorTier =
  | "FILED" | "IN COMMITTEE" | "ON THE FLOOR" | "COMMENT OPEN" | "PASSED" | "DIED" | "SHELVED";
export type Verdict = "BACK" | "FIGHT" | "WATCHING" | "SPLIT";
export type FloorLevel = "FEDERAL" | "STATE" | "REGULATORY" | "CITY" | "BALLOT" | "DISTRICT";

// STAKES measures CONSEQUENCE, never desirability. Five published signals 0–100.
export interface Stakes {
  reach: number; // how many people the measure touches, how directly
  force: number; // how much coercion or money it deploys
  motion: number; // velocity through the process
  odds: number; // likelihood of passage
  clock: number; // time pressure to act
}
export interface FloorEvent { at: string; event: string }
export interface Sponsor { name: string; party?: string; chamber?: string }

export interface FloorItem {
  id: string;
  official_title: string;
  plain_title: string; // written/approved from the desk — never the official title alone
  plain_summary: string; // what it does to a person, in house voice
  summary_by?: string;
  summary_at?: string;
  tier: FloorTier;
  level: FloorLevel;
  levelLabel: string; // "FEDERAL · SENATE", "REGULATORY · CLOSES 12 DAYS", "STATE · TX HOUSE"
  number?: string;
  sponsors?: Sponsor[];
  committee?: string;
  stakes: Stakes;
  verdict?: Verdict; // desk opinion ONLY lives here; most items carry none
  verdictReason?: string; // required one paragraph when a verdict is set
  closesAt?: string; // scheduled vote / comment window close
  docketId?: string; // regulatory docket
  commentUrl?: string; // official comment docket link
  sourceUrl: string; // primary source of record (link out, never re-host)
  events: FloorEvent[]; // append-only biography
  source: "live" | "sample";
  updatedAt: string;
}

// STAKES weights — stored so they can be edited from the desk and rendered live
// with reader sliders on /method (same pattern as GRAVITY). Sum to 1.
export const STAKES_WEIGHTS: Record<keyof Stakes, number> = {
  reach: 0.28, force: 0.28, motion: 0.14, odds: 0.16, clock: 0.14,
};

export function stakesScore(s: Stakes): number {
  const w = STAKES_WEIGHTS;
  return Math.round(
    s.reach * w.reach + s.force * w.force + s.motion * w.motion + s.odds * w.odds + s.clock * w.clock
  );
}

export const STAKES_LABEL: Record<keyof Stakes, string> = {
  reach: "REACH", force: "FORCE", motion: "MOTION", odds: "ODDS", clock: "CLOCK",
};
export const STAKES_WHY: Record<keyof Stakes, string> = {
  reach: "How many people the measure touches, and how directly.",
  force: "How much coercion or money it deploys — new crimes, taxes, mandates, spending.",
  motion: "Velocity through the process — filed, moving, or stalled.",
  odds: "Likelihood of passage, from sponsor count, leadership backing, and chamber math.",
  clock: "Time remaining to act before a vote or a closing comment window.",
};

// Orange = imminence only: a scheduled floor vote or closing comment window
// inside 72 hours. Owned here so it is computed one way everywhere.
export function isImminent(item: Pick<FloorItem, "closesAt">, nowMs: number): boolean {
  if (!item.closesAt) return false;
  const delta = new Date(item.closesAt).getTime() - nowMs;
  return delta > 0 && delta <= 72 * 3600 * 1000;
}

// Board seating order: live process first, outcomes (kept 7 days) last.
const TIER_RANK: Record<FloorTier, number> = {
  "ON THE FLOOR": 0, "COMMENT OPEN": 1, "IN COMMITTEE": 2, FILED: 3, PASSED: 4, DIED: 5, SHELVED: 6,
};

export function seatFloor(items: FloorItem[]): FloorItem[] {
  return [...items].sort(
    (a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || stakesScore(b.stakes) - stakesScore(a.stakes)
  );
}

const KEY = "tsr:floor";

export async function loadFloor(): Promise<FloorItem[]> {
  const stored = await getJSON<FloorItem[]>(KEY);
  if (stored && stored.length) return stored;
  return SAMPLE_FLOOR();
}
export async function saveFloor(items: FloorItem[]): Promise<void> {
  await setJSON(KEY, items);
}
export async function getFloorItem(id: string): Promise<FloorItem | null> {
  const all = await loadFloor();
  return all.find((i) => i.id === id) ?? null;
}

// ---- transparent sample seed (illustrative, clearly labeled — never posed as
// a real bill; the intake pipes replace these with sourced records) -----------
export function SAMPLE_FLOOR(): FloorItem[] {
  const now = new Date();
  const iso = (offsetH: number) => new Date(now.getTime() + offsetH * 3600_000).toISOString();
  const mk = (o: Partial<FloorItem> & { id: string; plain_title: string; plain_summary: string; tier: FloorTier; level: FloorLevel; levelLabel: string; stakes: Stakes }): FloorItem => ({
    official_title: o.official_title ?? o.plain_title,
    sourceUrl: o.sourceUrl ?? "https://www.congress.gov/",
    events: o.events ?? [{ at: iso(-48), event: "Entered the board" }],
    source: "sample",
    updatedAt: iso(-1),
    ...o,
  });
  return [
    mk({
      id: "sample-appropriations", tier: "ON THE FLOOR", level: "FEDERAL", levelLabel: "FEDERAL · HOUSE",
      number: "SAMPLE 0001", closesAt: iso(40),
      plain_title: "The bill that decides what the government can spend next year",
      official_title: "Making appropriations for the fiscal year (illustrative sample)",
      plain_summary: "A sample appropriations measure — the kind of bill that sets how much every federal agency may spend. When one of these is on the floor with a vote scheduled inside three days, its chip turns orange to mark the imminence. This is placeholder content; the federal pipe replaces it with the real bill, sourced to congress.gov.",
      committee: "Appropriations",
      sponsors: [{ name: "Sample Sponsor", party: "—", chamber: "House" }],
      stakes: { reach: 88, force: 74, motion: 70, odds: 55, clock: 82 },
      events: [{ at: iso(-72), event: "FILED" }, { at: iso(-30), event: "Reported out of committee" }, { at: iso(-4), event: "Placed on the floor calendar" }],
    }),
    mk({
      id: "sample-rule-privacy", tier: "COMMENT OPEN", level: "REGULATORY", levelLabel: "REGULATORY · CLOSES 12 DAYS",
      closesAt: iso(288), docketId: "SAMPLE-2026-0001", commentUrl: "https://www.federalregister.gov/",
      sourceUrl: "https://www.federalregister.gov/",
      plain_title: "A proposed rule you can still comment on",
      official_title: "Proposed rule (illustrative sample) — public comment open",
      plain_summary: "A sample proposed agency rule with an open public comment window. On the real board, COMMENT OPEN items show the closing date, a direct link to the official docket, and a plain explainer of how to file a comment. The regulatory pipe sources these from the Federal Register.",
      stakes: { reach: 61, force: 48, motion: 40, odds: 50, clock: 44 },
      verdict: "WATCHING", verdictReason: "Sample verdict tag: WATCHING marks an item the desk is tracking without taking a side. The desk's opinion lives only here — never in the score.",
    }),
    mk({
      id: "sample-committee", tier: "IN COMMITTEE", level: "STATE", levelLabel: "STATE · TX HOUSE",
      number: "SAMPLE HB 100", sourceUrl: "https://capitol.texas.gov/",
      plain_title: "A state bill still sitting in committee",
      official_title: "A Texas House measure (illustrative sample)",
      plain_summary: "A sample state measure in committee — where most bills live and die. The Texas pipe (LegiScan / Open States) sources the real record, and the desk writes the plain-language title and summary you see here.",
      stakes: { reach: 40, force: 52, motion: 22, odds: 35, clock: 20 },
    }),
    mk({
      id: "sample-filed", tier: "FILED", level: "FEDERAL", levelLabel: "FEDERAL · SENATE",
      number: "SAMPLE S. 42",
      plain_title: "A just-filed Senate bill nobody's covering yet",
      official_title: "A Senate bill (illustrative sample)",
      plain_summary: "A sample newly-filed bill. FILED items are on the board honestly — most never move, and the board says so rather than pretending every filing matters.",
      stakes: { reach: 33, force: 30, motion: 8, odds: 18, clock: 10 },
    }),
    mk({
      id: "sample-passed", tier: "PASSED", level: "FEDERAL", levelLabel: "FEDERAL · ENACTED",
      plain_title: "Something that already became law (kept for a week)",
      official_title: "An enacted measure (illustrative sample)",
      plain_summary: "A sample PASSED item. Outcomes are content, not garbage — passed and died items stay on the board for seven days with muted styling before archiving, so you can see how it ended.",
      stakes: { reach: 70, force: 66, motion: 100, odds: 100, clock: 0 },
      events: [{ at: iso(-120), event: "FILED" }, { at: iso(-20), event: "PASSED both chambers" }],
    }),
  ];
}
