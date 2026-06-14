const fs = require('fs');
const readline = require('readline');

async function findStepIndices() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.toLowerCase().includes('page.tsx')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const args = tc.args || {};
            const targetFile = args.TargetFile || args.AbsolutePath || '';
            if (typeof targetFile === 'string' && targetFile.toLowerCase().includes('page.tsx')) {
              console.log(`Line ${lineCount}: StepIndex ${obj.step_index}, Tool: ${tc.name}`);
            }
          }
        }
      } catch(e) {}
    }
  }
}

findStepIndices();
