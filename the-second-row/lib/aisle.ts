import { BoardState, Story } from "./types";
import { FloorItem } from "./floor";

// ---------------------------------------------------------------------------
// THE AISLE — the wall between the news half and the advocacy half. The
// statement below is published verbatim on /aisle and excerpted in the footer.
//
// The wall is enforced in CODE, not just prose:
//   • lib/scoring/gravity.ts (GRAVITY) MUST NOT import any Floor module — see the
//     comment at the top of that file. News scoring cannot touch advocacy code.
//   • CROSSING is computed the honest direction here: it only DISCLOSES overlap
//     (a Wire story touching a BACK/FIGHT fight); it never re-ranks anything.
// ---------------------------------------------------------------------------

export const AISLE_STATEMENT =
  "The Wire and the Floor are separate instruments under one name. GRAVITY — the algorithm that ranks the news — contains zero inputs from the advocacy side: no plank, no campaign, no Floor Vote, and no draft can raise or lower a story's seat. The Wire's roster, weights, and Tilt Meter run exactly as published, whether the Floor is fighting a bill or silent. When a story on the Wire touches a fight on the Floor, the story carries a visible CROSSING tag disclosing the conflict — and the Tilt Meter counts those stories in a separate, public column. The news half does not campaign. The advocacy half does not rank the news. Anyone who catches either half breaking this is invited to say so on the record — and the Ledger will grade the answer.";

export const AISLE_FOOTER_LINE =
  "The Wire ranks the news; the Floor fights for law. GRAVITY takes zero inputs from the advocacy side.";

// A "fight" is a Floor item the desk has taken a side on (BACK or FIGHT).
export function activeFights(items: FloorItem[]): FloorItem[] {
  return items.filter((i) => i.verdict === "BACK" || i.verdict === "FIGHT");
}

function keywordsFor(item: FloorItem): string[] {
  // Distinctive words from the plain title + official title / number.
  const stop = new Set(["the", "a", "an", "of", "for", "and", "to", "in", "on", "that", "you", "your", "can", "with", "what", "still", "next", "year", "bill", "rule", "sample", "measure", "act"]);
  const words = (item.plain_title + " " + item.official_title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !stop.has(w));
  return Array.from(new Set(words)).slice(0, 8);
}

export interface Crossing {
  story: Story;
  fight: FloorItem;
}

// Match seated Wire stories against active fights. Disclosure only — this shares
// no code path with the scoring module and cannot influence any seat.
export function crossings(board: BoardState | null, items: FloorItem[]): Crossing[] {
  if (!board?.stories?.length) return [];
  const fights = activeFights(items);
  if (!fights.length) return [];
  const out: Crossing[] = [];
  for (const story of board.stories) {
    const hay = (story.headline + " " + story.sources.map((s) => s.title || "").join(" ")).toLowerCase();
    for (const fight of fights) {
      const kws = keywordsFor(fight);
      if (kws.some((k) => hay.includes(k))) {
        out.push({ story, fight });
        break; // one badge per story
      }
    }
  }
  return out;
}

export function isCrossing(story: Story, items: FloorItem[]): FloorItem | null {
  const c = crossings({ stories: [story] } as BoardState, items);
  return c.length ? c[0].fight : null;
}
