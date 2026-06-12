import { NextResponse } from "next/server";
import { getNote } from "@/lib/records";

export const dynamic = "force-dynamic";

/** The founder's note (already public on /today) — feeds the Prompter. */
export async function GET() {
  const note = await getNote();
  return NextResponse.json({ note: note?.text ?? "" });
}
