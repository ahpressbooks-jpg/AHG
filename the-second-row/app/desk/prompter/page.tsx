"use client";

import { useEffect, useRef, useState } from "react";
import { BoardState } from "@/lib/types";

// THE PROMPTER — anchor mode. Today's note + the board as a full-screen
// teleprompter: auto-scroll, speed, size, mirror (for real prompter glass).
export default function PrompterPage() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [note, setNote] = useState("");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(60); // px per second
  const [size, setSize] = useState(44);
  const [mirror, setMirror] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/board", { cache: "no-store" }).then((r) => r.json()).then(setBoard).catch(() => {});
    fetch("/api/note", { cache: "no-store" }).then((r) => r.json()).then((d) => setNote(d.note ?? "")).catch(() => {});
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const el = scroller.current;
      if (el) {
        el.scrollTop += ((t - last) / 1000) * speed;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) setPlaying(false);
      }
      last = t;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stories = (board?.stories ?? []).filter((s) => s.tier !== "BRIEF").slice(0, 8);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", color: "#fff", zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #222", flexWrap: "wrap", fontFamily: "var(--mono)" }}>
        <a href="/desk" style={{ color: "#888", textDecoration: "none", fontSize: "0.7rem" }}>← THE DESK</a>
        <span style={{ color: "#555", fontSize: "0.7rem" }}>THE PROMPTER · space = play/pause</span>
        <button className="btn btn--small" onClick={() => setPlaying((p) => !p)} style={{ background: playing ? "#333" : "#8A1F35", borderColor: "transparent" }}>
          {playing ? "❚❚ Pause" : "▶ Roll"}
        </button>
        <label style={{ fontSize: "0.66rem", color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
          speed <input type="range" min={20} max={200} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <label style={{ fontSize: "0.66rem", color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
          size <input type="range" min={28} max={80} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <button className="btn-instrument" aria-pressed={mirror} onClick={() => setMirror((m) => !m)} style={{ borderColor: "#333", color: "#888" }}>
          Mirror
        </button>
        <button className="btn-instrument" onClick={() => document.documentElement.requestFullscreen?.()} style={{ borderColor: "#333", color: "#888" }}>
          Fullscreen
        </button>
      </div>
      <div
        ref={scroller}
        style={{ flex: 1, overflowY: "auto", padding: "40vh 8vw", transform: mirror ? "scaleX(-1)" : undefined, fontFamily: "var(--serif)", fontSize: size, lineHeight: 1.5, fontWeight: 600 }}
      >
        <p style={{ color: "#8A8", fontSize: size * 0.5, fontFamily: "var(--mono)", letterSpacing: "0.1em" }}>
          THE SECOND ROW · {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })} · ONE ROW BACK, FULL VIEW
        </p>
        {note && (
          <>
            <p style={{ color: "#C0455A", fontSize: size * 0.45, fontFamily: "var(--mono)" }}>FROM THE DESK —</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{note}</p>
          </>
        )}
        {stories.map((s, i) => (
          <div key={s.id} style={{ margin: "1.4em 0" }}>
            <p style={{ color: "#C0455A", fontSize: size * 0.42, fontFamily: "var(--mono)", margin: 0 }}>
              {i === 0 ? "TOP OF THE BOARD" : `STORY ${i + 1}`} · {s.tier} · GRAVITY {s.score} · {s.owners} NEWSROOMS
            </p>
            <p style={{ margin: "0.2em 0" }}>{s.headline}.</p>
            {s.excerpt && <p style={{ color: "#bbb", fontWeight: 400 }}>{s.excerpt}</p>}
          </div>
        ))}
        <p style={{ color: "#8A8", fontFamily: "var(--mono)", fontSize: size * 0.5 }}>
          — AND THAT&apos;S THE BOTTOM OF THE NEWS. GO LIVE YOUR LIFE. —
        </p>
      </div>
    </div>
  );
}
