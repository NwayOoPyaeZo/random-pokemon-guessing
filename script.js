let currentPokemon;
let score = 0;
let streak = 0;
let timer = 30;
let timerInterval;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const themeAudio = document.getElementById("themeAudio");
const pokeCry = document.getElementById("pokeCry");
const whosThatAudio = document.getElementById("whosThatAudio");

themeAudio.volume = 0.3;
whosThatAudio.volume = 0.5;

// Fetch Pokémon + species info for lore
async function getRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1; // Kanto only
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();
  const flavorEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
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

// Timer functions
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
  timerEl.innerText = `Time: ${timer}s`;
  timerEl.style.color = timer <= 10 ? "#ff4444" : "#ff4444";
}

// Score display
function updateScore() {
  document.getElementById(
    "score"
  ).innerText = `Score: ${score} | Streak: ${streak}`;
}

// Pick a new Pokémon
async function pickPokemon() {
  clearInterval(timerInterval);
  document.getElementById("result").innerText = "";
  document.getElementById("guess").value = "";
  document.getElementById("guess").focus();

  currentPokemon = await getRandomPokemon();

  // Play "Who's That Pokémon?" sound
  whosThatAudio.currentTime = 0;
  whosThatAudio.play();

  // Display silhouette
  const img = document.getElementById("pokemonImg");
  img.src = currentPokemon.img;
  img.style.filter = "brightness(0) saturate(100%) contrast(200%) blur(1px)";
  img.style.transform = "scale(1)";
  img.classList.remove("revealed");

  // Show stats with ??? for name and lore
  showPokemonDetails(false);

  startTimer();
}
// Back button to intro page
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "intro.html";
});


// Show Pokémon stats and lore
function showPokemonDetails(revealed = false) {
  const stats = document.getElementById("pokedexStats");
  const lore = document.getElementById("pokedexLore");

  if (!revealed) {
    stats.innerHTML = `
      <strong>Name:</strong> ???<br>
      <strong>Type:</strong> ${currentPokemon.type.join(", ")}<br>
      <strong>Height:</strong> ${currentPokemon.height} m<br>
      <strong>Weight:</strong> ${currentPokemon.weight} kg
    `;
    lore.innerText = "???";
  } else {
    stats.innerHTML = `
      <strong>Name:</strong> ${currentPokemon.name}<br>
      <strong>Species:</strong> ${currentPokemon.species}<br>
      <strong>Type:</strong> ${currentPokemon.type.join(", ")}<br>
      <strong>Height:</strong> ${currentPokemon.height} m<br>
      <strong>Weight:</strong> ${currentPokemon.weight} kg
    `;
    lore.innerText = currentPokemon.lore;
  }
}

// Reveal Pokémon and play cry after user interaction
function revealPokemon(correct = false, timeUp = false) {
  const img = document.getElementById("pokemonImg");

  // Reveal the Pokémon visually
  img.classList.add("revealed");
  img.style.filter = "brightness(1)";
  img.style.transform = "scale(1.1)";

  // Play correct/wrong sound immediately
  if (correct) correctSound.play();
  else wrongSound.play();

  // Show full stats and lore
  showPokemonDetails(true);

  // Stop previous cry if still playing
  pokeCry.pause();
  pokeCry.currentTime = 0;

  // Play Pokémon cry after a short delay
  setTimeout(() => {
    pokeCry.src = `https://play.pokemoncries.vercel.app/${currentPokemon.id}.wav`;
    pokeCry
      .play()
      .catch((err) =>
        console.log(`Audio failed for Pokémon ID ${currentPokemon.id}:`, err)
      );
  }, 800);
}

// Event listeners
document.getElementById("checkBtn").addEventListener("click", () => {
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  if (!currentPokemon || guess === "") return;

  clearInterval(timerInterval);

  if (guess === currentPokemon.name) {
    score++;
    streak++;
    document.getElementById("result").innerText = "Correct!";
    revealPokemon(true);
  } else {
    streak = 0;
    document.getElementById(
      "result"
    ).innerText = `Wrong! It was ${currentPokemon.name}`;
    revealPokemon(false);
  }

  updateScore();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  pickPokemon();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  score = 0;
  streak = 0;
  updateScore();
  pickPokemon();
});

// Initialize game
pickPokemon();
themeAudio.play();
updateScore();
updateTimer();
