import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { newId, pushUserIntake } from "@/lib/records";
import { kvGet, kvSet, listPush } from "@/lib/store";

export const dynamic = "force-dynamic";

const KINDS = ["report-harm", "submit-issue", "volunteer", "share-experience"] as const;

// The Action Center intake — report harm, submit a local issue, volunteer, or
// add lived experience. Stored on the Permanent Record for the desk to triage.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const kind = KINDS.includes(body?.kind) ? body.kind : "submit-issue";
  const summary = String(body?.summary ?? "").trim();
  if (summary.length < 10) return NextResponse.json({ error: "Tell us a little more — at least a sentence." }, { status: 400 });
  if (summary.length > 6000) return NextResponse.json({ error: "That's very long — trim to the essentials and we'll follow up." }, { status: 400 });

  // light rate limit per IP-ish key (no IP available; use a soft global cooldown cookie)
  const guardKey = `tsr:intakeguard:${(body?.contact || "anon").toString().slice(0, 80)}`;
  if (await kvGet(guardKey)) return NextResponse.json({ error: "Got your last one — give it a minute before sending another." }, { status: 429 });
  await kvSet(guardKey, "1", 30);

  const user = await sessionUser();
  const entry = {
    id: newId("intake"),
    kind,
    userId: user?.id,
    name: String(body?.name ?? "").slice(0, 120) || (user?.name ?? ""),
    contact: String(body?.contact ?? "").slice(0, 200),
    topic: String(body?.topic ?? "").slice(0, 120),
    roles: Array.isArray(body?.roles) ? body.roles.slice(0, 10).map((r: any) => String(r).slice(0, 60)) : [],
    summary: summary.slice(0, 6000),
    consent: Boolean(body?.consent),
    at: new Date().toISOString(),
    status: "new",
  };
  await listPush("tsr:intake", JSON.stringify(entry), 5000);
  await listPush(`tsr:intake:${kind}`, JSON.stringify(entry), 5000);
  if (user) await pushUserIntake(user.id, entry);

  const note =
    kind === "report-harm" ? "Received. The desk reviews every report — we protect sources and verify before we publish."
    : kind === "volunteer" ? "Thank you. We'll reach out when there's a role that fits what you offered."
    : kind === "share-experience" ? "On the record. Lived experience is evidence; we treat it with care."
    : "Received. If it's local and others are missing it, that's exactly what we want to know.";
  return NextResponse.json({ ok: true, note });
}
