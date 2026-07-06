import { useState } from 'react';
import { chapterTone } from '../../data/menu';
import type { CartItem, Meal, SpiceLevel } from '../../types';

const SPICE_LEVELS: SpiceLevel[] = ['None', 'Mild', 'Medium', 'Hot', 'Fire'];

export interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}

export function MealDetail({ meal, onClose, onAdd }: MealDetailProps) {
  const [spice, setSpice] = useState<SpiceLevel>(meal.spice);
  const [extraSauce, setExtraSauce] = useState(false);
  const [qty, setQty] = useState(1);
  const tone = chapterTone(meal.chapter);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(36,28,20,0.55)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          maxWidth: 460,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ height: 180, background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})`, position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--lp-orange-600)',
            }}
          >
            {meal.chapterName}
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', margin: '4px 0 6px', color: 'var(--text-primary)' }}>{meal.title}</h2>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
            {meal.descriptors.join(' • ')}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {([
              ['Serves', meal.serves],
              ['Time', meal.time],
              ['Spice', meal.spice],
            ] as const).map(([l, v]) => (
              <div
                key={l}
                style={{ flex: 1, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', padding: '10px 8px', textAlign: 'center' }}
              >
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--lp-orange-600)' }}>{v}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 6 }}>Spice Level</label>
            <select
              value={spice}
              onChange={(e) => setSpice(e.target.value as SpiceLevel)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--border-default)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {SPICE_LEVELS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, cursor: 'pointer' }}>
            <span
              onClick={() => setExtraSauce(!extraSauce)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: `2px solid ${extraSauce ? 'var(--color-brand-primary)' : 'var(--border-default)'}`,
                background: extraSauce ? 'var(--color-brand-primary)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {extraSauce ? '✓' : ''}
            </span>
            <span style={{ fontSize: 'var(--text-base)' }}>Extra sauce on the side</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: '2px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
              }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                &minus;
              </button>
              <span style={{ fontWeight: 700 }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                +
              </button>
            </div>
            <button
              onClick={() =>
                onAdd({ title: meal.title, price: meal.price, qty, chapter: meal.chapter, spice, extraSauce })
              }
              style={{
                background: 'var(--color-brand-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '13px 24px',
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Add to Plate — ${meal.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
