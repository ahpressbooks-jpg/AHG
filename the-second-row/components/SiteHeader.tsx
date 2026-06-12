import Link from "next/link";
import { getHouseLights } from "@/lib/ops";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "The Wire" },
  { href: "/today", label: "Today" },
  { href: "/spin", label: "Spin Room" },
  { href: "/ledger", label: "Ledger" },
  { href: "/column", label: "Column" },
  { href: "/company", label: "Company" },
  { href: "/you", label: "Your Seat" },
];

export default async function SiteHeader({ current }: { current?: string }) {
  const lights = await getHouseLights().catch(() => false);
  return (
    <header className="masthead">
      {lights && (
        <div
          className="mono"
          style={{
            background: "var(--verdict)",
            color: "#fff",
            fontFamily: "var(--mono)",
            fontSize: "0.64rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textAlign: "center",
            padding: "5px 10px",
          }}
        >
          House lights up — major civic emergency: the entire archive is open, free, for everyone.
        </div>
      )}
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
