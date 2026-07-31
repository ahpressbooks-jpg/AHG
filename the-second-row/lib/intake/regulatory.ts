import { FloorItem } from "../floor";
import { computeStakes } from "../scoring/stakes";

// REGULATORY PIPE — the Federal Register API (free, no key). Proposed rules with
// open public comment periods. CLOCK for these is driven entirely by the comment
// close date. Returns null on failure. Keyword/agency watchlists are a later
// enhancement (stored + desk-editable per the brief).

const BASE = "https://www.federalregister.gov/api/v1/documents.json";
const TIMEOUT_MS = 9000;

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.round((new Date(iso + "T23:59:59Z").getTime() - Date.now()) / 86400_000);
}

export async function fetchRegulatory(limit = 20): Promise<FloorItem[] | null> {
  const params = new URLSearchParams({
    "conditions[type][]": "PRORULE",
    per_page: String(limit),
    order: "newest",
  });
  ["document_number", "title", "abstract", "html_url", "comment_url", "comments_close_on", "docket_ids", "agencies"].forEach(
    (f) => params.append("fields[]", f)
  );
  const url = `${BASE}?${params.toString()}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" }, cache: "no-store" });
    if (!res.ok) return null;
    const j: any = await res.json();
    const docs: any[] = Array.isArray(j?.results) ? j.results : [];
    return docs
      .map((d) => {
        const closes = d.comments_close_on as string | undefined;
        const dLeft = daysUntil(closes);
        if (dLeft !== null && dLeft < 0) return null; // window already closed
        const title = d.title || "Proposed rule";
        const agency = d.agencies?.[0]?.name ? String(d.agencies[0].name).toUpperCase() : "AGENCY";
        const stakes = computeStakes({ level: "REGULATORY", title, actionText: "comment open", daysToDeadline: dLeft, ageDays: 3 });
        const item: FloorItem = {
          id: `reg-${d.document_number}`,
          official_title: title,
          plain_title: title,
          plain_summary: `Provisional intake — desk plain-language pending. ${d.abstract || ""}`.trim(),
          tier: "COMMENT OPEN",
          level: "REGULATORY",
          levelLabel: dLeft != null ? `REGULATORY · CLOSES ${dLeft} DAYS` : "REGULATORY · COMMENT OPEN",
          closesAt: closes ? `${closes}T23:59:59Z` : undefined,
          docketId: Array.isArray(d.docket_ids) ? d.docket_ids[0] : undefined,
          commentUrl: d.comment_url || d.html_url,
          sourceUrl: d.html_url || "https://www.federalregister.gov/",
          stakes,
          events: [{ at: new Date().toISOString(), event: `Comment period open (${agency})` }],
          source: "live",
          updatedAt: new Date().toISOString(),
        };
        return item;
      })
      .filter(Boolean) as FloorItem[];
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
