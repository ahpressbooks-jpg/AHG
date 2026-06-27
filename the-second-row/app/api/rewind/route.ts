import { NextResponse } from "next/server";
import { getHourlySnapshots, getSnapshots } from "@/lib/records";

export const dynamic = "force-dynamic";

// All of history is free — no rewind gate.
export async function GET() {
  const [recent, hourly] = await Promise.all([getSnapshots(), getHourlySnapshots()]);
  return NextResponse.json({ recent, hourly, gated: false });
}
