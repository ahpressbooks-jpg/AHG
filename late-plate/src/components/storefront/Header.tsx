import { ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'Menu', to: '/' },
  { label: 'Cookbooks', to: '/cookbooks' },
  { label: 'About', to: '/about' },
];

export function Header() {
  const { items, openCart } = useCart();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--lp-cream-50)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 32px',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/logos/late-plate-logo-lockup-trimmed.png" alt="Late Plate" style={{ height: 40 }} />
      </div>
      <nav style={{ display: 'flex', gap: 28 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            style={({ isActive }) => ({
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)' as unknown as number,
              color: isActive ? 'var(--color-brand-primary)' : 'var(--text-primary)',
              padding: '6px 0',
              borderBottom: isActive ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={openCart}
        style={{
          position: 'relative',
          width: 42,
          height: 42,
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: 'var(--color-brand-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Open cart"
      >
        <ShoppingBag size={20} color="#fff" />
        {items.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              minWidth: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--color-brand-secondary)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--lp-cream-50)',
            }}
          >
            {items.length}
          </span>
        )}
      </button>
    </header>
  );
}
