// Shared helpers: tabs, read-aloud, and drawing planets.

const byId = (id) => BODIES.find((b) => b.id === id);

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Draws a planet as a <div> of the given pixel size.
// With spin, its surface features slowly scroll across it so it looks like it's turning.
function drawPlanet(body, size, spin) {
  const el = document.createElement("div");
  el.className = "planet " + body.id + (body.rings ? " rings" : "");
  el.style.width = el.style.height = size + "px";
  el.style.background = body.features.concat(body.look).join(", ");
  if (body.rings) el.style.setProperty("--ring", Math.max(3, size / 8) + "px");
  if (spin && !reduceMotion) {
    el.classList.add("spin");
    // Only the feature layers move; the base look layers stay put.
    const baseLayers = Array(body.look.match(/gradient\(/g).length).fill("0 0");
    const at = (pos) => body.features.map(() => pos).concat(baseLayers).join(", ");
    const end = body.spin === "sideways" ? "0 " + size + "px"
      : body.spin === "backward" ? -size + "px 0"
      : size + "px 0";
    el.animate({ backgroundPosition: [at("0 0"), at(end)] }, { duration: 20000, iterations: Infinity });
  }
  return el;
}

// Read-aloud using the browser's built-in voice.
const canSpeak = "speechSynthesis" in window;
function speak(text) {
  if (!canSpeak) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.1;
  speechSynthesis.speak(u);
}
function stopSpeaking() {
  if (canSpeak) speechSynthesis.cancel();
}

// Astronaut Bruno, the guide. Tap him to hear what he says.
const brunoSays = {
  explore: "Hi! I'm Astronaut Bruno Tristan! Tap a planet and let's fly there! 🚀",
  compare: "How big are the planets? How much would I weigh there? Let's find out!",
  fly: "Where should we fly today? Pick a place and blast off! 🚀",
  quiz: "Ready for a space quiz? Let's earn some stars! ⭐",
  stickers: "Look at all the stickers you collected! Can you get them all? 🏅",
};
const bubble = document.getElementById("bubble");
function setBruno(text) {
  bubble.textContent = text;
  // Restart the little "pop" so the child notices Bruno said something new.
  bubble.classList.remove("pop-in");
  void bubble.offsetWidth;
  bubble.classList.add("pop-in");
}
document.getElementById("bruno").addEventListener("click", () =>
  speak(bubble.textContent.replace(/[^\w\s!?,.']/g, ""))
);
setBruno(brunoSays.explore);

// Tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    stopSpeaking();
    setBruno(brunoSays[tab.dataset.tab]);
    tabs.forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".panel").forEach((p) =>
      p.classList.toggle("active", p.id === tab.dataset.tab)
    );
  })
);

// Save the app for offline use and installing on a tablet. Browsers only allow this
// over https or localhost, so it's skipped when index.html is opened as a file.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
