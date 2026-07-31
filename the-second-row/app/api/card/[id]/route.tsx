import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getArchived } from "@/lib/records";
import { loadBoard } from "@/lib/store";

export const dynamic = "force-dynamic";

// The vertical share card: 9:16, TikTok/IG/Shorts-ready, generated per story.
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const board = await loadBoard();
  const story = board?.stories.find((s) => s.id === id) ?? (await getArchived(id));

  const tierColor: Record<string, string> = {
    FLASH: "#FF5C02",
    BULLETIN: "#8A1F35",
    URGENT: "#101319",
    DEVELOPING: "#5B6B7C",
    BRIEF: "#9AA6B2",
  };

  const headline = story?.headline ?? "The Second Row — The Wire";
  const tier = story?.tier ?? "URGENT";
  const score = story?.score ?? 0;
  const owners = story?.owners ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          padding: 80,
          justifyContent: "space-between",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 60, height: 14, background: "#5B6B7C", borderRadius: 7 }} />
            <div style={{ display: "flex", width: 90, height: 20, background: "#8A1F35", borderRadius: 10 }} />
            <div style={{ display: "flex", width: 60, height: 14, background: "#101319", borderRadius: 7 }} />
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#5B6B7C", letterSpacing: 8 }}>THE SECOND ROW</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: tierColor[tier] ?? "#101319",
              color: "#fff",
              fontSize: 30,
              letterSpacing: 6,
              padding: "12px 28px",
              borderRadius: 999,
            }}
          >
            {tier} · GRAVITY {score}
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#101319", lineHeight: 1.15 }}>
            {headline.length > 120 ? headline.slice(0, 117) + "…" : headline}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#5B6B7C" }}>
            {owners} independent newsrooms · the rank shows its work
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", width: 240, height: 8, background: "#8A1F35", borderRadius: 4 }} />
          <div style={{ display: "flex", fontSize: 30, color: "#101319" }}>One row back. Full view.</div>
          <div style={{ display: "flex", fontSize: 26, color: "#5B6B7C" }}>thesecondrow · founded at 21</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
