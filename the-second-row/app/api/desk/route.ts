import { NextRequest, NextResponse } from "next/server";
import {
  deskCalls,
  getArchived,
  getComment,
  getReaderCall,
  markUserApproved,
  newId,
  saveComment,
  saveDeskCalls,
  saveNote,
  savePost,
  deletePost,
  saveReaderCall,
  archiveStory,
} from "@/lib/records";
import { loadBoard, loadOverrides, saveBoard, saveOverrides } from "@/lib/store";
import { Post, Tier } from "@/lib/types";

export const dynamic = "force-dynamic";

const TIERS: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];
const COOKIE = "tsr_desk";

function deskPassword(): string | null {
  return process.env.DESK_PASSWORD || null;
}

function sessionToken(pw: string): string {
  let h = 0x811c9dc5;
  const s = "tsr-desk:" + pw;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + s.length.toString(36);
}

function authed(req: NextRequest): boolean {
  const pw = deskPassword();
  if (!pw) return false;
  return req.cookies.get(COOKIE)?.value === sessionToken(pw);
}

/** The Control Room. Every intervention is disclosed in public biographies. */
export async function POST(req: NextRequest) {
  const pw = deskPassword();
  if (!pw) {
    return NextResponse.json({ error: "The Control Room is not configured. Set DESK_PASSWORD." }, { status: 501 });
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

  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const action = String(body?.action ?? "");
  const now = new Date().toISOString();

  // ---- moderation ---------------------------------------------------------
  if (action === "approveComment" || action === "removeComment") {
    const c = await getComment(String(body?.commentId ?? ""));
    if (!c) return NextResponse.json({ error: "no comment" }, { status: 404 });
    c.status = action === "approveComment" ? "live" : "removed";
    await saveComment(c);
    if (action === "approveComment") await markUserApproved(c.userId);
    return NextResponse.json({ ok: true });
  }

  // ---- publishing (From the Second Row) ------------------------------------
  if (action === "savePost") {
    const p = body?.post ?? {};
    const slug = String(p.slug ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 80);
    if (!slug || !p.title || !p.body) return NextResponse.json({ error: "slug, title, body required" }, { status: 400 });
    const post: Post = {
      slug,
      title: String(p.title).slice(0, 200),
      dek: String(p.dek ?? "").slice(0, 300),
      body: String(p.body).slice(0, 60000),
      kind: ["column", "steelman", "note", "dispatch"].includes(p.kind) ? p.kind : "column",
      publishedAt: p.publishedAt || now,
      updatedAt: p.publishedAt ? now : undefined,
    };
    await savePost(post);
    return NextResponse.json({ ok: true, slug });
  }
  if (action === "deletePost") {
    await deletePost(String(body?.slug ?? ""));
    return NextResponse.json({ ok: true });
  }

  // ---- founder's note -------------------------------------------------------
  if (action === "saveNote") {
    await saveNote(String(body?.text ?? "").slice(0, 2000));
    return NextResponse.json({ ok: true });
  }

  // ---- the desk's Ledger -----------------------------------------------------
  if (action === "addDeskCall") {
    const calls = await deskCalls();
    calls.unshift({
      id: newId("desk"),
      claim: String(body?.claim ?? "").slice(0, 400),
      confidence: ["CERTAIN", "LIKELY", "GUESSING"].includes(body?.confidence) ? body.confidence : "GUESSING",
      at: now,
      workings: body?.workings ? String(body.workings).slice(0, 4000) : undefined,
    });
    await saveDeskCalls(calls);
    return NextResponse.json({ ok: true });
  }
  if (action === "resolveDeskCall") {
    const calls = await deskCalls();
    const c = calls.find((x) => x.id === body?.callId);
    if (!c) return NextResponse.json({ error: "no call" }, { status: 404 });
    c.result = body?.result === "HIT" ? "HIT" : "MISS";
    c.resolvedAt = now;
    c.resolutionNote = body?.note ? String(body.note).slice(0, 1000) : undefined;
    await saveDeskCalls(calls);
    return NextResponse.json({ ok: true });
  }

  // ---- reader-call marking ------------------------------------------------------
  if (action === "markReaderCall") {
    const c = await getReaderCall(String(body?.callId ?? ""));
    if (!c) return NextResponse.json({ error: "no call" }, { status: 404 });
    c.result = body?.result === "HIT" ? "HIT" : "MISS";
    c.resolvedAt = now;
    await saveReaderCall(c);
    return NextResponse.json({ ok: true });
  }

  // ---- story resolution (The Third Act) -------------------------------------------
  if (action === "resolveStory") {
    const storyId = String(body?.storyId ?? "");
    const state = ["RESOLVED", "FADED", "ONGOING"].includes(body?.state) ? body.state : "RESOLVED";
    const note = body?.note ? String(body.note).slice(0, 500) : undefined;
    const board = await loadBoard();
    const onBoard = board?.stories.find((x) => x.id === storyId);
    const story = onBoard ?? (await getArchived(storyId));
    if (!story) return NextResponse.json({ error: "no story" }, { status: 404 });
    story.resolution = { state, note, at: now };
    story.history.push({ at: now, event: `${state} — closed by the desk${note ? `: ${note}` : ""}`, by: "desk" });
    if (onBoard && board) await saveBoard(board);
    await archiveStory(story);
    return NextResponse.json({ ok: true });
  }

  // ---- the writing desk: help drafting pieces in the house voice -------------
  if (action === "assist") {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "The writing desk needs ANTHROPIC_API_KEY in Vercel env — add it and redeploy." },
        { status: 501 }
      );
    }
    const topic = String(body?.topic ?? "").slice(0, 300);
    const notes = String(body?.notes ?? "").slice(0, 4000);
    const kind = ["column", "steelman", "note", "dispatch"].includes(body?.kind) ? body.kind : "column";
    if (!topic) return NextResponse.json({ error: "Give the desk a topic." }, { status: 400 });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.WRITER_MODEL || "claude-sonnet-4-6",
          max_tokens: 2000,
          system:
            "You are the writing desk of The Second Row — an independent civic news platform founded by a 21-year-old. " +
            "Voice: plain, direct, first person, zero purple prose, no tribal framing, intellectually honest, occasionally dry. " +
            "Discipline: every paragraph that makes a claim starts with one tag: [FACT] [POLICY] [OPINION] [QUESTION] or [THINKING]. " +
            "Facts you are not certain of must be tagged [QUESTION] or flagged for the editor to verify — never invent specifics. " +
            (kind === "steelman"
              ? "Format: a Steelman Saturday — present BOTH sides of the argument at their strongest before any verdict. "
              : kind === "note"
                ? "Format: a short signed morning note, under 150 words. "
                : "Format: a column, 400-700 words, with ## section headings. ") +
            "Output exactly: first line 'TITLE: …', second line 'DEK: …' (one-sentence summary), blank line, then the body."
        ,
          messages: [{ role: "user", content: `Topic: ${topic}\n\nThe desk's raw notes/bullets (treat as source material, expand honestly):\n${notes || "(none — draft from the topic alone, conservatively)"}` }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text: string = data?.content?.[0]?.text ?? "";
      const title = text.match(/^TITLE:\s*(.+)$/m)?.[1]?.trim() ?? topic;
      const dek = text.match(/^DEK:\s*(.+)$/m)?.[1]?.trim() ?? "";
      const bodyText = text.replace(/^TITLE:.*$/m, "").replace(/^DEK:.*$/m, "").trim();
      return NextResponse.json({ ok: true, title, dek, body: bodyText });
    } catch (e: any) {
      return NextResponse.json({ error: `Writing desk hiccup: ${e?.message || "failed"}` }, { status: 502 });
    }
  }

  // ---- the innovative layer: assignments, argument maps, documents, predictions
  if (action === "createAssignment") {
    const { createAssignment } = await import("@/lib/extras");
    const a = await createAssignment(String(body?.question ?? "").slice(0, 200), String(body?.detail ?? "").slice(0, 600), Number(body?.goal) || 25);
    return NextResponse.json({ ok: true, applied: `Assignment posted: ${a.question}` });
  }
  if (action === "publishAssignment") {
    const { updateAssignment } = await import("@/lib/extras");
    await updateAssignment(String(body?.id ?? ""), { status: "published", resultSlug: String(body?.slug ?? "") || undefined });
    return NextResponse.json({ ok: true, applied: "Assignment marked published." });
  }
  if (action === "saveArgMap") {
    const { saveArgMap } = await import("@/lib/extras");
    const storyId = String(body?.storyId ?? "");
    if (!storyId) return NextResponse.json({ error: "storyId required" }, { status: 400 });
    await saveArgMap({
      storyId,
      claim: String(body?.claim ?? "").slice(0, 300),
      forPts: (Array.isArray(body?.forPts) ? body.forPts : String(body?.forPts ?? "").split("\n")).map((x: string) => x.trim()).filter(Boolean).slice(0, 6),
      againstPts: (Array.isArray(body?.againstPts) ? body.againstPts : String(body?.againstPts ?? "").split("\n")).map((x: string) => x.trim()).filter(Boolean).slice(0, 6),
      verdict: body?.verdict ? String(body.verdict).slice(0, 500) : undefined,
      at: now,
    });
    return NextResponse.json({ ok: true, applied: "Argument map saved to the story." });
  }
  if (action === "saveDoc") {
    const { saveDoc } = await import("@/lib/extras");
    const d = body?.doc ?? {};
    const slug = String(d.slug ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 80);
    if (!slug || !d.title) return NextResponse.json({ error: "slug and title required" }, { status: 400 });
    await saveDoc({
      slug,
      title: String(d.title).slice(0, 200),
      kind: ["bill", "ruling", "order", "report"].includes(d.kind) ? d.kind : "bill",
      summary: String(d.summary ?? "").slice(0, 600),
      sourceUrl: d.sourceUrl ? String(d.sourceUrl).slice(0, 400) : undefined,
      blocks: (Array.isArray(d.blocks) ? d.blocks : []).slice(0, 40).map((b: any) => ({ quote: String(b.quote ?? "").slice(0, 2000), note: b.note ? String(b.note).slice(0, 1000) : undefined, tag: b.tag })),
      at: now,
    });
    return NextResponse.json({ ok: true, applied: `Document saved: /document/${slug}` });
  }
  if (action === "togglePredictions") {
    const { predictionsState, setPredictions } = await import("@/lib/extras");
    const s = await predictionsState();
    await setPredictions(!s.open);
    return NextResponse.json({ ok: true, applied: s.open ? "Predictions Night closed." : "Predictions Night is OPEN — the room can seal year-ahead takes." });
  }

  // ---- the House Lights protocol --------------------------------------------
  if (action === "houseLights") {
    const { getHouseLights, setHouseLights } = await import("@/lib/ops");
    const on = !(await getHouseLights());
    await setHouseLights(on);
    return NextResponse.json({
      ok: true,
      applied: on
        ? "HOUSE LIGHTS UP — every archive rope is open, free, in public"
        : "House lights down — the ropes are restored",
    });
  }

  // ---- board overrides (v1 surface, unchanged semantics) ---------------------------
  const { storyId, tier } = body as { storyId?: string; tier?: Tier };
  if (!storyId) return NextResponse.json({ error: "storyId required" }, { status: 400 });

  const overrides = await loadOverrides();
  const o = overrides[storyId] ?? {};
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
      if (!tier || !TIERS.includes(tier)) return NextResponse.json({ error: "valid tier required" }, { status: 400 });
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

/** Desk data fetch (moderation queue etc.) — same auth. */
export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { moderationQueue, recentCalls, editionDates } = await import("@/lib/records");
  const { getHouseLights, getStats } = await import("@/lib/ops");
  const { foundingWall } = await import("@/lib/glassdata");
  const { listRange, loadBoard } = await import("@/lib/store");
  const [queue, calls, ledger, lights, glass, stripeStats, board, seatsRaw, editions, note] =
    await Promise.all([
      moderationQueue(),
      recentCalls(50),
      deskCalls(),
      getHouseLights(),
      foundingWall(),
      getStats(),
      loadBoard(),
      listRange("tsr:seats", 0, 9), // newest-first (listPush prepends)
      editionDates(5),
      (await import("@/lib/records")).getNote(),
    ]);
  const recentSeats = seatsRaw
    .map((r) => {
      try {
        return JSON.parse(r);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return NextResponse.json({
    queue,
    readerCalls: calls.filter((c) => !c.result),
    ledger,
    lights,
    stats: { ...glass, proActive: stripeStats.proActive },
    sweepLog: board?.log?.slice(0, 8) ?? [],
    boardCount: board?.stories.length ?? 0,
    recentSeats,
    editions,
    note: note?.text ?? "",
  });
}
