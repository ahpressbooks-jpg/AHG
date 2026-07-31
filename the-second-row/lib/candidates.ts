import {
  CURRENT_CYCLE, FecCandidate, fecCandidate, fecCandidates, fecDisplayName, fecTotals,
} from "./fec";
import {
  Candidate, CandidateMoney, GOV_STATES_2026, Office, partyLabel, stateName,
} from "./candidateMeta";
import { BoardState, Story } from "./types";

// ---------------------------------------------------------------------------
// CANDIDATES — one domain layer over three realities:
//   • House & Senate  → live FEC data (lib/fec.ts), the automated source.
//   • Governors       → curated seats (no free person-level API); each links
//                        to the authoritative live field.
//   • FEC unreachable → a clearly-labeled SAMPLE roster, never masquerading as
//                        real (same honesty as the site's SAMPLE_BOARD).
// Everything the UI and tracking touch goes through here, source-agnostic.
// Shared pure metadata (types, states, labels) lives in ./candidateMeta.
// ---------------------------------------------------------------------------

// Re-export the shared metadata so server callers can keep importing it here.
export type { Candidate, CandidateMoney, Office } from "./candidateMeta";
export { GOV_STATES_2026, OFFICE_LABEL, US_STATES, partyLabel, partyTag, stateName } from "./candidateMeta";

function normDistrict(d?: string): string | undefined {
  if (d === undefined || d === null || d === "") return undefined;
  const n = parseInt(String(d), 10);
  if (Number.isNaN(n)) return undefined;
  return n === 0 ? "At-large" : String(n);
}

function fromFec(f: FecCandidate, fallbackState: string): Candidate {
  const office: Office = f.office === "S" ? "S" : "H";
  return {
    id: f.candidate_id,
    name: fecDisplayName(f.name),
    office,
    state: (f.state || fallbackState).toUpperCase(),
    district: office === "H" ? normDistrict(f.district) : undefined,
    party: partyLabel(f.party, f.party_full),
    partyCode: f.party,
    incumbent: f.incumbent_challenge === "I",
    status: f.incumbent_challenge_full
      ? f.incumbent_challenge_full.replace(/\b\w/g, (m) => m.toUpperCase())
      : undefined,
    source: "fec",
    fecId: f.candidate_id,
  };
}

// ---- governors (curated seats) ---------------------------------------------
export function governorRace(state: string): Candidate {
  const code = state.toUpperCase();
  const name = stateName(code);
  return {
    id: `gov-${code}`,
    name: `Governor — ${name}`,
    office: "G",
    state: code,
    status: "On the 2026 ballot",
    source: "curated",
    isRace: true,
    sourceUrl: `https://ballotpedia.org/${name.replace(/ /g, "_")}_gubernatorial_election,_2026`,
  };
}

function governorsForState(state: string): Candidate[] {
  const code = state.toUpperCase();
  if (!GOV_STATES_2026.includes(code)) return [];
  return [governorRace(code)];
}

// ---- sample fallback (transparent, never posed as real) --------------------
function sampleRoster(state: string, office: Office, district?: string): Candidate[] {
  const base = `sample-${state}-${office}-${district ?? "x"}`;
  const mk = (i: number, name: string, code: string, inc: boolean): Candidate => ({
    id: `${base}-${i}`,
    name,
    office,
    state,
    district: office === "H" ? district : undefined,
    party: partyLabel(code),
    partyCode: code,
    incumbent: inc,
    status: inc ? "Incumbent (sample)" : "Challenger (sample)",
    source: "sample",
  });
  return [
    mk(1, "Sample Incumbent", "DEM", true),
    mk(2, "Sample Challenger", "REP", false),
    mk(3, "Sample Third-Party", "IND", false),
  ];
}

function sampleById(id: string): Candidate | null {
  const m = id.match(/^sample-([A-Za-z]{2})-([HSG])-([^-]+)-(\d)$/);
  if (!m) return null;
  const [, state, office, district] = m;
  const list = sampleRoster(state.toUpperCase(), office as Office, district === "x" ? undefined : district);
  return list.find((c) => c.id === id) ?? null;
}

