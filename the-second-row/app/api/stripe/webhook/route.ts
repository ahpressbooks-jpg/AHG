import { NextRequest, NextResponse } from "next/server";
import { handleStripeEvent, verifyStripeSignature } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!verifyStripeSignature(payload, sig)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  const result = await handleStripeEvent(event);
  return NextResponse.json({ ok: true, result });
}
