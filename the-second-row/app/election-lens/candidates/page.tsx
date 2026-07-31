import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CandidateFinder from "@/components/el/CandidateFinder";
import TrackedList from "@/components/el/TrackedList";
import { SectionHead } from "@/components/fp/zones";
import { fecConfigured } from "@/lib/fec";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track your candidates",
  description:
    "Find who's running in your district — U.S. House, Senate, or Governor — and track them. Live candidate data from the FEC, tied straight into The Second Row's Wire.",
};

// The candidate finder + watchlist. Live House/Senate data comes from the FEC
// (lib/fec.ts); attaching a free FEC_API_KEY makes it complete and automatic.
export default function CandidatesPage() {
  const live = fecConfigured();
  return (
    <>
      <SiteHeader current="/election-lens" />
      <main className="wrap" id="house">
        <header className="el-hero">
          <span className="el-eyebrow">Election Lens · 2026</span>
          <h1>Track your candidates</h1>
          <p className="el-sub">
            Find who&rsquo;s running in your district — House, Senate, or Governor — and follow them straight through
            to the Wire.
          </p>
          <div className="el-updated" role="note">
            <span className="el-updated-k">How this works</span>
            <span className="el-updated-note">
              Track a candidate and any Wire story that mentions them surfaces on their page — automatically, on the
              same 60-second engine that runs the board.
            </span>
          </div>
        </header>

        <section className="fp-sec" aria-labelledby="el-find-h">
          <SectionHead kick="Step one" title="Find your race" />
          <p className="el-lede" id="el-find-h">
            Enter your address to jump to your U.S. House district, or pick any race in the country by hand.
          </p>
          <CandidateFinder />
          {!live && (
            <p className="el-source-note">
              <strong>Note:</strong> live House &amp; Senate rosters come from the Federal Election Commission API. Until a
              free <code>FEC_API_KEY</code> is set on the deployment, you&rsquo;ll see clearly-labeled sample rows — the
              interface and tracking work exactly the same.
            </p>
          )}
        </section>

        <section className="fp-sec" aria-labelledby="el-watch-h">
          <SectionHead kick="Your watchlist" title="Candidates you're tracking" moreHref="/you" moreLabel="Your seat →" />
          <p className="el-lede" id="el-watch-h">
            Saved to your seat, so your list is here whenever you come back.
          </p>
          <TrackedList />
        </section>

        <div className="el-backrow">
          <Link href="/election-lens">← Back to the Election Lens</Link>
        </div>
        <div style={{ height: 60 }} />
      </main>
    </>
  );
}
