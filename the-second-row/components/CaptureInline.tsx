"use client";

import { useState } from "react";

export function CaptureInline({ label, line }: { label: string; line: string }) {
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
    <div className="capture">
      <div className="capture-label">{label}</div>
      <p className="capture-line">{line}</p>
      {note ? (
        <div className="capture-note">{note}</div>
      ) : (
        <form className="capture-form" onSubmit={submit}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" />
          <button type="submit" disabled={busy}>{busy ? "…" : label}</button>
        </form>
      )}
    </div>
  );
}
