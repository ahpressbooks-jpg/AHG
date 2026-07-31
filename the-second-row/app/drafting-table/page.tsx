import type { Metadata } from "next";
import Link from "next/link";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";
import { loadDrafts } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Drafting Table — The Second Row",
  description: "TSR-authored policy drafted in public and versioned like software — every revision states what changed and which argument earned it.",
};

export default async function DraftingTablePage() {
  const drafts = await loadDrafts();
  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-4xl px-5 pb-10">
        <section className="border-b border-hairline py-10">
          <p className="mono-label text-[0.62rem] text-oxblood">Policy in public</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">The Drafting Table</h1>
          <p className="mt-4 max-w-[64ch] font-body text-[1.05rem] leading-relaxed text-cream-70">
            Policy drafted in the open and versioned like software. Every draft names the problem, the mechanism, who
            pays, who objects — and the strongest case against itself. No draft is published without its steelman;
            that&rsquo;s a rule the database enforces, not a courtesy.
          </p>
        </section>

        <ul className="mt-2">
          {drafts.map((d) => (
            <li key={d.slug}>
              <Link href={`/drafting-table/${d.slug}`} className="block border-b border-hairline py-6 hover:bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[0.7rem] text-oxblood">DRAFT No. {d.n}</span>
                  <span className="mono-label text-[0.55rem] text-cream-55">v{d.version}</span>
                  <span className="mono-label rounded-full border border-hairline-strong px-2 py-0.5 text-[0.55rem] text-cream-70">{d.status}</span>
                  <span className="mono-label text-[0.55rem] text-cream-55">{d.area}</span>
                </div>
                <h2 className="mt-2 font-display text-[1.4rem] font-bold leading-snug text-cream">{d.title}</h2>
                <p className="mt-2 max-w-[70ch] font-body text-[0.95rem] text-cream-70 line-clamp-2">{d.problem}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded border border-hairline bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)] p-5">
          <p className="font-body text-[0.95rem] text-cream-70">
            Have a better draft, or a hole in one of these? Bring it to <Link href="/well" className="text-oxblood hover:underline">the Well</Link> —
            every serious submission gets a public response.
          </p>
        </div>
      </main>
      <Foot />
    </div>
  );
}
