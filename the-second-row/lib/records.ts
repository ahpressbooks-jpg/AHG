import { shortHash } from "./cluster";
import {
  getJSON,
  kvDel,
  kvGet,
  kvIncr,
  kvSet,
  listPush,
  listRange,
  setJSON,
} from "./store";
import {
  Comment,
  DeskCall,
  Edition,
  Post,
  ReaderCall,
  Snapshot,
  Story,
  User,
} from "./types";

// ---------------------------------------------------------------------------
// THE PERMANENT RECORD — every comment, clip, call, post, edition, and
// archived dossier. Durable on Redis today, schema designed to port to
// Postgres without changing callers. Nothing the reader touched is ever lost.
// ---------------------------------------------------------------------------

export function newId(seed: string): string {
  return shortHash(seed + ":" + Date.now() + ":" + Math.random());
}

// ---- users -------------------------------------------------------------------

export async function getUser(id: string): Promise<User | null> {
  return getJSON<User>(`tsr:user:${id}`);
}

export async function saveUser(u: User): Promise<void> {
  await setJSON(`tsr:user:${u.id}`, u);
  await kvSet(`tsr:email:${u.email.toLowerCase()}`, u.id);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await kvGet(`tsr:email:${email.toLowerCase()}`);
  return id ? getUser(id) : null;
}

export async function findOrCreateUser(email: string, name: string, verified: boolean): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    if (verified && !existing.verified) {
      existing.verified = true;
      await saveUser(existing);
    }
    return existing;
  }
  const u: User = {
    id: newId(email),
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    tier: "floor",
    verified,
    createdAt: new Date().toISOString(),
  };
  await saveUser(u);
  await listPush("tsr:users", u.id, 100000);
  return u;
}

// ---- comments ------------------------------------------------------------------

const HELD_FIRST_COMMENT = true; // new accounts soft-held until first approval

export async function getComment(id: string): Promise<Comment | null> {
  return getJSON<Comment>(`tsr:comment:${id}`);
}

export async function saveComment(c: Comment): Promise<void> {
  await setJSON(`tsr:comment:${c.id}`, c);
}

export async function addComment(c: Comment): Promise<void> {
  await saveComment(c);
  await listPush(`tsr:comments:${c.target}`, c.id, 2000);
  await listPush(`tsr:ucomments:${c.userId}`, c.id, 2000);
  if (c.status === "held") await listPush("tsr:modqueue", c.id, 1000);
}

export async function commentsFor(target: string, viewerId?: string): Promise<Comment[]> {
  const ids = await listRange(`tsr:comments:${target}`, 0, 199);
  const all = (await Promise.all(ids.map(getComment))).filter(Boolean) as Comment[];
  const visible = all.filter(
    (c) => c.status === "live" || (c.status === "held" && c.userId === viewerId)
  );
  // Minds-changed ranking: most minds moved first, then newest. No like button exists.
  return visible.sort((a, b) => b.minds - a.minds || +new Date(b.at) - +new Date(a.at));
}

export async function userComments(userId: string): Promise<Comment[]> {
  const ids = await listRange(`tsr:ucomments:${userId}`, 0, 199);
  return ((await Promise.all(ids.map(getComment))).filter(Boolean) as Comment[]).filter(
    (c) => c.status !== "removed"
  );
}

export async function userNeedsHold(userId: string): Promise<boolean> {
  if (!HELD_FIRST_COMMENT) return false;
  const approved = await kvGet(`tsr:approved:${userId}`);
  return approved !== "1";
}

export async function markUserApproved(userId: string): Promise<void> {
  await kvSet(`tsr:approved:${userId}`, "1");
}

export async function moderationQueue(): Promise<Comment[]> {
  const ids = await listRange("tsr:modqueue", 0, 99);
  const all = (await Promise.all(ids.map(getComment))).filter(Boolean) as Comment[];
  return all.filter((c) => c.status === "held");
}

export async function mindChanged(commentId: string, userId: string): Promise<Comment | null> {
  const guard = await kvGet(`tsr:mind:${commentId}:${userId}`);
  if (guard) return getComment(commentId);
  const c = await getComment(commentId);
  if (!c || c.userId === userId) return c;
  c.minds += 1;
  await saveComment(c);
  await kvSet(`tsr:mind:${commentId}:${userId}`, "1");
  return c;
}

