import type { CSSProperties, ReactNode } from 'react';

export type TagTone = 'neutral' | 'orange' | 'olive';

export interface TagProps {
  children: ReactNode;
  tone?: TagTone;
}

const tones: Record<TagTone, CSSProperties> = {
  neutral: { background: 'var(--lp-ink-100)', color: 'var(--text-secondary)' },
  orange: { background: 'var(--lp-orange-100)', color: 'var(--lp-orange-700)' },
  olive: { background: 'var(--lp-olive-100)', color: 'var(--lp-olive-700)' },
};

/** Pill label for descriptors and category filters (e.g. "SPICY", "SKILLET KINGS"). */
export function Tag({ children, tone = 'neutral' }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 12px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)' as unknown as number,
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}
