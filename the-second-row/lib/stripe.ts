import { createHmac, timingSafeEqual } from "node:crypto";
import { bumpStat } from "./ops";
import { addFounding, getUser, saveUser } from "./records";
import { User } from "./types";

// ---------------------------------------------------------------------------
// Stripe via plain REST — no SDK. Activates when STRIPE_SECRET_KEY is set;
// until then /subscribe shows the honest "payments open at launch" state.
// Card data never touches this server: Checkout + Customer Portal are hosted.
// ---------------------------------------------------------------------------

export type PriceKey = "pro_month" | "pro_year" | "founding";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function priceId(key: PriceKey): string | undefined {
  return {
    pro_month: process.env.STRIPE_PRICE_PRO_MONTH,
    pro_year: process.env.STRIPE_PRICE_PRO_YEAR,
    founding: process.env.STRIPE_PRICE_FOUNDING,
  }[key];
}

async function stripe(path: string, params: Record<string, string>): Promise<any> {
  const key = process.env.STRIPE_SECRET_KEY!;
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `stripe ${res.status}`);
  return data;
}

export async function createCheckout(user: User, price: PriceKey, baseUrl: string): Promise<string> {
  const pid = priceId(price);
  if (!pid) throw new Error(`Price not configured: ${price}`);
  const params: Record<string, string> = {
    mode: "subscription",
    "line_items[0][price]": pid,
    "line_items[0][quantity]": "1",
    success_url: `${baseUrl}/you?welcome=1`,
    cancel_url: `${baseUrl}/subscribe`,
    "metadata[uid]": user.id,
    "metadata[price]": price,
    "subscription_data[metadata][uid]": user.id,
    "subscription_data[metadata][price]": price,
    allow_promotion_codes: "true",
  };
  if (user.stripeCustomerId) params.customer = user.stripeCustomerId;
  else params.customer_email = user.email;
  const session = await stripe("checkout/sessions", params);
  return session.url;
}

export async function createPortal(user: User, baseUrl: string): Promise<string> {
  if (!user.stripeCustomerId) throw new Error("No billing on file yet.");
  const session = await stripe("billing_portal/sessions", {
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/you`,
  });
  return session.url;
}

// ---- webhook signature (Stripe scheme: t=...,v1=HMACSHA256(`${t}.${payload}`)) ----

export function verifyStripeSignature(payload: string, header: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ---- event handling: entitlements update within seconds of payment events ----

export async function handleStripeEvent(event: any): Promise<string> {
  const type: string = event?.type ?? "";
  const obj = event?.data?.object ?? {};

  if (type === "checkout.session.completed") {
    const uid = obj?.metadata?.uid;
    if (!uid) return "no uid";
    const user = await getUser(uid);
    if (!user) return "no user";
    user.stripeCustomerId = obj.customer || user.stripeCustomerId;
    user.stripeSubscriptionId = obj.subscription || user.stripeSubscriptionId;
    const price = obj?.metadata?.price;
    user.tier = price === "founding" ? "founding" : "pro";
    user.subscriptionStatus = "active";
    if (user.tier === "founding" && !user.foundingNumber) {
      const entry = await addFounding(user.name);
      user.foundingNumber = entry.number;
    }
    if (user.tier === "pro") await bumpStat("pro_act");
    await saveUser(user);
    return `seated ${user.tier}`;
  }

  if (type === "customer.subscription.updated" || type === "customer.subscription.deleted") {
    const uid = obj?.metadata?.uid;
    if (!uid) return "no uid";
    const user = await getUser(uid);
    if (!user) return "no user";
    const status: string = obj?.status ?? "";
    if (type === "customer.subscription.deleted" || status === "canceled" || status === "unpaid") {
      // Downgrade, never delete: clippings, comments, scores all keep.
      if (user.tier === "pro") await bumpStat("churn");
      user.tier = "floor";
      user.subscriptionStatus = "canceled";
    } else if (status === "past_due") {
      user.subscriptionStatus = "grace"; // 7-day grace via Stripe dunning
    } else if (status === "active" || status === "trialing") {
      user.subscriptionStatus = "active";
      if (user.tier === "floor") user.tier = obj?.metadata?.price === "founding" ? "founding" : "pro";
    }
    if (obj?.current_period_end) {
      user.periodEnd = new Date(obj.current_period_end * 1000).toISOString();
    }
    await saveUser(user);
    return `status ${user.subscriptionStatus}`;
  }

  if (type === "invoice.payment_failed") {
    const uid = obj?.subscription_details?.metadata?.uid || obj?.metadata?.uid;
    if (uid) {
      const user = await getUser(uid);
      if (user) {
        user.subscriptionStatus = "grace";
        await saveUser(user);
      }
    }
    return "grace";
  }

  return "ignored";
}
