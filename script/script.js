// ===== Variables =====
let currentPokemon;
let score = 0;
let streak = 0;
let timer = 30;
let timerInterval;

// Audio elements
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const pokeCry = document.getElementById("pokeCry");
const whosThatAudio = document.getElementById("whosThatAudio");
const bgMusic = document.getElementById("themeAudio"); // persistent BGM
bgMusic.volume = 0.3;

// ===== Intro sound mute icon =====
let introMuted = false;
const muteIcon = document.getElementById("muteIcon");
if (muteIcon) {
  muteIcon.addEventListener("click", () => {
    introMuted = !introMuted;
    if (introMuted) {
      whosThatAudio.pause();
      muteIcon.innerText = "🔇";
    } else {
      whosThatAudio.play().catch(() => {});
      muteIcon.innerText = "🔊";
    }
  });
}

function playIntroSound() {
  if (!introMuted) {
    whosThatAudio.currentTime = 0;
    whosThatAudio.play().catch(() => {});
  }
}

// ===== Background music toggle button =====
const toggleBGMBtn = document.getElementById("toggleBGM");
if (toggleBGMBtn) {
  toggleBGMBtn.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play();
    else bgMusic.pause();
  });
}

// ===== Fetch Pokémon =====
async function getRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();
  const flavorEntry = speciesData.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );

  return {
    id: data.id,
    name: data.name,
    img: data.sprites.front_default,
    type: data.types.map((t) => t.type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    species: speciesData.genera.find((g) => g.language.name === "en").genus,
    lore: flavorEntry
      ? flavorEntry.flavor_text.replace(/\n|\f/g, " ")
      : "A mysterious Pokémon.",
  };
}

// ===== Timer =====
function startTimer() {
  clearInterval(timerInterval);
  timer = 30;
  updateTimer();
  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearInterval(timerInterval);
      streak = 0;
      document.getElementById("result").innerText = "Time's up!";
      revealPokemon(false, true);
      updateScore();
      setTimeout(pickPokemon, 2500);
    }
  }, 1000);
}

function updateTimer() {
  const timerEl = document.getElementById("timer");
  if (timerEl) timerEl.innerText = `Time: ${timer}s`;
}

// ===== Score =====
function updateScore() {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.innerText = `Score: ${score} | Streak: ${streak}`;
}

// ===== Pick Pokémon =====
async function pickPokemon() {
  clearInterval(timerInterval);
  document.getElementById("result").innerText = "";
  document.getElementById("guess").value = "";
  document.getElementById("guess").focus();

  currentPokemon = await getRandomPokemon();
  playIntroSound();

  const img = document.getElementById("pokemonImg");
  img.src = currentPokemon.img;
  img.style.filter = "brightness(0) saturate(100%) contrast(200%) blur(1px)";
  img.style.transform = "scale(1)";
  img.classList.remove("revealed");

  showPokemonDetails(false);
  startTimer();
}

// ===== Show Pokémon details =====
function showPokemonDetails(revealed = false) {
  const stats = document.getElementById("pokedexStats");
  const lore = document.getElementById("pokedexLore");
  if (!stats || !lore) return;

  if (!revealed) {
    stats.innerHTML = `<strong>Name:</strong> ???<br><strong>Type:</strong> ${currentPokemon.type.join(
      ", "
    )}<br><strong>Height:</strong> ${
      currentPokemon.height
    } m<br><strong>Weight:</strong> ${currentPokemon.weight} kg`;
    lore.innerText = "???";
  } else {
    stats.innerHTML = `<strong>Name:</strong> ${
      currentPokemon.name
    }<br><strong>Species:</strong> ${
      currentPokemon.species
    }<br><strong>Type:</strong> ${currentPokemon.type.join(
      ", "
    )}<br><strong>Height:</strong> ${
      currentPokemon.height
    } m<br><strong>Weight:</strong> ${currentPokemon.weight} kg`;
    lore.innerText = currentPokemon.lore;
  }
}

/// ===== Reveal Pokémon =====
function revealPokemon(correct = false) {
  const img = document.getElementById("pokemonImg");
  img.style.transition = "filter 1s, transform 1s";
  img.style.filter = "brightness(1)";
  img.style.transform = "scale(1.1)";

  if (correct) correctSound.play();

  const details = document.getElementById("details");
  details.innerHTML = `
    <strong>Name:</strong> ${currentPokemon.name}<br>
    <strong>Type:</strong> ${currentPokemon.type.join(", ")}<br>
    <strong>Height:</strong> ${currentPokemon.height} m<br>
    <strong>Weight:</strong> ${currentPokemon.weight} kg<br>
    <strong>ID:</strong> ${currentPokemon.id}
  `;
}

// ===== Initialize =====
if (document.getElementById("pokedex")) {
  pickPokemon();
  bgMusic.play().catch(() => {});
  updateScore();
  updateTimer();
}
