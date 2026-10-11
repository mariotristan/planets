// Sticker book: a stamp for each body you visit, plus badges for the quiz and Compare tab.

(function () {
  const KEY = "planetStickers";
  const STICKERS = [
    ...BODIES.map((b) => ({ id: "visit-" + b.id, body: b })),
    { id: "explorer", name: "Super Explorer", icon: "🧭", hint: "Visit every planet, the Sun, the Moon and Pluto",
      es: { name: "Súper Exploración", hint: "Visita todos los planetas, el Sol, la Luna y Plutón" } },
    { id: "size", name: "Size Detective", icon: "🔍", hint: "Compare two sizes",
      es: { name: "Detective de Tamaños", hint: "Compara dos tamaños" } },
    { id: "weight", name: "Space Scale", icon: "⚖️", hint: "Move the weight slider",
      es: { name: "Báscula Espacial", hint: "Mueve la barra del peso" } },
    { id: "trip", name: "Space Traveler", icon: "🧑‍🚀", hint: "Fly somewhere with Bruno",
      es: { name: "Viaje Espacial", hint: "Vuela a algún lugar con Bruno" } },
    { id: "trip-all", name: "Grand Tour", icon: "🗺️", hint: "Fly to every place",
      es: { name: "Gran Recorrido", hint: "Vuela a todos los lugares" } },
    { id: "quiz-first", name: "First Quiz", icon: "🎓", hint: "Finish a quiz",
      es: { name: "Primeras Preguntas", hint: "Termina un juego de preguntas" } },
    { id: "quiz-5", name: "Star Catcher", icon: "🌟", hint: "Get 5 stars in one quiz",
      es: { name: "Atrapa Estrellas", hint: "Consigue 5 estrellas en un juego" } },
    { id: "quiz-perfect", name: "Space Expert", icon: "🏆", hint: "Get all 8 stars in one quiz",
      es: { name: "Genio del Espacio", hint: "Consigue las 8 estrellas en un juego" } },
    { id: "quiz-3", name: "Quiz Champ", icon: "🥇", hint: "Play 3 quizzes",
      es: { name: "Copa de Preguntas", hint: "Juega 3 veces a las preguntas" } },
  ];
  // A sticker's name and hint in the current language.
  const words = (s) => (s.body ? { name: tr(s.body).name, hint: t("visitHint", s.body) } : tr(s));

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
      label.textContent = got ? words(s).name : words(s).hint;
      tile.append(pic, label);
      grid.appendChild(tile);
    });
    const n = STICKERS.filter((s) => earned.has(s.id)).length;
    count.textContent = n === STICKERS.length ? t("allStickers", n) : t("stickerCount", n, STICKERS.length);
  }

  // Show one "New sticker!" pop-up at a time.
  function nextToast() {
    const s = toastQueue[0];
    if (!s) return;
    toast.innerHTML = "";
    const text = document.createElement("span");
    text.textContent = t("newSticker", words(s).name);
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
  document.addEventListener("langchange", render);
})();
