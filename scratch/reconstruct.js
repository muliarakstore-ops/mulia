const fs = require('fs');
const readline = require('readline');

// Standard helper to apply a single replacement chunk
function applyReplacement(content, startLine, endLine, targetContent, replacementContent) {
  // Let's decode if they are JSON strings
  if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
    try { targetContent = JSON.parse(targetContent); } catch (e) {}
  }
  if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
    try { replacementContent = JSON.parse(replacementContent); } catch (e) {}
  }

  // Normalize line endings
  const lines = content.split(/\r?\n/);
  const targetLines = targetContent.split(/\r?\n/);

  // We look for targetContent in the lines range [startLine - 1, endLine] (0-indexed)
  // Let's find where targetContent matches exactly
  const targetStr = targetLines.join('\n');
  const fullContentStr = lines.join('\n');

  // Let's replace the first occurrence of targetStr
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

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    // We only process steps up to before this current user turn (which starts around step 3200+)
    // Actually we can process all steps. Let's process steps that modified the admin/page.tsx
    if (line.includes('admin/page.tsx')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const args = tc.args || {};
            let isTarget = false;
            for (const key of Object.keys(args)) {
              if (typeof args[key] === 'string' && args[key].includes('page.tsx')) {
                isTarget = true;
                break;
              }
            }

            if (!isTarget) continue;

            if (tc.name === 'write_to_file' && args.CodeContent) {
              let code = args.CodeContent;
              if (code.startsWith('"') && code.endsWith('"')) {
                try { code = JSON.parse(code); } catch(e) {}
              }
              currentContent = code;
              console.log(`Step ${stepCount}: write_to_file. Content reset to length ${currentContent.length}`);
            } else if (tc.name === 'replace_file_content') {
              let targetContent = args.TargetContent || '';
              let replacementContent = args.ReplacementContent || '';
              if (targetContent.startsWith('"') && targetContent.endsWith('"')) {
                try { targetContent = JSON.parse(targetContent); } catch(e) {}
              }
              if (replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
                try { replacementContent = JSON.parse(replacementContent); } catch(e) {}
              }
              const startLine = parseInt(args.StartLine || '1');
              const endLine = parseInt(args.EndLine || '1');

              currentContent = applyReplacement(currentContent, startLine, endLine, targetContent, replacementContent);
              console.log(`Step ${stepCount}: replace_file_content applied. Content length: ${currentContent.length}`);
            } else if (tc.name === 'multi_replace_file_content' && args.ReplacementChunks) {
              let chunks = args.ReplacementChunks;
              if (typeof chunks === 'string') {
                try { chunks = JSON.parse(chunks); } catch (e) {}
              }
              console.log(`Step ${stepCount}: multi_replace_file_content. Applying ${chunks.length} chunks...`);
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
              console.log(`Step ${stepCount}: multi_replace_file_content applied. Content length: ${currentContent.length}`);
            }
          }
        }
      } catch (e) {
        console.error(`Error at step ${stepCount}:`, e);
      }
    }
  }

  fs.writeFileSync('scratch/reconstructed_admin_page.tsx', currentContent);
  console.log("Reconstructed content written to scratch/reconstructed_admin_page.tsx");
}

reconstruct();
