import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getEdition, getNote, editionDates } from "@/lib/records";
import { loadBoard } from "@/lib/store";

export const metadata: Metadata = { title: "Today", description: "The daily briefing: the board at 7 a.m., the founder's note, every claim wearing its tag." };
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [board, note, dates] = await Promise.all([loadBoard(), getNote(), editionDates(8)]);
  const today = dates[0] ? await getEdition(dates[0]) : null;
  const top = board?.stories.filter((s) => s.tier !== "BRIEF").slice(0, 8) ?? [];

  return (
    <>
      <SiteHeader current="/today" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">Today · The Briefing</div>
        <h1>The day, with its tags on.</h1>

        {note?.text ? (
          <div className="card" style={{ margin: "16px 0" }}>
            <div className="card-kicker">From the desk · signed</div>
            <p className="lede" style={{ whiteSpace: "pre-wrap" }}>{note.text}</p>
            <div className="card-foot">— the founder, {new Date(note.at).toLocaleDateString([], { month: "long", day: "numeric" })}</div>
          </div>
        ) : (
          <div className="card" style={{ margin: "16px 0" }}>
            <div className="card-kicker">From the desk</div>
            <p>The founder&apos;s signed note lands here each morning — written from the Control Room, in the open, tagged like everything else: <span className="tag tag--fact">FACT</span> <span className="tag">POLICY</span> <span className="tag tag--opinion">OPINION</span> <span className="tag">QUESTION</span>.</p>
          </div>
        )}

        {today && (
          <div className="card" style={{ margin: "16px 0" }}>
            <div className="card-kicker">The Morning Edition · № {today.number}</div>
            <p>The board as it stood at 7 a.m., frozen, numbered, permanent. <Link href={`/edition/${today.date}`}>Read edition {today.date} →</Link></p>
          </div>
        )}

        <h2>The board right now</h2>
        {top.length === 0 && <p>The house is filling — the Wire has the live view.</p>}
        {top.map((s) => (
          <div key={s.id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
            <div className="row-meta" style={{ marginBottom: 4 }}>
              <span className={`chip chip--${s.tier}`} style={{ cursor: "default" }}><span className="chip-bar" />{s.tier}</span>
              <span className="gravity-meter"><span className="g-num">{s.score}</span></span>
              <span className={`certainty certainty--${s.certainty}`}>{s.certainty}</span>
            </div>
            <h3 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "1.15rem" }}>
              <Link href={`/wire/${s.id}`} style={{ textDecoration: "none" }}>{s.headline}</Link>
            </h3>
            {s.excerpt && <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>{s.excerpt}</p>}
          </div>
        ))}

        {dates.length > 1 && (
          <>
            <h2>Past editions</h2>
            <p className="mono">
              {dates.map((d) => (
                <Link key={d} href={`/edition/${d}`} style={{ marginRight: 14 }}>№ {d}</Link>
              ))}
            </p>
          </>
        )}

        <p style={{ marginTop: 26 }}>
          <Link href="/" className="btn btn--ghost">← The live Wire</Link>
        </p>
      </div>
    </>
  );
}
