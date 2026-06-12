import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getPrimer, PRIMERS } from "@/lib/toolkit";

export function generateStaticParams() {
  return PRIMERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPrimer(slug);
  return { title: p ? `${p.title} · The Toolkit` : "The Toolkit", description: p?.tease };
}

export default async function PrimerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const primer = getPrimer(slug);

  if (!primer) {
    return (
      <>
        <SiteHeader current="/company" />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">The Toolkit</div>
          <h1>No such lesson.</h1>
          <p><Link href="/toolkit">Back to the Toolkit →</Link></p>
        </div>
      </>
    );
  }

  const idx = PRIMERS.findIndex((p) => p.slug === slug);
  const next = PRIMERS[(idx + 1) % PRIMERS.length];

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Toolkit · lesson {idx + 1} of {PRIMERS.length} · {primer.minutes} min · free forever</div>
        <h1>{primer.title}</h1>
        <p className="lede">{primer.tease}</p>

        {primer.sections.map((s, i) => (
          <div key={i}>
            <h2>{s.h}</h2>
            {s.body.map((para, k) => (
              <p key={k}>{para}</p>
            ))}
          </div>
        ))}

        <div className="card" style={{ margin: "26px 0", borderLeft: "3px solid var(--verdict)" }}>
          <div className="card-kicker" style={{ color: "var(--verdict)" }}>The drill — do it once today</div>
          <p style={{ fontSize: "1rem" }}>{primer.drill}</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <Link className="btn" href={`/toolkit/${next.slug}`}>Next lesson: {next.title} →</Link>
          <Link className="btn btn--ghost" href="/toolkit">All lessons</Link>
          <Link className="btn btn--maroon" href="/course">The full course (waitlist)</Link>
        </div>

        <p className="mono" style={{ marginTop: 26, color: "var(--slate)" }}>
          Share this lesson freely — the method only works if it spreads. Watch it in action on{" "}
          <Link href="/">the live Wire</Link>, where every rank shows this exact work.
        </p>
      </div>
    </>
  );
}
