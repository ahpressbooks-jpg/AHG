import Link from "next/link";
import StoryImage from "@/components/fp/StoryImage";
import { topicForBeats } from "@/lib/desks";
import { Assignment, DeskDoc } from "@/lib/extras";
import { Post, Story } from "@/lib/types";

// ---------------------------------------------------------------------------
// FRONT PAGE ZONES — server-rendered presentational modules. Each desk has a
// distinct identity; reporting, analysis, opinion, explainers, investigations,
// and evidence never look identical.
// ---------------------------------------------------------------------------

export function SectionHead({ kick, title, moreHref, moreLabel }: { kick: string; title: string; moreHref?: string; moreLabel?: string }) {
  return (
    <div className="fp-sechead">
      <span className="fp-kick">{kick}</span>
      <h2>{title}</h2>
      {moreHref && (
        <Link className="fp-more" href={moreHref}>
          {moreLabel ?? "See all →"}
        </Link>
      )}
    </div>
  );
}

export function TopicChip({ beats }: { beats?: string[] }) {
  const t = topicForBeats(beats);
  if (!t) return null;
  return (
    <Link className="topic" href={`/topic/${t.slug}`} style={{ ["--tc" as any]: t.accent }}>
      {t.label}
    </Link>
  );
}

function Spectrum({ spread }: { spread?: { L: number; C: number; R: number } }) {
  if (!spread) return null;
  const total = spread.L + spread.C + spread.R;
  if (total === 0) return null;
  const pos = ((spread.C * 0.5 + spread.R) / total) * 100;
  return (
    <span className="spectrum" title={`framing: L ${spread.L} · C ${spread.C} · R ${spread.R}`} aria-label="framing spectrum">
      <span className="sp-track">
        <span className="sp-dot" style={{ left: `${pos}%` }} />
      </span>
    </span>
  );
}

