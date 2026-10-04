// Explore tab: orbiting solar system and planet fact cards.

(function () {
  const system = document.getElementById("system");
  const pauseBtn = document.getElementById("pause");
  const overlay = document.getElementById("factCard");
  const card = overlay.querySelector(".fact");
  let current = 0;

  // Not to scale — sized so every planet is easy to tap.
  const exploreSize = { sun: 0.13, mercury: 0.03, venus: 0.04, earth: 0.042, mars: 0.035,
    jupiter: 0.075, saturn: 0.062, uranus: 0.05, neptune: 0.05 };

  function buildSystem() {
    system.innerHTML = "";
    const w = system.clientWidth;
    BODIES.forEach((body) => {
      const btn = document.createElement("button");
      btn.className = "body-btn";
      btn.setAttribute("aria-label", body.name);
      btn.appendChild(drawPlanet(body, Math.max(16, exploreSize[body.id] * w)));
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = body.name;
      btn.appendChild(label);
      btn.addEventListener("click", () => openCard(body.order));

      if (body.id === "sun") {
        btn.classList.add("sun-btn");
        system.appendChild(btn);
        return;
      }
      // Orbits spread evenly from 22% to 96% of the box; outer planets move slower.
      const orbit = document.createElement("div");
      orbit.className = "orbit";
      const d = 22 + (body.order - 1) * (74 / 7);
      orbit.style.width = orbit.style.height = d + "%";
      const dur = 8 * Math.pow(body.order, 1.1) + "s";
      orbit.style.setProperty("--dur", dur);
      btn.style.setProperty("--dur", dur);
      // Start each planet at a different spot around the Sun.
      orbit.style.animationDelay = btn.style.animationDelay = -(body.order * 37) % 60 + "s";
      const holder = document.createElement("div");
      holder.className = "orbit-body";
      holder.appendChild(btn);
      orbit.appendChild(holder);
      system.appendChild(orbit);
    });
  }

  function openCard(index) {
    current = (index + BODIES.length) % BODIES.length;
    const body = BODIES[current];
    stopSpeaking();
    const pic = card.querySelector(".fact-pic");
    pic.innerHTML = "";
    pic.appendChild(drawPlanet(body, body.rings ? 110 : 140));
    card.querySelector(".fact-name").textContent = body.name;
    card.querySelector(".badge").textContent =
      body.badge || "Planet #" + body.order + " from the Sun";
    const list = card.querySelector(".fact-list");
    list.innerHTML = "";
    body.facts.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      list.appendChild(li);
    });
    overlay.classList.remove("hidden");
    card.querySelector(".speak").focus();
  }

  function closeCard() {
    stopSpeaking();
    overlay.classList.add("hidden");
  }

  card.querySelector(".close").addEventListener("click", closeCard);
  card.querySelector(".prev").addEventListener("click", () => openCard(current - 1));
  card.querySelector(".next").addEventListener("click", () => openCard(current + 1));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCard(); });
  document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("hidden")) return;
    if (e.key === "Escape") closeCard();
    if (e.key === "ArrowLeft") openCard(current - 1);
    if (e.key === "ArrowRight") openCard(current + 1);
  });

  const speakBtn = card.querySelector(".speak");
  if (!canSpeak) speakBtn.style.display = "none";
  speakBtn.addEventListener("click", () => {
    const body = BODIES[current];
    speak(body.name + ". " + body.facts.join(" "));
  });

  pauseBtn.addEventListener("click", () => {
    const paused = system.classList.toggle("paused");
    pauseBtn.textContent = paused ? "▶️ Play" : "⏸️ Pause";
  });

  buildSystem();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildSystem, 200);
  });
})();
