import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getUser, judgmentScore, userCalls, userComments } from "@/lib/records";

export const dynamic = "force-dynamic";

// THE PUBLIC SEAT — a reader's track record, in the open: the Ledger
// philosophy applied to everyone. Email never shown; sealed takes never
// leak; private seats stay private.
export default async function ReaderProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = /^[\w-]+$/.test(id) ? await getUser(id) : null;

  if (!user || user.publicProfile === false) {
    return (
      <>
        <SiteHeader />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">The Room</div>
          <h1>This seat keeps to itself.</h1>
          <p>No public profile here — either it doesn&apos;t exist, or its owner turned the lights off. <Link href="/">Back to the house</Link>.</p>
        </div>
      </>
    );
  }

  const [comments, calls] = await Promise.all([userComments(user.id), userCalls(user.id)]);
  const visible = comments.filter((c) => c.status === "live");
  const js = judgmentScore(calls);
  const color = user.seatColor ?? "#8A1F35";
  const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const tierLabel = user.tier === "founding" ? `Founding Member № ${String(user.foundingNumber ?? 0).padStart(3, "0")}` : user.tier === "pro" ? "Second Row Pro" : "The Floor";

  return (
    <>
      <SiteHeader />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Room · a seat&apos;s public record</div>
        <div className="profile-head">
          <span className="avatar avatar--big" style={{ background: color }} aria-hidden="true">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>{user.name}</h1>
            <p className="mono" style={{ margin: "4px 0 0", color: "var(--slate)" }}>
              {tierLabel} · seated {fmt(user.createdAt)}
            </p>
          </div>
        </div>
        {user.bio && <p className="lede">{user.bio}</p>}

        <div className="cards cards--3">
          <div className="card"><span className="stat"><span className="stat-num">{js.score > 0 ? `+${js.score}` : js.score}</span><span className="stat-label">judgment score</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num"><span className="ledger-hit">{js.hits}</span>·<span className="ledger-miss">{js.misses}</span></span><span className="stat-label">hits · misses ({js.open} open)</span></span></div>
          <div className="card"><span className="stat"><span className="stat-num">{visible.reduce((a, c) => a + c.minds, 0)}</span><span className="stat-label">minds changed in the room</span></span></div>
        </div>

        <h2>Their calls, on the record</h2>
        {calls.length === 0 ? (
          <p className="mono">No calls yet — judgment pending.</p>
        ) : (
          <table>
            <thead><tr><th>Dated</th><th>The call</th><th>Confidence</th><th>Result</th></tr></thead>
            <tbody>
              {calls.slice(0, 30).map((c) => (
                <tr key={c.id}>
                  <td className="mono">{fmt(c.at)}</td>
                  <td>{c.claim}<div className="mono" style={{ color: "var(--slate)" }}><Link href={`/wire/${c.storyId}`}>{c.storyHeadline.slice(0, 70)}</Link></div></td>
                  <td><span className="tag">{c.confidence}</span></td>
                  <td className={c.result === "HIT" ? "ledger-hit" : c.result === "MISS" ? "ledger-miss" : "ledger-open"}>{c.result ?? "OPEN"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>In the room</h2>
        {visible.length === 0 ? (
          <p className="mono">Quiet so far.</p>
        ) : (
          visible.slice(0, 30).map((c) => (
            <div key={c.id} className="comment">
              <div className="comment-meta">
                <span className={`comment-badge comment-badge--${c.certainty.toLowerCase()}`}>{c.certainty}</span>
                {c.sealed && <span className="comment-badge comment-badge--sealed">SEALED TAKE</span>}
                {c.minds > 0 && <span className="minds">{c.minds} minds changed</span>}
                <span>{fmt(c.at)}</span>
              </div>
              <div className="comment-body">{c.sealed ? "🔒 Sealed — opens where it lives, when the story resolves." : c.text}</div>
              <div className="comment-actions">
                <Link href={c.target.startsWith("story:") ? `/wire/${c.target.slice(6)}` : `/column/${c.target.slice(5)}`} style={{ fontFamily: "var(--mono)", fontSize: "0.64rem", color: "var(--slate)" }}>
                  where it lives →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
