// Every restaurant the app can show. To add one: create a data file next to
// river-cafe.js and add it to this list. Open it with ?restaurant=<id>.
import riverCafe from './river-cafe.js';

const all = [riverCafe];

// Merge each table with its table type, so the rest of the app always sees a
// complete table: { id, area, x, y, tags, description, name, minGuests, ... }.
function resolve(restaurant) {
  const tables = restaurant.tables.map((table) => ({
    ...restaurant.tableTypes[table.type],
    ...table,
  }));
  const maxGuests = Math.max(...tables.map((t) => t.maxGuests));
  return { ...restaurant, tables, maxGuests };
}

export const restaurants = Object.fromEntries(all.map((r) => [r.id, resolve(r)]));

export function getRestaurant(id) {
  return restaurants[id] ?? restaurants[all[0].id];
}
