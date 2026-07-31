import Link from "next/link";
import { Campaign, IssueHub, campaignsByHub } from "@/lib/action";

export function CampaignCard({ c }: { c: Campaign }) {
  return (
    <article className="campaign">
      <span className="cmp-issue">Campaign · {c.urgency}</span>
      <h3>{c.title}</h3>
      <p>{c.summary}</p>
      <div className="cmp-actions">
        {c.actions.slice(0, 2).map((a, i) => (
          <Link key={a.href + a.label} className={i === 0 ? "btn btn--small" : "btn btn--ghost btn--small"} href={a.href}>{a.label}</Link>
        ))}
      </div>
    </article>
  );
}

export function Spotlight({ c }: { c: Campaign }) {
  return (
    <article className="spotlight">
      <span className="mode mode--action" style={{ alignSelf: "flex-start" }}>Spotlight campaign · {c.urgency}</span>
      <h2>{c.title}</h2>
      <p className="spotlight-sum">{c.summary}</p>
      {c.whatsHappening && <p className="spotlight-what"><b>What&apos;s happening.</b> {c.whatsHappening}</p>}
      {c.whyItMatters && <p className="spotlight-why"><b>Why it matters.</b> {c.whyItMatters}</p>}
      <div className="cmp-actions">
        {c.actions.map((a, i) => (
          <Link key={a.href + a.label} className={i === 0 ? "btn btn--maroon" : "btn btn--ghost btn--small"} href={a.href}>{a.label}</Link>
        ))}
      </div>
      {c.related && c.related.length > 0 && (
        <div className="spotlight-related">
          <span>Connected:</span>
          {c.related.map((r) => <Link key={r.href} href={r.href}>{r.label}</Link>)}
        </div>
      )}
    </article>
  );
}

export function HubCard({ h }: { h: IssueHub }) {
  const n = campaignsByHub(h.slug).length;
  return (
    <Link href={`/action/${h.slug}`} className="hubcard" style={{ ["--ha" as any]: h.accent }}>
      <span className="hub-label">Issue Hub</span>
      <h3>{h.title}</h3>
      <p>{h.blurb}</p>
      <span className="hub-meta">{n} campaign{n === 1 ? "" : "s"} · Open issue hub →</span>
    </Link>
  );
}
