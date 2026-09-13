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
    { title: '404 Peace Not Found',    artist: 'Low Signal',                                   cover: 'cover/6a023637649911b6922123f93fbf0b2c.jpg',          src: 'https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/404%20Peace%20Not%20Found.mp3',                            dur: 1325 },
    { title: 'S-T-A-Y (Mr Robot Relax)', artist: 'Mr Robot',                                  cover: 'cover/cybercrime-concept-hacker-in-a-dark-mask-photo.jpg', src: 'https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/%F0%9D%97%A6%20%F0%9D%97%A7%20%F0%9D%97%94%20%F0%9D%97%AC%20with%20Mr%20Robot%20(1%20hour%20music)%20-%20Mr%20Robot%20Relax.mp3', dur: 3602 },
    { title: "You're Coding & the Meaning of Life", artist: 'Low Signal',                     cover: 'cover/cover4.jpg',                                      src: "https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/you're%20coding%20while%20starting%20to%20feel%20like%20you've%20understood%20the%20meaning%20of%20life%20.mp3", dur: 3834 },
    { title: "THATS NOT AN OPTION (Mr Robot Relax)", artist: 'Mr Robot',                       cover: 'cover/wp4507678.jpg',                                  src: 'https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/%F0%9D%97%A7%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%A7%F0%9D%97%A6%20%F0%9D%97%A1%F0%9D%97%A2%F0%9D%97%A7%20%F0%9D%97%94%F0%9D%97%A1%20%F0%9D%97%A2%F0%9D%97%A3%F0%9D%97%A7%F0%9D%97%9C%F0%9D%97%A2%F0%9D%97%A1%20with%20Mr%20Robot%20(1%20hour%20music)%20(playlist)%20-%20Mr%20Robot%20Relax.mp3', dur: 3612 },
    { title: "A Playlist That Makes You Feel Calm and Dreamy", artist: 'Pianza',                  cover: 'cover/cover.jpg',                                       src: 'https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/A%20playlist%20that%20makes%20you%20feel%20calm%20and%20dreamy..%20-%20Pianza.mp3', dur: 3722 },
    { title: "A Secret Playlist to Escape From Reality", artist: 'Pianza',                        cover: 'cover/cover2.jpg',                                      src: 'https://pub-4e196cfc28974ad5b3013d003fc0d0b3.r2.dev/music/A%20secret%20playlist%20to%20escape%20from%20reality..%20-%20Pianza.mp3', dur: 3941 }
];

// =========================================
// 🌲 SONIDOS AMBIENTALES (Web Audio API)
// =========================================
const AMBIENT_ICONS = {
    master: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
    forest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l5 6h-2.5L19 16H5l4.5-7H7z"/><path d="M12 16v5"/></svg>',
    thunder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>',
    wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>'
};

const ambientSoundList = [
    { name: 'Lluvia',    src: 'sounds/rain.wav',    icon: AMBIENT_ICONS.rain },
    { name: 'Bosque',    src: 'sounds/forest.wav',  icon: AMBIENT_ICONS.forest },
    { name: 'Tormenta',  src: 'sounds/thunder.wav', icon: AMBIENT_ICONS.thunder },
    { name: 'Viento',    src: 'sounds/wind.wav',    icon: AMBIENT_ICONS.wind }
];

let audioCtx = null;
let masterGain = null;
let masterVolume = parseFloat(localStorage.getItem('ambient_master_volume')) || 0.8;
let isAmbientPlaying = false;
const ambientSoundsData = [];
const pendingVolumes = {};

function ensureAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = masterVolume;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
}

function getAmbientSound(name) {
    return ambientSoundsData.find(s => s.name === name);
}

function isSoundPlaying(sound) {
    if (!sound) return false;
    if (sound.source) return true;                 // pista Web Audio
    if (sound.audio)  return !sound.audio.paused;  // pista HTMLAudio (respaldo)
    return false;
}

