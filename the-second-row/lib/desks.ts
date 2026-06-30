// THE SITE MAP — one source of truth for the whole publication's navigation:
// desks, sections (topics), products, company, help, and legal. Powers the
// two-tier nav, the mega-menu, the big footer, and the site index.

export interface Desk {
  label: string;
  href: string;
  blurb: string;
}

// Primary masthead row — the publication's pillars, in priority order.
// The wordmark is Home; the Ledger and the Wire co-lead.
export const DESKS: Desk[] = [
  { label: "The Ledger", href: "/ledger", blurb: "Every claim, scored in the open" },
  { label: "The Wire", href: "/wire", blurb: "Live, re-ranked every 60s" },
  { label: "Dispatches", href: "/dispatches", blurb: "Daily from the desk" },
  { label: "Investigations", href: "/investigations", blurb: "Open files & public research" },
  { label: "Action", href: "/action", blurb: "Campaigns & civic action" },
  { label: "Room", href: "/room", blurb: "Public reasoning, together" },
];

export interface Topic {
  slug: string;
  label: string;
  beats: string[];
  accent: string;
  primary?: boolean; // shown in the compact nav topic row
}

// The full section system — every section backed by a real beat in lib/sources.ts.
export const TOPICS: Topic[] = [
  { slug: "politics", label: "Politics", beats: ["elections", "congress", "white-house"], accent: "#8A1F35", primary: true },
  { slug: "world", label: "World", beats: ["world", "war-peace"], accent: "#6D28D9", primary: true },
  { slug: "courts", label: "Courts & Justice", beats: ["courts"], accent: "#2E5BFF", primary: true },
  { slug: "economy", label: "Economy", beats: ["economy"], accent: "#0E7C4A", primary: true },
  { slug: "tech", label: "Technology", beats: ["tech"], accent: "#0E7490", primary: true },
  { slug: "climate", label: "Climate", beats: ["climate", "disaster"], accent: "#15803D", primary: true },
  { slug: "health", label: "Health", beats: ["health-policy"], accent: "#B91C6B" },
  { slug: "science", label: "Science", beats: ["science"], accent: "#1D4ED8" },
  { slug: "education", label: "Education", beats: ["education"], accent: "#B45309" },
  { slug: "immigration", label: "Immigration", beats: ["immigration"], accent: "#9A3412" },
  { slug: "media", label: "Media & Press", beats: ["media"], accent: "#7C3AED" },
  { slug: "state", label: "State & Local", beats: ["statehouse"], accent: "#475569" },
];

export const PRIMARY_TOPICS = TOPICS.filter((t) => t.primary);

export function topicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function topicForBeats(beats: string[] | undefined): Topic | undefined {
  if (!beats || beats.length === 0) return undefined;
  return TOPICS.find((t) => t.beats.some((b) => beats.includes(b)));
}

// ---- the rest of the site map (products, company, help, legal) ----

export interface SiteLink {
  label: string;
  href: string;
  sub?: string;
}

export const PRODUCTS: SiteLink[] = [
  { label: "The Ledger", href: "/ledger", sub: "Claims, scored over time" },
  { label: "The Wire", href: "/wire", sub: "Live ranked board" },
  { label: "Dispatches", href: "/dispatches", sub: "Daily from the desk" },
  { label: "Investigations", href: "/investigations", sub: "Open files & research" },
  { label: "Action Center", href: "/action", sub: "Campaigns & civic action" },
  { label: "Stories", href: "/wire", sub: "What's moving now" },
  { label: "Today", href: "/today", sub: "The daily briefing" },
  { label: "The Spin Room", href: "/spin", sub: "Left / center / right" },
  { label: "The Ledger", href: "/ledger", sub: "The desk's scored record" },
  { label: "From the Second Row", href: "/column", sub: "The column" },
  { label: "The Toolkit", href: "/toolkit", sub: "Learn the method" },
  { label: "The Assignment Desk", href: "/assignment-desk", sub: "You direct the reporting" },
  { label: "Documents", href: "/documents", sub: "Annotated sources" },
  { label: "The Rewind", href: "/rewind", sub: "Replay the board" },
  { label: "The Third Act", href: "/third-act", sub: "How stories ended" },
  { label: "Civic Weather", href: "/weather", sub: "Today as a forecast" },
  { label: "The Board Read", href: "/board-read", sub: "Listen" },
  { label: "GRAVITY", href: "/gravity", sub: "The algorithm" },
  { label: "The Tilt Meter", href: "/tilt", sub: "Our balance, live" },
  { label: "The Glass Desk", href: "/glass", sub: "Open books" },
  { label: "Judgment Seasons", href: "/seasons", sub: "The tournament" },
  { label: "Predictions Night", href: "/predictions-night", sub: "The annual seal" },
  { label: "Classroom", href: "/classroom", sub: "For teachers" },
  { label: "The Glossary", href: "/glossary", sub: "The words, explained" },
  { label: "Search", href: "/search", sub: "Find it on the record" },
  { label: "Trending", href: "/trending", sub: "Most read now" },
];

