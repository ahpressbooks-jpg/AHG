import type { Metadata } from "next";
import Link from "next/link";
import AssignmentList from "@/components/AssignmentList";
import SiteHeader from "@/components/SiteHeader";
import { Assignment, allAssignments } from "@/lib/extras";

export const metadata: Metadata = { title: "The Assignment Desk", description: "Readers pool their backing to commission the questions the desk investigates next." };
export const dynamic = "force-dynamic";

const DEMO: Assignment[] = [
  { id: "demo1", question: "Where did the deferred riders actually go?", detail: "The appropriations framework punted two riders to a separate vote. Back this and the desk tracks them to their grave or their passage — with receipts.", goal: 25, backers: new Array(9).fill("x"), status: "open", at: new Date().toISOString() },
  { id: "demo2", question: "Who funds the top three 'independent' poll shops?", detail: "Follow the money behind the pollsters the wire cites most. A standing reference piece.", goal: 25, backers: new Array(25).fill("x"), status: "commissioned", at: new Date().toISOString() },
];

export default async function AssignmentDeskPage() {
  const real = await allAssignments();
  const items = real.length ? real : DEMO;

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The Assignment Desk · reader-directed</div>
        <h1>You decide what gets investigated next.</h1>
        <p className="lede" style={{ maxWidth: "68ch" }}>
          The wire shows you what&apos;s happening. The Assignment Desk lets you point at what
          should be <em>dug into</em>. Back a question; when enough readers back it, the desk
          commissions itself to chase it down and shows the work — publicly, on the Ledger&apos;s
          terms. Journalism with the readers holding the assignment slip.
        </p>
        {real.length === 0 && <p className="mono" style={{ color: "var(--slate)" }}>Showing sample assignments — the desk&apos;s real questions appear here once posted.</p>}
        <AssignmentList initial={items} />
        <p className="mono" style={{ marginTop: 22, color: "var(--slate)" }}>
          Backing is intent, not a charge — it tells the desk where the room wants its hours spent.
          Results land in <Link href="/column">the column</Link> and link back here.
        </p>
      </div>
    </>
  );
}
