import { DeskDoc } from "./extras";

// A worked sample so Document mode is never empty before the desk authors one.
export const SAMPLE_DOC: DeskDoc = {
  slug: "sample-continuing-resolution",
  title: "[SAMPLE] The Continuing Resolution, annotated",
  kind: "bill",
  summary: "A demonstration of Document mode: the primary text on the left, the desk's plain-language margin notes on the right. Fictional excerpt, real format.",
  sourceUrl: "https://www.congress.gov",
  at: new Date().toISOString(),
  blocks: [
    { quote: "SEC. 101. Such amounts as may be necessary, at a rate for operations as provided in the applicable appropriations Acts for fiscal year 2025…", note: "Translation: keep funding everything at last year's levels. This single sentence is what a 'stopgap' actually is — no new decisions, just the snooze button.", tag: "POLICY" },
    { quote: "…shall be available through the earlier of (1) enactment of the applicable appropriations Act, or (2) the date specified in section 106.", note: "The deadline. Miss it and you're back here — or shut down. Watch this date, not the press releases.", tag: "FACT" },
    { quote: "SEC. 134. Notwithstanding any other provision of this Act, the following sums are designated as emergency requirements…", note: "'Notwithstanding' is the tell. Emergency designations dodge the spending caps — this is where money moves that the headline number doesn't show.", tag: "OPINION" },
  ],
};
