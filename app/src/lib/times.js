// Times are stored as display strings such as '7:30 pm' in state, the same
// way the restaurant data writes them. These helpers convert to and from
// minutes after midnight.

const pad = (n) => String(n).padStart(2, '0');

// '7:30 pm' → 1170
export function toMinutes(time) {
  const [clock, half] = time.split(' ');
  const [h, m] = clock.split(':').map(Number);
  return ((h % 12) + (half === 'pm' ? 12 : 0)) * 60 + m;
}

// 1170 → '7:30 pm'
export function fromMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  return `${h % 12 || 12}:${pad(minutes % 60)} ${h < 12 ? 'am' : 'pm'}`;
}
