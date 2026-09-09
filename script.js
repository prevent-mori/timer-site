// タブ切り替え
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.15;
  const beepCount = 3;
  for (let i = 0; i < beepCount; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.3);
    osc.stop(ctx.currentTime + i * 0.3 + duration);
  }
}

// ===== カウントダウンタイマー =====
const timerDisplay = document.getElementById("timer-display");
const timerStartBtn = document.getElementById("timer-start");
const timerPauseBtn = document.getElementById("timer-pause");
const timerResetBtn = document.getElementById("timer-reset");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const setBtn = document.getElementById("set-btn");
const presetButtons = document.querySelectorAll(".preset-btn");

let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
}

function setTimerSeconds(sec) {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = sec;
  remainingSeconds = sec;
  timerDisplay.classList.remove("finished");
  updateTimerDisplay();
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  timerStartBtn.textContent = "開始";
}

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimerSeconds(Number(btn.dataset.seconds));
  });
});

setBtn.addEventListener("click", () => {
  const m = Number(minutesInput.value) || 0;
  const s = Number(secondsInput.value) || 0;
  const sec = m * 60 + s;
  if (sec > 0) {
    setTimerSeconds(sec);
  }
});

function tick() {
  remainingSeconds--;
  if (remainingSeconds <= 0) {
    remainingSeconds = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = null;
    timerDisplay.classList.add("finished");
    timerStartBtn.disabled = true;
    timerPauseBtn.disabled = true;
    playBeep();
    return;
  }
  updateTimerDisplay();
}

timerStartBtn.addEventListener("click", () => {
  if (remainingSeconds <= 0) return;
  timerDisplay.classList.remove("finished");
  timerInterval = setInterval(tick, 1000);
  timerStartBtn.disabled = true;
  timerPauseBtn.disabled = false;
});

timerPauseBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
});

timerResetBtn.addEventListener("click", () => {
  setTimerSeconds(totalSeconds);
});

updateTimerDisplay();

// ===== ストップウォッチ =====
const swDisplay = document.getElementById("stopwatch-display");
const swStartBtn = document.getElementById("sw-start");
const swPauseBtn = document.getElementById("sw-pause");
const swResetBtn = document.getElementById("sw-reset");
const swLapBtn = document.getElementById("sw-lap");
const lapList = document.getElementById("lap-list");

let swElapsedMs = 0;
let swStartTime = null;
let swInterval = null;

function formatStopwatch(ms) {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}.${tenths}`;
}

function updateSwDisplay() {
  swDisplay.textContent = formatStopwatch(swElapsedMs);
}

swStartBtn.addEventListener("click", () => {
  swStartTime = Date.now() - swElapsedMs;
  swInterval = setInterval(() => {
    swElapsedMs = Date.now() - swStartTime;
    updateSwDisplay();
  }, 100);
  swStartBtn.disabled = true;
  swPauseBtn.disabled = false;
  swLapBtn.disabled = false;
  swResetBtn.disabled = true;
});

swPauseBtn.addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  swStartBtn.disabled = false;
  swPauseBtn.disabled = true;
  swLapBtn.disabled = true;
  swResetBtn.disabled = false;
});

swResetBtn.addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  swElapsedMs = 0;
  updateSwDisplay();
  lapList.innerHTML = "";
  swStartBtn.disabled = false;
  swPauseBtn.disabled = true;
  swLapBtn.disabled = true;
});

swLapBtn.addEventListener("click", () => {
  const li = document.createElement("li");
  const lapNumber = lapList.children.length + 1;
  li.innerHTML = `<span>ラップ ${lapNumber}</span><span>${formatStopwatch(swElapsedMs)}</span>`;
  lapList.prepend(li);
});

updateSwDisplay();
