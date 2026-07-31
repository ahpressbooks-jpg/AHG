import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { ROSTER } from "@/lib/sources";
import { loadBoard } from "@/lib/store";

export const metadata: Metadata = { title: "The Tilt Meter", description: "The board's own balance, measured live and published — before a critic does it for us." };
export const dynamic = "force-dynamic";

const COLORS = { L: "#2E5BFF", C: "#9AA6B2", R: "#8A1F35" } as const;

function Bar({ l, c, r }: { l: number; c: number; r: number }) {
  const total = Math.max(1, l + c + r);
  return (
    <>
      <div className="tiltbar" role="img" aria-label={`left ${l}, center ${c}, right ${r}`}>
        <span style={{ width: `${(l / total) * 100}%`, background: COLORS.L }} />
        <span style={{ width: `${(c / total) * 100}%`, background: COLORS.C }} />
        <span style={{ width: `${(r / total) * 100}%`, background: COLORS.R }} />
      </div>
      <div className="tilt-legend">
        <span><span className="tilt-dot" style={{ background: COLORS.L }} />Left {l}</span>
        <span><span className="tilt-dot" style={{ background: COLORS.C }} />Center {c}</span>
        <span><span className="tilt-dot" style={{ background: COLORS.R }} />Right {r}</span>
      </div>
    </>
  );
}

export default async function TiltPage() {
  const board = await loadBoard();
  const stories = board?.stories ?? [];

  // The board's source mix right now.
  const mix = { L: 0, C: 0, R: 0 };
  for (const s of stories) for (const src of s.sources) mix[src.lean ?? "C"]++;

  // The roster's standing composition.
  const roster = { L: 0, C: 0, R: 0 };
  for (const r of ROSTER) roster[r.lean]++;

  // Stories carried by only one side — the watchlist.
  const oneSided = stories.filter((s) => {
    const sp = s.spread ?? { L: 0, C: 0, R: 0 };
    const sides = [sp.L > 0, sp.C > 0, sp.R > 0].filter(Boolean).length;
    return s.owners >= 2 && sides === 1;
  });

  const total = Math.max(1, mix.L + mix.C + mix.R);
  const drift = (mix.R - mix.L) / total; // −1 all-left … +1 all-right
  const verdict =
    Math.abs(drift) < 0.12 ? "BALANCED" : drift > 0 ? `TILTING RIGHT ${(drift * 100).toFixed(0)}%` : `TILTING LEFT ${(Math.abs(drift) * 100).toFixed(0)}%`;

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Tilt Meter · live · self-audit</div>
        <h1>Our balance, measured — before a critic does it for us.</h1>
        <p className="lede">
          No newsroom on earth publishes its own bias telemetry in real time. This page is the
          board auditing itself, every sweep: where today&apos;s sourcing actually came from, and
          which stories are only being told by one side.
        </p>

        <h2>The board&apos;s source mix right now</h2>
        <Bar l={mix.L} c={mix.C} r={mix.R} />
        <p className="mono" style={{ marginTop: 10 }}>
          verdict this sweep: <strong>{verdict}</strong> · {stories.length} stories ·{" "}
          {mix.L + mix.C + mix.R} source placements
        </p>

        <h2>The roster&apos;s standing composition</h2>
        <Bar l={roster.L} c={roster.C} r={roster.R} />
        <p>
          The roster is the desk&apos;s deliberate spread of outlets (each labeled by public
          lean indices — labels describe outlet positioning, never story truth). The desk owns
          the roster file; changing it shows here immediately.
        </p>

        <h2>One-sided coverage watchlist</h2>
        {oneSided.length === 0 ? (
          <p className="mono">Clear — every multi-source story on the board is carried by more than one side of the spectrum.</p>
        ) : (
          <table>
            <thead><tr><th>Story</th><th>Carried only by</th></tr></thead>
            <tbody>
              {oneSided.map((s) => {
                const sp = s.spread!;
                const side = sp.L > 0 ? "the left" : sp.R > 0 ? "the right" : "the center";
                return (
                  <tr key={s.id}>
                    <td><Link href={`/wire/${s.id}`}>{s.headline}</Link></td>
                    <td className="mono">{side}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <p>
          Want your own mirror? <Link href="/you">Your Seat</Link> shows <strong>Your Tilt</strong> —
          the framing spread of what <em>you&apos;ve</em> been reading. Private to you, always.
        </p>
      </div>
    </>
  );
}
