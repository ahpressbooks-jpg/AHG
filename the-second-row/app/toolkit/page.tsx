import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "The Toolkit", description: "Free one-page primers on thinking clearly about the news." };

const PRIMERS = [
  { t: "How to read a poll", p: "Margin of error is per-candidate, the sample matters more than the size, and 'likely voters' is a model, not a fact. Three checks before a poll moves you an inch." },
  { t: "Spotting a frame", p: "Same fact, two headlines: 'spending bill passes' vs 'blank check rolls on.' The verb, the actor, and what got left out — the frame is the story about the story." },
  { t: "Confidence vs. certainty", p: "Strong opinions are fine; unlabeled ones aren't. The discipline of saying 'certain / likely / guessing' out loud — and why it changes what you notice." },
  { t: "One source is a rumor", p: "Why corroboration counts owners, not websites. Forty sites quoting one report is one report. How to count independent confirmation in 30 seconds." },
  { t: "The steelman", p: "Restate the other side so well they'd sign it — then answer. The single habit that upgrades every argument you'll ever have." },
  { t: "Velocity isn't importance", p: "Fast-moving isn't the same as heavy. How to tell a story that's spreading from a story that matters — and why your feed confuses the two on purpose." },
];

export default function ToolkitPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The Toolkit · free, forever</div>
        <h1>The method, one page at a time.</h1>
        <p className="lede" style={{ maxWidth: "66ch" }}>
          Schools teach what to think and call it civics. These teach <em>how</em> — the working
          habits behind every rank, tag, and verdict on this site. Free because they&apos;re the
          on-ramp; the full course goes deeper.
        </p>
        <div className="cards cards--3">
          {PRIMERS.map((x) => (
            <div className="card" key={x.t}>
              <div className="card-kicker">Primer</div>
              <h3>{x.t}</h3>
              <p>{x.p}</p>
              <div className="card-foot">5-minute read · printable · share freely</div>
            </div>
          ))}
        </div>
        <div className="rope">
          <div className="rope-kicker">Going deeper</div>
          <p>The full method — recorded, structured, yours for good — is <strong>Think for Yourself</strong>, the course. It opens when the desk has earned the right to teach it.</p>
          <Link className="btn btn--maroon" href="/course">Join the course waitlist</Link>
        </div>
      </div>
    </>
  );
}
