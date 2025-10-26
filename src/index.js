import signaturePad from "https://cdn.jsdelivr.net/npm/signature_pad@5.1.1/+esm";
import { createWorker } from "https://cdn.jsdelivr.net/npm/emoji-particle@0.0.4/+esm";

const countPanel = document.getElementById("countPanel");
const infoPanel = document.getElementById("infoPanel");
const playPanel = document.getElementById("playPanel");
const scorePanel = document.getElementById("scorePanel");
const gameTime = 60;
const categories = [...document.getElementById("courseOption").options].map(
  (x) => x.value.toLowerCase(),
);
const problems = {};
const canvasCache = document.createElement("canvas")
  .getContext("2d", { willReadFrequently: true });
const htmlLang = document.documentElement.lang;
const ttsLang = getTTSLang(htmlLang);
const answers = { en: "sushi", ja: "すし" };
const holeStrings = { en: "s", ja: "し" };
const hole = "🕳️";
const emojiParticle = initEmojiParticle();
const maxParticleCount = 10;
let answer = answers[htmlLang];
let holeString = holeStrings[htmlLang];
let hinted = false;
let consecutiveWins = 0;
let correctCount = 0;
let englishVoices = [];
let audioContext;
const audioBufferCache = {};
loadVoices();
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
  if (htmlLang == "ja") {
    if (localStorage.getItem("furigana") == 1) {
      const obj = document.getElementById("addFurigana");
      addFurigana(obj);
      obj.setAttribute("data-done", true);
    }
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function changeLang() {
  const langObj = document.getElementById("lang");
  const lang = langObj.options[langObj.selectedIndex].value;
  location.href = `/emoji-fill-hole/${lang}/`;
}

function getTTSLang(htmlLang) {
  switch (htmlLang) {
    case "en":
      return "en-US";
    case "ja":
      return "ja-JP";
  }
}

function addFurigana() {
  if (htmlLang != "ja") return;
  const obj = document.getElementById("addFurigana");
  if (obj.getAttribute("data-done")) {
    localStorage.setItem("furigana", 0);
    location.reload();
  } else {
    import("https://marmooo.github.io/yomico/yomico.min.js").then((module) => {
      module.yomico("/emoji-fill-hole/ja/index.yomi");
    });
    localStorage.setItem("furigana", 1);
    obj.setAttribute("data-done", true);
  }
}

function createAudioContext() {
  if (globalThis.AudioContext) {
    return new globalThis.AudioContext();
  } else {
    console.error("Web Audio API is not supported in this browser");
    return null;
  }
}

function unlockAudio() {
  if (audioContext) {
    audioContext.resume();
  } else {
    audioContext = createAudioContext();
    loadAudio("end", "/emoji-fill-hole/mp3/end.mp3");
    loadAudio("correct", "/emoji-fill-hole/mp3/correct3.mp3");
  }
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

async function loadAudio(name, url) {
  if (!audioContext) return;
  if (audioBufferCache[name]) return audioBufferCache[name];
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBufferCache[name] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error(`Loading audio ${name} error:`, error);
    throw error;
  }
}

function playAudio(name, volume) {
  if (!audioContext) return;
  const audioBuffer = audioBufferCache[name];
  if (!audioBuffer) {
    console.error(`Audio ${name} is not found in cache`);
    return;
  }
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  const gainNode = audioContext.createGain();
  if (volume) gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  sourceNode.connect(gainNode);
  sourceNode.start();
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    englishVoices = voices.filter((voice) => voice.lang == ttsLang);
  });
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new globalThis.SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = ttsLang;
  speechSynthesis.speak(msg);
  return msg;
}

function initEmojiParticle() {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    pointerEvents: "none",
    top: "0px",
    left: "0px",
  });
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  document.body.prepend(canvas);

  const offscreen = canvas.transferControlToOffscreen();
  const worker = createWorker();
  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen]);

  globalThis.addEventListener("resize", () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    worker.postMessage({ type: "resize", width, height });
  });
  return { canvas, offscreen, worker };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

function hideAnswer() {
  document.getElementById("reply").textContent = "";
}

function showAnswer() {
  consecutiveWins = 0;
  speak(answer);
  hinted = true;
  const canvas = document.getElementById("tehon");
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 280px 'Source Code Pro'";
  ctx.fillStyle = "lightgray";
  const m = ctx.measureText(holeString);
  const x = (canvas.width - m.width) / 2;
  const y = (canvas.height + m.actualBoundingBoxAscent) / 2;
  ctx.fillText(holeString, x, y);
}

function respeak() {
  speak(answer);
}

function digHoles(text) {
  let holeStr;
  do {
    const pos = getRandomInt(0, text.length);
    holeStr = text[pos];
  } while (holeStr == " " || holeStr == " ");
  const regexp = new RegExp(holeStr, "g");
  const holedText = text.replace(regexp, hole);
  return [holedText, holeStr];
}

function nextProblem() {
  hideAnswer();
  const course = document.getElementById("courseOption");
  const category = categories[course.selectedIndex];
  const choices = problems[category].slice();
  shuffle(choices);
  const [emojis, text] = choices[getRandomInt(0, choices.length)];
  const [holedText, holeStr] = digHoles(text);
  holeString = holeStr;
  answer = text;
  const emoji = emojis[getRandomInt(0, emojis.length)];
  document.getElementById("emoji").textContent = emoji;
  document.getElementById("problem").textContent = holedText;
  document.getElementById("reply").textContent = "";
  pad.clear();
  const tehon = document.getElementById("tehon");
  tehon.getContext("2d").clearRect(0, 0, tehon.width, tehon.height);
  speak(answer);
}

