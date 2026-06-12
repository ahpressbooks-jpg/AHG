import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { isPaid, sessionUser } from "@/lib/auth";
import { deskCalls, judgmentScore, recentCalls } from "@/lib/records";

export const metadata: Metadata = { title: "The Ledger", description: "Every call, dated and confidence-tagged, scored in public — the desk's and the room's." };
export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  const [calls, reader, user] = await Promise.all([deskCalls(), recentCalls(500), sessionUser()]);
  const paid = isPaid(user);
  const hits = calls.filter((c) => c.result === "HIT").length;
  const misses = calls.filter((c) => c.result === "MISS").length;
  const open = calls.filter((c) => !c.result).length;

  // The room's leaderboard: judgment scores from resolved reader calls.
  const byUser = new Map<string, { name: string; calls: typeof reader }>();
  for (const c of reader) {
    const e = byUser.get(c.userId) ?? { name: c.name, calls: [] as typeof reader };
    e.calls.push(c);
    byUser.set(c.userId, e);
  }
  const leaderboard = [...byUser.entries()]
    .map(([id, e]) => ({ id, name: e.name, ...judgmentScore(e.calls) }))
    .filter((e) => e.hits + e.misses > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <>
      <SiteHeader current="/ledger" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Accountability Ledger</div>
        <h1>The desk keeps score on itself. So can you.</h1>

        <div className="cards cards--3">
          <div className="card"><span className="stat"><span className="stat-num ledger-hit">{hits}</span><span className="stat-label">hits</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num ledger-miss">{misses}</span><span className="stat-label">misses — published first</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num ledger-open">{open}</span><span className="stat-label">open — reality deciding</span></span></div>
        </div>

        <h2>The desk&apos;s calls</h2>
        {calls.length === 0 ? (
          <p>
            The tally begins the day the desk goes live and is never reset. Every prediction gets
            a confidence the day it&apos;s made — <span className="tag">CERTAIN</span>{" "}
            <span className="tag">LIKELY</span> <span className="tag">GUESSING</span> — then
            reality decides. No quiet edits. Misses go up first.
          </p>
        ) : (
          <table>
            <thead>
              <tr><th>Dated</th><th>The call</th><th>Confidence</th><th>Result</th></tr>
            </thead>
            <tbody>
              {calls.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{new Date(c.at).toLocaleDateString([], { month: "short", day: "numeric" })}</td>
                  <td>
                    {c.claim}
                    {c.workings && (paid ? <div className="mono" style={{ color: "var(--slate)", marginTop: 4 }}>workings: {c.workings}</div> : <div className="mono" style={{ color: "var(--slate)", marginTop: 4 }}><Link href="/subscribe">workings → Pro</Link></div>)}
                    {c.resolutionNote && <div className="mono" style={{ color: "var(--slate)", marginTop: 4 }}>settled: {c.resolutionNote}</div>}
                  </td>
                  <td><span className="tag">{c.confidence}</span></td>
                  <td className={c.result === "HIT" ? "ledger-hit" : c.result === "MISS" ? "ledger-miss" : "ledger-open"}>{c.result ?? "OPEN"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Your Ledger — the room&apos;s judgment</h2>
        <p>
          Make calls on any live story (the ⚖ button on every dossier), tagged with your
          confidence. Reality decides; the desk marks the result; your{" "}
          <strong>Judgment Score</strong> compounds. The platform that trains judgment lets you
          practice it.
        </p>
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr><th>#</th><th>Judge</th><th>Score</th><th>Record</th></tr>
            </thead>
            <tbody>
              {leaderboard.map((e, i) => (
                <tr key={e.id}>
                  <td className="mono">{i + 1}</td>
                  <td><Link href={`/reader/${e.id}`}>{e.name}</Link></td>
                  <td className="mono">{e.score > 0 ? `+${e.score}` : e.score}</td>
                  <td className="mono"><span className="ledger-hit">{e.hits}H</span> · <span className="ledger-miss">{e.misses}M</span> · {e.open} open</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mono">The leaderboard seats its first judges when the first calls resolve. Yours could be on it — <Link href="/">pick a story</Link>.</p>
        )}

        <h2>How an entry lives</h2>
        <table>
          <tbody>
            <tr><td className="mono">1 · Call it</td><td>The claim, dated, confidence attached the day it&apos;s made.</td></tr>
            <tr><td className="mono">2 · Leave it</td><td>Frozen. Reality settles it, not edits.</td></tr>
            <tr><td className="mono">3 · Mark it</td><td>Hit or miss, in the open — misses first.</td></tr>
            <tr><td className="mono">4 · Tally it</td><td>Forever. The record is the credential.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
