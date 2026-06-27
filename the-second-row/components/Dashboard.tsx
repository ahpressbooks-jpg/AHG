"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ProfileEditor from "@/components/ProfileEditor";
import ThemeToggle from "@/components/ThemeToggle";
import { YourTilt } from "@/components/YourTilt";

type Section = "overview" | "profile" | "saved" | "following" | "ledger" | "submissions" | "activity" | "membership" | "notifications" | "settings";
const NAV: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "saved", label: "Saved" },
  { id: "following", label: "Following" },
  { id: "ledger", label: "My Ledger" },
  { id: "submissions", label: "My Submissions" },
  { id: "activity", label: "Activity" },
  { id: "membership", label: "Membership" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
];

const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });

function SignIn() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setNote(null);
    try {
      const r = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name }) });
      const d = await r.json();
      if (!r.ok) setNote(d.error || "Hm.");
      else if (d.mode === "magic") setNote(d.note);
      else window.location.reload();
    } catch { setNote("Network hiccup."); } finally { setBusy(false); }
  };
  return (
    <main className="wrap wrap--reading page">
      <div className="page-kicker">Your Seat</div>
      <h1>Take a seat. Keep it forever.</h1>
      <p className="lede">One email, no passwords. Your saved stories, comments, calls, and submissions live on the Permanent Record — findable any day, any device. Download or delete everything anytime.</p>
      <form className="comment-form" onSubmit={go} style={{ maxWidth: 520 }}>
        <div className="comment-form-row" style={{ marginTop: 0 }}>
          <input className="input" placeholder="Name (shown on comments)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
        </div>
        <div className="comment-form-row">
          <input className="input" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
          <button className="btn" type="submit" disabled={busy}>{busy ? "…" : "Take your seat"}</button>
        </div>
      </form>
      {note && <p className="capture-note">{note}</p>}
      <p style={{ marginTop: 18 }}><Link href="/subscribe">Become a member →</Link></p>
    </main>
  );
}

