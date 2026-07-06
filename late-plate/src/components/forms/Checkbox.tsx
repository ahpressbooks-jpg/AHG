export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

/** Checkbox with custom square indicator. */
export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
      <span
        onClick={() => onChange?.(!checked)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          border: `2px solid ${checked ? 'var(--color-brand-primary)' : 'var(--border-default)'}`,
          background: checked ? 'var(--color-brand-primary)' : 'var(--surface-card)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--duration-fast) var(--ease-standard)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {checked ? '✓' : ''}
      </span>
      {label && <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
