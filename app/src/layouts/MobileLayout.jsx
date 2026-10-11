// Mobile: full-screen map with a bottom sheet. The sheet follows `step`:
//   select     → peek sheet (your table + Review)
//   review     → expanded sheet (table card, form, Book reservation)
//   confirmed  → confirmation sheet; the map zooms onto your table

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MapViewport from '../components/map/MapViewport.jsx';
import FloorPlan from '../components/map/FloorPlan.jsx';
import { Legend, ZoomControls } from '../components/map/MapOverlays.jsx';
import BookingForm from '../components/form/BookingForm.jsx';
import { CodeChip, LostNotice, PhotoSlot, SuccessMark } from '../components/summary/Summary.jsx';
import { bookingReference, describeReservation, findArea, formatMoney, guestsLabel, seatsLabel } from '../lib/reservation.js';
import { formatMini } from '../lib/dates.js';

const AREA_ZOOM = 0.9;
const CONFIRMED_ZOOM = 1.15;
const TOP_CHROME = 150; // top bar + legend

// Height of an element, kept up to date as its content changes.
function useHeight() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return setHeight(0);
    const ro = new ResizeObserver(([entry]) => setHeight(entry.target.offsetHeight));
    ro.observe(ref.current);
    return () => ro.disconnect();
  });
  return [ref, height];
}

// Swipe up / down on a sheet. Taps still work as normal clicks.
function useSwipe({ onUp, onDown }) {
  const start = useRef(null);
  return {
    onPointerDown: (e) => (start.current = e.clientY),
    onPointerUp: (e) => {
      if (start.current == null) return;
      const dy = e.clientY - start.current;
      start.current = null;
      if (dy < -40) onUp?.();
      if (dy > 40) onDown?.();
    },
  };
}

function TopBar({ restaurant, reservation, onOpen }) {
  return (
    <div className="m-topbar">
      <button type="button" className="m-round-btn" aria-label="Back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
      </button>
      <button type="button" className="m-topbar__pill" onClick={onOpen}>
        <span className="m-topbar__name">{restaurant.name}</span>
        <span className="m-topbar__divider" />
        <span className="m-topbar__summary">
          {formatMini(reservation.date)} · {reservation.time} · {guestsLabel(reservation.guests)}
        </span>
      </button>
    </div>
  );
}

function PeekSheet({ restaurant, reservation, info, actions, sheetRef }) {
  const { table } = info;
  const swipe = useSwipe({ onUp: actions.openReview });
  let meta = '';
  if (table) {
    meta = info.lost
      ? `Booked at ${reservation.time}. Pick another table.`
      : `${seatsLabel(table)} · ${table.tags[table.tags.length > 1 ? 1 : 0]} · ${table.fee ? `${formatMoney(restaurant, table.fee)} fee` : 'No fee'}`;
  }
  return (
    <div className="m-sheet m-sheet--peek" ref={sheetRef} {...swipe}>
      <button type="button" className="m-sheet__handle" aria-label="Open reservation details" onClick={actions.openReview} />
      {table ? (
        <>
          <div className="m-peek">
            <div className="m-peek__thumb"><PhotoSlot table={table} height={68} showCaption={false} /></div>
            <div className="m-peek__text">
              <div className="m-peek__title">
                <CodeChip id={table.id} tone="solid" />
                <span className="heading heading--20">{table.name}</span>
              </div>
              <div className={`m-peek__meta${info.lost ? ' is-alert' : ''}`}>{meta}</div>
            </div>
          </div>
          <button type="button" className="btn btn--primary btn--52" onClick={actions.openReview}>Review</button>
        </>
      ) : (
        <div className="m-peek-empty">
          <div className="heading heading--20">Tap an available table</div>
          <p className="text-secondary">{info.line}</p>
        </div>
      )}
    </div>
  );
}

function ExpandedSheet({ restaurant, reservation, info, actions }) {
  const { table } = info;
  const swipe = useSwipe({ onDown: actions.closeReview });
  return (
    <>
      <div className="m-scrim" onClick={actions.closeReview} />
      <div className="m-sheet m-sheet--expanded" role="dialog" aria-label="Your reservation">
        <div className="m-sheet__header" {...swipe}>
          <button type="button" className="m-sheet__handle" aria-label="Show map" onClick={actions.closeReview} />
          <div className="m-sheet__title-row">
            <h2 className="heading heading--26">Your reservation</h2>
            <button type="button" className="icon-btn icon-btn--40" aria-label="Show map" onClick={actions.closeReview}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5l4 4 4-4" /></svg>
            </button>
          </div>
        </div>

        <div className="m-sheet__scroll">
          {table && info.lost && <LostNotice restaurant={restaurant} reservation={reservation} table={table} actions={actions} />}
          {table && !info.lost && (
            <div className="m-card">
              <PhotoSlot table={table} height={150} />
              <div className="m-card__body">
                <div className="m-card__head">
                  <div className="stack-2">
                    <span className="heading heading--21">{table.name}</span>
                    <span className="text-secondary text-13">{seatsLabel(table)} · {table.tags.slice(0, 2).join(' · ')}</span>
                  </div>
                  <CodeChip id={table.id} />
                </div>
                <p className="table-card__desc">{table.description}</p>
                <div className="m-card__fee">
                  <span className="fee-box__label">{table.fee ? 'Table fee, off your final bill' : 'No table fee'}</span>
                  <span className="heading heading--20">{info.fee}</span>
                </div>
              </div>
            </div>
          )}
          <BookingForm restaurant={restaurant} reservation={reservation} actions={actions} touch />
        </div>

        <div className="m-sheet__footer">
          <button type="button" className="btn btn--primary" disabled={!info.canBook} onClick={actions.book}>Book reservation</button>
          <p className="btn-note btn-note--12">{info.buttonNote}</p>
        </div>
      </div>
    </>
  );
}

