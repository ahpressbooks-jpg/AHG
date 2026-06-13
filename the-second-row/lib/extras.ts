import { getJSON, kvGet, kvIncr, kvSet, listPush, listRange, setJSON } from "./store";

// ---------------------------------------------------------------------------
// EXTRAS — storage for the innovative layer: the Assignment Desk, Argument
// Maps, and Document mode. Durable on Redis; in-memory fallback like the rest.
// ---------------------------------------------------------------------------

function id(seed: string): string {
  let h = 0x811c9dc5;
  const s = seed + Date.now() + Math.random();
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

// ---- The Assignment Desk — readers pool intent to commission a question ----

export interface Assignment {
  id: string;
  question: string;
  detail: string;
  goal: number; // backers needed to commit the desk
  backers: string[]; // user ids
  status: "open" | "commissioned" | "published";
  resultSlug?: string; // links to the column/dossier when delivered
  at: string;
}

export async function allAssignments(): Promise<Assignment[]> {
  const ids = await listRange("tsr:assignments", 0, 99);
  const out = (await Promise.all(ids.map((i) => getJSON<Assignment>(`tsr:assignment:${i}`)))).filter(Boolean) as Assignment[];
  return out.sort((a, b) => b.backers.length - a.backers.length);
}

export async function getAssignment(aid: string): Promise<Assignment | null> {
  return getJSON<Assignment>(`tsr:assignment:${aid}`);
}

export async function createAssignment(question: string, detail: string, goal: number): Promise<Assignment> {
  const a: Assignment = { id: id(question), question, detail, goal: Math.max(5, goal), backers: [], status: "open", at: new Date().toISOString() };
  await setJSON(`tsr:assignment:${a.id}`, a);
  await listPush("tsr:assignments", a.id, 200);
  return a;
}

export async function backAssignment(aid: string, userId: string): Promise<Assignment | null> {
  const a = await getAssignment(aid);
  if (!a) return null;
  if (!a.backers.includes(userId)) {
    a.backers.push(userId);
    if (a.backers.length >= a.goal && a.status === "open") a.status = "commissioned";
    await setJSON(`tsr:assignment:${a.id}`, a);
  }
  return a;
}

export async function updateAssignment(aid: string, patch: Partial<Assignment>): Promise<void> {
  const a = await getAssignment(aid);
  if (!a) return;
  await setJSON(`tsr:assignment:${aid}`, { ...a, ...patch });
}

// ---- Argument Maps — desk-authored claim trees on a story ------------------

export interface ArgMap {
  storyId: string;
  claim: string;
  forPts: string[];
  againstPts: string[];
  verdict?: string;
  at: string;
}

export async function getArgMap(storyId: string): Promise<ArgMap | null> {
  return getJSON<ArgMap>(`tsr:argmap:${storyId}`);
}

export async function saveArgMap(m: ArgMap): Promise<void> {
  await setJSON(`tsr:argmap:${m.storyId}`, m);
}

// ---- Document mode — primary sources with the desk's margin notes ----------

export interface DeskDoc {
  slug: string;
  title: string;
  kind: "bill" | "ruling" | "order" | "report";
  summary: string;
  sourceUrl?: string;
  blocks: { quote: string; note?: string; tag?: string }[];
  at: string;
}

export async function getDoc(slug: string): Promise<DeskDoc | null> {
  return getJSON<DeskDoc>(`tsr:doc:${slug}`);
}

export async function allDocs(): Promise<DeskDoc[]> {
  const slugs = await listRange("tsr:docs", 0, 99);
  const out = (await Promise.all(slugs.map((s) => getDoc(s)))).filter(Boolean) as DeskDoc[];
  return out.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

export async function saveDoc(d: DeskDoc): Promise<void> {
  const existed = await getDoc(d.slug);
  await setJSON(`tsr:doc:${d.slug}`, d);
  if (!existed) await listPush("tsr:docs", d.slug, 200);
}

// ---- Predictions Night — the annual seal window ----------------------------

export async function predictionsState(): Promise<{ open: boolean; year: number }> {
  const v = await kvGet("tsr:predictions:open");
  return { open: v === "1", year: new Date().getFullYear() };
}
export async function setPredictions(open: boolean): Promise<void> {
  await kvSet("tsr:predictions:open", open ? "1" : "0");
}
