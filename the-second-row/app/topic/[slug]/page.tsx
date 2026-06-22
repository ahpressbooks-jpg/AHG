import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { TopicChip } from "@/components/fp/zones";
import { topicBySlug, TOPICS } from "@/lib/desks";
import { archiveIndex, getArchived } from "@/lib/records";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";
import { Story } from "@/lib/types";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = topicBySlug(slug);
  return { title: t ? `${t.label} · The Second Row` : "Topic", description: t ? `The ${t.label} desk — live and ranked.` : undefined };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topicBySlug(slug);

  if (!topic) {
    return (
      <>
        <SiteHeader />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">Topics</div>
          <h1>No such desk.</h1>
          <p><Link href="/">Back to the front page →</Link></p>
        </div>
      </>
    );
  }

  let board = await loadBoard();
  if (boardIsStale(board)) board = await runSweep();
  const onBeat = (s: Story) => s.workings.beats?.some((b) => topic.beats.includes(b));
  const live = (board?.stories ?? []).filter(onBeat);

  // A little depth from the archive too.
  const idx = await archiveIndex(400);
  const liveIds = new Set(live.map((s) => s.id));
  const archived = (await Promise.all(idx.slice(0, 60).map((r) => getArchived(r.id))))
    .filter(Boolean)
    .filter((s) => s && onBeat(s) && !liveIds.has(s!.id)) as Story[];

  const lead = live[0];
  const rest = live.slice(1);

  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <div className="fp-sechead" style={{ marginTop: 18 }}>
          <span className="fp-kick" style={{ color: topic.accent }}>The {topic.label} desk</span>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>{topic.label}</h2>
          <Link className="fp-more" href="/wire">The full Wire →</Link>
        </div>

        {live.length === 0 && archived.length === 0 ? (
          <p className="house-note" style={{ textTransform: "none", letterSpacing: 0 }}>
            Nothing on the {topic.label} beat is moving right now. The board re-checks every 60 seconds — or browse{" "}
            <Link href="/wire">the full Wire</Link>.
          </p>
        ) : (
          <>
            {lead && (
              <article className="lead" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 22, marginBottom: 8 }}>
                <div className="lead-eyebrow">
                  <span className="lead-flag" style={{ background: topic.accent }}>{lead.tier}</span>
                  <span className={`certainty certainty--${lead.certainty}`} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem" }}>{lead.certainty}</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>
                  <Link href={`/wire/${lead.id}`}>{lead.headline}</Link>
                </h1>
                {lead.excerpt && <p className="lead-dek">{lead.excerpt}</p>}
                <div className="lead-meta">
                  <span className="grav"><span className="grav-n">{lead.score}</span><span className="grav-l">Gravity</span></span>
                  <span>{lead.owners} sources</span>
                </div>
              </article>
            )}
            <div className="stack">
              {rest.map((s) => (
                <Link key={s.id} href={`/wire/${s.id}`}>
                  <span className="st-hed">{s.headline}</span>
                  <span className="st-meta"><span>{s.tier}</span><span>G{s.score}</span><span>{s.certainty}</span></span>
                </Link>
              ))}
            </div>

            {archived.length > 0 && (
              <>
                <div className="fp-sechead" style={{ marginTop: 36 }}>
                  <span className="fp-kick">From the record</span>
                  <h2>Earlier on this beat</h2>
                </div>
                <div className="stack">
                  {archived.slice(0, 12).map((s) => (
                    <Link key={s.id} href={`/wire/${s.id}`}>
                      <span className="st-hed">{s.headline}</span>
                      <span className="st-meta"><span>{s.resolution?.state ?? "FADED"}</span><span>G{s.score}</span></span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        <div style={{ height: 50 }} />
      </main>
    </>
  );
}
