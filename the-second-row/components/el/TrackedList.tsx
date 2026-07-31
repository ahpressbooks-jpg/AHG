"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OFFICE_LABEL, stateName } from "@/lib/candidateMeta";
import type { TrackTarget } from "./TrackButton";

interface Tracked extends TrackTarget {
  at?: string;
}

// YOUR WATCHLIST — the candidates tied to this seat. Open any one to see their
// money and the Wire stories mentioning them.
export default function TrackedList() {
  const [tracked, setTracked] = useState<Tracked[] | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () =>
    fetch("/api/track", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setSignedIn(!!d.signedIn);
        setTracked(Array.isArray(d.tracked) ? d.tracked : []);
      })
      .catch(() => {
        setSignedIn(false);
        setTracked([]);
      });

  useEffect(() => {
    load();
  }, []);

  const untrack = async (c: Tracked) => {
    setBusyId(c.id);
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: c }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (tracked === null) return <p className="el-find-msg">Loading your list…</p>;

  if (signedIn === false) {
    return (
      <div className="el-track-empty">
        <p>Sign in to your seat to keep a watchlist of candidates that follows you across devices.</p>
        <Link className="btn btn--small" href="/you">Sign in</Link>
      </div>
    );
  }

  if (tracked.length === 0) {
    return (
      <p className="el-find-msg">
        You’re not tracking anyone yet. Find a race above and hit <strong>＋ Track</strong>.
      </p>
    );
  }

  return (
    <ul className="el-cand-list">
      {tracked.map((c) => (
        <li key={c.id} className="el-cand">
          <Link className="el-cand-main" href={`/election-lens/candidate/${encodeURIComponent(c.id)}`}>
            <span className="el-cand-name">{c.name}</span>
            <span className="el-cand-meta">
              <span>{OFFICE_LABEL[c.office]}</span>
              <span>{stateName(c.state)}{c.district ? ` · Dist. ${c.district}` : ""}</span>
              {c.party && <span>{c.party}</span>}
            </span>
          </Link>
          <button
            className="el-track is-on"
            onClick={() => untrack(c)}
            disabled={busyId === c.id}
            aria-label={`Stop tracking ${c.name}`}
          >
            Tracking ✓
          </button>
        </li>
      ))}
    </ul>
  );
}
