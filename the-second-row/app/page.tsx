import Link from "next/link";
import Board from "@/components/inst/Board";
import Shell from "@/components/inst/Shell";
import { FEATURES } from "@/lib/instrument";
import { SAMPLE_BOARD } from "@/lib/sample";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// THE INSTRUMENT — the front door. Not a front page of curated packages, but a
// single living surface: the Breathing Board up top, the Wire ranked by weight,
// the Silence band beneath, and the ten instruments you can step into. Built on
// the same 60s sweep that has always powered the Wire.
export default async function Home() {
  let board = await loadBoard();
  if (boardIsStale(board)) board = await runSweep();
  if (!board) board = SAMPLE_BOARD(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: "The Second Row — the Instrument",
    description:
      "A living model of how public knowledge forms: ranked by weight, decaying in real time, and showing what the front pages are missing.",
    dateModified: board.sweptAt,
    liveBlogUpdate: board.stories.slice(0, 10).map((s) => ({
      "@type": "BlogPosting",
      headline: s.headline,
      datePublished: s.firstSeen,
      dateModified: s.lastDev,
      url: s.url,
    })),
  };

  return (
    <div className="inst">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Shell />
      <main id="house">
        {board.sample && (
          <div className="wrap" style={{ paddingTop: 12 }}>
            <span className="sample-watermark">SAMPLE BOARD — live wire warming up</span>
          </div>
        )}

        <Board initial={board} />

        {/* THE TEN — every instrument, as a destination. */}
        <div className="wrap">
          <section className="inst-sec" aria-label="The Instrument">
            <div className="inst-sec-h">
              <h2>The Instrument</h2>
              <span className="k">ten ways to read the day</span>
            </div>
            <p style={{ color: "var(--ic-dim)", margin: "12px 0 18px", maxWidth: "60ch", fontSize: "0.95rem" }}>
              The Wire is the engine. On top of it we are building instruments no newsroom has
              shipped — each one a different way of seeing how a story forms, hardens, and fades.
            </p>
            <div className="feat-grid">
              {FEATURES.map((f) => (
                <Link key={f.slug} href={`/instrument/${f.slug}`} className="feat">
                  <span className={`fs fs--${f.status}`}>
                    {f.status === "live" ? "● LIVE" : f.status === "calibrating" ? "◐ CALIBRATING" : "○ IN DESIGN"}
                  </span>
                  <h3>{f.name}</h3>
                  <p>{f.tagline}</p>
                </Link>
              ))}
            </div>
          </section>

          <footer className="inst-foot">
            <div style={{ marginBottom: 14 }}>
              <Link href="/instrument/wire">The Wire</Link>
              <Link href="/instrument/half-life">Half-Life</Link>
              <Link href="/instrument/silence">The Silence Board</Link>
              <Link href="/about">About</Link>
              <Link href="/standards">Standards</Link>
              <Link href="/method">Method</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div>
              THE SECOND ROW · One row back, full view · The board re-ranks every 60 seconds by
              GRAVITY — independent corroboration, velocity, consequence, power, and freshness.
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
