const crypto = require('crypto');

function nodeSha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Emulate Web Crypto digest logic using Uint8Array / ArrayBuffer
const webCryptoSha256 = (message) => {
  const msgBuffer = Buffer.from(message, 'utf-8');
  const hash = crypto.createHash('sha256').update(msgBuffer).digest();
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

console.log("Node standard SHA-256 of admin123:", nodeSha256("admin123"));
console.log("WebCrypto emulated SHA-256 of admin123:", webCryptoSha256("admin123"));
