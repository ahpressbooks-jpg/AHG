import { useState, type ReactNode } from 'react';

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
}

/** Underline tab bar — chapter switcher, menu category switcher. */
export function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '2px solid var(--border-subtle)' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 2px',
              marginBottom: -2,
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-semibold)' as unknown as number,
              color: active === i ? 'var(--color-brand-primary)' : 'var(--text-muted)',
              borderBottom: active === i ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
              transition: 'color var(--duration-base) var(--ease-standard)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: 'var(--space-4)' }}>{tabs[active]?.content}</div>
    </div>
  );
}
