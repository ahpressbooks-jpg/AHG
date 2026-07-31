import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import {
  addComment,
  commentsFor,
  meter,
  mindChanged,
  newId,
  userNeedsHold,
} from "@/lib/records";
import { kvGet, kvSet } from "@/lib/store";
import { Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

const CERTAINTIES = ["CERTAIN", "LIKELY", "GUESSING"] as const;

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("target") || "";
  if (!/^(story|post):[\w-]+$/.test(target)) {
    return NextResponse.json({ error: "bad target" }, { status: 400 });
  }
  const user = await sessionUser();
  let comments = await commentsFor(target, user?.id);

  // Sealed takes stay sealed SERVER-SIDE until the story resolves — the text
  // never leaves the building early, not even via the API.
  if (target.startsWith("story:")) {
    const id = target.slice(6);
    const { loadBoard } = await import("@/lib/store");
    const { getArchived } = await import("@/lib/records");
    const board = await loadBoard();
    const story = board?.stories.find((s) => s.id === id) ?? (await getArchived(id));
    const resolved = Boolean(story?.resolution && story.resolution.state !== "ONGOING");
    if (!resolved) {
      comments = comments.map((c) =>
        c.sealed && c.userId !== user?.id ? { ...c, text: "", steelman: undefined } : c
      );
    }
  }
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Take a seat first — sign in to speak." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // "This moved me" — minds-changed ranking. No like button exists.
  if (body?.action === "mind") {
    const id = String(body?.commentId ?? "");
    if (!id) return NextResponse.json({ error: "bad request" }, { status: 400 });
    const c = await mindChanged(id, user.id);
    return NextResponse.json({ ok: true, minds: c?.minds ?? 0 });
  }

  const target = String(body?.target ?? "");
  if (!/^(story|post):[\w-]+$/.test(target)) {
    return NextResponse.json({ error: "bad target" }, { status: 400 });
  }
  const text = String(body?.text ?? "").trim();
  if (text.length < 2) return NextResponse.json({ error: "Say something." }, { status: 400 });
  if (text.length > 4000) return NextResponse.json({ error: "Under 4,000 characters, please." }, { status: 400 });
  if ((text.match(/https?:\/\//g) || []).length > 2) {
    return NextResponse.json({ error: "Two links max." }, { status: 400 });
  }
  const certainty = CERTAINTIES.includes(body?.certainty) ? body.certainty : "GUESSING";
  const parentId = body?.parentId ? String(body.parentId) : undefined;
  const steelman = body?.steelman ? String(body.steelman).trim().slice(0, 500) : undefined;
  const sealed = Boolean(body?.sealed) && target.startsWith("story:");

  // The Steelman Gate: rebuttals restate the other side first.
  if (parentId && (!steelman || steelman.length < 10)) {
    return NextResponse.json(
      { error: "The Steelman Gate: restate their point in a sentence before you answer it." },
      { status: 400 }
    );
  }

  // Rate limits: one per 20 seconds, 30 per day.
  const recent = await kvGet(`tsr:cguard:${user.id}`);
  if (recent) return NextResponse.json({ error: "One thought per 20 seconds." }, { status: 429 });
  await kvSet(`tsr:cguard:${user.id}`, "1", 20);
  if (!(await meter(user.id, "comments", 30))) {
    return NextResponse.json({ error: "30 comments a day is plenty of judgment." }, { status: 429 });
  }

  const held = await userNeedsHold(user.id);
  const comment: Comment = {
    id: newId(user.id + target),
    target,
    userId: user.id,
    name: user.name,
    tier: user.tier,
    text,
    certainty,
    steelman,
    parentId,
    sealed,
    minds: 0,
    at: new Date().toISOString(),
    status: held ? "held" : "live",
  };
  await addComment(comment);

  return NextResponse.json({
    ok: true,
    comment,
    note: held
      ? "First comments wait for the desk — one rule for everyone. It's visible to you meanwhile."
      : sealed
        ? "Sealed. It opens when the story resolves."
        : undefined,
  });
}
