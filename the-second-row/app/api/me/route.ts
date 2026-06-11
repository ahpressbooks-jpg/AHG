import { NextResponse } from "next/server";
import { isPaid, sessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      tier: user.tier,
      paid: isPaid(user),
      foundingNumber: user.foundingNumber,
      verified: user.verified,
    },
  });
}
