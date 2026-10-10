(function () {
  const K = {
    window: { name: 'Window table', min: 1, max: 2, fee: 75, shape: 'rect', w: 46, h: 46, chairs: { l: 1, r: 1 }, area: 'indoor', photo: 'view-window', hint: 'View from a window table to the Manhattan skyline at dusk' },
    main: { name: 'Dining table', min: 2, max: 4, fee: 0, shape: 'round', w: 66, h: 66, round: 4, area: 'indoor', photo: 'view-main', hint: 'Centre of the dining room under the brass pendants' },
    booth: { name: 'Booth', min: 4, max: 6, fee: 50, shape: 'booth', w: 96, h: 50, area: 'indoor', photo: 'view-booth', hint: 'Leather booth against the east wall' },
    private: { name: 'Private room', min: 6, max: 10, fee: 250, shape: 'rect', w: 64, h: 170, chairs: { l: 4, r: 4, t: 1, b: 1 }, area: 'indoor', photo: 'view-private', hint: 'Private room with the oak doors closed' },
    bar: { name: 'Bar seat', min: 1, max: 1, fee: 0, shape: 'stool', w: 30, h: 30, area: 'indoor', photo: 'view-bar', hint: 'Bar counter and back bar from a stool' },
    edge: { name: 'River edge table', min: 1, max: 2, fee: 75, shape: 'rect', w: 46, h: 46, chairs: { l: 1, r: 1 }, area: 'outdoor', photo: 'view-edge', hint: 'Terrace edge right above the water' },
    terrace: { name: 'Terrace table', min: 2, max: 4, fee: 0, shape: 'rect', w: 62, h: 62, chairs: { t: 1, b: 1, l: 1, r: 1 }, area: 'outdoor', photo: 'view-terrace', hint: 'Terrace under the string lights' },
    umbrella: { name: 'Umbrella table', min: 3, max: 5, fee: 50, shape: 'round', w: 74, h: 74, round: 5, area: 'outdoor', photo: 'view-umbrella', hint: 'Round table under the canvas umbrella' },
    firepit: { name: 'Firepit table', min: 1, max: 2, fee: 50, shape: 'rect', w: 44, h: 44, chairs: { t: 1, b: 1 }, area: 'outdoor', photo: 'view-firepit', hint: 'Lounge chairs beside the firepit after dark' }
  };
  const T = (code, kind, x, y, tags, desc) => Object.assign({}, K[kind], { code, kind, x, y, tags, desc });
  const tables = [
    T('W1', 'window', 330, 625, ['Window', 'Skyline view', 'Corner'], 'Corner of the glass wall beside the wine cellar, with a wide view of the Brooklyn Bridge.'),
    T('W2', 'window', 435, 625, ['Window', 'Skyline view'], 'Right against the glass, looking straight across the East River to Lower Manhattan.'),
    T('W3', 'window', 540, 625, ['Window', 'Skyline view'], 'Centre of the glass wall, facing the water. The best seat in the room for sunset.'),
    T('W4', 'window', 645, 625, ['Window', 'Skyline view'], 'Skyline view framed by the terrace planters, a few steps from the bar.'),
    T('W5', 'window', 750, 625, ['Window', 'Skyline view'], 'Last window table before the terrace doors, where the evening breeze comes in.'),
    T('M1', 'main', 410, 300, ['Central'], 'Under the brass pendants at the heart of the room, close to the private room.'),
    T('M2', 'main', 590, 300, ['Central', 'Near the bar'], 'Facing the bar, livelier once the late service starts.'),
    T('M3', 'main', 410, 450, ['Central'], 'Mid-room with a clear line of sight to the river windows.'),
    T('M4', 'main', 590, 450, ['Central'], 'Between the booths and the windows, a calm spot for a long dinner.'),
    T('B1', 'booth', 790, 262, ['Booth', 'Quiet'], 'Leather banquette against the east wall, curtained on one side.'),
    T('B2', 'booth', 790, 372, ['Booth', 'Quiet'], 'The middle booth and the quietest corner of the room.'),
    T('B3', 'booth', 790, 482, ['Booth', 'Partial view'], 'Closest to the terrace doors, with a partial view of the water.'),
    T('P1', 'private', 154, 385, ['Private', 'Own server', 'Seats 6–10'], 'Behind sliding oak doors, with its own server and the sommelier on request.'),
    ...[615, 660, 705, 750, 795, 840].map((x, i) => T('C' + (i + 1), 'bar', x, 170, ['Bar counter', 'Solo friendly'], 'Front row at the counter, facing the bartenders and the back bar.')),
    T('F1', 'firepit', 940, 190, ['Outdoor', 'Firepit'], 'Low lounge chairs on the west side of the firepit. Best after dark.'),
    T('F2', 'firepit', 1120, 190, ['Outdoor', 'Firepit'], 'Beside the firepit with the river breeze at your back.'),
    T('U1', 'umbrella', 1300, 205, ['Outdoor', 'Umbrella'], 'Large round table under a canvas umbrella, shaded at lunch and lit at night.'),
    T('T5', 'terrace', 965, 410, ['Outdoor', 'String lights'], 'Under the string lights in the middle of the terrace.'),
    T('T6', 'terrace', 1110, 410, ['Outdoor', 'String lights'], 'Centre of the terrace, a short walk from the firepit.'),
    T('T7', 'terrace', 1255, 410, ['Outdoor', 'String lights'], 'East side of the terrace, framed by the planters.'),
    T('T1', 'edge', 945, 615, ['Outdoor', 'River edge'], 'On the terrace edge right above the water.'),
    T('T2', 'edge', 1065, 615, ['Outdoor', 'River edge'], 'On the terrace edge with an open view across the river.'),
    T('T3', 'edge', 1185, 615, ['Outdoor', 'River edge'], 'On the terrace edge, closest to the jetty lights.'),
    T('T4', 'edge', 1305, 615, ['Outdoor', 'River edge', 'Corner'], 'The far corner of the terrace, water on two sides.')
  ];
  const booked = {
    '6:30 pm': ['W2', 'M1', 'C3', 'T2', 'T6'],
    '7:00 pm': ['W1', 'W5', 'M3', 'B1', 'C2', 'T1', 'F1'],
    '7:30 pm': ['W1', 'M2', 'M4', 'C1', 'C4', 'T3', 'T6', 'F2'],
    '8:00 pm': ['W1', 'W3', 'W4', 'M2', 'M3', 'B2', 'C1', 'C2', 'C5', 'T1', 'T3', 'U1'],
    '8:30 pm': ['W2', 'W3', 'M1', 'B3', 'P1', 'C3', 'T4', 'T5'],
    '9:00 pm': ['W5', 'M4', 'C6', 'F1']
  };
  const fmt = n => '$' + n.toLocaleString('en-US');
  const seats = t => (t.max <= 2 || t.min === t.max) ? 'Seats ' + t.max : 'Seats ' + t.min + '–' + t.max;
  const summary = (st) => {
    const b = booked[st.time] || [];
    const fit = tables.filter(t => t.area === st.area && st.guests >= t.min && st.guests <= t.max && !b.includes(t.code));
    const n = fit.length;
    const where = st.area === 'indoor' ? 'in the dining room' : 'on the terrace';
    const g = st.guests + (st.guests === 1 ? ' guest' : ' guests');
    return { n, fit, line: (n === 0 ? 'No tables fit ' : n + (n === 1 ? ' table fits ' : ' tables fit ')) + g + ' ' + where + ' at ' + st.time };
  };
  window.OSA_DATA = {
    tables, booked, fmt, seats, summary,
    times: ['6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm'],
    byCode: c => tables.find(t => t.code === c),
    isBooked: (code, time) => (booked[time] || []).includes(code)
  };
})();
