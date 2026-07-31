import { getJSON, setJSON } from "./store";

// ---------------------------------------------------------------------------
// THE DRAFTING TABLE — TSR-authored policy drafted in public and versioned like
// software. The steelman is a SCHEMA FIELD, not a convention: a draft cannot
// exist in this type without the strongest opposing case, so it literally
// cannot be published without one. Store-backed, seeded with Draft No. 001.
// ---------------------------------------------------------------------------

export interface DraftChange {
  version: string; // e.g. "1.2"
  at: string;
  changed: string; // what changed
  because: string; // which argument earned it
}

export interface Draft {
  n: string; // "001"
  slug: string;
  title: string;
  area: string; // a Docket area
  status: "Open for markup" | "Proposed" | "Adopted" | "Withdrawn";
  version: string;
  problem: string;
  mechanism: string;
  whoPays: string;
  whoObjects: string;
  steelman: string; // REQUIRED — the strongest case against
  changelog: DraftChange[];
  updatedAt: string;
}

const KEY = "tsr:drafts";

export async function loadDrafts(): Promise<Draft[]> {
  const stored = await getJSON<Draft[]>(KEY);
  if (stored && stored.length) return stored;
  return SEED_DRAFTS;
}
export async function getDraft(slug: string): Promise<Draft | null> {
  return (await loadDrafts()).find((d) => d.slug === slug) ?? null;
}
export async function saveDrafts(drafts: Draft[]): Promise<void> {
  await setJSON(KEY, drafts);
}

// A published draft MUST carry a steelman — enforced at the type level and here.
export function isPublishable(d: Partial<Draft>): d is Draft {
  return Boolean(d.problem && d.mechanism && d.whoPays && d.whoObjects && d.steelman && d.steelman.trim().length > 40);
}

// Draft No. 001 — Texas foster-youth educational access. Seed content; replace
// with the desk's canonical text from the control room if it differs.
export const SEED_DRAFTS: Draft[] = [
  {
    n: "001",
    slug: "texas-foster-youth-education",
    title: "Educational continuity for Texas foster youth",
    area: "Foster care",
    status: "Open for markup",
    version: "1.0",
    problem:
      "A child in Texas foster care changes placements, on average, more than once a year — and most placement changes force a school change mid-year. Each mid-year school change costs a student months of learning and severs the relationships that keep a kid in class at all. Foster youth graduate high school and enroll in college at far lower rates than their peers, and the single most-cited, most-fixable driver is instability of schooling: lost records, lost credits, lost transportation.",
    mechanism:
      "Three concrete guarantees, each already piloted somewhere and costed. (1) School-of-origin stability: when a placement changes, the child stays in their current school for the rest of the term unless it is against the child's interest, with the state covering transportation. (2) Instant records + credit transfer: a 5-business-day hard deadline for transferring records and awarding partial credit for work already completed, enforced by the education agency, not left to individual schools. (3) A single named point of contact per district — a foster-care liaison — accountable for these two guarantees, published by name.",
    whoPays:
      "The state, through the education agency's existing transportation and homeless-youth (McKinney-Vento) infrastructure, which already does exactly this for a smaller population. The marginal cost is transportation reimbursement and liaison time; the offset is fewer repeated grades, fewer dropouts, and lower downstream costs of a young adult who did not finish school. The draft attaches a fiscal note with the per-pupil transportation estimate and the graduation-rate lift assumed.",
    whoObjects:
      "School districts worried about unfunded transportation mandates; child-welfare agencies worried about a new compliance deadline they can miss; and a fair budget hawk who wants the offset proven, not asserted.",
    steelman:
      "The strongest case against: mandates without money become paper rights. If the transportation reimbursement is set too low or arrives too late, districts will quietly route around the school-of-origin guarantee, and a 5-day records deadline with no funded enforcement just generates violations nobody acts on — leaving foster youth exactly where they started but with a law on the books that lets everyone claim the problem is solved. A guarantee the state cannot afford to enforce is worse than an honest 'we are working on it,' because it launders inaction as progress. The burden is on this draft to fund the enforcement, not just declare the right.",
    changelog: [
      { version: "1.0", at: "2026-01-15T00:00:00Z", changed: "First public draft opened for markup.", because: "Seed version." },
    ],
    updatedAt: "2026-01-15T00:00:00Z",
  },
];
