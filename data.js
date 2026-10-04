// All the content for the site lives here — edit facts or add quiz questions freely.

const BODIES = [
  {
    id: "sun", name: "Sun", order: 0, diameterKm: 1392700, gravity: 27.9,
    look: "radial-gradient(circle at 35% 35%, #fff7b0, #ffd23f 35%, #ff9f1c 70%, #ff6b00)",
    badge: "A star, not a planet!",
    facts: [
      "The Sun is a star. It is a giant ball of super hot gas.",
      "More than one million Earths could fit inside the Sun!",
      "The Sun gives us light and keeps us warm.",
      "All the planets travel around the Sun.",
    ],
    weightJoke: "Ouch! You would be squished flat!",
  },
  {
    id: "mercury", name: "Mercury", order: 1, diameterKm: 4879, gravity: 0.38,
    look: "radial-gradient(circle at 35% 35%, #d9d4cc, #9e968c 55%, #5e5750)",
    facts: [
      "Mercury is the smallest planet.",
      "It is the closest planet to the Sun.",
      "A year on Mercury is only 88 days long!",
      "Mercury has lots of craters, just like our Moon.",
    ],
    weightJoke: "You could jump super high!",
  },
  {
    id: "venus", name: "Venus", order: 2, diameterKm: 12104, gravity: 0.91,
    look: "radial-gradient(circle at 35% 35%, #fff1c9, #e8c27a 50%, #b8873a)",
    facts: [
      "Venus is the hottest planet. Hot enough to melt metal!",
      "Thick clouds cover Venus and trap the heat.",
      "Venus spins backward compared to most planets.",
      "Venus is the brightest planet in our night sky.",
    ],
    weightJoke: "Almost the same as on Earth!",
  },
  {
    id: "earth", name: "Earth", order: 3, diameterKm: 12756, gravity: 1,
    look: "radial-gradient(circle at 30% 30%, #7fd6ff, transparent 25%), radial-gradient(ellipse at 60% 40%, #3fae5a 0 18%, transparent 19%), radial-gradient(ellipse at 35% 70%, #3fae5a 0 14%, transparent 15%), radial-gradient(circle at 40% 40%, #3a8dde, #1f5fae 60%, #123a6e)",
    facts: [
      "Earth is our home!",
      "It is the only planet we know that has life.",
      "Most of Earth is covered by water.",
      "Earth has one moon.",
    ],
    weightJoke: "This is your normal weight!",
  },
  {
    id: "mars", name: "Mars", order: 4, diameterKm: 6792, gravity: 0.38,
    look: "radial-gradient(circle at 35% 35%, #ffb38a, #e0603a 50%, #8f2f1a)",
    facts: [
      "Mars is called the Red Planet.",
      "It is red because its dust is rusty!",
      "Mars has the biggest volcano in the solar system.",
      "Robots called rovers drive around on Mars.",
    ],
    weightJoke: "Boing! You would bounce around!",
  },
  {
    id: "jupiter", name: "Jupiter", order: 5, diameterKm: 142984, gravity: 2.53,
    look: "radial-gradient(ellipse at 65% 62%, #c4492e 0 8%, transparent 9%), linear-gradient(180deg, #e8d3b0 0 14%, #c99a6b 14% 24%, #f0e2c8 24% 38%, #b9825a 38% 48%, #ead7b8 48% 62%, #c08a5e 62% 74%, #e8d3b0 74% 88%, #b07a52 88%)",
    facts: [
      "Jupiter is the biggest planet.",
      "It is made mostly of gas. You cannot stand on it!",
      "The Great Red Spot is a storm bigger than Earth.",
      "Jupiter has lots and lots of moons.",
    ],
    weightJoke: "Whoa, you would feel super heavy!",
  },
  {
    id: "saturn", name: "Saturn", order: 6, diameterKm: 120536, gravity: 1.07, rings: true,
    look: "linear-gradient(180deg, #f6e7b8 0 20%, #e3c886 20% 35%, #f3e1a8 35% 55%, #d9b874 55% 70%, #f1dca0 70%)",
    facts: [
      "Saturn has beautiful rings made of ice and rock.",
      "Saturn is so light it could float in a giant bathtub!",
      "It is the second biggest planet.",
      "Saturn has more moons than any other planet.",
    ],
    weightJoke: "Just a little heavier than on Earth.",
  },
  {
    id: "uranus", name: "Uranus", order: 7, diameterKm: 51118, gravity: 0.89,
    look: "radial-gradient(circle at 35% 35%, #e0ffff, #8fe3e8 45%, #4fb3c2)",
    facts: [
      "Uranus spins on its side, like a rolling ball!",
      "It is an icy planet with a blue-green color.",
      "Uranus is very, very cold.",
      "Uranus has thin, dark rings.",
    ],
    weightJoke: "A tiny bit lighter than on Earth.",
  },
  {
    id: "neptune", name: "Neptune", order: 8, diameterKm: 49528, gravity: 1.14,
    look: "radial-gradient(circle at 35% 35%, #9fc3ff, #3f6fe0 50%, #1c2f8f)",
    facts: [
      "Neptune is the farthest planet from the Sun.",
      "It has the fastest winds in the solar system!",
      "Neptune is dark blue and very cold.",
      "One year on Neptune is 165 Earth years long!",
    ],
    weightJoke: "A little heavier than on Earth.",
  },
];

