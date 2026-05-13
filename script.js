// =========================================
// 🌙 DARK MODE
// =========================================
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function applyThemeIcons(isDark) {
    if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
}

const savedTheme = localStorage.getItem('theme');
const isDarkOnLoad = savedTheme === 'dark';
if (isDarkOnLoad) document.documentElement.classList.add('dark-mode');
applyThemeIcons(isDarkOnLoad);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        applyThemeIcons(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// =========================================
// 🔊 SONIDOS UI
// =========================================
const sounds = {
    pomodoro: {
        start: new Audio('sounds/start.mp3'),
        end:   new Audio('sounds/end.mp3')
    },
    break: {
        start: new Audio('sounds/break_start.mp3'),
        end:   new Audio('sounds/break_end.mp3')
    },
    long: {
        start: new Audio('sounds/long_start.mp3'),
        end:   new Audio('sounds/long_end.mp3')
    }
};

function playUISound(type = 'start') {
    const activeBtn = document.querySelector('.mode-btn.active');
    const mode = activeBtn ? activeBtn.dataset.mode : 'pomodoro';
    const key = mode === 'pomodoro' ? 'pomodoro' : (mode === 'short' ? 'break' : 'long');
    const sound = sounds[key]?.[type];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// =========================================
// 🎵 PLAYLIST
// =========================================
const playlist = [
    { title: 'Interstellar Main Theme', artist: 'Interstellar',       cover: 'cover/Interstellar_Cover.jpg', src: 'music/S-T-A-Y.mp3' },
    { title: 'Lo-Fi Study',             artist: 'Chill Beats',        cover: 'cover/cover2.jpg',             src: 'music/lofi4.mp3' },
    { title: 'Deep Work',               artist: 'Ambient Nature',     cover: 'cover/cover3.jpg',             src: 'music/lofi7.mp3' },
    { title: '404 Peace Not Found',     artist: 'Low Signal',         cover: 'cover/cover4.jpg',             src: 'music/404 Peace Not Found.mp3' },
    { title: 'Heavy Rain',              artist: 'Lofi HipHop',        cover: 'cover/cover5.jpg',             src: 'music/Heavy Rain Lofi HipHop.mp3' },
    { title: 'Tokyo Lofi Study',        artist: 'Chillhop Music',     cover: 'cover/tokyocover.jpg',         src: 'music/ＴＯＫＹＯ Lofi.mp3' }
];

// =========================================
// 🌲 SONIDOS AMBIENTALES
// =========================================
const ambientSoundsData = [
    { name: 'Rain',    audio: new Audio('sounds/rain.wav') },
    { name: 'Forest',  audio: new Audio('sounds/forest.wav') },
    { name: 'Thunder', audio: new Audio('sounds/thunder.wav') },
    { name: 'Wind',    audio: new Audio('sounds/wind.wav') }
];

// Precargamos y configuramos cada pista ambiental
ambientSoundsData.forEach(s => {
    s.audio.loop = true;
    s.audio.volume = 0.5;
    // preload para que no tarde al primer play
    s.audio.preload = 'auto';
    s.enabled = false; // estado independiente por pista
});

let isAmbientPlaying = false;

// =========================================
// 🧩 ELEMENTOS DEL DOM
// =========================================
const minutesEl   = document.getElementById('minutes');
const secondsEl   = document.getElementById('seconds');
const modeText    = document.getElementById('modeText');
const startBtn    = document.getElementById('startBtn');
const resetBtn    = document.getElementById('resetBtn');
const ring        = document.querySelector('.ring-progress');
const modeButtons = document.querySelectorAll('.mode-btn');

const audio            = document.getElementById('audioPlayer');
const playBtn          = document.getElementById('playBtn');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');
const shuffleBtn       = document.getElementById('shuffleBtn');
const repeatBtn        = document.getElementById('repeatBtn');
const volumeSlider     = document.getElementById('volumeSlider');
const progressBar      = document.querySelector('.progress-bar');
const progressFill     = document.getElementById('progressFill');
const songTitle        = document.getElementById('song-title');
const songArtist       = document.getElementById('song-artist');
const songCover        = document.getElementById('song-cover');
const playlistContainer = document.getElementById('playlist');

const playerDrawer   = document.getElementById('playerDrawer');
const soundBtn       = document.getElementById('soundBtn');
const closePlayer    = document.getElementById('closePlayer');

const ambientDrawer          = document.getElementById('ambientDrawer');
const ambientBtn             = document.getElementById('ambientkBtn');
const closeAmbient           = document.getElementById('closeAmbient');
const toggleAmbientPlayBtn   = document.getElementById('play-ambientkBtn');
const ambientControlsContainer = document.getElementById('ambientControls');

const taskBtn       = document.getElementById('taskBtn');
const tasksDrawer   = document.getElementById('tasksDrawer');
const closeTasks    = document.getElementById('closeTasks');
const drawerOverlay = document.getElementById('drawerOverlay');
const taskInput     = document.getElementById('taskInput');
const addTaskBtn    = document.getElementById('addTask');
const tasksList     = document.getElementById('tasksList');
const completedCount = document.getElementById('completedCount');

// =========================================
// ⚙️ ESTADO
// =========================================
let timer     = null;
let totalTime = 25 * 60;
let timeLeft  = totalTime;
let isRunning = false;
let songIndex = 0;
let isShuffle = false;
let isRepeat  = false;
const FULL_DASH = 628;

// Progreso diario
let sessionsCompletedToday = parseInt(localStorage.getItem('sessionsCompleted'), 10) || 0;
const lastSessionDate = localStorage.getItem('lastSessionDate');
const today = new Date().toDateString();
const SESSIONS_GOAL = 8;

if (lastSessionDate !== today) {
    sessionsCompletedToday = 0;
    localStorage.setItem('sessionsCompleted', 0);
    localStorage.setItem('lastSessionDate', today);
}

// =========================================
// 🔔 NOTIFICACIONES
// =========================================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'logo.png' });
    }
}

