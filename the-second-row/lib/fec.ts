import { getJSON, setJSON } from "./store";

// ---------------------------------------------------------------------------
// FEC API CLIENT — the automated, authoritative source for every U.S. House
// and Senate candidate + their money. Free + official (api.open.fec.gov).
//
// Set FEC_API_KEY (free from https://api.data.gov/signup/) in the environment.
// Falls back to DEMO_KEY, which works but is heavily rate-limited — fine for a
// first look, not for production traffic.
//
// Every call is server-side only, wrapped in a timeout, and cached in the store
// (Redis/memory) so we neither hammer the API nor block a page render. On ANY
// failure (no network, rate limit, downtime) these return null and the domain
// layer (lib/candidates.ts) falls back to a curated set — the page never breaks.
// ---------------------------------------------------------------------------

const FEC_BASE = "https://api.open.fec.gov/v1";
export const CURRENT_CYCLE = 2026;
const TTL = 6 * 3600; // cache FEC responses 6h
const TIMEOUT_MS = 8000;

function apiKey(): string {
  return process.env.FEC_API_KEY || "DEMO_KEY";
}

export function fecConfigured(): boolean {
  return Boolean(process.env.FEC_API_KEY);
}

export interface FecCandidate {
  candidate_id: string;
  name: string; // "LAST, FIRST MIDDLE"
  party?: string;
  party_full?: string;
  office?: string; // H | S | P
  office_full?: string;
  state?: string;
  district?: string; // "12", "00" (at-large)
  district_number?: number;
  incumbent_challenge?: string; // I | C | O
  incumbent_challenge_full?: string;
  candidate_status?: string;
  election_years?: number[];
}

export interface FecTotals {
  candidate_id?: string;
  receipts?: number;
  disbursements?: number;
  cash_on_hand_end_period?: number;
  cycle?: number;
  coverage_end_date?: string;
}

async function fecGet(path: string, params: Record<string, string | number | undefined>): Promise<any | null> {
  const usp = new URLSearchParams({ api_key: apiKey() });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") usp.set(k, String(v));
  }
  const url = `${FEC_BASE}${path}?${usp.toString()}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// List statutory candidates for an office (+ optional House district) this cycle.
export async function fecCandidates(opts: {
  state: string;
  office: "H" | "S";
  district?: string;
  cycle?: number;
}): Promise<FecCandidate[] | null> {
  const cycle = opts.cycle ?? CURRENT_CYCLE;
  const dist = opts.district ? opts.district.padStart(2, "0") : undefined;
  const cacheKey = `tsr:fec:list:${opts.state}:${opts.office}:${dist ?? "all"}:${cycle}`;
  const cached = await getJSON<FecCandidate[]>(cacheKey);
  if (cached) return cached;

  const j = await fecGet("/candidates/", {
    state: opts.state,
    office: opts.office,
    district: opts.office === "H" ? dist : undefined,
    election_year: cycle,
    candidate_status: "C", // statutory candidate
    per_page: 100,
    sort: "name",
  });
  if (!j || !Array.isArray(j.results)) return null;
  const list = j.results as FecCandidate[];
  await setJSON(cacheKey, list, TTL);
  return list;
}

export async function fecCandidate(id: string): Promise<FecCandidate | null> {
  const cacheKey = `tsr:fec:cand:${id}`;
  const cached = await getJSON<FecCandidate>(cacheKey);
  if (cached) return cached;
  const j = await fecGet(`/candidate/${encodeURIComponent(id)}/`, {});
  const c = j && Array.isArray(j.results) ? (j.results[0] as FecCandidate) : null;
  if (c) await setJSON(cacheKey, c, TTL);
  return c;
}

export async function fecTotals(id: string, cycle = CURRENT_CYCLE): Promise<FecTotals | null> {
  const cacheKey = `tsr:fec:totals:${id}:${cycle}`;
  const cached = await getJSON<FecTotals>(cacheKey);
  if (cached) return cached;
  const j = await fecGet(`/candidate/${encodeURIComponent(id)}/totals/`, {
    cycle,
    per_page: 1,
    sort: "-cycle",
  });
  const t = j && Array.isArray(j.results) ? (j.results[0] as FecTotals) : null;
  if (t) await setJSON(cacheKey, t, TTL);
  return t;
}

// "LAST, FIRST MIDDLE" -> "First Last" for display.
export function fecDisplayName(raw: string): string {
  if (!raw) return "";
  const parts = raw.split(",");
  if (parts.length < 2) return titleCase(raw);
  const last = parts[0].trim();
  const first = parts[1].trim().split(/\s+/)[0]; // drop middle names/initials
  return titleCase(`${first} ${last}`);
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\bMc([a-z])/g, (_m, c) => "Mc" + c.toUpperCase())
    .replace(/\b(Ii|Iii|Iv)\b/g, (m) => m.toUpperCase());
}
