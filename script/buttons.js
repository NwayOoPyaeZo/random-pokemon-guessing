// ===== Button Logic =====

// Intro screen: Start Game button
const startBtn = document.getElementById("startGameBtn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    // get element on-demand to avoid redeclaring a global const that script.js also defines
    const whosThatAudio = document.getElementById("whosThatAudio");
    if (whosThatAudio) {
      whosThatAudio.currentTime = 0;
      whosThatAudio.play().finally(() => {
        window.location.href = "main.html";
      });
    } else {
      // fallback navigation if audio element isn't present
      window.location.href = "main.html";
    }
  });
}

// Main game buttons
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

// ===== Event Listeners =====

// Check answer
checkBtn?.addEventListener("click", () => {
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

// Next Pokémon
nextBtn?.addEventListener("click", pickPokemon);

// Reset game
resetBtn?.addEventListener("click", () => {
  score = 0;
  streak = 0;
  updateScore();
  pickPokemon();
});

// Go back to home
document.getElementById("backBtn")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
