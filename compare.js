// Compare tab: side-by-side sizes and "how much would I weigh?".

(function () {
  const selA = document.getElementById("sizeA");
  const selB = document.getElementById("sizeB");
  const view = document.getElementById("sizeView");
  const text = document.getElementById("sizeText");

  function fillPickers() {
    [selA, selB].forEach((sel) => {
      const picked = sel.value;
      sel.innerHTML = "";
      BODIES.forEach((b) => sel.add(new Option(tr(b).name, b.id)));
      sel.value = picked;
    });
  }
  fillPickers();
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
      label.textContent = tr(body).name + (px < 6 ? t("tinyDot") : "");
      item.appendChild(label);
      view.appendChild(item);
    });

    if (a === b) {
      text.textContent = t("sameSize");
      return;
    }
    const [big, small] = a.diameterKm >= b.diameterKm ? [a, b] : [b, a];
    const times = big.diameterKm / small.diameterKm;
    text.textContent = times < 1.15 ? t("almostSame", big, small) : t("timesWider", big, small, Math.round(times));
  }

  // Bruno reacts when the child picks a new pair.
  function pickedSizes() {
    showSizes();
    earnSticker("size");
    const a = byId(selA.value);
    const b = byId(selB.value);
    const times = Math.max(a.diameterKm, b.diameterKm) / Math.min(a.diameterKm, b.diameterKm);
    const react = t("sizeReact");
    setBruno(a === b ? react.same
      : times > 50 ? react.huge
      : times > 5 ? react.big
      : times > 1.15 ? react.bit
      : react.twins);
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
    valueEl.textContent = num(w) + " " + t(unit === "lb" ? "pounds" : "kilograms");
    grid.innerHTML = "";
    BODIES.forEach((body) => {
      const tile = document.createElement("div");
      tile.className = "weight-tile";
      tile.appendChild(drawPlanet(body, body.rings ? 50 : 60));
      tile.insertAdjacentHTML("beforeend",
        "<div>" + t("onBody", body) + "</div>" +
        "<strong>" + num(Math.round(w * body.gravity)) + " " + unit + "</strong>" +
        "<small>" + tr(body).weightJoke + "</small>");
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
    setBruno(t("weighReact", heavy, num(Math.round(w * heavy.gravity)), light, num(Math.round(w * light.gravity)),
      t(unit === "lb" ? "pounds" : "kilograms")));
  });

  showWeights();
  document.addEventListener("langchange", () => {
    fillPickers();
    showSizes();
    showWeights();
  });
  // Size view needs layout; wait until the Compare tab is visible the first time.
  document.querySelector('[data-tab="compare"]').addEventListener("click", () =>
    requestAnimationFrame(showSizes)
  );
})();
