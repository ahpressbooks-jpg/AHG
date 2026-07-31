import { listPush, listRange } from "./store";
import { shortHash } from "./cluster";

// THE WELL — member submissions: an idea or a full draft. Every serious
// submission gets a PUBLIC response — adopted, argued with, or declined with
// reasons. Silence is not an outcome; the queue's response-rate is published.

export interface Submission {
  id: string;
  title: string;
  area: string;
  problem: string;
  proposal: string;
  fullText?: string;
  byName?: string;
  at: string;
  response?: { verdict: "Adopted" | "Argued with" | "Declined"; text: string; at: string };
}

const KEY = "tsr:well";

export async function getSubmissions(n = 100): Promise<Submission[]> {
  const rows = await listRange(KEY, 0, n - 1);
  return rows.map((r) => { try { return JSON.parse(r) as Submission; } catch { return null; } }).filter(Boolean) as Submission[];
}

export async function addSubmission(s: Omit<Submission, "id" | "at">): Promise<Submission> {
  const sub: Submission = { ...s, id: shortHash(s.title + Date.now() + Math.random()), at: new Date().toISOString() };
  await listPush(KEY, JSON.stringify(sub), 5000);
  return sub;
}

export function responseRate(subs: Submission[]): { answered: number; total: number; pct: number } {
  const total = subs.length;
  const answered = subs.filter((s) => s.response).length;
  return { answered, total, pct: total ? Math.round((answered / total) * 100) : 0 };
}
