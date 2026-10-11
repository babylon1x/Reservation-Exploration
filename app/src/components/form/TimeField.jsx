// Time button + hour and minute wheels.
// The wheels use the 24-hour clock and only offer the restaurant's opening
// hours, so a time outside them can't be picked.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fromMinutes, toMinutes } from '../../lib/times.js';

const ROW = 36; // height of one wheel row in px; matches .time-wheel__item

const pad = (n) => String(n).padStart(2, '0');
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// One scrolling column. The row resting in the middle is the chosen one.
function Wheel({ label, items, value, onChange }) {
  const list = useRef(null);
  const settle = useRef(null);
  const opened = useRef(false);
  const latest = useRef(value);
  latest.current = value;

  // Keep the chosen row in the middle, also when the other wheel changes it.
  useLayoutEffect(() => {
    const top = items.indexOf(value) * ROW;
    if (Math.abs(list.current.scrollTop - top) > 1) {
      list.current.scrollTo({ top, behavior: opened.current ? 'smooth' : 'auto' });
    }
    opened.current = true;
  }, [items, value]);

  useEffect(() => () => clearTimeout(settle.current), []);

  // Once the wheel stops moving, pick whichever row it stopped on.
  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const i = Math.min(items.length - 1, Math.max(0, Math.round(list.current.scrollTop / ROW)));
      if (items[i] !== latest.current) onChange(items[i]);
    }, 90);
  };

  return (
    <div className="time-wheel">
      <div className="time-wheel__label">{label}</div>
      <div className="time-wheel__list" ref={list} onScroll={onScroll} role="listbox" aria-label={label}>
        {items.map((n) => (
          <button
            key={n}
            type="button"
            role="option"
            aria-selected={n === value}
            className={`time-wheel__item${n === value ? ' is-selected' : ''}`}
            onClick={() => onChange(n)}
          >
            {pad(n)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TimeField({ value, hours, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

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

  const first = toMinutes(hours.open);
  const last = toMinutes(hours.close);
  const now = toMinutes(value);
  const hour = Math.floor(now / 60);
  const minute = now % 60;

  // A new hour keeps the minutes unless that runs past opening or closing
  // time: 22 with 30 minutes becomes 22:00.
  const setHour = (h) => onChange(fromMinutes(Math.min(last, Math.max(first, h * 60 + minute))));

  // New minutes keep the hour unless that runs past opening or closing time,
  // in which case the hour steps back inside: 22 with 59 minutes becomes 21:59.
  const setMinute = (m) => {
    let h = hour;
    if (h * 60 + m > last) h -= 1;
    if (h * 60 + m < first) h += 1;
    onChange(fromMinutes(h * 60 + m));
  };

  return (
    <div className="field time-field" ref={root}>
      <div className="field__label">Time</div>
      <button type="button" className="date-field__button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="date-field__icon">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 4.5V8l2.5 1.5" />
        </svg>
        <span className="date-field__value">{value}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="date-field__chevron">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="time-popover" role="dialog" aria-label="Choose a time">
          <div className="time-popover__wheels">
            <Wheel label="Hour" items={range(Math.floor(first / 60), Math.floor(last / 60))} value={hour} onChange={setHour} />
            <div className="time-popover__colon">:</div>
            <Wheel label="Minute" items={range(0, 59)} value={minute} onChange={setMinute} />
          </div>
          <button type="button" className="btn btn--outline btn--small" onClick={() => setOpen(false)}>Done</button>
        </div>
      )}
    </div>
  );
}
