"use client";

import { useState } from "react";
import { Assignment } from "@/lib/extras";

export default function AssignmentList({ initial }: { initial: Assignment[] }) {
  const [items, setItems] = useState(initial);
  const [note, setNote] = useState<string | null>(null);

  const back = async (id: string) => {
    setNote(null);
    try {
      const res = await fetch("/api/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNote(data.error || "Couldn't add your pledge.");
        return;
      }
      setItems((xs) => xs.map((a) => (a.id === id ? data.assignment : a)));
      setNote(data.note || "Pledge added.");
    } catch {
      setNote("Network hiccup.");
    }
  };

  if (items.length === 0) {
    return <p className="mono" style={{ color: "var(--slate)" }}>No open assignments right now — the desk posts new questions here.</p>;
  }

  return (
    <div className="cards">
      {items.map((a) => {
        const pct = Math.min(100, Math.round((a.backers.length / a.goal) * 100));
        return (
          <div className="card" key={a.id}>
            <div className="card-kicker" style={{ color: a.status === "open" ? "var(--maroon-row)" : "var(--verdict)" }}>
              {a.status === "open" ? "Open for backing" : a.status === "commissioned" ? "Commissioned — the desk is on it" : "Published"}
            </div>
            <h3>{a.question}</h3>
            <p>{a.detail}</p>
            <div className="tiltbar" style={{ marginTop: 4 }}>
              <span style={{ width: `${pct}%`, background: "var(--maroon-row)" }} />
              <span style={{ width: `${100 - pct}%`, background: "var(--bg-well)" }} />
            </div>
            <div className="card-foot">
              {a.backers.length} of {a.goal} backers
              {a.status === "open" && (
                <button className="btn btn--small btn--maroon" style={{ marginLeft: 10 }} onClick={() => back(a.id)}>
                  Back this question
                </button>
              )}
              {a.resultSlug && <> · <a href={`/column/${a.resultSlug}`}>read the result →</a></>}
            </div>
          </div>
        );
      })}
      {note && <p className="capture-note">{note}</p>}
    </div>
  );
}
