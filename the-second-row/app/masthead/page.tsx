import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Masthead", description: "The newsroom behind The Second Row." };

export default function MastheadPage() {
  return (
    <Prose kicker="The Newsroom" title="Masthead">
      <p className="lede">
        The Second Row is founder-led and built in the open. We&apos;d rather show you exactly who&apos;s
        accountable than hide behind an institutional voice.
      </p>
      <h2>The desk</h2>
      <table>
        <tbody>
          <tr><td className="mono">Founder &amp; Editor</td><td>Noah Dean — sets the method, writes the column, owns the Ledger.</td></tr>
          <tr><td className="mono">The Wire</td><td>The ranking engine (<Link href="/gravity">GRAVITY</Link>), run continuously and audited at <Link href="/method">the Method</Link>.</td></tr>
          <tr><td className="mono">Standards</td><td>Corrections, ethics, and aggregation posture live in <Link href="/standards">Standards &amp; Ethics</Link>.</td></tr>
          <tr><td className="mono">The Assignment Desk</td><td>Reader-directed investigations — you decide what gets dug into.</td></tr>
        </tbody>
      </table>
      <h2>Growing the masthead</h2>
      <p>
        We&apos;re adding contributors deliberately, not for scale. If you report, analyze, or build and the
        method resonates, the door is <Link href="/careers">here</Link>. Founding Members are listed on{" "}
        <Link href="/founding">the Founding 500</Link> wall — the first people who bet early.
      </p>
    </Prose>
  );
}
