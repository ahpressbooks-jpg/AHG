import { NextRequest, NextResponse } from "next/server";
import { FREE_LIMITS, isPaid, sessionUser } from "@/lib/auth";
import {
  addReaderCall,
  getClips,
  getFollows,
  newId,
  toggleClip,
  toggleFollow,
} from "@/lib/records";

export const dynamic = "force-dynamic";

// Clippings, follows, and reader calls — Your Seat's working surface.
export async function POST(req: NextRequest) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Take a seat first — sign in." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const storyId = String(body?.storyId ?? "");
  const headline = String(body?.headline ?? "").slice(0, 200);
  if (!storyId) return NextResponse.json({ error: "storyId required" }, { status: 400 });
  const paid = isPaid(user);

  if (body.action === "clip") {
    const clips = await getClips(user.id);
    const exists = clips.some((c) => c.storyId === storyId);
    if (!exists && !paid && clips.length >= FREE_LIMITS.clips) {
      return NextResponse.json(
        { error: `The Floor holds ${FREE_LIMITS.clips} clippings. Pro's drawer is bottomless.`, rope: true },
        { status: 402 }
      );
    }
    const r = await toggleClip(user.id, storyId, headline);
    return NextResponse.json({ ok: true, added: r.added, count: r.clips.length });
  }

  if (body.action === "follow") {
    const follows = await getFollows(user.id);
    const exists = follows.some((c) => c.storyId === storyId);
    if (!exists && !paid && follows.length >= FREE_LIMITS.follows) {
      return NextResponse.json(
        { error: `The Floor follows ${FREE_LIMITS.follows} stories at a time. Pro follows them all.`, rope: true },
        { status: 402 }
      );
    }
    const r = await toggleFollow(user.id, storyId, headline);
    return NextResponse.json({ ok: true, added: r.added, count: r.follows.length });
  }

  if (body.action === "call") {
    const claim = String(body?.claim ?? "").trim();
    const confidence = ["CERTAIN", "LIKELY", "GUESSING"].includes(body?.confidence)
      ? body.confidence
      : "GUESSING";
    if (claim.length < 5 || claim.length > 280) {
      return NextResponse.json({ error: "A call is 5–280 characters." }, { status: 400 });
    }
    await addReaderCall({
      id: newId(user.id + storyId),
      userId: user.id,
      name: user.name,
      storyId,
      storyHeadline: headline,
      claim,
      confidence,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, note: "On the record. Reality decides; the desk marks it." });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
