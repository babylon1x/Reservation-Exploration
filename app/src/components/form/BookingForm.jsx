// Date, time, guests, seating area and the "6 tables fit…" line.
// Used in the desktop left panel and the expanded mobile sheet.

import DateField from './DateField.jsx';
import TimeField from './TimeField.jsx';
import { availabilityLine } from '../../lib/reservation.js';

function GuestStepper({ value, max, onChange }) {
  return (
    <div className="stepper">
      <div className="field__label">Guests</div>
      <div className="stepper__controls">
        <button type="button" className="stepper__btn" aria-label="Fewer guests" disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
        <div className="stepper__value" aria-live="polite">{value}</div>
        <button type="button" className="stepper__btn" aria-label="More guests" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function AreaPicker({ areas, value, onChange }) {
  return (
    <div className="field">
      <div className="field__label">Seating area</div>
      <div className="area-picker" role="radiogroup" aria-label="Seating area">
        {areas.map((a) => (
          <button key={a.id} type="button" role="radio" aria-checked={a.id === value} className={`area-card${a.id === value ? ' is-selected' : ''}`} onClick={() => onChange(a.id)}>
            <span className="area-card__radio" />
            <span className="area-card__text">
              <span className="area-card__title">{a.title}</span>
              <span className="area-card__sub">{a.subtitle}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AvailabilityLine({ restaurant, reservation }) {
  return (
    <div className="availability-line">
      <span className="availability-line__dot" />
      <span>{availabilityLine(restaurant, reservation)}</span>
    </div>
  );
}

export default function BookingForm({ restaurant, reservation, actions, touch = false }) {
  return (
    <div className={`booking-form${touch ? ' booking-form--touch' : ''}`}>
      <DateField value={reservation.date} max={restaurant.bookableUntil} onChange={actions.setDate} />
      <TimeField value={reservation.time} hours={restaurant.hours} onChange={actions.setTime} />
      <GuestStepper value={reservation.guests} max={restaurant.maxGuests} onChange={actions.setGuests} />
      <AreaPicker areas={restaurant.areas} value={reservation.area} onChange={actions.setArea} />
      <AvailabilityLine restaurant={restaurant} reservation={reservation} />
    </div>
  );
}
