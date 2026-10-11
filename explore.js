// Explore tab: orbiting solar system and planet fact cards.

(function () {
  const system = document.getElementById("system");
  const pauseBtn = document.getElementById("pause");
  const overlay = document.getElementById("factCard");
  const card = overlay.querySelector(".fact");
  let current = 0;

  // Not to scale — sized so every planet is easy to tap.
  const exploreSize = { sun: 0.13, mercury: 0.03, venus: 0.04, earth: 0.042, mars: 0.035,
    jupiter: 0.075, saturn: 0.062, uranus: 0.05, neptune: 0.05, moon: 0.016, pluto: 0.026 };
  const sizeOf = (body, w) => Math.max(16, exploreSize[body.id] * w);

  function bodyButton(body, w) {
    const btn = document.createElement("button");
    btn.className = "body-btn";
    btn.setAttribute("aria-label", tr(body).name);
    btn.appendChild(drawPlanet(body, sizeOf(body, w)));
    btn.addEventListener("click", () => openCard(BODIES.indexOf(body)));
    return btn;
  }

  function buildSystem() {
    system.innerHTML = "";
    const w = system.clientWidth;
    BODIES.forEach((body) => {
      if (body.orbits) return; // moons are added next to their planet below
      const btn = bodyButton(body, w);
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = tr(body).name;
      btn.appendChild(label);

      if (body.id === "sun") {
        btn.classList.add("sun-btn");
        system.appendChild(btn);
        return;
      }
      // Orbits spread evenly from 20% to 97% of the box; outer planets move slower.
      const orbit = document.createElement("div");
      orbit.className = "orbit" + (body.dwarf ? " dwarf" : "");
      const d = 20 + (body.order - 1) * (77 / 8);
      orbit.style.width = orbit.style.height = d + "%";
      const dur = 8 * Math.pow(body.order, 1.1) + "s";
      orbit.style.setProperty("--dur", dur);
      btn.style.setProperty("--dur", dur);
      // Start each planet at a different spot around the Sun (the golden angle spreads them out).
      // With reduced motion they stay at this spot instead of orbiting.
      const angle = (body.order * 137.5) % 360;
      orbit.style.setProperty("--angle", angle + "deg");
      orbit.style.animationDelay = btn.style.animationDelay = -(angle / 360) * parseFloat(dur) + "s";
      const holder = document.createElement("div");
      holder.className = "orbit-body";
      holder.appendChild(btn);
      BODIES.filter((m) => m.orbits === body.id).forEach((moon) => {
        // A small, fast orbit just outside the planet's tap area, so both stay tappable.
        const moonOrbit = document.createElement("div");
        moonOrbit.className = "moon-orbit";
        const planetTap = Math.max(48, sizeOf(body, w) + 12);
        const d = planetTap + 24;
        moonOrbit.style.width = moonOrbit.style.height = d + "px";
        moonOrbit.style.setProperty("--dur", "4s");
        const moonHolder = document.createElement("div");
        moonHolder.className = "orbit-body";
        const moonBtn = bodyButton(moon, w);
        moonBtn.style.setProperty("--dur", "4s");
        moonHolder.appendChild(moonBtn);
        moonOrbit.appendChild(moonHolder);
        holder.appendChild(moonOrbit);
      });
      orbit.appendChild(holder);
      system.appendChild(orbit);
    });
  }

  // dir: -1 for ◀, 1 for ▶, so the next planet flies in from that side.
  function openCard(index, dir) {
    current = (index + BODIES.length) % BODIES.length;
    const body = BODIES[current];
    stopSpeaking();
    const pic = card.querySelector(".fact-pic");
    pic.innerHTML = "";
    pic.style.setProperty("--from", (dir || 0) * 160 + "px");
    pic.appendChild(drawPlanet(body, body.rings ? 110 : 140, true));
    fillCard();
    setBruno(tr(body).bruno);
    earnSticker("visit-" + body.id);
    overlay.classList.remove("hidden");
    card.querySelector(".speak").focus();
  }

  // The card's words, in the current language.
  function fillCard() {
    const body = tr(BODIES[current]);
    card.querySelector(".fact-name").textContent = body.name;
    card.querySelector(".badge").textContent = body.badge || t("planetNumber", body.order);
    const list = card.querySelector(".fact-list");
    list.innerHTML = "";
    body.facts.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      list.appendChild(li);
    });
  }

  function closeCard() {
    stopSpeaking();
    overlay.classList.add("hidden");
  }

  card.querySelector(".close").addEventListener("click", closeCard);
  card.querySelector(".prev").addEventListener("click", () => openCard(current - 1, -1));
  card.querySelector(".next").addEventListener("click", () => openCard(current + 1, 1));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCard(); });
  document.addEventListener("keydown", (e) => {
    if (overlay.classList.contains("hidden")) return;
    if (e.key === "Escape") closeCard();
    if (e.key === "ArrowLeft") openCard(current - 1, -1);
    if (e.key === "ArrowRight") openCard(current + 1, 1);
  });

  const speakBtn = card.querySelector(".speak");
  if (!canSpeak) speakBtn.style.display = "none";
  speakBtn.addEventListener("click", () => {
    const body = tr(BODIES[current]);
    speak(body.name + ". " + body.facts.join(" "));
  });

  const showPause = () =>
    (pauseBtn.textContent = t(system.classList.contains("paused") ? "play" : "pause"));
  pauseBtn.addEventListener("click", () => {
    system.classList.toggle("paused");
    showPause();
  });

  buildSystem();
  showPause();
  document.addEventListener("langchange", () => {
    buildSystem();
    showPause();
    if (!overlay.classList.contains("hidden")) fillCard();
  });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildSystem, 200);
  });
})();
