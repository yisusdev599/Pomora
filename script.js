// =========================================
// 🌙 DARK MODE LOGIC
// =========================================
const themeToggleBtn = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
} else {
    // Check initial state from html tag (set by head script)
    if (document.documentElement.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Toggle Theme Button Listener
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
        
        // Save the current preference to localStorage
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
    { 
        title: " ( interstellar main theam)", 
        artist: "interstellar", 
        cover: "cover/Interstellar_Cover.jpg", 
        src: "music/S-T-A-Y.mp3" 
    },
    { 
        title: "Lo-Fi Study", 
        artist: "Chill Beats", 
        cover: "cover/cover2.jpg", 
        src: "music/lofi4.mp3" 
    },
{ 
    title: "Deep Work", 
    artist: "Ambient Nature", 
    cover: "cover/cover3.jpg", 
    src: "music/lofi7.mp3" 
},
{ 
    title: "404 Peace Not Found", 
    artist: "Low Signal", 
    cover: "cover/cover4.jpg", 
    src: "music/404 Peace Not Found.mp3" 
},
{ 
    title: "Heavy Rain", 
    artist: "Lofi HipHop", 
    cover: "cover/cover5.jpg", 
    src: "music/Heavy Rain Lofi HipHop.mp3" 
},
{
    title: "Tokyo Lofi Study ",
    artist: "Chillhop Music",
    cover: "cover/tokyocover.jpg",
    src: "music/ＴＯＫＹＯ Lofi.mp3"
}

];




// Creamos un nuevo objeto Audio específico para el ambiente
const ambientPlayer = new Audio();
ambientPlayer.loop = true; // ¡Esto es clave para el sonido infinito!
 

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

// Player Elements
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
const playlistContainer = document.getElementById("playlist"); // El <ul> en tu HTML

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



// =========================================
// 🌲 LÓGICA DE SONIDOS AMBIENTALES
// =========================================
// Asegúrate de que ambientDrawer solo se declare UNA VEZ en todo tu archivo
// Si ya la tienes declarada arriba, borra esta línea:
// const ambientDrawer = document.getElementById("ambientDrawer"); 

const ambientSoundsData = [
    { name: "Rain", audio: new Audio("sounds/rain.wav") },
    { name: "Forest", audio: new Audio("sounds/forest.wav") },
    { name: "Thunder", audio: new Audio("sounds/thunder.wav") },
    { name: "wind", audio: new Audio("sounds/wind.mp3") }
];

// Estado global para controlar si el audio está "encendido" o "apagado"
let isAmbientPlaying = false;

// Configuración inicial de los audios (sin reproducir aún)
ambientSoundsData.forEach(sound => {
    sound.audio.loop = true;
    sound.audio.volume = 0.5; // Volumen por defecto
});


const ambientControlsContainer = document.getElementById("ambientControls");
const ambientBtn = document.getElementById("ambientkBtn"); 
const closeAmbient = document.getElementById("closeAmbient");
const toggleAmbientPlayBtn = document.getElementById("play-ambientkBtn"); // Botón de Play

toggleAmbientPlayBtn.addEventListener("click", () => {
    isAmbientPlaying = !isAmbientPlaying;
    
    // Cambiamos el estado visual con una sola línea:
    toggleAmbientPlayBtn.classList.toggle("active", isAmbientPlaying);
    
    ambientSoundsData.forEach(sound => {
        if (isAmbientPlaying) {
            sound.audio.play().catch(e => console.log(e));
        } else {
            sound.audio.pause();
        }
    });
});

// --- Lógica del Drawer ---
function renderAmbientSliders() {
    ambientControlsContainer.innerHTML = "";
    ambientSoundsData.forEach((sound, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "ambient-slider-wrapper";
        wrapper.innerHTML = `
            <label>${sound.name}</label>
            <input type="range" min="0" max="1" step="0.1" value="${sound.audio.volume}" 
                   oninput="ambientSoundsData[${index}].audio.volume = this.value">
        `;
        ambientControlsContainer.appendChild(wrapper);
    });
}

ambientBtn.addEventListener("click", () => ambientDrawer.classList.add("open"));
closeAmbient.addEventListener("click", () => ambientDrawer.classList.remove("open"));

// Renderizado dinámico de sliders (usando addEventListener)
function renderAmbientSliders() {
    ambientControlsContainer.innerHTML = "";
    ambientSoundsData.forEach((sound, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "ambient-slider-wrapper";
        wrapper.innerHTML = `
            <label>${sound.name}</label>
            <input type="range" class="ambient-slider" min="0" max="1" step="0.1" value="${sound.audio.volume}">
        `;
        
        // Escuchador de eventos limpio
        const slider = wrapper.querySelector(".ambient-slider");
        slider.addEventListener("input", (e) => {
            const vol = parseFloat(e.target.value);
            sound.audio.volume = vol;
            
            // Si el maestro está encendido, reproducimos si el volumen sube
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
        // Sonido de START solo cuando el usuario hace clic
        playUISound('start'); 
        
        isRunning = true;
        startBtn.textContent = "⏸ Pause Session";
        
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                updateRing();
            } else {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = "▶ Start Session";
                
                // --- AQUÍ EL CAMBIO ---
    
                playUISound('end'); // Solo el sonido de FIN
                
                timeLeft = totalTime;
                updateDisplay();
                updateRing();
            }
        }, 1000);
    }
}
                
function playUISound(type = 'start') {
    const activeBtn = document.querySelector(".mode-btn.active");
    const mode = activeBtn ? activeBtn.dataset.mode : "pomodoro";
    const soundMode = mode === "pomodoro" ? "pomodoro" : (mode === "short" ? "break" : "long");
    
    // Solo reproducir si el tipo ('start' o 'end') existe
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
    else if (mode === "short") { totalTime = 1 * 60; modeText.textContent = "Descanso corto"; }
    else { totalTime = 15 * 60; modeText.textContent = "Descanso largo"; }

    timeLeft = totalTime;
    updateDisplay();
    updateRing();
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

// Renderizar la lista lateral dinámicamente
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
        // Icono de Pausa (dos rectángulos)
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                <rect x="14" y="5" width="4" height="14" rx="1"></rect>
            </svg>`;
    } else {
        // Icono de Play (triángulo centrado)
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

function fadeMusicOut() {
    const initialVol = audio.volume;
    let currentVol = initialVol;
    const fadeInterval = setInterval(() => {
        if (currentVol > 0.05) {
            currentVol -= 0.05;
            audio.volume = currentVol;
        } else {
            clearInterval(fadeInterval);
            audio.pause();
            audio.volume = initialVol;
            updatePlayIcon(false);
            playUISound(); // Sonido de fin
        }
    }, 200);
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

// Control de Drawers
const soundBtn = document.getElementById("soundBtn");
const playerDrawer = document.getElementById("playerDrawer");
const closePlayer = document.getElementById("closePlayer");

soundBtn.addEventListener("click", () => playerDrawer.classList.add("open"));
closePlayer.addEventListener("click", () => playerDrawer.classList.remove("open"));

// Inicialización
renderPlaylist();
loadSong(0);
setMode("pomodoro");
renderAmbientSliders();