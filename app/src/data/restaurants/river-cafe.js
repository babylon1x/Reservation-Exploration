// The River Café — everything the app knows about this restaurant.
//
// This file is pure data: no React, no logic. To add another restaurant,
// copy this file, change the values, and register it in ./index.js.
//
// Coordinates are in "plan units" — think of them as pixels on the floor plan
// drawing at 100% zoom. x/y on a table is the CENTRE of the table top.

// ─── Table types ─────────────────────────────────────────────────────────────
// Shared settings for every table of the same kind, so each table below only
// has to say what's unique about it (code, position, tags, description).
//
//   minGuests / maxGuests  which party sizes this table suits
//   fee                    deposit in whole currency units (0 = no fee)
//   shape                  'rect' | 'round' | 'booth' | 'stool'
//   width / height         size of the table top
//   chairs                 rect: chairs per side { top, right, bottom, left }
//                          round: total chairs spaced around the edge
//   photo                  URL of the view from the table (null = placeholder)
//   photoCaption           describes the view; shown until a real photo exists
const tableTypes = {
  window: {
    name: 'Window table', minGuests: 1, maxGuests: 2, fee: 75,
    shape: 'rect', width: 46, height: 46, chairs: { left: 1, right: 1 },
    photo: null, photoCaption: 'View from a window table to the Manhattan skyline at dusk',
  },
  main: {
    name: 'Dining table', minGuests: 2, maxGuests: 4, fee: 0,
    shape: 'round', width: 66, height: 66, chairs: 4,
    photo: null, photoCaption: 'Centre of the dining room under the brass pendants',
  },
  booth: {
    name: 'Booth', minGuests: 4, maxGuests: 6, fee: 50,
    shape: 'booth', width: 96, height: 50,
    photo: null, photoCaption: 'Leather booth against the east wall',
  },
  private: {
    name: 'Private room', minGuests: 6, maxGuests: 10, fee: 250,
    shape: 'rect', width: 64, height: 170, chairs: { top: 1, right: 4, bottom: 1, left: 4 },
    photo: null, photoCaption: 'Private room with the oak doors closed',
  },
  bar: {
    name: 'Bar seat', minGuests: 1, maxGuests: 1, fee: 0,
    shape: 'stool', width: 30, height: 30,
    photo: null, photoCaption: 'Bar counter and back bar from a stool',
  },
  edge: {
    name: 'River edge table', minGuests: 1, maxGuests: 2, fee: 75,
    shape: 'rect', width: 46, height: 46, chairs: { left: 1, right: 1 },
    photo: null, photoCaption: 'Terrace edge right above the water',
  },
  terrace: {
    name: 'Terrace table', minGuests: 2, maxGuests: 4, fee: 0,
    shape: 'rect', width: 62, height: 62, chairs: { top: 1, right: 1, bottom: 1, left: 1 },
    photo: null, photoCaption: 'Terrace under the string lights',
  },
  umbrella: {
    name: 'Umbrella table', minGuests: 3, maxGuests: 5, fee: 50,
    shape: 'round', width: 74, height: 74, chairs: 5,
    photo: null, photoCaption: 'Round table under the canvas umbrella',
  },
  firepit: {
    name: 'Firepit table', minGuests: 1, maxGuests: 2, fee: 50,
    shape: 'rect', width: 44, height: 44, chairs: { top: 1, bottom: 1 },
    photo: null, photoCaption: 'Lounge chairs beside the firepit after dark',
  },
};

