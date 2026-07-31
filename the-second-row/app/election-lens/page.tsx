import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { JoinBand, SectionHead } from "@/components/fp/zones";

// ===========================================================================
// ELECTION LENS  ·  /election-lens
// ---------------------------------------------------------------------------
// A dated, hand-curated snapshot — NOT a live feed. Everything a non-developer
// needs to edit lives in the clearly-labeled constants and arrays in THIS block.
// Nothing below the "PAGE" divider needs touching to update copy or news.
//
//   • LAST_UPDATED  — the snapshot date. Edit in ONE place; it feeds the hero
//                     AND the "What's Happening (as of …)" heading.
//   • ELECTION_DAY  — the headline date shown in "What's on the Ballot".
//   • MACHINERY     — evergreen explainer cards (Section 1).
//   • BALLOT        — the 2026 structural breakdown (Section 2).
//   • QUESTIONS     — questions to ask any candidate (Section 3).
//   • DEVELOPMENTS  — the news snapshot (Section 4); newest entry FIRST is not
//                     required — the page sorts by date automatically. Add
//                     objects {date, headline, summary, sourceUrl, sourceName}.
//
// The site-wide promo banner is a SEPARATE file: components/ElectionBanner.tsx.
// To retire it, see the instructions at the top of that file (it also auto-
// retires on its own after its end-date constant).
// ===========================================================================

// —— the snapshot date (edit here, used everywhere) ————————————————————————
const LAST_UPDATED = "July 5, 2026";

// —— headline election date ————————————————————————————————————————————————
const ELECTION_DAY = "Tuesday, November 3, 2026";

// —— SECTION 1 · THE MACHINERY (evergreen explainers) ——————————————————————
interface Machine { title: string; summary: string; more: string; }
const MACHINERY: Machine[] = [
  {
    title: "Redistricting",
    summary:
      "Every ten years, states redraw the district lines that decide which voters pick which member of Congress. Whoever holds that pen can make a seat safe, competitive, or nearly unwinnable — before a single vote is cast.",
    more:
      "Redistricting follows the census. In most states the legislature draws the maps; a growing number use independent or bipartisan commissions. “Gerrymandering” means drawing those lines to favor one side — “packing” opposing voters into a few districts or “cracking” them across many so they never form a majority. Courts can strike maps for racial discrimination, but partisan gerrymandering is largely left to the states. The practical result: in many districts the primary, not the general election, is where the real contest happens.",
  },
  {
    title: "Primaries",
    summary:
      "Before the November ballot exists, parties choose their nominees in primaries. Turnout is usually a fraction of the general election — so a small, motivated slice of voters often decides who you get to choose between.",
    more:
      "Primaries vary by state. “Closed” primaries let only registered party members vote; “open” primaries let any voter participate; a few states use “top-two” or ranked systems. Because many districts lean heavily to one party, the primary in that party frequently determines the eventual winner. Knowing your state’s primary rules and date is often more consequential than knowing the November date.",
  },
  {
    title: "The two-party funnel",
    summary:
      "The U.S. system funnels almost every viable candidate into one of two parties. Ballot-access rules, winner-take-all districts, and debate thresholds make it very hard for independents or third parties to win federal office.",
    more:
      "Most U.S. elections are “first past the post” — the top vote-getter wins, with no runoff. That math pushes voters and money toward two major parties, because a vote for a third party can feel wasted or act as a “spoiler.” Reforms like ranked-choice voting and nonpartisan primaries aim to widen the funnel, and a handful of states and cities now use them — but at the federal level the two-party structure still dominates.",
  },
  {
    title: "Campaign money",
    summary:
      "Running for federal office costs money — often a great deal of it. Where that money comes from, and how transparent it is, shapes who can realistically run and who they answer to.",
    more:
      "Candidates raise “hard money” under Federal Election Commission limits and must disclose their donors. Separately, super PACs and certain nonprofits can raise and spend unlimited sums “independently” of a campaign — some disclose donors, some (“dark money”) do not. You can look up who funds any federal candidate directly on the FEC’s website. Following the money is one of the most reliable ways to understand a campaign’s incentives.",
  },
  {
    title: "House, Senate & Governor — who controls what",
    summary:
      "The three offices on most 2026 ballots do very different jobs. Understanding what each one controls tells you what is actually at stake when it flips.",
    more:
      "The House (all 435 seats, every two years) originates spending bills, runs oversight, and can impeach; a majority controls the floor and the committees. The Senate (six-year terms, about a third up each cycle) confirms federal judges and Cabinet officials and holds impeachment trials — narrow margins there can decide a president’s entire agenda. Governors run state governments — budgets, agencies, the National Guard, and in many states the administration of elections — and can sign or veto state law on the many issues Washington leaves to the states.",
  },
];

