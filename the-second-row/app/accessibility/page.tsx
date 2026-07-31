import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Accessibility", description: "Built to be read by everyone." };

export default function AccessibilityPage() {
  return (
    <Prose kicker="Accessibility" title="Built to be read by everyone.">
      <p className="lede">A news product only does its job if everyone can use it. We build to WCAG 2.2 AA and treat access failures as bugs.</p>
      <h2>What that means here</h2>
      <ul>
        <li><strong>Full keyboard operation</strong> — on the Wire, J/K walk the rows, T opens the ticker, H holds the board, <code>?</code> reopens the tour.</li>
        <li><strong>Screen-reader support</strong> — live-region announcements for re-seats and flashes; meaningful labels throughout.</li>
        <li><strong>Reduced-motion respect</strong> — every animation has a calm equivalent under <code>prefers-reduced-motion</code>.</li>
        <li><strong>Never color alone</strong> — rank and status always carry a label and position, not just a hue, so the system survives color-blindness.</li>
        <li><strong>Both themes</strong> — Daylight and Evening are contrast-checked to AA or better.</li>
      </ul>
      <h2>Tell us where it fails</h2>
      <p>If anything here blocks you, that&apos;s on us — please <Link href="/contact">report it</Link> with your device and assistive tech, and we&apos;ll fix it. Accessibility is in our <Link href="/standards">Standards</Link>.</p>
    </Prose>
  );
}
