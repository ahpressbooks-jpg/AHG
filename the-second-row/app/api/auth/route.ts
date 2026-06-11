import { NextRequest, NextResponse } from "next/server";
import { clearCookie, emailConfigured, sendMagicLink, sessionCookie } from "@/lib/auth";
import { findOrCreateUser } from "@/lib/records";
import { kvGet, kvSet } from "@/lib/store";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body?.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(clearCookie());
    return res;
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim().slice(0, 60);
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "That address doesn't parse." }, { status: 400 });
  }

  // Rate limit sign-in attempts per address.
  const guard = await kvGet(`tsr:authguard:${email}`);
  if (guard) return NextResponse.json({ error: "Easy — try again in a minute." }, { status: 429 });
  await kvSet(`tsr:authguard:${email}`, "1", 45);

  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  if (emailConfigured()) {
    const sent = await sendMagicLink(email, name, base);
    if (!sent) return NextResponse.json({ error: "The mail desk hiccuped — try again." }, { status: 502 });
    return NextResponse.json({ ok: true, mode: "magic", note: "Check your email — your seat link is on its way. It works once and expires in 15 minutes." });
  }

  // Open-door mode: no email provider attached yet. Account created on the
  // spot, marked unverified; verification turns on with RESEND_API_KEY.
  const user = await findOrCreateUser(email, name, false);
  const res = NextResponse.json({
    ok: true,
    mode: "open",
    note: "Seat taken. (Email verification switches on when the mail desk is connected.)",
    user: { id: user.id, name: user.name, tier: user.tier },
  });
  res.cookies.set(sessionCookie(user.id));
  return res;
}
