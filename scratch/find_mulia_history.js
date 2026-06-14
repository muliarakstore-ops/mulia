const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');

function findHistory() {
  if (!fs.existsSync(historyDir)) {
    console.log("History directory does not exist.");
    return;
  }

  const subdirs = fs.readdirSync(historyDir);
  console.log(`Scanning ${subdirs.length} history folders...`);

  let count = 0;
  for (const subdir of subdirs) {
    const folderPath = path.join(historyDir, subdir);
    const entriesPath = path.join(folderPath, 'entries.json');
    
    if (fs.existsSync(entriesPath)) {
      try {
        const entriesContent = fs.readFileSync(entriesPath, 'utf8');
        const entries = JSON.parse(entriesContent);
        
        if (entries.resource && entries.resource.toLowerCase().includes('mulia')) {
          count++;
          console.log(`Folder: ${folderPath}, Resource: ${entries.resource}`);
        }
      } catch (e) {}
    }
  }
  console.log(`Total folders with 'mulia' in resource: ${count}`);
}

findHistory();
