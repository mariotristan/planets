// Quiz tab: 8 random questions per round, a star for each first-try answer.

(function () {
  const box = document.getElementById("quizBox");
  const ROUND = 8;
  const BEST_KEY = "planetQuizBest";
  const ROUNDS_KEY = "planetQuizRounds";
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  // order: the shuffled answer positions; wrong: positions already tried; right: true once answered.
  // result: set when the round is over. Kept so switching language can redraw the same screen.
  let questions, index, stars, order, wrong, right, cheer, result;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const best = () => Number(localStorage.getItem(BEST_KEY) || 0);
  // Answer i of question q: a planet's name, or the text in the current language.
  const answerText = (q, i) => (byId(q.answers[i]) ? tr(byId(q.answers[i])).name : tr(q).answers[i]);

  function start() {
    questions = shuffle(QUIZ).slice(0, ROUND);
    index = 0;
    stars = 0;
    result = null;
    newQuestion();
  }

  function newQuestion() {
    const q = questions[index];
    order = shuffle(q.answers.map((a, i) => i));
    wrong = new Set();
    right = false;
    showQuestion();
  }

  function showQuestion() {
    const q = questions[index];
    box.innerHTML =
      '<div class="quiz-top"><span>' + t("questionOf", index + 1, ROUND) + "</span>" +
      "<span>⭐ " + stars + "</span></div>" +
      '<p class="question"></p>' +
      '<button class="big-btn speak"></button>' +
      '<div class="feedback" aria-live="polite"></div>' +
      '<div class="answers"></div>';
    box.querySelector(".question").textContent = tr(q).q;

    const speakBtn = box.querySelector(".speak");
    speakBtn.textContent = t("readToMe");
    if (!canSpeak) speakBtn.style.display = "none";
    speakBtn.addEventListener("click", () =>
      speak(tr(q).q + " " + q.answers.map((a, i) => answerText(q, i)).join(t("or")) + "?")
    );

    const answersEl = box.querySelector(".answers");
    order.forEach((i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      const body = byId(q.answers[i]);
      if (body) btn.appendChild(drawPlanet(body, body.rings ? 50 : 60));
      btn.appendChild(document.createTextNode(answerText(q, i)));
      const isRight = q.answers[i] === q.correct;
      if (wrong.has(i)) { btn.classList.add("wrong"); btn.disabled = true; }
      if (right) { btn.disabled = true; if (isRight) btn.classList.add("right"); }
      btn.addEventListener("click", () => choose(btn, i, isRight));
      answersEl.appendChild(btn);
    });
    const feedback = box.querySelector(".feedback");
    if (right) {
      feedback.innerHTML = '<span class="pop"></span>';
      feedback.firstChild.textContent = t("cheers")[cheer];
      showNext();
    } else if (wrong.size) {
      feedback.textContent = t("tryAgain");
    }
  }

  function choose(btn, i, isRight) {
    const feedback = box.querySelector(".feedback");
    if (!isRight) {
      wrong.add(i);
      btn.classList.add("wrong");
      btn.disabled = true;
      feedback.textContent = t("tryAgain");
      setBruno(pick(t("brunoWrong")));
      return;
    }
    right = true;
    btn.classList.add("right");
    box.querySelectorAll(".answer").forEach((b) => (b.disabled = true));
    if (!wrong.size) stars++;
    cheer = Math.floor(Math.random() * t("cheers").length);
    setBruno(pick(t("brunoRight")));
    feedback.innerHTML = '<span class="pop"></span>';
    feedback.firstChild.textContent = t("cheers")[cheer];
    speak(t("cheers")[cheer]);
    box.querySelector(".quiz-top span:last-child").textContent = "⭐ " + stars;
    showNext().focus();
  }

  function showNext() {
    const next = document.createElement("button");
    next.className = "big-btn";
    next.textContent = t(index + 1 < ROUND ? "nextQuestion" : "seeStars");
    next.style.marginTop = "20px";
    next.addEventListener("click", () => {
      stopSpeaking();
      index++;
      index < ROUND ? newQuestion() : finish();
    });
    box.appendChild(next);
    return next;
  }

  function finish() {
    const newBest = stars > best();
    if (newBest) localStorage.setItem(BEST_KEY, stars);
    const rounds = Number(localStorage.getItem(ROUNDS_KEY) || 0) + 1;
    localStorage.setItem(ROUNDS_KEY, rounds);
    result = { newBest };
    const msg = showResult();
    setBruno(stars === ROUND ? t("brunoPerfect")
      : stars >= ROUND / 2 ? t("brunoGood", stars)
      : t("brunoTry"));
    earnSticker("quiz-first");
    if (stars >= 5) earnSticker("quiz-5");
    if (stars === ROUND) earnSticker("quiz-perfect");
    if (rounds >= 3) earnSticker("quiz-3");
    speak(t("gotStars", stars, ROUND) + " " + msg);
  }

  // The end screen. Returns the message so it can be read aloud.
  function showResult() {
    const msg = stars === ROUND ? t("resultPerfect")
      : stars >= ROUND / 2 ? t("resultGood")
      : t("resultTry");
    box.innerHTML =
      "<h2>" + t("gotStars", stars, ROUND) + "</h2>" +
      '<div class="stars">' + "⭐".repeat(stars) + "☆".repeat(ROUND - stars) + "</div>" +
      '<p class="question">' + msg + "</p>" +
      "<p>" + (result.newBest ? t("newBest") : t("bestScore", best())) + "</p>" +
      '<button class="big-btn again">' + t("playAgain") + "</button>";
    box.querySelector(".again").addEventListener("click", () => {
      setBruno(t("brunoSays").quiz);
      start();
    });
    return msg;
  }

  document.addEventListener("langchange", () => (result ? showResult() : showQuestion()));
  start();
})();
