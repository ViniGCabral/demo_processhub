const fs = require('fs');
const https = require('https');

const file = 'src/data/automationDetailData.ts';
let content = fs.readFileSync(file, 'utf8');

async function translateBatch(texts) {
  return new Promise((resolve, reject) => {
    // Join with a rare delimiter
    const combined = texts.join('\n\n\n###\n\n\n');
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=' + encodeURIComponent(combined);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let translated = '';
          json[0].forEach(part => translated += part[0]);
          const results = translated.split('###').map(s => s.trim());
          if (results.length !== texts.length) {
            console.error("Mismatch in length!");
            resolve(texts); // fallback
          } else {
            resolve(results);
          }
        } catch(e) {
          console.error("Failed to parse", e);
          resolve(texts);
        }
      });
    }).on('error', err => resolve(texts));
  });
}

const stringPropertyRegex = /(title|description|summaryText|volumetrySummary|rationale|name|objective|processName|sopTitle|label|full):\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
const contextCardsRegex = /contextCards:\s*\[([^\]]*)\]/g;
const stringLiteralRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;

async function processFile() {
  const matches = [...content.matchAll(stringPropertyRegex)];
  
  // Also collect context cards
  const cardArrays = [...content.matchAll(contextCardsRegex)];
  let cardMatches = [];
  for (const arr of cardArrays) {
     const strM = [...arr[1].matchAll(stringLiteralRegex)];
     for (const sm of strM) {
        cardMatches.push({
           index: arr.index + "contextCards: [".length - 1 + arr[0].indexOf(sm[0]),
           match: sm[0],
           originalText: sm[1],
           isCard: true
        });
     }
  }

  const allItems = [];
  for (const m of matches) {
     allItems.push({
        index: m.index,
        match: m[0],
        key: m[1],
        originalText: m[2],
        isCard: false
     });
  }
  
  for (const c of cardMatches) {
     allItems.push(c);
  }

  allItems.sort((a, b) => a.index - b.index);

  const BATCH_SIZE = 15; // 15 strings at once
  const replacements = [];
  
  for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    const batch = allItems.slice(i, i + BATCH_SIZE);
    
    // Check if we really need to translate
    const toTranslate = batch.map(b => b.originalText);
    
    // wait a bit
    await new Promise(r => setTimeout(r, 500));
    
    const translatedTexts = await translateBatch(toTranslate);
    
    for (let j = 0; j < batch.length; j++) {
       const b = batch[j];
       const trans = translatedTexts[j] || b.originalText;
       
       let newStr = "";
       if (b.isCard) {
          newStr = `"${trans.replace(/"/g, '\\"')}"`;
       } else {
          newStr = `${b.key}: "${trans.replace(/"/g, '\\"')}"`;
       }
       
       replacements.push({
          start: b.index,
          end: b.index + b.match.length,
          newStr: newStr
       });
    }
    
    console.log(`Progress: ${i + batch.length}/${allItems.length}`);
  }
  
  let finalContent = content;
  replacements.sort((a, b) => b.start - a.start);
  for (const rep of replacements) {
    finalContent = finalContent.substring(0, rep.start) + rep.newStr + finalContent.substring(rep.end);
  }

  fs.writeFileSync(file, finalContent, 'utf8');
  console.log("Translation complete!");
}

processFile();
