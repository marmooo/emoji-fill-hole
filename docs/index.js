import signaturePad from"https://cdn.jsdelivr.net/npm/signature_pad@4.2.0/+esm";const countPanel=document.getElementById("countPanel"),infoPanel=document.getElementById("infoPanel"),playPanel=document.getElementById("playPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=60,categories=[...document.getElementById("courseOption").options].map(e=>e.value.toLowerCase()),problems={},canvasCache=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),htmlLang=document.documentElement.lang,ttsLang=getTTSLang(),answers={en:"sushi",ja:"すし"},holeStrings={en:"s",ja:"し"},hole="🕳️";let firstRun=!0,answer=answers[htmlLang],holeString=holeStrings[htmlLang],hinted=!1,correctCount=0,englishVoices=[];loadVoices();const audioContext=new globalThis.AudioContext,audioBufferCache={};loadAudio("end","/emoji-fill-hole/mp3/end.mp3"),loadAudio("correct","/emoji-fill-hole/mp3/correct3.mp3"),loadConfig();function loadConfig(){if(localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),htmlLang=="ja"&&localStorage.getItem("furigana")==1){const e=document.getElementById("addFurigana");addFurigana(e),e.setAttribute("data-done",!0)}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function changeLang(){const e=document.getElementById("lang"),t=e.options[e.selectedIndex].value;location.href=`/emoji-fill-hole/${t}/`}function getTTSLang(){switch(htmlLang){case"en":return"en-US";case"ja":return"ja-JP"}}function addFurigana(){if(htmlLang!="ja")return;const e=document.getElementById("addFurigana");e.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(e=>{e.yomico("/emoji-fill-hole/ja/index.yomi")}),localStorage.setItem("furigana",1),e.setAttribute("data-done",!0))}async function playAudio(e,t){const s=await loadAudio(e,audioBufferCache[e]),n=audioContext.createBufferSource();if(n.buffer=s,t){const e=audioContext.createGain();e.gain.value=t,e.connect(audioContext.destination),n.connect(e),n.start()}else n.connect(audioContext.destination),n.start()}async function loadAudio(e,t){if(audioBufferCache[e])return audioBufferCache[e];const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}function unlockAudio(){audioContext.resume()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});e.then(e=>{englishVoices=e.filter(e=>e.lang==ttsLang)})}function speak(e){speechSynthesis.cancel();const t=new globalThis.SpeechSynthesisUtterance(e);return t.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],t.lang=ttsLang,speechSynthesis.speak(t),t}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function shuffle(e){for(let t=e.length;1<t;t--){const n=Math.floor(Math.random()*t);[e[n],e[t-1]]=[e[t-1],e[n]]}return e}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){speak(answer),hinted=!0;const t=document.getElementById("tehon"),e=t.getContext("2d");e.font="bold 280px 'Source Code Pro'",e.fillStyle="lightgray";const n=e.measureText(holeString),s=(t.width-n.width)/2,o=(t.height+n.actualBoundingBoxAscent)/2;e.fillText(holeString,s,o)}function respeak(){speak(answer)}function digHoles(e){let t;do{const n=getRandomInt(0,e.length);t=e[n]}while(t==" "||t==" ")const n=new RegExp(t,"g"),s=e.replace(n,hole);return[s,t]}function nextProblem(){hideAnswer();const o=document.getElementById("courseOption"),i=categories[o.selectedIndex],e=problems[i].slice();shuffle(e);const[n,s]=e[getRandomInt(0,e.length)],[a,r]=digHoles(s);holeString=r,answer=s;const c=n[getRandomInt(0,n.length)];document.getElementById("emoji").textContent=c,document.getElementById("problem").textContent=a,document.getElementById("reply").textContent="",pad.clear();const t=document.getElementById("tehon");t.getContext("2d").clearRect(0,0,t.width,t.height),speak(answer)}function initSignaturePad(e){const t=new signaturePad(e,{minWidth:8,maxWidth:8,penColor:"black",backgroundColor:"rgba(255, 255, 255, 0)",throttle:0,minDistance:0});return t.addEventListener("endStroke",()=>{predict(t.canvas)}),t}function getImageData(e){const n=28,s=28;canvasCache.fillStyle="white",canvasCache.fillRect(0,0,n,s),canvasCache.drawImage(e,0,0,n,s);const o=canvasCache.getImageData(0,0,n,s),t=o.data;for(let e=0;e<t.length;e+=4)t[e]=255-t[e],t[e+1]=255-t[e+1],t[e+2]=255-t[e+2];return o}function predict(e){const t=getImageData(e);worker.postMessage({imageData:t})}function catWalk(e,t,n){const o=document.getElementById("catsWalk"),a=o.offsetWidth,r=o.offsetHeight,s=document.createElement("span");s.setAttribute("role","button"),s.className="emoji walker",s.style.position="absolute",s.textContent=t;const i=128;s.style.top=getRandomInt(0,r-i)+"px",s.style.left=a-i+"px",s.addEventListener("click",()=>{speak(n),s.remove()},{once:!0}),o.appendChild(s);const c=setInterval(()=>{const e=parseInt(s.style.left)-1;e>-i?s.style.left=e+"px":(clearInterval(c),s.remove())},e)}function catsWalk(){setInterval(()=>{if(Math.random()>.995){const[e,t]=selectRandomEmoji();catWalk(getRandomInt(5,20),e,t)}},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const e=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const t=parseInt(e.textContent);t>0?e.textContent=t-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function selectRandomEmoji(){const s=categories[getRandomInt(0,categories.length)],e=problems[s],t=e[getRandomInt(0,e.length)],n=t[0],o=n[getRandomInt(0,n.length)],i=t[1];return[o,i]}function changeUIEmoji(){document.getElementById("counter-emoji").textContent=selectRandomEmoji()[0],document.getElementById("score-emoji").textContent=selectRandomEmoji()[0]}let countdownTimer;function countdown(){firstRun&&predict(pad.canvas),changeUIEmoji(),clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const e=document.getElementById("counter");e.textContent=3,countdownTimer=setInterval(()=>{const t=["skyblue","greenyellow","violet","tomato"];if(parseInt(e.textContent)>1){const n=parseInt(e.textContent)-1;e.style.backgroundColor=t[n],e.textContent=n}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),document.getElementById("score").textContent=0,correctCount=0,nextProblem(),startGameTimer()},1e3)}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount}function initProblems(){fetch(`/emoji-fill-hole/data/${htmlLang}.csv`).then(e=>e.text()).then(e=>{let t;e.trimEnd().split(`
`).forEach(e=>{const[o,n,s,i]=e.split(",");if(n in problems===!1&&(problems[n]=[]),t==s){const e=problems[n],t=e[e.length-1];t[0].push(o)}else problems[n].push([[o],s]);t=s})})}initProblems(),catsWalk();const pad=initSignaturePad(document.getElementById("tegaki"));document.getElementById("eraser").onclick=()=>{pad.clear()};const worker=new Worker(`/emoji-fill-hole/${htmlLang}/worker.js`);worker.addEventListener("message",e=>{if(firstRun)firstRun=!1;else{const n=e.data.result[0],s=document.getElementById("problem").textContent,o=new RegExp(hole,"g"),t=s.replace(o,n);document.getElementById("reply").textContent=t,t==answer&&(hinted||(correctCount+=1),hinted=!1,playAudio("correct",.3),nextProblem())}}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode;const furiganaButton=document.getElementById("addFurigana");furiganaButton&&(furiganaButton.onclick=addFurigana),document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("respeak").onclick=respeak,document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})