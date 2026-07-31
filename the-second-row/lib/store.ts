import { BoardState, DeskOverrides } from "./types";

// ---------------------------------------------------------------------------
// Storage. Upstash Redis / Vercel KV via REST when configured (durable — this
// is the Permanent Record's home until/unless Postgres is attached); honest
// in-memory fallback when not, so the site runs with zero configuration.
// ---------------------------------------------------------------------------

const BOARD_KEY = "tsr:board";
const OVERRIDES_KEY = "tsr:overrides";
const SEATS_KEY = "tsr:seats";
const LOCK_KEY = "tsr:sweeplock";

function redisCreds(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return { url, token };
  return null;
}

export function hasDurableStore(): boolean {
  return redisCreds() != null;
}

async function redis(cmd: (string | number)[]): Promise<any> {
  const creds = redisCreds();
  if (!creds) throw new Error("no redis");
  const res = await fetch(creds.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const data = await res.json();
  return data.result;
}

// In-memory fallback — survives warm invocations, resets on cold start.
const g = globalThis as any;
g.__tsr = g.__tsr || {
  board: null,
  overrides: {},
  lockUntil: 0,
  kv: new Map<string, string>(),
  lists: new Map<string, string[]>(),
  expiry: new Map<string, number>(),
};

function memSweep(key: string) {
  const exp = g.__tsr.expiry.get(key);
  if (exp && Date.now() > exp) {
    g.__tsr.kv.delete(key);
    g.__tsr.lists.delete(key);
    g.__tsr.expiry.delete(key);
  }
}

// ---- generic KV ------------------------------------------------------------

export async function kvGet(key: string): Promise<string | null> {
  if (redisCreds()) {
    try {
      return (await redis(["GET", key])) ?? null;
    } catch {}
  }
  memSweep(key);
  return g.__tsr.kv.get(key) ?? null;
}

export async function kvSet(key: string, val: string, exSec?: number): Promise<void> {
  g.__tsr.kv.set(key, val);
  if (exSec) g.__tsr.expiry.set(key, Date.now() + exSec * 1000);
  if (redisCreds()) {
    try {
      await redis(exSec ? ["SET", key, val, "EX", exSec] : ["SET", key, val]);
    } catch {}
  }
}

export async function kvDel(key: string): Promise<void> {
  g.__tsr.kv.delete(key);
  g.__tsr.lists.delete(key);
  if (redisCreds()) {
    try {
      await redis(["DEL", key]);
    } catch {}
  }
}

export async function kvIncr(key: string, exSec?: number): Promise<number> {
  let memVal = (parseInt(g.__tsr.kv.get(key) ?? "0", 10) || 0) + 1;
  g.__tsr.kv.set(key, String(memVal));
  if (exSec) g.__tsr.expiry.set(key, Date.now() + exSec * 1000);
  if (redisCreds()) {
    try {
      const v = await redis(["INCR", key]);
      if (exSec) await redis(["EXPIRE", key, exSec]);
      return Number(v);
    } catch {}
  }
  return memVal;
}

// ---- generic lists (newest first) -------------------------------------------

export async function listPush(key: string, val: string, cap?: number): Promise<void> {
  const mem: string[] = g.__tsr.lists.get(key) ?? [];
  mem.unshift(val);
  if (cap && mem.length > cap) mem.length = cap;
  g.__tsr.lists.set(key, mem);
  if (redisCreds()) {
    try {
      await redis(["LPUSH", key, val]);
      if (cap) await redis(["LTRIM", key, 0, cap - 1]);
    } catch {}
  }
}

export async function listRange(key: string, start = 0, stop = -1): Promise<string[]> {
  if (redisCreds()) {
    try {
      const r = await redis(["LRANGE", key, start, stop]);
      if (Array.isArray(r)) return r;
    } catch {}
  }
  memSweep(key);
  const mem: string[] = g.__tsr.lists.get(key) ?? [];
  return stop === -1 ? mem.slice(start) : mem.slice(start, stop + 1);
}

export async function listLen(key: string): Promise<number> {
  if (redisCreds()) {
    try {
      return Number(await redis(["LLEN", key]));
    } catch {}
  }
  return (g.__tsr.lists.get(key) ?? []).length;
}

// ---- JSON conveniences -------------------------------------------------------

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await kvGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, val: unknown, exSec?: number): Promise<void> {
  await kvSet(key, JSON.stringify(val), exSec);
}

// ---- board / overrides / seats (v1 surface, unchanged) ------------------------

export async function loadBoard(): Promise<BoardState | null> {
  if (redisCreds()) {
    try {
      const raw = await redis(["GET", BOARD_KEY]);
      return raw ? (JSON.parse(raw) as BoardState) : null;
    } catch {
      return g.__tsr.board;
    }
  }
  return g.__tsr.board;
}

export async function saveBoard(state: BoardState): Promise<void> {
  g.__tsr.board = state;
  if (redisCreds()) {
    try {
      await redis(["SET", BOARD_KEY, JSON.stringify(state)]);
    } catch {}
  }
}

export async function loadOverrides(): Promise<DeskOverrides> {
  if (redisCreds()) {
    try {
      const raw = await redis(["GET", OVERRIDES_KEY]);
      return raw ? (JSON.parse(raw) as DeskOverrides) : {};
    } catch {
      return g.__tsr.overrides;
    }
  }
  return g.__tsr.overrides;
}

export async function saveOverrides(o: DeskOverrides): Promise<void> {
  g.__tsr.overrides = o;
  if (redisCreds()) {
    try {
      await redis(["SET", OVERRIDES_KEY, JSON.stringify(o)]);
    } catch {}
  }
}

export async function saveSeat(email: string): Promise<"stored" | "memory" | "dup"> {
  const e = email.toLowerCase();
  // Dedupe: one seat per address — no double counting, no double emailing.
  if (await kvGet(`tsr:seatseen:${e}`)) return hasDurableStore() ? "stored" : "dup";
  await kvSet(`tsr:seatseen:${e}`, "1");
  // Write through the shared list helper so memory and Redis stay consistent
  // and every reader (listLen/listRange) sees the same data.
  await listPush(SEATS_KEY, JSON.stringify({ email: e, at: new Date().toISOString() }), 100000);
  return hasDurableStore() ? "stored" : "memory";
}

export async function acquireSweepLock(ttlSec = 50): Promise<boolean> {
  if (redisCreds()) {
    try {
      const ok = await redis(["SET", LOCK_KEY, "1", "NX", "EX", ttlSec]);
      return ok === "OK";
    } catch {
      return true;
    }
  }
  const now = Date.now();
  if (g.__tsr.lockUntil > now) return false;
  g.__tsr.lockUntil = now + ttlSec * 1000;
  return true;
}

export async function releaseSweepLock(): Promise<void> {
  g.__tsr.lockUntil = 0;
  if (redisCreds()) {
    try {
      await redis(["DEL", LOCK_KEY]);
    } catch {}
  }
}
