import { NextRequest, NextResponse } from "next/server";
import { loadBoard, loadOverrides, saveBoard, saveOverrides } from "@/lib/store";
import { Tier } from "@/lib/types";

export const dynamic = "force-dynamic";

const TIERS: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
const COOKIE = "tsr_desk";

function deskPassword(): string | null {
  return process.env.DESK_PASSWORD || null;
}

function authed(req: NextRequest): boolean {
  const pw = deskPassword();
  if (!pw) return false;
  return req.cookies.get(COOKIE)?.value === sessionToken(pw);
}

function sessionToken(pw: string): string {
  // Derived, not the password itself; rotates when the password rotates.
  let h = 0x811c9dc5;
  const s = "tsr-desk:" + pw;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + s.length.toString(36);
}

/**
 * The Control Room actions. Every intervention is written into the story's
 * public biography — the desk shows its work too (Addendum § D4).
 */
export async function POST(req: NextRequest) {
  const pw = deskPassword();
  if (!pw) {
    return NextResponse.json(
      { error: "The Control Room is not configured. Set DESK_PASSWORD." },
      { status: 501 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body?.action === "login") {
    if (typeof body.password === "string" && body.password === pw) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(COOKIE, sessionToken(pw), {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12,
        path: "/",
      });
      return res;
    }
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { action, storyId, tier } = body as { action: string; storyId?: string; tier?: Tier };
  if (!storyId || typeof storyId !== "string") {
    return NextResponse.json({ error: "storyId required" }, { status: 400 });
  }

  const overrides = await loadOverrides();
  const o = overrides[storyId] ?? {};
  const now = new Date().toISOString();
  let logLine = "";

  switch (action) {
    case "pin":
      o.pinned = !o.pinned;
      logLine = o.pinned ? "Pinned to the stage by the desk" : "Unpinned by the desk";
      break;
    case "kill":
      o.killed = true;
      logLine = "Removed from the board by the desk";
      break;
    case "force":
      if (!tier || !TIERS.includes(tier)) {
        return NextResponse.json({ error: "valid tier required" }, { status: 400 });
      }
      o.forcedTier = tier;
      logLine = `Seated ${tier} by the desk`;
      break;
    case "release":
      delete o.forcedTier;
      logLine = "Returned to the board's seating by the desk";
      break;
    case "confirmFlash":
      o.flashConfirmed = true;
      o.flashStoodDown = false;
      logLine = "FLASH confirmed by the desk";
      break;
    case "standDown":
      o.flashStoodDown = true;
      o.flashConfirmed = false;
      logLine = "FLASH stood down by the desk";
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  overrides[storyId] = o;
  await saveOverrides(overrides);

  // Disclose the intervention in the story's public biography immediately.
  const board = await loadBoard();
  if (board) {
    const s = board.stories.find((x) => x.id === storyId);
    if (s && logLine) {
      s.history.push({ at: now, event: logLine, by: "desk" });
      if (action === "confirmFlash" && s.flash) s.flash.confirmed = true;
      await saveBoard(board);
    }
  }

  return NextResponse.json({ ok: true, applied: logLine });
}
