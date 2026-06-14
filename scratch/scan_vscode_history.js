const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
console.log("Searching in VS Code History directory:", historyDir);

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log("History directory does not exist.");
    return;
  }

  const subdirs = fs.readdirSync(dir);
  console.log(`Found ${subdirs.length} folders in history.`);

  let foundFiles = [];

  for (const subdir of subdirs) {
    const fullSubdir = path.join(dir, subdir);
    try {
      const stat = fs.statSync(fullSubdir);
      if (stat.isDirectory()) {
        const files = fs.readdirSync(fullSubdir);
        for (const file of files) {
          const filePath = path.join(fullSubdir, file);
          // Check if file is page.tsx or contains specific text
          // VS Code history stores original file names in entries.json, but the files themselves have random names.
          // Let's check if the file size is large (around 100kb-250kb) and contains 'isLoggedInAdmin'
          const fileStat = fs.statSync(filePath);
          if (fileStat.isFile() && fileStat.size > 100000 && fileStat.size < 300000) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('isLoggedInAdmin') && content.includes('isLoggedInOwner')) {
              foundFiles.push({
                path: filePath,
                size: fileStat.size,
                mtime: fileStat.mtime
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  // Sort by modification time (latest first)
  foundFiles.sort((a, b) => b.mtime - a.mtime);

  console.log(`Found ${foundFiles.length} candidate files in VS Code history.`);
  for (const f of foundFiles.slice(0, 5)) {
    console.log(`Candidate: ${f.path}, Size: ${f.size}, Modified: ${f.mtime}`);
    // Let's copy the latest candidate to scratch
    fs.copyFileSync(f.path, 'scratch/recovered_history_page.tsx');
    console.log(`Copied latest candidate to scratch/recovered_history_page.tsx`);
    break; // only need the latest one
  }
}

scanDirectory(historyDir);
