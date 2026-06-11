import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Standards",
  description: "Aggregation posture, corrections, accessibility, and privacy — written down.",
};

export default function StandardsPage() {
  return (
    <>
      <SiteHeader />
      <div className="wrap page">
        <div className="page-kicker">Standards</div>
        <h1>The house rules, written down.</h1>

        <h2>Aggregation posture</h2>
        <p>
          The Wire carries headlines, excerpts of roughly 25 words at most, and prominent
          attribution — and links out to the source for everything. It never republishes full
          text. It polls public feeds politely and respects source terms. Reporting belongs to the
          people who did it; the board&apos;s work is the seating, and the seating shows its work.
        </p>

        <h2>Corrections</h2>
        <p>
          No quiet edits — anywhere. Machine actions (tier moves, headline normalizations) are
          logged in each story&apos;s public biography automatically. Desk interventions are logged
          the same way, labeled <em>by the desk</em>. Errors in the desk&apos;s own written work are
          corrected in place with a dated note, and judgment calls that miss go on the Ledger as
          misses. To flag an error or request a takedown, write to the desk — the address publishes
          with the briefing.
        </p>

        <h2>Accessibility</h2>
        <p>
          The house is built to WCAG 2.2 AA: full keyboard operation (J/K walk the rows, T opens
          the ticker, H holds the board), screen-reader announcements for re-seats and flashes,
          and reduced-motion equivalents for every animation. Priority is never conveyed by color
          alone — tier is always color plus label plus position. If any of this fails you, that is
          a bug; tell the desk.
        </p>

        <h2>Privacy</h2>
        <p>
          No ads, no ad trackers, no sale of data — ever. The reading experience stores your
          preferences (theme, sound, legend) in your own browser. The free list takes your email
          and uses it for the briefing and nothing else. Analytics, when enabled, are
          privacy-first and cookie-free.
        </p>

        <h2>The money, disclosed</h2>
        <p>
          The platform is reader-funded by design. If sponsorship ever runs, it is disclosed in
          full, capped so no single sponsor matters, and never permitted to touch what a story says
          or where it sits. The view is not for sale.
        </p>
      </div>
    </>
  );
}
