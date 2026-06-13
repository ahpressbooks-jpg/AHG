import Link from "next/link";
import GlossaryLens from "@/components/GlossaryLens";
import SiteHeader from "@/components/SiteHeader";
import { getDoc } from "@/lib/extras";
import { SAMPLE_DOC } from "@/lib/sampleDoc";

export const dynamic = "force-dynamic";

const TAGS: Record<string, string> = { FACT: "tag tag--fact", POLICY: "tag", OPINION: "tag tag--opinion", QUESTION: "tag tag--pulse" };

export default async function DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = (await getDoc(slug)) ?? (slug === SAMPLE_DOC.slug ? SAMPLE_DOC : null);

  if (!doc) {
    return (
      <>
        <SiteHeader current="/company" />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">Document mode</div>
          <h1>No such document.</h1>
          <p>See the <Link href={`/document/${SAMPLE_DOC.slug}`}>annotated sample</Link>, or <Link href="/documents">all documents</Link>.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 1080 }}>
        <div className="page-kicker">Document mode · {doc.kind} · primary source, annotated</div>
        <h1>{doc.title}</h1>
        <p className="lede" style={{ maxWidth: "70ch" }}>{doc.summary}</p>
        {doc.sourceUrl && <p className="mono"><a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer">Read the full primary source ↗</a></p>}

        <div className="doc">
          {doc.blocks.map((b, i) => (
            <div className="doc-row" key={i}>
              <blockquote className="doc-quote"><GlossaryLens text={b.quote} /></blockquote>
              {b.note && (
                <div className="doc-note">
                  {b.tag && <span className={TAGS[b.tag] ?? "tag"} style={{ marginRight: 6 }}>{b.tag}</span>}
                  <GlossaryLens text={b.note} />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mono" style={{ marginTop: 22, color: "var(--slate)" }}>
          The law in one column, the desk&apos;s plain reading in the other — hover any underlined
          term for the <Link href="/glossary">Glossary</Link>. Primary sources as first-class
          pages, because the spin starts the moment a bill becomes a headline.
        </p>
      </div>
    </>
  );
}
