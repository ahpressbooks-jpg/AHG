import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Send a Tip", description: "Get information to the desk — including securely." };

export default function TipsPage() {
  return (
    <Prose kicker="Send a Tip" title="Got something we should look into?">
      <p className="lede">
        The <Link href="/assignment-desk">Assignment Desk</Link> runs on what readers point us at. If you
        have a document, a lead, or a question that deserves digging, here&apos;s how to reach us — safely.
      </p>
      <h2>Ordinary tips</h2>
      <p>Email the desk (address published with the briefing) or post it to the relevant story&apos;s comments. Specifics and links help us move fast.</p>
      <h2>Sensitive material</h2>
      <p>
        If you need to protect your identity: contact us from a non-work device and a non-work account; do not
        use a network or hardware your employer controls. We will not publish identifying details without your
        consent, and we honor reasonable requests to go on background. A hardened submission channel
        (encrypted drop) is on our roadmap as we grow — until then, reach out and we&apos;ll arrange a secure
        method before you send anything sensitive.
      </p>
      <h2>What helps</h2>
      <ul>
        <li>Primary documents over summaries — we annotate sources in <Link href="/documents">Documents</Link>.</li>
        <li>Dates, names, and how you know what you know.</li>
        <li>What you think the story is — and what would prove or disprove it.</li>
      </ul>
      <p className="mono">We protect sources. We also verify before we publish — that&apos;s the whole brand.</p>
    </Prose>
  );
}
