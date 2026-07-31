import type { Metadata } from "next";
import Link from "next/link";
import Classroom from "@/components/Classroom";
import SiteHeader from "@/components/SiteHeader";
import { PRIMERS } from "@/lib/toolkit";

export const metadata: Metadata = { title: "Classroom Mode", description: "Run a live-news judgment league: the Toolkit as curriculum, the board as the textbook." };

export default function ClassroomPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">Classroom Mode · for teachers</div>
        <h1>The board is the textbook. Judgment is the grade.</h1>
        <p className="lede" style={{ maxWidth: "68ch" }}>
          Civics taught on today&apos;s actual news: students learn the method from the Toolkit,
          then make scored calls on live stories and watch reality grade them. No memorizing
          positions — practicing judgment. This is the front edge of the platform&apos;s education
          phase, usable in your room today.
        </p>

        <Classroom />

        <h2>The five-week sequence</h2>
        <ol>
          {PRIMERS.slice(0, 5).map((p, i) => (
            <li key={p.slug} style={{ marginBottom: 6 }}>
              <strong>Week {i + 1}:</strong> <Link href={`/toolkit/${p.slug}`}>{p.title}</Link> — read it, do the drill, then apply it to a live story on the board.
            </li>
          ))}
          <li><strong>Ongoing:</strong> every student keeps a <Link href="/ledger">Ledger</Link>; the class runs as a <Link href="/seasons">Judgment Season</Link> with a leaderboard.</li>
        </ol>

        <h2>Why it works</h2>
        <p>
          Schools teach what to think and call it civics. This teaches <em>how</em> — and the news
          supplies infinite, free, self-updating material. Every rank on the board already shows
          its work (<Link href="/gravity">GRAVITY</Link>), every story shows its framing
          (<Link href="/spin">the Lens</Link>), and the desk models being wrong in public
          (<Link href="/ledger">the Ledger</Link>). The whole site is a working demonstration of
          the habits you&apos;re trying to build.
        </p>
        <p className="mono" style={{ color: "var(--slate)" }}>
          Full rosters, grading exports, and licensed curriculum arrive with the education phase —
          <Link href="/course"> join the waitlist</Link> to be first.
        </p>
      </div>
    </>
  );
}
