const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Cursor', 'User', 'History');
console.log("Searching in Cursor History directory:", historyDir);

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
          const fileStat = fs.statSync(filePath);
          if (fileStat.isFile()) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('isLoggedInAdmin')) {
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

  foundFiles.sort((a, b) => b.mtime - a.mtime);

  console.log(`Found ${foundFiles.length} candidate files in Cursor history.`);
  for (const f of foundFiles) {
    console.log(`Candidate: ${f.path}, Size: ${f.size}, Modified: ${f.mtime}`);
    fs.copyFileSync(f.path, 'scratch/recovered_history_page.tsx');
    console.log(`Copied latest candidate to scratch/recovered_history_page.tsx`);
    break;
  }
}

scanDirectory(historyDir);
