import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { YouActions } from "@/components/YouActions";
import { YourTilt } from "@/components/YourTilt";
import { isPaid, sessionUser } from "@/lib/auth";
import { getClips, getFollows, judgmentScore, userCalls, userComments } from "@/lib/records";

export const metadata: Metadata = { title: "Your Seat", description: "Every comment, clipping, and call you've ever made — findable day after day, never lost." };
export const dynamic = "force-dynamic";

export default async function YouPage() {
  const user = await sessionUser();

  if (!user) {
    return (
      <>
        <SiteHeader current="/you" />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">Your Seat</div>
          <h1>Take a seat. Keep it forever.</h1>
          <p className="lede">
            One email, no passwords — ever. Your comments, clippings, follows, calls, and
            Judgment Score live on the Permanent Record: log on any day, any device, and find
            every one of them. Download everything or delete everything, anytime, no support
            ticket.
          </p>
          <YouActions signedIn={false} paid={false} />
          <YourTilt />
        </div>
      </>
    );
  }

  const [comments, clips, follows, calls] = await Promise.all([
    userComments(user.id),
    getClips(user.id),
    getFollows(user.id),
    userCalls(user.id),
  ]);
  const js = judgmentScore(calls);
  const paid = isPaid(user);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <>
      <SiteHeader current="/you" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">
          Your Seat · {user.name} · {user.tier === "founding" ? `Founding № ${String(user.foundingNumber ?? 0).padStart(3, "0")}` : user.tier === "pro" ? "Second Row Pro" : "The Floor"}
          {!user.verified && " · unverified (email verification arrives with the mail desk)"}
        </div>
        <h1>Everything you&apos;ve touched. Nothing lost.</h1>

        <div className="cards cards--3">
          <div className="card"><span className="stat"><span className="stat-num">{js.score > 0 ? `+${js.score}` : js.score}</span><span className="stat-label">judgment score · {js.hits}H {js.misses}M {js.open} open</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{clips.length}</span><span className="stat-label">clippings{paid ? "" : " of 10"}</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{comments.length}</span><span className="stat-label">comments on the record</span></span></div>
        </div>

        <YouActions signedIn={true} paid={paid} />
        <YourTilt />

        <h2>Your clippings</h2>
        {clips.length === 0 ? <p className="mono">Empty drawer. The ✂ Clip button lives on every dossier.</p> : (
          <table><tbody>{clips.map((c) => (
            <tr key={c.storyId}><td className="mono">{fmt(c.at)}</td><td><Link href={`/wire/${c.storyId}`}>{c.headline}</Link></td></tr>
          ))}</tbody></table>
        )}

        <h2>Stories you follow</h2>
        {follows.length === 0 ? <p className="mono">None yet — follow a story and it taps your shoulder only when it develops.</p> : (
          <table><tbody>{follows.map((c) => (
            <tr key={c.storyId}><td className="mono">{fmt(c.at)}</td><td><Link href={`/wire/${c.storyId}`}>{c.headline}</Link></td></tr>
          ))}</tbody></table>
        )}

        <h2>Your Ledger</h2>
        {calls.length === 0 ? <p className="mono">No calls yet. The ⚖ button on any dossier puts you on the record.</p> : (
          <table>
            <thead><tr><th>Dated</th><th>The call</th><th>Confidence</th><th>Result</th></tr></thead>
            <tbody>{calls.map((c) => (
              <tr key={c.id}>
                <td className="mono">{fmt(c.at)}</td>
                <td>{c.claim}<div className="mono" style={{ color: "var(--slate)" }}><Link href={`/wire/${c.storyId}`}>{c.storyHeadline}</Link></div></td>
                <td><span className="tag">{c.confidence}</span></td>
                <td className={c.result === "HIT" ? "ledger-hit" : c.result === "MISS" ? "ledger-miss" : "ledger-open"}>{c.result ?? "OPEN"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}

        <h2>Your comments</h2>
        {comments.length === 0 ? <p className="mono">The room hasn&apos;t heard from you yet.</p> : (
          <table><tbody>{comments.slice(0, 50).map((c) => (
            <tr key={c.id}>
              <td className="mono">{fmt(c.at)}</td>
              <td>
                {c.sealed ? "🔒 " : ""}{c.text.slice(0, 140)}{c.text.length > 140 ? "…" : ""}
                <div className="mono" style={{ color: "var(--slate)" }}>
                  <Link href={c.target.startsWith("story:") ? `/wire/${c.target.slice(6)}` : `/column/${c.target.slice(5)}`}>where it lives →</Link>
                  {c.minds > 0 && <span className="minds"> · {c.minds} minds changed</span>}
                  {c.status === "held" && " · awaiting the desk"}
                </div>
              </td>
            </tr>
          ))}</tbody></table>
        )}
      </div>
    </>
  );
}