// ─── Tables ──────────────────────────────────────────────────────────────────
// id: short code printed on the map. type: a key from tableTypes above.
// area: an id from `areas` below. Any field here overrides the table type,
// e.g. add `fee: 100` to one table to price it differently.
const tables = [
  { id: 'W1', type: 'window', area: 'indoor', x: 330, y: 625, tags: ['Window', 'Skyline view', 'Corner'], description: 'Corner of the glass wall beside the wine cellar, with a wide view of the Brooklyn Bridge.' },
  { id: 'W2', type: 'window', area: 'indoor', x: 435, y: 625, tags: ['Window', 'Skyline view'], description: 'Right against the glass, looking straight across the East River to Lower Manhattan.' },
  { id: 'W3', type: 'window', area: 'indoor', x: 540, y: 625, tags: ['Window', 'Skyline view'], description: 'Centre of the glass wall, facing the water. The best seat in the room for sunset.' },
  { id: 'W4', type: 'window', area: 'indoor', x: 645, y: 625, tags: ['Window', 'Skyline view'], description: 'Skyline view framed by the terrace planters, a few steps from the bar.' },
  { id: 'W5', type: 'window', area: 'indoor', x: 750, y: 625, tags: ['Window', 'Skyline view'], description: 'Last window table before the terrace doors, where the evening breeze comes in.' },

  { id: 'M1', type: 'main', area: 'indoor', x: 410, y: 300, tags: ['Central'], description: 'Under the brass pendants at the heart of the room, close to the private room.' },
  { id: 'M2', type: 'main', area: 'indoor', x: 590, y: 300, tags: ['Central', 'Near the bar'], description: 'Facing the bar, livelier once the late service starts.' },
  { id: 'M3', type: 'main', area: 'indoor', x: 410, y: 450, tags: ['Central'], description: 'Mid-room with a clear line of sight to the river windows.' },
  { id: 'M4', type: 'main', area: 'indoor', x: 590, y: 450, tags: ['Central'], description: 'Between the booths and the windows, a calm spot for a long dinner.' },

  { id: 'B1', type: 'booth', area: 'indoor', x: 790, y: 262, tags: ['Booth', 'Quiet'], description: 'Leather banquette against the east wall, curtained on one side.' },
  { id: 'B2', type: 'booth', area: 'indoor', x: 790, y: 372, tags: ['Booth', 'Quiet'], description: 'The middle booth and the quietest corner of the room.' },
  { id: 'B3', type: 'booth', area: 'indoor', x: 790, y: 482, tags: ['Booth', 'Partial view'], description: 'Closest to the terrace doors, with a partial view of the water.' },

  { id: 'P1', type: 'private', area: 'indoor', x: 154, y: 385, tags: ['Private', 'Own server', 'Seats 6–10'], description: 'Behind sliding oak doors, with its own server and the sommelier on request.' },

  ...[615, 660, 705, 750, 795, 840].map((x, i) => ({
    id: 'C' + (i + 1), type: 'bar', area: 'indoor', x, y: 170,
    tags: ['Bar counter', 'Solo friendly'],
    description: 'Front row at the counter, facing the bartenders and the back bar.',
  })),

  { id: 'F1', type: 'firepit', area: 'outdoor', x: 940, y: 190, tags: ['Outdoor', 'Firepit'], description: 'Low lounge chairs on the west side of the firepit. Best after dark.' },
  { id: 'F2', type: 'firepit', area: 'outdoor', x: 1120, y: 190, tags: ['Outdoor', 'Firepit'], description: 'Beside the firepit with the river breeze at your back.' },
  { id: 'U1', type: 'umbrella', area: 'outdoor', x: 1300, y: 205, tags: ['Outdoor', 'Umbrella'], description: 'Large round table under a canvas umbrella, shaded at lunch and lit at night.' },
  { id: 'T5', type: 'terrace', area: 'outdoor', x: 965, y: 410, tags: ['Outdoor', 'String lights'], description: 'Under the string lights in the middle of the terrace.' },
  { id: 'T6', type: 'terrace', area: 'outdoor', x: 1110, y: 410, tags: ['Outdoor', 'String lights'], description: 'Centre of the terrace, a short walk from the firepit.' },
  { id: 'T7', type: 'terrace', area: 'outdoor', x: 1255, y: 410, tags: ['Outdoor', 'String lights'], description: 'East side of the terrace, framed by the planters.' },
  { id: 'T1', type: 'edge', area: 'outdoor', x: 945, y: 615, tags: ['Outdoor', 'River edge'], description: 'On the terrace edge right above the water.' },
  { id: 'T2', type: 'edge', area: 'outdoor', x: 1065, y: 615, tags: ['Outdoor', 'River edge'], description: 'On the terrace edge with an open view across the river.' },
  { id: 'T3', type: 'edge', area: 'outdoor', x: 1185, y: 615, tags: ['Outdoor', 'River edge'], description: 'On the terrace edge, closest to the jetty lights.' },
  { id: 'T4', type: 'edge', area: 'outdoor', x: 1305, y: 615, tags: ['Outdoor', 'River edge', 'Corner'], description: 'The far corner of the terrace, water on two sides.' },
];

