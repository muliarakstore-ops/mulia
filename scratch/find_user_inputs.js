const fs = require('fs');
const readline = require('readline');

async function findUserInputs() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`Step ${stepCount}: USER_INPUT`);
        console.log(`  Content:`, obj.content.substring(0, 200));
      }
    } catch(e) {}
  }
}

findUserInputs();
