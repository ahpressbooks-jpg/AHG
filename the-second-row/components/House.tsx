"use client";

import Link from "next/link";
import { useState } from "react";
import { BoardState, Story } from "@/lib/types";
import { ageLabel, clockShort, DEPTH, inkStep } from "./util";

function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <span className="spark" aria-label={`coverage velocity: ${data.join(", ")} pickups per 15 minutes`}>
      {data.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: v === 0 ? 0.25 : 1 }} />
      ))}
    </span>
  );
}

function TierChip({ story, onToggle, open }: { story: Story; onToggle: () => void; open: boolean }) {
  return (
    <button
      className={`chip chip--${story.tier}`}
      onClick={onToggle}
      aria-expanded={open}
      title="Why this ranks here — the workings"
    >
      <span className="chip-bar" aria-hidden="true" />
      {story.tier}
      {story.desk?.pinned ? " · PINNED" : ""}
    </button>
  );
}

function Workings({ s, nowMs }: { s: Story; nowMs: number }) {
  const w = s.workings;
  return (
    <div className="workings" role="region" aria-label="Why this story ranks here">
      <div className="workings-title">Why this ranks {s.tier}</div>
      <span className="workings-row">
        <dt>corroboration&nbsp;&nbsp;</dt>
        <dd>
          {w.corroboration} independent owner{w.corroboration === 1 ? "" : "s"}
          {w.corroborationDelta > 0 ? ` (↑${w.corroborationDelta} this sweep)` : ""}
          {typeof w.webCorroboration === "number" ? ` · +${w.webCorroboration} web domains` : ""}
        </dd>
      </span>
      <span className="workings-row">
        <dt>velocity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
        <dd>{w.velocity45} pickups / 45 min</dd>
      </span>
      <span className="workings-row">
        <dt>freshness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
        <dd>
          first seen {clockShort(w.firstSeen)} · last development {clockShort(w.lastDev)}
        </dd>
      </span>
      <span className="workings-row">
        <dt>source weight&nbsp;</dt>
        <dd>{w.maxSourceWeight} of 3 {w.maxSourceWeight >= 3 ? "(primary-wire grade)" : ""}</dd>
      </span>
      <span className="workings-row">
        <dt>beats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
        <dd>{w.beats.length ? w.beats.join(", ") : "— none matched"}</dd>
      </span>
      {typeof w.gravity === "number" && (
        <span className="workings-row">
          <dt>gravity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
          <dd>{w.gravity}/10 (triage)</dd>
        </span>
      )}
      <span className="workings-row">
        <dt>score&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
        <dd>
          {w.score} → {s.tier}
          {s.certainty ? ` · ${s.certainty.toLowerCase()} = coverage math, not a verdict` : ""}
        </dd>
      </span>
      <span className="workings-row">
        <dt>record&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt>
        <dd>
          <Link href={`/wire/${s.id}`}>this story&apos;s biography →</Link>
        </dd>
      </span>
    </div>
  );
}

