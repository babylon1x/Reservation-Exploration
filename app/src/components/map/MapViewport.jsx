// A pannable, zoomable window onto the floor plan, like Google Maps.
//
// The "camera" is three numbers: x and y (where the plan's top-left corner
// sits on screen) and z (zoom). The plan is drawn with
//   transform: translate(x, y) scale(z)
// so a point on the plan lands on screen at (planX * z + x, planY * z + y).
//
// Gestures:  drag = pan · wheel / trackpad pinch = zoom at the cursor ·
//            two-finger pinch = zoom between the fingers.
//
// The parent controls it through a ref, e.g. mapRef.current.centerOn(point).
// `insets` tells it how much of the screen the floating panels cover, so
// "centre" and "fit" mean the visible part of the map, not behind a panel.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag

const NO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

const MapViewport = forwardRef(function MapViewport(
  { planSize, insets = NO_INSETS, minZoom = 0.3, maxZoom = 2, children },
  ref,
) {
  const el = useRef(null);
  const size = useRef({ width: 0, height: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0, z: 1, animate: false });
  const cam = useRef(camera); // latest camera, for gesture handlers
  cam.current = camera;
  const insetsRef = useRef(insets);
  insetsRef.current = insets;

  const clampZoom = useCallback((z) => Math.min(maxZoom, Math.max(minZoom, z)), [minZoom, maxZoom]);

  // Zoom by factor f, keeping the screen point (px, py) fixed under the cursor.
  const zoomAround = useCallback(
    (f, px, py, animate) => {
      const c = cam.current;
      const z = clampZoom(c.z * f);
      setCamera({ x: px - ((px - c.x) * z) / c.z, y: py - ((py - c.y) * z) / c.z, z, animate });
    },
    [clampZoom],
  );

  const visibleCentre = () => {
    const i = insetsRef.current;
    const { width, height } = size.current;
    return { x: i.left + (width - i.left - i.right) / 2, y: i.top + (height - i.top - i.bottom) / 2 };
  };

  // What the parent can call.
  useImperativeHandle(ref, () => ({
    centerOn(point, zoom = cam.current.z, { animate = true } = {}) {
      const c = visibleCentre();
      const z = clampZoom(zoom);
      setCamera({ x: c.x - point.x * z, y: c.y - point.y * z, z, animate });
    },
    zoomIn() {
      const c = visibleCentre();
      zoomAround(1.2, c.x, c.y, true);
    },
    zoomOut() {
      const c = visibleCentre();
      zoomAround(1 / 1.2, c.x, c.y, true);
    },
    fit() {
      const i = insetsRef.current;
      const { width, height } = size.current;
      const z = Math.min((width - i.left - i.right) / planSize.width, (height - i.top - i.bottom) / planSize.height);
      const c = visibleCentre();
      setCamera({ x: c.x - (planSize.width / 2) * z, y: c.y - (planSize.height / 2) * z, z, animate: true });
    },
  }));

  // Measure before the parent's effects run, so centerOn() works on first load.
  useLayoutEffect(() => {
    const measure = () => {
      const r = el.current.getBoundingClientRect();
      size.current = { width: r.width, height: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.current);
    return () => ro.disconnect();
  }, []);

  // ── Wheel and trackpad zoom ──
  // Added by hand (not onWheel) because React's wheel listener can't stop the
  // page from scrolling or the browser from zooming.
  useEffect(() => {
    const node = el.current;
    const onWheel = (e) => {
      e.preventDefault();
      const r = node.getBoundingClientRect();
      const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
      zoomAround(f, e.clientX - r.left, e.clientY - r.top, false);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [zoomAround]);

  // ── Drag to pan, two fingers to pinch ──
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);

  const local = (e) => {
    const r = el.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const startGesture = () => {
    const pts = [...pointers.current.values()];
    const c = cam.current;
    if (pts.length === 1) {
      gesture.current = { kind: 'pan', start: pts[0], cam: c };
    } else if (pts.length === 2) {
      const [a, b] = pts;
      gesture.current = {
        kind: 'pinch',
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        cam: c,
      };
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, local(e));
      const g = gesture.current;
      if (!g) return;
      const pts = [...pointers.current.values()];
      if (g.kind === 'pan') {
        const dx = pts[0].x - g.start.x;
        const dy = pts[0].y - g.start.y;
        if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        moved.current = true;
        setDragging(true);
        setCamera({ x: g.cam.x + dx, y: g.cam.y + dy, z: g.cam.z, animate: false });
      } else if (g.kind === 'pinch' && pts.length >= 2) {
        moved.current = true;
        const [a, b] = pts;
        const z = clampZoom((g.cam.z * Math.hypot(a.x - b.x, a.y - b.y)) / g.dist);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        // Keep the plan point that was under the fingers' midpoint under it.
        const px = (g.mid.x - g.cam.x) / g.cam.z;
        const py = (g.mid.y - g.cam.y) / g.cam.z;
        setCamera({ x: mid.x - px * z, y: mid.y - py * z, z, animate: false });
      }
    };
    const onUp = (e) => {
      if (!pointers.current.delete(e.pointerId)) return;
      if (pointers.current.size === 0) {
        gesture.current = null;
        setDragging(false);
      } else {
        startGesture(); // e.g. lifted one finger of a pinch: carry on panning
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [clampZoom]);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (pointers.current.size === 0) moved.current = false;
    pointers.current.set(e.pointerId, local(e));
    startGesture();
  };

  // A drag that starts on a table must not pick it when the finger lifts.
  const onClickCapture = (e) => {
    if (moved.current) {
      e.stopPropagation();
      e.preventDefault();
      moved.current = false;
    }
  };

  return (
    <div
      ref={el}
      className={`map-viewport${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onClickCapture={onClickCapture}
    >
      <div
        className={`map-viewport__layer${camera.animate ? ' is-animating' : ''}`}
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.z})` }}
      >
        {children}
      </div>
    </div>
  );
});

export default MapViewport;