// —— SECTION 2 · WHAT'S ACTUALLY ON THE BALLOT (2026, structural & neutral) ——
interface Office { office: string; count: string; cadence: string; shiftMeans: string; }
const BALLOT: Office[] = [
  {
    office: "U.S. House",
    count: "435",
    cadence: "All seats up · 2-year terms",
    shiftMeans:
      "Control of the House sets the national agenda — which bills reach the floor, who chairs the committees, and whether spending and oversight fights move or stall. Every seat is contested every cycle.",
  },
  {
    office: "U.S. Senate",
    count: "35",
    cadence: "Seats up in 2026 · 6-year terms",
    shiftMeans:
      "A shift in the Senate changes who confirms federal judges and Cabinet officials and who runs the chamber. Because only about a third of seats are up at once, a few races can decide control.",
  },
  {
    office: "Governorships",
    count: "39",
    cadence: "States & territories voting",
    shiftMeans:
      "Governors control state budgets, agencies, and — in many states — how elections are administered. A change in a governor’s office can redirect state policy quickly, independent of Washington.",
  },
];

// —— SECTION 3 · QUESTIONS TO ASK ANY CANDIDATE (hard, non-partisan) ————————
const QUESTIONS: string[] = [
  "What specifically would you do in your first year — and how, exactly, would you pay for it?",
  "Name a time you broke with your own party. What did it cost you?",
  "Who are your three largest sources of funding, and what do they want in return?",
  "What is a position you’ve changed your mind about, and what evidence changed it?",
  "Will you commit — now, on the record — to accepting the certified result of your own election, win or lose?",
  "Name one thing the other side gets right.",
  "Which specific vote or decision should voters judge you by two years from now?",
  "What power that this office holds do you believe it should NOT have?",
  "How will constituents reach you and hold you accountable between elections?",
  "What would you refuse to do even if your own leadership demanded it?",
];

// —— SECTION 4 · WHAT'S HAPPENING (hand-curated snapshot; add entries here) ——
// Each entry is dated and sourced. Keep summaries neutral. Do NOT characterize
// any candidate's chances as fact. The list renders newest-first automatically.
interface Development { date: string; headline: string; summary: string; sourceUrl: string; sourceName: string; }
const DEVELOPMENTS: Development[] = [
  {
    date: "2026-07-01",
    headline: "Second-quarter campaign finance reports come due July 15",
    summary:
      "Federal candidates and committees must file their April–June fundraising reports with the Federal Election Commission by July 15. These filings are the first full-quarter public look at how much each campaign has raised and spent this cycle, and from whom.",
    sourceUrl: "https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/",
    sourceName: "Federal Election Commission",
  },
  {
    date: "2026-06-15",
    headline: "Primary season is underway on a rolling, state-by-state calendar",
    summary:
      "States hold their congressional and gubernatorial primaries across spring through September 2026, each one setting that state’s November ballot. Primary dates, registration deadlines, and party rules differ widely, so the relevant calendar is your own state’s.",
    sourceUrl: "https://ballotpedia.org/United_States_Congress_elections,_2026",
    sourceName: "Ballotpedia",
  },
  {
    date: "2026-05-01",
    headline: "Redistricting disputes continue in several states ahead of 2026",
    summary:
      "Litigation over congressional maps remained active in a number of states as the cycle opened, meaning the district lines in some places were still subject to court challenge. Where lines move, so does which party a seat favors.",
    sourceUrl: "https://www.brennancenter.org/issues/gerrymandering-fair-representation",
    sourceName: "Brennan Center for Justice",
  },
  {
    date: "2026-04-15",
    headline: "The structural stakes: the whole House and a third of the Senate",
    summary:
      "All 435 seats in the U.S. House and roughly a third of the U.S. Senate are on the ballot on November 3, alongside most of the nation’s governorships. The combination is what makes a midterm capable of shifting control in Washington and in the states at once.",
    sourceUrl: "https://ballotpedia.org/United_States_Congress_elections,_2026",
    sourceName: "Ballotpedia",
  },
  {
    date: "2026-03-01",
    headline: "Voter-registration deadlines vary by state — check yours early",
    summary:
      "Registration rules, deadlines, and early-voting windows are set state by state and can fall weeks before Election Day. The official federal starting point for confirming your registration and your state’s deadlines is vote.gov.",
    sourceUrl: "https://vote.gov/",
    sourceName: "vote.gov (U.S. government)",
  },
];

export const metadata: Metadata = {
  title: "Election Lens",
  description:
    "The Second Row Election Lens — not who’s winning, but how the choice is being made for you. A dated, non-partisan snapshot of the 2026 midterms: the machinery, what’s on the ballot, questions to ask any candidate, and a curated developments feed.",
};

