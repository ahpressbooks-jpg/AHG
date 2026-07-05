"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COMPANY, HELP, LEGAL, PRODUCTS, TOPICS } from "@/lib/desks";

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
            <h3>Sections</h3>
            {TOPICS.map((t) => (
              <Link key={t.slug} href={`/topic/${t.slug}`} onClick={onClose} style={{ ["--tc" as any]: t.accent }}>
                <span className="mega-dot" style={{ background: t.accent }} />
                {t.label}
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>Desks &amp; products</h3>
            {PRODUCTS.map((p) => (
              <Link key={p.href + p.label} href={p.href} onClick={onClose}>
                {p.label}
                {p.sub && <span className="mc-sub">{p.sub}</span>}
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>Company</h3>
            {COMPANY.map((c) => (
              <Link key={c.href + c.label} href={c.href} onClick={onClose}>
                {c.label}
                {c.sub && <span className="mc-sub">{c.sub}</span>}
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>Help &amp; more</h3>
            {HELP.map((h) => (
              <Link key={h.href + h.label} href={h.href} onClick={onClose}>{h.label}</Link>
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
