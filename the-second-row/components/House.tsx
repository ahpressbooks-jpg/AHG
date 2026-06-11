"use client";

import Link from "next/link";
import { useState } from "react";
import { BoardState, Story } from "@/lib/types";
import { ageLabel, clockShort, DEPTH, inkStep } from "./util";

export function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <span className="spark" aria-label={`coverage velocity: ${data.join(", ")} pickups per 15 minutes`}>
      {data.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: v === 0 ? 0.25 : 1 }} />
      ))}
    </span>
  );
}

export function Gravity({ score }: { score: number }) {
  return (
    <span className="gravity-meter" title={`GRAVITY ${score}/100 — tap any tier chip for the workings`}>
      <span className="g-track" aria-hidden="true">
        <span className="g-fill" style={{ width: `${score}%` }} />
      </span>
      <span className="g-num">{score}</span>
    </span>
  );
}

export function Spectrum({ spread }: { spread: { L: number; C: number; R: number } }) {
  const total = spread.L + spread.C + spread.R;
  if (total === 0) return null;
  // Position of the coverage's center of mass on the L–R track.
  const pos = ((spread.C * 0.5 + spread.R) / total) * 100;
  return (
    <span
      className="spectrum"
      title={`framing spectrum — L ${spread.L} · C ${spread.C} · R ${spread.R}`}
      aria-label={`coverage: ${spread.L} left, ${spread.C} center, ${spread.R} right outlets`}
    >
      <span className="sp-track">
        <span className="sp-dot" style={{ left: `${pos}%` }} />
      </span>
    </span>
  );
}

function TierChip({ story, onToggle, open }: { story: Story; onToggle: () => void; open: boolean }) {
  return (
    <button className={`chip chip--${story.tier}`} onClick={onToggle} aria-expanded={open} title="Why this ranks here — the workings">
      <span className="chip-bar" aria-hidden="true" />
      {story.tier}
      {story.desk?.pinned ? " · PINNED" : ""}
    </button>
  );
}

export function Workings({ s }: { s: Story }) {
  const w = s.workings;
  return (
    <div className="workings" role="region" aria-label="Why this story ranks here">
      <div className="workings-title">GRAVITY {w.score} → {s.tier}</div>
      <span className="workings-row"><dt>corroboration&nbsp;</dt><dd>{w.corroboration} independent owner{w.corroboration === 1 ? "" : "s"}{w.corroborationDelta > 0 ? ` (↑${w.corroborationDelta} this sweep)` : ""}{typeof w.webCorroboration === "number" ? ` · +${w.webCorroboration} web domains` : ""}</dd></span>
      <span className="workings-row"><dt>velocity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.velocity45} pickups / 45 min</dd></span>
      <span className="workings-row"><dt>consequence&nbsp;&nbsp;</dt><dd>{w.consequence ?? "—"}/10 — people touched, how directly, how long</dd></span>
      <span className="workings-row"><dt>power&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.power ?? "—"}/10 — is power being exercised or checked</dd></span>
      <span className="workings-row"><dt>freshness&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>first seen {clockShort(w.firstSeen)} · last development {clockShort(w.lastDev)}</dd></span>
      <span className="workings-row"><dt>beats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.beats.length ? w.beats.join(", ") : "— none matched"}</dd></span>
      <span className="workings-row"><dt>certainty&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{s.certainty} — coverage math, not a verdict</dd></span>
      <span className="workings-row"><dt>record&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd><Link href={`/wire/${s.id}`}>full dossier →</Link> · <Link href="/gravity">the math →</Link></dd></span>
    </div>
  );
}

export function MetaLine({ s, nowMs, onToggle, open }: { s: Story; nowMs: number; onToggle: () => void; open: boolean }) {
  return (
    <div className="row-meta">
      <TierChip story={s} onToggle={onToggle} open={open} />
      {s.tier === "FLASH" && s.flash && !s.flash.confirmed && (
        <span className="machine-seated" title="Raised by the board; awaiting the desk">machine-seated</span>
      )}
      <Gravity score={s.score} />
      <span className={`certainty certainty--${s.certainty}`}>{s.certainty}</span>
      <span suppressHydrationWarning>{ageLabel(s.lastDev, nowMs)}</span>
      <span>{s.owners} source{s.owners === 1 ? "" : "s"}</span>
      <Spectrum spread={s.spread ?? { L: 0, C: 0, R: 0 }} />
      <Spark data={s.spark} />
    </div>
  );
}

function CaptureRow() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setNote(data.note || data.error || "Done.");
      if (res.ok) setEmail("");
    } catch {
      setNote("The wire hiccuped — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="capture" role="form" aria-label="Take your seat — free briefing list">
      <div className="capture-label">Take your seat</div>
      <p className="capture-line">The 7 a.m. Morning Edition and the daily briefing, free. No team to join.</p>
      {note ? (
        <div className="capture-note">{note}</div>
      ) : (
        <form className="capture-form" onSubmit={submit}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" />
          <button type="submit" disabled={busy}>{busy ? "Seating…" : "Take a seat"}</button>
        </form>
      )}
    </div>
  );
}