// ---- the public API --------------------------------------------------------

export interface RosterResult {
  candidates: Candidate[];
  source: "fec" | "curated" | "sample";
}

export async function getCandidatesFor(opts: {
  state: string;
  office: Office;
  district?: string;
}): Promise<RosterResult> {
  const state = opts.state.toUpperCase();

  if (opts.office === "G") {
    return { candidates: governorsForState(state), source: "curated" };
  }

  const fec = await fecCandidates({ state, office: opts.office, district: opts.district });
  if (fec && fec.length) {
    const seen = new Set<string>();
    const candidates = fec
      .map((f) => fromFec(f, state))
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .sort((a, b) => Number(b.incumbent) - Number(a.incumbent) || a.name.localeCompare(b.name));
    return { candidates, source: "fec" };
  }
  if (fec && fec.length === 0) {
    return { candidates: [], source: "fec" }; // genuinely no filed candidates yet
  }
  // fec === null → unreachable → transparent sample
  return { candidates: sampleRoster(state, opts.office, opts.district), source: "sample" };
}

export async function getCandidateById(
  id: string
): Promise<{ candidate: Candidate; money: CandidateMoney } | null> {
  const noMoney: CandidateMoney = { raised: 0, spent: 0, cash: 0, cycle: CURRENT_CYCLE, available: false };

  if (id.startsWith("gov-")) {
    const code = id.slice(4).toUpperCase();
    if (!GOV_STATES_2026.includes(code)) return null;
    return { candidate: governorRace(code), money: noMoney };
  }
  if (id.startsWith("sample-")) {
    const c = sampleById(id);
    return c ? { candidate: c, money: noMoney } : null;
  }

  // FEC candidate id
  const f = await fecCandidate(id);
  if (!f) return null;
  const candidate = fromFec(f, f.state || "");
  const t = await fecTotals(id);
  const money: CandidateMoney = t
    ? {
        raised: t.receipts ?? 0,
        spent: t.disbursements ?? 0,
        cash: t.cash_on_hand_end_period ?? 0,
        cycle: t.cycle ?? CURRENT_CYCLE,
        asOf: t.coverage_end_date,
        available: true,
      }
    : noMoney;
  return { candidate, money };
}

// ---- the WIRE tie-in: what the live board is saying about a candidate -------
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match query terms against the live board (headlines + source titles).
// Conservative: full-name substring, or a distinctive surname on a word boundary.
export function mentionsFor(queries: string[], board: BoardState | null): Story[] {
  if (!board || !board.stories?.length) return [];
  const terms = queries.map((q) => q.toLowerCase().trim()).filter(Boolean);
  if (!terms.length) return [];
  const out: Story[] = [];
  for (const s of board.stories) {
    const hay = (s.headline + " " + s.sources.map((x) => x.title || "").join(" ")).toLowerCase();
    const hit = terms.some((t) => {
      if (t.includes(" ")) return hay.includes(t); // full name / phrase
      return t.length >= 6 && new RegExp(`\\b${escapeRe(t)}\\b`).test(hay); // distinctive single word
    });
    if (hit) out.push(s);
  }
  return out.slice(0, 8);
}

export function queryTermsFor(c: Candidate): string[] {
  if (c.isRace) return [`${stateName(c.state).toLowerCase()} governor`, "governor race"];
  const parts = c.name.toLowerCase().split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1];
  const terms = [c.name.toLowerCase()];
  if (last && last.length >= 6) terms.push(last);
  return terms;
}

export function mentionsOf(c: Candidate, board: BoardState | null): Story[] {
  // Sample placeholders use generic words ("Incumbent"/"Challenger") that would
  // false-match real headlines — they never pull live coverage.
  if (c.source === "sample") return [];
  return mentionsFor(queryTermsFor(c), board);
}
