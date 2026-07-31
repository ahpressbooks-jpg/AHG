import { NextRequest, NextResponse } from "next/server";
import { isPaid, sessionUser } from "@/lib/auth";
import { saveUser } from "@/lib/records";
import { stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/** THE SECOND SEAT — every paying member can gift a free month. */
export async function POST(_req: NextRequest) {
  const user = await sessionUser();
  if (!user || !isPaid(user)) {
    return NextResponse.json({ error: "Gift seats come with Pro — the seat next to you." }, { status: 402 });
  }
  const max = user.tier === "founding" ? 2 : 1;
  const used = user.giftCodes?.length ?? 0;
  if (used >= max) {
    return NextResponse.json({ error: `Your ${max} gift seat${max > 1 ? "s are" : " is"} already given.` }, { status: 400 });
  }
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Gifting opens with the till at launch." }, { status: 501 });
  }
  const key = process.env.STRIPE_SECRET_KEY!;
  const call = async (path: string, params: Record<string, string>) => {
    const res = await fetch(`https://api.stripe.com/v1/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "stripe error");
    return data;
  };
  try {
    const coupon = await call("coupons", {
      percent_off: "100",
      duration: "repeating",
      duration_in_months: "1",
      name: `Second Seat from ${user.name}`.slice(0, 40),
    });
    const promo = await call("promotion_codes", {
      coupon: coupon.id,
      max_redemptions: "1",
    });
    user.giftCodes = [...(user.giftCodes ?? []), promo.code];
    await saveUser(user);
    return NextResponse.json({
      ok: true,
      code: promo.code,
      note: "One free month of Pro. Hand it to one person — the seat next to you.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "gift failed" }, { status: 502 });
  }
}
