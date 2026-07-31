"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Mark from "@/components/Mark";
import { BoardState, Comment, DeskCall, ReaderCall, Tier } from "@/lib/types";

const TIERS: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
type Tab = "overview" | "board" | "queue" | "publish" | "ledger" | "note" | "studio";

export default function DeskPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [board, setBoard] = useState<BoardState | null>(null);
  const [queue, setQueue] = useState<Comment[]>([]);
  const [readerCalls, setReaderCalls] = useState<ReaderCall[]>([]);
  const [ledger, setLedger] = useState<DeskCall[]>([]);
  const [lights, setLights] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [sweepLog, setSweepLog] = useState<any[]>([]);
  const [recentSeats, setRecentSeats] = useState<any[]>([]);
  const [editions, setEditions] = useState<string[]>([]);
  const [boardCount, setBoardCount] = useState(0);
  const [topic, setTopic] = useState("");
  const [anotes, setAnotes] = useState("");
  const [abusy, setAbusy] = useState(false);
  const noteLoaded = useRef(false);
  const [busy, setBusy] = useState(false);
  const [unconfigured, setUnconfigured] = useState(false);

  // publish form
  const [post, setPost] = useState({ slug: "", title: "", dek: "", body: "", kind: "column" });
  const [note, setNote] = useState("");
  const [call, setCall] = useState({ claim: "", confidence: "LIKELY", workings: "" });
  const [amap, setAmap] = useState({ storyId: "", claim: "", forPts: "", againstPts: "", verdict: "" });
  const [asn, setAsn] = useState({ question: "", detail: "", goal: 25 });
  const [doc, setDoc] = useState({ slug: "", title: "", kind: "bill", summary: "", sourceUrl: "", raw: "" });

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
        if (res.status === 501) setUnconfigured(true);
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
        setLights(Boolean(data.lights));
        setStats(data.stats ?? null);
        setSweepLog(data.sweepLog ?? []);
        setRecentSeats(data.recentSeats ?? []);
        setEditions(data.editions ?? []);
        setBoardCount(data.boardCount ?? 0);
        if (!noteLoaded.current && data.note) {
          setNote(data.note);
          noteLoaded.current = true;
        }
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

      {unconfigured && (
        <div className="rope" style={{ marginTop: 16 }}>
          <div className="rope-kicker">One-time setup · 2 minutes</div>
          <p>
            The Control Room needs its key. In <strong>Vercel</strong>: your project →{" "}
            <strong>Settings → Environment Variables</strong> → add{" "}
            <span className="mono">DESK_PASSWORD</span> with a strong password (and{" "}
            <span className="mono">AUTH_SECRET</span> with any long random string while you&apos;re
            there) → <strong>Save</strong> → go to <strong>Deployments</strong> → ⋯ on the latest →{" "}
            <strong>Redeploy</strong>. Come back here, enter the password, and the desk is yours —
            publish, moderate, run the board. Nobody without the password ever sees this room work.
          </p>
        </div>
      )}
      {!authed ? (
        <form onSubmit={login} className="capture-form" style={{ marginTop: 20 }}>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Desk password" aria-label="Desk password" />
          <button type="submit" disabled={busy}>{busy ? "…" : "Open the desk"}</button>
        </form>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "10px 0" }}>
          <div className="seg" role="group" aria-label="Desk sections">
            {seg("overview", "Overview")}
            {seg("board", "Board")}
            {seg("queue", "Queue", queue.length)}
            {seg("publish", "Publish")}
            {seg("ledger", "Ledger", readerCalls.length)}
            {seg("note", "Note")}
            {seg("studio", "Studio")}
          </div>
          <a className="btn-instrument" href="/desk/prompter" title="The Prompter — anchor mode for recording">
            🎙 Prompter
          </a>
          <button
            className="btn-instrument"
            aria-pressed={lights}
            title="The House Lights protocol: during a major civic emergency, every archive rope opens free — logged in public."
            onClick={() => api({ action: "houseLights" }).then(refresh)}
          >
            {lights ? "🔆 House lights UP" : "House lights"}
          </button>
        </div>
      )}
      {msg && <p className="mono" style={{ color: "var(--maroon-row)" }}>{msg}</p>}

      {authed && tab === "overview" && (
        <div>
          <div className="cards cards--3">
            <div className="card"><span className="stat"><span className="stat-num">{stats?.users ?? 0}</span><span className="stat-label">accounts (seats taken)</span></span></div>
            <div className="card"><span className="stat"><span className="stat-num">{stats?.seats ?? 0}</span><span className="stat-label">free email list</span></span></div>
            <div className="card"><span className="stat"><span className="stat-num">{stats?.founding ?? 0}<small style={{fontSize:"0.9rem",color:"var(--slate)"}}>/500</small></span><span className="stat-label">founding members</span></span></div>
            <div className="card"><span className="stat"><span className="stat-num">${(stats?.proActive ?? 0) * 8 + Math.round(((stats?.founding ?? 0) * 200) / 12)}/mo</span><span className="stat-label">≈ recurring revenue</span></span></div>
            <div className="card"><span className="stat"><span className="stat-num">{boardCount}</span><span className="stat-label">stories seated now</span></span></div>
            <div className="card"><span className="stat"><span className="stat-num">{queue.length + readerCalls.length}</span><span className="stat-label">needs you: {queue.length} comments · {readerCalls.length} calls</span></span></div>
          </div>

          <h2 style={{ fontFamily: "var(--serif)" }}>Sweep health</h2>
          <table>
            <thead><tr><th>When</th><th>What happened</th><th>ms</th><th>Errors</th></tr></thead>
            <tbody>
              {sweepLog.map((l: any, i: number) => (
                <tr key={i}>
                  <td className="mono">{new Date(l.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="mono">{l.line}</td>
                  <td className="mono">{l.ms}</td>
                  <td className="mono" style={{ color: l.errors ? "var(--maroon-row)" : "var(--slate)" }}>{l.errors ? l.errors.join(" · ").slice(0, 60) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cards">
            <div className="card">
              <div className="card-kicker">Latest seats on the free list</div>
              {recentSeats.length === 0 ? <p className="mono">None yet.</p> : recentSeats.map((s: any, i: number) => (
                <p key={i} className="mono" style={{ margin: 0 }}>{s.email} <span style={{ color: "var(--slate)" }}>· {new Date(s.at).toLocaleDateString([], { month: "short", day: "numeric" })}</span></p>
              ))}
            </div>
            <div className="card">
              <div className="card-kicker">Morning Editions</div>
              {editions.length === 0 ? <p className="mono">First edition freezes at 7 a.m.</p> : editions.map((d) => (
                <p key={d} className="mono" style={{ margin: 0 }}><a href={`/edition/${d}`}>№ {d} →</a></p>
              ))}
              <div className="card-foot">Quick moves: <a href="/desk/prompter">open the Prompter</a> · <a href="/tilt">check the Tilt</a> · <a href="/glass">the Glass Desk</a></div>
            </div>
          </div>
        </div>
      )}

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
          <p className="mono">
            FROM THE SECOND ROW — write in paragraphs; start a paragraph with [FACT] [POLICY]
            [OPINION] [QUESTION] [THINKING] to chip it; ## for headings. Prefer pasting drafts to
            Claude in chat? They land in <span style={{ color: "var(--pulse)" }}>lib/seedContent.ts</span>{" "}
            and publish themselves on deploy — same format.
          </p>
          <div style={{ border: "1px dashed var(--line-strong)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
            <p className="mono" style={{ margin: "0 0 8px", fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pulse)" }}>
              ✍ The writing desk — give it a topic and your bullets; it drafts in the house voice, tags included. You edit, you sign.
            </p>
            <div className="comment-form-row" style={{ marginTop: 0 }}>
              <input className="input" placeholder="Topic — e.g. 'the appropriations framework, what actually changed'" value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%" }} />
            </div>
            <textarea style={{ minHeight: 90 }} placeholder={"Your raw notes / bullets (optional):\n- vote was 68-31\n- riders deferred, not dead\n- my read: postponement both sides can survive"} value={anotes} onChange={(e) => setAnotes(e.target.value)} />
            <div className="comment-form-row">
              <button type="button" className="btn btn--small" disabled={abusy} onClick={async () => {
                setAbusy(true);
                const d = await api({ action: "assist", topic, notes: anotes, kind: post.kind });
                setAbusy(false);
                if (d) {
                  setPost({ ...post, title: d.title, dek: d.dek, body: d.body, slug: post.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) });
                  setMsg("Draft on the desk — edit hard, verify every [FACT], then publish.");
                }
              }}>{abusy ? "Drafting…" : "Draft it with me"}</button>
            </div>
          </div>
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

      {authed && tab === "studio" && (
        <div>
          <button className="btn btn--ghost btn--small" onClick={() => api({ action: "togglePredictions" }).then(refresh)} style={{ marginBottom: 16 }}>
            Toggle Predictions Night (the annual seal window)
          </button>

          <h2 style={{ fontFamily: "var(--serif)" }}>Argument map</h2>
          <form className="comment-form" onSubmit={async (e) => { e.preventDefault(); const ok = await api({ action: "saveArgMap", ...amap }); if (ok) setMsg("Argument map saved — it shows on that story's dossier at the 5-minute depth."); }}>
            <p className="mono">Attach a steelman claim tree to a story. Story ID is the code in its dossier URL (/wire/XXXX). One point per line.</p>
            <div className="comment-form-row" style={{ marginTop: 0 }}>
              <input className="input" placeholder="Story ID" value={amap.storyId} onChange={(e) => setAmap({ ...amap, storyId: e.target.value })} style={{ maxWidth: 160 }} />
              <input className="input" placeholder="The claim" value={amap.claim} onChange={(e) => setAmap({ ...amap, claim: e.target.value })} style={{ flex: 1 }} />
            </div>
            <div className="comment-form-row">
              <textarea style={{ minHeight: 80, flex: 1 }} placeholder="Strongest FOR (one per line)" value={amap.forPts} onChange={(e) => setAmap({ ...amap, forPts: e.target.value })} />
              <textarea style={{ minHeight: 80, flex: 1 }} placeholder="Strongest AGAINST (one per line)" value={amap.againstPts} onChange={(e) => setAmap({ ...amap, againstPts: e.target.value })} />
            </div>
            <input className="input" placeholder="Where the desk lands (optional)" value={amap.verdict} onChange={(e) => setAmap({ ...amap, verdict: e.target.value })} style={{ width: "100%" }} />
            <div className="comment-form-row"><button className="btn btn--small" type="submit">Save map</button></div>
          </form>

          <h2 style={{ fontFamily: "var(--serif)" }}>Assignment Desk question</h2>
          <form className="comment-form" onSubmit={async (e) => { e.preventDefault(); const ok = await api({ action: "createAssignment", ...asn }); if (ok) { setMsg("Assignment posted to /assignment-desk."); setAsn({ question: "", detail: "", goal: 25 }); } }}>
            <input className="input" placeholder="The question readers can back" value={asn.question} onChange={(e) => setAsn({ ...asn, question: e.target.value })} style={{ width: "100%" }} />
            <textarea style={{ minHeight: 70 }} placeholder="What the desk would investigate" value={asn.detail} onChange={(e) => setAsn({ ...asn, detail: e.target.value })} />
            <div className="comment-form-row"><label className="mono" style={{ fontSize: "0.66rem", color: "var(--slate)" }}>backers to commission <input type="number" className="input" value={asn.goal} onChange={(e) => setAsn({ ...asn, goal: Number(e.target.value) })} style={{ width: 80, marginLeft: 8 }} /></label><button className="btn btn--small" type="submit">Post it</button></div>
          </form>

          <h2 style={{ fontFamily: "var(--serif)" }}>Document (primary source, annotated)</h2>
          <form className="comment-form" onSubmit={async (e) => {
            e.preventDefault();
            const blocks = doc.raw.split(/\n\n+/).map((chunk) => { const [quote, ...note] = chunk.split(" || "); return { quote: (quote || "").trim(), note: note.join(" || ").trim() || undefined }; }).filter((b) => b.quote);
            const ok = await api({ action: "saveDoc", doc: { ...doc, blocks } });
            if (ok) setMsg(`Document saved — /document/${doc.slug}`);
          }}>
            <p className="mono">Each block: the quoted text, then <code> || </code>, then your margin note. Separate blocks with a blank line.</p>
            <div className="comment-form-row" style={{ marginTop: 0 }}>
              <input className="input" placeholder="slug" value={doc.slug} onChange={(e) => setDoc({ ...doc, slug: e.target.value })} style={{ maxWidth: 160 }} />
              <select className="btn-instrument" value={doc.kind} onChange={(e) => setDoc({ ...doc, kind: e.target.value })}><option value="bill">bill</option><option value="ruling">ruling</option><option value="order">order</option><option value="report">report</option></select>
              <input className="input" placeholder="Title" value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} style={{ flex: 1 }} />
            </div>
            <input className="input" placeholder="One-line summary" value={doc.summary} onChange={(e) => setDoc({ ...doc, summary: e.target.value })} style={{ width: "100%" }} />
            <input className="input" placeholder="Source URL (optional)" value={doc.sourceUrl} onChange={(e) => setDoc({ ...doc, sourceUrl: e.target.value })} style={{ width: "100%" }} />
            <textarea style={{ minHeight: 140 }} placeholder={"SEC. 101. Such amounts as may be necessary… || Translation: keep funding at last year's levels.\n\nSEC. 134. Notwithstanding any other provision… || 'Notwithstanding' is the tell — this dodges the caps."} value={doc.raw} onChange={(e) => setDoc({ ...doc, raw: e.target.value })} />
            <div className="comment-form-row"><button className="btn btn--small" type="submit">Save document</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
