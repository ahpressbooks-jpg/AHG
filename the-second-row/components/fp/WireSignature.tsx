"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BoardState, Story, Tier } from "@/lib/types";

const RANK: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];

function clockShort(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

// THE WIRE — the signature live module on the front page. Polls the board,
// shows ranks + movement + score, and reads as a proprietary instrument, not
// a list. Links into the full immersive Wire at /wire.
export default function WireSignature({ initial }: { initial: BoardState }) {
  const [board, setBoard] = useState<BoardState>(initial);
  const [moves, setMoves] = useState<Record<string, "up" | "down">>({});
  const prevTiers = useRef<Map<string, Tier>>(new Map(initial.stories.map((s) => [s.id, s.tier])));
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNowMs(Date.now()), 1000);
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as BoardState;
        const m: Record<string, "up" | "down"> = {};
        for (const s of next.stories) {
          const was = prevTiers.current.get(s.id);
          if (was && was !== s.tier) m[s.id] = RANK.indexOf(s.tier) < RANK.indexOf(was) ? "up" : "down";
        }
        prevTiers.current = new Map(next.stories.map((s) => [s.id, s.tier]));
        setBoard(next);
        if (Object.keys(m).length) setMoves(m);
      } catch {}
    }, 60_000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, []);

  const rows = board.stories.slice(0, 8);
  const ageMin = Math.max(0, Math.round((nowMs - new Date(board.sweptAt).getTime()) / 60_000));

  return (
    <aside className="wiremod" aria-label="The Wire — live ranked board">
      <div className="wiremod-head">
        <span className="wiremod-title">The Wire</span>
        <span className="wiremod-live">
          <span className="dot" aria-hidden="true" /> re-ranked 60s
        </span>
      </div>
      {rows.map((s: Story, i) => (
        <Link key={s.id} href={`/wire/${s.id}`} className="wiremod-row">
          <span className="wiremod-rank">{i + 1}</span>
          <span className="wiremod-hed">{s.headline}</span>
          <span className="wiremod-sig">
            {moves[s.id] === "up" && <span className="wiremod-move--up">▲</span>}
            {moves[s.id] === "down" && <span className="wiremod-move--down">▼</span>}
            <span className="wiremod-score">{s.score}</span>
          </span>
        </Link>
      ))}
      <div className="wiremod-foot">
        <span suppressHydrationWarning>
          swept {clockShort(board.sweptAt)} · {ageMin === 0 ? "just now" : `${ageMin}m ago`}
        </span>
        <Link href="/wire">Open the full board →</Link>
      </div>
    </aside>
  );
}
