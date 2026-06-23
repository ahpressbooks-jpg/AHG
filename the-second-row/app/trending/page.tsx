import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { TopicChip } from "@/components/fp/zones";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const metadata: Metadata = { title: "Trending", description: "What's most covered and fastest moving right now." };
export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  let board = await loadBoard();
  if (boardIsStale(board)) board = await runSweep();
  const stories = board?.stories ?? [];
  const mostCovered = [...stories].sort((a, b) => b.owners - a.owners || b.score - a.score).slice(0, 10);
  const fastest = [...stories].sort((a, b) => b.workings.velocity45 - a.workings.velocity45).slice(0, 10);

  const Col = ({ title, kick, list, metric }: { title: string; kick: string; list: typeof stories; metric: (s: (typeof stories)[number]) => string }) => (
    <div>
      <div className="fp-sechead"><span className="fp-kick">{kick}</span><h2>{title}</h2></div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {list.map((s, i) => (
          <li key={s.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: "1.1rem", color: "var(--slate)" }}>{i + 1}</span>
            <span>
              <Link href={`/wire/${s.id}`} style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "1.02rem", textDecoration: "none" }}>{s.headline}</Link>
              <span className="st-meta" style={{ display: "flex", gap: 10, marginTop: 4 }}><TopicChip beats={s.workings.beats} /><span>{metric(s)}</span></span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <div className="page-kicker">Trending</div>
        <h1 style={{ fontSize: "clamp(1.9rem,5vw,3rem)" }}>What&apos;s moving right now.</h1>
        <p className="lede" style={{ maxWidth: "60ch" }}>
          We don&apos;t track what you click — so &quot;trending&quot; here means what the world&apos;s
          newsrooms are actually covering and how fast it&apos;s spreading, straight off the live board.
        </p>
        <div className="fp-band" style={{ marginTop: 20 }}>
          <Col title="Most covered" kick="Breadth" list={mostCovered} metric={(s) => `${s.owners} newsrooms`} />
          <Col title="Fastest moving" kick="Velocity" list={fastest} metric={(s) => `${s.workings.velocity45}/45m`} />
        </div>
        <p className="mono" style={{ marginTop: 24 }}><Link href="/wire">The full board →</Link></p>
      </main>
    </>
  );
}
