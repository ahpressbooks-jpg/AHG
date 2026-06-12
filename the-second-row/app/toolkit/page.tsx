import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { PRIMERS } from "@/lib/toolkit";

export const metadata: Metadata = { title: "The Toolkit", description: "Free one-page lessons on thinking clearly about the news." };

export default function ToolkitPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">The Toolkit · free, forever</div>
        <h1>The method, one page at a time.</h1>
        <p className="lede" style={{ maxWidth: "66ch" }}>
          Schools teach what to think and call it civics. These teach <em>how</em> — the working
          habits behind every rank, tag, and verdict on this site. Tap any card; each one is a
          full lesson with a drill at the end. Free because they&apos;re the on-ramp; the course
          goes deeper.
        </p>
        <div className="cards cards--3">
          {PRIMERS.map((x) => (
            <Link className="card" key={x.slug} href={`/toolkit/${x.slug}`} style={{ textDecoration: "none" }}>
              <div className="card-kicker">Primer · {x.minutes} min</div>
              <h3 style={{ color: "var(--ink)" }}>{x.title}</h3>
              <p>{x.tease}</p>
              <div className="card-foot" style={{ color: "var(--pulse)" }}>Open the lesson →</div>
            </Link>
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
