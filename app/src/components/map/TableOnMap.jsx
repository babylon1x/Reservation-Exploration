// One table on the floor plan: its chairs, its top and its code.
//
// It's a real <button>, so keyboard users can Tab through tables and press
// Enter to pick one. The visual state is just a CSS class
// (table--available, table--selected, ...), so all the colours live in map.css.

import { chairsFor, padFor } from '../../lib/chairs.js';
import { seatsLabel } from '../../lib/reservation.js';

const STATE_WORDS = {
  available: 'available',
  hovered: 'available',
  selected: 'your pick',
  lost: 'no longer available',
  booked: 'booked',
  'wrong-size': 'wrong size for your group',
};

export default function TableOnMap({ table, state, otherArea, dimmed, canPick, onPick, onHover }) {
  const pad = padFor(table);
  const boxW = table.width + pad * 2;
  const boxH = table.height + pad * 2;
  const round = table.shape === 'round' || table.shape === 'stool';

  const classes = ['table', `table--${state}`];
  if (otherArea) classes.push('table--other-area');
  else if (dimmed) classes.push('table--dimmed');

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={{ left: table.x - boxW / 2, top: table.y - boxH / 2, width: boxW, height: boxH }}
      aria-label={`${table.id}, ${table.name}, ${seatsLabel(table).toLowerCase()}, ${STATE_WORDS[state]}`}
      aria-pressed={state === 'selected'}
      aria-disabled={!canPick}
      tabIndex={otherArea ? -1 : 0}
      onClick={(e) => {
        e.stopPropagation();
        if (canPick) onPick(table.id);
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover?.(table.id)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onHover?.(null)}
      onFocus={() => onHover?.(table.id)}
      onBlur={() => onHover?.(null)}
    >
      {chairsFor(table, pad).map((c, i) => (
        <span
          key={i}
          className="table__chair"
          style={{ left: c.x, top: c.y, width: c.w, height: c.h, borderRadius: c.radius, transform: `rotate(${c.rotate}deg)` }}
        />
      ))}
      <span
        className={`table__top${table.shape === 'stool' ? ' table__top--stool' : ''}`}
        style={{ left: pad, top: pad, width: table.width, height: table.height, borderRadius: round ? '50%' : 8 }}
      >
        {table.id}
      </span>
    </button>
  );
}
