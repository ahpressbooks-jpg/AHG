// ===========================================================================
// GRAVITY — the algorithm that ranks the NEWS. THE AISLE WALL, IN CODE.
//
// This module and its implementation (lib/score.ts) MUST NOT import ANY module
// from the advocacy half — no floor, aisle, drafts, fights, floorvotes, well,
// or intake. No plank, campaign, Floor Vote, or draft may raise or lower a
// story's seat. This is not a convention: scripts/check-aisle.mjs scans these
// files and FAILS THE BUILD if news scoring ever imports advocacy code, so the
// wall is falsifiable rather than decorative. See /aisle.
// ===========================================================================
export * from "../score";

// Corroboration counts independent OWNERS (parent companies), never domains:
// forty outlets under one parent are one voice, not forty. The Wire's owners
// table joins through this. (Named test: forty-domains-one-owner.)
export function distinctOwners(sources: { owner: string }[]): number {
  return new Set(sources.map((s) => (s.owner || "").trim().toLowerCase()).filter(Boolean)).size;
}
