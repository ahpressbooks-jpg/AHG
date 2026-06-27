"use client";

import { useState } from "react";
import { VOLUNTEER_ROLES } from "@/lib/action";

type Kind = "report-harm" | "submit-issue" | "volunteer" | "share-experience";

const COPY: Record<Kind, { kicker: string; title: string; placeholder: string; cta: string }> = {
  "report-harm": { kicker: "Open intake · confidential", title: "Report harm", placeholder: "What's the pattern, document, timeline, or local issue others are missing? Be specific — dates, names, how you know.", cta: "Send report" },
  "submit-issue": { kicker: "Open intake", title: "Submit a local issue", placeholder: "Tell us what your school, city, neighborhood, or system is dealing with.", cta: "Submit issue" },
  "volunteer": { kicker: "Organize", title: "Volunteer with TSR", placeholder: "What would you like to work on, and what's your background? You don't need a title — honesty and follow-through matter most.", cta: "Offer to help" },
  "share-experience": { kicker: "Add to the record", title: "Share your experience", placeholder: "Your lived experience is evidence. Tell it in your words; we treat it with care.", cta: "Add my experience" },
};

export default function IntakeForm({ kind, id }: { kind: Kind; id?: string }) {
  const c = COPY[kind];
  const [form, setForm] = useState({ name: "", contact: "", topic: "", summary: "", consent: false });
  const [roles, setRoles] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...form, roles }),
      });
      const data = await res.json();
      setNote(res.ok ? data.note : data.error || "Didn't send — try again.");
      if (res.ok) { setForm({ name: "", contact: "", topic: "", summary: "", consent: false }); setRoles([]); }
    } catch {
      setNote("Network hiccup — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form id={id} className="intake" onSubmit={submit} aria-label={c.title}>
      <span className="mode mode--action" style={{ alignSelf: "flex-start" }}>{c.kicker}</span>
      <h3>{c.title}</h3>
      {note ? (
        <p className="intake-note">{note}</p>
      ) : (
        <>
          <div className="intake-row">
            <input className="input" placeholder="Name or pseudonym (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Name or pseudonym" />
            <input className="input" placeholder="How to reach you (optional)" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} aria-label="Contact" />
          </div>
          {kind !== "volunteer" && (
            <input className="input" placeholder="Topic or place (e.g. foster care, your city)" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} aria-label="Topic or place" style={{ width: "100%" }} />
          )}
          {kind === "volunteer" && (
            <div className="intake-roles" role="group" aria-label="How you'd like to help">
              {VOLUNTEER_ROLES.map((r) => (
                <button type="button" key={r} className="rolechip" aria-pressed={roles.includes(r)} onClick={() => setRoles((xs) => xs.includes(r) ? xs.filter((x) => x !== r) : [...xs, r])}>{r}</button>
              ))}
            </div>
          )}
          <textarea className="intake-text" placeholder={c.placeholder} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} aria-label="Details" />
          <label className="intake-consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
            <span>I understand TSR protects sources and verifies before publishing. {kind === "report-harm" && "Don't include anything that could endanger you on an unsafe device or network."}</span>
          </label>
          <button className="btn btn--maroon" type="submit" disabled={busy}>{busy ? "Sending…" : c.cta}</button>
        </>
      )}
    </form>
  );
}
