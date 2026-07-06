export interface StatChipProps {
  value: string | number;
  label: string;
}

/** Recipe-card stat unit (serves / prep / cook / total) — the cookbook's signature info pattern. */
export function StatChip({ value, label }: StatChipProps) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center',
        minWidth: 76,
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' as unknown as number, color: 'var(--lp-orange-600)' }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export interface StatChipRowProps {
  stats: { value: string | number; label: string }[];
}

export function StatChipRow({ stats }: StatChipRowProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      {stats.map((s, i) => (
        <StatChip key={i} value={s.value} label={s.label} />
      ))}
    </div>
  );
}
