// SCORE CHIP — a mono number in a bordered chip. One component for both
// GRAVITY (the Wire) and STAKES (the Floor). The label names which instrument.
export default function ScoreChip({
  score,
  label = "GRAVITY",
}: {
  score: number;
  label?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border border-hairline-strong px-2 py-0.5"
      aria-label={`${label} score ${score} of 100`}
    >
      <span aria-hidden="true" className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-cream-55">
        {label}
      </span>
      <span aria-hidden="true" className="font-mono font-medium tabular-nums text-cream">
        {score}
      </span>
    </span>
  );
}
