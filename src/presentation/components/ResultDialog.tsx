import type { DrawResultView } from '../../application';
import { Confetti } from './Confetti';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

interface ResultDialogProps {
  result: DrawResultView;
  /** 1-based draw number, used in free mode. */
  drawNumber: number;
  burstKey: number;
  onRetry: () => void;
  onContinue: () => void;
}

export function ResultDialog({ result, drawNumber, burstKey, onRetry, onContinue }: ResultDialogProps) {
  const { prize } = result;
  const kicker = prize ? `Prize #${prize.order}` : `Draw #${drawNumber}`;
  const pre = prize ? `Number ${result.number} wins` : 'Free draw';
  const title = prize ? prize.name || `Prize #${prize.order}` : `Number ${result.number}!`;

  return (
    <Dialog className="result-dialog" labelledBy="result-title" zIndex={50}>
      <Confetti burstKey={burstKey} />
      <div className="result-hero">
        <span className="blob" aria-hidden="true" />
        <span className="chip" aria-hidden="true" />
        <div className="eyebrow">Lucky number · {kicker}</div>
        <div className="result-number">{result.number}</div>
      </div>
      <div className="result-body">
        <div>
          <div className="result-pre">{pre}</div>
          <div className="result-title" id="result-title">{title}</div>
        </div>
        <div className="result-actions">
          <button className="btn btn-secondary" type="button" onClick={onRetry}>
            <Icon name="retry" size={16} />
            Retry
          </button>
          <button className="btn btn-primary" type="button" onClick={onContinue} autoFocus>
            Continue
            <Icon name="arrowRight" size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
