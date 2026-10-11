# The River Café: table reservation

A table booking experience where guests choose their exact table from a live floor plan, instead of being handed whichever one is free. It is built as a design exploration for The River Café, a restaurant under the Brooklyn Bridge, and works on desktop and phone.

Most reservation tools ask for a date, a time and a party size, then assign a table behind the scenes. This one shows the room. Guests see which tables are free for their time, what each one is like, and what it costs, before they commit.

## What guests can do

### Pick a table on the floor plan

- The whole restaurant is drawn as an interactive map: the dining room, the bar, the private room and the river terrace.
- The map pans by dragging and zooms with the scroll wheel, a pinch, or the on-screen buttons. "Fit" brings the whole plan back into view.
- Every table shows its state at a glance: available, your pick, booked, or the wrong size for the group. A legend explains the colours.
- Hovering a table shows its name and whether it is available.

### Set the details

- **Date:** a calendar that only allows days inside the restaurant's booking window.
- **Time:** hour and minute wheels limited to opening hours, 8:00 am to 10:00 pm.
- **Guests:** a stepper from 1 to the restaurant's maximum party size.
- **Seating area:** indoor dining room or outdoor river terrace. Switching glides the map to that area and fades the tables outside it.

The map responds to every change. Raising the party size greys out tables that are too small, and changing the time updates which tables are booked.

### See what a table offers before booking

Selecting a table opens its card, with:

- a photo slot for the view from that table
- how many it seats
- tags such as "Window", "Skyline view" or "Quiet"
- a short description of where it sits in the room
- the table fee, if there is one, taken as a deposit and deducted from the final bill

A live summary of the reservation (date, time, guests, area, table) stays in view the whole time.

### Recover when a table is taken

If a guest changes the time and their chosen table is already booked then, the app says so plainly, offers to go back to the time that worked, and suggests up to three similar tables that are still free.

### Review, then confirm

"Book reservation" does not book straight away. It opens a review of the full reservation with two choices: edit it, or confirm. This keeps guests from booking by accident and then having to cancel.

Confirming shows the booking reference, the deposit paid and the table highlighted on the map, with a small burst of confetti.

## Desktop and phone

- **Desktop:** the map fills the window, with the booking form floating on the left and the reservation summary on the right.
- **Phone:** the map fills the screen with a bottom sheet. Tapping a table shows a short preview; swiping the sheet up opens the full details and the booking form.

Both follow the device's light or dark theme.

## Current scope

This is a front-end exploration, not a live booking system:

- Table availability comes from sample data and is the same for every date.
- Booking does not take payment, send email, or save anything. Reloading the page starts over.
- Table photos are placeholders until real images are added.
- "Back" and "Add to calendar" are shown but not wired up.

## Run it

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:5173. Add `?theme=dark` or `?theme=light` to the address to force a theme.

## What's in this repository

| Folder | Contents |
| --- | --- |
| `app/` | The React app (Vite). See [app/README.md](app/README.md) for how the code is organised and how to add another restaurant. |
| `project/` | The original HTML design prototypes the app was built from. |
| `chats/` | The design conversation that produced those prototypes. |