function MetaLine({ s, nowMs, onToggle, open }: { s: Story; nowMs: number; onToggle: () => void; open: boolean }) {
  return (
    <div className="row-meta">
      <TierChip story={s} onToggle={onToggle} open={open} />
      {s.tier === "FLASH" && s.flash && !s.flash.confirmed && (
        <span className="machine-seated" title="Raised by the board; awaiting the desk">
          machine-seated
        </span>
      )}
      <span className={`certainty certainty--${s.certainty}`}>{s.certainty}</span>
      <span>{ageLabel(s.lastDev, nowMs)}</span>
      <span>
        {s.owners} source{s.owners === 1 ? "" : "s"}
      </span>
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
      <p className="capture-line">The 7 a.m. board and the daily briefing, free. No team to join.</p>
      {note ? (
        <div className="capture-note">{note}</div>
      ) : (
        <form className="capture-form" onSubmit={submit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
          />
          <button type="submit" disabled={busy}>
            {busy ? "Seating…" : "Take a seat"}
          </button>
        </form>
      )}
    </div>
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
  const rows = board.stories.slice(1);
  const FRONT = 24;
  const front = backOpen ? rows : rows.slice(0, FRONT);
  const backCount = rows.length - front.length;
  const quiet = board.stories.length > 0 && board.stories.length < 10;

  if (!stage) {
    return (
      <div className="house wrap" id="house">
        <p className="house-note">The wire is quiet — no stories seated yet. The next sweep will fill the house.</p>
      </div>
    );
  }

  const stageFlash = stage.tier === "FLASH";

  return (
    <main className="house wrap" id="house">
      {board.sample && (
        <div>
          <span className="sample-watermark">SAMPLE BOARD — fictional headlines for design review</span>
        </div>
      )}
      {quiet && <p className="house-note">A quiet hour. {board.stories.length} stories seated.</p>}

      {/* THE STAGE */}
      <article
        className={`stage${stageFlash ? " is-flash" : ""}`}
        data-sid={stage.id}
        aria-label={stageFlash ? "Flash — the stage" : "The stage — top story"}
      >
        <div className="stage-label">{stageFlash ? "FLASH · THE STAGE" : "THE STAGE"}</div>
        <div className="stage-meta" style={{ marginBottom: 10 }}>
          <MetaLine
            s={stage}
            nowMs={nowMs}
            open={openWorkings === stage.id}
            onToggle={() => onToggleWorkings(openWorkings === stage.id ? null : stage.id)}
          />
        </div>
        <h1 className="stage-hed">
          <a href={stage.url} target="_blank" rel="noopener noreferrer">
            {stage.headline}
          </a>
        </h1>
        {stage.excerpt && <p className="stage-dek">{stage.excerpt}</p>}
        {openWorkings === stage.id && <Workings s={stage} nowMs={nowMs} />}
        <div className="row-foot">
          {stage.sources.slice(0, 5).map((src) => (
            <a key={src.owner + src.url} href={src.url} target="_blank" rel="noopener noreferrer">
              {src.name}
            </a>
          ))}
          <Link href={`/wire/${stage.id}`}>biography</Link>
        </div>
      </article>

      {/* THE ROWS */}
      <div className="rows">
        {front.map((s, i) => {
          const depth = DEPTH[s.tier];
          const open = openWorkings === s.id;
          return (
            <div key={s.id}>
              <article
                className={`row${s.tier === "BULLETIN" ? " row--bulletin" : ""}${entering.has(s.id) ? " is-entering" : ""}`}
                data-sid={s.id}
                data-depth={depth}
                data-ink={inkStep(s.lastDev, nowMs)}
                aria-label={`Row ${i + 1}: ${s.tier}`}
              >
                <div className="row-inner">
                  <MetaLine
                    s={s}
                    nowMs={nowMs}
                    open={open}
                    onToggle={() => onToggleWorkings(open ? null : s.id)}
                  />
                  <h2 className="row-hed">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" data-rowlink>
                      {s.headline}
                    </a>
                  </h2>
                  {s.excerpt && depth <= 2 && <p className="row-dek">{s.excerpt}</p>}
                  {open && <Workings s={s} nowMs={nowMs} />}
                  <div className="row-foot">
                    {s.sources.slice(0, 4).map((src) => (
                      <a key={src.owner + src.url} href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.name}
                      </a>
                    ))}
                    <Link href={`/wire/${s.id}`}>biography</Link>
                  </div>
                </div>
              </article>
              {i === 4 && <CaptureRow />}
            </div>
          );
        })}
        {rows.length <= 4 && <CaptureRow />}
        {backCount > 0 && !backOpen && (
          <button className="backrows" onClick={() => setBackOpen(true)}>
            + {backCount} briefs in the back rows — open them
          </button>
        )}
        {backOpen && backCount === 0 && rows.length > FRONT && (
          <button className="backrows" onClick={() => setBackOpen(false)}>
            − close the back rows
          </button>
        )}
      </div>
    </main>
  );
}