function StoryRow({
  s,
  i,
  nowMs,
  open,
  onToggle,
  entering,
}: {
  s: Story;
  i: number;
  nowMs: number;
  open: boolean;
  onToggle: () => void;
  entering: boolean;
}) {
  const depth = DEPTH[s.tier];
  return (
    <article
      className={`row${s.tier === "BULLETIN" ? " row--bulletin" : ""}${entering ? " is-entering" : ""}`}
      data-sid={s.id}
      data-depth={depth}
      data-ink={inkStep(s.lastDev, nowMs)}
      aria-label={`Row ${i + 1}: ${s.tier}`}
    >
      <div className="row-inner">
        <MetaLine s={s} nowMs={nowMs} open={open} onToggle={onToggle} />
        <h2 className="row-hed">
          <Link href={`/wire/${s.id}`} data-rowlink>
            {s.headline}
          </Link>
        </h2>
        {s.excerpt && depth <= 2 && <p className="row-dek">{s.excerpt}</p>}
        {open && <Workings s={s} />}
        <div className="row-foot">
          {s.sources.slice(0, 4).map((src) => (
            <a key={src.owner + src.url} href={src.url} target="_blank" rel="noopener noreferrer">
              {src.name} ↗
            </a>
          ))}
          <Link href={`/wire/${s.id}`}>dossier · comments</Link>
        </div>
      </div>
    </article>
  );
}

export default function House({
  board,
  nowMs,
  openWorkings,
  onToggleWorkings,
  entering,
}: {
  board: BoardState;
  nowMs: number;
  openWorkings: string | null;
  onToggleWorkings: (id: string | null) => void;
  entering: Set<string>;
}) {
  const [backOpen, setBackOpen] = useState(false);
  const stage = board.stories[0];
  const rest = board.stories.slice(1);
  const boardRows = rest.filter((s) => s.tier !== "BRIEF");
  const lobby = rest.filter((s) => s.tier === "BRIEF");
  const lobbyShown = backOpen ? lobby : lobby.slice(0, 8);
  const quiet = board.stories.length > 0 && board.stories.length < 10;

  if (!stage) {
    return (
      <main className="house" id="house">
        <p className="house-note">The wire is quiet — no stories seated yet. The next sweep will fill the house.</p>
      </main>
    );
  }

  const stageFlash = stage.tier === "FLASH";

  return (
    <main className="house" id="house">
      {board.sample && (
        <div>
          <span className="sample-watermark">SAMPLE BOARD — fictional headlines for design review</span>
        </div>
      )}
      {quiet && <p className="house-note">A quiet hour. {board.stories.length} stories seated.</p>}

      {/* THE STAGE */}
      <article className={`stage${stageFlash ? " is-flash" : ""}`} data-sid={stage.id} aria-label={stageFlash ? "Flash — the stage" : "The stage — top story"}>
        <div className="stage-label">{stageFlash ? "FLASH · THE STAGE" : "THE STAGE"}</div>
        <div className="stage-meta" style={{ marginBottom: 10 }}>
          <MetaLine s={stage} nowMs={nowMs} open={openWorkings === stage.id} onToggle={() => onToggleWorkings(openWorkings === stage.id ? null : stage.id)} />
        </div>
        <h1 className="stage-hed">
          <Link href={`/wire/${stage.id}`}>{stage.headline}</Link>
        </h1>
        {stage.excerpt && <p className="stage-dek">{stage.excerpt}</p>}
        {openWorkings === stage.id && <Workings s={stage} />}
        <div className="row-foot">
          {stage.sources.slice(0, 5).map((src) => (
            <a key={src.owner + src.url} href={src.url} target="_blank" rel="noopener noreferrer">
              {src.name} ↗
            </a>
          ))}
          <Link href={`/wire/${stage.id}`}>dossier · comments</Link>
        </div>
      </article>

      {/* THE ROWS (the Board: gravity ≥ developing) */}
      <div className="rows">
        {boardRows.map((s, i) => (
          <div key={s.id}>
            <StoryRow s={s} i={i} nowMs={nowMs} open={openWorkings === s.id} onToggle={() => onToggleWorkings(openWorkings === s.id ? null : s.id)} entering={entering.has(s.id)} />
            {i === 4 && <CaptureRow />}
          </div>
        ))}
        {boardRows.length <= 4 && <CaptureRow />}
      </div>

      {/* YOU'RE CAUGHT UP — the bottom of the news */}
      <div className="caughtup" role="note">
        <div className="caughtup-mark">■ The bottom of the news</div>
        <h2>You&apos;re caught up.</h2>
        <p>
          That was everything carrying real gravity right now. The board will hold your seat —
          go live your life. Below is the Lobby: lighter wire traffic, honestly labeled.
        </p>
      </div>

      {/* THE LOBBY — casual news, never pretending to be the front page */}
      {lobby.length > 0 && (
        <section className="lobby" aria-label="The Lobby — lighter wire traffic">
          <div className="lobby-head">The Lobby</div>
          <p className="lobby-sub">Low-gravity wire traffic. It's news; it just isn't the front page.</p>
          <div className="rows">
            {lobbyShown.map((s, i) => (
              <StoryRow key={s.id} s={s} i={i} nowMs={nowMs} open={openWorkings === s.id} onToggle={() => onToggleWorkings(openWorkings === s.id ? null : s.id)} entering={entering.has(s.id)} />
            ))}
            {lobby.length > 8 && (
              <button className="backrows" onClick={() => setBackOpen((v) => !v)}>
                {backOpen ? "− close the back rows" : `+ ${lobby.length - 8} more in the back rows`}
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
