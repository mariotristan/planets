// Compare tab: side-by-side sizes and "how much would I weigh?".

(function () {
  const selA = document.getElementById("sizeA");
  const selB = document.getElementById("sizeB");
  const view = document.getElementById("sizeView");
  const text = document.getElementById("sizeText");

  BODIES.forEach((b) => {
    selA.add(new Option(b.name, b.id));
    selB.add(new Option(b.name, b.id));
  });
  selA.value = "earth";
  selB.value = "jupiter";

  function showSizes() {
    const a = byId(selA.value);
    const b = byId(selB.value);
    const maxPx = Math.min(280, view.clientWidth / 2 - 30);
    const biggest = Math.max(a.diameterKm, b.diameterKm);
    view.innerHTML = "";
    [a, b].forEach((body) => {
      const px = (body.diameterKm / biggest) * maxPx;
      const item = document.createElement("div");
      item.className = "size-item";
      item.appendChild(drawPlanet(body, Math.max(2, px)));
      const label = document.createElement("div");
      label.textContent = body.name + (px < 6 ? " (tiny dot!)" : "");
      item.appendChild(label);
      view.appendChild(item);
    });

    if (a === b) {
      text.textContent = "They are exactly the same size, silly! 😄";
      return;
    }
    const [big, small] = a.diameterKm >= b.diameterKm ? [a, b] : [b, a];
    const times = big.diameterKm / small.diameterKm;
    text.textContent = times < 1.15
      ? big.name + " and " + small.name + " are almost the same size!"
      : big.name + " is about " + Math.round(times).toLocaleString() +
        " times wider than " + small.name + "!";
  }

  // Bruno reacts when the child picks a new pair.
  function pickedSizes() {
    showSizes();
    earnSticker("size");
    const a = byId(selA.value);
    const b = byId(selB.value);
    const times = Math.max(a.diameterKm, b.diameterKm) / Math.min(a.diameterKm, b.diameterKm);
    setBruno(a === b ? "Hee hee, that's the same one twice! 😄"
      : times > 50 ? "WHOA! That's GIGANTIC! 🤯"
      : times > 5 ? "Wow, what a big difference! 😮"
      : times > 1.15 ? "Hmm, one is a bit bigger! 🔍"
      : "They're like twins! 👯");
  }
  selA.addEventListener("change", pickedSizes);
  selB.addEventListener("change", pickedSizes);
  window.addEventListener("resize", showSizes);

  // ---- Weight ----
  const slider = document.getElementById("weight");
  const valueEl = document.getElementById("weightValue");
  const grid = document.getElementById("weightGrid");
  const unitBtns = document.querySelectorAll(".unit");
  let unit = "lb";

  unitBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.dataset.unit === unit) return;
      // Convert so the slider keeps the same real weight.
      const w = Number(slider.value);
      unit = btn.dataset.unit;
      if (unit === "kg") { slider.min = 10; slider.max = 115; slider.value = Math.round(w / 2.205); }
      else { slider.min = 20; slider.max = 250; slider.value = Math.round(w * 2.205); }
      unitBtns.forEach((b) => b.classList.toggle("active", b === btn));
      showWeights();
    })
  );

  function showWeights() {
    const w = Number(slider.value);
    const unitName = unit === "lb" ? "pounds" : "kilograms";
    valueEl.textContent = w + " " + unitName;
    grid.innerHTML = "";
    BODIES.forEach((body) => {
      const tile = document.createElement("div");
      tile.className = "weight-tile";
      tile.appendChild(drawPlanet(body, body.rings ? 50 : 60));
      tile.insertAdjacentHTML("beforeend",
        "<div>On " + body.name + "</div>" +
        "<strong>" + Math.round(w * body.gravity).toLocaleString() + " " + unit + "</strong>" +
        "<small>" + body.weightJoke + "</small>");
      grid.appendChild(tile);
    });
  }

  slider.addEventListener("input", showWeights);
  // When the child lets go of the slider, Bruno compares the heaviest and lightest places.
  slider.addEventListener("change", () => {
    earnSticker("weight");
    const w = Number(slider.value);
    const places = BODIES.filter((b) => b.id !== "sun");
    const heavy = places.reduce((a, b) => (b.gravity > a.gravity ? b : a));
    const light = places.reduce((a, b) => (b.gravity < a.gravity ? b : a));
    const unitName = unit === "lb" ? "pounds" : "kilograms";
    setBruno("On " + heavy.name + " you'd weigh " + Math.round(w * heavy.gravity) + " " + unitName +
      ", but on " + light.name + " only " + Math.round(w * light.gravity) + " " + unitName + "! Boing! 🦘");
  });

  showWeights();
  // Size view needs layout; wait until the Compare tab is visible the first time.
  document.querySelector('[data-tab="compare"]').addEventListener("click", () =>
    requestAnimationFrame(showSizes)
  );
})();
