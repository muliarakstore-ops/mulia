const fs = require('fs');
const readline = require('readline');

function applyReplacement(content, startLine, endLine, targetContent, replacementContent) {
  if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
    try { targetContent = JSON.parse(targetContent); } catch (e) {}
  }
  if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
    try { replacementContent = JSON.parse(replacementContent); } catch (e) {}
  }

  // Normalize line endings
  const lines = content.split(/\r?\n/);
  const targetLines = targetContent.split(/\r?\n/);

  const targetStr = targetLines.join('\n');
  const fullContentStr = lines.join('\n');

  if (!fullContentStr.includes(targetStr)) {
    console.warn(`WARNING: Target content not found in file!`);
    return content;
  }
  
  const index = fullContentStr.indexOf(targetStr);
  const newContent = fullContentStr.substring(0, index) + replacementContent + fullContentStr.substring(index + targetStr.length);
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
        
        // Process all steps after the last commit at step index 1162
        if (stepIdx > 1162) {
          if (obj.tool_calls) {
            for (const tc of obj.tool_calls) {
              const args = tc.args || {};
              
              // Check if the TargetFile or AbsolutePath targets page.tsx
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
                  if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
                    try { targetContent = JSON.parse(targetContent); } catch (e) {}
                  }
                  if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
                    try { replacementContent = JSON.parse(replacementContent); } catch (e) {}
                  }
                  const startLine = parseInt(args.StartLine || '1');
                  const endLine = parseInt(args.EndLine || '1');

                  currentContent = applyReplacement(currentContent, startLine, endLine, targetContent, replacementContent);
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
                    if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
                      try { targetContent = JSON.parse(targetContent); } catch (e) {}
                    }
                    if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
                      try { replacementContent = JSON.parse(replacementContent); } catch (e) {}
                    }
                    const startLine = parseInt(chunk.StartLine || '1');
                    const endLine = parseInt(chunk.EndLine || '1');
                    currentContent = applyReplacement(currentContent, startLine, endLine, targetContent, replacementContent);
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

  fs.writeFileSync('src/app/admin/page.tsx', currentContent);
  console.log("Successfully reconstructed and updated src/app/admin/page.tsx!");
}

reconstruct();
