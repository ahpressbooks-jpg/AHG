import { useState, type CSSProperties } from 'react';
import { ICONS } from '../icons';

export type IconButtonVariant = 'ghost' | 'filled' | 'outline';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  /** Lucide icon name, e.g. 'heart', 'shopping-cart', 'x'. */
  icon: keyof typeof ICONS;
  /** Accessible label (also used as tooltip). */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onClick?: () => void;
  disabled?: boolean;
}

const sizes: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 48 };

/** Square icon-only button. */
export function IconButton({ icon, label, variant = 'ghost', size = 'md', onClick, disabled = false }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const dim = sizes[size];
  const Icon = ICONS[icon];

  const variants: Record<IconButtonVariant, CSSProperties> = {
    ghost: { background: hover ? 'var(--lp-ink-100)' : 'transparent', color: 'var(--text-primary)' },
    filled: {
      background: hover ? 'var(--color-brand-primary-hover)' : 'var(--color-brand-primary)',
      color: 'var(--text-on-brand)',
    },
    outline: {
      background: hover ? 'var(--lp-orange-50)' : 'transparent',
      color: 'var(--color-brand-primary)',
      border: '2px solid var(--color-brand-primary)',
    },
  };

  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: dim,
        height: dim,
        borderRadius: 'var(--radius-md)',
        border: variants[variant].border ?? '2px solid transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--duration-base) var(--ease-standard)',
        ...variants[variant],
      }}
    >
      {Icon && <Icon size={dim * 0.45} />}
    </button>
  );
}
