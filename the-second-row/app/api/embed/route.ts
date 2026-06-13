import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_BOARD } from "@/lib/sample";
import { loadBoard } from "@/lib/store";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const TIER: Record<string, string> = { FLASH: "#ff5c02", BULLETIN: "#8a1f35", URGENT: "#101319", DEVELOPING: "#5b6b7c", BRIEF: "#9aa6b2" };

// THE EMBEDDABLE MINI-BOARD — a self-contained HTML widget other sites and
// newsletters can iframe. Brand baked in, attribution non-removable, links out.
export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const n = Math.min(8, Math.max(3, Number(req.nextUrl.searchParams.get("n")) || 5));
  let board = await loadBoard();
  if (!board) board = SAMPLE_BOARD(new Date());
  const stories = board.stories.filter((s) => s.tier !== "BRIEF").slice(0, n);

  const rows = stories
    .map(
      (s, i) => `<a class="r" href="${base}/wire/${s.id}" target="_blank" rel="noopener">
        <span class="t" style="color:${TIER[s.tier]}">${s.tier}</span>
        <span class="h">${esc(s.headline)}</span>
        <span class="g">${s.score}</span></a>`
    )
    .join("");

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0}
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#101319;padding:14px}
  .hd{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #101319;padding-bottom:8px;margin-bottom:6px}
  .nm{font-weight:800;letter-spacing:.04em;font-size:.8rem}
  .lv{font:600 .58rem ui-monospace,monospace;letter-spacing:.12em;color:#8a1f35}
  .r{display:flex;gap:8px;align-items:baseline;padding:8px 0;border-bottom:1px solid rgba(16,19,25,.1);text-decoration:none;color:inherit}
  .r:hover .h{color:#2e5bff}
  .t{font:600 .54rem ui-monospace,monospace;letter-spacing:.06em;width:66px;flex:none}
  .h{font-size:.84rem;font-weight:600;line-height:1.3}
  .g{margin-left:auto;font:600 .6rem ui-monospace,monospace;color:#2e5bff;flex:none}
  .ft{margin-top:8px;font:.58rem ui-monospace,monospace;color:#5b6b7c;text-align:center}
  .ft a{color:#8a1f35;text-decoration:none}
</style></head><body>
  <div class="hd"><span class="nm">THE SECOND ROW</span><span class="lv">● LIVE · GRAVITY-RANKED</span></div>
  ${rows}
  <div class="ft">Ranked by <a href="${base}/gravity" target="_blank" rel="noopener">GRAVITY</a> · re-checked every 60s · <a href="${base}" target="_blank" rel="noopener">the live board →</a></div>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "frame-ancestors *",
      "Cache-Control": "public, max-age=60",
    },
  });
}
