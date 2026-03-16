// =========================================
// 🌙 DARK MODE LOGIC
// =========================================
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
} else {
    if (document.documentElement.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        let theme = 'light';
        
        if (document.documentElement.classList.contains('dark-mode')) {
            theme = 'dark';
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        localStorage.setItem('theme', theme);
    });
}

// =========================================
// 🔊 SONIDOS UI Y CONFIG
// =========================================
const sounds = {
    pomodoro: { start: new Audio("sounds/start.mp3"), end: new Audio("sounds/end.mp3") },
    break: { start: new Audio("sounds/break_start.mp3"), end: new Audio("sounds/break_end.mp3") },
    long: { start: new Audio("sounds/long_start.mp3"), end: new Audio("sounds/long_end.mp3") }
};

const playlist = [
    { title: " ( interstellar main theam)", artist: "interstellar", cover: "cover/Interstellar_Cover.jpg", src: "music/S-T-A-Y.mp3" },
    { title: "Lo-Fi Study", artist: "Chill Beats", cover: "cover/cover2.jpg", src: "music/lofi4.mp3" },
    { title: "Deep Work", artist: "Ambient Nature", cover: "cover/cover3.jpg", src: "music/lofi7.mp3" },
    { title: "404 Peace Not Found", artist: "Low Signal", cover: "cover/cover4.jpg", src: "music/404 Peace Not Found.mp3" },
    { title: "Heavy Rain", artist: "Lofi HipHop", cover: "cover/cover5.jpg", src: "music/Heavy Rain Lofi HipHop.mp3" },
    { title: "Tokyo Lofi Study ", artist: "Chillhop Music", cover: "cover/tokyocover.jpg", src: "music/ＴＯＫＹＯ Lofi.mp3" }
];

const ambientPlayer = new Audio();
ambientPlayer.loop = true;

// =========================================
// 🧩 ELEMENTOS DEL DOM
// =========================================
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const modeText = document.getElementById("modeText");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const ring = document.querySelector(".ring-progress");
const modeButtons = document.querySelectorAll(".mode-btn");

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.getElementById("progressFill");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const songCover = document.getElementById("song-cover");
const playlistContainer = document.getElementById("playlist");
const ambientDrawer = document.getElementById("ambientDrawer");

// =========================================
// ⚙️ VARIABLES DE ESTADO
// =========================================
let timer = null;
let totalTime = 25 * 60;
let timeLeft = totalTime;
let isRunning = false;
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
const FULL_DASH = 628;




// --- COPIA ESTE BLOQUE AQUÍ ---
let sessionsCompletedToday = parseInt(localStorage.getItem('sessionsCompleted')) || 0;
const lastSessionDate = localStorage.getItem('lastSessionDate');
const today = new Date().toDateString();

// Reinicio automático si el día cambió
if (lastSessionDate !== today) {
    sessionsCompletedToday = 0;
    localStorage.setItem('sessionsCompleted', 0);
    localStorage.setItem('lastSessionDate', today);
}
const SESSIONS_GOAL = 8;
// ------------------------------

// =========================================
// 🌲 LÓGICA DE SONIDOS AMBIENTALES
// =========================================
const ambientSoundsData = [
    { name: "Rain", audio: new Audio("sounds/rain.wav") },
    { name: "Forest", audio: new Audio("sounds/forest.wav") },
    { name: "Thunder", audio: new Audio("sounds/thunder.wav") },
    { name: "wind", audio: new Audio("sounds/wind.wav") }
];

let isAmbientPlaying = false;
ambientSoundsData.forEach(sound => {
    sound.audio.loop = true;
    sound.audio.volume = 0.5;
});

const ambientControlsContainer = document.getElementById("ambientControls");
const ambientBtn = document.getElementById("ambientkBtn"); 
const closeAmbient = document.getElementById("closeAmbient");
const toggleAmbientPlayBtn = document.getElementById("play-ambientkBtn");

toggleAmbientPlayBtn.addEventListener("click", () => {
    isAmbientPlaying = !isAmbientPlaying;
    toggleAmbientPlayBtn.classList.toggle("active", isAmbientPlaying);
    ambientSoundsData.forEach(sound => {
        if (isAmbientPlaying) {
            sound.audio.play().catch(e => console.log(e));
        } else {
            sound.audio.pause();
        }
    });
});

ambientBtn.addEventListener("click", () => ambientDrawer.classList.add("open"));
closeAmbient.addEventListener("click", () => ambientDrawer.classList.remove("open"));

