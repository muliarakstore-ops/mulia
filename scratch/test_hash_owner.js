const crypto = require('crypto');
function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}
console.log("owner789:", sha256("owner789"));
