import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Embed the Board", description: "Drop the live, GRAVITY-ranked board into any site or newsletter." };

const SNIPPET = `<iframe src="https://YOURDOMAIN/api/embed?n=5"
  width="100%" height="380" frameborder="0"
  title="The Second Row — live board"
  style="border:1px solid #ddd;border-radius:10px;max-width:420px"></iframe>`;

export default function WidgetPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap page" style={{ maxWidth: 980 }}>
        <div className="page-kicker">Embed the Board</div>
        <h1>Put the live wire on your site.</h1>
        <p className="lede" style={{ maxWidth: "66ch" }}>
          A self-contained, always-current mini-board for any blog, classroom page, or newsletter
          landing. It re-checks every 60 seconds, links each story to its dossier, and carries the
          brand and the GRAVITY credit with it — distribution that spreads the standard.
        </p>

        <h2>Live preview</h2>
        <iframe src="/api/embed?n=5" width="100%" height={380} frameBorder={0} title="The Second Row — live board preview" style={{ border: "1px solid var(--line-strong)", borderRadius: 10, maxWidth: 420 }} />

        <h2>The code</h2>
        <pre style={{ background: "var(--bg-well)", border: "1px solid var(--line)", borderRadius: 8, padding: "14px 16px", overflowX: "auto", fontFamily: "var(--mono)", fontSize: "0.78rem" }}>{SNIPPET}</pre>
        <p className="mono" style={{ color: "var(--slate)" }}>
          Swap <strong>YOURDOMAIN</strong> for your live address · <code>?n=3</code> to <code>?n=8</code> sets how many stories show.
        </p>

        <p style={{ marginTop: 20 }}>
          <Link className="btn btn--ghost" href="/company">← The Company</Link>
        </p>
      </div>
    </>
  );
}
