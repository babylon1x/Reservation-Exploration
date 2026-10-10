// Desktop: full-screen map, booking panel on the left, live preview on the right.

import { useEffect, useRef, useState } from 'react';
import MapViewport from '../components/map/MapViewport.jsx';
import FloorPlan from '../components/map/FloorPlan.jsx';
import { Legend, ZoomControls } from '../components/map/MapOverlays.jsx';
import BookingForm from '../components/form/BookingForm.jsx';
import { EmptyPick, LostNotice, SummaryRows, SuccessMark, TableCard } from '../components/summary/Summary.jsx';
import { bookingReference, describeReservation, findArea, guestsLabel } from '../lib/reservation.js';
import { formatMini } from '../lib/dates.js';

const AREA_ZOOM = 0.82;
// Space the floating panels take up (24px margin + 340px panel), so the map
// centres things in the gap between them.
const INSETS = { top: 0, right: 364, bottom: 0, left: 364 };

function Header({ restaurant }) {
  return (
    <div className="panel-header">
      <div className="panel-header__nav">
        <button type="button" className="icon-btn" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <span className="text-secondary text-13">Reservations</span>
      </div>
      <div className="panel-header__title">
        <h1 className="heading heading--36">{restaurant.name}</h1>
        <div className="location">
          <span className="location__dot" />
          {restaurant.location}
        </div>
      </div>
    </div>
  );
}

function Confirmation({ restaurant, reservation, info, actions }) {
  return (
    <div className="panel-body">
      <div className="stack-12">
        <SuccessMark />
        <h2 className="heading heading--30">Your table is booked</h2>
        <p className="text-secondary">We've sent the confirmation to {restaurant.demoGuestEmail}.</p>
      </div>
      <div className="reference">
        <div className="field__label">Reference</div>
        <div className="reference__value">{bookingReference(restaurant, reservation)}</div>
      </div>
      <dl className="summary-rows summary-rows--12">
        <div className="summary-rows__row"><dt>When</dt><dd>{formatMini(reservation.date)} · {reservation.time}</dd></div>
        <div className="summary-rows__row"><dt>Guests</dt><dd>{guestsLabel(reservation.guests)}</dd></div>
        <div className="summary-rows__row"><dt>Deposit paid</dt><dd>{info.fee}</dd></div>
      </dl>
      <p className="text-secondary text-13">
        We hold your table for {restaurant.holdMinutes} minutes past your booking time. The deposit comes off your final bill.
      </p>
      <div className="spacer" />
      <div className="stack-10">
        <button type="button" className="btn btn--outline" onClick={actions.changeBooking}>Change booking</button>
        <button type="button" className="btn btn--ghost">Add to calendar</button>
      </div>
    </div>
  );
}

export default function DesktopLayout({ restaurant, reservation, actions }) {
  const mapRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const info = describeReservation(restaurant, reservation);
  const confirmed = reservation.step === 'confirmed';

  // Glide the map to the chosen seating area. Runs on first load (no
  // animation) and again whenever the area changes.
  const firstRun = useRef(true);
  useEffect(() => {
    mapRef.current.centerOn(findArea(restaurant, reservation.area).focus, AREA_ZOOM, { animate: !firstRun.current });
    firstRun.current = false;
  }, [restaurant, reservation.area]);

  const flag = confirmed ? `Booked · ${reservation.time}` : info.lost ? `Now booked at ${reservation.time}` : null;

  return (
    <div className="desktop">
      <MapViewport ref={mapRef} planSize={restaurant.plan} insets={INSETS} minZoom={0.4} maxZoom={2}>
        <FloorPlan
          restaurant={restaurant}
          reservation={reservation}
          hoveredId={confirmed ? null : hoveredId}
          onHover={setHoveredId}
          onPick={actions.selectTable}
          flag={flag}
        />
      </MapViewport>

      <Legend className="desktop__legend" />
      <ZoomControls mapRef={mapRef} className="desktop__zoom" />

      {/* Left: the form, or the confirmation once booked */}
      <aside className="panel desktop__left">
        <Header restaurant={restaurant} />
        <div className="divider" />
        {confirmed ? (
          <Confirmation restaurant={restaurant} reservation={reservation} info={info} actions={actions} />
        ) : (
          <div className="panel-body">
            <BookingForm restaurant={restaurant} reservation={reservation} actions={actions} />
            <div className="spacer" />
            <div className="stack-10">
              <button type="button" className="btn btn--primary" disabled={!info.canBook} onClick={actions.book}>
                Book reservation
              </button>
              <p className="btn-note">{info.buttonNote}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Right: live preview of the reservation */}
      <aside className="panel desktop__right" aria-live="polite">
        <div className="stack-4">
          <h2 className="heading heading--24">{confirmed ? 'Your table' : 'Your reservation'}</h2>
          <div className="text-tertiary text-13">{confirmed ? 'Highlighted on the map' : 'Updates as you choose'}</div>
        </div>
        <SummaryRows restaurant={restaurant} reservation={reservation} table={info.table} lost={info.lost} />
        <div className="divider" />
        {!info.table && <EmptyPick />}
        {info.lost && <LostNotice restaurant={restaurant} reservation={reservation} table={info.table} actions={actions} />}
        {info.table && !info.lost && <TableCard restaurant={restaurant} table={info.table} confirmed={confirmed} />}
      </aside>
    </div>
  );
}
