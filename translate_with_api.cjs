const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const file = 'src/data/automationDetailData.ts';
let content = fs.readFileSync(file, 'utf8');

const stringPropertyRegex = /(title|description|summaryText|volumetrySummary|rationale|name|objective|processName|sopTitle|label|full):\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
const contextCardsRegex = /contextCards:\s*\[([^\]]*)\]/g;
const stringLiteralRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;

async function processFile() {
  const matches = [...content.matchAll(stringPropertyRegex)];
  
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

  const replacements = [];
  
  for (let i = 0; i < allItems.length; i++) {
    const b = allItems[i];
    if (["Intake", "Routing", "Execution", "Exception", "Codification", "RPA", "Workflow", "IA / Agente", "Analytics", "Evaluator"].includes(b.originalText)) {
       continue;
    }

    try {
      const res = await translate(b.originalText, { to: 'en' });
      const trans = res.text || b.originalText;
      
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
      
      console.log(`[${i+1}/${allItems.length}] Translated: ${trans.substring(0, 30)}...`);
    } catch (e) {
      console.error(`Failed at ${i}`, e.message);
    }
    
    // Sleep to avoid rate limiting even with vitalets
    await new Promise(r => setTimeout(r, 200));
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
