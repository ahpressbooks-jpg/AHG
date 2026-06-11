import type { Metadata } from "next";
import Link from "next/link";
import Mark from "@/components/Mark";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "The Company", description: "Founded at 21. No legacy to defend. No access to protect. Nothing to trade." };

export default function CompanyPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The Company · an independent news &amp; media company</div>
        <h1>Founded at 21.<br />No legacy to defend. No access to protect.</h1>
        <p className="lede" style={{ maxWidth: "68ch" }}>
          The Second Row was started by a 21-year-old with a seat one row back from the stage —
          close enough to see everything, far enough back to see <em>all</em> of it. The front row
          buys belonging. The second row keeps its judgment. Churchill called it &quot;an
          independent force in the world&quot;; we&apos;d add: oratory not from podiums alone, but
          from desks in the second row.
        </p>
        <p style={{ maxWidth: "68ch" }}>
          We won&apos;t sell a team to join, a villain to hate, flattery for your side, or
          certainty we don&apos;t have. We sell a clearer view of the news and the skill to reach
          your own verdict — and we prove it the only way that can&apos;t be faked:{" "}
          <strong>everything here keeps score on itself.</strong> The algorithm publishes its
          math. The board audits its own balance. The desk publishes its own misses. The company
          publishes its own books. Being young isn&apos;t the caveat; it&apos;s the reason we can
          afford to be this honest.
        </p>

        <div className="cards cards--3" style={{ marginTop: 30 }}>
          <div className="card">
            <div className="card-kicker">The algorithm</div>
            <h3><Link href="/gravity">GRAVITY</Link></h3>
            <p>Five signals, one score, published and reader-tunable. News that matters pulls harder.</p>
          </div>
          <div className="card">
            <div className="card-kicker">The self-audit</div>
            <h3><Link href="/tilt">The Tilt Meter</Link></h3>
            <p>Our sourcing balance, measured live — before a critic does it for us.</p>
          </div>
          <div className="card">
            <div className="card-kicker">Open books</div>
            <h3><Link href="/glass">The Glass Desk</Link></h3>
            <p>Audience, revenue, costs, error rate, uptime. In public, monthly, forever.</p>
          </div>
          <div className="card">
            <div className="card-kicker">The record</div>
            <h3><Link href="/ledger">The Ledger</Link></h3>
            <p>Every call dated, confidence-tagged, scored. Misses publish first.</p>
          </div>
          <div className="card">
            <div className="card-kicker">The memory</div>
            <h3><Link href="/rewind">The Rewind</Link></h3>
            <p>Every front page we&apos;ve ever run, replayable to the minute.</p>
          </div>
          <div className="card">
            <div className="card-kicker">The rules</div>
            <h3><Link href="/standards">Standards</Link> · <Link href="/method">Method</Link></h3>
            <p>Aggregation posture, corrections, accessibility, privacy — written down.</p>
          </div>
          <div className="card">
            <div className="card-kicker">Learn the method</div>
            <h3><Link href="/toolkit">The Toolkit</Link> · <Link href="/course">Think for Yourself</Link></h3>
            <p>Free primers now; the full course when the desk earns the right to teach it.</p>
          </div>
          <div className="card">
            <div className="card-kicker">In person</div>
            <h3><Link href="/room">The Room</Link></h3>
            <p>Live spin rooms and real debates — steelman on stage, not dunking.</p>
          </div>
          <div className="card">
            <div className="card-kicker">The believers</div>
            <h3><Link href="/founding">The Founding 500</Link> · <Link href="/press">Press</Link></h3>
            <p>The wall of the first 500 — and the kit for journalists writing about us.</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
          <Mark size={56} />
          <div>
            <p className="mono" style={{ margin: 0 }}>
              ONE ROW BACK · FULL VIEW · FOUNDED AT 21
            </p>
            <p style={{ margin: "4px 0 0" }}>
              The news is free. The depth is how it stays free. <Link href="/subscribe">The tiers →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
