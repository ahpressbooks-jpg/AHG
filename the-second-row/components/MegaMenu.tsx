"use client";

import Link from "next/link";
import { useEffect } from "react";
import { COMPANY, HELP, LEGAL, PRODUCTS, TOPICS } from "@/lib/desks";

// THE MEGA-MENU — the full publication index in one overlay. The menu that
// supports the whole site: every section, product, company, help, and legal page.
export default function MegaMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="mega" role="dialog" aria-modal="true" aria-label="Sections & index">
      <div className="mega-inner">
        <div className="mega-top">
          <span className="mega-name">THE SECOND ROW</span>
          <button className="megabtn" onClick={onClose} aria-label="Close menu">✕ Close</button>
        </div>
        <div className="mega-cols">
          <div className="mega-col">
            <h3>Sections</h3>
            {TOPICS.map((t) => (
              <Link key={t.slug} href={`/topic/${t.slug}`} onClick={onClose}>
                {t.label}
              </Link>
            ))}
          </div>
          <div className="mega-col">
            <h3>Desks & Products</h3>
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
            <h3>Help &amp; More</h3>
            {HELP.map((h) => (
              <Link key={h.href + h.label} href={h.href} onClick={onClose}>
                {h.label}
              </Link>
            ))}
            <h3 style={{ marginTop: 22 }}>Legal</h3>
            {LEGAL.map((l) => (
              <Link key={l.href + l.label} href={l.href} onClick={onClose}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
