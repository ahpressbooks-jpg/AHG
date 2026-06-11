import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Briefing",
  description: "The day's real news, stripped of spin and tagged for certainty.",
};

export default function BriefingPage() {
  return (
    <>
      <SiteHeader current="/briefing" />
      <div className="wrap page">
        <div className="page-kicker">The Briefing · Format preview</div>
        <h1>The day&apos;s news, with every claim wearing its tag.</h1>
        <p>
          The Briefing is the desk&apos;s daily written read — the Wire&apos;s top stories, in the
          desk&apos;s own words, with one discipline the wire services never adopted: every claim is
          tagged for what it is, so you always know whether you&apos;re being told something or asked
          something.
        </p>

        <h2>The tags</h2>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>What it promises</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="tag tag--fact">FACT</span></td>
              <td>Verifiable and sourced. If it&apos;s wrong, it goes on the Ledger as a miss.</td>
            </tr>
            <tr>
              <td><span className="tag">POLICY</span></td>
              <td>What a rule, bill, or ruling actually does — mechanics, not framing.</td>
            </tr>
            <tr>
              <td><span className="tag tag--opinion">OPINION</span></td>
              <td>The desk&apos;s judgment, owned as judgment. Never dressed as fact.</td>
            </tr>
            <tr>
              <td><span className="tag">QUESTION</span></td>
              <td>What the desk doesn&apos;t know yet — asked in the open.</td>
            </tr>
            <tr>
              <td><span className="tag">THINKING OUT LOUD</span></td>
              <td>A line of reasoning in progress. Confidence: explicitly low.</td>
            </tr>
          </tbody>
        </table>

        <h2>A sample entry — the format, not the desk&apos;s voice yet</h2>
        <p>
          <span className="tag tag--fact">FACT</span>&nbsp; The Senate passed the appropriations
          framework 68–31 last night; the House votes Thursday.
        </p>
        <p>
          <span className="tag">POLICY</span>&nbsp; The framework funds agencies through September
          but defers the two disputed riders to a separate vote — meaning the fight isn&apos;t over,
          it&apos;s rescheduled.
        </p>
        <p>
          <span className="tag tag--opinion">OPINION</span>&nbsp; Calling this a &quot;deal&quot; is
          generous; it&apos;s a postponement both leaderships can survive.
        </p>
        <p>
          <span className="tag">QUESTION</span>&nbsp; Whether the riders return before or after the
          recess — watch the calendar, not the statements.
        </p>

        <p className="mono" style={{ marginTop: 28 }}>
          The daily Briefing launches with the desk. The format above is the contract it will keep.
          The free list gets it at 7 a.m. — take your seat on the Wire.
        </p>
      </div>
    </>
  );
}
