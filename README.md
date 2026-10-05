# 🚀 Astronaut Bruno Tristan's Planet Explorer

An interactive website that teaches young kids (ages 6–8) about the Sun, the 8 planets, the Moon and Pluto, guided by Astronaut Bruno. It works on tablets (touch) and computers (mouse).

## Features

- **🪐 Explore**: The planets orbit the Sun, the Moon circles Earth, and Pluto has its own dotted orbit. Tap any body to open a fact card with short facts and a 🔊 read-aloud button.
- **⚖️ Compare**: See two bodies side by side at their true relative size, and slide to find out how much you'd weigh on each one.
- **🚀 Fly**: Pick a destination and watch Bruno's rocket fly there from Earth. See how far away it is and how long the trip would take by walking, car, airplane and rocket.
- **❓ Quiz**: 8 random questions per round from a bank of 30. Earn a ⭐ for each first-try answer; your best score is saved.
- **🏅 Stickers**: Collect a stamp for every body you visit, plus badges for the quiz, Compare and Fly tabs.
- **👨‍🚀 Astronaut Bruno**: He reacts to what you do (planet cards, comparisons, quiz answers). Tap him to hear him talk.

## Running it

**Online:** https://mariotristan.github.io/planets/

**Install it like an app:** open the link on a tablet or phone, then
- **iPad / iPhone (Safari):** Share → **Add to Home Screen**
- **Android (Chrome):** menu ⋮ → **Install app** (or **Add to Home screen**)

It opens full screen and works with no internet after the first visit.

**Locally:** no install, no build, no internet needed. Just open `index.html` in a browser.

Progress (best quiz score, stickers) is saved in the browser's `localStorage`.

## Project layout

| File | What it does |
|---|---|
| `index.html` | Page shell, tabs and Astronaut Bruno |
| `styles.css` | All styling (planets are drawn with CSS gradients, no images) |
| `data.js` | All content: bodies, facts, Bruno's lines, quiz questions |
| `app.js` | Tabs, read-aloud, Bruno's speech bubble, planet drawing |
| `explore.js` | Orbiting solar system and fact cards |
| `compare.js` | Size comparison and weight calculator |
| `fly.js` | Fly with Bruno rocket trips |
| `quiz.js` | Quiz game |
| `stickers.js` | Sticker book and "New sticker!" pop-ups |
| `manifest.webmanifest` | App name, icons and colors for installing |
| `sw.js` | Saves all files for offline use (add any new file to its `FILES` list) |
| `icons/` | App icon (`icon.svg` source, also the favicon) and PNG sizes |

The full design is in [`docs/superpowers/specs/2026-10-03-planets-design.md`](docs/superpowers/specs/2026-10-03-planets-design.md).

## Editing content

Everything kids see lives in `data.js`:

- **Facts and Bruno's lines**: edit a body's `facts` or `bruno` field.
- **Trip speeds**: edit `TRAVEL`; distances are each body's `fromEarthKm`.
- **Quiz questions**: add an entry to `QUIZ`. Answers that match a body id (like `"mars"`) show a planet picture; anything else shows as text.

Sizes, gravity and distances come from NASA's planetary fact sheets.

## Backlog

Planned features are tracked as [GitHub issues](https://github.com/mariotristan/planets/issues).
