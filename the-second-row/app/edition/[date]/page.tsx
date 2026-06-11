import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getEdition } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function EditionPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const edition = /^\d{4}-\d{2}-\d{2}$/.test(date) ? await getEdition(date) : null;

  if (!edition) {
    return (
      <>
        <SiteHeader current="/today" />
        <div className="wrap wrap--reading page">
          <div className="page-kicker">The Morning Edition</div>
          <h1>No edition for that date.</h1>
          <p>Editions freeze at 7 a.m. desk time, daily, from the day the engine first ran. <Link href="/today">Today&apos;s briefing →</Link></p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader current="/today" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Morning Edition · № {edition.number} · frozen {new Date(edition.frozenAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <h1 style={{ borderBottom: "2px solid var(--ink)", paddingBottom: 14 }}>
          {new Date(edition.date + "T12:00:00").toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </h1>
        {edition.note && (
          <div className="card" style={{ margin: "16px 0" }}>
            <div className="card-kicker">From the desk that morning</div>
            <p style={{ whiteSpace: "pre-wrap" }}>{edition.note}</p>
          </div>
        )}
        {edition.stories.map((s, i) => (
          <div key={s.id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
            <div className="row-meta" style={{ marginBottom: 4 }}>
              <span className={`chip chip--${s.tier}`} style={{ cursor: "default" }}><span className="chip-bar" />{s.tier}</span>
              <span className="mono" style={{ color: "var(--pulse)" }}>{s.score}</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: i === 0 ? "1.5rem" : "1.1rem" }}>
              <Link href={`/wire/${s.id}`} style={{ textDecoration: "none" }}>{s.headline}</Link>
            </h2>
          </div>
        ))}
        <p className="mono" style={{ marginTop: 20 }}>
          A finite, numbered, permanent front page. This URL never changes and never disappears.
          A day of news you can actually finish.
        </p>
        <p><Link href="/today">← Today</Link></p>
      </div>
    </>
  );
}
