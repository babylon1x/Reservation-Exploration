// Pieces of the live reservation preview. They only read the shared state;
// the few buttons in here call actions passed down from the layout.

import { alternativesFor, areaLabel, formatMoney, guestsLabel, seatsLabel } from '../../lib/reservation.js';
import { useRef } from 'react';
import { formatShort } from '../../lib/dates.js';
import Confetti from './Confetti.jsx';

// The view from a table. Striped placeholder with a caption until the data
// file gives the table a real `photo` URL.
export function PhotoSlot({ table, height, showCaption = true, badge }) {
  return (
    <div className="photo" style={{ height }}>
      {table.photo ? (
        <img className="photo__img" src={table.photo} alt={table.photoCaption} />
      ) : (
        <div className="photo__placeholder">{showCaption && <span>Photo · {table.photoCaption}</span>}</div>
      )}
      {badge && <div className="photo__badge">{badge}</div>}
    </div>
  );
}

export function CodeChip({ id, tone = 'subtle' }) {
  return <span className={`code-chip code-chip--${tone}`}>{id}</span>;
}

// Date / Time / Guests / Area / Table rows that mirror the form instantly.
export function SummaryRows({ restaurant, reservation, table, lost }) {
  const rows = [
    { k: 'Date', v: formatShort(reservation.date) },
    { k: 'Time', v: reservation.time, tone: lost ? 'alert' : null },
    { k: 'Guests', v: guestsLabel(reservation.guests) },
    { k: 'Area', v: areaLabel(restaurant, reservation.area) },
    { k: 'Table', v: table ? `${table.id} · ${table.name}` : 'Not chosen yet', tone: !table ? 'muted' : lost ? 'struck' : null },
  ];
  return (
    <dl className="summary-rows">
      {rows.map((r) => (
        <div key={r.k} className="summary-rows__row">
          <dt>{r.k}</dt>
          <dd className={r.tone ? `is-${r.tone}` : undefined}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyPick() {
  return (
    <div className="empty-pick">
      <div className="empty-pick__icon" aria-hidden="true">
        <span className="empty-pick__chair" />
        <span className="empty-pick__table" />
        <span className="empty-pick__chair" />
      </div>
      <div className="heading heading--20">Pick your table</div>
      <p>Choose an available table on the map to see its view, seats and any table fee.</p>
    </div>
  );
}

// "W3 isn't free at 8:00 pm" + a way back + up to three free alternatives.
export function LostNotice({ restaurant, reservation, table, actions }) {
  const { time, previousTime } = reservation;
  const alternatives = alternativesFor(restaurant, reservation, table);
  return (
    <>
      <div className="notice" role="alert">
        <div className="notice__body">
          <svg className="notice__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="9" cy="9" r="7.2" />
            <path d="M9 5.2v4.4M9 12.4v.1" />
          </svg>
          <div className="notice__text">
            <div className="notice__title">{table.id} isn’t free at {time}</div>
            <p>
              Another guest booked this {table.name.toLowerCase()} for {time}. Pick another table on the map
              {previousTime ? `, or go back to ${previousTime} to keep ${table.id}.` : '.'}
            </p>
          </div>
        </div>
        <button type="button" className="btn btn--outline btn--small" onClick={previousTime ? actions.restorePreviousTime : actions.clearSelection}>
          {previousTime ? `Keep ${table.id} at ${previousTime}` : 'Clear selection'}
        </button>
      </div>

      {alternatives.length > 0 && (
        <div className="alternatives">
          <div className="field__label">Still free at {time}</div>
          {alternatives.map((t) => (
            <button key={t.id} type="button" className="alternative" onClick={() => actions.selectTable(t.id)}>
              <CodeChip id={t.id} tone="secondary" />
              <span className="alternative__text">
                <span className="alternative__name">{t.name}</span>
                <span className="alternative__meta">
                  {seatsLabel(t)} · {t.fee ? `${formatMoney(restaurant, t.fee)} table fee` : 'No table fee'}
                </span>
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 3l4 4-4 4" /></svg>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// Full table card: photo, name, code, seats, tags, description, fee.
export function TableCard({ restaurant, table, confirmed, photoHeight = 172 }) {
  return (
    <div className="table-card">
      <PhotoSlot table={table} height={photoHeight} badge={confirmed ? 'Booked for you' : null} />
      <div className="table-card__head">
        <div className="table-card__title-row">
          <div className="heading heading--22">{table.name}</div>
          <CodeChip id={table.id} />
        </div>
        <div className="text-secondary">{seatsLabel(table)}</div>
      </div>
      <div className="tags">
        {table.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <p className="table-card__desc">{table.description}</p>
      <div className="fee-box">
        <div className="fee-box__row">
          <span className="fee-box__label">{table.fee ? 'Table fee' : 'No table fee'}</span>
          <span className="heading heading--22">{formatMoney(restaurant, table.fee)}</span>
        </div>
        <p>{table.fee ? 'Charged now as a deposit and taken off your final bill.' : 'You only pay for what you order on the night.'}</p>
      </div>
    </div>
  );
}

// The tick on the confirmation. Confetti pops out of it when it appears.
export function SuccessMark() {
  const mark = useRef(null);
  return (
    <div className="success-mark" aria-hidden="true" ref={mark}>
      <Confetti anchor={mark} />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>
    </div>
  );
}
