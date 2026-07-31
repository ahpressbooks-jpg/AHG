import Link from "next/link";
import ArgumentMap from "@/components/ArgumentMap";
import Comments from "@/components/Comments";
import GlossaryLens from "@/components/GlossaryLens";
import SiteHeader from "@/components/SiteHeader";
import { ActionBar, DepthDial, Lens } from "@/components/StoryActions";
import { TiltLogger } from "@/components/YourTilt";
import { FREE_LIMITS, isPaid, sessionUser } from "@/lib/auth";
import { getArgMap } from "@/lib/extras";
import { getHouseLights } from "@/lib/ops";
import { getArchived, storyCalls } from "@/lib/records";
import { loadBoard } from "@/lib/store";

export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

export default async function StoryDossier({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board = await loadBoard();
  const onBoard = board?.stories.find((s) => s.id === id);
  const story = onBoard ?? (await getArchived(id));
  const user = await sessionUser();
  const paid = isPaid(user);

  if (!story) {
    return (
      <>
        <SiteHeader />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">The Wire · Dossier</div>
          <h1>This story isn&apos;t on the record.</h1>
          <p>
            Either the link is wrong, or it predates the Permanent Record (without a database
            attached, the archive begins at the engine&apos;s last cold start).{" "}
            <Link href="/">The house is live</Link>.
          </p>
        </div>
      </>
    );
  }

  // The Velvet Rope: the archive beyond 30 days is Pro. Today's news is free.
  // The House Lights protocol overrides every rope during a declared emergency.
  const lights = await getHouseLights();
  const ageDays = (Date.now() - new Date(story.lastDev).getTime()) / 86400_000;
  const roped = !onBoard && ageDays > FREE_LIMITS.archiveDays && !paid && !lights;

  const resolved = Boolean(story.resolution && story.resolution.state !== "ONGOING");
  const calls = await storyCalls(id);
  const argmap = await getArgMap(id);
  const w = story.workings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.headline,
    datePublished: story.firstSeen,
    dateModified: story.lastDev,
    url: story.url,
    isAccessibleForFree: !roped,
  };

  // Catch Me Up — three bullets from the story's own record, receipts attached.
  const catchup = [
    `First seen ${fmt(story.firstSeen)} · now carried by ${story.owners} independent newsroom${story.owners === 1 ? "" : "s"} (${story.certainty.toLowerCase()} coverage).`,
    story.history.length > 1
      ? `Path on the board: ${story.history.slice(-4).map((h) => h.event.split(" — ")[0]).join(" → ")}.`
      : `Seated ${story.tier} on arrival — no rank changes yet.`,
    story.resolution
      ? `Status: ${story.resolution.state}${story.resolution.note ? ` — ${story.resolution.note}` : ""}.`
      : `Status: ONGOING — last development ${fmt(story.lastDev)}; GRAVITY ${story.score}/100.`,
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      {!roped && <TiltLogger id={story.id} L={story.spread?.L ?? 0} C={story.spread?.C ?? 0} R={story.spread?.R ?? 0} />}
      <div className="wrap wrap--reading page">
        <div className="page-kicker">
          Dossier · {story.tier} · GRAVITY {story.score} · {story.certainty}
          {story.resolution ? ` · ${story.resolution.state}` : " · ONGOING"}
          {onBoard ? " · ON THE BOARD NOW" : " · THE PERMANENT RECORD"}
        </div>
        <h1>{story.headline}</h1>

        {roped ? (
          <div className="rope">
            <div className="rope-kicker">The Velvet Rope</div>
            <p className="lede">
              {story.excerpt || "This story lives in the deep archive."}
            </p>
            <p>
              Dossiers older than {FREE_LIMITS.archiveDays} days are part of the Pro archive —
              the news is free; the depth is how it stays free. Everything on today&apos;s board
              is open to everyone, always.
            </p>
            <Link className="btn btn--maroon" href="/subscribe">
              Open the archive — $8/mo
            </Link>
          </div>
        ) : (
          <>
            <div className="card" style={{ margin: "14px 0" }}>
              <div className="card-kicker">Catch me up</div>
              {catchup.map((c, i) => (
                <p key={i}>— {c}</p>
              ))}
            </div>

            <ActionBar storyId={story.id} headline={story.headline} />

            <DepthDial
              ten={
                <p className="lede">
                  <GlossaryLens text={story.excerpt || "The headline is the story so far — corroboration is still arriving."} />
                </p>
              }
              minute={
                <div className="workings" style={{ maxWidth: "none" }}>
                  <div className="workings-title">Why it ranks — GRAVITY {w.score}/100</div>
                  <span className="workings-row"><dt>corroboration&nbsp;</dt><dd>{w.corroboration} independent owners{typeof w.webCorroboration === "number" ? ` · +${w.webCorroboration} web domains` : ""}</dd></span>
                  <span className="workings-row"><dt>velocity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.velocity45} pickups / 45 min</dd></span>
                  <span className="workings-row"><dt>consequence&nbsp;&nbsp;</dt><dd>{w.consequence ?? "—"}/10</dd></span>
                  <span className="workings-row"><dt>power&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.power ?? "—"}/10</dd></span>
                  <span className="workings-row"><dt>beats&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd>{w.beats.length ? w.beats.join(", ") : "—"}</dd></span>
                  <span className="workings-row"><dt>the math&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</dt><dd><Link href="/gravity">/gravity — published, versioned, tunable</Link></dd></span>
                </div>
              }
              five={
                <>
                  {argmap && (
                    <>
                      <h2>The argument, mapped</h2>
                      <ArgumentMap map={argmap} />
                    </>
                  )}
                  <h2>The Lens</h2>
                  <Lens sources={story.sources} />
                  <h2>Every rank it held</h2>
                  <table>
                    <thead>
                      <tr><th>When</th><th>What happened</th><th>By</th></tr>
                    </thead>
                    <tbody>
                      {[...story.history].reverse().map((h, i) => (
                        <tr key={i}>
                          <td className="mono">{fmt(h.at)}</td>
                          <td>{h.event}</td>
                          <td className="mono">{h.by === "desk" ? "the desk" : "the board"}</td>
                        </tr>
                      ))}
                      {story.history.length === 0 && (
                        <tr><td colSpan={3}>Seated this sweep — history begins now.</td></tr>
                      )}
                    </tbody>
                  </table>
                  <p className="mono">No quiet edits: tier moves, headline normalizations, and desk interventions log here, in the open, as they happen.</p>
                </>
              }
              full={
                <>
                  <h2>Carried by</h2>
                  <table>
                    <thead>
                      <tr><th>Source</th><th>Owner</th><th>Lean</th><th>Weight</th></tr>
                    </thead>
                    <tbody>
                      {story.sources.map((s) => (
                        <tr key={s.owner + s.url}>
                          <td><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a></td>
                          <td className="mono">{s.owner}</td>
                          <td className="mono">{s.lean ?? "C"}</td>
                          <td className="mono">{s.weight}/3</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {calls.length > 0 && (
                    <>
                      <h2>The room&apos;s calls on this story</h2>
                      <table>
                        <thead>
                          <tr><th>Who</th><th>The call</th><th>Confidence</th><th>Result</th></tr>
                        </thead>
                        <tbody>
                          {calls.slice(0, 20).map((c) => (
                            <tr key={c.id}>
                              <td>{c.name}</td>
                              <td>{c.claim}</td>
                              <td className="mono">{c.confidence}</td>
                              <td className="mono">{c.result ?? "OPEN"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  <p>
                    <a className="btn btn--ghost btn--small" href={story.url} target="_blank" rel="noopener noreferrer">
                      Read at the source ↗
                    </a>
                  </p>
                </>
              }
            />

            <Comments target={`story:${story.id}`} resolved={resolved} />
          </>
        )}

        <p style={{ marginTop: 30 }}>
          <Link href="/">← Back to the house</Link>
        </p>
      </div>
    </>
  );
}
