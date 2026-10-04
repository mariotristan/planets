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
  let flight;

  let trips;
  try {
    trips = new Set(JSON.parse(localStorage.getItem(TRIPS_KEY)) || []);
  } catch (e) {
    trips = new Set();
  }

  // 54600000 -> "55 million", 4300000000 -> "4.3 billion"
  function bigNumber(n) {
    if (n >= 1e9) return +(n / 1e9).toFixed(1) + " billion";
    if (n >= 1e6) return Math.round(n / 1e6) + " million";
    return (Math.round(n / 100) * 100).toLocaleString();
  }

  function plural(n, word) {
    return n.toLocaleString() + " " + word + (n === 1 ? "" : "s");
  }

  function duration(hours) {
    if (hours < 1) return plural(Math.max(1, Math.round(hours * 60)), "minute");
    if (hours < 48) return plural(Math.round(hours), "hour");
    const days = hours / 24;
    if (days < 60) return plural(Math.round(days), "day");
    if (days < 730) return plural(Math.round(days / 30.4), "month");
    return plural(Math.round(days / 365.25), "year");
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
    text.textContent = "3… 2… 1… Blast off! 🚀";
    grid.innerHTML = "";
    setBruno("Hold on tight! We're flying to " + (body.id === "sun" || body.id === "moon" ? "the " : "") + body.name + "! 🚀");

    // Farther places take a little longer to fly to (Moon about 1.5s, Pluto about 5s).
    const ms = reduceMotion ? 0 : 1500 + Math.log10(body.fromEarthKm / 384400) * 850;
    if (flight) flight.cancel();
    rocket.classList.add("flying");
    flight = rocket.animate(
      [{ left: "0px" }, { left: "calc(100% - " + rocket.offsetWidth + "px)" }],
      { duration: ms, easing: "ease-in-out", fill: "forwards" }
    );
    flight.onfinish = () => land(body);
  }

  function land(body) {
    rocket.classList.remove("flying");
    destEl.querySelectorAll("button").forEach((b) => (b.disabled = false));
    const the = body.id === "sun" || body.id === "moon" ? "The " : "";
    text.textContent = the + body.name + " is " + bigNumber(body.fromEarthKm) + " kilometers (" +
      bigNumber(body.fromEarthKm * 0.6214) + " miles) away" + (the ? "!" : " when it's closest to Earth!");

    TRAVEL.forEach((way) => {
      const hours = body.fromEarthKm / way.kmh;
      const tile = document.createElement("div");
      tile.className = "travel-tile";
      tile.innerHTML = '<span class="travel-icon"></span><div></div><strong></strong><small></small>';
      tile.querySelector(".travel-icon").textContent = way.icon;
      tile.querySelector("div").textContent = way.name;
      tile.querySelector("strong").textContent = duration(hours);
      tile.querySelector("small").textContent = hours / 24 / 365.25 > 80 ? "Longer than a whole lifetime!" : "";
      grid.appendChild(tile);
    });

    const car = duration(body.fromEarthKm / TRAVEL[1].kmh);
    setBruno(body.id === "sun"
      ? "We can't land on the Sun — way too hot! 🥵 By car it would take " + car + " to get here!"
      : "We made it to " + the.toLowerCase() + body.name + "! 🎉 By car it would take " + car + "!");

    earnSticker("trip");
    trips.add(body.id);
    localStorage.setItem(TRIPS_KEY, JSON.stringify([...trips]));
    if (places.every((p) => trips.has(p.id))) earnSticker("trip-all");
  }

  places.forEach((body) => {
    const btn = document.createElement("button");
    btn.className = "dest";
    btn.dataset.id = body.id;
    btn.appendChild(drawPlanet(body, body.rings ? 34 : 40));
    btn.appendChild(document.createTextNode(body.name));
    btn.addEventListener("click", () => fly(body));
    destEl.appendChild(btn);
  });

  picture(fromEl, byId("earth"));
  toEl.textContent = "❓";
})();