// Pista con bucle perfecto (buffer en memoria). No hace sonido hasta `start()`
function makeWebAudioSound(name, buffer) {
    return {
        name,
        buffer,
        ready: true,
        volume: pendingVolumes[name] != null ? pendingVolumes[name] : 0.6,
        source: null,
        gainNode: null,
        start() {
            if (!audioCtx || this.source) return;
            const source = audioCtx.createBufferSource();
            source.buffer = this.buffer;
            source.loop = true;
            const gain = audioCtx.createGain();
            gain.gain.value = 0;                   // Arranca en silencio y se ajusta con `setVolume()`
            source.connect(gain);
            gain.connect(masterGain);
            source.start(0);
            this.source = source;
            this.gainNode = gain;
            this.setVolume(this.volume);
        },
        stop() {
            if (!this.source) return;
            try { this.source.stop(); } catch (e) {}
            this.source.disconnect();
            this.gainNode.disconnect();
            this.source = null;
            this.gainNode = null;
        },
        setVolume(v) {
            this.volume = v;
            if (this.gainNode && audioCtx) {
                this.gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
                this.gainNode.gain.setTargetAtTime(v * masterVolume, audioCtx.currentTime, 0.05);
            }
        }
    };
}

// Pista de respaldo con HTMLAudio (file:// o CORS bloqueado)
function makeHtmlAudioSound(name, src) {
    const audioEl = new Audio(src);
    audioEl.loop = true;
    audioEl.preload = 'auto';
    const sound = {
        name,
        audio: audioEl,
        ready: true,
        volume: pendingVolumes[name] != null ? pendingVolumes[name] : 0.6,
        hasWebAudio: false,
        start() {
            this.audio.volume = this.volume * masterVolume;
            this.audio.play().catch(() => {});
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
    return sound;
}

function applyMasterVolume() {
    ambientSoundsData.forEach(s => s.setVolume(s.volume));
}

// Precarga no bloqueante: decodifica en un OfflineAudioContext (no hace
// sonar nada ni crea el AudioContext real). Si falla, usa HTMLAudio.
async function preloadAmbientSounds() {
    renderAmbientSliders();
    let offline = null;
    try {
        const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (OC) offline = new OC(2, 1, 44100);
    } catch (e) { offline = null; }

    const results = await Promise.all(ambientSoundList.map(async meta => {
        let buffer = null;
        try {
            const res = await fetch(meta.src);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const arrayBuffer = await res.arrayBuffer();
            if (offline) buffer = await offline.decodeAudioData(arrayBuffer);
        } catch (e) { buffer = null; }
        return { name: meta.name, buffer, src: meta.src };
    }));

    ambientSoundsData.push(...results.map(r =>
        r.buffer
            ? makeWebAudioSound(r.name, r.buffer)
            : makeHtmlAudioSound(r.name, r.src)
    ));
    applyMasterVolume();
    renderAmbientSliders();
}

function updateAmbientStates() {
    ambientSoundsData.forEach(sound => {
        if (isAmbientPlaying && sound.volume > 0) sound.start();
        else sound.stop();
    });
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
const progressHover    = document.querySelector('.progress-hover');
const progressTooltip  = document.getElementById('progressTooltip');
const songTitle        = document.getElementById('song-title');
const songArtist       = document.getElementById('song-artist');
const songCover        = document.getElementById('song-cover');
const playlistContainer = document.getElementById('playlist');
const queueBox          = document.getElementById('queueBox');
const playlistToggle    = document.getElementById('playlistToggle');
const playlistCount     = document.getElementById('playlistCount');

const playerPanel   = document.getElementById('playerPanel');
const soundBtn      = document.getElementById('soundBtn');
const studio        = document.querySelector('.studio');
const spatialBtn    = document.getElementById('spatialBtn');
const rewindBtn     = document.getElementById('rewindBtn');
const forwardBtn    = document.getElementById('forwardBtn');

const ambientDrawer          = document.getElementById('ambientDrawer');
const ambientBtn             = document.getElementById('ambientkBtn');
const closeAmbient           = document.getElementById('closeAmbient');
const ambientControlsContainer = document.getElementById('ambientControls');

const taskBtn       = document.getElementById('taskBtn');
const tasksDrawer   = document.getElementById('tasksDrawer');
const closeTasks    = document.getElementById('closeTasks');
const drawerOverlay = document.getElementById('drawerOverlay');
const tasksBoard    = document.getElementById('tasksBoard');

const streakPage  = document.getElementById('streakPage');
const streakBtn   = document.getElementById('streakBtn');
const closeStreak = document.getElementById('closeStreak');

// =========================================
// ⚙️ ESTADO
// =========================================
const TXT_START = '▶ Iniciar';
const TXT_PAUSE = '⏸ Pausar';
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
        startBtn.textContent = TXT_START;
        ring.classList.remove('running');
        document.title = 'Pomora';
        return;
    }

    // Arrancar
    requestNotificationPermission();
    playUISound('start');
    isRunning = true;
    startBtn.textContent = TXT_PAUSE;
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
        startBtn.textContent = TXT_START;
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
    startBtn.textContent = TXT_START;

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
    renderPlaylist();
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    // Cola estilo YouTube Music: empieza por la canción actual y sigue el ciclo
    const queue = [...playlist.slice(songIndex), ...playlist.slice(0, songIndex)];
    if (playlistCount) playlistCount.textContent = `${playlist.length} pistas`;
    queue.forEach((song, qIndex) => {
        const actualIndex = (songIndex + qIndex) % playlist.length;
        const li = document.createElement('li');
        li.classList.add('track');
        if (qIndex === 0) li.classList.add('active');
        li.innerHTML = `
            <img src="${song.cover}" alt="portada" class="track-img" loading="lazy">
            <div class="track-info">
                <span class="track-name">${song.title}</span>
                <span class="track-artist">${song.artist}</span>
            </div>
            <span class="track-duration">${song.dur ? formatTime(song.dur) : ''}</span>
        `;
        li.addEventListener('click', () => {
            loadSong(actualIndex);
            audio.play();
            updatePlayIcon(true);
            closeQueue();
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

// Salto ±10 s (estilo YouTube Music)
const SEEK_SECONDS = 10;

rewindBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - SEEK_SECONDS);
});

forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + SEEK_SECONDS);
});

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

