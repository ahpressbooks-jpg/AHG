"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Mark from "@/components/Mark";
import { BoardState, Comment, DeskCall, ReaderCall, Tier } from "@/lib/types";

const TIERS: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
type Tab = "board" | "queue" | "publish" | "ledger" | "note";

export default function DeskPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("board");
  const [board, setBoard] = useState<BoardState | null>(null);
  const [queue, setQueue] = useState<Comment[]>([]);
  const [readerCalls, setReaderCalls] = useState<ReaderCall[]>([]);
  const [ledger, setLedger] = useState<DeskCall[]>([]);
  const [busy, setBusy] = useState(false);

  // publish form
  const [post, setPost] = useState({ slug: "", title: "", dek: "", body: "", kind: "column" });
  const [note, setNote] = useState("");
  const [call, setCall] = useState({ claim: "", confidence: "LIKELY", workings: "" });

  const api = useCallback(async (payload: any) => {
    setMsg(null);
    try {
      const res = await fetch("/api/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Failed.");
        if (res.status === 401) setAuthed(false);
        return null;
      }
      if (data.applied) setMsg(data.applied);
      return data;
    } catch {
      setMsg("Network hiccup.");
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const b = await fetch("/api/board", { cache: "no-store" });
      if (b.ok) setBoard(await b.json());
      const d = await fetch("/api/desk", { cache: "no-store" });
      if (d.ok) {
        const data = await d.json();
        setQueue(data.queue ?? []);
        setReaderCalls(data.readerCalls ?? []);
        setLedger(data.ledger ?? []);
        setAuthed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, [refresh]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await api({ action: "login", password: pw });
    setBusy(false);
    if (ok) {
      setAuthed(true);
      setPw("");
      refresh();
    }
  };

  const seg = (t: Tab, label: string, count?: number) => (
    <button aria-pressed={tab === t} onClick={() => setTab(t)}>
      {label}
      {count ? ` (${count})` : ""}
    </button>
  );

  return (
    <div className="wrap page" style={{ maxWidth: 1100 }}>
      <div className="page-kicker" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Mark size={26} /> The Control Room
      </div>
      <h1 style={{ fontSize: "1.7rem" }}>The desk&apos;s thumb on the scale — disclosed.</h1>
      <p>
        Every intervention writes itself into the public record. <Link href="/">← the house</Link>
      </p>

      {!authed ? (
        <form onSubmit={login} className="capture-form" style={{ marginTop: 20 }}>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Desk password" aria-label="Desk password" />
          <button type="submit" disabled={busy}>{busy ? "…" : "Open the desk"}</button>
        </form>
      ) : (
        <div className="seg" role="group" aria-label="Desk sections" style={{ margin: "10px 0" }}>
          {seg("board", "Board")}
          {seg("queue", "Queue", queue.length)}
          {seg("publish", "Publish")}
          {seg("ledger", "Ledger", readerCalls.length)}
          {seg("note", "Note")}
        </div>
      )}
      {msg && <p className="mono" style={{ color: "var(--maroon-row)" }}>{msg}</p>}

      {authed && tab === "board" && board && (
        <table>
          <thead><tr><th>Seat</th><th>Story</th><th>G</th><th>Actions</th></tr></thead>
          <tbody>
            {board.stories.map((s, i) => (
              <tr key={s.id}>
                <td className="mono">{i === 0 ? "STAGE" : `ROW ${i}`}<br />{s.tier}{s.flash && !s.flash.confirmed ? " · machine" : ""}</td>
                <td>
                  {s.headline}
                  <br />
                  <span className="mono" style={{ color: "var(--slate)" }}>
                    {s.owners} owners · {s.certainty} · <Link href={`/wire/${s.id}`}>dossier</Link>
                  </span>
                </td>
                <td className="mono">{s.score}</td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.tier === "FLASH" && !s.flash?.confirmed && <button className="btn btn--small" onClick={() => api({ action: "confirmFlash", storyId: s.id }).then(refresh)}>Confirm flash</button>}
                    {s.tier === "FLASH" && <button className="btn btn--ghost btn--small" onClick={() => api({ action: "standDown", storyId: s.id }).then(refresh)}>Stand down</button>}
                    <button className="btn btn--ghost btn--small" onClick={() => api({ action: "pin", storyId: s.id }).then(refresh)}>{s.desk?.pinned ? "Unpin" : "Pin"}</button>
                    <select aria-label="Force tier" className="btn-instrument" value="" onChange={(e) => e.target.value && api({ action: "force", storyId: s.id, tier: e.target.value }).then(refresh)}>
                      <option value="">Seat at…</option>
                      {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {s.desk?.forcedTier && <button className="btn btn--ghost btn--small" onClick={() => api({ action: "release", storyId: s.id }).then(refresh)}>Release</button>}
                    <select aria-label="Resolve" className="btn-instrument" value="" onChange={(e) => e.target.value && api({ action: "resolveStory", storyId: s.id, state: e.target.value }).then(refresh)}>
                      <option value="">Close as…</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="FADED">FADED</option>
                      <option value="ONGOING">ONGOING</option>
                    </select>
                    <button className="btn btn--ghost btn--small" onClick={() => api({ action: "kill", storyId: s.id }).then(refresh)}>Kill</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {authed && tab === "queue" && (
        <div>
          <p className="mono">First comments wait here — one rule for everyone. Approving a commenter opens their door for good.</p>
          {queue.length === 0 && <p className="mono">Queue clear.</p>}
          {queue.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-meta">
                <span className="comment-name">{c.name}</span>
                <span className="comment-badge">{c.certainty}</span>
                <span>{new Date(c.at).toLocaleString()}</span>
                <span className="mono">{c.target}</span>
              </div>
              <div className="comment-body">{c.text}</div>
              <div className="comment-actions">
                <button onClick={() => api({ action: "approveComment", commentId: c.id }).then(refresh)}>approve (and trust them)</button>
                <button onClick={() => api({ action: "removeComment", commentId: c.id }).then(refresh)}>remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {authed && tab === "publish" && (
        <form
          className="comment-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await api({ action: "savePost", post });
            if (ok) {
              setMsg(`Published: /column/${ok.slug}`);
              setPost({ slug: "", title: "", dek: "", body: "", kind: "column" });
            }
          }}
        >
          <p className="mono">FROM THE SECOND ROW — write in paragraphs; start a paragraph with [FACT] [POLICY] [OPINION] [QUESTION] [THINKING] to chip it; ## for headings.</p>
          <div className="comment-form-row" style={{ marginTop: 0 }}>
            <input className="input" placeholder="slug-like-this" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
            <select className="btn-instrument" value={post.kind} onChange={(e) => setPost({ ...post, kind: e.target.value })}>
              <option value="column">Column</option>
              <option value="steelman">Steelman Saturday</option>
              <option value="note">Desk note</option>
            </select>
          </div>
          <div className="comment-form-row"><input className="input" placeholder="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} style={{ width: "100%" }} /></div>
          <div className="comment-form-row"><input className="input" placeholder="Dek (one-line summary)" value={post.dek} onChange={(e) => setPost({ ...post, dek: e.target.value })} style={{ width: "100%" }} /></div>
          <textarea style={{ minHeight: 280 }} placeholder={"[OPINION] The framework is a postponement both leaderships can survive.\n\n[FACT] The vote was 68–31.\n\n## The part nobody framed"} value={post.body} onChange={(e) => setPost({ ...post, body: e.target.value })} />
          <div className="comment-form-row"><button className="btn" type="submit">Publish</button></div>
        </form>
      )}

      {authed && tab === "ledger" && (
        <div>
          <form
            className="comment-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await api({ action: "addDeskCall", ...call });
              if (ok) {
                setMsg("On the record.");
                setCall({ claim: "", confidence: "LIKELY", workings: "" });
                refresh();
              }
            }}
          >
            <p className="mono">THE DESK&apos;S LEDGER — call it, tag it, freeze it.</p>
            <div className="comment-form-row" style={{ marginTop: 0 }}>
              <input className="input" placeholder="The call…" value={call.claim} onChange={(e) => setCall({ ...call, claim: e.target.value })} style={{ flex: 1 }} />
              <select className="btn-instrument" value={call.confidence} onChange={(e) => setCall({ ...call, confidence: e.target.value })}>
                <option>CERTAIN</option><option>LIKELY</option><option>GUESSING</option>
              </select>
              <button className="btn btn--small" type="submit">Call it</button>
            </div>
            <div className="comment-form-row"><input className="input" placeholder="Workings (Pro-visible reasoning, optional)" value={call.workings} onChange={(e) => setCall({ ...call, workings: e.target.value })} style={{ width: "100%" }} /></div>
          </form>

          {ledger.filter((c) => !c.result).map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-body">{c.claim} <span className="tag">{c.confidence}</span></div>
              <div className="comment-actions">
                <button onClick={() => api({ action: "resolveDeskCall", callId: c.id, result: "HIT" }).then(refresh)}>mark HIT</button>
                <button onClick={() => api({ action: "resolveDeskCall", callId: c.id, result: "MISS" }).then(refresh)}>mark MISS (it goes up first)</button>
              </div>
            </div>
          ))}

          <h2 style={{ fontFamily: "var(--serif)" }}>The room&apos;s open calls</h2>
          {readerCalls.length === 0 && <p className="mono">No open reader calls.</p>}
          {readerCalls.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-meta"><span className="comment-name">{c.name}</span><span className="tag">{c.confidence}</span><span className="mono">{c.storyHeadline.slice(0, 60)}</span></div>
              <div className="comment-body">{c.claim}</div>
              <div className="comment-actions">
                <button onClick={() => api({ action: "markReaderCall", callId: c.id, result: "HIT" }).then(refresh)}>HIT</button>
                <button onClick={() => api({ action: "markReaderCall", callId: c.id, result: "MISS" }).then(refresh)}>MISS</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {authed && tab === "note" && (
        <form
          className="comment-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await api({ action: "saveNote", text: note });
            if (ok) setMsg("Note signed — it tops /today and tomorrow's Morning Edition.");
          }}
        >
          <p className="mono">THE FOUNDER&apos;S NOTE — short, signed, daily. It leads /today and freezes into the 7 a.m. edition.</p>
          <textarea style={{ minHeight: 160 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What the room should know this morning…" />
          <div className="comment-form-row"><button className="btn" type="submit">Sign it</button></div>
        </form>
      )}
    </div>
  );
}
