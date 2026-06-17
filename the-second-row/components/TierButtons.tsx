"use client";

import { useState } from "react";
import TierCheckout, { hasPublishableKey } from "./TierCheckout";

export function TierButtons({ live }: { live: boolean }) {
  const [note, setNote] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const buy = async (price: string) => {
    setNote(null);
    if (!live) {
      setNote("Payments open at launch — the tiers are real, the till isn't plugged in yet.");
      return;
    }
    if (!hasPublishableKey()) {
      setNote("Almost — add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_…) in Vercel env and redeploy.");
      return;
    }
    setBusy(price);
    try {
      const res = await fetch("/api/stripe/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setNote("One step first: take a seat (free) so your membership has a name. Sending you there…");
          setTimeout(() => (window.location.href = "/you"), 1600);
          return;
        }
        setNote(data.error || "Checkout hiccuped.");
        return;
      }
      setClientSecret(data.clientSecret);
    } catch {
      setNote("Network hiccup — try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="tiers">
        <div className="tier">
          <h3 className="tier-name">The Floor</h3>
          <div className="tier-price">Free <small>forever</small></div>
          <ul>
            <li>The live Wire, full</li>
            <li>Today&apos;s briefing &amp; Spin Room</li>
            <li>Dossiers, 30 days deep</li>
            <li>Comments, calls, Judgment Score</li>
            <li>10 clippings · 3 follows</li>
            <li>The Morning Edition email</li>
          </ul>
          <a className="btn btn--ghost" href="/">You&apos;re already in it</a>
        </div>

        <div className="tier tier--featured">
          <h3 className="tier-name">Second Row Pro</h3>
          <div className="tier-price">$8<small>/mo · or $80/yr</small></div>
          <ul>
            <li>The entire archive, forever</li>
            <li>The workings behind every Ledger verdict</li>
            <li>Steelman Saturday, long form</li>
            <li>The Rewind: all of history</li>
            <li>Unlimited clippings, follows, catch-me-ups</li>
            <li>The full briefing email</li>
            <li>One gift month to give (the Second Seat)</li>
          </ul>
          <button className="btn btn--maroon" disabled={busy === "pro_month"} onClick={() => buy("pro_month")}>
            {busy === "pro_month" ? "Opening…" : "Pro monthly — $8"}
          </button>
          <button className="btn btn--ghost" disabled={busy === "pro_year"} onClick={() => buy("pro_year")}>
            {busy === "pro_year" ? "Opening…" : "Pro yearly — $80"}
          </button>
        </div>

        <div className="tier">
          <h3 className="tier-name">Founding Member</h3>
          <div className="tier-price">$200<small>/yr · capped at 500</small></div>
          <ul>
            <li>Everything in Pro</li>
            <li>Name &amp; number on the Founding wall</li>
            <li>Quarterly live Q&amp;A with the desk</li>
            <li>A direct line for tips</li>
            <li>First seat when The Room opens</li>
            <li>Two gift months · maroon mark on comments</li>
            <li>Price locked forever</li>
          </ul>
          <button className="btn" disabled={busy === "founding"} onClick={() => buy("founding")}>
            {busy === "founding" ? "Opening…" : "Take a founding seat"}
          </button>
        </div>
      </div>
      {!live && (
        <p className="capture-note">
          Payments open at launch — the tiers are real, the till isn&apos;t plugged in yet. (Owner:
          add the Stripe keys + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and this page goes live unchanged.)
        </p>
      )}
      {note && <p className="capture-note">{note}</p>}
      {clientSecret && <TierCheckout clientSecret={clientSecret} onClose={() => setClientSecret(null)} />}
    </>
  );
}
