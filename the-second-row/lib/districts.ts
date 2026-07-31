// ---------------------------------------------------------------------------
// DISTRICT LOOKUP — turn an address or ZIP into a state + U.S. House district,
// so a reader can find "my representative's race" without knowing their CD.
// Uses the free, official U.S. Census Geocoder (no key). Server-side + timed
// out; returns null on any failure so the UI falls back to the manual pickers.
// (Note: like all external calls, this needs outbound network — works on the
// deployed site; a locked-down dev/sandbox will return null and use pickers.)
// ---------------------------------------------------------------------------

const CENSUS_BASE = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
const TIMEOUT_MS = 8000;

// FIPS (2-digit) → USPS state code.
const FIPS_TO_USPS: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY", "60": "AS", "66": "GU", "69": "MP", "72": "PR", "78": "VI",
};

export interface DistrictResult {
  state: string; // USPS 2-letter
  district: string; // "12" or "At-large"
  matched: string; // the normalized address the geocoder matched
}

export async function resolveDistrict(query: string): Promise<DistrictResult | null> {
  const q = query.trim();
  if (!q) return null;

  const usp = new URLSearchParams({
    address: q,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "all",
    format: "json",
  });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${CENSUS_BASE}?${usp.toString()}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j: any = await res.json();
    const match = j?.result?.addressMatches?.[0];
    if (!match) return null;

    const geos = match.geographies || {};
    // The CD layer name carries the Congress number (e.g. "119th Congressional Districts").
    const cdKey = Object.keys(geos).find((k) => /congressional district/i.test(k));
    const cd = cdKey ? geos[cdKey]?.[0] : null;
    if (!cd) return null;

    const fips = String(cd.STATE || "").padStart(2, "0");
    const state = FIPS_TO_USPS[fips];
    if (!state) return null;

    // District number lives in a CD### field or BASENAME; "00"/"98" → at-large.
    const cdField = Object.keys(cd).find((k) => /^CD\d/.test(k));
    const rawNum = String((cdField ? cd[cdField] : cd.BASENAME) ?? "").trim();
    const num = parseInt(rawNum, 10);
    const district = !Number.isFinite(num) || num === 0 || num >= 98 ? "At-large" : String(num);

    return { state, district, matched: match.matchedAddress || q };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
