import { useState, type CSSProperties, type ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  padded?: boolean;
  style?: CSSProperties;
}

/** Generic surface container — base for all card-like content. */
export function Card({ children, padded = true, style = {} }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: padded ? 'var(--space-5)' : 0,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface RecipeCardProps {
  title: string;
  /** Chapter label, e.g. "SKILLET KINGS" */
  chapter: string;
  /** Short all-caps descriptors, e.g. ["Seared", "Creamy", "Umami-Rich"] */
  descriptors?: string[];
  time?: string;
  imageSrc?: string;
}

export function RecipeCard({ title, chapter, descriptors = [], time, imageSrc }: RecipeCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        overflow: 'hidden',
        width: 240,
        fontFamily: 'var(--font-body)',
        transition: 'box-shadow var(--duration-base) var(--ease-standard)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          height: 140,
          background: imageSrc
            ? `center/cover url(${imageSrc})`
            : 'linear-gradient(135deg, var(--lp-orange-200), var(--lp-orange-400))',
        }}
      />
      <div style={{ padding: 'var(--space-4)' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 'var(--weight-bold)' as unknown as number,
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'var(--lp-orange-600)',
          }}
        >
          {chapter}
        </div>
        <div
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-bold)' as unknown as number,
            color: 'var(--text-primary)',
            marginTop: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          {descriptors.join(' • ')}
        </div>
        {time && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
