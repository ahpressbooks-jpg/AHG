// THE DESK & TOPIC SYSTEM — one source of truth for the publication's
// taxonomy. Desks are products/content-modes; topics are beats (real, drawn
// from lib/sources.ts). Accents are flat label colors — never gradients,
// never the FLASH orange (which stays sacred to FLASH alone).

export interface Desk {
  label: string;
  href: string;
  blurb: string;
}

// The primary masthead row — the publication's desks, in reading order.
export const DESKS: Desk[] = [
  { label: "Top Stories", href: "/", blurb: "The front page" },
  { label: "The Wire", href: "/wire", blurb: "Live, re-ranked every 60s" },
  { label: "Analysis", href: "/column", blurb: "Interpretation & opinion" },
  { label: "Explainers", href: "/toolkit", blurb: "How to read the news" },
  { label: "Investigations", href: "/assignment-desk", blurb: "Reader-directed reporting" },
  { label: "Documents", href: "/documents", blurb: "Primary sources, annotated" },
];

export interface Topic {
  slug: string;
  label: string;
  beats: string[]; // maps to Story.workings.beats / matchedBeats output
  accent: string; // flat hue for the topic chip
}

// The utility row — topics, every one backed by a real beat in the data.
export const TOPICS: Topic[] = [
  { slug: "politics", label: "Politics", beats: ["elections", "congress", "white-house"], accent: "#8A1F35" },
  { slug: "courts", label: "Courts", beats: ["courts"], accent: "#2E5BFF" },
  { slug: "economy", label: "Economy", beats: ["economy"], accent: "#0E7C4A" },
  { slug: "foreign", label: "Foreign", beats: ["war-peace"], accent: "#6D28D9" },
  { slug: "state", label: "State", beats: ["statehouse"], accent: "#B45309" },
  { slug: "health", label: "Health", beats: ["health-policy"], accent: "#0E7490" },
];

export function topicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

// Given a story's matched beats, the first topic it belongs to (for chips).
export function topicForBeats(beats: string[] | undefined): Topic | undefined {
  if (!beats || beats.length === 0) return undefined;
  return TOPICS.find((t) => t.beats.some((b) => beats.includes(b)));
}

// Editorial content-modes — the visual register a reader is entering.
export type ContentMode = "report" | "analysis" | "opinion" | "explainer" | "investigation" | "evidence" | "wire";

export const MODE_LABEL: Record<ContentMode, string> = {
  report: "Report",
  analysis: "Analysis",
  opinion: "Opinion",
  explainer: "Explainer",
  investigation: "Investigation",
  evidence: "Evidence",
  wire: "The Wire",
};
