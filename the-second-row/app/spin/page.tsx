import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Spin Room",
  description: "The same facts, framed left, center, and right — side by side, before the verdict.",
};

export default function SpinPage() {
  return (
    <>
      <SiteHeader current="/spin" />
      <div className="wrap page" style={{ maxWidth: 1080 }}>
        <div className="page-kicker">The Spin Room · Format preview</div>
        <h1>Same facts. Three frames. Side by side.</h1>
        <p style={{ maxWidth: "68ch" }}>
          The Spin Room does the one move nobody else commits to: it shows you how the same story
          got framed left, right, and center — in parallel, before the desk says where it lands.
          Not to score the outlets. To make the framing itself visible, so it stops working on you
          unannounced.
        </p>

        <h2>Sample: the appropriations framework (fictional, format demo)</h2>
        <div className="spin-grid">
          <div className="spin-col" style={{ borderTopColor: "#3a5a8c" }}>
            <h3>As framed from the left</h3>
            <p>
              &quot;Senate Republicans finally drop hostage tactics as funding deal passes&quot; —
              emphasis on who blocked, who conceded, and what the riders would have cut.
            </p>
          </div>
          <div className="spin-col">
            <h3>As framed from the center</h3>
            <p>
              &quot;Senate passes stopgap framework 68–31; riders deferred&quot; — emphasis on the
              vote math, the calendar, and what is actually funded.
            </p>
          </div>
          <div className="spin-col" style={{ borderTopColor: "#8c3a3a" }}>
            <h3>As framed from the right</h3>
            <p>
              &quot;Spending machine rolls on: leadership shelves reform riders to pass another
              blank check&quot; — emphasis on totals, deficits, and the deferred riders as the story.
            </p>
          </div>
        </div>

        <h2>Then — and only then — the desk</h2>
        <p style={{ maxWidth: "68ch" }}>
          Beneath the three frames, the desk&apos;s verdict, tagged{" "}
          <span className="tag tag--opinion">OPINION</span> and entered on the Ledger when it makes
          a call. You watched the framing happen; now you can weigh the verdict with your eyes open.
          You aren&apos;t asked to agree. You&apos;re asked to judge.
        </p>
      </div>
    </>
  );
}
