import type { Metadata } from "next";
import Link from "next/link";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";
import { loadFights, sortFights } from "@/lib/fights";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Fight Ledger — The Second Row",
  description: "Every fight the Floor enters — position, stakes at entry, effort, outcome. Losses first, each with a post-mortem.",
};

export default async function FightLedgerPage() {
  const fights = sortFights(await loadFights());
  const won = fights.filter((f) => f.outcome === "Won").length;
  const lost = fights.filter((f) => f.outcome === "Lost").length;
  const ongoing = fights.filter((f) => f.outcome === "Ongoing").length;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-3xl px-5 pb-10">
        <section className="border-b border-hairline py-10">
          <p className="mono-label text-[0.62rem] text-oxblood">The scoreboard on ourselves</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">The Fight Ledger</h1>
          <p className="mt-4 max-w-[64ch] font-body text-[1.05rem] leading-relaxed text-cream-70">
            Every fight the Floor enters — the position taken, the stakes at entry, the effort spent, and the outcome.
            Losses sort first, each with a post-mortem of what the desk got wrong about the map. Same discipline as the
            news <Link href="/ledger" className="text-oxblood hover:underline">Ledger</Link>.
          </p>
        </section>

        {fights.length === 0 ? (
          <section className="py-14">
            <p className="font-display text-[1.4rem] font-bold text-cream">The Fight Ledger opens with the first fight, not before.</p>
            <p className="mt-3 max-w-[60ch] font-body text-[0.98rem] text-cream-70">
              No zeros dressed up as a record. When the Floor enters its first fight — a{" "}
              <Link href="/floor" className="text-oxblood hover:underline">BACK or FIGHT</Link> the desk commits real
              effort to — it lands here, win or lose, with its reasoning attached.
            </p>
          </section>
        ) : (
          <>
            <div className="flex gap-8 border-b border-hairline py-6 font-mono">
              <span><span className="block text-2xl font-medium text-flash tabular-nums">{lost}</span><span className="mono-label text-[0.55rem] text-cream-55">Lost</span></span>
              <span><span className="block text-2xl font-medium text-cream-70 tabular-nums">{ongoing}</span><span className="mono-label text-[0.55rem] text-cream-55">Ongoing</span></span>
              <span><span className="block text-2xl font-medium text-cream tabular-nums">{won}</span><span className="mono-label text-[0.55rem] text-cream-55">Won</span></span>
            </div>
            <ul className="mt-2">
              {fights.map((f) => (
                <li key={f.id} className="border-b border-hairline py-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`mono-label rounded-sm border px-2 py-0.5 text-[0.55rem] ${f.outcome === "Lost" ? "border-flash text-flash" : f.outcome === "Won" ? "border-hairline-strong text-cream" : "border-hairline-strong text-cream-70"}`}>{f.outcome}</span>
                    <span className="mono-label text-[0.55rem] text-oxblood">{f.position}</span>
                    <span className="mono-label text-[0.55rem] text-cream-55">STAKES {f.stakesAtEntry} at entry · {f.effort} effort</span>
                  </div>
                  <h2 className="mt-2 font-display text-[1.2rem] font-bold text-cream">
                    {f.href ? <Link href={f.href} className="hover:underline">{f.title}</Link> : f.title}
                  </h2>
                  {f.outcome === "Lost" && f.postmortem && (
                    <div className="mt-3 rounded border-l-2 border-flash bg-[color-mix(in_oklab,var(--color-flash)_10%,var(--color-ink))] p-4">
                      <span className="mono-label text-[0.55rem] text-flash">Post-mortem — what we got wrong</span>
                      <p className="mt-1 font-body text-[0.92rem] text-cream-70">{f.postmortem}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <Foot />
    </div>
  );
}
