# Planet Explorer — Design

## Goal
An interactive website that teaches a 6–8-year-old early reader about the Sun and the 8 planets. Works on tablets (touch) and computers (mouse). Runs offline by opening `index.html`; no install, accounts, or external assets.

## Tech
Plain HTML/CSS/JS, no build step, no dependencies. Planets are drawn with CSS gradients (no image files).

## Files
- `index.html` — page shell and tab buttons
- `styles.css` — all styling
- `data.js` — planet facts, sizes, gravity, quiz questions (single place to edit content)
- `app.js` — tab switching, read-aloud helper, planet-drawing helper
- `explore.js` — orbiting solar system + fact card
- `compare.js` — size comparison + weight calculator
- `fly.js` — Fly with Bruno rocket trips
- `quiz.js` — quiz game
- `stickers.js` — sticker book and "New sticker!" pop-ups

## Tabs
1. **Explore** — Sun in the middle, planets orbiting (pause/play button). Tap a body → large fact card: name, drawing, "Planet #N from the Sun" badge, 3–4 short facts, 🔊 read-aloud, ◀ ▶ to move between bodies, ✕ to close.
2. **Compare**
   - Size: pick two bodies (incl. Sun); both drawn at true relative diameter; sentence "Jupiter is about 11 times wider than Earth."
   - Weight: slider for your weight (lb/kg toggle); grid shows your weight on each body with a fun comment.
3. **Quiz** — 8 random questions per round from a bank of ~25. 3 big answer buttons (planet picture + name, or text). Right → ⭐ + cheer; wrong → "Try again!" (can retry; star only on first try). End screen shows stars; best score saved in `localStorage`.

4. **Fly** — pick a destination (Sun, Moon, planets, Pluto); Bruno's rocket flies there from Earth (longer trips take a bit longer, about 1.5s for the Moon up to 5s for Pluto). Shows the distance in km and miles (NASA closest-approach figures, `fromEarthKm`) and trip times by walking (5 km/h), car (100 km/h), airplane (900 km/h) and rocket (40,000 km/h), from `TRAVEL` in `data.js`.
5. **Stickers** — a stamp for each body visited (Sun, 8 planets, Moon, Pluto) plus badges: Super Explorer (all visited), Size Detective, Space Scale, Space Traveler (first trip), Grand Tour (fly everywhere), First Quiz, Star Catcher (5+ stars), Space Expert (8/8), Quiz Champ (3 rounds). Locked stickers show a hint. Saved in `localStorage`.

## Moon and Pluto
The Moon (`orbits: "earth"`) circles Earth in Explore. Pluto (`dwarf: true`) has a dotted outer orbit and a "dwarf planet" badge. Both appear in Compare and the quiz. Moon gravity 0.166, Pluto 0.063.

## Bruno reacts
Bruno's bubble changes (with a small pop) when a fact card opens (each body has a `bruno` line), when sizes or weights are compared, on right/wrong quiz answers, and at the end of a quiz.

## Motion
- Each body has `features` (surface spots, drawn with the `spot()` helper) layered over its base `look`. On the fact card, the features scroll across the planet so it looks like it's spinning; edge shading makes it look round. Venus spins backward (`spin: "backward"`) and Uranus rolls sideways (`spin: "sideways"`).
- The fact card zooms in when opened; with ◀ ▶ the next planet flies in from that side. The Sun's glow pulses.
- Two layers of twinkling stars sit behind the page.
- All of this is turned off with `prefers-reduced-motion`.

## Read-aloud
`speechSynthesis` with rate 0.85. 🔊 buttons on fact cards and quiz questions. Hidden if the browser lacks support.

## Kid-friendly rules
Tap targets ≥ 60px, rounded large font, no outbound links, no hover-only interactions.

## Data sources
Diameters and surface gravity from NASA planetary fact sheets. Gravity relative to Earth: Mercury 0.38, Venus 0.91, Earth 1, Mars 0.38, Jupiter 2.53, Saturn 1.07, Uranus 0.89, Neptune 1.14, Sun 27.9.

## Testing
Open in a browser at tablet and desktop widths; click through each tab, open each planet card, run a full quiz round, verify weight math, check no console errors.
