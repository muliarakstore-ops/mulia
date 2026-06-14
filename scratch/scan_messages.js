const fs = require('fs');
const path = require('path');

const messagesDir = 'C:\\Users\\ANGGA\\.gemini\\antigravity\\brain\\4ddd9b56-414c-4f6b-95c3-2f1413609e9c\\.system_generated\\messages';

function scan() {
  if (!fs.existsSync(messagesDir)) {
    console.log("Messages directory does not exist.");
    return;
  }

  const files = fs.readdirSync(messagesDir);
  console.log(`Scanning ${files.length} message files...`);

  let count = 0;
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(messagesDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('isLoggedInAdmin')) {
          count++;
          console.log(`Found isLoggedInAdmin in: ${file} (Size: ${content.length} bytes)`);
          // Let's print the first 500 chars
          console.log(content.substring(0, 500));
          console.log("-----------------------------------------");
        }
      } catch (e) {}
    }
  }
  console.log(`Total found: ${count}`);
}

scan();
