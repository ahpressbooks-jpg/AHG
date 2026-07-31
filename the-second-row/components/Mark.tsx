// The mark, rebuilt as geometry: rows receding, the second row held in
// maroon with its flanking dots. Inherits currentColor for the ink rows.
export default function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="1" />
      <rect x="33" y="30" width="34" height="6" rx="3" fill="#64778A" />
      <circle cx="26.5" cy="46" r="2.6" fill="#7E2230" />
      <rect x="32" y="41" width="36" height="10" rx="5" fill="#7E2230" />
      <circle cx="73.5" cy="46" r="2.6" fill="#7E2230" />
      <rect x="36" y="58" width="28" height="6" rx="3" fill="currentColor" />
      <rect x="39" y="70" width="22" height="5" rx="2.5" fill="currentColor" />
      <rect x="42" y="81" width="16" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}
