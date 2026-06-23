import type { Metadata } from "next";
import Link from "next/link";
import { CaptureInline } from "@/components/CaptureInline";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Newsletters", description: "The 7 a.m. board and the daily briefing, in your inbox." };

export default function NewslettersPage() {
  return (
    <Prose kicker="Newsletters" title="The news, finished — in your inbox.">
      <p className="lede">Email built the way the site is: ranked by weight, honest about confidence, and designed to be finished.</p>
      <div className="cards" style={{ margin: "18px 0" }}>
        <div className="card">
          <div className="card-kicker">Daily · free</div>
          <h3>The Morning Edition</h3>
          <p>The board frozen at 7 a.m. — numbered, permanent, and finite. A day of news you can actually finish. <Link href="/today">See today →</Link></p>
        </div>
        <div className="card">
          <div className="card-kicker">Weekly · Pro</div>
          <h3>Steelman Saturday</h3>
          <p>One argument, both sides at their strongest, before the desk says where it lands. <Link href="/column">From the column →</Link></p>
        </div>
        <div className="card">
          <div className="card-kicker">As it happens · opt-in</div>
          <h3>FLASH alerts</h3>
          <p>Only when a story takes the stage. Orange stays rare in your inbox too.</p>
        </div>
      </div>
      <CaptureInline label="Take your seat" line="The Morning Edition is free. No team to join, no spam — unsubscribe in one click." />
      <p className="mono" style={{ marginTop: 14 }}>Prefer to listen? <Link href="/podcasts">The Board Read →</Link></p>
    </Prose>
  );
}