function ageLabel(iso: string, nowMs: number) {
  const min = Math.max(0, Math.round((nowMs - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  return h < 24 ? `${h} hr${h > 1 ? "s" : ""} ago` : `${Math.floor(h / 24)} d ago`;
}

// ---- THE LEAD ----
export function Lead({ story, nowMs }: { story: Story; nowMs: number }) {
  const w = story.workings;
  const isFlash = story.tier === "FLASH";
  return (
    <article className="lead">
      <Link href={`/wire/${story.id}`} className="lead-art" aria-hidden="true" tabIndex={-1}>
        <StoryImage src={story.image} id={story.id} tier={story.tier} beats={w.beats} alt="" />
        {story.image && story.sources[0] && <span className="lead-credit">{story.sources[0].name}</span>}
      </Link>
      <div className="lead-eyebrow">
        <span className={`lead-flag${isFlash ? " lead-flag--flash" : ""}`}>{isFlash ? "FLASH" : "THE LEAD"}</span>
        <TopicChip beats={w.beats} />
        <span className={`certainty certainty--${story.certainty}`} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.1em" }}>
          {story.certainty}
        </span>
      </div>
      <h1>
        <Link href={`/wire/${story.id}`}>{story.headline}</Link>
      </h1>
      {story.excerpt && <p className="lead-dek">{story.excerpt}</p>}
      <p className="lead-why">
        <b>Why it leads:</b> carried by <b>{story.owners} independent newsroom{story.owners === 1 ? "" : "s"}</b>
        {w.velocity45 >= 3 ? ", coverage accelerating" : ""}; consequence <b>{w.consequence ?? "—"}/10</b>, power{" "}
        <b>{w.power ?? "—"}/10</b>. The rank shows its work — <Link href={`/wire/${story.id}`}>open the dossier</Link>.
      </p>
      <div className="lead-meta">
        <span className="grav lead-grav">
          <span className="grav-n">{story.score}</span>
          <span className="grav-l">Gravity</span>
        </span>
        <Spectrum spread={story.spread} />
        <span>{story.owners} sources</span>
        <span suppressHydrationWarning>{ageLabel(story.lastDev, nowMs)}</span>
      </div>
    </article>
  );
}

// ---- MOST MOVED ----
export function MovedRail({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="fp-sec" aria-label="Most moved">
      <SectionHead kick="Momentum" title="Fastest moving" moreHref="/wire" moreLabel="The full board →" />
      <div className="movedrail">
        {stories.map((s) => {
          const max = Math.max(1, ...s.spark);
          return (
            <Link key={s.id} href={`/wire/${s.id}`} className="movedcard">
              <span className="mc-art">
                <StoryImage src={s.image} id={s.id} tier={s.tier} beats={s.workings.beats} alt="" />
              </span>
              <span className="mc-top">
                <span className="mc-vel">▲ {s.workings.velocity45}/45m</span>
                <span style={{ color: "var(--pulse)" }}>G{s.score}</span>
                <TopicChip beats={s.workings.beats} />
              </span>
              <span className="mc-hed">{s.headline}</span>
              <span className="mc-spark" aria-hidden="true">
                {s.spark.map((v, i) => (
                  <i key={i} style={{ height: `${Math.max(12, (v / max) * 100)}%`, opacity: v === 0 ? 0.3 : 1 }} />
                ))}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ---- ANALYSIS & OPINION (from the column) ----
export function AnalysisZone({ posts, note }: { posts: Post[]; note?: string }) {
  const featured = posts.slice(0, 2);
  const rest = posts.slice(2, 6);
  return (
    <section className="fp-sec" aria-label="Analysis and opinion">
      <SectionHead kick="Interpretation" title="Analysis & Opinion" moreHref="/column" moreLabel="From the Second Row →" />
      <div className="fp-desks">
        {featured.length > 0 ? (
          featured.map((p) => {
            const mode = p.kind === "steelman" ? "analysis" : p.kind === "note" ? "analysis" : "opinion";
            return (
              <article key={p.slug} className={`deskcard deskcard--${mode}`}>
                <span className={`mode mode--${mode}`}>{p.kind === "steelman" ? "Steelman" : p.kind === "note" ? "Desk note" : "Opinion"}</span>
                <h3>
                  <Link href={`/column/${p.slug}`}>{p.title}</Link>
                </h3>
                {p.dek && <p>{p.dek}</p>}
                <div className="dc-meta">
                  <span>{new Date(p.publishedAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                  <span>From the desk</span>
                </div>
              </article>
            );
          })
        ) : (
          <article className="deskcard deskcard--opinion">
            <span className="mode mode--opinion">From the desk</span>
            <h3>{note ? "Today's note" : "The desk's voice, tagged in the open"}</h3>
            <p>{note || "Every claim the desk makes wears its tag — FACT, OPINION, QUESTION — so you always know whether you're being told something or asked something. The first columns publish here."}</p>
            <div className="dc-meta">
              <Link href="/column" style={{ color: "var(--maroon-row)" }}>Read the column →</Link>
            </div>
          </article>
        )}
        {rest.length > 0 ? (
          <div className="stack">
            {rest.map((p) => (
              <Link key={p.slug} href={`/column/${p.slug}`}>
                <span className="st-hed">{p.title}</span>
                <span className="st-meta">
                  <span>{p.kind === "steelman" ? "STEELMAN" : p.kind === "note" ? "NOTE" : "OPINION"}</span>
                  <span>{new Date(p.publishedAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <article className="deskcard deskcard--analysis">
            <span className="mode mode--analysis">The method</span>
            <h3>Reporting, analysis, opinion — never the same shape</h3>
            <p>The Second Row separates what happened from what the desk thinks about it. Analysis and opinion always carry a marker and a tinted ground, so trust is never a guess.</p>
            <div className="dc-meta">
              <Link href="/company" style={{ color: "var(--pulse)" }}>The thesis →</Link>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

// ---- EXPLAINERS (Toolkit) ----
export function ExplainersZone({ primers }: { primers: { slug: string; title: string; tease: string; minutes: number }[] }) {
  return (
    <section className="fp-sec" aria-label="Explainers">
      <SectionHead kick="How to read it" title="Explainers" moreHref="/toolkit" moreLabel="The Toolkit →" />
      <div className="fp-desks">
        {primers.slice(0, 4).map((p) => (
          <article key={p.slug} className="deskcard">
            <span className="mode mode--explainer">Explainer · {p.minutes} min</span>
            <h3>
              <Link href={`/toolkit/${p.slug}`}>{p.title}</Link>
            </h3>
            <p>{p.tease}</p>
            <div className="dc-meta">
              <Link href={`/toolkit/${p.slug}`} style={{ color: "var(--verdict)" }}>Learn the move →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---- INVESTIGATIONS (Assignment Desk) ----
export function InvestigationsZone({ assignments }: { assignments: Assignment[] }) {
  const open = assignments.slice(0, 3);
  return (
    <section className="fp-sec" aria-label="Investigations">
      <SectionHead kick="You direct it" title="Investigations" moreHref="/assignment-desk" moreLabel="The Assignment Desk →" />
      <div className="fp-desks">
        {open.map((a) => {
          const pct = Math.min(100, Math.round((a.backers.length / a.goal) * 100));
          return (
            <article key={a.id} className="deskcard">
              <span className="mode mode--investigation">{a.status === "open" ? "Open for backing" : a.status === "commissioned" ? "Commissioned" : "Published"}</span>
              <h3>
                <Link href="/assignment-desk">{a.question}</Link>
              </h3>
              <p>{a.detail}</p>
              <div className="tiltbar" style={{ marginTop: 4 }}>
                <span style={{ width: `${pct}%`, background: "#b45309" }} />
                <span style={{ width: `${100 - pct}%`, background: "var(--bg-well)" }} />
              </div>
              <div className="dc-meta">
                <span>{a.backers.length} of {a.goal} backers</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ---- EVIDENCE (Documents) ----
export function EvidenceZone({ docs }: { docs: DeskDoc[] }) {
  return (
    <section className="fp-sec" aria-label="Evidence">
      <SectionHead kick="The source material" title="Documents" moreHref="/documents" moreLabel="All documents →" />
      <div className="fp-desks">
        {docs.slice(0, 2).map((d) => (
          <article key={d.slug} className="deskcard deskcard--evidence">
            <span className="mode mode--evidence">Evidence · {d.kind}</span>
            <h3>
              <Link href={`/document/${d.slug}`}>{d.title}</Link>
            </h3>
            <p>{d.summary}</p>
            <div className="dc-meta">
              <Link href={`/document/${d.slug}`}>Read it annotated →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---- THE DATA BAND: Ledger + Civic Weather ----
export function DataBand({
  hits,
  misses,
  open,
  weather,
}: {
  hits: number;
  misses: number;
  open: number;
  weather: { pressure: number; sky: string; flashRisk: string; disagreement: { index: number } };
}) {
  return (
    <section className="fp-sec" aria-label="The desk's record and the civic weather">
      <SectionHead kick="The receipts" title="Track record & vital signs" />
      <div className="fp-band">
        <div className="band-card">
          <span className="mode mode--evidence">The Ledger</span>
          <p style={{ fontFamily: "var(--sans)", fontSize: "0.9rem", color: "var(--ink-1)", margin: "10px 0 0" }}>
            The desk keeps score on itself — every call dated, confidence-tagged, and graded by reality. Misses publish first.
          </p>
          <div className="band-stat">
            <span className="bs"><span className="bs-n ledger-hit">{hits}</span><span className="bs-l">hits</span></span>
            <span className="bs"><span className="bs-n ledger-miss">{misses}</span><span className="bs-l">misses</span></span>
            <span className="bs"><span className="bs-n ledger-open">{open}</span><span className="bs-l">open</span></span>
          </div>
          <Link className="fp-more" href="/ledger">The Ledger →</Link>
        </div>
        <div className="band-card">
          <span className="mode mode--wire">Civic Weather</span>
          <p style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "1.05rem", margin: "10px 0 0" }}>{weather.sky}</p>
          <div className="band-stat">
            <span className="bs"><span className="bs-n" style={{ color: "var(--pulse)" }}>{weather.pressure}</span><span className="bs-l">gravity pressure</span></span>
            <span className="bs"><span className="bs-n" style={{ color: weather.flashRisk === "ACTIVE" ? "var(--orange-ink)" : "var(--ink)" }}>{weather.flashRisk}</span><span className="bs-l">flash risk</span></span>
            <span className="bs"><span className="bs-n">{weather.disagreement.index}</span><span className="bs-l">disagreement index</span></span>
          </div>
          <Link className="fp-more" href="/weather">The forecast →</Link>
        </div>
      </div>
    </section>
  );
}

// ---- JOIN ----
export function JoinBand() {
  return (
    <section className="joinband" aria-label="Take your seat">
      <h2>One row back. Full view.</h2>
      <p>
        An independent news company founded at 21 — ranking the day by what carries weight, and showing its work on
        every call. The news is free. The depth is how it stays free.
      </p>
      <div className="jb-row">
        <Link className="btn" href="/subscribe">Take your seat</Link>
        <Link className="btn btn--ghost" href="/company" style={{ color: "inherit", borderColor: "currentColor" }}>The thesis</Link>
      </div>
    </section>
  );
}