// =========================================
// 📝 LÓGICA DE TAREAS (NOTAS)
// =========================================
const taskBtn = document.getElementById('taskBtn');
const tasksDrawer = document.getElementById('tasksDrawer');
const closeTasks = document.getElementById('closeTasks');
const drawerOverlay = document.getElementById('drawerOverlay');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const tasksList = document.getElementById('tasksList');
const completedCount = document.getElementById('completedCount');

taskBtn.addEventListener('click', () => {
    tasksDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
});

closeTasks.addEventListener('click', () => {
    tasksDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
});

drawerOverlay.addEventListener('click', () => {
    tasksDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
});

let tasks = JSON.parse(localStorage.getItem('pomora_tasks')) || [];

function saveTasks() {
    localStorage.setItem('pomora_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    tasksList.innerHTML = '';
    let completed = 0;
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info-content">
                <span class="checkbox">${task.completed ? '✓' : ''}</span>
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-task">✕</button>
        `;
        li.querySelector('.task-info-content').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        });
        li.querySelector('.delete-task').addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
        });
        tasksList.appendChild(li);
        if (task.completed) completed++;
    });
    completedCount.textContent = completed;
}

function addNewTask() {
    const text = taskInput.value.trim();
    if (text !== "") {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        saveTasks();
    }
}

addTaskBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewTask();
});

function renderAmbientSliders() {
    ambientControlsContainer.innerHTML = "";
    ambientSoundsData.forEach((sound) => {
        const wrapper = document.createElement("div");
        wrapper.className = "ambient-slider-wrapper";
        wrapper.innerHTML = `
            <label>${sound.name}</label>
            <input type="range" class="ambient-slider" min="0" max="1" step="0.1" value="${sound.audio.volume}">
        `;
        const slider = wrapper.querySelector(".ambient-slider");
        slider.addEventListener("input", (e) => {
            const vol = parseFloat(e.target.value);
            sound.audio.volume = vol;
            if (isAmbientPlaying && vol > 0 && sound.audio.paused) {
                sound.audio.play().catch(e => console.log(e));
            } else if (vol === 0) {
                sound.audio.pause();
            }
        });
        ambientControlsContainer.appendChild(wrapper);
    });
}

// =========================================
// 🕒 LÓGICA DEL TEMPORIZADOR
// =========================================
function updateDisplay() {
    minutesEl.textContent = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    secondsEl.textContent = String(timeLeft % 60).padStart(2, "0");
}

function updateRing() {
    ring.style.strokeDashoffset = FULL_DASH * (1 - timeLeft / totalTime);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "▶ Start Session";
    } else {
        playUISound('start');
        isRunning = true;
        startBtn.textContent = "⏸ Pause Session";
        
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                updateRing();
            } else {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = "▶ Start Session";
                playUISound('end');

                const activeBtn = document.querySelector(".mode-btn.active");
                const currentMode = activeBtn ? activeBtn.dataset.mode : "pomodoro";

                if (currentMode === "pomodoro") {
                    if (Notification.permission === "granted") {
                        new Notification("¡Pomodoro finalizado! 🎉", { 
                            body: "Es hora de un descanso de 5 minutos.",
                            icon: 'logo-img.png' 
                        });
                    }
                    sessionsCompletedToday++;
                    localStorage.setItem('sessionsCompleted', sessionsCompletedToday);
                    updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));
                    setMode("short");
                } else {
                    if (Notification.permission === "granted") {
                        new Notification("¡Descanso terminado! 🚀", { 
                            body: "Es hora de volver a enfocarse.",
                            icon: 'logo.png'
                        });
                    }
                    setMode("pomodoro");

// ... dentro del else donde termina el tiempo ...
if (currentMode === "pomodoro") {
    // ... notificaciones y progreso ...
    setMode("short"); // Cambia el tiempo a 5:00
    
    //  PARA QUE EL DESCANSO EMPIECE SOLO:
    setTimeout(() => {
        toggleTimer(); 
    }, 500); // Un pequeño retraso para que el usuario note el cambio
    
} else {
    // ... notificaciones ...
    setMode("pomodoro"); // Cambia el tiempo a 25:00
    
    // para QUE EL TRABAJO EMPIECE SOLO:
    setTimeout(() => {
        toggleTimer();
    }, 500);
}

                }
            }
        }, 1000);
    }
}



function playUISound(type = 'start') {
    const activeBtn = document.querySelector(".mode-btn.active");
    const mode = activeBtn ? activeBtn.dataset.mode : "pomodoro";
    const soundMode = mode === "pomodoro" ? "pomodoro" : (mode === "short" ? "break" : "long");
    if (sounds[soundMode] && sounds[soundMode][type]) {
        sounds[soundMode][type].currentTime = 0;
        sounds[soundMode][type].play().catch(() => {});
    }
}

function setMode(mode) {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "▶ Start Session";
    modeButtons.forEach(btn => btn.classList.remove("active"));
    const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (targetBtn) targetBtn.classList.add("active");

    if (mode === "pomodoro") { totalTime = 25 * 60; modeText.textContent = "Tiempo de enfoque"; }
    else if (mode === "short") { totalTime = 5 * 60; modeText.textContent = "Descanso corto"; }
    else { totalTime = 15 * 60; modeText.textContent = "Descanso largo"; }

    timeLeft = totalTime;
    updateDisplay();
    updateRing();
}

// Nueva función de progreso
function updateDailyProgress(porcentaje) {
  const valorReal = Math.min(Math.max(porcentaje, 0), 100);
  document.getElementById('dailyPercent').innerText = `${valorReal}%`;
  document.querySelector('.daily-fill').style.width = `${valorReal}%`;
}

// =========================================
// 🎵 LÓGICA DEL REPRODUCTOR
// =========================================
function loadSong(index) {
    songIndex = index;
    const song = playlist[songIndex];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songCover.src = song.cover;
    audio.src = song.src;
    audio.load();
    updateActiveSongUI();
}

function renderPlaylist() {
    playlistContainer.innerHTML = "";
    playlist.forEach((song, index) => {
        const li = document.createElement("li");
        li.classList.add("track");
        if (index === songIndex) li.classList.add("active");
        li.innerHTML = `
            <img src="${song.cover}" alt="cover" class="track-img">
            <div class="track-info">
                <span class="track-name">${song.title}</span>
                <span class="track-artist">${song.artist}</span>
            </div>
        `;
        li.addEventListener("click", () => {
            loadSong(index);
            audio.play();
            updatePlayIcon(true);
        });
        playlistContainer.appendChild(li);
    });
}

function updateActiveSongUI() {
    const tracks = document.querySelectorAll(".track");
    tracks.forEach((track, index) => {
        track.classList.toggle("active", index === songIndex);
    });
}

function updatePlayIcon(isPlaying) {
    if (isPlaying) {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                <rect x="14" y="5" width="4" height="14" rx="1"></rect>
            </svg>`;
    } else {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"></path>
            </svg>`;
    }
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        updatePlayIcon(true);
    } else {
        audio.pause();
        updatePlayIcon(false);
    }
});

function nextTrack() {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * playlist.length);
    } else {
        songIndex = (songIndex + 1) % playlist.length;
    }
    loadSong(songIndex);
    audio.play();
    updatePlayIcon(true);
}

nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", () => {
    songIndex = (songIndex - 1 + playlist.length) % playlist.length;
    loadSong(songIndex);
    audio.play();
    updatePlayIcon(true);
});

shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active-control", isShuffle);
});

repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active-control", isRepeat);
});

audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextTrack();
    }
});

progressBar.addEventListener("click", (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
    }
});

volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
        document.getElementById("duration").textContent = formatTime(audio.duration);
    }
});

function formatTime(time) {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

// =========================================
// 🚀 EVENTOS DE UI Y CAJONES
// =========================================
startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = totalTime;
    updateDisplay();
    updateRing();
    startBtn.textContent = "▶ Start Session";
});

modeButtons.forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));

const soundBtn = document.getElementById("soundBtn");
const playerDrawer = document.getElementById("playerDrawer");
const closePlayer = document.getElementById("closePlayer");

soundBtn.addEventListener("click", () => playerDrawer.classList.add("open"));
closePlayer.addEventListener("click", () => playerDrawer.classList.remove("open"));


// Cierre unificado para el overlay
drawerOverlay.addEventListener('click', () => {
    playerDrawer.classList.remove('open');
    tasksDrawer.classList.remove('open'); // Si también tienes el de tareas
    drawerOverlay.classList.remove('active');
});

// Asegura que el botón de cierre dentro del reproductor funcione
closePlayer.addEventListener("click", () => {
    playerDrawer.classList.remove("open");
    drawerOverlay.classList.remove('active');
});

// 🚀 INICIALIZACIÓN )
// =========================================

renderPlaylist();
loadSong(0);
setMode("pomodoro");
renderAmbientSliders();
renderTasks();

// Carga inicial del progreso (SOLO UNA VEZ AQUÍ)
updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));