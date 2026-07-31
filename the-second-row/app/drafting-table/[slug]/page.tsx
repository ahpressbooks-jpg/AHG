import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";
import { getDraft } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDraft(slug);
  if (!d) return { title: "Not found — The Drafting Table" };
  return { title: `Draft No. ${d.n}: ${d.title} — The Second Row`, description: d.problem.slice(0, 155) };
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <section className={`border-t border-hairline py-7 ${accent ? "border-l-2 border-l-oxblood pl-5" : ""}`}>
      <h2 className={`mono-label text-[0.62rem] ${accent ? "text-oxblood" : "text-cream-55"}`}>{label}</h2>
      <p className="mt-3 whitespace-pre-line font-body text-[1.05rem] leading-relaxed text-cream">{body}</p>
    </section>
  );
}

export default async function DraftPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDraft(slug);
  if (!d) notFound();

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-3xl px-5 pb-10">
        <div className="pt-6">
          <Link href="/drafting-table" className="mono-label text-[0.62rem] text-oxblood hover:underline">← The Drafting Table</Link>
        </div>

        <header className="py-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[0.72rem] text-oxblood">DRAFT No. {d.n}</span>
            <span className="mono-label text-[0.55rem] text-cream-55">v{d.version}</span>
            <span className="mono-label rounded-full border border-hairline-strong px-2 py-0.5 text-[0.55rem] text-cream-70">{d.status}</span>
            <span className="mono-label text-[0.55rem] text-cream-55">{d.area}</span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(1.7rem,1.2rem+2.4vw,2.8rem)] font-bold leading-[1.08]">{d.title}</h1>
        </header>

        <Block label="The problem" body={d.problem} />
        <Block label="The mechanism" body={d.mechanism} />
        <Block label="Who pays" body={d.whoPays} />
        <Block label="Who objects, and why" body={d.whoObjects} />
        <Block label="The steelman — the strongest case against" body={d.steelman} accent />

        {/* changelog */}
        <section className="border-t border-hairline py-7">
          <h2 className="mono-label text-[0.62rem] text-cream-55">Changelog — every revision, and the argument that earned it</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {[...d.changelog].reverse().map((c) => (
              <li key={c.version} className="border-l border-hairline pl-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.66rem] text-oxblood">v{c.version}</span>
                  <span className="font-mono text-[0.6rem] text-cream-55">{new Date(c.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <p className="mt-1 font-body text-[0.92rem] text-cream-70"><b className="text-cream">{c.changed}</b> — {c.because}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* markup */}
        <section className="border-t border-hairline py-7">
          <h2 className="mono-label text-[0.62rem] text-cream-55">Public markup</h2>
          <p className="mt-3 font-body text-[0.95rem] text-cream-70">
            Members mark up drafts paragraph by paragraph, and the desk responds or resolves in public — the markup rail
            opens with member accounts. For now, bring an argument to <Link href="/well" className="text-oxblood hover:underline">the Well</Link>;
            if it moves the draft, it earns a line in the changelog above.
          </p>
        </section>

        <p className="border-t border-hairline py-6 font-body text-[0.86rem] text-cream-55">
          This is the advocacy half. How it stays walled off from the news is spelled out on{" "}
          <Link href="/aisle" className="text-oxblood hover:underline">the Aisle</Link>.
        </p>
      </main>
      <Foot />
    </div>
  );
}
