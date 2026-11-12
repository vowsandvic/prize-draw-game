import { stepDuration, type SetupErrors, type SetupInput } from '../../application';
import type { Prize } from '../../domain';
import { Brand } from '../components/Brand';
import { Icon } from '../components/Icon';
import { PrizeListEditor } from '../components/PrizeListEditor';
import { ThemePicker } from '../components/ThemePicker';
import type { ThemeId } from '../theme/themes';

export type SetupForm = SetupInput;

interface SetupPageProps {
  form: SetupForm;
  errors: SetupErrors;
  theme: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  onFormChange: (patch: Partial<SetupForm>) => void;
  onAddPrize: () => void;
  onStart: () => void;
}

export function SetupPage({ form, errors, theme, onThemeChange, onFormChange, onAddPrize, onStart }: SetupPageProps) {
  const prizeCount = form.prizes.length;
  return (
    <div className="screen">
      <header className="app-header">
        <Brand />
        <div className="steps" aria-label="Step 1 of 2: Setup">
          <span className="dot-active" />
          <span style={{ fontWeight: 700 }}>Setup</span>
          <span className="line" />
          <span className="dot-next" />
          <span className="muted label-next">Draw</span>
        </div>
      </header>

      <main className="setup-main">
        <div className="hero">
          <div className="hero-shapes" aria-hidden="true">
            <span style={{ width: 56, height: 56, background: 'var(--c-yellow)', transform: 'rotate(12deg)' }} />
            <span style={{ width: 84, height: 84, background: 'var(--c-pink)', borderRadius: '50%' }} />
            <span style={{ width: 40, height: 40, background: 'var(--c-mint)', borderRadius: '50%', marginBottom: 46 }} />
            <span style={{ width: 28, height: 28, background: 'var(--c-lav)', transform: 'rotate(-12deg)', marginBottom: 96 }} />
          </div>
          <h1>
            Let’s draw
            <br />
            some <span style={{ color: 'var(--color-accent)' }}>luck</span>
            <span style={{ color: 'var(--c-yellow)' }}>.</span>
          </h1>
          <p className="muted">Pick a number range, line up the prizes, then hit start.</p>
        </div>

        <ThemePicker value={theme} onChange={onThemeChange} />

        <section className="section">
          <div className="section-head">
            <span className="step-badge" style={{ background: 'var(--c-pink)' }}>1</span>
            <h3>Number range</h3>
          </div>
          <div className="range-grid">
            <label className={`big-field${errors.start !== undefined ? ' invalid' : ''}`} style={{ background: 'var(--c-pink-t)' }}>
              <span className="eyebrow">From *</span>
              <input
                className="big-input"
                type="number"
                step={1}
                placeholder="1"
                inputMode="numeric"
                value={form.start}
                onChange={(e) => onFormChange({ start: e.target.value })}
              />
              <span className="field-msg error" role="alert">{errors.start}</span>
            </label>
            <label className={`big-field${errors.end !== undefined ? ' invalid' : ''}`} style={{ background: 'var(--c-sky-t)' }}>
              <span className="eyebrow">To *</span>
              <input
                className="big-input"
                type="number"
                step={1}
                placeholder="100"
                inputMode="numeric"
                value={form.end}
                onChange={(e) => onFormChange({ end: e.target.value })}
              />
              <span className="field-msg error" role="alert">{errors.end}</span>
            </label>
            <div className="big-field" style={{ background: 'var(--c-yellow-t)', cursor: 'default' }}>
              <span className="eyebrow" id="spin-time-label">Spin time</span>
              <div className="stepper">
                <button
                  className="btn btn-icon btn-secondary round-btn"
                  type="button"
                  aria-label="Shorter"
                  style={{ background: 'var(--color-surface)' }}
                  onClick={() => onFormChange({ durationSeconds: stepDuration(form.durationSeconds, -0.5) })}
                >
                  <Icon name="minus" strokeWidth={2.5} />
                </button>
                <div className="stepper-value">
                  <input
                    className="big-input"
                    type="number"
                    min={0.5}
                    step={0.5}
                    inputMode="decimal"
                    aria-labelledby="spin-time-label"
                    value={form.durationSeconds}
                    onChange={(e) => onFormChange({ durationSeconds: e.target.value })}
                  />
                  <span className="stepper-unit">s</span>
                </div>
                <button
                  className="btn btn-icon btn-secondary round-btn"
                  type="button"
                  aria-label="Longer"
                  style={{ background: 'var(--c-yellow)', borderColor: 'var(--c-yellow)', color: 'var(--c-ink)' }}
                  onClick={() => onFormChange({ durationSeconds: stepDuration(form.durationSeconds, 0.5) })}
                >
                  <Icon name="plus" strokeWidth={2.5} />
                </button>
              </div>
              <span className="field-msg muted">How long each number spins.</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <span className="step-badge" style={{ background: 'var(--c-sky)' }}>2</span>
            <h3>Prizes</h3>
            <span className="muted" style={{ fontSize: 13 }}>
              {prizeCount === 1 ? '1 prize' : `${prizeCount} prizes`} · drag to reorder · drawn last to first
            </span>
          </div>
          <div className="prize-list">
            <PrizeListEditor prizes={form.prizes} onChange={(prizes: Prize[]) => onFormChange({ prizes })} />
            {prizeCount === 0 && <div className="empty-note">No prizes yet — that’s fine, you’ll get free draw mode.</div>}
            <button className="add-prize" type="button" onClick={onAddPrize}>
              <Icon name="plus" strokeWidth={2.5} />
              Add a prize
            </button>
            <div className="field-msg error" style={{ fontSize: 13 }} role="alert">{errors.prizes}</div>
          </div>
        </section>

        <button className="btn btn-primary cta cta-wide" type="button" onClick={onStart}>
          Let’s go
          <Icon name="arrowRight" size={24} strokeWidth={2.5} />
        </button>
      </main>
    </div>
  );
}
