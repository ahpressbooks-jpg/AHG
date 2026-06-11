"use client";

import { useState } from "react";

export function YouActions({ signedIn, paid }: { signedIn: boolean; paid: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) setNote(data.error || "Hm.");
      else if (data.mode === "magic") setNote(data.note);
      else window.location.reload();
    } catch {
      setNote("Network hiccup.");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.reload();
  };

  const portal = async () => {
    setNote(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) setNote(data.error || "Billing isn't live yet.");
      else window.location.href = data.url;
    } catch {
      setNote("Network hiccup.");
    }
  };

  if (!signedIn) {
    return (
      <div className="comment-form" style={{ maxWidth: 520 }}>
        <form onSubmit={signIn}>
          <div className="comment-form-row" style={{ marginTop: 0 }}>
            <input className="input" type="text" placeholder="Name (shown on comments)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Display name" />
          </div>
          <div className="comment-form-row">
            <input className="input" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
            <button className="btn" type="submit" disabled={busy}>{busy ? "…" : "Take your seat"}</button>
          </div>
        </form>
        {note && <p className="capture-note">{note}</p>}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
      {!paid && <a className="btn btn--maroon btn--small" href="/subscribe">Go deeper — Pro</a>}
      {paid && <button className="btn btn--ghost btn--small" onClick={portal}>Billing &amp; invoices</button>}
      <a className="btn btn--ghost btn--small" href="/api/export" download>Download everything (JSON)</a>
      <button className="btn btn--ghost btn--small" onClick={logout}>Sign out</button>
      {note && <p className="capture-note" style={{ width: "100%" }}>{note}</p>}
    </div>
  );
}
