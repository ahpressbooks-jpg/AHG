import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { METHOD_VERSION } from "@/lib/score";
import { ROSTER } from "@/lib/sources";

export const metadata: Metadata = {
  title: "The Method",
  description: "How the board ranks the news — published, versioned, and changelogged.",
};

export default function MethodPage() {
  const owners = [...new Set(ROSTER.map((r) => r.owner))];
  return (
    <>
      <SiteHeader />
      <div className="wrap page">
        <div className="page-kicker">The Method · Board {METHOD_VERSION}</div>
        <h1>The algorithm shows its work. Here it is.</h1>
        <p>
          Every editorial product asks to be trusted. This one publishes its scoring instead. The
          board below is the method that seats every story on the Wire; when it changes, the version
          number changes, and the change is logged here.
        </p>

        <h2>The 60-second loop</h2>
        <p className="mono">
          DETECT — poll the roster&apos;s public feeds (every 60s) →{" "}
          RESOLVE — cluster items: one story, many sources →{" "}
          TRIAGE — score and tag each cluster →{" "}
          SEAT — assign tiers with hysteresis and a bump budget →{" "}
          PUBLISH — every open browser re-seats within seconds.
        </p>

        <h2>The score (0–100)</h2>
        <p>
          The score is <strong>GRAVITY</strong>: corroboration 25 · velocity 20 · consequence 25 ·
          power 15 · freshness 15. The full math — with the rubric for consequence and power, and
          the sliders to re-rank the live board yourself — is published at{" "}
          <a href="/gravity">/gravity</a>.
        </p>

        <h2>The tiers</h2>
        <table>
          <thead>
            <tr><th>Tier</th><th>Gate</th></tr>
          </thead>
          <tbody>
            <tr><td className="mono">FLASH</td><td>Score ≥ 85 <em>and</em> ≥ 5 independent owners <em>and</em> under two hours old. Machine-raised flashes are labeled <strong>machine-seated</strong> until the desk confirms. A flash with no new development steps down on its own within 45 minutes. Orange appears on this site for FLASH and for nothing else.</td></tr>
            <tr><td className="mono">BULLETIN</td><td>Score ≥ 70, held across consecutive sweeps.</td></tr>
            <tr><td className="mono">URGENT</td><td>Score ≥ 55.</td></tr>
            <tr><td className="mono">DEVELOPING</td><td>Score ≥ 40.</td></tr>
            <tr><td className="mono">BRIEF</td><td>Everything else the wire carried. Ages off the board within hours.</td></tr>
          </tbody>
        </table>
        <p>
          <strong>Hysteresis:</strong> promotion requires clearing a threshold and holding it across
          sweeps; demotion requires falling clearly below it. <strong>Bump budget:</strong> at most
          six re-seats per sweep beyond new arrivals. The board moves like a newsroom, not a stock
          ticker.
        </p>

        <h2>Certainty tags are coverage math, not verdicts</h2>
        <table>
          <thead>
            <tr><th>Tag</th><th>Definition</th></tr>
          </thead>
          <tbody>
            <tr><td className="mono">CONFIRMED</td><td>Carried by 4+ independent owners including at least one primary-wire-grade source.</td></tr>
            <tr><td className="mono">REPORTED</td><td>Carried by 2–3 independent owners.</td></tr>
            <tr><td className="mono">DEVELOPING</td><td>One owner so far. Watch the corroboration count.</td></tr>
            <tr><td className="mono">DISPUTED</td><td>Reserved for the desk — applied by hand, logged in the story&apos;s biography.</td></tr>
          </tbody>
        </table>
        <p>
          These tags describe the state of <em>coverage</em> — a fact the system can stand behind.
          The desk&apos;s actual judgments live in the Briefing, the Spin Room, and the Ledger.
        </p>

        <h2>The roster ({owners.length} independent owners)</h2>
        <p className="mono">{owners.join(" · ")}</p>
        <p>
          Headlines and excerpts of at most ~25 words link out to their sources, always attributed.
          The raw, unranked intake is public — open the Ticker at the bottom of the Wire and compare
          it with the seated board whenever you like.
        </p>

        <h2>No quiet edits — the machine included</h2>
        <p>
          Every tier change, headline normalization, and desk intervention is written into the
          story&apos;s public biography. When the desk pins, re-seats, or stands down a story by
          hand, the biography says <em>seated by the desk</em>. The override shows its work too.
        </p>

        <h2>Changelog</h2>
        <table>
          <tbody>
            <tr><td className="mono">{METHOD_VERSION}</td><td>GRAVITY: consequence + power join the signals; the Lobby split; weights published and reader-tunable.</td></tr>
            <tr><td className="mono">v1.0</td><td>First published method. Corroboration counts owners, not domains. Orange reserved for FLASH.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
