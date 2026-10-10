// Date button + month calendar. Days before today or after the restaurant's
// booking window are greyed out and can't be picked.

import { useEffect, useRef, useState } from 'react';
import { formatLong, fromIso, monthGrid, monthTitle, todayIso } from '../../lib/dates.js';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function DateField({ value, max, onChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => ({ year: fromIso(value).getFullYear(), month: fromIso(value).getMonth() }));
  const root = useRef(null);
  const today = todayIso();

  // Close when clicking anywhere else, or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !root.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    const d = fromIso(value);
    setView({ year: d.getFullYear(), month: d.getMonth() });
    setOpen((o) => !o);
  };

  // Month navigation stays inside [this month, last bookable month].
  const index = view.year * 12 + view.month;
  const minIndex = fromIso(today).getFullYear() * 12 + fromIso(today).getMonth();
  const maxIndex = fromIso(max).getFullYear() * 12 + fromIso(max).getMonth();
  const shift = (k) => {
    const i = index + k;
    setView({ year: Math.floor(i / 12), month: i % 12 });
  };

  return (
    <div className="field date-field" ref={root}>
      <div className="field__label">Date</div>
      <button type="button" className="date-field__button" onClick={toggle} aria-expanded={open}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="date-field__icon">
          <rect x="2" y="3" width="12" height="11" rx="2" />
          <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
        </svg>
        <span className="date-field__value">{formatLong(value)}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="date-field__chevron">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="calendar" role="dialog" aria-label="Choose a date">
          <div className="calendar__head">
            <button type="button" className="calendar__nav" aria-label="Previous month" disabled={index <= minIndex} onClick={() => shift(-1)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 3L4.5 7l4 4" /></svg>
            </button>
            <div className="calendar__title">{monthTitle(view.year, view.month)}</div>
            <button type="button" className="calendar__nav" aria-label="Next month" disabled={index >= maxIndex} onClick={() => shift(1)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 3l4 4-4 4" /></svg>
            </button>
          </div>
          <div className="calendar__weekdays">
            {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="calendar__grid">
            {monthGrid(view.year, view.month).map((iso, i) => {
              if (!iso) return <span key={i} />;
              // ISO strings compare correctly as plain text.
              const off = iso < today || iso > max;
              const classes = ['calendar__day'];
              if (iso === value) classes.push('is-selected');
              if (iso === today) classes.push('is-today');
              return (
                <button
                  key={iso}
                  type="button"
                  className={classes.join(' ')}
                  disabled={off}
                  aria-pressed={iso === value}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {fromIso(iso).getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
