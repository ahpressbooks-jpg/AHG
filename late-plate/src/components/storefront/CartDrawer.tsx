import { chapterTone } from '../../data/menu';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const { items, cartOpen, closeCart, removeItem, checkout, subtotal } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(36,28,20,0.45)',
          zIndex: 90,
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? 'auto' : 'none',
          transition: 'opacity var(--duration-base) var(--ease-standard)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: '92vw',
          background: 'var(--surface-card)',
          zIndex: 91,
          boxShadow: 'var(--shadow-lg)',
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--duration-slow) var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>Your Plate</h3>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>
            &times;
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
          {items.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 24 }}>
              Your plate is empty — go grab something good.
            </p>
          )}
          {items.map((item, i) => {
            const tone = chapterTone(item.chapter);
            return (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-sm)',
                    background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {item.spice ? `${item.spice} spice` : ''}
                    {item.extraSauce ? ' · extra sauce' : ''}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', marginTop: 4, color: 'var(--text-primary)' }}>
                    Qty {item.qty} &middot; ${item.price * item.qty}
                  </div>
                </div>
                <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: 24, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={checkout}
            style={{
              width: '100%',
              background: 'var(--color-brand-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              opacity: items.length === 0 ? 0.5 : 1,
              fontFamily: 'var(--font-body)',
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
