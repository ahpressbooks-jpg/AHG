import { XMLParser } from "fast-xml-parser";
import { FeedSource } from "./sources";

export interface FeedItem {
  source: FeedSource;
  title: string;
  url: string;
  publishedAt: string; // ISO
  summary?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o["#text"] === "string") return o["#text"] as string;
    if (typeof o["#text"] === "number") return String(o["#text"]);
    if (typeof o["@_href"] === "string") return o["@_href"] as string;
  }
  return "";
}

function atomLink(link: unknown): string {
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const alt = link.find(
      (l) => l && typeof l === "object" && ((l as any)["@_rel"] === "alternate" || !(l as any)["@_rel"])
    );
    return text(alt ?? link[0]);
  }
  return text(link);
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ");
}

function stripHtml(s: string): string {
  return decodeEntities(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Aggregation posture: excerpts max ~25 words, always linked out. */
export function clampExcerpt(s: string, words = 25): string {
  const w = stripHtml(s).split(" ").filter(Boolean);
  if (w.length <= words) return w.join(" ");
  return w.slice(0, words).join(" ") + " …";
}

function parseDate(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Parse an RSS 2.0 or Atom document into normalized items. */
export function parseFeed(xml: string, source: FeedSource, now: Date): FeedItem[] {
  let doc: any;
  try {
    doc = parser.parse(xml);
  } catch {
    return [];
  }
  const out: FeedItem[] = [];

  const rssItems = doc?.rss?.channel?.item;
  const atomEntries = doc?.feed?.entry;
  const list = rssItems ? (Array.isArray(rssItems) ? rssItems : [rssItems])
    : atomEntries ? (Array.isArray(atomEntries) ? atomEntries : [atomEntries])
    : [];

  for (const it of list) {
    const title = stripHtml(text(it?.title));
    const url = rssItems ? text(it?.link) || text(it?.guid) : atomLink(it?.link);
    const when =
      parseDate(text(it?.pubDate)) ||
      parseDate(text(it?.published)) ||
      parseDate(text(it?.updated)) ||
      parseDate(text(it?.["dc:date"])) ||
      now.toISOString();
    const summary = stripHtml(text(it?.description) || text(it?.summary) || "");

    if (!title || !url || !/^https?:\/\//i.test(url)) continue;
    out.push({ source, title, url, publishedAt: when, summary: summary || undefined });
  }
  return out;
}

const FETCH_TIMEOUT_MS = 4500;

/** Tier-0 detection: poll one feed, time-boxed, errors contained. */
export async function fetchFeed(source: FeedSource, now: Date): Promise<{ items: FeedItem[]; error?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(source.feed, {
      signal: ctrl.signal,
      headers: {
        "user-agent": "TheSecondRow/1.0 (+civic news board; respectful polling)",
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });
    if (!res.ok) return { items: [], error: `${source.name}: HTTP ${res.status}` };
    const xml = await res.text();
    return { items: parseFeed(xml, source, now) };
  } catch (e: any) {
    const why = e?.name === "AbortError" ? "timeout" : (e?.message || "fetch failed");
    return { items: [], error: `${source.name}: ${why}` };
  } finally {
    clearTimeout(timer);
  }
}

/** Sweep the whole roster in parallel. The board never waits on a straggler. */
export async function sweepRoster(roster: FeedSource[], now: Date): Promise<{ items: FeedItem[]; errors: string[] }> {
  const results = await Promise.all(roster.map((s) => fetchFeed(s, now)));
  const items: FeedItem[] = [];
  const errors: string[] = [];
  for (const r of results) {
    items.push(...r.items);
    if (r.error) errors.push(r.error);
  }
  // Only consider the recent window — the board is a wire, not an archive.
  const cutoff = now.getTime() - 36 * 3600_000;
  return {
    items: items.filter((i) => new Date(i.publishedAt).getTime() > cutoff),
    errors,
  };
}
