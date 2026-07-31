import { describe, expect, it } from "vitest";
import { activeFights, crossings } from "../lib/aisle";
import { FloorItem, Verdict } from "../lib/floor";

const fight = (id: string, verdict: Verdict | undefined, plain_title: string): FloorItem => ({
  id, official_title: plain_title, plain_title, plain_summary: "", tier: "ON THE FLOOR", level: "FEDERAL", levelLabel: "",
  stakes: { reach: 1, force: 1, motion: 1, odds: 1, clock: 1 }, verdict, sourceUrl: "", events: [], source: "sample", updatedAt: "",
});
const board = (headlines: string[]) => ({ stories: headlines.map((h) => ({ id: h.slice(0, 6), headline: h, sources: [] })) } as any);

describe("The Aisle — CROSSING is disclosure only", () => {
  it("activeFights keeps only BACK / FIGHT items", () => {
    const items = [fight("a", "BACK", "x"), fight("b", "WATCHING", "y"), fight("c", "FIGHT", "z"), fight("d", undefined, "w")];
    expect(activeFights(items).map((f) => f.id)).toEqual(["a", "c"]);
  });
  it("flags a story that shares a distinctive keyword with an active fight", () => {
    const items = [fight("f1", "FIGHT", "Educational continuity for foster youth")];
    const cr = crossings(board(["State moves on foster youth continuity bill", "Unrelated weather story"]), items);
    expect(cr.length).toBe(1);
    expect(cr[0].fight.id).toBe("f1");
  });
  it("never flags anything when there are no active fights (a WATCHING item is not a fight)", () => {
    const items = [fight("w", "WATCHING", "Educational continuity for foster youth")];
    expect(crossings(board(["foster youth continuity everywhere"]), items).length).toBe(0);
  });
});
