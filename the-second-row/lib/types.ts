export type Tier = "FLASH" | "BULLETIN" | "URGENT" | "DEVELOPING" | "BRIEF";

export type Certainty = "CONFIRMED" | "REPORTED" | "DEVELOPING" | "DISPUTED";

export interface SourceRef {
  name: string;
  owner: string;
  url: string;
  weight: number; // 1..3, 3 = primary wire grade
}

export interface StoryEvent {
  at: string; // ISO
  event: string; // human line, e.g. "Seated URGENT by the board"
  by: "board" | "desk";
}

export interface Workings {
  corroboration: number; // independent owners
  corroborationDelta: number; // owners gained last sweep
  velocity45: number; // pickups in last 45 min
  firstSeen: string;
  lastDev: string;
  maxSourceWeight: number;
  beats: string[]; // matched editorial beats
  gravity?: number; // optional LLM gravity 0..10
  webCorroboration?: number; // extra distinct domains via Parallel
  score: number;
}

export interface Story {
  id: string;
  headline: string;
  excerpt?: string;
  url: string; // representative outbound link
  tier: Tier;
  prevTier?: Tier;
  score: number;
  certainty: Certainty;
  seatedAt: string; // when current tier was assigned
  firstSeen: string;
  lastDev: string;
  sources: SourceRef[];
  owners: number;
  spark: number[]; // pickups per 15-min bucket, oldest -> newest (8 buckets)
  workings: Workings;
  history: StoryEvent[];
  arrivals: string[]; // ISO timestamps of item arrivals (capped)
  pending?: { tier: Tier; count: number }; // hysteresis ladder
  flash?: {
    raisedAt: string;
    confirmed: boolean; // desk-confirmed vs machine-seated
  };
  desk?: {
    pinned?: boolean;
    forcedTier?: Tier;
    killed?: boolean;
  };
}

export interface RawItem {
  at: string; // ISO
  source: string;
  title: string;
  url: string;
}

export interface SweepLogEntry {
  at: string;
  version: number;
  line: string; // "3 new · 2 bumped · 1 cooled"
  ms: number;
  errors?: string[];
}

export interface BoardState {
  version: number;
  sweptAt: string;
  stories: Story[]; // seated order: stage first
  raw: RawItem[]; // recent unranked firehose (capped)
  log: SweepLogEntry[]; // recent sweeps (capped)
  sample: boolean; // true when serving the labeled sample board
  method: string; // board method version, e.g. "v1.0"
}

export interface BoardDiff {
  fresh: number;
  bumped: number;
  cooled: number;
  flashes: string[]; // story ids newly at FLASH
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
