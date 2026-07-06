import { COOKBOOKS } from '../../data/menu';
import type { Cookbook } from '../../types';

export interface CookbookShopProps {
  onBuy: (book: Cookbook) => void;
}

export function CookbookShop({ onBuy }: CookbookShopProps) {
  return (
    <section style={{ padding: '8px 32px 56px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 32, color: 'var(--text-primary)', margin: 0 }}>
          The Cookbooks
        </h2>
        <span style={{ fontFamily: 'var(--font-script)', color: 'var(--lp-olive-500)', fontSize: 24 }}>by Chef Noah Dean</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {COOKBOOKS.map((b) => (
          <div
            key={b.id}
            style={{
              display: 'flex',
              gap: 20,
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              padding: 20,
              fontFamily: 'var(--font-body)',
            }}
          >
            <div
              style={{
                width: 120,
                height: 160,
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
                background: `linear-gradient(160deg, ${b.tone[0]}, ${b.tone[1]})`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                textAlign: 'center',
                padding: 10,
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', lineHeight: 1.15 }}>Late Plate</div>
              <div style={{ fontSize: 10, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', marginTop: 12, opacity: 0.9 }}>
                {b.subtitle}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 'var(--tracking-widest)',
                  textTransform: 'uppercase',
                  color: 'var(--lp-orange-600)',
                }}
              >
                {b.title}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 'var(--leading-relaxed)', flex: 1 }}>
                &ldquo;{b.tag}&rdquo;
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>${b.price}</span>
                <button
                  onClick={() => onBuy(b)}
                  style={{
                    background: 'var(--color-brand-secondary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 18px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Buy the Cookbook
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
