"use client";

import { useEffect, useRef, useState } from "react";
import { BoardState } from "@/lib/types";

// THE BOARD READ — the day's board as audio, read by the browser itself
// (Web Speech API, zero cost, zero API key). The Prompter script, spoken.
export default function BoardRead() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [note, setNote] = useState("");
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const [idx, setIdx] = useState(-1);
  const linesRef = useRef<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) setSupported(false);
    fetch("/api/board", { cache: "no-store" }).then((r) => r.json()).then(setBoard).catch(() => {});
    fetch("/api/note", { cache: "no-store" }).then((r) => r.json()).then((d) => setNote(d.note ?? "")).catch(() => {});
    return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);

  const stories = (board?.stories ?? []).filter((s) => s.tier !== "BRIEF").slice(0, 8);
  const lines: string[] = [
    `The Second Row. ${new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}. One row back, full view.`,
    ...(note ? [`From the desk. ${note}`] : []),
    ...stories.map((s, i) => `${i === 0 ? "Top of the board" : `Story ${i + 1}`}. ${s.tier}. Gravity ${s.score}. ${s.headline}.${s.excerpt ? " " + s.excerpt : ""}`),
    "And that's the bottom of the news. Go live your life.",
  ];
  linesRef.current = lines;

  const play = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setPlaying(true);
    lines.forEach((line, i) => {
      const u = new SpeechSynthesisUtterance(line);
      u.rate = 1.0;
      u.onstart = () => setIdx(i);
      if (i === lines.length - 1) u.onend = () => { setPlaying(false); setIdx(-1); };
      window.speechSynthesis.speak(u);
    });
  };
  const stop = () => { window.speechSynthesis.cancel(); setPlaying(false); setIdx(-1); };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "14px 0" }}>
        {!playing ? (
          <button className="btn btn--maroon" onClick={play} disabled={!supported}>▶ Play the board</button>
        ) : (
          <button className="btn" onClick={stop}>❚❚ Stop</button>
        )}
        <span className="mono" style={{ color: "var(--slate)", fontSize: "0.7rem" }}>
          {supported ? `${lines.length} segments · read by your browser, no download` : "Your browser can't speak — the script is below to read or record."}
        </span>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {lines.map((l, i) => (
          <li key={i} style={{
            fontFamily: i === 0 || i === lines.length - 1 ? "var(--mono)" : "var(--serif)",
            fontSize: i === 0 || i === lines.length - 1 ? "0.8rem" : "1.05rem",
            color: i === idx ? "var(--pulse)" : "var(--ink-1)",
            padding: "8px 0", borderBottom: "1px solid var(--line)",
            background: i === idx ? "var(--bg-raised)" : undefined,
          }}>
            {l}
          </li>
        ))}
      </ol>
    </div>
  );
}
