import Board from "@/components/Board";
import { SAMPLE_BOARD } from "@/lib/sample";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// THE WIRE — the full immersive board: Reading Rule, sweep clock, FLIP bumps,
// ticker, the Pulse Rail. The front page (/) carries the signature module;
// this is the deep product.
export default async function WirePage({
  searchParams,
}: {
  searchParams: Promise<{ sample?: string }>;
}) {
  const params = await searchParams;
  const forceSample = params?.sample === "1";

  let state = forceSample ? SAMPLE_BOARD(new Date()) : await loadBoard();
  if (!forceSample && boardIsStale(state)) state = await runSweep();
  if (!state) state = SAMPLE_BOARD(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: "The Second Row — The Wire",
    description: "A live civic news board, re-ranked every 60 seconds, that shows its work on every rank.",
    coverageStartTime: state.stories.at(-1)?.firstSeen ?? state.sweptAt,
    dateModified: state.sweptAt,
    liveBlogUpdate: state.stories.slice(0, 10).map((s) => ({
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
      <Board initial={state} forceSample={forceSample} />
    </>
  );
}
