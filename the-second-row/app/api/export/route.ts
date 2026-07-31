import { NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { getClips, getFollows, userCalls, userComments } from "@/lib/records";

export const dynamic = "force-dynamic";

/** Data dignity: download everything, no support ticket. */
export async function GET() {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const [comments, clips, follows, calls] = await Promise.all([
    userComments(user.id),
    getClips(user.id),
    getFollows(user.id),
    userCalls(user.id),
  ]);
  const payload = {
    exportedAt: new Date().toISOString(),
    account: { name: user.name, email: user.email, tier: user.tier, createdAt: user.createdAt },
    comments,
    clippings: clips,
    follows,
    calls,
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="the-second-row-${user.name.replace(/\W+/g, "-")}.json"`,
    },
  });
}