// The Instrument's slim index — powers the repointed mega-menu. The ten
// instruments live in lib/instrument.ts (FEATURES); these are the human pages
// around them. Everything here resolves to a real route.
export const NEWSROOM: SiteLink[] = [
  { label: "About", href: "/about", sub: "What the Instrument is" },
  { label: "Standards & Ethics", href: "/standards", sub: "How we work" },
  { label: "The Method", href: "/method", sub: "GRAVITY, in the open" },
  { label: "Contact", href: "/contact", sub: "Reach the desk" },
  { label: "Send a tip", href: "/tips", sub: "Securely, off the record" },
];

export const ACCOUNT: SiteLink[] = [
  { label: "Your seat", href: "/you", sub: "Your account & activity" },
  { label: "Membership", href: "/subscribe", sub: "Support the build" },
  { label: "Search the record", href: "/search", sub: "Find any story" },
];

export const COMPANY: SiteLink[] = [
  { label: "About", href: "/about", sub: "Who we are" },
  { label: "Masthead", href: "/masthead", sub: "The newsroom" },
  { label: "The Thesis", href: "/company", sub: "Why we exist" },
  { label: "Careers", href: "/careers", sub: "Work with us" },
  { label: "Contact", href: "/contact", sub: "Reach the desk" },
  { label: "Tips", href: "/tips", sub: "Securely send a tip" },
  { label: "Press", href: "/press", sub: "Press kit" },
  { label: "Standards & Ethics", href: "/standards", sub: "How we work" },
  { label: "Corrections", href: "/corrections", sub: "The record, fixed" },
  { label: "The Founding 500", href: "/founding", sub: "The first believers" },
];

export const HELP: SiteLink[] = [
  { label: "Help & FAQ", href: "/help" },
  { label: "Subscribe", href: "/subscribe" },
  { label: "Gift a seat", href: "/subscribe" },
  { label: "Newsletters", href: "/newsletters" },
  { label: "Podcasts & Audio", href: "/podcasts" },
  { label: "RSS feeds", href: "/rss" },
  { label: "Site Index", href: "/site-index" },
  { label: "Your Seat", href: "/you" },
];

export const LEGAL: SiteLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "The Method", href: "/method" },
];

// Editorial content-modes — the visible label that tells a reader exactly what
// kind of thing they're entering (essential trust in a hybrid newsroom/advocacy
// model). Every card and header carries one.
export type ContentMode =
  | "reported" | "investigated" | "dispatch" | "analysis" | "opinion"
  | "action" | "ledger" | "evidence" | "explainer" | "methodology" | "correction" | "wire";

export const MODE_LABEL: Record<ContentMode, string> = {
  reported: "Reported",
  investigated: "Investigated",
  dispatch: "Dispatch",
  analysis: "Analysis",
  opinion: "Opinion",
  action: "Action",
  ledger: "Ledger",
  evidence: "Evidence",
  explainer: "Explainer",
  methodology: "Methodology",
  correction: "Correction",
  wire: "The Wire",
};
