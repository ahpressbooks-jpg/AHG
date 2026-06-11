import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { createPortal, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing opens at launch." }, { status: 501 });
  }
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  try {
    const url = await createPortal(user, base);
    return NextResponse.json({ ok: true, url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "portal failed" }, { status: 502 });
  }
}
