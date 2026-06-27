import { NextResponse } from "next/server";
import { clearCookie, isPaid, sessionUser } from "@/lib/auth";
import {
  deleteUser, getClips, getFollows, getUserIntake, judgmentScore,
  saveUser, userCalls, userComments,
} from "@/lib/records";

export const dynamic = "force-dynamic";

// The member dashboard's data + actions. One authed endpoint powering /you.
export async function GET() {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  const [clips, follows, calls, comments, submissions] = await Promise.all([
    getClips(user.id), getFollows(user.id), userCalls(user.id), userComments(user.id), getUserIntake(user.id),
  ]);
  const js = judgmentScore(calls);

  // A unified activity timeline from the reader's real actions.
  const activity = [
    ...comments.map((c) => ({ type: "comment", at: c.at, text: c.text.slice(0, 120), target: c.target })),
    ...calls.map((c) => ({ type: "call", at: c.at, text: c.claim, result: c.result, storyId: c.storyId })),
    ...clips.map((c) => ({ type: "clip", at: c.at, text: c.headline, storyId: c.storyId })),
    ...follows.map((c) => ({ type: "follow", at: c.at, text: c.headline, storyId: c.storyId })),
    ...submissions.map((sx: any) => ({ type: "submission", at: sx.at, text: sx.summary?.slice(0, 120), kind: sx.kind })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 60);

  return NextResponse.json({
    user: {
      id: user.id, name: user.name, email: user.email, tier: user.tier,
      paid: isPaid(user), foundingNumber: user.foundingNumber, verified: user.verified,
      bio: user.bio ?? "", seatColor: user.seatColor ?? "#8a1f35",
      publicProfile: user.publicProfile !== false, createdAt: user.createdAt,
      subscriptionStatus: user.subscriptionStatus, periodEnd: user.periodEnd,
      notify: user.notify ?? { email: true, flash: true, follows: true },
    },
    judgment: js, clips, follows, calls, comments, submissions, activity,
  });
}

export async function POST(req: Request) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  if (body.action === "updatePrefs") {
    user.notify = {
      email: Boolean(body.email),
      flash: Boolean(body.flash),
      follows: Boolean(body.follows),
    };
    await saveUser(user);
    return NextResponse.json({ ok: true, note: "Notification preferences saved." });
  }

  if (body.action === "deleteAccount") {
    await deleteUser(user);
    const res = NextResponse.json({ ok: true, note: "Your account and personal data are erased." });
    res.cookies.set(clearCookie());
    return res;
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
