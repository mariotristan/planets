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

// Astronaut Bruno, the guide. Tap him to hear what he says.
const brunoSays = {
  explore: "Hi! I'm Astronaut Bruno Tristan! Tap a planet and let's fly there! 🚀",
  compare: "How big are the planets? How much would I weigh there? Let's find out!",
  quiz: "Ready for a space quiz? Let's earn some stars! ⭐",
};
const bubble = document.getElementById("bubble");
function setBruno(text) {
  bubble.textContent = text;
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
