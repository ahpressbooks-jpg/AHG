import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Privacy", description: "What we collect, what we don't, and what's yours." };

export default function PrivacyPage() {
  return (
    <Prose kicker="Privacy" title="Privacy, in plain English.">
      <p className="lede">No ads, no ad trackers, no sale of your data — ever. Privacy isn&apos;t a setting here; it&apos;s the architecture.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Your email</strong>, if you take a seat — used for sign-in and the briefings you ask for, nothing else.</li>
        <li><strong>What you make</strong> — comments, clippings, and calls — kept on your account so you can find them.</li>
        <li><strong>Preferences</strong> (theme, reading depth, dismissed banners, your reading-tilt mirror) live in <em>your own browser</em> and never reach our servers.</li>
      </ul>
      <h2>What we don&apos;t</h2>
      <p>No third-party ad networks, no behavioral tracking, no cross-site profiles, no data brokers. Analytics, where used, are privacy-first and cookie-free — which is why you won&apos;t see a cookie-consent wall.</p>
      <h2>What&apos;s yours</h2>
      <p>
        Two buttons on <Link href="/you">Your Seat</Link>, no support ticket: <strong>Download everything</strong>
        (a full export of your data) and <strong>Delete me</strong> (full erasure). Your account is yours to take or end at any time.
      </p>
      <h2>Payments</h2>
      <p>Subscriptions are processed by Stripe; card details never touch our servers. We store only what&apos;s needed to manage your membership.</p>
      <p className="mono">Questions? <Link href="/contact">Contact the desk</Link>. Material changes to this policy will be dated and disclosed — no quiet edits.</p>
    </Prose>
  );
}
