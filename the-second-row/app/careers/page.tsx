import type { Metadata } from "next";
import Link from "next/link";
import { CaptureInline } from "@/components/CaptureInline";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Careers", description: "Help build a new kind of news company." };

export default function CareersPage() {
  return (
    <Prose kicker="Careers" title="Build the front page for the news.">
      <p className="lede">
        The Second Row is early. That&apos;s the opportunity: you&apos;d be shaping a publication&apos;s
        method, not maintaining a legacy one. We hire for judgment, clarity, and the nerve to be wrong in
        public and survive it.
      </p>
      <h2>What we look for</h2>
      <ul>
        <li><strong>Reporters &amp; analysts</strong> who can separate what happened from what they think, and tag the difference.</li>
        <li><strong>Engineers</strong> who care about editorial systems — ranking, evidence, trust UI.</li>
        <li><strong>Educators</strong> to grow the <Link href="/toolkit">Toolkit</Link> and the classroom program.</li>
      </ul>
      <h2>How to reach us</h2>
      <p>
        There&apos;s no portal yet. Send the desk what you&apos;ve made and why this place fits you —
        <Link href="/contact"> contact</Link>. Or join the list below and we&apos;ll write when roles open.
      </p>
      <CaptureInline label="Tell me when roles open" line="No spam — only when the masthead grows." />
    </Prose>
  );
}
