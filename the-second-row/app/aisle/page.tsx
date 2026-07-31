import type { Metadata } from "next";
import Link from "next/link";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";
import { AISLE_STATEMENT } from "@/lib/aisle";

export const metadata: Metadata = {
  title: "The Aisle — The Second Row",
  description: "The wall between the news half and the advocacy half — published verbatim, and enforced in code.",
};

export default function AislePage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <p className="mono-label text-[0.62rem] text-oxblood">The wall</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.8vw,3.25rem)] font-bold leading-[1.08]">
          The Aisle
        </h1>
        <p className="mt-6 border-l-2 border-oxblood pl-5 font-display text-[1.35rem] italic leading-relaxed text-cream">
          {AISLE_STATEMENT}
        </p>

        <h2 className="mono-label mt-12 text-[0.62rem] text-cream-55">Enforced in code, not just prose</h2>
        <ul className="mt-4 flex flex-col gap-4 font-body text-[1.02rem] text-cream-70">
          <li>
            <b className="text-cream">GRAVITY is sealed.</b> The news-scoring module imports nothing from the advocacy
            side — a lint rule fails the build if it ever tries. No plank, campaign, Floor Vote, or draft can move a
            story&rsquo;s seat.
          </li>
          <li>
            <b className="text-cream">CROSSING discloses, it never ranks.</b> When a seated Wire story touches a fight
            the Floor has taken a side on (BACK / FIGHT), the story carries a visible CROSSING tag linking here — and the
            Tilt Meter counts those stories in a separate, public column. The badge and the scoring module share no code.
          </li>
          <li>
            <b className="text-cream">Separate control rooms.</b> Wire editorial tools and Floor advocacy tools live on
            separate routes with separate public audit logs, so even internal actions can&rsquo;t blur the line.
          </li>
        </ul>

        <p className="mt-10 font-body text-[1.02rem] text-cream-70">
          Catch either half breaking this and say so on the record — the{" "}
          <Link href="/ledger" className="text-oxblood hover:underline">Ledger</Link> will grade the answer.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/" className="mono-label rounded-full border border-hairline-strong px-4 py-2 text-[0.62rem] text-cream hover:border-oxblood">
            ← The Wire
          </Link>
          <Link href="/floor" className="mono-label rounded-full border border-hairline-strong px-4 py-2 text-[0.62rem] text-cream hover:border-oxblood">
            The Floor →
          </Link>
        </div>
      </main>
      <Foot />
    </div>
  );
}
