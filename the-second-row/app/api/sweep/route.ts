import { NextRequest, NextResponse } from "next/server";
import { runSweep } from "@/lib/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The cron target. On Vercel Pro, vercel.json schedules this every minute so
 * the board sweeps even with no readers. Vercel sends CRON_SECRET as a
 * bearer token automatically when the env var is set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const state = await runSweep(true);
  return NextResponse.json({
    ok: true,
    version: state.version,
    sweptAt: state.sweptAt,
    seated: state.stories.length,
    log: state.log[0]?.line,
  });
}
