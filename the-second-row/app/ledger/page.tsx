import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Ledger",
  description: "Every call, dated and confidence-tagged, scored in public — misses and all.",
};

export default function LedgerPage() {
  return (
    <>
      <SiteHeader current="/ledger" />
      <div className="wrap page">
        <div className="page-kicker">The Accountability Ledger</div>
        <h1>The desk keeps score on itself.</h1>
        <p>
          Every prediction the desk makes gets a confidence tag the day it&apos;s made —{" "}
          <strong>certain</strong>, <strong>likely</strong>, or <strong>a guess</strong> — dated, in
          public. Time passes; reality decides; the result goes on the board, especially the misses.
          No quiet edits, no walking it back. The running tally is the credential.
        </p>

        <h2>How an entry lives</h2>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>The rule</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1 · Call it</td><td>The claim, dated, with confidence attached the day it&apos;s made.</td></tr>
            <tr><td>2 · Leave it alone</td><td>The entry is frozen. Reality settles it, not edits.</td></tr>
            <tr><td>3 · Mark it</td><td>Hit or miss goes on the board in the open — misses first.</td></tr>
            <tr><td>4 · Keep the tally</td><td>The record compounds, forever. That&apos;s the moat.</td></tr>
          </tbody>
        </table>

        <h2>Sample entries — the format the desk will live in</h2>
        <table>
          <thead>
            <tr>
              <th>Dated</th>
              <th>The call</th>
              <th>Confidence</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">Mar 04</td>
              <td>The riders return before the recess.</td>
              <td><span className="tag">LIKELY</span></td>
              <td><span className="ledger-hit">HIT</span> <span className="mono">· settled Mar 19</span></td>
            </tr>
            <tr>
              <td className="mono">Feb 11</td>
              <td>The court takes the data-systems case this term.</td>
              <td><span className="tag">GUESSING</span></td>
              <td><span className="ledger-miss">MISS</span> <span className="mono">· settled Apr 02 — wrong, on the record</span></td>
            </tr>
            <tr>
              <td className="mono">May 27</td>
              <td>The framework holds through September without a shutdown.</td>
              <td><span className="tag">LIKELY</span></td>
              <td><span className="ledger-open">OPEN</span></td>
            </tr>
          </tbody>
        </table>

        <p className="mono">
          Running tally begins the day the desk goes live and is never reset. A platform whose brand
          is &quot;I&apos;ll tell you how sure I am, then show you whether I earned it&quot; cannot
          be cloned by anyone who needs to look infallible. The board you just read on the Wire
          holds itself to the same standard — every rank shows its work, every change is logged.
        </p>
      </div>
    </>
  );
}
