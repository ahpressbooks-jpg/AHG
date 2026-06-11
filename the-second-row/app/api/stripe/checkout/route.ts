import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { createCheckout, PriceKey, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Payments open at launch — the tiers are real, the till isn't plugged in yet." },
      { status: 501 }
    );
  }
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first — your seat needs a name." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const price = body?.price as PriceKey;
  if (!["pro_month", "pro_year", "founding"].includes(price)) {
    return NextResponse.json({ error: "unknown price" }, { status: 400 });
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  try {
    const url = await createCheckout(user, price, base);
    return NextResponse.json({ ok: true, url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "checkout failed" }, { status: 502 });
  }
}
