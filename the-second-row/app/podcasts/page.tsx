import type { Metadata } from "next";
import Link from "next/link";
import BoardRead from "@/components/BoardRead";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Podcasts & Audio", description: "Listen to the board." };

export default function PodcastsPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap wrap--reading page">
        <div className="page-kicker">Podcasts &amp; Audio</div>
        <h1>Listen to the board.</h1>
        <p className="lede">
          A 90-second civic briefing, read aloud right in your browser — no app, no download. The day&apos;s
          top stories and the desk&apos;s note, the same script that runs the anchor desk&apos;s prompter.
        </p>
        <BoardRead />
        <h2>Coming to the feed</h2>
        <p>
          A daily audio edition and an RSS audio feed are on the roadmap — until then, the live read above is
          always current. <Link href="/rss">Feeds →</Link>
        </p>
      </main>
    </>
  );
}
