import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_BOARD } from "@/lib/sample";
import { boardIsStale, runSweep } from "@/lib/sweep";
import { loadBoard } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The board endpoint. Self-sweeping: if the state is older than 60s the
 * request that notices runs the sweep (under a lock), so the wire stays
 * live from traffic alone — no cron required, cron just makes it tireless.
 */
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("sample") === "1") {
    return NextResponse.json(SAMPLE_BOARD(new Date()), {
      headers: { "cache-control": "no-store" },
    });
  }

  let state = await loadBoard();
  if (boardIsStale(state)) {
    state = await runSweep();
  }
  return NextResponse.json(state, {
    headers: { "cache-control": "no-store" },
  });
}
