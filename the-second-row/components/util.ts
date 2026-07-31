import { BoardState, Tier } from "@/lib/types";

export function ageLabel(iso: string, nowMs: number): string {
  const min = Math.max(0, Math.round((nowMs - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export function clock(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function clockShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function inkStep(lastDev: string, nowMs: number): 0 | 1 | 2 | 3 {
  const min = (nowMs - new Date(lastDev).getTime()) / 60_000;
  if (min < 35) return 0;
  if (min < 150) return 1;
  if (min < 420) return 2;
  return 3;
}

export const DEPTH: Record<Tier, number> = {
  FLASH: 0,
  BULLETIN: 1,
  URGENT: 2,
  DEVELOPING: 3,
  BRIEF: 4,
};

export interface Diff {
  fresh: number;
  bumped: number;
  cooled: number;
  flashes: string[];
  total: number;
}

export function diffBoards(prev: BoardState, next: BoardState): Diff {
  const prevTier = new Map(prev.stories.map((s) => [s.id, s.tier]));
  const rank: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
  let fresh = 0,
    bumped = 0,
    cooled = 0;
  const flashes: string[] = [];
  for (const s of next.stories) {
    const was = prevTier.get(s.id);
    if (was == null) {
      fresh++;
      if (s.tier === "FLASH") flashes.push(s.id);
      continue;
    }
    if (was !== s.tier) {
      if (rank.indexOf(s.tier) < rank.indexOf(was)) {
        bumped++;
        if (s.tier === "FLASH") flashes.push(s.id);
      } else {
        cooled++;
      }
    }
  }
  return { fresh, bumped, cooled, flashes, total: fresh + bumped + cooled };
}

export function minutesBetweenMs(aMs: number, bMs: number): number {
  return Math.round(Math.abs(bMs - aMs) / 60_000);
}
