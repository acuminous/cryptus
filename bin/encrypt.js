#!/usr/bin/env node

const callbackApi = require('..').callbackApi;
const cryptus = callbackApi();
const timeout = setTimeout(() => {}, 5000);
const key = process.argv[2];
const plain = process.argv[3];

if (!key) {
  console.error('Please specify a key');
  process.exit(1);
}

cryptus.encrypt(key, plain, (err, encrypted) => {
  if (err) throw err;
  console.log(encrypted);
  clearTimeout(timeout);
});
