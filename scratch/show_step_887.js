const fs = require('fs');
const readline = require('readline');

async function showStep887() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (stepCount === 887 || stepCount === 886 || stepCount === 888) {
      console.log(`Step ${stepCount}:`, line.substring(0, 1000));
    }
  }
}

showStep887();
