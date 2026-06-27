import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Action", description: "Where the reporting leads somewhere — campaigns, issues, and civic action, with clear lines between journalism and advocacy." };

// Sample campaigns so the pillar reads as real before the desk fills it. The
// desk authors live campaigns later; these are clearly framed as examples.
const CAMPAIGNS = [
  {
    issue: "Open records",
    title: "Make local government meeting records searchable",
    summary: "Most city and county records exist — they're just unsearchable PDFs. We're pushing for machine-readable public minutes, and tracking which bodies comply.",
    steps: ["Find your council's records policy", "Send the model request letter", "Report back what you receive"],
    status: "Active",
  },
  {
    issue: "Election transparency",
    title: "Publish the methodology behind every cited poll",
    summary: "If a poll shapes coverage, its sample, weighting, and sponsor should be public. We're asking outlets and pollsters to disclose — and scoring who does.",
    steps: ["Check a poll against our Toolkit", "Ask the pollster to publish methods", "Add what you find to the file"],
    status: "Active",
  },
];

export default function ActionPage() {
  return (
    <>
      <SiteHeader current="/action" />
      <main className="wrap page">
        <div className="page-kicker" style={{ color: "var(--crimson)" }}>Action</div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>Where the reporting leads somewhere.</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Seeing clearly is the start; doing something is the point. The Action desk turns what the
          newsroom uncovers into concrete civic steps — campaigns, issue explainers, and public
          accountability — without ever blurring the line between what we report and what we advocate.
        </p>

        <div className="action-boundary">
          <b>The firewall.</b> Reporting tells you what is true. Investigations dig. Opinion is labeled
          opinion. <b>Action is labeled Action</b> — it&apos;s where TSR takes a public position and asks
          you to act. We keep these visibly separate on purpose, so trust in the reporting is never
          spent on the advocacy. See <Link href="/standards">Standards</Link>.
        </div>

        <div className="fp-sechead" style={{ marginTop: 8 }}>
          <span className="fp-kick" style={{ color: "var(--crimson)" }}>Active</span>
          <h2>Campaigns</h2>
        </div>
        <div className="campaigns">
          {CAMPAIGNS.map((c) => (
            <article key={c.title} className="campaign">
              <span className="cmp-issue">{c.issue} · {c.status}</span>
              <h3>{c.title}</h3>
              <p>{c.summary}</p>
              <ul>{c.steps.map((s) => <li key={s}>{s}</li>)}</ul>
              <div className="cmp-actions">
                <Link className="btn btn--small" href="/you">Join this campaign</Link>
                <Link className="btn btn--ghost btn--small" href="/tips">Send evidence</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mono" style={{ color: "var(--slate)", marginTop: 6 }}>
          Sample campaigns shown — the desk&apos;s live campaigns publish here. Want to propose one?{" "}
          <Link href="/contact">Tell the desk</Link>.
        </p>

        <div className="fp-sechead" style={{ marginTop: "var(--fp-gap)" }}>
          <span className="fp-kick">How it works</span>
          <h2>From story to outcome</h2>
        </div>
        <ol className="page" style={{ paddingLeft: 18 }}>
          <li><strong>We report it.</strong> A claim, a pattern, or a gap surfaces on the <Link href="/wire">Wire</Link> or in an <Link href="/investigations">investigation</Link>.</li>
          <li><strong>We track it.</strong> Predictions and commitments go on <Link href="/ledger">the Ledger</Link>, scored over time.</li>
          <li><strong>We act — labeled.</strong> When there&apos;s a clear civic step, it becomes a campaign here, openly marked Action.</li>
          <li><strong>We report what changed.</strong> Outcomes go back on the record, win or lose. No quiet victories, no buried losses.</li>
        </ol>
      </main>
    </>
  );
}
