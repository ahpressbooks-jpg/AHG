import { FeedItem } from "./rss";
import { Story } from "./types";

// ---------------------------------------------------------------------------
// Clustering: one story, many sources. Title-token similarity, deterministic,
// no model required. Scraped text is matched, never executed.
// ---------------------------------------------------------------------------

const STOP = new Set([
  "the","a","an","and","or","but","of","in","on","at","to","for","with","as","by","from",
  "is","are","was","were","be","been","it","its","this","that","these","those","after",
  "over","under","about","into","amid","near","up","down","out","off","new","says","say",
  "said","will","would","could","should","has","have","had","not","no","more","most",
  "how","what","why","when","where","who","his","her","their","they","he","she","we",
  "you","your","than","then","now","just","also","amid","live","updates","update","watch",
  "analysis","opinion","breaking","report","reports",
]);

export function tokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[â€™']/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  );
}

export function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  const jaccard = inter / union;
  const overlapRatio = inter / Math.min(a.size, b.size);
  // Wire headlines vary in length wildly; blend set-overlap with Jaccard.
  return Math.max(jaccard, overlapRatio * 0.75);
}

const SAME_STORY = 0.42;

export function canonicalUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

export function shortHash(s: string): string {
  // FNV-1a, hex — stable ids without a crypto dependency.
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export interface Cluster {
  story?: Story; // present when this cluster continues an existing seated story
  key: Set<string>; // representative token set
  items: FeedItem[];
}

/**
 * Match fresh feed items against the existing board first (stable story ids),
 * then cluster the leftovers among themselves.
 */
export function clusterItems(existing: Story[], items: FeedItem[]): Cluster[] {
  const clusters: Cluster[] = existing.map((s) => ({
    story: s,
    key: tokens(s.headline),
    items: [],
  }));

  const seenUrls = new Set<string>();
  for (const s of existing) for (const src of s.sources) seenUrls.add(canonicalUrl(src.url));

  // Dedupe raw items by canonical URL within this sweep.
  const fresh: FeedItem[] = [];
  const sweepUrls = new Set<string>();
  for (const it of items) {
    const cu = canonicalUrl(it.url);
    if (sweepUrls.has(cu)) continue;
    sweepUrls.add(cu);
    fresh.push(it);
  }

  for (const it of fresh) {
    const cu = canonicalUrl(it.url);
    const t = tokens(it.title);
    let best: Cluster | null = null;
    let bestScore = 0;
    for (const c of clusters) {
      const s = similarity(t, c.key);
      if (s > bestScore) {
        bestScore = s;
        best = c;
      }
    }
    if (best && bestScore >= SAME_STORY) {
      if (!seenUrls.has(cu)) best.items.push(it);
      // Grow the representative token set so follow-up phrasings still match.
      for (const tok of t) if (best.key.size < 24) best.key.add(tok);
    } else {
      clusters.push({ key: t, items: [it] });
    }
  }

  return clusters;
}

/** Pick the cluster's representative headline: heaviest source, then longest. */
export function representative(items: FeedItem[]): FeedItem {
  return [...items].sort(
    (a, b) => b.source.weight - a.source.weight || b.title.length - a.title.length
  )[0];
}
