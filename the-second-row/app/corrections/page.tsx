import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Corrections", description: "How we fix the record — in the open." };

export default function CorrectionsPage() {
  return (
    <Prose kicker="Corrections" title="We fix the record in the open.">
      <p className="lede">
        No quiet edits — anywhere, ever. When we get something wrong, the fix is dated and visible, not
        slipped in overnight.
      </p>
      <h2>How it works</h2>
      <ul>
        <li><strong>The board.</strong> Every tier change, headline normalization, and desk intervention is logged in a story&apos;s public biography automatically.</li>
        <li><strong>The desk&apos;s writing.</strong> Errors are corrected in place with a dated note explaining what changed.</li>
        <li><strong>The desk&apos;s judgment.</strong> Predictions that miss go on <Link href="/ledger">the Ledger</Link> as misses — first, not buried. Being wrong in public, on purpose, is the point.</li>
      </ul>
      <h2>Flag an error</h2>
      <p>
        Spotted a mistake? Tell us via <Link href="/contact">Contact</Link> with the URL and what&apos;s
        wrong. Substantiated corrections are made promptly and noted. We&apos;d rather be corrected than be
        confidently wrong.
      </p>
      <p className="mono">The one thing a tribe can never publish is its own error rate. We publish ours.</p>
    </Prose>
  );
}
