// The single shared state for a reservation.
//
//   date             'YYYY-MM-DD'
//   time             one of restaurant.times, e.g. '7:30 pm'
//   guests           party size
//   area             id of the chosen seating area
//   selectedTableId  the guest's pick, or null
//   step             'select'    picking (mobile: map with the peek sheet)
//                    'review'    checking details (mobile: expanded sheet)
//                    'confirmed' booked
//
// Plus one helper field: previousTime remembers the last time at which the
// picked table WAS free, so the "no longer available" notice can offer
// "Keep W3 at 7:30 pm".
//
// Components never change state directly. They call one of the actions below,
// and the reducer decides what happens. That's what keeps the form, the map
// and the summary in sync: they all read the same object.

import { useMemo, useReducer } from 'react';
import { findTable, fitsGroup, isBooked } from '../lib/reservation.js';
import { todayIso } from '../lib/dates.js';

export function initialReservation(restaurant) {
  return {
    date: todayIso(),
    time: restaurant.defaultTime,
    guests: restaurant.defaultGuests,
    area: restaurant.areas[0].id,
    selectedTableId: null,
    step: 'select',
    previousTime: null,
  };
}

function reducer(state, action) {
  const { restaurant } = action;
  const selected = findTable(restaurant, state.selectedTableId);

  switch (action.type) {
    case 'setDate':
      return { ...state, date: action.date };

    case 'setTime': {
      // If the pick becomes booked at the new time, remember the last time it
      // was still free. If it's free at the new time, there's nothing to undo.
      if (!selected || !isBooked(restaurant, selected.id, action.time)) {
        return { ...state, time: action.time, previousTime: null };
      }
      const wasFree = !isBooked(restaurant, selected.id, state.time);
      return { ...state, time: action.time, previousTime: wasFree ? state.time : state.previousTime };
    }

    case 'setGuests': {
      const guests = Math.min(restaurant.maxGuests, Math.max(1, action.guests));
      // A table that no longer fits the group is un-picked.
      const keep = selected && fitsGroup(selected, guests);
      return { ...state, guests, selectedTableId: keep ? state.selectedTableId : null };
    }

    case 'setArea': {
      const keep = selected && selected.area === action.area;
      return { ...state, area: action.area, selectedTableId: keep ? state.selectedTableId : null };
    }

    case 'selectTable':
      if (state.step === 'confirmed') return state;
      return { ...state, selectedTableId: action.tableId, previousTime: null, step: 'select' };

    case 'restorePreviousTime':
      return { ...state, time: state.previousTime, previousTime: null };

    case 'clearSelection':
      return { ...state, selectedTableId: null, previousTime: null };

    case 'openReview':
      return state.step === 'confirmed' ? state : { ...state, step: 'review' };

    case 'closeReview':
      return state.step === 'confirmed' ? state : { ...state, step: 'select' };

    case 'book': {
      const canBook = selected && !isBooked(restaurant, selected.id, state.time);
      return canBook ? { ...state, step: 'confirmed' } : state;
    }

    case 'changeBooking':
      return { ...state, step: 'review' };

    case 'reset':
      return initialReservation(restaurant);

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Returns [reservation, actions]. `actions` is a set of plain functions such as
// actions.setTime('8:00 pm'), handy to pass straight to buttons.
export function useReservation(restaurant) {
  const [reservation, dispatch] = useReducer(reducer, restaurant, initialReservation);

  const actions = useMemo(() => {
    const send = (type, payload = {}) => dispatch({ type, restaurant, ...payload });
    return {
      setDate: (date) => send('setDate', { date }),
      setTime: (time) => send('setTime', { time }),
      setGuests: (guests) => send('setGuests', { guests }),
      setArea: (area) => send('setArea', { area }),
      selectTable: (tableId) => send('selectTable', { tableId }),
      restorePreviousTime: () => send('restorePreviousTime'),
      clearSelection: () => send('clearSelection'),
      openReview: () => send('openReview'),
      closeReview: () => send('closeReview'),
      book: () => send('book'),
      changeBooking: () => send('changeBooking'),
      reset: () => send('reset'),
    };
  }, [restaurant]);

  return [reservation, actions];
}
