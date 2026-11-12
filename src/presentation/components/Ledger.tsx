import type { DrawMode } from '../../domain';
import type { LedgerItem } from '../../application';
import { paletteAt } from '../theme/themes';

/** Row of small cells: prize draw order (prize mode) or numbers drawn so far (free mode). */
export function Ledger({ mode, items }: { mode: DrawMode; items: readonly LedgerItem[] }) {
  if (items.length === 0) return null;
  const free = mode === 'free';
  return (
    <div className="ledger">
      <div className="eyebrow muted">{free ? 'Drawn so far' : 'Draw order'}</div>
      <div className="ledger-items">
        {items.map((item) => {
          const has = item.number !== null;
          const style = free
            ? { background: paletteAt(item.index), color: 'var(--c-ink)', borderRadius: item.index % 2 ? '50%' : 0 }
            : {
                background: has ? paletteAt(item.index) : 'var(--color-surface)',
                color: has ? 'var(--c-ink)' : 'var(--color-text)',
                borderRadius: item.index % 2 ? 0 : '50%',
                outline: item.current ? '2px solid var(--color-accent)' : 'none',
              };
          return (
            <div key={item.key} className="ledger-cell" title={item.label} style={style}>
              <span className="short">{item.short}</span>
              <span className="value">{has ? item.number : '·'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
