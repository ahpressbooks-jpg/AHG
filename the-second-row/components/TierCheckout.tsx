"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Load the publishable key once, only if present (guards loadStripe(undefined)).
const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!PK) return null;
  if (!stripePromise) stripePromise = loadStripe(PK);
  return stripePromise;
}

export function hasPublishableKey() {
  return Boolean(PK);
}

// The embedded payment form, mounted on our own page inside an overlay.
export default function TierCheckout({ clientSecret, onClose }: { clientSecret: string; onClose: () => void }) {
  const stripe = getStripe();
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="overlay-card" style={{ maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="overlay-kicker">Take your seat · secure checkout by Stripe</div>
          <button onClick={onClose} aria-label="Close checkout" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--slate)" }}>
            ✕ CLOSE
          </button>
        </div>
        {stripe ? (
          <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="capture-note">
            Missing <strong>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</strong>. Add your Stripe publishable
            key (pk_…) in Vercel env and redeploy to show the payment form.
          </p>
        )}
      </div>
    </div>
  );
}
