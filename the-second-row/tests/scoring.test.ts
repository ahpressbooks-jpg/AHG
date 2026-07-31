import { describe, expect, it } from "vitest";
import { FloorItem, isImminent, seatFloor, stakesScore } from "../lib/floor";
import { computeStakes } from "../lib/scoring/stakes";
import { certaintyFor, distinctOwners } from "../lib/scoring/gravity";

describe("STAKES scoring (lib/scoring/stakes + lib/floor)", () => {
  it("weights the composite so all-100 signals score 100, all-0 score 0", () => {
    expect(stakesScore({ reach: 100, force: 100, motion: 100, odds: 100, clock: 100 })).toBe(100);
    expect(stakesScore({ reach: 0, force: 0, motion: 0, odds: 0, clock: 0 })).toBe(0);
  });
  it("REACH is higher for federal national scope than a city measure", () => {
    const fed = computeStakes({ level: "FEDERAL", title: "a national federal mandate on all families" });
    const city = computeStakes({ level: "CITY", title: "a local ordinance" });
    expect(fed.reach).toBeGreaterThan(city.reach);
  });
  it("FORCE rises with coercion/money words", () => {
    const hard = computeStakes({ level: "FEDERAL", title: "new tax, new crime, new mandate, new spending" });
    const soft = computeStakes({ level: "FEDERAL", title: "a resolution honoring a day" });
    expect(hard.force).toBeGreaterThan(soft.force);
  });
  it("CLOCK is near-max inside 3 days and low when far off", () => {
    expect(computeStakes({ level: "FEDERAL", title: "x", daysToDeadline: 2 }).clock).toBeGreaterThan(90);
    expect(computeStakes({ level: "FEDERAL", title: "x", daysToDeadline: 90 }).clock).toBeLessThan(30);
  });
  it("clamps every signal to 0..100", () => {
    const s = computeStakes({
      level: "FEDERAL",
      title: "tax crime mandate spending fund fee fine ban require prohibit national federal every families workers students veterans",
      hasFiscalNote: true,
    });
    for (const v of Object.values(s)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

describe("Floor imminence + seating (lib/floor)", () => {
  const now = Date.UTC(2026, 0, 1, 0, 0, 0);
  const iso = (h: number) => new Date(now + h * 3600_000).toISOString();
  it("is imminent inside 72h, and not before, after, or absent", () => {
    expect(isImminent({ closesAt: iso(24) }, now)).toBe(true);
    expect(isImminent({ closesAt: iso(100) }, now)).toBe(false);
    expect(isImminent({ closesAt: iso(-1) }, now)).toBe(false);
    expect(isImminent({ closesAt: undefined }, now)).toBe(false);
  });
  it("seats live process before outcomes", () => {
    const mk = (id: string, tier: FloorItem["tier"]): FloorItem => ({
      id, official_title: id, plain_title: id, plain_summary: "", tier, level: "FEDERAL", levelLabel: "",
      stakes: { reach: 50, force: 50, motion: 50, odds: 50, clock: 50 }, sourceUrl: "", events: [], source: "sample", updatedAt: "",
    });
    const seated = seatFloor([mk("passed", "PASSED"), mk("floor", "ON THE FLOOR"), mk("filed", "FILED")]);
    expect(seated.map((i) => i.id)).toEqual(["floor", "filed", "passed"]);
  });
});

describe("GRAVITY corroboration + certainty (lib/score)", () => {
  it("counts independent OWNERS, not domains — the forty-domains-one-owner case", () => {
    const forty = Array.from({ length: 40 }, (_, i) => ({ owner: "Gannett", url: `outlet${i}.com` }));
    expect(distinctOwners(forty)).toBe(1);
    const mixed = [{ owner: "Gannett" }, { owner: "Hearst" }, { owner: "Tribune" }, { owner: "Gannett" }];
    expect(distinctOwners(mixed)).toBe(3);
  });
  it("certainty thresholds", () => {
    expect(certaintyFor(4, 3)).toBe("CONFIRMED");
    expect(certaintyFor(2, 1)).toBe("REPORTED");
    expect(certaintyFor(1, 1)).toBe("DEVELOPING");
  });
});
