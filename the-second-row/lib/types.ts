export type Tier = "FLASH" | "BULLETIN" | "URGENT" | "DEVELOPING" | "BRIEF";

export type Certainty = "CONFIRMED" | "REPORTED" | "DEVELOPING" | "DISPUTED";

export type Lean = "L" | "C" | "R";

export type Resolution = "ONGOING" | "RESOLVED" | "FADED";

export interface SourceRef {
  name: string;
  owner: string;
  url: string;
  weight: number; // 1..3, 3 = primary wire grade
  lean: Lean;
  title?: string; // the outlet's own headline (powers the Lens)
}

export interface StoryEvent {
  at: string; // ISO
  event: string;
  by: "board" | "desk";
}

export interface Workings {
  corroboration: number; // independent owners
  corroborationDelta: number;
  velocity45: number;
  firstSeen: string;
  lastDev: string;
  maxSourceWeight: number;
  beats: string[];
  consequence?: number; // 0..10 — people touched, how directly, how long
  power?: number; // 0..10 — is power being exercised or checked
  gravityAssist?: number; // optional LLM 0..10 blended into consequence/power
  webCorroboration?: number;
  score: number; // the GRAVITY score 0..100
}

export interface Story {
  id: string;
  headline: string;
  excerpt?: string;
  url: string;
  tier: Tier;
  prevTier?: Tier;
  score: number; // GRAVITY 0..100
  certainty: Certainty;
  seatedAt: string;
  firstSeen: string;
  lastDev: string;
  sources: SourceRef[];
  owners: number;
  spark: number[];
  spread: { L: number; C: number; R: number }; // framing spectrum by lean
  workings: Workings;
  history: StoryEvent[];
  arrivals: string[];
  resolution?: { state: Resolution; note?: string; at: string };
  pending?: { tier: Tier; count: number };
  flash?: { raisedAt: string; confirmed: boolean };
  desk?: { pinned?: boolean; forcedTier?: Tier; killed?: boolean };
}

export interface RawItem {
  at: string;
  source: string;
  title: string;
  url: string;
}

export interface SweepLogEntry {
  at: string;
  version: number;
  line: string;
  ms: number;
  errors?: string[];
}

export interface BoardState {
  version: number;
  sweptAt: string;
  stories: Story[];
  raw: RawItem[];
  log: SweepLogEntry[];
  sample: boolean;
  method: string;
}

export interface BoardDiff {
  fresh: number;
  bumped: number;
  cooled: number;
  flashes: string[];
}

export interface DeskOverrides {
  [storyId: string]: {
    pinned?: boolean;
    forcedTier?: Tier;
    killed?: boolean;
    flashConfirmed?: boolean;
    flashStoodDown?: boolean;
  };
}

// ---------------------------------------------------------------------------
// THE PERMANENT RECORD — everything human is durable.
// ---------------------------------------------------------------------------

export type UserTier = "floor" | "pro" | "founding";

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string; // the seat plate — one line, shown on the public profile
  seatColor?: string; // avatar color, from the fixed palette (never orange)
  publicProfile?: boolean; // default true; false = the seat keeps to itself
  tier: UserTier;
  foundingNumber?: number;
  verified: boolean;
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "grace" | "canceled";
  periodEnd?: string;
  giftCodes?: string[];
}

export type CommentTarget = `story:${string}` | `post:${string}`;

export interface Comment {
  id: string;
  target: string; // CommentTarget
  userId: string;
  name: string;
  tier: UserTier;
  text: string;
  certainty: "CERTAIN" | "LIKELY" | "GUESSING";
  steelman?: string; // required for rebuttals — the Steelman Gate
  parentId?: string;
  sealed?: boolean; // a Sealed Take: hidden until the story resolves
  sealedOpen?: boolean;
  minds: number; // "this moved me" count
  at: string;
  status: "live" | "held" | "removed";
}

export interface Post {
  slug: string;
  title: string;
  dek: string;
  body: string; // markdown-lite: paragraphs + [FACT]/[OPINION]/[QUESTION]/[POLICY]/[THINKING] tags
  kind: "column" | "steelman" | "note";
  publishedAt: string;
  updatedAt?: string;
}

export interface ReaderCall {
  id: string;
  userId: string;
  name: string;
  storyId: string;
  storyHeadline: string;
  claim: string;
  confidence: "CERTAIN" | "LIKELY" | "GUESSING";
  at: string;
  result?: "HIT" | "MISS"; // marked by the desk when reality settles it
  resolvedAt?: string;
}

export interface DeskCall {
  id: string;
  claim: string;
  confidence: "CERTAIN" | "LIKELY" | "GUESSING";
  at: string;
  workings?: string; // the reasoning — Pro-visible detail
  result?: "HIT" | "MISS";
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface Edition {
  date: string; // YYYY-MM-DD desk time
  number: number;
  frozenAt: string;
  stories: { id: string; headline: string; tier: Tier; score: number; url: string }[];
  note?: string; // the founder's note that morning
}

export interface Snapshot {
  at: string;
  version: number;
  stories: { id: string; headline: string; tier: Tier; score: number }[];
}
