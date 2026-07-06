import { chapterTone } from '../../data/menu';
import type { Meal } from '../../types';

export interface MealGridProps {
  meals: Meal[];
  onSelect: (meal: Meal) => void;
}

export function MealGrid({ meals, onSelect }: MealGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
        padding: '20px 32px 48px',
      }}
    >
      {meals.map((meal) => {
        const tone = chapterTone(meal.chapter);
        return (
          <div
            key={meal.id}
            onClick={() => onSelect(meal)}
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'box-shadow var(--duration-base) var(--ease-standard)',
            }}
          >
            <div style={{ height: 140, background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})` }} />
            <div style={{ padding: 18 }}>
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
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                {meal.title}
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
                {meal.descriptors.join(' • ')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${meal.price}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{meal.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