// Answers that match a body id show a planet picture; anything else shows as text.
const QUIZ = [
  { q: "Which planet is the biggest?", answers: ["jupiter", "mars", "venus"], correct: "jupiter" },
  { q: "Which planet do we live on?", answers: ["mars", "earth", "neptune"], correct: "earth" },
  { q: "Which planet is called the Red Planet?", answers: ["mars", "jupiter", "uranus"], correct: "mars" },
  { q: "Which planet has big, beautiful rings?", answers: ["mercury", "earth", "saturn"], correct: "saturn" },
  { q: "Which planet is the smallest?", answers: ["jupiter", "mercury", "saturn"], correct: "mercury" },
  { q: "Which planet is closest to the Sun?", answers: ["mercury", "neptune", "earth"], correct: "mercury" },
  { q: "Which planet is farthest from the Sun?", answers: ["venus", "mars", "neptune"], correct: "neptune" },
  { q: "Which planet is the hottest?", answers: ["venus", "uranus", "earth"], correct: "venus" },
  { q: "Which planet spins on its side?", answers: ["uranus", "mercury", "mars"], correct: "uranus" },
  { q: "Which planet has a giant storm called the Great Red Spot?", answers: ["earth", "jupiter", "neptune"], correct: "jupiter" },
  { q: "Which planet could float in a giant bathtub?", answers: ["mars", "saturn", "earth"], correct: "saturn" },
  { q: "Which planet has the fastest winds?", answers: ["neptune", "venus", "mercury"], correct: "neptune" },
  { q: "Which planet has robots called rovers driving on it?", answers: ["jupiter", "mars", "uranus"], correct: "mars" },
  { q: "Which planet is the only one we know has life?", answers: ["earth", "venus", "saturn"], correct: "earth" },
  { q: "Which planet is the brightest in our night sky?", answers: ["neptune", "uranus", "venus"], correct: "venus" },
  { q: "Which one is a star, not a planet?", answers: ["sun", "jupiter", "earth"], correct: "sun" },
  { q: "Which planet has lots of craters, like our Moon?", answers: ["mercury", "neptune", "saturn"], correct: "mercury" },
  { q: "Which planet is the second biggest?", answers: ["earth", "saturn", "mars"], correct: "saturn" },
  { q: "Why is Mars red?", answers: ["Rusty dust", "Red paint", "It is on fire"], correct: "Rusty dust" },
  { q: "How many planets go around the Sun?", answers: ["5", "8", "12"], correct: "8" },
  { q: "How many moons does Earth have?", answers: ["1", "2", "None"], correct: "1" },
  { q: "What is the Sun?", answers: ["A planet", "A star", "A moon"], correct: "A star" },
  { q: "What are Saturn's rings made of?", answers: ["Ice and rock", "Gold", "Candy"], correct: "Ice and rock" },
  { q: "Can you stand on Jupiter?", answers: ["Yes", "No, it is made of gas"], correct: "No, it is made of gas" },
  { q: "On which planet would you feel the heaviest?", answers: ["mars", "jupiter", "mercury"], correct: "jupiter" },
];
