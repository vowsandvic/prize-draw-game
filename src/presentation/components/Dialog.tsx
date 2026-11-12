import { useEffect, type ReactNode } from 'react';

interface DialogProps {
  className: string;
  labelledBy: string;
  zIndex: number;
  onEscape?: () => void;
  children: ReactNode;
}

export function Dialog({ className, labelledBy, zIndex, onEscape, children }: DialogProps) {
  useEffect(() => {
    if (!onEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEscape]);

  return (
    <div className="dialog-backdrop" style={{ zIndex }}>
      <div className={`dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  );
}
