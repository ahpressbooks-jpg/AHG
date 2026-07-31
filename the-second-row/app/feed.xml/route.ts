import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));

// A real RSS feed of the top of the board — the publication's own wire, out.
export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://thesecondrow.news";
  let board = await loadBoard();
  if (boardIsStale(board)) board = await runSweep();
  const stories = (board?.stories ?? []).slice(0, 30);

  const items = stories
    .map(
      (s) => `    <item>
      <title>${esc(s.headline)}</title>
      <link>${base}/wire/${s.id}</link>
      <guid isPermaLink="false">${s.id}</guid>
      <pubDate>${new Date(s.lastDev).toUTCString()}</pubDate>
      <category>${esc(s.tier)}</category>
      <description>${esc((s.excerpt || "") + ` — GRAVITY ${s.score}, ${s.owners} independent newsrooms.`)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>The Second Row — The Wire</title>
    <link>${base}/wire</link>
    <description>The day, ranked by what carries weight. Re-ranked every 60 seconds.</description>
    <lastBuildDate>${new Date(board?.sweptAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}
