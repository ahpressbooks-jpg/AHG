import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { backAssignment } from "@/lib/extras";

export const dynamic = "force-dynamic";

/** Readers back an Assignment-Desk question — intent, not a charge. */
export async function POST(req: NextRequest) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Take a seat first — sign in to back a question." }, { status: 401 });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const id = String(body?.id ?? "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const a = await backAssignment(id, user.id);
  if (!a) return NextResponse.json({ error: "No such assignment." }, { status: 404 });
  return NextResponse.json({
    ok: true,
    assignment: a,
    note: a.status === "commissioned" ? "Funded — the desk takes the assignment. You'll get the result." : "Pledge in. Bring a friend to push it over the line.",
  });
}
