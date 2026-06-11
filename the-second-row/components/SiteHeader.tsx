import Link from "next/link";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "The Wire" },
  { href: "/briefing", label: "Briefing" },
  { href: "/spin", label: "Spin Room" },
  { href: "/ledger", label: "Ledger" },
  { href: "/about", label: "The Seat" },
];

export default function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
        <Link href="/" className="masthead-brand" aria-label="The Second Row — home">
          <Mark size={30} />
          <span className="masthead-name">THE SECOND ROW</span>
        </Link>
        <span className="masthead-tag">One row back · Full view</span>
        <nav className="masthead-nav" aria-label="Sections">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
