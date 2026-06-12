"use client";

import { useEffect, useState } from "react";
import { PRIMERS } from "@/lib/toolkit";

// THE TOOLKIT BANNER — greets every visit with one free lesson (rotating).
// Closable with one tap; stays closed for the session; returns next visit.
export default function ToolkitBanner() {
  const [primer, setPrimer] = useState<(typeof PRIMERS)[number] | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("tsr_toolkit_banner") === "closed") return;
      // Rotate by day so a returning visitor sees the lessons in sequence.
      const pick = PRIMERS[Math.floor(Date.now() / 86400_000) % PRIMERS.length];
      const t = setTimeout(() => setPrimer(pick), 1800);
      return () => clearTimeout(t);
    } catch {}
  }, []);

  if (!primer) return null;

  const close = () => {
    try {
      sessionStorage.setItem("tsr_toolkit_banner", "closed");
    } catch {}
    setPrimer(null);
  };

  return (
    <aside className="toolkit-banner" role="complementary" aria-label="Free lesson from the Toolkit">
      <button className="tb-close" onClick={close} aria-label="Close this banner">✕</button>
      <div className="tb-kicker">From the Toolkit · free · {primer.minutes} min</div>
      <a className="tb-title" href={`/toolkit/${primer.slug}`} onClick={close}>
        {primer.title} →
      </a>
      <p className="tb-tease">{primer.tease}</p>
    </aside>
  );
}
