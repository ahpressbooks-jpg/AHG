import { METHOD_VERSION } from "./score";
import { BoardState, Story, Tier } from "./types";

// ---------------------------------------------------------------------------
// THE SAMPLE BOARD — served only when the wire is unreachable and the board
// has no memory, or when explicitly requested (?sample=1) for design review.
// Always watermarked SAMPLE in the masthead. Every headline below is
// fictional and labeled as such on the story itself.
// ---------------------------------------------------------------------------

const ago = (now: Date, min: number) => new Date(now.getTime() - min * 60_000).toISOString();

const LEANS: ("L" | "C" | "R")[] = ["C", "L", "R", "C", "L", "C"];

function story(
  now: Date,
  id: string,
  tier: Tier,
  headline: string,
  excerpt: string,
  owners: string[],
  minsAgo: number,
  lastDevMin: number,
  score: number,
  spark: number[],
  beats: string[]
): Story {
  const sources = owners.map((o, i) => ({
    name: o,
    owner: o,
    url: "https://example.com/sample/" + id + "/" + i,
    weight: i === 0 ? 3 : 2,
    lean: LEANS[i % LEANS.length],
    title: headline.replace("[SAMPLE] ", `[SAMPLE · ${o}] `),
  }));
  const spread = { L: 0, C: 0, R: 0 };
  for (const s of sources) spread[s.lean]++;
  return {
    id,
    headline,
    excerpt,
    url: "https://example.com/sample/" + id,
    tier,
    score,
    certainty: owners.length >= 4 ? "CONFIRMED" : owners.length >= 2 ? "REPORTED" : "DEVELOPING",
    seatedAt: ago(now, lastDevMin),
    firstSeen: ago(now, minsAgo),
    lastDev: ago(now, lastDevMin),
    sources,
    owners: owners.length,
    spark,
    spread,
    workings: {
      corroboration: owners.length,
      corroborationDelta: tier === "FLASH" ? 4 : tier === "BULLETIN" ? 2 : 0,
      velocity45: spark.slice(-3).reduce((a, b) => a + b, 0),
      firstSeen: ago(now, minsAgo),
      lastDev: ago(now, lastDevMin),
      maxSourceWeight: 3,
      beats,
      consequence: tier === "FLASH" ? 9 : tier === "BULLETIN" ? 7 : 4,
      power: tier === "FLASH" ? 8 : tier === "BULLETIN" ? 7 : 3,
      score,
    },
    history: [
      { at: ago(now, minsAgo), event: "First seen on the wire · seated DEVELOPING", by: "board" },
      ...(tier === "FLASH"
        ? [
            { at: ago(now, 22), event: "Bumped to BULLETIN — held across sweeps", by: "board" as const },
            { at: ago(now, 6), event: "Bumped to FLASH — flash conditions met", by: "board" as const },
          ]
        : tier === "BULLETIN"
          ? [{ at: ago(now, 30), event: "Bumped to BULLETIN — held across sweeps", by: "board" as const }]
          : []),
    ],
    arrivals: [],
    flash: tier === "FLASH" ? { raisedAt: ago(now, 6), confirmed: false } : undefined,
  };
}

export function SAMPLE_BOARD(now: Date): BoardState {
  const stories: Story[] = [
    story(
      now, "smpl0001", "FLASH",
      "[SAMPLE] Federal court halts national guard deployment in 3-state ruling",
      "A fictional headline demonstrating the FLASH protocol: orange takes the stage, the house lights dim, the clock turns. This is design-review data.",
      ["NPR", "BBC", "NYT Co", "Comcast", "Fox Corp", "Guardian Media"],
      48, 4, 91, [0, 0, 1, 1, 2, 3, 4, 5], ["courts", "white-house"]
    ),
    story(
      now, "smpl0002", "BULLETIN",
      "[SAMPLE] Senate reaches surprise framework on appropriations ahead of deadline",
      "Fictional. The maroon row — the second row — with its flanking dots, holding the top of the house under the stage.",
      ["NPR", "Axel Springer", "Nexstar", "Cox", "Paramount"],
      130, 18, 76, [0, 1, 1, 2, 2, 2, 1, 2], ["congress"]
    ),
    story(
      now, "smpl0003", "BULLETIN",
      "[SAMPLE] Storm system intensifies toward gulf coast; two states declare emergencies",
      "Fictional. A second bulletin, seated by score beneath the first.",
      ["BBC", "Disney", "Paramount", "Qatar Media"],
      95, 26, 71, [1, 1, 2, 1, 1, 1, 1, 0], ["disaster"]
    ),
    story(
      now, "smpl0004", "URGENT",
      "[SAMPLE] Justice department opens review of state election data systems",
      "Fictional. The ink-navy band of the urgent tier.",
      ["NYT Co", "Guardian Media", "NPR"],
      210, 47, 58, [0, 1, 1, 1, 0, 1, 0, 0], ["courts", "elections"]
    ),
    story(
      now, "smpl0005", "URGENT",
      "[SAMPLE] Allies announce joint naval exercise after strait incident",
      "Fictional. Corroboration still building — watch the workings panel.",
      ["BBC", "Qatar Media"],
      150, 65, 53, [1, 0, 1, 0, 1, 0, 0, 0], ["war-peace"]
    ),
    story(
      now, "smpl0006", "DEVELOPING",
      "[SAMPLE] Fed officials signal patience on rates in split remarks",
      "Fictional. The slate tier: noted, seated mid-house, not yet urgent.",
      ["Cox", "NYT Co"],
      260, 110, 39, [1, 1, 0, 0, 1, 0, 0, 0], ["economy"]
    ),
    story(
      now, "smpl0007", "DEVELOPING",
      "[SAMPLE] Statehouse passes school funding overhaul on party-line vote",
      "Fictional.",
      ["Nexstar"],
      300, 140, 33, [0, 1, 0, 1, 0, 0, 0, 0], ["statehouse"]
    ),
    story(
      now, "smpl0008", "BRIEF",
      "[SAMPLE] Agency finalizes rule on regional water permits",
      "Fictional. Back-row ink, cooling.",
      ["PBS"],
      420, 240, 21, [1, 0, 0, 0, 0, 0, 0, 0], []
    ),
    story(
      now, "smpl0009", "BRIEF",
      "[SAMPLE] Census bureau updates county population estimates",
      "Fictional.",
      ["NPR"],
      500, 380, 14, [0, 0, 0, 0, 0, 0, 0, 0], []
    ),
    story(
      now, "smpl0010", "BRIEF",
      "[SAMPLE] Transit authority approves five-year capital plan",
      "Fictional.",
      ["Disney"],
      560, 430, 11, [0, 0, 0, 0, 0, 0, 0, 0], []
    ),
  ];

  return {
    version: 1,
    sweptAt: now.toISOString(),
    stories,
    raw: stories.map((s) => ({
      at: s.lastDev,
      source: s.sources[0]?.name ?? "Wire",
      title: s.headline,
      url: s.url,
    })),
    log: [
      {
        at: now.toISOString(),
        version: 1,
        line: "SAMPLE BOARD — live wire unreachable or design review requested",
        ms: 0,
      },
    ],
    sample: true,
    method: METHOD_VERSION,
  };
}
