"use client";

import { useEffect, useState } from "react";

// THE TOUR — "New here?" Asks once, remembers forever, and knows the
// difference between a stranger and a seated reader (anyone who's entered
// an email skips the welcome — they've been here).

const KEY = "tsr_tour";

const STEPS: { kicker: string; title: string; rows: [string, string][]; foot?: string }[] = [
  {
    kicker: "Step 1 · The house",
    title: "The biggest story owns the Stage. Everything else sits in rows.",
    rows: [
      ["var(--ink)", "Rows recede as importance falls — height in the house = weight in the world."],
      ["var(--maroon-row)", "The maroon row with the dots is a BULLETIN — the top of the house."],
      ["var(--slate)", "Ink fades as stories age. Fresh news prints dark; old news cools toward the paper."],
    ],
  },
  {
    kicker: "Step 2 · GRAVITY",
    title: "Every story wears a score — and the score shows its work.",
    rows: [
      ["var(--pulse)", "GRAVITY (0–100): independent newsrooms + speed + people affected + power + freshness."],
      ["var(--ink)", "Tap any tier chip to open the workings — the actual math behind the rank."],
      ["var(--orange)", "Orange means FLASH and nothing else, ever. When you see it, it's real."],
    ],
    foot: "The full formula is public at /gravity — with sliders to re-rank the page yourself.",
  },
  {
    kicker: "Step 3 · The sweep",
    title: "The board re-checks the wire every 60 seconds. It never moves under you.",
    rows: [
      ["var(--pulse)", "The Rail (right side / top on phones) carries the live timer, Top 5, and movers."],
      ["var(--ink)", "While you're reading, changes wait in a pill — you re-seat the house when ready."],
      ["var(--slate)", "Step away and come back: it catches you up instead of dumping changes on you."],
    ],
  },
  {
    kicker: "Step 4 · Dossiers",
    title: "Tap any headline for the story's full record.",
    rows: [
      ["var(--ink)", "The Depth Dial: read it in 10 seconds, 1 minute, 5 minutes, or the full record."],
      ["var(--pulse)", "The Lens: the same story as the left, center, and right are framing it right now."],
      ["var(--verdict)", "Clip it, follow it (it taps your shoulder only when it develops), or make a call on it."],
    ],
  },
  {
    kicker: "Step 5 · The Room",
    title: "Comments here work like nowhere else.",
    rows: [
      ["var(--verdict)", "Ranked by minds changed, not likes — there is no like button."],
      ["var(--ink)", "Every comment wears its confidence: CERTAIN, LIKELY, or GUESSING."],
      ["var(--maroon-row)", "Rebuttals restate the other side first. Takes can be sealed until the story resolves."],
    ],
  },
  {
    kicker: "Step 6 · Your seat",
    title: "One email — no passwords — and nothing you touch is ever lost.",
    rows: [
      ["var(--maroon-row)", "Your comments, clippings, calls, and Judgment Score, findable day after day at /you."],
      ["var(--pulse)", "A public profile if you want one; a private mirror of your own reading tilt either way."],
      ["var(--ink)", "And when you've read what matters, the page tells you: you're caught up. Go live your life."],
    ],
    foot: "Desk keys: J/K walk the rows · T ticker · H hold · . newest · ? reopens this tour",
  },
];

export default function Tour() {
  const [mode, setMode] = useState<"hidden" | "ask" | number>("hidden");

  useEffect(() => {
    try {
      // Old single-card legend counts as seen; migrate quietly.
      if (localStorage.getItem("tsr_legend")) localStorage.setItem(KEY, "done");
      if (localStorage.getItem(KEY)) return;
      // Anyone with a seat (entered an email) has been here — no welcome mat.
      fetch("/api/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d?.user) {
            localStorage.setItem(KEY, "seated");
          } else {
            setMode("ask");
          }
        })
        .catch(() => setMode("ask"));
    } catch {}
  }, []);

  // "?" reopens the tour anytime.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "?") setMode(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = (why: "done" | "skipped" | "veteran") => {
    try {
      localStorage.setItem(KEY, why);
    } catch {}
    setMode("hidden");
  };

  if (mode === "hidden") return null;

  if (mode === "ask") {
    return (
      <div className="overlay" role="dialog" aria-modal="true" aria-label="New here?">
        <div className="overlay-card">
          <div className="overlay-kicker">The Second Row</div>
          <h2 className="overlay-title">New here?</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: "0.92rem", color: "var(--ink-1)", margin: "0 0 6px" }}>
            This isn&apos;t a feed — it&apos;s a live board that ranks the news by how much it
            actually matters, and shows its work. Sixty seconds of tour and it all makes sense.
          </p>
          <div className="overlay-actions">
            <button className="btn btn--maroon" onClick={() => setMode(0)}>
              Yes — show me around
            </button>
            <button className="btn btn--ghost" onClick={() => close("veteran")}>
              Done this before
            </button>
            <button className="btn btn--ghost" onClick={() => close("skipped")}>
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  const i = mode as number;
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`Tour, ${step.kicker}`}>
      <div className="overlay-card">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <div className="overlay-kicker">{step.kicker} of 6</div>
          <button
            onClick={() => close("skipped")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.64rem", letterSpacing: "0.1em", color: "var(--slate)" }}
          >
            SKIP TOUR ✕
          </button>
        </div>
        <h2 className="overlay-title">{step.title}</h2>
        <div className="legend-rows">
          {step.rows.map(([color, text], k) => (
            <div className="legend-row" key={k}>
              <span className="legend-bar" style={{ width: 34 - k * 6, background: color }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        {step.foot && (
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--slate)", margin: "10px 0 0" }}>{step.foot}</p>
        )}
        <div className="overlay-actions" style={{ alignItems: "center" }}>
          {i > 0 && (
            <button className="btn btn--ghost" onClick={() => setMode(i - 1)}>
              ← Back
            </button>
          )}
          <span style={{ display: "inline-flex", gap: 6, margin: "0 4px" }} aria-hidden="true">
            {STEPS.map((_, k) => (
              <span key={k} style={{ width: 7, height: 7, borderRadius: "50%", background: k === i ? "var(--maroon-row)" : "var(--line-strong)" }} />
            ))}
          </span>
          {!last ? (
            <button className="btn" onClick={() => setMode(i + 1)} style={{ marginLeft: "auto" }}>
              Next →
            </button>
          ) : (
            <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
              <a className="btn btn--maroon" href="/you" onClick={() => close("done")}>
                Take your seat
              </a>
              <button className="btn btn--ghost" onClick={() => close("done")}>
                Start reading
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
