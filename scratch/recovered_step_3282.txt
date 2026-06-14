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
    if (line.includes('admin/page.tsx') || line.includes('page.tsx')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const args = tc.args || {};
            for (const key of Object.keys(args)) {
              const val = args[key];
              if (typeof val === 'string' && val.includes('page.tsx')) {
                console.log(`Step ${stepCount}: ${tc.name} (args key: ${key})`);
                if (tc.name === 'write_to_file' && args.CodeContent) {
                  // Let's decode CodeContent
                  let code = args.CodeContent;
                  if (code.startsWith('"') && code.endsWith('"')) {
                    try { code = JSON.parse(code); } catch(e) {}
                  }
                  console.log(`  CodeContent length: ${code.length}`);
                  fs.writeFileSync(`scratch/recovered_step_${stepCount}.tsx`, code);
                  console.log(`  Saved to scratch/recovered_step_${stepCount}.tsx`);
                }
                if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                  console.log(`  Contains replacement args`);
                }
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}

findEdits();
