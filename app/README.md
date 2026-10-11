# Table booking: The River Café

React build of the Claude Design handoff in `../project` (River Cafe Prototype).

```bash
npm install
npm run dev        # http://localhost:5173
```

URL options: `?theme=dark` / `?theme=light` (default follows the device),
`?restaurant=river-cafe`. Narrower than 768px shows the mobile layout.

## Where things live

| Folder | What's in it |
| --- | --- |
| `src/data/restaurants/` | **One file per restaurant**: tables, table types, areas, scenery, sample bookings. Add a restaurant here and register it in `index.js`. No code changes needed. |
| `src/state/useReservation.js` | The one shared state `{ date, time, guests, area, selectedTableId, step }` and every action that changes it. |
| `src/lib/reservation.js` | Booking rules: table states, what fits, wording, fees. |
| `src/components/map/` | `MapViewport` (pan/zoom/pinch), `FloorPlan`, `TableOnMap`, legend and zoom buttons. |
| `src/components/form/` | Date, time, guests, seating area. Shared by desktop and mobile. |
| `src/components/summary/` | Reservation rows, table card, "no longer available" notice. |
| `src/layouts/` | `DesktopLayout` (floating panels) and `MobileLayout` (bottom sheet). |
| `src/styles/tokens.css` | Palette scales and semantic tokens, light and dark. |

## Table states

`available`, `hovered`, `selected`, `booked`, `wrong-size`, plus `lost` (your pick
became booked when you changed time). Tables outside the chosen seating area
get the extra `other-area` fade. Rules: `getTableState()` in `src/lib/reservation.js`;
colours: `.table--*` in `src/styles/map.css`.
