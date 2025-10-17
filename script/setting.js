// Safely attach settings behavior after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const settingsBtn = document.querySelector(".footer-left");
  const modal = document.getElementById("settingsModal");
  const closeBtn = document.getElementById("closeSettings");
  const toggleMusic = document.getElementById("toggleMusic");
  const toggleSound = document.getElementById("toggleSound");

  // Volume sliders
  const musicVolume = document.getElementById("musicVolume");
  const sfxVolume = document.getElementById("sfxVolume");

  // Audio references
  const themeAudio = document.getElementById("themeAudio"); 
  const whosThatAudio = document.getElementById("whosThatAudio"); 

  // Guard: check if Settings UI exists
  if (!settingsBtn || !modal) {
    console.warn(
      "Settings UI not found on this page; skipping settings initialization."
    );
    return;
  }

  // Initialize controls from saved settings (localStorage)
  try {
    const savedBgVolume = localStorage.getItem("bgMusicVolume");
    const savedSfxVolume = localStorage.getItem("sfxVolume");
    const savedBgMuted = localStorage.getItem("bgMusicMuted");
    const savedSfxMuted = localStorage.getItem("sfxMuted");

    if (musicVolume && savedBgVolume !== null) musicVolume.value = savedBgVolume;
    if (sfxVolume && savedSfxVolume !== null) sfxVolume.value = savedSfxVolume;
    if (toggleMusic && savedBgMuted !== null) {
      try { toggleMusic.checked = !JSON.parse(savedBgMuted); } catch (e) { /* ignore parse errors */ }
    }
    if (toggleSound && savedSfxMuted !== null) {
      try { toggleSound.checked = !JSON.parse(savedSfxMuted); } catch (e) { /* ignore parse errors */ }
    }
  } catch (e) {
    console.warn('Could not read audio settings from localStorage', e);
  }

  // Open settings popup
  settingsBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close popup
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close when clicking outside the modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Toggle background music
  if (toggleMusic && themeAudio) {
    toggleMusic.addEventListener("change", () => {
      themeAudio.muted = !toggleMusic.checked;
      try {
        // store whether muted (true/false)
        localStorage.setItem("bgMusicMuted", themeAudio.muted);
      } catch (e) {}
    });
  }

  //Toggle sound effects
  if (toggleSound && whosThatAudio) {
    toggleSound.addEventListener("change", () => {
      whosThatAudio.muted = !toggleSound.checked;
      try {
        localStorage.setItem("sfxMuted", whosThatAudio.muted);
      } catch (e) {}
      // Also update mute icon on the page if present
      const muteIcon = document.getElementById("muteIcon");
      if (muteIcon) muteIcon.innerText = whosThatAudio.muted ? "🔇" : "🔊";
      // update other SFX elements
      const correctSound = document.getElementById("correctSound");
      const wrongSound = document.getElementById("wrongSound");
      const pokeCry = document.getElementById("pokeCry");
      [correctSound, wrongSound, pokeCry].forEach((a) => {
        if (a) a.muted = whosThatAudio.muted;
      });
    });
  }

  //Adjust background music volume
  if (musicVolume && themeAudio) {
    themeAudio.volume = musicVolume.value; 
    musicVolume.addEventListener("input", () => {
      themeAudio.volume = musicVolume.value;
      try {
        localStorage.setItem("bgMusicVolume", musicVolume.value);
      } catch (e) {}
    });
  }

  //Adjust sound effects volume
  if (sfxVolume && whosThatAudio) {
    whosThatAudio.volume = sfxVolume.value; 
    sfxVolume.addEventListener("input", () => {
      whosThatAudio.volume = sfxVolume.value;
      try {
        localStorage.setItem("sfxVolume", sfxVolume.value);
      } catch (e) {}
    });
  }
});
