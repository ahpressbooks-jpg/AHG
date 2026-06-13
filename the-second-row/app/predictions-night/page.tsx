import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { predictionsState } from "@/lib/extras";

export const metadata: Metadata = { title: "Predictions Night", description: "Once a year, everyone seals a take about the year ahead. A year later, every seal opens at once." };
export const dynamic = "force-dynamic";

export default async function PredictionsNightPage() {
  const { open, year } = await predictionsState();
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Predictions Night · the annual seal</div>
        <h1>Seal your year. Open it next year.</h1>
        <p className="lede">
          One night a year, the whole room writes a prediction about the year ahead and{" "}
          <strong>seals</strong> it. Twelve months later, on the next Predictions Night, every seal
          in the building opens at once — and we all find out who actually saw it coming. The
          ultimate Ledger entry: no edits, no hindsight, a full year of reality as the judge.
        </p>

        <div className="card" style={{ borderLeft: `3px solid ${open ? "var(--verdict)" : "var(--slate)"}`, margin: "16px 0" }}>
          <div className="card-kicker" style={{ color: open ? "var(--verdict)" : "var(--slate)" }}>
            {open ? `Predictions Night ${year} is OPEN` : "The seal window is closed right now"}
          </div>
          {open ? (
            <>
              <p>Tonight&apos;s the night. Make a call on any live story and check <strong>&quot;seal until resolution&quot;</strong> — or pick the year&apos;s big story below and seal a take in its comments. It stays hidden until next Predictions Night.</p>
              <Link className="btn btn--maroon" href="/">Go to the board →</Link>
            </>
          ) : (
            <p>The desk opens the window once a year (and announces it on the Wire and by email). Until then, you can still seal a take on any individual story the moment it&apos;s developing — that seal opens when <em>that</em> story resolves. <Link href="/toolkit/the-steelman">Sharpen up</Link> while you wait.</p>
          )}
        </div>

        <h2>Why sealed</h2>
        <p>
          Memory is the enemy of honest scorekeeping — everyone &quot;knew it all along.&quot; A
          sealed take can&apos;t be quietly upgraded or forgotten. It&apos;s the same mechanism the
          room uses on developing stories (<Link href="/toolkit">the Toolkit</Link> explains it),
          pointed at the biggest clock there is: the year.
        </p>
      </div>
    </>
  );
}