function ConfirmedSheet({ restaurant, reservation, info, actions, sheetRef }) {
  const { table } = info;
  return (
    <div className="m-sheet m-sheet--confirmed" ref={sheetRef}>
      <span className="m-sheet__handle m-sheet__handle--static" />
      <div className="m-confirmed__head">
        <SuccessMark />
        <div className="stack-2">
          <h2 className="heading heading--26">Your table is booked</h2>
          <div className="text-secondary text-13">Confirmation sent to {restaurant.demoGuestEmail}</div>
        </div>
      </div>
      <div className="reference reference--row">
        <div className="stack-2">
          <span className="field__label field__label--11">Reference</span>
          <span className="reference__value reference__value--19">{bookingReference(restaurant, reservation)}</span>
        </div>
        <CodeChip id={table.id} tone="solid" />
      </div>
      <dl className="summary-rows">
        <div className="summary-rows__row"><dt>Table</dt><dd>{table.name} · {seatsLabel(table)}</dd></div>
        <div className="summary-rows__row"><dt>When</dt><dd>{formatMini(reservation.date)} · {reservation.time}</dd></div>
        <div className="summary-rows__row"><dt>Guests</dt><dd>{guestsLabel(reservation.guests)}</dd></div>
        <div className="summary-rows__row"><dt>Deposit paid</dt><dd>{info.fee}</dd></div>
      </dl>
      <p className="text-secondary text-13">
        We hold your table for {restaurant.holdMinutes} minutes past your booking time. The deposit comes off your final bill.
      </p>
      <div className="m-confirmed__actions">
        <button type="button" className="btn btn--outline btn--15" onClick={actions.changeBooking}>Change booking</button>
        <button type="button" className="btn btn--secondary">Add to calendar</button>
      </div>
    </div>
  );
}

export default function MobileLayout({ restaurant, reservation, actions }) {
  const mapRef = useRef(null);
  const [sheetRef, sheetHeight] = useHeight();
  const info = describeReservation(restaurant, reservation);
  const { step } = reservation;
  const confirmed = step === 'confirmed';

  const insets = { top: TOP_CHROME, right: 0, bottom: sheetHeight, left: 0 };

  // Move the camera when the area changes, and onto the table once booked.
  // Waits for the sheet to be measured so "centre" is above the sheet.
  const firstRun = useRef(true);
  const measured = sheetHeight > 0 || step === 'review';
  useEffect(() => {
    if (!measured) return;
    const animate = !firstRun.current;
    firstRun.current = false;
    if (confirmed && info.table) mapRef.current.centerOn(info.table, CONFIRMED_ZOOM, { animate });
    else {
      const area = findArea(restaurant, reservation.area);
      mapRef.current.centerOn(area.mobileFocus ?? area.focus, AREA_ZOOM, { animate });
    }
    // Only re-run when area or confirmation changes, not on every sheet resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant, reservation.area, confirmed, measured]);

  return (
    <div className="mobile" style={{ '--sheet-h': `${sheetHeight}px` }}>
      <MapViewport ref={mapRef} planSize={restaurant.plan} insets={insets} minZoom={0.25} maxZoom={2}>
        <FloorPlan
          restaurant={restaurant}
          reservation={reservation}
          onPick={actions.selectTable}
          flag={confirmed ? `Booked · ${reservation.time}` : info.lost ? `Now booked at ${reservation.time}` : null}
        />
      </MapViewport>

      <TopBar restaurant={restaurant} reservation={reservation} onOpen={actions.openReview} />
      <Legend compact className="m-legend" />

      {step === 'select' && (
        <>
          <ZoomControls mapRef={mapRef} vertical className="m-zoom" />
          <PeekSheet restaurant={restaurant} reservation={reservation} info={info} actions={actions} sheetRef={sheetRef} />
        </>
      )}
      {step === 'review' && <ExpandedSheet restaurant={restaurant} reservation={reservation} info={info} actions={actions} />}
      {confirmed && <ConfirmedSheet restaurant={restaurant} reservation={reservation} info={info} actions={actions} sheetRef={sheetRef} />}
    </div>
  );
}
