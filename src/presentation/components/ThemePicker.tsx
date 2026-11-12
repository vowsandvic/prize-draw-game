import { THEME_GROUPS, THEMES, type ThemeId } from '../theme/themes';

interface ThemePickerProps {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <section className="section">
      <div className="eyebrow">Pick a vibe</div>
      {THEME_GROUPS.map((group) => (
        <div key={group.name} className="theme-group">
          <div className="theme-group-head">
            <span className="theme-group-name">{group.name}</span>
            <span className="muted" style={{ fontSize: 13 }}>{group.desc}</span>
          </div>
          <div role="radiogroup" aria-label={group.name} className="theme-grid">
            {group.items.map(([id, name]) => {
              const t = THEMES[id];
              const selected = id === value;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className="theme-card"
                  onClick={() => onChange(id)}
                  style={{
                    background: t['--color-bg'],
                    color: t['--color-text'],
                    borderColor: selected ? 'var(--color-text)' : 'color-mix(in srgb, var(--color-text) 14%, transparent)',
                  }}
                >
                  <div className="theme-swatches" aria-hidden="true">
                    <span style={{ background: t['--c-pink'], borderRadius: '50%' }} />
                    <span style={{ background: t['--c-yellow'] }} />
                    <span style={{ background: t['--c-mint'], borderRadius: '50%' }} />
                    <span style={{ background: t['--c-lav'] }} />
                    <span style={{ background: t['--color-accent'], borderRadius: '50%' }} />
                  </div>
                  <div className="theme-card-foot">
                    <span style={{ fontWeight: 800, fontSize: 17 }}>{name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{selected ? '● Selected' : ''}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
