import { BoardState } from "./types";

// THE DISAGREEMENT INDEX — how far apart the country's newsrooms sit today,
// computed from the board's own framing data. 0 = unison, 100 = two planets.
export function disagreementIndex(b: BoardState | null): { index: number; multi: number; oneSided: number } {
  const multi = (b?.stories ?? []).filter((s) => s.owners >= 2);
  if (multi.length === 0) return { index: 0, multi: 0, oneSided: 0 };
  let oneSided = 0;
  let imbalance = 0;
  for (const s of multi) {
    const sp = s.spread ?? { L: 0, C: 0, R: 0 };
    const total = Math.max(1, sp.L + sp.C + sp.R);
    const sides = [sp.L > 0, sp.C > 0, sp.R > 0].filter(Boolean).length;
    if (sides === 1) oneSided++;
    imbalance += Math.abs(sp.L - sp.R) / total;
  }
  const index = Math.round(100 * (0.55 * (oneSided / multi.length) + 0.45 * (imbalance / multi.length)));
  return { index: Math.min(100, index), multi: multi.length, oneSided };
}

// THE CIVIC WEATHER — the board as a forecast.
export function civicWeather(b: BoardState | null) {
  const stories = b?.stories ?? [];
  const top = stories.slice(0, 10);
  const pressure = top.length ? Math.round(top.reduce((a, s) => a + s.score, 0) / top.length) : 0;
  const flash = stories.find((s) => s.tier === "FLASH") ?? null;
  const nearFlash = stories.some((s) => s.tier !== "FLASH" && s.score >= 75);
  const d = disagreementIndex(b);
  const sky =
    pressure >= 70 ? "STORM SYSTEM — heavy gravity over the board" :
    pressure >= 55 ? "FRONT MOVING IN — several consequential stories developing" :
    pressure >= 40 ? "PARTLY CONSEQUENTIAL — a normal civic day" :
    "CLEAR SKIES — a quiet board; enjoy it";
  return {
    pressure,
    sky,
    flash,
    flashRisk: flash ? "ACTIVE" : nearFlash ? "ELEVATED" : "LOW",
    disagreement: d,
    seated: stories.length,
  };
}
