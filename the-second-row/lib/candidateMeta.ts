// ---------------------------------------------------------------------------
// CANDIDATE METADATA — pure, dependency-free types + lookups shared by server
// (lib/candidates.ts) and client (the Election Lens finder/track UI). Kept
// separate so client components don't bundle the server-only FEC/store code.
// ---------------------------------------------------------------------------

export type Office = "H" | "S" | "G";

export interface Candidate {
  id: string; // FEC candidate_id, "gov-XX", or "sample-..."
  name: string;
  office: Office;
  state: string; // 2-letter
  district?: string; // House only: "12" or "At-large"
  party?: string; // display, e.g. "Democratic"
  partyCode?: string; // DEM / REP / IND / ...
  incumbent?: boolean;
  status?: string; // "Incumbent" | "Challenger" | "Open seat" | ...
  source: "fec" | "curated" | "sample";
  fecId?: string;
  isRace?: boolean; // governor "races" (track the seat, not a person)
  sourceUrl?: string; // authoritative external link (governors)
}

export interface CandidateMoney {
  raised: number;
  spent: number;
  cash: number;
  cycle: number;
  asOf?: string;
  available: boolean; // false when FEC is unreachable
}

export const OFFICE_LABEL: Record<Office, string> = {
  H: "U.S. House",
  S: "U.S. Senate",
  G: "Governor",
};

// 50 states + DC + the voting territories (for the pickers + validation).
export const US_STATES: { code: string; name: string }[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
  ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"],
  ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
  ["GU", "Guam"], ["VI", "U.S. Virgin Islands"], ["MP", "Northern Mariana Islands"],
].map(([code, name]) => ({ code, name }));

export function stateName(code: string): string {
  return US_STATES.find((s) => s.code === code.toUpperCase())?.name ?? code.toUpperCase();
}

// States/territories holding a governor's race in 2026 (36 states + 3 territories = 39).
export const GOV_STATES_2026 = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "FL", "GA", "HI", "ID", "IL", "IA", "KS", "ME",
  "MD", "MA", "MI", "MN", "NE", "NV", "NH", "NM", "NY", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "VT", "WI", "WY", "GU", "VI", "MP",
];

const PARTY_LABEL: Record<string, string> = {
  DEM: "Democratic", REP: "Republican", IND: "Independent", LIB: "Libertarian",
  GRE: "Green", CON: "Constitution", DFL: "Democratic–Farmer–Labor", NPA: "No Party Affiliation",
};

export function partyLabel(code?: string, full?: string): string {
  if (full && full.trim()) return full.trim();
  if (!code) return "—";
  return PARTY_LABEL[code.toUpperCase()] ?? code.toUpperCase();
}

// Short party tag for chips (DEM/REP/IND…) from either a code or a full label.
export function partyTag(code?: string, party?: string): string {
  if (code) return code.toUpperCase().slice(0, 3);
  if (party) return party.toUpperCase().slice(0, 3);
  return "—";
}
