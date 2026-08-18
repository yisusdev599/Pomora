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
// 🌲 SONIDOS AMBIENTALES (Web Audio API)
// =========================================
const ambientSoundList = [
    { name: 'Rain',    src: 'sounds/rain.wav' },
    { name: 'Forest',  src: 'sounds/forest.wav' },
    { name: 'Thunder', src: 'sounds/thunder.wav' },
    { name: 'Wind',    src: 'sounds/wind.wav' }
];

let audioCtx = null;
let masterGain = null;
let masterVolume = parseFloat(localStorage.getItem('ambient_master_volume')) || 0.8;
let isAmbientPlaying = false;
let ambientSoundsData = [];

function ensureAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = masterVolume;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function isSoundPlaying(sound) {
    if (sound.source) return true;                 // pista Web Audio
    if (sound.audio)  return !sound.audio.paused;  // pista HTMLAudio (respaldo)
    return false;
}

// Pista con bucle perfecto (sin cortes) usando buffers en memoria
function makeWebAudioSound(name, buffer) {
    return {
        name,
        buffer,
        volume: 0.6,
        source: null,
        gainNode: null,
        start() {
            if (!audioCtx || this.source) return;
            const source = audioCtx.createBufferSource();
            source.buffer = this.buffer;
            source.loop = true;
            const gain = audioCtx.createGain();
            gain.gain.value = this.volume * masterVolume;
            source.connect(gain);
            gain.connect(masterGain);
            source.start(0);
            this.source = source;
            this.gainNode = gain;
        },
        stop() {
            if (!this.source) return;
            try { this.source.stop(); } catch (e) {}
            this.source.disconnect();
            this.source = null;
            if (this.gainNode) this.gainNode.disconnect();
            this.gainNode = null;
        },
        setVolume(v) {
            this.volume = v;
            if (this.gainNode && audioCtx) {
                this.gainNode.gain.setTargetAtTime(v * masterVolume, audioCtx.currentTime, 0.05);
            }
        }
    };
}

// Pista de respaldo con HTMLAudio (file:// o CORS bloqueado)
function makeHtmlAudioSound(name, src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    return {
        name,
        audio,
        volume: 0.6,
        start() {
            if (this.audio.paused) this.audio.play().catch(() => {});
        },
        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
        },
        setVolume(v) {
            this.volume = v;
            this.audio.volume = v * masterVolume;
        }
    };
}

function applyMasterVolume() {
    ambientSoundsData.forEach(s => s.setVolume(s.volume));
}

async function loadAmbientSounds() {
    ensureAudioContext();
    await Promise.all(ambientSoundList.map(async s => {
        try {
            const res = await fetch(s.src);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const arrayBuffer = await res.arrayBuffer();
            const decoded = await audioCtx.decodeAudioData(arrayBuffer);
            ambientSoundsData.push(makeWebAudioSound(s.name, decoded));
        } catch (e) {
            // No se pudo leer con fetch: usamos HTMLAudio como respaldo
            ambientSoundsData.push(makeHtmlAudioSound(s.name, s.src));
        }
    }));
    renderAmbientSliders();
}

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

const streakPage  = document.getElementById('streakPage');
const streakBtn   = document.getElementById('streakBtn');
const closeStreak = document.getElementById('closeStreak');

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
// 🔥 RACHA (STREAK)
// =========================================
let streakDays      = parseInt(localStorage.getItem('pomora_streak'), 10) || 0;
let bestStreak      = parseInt(localStorage.getItem('pomora_best_streak'), 10) || 0;
let lastStreakDate  = localStorage.getItem('pomora_streak_date') || '';

function yesterdayStr() {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y.toDateString();
}

// 🐾 Niveles de animal según la racha
function getAnimalInfo(days) {
    if (days >= 30) return { emoji: '🐉', name: 'Dragón', max: true };
    if (days >= 14) return { emoji: '🦁', name: 'León',  nextEmoji: '🐉', nextName: 'Dragón', daysToNext: 30 - days };
    if (days >= 7)  return { emoji: '🐺', name: 'Lobo',  nextEmoji: '🦁', nextName: 'León',   daysToNext: 14 - days };
    if (days >= 4)  return { emoji: '🦊', name: 'Zorro', nextEmoji: '🐺', nextName: 'Lobo',   daysToNext: 7 - days };
    if (days >= 2)  return { emoji: '🐰', name: 'Conejo', nextEmoji: '🦊', nextName: 'Zorro',  daysToNext: 4 - days };
    return { emoji: '🐣', name: 'Pollito', nextEmoji: '🐰', nextName: 'Conejo', daysToNext: 2 - days };
}