function seekFromEvent(e) {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    audio.currentTime = (x / rect.width) * audio.duration;
}

function previewHover(e) {
    if (!progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const pct = rect.width ? x / rect.width : 0;
    if (progressHover) progressHover.style.width = `${pct * 100}%`;
    if (progressTooltip) {
        const t = audio.duration ? pct * audio.duration : 0;
        progressTooltip.textContent = formatTime(t);
        const half = progressTooltip.offsetWidth / 2;
        progressTooltip.style.left = `${Math.min(Math.max(x, half + 5), rect.width - half - 5)}px`;
    }
}

progressBar.addEventListener('click', seekFromEvent);
progressBar.addEventListener('mousemove', previewHover);
progressBar.addEventListener('mouseleave', () => {
    if (progressHover) progressHover.style.width = '0%';
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
// 🎧 AUDIO 8D (paneo circular automático con Web Audio)
// =========================================
let spatialCtx     = null;
let spatialSrc     = null;
let spatialDry     = null;
let spatialWet     = null;
let spatialPanner  = null;
let spatialActive  = false;

function ensureSpatialChain() {
    if (spatialCtx) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    spatialCtx = new Ctor();
    spatialSrc = spatialCtx.createMediaElementSource(audio);

    // Ruta seca mínima (evita que el sonido desaparezca al girar)
    spatialDry = spatialCtx.createGain();
    spatialDry.gain.value = 1;
    spatialSrc.connect(spatialDry);
    spatialDry.connect(spatialCtx.destination);

    // Ruta 8D: fuente HRTF que orbita alrededor del oyente + eco de sala
    spatialPanner = spatialCtx.createPanner();
    spatialPanner.panningModel = 'HRTF';
    spatialPanner.distanceModel = 'linear';
    spatialPanner.refDistance = 1;
    spatialPanner.maxDistance = 10000;
    spatialPanner.rolloffFactor = 1;
    spatialPanner.dopplerFactor = 0;
    spatialPanner.positionX.value = 0;
    spatialPanner.positionY.value = 0;
    spatialPanner.positionZ.value = 0.4;

    const echoDelay = spatialCtx.createDelay(1);
    echoDelay.delayTime.value = 0.3;
    const echoFeed = spatialCtx.createGain();
    echoFeed.gain.value = 0.30;
    const echoLP = spatialCtx.createBiquadFilter();
    echoLP.type = 'lowpass';
    echoLP.frequency.value = 1500;
    echoDelay.connect(echoLP);
    echoLP.connect(echoFeed);
    echoFeed.connect(echoDelay);

    spatialWet = spatialCtx.createGain();
    spatialWet.gain.value = 0;

    // Compresor para que el 8D suene lleno y sin picos ni cortes
    const comp = spatialCtx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 26;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;

    spatialSrc.connect(spatialPanner);
    spatialPanner.connect(echoDelay);
    spatialPanner.connect(spatialWet);
    echoDelay.connect(spatialWet);
    spatialWet.connect(comp);
    comp.connect(spatialCtx.destination);

    // Órbita circular: sin(seno) en X y coseno (desfasado 90°) en Y
    const lfoX = spatialCtx.createOscillator();
    lfoX.type = 'sine';
    lfoX.frequency.value = 0.13;
    const lfoY = spatialCtx.createOscillator();
    lfoY.type = 'sine';
    lfoY.frequency.value = 0.13;
    const orbitX = spatialCtx.createGain();
    orbitX.gain.value = 1.4;
    const orbitY = spatialCtx.createGain();
    orbitY.gain.value = 1.4;
    lfoX.connect(orbitX);
    orbitX.connect(spatialPanner.positionX);
    lfoY.connect(orbitY);
    orbitY.connect(spatialPanner.positionY);
    lfoX.start();
    // Inicia Y un cuarto de periodo después para trazar un círculo real
    lfoY.start(spatialCtx.currentTime + (0.25 / 0.13));
}

function setSpatial(on) {
    if (!on) {
        spatialActive = false;
        if (spatialCtx) {
            const t = spatialCtx.currentTime;
            if (spatialDry) spatialDry.gain.setTargetAtTime(1, t, 0.15);
            if (spatialWet) spatialWet.gain.setTargetAtTime(0, t, 0.15);
        }
        if (spatialBtn) spatialBtn.classList.remove('active');
        return;
    }
    ensureSpatialChain();
    if (spatialCtx.state === 'suspended') spatialCtx.resume();
    spatialActive = true;
    const t = spatialCtx.currentTime;
    spatialDry.gain.setTargetAtTime(0.18, t, 0.3);
    spatialWet.gain.setTargetAtTime(1, t, 0.3);
    if (spatialBtn) spatialBtn.classList.add('active');
}

if (spatialBtn) {
    spatialBtn.addEventListener('click', () => setSpatial(!spatialActive));
}

// =========================================
// 🌲 SONIDOS AMBIENTALES
// =========================================
function applySliderFill(slider) {
    const v = parseFloat(slider.value);
    const max = parseFloat(slider.max) || 1;
    const pct = (v / max) * 100;
    slider.style.background =
        `linear-gradient(90deg, var(--primary) 0%, var(--primary) ${pct}%, var(--slider-track) ${pct}%, var(--slider-track) 100%)`;
}

function buildAmbientRow({ icon, name, value, loaded = true, onInput }) {
    const row = document.createElement('div');
    row.className = 'ambient-row';
    row.innerHTML = `
        <span class="ambient-icon">${icon}</span>
        <span class="ambient-name">${name}</span>
        <span class="ambient-status ${loaded ? 'ok' : 'loading'}">${loaded ? '' : 'Cargando…'}</span>
        <input type="range" class="ambient-slider" min="0" max="1" step="0.05" value="${value}">
    `;
    const slider = row.querySelector('.ambient-slider');
    applySliderFill(slider);
    slider.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        applySliderFill(slider);
        onInput(val);
    });
    return row;
}

function updateAmbientRowsState() {
    document.querySelectorAll('.ambient-row').forEach(row => {
        const nameEl = row.querySelector('.ambient-name');
        if (!nameEl) return;
        const sound = getAmbientSound(nameEl.textContent);
        const playing = isAmbientPlaying && sound && sound.volume > 0 && isSoundPlaying(sound);
        row.classList.toggle('playing', playing);
    });
}

function renderAmbientSliders() {
    ambientControlsContainer.innerHTML = '';

    ambientControlsContainer.appendChild(buildAmbientRow({
        icon: AMBIENT_ICONS.master,
        name: 'General',
        value: masterVolume,
        onInput: v => {
            masterVolume = v;
            localStorage.setItem('ambient_master_volume', masterVolume);
            if (masterGain && audioCtx) masterGain.gain.setTargetAtTime(masterVolume, audioCtx.currentTime, 0.05);
            applyMasterVolume();
        }
    }));

    ambientSoundList.forEach(meta => {
        const sound = getAmbientSound(meta.name);
        const vol = sound ? sound.volume : (pendingVolumes[meta.name] != null ? pendingVolumes[meta.name] : 0.6);
        ambientControlsContainer.appendChild(buildAmbientRow({
            icon: meta.icon,
            name: meta.name,
            value: vol,
            loaded: !!sound,
            onInput: v => {
                const s = getAmbientSound(meta.name);
                if (!s) { pendingVolumes[meta.name] = v; return; }
                s.setVolume(v);
                if (v > 0 && isAmbientPlaying && !isSoundPlaying(s)) s.start();
                else if (v === 0) s.stop();
                updateAmbientRowsState();
            }
        }));
    });
    updateAmbientRowsState();
}

// Play/pause global: solo suenan las pistas con volumen > 0
function toggleAmbientPlay() {
    ensureAudioContext();
    isAmbientPlaying = !isAmbientPlaying;
    const mp = document.getElementById('ambientMasterPlay');
    if (mp) {
        mp.classList.toggle('active', isAmbientPlaying);
        mp.textContent = isAmbientPlaying ? '⏸ Pausar mezcla' : '▶ Reproducir mezcla';
    }
    updateAmbientStates();
    updateAmbientRowsState();
}

const ambientMasterPlay = document.getElementById('ambientMasterPlay');
if (ambientMasterPlay) ambientMasterPlay.addEventListener('click', toggleAmbientPlay);

ambientBtn.addEventListener('click', () => {
    ambientDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
});

closeAmbient.addEventListener('click', () => {
    ambientDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
});

// =========================================
// 📝 NOTAS (TAREAS) — calendario, color, subrayado y recordatorios
// =========================================
const pad2 = n => String(n).padStart(2, '0');
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const WEEKDAYS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function toDateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toTimeHM(d) {
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function fromDateKey(key) {
    const [y, m, dd] = key.split('-').map(Number);
    return new Date(y, m - 1, dd);
}

function buildReminderIso(dateKey, time) {
    if (!dateKey || !time) return null;
    return new Date(`${dateKey}T${time}`).toISOString();
}

function normalizeTask(t) {
    let date = t.date || '';
    let reminderTime = t.reminderTime || null;
    if (!date && t.reminder) {
        const d = new Date(t.reminder);
        date = toDateKey(d);
        reminderTime = toTimeHM(d);
    }
    if (!date) date = toDateKey(new Date());
    return {
        id: t.id || `task-${Math.random().toString(36).slice(2, 9)}`,
        text: String(t.text || ''),
        completed: !!t.completed,
        color: t.color || '',
        underline: !!t.underline,
        date,
        reminderTime,
        reminder: buildReminderIso(date, reminderTime),
        lead: t.lead === undefined ? 10 : Number(t.lead),
        fired: !!t.fired
    };
}

let tasks = (JSON.parse(localStorage.getItem('pomora_tasks')) || []).map(normalizeTask);

const nowD = new Date();
let calYear = nowD.getFullYear();
let calMonth = nowD.getMonth();
let selectedDate = toDateKey(nowD);

const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const calendarPrev = document.getElementById('calendarPrev');
const calendarNext = document.getElementById('calendarNext');
const selectedDayTitle = document.getElementById('selectedDayTitle');
const noteCounter = document.getElementById('noteCounter');

function renderDayTitle() {
    if (!selectedDayTitle) return;
    const d = fromDateKey(selectedDate);
    const todayKey = toDateKey(new Date());
    const yKey = toDateKey(new Date(Date.now() - 86400000));
    const tmKey = toDateKey(new Date(Date.now() + 86400000));
    let rel = WEEKDAYS_ES[d.getDay()];
    if (selectedDate === todayKey) rel = 'Hoy';
    else if (selectedDate === yKey) rel = 'Ayer';
    else if (selectedDate === tmKey) rel = 'Mañana';
    selectedDayTitle.textContent = `${rel} · ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`;
}

function renderCalendar() {
    if (!calendarGrid || !calendarMonthLabel) return;
    calendarGrid.innerHTML = '';
    const first = new Date(calYear, calMonth, 1);
    const startIdx = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
    const todayKey = toDateKey(new Date());

    for (let i = 0; i < 42; i++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cal-cell';
        const offset = i - startIdx;
        let dKey, dayNum;
        if (offset < 0) {
            dayNum = prevMonthDays + offset + 1;
            dKey = toDateKey(new Date(calYear, calMonth - 1, offset + 1));
            cell.classList.add('muted');
        } else if (offset >= daysInMonth) {
            dayNum = offset - daysInMonth + 1;
            dKey = toDateKey(new Date(calYear, calMonth + 1, dayNum));
            cell.classList.add('muted');
        } else {
            dayNum = offset + 1;
            dKey = toDateKey(new Date(calYear, calMonth, dayNum));
        }
        cell.textContent = dayNum;
        cell.dataset.date = dKey;
        if (dKey === todayKey) cell.classList.add('today');
        if (dKey === selectedDate) cell.classList.add('selected');
        if (tasks.some(t => t.date === dKey)) {
            const dot = document.createElement('span');
            dot.className = 'cal-dot';
            cell.appendChild(dot);
        }
        cell.addEventListener('click', () => {
            selectedDate = dKey;
            closeDetail();
            renderCalendar();
            renderTasks();
        });
        calendarGrid.appendChild(cell);
    }
    calendarMonthLabel.textContent = `${MONTHS_ES[calMonth]} ${calYear}`;
    renderDayTitle();
}

if (calendarPrev) calendarPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
});

