import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Terms of Service", description: "The rules of the house." };

export default function TermsPage() {
  return (
    <Prose kicker="Terms of Service" title="The rules of the house.">
      <p className="lede">Plain terms for a plain-dealing publication. By using The Second Row you agree to these.</p>
      <h2>Using the site</h2>
      <p>You may read, share, and link freely. Don&apos;t scrape at volumes that degrade the service, don&apos;t misrepresent the site, and don&apos;t use it to break the law. Accounts are for humans; don&apos;t abuse the comment system or the APIs.</p>
      <h2>Aggregation</h2>
      <p>The Wire links to original reporting and shows headlines, short excerpts, and attribution — it never republishes full articles. Rights to linked work remain with their publishers. Our rankings, annotations, the Ledger, and original writing are ours.</p>
      <h2>Your contributions</h2>
      <p>You keep ownership of what you post; you grant us a license to display and moderate it. Comments held or removed follow one rule for everyone (<Link href="/standards">Standards</Link>). Keep it lawful and good-faith.</p>
      <h2>Membership &amp; billing</h2>
      <p>Subscriptions renew automatically and are disclosed at checkout. Cancel anytime from <Link href="/you">Your Seat</Link>; access runs to the period&apos;s end. Refunds within 14 days, no questions (<Link href="/subscribe">Subscribe</Link>).</p>
      <h2>No warranty</h2>
      <p>We work hard to be accurate and we publish our own error rate — but the service is provided &quot;as is.&quot; Reach your own verdict; that&apos;s the entire point of the place.</p>
      <p className="mono">Changes are dated and disclosed. See also <Link href="/privacy">Privacy</Link> and <Link href="/cookies">Cookies</Link>.</p>
    </Prose>
  );
}
