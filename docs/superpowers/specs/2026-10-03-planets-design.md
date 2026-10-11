# Planet Explorer — Design

## Goal
An interactive website, in English and Spanish, that teaches a 6–8-year-old early reader about the Sun, the 8 planets, the Moon and Pluto, guided by Astronaut Bruno. Works on tablets (touch), phones and computers (mouse). Runs offline by opening `index.html`; no install, accounts, or external assets. Hosted on GitHub Pages (https://mariotristan.github.io/planets/), where it can also be installed on a tablet or phone home screen and works offline after the first visit.

## Tech
Plain HTML/CSS/JS, no build step, no dependencies. Planets are drawn with CSS gradients and the rocket sound is synthesized with the Web Audio API, so there are no image or sound files.

## Files
- `index.html` — page shell, tab buttons, Astronaut Bruno (inline SVG), rocket (inline SVG)
- `styles.css` — all styling
- `data.js` — single place to edit content: bodies (facts, sizes, gravity, distances, looks, Bruno's lines), travel speeds, quiz questions; each has an `es` part with its Spanish words
- `i18n.js` — the language switch and every other word kids see, in English and Spanish (`UI.en` / `UI.es`)
- `app.js` — tab switching, read-aloud helper, Bruno's speech bubble, planet-drawing helper
- `explore.js` — orbiting solar system + fact card
- `compare.js` — size comparison + weight calculator
- `fly.js` — Fly with Bruno rocket trips and the rocket sound
- `quiz.js` — quiz game
- `stickers.js` — sticker book and "New sticker!" pop-ups
- `manifest.webmanifest` — app name, icons and colors for installing
- `sw.js` — service worker that saves all files for offline use
- `icons/` — `icon.svg` (source artwork and favicon) and the PNG app icons rendered from it

## Tabs
Tab order: Explore, Compare, Fly, Quiz, Stickers.

1. **Explore** — Sun in the middle, planets orbiting (pause/play button). The Moon circles Earth; Pluto has a dotted outer orbit. Tap a body → large fact card: name, spinning drawing, badge ("Planet #N from the Sun", or a custom badge for the Sun, Moon and Pluto), 4 short facts, 🔊 read-aloud, ◀ ▶ (and arrow keys) to move between bodies, ✕ / Escape / tapping outside to close.
2. **Compare**
   - Size: pick two bodies (all 11); both drawn at true relative diameter; sentence "Jupiter is about 11 times wider than Earth."
   - Weight: slider for your weight (lb/kg toggle); grid shows your weight on each body with a fun comment.
3. **Fly** — pick a destination (Sun, Moon, planets, Pluto); Bruno's rocket flies there from Earth along a dotted path with a flickering flame and an engine sound. Longer trips take a bit longer (about 1.5s for the Moon up to 5s for Neptune/Pluto). On landing it shows the distance in km and miles and trip times by walking, car, airplane and rocket; times over 80 years say "Longer than a whole lifetime!" Destination buttons are disabled during a flight.
4. **Quiz** — 8 random questions per round from a bank of 30. 3 big answer buttons (planet picture + name, or text). Right → ⭐ + cheer; wrong → "Try again!" (can retry; star only on first try). End screen shows stars; best score and number of rounds played saved in `localStorage`.
5. **Stickers** — 20 stickers: a stamp for each of the 11 bodies (earned by opening its fact card) plus badges: Super Explorer (all 11 visited), Size Detective (compare sizes), Space Scale (move the weight slider), Space Traveler (first trip), Grand Tour (fly to all 10 destinations), First Quiz, Star Catcher (5+ stars in a round), Space Expert (8/8), Quiz Champ (3 rounds). Locked stickers show a ❓ and a hint. Earning one shows a "New sticker!" pop-up; several queue one after another (about 2.8s each). The pop-up never blocks taps on what's underneath.

## Languages (English / Español)
- An **English | Español** switch sits at the top right of the header (centered on phones). The choice is saved in `localStorage` (`planetLang`); on the first visit the app uses Spanish if the browser's language starts with `es`, otherwise English.
- Switching takes effect right away, with no reload and nothing lost: the open fact card, the planet pickers, the landed trip, the current quiz question (same answer order, wrong tries and stars kept) and the quiz end screen redraw in the new language, and Bruno says the current tab's intro. While a fact card is open the switch is behind it; close the card first.
- Spanish is neutral Latin American ("carro", "manejar", "stickers"), with numbers written as in Mexico (`es-MX`: 1,000 and 4.3). Large distances use "millones" and "mil millones" (a Spanish "billón" is a million millions). The Sun, Moon and Earth take "el"/"la" (`the` in their `es` data), so sentences say "al Sol", "de la Luna", "la Tierra es… más ancha". Lines that talk to the child avoid gendered words (e.g. "pesarías más", not "te sentirías pesado").
- How to translate: body text and quiz questions live in `data.js` (`es: { name, the, badge, facts, weightJoke, bruno }`; quiz `es: { q, answers }` with text answers in the same order as `answers`; planet-id and number answers need no translation). Travel names have `es: { name }`; badge sticker names and hints have `es` in `stickers.js`. Everything else is in `i18n.js`; sentences that include numbers or planets are functions. Static words in `index.html` use `data-i18n` (text) and `data-i18n-label` (aria-label). Each tab redraws its words on the `langchange` event.
- The page `lang` attribute and title follow the language. The install name in `manifest.webmanifest` stays English.

## Moon and Pluto
The Moon (`orbits: "earth"`) circles Earth in Explore on a small orbit just outside Earth's tap area; where they overlap, Earth gets the tap. Pluto (`dwarf: true`) has a dotted outer orbit and the badge "A dwarf planet!". Both appear in Compare, Fly and the quiz.

## Astronaut Bruno
- Floats and waves in the header next to a speech bubble; tap him to hear the bubble read aloud.
- Each tab has an intro line.
- He reacts (the bubble pops slightly when it changes):
  - Fact card opens → that body's `bruno` line.
  - Compare → a reaction to the size difference; after letting go of the weight slider, the heaviest vs. lightest weight (excluding the Sun).
  - Fly → "Hold on tight!" at blast-off, then the car trip time on landing (the Sun: "We can't land on the Sun — way too hot!").
  - Quiz → encouragement on right and wrong answers, and a result line at the end.

## Motion
- Each body has `features` (surface spots, drawn with the `spot()` helper) layered over its base `look`. On the fact card, the features scroll across the planet so it looks like it's spinning; edge shading makes it look round. Venus spins backward (`spin: "backward"`) and Uranus rolls sideways (`spin: "sideways"`).
- The fact card zooms in when opened; with ◀ ▶ the next planet flies in from that side. The Sun's glow pulses.
- Two layers of twinkling stars sit behind the page.
- Each planet starts at a fixed angle around the Sun (multiples of the golden angle, 137.5°, so they're spread out).

### Reduced motion (`prefers-reduced-motion`)
- Planets don't orbit; they sit still at their fixed angles with upright labels, and the Pause button is hidden.
- No spinning, zooming, flying-in, twinkling, glow pulse, bubble pop or flame flicker; Bruno doesn't float or wave.
- In Fly, the rocket arrives instantly (the engine sound still plays for about 1.2s).

## Sound
- **Read-aloud:** `speechSynthesis` with rate 0.85 and pitch 1.1, in the current language (`en-US` or `es-MX`; the browser picks a voice for it). 🔊 buttons on fact cards and quiz questions; quiz cheers and the end-of-quiz result are spoken automatically. Hidden if the browser lacks support. Emoji and symbols are stripped before speaking (accented letters and ¡¿ are kept).
- **Rocket sound (Fly):** brown noise through a low-pass filter, made with the Web Audio API. It roars up at blast-off (filter opens 300 → 1400 Hz in 0.4s, volume fades in over 0.25s), holds for 75% of the flight, and fades out by landing. The audio context is created on the first tap so browsers allow it to play. There is no mute button; the device volume or silent mode controls it.

## Install and offline
- **Manifest** (`manifest.webmanifest`): name "Astronaut Bruno Tristan's Planet Explorer", short name "Planets", `display: standalone` (opens without browser bars), relative `start_url`/`scope` (`./`) so it works under the `/planets/` path on GitHub Pages; background `#05071a`, theme `#1b2a6b`.
- **Icon**: Bruno's helmet on a starry navy background. `icons/icon.svg` is the source and the browser-tab favicon. PNGs: `icon-192.png` and `icon-512.png` (rounded corners, Android), `icon-maskable-512.png` (full-bleed, art shrunk into the safe zone so Android can crop it), `apple-touch-icon.png` (180px, full-bleed; iOS rounds the corners). PNGs are rendered from the SVG with a headless browser; re-render them if the SVG changes.
- **iOS**: `apple-mobile-web-app-capable` and related meta tags so "Add to Home Screen" opens full screen.
- **Service worker** (`sw.js`): on install it saves every file in `FILES` to the cache `planets-v2`. Requests are answered from the cache right away (works with no network), and each file is re-downloaded in the background so the next visit gets updates. Old caches are deleted on activate. **When adding a new file to the app, add it to `FILES`.**
- Registered from `app.js` only over http(s); browsers don't allow service workers for `file://`, so opening `index.html` directly still works but isn't installable.

## Layout
- Desktop/tablet: tabs in one row with icon and label side by side.
- Phones (≤ 600px): all 5 tabs fit in one row (icon above label); Bruno and the fonts get smaller; Fly trip times show as a 2×2 grid; the rocket is smaller.

## Kid-friendly rules
Big buttons, rounded large font, no outbound links, no hover-only interactions. Main buttons and answers are at least 60px; exceptions are Explore's orbiting bodies (at least 48px, the Moon 36px) so they fit on the orbits, and the language switch (48px, 44px on phones), which is mostly for grown-ups.

## Saved progress (`localStorage`)
- `planetQuizBest` — best quiz score
- `planetQuizRounds` — quiz rounds played
- `planetStickers` — earned sticker ids
- `planetTrips` — destinations flown to
- `planetLang` — chosen language (`en` or `es`)

## Data sources
NASA planetary fact sheets.
- Gravity relative to Earth: Sun 27.9, Mercury 0.38, Venus 0.91, Earth 1, Moon 0.166, Mars 0.38, Jupiter 2.53, Saturn 1.07, Uranus 0.89, Neptune 1.14, Pluto 0.063.
- Distance from Earth (`fromEarthKm`): closest approach for planets and Pluto (Mercury 77M, Venus 38M, Mars 54.6M, Jupiter 588M, Saturn 1.2B, Uranus 2.6B, Neptune 4.3B, Pluto 4.28B km); usual distance for the Sun (149.6M km) and Moon (384,400 km).
- Travel speeds (`TRAVEL`): walking 5 km/h, car 100 km/h, airplane 900 km/h, rocket 40,000 km/h (about the speed a rocket needs to leave Earth). Rocket times assume a straight flight at full speed, so they're shorter than real missions (e.g. 57 days to Mars vs. about 7 months).

## Testing
Use a browser at desktop (1024px) and phone (390px) widths, with and without reduced motion:
- Tap every body in Explore and check the right fact card opens; use ◀ ▶ through all 11.
- Compare: change both pickers; move the weight slider in lb and kg.
- Fly: fly to every destination; check the distance text, trip times, Bruno's line, and that the engine sound plays for the length of the flight.
- Quiz: play full rounds; check stars, best score and quiz stickers.
- Stickers: check stickers unlock, pop-ups appear, and progress survives a reload.
- Install/offline (served over http, e.g. `python3 -m http.server` from the parent folder, at `/planets/`): Chrome reports no installability or manifest errors; all files are cached; after going offline and reloading, every tab works; after changing a file, the second reload shows the change.
- Languages: switch to Español and back on every tab, including with a fact card open (switch then reopen), after landing a trip, mid-question after a wrong answer, and on the quiz end screen; check the words change and nothing resets. Check Spanish sentences for the Sun, Moon and Earth ("al Sol", "a la Luna", "la Tierra"), large distances ("mil millones"), and read-aloud using a Spanish voice. The choice survives a reload; with no saved choice, a Spanish browser starts in Spanish. On phones the Spanish tab labels fit in one row.
- Opening `index.html` as a file still works.
- No console errors.

## Backlog
Planned features are tracked as GitHub issues: https://github.com/mariotristan/planets/issues. Done so far: #2 (Make planets feel alive), #4 (Fly with Bruno), #9 (Install on a tablet like an app), #12 (Add a favicon), and English/Spanish switching.

## License
MIT (`LICENSE`).
