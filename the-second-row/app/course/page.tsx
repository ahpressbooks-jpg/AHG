import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { CaptureInline } from "@/components/CaptureInline";

export const metadata: Metadata = { title: "Think for Yourself", description: "The full method as a course — waitlist open." };

export default function CoursePage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Education · waitlist open</div>
        <h1>Think for Yourself.</h1>
        <p className="lede">
          The brand was never the positions — it was the method. Show the work. Mark the
          certainty. Hold one rule for everyone. Steelman before you answer. Change your mind in
          public when the argument earns it. That is a teachable skill, and almost no one teaches
          it.
        </p>
        <h2>The shape of it</h2>
        <table>
          <tbody>
            <tr><td className="mono">Self-paced course</td><td>The full method, recorded. Buy once, keep forever. ($149 placeholder — priced against real costs at open.)</td></tr>
            <tr><td className="mono">Live cohort</td><td>Four weeks, ~12 seats, the desk in the room. Premium, capped by the only resource that can&apos;t be manufactured: hours.</td></tr>
            <tr><td className="mono">Licensed curriculum</td><td>The method packaged for schools, homeschool networks, and youth programs. Annual license, per site.</td></tr>
          </tbody>
        </table>
        <h2>Why it isn&apos;t open yet</h2>
        <p>
          The rule of the house: earn each layer before opening the next. The course opens when
          the daily desk has run long enough to deserve students — measured in cadence and
          retention, not enthusiasm. The waitlist is how you make sure you hear it first.
        </p>
        <CaptureInline label="Join the waitlist" line="First seats, founding price, no spam — the course list is only ever about the course." />
      </div>
    </>
  );
}
