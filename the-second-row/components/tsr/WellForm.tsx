"use client";

import { useState } from "react";

const AREAS = [
  "Foster care", "Occupational licensing", "Civil asset forfeiture", "Term limits",
  "Campaign finance", "Spending transparency", "Tech / AI & data privacy", "Housing & zoning",
  "Criminal justice", "Election administration", "Debt & entitlements", "Civic education",
  "Veterans", "Family policy", "Judicial reform", "Second Amendment", "Drug policy", "Other",
];

const inputCls =
  "w-full rounded border border-hairline-strong bg-[color-mix(in_oklab,var(--color-cream)_4%,transparent)] px-3 py-2 font-body text-[16px] text-cream placeholder:text-cream-55 focus:border-oxblood focus:outline-none";
const labelCls = "mono-label mb-1 block text-[0.58rem] text-cream-55";

export default function WellForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/well", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: f.get("title"), area: f.get("area"), problem: f.get("problem"),
          proposal: f.get("proposal"), fullText: f.get("fullText"), byName: f.get("byName"),
        }),
      });
      const d = await res.json();
      if (!res.ok) { setStatus("error"); setNote(d?.error || "Something went wrong."); return; }
      setStatus("done"); setNote(d?.note || "In the queue.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error"); setNote("Network error — try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded border border-oxblood bg-oxblood-12 p-5">
        <p className="font-display text-lg font-bold text-cream">In the well.</p>
        <p className="mt-2 font-body text-[0.95rem] text-cream-70">{note}</p>
        <button onClick={() => setStatus("idle")} className="mt-3 mono-label text-[0.6rem] text-oxblood hover:underline">Submit another →</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className={labelCls} htmlFor="w-title">Title</label>
        <input id="w-title" name="title" required maxLength={160} className={inputCls} placeholder="One line: what should the Floor take up?" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="w-area">Area</label>
          <select id="w-area" name="area" className={inputCls} defaultValue="Other">
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="w-name">Your name (optional)</label>
          <input id="w-name" name="byName" maxLength={60} className={inputCls} placeholder="How to credit you" />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="w-problem">The problem</label>
        <textarea id="w-problem" name="problem" required rows={3} maxLength={4000} className={inputCls} placeholder="Who is hurt, and how — concretely." />
      </div>
      <div>
        <label className={labelCls} htmlFor="w-proposal">The proposal</label>
        <textarea id="w-proposal" name="proposal" required rows={4} maxLength={6000} className={inputCls} placeholder="The mechanism. What law or rule changes, and how it's enforced." />
      </div>
      <div>
        <label className={labelCls} htmlFor="w-full">Full text (optional)</label>
        <textarea id="w-full" name="fullText" rows={4} maxLength={20000} className={inputCls} placeholder="Paste a full draft if you have one." />
      </div>
      {status === "error" && <p className="font-body text-[0.9rem] text-flash">{note}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full bg-oxblood px-6 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-cream disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Drop it in the well"}
      </button>
    </form>
  );
}
