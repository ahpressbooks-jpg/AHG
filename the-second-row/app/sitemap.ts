import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const page = (url: string, freq: "always" | "daily" | "weekly" | "monthly", priority: number) => ({
    url: `${base}${url}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  });
  return [
    page("/", "always", 1),
    page("/today", "daily", 0.9),
    page("/spin", "daily", 0.8),
    page("/ledger", "daily", 0.8),
    page("/column", "daily", 0.8),
    page("/company", "monthly", 0.7),
    page("/gravity", "monthly", 0.7),
    page("/tilt", "daily", 0.6),
    page("/glass", "weekly", 0.6),
    page("/rewind", "daily", 0.5),
    page("/toolkit", "monthly", 0.6),
    page("/course", "monthly", 0.5),
    page("/room", "monthly", 0.5),
    page("/founding", "weekly", 0.5),
    page("/press", "monthly", 0.4),
    page("/subscribe", "monthly", 0.7),
    page("/standards", "monthly", 0.4),
    page("/method", "monthly", 0.4),
  ];
}
