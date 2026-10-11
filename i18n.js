// English and Spanish. Body facts and quiz questions live in data.js (each has an `es` part);
// this file has the rest of the words kids see, plus the language switch.

const LANG_KEY = "planetLang";
let lang = localStorage.getItem(LANG_KEY) ||
  (navigator.language.toLowerCase().startsWith("es") ? "es" : "en");

// An item in the current language: its Spanish fields win when Spanish is on.
const tr = (item) => (lang === "es" && item.es ? Object.assign({}, item, item.es) : item);

// Numbers like 1,000 (Latin American Spanish uses the same marks as English).
const num = (n) => n.toLocaleString(lang === "es" ? "es-MX" : "en-US");

// Spanish names that need "el"/"la": "el Sol", "la Luna", "la Tierra".
const elName = (body) => (tr(body).the ? tr(body).the + " " : "") + tr(body).name;
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// "a" + "el" -> "al", "de" + "el" -> "del"
const joinEl = (word, body) => (word + " " + elName(body)).replace(/^(a|de) el /, (m, w) => w + "l ");

const UI = {
  en: {
    title: "Astronaut Bruno Tristan's Planet Explorer",
    brunoLabel: "Astronaut Bruno Tristan. Tap to hear him talk!",
    tabExplore: "Explore", tabCompare: "Compare", tabFly: "Fly", tabQuiz: "Quiz", tabStickers: "Stickers",
    brunoSays: {
      explore: "Hi! I'm Astronaut Bruno Tristan! Tap a planet and let's fly there! 🚀",
      compare: "How big are the planets? How much would I weigh there? Let's find out!",
      fly: "Where should we fly today? Pick a place and blast off! 🚀",
      quiz: "Ready for a space quiz? Let's earn some stars! ⭐",
      stickers: "Look at all the stickers you collected! Can you get them all? 🏅",
    },

    // Explore
    exploreHint: "Tap a planet to learn about it!",
    pause: "⏸️ Pause", play: "▶️ Play",
    close: "Close", previous: "Previous", next: "Next",
    readToMe: "🔊 Read to me",
    planetNumber: (n) => "Planet #" + n + " from the Sun",

    // Compare
    howBig: "📏 How big?", vs: "vs", firstPlanet: "First planet", secondPlanet: "Second planet",
    tinyDot: " (tiny dot!)",
    sameSize: "They are exactly the same size, silly! 😄",
    almostSame: (big, small) => tr(big).name + " and " + tr(small).name + " are almost the same size!",
    timesWider: (big, small, n) => tr(big).name + " is about " + num(n) + " times wider than " + tr(small).name + "!",
    sizeReact: { same: "Hee hee, that's the same one twice! 😄", huge: "WHOA! That's GIGANTIC! 🤯",
      big: "Wow, what a big difference! 😮", bit: "Hmm, one is a bit bigger! 🔍", twins: "They're like twins! 👯" },
    howMuchWeigh: "⚖️ How much would I weigh?", iWeigh: "I weigh",
    pounds: "pounds", kilograms: "kilograms",
    onBody: (body) => "On " + tr(body).name,
    weighReact: (heavy, hw, light, lw, unit) => "On " + tr(heavy).name + " you'd weigh " + hw + " " + unit +
      ", but on " + tr(light).name + " only " + lw + " " + unit + "! Boing! 🦘",

    // Fly
    flyTitle: "🚀 Fly with Bruno", flyHint: "Where should we fly from Earth?",
    blastOff: "3… 2… 1… Blast off! 🚀",
    holdOn: (body) => "Hold on tight! We're flying to " + (body.id === "sun" || body.id === "moon" ? "the " : "") + body.name + "! 🚀",
    away: (body, km, miles) => {
      const the = body.id === "sun" || body.id === "moon";
      const big = (n) => n >= 1e9 ? +(n / 1e9).toFixed(1) + " billion"
        : n >= 1e6 ? Math.round(n / 1e6) + " million" : num(Math.round(n / 100) * 100);
      return (the ? "The " : "") + body.name + " is " + big(km) + " kilometers (" + big(miles) + " miles) away" +
        (the ? "!" : " when it's closest to Earth!");
    },
    units: { minute: ["minute", "minutes"], hour: ["hour", "hours"], day: ["day", "days"],
      month: ["month", "months"], year: ["year", "years"] },
    lifetime: "Longer than a whole lifetime!",
    sunLanding: (car) => "We can't land on the Sun — way too hot! 🥵 By car it would take " + car + " to get here!",
    madeIt: (body, car) => "We made it to " + (body.id === "moon" ? "the " : "") + body.name + "! 🎉 By car it would take " + car + "!",

    // Quiz
    questionOf: (i, n) => "Question " + i + " of " + n,
    or: ", or ",
    cheers: ["Great job! 🎉", "You got it! 🌟", "Awesome! 🚀", "Super star! ⭐", "Wow, smart! 🧠"],
    brunoRight: ["I knew you could do it! 🙌", "High five, astronaut! ✋", "You're a space genius! 🧠", "Blast off! That's right! 🚀"],
    brunoWrong: ["Hmm, tricky one! Try another! 🤔", "Oops! Don't give up! 💪", "So close! Pick again! 🌟"],
    tryAgain: "Not quite — try again! 💪",
    nextQuestion: "Next question ▶", seeStars: "See my stars! ⭐",
    gotStars: (s, n) => "You got " + s + " out of " + n + " stars!",
    resultPerfect: "PERFECT! You are a space expert! 🏆",
    resultGood: "Great work, astronaut! 🚀",
    resultTry: "Good try! Explore the planets and play again! 🪐",
    newBest: "🎊 New best score! 🎊",
    bestScore: (b) => "Best score: " + b + " ⭐",
    playAgain: "Play again 🔄",
    brunoPerfect: "WOW! All the stars! I'm a real space expert! 🏆",
    brunoGood: (s) => "Yay! I got " + s + " stars! Can I beat it next time? 🚀",
    brunoTry: "Good try! Let's explore the planets and play again! 🪐",

    // Stickers
    stickerBook: "🏅 My Sticker Book",
    allStickers: (n) => "WOW! You collected all " + n + " stickers! 🎉",
    stickerCount: (n, total) => "You have " + n + " of " + total + " stickers!",
    newSticker: (name) => "New sticker: " + name + "!",
    visitHint: (body) => "Open the " + body.name + " card",
  },

  es: {
    title: "Explorador de Planetas del Astronauta Bruno Tristan",
    brunoLabel: "Astronauta Bruno Tristan. ¡Tócalo para oírlo hablar!",
    tabExplore: "Explorar", tabCompare: "Comparar", tabFly: "Volar", tabQuiz: "Preguntas", tabStickers: "Stickers",
    brunoSays: {
      explore: "¡Hola! ¡Soy el Astronauta Bruno Tristan! ¡Toca un planeta y volemos hasta allá! 🚀",
      compare: "¿Qué tan grandes son los planetas? ¿Cuánto pesaríamos allá? ¡Vamos a averiguarlo!",
      fly: "¿A dónde volamos hoy? ¡Escoge un lugar y despeguemos! 🚀",
      quiz: "¡Vamos a jugar a las preguntas del espacio y a ganar estrellas! ⭐",
      stickers: "¡Mira todos los stickers que juntaste! ¿Puedes conseguirlos todos? 🏅",
    },

    exploreHint: "¡Toca un planeta para conocerlo!",
    pause: "⏸️ Pausa", play: "▶️ Seguir",
    close: "Cerrar", previous: "Anterior", next: "Siguiente",
    readToMe: "🔊 Léemelo",
    planetNumber: (n) => "Planeta #" + n + " desde el Sol",

    howBig: "📏 ¿Qué tan grande?", vs: "vs", firstPlanet: "Primer planeta", secondPlanet: "Segundo planeta",
    tinyDot: " (¡un puntito!)",
    sameSize: "¡Son exactamente del mismo tamaño, je je! 😄",
    almostSame: (big, small) => "¡" + capital(elName(big)) + " y " + elName(small) + " son casi del mismo tamaño!",
    timesWider: (big, small, n) => "¡" + capital(elName(big)) + " es unas " + num(n) + " veces más " +
      (tr(big).the === "la" ? "ancha" : "ancho") + " que " + elName(small) + "!",
    sizeReact: { same: "¡Je je, es el mismo dos veces! 😄", huge: "¡GUAU! ¡Eso es GIGANTESCO! 🤯",
      big: "¡Guau, qué diferencia tan grande! 😮", bit: "Mmm, ¡uno es un poquito más grande! 🔍", twins: "¡Son como gemelos! 👯" },
    howMuchWeigh: "⚖️ ¿Cuánto pesaría?", iWeigh: "Peso",
    pounds: "libras", kilograms: "kilogramos",
    onBody: (body) => "En " + elName(body),
    weighReact: (heavy, hw, light, lw, unit) => "¡En " + elName(heavy) + " pesarías " + hw + " " + unit +
      ", pero en " + elName(light) + " solo " + lw + " " + unit + "! ¡Boing! 🦘",

    flyTitle: "🚀 Vuela con Bruno", flyHint: "¿A dónde volamos desde la Tierra?",
    blastOff: "3… 2… 1… ¡Despegue! 🚀",
    holdOn: (body) => "¡Agárrate fuerte! ¡Vamos volando " + joinEl("a", body) + "! 🚀",
    away: (body, km, miles) => {
      // "mil millones" is a billion; a Spanish "billón" is a million millions.
      const big = (n, unit) => n >= 1e9 ? num(+(n / 1e9).toFixed(1)) + " mil millones de " + unit
        : n >= 1e6 ? num(Math.round(n / 1e6)) + " millones de " + unit : num(Math.round(n / 100) * 100) + " " + unit;
      const the = !!tr(body).the;
      return (the ? "¡" : "") + capital(elName(body)) + " está a " + big(km, "kilómetros") + " (" + big(miles, "millas") + ")" +
        (the ? "!" : " cuando está más cerca de la Tierra.");
    },
    units: { minute: ["minuto", "minutos"], hour: ["hora", "horas"], day: ["día", "días"],
      month: ["mes", "meses"], year: ["año", "años"] },
    lifetime: "¡Más que toda una vida!",
    sunLanding: (car) => "¡No podemos aterrizar en el Sol, hace demasiado calor! 🥵 ¡En carro tardaríamos " + car + " en llegar!",
    madeIt: (body, car) => "¡Llegamos " + joinEl("a", body) + "! 🎉 ¡En carro tardaríamos " + car + "!",

    questionOf: (i, n) => "Pregunta " + i + " de " + n,
    or: " o ",
    cheers: ["¡Muy bien! 🎉", "¡Lo lograste! 🌟", "¡Increíble! 🚀", "¡Súper estrella! ⭐", "¡Guau, qué inteligente! 🧠"],
    brunoRight: ["¡Sabía que podías! 🙌", "¡Choca esos cinco, astronauta! ✋", "¡Eres un genio del espacio! 🧠", "¡Despegamos! ¡Correcto! 🚀"],
    brunoWrong: ["Mmm, ¡qué difícil! ¡Prueba otra! 🤔", "¡Uy! ¡No te rindas! 💪", "¡Casi! ¡Escoge otra vez! 🌟"],
    tryAgain: "Casi, ¡inténtalo otra vez! 💪",
    nextQuestion: "Siguiente pregunta ▶", seeStars: "¡Ver mis estrellas! ⭐",
    gotStars: (s, n) => "¡Conseguiste " + s + " de " + n + " estrellas!",
    resultPerfect: "¡PERFECTO! ¡Sabes muchísimo del espacio! 🏆",
    resultGood: "¡Buen trabajo, astronauta! 🚀",
    resultTry: "¡Buen intento! ¡Explora los planetas y vuelve a jugar! 🪐",
    newBest: "🎊 ¡Nuevo récord! 🎊",
    bestScore: (b) => "Mejor puntaje: " + b + " ⭐",
    playAgain: "Jugar otra vez 🔄",
    brunoPerfect: "¡GUAU! ¡Todas las estrellas! ¡Eso sí es saber del espacio! 🏆",
    brunoGood: (s) => "¡Yupi! ¡" + s + " estrellas! ¿Podremos superarlo la próxima vez? 🚀",
    brunoTry: "¡Buen intento! ¡Exploremos los planetas y juguemos otra vez! 🪐",

    stickerBook: "🏅 Mi álbum de stickers",
    allStickers: (n) => "¡GUAU! ¡Juntaste los " + n + " stickers! 🎉",
    stickerCount: (n, total) => "¡Tienes " + n + " de " + total + " stickers!",
    newSticker: (name) => "¡Sticker nuevo: " + name + "!",
    visitHint: (body) => "Abre la tarjeta " + joinEl("de", body),
  },
};

// A word or sentence in the current language. Sentences that need numbers or planets are functions.
function t(key, ...args) {
  const v = UI[lang][key];
  return typeof v === "function" ? v(...args) : v;
}

// Fills in the words written in index.html: data-i18n sets the text, data-i18n-label the aria-label.
function translatePage() {
  document.documentElement.lang = lang;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
  document.querySelectorAll(".lang").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
}

// Each tab listens for "langchange" and redraws its words.
function setLang(newLang) {
  if (newLang === lang) return;
  lang = newLang;
  localStorage.setItem(LANG_KEY, lang);
  translatePage();
  document.dispatchEvent(new Event("langchange"));
}

document.querySelectorAll(".lang").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
translatePage();
