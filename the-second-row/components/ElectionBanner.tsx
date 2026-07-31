"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ===========================================================================
// ELECTION LENS — site-wide promo banner
// ---------------------------------------------------------------------------
// Appears on every page (mounted once in app/layout.tsx). To edit or retire:
//
//   • BANNER_TEXT / BANNER_HREF — the message and where it links.
//   • BANNER_END — the retire date. On/after this date the banner NEVER
//                  renders, so it retires itself when the election is over.
//                  Default 2026-11-04 (the day after Election Day).
//
//   • To kill it EARLY: set BANNER_END to a past date, OR simply delete the
//     <ElectionBanner /> line in app/layout.tsx.
//
// Dismissal is SESSION-ONLY (sessionStorage): it stays closed for the current
// browser tab session and returns on a fresh visit — matching the site's other
// banners. Brand accent (--pulse), never the FLASH orange reserved for alerts.
// ===========================================================================

const BANNER_END = "2026-11-04"; // YYYY-MM-DD — banner does not render on/after this date
const BANNER_TEXT = "2026 Election Lens — see how the choice is being made for you";
const BANNER_HREF = "/election-lens";
const STORAGE_KEY = "tsr_election_banner"; // session-only dismissal flag

function isRetired(): boolean {
  // Compare calendar dates so it retires at local midnight into the end date.
  const [y, m, d] = BANNER_END.split("-").map(Number);
  const end = new Date(y, (m ?? 1) - 1, d ?? 1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today >= end;
}

export default function ElectionBanner() {
  // Render nothing on the server / first paint; decide on the client (matches
  // the other banners and avoids any hydration mismatch).
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isRetired()) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "closed") return;
    } catch {}
    setShow(true);
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "closed");
    } catch {}
    setShow(false);
  };

  return (
    <aside className="el-banner" role="region" aria-label="2026 Election Lens">
      <Link className="el-banner-link" href={BANNER_HREF}>
        <span className="el-banner-tag" aria-hidden="true">NEW</span>
        <span className="el-banner-text">{BANNER_TEXT}</span>
        <span className="el-banner-go" aria-hidden="true">→</span>
      </Link>
      <button className="el-banner-close" onClick={close} aria-label="Dismiss the Election Lens banner">
        ✕
      </button>
    </aside>
  );
}
