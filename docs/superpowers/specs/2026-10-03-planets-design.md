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
- `quiz.js` — quiz game

## Tabs
1. **Explore** — Sun in the middle, planets orbiting (pause/play button). Tap a body → large fact card: name, drawing, "Planet #N from the Sun" badge, 3–4 short facts, 🔊 read-aloud, ◀ ▶ to move between bodies, ✕ to close.
2. **Compare**
   - Size: pick two bodies (incl. Sun); both drawn at true relative diameter; sentence "Jupiter is about 11 times wider than Earth."
   - Weight: slider for your weight (lb/kg toggle); grid shows your weight on each body with a fun comment.
3. **Quiz** — 8 random questions per round from a bank of ~25. 3 big answer buttons (planet picture + name, or text). Right → ⭐ + cheer; wrong → "Try again!" (can retry; star only on first try). End screen shows stars; best score saved in `localStorage`.

## Read-aloud
`speechSynthesis` with rate 0.85. 🔊 buttons on fact cards and quiz questions. Hidden if the browser lacks support.

## Kid-friendly rules
Tap targets ≥ 60px, rounded large font, no outbound links, no hover-only interactions.

## Data sources
Diameters and surface gravity from NASA planetary fact sheets. Gravity relative to Earth: Mercury 0.38, Venus 0.91, Earth 1, Mars 0.38, Jupiter 2.53, Saturn 1.07, Uranus 0.89, Neptune 1.14, Sun 27.9.

## Testing
Open in a browser at tablet and desktop widths; click through each tab, open each planet card, run a full quiz round, verify weight math, check no console errors.