function openStreakPage() {
    const info = getAnimalInfo(streakDays);

    const animalEl = document.getElementById('streakAnimal');
    if (animalEl) {
        animalEl.textContent = info.emoji;
        animalEl.classList.remove('pop');
        void animalEl.offsetWidth;
        animalEl.classList.add('pop');
    }

    const nameEl = document.getElementById('streakAnimalName');
    if (nameEl) nameEl.textContent = info.name;

    const daysEl = document.getElementById('streakDaysPage');
    if (daysEl) daysEl.textContent = `${streakDays} día${streakDays === 1 ? '' : 's'}`;

    const bestEl = document.getElementById('bestStreakPage');
    if (bestEl) bestEl.textContent = bestStreak;

    const sessEl = document.getElementById('sessionsPage');
    if (sessEl) sessEl.textContent = sessionsCompletedToday;

    const tipEl = document.getElementById('nextAnimalTip');
    if (tipEl) {
        tipEl.textContent = info.max
            ? 'Has alcanzado el nivel máximo. ¡Eres una leyenda! 🐉'
            : `${info.nextEmoji} A ${info.daysToNext} día${info.daysToNext === 1 ? '' : 's'} de ser ${info.nextName}`;
    }

    if (streakPage) {
        streakPage.classList.add('open');
        drawerOverlay.classList.add('active');
    }
}

function closeStreakPage() {
    if (streakPage) streakPage.classList.remove('open');
    drawerOverlay.classList.remove('active');
}

// 🔥 Se llama al completar cada pomodoro
function updateStreak() {
    const prevStreak = streakDays;

    if (lastStreakDate !== today) {
        if (lastStreakDate === yesterdayStr()) {
            streakDays++;
        } else {
            streakDays = 1;
        }
        lastStreakDate = today;
        localStorage.setItem('pomora_streak', streakDays);
        localStorage.setItem('pomora_streak_date', lastStreakDate);
    }

    if (streakDays > bestStreak) {
        bestStreak = streakDays;
        localStorage.setItem('pomora_best_streak', bestStreak);
    }

    // 🎉 Celebración en hitos cada 7 días
    if (streakDays > prevStreak && streakDays % 7 === 0) {
        sendNotification(`¡${streakDays} días de racha! 🔥`, 'Constancia increíble, ¡sigue así!');
    }
}

// =========================================
// 💬 FRASES MOTIVACIONALES
// =========================================
const motivationalQuotes = [
    '“Un enfoque a la vez.”',
    '“La constancia vence lo que el talento no puede.”',
    '“No cuentes los días, haz que los días cuenten.”',
    '“Cada pomodoro te acerca a tu mejor versión.”',
    '“El secreto está en empezar. Ahora.”',
    '“Pequeños pasos, grandes resultados.”',
    '“La disciplina es el puente entre metas y logros.”',
    '“Tu futuro yo te lo agradecerá.”',
    '“Hazlo ahora, a veces \u201cdespués\u201d nunca llega.”',
    '“El enfoque es un superpoder. Úsalo.”',
    '“Un día a la vez es suficiente.”',
    '“La motivación te inicia, el hábito te mantiene.”',
    '“Concéntrate en el proceso, no solo en el resultado.”',
    '“Vence la procrastinación con un solo minuto.”',
    '“La excelencia es un hábito.”'
];

let currentQuoteIndex = -1;

