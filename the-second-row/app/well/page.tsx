import type { Metadata } from "next";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";
import WellForm from "@/components/tsr/WellForm";
import { getSubmissions, responseRate } from "@/lib/well";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Well — The Second Row",
  description: "Bring the Floor an idea or a full draft. Every serious submission gets a public response — adopted, argued with, or declined with reasons.",
};

export default async function WellPage() {
  const subs = await getSubmissions();
  const rate = responseRate(subs);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-3xl px-5 pb-10">
        <section className="border-b border-hairline py-10">
          <p className="mono-label text-[0.62rem] text-oxblood">Member submissions</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">The Well</h1>
          <p className="mt-4 max-w-[64ch] font-body text-[1.05rem] leading-relaxed text-cream-70">
            Bring the Floor an idea or a full draft. Every serious submission gets a public response — adopted, argued
            with, or declined with reasons. Silence is not an outcome.
          </p>
          <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cream-70">
            Response rate:{" "}
            {rate.total === 0
              ? <span className="text-cream-55">the queue opens with the first submission</span>
              : <span className="text-cream">{rate.answered} of {rate.total} answered · {rate.pct}%</span>}
          </p>
        </section>

        <section className="py-9">
          <h2 className="mono-label mb-5 text-[0.62rem] text-cream-55">Drop something in</h2>
          <WellForm />
        </section>

        <section className="border-t border-hairline py-9">
          <h2 className="mono-label text-[0.62rem] text-cream-55">The queue</h2>
          {subs.length === 0 ? (
            <p className="mt-3 font-body text-[0.95rem] text-cream-70">Nothing in the well yet. Be the first — the desk answers in public.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-5">
              {subs.map((s) => (
                <li key={s.id} className="border-l border-hairline pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono-label text-[0.55rem] text-cream-55">{s.area || "Other"}</span>
                    <span className="font-mono text-[0.58rem] text-cream-55">{new Date(s.at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    {s.byName && <span className="font-mono text-[0.58rem] text-cream-55">· {s.byName}</span>}
                  </div>
                  <h3 className="mt-1 font-display text-[1.1rem] font-bold text-cream">{s.title}</h3>
                  <p className="mt-1 font-body text-[0.92rem] text-cream-70 line-clamp-2">{s.problem}</p>
                  {s.response ? (
                    <div className="mt-3 rounded border-l-2 border-oxblood bg-oxblood-12 p-3">
                      <span className="mono-label text-[0.55rem] text-oxblood">Desk response · {s.response.verdict}</span>
                      <p className="mt-1 font-body text-[0.9rem] text-cream-70">{s.response.text}</p>
                    </div>
                  ) : (
                    <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-cream-55">Awaiting the desk&rsquo;s public response</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Foot />
    </div>
  );
}
