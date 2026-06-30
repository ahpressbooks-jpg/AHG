"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ACCOUNT, LEGAL, NEWSROOM } from "@/lib/desks";
import { FEATURES } from "@/lib/instrument";

const LIVE = FEATURES.filter((f) => f.status === "live");
const SOON = FEATURES.filter((f) => f.status !== "live");

// THE MEGA-MENU — the full index in one overlay. Rendered through a portal to
// <body> so it is truly viewport-fixed (the masthead's backdrop-filter would
// otherwise trap a fixed child and make it open in the wrong place).
export default function MegaMenu({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="mega" role="dialog" aria-modal="true" aria-label="Sections and index">
      <div className="mega-bar">
        <div className="wrap mega-bar-inner">
          <Link href="/" className="mega-name" onClick={onClose}>THE SECOND ROW</Link>
          <button className="mega-close" onClick={onClose} aria-label="Close menu">Close ✕</button>
        </div>
      </div>
      <div className="mega-scroll">
        <div className="wrap mega-cols">
          <div className="mega-col">
            <h3>Live now</h3>
            {LIVE.map((f) => (
              <Link key={f.slug} href={`/instrument/${f.slug}`} onClick={onClose}>
                <span className="mega-dot" style={{ background: "#54c8b8" }} />
                {f.name}
                <span className="mc-sub">{f.tagline}</span>
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>In calibration &amp; design</h3>
            {SOON.map((f) => (
              <Link key={f.slug} href={`/instrument/${f.slug}`} onClick={onClose}>
                <span className="mega-dot" style={{ background: f.status === "calibrating" ? "#e6b450" : "#5b6471" }} />
                {f.name}
                <span className="mc-sub">{f.tagline}</span>
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>The newsroom</h3>
            {NEWSROOM.map((c) => (
              <Link key={c.href + c.label} href={c.href} onClick={onClose}>
                {c.label}
                {c.sub && <span className="mc-sub">{c.sub}</span>}
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>Account</h3>
            {ACCOUNT.map((a) => (
              <Link key={a.href + a.label} href={a.href} onClick={onClose}>
                {a.label}
                {a.sub && <span className="mc-sub">{a.sub}</span>}
              </Link>
            ))}
            <h3 style={{ marginTop: 24 }}>Legal</h3>
            {LEGAL.map((l) => (
              <Link key={l.href + l.label} href={l.href} onClick={onClose}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
