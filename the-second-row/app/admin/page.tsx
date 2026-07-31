"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Mark from "@/components/Mark";

type Section = "home" | "submissions" | "moderation" | "content" | "ledger" | "action" | "board" | "settings";

const NAV: { id: Section; label: string }[] = [
  { id: "home", label: "Admin Home" },
  { id: "submissions", label: "Submissions" },
  { id: "moderation", label: "Moderation" },
  { id: "content", label: "Content" },
  { id: "ledger", label: "Ledger" },
  { id: "action", label: "Action Center" },
  { id: "board", label: "The Board" },
  { id: "settings", label: "Settings" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("home");
  const [d, setD] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [post, setPost] = useState({ slug: "", title: "", dek: "", body: "", kind: "dispatch" });
  const [note, setNote] = useState("");
  const [call, setCall] = useState({ claim: "", confidence: "LIKELY", workings: "" });

  const refresh = useCallback(async () => {
    const r = await fetch("/api/admin", { cache: "no-store" });
    if (r.ok) { const data = await r.json(); setD(data); setAuthed(true); if (!note && data.note) setNote(data.note); }
    else if (r.status === 401) setAuthed(false);
  }, [note]);

  useEffect(() => { refresh(); }, [refresh]);

  const api = useCallback(async (payload: any) => {
    setMsg(null);
    const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setMsg(data.error || "Failed."); if (r.status === 401) setAuthed(false); return null; }
    return data;
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const ok = await api({ action: "login", password: pw }); setBusy(false);
    if (ok) { setPw(""); refresh(); }
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><Mark size={28} /><strong style={{ fontFamily: "var(--serif)", fontSize: "1.1rem" }}>The Back Office</strong></div>
          <p className="mono" style={{ color: "var(--slate)", fontSize: "0.72rem", margin: "0 0 14px" }}>TSR internal command center · password required</p>
          <form onSubmit={login} className="capture-form">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" aria-label="Admin password" autoFocus />
            <button type="submit" disabled={busy}>{busy ? "…" : "Enter"}</button>
          </form>
          {msg && <p className="capture-note" style={{ color: "var(--crimson)" }}>{msg}</p>}
          <p className="mono" style={{ color: "var(--slate)", fontSize: "0.62rem", marginTop: 14 }}>Set ADMIN_PASSWORD in env to change it. <Link href="/">← the site</Link></p>
        </div>
      </div>
    );
  }

  const s = d?.stats ?? {};
  const Stat = ({ n, l, hot }: { n: any; l: string; hot?: boolean }) => (
    <div className="ad-stat"><span className="ad-stat-n" style={hot && n > 0 ? { color: "var(--crimson)" } : undefined}>{n}</span><span className="ad-stat-l">{l}</span></div>
  );

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/" className="admin-brand"><Mark size={24} /> <span>Back Office</span></Link>
        <nav>
          {NAV.map((n) => {
            const badge = n.id === "submissions" ? s.openIntake : n.id === "moderation" ? s.heldComments : n.id === "ledger" ? s.openCalls : 0;
            return (
              <button key={n.id} className={section === n.id ? "is-active" : ""} onClick={() => setSection(n.id)}>
                {n.label}{badge ? <span className="ad-badge">{badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="admin-side-foot">
          <Link href="/desk" className="mono">Live board controls →</Link>
          <button className="mono" onClick={async () => { await api({ action: "logout" }); setAuthed(false); }}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        {msg && <div className="admin-msg">{msg}</div>}

        {section === "home" && d && (
          <>
            <h1>Command center</h1>
            <div className="ad-stats">
              <Stat n={s.openIntake} l="new submissions" hot />
              <Stat n={s.heldComments} l="comments to moderate" hot />
              <Stat n={s.openCalls} l="reader calls open" />
              <Stat n={s.openLedger} l="ledger entries open" />
              <Stat n={s.users} l="accounts" />
              <Stat n={s.seats} l="email list" />
              <Stat n={s.founding} l="founding /500" />
              <Stat n={s.posts} l="published pieces" />
            </div>
            <div className="ad-cols">
              <div className="ad-panel">
                <h2>System status</h2>
                <p className="mono">Board v{d.board.version} · {d.board.count} seated · swept {d.board.sweptAt ? new Date(d.board.sweptAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</p>
                <p className="mono">House lights: <b>{d.lights ? "UP (archive open)" : "normal"}</b> · Predictions Night: <b>{d.predictions ? "OPEN" : "closed"}</b></p>
                <table><tbody>{d.board.log.map((l: any, i: number) => (<tr key={i}><td className="mono">{new Date(l.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td><td className="mono">{l.line}</td></tr>))}</tbody></table>
              </div>
              <div className="ad-panel">
                <h2>Latest sign-ups</h2>
                {d.recentSeats.length === 0 ? <p className="mono">None yet.</p> : d.recentSeats.map((x: any, i: number) => (<p key={i} className="mono" style={{ margin: "2px 0" }}>{x.email}</p>))}
              </div>
            </div>
          </>
        )}

        {section === "submissions" && d && (
          <>
            <h1>Submissions <span className="ad-sub">Action Center intake · leads · issues · volunteers</span></h1>
            {d.intake.length === 0 ? <p className="mono">No submissions yet. They arrive from the Action Center.</p> : d.intake.map((i: any) => (
              <div key={i.id} className={`ad-item${i.handled ? " is-done" : ""}`}>
                <div className="ad-item-head">
                  <span className="mode mode--action">{i.kind}</span>
                  {i.topic && <span className="mono">{i.topic}</span>}
                  <span className="mono" style={{ color: "var(--slate)" }}>{new Date(i.at).toLocaleString()}</span>
                  {i.handled && <span className="lstat lstat--resolved">handled</span>}
                </div>
                <p className="ad-item-body">{i.summary}</p>
                <div className="ad-item-meta">{i.name && <span>{i.name}</span>}{i.contact && <span className="mono">{i.contact}</span>}{i.roles?.length ? <span className="mono">roles: {i.roles.join(", ")}</span> : null}</div>
                <div className="ad-item-actions">
                  <button onClick={() => api({ action: "markIntake", id: i.id, undo: i.handled }).then(refresh)}>{i.handled ? "Reopen" : "Mark handled"}</button>
                </div>
              </div>
            ))}
          </>
        )}

        {section === "moderation" && d && (
          <>
            <h1>Moderation <span className="ad-sub">first comments wait here · one rule for everyone</span></h1>
            {d.moderation.length === 0 ? <p className="mono">Queue clear.</p> : d.moderation.map((c: any) => (
              <div key={c.id} className="ad-item">
                <div className="ad-item-head"><strong>{c.name}</strong><span className="comment-badge">{c.certainty}</span><span className="mono" style={{ color: "var(--slate)" }}>{c.target}</span></div>
                <p className="ad-item-body">{c.text}</p>
                <div className="ad-item-actions">
                  <button onClick={() => api({ action: "approveComment", id: c.id }).then(refresh)}>Approve</button>
                  <button onClick={() => api({ action: "removeComment", id: c.id }).then(refresh)}>Remove</button>
                </div>
              </div>
            ))}
          </>
        )}

        {section === "content" && d && (
          <>
            <h1>Content <span className="ad-sub">publish stories, dispatches, columns</span></h1>
            <form className="ad-form" onSubmit={async (e) => { e.preventDefault(); const ok = await api({ action: "savePost", post }); if (ok) { setMsg(`Published /column/${ok.slug}`); setPost({ slug: "", title: "", dek: "", body: "", kind: "dispatch" }); refresh(); } }}>
              <div className="ad-form-row">
                <input className="input" placeholder="slug" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} style={{ maxWidth: 180 }} />
                <select className="btn-instrument" value={post.kind} onChange={(e) => setPost({ ...post, kind: e.target.value })}><option value="dispatch">Dispatch</option><option value="column">Column</option><option value="steelman">Steelman</option><option value="note">Desk note</option></select>
                <input className="input" placeholder="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} style={{ flex: 1 }} />
              </div>
              <input className="input" placeholder="Dek (one line)" value={post.dek} onChange={(e) => setPost({ ...post, dek: e.target.value })} style={{ width: "100%" }} />
              <textarea className="intake-text" placeholder="Body — [FACT] [OPINION] [QUESTION] to chip a paragraph; ## for headings" value={post.body} onChange={(e) => setPost({ ...post, body: e.target.value })} />
              <button className="btn" type="submit">Publish</button>
            </form>
            <h2>Published</h2>
            <table><thead><tr><th>Title</th><th>Kind</th><th>Date</th><th></th></tr></thead><tbody>
              {d.posts.map((p: any) => (<tr key={p.slug}><td><Link href={`/column/${p.slug}`}>{p.title}</Link></td><td className="mono">{p.kind}</td><td className="mono">{new Date(p.publishedAt).toLocaleDateString()}</td><td><button className="ad-link" onClick={() => api({ action: "deletePost", slug: p.slug }).then(refresh)}>delete</button></td></tr>))}
              {d.posts.length === 0 && <tr><td colSpan={4} className="mono">Nothing published yet.</td></tr>}
            </tbody></table>
            <h2>Founder&apos;s note (tops /today &amp; Dispatches)</h2>
            <form className="ad-form" onSubmit={async (e) => { e.preventDefault(); const ok = await api({ action: "saveNote", text: note }); if (ok) setMsg("Note signed."); }}>
              <textarea className="intake-text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What the room should know today…" />
              <button className="btn" type="submit">Sign it</button>
            </form>
          </>
        )}

        {section === "ledger" && d && (
          <>
            <h1>Ledger <span className="ad-sub">the desk&apos;s scored record</span></h1>
            <form className="ad-form" onSubmit={async (e) => { e.preventDefault(); const ok = await api({ action: "addDeskCall", ...call }); if (ok) { setMsg("On the record."); setCall({ claim: "", confidence: "LIKELY", workings: "" }); refresh(); } }}>
              <div className="ad-form-row">
                <input className="input" placeholder="The call…" value={call.claim} onChange={(e) => setCall({ ...call, claim: e.target.value })} style={{ flex: 1 }} />
                <select className="btn-instrument" value={call.confidence} onChange={(e) => setCall({ ...call, confidence: e.target.value })}><option>CERTAIN</option><option>LIKELY</option><option>GUESSING</option></select>
                <button className="btn btn--small" type="submit">Call it</button>
              </div>
            </form>
            {d.ledger.filter((c: any) => !c.result).map((c: any) => (
              <div key={c.id} className="ad-item"><p className="ad-item-body">{c.claim} <span className="tag">{c.confidence}</span></p><div className="ad-item-actions"><button onClick={() => api({ action: "resolveDeskCall", id: c.id, result: "HIT" }).then(refresh)}>HIT</button><button onClick={() => api({ action: "resolveDeskCall", id: c.id, result: "MISS" }).then(refresh)}>MISS</button></div></div>
            ))}
            <h2>Reader calls open ({d.readerCalls.length})</h2>
            {d.readerCalls.map((c: any) => (<div key={c.id} className="ad-item"><p className="ad-item-body">{c.claim} <span className="mono" style={{ color: "var(--slate)" }}>— {c.name}</span></p><div className="ad-item-actions"><button onClick={() => api({ action: "markReaderCall", id: c.id, result: "HIT" }).then(refresh)}>HIT</button><button onClick={() => api({ action: "markReaderCall", id: c.id, result: "MISS" }).then(refresh)}>MISS</button></div></div>))}
          </>
        )}

        {section === "action" && d && (
          <>
            <h1>Action Center <span className="ad-sub">campaigns &amp; assignments</span></h1>
            <form className="ad-form" onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget as any; const ok = await api({ action: "createAssignment", question: f.q.value, detail: f.detail.value, goal: Number(f.goal.value) || 25 }); if (ok) { setMsg("Assignment posted."); f.reset(); refresh(); } }}>
              <input className="input" name="q" placeholder="New assignment / question readers can back" style={{ width: "100%" }} />
              <textarea className="intake-text" name="detail" placeholder="What the desk would investigate" />
              <div className="ad-form-row"><input className="input" name="goal" type="number" defaultValue={25} style={{ width: 90 }} /><button className="btn btn--small" type="submit">Post</button></div>
            </form>
            {d.assignments.map((aa: any) => (<div key={aa.id} className="ad-item"><div className="ad-item-head"><span className="mode mode--investigated">{aa.status}</span><strong>{aa.question}</strong></div><p className="ad-item-meta">{aa.backers.length}/{aa.goal} backers</p>{aa.status !== "published" && <div className="ad-item-actions"><button onClick={() => api({ action: "publishAssignment", id: aa.id }).then(refresh)}>Mark published</button></div>}</div>))}
            <p className="mono" style={{ color: "var(--slate)" }}>Seeded campaigns &amp; issue hubs live in lib/action.ts. <Link href="/action">View the Action Center →</Link></p>
          </>
        )}

        {section === "board" && d && (
          <>
            <h1>The Board <span className="ad-sub">resolve stories · live controls on /desk</span></h1>
            <table><thead><tr><th>Tier</th><th>Story</th><th>G</th><th>Close as</th></tr></thead><tbody>
              {d.boardStories.map((st: any) => (<tr key={st.id}><td className="mono">{st.tier}</td><td><Link href={`/wire/${st.id}`}>{st.headline}</Link></td><td className="mono">{st.score}</td><td><select className="btn-instrument" defaultValue="" onChange={(e) => e.target.value && api({ action: "resolveStory", id: st.id, state: e.target.value }).then(refresh)}><option value="">—</option><option value="RESOLVED">RESOLVED</option><option value="FADED">FADED</option><option value="ONGOING">ONGOING</option></select></td></tr>))}
            </tbody></table>
          </>
        )}

        {section === "settings" && d && (
          <>
            <h1>Settings <span className="ad-sub">site-wide controls</span></h1>
            <div className="ad-panel">
              <h2>Protocols</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn--ghost" onClick={() => api({ action: "houseLights" }).then(refresh)}>{d.lights ? "🔆 House lights UP — turn off" : "House lights (open archive in a crisis)"}</button>
                <button className="btn btn--ghost" onClick={() => api({ action: "togglePredictions" }).then(refresh)}>{d.predictions ? "Predictions Night OPEN — close" : "Open Predictions Night"}</button>
              </div>
            </div>
            <div className="ad-panel">
              <h2>Controls &amp; trust pages</h2>
              <p className="mono">Live board (pin/flash): <Link href="/desk">/desk</Link> · Glass Desk: <Link href="/glass">/glass</Link> · Standards: <Link href="/standards">/standards</Link> · Method: <Link href="/method">/method</Link></p>
              <p className="mono" style={{ color: "var(--slate)" }}>Auth is a placeholder gate (ADMIN_PASSWORD). Structured for real roles, 2FA, sessions, and audit logs next.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
