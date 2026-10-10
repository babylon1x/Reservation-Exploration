// The top of the app. It owns the ONE shared reservation state and hands it
// to whichever layout fits the screen.
//
// URL options:
//   ?restaurant=river-cafe   which restaurant data file to show
//   ?theme=dark | light      force a theme (default: follow the device)

import { useEffect, useSyncExternalStore } from 'react';
import { getRestaurant } from './data/restaurants/index.js';
import { useReservation } from './state/useReservation.js';
import DesktopLayout from './layouts/DesktopLayout.jsx';
import MobileLayout from './layouts/MobileLayout.jsx';

const params = new URLSearchParams(window.location.search);

// Re-renders when a CSS media query starts or stops matching.
function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

function useTheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = params.get('theme') ?? (prefersDark ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
}

const restaurant = getRestaurant(params.get('restaurant'));

export default function App() {
  useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [reservation, actions] = useReservation(restaurant);

  useEffect(() => {
    document.title = `Book a table · ${restaurant.name}`;
  }, []);

  const Layout = isMobile ? MobileLayout : DesktopLayout;
  return <Layout restaurant={restaurant} reservation={reservation} actions={actions} />;
}
