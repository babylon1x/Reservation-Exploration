// Where to draw the chairs around a table top. Positions are relative to the
// table's box, which has `pad` of empty space on every side for the chairs.

const CHAIR_LONG = 26;
const CHAIR_SHORT = 12;

export function chairsFor(table, pad) {
  const { shape, width: w, height: h } = table;

  if (shape === 'stool') return [];

  // Booths: a long bench above and below the table.
  if (shape === 'booth') {
    return [
      { x: pad - 5, y: pad - 20, w: w + 10, h: 16, radius: 8, rotate: 0 },
      { x: pad - 5, y: pad + h + 4, w: w + 10, h: 16, radius: 8, rotate: 0 },
    ];
  }

  // Round tables: chairs spaced evenly around the edge, starting at the top.
  if (shape === 'round') {
    const count = table.chairs;
    const r = w / 2 + 11;
    return Array.from({ length: count }, (_, i) => {
      const angle = -90 + (360 * i) / count;
      const rad = (angle * Math.PI) / 180;
      const cx = pad + w / 2 + r * Math.cos(rad);
      const cy = pad + h / 2 + r * Math.sin(rad);
      return { x: cx - CHAIR_LONG / 2, y: cy - CHAIR_SHORT / 2, w: CHAIR_LONG, h: CHAIR_SHORT, radius: 5, rotate: angle + 90 };
    });
  }

  // Rectangular tables: n chairs spread evenly along each side.
  const sides = table.chairs ?? {};
  const out = [];
  const along = (n, length) => Array.from({ length: n }, (_, i) => (length * (i + 0.5)) / n);
  along(sides.top ?? 0, w).forEach((p) => out.push({ x: pad + p - 13, y: pad - 16, w: CHAIR_LONG, h: CHAIR_SHORT, radius: 5, rotate: 0 }));
  along(sides.bottom ?? 0, w).forEach((p) => out.push({ x: pad + p - 13, y: pad + h + 4, w: CHAIR_LONG, h: CHAIR_SHORT, radius: 5, rotate: 0 }));
  along(sides.left ?? 0, h).forEach((p) => out.push({ x: pad - 16, y: pad + p - 13, w: CHAIR_SHORT, h: CHAIR_LONG, radius: 5, rotate: 0 }));
  along(sides.right ?? 0, h).forEach((p) => out.push({ x: pad + w + 4, y: pad + p - 13, w: CHAIR_SHORT, h: CHAIR_LONG, radius: 5, rotate: 0 }));
  return out;
}

// Empty space around the table top, reserved for chairs.
export const padFor = (table) => (table.shape === 'stool' ? 0 : 24);
