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
// 🎵 MÚSICA LOFI (FIX)
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
let lastTrack = -1;

function playLofi() {
    if (!lofiEnabled || !isRunning) return;

    let random;
    do {
        random = Math.floor(Math.random() * lofiTracks.length);
    } while (random === lastTrack && lofiTracks.length > 1);

    lastTrack = random;
    lofiAudio.src = lofiTracks[random];
    lofiAudio.load();
    lofiAudio.play().catch(() => {});
}

function stopLofi() {
    lofiAudio.pause();
    lofiAudio.currentTime = 0;
}

lofiAudio.addEventListener("ended", () => {
    if (lofiEnabled && isRunning) {
        playLofi();
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
    } else if (isRunning) {
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
// 🎯 EVENTOS TIMER
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

// =========================
// 📝 DRAWER TAREAS
// =========================
const taskBtn = document.getElementById("taskBtn");
const tasksDrawer = document.getElementById("tasksDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeTasks = document.getElementById("closeTasks");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const tasksList = document.getElementById("tasksList");
const completedCountEl = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("pomoraTasks")) || [];

// =========================
// 📂 DRAWER
// =========================
taskBtn.addEventListener("click", () => {
    tasksDrawer.classList.add("open");
    drawerOverlay.classList.add("show");
    taskInput.focus();
});

function closeDrawer() {
    tasksDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
}

closeTasks.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// =========================
// ➕ TAREAS
// =========================
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

// =========================
// 💾 STORAGE
// =========================
function saveTasks() {
    localStorage.setItem("pomoraTasks", JSON.stringify(tasks));
}

function updateCompletedCount() {
    completedCountEl.textContent =
        tasks.filter(t => t.completed).length;
}

// =========================
// 🎉 CONFETI
// =========================
function launchConfetti() {
    const colors = ["#facc15", "#4f46e5", "#22c55e", "#ef4444", "#ec4899"];
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;

    for (let i = 0; i < 25; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = cx + "px";
        c.style.top = cy + "px";
        c.style.setProperty("--x", `${(Math.random() - 0.5) * 300}px`);
        c.style.setProperty("--y", `${Math.random() * 300}px`);
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 900);
    }
}

// =========================
// 🧾 RENDER TAREAS
// =========================
function renderTasks() {
    tasksList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
          <label class="task-label">
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span>${task.text}</span>
          </label>
          <button class="delete">🗑️</button>
        `;

        li.querySelector("input").addEventListener("change", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            if (task.completed) launchConfetti();
        });

        li.querySelector(".delete").addEventListener("click", () => {
            li.classList.add("removing");
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            }, 250);
        });

        tasksList.appendChild(li);
    });

    updateCompletedCount();
}

renderTasks();








