import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/desk", "/admin", "/api/", "/you"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
