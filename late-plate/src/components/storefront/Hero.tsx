import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--lp-orange-500), var(--lp-orange-700))',
        color: 'var(--text-on-brand)',
        padding: '64px 32px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', opacity: 0.85, marginBottom: 12 }}>
        A Late Plate Collection · By Chef Noah Dean
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 7vw, 84px)',
          margin: 0,
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        Made with Heart
      </h1>
      <div style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(28px, 4vw, 46px)', color: 'var(--lp-cream-100)', marginTop: -6 }}>
        served with flair
      </div>
      <p style={{ maxWidth: 520, margin: '20px auto 0', fontSize: 'var(--text-md)', opacity: 0.92, lineHeight: 'var(--leading-relaxed)' }}>
        Custom meals, bold flavor, and cookbooks built from real recipes — cooked by feel, by fire, and by
        flavor.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28 }}>
        <a
          href="#menu"
          style={{
            background: 'var(--lp-cream-50)',
            color: 'var(--lp-orange-600)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '13px 26px',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--weight-semibold)' as unknown as number,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
          }}
        >
          Order Tonight&rsquo;s Plate
        </a>
        <Link
          to="/cookbooks"
          style={{
            background: 'transparent',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: 'var(--radius-md)',
            padding: '11px 26px',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--weight-semibold)' as unknown as number,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
          }}
        >
          Browse Cookbooks
        </Link>
      </div>
    </section>
  );
}
