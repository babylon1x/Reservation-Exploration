// A short burst of confetti out of an element: pieces fly out from its
// centre, then drift down and fade. Drawn in a layer on top of the whole page
// so the panel it starts in doesn't clip it. Purely decorative: it ignores
// the pointer, is hidden from screen readers, and is skipped for guests who
// ask their device for reduced motion.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const PIECES = 44;
const START_AFTER = 250; // ms, so the element has appeared and settled first
const LASTS = 3200; // ms until the layer is removed again
const COLOURS = ['--primary-600', '--primary-400', '--primary-200', '--secondary-500', '--secondary-300', '--text-primary'];

// Repeatable "random" numbers between 0 and 1, so every burst looks the same.
const scatter = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const pieces = Array.from({ length: PIECES }, (_, i) => {
  // Spread around the full circle, leaning upwards like a popper.
  const angle = (i / PIECES) * Math.PI * 2 + scatter(i, 1) * 0.5;
  const reach = 46 + scatter(i, 2) * 84;
  return {
    '--dx': `${Math.cos(angle) * reach}px`,
    '--dy': `${Math.sin(angle) * reach - 34}px`,
    '--fall': `${70 + scatter(i, 3) * 90}px`,
    '--drift': `${(scatter(i, 4) - 0.5) * 50}px`,
    '--spin': `${(scatter(i, 5) - 0.5) * 900}deg`,
    '--colour': `var(${COLOURS[i % COLOURS.length]})`,
    width: 5 + scatter(i, 6) * 5,
    height: 5 + scatter(i, 7) * 7,
    borderRadius: i % 3 === 0 ? '50%' : 2,
    animationDuration: `${1900 + scatter(i, 8) * 1100}ms`,
    animationDelay: `${scatter(i, 9) * 90}ms`,
  };
});

// `anchor` is a ref to the element the confetti bursts from.
export default function Confetti({ anchor }) {
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let done;
    const start = setTimeout(() => {
      const r = anchor.current.getBoundingClientRect();
      const left = r.left + r.width / 2;
      // Match the layout's CSS zoom, and lean the burst away from the window
      // edge when the element sits close to it, so pieces don't fly off screen.
      const scale = r.width / anchor.current.offsetWidth || 1;
      const lean = Math.min(60, Math.max(0, 110 - left / scale));
      setOrigin({ left, top: r.top + r.height / 2, transform: `scale(${scale})`, '--lean': `${lean}px` });
      done = setTimeout(() => setOrigin(null), LASTS);
    }, START_AFTER);
    return () => {
      clearTimeout(start);
      clearTimeout(done);
    };
  }, [anchor]);

  if (!origin) return null;
  return createPortal(
    <div className="confetti" style={origin} aria-hidden="true">
      {pieces.map((style, i) => <span key={i} className="confetti__piece" style={style} />)}
    </div>,
    document.body,
  );
}
