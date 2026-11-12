import type { SummaryRow } from '../../application';
import type { DrawMode } from '../../domain';
import { paletteAt } from '../theme/themes';
import { BrandShapes } from './Brand';
import { Dialog } from './Dialog';

interface SummaryDialogProps {
  mode: DrawMode;
  rows: readonly SummaryRow[];
  onClose: () => void;
  onNewGame: () => void;
}

export function SummaryDialog({ mode, rows, onClose, onNewGame }: SummaryDialogProps) {
  const free = mode === 'free';
  const chip = (row: SummaryRow, i: number) => (
    <span className="num-chip" style={{ background: paletteAt(i), borderRadius: i % 2 ? 0 : 999 }}>
      {row.number ?? '—'}
    </span>
  );

  return (
    <Dialog className="summary-dialog" labelledBy="summary-title" zIndex={60} onEscape={onClose}>
      <div className="summary-head">
        <BrandShapes third="var(--c-sky)" />
        <h3 id="summary-title">{free ? 'Free draw results' : 'And the winners are…'}</h3>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>{free ? 'Draw #' : 'Prize #'}</th>
            {!free && <th>Prize name</th>}
            <th>Number drawn</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label}>
              <td style={{ whiteSpace: 'nowrap' }}>{row.label}</td>
              {!free && <td>{row.prizeName}</td>}
              <td>{chip(row, i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dialog-actions">
        <button className="btn btn-secondary" type="button" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" type="button" onClick={onNewGame}>
          New game
        </button>
      </div>
    </Dialog>
  );
}
