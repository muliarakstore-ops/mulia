const fs = require('fs');
const readline = require('readline');

async function findEdits() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (line.includes('admin/page.tsx')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const args = tc.args || {};
            const targetFile = args.TargetFile || '';
            if (targetFile.endsWith('page.tsx')) {
              console.log(`Step ${stepCount}: ${tc.name}`);
              console.log(`  Keys in args:`, Object.keys(args));
              if (tc.name === 'write_to_file' && args.CodeContent) {
                console.log(`  CodeContent length: ${args.CodeContent.length}`);
              }
              if (tc.name === 'replace_file_content') {
                console.log(`  TargetContent: ${args.TargetContent ? args.TargetContent.substring(0, 100) : ''}...`);
                console.log(`  ReplacementContent: ${args.ReplacementContent ? args.ReplacementContent.substring(0, 100) : ''}...`);
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}

findEdits();
