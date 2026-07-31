import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { allPosts } from "@/lib/records";

export const metadata: Metadata = { title: "From the Second Row", description: "The founder's column — every claim wearing its tag." };
export const dynamic = "force-dynamic";

export default async function ColumnPage() {
  const posts = await allPosts();
  const columns = posts.filter((p) => p.kind !== "steelman");
  const steelmans = posts.filter((p) => p.kind === "steelman");

  return (
    <>
      <SiteHeader current="/column" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">From the Second Row</div>
        <h1>The desk&apos;s own words, tagged like everything else.</h1>
        <p className="lede">
          Written at 21, from one row back: no legacy to defend, no access to protect. Every claim
          carries its tag — <span className="tag tag--fact">FACT</span> <span className="tag">POLICY</span>{" "}
          <span className="tag tag--opinion">OPINION</span> <span className="tag">QUESTION</span>{" "}
          <span className="tag">THINKING OUT LOUD</span> — so you always know whether you&apos;re
          being told something or asked something. Comments open under every piece.
        </p>

        {posts.length === 0 && (
          <div className="card" style={{ margin: "20px 0" }}>
            <div className="card-kicker">The first column is being written</div>
            <p>
              Pieces publish from the Control Room and appear here the moment they&apos;re signed.
              Saturday belongs to the steelman: both sides of one argument, at their strongest,
              before the desk says where it lands.
            </p>
          </div>
        )}

        {columns.map((p) => (
          <div key={p.slug} style={{ borderBottom: "1px solid var(--line)", padding: "18px 0" }}>
            <div className="page-kicker" style={{ marginBottom: 4 }}>
              {p.kind === "note" ? "Desk note" : "Column"} ·{" "}
              {new Date(p.publishedAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <h2 style={{ margin: "0 0 6px" }}>
              <Link href={`/column/${p.slug}`} style={{ textDecoration: "none" }}>{p.title}</Link>
            </h2>
            {p.dek && <p style={{ margin: 0 }}>{p.dek}</p>}
          </div>
        ))}

        {steelmans.length > 0 && (
          <>
            <h2>Steelman Saturday</h2>
            {steelmans.map((p) => (
              <div key={p.slug} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0" }}>
                <h3 style={{ margin: "0 0 4px" }}>
                  <Link href={`/column/${p.slug}`} style={{ textDecoration: "none" }}>{p.title}</Link>
                </h3>
                {p.dek && <p style={{ margin: 0, fontSize: "0.9rem" }}>{p.dek}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
