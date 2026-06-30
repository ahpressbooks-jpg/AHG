"use client";

import Link from "next/link";
import { useState } from "react";
import MegaMenu from "@/components/MegaMenu";

// THE INSTRUMENT — masthead. The dark control-room chrome. Keeps the brand and
// the mega-menu's open behavior; the index button is the only way in, kept
// deliberately quiet so the board is the loudest thing on the page.
export default function Shell() {
  const [mega, setMega] = useState(false);
  return (
    <header className="inst-top">
      <div className="wrap inst-top-in">
        <Link href="/" className="inst-brand" aria-label="The Second Row — home">
          <span className="inst-mk" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" focusable="false">
              <rect x="30" y="27" width="40" height="7" rx="3.5" fill="currentColor" opacity="0.45" />
              <rect x="23" y="44" width="54" height="11" rx="5.5" fill="#54c8b8" />
              <rect x="34" y="65" width="32" height="6" rx="3" fill="currentColor" opacity="0.28" />
            </svg>
          </span>
          <b>THE SECOND ROW</b>
          <span className="inst-sub" aria-hidden="true">THE INSTRUMENT</span>
        </Link>
        <div className="inst-ix">
          <Link href="/wire" className="inst-btn">The Wire</Link>
          <button
            className="inst-btn inst-btn--solid"
            onClick={() => setMega(true)}
            aria-haspopup="dialog"
            aria-label="Open the index"
          >
            ☰ Index
          </button>
        </div>
      </div>
      {mega && <MegaMenu onClose={() => setMega(false)} />}
    </header>
  );
}
