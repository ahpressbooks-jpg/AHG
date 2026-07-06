import { useState, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  /** Visual style. @default 'primary' */
  variant?: ButtonVariant;
  /** Size. @default 'md' */
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 'var(--text-sm)' },
  md: { padding: '11px 20px', fontSize: 'var(--text-base)' },
  lg: { padding: '14px 28px', fontSize: 'var(--text-md)' },
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-brand-primary)',
    color: 'var(--text-on-brand)',
    border: '2px solid var(--color-brand-primary)',
  },
  secondary: {
    background: 'var(--color-brand-secondary)',
    color: 'var(--text-on-brand)',
    border: '2px solid var(--color-brand-secondary)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-brand-primary)',
    border: '2px solid var(--color-brand-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '2px solid transparent',
  },
};

const hoverBg: Record<ButtonVariant, string> = {
  primary: 'var(--color-brand-primary-hover)',
  secondary: 'var(--color-brand-secondary-hover)',
  outline: 'var(--lp-orange-50)',
  ghost: 'var(--lp-ink-100)',
};

/** Darkens on hover/press (letterpress feel) — never lightens. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const style: CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-semibold)' as unknown as number,
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition:
      'background var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    transform: active && !disabled ? 'scale(0.97)' : 'scale(1)',
    ...sizeStyles[size],
    ...variantStyles[variant],
    background: hover && !disabled ? hoverBg[variant] : variantStyles[variant].background,
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {children}
    </button>
  );
}
