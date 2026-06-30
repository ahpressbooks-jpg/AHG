"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  civicTempo, crystallize, fadeLabel, halfLife, Mood, silence,
} from "@/lib/instrument";
import { BoardState, Certainty, Story } from "@/lib/types";

// Per-mood accent + headline for the Breathing Board. The whole surface takes
// its pulse from the day's civic load — heavy days race, quiet days rest.
const MOOD: Record<Mood, { c: string; head: string }> = {
  STORM: { c: "var(--ic-red)", head: "Heavy weather on the board." },
  ELEVATED: { c: "var(--ic-ember)", head: "A front is moving in." },
  STEADY: { c: "var(--ic-teal)", head: "A normal civic day." },
  CALM: { c: "var(--ic-cool)", head: "A quiet board." },
};

function certaintyClass(c: Certainty): string {
  if (c === "CONFIRMED") return "irow-tag--confirmed";
  if (c === "REPORTED") return "irow-tag--reported";
  return "irow-tag--developing";
}

// THE BREATHING BOARD — the live island. One server-rendered board, then a
// 60s self-poll. Renders the day's tempo, the ranked rows (each carrying a
// Half-Life clock and a Crystallization bar), and the Silence band beneath.
export default function Board({ initial }: { initial: BoardState }) {
  const [board, setBoard] = useState<BoardState>(initial);
  const [moves, setMoves] = useState<Record<string, "up" | "down">>({});
  const prevRank = useRef<Map<string, number>>(
    new Map(initial.stories.map((s, i) => [s.id, i]))
  );
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNowMs(Date.now()), 1000);
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/board", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as BoardState;
        const m: Record<string, "up" | "down"> = {};
        next.stories.forEach((s, i) => {
          const was = prevRank.current.get(s.id);
          if (was != null && was !== i) m[s.id] = i < was ? "up" : "down";
        });
        prevRank.current = new Map(next.stories.map((s, i) => [s.id, i]));
        setBoard(next);
        if (Object.keys(m).length) setMoves(m);
      } catch {}
    }, 60_000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, []);

  const tempo = civicTempo(board);
  const mood = MOOD[tempo.mood];
  const beatMs = Math.round(60_000 / Math.max(1, tempo.bpm));
  const rows = board.stories.slice(0, 12);
  const quiet = silence(board);
  const ageMin = Math.max(0, Math.round((nowMs - new Date(board.sweptAt).getTime()) / 60_000));

  return (
    <>
      {/* THE BREATHING BOARD — the day's tempo, before you read a word. */}
      <section
        className="tempo"
        style={{ ["--tempo-ms" as any]: `${beatMs}ms`, ["--tempo-c" as any]: mood.c }}
      >
        <div className="wrap">
          <div className="tempo-load">
            <span className="tempo-pulse" aria-hidden="true" />
            <span className="tempo-mood">{tempo.mood} · civic load {tempo.load}</span>
            <span className="tempo-bpm" suppressHydrationWarning>
              {tempo.bpm} bpm · swept {ageMin === 0 ? "just now" : `${ageMin}m ago`}
            </span>
          </div>
          <h1>{mood.head}</h1>
          <p>{tempo.tagline}</p>
          <div className="tempo-load-meter" aria-hidden="true">
            <i style={{ width: `${tempo.load}%` }} />
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* THE WIRE — ranked by weight, not clicks. */}
        <section className="inst-sec" aria-label="The Wire">
          <div className="inst-sec-h">
            <h2>The Wire</h2>
            <span className="k">re-ranked every 60s</span>
            <Link href="/wire">Open the full board →</Link>
          </div>
          {rows.length === 0 && (
            <p style={{ color: "var(--ic-dim)", padding: "20px 0" }}>
              The board is warming up. The first sweep lands within a minute.
            </p>
          )}
          {rows.map((s: Story, i) => {
            const hl = halfLife(s);
            const cr = crystallize(s);
            const fade = fadeLabel(hl.hours, nowMs);
            return (
              <Link key={s.id} href={`/wire/${s.id}`} className="irow">
                <span className="irow-rank">{i + 1}</span>
                <span className="irow-main">
                  <span className="irow-hed">{s.headline}</span>
                  <span className="irow-meta">
                    <span className={`irow-tag ${certaintyClass(s.certainty)}`}>{s.certainty}</span>
                    <span className="cryst" title={`${cr.settled}% settled · ${cr.contested}% contested`} aria-hidden="true">
                      <i className="se" style={{ width: `${cr.settled}%` }} />
                      <i className="co" style={{ width: `${cr.contested}%` }} />
                    </span>
                    <span>{cr.settled}% settled</span>
                    <span>{s.owners} {s.owners === 1 ? "source" : "sources"}</span>
                  </span>
                </span>
                <span className="irow-side">
                  <span className="irow-grav" title="GRAVITY score">{s.score}</span>
                  <span className="irow-half" title={`Half-Life — ${fade}`}>
                    <span className="hl-bar" aria-hidden="true"><i style={{ width: `${hl.vitality}%` }} /></span>
                    {fade}
                  </span>
                  {moves[s.id] === "up" && <span className="irow-move irow-move--up" aria-label="rising">▲ rising</span>}
                  {moves[s.id] === "down" && <span className="irow-move irow-move--down" aria-label="cooling">▼ cooling</span>}
                </span>
              </Link>
            );
          })}
        </section>

        {/* THE SILENCE BOARD — weight the front pages are under-covering. */}
        <section className="inst-sec" aria-label="The Silence Board">
          <div className="inst-sec-h">
            <h2>The Silence Board</h2>
            <span className="k">weight outrunning coverage</span>
            <Link href="/instrument/silence">Why this exists →</Link>
          </div>
          <div className="silence">
            {quiet.length === 0 ? (
              <p style={{ color: "var(--ic-dim)", margin: 0, fontSize: "0.9rem" }}>
                Nothing is conspicuously under-covered right now. The board is reading the day fairly.
              </p>
            ) : (
              quiet.map(({ story, gap }) => (
                <Link key={story.id} href={`/wire/${story.id}`} className="sil-row">
                  <span className="sil-gap">−{gap} gap</span>
                  <span className="sil-hed">{story.headline}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
