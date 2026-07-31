import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";
import { TOPICS } from "@/lib/desks";

export const metadata: Metadata = { title: "RSS Feeds", description: "Subscribe to The Second Row in any reader." };

export default function RssPage() {
  return (
    <Prose kicker="RSS Feeds" title="Take the wire with you.">
      <p className="lede">
        The Second Row is built on open feeds — so of course we publish our own. Drop these into any reader.
      </p>
      <h2>The main feed</h2>
      <p>
        <Link href="/feed.xml" className="mono">/feed.xml</Link> — the top of the live board, refreshed every minute.
      </p>
      <h2>By section</h2>
      <p className="mono">Section feeds follow the desk system below; until per-section feeds ship, browse any section live:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "10px 0" }}>
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/topic/${t.slug}`} className="topic" style={{ ["--tc" as any]: t.accent, border: "1px solid var(--line)", borderRadius: 99, padding: "5px 11px" }}>
            {t.label}
          </Link>
        ))}
      </div>
      <p className="mono" style={{ marginTop: 16 }}>
        Prefer email? <Link href="/newsletters">Newsletters</Link> · prefer audio? <Link href="/podcasts">Podcasts</Link>.
      </p>
    </Prose>
  );
}
