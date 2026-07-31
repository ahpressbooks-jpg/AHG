import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { GLOSSARY } from "@/lib/glossary";

export const metadata: Metadata = { title: "The Glossary", description: "Civic jargon, one honest line each — the words the news uses without explaining." };

export default function GlossaryPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Glossary · the Lens for words</div>
        <h1>The words the news uses without explaining.</h1>
        <p className="lede">
          Every term below is auto-linked inside story dossiers — hover any underlined word on the
          site for the one-line version. Here&apos;s the whole set, plainly, in the desk&apos;s
          voice: no jargon defending jargon.
        </p>
        <dl style={{ margin: "20px 0" }}>
          {GLOSSARY.map((g) => (
            <div key={g.term} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
              <dt style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "1.1rem", textTransform: "capitalize" }}>{g.term}</dt>
              <dd style={{ margin: "4px 0 0", fontFamily: "var(--sans)", color: "var(--ink-1)" }}>{g.def}</dd>
            </div>
          ))}
        </dl>
        <p className="mono" style={{ color: "var(--slate)" }}>
          Want the habits behind these? The <Link href="/toolkit">Toolkit</Link> teaches the method.
        </p>
      </div>
    </>
  );
}
