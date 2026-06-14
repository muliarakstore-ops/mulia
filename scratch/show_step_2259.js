const fs = require('fs');
const readline = require('readline');

async function showSteps() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 2259 || obj.step_index === 2263 || obj.step_index === 2270) {
        console.log(`StepIndex ${obj.step_index}:`);
        for (const tc of obj.tool_calls) {
          console.log(`  Tool: ${tc.name}`);
          console.log(`  TargetContent:`, JSON.stringify(tc.args.TargetContent));
          console.log(`  ReplacementContent:`, JSON.stringify(tc.args.ReplacementContent));
        }
      }
    } catch(e) {}
  }
}

showSteps();
