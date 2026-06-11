import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { foundingWall } from "@/lib/records";

export const metadata: Metadata = { title: "The Founding 500", description: "The wall of the first believers — name, number, date. Capped, forever." };
export const dynamic = "force-dynamic";

export default async function FoundingPage() {
  const wall = await foundingWall();
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Founding 500 · {wall.length} of 500 seats taken</div>
        <h1>The first believers get a wall.</h1>
        <p className="lede">
          Five hundred founding seats, ever. Name, number, and date — carved here permanently,
          with the quarterly Q&amp;A, the direct tip line, the first seats in The Room, and a
          price locked for life. Real scarcity, real receipts: the live count above is the only
          counter; there is no fake urgency anywhere on this site.
        </p>
        {wall.length === 0 ? (
          <div className="card">
            <div className="card-kicker">The wall awaits its first name</div>
            <p>Founding seat № 1 is still open. When payments switch on, the first 500 names land here in order, forever.</p>
          </div>
        ) : (
          <table>
            <thead><tr><th>№</th><th>Name</th><th>Seated</th></tr></thead>
            <tbody>
              {wall.map((e) => (
                <tr key={e.number}>
                  <td className="mono">{String(e.number).padStart(3, "0")}</td>
                  <td>{e.name}</td>
                  <td className="mono">{new Date(e.at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p><Link className="btn btn--maroon" href="/subscribe">Take a founding seat — $200/yr</Link></p>
      </div>
    </>
  );
}
