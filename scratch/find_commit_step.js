const fs = require('fs');
const readline = require('readline');

async function findCommits() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (line.includes('git commit') || line.includes('git add')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === 'run_command' && tc.args.CommandLine) {
              console.log(`StepIndex ${obj.step_index} (line ${stepCount}):`, tc.args.CommandLine);
            }
          }
        }
      } catch (e) {}
    }
  }
}

findCommits();
