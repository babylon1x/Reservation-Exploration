// The whole floor plan drawing: scenery first, then tables, then the tooltip.
// Everything is positioned in plan units; MapViewport scales and moves it.

import TableOnMap from './TableOnMap.jsx';
import { getTableState, isBooked, fitsGroup, seatsLabel } from '../../lib/reservation.js';
import { padFor } from '../../lib/chairs.js';

// Turns walls: 'top right bottom' into border widths.
function wallStyle(item) {
  if (!item.walls) return null;
  const width = item.wallWidth ?? 4;
  const on = item.walls.split(' ');
  const side = (s) => (on.includes(s) ? `${width}px` : '0');
  return { borderWidth: `${side('top')} ${side('right')} ${side('bottom')} ${side('left')}` };
}

function SceneryItem({ item }) {
  const style = {
    left: item.x,
    top: item.y,
    width: item.w,
    height: item.h,
    transform: item.anchor === 'center' ? 'translateX(-50%)' : undefined,
    ...wallStyle(item),
  };
  return (
    <div className={`scenery scenery--${item.look}${item.walls ? ' scenery--walled' : ''}`} style={style}>
      {item.text && <span className="scenery__text">{item.text}</span>}
      {Array.from({ length: item.lines ?? 0 }, (_, i) => (
        <span key={i} className="scenery__line" />
      ))}
    </div>
  );
}

// The little dark label above a table: "W2 · Window table · Available".
// `flag` is used instead when the app wants to pin a message to the pick,
// e.g. "Booked · 7:30 pm" after confirming.
function Tooltip({ table, text, tone }) {
  const pad = padFor(table);
  const top = table.y - (table.height + pad * 2) / 2 - 6;
  return (
    <div className={`map-tooltip map-tooltip--${tone}`} style={{ left: table.x, top }} role="status">
      <span className="map-tooltip__code">{table.id}</span>
      <span className="map-tooltip__dot">·</span>
      <span>{text}</span>
    </div>
  );
}

export default function FloorPlan({ restaurant, reservation, hoveredId, onHover, onPick, flag }) {
  const confirmed = reservation.step === 'confirmed';
  const hovered = restaurant.tables.find((t) => t.id === hoveredId && t.area === reservation.area);
  const selected = restaurant.tables.find((t) => t.id === reservation.selectedTableId);

  let tooltip = null;
  if (hovered) {
    const text = isBooked(restaurant, hovered.id, reservation.time)
      ? 'Booked'
      : !fitsGroup(hovered, reservation.guests)
        ? seatsLabel(hovered)
        : 'Available';
    tooltip = <Tooltip table={hovered} text={`${hovered.name} · ${text}`} tone="neutral" />;
  } else if (flag && selected) {
    tooltip = <Tooltip table={selected} text={flag} tone="accent" />;
  }

  return (
    <div className="floor-plan" style={{ width: restaurant.plan.width, height: restaurant.plan.height }}>
      {restaurant.scenery.map((item, i) => (
        <SceneryItem key={i} item={item} />
      ))}

      {restaurant.tables.map((table) => {
        const { state, otherArea, canPick } = getTableState(restaurant, table, reservation, hoveredId);
        return (
          <TableOnMap
            key={table.id}
            table={table}
            state={state}
            otherArea={otherArea}
            dimmed={confirmed && table.id !== reservation.selectedTableId}
            canPick={canPick}
            onPick={onPick}
            onHover={onHover}
          />
        );
      })}

      {tooltip}
    </div>
  );
}
