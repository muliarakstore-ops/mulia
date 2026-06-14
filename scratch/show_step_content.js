const fs = require('fs');
const readline = require('readline');

async function showSteps() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (stepCount >= 2670 && stepCount <= 2700) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log(`Step ${stepCount}: ${tc.name}`);
            console.log(`  Args:`, JSON.stringify(tc.args, null, 2).substring(0, 1000));
          }
        }
      } catch(e) {}
    }
  }
}

showSteps();
