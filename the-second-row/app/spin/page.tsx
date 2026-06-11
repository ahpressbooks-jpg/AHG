import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Lens } from "@/components/StoryActions";
import { loadBoard } from "@/lib/store";

export const metadata: Metadata = { title: "The Spin Room", description: "The same facts, framed left, center, and right — side by side, live." };
export const dynamic = "force-dynamic";

export default async function SpinPage() {
  const board = await loadBoard();
  const multiFrame = (board?.stories ?? [])
    .filter((s) => {
      const sp = s.spread ?? { L: 0, C: 0, R: 0 };
      return [sp.L, sp.C, sp.R].filter((n) => n > 0).length >= 2;
    })
    .slice(0, 5);

  return (
    <>
      <SiteHeader current="/spin" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The Spin Room · live</div>
        <h1>Same facts. Three frames. Side by side.</h1>
        <p className="lede" style={{ maxWidth: "68ch" }}>
          The one move nobody else commits to: how the same story is being framed left, center,
          and right — in parallel, before anyone tells you where to land. Not to score the
          outlets. To make the framing visible so it stops working on you unannounced.
        </p>

        {multiFrame.length === 0 ? (
          <div className="card">
            <div className="card-kicker">The room is warming up</div>
            <p>
              No story on the current board is carried across enough of the spectrum yet to frame.
              The moment one is, its Lens appears here automatically. Meanwhile every dossier with
              two or more frames carries its own Lens.
            </p>
          </div>
        ) : (
          multiFrame.map((s) => (
            <div key={s.id} style={{ marginBottom: 36 }}>
              <h2 style={{ marginBottom: 4 }}>
                <Link href={`/wire/${s.id}`} style={{ textDecoration: "none" }}>{s.headline}</Link>
              </h2>
              <p className="mono" style={{ margin: "0 0 6px" }}>
                GRAVITY {s.score} · {s.owners} owners · L {s.spread?.L ?? 0} / C {s.spread?.C ?? 0} / R {s.spread?.R ?? 0}
              </p>
              <Lens sources={s.sources} />
            </div>
          ))
        )}

        <h2>Then — and only then — the desk</h2>
        <p style={{ maxWidth: "68ch" }}>
          The desk&apos;s verdicts live in <Link href="/column">the column</Link>, tagged{" "}
          <span className="tag tag--opinion">OPINION</span>, and entered on{" "}
          <Link href="/ledger">the Ledger</Link> when they make a call. You watch the framing
          happen first; then you weigh the verdict with your eyes open. Not your agreement — your
          judgment.
        </p>
      </div>
    </>
  );
}
