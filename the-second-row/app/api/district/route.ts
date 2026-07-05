import { NextRequest, NextResponse } from "next/server";
import { resolveDistrict } from "@/lib/districts";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// GET /api/district?q=1600 Pennsylvania Ave NW, Washington, DC
// Resolves an address or ZIP to { state, district }. result: null on failure.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ result: null, error: "q required" }, { status: 400 });
  const result = await resolveDistrict(q);
  return NextResponse.json({ result }, { headers: { "cache-control": "no-store" } });
}
