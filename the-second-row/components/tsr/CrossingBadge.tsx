import Link from "next/link";

// CROSSING BADGE — disclosure, never ranking. When a seated Wire story touches a
// fight the Floor has taken a side on, it carries this badge linking to /aisle
// (and the specific fight). Shares NO code path with the scoring module; it can
// only reveal an overlap, never influence a seat. Works on light or dark via the
// global oxblood token.
export default function CrossingBadge({ href = "/aisle", label }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      title={label || "This story touches a fight on the Floor — see the Aisle"}
      className="inline-flex items-center gap-1 rounded-sm border border-oxblood px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-oxblood no-underline"
    >
      ⇄ Crossing
    </Link>
  );
}
