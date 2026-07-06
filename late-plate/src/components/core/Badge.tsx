import type { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  tone?: 'orange' | 'olive' | 'danger';
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  orange: 'var(--color-brand-primary)',
  olive: 'var(--color-brand-secondary)',
  danger: 'var(--state-danger)',
};

/** Small numeric/status dot — cart count, notification count. */
export function Badge({ children, tone = 'orange' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 'var(--radius-pill)',
        background: tones[tone],
        color: '#fff',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 'var(--weight-bold)' as unknown as number,
      }}
    >
      {children}
    </span>
  );
}
