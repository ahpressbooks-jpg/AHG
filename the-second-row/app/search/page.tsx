import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { FREE_LIMITS, isPaid, sessionUser } from "@/lib/auth";
import { getHouseLights } from "@/lib/ops";
import { allPosts, archiveIndex, deskCalls } from "@/lib/records";
import { loadBoard } from "@/lib/store";

export const metadata: Metadata = { title: "Search", description: "Across the board, the archive, the column, and the Ledger." };
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase().slice(0, 80);
  const [board, index, posts, calls, user, lights] = await Promise.all([
    loadBoard(),
    archiveIndex(2000),
    allPosts(),
    deskCalls(),
    sessionUser(),
    getHouseLights(),
  ]);
  const paid = isPaid(user) || lights;
  const cutoff = Date.now() - FREE_LIMITS.archiveDays * 86400_000;

  const hit = (s: string) => s.toLowerCase().includes(query);
  const live = query ? (board?.stories ?? []).filter((s) => hit(s.headline)) : [];
  const archived = query ? index.filter((r) => hit(r.headline) && !live.some((l) => l.id === r.id)) : [];
  const open = archived.filter((r) => paid || +new Date(r.at) > cutoff);
  const ropedCount = archived.length - open.length;
  const postHits = query ? posts.filter((p) => hit(p.title) || hit(p.dek) || hit(p.body)) : [];
  const callHits = query ? calls.filter((c) => hit(c.claim)) : [];
  const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <SiteHeader />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Search · the whole record</div>
        <h1>Find it on the record.</h1>
        <form method="GET" className="capture-form" style={{ maxWidth: 560 }}>
          <input className="input" type="search" name="q" defaultValue={q} placeholder="Stories, columns, Ledger calls…" aria-label="Search query" />
          <button className="btn" type="submit" style={{ borderRadius: 99 }}>Search</button>
        </form>

        {query && (
          <>
            <h2>On the board now ({live.length})</h2>
            {live.map((s) => (
              <p key={s.id}><Link href={`/wire/${s.id}`}>{s.headline}</Link> <span className="mono" style={{ color: "var(--slate)" }}>· {s.tier} · {s.score}</span></p>
            ))}

            <h2>The archive ({open.length}{ropedCount > 0 ? ` open` : ""})</h2>
            {open.slice(0, 40).map((r) => (
              <p key={r.id}><Link href={`/wire/${r.id}`}>{r.headline}</Link> <span className="mono" style={{ color: "var(--slate)" }}>· {fmt(r.at)}</span></p>
            ))}
            {ropedCount > 0 && (
              <div className="rope">
                <div className="rope-kicker">The Velvet Rope</div>
                <p>{ropedCount} more match{ropedCount === 1 ? "" : "es"} deeper than {FREE_LIMITS.archiveDays} days. The full archive is Pro.</p>
                <Link className="btn btn--maroon" href="/subscribe">Open the archive — $8/mo</Link>
              </div>
            )}

            {postHits.length > 0 && (
              <>
                <h2>From the Second Row ({postHits.length})</h2>
                {postHits.map((p) => (
                  <p key={p.slug}><Link href={`/column/${p.slug}`}>{p.title}</Link> <span className="mono" style={{ color: "var(--slate)" }}>· {fmt(p.publishedAt)}</span></p>
                ))}
              </>
            )}
            {callHits.length > 0 && (
              <>
                <h2>The Ledger ({callHits.length})</h2>
                {callHits.map((c) => (
                  <p key={c.id}>{c.claim} <span className={`mono ${c.result === "HIT" ? "ledger-hit" : c.result === "MISS" ? "ledger-miss" : "ledger-open"}`}>· {c.result ?? "OPEN"}</span></p>
                ))}
              </>
            )}
            {live.length + open.length + postHits.length + callHits.length === 0 && (
              <p className="mono">Nothing on the record for “{q}”. The record only goes back to the engine&apos;s first run.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