export default function Dashboard() {
  const [d, setD] = useState<any>(undefined); // undefined=loading, null=signed out
  const [section, setSection] = useState<Section>("overview");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/account", { cache: "no-store" });
      const data = await r.json();
      setD(data.user ? data : null);
    } catch { setD(null); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (d === undefined) return <main className="wrap page"><p className="house-note">Loading your seat…</p></main>;
  if (d === null) return <SignIn />;

  const u = d.user;
  const tierLabel = u.tier === "founding" ? `Founding № ${String(u.foundingNumber ?? 0).padStart(3, "0")}` : u.tier === "pro" ? "Second Row Pro" : "The Floor";

  const act = async (payload: any) => {
    setMsg(null);
    const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setMsg(data.error || "Failed."); return null; }
    if (data.note) setMsg(data.note);
    return data;
  };
  const portal = async () => {
    const r = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const data = await r.json(); if (r.ok) window.location.href = data.url; else setMsg(data.error || "Billing isn't live yet.");
  };
  const gift = async () => {
    const r = await fetch("/api/gift", { method: "POST" }); const data = await r.json();
    setMsg(r.ok ? `Gift code ${data.code} — ${data.note}` : data.error || "Gifting hiccuped.");
  };
  const logout = async () => { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); window.location.href = "/"; };
  const del = async () => { if (confirm("Erase your account and personal data? This cannot be undone.")) { await act({ action: "deleteAccount" }); window.location.href = "/"; } };

  const Stat = ({ n, l }: { n: any; l: string }) => <div className="ad-stat"><span className="ad-stat-n">{n}</span><span className="ad-stat-l">{l}</span></div>;
  const linkFor = (t: any) => t.storyId ? `/wire/${t.storyId}` : t.target ? (t.target.startsWith("story:") ? `/wire/${t.target.slice(6)}` : `/column/${t.target.slice(5)}`) : "#";

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand"><span className="avatar" style={{ background: u.seatColor }}>{u.name.slice(0, 1).toUpperCase()}</span><span>{u.name}</span></div>
        <nav>{NAV.map((n) => <button key={n.id} className={section === n.id ? "is-active" : ""} onClick={() => setSection(n.id)}>{n.label}</button>)}</nav>
        <div className="admin-side-foot">
          <Link href="/" className="mono">← The site</Link>
          <button className="mono" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        {msg && <div className="admin-msg">{msg}</div>}

        {section === "overview" && (<>
          <h1>Welcome back, {u.name.split(" ")[0]}.</h1>
          <p className="mono" style={{ color: "var(--slate)", marginTop: -10 }}>{tierLabel} · seated {new Date(u.createdAt).toLocaleDateString()}{u.verified ? "" : " · unverified"}</p>
          <div className="ad-stats" style={{ marginTop: 16 }}>
            <Stat n={d.judgment.score > 0 ? `+${d.judgment.score}` : d.judgment.score} l="judgment score" />
            <Stat n={d.clips.length} l="saved" />
            <Stat n={d.follows.length} l="following" />
            <Stat n={d.comments.length} l="comments" />
          </div>
          <div className="ad-cols">
            <div className="ad-panel"><h2>Recent activity</h2>{d.activity.slice(0, 6).map((a: any, i: number) => (<p key={i} className="mono" style={{ margin: "3px 0", fontSize: "0.72rem" }}><b>{a.type}</b> · {a.text}</p>))}{d.activity.length === 0 && <p className="mono">Nothing yet — start by clipping a story.</p>}</div>
            <div className="ad-panel"><h2>Quick moves</h2><p className="mono"><Link href="/wire">The Wire →</Link></p><p className="mono"><Link href="/action">Take action →</Link></p><p className="mono"><Link href="/ledger">Make a call →</Link></p><p className="mono"><Link href="/tips">Submit a lead →</Link></p></div>
          </div>
          <YourTilt />
        </>)}

        {section === "profile" && (<><h1>Profile</h1><ProfileEditor />{u.publicProfile && <p className="mono" style={{ marginTop: 10 }}><Link href={`/reader/${u.id}`}>View your public profile →</Link></p>}</>)}

        {section === "saved" && (<>
          <h1>Saved <span className="ad-sub">clipped stories</span></h1>
          {d.clips.length === 0 ? <p className="mono">Empty drawer. The ✂ Clip button is on every dossier.</p> : <table><tbody>{d.clips.map((c: any) => <tr key={c.storyId}><td className="mono">{fmt(c.at)}</td><td><Link href={`/wire/${c.storyId}`}>{c.headline}</Link></td></tr>)}</tbody></table>}
        </>)}

        {section === "following" && (<>
          <h1>Following <span className="ad-sub">stories that tap your shoulder when they develop</span></h1>
          {d.follows.length === 0 ? <p className="mono">Not following anything yet.</p> : <table><tbody>{d.follows.map((c: any) => <tr key={c.storyId}><td className="mono">{fmt(c.at)}</td><td><Link href={`/wire/${c.storyId}`}>{c.headline}</Link></td></tr>)}</tbody></table>}
        </>)}

        {section === "ledger" && (<>
          <h1>My Ledger <span className="ad-sub">your scored calls</span></h1>
          <div className="ad-stats" style={{ marginBottom: 14 }}><Stat n={`+${Math.max(0, d.judgment.score)}`} l="score" /><Stat n={d.judgment.hits} l="hits" /><Stat n={d.judgment.misses} l="misses" /><Stat n={d.judgment.open} l="open" /></div>
          {d.calls.length === 0 ? <p className="mono">No calls yet — the ⚖ button on any dossier puts you on the record.</p> : <table><thead><tr><th>Dated</th><th>Call</th><th>Conf.</th><th>Result</th></tr></thead><tbody>{d.calls.map((c: any) => <tr key={c.id}><td className="mono">{fmt(c.at)}</td><td>{c.claim}</td><td className="mono">{c.confidence}</td><td className={c.result === "HIT" ? "ledger-hit" : c.result === "MISS" ? "ledger-miss" : "ledger-open"}>{c.result ?? "OPEN"}</td></tr>)}</tbody></table>}
        </>)}

        {section === "submissions" && (<>
          <h1>My Submissions <span className="ad-sub">leads, issues, and contributions</span></h1>
          {d.submissions.length === 0 ? <p className="mono">No submissions yet. <Link href="/action">Submit a local issue or lead →</Link></p> : d.submissions.map((sx: any) => <div key={sx.id} className="ad-item"><div className="ad-item-head"><span className="mode mode--action">{sx.kind}</span><span className="mono" style={{ color: "var(--slate)" }}>{new Date(sx.at).toLocaleString()}</span></div><p className="ad-item-body">{sx.summary}</p></div>)}
        </>)}

        {section === "activity" && (<>
          <h1>Activity <span className="ad-sub">your timeline on TSR</span></h1>
          {d.activity.length === 0 ? <p className="mono">Your timeline fills as you read, save, comment, and call.</p> : <div className="dispatches" style={{ borderTopWidth: 1 }}>{d.activity.map((a: any, i: number) => <div key={i} className="dispatch-row" style={{ gridTemplateColumns: "100px 1fr" }}><div className="d-when">{fmt(a.at)}<br /><span className="mono" style={{ color: "var(--pulse)" }}>{a.type}</span></div><div><Link href={linkFor(a)} style={{ fontFamily: "var(--sans)", textDecoration: "none" }}>{a.text || "(activity)"}</Link>{a.result && <span className="mono" style={{ color: "var(--slate)" }}> · {a.result}</span>}</div></div>)}</div>}
        </>)}

        {section === "membership" && (<>
          <h1>Membership <span className="ad-sub">support TSR · reading stays free</span></h1>
          <div className="ad-panel">
            <p style={{ marginTop: 0 }}>You&apos;re on <strong>{tierLabel}</strong>{u.subscriptionStatus ? ` · ${u.subscriptionStatus}` : ""}{u.periodEnd ? ` · renews ${new Date(u.periodEnd).toLocaleDateString()}` : ""}.</p>
            <p className="mono" style={{ color: "var(--slate)" }}>All content is free for everyone. Membership is how the work stays independent and free.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {!u.paid && <Link className="btn btn--maroon btn--small" href="/subscribe">Become a member</Link>}
              {u.paid && <button className="btn btn--ghost btn--small" onClick={portal}>Billing &amp; invoices</button>}
              {u.paid && <button className="btn btn--ghost btn--small" onClick={gift}>Gift a seat</button>}
            </div>
          </div>
        </>)}

        {section === "notifications" && <Notifications initial={u.notify} onSave={(n) => act({ action: "updatePrefs", ...n })} />}

        {section === "settings" && (<>
          <h1>Settings <span className="ad-sub">privacy &amp; security</span></h1>
          <div className="ad-panel"><h2>Appearance</h2><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="mono">Theme</span><ThemeToggle /></div></div>
          <div className="ad-panel"><h2>Security</h2><p className="mono" style={{ color: "var(--slate)" }}>Passwordless by design — there&apos;s no password to leak. Passkeys and 2FA are on the roadmap. Sessions are HttpOnly and rotate.</p></div>
          <div className="ad-panel"><h2>Your data</h2><p className="mono">Download everything, or erase it — no support ticket.</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}><a className="btn btn--ghost btn--small" href="/api/export" download>Download everything (JSON)</a><button className="btn btn--ghost btn--small" onClick={del} style={{ color: "var(--crimson)", borderColor: "var(--crimson)" }}>Delete my account</button></div></div>
        </>)}
      </main>
    </div>
  );
}

function Notifications({ initial, onSave }: { initial: any; onSave: (n: any) => void }) {
  const [n, setN] = useState({ email: initial?.email ?? true, flash: initial?.flash ?? true, follows: initial?.follows ?? true });
  const Toggle = ({ k, label, desc }: { k: "email" | "flash" | "follows"; label: string; desc: string }) => (
    <label className="dash-toggle">
      <input type="checkbox" checked={n[k]} onChange={(e) => setN({ ...n, [k]: e.target.checked })} />
      <span><b>{label}</b><br /><span className="mono" style={{ color: "var(--slate)", fontSize: "0.68rem" }}>{desc}</span></span>
    </label>
  );
  return (
    <>
      <h1>Notifications <span className="ad-sub">what reaches you</span></h1>
      <div className="ad-panel" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Toggle k="email" label="The Morning Edition" desc="The 7 a.m. board and daily briefing." />
        <Toggle k="flash" label="FLASH alerts" desc="Only when a story takes the stage. Rare by design." />
        <Toggle k="follows" label="Followed stories" desc="When a story you follow actually develops." />
        <button className="btn btn--small" style={{ alignSelf: "flex-start" }} onClick={() => onSave(n)}>Save preferences</button>
      </div>
    </>
  );
}
