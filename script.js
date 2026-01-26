
// =========================
// 🔊 SONIDOS UI
// =========================
const sounds = {
  pomodoro: {
    start: new Audio("sounds/start.mp3"),
    end: new Audio("sounds/end.mp3")
  },
  break: {
    start: new Audio("sounds/break_start.mp3"),
    end: new Audio("sounds/break_end.mp3")
  },
  long: {
    start: new Audio("sounds/long_start.mp3"),
    end: new Audio("sounds/long_end.mp3")
  }
};

function playUISound(type, action) {
  if (!type || !sounds[type]) return;
  const sound = sounds[type][action];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// =========================
// 🎵 LOFI
// =========================
let lofiAudio = new Audio();
lofiAudio.volume = 0.5;
lofiAudio.loop = true;

let lofiEnabled = true;
let lofiStarted = false;

// =========================
// 🧩 ELEMENTOS
// =========================
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const modeText = document.getElementById("modeText");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const ring = document.querySelector(".ring-progress");
const modeButtons = document.querySelectorAll(".mode-btn");

// =========================
// ⚙️ ANILLO SVG (FIX)
/// =========================
const radius = 100;
const FULL_DASH = 2 * Math.PI * radius;

ring.style.strokeDasharray = FULL_DASH;
ring.style.strokeDashoffset = 0;

// =========================
// ⚙️ TIMER
// =========================
let timer = null;
let totalTime = 25 * 60;
let timeLeft = totalTime;
let isRunning = false;

// =========================
// 🎨 MODOS
// =========================
function setMode(mode) {
  clearInterval(timer);
  isRunning = false;

  modeButtons.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

  if (mode === "pomodoro") {
    totalTime = 25 * 60;
    modeText.textContent = "Tiempo de enfoque";
  }

  if (mode === "short") {
    totalTime = 5 * 60;
    modeText.textContent = "Short Break";
  }

  if (mode === "long") {
    totalTime = 15 * 60;
    modeText.textContent = "Long Break";
  }

  timeLeft = totalTime;
  updateDisplay();
  updateRing();
  startBtn.textContent = "▶ Start Session";
}

// =========================
// 🕒 DISPLAY
// =========================
function updateDisplay() {
  minutesEl.textContent = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  secondsEl.textContent = String(timeLeft % 60).padStart(2, "0");
}

// =========================
// 🔴 ANILLO PROGRESO (FIX)
// =========================
function updateRing() {
  const progress = timeLeft / totalTime;
  ring.style.strokeDashoffset = FULL_DASH * (1 - progress);
}

// =========================
// ▶️ TIMER
// =========================
function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "▶ Start Session";
    return;
  }

  isRunning = true;
  startBtn.textContent = "⏸ Pause";

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      updateRing();
    } else {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "▶ Start Session";
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = totalTime;
  updateDisplay();
  updateRing();
  startBtn.textContent = "▶ Start Session";
}

// =========================
// 🎯 EVENTOS
// =========================
startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
modeButtons.forEach(btn =>
  btn.addEventListener("click", () => setMode(btn.dataset.mode))
);

// =========================
// 🚀 INICIO
// =========================
setMode("pomodoro");

