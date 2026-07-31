// THE SEAL — the mark: five horizontal bars, the second bar oxblood. Inherits
// currentColor for the other four so it works on any surface. Used in the
// header, favicons, OG images, and loading states (redesign brief).
export default function Seal({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect x="3" y="3.5" width="18" height="2.1" rx="1.05" fill="currentColor" />
      <rect x="3" y="7.6" width="18" height="2.1" rx="1.05" fill="var(--color-oxblood)" />
      <rect x="3" y="11.7" width="18" height="2.1" rx="1.05" fill="currentColor" />
      <rect x="3" y="15.8" width="18" height="2.1" rx="1.05" fill="currentColor" />
      <rect x="3" y="19.9" width="18" height="2.1" rx="1.05" fill="currentColor" />
    </svg>
  );
}
