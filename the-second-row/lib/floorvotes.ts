import { listPush, listRange } from "./store";
import { shortHash } from "./cluster";
import { activeFights } from "./aisle";
import { loadDrafts } from "./drafts";
import { loadFloor, stakesScore } from "./floor";

// ---------------------------------------------------------------------------
// FLOOR VOTES — the members' ranked vote on the ORDER OF BATTLE. The
// constitution renders verbatim before the ballot. Enforced structurally: the
// ballot's option set is desk-curated (drafts + live BACK/FIGHT items only), so
// an out-of-spine option cannot appear — you can set priority within the spine,
// never against it.
// ---------------------------------------------------------------------------

export const VOTE_CONSTITUTION =
  "Floor Votes set priority within the spine; they cannot amend a locked plank or vote the desk into fighting against one; the majority decides what we fight for first — never who counts as a free person.";

export interface VoteOption { id: string; label: string; kind: "draft" | "fight"; href: string; sub?: string }
export interface Ballot { id: string; ranking: string[]; at: string } // ordered option ids, top first
const POINTS = [3, 2, 1]; // weighting for a top-3 ranked ballot

const KEY = "tsr:floorvotes";

// The eligible options — only what the desk is actually committing to (drafts +
// items with a BACK/FIGHT verdict). Nothing else can be voted onto the queue.
export async function voteOptions(): Promise<VoteOption[]> {
  const [drafts, floor] = await Promise.all([loadDrafts(), loadFloor()]);
  const opts: VoteOption[] = drafts.map((d) => ({
    id: `draft:${d.slug}`, label: `Draft No. ${d.n}: ${d.title}`, kind: "draft", href: `/drafting-table/${d.slug}`, sub: d.area,
  }));
  for (const f of activeFights(floor)) {
    opts.push({ id: `fight:${f.id}`, label: `${f.verdict}: ${f.plain_title}`, kind: "fight", href: `/floor/${f.id}`, sub: `STAKES ${stakesScore(f.stakes)}` });
  }
  return opts;
}

export async function getBallots(n = 20000): Promise<Ballot[]> {
  const rows = await listRange(KEY, 0, n - 1);
  return rows.map((r) => { try { return JSON.parse(r) as Ballot; } catch { return null; } }).filter(Boolean) as Ballot[];
}

export async function castBallot(ranking: string[]): Promise<Ballot> {
  const b: Ballot = { id: shortHash(ranking.join(",") + Date.now() + Math.random()), ranking: ranking.slice(0, 3), at: new Date().toISOString() };
  await listPush(KEY, JSON.stringify(b), 100000);
  return b;
}

// The current standing — the priority queue the desk commits effort to.
export function tally(options: VoteOption[], ballots: Ballot[]): { option: VoteOption; points: number; first: number }[] {
  const pts = new Map<string, number>();
  const firsts = new Map<string, number>();
  for (const b of ballots) {
    b.ranking.forEach((id, i) => {
      if (i < POINTS.length) pts.set(id, (pts.get(id) ?? 0) + POINTS[i]);
      if (i === 0) firsts.set(id, (firsts.get(id) ?? 0) + 1);
    });
  }
  return options
    .map((option) => ({ option, points: pts.get(option.id) ?? 0, first: firsts.get(option.id) ?? 0 }))
    .sort((a, b) => b.points - a.points || b.first - a.first);
}
