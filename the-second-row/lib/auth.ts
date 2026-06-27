import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findOrCreateUser, getUser } from "./records";
import { kvDel, kvGet, kvSet } from "./store";
import { User } from "./types";

// ---------------------------------------------------------------------------
// Passwordless auth. With RESEND_API_KEY set: real magic links by email.
// Without it: open-door mode — the account is created on the spot and marked
// unverified (verification turns on the day an email key is added). No
// passwords exist anywhere, so none can leak.
// ---------------------------------------------------------------------------

const COOKIE = "tsr_session";
const SESSION_DAYS = 90;

function secret(): string {
  return process.env.AUTH_SECRET || process.env.DESK_PASSWORD || "tsr-dev-secret-set-AUTH_SECRET";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function sessionToken(userId: string): string {
  const exp = Date.now() + SESSION_DAYS * 86400_000;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [uid, exp, sig] = parts;
  if (Number(exp) < Date.now()) return null;
  const expect = sign(`${uid}.${exp}`);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  } catch {
    return null;
  }
  return uid;
}

export async function sessionUser(): Promise<User | null> {
  const jar = await cookies();
  const uid = verifySessionToken(jar.get(COOKIE)?.value);
  if (!uid) return null;
  return getUser(uid);
}

export function sessionCookie(userId: string) {
  return {
    name: COOKIE,
    value: sessionToken(userId),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 86400,
    path: "/",
  };
}

export function clearCookie() {
  return { name: COOKIE, value: "", maxAge: 0, path: "/" };
}

// ---- magic links ------------------------------------------------------------

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMagicLink(email: string, name: string, baseUrl: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const token = sign(email + Date.now() + Math.random()).slice(0, 32);
  await kvSet(`tsr:magic:${token}`, JSON.stringify({ email, name }), 900);
  const link = `${baseUrl}/api/auth/callback?token=${token}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.AUTH_EMAIL_FROM || "The Second Row <seat@thesecondrow.news>",
        to: [email],
        subject: "Your seat is ready",
        text: `Take your seat at The Second Row:\n\n${link}\n\nThis link works once and expires in 15 minutes. If you didn't ask for it, ignore it — no account was created.`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function consumeMagicToken(token: string): Promise<User | null> {
  const raw = await kvGet(`tsr:magic:${token}`);
  if (!raw) return null;
  await kvDel(`tsr:magic:${token}`);
  try {
    const { email, name } = JSON.parse(raw);
    return findOrCreateUser(email, name, true);
  } catch {
    return null;
  }
}

// ---- entitlements (the Velvet Rope) -------------------------------------------

export function isPaid(u: User | null): boolean {
  if (!u) return false;
  return (
    (u.tier === "pro" || u.tier === "founding") &&
    (u.subscriptionStatus === "active" || u.subscriptionStatus === "grace")
  );
}

// All reading is free and open (civic-trust mandate). Membership is optional
// support, not a gate — so these limits are effectively unlimited. The few
// personal-list caps remain generous to discourage abuse, not to gate reading.
export const FREE_LIMITS = {
  clips: 1000,
  follows: 1000,
  catchMeUp: 1000, // per day
  archiveDays: 1_000_000, // the whole archive is free
  rewindDays: 1_000_000, // all of history is free
};
