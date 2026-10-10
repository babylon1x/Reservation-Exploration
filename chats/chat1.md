# Osa House Table Selection

_Started 2026-10-09 13:49 UTC_

---

## User

Design a set of screens for a visual table reservation widget for high-end restaurants. Instead of booking blind (just date, time, guests, indoor/outdoor), guests see a top-down floor plan of the restaurant and pick the exact table they want, like choosing a seat on a flight.

Use a fictional restaurant: Osa House, a fine-dining restaurant on the lagoon in Victoria Island, Lagos. It has an indoor dining room (window tables facing the lagoon, central 4-seat tables, booths, a bar counter with single seats, and a private room for 6–10 guests) and an outdoor terrace (2-seat tables on the edge, 4-seat tables, a 5-seat umbrella table, and 2-seat tables by a firepit). Currency is Naira (₦). Some tables carry a table fee, e.g. window tables ₦15,000, booths ₦10,000, private room ₦50,000, charged as a deposit off the final bill.

DESKTOP LAYOUT (1440 x 900)
- The floor plan fills the whole screen as a pannable, zoomable map, like Google Maps. Walls, windows, entrance, bar, kitchen, terrace decking and plants are drawn in a simple, clean architectural style. Each table shows its shape, its chairs, and a short code (W1, M3, B2, P1, T5).
- Left floating panel: restaurant name and location, a back button, date, time, number of guests (stepper), seating area as two radio cards (Indoor · Dining room / Outdoor · Lagoon terrace), a line like "6 tables fit 2 guests in the dining room at 7:30 pm", and a primary "Book reservation" button.
- Right floating panel: live preview of the reservation. Date, time, guests and area mirror the left panel instantly. When a table is selected it shows a table card: name, code, seats, tags (Window, Lagoon view, Booth, etc.), a one-line description, a photo of the view from that table, and the table fee.
- A small legend at the top centre of the map: Available, Your pick, Booked, Wrong size. Zoom controls (+, −, Fit) at the bottom centre.

TABLE STATES (show these clearly on the map)
- Available: fits the group and is free
- Hovered: with a tooltip ("W2 · Window table · Available")
- Selected: strong accent colour, clearly the user's pick
- Booked: greyed out
- Wrong size for the group: dashed outline, faded
- In the other area: heavily faded

SCREENS TO GENERATE
1. Desktop – default state: dining room in view, no table picked, right panel invites the user to pick a table.
2. Desktop – table selected: a window table selected, right panel shows the full table card with photo and ₦15,000 fee.
3. Desktop – group of 6: only the booths and private room are available, everything else faded or dashed.
4. Desktop – table no longer available: the user changed the time and their table is now booked; an inline notice in the right panel explains it and asks them to pick another.
5. Desktop – booking confirmed: success state with a reference number, the booked table highlighted on the map, a "Change booking" option.
6. Mobile (390 x 844) – map full screen with Google Maps-style interaction, a compact bottom sheet peeking at the bottom showing the selected table and a "Review" button.
7. Mobile – bottom sheet expanded with the form and the reservation preview.
8. Mobile – booking confirmed.

VISUAL DIRECTION
Calm, premium and quiet, fitting a five-star restaurant. Light neutral background with a slight green-grey tint for the floor plan. One deep aubergine accent for selection and the primary button, sage green for available tables, and a muted brass for small details. A characterful serif for the restaurant name and headings, a clean sans-serif for UI text, and a monospace for table codes. Soft shadows only on the floating panels. Rounded corners, generous spacing, no clutter. Also provide a dark mode version of screen 2.

Use realistic content throughout, never placeholder text.

## Assistant

_[tool: list_files]_

_[tool: read_skill_prompt]_

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: dc_write]_

_[tool: run_script]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I've put all eight Osa House screens, plus a dark version of screen 2, on one canvas: desktop 01–05 with 02D, then mobile 06–08. It's out for a final check now.

- **Every frame is clickable.** You can pan and zoom the map, hover and pick tables, change the time, guest count and seating area, and book. Moving W3 to 8:00 pm brings up the "no longer available" notice, which offers to keep W3 at 7:30 pm or suggests tables that are still free.
- **Map states:** available, hovered (with a tooltip), selected, booked, wrong size (dashed and faded), and heavily faded for the other area.
- **Photos:** I can't generate images, so the view photos are empty slots, one for each table type. Drag a real photo onto a slot and it shows up on every screen that uses it.
- **Fonts:** Gloock for the name and headings, Hanken Grotesk for UI text, IBM Plex Mono for table codes. The project didn't include a design system, so I followed your brief for colours and type.
- **Dark mode** is a separate copy of screen 2. Changes to the light version won't carry over to it automatically.
- **Made-up details:** the confirmation email (adaeze.okafor@gmail.com), the reference number (OSA-1016-W3K7), and fees for tables you didn't price. Lagoon-edge terrace tables are ₦15,000, the umbrella and firepit tables are ₦10,000, and the rest have no fee.

