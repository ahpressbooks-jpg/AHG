import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { TierButtons } from "@/components/TierButtons";
import { stripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = { title: "Subscribe", description: "The news is free. The depth is how it stays free." };
export const dynamic = "force-dynamic";

export default function SubscribePage() {
  const live = stripeConfigured();
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The tiers</div>
        <h1>First: everything we refuse to charge for.</h1>
        <p className="lede" style={{ maxWidth: "70ch" }}>
          The live Wire. Today&apos;s briefing. The Spin Room. FLASH coverage. Story dossiers for
          30 days. The Ledger&apos;s tally. Comments, sealed takes, your calls and Judgment Score.
          The Toolkit. GRAVITY&apos;s math, the Tilt Meter, the Glass Desk, the sweep log.{" "}
          <strong>The news is never behind the wall — that&apos;s the whole point of the place.</strong>{" "}
          What&apos;s sold is depth, history, and access. The depth is how the news stays free.
        </p>

        <TierButtons live={live} />

        <h2>The fine print, in plain English</h2>
        <table>
          <tbody>
            <tr><td className="mono">Cancel</td><td>Two taps, self-serve, no guilt screens. Access runs to the period end.</td></tr>
            <tr><td className="mono">Downgrade</td><td>Nothing is ever deleted. Clippings, comments, scores — all keep. The 11th clip just waits for you.</td></tr>
            <tr><td className="mono">Refunds</td><td>14 days, no questions.</td></tr>
            <tr><td className="mono">Renewal</td><td>Auto-renews; disclosed at checkout; receipts by email.</td></tr>
            <tr><td className="mono">Crisis</td><td>During a major civic emergency the entire archive opens free (the House Lights protocol), logged in public.</td></tr>
            <tr><td className="mono">Prices</td><td>Early members keep their price forever, even when prices change.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