if (calendarNext) calendarNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
});

function saveTasks() {
    localStorage.setItem('pomora_tasks', JSON.stringify(tasks));
    renderTasks();
}

// Colores disponibles para las notas
const NOTE_COLORS = ['#ffd9a1', '#ffc4d6', '#c9dcff', '#c7efd2', '#e4d9ff', '#ffe98a'];

const boardWrap = document.getElementById('boardWrap');
const noteDetail = document.getElementById('noteDetail');
const ndBack = document.getElementById('ndBack');
const ndTitle = document.getElementById('ndTitle');
const ndTime = document.getElementById('ndTime');
const ndLead = document.getElementById('ndLead');
const ndColors = document.getElementById('ndColors');
const ndUnderline = document.getElementById('ndUnderline');
const ndDone = document.getElementById('ndDone');
const ndDelete = document.getElementById('ndDelete');
const ndSave = document.getElementById('ndSave');
const ndTimeHint = document.getElementById('ndTimeHint');

function updateTimeHint() {
    if (!ndTimeHint) return;
    ndTimeHint.textContent = ndTime.value ? formatTimeHM(ndTime.value) : '';
}

let detailTaskId = null;
let detailColor = '';

function formatTimeHM(hhmm) {
    if (!hhmm) return '';
    const [h, m] = hhmm.split(':').map(Number);
    const ap = h < 12 ? 'AM' : 'PM';
    return `${h % 12 === 0 ? 12 : h % 12}:${pad2(m)} ${ap}`;
}