## User

use SF pro for the entire typeface

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

All screens now use SF Pro, including dark mode and the overview page. Headings use semibold with slightly tighter spacing to stand in for the old serif, and table codes use fixed-width numbers. I haven't looked at the screens since the change, and the page timed out while loading when I opened it.

SF Pro shows up on Apple devices. It can't be loaded from the web, so on Windows and Android the screens fall back to that system's own font.

## User

create a color pallete from these key colors {Primary: #B32020, Secondary: #F2655E, Neutral:#101010}

assign tokens to each palette as per latest and normal design standards. then apply the color scheme to the design.

for typography, add a script font e>g "indie flower" for that natural feel, this can be used for very special texts e.g "booked"

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I built the colour palette, applied it to every screen including dark mode, and added Indie Flower for the booked moments. It's out for a final check now.

- **Scales:** primary, secondary and neutral each run from 50 to 950. The neutral scale also has a 0, which is white. Your key colours sit at primary-600 (#B32020), secondary-400 (#F2655E) and neutral-950 (#101010). A new section 2 at the top of the canvas shows all the swatches.
- **Semantic tokens:** each one has a light and a dark value. They cover backgrounds, borders, text, buttons, table states and floor-plan elements such as walls, water and decking. The dark versions of the desktop and floor-plan screens were rebuilt from the new light versions.
- **What changed on the screens:** red marks selected tables and the main button. Available tables are now coral instead of sage, booked tables and the floor plan are grey, and the small details that were brass are now a deeper coral.
- **Indie Flower** is used only in three places: the "Your table is booked" heading, the "Booked for you" badge, and the booked label on the map once a booking is confirmed.

The palette has no green or blue. That means the lagoon is now grey, and available tables are a pale coral that sits fairly close to the red used for selection. If you want a clearer difference, I can add one extra colour just for "available" or for the water.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The palette section is now a fixed 1440px wide, matching the screen frames below it. On narrow previews you pan to it like the other screens instead of it squeezing. That fixes the token table overlapping the typography card and the swatch labels getting cut off. It's out for a final check now.

## User

remove indie flower completely, that was a bad idea.

change primary key color to #E82E00 and secondary key color to #F2995E

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Indie Flower is gone everywhere, and the booked texts are back in SF Pro. The primary scale is rebuilt around #E82E00 and the secondary scale around #F2995E, with the same token names. Both are applied to every screen, dark mode and the palette section. It's out for a final check now.

White text on #E82E00 is a little under the usual contrast target for readable text (about 4:1 against 4.5:1). This affects the main button and selected table codes. I kept your exact colour; if you want, I can use primary-700 (#BF2600) for the button fill only.

## User

use a popular usa restaurant and address.

give me an interactive prototype to test

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: dc_write]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I switched the restaurant to The River Café, 1 Water St, Brooklyn, NY, and built a prototype you can test. It's in **River Cafe Prototype.dc.html** and is out for a final check now.

- **The prototype:** it starts with no table picked and scales to fit your window. You can switch between Desktop, Mobile and Desktop dark, and Restart takes you back to the beginning. A line at the bottom tells testers what to try.
- **Rebranded content:** the map now shows Water Street and the East River with a river terrace, and table descriptions mention the Manhattan skyline and the Brooklyn Bridge. Prices are in dollars, and the booking reference and confirmation email are updated. The canvas of screens is updated the same way.
- **Table fees:** window and river-edge tables are $75, booths, firepit and umbrella tables are $50, and the private room is $250. I picked these amounts.

The floor plan, fees and table details are made up, not The River Café's real layout. The internal file names still say "Osa".

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The instructions on every screen now say "available table" instead of "green" or "coral". That covers the desktop and dark desktop screens, the mobile peek sheet and the help line under the prototype. The prototype loads with no errors.

## User

- why is there an option to upload image?
- date picker not working.
- showing number of guests online isnt necessary, the guest side is to specify the number of guests you are reserving for.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

All three are fixed on desktop, dark mode and mobile. A final check is running now.

- **Image upload:** that was a slot for you to drop in real photos of each table's view, since I can't generate images. It's now a plain striped box with a caption describing the view, and it can't be uploaded to. Send me real photos and I'll put them in.
- **Date picker:** clicking the date now opens a calendar from today (10 October) to the end of December. Earlier dates can't be picked, and you can move between months. The chosen date updates the reservation preview, the confirmation and the reference number. Table availability is the same on every date for now.
- **Guests:** I removed the "Up to 10 online" line, so the guests field is just the label and the stepper.

