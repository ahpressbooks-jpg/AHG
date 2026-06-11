import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Seat",
  description: "Why the second row — and what this platform sells instead of a side.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="/about" />
      <div className="wrap page">
        <div className="page-kicker">The Seat</div>
        <h1>You don&apos;t need the front of the room to be heard clearly.</h1>
        <p>
          You need a clear view and the nerve to describe it. The Second Row is an independent civic
          platform built for the people who walked off the team — the readers who refuse to belong
          to a side and are tired of being sold one.
        </p>
        <p>
          The seat is the idea: one row back from the stage, close enough to see everything, far
          enough back to see <em>all</em> of it. The front row buys belonging. The second row keeps
          its judgment.
        </p>

        <h2>What this platform won&apos;t sell</h2>
        <p>
          A team to join. A villain to hate. Flattery for your side. Certainty the desk
          doesn&apos;t have.
        </p>

        <h2>What it will</h2>
        <p>
          A clearer view of the news than either side will give you — that&apos;s the Wire and the
          Briefing. The framing made visible — that&apos;s the Spin Room. And a public, dated,
          scored record of the desk&apos;s own calls, misses included — that&apos;s the Ledger, and
          it&apos;s the whole bet. Not your agreement. Your judgment.
        </p>

        <h2>The tiers</h2>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>What it opens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>The Floor</strong></td>
              <td className="mono">Free</td>
              <td>The Wire, the daily Briefing, the Spin Room, open comments. The reason anyone trusts the rest.</td>
            </tr>
            <tr>
              <td><strong>Second Row Pro</strong></td>
              <td className="mono">$8/mo</td>
              <td>The full searchable archive, Steelman Saturday long-form, the workings behind each verdict, the Ledger&apos;s detail view. Ad-free, always.</td>
            </tr>
            <tr>
              <td><strong>Founding Member</strong></td>
              <td className="mono">$200/yr</td>
              <td>Everything in Pro · name in the founding roll · quarterly live Q&amp;A · a direct line for tips · first seat when The Room opens.</td>
            </tr>
          </tbody>
        </table>
        <p className="mono">
          Paid tiers open with the desk&apos;s daily cadence. The free Wire never goes behind a
          paywall — trust is the product; the subscription is just where some of it gets paid back.
        </p>
      </div>
    </>
  );
}
