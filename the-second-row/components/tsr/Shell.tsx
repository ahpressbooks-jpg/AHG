"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPANY_NAV, FLOOR_NAV, WIRE_NAV } from "@/lib/tsrnav";
import Seal from "./Seal";

// THE GLOBAL SHELL — one company, two halves, taught at a glance. The two-tab
// switch (THE WIRE / THE FLOOR) is the most important nav element on the site:
// equal weight, active half marked by an oxblood underline. Sections opens a
// full-screen overlay. Ink Navy ground; used on the redesigned (Floor) surfaces.
export default function Shell({ active }: { active?: "wire" | "floor" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const tab = (label: string, href: string, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`font-mono text-[0.72rem] uppercase tracking-[0.22em] pb-1 border-b-2 ${
        on ? "text-cream border-oxblood" : "text-cream-55 border-transparent hover:text-cream"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-[color-mix(in_oklab,var(--color-ink)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3">
        <Link href="/" aria-label="The Second Row — home" className="flex items-center gap-2 text-cream">
          <Seal size={26} />
          <span className="hidden font-display text-[0.95rem] font-bold tracking-[0.02em] sm:inline">THE SECOND ROW</span>
        </Link>
        <nav aria-label="Halves" className="ml-2 flex items-center gap-5">
          {tab("The Wire", "/", active === "wire")}
          {tab("The Floor", "/floor", active === "floor")}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/search" aria-label="Search" className="text-cream-70 hover:text-cream">⌕</Link>
          <Link href="/subscribe" className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream-70 hover:text-cream sm:inline">
            Take your seat
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream border border-hairline-strong rounded-full px-3 py-1.5 hover:border-oxblood"
          >
            ☰ Sections
          </button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Sections" className="fixed inset-0 z-50 overflow-y-auto bg-ink">
          <div className="mx-auto max-w-6xl px-5 py-4">
            <div className="flex items-center">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-cream">
                <Seal size={24} />
                <span className="font-display text-sm font-bold tracking-[0.02em]">THE SECOND ROW</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close sections"
                className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream border border-hairline-strong rounded-full px-3 py-1.5 hover:border-oxblood"
              >
                Close ✕
              </button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 pb-16 sm:grid-cols-3">
              <SectionCol title="The Wire" links={WIRE_NAV} onNav={() => setOpen(false)} />
              <SectionCol title="The Floor" links={FLOOR_NAV} onNav={() => setOpen(false)} />
              <SectionCol title="Company" links={COMPANY_NAV} onNav={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function SectionCol({ title, links, onNav }: { title: string; links: { label: string; href: string }[]; onNav: () => void }) {
  return (
    <div>
      <h2 className="mono-label mb-3 border-b border-hairline pb-2 text-[0.62rem] text-oxblood">{title}</h2>
      <ul className="flex flex-col gap-1">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              onClick={onNav}
              className="block py-1.5 font-body text-[1.05rem] text-cream-70 hover:text-cream"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
