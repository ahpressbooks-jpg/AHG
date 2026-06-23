import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Help & FAQ", description: "Answers about The Second Row." };

const QA: [string, React.ReactNode][] = [
  ["What is The Wire?", <>A live board that ranks the day&apos;s news by <Link href="/gravity">GRAVITY</Link> — re-checked every 60 seconds. The full board is at <Link href="/wire">/wire</Link>; the front page carries the signature module.</>],
  ["Is it free?", <>Yes. The live Wire, today&apos;s briefing, the Spin Room, and 30 days of dossiers are free forever. Pro unlocks the full archive, the Rewind, and more depth — see <Link href="/subscribe">Subscribe</Link>.</>],
  ["How do I sign in?", <>No passwords — ever. Enter your email at <Link href="/you">Your Seat</Link> and you&apos;re in. Your comments, clippings, and calls live on the Permanent Record.</>],
  ["How do comments work?", <>Ranked by minds changed, not likes. Every comment wears its confidence; rebuttals restate the other side first. First comments are briefly held — one rule for everyone.</>],
  ["Can I cancel anytime?", <>Two taps, no guilt screens, from <Link href="/you">Your Seat</Link>. Nothing you made is ever deleted on downgrade.</>],
  ["How do I send a tip?", <>Through <Link href="/tips">Send a Tip</Link> — including securely.</>],
  ["Found a bug or error?", <>Tell us via <Link href="/contact">Contact</Link> or <Link href="/corrections">Corrections</Link>.</>],
];

export default function HelpPage() {
  return (
    <Prose kicker="Help & FAQ" title="How this works.">
      {QA.map(([q, a], i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>{q}</h2>
          <p style={{ margin: 0 }}>{a}</p>
        </div>
      ))}
      <p className="mono" style={{ marginTop: 20 }}>Still stuck? <Link href="/contact">Reach the desk →</Link></p>
    </Prose>
  );
}
