import type { Metadata } from "next";
import Link from "next/link";
import Foot from "@/components/tsr/Foot";
import Shell from "@/components/tsr/Shell";

export const metadata: Metadata = {
  title: "The Docket — The Second Row",
  description: "The published map of advocacy areas: the locked planks that do not move by vote, the open docket, and what is not yet armored.",
};

const LOCKED = [
  "Life", "Free speech", "Economy & anti-monopoly", "Welfare that builds an agent",
  "Education", "Race & agency", "Power & federalism",
];
const OPEN = [
  "Foster care", "Occupational licensing", "Civil asset forfeiture", "Term limits",
  "Campaign finance", "Spending transparency", "Tech / AI & data privacy", "Housing & zoning",
  "Criminal justice", "Election administration", "Debt & entitlements", "Civic education",
  "Veterans", "Family policy", "Judicial reform", "Second Amendment", "Drug policy",
];
const NOT_YET = ["Immigration", "Policing", "Foreign policy"];

function Chips({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((a) => (
        <span
          key={a}
          className={`rounded-full border px-3 py-1.5 font-body text-[0.9rem] ${
            muted ? "border-hairline text-cream-55" : "border-hairline-strong text-cream-70"
          }`}
        >
          {a}
        </span>
      ))}
    </div>
  );
}

export default function DocketPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <Shell active="floor" />
      <main className="mx-auto max-w-4xl px-5 pb-10">
        <section className="border-b border-hairline py-10">
          <p className="mono-label text-[0.62rem] text-oxblood">The advocacy map</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] font-bold leading-[1.05]">The Docket</h1>
          <p className="mt-4 max-w-[64ch] font-body text-[1.05rem] leading-relaxed text-cream-70">
            What the Floor fights for, and how firmly. Three tiers, published in the open — because a spine you can read
            is the only kind you can hold us to.
          </p>
        </section>

        <section className="border-b border-hairline py-9">
          <h2 className="mono-label text-[0.66rem] text-cream">The locked planks</h2>
          <p className="mt-2 max-w-[62ch] font-body text-[0.95rem] text-cream-70">
            The spine. These do not move by vote — a Floor Vote can set priority within them, never against them.
          </p>
          <Chips items={LOCKED} />
        </section>

        <section className="border-b border-hairline py-9">
          <h2 className="mono-label text-[0.66rem] text-cream">The open docket</h2>
          <p className="mt-2 max-w-[62ch] font-body text-[0.95rem] text-cream-70">
            Live ground where the desk fights, and where members set the order of battle. Each area collects its live
            bills, drafts, and fights.
          </p>
          <Chips items={OPEN} />
        </section>

        <section className="py-9">
          <h2 className="mono-label text-[0.66rem] text-cream-55">Not yet armored</h2>
          <p className="mt-2 max-w-[62ch] font-body text-[0.95rem] text-cream-70">
            The Floor does not fight from a plank it has not stress-tested. These are named honestly as out of scope for
            now, rather than fought half-ready.
          </p>
          <Chips items={NOT_YET} muted />
        </section>

        <div className="rounded border border-hairline bg-[color-mix(in_oklab,var(--color-cream)_3%,transparent)] p-5">
          <p className="font-body text-[0.95rem] text-cream-70">
            Area pages — collecting each area&rsquo;s live bills, drafts, and fights — open as the fights do. Watch them
            form on <Link href="/floor" className="text-oxblood hover:underline">the Floor</Link>, propose one in{" "}
            <Link href="/well" className="text-oxblood hover:underline">the Well</Link>, or set priorities at{" "}
            <Link href="/floor-votes" className="text-oxblood hover:underline">Floor Votes</Link>.
          </p>
        </div>
      </main>
      <Foot />
    </div>
  );
}
