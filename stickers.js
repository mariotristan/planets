// Sticker book: a stamp for each body you visit, plus badges for the quiz and Compare tab.

(function () {
  const KEY = "planetStickers";
  const STICKERS = [
    ...BODIES.map((b) => ({ id: "visit-" + b.id, name: b.name, body: b, hint: "Open the " + b.name + " card" })),
    { id: "explorer", name: "Super Explorer", icon: "🧭", hint: "Visit every planet, the Sun, the Moon and Pluto" },
    { id: "size", name: "Size Detective", icon: "🔍", hint: "Compare two sizes" },
    { id: "weight", name: "Space Scale", icon: "⚖️", hint: "Move the weight slider" },
    { id: "trip", name: "Space Traveler", icon: "🧑‍🚀", hint: "Fly somewhere with Bruno" },
    { id: "trip-all", name: "Grand Tour", icon: "🗺️", hint: "Fly to every place" },
    { id: "quiz-first", name: "First Quiz", icon: "🎓", hint: "Finish a quiz" },
    { id: "quiz-5", name: "Star Catcher", icon: "🌟", hint: "Get 5 stars in one quiz" },
    { id: "quiz-perfect", name: "Space Expert", icon: "🏆", hint: "Get all 8 stars in one quiz" },
    { id: "quiz-3", name: "Quiz Champ", icon: "🥇", hint: "Play 3 quizzes" },
  ];

  let earned;
  try {
    earned = new Set(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch (e) {
    earned = new Set();
  }

  const grid = document.getElementById("stickerGrid");
  const count = document.getElementById("stickerCount");
  const toast = document.getElementById("toast");
  const toastQueue = [];

  function art(s, size) {
    if (s.body) return drawPlanet(s.body, s.body.rings ? size * 0.75 : size);
    const el = document.createElement("span");
    el.className = "sticker-icon";
    el.textContent = s.icon;
    return el;
  }

  function render() {
    grid.innerHTML = "";
    STICKERS.forEach((s) => {
      const got = earned.has(s.id);
      const tile = document.createElement("div");
      tile.className = "sticker" + (got ? " got" : "");
      const pic = document.createElement("div");
      pic.className = "sticker-art";
      if (got) pic.appendChild(art(s, 60));
      else pic.textContent = "❓";
      const label = document.createElement(got ? "strong" : "small");
      label.textContent = got ? s.name : s.hint;
      tile.append(pic, label);
      grid.appendChild(tile);
    });
    const n = STICKERS.filter((s) => earned.has(s.id)).length;
    count.textContent = n === STICKERS.length
      ? "WOW! You collected all " + n + " stickers! 🎉"
      : "You have " + n + " of " + STICKERS.length + " stickers!";
  }

  // Show one "New sticker!" pop-up at a time.
  function nextToast() {
    const s = toastQueue[0];
    if (!s) return;
    toast.innerHTML = "";
    const text = document.createElement("span");
    text.textContent = "New sticker: " + s.name + "!";
    toast.append(art(s, 44), text);
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
      toastQueue.shift();
      setTimeout(nextToast, 300);
    }, 2500);
  }

  window.earnSticker = function (id) {
    if (earned.has(id)) return;
    const sticker = STICKERS.find((s) => s.id === id);
    if (!sticker) return;
    earned.add(id);
    localStorage.setItem(KEY, JSON.stringify([...earned]));
    render();
    toastQueue.push(sticker);
    if (toastQueue.length === 1) nextToast();
    if (BODIES.every((b) => earned.has("visit-" + b.id))) earnSticker("explorer");
  };

  render();
})();
