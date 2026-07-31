import { NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { addSubmission, getSubmissions, responseRate } from "@/lib/well";

export const dynamic = "force-dynamic";

// GET the public queue + response-rate. POST a submission (name taken from the
// signed-in seat when present; open otherwise until accounts gate it in Phase 4).
export async function GET() {
  const subs = await getSubmissions();
  return NextResponse.json({ submissions: subs, rate: responseRate(subs) });
}

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const title = String(body?.title ?? "").trim().slice(0, 160);
  const area = String(body?.area ?? "").trim().slice(0, 60);
  const problem = String(body?.problem ?? "").trim().slice(0, 4000);
  const proposal = String(body?.proposal ?? "").trim().slice(0, 6000);
  const fullText = body?.fullText ? String(body.fullText).slice(0, 20000) : undefined;
  if (!title || !problem || !proposal) {
    return NextResponse.json({ error: "title, problem, and proposal are required" }, { status: 400 });
  }

  const user = await sessionUser();
  const sub = await addSubmission({
    title, area, problem, proposal, fullText,
    byName: user?.name || (body?.byName ? String(body.byName).slice(0, 60) : "A reader"),
  });
  return NextResponse.json({ ok: true, id: sub.id, note: "In the queue. Every serious submission gets a public response." });
}
