import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Foot from "@/components/tsr/Foot";
import ScoreChip from "@/components/tsr/ScoreChip";
import Shell from "@/components/tsr/Shell";
import TierChip from "@/components/tsr/TierChip";
import {
  getFloorItem, isImminent, Stakes, STAKES_LABEL, STAKES_WHY, stakesScore,
} from "@/lib/floor";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const it = await getFloorItem(decodeURIComponent(id));
  if (!it) return { title: "Not found — The Floor" };
  return { title: `${it.plain_title} — The Floor`, description: it.plain_summary.slice(0, 155) };
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function FloorDossier({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = await getFloorItem(decodeURIComponent(id));
  if (!it) notFound();

  const nowMs = Date.now();
  const imminent = isImminent(it, nowMs);
  const keys = Object.keys(it.stakes) as (keyof Stakes)[];

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-3xl px-5 pb-10">
        <div className="pt-6">
          <Link href="/floor" className="mono-label text-[0.62rem] text-oxblood hover:underline">← The Floor</Link>
        </div>

        <header className="border-b border-hairline py-6">
          <div className="flex flex-wrap items-center gap-2">
            <TierChip tier={it.tier} imminent={imminent} />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream-55">{it.levelLabel}</span>
            {it.source === "sample" && <span className="mono-label text-[0.55rem] text-flash">sample</span>}
          </div>
          <h1 className="mt-4 font-display text-[clamp(1.7rem,1.2rem+2.4vw,2.8rem)] font-bold leading-[1.08]">
            {it.plain_title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ScoreChip score={stakesScore(it.stakes)} label="STAKES" />
            {it.verdict && (
              <span className="mono-label inline-flex items-center rounded-sm border-l-2 border-oxblood bg-oxblood-12 px-2 py-1 text-[0.58rem] text-oxblood">
                Verdict · {it.verdict}
              </span>
            )}
          </div>
        </header>

        {/* the headline feature: plain-language translation */}
        <section className="py-8">
          <h2 className="mono-label text-[0.6rem] text-cream-55">What it does to you</h2>
          <p className="mt-3 whitespace-pre-line font-body text-[1.12rem] leading-relaxed text-cream">{it.plain_summary}</p>
          {it.verdict && it.verdictReason && (
            <div className="mt-5 rounded border-l-2 border-oxblood bg-oxblood-12 p-4">
              <p className="mono-label text-[0.55rem] text-oxblood">Why the desk says {it.verdict}</p>
              <p className="mt-2 font-body text-[0.98rem] text-cream-70">{it.verdictReason}</p>
            </div>
          )}
        </section>

        {/* comment-open guidance */}
        {it.tier === "COMMENT OPEN" && (
          <section className="mb-8 rounded border border-hairline bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)] p-5">
            <h2 className="mono-label text-[0.6rem] text-flash">Comment open{it.closesAt ? ` · closes ${fmtDate(it.closesAt)}` : ""}</h2>
            <p className="mt-2 font-body text-[0.95rem] text-cream-70">
              You can file a public comment on this rule. Comments become part of the official record the agency must
              consider. Open the docket, write in plain terms who you are and how the rule affects you, and submit before
              the window closes.
            </p>
            {it.commentUrl && (
              <a href={it.commentUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-[0.7rem] text-oxblood hover:underline">
                Official comment docket{it.docketId ? ` (${it.docketId})` : ""} ↗
              </a>
            )}
          </section>
        )}

        {/* STAKES breakdown */}
        <section className="border-t border-hairline py-8">
          <h2 className="mono-label text-[0.6rem] text-cream-55">The STAKES breakdown — consequence, not desirability</h2>
          <div className="mt-4 flex flex-col gap-4">
            {keys.map((k) => (
              <div key={k}>
                <div className="flex items-center gap-3">
                  <span className="mono-label w-16 text-[0.58rem] text-cream">{STAKES_LABEL[k]}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded bg-[color-mix(in_oklab,var(--color-cream)_10%,transparent)]">
                    <span className="block h-full bg-cream-70" style={{ width: `${it.stakes[k]}%` }} />
                  </span>
                  <span className="w-8 text-right font-mono text-[0.7rem] tabular-nums text-cream-70">{it.stakes[k]}</span>
                </div>
                <p className="ml-[76px] mt-1 font-body text-[0.82rem] text-cream-55">{STAKES_WHY[k]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* the record */}
        <section className="border-t border-hairline py-8">
          <h2 className="mono-label text-[0.6rem] text-cream-55">The record</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 font-body text-[0.95rem] sm:grid-cols-[160px_1fr]">
            <dt className="text-cream-55">Official title</dt>
            <dd className="text-cream-70">{it.official_title}</dd>
            {it.number && (<><dt className="text-cream-55">Number</dt><dd className="text-cream-70">{it.number}</dd></>)}
            {it.committee && (<><dt className="text-cream-55">Committee</dt><dd className="text-cream-70">{it.committee}</dd></>)}
            {it.sponsors?.length ? (
              <><dt className="text-cream-55">Sponsors</dt>
              <dd className="text-cream-70">{it.sponsors.map((s) => `${s.name}${s.party ? ` (${s.party})` : ""}`).join(", ")}</dd></>
            ) : null}
          </dl>
          <a href={it.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-mono text-[0.7rem] text-oxblood hover:underline">
            Full official text at the source of record ↗
          </a>
        </section>

        {/* biography */}
        <section className="border-t border-hairline py-8">
          <h2 className="mono-label text-[0.6rem] text-cream-55">Biography — every status change, appended</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {[...it.events].reverse().map((e, i) => (
              <li key={i} className="flex gap-3 border-l border-hairline pl-4">
                <span className="font-mono text-[0.62rem] text-cream-55">{fmtDate(e.at)}</span>
                <span className="font-body text-[0.92rem] text-cream-70">{e.event}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="border-t border-hairline py-6 font-body text-[0.86rem] text-cream-55">
          Structural context, not an endorsement. The desk rates consequence in the score and takes a side only in the
          verdict tag. See <Link href="/aisle" className="text-oxblood hover:underline">the Aisle</Link>.
        </p>
      </main>
      <Foot />
    </div>
  );
}
