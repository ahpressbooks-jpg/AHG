import type { Metadata } from "next";
import Link from "next/link";
import Foot from "@/components/tsr/Foot";
import ScoreChip from "@/components/tsr/ScoreChip";
import Shell from "@/components/tsr/Shell";
import SweepClock from "@/components/tsr/SweepClock";
import TierChip from "@/components/tsr/TierChip";
import { isImminent, loadFloor, seatFloor, stakesScore, Verdict } from "@/lib/floor";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "The Floor — The Second Row",
  description: "The live board of the law being written — bills, rules, and ballot measures scored by STAKES and seated by where they sit in the process.",
};

function VerdictMark({ v }: { v: Verdict }) {
  return (
    <span className="mono-label inline-flex items-center rounded-sm border-l-2 border-oxblood bg-oxblood-12 px-2 py-0.5 text-[0.55rem] text-oxblood">
      {v}
    </span>
  );
}

export default async function FloorPage() {
  const items = seatFloor(await loadFloor());
  const nowMs = Date.now();
  const sample = items.some((i) => i.source === "sample");

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-5xl px-5 pb-10">
        {/* header */}
        <section className="border-b border-hairline py-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mono-label text-[0.62rem] text-oxblood">The advocacy half</span>
            <SweepClock intervalSec={14400} label="The Floor · next sweep" />
          </div>
          <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">
            The law being written, ranked by what it does to you.
          </h1>
          <p className="mt-4 max-w-[62ch] font-body text-[1.05rem] leading-relaxed text-cream-70">
            Seated by where each item sits in the process — not by how loud it is. STAKES measures consequence, never
            desirability; the desk&rsquo;s opinion lives only in a verdict tag, and most items carry none.
          </p>
          {sample && (
            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-flash">
              Sample board — the federal &amp; regulatory pipes replace these with sourced records once configured.
            </p>
          )}
        </section>

        {/* the board */}
        <ol className="mt-2" aria-label="The Floor board">
          {items.map((it, i) => {
            const imminent = isImminent(it, nowMs);
            return (
              <li key={it.id}>
                <Link
                  href={`/floor/${it.id}`}
                  className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-hairline py-5 hover:bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)]"
                >
                  <span className="pt-1 font-mono text-sm text-cream-55 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <TierChip tier={it.tier} imminent={imminent} />
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-cream-55">{it.levelLabel}</span>
                      {it.verdict && <VerdictMark v={it.verdict} />}
                    </span>
                    <span className="mt-2 block font-display text-[1.15rem] font-medium leading-snug text-cream">
                      {it.plain_title}
                    </span>
                    {it.number && <span className="mt-1 block font-mono text-[0.6rem] text-cream-55">{it.number}</span>}
                  </span>
                  <span className="flex flex-col items-end gap-2 pt-0.5">
                    <ScoreChip score={stakesScore(it.stakes)} label="STAKES" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 rounded border border-hairline bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)] p-5">
          <p className="font-body text-[0.95rem] text-cream-70">
            What the Floor does not yet cover: county, municipal, and district levels ship later. It says so plainly
            rather than pretending. See <Link href="/docket" className="text-oxblood hover:underline">the Docket</Link> for
            the advocacy map, and <Link href="/aisle" className="text-oxblood hover:underline">the Aisle</Link> for the wall
            between this half and the news.
          </p>
        </div>
      </main>
      <Foot />
    </div>
  );
}
