const crypto = require("node:crypto");

const password = process.argv[2];

if (!password) {
  console.error('Användning: node mock-api/hash-password.js "mitt lösenord"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");

const hash = crypto.scryptSync(password, salt, 64).toString("hex");

console.log(`scrypt$${salt}$${hash}`);
