// The booking rules. Pure functions: they take the restaurant data and the
// shared reservation state and return answers. No React in here, so the same
// rules drive the desktop panels, the mobile sheet and the map.

import { monthDayCode } from './dates.js';

export const isBooked = (restaurant, tableId, time) =>
  (restaurant.bookings[time] ?? []).includes(tableId);

export const fitsGroup = (table, guests) =>
  guests >= table.minGuests && guests <= table.maxGuests;

export const findTable = (restaurant, id) =>
  restaurant.tables.find((t) => t.id === id) ?? null;

export const findArea = (restaurant, id) =>
  restaurant.areas.find((a) => a.id === id) ?? restaurant.areas[0];

// ─── Table state ─────────────────────────────────────────────────────────────
// Every table on the map is in exactly one of these states. Order matters:
// the first rule that matches wins.
//
//   selected    the guest's pick
//   lost        the guest's pick, but someone booked it at the new time
//   booked      someone else has it at this time
//   wrong-size  free, but doesn't suit the number of guests
//   hovered     free, fits, and the pointer is over it
//   available   free and fits
//
// On top of that, `otherArea` says the table is outside the chosen seating
// area. Those tables keep their colours but are heavily faded and can't be
// picked.
export function getTableState(restaurant, table, reservation, hoveredId) {
  const booked = isBooked(restaurant, table.id, reservation.time);
  const otherArea = table.area !== reservation.area;
  let state;
  if (table.id === reservation.selectedTableId) state = booked ? 'lost' : 'selected';
  else if (booked) state = 'booked';
  else if (!fitsGroup(table, reservation.guests)) state = 'wrong-size';
  else if (table.id === hoveredId && !otherArea) state = 'hovered';
  else state = 'available';

  const confirmed = reservation.step === 'confirmed';
  const canPick = !otherArea && !confirmed && ['available', 'hovered', 'selected'].includes(state);
  return { state, otherArea, canPick };
}

// Tables the guest could pick right now: right area, right size, not booked.
export function freeTables(restaurant, { area, guests, time }) {
  return restaurant.tables.filter(
    (t) => t.area === area && fitsGroup(t, guests) && !isBooked(restaurant, t.id, time),
  );
}

// ─── Wording ─────────────────────────────────────────────────────────────────

export const guestsLabel = (n) => `${n} ${n === 1 ? 'guest' : 'guests'}`;

export const seatsLabel = (t) =>
  t.maxGuests <= 2 || t.minGuests === t.maxGuests
    ? `Seats ${t.maxGuests}`
    : `Seats ${t.minGuests}–${t.maxGuests}`;

export function formatMoney(restaurant, amount) {
  return new Intl.NumberFormat(restaurant.currency.locale, {
    style: 'currency',
    currency: restaurant.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

// "6 tables fit 2 guests in the dining room at 7:30 pm"
export function availabilityLine(restaurant, reservation) {
  const n = freeTables(restaurant, reservation).length;
  const count = n === 0 ? 'No tables fit' : n === 1 ? '1 table fits' : `${n} tables fit`;
  const where = findArea(restaurant, reservation.area).inSentence;
  return `${count} ${guestsLabel(reservation.guests)} ${where} at ${reservation.time}`;
}

export function areaLabel(restaurant, areaId) {
  const a = findArea(restaurant, areaId);
  return `${a.title} · ${a.subtitle}`;
}

// "RC-1016-W3K7". A real app gets this from the booking system.
export function bookingReference(restaurant, reservation) {
  return `${restaurant.referencePrefix}-${monthDayCode(reservation.date)}-${reservation.selectedTableId}K7`;
}

// ─── Derived view of the whole reservation ───────────────────────────────────
// One call that answers everything the panels need to know, so components
// don't each re-implement "is the pick still valid?".
export function describeReservation(restaurant, reservation) {
  const table = findTable(restaurant, reservation.selectedTableId);
  const lost = !!table && isBooked(restaurant, table.id, reservation.time);
  const canBook = !!table && !lost;

  let buttonNote;
  if (lost) buttonNote = 'Choose another table to continue.';
  else if (!table) buttonNote = 'Pick a table on the map to continue.';
  else if (table.fee) buttonNote = `${formatMoney(restaurant, table.fee)} deposit today, taken off your final bill.`;
  else buttonNote = 'No deposit needed for this table.';

  return {
    table,
    lost,
    canBook,
    buttonNote,
    fee: table ? formatMoney(restaurant, table.fee) : null,
    line: availabilityLine(restaurant, reservation),
  };
}

// Up to three free tables to suggest when the pick was lost, same kind first.
export function alternativesFor(restaurant, reservation, table) {
  return freeTables(restaurant, reservation)
    .filter((t) => t.id !== table.id)
    .sort((a, b) => (b.type === table.type) - (a.type === table.type))
    .slice(0, 3);
}
