import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  commitDraw,
  finishGame,
  getDrawProgress,
  getLastResult,
  getLedger,
  getSummary,
  pickNextNumber,
  retryLastDraw,
  startGame,
  type GameConfig,
} from '../../application';
import { isComplete, undoLastDraw, type DrawSession } from '../../domain';
import { Brand } from '../components/Brand';
import { Icon } from '../components/Icon';
import { Ledger } from '../components/Ledger';
import { NumberTile } from '../components/NumberTile';
import { ResultDialog } from '../components/ResultDialog';
import { SummaryDialog } from '../components/SummaryDialog';
import { useDependencies } from '../di/Dependencies';
import { useFullscreen } from '../hooks/useFullscreen';
import { useRollingNumber } from '../hooks/useRollingNumber';
import { toDrawStatus } from '../viewModels/drawStatus';

const POP_MS = 380;
const RESULT_DELAY_MS = 520;

interface DrawPageProps {
  config: GameConfig;
  onBack: () => void;
  onNewGame: () => void;
}

export function DrawPage({ config, onBack, onNewGame }: DrawPageProps) {
  const { random } = useDependencies();
  const fullscreen = useFullscreen();
  const { display, rolling, tick, roll, isRolling } = useRollingNumber(config.range, config.drawDurationMs);

  const [session, setSession] = useState<DrawSession>(() => startGame(config));
  /** True from the moment a number lands until the result dialog is dismissed. */
  const [revealing, setRevealing] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pop, setPop] = useState(false);
  const [burst, setBurst] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const draw = useCallback(
    (base: DrawSession) => {
      if (isRolling() || isComplete(base)) return;
      const winner = pickNextNumber(base, random);
      setPop(false);
      roll(winner, () => {
        setSession(commitDraw(base, winner));
        setRevealing(true);
        setPop(true);
        setBurst((b) => b + 1);
        later(() => setPop(false), POP_MS);
        later(() => setResultOpen(true), RESULT_DELAY_MS);
      });
    },
    [isRolling, random, roll],
  );

  const retry = () => {
    if (isRolling()) return;
    const undone = retryLastDraw(session);
    setSession(undone);
    setResultOpen(false);
    setRevealing(false);
    draw(undone);
  };

  const continueAfterResult = () => {
    setResultOpen(false);
    setRevealing(false);
    if (isComplete(session)) setSummaryOpen(true);
  };

  const finishFreeDraw = () => {
    if (isRolling()) return;
    setSession(finishGame(session));
    setSummaryOpen(true);
  };

  // While a result is being revealed, the status and ledger still describe the round
  // that was just drawn, so the next prize isn't spoiled behind the dialog.
  const shown = useMemo(() => (revealing ? undoLastDraw(session) : session), [revealing, session]);
  const progress = getDrawProgress(shown);
  const status = toDrawStatus(progress, config.range);
  const ledger = getLedger(shown);
  const lastResult = getLastResult(session);
  const showDraw = !progress.complete;
  const showFinish = progress.mode === 'free' && !progress.complete;

  return (
    <div className="screen">
      <header className="app-header">
        {!fullscreen.active && (
          <button className="btn btn-icon btn-secondary round-btn" type="button" aria-label="Back" title="Back" onClick={onBack}>
            <Icon name="arrowLeft" />
          </button>
        )}
        <Brand />
        <span className="progress-pill">{status.progress}</span>
        {!fullscreen.active && (
          <button
            className="btn btn-icon btn-secondary square-btn"
            type="button"
            aria-label="Full screen"
            title="Full screen"
            onClick={fullscreen.toggle}
          >
            <Icon name="fullscreen" />
          </button>
        )}
      </header>

      <main className="draw-main">
        <div className="draw-side">
          <div className="draw-status">
            <span className="kicker eyebrow">{status.kicker}</span>
            <h2 className="draw-title">{status.title}</h2>
            <div className="draw-sub">{status.sub}</div>
          </div>

          <div className="draw-actions">
            {showDraw && (
              <button className="btn btn-primary cta draw-btn" type="button" disabled={rolling || revealing} onClick={() => draw(session)}>
                {rolling ? 'Spinning…' : 'Draw!'}
                <Icon name="dice" size={24} />
              </button>
            )}
            {showFinish && (
              <button className="btn btn-secondary outline-btn" type="button" disabled={rolling || revealing} onClick={finishFreeDraw}>
                Finish
                <Icon name="flag" size={20} />
              </button>
            )}
            {progress.complete && !summaryOpen && (
              <button className="btn btn-secondary outline-btn" type="button" onClick={() => setSummaryOpen(true)}>
                See all results
              </button>
            )}
          </div>

          <Ledger mode={progress.mode} items={ledger} />
        </div>

        <NumberTile display={display} range={config.range} rolling={rolling} pop={pop} tick={tick} />
      </main>

      {resultOpen && lastResult && (
        <ResultDialog
          result={lastResult}
          drawNumber={session.entries.length}
          burstKey={burst}
          onRetry={retry}
          onContinue={continueAfterResult}
        />
      )}

      {summaryOpen && (
        <SummaryDialog
          mode={session.mode}
          rows={getSummary(session)}
          onClose={() => setSummaryOpen(false)}
          onNewGame={onNewGame}
        />
      )}
    </div>
  );
}
