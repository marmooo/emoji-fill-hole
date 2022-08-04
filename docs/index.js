const countPanel=document.getElementById("countPanel"),infoPanel=document.getElementById("infoPanel"),playPanel=document.getElementById("playPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=60,categories=[...document.getElementById("courseOption").options].map(a=>a.value.toLowerCase()),problems={},canvasCache=document.createElement("canvas").getContext("2d"),originalLang=document.documentElement.lang,ttsLang=getTTSLang(),answers={en:"sushi",ja:"すし"},holeStrings={en:"s",ja:"し"},hole="🕳️";let answer=answers[originalLang],holeString=holeStrings[originalLang],hinted=!1,correctCount=0,englishVoices=[];loadVoices();let endAudio,errorAudio,correctAudio;loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;loadConfig();function loadConfig(){if(localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark"),originalLang=="ja")if(localStorage.getItem("furigana")==1){const a=document.getElementById("addFurigana");addFurigana(a),a.setAttribute("data-done",!0)}}function changeLang(){const a=document.getElementById("lang"),b=a.options[a.selectedIndex].value;location.href=`/emoji-fill-hole/${b}/`}function getTTSLang(){switch(originalLang){case"en":return"en-US";case"ja":return"ja-JP"}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function addFurigana(){if(originalLang!="ja")return;const a=document.getElementById("addFurigana");a.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(a=>{a.yomico("/emoji-fill-hole/ja/index.yomi")}),localStorage.setItem("furigana",1),a.setAttribute("data-done",!0))}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("/emoji-fill-hole/mp3/end.mp3"),loadAudio("/emoji-fill-hole/mp3/cat.mp3"),loadAudio("/emoji-fill-hole/mp3/incorrect1.mp3"),loadAudio("/emoji-fill-hole/mp3/correct3.mp3")],Promise.all(promises).then(a=>{endAudio=a[0],errorAudio=a[1],incorrectAudio=a[2],correctAudio=a[3]})}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{englishVoices=a.filter(a=>a.lang==ttsLang)})}function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);return a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang=ttsLang,speechSynthesis.speak(a),a}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function shuffle(a){for(let b=a.length-1;b>0;b--){const c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c],a[c]=d}return a}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){speak(answer),hinted=!0;const b=document.getElementById("tehon"),a=b.getContext("2d");a.font="bold 280px 'Source Code Pro'",a.fillStyle="lightgray";const c=a.measureText(holeString),d=(b.width-c.width)/2,e=(b.height+c.actualBoundingBoxAscent)/2;a.fillText(holeString,d,e)}function respeak(){speak(answer)}function digHoles(b){let a;do{const c=getRandomInt(0,b.length);a=b[c]}while(a==" ")const c=new RegExp(a,"g"),d=b.replace(c,hole);return[d,a]}function nextProblem(){hideAnswer();const e=document.getElementById("courseOption"),f=categories[e.selectedIndex],a=problems[f].slice();shuffle(a);const[c,d]=a[getRandomInt(0,a.length)],[g,h]=digHoles(d);holeString=h,answer=d;const i=c[getRandomInt(0,c.length)];document.getElementById("emoji").textContent=i,document.getElementById("problem").textContent=g,document.getElementById("reply").textContent="",pad.clear();const b=document.getElementById("tehon");b.getContext("2d").clearRect(0,0,b.width,b.height),speak(answer)}function initSignaturePad(b){const a=new SignaturePad(b,{minWidth:8,maxWidth:8,penColor:"black",backgroundColor:"rgba(255, 255, 255, 0)",throttle:0,minDistance:0});return a.addEventListener("endStroke",()=>{predict(a.canvas)}),a}function getImageData(d){const b=inputHeight=28;canvasCache.fillStyle="white",canvasCache.fillRect(0,0,b,inputHeight),canvasCache.drawImage(d,0,0,b,inputHeight);const c=canvasCache.getImageData(0,0,b,inputHeight),a=c.data;for(let b=0;b<a.length;b+=4)a[b]=255-a[b],a[b+1]=255-a[b+1],a[b+2]=255-a[b+2];return c}function predict(a){const b=getImageData(a);worker.postMessage({imageData:b})}function catWalk(g,h,d){const c=document.getElementById("catsWalk"),e=c.offsetWidth,f=c.offsetHeight,a=document.createElement("span");a.className="emoji walker",a.style.position="absolute",a.textContent=h;const b=128;a.style.top=getRandomInt(0,f-b)+"px",a.style.left=e-b+"px",a.addEventListener("click",()=>{speak(d),a.remove()},{once:!0}),c.appendChild(a);const i=setInterval(()=>{const c=parseInt(a.style.left)-1;c>-b?a.style.left=c+"px":(clearInterval(i),a.remove())},g)}function catsWalk(){setInterval(()=>{if(Math.random()>.995){const[a,b]=selectRandomEmoji();catWalk(getRandomInt(5,20),a,b)}},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio(endAudio),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function selectRandomEmoji(){const d=categories[getRandomInt(0,categories.length)],a=problems[d],b=a[getRandomInt(0,a.length)],c=b[0],e=c[getRandomInt(0,c.length)],f=b[1];return[e,f]}function changeUIEmoji(){document.getElementById("counter-emoji").textContent=selectRandomEmoji()[0],document.getElementById("score-emoji").textContent=selectRandomEmoji()[0]}let countdownTimer;function countdown(){clearTimeout(countdownTimer),changeUIEmoji(),countPanel.classList.remove("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),playPanel.classList.remove("d-none"),document.getElementById("score").textContent=0,correctCount=0,nextProblem(),startGameTimer()},1e3)}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount}function initProblems(){fetch(`/emoji-fill-hole/data/${originalLang}.csv`).then(a=>a.text()).then(b=>{let a;b.trimEnd().split("\n").forEach(e=>{const[d,b,c,f]=e.split(",");if(b in problems===!1&&(problems[b]=[]),a==c){const a=problems[b],c=a[a.length-1];c[0].push(d)}else problems[b].push([[d],c]);a=c})})}initProblems(),catsWalk();const pad=initSignaturePad(document.getElementById("tegaki"));document.getElementById("eraser").onclick=()=>{pad.clear()};const worker=new Worker(`/emoji-fill-hole/${originalLang}/worker.js`);worker.addEventListener("message",b=>{const c=b.data.result[0],d=document.getElementById("problem").textContent,e=new RegExp(hole,"g"),a=d.replace(e,c);document.getElementById("reply").textContent=a,a==answer&&(hinted||(correctCount+=1),hinted=!1,playAudio(correctAudio),nextProblem())}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode;const furiganaButton=document.getElementById("addFurigana");furiganaButton&&(furiganaButton.onclick=addFurigana),document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("respeak").onclick=respeak,document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0}),/Macintosh/.test(navigator.userAgent)&&(document.ondblclick=a=>{a.preventDefault()},document.body.style.webkitUserSelect="none")