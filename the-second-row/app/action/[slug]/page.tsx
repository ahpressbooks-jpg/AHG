import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import IntakeForm from "@/components/action/IntakeForm";
import { CampaignCard } from "@/components/action/cards";
import { ISSUE_HUBS, RESOURCES, campaignsByHub, hubBySlug } from "@/lib/action";

export function generateStaticParams() {
  return ISSUE_HUBS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = hubBySlug(slug);
  return { title: h ? `${h.title} · Action Center` : "Issue Hub", description: h?.blurb };
}

export default async function IssueHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = hubBySlug(slug);

  if (!hub) {
    return (
      <>
        <SiteHeader current="/action" />
        <main className="wrap wrap--reading page">
          <div className="page-kicker">Action Center</div>
          <h1>No such issue hub.</h1>
          <p><Link href="/action">Back to the Action Center →</Link></p>
        </main>
      </>
    );
  }

  const campaigns = campaignsByHub(hub.slug);

  return (
    <>
      <SiteHeader current="/action" />
      <main className="wrap action-page">
        <div style={{ paddingTop: 18 }}>
          <Link className="fp-more" href="/action" style={{ marginLeft: 0 }}>← The Action Center</Link>
        </div>
        <section className="act-hero" style={{ ["--ha" as any]: hub.accent, borderTopColor: hub.accent }}>
          <span className="hub-label" style={{ color: hub.accent }}>Issue Hub</span>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>{hub.title}</h1>
          <p className="act-hero-sum">{hub.blurb}</p>
          <div className="act-hero-cta">
            <Link className="btn btn--maroon" href="#intake">Report on this issue</Link>
            <Link className="btn btn--ghost" href="/ledger">Track it on the Ledger</Link>
            <Link className="btn btn--ghost" href="/investigations">Open files</Link>
          </div>
        </section>

        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick" style={{ color: "var(--crimson)" }}>Campaigns</span><h2>What we&apos;re working on</h2></div>
          {campaigns.length > 0 ? (
            <div className="campaigns campaigns--3">{campaigns.map((c) => <CampaignCard key={c.slug} c={c} />)}</div>
          ) : (
            <p className="house-note" style={{ textTransform: "none", letterSpacing: 0 }}>No campaigns on this hub yet — submit a lead below and help open the first file.</p>
          )}
        </section>

        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">To begin</span><h2>Resources</h2></div>
          <div className="campaigns campaigns--3">
            {RESOURCES.slice(0, 3).map((r) => (
              <Link key={r.title} href={r.href} className="rescard">
                <span className="mode mode--methodology">Resource</span>
                <span className="res-title">{r.title}</span>
                <span className="res-desc">{r.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="intake" className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick" style={{ color: "var(--crimson)" }}>Open intake</span><h2>Add to this issue</h2></div>
          <div className="act-twocol">
            <IntakeForm kind="submit-issue" />
            <IntakeForm kind="share-experience" />
          </div>
        </section>
        <div style={{ height: 50 }} />
      </main>
    </>
  );
}
