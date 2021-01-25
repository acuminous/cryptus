#!/usr/bin/env node

const callbackApi = require('..').callbackApi;
const cryptus = callbackApi();
const timeout = setTimeout(() => {}, 5000);
const key = process.argv[2];
const encrypted = process.argv[3];

if (!key) {
  console.error('Please specify a key');
  process.exit(1);
}

cryptus.decrypt(key, encrypted, (err, plain) => {
  if (err) throw err;
  console.log(plain);
  clearTimeout(timeout);
});
