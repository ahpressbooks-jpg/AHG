import { topicForBeats } from "./desks";

// GENERATIVE COVERS — a deterministic, on-brand SVG "picture" for any story,
// with zero image rights. Used as the fallback when a story has no feed image,
// so every headlining story always has art. The cover encodes the topic accent
// and the row-and-dots mark — it reads as a designed object, not a placeholder.

function hashHue(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % 360;
}

const INK = "#101319";
const PAPER = "#FCF8F0";

/** A branded SVG data-URI cover for a story. */
export function coverFor(opts: { id: string; tier?: string; beats?: string[] }): string {
  const accent = topicForBeats(opts.beats)?.accent ?? `hsl(${hashHue(opts.id)} 45% 32%)`;
  const flash = opts.tier === "FLASH";
  const base = flash ? "#FF5C02" : accent;
  // Receding bars = the mark, scaled up as cover art. Diagonal field for depth.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${INK}"/><stop offset="1" stop-color="${base}"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <g opacity="0.92">
    <rect x="250" y="150" width="300" height="26" rx="13" fill="${PAPER}" opacity="0.55"/>
    <circle cx="232" cy="210" r="9" fill="${PAPER}"/>
    <rect x="250" y="196" width="300" height="34" rx="17" fill="${PAPER}"/>
    <circle cx="568" cy="210" r="9" fill="${PAPER}"/>
    <rect x="280" y="256" width="240" height="22" rx="11" fill="${PAPER}" opacity="0.78"/>
    <rect x="310" y="296" width="180" height="18" rx="9" fill="${PAPER}" opacity="0.5"/>
  </g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