// =========================================
// 🕒 TEMPORIZADOR
// =========================================
function updateDisplay() {
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const ss = String(timeLeft % 60).padStart(2, '0');
    minutesEl.textContent = mm;
    secondsEl.textContent = ss;

    // Tiempo visible en la pestaña del navegador
    const activeBtn = document.querySelector('.mode-btn.active');
    const mode = activeBtn ? activeBtn.dataset.mode : 'pomodoro';
    const emoji = mode === 'pomodoro' ? '🍊' : (mode === 'short' ? '☕' : '🌿');
    document.title = isRunning ? `${emoji} ${mm}:${ss} — Pomora` : 'Pomora';
}

function updateRing() {
    ring.style.strokeDashoffset = FULL_DASH * (1 - timeLeft / totalTime);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = '▶ Start Session';
        ring.classList.remove('running');
        document.title = 'Pomora';
        return;
    }

    // Arrancar
    requestNotificationPermission();
    playUISound('start');
    isRunning = true;
    startBtn.textContent = '⏸ Pause Session';
    ring.classList.add('running');

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            updateRing();
            return;
        }

        // Tiempo agotado
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = '▶ Start Session';
        ring.classList.remove('running');
        document.title = 'Pomora';
        playUISound('end');

        const activeBtn = document.querySelector('.mode-btn.active');
        const currentMode = activeBtn ? activeBtn.dataset.mode : 'pomodoro';

        if (currentMode === 'pomodoro') {
            sendNotification('¡Pomodoro finalizado! 🎉', 'Es hora de un descanso de 5 minutos.');
            sessionsCompletedToday++;
            localStorage.setItem('sessionsCompleted', sessionsCompletedToday);
            updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));
            setMode('short');
        } else {
            sendNotification('¡Descanso terminado! 🚀', 'Es hora de volver a enfocarse.');
            setMode('pomodoro');
        }

        // Auto-arrancar el siguiente bloque después de un momento
        setTimeout(toggleTimer, 600);
    }, 1000);
}

function setMode(mode) {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = '▶ Start Session';

    modeButtons.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    if (mode === 'pomodoro') { totalTime = 25 * 60; modeText.textContent = 'Tiempo de enfoque'; }
    else if (mode === 'short') { totalTime = 5 * 60;  modeText.textContent = 'Descanso corto'; }
    else                       { totalTime = 15 * 60; modeText.textContent = 'Descanso largo'; }

    timeLeft = totalTime;
    updateDisplay();
    updateRing();
}

function updateDailyProgress(pct) {
    const val = Math.min(Math.max(pct, 0), 100);
    const percentEl = document.getElementById('dailyPercent');
    const fillEl    = document.querySelector('.daily-fill');
    if (percentEl) percentEl.textContent = `${val}%`;
    if (fillEl)    fillEl.style.width = `${val}%`;
}

// =========================================
// 🎵 REPRODUCTOR
// =========================================
function loadSong(index) {
    songIndex = index;
    const song = playlist[songIndex];
    songTitle.textContent  = song.title;
    songArtist.textContent = song.artist;
    songCover.src          = song.cover;
    audio.src              = song.src;
    audio.load();
    // Animación de swap en la cover
    songCover.classList.remove('swap');
    void songCover.offsetWidth; // reflow para reiniciar
    songCover.classList.add('swap');
    updateActiveSongUI();
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('track');
        if (index === songIndex) li.classList.add('active');
        li.innerHTML = `
            <img src="${song.cover}" alt="portada" class="track-img" loading="lazy">
            <div class="track-info">
                <span class="track-name">${song.title}</span>
                <span class="track-artist">${song.artist}</span>
            </div>
        `;
        li.addEventListener('click', () => {
            loadSong(index);
            audio.play();
            updatePlayIcon(true);
        });
        playlistContainer.appendChild(li);
    });
}

function updateActiveSongUI() {
    document.querySelectorAll('.track').forEach((track, i) => {
        track.classList.toggle('active', i === songIndex);
    });
}

