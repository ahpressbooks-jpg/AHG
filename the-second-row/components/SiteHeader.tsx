import Link from "next/link";
import { getHouseLights } from "@/lib/ops";
import Mark from "./Mark";
import NavMenus from "./NavMenus";
import ThemeToggle from "./ThemeToggle";

export default async function SiteHeader({ current }: { current?: string }) {
  const lights = await getHouseLights().catch(() => false);
  return (
    <header className="masthead">
      {lights && (
        <div
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
        <span className="nav-spacer" />
        <ThemeToggle />
      </div>
      <NavMenus current={current} />
    </header>
  );
}
