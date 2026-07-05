import { NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { getTracked, toggleTracked } from "@/lib/records";

export const dynamic = "force-dynamic";

// The tracked-candidates watchlist, tied to the reader's seat.
// GET  → the current list (+ whether they're signed in).
// POST → toggle a candidate on/off the list. Requires sign-in.
export async function GET() {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ tracked: [], signedIn: false });
  const tracked = await getTracked(user.id);
  return NextResponse.json({ tracked, signedIn: true });
}

export async function POST(req: Request) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Sign in to track candidates." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const c = body?.candidate;
  if (!c || !c.id || !c.name || !["H", "S", "G"].includes(c.office) || !c.state) {
    return NextResponse.json({ error: "candidate {id,name,office,state} required" }, { status: 400 });
  }

  const { tracked, added } = await toggleTracked(user.id, {
    id: String(c.id),
    name: String(c.name),
    office: c.office,
    state: String(c.state).toUpperCase(),
    district: c.district ? String(c.district) : undefined,
    party: c.party ? String(c.party) : undefined,
  });
  return NextResponse.json({ tracked, added });
}
