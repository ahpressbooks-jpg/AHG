"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Snapshot } from "@/lib/types";

// THE REWIND — scrub the front page back through time. Every sweep is stored;
// the board is replayable. See exactly what the Wire looked like at 9:04 p.m.
export default function RewindPage() {
  const [recent, setRecent] = useState<Snapshot[]>([]);
  const [hourly, setHourly] = useState<Snapshot[]>([]);
  const [gated, setGated] = useState(false);
  const [idx, setIdx] = useState(0);
  const [track, setTrack] = useState<"recent" | "hourly">("recent");

  useEffect(() => {
    fetch("/api/rewind", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const rec = (d.recent ?? []).slice().reverse(); // oldest → newest
        const hr = (d.hourly ?? []).slice().reverse();
        setRecent(rec);
        setHourly(hr);
        setGated(Boolean(d.gated));
        setIdx(Math.max(0, rec.length - 1));
      })
      .catch(() => {});
  }, []);

  const frames = track === "recent" ? recent : hourly;
  const frame = frames[Math.min(idx, frames.length - 1)];

  const tierColor: Record<string, string> = useMemo(
    () => ({ FLASH: "var(--orange)", BULLETIN: "var(--maroon-row)", URGENT: "var(--ink)", DEVELOPING: "var(--slate)", BRIEF: "var(--ink-3)" }),
    []
  );

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Rewind · replay the board</div>
        <h1>The front page, at any minute, forever.</h1>
        <p className="lede">
          Every sweep is kept. Drag the slider and watch the house re-seat itself backward —
          historic front pages as permanent record, not memory.
        </p>

        <div className="seg" role="group" aria-label="Rewind track" style={{ marginBottom: 14 }}>
          <button aria-pressed={track === "recent"} onClick={() => { setTrack("recent"); setIdx(Math.max(0, recent.length - 1)); }}>
            Sweep-by-sweep (last hours)
          </button>
          <button aria-pressed={track === "hourly"} onClick={() => { setTrack("hourly"); setIdx(Math.max(0, hourly.length - 1)); }}>
            Hour-by-hour (last {gated ? "7 days — free" : "30 days"})
          </button>
        </div>

        {frames.length === 0 ? (
          <div className="card">
            <div className="card-kicker">The tape is short</div>
            <p>The Rewind records from the moment the engine first ran with a database attached. Give it a few sweeps — history accumulates on its own.</p>
          </div>
        ) : (
          <>
            <input
              className="rewind-slider"
              type="range"
              min={0}
              max={frames.length - 1}
              value={Math.min(idx, frames.length - 1)}
              onChange={(e) => setIdx(Number(e.target.value))}
              aria-label="Scrub the board through time"
            />
            {frame && (
              <>
                <p className="rewind-stamp" suppressHydrationWarning>
                  {new Date(frame.at).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}{" "}
                  · sweep v{frame.version} · frame {Math.min(idx, frames.length - 1) + 1}/{frames.length}
                </p>
                <div>
                  {frame.stories.map((s, i) => (
                    <div key={s.id + i} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid var(--line)" }}>
                      <span className="mono" style={{ fontSize: "0.62rem", color: tierColor[s.tier] ?? "var(--ink)", width: 86, flexShrink: 0, letterSpacing: "0.08em" }}>{s.tier}</span>
                      <Link href={`/wire/${s.id}`} style={{ textDecoration: "none", fontFamily: i === 0 ? "var(--serif)" : "var(--sans)", fontSize: i === 0 ? "1.15rem" : "0.9rem", fontWeight: 600 }}>
                        {s.headline}
                      </Link>
                      <span className="mono" style={{ marginLeft: "auto", fontSize: "0.64rem", color: "var(--pulse)" }}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {gated && (
          <div className="rope" style={{ marginTop: 24 }}>
            <div className="rope-kicker">The Velvet Rope</div>
            <p>The Floor rewinds 7 days. Pro rewinds all of history — election nights included, forever.</p>
            <Link className="btn btn--maroon" href="/subscribe">Open the full tape — $8/mo</Link>
          </div>
        )}
      </div>
    </>
  );
}
