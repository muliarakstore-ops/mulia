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
      if (obj.step_index === 2123) {
        console.log(`StepIndex 2123:`);
        for (const tc of obj.tool_calls) {
          console.log(`  Tool: ${tc.name}`);
          console.log(`  ReplacementChunks type:`, typeof tc.args.ReplacementChunks);
          console.log(`  ReplacementChunks content:`, String(tc.args.ReplacementChunks).substring(0, 500));
        }
      }
    } catch(e) {}
  }
}

showSteps();
