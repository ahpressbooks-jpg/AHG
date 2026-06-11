// ---------------------------------------------------------------------------
// THE ROSTER — Tier-0 detection sources (RSS/Atom, free to poll).
// The desk owns this file: add, remove, and re-weight without touching code.
//
// weight: 3 = primary-wire grade · 2 = major masthead · 1 = aggregating/derivative
// owner:  corroboration counts independent OWNERS, never domains (anti-gaming).
// ---------------------------------------------------------------------------

export interface FeedSource {
  name: string;
  owner: string;
  feed: string;
  weight: number;
}

export const ROSTER: FeedSource[] = [
  { name: "NPR News",        owner: "NPR",            feed: "https://feeds.npr.org/1001/rss.xml", weight: 3 },
  { name: "BBC World",       owner: "BBC",            feed: "https://feeds.bbci.co.uk/news/world/rss.xml", weight: 3 },
  { name: "BBC US & Canada", owner: "BBC",            feed: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml", weight: 3 },
  { name: "PBS NewsHour",    owner: "PBS",            feed: "https://www.pbs.org/newshour/feed/", weight: 3 },
  { name: "The Guardian US", owner: "Guardian Media", feed: "https://www.theguardian.com/us-news/rss", weight: 2 },
  { name: "Guardian World",  owner: "Guardian Media", feed: "https://www.theguardian.com/world/rss", weight: 2 },
  { name: "NYT Home",        owner: "NYT Co",         feed: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", weight: 2 },
  { name: "NYT Politics",    owner: "NYT Co",         feed: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", weight: 2 },
  { name: "Politico",        owner: "Axel Springer",  feed: "https://rss.politico.com/politics-news.xml", weight: 2 },
  { name: "The Hill",        owner: "Nexstar",        feed: "https://thehill.com/news/feed/", weight: 2 },
  { name: "Axios",           owner: "Cox",            feed: "https://api.axios.com/feed/", weight: 2 },
  { name: "Fox News Politics", owner: "Fox Corp",     feed: "https://moxie.foxnews.com/google-publisher/politics.xml", weight: 2 },
  { name: "NBC News",        owner: "Comcast",        feed: "https://feeds.nbcnews.com/nbcnews/public/news", weight: 2 },
  { name: "ABC News",        owner: "Disney",         feed: "https://abcnews.go.com/abcnews/topstories", weight: 2 },
  { name: "CBS News",        owner: "Paramount",      feed: "https://www.cbsnews.com/latest/rss/main", weight: 2 },
  { name: "Al Jazeera",      owner: "Qatar Media",    feed: "https://www.aljazeera.com/xml/rss/all.xml", weight: 2 },
];

// ---------------------------------------------------------------------------
// THE BEAT — the charter, as multipliers (Decision A1).
// A story matching a beat gets its subtotal multiplied by (1 + bonus), capped.
// ---------------------------------------------------------------------------

export interface Beat {
  beat: string;
  bonus: number; // 0..0.25
  terms: string[];
}

export const BEATS: Beat[] = [
  { beat: "elections",  bonus: 0.22, terms: ["election", "ballot", "voter", "primary", "campaign", "electoral", "midterm", "polls"] },
  { beat: "congress",   bonus: 0.2,  terms: ["congress", "senate", "house ", "filibuster", "speaker", "legislation", "bill ", "appropriations", "shutdown"] },
  { beat: "white-house",bonus: 0.2,  terms: ["white house", "president", "executive order", "administration", "oval office", "veto"] },
  { beat: "courts",     bonus: 0.22, terms: ["supreme court", "scotus", "appeals court", "ruling", "injunction", "indictment", "justice department", "doj"] },
  { beat: "war-peace",  bonus: 0.25, terms: ["war", "ceasefire", "invasion", "strike", "missile", "troops", "nato", "sanctions", "treaty"] },
  { beat: "economy",    bonus: 0.15, terms: ["federal reserve", "inflation", "tariff", "jobs report", "recession", "deficit", "tax ", "budget"] },
  { beat: "statehouse", bonus: 0.12, terms: ["governor", "state legislature", "statehouse", "attorney general"] },
  { beat: "disaster",   bonus: 0.18, terms: ["hurricane", "earthquake", "wildfire", "tornado", "evacuation", "state of emergency", "flood"] },
  { beat: "health-policy", bonus: 0.12, terms: ["medicare", "medicaid", "fda", "cdc", "public health", "outbreak", "epidemic"] },
];

// Stories matching NO beat still seat — the beat is a thumb on the scale,
// not a gate. Pure celebrity/sports drift gets damped instead:
export const OFF_BEAT_DAMP: { terms: string[]; factor: number } = {
  terms: ["box office", "celebrity", "red carpet", "touchdown", "playoff", "premiere", "album", "kardashian", "royal family"],
  factor: 0.55,
};
