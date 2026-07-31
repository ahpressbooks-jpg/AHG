import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/auth";
import { saveUser } from "@/lib/records";

export const dynamic = "force-dynamic";

const SEAT_COLORS = ["#8A1F35", "#2E5BFF", "#0E7C4A", "#101319", "#5B6B7C", "#6D28D9"];

/** Profile editing: the seat plate. Name, bio, color, public/private. */
export async function POST(req: NextRequest) {
  const user = await sessionUser();
  if (!user) return NextResponse.json({ error: "Take a seat first." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (typeof body.name === "string") {
    const name = body.name.trim().slice(0, 60);
    if (name.length < 2) return NextResponse.json({ error: "A name needs two characters." }, { status: 400 });
    user.name = name;
  }
  if (typeof body.bio === "string") {
    user.bio = body.bio.trim().slice(0, 160);
  }
  if (typeof body.seatColor === "string") {
    if (!SEAT_COLORS.includes(body.seatColor)) {
      return NextResponse.json({ error: "Pick from the palette — orange stays sacred." }, { status: 400 });
    }
    user.seatColor = body.seatColor;
  }
  if (typeof body.publicProfile === "boolean") {
    user.publicProfile = body.publicProfile;
  }

  await saveUser(user);
  return NextResponse.json({
    ok: true,
    note: "Seat plate updated. New comments carry the new name; old ones keep their history.",
  });
}
