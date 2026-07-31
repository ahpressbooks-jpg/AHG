import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { Assignment, allAssignments } from "@/lib/extras";

export const metadata: Metadata = { title: "Investigations", description: "Open files, public research, and published investigations — a civic research lab built into TSR." };
export const dynamic = "force-dynamic";

const DEMO: Assignment[] = [
  { id: "i1", question: "Where did the deferred appropriations riders actually go?", detail: "Tracking the punted riders to their grave or their passage, with receipts.", goal: 25, backers: new Array(12).fill("x"), status: "open", at: new Date().toISOString() },
  { id: "i2", question: "Who funds the three most-cited 'independent' poll shops?", detail: "Following the money behind the pollsters the wire cites most.", goal: 25, backers: new Array(25).fill("x"), status: "commissioned", at: new Date().toISOString() },
  { id: "i3", question: "Every state's school-funding formula, normalized.", detail: "The numbers behind the statehouse fights, made comparable.", goal: 25, backers: new Array(8).fill("x"), status: "open", at: new Date().toISOString() },
];

export default async function InvestigationsPage() {
  const real = await allAssignments();
  const items = real.length ? real : DEMO;
  const openFiles = items.filter((a) => a.status === "open");
  const underReview = items.filter((a) => a.status === "commissioned");
  const published = items.filter((a) => a.status === "published");

  const Files = ({ list, cls, label }: { list: Assignment[]; cls: string; label: string }) =>
    list.length === 0 ? null : (
      <div className="files">
        {list.map((a) => (
          <article key={a.id} className={`file file--${cls}`}>
            <span className={`mode mode--investigated`}>{label}</span>
            <h3>{a.question}</h3>
            <p>{a.detail}</p>
            <div className="f-meta">{a.backers.length} backers{a.resultSlug ? <> · <Link href={`/column/${a.resultSlug}`}>read it →</Link></> : ""}</div>
          </article>
        ))}
      </div>
    );

  return (
    <>
      <SiteHeader current="/investigations" />
      <main className="wrap page">
        <div className="page-kicker" style={{ color: "#b45309" }}>Investigations · the research lab</div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>Open files. Public research.</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>
          Investigations at TSR are built in the open and, where possible, directed by readers. You can
          see what&apos;s being worked on, what&apos;s under review, what&apos;s published — and you can
          point us at what to dig into next.
        </p>
        {real.length === 0 && <p className="mono" style={{ color: "var(--slate)" }}>Showing sample files — the desk&apos;s live investigations appear here.</p>}

        <div className="fp-sechead" style={{ marginTop: 8 }}><span className="fp-kick" style={{ color: "var(--pulse)" }}>Open</span><h2>Open files</h2></div>
        <Files list={openFiles} cls="open" label="Open file" />

        {underReview.length > 0 && (<>
          <div className="fp-sechead" style={{ marginTop: "var(--fp-gap)" }}><span className="fp-kick" style={{ color: "var(--amber)" }}>In progress</span><h2>Under review</h2></div>
          <Files list={underReview} cls="review" label="Under review" />
        </>)}

        {published.length > 0 && (<>
          <div className="fp-sechead" style={{ marginTop: "var(--fp-gap)" }}><span className="fp-kick" style={{ color: "var(--verdict)" }}>Done</span><h2>Published investigations</h2></div>
          <Files list={published} cls="published" label="Published" />
        </>)}

        <div className="fp-sechead" style={{ marginTop: "var(--fp-gap)" }}><span className="fp-kick">Contribute</span><h2>Submit a lead</h2></div>
        <div className="action-boundary" style={{ borderStyle: "solid" }}>
          Got a document, a pattern, or a question that deserves digging? The newsroom runs on what
          readers point it at. <Link href="/tips">Send a lead — including securely →</Link> · or back an
          open file at <Link href="/assignment-desk">the Assignment Desk</Link> to push it into review.
        </div>
      </main>
    </>
  );
}
