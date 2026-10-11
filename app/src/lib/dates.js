// Dates are stored as 'YYYY-MM-DD' strings in state. Strings are easy to
// compare and never shift by a day because of time zones.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (n) => String(n).padStart(2, '0');

export function toIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayIso() {
  return toIso(new Date());
}

// "Friday, 16 October 2026"
export function formatLong(iso) {
  const d = fromIso(iso);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// "Fri, 16 Oct 2026"
export function formatShort(iso) {
  const d = fromIso(iso);
  return `${DAYS[d.getDay()].slice(0, 3)}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

// "Fri, 16 Oct"
export function formatMini(iso) {
  const d = fromIso(iso);
  return `${DAYS[d.getDay()].slice(0, 3)}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

// "1016" — month and day, used in the booking reference.
export function monthDayCode(iso) {
  const d = fromIso(iso);
  return pad(d.getMonth() + 1) + pad(d.getDate());
}

export function monthTitle(year, month) {
  return `${MONTHS[month]} ${year}`;
}

// The cells of a Monday-first month grid: nulls for the blank lead-in, then
// one ISO date per day.
export function monthGrid(year, month) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = Array(lead).fill(null);
  for (let day = 1; day <= count; day++) cells.push(toIso(new Date(year, month, day)));
  return cells;
}
