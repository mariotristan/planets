// Fly tab: pick a place, watch Bruno's rocket fly there from Earth, and see how long the trip would take.

(function () {
  const TRIPS_KEY = "planetTrips";
  const places = BODIES.filter((b) => b.fromEarthKm);
  const destEl = document.getElementById("destinations");
  const fromEl = document.getElementById("tripFrom");
  const toEl = document.getElementById("tripTo");
  const rocket = document.querySelector(".rocket");
  const text = document.getElementById("tripText");
  const grid = document.getElementById("travelGrid");
  let flight, landed;

  let trips;
  try {
    trips = new Set(JSON.parse(localStorage.getItem(TRIPS_KEY)) || []);
  } catch (e) {
    trips = new Set();
  }

  function plural(n, unit) {
    return num(n) + " " + t("units")[unit][n === 1 ? 0 : 1];
  }

  function duration(hours) {
    if (hours < 1) return plural(Math.max(1, Math.round(hours * 60)), "minute");
    if (hours < 48) return plural(Math.round(hours), "hour");
    const days = hours / 24;
    if (days < 60) return plural(Math.round(days), "day");
    if (days < 730) return plural(Math.round(days / 30.4), "month");
    return plural(Math.round(days / 365.25), "year");
  }

  // Rocket engine sound, made in code (no sound files): a deep rumble that roars up at
  // blast-off, keeps going for the whole flight, and fades out as we land.
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audio;
  function rocketSound(ctx, seconds) {
    const t = ctx.currentTime;
    // Brown noise: random steps that wander slowly, so it rumbles instead of hissing.
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.4); // the roar at blast-off
    filter.frequency.linearRampToValueAtTime(500, t + seconds);
    const volume = ctx.createGain();
    volume.gain.setValueAtTime(0.0001, t);
    volume.gain.exponentialRampToValueAtTime(0.6, t + 0.25);
    volume.gain.setValueAtTime(0.6, t + seconds * 0.75);
    volume.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
    noise.connect(filter).connect(volume).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + seconds);
  }
  function playRocketSound(ms) {
    if (!AudioCtx) return;
    audio = audio || new AudioCtx(); // created on the first tap, so browsers allow it to play
    if (audio.state === "suspended") audio.resume();
    rocketSound(audio, Math.max(ms, 1200) / 1000);
  }

  function picture(el, body) {
    el.innerHTML = "";
    el.appendChild(drawPlanet(body, body.rings ? 46 : 56));
  }

  function fly(body) {
    destEl.querySelectorAll("button").forEach((b) => {
      b.disabled = true;
      b.classList.toggle("active", b.dataset.id === body.id);
    });
    picture(toEl, body);
    text.textContent = t("blastOff");
    grid.innerHTML = "";
    landed = null;
    setBruno(t("holdOn", body));

    // Farther places take a little longer to fly to (Moon about 1.5s, Pluto about 5s).
    const ms = reduceMotion ? 0 : 1500 + Math.log10(body.fromEarthKm / 384400) * 850;
    if (flight) flight.cancel();
    rocket.classList.add("flying");
    playRocketSound(ms);
    flight = rocket.animate(
      [{ left: "0px" }, { left: "calc(100% - " + rocket.offsetWidth + "px)" }],
      { duration: ms, easing: "ease-in-out", fill: "forwards" }
    );
    flight.onfinish = () => land(body);
  }

  function land(body) {
    rocket.classList.remove("flying");
    destEl.querySelectorAll("button").forEach((b) => (b.disabled = false));
    landed = body;
    showTrip(body);

    const car = duration(body.fromEarthKm / TRAVEL[1].kmh);
    setBruno(body.id === "sun" ? t("sunLanding", car) : t("madeIt", body, car));

    earnSticker("trip");
    trips.add(body.id);
    localStorage.setItem(TRIPS_KEY, JSON.stringify([...trips]));
    if (places.every((p) => trips.has(p.id))) earnSticker("trip-all");
  }

  // How far away it is and how long it takes to get there.
  function showTrip(body) {
    text.textContent = t("away", body, body.fromEarthKm, body.fromEarthKm * 0.6214);
    grid.innerHTML = "";
    TRAVEL.forEach((way) => {
      const hours = body.fromEarthKm / way.kmh;
      const tile = document.createElement("div");
      tile.className = "travel-tile";
      tile.innerHTML = '<span class="travel-icon"></span><div></div><strong></strong><small></small>';
      tile.querySelector(".travel-icon").textContent = way.icon;
      tile.querySelector("div").textContent = tr(way).name;
      tile.querySelector("strong").textContent = duration(hours);
      tile.querySelector("small").textContent = hours / 24 / 365.25 > 80 ? t("lifetime") : "";
      grid.appendChild(tile);
    });
  }

  places.forEach((body) => {
    const btn = document.createElement("button");
    btn.className = "dest";
    btn.dataset.id = body.id;
    btn.appendChild(drawPlanet(body, body.rings ? 34 : 40));
    btn.appendChild(document.createElement("span")).textContent = tr(body).name;
    btn.addEventListener("click", () => fly(body));
    destEl.appendChild(btn);
  });

  document.addEventListener("langchange", () => {
    destEl.querySelectorAll("button").forEach((b) => (b.querySelector("span").textContent = tr(byId(b.dataset.id)).name));
    if (landed) showTrip(landed);
    else if (rocket.classList.contains("flying")) text.textContent = t("blastOff");
  });

  picture(fromEl, byId("earth"));
  toEl.textContent = "❓";
})();
