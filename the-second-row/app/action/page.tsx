import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import IntakeForm from "@/components/action/IntakeForm";
import { CampaignCard, HubCard, Spotlight } from "@/components/action/cards";
import { CAMPAIGNS, ISSUE_HUBS, RESOURCES, TAKE_ACTION, spotlights } from "@/lib/action";

export const metadata: Metadata = {
  title: "Action Center",
  description: "TSR's public movement hub — track issues, join campaigns, access tools, report harm, and turn civic clarity into civic action.",
};

export default function ActionCenter() {
  const spots = spotlights();
  const grid = CAMPAIGNS.filter((c) => !c.spotlight);

  return (
    <>
      <SiteHeader current="/action" />
      <main className="wrap action-page">
        {/* 1 · HERO */}
        <section className="act-hero">
          <span className="mode mode--action">The Action Center</span>
          <h1>Action needs receipts.</h1>
          <p className="act-hero-sum">
            TSR&apos;s public movement hub — a place to track issues, join campaigns, access tools, report
            harm, and help turn civic clarity into civic action. This is where reporting, investigation,
            and lived reality get organized into something people can actually use.
          </p>
          <p className="act-hero-line">Read clearly. Organize honestly. Move with evidence.</p>
          <div className="act-hero-cta">
            <Link className="btn btn--maroon" href="#campaigns">Take action now</Link>
            <Link className="btn btn--ghost" href="#hubs">Explore issues</Link>
            <Link className="btn btn--ghost" href="#intake">Submit an issue</Link>
          </div>
          <div className="act-strip">
            <span><b>{CAMPAIGNS.length}</b> active campaigns</span>
            <span><b>{ISSUE_HUBS.length}</b> open issue tracks</span>
            <span><b>The Room</b> upcoming sessions</span>
            <span><b>7</b> ways to volunteer</span>
          </div>
        </section>

        {/* 2 · URGENT SPOTLIGHT */}
        {spots[0] && <Spotlight c={spots[0]} />}

        {/* 3 · CAMPAIGNS GRID */}
        <section id="campaigns" className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick" style={{ color: "var(--crimson)" }}>Active</span><h2>Current campaigns</h2></div>
          <div className="campaigns campaigns--3">
            {spots[1] && <CampaignCard c={spots[1]} />}
            {grid.map((c) => <CampaignCard key={c.slug} c={c} />)}
          </div>
        </section>

        {/* 4 · ISSUE HUBS */}
        <section id="hubs" className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">The library</span><h2>Issue hubs</h2></div>
          <div className="hubgrid">
            {ISSUE_HUBS.map((h) => <HubCard key={h.slug} h={h} />)}
          </div>
        </section>

        {/* 5 · TAKE ACTION NOW */}
        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">Right now</span><h2>Take action</h2></div>
          <div className="takegrid">
            {TAKE_ACTION.map((t) => (
              <Link key={t.label} href={t.href} className="takecard">
                <span className="take-label">Action</span>
                <span className="take-title">{t.label}</span>
                <span className="take-desc">{t.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6 · VOLUNTEER */}
        <section id="volunteer" className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">Organize</span><h2>Volunteer &amp; organize</h2></div>
          <div className="act-twocol">
            <div>
              <p className="lede" style={{ marginTop: 0 }}>
                TSR is building a serious public-interest platform and needs people who can help think,
                document, investigate, organize, and follow through.
              </p>
              <p>You do not need a title to be useful. You need honesty, care, and a willingness to contribute.</p>
            </div>
            <IntakeForm kind="volunteer" />
          </div>
        </section>

        {/* 7 · EVENTS / ROOM */}
        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">Together</span><h2>Events &amp; The Room</h2><Link className="fp-more" href="/room">The Room →</Link></div>
          <p style={{ maxWidth: "62ch", marginTop: -6 }}>The Room is where action becomes conversation, practice, and participation. The Action Center feeds directly into it.</p>
          <div className="takegrid">
            {["Next civic session", "Issue briefing", "Youth roundtable", "Community discussion", "Action workshop"].map((e) => (
              <Link key={e} href="/room" className="takecard">
                <span className="take-label" style={{ color: "var(--pulse)" }}>Event</span>
                <span className="take-title">{e}</span>
                <span className="take-desc">In The Room — see the schedule and join.</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 8 · RESOURCES */}
        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">To begin</span><h2>Resources &amp; toolkits</h2><Link className="fp-more" href="/toolkit">The Toolkit →</Link></div>
          <p style={{ maxWidth: "62ch", marginTop: -6 }}>Not everyone needs the same first step. Some need context, some need language, some need a tool, some need a place to begin.</p>
          <div className="campaigns campaigns--3">
            {RESOURCES.map((r) => (
              <Link key={r.title} href={r.href} className="rescard">
                <span className="mode mode--methodology">Resource</span>
                <span className="res-title">{r.title}</span>
                <span className="res-desc">{r.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 9 · MOMENTUM */}
        <section className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick">Momentum</span><h2>What&apos;s accumulating</h2></div>
          <p style={{ maxWidth: "62ch", marginTop: -6 }}>People need to see that public attention can accumulate, not just disappear. As campaigns run, this fills with real updates — issues tracked, discussions hosted, submissions logged, outcomes recorded.</p>
          <div className="momentum">
            <div className="mo"><span className="mo-n">{CAMPAIGNS.length}</span><span className="mo-l">campaigns active</span></div>
            <div className="mo"><span className="mo-n">{ISSUE_HUBS.length}</span><span className="mo-l">issue hubs open</span></div>
            <div className="mo"><span className="mo-n">∞</span><span className="mo-l">on the public record <Link href="/ledger">→ Ledger</Link></span></div>
            <div className="mo"><span className="mo-n">Live</span><span className="mo-l">open files <Link href="/investigations">→ Investigations</Link></span></div>
          </div>
        </section>

        {/* 10 · REPORT HARM / SUBMIT ISSUE */}
        <section id="intake" className="fp-sec">
          <div className="fp-sechead"><span className="fp-kick" style={{ color: "var(--crimson)" }}>Open intake</span><h2>Report harm · submit an issue</h2></div>
          <p style={{ maxWidth: "62ch", marginTop: -6 }}>Have a pattern, document, timeline, or local issue others are missing? Start here. This is safe, direct, and non-performative — the desk reviews every submission, protects sources, and verifies before publishing.</p>
          <div className="act-twocol">
            <IntakeForm kind="report-harm" />
            <IntakeForm kind="submit-issue" />
          </div>
        </section>

        {/* 11 · FUTURE / INSTITUTION */}
        <section className="joinband" style={{ marginTop: "var(--fp-gap)" }}>
          <h2>This is built to grow.</h2>
          <p>Local pages, state pages, chapter-like organizing, coalition pages, petitions, and issue alerts are part of the architecture. The Action Center is where TSR turns reporting, investigation, and public memory into public action — not outrage for content, but structure for people who want to do something.</p>
          <div className="jb-row">
            <Link className="btn" href="#volunteer" style={{ color: "var(--bg)", background: "var(--ink)" }}>Help build it</Link>
            <Link className="btn btn--ghost" href="/about" style={{ color: "inherit", borderColor: "currentColor" }}>Why TSR exists</Link>
          </div>
        </section>
        <div style={{ height: 50 }} />
      </main>
    </>
  );
}
