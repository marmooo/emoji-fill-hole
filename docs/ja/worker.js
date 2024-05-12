const letters=Array.from("ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵー・、。");function getAccuracyScores(e){const t=tf.tidy(()=>{const n=1;let t=tf.browser.fromPixels(e,n);return t=tf.cast(t,"float32").div(tf.scalar(255)),t=t.expandDims(),model.predict(t).dataSync()});return t}function top2(e){let t=0,n=0;return e.forEach(e=>{t<e&&(n=t,t=e)}),[t,n]}function predict(e){const t=getAccuracyScores(e),[n,s]=top2(t),o=letters[t.indexOf(n)],i=letters[t.indexOf(s)];return[o,i]}async function loadModel(){model=await tf.loadGraphModel("model/model.json")}async function loadModelAndPredict(e){model||await loadModel(),e.data.result=predict(e.data.imageData),delete e.data.imageData,postMessage(e.data)}importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.19.0/dist/tf.min.js");let model;self.addEventListener("message",loadModelAndPredict)