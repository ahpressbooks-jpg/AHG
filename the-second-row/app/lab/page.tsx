import type { Metadata } from "next";
import EpistemicTag from "@/components/tsr/EpistemicTag";
import ScoreChip from "@/components/tsr/ScoreChip";
import Seal from "@/components/tsr/Seal";
import SweepClock from "@/components/tsr/SweepClock";
import TierChip from "@/components/tsr/TierChip";

export const metadata: Metadata = { title: "Design Lab — The Second Row", robots: { index: false } };

// Internal verification surface for the redesign design system — NOT linked in
// nav. Renders the locked tokens, fonts, Seal, and the shared components on the
// Ink Navy canvas so the foundation can be reviewed in isolation before the
// shell + Wire are migrated onto it.
function Swatch({ name, hex, cls }: { name: string; hex: string; cls: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-10 w-10 rounded border border-hairline-strong ${cls}`} />
      <span className="font-mono text-[0.7rem] text-cream-70">
        <span className="text-cream">{name}</span> {hex}
      </span>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-6">
      <h2 className="mono-label mb-4 text-[0.62rem] text-cream-55">{label}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function LabPage() {
  return (
    <div className="min-h-screen bg-ink font-body text-cream">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <header className="mb-10 flex items-center gap-3">
          <span className="text-cream">
            <Seal size={34} title="The Second Row seal" />
          </span>
          <div>
            <div className="font-display text-xl font-bold tracking-tight text-cream">THE SECOND ROW</div>
            <div className="mono-label text-[0.55rem] text-cream-55">Design system · redesign foundation</div>
          </div>
          <span className="ml-auto">
            <SweepClock intervalSec={60} label="WIRE SWEEP" />
          </span>
        </header>

        <div className="flex flex-col gap-9">
          <Group label="The four locked colors (no fifth hue, ever)">
            <Swatch name="Ink Navy" hex="#10161F" cls="bg-ink" />
            <Swatch name="Parchment Cream" hex="#F4EBD9" cls="bg-cream" />
            <Swatch name="Oxblood" hex="#7A1A2C" cls="bg-oxblood" />
            <Swatch name="Orange · FLASH/72h only" hex="#E2581F" cls="bg-flash" />
          </Group>

          <Group label="Type — Lora display / IBM Plex Serif body / IBM Plex Mono labels">
            <div className="w-full space-y-3">
              <p className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] font-bold leading-[1.1]">
                The law being written, ranked by what it does to you.
              </p>
              <p className="font-display text-lg italic text-cream-70">
                “One row back. Full view.” — the standing line, Lora medium italic.
              </p>
              <p className="max-w-[62ch] font-body text-[1.0625rem] leading-relaxed text-cream-70">
                Body copy is IBM Plex Serif at a comfortable measure. The whole surface is a broadsheet
                instrument panel: dense, quiet, confident, zero decoration that does not carry information.
              </p>
              <p className="mono-label text-[0.62rem] text-cream-55">MONO LABELS · SCORES · TIERS · TIMESTAMPS · EYEBROWS</p>
            </div>
          </Group>

          <Group label="Score chips — GRAVITY (Wire) & STAKES (Floor), one component">
            <ScoreChip score={87} label="GRAVITY" />
            <ScoreChip score={62} label="STAKES" />
            <ScoreChip score={9} label="STAKES" />
          </Group>

          <Group label="Wire tiers — orange is FLASH and nothing else">
            <TierChip tier="FLASH" />
            <TierChip tier="URGENT" />
            <TierChip tier="DEVELOPING" />
            <TierChip tier="LOBBY" />
          </Group>

          <Group label="Floor tiers — orange marks <72h imminence, on any tier">
            <TierChip tier="FILED" />
            <TierChip tier="IN COMMITTEE" />
            <TierChip tier="ON THE FLOOR" imminent />
            <TierChip tier="COMMENT OPEN" imminent />
            <TierChip tier="PASSED" />
            <TierChip tier="DIED" />
            <TierChip tier="SHELVED" />
          </Group>

          <Group label="Epistemic tags — confidence & speech-act, tinted grounds">
            <EpistemicTag kind="certain" />
            <EpistemicTag kind="likely" />
            <EpistemicTag kind="guessing" />
            <EpistemicTag kind="fact" />
            <EpistemicTag kind="opinion" />
            <EpistemicTag kind="question" />
            <EpistemicTag kind="policy" />
            <EpistemicTag kind="thinking" />
          </Group>

          <Group label="Sweep clocks — Wire (60s) and Floor (4h)">
            <SweepClock intervalSec={60} label="THE WIRE" />
            <span className="mx-3 text-hairline-strong">|</span>
            <SweepClock intervalSec={14400} label="THE FLOOR" />
          </Group>
        </div>
      </div>
    </div>
  );
}
