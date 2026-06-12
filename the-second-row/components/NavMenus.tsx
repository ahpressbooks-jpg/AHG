"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// NAV v3 — the six mains with dropdowns, the profile spot, and the Go Pro
// button. Used by both the Wire's masthead and every other page's header.

const MENUS: { label: string; href: string; items: [string, string][] }[] = [
  {
    label: "The Wire",
    href: "/",
    items: [
      ["Search the record", "/search"],
      ["The Rewind — replay the board", "/rewind"],
      ["The Third Act — how stories ended", "/third-act"],
    ],
  },
  { label: "Today", href: "/today", items: [] },
  { label: "Spin Room", href: "/spin", items: [] },
  { label: "Ledger", href: "/ledger", items: [] },
  { label: "Column", href: "/column", items: [] },
  {
    label: "Company",
    href: "/company",
    items: [
      ["GRAVITY — the algorithm", "/gravity"],
      ["The Tilt Meter", "/tilt"],
      ["The Glass Desk — open books", "/glass"],
      ["The Toolkit — free primers", "/toolkit"],
      ["Think for Yourself — the course", "/course"],
      ["The Room — live events", "/room"],
      ["The Founding 500", "/founding"],
      ["Press kit", "/press"],
      ["Standards", "/standards"],
      ["The Method", "/method"],
    ],
  },
];

type Me = { name: string; tier: string; paid: boolean; seatColor?: string } | null;

export default function NavMenus({ current }: { current?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [me, setMe] = useState<Me | undefined>(undefined);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d?.user ?? null))
      .catch(() => setMe(null));
  }, []);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const signOut = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.reload();
  };

  return (
    <nav className="wrap navbar" aria-label="Sections" ref={ref as any}>
      {MENUS.map((m) => (
        <div key={m.href} className="navdd" data-open={open === m.href}>
          {m.items.length === 0 ? (
            <Link className="navdd-top" href={m.href} aria-current={current === m.href ? "page" : undefined}>
              {m.label}
            </Link>
          ) : (
            <>
              <button
                className="navdd-top"
                aria-current={current === m.href ? "page" : undefined}
                aria-expanded={open === m.href}
                aria-haspopup="true"
                onClick={() => setOpen(open === m.href ? null : m.href)}
              >
                {m.label} <span className="navdd-caret">▾</span>
              </button>
              <div className="navdd-menu" role="menu">
                <Link href={m.href} role="menuitem" onClick={() => setOpen(null)}>
                  {m.label} — the main page
                </Link>
                <div className="navdd-section">Inside</div>
                {m.items.map(([label, href]) => (
                  <Link key={href} href={href} role="menuitem" onClick={() => setOpen(null)}>
                    {label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      <span className="nav-spacer" />

      {me !== undefined &&
        (me ? (
          <>
            {!me.paid && (
              <Link className="nav-join" href="/subscribe">
                Go Pro
              </Link>
            )}
            <div className="navdd nav-account" data-open={open === "me"}>
              <button
                className="avatar"
                style={me.seatColor ? { background: me.seatColor } : undefined}
                aria-label={`Your seat — ${me.name}`}
                aria-expanded={open === "me"}
                aria-haspopup="true"
                onClick={() => setOpen(open === "me" ? null : "me")}
              >
                {me.name.slice(0, 1).toUpperCase()}
              </button>
              <div className="navdd-menu" role="menu">
                <div className="navdd-section">
                  {me.name} · {me.tier === "founding" ? "Founding" : me.tier === "pro" ? "Pro" : "The Floor"}
                </div>
                <Link href="/you" role="menuitem" onClick={() => setOpen(null)}>
                  Your Seat — profile, clippings, calls
                </Link>
                <Link href="/subscribe" role="menuitem" onClick={() => setOpen(null)}>
                  {me.paid ? "Your membership" : "Become a member"}
                </Link>
                <a
                  href="#"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link className="nav-signin" href="/you">
              Sign in
            </Link>
            <Link className="nav-join" href="/subscribe">
              Become a member
            </Link>
          </>
        ))}
    </nav>
  );
}
