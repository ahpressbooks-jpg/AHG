import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  allPosts, archiveStory, deskCalls, getArchived, getComment, getReaderCall,
  markUserApproved, moderationQueue, newId, recentCalls, saveComment,
  saveDeskCalls, saveNote, getNote, savePost, deletePost, saveReaderCall,
} from "@/lib/records";
import { allAssignments, createAssignment, predictionsState, setPredictions, updateAssignment } from "@/lib/extras";
import { getHouseLights, getStats, setHouseLights } from "@/lib/ops";
import { foundingWall } from "@/lib/glassdata";
import { kvGet, kvSet, listLen, listRange, loadBoard, saveBoard } from "@/lib/store";
import { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// THE BACK OFFICE API — TSR's internal command center. Password-gated with
// ADMIN_PASSWORD (default "TSRGLOBAL"). Structured so this can later become
// real auth + roles + audit logs without changing callers.
// ---------------------------------------------------------------------------

const COOKIE = "tsr_admin";
function adminPassword() {
  return process.env.ADMIN_PASSWORD || "TSRGLOBAL";
}
function token(pw: string) {
  return createHmac("sha256", "tsr-admin:" + pw).update("session").digest("base64url");
}
function authed(req: NextRequest) {
  const t = req.cookies.get(COOKIE)?.value;
  if (!t) return false;
  try {
    return timingSafeEqual(Buffer.from(t), Buffer.from(token(adminPassword())));
  } catch {
    return false;
  }
}

function parseList(rows: string[]) {
  return rows.map((r) => { try { return JSON.parse(r); } catch { return null; } }).filter(Boolean);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [
    posts, calls, queue, reader, board, glass, stats, lights, preds,
    intakeRows, seatRows, usersLen, assignments, note,
  ] = await Promise.all([
    allPosts(), deskCalls(), moderationQueue(), recentCalls(80), loadBoard(),
    foundingWall(), getStats(), getHouseLights(), predictionsState(),
    listRange("tsr:intake", 0, 100), listRange("tsr:seats", 0, 30), listLen("tsr:users"),
    allAssignments(), getNote(),
  ]);

  const intakeRaw = parseList(intakeRows);
  const intake = await Promise.all(
    intakeRaw.map(async (i: any) => ({ ...i, handled: (await kvGet(`tsr:intakedone:${i.id}`)) === "1" }))
  );

  return NextResponse.json({
    stats: {
      users: usersLen,
      seats: glass.seats,
      founding: glass.founding,
      sweeps: glass.sweeps,
      proActive: stats.proActive,
      posts: posts.length,
      campaigns: assignments.length,
      openLedger: calls.filter((c) => !c.result).length,
      openIntake: intake.filter((i: any) => !i.handled).length,
      heldComments: queue.length,
      openCalls: reader.filter((c) => !c.result).length,
    },
    intake,
    moderation: queue,
    readerCalls: reader.filter((c) => !c.result),
    ledger: calls,
    posts: posts.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind, publishedAt: p.publishedAt })),
    assignments,
    recentSeats: parseList(seatRows).slice(0, 12),
    board: { version: board?.version ?? 0, count: board?.stories.length ?? 0, sweptAt: board?.sweptAt, log: board?.log?.slice(0, 10) ?? [] },
    boardStories: (board?.stories ?? []).slice(0, 30).map((s) => ({ id: s.id, headline: s.headline, tier: s.tier, score: s.score, certainty: s.certainty })),
    lights,
    predictions: preds.open,
    note: note?.text ?? "",
  });
}

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  if (body?.action === "login") {
    if (body.password === adminPassword()) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(COOKIE, token(adminPassword()), {
        httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12, path: "/",
      });
      return res;
    }
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  if (body?.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  if (!authed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const a = String(body?.action ?? "");
  const now = new Date().toISOString();

  switch (a) {
    case "markIntake": {
      await kvSet(`tsr:intakedone:${body.id}`, body.undo ? "0" : "1");
      return NextResponse.json({ ok: true });
    }
    case "approveComment":
    case "removeComment": {
      const c = await getComment(String(body.id));
      if (!c) return NextResponse.json({ error: "no comment" }, { status: 404 });
      c.status = a === "approveComment" ? "live" : "removed";
      await saveComment(c);
      if (a === "approveComment") await markUserApproved(c.userId);
      return NextResponse.json({ ok: true });
    }
    case "markReaderCall": {
      const c = await getReaderCall(String(body.id));
      if (!c) return NextResponse.json({ error: "no call" }, { status: 404 });
      c.result = body.result === "HIT" ? "HIT" : "MISS"; c.resolvedAt = now;
      await saveReaderCall(c);
      return NextResponse.json({ ok: true });
    }
    case "addDeskCall": {
      const calls = await deskCalls();
      calls.unshift({ id: newId("desk"), claim: String(body.claim ?? "").slice(0, 400), confidence: ["CERTAIN", "LIKELY", "GUESSING"].includes(body.confidence) ? body.confidence : "GUESSING", at: now, workings: body.workings ? String(body.workings).slice(0, 4000) : undefined });
      await saveDeskCalls(calls);
      return NextResponse.json({ ok: true });
    }
    case "resolveDeskCall": {
      const calls = await deskCalls();
      const c = calls.find((x) => x.id === body.id);
      if (!c) return NextResponse.json({ error: "no call" }, { status: 404 });
      c.result = body.result === "HIT" ? "HIT" : "MISS"; c.resolvedAt = now; c.resolutionNote = body.note ? String(body.note).slice(0, 1000) : undefined;
      await saveDeskCalls(calls);
      return NextResponse.json({ ok: true });
    }
    case "resolveStory": {
      const board = await loadBoard();
      const onBoard = board?.stories.find((x) => x.id === body.id);
      const story = onBoard ?? (await getArchived(String(body.id)));
      if (!story) return NextResponse.json({ error: "no story" }, { status: 404 });
      story.resolution = { state: ["RESOLVED", "FADED", "ONGOING"].includes(body.state) ? body.state : "RESOLVED", note: body.note?.slice(0, 500), at: now };
      story.history.push({ at: now, event: `${story.resolution.state} — closed from the back office`, by: "desk" });
      if (onBoard && board) await saveBoard(board);
      await archiveStory(story);
      return NextResponse.json({ ok: true });
    }
    case "savePost": {
      const p = body.post ?? {};
      const slug = String(p.slug ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 80);
      if (!slug || !p.title || !p.body) return NextResponse.json({ error: "slug, title, body required" }, { status: 400 });
      const post: Post = { slug, title: String(p.title).slice(0, 200), dek: String(p.dek ?? "").slice(0, 300), body: String(p.body).slice(0, 60000), kind: ["column", "steelman", "note", "dispatch"].includes(p.kind) ? p.kind : "column", publishedAt: now };
      await savePost(post);
      return NextResponse.json({ ok: true, slug });
    }
    case "deletePost": { await deletePost(String(body.slug)); return NextResponse.json({ ok: true }); }
    case "saveNote": { await saveNote(String(body.text ?? "").slice(0, 2000)); return NextResponse.json({ ok: true }); }
    case "createAssignment": { await createAssignment(String(body.question ?? "").slice(0, 200), String(body.detail ?? "").slice(0, 600), Number(body.goal) || 25); return NextResponse.json({ ok: true }); }
    case "publishAssignment": { await updateAssignment(String(body.id), { status: "published", resultSlug: body.slug || undefined }); return NextResponse.json({ ok: true }); }
    case "houseLights": { const on = !(await getHouseLights()); await setHouseLights(on); return NextResponse.json({ ok: true, on }); }
    case "togglePredictions": { const s = await predictionsState(); await setPredictions(!s.open); return NextResponse.json({ ok: true, open: !s.open }); }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}
