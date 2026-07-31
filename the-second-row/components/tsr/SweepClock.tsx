"use client";

import { useEffect, useState } from "react";

// SWEEP CLOCK — counts down to the next sweep. The board is alive but calm:
// this dot is the ONLY thing that pulses in the whole interface, and it stops
// under prefers-reduced-motion. The Wire sweeps every 60s; the Floor every 4h.
export default function SweepClock({
  intervalSec = 60,
  label = "NEXT SWEEP",
}: {
  intervalSec?: number;
  label?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining =
    now === null ? null : intervalSec - (Math.floor(now / 1000) % intervalSec);

  const display =
    remaining === null
      ? "—"
      : intervalSec >= 3600
        ? `${Math.floor(remaining / 3600)}h ${Math.floor((remaining % 3600) / 60)}m`
        : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cream-70"
      aria-label={`${label.toLowerCase()} in ${display}`}
      suppressHydrationWarning
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-oxblood motion-safe:animate-pulse"
      />
      {label} {display}
    </span>
  );
}
