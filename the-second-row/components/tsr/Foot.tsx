import Link from "next/link";
import { AISLE_FOOTER_LINE } from "@/lib/aisle";
import { COMPANY_NAV, FLOOR_NAV, WIRE_NAV } from "@/lib/tsrnav";
import Seal from "./Seal";

// The redesigned footer — mirrors the two-half structure, carries the standing
// line and one sentence of the Aisle statement with a link to /aisle.
export default function Foot() {
  const year = 2026;
  const col = (title: string, links: { label: string; href: string }[]) => (
    <div>
      <h2 className="mono-label mb-3 text-[0.58rem] text-cream-55">{title}</h2>
      <ul className="flex flex-col gap-1.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="font-body text-[0.9rem] text-cream-70 hover:text-cream">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="border-t border-hairline bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {col("The Wire", WIRE_NAV)}
          {col("The Floor", FLOOR_NAV)}
          {col("Company", COMPANY_NAV)}
        </div>
        <div className="mt-10 border-t border-hairline pt-6">
          <div className="flex items-center gap-2 text-cream">
            <Seal size={22} />
            <span className="font-display text-sm font-bold tracking-[0.02em]">THE SECOND ROW</span>
          </div>
          <p className="mt-3 max-w-[70ch] font-body text-[0.9rem] text-cream-70">
            {AISLE_FOOTER_LINE} <Link href="/aisle" className="text-oxblood hover:underline">Read the Aisle →</Link>
          </p>
          <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream-55">
            © {year} The Second Row · One row back. Full view.
          </p>
        </div>
      </div>
    </footer>
  );
}
