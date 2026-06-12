"use client";

import { useEffect, useState } from "react";

const COLORS = ["#8A1F35", "#2E5BFF", "#0E7C4A", "#101319", "#5B6B7C", "#6D28D9"];

// THE SEAT PLATE — edit your public profile: name, one line, color, lights.
export default function ProfileEditor() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [pub, setPub] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setUid(d.user.id);
          setName(d.user.name ?? "");
          setBio(d.user.bio ?? "");
          setColor(d.user.seatColor ?? COLORS[0]);
          setPub(d.user.publicProfile !== false);
        }
      })
      .catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, seatColor: color, publicProfile: pub }),
      });
      const data = await res.json();
      setNote(res.ok ? data.note : data.error || "Didn't take.");
      if (res.ok) setTimeout(() => window.location.reload(), 1200);
    } catch {
      setNote("Network hiccup.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={save} aria-label="Edit your seat plate">
      <p className="mono" style={{ margin: "0 0 10px", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--slate)" }}>
        Your seat plate — what the room sees
        {uid && pub && (
          <>
            {" · "}
            <a href={`/reader/${uid}`} style={{ color: "var(--pulse)" }}>view your public profile →</a>
          </>
        )}
      </p>
      <div className="comment-form-row" style={{ marginTop: 0 }}>
        <span className="avatar avatar--big" style={{ background: color }} aria-hidden="true">
          {(name || "?").slice(0, 1).toUpperCase()}
        </span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" aria-label="Display name" maxLength={60} style={{ flex: 1 }} />
      </div>
      <div className="comment-form-row">
        <input className="input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="One line for the plate (optional) — e.g. 'Reads the workings first.'" aria-label="Bio" maxLength={160} style={{ width: "100%" }} />
      </div>
      <div className="comment-form-row">
        <span className="swatches" role="group" aria-label="Seat color">
          {COLORS.map((c) => (
            <button key={c} type="button" className="swatch" style={{ background: c }} aria-pressed={color === c} aria-label={`Seat color ${c}`} onClick={() => setColor(c)} />
          ))}
        </span>
        <label style={{ fontFamily: "var(--mono)", fontSize: "0.64rem", color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} />
          public profile
        </label>
        <button className="btn btn--small" type="submit" disabled={busy}>{busy ? "…" : "Save the plate"}</button>
      </div>
      {note && <p className="capture-note">{note}</p>}
    </form>
  );
}
