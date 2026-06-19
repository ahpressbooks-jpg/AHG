"use client";

import { useEffect, useState } from "react";

// JUNETEENTH BANNER — a massive top-of-site band that lights up on June 19
// (any year, the visitor's local clock decides), is closable, and expires on
// its own at local midnight into June 20.
export default function JuneteenthBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const isJuneteenth = now.getMonth() === 5 && now.getDate() === 19; // June = 5
      if (!isJuneteenth) {
        setShow(false);
        return;
      }
      try {
        if (sessionStorage.getItem("tsr_jt_closed") === "1") return;
      } catch {}
      setShow(true);
    };
    check();

    // Auto-expire exactly at the next local midnight (tomorrow, 12:00am).
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const t = setTimeout(() => setShow(false), Math.max(0, midnight.getTime() - now.getTime()));
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      sessionStorage.setItem("tsr_jt_closed", "1");
    } catch {}
    setShow(false);
  };

  return (
    <aside className="jt-banner" role="region" aria-label="Juneteenth">
      <span className="jt-flag" aria-hidden="true" />
      <div className="jt-text">
        <span className="jt-title">JUNETEENTH</span>
        <span className="jt-sub">Freedom Day · June 19 · the day the news finally reached everyone</span>
      </div>
      <span className="jt-flag jt-flag--r" aria-hidden="true" />
      <button className="jt-close" onClick={close} aria-label="Close the Juneteenth banner">
        ✕
      </button>
    </aside>
  );
}
