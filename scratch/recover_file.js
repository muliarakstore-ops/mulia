const fs = require('fs');
const readline = require('readline');

async function findLatestReplacements() {
  const fileStream = fs.createReadStream('C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\logs\\transcript.jsonl');
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastWriteContent = null;
  let lastWriteStep = 0;
  let stepCount = 0;

  for await (const line of rl) {
    stepCount++;
    if (line.includes('admin/page.tsx') && (line.includes('write_to_file') || line.includes('replace_file_content'))) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.arguments && tc.arguments.TargetFile && tc.arguments.TargetFile.endsWith('page.tsx')) {
              if (tc.name === 'write_to_file' && tc.arguments.CodeContent) {
                lastWriteContent = tc.arguments.CodeContent;
                lastWriteStep = stepCount;
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log(`Last write_to_file for page.tsx was at step ${lastWriteStep}`);
  if (lastWriteContent) {
    fs.writeFileSync('scratch/recovered_admin_page.tsx', lastWriteContent);
    console.log("Successfully wrote recovered code to scratch/recovered_admin_page.tsx");
  } else {
    console.log("No write_to_file content found for page.tsx");
  }
}

findLatestReplacements();
