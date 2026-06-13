import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { judgmentScore, recentCalls } from "@/lib/records";

export const metadata: Metadata = { title: "Judgment Seasons", description: "Quarterly tournaments of calibration — the room's best judges, scored." };
export const dynamic = "force-dynamic";

function seasonOf(d: Date): { label: string; start: number; end: number } {
  const y = d.getFullYear();
  const q = Math.floor(d.getMonth() / 3);
  const start = new Date(y, q * 3, 1).getTime();
  const end = new Date(y, q * 3 + 3, 1).getTime();
  return { label: `${["Winter", "Spring", "Summer", "Autumn"][q]} ${y}`, start, end };
}

export default async function SeasonsPage() {
  const now = new Date();
  const season = seasonOf(now);
  const calls = (await recentCalls(1000)).filter((c) => {
    const t = +new Date(c.at);
    return t >= season.start && t < season.end;
  });

  const byUser = new Map<string, { name: string; calls: typeof calls }>();
  for (const c of calls) {
    const e = byUser.get(c.userId) ?? { name: c.name, calls: [] as typeof calls };
    e.calls.push(c);
    byUser.set(c.userId, e);
  }
  const board = [...byUser.entries()]
    .map(([id, e]) => ({ id, name: e.name, ...judgmentScore(e.calls) }))
    .filter((e) => e.hits + e.misses > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);

  const daysLeft = Math.ceil((season.end - now.getTime()) / 86400_000);

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Judgment Seasons · {season.label}</div>
        <h1>Calibration, as a sport.</h1>
        <p className="lede">
          Every quarter is a season. Make scored calls on live stories; reality settles them; the
          best-calibrated judge on the board when the season closes wins a year of Founding
          membership. {daysLeft} day{daysLeft === 1 ? "" : "s"} left in {season.label}.
        </p>

        <h2>This season&apos;s standings</h2>
        {board.length === 0 ? (
          <div className="card">
            <div className="card-kicker">The season is young</div>
            <p>No settled calls yet this quarter. Make one from any dossier&apos;s ⚖ button — first blood on the leaderboard is up for grabs.</p>
          </div>
        ) : (
          <table>
            <thead><tr><th>#</th><th>Judge</th><th>Score</th><th>Record</th></tr></thead>
            <tbody>
              {board.map((e, i) => (
                <tr key={e.id}>
                  <td className="mono">{i === 0 ? "👑 1" : i + 1}</td>
                  <td><Link href={`/reader/${e.id}`}>{e.name}</Link></td>
                  <td className="mono">{e.score > 0 ? `+${e.score}` : e.score}</td>
                  <td className="mono"><span className="ledger-hit">{e.hits}H</span> · <span className="ledger-miss">{e.misses}M</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>How scoring works</h2>
        <p>
          A correct CERTAIN call is worth 3, LIKELY 2, GUESSING 1 — and a wrong one costs the same.
          Confidence cuts both ways, so bravado is punished and calibration is rewarded. The
          all-time tally lives on <Link href="/ledger">the Ledger</Link>; seasons just reset the
          race four times a year so newcomers always have a live shot.
        </p>
      </div>
    </>
  );
}
