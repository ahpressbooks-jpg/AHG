import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Press", description: "The kit: who we are, the numbers, the angles, the assets." };

export default function PressPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Press kit</div>
        <h1>Writing about us? Here&apos;s everything.</h1>
        <p className="lede">
          The Second Row is an independent news &amp; media company founded by a 21-year-old: a
          live news board ranked by a published algorithm, a comment section ranked by minds
          changed instead of likes, and a newsroom that publishes its own error rate, balance
          telemetry, and books.
        </p>
        <h2>The angles that are actually true</h2>
        <table>
          <tbody>
            <tr><td className="mono">The anti-doomscroll</td><td>The front page has a bottom. &quot;You&apos;re caught up — go live your life&quot; is a designed feature, and the loyalty streak rewards finishing, not lingering.</td></tr>
            <tr><td className="mono">The glass algorithm</td><td>GRAVITY&apos;s math is published and reader-tunable at <Link href="/gravity">/gravity</Link> — drag the sliders, re-rank the live front page yourself.</td></tr>
            <tr><td className="mono">The self-audit</td><td><Link href="/tilt">The Tilt Meter</Link>: a newsroom publishing its own bias telemetry, live. Nobody else does this.</td></tr>
            <tr><td className="mono">The scored desk</td><td><Link href="/ledger">The Ledger</Link>: every prediction dated, confidence-tagged, and scored in public — misses first.</td></tr>
            <tr><td className="mono">Comments, fixed</td><td>No like button. Ranked by minds changed. Rebuttals pass a Steelman Gate. Takes can be sealed until the story resolves.</td></tr>
            <tr><td className="mono">21</td><td>No legacy to defend, no access to protect — the youth is the reason the transparency is affordable.</td></tr>
          </tbody>
        </table>
        <h2>Facts &amp; assets</h2>
        <p className="mono">
          Founded: 2026 · Founder: Noah Dean, 21 · HQ: the desk · Funding: reader-funded by design ·
          Numbers: live at <Link href="/glass">/glass</Link> · Logos &amp; marks: the row-and-dots
          system on this site (vector files by request) · Contact: the tip line published with the
          briefing.
        </p>
        <p>
          House style: &quot;The Second Row&quot; on first reference, &quot;TSR&quot; after. The
          tagline is punctuated exactly: <em>One row back. Full view.</em>
        </p>
      </div>
    </>
  );
}
