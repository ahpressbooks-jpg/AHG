import { BoardState, DeskOverrides } from "./types";

// ---------------------------------------------------------------------------
// Storage: Upstash Redis / Vercel KV via REST when configured; honest
// in-memory fallback when not. The site works with zero configuration and
// gains permanence the moment a database is attached. No SDK required.
// ---------------------------------------------------------------------------

const BOARD_KEY = "tsr:board";
const OVERRIDES_KEY = "tsr:overrides";
const SEATS_KEY = "tsr:seats"; // email capture list
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
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const data = await res.json();
  return data.result;
}

// In-memory fallback — survives warm invocations, resets on cold start.
// The board rebuilds itself from the wire on the next sweep; biographies
// shorten. Honest degradation, documented at /method.
const g = globalThis as any;
g.__tsr = g.__tsr || { board: null, overrides: {}, seats: [], lockUntil: 0 };

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
    } catch {
      /* memory copy already saved */
    }
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

export async function saveSeat(email: string): Promise<"stored" | "memory"> {
  if (redisCreds()) {
    try {
      await redis(["RPUSH", SEATS_KEY, JSON.stringify({ email, at: new Date().toISOString() })]);
      return "stored";
    } catch {}
  }
  g.__tsr.seats.push({ email, at: new Date().toISOString() });
  return "memory";
}

/**
 * Distributed sweep lock: at most one sweep runs at a time, anywhere.
 * Without redis this is per-instance — acceptable, since the cost of a
 * duplicate sweep is a few redundant feed polls, not duplicate data.
 */
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
