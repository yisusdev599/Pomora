// =======================
// 🎧 AUDIO MANAGER
// =======================
const AudioManager = (() => {
    const tracks = [
        "music/lofi1.mp3",
        "music/lofi2.mp3",
        "music/lofi3.mp3"
        "music/lofi4.mp3"
        "music/lofi5.mp3"
        "music/lofi6.mp3"
        "music/lofi7.mp3"
        "music/lofi8.mp3"
    ];

    const audio = new Audio();
    audio.volume = 0.5;
    audio.loop = false;

    let unlocked = false;
    let enabled = true;
    let lastIndex = -1;

    function pickRandom() {
        let i;
        do {
            i = Math.floor(Math.random() * tracks.length);
        } while (i === lastIndex && tracks.length > 1);

        lastIndex = i;
        audio.src = tracks[i] + "?v=" + Date.now(); // evita cache
        audio.load();
    }

    audio.addEventListener("ended", () => {
        if (!enabled) return;
        pickRandom();
        audio.play().catch(() => {});
    });

    return {
        unlock() {
            if (unlocked) return;
            unlocked = true;
            pickRandom();
        },
        play() {
            if (!enabled || !unlocked) return;
            audio.play().catch(() => {});
        },
        stop() {
            audio.pause();
            audio.currentTime = 0;
        },
        next() {
            if (!unlocked) return;
            pickRandom();
            this.play();
        },
        toggle() {
            enabled = !enabled;
            enabled ? this.play() : this.stop();
            return enabled;
        }
    };
})();

// =======================
// ⏱️ POMODORO TIMER
// =======================
let time = 25 * 60;
let timer = null;
let running = false;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const soundBtn = document.getElementById("sound");

function renderTime() {
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
}

function startTimer() {
    if (running) return;
    running = true;

    AudioManager.unlock();
    AudioManager.play();

    timer = setInterval(() => {
        if (time <= 0) {
            clearInterval(timer);
            running = false;
            AudioManager.next();
            time = 25 * 60;
            renderTime();
        } else {
            time--;
            renderTime();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    time = 25 * 60;
    renderTime();
    AudioManager.next(); // nueva canción al reiniciar
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

soundBtn.addEventListener("click", () => {
    const on = AudioManager.toggle();
    soundBtn.textContent = on ? "🔊" : "🔇";
});

renderTime();

// =======================
// 📝 NOTAS (PERSISTENTES)
// =======================
const notes = document.getElementById("notes");

// cargar notas
notes.value = localStorage.getItem("pomodoro-notes") || "";

// guardar notas
notes.addEventListener("input", () => {
    localStorage.setItem("pomodoro-notes", notes.value);
});


