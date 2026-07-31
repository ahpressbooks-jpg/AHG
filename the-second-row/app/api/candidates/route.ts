import { NextRequest, NextResponse } from "next/server";
import { getCandidatesFor, Office } from "@/lib/candidates";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// GET /api/candidates?state=CA&office=H&district=12
// Roster for one race. office = H | S | G. Returns { candidates, source }.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const state = (sp.get("state") || "").toUpperCase();
  const office = (sp.get("office") || "") as Office;
  const district = sp.get("district") || undefined;

  if (!state || !["H", "S", "G"].includes(office)) {
    return NextResponse.json({ error: "state and office (H|S|G) are required" }, { status: 400 });
  }

  try {
    const res = await getCandidatesFor({ state, office, district: district ?? undefined });
    return NextResponse.json(res, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ candidates: [], source: "sample", error: "lookup failed" }, { status: 200 });
  }
}
