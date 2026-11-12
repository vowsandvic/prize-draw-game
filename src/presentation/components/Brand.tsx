export function BrandShapes({ third = 'var(--c-mint)' }: { third?: string }) {
  return (
    <div className="brand-shapes" aria-hidden="true">
      <span style={{ background: 'var(--c-pink)', borderRadius: '50%' }} />
      <span style={{ background: 'var(--c-yellow)' }} />
      <span style={{ background: third, borderRadius: '50%' }} />
    </div>
  );
}

export function Brand() {
  return (
    <div className="brand">
      <BrandShapes />
      <span className="brand-name">Prize Draw</span>
    </div>
  );
}
