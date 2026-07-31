import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { COMPANY, HELP, LEGAL, PRODUCTS, TOPICS } from "@/lib/desks";

export const metadata: Metadata = { title: "Site Index", description: "Every section and page on The Second Row." };

export default function SiteIndexPage() {
  const Col = ({ title, links }: { title: string; links: { label: string; href: string; slug?: string }[] }) => (
    <div className="sx-col">
      <h3>{title}</h3>
      {links.map((l) => (
        <Link key={l.href + l.label} href={l.href}>{l.label}</Link>
      ))}
    </div>
  );
  return (
    <>
      <SiteHeader />
      <main className="wrap page">
        <div className="page-kicker">Site Index</div>
        <h1 style={{ fontSize: "clamp(1.9rem,5vw,3rem)" }}>Everything, in one place.</h1>
        <div className="sx-grid">
          <Col title="Sections" links={TOPICS.map((t) => ({ label: t.label, href: `/topic/${t.slug}` }))} />
          <Col title="Desks & products" links={PRODUCTS} />
          <Col title="Company" links={COMPANY} />
          <Col title="Help & more" links={HELP} />
          <Col title="Legal & method" links={LEGAL} />
          <Col title="Editions" links={[{ label: "Today's briefing", href: "/today" }, { label: "The Morning Edition", href: "/today" }, { label: "The Rewind", href: "/rewind" }, { label: "RSS feeds", href: "/rss" }]} />
        </div>
      </main>
    </>
  );
}
