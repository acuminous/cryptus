#!/usr/bin/env node

const callbackApi = require('..').callbackApi;
const cryptus = callbackApi();
const timeout = setTimeout(() => {}, 5000);
const passphrase = process.argv[2];

if (!passphrase) {
  console.error('Please specify a passphrase');
  process.exit(1);
}

cryptus.createKey(passphrase, (err, key) => {
  if (err) throw err;
  console.log(key);
  clearTimeout(timeout);
});
