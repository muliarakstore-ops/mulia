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
    if (stepCount === 2406 || stepCount === 2431 || stepCount === 2437) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log(`Step ${stepCount}: ${tc.name}`);
            console.log(`  TargetContent:`, tc.args.TargetContent);
            console.log(`  ReplacementContent:`, tc.args.ReplacementContent);
            if (tc.args.ReplacementChunks) {
              const chunks = typeof tc.args.ReplacementChunks === 'string' ? JSON.parse(tc.args.ReplacementChunks) : tc.args.ReplacementChunks;
              console.log(`  ReplacementChunks count:`, chunks.length);
              for (let i = 0; i < chunks.length; i++) {
                console.log(`    Chunk ${i} TargetContent:`, chunks[i].TargetContent.substring(0, 100));
              }
            }
          }
        }
      } catch(e) {}
    }
  }
}

showSteps();
