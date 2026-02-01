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
// 🎵 MÚSICA LOFI (FIX FINAL)
// =========================
const lofiTracks = [
    "music/lofi2.mp3",
    "music/lofi3.mp3",
    "music/lofi4.mp3",
    "music/lofi5.mp3",
    "music/lofi6.mp3",
    "music/lofi7.mp3",
    "music/lofi8.mp3",
];

let lofiAudio = new Audio();
lofiAudio.volume = 0.5;
lofiAudio.preload = "auto";

let lofiEnabled = true;
let audioUnlocked = false;
let lastTrack = -1;

function loadRandomTrack() {
    let random;
    do {
        random = Math.floor(Math.random() * lofiTracks.length);
    } while (random === lastTrack && lofiTracks.length > 1);

    lastTrack = random;
    lofiAudio.src = lofiTracks[random];
    lofiAudio.load();
}

function playLofi() {
    if (!lofiEnabled || !isRunning || !audioUnlocked) return;

    if (!lofiAudio.src) {
        loadRandomTrack();
    }

    if (lofiAudio.paused) {
        lofiAudio.play().catch(() => {});
    }
}

function stopLofi() {
    lofiAudio.pause();
    lofiAudio.currentTime = 0;
}

lofiAudio.addEventListener("ended", () => {
    if (lofiEnabled && isRunning && audioUnlocked) {
        loadRandomTrack();
        lofiAudio.play().catch(() => {});
    }
});

// =========================
// 🔘 BOTÓN LOFI
// =========================
const soundBtn = document.getElementById("soundBtn");
const soundIcon = document.getElementById("soundIcon");

soundBtn?.addEventListener("click", () => {
    lofiEnabled = !lofiEnabled;

    if (!lofiEnabled) {
        stopLofi();
    } else {
        playLofi();
    }

    soundIcon.innerHTML = lofiEnabled
        ? `<path d="M11 5l-5 4H3v6h3l5 4z"/>
           <path d="M19 5a7 7 0 0 1 0 14"/>
           <path d="M15 9a3 3 0 0 1 0 6"/>`
        : `<path d="M11 5l-5 4H3v6h3l5 4z"/>
           <line x1="23" y1="9" x2="17" y2="15"/>
           <line x1="17" y1="9" x2="23" y2="15"/>`;
});

// =========================
// 🔁 MAPEO MODOS
// =========================
function getSoundMode(mode) {
    if (mode === "pomodoro") return "pomodoro";
    if (mode === "short") return "break";
    if (mode === "long") return "long";
}

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
// ⚙️ VARIABLES TIMER
// =========================
const FULL_DASH = 628;
let timer = null;
let totalTime = 25 * 60;
let timeLeft = totalTime;
let isRunning = false;

// =========================
// 🎨 MODOS
// =========================
function setMode(mode) {
    clearInterval(timer);
    stopLofi();
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

function updateRing() {
    ring.style.strokeDashoffset = FULL_DASH * (1 - timeLeft / totalTime);
}

// =========================
// ▶️ TIMER
// =========================
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        stopLofi();
        isRunning = false;
        startBtn.textContent = "▶ Start Session";
        return;
    }

    const mode = document.querySelector(".mode-btn.active")?.dataset.mode;
    const soundMode = getSoundMode(mode);

    if (timeLeft === totalTime) {
        playUISound(soundMode, "start");
    }

    isRunning = true;
    playLofi();
    startBtn.textContent = "⏸ Pause";

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            updateRing();
        } else {
            clearInterval(timer);
            isRunning = false;

            playUISound(soundMode, "end");
            stopLofi();

            if (mode === "pomodoro") {
                setTimeout(() => {
                    setMode("short");
                    toggleTimer();
                }, 800);
            }

            startBtn.textContent = "▶ Start Session";
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    stopLofi();
    isRunning = false;
    timeLeft = totalTime;
    updateDisplay();
    updateRing();
    startBtn.textContent = "▶ Start Session";
}

// =========================
// 🎯 EVENTOS TIMER (CLAVE)
// =========================
startBtn.addEventListener("click", () => {
    audioUnlocked = true;

    if (!lofiAudio.src) {
        loadRandomTrack();
    }

    toggleTimer();
});

resetBtn.addEventListener("click", resetTimer);
modeButtons.forEach(btn =>
    btn.addEventListener("click", () => setMode(btn.dataset.mode))
);

// =========================
// 🚀 INICIO
// =========================
setMode("pomodoro");









