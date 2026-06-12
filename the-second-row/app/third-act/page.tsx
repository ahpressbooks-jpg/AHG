import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { archiveIndex, getArchived } from "@/lib/records";
import { Story } from "@/lib/types";

export const metadata: Metadata = { title: "The Third Act", description: "News sites never tell you how the story ended. This one does." };
export const dynamic = "force-dynamic";

export default async function ThirdActPage() {
  const index = await archiveIndex(120);
  const stories = (await Promise.all(index.slice(0, 60).map((r) => getArchived(r.id)))).filter(Boolean) as Story[];
  const resolved = stories.filter((s) => s.resolution?.state === "RESOLVED");
  const faded = stories.filter((s) => s.resolution?.state === "FADED").slice(0, 25);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Third Act · the follow-up desk</div>
        <h1>How the story ended.</h1>
        <p className="lede">
          Every feed shows you Act One and walks away. Here, stories <em>close</em>: RESOLVED when
          reality settles them (with the outcome), FADED when the world moved on without an
          ending — said plainly, which is its own kind of honesty. Sealed takes open the moment a
          story resolves.
        </p>

        <h2>Resolved — with outcomes</h2>
        {resolved.length === 0 ? (
          <p className="mono">
            Nothing closed yet — the desk marks resolutions from the Control Room as reality
            settles them. The follow-up desk re-surfaces aging stories automatically below.
          </p>
        ) : (
          <table>
            <thead><tr><th>Closed</th><th>The story</th><th>The outcome</th></tr></thead>
            <tbody>
              {resolved.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{fmt(s.resolution!.at)}</td>
                  <td><Link href={`/wire/${s.id}`}>{s.headline}</Link></td>
                  <td>{s.resolution!.note || "Settled — full record in the dossier."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Faded — left without an ending</h2>
        {faded.length === 0 ? (
          <p className="mono">No fades on the recent record.</p>
        ) : (
          <table>
            <thead><tr><th>Faded</th><th>The story</th><th>Last stood at</th></tr></thead>
            <tbody>
              {faded.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{fmt(s.resolution?.at ?? s.lastDev)}</td>
                  <td><Link href={`/wire/${s.id}`}>{s.headline}</Link></td>
                  <td className="mono">{s.tier} · GRAVITY {s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="mono">
          The whole archive never 404s — every dossier above is a living page with its full
          biography, comments, and seals.
        </p>
      </div>
    </>
  );
}
