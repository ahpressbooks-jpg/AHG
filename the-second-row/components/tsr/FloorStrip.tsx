import Link from "next/link";
import { isImminent, loadFloor, seatFloor, stakesScore } from "@/lib/floor";
import ScoreChip from "./ScoreChip";
import TierChip from "./TierChip";

// THE FLOOR STRIP — a single navy band on the Wire-led homepage showing the top
// three items on the Floor by STAKES, so the news half hands readers across the
// aisle to the law being written.
export default async function FloorStrip() {
  const items = seatFloor(await loadFloor()).slice(0, 3);
  if (!items.length) return null;
  const nowMs = Date.now();
  return (
    <section aria-label="The Floor — the other half" className="my-9 rounded-[10px] bg-ink px-5 py-6 text-cream sm:px-7">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="mono-label text-[0.58rem] text-oxblood">The other half</span>
        <span className="font-display text-lg font-bold text-cream">The Floor</span>
        <Link href="/floor" className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cream-70 hover:text-cream">
          The law being written →
        </Link>
      </div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <Link href={`/floor/${it.id}`} className="flex items-center gap-3 border-t border-hairline py-3">
              <TierChip tier={it.tier} imminent={isImminent(it, nowMs)} />
              <span className="min-w-0 flex-1 truncate font-body text-[0.95rem] text-cream-70">{it.plain_title}</span>
              <span className="shrink-0"><ScoreChip score={stakesScore(it.stakes)} label="STAKES" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
