import SiteHeader from "@/components/SiteHeader";
import WireSignature from "@/components/fp/WireSignature";
import {
  AnalysisZone,
  DataBand,
  EvidenceZone,
  ExplainersZone,
  InvestigationsZone,
  JoinBand,
  Lead,
  MovedRail,
} from "@/components/fp/zones";
import { civicWeather } from "@/lib/civic";
import { Assignment, allAssignments, allDocs } from "@/lib/extras";
import { allPosts, deskCalls, getNote } from "@/lib/records";
import { SAMPLE_BOARD } from "@/lib/sample";
import { SAMPLE_DOC } from "@/lib/sampleDoc";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";
import { PRIMERS } from "@/lib/toolkit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Sample fallbacks so every desk reads as composed before the desk has filled
// it (pre-Redis, or a fresh deploy). The Wire/Lead/Weather always derive from
// the live board; these cover the human-authored desks.
const DEMO_ASSIGNMENTS: Assignment[] = [
  { id: "demo1", question: "Where did the deferred riders actually go?", detail: "Back this and the desk tracks the punted appropriations riders to their grave or their passage — with receipts.", goal: 25, backers: new Array(9).fill("x"), status: "open", at: new Date().toISOString() },
  { id: "demo2", question: "Who funds the top three 'independent' poll shops?", detail: "Follow the money behind the pollsters the wire cites most. A standing reference piece.", goal: 25, backers: new Array(18).fill("x"), status: "open", at: new Date().toISOString() },
  { id: "demo3", question: "Every state's actual school-funding formula, side by side.", detail: "The numbers behind the statehouse fights, normalized so they can finally be compared.", goal: 25, backers: new Array(5).fill("x"), status: "open", at: new Date().toISOString() },
];

export default async function FrontPage() {
  let board = await loadBoard();
  if (boardIsStale(board)) board = await runSweep();
  if (!board) board = SAMPLE_BOARD(new Date());

  const [posts, note, assignmentsReal, docsReal, calls] = await Promise.all([
    allPosts(),
    getNote(),
    allAssignments(),
    allDocs(),
    deskCalls(),
  ]);

  const assignments = assignmentsReal.length ? assignmentsReal : DEMO_ASSIGNMENTS;
  const docs = docsReal.length ? docsReal : [SAMPLE_DOC];
  const hits = calls.filter((c) => c.result === "HIT").length;
  const misses = calls.filter((c) => c.result === "MISS").length;
  const open = calls.filter((c) => !c.result).length;
  const weather = civicWeather(board);

  const lead = board.stories[0];
  const moved = [...board.stories.slice(1)]
    .sort((a, b) => b.workings.velocity45 - a.workings.velocity45 || b.score - a.score)
    .slice(0, 6);
  const nowMs = Date.now();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: "The Second Row — the front page",
    description: "An independent news company ranking the day by what carries weight — and showing its work.",
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader current="/" />
      <main className="wrap" id="house">
        {board.sample && <div style={{ paddingTop: 12 }}><span className="sample-watermark">SAMPLE BOARD — fictional headlines for design review</span></div>}

        <div className="fp-top">
          {lead && <Lead story={lead} nowMs={nowMs} />}
          <WireSignature initial={board} />
        </div>

        <MovedRail stories={moved} />
        <AnalysisZone posts={posts} note={note?.text} />
        <ExplainersZone primers={PRIMERS} />
        <InvestigationsZone assignments={assignments} />
        <EvidenceZone docs={docs} />
        <DataBand hits={hits} misses={misses} open={open} weather={weather} />
        <JoinBand />
        <div style={{ height: 60 }} />
      </main>
    </>
  );
}
