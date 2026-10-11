// Things that float over the map but don't move with it.

const LEGEND = [
  { key: 'available', label: 'Available' },
  { key: 'selected', label: 'Your pick' },
  { key: 'booked', label: 'Booked' },
  { key: 'wrong-size', label: 'Wrong size' },
];

export function Legend({ compact = false, className = '' }) {
  return (
    <div className={`legend${compact ? ' legend--compact' : ''} ${className}`}>
      {LEGEND.map((item) => (
        <div key={item.key} className="legend__item">
          <span className={`legend__swatch legend__swatch--${item.key}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

// vertical: stacked +, −, Fit (mobile). Otherwise a horizontal pill (desktop).
export function ZoomControls({ mapRef, vertical = false, className = '' }) {
  return (
    <div className={`zoom${vertical ? ' zoom--vertical' : ''} ${className}`}>
      <button type="button" className="zoom__btn" aria-label="Zoom in" onClick={() => mapRef.current.zoomIn()}>+</button>
      <span className="zoom__divider" />
      <button type="button" className="zoom__btn" aria-label="Zoom out" onClick={() => mapRef.current.zoomOut()}>−</button>
      <span className="zoom__divider" />
      <button type="button" className="zoom__btn zoom__btn--fit" onClick={() => mapRef.current.fit()}>Fit</button>
    </div>
  );
}
