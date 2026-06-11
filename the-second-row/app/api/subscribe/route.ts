import { NextRequest, NextResponse } from "next/server";
import { saveSeat } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * The capture row. Seats are stored in Redis (tsr:seats) when a database is
 * attached; otherwise in instance memory. Swap in your ESP (Buttondown,
 * ConvertKit, etc.) here when the briefing email launches — one fetch call.
 */
export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "That address doesn't parse." }, { status: 400 });
  }
  const where = await saveSeat(email);
  return NextResponse.json({
    ok: true,
    note:
      where === "stored"
        ? "Seat saved. The briefing email launches soon — you're on the founding list."
        : "Seat noted. (No database attached yet — connect Redis to persist the list.)",
  });
}
