import { NextRequest, NextResponse } from "next/server";
import { FREE_LIMITS, isPaid, sessionUser } from "@/lib/auth";
import { getHourlySnapshots, getSnapshots } from "@/lib/records";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const user = await sessionUser();
  const paid = isPaid(user);
  const recent = await getSnapshots();
  let hourly = await getHourlySnapshots();
  if (!paid) {
    const cutoff = Date.now() - FREE_LIMITS.rewindDays * 86400_000;
    hourly = hourly.filter((s) => +new Date(s.at) > cutoff);
  }
  return NextResponse.json({ recent, hourly, gated: !paid });
}
