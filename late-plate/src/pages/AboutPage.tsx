export function AboutPage() {
  return (
    <section style={{ padding: '64px 32px', maxWidth: 640, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--lp-orange-600)', fontWeight: 700 }}>
        The Kitchen Behind the Plate
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, textTransform: 'uppercase', margin: '8px 0 20px', color: 'var(--text-primary)' }}>
        About the Chef
      </h2>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-secondary)' }}>
        Noah Dean Cottle is a homegrown flavor chaser with a love for food that feels like home and tastes
        like something more. With formal culinary training and a deep respect for bold, soulful cooking, he
        writes recipes the way they&rsquo;re meant to be made — by feel, by fire, and by flavor.
      </p>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-secondary)' }}>
        Every recipe carries the spirit of late-night cravings, family gatherings, and dishes passed around
        with pride.
      </p>
      <p style={{ fontFamily: 'var(--font-script)', color: 'var(--lp-olive-500)', fontSize: 28, marginTop: 24 }}>
        Keep feeding people with heart.
      </p>
    </section>
  );
}
