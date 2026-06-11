"use client";

import { useEffect, useMemo, useState } from "react";
import { BoardState } from "@/lib/types";

// TUNE IT YOURSELF — the actual sliders, re-ranking the live board in your
// own browser. Radical transparency as a toy; a civics lesson as a feature.
export default function GravityLab() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [w, setW] = useState({ corroboration: 25, velocity: 20, consequence: 25, power: 15, freshness: 15 });

  useEffect(() => {
    fetch("/api/board", { cache: "no-store" })
      .then((r) => r.json())
      .then(setBoard)
      .catch(() => {});
  }, []);

  const ranked = useMemo(() => {
    if (!board) return [];
    const now = Date.now();
    return board.stories
      .map((s) => {
        const corro = Math.min(s.owners + (s.workings.webCorroboration ?? 0) * 0.5, 8) / 8;
        const velocity = Math.min(s.workings.velocity45, 6) / 6;
        const consequence = (s.workings.consequence ?? 4) / 10;
        const power = (s.workings.power ?? 3) / 10;
        const mins = Math.max(0, (now - new Date(s.lastDev).getTime()) / 60000);
        const freshness = Math.pow(0.5, mins / 90);
        const score = Math.round(
          corro * w.corroboration + velocity * w.velocity + consequence * w.consequence + power * w.power + freshness * w.freshness
        );
        return { s, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [board, w]);

  const total = Object.values(w).reduce((a, b) => a + b, 0);

  return (
    <div className="card" style={{ margin: "20px 0" }}>
      <div className="card-kicker">Tune it yourself — your browser only, the real board</div>
      {(Object.keys(w) as (keyof typeof w)[]).map((k) => (
        <label key={k} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
          <span style={{ width: 110, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--slate)" }}>{k}</span>
          <input type="range" min={0} max={50} value={w[k]} onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })} className="rewind-slider" style={{ flex: 1 }} />
          <span style={{ width: 28, textAlign: "right" }}>{w[k]}</span>
        </label>
      ))}
      <p className="mono" style={{ color: total === 100 ? "var(--verdict)" : "var(--slate)", margin: "4px 0 10px" }}>
        weights sum: {total} {total === 100 ? "— same scale as the house" : "(the house uses 100)"}
      </p>
      <div>
        {ranked.map(({ s, score }, i) => (
          <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "baseline", padding: "5px 0", borderBottom: "1px solid var(--line)", fontFamily: "var(--sans)", fontSize: "0.84rem" }}>
            <span className="mono" style={{ width: 18, color: "var(--slate)" }}>{i + 1}</span>
            <span style={{ flex: 1 }}>{s.headline}</span>
            <span className="mono" style={{ color: "var(--pulse)" }}>{score}</span>
          </div>
        ))}
        {!board && <p className="mono">Loading the live board…</p>}
      </div>
      <p className="mono" style={{ color: "var(--slate)", marginTop: 10 }}>
        Move a slider, watch the front page change. Now you know exactly what an algorithm
        deciding &quot;what matters&quot; is — ours, and everyone else&apos;s.
      </p>
    </div>
  );
}
