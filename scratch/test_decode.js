const fs = require('fs');
const readline = require('readline');

async function testDecode() {
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
        const stepIdx = obj.step_index;
        if (stepIdx === 2091 || stepIdx === 2123) {
          console.log(`StepIndex ${stepIdx}:`);
          for (const tc of obj.tool_calls) {
            const args = tc.args || {};
            if (tc.name === 'multi_replace_file_content' && args.ReplacementChunks) {
              let chunks = args.ReplacementChunks;
              if (typeof chunks === 'string') {
                try { chunks = JSON.parse(chunks); } catch (e) {}
              }
              for (const chunk of chunks) {
                let r = chunk.ReplacementContent || '';
                console.log(`  Chunk ReplacementContent starts with quote:`, r.startsWith('"'), `ends with quote:`, r.endsWith('"'));
                console.log(`  First 100 chars:`, JSON.stringify(r.substring(0, 100)));
              }
            }
          }
        }
      } catch(e) {}
    }
  }
}

testDecode();
