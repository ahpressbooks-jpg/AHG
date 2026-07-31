import { NextResponse } from "next/server";
import { castBallot, getBallots, tally, voteOptions } from "@/lib/floorvotes";

export const dynamic = "force-dynamic";

export async function GET() {
  const [options, ballots] = await Promise.all([voteOptions(), getBallots()]);
  return NextResponse.json({ standing: tally(options, ballots), ballots: ballots.length });
}

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const ranking: string[] = Array.isArray(body?.ranking) ? body.ranking.map(String).slice(0, 3) : [];
  if (!ranking.length) return NextResponse.json({ error: "rank at least one option" }, { status: 400 });

  // Only desk-curated options may be voted on — an out-of-spine option cannot count.
  const options = await voteOptions();
  const valid = new Set(options.map((o) => o.id));
  const clean = ranking.filter((id) => valid.has(id));
  if (!clean.length) return NextResponse.json({ error: "no eligible options in ballot" }, { status: 400 });

  await castBallot(clean);
  const standing = tally(options, await getBallots());
  return NextResponse.json({ ok: true, standing, note: "Ballot counted. The standing re-tallies as votes land." });
}
