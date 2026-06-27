"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MegaMenu from "@/components/MegaMenu";
import { DESKS } from "@/lib/desks";

type Me = { name: string; tier: string; paid: boolean; seatColor?: string } | null;

// NAV — one clean section bar: a Sections trigger (mega-menu), the desks, and
// the account cluster. Topics live in the mega-menu and footer to keep this row
// uncluttered and scannable.
export default function NavMenus({ current }: { current?: string }) {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const [mega, setMega] = useState(false);
  const pathname = usePathname();
  const here = current ?? pathname ?? "/";

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d?.user ?? null))
      .catch(() => setMe(null));
  }, []);

  const signOut = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.reload();
  };

  const isCurrent = (href: string) => (href === "/" ? here === "/" : here.startsWith(href));

  return (
    <div className="nav2">
      <nav className="wrap nav2-bar" aria-label="Sections">
        <button className="nav2-burger" onClick={() => setMega(true)} aria-label="Open all sections" aria-haspopup="dialog">
          <span aria-hidden="true">☰</span> Sections
        </button>
        <div className="nav2-links">
          {DESKS.map((d) => (
            <Link key={d.href} href={d.href} aria-current={isCurrent(d.href) ? "page" : undefined} title={d.blurb}>
              {d.label}
            </Link>
          ))}
        </div>
        <div className="nav2-acct">
          <Link href="/search" className="nav2-ico" aria-label="Search" title="Search">⌕</Link>
          <Link className="nav-admin" href="/admin" title="Back Office (password required)">Admin</Link>
          {me !== undefined &&
            (me ? (
              <>
                {!me.paid && (
                  <Link className="nav-join" href="/subscribe">Subscribe</Link>
                )}
                <Link
                  className="avatar"
                  href="/you"
                  style={me.seatColor ? { background: me.seatColor } : undefined}
                  aria-label={`Your seat — ${me.name}`}
                  title="Your Seat"
                >
                  {me.name.slice(0, 1).toUpperCase()}
                </Link>
                <button onClick={signOut} className="nav2-out" aria-label="Sign out" title="Sign out">Out</button>
              </>
            ) : (
              <>
                <Link className="nav-signin" href="/you">Sign in</Link>
                <Link className="nav-join" href="/subscribe">Subscribe</Link>
              </>
            ))}
        </div>
      </nav>
      {mega && <MegaMenu onClose={() => setMega(false)} />}
    </div>
  );
}
