const fs = require('fs');
const readline = require('readline');

async function readFirstLines() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    count++;
    console.log(`Line ${count}:`, line.substring(0, 200));
    if (count >= 10) break;
  }
}

readFirstLines();
