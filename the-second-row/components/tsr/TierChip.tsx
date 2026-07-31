// TIER CHIP — the ONE place the orange rule lives, so it can never be applied
// inconsistently. Orange (#E2581F) renders for EXACTLY two conditions and no
// others: the Wire's FLASH tier, and a Floor item whose floor vote or comment
// window is inside 72 hours (imminent). If orange shows anywhere else, it is a
// bug — and it cannot come from this component unless one of those is true.

export type WireTier = "FLASH" | "URGENT" | "DEVELOPING" | "LOBBY";
export type FloorTier =
  | "FILED" | "IN COMMITTEE" | "ON THE FLOOR" | "COMMENT OPEN" | "PASSED" | "DIED" | "SHELVED";

// Outcome / below-the-fold tiers render muted; they are content, not garbage.
const MUTED = new Set(["PASSED", "DIED", "SHELVED", "LOBBY"]);

export default function TierChip({
  tier,
  imminent = false,
}: {
  tier: WireTier | FloorTier;
  imminent?: boolean;
}) {
  const isOrange = tier === "FLASH" || imminent; // the whole rule, in one expression
  const tone = isOrange
    ? "text-flash border-flash"
    : MUTED.has(tier)
      ? "text-cream-55 border-hairline-strong"
      : "text-cream border-hairline-strong";
  const aria = imminent && tier !== "FLASH" ? `${tier.toLowerCase()}, imminent` : tier.toLowerCase();
  return (
    <span
      className={`mono-label inline-flex items-center rounded-sm border px-1.5 py-1 text-[0.6rem] leading-none ${tone}`}
      aria-label={aria}
    >
      {tier}
      {imminent && tier !== "FLASH" && <span aria-hidden="true" className="ml-1 text-flash">·72H</span>}
    </span>
  );
}
