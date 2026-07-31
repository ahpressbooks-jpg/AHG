import { getJSON, setJSON } from "./store";

// THE FIGHT LEDGER — every fight the Floor enters, with the same discipline as
// the news Ledger: losses sort FIRST, and a loss must carry a post-mortem of
// what the desk got wrong about the map. Opens with the first fight, not before.

export interface Fight {
  id: string;
  title: string;
  href?: string;
  position: "BACK" | "FIGHT";
  stakesAtEntry: number;
  effort: "Full" | "Backing" | "Watching";
  outcome: "Won" | "Lost" | "Ongoing";
  postmortem?: string; // required when outcome === "Lost"
  enteredAt: string;
  resolvedAt?: string;
}

const KEY = "tsr:fights";

export async function loadFights(): Promise<Fight[]> {
  return (await getJSON<Fight[]>(KEY)) ?? [];
}
export async function saveFights(fights: Fight[]): Promise<void> {
  await setJSON(KEY, fights);
}

// Losses first (the discipline), then ongoing, then wins; newest within each.
const ORDER: Record<Fight["outcome"], number> = { Lost: 0, Ongoing: 1, Won: 2 };
export function sortFights(fights: Fight[]): Fight[] {
  return [...fights].sort(
    (a, b) => ORDER[a.outcome] - ORDER[b.outcome] || +new Date(b.enteredAt) - +new Date(a.enteredAt)
  );
}
