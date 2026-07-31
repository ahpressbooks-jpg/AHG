import type { Metadata } from "next";
import Link from "next/link";
import GravityLab from "@/components/GravityLab";
import SiteHeader from "@/components/SiteHeader";
import { GRAVITY_WEIGHTS, METHOD_VERSION } from "@/lib/score";

export const metadata: Metadata = { title: "GRAVITY", description: "The algorithm, published: five signals, one score, tunable by you." };

export default function GravityPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The algorithm · {METHOD_VERSION}</div>
        <h1>GRAVITY: news that matters pulls harder.</h1>
        <p className="lede">
          Most feeds rank what gets clicked. We rank what carries weight — and we publish the
          math. Say it out loud: <em>&quot;Five measurable signals — how many independent
          newsrooms, how fast it&apos;s spreading, how many people it touches, whether power is
          being exercised, and how fresh it is — combine into one score. High gravity rises to
          the Board. Low gravity stays in the Lobby.&quot;</em>
        </p>

        <h2>The five signals</h2>
        <table>
          <thead><tr><th>Signal</th><th>Weight</th><th>Plain meaning</th></tr></thead>
          <tbody>
            <tr><td>Corroboration</td><td className="mono">{GRAVITY_WEIGHTS.corroboration}</td><td>Independent <em>owners</em> carrying it. Forty sites under one parent count once — coordinated echo can&apos;t buy a row.</td></tr>
            <tr><td>Velocity</td><td className="mono">{GRAVITY_WEIGHTS.velocity}</td><td>Acceleration of coverage in the last 45 minutes. Speed of spread, not volume.</td></tr>
            <tr><td>Consequence</td><td className="mono">{GRAVITY_WEIGHTS.consequence}</td><td>How many people it touches, how directly, for how long. Rubric: 9–10 war/national crisis · 6–8 major national policy · 3–5 regional · 0–2 minor.</td></tr>
            <tr><td>Power</td><td className="mono">{GRAVITY_WEIGHTS.power}</td><td>Is institutional power being exercised, abused, or checked? The civic filter — the reason a tax bill outranks a red carpet.</td></tr>
            <tr><td>Freshness</td><td className="mono">{GRAVITY_WEIGHTS.freshness}</td><td>Half-life decay from the last development. Ink cools.</td></tr>
          </tbody>
        </table>

        <h2>What the score decides</h2>
        <table>
          <tbody>
            <tr><td className="mono">85+</td><td><strong>FLASH</strong> — and only with 5+ independent owners and under two hours old. Machine-raised flashes say <em>machine-seated</em> until the desk confirms.</td></tr>
            <tr><td className="mono">70–84</td><td><strong>BULLETIN</strong> — the maroon row.</td></tr>
            <tr><td className="mono">55–69</td><td><strong>URGENT</strong></td></tr>
            <tr><td className="mono">40–54</td><td><strong>DEVELOPING</strong></td></tr>
            <tr><td className="mono">&lt;40</td><td><strong>THE LOBBY</strong> — it&apos;s news; it just isn&apos;t the front page. Honestly labeled, never hidden.</td></tr>
          </tbody>
        </table>
        <p>
          Promotions must hold across consecutive sweeps; demotions must fall clearly below the
          floor; at most six re-seats per sweep beyond new arrivals. The board moves like a
          newsroom, not a stock ticker.
        </p>

        <GravityLab />

        <h2>Changelog</h2>
        <table>
          <tbody>
            <tr><td className="mono">v2.0</td><td>GRAVITY: consequence + power join the signals; the Lobby split; weights published and reader-tunable.</td></tr>
            <tr><td className="mono">v1.0</td><td>First published method. Corroboration counts owners, not domains. Orange reserved for FLASH.</td></tr>
          </tbody>
        </table>
        <p className="mono">
          The desk owns the weights; changing them bumps this version, in public. See also{" "}
          <Link href="/tilt">the Tilt Meter</Link> and <Link href="/method">the board method</Link>.
        </p>
      </div>
    </>
  );
}
