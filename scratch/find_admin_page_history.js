const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
console.log("Searching for src/app/admin/page.tsx history in:", historyDir);

function findHistory() {
  if (!fs.existsSync(historyDir)) {
    console.log("History directory does not exist.");
    return;
  }

  const subdirs = fs.readdirSync(historyDir);
  console.log(`Scanning ${subdirs.length} history folders...`);

  for (const subdir of subdirs) {
    const folderPath = path.join(historyDir, subdir);
    const entriesPath = path.join(folderPath, 'entries.json');
    
    if (fs.existsSync(entriesPath)) {
      try {
        const entriesContent = fs.readFileSync(entriesPath, 'utf8');
        const entries = JSON.parse(entriesContent);
        
        // entries.json has property "resource" which is the file URI
        if (entries.resource && entries.resource.includes('src/app/admin/page.tsx')) {
          console.log(`Found history folder for page.tsx: ${folderPath}`);
          console.log(`Entries:`, JSON.stringify(entries, null, 2));
          
          // Let's list the files in this history folder
          const files = fs.readdirSync(folderPath);
          console.log(`Files in folder:`, files);
          
          // Print detail of each file
          for (const f of files) {
            if (f !== 'entries.json') {
              const filePath = path.join(folderPath, f);
              const stat = fs.statSync(filePath);
              console.log(`  File: ${f}, Size: ${stat.size} bytes, Modified: ${stat.mtime}`);
              // Let's copy this file to scratch
              const targetName = `recovered_${stat.mtime.getTime()}_page.tsx`;
              fs.copyFileSync(filePath, path.join('scratch', targetName));
              console.log(`  Copied to scratch/${targetName}`);
            }
          }
        }
      } catch (e) {
        // Ignored
      }
    }
  }
}

findHistory();
