"use client";

import Link from "next/link";
import { BoardState } from "@/lib/types";

// THE PULSE RAIL — the live dashboard beside the house: sweep timer,
// Top 5 by GRAVITY, movers, FLASH status. Sticky on desktop, a swipeable
// card row on phones.
export default function Rail({
  board,
  nowMs,
  movers,
}: {
  board: BoardState;
  nowMs: number;
  movers: { up: string[]; down: string[] };
}) {
  const elapsed = nowMs - new Date(board.sweptAt).getTime();
  const remain = Math.max(0, Math.ceil((60_000 - elapsed) / 1000));
  const late = elapsed > 110_000;
  const flash = board.stories.find((s) => s.tier === "FLASH");
  const top5 = board.stories.slice(0, 5);
  const upStories = movers.up
    .map((id) => board.stories.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 3);
  const downStories = movers.down
    .map((id) => board.stories.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <aside className="rail" aria-label="The Pulse Rail — live board dashboard">
      <div className={`rail-card`}>
        <h3>
          Next sweep <span className="mono">v{board.version}</span>
        </h3>
        <div className={`rail-timer${flash ? " is-flash" : ""}`}>
          <span className="rail-timer-num" suppressHydrationWarning>
            {late ? "LATE" : `0:${String(remain).padStart(2, "0")}`}
          </span>
          <span className="rail-timer-sub">
            {late ? "sweep retrying — board holds honest" : "the board re-checks the wire every 60 seconds"}
            <br />
            {board.log[0]?.line ?? ""}
          </span>
        </div>
      </div>

      <div className="rail-card">
        <h3>Flash status</h3>
        {flash ? (
          <Link href={`/wire/${flash.id}`} className="rail-flash-active" style={{ textDecoration: "none" }}>
            ⬤ {flash.headline}
          </Link>
        ) : (
          <span className="rail-flash-none">No flash. Orange stays sacred — when you see it, it's real.</span>
        )}
      </div>

      <div className="rail-card">
        <h3>
          Top of the house <Link href="/gravity" style={{ color: "var(--pulse)", textDecoration: "none" }}>by GRAVITY</Link>
        </h3>
        <div className="rail-top">
          {top5.map((s, i) => (
            <Link key={s.id} href={`/wire/${s.id}`} className="rail-item">
              <span className="ri-rank">{i + 1}</span>
              <span className="ri-hed">{s.headline}</span>
              <span className="ri-g">{s.score}</span>
            </Link>
          ))}
        </div>
      </div>

      {(upStories.length > 0 || downStories.length > 0) && (
        <div className="rail-card">
          <h3>Movers this sweep</h3>
          {upStories.map((s) => (
            <div key={s!.id} className="rail-mover">
              <span className="mv mv--up">▲ {s!.tier}</span>
              <Link href={`/wire/${s!.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {s!.headline}
              </Link>
            </div>
          ))}
          {downStories.map((s) => (
            <div key={s!.id} className="rail-mover">
              <span className="mv mv--down">▼ {s!.tier}</span>
              <Link href={`/wire/${s!.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {s!.headline}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="rail-card">
        <h3>The shortcuts</h3>
        <div className="rail-top">
          <Link className="rail-item" href="/today"><span className="ri-hed">Today&apos;s briefing →</span></Link>
          <Link className="rail-item" href="/rewind"><span className="ri-hed">The Rewind — replay the board →</span></Link>
          <Link className="rail-item" href="/tilt"><span className="ri-hed">The Tilt Meter — our balance, live →</span></Link>
          <Link className="rail-item" href="/column"><span className="ri-hed">From the Second Row →</span></Link>
        </div>
      </div>
    </aside>
  );
}
