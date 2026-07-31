import type { Metadata } from "next";
import Foot from "@/components/tsr/Foot";
import Ballot from "@/components/tsr/Ballot";
import Shell from "@/components/tsr/Shell";
import { getBallots, tally, VOTE_CONSTITUTION, voteOptions } from "@/lib/floorvotes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Floor Votes — The Second Row",
  description: "The members' ranked vote on the order of battle — priority within the spine, never against it.",
};

export default async function FloorVotesPage() {
  const [options, ballots] = await Promise.all([voteOptions(), getBallots()]);
  const standing = tally(options, ballots);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-3xl px-5 pb-10">
        <section className="border-b border-hairline py-10">
          <p className="mono-label text-[0.62rem] text-oxblood">The order of battle</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">Floor Votes</h1>
          {/* the constitution renders verbatim, before the ballot */}
          <p className="mt-6 border-l-2 border-oxblood pl-5 font-body text-[1.05rem] italic leading-relaxed text-cream">
            {VOTE_CONSTITUTION}
          </p>
          <p className="mt-4 font-body text-[0.92rem] text-cream-70">
            Enforced structurally: the ballot below can only contain drafts and items the desk has taken a side on — an
            out-of-spine option cannot appear, so a vote can set priority within the spine but never against it.
          </p>
        </section>

        <section className="py-9">
          <h2 className="mono-label mb-5 text-[0.62rem] text-cream-55">Your ballot</h2>
          <Ballot options={options} />
        </section>

        <section className="border-t border-hairline py-9">
          <h2 className="mono-label text-[0.62rem] text-cream-55">The standing — the queue the desk commits to</h2>
          <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-cream-55">
            {ballots.length === 0 ? "No ballots yet — be the first" : `${ballots.length} ballot${ballots.length === 1 ? "" : "s"} counted · re-tallies nightly`}
          </p>
          <ol className="mt-4 flex flex-col">
            {standing.map((row, i) => (
              <li key={row.option.id} className="flex items-center gap-4 border-b border-hairline py-3">
                <span className="font-mono text-sm text-cream-55 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-body text-[0.98rem] text-cream">{row.option.label}</span>
                  {row.option.sub && <span className="block font-mono text-[0.56rem] text-cream-55">{row.option.sub}</span>}
                </span>
                <span className="font-mono text-[0.66rem] text-cream-70 tabular-nums">{row.points} pts</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Foot />
    </div>
  );
}
