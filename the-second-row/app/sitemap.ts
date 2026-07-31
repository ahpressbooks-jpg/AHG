import type { MetadataRoute } from "next";
import { COMPANY, HELP, LEGAL, PRODUCTS, TOPICS } from "@/lib/desks";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const page = (url: string, freq: "always" | "daily" | "weekly" | "monthly", priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}${url}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  });
  const uniq = new Map<string, MetadataRoute.Sitemap[number]>();
  const add = (e: MetadataRoute.Sitemap[number]) => uniq.set(e.url, e);

  add(page("/", "always", 1));
  add(page("/wire", "always", 0.95));
  add(page("/today", "daily", 0.9));
  add(page("/trending", "daily", 0.7));
  TOPICS.forEach((t) => add(page(`/topic/${t.slug}`, "daily", 0.75)));
  PRODUCTS.forEach((p) => add(page(p.href, "daily", 0.7)));
  COMPANY.forEach((c) => add(page(c.href, "monthly", 0.5)));
  HELP.forEach((h) => add(page(h.href, "monthly", 0.5)));
  LEGAL.forEach((l) => add(page(l.href, "monthly", 0.3)));
  ["/about", "/masthead", "/careers", "/contact", "/tips", "/corrections", "/help", "/newsletters", "/podcasts", "/rss", "/subscribe", "/standards"].forEach((u) => add(page(u, "monthly", 0.5)));

  return [...uniq.values()];
}
