const fs = require('fs');
const readline = require('readline');

function applyReplacement(content, startLine, endLine, targetContent, replacementContent) {
  if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
    try { targetContent = JSON.parse(targetContent); } catch (e) {}
  }
  if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
    try { replacementContent = JSON.parse(replacementContent); } catch (e) {}
  }

  // Normalize all line endings to LF (\n)
  content = content.replace(/\r\n/g, '\n');
  targetContent = targetContent.replace(/\r\n/g, '\n');
  replacementContent = replacementContent.replace(/\r\n/g, '\n');

  if (!content.includes(targetContent)) {
    console.warn(`WARNING: Target content not found in file!`);
    // Let's print a small preview of what was not found
    console.warn(`  Looking for: ${targetContent.substring(0, 100)}...`);
    return content;
  }
  
  const index = content.indexOf(targetContent);
  const newContent = content.substring(0, index) + replacementContent + content.substring(index + targetContent.length);
  return newContent;
}

async function reconstruct() {
  // Start with the base content (git HEAD version)
  let currentContent = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
  console.log(`Original content length: ${currentContent.length} chars, lines: ${currentContent.split('\n').length}`);

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
        
        if (stepIdx > 1162) {
          if (obj.tool_calls) {
            for (const tc of obj.tool_calls) {
              const args = tc.args || {};
              
              const targetFile = args.TargetFile || args.AbsolutePath || '';
              if (typeof targetFile === 'string' && targetFile.toLowerCase().includes('page.tsx')) {
                if (tc.name === 'write_to_file' && args.CodeContent) {
                  let code = args.CodeContent;
                  if (code.startsWith('"') && code.endsWith('"')) {
                    try { code = JSON.parse(code); } catch(e) {}
                  }
                  currentContent = code;
                  console.log(`StepIndex ${stepIdx}: write_to_file. Length: ${currentContent.length}`);
                } else if (tc.name === 'replace_file_content') {
                  let targetContent = args.TargetContent || '';
                  let replacementContent = args.ReplacementContent || '';
                  
                  currentContent = applyReplacement(currentContent, 0, 0, targetContent, replacementContent);
                  console.log(`StepIndex ${stepIdx}: replace_file_content. Length: ${currentContent.length}`);
                } else if (tc.name === 'multi_replace_file_content' && args.ReplacementChunks) {
                  let chunks = args.ReplacementChunks;
                  if (typeof chunks === 'string') {
                    try { chunks = JSON.parse(chunks); } catch (e) {}
                  }
                  console.log(`StepIndex ${stepIdx}: multi_replace_file_content. Applying ${chunks.length} chunks...`);
                  for (const chunk of chunks) {
                    let targetContent = chunk.TargetContent || '';
                    let replacementContent = chunk.ReplacementContent || '';
                    currentContent = applyReplacement(currentContent, 0, 0, targetContent, replacementContent);
                  }
                  console.log(`StepIndex ${stepIdx}: multi_replace_file_content applied. Length: ${currentContent.length}`);
                }
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error at line ${lineCount}:`, e);
      }
    }
  }

  // Normalize final content to LF or CRLF depending on project
  fs.writeFileSync('src/app/admin/page.tsx', currentContent.replace(/\r\n/g, '\n'));
  console.log("Successfully reconstructed and updated src/app/admin/page.tsx with normalized LF endings!");
}

reconstruct();
