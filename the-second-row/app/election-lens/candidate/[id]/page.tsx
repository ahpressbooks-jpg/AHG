import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import TrackButton from "@/components/el/TrackButton";
import {
  getCandidateById, mentionsOf, Office, OFFICE_LABEL, stateName,
} from "@/lib/candidates";
import { SAMPLE_BOARD } from "@/lib/sample";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// "What a shift in this seat means" — the same non-partisan framing as the
// Election Lens ballot section, keyed by office.
const SHIFT: Record<Office, string> = {
  H: "The U.S. House sets the national agenda — which bills reach the floor, who chairs the committees, and whether spending and oversight fights move or stall. Every seat is contested every two years.",
  S: "The U.S. Senate confirms federal judges and Cabinet officials and controls its own floor. Because only about a third of seats are up at once and margins are often narrow, a single race can decide who runs the chamber.",
  G: "Governors run state budgets and agencies and, in many states, how elections are administered. A change in a governor’s office can redirect state policy quickly — independent of Washington.",
};

async function currentBoard() {
  let b = await loadBoard();
  if (boardIsStale(b)) b = await runSweep();
  if (!b) b = SAMPLE_BOARD(new Date());
  return b;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const r = await getCandidateById(decodeURIComponent(id));
  if (!r) return { title: "Candidate not found" };
  const c = r.candidate;
  return {
    title: c.name,
    description: `${c.name} — ${OFFICE_LABEL[c.office]}, ${stateName(c.state)}${c.district ? ` District ${c.district}` : ""}. Money and coverage, tracked on The Second Row.`,
  };
}

export default async function CandidatePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const r = await getCandidateById(decodeURIComponent(id));
  if (!r) notFound();
  const { candidate: c, money: m } = r;

  const board = await currentBoard();
  const mentions = mentionsOf(c, board);

  return (
    <>
      <SiteHeader current="/election-lens" />
      <main className="wrap" id="house">
        <div className="el-backrow" style={{ marginTop: 16 }}>
          <Link href="/election-lens/candidates">← All candidates</Link>
        </div>

        {/* Header */}
        <header className="el-prof-head">
          <div>
            <span className="el-eyebrow">
              {OFFICE_LABEL[c.office]} · {stateName(c.state)}{c.district ? ` · District ${c.district}` : ""}
            </span>
            <h1 className="el-prof-name">{c.name}</h1>
            <div className="el-prof-tags">
              {c.party && <span className={`el-party el-party--${(c.partyCode || "").toUpperCase()}`}>{c.party}</span>}
              {c.status && <span className="el-prof-status">{c.status}</span>}
              {c.source === "sample" && <span className="el-src src--sample">Sample entry</span>}
            </div>
          </div>
          <div className="el-prof-track">
            <TrackButton
              candidate={{ id: c.id, name: c.name, office: c.office, state: c.state, district: c.district, party: c.party }}
            />
          </div>
        </header>

        {/* Money */}
        <section className="fp-sec" aria-label="Money">
          <div className="el-sec-h"><h2>The money</h2><span className="el-cycle">{m.cycle} cycle</span></div>
          {m.available ? (
            <>
              <div className="el-money-grid">
                <div className="el-stat"><span className="el-stat-n">{money(m.raised)}</span><span className="el-stat-l">Raised</span></div>
                <div className="el-stat"><span className="el-stat-n">{money(m.spent)}</span><span className="el-stat-l">Spent</span></div>
                <div className="el-stat"><span className="el-stat-n">{money(m.cash)}</span><span className="el-stat-l">Cash on hand</span></div>
              </div>
              <p className="el-source-note">
                Source: U.S. Federal Election Commission{m.asOf ? `, through ${new Date(m.asOf).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}.
                {c.fecId && (
                  <> {" "}<a href={`https://www.fec.gov/data/candidate/${c.fecId}/`} target="_blank" rel="noopener noreferrer">Full filings ↗</a></>
                )}
              </p>
            </>
          ) : c.isRace ? (
            <p className="el-find-msg">
              Governor’s races aren’t in the federal (FEC) money system. See the full declared field and state filings here:{" "}
              {c.sourceUrl && <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">the {stateName(c.state)} race ↗</a>}.
            </p>
          ) : (
            <p className="el-find-msg">
              Live fundraising totals appear here once the FEC data source is configured (or once this candidate has filed a report).
            </p>
          )}
        </section>

        {/* The Wire tie-in — the automation */}
        <section className="fp-sec" aria-label="In the news">
          <div className="el-sec-h"><h2>On the Wire</h2><span className="el-cycle">live · re-ranked 60s</span></div>
          {mentions.length ? (
            <ul className="el-mentions">
              {mentions.map((s) => (
                <li key={s.id}>
                  <Link href={`/wire/${s.id}`} className="el-mention">
                    <span className="el-mention-hed">{s.headline}</span>
                    <span className="el-mention-meta">GRAVITY {s.score} · {s.certainty}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="el-find-msg">
              No current Wire coverage matches {c.isRace ? "this race" : c.name}. Track them and stories will surface here
              as the board picks them up.
            </p>
          )}
        </section>

        {/* What a shift means */}
        <section className="fp-sec" aria-label="What this seat controls">
          <div className="el-sec-h"><h2>What this seat controls</h2></div>
          <p className="el-shift">{SHIFT[c.office]}</p>
          <p className="el-source-note">
            Structural, non-partisan context — not an endorsement. The Second Row does not rate any candidate’s chances.
          </p>
        </section>

        <div className="el-backrow"><Link href="/election-lens/candidates">← Track another candidate</Link></div>
        <div style={{ height: 60 }} />
      </main>
    </>
  );
}
