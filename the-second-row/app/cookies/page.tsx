import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Cookie Policy", description: "The short version: almost none." };

export default function CookiesPage() {
  return (
    <Prose kicker="Cookie Policy" title="The short version: almost none.">
      <p className="lede">No advertising cookies, no third-party trackers, no cross-site profiling. That&apos;s why there&apos;s no annoying consent wall.</p>
      <h2>What we do use</h2>
      <ul>
        <li><strong>A sign-in cookie</strong> — only after you take a seat, so you stay signed in. It&apos;s first-party, HttpOnly, and carries no tracking.</li>
        <li><strong>Your browser&apos;s local storage</strong> — for preferences (theme, reading depth, dismissed banners, your private reading-tilt). This never leaves your device.</li>
        <li><strong>A desk cookie</strong> — only for the password-protected Control Room, only for the owner.</li>
      </ul>
      <h2>Analytics</h2>
      <p>If analytics are enabled, they&apos;re privacy-first and cookie-free — aggregate counts, no individual tracking. See <Link href="/privacy">Privacy</Link> for the full picture.</p>
      <p className="mono">Clear your browser storage anytime to reset preferences; sign out to drop the session cookie.</p>
    </Prose>
  );
}
