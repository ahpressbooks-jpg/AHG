import type { ChangeEvent } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

/** Native-backed dropdown select. */
export function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <label style={{ display: 'block', fontFamily: 'var(--font-body)', width: '100%' }}>
      {label && (
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' as unknown as number, color: 'var(--text-primary)', marginBottom: 6 }}>
          {label}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '11px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-base)',
          fontFamily: 'var(--font-body)',
          border: '2px solid var(--border-default)',
          color: 'var(--text-primary)',
          background: 'var(--surface-card)',
          outline: 'none',
          appearance: 'none',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
