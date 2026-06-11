import { NextRequest, NextResponse } from "next/server";
import { consumeMagicToken, sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const user = token ? await consumeMagicToken(token) : null;
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  if (!user) {
    return NextResponse.redirect(`${base}/you?expired=1`);
  }
  const res = NextResponse.redirect(`${base}/you`);
  res.cookies.set(sessionCookie(user.id));
  return res;
}
