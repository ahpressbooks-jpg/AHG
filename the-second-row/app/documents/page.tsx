import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { allDocs } from "@/lib/extras";
import { SAMPLE_DOC } from "@/lib/sampleDoc";

export const metadata: Metadata = { title: "Documents", description: "Bills, rulings, and orders — the primary text with the desk's margin notes." };
export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const real = await allDocs();
  const docs = real.length ? real : [SAMPLE_DOC];
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">Document mode · primary sources</div>
        <h1>Read the law, not the headline about the law.</h1>
        <p className="lede" style={{ maxWidth: "66ch" }}>
          Bills, rulings, and orders rendered the honest way: the actual text, with the desk&apos;s
          plain-language notes in the margin and every term glossed. The spin starts when a
          document becomes a story — this is the page before that happens.
        </p>
        {real.length === 0 && <p className="mono" style={{ color: "var(--slate)" }}>Showing the annotated sample — the desk&apos;s real documents appear here once authored.</p>}
        <div className="cards">
          {docs.map((d) => (
            <Link className="card" key={d.slug} href={`/document/${d.slug}`} style={{ textDecoration: "none" }}>
              <div className="card-kicker">{d.kind}</div>
              <h3 style={{ color: "var(--ink)" }}>{d.title}</h3>
              <p>{d.summary}</p>
              <div className="card-foot" style={{ color: "var(--pulse)" }}>Open the annotated text →</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
