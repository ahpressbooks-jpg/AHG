"use client";

import { useState } from "react";
import { SourceRef } from "@/lib/types";

// Clip · Follow · Make a call — the dossier's working toolbar, plus the Lens.

export function ActionBar({ storyId, headline }: { storyId: string; headline: string }) {
  const [note, setNote] = useState<string | null>(null);
  const [clipped, setClipped] = useState(false);
  const [following, setFollowing] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [claim, setClaim] = useState("");
  const [confidence, setConfidence] = useState<"CERTAIN" | "LIKELY" | "GUESSING">("LIKELY");

  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    setNote(null);
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, storyId, headline, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNote(data.error || "Didn't take.");
        return null;
      }
      return data;
    } catch {
      setNote("Network hiccup.");
      return null;
    }
  };

  return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="btn btn--ghost btn--small"
          onClick={async () => {
            const d = await act("clip");
            if (d) {
              setClipped(d.added);
              setNote(d.added ? "Clipped — it's in your drawer at /you, forever." : "Unclipped.");
            }
          }}
        >
          {clipped ? "✂ Clipped" : "✂ Clip"}
        </button>
        <button
          className="btn btn--ghost btn--small"
          onClick={async () => {
            const d = await act("follow");
            if (d) {
              setFollowing(d.added);
              setNote(d.added ? "Following — this thread taps your shoulder only when it develops." : "Unfollowed.");
            }
          }}
        >
          {following ? "● Following" : "○ Follow the story"}
        </button>
        <button className="btn btn--ghost btn--small" onClick={() => setCallOpen((v) => !v)}>
          ⚖ Make a call
        </button>
        <a className="btn btn--ghost btn--small" href={`/api/card/${storyId}`} target="_blank" rel="noopener noreferrer">
          ↗ Share card
        </a>
      </div>

      {callOpen && (
        <form
          className="comment-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const d = await act("call", { claim, confidence });
            if (d) {
              setNote(d.note);
              setClaim("");
              setCallOpen(false);
            }
          }}
        >
          <p style={{ margin: "0 0 8px", fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--slate)" }}>
            YOUR LEDGER — call it, tag your confidence, let reality decide. Your Judgment Score
            keeps the tally.
          </p>
          <input className="input" style={{ width: "100%", borderRadius: 8 }} placeholder='e.g. "This passes the House within two weeks."' value={claim} onChange={(e) => setClaim(e.target.value)} maxLength={280} />
          <div className="comment-form-row">
            <span className="seg" role="group" aria-label="Confidence">
              {(["CERTAIN", "LIKELY", "GUESSING"] as const).map((c) => (
                <button key={c} type="button" aria-pressed={confidence === c} onClick={() => setConfidence(c)}>
                  {c}
                </button>
              ))}
            </span>
            <button className="btn btn--small" type="submit" style={{ marginLeft: "auto" }}>
              On the record
            </button>
          </div>
        </form>
      )}
      {note && <p className="capture-note">{note}</p>}
    </div>
  );
}

// THE DEPTH DIAL — one story, four honest depths. You choose; we respect it.
export function DepthDial({
  ten,
  minute,
  five,
  full,
}: {
  ten: React.ReactNode;
  minute: React.ReactNode;
  five: React.ReactNode;
  full: React.ReactNode;
}) {
  const [level, setLevel] = useState(2);
  const labels = ["10 sec", "1 min", "5 min", "full record"];
  return (
    <div>
      <div className="depth-dial" role="group" aria-label="Depth dial">
        {labels.map((l, i) => (
          <button key={l} aria-pressed={level === i + 1} onClick={() => setLevel(i + 1)}>
            {l}
          </button>
        ))}
      </div>
      <div>{ten}</div>
      {level >= 2 && <div>{minute}</div>}
      {level >= 3 && <div>{five}</div>}
      {level >= 4 && <div>{full}</div>}
    </div>
  );
}

// THE LENS — drag across the same story and watch the framing change.
export function Lens({ sources }: { sources: SourceRef[] }) {
  const groups = {
    L: sources.filter((s) => s.lean === "L"),
    C: sources.filter((s) => s.lean === "C"),
    R: sources.filter((s) => s.lean === "R"),
  };
  const available = (["L", "C", "R"] as const).filter((k) => groups[k].length > 0);
  const [lean, setLean] = useState<"L" | "C" | "R">(available.includes("C") ? "C" : available[0] ?? "C");
  if (available.length < 2) return null;
  const labels = { L: "From the left", C: "From the center", R: "From the right" };

  return (
    <div className="lens" aria-label="The Lens — the same story through three frames">
      <div className="lens-track" role="group" aria-label="Choose a frame">
        {(["L", "C", "R"] as const).map((k) => (
          <button key={k} aria-pressed={lean === k} disabled={!available.includes(k)} onClick={() => setLean(k)} style={!available.includes(k) ? { opacity: 0.3, cursor: "default" } : undefined}>
            {labels[k]}
          </button>
        ))}
      </div>
      <div className="lens-pane">
        {groups[lean].slice(0, 3).map((s) => (
          <div key={s.owner + s.url} style={{ marginBottom: 10 }}>
            <div className="lens-src">{s.name}</div>
            <div className="lens-hed">
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                {s.title || "(headline unavailable)"}
              </a>
            </div>
          </div>
        ))}
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--slate)" }}>
          Same facts. Different furniture. The framing is the story about the story.
        </div>
      </div>
    </div>
  );
}