function fmtDate(iso: string) {
  // Parse as local calendar date (avoid TZ drift on YYYY-MM-DD).
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString([], {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ===========================================================================
// PAGE — layout only. To change content, edit the constants/arrays above.
// ===========================================================================
export default function ElectionLensPage() {
  const developments = [...DEVELOPMENTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SiteHeader current="/election-lens" />
      <main className="wrap" id="house">
        {/* ---- HERO ---- */}
        <header className="el-hero">
          <span className="el-eyebrow">The Second Row</span>
          <h1>Election Lens</h1>
          <p className="el-sub">Not who&rsquo;s winning — how the choice is being made for you.</p>
          <div className="el-updated" role="note">
            <span className="el-updated-k">Last updated</span>
            <span className="el-updated-d">{LAST_UPDATED}</span>
            <span className="el-updated-note">A dated snapshot — not a live feed.</span>
          </div>
        </header>

        {/* ---- TRACK YOUR CANDIDATES (the live tool) ---- */}
        <Link href="/election-lens/candidates" className="el-trackcta">
          <span className="el-trackcta-k">New · live tool</span>
          <span className="el-trackcta-h">Track a candidate in your district →</span>
          <span className="el-trackcta-p">
            House, Senate, or Governor — find who&rsquo;s running, follow the money, and watch them on the Wire.
          </span>
        </Link>

        {/* ---- SECTION 1 · THE MACHINERY ---- */}
        <section className="fp-sec" aria-labelledby="el-machinery">
          <SectionHead kick="Evergreen" title="The Machinery" />
          <p className="el-lede" id="el-machinery">
            How the system actually decides your choices — the parts that rarely make headlines but shape every ballot.
          </p>
          <div className="fp-desks">
            {MACHINERY.map((m) => (
              <article key={m.title} className="deskcard">
                <span className="mode mode--explainer">How it works</span>
                <h3>{m.title}</h3>
                <p>{m.summary}</p>
                <details className="el-more">
                  <summary>More detail</summary>
                  <p>{m.more}</p>
                </details>
              </article>
            ))}
          </div>
        </section>

        {/* ---- SECTION 2 · WHAT'S ACTUALLY ON THE BALLOT ---- */}
        <section className="fp-sec" aria-labelledby="el-ballot">
          <SectionHead kick="2026 midterms" title="What’s Actually on the Ballot" />
          <p className="el-lede" id="el-ballot">
            A neutral, structural breakdown — what is up, and what a shift in each would mean. Election Day is{" "}
            <strong>{ELECTION_DAY}</strong>.
          </p>
          <div className="fp-desks">
            {BALLOT.map((o) => (
              <article key={o.office} className="deskcard">
                <span className="mode mode--evidence">On the ballot</span>
                <span className="el-ballot-n">{o.count}</span>
                <h3>{o.office}</h3>
                <p className="el-ballot-cadence">{o.cadence}</p>
                <p>{o.shiftMeans}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---- SECTION 3 · QUESTIONS TO ASK ANY CANDIDATE ---- */}
        <section className="fp-sec" aria-labelledby="el-questions-h">
          <SectionHead kick="Do the work" title="Questions to Ask Any Candidate" />
          <p className="el-lede" id="el-questions-h">
            Non-partisan, and deliberately hard. Put them to anyone running — for any office, from any party.
          </p>
          <ol className="el-questions">
            {QUESTIONS.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </section>

        {/* ---- SECTION 4 · WHAT'S HAPPENING ---- */}
        <section className="fp-sec" aria-labelledby="el-dev-h">
          <SectionHead kick="The snapshot" title={`What’s Happening (as of ${LAST_UPDATED})`} />
          <p className="el-disclaimer" id="el-dev-h" role="note">
            This is a hand-curated snapshot, updated periodically — <strong>not a live feed</strong>. Always verify
            with primary sources before voting.
          </p>
          <div className="el-feed">
            {developments.map((d) => (
              <article key={d.date + d.headline} className="el-dev">
                <time className="el-dev-date" dateTime={d.date}>{fmtDate(d.date)}</time>
                <div className="el-dev-body">
                  <h3>{d.headline}</h3>
                  <p>{d.summary}</p>
                  <a
                    className="el-dev-src"
                    href={d.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source: {d.sourceName} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---- SECTION 5 · CTA + SIGNATURE ---- */}
        <section className="fp-sec" aria-labelledby="el-cta-h">
          <div className="el-cta">
            <h2 id="el-cta-h">Then think for yourself.</h2>
            <p>
              The Election Lens hands you the structure, not a scoreboard. We don&rsquo;t tell you who to vote for —
              we show you how the choice is being built, and hand you back the questions. The rest is yours.
            </p>
            <div className="el-cta-row">
              <Link className="btn" href="/">Go to The Second Row →</Link>
              <Link className="btn btn--ghost" href="/wire">See what&rsquo;s moving now</Link>
            </div>
          </div>
          <JoinBand />
        </section>

        <div style={{ height: 60 }} />
      </main>
    </>
  );
}
