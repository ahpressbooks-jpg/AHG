import Link from "next/link";
import { COMPANY, HELP, LEGAL, PRODUCTS, TOPICS } from "@/lib/desks";

// The persistent site-wide footer — the full index, always reachable.
export default function BigFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bigfoot">
      <div className="wrap">
        <div className="bigfoot-cols">
          <div>
            <h4>Sections</h4>
            {TOPICS.slice(0, 8).map((t) => (
              <Link key={t.slug} href={`/topic/${t.slug}`}>{t.label}</Link>
            ))}
          </div>
          <div>
            <h4>Desks &amp; Products</h4>
            {PRODUCTS.slice(0, 8).map((p) => (
              <Link key={p.href + p.label} href={p.href}>{p.label}</Link>
            ))}
          </div>
          <div>
            <h4>More products</h4>
            {PRODUCTS.slice(8, 16).map((p) => (
              <Link key={p.href + p.label} href={p.href}>{p.label}</Link>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            {COMPANY.map((c) => (
              <Link key={c.href + c.label} href={c.href}>{c.label}</Link>
            ))}
          </div>
          <div>
            <h4>Help &amp; legal</h4>
            {HELP.map((h) => (
              <Link key={h.href + h.label} href={h.href}>{h.label}</Link>
            ))}
            {LEGAL.map((l) => (
              <Link key={l.href + l.label} href={l.href}>{l.label}</Link>
            ))}
          </div>
        </div>
        <div className="bigfoot-base">
          <span>© {year} The Second Row</span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/site-index">Site Index</Link>
          <span style={{ marginLeft: "auto" }}>One row back. Full view. · Founded at 21.</span>
        </div>
      </div>
    </footer>
  );
}
