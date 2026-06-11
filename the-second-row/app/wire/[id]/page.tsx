import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { loadBoard } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StoryBiography({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board = await loadBoard();
  const story = board?.stories.find((s) => s.id === id);

  if (!story) {
    return (
      <>
        <SiteHeader />
        <div className="wrap page">
          <div className="page-kicker">The Wire · Biography</div>
          <h1>This story has left the house.</h1>
          <p>
            It aged off the board, or the board&apos;s memory was reset (without a database attached,
            biographies live only as long as the engine&apos;s warm memory). The wire moves on;{" "}
            <Link href="/">the house is live</Link>.
          </p>
        </div>
      </>
    );
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.headline,
    datePublished: story.firstSeen,
    dateModified: story.lastDev,
    url: story.url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <div className="wrap page">
        <div className="page-kicker">
          The Wire · Story biography · {story.tier} · {story.certainty}
        </div>
        <h1>{story.headline}</h1>
        {story.excerpt && <p>{story.excerpt}</p>}
        <p className="mono">
          First seen {fmt(story.firstSeen)} · last development {fmt(story.lastDev)} · score{" "}
          {story.score} · {story.owners} independent owner{story.owners === 1 ? "" : "s"}
        </p>

        <h2>Every rank it held</h2>
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>What happened</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {[...story.history].reverse().map((h, i) => (
              <tr key={i}>
                <td>{fmt(h.at)}</td>
                <td>{h.event}</td>
                <td>{h.by === "desk" ? "the desk" : "the board"}</td>
              </tr>
            ))}
            {story.history.length === 0 && (
              <tr>
                <td colSpan={3}>Seated this sweep — history begins now.</td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="mono">
          No quiet edits: headline changes, tier moves, and desk interventions are logged here, in
          the open, as they happen.
        </p>

        <h2>Carried by</h2>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Owner</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {story.sources.map((s) => (
              <tr key={s.owner + s.url}>
                <td>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name} ↗
                  </a>
                </td>
                <td>{s.owner}</td>
                <td>{s.weight}/3</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <Link href="/">← Back to the house</Link>
        </p>
      </div>
    </>
  );
}
