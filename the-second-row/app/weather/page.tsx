import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { civicWeather } from "@/lib/civic";
import { loadBoard } from "@/lib/store";

export const metadata: Metadata = { title: "The Civic Weather", description: "Today's board as a forecast — gravity pressure, flash risk, and the Disagreement Index." };
export const dynamic = "force-dynamic";

export default async function WeatherPage() {
  const board = await loadBoard();
  const w = civicWeather(board);
  const di = w.disagreement;
  const diLabel = di.index >= 66 ? "TWO PLANETS — the sides are barely covering the same country" : di.index >= 33 ? "DIVIDED — meaningful gaps in what each side leads with" : "NEAR CONSENSUS — rare agreement on what matters";

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Civic Weather · live</div>
        <h1>{w.sky}</h1>
        <p className="lede">
          The whole board, read like a forecast. Updated every sweep — a one-screen sense of the
          day before you read a word of it.
        </p>

        <div className="cards cards--3">
          <div className="card"><span className="stat"><span className="stat-num">{w.pressure}</span><span className="stat-label">gravity pressure (avg top-10)</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num" style={{ color: w.flashRisk === "ACTIVE" ? "var(--orange-ink)" : w.flashRisk === "ELEVATED" ? "var(--maroon-row)" : "var(--verdict)" }}>{w.flashRisk}</span><span className="stat-label">flash risk</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{w.seated}</span><span className="stat-label">stories on the board</span></span></div>
        </div>

        <h2>The Disagreement Index</h2>
        <div className="card" style={{ borderLeft: "3px solid var(--pulse)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span className="stat-num" style={{ fontFamily: "var(--mono)", fontSize: "2.6rem", color: "var(--pulse)" }}>{di.index}</span>
            <span className="mono" style={{ color: "var(--slate)" }}>/ 100 · {diLabel}</span>
          </div>
          <div className="tiltbar" style={{ marginTop: 10 }}>
            <span style={{ width: `${di.index}%`, background: "var(--pulse)" }} />
            <span style={{ width: `${100 - di.index}%`, background: "var(--bg-well)" }} />
          </div>
          <p style={{ marginTop: 10 }}>
            One number for how far apart left, center, and right sit across today&apos;s board —
            built from {di.multi} multi-source stories, {di.oneSided} of them carried by only one
            side. Nobody else publishes this. Watch it move across a year and you&apos;re watching
            the country&apos;s shared reality expand or contract.
          </p>
        </div>

        {w.flash && (
          <>
            <h2>Under an active flash</h2>
            <p><Link href={`/wire/${w.flash.id}`}>{w.flash.headline}</Link></p>
          </>
        )}

        <p className="mono" style={{ marginTop: 24, color: "var(--slate)" }}>
          Built from <Link href="/gravity">GRAVITY</Link> and the <Link href="/tilt">Tilt Meter</Link>.
          Prefer to listen? <Link href="/board-read">The Board Read →</Link>
        </p>
      </div>
    </>
  );
}
