import { kvGet, kvIncr, kvSet, listRange } from "./store";

// ---------------------------------------------------------------------------
// The Morning Edition email + the House Lights protocol + Stripe counters.
// ---------------------------------------------------------------------------

export async function getHouseLights(): Promise<boolean> {
  return (await kvGet("tsr:houselights")) === "1";
}

export async function setHouseLights(on: boolean): Promise<void> {
  await kvSet("tsr:houselights", on ? "1" : "0");
}

export async function bumpStat(key: "pro_act" | "churn"): Promise<void> {
  await kvIncr(`tsr:stats:${key}`);
}

export async function getStats(): Promise<{ proActive: number }> {
  const [act, churn] = await Promise.all([kvGet("tsr:stats:pro_act"), kvGet("tsr:stats:churn")]);
  return { proActive: Math.max(0, (Number(act) || 0) - (Number(churn) || 0)) };
}

// ---- the 7 a.m. send --------------------------------------------------------

interface EditionLike {
  date: string;
  number: number;
  note?: string;
  stories: { id: string; headline: string; tier: string; score: number }[];
}

/**
 * Sends the frozen Morning Edition to the free list via Resend. Quietly does
 * nothing without RESEND_API_KEY. Capped per send; suppression honored; one
 * send per edition (guarded by a flag).
 */
export async function sendMorningEdition(e: EditionLike): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!key || !base) return;
  const guard = await kvGet(`tsr:editionsent:${e.date}`);
  if (guard) return;
  await kvSet(`tsr:editionsent:${e.date}`, "1");

  const rows = await listRange("tsr:seats", 0, 499);
  const unsub = new Set(await listRange("tsr:unsub", 0, 9999));
  const emails = rows
    .map((r) => {
      try {
        return JSON.parse(r).email as string;
      } catch {
        return null;
      }
    })
    .filter((x): x is string => Boolean(x) && !unsub.has(x!));

  if (emails.length === 0) return;

  const lines = e.stories
    .map((s, i) => `${i + 1}. [${s.tier} · ${s.score}] ${s.headline}\n   ${base}/wire/${s.id}`)
    .join("\n\n");
  const text =
    `THE MORNING EDITION · № ${e.number} · ${e.date}\n` +
    `One row back. Full view.\n\n` +
    (e.note ? `FROM THE DESK\n${e.note}\n\n` : "") +
    `THE BOARD AT 7 A.M.\n\n${lines}\n\n` +
    `That's the bottom of the news — a day you can actually finish.\n` +
    `The live board: ${base}\n\n` +
    `No longer want this? One click, no hard feelings:\n` +
    `${base}/api/unsub?e=`;

  const from = process.env.AUTH_EMAIL_FROM || "The Second Row <edition@thesecondrow.news>";
  // Resend batch: 100 per call, capped at 5 calls per edition for now.
  for (let i = 0; i < Math.min(emails.length, 500); i += 100) {
    const batch = emails.slice(i, i + 100).map((to) => ({
      from,
      to: [to],
      subject: `The Morning Edition · № ${e.number}`,
      text: text + Buffer.from(to).toString("base64url"),
    }));
    try {
      await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
    } catch {
      break;
    }
  }
}
