"use client";

import { useState } from "react";
import type { VoteOption } from "@/lib/floorvotes";

// The ranked ballot — pick your top three priorities in order. The option set is
// fixed by the desk (drafts + BACK/FIGHT items), so you set priority within the
// spine, never against it.
export default function Ballot({ options }: { options: VoteOption[] }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  const toggle = (id: string) => {
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p));
  };

  async function submit() {
    if (!picks.length || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/floor-votes", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ranking: picks }),
      });
      const d = await res.json();
      if (!res.ok) { setStatus("error"); setNote(d?.error || "Try again."); return; }
      setStatus("done"); setNote(d?.note || "Ballot counted.");
    } catch { setStatus("error"); setNote("Network error."); }
  }

  if (status === "done") {
    return (
      <div className="rounded border border-oxblood bg-oxblood-12 p-5">
        <p className="font-display text-lg font-bold text-cream">Ballot counted.</p>
        <p className="mt-2 font-body text-[0.95rem] text-cream-70">{note}</p>
      </div>
    );
  }

  if (!options.length) {
    return <p className="font-body text-[0.95rem] text-cream-70">No open drafts or active fights to rank yet. The ballot fills as the Floor takes up work.</p>;
  }

  return (
    <div>
      <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cream-55">
        Tap up to three, in priority order {picks.length ? `· picked ${picks.length}/3` : ""}
      </p>
      <ul className="flex flex-col gap-2">
        {options.map((o) => {
          const rank = picks.indexOf(o.id);
          const on = rank >= 0;
          return (
            <li key={o.id}>
              <button
                onClick={() => toggle(o.id)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded border px-4 py-3 text-left ${
                  on ? "border-oxblood bg-oxblood-12" : "border-hairline-strong hover:border-cream-55"
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] ${on ? "bg-oxblood text-cream" : "border border-hairline-strong text-cream-55"}`}>
                  {on ? rank + 1 : ""}
                </span>
                <span className="min-w-0">
                  <span className="block font-body text-[0.98rem] text-cream">{o.label}</span>
                  {o.sub && <span className="block font-mono text-[0.58rem] text-cream-55">{o.sub}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {status === "error" && <p className="mt-3 font-body text-[0.9rem] text-flash">{note}</p>}
      <button
        onClick={submit}
        disabled={!picks.length || status === "sending"}
        className="mt-4 rounded-full bg-oxblood px-6 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-cream disabled:opacity-50"
      >
        {status === "sending" ? "Counting…" : "Cast ballot"}
      </button>
    </div>
  );
}
