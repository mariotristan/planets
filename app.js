// Shared helpers: tabs, read-aloud, and drawing planets.

const byId = (id) => BODIES.find((b) => b.id === id);

// Draws a planet as a <div> of the given pixel size.
function drawPlanet(body, size) {
  const el = document.createElement("div");
  el.className = "planet " + body.id + (body.rings ? " rings" : "");
  el.style.width = el.style.height = size + "px";
  el.style.background = body.look;
  if (body.rings) el.style.setProperty("--ring", Math.max(3, size / 8) + "px");
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

// Tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    stopSpeaking();
    tabs.forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".panel").forEach((p) =>
      p.classList.toggle("active", p.id === tab.dataset.tab)
    );
  })
);
