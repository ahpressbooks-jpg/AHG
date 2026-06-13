import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getHourlySnapshots, getSnapshots } from "@/lib/records";

export const dynamic = "force-dynamic";

const tierColor: Record<string, string> = { FLASH: "var(--orange)", BULLETIN: "var(--maroon-row)", URGENT: "var(--ink)", DEVELOPING: "var(--slate)", BRIEF: "var(--ink-3)" };

// THE RECEIPT — the board exactly as it stood at a moment, by sweep version.
// Screenshot-proof: a permalink to a frozen front page, from the Rewind tape.
export default async function ReceiptPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const v = Number(version);
  const snaps = [...(await getSnapshots()), ...(await getHourlySnapshots())];
  const snap = snaps.find((s) => s.version === v);

  if (!snap) {
    return (
      <>
        <SiteHeader />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">The Receipt</div>
          <h1>That receipt has scrolled off the tape.</h1>
          <p>Receipts are kept as long as the Rewind tape runs. <Link href="/rewind">Open the Rewind</Link> to find a moment, or <Link href="/">the live board</Link>.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Receipt · sweep v{snap.version} · a frozen front page</div>
        <h1>The board, exactly as it stood.</h1>
        <p className="rewind-stamp" suppressHydrationWarning>
          {new Date(snap.at).toLocaleString([], { weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="lede">
          Not a screenshot — a permalink. This is the real board state at that minute, kept on the
          record so a share can never be doctored. When someone says &quot;that&apos;s not what the
          news said,&quot; this is what the news said.
        </p>
        <div style={{ margin: "16px 0" }}>
          {snap.stories.map((s, i) => (
            <div key={s.id + i} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="mono" style={{ fontSize: "0.6rem", color: tierColor[s.tier] ?? "var(--ink)", width: 80, flexShrink: 0, letterSpacing: "0.08em" }}>{s.tier}</span>
              <Link href={`/wire/${s.id}`} style={{ textDecoration: "none", fontFamily: i === 0 ? "var(--serif)" : "var(--sans)", fontSize: i === 0 ? "1.25rem" : "0.92rem", fontWeight: 600 }}>{s.headline}</Link>
              <span className="mono" style={{ marginLeft: "auto", fontSize: "0.62rem", color: "var(--pulse)" }}>{s.score}</span>
            </div>
          ))}
        </div>
        <p className="mono" style={{ color: "var(--slate)" }}>
          Powered by <Link href="/rewind">the Rewind</Link> · one row back, full view.
        </p>
      </div>
    </>
  );
}
