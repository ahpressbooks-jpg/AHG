import { useState, type ChangeEvent } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}

/** Text input with label + error state. */
export function Input({ label, placeholder, value, onChange, type = 'text', error }: InputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'block', fontFamily: 'var(--font-body)', width: '100%' }}>
      {label && (
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' as unknown as number, color: 'var(--text-primary)', marginBottom: 6 }}>
          {label}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '11px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-base)',
          fontFamily: 'var(--font-body)',
          border: `2px solid ${error ? 'var(--state-danger)' : focus ? 'var(--color-brand-primary)' : 'var(--border-default)'}`,
          outline: 'none',
          color: 'var(--text-primary)',
          background: 'var(--surface-card)',
          boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'border-color var(--duration-base) var(--ease-standard)',
        }}
      />
      {error && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--state-danger)', marginTop: 4 }}>{error}</div>}
    </label>
  );
}