// ---- clippings & follows ----------------------------------------------------------

export interface Clip {
  storyId: string;
  headline: string;
  at: string;
}

export async function getClips(userId: string): Promise<Clip[]> {
  return (await getJSON<Clip[]>(`tsr:clips:${userId}`)) ?? [];
}

export async function toggleClip(userId: string, storyId: string, headline: string): Promise<{ clips: Clip[]; added: boolean }> {
  const clips = await getClips(userId);
  const i = clips.findIndex((c) => c.storyId === storyId);
  let added = false;
  if (i >= 0) clips.splice(i, 1);
  else {
    clips.unshift({ storyId, headline, at: new Date().toISOString() });
    added = true;
  }
  await setJSON(`tsr:clips:${userId}`, clips);
  return { clips, added };
}

export async function getFollows(userId: string): Promise<Clip[]> {
  return (await getJSON<Clip[]>(`tsr:follows:${userId}`)) ?? [];
}

export async function toggleFollow(userId: string, storyId: string, headline: string): Promise<{ follows: Clip[]; added: boolean }> {
  const follows = await getFollows(userId);
  const i = follows.findIndex((c) => c.storyId === storyId);
  let added = false;
  if (i >= 0) follows.splice(i, 1);
  else {
    follows.unshift({ storyId, headline, at: new Date().toISOString() });
    added = true;
  }
  await setJSON(`tsr:follows:${userId}`, follows);
  return { follows, added };
}

// ---- reader calls (Your Ledger) ------------------------------------------------------

export async function addReaderCall(call: ReaderCall): Promise<void> {
  await setJSON(`tsr:call:${call.id}`, call);
  await listPush(`tsr:calls:user:${call.userId}`, call.id, 1000);
  await listPush(`tsr:calls:story:${call.storyId}`, call.id, 500);
  await listPush("tsr:calls:all", call.id, 2000);
}

export async function getReaderCall(id: string): Promise<ReaderCall | null> {
  return getJSON<ReaderCall>(`tsr:call:${id}`);
}

export async function saveReaderCall(c: ReaderCall): Promise<void> {
  await setJSON(`tsr:call:${c.id}`, c);
}

export async function userCalls(userId: string): Promise<ReaderCall[]> {
  const ids = await listRange(`tsr:calls:user:${userId}`, 0, 199);
  return (await Promise.all(ids.map(getReaderCall))).filter(Boolean) as ReaderCall[];
}

export async function storyCalls(storyId: string): Promise<ReaderCall[]> {
  const ids = await listRange(`tsr:calls:story:${storyId}`, 0, 99);
  return (await Promise.all(ids.map(getReaderCall))).filter(Boolean) as ReaderCall[];
}

export async function recentCalls(n = 100): Promise<ReaderCall[]> {
  const ids = await listRange("tsr:calls:all", 0, n - 1);
  return (await Promise.all(ids.map(getReaderCall))).filter(Boolean) as ReaderCall[];
}

export function judgmentScore(calls: ReaderCall[]): { score: number; hits: number; misses: number; open: number } {
  let hits = 0,
    misses = 0,
    open = 0,
    points = 0;
  const conf = { CERTAIN: 3, LIKELY: 2, GUESSING: 1 } as const;
  for (const c of calls) {
    if (c.result === "HIT") {
      hits++;
      points += conf[c.confidence];
    } else if (c.result === "MISS") {
      misses++;
      points -= conf[c.confidence];
    } else open++;
  }
  return { score: points, hits, misses, open };
}

// ---- the desk's Ledger ------------------------------------------------------------------

export async function deskCalls(): Promise<DeskCall[]> {
  return (await getJSON<DeskCall[]>("tsr:desk:calls")) ?? [];
}

export async function saveDeskCalls(calls: DeskCall[]): Promise<void> {
  await setJSON("tsr:desk:calls", calls);
}

// ---- posts (From the Second Row) ----------------------------------------------------------