function formatNoteReminder(iso) {
    const d = new Date(iso);
    const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    const todayKey = toDateKey(new Date());
    if (toDateKey(d) === todayKey) return `Hoy · ${formatTimeHM(time)}`;
    return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)} · ${formatTimeHM(time)}`;
}

function buildNdColors() {
    ndColors.innerHTML = '';
    ['', ...NOTE_COLORS].forEach(c => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'nd-swatch' + (c ? '' : ' none');
        if (c) b.style.setProperty('--swatch', c);
        b.dataset.c = c;
        b.title = c ? 'Usar este color' : 'Sin color';
        b.addEventListener('click', () => setNdColor(c));
        ndColors.appendChild(b);
    });
}

function setNdColor(c) {
    detailColor = c || '';
    ndColors.querySelectorAll('.nd-swatch').forEach(b => b.classList.toggle('on', b.dataset.c === detailColor));
    ndTitle.focus();
}

function renderTasks() {
    if (!tasksBoard) return;
    tasksBoard.innerHTML = '';
    const dayTasks = tasks
        .filter(t => t.date === selectedDate)
        .sort((a, b) => (+a.completed) - (+b.completed));

    if (dayTasks.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'board-empty';
        empty.textContent = 'La pizarra está vacía · toca "＋ Nueva nota" para empezar';
        tasksBoard.appendChild(empty);
    } else {
        dayTasks.forEach((task) => {
            const note = document.createElement('div');
            note.className = `sticky-note${task.completed ? ' completed' : ''}`;
            note.style.setProperty('--rot', `${((task.id.charCodeAt(task.id.length - 1) || 0) % 5) - 2}deg`);
            if (task.color) note.style.setProperty('--note-bg', task.color);
            const isDue = task.reminder && !task.fired && new Date(task.reminder).getTime() <= Date.now();
            note.innerHTML = `
                ${task.completed ? '<span class="note-check">✓</span>' : ''}
                <span class="note-text${task.underline ? ' underline' : ''}"></span>
                ${task.reminder ? `<span class="note-reminder${isDue ? ' due' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>${formatNoteReminder(task.reminder)}</span>` : ''}
            `;
            note.querySelector('.note-text').textContent = task.text;
            note.addEventListener('click', () => openDetail(task));
            tasksBoard.appendChild(note);
        });
    }

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'new-note';
    newBtn.innerHTML = '<span class="new-plus">＋</span><span>Nueva nota</span>';
    newBtn.addEventListener('click', () => openDetail(null));
    tasksBoard.appendChild(newBtn);

    if (noteCounter) noteCounter.textContent = `${dayTasks.filter(t => t.completed).length} de ${dayTasks.length} completadas`;
}

function openDetail(task) {
    detailTaskId = task ? task.id : null;
    ndTitle.value = task ? task.text : '';
    ndTime.value = task && task.reminderTime ? task.reminderTime : '';
    updateTimeHint();
    ndLead.value = String(task && task.lead !== undefined ? task.lead : 10);
    ndUnderline.classList.toggle('active', !!(task && task.underline));
    ndUnderline.setAttribute('aria-pressed', String(!!(task && task.underline)));
    ndDone.checked = !!(task && task.completed);
    buildNdColors();
    setNdColor(task ? task.color : '');
    ndDelete.style.visibility = detailTaskId ? 'visible' : 'hidden';
    if (boardWrap) boardWrap.hidden = true;
    noteDetail.hidden = false;
    ndTitle.focus();
}

function closeDetail() {
    noteDetail.hidden = true;
    if (boardWrap) boardWrap.hidden = false;
}

function saveDetail() {
    const text = ndTitle.value.trim();
    if (!text) { ndTitle.focus(); return; }
    const time = ndTime.value || null;
    const lead = parseInt(ndLead.value, 10);
    const reminder = buildReminderIso(selectedDate, time);
    const underline = ndUnderline.classList.contains('active');

    if (detailTaskId) {
        const task = tasks.find(t => t.id === detailTaskId);
        if (task) {
            const timeChanged = reminder !== task.reminder;
            task.text = text;
            task.color = detailColor;
            task.underline = underline;
            task.completed = ndDone.checked;
            if (timeChanged) task.fired = false;
            task.reminderTime = time;
            task.reminder = reminder;
            task.lead = lead;
        }
    } else {
        tasks.push({
            id: `task-${Math.random().toString(36).slice(2, 9)}`,
            text,
            color: detailColor,
            underline,
            completed: ndDone.checked,
            date: selectedDate,
            reminderTime: time,
            reminder,
            lead,
            fired: false
        });
    }
    closeDetail();
    saveTasks();
    renderCalendar();
}

function deleteDetail() {
    if (!detailTaskId) return;
    const idx = tasks.findIndex(t => t.id === detailTaskId);
    if (idx > -1) tasks.splice(idx, 1);
    closeDetail();
    saveTasks();
    renderCalendar();
}

if (ndBack) ndBack.addEventListener('click', closeDetail);
if (ndSave) ndSave.addEventListener('click', saveDetail);
if (ndDelete) ndDelete.addEventListener('click', deleteDetail);
if (ndTime) ndTime.addEventListener('input', updateTimeHint);
if (ndUnderline) ndUnderline.addEventListener('click', () => {
    ndUnderline.classList.toggle('active');
    ndUnderline.setAttribute('aria-pressed', String(ndUnderline.classList.contains('active')));
    ndTitle.focus();
});
ndTitle.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveDetail();
    }
});

// ⏰ Revisa recordatorios cada 15 segundos
function checkReminders() {
    const now = Date.now();
    let changed = false;
    tasks.forEach(t => {
        if (!t.reminder || t.fired || t.completed) return;
        const leadMs = (t.lead === undefined ? 10 : Number(t.lead)) * 60000;
        if (new Date(t.reminder).getTime() - leadMs <= now) {
            t.fired = true;
            changed = true;
            const diffMin = Math.max(0, Math.round((new Date(t.reminder).getTime() - now) / 60000));
            const prefix = diffMin > 0 ? `En ${diffMin} min · ` : '';
            sendNotification('Recordatorio', `${prefix}Tu nota: "${t.text.length > 60 ? t.text.slice(0, 57) + '...' : t.text}"`);
        }
    });
    if (changed) saveTasks();
}

// =========================================
// 🚀 DRAWERS — APERTURA / CIERRE
// =========================================
function openDrawer(drawer) {
    drawer.classList.add('open');
    drawerOverlay.classList.add('active');
}

function closeAllDrawers() {
    tasksDrawer.classList.remove('open');
    ambientDrawer.classList.remove('open');
    if (streakPage) streakPage.classList.remove('open');
    drawerOverlay.classList.remove('active');
}

let closeTimer = null;
function finishPlayerClose() {
    if (playerPanel.classList.contains('collapsed')) return;
    playerPanel.classList.remove('closing');
    playerPanel.classList.add('collapsed');
    if (studio) studio.classList.remove('player-open');
}
function setCollapsed(collapsed) {
    clearTimeout(closeTimer);
    if (collapsed) {
        if (playerPanel.classList.contains('collapsed') ||
            playerPanel.classList.contains('closing')) return;
        playerPanel.classList.add('closing');
        playerPanel.addEventListener('animationend', function h(e) {
            if (e.animationName === 'playerOut') finishPlayerClose();
        });
        closeTimer = setTimeout(finishPlayerClose, 350);
    } else {
        playerPanel.classList.remove('closing', 'collapsed');
        if (studio) studio.classList.add('player-open');
        playerPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

soundBtn.addEventListener('click', () => {
    setCollapsed(!playerPanel.classList.contains('collapsed'));
});

const playerCloseBtn = document.getElementById('playerCloseBtn');
if (playerCloseBtn) {
    playerCloseBtn.addEventListener('click', () => setCollapsed(true));
}

if (playlistToggle && queueBox && playerPanel) {
    playlistToggle.addEventListener('click', () => {
        const isOpen = playerPanel.classList.toggle('queue-open');
        queueBox.classList.toggle('queue-open', isOpen);
        playlistToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

function closeQueue() {
    if (!playerPanel || !queueBox) return;
    playerPanel.classList.remove('queue-open');
    queueBox.classList.remove('queue-open');
    if (playlistToggle) playlistToggle.setAttribute('aria-expanded', 'false');
}

taskBtn.addEventListener('click',   () => openDrawer(tasksDrawer));
closeTasks.addEventListener('click', closeAllDrawers);

streakBtn.addEventListener('click', openStreakPage);
closeStreak.addEventListener('click', closeStreakPage);

drawerOverlay.addEventListener('click', closeAllDrawers);

// ─── El player ahora es un panel integrado (no drawer) ──────────────────────

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
    startBtn.textContent = TXT_START;
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
preloadAmbientSounds();
renderCalendar();
renderTasks();
checkReminders();
setInterval(checkReminders, 15000);
updateDailyProgress(Math.round((sessionsCompletedToday / SESSIONS_GOAL) * 100));

// Rotar frase motivacional cada 20 segundos
setInterval(showQuote, 20000);
