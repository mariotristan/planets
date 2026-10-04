// Quiz tab: 8 random questions per round, a star for each first-try answer.

(function () {
  const box = document.getElementById("quizBox");
  const ROUND = 8;
  const BEST_KEY = "planetQuizBest";
  const ROUNDS_KEY = "planetQuizRounds";
  const cheers = ["Great job! 🎉", "You got it! 🌟", "Awesome! 🚀", "Super star! ⭐", "Wow, smart! 🧠"];
  const brunoRight = ["I knew you could do it! 🙌", "High five, astronaut! ✋", "You're a space genius! 🧠", "Blast off! That's right! 🚀"];
  const brunoWrong = ["Hmm, tricky one! Try another! 🤔", "Oops! Don't give up! 💪", "So close! Pick again! 🌟"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let questions, index, stars, firstTry;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const best = () => Number(localStorage.getItem(BEST_KEY) || 0);

  function start() {
    questions = shuffle(QUIZ).slice(0, ROUND);
    index = 0;
    stars = 0;
    showQuestion();
  }

  function showQuestion() {
    const q = questions[index];
    firstTry = true;
    box.innerHTML =
      '<div class="quiz-top"><span>Question ' + (index + 1) + " of " + ROUND + "</span>" +
      "<span>⭐ " + stars + "</span></div>" +
      '<p class="question"></p>' +
      '<button class="big-btn speak">🔊 Read to me</button>' +
      '<div class="feedback" aria-live="polite"></div>' +
      '<div class="answers"></div>';
    box.querySelector(".question").textContent = q.q;

    const speakBtn = box.querySelector(".speak");
    if (!canSpeak) speakBtn.style.display = "none";
    speakBtn.addEventListener("click", () =>
      speak(q.q + " " + q.answers.map((a) => (byId(a) ? byId(a).name : a)).join(", or ") + "?")
    );

    const answersEl = box.querySelector(".answers");
    shuffle(q.answers).forEach((ans) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      const body = byId(ans);
      if (body) btn.appendChild(drawPlanet(body, body.rings ? 50 : 60));
      btn.appendChild(document.createTextNode(body ? body.name : ans));
      btn.addEventListener("click", () => choose(btn, ans === q.correct));
      answersEl.appendChild(btn);
    });
  }

  function choose(btn, isRight) {
    const feedback = box.querySelector(".feedback");
    if (!isRight) {
      firstTry = false;
      btn.classList.add("wrong");
      btn.disabled = true;
      feedback.textContent = "Not quite — try again! 💪";
      setBruno(pick(brunoWrong));
      return;
    }
    btn.classList.add("right");
    box.querySelectorAll(".answer").forEach((b) => (b.disabled = true));
    if (firstTry) stars++;
    const cheer = pick(cheers);
    setBruno(pick(brunoRight));
    feedback.innerHTML = '<span class="pop">' + cheer + "</span>";
    speak(cheer.replace(/[^\w\s!,']/g, ""));
    box.querySelector(".quiz-top span:last-child").textContent = "⭐ " + stars;

    const next = document.createElement("button");
    next.className = "big-btn";
    next.textContent = index + 1 < ROUND ? "Next question ▶" : "See my stars! ⭐";
    next.style.marginTop = "20px";
    next.addEventListener("click", () => {
      stopSpeaking();
      index++;
      index < ROUND ? showQuestion() : finish();
    });
    box.appendChild(next);
    next.focus();
  }

  function finish() {
    const newBest = stars > best();
    if (newBest) localStorage.setItem(BEST_KEY, stars);
    const rounds = Number(localStorage.getItem(ROUNDS_KEY) || 0) + 1;
    localStorage.setItem(ROUNDS_KEY, rounds);
    const msg = stars === ROUND ? "PERFECT! You are a space expert! 🏆"
      : stars >= ROUND / 2 ? "Great work, astronaut! 🚀"
      : "Good try! Explore the planets and play again! 🪐";
    box.innerHTML =
      "<h2>You got " + stars + " out of " + ROUND + " stars!</h2>" +
      '<div class="stars">' + "⭐".repeat(stars) + "☆".repeat(ROUND - stars) + "</div>" +
      '<p class="question">' + msg + "</p>" +
      (newBest ? "<p>🎊 New best score! 🎊</p>" : "<p>Best score: " + best() + " ⭐</p>") +
      '<button class="big-btn again">Play again 🔄</button>';
    box.querySelector(".again").addEventListener("click", () => {
      setBruno(brunoSays.quiz);
      start();
    });
    setBruno(stars === ROUND ? "WOW! All the stars! I'm a real space expert! 🏆"
      : stars >= ROUND / 2 ? "Yay! I got " + stars + " stars! Can I beat it next time? 🚀"
      : "Good try! Let's explore the planets and play again! 🪐");
    earnSticker("quiz-first");
    if (stars >= 5) earnSticker("quiz-5");
    if (stars === ROUND) earnSticker("quiz-perfect");
    if (rounds >= 3) earnSticker("quiz-3");
    speak("You got " + stars + " out of " + ROUND + " stars! " + msg.replace(/[^\w\s!,']/g, ""));
  }

  start();
})();
