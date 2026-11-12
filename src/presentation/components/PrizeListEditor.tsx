import { useState } from 'react';
import type { Prize } from '../../domain';
import { paletteAt } from '../theme/themes';
import { Icon } from './Icon';

interface PrizeListEditorProps {
  prizes: readonly Prize[];
  onChange: (prizes: Prize[]) => void;
}

function move<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function PrizeListEditor({ prizes, onChange }: PrizeListEditorProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const rename = (id: string, name: string) => onChange(prizes.map((p) => (p.id === id ? { ...p, name } : p)));
  const remove = (id: string) => onChange(prizes.filter((p) => p.id !== id));
  const dropOn = (targetId: string) => {
    if (dragId && dragId !== targetId) {
      onChange(move(prizes, prizes.findIndex((p) => p.id === dragId), prizes.findIndex((p) => p.id === targetId)));
    }
    setDragId(null);
    setOverId(null);
  };

  return (
    <>
      {prizes.map((prize, i) => {
        const classes = ['prize-row'];
        if (dragId === prize.id) classes.push('dragging');
        if (overId === prize.id && dragId !== prize.id) classes.push('drag-over');
        const colour = paletteAt(i);
        return (
          <div
            key={prize.id}
            className={classes.join(' ')}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              setDragId(prize.id);
            }}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (overId !== prize.id) setOverId(prize.id);
            }}
            onDragLeave={() => setOverId((cur) => (cur === prize.id ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              dropOn(prize.id);
            }}
          >
            <div
              className="prize-badge"
              style={{ background: colour, border: `2px solid ${colour}`, borderRadius: i % 2 ? 0 : '50%' }}
            >
              {i + 1}
            </div>
            <input
              className="input prize-input"
              type="text"
              placeholder="What’s the prize? (optional)"
              aria-label={`Prize #${i + 1}`}
              value={prize.name}
              onChange={(e) => rename(prize.id, e.target.value)}
            />
            <span className="grip">
              <Icon name="grip" />
            </span>
            <button
              className="btn btn-icon btn-ghost prize-remove"
              type="button"
              aria-label={`Remove prize #${i + 1}`}
              onClick={() => remove(prize.id)}
            >
              <Icon name="close" />
            </button>
          </div>
        );
      })}
    </>
  );
}
