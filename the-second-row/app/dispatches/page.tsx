import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { allPosts, getNote } from "@/lib/records";

export const metadata: Metadata = { title: "Dispatches", description: "Daily from the desk — short arguments, editor's notes, and the day-to-day thinking behind TSR." };
export const dynamic = "force-dynamic";

const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export default async function DispatchesPage() {
  const [posts, note] = await Promise.all([allPosts(), getNote()]);
  // Dispatches = the desk's short-form: notes + anything not a long column.
  const dispatches = posts.filter((p) => p.kind === "note" || p.kind === "dispatch");

  return (
    <>
      <SiteHeader current="/dispatches" />
      <main className="wrap wrap--reading page">
        <div className="page-kicker" style={{ color: "var(--pulse)" }}>Dispatches · daily from the desk</div>
        <h1>The day-to-day thinking, in the open.</h1>
        <p className="lede">
          Shorter and more frequent than the main reporting: quick arguments, editor&apos;s notes,
          corrections in progress, and the reasoning behind what TSR is working on. Personal in voice,
          institutional in standard — every dispatch is labeled <span className="mode mode--dispatch">Dispatch</span>.
        </p>

        {note?.text && (
          <div className="dispatch-row" style={{ borderTop: "2px solid var(--ink)" }}>
            <div className="d-when">Today<br /><span style={{ color: "var(--pulse)" }}>● latest</span></div>
            <div>
              <span className="mode mode--dispatch" style={{ marginBottom: 8, display: "inline-block" }}>Dispatch</span>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", lineHeight: 1.5, whiteSpace: "pre-wrap", margin: 0 }}>{note.text}</p>
              <p className="mono" style={{ color: "var(--slate)", marginTop: 8 }}>— from the desk</p>
            </div>
          </div>
        )}

        {dispatches.length > 0 ? (
          <div className="dispatches">
            {dispatches.map((p) => (
              <div key={p.slug} className="dispatch-row">
                <div className="d-when">{fmt(p.publishedAt)}</div>
                <div>
                  <h3><Link href={`/column/${p.slug}`}>{p.title}</Link></h3>
                  {p.dek && <p>{p.dek}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !note?.text && (
            <div className="action-boundary" style={{ borderStyle: "solid" }}>
              The first dispatches publish here. The desk writes them from the Control Room; the daily
              briefing lives at <Link href="/today">Today</Link>, and longer pieces at{" "}
              <Link href="/column">From the Second Row</Link>.
            </div>
          )
        )}

        <p className="mono" style={{ marginTop: 26, color: "var(--slate)" }}>
          Longer-form reporting &amp; analysis: <Link href="/column">the column</Link> · what&apos;s moving now:{" "}
          <Link href="/wire">the Wire</Link>.
        </p>
      </main>
    </>
  );
}
