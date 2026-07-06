export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

/** Binary toggle switch (olive when on). */
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
      <span
        onClick={() => onChange?.(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--color-brand-secondary)' : 'var(--lp-ink-300)',
          position: 'relative',
          transition: 'background var(--duration-base) var(--ease-standard)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left var(--duration-base) var(--ease-standard)',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
      </span>
      {label && <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