function initSignaturePad(canvas) {
  const pad = new signaturePad(canvas, {
    minWidth: 8,
    maxWidth: 8,
    penColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0)",
    throttle: 0,
    minDistance: 0,
  });
  pad.addEventListener("endStroke", () => {
    predict(pad.canvas);
  });
  return pad;
}

function getImageData(drawElement) {
  const inputWidth = 28;
  const inputHeight = 28;
  // transparent to white
  canvasCache.fillStyle = "white";
  canvasCache.fillRect(0, 0, inputWidth, inputHeight);
  // resize
  canvasCache.drawImage(drawElement, 0, 0, inputWidth, inputHeight);
  // invert color
  const imageData = canvasCache.getImageData(0, 0, inputWidth, inputHeight);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

function predict(canvas) {
  const imageData = getImageData(canvas);
  worker.postMessage({ imageData });
}

function catWalk(freq, emoji, text) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = document.createElement("span");
  canvas.setAttribute("role", "button");
  canvas.className = "emoji walker";
  canvas.style.position = "absolute";
  canvas.textContent = emoji;
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", () => {
    speak(text);
    canvas.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(() => {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk() {
  setInterval(() => {
    if (Math.random() > 0.995) {
      const [emoji, text] = selectRandomEmoji();
      catWalk(getRandomInt(5, 20), emoji, text);
    }
  }, 10);
}

let gameTimer;
function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  initTime();
  gameTimer = setInterval(() => {
    const t = parseInt(timeNode.textContent);
    if (t > 0) {
      timeNode.textContent = t - 1;
    } else {
      clearInterval(gameTimer);
      playAudio("end");
      scoring();
    }
  }, 1000);
}

function initTime() {
  document.getElementById("time").textContent = gameTime;
}

function selectRandomEmoji() {
  const category = categories[getRandomInt(0, categories.length)];
  const p = problems[category];
  const problem = p[getRandomInt(0, p.length)];
  const emojis = problem[0];
  const emoji = emojis[getRandomInt(0, emojis.length)];
  const text = problem[1];
  return [emoji, text];
}

function changeUIEmoji() {
  document.getElementById("counter-emoji").textContent = selectRandomEmoji()[0];
  document.getElementById("score-emoji").textContent = selectRandomEmoji()[0];
}

let countdownTimer;
function countdown() {
  speak("Ready"); // unlock
  changeUIEmoji();
  clearTimeout(countdownTimer);
  countPanel.classList.remove("d-none");
  infoPanel.classList.add("d-none");
  playPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  countdownTimer = setInterval(() => {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      clearTimeout(countdownTimer);
      countPanel.classList.add("d-none");
      infoPanel.classList.remove("d-none");
      playPanel.classList.remove("d-none");
      correctCount = 0;
      consecutiveWins = 0;
      nextProblem();
      startGameTimer();
    }
  }, 1000);
}

function scoring() {
  playPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  document.getElementById("score").textContent = correctCount;
}

async function initProblems() {
  const response = await fetch(`/emoji-fill-hole/data/${htmlLang}.csv`);
  const tsv = await response.text();
  let prevEn;
  tsv.trimEnd().split("\n").forEach((line) => {
    const [emoji, category, en, _] = line.split(",");
    if (category in problems === false) {
      problems[category] = [];
    }
    if (prevEn == en) {
      const p = problems[category];
      const last = p[p.length - 1];
      last[0].push(emoji);
    } else {
      problems[category].push([[emoji], en]);
    }
    prevEn = en;
  });
}

await initProblems();
catsWalk();

const pad = initSignaturePad(document.getElementById("tegaki"));
document.getElementById("eraser").onclick = () => {
  pad.clear();
};

const worker = new Worker(`/emoji-fill-hole/${htmlLang}/worker.js`);
worker.addEventListener("message", (event) => {
  if (pad.toData().length == 0) return;
  const alphabet = event.data.result[0];
  const problem = document.getElementById("problem").textContent;
  const regexp = new RegExp(hole, "g");
  const reply = problem.replace(regexp, alphabet);
  document.getElementById("reply").textContent = reply;
  if (reply == answer) {
    if (!hinted) {
      correctCount += 1;
      consecutiveWins += 1;
    }
    for (let i = 0; i < Math.min(consecutiveWins, maxParticleCount); i++) {
      emojiParticle.worker.postMessage({
        type: "spawn",
        options: {
          particleType: "popcorn",
          originX: Math.random() * emojiParticle.canvas.width,
          originY: Math.random() * emojiParticle.canvas.height,
        },
      });
    }
    hinted = false;
    playAudio("correct", 0.3);
    nextProblem();
  }
});

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const furiganaButton = document.getElementById("addFurigana");
if (furiganaButton) furiganaButton.onclick = addFurigana;
document.getElementById("restartButton").onclick = countdown;
document.getElementById("startButton").onclick = countdown;
document.getElementById("showAnswer").onclick = showAnswer;
document.getElementById("respeak").onclick = respeak;
document.getElementById("lang").onchange = changeLang;
document.addEventListener("pointerdown", () => {
  predict(pad.canvas);
}, { once: true });
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
