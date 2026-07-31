import { FloorItem, FloorTier } from "../floor";
import { computeStakes } from "../scoring/stakes";

// FEDERAL PIPE — Congress.gov API v3 (free key, CONGRESS_GOV_API_KEY). Polled by
// the Floor cron. Returns null on any failure so the board keeps its prior data.
// Plain titles/summaries here are provisional (marked); the desk approves the
// real plain-language from the control room.

const BASE = "https://api.congress.gov/v3";
const TIMEOUT_MS = 9000;

function key(): string | null {
  return process.env.CONGRESS_GOV_API_KEY || null;
}
export function federalConfigured(): boolean {
  return Boolean(key());
}

function tierFromAction(text: string): FloorTier {
  const t = (text || "").toLowerCase();
  if (/became public law|signed by president|enacted/.test(t)) return "PASSED";
  if (/vetoed|failed|rejected|motion to table agreed/.test(t)) return "DIED";
  if (/passed|agreed to in (house|senate)|on passage/.test(t)) return "ON THE FLOOR";
  if (/reported|placed on.*calendar|scheduled/.test(t)) return "ON THE FLOOR";
  if (/committee/.test(t)) return "IN COMMITTEE";
  return "FILED";
}

function daysSince(iso?: string): number {
  if (!iso) return 60;
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400_000));
}

export async function fetchFederal(limit = 25): Promise<FloorItem[] | null> {
  const k = key();
  if (!k) return null;
  const url = `${BASE}/bill?api_key=${encodeURIComponent(k)}&format=json&limit=${limit}&sort=updateDate+desc`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" }, cache: "no-store" });
    if (!res.ok) return null;
    const j: any = await res.json();
    const bills: any[] = Array.isArray(j?.bills) ? j.bills : [];
    return bills.map((b) => {
      const number = `${String(b.type || "").toUpperCase()} ${b.number}`;
      const chamber = (b.originChamber || "").toUpperCase();
      const actionText = b.latestAction?.text || "";
      const tier = tierFromAction(actionText);
      const title = b.title || `${number}`;
      const ageDays = daysSince(b.latestAction?.actionDate || b.updateDate);
      const stakes = computeStakes({ level: "FEDERAL", title, actionText, ageDays });
      const item: FloorItem = {
        id: `fed-${(b.type || "").toLowerCase()}-${b.number}-${b.congress}`,
        official_title: title,
        plain_title: title, // provisional — desk rewrites in plain language
        plain_summary: `Provisional intake — the desk has not yet written the plain-language translation for this measure. Latest action: ${actionText || "n/a"}.`,
        tier,
        level: "FEDERAL",
        levelLabel: `FEDERAL · ${chamber || "CONGRESS"}`,
        number,
        sourceUrl: b.url ? String(b.url).replace("api.congress.gov/v3", "www.congress.gov") : "https://www.congress.gov/",
        stakes,
        events: [{ at: b.latestAction?.actionDate || b.updateDate || new Date().toISOString(), event: actionText || "Updated" }],
        source: "live",
        updatedAt: b.updateDate || new Date().toISOString(),
      };
      return item;
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
