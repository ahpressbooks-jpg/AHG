import type { Metadata } from "next";
import Link from "next/link";
import BoardRead from "@/components/BoardRead";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "The Board Read", description: "The day's board as a 90-second listen — read aloud, free, no download." };

export default function BoardReadPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Board Read · listen</div>
        <h1>The board, out loud.</h1>
        <p className="lede">
          The day&apos;s top stories and the desk&apos;s note, read aloud right in your browser —
          a 90-second civic briefing for the commute, the kitchen, the gym. No app, no download,
          no account. Press play.
        </p>
        <BoardRead />
        <p className="mono" style={{ marginTop: 24, color: "var(--slate)" }}>
          The same script powers <Link href="/desk/prompter">the Prompter</Link> on the anchor
          desk. When you&apos;re done: <Link href="/">you&apos;re caught up</Link>.
        </p>
      </div>
    </>
  );
}
