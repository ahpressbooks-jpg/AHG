"use client";

import { useEffect, useState } from "react";

// YOUR TILT — the Tilt Meter pointed at yourself. Stored ONLY in your
// browser's localStorage; it never leaves your device, by design.

export function TiltLogger({ id, L, C, R }: { id: string; L: number; C: number; R: number }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tsr_reads");
      const reads: { id: string; L: number; C: number; R: number; at: number }[] = raw ? JSON.parse(raw) : [];
      if (!reads.some((r) => r.id === id)) {
        reads.unshift({ id, L, C, R, at: Date.now() });
        localStorage.setItem("tsr_reads", JSON.stringify(reads.slice(0, 200)));
      }
    } catch {}
  }, [id, L, C, R]);
  return null;
}

const COLORS = { L: "#2E5BFF", C: "#9AA6B2", R: "#8A1F35" } as const;

export function YourTilt() {
  const [mix, setMix] = useState<{ L: number; C: number; R: number; n: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tsr_reads");
      const reads: { L: number; C: number; R: number; at: number }[] = raw ? JSON.parse(raw) : [];
      const week = reads.filter((r) => Date.now() - r.at < 7 * 86400_000);
      const m = { L: 0, C: 0, R: 0, n: week.length };
      for (const r of week) {
        m.L += r.L;
        m.C += r.C;
        m.R += r.R;
      }
      setMix(m);
    } catch {
      setMix({ L: 0, C: 0, R: 0, n: 0 });
    }
  }, []);

  if (!mix) return null;
  const total = Math.max(1, mix.L + mix.C + mix.R);
  const drift = (mix.R - mix.L) / total;
  const verdict =
    mix.n === 0 ? "no reads logged yet" : Math.abs(drift) < 0.12 ? "balanced reading" : drift > 0 ? `leaning right ${(drift * 100).toFixed(0)}%` : `leaning left ${(Math.abs(drift) * 100).toFixed(0)}%`;

  return (
    <div className="card" style={{ margin: "16px 0" }}>
      <div className="card-kicker">Your Tilt · private — this never leaves your browser</div>
      <div className="tiltbar" role="img" aria-label={`your reading: left ${mix.L}, center ${mix.C}, right ${mix.R}`}>
        <span style={{ width: `${(mix.L / total) * 100}%`, background: COLORS.L }} />
        <span style={{ width: `${(mix.C / total) * 100}%`, background: COLORS.C }} />
        <span style={{ width: `${(mix.R / total) * 100}%`, background: COLORS.R }} />
      </div>
      <p className="mono" style={{ margin: "8px 0 0", color: "var(--slate)" }}>
        {mix.n} dossiers read this week · {verdict} · the mirror the feed never shows you
      </p>
    </div>
  );
}
