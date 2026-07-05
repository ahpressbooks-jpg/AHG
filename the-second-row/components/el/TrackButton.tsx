"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Office } from "@/lib/candidateMeta";

export interface TrackTarget {
  id: string;
  name: string;
  office: Office;
  state: string;
  district?: string;
  party?: string;
}

// Track / untrack a candidate against the reader's seat. Standalone it fetches
// its own state; the finder feeds it initial state to avoid a fetch per row.
export default function TrackButton({
  candidate,
  initialTracked,
  initialSignedIn,
  onChange,
}: {
  candidate: TrackTarget;
  initialTracked?: boolean;
  initialSignedIn?: boolean;
  onChange?: (added: boolean) => void;
}) {
  const [signedIn, setSignedIn] = useState<boolean | undefined>(initialSignedIn);
  const [tracked, setTracked] = useState<boolean>(!!initialTracked);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialSignedIn !== undefined) {
      setSignedIn(initialSignedIn);
      setTracked(!!initialTracked);
      return;
    }
    let alive = true;
    fetch("/api/track", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setSignedIn(!!d.signedIn);
        setTracked(Array.isArray(d.tracked) && d.tracked.some((t: any) => t.id === candidate.id));
      })
      .catch(() => alive && setSignedIn(false));
    return () => {
      alive = false;
    };
  }, [candidate.id, initialSignedIn, initialTracked]);

  const toggle = async () => {
    if (busy) return;
    if (signedIn === false) {
      window.location.href = "/you";
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate }),
      });
      if (res.status === 401) {
        window.location.href = "/you";
        return;
      }
      const d = await res.json();
      setTracked(!!d.added);
      onChange?.(!!d.added);
    } catch {
      /* keep prior state on failure */
    } finally {
      setBusy(false);
    }
  };

  if (signedIn === false) {
    return (
      <Link className="el-track el-track--signin" href="/you">
        Sign in to track
      </Link>
    );
  }

  return (
    <button
      className={`el-track${tracked ? " is-on" : ""}`}
      onClick={toggle}
      disabled={busy || signedIn === undefined}
      aria-pressed={tracked}
      aria-label={tracked ? `Stop tracking ${candidate.name}` : `Track ${candidate.name}`}
    >
      {tracked ? "Tracking ✓" : "＋ Track"}
    </button>
  );
}
