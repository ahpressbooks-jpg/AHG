import { CHAPTERS } from '../../data/menu';

export interface ChapterFiltersProps {
  active: string;
  onSelect: (id: string) => void;
}

export function ChapterFilters({ active, onSelect }: ChapterFiltersProps) {
  const all = [{ id: 'all', name: 'All' }, ...CHAPTERS];
  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '20px 32px 4px' }}>
      {all.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              flexShrink: 0,
              padding: '9px 18px',
              borderRadius: 'var(--radius-pill)',
              border: isActive ? '2px solid var(--color-brand-primary)' : '2px solid var(--border-default)',
              background: isActive ? 'var(--color-brand-primary)' : 'var(--surface-card)',
              color: isActive ? '#fff' : 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)' as unknown as number,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
