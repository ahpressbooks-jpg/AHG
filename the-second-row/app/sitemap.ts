import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "always", priority: 1 },
    { url: `${base}/briefing`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/spin`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/ledger`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/method`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/standards`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