export async function getPost(slug: string): Promise<Post | null> {
  return getJSON<Post>(`tsr:post:${slug}`);
}

export async function savePost(p: Post): Promise<void> {
  const exists = await getPost(p.slug);
  await setJSON(`tsr:post:${p.slug}`, p);
  if (!exists) await listPush("tsr:posts", p.slug, 5000);
}

export async function deletePost(slug: string): Promise<void> {
  await kvDel(`tsr:post:${slug}`);
}

export async function allPosts(): Promise<Post[]> {
  const slugs = await listRange("tsr:posts", 0, 199);
  const posts = (await Promise.all(slugs.map(getPost))).filter(Boolean) as Post[];
  return posts.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

// ---- founder's note ---------------------------------------------------------------------------

export async function getNote(): Promise<{ text: string; at: string } | null> {
  return getJSON("tsr:note");
}

export async function saveNote(text: string): Promise<void> {
  await setJSON("tsr:note", { text, at: new Date().toISOString() });
}

// ---- archive (nothing ever 404s) -----------------------------------------------------------------

export async function archiveStory(s: Story): Promise<void> {
  await setJSON(`tsr:archive:${s.id}`, s);
  await listPush("tsr:archive:index", JSON.stringify({ id: s.id, headline: s.headline, at: s.lastDev }), 5000);
}

export async function getArchived(id: string): Promise<Story | null> {
  return getJSON<Story>(`tsr:archive:${id}`);
}

export async function archiveIndex(n = 500): Promise<{ id: string; headline: string; at: string }[]> {
  const rows = await listRange("tsr:archive:index", 0, n - 1);
  return rows
    .map((r) => {
      try {
        return JSON.parse(r);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// ---- snapshots (The Rewind) + editions (The Morning Edition) --------------------------------------

export async function pushSnapshot(s: Snapshot): Promise<void> {
  // Every sweep for ~6 hours, plus an hourly long archive (~30 days).
  await listPush("tsr:snapshots", JSON.stringify(s), 360);
  const hourKey = s.at.slice(0, 13);
  const last = await kvGet("tsr:snapshots:lasthour");
  if (last !== hourKey) {
    await kvSet("tsr:snapshots:lasthour", hourKey);
    await listPush("tsr:snapshots:hourly", JSON.stringify(s), 720);
  }
}

export async function getSnapshots(): Promise<Snapshot[]> {
  const recent = await listRange("tsr:snapshots", 0, 359);
  return recent
    .map((r) => {
      try {
        return JSON.parse(r) as Snapshot;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Snapshot[];
}

export async function getHourlySnapshots(): Promise<Snapshot[]> {
  const rows = await listRange("tsr:snapshots:hourly", 0, 719);
  return rows
    .map((r) => {
      try {
        return JSON.parse(r) as Snapshot;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Snapshot[];
}

export async function saveEdition(e: Edition): Promise<void> {
  await setJSON(`tsr:edition:${e.date}`, e);
  await listPush("tsr:editions", e.date, 3650);
}

export async function getEdition(date: string): Promise<Edition | null> {
  return getJSON<Edition>(`tsr:edition:${date}`);
}

export async function editionDates(n = 60): Promise<string[]> {
  return listRange("tsr:editions", 0, n - 1);
}

export async function nextEditionNumber(): Promise<number> {
  return kvIncr("tsr:edition:counter");
}

// ---- founding wall ------------------------------------------------------------------------------------

export interface FoundingEntry {
  number: number;
  name: string;
  at: string;
}

export async function foundingWall(): Promise<FoundingEntry[]> {
  return (await getJSON<FoundingEntry[]>("tsr:founding")) ?? [];
}

export async function addFounding(name: string): Promise<FoundingEntry> {
  const wall = await foundingWall();
  const entry: FoundingEntry = { number: wall.length + 1, name, at: new Date().toISOString() };
  wall.push(entry);
  await setJSON("tsr:founding", wall);
  return entry;
}

// ---- metering (free-tier limits) -------------------------------------------------------------------------

export async function meter(userKey: string, what: string, limit: number): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const n = await kvIncr(`tsr:meter:${what}:${userKey}:${day}`, 86400 + 3600);
  return n <= limit;
}
