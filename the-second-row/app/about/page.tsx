import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "About", description: "What The Second Row is, and why it exists." };

export default function AboutPage() {
  return (
    <Prose kicker="About" title="An independent news company, founded at 21.">
      <p className="lede">
        The Second Row ranks the day by what actually carries weight — not what gets the most clicks —
        and shows its work on every call. We aggregate the world&apos;s newsrooms, score each story by a
        published algorithm, separate reporting from opinion, and keep a public record of our own
        predictions, misses included.
      </p>
      <h2>What makes us different</h2>
      <p>
        Most feeds optimize for engagement. We optimize for consequence. <Link href="/gravity">GRAVITY</Link>,
        our ranking, weighs how many independent newsrooms carry a story, how fast it&apos;s spreading, how
        many people it touches, whether power is being exercised, and how fresh it is — and the math is
        public and tunable. We audit our own balance in the open (<Link href="/tilt">the Tilt Meter</Link>),
        publish our books (<Link href="/glass">the Glass Desk</Link>), and grade our own calls
        (<Link href="/ledger">the Ledger</Link>).
      </p>
      <h2>The seat</h2>
      <p>
        One row back from the stage: close enough to see everything, far enough back to see <em>all</em> of
        it. The front row buys belonging. The second row keeps its judgment. We don&apos;t sell a team to
        join — we sell a clearer view of the news and the skill to reach your own verdict.
      </p>
      <p className="mono">
        Read the full thesis on <Link href="/company">The Company</Link> · meet the desk on the{" "}
        <Link href="/masthead">Masthead</Link> · see how we work in <Link href="/standards">Standards &amp; Ethics</Link>.
      </p>
    </Prose>
  );
}
