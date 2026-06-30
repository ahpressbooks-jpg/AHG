import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Shell from "@/components/inst/Shell";
import {
  civicTempo, fadeLabel, FEATURES, featureBySlug, halfLife, silence,
} from "@/lib/instrument";
import { SAMPLE_BOARD } from "@/lib/sample";
import { BoardState } from "@/lib/types";
import { loadBoard } from "@/lib/store";
import { boardIsStale, runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIVE_DEMO = new Set(["wire", "half-life", "silence", "breathing-board"]);

const STATUS_LABEL: Record<string, string> = {
  live: "● Live now",
  calibrating: "◐ In calibration",
  early: "○ In design",
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) return { title: "Not found" };
  return { title: `${f.name} — The Instrument`, description: f.tagline };
}

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

// A live snapshot for the four working instruments — synchronous, fed the board
// the page already loaded. The home page is the live surface; this just shows
// the instrument running on real data.
function LiveDemo({ slug, b }: { slug: string; b: BoardState }) {
  const nowMs = Date.now();

  if (slug === "breathing-board") {
    const t = civicTempo(b);
    return (
      <div className="inst-preview">
        <div className="ip-tempo">
          <span className="tempo-mood">{t.mood} · civic load {t.load}</span>
          <span className="tempo-bpm">{t.bpm} bpm</span>
        </div>
        <div className="tempo-load-meter" aria-hidden="true"><i style={{ width: `${t.load}%` }} /></div>
        <p style={{ marginTop: 12 }}>{t.tagline}</p>
      </div>
    );
  }

  if (slug === "silence") {
    const quiet = silence(b);
    return (
      <div className="inst-preview">
        {quiet.length === 0 ? (
          <p style={{ margin: 0 }}>Nothing is conspicuously under-covered right now.</p>
        ) : (
          quiet.slice(0, 6).map(({ story, gap }) => (
            <div key={story.id} className="ip-row">
              <span className="sil-gap">−{gap} gap</span>
              <span className="ip-hed">{story.headline}</span>
            </div>
          ))
        )}
      </div>
    );
  }

  // wire + half-life share a ranked list; half-life leads with the decay clock.
  const rows = b.stories.slice(0, 6);
  return (
    <div className="inst-preview">
      {rows.map((s, i) => {
        const hl = halfLife(s);
        return (
          <div key={s.id} className="ip-row">
            <span className="ip-rank">{i + 1}</span>
            <span className="ip-hed">{s.headline}</span>
            {slug === "half-life" ? (
              <span className="irow-half" style={{ marginLeft: "auto" }}>
                <span className="hl-bar" aria-hidden="true"><i style={{ width: `${hl.vitality}%` }} /></span>
                {fadeLabel(hl.hours, nowMs)}
              </span>
            ) : (
              <span className="irow-grav" style={{ marginLeft: "auto", fontSize: "0.9rem" }}>{s.score}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function FeaturePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) notFound();

  let b: BoardState | null = null;
  if (LIVE_DEMO.has(slug)) {
    b = await loadBoard();
    if (boardIsStale(b)) b = await runSweep();
    if (!b) b = SAMPLE_BOARD(new Date());
  }

  const idx = FEATURES.findIndex((x) => x.slug === slug);
  const next = FEATURES[(idx + 1) % FEATURES.length];

  return (
    <div className="inst">
      <Shell />
      <main id="house">
        <article className="inst-read">
          <span className="k">{STATUS_LABEL[f.status] ?? f.status}</span>
          <h1>{f.name}</h1>
          <p className="lead">{f.tagline}</p>

          {b && <LiveDemo slug={slug} b={b} />}

          <h2>How it works</h2>
          <p>{f.how}</p>

          <h2>What it shows you</h2>
          <p>{f.shows}</p>

          {f.status !== "live" && (
            <p style={{ color: "var(--ic-faint)", fontSize: "0.86rem", marginTop: 24 }}>
              {f.status === "calibrating"
                ? "This instrument is calibrating on live wire data now. It opens to readers as soon as it reads the day reliably."
                : "This instrument is in design. We are publishing the idea before the build, in the open — the way we publish everything else."}
            </p>
          )}

          <nav className="inst-read-nav" aria-label="Instrument navigation">
            <Link href="/">← The board</Link>
            <Link href={`/instrument/${next.slug}`}>{next.name} →</Link>
          </nav>
        </article>
      </main>
    </div>
  );
}
