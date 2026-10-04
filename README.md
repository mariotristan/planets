# 🚀 Astronaut Bruno Tristan's Planet Explorer

An interactive website that teaches young kids (ages 6–8) about the Sun, the 8 planets, the Moon and Pluto, guided by Astronaut Bruno. It works on tablets (touch) and computers (mouse).

## Features

- **🪐 Explore**: The planets orbit the Sun, the Moon circles Earth, and Pluto has its own dotted orbit. Tap any body to open a fact card with short facts and a 🔊 read-aloud button.
- **⚖️ Compare**: See two bodies side by side at their true relative size, and slide to find out how much you'd weigh on each one.
- **❓ Quiz**: 8 random questions per round from a bank of 30. Earn a ⭐ for each first-try answer; your best score is saved.
- **🏅 Stickers**: Collect a stamp for every body you visit, plus badges for the quiz and Compare tab.
- **👨‍🚀 Astronaut Bruno**: He reacts to what you do (planet cards, comparisons, quiz answers). Tap him to hear him talk.

## Running it

No install, no build, no internet needed. Just open `index.html` in a browser.

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
| `quiz.js` | Quiz game |
| `stickers.js` | Sticker book and "New sticker!" pop-ups |

The full design is in [`docs/superpowers/specs/2026-10-03-planets-design.md`](docs/superpowers/specs/2026-10-03-planets-design.md).

## Editing content

Everything kids see lives in `data.js`:

- **Facts and Bruno's lines**: edit a body's `facts` or `bruno` field.
- **Quiz questions**: add an entry to `QUIZ`. Answers that match a body id (like `"mars"`) show a planet picture; anything else shows as text.

Sizes and gravity come from NASA's planetary fact sheets.

## Backlog

Planned features are tracked as [GitHub issues](https://github.com/mariotristan/planets/issues).
