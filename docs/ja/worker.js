const letters=Array.from("ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵー・、。");function getAccuracyScores(a){const b=tf.tidy(()=>{const c=1;let b=tf.browser.fromPixels(a,c);return b=tf.cast(b,"float32").div(tf.scalar(255)),b=b.expandDims(),model.predict(b).dataSync()});return b}function top2(c){var a=0,b=0;return c.forEach(c=>{a<c&&(b=a,a=c)}),[a,b]}function predict(f){var b,c,d,e;const a=getAccuracyScores(f);return[b,c]=top2(a),d=letters[a.indexOf(b)],e=letters[a.indexOf(c)],[d,e]}importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.8.0/dist/tf.min.js");let model;(async()=>{model=await tf.loadGraphModel("model/model.json")})(),self.addEventListener("message",a=>{a.data.result=predict(a.data.imageData),delete a.data.imageData,postMessage(a.data)})