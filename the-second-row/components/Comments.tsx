"use client";

import { useCallback, useEffect, useState } from "react";
import { Comment } from "@/lib/types";

function SignIn({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
      else {
        setNote(data.note);
        onDone();
      }
    } catch {
      setNote("Network hiccup.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="comment-form">
      <p style={{ margin: "0 0 10px", fontFamily: "var(--sans)", fontSize: "0.9rem", color: "var(--ink-1)" }}>
        <strong>Take a seat to speak.</strong> No passwords — ever. Your comments, clippings, and
        calls are kept on the Permanent Record, findable day after day.
      </p>
      <form onSubmit={submit} className="comment-form-row" style={{ marginTop: 0 }}>
        <input className="input" type="text" placeholder="Name (shown)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Display name" style={{ maxWidth: 180 }} />
        <input className="input" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" style={{ maxWidth: 240 }} />
        <button className="btn btn--small" type="submit" disabled={busy}>{busy ? "…" : "Take a seat"}</button>
      </form>
      {note && <p className="capture-note">{note}</p>}
    </div>
  );
}

const CERTS = ["CERTAIN", "LIKELY", "GUESSING"] as const;

export default function Comments({ target, resolved }: { target: string; resolved: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [text, setText] = useState("");
  const [certainty, setCertainty] = useState<(typeof CERTS)[number]>("LIKELY");
  const [sealed, setSealed] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [steelman, setSteelman] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?target=${encodeURIComponent(target)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } catch {}
  }, [target]);

  useEffect(() => {
    load();
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSignedIn(Boolean(d?.user)))
      .catch(() => setSignedIn(false));
  }, [load]);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          text,
          certainty,
          sealed: sealed && !replyTo,
          parentId: replyTo?.id,
          steelman: replyTo ? steelman : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNote(data.error || "Didn't take.");
        if (res.status === 401) setSignedIn(false);
      } else {
        setText("");
        setSteelman("");
        setSealed(false);
        setReplyTo(null);
        if (data.note) setNote(data.note);
        load();
      }
    } catch {
      setNote("Network hiccup.");
    } finally {
      setBusy(false);
    }
  };

  const mind = async (id: string) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mind", commentId: id }),
      });
      if (res.status === 401) setSignedIn(false);
      else load();
    } catch {}
  };

  const roots = comments.filter((c) => !c.parentId);
  const childrenOf = (id: string) => comments.filter((c) => c.parentId === id);

  const renderComment = (c: Comment, depth = 0) => {
    const sealedShut = c.sealed && !resolved;
    return (
      <div key={c.id} className="comment" style={{ marginLeft: depth ? 24 : 0 }}>
        <div className="comment-meta">
          <span className="comment-name">{c.name}</span>
          {c.tier === "founding" && <span className="comment-badge comment-badge--founding">Founding</span>}
          <span className={`comment-badge comment-badge--${c.certainty.toLowerCase()}`}>{c.certainty}</span>
          {c.sealed && <span className="comment-badge comment-badge--sealed">{sealedShut ? "SEALED TAKE" : "SEAL OPENED"}</span>}
          {c.status === "held" && <span className="comment-badge">awaiting the desk</span>}
          <span>{new Date(c.at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        {c.steelman && <div className="comment-steelman">Their point, restated: “{c.steelman}”</div>}
        <div className="comment-body">
          {sealedShut ? "🔒 Sealed until this story resolves — then every seal opens at once." : c.text}
        </div>
        <div className="comment-actions">
          {c.minds > 0 && <span className="minds">{c.minds} mind{c.minds === 1 ? "" : "s"} changed</span>}
          {!sealedShut && (
            <button onClick={() => mind(c.id)} title="Not a like. A concession.">this moved me</button>
          )}
          {!sealedShut && depth === 0 && (
            <button onClick={() => { setReplyTo(c); setNote(null); }}>rebut (steelman first)</button>
          )}
        </div>
        {childrenOf(c.id).map((child) => renderComment(child, depth + 1))}
      </div>
    );
  };

  return (
    <section className="comments" aria-label="The room — comments">
      <div className="comments-head">
        <h2>The Room</h2>
        <span className="comments-rule">
          ranked by minds changed, not likes · every comment wears its confidence · rebuttals
          restate the other side first
        </span>
      </div>

      {signedIn === false && <SignIn onDone={() => setSignedIn(true)} />}

      {signedIn && (
        <form className="comment-form" onSubmit={post}>
          {replyTo && (
            <div className="comment-steelman" style={{ marginBottom: 8 }}>
              Rebutting <strong>{replyTo.name}</strong>.{" "}
              <button type="button" onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "var(--pulse)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.66rem" }}>
                cancel
              </button>
              <input
                className="input"
                style={{ display: "block", width: "100%", marginTop: 6, borderRadius: 8 }}
                placeholder="The Steelman Gate: restate their point fairly, in one sentence…"
                value={steelman}
                onChange={(e) => setSteelman(e.target.value)}
                aria-label="Steelman — restate their point"
              />
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyTo ? "…now your answer." : "Say it like you'll be scored on it."}
            aria-label="Your comment"
          />
          <div className="comment-form-row">
            <span className="seg" role="group" aria-label="How sure are you?">
              {CERTS.map((c) => (
                <button key={c} type="button" aria-pressed={certainty === c} onClick={() => setCertainty(c)}>
                  {c}
                </button>
              ))}
            </span>
            {!replyTo && target.startsWith("story:") && (
              <label style={{ fontFamily: "var(--mono)", fontSize: "0.64rem", color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={sealed} onChange={(e) => setSealed(e.target.checked)} />
                seal until resolution
              </label>
            )}
            <button className="btn btn--small" type="submit" disabled={busy} style={{ marginLeft: "auto" }}>
              {busy ? "…" : replyTo ? "Post rebuttal" : sealed ? "Seal it" : "Post"}
            </button>
          </div>
          {note && <p className="capture-note">{note}</p>}
        </form>
      )}

      {note && !signedIn && <p className="capture-note">{note}</p>}

      <div>
        {roots.length === 0 && (
          <p className="house-note" style={{ textTransform: "none", letterSpacing: 0 }}>
            The room is empty. First seat is yours.
          </p>
        )}
        {roots.map((c) => renderComment(c))}
      </div>
    </section>
  );
}
