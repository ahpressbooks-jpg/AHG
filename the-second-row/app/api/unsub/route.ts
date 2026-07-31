import { NextRequest, NextResponse } from "next/server";
import { listPush } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const e = req.nextUrl.searchParams.get("e") || "";
  try {
    const email = Buffer.from(e, "base64url").toString("utf8");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      await listPush("tsr:unsub", email, 100000);
    }
  } catch {}
  return new NextResponse(
    `<html><body style="font-family:monospace;padding:40px;background:#fff;color:#101319">
       <p>You're out — no hard feelings, no retention maze.</p>
       <p>The live board stays free at <a href="/">the Wire</a> whenever you want a seat again.</p>
     </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
