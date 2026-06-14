const fs = require('fs');
const readline = require('readline');

async function findLatestReplacements() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (line.includes('admin/page.tsx') && (line.includes('replace_file_content') || line.includes('write_to_file') || line.includes('multi_replace_file_content'))) {
      console.log(`Step ${stepCount} contains admin/page.tsx modifications`);
      try {
        const obj = JSON.parse(line);
        // Look for tool calls
        if (obj.tool_calls) {
          console.log("Found tool calls in step:", stepCount);
          for (const tc of obj.tool_calls) {
            if (tc.name === 'replace_file_content' || tc.name === 'write_to_file' || tc.name === 'multi_replace_file_content') {
              console.log("Tool name:", tc.name);
              console.log("Arguments keys:", Object.keys(tc.arguments || {}));
              if (tc.arguments && tc.arguments.TargetFile && tc.arguments.TargetFile.endsWith('page.tsx')) {
                // If it's a replacement or write, let's see how much content we can get
                console.log("Found target file edit:", tc.arguments.TargetFile);
              }
            }
          }
        }
      } catch (e) {
        // Line might be incomplete JSON
      }
    }
  }
}

findLatestReplacements();