// ─── Scenery ─────────────────────────────────────────────────────────────────
// The non-clickable drawing: walls, water, bar, plants, labels. Each item is a
// box at x/y with width w and height h, drawn in a named `look`. Looks are
// styled in styles/map.css, which is where their light and dark colours live.
//
//   walls      which sides get a wall line, e.g. 'top right bottom'
//   wallWidth  thickness of those lines (default 4)
//   text       a label inside the box, or the label itself for text looks
//   lines      draws that many shelf lines under the text (wine racks)
//   anchor     'center' places the item's x at its horizontal middle
// Items are drawn in order, so later items sit on top of earlier ones.
const scenery = [
  // River and quay
  { look: 'quay', x: -2000, y: 700, w: 5480, h: 40 },
  { look: 'water', x: -2000, y: 740, w: 5480, h: 2400 },
  { look: 'ripple', x: 180, y: 790, w: 46, h: 2 },
  { look: 'ripple', x: 470, y: 820, w: 64, h: 2 },
  { look: 'ripple', x: 980, y: 800, w: 52, h: 2 },
  { look: 'ripple', x: 1230, y: 880, w: 70, h: 2 },
  { look: 'ripple', x: 300, y: 930, w: 40, h: 2 },
  { look: 'water-label', x: 640, y: 850, text: 'East River' },

  // Street and entrance
  { look: 'street-label', x: 460, y: -2, anchor: 'center', text: 'Water Street' },
  { look: 'entrance', x: 460, y: 28, anchor: 'center', text: 'Entrance' },

  // Terrace
  { look: 'decking', x: 860, y: 60, w: 540, h: 640, walls: 'top right bottom', wallWidth: 2 },
  { look: 'planter', x: 874, y: 72, w: 512, h: 16 },
  { look: 'plant', x: 1360, y: 500, w: 36, h: 36 },
  { look: 'plant', x: 1360, y: 300, w: 30, h: 30 },
  { look: 'firepit', x: 1000, y: 160, w: 60, h: 60 },
  { look: 'umbrella', x: 1220, y: 125, w: 160, h: 160 },
  { look: 'area-label', x: 1130, y: 292, anchor: 'center', text: 'River terrace' },

  // Dining room shell
  { look: 'floor', x: 40, y: 60, w: 820, h: 640, walls: 'top right bottom left', wallWidth: 8 },
  { look: 'opening', x: 420, y: 60, w: 80, h: 8 },
  { look: 'door-swing-left', x: 420, y: 68, w: 40, h: 40 },
  { look: 'door-swing-right', x: 460, y: 68, w: 40, h: 40 },
  { look: 'glass-wall', x: 280, y: 692, w: 572, h: 8 },
  { look: 'glass-door', x: 852, y: 560, w: 8, h: 100 },

  // Back of house and rooms
  { look: 'kitchen', x: 48, y: 68, w: 212, h: 162, walls: 'right bottom', text: 'Kitchen' },
  { look: 'room', x: 48, y: 250, w: 216, h: 270, walls: 'top right bottom' },
  { look: 'opening', x: 260, y: 350, w: 4, h: 70 },
  { look: 'room-label', x: 64, y: 262, text: 'Private room' },
  { look: 'cellar', x: 48, y: 540, w: 216, h: 152, walls: 'top right', wallWidth: 3, text: 'Wine cellar', lines: 3 },

  // Bar
  { look: 'bar-back', x: 588, y: 68, w: 264, h: 22, text: 'Bar' },
  { look: 'bar-counter', x: 588, y: 110, w: 264, h: 30 },
  { look: 'host-stand', x: 516, y: 84, w: 46, h: 20, text: 'Host' },

  // Indoor plants and label
  { look: 'plant', x: 278, y: 80, w: 34, h: 34 },
  { look: 'plant', x: 372, y: 80, w: 28, h: 28 },
  { look: 'plant', x: 820, y: 530, w: 26, h: 26 },
  { look: 'area-label', x: 300, y: 196, text: 'Dining room' },
];

// ─── Restaurant ──────────────────────────────────────────────────────────────
export default {
  id: 'river-cafe',
  name: 'The River Café',
  location: 'Under the Brooklyn Bridge · 1 Water St, Brooklyn, NY',
  currency: { code: 'USD', locale: 'en-US' },
  referencePrefix: 'RC',

  // Shown on the confirmation. A real app would use the signed-in guest's email.
  demoGuestEmail: 'emma.carter@gmail.com',
  holdMinutes: 15,

  // How far ahead guests can book, as an ISO date (YYYY-MM-DD).
  bookableUntil: '2026-12-31',
  // Guests can type any time inside these opening hours.
  hours: { open: '8:00 am', close: '10:00 pm' },
  defaultTime: '7:30 pm',
  defaultGuests: 2,

  // Size of the floor plan drawing, used by "Fit".
  plan: { width: 1480, height: 1000 },

  // Seating areas, in the order they appear as radio cards. `focus` is the
  // point on the plan the map glides to when the guest picks this area;
  // `mobileFocus` (optional) is the same for the narrower phone screen.
  areas: [
    { id: 'indoor', title: 'Indoor', subtitle: 'Dining room', inSentence: 'in the dining room', focus: { x: 450, y: 432 }, mobileFocus: { x: 540, y: 540 } },
    { id: 'outdoor', title: 'Outdoor', subtitle: 'River terrace', inSentence: 'on the terrace', focus: { x: 1130, y: 432 }, mobileFocus: { x: 1105, y: 540 } },
  ],

  tableTypes,
  tables,
  scenery,

  // Sample bookings: which tables are taken from each time until the next one
  // listed (nothing is taken before the first). The same for every
  // date for now — a real app would load this from the booking system.
  bookings: {
    '6:30 pm': ['W2', 'M1', 'C3', 'T2', 'T6'],
    '7:00 pm': ['W1', 'W5', 'M3', 'B1', 'C2', 'T1', 'F1'],
    '7:30 pm': ['W1', 'M2', 'M4', 'C1', 'C4', 'T3', 'T6', 'F2'],
    '8:00 pm': ['W1', 'W3', 'W4', 'M2', 'M3', 'B2', 'C1', 'C2', 'C5', 'T1', 'T3', 'U1'],
    '8:30 pm': ['W2', 'W3', 'M1', 'B3', 'P1', 'C3', 'T4', 'T5'],
    '9:00 pm': ['W5', 'M4', 'C6', 'F1'],
  },
};
