import { useState, type ReactNode } from 'react';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

/** Expand/collapse list — used for numbered recipe method steps and FAQ. */
export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-4) 0',
                textAlign: 'left',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--weight-semibold)' as unknown as number,
                color: 'var(--text-primary)',
              }}
            >
              <span>{item.title}</span>
              <span
                style={{
                  fontSize: 18,
                  color: 'var(--color-brand-primary)',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform var(--duration-base) var(--ease-standard)',
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  paddingBottom: 'var(--space-4)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
