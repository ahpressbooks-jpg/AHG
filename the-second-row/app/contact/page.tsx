import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Contact", description: "Reach the desk." };

export default function ContactPage() {
  return (
    <Prose kicker="Contact" title="Reach the desk.">
      <p className="lede">We read everything. Pick the door that fits.</p>
      <table>
        <tbody>
          <tr><td className="mono">General</td><td>The desk — published with the daily briefing. <Link href="/newsletters">Get on the list →</Link></td></tr>
          <tr><td className="mono">News tips</td><td><Link href="/tips">Send a tip</Link> — including securely.</td></tr>
          <tr><td className="mono">Corrections</td><td>Flag an error → <Link href="/corrections">Corrections</Link>. We fix in the open, no quiet edits.</td></tr>
          <tr><td className="mono">Press</td><td>Bios, logos, and the numbers → <Link href="/press">Press kit</Link>.</td></tr>
          <tr><td className="mono">Membership &amp; billing</td><td>Manage your seat at <Link href="/you">Your Seat</Link> · <Link href="/help">Help &amp; FAQ</Link>.</td></tr>
          <tr><td className="mono">Work with us</td><td><Link href="/careers">Careers</Link></td></tr>
        </tbody>
      </table>
      <p className="mono">
        A founder-led newsroom means a real person answers. Be specific and we&apos;ll be fast.
      </p>
    </Prose>
  );
}
