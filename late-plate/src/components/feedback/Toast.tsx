import type { CSSProperties } from 'react';

export type ToastTone = 'success' | 'info' | 'danger';

export interface ToastProps {
  message: string;
  tone?: ToastTone;
  visible?: boolean;
}

const tones: Record<ToastTone, CSSProperties> = {
  success: { background: 'var(--color-brand-secondary)', color: '#fff' },
  info: { background: 'var(--surface-inverse)', color: 'var(--lp-cream-100)' },
  danger: { background: 'var(--state-danger)', color: '#fff' },
};

/** Transient bottom/top notification. */
export function Toast({ message, tone = 'success', visible = true }: ToastProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)' as unknown as number,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all var(--duration-slow) var(--ease-out)',
        ...tones[tone],
      }}
    >
      {message}
    </div>
  );
}