function showQuote() {
    let i = Math.floor(Math.random() * motivationalQuotes.length);
    if (i === currentQuoteIndex && motivationalQuotes.length > 1) {
        i = (i + 1) % motivationalQuotes.length;
    }
    currentQuoteIndex = i;

    if (!modeText) return;
    modeText.classList.remove('quote-swap');
    void modeText.offsetWidth;
    modeText.textContent = motivationalQuotes[i];
    modeText.classList.add('quote-swap');
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
    const emoji = mode === 'pomodoro' ? '' : (mode === 'short' ? '' : '');
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
            updateStreak();
            showQuote();
            setMode('short');
        } else {
            sendNotification('¡Descanso terminado! 🚀', 'Es hora de volver a enfocarse.');
            setMode('pomodoro');
        }

        // Auto-arrancar el siguiente bloque después de un momento
        setTimeout(toggleTimer, 600);
    }, 1000);
}

function setMode(mode, keepRunning = false) {
    // Cambio manual estando el temporizador en marcha:
    // carga la duración del nuevo modo y sigue contando SIN detenerse.
    if (keepRunning && isRunning) {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (targetBtn) targetBtn.classList.add('active');

        if (mode === 'pomodoro') { totalTime = 25 * 60; }
        else if (mode === 'short') { totalTime = 5 * 60; }
        else                      { totalTime = 15 * 60; }

        showQuote();

        timeLeft = totalTime;
        updateDisplay();
        updateRing();
        return;
    }

    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = '▶ Start Session';

    modeButtons.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    if (mode === 'pomodoro') { totalTime = 25 * 60; }
    else if (mode === 'short') { totalTime = 5 * 60; }
    else                       { totalTime = 15 * 60; }

    showQuote();

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

    // Volumen general (master)
    const masterWrapper = document.createElement('div');
    masterWrapper.className = 'ambient-slider-wrapper';
    masterWrapper.innerHTML = `
        <label>Volumen general</label>
        <input type="range" class="ambient-slider" min="0" max="1" step="0.05" value="${masterVolume}">
    `;
    const masterSlider = masterWrapper.querySelector('.ambient-slider');
    masterSlider.addEventListener('input', e => {
        masterVolume = parseFloat(e.target.value);
        localStorage.setItem('ambient_master_volume', masterVolume);
        if (masterGain && audioCtx) masterGain.gain.setTargetAtTime(masterVolume, audioCtx.currentTime, 0.05);
        applyMasterVolume();
    });
    ambientControlsContainer.appendChild(masterWrapper);

    ambientSoundsData.forEach(sound => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ambient-slider-wrapper';
        wrapper.innerHTML = `
            <label>${sound.name}</label>
            <input type="range" class="ambient-slider" min="0" max="1" step="0.05" value="${sound.volume}">
        `;
        const slider = wrapper.querySelector('.ambient-slider');
        slider.addEventListener('input', e => {
            const vol = parseFloat(e.target.value);
            sound.setVolume(vol);

            if (vol > 0 && isAmbientPlaying && !isSoundPlaying(sound)) {
                sound.start();
            } else if (vol === 0) {
                sound.stop();
            }
        });
        ambientControlsContainer.appendChild(wrapper);
    });
}

// Play/pause global: solo suenan las pistas con volumen > 0
toggleAmbientPlayBtn.addEventListener('click', () => {
    ensureAudioContext();
    isAmbientPlaying = !isAmbientPlaying;
    toggleAmbientPlayBtn.classList.toggle('active', isAmbientPlaying);

    ambientSoundsData.forEach(sound => {
        if (isAmbientPlaying && sound.volume > 0) sound.start();
        else sound.stop();
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
    if (streakPage) streakPage.classList.remove('open');
    drawerOverlay.classList.remove('active');
}

soundBtn.addEventListener('click',  () => openDrawer(playerDrawer));
closePlayer.addEventListener('click', closeAllDrawers);

taskBtn.addEventListener('click',   () => openDrawer(tasksDrawer));
closeTasks.addEventListener('click', closeAllDrawers);

streakBtn.addEventListener('click', openStreakPage);
closeStreak.addEventListener('click', closeStreakPage);

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

modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode, true)));

// =========================================
// 🚀 INICIALIZACIÓN
// =========================================
renderPlaylist();
loadSong(0);
setMode('pomodoro');
loadAmbientSounds();
renderTasks();
updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));

// Rotar frase motivacional cada 20 segundos
setInterval(showQuote, 20000);
