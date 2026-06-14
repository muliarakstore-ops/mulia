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
          const val = tc.args.ReplacementChunks;
          console.log(`  Type:`, typeof val);
          console.log(`  Length of chunks string in log:`, val.length);
          console.log(`  Is truncated property on step:`, obj.is_truncated);
          // Let's print the last 200 characters to see if it ends with "]" or is cut off
          console.log(`  Ends with:`, val.substring(val.length - 200));
        }
      }
    } catch(e) {}
  }
}

showSteps();
