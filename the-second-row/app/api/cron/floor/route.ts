import { NextRequest, NextResponse } from "next/server";
import { FloorItem, loadFloor, saveFloor } from "@/lib/floor";
import { fetchFederal } from "@/lib/intake/federal";
import { fetchRegulatory } from "@/lib/intake/regulatory";
import { fetchState } from "@/lib/intake/state";
import { listPush } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// THE FLOOR SWEEP — Vercel Cron, every 4 hours. MUST verify CRON_SECRET (Vercel
// sends it as a Bearer token when the env var is set). Idempotent upserts keyed
// on source-of-record ids; every run is logged to an ingest_runs list so pipe
// health is observable on the desk.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = new Date().toISOString();
  const errors: string[] = [];
  const pipes = await Promise.all([
    fetchFederal().catch((e) => { errors.push(`federal: ${e}`); return null; }),
    fetchRegulatory().catch((e) => { errors.push(`regulatory: ${e}`); return null; }),
    fetchState().catch((e) => { errors.push(`state: ${e}`); return null; }),
  ]);
  const incoming = pipes.filter(Boolean).flat() as FloorItem[];

  // Merge onto prior LIVE items (drop the sample seed once real data flows).
  const prior = (await loadFloor()).filter((i) => i.source !== "sample");
  const byId = new Map(prior.map((i) => [i.id, i]));
  let changed = 0;
  for (const it of incoming) {
    const was = byId.get(it.id);
    if (was) {
      const events = [...was.events];
      const latest = it.events[0];
      if (latest && !events.some((e) => e.event === latest.event && e.at === latest.at)) {
        events.unshift(latest);
        changed++;
      }
      byId.set(it.id, { ...it, events });
    } else {
      byId.set(it.id, it);
      changed++;
    }
  }
  if (incoming.length) await saveFloor(Array.from(byId.values()));

  const run = { started, finished: new Date().toISOString(), seen: incoming.length, changed, errors };
  await listPush("tsr:ingest:floor", JSON.stringify(run), 200);
  return NextResponse.json({ ok: true, live: incoming.length > 0, ...run });
}