function updatePlayIcon(playing) {
    playBtn.innerHTML = playing
        ? `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
}

function nextTrack() {
    songIndex = isShuffle
        ? Math.floor(Math.random() * playlist.length)
        : (songIndex + 1) % playlist.length;
    loadSong(songIndex);
    audio.play();
    updatePlayIcon(true);
}

playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); updatePlayIcon(true); }
    else              { audio.pause(); updatePlayIcon(false); }
});

nextBtn.addEventListener('click', nextTrack);

prevBtn.addEventListener('click', () => {
    // Si llevamos más de 3 s en la canción, volvemos al inicio; si no, canción anterior
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        songIndex = (songIndex - 1 + playlist.length) % playlist.length;
        loadSong(songIndex);
    }
    audio.play();
    updatePlayIcon(true);
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active-control', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active-control', isRepeat);
});

audio.addEventListener('ended', () => {
    if (isRepeat) { audio.currentTime = 0; audio.play(); }
    else          { nextTrack(); }
});

progressBar.addEventListener('click', e => {
    if (!audio.duration) return;
    audio.currentTime = (e.offsetX / progressBar.clientWidth) * audio.duration;
});

volumeSlider.addEventListener('input', e => { audio.volume = e.target.value; });

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    const curEl = document.getElementById('currentTime');
    const durEl = document.getElementById('duration');
    if (curEl) curEl.textContent = formatTime(audio.currentTime);
    if (durEl) durEl.textContent = formatTime(audio.duration);
});

function formatTime(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

// =========================================
// 🌲 SONIDOS AMBIENTALES
// =========================================
function renderAmbientSliders() {
    ambientControlsContainer.innerHTML = '';
    ambientSoundsData.forEach(sound => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ambient-slider-wrapper';
        wrapper.innerHTML = `
            <label>${sound.name}</label>
            <input type="range" class="ambient-slider" min="0" max="1" step="0.05" value="${sound.audio.volume}">
        `;
        const slider = wrapper.querySelector('.ambient-slider');
        slider.addEventListener('input', e => {
            const vol = parseFloat(e.target.value);
            sound.audio.volume = vol;

            if (vol > 0 && isAmbientPlaying && sound.audio.paused) {
                sound.audio.play().catch(() => {});
            } else if (vol === 0) {
                sound.audio.pause();
            }
        });
        ambientControlsContainer.appendChild(wrapper);
    });
}

// Play/pause global de ambiente: solo toca las pistas que tienen volumen > 0
toggleAmbientPlayBtn.addEventListener('click', () => {
    isAmbientPlaying = !isAmbientPlaying;
    toggleAmbientPlayBtn.classList.toggle('active', isAmbientPlaying);

    ambientSoundsData.forEach(sound => {
        if (isAmbientPlaying && sound.audio.volume > 0) {
            sound.audio.play().catch(() => {});
        } else {
            sound.audio.pause();
        }
    });
});

ambientBtn.addEventListener('click', () => {
    ambientDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
});

closeAmbient.addEventListener('click', () => {
    ambientDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
});

// =========================================
// 📝 TAREAS
// =========================================
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
            <button class="delete-task" aria-label="Eliminar tarea">✕</button>
        `;
        li.querySelector('.task-info-content').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        });
        li.querySelector('.delete-task').addEventListener('click', e => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
        });
        tasksList.appendChild(li);
        if (task.completed) completed++;
    });
    if (completedCount) completedCount.textContent = completed;
}

function addNewTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
}

addTaskBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addNewTask(); });

// =========================================
// 🚀 DRAWERS — APERTURA / CIERRE
// =========================================
function openDrawer(drawer) {
    drawer.classList.add('open');
    drawerOverlay.classList.add('active');
}

function closeAllDrawers() {
    playerDrawer.classList.remove('open');
    tasksDrawer.classList.remove('open');
    ambientDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
}

soundBtn.addEventListener('click',  () => openDrawer(playerDrawer));
closePlayer.addEventListener('click', closeAllDrawers);

taskBtn.addEventListener('click',   () => openDrawer(tasksDrawer));
closeTasks.addEventListener('click', closeAllDrawers);

drawerOverlay.addEventListener('click', closeAllDrawers);

// ─── Swipe hacia abajo para cerrar el player en móvil ───────────────────────
(function addSwipeToClose() {
    let startY = 0;
    playerDrawer.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    playerDrawer.addEventListener('touchend', e => {
        const dy = e.changedTouches[0].clientY - startY;
        if (dy > 80) closeAllDrawers(); // swipe hacia abajo ≥ 80px cierra
    }, { passive: true });
})();

// =========================================
// ⏱ CONTROLES DEL TIMER
// =========================================
startBtn.addEventListener('click', toggleTimer);

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = totalTime;
    updateDisplay();
    updateRing();
    startBtn.textContent = '▶ Start Session';
    ring.classList.remove('running');
    document.title = 'Pomora';
});

modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));

// =========================================
// 🚀 INICIALIZACIÓN
// =========================================
renderPlaylist();
loadSong(0);
setMode('pomodoro');
renderAmbientSliders();
renderTasks();
updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));