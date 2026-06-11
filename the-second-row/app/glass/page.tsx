import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { foundingWall, listLen } from "@/lib/glassdata";

export const metadata: Metadata = { title: "The Glass Desk", description: "Open books: the company's real numbers, published. Show the work — applied to ourselves." };
export const dynamic = "force-dynamic";

export default async function GlassPage() {
  const { founding, seats, users, sweeps } = await foundingWall();

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Glass Desk · open books</div>
        <h1>The numbers, in public. All of them.</h1>
        <p className="lede">
          &quot;Show the work&quot; applied to the company itself. A 21-year-old founder with
          nothing to hide publishes the dashboard investors usually see: audience, revenue,
          costs, error rate, uptime. Updated automatically where the systems allow, monthly by
          hand where they don&apos;t.
        </p>

        <div className="cards cards--3">
          <div className="card"><span className="stat"><span className="stat-num">{users}</span><span className="stat-label">seats taken (accounts)</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{seats}</span><span className="stat-label">on the free list</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{founding}</span><span className="stat-label">founding members of 500</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{sweeps}</span><span className="stat-label">board sweeps logged</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">$0</span><span className="stat-label">revenue — till opens at launch; Stripe totals publish here automatically</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">~$45/mo</span><span className="stat-label">running costs at launch scale (hosting + data) — itemized monthly</span></span></div>
        </div>

        <h2>The standing disclosures</h2>
        <table>
          <tbody>
            <tr><td className="mono">Error rate</td><td>The Ledger&apos;s public tally — hits, misses, and open calls — <Link href="/ledger">is the error rate</Link>. Misses publish first.</td></tr>
            <tr><td className="mono">Uptime</td><td>Every sweep is logged with its duration and failures; a late sweep says so on the page itself.</td></tr>
            <tr><td className="mono">Money</td><td>Reader-funded by design. If sponsorship ever runs: disclosed in full, capped, never touching what a story says or where it sits.</td></tr>
            <tr><td className="mono">Balance</td><td><Link href="/tilt">The Tilt Meter</Link> audits the board&apos;s sourcing live.</td></tr>
            <tr><td className="mono">The algorithm</td><td><Link href="/gravity">GRAVITY</Link> — published, versioned, reader-tunable.</td></tr>
          </tbody>
        </table>

        <p className="mono">
          Monthly snapshots of this page are frozen and archived so the history can&apos;t be
          quietly rewritten — the Glass Desk keeps its own ledger.
        </p>
      </div>
    </>
  );
}
