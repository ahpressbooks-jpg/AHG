"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DESKS, TOPICS } from "@/lib/desks";

type Me = { name: string; tier: string; paid: boolean; seatColor?: string } | null;

// NAV v3 — a two-tier publication masthead. Row 1: the desks (bold section
// nav). Row 2: topic chips (utility) + the account cluster. Replaces the
// dropdown system with section-front logic.
export default function NavMenus({ current }: { current?: string }) {
  const [me, setMe] = useState<Me | undefined>(undefined);
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
      <nav className="wrap nav2-desks" aria-label="Desks">
        {DESKS.map((d) => (
          <Link key={d.href} href={d.href} aria-current={isCurrent(d.href) ? "page" : undefined} title={d.blurb}>
            {d.label}
          </Link>
        ))}
      </nav>
      <div className="wrap nav2-topics">
        <span className="nt-label">Topics</span>
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/topic/${t.slug}`} style={{ ["--nt-accent" as any]: t.accent }}>
            {t.label}
          </Link>
        ))}
        <div className="nav2-acct">
          <Link className="topic" href="/search" style={{ ["--tc" as any]: "var(--slate)" }} aria-label="Search">
            Search
          </Link>
          {me !== undefined &&
            (me ? (
              <>
                {!me.paid && (
                  <Link className="nav-join" href="/subscribe">
                    Go Pro
                  </Link>
                )}
                <Link
                  className="avatar"
                  href="/you"
                  style={me.seatColor ? { background: me.seatColor } : undefined}
                  aria-label={`Your seat — ${me.name}`}
                >
                  {me.name.slice(0, 1).toUpperCase()}
                </Link>
                <button
                  onClick={signOut}
                  className="topic"
                  style={{ ["--tc" as any]: "var(--slate)", background: "none", border: "none", cursor: "pointer" }}
                  aria-label="Sign out"
                >
                  Out
                </button>
              </>
            ) : (
              <>
                <Link className="nav-signin" href="/you">
                  Sign in
                </Link>
                <Link className="nav-join" href="/subscribe">
                  Subscribe
                </Link>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
